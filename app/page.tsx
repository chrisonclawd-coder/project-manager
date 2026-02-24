'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Search, BookOpen, Twitter, Bookmark, CheckCircle, Circle, Clock, TrendingUp, Zap, ArrowUp, Flame } from 'lucide-react'

// X Strategy Data - Self-evolving
const xStrategyData = {
  // Current day sessions
  sessions: [
    { id: '1', name: 'Morning', time: '10:00 IST', status: 'done', topic: 'AI coding assistants', tweet: 'AI coding assistants are changing how we write code. Here are 5 tools I use daily...', stats: { likes: 45, retweets: 12, impressions: 2300 } },
    { id: '2', name: 'Afternoon', time: '15:00 IST', status: 'done', topic: 'Web performance', tweet: 'Web performance tips that actually work: 1. Lazy load images 2. Cache everything...', stats: { likes: 32, retweets: 8, impressions: 1800 } },
    { id: '3', name: 'Evening', time: '18:00 IST', status: 'pending', topic: '', tweet: '', stats: { likes: 0, retweets: 0, impressions: 0 } },
    { id: '4', name: 'Night', time: '21:00 IST', status: 'pending', topic: '', tweet: '', stats: { likes: 0, retweets: 0, impressions: 0 } }
  ],
  // Trending topics to post about
  trending: [
    { id: '1', title: 'AI/LLM Explainability', description: 'Steerling-8B explains every token', hot: true },
    { id: '2', title: 'Firefox XSS Protection', description: 'Goodbye InnerHTML, Hello SetHTML', hot: true },
    { id: '3', title: 'X86CSS', description: 'CPU emulator in pure CSS', hot: true },
    { id: '4', title: 'Secret Scanning', description: 'Find leaked API keys before hackers do', hot: false }
  ],
  // Best performing tweets (self-evolving)
  bestTweets: [
    { id: '1', text: 'AI coding assistants are changing how we write code...', engagement: 67, topic: 'AI coding' },
    { id: '2', text: 'Web performance tips that actually work...', engagement: 45, topic: 'Web performance' },
    { id: '3', text: '5 VS Code extensions every dev needs...', engagement: 38, topic: 'Dev tools' }
  ],
  // Weekly stats
  week: { tweets: 12, impressions: 45200, followers: 87, engagement: 4.2 }
}

// Types
type TaskStatus = 'todo' | 'in-progress' | 'done'
type TaskPriority = 'low' | 'medium' | 'high'

interface FlashcardTask {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority?: TaskPriority
  project: string
}

interface Bookmark {
  title: string
  url: string
  category: string
  description: string
  notes: string
}

interface Project {
  id: string
  name: string
  icon: string
  tasks: FlashcardTask[]
}

// Projects data
const projects: Project[] = [
  {
    id: 'leakguard',
    name: 'Leak Guard',
    icon: '🔒',
    tasks: [
      { id: '1', title: 'Create VS Code Extension', description: 'Set up extension structure', status: 'done', priority: 'high', project: 'leakguard' },
      { id: '2', title: 'Add Secret Patterns', description: '50+ API key patterns', status: 'done', priority: 'high', project: 'leakguard' },
      { id: '3', title: 'Add Context Menu', description: 'Right-click scan', status: 'done', priority: 'high', project: 'leakguard' },
      { id: '4', title: 'Add Redact Feature', description: 'One-click redact', status: 'done', priority: 'high', project: 'leakguard' },
      { id: '5', title: 'Test Extension', description: 'Test with real projects', status: 'todo', priority: 'high', project: 'leakguard' },
      { id: '6', title: 'Publish to Marketplace', description: 'Publish extension', status: 'todo', priority: 'medium', project: 'leakguard' },
    ]
  },
  {
    id: 'xstrategy',
    name: 'X Strategy',
    icon: '𝕏',
    tasks: [
      { id: '10', title: 'Morning Session (10am)', description: 'Engage + Post', status: 'done', priority: 'high', project: 'xstrategy' },
      { id: '11', title: 'Afternoon Session (3pm)', description: 'Engage + Post', status: 'done', priority: 'high', project: 'xstrategy' },
      { id: '12', title: 'Evening Session (6pm)', description: 'Engage + Post', status: 'todo', priority: 'high', project: 'xstrategy' },
      { id: '13', title: 'Night Session (9pm)', description: 'Growth insights', status: 'todo', priority: 'medium', project: 'xstrategy' },
    ]
  }
]

