'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, BookOpen, Twitter, Bookmark, CheckCircle, Circle, Clock, Zap, RefreshCw, Menu, X, User, Beaker, Rocket, Eye, Bot, Users, Package, Target } from 'lucide-react'

// Viral tweets - 280 characters max
const defaultTopics = [
  { 
    id: 1, 
    title: 'AI Breakthroughs 2026', 
    source: 'MIT Tech Review',
    tweets: [
      { text: "MIT's 10 Breakthrough Technologies 2026 is out. AI agents are leading. The shift from chatbots to autonomous agents is faster than anyone predicted. We're witnessing the biggest paradigm shift since mobile. Are you ready?", hashtags: ['AI', 'Tech', 'Innovation'] },
      { text: "Breakthrough tech alert 🚨 AI agents are going from \"tools\" to \"teammates.\" Companies adapting fastest are winning. If you're not experimenting with agents today, you're already behind. #AI #Future #2026", hashtags: ['Breakthrough', 'AI', 'Future'] }
    ]
  },
  { 
    id: 2, 
    title: 'Gartner Tech Trends', 
    source: 'Gartner',
    tweets: [
      { text: "Gartner's Top 10 Tech Trends 2026: Agentic AI is THE trend. Not chatbots. Autonomous agents that DO work. Spatial computing, energy-efficient AI, and the convergence of everything. This decade will be defined by adaptation. #Gartner #TechTrends", hashtags: ['Gartner', 'TechTrends'] },
      { text: "Here's what Gartner's trends mean for you: Agentic AI = AI coworker who gets stuff done. Spatial Computing = mixed reality. Energy-Efficient AI = sustainable at scale. The companies acting fastest will lead. #Strategy #2026", hashtags: ['Tech', 'Strategy'] }
    ]
  },
  { 
    id: 3, 
    title: 'AI Voice Agents', 
    source: 'RingCentral',
    tweets: [
      { text: "AI voice agents are HERE and better than most humans at customer service. 24/7 availability, infinite scalability, 70-90% cost reduction. The future isn't AI vs humans - it's AI + humans = incredible experiences. #AI #VoiceAgents", hashtags: ['AI', 'VoiceAgents'] },
      { text: "Hot take: 80% of customer service reps replaced by AI in 3 years. Not a threat - an upgrade. AI handles routine, humans handle complex empathy. Better experience + lower costs + happier agents. Agree? #FutureOfWork", hashtags: ['AI', 'Future'] }
    ]
  },
  { 
    id: 4, 
    title: 'Hyperscale AI Data Centers', 
    source: 'MIT Tech Review',
    tweets: [
      { text: "AI data centers consuming insane energy. One GPT-4 training = power 100 homes/year. But it's temporary. Nuclear + fusion + renewables coming. Companies solving the energy problem will dominate. #AI #CleanEnergy", hashtags: ['AI', 'DataCenters'] },
      { text: "AI data centers = new oil refineries. Microsoft signed nuclear deal. Google 100% renewable. Amazon building solar farms. Future belongs to companies that solve energy. Sustainable AI = competitive advantage. #GreenTech", hashtags: ['AI', 'Energy'] }
    ]
  },
  { 
    id: 5, 
    title: 'Intelligent Apps', 
    source: 'Capgemini',
    tweets: [
      { text: "Every app without AI is obsolete. Shift from \"AI features\" to \"AI-native apps\" is happening NOW. AI as foundation, not feature. The app store is dead. Long live the AI agent store. Biggest shift since mobile. #AI #Apps", hashtags: ['AI', 'Apps'] },
      { text: "Nobody wants 50 apps. They want ONE assistant that does everything. AI-native apps = context-aware, proactive, learning. More AI, fewer apps. App stores become AI aggregators. Developers become prompt engineers. #AIFirst", hashtags: ['AI', 'Innovation'] }
    ]
  },
  { 
    id: 6, 
    title: 'AI Coding Trends', 
    source: 'GitHub Blog',
    tweets: [
      { text: "12 AI Coding Trends 2026:\n1. Agentic AI\n2. Autonomous coding\n3. Natural language → code\n4. Automated testing\n5. Self-healing code\n6. Voice-coding\n7. AI pair programming\n\nDev landscape being rewritten. Which trend excites you most?", hashtags: ['AICoding', 'DevTools'] },
      { text: "AI coding isn't future - it's PRESENT. Companies using AI: 10x more productive. Not using AI: struggling to compete. Best devs direct AI, not fight it. Your job: understand problems, verify output, focus on hard stuff. #Coding #AI", hashtags: ['AI', 'Coding'] }
    ]
  },
  { 
    id: 7, 
    title: 'Agentic AI Era', 
    source: 'Medium',
    tweets: [
      { text: "2026 = Year Agents Take Over. Not chatbots. AUTONOMOUS AI that plans, executes, learns, collaborates. Biggest shift in software ever. Before: write code. Now: direct AI. Winners direct AI most effectively. Are you ready? #AI #Agents", hashtags: ['AI', 'Agents'] },
      { text: "Shift from \"coding\" to \"orchestrating\" is biggest career change in tech. Developer directing 10 AI agents = work of 100 devs. Skills: prompt engineering, system design, verification, orchestration. Syntax → context. #FutureOfWork", hashtags: ['AI', 'SDLC'] }
    ]
  },
  { 
    id: 8, 
    title: 'Vibe Coding', 
    source: 'MasteringAI',
    tweets: [
      { text: "Vibe coding: Describe what you want. AI builds it. No syntax. No bugs. Just vibes. \n\nYES for 80%: landing pages, CRUD, integrations.\nNO for 20%: architecture, algorithms, security.\n\nFuture: BOTH. What's your mix? #VibeCoding", hashtags: ['VibeCoding', 'AI'] },
      { text: "Vibe vs Traditional coding - which wins? ANSWER: Both. Forever.\n\nVibe: fast, prototyping, democratizing.\nTraditional: performance, security, complex algorithms.\n\nBest devs master BOTH. 80% vibe, 20% hand-code what matters. #Coding", hashtags: ['VibeCoding', 'Dev'] }
    ]
  },
  { 
    id: 9, 
    title: 'Developer Productivity', 
    source: 'Octopus',
    tweets: [
      { text: "Data from 1000+ companies: AI = 40-60% productivity gains.\n\nCode generation (30%): AI writes boilerplate\nDebugging (25%): AI finds bugs in seconds\nResearch (20%): AI finds solutions instantly\n\nCompanies seeing 60% gains? They trained teams, established workflows. #AI #Productivity", hashtags: ['AI', 'Productivity'] },
      { text: "Your devs are 40% more productive with AI. DATA, not prediction.\n\nNot using AI in 2026 = refusing Google in 2005.\nExcuses: \"it makes mistakes\" (so do humans, fewer), \"takes time to learn\" (so does everything worth having). #Future", hashtags: ['AI', 'Dev'] }
    ]
  },
  { 
    id: 10, 
    title: 'AI Trends 2026', 
    source: 'Various',
    tweets: [
      { text: "7 AI trends defining 2026:\n1. Agentic AI\n2. Multimodal\n3. Edge AI\n4. Open source dominance\n5. Custom fine-tuned models\n6. AI regulation\n7. Vertical AI\n\nWe're past experimentation. In implementation phase. ROI now. #AITrends #2026", hashtags: ['AI', 'Trends'] },
      { text: "AI 2026 = Multimodal + Agents + Edge + Vertical. Not chatbots. AUTONOMOUS SYSTEMS that see, hear, speak, act. Edge AI: your phone = GPT-4. Privacy improves, speed increases, costs decrease. AI becomes invisible but omnipresent. #Future", hashtags: ['AI', 'Tech'] }
    ]
  }
]

