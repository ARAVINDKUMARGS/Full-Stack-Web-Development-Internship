#!/usr/bin/env bash
# End-to-end API test against a running server with a real database.
# Usage: BASE_URL=http://localhost:5000/api ./scripts/api-test.sh
set -u
BASE="${BASE_URL:-http://localhost:5000/api}"
EMAIL="test.$(date +%s)@example.com"
UPPER=$(echo "$EMAIL" | tr 'a-z' 'A-Z')
PASS=0; FAIL=0

TMP_BODY=$(mktemp 2>/dev/null || echo "/tmp/body.json")
trap 'rm -f "$TMP_BODY"' EXIT

check() { if [ "$2" = "$3" ]; then echo "PASS  $1"; PASS=$((PASS+1)); else echo "FAIL  $1 (expected $2, got $3)"; FAIL=$((FAIL+1)); fi; }
req() { curl -s -o "$TMP_BODY" -w "%{http_code}" -H 'Content-Type: application/json' "$@"; }

check "health" 200 "$(req "$BASE/health")"
check "create contact" 201 "$(req -X POST "$BASE/contacts" -d "{\"name\":\"Test User\",\"email\":\"$EMAIL\",\"phone\":\"+91 98765 43210\",\"company\":\"Invexom\"}")"
ID=$(sed -n 's/.*"_id":"\([^"]*\)".*/\1/p' "$TMP_BODY" | head -1)
check "duplicate email (case-insensitive) -> 409" 409 "$(req -X POST "$BASE/contacts" -d "{\"name\":\"Other\",\"email\":\"$UPPER\"}")"
check "invalid payload -> 400" 400 "$(req -X POST "$BASE/contacts" -d '{"name":"A","email":"bad"}')"
check "list contacts" 200 "$(req "$BASE/contacts")"
check "search" 200 "$(req "$BASE/contacts?search=$EMAIL")"
grep -q "$EMAIL" "$TMP_BODY" && R=1 || R=0; check "search result contains contact" 1 $R
check "get by id" 200 "$(req "$BASE/contacts/$ID")"
check "update" 200 "$(req -X PUT "$BASE/contacts/$ID" -d '{"company":"Invexom Pvt Ltd"}')"
check "update invalid email -> 400" 400 "$(req -X PUT "$BASE/contacts/$ID" -d '{"email":"nope"}')"
check "bad id -> 400" 400 "$(req "$BASE/contacts/123")"
check "delete" 200 "$(req -X DELETE "$BASE/contacts/$ID")"
check "get deleted -> 404" 404 "$(req "$BASE/contacts/$ID")"
echo; echo "Passed: $PASS  Failed: $FAIL"; [ "$FAIL" -eq 0 ]
