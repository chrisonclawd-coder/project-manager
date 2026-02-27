import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ticker = searchParams.get('ticker')

    if (!ticker) {
      return NextResponse.json({ error: 'Ticker is required' }, { status: 400 })
    }

    const apiKey = process.env.TWELVEDATA_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'TWELVEDATA_API_KEY not configured' },
        { status: 500 }
      )
    }

    const response = await fetch(
      `https://api.twelvedata.com/quote?symbol=${ticker}&apikey=${apiKey}`
    )

    if (!response.ok) {
      throw new Error(`TwelveData API error: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.code === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    if (data.status === 'error') {
      return NextResponse.json(
        { error: data.message || 'Failed to fetch stock quote' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      symbol: data.symbol,
      price: parseFloat(data.price),
      change: parseFloat(data.change),
      changePercent: parseFloat(data.percent_change),
      volume: data.volume ? parseInt(data.volume) : 0,
      marketCap: data.market_cap ? data.market_cap : null,
      high: parseFloat(data.high),
      low: parseFloat(data.low),
      open: parseFloat(data.open),
      previousClose: parseFloat(data.previous_close),
    })
  } catch (error) {
    console.error('Stock quote error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stock quote' },
      { status: 500 }
    )
  }
}
