// OpenClaw Agent Template - Mission Control Integration
// This agent properly integrates with Mission Control APIs
// Supports both HTTP polling and WebSocket for real-time updates

import { WebSocket } from 'ws'
import fetch from 'node-fetch'

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  // Agent identity
  agentId: 'YOUR_AGENT_ID', // e.g., 'developer', 'qa', 'custom-agent'
  agentName: 'Your Agent Name',
  role: 'Your Role Description',

  // Mission Control API (replace with your Vercel URL)
  missionControlUrl: process.env.MISSION_CONTROL_URL || 'https://project-manager-blue-three.vercel.app',
  missionControlToken: process.env.MISSION_CONTROL_TOKEN || '',

  // WebSocket support (optional, for real-time status updates)
  websocketUrl: process.env.MISSION_CONTROL_WS_URL || '', // e.g., 'wss://your-gateway-url/ws/agents'

  // Polling interval (fallback if WebSocket not available)
  pollInterval: 5000, // 5 seconds

  // OpenClaw Gateway (if using OpenClaw agent system)
  openclawGatewayUrl: process.env.OPENCLAW_GATEWAY_URL || '',
  openclawGatewayToken: process.env.OPENCLAW_GATEWAY_TOKEN || '',
}

// ============================================================================
// MISSION CONTROL API CLIENT
// ============================================================================

class MissionControlClient {
  constructor(private config: typeof CONFIG) {}

