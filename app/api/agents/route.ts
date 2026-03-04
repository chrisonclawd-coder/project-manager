import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const fs = await import('fs/promises')
    const path = await import('path')
    const agentsData = JSON.parse(
      await fs.readFile(
        path.join(process.cwd(), 'data', 'agents.json'),
        'utf-8'
      )
    )
    return NextResponse.json(agentsData)
  } catch (error) {
    console.error('Error loading agents data:', error)
    return NextResponse.json({}, { status: 200 })
  }
}
