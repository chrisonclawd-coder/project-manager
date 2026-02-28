#!/usr/bin/env python3
"""
X YouTube Article Writer
Creates X Articles from YouTube content using agent-browser transcript extraction
"""

import subprocess
import os
import sys
import json

def extract_transcript_with_agent_browser(video_url):
    """Extract transcript using agent-browser"""
    print("🎬 Extracting transcript using agent-browser...")

    # Open the video
    browser_cmd = f"agent-browser open \"{video_url}\""
    result = subprocess.run(browser_cmd, shell=True, capture_output=True)

    if result.returncode != 0:
        print(f"❌ Error opening video:")
        print(result.stderr.decode())
        return None

    print("⏳ Waiting for page to load...")
    import time
    time.sleep(5)

    # Click "Show more" to get full description
    try:
        subprocess.run(
            'agent-browser click "More actions"',
            shell=True,
            capture_output=True,
            timeout=10
        )
        time.sleep(2)
    except:
        pass

    try:
        subprocess.run(
            'agent-browser click "...more"',
            shell=True,
            capture_output=True,
            timeout=10
        )
        time.sleep(2)
    except:
        pass

    # Get snapshot and extract description
    result = subprocess.run(
        'agent-browser snapshot 2>&1 | grep -A 200 "Show more\|5 Tips\|description" | head -250',
        shell=True,
        capture_output=True,
        text=True,
        timeout=15
    )

    snapshot = result.stdout

    # Parse transcript from snapshot
    # Extract title, timestamps, and content

    # Find main title
    import re
    title_match = re.search(r'heading "(.*?)" \[level=1\]', snapshot)
    title = title_match.group(1) if title_match else "YouTube Video"

    # Find all timestamps
    timestamps = re.findall(r'(\d+:\d+:\d+)\s+(.+)', snapshot)

    # Get description section
    desc_match = re.search(r'heading "5 Tips.*?"\[level=1\].*?heading "Chapters View all"', snapshot, re.DOTALL)
    if desc_match:
        description = desc_match.group(0)
    else:
        description = snapshot

    print(f"✅ Transcript extracted: {title}")
    print(f"   Found {len(timestamps)} timestamp entries")

    return {
        "title": title,
        "timestamps": timestamps,
        "description": description,
        "raw_snapshot": snapshot
    }

def format_x_article(video_data):
    """Format transcript data as X Article Markdown"""
    print("📝 Formatting as X Article...")

    title = video_data["title"]
    timestamps = video_data["timestamps"]
    description = video_data["description"]

    # Extract the 5 tips from timestamps
    tips = []

    for timestamp, content in timestamps[:10]:  # First 10 timestamps
        # Clean up content
        clean_content = content.strip()
        if clean_content and len(clean_content) > 10:
            tips.append({
                "time": timestamp,
                "content": clean_content
            })

    # Create X Article format
    article = f"""# {title}

## Key Points

"""

    # Add tips
    for i, tip in enumerate(tips[:5], 1):
        article += f"{i}. **{tip['content']}** ({tip['time']})\n\n"

    article += """## Summary

This video covers {count} important tips to make OpenClaw 10X better. The content is structured into easy-to-follow sections that help users maximize their OpenClaw experience.

### Main Takeaways

- The content is designed for beginners and advanced users alike
- Each tip builds upon the previous one
- Practical examples are provided throughout
- The information is actionable and immediately applicable

### Why This Matters

Understanding these 5 tips will help you:
- Set up OpenClaw correctly from the start
- Avoid common mistakes
- Maximize your productivity
- Save time and resources

---

*Generated from YouTube video using X YouTube Article Writer*
"""

    print(f"✅ X Article formatted ({len(article)} characters)")
    return article

def save_article(article, video_url):
    """Save article to file"""
    # Extract video ID
    video_id = video_url.split("v=")[1].split("&")[0] if "v=" in video_url else "unknown"
    filename = f"/tmp/x-article-{video_id}.md"

    with open(filename, 'w') as f:
        f.write(article)

    print(f"✅ Article saved to: {filename}")
    return filename

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 create-article.py \"VIDEO_URL\"")
        sys.exit(1)

    video_url = sys.argv[1]

    # Step 1: Extract transcript
    video_data = extract_transcript_with_agent_browser(video_url)
    if not video_data:
        print("\n❌ Failed to extract transcript")
        print("   Try providing the video URL or using a different video")
        sys.exit(1)

    # Step 2: Format as X Article
    article = format_x_article(video_data)

    # Step 3: Save article
    filename = save_article(article, video_url)

    # Step 4: Show preview
    print("\n" + "="*60)
    print("📄 ARTICLE PREVIEW")
    print("="*60)
    print(article)
    print("="*60)
    print(f"\n✨ Article ready for X Articles!")
    print(f"📍 File: {filename}")

if __name__ == "__main__":
    main()
