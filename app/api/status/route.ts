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

// Get active sub-agents by checking recently modified session files
function getActiveAgents(): Record<string, { task: string }> {
  const sessionsDir = '/home/clawdonaws/.openclaw/agents/main/sessions'
  const activeAgents: Record<string, { task: string }> = {}
  
  try {
    if (!fs.existsSync(sessionsDir)) {
      return activeAgents
    }
    
    const files = fs.readdirSync(sessionsDir)
    const now = Date.now()
    const THIRTY_SECONDS = 30 * 1000
    
    // Main session file patterns
    const mainSessionId = '6c766e0b-92e8-4fdc-92db-73784b5afbf0'
    
    for (const file of files) {
      if (!file.endsWith('.jsonl')) continue
      
      const filePath = path.join(sessionsDir, file)
      const stats = fs.statSync(filePath)
      const age = now - stats.mtimeMs
      
      // If modified in last 30 seconds, consider it active
      if (age < THIRTY_SECONDS) {
        // Check if it's the main session
        if (file.includes(mainSessionId)) {
          activeAgents['manager'] = { task: 'Overseeing operations...' }
          continue
        }
        
        // For sub-agents, try to determine role from session file content
        try {
          const content = fs.readFileSync(filePath, 'utf-8')
          const lines = content.trim().split('\n')
          
          // Look for label in session metadata
          let label = ''
          for (const line of lines.slice(0, 5)) {
            try {
              const parsed = JSON.parse(line)
              // Session might have metadata
              if (parsed.label) {
                label = parsed.label.toLowerCase()
                break
              }
            } catch {
              // Skip
            }
          }
          
          // Map label to role
          let role: string | null = null
          if (label.includes('dev') || label.includes('developer')) {
            role = 'developer'
          } else if (label.includes('qa')) {
            role = 'qa'
          } else if (label.includes('devops')) {
            role = 'devops'
          } else if (label.includes('test')) {
            role = 'tester'
          } else if (label.includes('xmax')) {
            role = 'xmax'
          }
          
          if (role && !activeAgents[role]) {
            activeAgents[role] = { task: label ? `Task: ${label}` : 'Working...' }
          } else if (!role && !activeAgents['developer']) {
            // Unknown sub-agent, assign to developer slot
            activeAgents['developer'] = { task: label ? `Task: ${label}` : 'Working...' }
          }
        } catch {
          // If can't read, just mark as working in available slot
          if (!activeAgents['developer']) {
            activeAgents['developer'] = { task: 'Working...' }
          }
        }
      }
    }
  } catch (error) {
    console.error('Failed to get active agents:', error)
  }
  
  return activeAgents
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
