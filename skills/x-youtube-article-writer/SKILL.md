# X YouTube Article Writer

Creates X Articles from YouTube content using agent-browser transcript extraction.

## What It Does

1. **Extract transcript** using agent-browser (bypasses yt-dlp anti-bot)
2. **Format as X Article** with H1 title, H2 sections, bullet points
3. **Generate human-style writing** for X Articles
4. **Create article preview** for user review

## Usage

```bash
python3 {baseDir}/scripts/create-article.py "VIDEO_URL"
```

## How It Works

Uses agent-browser to:
- Navigate to YouTube video
- Extract full transcript
- Parse timestamps and content
- Format as X Article Markdown

## Examples

```bash
python3 {baseDir}/scripts/create-article.py "https://www.youtube.com/watch?v=VIDEO_ID"
```

## Requirements

- agent-browser (built into OpenClaw)
- No yt-dlp needed (avoids anti-bot issues)

## Output

Creates a `.md` file with:
- H1 title (article headline)
- H2 sections (main points)
- Bullet points (key takeaways)
- Summary section
- Human conversational tone

## Notes

This skill uses agent-browser instead of yt-dlp to avoid YouTube's anti-bot protection.
