import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";

export interface ParsedContribution {
  id: string;
  type: "skill" | "agent";
  name: string;
  version: string;
  description: string;
  author: string;
  tags: string[];
  license: string;
  created: string;
  updated: string;
  tested_with: string[];
  skill_fields: Record<string, unknown> | null;
  agent_fields: Record<string, unknown> | null;
  raw_readme: string;
  files: { relativePath: string; absolutePath: string }[];
}

export interface ValidationError {
  id: string;
  errors: string[];
}

const REQUIRED_BASE_FIELDS = [
  "name",
  "type",
  "version",
  "description",
  "author",
  "tags",
  "license",
  "created",
  "updated",
  "tested_with",
];

const PLATFORM_FIELDS = [
  "domain",
  "subdomain",
  "verified",
  "verification_date",
  "verification_model",
  "upvotes",
  "usage_count",
];

export function validateContribution(
  id: string,
  data: Record<string, unknown>
): string[] {
  const errors: string[] = [];

  // Check required base fields
  for (const field of REQUIRED_BASE_FIELDS) {
    if (data[field] === undefined || data[field] === null) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Check type
  if (data.type && data.type !== "skill" && data.type !== "agent") {
    errors.push(`type must be "skill" or "agent", got "${data.type}"`);
  }

  // Check version format
  if (data.version && !/^\d+\.\d+\.\d+$/.test(data.version as string)) {
    errors.push(`version must follow semver (MAJOR.MINOR.PATCH), got "${data.version}"`);
  }

  // Check description length
  if (data.description && (data.description as string).length > 280) {
    errors.push(`description must be 280 characters or fewer (got ${(data.description as string).length})`);
  }

  // Check tags
  if (data.tags) {
    const tags = data.tags as string[];
    if (tags.length < 2) errors.push("tags must contain at least 2 entries");
    if (tags.length > 10) errors.push("tags must contain at most 10 entries");
  }

  // Check tested_with
  if (data.tested_with && (data.tested_with as string[]).length < 1) {
    errors.push("tested_with must contain at least one entry");
  }

  // Check platform fields are not included
  for (const field of PLATFORM_FIELDS) {
    if (data[field] !== undefined) {
      errors.push(`Platform field "${field}" must not be included in submissions`);
    }
  }

  // Skill-specific checks
  if (data.type === "skill") {
    if (!data.trigger) errors.push("Skills require a trigger field");
    if (!data.dependencies) errors.push("Skills require a dependencies field");
  }

  // Agent-specific checks
  if (data.type === "agent") {
    if (!data.model) errors.push("Agents require a model field");
    if (!data.system_prompt) errors.push("Agents require a system_prompt field");
    if (data.memory === undefined) errors.push("Agents require a memory field");
    if (!data.tools) errors.push("Agents require a tools field");
    if (!data.behaviors) errors.push("Agents require a behaviors field");
    if (!data.dependencies) errors.push("Agents require a dependencies field");
  }

  return errors;
}

export function parseContributionDir(
  dirPath: string,
  type: "skill" | "agent"
): { contribution: ParsedContribution; errors: string[] } | null {
  const readmePath = path.join(dirPath, "README.md");
  if (!fs.existsSync(readmePath)) return null;

  const id = path.basename(dirPath);
  const raw = fs.readFileSync(readmePath, "utf-8");
  const { data, content } = matter(raw);

  const errors = validateContribution(id, data);

  // Collect all files in the directory
  const files: { relativePath: string; absolutePath: string }[] = [];
  const entries = fs.readdirSync(dirPath);
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry);
    if (fs.statSync(fullPath).isFile()) {
      files.push({ relativePath: entry, absolutePath: fullPath });
    }
  }

  // Check agent system_prompt file exists
  if (type === "agent" && data.system_prompt) {
    const spPath = path.join(dirPath, data.system_prompt as string);
    if (!fs.existsSync(spPath)) {
      errors.push(`system_prompt file "${data.system_prompt}" not found in contribution directory`);
    }
  }

  // Build skill/agent fields
  let skill_fields = null;
  let agent_fields = null;

  if (data.type === "skill") {
    skill_fields = {
      trigger: data.trigger || "",
      commands: data.commands || [],
      dependencies: data.dependencies || {
        note: "No dependencies required for this skill to function.",
        tools: [],
        mcps: [],
        skills: [],
      },
    };
  } else if (data.type === "agent") {
    agent_fields = {
      model: data.model || "",
      system_prompt: data.system_prompt || "",
      memory: data.memory ?? false,
      tools: data.tools || { builtin: [], mcps: [] },
      behaviors: data.behaviors || [],
      dependencies: data.dependencies || {
        note: "No dependencies required for this agent to function.",
        skills: [],
        mcps: [],
      },
    };
  }

  return {
    contribution: {
      id,
      type: data.type as "skill" | "agent",
      name: data.name as string,
      version: data.version as string,
      description: data.description as string,
      author: data.author as string,
      tags: (data.tags as string[]) || [],
      license: data.license as string,
      created: data.created as string,
      updated: data.updated as string,
      tested_with: (data.tested_with as string[]) || [],
      skill_fields,
      agent_fields,
      raw_readme: content.trim(),
      files,
    },
    errors,
  };
}

export function parseAllContributions(repoRoot: string): {
  contributions: ParsedContribution[];
  validationErrors: ValidationError[];
} {
  const contributions: ParsedContribution[] = [];
  const validationErrors: ValidationError[] = [];

  for (const type of ["skills", "agents"] as const) {
    const contribType = type === "skills" ? "skill" : "agent";
    const baseDir = path.join(repoRoot, "contributions", type);
    if (!fs.existsSync(baseDir)) continue;

    const dirs = fs.readdirSync(baseDir);
    for (const dir of dirs) {
      if (dir === "_template") continue;
      const dirPath = path.join(baseDir, dir);
      if (!fs.statSync(dirPath).isDirectory()) continue;

      const result = parseContributionDir(dirPath, contribType);
      if (!result) continue;

      if (result.errors.length > 0) {
        validationErrors.push({ id: result.contribution.id, errors: result.errors });
      }

      contributions.push(result.contribution);
    }
  }

  return { contributions, validationErrors };
}

// CLI entry point
if (require.main === module) {
  const repoRoot = process.argv[2] || process.cwd();
  const { contributions, validationErrors } = parseAllContributions(repoRoot);

  if (validationErrors.length > 0) {
    console.error("Validation errors:");
    for (const { id, errors } of validationErrors) {
      console.error(`  ${id}:`);
      for (const err of errors) {
        console.error(`    - ${err}`);
      }
    }
  }

  console.log(`Parsed ${contributions.length} contributions`);
  console.log(
    `  Skills: ${contributions.filter((c) => c.type === "skill").length}`
  );
  console.log(
    `  Agents: ${contributions.filter((c) => c.type === "agent").length}`
  );

  if (validationErrors.length > 0) {
    process.exit(1);
  }
}
