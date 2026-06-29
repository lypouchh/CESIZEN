#!/usr/bin/env bash
set -euo pipefail

staged_files=$(git diff --cached --name-only --diff-filter=ACMR | grep -E '^frontend/.*\.(js|jsx)$' || true)

if [[ -z "$staged_files" ]]; then
  echo "No staged frontend JS/JSX files to lint."
  exit 0
fi

echo "Linting staged frontend files..."
frontend_files=$(echo "$staged_files" | sed 's#^frontend/##')

# Run eslint in frontend context only on staged files.
cd frontend
npx eslint -- $frontend_files
