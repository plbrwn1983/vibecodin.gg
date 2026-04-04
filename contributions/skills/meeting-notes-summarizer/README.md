---
name: "Meeting Notes Summarizer"
type: skill
version: "1.0.0"
description: "Transforms raw meeting notes into structured summaries with decisions, action items, and executive overview."
author: "vibecodin.gg"
tags:
  - meetings
  - summarization
  - workflow-automation
  - operations
  - project-management
  - process-documentation
  - decision-tracking

license: MIT
created: "2026-04-04"
updated: "2026-04-04"
tested_with:
  - claude-sonnet-4-6

trigger: "Invoke when you need to organize raw meeting notes into actionable documentation. Useful after team calls, planning sessions, retrospectives, or decision-making meetings."

commands:
  - name: "summarize"
    description: "Parse meeting notes and generate a complete structured summary with metadata, decisions, action items, and executive summary."
  - name: "extract-actions"
    description: "Extract only action items from meeting notes, with assigned owners and due dates if mentioned."

dependencies:
  note: "No dependencies required for this skill to function."
  tools: []
  mcps: []
  skills: []
---

## Overview

The Meeting Notes Summarizer transforms unstructured meeting notes into clean, organized documentation. Whether notes are bullet points, paragraph form, or a stream of thoughts from a transcript, this skill structures them into:

- **Meeting Metadata**: Date, attendees, and purpose
- **Key Decisions**: Outcomes and conclusions reached
- **Action Items**: Tasks with owners and due dates (when available)
- **Open Questions & Parking Lot**: Unresolved topics for future discussion
- **Executive Summary**: One-paragraph recap of the meeting's significance

Output is formatted for immediate sharing, copy-paste ready for documents, Slack, email, or your team's tracking system.

## Usage

1. Copy and paste raw meeting notes into the input
2. Run the `summarize` command
3. Receive structured output in Markdown format
4. Review for accuracy and adjust if needed
5. Copy sections into your team's documentation

For extracting only action items (without full summary), use the `extract-actions` command.

## Examples

### Example 1: Product Team Standup

**Raw Input:**
```
Talked with Sarah, James, and Mike today about Q2 roadmap. Sarah said design
mockups for the new dashboard are almost done - maybe by Friday? James is concerned
about performance on the search feature. We decided to do a spike on that next
week. Mike needs to coordinate with backend team on API changes. Set a follow-up
meeting for April 10th to review the mockups. Also discussed reducing technical
debt in auth module but didn't decide anything yet - needs more research.
```

**Structured Output:**
```
# Meeting Summary

## Metadata
- **Date**: April 4, 2026
- **Attendees**: Sarah, James, Mike, [Your Name]
- **Purpose**: Q2 Roadmap Planning & Feature Discussion

## Key Decisions
- Approved design spike on search feature performance optimization (week of April 7)
- Scheduled design mockup review for April 10th
- Deferred technical debt assessment for auth module pending research

## Action Items
- [ ] Sarah: Complete dashboard mockup designs (Due: Friday, April 6)
- [ ] James: Lead performance spike on search feature (Due: April 12)
- [ ] Mike: Coordinate with backend team on API changes (Due: April 10)
- [ ] [Unassigned]: Research technical debt in auth module (Due: April 10)

## Open Questions & Parking Lot
- What is the acceptable performance threshold for search feature?
- Should auth module redesign be part of Q2 or Q3?
- How will API changes impact existing integrations?

## Executive Summary
The product team aligned on Q2 priorities, approving a performance optimization spike for the search feature and scheduling design mockup review. Dashboard design is on track for Friday delivery. Backend API coordination is in progress, and technical debt assessment has been deferred pending research.
```

### Example 2: Executive Steering Committee

**Raw Input:**
```
Finance, Product, and Ops leads met to discuss budget reallocation.
Numbers from FY26 show we're 15% over budget in cloud infrastructure.
Linda from Finance suggested moving $200k from marketing to ops/infra.
Product pushback - said marketing spend is driving customer acquisition.
We compromised: cut $100k from non-essential vendor contracts, add $75k
from contingency to cloud. Linda needs details on what's driving the overspend
by April 8. Ops (Tom) will propose cost optimization measures by end of week.
Carlos mentioned security audit coming next month - Tom needs to budget for that too.
```

