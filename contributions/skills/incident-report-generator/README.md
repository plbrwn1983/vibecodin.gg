---
name: "Incident Report Generator"
type: skill
version: "1.0.0"
description: "Transforms freeform IT incident descriptions into structured incident reports with severity levels, timelines, root cause analysis, impact assessments, resolution steps, and follow-up recommendations for stakeholder handoff."
author: "vibecodin.gg"
tags:
  - incident-management
  - IT-service-management
  - incident-response
  - root-cause-analysis
  - postmortem-documentation
  - SLA-tracking
  - ITSM
license: MIT
created: "2026-04-04"
updated: "2026-04-04"
tested_with:
  - claude-sonnet-4-6

trigger: "Invoke when you need to formalize an IT incident description into a professional incident report, conduct postmortem analysis, or prepare incident documentation for stakeholder communication and compliance."

commands:
  - name: "generate"
    description: "Convert freeform incident description into a structured incident report with severity, timeline, RCA, impact, and next steps"
  - name: "draft-postmortem"
    description: "Create a detailed postmortem document from incident details, including lessons learned and preventive action items"

dependencies:
  note: "No dependencies required for this skill to function."
  tools: []
  mcps: []
  skills: []
---

## Overview

The Incident Report Generator is an IT Service Management skill designed for IT operations teams, incident managers, and on-call engineers who need to rapidly formalize incident descriptions into professional, stakeholder-ready documentation. It transforms unstructured incident narratives into standardized reports that support compliance, SLA tracking, knowledge management, and continuous improvement.

**Who it's for:**
- IT Operations (ITOps) teams managing incident backlogs
- Incident managers conducting incident triage and escalation
- On-call engineers documenting incidents for handoff
- Service desk managers tracking SLAs and incident metrics
- Compliance and audit teams requiring incident documentation
- DevOps and platform engineers conducting postmortems

**What it does:**
- Parses freeform incident descriptions and extracts key information
- Assigns severity levels (P1–P4) based on impact and scope
- Constructs chronological timelines of events with timestamps
- Identifies or placeholders root cause analysis (RCA)
- Assesses incident impact (systems affected, users impacted, business consequence)
- Documents resolution steps taken and time-to-resolve (TTR) metrics
- Generates actionable follow-up recommendations to prevent recurrence
- Formats output for immediate stakeholder distribution

## Usage

### Basic Invocation

To use this skill, provide:
1. **Freeform incident description** — the incident narrative in your own words
2. **Incident metadata** (optional) — incident ID, discovery time, resolution time, affected services, user count

### Input Format

```
generate: [Your incident narrative here]
Metadata: Incident ID, discovery time, resolution time (if available)
```

### Expected Output

For each incident, you receive:

- **Incident Title** — concise, searchable subject
- **Severity Level** — P1 (critical), P2 (high), P3 (medium), or P4 (low)
- **Affected Systems** — list of services/components impacted
- **Discovery Time & Resolution Time** — with time-to-resolve (TTR) calculation
- **Chronological Timeline** — hour-by-hour or event-by-event sequence
- **Root Cause Analysis** — identified cause or placeholder for investigation
- **Impact Assessment** — affected user count, service degradation level, business consequence
- **Resolution Steps** — what was done to restore service
- **Follow-up Actions** — preventive measures, configuration changes, monitoring improvements, team training

### Command Variations

**`generate`** — Create a structured incident report
```
generate: Database connection pool exhausted during morning peak traffic. Connections weren't being returned after queries completed. Service became unresponsive at 8:15 AM. Incident manager escalated to DBA team. DBA increased pool size from 50 to 100. Service recovered at 9:42 AM. About 2,500 users affected. Need to review query timeout settings.
Metadata: INC-2026-4487, discovered 8:15 AM PDT, resolved 9:42 AM PDT
```

**`draft-postmortem`** — Generate a detailed postmortem and lessons-learned document
```
draft-postmortem: [incident details above]
Context: This is a recurrence of a similar incident from Q2 2025
```

## Examples

### Example 1: Database Service Degradation (P2 Incident)

