#!/bin/bash
# Script to install git hooks

# Make sure we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not in a git repository"
    exit 1
fi

# Create .git/hooks directory if it doesn't exist
mkdir -p .git/hooks

# Copy the pre-commit hook
cp hooks/pre-commit .git/hooks/pre-commit

# Make it executable
chmod +x .git/hooks/pre-commit

# Make the validator script executable
chmod +x hooks/validate_editorconfig.py

echo "✅ Git hooks installed successfully!"
echo ""
echo "The pre-commit hook will now validate EditorConfig rules before each commit."
echo "To bypass validation, use: git commit --no-verify"
