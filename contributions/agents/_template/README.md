---
name: "Your Agent Name"
type: agent
version: "1.0.0"
description: "One sentence describing what this agent does and when to use it. Max 280 characters."
author: "your-github-handle"
tags:
  - tag-one
  - tag-two
license: MIT
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
tested_with:
  - claude-sonnet-4-6

model: "claude-sonnet-4-6"
system_prompt: "system-prompt.md"
memory: false

tools:
  builtin: []
  mcps: []

behaviors:
  - "Describe a key behavioral constraint or rule users should know about"

dependencies:
  note: "No dependencies required for this agent to function."
  skills: []
  mcps: []
---

# Your Agent Name

## Overview
Describe what this agent does, who it is for, and what problem it solves. Be specific about the agent's scope — what it handles autonomously and what it defers to the user.

## Usage
Explain how to use this agent. What context or inputs does it need to get started? What does it produce or do? Walk through a typical session.

## Examples
- "Example prompt or scenario that shows this agent in action"
- "Another realistic example showing a different use case"

## Notes
Optional — add any caveats, known limitations, version history, or other context worth knowing.
