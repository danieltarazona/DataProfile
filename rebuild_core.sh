#!/bin/bash
set -e

# Load fnm
export PATH="$HOME/.local/share/fnm:$PATH"
eval "$(fnm env)"

# Navigate to DataKitReactCore
cd "$(dirname "$0")/../DataKitReactCore"
fnm use

echo "Using Node: $(node -v)"
echo "Using NPM: $(npm -v)"

# Install pnpm if missing
if ! command -v pnpm &> /dev/null; then
    npm install -g pnpm
fi

echo "Using PNPM: $(pnpm -v)"

echo "Cleaning up..."
rm -rf node_modules pnpm-lock.yaml

echo "Installing dependencies..."
pnpm install

echo "Building..."
pnpm build

echo "Packing..."
# Capture the filename of the packed tgz
PACKED_FILE=$(pnpm pack | tail -n 1)

echo "Moving packed file $PACKED_FILE to DataReactProfile libs..."
mkdir -p ../DataReactProfile/libs
mv "$PACKED_FILE" ../DataReactProfile/libs/datakit-react-core-latest.tgz

echo "Done!"
