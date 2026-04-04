---
name: "Support Ticket Triage"
type: skill
version: "1.0.0"
description: "Automatically classify and route incoming support tickets with priority assessment, team recommendations, and pre-drafted first responses."
author: "vibecodin.gg"
tags:
  - customer-service
  - ticket-management
  - triage
  - automation
  - support-operations
  - case-management
license: MIT
created: "2026-04-04"
updated: "2026-04-04"
tested_with:
  - claude-sonnet-4-6

trigger: "Invoke when new support tickets arrive requiring classification, priority assessment, and initial routing decisions before assignment to support agents."

commands:
  - name: "triage"
    description: "Full triage analysis of a support ticket including category, priority, routing, summary, and first-response draft."
  - name: "classify"
    description: "Quick category and priority classification only, without routing or response draft."

dependencies:
  note: "No dependencies required for this skill to function."
  tools: []
  mcps: []
  skills: []
---

## Overview

Support Ticket Triage is an intelligent ticket classification and routing skill designed for customer service teams. It analyzes incoming support tickets and provides:

- **Category Classification**: Assigns one of four categories (billing, technical, account, general) based on ticket content
- **Priority Assessment**: Assigns priority levels (P1, P2, P3, P4) with explicit reasoning
- **Team Routing**: Recommends the appropriate support team based on category and complexity
- **Queue Summary**: Generates a concise one-line summary for ticket queue displays
- **First-Response Draft**: Creates a professional holding message agents can send immediately while deeper review occurs

This skill reduces manual triage time, ensures consistent classification, and helps support teams prioritize urgent issues without delay.

## Usage

### Full Triage Analysis

Use the `triage` command when you need complete triage output:

```
Invoke: support-ticket-triage triage
Provide:
  - Subject: The ticket subject line
  - Body: The complete ticket body/message
```

**Output Structure:**
```
Category: [billing|technical|account|general]
Priority: [P1|P2|P3|P4]
Priority Reasoning: [explanation of why this level was assigned]
Routing Team: [recommended team name]
Queue Summary: [one-line summary for display]
First Response: [pre-drafted response message]
```

### Quick Classification

Use the `classify` command for fast category and priority assessment only:

```
Invoke: support-ticket-triage classify
Provide:
  - Subject: The ticket subject line
  - Body: The complete ticket body/message
```

**Output Structure:**
```
Category: [billing|technical|account|general]
Priority: [P1|P2|P3|P4]
Priority Reasoning: [brief explanation]
```

## Examples

### Example 1: High-Priority Billing Issue

**Input:**
- Subject: "Duplicate charges on my account - need immediate resolution"
- Body: "I was charged twice for my monthly subscription yesterday. Total: $29.98 instead of $14.99. I need this reversed immediately as my payment was declined on another purchase due to this error. This is affecting my ability to use critical services."

**Output:**
```
Category: billing
Priority: P2
Priority Reasoning: Financial impact with customer service consequence and clear resolution path required. Not P1 as service is still accessible, but elevated due to duplicate charge and payment consequence.
Routing Team: Billing & Refunds
Queue Summary: Duplicate subscription charge - $15 refund needed
First Response: "Thank you for reporting this issue. I've flagged your account for immediate investigation into the duplicate charge. Our billing team will review your transaction history and process a refund within 24 hours. We'll also ensure your next billing cycle reflects the correct amount. I'll follow up with you personally once this is resolved."
```

### Example 2: Critical Technical Outage

**Input:**
- Subject: "Production database connection failing - entire system down"
- Body: "Our production environment is completely offline. All 500+ users cannot access the platform. Database connection errors started 15 minutes ago. This is a critical outage affecting our business operations."

**Output:**
```
Category: technical
Priority: P1
Priority Reasoning: Production system completely unavailable affecting all users. Significant business impact requiring immediate escalation and resolution. This is the highest severity technical incident.
Routing Team: Infrastructure & Database Support
Queue Summary: Production database offline - all users affected
First Response: "We've received your report and are treating this as a critical incident. Our engineering team has been immediately notified and is investigating the database connection issue. You'll receive updates every 15 minutes, and we're working to restore service as quickly as possible. Thank you for your patience."
```

### Example 3: General Account Access Question

**Input:**
- Subject: "How do I reset my password?"
- Body: "I forgot my password and the reset email isn't arriving. I've checked spam but nothing. Can someone help me get back into my account?"

**Output:**
```
Category: account
Priority: P3
Priority Reasoning: User account access issue but standard resolution available through password reset. No data loss or security breach indicated. Can be resolved through normal support channels within standard timeframe.
Routing Team: Account Support & Access Management
Queue Summary: Password reset email not received - resend or manual reset needed
First Response: "Thanks for reaching out! I can help you regain access to your account. Let me manually reset your password and send you a new reset link. You should receive it within 5 minutes at your registered email address. If you still don't see it, please let me know and I can try an alternate approach."
```

### Example 4: General Feature Request

**Input:**
- Subject: "Feature suggestion: dark mode"
- Body: "Would love to see a dark mode option in the settings. I work at night and the bright interface strains my eyes. Many other similar platforms have this feature."

**Output:**
```
Category: general
Priority: P4
Priority Reasoning: Feature request with no operational impact or urgency. Appropriate for product feedback workflow rather than immediate support response. Should be logged in product roadmap consideration.
Routing Team: Product Management & Customer Feedback
Queue Summary: Feature request - dark mode UI option
First Response: "Thanks for the great suggestion! Dark mode is a feature many of our users have requested. I've logged your feedback with our product team and it's been added to our feature consideration list. We regularly review community suggestions, and we'll keep you posted if this makes it onto our roadmap. We appreciate your input!"
```

## Notes

**Category Guidelines:**

- **Billing**: Payment issues, subscription management, refunds, invoicing, pricing questions, charge disputes
- **Technical**: System errors, bugs, performance issues, integration problems, feature functionality, outages
- **Account**: Login/password issues, profile management, permissions, access control, account settings
- **General**: Feature requests, general inquiries, feedback, questions about capabilities

**Priority Guidelines:**

- **P1**: Production down, data loss risk, security breach, service unavailable to multiple users
- **P2**: Significant feature broken, customer financial impact, service degraded but available, high-value customer impacted
- **P3**: Standard issue resolution needed, workaround available, single-user impact, moderate urgency
- **P4**: Feature requests, general questions, documentation needs, low-urgency feedback

**Best Practices:**

1. Review the triage output before forwarding to assigned team—occasional context adjustment improves routing accuracy
2. Use `classify` for fast pre-screening when volume is high; use `triage` for complete workflow integration
3. Store the queue summary for display in your ticket system for quick agent context
4. The first-response draft maintains professional tone while buying time for deeper investigation
5. Mark tickets as escalated or expedited if customer relationship value warrants priority override
6. Track which team assignments have highest resolution times to optimize routing heuristics
7. Periodically review misclassified tickets to identify category boundary cases for team training

**Integration Tips:**

- Connect to webhook receivers on new ticket creation for real-time triage
- Store triage results in ticket metadata for sorting and filtering
- Use category/priority for automated assignment rules in your ticketing system
- Export triage data monthly to identify common issues and training needs
