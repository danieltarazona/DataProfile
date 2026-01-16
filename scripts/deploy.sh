#!/bin/bash

# Build the project
echo "Building Next.js application..."
pnpm build

# Check if build was successful
if [ $? -eq 0 ]; then
  echo "Build successful!"
  exit 0
else
  echo "Build failed!"
  exit 1
fi
