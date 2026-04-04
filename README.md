# vibecodin.gg

An open source repository of skills and agents for LLMs, organized into business domain hubs. Built to be referenced, contributed to, and eventually assembled into tools by anyone.

---

## What This Is

vibecodin.gg is a community-maintained library of structured LLM skills and agents. Each contribution follows a defined schema and belongs to a specific business domain hub — making it easy to find what you need, trust that it works, and build on top of it.

The library is organized around twelve business domains common across most organizations:

| Hub | Description |
|---|---|
| Marketing | Content, campaigns, brand, analytics, and demand generation |
| Sales | Prospecting, pipeline, outreach, enablement, and account management |
| Finance & Accounting | Bookkeeping, reporting, budgeting, tax, and treasury |
| Human Resources | Recruiting, performance, learning, compliance, and wellness |
| Operations | Facilities, quality, continuity, automation, and vendor coordination |
| Customer Service | Support channels, ticketing, knowledge management, and feedback |
| Legal & Compliance | Contracts, regulatory, IP, data privacy, and governance |
| IT & Technology | Infrastructure, security, data management, and service delivery |
| Procurement | Vendor management, sourcing, purchasing, and supplier risk |
| Logistics | Receiving, warehousing, shipping, fulfillment, and last-mile delivery |
| Executive & Strategy | Corporate strategy, performance, M&A, risk, and board communications |
| Product Development | Requirements, design, roadmapping, QA, launch, and iteration |

Each hub contains sub-domains for more precise organization. Tags handle further granularity.

---

## How It Works

Every contribution is a directory containing a `README.md` with YAML frontmatter (the machine-readable manifest) and a markdown body (human-readable documentation). Agent contributions also include a `system-prompt.md` file.

The schema is the contract. The social layer — domain hubs, community verification, upvotes, and discussion — sits on top of that structured data. This means every contribution is queryable, composable, and usable independent of the platform interface.

See [docs/SCHEMA.md](docs/SCHEMA.md) for the full schema specification.

---

## Finding Contributions

Browse by hub and sub-domain:

```
contributions/
  skills/
  agents/
```

Or search by tag across the full library.

---

## Contributing

Contributions are welcome. The process is designed to be fast and low-friction.

**Quick version:**
1. Fork the repo
2. Copy the appropriate template from `contributions/skills/_template/` or `contributions/agents/_template/`
3. Rename the directory to match your contribution (lowercase, hyphen-separated)
4. Fill in all required schema fields in the `README.md` frontmatter
5. Write clear documentation in the `README.md` body
6. Open a pull request using the PR template

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide including how to choose the right hub and sub-domain, naming conventions, and the review process.

---

## Schema at a Glance

All contributions require these base fields:

```yaml
name: "Human-readable name"
type: skill  # or agent
version: "1.0.0"
description: "One sentence. This drives search and discovery."
author: "your-github-handle"
tags: [tag1, tag2]
license: MIT
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
tested_with: [claude-sonnet-4-6]
```

Skill and agent types each add their own required extension fields. See [docs/SCHEMA.md](docs/SCHEMA.md).

---

## Proposing a New Sub-domain

If your contribution doesn't fit any existing sub-domain, you can propose a new one. Submit your contribution with a `[PENDING]` prefix on the sub-domain and open an issue using the **New Sub-domain Proposal** template. Hub moderators review proposals within 48 hours. Your contribution goes live immediately in pending state — you are not blocked while the proposal is reviewed.

---

## License

This repository is licensed under [MIT](LICENSE). By contributing, you agree that your submission may be used by the platform and its users in accordance with the [Contributor License Agreement](CONTRIBUTING.md#contributor-license-agreement) included in the contribution guide.

---

## Docs

- [Schema specification](docs/SCHEMA.md)
- [Hub and sub-domain definitions](docs/HUBS.md)
- [Contribution guide](CONTRIBUTING.md)
- [Platform architecture](docs/ARCHITECTURE.md)
- [Moderation guide](docs/MODERATION.md)
