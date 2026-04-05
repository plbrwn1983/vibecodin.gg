import * as fs from "node:fs";
import * as path from "node:path";
import { getContribution, getContributionFiles, downloadFile, recordInstall, } from "../lib/api.js";
import { getAuth, getManifest, saveManifest, ensureInstallDir, } from "../lib/config.js";
import { success, error, warn, info } from "../lib/display.js";
export async function install(idArg) {
    // Check auth
    const auth = getAuth();
    if (!auth) {
        error('Authentication required. Run "vibecodin auth" first.');
        process.exit(1);
    }
    // Parse id@version (version pinning noted as future consideration)
    const id = idArg.split("@")[0];
    // Resolve contribution
    info(`Resolving ${id}...`);
    const c = await getContribution(id);
    if (!c) {
        error(`Contribution "${id}" not found.`);
        process.exit(1);
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
    // Fetch files from storage
    info(`Fetching files...`);
    const files = await getContributionFiles(id, c.type);
    if (files.length === 0) {
        error("No files found in storage for this contribution.");
        info("The contribution may not have been synced yet.");
        process.exit(1);
    }
    // Write files locally
    const installDir = ensureInstallDir(id);
    for (const file of files) {
        const content = await downloadFile(file.url);
        const filePath = path.join(installDir, file.name);
        fs.writeFileSync(filePath, content);
    }
    // Check for dependency warnings
    if (c.skill_fields) {
        const deps = c.skill_fields.dependencies;
        if (deps?.skills && Array.isArray(deps.skills) && deps.skills.length > 0) {
            warn("This skill has dependencies:");
            for (const dep of deps.skills) {
                const installed = manifest.installed[dep];
                if (installed) {
                    info(`  ✓ ${dep} (installed)`);
                }
                else {
                    warn(`  ✗ ${dep} (not installed — run "vibecodin install ${dep}")`);
                }
            }
        }
    }
    if (c.agent_fields) {
        const deps = c.agent_fields.dependencies;
        if (deps?.skills && Array.isArray(deps.skills) && deps.skills.length > 0) {
            warn("This agent depends on skills:");
            for (const dep of deps.skills) {
                const installed = manifest.installed[dep];
                if (installed) {
                    info(`  ✓ ${dep} (installed)`);
                }
                else {
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
    // Record install in Supabase
    await recordInstall(id, c.version);
    success(`Installed ${c.name} (${c.type}) v${c.version} → .claude/skills/${id}/`);
    info(`${files.length} file${files.length === 1 ? "" : "s"} written.`);
}
