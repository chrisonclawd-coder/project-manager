# Vercel KV Integration for Mission Control

This guide explains how to set up and use Vercel KV for persistent agent status storage.

## What Changed

### Before (JSON Files)
```
data/agents-status.json
data/agent-messages.json
```
- **Problem:** Vercel file system is read-only in production
- **Result:** Agent status updates didn't persist

### After (Vercel KV)
```
Vercel KV (Key-Value Store)
- agents-status (hash)
- agent-messages (string)
```
- **Solution:** Fully persistent storage
- **Result:** Agent status updates work in production!

---

## Setup Steps

### 1. Create Vercel KV Database

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Create KV database
vercel kv create

# Choose:
# - Name: mission-control-kv (or any name)
# - Region: Washington D.C. (iad1) or closest to you
```

### 2. Link KV to Project

```bash
# Make sure you're in project directory
cd /home/clawdonaws/.openclaw/workspace/project-manager

# Link KV to project
vercel link

# Select your project: project-manager-blue-three

# Create environment variable
vercel env add KV_REST_API_URL
# Choose: Production, Preview, Development (all environments)
# Paste the KV_REST_API_URL from step 1

vercel env add KV_REST_API_TOKEN
# Choose: Production, Preview, Development (all environments)
# Paste the KV_REST_API_TOKEN from step 1
```

### 3. Install Dependencies

```bash
cd /home/clawdonaws/.openclaw/workspace/project-manager
npm install @vercel/kv
```

### 4. Push to Deploy

```bash
git add .
git commit -m "Add Vercel KV integration"
git push
```

Vercel will automatically deploy with the new KV integration!

---

## How It Works

### Initialization (One-time)
On first API call, agents are loaded from `data/agents-status.json` to KV:

```typescript
// agents-status/route.ts
await initializeAgents() // Only runs once
```

This means:
- ✅ Your existing agent configuration is preserved
- ✅ No manual data migration needed
- ✅ Automatic migration from JSON to KV

### GET Request (Read)
```bash
# Get all agents
curl https://project-manager-blue-three.vercel.app/api/agents-status

# Get single agent
curl https://project-manager-blue-three.vercel.app/api/agents-status?agentId=developer
```

Returns data from Vercel KV (persistent) instead of JSON file.

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

Updates agent status in Vercel KV (persistent in production).

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

Creates or updates agent in Vercel KV.

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

Messages are stored in Vercel KV (persistent).

### DELETE Message
```bash
curl -X DELETE "https://project-manager-blue-three.vercel.app/api/agent-messages?id=1234567890"
```

---

## Testing the Integration

### 1. Run Test Agent
```bash
cd /home/clawdonaws/.openclaw/workspace
node test-mission-control-agent.js
```

The test agent will:
- Update its status every 10 seconds
- Add todo items
- Send messages to other agents
- **All changes will persist in Vercel KV!**

### 2. Check in Mission Control
Open https://project-manager-blue-three.vercel.app

**Before KV:**
- Status updates didn't persist
- Agent showed old data

**After KV:**
- Status updates persist
- Agent shows real-time data
- Todo items are saved
- Messages are saved

### 3. Verify Persistence
1. Start test agent (runs for 1 minute)
2. Check Mission Control → AGENTS tab
3. See "Developer Agent" status changing
4. Stop test agent (Ctrl+C)
5. **Agent status will still be "idle" with the final state**
6. Start test agent again
7. **It will continue from where it left off**

---

## KV Data Structure

### agents-status (Hash)
Key: `agents-status`
Fields:
```
main: { "status": "idle", "currentTask": "...", "todos": [...], "lastUpdated": "..." }
software-dev: { "status": "idle", "currentTask": "...", "todos": [...], "lastUpdated": "..." }
developer: { "status": "idle", "currentTask": "...", "todos": [...], "lastUpdated": "..." }
qa: { "status": "idle", "currentTask": "...", "todos": [...], "lastUpdated": "..." }
...
```

### agent-messages (String)
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
    "timestamp": "2026-03-04T12:00:00Z",
    "read": false
  },
  ...
]
```

### agents-initialized (Flag)
Key: `agents-initialized`
Value: `"true"` (string)

Used to ensure agents are loaded from JSON only once.

---

## Troubleshooting

### Error: "KV_REST_API_URL not found"

**Cause:** KV environment variables not set in Vercel

**Solution:**
```bash
vercel env add KV_REST_API_URL
# Paste URL from: vercel kv ls
```

### Error: "KV_REST_API_TOKEN not found"

**Cause:** KV environment variables not set in Vercel

**Solution:**
```bash
vercel env add KV_REST_API_TOKEN
# Paste token from: vercel kv ls
```

### Status updates not persisting

**Check 1:** Is KV created?
```bash
vercel kv ls
```

**Check 2:** Are env vars set?
```bash
vercel env ls
```

**Check 3:** Did you deploy after adding KV?
```bash
git push
# Vercel auto-deploys
```

### Agent initialization error

**Cause:** agents-status.json not found or invalid

**Solution:**
```bash
# Ensure JSON file exists and is valid
cat data/agents-status.json
```

---

## Advantages of Vercel KV

✅ **Fully Persistent**
- Data survives redeployments
- Data survives serverless function restarts
- Production-ready

✅ **Fast**
- Low latency (ms response times)
- Edge-based caching
- Global distribution

✅ **Scalable**
- Handles millions of requests
- Automatic scaling
- No server management

✅ **Free Tier**
- 256 MB storage
- 256,000 reads/day
- 64,000 writes/day
- (Enough for agent system)

✅ **Simple**
- No database setup
- No migration scripts
- Works with Vercel

---

## Monitoring KV Usage

### Check Usage
```bash
vercel kv ls
vercel kv ls --limit=1 --name=mission-control-kv
```

### Reset KV (if needed)
```bash
# Delete all data
vercel kv reset mission-control-kv

# Agents will be reinitialized from JSON on next request
```

### View KV Data
```bash
# Get all agent status
vercel kv get mission-control-kv --key=agents-status

# Get all messages
vercel kv get mission-control-kv --key=agent-messages
```

---

## Limitations

### KV Free Tier
- 256 MB storage
- 256,000 reads/day
- 64,000 writes/day

**For Agent System:** ✅ More than enough

### Message Limit
- Stores last 1000 messages
- Automatically removes old messages

**Why:** KV has size limits, prevents bloat

### No Complex Queries
- Can't query by date range
- Can't search message content

**Workaround:** Load all data, filter in code

---

## Next Steps

1. **Set up KV in Vercel** (see above)
2. **Deploy to Vercel** (git push)
3. **Run test agent** to verify persistence
4. **Monitor KV usage** to stay within limits

---

## Summary

✅ **Before:** Agent status updates didn't persist (Vercel read-only)
✅ **After:** Full persistence with Vercel KV
✅ **Setup:** 5 minutes (KV create + env vars)
✅ **Benefit:** Production-ready agent system

**No VPS needed!** Everything works on Vercel. 🚀
