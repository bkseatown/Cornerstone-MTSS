# Literacy Platform Handoff

Last updated: 2026-02-09

## 2026-02-09 bonus riddle prompt + azure-only popup audio stabilization slice
- Scope files:
  - `literacy-platform/app.js`
  - `literacy-platform/word-quest.html`
- Riddle popup fix:
  - Added `splitRiddlePromptAndAnswer()` so `Riddle Time!` shows only the prompt/question in the modal.
  - Answer text remains parsed internally but is not shown in the popup body.
- Voice/audio consistency fix:
  - `bonus-hear` no longer routes to system `speechSynthesis` fallback.
  - Bonus read-aloud now attempts Azure packed literal clips first; if unavailable, it does not switch to system voices.
  - Added Azure-pack preview fallback + clear toast messaging when a literal bonus clip is not available.
  - Disabled `scheduleEnhancedVoicePrefetch()`/`prefetchEnhancedVoice()` warmup path so hidden system-voice warmup cannot interrupt/override Azure-only behavior.
- Settings sync fix:
  - `syncSettingsFromPlatform()` now applies `ttsPackId` changes from `decode:settings-changed`, so Voice modal selection immediately updates active pack behavior.
- Cache busting:
  - Updated Word Quest app script query to `app.js?v=20260209k` in `literacy-platform/word-quest.html`.

### Validation run
- Syntax:
  - `node --check literacy-platform/app.js` ✅
- Regression scripts:
  - `node /tmp/wordquest_regression.js` ✅ (no overflow/scroll fallback regressions; no vowel dots)
  - `node /tmp/translation_runtime_check.js` ✅
- Focused Playwright smoke (inline) ✅:
  - Riddle parser result for sample line:
    - prompt: `I have a face and two hands, but no arms or legs. What am I?`
    - answer parsed separately: `A clock.`
  - Bonus modal displays prompt only (answer hidden).
  - Bonus Hear This does not trigger system speech fallback (`before=0`, `calls=0` in check harness).
  - Voice pack event sync updates stored pack (`ttsPackId` changed to `sonia-en-gb` in event test).

## 2026-02-09 home setup gate + azure voice lock + class-safe guess filter slice
- Scope files:
  - `literacy-platform/platform.js`
  - `literacy-platform/home.js`
  - `literacy-platform/app.js`
  - `literacy-platform/index.html`
  - `literacy-platform/style.css`
  - cache query bumps to `v=20260209j` across deployed HTML pages using `platform.js`, `home.js`, and `app.js`.
- Home onboarding cleanup:
  - Removed legacy Home guide-tip banner (`Hide` / `Don't show again`) by dropping the Home guide tip source.
  - Home hero now keeps single visible question panel with cleaner wording (`Who are we helping today?`) and no visible lookahead step chips.
  - While `home-precheck` is active, top nav controls are hidden so setup is uncluttered; full nav reappears after completion.
- Voice modal hard lock to Azure pack voices:
  - Rebuilt global `Voice & Language` quick modal to a single Azure voice dropdown only (5 allowed voices):
    - Ava (en-US), Emma (en-US), Guy (en-US), Sonia (en-GB), Ryan (en-GB).
  - Removed `English preset` and `Audio pack` controls and removed any system/browser voice list path from this modal.
  - Default selection is `ava-multi` (Ava) when prior setting is invalid/missing.
  - Preview button now plays packed Azure clips directly (with fallback candidate clip paths) and translation language lock remains.
- Theme system polish:
  - Accessibility theme options are now 4 named presets:
    - `Calm`, `Playful`, `Classic`, `High Contrast`.
  - Added `minimal-ink -> classic` compatibility mapping for older saved settings.
  - Increased visual separation between preset palettes in CSS for clearer app-wide theme differences.
- Class-safe profanity guard restored/expanded:
  - Added explicit class-safe blocked-word checks for:
    - custom challenge word validation,
    - random dictionary target selection,
    - submitted board guesses.
  - Isolated unsafe guesses (for example `ass`) are blocked; safe containing words (for example `class`) remain allowed.

### Validation run
- Syntax:
  - `node --check literacy-platform/platform.js` ✅
  - `node --check literacy-platform/home.js` ✅
  - `node --check literacy-platform/app.js` ✅
- Regression scripts:
  - `node /tmp/home_detail_visible.js` ✅ (`[]` pre-check details hidden)
  - `node /tmp/wordquest_regression.js` ✅ (no overflow, no scroll fallback, vowel dots off, voice shortcut present)
  - `node /tmp/translation_runtime_check.js` ✅
- Focused smoke checks (Playwright inline) ✅:
  - Voice modal:
    - only one voice dropdown,
    - no dialect/audio-pack controls,
    - exactly 5 Azure voices,
    - selected default `ava-multi`,
    - preview status: `Previewing Ava (en-US).`
  - Home setup:
    - no `page-guide-tip`,
    - only `home-step-panel-1` visible on load,
    - header actions hidden during `home-precheck`.
  - Class-safe filter:
    - `isBlockedClassSafeWord('ass') === true`,
    - `isBlockedClassSafeWord('class') === false`,
    - blocked sample count from 120 dictionary picks: `0`.

## 2026-02-09 home single-question flow + Azure-only voice picker slice
- Scope files:
  - `literacy-platform/index.html`
  - `literacy-platform/home.js`
  - `literacy-platform/style.css`
  - `literacy-platform/platform.js`
  - `literacy-platform/app.js`
  - cache-query bumps across HTML pages (`platform.js`, `home.js`, `app.js`) to `v=20260209h`.
- Home UX overhaul (strict guided flow):
  - Removed visible step pills and right-side helper panel from the hero onboarding shell.
  - Replaced with one-question-at-a-time cards:
    - Welcome -> role choice (`I am a Student` / `I am a School Team Member`)
    - Student path -> `What do you want help with today?` (`Reading & Words`, `Math & Numbers`, `Not sure yet`)
    - School Team path -> `What is your role?`
    - Quick Check confirm + launch.
  - Updated Home copy to emphasize `Your Starting Path` and simplified CTA language.
  - Preserved strict pre-check gating:
    - workspace/detail cards remain hidden until Quick Check completion.
  - Added stale-state guard on role change:
    - switching Student/School now clears stale prior onboarding answers so old values do not auto-fill the new flow.
