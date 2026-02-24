'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Search, BookOpen, Twitter, Bookmark, CheckCircle, Circle, Clock, Zap, ArrowUp, Flame, ExternalLink, TrendingUp, RefreshCw, Loader2 } from 'lucide-react'

// Default topics (shown before refresh)
const defaultTopics = [
  { id: 1, title: 'AI Breakthroughs 2026', source: 'MIT Tech Review', tweets: [{ text: "MIT just dropped '10 Breakthrough Technologies 2026'. AI agents are leading the charge.\n\nWe're witnessing the biggest tech shift since mobile. Are you ready?", hashtags: ['AI', 'Tech', 'Innovation'] }, { text: "Breakthrough tech alert 🚨\n\nThe technologies shaping 2026:\n• AI Agents\n• Autonomous systems\n• Clean energy\n\nBookmark this.", hashtags: ['Tech2026', 'Breakthrough'] }] },
  { id: 2, title: 'Gartner Tech Trends', source: 'Gartner', tweets: [{ text: "Gartner's Top 10 Tech Trends for 2026 are out.\n\nIf you're in tech, you NEED to know these.", hashtags: ['Gartner', 'TechTrends'] }, { text: "These 10 tech trends will define 2026.\n\nBookmark this. Share with your team.", hashtags: ['Tech', 'Gartner'] }] },
  { id: 3, title: 'AI Voice Agents', source: 'RingCentral', tweets: [{ text: "AI voice agents are having their moment.\n\nCall centers, customer support - all getting upgraded.\n\nThe future is voice-first.", hashtags: ['AI', 'VoiceAgents'] }, { text: "Hot take: AI voice agents will replace 80% of customer service reps by 2027.\n\nNot a threat - an upgrade.", hashtags: ['AI', 'VoiceTech'] }] },
  { id: 4, title: 'AI Coding Trends', source: 'GitHub Blog', tweets: [{ text: "12 AI Coding Emerging Trends for 2026:\n1. Agentic AI\n2. Autonomous coding\n3. Natural language → code\n\nThe dev landscape is changing fast.", hashtags: ['AI', 'Coding', 'DevTools'] }, { text: "AI coding isn't the future. It's the present.\n\nDevelopers using AI are 10x more productive.\n\nFacts.", hashtags: ['AI', 'Coding', 'Productivity'] }] },
  { id: 5, title: 'Agentic AI Era', source: 'Medium', tweets: [{ text: "2026 = The Orchestrator Era.\n\nAgentic coding is rewriting the SDLC.\n\nFrom writing code → to orchestrating AI agents.\n\nMind. Blown. 🤯", hashtags: ['AI', 'Agents', 'SDLC'] }, { text: "The shift: \nDevs writing code → Devs managing AI agents\n\nThis is the biggest change in software since... ever.", hashtags: ['AI', 'Agents', 'Future'] }] },
  { id: 6, title: 'Vibe Coding', source: 'MasteringAI', tweets: [{ text: "Vibe coding is the new trend.\n\nDescribe what you want. AI builds it.\n\nNo syntax. No bugs. Just vibes.", hashtags: ['VibeCoding', 'AI', 'Coding'] }, { text: "Vibe coding vs traditional coding:\n\nTraditional: write every line\nVibe: describe, iterate, ship\n\nBoth have a place.", hashtags: ['VibeCoding', 'AI', 'Dev'] }] }
]

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

