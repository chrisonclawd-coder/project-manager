# Vercel Edge Config Integration for Mission Control

This guide explains how to set up and use Vercel Edge Config for persistent agent status storage.

## What Changed

### Before (JSON Files → KV)
```
data/agents-status.json
data/agent-messages.json
Vercel KV (not available)
```

### After (Vercel Edge Config)
```
Vercel Edge Config (Native Vercel storage)
- agent-{agentId} (one per agent)
- agent-messages (all messages)
- agents-initialized (flag)
```

**Result:** Fully persistent storage, native to Vercel, works on all plans!

---

## Setup Steps

### 1. Configure Edge Config in Vercel

1. Go to: https://vercel.com/chrisonclawd-2994s-projects/project-manager
2. Click **"Storage"** tab
3. Click **"Edge Config"** tile
4. Click **"Configure"** button
5. Select environment: **Production, Preview, Development** (all three)
6. Click **"Create"**

**That's it!** Edge Config is now enabled.

### 2. Install Dependencies

```bash
cd /home/clawdonaws/.openclaw/workspace/project-manager
npm install
```

**Note:** `@vercel/edge-config` is already in package.json

### 3. Push to Deploy

```bash
git add .
git commit -m "Add Vercel Edge Config integration"
git push
```

Vercel will automatically deploy with Edge Config enabled!

---

## How It Works

### Initialization (One-time)
On first API call, agents are loaded from `data/agents-status.json` to Edge Config:

```typescript
// agents-status/route.ts
await initializeAgents() // Only runs once
```

This means:
- ✅ Your existing agent configuration is preserved
- ✅ No manual data migration needed
- ✅ Automatic migration from JSON to Edge Config

### Edge Config Schema

The `edge-config.json` file defines the structure:

```json
{
  "items": [
    {
      "key": "agents-initialized",
      "value": "false"
    },
    {
      "key": "agent-messages",
      "value": "[]"
    }
  ]
}
```

Individual agents are stored as `agent-{agentId}` keys created dynamically.

### GET Request (Read)
```bash
# Get all agents
curl https://project-manager-blue-three.vercel.app/api/agents-status

# Get single agent
curl https://project-manager-blue-three.vercel.app/api/agents-status?agentId=developer
```

Returns data from Vercel Edge Config (persistent).

### PUT Request (Update)
```bash
curl -X PUT https://project-manager-blue-three.vercel.app/api/agents-status \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "developer",
    "status": "working",
    "currentTask": "Building a new feature"
  }'
```

Updates agent status in Vercel Edge Config (persistent).

### POST Request (Create/Update)
```bash
curl -X POST https://project-manager-blue-three.vercel.app/api/agents-status \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "new-agent",
    "status": "idle",
    "currentTask": "Ready for tasks",
    "todos": []
  }'
```

Creates or updates agent in Vercel Edge Config.

---

## Agent Messages

### GET Messages
```bash
# Get all messages for an agent
curl https://project-manager-blue-three.vercel.app/api/agent-messages?agentId=developer

# Get conversation between two agents
curl "https://project-manager-blue-three.vercel.app/api/agent-messages?from=developer&to=qa"
```

### POST Message
```bash
curl -X POST https://project-manager-blue-three.vercel.app/api/agent-messages \
  -H "Content-Type: application/json" \
  -d '{
    "from": "developer",
    "to": "qa",
    "message": "Code is ready for testing",
    "type": "message"
  }'
```

Messages are stored in Vercel Edge Config (persistent).

### DELETE Message
```bash
curl -X DELETE "https://project-manager-blue-three.vercel.app/api/agent-messages?id=1234567890"
```

---

## Testing

### 1. Run Test Agent
```bash
cd /home/clawdonaws/.openclaw/workspace
node test-mission-control-agent.js
```

The test agent will:
- Update its status every 10 seconds
- Add todo items
- Send messages to other agents
- **All changes will persist in Vercel Edge Config!**

### 2. Check in Mission Control
Open https://project-manager-blue-three.vercel.app

**Before Edge Config:**
- Status updates didn't persist
- Agent showed old data

**After Edge Config:**
- Status updates persist
- Agent shows real-time data
- Todo items are saved
- Messages are saved

### 3. Verify Persistence
1. Start test agent (runs for 1 minute)
2. Check Mission Control → AGENTS tab
3. See "Developer Agent" status changing
4. Stop test agent (Ctrl+C)
5. **Agent status will still be "idle" with final state**
6. Start test agent again
7. **It will continue from where it left off**

