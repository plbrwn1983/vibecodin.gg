import * as fs from "fs";
import * as path from "path";
import { parseContributionDir, validateContribution } from "./parse-contributions";
import matter from "gray-matter";

// Levenshtein distance for near-duplicate detection
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }

  return dp[m][n];
}

function similarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(a, b) / maxLen;
}

function findNearDuplicates(
  name: string,
  type: "skill" | "agent",
  repoRoot: string
): string[] {
  const baseDir = path.join(repoRoot, "contributions", `${type}s`);
  if (!fs.existsSync(baseDir)) return [];

  const existing = fs
    .readdirSync(baseDir)
    .filter((d) => d !== "_template" && d !== name);

  const matches: string[] = [];
  for (const dir of existing) {
    // Levenshtein similarity
    const sim = similarity(name, dir);
    if (sim >= 0.75) {
      matches.push(dir);
      continue;
    }

    // Substring matching
    if (name.includes(dir) || dir.includes(name)) {
      matches.push(dir);
    }
  }

  return matches;
}

async function validate() {
  const repoRoot = process.argv[2] || process.cwd();
  const changedFiles = (process.argv[3] || "").split("\n").filter(Boolean);

  // Find which contribution directories were changed
  const changedContribs = new Set<string>();
  for (const file of changedFiles) {
    const match = file.match(
      /^contributions\/(skills|agents)\/([^/]+)\//
    );
    if (match) {
      changedContribs.add(`${match[1]}/${match[2]}`);
    }
  }

  if (changedContribs.size === 0) {
    console.log("No contribution files changed.");
    process.exit(0);
  }

  let hasErrors = false;
  const duplicateWarnings: string[] = [];

  for (const contribPath of changedContribs) {
    const [typeDir, id] = contribPath.split("/");
    const type = typeDir === "skills" ? "skill" : "agent";
    const dirPath = path.join(repoRoot, "contributions", typeDir, id);

    console.log(`\nValidating ${contribPath}...`);

    const result = parseContributionDir(dirPath, type as "skill" | "agent");
    if (!result) {
      console.error(`  ERROR: No README.md found in ${contribPath}`);
      hasErrors = true;
      continue;
    }

    if (result.errors.length > 0) {
      hasErrors = true;
      for (const err of result.errors) {
        console.error(`  ERROR: ${err}`);
      }
    } else {
      console.log("  Schema validation passed.");
    }

    // Near-duplicate detection
    const duplicates = findNearDuplicates(id, type as "skill" | "agent", repoRoot);
    if (duplicates.length > 0) {
      const msg = `Note: a contribution named \`${duplicates.join("`, `")}\` already exists in ${typeDir}/. Please confirm this is not a duplicate.`;
      duplicateWarnings.push(msg);
      console.log(`  WARNING: ${msg}`);
    }
  }

  // Output for GitHub Actions
  if (duplicateWarnings.length > 0) {
    const body = duplicateWarnings.join("\n\n");
    // Write to file for the workflow to pick up as a PR comment
    fs.writeFileSync("/tmp/pr-comment.md", body);
  }

  if (hasErrors) {
    console.error("\nValidation failed.");
    process.exit(1);
  }

  console.log("\nAll validations passed.");
}

validate().catch((err) => {
  console.error("Validation failed:", err);
  process.exit(1);
});
