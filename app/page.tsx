'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, Search, BookOpen, Twitter, Bookmark, CheckCircle, Circle, Clock, Zap, RefreshCw, Menu, X, User, Beaker, Rocket, Eye, Bot, Users, Package, Target, Home as HomeIcon, ChevronRight, Activity, AlertTriangle, PauseCircle, PlayCircle } from 'lucide-react'

// Types
type TaskStatus = 'todo' | 'in-progress' | 'done'
type TaskPriority = 'low' | 'medium' | 'high'

interface Task {
  id: number
  title: string
  status: TaskStatus
  priority: TaskPriority
}

interface BookmarkItem {
  id: number
  title: string
  url: string
  category: string
  addedAt: string
}

interface TeamMember {
  id: string
  name: string
  role: string
  icon: any
  status: 'idle' | 'working' | 'done' | 'blocked' | 'reviewing' | 'stalled' | 'active' | 'overdue'
  currentTask?: string
  project?: string
  priority?: TaskPriority
  deliverables?: string[]
  activityLog?: { time: string; action: string }[]
}

// Viral tweets
const defaultTopics = [
  { id: 1, title: 'AI Breakthroughs 2026', source: 'MIT Tech Review', tweets: [{ text: "MIT's 10 Breakthrough Technologies 2026 is out. AI agents are leading. The shift from chatbots to autonomous agents is faster than anyone predicted.", hashtags: ['AI', 'Tech'] }] },
  { id: 2, title: 'Gartner Tech Trends', source: 'Gartner', tweets: [{ text: "Gartner's Top 10 Tech Trends 2026: Agentic AI is THE trend. Not chatbots. Autonomous agents that DO work.", hashtags: ['Gartner'] }] },
  { id: 3, title: 'AI Voice Agents', source: 'RingCentral', tweets: [{ text: "AI voice agents are HERE and better than most humans at customer service. 24/7 availability, infinite scalability.", hashtags: ['AI'] }] },
  { id: 4, title: 'Hyperscale AI Data Centers', source: 'MIT Tech Review', tweets: [{ text: "AI data centers consuming insane energy. Companies solving the energy problem will dominate.", hashtags: ['AI'] }] },
  { id: 5, title: 'Intelligent Apps', source: 'Capgemini', tweets: [{ text: "Every app without AI is obsolete. Shift from 'AI features' to 'AI-native apps' is happening NOW.", hashtags: ['AI'] }] },
  { id: 6, title: 'AI Coding Trends', source: 'GitHub', tweets: [{ text: "AI coding isn't future - it's PRESENT. Companies using AI: 10x more productive.", hashtags: ['AICoding'] }] },
]

const teamMembers: TeamMember[] = [
  { id: 'manager', name: 'Chrisly', role: 'Manager', icon: Bot, status: 'idle', currentTask: '', project: 'Operations', deliverables: [], activityLog: [] },
  { id: 'xmax', name: 'xMax', role: 'X Strategy Lead', icon: Target, status: 'idle', currentTask: '', project: 'Marketing', deliverables: [], activityLog: [] },
  { id: 'developer', name: 'Developer', role: 'Developer', icon: User, status: 'idle', currentTask: '', project: 'Development', deliverables: [], activityLog: [] },
  { id: 'qa', name: 'QA', role: 'QA', icon: Beaker, status: 'idle', currentTask: '', project: 'Quality', deliverables: [], activityLog: [] },
  { id: 'devops', name: 'DevOps', role: 'DevOps', icon: Rocket, status: 'idle', currentTask: '', project: 'Infrastructure', deliverables: [], activityLog: [] },
  { id: 'tester', name: 'Tester', role: 'Manual Tester', icon: Eye, status: 'idle', currentTask: '', project: 'Testing', deliverables: [], activityLog: [] },
]

