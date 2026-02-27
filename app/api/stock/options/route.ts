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

    // Fetch both calls and puts
    const [callsResponse, putsResponse] = await Promise.all([
      fetch(
        `https://api.twelvedata.com/options_chain?symbol=${ticker}&option_type=call&apikey=${apiKey}`
      ),
      fetch(
        `https://api.twelvedata.com/options_chain?symbol=${ticker}&option_type=put&apikey=${apiKey}`
      ),
    ])

    if (!callsResponse.ok || !putsResponse.ok) {
      throw new Error('Failed to fetch options data')
    }

    const callsData = await callsResponse.json()
    const putsData = await putsResponse.json()

    if (callsData.code === 429 || putsData.code === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    if (callsData.status === 'error' && putsData.status === 'error') {
      return NextResponse.json(
        { error: callsData.message || 'Failed to fetch options data' },
        { status: 400 }
      )
    }

    // Combine and format the data
    const formatOptions = (data: any, type: 'call' | 'put') => {
      if (!data.data || !Array.isArray(data.data)) return []

      return data.data.map((option: any) => ({
        strike: parseFloat(option.strike),
        expiration: option.expiration_date,
        type: type.toUpperCase(),
        lastPrice: parseFloat(option.last_price),
        bid: parseFloat(option.bid),
        ask: parseFloat(option.ask),
        volume: option.volume ? parseInt(option.volume) : 0,
        openInterest: option.open_interest ? parseInt(option.open_interest) : 0,
        iv: option.implied_volatility ? parseFloat(option.implied_volatility) : null,
        delta: option.delta ? parseFloat(option.delta) : null,
        gamma: option.gamma ? parseFloat(option.gamma) : null,
        theta: option.theta ? parseFloat(option.theta) : null,
        vega: option.vega ? parseFloat(option.vega) : null,
      }))
    }

    const calls = formatOptions(callsData, 'call')
    const puts = formatOptions(putsData, 'put')

    // Group by expiration date
    const expirations = new Set<string>()
    calls.forEach((c: any) => expirations.add(c.expiration))
    puts.forEach((p: any) => expirations.add(p.expiration))

    return NextResponse.json({
      symbol: ticker,
      expirations: Array.from(expirations).sort(),
      calls,
      puts,
    })
  } catch (error) {
    console.error('Options chain error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch options chain' },
      { status: 500 }
    )
  }
}
