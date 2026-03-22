#!/usr/bin/env bash
set -euo pipefail

# Usage: ./install.sh [typescript|python|golang]

PLUGIN_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "superpowers-ecc: initializing..."

# Verify Node.js >= 18
if ! command -v node &>/dev/null; then
  echo "Error: Node.js is required but not installed."
  exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "Error: Node.js >= 18 required (found $(node -v))"
  exit 1
fi

# Initialize state directory
node -e "
  import { Store } from '${PLUGIN_DIR}/state/store.js';
  const store = new Store();
  store.init();
  console.log('State directory initialized: ~/.claude/superpowers-ecc/');
"

# Optional language rules
if [ "${1:-}" != "" ]; then
  LANG="$1"
  if [ -d "${PLUGIN_DIR}/rules/${LANG}" ]; then
    echo "Language rules for ${LANG} available in rules/${LANG}/"
    echo "These will be loaded automatically when the plugin is active."
  else
    echo "Warning: No rules found for '${LANG}'. Available: typescript, python, golang"
    exit 1
  fi
fi

echo ""
echo "Setup complete. To install in Claude Code:"
echo "  /plugin marketplace add <path-to-this-repo>"
echo "  /plugin install superpowers-ecc@superpowers-ecc"
echo "  /reload-plugins"