- Voice picker correction:
  - Global `Voice & Language` quick modal now uses Azure pack voices only (no giant browser/system list).
  - Dialect filtering now surfaces only relevant US/GB pack voices.
  - Added deterministic fallback pack roster when registry fetch is unavailable.
  - Default voice pack set to `ava-multi` (Ava) across modal/home/app settings.

### Validation run
- Syntax:
  - `node --check literacy-platform/home.js` ✅
  - `node --check literacy-platform/platform.js` ✅
  - `node --check literacy-platform/app.js` ✅
- Regression scripts:
  - `node /tmp/home_detail_visible.js` ✅ (`[]` before quick check)
  - `node /tmp/wordquest_regression.js` ✅ (no overflow, no scroll fallback, vowel dots off)
  - `node /tmp/voice_quick_check.js` ✅ (`Ava/Emma/Guy` shown for `en-US`; Ava selected)
  - `node /tmp/translation_runtime_check.js` ✅
- Focused Home UI smoke (Playwright inline) ✅:
  - stepper hidden, only one panel visible at a time,
  - role buttons show Student + School Team only,
  - Student path shows Reading/Math/Not sure choices,
  - School path shows role selector in step 2.
- Note:
  - Legacy `/tmp/home_flow_check.js` currently fails because it still expects removed field `#home-student-name`; this is a script-assumption mismatch after the one-question Home refactor.

## 2026-02-09 stale-cache + voice picker stabilization slice
- Scope files:
  - `home.js`
  - `platform.js`
  - `style.css`
  - `index.html`
  - `word-quest.html`
  - mirrored to:
    - `literacy-platform/home.js`
    - `literacy-platform/platform.js`
    - `literacy-platform/style.css`
    - `literacy-platform/index.html`
    - `literacy-platform/word-quest.html`
- Home no-default hardening:
  - Bumped wizard storage key namespace from `cornerstone_home_state_v3::` to `cornerstone_home_state_v4::` to clear stale pre-refactor onboarding state that could auto-open Step 4 with old values.
  - Tightened state sanitize logic so `quickCheckComplete` is no longer inferred from stale `quickCheckSummary` alone.
  - Prevents old summary payloads from showing “next step”/Word Quest blocks before a current Quick Check run.
- Voice quick modal upgrade:
  - Added `Audio pack` selector to `Voice & Language` modal (`voice-quick-pack`) that loads from `audio/tts/packs/pack-registry.json` (with scoped fallback path handling).
  - Saved selection to settings as `ttsPackId` alongside dialect/voice/translation options.
  - Updated microcopy to clarify:
    - `Voice choice` = browser/system voices
    - `Audio pack` = downloaded Azure pack choices
- Word Quest visual adjustments:
  - Increased desktop keyboard target sizes (`--wq-key-size-desktop`, `--wq-key-wide-size-desktop`) and keyboard max width for readability.
  - Kept vowel pseudo-dot markers fully disabled (`content: none`).
- Cache busting:
  - Updated script queries to force fresh assets after stale `388381a1` browser cache states:
    - `index.html`: `platform.js?v=20260209f`, `home.js?v=20260209f`
    - `word-quest.html`: `platform.js?v=20260209f`, `app.js?v=20260209f`
    - same updates in `/literacy-platform` mirrors.

### Validation run
- Syntax:
  - `node --check '/Users/robertwilliamknaus/Desktop/New project/home.js'` ✅
  - `node --check '/Users/robertwilliamknaus/Desktop/New project/platform.js'` ✅
  - `node --check '/Users/robertwilliamknaus/Desktop/New project/app.js'` ✅
- Regression scripts:
  - `node /tmp/home_flow_check.js` ✅ (Step 1 visible only, no role preselected, Step 4 locked)
  - `node /tmp/home_detail_visible.js` ✅ (`[]` pre-check hidden detail sections)
  - `node /tmp/voice_quick_check.js` ✅ (41 voices found; quick modal functional)
  - `node /tmp/wordquest_regression.js` ✅ (no overflow, no scroll fallback, vowel dot content `none`)

## Project + repo
- Git root: `/Users/robertwilliamknaus/Desktop/New project`
- App folder: `/Users/robertwilliamknaus/Desktop/New project/literacy-platform`
- Remote: `origin https://github.com/bkseatown/Cornerstone-MTSS.git`
- Branch: `main`
- Latest pushed commit: check with `git -C "/Users/robertwilliamknaus/Desktop/New project" log -1 --oneline`
- Local artifact noise may still exist from visual tests (`playwright-report`, `test-results`), but source updates above are pushed.

## 2026-02-09 root Home/Voice/WordQuest stabilization slice
- Scope files:
  - `index.html`
  - `home.js`
  - `platform.js`
  - `app.js`
  - `style.css`
- Home wizard fixes:
  - Home stepper is real gated navigation (clickable for unlocked steps only).
  - Home state storage moved to `cornerstone_home_state_v3::<learner>` to reset legacy role defaults.
  - First load now starts with no role selected (no auto EAL/subrole default).
  - Step 1 Next now enforces role selection before advancing.
  - Step 3 Next now enforces focus selection before advancing.
  - `Start new` now fully resets wizard + quick-check state and returns to Step 1.
  - Pre-check now hides all `data-home-detail` sections; only wizard is visible before completion.
  - Post-check card no longer appears from stale summary-only state; it requires `quickCheckComplete=true`.
- Voice modal fixes:
  - Modal now keeps dialect presets but shows full available English voice list sorted by selected dialect.
  - Added clear copy that Azure downloaded packs play in activities (they do not appear as browser `speechSynthesis` voices).
  - Added status text styling + disabled-state styling for preview actions.
