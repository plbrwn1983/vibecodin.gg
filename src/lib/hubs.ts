import { Hub, Subdomain } from "./types";

export const hubs: Hub[] = [
  {
    name: "Marketing",
    slug: "marketing",
    description:
      "Content, campaigns, brand, analytics, and demand generation",
    subdomains: [
      { name: "Content Marketing", slug: "content-marketing", description: "Creating, planning, and optimizing written, video, and multimedia content for audience engagement and SEO." },
      { name: "Demand Generation", slug: "demand-generation", description: "Lead generation campaigns, conversion optimization, and funnel management across multiple channels." },
      { name: "Brand Management", slug: "brand-management", description: "Brand strategy, messaging consistency, visual identity guidelines, and brand compliance across touchpoints." },
      { name: "Analytics & Attribution", slug: "analytics-attribution", description: "Campaign performance measurement, data analysis, customer journey tracking, and ROI attribution." },
      { name: "Social Media Marketing", slug: "social-media", description: "Social content strategy, community management, influencer coordination, and social listening." },
      { name: "Email & Marketing Automation", slug: "email-automation", description: "Email campaign design, personalization, automation workflows, and lifecycle marketing." },
      { name: "Advertising & Media Planning", slug: "advertising", description: "Paid campaign strategy, ad creative optimization, media buying, and channel planning." },
      { name: "Market Research & Insights", slug: "market-research", description: "Competitive analysis, customer research, trend analysis, and data-driven market positioning." },
    ],
  },
  {
    name: "Sales",
    slug: "sales",
    description:
      "Prospecting, pipeline, outreach, enablement, and account management",
    subdomains: [
      { name: "Lead Generation & Prospecting", slug: "lead-generation", description: "Identifying, researching, and qualifying potential customers through various channels." },
      { name: "Pipeline Management", slug: "pipeline-management", description: "Tracking deals, managing sales stages, forecasting, and maintaining visibility into the funnel." },
      { name: "Sales Outreach & Engagement", slug: "sales-outreach", description: "Email campaigns, cold calling scripts, follow-ups, and multi-channel outreach." },
      { name: "Negotiation & Closing", slug: "negotiation-closing", description: "Handling objections, negotiating terms, creating proposals, and closing deals." },
      { name: "Sales Enablement", slug: "sales-enablement", description: "Competitive intelligence, battle cards, and product and market knowledge for sales teams." },
      { name: "Account Management", slug: "account-management", description: "Upselling, cross-selling, retention, and nurturing existing customer relationships." },
      { name: "Sales Reporting & Analytics", slug: "sales-analytics", description: "Dashboards, metrics, KPI tracking, and analytics for measuring performance." },
      { name: "Territory & Quota Management", slug: "territory-quota", description: "Defining territories, assigning quotas, planning capacity, and optimizing allocation." },
    ],
  },
  {
    name: "Finance & Accounting",
    slug: "finance-accounting",
    description:
      "Bookkeeping, reporting, budgeting, tax, and treasury",
    subdomains: [
      { name: "Accounts Payable & Receivable", slug: "accounts-payable", description: "Managing vendor invoices, customer invoices, payment processing, and collections." },
      { name: "General Ledger & Bookkeeping", slug: "general-ledger", description: "Core accounting record maintenance, journal entries, and transaction posting." },
      { name: "Financial Reporting & Analysis", slug: "financial-reporting", description: "P&L statements, balance sheets, financial dashboards, and variance analysis." },
      { name: "Budgeting & Forecasting", slug: "budgeting-forecasting", description: "Budget planning, financial projections, scenario modeling, and forecast tracking." },
      { name: "Tax Management", slug: "tax-management", description: "Tax planning, compliance calendars, tax return preparation support, and deduction tracking." },
      { name: "Cash Flow & Treasury", slug: "cash-flow", description: "Liquidity management, cash position monitoring, and bank reconciliation." },
      { name: "Fixed Assets & Depreciation", slug: "fixed-assets", description: "Fixed asset tracking, depreciation schedules, and capitalization decisions." },
      { name: "Cost Accounting & Product Costing", slug: "cost-accounting", description: "Product costing models, overhead allocation, profitability analysis, and margin tracking." },
    ],
  },
  {
    name: "Human Resources",
    slug: "human-resources",
    description:
      "Recruiting, performance, learning, compliance, and wellness",
    subdomains: [
      { name: "Recruitment & Talent Acquisition", slug: "recruitment", description: "Sourcing, screening, interviewing, and onboarding new employees and contractors." },
      { name: "Compensation & Benefits", slug: "compensation-benefits", description: "Pay structures, benefits programs, and total rewards strategy." },
      { name: "Learning & Development", slug: "learning-development", description: "Employee training, upskilling, career development programs, and learning management." },
      { name: "Employee Relations & Engagement", slug: "employee-relations", description: "Workplace culture, employee communications, conflict resolution, and engagement." },
      { name: "Performance Management", slug: "performance-management", description: "Goal-setting, performance reviews, feedback cycles, and succession planning." },
      { name: "Organizational Development & Strategy", slug: "org-development", description: "Workforce planning, organizational design, change management, and HR strategy." },
      { name: "Compliance & Employee Governance", slug: "hr-compliance", description: "HR policies, employment law compliance, workplace regulations, and documentation." },
      { name: "Health, Safety & Wellness", slug: "health-safety", description: "Employee wellbeing programs, occupational health, and mental health support." },
    ],
  },
  {
    name: "Operations",
    slug: "operations",
    description:
      "Facilities, quality, continuity, automation, and vendor coordination",
    subdomains: [
      { name: "Facilities & Workspace Management", slug: "facilities", description: "Managing office spaces, maintenance, utilities, and workspace coordination." },
      { name: "Quality Assurance & Process Improvement", slug: "quality-assurance", description: "Monitoring quality, conducting audits, optimizing processes, and continuous improvement." },
      { name: "Inventory & Asset Management", slug: "inventory-assets", description: "Tracking and managing physical inventory, digital assets, and equipment." },
      { name: "Business Continuity & Risk Management", slug: "business-continuity", description: "Disaster planning, operational resilience, and risk assessment." },
      { name: "Vendor & Supplier Coordination", slug: "vendor-coordination", description: "Managing vendor relationships, performance tracking, and contract administration." },
      { name: "Operational Data & Analytics", slug: "operational-analytics", description: "Operational metrics, data validation, and performance reports." },
      { name: "Workflow & Process Automation", slug: "workflow-automation", description: "Designing, automating, and optimizing operational workflows." },
      { name: "Workplace Safety Operations", slug: "workplace-safety", description: "Workplace safety protocols, incident management, and safety training." },
    ],
  },
  {
    name: "Customer Service",
    slug: "customer-service",
    description:
      "Support channels, ticketing, knowledge management, and feedback",
    subdomains: [
      { name: "Support Channel Management", slug: "support-channels", description: "Managing customer interactions across email, chat, phone, and social media." },
      { name: "Ticket & Case Management", slug: "ticket-management", description: "Creating, routing, prioritizing, and tracking support tickets." },
      { name: "Technical Support", slug: "technical-support", description: "Diagnosing and resolving customer technical issues and troubleshooting." },
      { name: "Account & Billing Support", slug: "billing-support", description: "Customer account management, billing inquiries, and subscription issues." },
      { name: "Returns, Refunds & Complaints", slug: "returns-refunds", description: "Processing returns, issuing refunds, and resolving complaints." },
      { name: "Self-Service & Knowledge Management", slug: "knowledge-management", description: "Knowledge bases, FAQs, documentation, and self-service portals." },
      { name: "Customer Feedback & Quality", slug: "customer-feedback", description: "Collecting feedback, measuring satisfaction, and quality assurance." },
      { name: "Support Team Operations", slug: "support-operations", description: "Scheduling, staffing, training, and performance metrics for support teams." },
    ],
  },
  {
    name: "Legal & Compliance",
    slug: "legal-compliance",
    description:
      "Contracts, regulatory, IP, data privacy, and governance",
    subdomains: [
      { name: "Contract Management & Review", slug: "contract-management", description: "Drafting, reviewing, negotiating, and managing contracts and agreements." },
      { name: "Regulatory Compliance", slug: "regulatory-compliance", description: "Monitoring regulatory requirements, compliance documentation, and auditing." },
      { name: "Litigation & Dispute Resolution", slug: "litigation", description: "Managing legal disputes, litigation workflows, and settlement negotiations." },
      { name: "Intellectual Property", slug: "intellectual-property", description: "IP protection, trademark and patent management, and licensing strategy." },
      { name: "Data Privacy & Compliance", slug: "data-privacy", description: "GDPR, CCPA, privacy regulation compliance, and data governance." },
      { name: "Corporate Governance & Ethics", slug: "corporate-governance", description: "Board governance, corporate policy, ethics compliance, and legal adherence." },
      { name: "Risk & Legal Operations", slug: "legal-operations", description: "Legal risk assessment, workflow automation, and matter management." },
      { name: "Anti-Fraud & Sanctions Screening", slug: "anti-fraud", description: "Fraud detection, sanctions screening, KYC/AML compliance, and due diligence." },
    ],
  },
  {
    name: "IT & Technology",
    slug: "it-technology",
    description:
      "Infrastructure, security, data management, and service delivery",
    subdomains: [
      { name: "Infrastructure & Cloud", slug: "infrastructure-cloud", description: "Managing servers, networks, cloud platforms, and IT infrastructure." },
      { name: "Security & Access Management", slug: "security-access", description: "Cybersecurity, identity management, access control, and vulnerability management." },
      { name: "Data Management", slug: "data-management", description: "Data storage, databases, ETL processes, and data governance." },
      { name: "Systems Administration", slug: "systems-admin", description: "User accounts, systems configuration, patch management, and asset inventory." },
      { name: "Application Support & Deployment", slug: "app-deployment", description: "Application maintenance, deployment pipelines, and performance monitoring." },
      { name: "IT Service Management", slug: "it-service", description: "Help desk, ticketing systems, service level management, and change management." },
      { name: "Disaster Recovery & Business Continuity", slug: "disaster-recovery", description: "Backup strategies, disaster recovery procedures, and continuity testing." },
      { name: "IT Analytics & Optimization", slug: "it-analytics", description: "Performance monitoring, capacity planning, and cost optimization." },
    ],
  },
  {
    name: "Procurement",
    slug: "procurement",
    description:
      "Vendor management, sourcing, purchasing, and supplier risk",
    subdomains: [
      { name: "Vendor Management", slug: "vendor-management", description: "Evaluating, onboarding, and maintaining supplier relationships." },
      { name: "Procurement Planning & Forecasting", slug: "procurement-planning", description: "Demand planning, budget forecasting, and procurement strategy." },
      { name: "Sourcing & RFx", slug: "sourcing-rfx", description: "Sourcing strategies, RFPs, competitive bidding, and supplier selection." },
      { name: "Purchase Order Management", slug: "purchase-orders", description: "PO creation, approval workflows, order tracking, and fulfillment." },
      { name: "Contract Lifecycle Management", slug: "contract-lifecycle", description: "End-to-end procurement contract management, renewals, and compliance." },
      { name: "Procurement Analytics & Reporting", slug: "procurement-analytics", description: "Spend visibility, supplier scorecards, and procurement KPI dashboards." },
      { name: "Supplier Compliance & Risk", slug: "supplier-compliance", description: "Supplier compliance monitoring, risk assessment, and certification verification." },
      { name: "Procurement Automation & Integration", slug: "procurement-automation", description: "Workflow automation, system integration, and process optimization." },
    ],
  },
  {
    name: "Logistics",
    slug: "logistics",
    description:
      "Receiving, warehousing, shipping, fulfillment, and last-mile delivery",
    subdomains: [
      { name: "Receiving & Inbound Operations", slug: "receiving-inbound", description: "Intake, quality inspection, dock management, and processing of incoming goods." },
      { name: "Warehouse & Inventory Management", slug: "warehouse-inventory", description: "Stock tracking, storage optimization, inventory counting, and organization." },
      { name: "Shipping & Fulfillment", slug: "shipping-fulfillment", description: "Order picking, packing, labeling, and preparing shipments." },
      { name: "Transportation & Route Optimization", slug: "transportation", description: "Fleet coordination, shipment routing, carrier selection, and cost optimization." },
      { name: "Tracking & Visibility", slug: "tracking-visibility", description: "Real-time shipment monitoring, inventory visibility, and exception alerts." },
      { name: "Returns & Reverse Logistics", slug: "reverse-logistics", description: "Returns processing, restocking, and reverse supply chain operations." },
      { name: "Last-Mile Delivery", slug: "last-mile", description: "Final delivery coordination, scheduling, proof-of-delivery, and performance tracking." },
      { name: "Logistics Compliance & Documentation", slug: "logistics-compliance", description: "Shipping compliance, customs clearance, and regulatory documentation." },
    ],
  },
  {
    name: "Executive & Strategy",
    slug: "executive-strategy",
    description:
      "Corporate strategy, performance, M&A, risk, and board communications",
    subdomains: [
      { name: "Corporate Strategy", slug: "corporate-strategy", description: "Long-term vision, strategic planning, goal-setting, and competitive positioning." },
      { name: "Business Performance & Analytics", slug: "business-performance", description: "KPI tracking, dashboards, performance measurement, and data-driven decisions." },
      { name: "Market & Competitive Intelligence", slug: "competitive-intelligence", description: "Competitive analysis, market research, industry benchmarking, and trend analysis." },
      { name: "Mergers, Acquisitions & Corporate Development", slug: "mergers-acquisitions", description: "M&A activities, partnership evaluation, and growth initiative planning." },
      { name: "Organizational Design & Governance", slug: "org-governance", description: "Organizational structure, decision-making frameworks, and governance policies." },
      { name: "Enterprise Risk Management", slug: "enterprise-risk", description: "Enterprise-wide risk identification, assessment, and crisis management." },
      { name: "Innovation & Transformation Strategy", slug: "innovation-transformation", description: "Innovation roadmaps, digital transformation, and emerging technology adoption." },
      { name: "Stakeholder & Board Communications", slug: "board-communications", description: "Board presentations, investor relations, and executive communications." },
    ],
  },
  {
    name: "Product Development",
    slug: "product-development",
    description:
      "Requirements, design, roadmapping, QA, launch, and iteration",
    subdomains: [
      { name: "Requirements & Discovery", slug: "requirements-discovery", description: "Gathering customer needs, defining specifications, and translating feedback." },
      { name: "Product Design", slug: "product-design", description: "UX/UI design, prototyping, and design systems." },
      { name: "Roadmap & Prioritization", slug: "roadmap-prioritization", description: "Product roadmap planning, feature prioritization, and version management." },
      { name: "Testing & Quality Assurance", slug: "testing-qa", description: "Test planning, QA automation, manual testing, and validation." },
      { name: "Product Documentation", slug: "product-documentation", description: "Technical specifications, user guides, API documentation, and release notes." },
      { name: "Launch & Release Management", slug: "launch-release", description: "Coordinating launches, deployment checklists, and release communications." },
      { name: "Product Analytics & Insights", slug: "product-analytics", description: "Product usage metrics, feature adoption, and user behavior analysis." },
      { name: "Feedback & Iteration", slug: "feedback-iteration", description: "Customer feedback collection, beta programs, and feature request management." },
    ],
  },
];

export function getHubBySlug(slug: string): Hub | undefined {
  return hubs.find((h) => h.slug === slug);
}

export function getSubdomainBySlug(
  hubSlug: string,
  subdomainSlug: string
): Subdomain | undefined {
  const hub = getHubBySlug(hubSlug);
  return hub?.subdomains.find((s) => s.slug === subdomainSlug);
}
