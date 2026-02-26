'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, BookOpen, Twitter, Bookmark, CheckCircle, Circle, Clock, Zap, Menu, Users, Package, Target, Home as HomeIcon, X } from 'lucide-react'

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
  status: string
  currentTask: string
}

const teamMembers: TeamMember[] = [
  { id: 'manager', name: 'Chrisly', role: 'Manager', status: 'idle', currentTask: '' },
  { id: 'xmax', name: 'xMax', role: 'X Strategy Lead', status: 'working', currentTask: 'Running X Strategy - creating tweets' },
  { id: 'developer', name: 'Developer', role: 'Developer', status: 'idle', currentTask: '' },
  { id: 'qa', name: 'QA', role: 'QA', status: 'idle', currentTask: '' },
  { id: 'devops', name: 'DevOps', role: 'DevOps', status: 'idle', currentTask: '' },
  { id: 'tester', name: 'Tester', role: 'Manual Tester', status: 'idle', currentTask: '' },
]

const defaultTasks: Task[] = [
  { id: 1, title: 'Complete InstaCards Chrome Extension', status: 'done', priority: 'high' },
  { id: 2, title: 'Build Mission Control Dashboard', status: 'done', priority: 'high' },
  { id: 3, title: 'Setup X Strategy automation', status: 'done', priority: 'high' },
  { id: 4, title: 'Deploy to Vercel', status: 'done', priority: 'high' },
  { id: 5, title: 'Mdify - Chrome Extension', status: 'done', priority: 'high' },
  { id: 6, title: 'Guardskills - NPM Package', status: 'done', priority: 'high' },
]

const defaultBookmarks: BookmarkItem[] = [
  { id: 1, title: 'OpenClaw 50 Days Workflows', url: 'https://gist.github.com/velvet-shark/b4c6724c391f612c4de4e9a07b0a74b6', category: 'Work', addedAt: '2026-02-24' },
]

const defaultTopics = [
  { id: 1, title: 'AI Breakthroughs 2026', source: 'MIT Tech Review', tweets: [{ text: "MIT's 10 Breakthrough Technologies 2026 is out. AI agents are leading.", hashtags: ['AI', 'Tech'] }] },
  { id: 2, title: 'Gartner Tech Trends', source: 'Gartner', tweets: [{ text: "Gartner's Top 10 Tech Trends 2026: Agentic AI is THE trend.", hashtags: ['Gartner'] }] },
  { id: 3, title: 'AI Voice Agents', source: 'RingCentral', tweets: [{ text: "AI voice agents are HERE and better than most humans at customer service.", hashtags: ['AI'] }] },
  { id: 4, title: 'Hyperscale AI Data Centers', source: 'MIT Tech Review', tweets: [{ text: "AI data centers consuming insane energy.", hashtags: ['AI'] }] },
  { id: 5, title: 'Intelligent Apps', source: 'Capgemini', tweets: [{ text: "Every app without AI is obsolete.", hashtags: ['AI'] }] },
  { id: 6, title: 'AI Coding Trends', source: 'GitHub', tweets: [{ text: "AI coding isn't future - it's PRESENT.", hashtags: ['AICoding'] }] },
]

function MissionControlContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') || 'home'
  
  const [activeTab, setActiveTab] = useState(initialTab as string)
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [tasks] = useState<Task[]>(defaultTasks)
  const [bookmarks] = useState<BookmarkItem[]>(defaultBookmarks)
  const [trendingTopics] = useState(defaultTopics)
  const [teamData, setTeamData] = useState(teamMembers)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Home page data
  const verseOfTheDay = {
    book: 'Proverbs',
    chapter: 3,
    verse: 5,
    text: 'Trust in the LORD with all your heart and lean not on your own understanding.',
    translation: 'NIV'
  }

  const wordOfTheDay = {
    word: 'Sempervirent',
    pronunciation: '/ˌsempərˈvīrənt/',
    definition: 'Remaining green and lush throughout the year; evergreen.',
    example: 'The sempervirent principles guided his decisions.'
  }

  const calendarEvents = [
    { id: 1, title: 'xMax Session 1', time: '10:30 AM', type: 'automation' },
    { id: 2, title: 'xMax Session 2', time: '3:30 PM', type: 'automation' },
    { id: 3, title: 'xMax Session 3', time: '6:30 PM', type: 'automation' },
    { id: 4, title: 'xMax Session 4', time: '9:30 PM', type: 'automation' },
  ]

  const weather = { temp: 26, high: 29, low: 21, condition: 'Mist' }

  const motivationalLines = {
    morning: 'EXECUTE THE PLAN. TRUST THE PROCESS.',
    afternoon: 'KEEP PUSHING. THE MARKET WAITS FOR NO ONE.',
    evening: 'REVIEW. REFINE. PREPARE FOR TOMORROW.',
    night: 'REST WELL. TOMORROW IS ANOTHER OPPORTUNITY.'
  }

  function getGreeting() {
    const now = new Date()
    const hours = now.getHours()
    if (hours >= 5 && hours < 12) return { greeting: 'GOOD MORNING', motivational: motivationalLines.morning }
    if (hours >= 12 && hours < 17) return { greeting: 'GOOD AFTERNOON', motivational: motivationalLines.afternoon }
    return { greeting: 'GOOD EVENING', motivational: motivationalLines.evening }
  }

  function formatDate(date: Date): string {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
    const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`
  }

  useEffect(() => {
    fetch('/data/team-status.json')
      .then(res => res.json())
      .then(data => {
        const merged = teamMembers.map(m => ({
          ...m,
          status: data[m.id]?.status || m.status,
          currentTask: data[m.id]?.currentTask || m.currentTask
        }))
        setTeamData(merged)
      })
      .catch(() => {})
  }, [])

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

  const refreshTopics = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-50 font-mono">
      {/* Sidebar - Left */}
      <aside className={`fixed top-0 left-0 w-64 h-full bg-[#111] border-r border-gray-700/30 z-50 transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="h-14 flex items-center px-4 border-b border-gray-700/30">
          <Zap className="w-6 h-6 text-gray-300" />
          <span className="text-gray-300 font-bold tracking-wider ml-2">MISSION</span>
        </div>
        
        <div className="p-2 space-y-1">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full p-3 flex items-center gap-3 transition-colors ${
                activeTab === item.id 
                  ? 'bg-gray-300/10 border-l-2 border-gray-300' 
                  : 'hover:bg-gray-700/20'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-gray-300' : 'text-gray-500'}`} />
              <span className={`text-sm font-bold ${activeTab === item.id ? 'text-gray-200' : 'text-gray-50'}`}>{item.label}</span>
            </button>
          ))}
        </div>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700/30">
          <p className="text-gray-500 text-xs tracking-wider mb-2">TEAM STATUS</p>
          <div className="space-y-2">
            {teamData.filter(m => m.status === 'working').map(member => (
              <div key={member.id} className="bg-gray-700/20 p-2 rounded">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 animate-pulse rounded-full" />
                  <span className="text-gray-200 text-xs">{member.name}</span>
                </div>
                <p className="text-gray-400 text-xs ml-4 truncate">{member.currentTask}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile menu button */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#111] rounded border border-gray-700/30">
        {sidebarOpen ? <X className="w-5 h-5 text-gray-300" /> : <Menu className="w-5 h-5 text-gray-300" />}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen p-4 md:p-6 pt-16 lg:pt-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="bg-[#111] border border-gray-700/30 p-3">
            <p className="text-gray-400 text-xs tracking-wider mb-1">TOTAL</p>
            <p className="text-2xl font-bold text-gray-200">{stats.total}</p>
          </div>
          <div className="bg-[#111] border border-gray-700/30 p-3">
            <p className="text-gray-400 text-xs tracking-wider mb-1">DONE</p>
            <p className="text-2xl font-bold text-green-500">{stats.done}</p>
          </div>
          <div className="bg-[#111] border border-gray-700/30 p-3">
            <p className="text-gray-400 text-xs tracking-wider mb-1">IN PROG</p>
            <p className="text-2xl font-bold text-blue-500">{stats.inProgress}</p>
          </div>
          <div className="bg-[#111] border border-gray-700/30 p-3">
            <p className="text-gray-400 text-xs tracking-wider mb-1">TODO</p>
            <p className="text-2xl font-bold text-gray-300">{stats.todo}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="SEARCH..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111] border border-gray-700/30 pl-10 pr-4 py-2 text-gray-50 placeholder-gray-600 focus:outline-none focus:border-gray-300 text-sm tracking-wider"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-1 mb-6">
          {(['all', 'in-progress', 'todo', 'done'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 text-xs tracking-wider transition-colors ${
                filterStatus === status 
                  ? 'bg-gray-300 text-black font-bold' 
                  : 'bg-[#111] text-gray-500 hover:text-gray-200'
              }`}
            >
              {status.toUpperCase().replace('-', ' ')}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* HOME */}
          {activeTab === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto">
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-200 tracking-tight">{getGreeting().greeting} <span className="text-gray-300">CHRIS</span></h1>
                <p className="text-gray-500 text-sm tracking-widest mt-1">{formatDate(new Date())}</p>
                <p className="text-gray-400 text-xs mt-3 border-l-2 border-gray-300 pl-3 tracking-wider">{getGreeting().motivational}</p>
              </div>

              <div className="bg-[#111] border border-gray-700/30 p-4 mb-4">
                <h2 className="text-xs text-gray-500 tracking-widest mb-3">WEATHER - CHENNAI</h2>
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-gray-200">{weather.temp}°C</span>
                  <div><p className="text-gray-400 text-sm">H: {weather.high}° / L: {weather.low}°</p><p className="text-gray-600 text-xs">{weather.condition}</p></div>
                </div>
              </div>

              <div className="bg-[#111] border border-gray-700/30 p-4 mb-4">
                <h2 className="text-xs text-gray-500 tracking-widest mb-3">VERSE OF THE DAY</h2>
                <p className="text-gray-300 text-sm leading-relaxed italic">"{verseOfTheDay.text}"</p>
                <p className="text-gray-500 text-xs mt-3">{verseOfTheDay.book} {verseOfTheDay.chapter}:{verseOfTheDay.verse} — {verseOfTheDay.translation}</p>
              </div>

              <div className="bg-[#111] border border-gray-700/30 p-4 mb-4">
                <h2 className="text-xs text-gray-500 tracking-widest mb-3">TODAY'S SCHEDULE</h2>
                {calendarEvents.map(e => (
                  <div key={e.id} className="flex justify-between py-2 border-b border-gray-700/20 last:border-0">
                    <span className="text-gray-200 text-sm">{e.title}</span>
                    <span className="text-gray-300 text-xs font-mono">{e.time}</span>
                  </div>
                ))}
              </div>

              <div className="bg-[#111] border border-gray-700/30 p-4">
                <h2 className="text-xs text-gray-500 tracking-widest mb-3">WORD OF THE DAY</h2>
                <div className="flex items-baseline gap-3"><span className="text-xl text-gray-200 font-bold">{wordOfTheDay.word}</span><span className="text-gray-500 text-xs font-mono">{wordOfTheDay.pronunciation}</span></div>
                <p className="text-gray-300 text-sm mt-2">{wordOfTheDay.definition}</p>
              </div>
            </motion.div>
          )}

          {/* PROJECTS */}
          {activeTab === 'projects' && (
            <motion.div key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              {filteredTasks.map(task => (
                <div key={task.id} className={`bg-[#111] border p-4 flex items-center justify-between ${task.status === 'done' ? 'border-green-900/30 opacity-60' : task.status === 'in-progress' ? 'border-blue-900/30' : 'border-gray-700/30'}`}>
                  <div className="flex items-center gap-3">
                    {task.status === 'done' ? <CheckCircle className="w-5 h-5 text-green-500" /> : task.status === 'in-progress' ? <Clock className="w-5 h-5 text-blue-500" /> : <Circle className="w-5 h-5 text-gray-500" />}
                    <span className={task.status === 'done' ? 'line-through text-gray-600' : ''}>{task.title}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 ${task.priority === 'high' ? 'bg-red-900/30 text-red-500' : task.priority === 'medium' ? 'bg-gray-700/30 text-gray-300' : 'bg-gray-700/10 text-gray-500'}`}>{task.priority.toUpperCase()}</span>
                </div>
              ))}
            </motion.div>
          )}

          {/* XMAX WORK */}
          {activeTab === 'xmax-work' && (
            <motion.div key="xmax-work" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {trendingTopics.map(topic => (
                  <button key={topic.id} onClick={() => setSelectedTopic(selectedTopic === topic.id ? null : topic.id)} className={`bg-[#111] border p-3 text-left ${selectedTopic === topic.id ? 'border-gray-300' : 'border-gray-700/30 hover:border-gray-500'}`}>
                    <p className="text-gray-200 text-sm font-bold">{topic.title}</p>
                    <p className="text-gray-600 text-xs mt-1">{topic.tweets.length} READY</p>
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {selectedTopic && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-[#111] border border-gray-300 p-4">
                    <p className="text-gray-300 text-sm mb-3">{trendingTopics.find(t => t.id === selectedTopic)?.tweets[0].text}</p>
                    <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(trendingTopics.find(t => t.id === selectedTopic)?.tweets[0].text || '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-300 text-black text-sm font-bold tracking-wider hover:bg-gray-200"><Twitter className="w-4 h-4" /> POST</a>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* BOOKMARKS */}
          {activeTab === 'bookmarks' && (
            <motion.div key="bookmarks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              {bookmarks.map(b => (
                <a key={b.id} href={b.url} target="_blank" rel="noopener noreferrer" className="bg-[#111] border border-gray-700/30 p-4 flex items-center justify-between hover:border-gray-300 transition-colors">
                  <div><p className="text-gray-200">{b.title}</p><p className="text-gray-600 text-xs">{b.url}</p></div>
                  <Bookmark className="w-5 h-5 text-gray-500" />
                </a>
              ))}
            </motion.div>
          )}

          {/* TEAM */}
          {activeTab === 'software-team' && (
            <motion.div key="team" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              <p className="text-gray-500 text-xs tracking-wider mb-2">TEAM STATUS</p>
              {teamData.map(member => (
                <div key={member.id} className="bg-[#111] border border-gray-700/30 p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 ${member.status === 'working' ? 'bg-green-500 animate-pulse' : member.status === 'blocked' ? 'bg-red-500' : 'bg-gray-600'}`} />
                    <div>
                      <p className="text-gray-200 font-bold text-sm">{member.name}</p>
                      <p className="text-gray-500 text-xs">{member.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {member.status === 'idle' || !member.currentTask ? (
                      <span className="text-gray-400 text-xs">Idle</span>
                    ) : (
                      <div>
                        <p className="text-gray-200 text-xs">{member.currentTask}</p>
                        <p className="text-gray-400 text-xs capitalize">{member.status}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* PRODUCTS */}
          {activeTab === 'products' && (
            <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="bg-[#111] border border-gray-700/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div><h3 className="text-xl text-gray-200 font-bold">MDIFY</h3><p className="text-gray-500 text-sm">Chrome Extension</p></div>
                  <a href="https://chromewebstore.google.com/detail/mdify/kimahdiiopfklhcciaiknnfcobamjeki" target="_blank" className="px-3 py-1 bg-gray-300 text-black text-sm font-bold">VIEW</a>
                </div>
                <p className="text-gray-300 text-sm mb-4">Convert any article to clean .md for AI agents.</p>
                <a href="https://twitter.com/intent/tweet?text=Stop%20pasting%20bloated%20links.%20Use%20%23Mdify%20to%20convert%20posts%20to%20clean%20.md%20for%20your%20AI%20agent." target="_blank" className="inline-flex items-center gap-2 px-3 py-1 border border-gray-300 text-gray-300 text-sm hover:bg-gray-300/10"><Twitter className="w-3 h-3" /> TWEET</a>
              </div>
              <div className="bg-[#111] border border-gray-700/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div><h3 className="text-xl text-gray-200 font-bold">GUARDSKILLS</h3><p className="text-gray-500 text-sm">NPM Package</p></div>
                  <a href="https://www.npmjs.com/package/guardskills" target="_blank" className="px-3 py-1 bg-gray-300 text-black text-sm font-bold">VIEW</a>
                </div>
                <p className="text-gray-300 text-sm mb-4">Scan AI skills for malicious code before installing.</p>
                <a href="https://twitter.com/intent/tweet?text=Stop%20risking%20your%20keys.%20Use%20%40guardskills_%20to%20scan%20AI%20skills%20for%20malicious%20code.%20Security%20matters." target="_blank" className="inline-flex items-center gap-2 px-3 py-1 border border-gray-300 text-gray-300 text-sm hover:bg-gray-300/10"><Twitter className="w-3 h-3" /> TWEET</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <div className="fixed inset-0 pointer-events-none z-0 opacity-5" style={{ backgroundImage: 'linear-gradient(amber 1px, transparent 1px), linear-gradient(90deg, amber 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    </div>
  )
}

export default function MissionControl() {
  return (
    <Suspense fallback={<div className='min-h-screen bg-[#0a0a0a] text-gray-50 font-mono p-6'>LOADING...</div>}>
      <MissionControlContent />
    </Suspense>
  )
}