- Word Quest keyboard/vowel polish:
  - Increased keyboard key sizing (base + fit-screen + fit-screen-tight).
  - Increased desktop fit algorithm keyboard target sizes for readability.
  - Hard-disabled vowel marker pseudo-dots (`::before/::after`) on Word Quest keys.

### Validation commands run
- `node --check /Users/robertwilliamknaus/Desktop/New project/home.js`
- `node --check /Users/robertwilliamknaus/Desktop/New project/platform.js`
- `node --check /Users/robertwilliamknaus/Desktop/New project/app.js`
- `NODE_PATH='/Users/robertwilliamknaus/Desktop/New project/literacy-platform/node_modules' node /tmp/home_flow_check.js`
  - Output confirms fresh load: only panel `1` visible, no role active, step `4` locked.
- `NODE_PATH='/Users/robertwilliamknaus/Desktop/New project/literacy-platform/node_modules' node /tmp/home_detail_visible.js`
  - Output `[]` confirms no workspace detail cards visible pre-check.
- `NODE_PATH='/Users/robertwilliamknaus/Desktop/New project/literacy-platform/node_modules' node /tmp/voice_quick_check.js`
  - Voice modal shows `voiceCount: 41` on this machine and saves selection.
- `NODE_PATH='/Users/robertwilliamknaus/Desktop/New project/literacy-platform/node_modules' node /tmp/wordquest_regression.js`
  - Confirms no overflow, no scroll fallback, and `vowelDotContent: "none"`.

## 2026-02-09 parity sync slice (root <-> literacy-platform)
- Goal:
  - Remove path-dependent behavior so opening app from repo root or `/literacy-platform` shows the same Home/Voice/Word Quest behavior.
- Synced files from root into `/literacy-platform`:
  - `literacy-platform/home.js`
  - `literacy-platform/index.html`
  - `literacy-platform/platform.js`
  - `literacy-platform/app.js`
  - `literacy-platform/style.css`
- Cache-bust update:
  - `index.html` and `literacy-platform/index.html` now reference `platform.js?v=20260209e`.

### Validation commands run for parity
- Root path:
  - `NODE_PATH='/Users/robertwilliamknaus/Desktop/New project/literacy-platform/node_modules' node /tmp/home_flow_check.js`
  - `NODE_PATH='/Users/robertwilliamknaus/Desktop/New project/literacy-platform/node_modules' node /tmp/home_detail_visible.js`
  - `NODE_PATH='/Users/robertwilliamknaus/Desktop/New project/literacy-platform/node_modules' node /tmp/voice_quick_check.js`
  - `NODE_PATH='/Users/robertwilliamknaus/Desktop/New project/literacy-platform/node_modules' node /tmp/wordquest_regression.js`
- `/literacy-platform` path:
  - `NODE_PATH='/Users/robertwilliamknaus/Desktop/New project/literacy-platform/node_modules' node /tmp/home_flow_check.js`
  - `NODE_PATH='/Users/robertwilliamknaus/Desktop/New project/literacy-platform/node_modules' node /tmp/home_detail_visible.js`
  - `NODE_PATH='/Users/robertwilliamknaus/Desktop/New project/literacy-platform/node_modules' node /tmp/voice_quick_check.js`
  - `NODE_PATH='/Users/robertwilliamknaus/Desktop/New project/literacy-platform/node_modules' node /tmp/wordquest_regression.js`

### Notes
- Home pre-check now starts with no role selected and only Step 1 visible in both paths.
- Voice modal now lists available system English voices (not just American/British presets) in both paths.
- Word Quest keyboard remains no-scroll fit with vowel indicator dots removed in both paths.

## 2026-02-09 ava-multi TTS completion slice
- Scope:
  - Finalized in-progress multilingual `ava-multi` exporter output under:
    - `literacy-platform/audio/tts/packs/ava-multi/`
    - `literacy-platform/audio/tts/packs/pack-registry.json`
- Resulting manifest integrity:
  - Manifest entries: `15229`
  - Type totals: `word=5000`, `def=5000`, `sentence=5000`, `phoneme=79`, `passage=150`
  - Language totals:
    - `en`: `1729` (includes phoneme + passage)
    - `es/zh/tl/hi/ms/vi/ar/ko/ja`: `1500` each (`500 word + 500 def + 500 sentence`)
  - File existence check against manifest:
    - `checked=15229`, `missing=0`
- Runtime spot checks:
  - `translation_runtime_check` reports:
    - `hiMissingReturnsNull=false`
    - `msHasRealCopy=true`
    - `noSpeechWhenVoiceMissing=true`
    - `noteShowsUnavailable=true`
- Note:
  - The legacy helper-based `translation_label_check` script currently fails because `window.getTranslationCoverageForLanguage` is not exposed in the current runtime; this is a test-script mismatch, not a pack generation failure.

## 2026-02-08 latest shipped pass
- Nav dropdown clipping fix:
  - Group menus now auto-clamp to viewport (no half-offscreen menu at standard zoom).
- Global Voice quick access:
  - New persistent `🔊 Voice` shortcut in top nav across pages.
  - Quick modal sets English voice dialect + default reveal language + lock toggle.
  - Preview button dispatches immediate voice preview on Word Quest.
- Word Quest language options expanded:
  - Added `Arabic`, `Korean`, `Japanese` in reveal language dropdown and teacher default selector.
  - Language labels include parenthetical English names.
- Azure exporter improvements:
  - Added locale + default voice support for `ms`, `vi`, `ar`, `ko`, `ja`.
  - Updated `scripts/azure-voice-map.ava-multilingual.example.json` with recommended voices, including a stronger Vietnam voice baseline.

## 2026-02-09 stabilization pass (pushed)
- Full reveal-copy safety sweep (all grades):
  - Added broader trust/safety phrase blocking for reveal text (e.g., inappropriate/body-humor style lines).
  - Added explicit school-safe overrides for high-friction words (`mouth`, `web`, `solo`, `misfit`, `gnat`, `spider`, `mouse`, `toothbrush`, `soup`, `monster`, `mosquito`, and more).
  - Young/EAL manual overrides now pass through sanitization (manual text can no longer bypass safety cleanup).
