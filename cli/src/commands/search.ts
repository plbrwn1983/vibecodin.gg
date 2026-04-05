import { searchContributions, type SortKey } from "../lib/api.js";
import { formatCard, error, info } from "../lib/display.js";

export async function search(
  query: string | undefined,
  options: {
    hub?: string;
    type?: "skill" | "agent";
    sort?: SortKey;
    verified?: boolean;
  }
) {
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
  } catch (err) {
    error((err as Error).message);
    process.exit(1);
  }
}
