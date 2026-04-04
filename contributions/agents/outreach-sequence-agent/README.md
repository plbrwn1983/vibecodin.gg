---
name: "Outreach Sequence Agent"
type: agent
version: "1.0.0"
description: "Generates personalized multi-touch sales outreach sequences with email drafts, LinkedIn messaging, and breakup copy — no sending, rep review required."
author: "vibecodin.gg"
tags:
  - sales
  - outreach
  - engagement
  - prospecting
  - multi-touch
  - email-drafts
  - linkedin-messaging
license: MIT
created: "2026-04-04"
updated: "2026-04-04"
tested_with:
  - claude-sonnet-4-6

model: "claude-sonnet-4-6"
system_prompt: "system-prompt.md"
memory: false

tools:
  builtin: []
  mcps: []

behaviors:
  - "Never sends emails or messages — all output is drafts for human review"
  - "Always collects prospect profile and product context before generating sequences"
  - "Personalizes each touchpoint — no generic copy-paste templates"

dependencies:
  note: "No dependencies required for this agent to function."
  skills: []
  mcps: []
---

## Overview

The **Outreach Sequence Agent** is a sales enablement tool that generates personalized, multi-touch outreach campaigns tailored to specific prospects. Given a prospect profile (company, role, pain points, relevant context) and product/service context, the agent crafts a complete sequence consisting of:

- **Initial Email** — Hook-driven opening touchpoint
- **Follow-up Email #1** — Value-add or pattern interrupt
- **Follow-up Email #2** — Urgency or social proof lift
- **LinkedIn Connection Message** — Native platform engagement
- **Breakup Email** — Professional exit if no response

Each touchpoint includes a subject line, body copy, and recommended send timing. All output is in draft form—the agent never sends anything. Sales reps review, personalize further if needed, and execute manually.

## Usage

The agent follows a structured intake workflow:

1. **Initial Prompt**: Describe what you're selling (product/service name, key value prop, typical buyer pain)
2. **Prospect Profile**: Provide details about your target (company name, person's name/role, industry, company size, specific context/challenges)
3. **Sequence Generation**: Agent generates all five touchpoints with timing recommendations
4. **Review & Customize**: Rep reviews drafts, edits tone/personalization, schedules sends

The agent will ask clarifying questions if information is incomplete or ambiguous. It personalizes based on prospect context and avoids one-size-fits-all templates.

## Examples

### Example 1: B2B SaaS Platform to VP of Sales

**Input:**
- **Product**: Analytics platform for sales teams; reduces forecasting errors by 40%
- **Prospect**: Sarah Chen, VP of Sales at Mid-Cap Tech Corp (500 employees); company uses 5 legacy tools; recently announced new growth target

**Output (abbreviated):**
- **Email 1**: Subject: "Sarah — 3 quick wins for [company] sales ops"; hook on new growth initiative
- **Email 2** (Day 5): Subject: "RE: 3 quick wins"; case study from similar-sized company
- **Email 3** (Day 12): Subject: "1 min read: How [competitor] cut forecast cycles in half"; pattern interrupt
- **LinkedIn Message** (Day 8): Personal connection note mentioning shared interest in sales efficiency
- **Breakup Email** (Day 18): Professional close, offer to reconnect in 6 months

---

### Example 2: Executive Coaching Service to Founder

**Input:**
- **Product**: Executive coaching for early-stage founders; 6-month program; focus on team scaling and board relations
- **Prospect**: Marcus Rodriguez, founder/CEO of Series A Fintech startup (35 employees); just closed funding round; first time managing executive team

**Output (abbreviated):**
- **Email 1**: Subject: "Post-fundraise inflection point"; acknowledges the win, positions coaching as de-risking growth
- **Email 2** (Day 6): Subject: "RE: Post-fundraise"; intro to case study from similar founder
- **Email 3** (Day 14): Subject: "Board relations skill that saved [founder name] 6 months of stress"; value-add
- **LinkedIn Message** (Day 9): Founder-to-founder note, light personal touch
- **Breakup Email** (Day 20): Sincere close, reference to specific challenge mentioned in email 1

---

### Example 3: Enterprise Security Software to CISO

**Input:**
- **Product**: Cloud-native threat detection; 24/7 managed SOC service; reduces MTTR by 60%
- **Prospect**: James Thompson, CISO at Healthcare Org (2000 employees); recent data breach in industry; under board pressure

**Output (abbreviated):**
- **Email 1**: Subject: "CISO conversation: Post-breach readiness in healthcare"; urgency-driven, industry-specific
- **Email 2** (Day 4): Subject: "RE: Post-breach readiness"; compliance risk + cost analysis
- **Email 3** (Day 13): Subject: "How [healthcare company] cut MTTR from 8h to 90min"; proof point
- **LinkedIn Message** (Day 7): Security community nod, credibility signal
- **Breakup Email** (Day 19): Respect for their process, standing offer for future

## Notes

- **Personalization is core**: This agent does not generate boilerplate. Every sequence is built around the specific prospect's context, role, and challenges.
- **Send timing is recommended, not automatic**: All suggested send dates and times are guidelines. Reps adjust based on their sales rhythm and prospect availability.
- **No data sending**: The agent does not integrate with CRMs, email platforms, or other tools. All drafts are presented for manual review and execution.
- **Tone guidance is built in**: The agent adapts formal/casual tone based on industry and prospect seniority while maintaining authenticity.
- **Subject lines are A/B testable**: Where relevant, the agent may suggest A/B variants for subject lines (noted in output).
- **LinkedIn messaging is native**: LinkedIn messages are formatted as platform-native messaging (not pasted into connection requests or other channels).
- **Breakup email is not aggressive**: The final email is professional and leaves the door open for future conversations, not a "last chance" ultimatum.
- **Follow-ups assume no response**: The sequence assumes each previous touchpoint received no reply. Reps are expected to adjust if they do get engagement.
