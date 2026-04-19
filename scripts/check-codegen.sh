#!/usr/bin/env sh
# Runs orval codegen and verifies that no generated files changed.
# Catches both modified files and newly created untracked files.
# Can be run from any directory within the repo.

set -e

REPO_ROOT=$(git rev-parse --show-toplevel)

pnpm --filter @workspace/api-spec exec orval --config ./orval.config.ts

GENERATED_PATHS="lib/api-zod/src/generated lib/api-client-react/src/generated"

DRIFT=$(git -C "$REPO_ROOT" status --porcelain -- $GENERATED_PATHS)

if [ -n "$DRIFT" ]; then
  echo ""
  echo "ERROR: Generated API files are out of sync with openapi.yaml."
  echo ""
  echo "Changed files:"
  echo "$DRIFT"
  echo ""
  echo "Fix: run the following command and commit the updated generated files:"
  echo "  pnpm --filter @workspace/api-spec run codegen"
  exit 1
fi

echo "OK: Generated API files are up to date."
