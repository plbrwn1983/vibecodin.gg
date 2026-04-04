---
name: "Support Escalation Agent"
type: agent
version: "1.0.0"
description: "Analyzes escalated customer cases, drafts de-escalation responses, and recommends resolution paths for manager approval."
author: "vibecodin.gg"
tags:
  - customer-service
  - escalation-management
  - ticket-resolution
  - de-escalation
  - case-analysis
  - policy-exceptions
  - internal-workflow
license: MIT
created: "2026-04-04"
updated: "2026-04-04"
tested_with:
  - claude-sonnet-4-6

model: "claude-sonnet-4-6"
system_prompt: "system-prompt.md"
memory: false

tools:
  builtin:
    - Read
    - Write
  mcps: []

behaviors:
  - "Never sends responses to customers — all drafts require manager approval before use"
  - "Always recommends an internal resolution path alongside the customer-facing draft"
  - "Flags potential policy exceptions explicitly and explains the tradeoff"

dependencies:
  note: "No dependencies required for this agent to function."
  skills: []
  mcps: []
---

## Overview

The Support Escalation Agent is designed to assist support managers in handling difficult, escalated customer cases. When a customer complaint reaches the escalation threshold, this agent provides structured analysis and actionable recommendations.

Given a ticket history, case summary, or escalation note, the agent:
- **Analyzes the situation** to understand the customer's core issue, frustration drivers, and previous resolution attempts
- **Drafts a de-escalation response** that acknowledges the customer's frustration, clarifies next steps, and rebuilds trust
- **Recommends an internal resolution path** with specific actions and responsible teams
- **Assesses policy exception needs** and explicitly flags tradeoffs if a policy exception is warranted
- **Prepares an internal handoff note** for the next team member or department

Critically, the agent **never sends responses autonomously**. All customer-facing drafts are presented for manager review and approval before being marked ready to send.

## Usage

### Input Format

Provide the agent with one of the following:

1. **Full ticket history**: Paste the complete conversation thread between customer and support
2. **Case summary**: Provide a structured summary including:
   - Customer issue/complaint
   - Previous resolution attempts
   - Current status
   - Why it reached escalation
3. **Escalation note**: A brief description of what triggered the escalation

### Example Invocation

```
"We have an escalated case. Here's the ticket history:
[ticket details]

The customer is frustrated after 3 failed resolution attempts. Please analyze and draft a response."
```

### Output Structure

The agent returns a structured response containing:

1. **Situation Analysis** — A neutral, factual summary of what happened and why the customer is frustrated
2. **Customer-Facing Draft** — A proposed response ready for manager review (not yet sent)
3. **Internal Resolution Path** — Recommended next steps with accountabilities
4. **Policy Exception Assessment** — Whether an exception is needed, and the business justification
5. **Internal Handoff Note** — Talking points for handing the case to another team

## Examples

### Example 1: Billing Overcharge

**Input:**
```
Ticket: Customer charged twice for annual subscription
- First attempt: Agent credited one charge but didn't investigate root cause
- Second attempt: Customer claims they're still double-charged
- Escalation reason: Customer threatening to dispute with credit card company
```

**Agent Output** (abbreviated):

**Situation Analysis:**
The customer was charged twice for their annual subscription. The first support interaction provided a partial credit but didn't resolve the underlying billing system error. The customer remains out $199 and is now considering a chargeback, indicating loss of trust in our resolution capability.