**Input:**
```
generate: Our primary database started throwing connection timeout errors around 7:45 AM. Engineering noticed elevated disk I/O and slow query logs. Turned out a weekly backup job was running and locking tables. The job hadn't been scheduled to run at that time in the new DC. We killed the backup process at 8:12 AM and service came back online. Affected about 3,500 users on the web platform for 27 minutes. Database CPU also peaked at 95%.
```

**Structured Output:**

```
INCIDENT REPORT
===============

Title: Database Connection Timeouts During Unscheduled Backup Job
Incident ID: [Auto-generated if not provided]
Severity: P2 (High)
Time-to-Resolve: 27 minutes
Reported By: Engineering Team

Affected Systems:
- Primary PostgreSQL Database Cluster
- Web Application Layer (API timeout cascade)
- Customer Portal (read-only mode)
User Impact: ~3,500 active users
Business Impact: Service degradation; read operations queued

Timeline:
07:45 AM – Monitoring alert: "High database connection wait times"
07:48 AM – Support escalates to on-call DBA
07:52 AM – Engineering confirms table locks; backup job identified as culprit
08:12 AM – Backup process terminated; connections normalize
08:15 AM – Service fully restored; no data loss

Root Cause Analysis:
Unscheduled backup job running during peak traffic window. Job was not updated when database was migrated to new data center; scheduling configuration pointing to old DC backup window.

Impact Assessment:
- Severity: Database unavailable for new connections (27 min)
- Scope: All users dependent on web platform read/write operations
- Data Integrity: No data loss; transactional consistency maintained

Resolution Steps Taken:
1. Identified resource contention via slow query log analysis
2. Killed blocking backup process
3. Verified table lock release; monitored connection pool recovery
4. Manual service health check on dependent apps

Follow-up Actions:
- [ ] Update database backup scheduling to avoid peak traffic (recommend 2-4 AM PDT window)
- [ ] Audit all scheduled jobs in new DC configuration
- [ ] Increase connection pool monitoring alert threshold (set to 85% utilization)
- [ ] Document backup window changes in runbook
- [ ] Schedule team training on new DC infrastructure changes (April 2026)
- [ ] Implement automated job-pause during peak traffic hours

Assigned To: DBA Lead
Due Date: [calculated]
Status: Open
```

---

### Example 2: Network Outage (P1 Incident)

**Input:**
```
draft-postmortem: Major network outage this morning impacted our entire US East region. Happened at 6:03 AM. ISP experienced a fiber cut in their core network. Our edge routers lost BGP announcements and traffic rerouted through degraded backup links. We didn't have proper failover configured because it was assumed all traffic would just reroute automatically. It took 47 minutes to restore full capacity because the ISP had to physically repair the fiber and restore BGP session. Meanwhile we had to manually shift traffic to our West region. About 12,000 users couldn't connect. This is the second time this year we've been hit by fiber cuts in the same area. We really need to look at our architecture.
Context: This is a recurrence incident; same root cause as January 2026 outage (INC-2025-1842)
```

**Structured Postmortem Output:**

