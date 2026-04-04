---
name: "Contract Clause Extractor"
type: skill
version: "1.0.0"
description: "Reads contract text and extracts structured summaries of key clauses including parties, dates, terms, payments, liability, IP ownership, and risk flags."
author: "vibecodin.gg"
tags:
  - contracts
  - legal-review
  - document-analysis
  - clause-extraction
  - compliance
  - risk-assessment
  - contract-management
license: MIT
created: "2026-04-04"
updated: "2026-04-04"
tested_with:
  - claude-sonnet-4-6

trigger: "Natural language request to extract, summarize, or analyze key clauses and terms from a contract or agreement document. Common triggers include: 'extract contract clauses', 'analyze this agreement', 'summarize the key terms', 'what are the risk items in this contract?', 'pull out the important sections'."

commands:
  - name: "extract"
    description: "Parse a contract and extract structured information on parties, dates, key commercial terms, liability provisions, IP ownership, confidentiality, governing law, and identified risk items."
  - name: "flag-risks"
    description: "Identify and summarize unusual, restrictive, or high-risk clauses that warrant legal review or negotiation."

dependencies:
  note: "No dependencies required for this skill to function."
  tools: []
  mcps: []
  skills: []
---

## Overview

Contract Clause Extractor automates the initial review of contracts by parsing agreement text and producing a structured summary of essential clauses and terms. This skill is designed for business professionals, legal teams, and contract managers who need to quickly understand the commercial and legal landscape of agreements without conducting a line-by-line legal review.

The skill extracts and organizes:

- **Parties & Effective Date** — Who are the signatories and when does the agreement take effect?
- **Term & Termination** — How long is the agreement and under what conditions can it be ended?
- **Payment Terms** — What are the commercial considerations, fees, payment schedules, and late-payment consequences?
- **Liability & Indemnification** — How are damages allocated and what indemnification obligations exist?
- **IP Ownership** — Who owns intellectual property created or used under the agreement?
- **Confidentiality Obligations** — What information is confidential and for how long?
- **Governing Law & Dispute Resolution** — Which jurisdiction governs and how are disputes resolved?
- **Risk Flags** — Unusual clauses, restrictive provisions, or items requiring special attention.

A risk summary at the end highlights any provisions that may require negotiation or legal review.

**Important Legal Disclaimer:** This skill is not a substitute for legal advice. Extracted summaries are a first pass to facilitate review. All contracts should be reviewed by qualified legal counsel before execution. This tool may miss context-specific implications or applicable law nuances.

## Usage

### Basic Contract Extraction

Provide a contract in plain text or paste the full agreement text. The skill will parse it and return a structured extraction:

```
extract: [paste or provide contract text]
```

### Risk Flag Analysis

After extraction, request a focused risk assessment:

```
flag-risks: [contract extract or full text]
```

This returns a prioritized list of clauses that may require negotiation or legal review.

## Examples

### Example 1: Software License Agreement

**Input:** A 12-page SaaS subscription agreement between Acme Inc. and TechVendor LLC.

**Extracted Output:**

