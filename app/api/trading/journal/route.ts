import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const JOURNAL_FILE = path.join(process.cwd(), 'data', 'trading-journal.json')

interface JournalEntry {
  id: string
  date: string
  stock: string
  action: 'BUY' | 'SELL' | 'SHORT' | 'COVER'
  entryPrice: number
  exitPrice?: number
  quantity: number
  notes: string
  createdAt: string
  updatedAt: string
}

// GET - Fetch all journal entries
export async function GET() {
  try {
    const data = await fs.readFile(JOURNAL_FILE, 'utf-8')
    const entries = JSON.parse(data) as JournalEntry[]

    // Sort by date descending
    entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return NextResponse.json(entries)
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      return NextResponse.json([])
    }
    console.error('Journal read error:', error)
    return NextResponse.json(
      { error: 'Failed to read journal' },
      { status: 500 }
    )
  }
}

// POST - Add a new journal entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, stock, action, entryPrice, exitPrice, quantity, notes } = body

    // Validation
    if (!date || !stock || !action || !entryPrice || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields: date, stock, action, entryPrice, quantity' },
        { status: 400 }
      )
    }

    if (
      !['BUY', 'SELL', 'SHORT', 'COVER'].includes(action.toUpperCase())
    ) {
      return NextResponse.json(
        { error: 'Invalid action. Must be BUY, SELL, SHORT, or COVER' },
        { status: 400 }
      )
    }

    // Read existing entries
    let entries: JournalEntry[] = []
    try {
      const data = await fs.readFile(JOURNAL_FILE, 'utf-8')
      entries = JSON.parse(data)
    } catch (error) {
      if ((error as any).code !== 'ENOENT') {
        throw error
      }
    }

    // Create new entry
    const newEntry: JournalEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date,
      stock: stock.toUpperCase(),
      action: action.toUpperCase() as 'BUY' | 'SELL' | 'SHORT' | 'COVER',
      entryPrice: parseFloat(entryPrice),
      exitPrice: exitPrice ? parseFloat(exitPrice) : undefined,
      quantity: parseInt(quantity),
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Add to entries
    entries.push(newEntry)

    // Write to file
    await fs.writeFile(JOURNAL_FILE, JSON.stringify(entries, null, 2))

    return NextResponse.json(newEntry, { status: 201 })
  } catch (error) {
    console.error('Journal write error:', error)
    return NextResponse.json(
      { error: 'Failed to save journal entry' },
      { status: 500 }
    )
  }
}
