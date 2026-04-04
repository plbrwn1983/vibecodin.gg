---
name: "KPI Dashboard Narrator"
type: skill
version: "1.0.0"
description: "Transforms raw KPI data into structured executive narratives with performance analysis and strategic recommendations."
author: "vibecodin.gg"
tags:
  - business-intelligence
  - executive-summary
  - kpi-analysis
  - performance-reporting
  - strategic-planning
  - analytics
  - business-review

license: MIT
created: "2026-04-04"
updated: "2026-04-04"
tested_with:
  - claude-sonnet-4-6

trigger: "When you have KPI data from a business review period and need to synthesize raw metrics into an executive narrative for leadership communication."

commands:
  - name: "narrate"
    description: "Generate a complete executive narrative from raw KPI data, including headline summary, performance breakdown, underperformance analysis with root causes, recommended focus areas, and talking points."
  - name: "summarize"
    description: "Create a quick one-paragraph executive summary from KPI data, optimized for email or verbal briefings."

dependencies:
  note: "No dependencies required for this skill to function."
  tools: []
  mcps: []
  skills: []
---

## Overview

The KPI Dashboard Narrator skill transforms raw business metrics into structured, compelling executive narratives. Instead of presenting a scattered collection of numbers, percentages, and comparisons, it synthesizes KPI data into a coherent story that executives can act on.

This skill is designed for weekly or monthly business reviews where you need to communicate performance status, explain variances from targets, and guide leadership toward strategic decisions. It handles the synthesis work—identifying patterns, contextualizing performance, and surfacing implications—so stakeholders can focus on strategy rather than data interpretation.

The skill produces five key components:
1. **Headline Summary** — One paragraph capturing the overall business health and most critical takeaway
2. **Above-Target Breakdown** — Which metrics are winning and why those wins matter
3. **Underperformance Breakdown** — Which metrics are lagging and credible hypotheses about root causes
4. **Recommended Focus Areas** — Specific, prioritized areas where leadership should concentrate effort
5. **Leadership Talking Point** — A concise, compelling framing for executive communication

## Usage

### Input Format

Provide raw KPI data in one of these formats:

**Structured list:**
```
Revenue: $2.4M (target: $2.2M, +9%)
Customer Acquisition Cost: $145 (target: $160, -9%)
Monthly Active Users: 12,400 (target: 12,000, +3%)
Churn Rate: 4.2% (target: 3.5%, -20%)
NPS: 52 (target: 55, -5%)
```

**Narrative form:**
```
This month we grew revenue to $2.4M, beating our $2.2M target. Customer acquisition is looking good at $145 per customer, well below our $160 threshold. However, churn ticked up to 4.2% when we'd hoped to hold at 3.5%, and our NPS dipped slightly to 52 from last month's 54.
```

**Table/spreadsheet excerpt:**
```
| Metric | Current | Target | Variance |
|--------|---------|--------|----------|
| MRR | $892K | $850K | +5% |
| Expansion Rate | 18% | 20% | -10% |
| Customer Lifetime Value | $4,200 | $4,500 | -7% |
```

### Command: narrate

Request a full executive narrative when you have sufficient KPI data and need comprehensive analysis.

**Example prompt:**
```
Please narrate this month's KPI performance:
- Revenue: $2.4M (target $2.2M)
- Customer Acquisition Cost: $145 (target $160)
- Monthly Active Users: 12,400 (target 12,000)
- Churn Rate: 4.2% (target 3.5%)
- NPS: 52 (target 55)
- Support Response Time: 2.1 hours (target 4 hours)
```

**Expected output:** A 500-700 word executive narrative covering all five components, ready to present to leadership or include in a board deck.

### Command: summarize

Request a quick summary when you need a condensed brief for email, chat, or a verbal briefing.

**Example prompt:**
```
Give me a quick one-paragraph summary of our performance this week:
- Sales Pipeline: $4.2M (target $3.8M, +11%)
- Close Rate: 28% (target 32%, -13%)
- Average Deal Size: $87K (stable, on target)
```

**Expected output:** A tight, single-paragraph summary emphasizing the most critical insight.

## Examples

### Example 1: SaaS Monthly Review

**Input:**
```
Monthly Recurring Revenue: $542K (target $520K, +4.2%)
Churn Rate: 3.1% (target 3%, -3.3%)
Net Revenue Retention: 108% (target 110%, -1.8%)
Customer Acquisition Cost: $1,250 (target $1,400, +10.7% efficiency gain)
Magic Number (Revenue/Sales Spend): 0.92 (target 1.0, -8%)
Support Ticket Resolution Time: 18 hours (target 24 hours, beating target)
```

**Narrative Output:**
```
November represents solid execution with MRR growth of 4.2% to $542K and exceptional CAC efficiency gains of 10.7%, signaling improved sales effectiveness. Our support team continues to outperform, resolving tickets in 18 hours against a 24-hour target. However, three headwinds require focus: churn ticked up to 3.1%, NRR slipped to 108% below our 110% target, and our Magic Number fell to 0.92, indicating that sales spend is not yet generating revenue growth proportionally. The churn uptick suggests possible product friction in cohorts that expanded in Q3; the NRR decline mirrors this, pointing to lower expansion rates among existing customers. The Magic Number shortfall reflects elevated sales spend in a customer acquisition push that has not yet matured into recurring revenue contribution. Recommended focus: (1) conduct cohort analysis on churn to identify friction points and inform product priorities, (2) analyze expansion revenue drivers to rebuild NRR trajectory, and (3) model sales spend efficiency to ensure Q1 growth investments generate proportional revenue. Talking point: "We're seeing strong top-line momentum and excellent execution on customer acquisition efficiency, but we've identified three areas—churn, expansion, and sales leverage—that need immediate attention to restore our growth trajectory. Our teams have clear hypotheses and action plans."
```

