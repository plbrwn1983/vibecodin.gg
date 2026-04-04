---
name: "User Story Generator"
type: skill
version: "1.0.0"
description: "Transforms feature descriptions into well-formed user stories with acceptance criteria, story points, and open questions."
author: "vibecodin.gg"
tags:
  - product-development
  - requirements-discovery
  - user-stories
  - agile
  - story-estimation
  - acceptance-criteria
license: MIT
created: "2026-04-04"
updated: "2026-04-04"
tested_with:
  - claude-sonnet-4-6

trigger: "Invoke when you have a feature description, product requirement, or capability that needs to be decomposed into user stories with acceptance criteria and story point estimates."

commands:
  - name: "generate"
    description: "Transform a feature description into one or more user stories with acceptance criteria, story point estimates, and edge cases."
  - name: "refine"
    description: "Take existing user stories and refactor them for clarity, add missing acceptance criteria, or adjust story point estimates based on team feedback."

dependencies:
  note: "No dependencies required for this skill to function."
  tools: []
  mcps: []
  skills: []
---

## Overview

The User Story Generator is a requirements discovery tool designed to transform raw product requirements, feature descriptions, and capability briefs into well-formed user stories that are ready for sprint planning and development.

Given a feature description or requirement in free text, this skill:

1. **Generates user stories** in the standard format: "As a [persona], I want [goal], so that [benefit]"
2. **Defines acceptance criteria** using Gherkin syntax (Given/When/Then) to make stories testable and unambiguous
3. **Estimates complexity** with story point assignments and transparent reasoning
4. **Surfaces edge cases and open questions** that the team should resolve before development begins

This skill is particularly useful for:

- Product managers who need to brief development teams
- Requirements analysts translating business needs into actionable work
- Scrum masters who want to ensure story quality before sprint planning
- Teams doing discovery work in new domains or unfamiliar feature areas
- Refining and validating user stories that have already been drafted

The skill produces stories that are **specific**, **testable**, and **right-sized** for typical sprint cycles, with explicit attention to assumptions and risks.

## Usage

### Generate Command

Use this command when you have a feature request or product requirement that needs to be broken down into user stories.

**Input:** Provide a feature description or requirement in natural language. Include:
- What capability or feature is being requested
- Who needs it (if known, or let the skill infer personas)
- The business context or problem being solved
- Any constraints or known acceptance criteria

**Output:** The skill will generate:
- One or more user stories (typically 3-5 for a medium-complexity feature)
- Acceptance criteria in Given/When/Then format for each story
- Story point estimate (5, 8, 13, 21, etc.) with reasoning
- A section of edge cases and open questions

### Refine Command

Use this command when you already have user stories drafted and want to improve them.

**Input:** Provide:
- Existing user stories
- Any feedback or concerns from the team
- Updated context or acceptance criteria

**Output:** The skill will:
- Reorganize stories for better sizing and clarity
- Fill in missing acceptance criteria
- Recalibrate story point estimates if needed
- Identify ambiguities or unresolved questions

## Examples

### Example 1: Authentication System for Mobile App

**Input:**
> We need to add two-factor authentication to our mobile app so that users can secure their accounts. Currently, we support SMS OTP, but we also want to support authenticator apps like Google Authenticator. Users should be able to enable/disable 2FA and manage backup codes.

**Generated Output:**

#### User Story 1: Enable SMS-based 2FA
```
As a security-conscious user,
I want to enable two-factor authentication via SMS,
so that my account is protected by a second authentication factor.

Acceptance Criteria:
- Given I am logged into the app,
  When I navigate to Security Settings,
  Then I see an option to enable SMS 2FA.

- Given I select "Enable SMS 2FA",
  When I enter my phone number,
  Then the system sends me a verification code.

- Given I receive the verification code,
  When I enter it in the app,
  Then 2FA is enabled and I see a success message.

Story Points: 8
Reasoning: Requires SMS integration, verification flow, and database schema updates. Low complexity for SMS; straightforward state management.

Edge Cases & Open Questions:
- What happens if the user's phone number changes? Should they re-verify?
- Do we support international phone numbers?
- What is the OTP expiration window (5 min, 10 min)?
- Should users be able to have multiple phone numbers registered?
```

#### User Story 2: Enable Authenticator App 2FA
```
As a security-conscious user,
I want to enable two-factor authentication via an authenticator app,
so that I have a second factor that doesn't depend on SMS delivery.

Acceptance Criteria:
- Given I am in Security Settings,
  When I select "Enable Authenticator App",
  Then I see a QR code and a manual setup key.

- Given I scan the QR code with Google Authenticator,
  When I enter the resulting 6-digit code in the app,
  Then the setup is verified and 2FA is enabled.

- Given 2FA is enabled with an authenticator app,
  When I log in and am prompted for a second factor,
  Then I can enter a 6-digit code from my authenticator app.

Story Points: 13
Reasoning: Requires TOTP (Time-based OTP) integration, QR code generation, and time synchronization logic. Higher complexity than SMS due to cryptographic requirements.

Edge Cases & Open Questions:
- What happens if the user loses access to their authenticator device?
- Should we generate backup codes during setup?
- How do we handle time drift or incorrect system time on the user's phone?
- Can users have multiple authenticator apps registered simultaneously?
```

