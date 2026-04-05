import * as http from "node:http";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY, saveAuth, getAuth, clearAuth } from "../lib/config.js";
import { success, error, info } from "../lib/display.js";

const CALLBACK_PORT = 54321;
const REDIRECT_URI = `http://localhost:${CALLBACK_PORT}/callback`;

export async function authLogin() {
  const existing = getAuth();
  if (existing) {
    info(`Already authenticated as ${existing.github_handle}.`);
    info('Run "vibecodin auth --logout" to sign out.');
    return;
  }

  console.log("Authenticating with GitHub via vibecodin.gg...\n");

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Generate the OAuth URL
  const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: REDIRECT_URI,
      skipBrowserRedirect: true,
    },
  });

  if (oauthError || !data.url) {
    error("Failed to start OAuth flow: " + (oauthError?.message ?? "no URL"));
    process.exit(1);
  }

  // Start local server to catch the callback
  return new Promise<void>((resolve) => {
    const server = http.createServer(async (req, res) => {
      const url = new URL(req.url!, `http://localhost:${CALLBACK_PORT}`);

      if (url.pathname === "/callback") {
        // Supabase redirects with a hash fragment containing the tokens
        // We need a page that sends the fragment to us via a query param
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
          <html>
          <body style="background:#09090b;color:#fafafa;font-family:system-ui;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;">
            <div style="text-align:center">
              <h2>Authenticating...</h2>
              <p style="color:#a1a1aa">You can close this tab after authentication completes.</p>
            </div>
            <script>
              const hash = window.location.hash.substring(1);
              if (hash) {
                fetch('/token?' + hash).then(() => {
                  document.querySelector('h2').textContent = '✓ Authenticated!';
                  document.querySelector('p').textContent = 'You can close this tab.';
                });
              } else {
                // Try query params (some flows use code)
                const params = window.location.search;
                if (params) {
                  fetch('/token' + params).then(() => {
                    document.querySelector('h2').textContent = '✓ Authenticated!';
                    document.querySelector('p').textContent = 'You can close this tab.';
                  });
                }
              }
            </script>
          </body>
          </html>
        `);
        return;
      }

      if (url.pathname === "/token") {
        const accessToken = url.searchParams.get("access_token");
        const refreshToken = url.searchParams.get("refresh_token");

        if (accessToken) {
          // Get user info
          const authedClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            global: { headers: { Authorization: `Bearer ${accessToken}` } },
          });
          const { data: userData } = await authedClient.auth.getUser(accessToken);

          const handle =
            userData?.user?.user_metadata?.user_name ??
            userData?.user?.user_metadata?.preferred_username ??
            "unknown";

          saveAuth({
            access_token: accessToken,
            refresh_token: refreshToken ?? "",
            user_id: userData?.user?.id ?? "",
            github_handle: handle,
          });

          res.writeHead(200);
          res.end("ok");

          success(`Authenticated as ${handle}`);
          server.close();
          resolve();
          return;
        }

        // Handle code exchange flow
        const code = url.searchParams.get("code");
        if (code) {
          const { data: session, error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError || !session.session) {
            error("Code exchange failed: " + (exchangeError?.message ?? "no session"));
            res.writeHead(400);
            res.end("error");
            server.close();
            resolve();
            return;
          }

          const handle =
            session.user?.user_metadata?.user_name ??
            session.user?.user_metadata?.preferred_username ??
            "unknown";

          saveAuth({
            access_token: session.session.access_token,
            refresh_token: session.session.refresh_token,
            user_id: session.user.id,
            github_handle: handle,
          });

          res.writeHead(200);
          res.end("ok");

          success(`Authenticated as ${handle}`);
          server.close();
          resolve();
          return;
        }

        res.writeHead(400);
        res.end("missing token");
        return;
      }

      res.writeHead(404);
      res.end("not found");
    });

    server.listen(CALLBACK_PORT, () => {
      console.log(`Opening browser for GitHub authentication...`);
      info(`If the browser doesn't open, visit:\n  ${data.url}\n`);

      // Open browser
      import("open").then((mod) => mod.default(data.url!));
    });

    // Timeout after 2 minutes
    setTimeout(() => {
      error("Authentication timed out.");
      server.close();
      resolve();
    }, 120_000);
  });
}

export function authLogout() {
  clearAuth();
  success("Signed out.");
}

export function authStatus() {
  const auth = getAuth();
  if (auth) {
    success(`Authenticated as ${auth.github_handle}`);
  } else {
    info('Not authenticated. Run "vibecodin auth" to sign in.');
  }
}
