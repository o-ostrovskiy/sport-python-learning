#!/usr/bin/env bash
# Puts the committed site on python.mystoryland.ai, in one command (IMPROVEMENTS.md item 9).
#   site/tools/publish.sh --dry-run     everything but the upload: shows what would change on the box
#   site/tools/publish.sh               the same, then asks once, then uploads and checks the live site
#   site/tools/publish.sh --yes         no question (only when someone already said yes for this commit)
#
# What it does:
#   1. Refuses unless: this is main, nothing in site/ is uncommitted (above all no voice files that exist only here),
#      main is pushed and not behind origin, and the "Site checks" CI run for this commit is green (SKIP_CI=1 skips
#      only that last check, for an emergency).
#   2. Makes a clean copy of the committed site/ (git archive), without tools/, functions/, labs/answers/ and *.md.
#   3. Plays all 20 lessons in real Python (check-lab.mjs all).
#   4. Opens SSH for this computer, shows what rsync --delete would change, refuses if it would delete a voice file,
#      asks, uploads, and always closes SSH again.
#   5. Checks the live site with curl: pages 200, answer key / tools / api 404, Python compressed.
#
# Needs: the infrastructure repo checked out (INFRA, default ~/storyland-release/storyland-infrastructure) for
# ssh-access.sh and the box's address, and the Lightsail key (KEY, default ~/.ssh/storyland.pem).
set -euo pipefail

DRY=0; YES=0
for a in "$@"; do
  case "$a" in
    --dry-run) DRY=1 ;;
    --yes) YES=1 ;;
    *) echo "usage: publish.sh [--dry-run] [--yes]" >&2; exit 2 ;;
  esac
done

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
INFRA="${INFRA:-$HOME/storyland-release/storyland-infrastructure}"
KEY="${KEY:-$HOME/.ssh/storyland.pem}"
URL="https://python.mystoryland.ai"
REPO="o-ostrovskiy/sport-python-learning"
say() { printf '\n== %s\n' "$*"; }
die() { printf '\nSTOP: %s\n' "$*" >&2; exit 1; }

[ -x "$INFRA/deploy/ssh-access.sh" ] || die "no $INFRA/deploy/ssh-access.sh (set INFRA to the infrastructure repo)"
[ -r "$KEY" ] || die "no SSH key at $KEY (set KEY)"
# The box's address lives in the infrastructure repo, not in this public one.
BOX="${BOX_IP:-$(grep -o 'BOX_IP:-[0-9.]*' "$INFRA/deploy/deploy.sh" | head -1 | cut -d- -f2)}"
[ -n "$BOX" ] || die "could not read the box address from $INFRA/deploy/deploy.sh (set BOX_IP)"
SSH=(ssh -i "$KEY" -o ConnectTimeout=10 -o StrictHostKeyChecking=accept-new)

cd "$ROOT"
say "1. Is this commit ready?"
[ "$(git branch --show-current)" = main ] || die "not on main"
[ -z "$(git status --porcelain -- site)" ] || { git status --short -- site | head -20; die "site/ has uncommitted changes: commit them first (a voice file that exists only here would be deleted from the box)"; }
git fetch -q origin main
[ "$(git rev-list --count HEAD..origin/main)" = 0 ] || die "main is behind origin/main: pull first (the voice task may have pushed)"
[ "$(git rev-list --count origin/main..HEAD)" = 0 ] || die "main has commits that are not pushed: push first, so CI can check them"
SHA="$(git rev-parse HEAD)"
echo "commit $(git log -1 --format='%h %s' | cut -c1-90)"
if [ "${SKIP_CI:-0}" = 1 ]; then
  echo "CI check skipped (SKIP_CI=1)"
else
  # The CI run for the newest commit that touched the site (voice-only commits do not start it).
  CHECKED="$(git log -1 --format=%H -- site server .github/workflows/site.yml ':!site/assets/voice')"
  RESULT="$(gh run list --repo "$REPO" --workflow site.yml --commit "$CHECKED" --limit 1 --json status,conclusion -q '.[0].status + " " + .[0].conclusion' 2>/dev/null || true)"
  [ "$RESULT" = "completed success" ] || die "the Site checks run for ${CHECKED:0:7} is not green (\"${RESULT:-no run}\"): wait for it or fix it"
  echo "CI: Site checks green for ${CHECKED:0:7}"
fi

