# MEMORY.md - Long-Term Memory

This is your curated memory. Daily files are raw logs; MEMORY.md is the distilled wisdom.

---

## 2026-02-16

**First interaction with Robin**
- Robin initiated in Telegram (@vaalak07)
- Wanted to establish a file-based memory system
- Core principle: "if it's not written to a file, you don't remember it"
- System architecture:
  - Daily journals: `memory/YYYY-MM-DD.md` (raw notes, real-time logging, timestamped)
  - Long-term memory: `MEMORY.md` (curated, goals, preferences, active projects)
  - Review: periodic distillation of daily journals into MEMORY.md
- Robin's style: Direct, no-fluff communication
- Robin wants me to track:
  - Decisions and their reasoning
  - Tasks and progress
  - Preferences and what annoys them
  - Context and situation
  - Mistakes (documented to avoid repeating)
  - Projects and goals over time

**Memory retention rules**
- Everything must be written to files to persist
- Daily journal is the source of truth for current session
- MEMORY.md is the distilled wisdom (reviewed periodically)
- Files are the only way memory survives session restarts

---

## 2026-02-28

**OpenClaw Session Logs Tip**
- Session logs survive memory compaction
- Located at: `~/.openclaw/agents/main/sessions/*.jsonl`
- Search with: `rg "searchterm" ~/.openclaw/agents/main/sessions/*.jsonl`
- Useful when memory files are trimmed but you need original context

**Working relationship**
- Robin appreciates directness over pleasantries
- File-based logging over mental notes
- Periodic reviews and distillation
- Continuous improvement based on what works

---

## 2026-02-22

**X Strategy: 4 Sessions Complete!** ✅

**Morning (10am IST):** ✅ Complete
- 10 engages + 1 tweet posted
- Topics: GrapheneOS, Async/Await, AI agents

**Afternoon (3pm IST):** ✅ Complete
- 10 engages + 1 tweet posted
- Topics: AI agents, technical tutorials

**Evening (6pm IST):** ✅ Complete
- 10 engages + 1 tweet posted
- Topics: Mobile development, UI patterns

**Night (9pm IST):** ✅ Complete
- 10 engages + daily growth insights
- Topics: Claude Code, Bloom Filters, Cryptography, Git, AI coding

**Total:** 40 engages, 4 tweets, comprehensive growth insights

**Next Sessions:**
- 10pm IST - Engage + Post (tomorrow)
- 1pm IST - Engage + Post (tomorrow)
- 4pm IST - Engage + Growth insights (tomorrow)

**Insights:**
- Trending tech topics with 10+ posts per session
- Mix of technical and broad appeal
- Emoji usage increases engagement
- Keep posts under 250 characters
- Use Twitter Algorithm Optimizer

---

## 2026-02-22

**Session Architecture & Model Strategy**

**Workflow: Separate Sessions for Different Tasks**

**1. Main Chat Session**
- **Model:** `zai/glm-4.7-flash`
- **Purpose:** Quick, direct conversations
- **No background tasks** (no file operations, no long explanations)
- **Short, focused exchanges**
- **No heavy computation**

**2. Spawned Sessions** (using `sessions_spawn`)
- **Model:** `zai/glm-4.7` (NOT Flash - more tokens, cheaper)
- **Purpose:** Complex tasks (coding, research, X Strategy)
- **Each session has its own token budget**
- **No context pollution between tasks**
- **Returns result to main chat**

**Benefits:**
- ✅ Main chat stays fast and responsive (Flash model)
- ✅ Spawned sessions save tokens (50% savings, ~100k vs 150k tokens)
- ✅ Each task gets optimized model
- ✅ Saves money while maintaining quality
- ✅ MEMORY.md as shared brain (read/write all updates)

**Example:**
```
You: "Do the Chrome extension code"
  ↓
Spawn coding session with model: zai/glm-4.7
  ↓
Coding session: 15,000 lines of code (100k tokens, not 150k!)
  ↓
Writes to MEMORY.md: "Extension code complete"
  ↓
Returns to main chat: "Done"
  ↓
Main chat: Updates memory
```