- Translation audio reliability:
  - Non-English reveal playback now attempts packed clips by language/type even if displayed translation text was lightly normalized.
  - Helps prevent silent Tagalog/Hindi/other translated playback when copy punctuation differs.
- Bonus content quality + quantity:
  - Curated and expanded jokes/riddles/facts/quotes pools (larger rotation, cleaner school tone).
  - Added read-aloud control in bonus modal (`Hear This`).
- Word Quest polish:
  - Forced compact quick-start overlay detection on `word-quest.html` path.
  - Increased visual prominence of vowel keys (stronger highlight + indicator dot).
  - Renamed student-mode exit affordance text to `Adult View` for clarity.

## 2026-02-09 follow-up stabilization pass (pushed)
- Commit: `0f1bc445`
- Home onboarding now runs as a strict sequential flow:
  - Step 1 role -> Step 2 who you are -> Step 3 focus -> Step 4 quick check.
  - Only one step panel is visible at a time.
  - Completed steps collapse into compact summary chips with Edit actions.
- Pre-check gating is enforced:
  - Large dashboard/workspace sections are hidden until Quick Check has a saved recommendation.
  - A new post-check card shows the recommended starting path + short teacher-facing bullets.
- Accessibility themes now include four presets in the panel:
  - `Calm`, `Playful`, `High Contrast`, `Minimal Ink` (saved in settings + applied via body theme classes).
- Word Quest tutorial now uses a smaller overlay card with a Wordle-style color legend (green/gold/gray) and `Got it` / `Don't show again`.
- Full-grade reveal-copy safety sweep was broadened:
  - Added additional school-safe overrides for high-risk entries (`dog`, `stress`, `gross`, `trunk`, `snort`, `fetch`, `eat`, `butterfly`, `snowman`, `fearless`, `knight`, `it's`, `fall`, `some`, `eye`, `sock`, `room`, `dad`, `sneeze`, `snore`, `pink`, `stapler`, `reflection`).
  - Expanded phrase blocklist so problematic legacy lines auto-fallback to safe text.

## 2026-02-09 handoff continuity update (pushed)
- Commit: `087c94e0`
- This handoff now reflects:
  - strict sequential Home onboarding status,
  - current translation/audio limitations,
  - current trust/safety expectations from user feedback,
  - next-chat bootstrap prompt.
- Important: there are still local generated artifacts (audio pack files + Playwright outputs) in the working tree that are intentionally not auto-committed by the agent.

## 2026-02-09 audio hardening slice (pushed)
- Commit: `70b23129`
- Word Quest reveal audio hardening:
  - Reveal opening now force-stops any in-flight audio players and queued speech before rendering.
  - Prevents overlapping/competing voices when prior speech diagnostics or prompts were still active.
  - Reveal remains fully manual (no automatic read-aloud on reveal open).
- Fallback behavior clarified:
  - Reveal + bonus hear actions keep `allowSystemFallback: false` so no robotic fallback voice is used when packed/Azure clips are missing.
  - Unavailable audio messaging now explicitly references missing Azure clips.
- Audio content refresh:
  - Refreshed `ryan-en-gb` English `def` + `sentence` clips for updated safety override words (committed clip files only).
- Validations run:
  - `node --check app.js`
  - `node /tmp/wordquest_regression.js`
  - `node /tmp/voice_quick_check.js`
  - `node /tmp/translation_runtime_check.js`

### Important local-state caution after partial TTS exports
- Local unstaged files may show exporter metadata drift:
  - `audio/tts/packs/pack-registry.json`
  - `audio/tts/packs/ryan-en-gb/tts-manifest.json`
  - `audio/tts/packs/ryan-en-gb/tts-export-report.json`
- Reason:
  - Running exporter with `--fields=def,sentence` can rewrite registry/manifest metadata to those fields only.
- Guardrail:
  - Do **not** commit those metadata files unless a full intended export is completed (or metadata is deliberately rebuilt).

## 2026-02-09 translation completion slices (pushed)
- Commit: `37e502dc`
  - Completed full Hindi coverage in `literacy-platform/words.js` (`500/500` words with `def+sentence`).
- Commit: `fd1c597e`
  - Completed full Arabic + Korean + Japanese coverage in `literacy-platform/words.js` (`500/500` each with `def+sentence`).
- Validation snapshots:
  - `translation_label_check`: Hindi label now fully ready; Arabic no longer shows `(coming soon)`.
  - Coverage counts now show `500/500` for `en/es/zh/tl/hi/ms/vi/ar/ko/ja`.
- Runtime note:
  - `translation_runtime_check` now reports `hiMissingReturnsNull=false` (expected after completion).

## 2026-02-09 role-first onboarding + coming-soon framework slice (latest)
- Scope:
  - Refactored Home onboarding wizard (`literacy-platform/index.html`, `literacy-platform/home.js`, `literacy-platform/style.css`) to keep one visible step panel at a time with explicit 1->4 labels:
    - `1. Role`
    - `2. Who you are`
    - `3. Focus`
    - `4. Quick Check`
  - Step updates:
    - Step 1 now includes School Team role selector (Teacher, LS, EAL, SLP, Counselor, Psychologist, Administrator, Dean).
    - Step 2 now uses role-specific fields:
      - Student: first name, grade band, optional English learner + vibe.
      - Parent: first name, child grade band, optional focus dropdown.
      - School Team: optional name, division/grade band, optional primary concern.
  - Post-check behavior:
    - Kept single “Your Best Next Step” card visible after Quick Check completion.
    - Added “Explore Activities” secondary action.
  - Added reusable coming-soon framework:
    - New shared script: `literacy-platform/coming-soon.js`
    - New pages:
      - `literacy-platform/writing-studio.html`
      - `literacy-platform/student-toolkit.html`
      - `literacy-platform/parent-toolkit.html`
      - `literacy-platform/school-team-toolkit.html`
      - `literacy-platform/teacher-toolkit.html`
      - `literacy-platform/learning-support-toolkit.html`
      - `literacy-platform/eal-toolkit.html`
      - `literacy-platform/slp-toolkit.html`
      - `literacy-platform/counselor-toolkit.html`
      - `literacy-platform/psychologist-toolkit.html`
      - `literacy-platform/administrator-toolkit.html`
      - `literacy-platform/dean-toolkit.html`
  - Nav + theme polish:
    - Writing nav route now points to `writing-studio.html`.
    - Added toolkit links in Tools menu.
    - Added a top-nav Theme action that opens the Theme & Accessibility panel.
    - Added theme swatch previews (Calm, Playful, High Contrast, Minimal Ink) in accessibility panel.
    - No red styling introduced in new UI states.

