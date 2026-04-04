---
name: "RFP Requirements Parser"
type: skill
version: "1.0.0"
description: "Extracts structured requirements from RFP documents to help vendors assess fit and prepare responses efficiently."
author: "vibecodin.gg"
license: MIT
tags:
  - procurement
  - rfp
  - requirements-extraction
  - vendor-evaluation
  - sourcing
  - compliance
  - structured-data
created: "2026-04-04"
updated: "2026-04-04"
tested_with:
  - claude-sonnet-4-6

trigger: "Use this skill when you need to analyze an RFP document and extract key requirements, evaluation criteria, compliance needs, and submission details into an actionable checklist for vendor response preparation."

commands:
  - name: "parse"
    description: "Analyzes RFP document text and extracts eight structured sections: project overview, scope of work, deliverables, evaluation criteria, submission requirements, key dates, qualifications, and compliance requirements."
  - name: "checklist"
    description: "Generates a vendor-ready assessment checklist from parsed RFP data, organized by priority and dependency, showing must-have vs. nice-to-have requirements."

dependencies:
  note: "No dependencies required for this skill to function."
  tools: []
  mcps: []
  skills: []
---

## Overview

The RFP Requirements Parser is designed for procurement teams, sourcing managers, and vendors responding to Request for Proposal documents. It transforms unstructured RFP text into clean, actionable structured data that accelerates evaluation and response preparation.

**Key capabilities:**
- **Intelligent extraction** of eight critical RFP sections without requiring specific formatting
- **Structured output** as organized JSON or Markdown checklist
- **Vendor assessment support** identifying gaps between vendor capabilities and RFP requirements
- **Timeline visualization** highlighting critical dates and milestone dependencies
- **Compliance flagging** of certification and regulatory requirements
- **Criteria prioritization** distinguishing mandatory vs. optional requirements

This skill eliminates manual re-reading of lengthy RFP documents and ensures procurement teams capture all requirements consistently.

## Usage

### Command: parse
Invoke with RFP document text to extract structured requirements.

```
Parse this RFP and extract the requirements structure:

[Paste full RFP text or upload RFP file]
```

Output structure:
```json
{
  "project_overview": {
    "title": "string",
    "client": "string",
    "duration": "string",
    "budget_range": "string or null"
  },
  "scope_of_work": ["array of scope items"],
  "deliverables": [
    {
      "name": "string",
      "description": "string",
      "due_date": "string or null",
      "acceptance_criteria": ["array"]
    }
  ],
  "evaluation_criteria": [
    {
      "criterion": "string",
      "weight": "percentage or null",
      "mandatory": boolean,
      "description": "string"
    }
  ],
  "submission_requirements": {
    "format": "string",
    "page_limits": "string or null",
    "required_sections": ["array"],
    "submission_method": "string",
    "submission_deadline": "string"
  },
  "key_dates": [
    {
      "event": "string",
      "date": "string",
      "type": "milestone | deadline | kickoff | review"
    }
  ],
  "required_qualifications": [
    {
      "qualification": "string",
      "mandatory": boolean,
      "description": "string"
    }
  ],
  "compliance_requirements": [
    {
      "requirement": "string",
      "standard": "string or null",
      "deadline": "string or null",
      "description": "string"
    }
  ]
}
```

### Command: checklist
Invoke with RFP requirements to generate a vendor assessment checklist.

```
Create an assessment checklist from this RFP:

[Paste RFP or parsed requirements]
```

Output example:
```markdown
# Vendor Assessment Checklist: [Project Name]

## Critical Path (Must Have)
- [ ] [Requirement 1] — Due [date]
- [ ] [Requirement 2] — Addresses evaluation criterion [name]

## Scope & Deliverables
- [ ] [Deliverable A] with acceptance criteria [list]
- [ ] [Deliverable B] with acceptance criteria [list]

## Qualifications & Compliance
- [ ] [Certification X] required
- [ ] [Certification Y] required
- [ ] [Regulatory compliance Z] documented

## Submission Checklist
- [ ] [Format requirement]
- [ ] [Content section]
- [ ] [Page limit adherence]
```

## Examples

### Example 1: SaaS Platform Development RFP
**RFP excerpt:**
"Develop a multi-tenant SaaS platform for healthcare providers. Must support 500 concurrent users, HIPAA compliance, and integrate with existing EHR systems. Deliverables include working system by Q3 2026, documentation, and 90-day post-launch support. Vendors must hold ISO 27001 certification."