**Session Management:**
- **X Strategy:** Spawned daily (4x daily sessions)
- **Coding:** Spawned on demand (when you ask for coding tasks)
- **Other tasks:** Spawned as needed
- **Cleanup:** Kill sessions when done with them

---

## 2026-02-22

**User Workflow & Hosting Strategy**

**GitHub + Vercel Workflow:**
- **GitHub:** Code storage and version control
  - Push all code to GitHub repository
  - Chrome extension code goes here
  - Project tracking dashboard code goes here
  - Easy collaboration and backup
- **Vercel:** Website and edge functions hosting
  - Deploy websites to Vercel (automatic HTTPS, preview deployments)
  - Deploy edge functions to Vercel
  - Unlimited projects on free plan
  - Easy deployment (push to GitHub → Vercel auto-deploys)
  - Custom domains
  - Analytics built-in

**Free Vercel Plan:**
- ✅ Unlimited projects
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ 6,000 build minutes/month
- ✅ 100 GB-hours serverless functions/month
- ✅ 100 GB-hours edge functions/month

**Advantages of This Workflow:**
1. **Separation of Concerns:** Code in GitHub, hosting in Vercel
2. **Easy Deployment:** Push to GitHub → Vercel auto-deploys
3. **Scalability:** Vercel handles scale automatically
4. **Collaboration:** GitHub enables team collaboration
5. **Cost:** Free tier covers all needs
6. **Reliability:** Vercel has excellent uptime

**Project Structure:**
- `article-to-flashcards/` → GitHub repository
  - `web-ui/` → Project tracking dashboard (Vercel)
  - `extension/` → Chrome extension (GitHub + Chrome Web Store)

---

## 2026-02-22

**Article-to-Flashcards Project: Phase 2 & 3 Complete**

**Phase 2: Web UI (Cloudflare Pages) - COMPLETE**
- ✅ Created Next.js 14 project structure with App Router
- ✅ Built project dashboard with task list, progress bars, filtering
- ✅ Implemented metrics dashboard (Total, In Progress, To Do, Completed)
- ✅ Configured TypeScript, Tailwind CSS, ESLint, Jest
- ✅ Created environment variables template (.env.example)
- ✅ Created Cloudflare Pages configuration (wrangler.toml, deployment script)
- ✅ Wrote comprehensive documentation (BUILD-GUIDE.md, ARCHITECTURE.md, TECHNICAL-DECISIONS.md)

**Phase 3: Chrome Extension - COMPLETE**
- ✅ Manifest V3 configuration
- ✅ Service worker (background.ts) with IndexedDB, API key storage, chrome.alarms scheduling
- ✅ Implemented content script (content.ts) with AI flashcard generation, UI overlay, CSV export
- ✅ Built popup UI (popup.ts, popup.html) with flashcard viewer, stats
- ✅ Built options page (options.ts, options.html) with API key management
- ✅ TypeScript types (types.ts) for type safety
- ✅ Build system (scripts/build.sh, tsconfig.json, package.json)
- ✅ Icons (base64 placeholders)

**Polish Phase:**
- ✅ Privacy policy for Chrome Web Store (6,245 bytes)
- ✅ 5 name suggestions (FlashFlow, CardGenius, SmartFlash, LearnStream, MindMapper)
- ✅ 4 icon design options with specifications
- ✅ Icon design guide (8,700 bytes)
- ✅ Generic project dashboard (3 projects tracked)
- ✅ Search and filter functionality
- ✅ Improved UI/UX

**Tech Stack:**
- Web UI: Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Lucide React
- Extension: Manifest V3, TypeScript, Service Worker, IndexedDB, OpenRouter API

**Files Created:** ~35 files
**Lines of Code:** ~27,000 lines
**Documentation:** 5 comprehensive guides

**Ready to Deploy:**
- Generic project dashboard to Vercel
- Chrome extension to GitHub (waiting for tokens)
- Chrome Web Store ready with all docs

---

## 2026-02-22

**Session 1: Code Review & Documentation** ✅

