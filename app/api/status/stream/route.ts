import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    async start(controller) {
      // Send initial status
      const sendUpdate = async () => {
        try {
          // Read team status
          const status = await import('fs').then(fs => 
            fs.readFileSync('/home/clawdonaws/.openclaw/workspace/project-manager/data/team-status.json', 'utf-8')
          )
          
          const data = JSON.parse(status)
          const message = `data: ${JSON.stringify(data)}\n\n`
          controller.enqueue(encoder.encode(message))
        } catch (e) {
          // Send empty on error
        }
      }
      
      // Send initial data
      await sendUpdate()
      
      // Send updates every 5 seconds
      const interval = setInterval(sendUpdate, 5000)
      
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
