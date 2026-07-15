#!/usr/bin/env bash
# One-time setup: give the deployed backend (Vercel) its Firebase credentials
# so the live portal serves REAL jobs from the amrutai Firestore (amrutai-2a231).
#
# Run from the backend/ folder:
#   bash scripts/setup-live.sh /path/to/service-account.json
#
# The key file is only read by THIS script on YOUR machine — it is piped
# directly into `vercel env` and never committed or printed.
set -euo pipefail

KEY_FILE="${1:?Usage: bash scripts/setup-live.sh /path/to/service-account.json}"

if [ ! -f "$KEY_FILE" ]; then
  echo "❌ Key file not found: $KEY_FILE"
  exit 1
fi

command -v jq >/dev/null || { echo "❌ jq is required (brew install jq)"; exit 1; }

PROJECT_ID=$(jq -r .project_id "$KEY_FILE")
CLIENT_EMAIL=$(jq -r .client_email "$KEY_FILE")
echo "🔑 Using service account for project: $PROJECT_ID"

echo
echo "── Step 1/2: set Firebase env vars on the Vercel backend project ──"
for VAR in FIREBASE_PROJECT_ID FIREBASE_CLIENT_EMAIL FIREBASE_PRIVATE_KEY; do
  npx vercel env rm "$VAR" production --yes >/dev/null 2>&1 || true
done
printf '%s' "$PROJECT_ID"   | npx vercel env add FIREBASE_PROJECT_ID production
printf '%s' "$CLIENT_EMAIL" | npx vercel env add FIREBASE_CLIENT_EMAIL production
jq -r .private_key "$KEY_FILE" | npx vercel env add FIREBASE_PRIVATE_KEY production

echo
echo "── Step 2/2: redeploy backend so it picks up the new env vars ──"
npx vercel deploy --prod --yes

echo
echo "✅ Done! Live backend ab real Firestore data serve kar raha hai."
