'use client'

import { useState, useEffect, Suspense, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import {
  Search,
  BookOpen,
  Twitter,
  Bookmark,
  CheckCircle,
  Circle,
  Clock,
  Zap,
  Menu,
  Users,
  Target,
  Home as HomeIcon,
  X,
  Sun,
  Moon,
  Copy,
  TrendingUp,
  BarChart3,
  Plus,
  Trash2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'

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
  blocker?: string
  updatedAt?: string
}

interface TeamStatusEntry {
  name?: string
  role?: string
  status?: string
  currentTask?: string
  blocker?: string
  updatedAt?: string
}

interface StatusApiResponse {
  team?: Record<string, TeamStatusEntry>
  lastUpdated?: string | null
}

interface NpmMetrics {
  available: boolean
  pkg: string
  lastDay: number
  lastWeek: number
  lastMonth?: number
  totalDownloads?: number
  totalLabel?: string
  fetchedAt?: string
}

interface ChromeMetrics {
  available: boolean
  installs?: number | null
  note?: string
  fetchedAt?: string
}

interface ResearchItem {
  title: string
  url: string
  snippet: string
  score: number
  source: string
  fetchedAt: string
}

interface ResearchResponse {
  available: boolean
  reason?: string
  results: ResearchItem[]
}


interface XmaxRecentTweet {
  text?: string
  type?: string
  product?: string
  createdAt?: string
}

interface XmaxWorkData {
  topics?: Array<{ id?: number; name?: string; source?: string; lastWorked?: string }>
  recentTweets?: Array<XmaxRecentTweet | string>
}

const teamMembers: TeamMember[] = [
  { id: 'manager', name: 'Chrisly', role: 'Manager', status: 'idle', currentTask: '', blocker: '', updatedAt: '' },
  { id: 'xmax', name: 'xMax', role: 'X Strategy Lead', status: 'working', currentTask: 'Running X Strategy - creating tweets', blocker: '', updatedAt: '' },
  { id: 'developer', name: 'Developer', role: 'Developer', status: 'idle', currentTask: '', blocker: '', updatedAt: '' },
  { id: 'qa', name: 'QA', role: 'QA', status: 'idle', currentTask: '', blocker: '', updatedAt: '' },
  { id: 'devops', name: 'DevOps', role: 'DevOps', status: 'idle', currentTask: '', blocker: '', updatedAt: '' },
  { id: 'tester', name: 'Tester', role: 'Manual Tester', status: 'idle', currentTask: '', blocker: '', updatedAt: '' },
]

const defaultTasks: Task[] = [
  { id: 1, title: 'Complete InstaCards Chrome Extension', status: 'done', priority: 'high' },
  { id: 2, title: 'Build Mission Control Dashboard', status: 'done', priority: 'high' },
  { id: 3, title: 'Setup X Strategy automation', status: 'done', priority: 'high' },
  { id: 4, title: 'Deploy to Vercel', status: 'done', priority: 'high' },
  { id: 5, title: 'Mdify - Chrome Extension (Completed)', status: 'done', priority: 'high' },
  { id: 6, title: 'GuardSkills - NPM Package (Completed)', status: 'done', priority: 'high' },
]

const defaultBookmarks: BookmarkItem[] = [
  { id: 1, title: 'OpenClaw 50 Days Workflows', url: 'https://gist.github.com/velvet-shark/b4c6724c391f612c4de4e9a07b0a74b6', category: 'Work', addedAt: '2026-02-24' },
]

const defaultTopics = [
  { id: 1, title: 'AI Breakthroughs 2026', source: 'MIT Tech Review', tweets: [{ text: "MIT's 10 Breakthrough Technologies 2026 is out. AI agents are leading.", hashtags: ['AI', 'Tech'] }] },
  { id: 2, title: 'Gartner Tech Trends', source: 'Gartner', tweets: [{ text: "Gartner's Top 10 Tech Trends 2026: Agentic AI is THE trend.", hashtags: ['Gartner'] }] },
  { id: 3, title: 'AI Voice Agents', source: 'RingCentral', tweets: [{ text: 'AI voice agents are HERE and better than most humans at customer service.', hashtags: ['AI'] }] },
  { id: 4, title: 'Hyperscale AI Data Centers', source: 'MIT Tech Review', tweets: [{ text: 'AI data centers consuming insane energy.', hashtags: ['AI'] }] },
  { id: 5, title: 'Intelligent Apps', source: 'Capgemini', tweets: [{ text: 'Every app without AI is obsolete.', hashtags: ['AI'] }] },
  { id: 6, title: 'AI Coding Trends', source: 'GitHub', tweets: [{ text: "AI coding isn't future - it's PRESENT.", hashtags: ['AICoding'] }] },
]

const marketingPosts = [
  {
    id: 'mdify-x',
    product: 'MDIFY',
    channel: 'X',
    target: '280',
    text: 'Stop pasting bloated links. Stop fighting bot protection. Stop wasting tokens. Convert any article to clean .md with #Mdify → feed it to your AI agent → done. Your agent will thank you. https://chromewebstore.google.com/detail/mdify/kimahdiiopfklhcciaiknnfcobamjeki',
    link: 'https://twitter.com/intent/tweet?text=Stop%20pasting%20bloated%20links.%20Stop%20fighting%20bot%20protection.%20Stop%20wasting%20tokens%20on%20engagement%20fluff.%20Convert%20any%20article%20to%20clean%20.md%20with%20%23Mdify%20→%20feed%20it%20directly%20to%20your%20AI%20agent%20→%20done.%20Your%20agent%20will%20thank%20you.',
  },
  {
    id: 'mdify-reddit',
    product: 'MDIFY',
    channel: 'Reddit',
    target: '500+',
    text: "I've been using this Chrome extension called Mdify for the past few weeks and it's completely transformed my AI workflow. Before, I was manually copying and pasting articles, fighting with paywalls and bot protection, only to feed my AI agent bloated HTML with tracking pixels and ads. Now with one click, I get clean .md files that my AI agent can process instantly. No more wasted tokens on irrelevant content, no more copy-paste fatigue. My agent outputs have never been better. If you use AI agents professionally, you need this. It's free to try.",
  },
  {
    id: 'guardskills-x',
    product: 'GUARDSKILLS',
    channel: 'X',
    target: '280',
    text: "You install AI skills without thinking. But have you checked what's in that code? Your API keys are at risk. @guardskills_ scans for malicious code before you install. Protect your keys. #AI #Security #OpenSource",
    link: 'https://twitter.com/intent/tweet?text=You%20install%20AI%20skills%20without%20thinking.%20But%20have%20you%20checked%20what%27s%20actually%20in%20that%20code%3F%20Your%20API%20keys%20could%20be%20at%20risk.%20%40guardskills_%20scans%20AI%20skills%20for%20malicious%20code%20before%20you%20install.',
  },
  {
    id: 'guardskills-reddit',
    product: 'GUARDSKILLS',
    channel: 'Reddit',
    target: '500+',
    text: "Worried about malicious AI skills? You should be. Every time you install an AI skill from GitHub, npm, or skills.sh, you're running arbitrary code with your API keys exposed. I built Guardskills to solve this problem. It's an NPM package that scans AI skills for suspicious patterns before you install them - credential access, network exfiltration, file system writes, shell execution. Run `npx guardskills scan <skill-url>` and get a security report in seconds. I've already caught 3 skills with hidden key exfiltration in my own projects. Don't trust, verify. Your AI workflow security depends on it.",
  },
]

function MissionControlContent() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') || 'home'

  const [activeTab, setActiveTab] = useState(initialTab as string)
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [tasks] = useState<Task[]>(defaultTasks)
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])
  const [trendingTopics] = useState(defaultTopics)
  const [xmaxWork, setXmaxWork] = useState<XmaxWorkData | null>(null)
  const [teamData, setTeamData] = useState(teamMembers)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null)
  const [teamLastUpdated, setTeamLastUpdated] = useState<string>('')
  const [npmMetrics, setNpmMetrics] = useState<NpmMetrics | null>(null)
  const [chromeMetrics, setChromeMetrics] = useState<ChromeMetrics | null>(null)
  const [researchFeed, setResearchFeed] = useState<ResearchItem[]>([])
  const [researchAvailable, setResearchAvailable] = useState(true)
  const [researchReason, setResearchReason] = useState('')
  const [researchLoading, setResearchLoading] = useState(false)
  const [researchError, setResearchError] = useState('')

  // Trading Center state
  const [tradingTicker, setTradingTicker] = useState('')
  const [stockData, setStockData] = useState<any>(null)
  const [optionsData, setOptionsData] = useState<any>(null)
  const [selectedExpiration, setSelectedExpiration] = useState<string | null>(null)
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [journalEntries, setJournalEntries] = useState<any[]>([])
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    stock: '',
    action: 'BUY',
    entryPrice: '',
    exitPrice: '',
    quantity: '',
    notes: '',
  })
  const [loadingStock, setLoadingStock] = useState(false)
  const [loadingOptions, setLoadingOptions] = useState(false)

  const shell = darkMode
    ? {
        page: 'bg-[#090909] text-zinc-100',
        panel: 'bg-[#111111] border-zinc-800',
        panelMuted: 'bg-[#0d0d0d] border-zinc-800',
        textMuted: 'text-zinc-400',
        textSoft: 'text-zinc-500',
        borderStrong: 'border-zinc-700',
        navHover: 'hover:bg-zinc-800/60',
      }
    : {
        page: 'bg-zinc-50 text-zinc-900',
        panel: 'bg-white border-zinc-200',
        panelMuted: 'bg-zinc-100 border-zinc-200',
        textMuted: 'text-zinc-600',
        textSoft: 'text-zinc-500',
        borderStrong: 'border-zinc-400',
        navHover: 'hover:bg-zinc-200/80',
      }

  // Home page data
  const verseRotation = [
    {
      book: 'Proverbs',
      chapter: 3,
      verse: 5,
      text: 'Trust in the LORD with all your heart and lean not on your own understanding.',
      translation: 'NIV',
    },
    {
      book: 'Micah',
      chapter: 6,
      verse: 8,
      text: 'Act justly and to love mercy and to walk humbly with your God.',
      translation: 'NIV',
    },
    {
      book: 'Psalm',
      chapter: 90,
      verse: 12,
      text: 'Teach us to number our days, that we may gain a heart of wisdom.',
      translation: 'NIV',
    },
    {
      book: 'Isaiah',
      chapter: 41,
      verse: 10,
      text: 'Do not fear, for I am with you; do not be dismayed, for I am your God.',
      translation: 'NIV',
    },
    {
      book: 'Philippians',
      chapter: 4,
      verse: 13,
      text: 'I can do all things through Christ who strengthens me.',
      translation: 'NKJV',
    },
  ]

  const wordRotation = [
    {
      word: 'Sempervirent',
      pronunciation: '/ˌsempərˈvīrənt/',
      definition: 'Remaining green and lush throughout the year; evergreen.',
    },
    {
      word: 'Perspicacious',
      pronunciation: '/ˌpərspɪˈkeɪʃəs/',
      definition: 'Having a ready insight into and understanding of things.',
    },
    {
      word: 'Tenacious',
      pronunciation: '/təˈneɪʃəs/',
      definition: 'Tending to keep a firm hold of something; persistent and determined.',
    },
    {
      word: 'Aplomb',
      pronunciation: '/əˈplɑːm/',
      definition: 'Self-confidence or assurance, especially in demanding situations.',
    },
    {
      word: 'Veracity',
      pronunciation: '/vəˈræsɪti/',
      definition: 'Conformity to facts; accuracy and truthfulness.',
    },
  ]

  const motivationalLines = {
    morning: 'EXECUTE THE PLAN. TRUST THE PROCESS.',
    afternoon: 'KEEP PUSHING. THE MARKET WAITS FOR NO ONE.',
    evening: 'REVIEW. REFINE. PREPARE FOR TOMORROW.',
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
    const loadTeamStatus = async () => {
      try {
        const res = await fetch('/api/status', { cache: 'no-store' })
        const payload = (await res.json()) as StatusApiResponse
        const data = payload.team || {}

        const merged = teamMembers.map(m => ({
          ...m,
          name: data[m.id]?.name || m.name,
          role: data[m.id]?.role || m.role,
          status: data[m.id]?.status || m.status,
          currentTask: data[m.id]?.currentTask || m.currentTask,
          blocker: data[m.id]?.blocker || '',
          updatedAt: data[m.id]?.updatedAt || '',
        }))

        setTeamData(merged)
        setTeamLastUpdated(payload.lastUpdated || '')
      } catch {
        setTeamData(teamMembers)
        setTeamLastUpdated('')
      }
    }

    loadTeamStatus()
    const interval = setInterval(loadTeamStatus, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const loadProductMetrics = async () => {
      try {
        const [npmRes, chromeRes] = await Promise.all([
          fetch('/api/metrics/npm?pkg=guardskills', { cache: 'no-store' }),
          fetch('/api/metrics/chrome', { cache: 'no-store' }),
        ])

        const npmData = (await npmRes.json()) as NpmMetrics
        const chromeData = (await chromeRes.json()) as ChromeMetrics

        setNpmMetrics(npmData)
        setChromeMetrics(chromeData)
      } catch {
        setNpmMetrics(null)
        setChromeMetrics(null)
      }
    }

    loadProductMetrics()
    const interval = setInterval(loadProductMetrics, 60000)
    return () => clearInterval(interval)
  }, [])

  const menuItems = [
    { id: 'home', label: 'HOME', icon: HomeIcon },
    { id: 'projects', label: 'PROJECTS', icon: BookOpen },
    { id: 'trading-center', label: 'TRADING CENTER', icon: TrendingUp },
    { id: 'xmax-work', label: 'XMAX WORK', icon: Target },
    { id: 'bookmarks', label: 'BOOKMARKS', icon: Bookmark },
    { id: 'software-team', label: 'TEAM', icon: Users },
  ]

  const filteredTasks = tasks.filter(
    t => (filterStatus === 'all' || t.status === filterStatus) && t.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    todo: tasks.filter(t => t.status === 'todo').length,
  }


  const loadXmaxWork = useCallback(async () => {
    try {
      const res = await fetch('/api/xmax', { cache: 'no-store' })
      if (!res.ok) return
      const payload = (await res.json()) as XmaxWorkData
      setXmaxWork(payload)
    } catch {
      // ignore silently; UI will show fallback data
    }
  }, [])

  const loadResearchFeed = useCallback(async () => {
    setResearchLoading(true)
    setResearchError('')

    try {
      const res = await fetch('/api/xmax/research', { cache: 'no-store' })
      const payload = (await res.json()) as ResearchResponse

      setResearchAvailable(payload.available)
      setResearchReason(payload.reason || '')
      setResearchFeed(payload.results || [])
    } catch {
      setResearchError('Unable to load research feed right now.')
      setResearchFeed([])
      setResearchAvailable(true)
      setResearchReason('')
    } finally {
      setResearchLoading(false)
    }
  }, [])

  useEffect(() => {
    loadResearchFeed()
    loadXmaxWork()
  }, [loadResearchFeed, loadXmaxWork])

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const res = await fetch('/api/bookmarks', { cache: 'no-store' })
        if (!res.ok) return
        const data = (await res.json()) as BookmarkItem[]
        setBookmarks(data)
      } catch { /* ignore */ }
    }
    loadBookmarks()
  }, [])

  const refreshTopics = async () => {
    setIsRefreshing(true)
    await Promise.all([loadResearchFeed(), loadXmaxWork()])
    setTimeout(() => setIsRefreshing(false), 500)
  }

  const getPostBadge = (channel: string, text: string) => {
    if (channel === 'X') {
      const valid = text.length <= 280
      return {
        label: '280 chars',
        state: valid ? 'VALID' : 'TOO LONG',
        tone: valid ? 'text-emerald-400 border-emerald-500/40' : 'text-rose-400 border-rose-500/40',
      }
    }

    const valid = text.length >= 500
    return {
      label: '500+ chars',
      state: valid ? 'ON TARGET' : 'NEEDS EXPANSION',
      tone: valid ? 'text-emerald-400 border-emerald-500/40' : 'text-amber-400 border-amber-500/40',
    }
  }

  const handleCopyPost = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedPostId(id)
      setTimeout(() => setCopiedPostId(null), 1200)
    } catch {
      setCopiedPostId(null)
    }
  }

  const formatUpdatedTime = (value?: string) => {
    if (!value) return 'Not reported'
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return value
    return parsed.toLocaleString()
  }

  const formatUpdatedTimeIST = (value?: string) => {
    if (!value) return 'Not reported'
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return value

    const formatted = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(parsed)

    return `${formatted} IST`
  }

  const getResearchUnavailableMessage = () => {
    const fallback = researchReason || 'Research feed is currently unavailable.'
    const reasonUpper = (researchReason || '').toUpperCase()

    if (reasonUpper.includes('TAVILY') && reasonUpper.includes('KEY')) {
      return `${fallback} Set TAVILY_API_KEY in VPS env and restart PM2 with --update-env`
    }

    return fallback
  }

  const isStale = (value?: string) => {
    if (!value) return true
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return true
    return Date.now() - parsed.getTime() > 30000
  }

  const formatNumber = (value?: number) => {
    if (typeof value !== 'number') return '--'
    return new Intl.NumberFormat('en-US').format(value)
  }

  // Technical indicator calculations
  const calculateRSI = (prices: number[], period: number = 14): number | null => {
    if (prices.length < period + 1) return null

    let gains = 0
    let losses = 0

    // Calculate initial average gain and loss
    for (let i = prices.length - period; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1]
      if (change >= 0) {
        gains += change
      } else {
        losses += Math.abs(change)
      }
    }

    const avgGain = gains / period
    const avgLoss = losses / period

    if (avgLoss === 0) return 100

    const rs = avgGain / avgLoss
    const rsi = 100 - (100 / (1 + rs))

    return Math.round(rsi * 100) / 100
  }

  const calculateSMA = (prices: number[], period: number): number | null => {
    if (prices.length < period) return null
    const sum = prices.slice(-period).reduce((a, b) => a + b, 0)
    return Math.round((sum / period) * 100) / 100
  }

  const calculateMACD = (prices: number[]): { macd: number; signal: number; histogram: number } | null => {
    if (prices.length < 26) return null

    const ema = (data: number[], period: number) => {
      const k = 2 / (period + 1)
      let emaArray = [data[0]]
      for (let i = 1; i < data.length; i++) {
        emaArray.push(data[i] * k + emaArray[i - 1] * (1 - k))
      }
      return emaArray
    }

    const ema12 = ema(prices, 12)
    const ema26 = ema(prices, 26)
    const macdLine = ema12.slice(-ema26.length).map((v, i) => v - ema26[i])
    const signalLine = ema(macdLine, 9)
    const histogram = macdLine.slice(-signalLine.length).map((v, i) => v - signalLine[i])

    const macd = macdLine[macdLine.length - 1]
    const signal = signalLine[signalLine.length - 1]
    const hist = histogram[histogram.length - 1]

    return {
      macd: Math.round(macd * 10000) / 10000,
      signal: Math.round(signal * 10000) / 10000,
      histogram: Math.round(hist * 10000) / 10000,
    }
  }

  // Trading utility functions
  const calculatePandL = (entry: any) => {
    if (!entry.exitPrice) return { profit: 0, percent: 0 }

    const quantity = entry.quantity
    const profit =
      entry.action === 'BUY' || entry.action === 'COVER'
        ? (entry.exitPrice - entry.entryPrice) * quantity
        : (entry.entryPrice - entry.exitPrice) * quantity

    const costBasis = entry.entryPrice * quantity
    const percent = (profit / costBasis) * 100

    return {
      profit: Math.round(profit * 100) / 100,
      percent: Math.round(percent * 100) / 100,
    }
  }

  const loadWatchlist = async () => {
    try {
      const res = await fetch('/data/watchlist.json', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setWatchlist(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      setWatchlist(['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA'])
    }
  }

  const loadJournal = async () => {
    try {
      const res = await fetch('/api/trading/journal', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setJournalEntries(data)
      }
    } catch (error) {
      setJournalEntries([])
    }
  }

  const fetchStockQuote = async (ticker: string) => {
    setLoadingStock(true)
    try {
      const res = await fetch(`/api/stock/quote?ticker=${ticker}`, { cache: 'no-store' })
      const data = await res.json()

      if (res.ok) {
        setStockData(data)
      } else {
        alert(data.error || 'Failed to fetch stock quote')
      }
    } catch (error) {
      alert('Failed to fetch stock quote')
    } finally {
      setLoadingStock(false)
    }
  }

  const fetchOptions = async (ticker: string) => {
    setLoadingOptions(true)
    try {
      const res = await fetch(`/api/stock/options?ticker=${ticker}`, { cache: 'no-store' })
      const data = await res.json()

      if (res.ok) {
        setOptionsData(data)
        setSelectedExpiration(data.expirations[0] || null)
      } else {
        alert(data.error || 'Failed to fetch options data')
      }
    } catch (error) {
      alert('Failed to fetch options data')
    } finally {
      setLoadingOptions(false)
    }
  }

  const saveJournalEntry = async () => {
    if (!newEntry.stock || !newEntry.entryPrice || !newEntry.quantity) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const res = await fetch('/api/trading/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry),
      })

      if (res.ok) {
        setNewEntry({
          date: new Date().toISOString().split('T')[0],
          stock: '',
          action: 'BUY',
          entryPrice: '',
          exitPrice: '',
          quantity: '',
          notes: '',
        })
        await loadJournal()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to save journal entry')
      }
    } catch (error) {
      alert('Failed to save journal entry')
    }
  }

  const deleteJournalEntry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return

    // This would need to be implemented server-side
    alert('Delete functionality needs server-side implementation')
  }

  // Initialize trading data
  useEffect(() => {
    loadWatchlist()
    loadJournal()
  }, [])

  const utcDayIndex = Math.floor(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()) / 86400000)
  const verseOfTheDay = verseRotation[utcDayIndex % verseRotation.length]
  const wordOfTheDay = wordRotation[utcDayIndex % wordRotation.length]

  const blockedWorkers = teamData.filter(member => member.status === 'blocked' || Boolean(member.blocker)).length
  const workingMembers = teamData.filter(member => member.status === 'working')
  const activeRole = workingMembers[0]?.role || 'No active role'
  const teamFeedStale = isStale(teamLastUpdated)

  const xmaxLastRunCandidates = [
    ...(xmaxWork?.topics?.map(topic => topic.lastWorked).filter(Boolean) || []),
    ...(xmaxWork?.recentTweets
      ?.map(tweet => (typeof tweet === 'string' ? undefined : tweet.createdAt))
      .filter(Boolean) || []),
  ] as string[]

  const xmaxLastRun = xmaxLastRunCandidates
    .map(value => new Date(value))
    .filter(date => !Number.isNaN(date.getTime()))
    .sort((a, b) => b.getTime() - a.getTime())[0]

  const xmaxReady = researchAvailable && !researchError && blockedWorkers === 0
  const alerts = [
    !researchAvailable && (researchReason.toUpperCase().includes('TAVILY') || researchReason.toUpperCase().includes('KEY'))
      ? 'TAVILY_API_KEY missing. Research feed unavailable.'
      : null,
    teamFeedStale ? 'Team feed is stale (>30s).' : null,
    blockedWorkers > 0 ? `${blockedWorkers} worker${blockedWorkers > 1 ? 's' : ''} blocked.` : null,
  ].filter(Boolean) as string[]

  const guardskillsTotalLabel = npmMetrics?.totalLabel || 'Total (30d proxy)'
  const growthSignals = [
    npmMetrics?.available ? `GuardSkills ${guardskillsTotalLabel}: ${formatNumber(npmMetrics.totalDownloads)}` : 'GuardSkills metrics unavailable',
    npmMetrics?.available ? `GuardSkills last week: ${formatNumber(npmMetrics.lastWeek)}` : 'Weekly trend unavailable',
    chromeMetrics?.available ? 'Mdify Chrome metric source connected' : 'Mdify Chrome installs data unavailable',
    researchFeed.length > 0 ? `${researchFeed.length} fresh research signal(s) ready for xMax` : 'No fresh research signals loaded',
  ]

  const bottleneck = blockedWorkers > 0
    ? `${blockedWorkers} blocked worker${blockedWorkers > 1 ? 's' : ''} in pipeline`
    : teamFeedStale
      ? 'Team status feed stale (>30s)'
      : !researchAvailable
        ? 'Research feed unavailable'
        : 'No immediate operational bottleneck'

  const nextPostRecommendation =
    researchFeed[0]?.title
      ? `Post on: ${researchFeed[0].title}`
      : selectedTopic
        ? `Use prepared angle: ${trendingTopics.find(t => t.id === selectedTopic)?.title || 'Selected topic'}`
        : `Use prepared angle: ${trendingTopics[0]?.title || 'AI Breakthroughs 2026'}`

  const immediateActions = [
    blockedWorkers > 0 ? 'Unblock blocked owner(s) before next deploy cycle.' : null,
    !researchAvailable ? 'Restore Tavily key so xMax has live research input.' : null,
    npmMetrics?.available ? 'Ship one GuardSkills growth post using latest download proof.' : 'Restore npm metrics endpoint before growth reporting.',
  ].filter(Boolean) as string[]

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 ${shell.page}`}>
      <aside
        className={`fixed top-0 left-0 w-64 h-full z-50 transform transition-colors duration-200 border-r ${shell.panel} ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className={`h-14 flex items-center justify-between px-4 border-b ${shell.panel}`}>
          <div className="flex items-center">
            <Zap className="w-6 h-6 text-zinc-300" />
            <span className="font-semibold tracking-[0.2em] ml-2 text-zinc-200">MISSION</span>
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-md transition-colors ${shell.navHover}`}>
            {darkMode ? <Sun className="w-5 h-5 text-zinc-300" /> : <Moon className="w-5 h-5 text-zinc-700" />}
          </button>
        </div>

        <div className="p-3 space-y-1.5">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id)
                setSidebarOpen(false)
              }}
              className={`w-full p-3 flex items-center gap-3 transition-colors border-l-2 ${
                activeTab === item.id
                  ? darkMode
                    ? 'bg-zinc-800/70 border-zinc-300 text-zinc-100'
                    : 'bg-zinc-200 border-zinc-700 text-zinc-900'
                  : `border-transparent ${shell.navHover} ${shell.textMuted}`
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-xs font-semibold tracking-[0.16em]">{item.label}</span>
            </button>
          ))}
        </div>

        <div className={`absolute bottom-0 w-full p-4 border-t ${shell.panel}`}>
          <p className={`text-[10px] tracking-[0.2em] mb-2 ${shell.textSoft}`}>ACTIVE TEAM</p>
          <div className="space-y-2">
            {teamData
              .filter(m => m.status === 'working')
              .map(member => (
                <div key={member.id} className={`p-2 rounded border ${shell.panelMuted}`}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 animate-pulse rounded-full" />
                    <span className="text-xs text-zinc-200">{member.name}</span>
                  </div>
                  <p className={`text-[11px] ml-4 mt-1 truncate ${shell.textMuted}`}>{member.currentTask || 'No active task'}</p>
                </div>
              ))}
          </div>
        </div>
      </aside>

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`lg:hidden fixed top-4 left-4 z-50 p-2 rounded border transition-colors duration-200 ${shell.panel}`}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {sidebarOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />}

      <main className="lg:ml-64 min-h-screen p-4 md:p-8 pt-16 lg:pt-8">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto space-y-4">
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                  {getGreeting().greeting} <span className="text-zinc-400">CHRIS</span>
                </h1>
                <p className={`text-xs tracking-[0.18em] mt-2 ${shell.textSoft}`}>{formatDate(new Date())}</p>
                <p className={`text-xs mt-4 border-l-2 pl-4 tracking-[0.16em] ${shell.textMuted} ${shell.borderStrong}`}>
                  {getGreeting().motivational}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className={`border p-5 ${shell.panel}`}>
                  <h2 className={`text-[11px] tracking-[0.2em] mb-4 ${shell.textSoft}`}>EXECUTIVE BRIEF</h2>
                  <div className="space-y-4">
                    <div>
                      <p className={`text-[10px] tracking-[0.14em] mb-1 ${shell.textSoft}`}>WHAT TO DO NOW</p>
                      {immediateActions.length > 0 ? (
                        <div className="space-y-1">
                          {immediateActions.slice(0, 2).map(action => (
                            <p key={action} className={`text-sm ${shell.textMuted}`}>• {action}</p>
                          ))}
                        </div>
                      ) : (
                        <p className={`text-sm ${shell.textMuted}`}>• Maintain posting cadence and monitor feed freshness.</p>
                      )}
                    </div>

                    <div>
                      <p className={`text-[10px] tracking-[0.14em] mb-1 ${shell.textSoft}`}>GROWTH SIGNAL SUMMARY</p>
                      <p className={`text-sm ${shell.textMuted}`}>{growthSignals[0]} · {growthSignals[1]}</p>
                    </div>

                    <div>
                      <p className={`text-[10px] tracking-[0.14em] mb-1 ${shell.textSoft}`}>BOTTLENECK</p>
                      <p className={`text-sm ${blockedWorkers > 0 || teamFeedStale || !researchAvailable ? 'text-amber-400' : 'text-emerald-400'}`}>{bottleneck}</p>
                    </div>

                    <div>
                      <p className={`text-[10px] tracking-[0.14em] mb-1 ${shell.textSoft}`}>NEXT POST RECOMMENDATION</p>
                      <p className={`text-sm ${shell.textMuted}`}>{nextPostRecommendation}</p>
                    </div>
                  </div>
                </div>

                <div className={`border p-5 ${shell.panel}`}>
                  <h2 className={`text-[11px] tracking-[0.2em] mb-3 ${shell.textSoft}`}>XMAX OPS SNAPSHOT</h2>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className={shell.textSoft}>Last Run:</span>{' '}
                      <span className={shell.textMuted}>{xmaxLastRun ? formatUpdatedTimeIST(xmaxLastRun.toISOString()) : 'Not reported'}</span>
                    </p>
                    <p>
                      <span className={shell.textSoft}>Next Runs (IST):</span>{' '}
                      <span className={shell.textMuted}>10:30 AM · 3:30 PM · 6:30 PM · 9:30 PM</span>
                    </p>
                    <p>
                      <span className={shell.textSoft}>Ops State:</span>{' '}
                      <span className={xmaxReady ? 'text-emerald-400' : 'text-amber-400'}>{xmaxReady ? 'READY' : 'BLOCKED'}</span>
                    </p>
                  </div>
                </div>

                <div className={`border p-5 ${shell.panel}`}>
                  <h2 className={`text-[11px] tracking-[0.2em] mb-3 ${shell.textSoft}`}>PIPELINE LIVE SNAPSHOT</h2>
                  <div className="grid grid-cols-3 gap-2">
                    <div className={`border p-3 ${shell.panelMuted}`}>
                      <p className={`text-[10px] tracking-[0.14em] ${shell.textSoft}`}>ACTIVE ROLE</p>
                      <p className="text-sm mt-1">{activeRole}</p>
                    </div>
                    <div className={`border p-3 ${shell.panelMuted}`}>
                      <p className={`text-[10px] tracking-[0.14em] ${shell.textSoft}`}>TOTAL WORKING</p>
                      <p className="text-sm mt-1">{workingMembers.length}</p>
                    </div>
                    <div className={`border p-3 ${shell.panelMuted}`}>
                      <p className={`text-[10px] tracking-[0.14em] ${shell.textSoft}`}>BLOCKERS</p>
                      <p className={`text-sm mt-1 ${blockedWorkers > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{blockedWorkers}</p>
                    </div>
                  </div>
                </div>

                <div className={`border p-5 ${shell.panel}`}>
                  <h2 className={`text-[11px] tracking-[0.2em] mb-3 ${shell.textSoft}`}>PRODUCT METRICS SNAPSHOT</h2>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className={shell.textSoft}>GuardSkills {npmMetrics?.totalLabel || 'Total (30d proxy)'}:</span>{' '}
                      <span className={shell.textMuted}>{npmMetrics?.available ? formatNumber(npmMetrics.totalDownloads) : '--'}</span>
                    </p>
                    <p>
                      <span className={shell.textSoft}>GuardSkills Last Week:</span>{' '}
                      <span className={shell.textMuted}>{npmMetrics?.available ? formatNumber(npmMetrics.lastWeek) : '--'}</span>
                    </p>
                    <p>
                      <span className={shell.textSoft}>Chrome Metric:</span>{' '}
                      <span className={chromeMetrics?.available ? 'text-emerald-400' : 'text-amber-400'}>
                        {chromeMetrics?.available ? 'AVAILABLE' : 'UNAVAILABLE'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className={`border p-5 ${shell.panel}`}>
                <h2 className={`text-[11px] tracking-[0.2em] mb-3 ${shell.textSoft}`}>ALERTS</h2>
                {alerts.length > 0 ? (
                  <div className="space-y-2">
                    {alerts.map(alert => (
                      <p key={alert} className="text-sm text-amber-400">• {alert}</p>
                    ))}
                  </div>
                ) : (
                  <p className={`text-sm text-emerald-400`}>No critical alerts. Systems nominal.</p>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className={`border p-5 ${shell.panel}`}>
                  <h2 className={`text-[11px] tracking-[0.2em] mb-3 ${shell.textSoft}`}>VERSE OF THE DAY</h2>
                  <p className="text-sm leading-relaxed italic text-zinc-300">"{verseOfTheDay.text}"</p>
                  <p className={`text-xs mt-3 ${shell.textSoft}`}>
                    {verseOfTheDay.book} {verseOfTheDay.chapter}:{verseOfTheDay.verse} — {verseOfTheDay.translation}
                  </p>
                </div>

                <div className={`border p-5 ${shell.panel}`}>
                  <h2 className={`text-[11px] tracking-[0.2em] mb-3 ${shell.textSoft}`}>WORD OF THE DAY</h2>
                  <div className="flex items-baseline gap-3">
                    <span className="text-xl font-semibold">{wordOfTheDay.word}</span>
                    <span className={`text-xs ${shell.textSoft}`}>{wordOfTheDay.pronunciation}</span>
                  </div>
                  <p className={`text-sm mt-2 ${shell.textMuted}`}>{wordOfTheDay.definition}</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'projects' && (
            <motion.div key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { label: 'TOTAL', value: stats.total, tone: 'text-zinc-100' },
                  { label: 'DONE', value: stats.done, tone: 'text-emerald-400' },
                  { label: 'IN PROG', value: stats.inProgress, tone: 'text-sky-400' },
                  { label: 'TODO', value: stats.todo, tone: 'text-zinc-400' },
                ].map(item => (
                  <div key={item.label} className={`border p-3 ${shell.panel}`}>
                    <p className={`text-[10px] tracking-[0.18em] ${shell.textSoft}`}>{item.label}</p>
                    <p className={`text-2xl mt-1 font-semibold ${item.tone}`}>{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${shell.textSoft}`} />
                <input
                  type="text"
                  placeholder="SEARCH PROJECTS + PRODUCTS..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className={`w-full border pl-10 pr-4 py-2.5 text-sm tracking-[0.08em] focus:outline-none ${shell.panel}`}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {(['all', 'in-progress', 'todo', 'done'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 text-[11px] tracking-[0.18em] border transition-colors ${
                      filterStatus === status
                        ? darkMode
                          ? 'bg-zinc-200 text-black border-zinc-200'
                          : 'bg-zinc-900 text-white border-zinc-900'
                        : `${shell.panel} ${shell.textMuted}`
                    }`}
                  >
                    {status.toUpperCase().replace('-', ' ')}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                {filteredTasks.map(task => (
                  <div
                    key={task.id}
                    className={`border p-4 flex items-center justify-between ${
                      task.status === 'done'
                        ? darkMode
                          ? 'border-emerald-900/30 opacity-70 bg-[#0f1110]'
                          : 'border-emerald-200 opacity-80 bg-emerald-50/50'
                        : task.status === 'in-progress'
                          ? darkMode
                            ? 'border-sky-900/40 bg-[#0f1012]'
                            : 'border-sky-200 bg-sky-50/40'
                          : shell.panel
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {task.status === 'done' ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : task.status === 'in-progress' ? (
                        <Clock className="w-5 h-5 text-sky-500" />
                      ) : (
                        <Circle className={`w-5 h-5 ${shell.textSoft}`} />
                      )}
                      <span className={task.status === 'done' ? `line-through ${shell.textSoft}` : ''}>{task.title}</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 border ${
                        task.priority === 'high'
                          ? 'text-rose-400 border-rose-500/30'
                          : task.priority === 'medium'
                            ? 'text-zinc-300 border-zinc-600'
                            : `${shell.textMuted} ${darkMode ? 'border-zinc-700' : 'border-zinc-300'}`
                      }`}
                    >
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>

              <div className={`border p-4 ${shell.panel}`}>
                <h3 className={`text-[11px] tracking-[0.2em] mb-3 ${shell.textSoft}`}>PRODUCTS (MERGED INTO PROJECTS)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                  <div className={`border p-4 ${shell.panelMuted}`}>
                    <p className={`text-[10px] tracking-[0.16em] ${shell.textSoft}`}>GUARDSKILLS · {guardskillsTotalLabel.toUpperCase()}</p>
                    <p className="text-2xl font-semibold mt-2">{npmMetrics?.available ? formatNumber(npmMetrics.totalDownloads) : '--'}</p>
                  </div>
                  <div className={`border p-4 ${shell.panelMuted}`}>
                    <p className={`text-[10px] tracking-[0.16em] ${shell.textSoft}`}>GUARDSKILLS · LAST WEEK</p>
                    <p className="text-2xl font-semibold mt-2">{npmMetrics?.available ? formatNumber(npmMetrics.lastWeek) : '--'}</p>
                  </div>
                  <div className={`border p-4 ${shell.panelMuted}`}>
                    <p className={`text-[10px] tracking-[0.16em] ${shell.textSoft}`}>MDIFY · CHROME METRIC</p>
                    <p className={`text-sm font-semibold mt-3 ${chromeMetrics?.available ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {chromeMetrics?.available ? 'AVAILABLE' : 'UNAVAILABLE'}
                    </p>
                  </div>
                  <div className={`border p-4 ${shell.panelMuted}`}>
                    <p className={`text-[10px] tracking-[0.16em] ${shell.textSoft}`}>LAST METRICS REFRESH</p>
                    <p className={`text-sm mt-3 ${shell.textMuted}`}>{formatUpdatedTime(npmMetrics?.fetchedAt || chromeMetrics?.fetchedAt)}</p>
                  </div>
                </div>
                <p className={`text-xs mt-3 ${shell.textMuted}`}>
                  Product KPIs are now consolidated inside Projects to keep planning + distribution decisions in one view.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'xmax-work' && (
            <motion.div key="xmax-work" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-10">
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold tracking-[0.14em] border-l-2 border-zinc-300 pl-3">X GROWTH STRATEGY</h2>
                  <button onClick={refreshTopics} disabled={isRefreshing} className={`px-3 py-1.5 text-[11px] tracking-[0.16em] border ${shell.panel}`}>
                    {isRefreshing ? 'REFRESHING...' : 'REFRESH'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                  {trendingTopics.map(topic => (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopic(selectedTopic === topic.id ? null : topic.id)}
                      className={`border p-3 text-left transition-all ${
                        selectedTopic === topic.id ? 'border-zinc-300 bg-zinc-800/40' : `${shell.panel} hover:border-zinc-500`
                      }`}
                    >
                      <p className="text-sm font-semibold">{topic.title}</p>
                      <p className={`text-xs mt-1 ${shell.textSoft}`}>{topic.source}</p>
                    </button>
                  ))}
                </div>

                <div className={`border p-4 ${shell.panelMuted}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold tracking-[0.12em]">RESEARCH FEED</h3>

                <div className={`border p-4 ${shell.panel}`}>
                  <h3 className="text-sm font-semibold tracking-[0.12em] border-l-2 border-zinc-300 pl-3 mb-3">VIRAL TWEET DRAFTS FROM RESEARCH</h3>
                  {researchLoading && <p className={`text-xs ${shell.textMuted}`}>Generating tweet drafts...</p>}
                  {!researchLoading && researchFeed.length > 0 && (
                    <div className="space-y-3">
                      {researchFeed.slice(0, 3).map((item, idx) => {
                        const tweet = item.snippet ? item.snippet.slice(0, 250) + (item.snippet.length > 250 ? '...' : '') : ''
                        return (
                          <div key={`tweet-${idx}`} className={`border p-3 ${shell.panelMuted}`}>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-[10px] tracking-[0.14em] text-zinc-400">DRAFT {idx + 1}</p>
                              <p className="text-[10px] text-zinc-500">{tweet.length}/280</p>
                            </div>
                            <p className={`text-sm ${shell.textMuted}`}>{tweet}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => handleCopyPost(`tweet-${idx}`, tweet)}
                                className="inline-flex items-center gap-2 px-3 py-1.5 border border-zinc-500 text-xs tracking-[0.14em] hover:bg-zinc-700/30"
                              >
                                <Copy className="w-3.5 h-3.5" /> {copiedPostId === `tweet-${idx}` ? 'COPIED' : 'COPY'}
                              </button>
                              {tweet.length <= 280 && (
                                <a
                                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-3 py-1.5 border border-zinc-300 text-xs tracking-[0.14em] hover:bg-zinc-300/10"
                                >
                                  <Twitter className="w-3.5 h-3.5" /> POST
                                </a>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  {(!researchFeed || researchFeed.length === 0) && !researchLoading && (
                    <p className={`text-xs ${shell.textMuted}`}>No research data to generate tweets from.</p>
                  )}
                </div>

                    <span className={`text-[10px] tracking-[0.14em] ${shell.textSoft}`}>TAVILY SIGNALS</span>
                  </div>

                  {researchLoading && <p className={`text-xs ${shell.textMuted}`}>Loading fresh research...</p>}

                  {!researchLoading && researchError && <p className="text-xs text-rose-400">{researchError}</p>}

                  {!researchLoading && !researchError && !researchAvailable && (
                    <p className={`text-xs ${shell.textMuted}`}>{getResearchUnavailableMessage()}</p>
                  )}

                  {!researchLoading && !researchError && researchAvailable && researchFeed.length === 0 && (
                    <p className={`text-xs ${shell.textMuted}`}>No research results found. Try refresh.</p>
                  )}

                  {!researchLoading && !researchError && researchAvailable && researchFeed.length > 0 && (
                    <div className="space-y-3">
                      {researchFeed.slice(0, 5).map(item => (
                        <a
                          key={`${item.url}-${item.title}`}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`block border p-3 transition-colors ${shell.panel} hover:border-zinc-500`}
                        >
                          <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                          <p className={`text-xs mt-1 line-clamp-2 ${shell.textMuted}`}>{item.snippet}</p>
                          <p className={`text-[10px] mt-2 tracking-[0.12em] ${shell.textSoft}`}>{item.source || 'Web'} · SCORE {item.score.toFixed(2)}</p>
                        </a>
                      ))}
                    </div>
                  )}
                </div>


                <div className={`border p-4 ${shell.panelMuted}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold tracking-[0.12em]">LATEST XMAX OUTPUTS</h3>
                    <span className={`text-[10px] tracking-[0.14em] ${shell.textSoft}`}>FROM /api/xmax</span>
                  </div>

                  {(!xmaxWork?.recentTweets || xmaxWork.recentTweets.length === 0) && (
                    <p className={`text-xs ${shell.textMuted}`}>No recent tweets found in xMax data yet. Run xMax or refresh.</p>
                  )}

                  {xmaxWork?.recentTweets && xmaxWork.recentTweets.length > 0 && (
                    <div className="space-y-2">
                      {xmaxWork.recentTweets.slice(0, 6).map((tweet, idx) => {
                        const text = typeof tweet === 'string' ? tweet : (tweet.text || '')
                        const label = typeof tweet === 'string' ? 'POST' : (tweet.type || tweet.product || 'POST')
                        return (
                          <div key={`${idx}-${text.slice(0,20)}`} className={`border p-3 ${shell.panel}`}>
                            <div className="flex items-center justify-between mb-2">
                              <p className={`text-[10px] tracking-[0.14em] ${shell.textSoft}`}>{label.toUpperCase()}</p>
                              <p className={`text-[10px] ${shell.textSoft}`}>{text.length} chars</p>
                            </div>
                            <p className={`text-sm ${shell.textMuted}`}>{text || 'No text available'}</p>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>


                <AnimatePresence>
                  {selectedTopic && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className={`border p-4 ${shell.panel}`}
                    >
                      <p className={`text-sm mb-4 ${shell.textMuted}`}>{trendingTopics.find(t => t.id === selectedTopic)?.tweets[0].text}</p>
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(trendingTopics.find(t => t.id === selectedTopic)?.tweets[0].text || '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-200 text-black text-xs font-semibold tracking-[0.14em] hover:bg-zinc-300"
                      >
                        <Twitter className="w-4 h-4" /> POST TO X
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              <section className="space-y-4">
                <h2 className="text-lg font-semibold tracking-[0.14em] border-l-2 border-zinc-300 pl-3">MARKETING OPERATIONS</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {['MDIFY', 'GUARDSKILLS'].map(product => (
                    <div key={product} className={`border p-4 ${shell.panel}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-base font-semibold tracking-wide">{product}</h3>
                          <p className={`text-[11px] ${shell.textSoft}`}>{product === 'MDIFY' ? 'Chrome Extension' : 'NPM Package'}</p>
                        </div>
                        <a
                          href={
                            product === 'MDIFY'
                              ? 'https://chromewebstore.google.com/detail/mdify/kimahdiiopfklhcciaiknnfcobamjeki'
                              : 'https://www.npmjs.com/package/guardskills'
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-zinc-200 text-black text-xs font-semibold tracking-[0.14em]"
                        >
                          VIEW
                        </a>
                      </div>

                      <div className="space-y-3">
                        {marketingPosts
                          .filter(post => post.product === product)
                          .map(post => {
                            const badge = getPostBadge(post.channel, post.text)
                            return (
                              <div key={post.id} className={`border p-3 space-y-3 ${shell.panelMuted}`}>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className={`text-[11px] tracking-[0.18em] ${shell.textSoft}`}>{post.channel} POST</p>
                                    <p className={`text-[10px] ${shell.textSoft}`}>Target: {post.target}</p>
                                  </div>
                                  <span className={`text-[10px] px-2 py-1 border tracking-[0.12em] ${badge.tone}`}>
                                    {badge.state} · {badge.label}
                                  </span>
                                </div>

                                <p className={`text-sm leading-relaxed ${shell.textMuted}`}>{post.text}</p>

                                <div className="flex flex-wrap items-center gap-2">
                                  <button
                                    onClick={() => handleCopyPost(post.id, post.text)}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 border border-zinc-500 text-xs tracking-[0.14em] hover:bg-zinc-700/30"
                                  >
                                    <Copy className="w-3.5 h-3.5" /> {copiedPostId === post.id ? 'COPIED' : 'COPY'}
                                  </button>
                                  {post.link && (
                                    <a
                                      href={post.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 px-3 py-1.5 border border-zinc-300 text-xs tracking-[0.14em] hover:bg-zinc-300/10"
                                    >
                                      <Twitter className="w-3.5 h-3.5" /> POST
                                    </a>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  ))}
                </div>
                <p className={`text-xs tracking-[0.14em] text-center ${shell.textSoft}`}>SCHEDULE: 2 POSTS / DAY / PRODUCT (ROTATING)</p>
              </section>
            </motion.div>
          )}

          {activeTab === 'bookmarks' && (
            <motion.div key="bookmarks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              {bookmarks.map(b => (
                <a
                  key={b.id}
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`border p-4 flex items-center justify-between transition-colors ${shell.panel} hover:border-zinc-400`}
                >
                  <div>
                    <p className="text-sm font-medium">{b.title}</p>
                    <p className={`text-xs ${shell.textSoft}`}>{b.url}</p>
                  </div>
                  <Bookmark className={`w-5 h-5 ${shell.textSoft}`} />
                </a>
              ))}
            </motion.div>
          )}

          {activeTab === 'trading-center' && (
            <motion.div key="trading-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Stock Quote Board */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold tracking-[0.14em] border-l-2 border-zinc-300 pl-3">STOCK QUOTE BOARD</h2>
                </div>

                <div className={`border p-4 ${shell.panel}`}>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      placeholder="Enter ticker (e.g., AAPL)"
                      value={tradingTicker}
                      onChange={(e) => setTradingTicker(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 border bg-transparent text-sm focus:outline-none focus:border-zinc-500"
                      onKeyPress={(e) => e.key === 'Enter' && fetchStockQuote(tradingTicker)}
                    />
                    <button
                      onClick={() => fetchStockQuote(tradingTicker)}
                      disabled={loadingStock || !tradingTicker}
                      className="px-4 py-2 border text-xs tracking-wider hover:bg-zinc-800/40 disabled:opacity-50"
                    >
                      {loadingStock ? 'LOADING...' : 'FETCH'}
                    </button>
                  </div>

                  {/* Watchlist */}
                  <div className="mb-4">
                    <p className={`text-[10px] tracking-[0.18em] mb-2 ${shell.textSoft}`}>WATCHLIST</p>
                    <div className="flex flex-wrap gap-2">
                      {watchlist.map(ticker => (
                        <button
                          key={ticker}
                          onClick={() => {
                            setTradingTicker(ticker)
                            fetchStockQuote(ticker)
                          }}
                          className={`px-3 py-1.5 border text-xs tracking-wider hover:border-zinc-500 transition-colors ${
                            tradingTicker === ticker ? 'border-zinc-300 bg-zinc-800/40' : ''
                          }`}
                        >
                          {ticker}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stock Data Display */}
                  {stockData && (
                    <div className={`border p-4 ${shell.panelMuted}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-2xl font-semibold">{stockData.symbol}</p>
                          <p className={`text-xs ${shell.textSoft}`}>Last updated: {new Date().toLocaleTimeString()}</p>
                        </div>
                        <button
                          onClick={() => fetchStockQuote(stockData.symbol)}
                          className="p-2 border hover:bg-zinc-800/40"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className={`text-[10px] tracking-[0.14em] ${shell.textSoft}`}>PRICE</p>
                          <p className="text-xl font-semibold">${stockData.price.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className={`text-[10px] tracking-[0.14em] ${shell.textSoft}`}>CHANGE</p>
                          <p className={`text-xl font-semibold ${stockData.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {stockData.change >= 0 ? '+' : ''}{stockData.change.toFixed(2)} ({stockData.changePercent.toFixed(2)}%)
                          </p>
                        </div>
                        <div>
                          <p className={`text-[10px] tracking-[0.14em] ${shell.textSoft}`}>VOLUME</p>
                          <p className="text-xl font-semibold">{formatNumber(stockData.volume)}</p>
                        </div>
                        <div>
                          <p className={`text-[10px] tracking-[0.14em] ${shell.textSoft}`}>MARKET CAP</p>
                          <p className="text-xl font-semibold">{stockData.marketCap ? stockData.marketCap : '--'}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className={shell.textSoft}>Open:</p>
                          <p className="text-zinc-200">${stockData.open.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className={shell.textSoft}>High:</p>
                          <p className="text-zinc-200">${stockData.high.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className={shell.textSoft}>Low:</p>
                          <p className="text-zinc-200">${stockData.low.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className={shell.textSoft}>Prev Close:</p>
                          <p className="text-zinc-200">${stockData.previousClose.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Options Chain Viewer */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold tracking-[0.14em] border-l-2 border-zinc-300 pl-3">OPTIONS CHAIN</h2>

                {stockData && (
                  <div className={`border p-4 ${shell.panel}`}>
                    <div className="flex items-center justify-between mb-4">
                      <p className={`text-sm ${shell.textSoft}`}>
                        Options for <span className="text-zinc-200">{stockData.symbol}</span>
                      </p>
                      <button
                        onClick={() => fetchOptions(stockData.symbol)}
                        disabled={loadingOptions}
                        className="px-3 py-1.5 border text-xs tracking-wider hover:bg-zinc-800/40 disabled:opacity-50"
                      >
                        {loadingOptions ? 'LOADING...' : 'FETCH OPTIONS'}
                      </button>
                    </div>

                    {optionsData && optionsData.expirations.length > 0 && (
                      <div className="mb-4">
                        <p className={`text-[10px] tracking-[0.18em] mb-2 ${shell.textSoft}`}>EXPIRATION DATE</p>
                        <div className="flex flex-wrap gap-2">
                          {optionsData.expirations.map((exp: string) => (
                            <button
                              key={exp}
                              onClick={() => setSelectedExpiration(exp)}
                              className={`px-3 py-1.5 border text-xs tracking-wider hover:border-zinc-500 transition-colors ${
                                selectedExpiration === exp ? 'border-zinc-300 bg-zinc-800/40' : ''
                              }`}
                            >
                              {exp}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {optionsData && selectedExpiration && (
                      <div className="space-y-4">
                        {/* Calls */}
                        <div>
                          <p className={`text-xs tracking-[0.16em] mb-2 text-emerald-400`}>CALLS</p>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className={`border-b ${shell.textSoft}`}>
                                  <th className="px-2 py-2 text-left">STRIKE</th>
                                  <th className="px-2 py-2 text-left">LAST</th>
                                  <th className="px-2 py-2 text-left">BID</th>
                                  <th className="px-2 py-2 text-left">ASK</th>
                                  <th className="px-2 py-2 text-left">IV</th>
                                  <th className="px-2 py-2 text-left">VOL</th>
                                  <th className="px-2 py-2 text-left">OI</th>
                                </tr>
                              </thead>
                              <tbody>
                                {optionsData.calls
                                  .filter((c: any) => c.expiration === selectedExpiration)
                                  .slice(0, 10)
                                  .map((call: any, idx: number) => (
                                    <tr key={`call-${idx}`} className={`border-b ${shell.panelMuted}`}>
                                      <td className="px-2 py-2">${call.strike.toFixed(2)}</td>
                                      <td className="px-2 py-2">{call.lastPrice.toFixed(2)}</td>
                                      <td className="px-2 py-2">{call.bid.toFixed(2)}</td>
                                      <td className="px-2 py-2">{call.ask.toFixed(2)}</td>
                                      <td className="px-2 py-2">{call.iv ? call.iv.toFixed(2) + '%' : '--'}</td>
                                      <td className="px-2 py-2">{formatNumber(call.volume)}</td>
                                      <td className="px-2 py-2">{formatNumber(call.openInterest)}</td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Puts */}
                        <div>
                          <p className={`text-xs tracking-[0.16em] mb-2 text-rose-400`}>PUTS</p>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className={`border-b ${shell.textSoft}`}>
                                  <th className="px-2 py-2 text-left">STRIKE</th>
                                  <th className="px-2 py-2 text-left">LAST</th>
                                  <th className="px-2 py-2 text-left">BID</th>
                                  <th className="px-2 py-2 text-left">ASK</th>
                                  <th className="px-2 py-2 text-left">IV</th>
                                  <th className="px-2 py-2 text-left">VOL</th>
                                  <th className="px-2 py-2 text-left">OI</th>
                                </tr>
                              </thead>
                              <tbody>
                                {optionsData.puts
                                  .filter((p: any) => p.expiration === selectedExpiration)
                                  .slice(0, 10)
                                  .map((put: any, idx: number) => (
                                    <tr key={`put-${idx}`} className={`border-b ${shell.panelMuted}`}>
                                      <td className="px-2 py-2">${put.strike.toFixed(2)}</td>
                                      <td className="px-2 py-2">{put.lastPrice.toFixed(2)}</td>
                                      <td className="px-2 py-2">{put.bid.toFixed(2)}</td>
                                      <td className="px-2 py-2">{put.ask.toFixed(2)}</td>
                                      <td className="px-2 py-2">{put.iv ? put.iv.toFixed(2) + '%' : '--'}</td>
                                      <td className="px-2 py-2">{formatNumber(put.volume)}</td>
                                      <td className="px-2 py-2">{formatNumber(put.openInterest)}</td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {optionsData && optionsData.expirations.length === 0 && (
                      <p className={`text-sm ${shell.textMuted}`}>No options data available for this symbol.</p>
                    )}

                    {!optionsData && (
                      <p className={`text-sm ${shell.textMuted}`}>Click "FETCH OPTIONS" to view the options chain.</p>
                    )}
                  </div>
                )}

                {!stockData && (
                  <p className={`text-sm ${shell.textMuted}`}>Fetch a stock quote first to view options.</p>
                )}
              </section>

              {/* Trading Journal */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold tracking-[0.14em] border-l-2 border-zinc-300 pl-3">TRADING JOURNAL</h2>

                <div className={`border p-4 ${shell.panel}`}>
                  <h3 className="text-sm font-semibold mb-4">ADD NEW ENTRY</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className={`block text-[10px] tracking-[0.14em] mb-1 ${shell.textSoft}`}>DATE</label>
                      <input
                        type="date"
                        value={newEntry.date}
                        onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                        className="w-full px-3 py-2 border bg-transparent text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className={`block text-[10px] tracking-[0.14em] mb-1 ${shell.textSoft}`}>STOCK</label>
                      <input
                        type="text"
                        placeholder="AAPL"
                        value={newEntry.stock}
                        onChange={(e) => setNewEntry({ ...newEntry, stock: e.target.value.toUpperCase() })}
                        className="w-full px-3 py-2 border bg-transparent text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className={`block text-[10px] tracking-[0.14em] mb-1 ${shell.textSoft}`}>ACTION</label>
                      <select
                        value={newEntry.action}
                        onChange={(e) => setNewEntry({ ...newEntry, action: e.target.value })}
                        className="w-full px-3 py-2 border bg-transparent text-sm focus:outline-none"
                      >
                        <option value="BUY">BUY</option>
                        <option value="SELL">SELL</option>
                        <option value="SHORT">SHORT</option>
                        <option value="COVER">COVER</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-[10px] tracking-[0.14em] mb-1 ${shell.textSoft}`}>ENTRY PRICE</label>
                      <input
                        type="number"
                        placeholder="150.00"
                        value={newEntry.entryPrice}
                        onChange={(e) => setNewEntry({ ...newEntry, entryPrice: e.target.value })}
                        step="0.01"
                        className="w-full px-3 py-2 border bg-transparent text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className={`block text-[10px] tracking-[0.14em] mb-1 ${shell.textSoft}`}>EXIT PRICE (Optional)</label>
                      <input
                        type="number"
                        placeholder="160.00"
                        value={newEntry.exitPrice}
                        onChange={(e) => setNewEntry({ ...newEntry, exitPrice: e.target.value })}
                        step="0.01"
                        className="w-full px-3 py-2 border bg-transparent text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className={`block text-[10px] tracking-[0.14em] mb-1 ${shell.textSoft}`}>QUANTITY</label>
                      <input
                        type="number"
                        placeholder="100"
                        value={newEntry.quantity}
                        onChange={(e) => setNewEntry({ ...newEntry, quantity: e.target.value })}
                        className="w-full px-3 py-2 border bg-transparent text-sm focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className={`block text-[10px] tracking-[0.14em] mb-1 ${shell.textSoft}`}>NOTES</label>
                      <textarea
                        placeholder="Trade notes, strategy, reasoning..."
                        value={newEntry.notes}
                        onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border bg-transparent text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                  <button
                    onClick={saveJournalEntry}
                    className="px-4 py-2 bg-zinc-200 text-black text-xs tracking-wider font-semibold hover:bg-zinc-300"
                  >
                    SAVE ENTRY
                  </button>
                </div>

                {/* Journal Entries List */}
                {journalEntries.length > 0 && (
                  <div className={`border p-4 ${shell.panel}`}>
                    <h3 className="text-sm font-semibold mb-4">JOURNAL ENTRIES</h3>
                    <div className="space-y-3">
                      {journalEntries.map((entry) => {
                        const pnl = calculatePandL(entry)
                        return (
                          <div key={entry.id} className={`border p-3 ${shell.panelMuted}`}>
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-semibold">{entry.stock}</p>
                                  <span
                                    className={`text-[10px] px-2 py-0.5 border ${
                                      entry.action === 'BUY' || entry.action === 'COVER'
                                        ? 'border-emerald-500/30 text-emerald-400'
                                        : 'border-rose-500/30 text-rose-400'
                                    }`}
                                  >
                                    {entry.action}
                                  </span>
                                </div>
                                <p className={`text-xs ${shell.textMuted}`}>{entry.date}</p>
                              </div>
                              <div className="text-right">
                                {entry.exitPrice ? (
                                  <div>
                                    <p className={`text-sm font-semibold ${pnl.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                      {pnl.profit >= 0 ? '+' : ''}${pnl.profit.toFixed(2)}
                                    </p>
                                    <p className={`text-[10px] ${pnl.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                      ({pnl.percent >= 0 ? '+' : ''}{pnl.percent.toFixed(2)}%)
                                    </p>
                                  </div>
                                ) : (
                                  <p className={`text-xs ${shell.textMuted}`}>OPEN</p>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                              <div>
                                <p className={shell.textSoft}>Entry:</p>
                                <p className="text-zinc-200">${entry.entryPrice.toFixed(2)}</p>
                              </div>
                              <div>
                                <p className={shell.textSoft}>Exit:</p>
                                <p className="text-zinc-200">{entry.exitPrice ? '$' + entry.exitPrice.toFixed(2) : '--'}</p>
                              </div>
                              <div>
                                <p className={shell.textSoft}>Qty:</p>
                                <p className="text-zinc-200">{entry.quantity}</p>
                              </div>
                            </div>
                            {entry.notes && (
                              <p className={`text-xs mt-2 italic ${shell.textMuted}`}>"{entry.notes}"</p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {journalEntries.length === 0 && (
                  <p className={`text-sm ${shell.textMuted}`}>No journal entries yet. Add your first trade above.</p>
                )}
              </section>

              {/* Portfolio Tracker */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold tracking-[0.14em] border-l-2 border-zinc-300 pl-3">PORTFOLIO TRACKER</h2>

                {journalEntries.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Total P&L */}
                    <div className={`border p-4 ${shell.panel}`}>
                      <p className={`text-[10px] tracking-[0.18em] mb-2 ${shell.textSoft}`}>TOTAL P&L</p>
                      <p className={`text-3xl font-semibold`}>
                        {journalEntries
                          .filter(e => e.exitPrice)
                          .reduce((total, entry) => total + calculatePandL(entry).profit, 0) >= 0
                          ? '+'
                          : ''}
                        {journalEntries
                          .filter(e => e.exitPrice)
                          .reduce((total, entry) => total + calculatePandL(entry).profit, 0)
                          .toFixed(2)}
                      </p>
                    </div>

                    {/* Open Positions */}
                    <div className={`border p-4 ${shell.panel}`}>
                      <p className={`text-[10px] tracking-[0.18em] mb-2 ${shell.textSoft}`}>OPEN POSITIONS</p>
                      <p className="text-3xl font-semibold">
                        {journalEntries.filter(e => !e.exitPrice).length}
                      </p>
                    </div>

                    {/* Closed Trades */}
                    <div className={`border p-4 ${shell.panel}`}>
                      <p className={`text-[10px] tracking-[0.18em] mb-2 ${shell.textSoft}`}>CLOSED TRADES</p>
                      <p className="text-3xl font-semibold">
                        {journalEntries.filter(e => e.exitPrice).length}
                      </p>
                    </div>
                  </div>
                )}

                {/* Exposure by Stock */}
                {journalEntries.filter(e => !e.exitPrice).length > 0 && (
                  <div className={`border p-4 ${shell.panel}`}>
                    <h3 className="text-sm font-semibold mb-4">EXPOSURE BY STOCK</h3>
                    <div className="space-y-2">
                      {Array.from(
                        new Set(
                          journalEntries
                            .filter(e => !e.exitPrice)
                            .map(e => e.stock)
                        )
                      ).map(stock => {
                        const positions = journalEntries.filter(e => !e.exitPrice && e.stock === stock)
                        const exposure = positions.reduce(
                          (total, pos) => total + pos.entryPrice * pos.quantity,
                          0
                        )
                        return (
                          <div key={stock} className={`border p-3 ${shell.panelMuted}`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-semibold">{stock}</p>
                                <p className={`text-xs ${shell.textMuted}`}>{positions.length} position(s)</p>
                              </div>
                              <p className="text-sm font-semibold">${exposure.toFixed(2)}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {journalEntries.filter(e => !e.exitPrice).length === 0 && (
                  <p className={`text-sm ${shell.textMuted}`}>No open positions.</p>
                )}
              </section>

              {/* Technical Indicators */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold tracking-[0.14em] border-l-2 border-zinc-300 pl-3">TECHNICAL INDICATORS</h2>

                {stockData && (
                  <div className={`border p-4 ${shell.panel}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Moving Averages */}
                      <div>
                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4" />
                          MOVING AVERAGES
                        </h3>
                        <div className="space-y-2">
                          <div className={`border p-3 ${shell.panelMuted}`}>
                            <p className={`text-[10px] tracking-[0.14em] ${shell.textSoft}`}>SMA 20</p>
                            <p className="text-lg font-semibold">
                              {calculateSMA([stockData.price], 20) ? calculateSMA([stockData.price], 20)!.toFixed(2) : 'N/A (Need more data)'}
                            </p>
                          </div>
                          <div className={`border p-3 ${shell.panelMuted}`}>
                            <p className={`text-[10px] tracking-[0.14em] ${shell.textSoft}`}>SMA 50</p>
                            <p className="text-lg font-semibold">
                              {calculateSMA([stockData.price], 50) ? calculateSMA([stockData.price], 50)!.toFixed(2) : 'N/A (Need more data)'}
                            </p>
                          </div>
                          <div className={`border p-3 ${shell.panelMuted}`}>
                            <p className={`text-[10px] tracking-[0.14em] ${shell.textSoft}`}>SMA 200</p>
                            <p className="text-lg font-semibold">
                              {calculateSMA([stockData.price], 200) ? calculateSMA([stockData.price], 200)!.toFixed(2) : 'N/A (Need more data)'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* RSI and MACD */}
                      <div>
                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          MOMENTUM INDICATORS
                        </h3>
                        <div className="space-y-2">
                          <div className={`border p-3 ${shell.panelMuted}`}>
                            <p className={`text-[10px] tracking-[0.14em] ${shell.textSoft}`}>RSI (14)</p>
                            <p className="text-lg font-semibold">
                              {calculateRSI([stockData.price, stockData.previousClose]) ? calculateRSI([stockData.price, stockData.previousClose])!.toFixed(2) : 'N/A (Need more data)'}
                            </p>
                            {calculateRSI([stockData.price, stockData.previousClose]) && (
                              <p className={`text-xs mt-1 ${
                                calculateRSI([stockData.price, stockData.previousClose])! > 70
                                  ? 'text-rose-400'
                                  : calculateRSI([stockData.price, stockData.previousClose])! < 30
                                    ? 'text-emerald-400'
                                    : shell.textMuted
                              }`}>
                                {calculateRSI([stockData.price, stockData.previousClose])! > 70 ? 'Overbought' : calculateRSI([stockData.price, stockData.previousClose])! < 30 ? 'Oversold' : 'Neutral'}
                              </p>
                            )}
                          </div>
                          <div className={`border p-3 ${shell.panelMuted}`}>
                            <p className={`text-[10px] tracking-[0.14em] ${shell.textSoft}`}>MACD</p>
                            <div className="space-y-1">
                              <p className="text-xs">
                                <span className={shell.textSoft}>MACD:</span>{' '}
                                <span className="text-zinc-200">
                                  {calculateMACD([stockData.price, stockData.previousClose]) ? calculateMACD([stockData.price, stockData.previousClose])!.macd.toFixed(4) : 'N/A'}
                                </span>
                              </p>
                              <p className="text-xs">
                                <span className={shell.textSoft}>Signal:</span>{' '}
                                <span className="text-zinc-200">
                                  {calculateMACD([stockData.price, stockData.previousClose]) ? calculateMACD([stockData.price, stockData.previousClose])!.signal.toFixed(4) : 'N/A'}
                                </span>
                              </p>
                              <p className="text-xs">
                                <span className={shell.textSoft}>Hist:</span>{' '}
                                <span className={`${
                                  calculateMACD([stockData.price, stockData.previousClose])
                                    ? calculateMACD([stockData.price, stockData.previousClose])!.histogram >= 0
                                      ? 'text-emerald-400'
                                      : 'text-rose-400'
                                    : shell.textMuted
                                }`}>
                                  {calculateMACD([stockData.price, stockData.previousClose])
                                    ? (calculateMACD([stockData.price, stockData.previousClose])!.histogram >= 0 ? '+' : '') +
                                        calculateMACD([stockData.price, stockData.previousClose])!.histogram.toFixed(4)
                                    : 'N/A'}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`mt-4 p-3 border ${shell.panelMuted}`}>
                      <p className={`text-[10px] tracking-[0.14em] ${shell.textSoft}`}>NOTE</p>
                      <p className={`text-xs ${shell.textMuted}`}>
                        Technical indicators require historical price data. This section shows placeholder calculations based on current and previous close price. 
                        For accurate indicators, integrate with a historical price API (e.g., TwelveData time series endpoint).
                      </p>
                    </div>
                  </div>
                )}

                {!stockData && (
                  <p className={`text-sm ${shell.textMuted}`}>Fetch a stock quote to view technical indicators.</p>
                )}
              </section>
            </motion.div>
          )}

          {activeTab === 'software-team' && (
            <motion.div key="team" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className={`border p-4 ${shell.panel}`}>
                <h2 className="text-lg font-semibold tracking-[0.14em] border-l-2 border-zinc-300 pl-3 mb-1">TEAM OPERATIONS</h2>
                <p className={`text-xs tracking-[0.12em] ${shell.textSoft}`}>
                  LIVE DELIVERY STATUS · MEMBER · ROLE · STATUS · TASK · BLOCKERS · LAST UPDATE
                </p>
                <p className={`text-[11px] mt-2 ${shell.textSoft}`}>
                  FEED UPDATED: {formatUpdatedTimeIST(teamLastUpdated)}
                </p>
              </div>


              <div className={`border p-4 ${shell.panel}`}>
                <h3 className="text-sm font-semibold tracking-[0.14em] border-l-2 border-zinc-300 pl-3 mb-3">SOFTWARE PIPELINE FLOW</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className={`border p-3 ${shell.panelMuted}`}>
                    <p className="text-xs tracking-[0.14em] text-zinc-400">STEP 1</p>
                    <p className="text-sm font-semibold mt-1">Developer</p>
                    <p className={`text-xs mt-2 ${shell.textMuted}`}>Implements feature/fix and hands off to QA.</p>
                  </div>
                  <div className={`border p-3 ${shell.panelMuted}`}>
                    <p className="text-xs tracking-[0.14em] text-zinc-400">STEP 2</p>
                    <p className="text-sm font-semibold mt-1">QA</p>
                    <p className={`text-xs mt-2 ${shell.textMuted}`}>Tests and validates. If failed, loops back to Developer.</p>
                  </div>
                  <div className={`border p-3 ${shell.panelMuted}`}>
                    <p className="text-xs tracking-[0.14em] text-zinc-400">STEP 3</p>
                    <p className="text-sm font-semibold mt-1">DevOps</p>
                    <p className={`text-xs mt-2 ${shell.textMuted}`}>Build + deployment after QA approval.</p>
                  </div>
                  <div className={`border p-3 ${shell.panelMuted}`}>
                    <p className="text-xs tracking-[0.14em] text-zinc-400">STEP 4</p>
                    <p className="text-sm font-semibold mt-1">Manual Tester</p>
                    <p className={`text-xs mt-2 ${shell.textMuted}`}>Production validation. Issues loop to QA → Developer.</p>
                  </div>
                </div>
                <p className={`text-xs tracking-[0.12em] mt-3 ${shell.textSoft}`}>FLOW: Developer → QA → DevOps → Manual Tester · Loop back on failures</p>
              </div>
              <div className={`border p-3 ${shell.panelMuted}`}>
                <div className="hidden md:grid md:grid-cols-[1.2fr_1fr_0.8fr_1.8fr_1.3fr_1.3fr] gap-3 text-[10px] tracking-[0.14em] text-zinc-400 uppercase px-1">
                  <span>Member</span>
                  <span>Role</span>
                  <span>Status</span>
                  <span>Current Task</span>
                  <span>Blocker</span>
                  <span>Updated At</span>
                </div>
              </div>

              <div className="space-y-2">
                {teamData.map(member => {
                  const stale = isStale(member.updatedAt)
                  return (
                    <div key={member.id} className={`border p-4 ${shell.panel}`}>
                      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_0.8fr_1.8fr_1.3fr_1.3fr] gap-3 items-start">
                        <div>
                          <p className="text-sm font-semibold">{member.name}</p>
                          <p className={`text-[11px] ${shell.textSoft}`}>ID: {member.id}</p>
                        </div>
                        <div className="text-sm">{member.role}</div>
                        <div>
                          <p
                            className={`text-xs inline-flex items-center gap-2 capitalize ${
                              member.status === 'working' ? 'text-emerald-400' : member.status === 'blocked' ? 'text-rose-400' : shell.textMuted
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                member.status === 'working' ? 'bg-emerald-500 animate-pulse' : member.status === 'blocked' ? 'bg-rose-500' : 'bg-zinc-500'
                              }`}
                            />
                            {member.status}
                          </p>
                        </div>
                        <div className="text-sm">{member.currentTask || 'No task assigned'}</div>
                        <div className={`text-sm ${member.blocker ? 'text-amber-400' : shell.textMuted}`}>{member.blocker || 'None'}</div>
                        <div className="space-y-1">
                          <p className={`text-xs ${shell.textMuted}`}>{formatUpdatedTimeIST(member.updatedAt)}</p>
                          {stale && <span className="inline-block text-[10px] px-2 py-0.5 border border-amber-500/40 text-amber-400">STALE</span>}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
          backgroundSize: '42px 42px',
        }}
      />
    </div>
  )
}

export default function MissionControl() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] text-gray-50 font-sans p-6">LOADING...</div>}>
      <MissionControlContent />
    </Suspense>
  )
}
