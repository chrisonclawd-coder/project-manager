#!/bin/bash

# Blogwatcher with article summaries

TELEGRAM_BOT_TOKEN="${TELEGRAM_BOT_TOKEN}"
TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID}"

# Fetch Dev.to new articles
DEV_ARTICLES=$(curl -s "https://dev.to/feed/" | grep -oP '<title>[^<]+</title>' | grep -v "^DEV Community$" | head -5 | sed 's/<title>//g' | sed 's/<\/title>//g')

NEW_COUNT=$(echo "$DEV_ARTICLES" | grep -c "^" || echo "0")

MESSAGE="## 🤖 Blogwatcher - $NEW_COUNT New Articles

**Fresh from Dev.to:**

"

while IFS= read -r article; do
  MESSAGE+="• $article\n"
done <<< "$DEV_ARTICLES"

if [ "$NEW_COUNT" -eq 0 ]; then
  MESSAGE="## 🤖 Blogwatcher

**No new articles found** — All caught up! 🎉

Would you like me to fetch articles from other sources like Hacker News, The Verge, TechCrunch, or Wired?"
fi

# Send to Telegram
if [ -n "$TELEGRAM_BOT_TOKEN" ] && [ -n "$TELEGRAM_CHAT_ID" ]; then
  curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -d chat_id="${TELEGRAM_CHAT_ID}" \
    -d text="$MESSAGE" \
    -d parse_mode="Markdown"
else
  echo "Telegram bot token or chat ID not set"
  echo "$MESSAGE"
fi
