import type { Contribution } from "./api.js";
import type { ManifestEntry } from "./config.js";

// ANSI colors
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;
const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;
const blue = (s: string) => `\x1b[34m${s}\x1b[0m`;
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;
const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;

export function formatCard(c: Contribution): string {
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

export function formatDetail(c: Contribution): string {
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
    const sf = c.skill_fields as Record<string, unknown>;
    lines.push("", bold("Skill Details:"));
    if (sf.trigger) lines.push(`  Trigger: ${sf.trigger}`);
    if (sf.commands && Array.isArray(sf.commands) && sf.commands.length > 0) {
      lines.push("  Commands:");
      for (const cmd of sf.commands as { name: string; description: string }[]) {
        lines.push(`    ${cyan(cmd.name)} — ${cmd.description}`);
      }
    }
  }

  if (c.agent_fields) {
    const af = c.agent_fields as Record<string, unknown>;
    lines.push("", bold("Agent Details:"));
    if (af.model) lines.push(`  Model: ${af.model}`);
    if (af.memory !== undefined) lines.push(`  Memory: ${af.memory ? "Yes" : "No"}`);
    if (af.behaviors && Array.isArray(af.behaviors)) {
      lines.push("  Behaviors:");
      for (const b of af.behaviors as string[]) {
        lines.push(`    • ${b}`);
      }
    }
  }

  return lines.join("\n");
}

export function formatInstalled(
  id: string,
  entry: ManifestEntry
): string {
  return `${bold(id)} ${dim(`(${entry.type})`)} ${cyan(`v${entry.version}`)}  ${dim(`installed: ${entry.installed_at.split("T")[0]}`)}`;
}

export function success(msg: string) {
  console.log(green(`✓ ${msg}`));
}

export function error(msg: string) {
  console.error(`\x1b[31m✗ ${msg}\x1b[0m`);
}

export function warn(msg: string) {
  console.log(yellow(`⚠ ${msg}`));
}

export function info(msg: string) {
  console.log(dim(msg));
}