// Types
type TaskStatus = 'todo' | 'in-progress' | 'done'
type TaskPriority = 'low' | 'medium' | 'high'

type MemberStatus = 'idle' | 'working' | 'done' | 'blocked'

interface TeamMember {
  id: string
  name: string
  role: string
  icon: any
  status: MemberStatus
  currentTask?: string
}

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

// Team members with live status
const teamMembers: TeamMember[] = [
  { id: 'manager', name: 'Chrisly', role: 'Manager', icon: Bot, status: 'working', currentTask: 'Overseeing team' },
  { id: 'xmax', name: 'xMax', role: 'X Content Creator', icon: Target, status: 'working', currentTask: 'Increasing engagement by 20%' },
  { id: 'developer', name: 'Developer', role: 'Developer', icon: User, status: 'idle' },
  { id: 'qa', name: 'QA', role: 'QA', icon: Beaker, status: 'idle' },
  { id: 'devops', name: 'DevOps', role: 'DevOps', icon: Rocket, status: 'idle' },
  { id: 'tester', name: 'Manual Test', role: 'Manual Tester', icon: Eye, status: 'idle' },
]

// Map API status to MemberStatus
const mapApiStatusToMemberStatus = (status: string): MemberStatus => {
  if (status === 'working') return 'working'
  if (status === 'done') return 'done'
  if (status === 'blocked') return 'blocked'
  return 'idle'
}

