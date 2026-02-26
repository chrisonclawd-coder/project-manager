import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({
    available: false,
    source: null,
    installs: null,
    note: 'Chrome Web Store installs metric is currently unavailable from this environment.',
    fetchedAt: new Date().toISOString(),
  })
}
