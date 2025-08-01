#!/bin/bash

# Define the hooks directory
HOOKS_DIR="hooks"
GIT_HOOKS_DIR=".git/hooks"

# Ensure the .git/hooks directory exists
mkdir -p "$GIT_HOOKS_DIR"

# Copy the pre-commit hook and make it executable
cp "$HOOKS_DIR/pre-commit" "$GIT_HOOKS_DIR/"
chmod +x "$GIT_HOOKS_DIR/pre-commit"

echo "✅ Git hooks installed successfully!"
echo ""
echo "The pre-commit hook will now run EditorConfig validation and the full Scenery test suite."
echo "To bypass validation, use: git commit --no-verify"
