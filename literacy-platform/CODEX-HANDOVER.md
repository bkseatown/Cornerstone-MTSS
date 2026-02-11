# Codex Handover Contract (Word Quest)

## Deployment + Source Of Truth
- Live repo: `/Users/robertwilliamknaus/Desktop/New project/literacy-platform-ux`
- App folder: `/Users/robertwilliamknaus/Desktop/New project/literacy-platform-ux/literacy-platform`
- Remote: `origin` -> `https://github.com/bkseatown/Cornerstone-MTSS.git`
- Default branch for live updates: `main`

## Non-Negotiables For Any New Chat
1. Confirm working tree path is `.../literacy-platform-ux/literacy-platform` before edits.
2. Confirm local `main` and `origin/main` state.
3. After changes, push to `origin/main` unless user says not to.
4. Return the pushed commit SHA and cache-bust URL.

## Word Quest Styling Contract
- Base styles stay in `style.css`.
- Final Word Quest authority lives in `word-quest-stable.css` and is loaded after `style.css`.
- Do not add new Word Quest override clusters to `style.css` tail.
- If Word Quest needs a style fix, apply it in `word-quest-stable.css`.

## Runtime Verification Contract
- Validate at minimum:
  - `1440x900`
  - `1024x768`
  - `768x1024`
  - `390x844`
- Check:
  - no desktop vertical scroll
  - board + keyboard centered
  - `ENTER` key not clipped
  - Tools-only controls stay in top Tools menu

## Cache-Bust Contract
- Update cache tokens in `word-quest.html` and demo link in `word-quest-demo.html` for style/script updates.
- Provide final URL with query cache-bust for verification.