// Sample tasks
const defaultTasks: Task[] = [
  { id: 1, title: 'Complete InstaCards Chrome Extension', status: 'done', priority: 'high' },
  { id: 2, title: 'Build Mission Control Dashboard', status: 'done', priority: 'high' },
  { id: 3, title: 'Setup X Strategy automation', status: 'done', priority: 'high' },
  { id: 4, title: 'Deploy to Vercel', status: 'done', priority: 'high' },
]

// Sample bookmarks
const defaultBookmarks: BookmarkItem[] = [
  { id: 1, title: 'OpenClaw 50 Days Workflows', url: 'https://gist.github.com/velvet-shark/b4c6724c391f612c4de4e9a07b0a74b6', category: 'Work', addedAt: '2026-02-24' },
]

// Products data
const products = [
  { 
    id: 'guardskills', 
    name: 'guardskills', 
    platform: 'npm', 
    url: 'https://www.npmjs.com/package/guardskills',
    installs: '1.2.1', // show version for now
    description: 'Scan AI skills before use, flag risky behavior'
  },
  { 
    id: 'mdify', 
    name: 'mdify', 
    platform: 'chrome', 
    url: 'https://chromewebstore.google.com/detail/mdify/kimahdiiopfklhcciaiknnfcobamjeki',
    installs: '1K+ users', // placeholder
    description: 'Turn any website into clean markdown'
  }
]

