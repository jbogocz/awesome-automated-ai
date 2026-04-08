#!/usr/bin/env bash
# Fetches GitHub topics for all repos in projects.yaml
set -euo pipefail

grep 'repo:' projects.yaml | sed 's/.*repo: //' | while read -r repo; do
  topics=$(gh api "repos/$repo" --jq '[.topics[]] | join(", ")' 2>/dev/null || echo "")
  if [ -n "$topics" ]; then
    echo "$repo: [$topics]"
  else
    echo "$repo: []"
  fi
  sleep 0.3
done
