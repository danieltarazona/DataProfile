#!/bin/bash
set -e

# Load fnm
export PATH="$HOME/.local/share/fnm:$PATH"
eval "$(fnm env)"

cd "$(dirname "$0")"
fnm use

echo "Starting dev server..."
pnpm dev
