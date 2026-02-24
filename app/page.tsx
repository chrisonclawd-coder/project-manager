'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Search, BookOpen, Twitter, Bookmark, CheckCircle, Circle, Clock, Zap, ArrowUp, Flame, ExternalLink, TrendingUp } from 'lucide-react'

// X Strategy - Meaningful Data Only
// Update this data after each session
const xStrategyData = {
  // Today's sessions - mark as done when posted
  sessions: [
    { id: '1', name: 'Morning', time: '10am', status: 'done', topic: 'AI coding', likes: 45, rt: 12 },
    { id: '2', name: 'Afternoon', time: '3pm', status: 'done', topic: 'Web perf', likes: 32, rt: 8 },
    { id: '3', name: 'Evening', time: '6pm', status: 'pending', topic: '', likes: 0, rt: 0 },
    { id: '4', name: 'Night', time: '9pm', status: 'pending', topic: '', likes: 0, rt: 0 }
  ],
  // This week
  week: { tweets: 12, impressions: 45200, followers: 87 },
  // What performed best - update with actual top tweet
  bestTweet: { text: 'AI coding assistants are changing how we write code...', topic: 'AI coding', score: 67 }
}

// Pre-built tweet templates for quick posting
const tweetTemplates = [
  { id: 1, title: 'VS Code Tip', text: 'Pro tip: Use these VS Code shortcuts to 10x your productivity 🛠️\n\n1. Cmd+Shift+P: Command palette\n2. Cmd+D: Select next occurrence\n3. Cmd+Shift+L: Select all occurrences\n\nWhich one is your favorite?', tags: ['vscode', 'productivity', 'coding'] },
  { id: 2, title: 'AI Tool', text: 'Been using AI coding assistants daily. Here are my favorites:\n\n1. Cursor - AI-first VS Code\n2. GitHub Copilot - integrated everywhere\n3. Claude - great for reasoning\n\nWhich do you prefer?', tags: ['ai', 'coding', 'tools'] },
  { id: 3, title: 'Web Performance', text: 'Fast websites = better UX + SEO\n\nQuick wins:\n• Lazy load images\n• Minify CSS/JS\n• Use CDN\n\nWhat\'s your favorite optimization?', tags: ['webdev', 'performance', 'tips'] },
  { id: 4, title: 'Open Source', text: 'Just discovered a cool open source project. Love seeing what the community builds! 🌍\n\nWhat open source projects are you excited about?', tags: ['opensource', 'dev'] },
  { id: 5, title: 'Debugging', text: 'Spend more time debugging than writing code? Same 😅\n\nBest debugging tips:\n• Use console.log strategically\n• Breakpoints > print statements\n• Read error messages first\n\nWhat\'s your go-to?', tags: ['debugging', 'coding', 'tips'] }
]

