---
name: "Invoice Data Extractor"
type: skill
version: "1.0.0"
description: "Extracts structured vendor, invoice, line item, and payment data from invoice text or descriptions."
author: "vibecodin.gg"
tags:
  - finance
  - accounting
  - invoice-processing
  - ap-automation
  - data-extraction
  - structured-data
  - accounts-payable

license: MIT
created: "2026-04-04"
updated: "2026-04-04"
tested_with:
  - claude-sonnet-4-6

trigger: "Use when processing vendor invoices, automating accounts payable workflows, or extracting structured invoice data from unstructured sources like email, PDFs, or plain text descriptions."

commands:
  - name: "extract"
    description: "Parse invoice text and return structured data including vendor info, invoice number, date, line items, subtotal, tax, total due, and payment terms."

dependencies:
  note: "No dependencies required for this skill to function."
  tools: []
  mcps: []
  skills: []
---

## Overview

The **Invoice Data Extractor** skill automates the process of extracting structured financial data from invoice documents and descriptions. It parses unstructured or semi-structured invoice text and returns a clean, machine-readable JSON format containing all key invoice fields.

This skill is designed for Accounts Payable professionals and automation workflows that need to:
- Extract vendor and payment information from invoices
- Identify line items, quantities, and unit prices
- Calculate and verify subtotals, tax, and total amounts
- Capture payment terms and due dates
- Standardize invoice data for downstream processing or ERP integration

**Key capabilities:**
- Handles invoices from various vendors and formats
- Extracts vendor company name, contact info, and tax ID when present
- Identifies invoice numbers, dates, and PO references
- Parses line items with descriptions, quantities, and unit prices
- Calculates or extracts subtotal, tax amount, and total due
- Captures payment terms (net 30, net 60, etc.) and due dates
- Returns structured JSON suitable for database or ERP systems

## Usage

Invoke this skill when you have invoice text or a description that needs to be converted into structured data. Pass the raw invoice content (plain text, extracted from email body, or OCR output), and the skill will parse and structure it.

**Input:** Invoice text or description (can be formatted, email-extracted, or OCR output)

**Output:** JSON object containing:
```json
{
  "vendor": {
    "name": "string",
    "address": "string",
    "tax_id": "string",
    "contact_person": "string",
    "email": "string"
  },
  "invoice": {
    "number": "string",
    "date": "YYYY-MM-DD",
    "po_reference": "string",
    "status": "string (e.g., 'unpaid', 'paid', 'pending')"
  },
  "line_items": [
    {
      "description": "string",
      "quantity": "number",
      "unit_price": "number",
      "amount": "number",
      "account_code": "string (if present)"
    }
  ],
  "financial": {
    "subtotal": "number",
    "tax_rate": "number or null",
    "tax_amount": "number",
    "total_due": "number",
    "currency": "string (e.g., 'USD')"
  },
  "payment": {
    "terms": "string (e.g., 'Net 30')",
    "due_date": "YYYY-MM-DD",
    "payment_method": "string (if specified)"
  },
  "notes": "string (any additional invoice notes or comments)"
}
```

## Examples

### Example 1: Standard B2B Invoice

**Input:**
```
INVOICE

Vendor: Acme Manufacturing Corp
123 Industrial Blvd, Springfield, IL 62701
Tax ID: 12-3456789
Contact: John Smith (john@acme.com)

Invoice #2024-5847
Date: March 15, 2026

PO Reference: PO-2026-00482

ITEMS:
- Stainless Steel Fasteners (Box of 100)
  Qty: 5, Unit Price: $45.00, Amount: $225.00

- Industrial Grade Lubricant (1L Bottle)
  Qty: 12, Unit Price: $28.50, Amount: $342.00

Subtotal: $567.00
Sales Tax (7.5%): $42.53
TOTAL DUE: $609.53

Payment Terms: Net 30
Due Date: April 14, 2026
```

**Output:**
```json
{
  "vendor": {
    "name": "Acme Manufacturing Corp",
    "address": "123 Industrial Blvd, Springfield, IL 62701",
    "tax_id": "12-3456789",
    "contact_person": "John Smith",
    "email": "john@acme.com"
  },
  "invoice": {
    "number": "2024-5847",
    "date": "2026-03-15",
    "po_reference": "PO-2026-00482",
    "status": "unpaid"
  },
  "line_items": [
    {
      "description": "Stainless Steel Fasteners (Box of 100)",
      "quantity": 5,
      "unit_price": 45.00,
      "amount": 225.00,
      "account_code": null
    },
    {
      "description": "Industrial Grade Lubricant (1L Bottle)",
      "quantity": 12,
      "unit_price": 28.50,
      "amount": 342.00,
      "account_code": null
    }
  ],
  "financial": {
    "subtotal": 567.00,
    "tax_rate": 0.075,
    "tax_amount": 42.53,
    "total_due": 609.53,
    "currency": "USD"
  },
  "payment": {
    "terms": "Net 30",
    "due_date": "2026-04-14",
    "payment_method": null
  },
  "notes": null
}
```

### Example 2: Invoice from Email (Unstructured)

**Input:**
```
Subject: Invoice INV-26-001847 from TechSupply Inc

Hi there,

Hope this email finds you well. We've prepared your invoice for the recent server equipment purchase.

TechSupply Inc
456 Tech Park Drive, Austin, TX 78701
Contact: Sarah Martinez

Invoice Number: INV-26-001847
Date: March 20, 2026

We've listed out everything:
- Dell PowerEdge R750 Rack Server: 2 units @ $3,200 each = $6,400
- Server Rack 48U with cooling: 1 unit @ $2,150 = $2,150
- Network Setup and Configuration (labor): 20 hours @ $85/hr = $1,700

Before tax: $10,250.00
Tax (8.25%): $845.63
Grand Total: $11,095.63

Payment is due within 45 days. We accept wire transfer or ACH.

Thanks,
Sarah
```