```
PARTIES & EFFECTIVE DATE
- Licensor: TechVendor LLC
- Licensee: Acme Inc.
- Effective Date: January 1, 2026
- Execution Date: December 15, 2025

TERM & TERMINATION
- Initial Term: 3 years
- Auto-renewal: Yes, for successive 1-year periods
- Termination for Convenience: Either party may terminate with 90 days written notice after initial 3-year term
- Termination for Cause: Immediate termination for material breach not cured within 30 days
- Early Termination Penalty: None for termination after initial term; prohibited before end of initial term except for cause

PAYMENT TERMS
- Annual Fee: $150,000 USD
- Billing: Quarterly in advance
- Late Payment: 1.5% monthly interest (18% annually) on overdue amounts
- Currency: USD
- Taxes: Licensee responsible for all applicable taxes except vendor's income tax

LIABILITY & INDEMNIFICATION
- Limitation: Neither party liable for indirect, incidental, or consequential damages
- Liability Cap: Lesser of (a) amount paid in preceding 12 months or (b) $500,000
- Indemnification: Licensor indemnifies Licensee against third-party IP infringement claims
- Licensee indemnifies Licensor against claims arising from Licensee's use of the software outside Documentation scope

IP OWNERSHIP
- Software & Documentation: Remain property of TechVendor LLC
- Feedback: TechVendor may use any feedback provided without obligation or compensation
- Customer Data: Acme retains ownership; TechVendor has license limited to service delivery

CONFIDENTIALITY OBLIGATIONS
- Duration: 5 years post-termination
- Permitted Disclosures: Required by law (with notice to disclosing party if legally permissible)
- Standard: Non-public information marked as confidential or reasonably identifiable as confidential

GOVERNING LAW & DISPUTE RESOLUTION
- Governing Law: State of Delaware, excluding conflict of law principles
- Venue: Federal courts located in Delaware
- Dispute Resolution: Good faith negotiation required; escalation to executive sponsors before litigation
- No Class Actions: Disputes must be resolved individually; no class action lawsuits permitted

RISK FLAGS
- Auto-renewal clause without explicit opt-out mechanism; requires calendar reminder for renewal period
- 90-day termination notice requirement locks vendor relationship for additional 3 months after term expiry
- Feedback clause grants royalty-free rights to all user suggestions; consider limiting scope
- Liability cap of $500,000 may be insufficient if software failure causes significant business disruption
- Dispute escalation requirement may delay time-sensitive injunctive relief needs
```

### Example 2: Independent Contractor Agreement

**Input:** A contractor agreement between a company and a freelance consultant.

**Extracted Output:**

```
PARTIES & EFFECTIVE DATE
- Company: MediaWorks Inc.
- Contractor: Jane Smith (Sole Proprietor)
- Effective Date: February 1, 2026
- Term: Project-based (completion of Scope of Work)

TERM & TERMINATION
- Engagement: At-will; either party may terminate with 5 business days written notice
- Termination for Convenience: Allowed with 5 days notice; company may stop work immediately
- Final Payment: Due within 30 days of termination; limited to work completed and accepted

PAYMENT TERMS
- Fee: $75 per hour
- Hours Limit: Not to exceed 40 hours per week without prior written approval
- Invoicing: Monthly invoices due within 30 days
- Late Payment: No interest specified; implies net 30 standard terms
- Expenses: Reimbursable if pre-approved in writing; limited to specified categories

LIABILITY & INDEMNIFICATION
- Contractor maintains professional liability insurance (amount not specified)
- Contractor indemnifies company for claims related to Contractor's work product or negligence
- Company indemnifies Contractor against claims that commissioned work doesn't infringe third-party IP

IP OWNERSHIP
- Work Product: Exclusive ownership by MediaWorks Inc.
- Pre-existing IP: Contractor retains ownership of tools, methods, or templates developed before engagement
- Moral Rights: Contractor waives all moral rights to work product

CONFIDENTIALITY OBLIGATIONS
- Confidential Information: All company information marked confidential or discussed in confidence
- Duration: 3 years post-termination
- Standard NDA Language: Typical protective provisions

GOVERNING LAW & DISPUTE RESOLUTION
- Governing Law: California (Contractor's location)
- Venue: California courts
- Dispute Resolution: Binding arbitration; cost-sharing between parties

RISK FLAGS
- "At-will" termination with only 5 days notice creates instability; consider 30-day minimum
- No exclusivity clause defined; contractor may work for competitors or conflicting clients
- Professional liability insurance required but amount/scope not specified in agreement
- Waiver of moral rights may be unenforceable in some jurisdictions; review with CA legal counsel
- Binding arbitration clause prevents injunctive relief in IP disputes
```

### Example 3: Non-Disclosure Agreement (NDA)

**Input:** A mutual NDA between two companies exploring a potential partnership.

**Extracted Output:**

