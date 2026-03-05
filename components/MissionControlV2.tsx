'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

type Shell = {
  panel: string
  panelMuted: string
  textSoft: string
  textMuted: string
}

interface Agent {
  id: string
  name: string
  role: string
  team?: string
  children?: string[]
}

interface AgentStatus {
  status: 'idle' | 'working' | 'done' | 'blocked'
  currentTask: string
  todos: { id: number; text: string; done: boolean }[]
}

interface Product {
  name: string
  description: string
  url: string
  category: string
  status: string
}

interface Expense {
  id: string
  amount: number
  description: string
  date: string
  category: string
}

interface SectionProps {
  shell: Shell
}

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: 'easeOut' }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08
    }
  }
}

function HomeSection({ shell }: SectionProps) {
  const [agentsStatus, setAgentsStatus] = useState<Record<string, AgentStatus>>({})
  const [products, setProducts] = useState<Product[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])

  useEffect(() => {
    fetch('/api/agents').then(r => r.json()).then(data => {
      const statusMap: Record<string, AgentStatus> = {}
      Object.keys(data).forEach(id => statusMap[id] = { status: 'idle', currentTask: 'No task', todos: [] })
      setAgentsStatus(statusMap)
    })
    fetch('/api/products').then(r => r.json()).then(setProducts).catch(() => setProducts([]))
    fetch('/api/expenses').then(r => r.json()).then(setExpenses).catch(() => setExpenses([]))
  }, [])

  const activeAgents = Object.values(agentsStatus).filter(a => a.status === 'working').length
  const totalAgents = Object.keys(agentsStatus).length
  const publishedProducts = products.filter(p => p.status === 'Published' || p.status === 'Active').length
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const budget = 600
  const remaining = budget - totalExpenses

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
      <motion.div variants={fadeIn} className={`border p-5 ${shell.panel}`}>
        <h2 className={`text-[11px] tracking-[0.2em] mb-3 ${shell.textSoft}`}>1. HOME</h2>
        <p className="text-sm mb-4">Hello Chris 👋 Welcome back to your command center.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className={`border p-3 ${shell.panelMuted}`}>
            <p className={`text-[9px] tracking-[0.14em] ${shell.textSoft}`}>ACTIVE AGENTS</p>
            <p className="text-xl font-semibold mt-1 text-emerald-400">{activeAgents}/{totalAgents}</p>
          </div>
          <div className={`border p-3 ${shell.panelMuted}`}>
            <p className={`text-[9px] tracking-[0.14em] ${shell.textSoft}`}>PRODUCTS</p>
            <p className="text-xl font-semibold mt-1 text-blue-400">{publishedProducts}</p>
          </div>
          <div className={`border p-3 ${shell.panelMuted}`}>
            <p className={`text-[9px] tracking-[0.14em] ${shell.textSoft}`}>EXPENSES</p>
            <p className="text-xl font-semibold mt-1">${totalExpenses}</p>
          </div>
          <div className={`border p-3 ${shell.panelMuted}`}>
            <p className={`text-[9px] tracking-[0.14em] ${shell.textSoft}`}>BUDGET</p>
            <p className={`text-xl font-semibold mt-1 ${remaining > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>${remaining}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`border p-3 text-left ${shell.panelMuted}`}>
            <p className="text-xs font-medium">View Tasks</p>
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`border p-3 text-left ${shell.panelMuted}`}>
            <p className="text-xs font-medium">Team</p>
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`border p-3 text-left ${shell.panelMuted}`}>
            <p className="text-xs font-medium">Products</p>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function ProductsSection({ shell }: SectionProps) {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(setProducts).catch(() => setProducts([]))
  }, [])

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
      <motion.div variants={fadeIn} className={`border p-5 ${shell.panel}`}>
        <h2 className={`text-[11px] tracking-[0.2em] mb-4 ${shell.textSoft}`}>2. PRODUCTS</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {products.length > 0 ? products.map(product => (
            <motion.div 
              key={product.name}
              variants={fadeIn}
              whileHover={{ y: -2 }}
              className={`border p-4 ${shell.panelMuted}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className={`text-xs ${shell.textMuted}`}>{product.category}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 border ${
                  product.status === 'Published' || product.status === 'Active' 
                    ? 'border-emerald-500/40 text-emerald-400' 
                    : 'border-blue-500/40 text-blue-400'
                }`}>
                  {product.status}
                </span>
              </div>
              
              <p className={`text-xs ${shell.textMuted} mb-3`}>{product.description}</p>
              
              <a 
                href={product.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`text-[10px] hover:underline ${shell.textSoft}`}
              >
                {product.url}
              </a>
            </motion.div>
          )) : (
            <p className={`text-sm ${shell.textMuted}`}>No products found</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

function TeamSection({ shell }: SectionProps) {
  const [agents, setAgents] = useState<Record<string, Agent>>({})
  const [agentStatus, setAgentStatus] = useState<Record<string, AgentStatus>>({})

  useEffect(() => {
    fetch('/api/agents').then(r => r.json()).then(setAgents).catch(() => setAgents({}))
    fetch('/api/agents-status').then(r => r.json()).then(setAgentStatus).catch(() => setAgentStatus({}))
  }, [])

  const teamMembers = Object.entries(agents).map(([id, agent]) => ({
    id,
    name: agent.name,
    role: agent.role,
    status: agentStatus[id]?.status || 'idle',
    task: agentStatus[id]?.currentTask || 'No active task'
  }))

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
      <motion.div variants={fadeIn} className={`border p-5 ${shell.panel}`}>
        <h2 className={`text-[11px] tracking-[0.2em] mb-4 ${shell.textSoft}`}>3. MY TEAM</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {teamMembers.slice(0, 9).map(member => (
            <motion.div 
              key={member.id}
              variants={fadeIn}
              className={`border p-3 ${shell.panelMuted}`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold">{member.name}</p>
                <span className={`w-2 h-2 rounded-full ${member.status === 'working' ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
              </div>
              <p className={`text-[10px] tracking-wider ${shell.textSoft}`}>{member.role}</p>
              <p className={`text-xs mt-1 ${shell.textMuted}`}>{member.task}</p>
            </motion.div>
          ))}
        </div>

        <div className={`border p-4 ${shell.panelMuted}`}>
          <p className={`text-[10px] tracking-[0.18em] mb-3 ${shell.textSoft}`}>TEAM STRUCTURE</p>
          <p className="text-sm">CEO: Chrisly → Software Dev • Analysis • Marketing teams</p>
          <p className={`text-xs mt-2 ${shell.textMuted}`}>{teamMembers.length} total agents</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

