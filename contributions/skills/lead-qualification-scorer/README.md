---
name: "Lead Qualification Scorer"
type: skill
version: "1.0.0"
description: "Evaluates leads using BANT or MEDDIC criteria to generate qualification scores, reasoning, and prioritized next steps for sales follow-up."
author: "vibecodin.gg"
tags:
  - lead-scoring
  - sales-qualification
  - bant
  - meddic
  - lead-generation
  - sales-workflow
  - prospect-prioritization

license: MIT
created: "2026-04-04"
updated: "2026-04-04"
tested_with:
  - claude-sonnet-4-6

trigger: "Use this skill when you need to evaluate a prospect or lead's readiness to engage, qualify them against standard sales criteria (BANT or MEDDIC), or determine priority level for sales outreach."

commands:
  - name: "qualify"
    description: "Comprehensive lead qualification that evaluates a lead against BANT or MEDDIC criteria and returns structured analysis with qualification level, confidence score, gaps, and recommended actions."
  - name: "score"
    description: "Quick qualification score for a single lead that rates overall qualification and priority level (hot/warm/cold) based on provided information."

dependencies:
  note: "No dependencies required for this skill to function."
  tools: []
  mcps: []
  skills: []
---

## Overview

The **Lead Qualification Scorer** helps sales teams systematically evaluate prospects using proven qualification frameworks. This skill accepts information about a lead and applies either **BANT** (Budget, Authority, Need, Timeline) or **MEDDIC** (Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion) criteria to generate:

- **Qualification score** — overall readiness on a 0-100 scale
- **Detailed reasoning** — breakdown of strengths and gaps for each criterion
- **Priority level** — recommended priority bucket (Hot/Warm/Cold)
- **Next steps** — specific recommended actions based on identified gaps
- **Risk flags** — potential deal-killer concerns to address early

Use this skill to standardize lead evaluation across your team, reduce time spent on unqualified leads, and focus sales effort on the most promising opportunities.

## Usage

### Basic Syntax

Invoke the skill with your preferred qualification framework and lead information:

```
/lead-qualification-scorer:qualify
Framework: BANT (or MEDDIC)
Lead Information: [Provide available details about the prospect]
```

Or for a quick score:

```
/lead-qualification-scorer:score
Framework: BANT (or MEDDIC)
Lead Name: [prospect name]
Company: [company name]
Key Details: [brief summary of known information]
```

### What to Include

Provide as much relevant information as possible about the lead:
- Company name and size (employee count, revenue if known)
- Lead's title, role, and seniority
- Current tools/systems they use
- Stated business challenges or pain points
- Previous interactions or expressions of interest
- Industry and market segment
- Timeline for making a decision
- Budget indicators (if available)
- Competitive landscape or alternatives they're considering

The more complete your input, the more actionable your qualification score will be.

## Examples

### Example 1: BANT Qualification for a Mid-Market SaaS Lead

**Input:**
```
Framework: BANT

Lead: Sarah Chen, VP of Operations at TechFlow Inc.
Company: TechFlow (120 employees, $8.2M ARR, SaaS/Cloud Services)

Context:
- Sarah attended our webinar last week and downloaded the ROI calculator
- She mentioned their current platform is "limiting growth" in her follow-up email
- TechFlow is planning a Q3 product launch and needs faster deployment cycles
- Her company has previously invested in process automation tools
- She reports to the CFO (indicating budget authority)
- No timeline mentioned yet, but urgency signals seem medium
```

**Output:**
```
QUALIFICATION SUMMARY
Overall Score: 78/100 (WARM Lead)
Priority Level: WARM
Confidence: High (70%)

BANT BREAKDOWN:
Budget: 75/100 ✓
  - Strong: Mid-market company with track record of investment
  - Gap: No budget allocated yet; need to discuss financial impact

Authority: 90/100 ✓
  - Strong: VP-level decision maker reporting to CFO
  - Notes: May need CFO alignment on budget

Need: 85/100 ✓
  - Strong: Clear pain point (platform limitations)
  - Strong: Time-sensitive business driver (Q3 launch)
  - Aligned with solution value

Timeline: 65/100 ⚠
  - Gap: No explicit purchase timeline discussed
  - Opportunity: Q3 launch provides natural deadline to explore

REASONING:
Sarah Chen represents a qualified prospect with clear business needs and appropriate authority. Her company shows strong spending patterns and urgency around product deployment. The primary gap is establishing a firm decision timeline and confirming budget availability.

RECOMMENDED NEXT STEPS:
1. Schedule discovery call with Sarah + CFO to discuss budget allocation
2. Build Q3 launch into your proposal timeline (create urgency)
3. Prepare ROI analysis showing deployment time savings vs. current platform
4. Ask directly: "What would need to happen for this to be a Q2 vs. Q3 decision?"
5. Identify other stakeholders (CTO, Engineering Lead) who influence tech decisions

RISK FLAGS:
- Budget not yet confirmed; CFO alignment critical
- No competing solutions mentioned yet; need to understand alternatives

PRIORITY: Schedule discovery call within 3 days while engagement is fresh
```

