import { NextResponse } from 'next/server'
import { execSync } from 'child_process'

interface AgentSession {
  key: string
  updatedAt: number
  ageMs: number
  sessionId: string
  systemSent?: boolean
  abortedLastRun?: boolean
  inputTokens?: number
  outputTokens?: number
  totalTokens?: number | null
  totalTokensFresh?: boolean
  model?: string
  modelProvider?: string
  providerOverride?: string
  modelOverride?: string
  contextTokens?: number
  agentId?: string
  kind?: string
}

interface AgentStatus {
  name: string
  currentTask: string
  tokensUsed: number
  status: string
  lastActive: string
  sessionId: string
  model: string
}

export async function GET() {
  try {
    // Fetch sessions from OpenClaw
    const output = execSync('openclaw sessions --json', {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024
    })
    
    const data = JSON.parse(output)
    const sessions: AgentSession[] = data.sessions || []
    
    // Transform sessions into agent statuses
    const agentStatuses: AgentStatus[] = sessions
      .filter(s => s.totalTokens && s.totalTokens > 0)
      .map(session => {
        const keyParts = session.key.split(':')
        const isSubagent = keyParts.includes('subagent')
        const name = isSubagent ? `Subagent (${session.sessionId.slice(0, 8)})` : 
                     keyParts[keyParts.length - 1] || session.agentId || 'Unknown'
        
        // Determine status based on age
        const ageMinutes = session.ageMs / 60000
        let status = 'idle'
        if (ageMinutes < 5) {
          status = 'active'
        } else if (ageMinutes < 30) {
          status = 'recent'
        } else if (ageMinutes < 120) {
          status = 'away'
        }
        
        return {
          name,
          currentTask: isSubagent ? 'Processing sub-task' : 'Main session',
          tokensUsed: session.totalTokens || 0,
          status,
          lastActive: new Date(session.updatedAt).toISOString(),
          sessionId: session.sessionId,
          model: session.model || session.modelOverride || 'unknown'
        }
      })
    
    // Calculate totals
    const totalTokensToday = agentStatuses.reduce((sum, a) => sum + a.tokensUsed, 0)
    const costEstimate = totalTokensToday * 0.001 / 1000 // $0.001 per 1k tokens
    
    return NextResponse.json({
      success: true,
      agents: agentStatuses,
      summary: {
        totalAgents: agentStatuses.length,
        totalTokensToday: totalTokensToday,
        costEstimate: costEstimate,
        currency: 'USD',
        model: 'GLM-4.7'
      },
      lastUpdated: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error fetching agent status:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch agent status',
      agents: [],
      summary: {
        totalAgents: 0,
        totalTokensToday: 0,
        costEstimate: 0,
        currency: 'USD',
        model: 'GLM-4.7'
      }
    }, { status: 500 })
  }
}
