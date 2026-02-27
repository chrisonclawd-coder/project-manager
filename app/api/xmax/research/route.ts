import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const TAVILY_URL = 'https://api.tavily.com/search'

const trendQuery = [
  'X growth strategy',
  'viral product marketing',
  'AI agents',
  'developer tools',
  'security trends',
  'Mdify',
  'GuardSkills',
].join(' ')

type TavilyResult = {
  title?: string
  url?: string
  content?: string
  score?: number
  source?: string
}

type TavilyResponse = {
  results?: TavilyResult[]
}

export async function GET() {
  const apiKey = process.env.TAVILY_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      {
        available: false,
        reason: 'TAVILY_API_KEY missing',
        results: [],
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
        },
      },
    )
  }

  try {
    const response = await fetch(TAVILY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: trendQuery,
        topic: 'news',
        search_depth: 'advanced',
        max_results: 10,
      }),
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Tavily request failed with status ${response.status}`)
    }

    const payload = (await response.json()) as TavilyResponse
    const fetchedAt = new Date().toISOString()

    const results = (payload.results || []).map(item => ({
      title: item.title || 'Untitled',
      url: item.url || '',
      snippet: item.content || '',
      score: typeof item.score === 'number' ? item.score : 0,
      source: item.source || 'Tavily',
      fetchedAt,
    }))

    return NextResponse.json(
      {
        available: true,
        results,
      },
      {
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
        },
      },
    )
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Failed to fetch Tavily research'

    return NextResponse.json(
      {
        available: true,
        reason,
        results: [],
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
        },
      },
    )
  }
}
