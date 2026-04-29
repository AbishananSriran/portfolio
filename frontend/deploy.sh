#!/bin/bash
echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

if [[ "$VERCEL_GIT_COMMIT_REF" == "staging" || "$VERCEL_GIT_COMMIT_REF" == "main" ]]; then
  git diff --name-only HEAD^ HEAD | grep -qE '^frontend/'
  if [ $? -eq 0 ]; then
    echo "✅ - Build can proceed"
    exit 1
  else
    echo "🛑 - No frontend changes, build cancelled"
    exit 0
  fi
else
  echo "🛑 - Build cancelled"
  exit 0
fi