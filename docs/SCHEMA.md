# Contribution Schema

## Philosophy

The schema is the foundation of the platform. Every skill and agent is a structured data record first — the social layer (domains, upvotes, verification, discussion) sits on top of that structure and enriches it, but does not define it. This means the underlying data is always queryable, composable, and machine-readable independent of the social interface.

There are two categories of fields:

- **Contributor fields** — provided by the person submitting the contribution
- **Platform fields** — managed by the platform; contributors do not set these

---

## Directory Structure

Each contribution lives in its own named directory. The directory name should be lowercase, hyphen-separated, and descriptive.

```
contributions/
  skills/
    my-skill-name/
      README.md          # Required — YAML frontmatter manifest + documentation
      [supporting files] # Optional — any files the skill references
  agents/
    my-agent-name/
      README.md          # Required — YAML frontmatter manifest + documentation
      system-prompt.md   # Required for agents — the agent's system prompt
      [supporting files] # Optional
```

The `README.md` file serves two purposes: the YAML frontmatter block at the top is the machine-readable manifest, and the markdown body below it is the human-readable documentation rendered on the platform.

---

## Shared Base Fields

Required for all contribution types.

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | yes | Human-readable name of the contribution |
| `type` | enum | yes | `skill` or `agent` |
| `version` | string | yes | Semantic version (e.g. `1.0.0`) |
| `description` | string | yes | One sentence describing what this does and when to use it. This is the primary field used for search and discovery. |
| `author` | string | yes | GitHub handle or full name of the contributor |
| `tags` | string[] | yes | Keywords for search and filtering. Minimum 2, maximum 10. |
| `license` | string | yes | SPDX license identifier (e.g. `MIT`, `Apache-2.0`, `CC-BY-4.0`) |
| `created` | date | yes | ISO 8601 date the contribution was first submitted (e.g. `2026-04-03`) |
| `updated` | date | yes | ISO 8601 date of the most recent update |
| `tested_with` | string[] | yes | Model IDs this has been validated against (e.g. `claude-sonnet-4-6`) |

---

## Skill Extension Fields

Required when `type: skill`. Added in addition to the shared base.

| Field | Type | Required | Description |
|---|---|---|---|
| `trigger` | string | yes | Natural language description of when this skill should be invoked. Used by routing systems and humans alike to determine relevance. |
| `commands` | object[] | no | Named invocation patterns. Each entry has a `name` and `description`. Omit if the skill has no explicit command interface. |
| `dependencies` | object | yes | Always present. Use the default value if there are no dependencies. |
| `dependencies.note` | string | yes | Plain language summary of dependency requirements. Default: `"No dependencies required for this skill to function."` |
| `dependencies.tools` | string[] | yes | Built-in tools required (e.g. `Read`, `Write`, `Bash`). Empty array if none. |
| `dependencies.mcps` | string[] | yes | MCP servers required. Empty array if none. |
| `dependencies.skills` | string[] | yes | Other skills this one depends on. Empty array if none. |

---

## Agent Extension Fields

Required when `type: agent`. Added in addition to the shared base.

| Field | Type | Required | Description |
|---|---|---|---|
| `model` | string | yes | Recommended model string (e.g. `claude-sonnet-4-6`) |
| `system_prompt` | string | yes | Filename of the system prompt within the contribution directory (e.g. `system-prompt.md`) |
| `memory` | boolean | yes | Whether the agent uses persistent memory |
| `tools` | object | yes | Tools the agent uses |
| `tools.builtin` | string[] | yes | Built-in tools used (e.g. `Read`, `Bash`, `WebSearch`). Empty array if none. |
| `tools.mcps` | string[] | yes | MCP servers used. Empty array if none. |
| `behaviors` | string[] | yes | Key behavioral rules or constraints worth flagging to users. Minimum 1. |
| `dependencies` | object | yes | Always present. Use the default value if there are no dependencies. |
| `dependencies.note` | string | yes | Plain language summary. Default: `"No dependencies required for this agent to function."` |
| `dependencies.skills` | string[] | yes | Skills this agent depends on. Empty array if none. |
| `dependencies.mcps` | string[] | yes | MCP servers required beyond those listed in `tools.mcps`. Empty array if none. |

---

## Platform Fields

These fields are set and managed by the platform. Contributors must not include them in submissions — they will be added automatically upon review and updated over time by the system.

