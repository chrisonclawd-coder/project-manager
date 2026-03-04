import { NextRequest, NextResponse } from 'next/server'

interface AgentMessage {
  from: string
  to: string
  message: string
  type: string
  timestamp: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fromAgent = searchParams.get('from')
    const toAgent = searchParams.get('to')
    const agentId = searchParams.get('agentId')

    const fs = await import('fs/promises')
    const path = await import('path')

    const messages = JSON.parse(
      await fs.readFile(
        path.join(process.cwd(), 'data', 'agent-messages.json'),
        'utf-8'
      )
    ) as AgentMessage[]

    let filtered = messages

    if (agentId) {
      // Get all messages for this agent (both sent and received)
      filtered = messages.filter((m: AgentMessage) => m.from === agentId || m.to === agentId)
    } else if (fromAgent && toAgent) {
      // Get conversation between two agents
      filtered = messages.filter((m: AgentMessage) =>
        (m.from === fromAgent && m.to === toAgent) ||
        (m.from === toAgent && m.to === fromAgent)
      )
    }

    return NextResponse.json(filtered)
  } catch (error) {
    console.error('Error loading messages:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { from, to, message, type = 'message' } = body

    if (!from || !to || !message) {
      return NextResponse.json({ error: 'from, to, and message required' }, { status: 400 })
    }

    const fs = await import('fs/promises')
    const path = await import('path')

    const messages = JSON.parse(
      await fs.readFile(
        path.join(process.cwd(), 'data', 'agent-messages.json'),
        'utf-8'
      )
    )

    const newMessage = {
      id: Date.now().toString(),
      from,
      to,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    }

    messages.push(newMessage)

    await fs.writeFile(
      path.join(process.cwd(), 'data', 'agent-messages.json'),
      JSON.stringify(messages, null, 2)
    )

    return NextResponse.json(newMessage)
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