  // Register agent as active
  async register(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.missionControlUrl}/api/agents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.missionControlToken}`,
        },
        body: JSON.stringify({
          id: this.config.agentId,
          name: this.config.agentName,
          role: this.config.role,
          status: 'active',
          currentTask: 'Initializing...',
          sessionId: process.env.OPENCLAW_SESSION_KEY || '',
        }),
      })

      const data = await response.json()
      console.log('✅ Registered with Mission Control:', data)
      return true
    } catch (error) {
      console.error('❌ Failed to register with Mission Control:', error)
      return false
    }
  }

  // Update agent status
  async updateStatus(status: string, currentTask: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.missionControlUrl}/api/agents-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.missionControlToken}`,
        },
        body: JSON.stringify({
          status,
          currentTask,
          lastUpdated: new Date().toISOString(),
        }),
      })

      const data = await response.json()
      console.log('✅ Status updated:', data)
      return true
    } catch (error) {
      console.error('❌ Failed to update status:', error)
      return false
    }
  }

  // Get agent status
  async getStatus(): Promise<any> {
    try {
      const response = await fetch(`${this.config.missionControlUrl}/api/agents-status`, {
        headers: {
          'Authorization': `Bearer ${this.config.missionControlToken}`,
        },
      })

      const data = await response.json()
      return data[this.config.agentId]
    } catch (error) {
      console.error('❌ Failed to get status:', error)
      return null
    }
  }

  // Add todo item
  async addTodo(text: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.missionControlUrl}/api/agents-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.missionControlToken}`,
        },
        body: JSON.stringify({
          id: this.config.agentId,
          status: 'working',
          currentTask: 'Working on task',
        }),
      })

      // Then update todos
      const status = await this.getStatus()
      if (status && status.todos) {
        status.todos.push({ id: Date.now(), text, done: false })

        await fetch(`${this.config.missionControlUrl}/api/agents-status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.missionControlToken}`,
          },
          body: JSON.stringify({
            id: this.config.agentId,
            todos: status.todos,
            status: 'working',
            currentTask: 'Working on: ' + text,
          }),
        })
      }

      console.log('✅ Todo added:', text)
      return true
    } catch (error) {
      console.error('❌ Failed to add todo:', error)
      return false
    }
  }

  // Toggle todo (mark done/undone)
  async toggleTodo(todoId: number): Promise<boolean> {
    try {
      const status = await this.getStatus()
      if (status && status.todos) {
        const todo = status.todos.find(t => t.id === todoId)
        if (todo) {
          todo.done = !todo.done

          await fetch(`${this.config.missionControlUrl}/api/agents-status`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.config.missionControlToken}`,
            },
            body: JSON.stringify({
              id: this.config.agentId,
              todos: status.todos,
            }),
          })

          console.log('✅ Todo toggled:', todoId, todo.done ? 'done' : 'undone')
        }
      }

      return true
    } catch (error) {
      console.error('❌ Failed to toggle todo:', error)
      return false
    }
  }

  // Send message to another agent
  async sendMessage(toAgentId: string, message: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.missionControlUrl}/api/agent-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.missionControlToken}`,
        },
        body: JSON.stringify({
          from: this.config.agentId,
          to: toAgentId,
          message,
          type: 'message',
          timestamp: new Date().toISOString(),
        }),
      })

      const data = await response.json()
      console.log('✅ Message sent to', toAgentId)
      return true
    } catch (error) {
      console.error('❌ Failed to send message:', error)
      return false
    }
  }

  // Get messages (to/from this agent)
  async getMessages(fromAgentId?: string, toAgentId?: string): Promise<any[]> {
    try {
      let url = `${this.config.missionControlUrl}/api/agent-messages`

      if (fromAgentId || toAgentId) {
        const params = new URLSearchParams()
        if (fromAgentId) params.set('from', fromAgentId)
        if (toAgentId) params.set('to', toAgentId)
        url += '?' + params.toString()
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.config.missionControlToken}`,
        },
      })

      const data = await response.json()
      return data || []
    } catch (error) {
      console.error('❌ Failed to get messages:', error)
      return []
    }
  }

  // Mark task complete
  async completeTask(taskDescription: string): Promise<boolean> {
    try {
      const status = await this.getStatus()
      if (status && status.todos) {
        const incompleteTodo = status.todos.find(t => !t.done && t.text.includes(taskDescription))

        if (incompleteTodo) {
          incompleteTodo.done = true

          await fetch(`${this.config.missionControlUrl}/api/agents-status`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.config.missionControlToken}`,
            },
            body: JSON.stringify({
              id: this.config.agentId,
              todos: status.todos,
              status: 'idle',
              currentTask: 'Task completed: ' + taskDescription,
            }),
          })

          console.log('✅ Task completed:', taskDescription)
          return true
        }
      }

      return false
    } catch (error) {
      console.error('❌ Failed to complete task:', error)
      return false
    }
  }
}

// ============================================================================
// WEBSOCKET CLIENT (Real-time updates)
// ============================================================================

class WebSocketClient {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 10

  constructor(private config: typeof CONFIG) {}

  connect(): void {
    if (!this.config.websocketUrl) {
      console.log('⚠️  WebSocket URL not configured, using HTTP polling')
      return
    }

    try {
      this.ws = new WebSocket(this.config.websocketUrl)

      this.ws.on('open', () => {
        console.log('✅ WebSocket connected to Mission Control')
        this.reconnectAttempts = 0

        // Send heartbeat
        this.heartbeat()
      })

      this.ws.on('message', (data: string) => {
        try {
          const message = JSON.parse(data)

          this.handleMessage(message)
        } catch (error) {
          console.error('❌ Failed to parse WebSocket message:', error)
        }
      })

      this.ws.on('close', () => {
        console.log('🔌 WebSocket disconnected')
        this.reconnect()
      })

      this.ws.on('error', (error) => {
        console.error('❌ WebSocket error:', error)
        this.reconnect()
      })
    } catch (error) {
      console.error('❌ Failed to connect WebSocket:', error)
    }
  }

  private reconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('❌ Max reconnection attempts reached')
      return
    }

    this.reconnectAttempts++
    console.log(`🔄 Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)

    setTimeout(() => {
      this.connect()
    }, 5000)
  }

  private heartbeat(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'heartbeat',
        agentId: CONFIG.agentId,
        timestamp: new Date().toISOString(),
      }))

      // Send heartbeat every 30 seconds
      setTimeout(() => this.heartbeat(), 30000)
    }
  }

  private handleMessage(message: any): void {
    switch (message.type) {
      case 'status_update':
        console.log('📊 Status update:', message.data)
        // Agent can react to status changes here
        break

      case 'message':
        console.log('💬 New message:', message.data)
        // Agent can handle incoming messages here
        break

      case 'task_assignment':
        console.log('📋 New task assigned:', message.data)
        // Agent can handle new tasks here
        this.handleTaskAssignment(message.data)
        break

      default:
        console.log('❓ Unknown message type:', message.type)
    }
  }

  private handleTaskAssignment(task: any): void {
    // Implement task handling logic here
    console.log(`🎯 Processing task: ${task.description}`)

    // Example: Update status to "working"
    // Process the task
    // Complete and report back
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
      console.log('🔌 WebSocket disconnected')
    }
  }
}