```
INCIDENT POSTMORTEM REPORT
==========================

Incident: Network Outage - US East Region
Incident ID: INC-2026-5521 (Related: INC-2025-1842)
Severity: P1 (Critical)
Date: April 4, 2026
Time-to-Resolve: 47 minutes
User Impact: 12,000+ users in US East region

Executive Summary:
A fiber cut in the ISP core network caused BGP route loss, cascading to complete unavailability of our US East region. Automatic failover mechanisms did not trigger as designed. Manual intervention was required to reroute traffic to US West infrastructure. This incident represents the second occurrence of the same infrastructure vulnerability within 90 days.

Timeline:
06:03 AM – Monitoring detects edge router BGP session loss
06:04 AM – On-call engineer notified; begins triage
06:07 AM – ISP confirms fiber cut in core network segment
06:10 AM – Engineering begins manual traffic shift to US West region
06:12 AM – Customer support receives spike in connectivity reports
06:45 AM – ISP reports fiber repair in progress
06:50 AM – BGP session restored; traffic begins rebalancing
07:00 AM – Full service restored; all traffic normalized

Root Cause Analysis:
1. Primary Cause: Fiber cut in ISP core network (external, but predictable)
2. Contributing Factor: Failover routing configuration assumed automatic BGP reroute would be sufficient
3. Secondary Cause: Lack of active-active regional architecture; US West infrastructure not pre-configured to accept full traffic load
4. Systemic Gap: Architectural debt—single ISP dependency in core routing path

Impact Assessment:
- Severity: Complete service unavailability for US East users
- Duration: 47 minutes
- Users Affected: ~12,000 in US East; ~3,000 in West (during traffic shift congestion)
- Business Impact: Revenue impact; SLA breach for Enterprise tier customers in region
- Data Impact: No data loss; all sessions recovered after reconnection

What Went Well:
- Monitoring alert fired immediately (within 1 minute of outage)
- On-call engineer escalated quickly; CEO notified within 5 minutes
- Manual traffic shift procedures existed and were executed within 8 minutes
- ISP coordination was smooth; fiber repair was industry-standard response time

What Could Have Been Better:
- Failover mechanism did not activate automatically (expected to trigger, but routing rules had a gap)
- US West region was not pre-warmed to accept full traffic; initial reroute caused congestion
- No secondary ISP path available; core network has single-provider bottleneck
- This exact scenario occurred January 17, 2026 (INC-2025-1842); actions recommended then were not completed

Lessons Learned:
1. **Recurrence Prevention**: Architectural changes to reduce ISP dependency are overdue. Same root cause, second incident = systemic risk.
2. **Failover Testing Gap**: Automated failover mechanisms exist but were not validated under actual BGP loss (drift between config and reality).
3. **Capacity Planning**: US West region is not sized to handle 100% of US East traffic; this needs remediation.
4. **Documentation Debt**: Runbooks assume automatic failover; manual steps were needed instead.

Preventive Action Plan:
- [ ] URGENT: Evaluate and prioritize secondary ISP path or carrier diversity for core network (assign DRI: Network Engineering Lead) | Target: May 1, 2026
- [ ] URGENT: Pre-warm US West region to handle 120% of normal traffic; add capacity if needed | Target: April 20, 2026
- [ ] Test and validate automated failover under BGP loss; fix routing rule gaps | Target: April 18, 2026
- [ ] Implement dual-ISP BGP session with automatic failover; negotiate redundancy SLA | Target: June 15, 2026
- [ ] Update incident runbooks to remove assumptions about automatic reroute | Target: April 8, 2026
- [ ] Schedule network architecture review; document single points of failure (SPOF) | Target: April 10, 2026
- [ ] Conduct company-wide communication on infrastructure improvements and ETA for fixes | Target: April 6, 2026

Team Action Items:
- **Network Ops**: Validate failover configuration; test with simulated BGP loss (non-prod first)
- **Engineering Lead**: Coordinate capacity planning for West region; brief executive stakeholders
- **Product/SRE**: Update status page; communicate ETA to affected customers
- **Finance**: Prepare SLA credit analysis and customer communication for Enterprise tier contracts

Recurrence Risk:
**HIGH** – This is the second occurrence in 90 days. Without architectural changes (secondary ISP, regional capacity rebalance), expect recurrence within Q2 2026 if similar fiber incidents occur.

Assigned To: VP of Infrastructure
Due Date: May 1, 2026 (primary remediation milestone)
Status: Open / Under Review

Stakeholder Notification:
- [ ] Executive Leadership (CEO, COO) – Briefed same day
- [ ] Enterprise Customers (affected) – SLA credit + roadmap shared
- [ ] Engineering All-Hands – Postmortem review scheduled
- [ ] Board of Directors – Risk mitigation plan presented
```

---

### Example 3: Application Deployment Issue (P3 Incident)

**Input:**
```
generate: This morning's 10:30 AM production deployment introduced a bug in the payment processing module. New code was supposed to add retry logic for failed transactions but it had an off-by-one error in the retry counter. This caused some payment requests to be retried 11 times instead of 3 times, creating duplicate charges. We caught it when customer support started getting complaints about double-charged accounts around 11:15 AM. We rolled back the deployment at 11:47 AM. About 340 transactions were affected. Finance team is manually reviewing the duplicate charges now. We need to look at our testing process because this should have been caught in staging.
Metadata: Deployment SHA: abc1234, rollback time: 11:47 AM
```

