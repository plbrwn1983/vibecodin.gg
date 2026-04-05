// ANSI colors
const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const blue = (s) => `\x1b[34m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const cyan = (s) => `\x1b[36m${s}\x1b[0m`;
export function formatCard(c) {
    const verified = c.verified ? green("✓ verified") : "";
    const hub = c.subdomain
        ? dim(`hub:${c.domain}/${c.subdomain}`)
        : dim(`hub:${c.domain}`);
    const lines = [
        `${bold(c.id)} ${dim(`(${c.type})`)} ${cyan(`v${c.version}`)}`,
        `  ${c.description}`,
        `  ⬆ ${c.upvotes}  📦 ${c.usage_count}  ${verified}  ${hub}`,
        `  ${dim(`by: ${c.author}`)}`,
    ];
    return lines.join("\n");
}
export function formatDetail(c) {
    const verified = c.verified
        ? green(`✓ Verified (${c.verification_date}, model: ${c.verification_model})`)
        : yellow("✗ Not verified");
    const lines = [
        bold(`${c.name} (${c.id})`),
        `${dim(c.type)} · ${cyan(`v${c.version}`)} · ${c.license}`,
        "",
        c.description,
        "",
        `⬆ ${c.upvotes} upvotes  📦 ${c.usage_count} installs`,
        `Author: ${blue(c.author)}`,
        `Status: ${verified}`,
        `Hub: ${c.domain}${c.subdomain ? `/${c.subdomain}` : ""}`,
        `Tags: ${c.tags.join(", ")}`,
        `Tested with: ${c.tested_with.join(", ")}`,
        `Created: ${c.created}  Updated: ${c.updated}`,
    ];
    if (c.skill_fields) {
        const sf = c.skill_fields;
        lines.push("", bold("Skill Details:"));
        if (sf.trigger)
            lines.push(`  Trigger: ${sf.trigger}`);
        if (sf.commands && Array.isArray(sf.commands) && sf.commands.length > 0) {
            lines.push("  Commands:");
            for (const cmd of sf.commands) {
                lines.push(`    ${cyan(cmd.name)} — ${cmd.description}`);
            }
        }
    }
    if (c.agent_fields) {
        const af = c.agent_fields;
        lines.push("", bold("Agent Details:"));
        if (af.model)
            lines.push(`  Model: ${af.model}`);
        if (af.memory !== undefined)
            lines.push(`  Memory: ${af.memory ? "Yes" : "No"}`);
        if (af.behaviors && Array.isArray(af.behaviors)) {
            lines.push("  Behaviors:");
            for (const b of af.behaviors) {
                lines.push(`    • ${b}`);
            }
        }
    }
    return lines.join("\n");
}
export function formatInstalled(id, entry) {
    return `${bold(id)} ${dim(`(${entry.type})`)} ${cyan(`v${entry.version}`)}  ${dim(`installed: ${entry.installed_at.split("T")[0]}`)}`;
}
export function success(msg) {
    console.log(green(`✓ ${msg}`));
}
export function error(msg) {
    console.error(`\x1b[31m✗ ${msg}\x1b[0m`);
}
export function warn(msg) {
    console.log(yellow(`⚠ ${msg}`));
}
export function info(msg) {
    console.log(dim(msg));
}
