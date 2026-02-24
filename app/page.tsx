'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Search, BookOpen, Twitter, Bookmark, CheckCircle, Circle, Clock, TrendingUp, Plus } from 'lucide-react'

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

interface XSession {
  id: string
  name: string
  time: string
  description: string
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
      { id: '1', title: 'Create VS Code Extension', description: 'Set up extension structure with scanning logic', status: 'done', priority: 'high', project: 'leakguard' },
      { id: '2', title: 'Add Secret Patterns', description: 'Add 20+ API key patterns (OpenAI, AWS, GitHub, etc.)', status: 'done', priority: 'high', project: 'leakguard' },
      { id: '3', title: 'Add Context Menu', description: 'Right-click to scan files/folders', status: 'done', priority: 'high', project: 'leakguard' },
      { id: '4', title: 'Add Redact Feature', description: 'One-click to redact found secrets', status: 'done', priority: 'high', project: 'leakguard' },
      { id: '5', title: 'Test Extension', description: 'Test with real projects', status: 'todo', priority: 'high', project: 'leakguard' },
      { id: '6', title: 'Publish to VS Code Marketplace', description: 'Publish extension', status: 'todo', priority: 'medium', project: 'leakguard' },
    ]
  },
  {
    id: 'xstrategy',
    name: 'X Strategy',
    icon: '𝕏',
    tasks: [
      { id: '10', title: 'Morning Session (10am)', description: 'Engage + Post on trending topics', status: 'done', priority: 'high', project: 'xstrategy' },
      { id: '11', title: 'Afternoon Session (3pm)', description: 'Engage + Post on trending topics', status: 'done', priority: 'high', project: 'xstrategy' },
      { id: '12', title: 'Evening Session (6pm)', description: 'Engage + Post on trending topics', status: 'todo', priority: 'high', project: 'xstrategy' },
      { id: '13', title: 'Night Session (9pm)', description: 'Engage + Growth insights', status: 'todo', priority: 'medium', project: 'xstrategy' },
    ]
  }
]

const xSessions: XSession[] = [
  { id: '1', name: 'Morning Session', time: '10:00 IST', description: 'Engage + Post on trending topics' },
  { id: '2', name: 'Afternoon Session', time: '15:00 IST', description: 'Engage + Post on trending topics' },
  { id: '3', name: 'Evening Session', time: '18:00 IST', description: 'Engage + Post on trending topics' },
  { id: '4', name: 'Night Session', time: '21:00 IST', description: 'Engage + Growth insights' },
]

// Bookmarks - only Robin's bookmarks
const bookmarks: Bookmark[] = [
  { title: 'OpenClaw 50 Days Workflows', url: 'https://gist.github.com/velvet-shark/b4c6724c391f612c4de4e9a07b0a74b6', category: 'Learning', description: 'Companion prompts for YouTube video "OpenClaw after 50 days: 20 real workflows"', notes: 'Reference for OpenClaw automation patterns' },
  { title: 'VS Code Extension Publish Guide', url: 'https://code.visualstudio.com/api/working-with-extensions/publishing-extension', category: 'Learning', description: 'How to publish VS Code extensions to the Marketplace', notes: 'Need: Microsoft account, Azure PAT token, vsce package' },
]

const statusColors: Record<TaskStatus, string> = {
  'todo': 'bg-gray-500',
  'in-progress': 'bg-blue-500',
  'done': 'bg-green-500',
}

const priorityColors: Record<TaskPriority, string> = {
  low: 'text-gray-400',
  medium: 'text-yellow-400',
  high: 'text-red-400',
}

const priorityBadges: Record<TaskPriority, string> = {
  low: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
}

type FilterStatus = 'all' | TaskStatus