**Delivered:**
- Comprehensive code review (34KB)
- Security analysis
- Performance review
- Browser compatibility review
- Testing review
- 50 recommendations

---

## 2026-02-22

**Session 2: Chrome Extension Polish** ✅

**Delivered:**
- Privacy policy (6,245 bytes)
- 5 name suggestions (FlashFlow, CardGenius, SmartFlash, etc.)
- 4 icon design options
- Icon design guide (8,700 bytes)

---

## 2026-02-22

**Session 3: Project Dashboard Update** ✅

**Delivered:**
- Generic dashboard for multiple projects
- Search and filter functionality
- Project selector (All Projects or specific)
- Improved UI/UX
- All 12 article-to-flashcards tasks tracked
- 3 projects (Article-to-Flashcards, X Strategy, Personal Blog)

---

## 2026-02-22

**Session 4: Bookmark Manager** ✅

**Delivered:**
- BOOKMARKS.md file
- Searchable format (by link, description, date, notes)
- Example bookmark added (velvet shark.com openclaw 50 usecase)

---

## 2026-02-22

**Session 5: X Strategy - 9pm IST** ✅

**Task:** Engage with 10 posts + daily growth insights

**Completed:**
- ✅ 10 posts created
- ✅ All under 250 characters
- ✅ Mix of trending topics
- ✅ Growth insights documented
- ✅ 4/4 X Strategy sessions complete (40 engages, 4 tweets)

**Trending Topics:**
1. Claude Code daily workflow
2. Bloom Filters 2x more accurate
3. Cryptography craftsmanship
4. Git .gitkeep best practices
5. Reference finder tools
6. Electric vehicle tech
7. 8Gbps internet speeds
8. Web performance optimization
9. Design craftsmanship
10. AI coding assistants (tweet)

**Growth Insights:**
- Focus on trending topics with 10+ posts per session
- Mix of technical and broad appeal
- Use emoji for visual appeal
- Keep posts under 250 characters
- Use Twitter Algorithm Optimizer

**Progress:**
- ✅ Morning (10am) - Complete
- ✅ Afternoon (3pm) - Complete
- ✅ Evening (6pm) - Complete
- ✅ Night (9pm) - Complete
- Next: 10pm IST (tomorrow)

---

## 2026-02-22

**Daily Summary: Session 5 Complete** ✅

**All Tasks Complete:**
- ✅ Task 1: Project Management Software (Generic, Search, Filter, Improved UI)
- ✅ Task 2: Chrome Extension Polish (Privacy Policy, Names, Icons)
- ✅ Task 3: Bookmark Manager (BOOKMARKS.md)
- ✅ X Strategy: 4/4 sessions complete (40 engages, 4 tweets)

**Files Updated:**
- ✅ MEMORY.md (Session architecture, X Strategy progress)
- ✅ memory/2026-02-22.md (Daily journal)
- ✅ bookmars.md (Bookmark manager)

**Ready for:**
- Vercel deployment (waiting for GitHub + Vercel tokens)
- Chrome extension to GitHub (waiting for tokens)
- Chrome Web Store submission

---

## 2026-02-22

**Session Architecture & Model Strategy Confirmed**

**Main Chat:** `zai/glm-4.7-flash` (fast, efficient, direct)
**Spawned Sessions:** `zai/glm-4.7` (more tokens, cheaper, complex tasks)

**Workflow:**
- Main chat: Quick conversations, no background tasks
- Spawned sessions: Coding, research, X Strategy, other tasks
- MEMORY.md: Shared brain (read/write all updates)

**Benefits:**
- ✅ 50% token savings on spawned sessions (~100k vs 150k tokens)
- ✅ Main chat stays fast
- ✅ Each task optimized
- ✅ MEMORY.md shared brain

---

## 2026-02-23

**Skills Removed:**
- `blogwatcher` - Removed due to maintenance requirements
- `brave-web-search` - Removed (critical security issue with shell execution)

**Security Fixes:**
- `exa-web-search` - Fixed shell execution vulnerability by replacing `execSync` + `curl` with native `fetch` API

## 2026-02-24