// ============================================================================
// AGENT MAIN CLASS
// ============================================================================

class MissionControlAgent {
  private missionControl: MissionControlClient
  private wsClient: WebSocketClient
  private pollingInterval: NodeJS.Timeout | null = null
  private running = false

  constructor(private config: typeof CONFIG) {
    this.missionControl = new MissionControlClient(this.config)
    this.wsClient = new WebSocketClient(this.config)
  }

  // Start agent
  async start(): Promise<void> {
    console.log(`🚀 Starting ${this.config.agentName} (${this.config.agentId})`)

    // Register with Mission Control
    const registered = await this.missionControl.register()
    if (!registered) {
      console.error('❌ Failed to register agent')
      return
    }

    // Try WebSocket first
    if (this.config.websocketUrl) {
      this.wsClient.connect()
      console.log('📡 WebSocket enabled for real-time updates')
    } else {
      // Fallback to HTTP polling
      console.log('📡 Using HTTP polling (WebSocket not configured)')
      this.startPolling()
    }

    this.running = true

    // Send heartbeat every 5 seconds
    this.heartbeat()
  }

  // Stop agent
  async stop(): Promise<void> {
    console.log(`🛑 Stopping ${this.config.agentName}`)

    this.running = false
    this.wsClient.disconnect()

    if (this.pollingInterval) {
      clearInterval(this.pollingInterval)
      this.pollingInterval = null
    }

    // Update status to idle
    await this.missionControl.updateStatus('idle', 'Agent stopped')
  }

  // Process a task
  async processTask(task: any): Promise<void> {
    console.log(`🎯 Processing task: ${task.description}`)

    // Update status
    await this.missionControl.updateStatus('working', 'Processing: ' + task.description)

    // Add todo
    await this.missionControl.addTodo(task.description)

    // TODO: Implement actual task processing logic here
    // This is where the agent does its actual work

    // Complete task
    await this.missionControl.completeTask(task.description)
  }

  // Start HTTP polling (fallback)
  private startPolling(): void {
    this.pollingInterval = setInterval(async () => {
      if (!this.running) return

      const status = await this.missionControl.getStatus()
      if (status) {
        console.log(`📊 Status: ${status.status} | Task: ${status.currentTask}`)
      }
    }, CONFIG.pollInterval)
  }

  // Heartbeat to keep agent alive
  private heartbeat(): void {
    if (!this.running) return

    // Update status periodically
    setInterval(async () => {
      if (!this.running) return

      await this.missionControl.updateStatus('idle', 'Waiting for tasks')
    }, 30000) // Every 30 seconds
  }

  // Send message
  async sendMessage(toAgentId: string, message: string): Promise<void> {
    await this.missionControl.sendMessage(toAgentId, message)
  }

  // Get messages
  async getMessages(fromAgentId?: string, toAgentId?: string): Promise<any[]> {
    return await this.missionControl.getMessages(fromAgentId, toAgentId)
  }
}

// ============================================================================
// MAIN ENTRY POINT
// ============================================================================

async function main() {
  console.log('═════════════════════════════════════════════')
  console.log(`🤖 Mission Control Agent: ${CONFIG.agentName}`)
  console.log(`🆔 Agent ID: ${CONFIG.agentId}`)
  console.log('═════════════════════════════════════════════\n')

  const agent = new MissionControlAgent(CONFIG)

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...')
    await agent.stop()
    process.exit(0)
  })

  process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down gracefully...')
    await agent.stop()
    process.exit(0)
  })

  // Start agent
  await agent.start()

  console.log(`\n✅ ${CONFIG.agentName} is running and listening for tasks`)
  console.log('   - Status updates sent to Mission Control')
  console.log('   - WebSocket connected for real-time updates')
  console.log('   - Ready to process tasks\n')
}

// ============================================================================
// CLI INTERFACE (Optional - for running agent manually)
// ============================================================================

if (require.main === module) {
  main().catch(error => {
    console.error('💥 Fatal error:', error)
    process.exit(1)
  })
}

export { MissionControlAgent, MissionControlClient, WebSocketClient, CONFIG }
