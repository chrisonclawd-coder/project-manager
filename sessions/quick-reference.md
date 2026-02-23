# X Strategy - Quick Reference Guide

## Session Types

### Morning (9:00 AM IST) - Trending Topic
- **Step 1:** Go to Google Trends (IN)
- **Step 2:** Exa Web Search the topic
- **Step 3:** Twitter Algorithm Optimizer
- **Step 4:** Humanize the tweet
- **Step 5:** Post
- **Step 6:** Track metrics
- **Step 7:** Save to `data/metrics.json`

### Afternoon (12:00 PM IST) - Engagement Question
- **Step 1:** Generate technical/funny question
- **Step 2:** Post question
- **Step 3:** Track engagement
- **Step 4:** Save to `data/metrics.json`

### Evening (6:00 PM IST) - Trending Topic
- **Step 1:** Go to Google Trends (IN)
- **Step 2:** Exa Web Search the topic
- **Step 3:** Twitter Algorithm Optimizer
- **Step 4:** Humanize the tweet
- **Step 5:** Post
- **Step 6:** Track metrics
- **Step 7:** Save to `data/metrics.json`

### Night (8:00 PM IST) - Engagement Question
- **Step 1:** Generate technical/funny question
- **Step 2:** Post question
- **Step 3:** Track engagement
- **Step 4:** Save to `data/metrics.json`

## Humanizer Tips

### Make it Conversational
- Use "I" and "my" to show personal experience
- Add humor when appropriate
- Be authentic and relatable

### Add Visual Appeal
- Use emojis (1-2 per tweet)
- Keep formatting clean (no ALL CAPS)
- Use line breaks for readability

### Keep It Short
- Under 250 characters
- Get to the point quickly
- End with a question or call-to-action

## Question Templates

### Technical/Relatable
- "In dev, I save all the time. In production, production saves all the time."
- "My code works in development. In production, it works... sometimes."
- "99 bugs in the code, 99 in production, fix one to deploy..."

### Funny
- "I asked my code to commit, and it said 'make it an array'." 🤣
- "My code has more lines than a phone book. Production loves that."

### Philosophical
- "I don't have an attitude problem. I just have a different perspective."
- "CSS makes the front-end. Production makes the browser crash."

## Metrics Tracking

### Morning/Evening Sessions
```json
{
  "sessionId": "morning-session-2026-02-23",
  "date": "2026-02-23",
  "time": "09:00 IST",
  "sessionType": "morning-trending",
  "tweet": {
    "content": "Your tweet here",
    "topic": "Topic name",
    "impressions": 0,
    "replies": 0,
    "likes": 0,
    "shares": 0
  },
  "metrics": {
    "engagementRate": 0
  }
}
```

### Afternoon/Night Sessions
```json
{
  "sessionId": "afternoon-session-2026-02-23",
  "date": "2026-02-23",
  "time": "12:00 IST",
  "sessionType": "afternoon-engagement",
  "engagement": {
    "question": "Your question here",
    "replies": 0,
    "likes": 0,
    "shares": 0
  },
  "metrics": {
    "engagementRate": 0
  }
}
```

## Growth Insights Generation

### Weekly (Every Sunday)
1. Review `data/metrics.json`
2. Calculate aggregate metrics
3. Generate weekly insights
4. Save to `sessions/growth-insights.md`

### Per Session
1. Track metrics immediately after posting
2. Save to `data/metrics.json`
3. Note what worked/didn't work
4. Prepare for next session

## Common Mistakes to Avoid

### ❌ Don't
- Post too many tweets per session (keep it to 1)
- Use hashtags excessively (1-2 max)
- Post at inconsistent times
- Ignore engagement on your tweets
- Skip tracking metrics

### ✅ Do
- Track metrics immediately
- Save session data to file
- Review insights after each session
- Adjust strategy based on data
- Post consistently at scheduled times

## Success Metrics

### Good Engagement Rate
- **Morning/Evening:** 1-3% (typical for tweets)
- **Afternoon/Night:** 2-4% (higher for questions)

### Target Growth
- **Month 1:** Establish consistency
- **Month 2:** Increase engagement rate by 0.5%
- **Month 3:** 100+ replies per week
- **Month 4:** 200+ replies per week

## Next Session Checklist

- [ ] Check Google Trends (IN)
- [ ] Select trending topic
- [ ] Exa Web Search topic
- [ ] Create optimized tweet
- [ ] Humanize the tweet
- [ ] Post tweet/question
- [ ] Track all metrics
- [ ] Save to `data/metrics.json`
- [ ] Write brief notes on what worked
- [ ] Plan next session topic

## Troubleshooting

### No Engagement?
- Try different question format
- Test different posting times
- Add more emojis
- Make the question more specific

### Low Engagement Rate?
- Check if you're posting at right time
- Review your tweet/question quality
- Try different trending topics
- Make content more personal

### Repetitive Content?
- Use variety in question templates
- Mix technical and funny
- Test different engagement strategies
- Review your weekly insights

---

**Need help?** Check `metrics-tracker.md` for detailed documentation.
