import { getManifest } from "../lib/config.js";
import { formatInstalled, info } from "../lib/display.js";

export function list() {
  const manifest = getManifest();
  const entries = Object.entries(manifest.installed);

  if (entries.length === 0) {
    info("No contributions installed.");
    info('Run "vibecodin search <query>" to find contributions.');
    return;
  }

  console.log(`${entries.length} contribution${entries.length === 1 ? "" : "s"} installed:\n`);
  for (const [id, entry] of entries) {
    console.log(formatInstalled(id, entry));
  }
}
