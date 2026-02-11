# Release Checklist (Model-Agnostic)

Use this before every deploy, regardless of whether you use ChatGPT, Gemini, or another tool.

## 1) Scope lock
- Define one shippable target only (example: `Word Quest palette preset + persistence`).
- Keep a short context packet: branch, goal, current bug, required tests.

## 2) Branch hygiene
- Work from a `codex/...` branch.
- Keep `main` untouched in your local working copy.
- Before deploy, merge/rebase `origin/main` into your branch.

## 3) Acceptance checks
- Confirm the exact behavior in-browser for the target scope.
- For clickability regressions, require real `locator.click()` checks.
- Keep `elementFromPoint` guard in tests for overlap/intercept diagnosis.

## 4) Deploy gate
- Run:

```bash
./deploy-main.sh
```

This script blocks deploy when:
- tracked files are dirty
- you are on `main` or detached HEAD
- your branch is behind/diverged from `origin/main`

It also stamps build markers and pushes:
- your branch to `origin/<branch>`
- your branch to `origin/main`

## 5) Live verification
- Open:
  - `https://bkseatown.github.io/Cornerstone-MTSS/literacy-platform/index.html`
  - `https://bkseatown.github.io/Cornerstone-MTSS/literacy-platform/word-quest.html#demo`
- Confirm visible `Build:` badge matches the expected deploy hash.
- Verify the exact UI issue from the ticket is fixed in live.

## 6) Handoff format (keep it short)
- What changed (files only)
- Commit hash
- Test status (pass/fail + reason)
- Known risks or skipped checks
