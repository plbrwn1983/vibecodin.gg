---
name: "Smart Code Reviewer"
type: "skill"
version: "1.0.0"
description: "Automatically reviews code for bugs, security issues, and style violations when you paste or reference a file."
author: "plbrwn1983"
tags:
  - code
  - review
  - security
  - debugging
  - linting
license: "MIT"
created: "2026-04-06"
updated: "2026-04-06"
tested_with:
  - claude-sonnet-4-5
  - claude-opus-4-5

trigger: "Use this skill when a user asks to review code, check for bugs, analyze code quality, or audit a file for security issues."
dependencies:
  note: "No dependencies required for this skill to function."
  tools:
    - Read
    - Write
  mcps: []
  skills: []

pricing_model: "one_time"
---

# Smart Code Reviewer

## Overview
Smart Code Reviewer is a skill that automatically analyzes code snippets or files for bugs, security vulnerabilities, style issues, and best-practice violations. It supports multiple programming languages and provides actionable, line-by-line feedback.

## Usage
Paste your code directly into the chat or reference a file path. Ask Claude to "review this code" or "check this file for issues." The skill will return a structured report with severity levels (critical, warning, info) for each finding.

## Examples
- "Review my auth.py file for security issues"
- "Check this JavaScript snippet for bugs"
- "Audit my SQL query for injection vulnerabilities"

## Notes
This skill provides suggestions only and should not be used as the sole review mechanism for production code. Always have a human engineer verify critical findings before deploying changes.