---

### Example 2: MEDDIC Qualification for Enterprise Deal

**Input:**
```
Framework: MEDDIC

Lead: James Hartley, Director of IT Infrastructure at GlobalBank Corp
Company: GlobalBank (18,000 employees, Fortune 500, Financial Services)

Background:
- Inbound inquiry from your SDR outreach campaign
- Dealing with legacy infrastructure modernization challenge
- Just hired new CTO (Mark Sullivan) two months ago - likely pushing modernization
- Compliance and security critical in their industry
- Considering three vendors: us, competitor A, competitor B
- Budget: $2-5M enterprise deal expected
- Timeline: Board approval needed (6-month decision process likely)
```

**Output:**
```
QUALIFICATION SUMMARY
Overall Score: 82/100 (WARM/HOT Lead)
Priority Level: HOT (despite timeline)
Confidence: High (75%)

MEDDIC BREAKDOWN:
Metrics: 85/100 ✓
  - Strong: Large enterprise with significant budget capacity
  - Clear goals: Infrastructure modernization within 18 months
  - Measurable impact: Reduce data center costs, improve uptime SLA

Economic Buyer: 70/100 ⚠
  - Identified: CTO Mark Sullivan (recent hire, modernization advocate)
  - Gap: Board/CFO approval required; not yet directly engaged
  - Opportunity: New CTO = fresh stakeholder with budget authority

Decision Criteria: 80/100 ✓
  - Strong: Compliance/security/performance clearly prioritized
  - Known: Evaluating competitor solutions
  - Missing: Detailed technical requirements doc

Decision Process: 65/100 ⚠
  - Identified: Enterprise RFP process, 6-month timeline
  - Gap: No information on committee structure or voting process
  - Gap: Unknown decision milestones

Identify Pain: 90/100 ✓
  - Strong: Legacy infrastructure causing operational friction
  - Strong: Board-level mandate for modernization
  - Urgent: New CTO hired specifically to execute this transformation

Champion: 60/100 ⚠
  - Possible: James Hartley (Director, IT) respects new CTO
  - Gap: Relationship between CTO and CFO/Board needs validation
  - Opportunity: New CTO likely needs allies; can cultivate James as champion

REASONING:
GlobalBank is a high-potential deal with clear pain, significant budget, and a change catalyst (new CTO). However, this is a complex enterprise sale requiring navigation of board approval process and multiple decision-makers. The 6-month timeline is typical for this company size.

RECOMMENDED NEXT STEPS:
1. Schedule call with Mark Sullivan (CTO) ASAP - he's your actual buyer
2. James Hartley is gatekeeper; cultivate him as champion/ally
3. Request compliance and technical requirements doc to customize proposal
4. Map full decision committee: CFO, Chief Risk Officer, Board members involved
5. Understand board approval timing - get on their calendar 3 months from now
6. Create executive brief (1-pager) for board consumption

RESOURCE ALLOCATION:
- Assign dedicated account executive (this is 6-month deal)
- Bring in technical architect for requirements phase (Month 1-2)
- Budget for 4-6 customer site visits / demonstrations

RISK FLAGS:
- Competitor B has existing relationship at company (verify this)
- Board approval introduces unpredictable timing
- Budget may be deferred if board prioritizes other initiatives
- Long sales cycle ties up resources; ensure pipeline depth

PRIORITY: Urgent to engage Mark Sullivan before competitors; high deal value justifies intensive pursuit
```

---

### Example 3: BANT Qualification for Cold Outreach Lead

**Input:**
```
Framework: BANT

Lead: Mike Rodriguez, Marketing Manager at LocalRetail Co.
Company: LocalRetail (35 employees, local retail chain with 8 locations)
Source: Cold email outreach

Known Info:
- Opened email 3 times, clicked once
- No prior relationship or engagement
- Company website mentions "looking to expand digital presence"
- Likely budget: <$50K annually for marketing
- Sales cycle: Unknown (likely slower for SMB)
- No response to initial email or follow-up
```

