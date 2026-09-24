#!/usr/bin/env sh
set -eu
BASE_URL="${BASE_URL:-http://localhost:8080}"
curl -fsS "$BASE_URL/health"
TOKEN="$(curl -fsS -X POST "$BASE_URL/api/auth/login" -H 'Content-Type: application/json' -d '{"email":"admin@example.com","password":"admin123"}' | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')"
test -n "$TOKEN"
curl -fsS "$BASE_URL/api/auth/me" -H "Authorization: Bearer $TOKEN"
curl -fsS "$BASE_URL/api/crypto/price?cryptoId=bitcoin"
curl -fsS -X POST "$BASE_URL/api/notifications/test" -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{}'
KEY="00000000-0000-4000-8000-000000000001"
curl -fsS -X POST "$BASE_URL/api/loans" -H "Authorization: Bearer $TOKEN" -H "Idempotency-Key: $KEY" -H 'Content-Type: application/json' -d '{"amountEur":1000,"collateralSymbol":"bitcoin","collateralAmount":0.1,"liquidationRatio":1.2}'
echo "\nSmoke test OK — vérifiez aussi http://localhost:8025"
