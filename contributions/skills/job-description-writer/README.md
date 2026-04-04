---
name: "Job Description Writer"
type: skill
version: "1.0.0"
description: "Generates complete, structured job descriptions with inclusive language from brief role summaries."
author: "vibecodin.gg"
tags:
  - human-resources
  - recruitment
  - job-description
  - talent-acquisition
  - hr-automation
  - compliance
license: MIT
created: "2026-04-04"
updated: "2026-04-04"
tested_with:
  - claude-sonnet-4-6

trigger: "Invoke when you need to create a professional job description from a basic role concept or brief summary. Works best when you have a job title, department, and general role overview."

commands:
  - name: "write"
    description: "Generate a complete job description from a role summary with job title, responsibilities, qualifications, and benefits sections."
  - name: "revise"
    description: "Refine an existing job description to improve clarity, inclusivity, compliance, or to adjust tone and emphasis."

dependencies:
  note: "No dependencies required for this skill to function."
  tools: []
  mcps: []
  skills: []
---

## Overview

The Job Description Writer skill automates the creation of professional, legally compliant, and inclusive job descriptions. It transforms a brief role summary into a comprehensive, structured document suitable for posting on career sites, sharing with recruiters, or using as an internal reference.

This skill is designed for HR professionals, hiring managers, and recruitment teams who need to quickly produce job descriptions that:

- Follow modern inclusive language best practices
- Comply with hiring regulations across jurisdictions
- Present clear expectations to candidates
- Reduce bias in job posting language
- Maintain consistent formatting and structure

**Output Structure:**
- Job Title
- Department
- Role Summary (2-3 sentences)
- Key Responsibilities (6-8 bullet points)
- Required Qualifications
- Preferred Qualifications
- Compensation & Benefits (placeholder section for internal completion)

## Usage

### Basic Command: `write`

Provide a brief role summary containing:
- Job title or role name
- Department or team
- General overview of the role
- Key focus areas (optional but helpful)

**Example input:**
```
We need a Senior Data Engineer for our Analytics team. The person will own
our data pipeline architecture, work with our data science team to deliver
insights, and help junior engineers grow their skills. They should be
experienced with cloud platforms and SQL optimization.
```

The skill will expand this into a complete job description with professional formatting and comprehensive sections.

### Refinement Command: `revise`

Use this command to improve an existing job description:
- Enhance clarity and conciseness
- Strengthen inclusive language
- Adjust qualification requirements
- Rebalance responsibility emphasis
- Update for legal/compliance requirements
- Modify tone (more casual, more formal, etc.)

**Example revision request:**
```
The job description is too focused on years of experience. Can you make
the qualifications more skills-based and emphasize what candidates will
learn? Also, make the language more inclusive.
```

## Examples

### Example 1: Senior Data Engineer

**Input:**
```
Create a job description for a Senior Data Engineer role in our Analytics
department. They'll design and maintain ETL pipelines, mentor junior
engineers, and work with data scientists to enable real-time analytics
at scale. Experience with cloud platforms like AWS or GCP is important.
```

**Output:**

---

**Job Title:** Senior Data Engineer

**Department:** Analytics

**Role Summary:**
We're seeking a Senior Data Engineer to lead the design and evolution of our data infrastructure. In this role, you'll own our ETL pipeline architecture, enable our data science team to deliver insights at scale, and mentor engineers who are building their data careers. You'll work across the organization to understand data needs and translate them into robust, scalable solutions.

**Key Responsibilities:**
- Design, build, and optimize data pipelines that reliably process billions of events daily
- Conduct code reviews and mentor junior engineers, fostering a culture of technical growth
- Partner with data scientists and analytics teams to understand requirements and deliver solutions that support real-time decision-making
- Evaluate and recommend tools, platforms, and technologies to improve pipeline performance and reduce operational overhead
- Document architecture decisions and maintain knowledge-sharing practices across the team
- Participate in on-call rotation to ensure pipeline reliability and respond to data quality issues
- Contribute to infrastructure reliability through monitoring, testing, and continuous improvement practices
- Lead technical design discussions and influence the evolution of our data platform strategy

