import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'team-status.json')
  const data = fs.readFileSync(filePath, 'utf-8')
  return NextResponse.json(JSON.parse(data), {
    headers: {
      'Cache-Control': 'no-store, must-revalidate',
      'Pragma': 'no-cache'
    }
  })
}
