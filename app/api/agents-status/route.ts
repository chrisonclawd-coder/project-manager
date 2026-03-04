import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

// ============================================================================
// INITIALIZATION - Create tables if not exist
// ============================================================================

async function initializeTables() {
  try {
    // Create agents_status table
    await sql`
      CREATE TABLE IF NOT EXISTS agents_status (
        agent_id VARCHAR(255) PRIMARY KEY,
        status VARCHAR(50),
        current_task TEXT,
        todos JSONB,
        last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Create agent_messages table
    await sql`
      CREATE TABLE IF NOT EXISTS agent_messages (
        id VARCHAR(255) PRIMARY KEY,
        from_agent VARCHAR(255),
        to_agent VARCHAR(255),
        message TEXT,
        type VARCHAR(50),
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    console.log('✅ Tables initialized in Vercel Postgres')
  } catch (error) {
    console.error('Error initializing tables:', error)
  }
}

// ============================================================================
// GET - Read agent status from Postgres
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const agentId = searchParams.get('agentId')

    await initializeTables()

    if (agentId) {
      // Get single agent
      const result = await sql`
        SELECT
          agent_id as "agentId",
          status,
          current_task as "currentTask",
          todos,
          last_updated as "lastUpdated"
        FROM agents_status
        WHERE agent_id = ${agentId}
      `

      if (result.rows.length > 0) {
        return NextResponse.json(result.rows[0])
      }

      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    // Get all agents
    const result = await sql`
      SELECT
        agent_id as "agentId",
        status,
        current_task as "currentTask",
        todos,
        last_updated as "lastUpdated"
      FROM agents_status
    `

    // Convert to object
    const agentsObj: Record<string, any> = {}
    for (const row of result.rows) {
      agentsObj[row.agentId] = {
        status: row.status,
        currentTask: row.currentTask,
        todos: row.todos || [],
        lastUpdated: row.lastUpdated
      }
    }

    return NextResponse.json(agentsObj)
  } catch (error) {
    console.error('Error loading agents status:', error)
    return NextResponse.json({}, { status: 200 })
  }
}

// ============================================================================
// PUT - Update agent status in Postgres
// ============================================================================

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { agentId, status, currentTask, todos } = body

    if (!agentId) {
      return NextResponse.json({ error: 'agentId required' }, { status: 400 })
    }

    await initializeTables()

    // Check if agent exists
    const existing = await sql`
      SELECT agent_id FROM agents_status WHERE agent_id = ${agentId}
    `

    if (existing.rows.length > 0) {
      // Update existing agent
      await sql`
        UPDATE agents_status
        SET
          status = ${status},
          current_task = ${currentTask},
          todos = ${JSON.stringify(todos)},
          last_updated = NOW()
        WHERE agent_id = ${agentId}
      `
    } else {
      // Create new agent
      await sql`
        INSERT INTO agents_status (agent_id, status, current_task, todos)
        VALUES (
          ${agentId},
          ${status},
          ${currentTask},
          ${JSON.stringify(todos || [])}
        )
      `
    }

    // Get updated agent
    const result = await sql`
      SELECT
        agent_id as "agentId",
        status,
        current_task as "currentTask",
        todos,
        last_updated as "lastUpdated"
      FROM agents_status
      WHERE agent_id = ${agentId}
    `

    return NextResponse.json(result.rows[0])
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

    await initializeTables()

    // Check if agent exists
    const existing = await sql`
      SELECT agent_id FROM agents_status WHERE agent_id = ${agentId}
    `

    if (existing.rows.length > 0) {
      // Update existing agent
      await sql`
        UPDATE agents_status
        SET
          status = COALESCE(${status}, status),
          current_task = COALESCE(${currentTask}, current_task),
          todos = COALESCE(${JSON.stringify(todos)}, todos),
          last_updated = NOW()
        WHERE agent_id = ${agentId}
      `
    } else {
      // Create new agent
      await sql`
        INSERT INTO agents_status (agent_id, status, current_task, todos)
        VALUES (
          ${agentId},
          ${status || 'idle'},
          ${currentTask || 'New agent'},
          ${JSON.stringify(todos || [])}
        )
      `
    }

    // Get updated agent
    const result = await sql`
      SELECT
        agent_id as "agentId",
        status,
        current_task as "currentTask",
        todos,
        last_updated as "lastUpdated"
      FROM agents_status
      WHERE agent_id = ${agentId}
    `

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error creating/updating agent:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
