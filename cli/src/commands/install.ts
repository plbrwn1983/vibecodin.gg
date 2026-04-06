import * as fs from "node:fs";
import * as path from "node:path";
import {
  getContribution,
  getContributionFiles,
  downloadFile,
  recordInstall,
  checkPurchaseAccess,
} from "../lib/api.js";
import {
  getAuth,
  getManifest,
  saveManifest,
  ensureInstallDir,
  SUPABASE_URL,
} from "../lib/config.js";
import { success, error, warn, info } from "../lib/display.js";

export async function install(idArg: string) {
  const auth = getAuth();

  // Parse id@version (version pinning noted as future consideration)
  const id = idArg.split("@")[0];

  // Resolve contribution
  info(`Resolving ${id}...`);
  const c = await getContribution(id);
  if (!c) {
    error(`Contribution "${id}" not found.`);
    process.exit(1);
  }

  // Check purchase access for premium contributions
  if (c.pricing_model !== "free") {
    if (!auth) {
      error("This is a premium contribution. Please log in first:");
      info('  vibecodin auth');
      info(`\nThen purchase at: https://vibecodin.gg/c/${id}`);
      process.exit(1);
    }

    info("Checking purchase access...");
    const hasAccess = await checkPurchaseAccess(id);
    if (!hasAccess) {
      const formatPrice = (cents: number) =>
        `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;

      error(`This is a premium ${c.type}. Purchase required to install.`);
      if (c.price_one_time) {
        info(`  One-time: ${formatPrice(c.price_one_time)}`);
      }
      if (c.price_subscription) {
        info(`  Subscription: ${formatPrice(c.price_subscription)}/mo`);
      }
      info(`\nPurchase at: https://vibecodin.gg/c/${id}`);
      process.exit(1);
    }
    success("Purchase verified.");
  }

  // Check manifest for conflicts
  const manifest = getManifest();
  if (manifest.installed[id]) {
    const existing = manifest.installed[id];
    if (existing.version === c.version) {
      warn(`${id} v${c.version} is already installed.`);
      info('Run "vibecodin update" to check for updates.');
      return;
    }
    warn(`${id} v${existing.version} is installed. Updating to v${c.version}...`);
  }

  // Fetch files — try Storage first, fall back to web API download
  info(`Fetching files...`);
  let files = await getContributionFiles(id, c.type);
  let downloadedFromApi = false;

  if (files.length === 0) {
    // Fallback: download reconstructed README from the web API
    info("Storage files not available, downloading from platform...");
    try {
      const res = await fetch(`https://vibecodin.gg/api/download/${id}`);
      if (res.ok) {
        const content = Buffer.from(await res.arrayBuffer());
        const installDir = ensureInstallDir(id);
        fs.writeFileSync(path.join(installDir, "README.md"), content);
        downloadedFromApi = true;
      }
    } catch {
      // Fall through to error below
    }

    if (!downloadedFromApi) {
      error("No files available for this contribution.");
      process.exit(1);
    }
  }

  // Write files from Storage (if not already written via API fallback)
  if (!downloadedFromApi) {
    const installDir = ensureInstallDir(id);
    for (const file of files) {
      const content = await downloadFile(file.url);
      const filePath = path.join(installDir, file.name);
      fs.writeFileSync(filePath, content);
    }
  }

  // Check for dependency warnings
  if (c.skill_fields) {
    const deps = c.skill_fields.dependencies as Record<string, unknown> | undefined;
    if (deps?.skills && Array.isArray(deps.skills) && deps.skills.length > 0) {
      warn("This skill has dependencies:");
      for (const dep of deps.skills as string[]) {
        const installed = manifest.installed[dep];
        if (installed) {
          info(`  ✓ ${dep} (installed)`);
        } else {
          warn(`  ✗ ${dep} (not installed — run "vibecodin install ${dep}")`);
        }
      }
    }
  }

  if (c.agent_fields) {
    const deps = c.agent_fields.dependencies as Record<string, unknown> | undefined;
    if (deps?.skills && Array.isArray(deps.skills) && deps.skills.length > 0) {
      warn("This agent depends on skills:");
      for (const dep of deps.skills as string[]) {
        const installed = manifest.installed[dep];
        if (installed) {
          info(`  ✓ ${dep} (installed)`);
        } else {
          warn(`  ✗ ${dep} (not installed — run "vibecodin install ${dep}")`);
        }
      }
    }
  }

  // Update manifest
  const now = new Date().toISOString();
  manifest.installed[id] = {
    type: c.type,
    version: c.version,
    installed_at: manifest.installed[id]?.installed_at ?? now,
    updated_at: now,
    install_path: `.claude/skills/${id}/`,
  };
  saveManifest(manifest);

  // Record install in Supabase (only if authenticated)
  if (auth) {
    await recordInstall(id, c.version);
  }

  const fileCount = downloadedFromApi ? 1 : files.length;
  success(
    `Installed ${c.name} (${c.type}) v${c.version} → .claude/skills/${id}/`
  );
  info(`${fileCount} file${fileCount === 1 ? "" : "s"} written.`);
}
