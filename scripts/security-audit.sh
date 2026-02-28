#!/bin/bash
cd /home/clawdonaws/.openclaw/workspace

# Run security audit
OUTPUT=$(openclaw security audit --deep 2>&1)

# Send to Telegram
TELEGRAM_TEXT=$(cat <<EOF
🔒 Daily Security Audit - 2026-02-16 IST

$OUTPUT

---
Security scan sent from @singsecurity_bot
EOF
)

curl -s -X POST "https://api.telegram.org/bot7766991760:AAEbC0j9j8G-iZxumu_WOTRK9rSv8Wzg3tU/sendMessage" \
    -d "chat_id=-5205543469" \
    -d "text=$TELEGRAM_TEXT" > /dev/null