### Validation run for this slice
- `node --check literacy-platform/home.js` ✅
- `node --check literacy-platform/platform.js` ✅
- `node --check literacy-platform/coming-soon.js` ✅
- `NODE_PATH='/Users/robertwilliamknaus/Desktop/New project/literacy-platform/node_modules' node /tmp/home_flow_check.js` ✅
- `NODE_PATH='/Users/robertwilliamknaus/Desktop/New project/literacy-platform/node_modules' node /tmp/home_detail_visible.js` ✅
- `NODE_PATH='/Users/robertwilliamknaus/Desktop/New project/literacy-platform/node_modules' node /tmp/wordquest_regression.js` ✅

### Manual checks to run on live Pages after push
- Home:
  - Verify only one wizard panel is visible at a time.
  - Verify progress header labels show `1. Role • 2. Who you are • 3. Focus • 4. Quick Check`.
  - Verify “Your Best Next Step” appears only after Quick Check completion.
- Theme:
  - Open top-nav Tools -> Theme and confirm theme change is obvious + persists on refresh.
- Coming-soon pages:
  - Open `writing-studio.html`, `student-toolkit.html`, and `school-team-toolkit.html`.
  - Confirm “Notify me” stores locally and shows saved status.

## Non-negotiable user priorities
1. Word Quest no-scroll fit on desktop non-fullscreen + iPad
2. Audio/translation reliability (no wrong-language playback, no fake translation fallback)
3. Simplify top navigation and keep Home role-first/guided
4. Enforce kid-safe, clear reveal definitions/sentences/jokes

No net-new features before visual/UX stability passes.

## Stabilization status snapshot
### 1) Word Quest fit
- Verified via Playwright viewport sweep:
  - `1440x900`, `1280x780`, `1024x1366`, `1024x820`
  - `docOverflow=0` and `wq-scroll-fallback=false` in all tested viewports.
- Board + keyboard fit remains stable after recent edits.

### 2) Audio + translation reliability
- `app.js` now keeps translation hear-buttons enabled when packed clips exist, even if no matching system voice is found.
- Definition playback uses the correct clip type (`def`) instead of sentence routing.
- Packed clip lookup is always attempted (`shouldAttemptPackedTtsLookup() => true`) to avoid false "no audio" states.
- Missing translation text shows clear fallback (`Translation coming soon for this word.`), not fake generated translation.
- Important runtime note:
  - `file://` runs can falsely disable some packed translation audio checks (fetch context issue).
  - Validate from HTTP serving context (`http://localhost`) for real behavior.

### 3) Navigation + Home guidance
- Grouped nav + role-first Home guidance work was shipped in `b181d237`.
- Legacy top-level Classroom/Teacher competition is removed from activity top nav; tools are grouped in menu/actions.

### 4) Kid-safe reveal content
- Young/EAL sanitizer pipeline is active in `app.js` with:
  - word replacements
  - blocklist checks
  - concise safe fallbacks
  - language-aware punctuation/length cleanup
- Manual override bank exists in `young-overrides.js` (including: `sharp`, `dull`, `butter`, `blood`, `through`, `history`, `tax`).
- User trust requirements (must remain enforced):
  - No sexual/inappropriate references, no body-humor lines that can undermine school trust.
  - Humor should be kind/silly and understandable for school contexts.
  - Avoid harsh red error styling where possible in student-facing flows.
  - Keep reveal copy safe for all grades (not only Young/EAL mode).

## Translation + voice coverage status
### Written translations (`words.js`)
- Word count: `500`
- Coverage (definition + sentence complete):
  - `en`: `500/500`
  - `es`: `500/500`
  - `zh`: `500/500`
  - `tl`: `500/500`
  - `ms`: `500/500`
  - `vi`: `500/500`
  - `hi`: `500/500`
  - `ar`: `500/500`
  - `ko`: `500/500`
  - `ja`: `500/500`

### Bonus content translation status
- Jokes/riddles/facts/quotes are curated in English pools and support read-aloud.
- They are not currently maintained as full translated pools across all selected languages.

### Default Azure pack (`audio/tts`)
- Manifest: `audio/tts/tts-manifest.json`
- Entries: `6000`
  - `en/es/zh/tl`: each `500 word + 500 def + 500 sentence`
- File check: `missing=0` for manifest entries.

### Named Azure packs (`audio/tts/packs/*`)
- Registry: `audio/tts/packs/pack-registry.json`
- Packs: `ava-multi`, `emma-en`, `guy-en-us`, `sonia-en-gb`, `ryan-en-gb`
- Each pack manifest now includes:
  - `500 word + 500 def + 500 sentence + 150 passage` (English)
  - total `1650` entries.

## Terminal commands: regenerate Azure audio for updated word copy
Use these when definition/sentence text changes and you need fresh saved clips.

### Prereqs
```bash
cd "/Users/robertwilliamknaus/Desktop/New project/literacy-platform"
export AZURE_SPEECH_REGION="<your-region>"
export AZURE_SPEECH_KEY="<your-key>"
```

