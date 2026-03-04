# Mission Control Agent Template

This is a complete, production-ready agent template that integrates with Mission Control.

## Features

✅ **Full Mission Control API Integration**
- Register agent as active
- Update status and current task
- Add/manage todo items
- Send/receive messages between agents
- Complete tasks

✅ **Real-time Updates (WebSocket)**
- Bidirectional communication
- Task assignments
- Status updates
- Agent intercommunication

✅ **HTTP Polling Fallback**
- If WebSocket unavailable
- Automatic reconnection
- 5-second polling interval

✅ **Graceful Shutdown**
- SIGINT/SIGTERM handling
- Proper cleanup
- Status update before exit

✅ **TypeScript/Node.js**
- Full type safety
- Async/await support
- Error handling

## Quick Start

### 1. Install Dependencies

```bash
npm install ws node-fetch @types/node
```

### 2. Configure Agent

Edit `agent-template-mission-control.ts`:

```typescript
const CONFIG = {
  // Agent identity
  agentId: 'developer', // Change this to your agent ID
  agentName: 'Developer Agent',
  role: 'Software developer who writes and tests code',

  // Mission Control API
  missionControlUrl: 'https://project-manager-blue-three.vercel.app',
  missionControlToken: 'your-token-here', // Get from Mission Control Settings

  // WebSocket (optional)
  websocketUrl: 'wss://your-openclaw-gateway-url/ws/agents',

  // Polling interval (fallback)
  pollInterval: 5000, // 5 seconds
}
```

### 3. Set Environment Variables

```bash
export MISSION_CONTROL_URL=https://project-manager-blue-three.vercel.app
export MISSION_CONTROL_TOKEN=your_token_here
export MISSION_CONTROL_WS_URL=wss://your-gateway-url/ws/agents
```

### 4. Run Agent

```bash
npx ts-node agent-template-mission-control.ts
```

Or build first:

```bash
tsc agent-template-mission-control.ts --target es2020 --module commonjs
node agent-template-mission-control.js
```

## Mission Control API Usage

### Register Agent

```typescript
await agent.missionControl.register()
```

### Update Status

```typescript
await agent.missionControl.updateStatus('working', 'Processing task...')
```

### Add Todo

```typescript
await agent.missionControl.addTodo('Fix bug in login page')
```

### Complete Task

```typescript
await agent.missionControl.completeTask('Fixed login bug');
```

### Send Message

```typescript
await agent.sendMessage('developer', 'I need help with the API');
```

### Get Messages

```typescript
// Get all messages for this agent
const messages = await agent.getMessages('developer');

// Get conversation between two agents
const conversation = await agent.getMessages('developer', 'qa');
```

## WebSocket Events

The agent listens for these WebSocket messages:

### Status Update
```typescript
{
  type: 'status_update',
  data: { status: 'working', currentTask: 'Processing...' }
}
```

### New Message
```typescript
{
  type: 'message',
  data: { from: 'developer', to: 'qa', message: 'Hello' }
}
```

### Task Assignment
```typescript
{
  type: 'task_assignment',
  data: { id: 123, description: 'Build new feature' }
}
```

## Example: Custom Agent

Create a custom agent by extending the base class:

```typescript
import { MissionControlAgent, CONFIG } from './agent-template-mission-control';

class MyCustomAgent extends MissionControlAgent {
  async processTask(task: any): Promise<void> {
    console.log(`🎯 Processing: ${task.description}`);

    await this.missionControl.updateStatus('working', 'Analyzing requirements...');

    // Your custom logic here
    await this.doWork(task);

    await this.missionControl.completeTask(task.description);
  }

  async doWork(task: any): Promise<void> {
    // Implement your agent's specific work
    console.log('Doing the work...');

    // Code, analysis, testing, etc.
  }
}

// Create and start
const customAgent = new MyCustomAgent(CONFIG);
await customAgent.start();
```

## Mission Control Integration

To see agents in Mission Control:

1. Open https://project-manager-blue-three.vercel.app
2. Navigate to AGENTS tab
3. Your agent will show as **active** when:
   - It successfully registers via API
   - Updates status periodically
   - Sends heartbeat messages

## Troubleshooting

### Agent Not Showing in Mission Control

1. Check agent is running:
```bash
curl http://localhost:3000/api/agents-status | jq '."YOUR_AGENT_ID".status'
```

2. Check logs for registration error:
```
❌ Failed to register with Mission Control
```

3. Verify Mission Control URL and token are correct

### WebSocket Connection Failed

1. Check WebSocket URL is correct
2. Ensure WebSocket server is running
3. Agent will fall back to HTTP polling automatically

### Agent Stops Unexpectedly

Check logs for errors:
```
❌ Failed to update status
❌ Failed to send message
```

## Security Notes

- **Never commit MISSION_CONTROL_TOKEN** to git
- Use environment variables or secrets manager
- Token gives full access to Mission Control APIs
- Rotate tokens regularly

## Advanced Features

### Custom Task Processing

Override `processTask()` method to implement custom logic:

```typescript
async processTask(task: any): Promise<void> {
  // Parse task
  const { type, description, priority } = task;

  // Update status
  await this.missionControl.updateStatus('working', description);

  // Process based on type
  switch (type) {
    case 'code':
      await this.writeCode(description);
      break;
    case 'test':
      await this.runTests(description);
      break;
    case 'deploy':
      await this.deployCode(description);
      break;
  }

  // Complete
  await this.missionControl.completeTask(description);
}
```

### Agent Communication

Agents can coordinate with each other:

```typescript
// Developer agent
await agent.sendMessage('qa', 'I finished the bug fix, please test');

// QA agent
const messages = await agent.getMessages('developer', 'qa');
```

### Inter-Agent Workflows

Complex workflows with multiple agents:

```typescript
// 1. Developer picks up task
await agent.missionControl.addTodo('Implement new feature');

// 2. Developer completes, notifies QA
await agent.sendMessage('qa', 'Feature ready for testing');

// 3. QA tests, reports back
await agent.sendMessage('developer', 'Found 2 bugs, please fix');

// 4. Developer fixes, completes
await agent.missionControl.completeTask('Feature deployed with fixes');
```

## Production Deployment

### As Standalone Service

```bash
# Build
npm run build

# Run with process manager
pm2 start my-agent --interpreter node agent-template-mission-control.js

# Or use Docker
docker build -t my-agent .
docker run -d --name my-agent my-agent
```

### As OpenClaw Agent

Use `sessions_spawn` from OpenClaw main session:

```typescript
// Spawn with subagent runtime
await sessions_spawn({
  runtime: 'subagent',
  task: 'Process the pending tasks',
  attachments: [
    {
      name: 'agent-code',
      content: fs.readFileSync('agent-template-mission-control.ts', 'utf8'),
      encoding: 'utf8'
    }
  ]
})
```

## Monitoring

### Health Check

```bash
# Check agent status
curl http://localhost:3000/api/agents-status | jq '.YOUR_AGENT_ID'

# Check if agent is alive
ps aux | grep node | grep agent-template
```

### Logs

Agent logs to console:
```
✅ Registered with Mission Control
📊 Status: working | Task: Processing feature request
💬 New message from qa
🎯 Processing task: Fix login bug
✅ Todo added: Test login functionality
✅ Task completed: Fix login bug
```

## License

MIT License - Use freely for any purpose.

## Support

For issues or questions:
- Mission Control Dashboard: https://project-manager-blue-three.vercel.app
- OpenClaw Docs: https://docs.openclaw.ai
- GitHub Issues: https://github.com/chrisonclawd-coder/project-manager/issues
