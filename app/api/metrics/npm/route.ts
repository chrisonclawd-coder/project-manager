import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const pkg = request.nextUrl.searchParams.get('pkg')

  if (!pkg) {
    return NextResponse.json({ error: 'Missing pkg query parameter' }, { status: 400 })
  }

  try {
    const [dayRes, weekRes] = await Promise.all([
      fetch(`https://api.npmjs.org/downloads/point/last-day/${encodeURIComponent(pkg)}`, { cache: 'no-store' }),
      fetch(`https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(pkg)}`, { cache: 'no-store' }),
    ])

    if (!dayRes.ok || !weekRes.ok) {
      return NextResponse.json({ pkg, available: false, reason: 'npm_api_unavailable' }, { status: 502 })
    }

    const day = await dayRes.json()
    const week = await weekRes.json()

    return NextResponse.json({
      pkg,
      available: true,
      lastDay: Number(day.downloads) || 0,
      lastWeek: Number(week.downloads) || 0,
      fetchedAt: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({ pkg, available: false, reason: 'request_failed' }, { status: 502 })
  }
}
