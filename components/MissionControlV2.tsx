'use client'

import { motion } from 'framer-motion'

type Shell = {
  panel: string
  panelMuted: string
  textSoft: string
  textMuted: string
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

// Rich content components for each section
function HomeSection({ shell }: SectionProps) {
  const stats = [
    { label: 'Active Agents', value: '3', trend: '+1', color: 'text-emerald-400' },
    { label: 'Tasks Done', value: '47', trend: '+2', color: 'text-blue-400' },
    { label: 'This Week', value: '12h', trend: '-2h', color: 'text-amber-400' },
  ]

  const quickActions = [
    { label: 'Post to X', desc: '3 campaigns ready', icon: '𝕏' },
    { label: 'Review PRs', desc: '2 pending review', icon: '⬡' },
    { label: 'Check Metrics', desc: 'NPM & Chrome', icon: '📊' },
  ]

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
      <motion.div variants={fadeIn} className={`border p-5 ${shell.panel}`}>
        <h2 className={`text-[11px] tracking-[0.2em] mb-3 ${shell.textSoft}`}>1. HOME</h2>
        <p className="text-sm mb-4">Hello Chris 👋 Welcome back to your command center. You're running strong.</p>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          {stats.map(stat => (
            <div key={stat.label} className={`border p-3 ${shell.panelMuted}`}>
              <p className={`text-[9px] tracking-[0.14em] ${shell.textSoft}`}>{stat.label}</p>
              <p className={`text-xl font-semibold mt-1 ${stat.color}`}>{stat.value}</p>
              <p className={`text-[10px] ${shell.textMuted}`}>{stat.trend}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {quickActions.map(action => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`border p-3 text-left ${shell.panelMuted} hover:border-zinc-500 transition-colors`}
            >
              <p className="text-lg mb-1">{action.icon}</p>
              <p className="text-xs font-medium">{action.label}</p>
              <p className={`text-[10px] ${shell.textMuted}`}>{action.desc}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

function ProductsSection({ shell }: SectionProps) {
  const products = [
    { 
      name: 'MDify', 
      type: 'Chrome Extension',
      version: '1.0.4',
      users: 6,
      rating: 'New',
      status: 'Live',
      metrics: { installs: 6, active: 6 }
    },
    { 
      name: 'Guardskills', 
      type: 'NPM Package', 
      version: '1.2.1',
      users: '∞',
      rating: 'Production',
      status: 'Stable',
      metrics: { downloads: '1.2K', weekly: 89 }
    },
  ]

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
      <motion.div variants={fadeIn} className={`border p-5 ${shell.panel}`}>
        <h2 className={`text-[11px] tracking-[0.2em] mb-4 ${shell.textSoft}`}>2. PRODUCTS</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {products.map(product => (
            <motion.div 
              key={product.name}
              variants={fadeIn}
              whileHover={{ y: -2 }}
              className={`border p-4 ${shell.panelMuted}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className={`text-xs ${shell.textMuted}`}>{product.type}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 border ${product.status === 'Live' ? 'border-emerald-500/40 text-emerald-400' : 'border-blue-500/40 text-blue-400'}`}>
                  {product.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className={`border p-2 ${shell.panel}`}>
                  <p className={`text-[9px] tracking-[0.14em] ${shell.textSoft}`}>VERSION</p>
                  <p className="font-medium mt-1">v{product.version}</p>
                </div>
                <div className={`border p-2 ${shell.panel}`}>
                  <p className={`text-[9px] tracking-[0.14em] ${shell.textSoft}`}>
                    {product.type === 'Chrome Extension' ? 'USERS' : 'WEEKLY DL'}
                  </p>
                  <p className="font-medium mt-1">{product.metrics.weekly || product.metrics.installs}</p>
                </div>
              </div>

              <div className={`mt-3 pt-3 border-t ${shell.panelMuted}`}>
                <p className={`text-[10px] ${shell.textMuted}`}>
                  {product.type === 'Chrome Extension' 
                    ? `${product.metrics.active} active users • Review threshold reached`
                    : `${product.metrics.downloads} total downloads • Production ready`
                  }
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

function TeamSection({ shell }: SectionProps) {
  const team = [
    { role: 'CEO', name: 'Chrisly', status: 'Active', task: 'Strategic planning' },
    { role: 'Architect', name: 'OpenClaw', status: 'Active', task: 'System design' },
    { role: 'Developer', name: 'Claude Code', status: 'Active', task: 'Feature implementation' },
    { role: 'QA', name: 'Test Agent', status: 'Idle', task: 'Regression testing' },
    { role: 'DevOps', name: 'CI/CD', status: 'Active', task: 'Deployment pipeline' },
  ]

  const activeTasks = [
    { id: '#47', name: 'MDify dark mode toggle', stage: 'QA', days: 2 },
    { id: '#48', name: 'Guardskills v2 integration', stage: 'Dev', days: 1 },
  ]

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
      <motion.div variants={fadeIn} className={`border p-5 ${shell.panel}`}>
        <h2 className={`text-[11px] tracking-[0.2em] mb-4 ${shell.textSoft}`}>3. MY TEAM</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {team.map(member => (
            <motion.div 
              key={member.role}
              variants={fadeIn}
              className={`border p-3 ${shell.panelMuted}`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold">{member.name}</p>
                <span className={`w-2 h-2 rounded-full ${member.status === 'Active' ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
              </div>
              <p className={`text-[10px] tracking-wider ${shell.textSoft}`}>{member.role}</p>
              <p className={`text-xs mt-1 ${shell.textMuted}`}>{member.task}</p>
            </motion.div>
          ))}
        </div>

        <div className={`border p-4 ${shell.panelMuted}`}>
          <p className={`text-[10px] tracking-[0.18em] mb-3 ${shell.textSoft}`}>ACTIVE WORKFLOW</p>
          {activeTasks.map(task => (
            <div key={task.id} className={`flex items-center justify-between py-2 border-b last:border-0 ${shell.panel}`}>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-blue-400">{task.id}</span>
                <span className="text-sm">{task.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] px-2 py-1 border ${shell.panelMuted}`}>{task.stage}</span>
                <span className={`text-[10px] ${shell.textMuted}`}>{task.days}d</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

function XGrowthSection({ shell }: SectionProps) {
  const campaigns = [
    { platform: 'X', pending: 3, ready: true },
    { platform: 'Reddit', pending: 3, ready: true },
    { platform: 'LinkedIn', pending: 0, ready: false },
  ]

  const tips = [
    'Post during US morning (9-11 AM EST)',
    'Quote tweet popular AI accounts',
    'Include one visual per 3 text posts',
  ]

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
      <motion.div variants={fadeIn} className={`border p-5 ${shell.panel}`}>
        <h2 className={`text-[11px] tracking-[0.2em] mb-4 ${shell.textSoft}`}>4. X GROWTH</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {campaigns.map(campaign => (
            <motion.div 
              key={campaign.platform}
              variants={fadeIn}
              className={`border p-4 ${shell.panelMuted}`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold">{campaign.platform}</p>
                <span className={`text-[10px] px-2 py-1 ${campaign.ready ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-700 text-zinc-400'}`}>
                  {campaign.ready ? 'READY' : 'PENDING'}
                </span>
              </div>
              <p className={`text-2xl font-bold ${shell.textMuted}`}>{campaign.pending} posts</p>
            </motion.div>
          ))}
        </div>

        <div className={`border p-4 ${shell.panelMuted}`}>
          <p className={`text-[10px] tracking-[0.18em] mb-3 ${shell.textSoft}`}>GROWTH TIPS</p>
          {tips.map((tip, i) => (
            <p key={i} className="text-sm mb-2 last:mb-0">• {tip}</p>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

function KPIsSection({ shell }: SectionProps) {
  const metrics = [
    { label: 'MDify Users', value: 6, change: '+6', target: 100 },
    { label: 'Guardskills DL', value: '1.2K', change: '+89', target: '10K' },
    { label: 'X Followers', value: 12, change: '+12', target: 500 },
    { label: 'Cycle Time', value: '4.2d', change: '-0.5d', target: '3d' },
    { label: 'Burn Rate', value: '$487', change: '+$42', target: '$600' },
  ]

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
      <motion.div variants={fadeIn} className={`border p-5 ${shell.panel}`}>
        <h2 className={`text-[11px] tracking-[0.2em] mb-4 ${shell.textSoft}`}>5. ANALYTICS & KPIS</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
          {metrics.map(metric => (
            <motion.div 
              key={metric.label}
              variants={fadeIn}
              whileHover={{ y: -2 }}
              className={`border p-3 ${shell.panelMuted}`}
            >
              <p className={`text-[9px] tracking-[0.14em] ${shell.textSoft}`}>{metric.label}</p>
              <p className="text-xl font-semibold mt-1">{metric.value}</p>
              <p className={`text-[10px] ${metric.change.startsWith('+') || metric.change.startsWith('-') ? 'text-emerald-400' : shell.textMuted}`}>
                {metric.change}
              </p>
            </motion.div>
          ))}
        </div>

        <div className={`border p-4 ${shell.panelMuted}`}>
          <p className={`text-[10px] tracking-[0.18em] mb-3 ${shell.textSoft}`}>PROGRESS BAR</p>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className={shell.textMuted}>MDify → 100 users</span>
                <span className={shell.textSoft}>6%</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '6%' }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-zinc-300 rounded" 
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className={shell.textMuted}>Guardskills → 10K downloads</span>
                <span className={shell.textSoft}>12%</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '12%' }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                  className="h-full bg-zinc-300 rounded" 
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function RoadmapSection({ shell }: SectionProps) {
  const milestones = [
    { name: 'MDify 2.0 (AI auto-summarize)', progress: 45, quarter: 'Q2 2026', owners: ['Developer', 'Architect'] },
    { name: 'Guardskills v2 (ClawHub native)', progress: 20, quarter: 'Q3 2026', owners: ['Architect'] },
    { name: 'First $100 MRR', progress: 0, quarter: 'Q4 2026', owners: ['CEO'] },
  ]

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
      <motion.div variants={fadeIn} className={`border p-5 ${shell.panel}`}>
        <h2 className={`text-[11px] tracking-[0.2em] mb-4 ${shell.textSoft}`}>6. ROADMAP & MILESTONES</h2>
        
        <div className="space-y-4">
          {milestones.map((milestone, idx) => (
            <motion.div 
              key={milestone.name}
              variants={fadeIn}
              className={`border p-4 ${shell.panelMuted}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-sm">{milestone.name}</h3>
                  <p className={`text-[10px] ${shell.textMuted}`}>{milestone.quarter}</p>
                </div>
                <span className={`text-xs px-2 py-1 border ${milestone.progress >= 40 ? 'border-emerald-500/40 text-emerald-400' : 'border-zinc-600'}`}>
                  {milestone.progress}%
                </span>
              </div>
              <div className="h-2 bg-zinc-800 rounded overflow-hidden mb-3">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${milestone.progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.1 }}
                  className={`h-full rounded ${milestone.progress >= 40 ? 'bg-emerald-500' : 'bg-zinc-400'}`}
                />
              </div>
              <div className="flex gap-2">
                {milestone.owners.map(owner => (
                  <span key={owner} className={`text-[10px] px-2 py-1 ${shell.panel}`}>
                    {owner}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

function FeedbackSection({ shell }: SectionProps) {
  const feedback = [
    { source: 'Chrome Review', user: '@earlyuser', text: 'This MDify extension is actually useful. Clean markdown output.', sentiment: 'positive', date: 'yesterday' },
    { source: 'NPM', user: 'dev_community', text: 'Guardskills is the security layer npm needed. Finally.', sentiment: 'positive', date: '3 days ago' },
  ]

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
      <motion.div variants={fadeIn} className={`border p-5 ${shell.panel}`}>
        <h2 className={`text-[11px] tracking-[0.2em] mb-4 ${shell.textSoft}`}>7. FEEDBACK & COMMUNITY</h2>
        
        <div className="space-y-3 mb-4">
          {feedback.map((item, idx) => (
            <motion.div 
              key={idx}
              variants={fadeIn}
              className={`border p-4 ${shell.panelMuted}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{item.user}</span>
                  <span className={`text-[10px] px-2 py-0.5 ${item.sentiment === 'positive' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {item.sentiment}
                  </span>
                </div>
                <span className={`text-[10px] ${shell.textMuted}`}>{item.date}</span>
              </div>
              <p className="text-sm">{item.text}</p>
              <p className={`text-[10px] mt-2 ${shell.textSoft}`}>via {item.source}</p>
            </motion.div>
          ))}
        </div>

        <div className={`border p-4 ${shell.panelMuted}`}>
          <p className={`text-sm ${shell.textMuted}`}>
            • 6 users, all silent = opportunity for feedback loop
          </p>
          <p className={`text-sm ${shell.textMuted}`}>
            • No negative reviews yet — maintain quality bar
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

function NewsSection({ shell }: SectionProps) {
  const news = [
    { title: 'Node.js Security Best Practices 2026', tags: ['Security', 'Node'], trend: '↑' },
    { title: 'Top 9 AI Extension Security Platforms', tags: ['Security', 'AI'], trend: '↑' },
    { title: '22 Best Chrome Extensions for Developers', tags: ['DevTools', 'Chrome'], trend: '📝' },
    { title: 'Browser security visibility gap widening', tags: ['Security', '2026'], trend: '⚠' },
    { title: 'Gemini 3.1 UI capabilities improving', tags: ['AI', 'Google'], trend: '🚀' },
  ]

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
      <motion.div variants={fadeIn} className={`border p-5 ${shell.panel}`}>
        <h2 className={`text-[11px] tracking-[0.2em] mb-4 ${shell.textSoft}`}>8. DAILY NEWS & TRENDS</h2>
        
        <div className="space-y-2">
          {news.map((item, idx) => (
            <motion.div 
              key={idx}
              variants={fadeIn}
              whileHover={{ x: 4 }}
              className={`border p-3 flex items-center justify-between ${shell.panelMuted} cursor-default`}
            >
              <div className="flex-1">
                <p className="text-sm">{item.title}</p>
                <div className="flex gap-2 mt-1">
                  {item.tags.map(tag => (
                    <span key={tag} className={`text-[10px] px-1.5 py-0.5 ${shell.panel}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-lg ml-3">{item.trend}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

function GoalsSection({ shell }: SectionProps) {
  const goals = [
    { label: 'MDify users', current: 6, target: 100, deadline: 'Apr 30', status: 'at-risk' },
    { label: 'Guardskills MRR badge', current: 70, target: 100, deadline: 'Q2', status: 'on-track' },
    { label: 'Ship weekly', current: 8, target: 8, deadline: 'Ongoing', status: 'achieved' },
  ]

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
      <motion.div variants={fadeIn} className={`border p-5 ${shell.panel}`}>
        <h2 className={`text-[11px] tracking-[0.2em] mb-4 ${shell.textSoft}`}>9. GOALS & PROGRESS TRACKER</h2>
        
        <div className="space-y-3">
          {goals.map(goal => (
            <motion.div 
              key={goal.label}
              variants={fadeIn}
              className={`border p-4 ${shell.panelMuted}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-sm">{goal.label}</p>
                  <p className={`text-[10px] ${shell.textMuted}`}>Deadline: {goal.deadline}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 ${
                  goal.status === 'achieved' ? 'bg-emerald-500/20 text-emerald-400' :
                  goal.status === 'on-track' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-amber-500/20 text-amber-400'
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
                      goal.status === 'achieved' ? 'bg-emerald-500' :
                      goal.status === 'on-track' ? 'bg-blue-500' :
                      'bg-amber-500'
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
  const activities = [
    { date: 'Mar 04', action: 'Published 3 X + 3 Reddit posts', type: 'marketing' },
    { date: 'Mar 03', action: 'Guardskills scanned 8 repos (all SAFE)', type: 'security' },
    { date: 'Mar 02', action: 'MDify updated to 1.0.3', type: 'product' },
    { date: 'Mar 01', action: 'Expense: Vercel bill $29', type: 'finance' },
    { date: 'Feb 28', action: 'Shipped Guardskills v1.2.0', type: 'product' },
  ]

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
      <motion.div variants={fadeIn} className={`border p-5 ${shell.panel}`}>
        <h2 className={`text-[11px] tracking-[0.2em] mb-4 ${shell.textSoft}`}>10. ACTIVITY LOGS & HISTORY</h2>
        
        <div className="relative pl-4 border-l-2 border-zinc-700 space-y-4">
          {activities.map((activity, idx) => (
            <motion.div 
              key={idx}
              variants={fadeIn}
              className="relative"
            >
              <div className={`absolute -left-[21px] w-3 h-3 rounded-full border-2 ${
                activity.type === 'marketing' ? 'bg-blue-500 border-blue-500' :
                activity.type === 'security' ? 'bg-emerald-500 border-emerald-500' :
                activity.type === 'product' ? 'bg-purple-500 border-purple-500' :
                'bg-amber-500 border-amber-500'
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
  const scans = [
    { repo: 'openclaw/core', status: 'clear', lastScan: '4h ago', issues: 0 },
    { repo: 'openclaw/agents', status: 'clear', lastScan: '4h ago', issues: 0 },
    { repo: 'guardskills/main', status: 'clear', lastScan: '4h ago', issues: 0 },
  ]

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
      <motion.div variants={fadeIn} className={`border p-5 ${shell.panel}`}>
        <h2 className={`text-[11px] tracking-[0.2em] mb-4 ${shell.textSoft}`}>11. SECURITY MONITOR</h2>
        
        <div className={`border p-4 mb-4 ${shell.panelMuted}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-400 font-medium">ALL CLEAR</p>
              <p className={`text-xs ${shell.textMuted}`}>Last full scan: 4 hours ago</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">3</p>
              <p className={`text-[10px] ${shell.textSoft}`}>repos protected</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {scans.map(scan => (
            <motion.div 
              key={scan.repo}
              variants={fadeIn}
              className={`border p-3 flex items-center justify-between ${shell.panelMuted}`}
            >
              <div>
                <p className="text-sm font-medium">{scan.repo}</p>
                <p className={`text-[10px] ${shell.textMuted}`}>{scan.lastScan}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-400">{scan.issues} issues</span>
                <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className={`mt-4 p-3 border ${shell.panelMuted}`}>
          <p className={`text-xs ${shell.textMuted}`}>
            Vulnerabilities blocked this month: <span className="text-emerald-400">0</span>
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

function ExpenseSection({ shell }: SectionProps) {
  const breakdown = [
    { category: 'Hosting', amount: 92, color: 'bg-blue-500' },
    { category: 'Marketing', amount: 180, color: 'bg-purple-500' },
    { category: 'Tools', amount: 65, color: 'bg-emerald-500' },
    { category: 'Misc', amount: 150, color: 'bg-amber-500' },
  ]

  const total = breakdown.reduce((sum, b) => sum + b.amount, 0)
  const budget = 600
  const remaining = budget - total

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
      <motion.div variants={fadeIn} className={`border p-5 ${shell.panel}`}>
        <h2 className={`text-[11px] tracking-[0.2em] mb-4 ${shell.textSoft}`}>12. EXPENSE TRACKER</h2>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className={`border p-3 ${shell.panelMuted}`}>
            <p className={`text-[9px] tracking-[0.14em] ${shell.textSoft}`}>TOTAL SPENT</p>
            <p className="text-xl font-bold mt-1">${total}</p>
          </div>
          <div className={`border p-3 ${shell.panelMuted}`}>
            <p className={`text-[9px] tracking-[0.14em] ${shell.textSoft}`}>BUDGET</p>
            <p className="text-xl font-bold mt-1">${budget}</p>
          </div>
          <div className={`border p-3 ${shell.panelMuted}`}>
            <p className={`text-[9px] tracking-[0.14em] ${shell.textSoft}`}>REMAINING</p>
            <p className={`text-xl font-bold mt-1 ${remaining > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>${remaining}</p>
          </div>
        </div>

        <div className={`border p-4 mb-4 ${shell.panelMuted}`}>
          <p className={`text-[10px] tracking-[0.18em] mb-3 ${shell.textSoft}`}>BREAKDOWN</p>
          <div className="space-y-2">
            {breakdown.map(item => (
              <div key={item.category} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded ${item.color}`} />
                <span className="flex-1 text-sm">{item.category}</span>
                <span className="text-sm font-medium">${item.amount}</span>
                <div className="w-20 h-1.5 bg-zinc-800 rounded overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded`} 
                    style={{ width: `${(item.amount / total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <motion.div 
          variants={fadeIn}
          className={`border p-3 ${shell.panelMuted}`}
        >
          <p className="text-amber-400 text-sm">
            ⚠️ Projection: runway limit in 9 weeks. Time to ship MDify paid tier.
          </p>
        </motion.div>
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
          12-POINT COMMAND CENTER • MONOCHROMATIC DESIGN • SMOOTH ANIMATIONS
        </p>
      </motion.div>

      {show('home') && <HomeSection shell={shell} />}
      {show('products') && <ProductsSection shell={shell} />}
      {show('team') && <TeamSection shell={shell} />}
      {show('x-growth') && <XGrowthSection shell={shell} />}
      {show('kpis') && <KPIsSection shell={shell} />}
      {show('roadmap') && <RoadmapSection shell={shell} />}
      {show('feedback') && <FeedbackSection shell={shell} />}
      {show('news') && <NewsSection shell={shell} />}
      {show('goals') && <GoalsSection shell={shell} />}
      {show('activity') && <ActivitySection shell={shell} />}
      {show('security') && <SecuritySection shell={shell} />}
      {show('expense') && <ExpenseSection shell={shell} />}
    </div>
  )
}
