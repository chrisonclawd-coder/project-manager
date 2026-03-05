import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import { join } from 'path'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const products = JSON.parse(
      await fs.readFile(join(process.cwd(), 'data', 'products.json'), 'utf-8')
    )
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error loading products:', error)
    return NextResponse.json([], { status: 500 })
  }
}
