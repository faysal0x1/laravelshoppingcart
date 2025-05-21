#!/bin/bash

# Exit if any command fails
set -e

# Ask for version input
read -p "Enter new version tag (e.g., v1.0.0): " version

# Confirm
read -p "Are you sure you want to tag and push '$version'? (y/n): " confirm

if [[ "$confirm" != "y" ]]; then
  echo "Aborted."
  exit 1
fi

# Optional: add changelog or message
read -p "Enter release message: " message

# Tag the release
git tag -a "$version" -m "$message"

# Push tag to origin
git push origin "$version"

echo "✅ Tag $version pushed successfully!"
