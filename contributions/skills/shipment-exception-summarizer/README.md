---
name: "Shipment Exception Summarizer"
type: skill
version: "1.0.0"
description: "Transforms raw shipment tracking data and exception logs into actionable summaries with SLA risk assessment for logistics coordinators."
author: "vibecodin.gg"
tags:
  - logistics
  - tracking
  - exception-handling
  - shipment-management
  - sla-monitoring
  - visibility
  - supply-chain
license: MIT
created: "2026-04-04"
updated: "2026-04-04"
tested_with:
  - claude-sonnet-4-6

trigger: "Use this skill when reviewing shipment exceptions, tracking delays, or processing daily exception queues to generate consistent, actionable summaries for logistics coordination."

commands:
  - name: "summarize"
    description: "Parse raw shipment tracking data or exception logs and produce a structured exception summary including shipment ID, locations, status timeline, exception type, and recommended actions."
  - name: "escalate"
    description: "Evaluate exception severity and SLA impact, flagging shipments at risk of SLA breach with escalation recommendations."

dependencies:
  note: "No dependencies required for this skill to function."
  tools: []
  mcps: []
  skills: []
---

## Overview

The Shipment Exception Summarizer is a purpose-built skill for logistics coordinators and supply chain managers who need to quickly process and prioritize shipment exceptions. Instead of manually parsing tracking logs, carrier messages, and status updates, this skill transforms unstructured exception data into clean, standardized summaries that enable faster decision-making and escalation.

**Core value:**
- Extracts key shipment details (ID, origin, destination, dates) automatically
- Classifies exceptions into standard types (delay, damage, lost, customs hold, weather, security)
- Calculates timeline deviations against expected SLA windows
- Recommends specific next actions based on exception type
- Flags shipments at SLA risk for immediate escalation

**Designed for:**
- Daily exception queue reviews
- Shipment status reconciliation
- Customer escalation handling
- Performance reporting and root cause analysis

## Usage

### Summarize Command

Paste or describe raw shipment tracking data, carrier exception logs, or unstructured status notes. The skill will:

1. Extract shipment identifier and routing details
2. Parse timeline events (expected vs. actual)
3. Identify and classify the exception type
4. Assess impact against SLA commitments
5. Generate structured output with recommended actions

**Input format:** Natural language, log excerpts, carrier messages, or free-form notes. Can include:
- Tracking numbers
- Event timestamps and statuses
- Carrier or system alerts
- Manual notes from customer service interactions
- Photographic or scanned tracking documents

**Output structure:**
```
Shipment ID: [identifier]
Route: [origin] → [destination]
Expected Delivery: [date/time window]
Actual Status: [current status and timestamp]
Exception Type: [classified category]
Timeline Deviation: [duration and direction]
Recommended Action: [specific next step]
SLA Risk: [Yes/No with reasoning]
Priority Level: [High/Medium/Low]
```

### Escalate Command

Use this when you need to evaluate whether a shipment should be escalated to senior management, customer service, or the carrier. Provides:
- SLA breach probability
- Customer impact assessment
- Suggested escalation path
- Communication talking points for customer outreach

## Examples

### Example 1: Customs Hold Delay

**Input:**
```
Tracking #US-AK-9847332
Shipped 3/28 from Shanghai port to Los Angeles
Expected delivery: 4/8/2026
Current status: Held at US Customs in Los Angeles since 4/6
Note says: "Documentation mismatch - importer license not matching bill of lading"
Customer is a tech distributor who needs parts for Monday production
```

**Output:**
```
Shipment ID: US-AK-9847332
Route: Shanghai → Los Angeles, CA
Expected Delivery: 2026-04-08 (3 days overdue)
Actual Status: Customs hold - documentation mismatch (since 2026-04-06)
Exception Type: Customs Hold
Timeline Deviation: +3 days past SLA window
Recommended Action: Contact importer; request corrected documentation or power of attorney filing with broker immediately. Follow up with CBP broker to expedite clearance review (typical 4-6 hours once resolved).
SLA Risk: YES - High probability of breach unless documentation resolved within 24 hours
Priority Level: HIGH
Notes: Customer production impact makes this time-sensitive. Escalate to customer service for direct outreach.
```

### Example 2: Carrier Delay En Route

**Input:**
```
Tracking: CA-2026-88412
FedEx Ground, picked up 4/1 from warehouse in Memphis
Scheduled delivery: 4/4 to Denver
Last scan: 4/3 at 11:47pm in Kansas City distribution center
No updates for 14 hours; truck departed without package
New estimated delivery: 4/5 (pending)
```

**Output:**
```
Shipment ID: CA-2026-88412
Route: Memphis, TN → Denver, CO
Expected Delivery: 2026-04-04 (1 day overdue)
Actual Status: Delayed at Kansas City - missed outbound truck (last scanned 2026-04-03 23:47)
Exception Type: Transit Delay
Timeline Deviation: +1 day confirmed; tracking suspended for 14+ hours
Recommended Action: Contact FedEx Ground Denver facility directly for package location verification. Request expedited delivery via next available truck. If not located within 2 hours, escalate to FedEx exception management.
SLA Risk: YES - Ground service SLA at critical risk; 1-day recovery window closing
Priority Level: HIGH
Notes: Extended scan gap suggests sorting issue or package misload. Recommend carrier investigation as follow-up quality item.
```

