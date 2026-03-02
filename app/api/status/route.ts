import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

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

// Map subagent labels to team roles
function getRoleFromLabel(label: string): string | null {
  const labelLower = label.toLowerCase()
  if (labelLower.includes('dev')) return 'developer'
  if (labelLower.includes('qa')) return 'qa'
  if (labelLower.includes('devops')) return 'devops'
  if (labelLower.includes('test')) return 'tester'
  if (labelLower.includes('xmax')) return 'xmax'
  if (labelLower.includes('manager')) return 'manager'
  return null
}

// Get active sub-agents from OpenClaw
function getActiveAgents(): Record<string, { task: string; runtime: string }> {
  try {
    const result = execSync('openclaw sessions list --json 2>/dev/null || echo "[]"', {
      encoding: 'utf-8',
      timeout: 5000,
    })
    
    const sessions = JSON.parse(result || '[]')
    const activeAgents: Record<string, { task: string; runtime: string }> = {}
    
    // Look for subagents with labels
    for (const session of sessions) {
      if (session.kind === 'subagent' && session.status === 'active' && session.label) {
        const role = getRoleFromLabel(session.label)
        if (role) {
          activeAgents[role] = {
            task: session.task?.substring(0, 100) || 'Working...',
            runtime: session.runtime || 'running',
          }
        }
      }
    }
    
    return activeAgents
  } catch (error) {
    console.error('Failed to get active agents:', error)
    return {}
  }
}

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'team-status.json')

  try {
    // Get active agents first (real-time status)
    const activeAgents = getActiveAgents()
    const now = new Date().toISOString()

    // Load static data from file
    let parsed: Record<string, Partial<StatusEntry>> = {}
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf-8')
        parsed = JSON.parse(raw)
      } catch {
        // Ignore parse errors
      }
    }

    // Build team status with auto-detection
    const team = Object.entries(fallbackData).reduce<Record<string, StatusEntry>>((acc, [key, base]) => {
      const item = parsed?.[key] ?? {}
      const isActive = activeAgents[key]
      
      // If agent is active, show real-time status
      if (isActive) {
        acc[key] = {
          name: item.name || base.name,
          role: item.role || base.role,
          status: 'working',
          currentTask: isActive.task,
          blocker: '',
          updatedAt: now,
        }
      } else {
        // Use static file data or fallback
        acc[key] = {
          name: item.name || base.name,
          role: item.role || base.role,
          status: item.status || 'idle',
          currentTask: item.currentTask || '',
          blocker: item.blocker || '',
          updatedAt: item.updatedAt || now,
        }
      }
      return acc
    }, {})

    const timestamps = Object.values(team)
      .map(item => new Date(item.updatedAt).getTime())
      .filter(value => Number.isFinite(value) && value > 0)

    const lastUpdated = timestamps.length > 0 ? new Date(Math.max(...timestamps)).toISOString() : now

    return NextResponse.json(
      { team, lastUpdated, source: 'auto-detect', activeAgents: Object.keys(activeAgents) },
      { headers: { 'Cache-Control': 'no-store, must-revalidate', Pragma: 'no-cache' } },
    )
  } catch (error) {
    console.error('Status API error:', error)
    return NextResponse.json(
      { team: fallbackData, lastUpdated: null, source: 'fallback' },
      { headers: { 'Cache-Control': 'no-store, must-revalidate', Pragma: 'no-cache' } },
    )
  }
}
