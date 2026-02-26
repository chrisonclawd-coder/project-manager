'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ChevronDown, Search, BookOpen, Twitter, Bookmark, CheckCircle, Circle, Clock, Zap, RefreshCw, Menu, X, User, Beaker, Rocket, Eye, Bot, Users, Package, Target, Home as HomeIcon } from 'lucide-react'

// Types
interface CalendarEvent {
  id: number
  title: string
  time: string
  type: string
}

interface WeatherData {
  temp: number
  high: number
  low: number
  condition: string
}

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
  definition: 'Remaining green and lush throughout the year; evergreen. Metaphorically, enduring or permanent.',
  example: 'The sempervirent principles of integrity guided his decisions through every season of business.'
}

const calendarEvents: CalendarEvent[] = [
  { id: 1, title: 'xMax Session 1', time: '10:30 AM', type: 'automation' },
  { id: 2, title: 'xMax Session 2', time: '3:30 PM', type: 'automation' },
  { id: 3, title: 'xMax Session 3', time: '6:30 PM', type: 'automation' },
  { id: 4, title: 'xMax Session 4', time: '9:30 PM', type: 'automation' },
]

const motivationalLines = {
  morning: 'Execute the plan. Trust the process.',
  afternoon: 'Keep pushing. The market waits for no one.',
  evening: 'Review. Refine. Prepare for tomorrow.',
  night: 'Rest well. Tomorrow is another opportunity.'
}

function getGreeting(): { greeting: string; motivational: string } {
  const now = new Date()
  const hours = now.getHours()
  
  let greeting = 'Good evening'
  let motivational = motivationalLines.evening
  
  if (hours >= 5 && hours < 12) {
    greeting = 'Good morning'
    motivational = motivationalLines.morning
  } else if (hours >= 12 && hours < 17) {
    greeting = 'Good afternoon'
    motivational = motivationalLines.afternoon
  } else if (hours >= 17 && hours < 21) {
    greeting = 'Good evening'
    motivational = motivationalLines.evening
  } else {
    greeting = 'Good evening'
    motivational = motivationalLines.night
  }
  
  return { greeting, motivational }
}

function formatDate(date: Date): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

export default function HomeScreen() {
  const router = useRouter()
  const [greetingData, setGreetingData] = useState(getGreeting())
  const [dateStr, setDateStr] = useState(formatDate(new Date()))
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  
  const menuItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'projects', label: 'Projects', icon: BookOpen },
    { id: 'xmax-work', label: 'xMax Work', icon: Target },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'software-team', label: 'Software Team', icon: Users },
    { id: 'products', label: 'Products', icon: Package },
  ]
  
  useEffect(() => {
    const interval = setInterval(() => {
      setGreetingData(getGreeting())
      setDateStr(formatDate(new Date()))
    }, 60000)
    
    return () => clearInterval(interval)
  }, [])
  
  useEffect(() => {
    fetch('/api/weather')
      .then(res => res.json())
      .then(data => {
        if (data.temp) {
          setWeather({ temp: data.temp, high: data.high, low: data.low, condition: data.condition })
        }
      })
      .catch(() => {
        setWeather({ temp: 26, high: 29, low: 21, condition: 'Mist' })
      })
  }, [])
  
  const handleNav = (id: string) => {
    if (id === 'home') return
    setActiveTab(id)
    router.push('/?tab=' + id)
  }

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

          {/* Team Status */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold">5</p>
                <p className="text-gray-400 text-xs">Total</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-green-400">4</p>
                <p className="text-gray-400 text-xs">Active</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { 
                  if (item.id !== 'home') {
                    router.push('/?tab=' + item.id)
                  }
                  setIsDrawerOpen(false)
                }}
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
              </button>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700">
          <p className="text-gray-500 text-sm text-center">{new Date().toLocaleDateString()}</p>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsDrawerOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen p-6 lg:p-8 pt-16 lg:pt-8">
        {/* Greeting Block */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-1 mb-8">
          <h1 className="text-3xl md:text-4xl font-light tracking-tight">
            {greetingData.greeting} <span className="text-yellow-500">Chris</span>
          </h1>
          <p className="text-gray-500 text-lg">{dateStr}</p>
          <p className="text-gray-400 text-sm mt-3 border-l-2 border-yellow-500 pl-4">
            {greetingData.motivational}
          </p>
        </motion.div>

        {/* Weather */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="border border-gray-700 p-4 mb-6">
          <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Weather - Chennai</h2>
          {weather ? (
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-light">{weather.temp}°C</span>
              <div className="space-y-1">
                <p className="text-gray-400 text-sm">H: {weather.high}° / L: {weather.low}°</p>
                <p className="text-gray-500 text-xs">{weather.condition}</p>
              </div>
            </div>
          ) : <p className="text-gray-600">Loading...</p>}
        </motion.div>

        {/* Verse of the Day */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="border border-gray-700 p-4 mb-6">
          <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Verse of the Day</h2>
          <blockquote className="text-base leading-relaxed text-gray-300 italic">
            "{verseOfTheDay.text}"
          </blockquote>
          <p className="text-gray-500 text-xs mt-3">
            {verseOfTheDay.book} {verseOfTheDay.chapter}:{verseOfTheDay.verse} — {verseOfTheDay.translation}
          </p>
        </motion.div>

        {/* Calendar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="border border-gray-700 p-4 mb-6">
          <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Today&apos;s Schedule</h2>
          <div className="space-y-2">
            {calendarEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <span className="text-gray-300 text-sm">{event.title}</span>
                <span className="text-yellow-500 text-xs font-mono">{event.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Word of the Day */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="border border-gray-700 p-4">
          <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Word of the Day</h2>
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-xl text-yellow-500">{wordOfTheDay.word}</span>
              <span className="text-gray-500 text-xs font-mono">{wordOfTheDay.pronunciation}</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{wordOfTheDay.definition}</p>
            <p className="text-gray-600 text-xs italic mt-2">"{wordOfTheDay.example}"</p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