// Trending topics from Exa search - Feb 2026
const trendingTopics = [
  { 
    id: 1, 
    title: 'AI Breakthroughs 2026', 
    source: 'MIT Tech Review',
    tweets: [
      { text: "MIT just dropped '10 Breakthrough Technologies 2026'. AI agents are leading the charge.\n\nWe're witnessing the biggest tech shift since mobile. Are you ready?", hashtags: ['AI', 'Tech', 'Innovation'] },
      { text: "Breakthrough tech alert 🚨\n\nThe technologies shaping 2026:\n• AI Agents\n• Autonomous systems\n• Clean energy\n\nBookmark this. You'll thank me later.", hashtags: ['Tech2026', 'Breakthrough'] }
    ]
  },
  { 
    id: 2, 
    title: 'Gartner Tech Trends', 
    source: 'Gartner',
    tweets: [
      { text: "Gartner's Top 10 Tech Trends for 2026 are out.\n\nIf you're in tech, you NEED to know these.\n\nThread 🧵👇", hashtags: ['Gartner', 'TechTrends', '2026'] },
      { text: "These 10 tech trends will define 2026.\n\nBookmark this. Share with your team.\n\nWhich one are you most excited about?", hashtags: ['Tech', 'Gartner'] }
    ]
  },
  { 
    id: 3, 
    title: 'AI Voice Agents', 
    source: 'RingCentral',
    tweets: [
      { text: "AI voice agents are having their moment.\n\nCall centers, customer support, personal assistants - all getting upgraded.\n\nThe future is voice-first.", hashtags: ['AI', 'VoiceAgents', 'Future'] },
      { text: "Hot take: AI voice agents will replace 80% of customer service reps by 2027.\n\nNot a threat - an upgrade.\n\nAgree or disagree? 👇", hashtags: ['AI', 'VoiceTech'] }
    ]
  },
  { 
    id: 4, 
    title: 'Hyperscale AI Data Centers', 
    source: 'MIT Tech Review',
    tweets: [
      { text: "Hyperscale AI data centers are consuming more energy than ever.\n\nThe irony: AI needs clean energy to be truly sustainable.\n\nBig opportunity here.", hashtags: ['AI', 'DataCenters', 'GreenTech'] },
      { text: "AI data centers are the new oil refineries.\n\nThe companies solving the energy problem will win big.\n\nBookmark this prediction. 📌", hashtags: ['AI', 'Energy', 'Tech'] }
    ]
  },
  { 
    id: 5, 
    title: 'Intelligent Apps', 
    source: 'Capgemini',
    tweets: [
      { text: "Every app is becoming 'intelligent' now.\n\nYour app needs AI. Not as a feature - as the foundation.\n\nIf it's not smart, it's obsolete.", hashtags: ['AI', 'Apps', 'Tech'] },
      { text: "The app store is dead. Long live the AI agent store.\n\nWe're witnessing the biggest platform shift since mobile.\n\nAre you building for it?", hashtags: ['AI', 'Apps', 'Platform'] }
    ]
  },
  { 
    id: 6, 
    title: 'AI Coding Trends', 
    source: 'GitHub Blog',
    tweets: [
      { text: "12 AI Coding Emerging Trends for 2026:\n\n1. Agentic AI\n2. Autonomous coding\n3. Natural language → code\n4. Automated testing\n\nThe dev landscape is changing fast.", hashtags: ['AI', 'Coding', 'DevTools'] },
      { text: "AI coding isn't the future. It's the present.\n\nDevelopers using AI are 10x more productive.\n\nThose who aren't? They're being left behind.\n\nFacts.", hashtags: ['AI', 'Coding', 'Productivity'] }
    ]
  },
  { 
    id: 7, 
    title: 'Agentic AI Era', 
    source: 'Medium',
    tweets: [
      { text: "2026 = The Orchestrator Era.\n\nAgentic coding is rewriting the SDLC.\n\nFrom writing code → to orchestrating AI agents.\n\nMind. Blown. 🤯", hashtags: ['AI', 'Agents', 'SDLC'] },
      { text: "The shift: \nDevs writing code → Devs managing AI agents\n\nThis is the biggest change in software since... ever.\n\nAre you ready to adapt?", hashtags: ['AI', 'Agents', 'Future'] }
    ]
  },
  { 
    id: 8, 
    title: 'Vibe Coding', 
    source: 'MasteringAI',
    tweets: [
      { text: "Vibe coding is the new trend.\n\nDescribe what you want. AI builds it.\n\nNo syntax. No bugs. Just vibes.\n\nIs this the end of traditional coding?", hashtags: ['VibeCoding', 'AI', 'Coding'] },
      { text: "Vibe coding vs traditional coding:\n\nTraditional: write every line\nVibe: describe, iterate, ship\n\nBoth have a place. Which wins?\n\n👇", hashtags: ['VibeCoding', 'AI', 'Dev'] }
    ]
  },
  { 
    id: 9, 
    title: 'Developer Productivity', 
    source: 'Octopus',
    tweets: [
      { text: "AI adoption is directly impacting developer productivity.\n\nCompanies using AI see 40%+ velocity increases.\n\nThe data doesn't lie.\n\n🚀", hashtags: ['AI', 'Productivity', 'Dev'] },
      { text: "Your developers are 40% more productive with AI.\n\nNot a guess - data.\n\nIf your team isn't using AI, you're falling behind.\n\nSimple.", hashtags: ['AI', 'Productivity', 'Tech'] }
    ]
  },
  { 
    id: 10, 
    title: 'AI Trends 2026', 
    source: 'Various',
    tweets: [
      { text: "7 AI trends to watch in 2026:\n\n1. Agentic AI\n2. Multimodal models\n3. Edge AI\n4. Open source dominance\n5. Custom fine-tuned models\n6. AI regulation\n7.垂直 AI\n\nSave. Share.", hashtags: ['AI', 'Trends', '2026'] },
      { text: "AI in 2026 = multimodal + agents + edge.\n\nWe're not talking chatbots anymore.\n\nWe're talking autonomous systems.\n\nThis is the year AI grows up.", hashtags: ['AI', 'Trends', 'Future'] }
    ]
  }
]

