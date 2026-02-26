'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, BookOpen, Twitter, Bookmark, CheckCircle, Circle, Clock, Zap, Menu, Users, Package, Target, Home as HomeIcon, X, MessageCircle, Sun, Moon } from 'lucide-react'

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
  const [darkMode, setDarkMode] = useState(true)

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
    <div className={`min-h-screen font-sans transition-colors duration-200 ${
      darkMode 
        ? 'bg-[#0a0a0a] text-gray-50' 
        : 'bg-white text-gray-900'
    }`}>
      {/* Sidebar - Left */}
      <aside className={`fixed top-0 left-0 w-64 h-full z-50 transform transition-colors duration-200 ${
        darkMode 
          ? 'bg-[#111] border-gray-700/30' 
          : 'bg-white border-gray-200'
      } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className={`h-14 flex items-center justify-between px-4 border-b transition-colors duration-200 ${
          darkMode ? 'border-gray-700/30' : 'border-gray-200'
        }`}>
          <div className="flex items-center">
            <Zap className={`w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
            <span className={`font-bold tracking-wider ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>MISSION</span>
          </div>
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            {darkMode ? <Sun className="w-5 h-5 text-gray-300" /> : <Moon className="w-5 h-5 text-gray-700" />}
          </button>
        </div>
        
        {/* Theme Toggle */}
        <div className={`p-4 border-b transition-colors duration-200 ${
          darkMode ? 'border-gray-700/30' : 'border-gray-200'
        }`}>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-full p-2 flex items-center justify-center gap-2 transition-colors ${
              darkMode 
                ? 'bg-gray-700/30 text-yellow-400 hover:bg-gray-700/50' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="text-xs font-bold tracking-wider">
              {darkMode ? 'LIGHT MODE' : 'DARK MODE'}
            </span>
          </button>
        </div>
        
        <div className="p-2 space-y-1">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full p-3 flex items-center gap-3 transition-colors ${
                activeTab === item.id 
                  ? darkMode ? 'bg-gray-300/10 border-l-2 border-gray-300' : 'bg-gray-800/10 border-l-2 border-gray-800' 
                  : darkMode ? 'hover:bg-gray-700/20' : 'hover:bg-gray-200'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? (darkMode ? 'text-gray-300' : 'text-gray-800') : (darkMode ? 'text-gray-500' : 'text-gray-400')}`} />
              <span className={`text-sm font-bold ${activeTab === item.id ? (darkMode ? 'text-gray-200' : 'text-gray-800') : (darkMode ? 'text-gray-50' : 'text-gray-700')}`}>{item.label}</span>
            </button>
          ))}
        </div>
        
        <div className={`absolute bottom-0 w-full p-4 border-t transition-colors duration-200 ${
          darkMode ? 'border-gray-700/30' : 'border-gray-200'
        }`}>
          <p className={`text-xs tracking-wider mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>TEAM STATUS</p>
          <div className="space-y-2">
            {teamData.filter(m => m.status === 'working').map(member => (
              <div key={member.id} className={darkMode ? 'bg-gray-700/20 p-2 rounded' : 'bg-gray-200 p-2 rounded'}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 animate-pulse rounded-full" />
                  <span className={darkMode ? 'text-gray-200 text-xs' : 'text-gray-800 text-xs'}>{member.name}</span>
                </div>
                <p className={`text-xs ml-4 truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{member.currentTask}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile menu button */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`lg:hidden fixed top-4 left-4 z-50 p-2 rounded border transition-colors duration-200 ${
        darkMode ? 'bg-[#111] border-gray-700/30' : 'bg-white border-gray-200'
      }`}>
        {sidebarOpen ? <X className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`} /> : <Menu className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`} />}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen p-4 md:p-6 pt-16 lg:pt-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className={`border p-3 transition-colors duration-200 ${
            darkMode ? 'bg-[#111] border-gray-700/30' : 'bg-white border-gray-200'
          }`}>
            <p className={`text-xs tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>TOTAL</p>
            <p className={`text-2xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{stats.total}</p>
          </div>
          <div className={`border p-3 transition-colors duration-200 ${
            darkMode ? 'bg-[#111] border-gray-700/30' : 'bg-white border-gray-200'
          }`}>
            <p className={`text-xs tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>DONE</p>
            <p className={`text-2xl font-bold ${darkMode ? 'text-green-500' : 'text-green-600'}`}>{stats.done}</p>
          </div>
          <div className={`border p-3 transition-colors duration-200 ${
            darkMode ? 'bg-[#111] border-gray-700/30' : 'bg-white border-gray-200'
          }`}>
            <p className={`text-xs tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>IN PROG</p>
            <p className={`text-2xl font-bold ${darkMode ? 'text-blue-500' : 'text-blue-600'}`}>{stats.inProgress}</p>
          </div>
          <div className={`border p-3 transition-colors duration-200 ${
            darkMode ? 'bg-[#111] border-gray-700/30' : 'bg-white border-gray-200'
          }`}>
            <p className={`text-xs tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>TODO</p>
            <p className={`text-2xl font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{stats.todo}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="SEARCH..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full border pl-10 pr-4 py-2 transition-colors duration-200 placeholder-gray-600 focus:outline-none text-sm tracking-wider ${
              darkMode 
                ? 'bg-[#111] border-gray-700/30 text-gray-50' 
                : 'bg-white border-gray-200 text-gray-900'
            }`}
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
                  ? darkMode ? 'bg-gray-300 text-black font-bold' : 'bg-gray-800 text-white font-bold'
                  : darkMode 
                    ? 'bg-[#111] text-gray-500 hover:text-gray-200' 
                    : 'bg-white text-gray-500 hover:text-gray-800'
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
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{getGreeting().greeting} <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>CHRIS</span></h1>
                <p className={`text-sm tracking-widest mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{formatDate(new Date())}</p>
                <p className={`text-xs mt-3 border-l-2 pl-3 tracking-wider ${darkMode ? 'text-gray-400 border-gray-300' : 'text-gray-600 border-gray-600'}`}>{getGreeting().motivational}</p>
              </div>

              <div className={`border p-4 mb-4 transition-colors duration-200 ${
                darkMode ? 'bg-[#111] border-gray-700/30' : 'bg-white border-gray-200'
              }`}>
                <h2 className={`text-xs tracking-widest mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>WEATHER - CHENNAI</h2>
                <div className="flex items-baseline gap-4">
                  <span className={`text-4xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{weather.temp}°C</span>
                  <div><p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>H: {weather.high}° / L: {weather.low}°</p><p className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>{weather.condition}</p></div>
                </div>
              </div>

              <div className={`border p-4 mb-4 transition-colors duration-200 ${
                darkMode ? 'bg-[#111] border-gray-700/30' : 'bg-white border-gray-200'
              }`}>
                <h2 className={`text-xs tracking-widest mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>VERSE OF THE DAY</h2>
                <p className={`text-sm leading-relaxed italic ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>"{verseOfTheDay.text}"</p>
                <p className={`text-xs mt-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{verseOfTheDay.book} {verseOfTheDay.chapter}:{verseOfTheDay.verse} — {verseOfTheDay.translation}</p>
              </div>

              <div className={`border p-4 mb-4 transition-colors duration-200 ${
                darkMode ? 'bg-[#111] border-gray-700/30' : 'bg-white border-gray-200'
              }`}>
                <h2 className={`text-xs tracking-widest mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>TODAY'S SCHEDULE</h2>
                {calendarEvents.map(e => (
                  <div key={e.id} className={`flex justify-between py-2 ${darkMode ? 'border-gray-700/20' : 'border-gray-200'} last:border-0 border-b`}>
                    <span className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{e.title}</span>
                    <span className={`text-xs font-sans ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{e.time}</span>
                  </div>
                ))}
              </div>

              <div className={`border p-4 transition-colors duration-200 ${
                darkMode ? 'bg-[#111] border-gray-700/30' : 'bg-white border-gray-200'
              }`}>
                <h2 className={`text-xs tracking-widest mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>WORD OF THE DAY</h2>
                <div className="flex items-baseline gap-3"><span className={`text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{wordOfTheDay.word}</span><span className={`text-xs font-sans ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{wordOfTheDay.pronunciation}</span></div>
                <p className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{wordOfTheDay.definition}</p>
              </div>
            </motion.div>
          )}

          {/* PROJECTS */}
          {activeTab === 'projects' && (
            <motion.div key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              {filteredTasks.map(task => (
                <div key={task.id} className={`border p-4 flex items-center justify-between transition-colors duration-200 ${
                  darkMode 
                    ? task.status === 'done' ? 'border-green-900/30 opacity-60' : task.status === 'in-progress' ? 'border-blue-900/30' : 'border-gray-700/30'
                    : task.status === 'done' ? 'border-green-200 opacity-60' : task.status === 'in-progress' ? 'border-blue-200' : 'border-gray-200'
                } ${darkMode ? 'bg-[#111]' : 'bg-white'}`}>
                  <div className="flex items-center gap-3">
                    {task.status === 'done' ? <CheckCircle className={`w-5 h-5 ${darkMode ? 'text-green-500' : 'text-green-600'}`} /> : task.status === 'in-progress' ? <Clock className={`w-5 h-5 ${darkMode ? 'text-blue-500' : 'text-blue-600'}`} /> : <Circle className={`w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />}
                    <span className={task.status === 'done' ? (darkMode ? 'line-through text-gray-600' : 'line-through text-gray-400') : (darkMode ? 'text-gray-200' : 'text-gray-800')}>{task.title}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 ${
                    task.priority === 'high' 
                      ? darkMode ? 'bg-red-900/30 text-red-500' : 'bg-red-100 text-red-600'
                      : task.priority === 'medium'
                        ? darkMode ? 'bg-gray-700/30 text-gray-300' : 'bg-gray-200 text-gray-600'
                        : darkMode ? 'bg-gray-700/10 text-gray-500' : 'bg-gray-100 text-gray-400'
                  }`}>{task.priority.toUpperCase()}</span>
                </div>
              ))}
            </motion.div>
          )}

          {/* XMAX WORK */}
          {activeTab === 'xmax-work' && (
            <motion.div key="xmax-work" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              {/* Section 1: X Growth Strategy */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-200 tracking-wider border-l-4 border-gray-300 pl-3">X GROWTH STRATEGY</h2>
                  <button onClick={refreshTopics} disabled={isRefreshing} className="px-3 py-1 text-xs {darkMode ? 'bg-[#111]' : 'bg-white'} border border-gray-700/30 text-gray-400 hover:text-gray-200 hover:border-gray-300 transition-colors">
                    {isRefreshing ? 'REFRESHING...' : 'REFRESH'}
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                  {trendingTopics.map(topic => (
                    <button key={topic.id} onClick={() => setSelectedTopic(selectedTopic === topic.id ? null : topic.id)} className={`{darkMode ? 'bg-[#111]' : 'bg-white'} border p-3 text-left transition-all ${selectedTopic === topic.id ? 'border-gray-300 bg-gray-900/50' : 'border-gray-700/30 hover:border-gray-500'}`}>
                      <p className="text-gray-200 text-sm font-bold">{topic.title}</p>
                      <p className="text-gray-600 text-xs mt-1">{topic.source}</p>
                    </button>
                  ))}
                </div>
                <AnimatePresence>
                  {selectedTopic && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="{darkMode ? 'bg-[#111]' : 'bg-white'} border border-gray-300 p-4">
                      <p className="text-gray-300 text-sm mb-4">{trendingTopics.find(t => t.id === selectedTopic)?.tweets[0].text}</p>
                      <div className="flex gap-3">
                        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(trendingTopics.find(t => t.id === selectedTopic)?.tweets[0].text || '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-300 text-black text-sm font-bold tracking-wider hover:bg-gray-200"><Twitter className="w-4 h-4" /> POST TO X</a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              {/* Section 2: Marketing */}
              <section>
                <h2 className="text-lg font-bold text-gray-200 tracking-wider border-l-4 border-gray-300 pl-3 mb-4">MARKETING</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Mdify */}
                  <div className={`${darkMode ? 'bg-[#111]' : 'bg-white'} border ${darkMode ? 'border-gray-700/30' : 'border-gray-200'} p-4`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-lg text-gray-200 font-bold">MDIFY</h3>
                        <p className="text-gray-500 text-xs">Chrome Extension</p>
                      </div>
                      <a href="https://chromewebstore.google.com/detail/mdify/kimahdiiopfklhcciaiknnfcobamjeki" target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-gray-300 text-black text-xs font-bold">VIEW</a>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">Convert any article to clean .md for AI agents.</p>
                    <div className="space-y-3">
                      <div className="border border-gray-700/30 p-3">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-gray-500 text-xs">X POST</p>
                          <p className="text-gray-600 text-xs">280 chars</p>
                        </div>
                        <p className="text-gray-300 text-sm">"Stop pasting bloated links. Use #Mdify to convert posts to clean .md for your AI agent."</p>
                        <a href="https://twitter.com/intent/tweet?text=Stop%20pasting%20bloated%20links.%20Use%20%23Mdify%20to%20convert%20posts%20to%20clean%20.md%20for%20your%20AI%20agent." target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-2 px-3 py-1 border border-gray-300 text-gray-300 text-xs hover:bg-gray-300/10"><Twitter className="w-3 h-3" /> POST</a>
                      </div>
                      <div className="border border-gray-700/30 p-3">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-gray-500 text-xs">REDDIT POST</p>
                          <p className="text-gray-600 text-xs">500+ chars</p>
                        </div>
                        <p className="text-gray-300 text-xs">"I've been using this Chrome extension and it's been a game changer for my AI workflows. No more messy copy-paste, just clean .md files ready for any AI agent to process."</p>
                      </div>
                    </div>
                  </div>
                  {/* Guardskills */}
                  <div className="{darkMode ? 'bg-[#111]' : 'bg-white'} border border-gray-700/30 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-lg text-gray-200 font-bold">GUARDSKILLS</h3>
                        <p className="text-gray-500 text-xs">NPM Package</p>
                      </div>
                      <a href="https://www.npmjs.com/package/guardskills" target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-gray-300 text-black text-xs font-bold">VIEW</a>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">Scan AI skills for malicious code before installing.</p>
                    <div className="space-y-3">
                      <div className="border border-gray-700/30 p-3">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-gray-500 text-xs">X POST</p>
                          <p className="text-gray-600 text-xs">280 chars</p>
                        </div>
                        <p className="text-gray-300 text-sm">"Stop risking your keys. Use @guardskills_ to scan AI skills for malicious code. Security matters."</p>
                        <a href="https://twitter.com/intent/tweet?text=Stop%20risking%20your%20keys.%20Use%20%40guardskills_%20to%20scan%20AI%20skills%20for%20malicious%20code.%20Security%20matters." target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-2 px-3 py-1 border border-gray-300 text-gray-300 text-xs hover:bg-gray-300/10"><Twitter className="w-3 h-3" /> POST</a>
                      </div>
                      <div className="border border-gray-700/30 p-3">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-gray-500 text-xs">REDDIT POST</p>
                          <p className="text-gray-600 text-xs">500+ chars</p>
                        </div>
                        <p className="text-gray-300 text-xs">"Worried about malicious AI skills? This NPM package scans AI skills for malicious code before you install them. Protect your API keys and your AI workflows."</p>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-xs mt-4 text-center">SCHEDULE: 2 posts/day per product (rotating)</p>
              </section>
            </motion.div>
          )}

          {/* BOOKMARKS */}
          {activeTab === 'bookmarks' && (
            <motion.div key="bookmarks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              {bookmarks.map(b => (
                <a key={b.id} href={b.url} target="_blank" rel="noopener noreferrer" className="{darkMode ? 'bg-[#111]' : 'bg-white'} border border-gray-700/30 p-4 flex items-center justify-between hover:border-gray-300 transition-colors">
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
                <div key={member.id} className="{darkMode ? 'bg-[#111]' : 'bg-white'} border border-gray-700/30 p-3 flex items-center justify-between">
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
              <div className="{darkMode ? 'bg-[#111]' : 'bg-white'} border border-gray-700/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div><h3 className="text-xl text-gray-200 font-bold">MDIFY</h3><p className="text-gray-500 text-sm">Chrome Extension</p></div>
                  <a href="https://chromewebstore.google.com/detail/mdify/kimahdiiopfklhcciaiknnfcobamjeki" target="_blank" className="px-3 py-1 bg-gray-300 text-black text-sm font-bold">VIEW</a>
                </div>
                <p className="text-gray-300 text-sm mb-4">Convert any article to clean .md for AI agents.</p>
                <a href="https://twitter.com/intent/tweet?text=Stop%20pasting%20bloated%20links.%20Use%20%23Mdify%20to%20convert%20posts%20to%20clean%20.md%20for%20your%20AI%20agent." target="_blank" className="inline-flex items-center gap-2 px-3 py-1 border border-gray-300 text-gray-300 text-sm hover:bg-gray-300/10"><Twitter className="w-3 h-3" /> TWEET</a>
              </div>
              <div className="{darkMode ? 'bg-[#111]' : 'bg-white'} border border-gray-700/30 p-6">
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
    <Suspense fallback={<div className='min-h-screen bg-[#0a0a0a] text-gray-50 font-sans p-6'>LOADING...</div>}>
      <MissionControlContent />
    </Suspense>
  )
}
