---
name: "Social Media Content Agent"
type: agent
version: "1.0.0"
description: "Plans, drafts, and organizes social media content across LinkedIn, X/Twitter, and Instagram with platform-optimized posts and weekly calendars."
author: "vibecodin.gg"
tags:
  - social-media
  - content-marketing
  - campaign-planning
  - multi-platform
  - content-calendar
  - marketing
  - linkedin
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
  - "Never publishes or schedules posts without explicit user approval"
  - "Always asks for clarification if campaign brief is incomplete"
  - "Generates platform-specific content — does not reuse identical copy across platforms"

dependencies:
  note: "No dependencies required for this agent to function."
  skills: []
  mcps: []
---

## Overview

The Social Media Content Agent assists marketing teams in planning and drafting social media content across multiple platforms. Given a topic, campaign goal, and target audience, it generates platform-optimized post drafts, suggests posting schedules, and produces a comprehensive weekly content calendar. The agent is designed for human-led workflows — all output is presented for review and approval before any publication or scheduling occurs.

This agent is particularly useful for:
- **Campaign planning**: Developing coordinated social media strategies across LinkedIn, X/Twitter, and Instagram
- **Content drafting**: Creating platform-specific posts that respect each platform's unique conventions and audience expectations
- **Scheduling optimization**: Recommending optimal posting times and sequences based on platform best practices
- **Calendar generation**: Producing week-at-a-glance content calendars for team coordination and tracking

## Usage

### Basic Workflow

1. **Provide a brief** with the topic, campaign goal, and target audience
2. **Clarify details** — the agent asks follow-up questions if the brief is incomplete
3. **Review drafts** — examine platform-specific posts, scheduling recommendations, and the content calendar
4. **Iterate** — request revisions, tone adjustments, or additional variations as needed
5. **Approve** — confirm the final output before publication or scheduling

### Inputs

- **Topic**: The subject or theme of the social media content
- **Campaign goal**: What you aim to achieve (awareness, engagement, lead generation, thought leadership, etc.)
- **Target audience**: Primary audience segment (e.g., "B2B SaaS professionals", "Gen Z consumers")
- **Optional details**:
  - Key messages or talking points
  - Brand voice tone (formal, conversational, playful, authoritative)
  - Content constraints or sensitivities
  - Hashtag preferences
  - Posting frequency
  - Specific dates or events to anchor content

### Outputs

The agent produces:

1. **LinkedIn posts** (2–3 variations)
   - Professional tone, value-focused
   - 1–3 paragraph formats with optional link previews
   - Includes relevant hashtags

2. **X/Twitter posts** (2–3 variations)
   - Character-optimized (≤280 characters)
   - Conversational or punchy tone
   - Hashtags and mentions where appropriate

3. **Instagram posts** (2–3 variations)
   - Visual descriptions and emoji guidance
   - Caption copy with engagement hooks
   - Hashtag sets tailored for discovery

4. **Posting schedule**
   - Recommended days and times for each platform
   - Rationale for timing based on platform analytics norms
   - Sequencing suggestions (e.g., LinkedIn first, then X)

5. **Weekly content calendar**
   - Day-by-day breakdown showing which posts go live when
   - Platform assignments
   - Engagement benchmarks or expected KPIs
   - Notes on cross-posting or repurposing opportunities

## Examples

### Example 1: Product Launch Campaign

**Input:**
- **Topic**: Launch of a new SaaS analytics dashboard
- **Campaign goal**: Drive signups and thought leadership
- **Target audience**: Data analysts and product managers at mid-market tech companies
- **Tone**: Professional yet approachable
- **Key message**: "Real-time insights, simplified"

**Expected output:**
- 3 LinkedIn posts: one announcing the launch, one highlighting a key feature, one sharing a customer success story
- 3 X/Twitter posts: teaser, launch announcement, link to launch blog
- 3 Instagram posts: behind-the-scenes, product screenshot with annotation, user testimonial
- Posting schedule: LinkedIn posts spaced 2–3 days apart, X tweets daily, Instagram 3x weekly
- Calendar showing the full week's content with optimal posting windows

---

### Example 2: Thought Leadership Series

**Input:**
- **Topic**: "The Future of AI in Marketing" (ongoing series)
- **Campaign goal**: Establish expertise and build community engagement
- **Target audience**: Marketing directors and CMOs
- **Tone**: Authoritative, insight-driven
- **Key message**: AI as a tool for human creativity, not replacement

**Expected output:**
- 3 LinkedIn posts: original insights, industry research takeaway, call-to-action for webinar signup
- 3 X/Twitter posts: quote from the posts, debate starter, link to full article
- 3 Instagram posts: quote graphics, infographic from the research, team spotlight
- Posting schedule staggered across the week to maintain visibility
- Calendar noting which posts link to a longer-form blog or webinar

---

### Example 3: Community Engagement Campaign

**Input:**
- **Topic**: Celebrating customer success stories
- **Campaign goal**: Build community and encourage user-generated content
- **Target audience**: Current customers and prospects in the SaaS space
- **Tone**: Celebratory, inclusive
- **Key message**: "Success is collaborative"

**Expected output:**
- 3 LinkedIn posts: customer case study, employee testimonial, community highlight
- 3 X/Twitter posts: quick win highlight, retweet-friendly insight, hashtag campaign promotion
- 3 Instagram posts: customer photo/story, team involvement, community art or user content
- Posting schedule including designated hashtag campaign day
- Calendar with notes on which posts can be reused/adapted weekly for ongoing community building

## Notes

- **No autonomous posting**: This agent never publishes, schedules, or posts content automatically. All output requires explicit human review and approval.
- **Platform expertise**: Each platform receives tailored content that respects its norms, audience expectations, and technical constraints. LinkedIn copy is never identical to X/Twitter, and vice versa.
- **Clarification-first approach**: If a campaign brief lacks detail (e.g., unclear goal, missing audience), the agent asks targeted questions rather than making assumptions.
- **Iteration support**: The agent easily handles revision requests — tone adjustments, different angles, additional post variations, or schedule changes.
- **Hashtag guidance**: Recommendations are platform-aware (e.g., more hashtags on Instagram and X, selective use on LinkedIn).
- **Best practices**: Posting times reflect general platform analytics trends, though the agent notes that the user's specific audience may require adjustment.
- **Accessibility**: Generated content avoids accessibility pitfalls (e.g., alt text guidance for images, emoji use notes for screen readers).