**Required Qualifications:**
- 5+ years of professional experience in data engineering, backend engineering, or related fields
- Proficiency in SQL and demonstrated ability to optimize complex queries and data operations
- Hands-on experience with cloud platforms (AWS, Google Cloud, or Azure) and modern data warehouse solutions
- Experience building and maintaining production data pipelines using orchestration tools (Airflow, dbt, etc.)
- Strong understanding of data modeling, schema design, and dimensional analysis
- Comfortable with version control (Git) and CI/CD practices

**Preferred Qualifications:**
- Experience with Apache Spark, Apache Kafka, or other distributed data processing technologies
- Familiarity with multiple programming languages (Python, Scala, Java, Go)
- Background in solving real-time or streaming data problems
- Experience mentoring junior engineers or contributing to team growth
- Understanding of data governance, data quality frameworks, and compliance considerations
- Active contributions to open-source data tools or projects

**Compensation & Benefits:**
[Internal team to complete: salary range, equity, health insurance, retirement plans, PTO, professional development budget, flexible work arrangements, etc.]

---

### Example 2: Community Manager (Entry-to-Mid Level)

**Input:**
```
Community Manager position for our Developer Relations team. Someone to
manage our Discord, run community events, help new developers get started,
and gather feedback. We want someone enthusiastic, good at communication,
and interested in developer communities. They don't need tons of experience
but should be organized and personable.
```

**Output:**

---

**Job Title:** Community Manager

**Department:** Developer Relations

**Role Summary:**
Join our Developer Relations team as a Community Manager! You'll be the central hub connecting our developer community, building relationships, and ensuring our members feel supported and engaged. You'll manage our community platforms, organize events (virtual and in-person), help developers succeed with our platform, and capture feedback that shapes our product direction.

**Key Responsibilities:**
- Manage our Discord community, including moderation, member engagement, and fostering an inclusive, welcoming environment
- Plan, promote, and execute community events including virtual meetups, workshops, and annual conferences
- Create onboarding content and documentation to help new developers get productive quickly
- Respond to community inquiries, troubleshoot issues, and escalate complex problems to appropriate teams
- Gather feedback from community members and synthesize insights for product, marketing, and engineering teams
- Develop and track community metrics (engagement, growth, sentiment) and report on health and impact
- Collaborate with marketing to promote events and highlight community achievements
- Identify and nurture community leaders and contributors who can amplify our community mission

**Required Qualifications:**
- Excellent written and verbal communication skills with the ability to engage diverse audiences
- 1-3 years of community management, customer success, customer support, or related experience (or equivalent demonstrated ability)
- Proficiency with community platforms (Discord, Slack, GitHub Discussions, or similar)
- Organizational skills and ability to juggle multiple projects and time zones
- Genuine interest in developer communities and technology
- Ability to work independently and as part of a collaborative team

**Preferred Qualifications:**
- Direct experience as a developer or with technical concepts (no advanced degree required)
- Experience planning and executing events, both virtual and in-person
- Familiarity with DevOps, APIs, or developer tools
- Background in community moderation or online community management
- Experience with analytics tools and community health metrics
- Multilingual abilities, particularly for communities outside the US

**Compensation & Benefits:**
[Internal team to complete: salary range, equity, health insurance, retirement plans, PTO, professional development budget, remote-first options, community event budget, etc.]

---

### Example 3: Product Manager (Mid-to-Senior)

**Input:**
```
We're hiring a Product Manager for our mobile app team. They should own
the product vision, work with design and engineering, and make data-driven
decisions. The PM should be comfortable with metrics, user research, and
can work in a fast-moving startup environment. Some mobile background is
nice but not required if they have strong product instincts.
```

**Output:**

---

**Job Title:** Product Manager, Mobile Applications

**Department:** Product

**Role Summary:**
We're looking for a Product Manager to own the vision and strategy for our mobile applications. You'll partner closely with design and engineering teams to deliver features that users love while making data-driven decisions about prioritization. You'll understand our users deeply, define clear product direction, and drive execution across a fast-moving team.

