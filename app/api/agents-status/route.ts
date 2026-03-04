import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const agentId = searchParams.get('agentId')

    const fs = await import('fs/promises')
    const path = await import('path')

    const agentsStatus = JSON.parse(
      await fs.readFile(
        path.join(process.cwd(), 'data', 'agents-status.json'),
        'utf-8'
      )
    )

    if (agentId && agentsStatus[agentId]) {
      return NextResponse.json(agentsStatus[agentId])
    }

    return NextResponse.json(agentsStatus)
  } catch (error) {
    console.error('Error loading agents status:', error)
    return NextResponse.json({}, { status: 200 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { agentId, status, currentTask, todos } = body

    if (!agentId) {
      return NextResponse.json({ error: 'agentId required' }, { status: 400 })
    }

    const fs = await import('fs/promises')
    const path = await import('path')

    const agentsStatus = JSON.parse(
      await fs.readFile(
        path.join(process.cwd(), 'data', 'agents-status.json'),
        'utf-8'
      )
    )

    if (agentsStatus[agentId]) {
      if (status !== undefined) agentsStatus[agentId].status = status
      if (currentTask !== undefined) agentsStatus[agentId].currentTask = currentTask
      if (todos !== undefined) agentsStatus[agentId].todos = todos
      agentsStatus[agentId].lastUpdated = new Date().toISOString()
    }

    await fs.writeFile(
      path.join(process.cwd(), 'data', 'agents-status.json'),
      JSON.stringify(agentsStatus, null, 2)
    )

    return NextResponse.json(agentsStatus[agentId])
  } catch (error) {
    console.error('Error updating agent status:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