#### User Story 3: Manage Backup Codes
```
As a user who enabled 2FA,
I want to generate and store backup codes,
so that I can recover my account if I lose access to my second factor.

Acceptance Criteria:
- Given I have enabled 2FA,
  When I navigate to "Backup Codes" in Security Settings,
  Then I see an option to generate a set of 10 one-time backup codes.

- Given I generate backup codes,
  When I view the list,
  Then each code is 8 characters and can be used once.

- Given I use a backup code during login,
  When I enter a valid backup code as my second factor,
  Then the code is marked as used and I'm logged in.

Story Points: 5
Reasoning: Straightforward CRUD operations and code validation. Low complexity, good candidate for a small story in early sprints.

Edge Cases & Open Questions:
- Should users be warned if they fall below a threshold of remaining backup codes (e.g., 2 codes left)?
- Can users regenerate backup codes, or does that invalidate old ones?
- Should backup codes be displayed only once, or can they be retrieved later?
- Do we encrypt or hash backup codes in the database?
```

---

### Example 2: Notification Preferences Dashboard

**Input:**
> Product request: Users should be able to customize push notification settings. They want to choose which types of events trigger notifications, control quiet hours, and set frequency (real-time vs. digest). We need this for iOS and Android, and web should have in-app notifications too.

**Generated Output:**

#### User Story 1: Configure Notification Type Preferences
```
As a user who receives many notifications,
I want to enable/disable notifications for specific event types,
so that I only get alerted about things that matter to me.

Acceptance Criteria:
- Given I am in Notification Settings,
  When I view the list of notification types,
  Then I see toggles for at least: Messages, Likes, Comments, Follows, Sales, System Updates.

- Given I toggle a notification type off,
  When I navigate away and return,
  Then the setting is persisted and reflected in the UI.

- Given a notification type is disabled,
  When that event occurs in my account,
  Then no notification is sent for that event type.

Story Points: 8
Reasoning: Requires settings UI, user preference storage, and notification gating logic across mobile and web.

Edge Cases & Open Questions:
- Should "System Updates" be force-enabled (no toggle)?
- How do we handle backwards compatibility for users who had notifications before this feature?
- Can users set different preferences per device (phone vs. web)?
- What is the minimum number of notification types a user must have enabled?
```

#### User Story 2: Configure Quiet Hours
```
As a user who wants uninterrupted sleep,
I want to set quiet hours during which notifications are silenced,
so that I am not disturbed between my sleep times.

Acceptance Criteria:
- Given I am in Notification Settings,
  When I select "Quiet Hours",
  Then I can enter a start time and end time (e.g., 10 PM to 8 AM).

- Given I have set quiet hours,
  When a notification-triggering event occurs during that window,
  Then the notification is queued but not delivered.

- Given quiet hours end (e.g., 8 AM arrives),
  When I open the app,
  Then I see a digest or summary of queued notifications.

Story Points: 13
Reasoning: Requires timezone-aware time logic, scheduling, and client-side suppression rules. Complexity from handling timezone edge cases and cross-device synchronization.

Edge Cases & Open Questions:
- Should quiet hours apply to all event types, or only specific ones?
- How do we handle daylight saving time transitions?
- If quiet hours span midnight (10 PM to 8 AM), how is this stored?
- What happens if a user is in a different timezone when they set quiet hours?
- Should time-sensitive alerts (security warnings, payment confirmations) bypass quiet hours?
```

#### User Story 3: Choose Notification Delivery Frequency
```
As a busy user,
I want to receive notifications as a daily or weekly digest,
so that I am not overwhelmed by constant alerts.

Acceptance Criteria:
- Given I am in Notification Settings,
  When I select "Delivery Frequency",
  Then I see options: Real-time, Daily Digest (9 AM), Weekly Digest (Monday 9 AM).

- Given I select "Daily Digest",
  When multiple events occur throughout the day,
  Then notifications are collected and sent in one digest at 9 AM.

- Given I receive a digest,
  When I open it,
  Then I see a summary of all events grouped by type, with a count for each.

Story Points: 21
Reasoning: Requires backend digest generation, scheduling, templating, and edge case handling for different time zones and event volumes. Highest complexity due to batch processing and delivery guarantees.

Edge Cases & Open Questions:
- What if there are no events during a digest window? Do we send an empty digest?
- How do we handle critical events that arrive during digest-only periods (security alerts)?
- If a user switches from real-time to digest, do we process the backlog immediately?
- Should digest time be user-configurable per timezone?
- How long do we retain event history for digest generation?
```

---

### Example 3: File Upload with Progress Tracking

