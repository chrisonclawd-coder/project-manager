# xMax Content: Anatomy of OpenClaw

## Thread Idea 1: "6 Things Nobody Tells You About OpenClaw"

**Tweet 1:**
Most people use OpenClaw blind.

They install skills, write prompts, tweak settings — but have no idea what's happening under the hood.

Here's the anatomy of OpenClaw (🧵)

**Tweet 2:**
1/ Gateway — the circulatory system
Every message flows through it. Telegram, WhatsApp, Discord — all connected here.

Message comes in → Gateway routes it → pulls history → sends to LLM → response flows back

**Tweet 3:**
2/ Agent — the brain
Receives assembled context: chat history, memory files, available tools.
Thinks, decides, calls tools, loops until answer is ready.

**Tweet 4:**
3/ Tools — the hands
- exec: runs shell commands
- browser: opens pages, clicks, screenshots
- file: reads/writes files
- message: sends to channels
- memory: searches long-term notes

**Tweet 5:**
4/ Workspace — the long-term memory
This is what separates a dumb bot from a real agent.

Files: AGENTS.md, SOUL.md, USER.md, MEMORY.md, daily logs

Without workspace? Every conversation starts from zero. You're burning tokens every time.

**Tweet 6:**
5/ Sessions — conversation memory
Each chat lives in its own .jsonl file. Doesn't bleed into others.

6/ Nodes — physical devices
Gateway on server = brain. Node on your Mac = eyes and hands.

**Tweet 7:**
The secret most people miss:

Two levels of memory:

1️⃣ Bootstrap — loaded every request (eats tokens)
2️⃣ Semantic search — pulls relevant facts only (cheap)

Use both. Use them wrong and you're spending 3x more than you need to.

**Tweet 8:**
5 mistakes that break your agent:

❌ dmScope = "main" with multiple users (privacy leak)
❌ exec in full mode on live server (security hole)
❌ No workspace (burning tokens daily)
❌ No compaction strategy (agent forgets)
❌ Port 18789 exposed to internet

**Tweet 9:**
OpenClaw isn't a black box.

Every component is a text file. Every session is JSONL. Every config is JSON.

You control it all.

---

## Thread Idea 2: "I Cut My Token Spend by 3x"

**Tweet 1:**
I cut my OpenClaw token spend by 3x — by understanding how it actually works.

A thread on the anatomy of OpenClaw 🧵

**Tweet 2:**
The workspace files most people ignore:

AGENTS.md — playbook
SOUL.md — personality
USER.md — your profile
MEMORY.md — facts that stick
daily logs — context

15 minutes of setup saves hundreds in tokens.

**Tweet 3:**
The memory hack:

Bootstrap files = seen every request = expensive
Semantic search = pulled when needed = cheap

Put critical stuff in bootstrap. Everything else in MEMORY.md.

Your wallet will thank you.

---

## Single Viral Tweets

**Tweet A:**
OpenClaw is built from 6 parts:

Gateway → Agent → Tools → Workspace → Sessions → Nodes

All text files. No databases. No black boxes.

You control everything.

**Tweet B:**
The difference between a dumb bot and a real agent?

Workspace.

Without it, the agent wakes up with a blank head every time. Every conversation starts from zero.

With it? It remembers who you are. What you discussed. Decisions you made.

**Tweet C:**
5 OpenClaw mistakes that cost you money:

1. dmScope = main (privacy leak)
2. exec = full (security risk)
3. No workspace (burning tokens)
4. No memory strategy (agent forgets)
5. Port exposed (full access to strangers)

---

## Product Integration Tweets

**Mdify:**
"Memory management in AI agents is hard.

But you know what's harder?

Getting clean data into your agent in the first place.

Use Mdify → convert articles to clean .md → your agent actually understands what it's reading.

Less noise. More value. 3x token savings."

**Guardskills:**
"exec tool in full mode on a live server is like leaving your front door wide open.

Use Guardskills to audit your AI skills before installation.

Security first. Always."

---

## Engagement Tweets

"Bookmark this: The complete anatomy of OpenClaw

Gateway / Agent / Tools / Workspace / Sessions / Nodes

Everything is a text file. You control it all.

#OpenClaw #AIautomation"

---

## LinkedIn Version

**Post:**
I cut my OpenClaw spend by 3x — here's how

Most people use AI agents blindly. They install skills, write prompts, and wonder why they're burning through tokens.

The secret? Understanding the architecture.

OpenClaw has 6 core components:

1. Gateway — message router (Telegram, WhatsApp, Discord)
2. Agent — the brain that thinks and decides
3. Tools — exec, browser, file, message, memory
4. Workspace — long-term memory files
5. Sessions — per-conversation history
6. Nodes — physical device expansion

The game-changer: Two levels of memory.

Bootstrap files load every request (expensive).
Semantic search pulls relevant facts only (cheap).

Strategy: Put critical stuff in bootstrap. Everything else in MEMORY.md.

The 5 mistakes killing your agent:
- dmScope = "main" (privacy leak)
- exec in full mode (security hole)
- No workspace (token waste)
- No compaction (agent forgets)
- Port exposed (full access to strangers)

OpenClaw isn't a black box. Every component is a text file you can edit.

Your turn: Which of these mistakes are you making?

---

## YouTube Shorts Script

"Most people use OpenClaw wrong.

They install it, write some prompts, and wonder why they're spending 3x more than they should.

The secret?

Workspace files.

AGENTS.md, SOUL.md, USER.md, MEMORY.md.

Without these, your agent wakes up with a blank head every time.

Every conversation starts from zero.

That's why you're burning tokens.

Set up your workspace once. Save money forever.

#OpenClaw #AI #Productivity"

---

## Save this for later

Generated: 2026-03-03
Source: @xmayeth article on OpenClaw anatomy