**Output:**
```
QUALIFICATION SUMMARY
Overall Score: 42/100 (COLD Lead)
Priority Level: COLD
Confidence: Medium (50%)

BANT BREAKDOWN:
Budget: 35/100 ❌
  - Gap: SMB budget likely $20-50K annually
  - Challenge: Price sensitivity high for this segment
  - Unknown: Is digital marketing a priority spend?

Authority: 50/100 ⚠
  - Gap: Marketing Manager may not control full budget (likely reports to owner)
  - Unknown: Decision-making structure at small company
  - Concern: May need owner/CEO approval for new tools

Need: 70/100 ✓
  - Positive: "Digital presence expansion" mentioned on website
  - Gap: Not confirmed as urgent/immediate need
  - Gap: No indication this is current priority vs. someday goal

Timeline: 30/100 ❌
  - Major Gap: No timeline signals in outreach
  - Concern: Cold email recipient unlikely to have near-term decision timeline
  - Unknown: Decision process and approval speed

REASONING:
While LocalRetail shows some relevance to your solution, this is a low-qualified lead at this stage. The prospect has shown minimal engagement (opened email, no response to asks), and multiple BANT criteria are unmet. The combination of limited budget, unclear authority, and no timeline indicates this lead needs significant nurturing before qualification is possible.

RECOMMENDED NEXT STEPS (If pursuing):
1. Shift to education-focused outreach: share case study of similar 8-location retail company
2. Do NOT hard-sell; position as resource/thought partner
3. Find decision-maker: Research who controls tech/marketing budgets (likely owner)
4. Test interest via low-friction engagement: invite to relevant webinar, share resource
5. Wait for triggering event: site redesign announcement, seasonal push, funding news
6. Require engagement signal before intensive sales effort

OR - DEPRIORITIZE:
Given current lead quality and typical 6-month SMB sales cycle, recommend moving to nurture sequence rather than active prospecting until signals improve.

ALTERNATIVE APPROACH:
If this is a strategic vertical market for you, may be worth account-based engagement, but plan for 8-12 month timeline and $5-10K customer acquisition cost.

RISK FLAGS:
- No response to outreach; interest level questionable
- Budget constraints may be deal-killer
- Owner/decision-maker not yet engaged
- SMB segment typically slow to move on new vendors

PRIORITY: Nurture only; revisit if new signals emerge (hiring announcement, funding, digital initiative launch)
```

---

## Notes

### Framework Selection

**Choose BANT if:**
- You're qualifying early-stage leads or prospects with simple buying processes
- The deal involves a single decision-maker or simple approval chain
- You need a quick qualification decision
- Prospect is mid-market or smaller

**Choose MEDDIC if:**
- You're managing complex, high-value enterprise deals
- Multiple stakeholders and approval layers are involved
- Long decision timelines and detailed requirements are typical
- You need deeper strategic insights into the buying environment

### Scoring Interpretation

- **80-100:** Hot lead; prioritize immediate sales engagement
- **65-79:** Warm lead; actively nurture and progress qualification
- **50-64:** Cool lead; maintain contact; revisit quarterly or on trigger events
- **Below 50:** Cold lead; defer to nurture sequence; focus on education and trust-building

### Best Practices

1. **Gather all available information first** — More input = better qualification
2. **Update scores regularly** — Qualification changes as you learn more about a prospect
3. **Use in team conversations** — Share scores with team to align on priority and strategy
4. **Don't let scores be final** — Use scores as framework for discussion, not definitive judgment
5. **Track score changes over time** — Monitor which criteria improve/degrade as you engage
6. **Validate assumptions** — Ask prospects directly about gaps identified in qualification
7. **Customize criteria if needed** — For specialized verticals, you may weight criteria differently

### Common Pitfalls to Avoid

- **Overweighting recent signals** — A single positive conversation doesn't necessarily override weak fundamentals
- **Ignoring risk flags** — "Hot" scores can mask hidden deal-killers; investigate red flags
- **Skipping the champion** — MEDDIC's "Champion" criterion is often underestimated; weak internal advocates derail deals
- **Assuming authority** — Always confirm who actually controls the budget and decision
- **Neglecting timeline** — Even perfect fit + willing buyer still fails if there's no urgency

---

**Last Updated:** 2026-04-04
**Maintained by:** vibecodin.gg contributors
**License:** MIT
