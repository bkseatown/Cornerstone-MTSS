# Handoff Summary (Decode the Word)

## Admin-Facing Brief (Short)
Vision: A structured, evidence-aligned literacy platform that supports foundational reading, writing, comprehension, fluency, and SEL with clear learning pathways and teacher-friendly workflows.

Who it serves: Classroom teachers, specialists (SPED/SLP/ELL/Intervention), and K-12 administrators (MTSS/RTI/PBIS).

Alignment highlights: Science of Reading foundations, writing routines, fluency with prosody, comprehension strategy instruction, SEL/Empathy activities, IB ATL + CASEL mapping.

Core learning pathway (no wandering): Placement -> Skill pathway map -> Daily routine (Warm-Up -> Practice -> Apply -> Reflect) -> Short progress checks + next skill recommendations.

Teacher workflow: One-click learning targets, IEP/504/RTI note support, exportable summaries, consistent navigation.

Admin value: Evidence-aligned, tiered intervention + grade-level access, clear data for MTSS, accessible to specialists.

## Current Build State (Platform Shell Is Live)
The repo is now a multi-activity platform with a real Home hub. Word Quest (Wordle) is one activity among many.

Primary pages:
- `index.html` — Home / Learning Hub (main entry)
- `word-quest.html` — Word Quest (decoding game + Teacher Settings + Sound Lab)
- `cloze.html` — Story Fill (cloze)
- `comprehension.html` — Read & Think (passage + questions)
- `fluency.html` — Speed Sprint (ORF-style fluency)
- `madlibs.html` — Silly Stories (Mad Libs)
- `writing.html` — Write & Build (Step Up–style writing builder)
- `plan-it.html` — Plan-It Challenge (executive function scheduling mini-game)

Key changes already implemented (high-level):
- New Bright Lab theme, light-mode force for classroom projection.
- Kid-friendly labels across nav (Word Quest, Story Fill, Read & Think, Speed Sprint, Silly Stories).
- Sound Lab moved into `Tools` menu (no longer front-and-center).
- Sounds Warm‑Up/Sound Lab modal: centered, scrolls internally, resizable; responsive even when resized (ResizeObserver adds `phoneme-narrow`/`phoneme-short`).
- Adventure/coins pill removed from the main Word Quest UI:
  - No “Adventure” quick button in the HUD.
  - No “Adventure” header button injection.
  - Game modes are accessible via Teacher Settings → `Game Modes` (teacher-only).
- Recording Studio mic cleanup: stream tracks are stopped on stop + on modal close (prevents “mic stays on”).
- Fit-to-screen mode automatically tightens spacing below ~900px height (helps avoid browser zoom).
- Teacher Settings: “Transfer settings” export/import (JSON) for portability between devices (no accounts needed).
- Fluency: added clickable ORF tracking (mark errors + set stop word) to reduce teacher workload.
- New activities added:
  - Write & Build: Step Up–inspired plan → draft → check routine.
  - Plan-It Challenge: calm planning/organizing game with overlap checks.

Files touched so far:
- app.js
- style.css
- fluency.js
- index.html
- word-quest.html
- cloze.html
- comprehension.html
- fluency.html
- madlibs.html
- writing.html
- writing.js
- plan-it.html
- plan-it.js

Open issues / requests still pending:
- Fluency: passages still need expansion + tighter grade-banding (and longer “doesn’t run out” options for 1–2 minute reads).
- Page-level design polish (still in-progress):
  - Reduce “boxy” feel by adding shared page surfaces / tighter grid rhythm.
  - Confirm headings/subtitles contrast on projectors (WCAG-ish pass).
  - Make two-panel pages resize more gracefully (no overlap on narrow widths).
- Consider unifying “coins/streak” gamification across non-Word-Quest pages (currently each activity manages its own HUD).

## Recommendation Confirmed
Use Option 1: Home hub as the main page; Word Quest becomes one activity in the platform.

## What to tell the new thread
Share `HANDOFF.md`. Confirm Option 1. Then proceed in this order:
1) Fluency overhaul (true-length passages + prosody/accuracy supports + teacher scoring flow)
2) Ongoing UI polish + accessibility pass (projector-first, responsive, contrast)
3) Content expansion: comprehension/cloze banks + writing prompts + fluency bank
4) Optional: Teacher resource library (local links, export/import) + offline/PWA enhancements
