// Gateway WebSocket Client for real-time agent monitoring
// Connects to OpenClaw Gateway at ws://127.0.0.1:18789

let ws: WebSocket | null = null
let reconnectAttempts = 0
const MAX_RECONNECT_ATTEMPTS = 5
const RECONNECT_DELAY = 3000

export interface GatewayEvent {
  type: 'session_start' | 'session_end' | 'message' | 'tool_call' | 'heartbeat' | 'status'
  sessionKey?: string
  data?: any
  timestamp: number
}

export interface GatewayStatus {
  connected: boolean
  sessions: number
  lastEvent: number
  error?: string
}

let gatewayStatus: GatewayStatus = {
  connected: false,
  sessions: 0,
  lastEvent: 0
}

let eventListeners: ((event: GatewayEvent) => void)[] = []

export function connectToGateway(authToken?: string): GatewayStatus {
  if (ws && ws.readyState === WebSocket.OPEN) {
    return gatewayStatus
  }

  try {
    // Connect to OpenClaw Gateway WebSocket
    const wsUrl = `ws://127.0.0.1:18789/ws`
    ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      console.log('[Gateway] Connected')
      gatewayStatus.connected = true
      gatewayStatus.error = undefined
      reconnectAttempts = 0

      // Authenticate if token provided
      if (authToken) {
        ws?.send(JSON.stringify({
          type: 'auth',
          token: authToken
        }))
      }
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        gatewayStatus.lastEvent = Date.now()

        const gatewayEvent: GatewayEvent = {
          type: data.type || 'message',
          sessionKey: data.sessionKey,
          data: data.data || data,
          timestamp: Date.now()
        }

        // Update session count
        if (data.type === 'session_start') {
          gatewayStatus.sessions++
        } else if (data.type === 'session_end') {
          gatewayStatus.sessions = Math.max(0, gatewayStatus.sessions - 1)
        }

        // Notify listeners
        eventListeners.forEach(listener => listener(gatewayEvent))
      } catch (e) {
        console.error('[Gateway] Parse error:', e)
      }
    }

    ws.onerror = (error) => {
      console.error('[Gateway] Error:', error)
      gatewayStatus.error = 'Connection error'
    }

    ws.onclose = () => {
      console.log('[Gateway] Disconnected')
      gatewayStatus.connected = false

      // Auto-reconnect
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++
        console.log(`[Gateway] Reconnecting... (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`)
        setTimeout(() => connectToGateway(authToken), RECONNECT_DELAY)
      }
    }
  } catch (error) {
    console.error('[Gateway] Failed to connect:', error)
    gatewayStatus.error = 'Failed to connect'
  }

  return gatewayStatus
}

export function disconnectFromGateway() {
  if (ws) {
    ws.close()
    ws = null
  }
  gatewayStatus.connected = false
}

export function getGatewayStatus(): GatewayStatus {
  return gatewayStatus
}

export function onGatewayEvent(callback: (event: GatewayEvent) => void): () => void {
  eventListeners.push(callback)
  return () => {
    eventListeners = eventListeners.filter(l => l !== callback)
  }
}

export function sendToGateway(message: any): boolean {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message))
    return true
  }
  return false
}
