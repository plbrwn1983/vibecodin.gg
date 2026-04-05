#!/usr/bin/env node
import { Command } from "commander";
import { authLogin, authLogout, authStatus } from "./commands/auth.js";
import { search } from "./commands/search.js";
import { showInfo } from "./commands/info.js";
import { install } from "./commands/install.js";
import { update } from "./commands/update.js";
import { list } from "./commands/list.js";
import { remove } from "./commands/remove.js";
const program = new Command();
program
    .name("vibecodin")
    .description("Search, install, and manage LLM skills and agents from vibecodin.gg")
    .version("0.1.0");
// Auth
const authCmd = program.command("auth").description("Authenticate via GitHub OAuth");
authCmd
    .option("--logout", "Sign out")
    .option("--status", "Show authentication status")
    .action((options) => {
    if (options.logout)
        return authLogout();
    if (options.status)
        return authStatus();
    return authLogin();
});
// Search
program
    .command("search [query]")
    .description("Search contributions by keyword")
    .option("--hub <domain>", "Filter by hub")
    .option("--type <type>", "Filter by type (skill or agent)")
    .option("--sort <sort>", "Sort order: upvotes, usage, recent, verified", "upvotes")
    .option("--verified", "Only show verified contributions")
    .action((query, options) => search(query, options));
// Info
program
    .command("info <id>")
    .description("Show full details for a contribution")
    .action((id) => showInfo(id));
// Install
program
    .command("install <id>")
    .description("Install a contribution")
    .action((id) => install(id));
// Update
program
    .command("update [id]")
    .description("Update installed contributions (all or specific)")
    .action((id) => update(id));
// List
program
    .command("list")
    .description("List installed contributions")
    .action(() => list());
// Remove
program
    .command("remove <id>")
    .description("Remove an installed contribution")
    .action((id) => remove(id));
program.parse();
