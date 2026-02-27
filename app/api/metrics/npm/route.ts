import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const pkg = request.nextUrl.searchParams.get('pkg')

  if (!pkg) {
    return NextResponse.json({ error: 'Missing pkg query parameter' }, { status: 400 })
  }

  try {
    const pkgEncoded = encodeURIComponent(pkg)
    const [dayRes, weekRes, monthRes, totalRes] = await Promise.all([
      fetch(`https://api.npmjs.org/downloads/point/last-day/${pkgEncoded}`, { cache: 'no-store' }),
      fetch(`https://api.npmjs.org/downloads/point/last-week/${pkgEncoded}`, { cache: 'no-store' }),
      fetch(`https://api.npmjs.org/downloads/point/last-month/${pkgEncoded}`, { cache: 'no-store' }),
      fetch(`https://api.npmjs.org/downloads/point/2015-01-10:${new Date().toISOString().slice(0, 10)}/${pkgEncoded}`, {
        cache: 'no-store',
      }),
    ])

    if (!dayRes.ok || !weekRes.ok || !monthRes.ok) {
      return NextResponse.json({ pkg, available: false, reason: 'npm_api_unavailable' }, { status: 502 })
    }

    const day = await dayRes.json()
    const week = await weekRes.json()
    const month = await monthRes.json()

    let totalDownloads = Number(month.downloads) || 0
    let totalLabel = 'Total (30d proxy)'

    if (totalRes.ok) {
      const total = await totalRes.json()
      const cumulative = Number(total.downloads)
      if (Number.isFinite(cumulative) && cumulative > 0) {
        totalDownloads = cumulative
        totalLabel = 'Total (lifetime proxy)'
      }
    }

    return NextResponse.json({
      pkg,
      available: true,
      lastDay: Number(day.downloads) || 0,
      lastWeek: Number(week.downloads) || 0,
      lastMonth: Number(month.downloads) || 0,
      totalDownloads,
      totalLabel,
      fetchedAt: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({ pkg, available: false, reason: 'request_failed' }, { status: 502 })
  }
}