### Example 3: Damage in Transit

**Input:**
```
Shipment LG-7634-INT from supplier in Mexico
300 units of ceramic tiles, value $8,400
Received by warehouse 4/2, warehouse notes: "Significant corner damage on 2 pallets, ~60 units affected. Packaging was compromised."
Carrier: Mexico-US Logistics
```

**Output:**
```
Shipment ID: LG-7634-INT
Route: Mexico (origin) → US Warehouse
Expected Delivery: 2026-04-02 (on-time arrival)
Actual Status: Received with damage - 60 units (20% of shipment) compromised
Exception Type: Damage in Transit
Timeline Deviation: None (arrived on schedule)
Recommended Action: File damage claim with Mexico-US Logistics within 24 hours with warehouse photos and inventory discrepancy report. Contact supplier regarding replacement shipment for damaged units. Do not dispose of damaged goods until carrier inspection scheduled.
SLA Risk: NO (delivery SLA met, but financial SLA at risk)
Priority Level: MEDIUM
Notes: Damage pattern suggests inadequate corner protection during handling. Recommend changing packaging spec for future shipments with this supplier.
```

### Example 4: Lost Shipment

**Input:**
```
Tracking #WX-104422
UPS Next Day Air, shipped from Oakland 3/31
Destination: New York
Expected: 4/1 by 10:30am
No scans after 3/31 5pm departure from Oakland facility
Last known location: UPS Oakland, CA
Shipper has searched tracking daily; no updates for 3 days
Insurance: None
Value: $2,200
```

**Output:**
```
Shipment ID: WX-104422
Route: Oakland, CA → New York, NY
Expected Delivery: 2026-04-01 (3 days overdue)
Actual Status: Missing - no scans since departure from origin facility (2026-03-31 17:00)
Exception Type: Lost Shipment
Timeline Deviation: +3 days; presumed unrecoverable
Recommended Action: File carrier exception report with UPS immediately if not done. Submit proof of loss documentation (invoice, shipping label, photos of packaged goods) to initiate claim process. Without insurance, liability is limited to declared value on label. Explore whether shipment can be filed as a filing claim under carrier's liability window (typically 90 days post-shipping).
SLA Risk: YES - Definitive SLA breach
Priority Level: CRITICAL
Notes: High-value uninsured shipment. Recommend escalation to legal/claims team and customer for potential compensation discussion. Review insurance practices for future shipments of this value.
```

## Notes

**Exception Type Classification:**

- **Delay:** Shipment behind schedule but in carrier custody; recovery is possible
- **Damage:** Physical harm to goods detected upon receipt or in transit scan
- **Lost:** No tracking updates for extended period (typically 48+ hours) with no known location
- **Customs Hold:** Regulatory or documentation issue preventing clearance
- **Weather:** Carrier delay due to weather events (temporary, expected recovery)
- **Security Hold:** Security screening or compliance verification in progress
- **Capacity/Backlog:** Carrier facility or transportation capacity constraint (temporary)
- **Recipient Issue:** Delivery attempt failure, refused delivery, or recipient unavailable

**SLA Risk Assessment Logic:**

- Compare actual delivery date/time against contractual SLA window
- Account for remaining business hours or cutoff times
- Consider exception type recoverability (e.g., lost shipments are unrecoverable; delays might be)
- Flag as HIGH RISK if < 24 hours remain to meet SLA
- Flag as CRITICAL if SLA deadline has passed

**Best Practices:**

1. **Document everything:** When summarizing, include all relevant dates, locations, and system references so escalations can be traced
2. **Distinguish cause from symptom:** A delay might be caused by customs hold, weather, or carrier staffing; the root cause affects the remedy
3. **Escalate early:** Don't wait for SLA breach notification; flag at-risk shipments proactively
4. **Track patterns:** Use exception summaries to identify recurring issues (e.g., specific carriers, routes, or suppliers causing repeated delays)
5. **Customer communication:** Share executive summaries of exceptions with customers in plain language; technical details matter less than actions being taken

**Common Scenarios:**

- **Stuck in customs:** Address documentation immediately; every hour delays clearance
- **No scans for 24+ hours:** Treat as potential loss; escalate to carrier exception team
- **Weekend/holiday timing:** Account for reduced carrier operations when calculating recovery windows
- **International shipments:** Build in regulatory clearance buffers; assume 12-24 hour hold for inspection
- **High-value shipments:** Prioritize over commodity shipments if SLA windows are comparable

**Tips for Logistics Coordinators:**

- Use the summarize command as a first filter for daily exception queues to identify priority items
- Use the escalate command before forwarding issues to customer service or senior management
- Keep summaries concise and action-focused; busy teams need next steps, not historical narrative
- Reference shipment ID and exception type in all written communications to maintain traceability
- Archive summaries for monthly exception reporting and trend analysis
