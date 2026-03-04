import { NextRequest, NextResponse } from 'next/server'
import { get, set, getAll } from '@vercel/edge-config'

// ============================================================================
// INITIALIZATION - Load agents from JSON to Edge Config
// ============================================================================

async function initializeAgents() {
  try {
    // Check if agents are already in Edge Config
    const initialized = await get('agents-initialized')
    if (initialized === 'true') {
      return
    }

    // Load from JSON file (one-time only)
    const fs = await import('fs/promises')
    const path = await import('path')

    const agentsStatus = JSON.parse(
      await fs.readFile(
        path.join(process.cwd(), 'data', 'agents-status.json'),
        'utf-8'
      )
    )

    // Store each agent in Edge Config
    for (const [agentId, agentData] of Object.entries(agentsStatus)) {
      await set(`agent-${agentId}`, JSON.stringify(agentData))
    }

    // Mark as initialized
    await set('agents-initialized', 'true')

    console.log('✅ Agents initialized in Vercel Edge Config')
  } catch (error) {
    console.error('Error initializing agents:', error)
  }
}

// ============================================================================
// GET - Read agent status from Edge Config
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const agentId = searchParams.get('agentId')

    // Initialize agents if not done (one-time setup)
    await initializeAgents()

    if (agentId) {
      // Get single agent
      const agentData = await get(`agent-${agentId}`)
      if (agentData) {
        return NextResponse.json(JSON.parse(agentData))
      }
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    // Get all agents
    const allConfig = await getAll()

    // Filter agent keys
    const agentsObj: Record<string, any> = {}
    for (const [key, value] of Object.entries(allConfig)) {
      if (key.startsWith('agent-')) {
        const agentId = key.replace('agent-', '')
        agentsObj[agentId] = JSON.parse(value as string)
      }
    }

    return NextResponse.json(agentsObj)
  } catch (error) {
    console.error('Error loading agents status:', error)
    return NextResponse.json({}, { status: 200 })
  }
}

// ============================================================================
// PUT - Update agent status in Edge Config
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
    const agentDataStr = await get(`agent-${agentId}`)
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

    // Store in Edge Config
    await set(`agent-${agentId}`, JSON.stringify(agentData))

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
    const agentDataStr = await get(`agent-${agentId}`)
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

    // Store in Edge Config
    await set(`agent-${agentId}`, JSON.stringify(agentData))

    return NextResponse.json(agentData)
  } catch (error) {
    console.error('Error creating/updating agent:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