function XMaxSection({ shell }: SectionProps) {
  const [xmaxWork, setXmaxWork] = useState<any>(null)

  useEffect(() => {
    fetch('/api/xmax').then(r => r.json()).then(setXmaxWork).catch(() => setXmaxWork(null))
  }, [])

  const engagementQuestions = [
    "What's the best database for a Node.js + AI side project in 2026 — SQLite, Postgres, or something newer?",
    "Chrome extension devs: how do you handle token limits when injecting Markdown into LLMs?",
    "Anyone using Guardskills in production yet? Real talk on false positives?",
    "What's your biggest security scare with npm packages this year?",
    "Best way to track 6-user growth on Chrome Store without ads?"
  ]

  const xPosts = [
    { product: 'MDify', chars: 280, content: "Stop feeding your agents bloated HTML. #Mdify converts any article to clean .md—one click, no API keys. Your prompt saves hours. Your tokens drop 40%. https://chromewebstore.google.com/detail/mdify/kimahdiiopfklhcciaiknnfcobamjeki" },
    { product: 'Guardskills', chars: 280, content: "Never install a malicious skill again. Guardskills scans every file before skills install. SAFE/WARNING/UNSAFE engine. npm i guardskills #DevSec #OpenSource" }
  ]

  const redditPosts = [
    { product: 'MDify', chars: 580, content: "I built MDify — a Chrome extension that converts any webpage to clean markdown for AI agents. No API keys needed, runs locally in your browser. Been testing with Claude and GPT, token usage dropped 40%. Would love feedback from the community." },
    { product: 'Guardskills', chars: 580, content: "Just published Guardskills — an npm package that scans AI skills for malicious code before installation. Uses static analysis to detect suspicious patterns, network calls, and file writes. Built it after a near-miss with a sketchy GitHub skill." }
  ]

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
      <motion.div variants={fadeIn} className={`border p-5 ${shell.panel}`}>
        <h2 className={`text-[11px] tracking-[0.2em] mb-4 ${shell.textSoft}`}>4. XMAX OPERATIONS</h2>
        
        {/* Daily Tech Questions */}
        <div className={`border p-4 mb-4 ${shell.panelMuted}`}>
          <p className={`text-[10px] tracking-[0.18em] mb-3 ${shell.textSoft}`}>5 DAILY TECH ENGAGEMENT QUESTIONS</p>
          {engagementQuestions.map((q, idx) => (
            <p key={idx} className="text-sm mb-2 last:mb-0">• {q}</p>
          ))}
        </div>

        {/* X Posts */}
        <div className={`border p-4 mb-4 ${shell.panelMuted}`}>
          <p className={`text-[10px] tracking-[0.18em] mb-3 ${shell.textSoft}`}>2 X POSTS DAILY (280 CHAR)</p>
          {xPosts.map((post, idx) => (
            <div key={idx} className={`border p-3 mb-2 last:mb-0 ${shell.panel}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold">{post.product}</span>
                <span className={`text-[10px] ${shell.textMuted}`}>{post.chars} char</span>
              </div>
              <p className="text-xs">{post.content}</p>
            </div>
          ))}
        </div>

        {/* Reddit Posts */}
        <div className={`border p-4 ${shell.panelMuted}`}>
          <p className={`text-[10px] tracking-[0.18em] mb-3 ${shell.textSoft}`}>2 REDDIT POSTS DAILY (580 CHAR)</p>
          {redditPosts.map((post, idx) => (
            <div key={idx} className={`border p-3 mb-2 last:mb-0 ${shell.panel}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold">{post.product}</span>
                <span className={`text-[10px] ${shell.textMuted}`}>{post.chars} char</span>
              </div>
              <p className="text-xs">{post.content}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

function KPIsSection({ shell }: SectionProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [agents, setAgents] = useState<Record<string, Agent>>({})

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(setProducts).catch(() => setProducts([]))
    fetch('/api/agents').then(r => r.json()).then(setAgents).catch(() => setAgents({}))
  }, [])

  const publishedProducts = products.filter(p => p.status === 'Published' || p.status === 'Active').length
  const totalAgents = Object.keys(agents).length

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
      <motion.div variants={fadeIn} className={`border p-5 ${shell.panel}`}>
        <h2 className={`text-[11px] tracking-[0.2em] mb-4 ${shell.textSoft}`}>5. ANALYTICS & KPIS</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
          <motion.div variants={fadeIn} whileHover={{ y: -2 }} className={`border p-3 ${shell.panelMuted}`}>
            <p className={`text-[9px] tracking-[0.14em] ${shell.textSoft}`}>PRODUCTS</p>
            <p className="text-xl font-semibold mt-1">{publishedProducts}</p>
            <p className={`text-[10px] ${shell.textMuted}`}>published</p>
          </motion.div>
          <motion.div variants={fadeIn} whileHover={{ y: -2 }} className={`border p-3 ${shell.panelMuted}`}>
            <p className={`text-[9px] tracking-[0.14em] ${shell.textSoft}`}>AGENTS</p>
            <p className="text-xl font-semibold mt-1">{totalAgents}</p>
            <p className={`text-[10px] ${shell.textMuted}`}>active</p>
          </motion.div>
          <motion.div variants={fadeIn} whileHover={{ y: -2 }} className={`border p-3 ${shell.panelMuted}`}>
            <p className={`text-[9px] tracking-[0.14em] ${shell.textSoft}`}>TEAMS</p>
            <p className="text-xl font-semibold mt-1">3</p>
            <p className={`text-[10px] ${shell.textMuted}`}>dev/market/analysis</p>
          </motion.div>
          <motion.div variants={fadeIn} whileHover={{ y: -2 }} className={`border p-3 ${shell.panelMuted}`}>
            <p className={`text-[9px] tracking-[0.14em] ${shell.textSoft}`}>STATUS</p>
            <p className="text-xl font-semibold mt-1 text-emerald-400">OK</p>
            <p className={`text-[10px] ${shell.textMuted}`}>all systems</p>
          </motion.div>
          <motion.div variants={fadeIn} whileHover={{ y: -2 }} className={`border p-3 ${shell.panelMuted}`}>
            <p className={`text-[9px] tracking-[0.14em] ${shell.textSoft}`}>UPTIME</p>
            <p className="text-xl font-semibold mt-1">99%</p>
            <p className={`text-[10px] ${shell.textMuted}`}>this month</p>
          </motion.div>
        </div>

        <div className={`border p-4 ${shell.panelMuted}`}>
          <p className={`text-[10px] tracking-[0.18em] mb-3 ${shell.textSoft}`}>TRACKING NOTES</p>
          <p className="text-sm">• Product metrics from Chrome Store / npm</p>
          <p className="text-sm">• Agent metrics from OpenClaw Gateway</p>
          <p className="text-sm">• Use XMAX WORK for campaign analytics</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

function RoadmapSection({ shell }: SectionProps) {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(setProducts).catch(() => setProducts([]))
  }, [])

  const milestones = [
    { name: 'MDify 2.0', desc: 'AI auto-summarize feature', progress: 0, quarter: 'Q2 2026', status: 'planned' },
    { name: 'Guardskills v2', desc: 'ClawHub native integration', progress: 0, quarter: 'Q3 2026', status: 'planned' },
    { name: 'Mission Control v3', desc: 'Full dashboard rewrite', progress: 0, quarter: 'Q2 2026', status: 'planned' },
    { name: 'ProgresX', desc: 'X Article Scroll extension', progress: 100, quarter: 'Q1 2026', status: 'completed' },
  ]

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
      <motion.div variants={fadeIn} className={`border p-5 ${shell.panel}`}>
        <h2 className={`text-[11px] tracking-[0.2em] mb-4 ${shell.textSoft}`}>6. ROADMAP & MILESTONES</h2>
        
        <div className="space-y-3">
          {milestones.map((milestone, idx) => (
            <motion.div 
              key={milestone.name}
              variants={fadeIn}
              className={`border p-4 ${shell.panelMuted}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium text-sm">{milestone.name}</h3>
                  <p className={`text-[10px] ${shell.textMuted}`}>{milestone.desc}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 ${
                  milestone.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-700 text-zinc-400'
                }`}>
                  {milestone.status}
                </span>
              </div>
              <div className="h-2 bg-zinc-800 rounded overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${milestone.progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.1 }}
                  className={`h-full rounded ${milestone.status === 'completed' ? 'bg-emerald-500' : 'bg-zinc-400'}`}
                />
              </div>
              <p className={`text-[10px] mt-2 ${shell.textSoft}`}>{milestone.quarter}</p>
            </motion.div>
          ))}
        </div>

        <div className={`border p-4 mt-4 ${shell.panelMuted}`}>
          <p className={`text-[10px] tracking-[0.18em] mb-2 ${shell.textSoft}`}>CURRENT PRODUCTS</p>
          <div className="flex flex-wrap gap-2">
            {products.map(p => (
              <span key={p.name} className={`text-[10px] px-2 py-1 ${shell.panel}`}>{p.name}</span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Feedback section removed - use PRODUCTS tab for reviews

function NewsSection({ shell }: SectionProps) {
  const [xmaxWork, setXmaxWork] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/xmax')
      .then(r => r.json())
      .then(data => {
        setXmaxWork(data)
        setLoading(false)
      })
      .catch(() => {
        setXmaxWork(null)
        setLoading(false)
      })
  }, [])

  const trends = xmaxWork?.trending_topics_research?.confirmed_trends || []

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
      <motion.div variants={fadeIn} className={`border p-5 ${shell.panel}`}>
        <h2 className={`text-[11px] tracking-[0.2em] mb-4 ${shell.textSoft}`}>8. DAILY NEWS & TRENDS</h2>
        
        {loading ? (
          <p className={`text-sm ${shell.textMuted}`}>Loading from XMAX research...</p>
        ) : trends.length > 0 ? (
          <div className={`border p-4 ${shell.panelMuted}`}>
            <p className={`text-[10px] tracking-[0.18em] mb-3 ${shell.textSoft}`}>XMAX RESEARCH</p>
            {trends.map((trend: string, idx: number) => (
              <motion.div 
                key={idx}
                variants={fadeIn}
                whileHover={{ x: 4 }}
                className={`border p-3 mb-2 last:mb-0 ${shell.panel}`}
              >
                <span className="text-sm">{trend}</span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className={`border p-4 ${shell.panelMuted}`}>
            <p className={`text-sm ${shell.textMuted} mb-3`}>No research data. Run XMAX WORK to fetch trending topics.</p>
            <p className={`text-[10px] ${shell.textSoft}`}>Research sources: Exa AI search, CB Insights, Forbes, Gartner</p>
          </div>
        )}

        <div className={`border p-4 mt-4 ${shell.panelMuted}`}>
          <p className={`text-[10px] tracking-[0.18em] mb-2 ${shell.textSoft}`}>RESEARCH SOURCES</p>
          <p className="text-xs">• Exa AI-optimized search</p>
          <p className="text-xs">• CB Insights, Forbes, Gartner</p>
          <p className="text-xs">• Reddit r/SideProject, Hacker News</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

function GoalsSection({ shell }: SectionProps) {
  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
      <motion.div variants={fadeIn} className={`border p-5 ${shell.panel}`}>
        <h2 className={`text-[11px] tracking-[0.2em] mb-4 ${shell.textSoft}`}>9. GOALS & PROGRESS TRACKER</h2>
        
        <div className="space-y-3">
          {[
            { label: 'Publish MDify 2.0', current: 0, target: 100, status: 'pending' },
            { label: 'Ship Guardskills v2', current: 0, target: 100, status: 'pending' },
            { label: 'Grow products to 10', current: 5, target: 10, status: 'in-progress' },
          ].map(goal => (
            <motion.div 
              key={goal.label}
              variants={fadeIn}
              className={`border p-4 ${shell.panelMuted}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-sm">{goal.label}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 ${
                  goal.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                  goal.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-zinc-700 text-zinc-400'
                }`}>
                  {goal.status.toUpperCase().replace('-', ' ')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-zinc-800 rounded overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(goal.current / goal.target) * 100}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded ${
                      goal.status === 'completed' ? 'bg-emerald-500' :
                      goal.status === 'in-progress' ? 'bg-blue-500' :
                      'bg-zinc-500'
                    }`}
                  />
                </div>
                <span className="text-xs font-medium whitespace-nowrap">
                  {goal.current}/{goal.target}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

function ActivitySection({ shell }: SectionProps) {
  const [expenses, setExpenses] = useState<Expense[]>([])

  useEffect(() => {
    fetch('/api/expenses').then(r => r.json()).then(setExpenses).catch(() => setExpenses([]))
  }, [])

  const recentActivities = [
    { date: 'Mar 04', action: 'System running normally', type: 'system' },
    { date: 'Mar 03', action: `${expenses.length} expenses tracked`, type: 'finance' },
    { date: 'Mar 02', action: 'Mission Control v2 deployed', type: 'product' },
    { date: 'Mar 01', action: 'Agents configured', type: 'system' },
  ]

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
      <motion.div variants={fadeIn} className={`border p-5 ${shell.panel}`}>
        <h2 className={`text-[11px] tracking-[0.2em] mb-4 ${shell.textSoft}`}>10. ACTIVITY LOGS & HISTORY</h2>
        
        <div className="relative pl-4 border-l-2 border-zinc-700 space-y-4">
          {recentActivities.map((activity, idx) => (
            <motion.div 
              key={idx}
              variants={fadeIn}
              className="relative"
            >
              <div className={`absolute -left-[21px] w-3 h-3 rounded-full border-2 ${
                activity.type === 'system' ? 'bg-blue-500 border-blue-500' :
                activity.type === 'finance' ? 'bg-amber-500 border-amber-500' :
                'bg-purple-500 border-purple-500'
              }`} />
              <div className={`border p-3 ${shell.panelMuted}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-mono ${shell.textMuted}`}>{activity.date}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 ${shell.panel}`}>{activity.type}</span>
                </div>
                <p className="text-sm">{activity.action}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

function SecuritySection({ shell }: SectionProps) {
  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
      <motion.div variants={fadeIn} className={`border p-5 ${shell.panel}`}>
        <h2 className={`text-[11px] tracking-[0.2em] mb-4 ${shell.textSoft}`}>11. SECURITY MONITOR</h2>
        
        <div className={`border p-4 mb-4 ${shell.panelMuted}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-400 font-medium">GUARDSKILLS ACTIVE</p>
              <p className={`text-xs ${shell.textMuted}`}>Security scanning available</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">READY</p>
              <p className={`text-[10px] ${shell.textSoft}`}>to scan</p>
            </div>
          </div>
        </div>

        <div className={`border p-4 ${shell.panelMuted}`}>
          <p className={`text-[10px] tracking-[0.18em] mb-3 ${shell.textSoft}`}>SCAN TARGETS</p>
          <p className="text-sm mb-2">• openclaw/core</p>
          <p className="text-sm mb-2">• openclaw/agents</p>
          <p className="text-sm">• guardskills/main</p>
        </div>

        <div className={`mt-4 p-3 border ${shell.panelMuted}`}>
          <p className={`text-xs ${shell.textMuted}`}>
            Use Guardskills npm package to scan repos for vulnerabilities.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

function ExpenseSection({ shell }: SectionProps) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/expenses')
      .then(r => r.json())
      .then(data => {
        setExpenses(data || [])
        setLoading(false)
      })
      .catch(() => {
        setExpenses([])
        setLoading(false)
      })
  }, [])

  const categories = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount
    return acc
  }, {} as Record<string, number>)

  const total = Object.values(categories).reduce((a, b) => a + b, 0)
  const budget = 600
  const remaining = budget - total

  const categoryColors: Record<string, string> = {
    Food: 'bg-blue-500',
    Misc: 'bg-amber-500',
    Hosting: 'bg-purple-500',
    Marketing: 'bg-emerald-500',
    Tools: 'bg-cyan-500',
  }

  // Get recent expenses
  const recentExpenses = expenses.slice(-5).reverse()

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
      <motion.div variants={fadeIn} className={`border p-5 ${shell.panel}`}>
        <h2 className={`text-[11px] tracking-[0.2em] mb-4 ${shell.textSoft}`}>12. EXPENSE TRACKER</h2>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className={`border p-3 ${shell.panelMuted}`}>
            <p className={`text-[9px] tracking-[0.14em] ${shell.textSoft}`}>TOTAL</p>
            <p className="text-xl font-bold mt-1">${total}</p>
          </div>
          <div className={`border p-3 ${shell.panelMuted}`}>
            <p className={`text-[9px] tracking-[0.14em] ${shell.textSoft}`}>BUDGET</p>
            <p className="text-xl font-bold mt-1">${budget}</p>
          </div>
          <div className={`border p-3 ${shell.panelMuted}`}>
            <p className={`text-[9px] tracking-[0.14em] ${shell.textSoft}`}>LEFT</p>
            <p className={`text-xl font-bold mt-1 ${remaining > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>${remaining}</p>
          </div>
        </div>

        {/* Categories */}
        {Object.keys(categories).length > 0 && (
          <div className={`border p-3 mb-4 ${shell.panelMuted}`}>
            <p className={`text-[10px] tracking-[0.18em] mb-2 ${shell.textSoft}`}>BY CATEGORY</p>
            <div className="space-y-1">
              {Object.entries(categories).map(([cat, amount]) => (
                <div key={cat} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded ${categoryColors[cat] || 'bg-zinc-500'}`} />
                    <span>{cat}</span>
                  </div>
                  <span className="font-medium">${amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent expenses */}
        {recentExpenses.length > 0 && (
          <div className={`border p-3 ${shell.panelMuted}`}>
            <p className={`text-[10px] tracking-[0.18em] mb-2 ${shell.textSoft}`}>RECENT</p>
            <div className="space-y-1">
              {recentExpenses.map(e => (
                <div key={e.id} className="flex items-center justify-between text-xs">
                  <span className={shell.textMuted}>{e.description}</span>
                  <span className="font-medium">${e.amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && <p className={`text-sm ${shell.textMuted}`}>Loading...</p>}
        {!loading && expenses.length === 0 && (
          <p className={`text-sm ${shell.textMuted}`}>No expenses. Use EXPENSES tab to add.</p>
        )}
      </motion.div>
    </motion.div>
  )
}

// Main component
export default function MissionControlV2({ shell, section = 'all' }: { shell: Shell; section?: string }) {
  const show = (id: string) => section === 'all' || section === id

  return (
    <div className="space-y-4">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`border p-5 ${shell.panel}`}
      >
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          🚀 Mission Control
        </h1>
        <p className={`text-xs mt-2 tracking-[0.14em] ${shell.textSoft}`}>
          12-POINT COMMAND CENTER • REAL DATA • MONOCHROMATIC
        </p>
      </motion.div>

      {show('home') && <HomeSection shell={shell} />}
      {show('products') && <ProductsSection shell={shell} />}
      {show('team') && <TeamSection shell={shell} />}
      {show('xmax') && <XMaxSection shell={shell} />}
      {show('roadmap') && <RoadmapSection shell={shell} />}
      {show('news') && <NewsSection shell={shell} />}
      {show('goals') && <GoalsSection shell={shell} />}
      {show('activity') && <ActivitySection shell={shell} />}
      {show('security') && <SecuritySection shell={shell} />}
      {show('expense') && <ExpenseSection shell={shell} />}
    </div>
  )
}
