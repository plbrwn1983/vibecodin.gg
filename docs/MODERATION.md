# Moderation Guide

This guide covers the responsibilities, workflows, and tools available to hub moderators on vibecodin.gg. For the technical architecture behind these processes, see [ARCHITECTURE.md](ARCHITECTURE.md).

---

## Table of Contents

1. [Role and Scope](#role-and-scope)
2. [PR Review Workflow](#pr-review-workflow)
3. [Verification Workflow](#verification-workflow)
4. [Moderation Actions](#moderation-actions)
5. [Admin Panel](#admin-panel)
6. [Guidelines](#guidelines)

---

## Role and Scope

Hub moderators are domain experts with verified contributions in their hub. Each moderator is responsible for one or more hubs and has authority over contributions within those hubs.

**What moderators do:**

- Review incoming pull requests for contributions in their hub
- Assign the correct hub and sub-domain via GitHub PR labels
- Verify contributions through the verification checklist
- Manage discussion threads on contributions in their hub
- Take moderation actions (hide, remove, lock, ban) when necessary

**What moderators do not do:**

- Edit or rewrite other people's contributions
- Approve contributions outside their assigned hub (unless they moderate multiple hubs)
- Make changes to the schema, hub definitions, or platform infrastructure

Moderators are listed on their hub's page on the platform. New moderators are appointed by existing moderators or platform administrators.

---

## PR Review Workflow

When a contributor opens a pull request with a new skill or agent, the moderator for the relevant hub reviews it. This is the first and most frequent moderator workflow.

### Step 1: Automated Checks

Before the moderator reviews, the CI pipeline runs automatically on the PR:

- **Schema validation** — all required fields present, types correct, no platform fields included, validation rules pass.
- **Near-duplicate detection** — directory name compared against existing contributions within the same type. If a potential conflict is found, the CI bot posts an advisory comment on the PR. This does not block the merge.

If schema validation fails, the PR cannot be merged. The contributor must fix the issues first. The moderator does not need to intervene unless the contributor needs guidance.

### Step 2: Moderator Review

Once CI passes, the moderator reviews the PR for:

- **Documentation quality** — is the Overview clear? Does Usage explain how to invoke it? Are the examples realistic?
- **Accuracy of tested_with** — is the model claimed plausible for this contribution?
- **Hub and sub-domain placement** — does the contributor's proposed placement match the content? Use [HUBS.md](HUBS.md) and the cross-cutting boundary decisions for guidance.
- **Duplication check** — does this contribution meaningfully overlap with an existing one? If the CI bot flagged a near-duplicate, evaluate whether it's a genuine conflict or a false positive.
- **Sub-domain proposal** — if the contributor is proposing a new sub-domain, review the linked issue using the criteria in [HUBS.md](HUBS.md).

### Step 3: Hub Label

If the contribution is ready to merge, add a label to the PR following this format:

```
hub:{domain}/{subdomain}
```

Examples:

- `hub:marketing/email-automation`
- `hub:sales/lead-generation`
- `hub:legal/contract-management`

Use lowercase. The domain and subdomain must match entries in [HUBS.md](HUBS.md) (hyphenated, no ampersands or special characters in the label — normalize names like "Finance & Accounting" to `finance-accounting`).

This label is read by the sync pipeline after merge to set the `domain` and `subdomain` fields in the database. If the label is missing, the contribution will appear on the platform without hub assignment and will need to be corrected via the admin panel.

### Step 4: Approve or Request Changes

- **Approve and merge** — if the contribution meets all criteria and the hub label is applied.
- **Request changes** — if there are issues. Leave a clear comment explaining what needs to change. Be specific — "documentation needs work" is not actionable; "the Usage section doesn't explain what inputs the skill expects" is.
- **Suggest a different sub-domain** — if the contributor's proposed placement is wrong, comment with the correct sub-domain and update the hub label accordingly.

### Step 5: Post-Merge

After merge, the sync pipeline runs automatically. Within minutes:

- The contribution record is created in the database with platform fields initialized (`verified: false`, `upvotes: 0`, `usage_count: 0`).
- The hub and sub-domain are set from the PR label.
- Files are uploaded to the CDN.
- The contribution is live and installable.

No moderator action is needed at this stage. If the hub label was wrong or missing, correct it via the admin panel (see [Admin Panel](#admin-panel)).

---

## Verification Workflow

Verification is separate from PR review. A contribution can be merged and live on the platform without being verified. Verification is a deeper quality check that earns the contribution the verified badge — one of the four core social signals on the platform.

### When to Verify

Verification is not required on a timeline. Moderators verify contributions when they have time, prioritizing contributions with high upvotes or usage counts (community signal that the contribution is valuable and worth the verification effort). New contributions from established contributors with a track record of verified work may also be prioritized.

### Verification Checklist

All four items must pass for verification.

**1. Documentation quality**

- Does the Overview accurately describe what the contribution does?
- Does the Usage section explain how to invoke it and what to expect?
- Are the examples realistic and representative of actual use?
- Is anything misleading or overpromised?

**2. Functional test**

- Run the skill or agent against at least one model.
- Test the most common use case described in the Examples section.
- Confirm it produces useful output without errors, hallucinations, or broken tool calls.
- Record which model you tested with — this becomes `verification_model`.

**3. Domain accuracy**

- Is this contribution in the correct hub and sub-domain?
- Does it overlap significantly with an existing verified contribution?
- If there's overlap, is this contribution differentiated enough to justify its existence?

**4. Safety and quality**

- Does the contribution include appropriate guardrails?
- For agents, does the system prompt contain anything harmful, misleading, or that violates platform guidelines?
- Is the contribution licensed correctly (valid SPDX identifier)?

### Recording the Result

**Pass:** In the admin panel, set:

- `verified` → `true`
- `verification_date` → today's date
- `verification_model` → the model you tested with (e.g., `claude-sonnet-4-6`)

**Fail:** Leave a comment on the contribution's discussion thread explaining what needs to change. Be specific about which checklist item(s) failed and what the contributor can do to address it. Do not change the `verified` field — it remains `false`.

The contributor can address the feedback, update their contribution via a new PR, and request re-verification at any time.

### Re-Verification

When a contributor updates a verified contribution (bumps the version), the verified badge is **not** automatically removed. However, if the update changes the contribution's behavior significantly, the moderator should re-verify it using the same checklist. If re-verification fails, set `verified` → `false` via the admin panel and leave a comment explaining why.

---

## Moderation Actions

Beyond PR review and verification, moderators have a set of actions for managing contributions, discussions, and contributors within their hub. All actions are performed through the admin panel.

### Contribution Actions

**Reassign domain/subdomain** — change the hub or sub-domain placement of a contribution. Use when the original placement was incorrect or when a sub-domain reorganization requires moving contributions.

**Verify / Unverify** — set or clear the verified badge. Unverify when a contribution degrades after an update, a new model version breaks it, or re-verification fails.

**Hide** — temporarily remove a contribution from search results and hub browsing. The database record, votes, comments, and install history are preserved. Use when a contribution is reported as harmful, broken, or misleading and you need time to investigate. Hidden contributions can be unhidden once the issue is resolved.

**Remove** — soft-delete the contribution. It disappears from the platform entirely but the data is preserved for audit. Use when a contribution violates the CLA, contains harmful content, or the contributor requests removal. This is a serious action — prefer hiding first if the situation is unclear.

### Comment Actions

**Delete comment** — remove a specific comment from a discussion thread. Use for spam, abuse, or off-topic content that degrades the discussion.

**Lock thread** — prevent new comments on a contribution's discussion. Existing comments remain visible. Use when a thread has become unproductive, heated, or is being targeted by spam. Threads can be unlocked later.

### Contributor Actions

**Ban** — prevent a user from submitting new contributions, commenting, or voting. Their existing contributions remain on the platform unless independently removed. Use for repeated violations, spam accounts, or bad-faith participation. Requires a reason to be recorded. This is the most serious moderation action and should be a last resort after other interventions have failed.

---

## Admin Panel

The admin panel is a Supabase-backed interface where moderators perform actions that can't be done through GitHub (verification, hiding, banning, hub reassignment, thread locking).

**Access:** Moderators are authenticated via GitHub OAuth. The admin panel checks the `hub_moderators` table to verify that the logged-in user has moderator permissions for the relevant hub. Actions are scoped to the moderator's assigned hubs — a Marketing moderator cannot modify contributions in the Legal hub.

**Available actions per hub:**

- View all contributions in the hub, including hidden ones
- Set or change domain/subdomain on any contribution
- Set or clear verified status, verification date, and verification model
- Hide or unhide contributions
- Remove (soft-delete) contributions
- Delete individual comments
- Lock or unlock discussion threads
- Ban or unban users (applies platform-wide, not per-hub)

**Audit trail:** All moderation actions are logged with the moderator's identity, the action taken, and a timestamp. This log is available to platform administrators for oversight.

---

## Guidelines

**Be responsive.** PR reviews should be completed within 48 hours. If you can't review in time, let another moderator in your hub know.

**Be specific.** When requesting changes or explaining a verification failure, give actionable feedback. "The documentation needs improvement" is not helpful. "The Usage section should explain what format the input file needs to be in" is.

**Be transparent.** All moderation actions should be explainable. If you hide or remove a contribution, leave a comment explaining why. If you ban a user, record the reason.

**Prefer lighter actions.** Hide before removing. Comment before locking. Warn before banning. Escalation should be proportional.

**Stay in your lane.** Only moderate contributions in your assigned hubs. If you notice an issue in another hub, flag it to that hub's moderator rather than taking action yourself.

**Don't edit contributions.** If something needs fixing, tell the contributor. The contribution is their work — they make the changes.
