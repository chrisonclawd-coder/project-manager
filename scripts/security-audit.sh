#!/bin/bash
cd /home/clawdonaws/.openclaw/workspace

# Run security audit
OUTPUT=$(openclaw security audit --deep 2>&1)

# Send to user's Telegram chat
TELEGRAM_TEXT="🔒 Daily Security Audit - $(date '+%Y-%m-%d %H:%M IST')

$OUTPUT"

# Send to user (not channel)
curl -s -X POST "https://api.telegram.org/bot7766991760:AAEbC0j9j8G-iZxumu_WOTRK9rSv8Wzg3tU/sendMessage" \
    -d "chat_id=7065433847" \
    -d "text=$TELEGRAM_TEXT" > /dev/null

echo "Security audit sent to user"
