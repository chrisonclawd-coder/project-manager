#!/bin/bash

# X Strategy Manager Deployment Script

echo "📦 Setting up X Strategy Manager..."

# Create directories
mkdir -p sessions tweets config docs

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: X Strategy Manager setup"

echo "✅ Repository initialized"
echo "📝 Next steps:"
echo "  1. Update config/settings.json with your Twitter API keys"
echo "  2. Run 'git add .' and 'git commit -m \"Add config\"'"
echo "  3. Push to GitHub: git remote add origin <your-repo-url>"
echo "  4. Push: git push -u origin main"
