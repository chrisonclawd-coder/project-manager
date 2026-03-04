'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronRight, Activity, Check, Plus, MessageSquare, Send, X } from 'lucide-react'

interface Agent {
  id: string
  name: string
  role: string
  model: string
  workspace: string
  team?: string
  children?: string[]
}

interface AgentStatus {
  status: 'idle' | 'working' | 'done' | 'blocked'
  currentTask: string
  lastUpdated: string
  todos: Array<{ id: number; text: string; done: boolean }>
}

interface AgentMessage {
  id: string
  from: string
  to: string
  message: string
  type: string
  timestamp: string
  read: boolean
}

interface AgentsData {
  [key: string]: Agent
}

interface AgentsStatusData {
  [key: string]: AgentStatus
}

export default function AgentHierarchy() {
  const [agents, setAgents] = useState<AgentsData | null>(null)
  const [agentsStatus, setAgentsStatus] = useState<AgentsStatusData | null>(null)
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['main']))
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [messages, setMessages] = useState<AgentMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [newTodo, setNewTodo] = useState('')
  const [showMessages, setShowMessages] = useState(false)

  useEffect(() => {
    loadAgents()
    loadAgentsStatus()
  }, [])

  useEffect(() => {
    if (selectedAgent) {
      loadMessages(selectedAgent)
    }
  }, [selectedAgent])

  const loadAgents = async () => {
    try {
      const res = await fetch('/api/agents')
      const data = await res.json()
      setAgents(data)
    } catch (error) {
      console.error('Error loading agents:', error)
    }
  }

  const loadAgentsStatus = async () => {
    try {
      const res = await fetch('/api/agents-status')
      const data = await res.json()
      setAgentsStatus(data)
    } catch (error) {
      console.error('Error loading agents status:', error)
    }
  }

  const loadMessages = async (agentId: string) => {
    try {
      const res = await fetch(`/api/agent-messages?agentId=${agentId}`)
      const data = await res.json()
      setMessages(data)
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expanded)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpanded(newExpanded)
  }

  const toggleTodo = async (agentId: string, todoId: number) => {
    const status = agentsStatus?.[agentId]
    if (!status) return

    const updatedTodos = status.todos.map(todo =>
      todo.id === todoId ? { ...todo, done: !todo.done } : todo
    )

    try {
      await fetch('/api/agents-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, todos: updatedTodos })
      })

      setAgentsStatus(prev => prev ? {
        ...prev,
        [agentId]: { ...prev[agentId], todos: updatedTodos }
      } : null)
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const addTodo = async (agentId: string) => {
    if (!newTodo.trim()) return

    const status = agentsStatus?.[agentId]
    if (!status) return

    const updatedTodos = [
      ...status.todos,
      { id: Date.now(), text: newTodo, done: false }
    ]

    try {
      await fetch('/api/agents-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, todos: updatedTodos })
      })

      setAgentsStatus(prev => prev ? {
        ...prev,
        [agentId]: { ...prev[agentId], todos: updatedTodos }
      } : null)

      setNewTodo('')
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  const deleteTodo = async (agentId: string, todoId: number) => {
    const status = agentsStatus?.[agentId]
    if (!status) return

    const updatedTodos = status.todos.filter(todo => todo.id !== todoId)

    try {
      await fetch('/api/agents-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, todos: updatedTodos })
      })

      setAgentsStatus(prev => prev ? {
        ...prev,
        [agentId]: { ...prev[agentId], todos: updatedTodos }
      } : null)
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const updateStatus = async (agentId: string, status: string) => {
    try {
      await fetch('/api/agents-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, status })
      })

      setAgentsStatus(prev => prev ? {
        ...prev,
        [agentId]: { ...prev[agentId], status: status as any }
      } : null)
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const sendMessage = async (from: string, to: string) => {
    if (!newMessage.trim()) return

    try {
      await fetch('/api/agent-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to, message: newMessage })
      })

      setNewMessage('')
      loadMessages(selectedAgent!)
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const getTeamColor = (team?: string) => {
    switch (team) {
      case 'dev': return 'text-blue-400 border-blue-400'
      case 'analysis': return 'text-purple-400 border-purple-400'
      case 'marketing': return 'text-orange-400 border-orange-400'
      default: return 'text-zinc-300 border-zinc-300'
    }
  }

  const getTeamBg = (team?: string) => {
    switch (team) {
      case 'dev': return 'bg-blue-500/10'
      case 'analysis': return 'bg-purple-500/10'
      case 'marketing': return 'bg-orange-500/10'
      default: return 'bg-zinc-800/50'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle': return 'text-zinc-400 bg-zinc-500/10'
      case 'working': return 'text-blue-400 bg-blue-500/10'
      case 'done': return 'text-emerald-400 bg-emerald-500/10'
      case 'blocked': return 'text-red-400 bg-red-500/10'
      default: return 'text-zinc-400 bg-zinc-500/10'
    }
  }

  const renderAgentNode = (id: string, level: number = 0): JSX.Element => {
    const agent = agents?.[id]
    const status = agentsStatus?.[id]
    if (!agent) return <></>

    const isExpanded = expanded.has(id)
    const hasChildren = agent.children && agent.children.length > 0

    return (
      <div key={id} className="space-y-1">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`flex items-start gap-2 p-2 border hover:border-zinc-600 transition-colors cursor-pointer ${getTeamBg(agent.team)} ${selectedAgent === id ? 'border-zinc-400' : ''}`}
          style={{ marginLeft: `${level * 16}px` }}
          onClick={() => setSelectedAgent(id)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleExpand(id)
            }}
            className={`mt-1 ${hasChildren ? 'cursor-pointer' : 'invisible'}`}
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-sm font-semibold ${getTeamColor(agent.team)}`}>
                {agent.role === 'CEO' ? '🎯' : ''}
              </span>
              <span className="text-sm font-semibold text-zinc-100">{agent.name}</span>
              {status && (
                <span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wider ${getStatusColor(status.status)}`}>
                  {status.status}
                </span>
              )}
            </div>

            {status && status.currentTask && (
              <div className="text-[11px] text-zinc-400 truncate max-w-[300px]">
                {status.currentTask}
              </div>
            )}
          </div>

          {status && status.todos.length > 0 && (
            <div className="text-[11px] text-zinc-500 flex items-center gap-1">
              <Check size={10} />
              {status.todos.filter(t => t.done).length}/{status.todos.length}
            </div>
          )}
        </motion.div>

        {isExpanded && hasChildren && agent.children?.map(childId => (
          <div key={childId}>{renderAgentNode(childId, level + 1)}</div>
        ))}
      </div>
    )
  }

  const renderAgentDetails = () => {
    const agent = agents?.[selectedAgent!]
    const status = agentsStatus?.[selectedAgent!]
    if (!agent || !status) return null

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border p-4 bg-zinc-800/50 space-y-4"
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-zinc-100">{agent.name}</h3>
            <p className={`text-xs ${getTeamColor(agent.team)}`}>{agent.role}</p>
          </div>
          <select
            value={status.status}
            onChange={(e) => updateStatus(selectedAgent!, e.target.value)}
            className="text-xs px-2 py-1 bg-zinc-700 text-zinc-100 rounded border border-zinc-600"
          >
            <option value="idle">Idle</option>
            <option value="working">Working</option>
            <option value="done">Done</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-zinc-400 uppercase tracking-wider">Current Task</label>
          <div className="text-sm text-zinc-300">{status.currentTask}</div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-zinc-400 uppercase tracking-wider">Todos</label>
            <button
              onClick={() => setShowMessages(false)}
              className="flex items-center gap-1 text-xs px-2 py-1 bg-zinc-700 text-zinc-100 rounded hover:bg-zinc-600"
            >
              <MessageSquare size={12} />
              Send Message
            </button>
          </div>

          {!showMessages && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Add todo..."
                  className="flex-1 text-xs px-2 py-1 bg-zinc-700 text-zinc-100 rounded border border-zinc-600"
                  onKeyPress={(e) => e.key === 'Enter' && addTodo(selectedAgent!)}
                />
                <button
                  onClick={() => addTodo(selectedAgent!)}
                  className="px-2 py-1 bg-zinc-600 text-zinc-100 rounded hover:bg-zinc-500"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="space-y-1 max-h-48 overflow-y-auto">
                {status.todos.length === 0 ? (
                  <div className="text-xs text-zinc-500">No todos</div>
                ) : (
                  status.todos.map(todo => (
                    <div key={todo.id} className="flex items-start gap-2 text-xs">
                      <button
                        onClick={() => toggleTodo(selectedAgent!, todo.id)}
                        className={`mt-0.5 ${todo.done ? 'text-emerald-400' : 'text-zinc-500'}`}
                      >
                        <Check size={14} />
                      </button>
                      <span className={`flex-1 ${todo.done ? 'line-through text-zinc-500' : 'text-zinc-300'}`}>
                        {todo.text}
                      </span>
                      <button
                        onClick={() => deleteTodo(selectedAgent!, todo.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {showMessages && (
            <div className="space-y-2">
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-xs text-zinc-500">No messages</div>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className={`border p-2 ${msg.from === selectedAgent ? 'bg-zinc-700/50' : 'bg-zinc-800'}`}>
                      <div className="text-[10px] text-zinc-500 mb-1">
                        <span className="font-semibold text-zinc-400">{agents?.[msg.from]?.name || msg.from}</span>
                        {' → '}
                        <span className="font-semibold text-zinc-400">{agents?.[msg.to]?.name || msg.to}</span>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                      <div className="text-xs text-zinc-300">{msg.message}</div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-2">
                <select
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  className="text-xs px-2 py-1 bg-zinc-700 text-zinc-100 rounded border border-zinc-600"
                >
                  <option value="">Select agent to message...</option>
                  {agents && Object.entries(agents)
                    .filter(([id]) => id !== selectedAgent)
                    .map(([id, agent]) => (
                      <option key={id} value={id}>{agent.name}</option>
                    ))
                  }
                </select>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type message..."
                  className="flex-1 text-xs px-2 py-1 bg-zinc-700 text-zinc-100 rounded border border-zinc-600"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage(selectedAgent!, newTodo)}
                />
                <button
                  onClick={() => sendMessage(selectedAgent!, newTodo)}
                  disabled={!newTodo || !newMessage}
                  className="px-2 py-1 bg-zinc-600 text-zinc-100 rounded hover:bg-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  if (!agents) {
    return (
      <div className="border p-8 text-center text-zinc-400">
        Loading agent hierarchy...
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="space-y-4">
        <div className="border p-4 bg-zinc-800/50">
          <h2 className="text-lg font-semibold tracking-[0.14em] border-l-2 border-zinc-300 pl-3 mb-1">
            AGENT HIERARCHY
          </h2>
          <p className="text-xs tracking-[0.12em] text-zinc-400">
            17 AGENTS ACROSS 3 TEAMS
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="border p-3 bg-blue-500/5">
            <p className="text-xs tracking-[0.14em] text-blue-400">SOFTWARE DEV</p>
            <p className="text-2xl mt-1 font-semibold text-blue-300">6</p>
          </div>
          <div className="border p-3 bg-purple-500/5">
            <p className="text-xs tracking-[0.14em] text-purple-400">ANALYSIS</p>
            <p className="text-2xl mt-1 font-semibold text-purple-300">5</p>
          </div>
          <div className="border p-3 bg-orange-500/5">
            <p className="text-xs tracking-[0.14em] text-orange-400">MARKETING</p>
            <p className="text-2xl mt-1 font-semibold text-orange-300">5</p>
          </div>
        </div>

        <div className="border p-4 bg-zinc-800/30">
          <div className="space-y-2">
            {renderAgentNode('main')}
          </div>
        </div>

        <div className="border p-4 bg-zinc-800/50">
          <h3 className="text-sm font-semibold mb-3 text-zinc-300">STATUS LEGEND</h3>
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-zinc-500" />
              <span className="text-xs text-zinc-400">Idle</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs text-zinc-400">Working</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-zinc-400">Done</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-xs text-zinc-400">Blocked</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {selectedAgent ? (
          renderAgentDetails()
        ) : (
          <div className="border p-8 text-center text-zinc-400">
            <p className="text-lg mb-2">Select an agent</p>
            <p className="text-sm">Click on an agent to view details, todos, and send messages</p>
          </div>
        )}

        <div className="border p-4 bg-zinc-800/50">
          <h3 className="text-sm font-semibold mb-3 text-zinc-300">INTERDEPARTMENTAL MESSAGING</h3>
          <p className="text-xs text-zinc-400">
            Agents can communicate across teams. Click "Send Message" to start a conversation.
          </p>
          <div className="mt-3 space-y-2 text-xs text-zinc-500">
            <p>• Software Dev ↔ Marketing: Coordinate campaigns, discuss features</p>
            <p>• Analysis ↔ Marketing: Share insights, improve content</p>
            <p>• All teams ↔ Chrisly: Report status, request approvals</p>
          </div>
        </div>
      </div>
    </div>
  )
}
