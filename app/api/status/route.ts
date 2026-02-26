import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

type StatusEntry = {
  name: string
  role: string
  status: string
  currentTask: string
  blocker: string
  updatedAt: string
}

type StatusPayload = Record<string, StatusEntry>

const fallbackData: StatusPayload = {
  manager: {
    name: 'Chrisly',
    role: 'Manager',
    status: 'idle',
    currentTask: '',
    blocker: '',
    updatedAt: '',
  },
  xmax: {
    name: 'xMax',
    role: 'X Strategy Lead',
    status: 'idle',
    currentTask: '',
    blocker: '',
    updatedAt: '',
  },
  developer: {
    name: 'Developer',
    role: 'Developer',
    status: 'idle',
    currentTask: '',
    blocker: '',
    updatedAt: '',
  },
  qa: {
    name: 'QA',
    role: 'QA Engineer',
    status: 'idle',
    currentTask: '',
    blocker: '',
    updatedAt: '',
  },
  devops: {
    name: 'DevOps',
    role: 'DevOps Engineer',
    status: 'idle',
    currentTask: '',
    blocker: '',
    updatedAt: '',
  },
  tester: {
    name: 'Manual Test',
    role: 'Manual Tester',
    status: 'idle',
    currentTask: '',
    blocker: '',
    updatedAt: '',
  },
}

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'team-status.json')

  try {
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { team: fallbackData, lastUpdated: null, source: 'fallback' },
        { headers: { 'Cache-Control': 'no-store, must-revalidate', Pragma: 'no-cache' } },
      )
    }

    const raw = fs.readFileSync(filePath, 'utf-8')
    const parsed = JSON.parse(raw) as Record<string, Partial<StatusEntry>>

    const team = Object.entries(fallbackData).reduce<Record<string, StatusEntry>>((acc, [key, base]) => {
      const item = parsed?.[key] ?? {}
      acc[key] = {
        name: item.name || base.name,
        role: item.role || base.role,
        status: item.status || base.status,
        currentTask: item.currentTask || '',
        blocker: item.blocker || '',
        updatedAt: item.updatedAt || '',
      }
      return acc
    }, {})

    const timestamps = Object.values(team)
      .map(item => new Date(item.updatedAt).getTime())
      .filter(value => Number.isFinite(value) && value > 0)

    const lastUpdated = timestamps.length > 0 ? new Date(Math.max(...timestamps)).toISOString() : null

    return NextResponse.json(
      { team, lastUpdated, source: 'file' },
      { headers: { 'Cache-Control': 'no-store, must-revalidate', Pragma: 'no-cache' } },
    )
  } catch {
    return NextResponse.json(
      { team: fallbackData, lastUpdated: null, source: 'fallback' },
      { headers: { 'Cache-Control': 'no-store, must-revalidate', Pragma: 'no-cache' } },
    )
  }
}
