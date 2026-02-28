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

    // Validate required fields exist (price can be null, use previous_close as fallback)
    if (!data.change || !data.percent_change || !data.high || !data.low || !data.open || !data.previous_close) {
      return NextResponse.json(
        { error: 'Invalid response from API - missing required fields' },
        { status: 400 }
      )
    }

    // Use price if available, otherwise use previous_close
    const rawPrice = data.price || data.previous_close;
    const price = parseFloat(rawPrice)
    const change = parseFloat(data.change)
    const changePercent = parseFloat(data.percent_change)
    const high = parseFloat(data.high)
    const low = parseFloat(data.low)
    const open = parseFloat(data.open)
    const previousClose = parseFloat(data.previous_close)

    // Check for NaN values
    if (isNaN(price) || isNaN(change) || isNaN(changePercent) || isNaN(high) || isNaN(low) || isNaN(open) || isNaN(previousClose)) {
      return NextResponse.json(
        { error: 'Invalid numeric data received from API' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      symbol: data.symbol,
      price,
      change,
      changePercent,
      volume: data.volume ? parseInt(data.volume) : 0,
      marketCap: data.market_cap ? data.market_cap : null,
      high,
      low,
      open,
      previousClose,
    })
  } catch (error) {
    console.error('Stock quote error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stock quote' },
      { status: 500 }
    )
  }
}
