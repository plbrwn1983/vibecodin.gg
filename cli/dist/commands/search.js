import { searchContributions } from "../lib/api.js";
import { formatCard, error, info } from "../lib/display.js";
export async function search(query, options) {
    try {
        const results = await searchContributions({
            query,
            hub: options.hub,
            type: options.type,
            sort: options.sort,
            verified: options.verified,
        });
        if (results.length === 0) {
            info("No contributions found.");
            return;
        }
        console.log(`Found ${results.length} contribution${results.length === 1 ? "" : "s"}:\n`);
        for (const c of results) {
            console.log(formatCard(c));
            console.log();
        }
    }
    catch (err) {
        error(err.message);
        process.exit(1);
    }
}
