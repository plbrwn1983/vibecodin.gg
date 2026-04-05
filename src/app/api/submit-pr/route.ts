import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const REPO_OWNER = "plbrwn1983";
const REPO_NAME = "vibecodin.gg";
const BASE_BRANCH = "master";

async function githubFetch(
  path: string,
  token: string,
  options?: RequestInit
) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `GitHub API error: ${res.status}`);
  }
  return data;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Get the GitHub provider token
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const providerToken = session?.provider_token;
  if (!providerToken) {
    return NextResponse.json(
      {
        error:
          "GitHub token not available. Please sign out and sign back in to grant repository access.",
      },
      { status: 403 }
    );
  }

  const { type, dirName, readme, systemPrompt } = await request.json();

  if (!type || !dirName || !readme) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const handle =
    user.user_metadata?.user_name ??
    user.user_metadata?.preferred_username ??
    "unknown";

  try {
    // 1. Fork the repo (idempotent — returns existing fork if already forked)
    let fork;
    try {
      fork = await githubFetch(
        `/repos/${REPO_OWNER}/${REPO_NAME}/forks`,
        providerToken,
        { method: "POST", body: JSON.stringify({}) }
      );
    } catch {
      // Fork may already exist
      fork = await githubFetch(
        `/repos/${handle}/${REPO_NAME}`,
        providerToken
      );
    }

    const forkOwner = fork.owner?.login ?? handle;

    // 2. Get the base branch SHA
    const baseBranch = await githubFetch(
      `/repos/${forkOwner}/${REPO_NAME}/git/ref/heads/${BASE_BRANCH}`,
      providerToken
    );
    const baseSha = baseBranch.object.sha;

    // 3. Create a new branch
    const branchName = `contrib/${type}/${dirName}`;
    try {
      await githubFetch(
        `/repos/${forkOwner}/${REPO_NAME}/git/refs`,
        providerToken,
        {
          method: "POST",
          body: JSON.stringify({
            ref: `refs/heads/${branchName}`,
            sha: baseSha,
          }),
        }
      );
    } catch {
      // Branch may already exist — update it
      await githubFetch(
        `/repos/${forkOwner}/${REPO_NAME}/git/refs/heads/${branchName}`,
        providerToken,
        {
          method: "PATCH",
          body: JSON.stringify({ sha: baseSha, force: true }),
        }
      );
    }

    // 4. Create files via Contents API
    const basePath = `contributions/${type}s/${dirName}`;

    await githubFetch(
      `/repos/${forkOwner}/${REPO_NAME}/contents/${basePath}/README.md`,
      providerToken,
      {
        method: "PUT",
        body: JSON.stringify({
          message: `feat: add ${dirName} ${type}`,
          content: Buffer.from(readme).toString("base64"),
          branch: branchName,
        }),
      }
    );

    if (systemPrompt && type === "agent") {
      await githubFetch(
        `/repos/${forkOwner}/${REPO_NAME}/contents/${basePath}/system-prompt.md`,
        providerToken,
        {
          method: "PUT",
          body: JSON.stringify({
            message: `feat: add ${dirName} system prompt`,
            content: Buffer.from(systemPrompt).toString("base64"),
            branch: branchName,
          }),
        }
      );
    }

    // 5. Create the PR
    const pr = await githubFetch(
      `/repos/${REPO_OWNER}/${REPO_NAME}/pulls`,
      providerToken,
      {
        method: "POST",
        body: JSON.stringify({
          title: `feat: add ${dirName} (${type})`,
          body: `## New ${type === "skill" ? "Skill" : "Agent"}: ${dirName}\n\nSubmitted via vibecodin.gg submit form by @${handle}.\n\nPlease review and add the appropriate \`hub:{domain}/{subdomain}\` label.`,
          head: `${forkOwner}:${branchName}`,
          base: BASE_BRANCH,
        }),
      }
    );

    return NextResponse.json({ pr_url: pr.html_url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("PR creation failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
