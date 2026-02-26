'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
  morning: 'EXECUTE THE PLAN. TRUST THE PROCESS.',
  afternoon: 'KEEP PUSHING. THE MARKET WAITS FOR NO ONE.',
  evening: 'REVIEW. REFINE. PREPARE FOR TOMORROW.',
  night: 'REST WELL. TOMORROW IS ANOTHER OPPORTUNITY.'
}

function getGreeting(): { greeting: string; motivational: string } {
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

export default function HomeScreen() {
  const router = useRouter()
  const [greetingData, setGreetingData] = useState(getGreeting())
  const [dateStr, setDateStr] = useState(formatDate(new Date()))
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [activeTab, setActiveTab] = useState('home')
  
  const menuItems = [
    { id: 'home', label: 'HOME', icon: HomeIcon },
    { id: 'projects', label: 'PROJECTS', icon: BookOpen },
    { id: 'xmax-work', label: 'XMAX WORK', icon: Target },
    { id: 'bookmarks', label: 'BOOKMARKS', icon: Bookmark },
    { id: 'software-team', label: 'TEAM', icon: Users },
    { id: 'products', label: 'PRODUCTS', icon: Package },
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-amber-50 font-mono">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-14 bg-[#111] border-b border-amber-900/30 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <span className="text-amber-500 font-bold tracking-wider">MISSION CONTROL</span>
        </div>
        <div className="flex items-center gap-1">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => router.push('/?tab=' + item.id)}
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

      {/* Main Content */}
      <main className="pt-20 p-4 md:p-6 max-w-3xl mx-auto">
        
        {/* Greeting */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-400 tracking-tight">
            {greetingData.greeting} <span className="text-amber-500">CHRIS</span>
          </h1>
          <p className="text-amber-700 text-sm tracking-widest mt-1">{dateStr}</p>
          <p className="text-amber-600 text-xs mt-4 border-l-2 border-amber-500 pl-3 tracking-wider">
            {greetingData.motivational}
          </p>
        </motion.div>

        {/* Weather */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#111] border border-amber-900/30 p-4 mb-4">
          <h2 className="text-xs text-amber-700 tracking-widest mb-3">WEATHER - CHENNAI</h2>
          {weather ? (
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-amber-400">{weather.temp}°C</span>
              <div className="space-y-1">
                <p className="text-amber-600 text-sm">H: {weather.high}° / L: {weather.low}°</p>
                <p className="text-amber-800 text-xs">{weather.condition}</p>
              </div>
            </div>
          ) : <p className="text-amber-800">Loading...</p>}
        </motion.div>

        {/* Verse */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#111] border border-amber-900/30 p-4 mb-4">
          <h2 className="text-xs text-amber-700 tracking-widest mb-3">VERSE OF THE DAY</h2>
          <blockquote className="text-amber-300 text-sm leading-relaxed italic">
            "{verseOfTheDay.text}"
          </blockquote>
          <p className="text-amber-700 text-xs mt-3">
            {verseOfTheDay.book} {verseOfTheDay.chapter}:{verseOfTheDay.verse} — {verseOfTheDay.translation}
          </p>
        </motion.div>

        {/* Calendar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#111] border border-amber-900/30 p-4 mb-4">
          <h2 className="text-xs text-amber-700 tracking-widest mb-3">TODAY'S SCHEDULE</h2>
          <div className="space-y-2">
            {calendarEvents.map(event => (
              <div key={event.id} className="flex items-center justify-between py-2 border-b border-amber-900/20 last:border-0">
                <span className="text-amber-400 text-sm">{event.title}</span>
                <span className="text-amber-500 text-xs font-mono">{event.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Word */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#111] border border-amber-900/30 p-4">
          <h2 className="text-xs text-amber-700 tracking-widest mb-3">WORD OF THE DAY</h2>
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-xl text-amber-400 font-bold">{wordOfTheDay.word}</span>
              <span className="text-amber-700 text-xs font-mono">{wordOfTheDay.pronunciation}</span>
            </div>
            <p className="text-amber-500 text-sm leading-relaxed">{wordOfTheDay.definition}</p>
            <p className="text-amber-800 text-xs italic mt-2">"{wordOfTheDay.example}"</p>
          </div>
        </motion.div>

        {/* Enter Button */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-center mt-8">
          <a 
            href="/?tab=projects" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-black font-bold tracking-wider hover:bg-amber-400 transition-colors"
          >
            ENTER MISSION CONTROL
          </a>
        </motion.div>

        {/* Grid Overlay */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(amber 1px, transparent 1px), linear-gradient(90deg, amber 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </main>
    </div>
  )
}