**Key Responsibilities:**
- Define and communicate product vision, roadmap, and strategy for mobile platforms, ensuring alignment with company goals
- Conduct user research, gather feedback, and analyze data to identify opportunities and validate hypotheses
- Work collaboratively with Design to scope features and ensure excellent user experience
- Partner with Engineering to define technical requirements, estimate effort, and manage trade-offs
- Track key metrics, establish success criteria, and use data to inform product decisions and iterations
- Manage the product backlog, prioritize features and fixes based on impact and user needs
- Lead cross-functional reviews and communicate progress to stakeholders and the broader organization
- Stay current with mobile trends, competitive landscape, and user expectations in your domain

**Required Qualifications:**
- 3+ years of product management experience (or equivalent in related roles like product operations, user experience research, or startup founder)
- Strong analytical skills and comfort with data interpretation and decision-making frameworks
- Demonstrated ability to work cross-functionally and influence teams without direct authority
- Experience conducting user research and incorporating qualitative feedback into product decisions
- Excellent communication and presentation skills, with ability to influence both technical and non-technical audiences
- Comfort with ambiguity and ability to operate in fast-moving environments

**Preferred Qualifications:**
- Product management experience in mobile-first or mobile platforms
- Familiarity with analytics tools (Mixpanel, Amplitude, Google Analytics) and A/B testing
- Background in software engineering or design
- Experience defining and tracking OKRs (Objectives and Key Results)
- Track record of shipping products or features that achieved strong adoption or engagement
- Startup experience or experience in high-growth environments

**Compensation & Benefits:**
[Internal team to complete: salary range, equity, health insurance, retirement plans, PTO, professional development budget, conference allowance, flexible work arrangements, etc.]

---

## Notes

### Inclusive Language Best Practices

This skill incorporates several inclusive language principles:

- **Avoid gendered language:** Uses "they/them" pronouns and avoids masculine defaults
- **De-emphasize years of experience:** Where possible, balances experience requirements with capability-based qualifications
- **Focus on skills, not credentials:** Recognizes that skills can be acquired through various paths (formal education, self-study, on-the-job)
- **Use "and/or" for flexibility:** Acknowledges multiple valid paths (e.g., "formal training or self-taught")
- **Remove unnecessary barriers:** Avoids arbitrary requirements (e.g., degree mandates when skills matter more)
- **Welcoming language:** Uses phrases like "We're seeking..." and includes "we believe..." to convey inclusion

### Legal and Compliance Considerations

- Job descriptions should be reviewed by your legal or HR team before posting, particularly regarding:
  - Minimum qualifications vs. preferred qualifications (impacts job classification)
  - Salary disclosure requirements (vary by jurisdiction)
  - Accessibility and ADA compliance
  - Equal Employment Opportunity (EEO) statements
- Avoid:
  - Age-coded language ("digital native," "high energy")
  - Physical descriptors unrelated to essential job functions
  - Language that could discourage protected classes from applying
  - Vague or subjective qualifications ("rockstar," "ninja")

### Customization Tips

**Adjusting Seniority Level:**
Request a revision specifying the level (entry-level, mid-level, senior, principal) and the skill will adjust years of experience, responsibility scope, and mentorship expectations accordingly.

**Department-Specific Variations:**
The skill adapts language and examples to the specific department or domain. Mention your industry or function (e.g., "for a fintech company," "for a nonprofit," "for a remote-first team") for more tailored output.

**Remote and Flexible Work:**
Request emphasis on remote work, flexible schedules, or distributed team dynamics. The skill will adjust language and include relevant considerations.

**Regulatory Compliance:**
If posting in specific regions (California, EU, etc.), mention this and the skill will incorporate relevant compliance language and disclosures.

### Output Formats

This skill produces:
- **Markdown** as the primary format (easy to share, version control, and convert)
- **Plain text** suitable for pasting into career site platforms
- **Structured data** (JSON/YAML) for integration with applicant tracking systems (ATS)

Request your preferred format if not using the default Markdown.

### When to Use Revise

The `revise` command is ideal for:
- Adjusting qualification levels after market feedback or recruiting challenges
- Incorporating company-specific values or culture language
- Reducing length for platforms with character limits
- Adding or emphasizing DEI initiatives your company sponsors
- Updating for legal changes or new compliance requirements
- Rebalancing after initial posting hasn't attracted desired candidate pool

---

**Maintenance Note:** This skill was created on 2026-04-04 and tested with Claude Sonnet 4.6. As hiring practices and inclusive language standards evolve, periodic updates are recommended.