// Bookmarks
const bookmarks: Bookmark[] = [
  { title: 'OpenClaw 50 Days Workflows', url: 'https://gist.github.com/velvet-shark/b4c6724c391f612c4de4e9a07b0a74b6', category: 'Learning', description: '20+ automation workflows', notes: 'Reference for OpenClaw' },
  { title: 'VS Code Publish Guide', url: 'https://code.visualstudio.com/api/working-with-extensions/publishing-extension', category: 'Learning', description: 'How to publish extensions', notes: 'Need: Microsoft account, Azure PAT' },
]

const statusColors: Record<string, string> = {
  'todo': 'bg-gray-500',
  'in-progress': 'bg-blue-500',
  'done': 'bg-green-500',
}

const priorityBadges: Record<string, string> = {
  low: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
}

type FilterStatus = 'all' | TaskStatus

export default function MissionControl() {
  const [activeTab, setActiveTab] = useState<'flashcards' | 'xstrategy' | 'bookmarks'>('xstrategy')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [selectedProject, setSelectedProject] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Get all tasks
  const getAllTasks = (): FlashcardTask[] => {
    if (selectedProject === 'all') {
      return projects.flatMap(p => p.tasks)
    }
    return projects.find(p => p.id === selectedProject)?.tasks || []
  }

  // Filter tasks
  const getFilteredTasks = (): FlashcardTask[] => {
    return getAllTasks().filter(task => {
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter
      const matchesSearch = searchQuery === '' || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }

  const filteredTasks = getFilteredTasks()
  const doneTasks = filteredTasks.filter(t => t.status === 'done').length
  const inProgressTasks = filteredTasks.filter(t => t.status === 'in-progress').length
  const todoTasks = filteredTasks.filter(t => t.status === 'todo').length
  const totalTasks = getAllTasks().length

  // X Strategy helpers
  const pendingSessions = xStrategyData.sessions.filter(s => s.status === 'pending')
  const completedSessions = xStrategyData.sessions.filter(s => s.status === 'done')
  const bestTweet = xStrategyData.bestTweets[0]

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
      
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -256 }}
        animate={{ x: isSidebarOpen ? 0 : -256 }}
        className={`fixed lg:static z-50 w-64 bg-gray-900 border-r border-gray-800 h-screen flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              🎯
            </div>
            <div>
              <h1 className="text-lg font-bold">Mission Control</h1>
              <p className="text-gray-400 text-sm">Project Tracker</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 rounded-lg hover:bg-gray-800">✕</button>
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-2">
          <button onClick={() => setActiveTab('flashcards')} className={`w-full p-3 rounded-lg flex items-center gap-3 transition ${activeTab === 'flashcards' ? 'bg-blue-500/20 border border-blue-500/50' : 'hover:bg-gray-800'}`}>
            <BookOpen className="w-5 h-5" />
            <span>Projects</span>
            <span className="ml-auto text-xs bg-gray-800 px-2 py-1 rounded">{projects.length}</span>
          </button>
          
          <button onClick={() => setActiveTab('xstrategy')} className={`w-full p-3 rounded-lg flex items-center gap-3 transition ${activeTab === 'xstrategy' ? 'bg-blue-500/20 border border-blue-500/50' : 'hover:bg-gray-800'}`}>
            <Twitter className="w-5 h-5" />
            <span>X Strategy</span>
            <span className="ml-auto text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">{completedSessions.length}/4</span>
          </button>
          
          <button onClick={() => setActiveTab('bookmarks')} className={`w-full p-3 rounded-lg flex items-center gap-3 transition ${activeTab === 'bookmarks' ? 'bg-blue-500/20 border border-blue-500/50' : 'hover:bg-gray-800'}`}>
            <Bookmark className="w-5 h-5" />
            <span>Bookmarks</span>
            <span className="ml-auto text-xs bg-gray-800 px-2 py-1 rounded">{bookmarks.length}</span>
          </button>
        </div>

        {/* Projects List */}
        {activeTab === 'flashcards' && (
          <div className="p-4 border-t border-gray-800">
            <div className="text-xs text-gray-500 uppercase mb-2">Projects</div>
            <div className="space-y-1">
              <button onClick={() => setSelectedProject('all')} className={`w-full p-2 rounded-lg text-left text-sm flex items-center gap-2 ${selectedProject === 'all' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:bg-gray-800'}`}>
                📁 All Projects
              </button>
              {projects.map(project => (
                <button key={project.id} onClick={() => setSelectedProject(project.id)} className={`w-full p-2 rounded-lg text-left text-sm flex items-center gap-2 ${selectedProject === project.id ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:bg-gray-800'}`}>
                  {project.icon} {project.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto p-4 border-t border-gray-800">
          <div className="text-xs text-gray-500">Last sync: {new Date().toLocaleTimeString()}</div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 min-h-screen">
        <div className="lg:hidden p-4 bg-gray-900 border-b border-gray-800 flex items-center gap-4">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-lg bg-gray-800"><ChevronDown className="w-5 h-5" /></button>
          <h1 className="text-lg font-bold">Mission Control</h1>
        </div>

        <div className="p-6 lg:p-8">
          {/* Search */}
          {activeTab === 'flashcards' && (
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl focus:outline-none focus:border-blue-500" />
              </div>
            </div>
          )}

          {/* ===== X STRATEGY TAB ===== */}
          {activeTab === 'xstrategy' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-black border border-gray-700 flex items-center justify-center text-2xl">𝕏</div>
                  <div>
                    <h1 className="text-3xl font-bold">X Strategy</h1>
                    <p className="text-gray-400">{completedSessions.length}/4 sessions done today</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">+{xStrategyData.week.followers}</div>
                  <div className="text-sm text-gray-400">followers this week</div>
                </div>
              </div>

              {/* Quick Stats Row */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <div className="text-2xl font-bold">{xStrategyData.week.tweets}</div>
                  <div className="text-sm text-gray-400">Tweets</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <div className="text-2xl font-bold">{(xStrategyData.week.impressions / 1000).toFixed(1)}K</div>
                  <div className="text-sm text-gray-400">Impressions</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <div className="text-2xl font-bold text-green-400">{xStrategyData.week.engagement}%</div>
                  <div className="text-sm text-gray-400">Engagement</div>
                </div>
              </div>

              {/* Sessions - Minimal Cards */}
              <h2 className="text-lg font-semibold mb-4">Today's Sessions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {xStrategyData.sessions.map((session) => (
                  <div key={session.id} className={`rounded-xl p-4 border ${session.status === 'done' ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-900 border-gray-800'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg">{session.id === '1' ? '🌅' : session.id === '2' ? '☀️' : session.id === '3' ? '🌆' : '🌙'}</span>
                      {session.status === 'done' ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Circle className="w-5 h-5 text-gray-500" />}
                    </div>
                    <div className="font-semibold">{session.name}</div>
                    <div className="text-sm text-gray-400">{session.time}</div>
                    {session.status === 'done' && session.topic && (
                      <div className="mt-2 pt-2 border-t border-gray-700">
                        <div className="text-sm text-blue-400">#{session.topic}</div>
                        <div className="text-xs text-gray-500 mt-1">❤️ {session.stats.likes} 🔁 {session.stats.retweets}</div>
                      </div>
                    )}
                    {session.status === 'pending' && (
                      <div className="mt-2 pt-2 border-t border-gray-700">
                        <div className="text-xs text-gray-500">Pick a topic ↓</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Trending Topics - Pick One */}
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Pick a Topic
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {xStrategyData.trending.map((topic) => (
                  <div key={topic.id} className={`rounded-lg p-4 border cursor-pointer transition hover:border-blue-500 ${topic.hot ? 'bg-red-500/10 border-red-500/30' : 'bg-gray-900 border-gray-800'}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{topic.title}</span>
                      {topic.hot && <Flame className="w-4 h-4 text-red-400" />}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">{topic.description}</div>
                  </div>
                ))}
              </div>

              {/* Best Performer - What Works */}
              {bestTweet && (
                <>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <ArrowUp className="w-5 h-5 text-green-400" />
                    What Works Best
                  </h2>
                  <div className="bg-gray-900 rounded-xl p-4 border border-green-500/30 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-400 font-medium">#{bestTweet.topic}</span>
                      <span className="text-sm text-gray-400">• {bestTweet.engagement} engagement</span>
                    </div>
                    <p className="text-gray-300">"{bestTweet.text}"</p>
                  </div>
                </>
              )}

              {/* Quick Actions */}
              <div className="flex gap-3">
                <a href="https://twitter.com/intent/tweet" target="_blank" className="flex-1 bg-blue-500 hover:bg-blue-600 text-center py-3 rounded-lg font-medium transition">
                  ✏️ New Tweet
                </a>
                <a href="https://news.ycombinator.com/" target="_blank" className="flex-1 bg-gray-800 hover:bg-gray-700 text-center py-3 rounded-lg font-medium transition">
                  📰 Check HN
                </a>
              </div>
            </motion.div>
          )}

          {/* ===== PROJECTS TAB ===== */}
          {activeTab === 'flashcards' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl">
                    {selectedProject === 'all' ? '📋' : projects.find(p => p.id === selectedProject)?.icon || '📋'}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">{selectedProject === 'all' ? 'All Projects' : projects.find(p => p.id === selectedProject)?.name}</h1>
                    <p className="text-gray-400">{selectedProject === 'all' ? `${projects.length} projects, ${totalTasks} tasks` : `${getAllTasks().length} tasks`}</p>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button onClick={() => setStatusFilter('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${statusFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>All ({totalTasks})</button>
                <button onClick={() => setStatusFilter('in-progress')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${statusFilter === 'in-progress' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>In Progress ({getAllTasks().filter(t => t.status === 'in-progress').length})</button>
                <button onClick={() => setStatusFilter('todo')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${statusFilter === 'todo' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>Todo ({getAllTasks().filter(t => t.status === 'todo').length})</button>
                <button onClick={() => setStatusFilter('done')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${statusFilter === 'done' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>Done ({getAllTasks().filter(t => t.status === 'done').length})</button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800"><div className="flex items-center gap-4"><CheckCircle className="w-8 h-8 text-green-500" /><div><div className="text-2xl font-bold">{doneTasks}</div><div className="text-gray-400 text-sm">Completed</div></div></div></div>
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800"><div className="flex items-center gap-4"><Clock className="w-8 h-8 text-blue-500" /><div><div className="text-2xl font-bold">{inProgressTasks}</div><div className="text-gray-400 text-sm">In Progress</div></div></div></div>
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800"><div className="flex items-center gap-4"><Circle className="w-8 h-8 text-gray-500" /><div><div className="text-2xl font-bold">{todoTasks}</div><div className="text-gray-400 text-sm">Todo</div></div></div></div>
              </div>

              {/* Progress */}
              <div className="mb-8">
                <div className="flex justify-between text-sm mb-2"><span>Progress</span><span>{totalTasks > 0 ? ((doneTasks / totalTasks) * 100).toFixed(0) : 0}%</span></div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-blue-500 to-green-500" style={{ width: `${totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0}%` }} /></div>
              </div>

              {/* Tasks */}
              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <div key={task.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition">
                    <div className="flex items-start gap-3">
                      <span className={`w-2.5 h-2.5 rounded-full mt-2 ${statusColors[task.status]}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{task.title}</h3>
                          {task.priority && <span className={`px-2 py-0.5 rounded text-xs uppercase border ${priorityBadges[task.priority]}`}>{task.priority}</span>}
                        </div>
                        <p className="text-gray-400 text-sm">{task.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredTasks.length === 0 && <div className="text-center py-8 text-gray-500">No tasks found</div>}
              </div>
            </motion.div>
          )}

          {/* ===== BOOKMARKS TAB ===== */}
          {activeTab === 'bookmarks' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center text-2xl">🔖</div>
                <div>
                  <h1 className="text-3xl font-bold">Bookmarks</h1>
                  <p className="text-gray-400">Your saved links</p>
                </div>
              </div>

              {bookmarks.map((bookmark, idx) => (
                <a key={idx} href={bookmark.url} target="_blank" className="block bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-yellow-500/50 transition mb-4">
                  <div className="font-medium">{bookmark.title}</div>
                  <div className="text-sm text-gray-400 mt-1">{bookmark.description}</div>
                  {bookmark.notes && <div className="text-xs text-gray-500 mt-2">📝 {bookmark.notes}</div>}
                </a>
              ))}

              {bookmarks.length === 0 && <div className="text-center py-8 text-gray-500">No bookmarks</div>}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