**Parser output (checklist form):**
```
# Vendor Checklist: SaaS Platform Development

## Critical Requirements
- [ ] Multi-tenant architecture (must support 500 concurrent users)
- [ ] HIPAA compliance certification — Deadline: Before launch
- [ ] ISO 27001 certification — Must-have qualification
- [ ] EHR system integration capability

## Deliverables
- [ ] Working SaaS platform — Due Q3 2026
- [ ] Complete technical documentation
- [ ] API documentation and integration guide
- [ ] 90-day post-launch support plan

## Timeline
- [ ] Initial demo/POC — [Date from RFP]
- [ ] Beta version deployment — [Date from RFP]
- [ ] Full system launch — Q3 2026
- [ ] Post-launch support period — 90 days

## Evaluation Focus
- Technical architecture and scalability (25%)
- Security and compliance posture (30%)
- Prior HIPAA project experience (25%)
- Cost and timeline realism (20%)
```

### Example 2: Content Creation Services RFP
**RFP excerpt:**
"Agency needed for 12-month content creation contract. Deliverables: 48 blog posts (1,500-2,000 words), 12 whitepapers (5,000-8,000 words), social media calendar management. Monthly reporting required. Agency must provide 2 prior client references for similar scope. Budget: $80K-$120K. Responses due by April 15, 2026."

**Parser output highlights:**
```
Submission Requirements:
- Format: PDF or Word document
- Maximum 10 pages of proposal content
- Include portfolio (3-5 prior projects)
- Provide 2 client references with contact info
- Submit to rfp@company.com by April 15, 2026 at 5 PM EST

Deliverables:
- 4 blog posts per month (1,500-2,000 words each)
- 1 whitepaper per month (5,000-8,000 words)
- Monthly social media content calendar (30 posts minimum)
- Monthly reporting on engagement metrics

Required Qualifications:
- 5+ years B2B content creation experience (mandatory)
- Prior SaaS/technology industry experience (preferred)
- Demonstrated expertise in SEO-optimized content (mandatory)
- 2 professional references available (mandatory)
```

### Example 3: Infrastructure Upgrade RFP
**RFP excerpt:**
"Modernize data center infrastructure: migrate from legacy systems to cloud-native architecture. Phased approach: Phase 1 (database migration), Phase 2 (application containerization), Phase 3 (observability platform). Each phase includes testing, documentation, and training. SOC 2 Type II compliance required. Must complete Phase 1 by Dec 2026."

**Parser output (compliance section):**
```
Compliance & Certification Requirements:
- [ ] SOC 2 Type II compliance (mandatory, before contract execution)
- [ ] PCI DSS compliance (if handling payment data)
- [ ] Data privacy regulations (GDPR/CCPA awareness required)

Key Dates & Milestones:
- [ ] Proposal submission: May 1, 2026
- [ ] Vendor selection: May 15, 2026
- [ ] Phase 1 kickoff: June 1, 2026
- [ ] Phase 1 completion: December 1, 2026
- [ ] Phase 2 completion: June 1, 2027
- [ ] Phase 3 completion: December 1, 2027

Phase-Specific Deliverables:
Phase 1 (Database Migration):
  - [ ] Migration plan and testing strategy
  - [ ] Rollback procedure documentation
  - [ ] Performance validation report
  - [ ] Team training program

Phase 2 (Containerization):
  - [ ] Container orchestration setup
  - [ ] CI/CD pipeline configuration
  - [ ] Container image library documentation

Phase 3 (Observability):
  - [ ] Monitoring and alerting platform
  - [ ] Custom dashboards for ops team
  - [ ] Runbook documentation
```

## Notes

- **RFP format flexibility:** This skill handles RFPs in various formats and structures—numbered sections, narrative paragraphs, or mixed formats.
- **Missing sections:** If an RFP doesn't include certain information (e.g., budget, specific dates), those fields will be marked null or empty rather than requiring assumption.
- **Vendor prioritization:** The checklist command prioritizes requirements by dependency and impact, helping vendors focus on critical items first.
- **Integration with responses:** Use parsed output to track vendor compliance during proposal evaluation and to create scoring matrices.
- **Date handling:** Date references are preserved as-written from the RFP (e.g., "Q3 2026", "within 30 days of contract execution"). Vendors should clarify ambiguous dates.
- **Evaluation criteria weighting:** If the RFP specifies point values or percentages, those are captured; if not, equal weighting is assumed.
- **Compliance flagging:** This skill flags regulatory and certification requirements but does not verify current compliance status—that remains a vendor responsibility.
- **Scope creep prevention:** Use the structured scope and deliverables sections to identify requirement changes during contract execution.
