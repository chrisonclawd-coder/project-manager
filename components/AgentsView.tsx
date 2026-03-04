'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ChevronRight,
  ChevronDown,
  Activity,
  CheckCircle2,
  Clock,
  Send,
  Plus,
  Trash2,
  MessageSquare,
  Users,
  Zap,
  Target,
  BarChart3,
  AlertCircle,
  Settings,
  MoreVertical,
  Eye,
  EyeOff,
} from 'lucide-react'

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

export default function AgentsView() {
  const [agents, setAgents] = useState<Record<string, Agent> | null>(null)
  const [agentsStatus, setAgentsStatus] = useState<Record<string, AgentStatus> | null>(null)
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['main']))
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [messages, setMessages] = useState<AgentMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [newTodo, setNewTodo] = useState('')
  const [showMessages, setShowMessages] = useState(false)
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null)
  const [selectedTeam, setSelectedTeam] = useState<'all' | 'dev' | 'analysis' | 'marketing'>('all')

  useEffect(() => {
    loadAgents()
    loadAgentsStatus()
    // Refresh status every 5 seconds
    const interval = setInterval(loadAgentsStatus, 5000)
    return () => clearInterval(interval)
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

  const getTeamGradient = (team?: string) => {
    switch (team) {
      case 'dev': return 'from-blue-500/20 to-cyan-500/5'
      case 'analysis': return 'from-purple-500/20 to-fuchsia-500/5'
      case 'marketing': return 'from-orange-500/20 to-amber-500/5'
      default: return 'from-slate-500/20 to-zinc-500/5'
    }
  }

  const getTeamBorder = (team?: string) => {
    switch (team) {
      case 'dev': return 'border-blue-500/30 hover:border-blue-400/50'
      case 'analysis': return 'border-purple-500/30 hover:border-purple-400/50'
      case 'marketing': return 'border-orange-500/30 hover:border-orange-400/50'
      default: return 'border-slate-500/30 hover:border-slate-400/50'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle': return 'text-slate-400'
      case 'working': return 'text-blue-400'
      case 'done': return 'text-emerald-400'
      case 'blocked': return 'text-rose-400'
      default: return 'text-slate-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'idle': return <Clock size={12} />
      case 'working': return <Activity size={12} />
      case 'done': return <CheckCircle2 size={12} />
      case 'blocked': return <AlertCircle size={12} />
      default: return <Clock size={12} />
    }
  }

  const renderAgentNode = (id: string, level: number = 0): JSX.Element => {
    const agent = agents?.[id]
    const status = agentsStatus?.[id]
    if (!agent) return <></>

    const isExpanded = expanded.has(id)
    const hasChildren = agent.children && agent.children.length > 0
    const isHovered = hoveredAgent === id

    return (
      <div key={id} className="space-y-1">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.01 }}
          className={`
            relative overflow-hidden rounded-lg
            bg-gradient-to-br ${getTeamGradient(agent.team)}
            border ${getTeamBorder(agent.team)}
            transition-all duration-300
            cursor-pointer group
            ${selectedAgent === id ? 'ring-2 ring-white/20' : ''}
          `}
          style={{ marginLeft: `${level * 12}px` }}
          onClick={() => setSelectedAgent(id)}
          onMouseEnter={() => setHoveredAgent(id)}
          onMouseLeave={() => setHoveredAgent(null)}
        >
          {/* Animated gradient border */}
          <motion.div
            className="absolute inset-0 rounded-lg"
            initial={false}
            animate={isHovered ? {
              background: [
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
              ],
            } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />

          <div className="relative flex items-start gap-3 p-3">
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleExpand(id)
              }}
              className={`mt-0.5 transition-transform ${hasChildren ? 'hover:scale-110' : 'invisible'}`}
            >
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight size={14} />
              </motion.div>
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-base font-bold text-white/90 tracking-tight">
                  {agent.name}
                </span>

                {status && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`
                      flex items-center gap-1.5 px-2.5 py-0.5 rounded-full
                      text-[10px] font-medium uppercase tracking-wide
                      ${getStatusColor(status.status)}
                      bg-white/5 backdrop-blur-sm
                    `}
                  >
                    {getStatusIcon(status.status)}
                    {status.status}
                  </motion.div>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-white/60">
                <Users size={11} />
                <span className="font-medium">{agent.role}</span>

                {status?.todos && status.todos.length > 0 && (
                  <span className="flex items-center gap-1 ml-auto">
                    <CheckCircle2 size={11} />
                    <span className="text-white/80">
                      {status.todos.filter(t => t.done).length}/{status.todos.length}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {isExpanded && hasChildren && agent.children?.map(childId => (
            <motion.div
              key={childId}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderAgentNode(childId, level + 1)}
            </motion.div>
          ))}
        </AnimatePresence>
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
        className="relative overflow-hidden rounded-2xl"
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />

        <div className="relative p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white/95 tracking-tight">
                {agent.name}
              </h3>
              <p className={`text-sm font-medium ${getTeamBorder(agent.team).split(' ')[0]}`}>
                {agent.role}
              </p>
            </div>

            <motion.select
              whileHover={{ scale: 1.05 }}
              value={status.status}
              onChange={(e) => updateStatus(selectedAgent!, e.target.value)}
              className={`
                text-sm font-semibold px-3 py-1.5 rounded-lg
                bg-white/10 backdrop-blur-sm
                border border-white/20
                text-white/90
                hover:bg-white/15 transition-all
                cursor-pointer
              `}
            >
              <option value="idle" className="bg-slate-900">Idle</option>
              <option value="working" className="bg-slate-900">Working</option>
              <option value="done" className="bg-slate-900">Done</option>
              <option value="blocked" className="bg-slate-900">Blocked</option>
            </motion.select>
          </div>

          {/* Current Task */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-widest">
              Current Task
            </label>
            <div className="relative overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative p-3 text-sm text-white/80 leading-relaxed"
              >
                {status.currentTask}
              </motion.p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {!showMessages ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowMessages(false)}
                className={`
                  flex-1 flex items-center justify-center gap-2 px-4 py-2
                  rounded-lg font-medium text-sm
                  bg-gradient-to-r from-blue-500 to-purple-500
                  text-white
                  hover:shadow-lg hover:shadow-blue-500/25
                  transition-all
                `}
              >
                <MessageSquare size={16} />
                Manage Tasks
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowMessages(false)}
                className={`
                  flex-1 flex items-center justify-center gap-2 px-4 py-2
                  rounded-lg font-medium text-sm
                  bg-gradient-to-r from-orange-500 to-pink-500
                  text-white
                  hover:shadow-lg hover:shadow-orange-500/25
                  transition-all
                `}
              >
                <Send size={16} />
                Send Message
              </motion.button>
            )}
          </div>

          {/* Todos */}
          {!showMessages && (
            <div className="space-y-3">
              {/* Add Todo */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Add new task..."
                  className={`
                    flex-1 px-3 py-2 text-sm rounded-lg
                    bg-white/5 backdrop-blur-sm
                    border border-white/10
                    text-white/90 placeholder:text-white/30
                    focus:outline-none focus:border-white/20
                    transition-all
                  `}
                  onKeyPress={(e) => e.key === 'Enter' && addTodo(selectedAgent!)}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addTodo(selectedAgent!)}
                  className="px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-400 transition-all"
                >
                  <Plus size={18} />
                </motion.button>
              </div>

              {/* Todo List */}
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {status.todos.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-6 text-white/40 text-sm"
                  >
                    No tasks yet. Add one above!
                  </motion.div>
                ) : (
                  status.todos.map((todo, index) => (
                    <motion.div
                      key={todo.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`
                        flex items-start gap-2 p-2.5 rounded-lg
                        bg-white/5 backdrop-blur-sm
                        border border-white/10
                        hover:border-white/20 transition-all
                      `}
                    >
                      <button
                        onClick={() => toggleTodo(selectedAgent!, todo.id)}
                        className={`mt-0.5 transition-all ${
                          todo.done
                            ? 'text-emerald-400 scale-110'
                            : 'text-white/30 hover:text-white/50'
                        }`}
                      >
                        <CheckCircle2 size={18} />
                      </button>
                      <span className={`
                        flex-1 text-sm leading-relaxed
                        ${todo.done
                          ? 'line-through text-white/30'
                          : 'text-white/90'
                        }
                      `}>
                        {todo.text}
                      </span>
                      <button
                        onClick={() => deleteTodo(selectedAgent!, todo.id)}
                        className="text-white/30 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Messages */}
          {showMessages && (
            <div className="space-y-3">
              {/* Message List */}
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {messages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-6 text-white/40 text-sm"
                  >
                    No messages yet. Start a conversation!
                  </motion.div>
                ) : (
                  messages.map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`
                        p-3 rounded-lg
                        ${msg.from === selectedAgent
                          ? 'bg-blue-500/10 border-l-2 border-l-blue-400'
                          : 'bg-white/5 border-l-2 border-l-white/20'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2 text-[10px] text-white/40 mb-1.5">
                        <span className="font-semibold text-white/60">
                          {agents?.[msg.from]?.name || msg.from}
                        </span>
                        <span>→</span>
                        <span className="font-semibold text-white/60">
                          {agents?.[msg.to]?.name || msg.to}
                        </span>
                        <span className="ml-auto">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-white/80 leading-relaxed">
                        {msg.message}
                      </p>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Send Message */}
              <div className="flex gap-2">
                <select
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  className={`
                    px-3 py-2 text-sm rounded-lg
                    bg-white/5 backdrop-blur-sm
                    border border-white/10
                    text-white/90
                    focus:outline-none focus:border-white/20
                  `}
                >
                  <option value="" className="bg-slate-900">Select agent...</option>
                  {agents && Object.entries(agents)
                    .filter(([id]) => id !== selectedAgent)
                    .map(([id, agent]) => (
                      <option key={id} value={id} className="bg-slate-900">
                        {agent.name}
                      </option>
                    ))}
                </select>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type message..."
                  className={`
                    flex-1 px-3 py-2 text-sm rounded-lg
                    bg-white/5 backdrop-blur-sm
                    border border-white/10
                    text-white/90 placeholder:text-white/30
                    focus:outline-none focus:border-white/20
                  `}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage(selectedAgent!, newTodo)}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => sendMessage(selectedAgent!, newTodo)}
                  disabled={!newTodo || !newMessage}
                  className="px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send size={18} />
                </motion.button>
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
        Loading agents...
      </div>
    )
  }

  // Filter agents by team
  const filteredAgents = selectedTeam === 'all'
    ? agents
    : Object.entries(agents || {})
        .filter(([_, agent]) => agent.team === selectedTeam)
        .reduce((acc, [id, agent]) => ({ ...acc, [id]: agent }), {})

  // Only render top-level managers to avoid duplicates
  // When showing all teams, show main's children (managers)
  // When showing specific team, show only the manager of that team
  const topLevelAgents = selectedTeam === 'all'
    ? (agents?.main?.children || [])  // software-dev, analysis, marketing
    : Object.keys(filteredAgents).filter(id => {
        // Find the manager for this team
        const agent = agents?.[id]
        return agent?.role === 'Manager'
      })

  // Calculate team stats
  const teamStats = {
    dev: Object.values(agents || {}).filter(a => a.team === 'dev').length,
    analysis: Object.values(agents || {}).filter(a => a.team === 'analysis').length,
    marketing: Object.values(agents || {}).filter(a => a.team === 'marketing').length,
  }

  return (
    <div className="space-y-4" key="agents-view">
      {/* Header */}
      <div className="border p-4 bg-zinc-800/50">
        <h2 className="text-lg font-semibold tracking-[0.14em] border-l-2 border-zinc-300 pl-3 mb-1">
          AGENT HIERARCHY
        </h2>
        <p className="text-xs tracking-[0.12em] text-zinc-400">
          17 AGENTS ACROSS 3 TEAMS
        </p>
      </div>

      {/* Team Filter */}
      <div className="flex gap-2 flex-wrap">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedTeam('all')}
          className={`
            px-4 py-2 rounded-lg font-medium text-sm transition-all
            ${selectedTeam === 'all'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
              : 'bg-zinc-700/50 text-zinc-400 hover:bg-zinc-600/50'
            }
          `}
        >
          All Teams
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedTeam('dev')}
          className={`
            px-4 py-2 rounded-lg font-medium text-sm transition-all
            ${selectedTeam === 'dev'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
              : 'bg-zinc-700/50 text-zinc-400 hover:bg-zinc-600/50'
            }
          `}
        >
          Software Dev ({teamStats.dev})
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedTeam('analysis')}
          className={`
            px-4 py-2 rounded-lg font-medium text-sm transition-all
            ${selectedTeam === 'analysis'
              ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white'
              : 'bg-zinc-700/50 text-zinc-400 hover:bg-zinc-600/50'
            }
          `}
        >
          Analysis ({teamStats.analysis})
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedTeam('marketing')}
          className={`
            px-4 py-2 rounded-lg font-medium text-sm transition-all
            ${selectedTeam === 'marketing'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
              : 'bg-zinc-700/50 text-zinc-400 hover:bg-zinc-600/50'
            }
          `}
        >
          Marketing ({teamStats.marketing})
        </motion.button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Agent List */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10">
            <div className="relative p-4 space-y-2">
              {topLevelAgents.map(id => renderAgentNode(id, 0))}
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

        {/* Right: Agent Details */}
        <div className="space-y-4">
          {selectedAgent ? (
            renderAgentDetails()
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center py-10"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center mb-4"
              >
                <Users className="text-white/50" size={32} />
              </motion.div>
              <p className="text-lg font-semibold text-zinc-300 mb-2">
                Select an Agent
              </p>
              <p className="text-sm text-zinc-500 max-w-xs">
                Click on an agent to view details, manage tasks, and send messages
              </p>
            </motion.div>
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
    </div>
  )
}
