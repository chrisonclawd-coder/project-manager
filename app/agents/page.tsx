'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronRight, Activity, CheckCircle, Circle } from 'lucide-react'

interface Agent {
  id: string
  name: string
  role: string
  model: string
  workspace: string
  team?: string
  children?: string[]
}

interface AgentsData {
  [key: string]: Agent
}

export default function AgentHierarchy() {
  const [agents, setAgents] = useState<AgentsData | null>(null)
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['main']))

  useEffect(() => {
    fetch('/api/agents')
      .then(res => res.json())
      .then(data => setAgents(data))
      .catch(console.error)
  }, [])

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expanded)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpanded(newExpanded)
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

  const renderAgentNode = (id: string, level: number = 0): JSX.Element => {
    const agent = agents?.[id]
    if (!agent) return <></>

    const isExpanded = expanded.has(id)
    const hasChildren = agent.children && agent.children.length > 0

    return (
      <div key={id} className="space-y-1">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`flex items-start gap-2 p-2 border hover:border-zinc-600 transition-colors ${getTeamBg(agent.team)}`}
          style={{ marginLeft: `${level * 16}px` }}
        >
          <button
            onClick={() => toggleExpand(id)}
            className={`mt-1 ${hasChildren ? 'cursor-pointer' : 'invisible'}`}
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-2`}>
                <span className={`text-sm font-semibold ${getTeamColor(agent.team)}`}>
                  {agent.role === 'CEO' ? '🎯' : ''}
                </span>
                <span className="text-sm font-semibold text-zinc-100">{agent.name}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 border uppercase tracking-wider ${
                agent.role === 'CEO' ? 'text-amber-400 border-amber-400' :
                agent.role === 'Manager' ? 'text-sky-400 border-sky-400' :
                'text-zinc-400 border-zinc-500'
              }`}>
                {agent.role}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-[11px] text-zinc-400">
              <span className="truncate max-w-[200px]">{agent.model}</span>
              <span className="text-zinc-500">|</span>
              <span className="truncate max-w-[150px]">{agent.workspace.replace('~/.openclaw/workspace/', '')}</span>
            </div>
          </div>

          {hasChildren && (
            <div className="text-[11px] text-zinc-500">
              {agent.children?.length} {agent.children?.length === 1 ? 'agent' : 'agents'}
            </div>
          )}
        </motion.div>

        {isExpanded && hasChildren && agent.children?.map(childId => (
          <div key={childId}>{renderAgentNode(childId, level + 1)}</div>
        ))}
      </div>
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
        <h3 className="text-sm font-semibold mb-3 text-zinc-300">TEAM LEGEND</h3>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-xs text-zinc-400">Software Dev</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-xs text-zinc-400">Analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-xs text-zinc-400">Marketing</span>
          </div>
        </div>
      </div>
    </div>
  )
}