// Get tweet URL
const getTweetUrl = (text: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`

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
  const [trendingTopics, setTrendingTopics] = useState(defaultTopics)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshTopics = async () => {
    setIsRefreshing(true)
    try {
      const res = await fetch('/api/trending')
      const data = await res.json()
      if (data.success && data.topics) {
        setTrendingTopics(data.topics)
      }
    } catch (e) {
      console.error('Failed to refresh', e)
    }
    setIsRefreshing(false)
  }

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

              {/* AI Tweet Generator */}
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-400" />AI Tweet Generator</h2>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-4">
                <p className="text-sm text-blue-300 mb-2">✨ Tell me: "Generate viral tweet about [TOPIC]"</p>
                <p className="text-xs text-gray-400">I'll use Twitter's algorithm to optimize your tweet for maximum engagement!</p>
              </div>
              
              {/* Trending Topics - Click to Tweet */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-300 mb-1">🔥 Trending from Exa Search</p>
                  <p className="text-xs text-gray-400">Click any tweet to post instantly!</p>
                </div>
                <button 
                  onClick={refreshTopics}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm transition disabled:opacity-50"
                >
                  {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  Refresh
                </button>
              </div>
              
              {/* Trending Topics with Tweets */}
              {trendingTopics.map((topic) => (
                <div key={topic.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{topic.title}</h3>
                      <p className="text-xs text-gray-400">Source: {topic.source}</p>
                    </div>
                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">🔥 HOT</span>
                  </div>
                  
                  {/* 2 Tweets per topic */}
                  <div className="space-y-2">
                    {topic.tweets.map((tweet, idx) => (
                      <a 
                        key={idx}
                        href={getTweetUrl(tweet.text)}
                        target="_blank"
                        className="block bg-gray-800 rounded-lg p-3 hover:border-blue-500 border border-transparent transition"
                      >
                        <p className="text-sm text-gray-300 mb-2">{tweet.text}</p>
                        <div className="flex flex-wrap gap-1">
                          {tweet.hashtags.map(tag => (
                            <span key={tag} className="text-xs text-blue-400">#{tag}</span>
                          ))}
                        </div>
                        <div className="text-xs text-blue-400 mt-2">🐦 Click to tweet →</div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}

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