**Output:**
```json
{
  "vendor": {
    "name": "TechSupply Inc",
    "address": "456 Tech Park Drive, Austin, TX 78701",
    "tax_id": null,
    "contact_person": "Sarah Martinez",
    "email": null
  },
  "invoice": {
    "number": "INV-26-001847",
    "date": "2026-03-20",
    "po_reference": null,
    "status": "unpaid"
  },
  "line_items": [
    {
      "description": "Dell PowerEdge R750 Rack Server",
      "quantity": 2,
      "unit_price": 3200.00,
      "amount": 6400.00,
      "account_code": null
    },
    {
      "description": "Server Rack 48U with cooling",
      "quantity": 1,
      "unit_price": 2150.00,
      "amount": 2150.00,
      "account_code": null
    },
    {
      "description": "Network Setup and Configuration (labor)",
      "quantity": 20,
      "unit_price": 85.00,
      "amount": 1700.00,
      "account_code": null
    }
  ],
  "financial": {
    "subtotal": 10250.00,
    "tax_rate": 0.0825,
    "tax_amount": 845.63,
    "total_due": 11095.63,
    "currency": "USD"
  },
  "payment": {
    "terms": "Net 45",
    "due_date": "2026-05-04",
    "payment_method": "Wire transfer or ACH"
  },
  "notes": "Server equipment purchase"
}
```

### Example 3: International Invoice with Multiple Tax Rates

**Input:**
```
INVOICE

From: GlobalTech Solutions Ltd
Unit 5, Enterprise Park, Dublin 2, Ireland
VAT ID: IE1234567A

To: Our Customer

Invoice Ref: GL-2026-034521
Issue Date: 25 March 2026

SERVICES PROVIDED:

Cloud Hosting Services (March):
- Standard Tier (100GB) × 1 month: €500.00 (VAT 0% - reverse charge)

Professional Consulting:
- Senior Consultant: 40 hours @ €150/hour: €6,000.00 (VAT 23%)

Software License - Annual Renewal:
- Enterprise License: €2,000.00 (VAT 23%)

SUBTOTAL (excl. VAT): €8,500.00
VAT on Consulting: €1,380.00
VAT on License: €460.00
TOTAL VAT: €1,840.00

TOTAL AMOUNT DUE: €10,340.00

Payment Terms: Net 30 days
Due Date: 24 April 2026
Bank Transfer: Account details available upon request

Notes: Please include invoice reference in payment
```

**Output:**
```json
{
  "vendor": {
    "name": "GlobalTech Solutions Ltd",
    "address": "Unit 5, Enterprise Park, Dublin 2, Ireland",
    "tax_id": "IE1234567A",
    "contact_person": null,
    "email": null
  },
  "invoice": {
    "number": "GL-2026-034521",
    "date": "2026-03-25",
    "po_reference": null,
    "status": "unpaid"
  },
  "line_items": [
    {
      "description": "Cloud Hosting Services (March) - Standard Tier (100GB)",
      "quantity": 1,
      "unit_price": 500.00,
      "amount": 500.00,
      "account_code": null
    },
    {
      "description": "Professional Consulting - Senior Consultant",
      "quantity": 40,
      "unit_price": 150.00,
      "amount": 6000.00,
      "account_code": null
    },
    {
      "description": "Software License - Annual Renewal - Enterprise License",
      "quantity": 1,
      "unit_price": 2000.00,
      "amount": 2000.00,
      "account_code": null
    }
  ],
  "financial": {
    "subtotal": 8500.00,
    "tax_rate": null,
    "tax_amount": 1840.00,
    "total_due": 10340.00,
    "currency": "EUR"
  },
  "payment": {
    "terms": "Net 30",
    "due_date": "2026-04-24",
    "payment_method": "Bank Transfer"
  },
  "notes": "Please include invoice reference in payment. VAT treatment: Cloud hosting (reverse charge - 0%), Consulting and License (23%)"
}
```

## Notes

- **Flexible Input Formats:** This skill handles invoices in various formats — formal PDF extracts, email body text, OCR output, or freeform descriptions. It identifies key fields regardless of layout.

- **Partial Data:** If some fields are missing or unclear (e.g., no tax rate provided, or contact information unavailable), the skill will populate those fields as `null` rather than guessing or fabricating data.

- **Currency Detection:** The skill attempts to identify the currency from context (currency symbols, country indicators, ISO codes). If ambiguous, it defaults to USD.

- **Date Parsing:** Dates are normalized to ISO 8601 format (YYYY-MM-DD). The skill handles various date formats (US, EU, text-based).

- **Line Item Matching:** When quantity and unit price are provided, the skill verifies the line amount calculation. If there's a discrepancy, it flags this in notes.

- **Tax Handling:** This skill captures the stated tax rate and amount as presented. It does not recalculate tax (different jurisdictions have different rules). For invoices with variable tax rates by line item (e.g., some items taxed, others not), the `tax_rate` field shows the overall effective rate, and line-item-level rates are noted in the output.

- **ERP Integration Ready:** The structured JSON output is designed for easy ingestion into accounting systems, ERP platforms, or AP automation tools. Field names align with common financial data standards.

- **Duplicates & History:** This skill extracts a single invoice per invocation. If you have multiple invoices or a batch, invoke separately for each or use as part of a batch processing workflow.

- **Validation:** Always spot-check extracted data against the original source, especially amounts and dates, before submitting to payment or recording systems.
