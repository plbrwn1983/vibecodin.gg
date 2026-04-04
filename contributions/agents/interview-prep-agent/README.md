---
name: "Interview Prep Agent"
type: agent
version: "1.0.0"
description: "Generates structured interview guides, question banks, scoring rubrics, and evaluation scorecards for hiring managers to prepare competency-based interviews."
author: "vibecodin.gg"
tags:
  - recruitment
  - talent-acquisition
  - hiring
  - interview-preparation
  - hr
  - competency-based
  - compliance

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
    - Write
  mcps: []

behaviors:
  - "Always includes a list of legally inadvisable interview questions to avoid"
  - "Generates competency-based questions only — no personality or lifestyle questions"
  - "Produces a complete interview kit before asking for revisions"

dependencies:
  note: "No dependencies required for this agent to function."
  skills: []
  mcps: []
---

## Overview

The Interview Prep Agent helps hiring managers and recruiters prepare comprehensive, legally compliant interview guides for specific roles. By providing a job title, key responsibilities, and required competencies, the agent generates a complete interview kit including:

- **Structured Interview Plan**: Multi-stage interview process with recommended interviewers and time allocations
- **Competency-Based Question Bank**: 5-7 behavioral and situational questions per competency, designed to assess capability through past behavior and hypothetical scenarios
- **Scoring Rubric**: Standardized evaluation criteria for each question (typically 4-5 point scale with clear behavioral descriptors)
- **Candidate Evaluation Scorecard**: Ready-to-use template for structured scoring and comparative assessment across candidates
- **Legally Inadvisable Questions List**: Clear guidance on question categories and examples to avoid (protected characteristics, privacy concerns, misleading practices)

The agent ensures all interview materials are objective, measurable, and compliant with employment law while reducing hiring bias through structured competency assessment.

## Usage

Invoke the agent with the following information:

1. **Job Title**: The role being interviewed for (e.g., "Senior Product Manager", "Backend Software Engineer")
2. **Key Responsibilities**: 4-6 primary job duties and accountability areas
3. **Required Competencies**: 5-8 core competencies essential for the role (e.g., "stakeholder management", "technical leadership", "problem-solving")
4. **Optional Inputs**:
   - Seniority level (entry, mid, senior, executive)
   - Team context (size, structure, reporting relationships)
   - Industry/domain specifics (tech, finance, healthcare, etc.)
   - Interview format preference (in-person, video, panel, sequential)

**Output**: The agent generates all interview materials in a single complete output, formatted as a cohesive interview kit document with clear sections for each component.

## Examples

### Example 1: Senior Product Manager

**Input:**
- Job Title: Senior Product Manager
- Key Responsibilities: Drive product vision and roadmap; manage cross-functional stakeholder alignment; analyze market opportunities; mentor junior PMs
- Required Competencies: Strategic thinking, stakeholder management, data-driven decision making, communication, product sense, conflict resolution, mentorship

**Output Generated:**
- 3-stage interview plan: initial screening, competency-focused round, executive round
- 49 targeted questions across 7 competencies (7 per competency)
- Rubrics with clear "does not meet", "meets", "exceeds" criteria for each question
- Scorecard template with competency weighting and overall assessment sections
- Guidance on avoiding questions about family plans, personal life, or salary history

---

### Example 2: Backend Software Engineer

**Input:**
- Job Title: Backend Software Engineer
- Key Responsibilities: Design and implement scalable APIs; maintain and optimize database systems; collaborate on architectural decisions; conduct code reviews
- Required Competencies: System design, problem-solving, code quality, collaboration, learning agility, technical communication, reliability focus

**Output Generated:**
- 4-stage interview plan: phone screen, technical problem-solving, system design, team fit
- 42 questions combining behavioral (past experience) and situational (hypothetical scenarios) formats
- Rubrics assessing depth of understanding, trade-off analysis, and communication clarity
- Evaluation scorecard with technical and interpersonal dimensions
- Avoid list highlighting inappropriate depth questions, culture-fit bias, and discriminatory assumptions

---

### Example 3: Customer Success Manager

**Input:**
- Job Title: Customer Success Manager
- Key Responsibilities: Manage customer relationships and account health; identify upsell opportunities; resolve escalated issues; gather customer feedback for product team
- Required Competencies: Customer empathy, relationship building, problem-solving, data literacy, communication, resilience, initiative

**Output Generated:**
- 3-stage interview plan: phone screen, competency assessment, reference/background
- 35 targeted questions focused on customer-centric scenarios
- Rubrics evaluating listening, action-orientation, and business acumen
- Scorecard template emphasizing customer impact and team collaboration
- Compliance guidance on appropriately assessing customer feedback handling without asking for confidential information from current employer

## Notes

- **Competency-Based Approach**: Questions are grounded in the STAR method (Situation, Task, Action, Result) for behavioral questions and clear success criteria for situational questions. This reduces subjectivity and defensibility concerns.

- **Legal Compliance**: The agent explicitly lists questions to avoid, including those relating to protected characteristics (age, race, gender, national origin, religion, disability), personal life decisions (family planning, marital status), and inappropriate depth probing (salary, personal financial status, political views).

- **Customization**: While the agent generates a complete kit in one pass, hiring managers should review and adapt materials to their specific organizational culture, interview format, and role-specific context.

- **Scoring Consistency**: Rubrics are designed to enable multiple interviewers to score the same competency consistently. Training on rubric interpretation before interviews improves inter-rater reliability.

- **Candidate Experience**: The structured format creates a predictable, fair experience for candidates while allowing flexibility for follow-up conversation. Share the interview stages and general competency focus with candidates beforehand.

- **Timeboxing**: The interview plan includes recommended time per stage and per question. Adhering to timeboxing ensures equitable candidate assessment and efficient interview process.
