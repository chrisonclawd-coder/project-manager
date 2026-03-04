import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

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
// GET - Get messages from KV
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fromAgent = searchParams.get('from')
    const toAgent = searchParams.get('to')
    const agentId = searchParams.get('agentId')

    // Get all messages from KV
    const messagesData = await kv.get('agent-messages')
    let messages: AgentMessage[] = []

    if (messagesData) {
      messages = JSON.parse(messagesData as string)
    }

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

// ============================================================================
// POST - Send message to KV
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { from, to, message, type = 'message' } = body

    if (!from || !to || !message) {
      return NextResponse.json({ error: 'from, to, and message required' }, { status: 400 })
    }

    // Get existing messages from KV
    const messagesData = await kv.get('agent-messages')
    let messages: AgentMessage[] = []

    if (messagesData) {
      messages = JSON.parse(messagesData as string)
    }

    // Create new message
    const newMessage: AgentMessage = {
      id: Date.now().toString(),
      from,
      to,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    }

    // Add to messages
    messages.push(newMessage)

    // Keep only last 1000 messages (KV limit)
    if (messages.length > 1000) {
      messages = messages.slice(-1000)
    }

    // Store in KV
    await kv.set('agent-messages', JSON.stringify(messages))

    return NextResponse.json(newMessage)
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

    // Get existing messages
    const messagesData = await kv.get('agent-messages')
    let messages: AgentMessage[] = []

    if (messagesData) {
      messages = JSON.parse(messagesData as string)
    }

    // Delete message by ID
    messages = messages.filter((m: AgentMessage) => m.id !== messageId)

    // Store updated messages
    await kv.set('agent-messages', JSON.stringify(messages))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
  }
}