### Regenerate multilingual clips after copy updates
```bash
npm run tts:azure -- \
  --pack-id=ava-multi \
  --pack-name="Ava Multilingual" \
  --languages=en,es,zh,tl,hi,ms,vi,ar,ko,ja \
  --fields=word,def,sentence \
  --voice-map=scripts/azure-voice-map.ava-multilingual.example.json \
  --overrides=scripts/reveal-safety.overrides.json \
  --overwrite=false \
  --retries=1
```

`scripts/reveal-safety.overrides.json` is generated from `SCHOOL_SAFE_REVEAL_OVERRIDES` in `app.js` and keeps Azure clips aligned with school-safe reveal copy.

### Interpreting recent TTS output (`1000/1000 generated`)
- In `ava-multi`, `1000` tasks usually means `500 words x (def + sentence)` for English fields.
- `generated=1000, reused=0` means those clips were freshly regenerated (not reused).
- Next required step to publish those clips:
```bash
cd "/Users/robertwilliamknaus/Desktop/New project"
git add literacy-platform/audio/tts/packs/ava-multi literacy-platform/audio/tts/packs/pack-registry.json
git commit -m "Refresh Ava multilingual EN definition/sentence clips"
git push origin main
```

### Regenerate updated clips for `tax` in each named English pack
```bash
for pack in ava-multi emma-en guy-en-us sonia-en-gb ryan-en-gb; do
  rm -f "audio/tts/packs/$pack/en/def/tax.mp3" "audio/tts/packs/$pack/en/sentence/tax.mp3"
done

npm run tts:azure -- --pack-id=ava-multi --pack-name="Ava Multilingual" --languages=en --fields=def,sentence --voice-map=scripts/azure-voice-map.en-ava.example.json --overwrite=false --retries=1
npm run tts:azure -- --pack-id=emma-en --pack-name="Emma English" --languages=en --fields=def,sentence --voice-map=scripts/azure-voice-map.en-emma.example.json --overwrite=false --retries=1
npm run tts:azure -- --pack-id=guy-en-us --pack-name="Guy English US" --languages=en --fields=def,sentence --voice-map=scripts/azure-voice-map.en-us-guy.example.json --overwrite=false --retries=1
npm run tts:azure -- --pack-id=sonia-en-gb --pack-name="Sonia British English" --languages=en --fields=def,sentence --voice-map=scripts/azure-voice-map.en-gb-sonia.example.json --overwrite=false --retries=1
npm run tts:azure -- --pack-id=ryan-en-gb --pack-name="Ryan British English" --languages=en --fields=def,sentence --voice-map=scripts/azure-voice-map.en-gb-ryan.example.json --overwrite=false --retries=1
```

## Deploy reality
- Only pushed commits are visible on GitHub/GitHub Pages.
- If local edits exist, run:
```bash
cd "/Users/robertwilliamknaus/Desktop/New project"
git add literacy-platform/app.js literacy-platform/words.js literacy-platform/HANDOFF.md
git commit -m "Tighten kid-safe reveal sanitization and refresh tax copy"
git push origin main
```

## Next max-impact stabilization plan
1. Complete full strict word-bank sweep for remaining higher-friction terms (`scary/hurt/hate/fight`) with explicit EN/ES/ZH/TL overrides where auto-sanitization still feels awkward.
2. Re-export only changed clips per affected words and verify hear-buttons per language in HTTP context.
3. Run focused visual regression (`home` + `word-quest`) and keep artifact outputs out of commits.
4. Re-rate the four stabilization priorities after that sweep.

## 2026-02-09 Writing Studio full-build slice
### What changed
- `literacy-platform/writing-studio.html`
  - Replaced placeholder with full production Writing Studio shell (Plan -> Draft -> Check -> Revise -> Publish) and Step Up supports sidebar.
  - Added planner selector UI (`#writing-planner`) so organizer templates are explicit in the workflow.
- `literacy-platform/writing.js`
  - Added planner framework with selectable templates: `Step Up Frame`, `Idea Web`, `Boxes + Bullets`, `Narrative Mountain`, `5-Paragraph Frame` (3-5), `CER/OREO` (6-12).
  - Kept deterministic non-AI checks/missions and Step Up labels (`topic sentence`, `details/evidence`, `conclusion`, `transitions/power words`).
  - Added planner persistence to localStorage state and planner-aware plan->draft syncing.
- `literacy-platform/platform.js`, `literacy-platform/home.js`
  - Removed writing/toolkit "Coming Soon" wording where feature is now live.
  - Updated Writing quick-start guidance copy to reflect active workflow.
- `literacy-platform/teacher-report.js`, `literacy-platform/plan-it.js`, `literacy-platform/app.js`, `literacy-platform/coming-soon.js`
  - Updated Writing links to `writing-studio.html` for consistency.
- `literacy-platform/writing.html`
  - Added planner selector for parity with `writing-studio.html` (legacy entry path still works).

### Validated
- Syntax checks:
  - `node --check writing.js`
  - `node --check platform.js`
  - `node --check home.js`
  - `node --check teacher-report.js`
  - `node --check plan-it.js`
  - `node --check coming-soon.js`
  - `node --check app.js`
- Regression/behavior checks:
  - `/tmp/wordquest_regression.js` passed (`docOverflow=0` for desktop + iPad test viewports; vowel key and voice controls present).
  - Custom Playwright smoke:
    - Home starts with only step 1 visible (`visiblePanels:[1]`, details hidden pre-check).
    - Writing Studio loads with planner selector present and Step Up supports label visible.

### Known issues / notes
- Existing helper script `/tmp/home_flow_check.js` currently fails because it does not select a required student grade-band button before moving from Step 2; this is a script assumption mismatch, not a new runtime JS syntax failure.
- Large in-progress TTS outputs under `literacy-platform/audio/tts/packs/ava-multi/*` remain uncommitted in this slice by design.