---

## Edge Config Data Structure

### Dynamic Agent Keys
```
agent-main: { "status": "idle", "currentTask": "...", "todos": [...], "lastUpdated": "..." }
agent-software-dev: { "status": "idle", "currentTask": "...", "todos": [...], "lastUpdated": "..." }
agent-developer: { "status": "idle", "currentTask": "...", "todos": [...], "lastUpdated": "..." }
agent-qa: { "status": "idle", "currentTask": "...", "todos": [...], "lastUpdated": "..." }
...
```

Each agent gets its own key prefixed with `agent-`.

### agent-messages
Key: `agent-messages`
Value: Array of message objects
```
[
  {
    "id": "1234567890",
    "from": "developer",
    "to": "qa",
    "message": "Code is ready",
    "type": "message",
    "timestamp": "2026-03-04T14:00:00Z",
    "read": false
  },
  ...
]
```

### agents-initialized
Key: `agents-initialized`
Value: `"true"` (string)

Used to ensure agents are loaded from JSON only once.

---

## Advantages of Edge Config

✅ **Fully Persistent**
- Data survives redeployments
- Data survives serverless function restarts
- Production-ready

✅ **Fast**
- Ultra-low latency (edge-based)
- Cached at edge locations worldwide
- Sub-millisecond response times

✅ **Native to Vercel**
- Built by Vercel for Vercel
- No third-party dependencies
- Works on all Vercel plans

✅ **Simple**
- No database setup
- No migration scripts
- Works with Vercel out of box
- Configure once, forget it

✅ **Free Tier Available**
- 64 KB storage
- 256,000 reads/day
- 64,000 writes/day
- ✅ More than enough for agent system

---

## Edge Config Limits

### Storage Limit
- 64 KB total storage
- **Enough for:**
  - 17 agents × ~2 KB each = 34 KB
  - 100 messages × ~200 bytes = 20 KB
  - Total: 54 KB (within limit)

### Write Limit
- 64,000 writes/day
- Agent updating every 10 seconds = 8,640 writes/day
- ✅ Well within limit

### Read Limit
- 256,000 reads/day
- API calls reading status = thousands/day
- ✅ Well within limit

### Message Limit
- Stores last 100 messages (not 1000 like KV)
- **Why:** Edge Config has 64 KB limit
- **Workaround:** Keep fewer messages, prioritize recent

---

## Troubleshooting

### Error: "Edge Config not enabled"

**Cause:** Edge Config not configured in Vercel project

**Solution:**
1. Go to Storage → Edge Config
2. Click "Configure"
3. Select all environments
4. Click "Create"

### Status updates not persisting

**Check 1:** Is Edge Config enabled?
```
https://vercel.com/chrisonclawd-2994s-projects/project-manager/storage
```

**Check 2:** Did you deploy after adding Edge Config?
```bash
git push
# Vercel auto-deploys
```

**Check 3:** Are you hitting the deployed URL?
```
https://project-manager-blue-three.vercel.app
# NOT localhost:3000
```

### Agent initialization error

**Cause:** agents-status.json not found or invalid

**Solution:**
```bash
# Ensure JSON file exists and is valid
cat data/agents-status.json
```

---

## Migration from JSON to Edge Config

### Automatic Migration
The first API call automatically migrates:
1. Loads `data/agents-status.json`
2. Creates Edge Config keys for each agent
3. Sets `agents-initialized` flag
4. Subsequent calls use Edge Config only

### Manual Migration (Optional)
If automatic migration fails, you can manually trigger:

```bash
# Call API with GET (triggers initialization)
curl https://project-manager-blue-three.vercel.app/api/agents-status
```

### Rollback to JSON (If Needed)

To switch back to JSON files:
1. Remove `@vercel/edge-config` from API routes
2. Restore file system read/write operations
3. Deploy

---

## Summary

✅ **Before:** Agent status updates didn't persist (Vercel read-only)
✅ **After:** Full persistence with Vercel Edge Config
✅ **Setup:** Configure Edge Config in Vercel (2 minutes)
✅ **Deployment:** Push to GitHub (automatic)
✅ **Benefit:** Native Vercel storage, ultra-low latency

**No VPS needed!** Everything works on Vercel with Edge Config. 🚀