const getTweetUrl = (text: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`

const stats = { total: 4, inProgress: 0, todo: 0, done: 4 }

const statusColors = {
  idle: 'bg-gray-600',
  working: 'bg-blue-500',
  done: 'bg-green-500',
  blocked: 'bg-red-500',
}

export default function Home() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'projects' | 'xstrategy' | 'bookmarks' | 'software-team' | 'products'>('projects')
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null)
  const [tasks, setTasks] = useState<Task[]>(defaultTasks)
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(defaultBookmarks)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all')
  const [trendingTopics] = useState(defaultTopics)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [team] = useState<TeamMember[]>(teamMembers)
  const [isTeamExpanded, setIsTeamExpanded] = useState(false)
  
  // Live team status from API
  const [liveTeamStatus, setLiveTeamStatus] = useState<Record<string, { name: string; status: string; currentTask: string }> | null>(null)
  
  // Fetch team status from API
  useEffect(() => {
    const fetchTeamStatus = async () => {
      try {
        const res = await fetch('/api/status')
        const data = await res.json()
        setLiveTeamStatus(data)
      } catch (err) {
        console.error('Failed to fetch team status:', err)
      }
    }
    
    // Initial fetch
    fetchTeamStatus()
    
    // Poll every 5 seconds
    const interval = setInterval(fetchTeamStatus, 5000)
    return () => clearInterval(interval)
  }, [])
  
  // Use live team status if available, otherwise use default
  const displayTeam = liveTeamStatus 
    ? team.map((member) => ({
        ...member,
        status: mapApiStatusToMemberStatus(liveTeamStatus[member.id]?.status || 'idle'),
        currentTask: liveTeamStatus[member.id]?.currentTask || member.currentTask
      }))
    : team

  const refreshTopics = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const filteredBookmarks = bookmarks.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.url.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const menuItems = [
    { id: 'projects', label: 'Projects', icon: BookOpen },
    { id: 'xstrategy', label: 'X Strategy', icon: Twitter, badge: '2/4' },
    { id: 'xmax-work', label: 'xMax Work', icon: Target },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'software-team', label: 'Software Team', icon: Users },
    { id: 'products', label: 'Products', icon: Package },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg"
      >
        {isDrawerOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Drawer - Left Side */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 w-72 bg-gray-800 border-r border-gray-700 transform transition-transform duration-200 z-40
        ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 h-full overflow-y-auto">
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
            <Zap className="w-8 h-8 text-yellow-400" />
            Mission Control
          </h1>

          {/* Team Members */}
          <div className="mb-6">
            <button 
              onClick={() => setIsTeamExpanded(!isTeamExpanded)}
              className="w-full flex items-center justify-between mb-3 group"
            >
              <h2 className="text-xs uppercase tracking-wider text-gray-500 font-semibold group-hover:text-gray-400 transition-colors">Team Status</h2>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isTeamExpanded ? 'rotate-0' : '-rotate-90'}`} />
            </button>
            <AnimatePresence>
              {isTeamExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2 overflow-hidden"
                >
                  {displayTeam.map((member) => (
                    <div 
                      key={member.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-gray-700/50"
                    >
                      <div className={`p-2 rounded-lg ${statusColors[member.status]} bg-opacity-20`}>
                        <member.icon className={`w-4 h-4 ${statusColors[member.status].replace('bg-', 'text-')}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{member.name}</p>
                        <p className="text-xs text-gray-400 truncate">{member.currentTask || member.role}</p>
                      </div>
                      <span className={`w-2 h-2 rounded-full ${statusColors[member.status]}`} />
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <div className="bg-gray-700 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-gray-400 text-xs">Total</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-400">{stats.done}</p>
              <p className="text-gray-400 text-xs">Done</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id as any); setIsDrawerOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id 
                    ? 'bg-yellow-400/20 text-yellow-400' 
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </span>
                {item.badge && (
                  <span className="text-xs bg-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Footer in drawer */}
        <div className="p-6 border-t border-gray-700">
          <p className="text-gray-500 text-sm text-center">{new Date().toLocaleDateString()}</p>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Main Content - Right Side */}
      <main className="flex-1 min-h-screen p-6 lg:p-8 pt-16 lg:pt-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
            />
          </div>
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div>
            {/* Filter */}
            <div className="flex gap-2 mb-4">
              {(['all', 'in-progress', 'todo', 'done'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === status
                      ? 'bg-yellow-400 text-gray-900'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {status === 'all' ? 'All' : status === 'in-progress' ? 'In Progress' : status === 'todo' ? 'To Do' : 'Done'}
                </button>
              ))}
            </div>

            {/* Task List */}
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {task.status === 'done' ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : task.status === 'in-progress' ? (
                      <Clock className="w-5 h-5 text-blue-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                    <span className={task.status === 'done' ? 'text-gray-400 line-through' : ''}>
                      {task.title}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.priority === 'high' ? 'bg-red-400/20 text-red-400' :
                    task.priority === 'medium' ? 'bg-yellow-400/20 text-yellow-400' :
                    'bg-gray-400/20 text-gray-400'
                  }`}>
                    {task.priority}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* X Strategy Tab */}
        {activeTab === 'xstrategy' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-400">Pick a topic to tweet</p>
              <button
                onClick={refreshTopics}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {/* Topics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trendingTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(selectedTopic === topic.id ? null : topic.id)}
                  className={`bg-gray-800 rounded-lg p-4 border text-left transition-all hover:border-yellow-400/50 ${
                    selectedTopic === topic.id ? 'border-yellow-400' : 'border-gray-700'
                  }`}
                >
                  <h3 className="font-medium mb-1">{topic.title}</h3>
                  <p className="text-gray-400 text-sm">{topic.source}</p>
                  <p className="text-gray-500 text-xs mt-2">{topic.tweets.length} tweets ready</p>
                </button>
              ))}
            </div>

            {/* Tweet Preview */}
            <AnimatePresence>
              {selectedTopic && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-700">
                    <h3 className="font-medium">
                      {trendingTopics.find(t => t.id === selectedTopic)?.title}
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-700">
                    {trendingTopics.find(t => t.id === selectedTopic)?.tweets.map((tweet, idx) => (
                      <div key={idx} className="p-4">
                        <p className="text-sm text-gray-300 whitespace-pre-wrap mb-4">{tweet.text}</p>
                        <div className="flex items-center gap-3">
                          <a
                            href={getTweetUrl(tweet.text)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium transition-colors"
                          >
                            <Twitter className="w-4 h-4" />
                            Tweet
                          </a>
                          <span className="text-gray-500 text-xs">{tweet.text.length}/280</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Bookmarks Tab */}
        {activeTab === 'bookmarks' && (
          <div>
            <div className="space-y-3">
              {filteredBookmarks.map((bookmark) => (
                <a
                  key={bookmark.id}
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-yellow-400/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium mb-1">{bookmark.title}</h3>
                      <p className="text-gray-400 text-sm truncate max-w-md">{bookmark.url}</p>
                    </div>
                    <Bookmark className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-1 bg-gray-700 rounded text-xs">{bookmark.category}</span>
                    <span className="text-gray-500 text-xs">{bookmark.addedAt}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* xMax Work Tab */}
        {activeTab === 'xmax-work' && (
          <div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-yellow-400" />
              xMax Work
            </h2>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <p className="text-2xl font-bold text-yellow-400">1</p>
                <p className="text-gray-400 text-sm">Tweets Generated</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <p className="text-2xl font-bold text-green-400">0%</p>
                <p className="text-gray-400 text-sm">Engagement Rate</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <p className="text-2xl font-bold text-blue-400">0</p>
                <p className="text-gray-400 text-sm">Impressions</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <p className="text-2xl font-bold text-purple-400">0</p>
                <p className="text-gray-400 text-sm">Posts Engaged</p>
              </div>
            </div>

            {/* Recent Tweets */}
            <h3 className="text-lg font-semibold mb-4">Ready to Post</h3>
            <div className="space-y-4 mb-6">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-1 bg-yellow-400/20 text-yellow-400 rounded text-xs">AI Voice Agents</span>
                  <span className="text-green-400 text-xs">Ready to post</span>
                </div>
                <p className="text-white mb-3">Hot take: Voice AI is the GPT moment of 2026. Not chatbots. Not copilots. Voice agents that actually understand nuance. Been testing the new models - they're scary good. What's the first use case you'll automate? 👇</p>
                <p className="text-gray-500 text-xs">278 characters</p>
              </div>
            </div>

            {/* Topics */}
            <h3 className="text-lg font-semibold mb-4">Topics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="font-medium">AI Voice Agents</span>
                  <span className="text-yellow-400 text-sm">1 tweet</span>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Agentic AI Era</span>
                  <span className="text-gray-500 text-sm">0 tweets</span>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Gartner Tech Trends</span>
                  <span className="text-gray-500 text-sm">0 tweets</span>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Hyperscale AI Data Centers</span>
                  <span className="text-gray-500 text-sm">0 tweets</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Software Team Tab */}
        {activeTab === 'software-team' && (
          <div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-yellow-400" />
              Software Team
            </h2>
            
            {/* Desks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayTeam.slice(1).map((member) => (
                <div
                  key={member.id}
                  className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden relative"
                >
                  {/* Desk Top */}
                  <div className="bg-gray-700 h-3 flex items-center justify-center">
                    <div className="w-20 h-2 bg-gray-600 rounded-b-lg" />
                  </div>
                  
                  {/* Person Area */}
                  <div className="p-6 flex flex-col items-center">
                    {/* Avatar */}
                    <div className={`w-20 h-20 rounded-full ${statusColors[member.status]} bg-opacity-20 flex items-center justify-center mb-4 ring-4 ring-gray-700`}>
                      <member.icon className={`w-10 h-10 ${statusColors[member.status].replace('bg-', 'text-')}`} />
                    </div>
                    
                    {/* Name & Role */}
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <p className="text-gray-400 text-sm">{member.role}</p>
                    
                    {/* Status Indicator */}
                    <div className="flex items-center gap-2 mt-3">
                      <span className={`w-3 h-3 rounded-full ${statusColors[member.status]} animate-pulse`} />
                      <span className="text-xs text-gray-400 capitalize">{member.status}</span>
                    </div>
                  </div>
                  
                  {/* Speech Bubble */}
                  <div className="px-4 pb-4">
                    <div className="bg-gray-700 rounded-lg p-3 relative">
                      {/* Bubble arrow */}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-gray-700" />
                      <p className="text-sm text-gray-300 text-center">
                        {member.currentTask || `Ready for ${member.role.toLowerCase()} tasks`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Package className="w-6 h-6 text-yellow-400" />
              Products
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((product) => (
                <a
                  key={product.id}
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-yellow-400/50 transition-colors block"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold">{product.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      product.platform === 'npm' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {product.platform === 'npm' ? 'NPM' : 'Chrome'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-yellow-400">{product.installs}</span>
                    <span className="text-gray-500 text-sm">installs</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}