## 2026-02-09 packed-audio-only stability slice
### What changed
- `literacy-platform/app.js`
  - Added `ENFORCE_PACKED_TTS_ONLY` guard and centralized `isSystemSpeechFallbackAllowed(options)` helper.
  - Locked `speak`, `speakText`, and `playTextInLanguage` to packed clips only (no system/browser speech fallback).
  - Decodable passage read flow now shows a clear toast when no packed clip exists instead of dropping to browser TTS.
  - Bonus modal now force-stops active audio/speech before opening to prevent overlap.
  - Phoneme-card click handling now always uses packed-only playback and shows a safety toast if "system voice" is selected.
  - `speakWithSystemVoice` now short-circuits under packed-only mode.

### Validated
- `node --check literacy-platform/app.js`
- `NODE_PATH='/Users/robertwilliamknaus/Desktop/New project/literacy-platform/node_modules' node /tmp/wordquest_regression.js`
- `NODE_PATH='/Users/robertwilliamknaus/Desktop/New project/literacy-platform/node_modules' node /tmp/voice_quick_check.js`
- `NODE_PATH='/Users/robertwilliamknaus/Desktop/New project/literacy-platform/node_modules' node /tmp/translation_runtime_check.js`

### User-impact note
- Reveal and bonus read-aloud remain manual-only.
- If a packed Azure clip is missing, app now stays silent (with clear unavailable messaging) instead of using robotic system speech.

## 2026-02-09 coverage + readiness snapshot
### Translation text coverage (`literacy-platform/words.js`)
- Total words: `500`
- Complete `def + sentence` coverage (`500/500` each) for:
  - `en`, `es`, `zh`, `tl`, `hi`, `ms`, `vi`, `ar`, `ko`, `ja`

### TTS pack status (definitions/sentences)
- `literacy-platform/audio/tts/packs/ava-multi/tts-manifest.json`
  - Region: `eastus`
  - Entries: `10000`
  - Per-language coverage: `1000` each across `en/es/zh/tl/hi/ms/vi/ar/ko/ja`
  - Fields: `def,sentence`
  - Voice map includes:
    - `en`: `en-US-AvaMultilingualNeural`
    - `zh`: `zh-CN-XiaoxiaoNeural`
    - `tl`: `fil-PH-BlessicaNeural`
    - `hi`: `hi-IN-SwaraNeural`
    - `ms`: `ms-MY-YasminNeural`
    - `vi`: `vi-VN-HoaiMyNeural`
    - `ar`: `ar-SA-ZariyahNeural`
    - `ko`: `ko-KR-SunHiNeural`
    - `ja`: `ja-JP-NanamiNeural`
- English-only packs (`emma-en`, `guy-en-us`, `sonia-en-gb`, `ryan-en-gb`)
  - Each has `1000` entries (`500 def + 500 sentence`) for `en`.

### Important audio caveats still open
- Word clips in packs:
  - Current pack manifests were generated with `fields=def,sentence`, so pack word clips are not indexed there.
  - Legacy default manifest (`audio/tts/tts-manifest.json`) still has `word+def+sentence` for `en/es/zh/tl` only.
- Passage clips:
  - `150` passage mp3 files exist on disk per English pack (`.../packs/*/en/passage`).
  - Current manifests have `0` `passage` keys, so app passage playback lookup cannot resolve them yet.
- Bonus content (jokes/riddles/facts/quotes):
  - Content is English-only pools (`general` and `young-eal` variants).
  - Under packed-only policy, bonus TTS requires packed clips; currently these lines are not packed as dedicated assets.

### Current decodable passage inventory
- Total passage texts in app: `150`
  - Base set in `app.js`: `80`
  - Expansion set in `decodables-expansion.js`: `70`
  - Grade-band mix (combined): `K-2: 83`, `3-5: 40`, `6-8: 15`, `9-12: 12`

### Remaining highest-impact tasks
1. Regenerate/reindex manifests to include `passage` keys for active English pack(s) so fluency passage audio is playable again.
2. Decide whether to add `word` fields to active multilingual pack (`ava-multi`) to enable translated “Hear Word” across all target languages.
3. Decide bonus audio strategy:
   - either generate packed clips for curated bonus lines, or
   - keep silent fallback (current behavior) when no packed clip exists.
4. Optional content scaling:
   - expand grade `6-12` fluency passage volume (currently lighter than K-5).
   - keep safety overrides + EN def/sentence clip refresh in lockstep after copy edits.

## 2026-02-09 phoneme voice + exporter hardening slice
### What changed
- `literacy-platform/app.js`
  - Added direct-path fallback for passage clips in `tryPlayPackedPassageClip` so existing `.../en/passage/*.mp3` files can play even when manifest keys are missing.
  - Added direct-path fallback for single-word packed clips inside `speakText` (helps sound-lab example words that are not the active game word).
  - Refactored `speakSpelling` to route through phoneme clip logic (no system TTS fallback).
  - Updated `speakPhonemeSound` to return boolean and use packed/recorded sources only.
  - Updated articulation button handlers to show explicit unavailable toasts when a packed clip is missing.
  - Removed stale “system voice” messaging in phoneme practice flows; current paths are teacher recordings + packed clips.
  - Teacher voice toggle now says `Using packed voice clips` when recordings are off.
- `literacy-platform/scripts/export-azure-tts.js`
  - Added `--preserve-existing=true` behavior (default) so incremental exports no longer wipe existing manifest entries/fields/languages.
  - Export now merges existing manifest metadata before writing updated manifests/reports/registry.

### Validation run
- `node --check literacy-platform/app.js`
- `node --check literacy-platform/scripts/export-azure-tts.js`
- `NODE_PATH='/Users/robertwilliamknaus/Desktop/New project/literacy-platform/node_modules' node /tmp/wordquest_regression.js`
- `NODE_PATH='/Users/robertwilliamknaus/Desktop/New project/literacy-platform/node_modules' node /tmp/voice_quick_check.js`
- `NODE_PATH='/Users/robertwilliamknaus/Desktop/New project/literacy-platform/node_modules' node /tmp/translation_runtime_check.js`

