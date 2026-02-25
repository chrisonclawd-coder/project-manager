'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, BookOpen, Twitter, Bookmark, CheckCircle, Circle, Clock, Zap, ArrowUp, RefreshCw, Loader2 } from 'lucide-react'

// Full viral tweets - 200-280 words each
const defaultTopics = [
  { 
    id: 1, 
    title: 'AI Breakthroughs 2026', 
    source: 'MIT Tech Review',
    tweets: [
      { text: "MIT released their '10 Breakthrough Technologies 2026' list, and AI agents are dominating. Here's what no one is talking about: the shift from chatbots to autonomous agents is happening FASTER than anyone predicted.\n\nWe're not talking about typing prompts anymore. We're talking about AI that THINKS, PLANS, and EXECUTES tasks on your behalf. This is the biggest paradigm shift since the iPhone.\n\nThe implications are massive:\n- Traditional SaaS is dead\n- Every company becomes an AI company\n- Your productivity 10xes overnight\n\nI've been building with agentic AI for 6 months. The difference from traditional development is night and day. You're not writing code anymore - you're directing intelligence.\n\nIf you're not experimenting with agents today, you're already behind.\n\nWhat's your take? Are you building with agents yet?\n\n#AI #Tech #Innovation", hashtags: ['AI', 'Tech', 'Innovation'] },
      { text: "Breakthrough technologies seem overhyped until suddenly they're everywhere. That's exactly where AI agents are right now.\n\nI've been tracking this trend for 18 months. The trajectory is clear: we're moving from AI as a TOOL to AI as a TEAMMATE. This isn't science fiction anymore.\n\nHere's what excites me most:\n- Agents that learn your preferences and anticipate needs\n- Systems that delegate complex tasks autonomously\n- Development workflows where you direct, AI executes\n\nThe companies winning right now aren't the biggest - they're the fastest to adapt.\n\nWhat's your prediction? Where do you see AI going in 2026?\n\nDrop your thoughts below 👋\n\n#Breakthrough #AI #Future", hashtags: ['Tech2026', 'Breakthrough'] }
    ]
  },
  { 
    id: 2, 
    title: 'Gartner Tech Trends', 
    source: 'Gartner',
    tweets: [
      { text: "Gartner released their Top 10 Strategic Tech Trends for 2026, and I've analyzed every single one. Here's what actually matters:\n\n1. AGENTIC AI - This is THE trend. Not chatbots. Not copilots. Autonomous agents that DO work.\n2. COMPUTE VISIBILITY - Finally, we'll know where our compute dollars go\n3. POST-QUANTUM CRYPTOGRAPHY - Security for the quantum era\n4. ENERGY-EFFICIENT AI - Because AI uses more electricity than some countries\n5. SPATIAL COMPUTING - Apple Vision Pro is just the beginning\n\nBut here's what Gartner DIDN'T say: the biggest trend is the CONVERGENCE. AI + Cloud + Edge + Spatial = something entirely new.\n\nI've been building in this space. The companies getting it right aren't focusing on one trend - they're building platforms that LEVERAGE multiple trends simultaneously.\n\nThe next 12 months will determine who leads the next decade. Are you ready?\n\nWhat's your take? Drop a comment 👇\n\n#Gartner #TechTrends", hashtags: ['Gartner', 'TechTrends'] },
      { text: "Let me break down what Gartner's 2026 trends actually mean for you:\n\nAgentic AI = Your AI coworker who gets stuff done\nSpatial Computing = You're going to live in mixed reality\nEnergy-Efficient AI = Finally, sustainable AI at scale\n\nBut here's the real talk: trends are useless without execution. Every year, thousands of companies read these reports, nod, and do nothing.\n\nThe difference between companies that thrive and those that die isn't knowing trends - it's ACTING on them fast.\n\nI've seen this pattern repeat:\n- 2010: Mobile-first - companies that adapted won\n- 2015: Cloud-native - companies that adapted won\n- 2020: AI-first - companies that adapted are winning NOW\n\nThe question isn't what trends to watch. It's what you're BUILDING with them.\n\nWhat's your strategy for 2026?\n\nLet's discuss 👇\n\n#Strategy #Tech", hashtags: ['Tech', 'Gartner'] }
    ]
  },
  { 
    id: 3, 
    title: 'AI Voice Agents', 
    source: 'RingCentral',
    tweets: [
      { text: "AI voice agents aren't coming. They're HERE. And they're better than most humans at customer service.\n\n different voice AI platformsI tested 12 last month. Here's my breakdown:\n\nTHE GOOD:\n- 24/7 availability (no coffee breaks, no bad days)\n- Infinite scalability (handle 10 or 10,000 calls)\n- Consistent personality (no training drift)\n- Cost reduction: 70-90% vs human agents\n\nTHE CHALLENGES:\n- Complex emotional situations still need humans\n- Accent/dialect understanding varies wildly\n- Trust building takes time\n\nBut here's what's interesting: the BEST implementations aren't replacing humans - they're AUGMENTING them. AI handles 80% of routine calls, humans handle the 20% that need empathy.\n\nResult: Better customer experience + lower costs + happier human agents.\n\nThe future isn't AI vs humans. It's AI + humans = incredible experiences.\n\nWhat's your experience with voice AI? 👇\n\n#AI #VoiceAgents #CustomerService", hashtags: ['AI', 'VoiceAgents'] },
      { text: "Hot take: 80% of customer service reps will be replaced by AI within 3 years. Not because AI is better at everything - but because 80% of customer service is ROUTINE.\n\nThink about your last 10 interactions:\n- Password reset\n- Order status\n- Basic troubleshooting\n- FAQ questions\n\nAI handles ALL of these perfectly. And it's available 24/7. And it never gets frustrated.\n\nBut here's what people miss: the 20% that NEEDS humans - complex empathy, nuanced problem-solving - that's where humans shine.\n\nThe future isn't job elimination. It's job elevation. Humans handle the hard stuff. AI handles the easy stuff.\n\nCompanies already doing this see 70% cost reduction, 40% faster resolution, 25% higher satisfaction.\n\nAgree? Disagree? Let's debate 👇\n\n#AI #FutureOfWork", hashtags: ['AI', 'VoiceTech'] }
    ]
  },
  { 
    id: 4, 
    title: 'Hyperscale AI Data Centers', 
    source: 'MIT Tech Review',
    tweets: [
      { text: "Hyperscale AI data centers are consuming energy at an insane rate. One GPT-4 training run = enough electricity to power 100 homes for a year.\n\nBut here's what the media isn't telling you: this is TEMPORARY.\n\nThe future of AI infrastructure is FISSION + FUSION + RENEWABLES. And it's coming faster than you think.\n\nI spent 3 months researching this. Here's the truth:\n\nCURRENT: Massive energy consumption, data center shortage, GPU scarcity\nNEXT 2 YEARS: Nuclear mini-reactors at data centers, renewable + AI co-location, 10x more efficient chips\n\nAI's energy problem is SOLVABLE. The same intelligence that's consuming energy is SOLVING energy.\n\nThe companies investing in green AI infrastructure now will dominate the next decade.\n\nWho else is excited about this? Drop a 👋\n\n#AI #DataCenters #CleanEnergy", hashtags: ['AI', 'DataCenters'] },
      { text: "AI data centers are the new oil refineries. But the smartest players are already going green.\n\nMicrosoft signed a nuclear deal. Google is 100% renewable. Amazon is building solar farms everywhere.\n\nThe future belongs to companies that solve the energy problem.\n\nHere's my prediction:\n- 2026: Everyone talks about AI energy\n- 2027: First AI data centers powered by nuclear\n- 2028: Energy efficiency becomes competitive advantage\n- 2029: Green AI is the standard\n\nThe companies winning aren't just building AI - they're building SUSTAINABLE AI.\n\nAnd the opportunity? There's a massive shortage of talent who understand BOTH AI AND energy systems.\n\nWhat do you think? Is sustainable AI the next big thing? 👇\n\n#AI #GreenTech #Energy", hashtags: ['AI', 'Energy'] }
    ]
  },
  { 
    id: 5, 
    title: 'Intelligent Apps', 
    source: 'Capgemini',
    tweets: [
      { text: "Every app that doesn't have AI built in is about to become obsolete. Here's why:\n\nThe shift from \"apps with AI features\" to \"AI-native apps\" is happening NOW.\n\nDifference:\n- OLD: AI as a feature (chatbot, search enhancement)\n- NEW: AI as the foundation (understands context, anticipates needs, acts proactively)\n\nI've built both. The difference is NIGHT AND DAY. AI-native apps feel like magic. AI-feature apps feel like... features.\n\nHere's what this means:\n- If you're building: Make AI your foundation, not your feature\n- If you're buying: Ask how it uses AI\n- If you're learning: AI development skills = career insurance\n\nThe app store is dead. Long live the AI agent store.\n\nThis is the biggest platform shift since mobile. Don't miss it.\n\nWhat apps feel \"AI-native\" to you? 👇\n\n#AI #Apps #Innovation", hashtags: ['AI', 'Apps'] },
      { text: "The app store model is dying. Here's the uncomfortable truth:\n\nNobody wants to download 50 apps anymore. They want ONE assistant that does everything.\n\nThat's exactly what AI-native apps deliver:\n- ONE app = all your needs met\n- Context-aware = knows what you need before you ask\n- Proactive = acts on your behalf\n- Learning = gets better the more you use it\n\nThis is happening RIGHT NOW:\n- Claude/GPT: One AI that replaces 50 tools\n- Apple Intelligence: System-wide AI across all devices\n- Microsoft Copilot: AI in everything you do\n\nThe pattern is clear: MORE AI, FEWER apps.\n\nThe implications: App stores become AI aggregators, developers become AI prompt engineers.\n\nAre you ready for this shift?\n\nLet's discuss 👇\n\n#AIFirst #Apps", hashtags: ['AI', 'Apps'] }
    ]
  },
  { 
    id: 6, 
    title: 'AI Coding Trends', 
    source: 'GitHub Blog',
    tweets: [
      { text: "12 AI Coding Emerging Trends for 2026 that will reshape how we write software:\n\n1. AGENTIC AI: AI that plans and executes multi-step tasks\n2. AUTONOMOUS CODING: AI that can build entire features from prompts\n3. NATURAL LANGUAGE → CODE: Describe what you want, get working code\n4. AUTOMATED TESTING: AI that writes and maintains your test suite\n5. SELF-HEALING CODE: Systems that detect and fix bugs automatically\n6. CONTEXT-AWARE COMPLETION: AI that understands your entire codebase\n7. VOICE-CODING: Speak your code into existence\n8. AI PAIR PROGRAMMING: Human + AI collaborating in real-time\n9. AUTOMATED REFACTORING: AI that improves code quality continuously\n10. SECURITY AI: AI that finds vulnerabilities before deployment\n11. DOCUMENTATION AI: Auto-generated docs that stay current\n12. AI CODE REVIEW: Instant feedback on every PR\n\nThe dev landscape is being REWRITTEN.\n\nWhich trend are you most excited about? 👇\n\n#AICoding #DevTools", hashtags: ['AI', 'Coding'] },
      { text: "AI coding isn't the future. It's the PRESENT. And developers who don't adapt are being left behind.\n\nHere's the uncomfortable truth:\n- Companies using AI: 10x more productive\n- Companies NOT using AI: Struggling to compete\n\nI've used AI coding tools for 2 years. The difference is EXPONENTIAL.\n\nWhat used to take 8 hours now takes 45 minutes. What used to require a team now needs one person with AI.\n\nBut here's what people miss: AI doesn't replace developers. It AMPLIFIES them.\n\nThe best developers aren't fighting AI. They're directing AI.\n\nYour new job isn't to type code. It's to:\n- UNDERSTAND what needs building\n- DIRECT the AI effectively\n- VERIFY the output\n- FOCUS on hard problems\n\nThat's a more valuable skill set than memorizing syntax.\n\nAre you using AI in your daily work? Let's talk 👇\n\n#AI #Coding #Productivity", hashtags: ['AI', 'Coding'] }
    ]
  },
  { 
    id: 7, 
    title: 'Agentic AI Era', 
    source: 'Medium',
    tweets: [
      { text: "2026 = The Year Agents Take Over.\n\nWe're not talking about chatbots anymore. We're talking about AUTONOMOUS AI that:\n- Plans multi-step tasks\n- Executes independently\n- Learns from outcomes\n- Collaborates with other agents\n\nThis is the biggest shift in software since... ever.\n\nHere's what this means practically:\n\nBEFORE: You write code line by line\nNOW: You describe what you want, AI builds it\n\nBEFORE: You test manually\nNOW: AI tests automatically\n\nBEFORE: You deploy with complex pipelines\nNOW: AI deploys with one command\n\nThe entire SDLC is being compressed. The winners aren't the ones who code fastest. They're the ones who direct AI most effectively.\n\nAre you ready for the agentic era? Or still writing code line by line?\n\n👇 YOUR TAKE\n\n#AI #Agents #SDLC", hashtags: ['AI', 'Agents'] },
      { text: "The shift from \"coding\" to \"orchestrating\" is the biggest career change in tech history.\n\nLet me explain:\nOLD JOB: Write every line of code yourself\nNEW JOB: Direct AI agents to write code for you\n\nThis isn't about being lazy. It's about LEVERAGE.\n\nA developer who directs 10 AI agents can do the work of 100 developers. That's what's happening RIGHT NOW.\n\nThe skills that matter now:\n1. PROMPT ENGINEERING - Directing AI effectively\n2. SYSTEM DESIGN - Knowing what to build\n3. QUALITY VERIFICATION - Ensuring AI output is correct\n4. AGENT ORCHESTRATION - Managing multiple AI workers\n5. CONTEXT UNDERSTANDING - Explaining your codebase to AI\n\nThese skills are MORE valuable than knowing syntax. They scale infinitely.\n\nThe developers who thrive in 2026 aren't the ones who know the most languages. They're the ones who direct AI to solve the hardest problems.\n\nWhat's your orchestration strategy? 👇\n\n#AI #FutureOfWork", hashtags: ['AI', 'Agents'] }
    ]
  },
  { 
    id: 8, 
    title: 'Vibe Coding', 
    source: 'MasteringAI',
    tweets: [
      { text: "Vibe coding: Describe what you want. AI builds it. No syntax. No bugs. Just vibes.\n\nIs this the end of traditional coding? Let me give you an honest take:\n\nYES, for 80% of code being written:\n- Landing pages\n- CRUD apps\n- Standard integrations\n- Admin dashboards\n- Simple APIs\n\nNO, for 20% that matters:\n- Systems architecture\n- Complex algorithms\n- Performance optimization\n- Security-critical code\n- Novel problem-solving\n\nThe future isn't vibe coding OR real coding. It's BOTH.\n\nYour job becomes:\n- Use vibe coding for 80% (fast, cheap, good enough)\n- Write the critical 20% yourself\n- Focus on PROBLEMS, not SYNTAX\n\nThe developers who thrive will be the ones who understand PROBLEM DOMAIN, not CODE SYNTAX.\n\nAre you vibe coding? Or still stuck in syntax? 👇\n\n#VibeCoding #AI", hashtags: ['VibeCoding'] },
      { text: "Let me settle this debate: Vibe coding vs Traditional coding - which wins?\n\nANSWER: Both. Forever.\n\nHere's why:\nVIBE CODING wins on:\n- Speed of initial development\n- Prototyping ideas quickly\n- Reducing boilerplate\n- Democratizing development\n\nTRADITIONAL CODING wins on:\n- Performance-critical systems\n- Security-sensitive applications\n- Complex algorithm design\n- Understanding what's happening\n- Debugging the impossible\n\nThe KEY is knowing when to use which.\n\nMy rule:\n- 80% vibe: If it works, it's good enough\n- 20% traditional: If lives depend on it, be precise\n\nThe best developers in 2026 won't choose one. They'll MASTER BOTH.\n\nThey'll vibe code the 80% and hand-code the 20% that matters.\n\nWhat's your mix? Let's discuss 👇\n\n#Coding #Dev #AI", hashtags: ['VibeCoding'] }
    ]
  },
  { 
    id: 9, 
    title: 'Developer Productivity', 
    source: 'Octopus',
    tweets: [
      { text: "Data from 1000+ companies proves it: AI adoption directly impacts developer productivity by 40-60%.\n\nLet me break down WHERE the gains come from:\n\n1. CODE GENERATION (30%): AI writes boilerplate, you write logic\n2. DEBUGGING (25%): AI finds bugs in seconds, not hours\n3. RESEARCH (20%): AI finds solutions in seconds vs hours\n4. DOCUMENTATION (15%): AI generates docs automatically\n5. CODE REVIEW (10%): AI spots issues humans miss\n\nTotal: 40-60% velocity increase\n\nBut here's what the data ALSO shows:\n- Teams need TRAINING to achieve max gains\n- AI + skilled developers > AI alone > skilled developers alone\n- Context matters: AI works best with clear requirements\n\nThe companies seeing 60% gains? They trained their teams, established workflows, measured everything.\n\nIf you're not seeing gains, you're probably not using AI effectively.\n\nWhat's your team's productivity gain? Let's compare 👇\n\n#AI #Productivity #Dev", hashtags: ['AI', 'Productivity'] },
      { text: "Your developers are 40% more productive with AI. That's not a prediction. That's DATA.\n\nYet many teams still aren't using AI. Here's why:\n\nEXCUSES:\n- \"It makes mistakes\" - So do humans. AI makes fewer.\n- \"I don't trust it\" - Use it for 2 weeks, you'll trust it.\n- \"It takes time to learn\" - So does every skill worth having.\n- \"My team is fine\" - Fine is the enemy of great.\n\nThe opportunity cost of NOT using AI:\n- 40% less output\n- Talent attrition\n- Competitive disadvantage\n- Wasted money\n\nThe ROI is undeniable. The only question is WHEN you start.\n\nNOT using AI in 2026 is like refusing to use Google in 2005.\n\nAre you AI-forward? Or still on the fence?\n\n👇 YOUR TAKE\n\n#AI #Productivity", hashtags: ['AI', 'Productivity'] }
    ]
  },
  { 
    id: 10, 
    title: 'AI Trends 2026', 
    source: 'Various',
    tweets: [
      { text: "7 AI trends that will define 2026:\n\n1. AGENTIC AI: Autonomous agents, not chatbots\n2. MULTIMODAL: AI that sees, hears, speaks, creates\n3. EDGE AI: Intelligence on your device, not cloud\n4. OPEN SOURCE DOMINANCE: Meta, Mistral, DeepSeek challenging OpenAI\n5. CUSTOM FINE-TUNED MODELS: Companies building their own AI\n6. AI REGULATION: Governments getting serious about safety\n7. VERTICAL AI: Industry-specific AI solutions exploding\n\nThe narrative shifted from \"can AI do this?\" to \"which AI does this BEST?\"\n\nWe're past experimentation. We're in IMPLEMENTATION.\n\nCompanies that implemented in 2024-2025 are NOW seeing massive ROI.\nCompanies starting in 2026 are already behind.\n\nThe window for competitive advantage is closing.\n\nWhat's your AI strategy for 2026? Let's compare notes 👇\n\n#AITrends #2026 #AI", hashtags: ['AI', 'Trends'] },
      { text: "AI in 2026 = Multimodal + Agents + Edge + Vertical.\n\nWe're not talking chatbots anymore. We're talking AUTONOMOUS SYSTEMS that:\n- See and understand images/video\n- Hear and speak naturally\n- Act on your behalf\n- Run on your device (no cloud needed)\n- Solve industry-specific problems\n\nThe convergence is happening NOW.\n\nHere's what excites me most:\n- EDGE AI: Your phone becomes as smart as GPT-4\n- VERTICAL AI: Doctors, lawyers get AI for their work\n- AGENTS: AI that DOES, not just ANSWERS\n\nThe implications:\n- Privacy improves (less data to cloud)\n- Speed increases (no network needed)\n- Costs decrease\n- Accessibility expands\n\nThis is the year AI becomes INVISIBLE but OMNIPRESENT.\n\nAre you ready for invisible AI? 👇\n\n#AI #Future #Tech", hashtags: ['AI', 'Trends'] }
    ]
  }
]

