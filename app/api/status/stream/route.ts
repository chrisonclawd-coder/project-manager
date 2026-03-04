import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

interface GatewayInfo {
  connected: boolean
  url: string
  totalAgents?: number
  activeAgents?: number
  totalTokens?: number
  error?: string
}

interface AgentData {
  agents: any[]
  gateway: GatewayInfo
  timestamp: string
}

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    async start(controller) {
      // Send initial agent status
      const sendUpdate = async () => {
        try {
          // Fetch real agent data from OpenClaw
          const { execSync } = await import('child_process')
          
          let agentData = {
            agents: [],
            gateway: { connected: true, url: 'ws://127.0.0.1:18789' },
            timestamp: new Date().toISOString()
          }
          
          try {
            const output = execSync('openclaw sessions --json', {
              encoding: 'utf-8',
              maxBuffer: 10 * 1024 * 1024,
              timeout: 5000
            })
            
            const sessions = JSON.parse(output)
            const allSessions = sessions.sessions || []
            
            // Transform sessions into agent statuses
            const agents = allSessions.map((session: any) => {
              const keyParts = session.key.split(':')
              const isSubagent = keyParts.includes('subagent')
              const name = isSubagent 
                ? `Subagent (${(session.sessionId || '').slice(0, 8) || 'unknown'})` 
                : keyParts[keyParts.length - 1] || session.agentId || 'Main'
              
              const ageMinutes = session.ageMs / 60000
              let status = 'idle'
              if (ageMinutes < 5) status = 'active'
              else if (ageMinutes < 30) status = 'recent'
              else if (ageMinutes < 120) status = 'away'
              
              return {
                name,
                sessionId: session.sessionId,
                status,
                tokensUsed: session.totalTokens || 0,
                currentTask: isSubagent ? 'Processing sub-task' : 'Main session',
                lastActive: new Date(session.updatedAt).toISOString(),
                model: session.model || session.modelOverride || 'unknown'
              }
            })
            
            const totalTokens = agents.reduce((sum: number, a: any) => sum + (a.tokensUsed || 0), 0)
            
            const gatewayInfo = { 
              connected: true, 
              url: 'ws://127.0.0.1:18789',
              totalAgents: agents.length,
              activeAgents: agents.filter((a: any) => a.status === 'active').length,
              totalTokens
            }
            
            agentData = {
              agents,
              gateway: gatewayInfo,
              timestamp: new Date().toISOString()
            }
          } catch (e) {
            // If OpenClaw not available, return connected: false
            agentData = {
              agents: [],
              gateway: { connected: false, url: 'ws://127.0.0.1:18789', error: 'Gateway unavailable' } as GatewayInfo,
              timestamp: new Date().toISOString()
            }
          }
          
          const message = `data: ${JSON.stringify(agentData)}\n\n`
          controller.enqueue(encoder.encode(message))
        } catch (e) {
          // Send empty on error
        }
      }
      
      // Send initial data
      await sendUpdate()
      
      // Send updates every 3 seconds for real-time feel
      const interval = setInterval(sendUpdate, 3000)
      
      // Clean up on close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        controller.close()
      })
    }
  })
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  })
}