**Customer-Facing Draft:**
> I sincerely apologize for the billing error and the frustration it's caused you. You're absolutely right to escalate—you should never have been charged twice, and we didn't get this right the first time.
>
> I've personally reviewed your account and confirmed the error. I'm issuing a full credit of $199 immediately [confirmation #12345]. I've also flagged this with our billing team to prevent it from happening again.
>
> I know this is inconvenient, but I want to make this right. [offer: 3 months free, or X discount on next purchase].

**Internal Resolution Path:**
1. Finance team: Full credit + investigation into root cause of double-charging
2. Engineering: Review billing system logs for this customer's transaction
3. CS follow-up in 24 hours to confirm credit posted

**Policy Exception Assessment:**
No policy exception needed. Full refund is standard practice for documented billing errors. Optional goodwill gesture (discount/credit) is manager discretion.

**Internal Handoff Note:**
Root cause still TBD. If engineering finds a systemic issue, escalate to product. Customer originally wanted simply to be charged correctly—keep resolution simple and don't over-apologize.

---

### Example 2: Delayed Delivery with Communication Gaps

**Input:**
```
Ticket: Customer ordered product, promised 5-day delivery, now 10 days past due
- No tracking updates provided
- Three support contacts with inconsistent information
- Customer is a high-value account (5-year relationship, $30k+ annual spend)
- Escalation: Customer considering switching vendors
```

**Agent Output** (abbreviated):

**Situation Analysis:**
A high-value customer's time-sensitive order is significantly delayed with poor communication from our team. Three support interactions provided conflicting information, eroding trust. The customer's business depends on timely delivery, and we've failed to prioritize their needs. Risk: loss of long-standing customer relationship.

**Customer-Facing Draft:**
> I want to apologize directly for both the delay and the inconsistent communication you've received. You've been a valued partner for five years, and this situation doesn't reflect the service you should expect.
>
> Here's where we are: [specific status]. I'm personally tracking this from here. You'll get a direct update from me [daily/every 12 hours] until delivery. If it doesn't arrive by [date], we're authorizing [specific compensation] at no additional cost.
>
> I'd like to discuss how we can strengthen our process to prevent this. Are you available for a brief call this week?

**Internal Resolution Path:**
1. Logistics: Expedite shipping, daily tracking
2. Customer success: Schedule relationship recovery call
3. Process review: Why did escalation become necessary? (communication protocol failure)

**Policy Exception Assessment:**
Suggest expedited shipping at no cost and a service credit. Not a policy exception—a relationship recovery investment for a high-value account showing churn risk.

**Internal Handoff Note:**
Customer is considering alternatives. This is a relationship moment, not just a logistics problem. Recovery calls should come from account manager. If future issues occur, escalate immediately rather than letting communications drift.

---

### Example 3: Product Quality Complaint with Compliance Question

**Input:**
```
Ticket: Customer received defective product (broken on arrival)
- Requested full refund
- CS offered standard warranty replacement
- Customer refused, citing time sensitivity
- Escalation reason: Customer threatening legal action over "defective goods"
```

**Agent Output** (abbreviated):

**Situation Analysis:**
Customer received a genuinely defective product and needs it resolved quickly for their business use. Our standard replacement offer doesn't address their time constraint. The legal threat suggests the customer feels we're not taking the problem seriously. Risk: potential product liability exposure if customer has valid claim.

**Customer-Facing Draft:**
> I apologize for sending you a defective product. That's on us, and I understand the frustration.
>
> Given your timeline, a standard replacement won't work. Here's what I can do: [full refund via [method] within [timeframe], plus [compensation for inconvenience]].
>
> I'm also checking with our product team about how this defect occurred. If there's a pattern, we want to know—and we'll follow up with you if we discover anything important about product quality.

**Internal Resolution Path:**
1. Finance: Process refund immediately (expedited)
2. Product: QA check on the batch this unit came from
3. Legal review (if applicable): Document complaint and resolution for record

**Policy Exception Assessment:**
Full refund is standard for defects. No exception needed. Consider expedited processing and nominal goodwill credit for compliance and relationship reasons.

**Internal Handoff Note:**
Customer has implied legal concern. Document resolution fully. If they follow up with legal threats, escalate to legal department. Don't over-negotiate or create appearance of admission of liability—stick to factual acknowledgment of the defect.

---

## Notes

### When to Use This Agent

- A customer complaint has reached escalation status (manager involvement, threat of legal/chargeback, risk of public complaint)
- Multiple resolution attempts have failed
- The situation requires both customer empathy and internal coordination
- A policy exception decision is needed
- De-escalation messaging needs to be carefully crafted

### When Not to Use This Agent

- Routine first-line support issues (use standard support workflows)
- Customer simply needs a technical how-to (use knowledge base)
- The case is already resolved and you just need documentation

### Best Practices

1. **Provide full context**: The more complete the ticket history, the better the analysis
2. **Review before sending**: Never send the draft without manager approval
3. **Personalize**: The agent's draft is a starting point—adapt it to your voice and company culture
4. **Track outcomes**: Use the internal handoff note to brief the next team
5. **Follow up**: Even with a good resolution, reconnect with the customer after resolution to confirm satisfaction

### Customization Tips

- **For your company**: Adapt the tone and compensation references to match your policy and brand voice
- **For specific domains**: If your team specializes in B2B, SaaS, e-commerce, etc., mention that context when providing the case
- **For company values**: Explain your core values (e.g., "We prioritize long-term relationships over short-term cost savings") for better alignment in recommendations

### Model & Performance

- **Tested with**: Claude Sonnet 4.6
- **Why Sonnet**: Balances strong reasoning for case analysis with cost efficiency for iterative manager-agent workflows
- **Latency**: Typical response time 2-5 seconds for structured case analysis
- **Quality**: Designed for manager review—intentionally comprehensive to reduce back-and-forth

### License

MIT License. Use and adapt freely for your organization.
