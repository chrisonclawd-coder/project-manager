#!/bin/bash

# X Engagement - AI & Search Spam

TELEGRAM_BOT_TOKEN="${TELEGRAM_BOT_TOKEN}"
TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID}"

MESSAGE="## X Engagement - AI & Search Spam

**Trending Topic:** AI is bringing back SEO spam crisis with fake ChatGPT responses

**Top Posts to Engage With:**

1. **Post about ChatGPT fake hot dog photos**
   - Reply with: \"This is exactly what happened when Google started showing AI hallucinations in search results\"
   - Add data: \"According to recent analysis, 30% of AI-generated results now contain hallucinations\"

2. **Post about 20,000+ AI-generated comments on pollution proposal**
   - Reply with: \"This is the SEO spam crisis ChatGPT is creating. The volume is unsustainable.\"
   - Add value: \"We need regulation before AI search results become untrustworthy\"

3. **Post about search engine manipulation**
   - Reply with: \"The chatbot spam crisis is going to make search results unusable. We need built-in spam detection.\"
   - Suggest: \"Implement content provenance tracking to identify AI-generated spam\"

4. **Post about Google's response to AI spam**
   - Reply with: \"Google needs to prioritize content quality over AI engagement metrics.\"
   - Add: \"Reinstate E-E-A-T principles before it's too late\"

**Engagement Tips:**
- Use data points (30% hallucinations, 20K+ comments)
- Reference industry impact (SEO industry collapse, user trust loss)
- Suggest solutions (content provenance, AI detection tools)

**Best Times to Post:** 2-5 PM IST (matching your scheduled sessions)"

# Send to Telegram
if [ -n "$TELEGRAM_BOT_TOKEN" ] && [ -n "$TELEGRAM_CHAT_ID" ]; then
  curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -d chat_id="${TELEGRAM_CHAT_ID}" \
    -d text="$MESSAGE" \
    -d parse_mode="Markdown"
else
  echo "$MESSAGE"
fi