```
PARTIES & EFFECTIVE DATE
- Disclosing Party A: InnovateTech Corp.
- Disclosing Party B: GlobalPartners LLC
- Effective Date: March 15, 2026
- Term: 5 years from execution date

TERM & TERMINATION
- Confidentiality Period: 5 years
- Automatic Expiration: Yes, at end of 5-year term
- Early Termination: Either party may terminate with 30 days written notice; obligations survive for confidential information disclosed during active term
- Return of Materials: Upon termination, confidential information must be returned or certified destroyed within 30 days

PAYMENT TERMS
- No monetary obligations specified in this NDA

LIABILITY & INDEMNIFICATION
- No indemnification clause present

IP OWNERSHIP
- No IP ownership transfers; information remains property of disclosing party
- No license granted to use, copy, or exploit disclosed information beyond evaluation purposes

CONFIDENTIALITY OBLIGATIONS
- Scope: Non-public, proprietary information including business plans, technical data, financials, customer lists
- Standard of Care: Information protected to same standard as disclosing party's own confidential information (reasonable care standard)
- Permitted Use: Evaluation of potential business opportunity only
- Permitted Disclosures:
  * Employees and advisors who need to know (with confidentiality obligations)
  * Required by law or court order (with notice to disclosing party if permitted)
  * Information already in public domain or independently developed

GOVERNING LAW & DISPUTE RESOLUTION
- Governing Law: New York
- Venue: New York courts
- Injunctive Relief: Explicitly permitted for breach; parties acknowledge monetary damages may be insufficient

RISK FLAGS
- "Reasonable care" standard is vague; best practice would specify "same as proprietary information" (already stated but could be clearer)
- 5-year confidentiality period is moderate; some industries expect 7-10 years for sensitive tech
- No defined evaluation period (e.g., 30 days to review); ongoing access rights not limited
- Return of materials clause lacks specificity on what constitutes "certified destroyed"
- Injunctive relief language is appropriate but should be coupled with non-exclusive remedy clause to avoid disputes
```

## Notes

### When to Use This Skill

- **Initial Contract Review:** Quick scan before sending to legal counsel to understand the landscape.
- **Contract Comparison:** Analyze multiple agreements to identify standard vs. unusual terms.
- **Risk Prioritization:** Pinpoint clauses requiring negotiation or legal review.
- **Onboarding & Due Diligence:** Extract key terms from vendor, customer, or partnership agreements as part of a workflow.
- **Compliance Tracking:** Document key obligations (confidentiality duration, indemnification scope, termination conditions).

### Limitations & Caveats

- **Not Legal Advice:** This skill provides a summary tool only. All contracts require review by qualified legal counsel in the relevant jurisdiction before execution.
- **Jurisdictional Variation:** Contract law varies significantly by jurisdiction. Extracted summaries cannot account for all local nuances.
- **Context & Interpretation:** The skill extracts explicit language but may miss implications or interplay between clauses that legal review would catch.
- **Completeness:** Dense or highly specialized contracts (e.g., complex financing documents) may require additional human review of underlying intent.
- **Updates & Amendments:** Always review amendments, exhibits, and schedules—the skill extracts main agreement text only.

### Legal Disclaimer

**This skill is not a substitute for legal advice.** Contract analysis requires professional legal expertise tailored to your specific circumstances, industry, jurisdiction, and risk profile. While this tool facilitates efficient initial review, all contracts should be reviewed by qualified legal counsel licensed in the relevant jurisdiction before execution. The extraction and risk summary are a first pass to organize information and flag items for deeper review—they do not constitute legal opinions or replace attorney-client advice.

### Best Practices

1. **Always obtain legal review** before signing any agreement based on this tool's output.
2. **Cross-reference source text** — if an extraction seems unclear, review the original clause.
3. **Consider your industry & jurisdiction** — some flags may be normal in your context; others may be red flags.
4. **Review exhibits & schedules** — supplementary documents often contain important commercial terms.
5. **Document negotiation history** — track which clauses were negotiated or waived to understand final risk allocation.
6. **Set calendar reminders** — for renewal deadlines, termination notice windows, and confidentiality expiration dates.
