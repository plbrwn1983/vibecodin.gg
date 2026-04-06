import { Contribution } from "./types";

const FREE_DEFAULTS = {
  pricing_model: "free" as const,
  price_one_time: null,
  price_subscription: null,
  rating_avg: 0,
  rating_count: 0,
  works_as_described_pct: null,
  trust_score: null,
};

export const contributions: Contribution[] = [
  // ── Skills ──────────────────────────────────────────────────────────
  {
    id: "email-subject-line-optimizer",
    name: "Email Subject Line Optimizer",
    type: "skill",
    version: "1.0.0",
    description:
      "Analyzes email subject lines and generates optimized variants applying open-rate best practices like curiosity gaps, personalization, urgency, and length optimization.",
    author: "vibecodin.gg",
    tags: ["email-marketing", "subject-lines", "conversion-optimization", "copywriting", "a-b-testing", "marketing-automation"],
    license: "MIT",
    created: "2026-04-04",
    updated: "2026-04-04",
    tested_with: ["claude-sonnet-4-6"],
    skill_fields: {
      trigger: "Invoke when you need to improve email subject lines for better open rates, A/B test variations, or analyze existing subject line performance.",
      commands: [
        { name: "optimize", description: "Generate 5-7 optimized subject line variants with detailed reasoning for each improvement" },
        { name: "analyze", description: "Evaluate current subject lines against industry best practices and provide specific feedback" },
      ],
      dependencies: { note: "No dependencies required for this skill to function.", tools: [], mcps: [], skills: [] },
    },
    agent_fields: null,
    raw_readme: "",
    domain: "marketing",
    subdomain: "email-automation",
    verified: true,
    verification_date: "2026-04-04",
    verification_model: "claude-sonnet-4-6",
    upvotes: 142,
    usage_count: 891,
    ...FREE_DEFAULTS,
  },
  {
    id: "lead-qualification-scorer",
    name: "Lead Qualification Scorer",
    type: "skill",
    version: "1.0.0",
    description:
      "Evaluates leads using BANT or MEDDIC criteria to generate qualification scores, reasoning, and prioritized next steps for sales follow-up.",
    author: "vibecodin.gg",
    tags: ["lead-scoring", "sales-qualification", "bant", "meddic", "lead-generation", "sales-workflow", "prospect-prioritization"],
    license: "MIT",
    created: "2026-04-04",
    updated: "2026-04-04",
    tested_with: ["claude-sonnet-4-6"],
    skill_fields: {
      trigger: "Use this skill when you need to evaluate a prospect or lead's readiness to engage, qualify them against standard sales criteria (BANT or MEDDIC), or determine priority level for sales outreach.",
      commands: [
        { name: "qualify", description: "Comprehensive lead qualification that evaluates a lead against BANT or MEDDIC criteria and returns structured analysis." },
        { name: "score", description: "Quick qualification score for a single lead that rates overall qualification and priority level." },
      ],
      dependencies: { note: "No dependencies required for this skill to function.", tools: [], mcps: [], skills: [] },
    },
    agent_fields: null,
    raw_readme: "",
    domain: "sales",
    subdomain: "lead-generation",
    verified: true,
    verification_date: "2026-04-04",
    verification_model: "claude-sonnet-4-6",
    upvotes: 98,
    usage_count: 567,
    ...FREE_DEFAULTS,
  },
  {
    id: "contract-clause-extractor",
    name: "Contract Clause Extractor",
    type: "skill",
    version: "1.0.0",
    description:
      "Reads contract text and extracts structured summaries of key clauses including parties, dates, terms, payments, liability, IP ownership, and risk flags.",
    author: "vibecodin.gg",
    tags: ["contracts", "legal-review", "document-analysis", "clause-extraction", "compliance", "risk-assessment", "contract-management"],
    license: "MIT",
    created: "2026-04-04",
    updated: "2026-04-04",
    tested_with: ["claude-sonnet-4-6"],
    skill_fields: {
      trigger: "Natural language request to extract, summarize, or analyze key clauses and terms from a contract or agreement document.",
      commands: [
        { name: "extract", description: "Parse a contract and extract structured information on parties, dates, key commercial terms, liability, IP ownership, confidentiality, governing law, and risk items." },
        { name: "flag-risks", description: "Identify and summarize unusual, restrictive, or high-risk clauses that warrant legal review or negotiation." },
      ],
      dependencies: { note: "No dependencies required for this skill to function.", tools: [], mcps: [], skills: [] },
    },
    agent_fields: null,
    raw_readme: "",
    domain: "legal-compliance",
    subdomain: "contract-management",
    verified: true,
    verification_date: "2026-04-04",
    verification_model: "claude-sonnet-4-6",
    upvotes: 87,
    usage_count: 423,
    ...FREE_DEFAULTS,
  },
  {
    id: "support-ticket-triage",
    name: "Support Ticket Triage",
    type: "skill",
    version: "1.0.0",
    description:
      "Automatically classify and route incoming support tickets with priority assessment, team recommendations, and pre-drafted first responses.",
    author: "vibecodin.gg",
    tags: ["customer-service", "ticket-management", "triage", "automation", "support-operations", "case-management"],
    license: "MIT",
    created: "2026-04-04",
    updated: "2026-04-04",
    tested_with: ["claude-sonnet-4-6"],
    skill_fields: {
      trigger: "Invoke when new support tickets arrive requiring classification, priority assessment, and initial routing decisions before assignment to support agents.",
      commands: [
        { name: "triage", description: "Full triage analysis of a support ticket including category, priority, routing, summary, and first-response draft." },
        { name: "classify", description: "Quick category and priority classification only, without routing or response draft." },
      ],
      dependencies: { note: "No dependencies required for this skill to function.", tools: [], mcps: [], skills: [] },
    },
    agent_fields: null,
    raw_readme: "",
    domain: "customer-service",
    subdomain: "ticket-management",
    verified: true,
    verification_date: "2026-04-04",
    verification_model: "claude-sonnet-4-6",
    upvotes: 76,
    usage_count: 534,
    ...FREE_DEFAULTS,
  },
  {
    id: "invoice-data-extractor",
    name: "Invoice Data Extractor",
    type: "skill",
    version: "1.0.0",
    description:
      "Extracts structured vendor, invoice, line item, and payment data from invoice text or descriptions.",
    author: "vibecodin.gg",
    tags: ["finance", "accounting", "invoice-processing", "ap-automation", "data-extraction", "structured-data", "accounts-payable"],
    license: "MIT",
    created: "2026-04-04",
    updated: "2026-04-04",
    tested_with: ["claude-sonnet-4-6"],
    skill_fields: {
      trigger: "Use when processing vendor invoices, automating accounts payable workflows, or extracting structured invoice data from unstructured sources.",
      commands: [
        { name: "extract", description: "Parse invoice text and return structured data including vendor info, invoice number, date, line items, subtotal, tax, total due, and payment terms." },
      ],
      dependencies: { note: "No dependencies required for this skill to function.", tools: [], mcps: [], skills: [] },
    },
    agent_fields: null,
    raw_readme: "",
    domain: "finance-accounting",
    subdomain: "accounts-payable",
    verified: true,
    verification_date: "2026-04-04",
    verification_model: "claude-sonnet-4-6",
    upvotes: 64,
    usage_count: 312,
    ...FREE_DEFAULTS,
  },
  {
    id: "user-story-generator",
    name: "User Story Generator",
    type: "skill",
    version: "1.0.0",
    description:
      "Transforms feature descriptions into well-formed user stories with acceptance criteria, story points, and open questions.",
    author: "vibecodin.gg",
    tags: ["product-development", "requirements-discovery", "user-stories", "agile", "story-estimation", "acceptance-criteria"],
    license: "MIT",
    created: "2026-04-04",
    updated: "2026-04-04",
    tested_with: ["claude-sonnet-4-6"],
    skill_fields: {
      trigger: "Invoke when you have a feature description, product requirement, or capability that needs to be decomposed into user stories with acceptance criteria and story point estimates.",
      commands: [
        { name: "generate", description: "Transform a feature description into one or more user stories with acceptance criteria, story point estimates, and edge cases." },
        { name: "refine", description: "Take existing user stories and refactor them for clarity, add missing acceptance criteria, or adjust story point estimates." },
      ],
      dependencies: { note: "No dependencies required for this skill to function.", tools: [], mcps: [], skills: [] },
    },
    agent_fields: null,
    raw_readme: "",
    domain: "product-development",
    subdomain: "requirements-discovery",
    verified: true,
    verification_date: "2026-04-04",
    verification_model: "claude-sonnet-4-6",
    upvotes: 113,
    usage_count: 678,
    ...FREE_DEFAULTS,
  },
  {
    id: "incident-report-generator",
    name: "Incident Report Generator",
    type: "skill",
    version: "1.0.0",
    description:
      "Transforms freeform IT incident descriptions into structured incident reports with severity levels, timelines, root cause analysis, impact assessments, resolution steps, and follow-up recommendations.",
    author: "vibecodin.gg",
    tags: ["incident-management", "IT-service-management", "incident-response", "root-cause-analysis", "postmortem-documentation", "SLA-tracking", "ITSM"],
    license: "MIT",
    created: "2026-04-04",
    updated: "2026-04-04",
    tested_with: ["claude-sonnet-4-6"],
    skill_fields: {
      trigger: "Invoke when you need to formalize an IT incident description into a professional incident report, conduct postmortem analysis, or prepare incident documentation.",
      commands: [
        { name: "generate", description: "Convert freeform incident description into a structured incident report with severity, timeline, RCA, impact, and next steps." },
        { name: "draft-postmortem", description: "Create a detailed postmortem document from incident details, including lessons learned and preventive action items." },
      ],
      dependencies: { note: "No dependencies required for this skill to function.", tools: [], mcps: [], skills: [] },
    },
    agent_fields: null,
    raw_readme: "",
    domain: "it-technology",
    subdomain: "it-service",
    verified: false,
    verification_date: null,
    verification_model: null,
    upvotes: 45,
    usage_count: 198,
    ...FREE_DEFAULTS,
  },
  {
    id: "kpi-dashboard-narrator",
    name: "KPI Dashboard Narrator",
    type: "skill",
    version: "1.0.0",
    description:
      "Transforms raw KPI data into structured executive narratives with performance analysis and strategic recommendations.",
    author: "vibecodin.gg",
    tags: ["business-intelligence", "executive-summary", "kpi-analysis", "performance-reporting", "strategic-planning", "analytics", "business-review"],
    license: "MIT",
    created: "2026-04-04",
    updated: "2026-04-04",
    tested_with: ["claude-sonnet-4-6"],
    skill_fields: {
      trigger: "When you have KPI data from a business review period and need to synthesize raw metrics into an executive narrative for leadership communication.",
      commands: [
        { name: "narrate", description: "Generate a complete executive narrative from raw KPI data, including headline summary, performance breakdown, and recommendations." },
        { name: "summarize", description: "Create a quick one-paragraph executive summary from KPI data, optimized for email or verbal briefings." },
      ],
      dependencies: { note: "No dependencies required for this skill to function.", tools: [], mcps: [], skills: [] },
    },
    agent_fields: null,
    raw_readme: "",
    domain: "executive-strategy",
    subdomain: "business-performance",
    verified: true,
    verification_date: "2026-04-04",
    verification_model: "claude-sonnet-4-6",
    upvotes: 91,
    usage_count: 445,
    ...FREE_DEFAULTS,
  },
  {
    id: "meeting-notes-summarizer",
    name: "Meeting Notes Summarizer",
    type: "skill",
    version: "1.0.0",
    description:
      "Transforms raw meeting notes into structured summaries with decisions, action items, and executive overview.",
    author: "vibecodin.gg",
    tags: ["meetings", "summarization", "workflow-automation", "operations", "project-management", "process-documentation", "decision-tracking"],
    license: "MIT",
    created: "2026-04-04",
    updated: "2026-04-04",
    tested_with: ["claude-sonnet-4-6"],
    skill_fields: {
      trigger: "Invoke when you need to organize raw meeting notes into actionable documentation.",
      commands: [
        { name: "summarize", description: "Parse meeting notes and generate a complete structured summary with metadata, decisions, action items, and executive summary." },
        { name: "extract-actions", description: "Extract only action items from meeting notes, with assigned owners and due dates if mentioned." },
      ],
      dependencies: { note: "No dependencies required for this skill to function.", tools: [], mcps: [], skills: [] },
    },
    agent_fields: null,
    raw_readme: "",
    domain: "operations",
    subdomain: "workflow-automation",
    verified: false,
    verification_date: null,
    verification_model: null,
    upvotes: 53,
    usage_count: 287,
    ...FREE_DEFAULTS,
  },
  {
    id: "shipment-exception-summarizer",
    name: "Shipment Exception Summarizer",
    type: "skill",
    version: "1.0.0",
    description:
      "Transforms raw shipment tracking data and exception logs into actionable summaries with SLA risk assessment for logistics coordinators.",
    author: "vibecodin.gg",
    tags: ["logistics", "tracking", "exception-handling", "shipment-management", "sla-monitoring", "visibility", "supply-chain"],
    license: "MIT",
    created: "2026-04-04",
    updated: "2026-04-04",
    tested_with: ["claude-sonnet-4-6"],
    skill_fields: {
      trigger: "Use this skill when reviewing shipment exceptions, tracking delays, or processing daily exception queues.",
      commands: [
        { name: "summarize", description: "Parse raw shipment tracking data or exception logs and produce a structured exception summary." },
        { name: "escalate", description: "Evaluate exception severity and SLA impact, flagging shipments at risk of SLA breach." },
      ],
      dependencies: { note: "No dependencies required for this skill to function.", tools: [], mcps: [], skills: [] },
    },
    agent_fields: null,
    raw_readme: "",
    domain: "logistics",
    subdomain: "tracking-visibility",
    verified: false,
    verification_date: null,
    verification_model: null,
    upvotes: 31,
    usage_count: 145,
    ...FREE_DEFAULTS,
  },
  {
    id: "job-description-writer",
    name: "Job Description Writer",
    type: "skill",
    version: "1.0.0",
    description:
      "Generates complete, structured job descriptions with inclusive language from brief role summaries.",
    author: "vibecodin.gg",
    tags: ["human-resources", "recruitment", "job-description", "talent-acquisition", "hr-automation", "compliance"],
    license: "MIT",
    created: "2026-04-04",
    updated: "2026-04-04",
    tested_with: ["claude-sonnet-4-6"],
    skill_fields: {
      trigger: "Invoke when you need to create a professional job description from a basic role concept or brief summary.",
      commands: [
        { name: "write", description: "Generate a complete job description from a role summary with job title, responsibilities, qualifications, and benefits sections." },
        { name: "revise", description: "Refine an existing job description to improve clarity, inclusivity, compliance, or adjust tone." },
      ],
      dependencies: { note: "No dependencies required for this skill to function.", tools: [], mcps: [], skills: [] },
    },
    agent_fields: null,
    raw_readme: "",
    domain: "human-resources",
    subdomain: "recruitment",
    verified: true,
    verification_date: "2026-04-04",
    verification_model: "claude-sonnet-4-6",
    upvotes: 72,
    usage_count: 389,
    ...FREE_DEFAULTS,
  },
  {
    id: "rfp-requirements-parser",
    name: "RFP Requirements Parser",
    type: "skill",
    version: "1.0.0",
    description:
      "Extracts structured requirements from RFP documents to help vendors assess fit and prepare responses efficiently.",
    author: "vibecodin.gg",
    tags: ["procurement", "rfp", "requirements-extraction", "vendor-evaluation", "sourcing", "compliance", "structured-data"],
    license: "MIT",
    created: "2026-04-04",
    updated: "2026-04-04",
    tested_with: ["claude-sonnet-4-6"],
    skill_fields: {
      trigger: "Use this skill when you need to analyze an RFP document and extract key requirements, evaluation criteria, compliance needs, and submission details.",
      commands: [
        { name: "parse", description: "Analyzes RFP document text and extracts eight structured sections." },
        { name: "checklist", description: "Generates a vendor-ready assessment checklist from parsed RFP data." },
      ],
      dependencies: { note: "No dependencies required for this skill to function.", tools: [], mcps: [], skills: [] },
    },
    agent_fields: null,
    raw_readme: "",
    domain: "procurement",
    subdomain: "sourcing-rfx",
    verified: false,
    verification_date: null,
    verification_model: null,
    upvotes: 28,
    usage_count: 102,
    ...FREE_DEFAULTS,
  },

  // ── Agents ──────────────────────────────────────────────────────────
  {
    id: "social-media-content-agent",
    name: "Social Media Content Agent",
    type: "agent",
    version: "1.0.0",
    description:
      "Plans, drafts, and organizes social media content across LinkedIn, X/Twitter, and Instagram with platform-optimized posts and weekly calendars.",
    author: "vibecodin.gg",
    tags: ["social-media", "content-marketing", "campaign-planning", "multi-platform", "content-calendar", "marketing", "linkedin"],
    license: "MIT",
    created: "2026-04-04",
    updated: "2026-04-04",
    tested_with: ["claude-sonnet-4-6"],
    skill_fields: null,
    agent_fields: {
      model: "claude-sonnet-4-6",
      system_prompt: "system-prompt.md",
      memory: false,
      tools: { builtin: ["Write"], mcps: [] },
      behaviors: [
        "Never publishes or schedules posts without explicit user approval",
        "Always asks for clarification if campaign brief is incomplete",
        "Generates platform-specific content — does not reuse identical copy across platforms",
      ],
      dependencies: { note: "No dependencies required for this agent to function.", skills: [], mcps: [] },
    },
    raw_readme: "",
    domain: "marketing",
    subdomain: "social-media",
    verified: true,
    verification_date: "2026-04-04",
    verification_model: "claude-sonnet-4-6",
    upvotes: 105,
    usage_count: 612,
    ...FREE_DEFAULTS,
  },
  {
    id: "interview-prep-agent",
    name: "Interview Prep Agent",
    type: "agent",
    version: "1.0.0",
    description:
      "Generates structured interview guides, question banks, scoring rubrics, and evaluation scorecards for hiring managers to prepare competency-based interviews.",
    author: "vibecodin.gg",
    tags: ["recruitment", "talent-acquisition", "hiring", "interview-preparation", "hr", "competency-based", "compliance"],
    license: "MIT",
    created: "2026-04-04",
    updated: "2026-04-04",
    tested_with: ["claude-sonnet-4-6"],
    skill_fields: null,
    agent_fields: {
      model: "claude-sonnet-4-6",
      system_prompt: "system-prompt.md",
      memory: false,
      tools: { builtin: ["Write"], mcps: [] },
      behaviors: [
        "Always includes a list of legally inadvisable interview questions to avoid",
        "Generates competency-based questions only — no personality or lifestyle questions",
        "Produces a complete interview kit before asking for revisions",
      ],
      dependencies: { note: "No dependencies required for this agent to function.", skills: [], mcps: [] },
    },
    raw_readme: "",
    domain: "human-resources",
    subdomain: "recruitment",
    verified: true,
    verification_date: "2026-04-04",
    verification_model: "claude-sonnet-4-6",
    upvotes: 89,
    usage_count: 456,
    ...FREE_DEFAULTS,
  },
  {
    id: "outreach-sequence-agent",
    name: "Outreach Sequence Agent",
    type: "agent",
    version: "1.0.0",
    description:
      "Generates personalized multi-touch sales outreach sequences with email drafts, LinkedIn messaging, and breakup copy — no sending, rep review required.",
    author: "vibecodin.gg",
    tags: ["sales", "outreach", "engagement", "prospecting", "multi-touch", "email-drafts", "linkedin-messaging"],
    license: "MIT",
    created: "2026-04-04",
    updated: "2026-04-04",
    tested_with: ["claude-sonnet-4-6"],
    skill_fields: null,
    agent_fields: {
      model: "claude-sonnet-4-6",
      system_prompt: "system-prompt.md",
      memory: false,
      tools: { builtin: [], mcps: [] },
      behaviors: [
        "Never sends emails or messages — all output is drafts for human review",
        "Always collects prospect profile and product context before generating sequences",
        "Personalizes each touchpoint — no generic copy-paste templates",
      ],
      dependencies: { note: "No dependencies required for this agent to function.", skills: [], mcps: [] },
    },
    raw_readme: "",
    domain: "sales",
    subdomain: "sales-outreach",
    verified: false,
    verification_date: null,
    verification_model: null,
    upvotes: 67,
    usage_count: 334,
    ...FREE_DEFAULTS,
  },
  {
    id: "support-escalation-agent",
    name: "Support Escalation Agent",
    type: "agent",
    version: "1.0.0",
    description:
      "Analyzes escalated customer cases, drafts de-escalation responses, and recommends resolution paths for manager approval.",
    author: "vibecodin.gg",
    tags: ["customer-service", "escalation-management", "ticket-resolution", "de-escalation", "case-analysis", "policy-exceptions", "internal-workflow"],
    license: "MIT",
    created: "2026-04-04",
    updated: "2026-04-04",
    tested_with: ["claude-sonnet-4-6"],
    skill_fields: null,
    agent_fields: {
      model: "claude-sonnet-4-6",
      system_prompt: "system-prompt.md",
      memory: false,
      tools: { builtin: ["Read", "Write"], mcps: [] },
      behaviors: [
        "Never sends responses to customers — all drafts require manager approval before use",
        "Always recommends an internal resolution path alongside the customer-facing draft",
        "Flags potential policy exceptions explicitly and explains the tradeoff",
      ],
      dependencies: { note: "No dependencies required for this agent to function.", skills: [], mcps: [] },
    },
    raw_readme: "",
    domain: "customer-service",
    subdomain: "ticket-management",
    verified: true,
    verification_date: "2026-04-04",
    verification_model: "claude-sonnet-4-6",
    upvotes: 58,
    usage_count: 267,
    ...FREE_DEFAULTS,
  },
];

