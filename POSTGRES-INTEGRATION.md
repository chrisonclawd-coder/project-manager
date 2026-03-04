# Vercel Postgres Integration

## Why Switch from Edge Config to Postgres?

**Edge Config Limitation:**
- ✅ Can READ values at runtime
- ❌ Cannot WRITE values at runtime (read-only)
- ❌ Can only update via Vercel API or CLI

**Vercel Postgres Advantage:**
- ✅ Can READ + WRITE at runtime
- ✅ Fully persistent (survives deployments)
- ✅ Native to Vercel
- ✅ Free tier available
- ✅ Unlimited reads/writes

---

## Setup Instructions (3 Minutes)

### Step 1: Create Postgres Database

1. Go to: https://vercel.com/chrisonclawd-2994s-projects/project-manager/storage
2. Click **"Postgres"** tile
3. Click **"Create Database"**
4. Select region (or use default)
5. Click **"Create"**

This will create a Postgres database and add `POSTGRES_URL` environment variable.

### Step 2: Deploy

Code is already pushed to GitHub:
```
https://github.com/chrisonclawd-coder/project-manager/commit/eacee79
```

Vercel will auto-deploy with Postgres connected.

### Step 3: Test

After deployment:
```bash
cd /home/clawdonaws/.openclaw/workspace
node test-mission-control-agent.js
```

---

## Database Schema

### agents_status Table
```sql
CREATE TABLE agents_status (
  agent_id VARCHAR(255) PRIMARY KEY,
  status VARCHAR(50),
  current_task TEXT,
  todos JSONB,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

**Purpose:** Store agent status, current task, and todo list

### agent_messages Table
```sql
CREATE TABLE agent_messages (
  id VARCHAR(255) PRIMARY KEY,
  from_agent VARCHAR(255),
  to_agent VARCHAR(255),
  message TEXT,
  type VARCHAR(50),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

**Purpose:** Store inter-agent communication

---

## How It Works

### Automatic Initialization

Both API routes have `initializeTables()` function that:
1. Creates tables if they don't exist
2. Runs on first API call
3. Never runs again (tables persist)

### Reading Agent Status
```typescript
const result = await sql`
  SELECT agent_id, status, current_task, todos, last_updated
  FROM agents_status
  WHERE agent_id = ${agentId}
`
```

### Updating Agent Status
```typescript
await sql`
  UPDATE agents_status
  SET status = ${status}, current_task = ${task}, last_updated = NOW()
  WHERE agent_id = ${agentId}
`
```

### Sending Messages
```typescript
await sql`
  INSERT INTO agent_messages (id, from_agent, to_agent, message, type)
  VALUES (${id}, ${from}, ${to}, ${message}, ${type})
`
```

---

## Postgres vs Edge Config

| Feature | Edge Config | Vercel Postgres |
|---------|-------------|-----------------|
| Read at Runtime | ✅ Yes | ✅ Yes |
| Write at Runtime | ❌ No | ✅ Yes |
| Persistence | ✅ Yes | ✅ Yes |
| Latency | Ultra-low (ms) | Low (10-50ms) |
| Storage | 64 KB | Unlimited |
| Write Limit | N/A (read-only) | Unlimited |
| Use Case | Feature flags | Agent status |

---

## Advantages of Postgres

### 1. Full CRUD Operations
- Create new agents
- Read agent status
- Update status/tasks
- Delete messages

### 2. Unlimited Storage
- No 64 KB limit
- Store as much data as needed
- JSONB for structured data (todos)

### 3. SQL Queries
- Filter by status: `WHERE status = 'working'`
- Sort by time: `ORDER BY last_updated DESC`
- Count: `SELECT COUNT(*) FROM agents_status`

### 4. Free Tier
- 60 hours compute/month
- 512 MB storage
- 10K rows per table
- More than enough for agent system

---

## Testing

### Step 1: Start Test Agent
```bash
cd /home/clawdonaws/.openclaw/workspace
node test-mission-control-agent.js
```

### Step 2: Watch Mission Control
Open: https://project-manager-blue-three.vercel.app
Click: AGENTS tab
Watch: "Developer Agent" status changes every 10 seconds

### Step 3: Verify Persistence
1. Stop test agent (Ctrl+C)
2. Check AGENTS tab - Agent shows final state ✅
3. Start test agent again - Continues from where it left off ✅

---

## Monitoring

### Check Postgres Usage

Go to: https://vercel.com/chrisonclawd-2994s-projects/project-manager/storage/postgres

You can see:
- Database stats
- Query history
- Connection pool
- Storage usage

### Query Logs

Check Vercel deployment logs for SQL queries:
- Look for "INSERT INTO agents_status"
- Look for "UPDATE agents_status"
- Look for "SELECT FROM agent_messages"

---

## Troubleshooting

### "connection refused" Error
**Cause:** Database not created or POSTGRES_URL not set

**Fix:**
1. Go to Storage → Postgres
2. Create database (if not exists)
3. Check environment variables have POSTGRES_URL

### "table does not exist" Error
**Cause:** Tables not initialized

**Fix:**
1. Call any API route (initializes tables automatically)
2. Check logs for "✅ Tables initialized"

### Status Not Updating
**Cause:** API error or network issue

**Fix:**
1. Check browser console for errors
2. Check Vercel logs for SQL errors
3. Verify POSTGRES_URL is correct

---

## Next Steps

After Postgres is configured:

1. ✅ Test agent works end-to-end
2. ✅ Status updates persist
3. ✅ Messages save successfully
4. ✅ Full agent system operational

---

## Summary

**Edge Config:** Great for feature flags (read-only)
**Vercel Postgres:** Perfect for agent status (read + write)

**We switched because:** We need to WRITE agent status at runtime, and Edge Config is read-only at runtime.

---

**Ready to use!** 🚀