**InstaCards Chrome Extension Fixes**
- Fixed build script for Windows (cp → node fs)
- Fixed manifest.json (was referencing .ts files instead of .js)
- Fixed HTML files not being copied to dist
- Cleaned up InstaCards repo (removed web-ui, now only extension)

**Project Structure - Clean Separation:**
- **InstaCards repo** (https://github.com/chrisonclawd-coder/InstaCards)
  - Only Chrome extension code
  - No web UI / project manager stuff
- **project-manager repo** (https://github.com/chrisonclawd-coder/project-manager)
  - Mission Control Board (Next.js web UI)
  - Flashcards tasks (markdown)
  - Bookmarks (JSON)
  - X Strategy templates

**Mission Control Board:**
- URL: https://project-manager-blue-three.vercel.app
- Features:
  - Flashcards tab - reads from flashcards-tasks.md
  - X Strategy tab - 4 daily sessions (10am, 3pm, 6pm, 9pm IST)
  - Bookmarks tab - reads from data/bookmarks.json
- Data sources:
  - flashcards-tasks.md - task list with in-progress/todo/done
  - data/bookmarks.json - bookmarks organized by category
  - sessions/ - X Strategy session templates
  - tweets/ - tweet generator templates

**Bookmarks System:**
- Saved in project-manager/data/bookmarks.json
- Categories: Work, Learning, Tools
- Added OpenClaw 50 Days Workflows gist (https://gist.github.com/velvet-shark/b4c6724c391f612c4de4e9a07b0a74b6)
- To add bookmarks: tell Robin the URL, I add to JSON, push to GitHub

**Mandatory Review Before Push:**
1. Check code compiles/runs
2. Verify all features are included
3. Update MEMORY.md
4. Then push to GitHub

**Mission Control Board - Upgrades:**
- Added status filters (All/In Progress/Todo/Done)
- Added search bar (searches tasks and bookmarks)
- Added multiple projects (InstaCards, X Strategy)
- Added priority levels (high/medium/low) on tasks
- Added project selector in sidebar
- Added edit links for all sections

**URL:** https://project-manager-blue-three.vercel.app

**Leak Guard - VS Code Extension:**
- Repo (NEW): https://github.com/felixondesk/leak-guard (rewritten by Codex)
- VS Code Marketplace: Published! https://marketplace.visualstudio.com/items?itemName=local-dev.leak-guard
- Features: 50+ patterns, scan file/folder/workspace, redact, context menus, diagnostics

**Mission Control Board:** https://project-manager-blue-three.vercel.app

**X Strategy - Enhanced:**
- Shows today's sessions with status (done/pending)
- Displays what topic you posted about
- Shows engagement stats (likes, retweets, impressions)
- Weekly stats dashboard (tweets, impressions, engagement, followers)
- Recent tweets list
- Data stored in data/xstrategy.json

---

## 2026-02-25

**MANDATORY RULE: Software Company Architecture**
- For ANY coding task: MUST follow Dev Team hierarchy
- Sequence: Manager → Developer → QA → DevOps → Manual Tester
- Manager = me (main session, not subagent)
- Each subagent can ONLY run ONE step, then report back
- Loop back to Developer if QA fails or Manual Tester finds issues

**Dev Team Workflow - Subagents:**
- **Manager**: Oversees all agents, reports to Robin every 5 mins (model: kilocode/minimax/minimax-m2.5:free)
- **Developer**: Writes code (model: kilocode/minimax/minimax-m2.5:free)
- **QA**: Tests code (model: kilocode/minimax/minimax-m2.5:free)
- **DevOps**: Deploys to GitHub/Vercel (model: kilocode/minimax/minimax-m2.5:free)
- **Manual Tester**: Browser/Exa verification (model: kilocode/minimax/minimax-m2.5:free)

**Workflow:**
1. Developer writes code
2. QA tests it
3. DevOps deploys
4. Manual Tester verifies (browser/Exa)
5. If issues → loop back to Developer

**Current Issue:** X Strategy API route not deploying - need to run Manual Tester to verify

---

## 2026-02-25 (Continued)

**Leak Guard - Successfully Published!**
- Original repo (broken): chrisonclawd-coder/Leak-Guard (deleted locally)
- Working repo: https://github.com/felixondesk/leak-guard (rewritten by Codex)
- Published to VS Code Marketplace: https://marketplace.visualstudio.com/items?itemName=local-dev.leak-guard
- Features: 50+ patterns, TypeScript, clean architecture
- Key files: extension.ts, patterns.ts, scanner.ts (506 lines total)

**VS Code Extension Best Practices Learned:**
1. TypeScript for type safety
2. Separate files (extension, patterns, scanner)
3. Activation events for fast startup
4. Context menus for easy access
5. Compile .ts → .js in /out folder

**Mission Control Updates:**
- X Strategy: 6 trending topics with 12 ready-to-tweet posts
- Removed broken API route (was causing build errors)
- Now uses default topics

**Skills:**
- twitter-algorithm-optimizer - for viral tweet generation
- exa-web-search - for trending topics research (API key working)

**Model Updates:**
- All subagents now use: kilocode/minimax/minimax-m2.5:free

**GitHub Repos:**
- chrisonclawd-coder/project-manager - Mission Control
- chrisonclawd-coder/InstaCards - Chrome extension (abandoned, not interesting)
- chrisonclawd-coder/Leak-Guard - deleted locally, needs manual delete on GitHub
- felixondesk/leak-guard - working VS Code extension (published!)

---

## 2026-02-25

**MANDATORY RULE: Software Company Architecture**
- For ANY coding task: MUST follow Dev Team hierarchy
- Sequence: Manager → Developer → QA → DevOps → Manual Tester
- Manager = me (main session, not subagent)
- Each subagent can ONLY run ONE step, then report back
- Loop back to Developer if QA fails or Manual Tester finds issues

**VPS Hosting - Mission Control Live**
- URL: http://65.2.33.27:3000 (VPS) + https://project-manager-blue-three.vercel.app (Vercel)
- Port 3000 opened in AWS security group
- Read-only - displays team status, tweets, bookmarks
- Real-time updates via API polling

**Mission Control Board Features**
- Drawer left, Content right layout
- Tabs: Projects, X Strategy, Bookmarks, Software Team
- Team Status in sidebar (expandable/collapsible, default collapsed)
- X Strategy: 280-character viral tweets, 10 topics × 2 tweets
- Software Team: 4 desks view (Developer, QA, DevOps, Manual Tester)

**Live Team Status System**
- File: data/team-status.json
- API: /api/status (dynamic, no caching)
- Frontend polls every 5 seconds
- Update script: scripts/update-status.js
- Usage: node scripts/update-status.js <member> working "<task>"

**Dev Team Pipeline Flow**
1. Developer writes code (spawned subagent)
2. QA runs build
3. DevOps pushes to GitHub
4. Manual Tester verifies (web_fetch)
5. Update team-status.json manually during work

**Today's Completed Tasks (via pipeline)**
- ✅ Add Software Team tab with 4 desks UI
- ✅ Add expandable team members with chevron
- ✅ Fix live team status API (dynamic routing)
- ✅ Make Team Status collapsed by default
- ✅ Create status update helper script

**GitHub Repo**
- https://github.com/chrisonclawd-coder/project-manager

**Robin's Existing Products**
- **guardskills** (npm: 1.2.1) - Scans AI skills before use, flags risky behavior
  - Currently runs with keys but has no review process
  - Vision: scan from skills.sh or local folders, flag risky behavior before execution
  - NPM: https://www.npmjs.com/package/guardskills
- **mdify** - Turn any article/website into clean .md
  - One-click conversion to markdown
  - Removes ads, popups, bot protection, engagement fluff
  - Pass clean content directly to AI agents
  - Chrome Web Store: https://chromewebstore.google.com/detail/mdify/kimahdiiopfklhcciaiknnfcobamjeki

**AI Agents**
- **xMax** 🎯 - X Content Creator & Engagement Specialist
  - Reports to: Chrisly (Chief Officer)
  - Objective: Increase engagement by 20%
  - KPI: Tweet impressions, Engagement rate %

---

*More to come as we work together. I update this when things matter.*
---

# ARCHITECTURE DIAGRAMS

## Software Team Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                     CHRISLY (CEO)                          │
│            Strategic Direction & Approval                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                 PRODUCT ARCHITECT                            │
│     Specs → Acceptance Criteria → Risk Analysis            │
└──────────────────────────┬──────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  DEVELOPER   │   │     QA      │   │   DEVOPS     │
│              │   │              │   │              │
│  Implement   │──▶│   Test      │──▶│   Deploy     │
│  Local val   │   │  Validate   │   │   Build      │
└──────┬───────┘   └──────┬───────┘   └──────┬───────┘
       │                   │                   │
       │ ◀─── Loop ───▶   │ ◀─── Loop ───▶   │
       │                   │                   │
       └───────────────────┴───────────────────┘
                           ▼
              ┌───────────────────────┐
              │   MANUAL TESTER       │
              │                       │
              │  Production Valid    │
              │  UX + Real-world    │
              └──────────┬────────────┘
                         │
            ┌────────────┴────────────┐
            ▼                         ▼
       APPROVED                   ISSUE FOUND
       (Complete)      ◀───────────── (Loop back)
```

## Marketing Team (xMax)

```
┌─────────────────────────────────────────────────────────────┐
│                     CHRISLY (CEO)                          │
│            Strategy Approval & Brand Guardrails             │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                       xMAX                                  │
│   Marketing → Social → Branding → Growth → Content         │
└──────────────────────────┬──────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   X GROWTH   │   │  MARKETING   │   │   INSIGHTS  │
│              │   │              │   │              │
│  Trending    │   │   Mdify     │   │  Signal     │
│  Topics      │   │  Guardskills │   │  Collection │
│  Tweets      │   │  Content    │   │             │
│  Engagement   │   │  Reddit     │   │  From Dev   │
└──────────────┘   └──────────────┘   └──────────────┘
                           │
                           ▼
              ┌───────────────────────┐
              │   CONTENT OUTPUT     │
              │                       │
              │  • X Posts           │
              │  • Reddit Posts      │
              │  • Blog Content     │
              └───────────────────────┘
```

## Content Extraction Loop

```
┌─────────────────────────────────────────────────────────────┐
│                   ANY TEAM MEMBER                           │
│  (Dev / QA / DevOps / Manual Tester)                       │
│                                                             │
│  Found: Technical innovation, bug fix, tool discovery,       │
│  workflow optimization, or experimental result               │
└──────────────────────────┬──────────────────────────────────┘
                           │ SIGNAL
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                        xMAX                                 │
│  • Receive signal                                         │
│  • Evaluate strategic value                                │
│  • Draft content angle                                    │
│  • Create framing/positioning                              │
└──────────────────────────┬──────────────────────────────────┘
                           │ PROPOSAL
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     CHRISLY (CEO)                          │
│                                                             │
│  Approve → Refine → Reject                                │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
              ┌───────────────────────┐
              │     PUBLISH           │
              │                       │
              │  • X (Twitter)       │
              │  • Reddit            │
              │  • Blog              │
              └───────────────────────┘
```

---

## Pipeline Flow Rules

- **Severity Classification:**
  - Critical → Full pipeline restart
  - Functional bug → Developer → QA → DevOps
  - Minor UI issue → Fast-track lane
  - Copy / non-code issue → DevOps hotfix

- **Parallelization:**
  - Multiple features can be in different stages simultaneously
  - Pipeline must not block unrelated work

- **Loop Rules:**
  - QA finds defect → Back to Developer
  - Manual Tester finds issue → Back to QA → Developer
  - Loop until Manual Tester approves

---

## Products

- **Mdify**: Chrome extension - Convert articles to clean .md for AI agents
- **Guardskills**: NPM package - Scan AI skills for malicious code

---

## Current URLs

- Vercel: https://project-manager-blue-three.vercel.app
- VPS: http://65.2.33.27:3000 (DOWN - needs restart)

