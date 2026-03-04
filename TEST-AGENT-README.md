# Test Agent for Mission Control

This is a simple test agent that demonstrates how agents integrate with Mission Control.

## Quick Start

```bash
# Run the test agent
node test-mission-control-agent.js
```

That's it! The agent will:
1. Register with Mission Control
2. Update status every 10 seconds
3. Add todo items
4. Send messages to other agents
5. Show all this in Mission Control in real-time

## What You'll See

### In Terminal:
```
==============================================================
🤖 Starting Test Agent: Test Agent
🆔 Agent ID: test-agent
🌐 Mission Control: https://project-manager-blue-three.vercel.app
==============================================================

📝 Registering agent with Mission Control...
✅ Registered successfully!
   Agent ID: test-agent
   Name: Test Agent

✅ Agent is now visible in Mission Control!
   Check: https://project-manager-blue-three.vercel.app
   Click AGENTS tab → Look for "Test Agent"

🔄 Running status updates...

   Watch the Mission Control AGENTS tab
   You should see status changing in real-time!

📊 Status: working | Task: Analyzing requirements...
📊 Status: working | Task: Processing data...
📊 Status: working | Task: Generating output...
...
```

### In Mission Control (https://project-manager-blue-three.vercel.app):
1. Open the website
2. Click **AGENTS** tab
3. Look for **"Test Agent"** in the list
4. Watch the status change:
   - `working` → Analyzing requirements...
   - `working` → Processing data...
   - `working` → Generating output...
   - `working` → Validating results...
   - `done` → Task completed successfully!
   - `idle` → Waiting for next task...
5. Click on "Test Agent" to see:
   - Current status
   - Current task
   - Todo list items
   - Messages from/to this agent

## How It Works

### 1. Registration
The agent calls `/api/agents` to register itself:
```javascript
POST /api/agents
{
  "id": "test-agent",
  "name": "Test Agent",
  "role": "Demonstrates Mission Control integration",
  "status": "active",
  "currentTask": "Initializing..."
}
```

### 2. Status Updates
Every 10 seconds, the agent calls `/api/agents-status`:
```javascript
POST /api/agents-status
{
  "id": "test-agent",
  "status": "working",
  "currentTask": "Processing data...",
  "lastUpdated": "2026-03-04T12:38:00Z",
  "todos": [...]
}
```

### 3. Inter-Agent Messaging
The agent sends messages to other agents:
```javascript
POST /api/agent-messages
{
  "from": "test-agent",
  "to": "software-dev",
  "message": "Hello from test agent!",
  "type": "message",
  "timestamp": "2026-03-04T12:38:00Z"
}
```

## Test Sequence

The test agent runs through this sequence:

| Time | Status | Task | Todo |
|------|--------|------|------|
| 0s | Register | "Initializing..." | - |
| 10s | working | "Analyzing requirements..." | "Understand user needs" |
| 20s | working | "Processing data..." | "Transform inputs" |
| 30s | working | "Generating output..." | "Create deliverable" |
| 40s | working | "Validating results..." | "Quality check" |
| 50s | done | "Task completed!" | - |
| 60s | idle | "Waiting for next task..." | - |

Then it sends messages to:
- `software-dev` agent
- `qa` agent
- `marketing` agent

## What to Look For in Mission Control

### 1. AGENTS Tab
You should see **"Test Agent"** in the list with:
- **Status:** working/done/idle (changes every 10s)
- **Current Task:** Updates in real-time
- **Last Updated:** Timestamp

### 2. Click on "Test Agent"
Shows detailed view:
- **Agent ID:** test-agent
- **Name:** Test Agent
- **Role:** Demonstrates Mission Control integration
- **Status:** (current status)
- **Current Task:** (current task description)
- **Todo List:** 4 items added during test
- **Message History:** 3 messages sent to other agents

### 3. AGENTS HIERARCHY
If you have the hierarchy view (`/agents` route), you might see:
- Test agent as a separate entry
- Or integrate it into your existing hierarchy

## How Real Agents Would Work

This test agent shows the pattern that **real production agents** follow:

1. **Startup:**
   ```javascript
   await registerAgent()  // Register with Mission Control
   ```

2. **Task Processing:**
   ```javascript
   await updateStatus('working', 'Processing task...')
   await doWork()
   await addTodo('Completed task X')
   ```

3. **Coordination:**
   ```javascript
   await sendMessage('qa', 'Ready for testing')
   ```

4. **Cleanup:**
   ```javascript
   await updateStatus('idle', 'Waiting for tasks')
   ```

## Stop the Test Agent

Press `Ctrl+C` in the terminal.

The agent will update its status to "idle" before stopping.

## Integration with Existing Agents

The test agent demonstrates how your **existing configured agents** (software-dev, qa, marketing) could be upgraded to integrate with Mission Control:

### Current State:
- Agents are just configurations
- They show as "idle" in Mission Control
- They don't update their own status

### With Integration:
- Agents register themselves when they start
- Agents update their own status in real-time
- Agents send messages to each other
- Agents add todos as they work
- Agents complete todos when done

## Example: Upgrading "software-dev" Agent

```javascript
// agent-software-dev.js

const CONFIG = {
  agentId: 'software-dev',
  agentName: 'Software Development Agent',
  role: 'Writes, tests, and deploys code',
  missionControlUrl: 'https://project-manager-blue-three.vercel.app',
};

async function main() {
  // Register
  await registerAgent(CONFIG);

  // Listen for tasks
  while (true) {
    const task = await getNextTask();

    // Update status
    await updateStatus('working', `Writing: ${task.description}`);
    await addTodo(`Implement: ${task.description}`);

    // Do work
    await writeCode(task);

    // Complete
    await completeTodo(`Implement: ${task.description}`);
    await updateStatus('done', `Completed: ${task.description}`);

    // Notify QA
    await sendMessage('qa', 'Ready for testing');
  }
}

main();
```

## Troubleshooting

### Agent Doesn't Show Up in Mission Control

**Check:** Is the agent running?
```bash
ps aux | grep test-mission-control-agent
```

**Check:** Any errors in terminal?
- Look for "❌" error messages
- Check if registration failed

**Check:** Mission Control URL is correct?
```bash
curl https://project-manager-blue-three.vercel.app/api/agents-status
```

### Status Not Updating

**Check:** Network connection
```bash
curl https://project-manager-blue-three.vercel.app/api/debug/simple-env
```

**Check:** Agent logs
- Look for "📊 Status:" messages
- Every 10 seconds, status should update

### Todo Items Not Showing

**Check:** Agent is sending todos
- Look for "Adding todo:" in logs
- Todo items require `text` field

## Next Steps

After testing this agent:

1. **Understand the pattern:**
   - Registration → Status Updates → Messaging → Cleanup

2. **Customize your agents:**
   - Copy this pattern to your agent code
   - Configure with your agent ID and name
   - Implement your specific task processing logic

3. **Integrate with existing config:**
   - The agent IDs match your configured agents
   - `software-dev`, `qa`, `marketing` all exist
   - Just need to implement the integration

4. **Deploy:**
   - Run agents with `node agent-software-dev.js`
   - Or spawn via `sessions_spawn` with agent code

## Summary

This test agent demonstrates:
✅ Agents CAN integrate with Mission Control
✅ Status updates work in real-time
✅ Todo items can be added and tracked
✅ Inter-agent messaging works
✅ Everything is visible in the Mission Control UI

**The pattern is clear - now you can implement it for your real agents!** 🎯
