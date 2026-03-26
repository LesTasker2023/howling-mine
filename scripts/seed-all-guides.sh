#!/usr/bin/env bash
# Run all guide seed scripts in sequence.
#
# Usage:
#   SANITY_API_TOKEN=<write-token> bash scripts/seed-all-guides.sh

set -e
cd "$(dirname "$0")/.."

scripts=(
  seed-guide-avatar-creation.ts
  seed-guide-getting-to-thm.ts
  seed-guide-setesh.ts
  seed-guide-mining-101.ts
  seed-guide-getting-started.ts
  seed-guide-crafting-101.ts
  seed-guide-asteroid-mining-101.ts
  seed-guide-hunting-101-v2.ts
)

for script in "${scripts[@]}"; do
  echo ""
  echo "=== Running $script ==="
  npx tsx "scripts/$script"
done

echo ""
echo "All guides seeded."
