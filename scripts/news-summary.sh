#!/bin/bash
cd /home/clawdonaws/.openclaw/workspace

# Run blogwatcher scan
OUTPUT=$(blogwatcher scan 2>&1)

# Send to Telegram
TELEGRAM_TEXT=$(cat <<EOF
📰 Daily Tech News

**Feeds:** 7 blogs

$OUTPUT

---
Daily scan sent from Ottran The News Man
EOF
)

curl -s -X POST "https://api.telegram.org/bot7766991760:AAEbC0j9j8G-iZxumu_WOTRK9rSv8Wzg3tU/sendMessage" \
    -d "chat_id=-1003509357084" \
    -d "text=$TELEGRAM_TEXT" > /dev/null
