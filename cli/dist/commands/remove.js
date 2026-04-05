import * as fs from "node:fs";
import { getManifest, saveManifest, getInstallPath } from "../lib/config.js";
import { success, error } from "../lib/display.js";
export function remove(id) {
    const manifest = getManifest();
    if (!manifest.installed[id]) {
        error(`${id} is not installed.`);
        process.exit(1);
    }
    // Remove files
    const installDir = getInstallPath(id);
    if (fs.existsSync(installDir)) {
        fs.rmSync(installDir, { recursive: true });
    }
    // Remove from manifest
    delete manifest.installed[id];
    saveManifest(manifest);
    success(`Removed ${id}.`);
}
