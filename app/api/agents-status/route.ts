import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

// ============================================================================
// INITIALIZATION - Load agents from JSON to KV
// ============================================================================

async function initializeAgents() {
  try {
    // Check if agents are already in KV
    const cached = await kv.get('agents-initialized')
    if (cached === 'true') {
      return
    }

    // Load from JSON file (only runs once)
    const fs = await import('fs/promises')
    const path = await import('path')

    const agentsStatus = JSON.parse(
      await fs.readFile(
        path.join(process.cwd(), 'data', 'agents-status.json'),
        'utf-8'
      )
    )

    // Store each agent in KV
    for (const [agentId, agentData] of Object.entries(agentsStatus)) {
      await kv.hset('agents-status', agentId, JSON.stringify(agentData))
    }

    // Mark as initialized
    await kv.set('agents-initialized', 'true')

    console.log('✅ Agents initialized in Vercel KV')
  } catch (error) {
    console.error('Error initializing agents:', error)
  }
}

// ============================================================================
// GET - Read agent status from KV
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const agentId = searchParams.get('agentId')

    // Initialize agents if not done (one-time setup)
    await initializeAgents()

    if (agentId) {
      // Get single agent
      const agentData = await kv.hget('agents-status', agentId)
      if (agentData) {
        return NextResponse.json(JSON.parse(agentData))
      }
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    // Get all agents
    const allAgents = await kv.hgetall('agents-status')

    // Convert to object (Vercel KV returns as Map)
    const agentsObj: Record<string, any> = {}
    if (allAgents) {
      for (const [key, value] of allAgents.entries()) {
        agentsObj[key] = JSON.parse(value as string)
      }
    }

    return NextResponse.json(agentsObj)
  } catch (error) {
    console.error('Error loading agents status:', error)
    return NextResponse.json({}, { status: 200 })
  }
}

// ============================================================================
// PUT - Update agent status in KV
// ============================================================================

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { agentId, status, currentTask, todos } = body

    if (!agentId) {
      return NextResponse.json({ error: 'agentId required' }, { status: 400 })
    }

    // Initialize if needed
    await initializeAgents()

    // Get current agent data
    const agentDataStr = await kv.hget('agents-status', agentId)
    let agentData: any = {}

    if (agentDataStr) {
      agentData = JSON.parse(agentDataStr)
    } else {
      // Create new agent if doesn't exist
      agentData = {
        status: 'idle',
        currentTask: 'New agent',
        lastUpdated: new Date().toISOString(),
        todos: []
      }
    }

    // Update fields
    if (status !== undefined) agentData.status = status
    if (currentTask !== undefined) agentData.currentTask = currentTask
    if (todos !== undefined) agentData.todos = todos
    agentData.lastUpdated = new Date().toISOString()

    // Store in KV
    await kv.hset('agents-status', agentId, JSON.stringify(agentData))

    return NextResponse.json(agentData)
  } catch (error) {
    console.error('Error updating agent status:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

// ============================================================================
// POST - Create new agent or update multiple fields
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agentId, status, currentTask, todos } = body

    if (!agentId) {
      return NextResponse.json({ error: 'agentId required' }, { status: 400 })
    }

    // Initialize if needed
    await initializeAgents()

    // Get current agent data
    const agentDataStr = await kv.hget('agents-status', agentId)
    let agentData: any = {}

    if (agentDataStr) {
      agentData = JSON.parse(agentDataStr)
    } else {
      // Create new agent
      agentData = {
        status: 'idle',
        currentTask: 'New agent',
        lastUpdated: new Date().toISOString(),
        todos: []
      }
    }

    // Update fields
    if (status !== undefined) agentData.status = status
    if (currentTask !== undefined) agentData.currentTask = currentTask
    if (todos !== undefined) agentData.todos = todos
    agentData.lastUpdated = new Date().toISOString()

    // Store in KV
    await kv.hset('agents-status', agentId, JSON.stringify(agentData))

    return NextResponse.json(agentData)
  } catch (error) {
    console.error('Error creating/updating agent:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
