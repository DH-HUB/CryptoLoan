#!/usr/bin/env sh
set -eu
if grep -R -n -E 'org\.springframework|jakarta\.persistence' backend/src/main/java/com/cryptoloan/*/domain; then
  echo "Dépendance framework trouvée dans le domaine" >&2
  exit 1
fi
echo "Frontières de domaine hexagonales : OK"