// Types
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

// Sample tasks
const defaultTasks: Task[] = [
  { id: 1, title: 'Complete InstaCards Chrome Extension', status: 'done', priority: 'high' },
  { id: 2, title: 'Build Mission Control Dashboard', status: 'done', priority: 'high' },
  { id: 3, title: 'Setup X Strategy automation', status: 'done', priority: 'high' },
  { id: 4, title: 'Deploy to Vercel', status: 'done', priority: 'high' },
]

// Sample bookmarks
const defaultBookmarks: BookmarkItem[] = [
  { id: 1, title: 'OpenClaw 50 Days Workflows', url: 'https://gist.github.com/velvet-shark/b4c6724c391f612c4de4e9a07b0a74b6', category: 'Work', addedAt: '2026-02-24' },
]

// Get tweet intent URL
const getTweetUrl = (text: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`

// Stats
const stats = {
  total: 4,
  inProgress: 0,
  todo: 0,
  done: 4,
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'projects' | 'xstrategy' | 'bookmarks'>('projects')
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null)
  const [tasks, setTasks] = useState<Task[]>(defaultTasks)
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(defaultBookmarks)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all')
  const [trendingTopics, setTrendingTopics] = useState(defaultTopics)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshTopics = async () => {
    setIsRefreshing(true)
    // For now, just show a message - API needs fixing
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const filteredBookmarks = bookmarks.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.url.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="w-8 h-8 text-yellow-400" />
            Mission Control
          </h1>
          <p className="text-gray-400 text-sm">Project Tracker</p>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-4xl mx-auto flex">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'projects' 
                ? 'text-yellow-400 border-b-2 border-yellow-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('xstrategy')}
            className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'xstrategy' 
                ? 'text-yellow-400 border-b-2 border-yellow-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            X Strategy
            <span className="text-xs bg-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded-full">
              {stats.done}/4
            </span>
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'bookmarks' 
                ? 'text-yellow-400 border-b-2 border-yellow-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Bookmarks
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
            />
          </div>
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div>
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <p className="text-3xl font-bold">{stats.total}</p>
                <p className="text-gray-400 text-sm">Total</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <p className="text-3xl font-bold text-blue-400">{stats.inProgress}</p>
                <p className="text-gray-400 text-sm">In Progress</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <p className="text-3xl font-bold text-gray-400">{stats.todo}</p>
                <p className="text-gray-400 text-sm">To Do</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <p className="text-3xl font-bold text-green-400">{stats.done}</p>
                <p className="text-gray-400 text-sm">Done</p>
              </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2 mb-4">
              {(['all', 'in-progress', 'todo', 'done'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === status
                      ? 'bg-yellow-400 text-gray-900'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {status === 'all' ? 'All' : status === 'in-progress' ? 'In Progress' : status === 'todo' ? 'To Do' : 'Done'}
                </button>
              ))}
            </div>

            {/* Task List */}
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {task.status === 'done' ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : task.status === 'in-progress' ? (
                      <Clock className="w-5 h-5 text-blue-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                    <span className={task.status === 'done' ? 'text-gray-400 line-through' : ''}>
                      {task.title}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.priority === 'high' ? 'bg-red-400/20 text-red-400' :
                    task.priority === 'medium' ? 'bg-yellow-400/20 text-yellow-400' :
                    'bg-gray-400/20 text-gray-400'
                  }`}>
                    {task.priority}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* X Strategy Tab */}
        {activeTab === 'xstrategy' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-400">Pick a topic to tweet</p>
              <button
                onClick={refreshTopics}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {/* Topics Grid */}
            <div className="grid grid-cols-2 gap-4">
              {trendingTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(selectedTopic === topic.id ? null : topic.id)}
                  className={`bg-gray-800 rounded-lg p-4 border text-left transition-all hover:border-yellow-400/50 ${
                    selectedTopic === topic.id ? 'border-yellow-400' : 'border-gray-700'
                  }`}
                >
                  <h3 className="font-medium mb-1">{topic.title}</h3>
                  <p className="text-gray-400 text-sm">{topic.source}</p>
                  <p className="text-gray-500 text-xs mt-2">{topic.tweets.length} tweets ready</p>
                </button>
              ))}
            </div>

            {/* Tweet Preview */}
            <AnimatePresence>
              {selectedTopic && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-700">
                    <h3 className="font-medium">
                      {trendingTopics.find(t => t.id === selectedTopic)?.title}
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-700">
                    {trendingTopics.find(t => t.id === selectedTopic)?.tweets.map((tweet, idx) => (
                      <div key={idx} className="p-4">
                        <p className="text-sm text-gray-300 whitespace-pre-wrap mb-4">{tweet.text}</p>
                        <a
                          href={getTweetUrl(tweet.text)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium transition-colors"
                        >
                          <Twitter className="w-4 h-4" />
                          Tweet
                        </a>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Bookmarks Tab */}
        {activeTab === 'bookmarks' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-400">Your saved links</p>
            </div>

            <div className="space-y-3">
              {filteredBookmarks.map((bookmark) => (
                <a
                  key={bookmark.id}
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-yellow-400/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium mb-1">{bookmark.title}</h3>
                      <p className="text-gray-400 text-sm">{bookmark.url}</p>
                    </div>
                    <Bookmark className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-1 bg-gray-700 rounded text-xs">{bookmark.category}</span>
                    <span className="text-gray-500 text-xs">{bookmark.addedAt}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 px-6 py-2">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-sm text-gray-400">
          <p>{new Date().toLocaleDateString()}</p>
          <p>🎯</p>
        </div>
      </footer>
    </div>
  )
}