**Structured Output:**

```
INCIDENT REPORT
===============

Title: Duplicate Charge Bug in Payment Processing - Production Rollback
Incident ID: INC-2026-5512
Severity: P3 (Medium)
Time-to-Resolve: 77 minutes (detection to rollback)
Reported By: Customer Support Team
Deployment: abc1234 (rolled back)

Affected Systems:
- Payment Processing Module
- Transaction Ledger
- Billing API
Services: Live transaction processing only; read operations unaffected

User Impact: 340 unique transactions with duplicate charges
Business Impact: Customer churn risk; compliance review needed; manual remediation required

Timeline:
10:30 AM – Production deployment (Payment retry logic enhancement)
10:31 AM – Canary monitoring shows normal behavior; deployment proceeds to 50% rollout
11:15 AM – First customer support tickets arrive (duplicate charges reported)
11:20 AM – Support escalates to engineering; on-call reviews recent deployments
11:28 AM – Root cause identified: off-by-one error in retry counter (line 847, payment_service.py)
11:47 AM – Rollback of deployment abc1234 initiated and completed
11:50 AM – Monitoring confirms duplicate charges have ceased
12:05 PM – Finance team begins manual review of affected transactions

Root Cause Analysis:
Code defect in payment retry logic: retry counter was incremented before comparison, causing up to 11 retry attempts instead of intended 3. The bug existed in code but was not caught by:
1. Unit tests (did not cover retry counter boundary condition)
2. Staging tests (did not simulate payment service failures)
3. Code review (off-by-one error not flagged)

Impact Assessment:
- Severity: Data integrity issue; customer financial impact
- Duration: ~77 minutes (10:30 AM to 11:47 AM)
- Affected Transactions: 340 unique payment requests
- Customer Impact: Unknown number of double-charged accounts (Finance to quantify)
- Revenue Impact: Chargeback risk; potential refund liability
- Compliance: PCI-DSS audit trail required; billing discrepancy documentation

Resolution Steps Taken:
1. Identified code defect in retry_count logic
2. Initiated rollback to previous stable version
3. Verified transaction stream returned to normal behavior post-rollback
4. Notified Finance for manual transaction review and customer refund processing

Follow-up Actions:
- [ ] Conduct code review of retry logic in new deployment (owner: Engineering Lead)
- [ ] Add unit tests for retry counter boundary conditions (owner: QA / Development)
- [ ] Expand staging environment tests to include payment service failure scenarios
- [ ] Implement pre-deployment checklist verification for payment-critical modules
- [ ] Review code review process; add payment module to "high-risk" review category
- [ ] Root cause post-analysis: Why did monitoring not catch this faster? (Canary metrics)
- [ ] Customer communication: Prepare proactive outreach to affected accounts
- [ ] Finance reconciliation: Complete transaction audit within 24 hours

Assigned To: Engineering Manager (Payment Services)
Due Date: April 8, 2026
Status: Open
```

---

## Notes

### Best Practices

- **Severity Assignment**: Use these guidelines if not explicitly provided:
  - **P1 (Critical)**: Service down or unavailable; high user/revenue impact (>5,000 users); data loss risk
  - **P2 (High)**: Significant degradation or feature unavailable; 1,000–5,000 users affected; potential data risk
  - **P3 (Medium)**: Feature partial failure; workaround available; <1,000 users affected; no data risk
  - **P4 (Low)**: Minor issue; cosmetic or low-priority feature; <100 users affected; no impact

- **Timeline Precision**: Include timestamps with timezone (especially for multi-region incidents). Use 24-hour format for clarity.