### Export command status
- Full export attempt was blocked in this shell due missing Azure env credentials:
  - `Missing Azure credentials. Provide --region/--key or AZURE_SPEECH_REGION/AZURE_SPEECH_KEY.`
- Dry-run estimate for recommended command:
  - tasks: `10579`, phoneme tasks: `79`, missing text records: `4500` (non-English `word` text not present in `words.js` schema).

### Recommended next command (run in a shell with Azure creds loaded)
```bash
cd "/Users/robertwilliamknaus/Desktop/New project/literacy-platform"
npm run tts:azure -- \
  --pack-id=ava-multi \
  --pack-name="Ava Multilingual" \
  --languages=en,es,zh,tl,hi,ms,vi,ar,ko,ja \
  --fields=word,def,sentence \
  --include-phonemes=true \
  --phoneme-set=all \
  --voice-map=scripts/azure-voice-map.ava-multilingual.example.json \
  --overrides=scripts/reveal-safety.overrides.json \
  --overwrite=false
```

## 2026-02-09 ava-multi export completion (user-run)
### Output received
- Manifest: `literacy-platform/audio/tts/packs/ava-multi/tts-manifest.json`
- Report: `literacy-platform/audio/tts/packs/ava-multi/tts-export-report.json`
- Registry: `literacy-platform/audio/tts/packs/pack-registry.json`

### Result summary
- Manifest entries: `10579`
  - `def=5000`, `sentence=5000`, `word=500`, `phoneme=79`
  - Language distribution: `en=1579`, other configured languages `1000` each.
- Export report:
  - `attempted=10579`, `generated=79`, `reused=10500`, `failed=0`
  - New generation in this pass was all phoneme clips (`79`).
- New files now exist under:
  - `literacy-platform/audio/tts/packs/ava-multi/phoneme/*.mp3` (`79` clips)

### Still open after this run
- Passage manifest keys are still absent in `ava-multi` (`@passage:*` count is `0`), though passage mp3 files exist on disk.
- If passage audio indexing must be complete in-manifest, run a follow-up export with `--include-passages=true` for the target pack(s).

## 2026-02-09 passage-manifest indexing completion (pushed next)
### What changed
- `literacy-platform/scripts/export-azure-tts.js`
  - Credential handling now requires Azure key/region only when synthesis is actually needed.
  - This enables safe manifest reindex passes (reuse-only) without re-generating audio.
- Reindexed `ava-multi` passage entries (reuse-only pass, no synthesis):
  - `literacy-platform/audio/tts/packs/ava-multi/tts-manifest.json`
  - `literacy-platform/audio/tts/packs/ava-multi/tts-export-report.json`
  - `literacy-platform/audio/tts/packs/pack-registry.json`

### Verified result
- `ava-multi` manifest now includes `@passage:*` keys:
  - Total entries: `10729`
  - Type counts: `def=5000`, `sentence=5000`, `word=500`, `phoneme=79`, `passage=150`
  - Passage keys: `150`
  - Region metadata: `eastus`
- Export report for indexing pass:
  - `attempted=150`, `generated=0`, `reused=150`, `failed=0`
  - `reusedByField.passage=150`

### Remaining audio gap after this step
- Non-English `word` clips in `ava-multi` are still not populated from `words.js` schema (`skippedMissing` for non-English `word` fields); current manifest has `word` entries for `en` only.

## 2026-02-09 exporter fallback fix for multilingual word clips
### What changed
- `literacy-platform/scripts/export-azure-tts.js`
  - For `field=word`, exporter now defaults to English headword fallback when localized `entry[lang].word` is not present.
  - This removes prior `skippedMissing` gaps for non-English `word` tasks in `words.js`-based exports.

### Verified in dry-run
- Command (dry-run):
  - `npm run tts:azure -- --dry-run=true --pack-id=ava-multi --languages=en,es,zh,tl,hi,ms,vi,ar,ko,ja --fields=word,def,sentence --include-phonemes=true --phoneme-set=all --voice-map=scripts/azure-voice-map.ava-multilingual.example.json --overrides=scripts/reveal-safety.overrides.json --overwrite=false --region=eastus`
- Result:
  - `tasks=15079`
  - `missing=0` (previously `missing=4500`)
  - `phonemes=79`

### Current blocker
- Full synthesis pass for the remaining non-English `word` clips requires Azure credentials in the executing shell (`AZURE_SPEECH_KEY`).
- This Codex shell currently has no key, so full export cannot be completed here.

### Run this in a terminal with Azure env loaded
```bash
cd "/Users/robertwilliamknaus/Desktop/New project/literacy-platform"
npm run tts:azure -- \
  --pack-id=ava-multi \
  --pack-name="Ava Multilingual" \
  --languages=en,es,zh,tl,hi,ms,vi,ar,ko,ja \
  --fields=word,def,sentence \
  --include-phonemes=true \
  --phoneme-set=all \
  --voice-map=scripts/azure-voice-map.ava-multilingual.example.json \
  --overrides=scripts/reveal-safety.overrides.json \
  --overwrite=false \
  --region=eastus
```

## New-chat bootstrap prompt (copy/paste)
```text
Continue solo in /Users/robertwilliamknaus/Desktop/New project/literacy-platform.
Read /Users/robertwilliamknaus/Desktop/New project/HANDOFF.md first and follow it exactly.
Assume GitHub access is already working; commit/push directly to main when each stabilization slice is done.
Current priorities, in order:
1) Full reveal-copy safety sweep for all grades (definitions/sentences + jokes/riddles/facts/quotes quality).
2) Translation/audio reliability completion for target languages (EN/ES/ZH/TL first, then HI/MS/VI and optional AR/KO/JA).
3) Keep Home sequential and low-scroll; no regression to multi-panel onboarding.
4) Keep Word Quest no-scroll fit and visible vowel highlighting.
Do not stop for permission prompts unless truly blocked.
After each push: report commit hash, what was validated, updated ratings, and next max-impact step.
```
