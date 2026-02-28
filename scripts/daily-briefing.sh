#!/bin/bash
cd /home/clawdonaws/.openclaw/workspace

# Get today's date in IST
IST_DATE=$(TZ=Asia/Kolkata date +%Y-%m-%d)
MEMORY_FILE="memory/${IST_DATE}.md"

# Generate briefing
echo "📋 Daily Briefing - ${IST_DATE} IST" > /tmp/briefing.md
echo "" >> /tmp/briefing.md
echo "## What We Accomplished" >> /tmp/briefing.md
echo "" >> /tmp/briefing.md
if [ -f "$MEMORY_FILE" ] && [ -s "$MEMORY_FILE" ]; then
    # Extract accomplishments (look for - [Action])
    grep -E "^- \[" "$MEMORY_FILE" | sed 's/^/- /' >> /tmp/briefing.md
else
    echo "No entries found in today's memory" >> /tmp/briefing.md
fi
echo "" >> /tmp/briefing.md
echo "## What's Pending" >> /tmp/briefing.md
echo "" >> /tmp/briefing.md
if [ -f "$MEMORY_FILE" ]; then
    grep -E "TODO|Pending|FIXME|TODO:" "$MEMORY_FILE" | sed 's/^/- /' >> /tmp/briefing.md
else
    echo "No pending tasks found" >> /tmp/briefing.md
fi
echo "" >> /tmp/briefing.md
echo "## Ideas Brainstormed" >> /tmp/briefing.md
echo "" >> /tmp/briefing.md
if [ -f "$MEMORY_FILE" ]; then
    grep -E "idea|brainstorm|idea:" "$MEMORY_FILE" | sed 's/^/- /' >> /tmp/briefing.md
else
    echo "No ideas brainstormed today" >> /tmp/briefing.md
fi
echo "" >> /tmp/briefing.md
echo "---" >> /tmp/briefing.md

# Send to News group
TELEGRAM_TEXT=$(cat /tmp/briefing.md | sed 's/"/\\"/g')
curl -s -X POST "https://api.telegram.org/bot7766991760:AAEbC0j9j8G-iZxumu_WOTRK9rSv8Wzg3tU/sendMessage" \
    -d "chat_id=-1003509357084" \
    -d "text=$TELEGRAM_TEXT" > /dev/null
