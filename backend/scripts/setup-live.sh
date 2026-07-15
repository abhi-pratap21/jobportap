#!/usr/bin/env bash
# One-time setup: seed dummy jobs into the real amrutai Firestore and give the
# deployed backend (Vercel) its Firebase credentials.
#
# Run from the backend/ folder:
#   bash scripts/setup-live.sh /path/to/amrutai-staging-service-account.json
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
echo "── Step 1/4: seed 10 companies + 24 job posts into Firestore ──"
GOOGLE_APPLICATION_CREDENTIALS="$KEY_FILE" npx tsx scripts/seed-firestore.ts seed

echo
echo "── Step 2/4: set Firebase env vars on the Vercel backend project ──"
for VAR in FIREBASE_PROJECT_ID FIREBASE_CLIENT_EMAIL FIREBASE_PRIVATE_KEY; do
  npx vercel env rm "$VAR" production --yes >/dev/null 2>&1 || true
done
printf '%s' "$PROJECT_ID"   | npx vercel env add FIREBASE_PROJECT_ID production
printf '%s' "$CLIENT_EMAIL" | npx vercel env add FIREBASE_CLIENT_EMAIL production
jq -r .private_key "$KEY_FILE" | npx vercel env add FIREBASE_PRIVATE_KEY production

echo
echo "── Step 3/4: local dev env (backend/.env — gitignored) ──"
{
  echo "FIREBASE_PROJECT_ID=$PROJECT_ID"
  echo "FIREBASE_CLIENT_EMAIL=$CLIENT_EMAIL"
  echo "FIREBASE_PRIVATE_KEY=$(jq -c -r '.private_key | @json' "$KEY_FILE")"
} > .env
echo "Wrote backend/.env for local development."

echo
echo "── Step 4/4: redeploy backend so it picks up the new env vars ──"
npx vercel deploy --prod --yes

echo
echo "✅ Done! Backend ab live Firestore data serve kar raha hai."