### Example 2: B2B Enterprise Sales Quarterly Review

**Input:**
```
Pipeline Value: $18.5M (target $16M, +15.6%)
Deals in Close Stage: 8 (target 10, -20%)
Average Sales Cycle: 94 days (target 75 days, +25%)
Win Rate: 34% (target 40%, -15%)
Quota Achievement: 92% (target 100%, -8%)
New Logo Count: 12 (target 15, -20%)
```

**Narrative Output:**
```
Q1 sales performance reflects a mixed picture with strong pipeline generation offsetting conversion headwinds. We've built an exceptional pipeline of $18.5M, exceeding our $16M target by 15.6%, indicating healthy demand generation and qualification discipline. However, downstream metrics reveal conversion challenges: we have only 8 deals in close stage against a target of 10, our win rate has declined to 34% from our historical 40%, and average sales cycle has extended to 94 days from a 75-day target. These three signals suggest either competitive pressure on late-stage deals or deal quality issues upstream. The 20% miss on new logos and 8% shortfall on quota achievement are direct consequences. Most likely root causes: (1) sales cycle extension may indicate deals are being pushed forward before they're truly qualified, leading to elongated negotiation and lower close rates, or (2) competitive win-loss patterns are worsening in our core segments, or (3) our sales team is pursuing lower-confidence opportunities to maintain pipeline. Recommended actions: (1) conduct win-loss analysis on the past 5 deals lost to understand competitive positioning, (2) review deal scoring and early-stage qualification to prevent unqualified deals from consuming resources, (3) analyze time spent per stage to identify bottlenecks in procurement or legal review, and (4) reallocate territory assignments if certain reps are significantly underperforming. Talking point: "Our demand generation is outstanding—we're tracking to exceed our pipeline targets by 16%. Our challenge is efficiently converting that pipeline. We've identified likely causes and have a plan to restore sales performance to target by Q2."
```

### Example 3: Product Engagement Weekly Snapshot

**Input:**
```
Daily Active Users: 8,240 (target 8,000, +3%)
Session Length (avg): 14.2 min (target 15 min, -5.3%)
Feature Adoption (new feature): 23% (target 40%, -42.5%)
User Retention (D7): 68% (target 72%, -5.6%)
Bugs Reported (critical): 2 (target 0, baseline exceeded)
Uninstall Rate: 2.1% (target <2%, -5%)
```

**Narrative Output:**
```
This week we achieved solid DAU growth at 8,240 users, surpassing our 8K target, but engagement metrics reveal emerging product concerns that warrant investigation. Session length dipped 5.3% to 14.2 minutes and D7 retention slipped to 68%, suggesting users are spending less time in the product and fewer are returning after day 7. Most concerning is the new feature rollout: at 23% adoption, we're well short of our 40% target despite a two-week marketing push, indicating either poor feature discoverability, unclear value proposition, or that the feature doesn't solve a critical user need. Additionally, two critical bugs were reported this week against our zero-bug target, and uninstall rate ticked up to 2.1%. These signals are interconnected and point to a quality or usability issue: users adopt the feature, encounter a bug or friction point, experience shorter sessions, and are less likely to return. Root cause hypothesis: the new feature either shipped with stability issues, has poor onboarding/documentation, or doesn't integrate cleanly with the user's workflow. Secondary hypothesis: the two critical bugs may be unrelated to the feature but are contributing to broader quality perception. Immediate actions: (1) review crash logs and error telemetry for the past week to identify if specific bugs correlate with uninstall events, (2) conduct rapid user interviews with non-adopters of the new feature to understand barriers to adoption, (3) prioritize bug fixes and rapid hotfix deployment, and (4) if feature adoption remains low after fixes, consider a phased rollback and refinement. Talking point: "DAU growth is healthy, which is positive validation of our user acquisition. But we're seeing a quality moment—retention and engagement have dipped, and our new feature isn't landing as expected. We've identified the likely issues and are moving quickly on diagnostics and fixes this week."
```

## Notes

- **Data Completeness:** The skill works best with 5-8 metrics. Fewer than 3 metrics may produce generic output; more than 12 may require prioritization or segmentation.

- **Target Context:** Always provide target numbers or historical baselines. Without context, "5,000 users" is just a number; with context ("target 4,500"), it becomes a performance signal.

- **Root Cause Hypotheses:** The skill generates credible hypotheses based on metric patterns, but does not have access to backend systems. Use these as starting points for investigation, not final conclusions. Your team's domain expertise should validate or refute the hypotheses.

- **Tailoring Narratives:** If you have additional context (recent launches, known issues, market conditions), include it in your prompt. Example: "Please narrate this month's KPI performance. Note: we had a major product outage on the 15th that affected users for 4 hours."

- **Frequency:** This skill is optimized for weekly or monthly reviews. Daily KPI narration often produces noisy output; consider a rolling 7-day or 30-day window for stability.

- **Executive Readiness:** The output is designed for direct presentation to non-technical executives and boards. It avoids jargon while maintaining analytical rigor.

- **Integration:** Paste this skill's output directly into executive summaries, board decks, or leadership emails. The structure aligns with common presentation formats.
