---
name: exa-web-search
description: "Web search using Exa API. AI-optimized results. Use when: (1) Need web search for trending topics, (2) Want AI-optimized search results, (3) Need to find news and articles"
---

# Exa Web Search

Web search using Exa API. AI-optimized results.

## Quick Reference

| Situation | Action |
|-----------|--------|
| Search for trending topics | Use `search.sh` with query |
| Search news | Use `search.sh` with `--topic news` flag |
| Get top results | Use `-n 5` for 5 results |
| Custom date range | Use `--days 1` for last 24 hours |

## When to Use

- **TRIGGERS:**
  - Need to find trending topics for X posts
  - Want AI-optimized search results
  - Need latest news (last 24 hours)
  - Research competitor activities
  - Find technology articles

- **DO NOT USE WHEN:**
  - Have direct URLs (use web_fetch instead)
  - Want X-specific trending (X API handles this)
  - Need social media monitoring (use blogwatcher)

## API Key Setup

**Required:** Exa API key must be set in `openclaw.json` under `env.vars.EXA_API_KEY`.

## Usage Examples

```bash
# Search for tech news
./search.sh "trending tech topics" -n 5

# Search for AI news (last 24 hours)
./search.sh "AI developments" -n 5 --days 1

# Search with topic filter
./search.sh "web search automation" -n 5 --topic tech

# Get more results
./search.sh "trending topics" -n 10
```

## Output Format

Returns JSON with:
- `results`: Array of search results
- `query`: Original search query
- `count`: Number of results returned
- `relevance`: Average relevance score

## Features

- AI-optimized results
- Relevance scoring
- Content extraction
- Alternative search queries

## Limitations

- Requires Exa API key
- Rate limits apply (check Exa dashboard)

---

**Status:** ✅ Ready to use. Requires Exa API key in openclaw.json.
