'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

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

// Motivational quotes based on time
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
  const [greetingData, setGreetingData] = useState(getGreeting())
  const [dateStr, setDateStr] = useState(formatDate(new Date()))
  const [weather, setWeather] = useState<WeatherData | null>(null)
  
  useEffect(() => {
    // Update greeting and date every minute
    const interval = setInterval(() => {
      setGreetingData(getGreeting())
      setDateStr(formatDate(new Date()))
    }, 60000)
    
    return () => clearInterval(interval)
  }, [])
  
  // Simulated weather - in production, fetch from API
  useEffect(() => {
    setWeather({
      temp: 72,
      high: 78,
      low: 65,
      condition: 'Partly cloudy'
    })
  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-mono">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* 1. Greeting Block */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <h1 className="text-4xl md:text-5xl font-light tracking-tight">
            {greetingData.greeting} <span className="text-yellow-500">Chris</span>
          </h1>
          <p className="text-gray-500 text-lg">{dateStr}</p>
          <p className="text-gray-400 text-sm mt-4 border-l-2 border-yellow-500 pl-4">
            {greetingData.motivational}
          </p>
        </motion.div>

        {/* 2. Weather Display */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="border border-gray-800 p-6"
        >
          <h2 className="text-xs uppercase tracking-widest text-gray-600 mb-4">Weather</h2>
          {weather ? (
            <div className="flex items-baseline gap-6">
              <span className="text-5xl font-light">{weather.temp}°</span>
              <div className="space-y-1">
                <p className="text-gray-400">H: {weather.high}° / L: {weather.low}°</p>
                <p className="text-gray-500 text-sm">{weather.condition}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">Loading...</p>
          )}
        </motion.div>

        {/* 3. Verse of the Day */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border border-gray-800 p-6"
        >
          <h2 className="text-xs uppercase tracking-widest text-gray-600 mb-4">Verse of the Day</h2>
          <blockquote className="text-lg md:text-xl leading-relaxed text-gray-300 italic">
            "{verseOfTheDay.text}"
          </blockquote>
          <p className="text-gray-500 text-sm mt-4">
            {verseOfTheDay.book} {verseOfTheDay.chapter}:{verseOfTheDay.verse} — {verseOfTheDay.translation}
          </p>
        </motion.div>

        {/* 4. Today's Calendar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border border-gray-800 p-6"
        >
          <h2 className="text-xs uppercase tracking-widest text-gray-600 mb-4">Today&apos;s Calendar</h2>
          {calendarEvents.length > 0 ? (
            <div className="space-y-3">
              {calendarEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between py-2 border-b border-gray-900 last:border-0">
                  <span className="text-gray-300">{event.title}</span>
                  <span className="text-yellow-500 text-sm font-mono">{event.time}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No scheduled events today.</p>
          )}
        </motion.div>

        {/* 5. Word of the Day */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="border border-gray-800 p-6"
        >
          <h2 className="text-xs uppercase tracking-widest text-gray-600 mb-4">Word of the Day</h2>
          <div className="space-y-2">
            <div className="flex items-baseline gap-4">
              <span className="text-2xl text-yellow-500">{wordOfTheDay.word}</span>
              <span className="text-gray-500 text-sm font-mono">{wordOfTheDay.pronunciation}</span>
            </div>
            <p className="text-gray-400 leading-relaxed">{wordOfTheDay.definition}</p>
            <p className="text-gray-600 text-sm italic mt-3">
              &quot;{wordOfTheDay.example}&quot;
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="pt-8 border-t border-gray-900">
          <p className="text-gray-700 text-xs">MISSION CONTROL // {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  )
}