// Extended team data with activity logs
const defaultTeamData: Record<string, { name: string; status: string; currentTask: string; project: string; priority: string; deliverables: string[]; activityLog: { time: string; action: string }[] }> = {
  manager: { name: 'Chrisly', status: 'idle', currentTask: 'Oversee operations', project: 'Operations', priority: 'high', deliverables: ['Strategic decisions', 'Team coordination'], activityLog: [{ time: '08:00', action: 'Started shift' }, { time: '09:30', action: 'Reviewed priorities' }] },
  xmax: { name: 'xMax', status: 'idle', currentTask: 'X strategy planning', project: 'Marketing', priority: 'medium', deliverables: ['Campaign drafts', 'Analytics review'], activityLog: [{ time: '08:00', action: 'Started shift' }, { time: '10:00', action: 'Checked metrics' }] },
  developer: { name: 'Developer', status: 'active', currentTask: 'Implement feature modules', project: 'Development', priority: 'high', deliverables: ['Code modules', 'Documentation'], activityLog: [{ time: '08:00', action: 'Started shift' }, { time: '09:00', action: 'Code review' }, { time: '11:00', action: 'Writing tests' }] },
  qa: { name: 'QA', status: 'reviewing', currentTask: 'Test validation', project: 'Quality', priority: 'high', deliverables: ['Test reports', 'Bug reports'], activityLog: [{ time: '08:00', action: 'Started shift' }, { time: '10:30', action: 'Running tests' }] },
  devops: { name: 'DevOps', status: 'blocked', currentTask: 'Deploy pipeline', project: 'Infrastructure', priority: 'high', deliverables: ['Deployment logs', 'Config updates'], activityLog: [{ time: '08:00', action: 'Started shift' }, { time: '09:15', action: 'Awaiting credentials' }] },
  tester: { name: 'Tester', status: 'idle', currentTask: 'Manual testing', project: 'Testing', priority: 'low', deliverables: ['Test scenarios', 'UX feedback'], activityLog: [{ time: '08:00', action: 'Started shift' }] },
}

const defaultTasks: Task[] = [
  { id: 1, title: 'Complete InstaCards Chrome Extension', status: 'done', priority: 'high' },
  { id: 2, title: 'Build Mission Control Dashboard', status: 'done', priority: 'high' },
  { id: 3, title: 'Setup X Strategy automation', status: 'done', priority: 'high' },
  { id: 4, title: 'Deploy to Vercel', status: 'done', priority: 'high' },
]

const defaultBookmarks: BookmarkItem[] = [
  { id: 1, title: 'OpenClaw 50 Days Workflows', url: 'https://gist.github.com/velvet-shark/b4c6724c391f612c4de4e9a07b0a74b6', category: 'Work', addedAt: '2026-02-24' },
]

function getGreeting() {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return 'Good morning'
  if (h >= 12 && h < 17) return 'Good afternoon'
  return 'Good evening'
}

function MissionControlContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') || 'home'
  
  const [activeTab, setActiveTab] = useState(initialTab as any)
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [tasks] = useState<Task[]>(defaultTasks)
  const [bookmarks] = useState<BookmarkItem[]>(defaultBookmarks)
  const [trendingTopics] = useState(defaultTopics)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // My Team Drawer state
  const [teamDrawerOpen, setTeamDrawerOpen] = useState(false)
  const [teamFilterStatus, setTeamFilterStatus] = useState<string>('all')
  const [teamFilterProject, setTeamFilterProject] = useState<string>('all')
  const [teamFilterRole, setTeamFilterRole] = useState<string>('all')
  const [teamFilterPriority, setTeamFilterPriority] = useState<string>('all')
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [teamData, setTeamData] = useState(defaultTeamData)
  const [isLoadingTeam, setIsLoadingTeam] = useState(false)

  // Load team data from JSON file
  const loadTeamData = async () => {
    setIsLoadingTeam(true)
    try {
      const response = await fetch('/data/team-status.json')
      if (response.ok) {
        const data = await response.json()
        // Merge with default data for additional fields
        const merged: any = {}
        Object.keys(defaultTeamData).forEach(key => {
          merged[key] = {
            ...defaultTeamData[key],
            status: data[key]?.status || defaultTeamData[key].status,
            currentTask: data[key]?.currentTask || defaultTeamData[key].currentTask,
          }
        })
        setTeamData(merged)
      }
    } catch (e) {
      console.log('Using default team data')
    }
    setIsLoadingTeam(false)
  }

  useEffect(() => {
    if (teamDrawerOpen) {
      loadTeamData()
    }
  }, [teamDrawerOpen])

  // Calculate team stats
  const teamStats = {
    total: Object.keys(teamData).length,
    active: Object.values(teamData).filter(t => t.status === 'active' || t.status === 'working').length,
    blocked: Object.values(teamData).filter(t => t.status === 'blocked').length,
    reviewing: Object.values(teamData).filter(t => t.status === 'reviewing').length,
    idle: Object.values(teamData).filter(t => t.status === 'idle').length,
    overdue: Object.values(teamData).filter(t => t.status === 'overdue').length,
    stalled: Object.values(teamData).filter(t => t.status === 'stalled').length,
  }

  // Filter team members
  const filteredTeam = Object.entries(teamData).filter(([_, member]) => {
    if (teamFilterStatus !== 'all' && member.status !== teamFilterStatus) return false
    if (teamFilterProject !== 'all' && member.project !== teamFilterProject) return false
    if (teamFilterRole !== 'all') {
      const memberInfo = teamMembers.find(m => m.name === member.name)
      if (!memberInfo || memberInfo.role !== teamFilterRole) return false
    }
    if (teamFilterPriority !== 'all' && member.priority !== teamFilterPriority) return false
    return true
  })

  // Get unique values for filters
  const projects = Array.from(new Set(Object.values(teamData).map(t => t.project)))
  const roles = Array.from(new Set(teamMembers.map(t => t.role)))
  const priorities = ['low', 'medium', 'high']

  const menuItems = [
    { id: 'home', label: 'HOME', icon: HomeIcon },
    { id: 'projects', label: 'PROJECTS', icon: BookOpen },
    { id: 'xmax-work', label: 'XMAX WORK', icon: Target },
    { id: 'bookmarks', label: 'BOOKMARKS', icon: Bookmark },
    { id: 'software-team', label: 'TEAM', icon: Users },
    { id: 'products', label: 'PRODUCTS', icon: Package },
  ]

  const filteredTasks = tasks.filter(t => 
    (filterStatus === 'all' || t.status === filterStatus) &&
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    todo: tasks.filter(t => t.status === 'todo').length,
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-amber-50 font-mono">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 h-14 bg-[#111] border-b border-amber-900/30 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 hover:bg-amber-900/20 rounded">
            <Menu className="w-5 h-5 text-amber-500" />
          </button>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <span className="text-amber-500 font-bold tracking-wider">MISSION CONTROL</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); router.push('/?tab=' + item.id); setMobileMenuOpen(false); }}
              className={`px-3 py-2 text-xs tracking-wider transition-colors hidden md:block ${
                activeTab === item.id 
                  ? 'bg-amber-500/10 text-amber-500 border-b-2 border-amber-500' 
                  : 'text-amber-700 hover:text-amber-400'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-14 left-0 right-0 bg-[#111] border-b border-amber-900/30 z-40 lg:hidden"
          >
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); router.push('/?tab=' + item.id); setMobileMenuOpen(false); }}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 ${
                  activeTab === item.id ? 'bg-amber-500/10 text-amber-500' : 'text-amber-700 hover:bg-amber-900/20'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm tracking-wider">{item.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-14 min-h-screen p-4 md:p-6">
        
        {/* Header Stats Bar */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="bg-[#111] border border-amber-900/30 p-3">
            <p className="text-amber-600 text-xs tracking-wider mb-1">TOTAL</p>
            <p className="text-2xl font-bold text-amber-400">{stats.total}</p>
          </div>
          <div className="bg-[#111] border border-amber-900/30 p-3">
            <p className="text-amber-600 text-xs tracking-wider mb-1">DONE</p>
            <p className="text-2xl font-bold text-green-500">{stats.done}</p>
          </div>
          <div className="bg-[#111] border border-amber-900/30 p-3">
            <p className="text-amber-600 text-xs tracking-wider mb-1">IN PROG</p>
            <p className="text-2xl font-bold text-blue-500">{stats.inProgress}</p>
          </div>
          <div className="bg-[#111] border border-amber-900/30 p-3">
            <p className="text-amber-600 text-xs tracking-wider mb-1">TODO</p>
            <p className="text-2xl font-bold text-amber-500">{stats.todo}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-700" />
          <input
            type="text"
            placeholder="SEARCH..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111] border border-amber-900/30 pl-10 pr-4 py-2 text-amber-50 placeholder-amber-800 focus:outline-none focus:border-amber-500 text-sm tracking-wider"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 mb-6">
          {(['all', 'in-progress', 'todo', 'done'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 text-xs tracking-wider transition-colors ${
                filterStatus === status 
                  ? 'bg-amber-500 text-black font-bold' 
                  : 'bg-[#111] text-amber-700 hover:text-amber-400'
              }`}
            >
              {status.toUpperCase().replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          
          {/* HOME TAB */}
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <Zap className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h2 className="text-2xl text-amber-400 mb-2">MISSION CONTROL</h2>
              <p className="text-amber-700 text-sm tracking-wider">SELECT A MODULE FROM NAVIGATION</p>
            </motion.div>
          )}

          {/* PROJECTS TAB */}
          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {filteredTasks.map(task => (
                <div
                  key={task.id}
                  className={`bg-[#111] border p-4 flex items-center justify-between ${
                    task.status === 'done' 
                      ? 'border-green-900/30 opacity-60' 
                      : task.status === 'in-progress'
                        ? 'border-blue-900/30'
                        : 'border-amber-900/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {task.status === 'done' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : task.status === 'in-progress' ? (
                      <Clock className="w-5 h-5 text-blue-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-amber-700" />
                    )}
                    <span className={task.status === 'done' ? 'line-through text-amber-800' : ''}>
                      {task.title}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 ${
                    task.priority === 'high' ? 'bg-red-900/30 text-red-500' :
                    task.priority === 'medium' ? 'bg-amber-900/30 text-amber-500' :
                    'bg-amber-900/10 text-amber-700'
                  }`}>
                    {task.priority.toUpperCase()}
                  </span>
                </div>
              ))}
            </motion.div>
          )}

          {/* XMAX WORK TAB */}
          {activeTab === 'xmax-work' && (
            <motion.div
              key="xmax-work"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Topics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {trendingTopics.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(selectedTopic === topic.id ? null : topic.id)}
                    className={`bg-[#111] border p-3 text-left transition-colors ${
                      selectedTopic === topic.id 
                        ? 'border-amber-500' 
                        : 'border-amber-900/30 hover:border-amber-700'
                    }`}
                  >
                    <p className="text-amber-400 text-sm font-bold">{topic.title}</p>
                    <p className="text-amber-800 text-xs mt-1">{topic.tweets.length} READY</p>
                  </button>
                ))}
              </div>

              {/* Tweet Preview */}
              <AnimatePresence>
                {selectedTopic && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-[#111] border border-amber-500 p-4"
                  >
                    <p className="text-amber-300 text-sm mb-3">
                      {trendingTopics.find(t => t.id === selectedTopic)?.tweets[0].text}
                    </p>
                    <a 
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(trendingTopics.find(t => t.id === selectedTopic)?.tweets[0].text || '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-black text-sm font-bold tracking-wider hover:bg-amber-400"
                    >
                      <Twitter className="w-4 h-4" /> POST
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* BOOKMARKS TAB */}
          {activeTab === 'bookmarks' && (
            <motion.div
              key="bookmarks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {bookmarks.map(bookmark => (
                <a
                  key={bookmark.id}
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#111] border border-amber-900/30 p-4 flex items-center justify-between hover:border-amber-500 transition-colors"
                >
                  <div>
                    <p className="text-amber-400">{bookmark.title}</p>
                    <p className="text-amber-800 text-xs">{bookmark.url}</p>
                  </div>
                  <Bookmark className="w-5 h-5 text-amber-700" />
                </a>
              ))}
            </motion.div>
          )}

          {/* TEAM TAB */}
          {activeTab === 'software-team' && (
            <motion.div
              key="team"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Open Drawer Button */}
              <button
                onClick={() => setTeamDrawerOpen(true)}
                className="w-full bg-[#111] border border-amber-500/30 p-4 flex items-center justify-between hover:border-amber-500 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-amber-500" />
                  <div className="text-left">
                    <p className="text-amber-400 font-bold">MY TEAM</p>
                    <p className="text-amber-700 text-xs">View detailed team status</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-amber-700 group-hover:text-amber-500 transition-colors" />
              </button>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-3 gap-2">
                {teamMembers.map(member => (
                  <div
                    key={member.id}
                    className="bg-[#111] border border-amber-900/30 p-3"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 ${member.status === 'working' ? 'bg-green-500 animate-pulse' : member.status === 'done' ? 'bg-blue-500' : 'bg-amber-800'}`} />
                      <member.icon className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className="text-amber-400 font-bold text-sm">{member.name}</p>
                    <p className="text-amber-800 text-xs">{member.role}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="bg-[#111] border border-amber-900/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl text-amber-400 font-bold">MDIFY</h3>
                    <p className="text-amber-700 text-sm">Chrome Extension</p>
                  </div>
                  <a href="https://chromewebstore.google.com/detail/mdify/kimahdiiopfklhcciaiknnfcobamjeki" target="_blank" className="px-3 py-1 bg-amber-500 text-black text-sm font-bold">VIEW</a>
                </div>
                <p className="text-amber-300 text-sm mb-4">Convert any article to clean .md for AI agents.</p>
                <a href="https://twitter.com/intent/tweet?text=Stop%20pasting%20bloated%20links.%20Use%20%23Mdify%20to%20convert%20posts%20to%20clean%20.md%20for%20your%20AI%20agent." target="_blank" className="inline-flex items-center gap-2 px-3 py-1 border border-amber-500 text-amber-500 text-sm hover:bg-amber-500/10">
                  <Twitter className="w-3 h-3" /> TWEET
                </a>
              </div>

              <div className="bg-[#111] border border-amber-900/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl text-amber-400 font-bold">GUARDSKILLS</h3>
                    <p className="text-amber-700 text-sm">NPM Package</p>
                  </div>
                  <a href="https://www.npmjs.com/package/guardskills" target="_blank" className="px-3 py-1 bg-amber-500 text-black text-sm font-bold">VIEW</a>
                </div>
                <p className="text-amber-300 text-sm mb-4">Scan AI skills for malicious code before installing.</p>
                <a href="https://twitter.com/intent/tweet?text=Stop%20risking%20your%20keys.%20Use%20%40guardskills_%20to%20scan%20AI%20skills%20for%20malicious%20code.%20Security%20matters." target="_blank" className="inline-flex items-center gap-2 px-3 py-1 border border-amber-500 text-amber-500 text-sm hover:bg-amber-500/10">
                  <Twitter className="w-3 h-3" /> TWEET
                </a>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* My Team Drawer */}
      <AnimatePresence>
        {teamDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTeamDrawerOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-14 right-0 bottom-0 w-full max-w-md bg-[#0a0a0a] border-l border-amber-900/30 z-50 flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-amber-900/30">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-500" />
                  <span className="text-amber-400 font-bold tracking-wider">MY TEAM</span>
                </div>
                <button
                  onClick={() => setTeamDrawerOpen(false)}
                  className="p-1 hover:bg-amber-900/20 rounded"
                >
                  <X className="w-5 h-5 text-amber-700" />
                </button>
              </div>

              {/* Summary Bar */}
              <div className="grid grid-cols-4 gap-1 p-2 border-b border-amber-900/30 bg-[#111]">
                <div className="text-center p-2">
                  <p className="text-amber-600 text-xs tracking-wider">TOTAL</p>
                  <p className="text-xl font-bold text-amber-400">{teamStats.total}</p>
                </div>
                <div className="text-center p-2">
                  <p className="text-green-600 text-xs tracking-wider">ACTIVE</p>
                  <p className="text-xl font-bold text-green-500">{teamStats.active}</p>
                </div>
                <div className="text-center p-2">
                  <p className="text-red-600 text-xs tracking-wider">BLOCKED</p>
                  <p className="text-xl font-bold text-red-500">{teamStats.blocked}</p>
                </div>
                <div className="text-center p-2">
                  <p className="text-blue-600 text-xs tracking-wider">REVIEW</p>
                  <p className="text-xl font-bold text-blue-500">{teamStats.reviewing}</p>
                </div>
                <div className="text-center p-2">
                  <p className="text-amber-600 text-xs tracking-wider">IDLE</p>
                  <p className="text-xl font-bold text-amber-500">{teamStats.idle}</p>
                </div>
                <div className="text-center p-2">
                  <p className="text-red-600 text-xs tracking-wider">OVERDUE</p>
                  <p className="text-xl font-bold text-red-500">{teamStats.overdue}</p>
                </div>
                <div className="text-center p-2 col-span-2">
                  <p className="text-amber-600 text-xs tracking-wider">STALLED</p>
                  <p className="text-xl font-bold text-amber-500">{teamStats.stalled}</p>
                </div>
              </div>

              {/* Filters */}
              <div className="p-2 border-b border-amber-900/30 space-y-2">
                <div className="flex gap-1">
                  <select
                    value={teamFilterStatus}
                    onChange={(e) => setTeamFilterStatus(e.target.value)}
                    className="flex-1 bg-[#111] border border-amber-900/30 text-amber-50 text-xs p-1.5 focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">STATUS</option>
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="idle">Idle</option>
                    <option value="overdue">Overdue</option>
                    <option value="stalled">Stalled</option>
                  </select>
                  <select
                    value={teamFilterProject}
                    onChange={(e) => setTeamFilterProject(e.target.value)}
                    className="flex-1 bg-[#111] border border-amber-900/30 text-amber-50 text-xs p-1.5 focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">PROJECT</option>
                    {projects.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="flex gap-1">
                  <select
                    value={teamFilterRole}
                    onChange={(e) => setTeamFilterRole(e.target.value)}
                    className="flex-1 bg-[#111] border border-amber-900/30 text-amber-50 text-xs p-1.5 focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">ROLE</option>
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <select
                    value={teamFilterPriority}
                    onChange={(e) => setTeamFilterPriority(e.target.value)}
                    className="flex-1 bg-[#111] border border-amber-900/30 text-amber-50 text-xs p-1.5 focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">PRIORITY</option>
                    {priorities.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
                  </select>
                  <button
                    onClick={loadTeamData}
                    disabled={isLoadingTeam}
                    className="px-2 bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500/20"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingTeam ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Member Cards List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {filteredTeam.map(([id, member]) => {
                  const memberInfo = teamMembers.find(m => m.id === id)
                  const isExpanded = expandedCard === id
                  const statusColors: Record<string, string> = {
                    active: 'bg-green-500',
                    working: 'bg-green-500',
                    blocked: 'bg-red-500',
                    reviewing: 'bg-blue-500',
                    idle: 'bg-amber-500',
                    overdue: 'bg-red-500',
                    stalled: 'bg-amber-500',
                  }
                  const isOverdue = member.status === 'overdue'
                  
                  return (
                    <div
                      key={id}
                      className={`bg-[#111] border transition-colors ${
                        isExpanded ? 'border-amber-500' : 'border-amber-900/30'
                      }`}
                    >
                      {/* Collapsed Card */}
                      <button
                        onClick={() => setExpandedCard(isExpanded ? null : id)}
                        className="w-full p-3 flex items-center gap-3 text-left"
                      >
                        {/* Avatar */}
                        <div className="w-10 h-10 bg-[#222] border border-amber-900/30 flex items-center justify-center">
                          <span className="text-amber-400 font-bold text-sm">
                            {member.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                          </span>
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {/* Status Indicator */}
                            <span className={`w-2 h-2 ${statusColors[member.status]} ${isOverdue ? 'animate-pulse' : ''}`} />
                            <span className="text-amber-400 font-bold">{member.name}</span>
                          </div>
                          <p className="text-amber-800 text-xs">{memberInfo?.role || 'Team Member'}</p>
                          {member.currentTask && (
                            <p className="text-amber-600 text-xs truncate mt-1">{member.currentTask}</p>
                          )}
                        </div>
                        
                        {/* Expand Icon */}
                        <ChevronRight className={`w-4 h-4 text-amber-700 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </button>
                      
                      {/* Expanded Card */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-amber-900/30 overflow-hidden"
                          >
                            <div className="p-3 space-y-3">
                              {/* Task Overview */}
                              <div>
                                <p className="text-amber-600 text-xs tracking-wider mb-1">TASK OVERVIEW</p>
                                <p className="text-amber-300 text-sm">{member.currentTask || 'No active task'}</p>
                              </div>
                              
                              {/* Execution State */}
                              <div className="flex gap-4">
                                <div>
                                  <p className="text-amber-600 text-xs tracking-wider">PROJECT</p>
                                  <p className="text-amber-400 text-sm">{member.project}</p>
                                </div>
                                <div>
                                  <p className="text-amber-600 text-xs tracking-wider">PRIORITY</p>
                                  <span className={`text-xs px-1.5 py-0.5 ${
                                    member.priority === 'high' ? 'bg-red-900/30 text-red-500' :
                                    member.priority === 'medium' ? 'bg-amber-900/30 text-amber-500' :
                                    'bg-amber-900/10 text-amber-700'
                                  }`}>
                                    {member.priority?.toUpperCase() || 'N/A'}
                                  </span>
                                </div>
                              </div>
                              
                              {/* Deliverables */}
                              {member.deliverables && member.deliverables.length > 0 && (
                                <div>
                                  <p className="text-amber-600 text-xs tracking-wider mb-1">DELIVERABLES</p>
                                  <div className="flex flex-wrap gap-1">
                                    {member.deliverables.map((d, i) => (
                                      <span key={i} className="text-xs bg-amber-900/20 text-amber-400 px-2 py-0.5">
                                        {d}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Activity Log */}
                              {member.activityLog && member.activityLog.length > 0 && (
                                <div>
                                  <p className="text-amber-600 text-xs tracking-wider mb-1">ACTIVITY LOG</p>
                                  <div className="space-y-1 max-h-24 overflow-y-auto">
                                    {member.activityLog.map((log, i) => (
                                      <div key={i} className="flex gap-2 text-xs">
                                        <span className="text-amber-700">{log.time}</span>
                                        <span className="text-amber-500">{log.action}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(amber 1px, transparent 1px), linear-gradient(90deg, amber 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />
    </div>
  )
}

export default function MissionControl() {
  return (
    <Suspense fallback={<div className='min-h-screen bg-[#0a0a0a] text-amber-50 font-mono p-6'>LOADING...</div>}>
      <MissionControlContent />
    </Suspense>
  )
}
