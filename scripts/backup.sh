#!/bin/bash

# Daily Backup Script for OpenClaw
# Runs at 4:30am IST daily
# Backs up critical files to private GitHub repository

set -e

DATE=$(date +%Y-%m-%d)
BACKUP_DIR="/tmp/openclaw-backup-$DATE"
PRIVATE_REPO="https://github.com/chrisonclawd-coder/openclaw.git"
WORKSPACE="/home/clawdonaws/.openclaw/workspace"

echo "=== OpenClaw Daily Backup - $DATE ==="

# Create temp backup directory
mkdir -p "$BACKUP_DIR"

# Files to backup
CRITICAL_FILES=(
    "$WORKSPACE/SOUL.md"
    "$WORKSPACE/MEMORY.md"
    "$WORKSPACE/USER.md"
    "$WORKSPACE/IDENTITY.md"
    "$WORKSPACE/TOOLS.md"
    "$WORKSPACE/AGENTS.md"
    "$WORKSPACE/HEARTBEAT.md"
    "$WORKSPACE/dev-team.md"
    "$WORKSPACE/memory/"
    "$WORKSPACE/skills/"
    "$WORKSPACE/scripts/"
    "$WORKSPACE/project-manager/data/team-status.json"
    "$WORKSPACE/project-manager/data/xmax-work.json"
    "$WORKSPACE/project-manager/data/team-status.json"
    "$WORKSPACE/project-manager/data/bookmarks.json"
)

echo "Copying critical files..."
cp -r "${CRITICAL_FILES[@]}" "$BACKUP_DIR/"

# Scan for secrets and replace with placeholders
echo "Scanning for secrets..."

SECRET_PATTERNS=(
    "sk-[a-zA-Z0-9]{20,}"
    "ghp_[a-zA-Z0-9]{36}"
    "gho_[a-zA-Z0-9]{36}"
    "ghu_[a-zA-Z0-9]{36}"
    "ghs_[a-zA-Z0-9]{36}"
    "ghr_[a-zA-Z0-9]{36}"
    "AIza[0-9A-Za-z_-]{35}"
    "ya29\.[0-9A-Za-z_-]+"
    "[a-zA-Z0-9_-]*:[a-zA-Z0-9_-]+@googleapis\.com"
    "xox[baprs]-[0-9a-zA-Z]{10,48}"
    "sk-amil-[a-zA-Z0-9]{32,}"
    "OPENAI_API_KEY=[a-zA-Z0-9-]*"
    "ANTHROPIC_API_KEY=[a-zA-Z0-9-]*"
    "Bearer [a-zA-Z0-9-]*"
    "password\s*=\s*['\"][^'\"]{8,}['\"]"
    "api_key\s*=\s*['\"][^'\"]{8,}['\"]"
    "token\s*=\s*['\"][^'\"]{8,}['\"]"
    "SECRET\s*=\s*['\"][^'\"]{8,}['\"]"
    "PRIVATE_KEY\s*=\s*['\"][^'\"]{8,}['\"]"
)

# Replace secrets with placeholders
for file in $(find "$BACKUP_DIR" -type f -name "*.md" -o -name "*.json" -o -name "*.ts" -o -name "*.js" -o -name "*.sh" 2>/dev/null); do
    for pattern in "${SECRET_PATTERNS[@]}"; do
        # Replace with placeholder format: [SECRET_TYPE]
        sed -i "s/$pattern/[SECRET_REDACTED]/g" "$file" 2>/dev/null || true
    done
done

# Add GitHub token from environment if present (for push)
export GIT_TOKEN="${GITHUB_TOKEN:-}"

# Clone or update private repo
echo "Setting up GitHub backup repo..."
cd /tmp
rm -rf openclaw-backup-repo 2>/dev/null || true

if [ -n "$GIT_TOKEN" ]; then
    git clone "https://$GIT_TOKEN@github.com/chrisonclawd-coder/openclaw.git" openclaw-backup-repo 2>/dev/null || git clone "https://github.com/chrisonclawd-coder/openclaw.git" openclaw-backup-repo
else
    git clone "https://github.com/chrisonclawd-coder/openclaw.git" openclaw-backup-repo 2>/dev/null || echo "No GitHub token - skipping push"
    exit 0
fi

cd openclaw-backup-repo

# Create backup directory with date
mkdir -p "backups/$DATE"
cp -r "$BACKUP_DIR"/* "backups/$DATE/"

# Update latest symlink
rm -f backups/latest
ln -s "backups/$DATE" backups/latest

# Check what changed
CHANGES=$(git status --porcelain 2>/dev/null | wc -l)

if [ "$CHANGES" -gt 0 ]; then
    echo "Committing changes..."
    git add -A
    git commit -m "Backup $DATE - $CHANGES files changed" || true
    git push origin main 2>/dev/null || echo "Push failed - will retry next run"
    echo "Backup complete: $CHANGES files backed up"
else
    echo "No changes since last backup"
fi

# Cleanup
rm -rf "$BACKUP_DIR"

echo "=== Backup Done ==="
