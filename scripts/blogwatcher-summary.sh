#!/bin/bash

# Blogwatcher with article summaries (uses message tool)

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

# Send to Telegram via message tool
# This will be called by the agent session
echo "$MESSAGE"