- **Root Cause Depth**: Distinguish between immediate cause (what broke), contributing factors (why it wasn't caught), and systemic issues (architectural debt, process gaps).

- **Impact Quantification**: Use real numbers when available (user count, revenue impact, SLA breach amount). Placeholders are acceptable during initial reporting.

- **Follow-up Specificity**: Assign each action to a person/team with a due date. Vague action items ("improve monitoring") are less likely to be completed.

- **Postmortem Timing**: Draft postmortems within 24 hours of incident closure while details are fresh. Include lessons learned to prevent recurrence.

### When to Use Each Command

| Command | Use Case |
|---------|----------|
| **`generate`** | Immediate incident documentation during/after incident response |
| **`draft-postmortem`** | Retrospective analysis (24–48 hours post-incident) for root cause and prevention |

### Common Pitfalls

- **Blame assignment**: Focus on process/systems gaps, not individual actions. Example: "Code review process did not catch X" instead of "Engineer Y missed X."
- **Incomplete timelines**: Vague time descriptions ("later that morning") reduce clarity. Always use precise timestamps.
- **RCA placeholder**: If root cause is truly unknown during reporting, say so explicitly. Don't speculate; flag for investigation.
- **Missing follow-up owners**: Actions without assigned owners rarely get completed. Always name a person or team.
- **SLA impact buried**: Lead with SLA implications if applicable. Enterprise contracts often include incident credit triggers.

### Information Gathering Tips

Before generating a report, collect:
- **Exact start time** of incident (discovery, not when first impact occurred)
- **Exact end time** of incident (when service fully restored)
- **Number of affected users/transactions** (ask support or analytics)
- **Affected business units** (sales, finance, operations, etc.)
- **Monitoring/alerting latency** (how long until detection?)
- **Names of people involved** (incident commander, on-call engineer, etc.)
- **Deployment/change info** (if incident followed a change)

### Compliance & Documentation

- **Incident retention**: Store reports for minimum 2 years per SOC 2 Type II requirements
- **PCI-DSS**: Payment-related incidents require detailed audit trails and customer notification
- **GDPR/Data Privacy**: Data access incidents require specific documentation and notification procedures
- **SLA tracking**: Escalate all P1/P2 incidents to management for SLA calculation and customer credit processing
- **Audit readiness**: Use standardized format so compliance teams can search and verify procedures

### Integration with ITSM Systems

This skill generates output compatible with:
- **ServiceNow** (paste into incident record; includes all required fields)
- **Jira Service Management** (can be reformatted as ticket descriptions)
- **PagerDuty** (use as postmortem; links to timeline data)
- **Splunk** (structure supports log correlation and RCA workflow)
- **Slack** (can be threaded for team communication)

### Performance Metrics

Track your incidents over time to measure improvement:
- **MTTR (Mean Time to Resolve)**: Aim for <60 min P1, <4 hours P2
- **MTTD (Mean Time to Detect)**: Aim for <5 min P1, <15 min P2 (monitoring latency)
- **Recurrence Rate**: If same incident recurs >1x/quarter, escalate prevention action
- **Follow-up Completion Rate**: >80% of assigned actions should close within due date

---

## Advanced Tips

### For High-Volume Incident Teams

If your team manages 20+ incidents weekly:
- Batch postmortem analysis at end-of-week; identify patterns
- Use incident categorization (database, network, deployment, etc.) to spot systemic issues
- Track MTTR trends by incident category; allocate engineering effort to highest-latency areas
- Create reusable runbooks from completed incidents

### For Executive Stakeholders

When escalating to C-suite:
- Lead with P1 incident summary (title, duration, impact, next steps)
- Quantify business impact (revenue, users, SLA credits)
- Highlight systemic risks; connect recurring incidents to budget requests
- Include timeline with decision points (when did we escalate, when did we decide to rollback, etc.)

### For Multi-Team Coordination

For incidents spanning multiple teams (networking, database, application):
- Assign a single incident commander to coordinate
- Use timeline to show handoff points between teams
- Document what each team learned; share knowledge across organization
- Highlight dependencies (e.g., "if network team had Y monitoring, DB team would have escalated 15 min earlier")

---

## Feedback & Improvements

This skill's effectiveness improves with real incident data. If you use this for incident documentation:
1. **Share RCA findings**: Highlight patterns you notice (common root causes, missed detection signals)
2. **Report follow-up completion rates**: What prevents action items from closing? Process gaps? Resource constraints?
3. **Flag blind spots**: What questions should the skill ask that it doesn't?
4. **Contribute industry examples**: Redacted incident reports help calibrate severity guidelines

Last updated: April 4, 2026 | Maintained by vibecodin.gg community