export default function MissionControl() {
  const [activeTab, setActiveTab] = useState<'flashcards' | 'xstrategy' | 'bookmarks'>('flashcards')
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

  // Filter bookmarks
  const getFilteredBookmarks = (): Bookmark[] => {
    return bookmarks.filter(b => 
      searchQuery === '' ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -256 }}
        animate={{ x: isSidebarOpen ? 0 : -256 }}
        className={`fixed lg:static z-50 w-64 bg-gray-900 border-r border-gray-800 h-screen flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              🎯
            </div>
            <div>
              <h1 className="text-lg font-bold">Mission Control</h1>
              <p className="text-gray-400 text-sm">Project Tracker</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-2">
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`w-full p-3 rounded-lg flex items-center gap-3 transition ${
              activeTab === 'flashcards' ? 'bg-blue-500/20 border border-blue-500/50' : 'hover:bg-gray-800'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>Projects</span>
            <span className="ml-auto text-xs bg-gray-800 px-2 py-1 rounded">{projects.length}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('xstrategy')}
            className={`w-full p-3 rounded-lg flex items-center gap-3 transition ${
              activeTab === 'xstrategy' ? 'bg-blue-500/20 border border-blue-500/50' : 'hover:bg-gray-800'
            }`}
          >
            <Twitter className="w-5 h-5" />
            <span>X Strategy</span>
            <span className="ml-auto text-xs bg-gray-800 px-2 py-1 rounded">4/day</span>
          </button>
          
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`w-full p-3 rounded-lg flex items-center gap-3 transition ${
              activeTab === 'bookmarks' ? 'bg-blue-500/20 border border-blue-500/50' : 'hover:bg-gray-800'
            }`}
          >
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
              <button
                onClick={() => setSelectedProject('all')}
                className={`w-full p-2 rounded-lg text-left text-sm flex items-center gap-2 ${
                  selectedProject === 'all' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:bg-gray-800'
                }`}
              >
                📁 All Projects
              </button>
              {projects.map(project => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project.id)}
                  className={`w-full p-2 rounded-lg text-left text-sm flex items-center gap-2 ${
                    selectedProject === project.id ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  {project.icon} {project.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto p-4 border-t border-gray-800">
          <div className="text-xs text-gray-500">
            Last sync: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 min-h-screen">
        {/* Header */}
        <div className="lg:hidden p-4 bg-gray-900 border-b border-gray-800 flex items-center gap-4">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-lg bg-gray-800">
            <ChevronDown className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">Mission Control</h1>
        </div>

        <div className="p-6 lg:p-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks and bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl focus:outline-none focus:border-blue-500 text-white placeholder-gray-500"
              />
            </div>
          </div>

          {/* Flashcards/Projects Tab */}
          {activeTab === 'flashcards' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl">
                    {selectedProject === 'all' ? '📋' : projects.find(p => p.id === selectedProject)?.icon || '📋'}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">
                      {selectedProject === 'all' ? 'All Projects' : projects.find(p => p.id === selectedProject)?.name}
                    </h1>
                    <p className="text-gray-400">
                      {selectedProject === 'all' ? `${projects.length} projects, ${totalTasks} tasks` : `${getAllTasks().length} tasks`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    statusFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  All ({totalTasks})
                </button>
                <button
                  onClick={() => setStatusFilter('in-progress')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    statusFilter === 'in-progress' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  In Progress ({getAllTasks().filter(t => t.status === 'in-progress').length})
                </button>
                <button
                  onClick={() => setStatusFilter('todo')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    statusFilter === 'todo' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  Todo ({getAllTasks().filter(t => t.status === 'todo').length})
                </button>
                <button
                  onClick={() => setStatusFilter('done')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    statusFilter === 'done' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  Done ({getAllTasks().filter(t => t.status === 'done').length})
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <div className="flex items-center gap-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <div>
                      <div className="text-2xl font-bold">{doneTasks}</div>
                      <div className="text-gray-400 text-sm">Completed</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <div className="flex items-center gap-4">
                    <Clock className="w-8 h-8 text-blue-500" />
                    <div>
                      <div className="text-2xl font-bold">{inProgressTasks}</div>
                      <div className="text-gray-400 text-sm">In Progress</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <div className="flex items-center gap-4">
                    <Circle className="w-8 h-8 text-gray-500" />
                    <div>
                      <div className="text-2xl font-bold">{todoTasks}</div>
                      <div className="text-gray-400 text-sm">Todo</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm mb-2">
                  <span>Overall Progress</span>
                  <span>{totalTasks > 0 ? ((doneTasks / filteredTasks.length) * 100).toFixed(0) : 0}%</span>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                    style={{ width: `${totalTasks > 0 ? (doneTasks / filteredTasks.length) * 100 : 0}%` }}
                  />
                </div>
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
                          {task.priority && (
                            <span className={`px-2 py-0.5 rounded text-xs uppercase border ${priorityBadges[task.priority]}`}>
                              {task.priority}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">{task.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No tasks found
                  </div>
                )}
              </div>

              {/* Edit Link */}
              <div className="mt-8 text-center">
                <a 
                  href="https://github.com/chrisonclawd-coder/project-manager/edit/main/app/page.tsx"
                  target="_blank"
                  className="text-blue-500 hover:underline text-sm"
                >
                  Edit Tasks on GitHub →
                </a>
              </div>
            </motion.div>
          )}

          {/* X Strategy Tab */}
          {activeTab === 'xstrategy' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-black border border-gray-700 flex items-center justify-center text-2xl">
                  𝕏
                </div>
                <div>
                  <h1 className="text-3xl font-bold">X Strategy</h1>
                  <p className="text-gray-400">4x Daily Growth Sessions</p>
                </div>
              </div>

              {/* Cron Schedule */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  Daily Schedule
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {xSessions.map((session) => (
                    <div key={session.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <div className="text-sm text-gray-400 mb-1">{session.time}</div>
                      <div className="font-semibold">{session.name}</div>
                      <div className="text-xs text-gray-500 mt-2">{session.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Session Files */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h2 className="text-lg font-semibold mb-4">Session Templates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a href="https://github.com/chrisonclawd-coder/project-manager/tree/main/sessions" target="_blank" className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition">
                    <div className="font-medium">📁 sessions/</div>
                    <div className="text-sm text-gray-400">Morning, Afternoon, Evening, Night templates</div>
                  </a>
                  <a href="https://github.com/chrisonclawd-coder/project-manager/tree/main/tweets" target="_blank" className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition">
                    <div className="font-medium">📁 tweets/</div>
                    <div className="text-sm text-gray-400">Tweet generator and templates</div>
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {/* Bookmarks Tab */}
          {activeTab === 'bookmarks' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center text-2xl">
                  🔖
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Bookmarks</h1>
                  <p className="text-gray-400">Your saved links</p>
                </div>
              </div>

              {getFilteredBookmarks().map((bookmark, idx) => (
                <a 
                  key={idx}
                  href={bookmark.url}
                  target="_blank"
                  className="block bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-yellow-500/50 transition mb-4"
                >
                  <div className="font-medium">{bookmark.title}</div>
                  <div className="text-sm text-gray-400 mt-1">{bookmark.description}</div>
                  {bookmark.notes && <div className="text-xs text-gray-500 mt-2">📝 {bookmark.notes}</div>}
                </a>
              ))}

              {getFilteredBookmarks().length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No bookmarks found
                </div>
              )}

              <div className="mt-8 text-center">
                <a 
                  href="https://github.com/chrisonclawd-coder/project-manager/edit/main/app/page.tsx"
                  target="_blank"
                  className="text-blue-500 hover:underline text-sm"
                >
                  Add Bookmark on GitHub →
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