// ── Query helpers ─────────────────────────────────────────────────────

export function getContributionById(id: string): Contribution | undefined {
  return contributions.find((c) => c.id === id);
}

export function getContributionsByDomain(domain: string): Contribution[] {
  return contributions.filter((c) => c.domain === domain);
}

export function getContributionsBySubdomain(
  domain: string,
  subdomain: string
): Contribution[] {
  return contributions.filter(
    (c) => c.domain === domain && c.subdomain === subdomain
  );
}

export function getContributionsByAuthor(author: string): Contribution[] {
  return contributions.filter((c) => c.author === author);
}

export function searchContributions(query: string): Contribution[] {
  const q = query.toLowerCase();
  return contributions.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export type SortKey = "upvotes" | "usage" | "recent" | "verified";

export function sortContributions(
  items: Contribution[],
  sort: SortKey = "upvotes"
): Contribution[] {
  const sorted = [...items];
  switch (sort) {
    case "upvotes":
      return sorted.sort((a, b) => b.upvotes - a.upvotes);
    case "usage":
      return sorted.sort((a, b) => b.usage_count - a.usage_count);
    case "recent":
      return sorted.sort(
        (a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()
      );
    case "verified":
      return sorted.sort(
        (a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0)
      );
    default:
      return sorted;
  }
}

export function getStats() {
  const skills = contributions.filter((c) => c.type === "skill").length;
  const agents = contributions.filter((c) => c.type === "agent").length;
  const authors = new Set(contributions.map((c) => c.author)).size;
  const domains = new Set(contributions.map((c) => c.domain)).size;
  return { skills, agents, authors, domains, total: contributions.length };
}
