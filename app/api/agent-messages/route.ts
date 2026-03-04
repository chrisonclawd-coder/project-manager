import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

interface AgentMessage {
  id: string
  from: string
  to: string
  message: string
  type: string
  timestamp: string
  read: boolean
}

// ============================================================================
// GET - Get messages from Postgres
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fromAgent = searchParams.get('from')
    const toAgent = searchParams.get('to')
    const agentId = searchParams.get('agentId')

    // Get all messages
    const result = await sql`
      SELECT
        id,
        from_agent as "from",
        to_agent as "to",
        message,
        type,
        read,
        created_at as "timestamp"
      FROM agent_messages
      ORDER BY created_at DESC
    `

    let messages: AgentMessage[] = result.rows

    if (agentId) {
      // Get all messages for this agent (both sent and received)
      messages = messages.filter((m: AgentMessage) => m.from === agentId || m.to === agentId)
    } else if (fromAgent && toAgent) {
      // Get conversation between two agents
      messages = messages.filter((m: AgentMessage) =>
        (m.from === fromAgent && m.to === toAgent) ||
        (m.from === toAgent && m.to === fromAgent)
      )
    }

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error loading messages:', error)
    return NextResponse.json([], { status: 200 })
  }
}

// ============================================================================
// POST - Send message to Postgres
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { from, to, message, type = 'message' } = body

    if (!from || !to || !message) {
      return NextResponse.json({ error: 'from, to, and message required' }, { status: 400 })
    }

    // Create new message
    const messageId = Date.now().toString()

    await sql`
      INSERT INTO agent_messages (id, from_agent, to_agent, message, type)
      VALUES (${messageId}, ${from}, ${to}, ${message}, ${type})
    `

    // Get created message
    const result = await sql`
      SELECT
        id,
        from_agent as "from",
        to_agent as "to",
        message,
        type,
        read,
        created_at as "timestamp"
      FROM agent_messages
      WHERE id = ${messageId}
    `

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}

// ============================================================================
// DELETE - Delete a message
// ============================================================================

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const messageId = searchParams.get('id')

    if (!messageId) {
      return NextResponse.json({ error: 'messageId required' }, { status: 400 })
    }

    await sql`
      DELETE FROM agent_messages WHERE id = ${messageId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
  }
}