// Quick tweet URLs
const getTweetUrl = (text: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`

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

const projects: Project[] = [
  { id: 'leakguard', name: 'Leak Guard', icon: '🔒', tasks: [
    { id: '1', title: 'VS Code Extension', description: 'Build and test', status: 'done', priority: 'high', project: 'leakguard' },
    { id: '2', title: 'Publish to Marketplace', description: 'Release extension', status: 'todo', priority: 'medium', project: 'leakguard' }
  ]}
]

const bookmarks: Bookmark[] = [
  { title: 'OpenClaw Workflows', url: 'https://gist.github.com/velvet-shark/b4c6724c391f612c4de4e9a07b0a74b6', category: 'Learning', description: '20+ automation workflows', notes: '' },
  { title: 'VS Code Publish', url: 'https://code.visualstudio.com/api/working-with-extensions/publishing-extension', category: 'Learning', description: 'How to publish', notes: '' }
]

const statusColors: Record<string, string> = { 'todo': 'bg-gray-500', 'in-progress': 'bg-blue-500', 'done': 'bg-green-500' }
const priorityBadges: Record<string, string> = { low: 'bg-gray-500/20 text-gray-400', medium: 'bg-yellow-500/20 text-yellow-400', high: 'bg-red-500/20 text-red-400' }

export default function MissionControl() {
  const [activeTab, setActiveTab] = useState<'flashcards' | 'xstrategy' | 'bookmarks'>('xstrategy')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [selectedProject, setSelectedProject] = useState<string>('leakguard')
  const [searchQuery, setSearchQuery] = useState('')

  const pendingSessions = xStrategyData.sessions.filter(s => s.status === 'pending')
  const completedSessions = xStrategyData.sessions.filter(s => s.status === 'done')

  const getAllTasks = () => selectedProject === 'all' ? projects.flatMap(p => p.tasks) : projects.find(p => p.id === selectedProject)?.tasks || []
  const filteredTasks = getAllTasks().filter(t => searchQuery === '' || t.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      {/* Mobile Overlay */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
      
      {/* Sidebar */}
      <motion.aside initial={{ x: -256 }} animate={{ x: isSidebarOpen ? 0 : -256 }} className={`fixed lg:static z-50 w-64 bg-gray-900 border-r border-gray-800 h-screen flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">🎯</div>
            <div><h1 className="text-lg font-bold">Mission Control</h1><p className="text-gray-400 text-sm">Project Tracker</p></div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 rounded-lg hover:bg-gray-800">✕</button>
        </div>

        <div className="p-4 space-y-2">
          <button onClick={() => setActiveTab('flashcards')} className={`w-full p-3 rounded-lg flex items-center gap-3 ${activeTab === 'flashcards' ? 'bg-blue-500/20 border border-blue-500/50' : 'hover:bg-gray-800'}`}><BookOpen className="w-5 h-5" /><span>Projects</span></button>
          <button onClick={() => setActiveTab('xstrategy')} className={`w-full p-3 rounded-lg flex items-center gap-3 ${activeTab === 'xstrategy' ? 'bg-blue-500/20 border border-blue-500/50' : 'hover:bg-gray-800'}`}><Twitter className="w-5 h-5" /><span>X Strategy</span><span className="ml-auto text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">{completedSessions.length}/4</span></button>
          <button onClick={() => setActiveTab('bookmarks')} className={`w-full p-3 rounded-lg flex items-center gap-3 ${activeTab === 'bookmarks' ? 'bg-blue-500/20 border border-blue-500/50' : 'hover:bg-gray-800'}`}><Bookmark className="w-5 h-5" /><span>Bookmarks</span></button>
        </div>

        <div className="mt-auto p-4 border-t border-gray-800"><div className="text-xs text-gray-500">{new Date().toLocaleDateString()}</div></div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 min-h-screen">
        <div className="lg:hidden p-4 bg-gray-900 border-b border-gray-800"><button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-lg bg-gray-800"><ChevronDown className="w-5 h-5" /></button></div>
        <div className="p-6 lg:p-8">

          {/* ===== X STRATEGY TAB ===== */}
          {activeTab === 'xstrategy' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-black border border-gray-700 flex items-center justify-center text-2xl">𝕏</div>
                  <div><h1 className="text-3xl font-bold">X Strategy</h1><p className="text-gray-400">{pendingSessions.length} sessions left today</p></div>
                </div>
                <div className="text-right"><div className="text-2xl font-bold text-green-400">+{xStrategyData.week.followers}</div><div className="text-sm text-gray-400">followers</div></div>
              </div>

              {/* Week Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center"><div className="text-2xl font-bold">{xStrategyData.week.tweets}</div><div className="text-sm text-gray-400">tweets</div></div>
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center"><div className="text-2xl font-bold">{(xStrategyData.week.impressions/1000).toFixed(1)}K</div><div className="text-sm text-gray-400">impressions</div></div>
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center"><div className="text-2xl font-bold text-green-400">+{xStrategyData.week.followers}</div><div className="text-sm text-gray-400">new</div></div>
              </div>

              {/* Today's Sessions */}
              <h2 className="text-lg font-semibold mb-4">Today's Sessions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {xStrategyData.sessions.map((s) => (
                  <a key={s.id} href={s.status === 'pending' ? 'https://twitter.com/intent/tweet' : undefined} target={s.status === 'pending' ? '_blank' : undefined} className={`rounded-xl p-4 border ${s.status === 'done' ? 'bg-green-500/10 border-green-500/30 cursor-default' : 'bg-gray-900 border-gray-800 hover:border-blue-500 cursor-pointer'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg">{s.id === '1' ? '🌅' : s.id === '2' ? '☀️' : s.id === '3' ? '🌆' : '🌙'}</span>
                      {s.status === 'done' ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Circle className="w-5 h-5 text-gray-500" />}
                    </div>
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-sm text-gray-400">{s.time}</div>
                    {s.status === 'done' && s.topic && <div className="mt-2 pt-2 border-t border-gray-700"><div className="text-sm text-blue-400">#{s.topic}</div><div className="text-xs text-gray-500">❤️ {s.likes} 🔁 {s.rt}</div></div>}
                    {s.status === 'pending' && <div className="mt-2 pt-2 border-t border-gray-700"><div className="text-xs text-blue-400">Click to post →</div></div>}
                  </a>
                ))}
              </div>

              {/* Quick Post Templates */}
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-400" />Quick Post</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                {tweetTemplates.map((t) => (
                  <a key={t.id} href={getTweetUrl(t.text)} target="_blank" className="bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-blue-500 transition">
                    <div className="font-medium mb-1">{t.title}</div>
                    <div className="text-xs text-gray-400 line-clamp-2">{t.text.substring(0, 80)}...</div>
                    <div className="flex flex-wrap gap-1 mt-2">{t.tags.map(tag => <span key={tag} className="text-xs text-blue-400">#{tag}</span>)}</div>
                  </a>
                ))}
              </div>

              {/* Best Performer */}
              {xStrategyData.bestTweet && (
                <div className="bg-gray-900 rounded-xl p-4 border border-green-500/30">
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><ArrowUp className="w-5 h-5 text-green-400" />Top Performer</h2>
                  <p className="text-gray-300 mb-2">"{xStrategyData.bestTweet.text}"</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400"><span className="text-blue-400">#{xStrategyData.bestTweet.topic}</span><span>Score: {xStrategyData.bestTweet.score}</span></div>
                </div>
              )}
            </motion.div>
          )}

          {/* ===== PROJECTS TAB ===== */}
          {activeTab === 'flashcards' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl">🔒</div>
                <div><h1 className="text-3xl font-bold">Leak Guard</h1><p className="text-gray-400">{getAllTasks().length} tasks</p></div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                {['all', 'todo', 'done'].map(f => (
                  <button key={f} className={`px-4 py-2 rounded-lg text-sm ${searchQuery === f ? 'bg-blue-500' : 'bg-gray-800'}`} onClick={() => setSearchQuery(f)}>{f}</button>
                ))}
              </div>

              {/* Tasks */}
              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <div key={task.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                    <div className="flex items-center gap-3">
                      <span className={`w-2.5 h-2.5 rounded-full ${statusColors[task.status]}`} />
                      <div className="flex-1"><div className="font-medium">{task.title}</div><div className="text-sm text-gray-400">{task.description}</div></div>
                      <span className={`px-2 py-1 rounded text-xs ${priorityBadges[task.priority || 'medium']}`}>{task.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ===== BOOKMARKS TAB ===== */}
          {activeTab === 'bookmarks' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center text-2xl">🔖</div>
                <div><h1 className="text-3xl font-bold">Bookmarks</h1><p className="text-gray-400">{bookmarks.length} saved</p></div>
              </div>

              {bookmarks.map((b, i) => (
                <a key={i} href={b.url} target="_blank" className="block bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-yellow-500/50 mb-4">
                  <div className="font-medium">{b.title}</div>
                  <div className="text-sm text-gray-400 mt-1">{b.description}</div>
                </a>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