**Input:**
> We need users to upload files up to 500MB. Show upload progress, allow pausing/resuming, and handle network failures gracefully with automatic retry.

**Generated Output:**

#### User Story 1: Display Upload Progress
```
As a user uploading a large file,
I want to see the upload progress with a percentage and ETA,
so that I know how long the upload will take.

Acceptance Criteria:
- Given I select a file to upload,
  When the upload begins,
  Then I see a progress bar showing 0-100%.

- Given an upload is in progress,
  When I observe the progress bar,
  Then the percentage updates at least once per second.

- Given I hover over the progress bar,
  When the upload is more than 10% complete,
  Then I see an estimated time remaining (e.g., "2 minutes remaining").

Story Points: 5
Reasoning: Simple client-side progress tracking using standard APIs. Low complexity.

Edge Cases & Open Questions:
- How do we estimate ETA for files uploaded at variable speeds?
- What if network speed changes dramatically mid-upload?
- Should we show current upload speed (MB/s)?
```

#### User Story 2: Pause and Resume Uploads
```
As a user whose network is interrupted,
I want to pause my upload and resume it later,
so that I don't have to restart the upload from the beginning.

Acceptance Criteria:
- Given an upload is in progress,
  When I tap the "Pause" button,
  Then the upload pauses and the button changes to "Resume".

- Given an upload is paused,
  When I tap "Resume",
  Then the upload continues from where it left off.

- Given I pause an upload,
  When I navigate away and return 10 minutes later,
  Then I can still resume the upload.

Story Points: 13
Reasoning: Requires server-side chunked upload support, client-side state persistence, and session resumption logic.

Edge Cases & Open Questions:
- How long are paused uploads retained on the server (1 hour, 1 day)?
- If the file on disk is modified while paused, what happens?
- Should we inform the server we've paused, or just stop sending data?
- What if the server garbage-collects the partial upload while paused?
```

#### User Story 3: Handle Upload Failures and Retry
```
As a user with an unreliable connection,
I want failed uploads to retry automatically,
so that I don't lose progress due to temporary network issues.

Acceptance Criteria:
- Given an upload fails due to network timeout,
  When 5 seconds pass,
  Then the system automatically retries the failed chunk.

- Given an upload has retried 3 times and still fails,
  When the third failure occurs,
  Then I see an error message and a "Retry" button.

- Given I tap "Retry",
  When the upload succeeds,
  Then the upload completes and I see a success message.

Story Points: 13
Reasoning: Requires retry logic with exponential backoff, error categorization (transient vs. permanent), and user notification.

Edge Cases & Open Questions:
- What errors should trigger automatic retry vs. showing an error to the user?
- Should retry backoff be exponential, or fixed intervals?
- How many retries are acceptable before we give up?
- Should we retry all chunks or only the failed ones?
- Do we log failed attempts for debugging?
```

---

## Notes

### Story Point Guidelines

This skill uses the Fibonacci sequence for story point estimates (5, 8, 13, 21, etc.), which is a common Agile practice. The reasoning provided explains the complexity drivers:

- **5 points**: Simple, well-defined, low risk (e.g., UI toggles, basic CRUD)
- **8 points**: Moderate complexity, some integration or logic (e.g., API calls, basic workflows)
- **13 points**: Significant complexity, multiple components or edge cases (e.g., payment processing, caching)
- **21+ points**: Very complex, should often be split into smaller stories

If your team uses a different scale (1-10, t-shirt sizes, etc.), you can easily adapt the estimates.

### Personas and Context

When the skill generates user stories, it infers personas from the feature description (e.g., "security-conscious user", "busy user"). These personas help clarify the motivation and value proposition of each story. If you have specific personas defined in your product, provide those in the input to get more precise stories.

### Acceptance Criteria Format

All acceptance criteria are written in Gherkin (Given/When/Then) format, which is:

- **Unambiguous**: Specific conditions and outcomes
- **Testable**: Easy to write automated tests against
- **Collaborative**: Non-technical stakeholders can read and validate them

If your team uses a different format (checklists, narrative descriptions), the stories can be easily reformatted.

### Splitting and Refinement

Not all stories will be the right size for your sprint. Larger stories (21+ points) should often be split into smaller, independently valuable increments. Use the `refine` command to adjust story boundaries based on team capacity and sprint length.

### Open Questions and Risk Management

The "Edge Cases & Open Questions" section is intentionally included to surface assumptions and risks early. Use this section in backlog refinement meetings to:

- Clarify ambiguities before development starts
- Identify dependencies or blockers
- Plan technical spikes if needed
- Adjust story scope or estimates based on team feedback

This upfront clarity significantly reduces rework and mid-sprint surprises.

### Iterative Refinement

User stories are not final on first generation. Treat the output as a **starting point** for team discussion, not a deliverable artifact. Use the `refine` command after sprint planning feedback, design reviews, or technical spikes to improve the stories.
