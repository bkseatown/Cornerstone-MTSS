#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

INDEX_FILE="literacy-platform/index.html"
WORD_QUEST_FILE="literacy-platform/word-quest.html"

if [[ ! -f "$INDEX_FILE" || ! -f "$WORD_QUEST_FILE" ]]; then
  echo "Error: expected files not found."
  exit 1
fi

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$BRANCH" == "HEAD" ]]; then
  echo "Error: detached HEAD. Checkout a branch first."
  exit 1
fi
if [[ "$BRANCH" == "main" ]]; then
  echo "Error: run deploy from a feature branch (not main)."
  exit 1
fi

if [[ -n "$(git status --porcelain --untracked-files=no)" ]]; then
  echo "Error: tracked working tree changes detected. Commit or stash first."
  git status --short
  exit 1
fi

echo "Fetching origin/main..."
git fetch origin main

if ! git merge-base --is-ancestor origin/main HEAD; then
  echo "Error: branch is behind/diverged from origin/main."
  echo "Action: merge or rebase origin/main into $BRANCH first."
  exit 1
fi

BUILD_HASH="$(git rev-parse --short=8 HEAD)"
BUILD_TIME="$(date -u +"%Y-%m-%d %H:%M UTC")"

echo "Stamping build hash: $BUILD_HASH"

BUILD_HASH="$BUILD_HASH" perl -0pi -e 's#(platform\.js\?v=)[^"\047 ]+#$1.$ENV{BUILD_HASH}#ge' "$INDEX_FILE"
BUILD_HASH="$BUILD_HASH" perl -0pi -e 's#(<meta name="cs-build-hash" content=")[^"]*(" */?>)#$1.$ENV{BUILD_HASH}.$2#ge' "$WORD_QUEST_FILE"
BUILD_TIME="$BUILD_TIME" perl -0pi -e 's#(<meta name="cs-build-time" content=")[^"]*(" */?>)#$1.$ENV{BUILD_TIME}.$2#ge' "$WORD_QUEST_FILE"

if ! git diff --quiet -- "$INDEX_FILE" "$WORD_QUEST_FILE"; then
  git add "$INDEX_FILE" "$WORD_QUEST_FILE"
  git commit -m "chore: stamp build hash $BUILD_HASH"
fi

echo "Pushing branch: $BRANCH"
git push origin "$BRANCH"

echo "Deploying to main from $BRANCH"
git push origin "$BRANCH:main"

echo "Deploy complete."
echo "Build hash: $BUILD_HASH"
