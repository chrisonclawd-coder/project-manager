import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.EXA_API_KEY || '1ebbc5df-97b0-4597-9555-ea9d28b7a6cd'}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: 'trending technology AI software development 2026',
        num_results: 10
      })
    })

    const data = await response.json()
    
    // Transform to our format
    const topics = data.results?.slice(0, 6).map((item, idx) => ({
      id: idx + 1,
      title: item.title?.substring(0, 50) || 'Tech Trend',
      source: new URL(item.url).hostname.replace('www.', ''),
      tweets: generateTweets(item.title)
    })) || []

    return NextResponse.json({ topics, success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch', success: false }, { status: 500 })
  }
}

function generateTweets(title) {
  const tweetTemplates = [
    `Just discovered: ${title}.\n\nThis is the future of tech.\n\nAre you ready?`,
    `${title} is changing everything.\n\nHere's why it matters:\n\n1. Impact\n2. Opportunity\n3. What's next\n\n🧵`,
    `Hot take: ${title}\n\nNot just hype - real change happening.\n\nThoughts? 👇`,
    `${title}\n\nBookmarked for later.\n\nShare with your team.`,
    `The latest on ${title}\n\nThread 🧵👇\n\nMust read for tech enthusiasts.`
  ]
  
  return tweetTemplates.slice(0, 2).map(text => ({
    text,
    hashtags: ['Tech', 'AI', '2026', 'Trending']
  }))
}
