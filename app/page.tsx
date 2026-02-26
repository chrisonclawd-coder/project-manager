'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, Search, BookOpen, Twitter, Bookmark, CheckCircle, Circle, Clock, Zap, RefreshCw, Menu, X, User, Beaker, Rocket, Eye, Bot, Users, Package, Target, Home as HomeIcon } from 'lucide-react'

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
  status: 'idle' | 'working' | 'done' | 'blocked'
  currentTask?: string
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
  { id: 'manager', name: 'Chrisly', role: 'Manager', icon: Bot, status: 'idle' },
  { id: 'xmax', name: 'xMax', role: 'X Strategy Lead', icon: Target, status: 'idle' },
  { id: 'developer', name: 'Developer', role: 'Developer', icon: User, status: 'idle' },
  { id: 'qa', name: 'QA', role: 'QA', icon: Beaker, status: 'idle' },
  { id: 'devops', name: 'DevOps', role: 'DevOps', icon: Rocket, status: 'idle' },
  { id: 'tester', name: 'Tester', role: 'Manual Tester', icon: Eye, status: 'idle' },
]

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
              className="grid grid-cols-2 md:grid-cols-3 gap-3"
            >
              {teamMembers.map(member => (
                <div
                  key={member.id}
                  className="bg-[#111] border border-amber-900/30 p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 ${member.status === 'working' ? 'bg-green-500 animate-pulse' : member.status === 'done' ? 'bg-blue-500' : 'bg-amber-800'}`} />
                    <member.icon className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-amber-400 font-bold">{member.name}</p>
                  <p className="text-amber-800 text-xs">{member.role}</p>
                </div>
              ))}
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