| Field | Type | Description |
|---|---|---|
| `domain` | string | The hub this contribution belongs to (e.g. `marketing`, `legal`) |
| `subdomain` | string \| null | Optional sub-domain within the hub (e.g. `email`, `contracts`) |
| `verified` | boolean | Whether this contribution has been reviewed and endorsed by a domain moderator |
| `verification_date` | date \| null | ISO 8601 date of most recent verification |
| `verification_model` | string \| null | Model version used during platform verification testing |
| `upvotes` | integer | Community upvote count. Managed by the platform. |
| `usage_count` | integer | Number of times this contribution has been referenced by the assembler. Managed by the platform. |

---

## Full Examples

### Skill Example

```
contributions/skills/email-triage-skill/
  README.md
```

```markdown
---
name: "Email Triage Skill"
type: skill
version: "1.0.0"
description: "Reads a Gmail inbox and categorizes emails by priority, flagging those that require a reply and archiving those that do not."
author: "paulbrown"
tags:
  - email
  - gmail
  - triage
  - inbox
  - productivity
license: MIT
created: "2026-04-03"
updated: "2026-04-03"
tested_with:
  - claude-sonnet-4-6
  - claude-opus-4-6

trigger: "Use this skill when a user asks to clean up, triage, organize, or sort their inbox, or when they ask what emails need their attention."

commands:
  - name: "triage"
    description: "Scan the inbox and return a prioritized list of emails requiring action"
  - name: "summarize"
    description: "Summarize the current inbox state without making any changes"

dependencies:
  note: "Requires Gmail MCP access to read inbox contents."
  tools:
    - Read
  mcps:
    - gmail
  skills: []
---

# Email Triage Skill

## Overview
This skill scans a Gmail inbox and categorizes emails into action-required, informational, and archivable groups. It surfaces emails needing a reply and provides a prioritized list for the user to work through.

## Usage
Invoke this skill when the user asks to deal with their inbox. The skill will read unread and recent emails, apply priority logic, and return a structured triage report.

## Examples
- "Clean up my inbox"
- "What emails need my attention today?"
- "Triage my Gmail"

## Notes
This skill never archives, deletes, or sends emails without explicit user confirmation.
```

---

### Agent Example

```
contributions/agents/marketing-copy-agent/
  README.md
  system-prompt.md
```

```markdown
---
name: "Marketing Copy Agent"
type: agent
version: "1.0.0"
description: "Generates, refines, and A/B tests marketing copy for email campaigns, landing pages, and social posts based on brand guidelines and audience targeting."
author: "paulbrown"
tags:
  - marketing
  - copywriting
  - email
  - social media
  - A/B testing
license: MIT
created: "2026-04-03"
updated: "2026-04-03"
tested_with:
  - claude-sonnet-4-6

model: "claude-sonnet-4-6"
system_prompt: "system-prompt.md"
memory: false
tools:
  builtin:
    - Read
    - Write
    - WebSearch
  mcps: []

behaviors:
  - "Never publishes or sends content without explicit user approval"
  - "Always generates a minimum of two copy variants for comparison"
  - "Asks for brand guidelines and target audience before generating copy"

dependencies:
  note: "No dependencies required for this agent to function."
  skills: []
  mcps: []
---

# Marketing Copy Agent

## Overview
This agent assists marketing teams in generating and refining copy across channels. It produces multiple variants, supports A/B testing logic, and adapts tone and style to match provided brand guidelines.

## Usage
Provide the agent with the campaign goal, target audience, channel (email, landing page, social), and any brand guidelines. It will return structured copy variants ready for review.

## Examples
- "Write two subject line variants for our spring sale email targeting millennials"
- "Generate landing page copy for our new SaaS product aimed at HR managers"

## Notes
All output is for human review. The agent will not post, publish, or send anything autonomously.
```

---

## Validation Rules

The following rules are enforced on submission and will cause a contribution to be rejected if violated:

1. `type` must be exactly `skill` or `agent`
2. `version` must follow semantic versioning (`MAJOR.MINOR.PATCH`)
3. `description` must be a single sentence, no longer than 280 characters
4. `tags` must contain between 2 and 10 entries
5. `license` must be a valid SPDX identifier
6. `tested_with` must contain at least one entry
7. `dependencies` must always be present with all sub-fields populated
8. For `type: agent`, `system_prompt` must reference a file that exists in the contribution directory
9. Platform fields (`domain`, `subdomain`, `verified`, etc.) must not be included in submissions
10. The `README.md` body (below the frontmatter) must include at minimum an Overview and Usage section
