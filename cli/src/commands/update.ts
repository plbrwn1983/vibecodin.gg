import { getContribution, getContributionFiles, downloadFile, recordInstall } from "../lib/api.js";
import { getAuth, getManifest, saveManifest, ensureInstallDir } from "../lib/config.js";
import { success, error, warn, info } from "../lib/display.js";
import * as fs from "node:fs";
import * as path from "node:path";

export async function update(id?: string) {
  const auth = getAuth();
  if (!auth) {
    error('Authentication required. Run "vibecodin auth" first.');
    process.exit(1);
  }

  const manifest = getManifest();
  const entries = id
    ? { [id]: manifest.installed[id] }
    : manifest.installed;

  if (id && !manifest.installed[id]) {
    error(`${id} is not installed.`);
    process.exit(1);
  }

  const ids = Object.keys(entries);
  if (ids.length === 0) {
    info("No contributions installed.");
    return;
  }

  info(`Checking ${ids.length} contribution${ids.length === 1 ? "" : "s"} for updates...\n`);

  let updatedCount = 0;

  for (const contribId of ids) {
    const entry = manifest.installed[contribId];
    const c = await getContribution(contribId);

    if (!c) {
      warn(`${contribId} — not found on platform (may have been removed)`);
      continue;
    }

    if (c.version === entry.version) {
      info(`${contribId} v${entry.version} — up to date`);
      continue;
    }

    // Update
    info(`${contribId} v${entry.version} → v${c.version}`);
    const files = await getContributionFiles(contribId, c.type);
    const installDir = ensureInstallDir(contribId);

    for (const file of files) {
      const content = await downloadFile(file.url);
      fs.writeFileSync(path.join(installDir, file.name), content);
    }

    manifest.installed[contribId] = {
      ...entry,
      version: c.version,
      updated_at: new Date().toISOString(),
    };

    await recordInstall(contribId, c.version);
    updatedCount++;
  }

  saveManifest(manifest);

  if (updatedCount > 0) {
    success(`Updated ${updatedCount} contribution${updatedCount === 1 ? "" : "s"}.`);
  } else {
    success("Everything is up to date.");
  }
}
