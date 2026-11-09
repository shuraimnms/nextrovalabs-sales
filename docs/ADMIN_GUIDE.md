# Admin Guide

## Roles

| Capability | Employee | Admin | Super Admin |
|---|:-:|:-:|:-:|
| Use scripts, objections, academy, roleplay, templates, knowledge | ✔ | ✔ | ✔ |
| Create/edit/publish content, announcements | | ✔ | ✔ |
| Create, suspend, delete **employees**; issue reset links | | ✔ | ✔ |
| Create/suspend/delete **admins**, change roles | | | ✔ |
| View analytics | | ✔ | ✔ |
| View audit log | | | ✔ |

The last remaining Super Admin cannot be demoted, suspended or deleted. Nobody can change their own role or status.
These rules are enforced on the server, not just hidden in the UI.

## Managing employees (Admin → Employees)

- **Create user:** name, email, role, temporary password (≥ 10 chars, upper + lower case + digit). Share it privately —
  the person is forced to choose their own password at first sign-in.
- **Suspend / Activate:** a suspended person is signed out immediately and cannot sign in.
- **Reset link:** generates a single-use link valid for 30 minutes (shown once). Send it privately. If email delivery (Resend) is configured,
  people can also use *Forgot password*.
- **Delete:** soft delete — the account is disabled and hidden; their learning history is kept for reporting.
- Five wrong passwords lock an account for 15 minutes; sign-in attempts are also rate-limited per email and per IP.

## Managing content

Every content type has the same flow: **list → edit → Save → Publish / Unpublish / Send for review / Delete.**
Deleting archives the item and hides it from employees; it is not physically removed.

### Scripts (with version history)
Every save creates a new version. Open a script → **Version history** → **Restore** to roll back (restoring creates a new version, so nothing is lost).
Fields: title, category, service, call stage, difficulty, scenario, recommended Hinglish script, alternative, English version, usage guidance, things to avoid, approval state.

### Objections
Each objection carries four response variants (recommended, short, detailed, alternative), why it works, and what *not* to say.

### Courses
Edit course details and passing score, lessons, and quiz questions (a correct-answer index is validated against the options).
Learners' quiz answer keys are never sent to the browser.

### Announcements
Priority + message; shown on employee dashboards. Remove them from the same page.

## "Pending confirmation" items — please review these

Content that depends on **company facts the source material did not verify** (prices, delivery timelines, payment terms, policies, guarantees,
team/client claims) is marked `Pending confirmation`. It is visible to employees with a badge so nobody mistakes it for approved wording.
To clear it: open the item, correct the wording to the real policy, set **Approval** to *Approved*, and save.
The admin home shows the live count. See [OPEN_ITEMS.md](OPEN_ITEMS.md) for the current list of areas.

## Analytics

Admin → Analytics shows real aggregates from stored data: active employees, lesson completions, quiz attempts and averages,
certificates, roleplay sessions and average scores, and per-course results. With no activity yet, averages display as empty rather than as made-up numbers.
Roleplay stores **scores only — not transcripts**.

## Audit log (Super Admin)

Records sign-ins/failures/lockouts, user and role changes, content create/edit/publish/delete, restores, and reset-link issuance.
Secrets (passwords, tokens, API keys) are scrubbed before being written, and reset tokens never appear in the log.

## Routine checklist

- Weekly: review *Pending confirmation* count, suspend leavers the same day, check Analytics for courses with low pass rates.
- Monthly: review the audit log for repeated lockouts; rotate any shared temporary passwords that were never changed.