say "2. Clean copy of the committed site"
TMP="$(mktemp -d)"
git archive HEAD site | tar -x -C "$TMP"
rm -rf "$TMP/site/tools" "$TMP/site/functions" "$TMP/site/labs/answers"
find "$TMP/site" -name '*.md' -delete
echo "$TMP/site: $(find "$TMP/site" -type f | wc -l | tr -d ' ') files, $(du -sh "$TMP/site" | cut -f1)"

say "3. The 20 lessons in real Python"
(cd "$ROOT/site/tools" && node check-lab.mjs all) || die "a lesson fails"

say "4. Upload"
"$INFRA/deploy/ssh-access.sh" open >/dev/null
trap '"$INFRA/deploy/ssh-access.sh" close >/dev/null 2>&1 || true; rm -rf "$TMP"' EXIT
for i in 1 2 3 4 5 6; do "${SSH[@]}" "ubuntu@$BOX" true 2>/dev/null && break; [ "$i" = 6 ] && die "the box does not answer on port 22"; sleep 5; done
RSYNC=(rsync -az --delete -e "${SSH[*]}" "$TMP/site/" "ubuntu@$BOX:python-season/")
PLAN="$("${RSYNC[@]}" -n -i)"
DELETES="$(printf '%s\n' "$PLAN" | grep '^\*deleting' || true)"
CHANGES="$(printf '%s\n' "$PLAN" | grep -E '^<f(\+\+\+|.s|c)' | awk '{print $2}' || true)"
echo "files to upload: $(printf '%s' "$CHANGES" | grep -c . || true)"; printf '%s\n' "$CHANGES" | grep -v 'assets/vendor/pyodide/' | sed 's/^/   /' | head -40
echo "files to delete: $(printf '%s' "$DELETES" | grep -c . || true)"; printf '%s\n' "$DELETES" | sed 's/^/   /' | head -40
# A voice file on the box but not in this commit is either an old recording no line uses any more (the voice task
# uploads without deleting, so replaced clips stay behind: fine to delete) or a new one this checkout does not have
# yet (never delete). The live site's own voice index files tell them apart.
VOICE_DELETES="$(printf '%s\n' "$DELETES" | grep -o 'assets/voice/[^ ]*\.mp3' || true)"
if [ -n "$VOICE_DELETES" ]; then
  LIVE_INDEX="$(for f in "$TMP"/site/assets/voice/*.js; do curl -s "$URL/assets/voice/$(basename "$f")"; done)"
  [ -n "$LIVE_INDEX" ] || die "could not read the live voice index to check the voice files that would be deleted"
  for v in $VOICE_DELETES; do
    printf '%s' "$LIVE_INDEX" | grep -q "$(basename "$v")" && die "the live site still uses $v, which is not in this commit: pull or commit the voice files first"
  done
  echo "   (the voice files above are old recordings: no voice index on the live site uses them)"
fi
if [ "$DRY" = 1 ]; then echo; echo "Dry run: nothing uploaded."; exit 0; fi
if [ -z "$CHANGES$DELETES" ]; then echo "The box already has this commit."; else
  if [ "$YES" != 1 ]; then read -r -p "Publish this to $URL? [y/N] " ok; [ "$ok" = y ] || [ "$ok" = Y ] || die "not published"; fi
  "${RSYNC[@]}"
  echo "uploaded"
fi
"$INFRA/deploy/ssh-access.sh" close >/dev/null

say "5. The live site"
bad=0
check() { # $1 path  $2 expected status
  local got; got="$(curl -s -o /dev/null -w '%{http_code}' "$URL$1")"
  if [ "$got" = "$2" ]; then echo "   ok   $got $1"; else echo "   FAIL $got $1 (expected $2)"; bad=1; fi
}
check / 200; check /play.html 200; check /about.html 200; check /sw.js 200; check /labs/nfl-01.js 200
check /labs/answers/nfl-01.json 404; check /tools/publish.sh 404; check /api/status 404
WHEEL="$(ls "$TMP/site/assets/vendor/pyodide/"*/pandas-*.whl 2>/dev/null | head -1 | sed "s#$TMP/site##")"
if [ -n "$WHEEL" ]; then
  ENC="$(curl -s -o /dev/null -D - -H 'Accept-Encoding: zstd, br, gzip' "$URL$WHEEL" | tr -d '\r' | awk -F': ' 'tolower($1)=="content-encoding"{print $2}')"
  if [ -n "$ENC" ]; then echo "   ok   pandas is sent compressed ($ENC)"; else echo "   FAIL pandas is sent uncompressed (see the Caddyfile's encode list)"; bad=1; fi
fi
[ "$bad" = 0 ] || die "the live site is not right"
echo; echo "Published $(git log -1 --format='%h') to $URL"
