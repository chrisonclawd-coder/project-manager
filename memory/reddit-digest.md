# Reddit Digestion System - Memory

## Overview
Personalized Reddit content digest that learns Robin's preferences over time.

## Subreddits
- r/clawdbot
- r/ClaudeAI
- r/ClaudeCode
- r/Futurology
- r/AgentsOfAI
- r/ArtificialInteligence
- r/artificial
- r/OpenAI

## Architecture
1. **Daily Digest (5pm IST)**
   - Fetch top posts from all subreddits
   - Filter and rank based on learned preferences
   - Format digest
   - Send to Robin
   - Ask for feedback

2. **Feedback Loop**
   - Track which posts Robin engages with
   - Ask "Did you find this useful?" after each digest
   - Log response rate
   - Update preferences based on clicks/engagement

3. **Evolution**
   - Identify winning post types (text, image, video)
   - Identify winning topics
   - Filter out underperforming types (e.g., memes)
   - Adjust subreddit mix if needed

## Data Structure

### Posts Stored
- **Post ID**: Unique Reddit ID
- **Subreddit**: Source subreddit
- **Title**: Post title
- **Type**: Text, Image, Video, Link, Poll
- **Score**: Upvotes - downvotes
- **Comments**: Number of comments
- **Engagement Score**: Weighted combination of score + comments
- **Clicks**: How many times viewed
- **Engagement Type**: Like, bookmark, upvote
- **Timestamp**: When post was submitted
- **Tags**: Categories (AI tools, news, discussion, etc.)

### Preferences Learned
- **Preferred Types**: [text, image, video]
- **Excluded Types**: [memes, low-effort, spam]
- **Preferred Topics**: [AI, tools, future]
- **Preferred Format**: [short, long, bullet points]
- **Engagement Rate**: Number of responses / number of digests sent

### Digest History
- **Digest ID**: Unique identifier
- **Date**: Date of digest
- **Post Count**: Number of posts included
- **Engagement Score**: Average engagement of included posts
- **Response Rate**: Percentage of digests responded to
- **Feedback**: What worked/didn't work

## Daily Routine

**5pm IST - Digest Generation**
1. Fetch top posts from all 8 subreddits
2. Filter based on learned preferences
3. Rank by engagement score
4. Format digest (1-3 top posts with descriptions)
5. Send to Robin
6. Ask: "Did you find this useful?"

**After Response**
- Log response
- Track engagement
- Update preferences if response is negative

## Rules Learned

**Current Rules (to be refined over time):**
- Include posts from all 8 subreddits
- Prioritize posts with high engagement score (>50)
- Include text posts > image posts > video posts
- Exclude memes (to be verified)
- Exclude low-effort posts (to be verified)
- Keep digest to 1-3 top posts per day

**Rules to Update:**
- [ ] Exclude memes - to be tested
- [ ] Minimum engagement threshold
- [ ] Preferred post types ranking
- [ ] Preferred topics
- [ ] Digest length

## Next Steps
1. Build Reddit tracker script
2. Set up cron job for 5pm IST
3. Test first digest
4. Collect feedback
5. Evolve rules based on responses

## Current Subreddit List (Confirmed)

### Reddit Subreddit Links
- https://reddit.com/r/clawdbot/
- https://reddit.com/r/ClaudeAI/
- https://reddit.com/r/ClaudeCode/
- https://reddit.com/r/Futurology/
- https://reddit.com/r/AgentsOfAI/
- https://reddit.com/r/ArtificialInteligence/
- https://reddit.com/r/artificial/
- https://reddit.com/r/OpenAI/

### Legacy Reference
- r/clawdbot
- r/ClaudeAI
- r/ClaudeCode
- r/Futurology
- r/AgentsOfAI
- r/ArtificialInteligence
- r/artificial
- r/OpenAI
