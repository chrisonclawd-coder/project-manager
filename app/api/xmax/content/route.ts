import { NextResponse } from 'next/server'
import { getAllContent } from '@/lib/xmax-content'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const content = getAllContent()
    return NextResponse.json(content)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 })
  }
}
