# Literacy Platform Handoff

Last updated: 2026-02-08

## Project + repo
- Git root: `/Users/robertwilliamknaus/Desktop/New project`
- App folder: `/Users/robertwilliamknaus/Desktop/New project/literacy-platform`
- Remote: `origin https://github.com/bkseatown/Cornerstone-MTSS.git`
- Branch: `main`
- Latest pushed commit: `09b63711` (`origin/main`)
- Local artifact noise may still exist from visual tests (`playwright-report`, `test-results`), but source updates above are pushed.

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
- New local updates (pending push in this handoff state):
  - `app.js`: expanded young replacements for `scary`, `hurt`, `hate`, and `fight`.
  - `words.js`: rewrote base `tax` definitions/sentences across `en/es/zh/tl/ms/vi` to be clearer and younger-safe.

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
  - `hi`: currently incomplete / per-word gaps remain
  - `ar`: currently not populated across full bank
  - `ko`: currently not populated across full bank
  - `ja`: currently not populated across full bank

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
  --overwrite=false \
  --retries=1
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
