'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, BookOpen, Twitter, Bookmark, CheckCircle, Circle, Clock, TrendingUp } from 'lucide-react'

// Import data from JSON files
import bookmarksData from '../data/bookmarks.json'
import flashcardsTasksData from '../flashcards-tasks.md'

// Types
interface FlashcardTask {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
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

// Parse markdown tasks
function parseMarkdownTasks(markdown: string): FlashcardTask[] {
  const tasks: FlashcardTask[] = []
  const lines = markdown.split('\n')
  let currentStatus: 'todo' | 'in-progress' | 'done' = 'todo'
  
  for (const line of lines) {
    if (line.includes('## In Progress')) {
      currentStatus = 'in-progress'
    } else if (line.includes('## Todo')) {
      currentStatus = 'todo'
    } else if (line.includes('## Completed')) {
      currentStatus = 'done'
    } else if (line.startsWith('- [ ]')) {
      const title = line.replace('- [ ] ', '').split(' - ')[0].trim()
      const description = line.includes(' - ') ? line.split(' - ')[1] : ''
      if (title) {
        tasks.push({
          id: `todo-${tasks.length}`,
          title,
          description,
          status: currentStatus
        })
      }
    } else if (line.startsWith('- [x]')) {
      const title = line.replace('- [x] ', '').split(' - ')[0].trim()
      const description = line.includes(' - ') ? line.split(' - ')[1] : ''
      if (title) {
        tasks.push({
          id: `done-${tasks.length}`,
          title,
          description,
          status: 'done'
        })
      }
    }
  }
  return tasks
}

const xSessions: XSession[] = [
  { id: '1', name: 'Morning Session', time: '10:00 IST', description: 'Engage + Post on trending topics' },
  { id: '2', name: 'Afternoon Session', time: '15:00 IST', description: 'Engage + Post on trending topics' },
  { id: '3', name: 'Evening Session', time: '18:00 IST', description: 'Engage + Post on trending topics' },
  { id: '4', name: 'Night Session', time: '21:00 IST', description: 'Engage + Growth insights' },
]

// Use data from JSON files
const bookmarks: Bookmark[] = bookmarksData.bookmarks

const flashcardTasks: FlashcardTask[] = parseMarkdownTasks(flashcardsTasksData)
  { id: '4', title: 'Test Extension', description: 'Test on real websites', status: 'todo' },
  { id: '5', title: 'Submit to Chrome Web Store', description: 'Prepare for submission', status: 'todo' },
  { id: '6', title: 'Project Setup & Structure', description: 'Set up folder structure', status: 'done' },
  { id: '7', title: 'Build System Fix (Windows)', description: 'Fix build script for Windows', status: 'done' },
  { id: '8', title: 'Manifest.json Fix', description: 'Reference .js files instead of .ts', status: 'done' },
  { id: '9', title: 'HTML Files Copy Fix', description: 'Add HTML files to dist', status: 'done' },
]

const statusColors = {
  'todo': 'bg-gray-500',
  'in-progress': 'bg-blue-500',
  'done': 'bg-green-500',
}

export default function MissionControl() {
  const [activeTab, setActiveTab] = useState<'flashcards' | 'xstrategy' | 'bookmarks'>('flashcards')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const doneTasks = flashcardTasks.filter(t => t.status === 'done').length
  const inProgressTasks = flashcardTasks.filter(t => t.status === 'in-progress').length
  const todoTasks = flashcardTasks.filter(t => t.status === 'todo').length

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
            <span>Flashcards</span>
            <span className="ml-auto text-xs bg-gray-800 px-2 py-1 rounded">{doneTasks}/{flashcardTasks.length}</span>
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
          {/* Flashcards Tab */}
          {activeTab === 'flashcards' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl">
                  📖
                </div>
                <div>
                  <h1 className="text-3xl font-bold">InstaCards</h1>
                  <p className="text-gray-400">Chrome Extension - AI Flashcard Generator</p>
                </div>
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
                  <span>{((doneTasks / flashcardTasks.length) * 100).toFixed(0)}%</span>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                    style={{ width: `${(doneTasks / flashcardTasks.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Tasks by Section */}
              {['in-progress', 'todo', 'done'].map((status) => {
                const tasks = flashcardTasks.filter(t => t.status === status)
                if (tasks.length === 0) return null
                
                return (
                  <div key={status} className="mb-8">
                    <h2 className="text-lg font-semibold mb-4 capitalize flex items-center gap-2">
                      {status === 'in-progress' && <Clock className="w-5 h-5 text-blue-500" />}
                      {status === 'todo' && <Circle className="w-5 h-5 text-gray-500" />}
                      {status === 'done' && <CheckCircle className="w-5 h-5 text-green-500" />}
                      {status === 'in-progress' ? 'In Progress' : status}
                    </h2>
                    <div className="space-y-3">
                      {tasks.map((task) => (
                        <div key={task.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition">
                          <div className="flex items-start gap-3">
                            <span className={`w-2.5 h-2.5 rounded-full mt-2 ${statusColors[task.status as keyof typeof statusColors]}`} />
                            <div className="flex-1">
                              <h3 className="font-medium">{task.title}</h3>
                              {task.description && <p className="text-gray-400 text-sm mt-1">{task.description}</p>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
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
                  <p className="text-gray-400">Important Links & Resources</p>
                </div>
              </div>

              {/* Categories */}
              {['Work', 'Learning', 'Tools'].map((category) => {
                const categoryBookmarks = bookmarks.filter(b => b.category === category)
                if (categoryBookmarks.length === 0) return null
                
                return (
                  <div key={category} className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">{category}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categoryBookmarks.map((bookmark, idx) => (
                        <a 
                          key={idx}
                          href={bookmark.url}
                          target="_blank"
                          className="bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-yellow-500/50 transition"
                        >
                          <div className="font-medium">{bookmark.title}</div>
                          <div className="text-sm text-gray-400 mt-1">{bookmark.description}</div>
                          {bookmark.notes && <div className="text-xs text-gray-500 mt-2">📝 {bookmark.notes}</div>}
                        </a>
                      ))}
                    </div>
                  </div>
                )
              })}

              <div className="mt-8 text-center">
                <a 
                  href="https://github.com/chrisonclawd-coder/project-manager/edit/main/data/bookmarks.json"
                  target="_blank"
                  className="text-blue-500 hover:underline"
                >
                  Edit Bookmarks →
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
