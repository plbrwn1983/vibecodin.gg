# Contributing to vibecodin.gg

Thank you for contributing. This guide covers everything you need to know about submitting a skill or agent, choosing where it belongs, and what happens after you open a pull request.

---

## Table of Contents

1. [Before You Start](#before-you-start)
2. [Choosing a Hub and Sub-domain](#choosing-a-hub-and-sub-domain)
3. [Directory and Naming Conventions](#directory-and-naming-conventions)
4. [Creating Your Contribution](#creating-your-contribution)
5. [Schema Requirements](#schema-requirements)
6. [Writing Good Documentation](#writing-good-documentation)
7. [Opening a Pull Request](#opening-a-pull-request)
8. [Review Process](#review-process)
9. [After Your PR is Merged](#after-your-pr-is-merged)
10. [Updating Your Contribution](#updating-your-contribution)
11. [Proposing a New Sub-domain](#proposing-a-new-sub-domain)
12. [Contributor License Agreement](#contributor-license-agreement)

---

## Before You Start

- Read [docs/SCHEMA.md](docs/SCHEMA.md) — the schema is the contract and your contribution will not be merged without conforming to it
- Browse [docs/HUBS.md](docs/HUBS.md) — know which hub and sub-domain your contribution belongs to before you start
- Check for duplicates — search existing contributions to make sure you're not submitting something that already exists
- Test your contribution — every contribution must include at least one model in `tested_with` that you have personally validated it against

---

## Choosing a Hub and Sub-domain

Every contribution belongs to exactly one hub and one sub-domain. This is set by the platform on merge — you do not set it yourself. Instead, you indicate where your contribution belongs in your pull request description.

Use [docs/HUBS.md](docs/HUBS.md) to find the right fit. If your contribution touches multiple domains, choose the one that best represents the primary use case. Tags handle discoverability across related domains.

If no existing sub-domain fits your contribution, see [Proposing a New Sub-domain](#proposing-a-new-sub-domain).

---

## Directory and Naming Conventions

Each contribution lives in its own directory under `contributions/skills/` or `contributions/agents/`.

**Naming rules:**
- Lowercase only
- Words separated by hyphens
- Descriptive but concise — 2 to 5 words
- No special characters other than hyphens

```
# Good
contributions/skills/email-triage/
contributions/agents/marketing-copy-agent/
contributions/skills/invoice-extraction/

# Bad
contributions/skills/EmailTriage/
contributions/skills/my_cool_skill/
contributions/agents/agent1/
```

---

## Creating Your Contribution

**For a skill:**

```bash
cp -r contributions/skills/_template contributions/skills/your-skill-name
```

Then edit `contributions/skills/your-skill-name/README.md`.

**For an agent:**

```bash
cp -r contributions/agents/_template contributions/agents/your-agent-name
```

Then edit both `README.md` and `system-prompt.md` in your new directory.

---

## Schema Requirements

The `README.md` in your contribution directory must begin with a YAML frontmatter block containing all required fields. Submissions missing required fields will not be merged.

**Do not include platform fields** (`domain`, `subdomain`, `verified`, `verification_date`, `upvotes`, `usage_count`) in your frontmatter — these are set by the platform.

### Required for all contributions

```yaml
---
name: "Human-readable name of your contribution"
type: skill  # or agent
version: "1.0.0"
description: "One sentence describing what this does and when to use it. Max 280 characters."
author: "your-github-handle"
tags:
  - at-least-two-tags
  - max-ten-tags
license: MIT  # Must be a valid SPDX identifier
created: "2026-04-03"
updated: "2026-04-03"
tested_with:
  - claude-sonnet-4-6  # At least one entry required
---
```

### Additional fields for skills

```yaml
trigger: "Natural language description of when this skill should be invoked."

commands:  # Optional — omit if no explicit command interface
  - name: "command-name"
    description: "What this command does"

dependencies:
  note: "No dependencies required for this skill to function."  # Or describe what is needed
  tools: []       # e.g. [Read, Write, Bash]
  mcps: []        # e.g. [gmail, slack]
  skills: []      # e.g. [email-triage]
```

### Additional fields for agents

```yaml
model: "claude-sonnet-4-6"
system_prompt: "system-prompt.md"
memory: false

tools:
  builtin: []   # e.g. [Read, Write, WebSearch]
  mcps: []      # e.g. [gmail, slack]

behaviors:
  - "At least one behavioral constraint or rule for users to know about"

dependencies:
  note: "No dependencies required for this agent to function."
  skills: []
  mcps: []
```

See [docs/SCHEMA.md](docs/SCHEMA.md) for full field definitions and validation rules.

---

## Writing Good Documentation

The markdown body of your `README.md` (below the frontmatter) is what users read when they land on your contribution. It must include at minimum:

**Overview** — What does this do? Who is it for? What problem does it solve?

**Usage** — How do you invoke it? What inputs does it expect? What does it produce?

**Examples** — At least two realistic example prompts or use cases.

Optional but encouraged: Notes, caveats, known limitations, and version history.

---

## Opening a Pull Request

1. Fork the repository and create a branch named after your contribution (`skill/email-triage` or `agent/marketing-copy`)
2. Add your contribution directory with all required files
3. Open a pull request using the PR template
4. In the PR description, specify which hub and sub-domain your contribution belongs to
5. If you are proposing a new sub-domain, open a separate issue using the **New Sub-domain Proposal** template at the same time

Your contribution will be visible and reviewable immediately. The review process is typically completed within 48 hours.

---

## Review Process

Pull requests are reviewed by hub moderators — community members with verified contributions in the relevant domain. They check for:

- Schema compliance (all required fields present and valid)
- Quality of documentation (Overview and Usage sections complete)
- Accuracy of `tested_with` (is the model claimed plausible for this contribution?)
- Correct hub and sub-domain placement
- No duplication of existing contributions

Reviewers may request changes, suggest a different sub-domain, or approve as-is. You will be notified via GitHub.

---

## After Your PR is Merged

Once your pull request is approved and merged, the following happens automatically:

**Within minutes of merge:**

1. The sync pipeline parses your contribution's YAML frontmatter and creates a record in the platform database.
2. Your contribution files are uploaded to the platform's CDN.
3. The hub and sub-domain are assigned based on the label the moderator added during review.
4. Your contribution is live on vibecodin.gg — browsable, searchable, and installable via the assembler.

**What you'll see on the platform:**

Your contribution appears in its assigned hub and sub-domain with the following initial state: `verified: false`, `upvotes: 0`, `usage_count: 0`. It is fully visible and usable — unverified contributions are not hidden. The verified badge is earned through a separate moderator review (see below).

**Verification (separate from merge review):**

After your contribution is live, a hub moderator may verify it. Verification is a deeper review than the merge check — the moderator actually runs your skill or agent, tests it against at least one model, and evaluates documentation quality, domain accuracy, and safety. If it passes, your contribution receives the verified badge and the model used for testing is recorded. If the moderator finds issues, they'll leave feedback in your contribution's discussion thread. You are not blocked or penalized — you can address the feedback and request re-review at any time.

**Community interaction:**

Once live, other users can upvote your contribution, leave comments in the discussion thread, and install it via the assembler. You'll see upvote and usage counts grow over time. If someone reports an issue or asks a question in the discussion thread, responding is encouraged but not required.

---

## Updating Your Contribution

To update a contribution you've already submitted, open a new PR that modifies the files in your existing contribution directory. Bump the `version` field in your frontmatter and update the `updated` date.

When the update PR is merged, the sync pipeline overwrites your existing platform record and CDN files with the new version. Users who have already installed your contribution will see it available for update the next time they check.

Note that updating your contribution does **not** reset your verification status — but if the update changes the contribution's behavior significantly, a moderator may re-verify it. If re-verification fails, the verified badge may be removed until the issues are addressed.

---

## Proposing a New Sub-domain

If your contribution doesn't fit any existing sub-domain, you can propose a new one without being blocked.

**How it works:**
1. Submit your contribution PR normally
2. In the PR description, note that you are proposing a new sub-domain and name it
3. Open a separate issue using the **New Sub-domain Proposal** template
4. Your contribution goes live in a `[PENDING]` state immediately
5. Hub moderators review the proposal within 48 hours and either approve the new sub-domain, redirect your contribution to an existing one, or request clarification

You are never blocked waiting for a sub-domain decision. Your work is live while the proposal is reviewed.

**A sub-domain proposal must include:**
- Proposed name
- One-sentence description
- Why it is distinct from existing sub-domains in the hub
- At least one example contribution that would belong there (yours counts)

---

## Contributor License Agreement

By submitting a contribution to this repository, you agree to the following:

1. You are the original author of the contribution or have the right to submit it under the stated license.
2. You grant the repository and its platform a non-exclusive, royalty-free license to use, display, distribute, and incorporate your contribution into platform features — including but not limited to search, recommendations, and automated tool assembly.
3. Attribution will be maintained. Your name or GitHub handle will remain associated with your contribution wherever it is used.
4. You retain full rights to use and distribute your contribution independently outside of this repository.
5. The contribution does not infringe on any third-party intellectual property rights.

This agreement is non-exclusive — you keep ownership of your work. The platform gains the right to use it.