**Structured Output:**
```
# Meeting Summary

## Metadata
- **Date**: April 4, 2026
- **Attendees**: Linda (Finance), [Product Lead], Tom (Operations), Carlos (Security)
- **Purpose**: FY26 Budget Reallocation Discussion

## Key Decisions
- Reallocated $100k from non-essential vendor contracts
- Added $75k from contingency budget to cloud infrastructure
- Rejected full $200k reallocation from marketing to operations
- Approved security audit budget accommodation

## Action Items
- [ ] Linda: Provide detailed cloud infrastructure cost analysis (Due: April 8)
- [ ] Tom: Propose cloud cost optimization measures (Due: April 10)
- [ ] Tom: Budget for upcoming security audit (Due: April 10)
- [ ] Product Lead: Provide metrics on marketing ROI (Due: April 10)

## Open Questions & Parking Lot
- What is driving the 15% infrastructure cost overspend? (Infrastructure type, usage patterns, pricing changes?)
- What specific cost optimization measures are viable without impacting service reliability?
- What is the estimated cost of the security audit?
- Will additional budget adjustments be needed for Q3?

## Executive Summary
The leadership team addressed FY26 budget overruns in cloud infrastructure (15% over budget) by reallocating $100k from vendor contracts and adding $75k from contingency funds. Finance will provide detailed cost analysis by April 8th, while Operations will develop optimization measures by week's end. Marketing spend was retained to maintain customer acquisition momentum.
```

### Example 3: Engineering Retrospective

**Raw Input:**
```
Retro on the last sprint. Good: we shipped the API redesign on time.
Bad: deployment took 4 hours because of database migration issues.
Ugly: communication between frontend and backend was spotty on the
third-party integration. What went well: pair programming on the auth
refactor. What didn't: some devs didn't know about the API changes until
merge. Lisa suggested better async documentation. Dev lead (Alex) is
going to create a pre-deployment checklist. We also need to start doing
architectural reviews before major changes - Lisa volunteered to facilitate.
Next sprint focus: reduce deployment friction, improve docs.
```

**Structured Output:**
```
# Meeting Summary

## Metadata
- **Date**: April 4, 2026
- **Attendees**: Engineering team (including Lisa, Alex [Dev Lead])
- **Purpose**: Sprint Retrospective & Process Improvement

## Key Decisions
- Implement pre-deployment checklist (starting next sprint)
- Institute architectural review process for major changes
- Prioritize documentation improvements and deployment automation
- Focus next sprint on deployment friction reduction

## Action Items
- [ ] Alex: Create pre-deployment checklist (Due: April 7)
- [ ] Lisa: Facilitate and design architectural review process (Due: April 11)
- [ ] Team: Improve async documentation for API changes (Due: ongoing, next sprint)
- [ ] Engineering Lead: Plan deployment automation improvements (Due: April 12)

## Open Questions & Parking Lot
- What should be included in the pre-deployment checklist?
- How should architectural reviews be scheduled without blocking development?
- What documentation format works best for async communication?
- Can we automate database migrations to reduce deployment time?

## Executive Summary
The engineering team identified deployment processes as the primary friction point (4-hour deployment due to database migration issues) and communication gaps around API changes as secondary concerns. The team will introduce pre-deployment checklists and architectural review processes, with a focus on reducing deployment friction through documentation and automation improvements in the coming sprint.
```

## Notes

- **Flexible Input**: Paste notes in any format—bullet points, paragraph form, transcript excerpts, or mixed styles. The skill handles all formats.

- **Metadata Inference**: If date, attendees, or purpose aren't explicitly mentioned, the skill will infer or mark them as "[To be confirmed]" for you to fill in.

- **Due Dates**: If specific dates aren't mentioned, the skill attempts to infer reasonable timelines based on urgency language ("ASAP", "by end of week", "next sprint"). Review and adjust as needed.

- **Ownership Clarity**: If action items lack clear owners, the skill marks them as `[Unassigned]` and includes notes about who should be assigned.

- **Parking Lot Items**: Questions and topics deferred for later discussion are separated into "Open Questions & Parking Lot" to avoid decision fatigue while preserving context.

- **Executive Summary Length**: Intentionally kept to one paragraph for busy stakeholders who need the headline without deep dive.

- **Copy-Paste Ready**: Output uses standard Markdown, making it easy to paste into Docs, Notion, email, or Slack.

- **Iterative Refinement**: If the first pass misses nuance, provide feedback and re-run—specify what's missing or incorrect, and the skill will refine the output.
