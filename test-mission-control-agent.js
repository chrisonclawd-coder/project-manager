#!/usr/bin/env node

// Simple Test Agent - Mission Control Integration
// This demonstrates how agents show up in Mission Control

const https = require('https');

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  // Agent identity - using an existing agent for demo
  agentId: 'developer',  // This agent already exists in Mission Control
  agentName: 'Developer Agent',
  role: 'Writes and tests code',

  // Mission Control API
  missionControlUrl: 'https://project-manager-blue-three.vercel.app',
  apiToken: '', // Empty token - API is public for demo

  // Status updates
  updateInterval: 10000, // Update every 10 seconds
  totalUpdates: 6, // Run for 1 minute (6 updates)
};

// ============================================================================
// HTTP HELPER
// ============================================================================

function httpRequest(url, method, data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (CONFIG.apiToken) {
      options.headers['Authorization'] = `Bearer ${CONFIG.apiToken}`;
    }

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch {
          resolve(body);
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// ============================================================================
// AGENT FUNCTIONS
// ============================================================================

async function registerAgent() {
  console.log('\n📝 Agent already configured in Mission Control');
  console.log(`   Agent ID: ${CONFIG.agentId}`);
  console.log(`   Name: ${CONFIG.agentName}`);
  return true;
}

async function updateStatus(status, currentTask, todoText = null) {
  try {
    const updateData = {
      agentId: CONFIG.agentId,
      status: status,
      currentTask: currentTask,
    };

    if (todoText) {
      // Add todo by reading current status first
      const currentStatus = await getStatus();
      if (currentStatus && currentStatus.todos) {
        currentStatus.todos.push({
          id: Date.now(),
          text: todoText,
          done: false,
        });
        updateData.todos = currentStatus.todos;
      }
    }

    await httpRequest(
      `${CONFIG.missionControlUrl}/api/agents-status`,
      'PUT',
      updateData
    );

    console.log(`📊 Status: ${status} | Task: ${currentTask}`);
    return true;
  } catch (error) {
    console.error('❌ Status update failed:', error.message);
    return false;
  }
}

async function getStatus() {
  try {
    const response = await httpRequest(
      `${CONFIG.missionControlUrl}/api/agents-status`,
      'GET'
    );
    return response[CONFIG.agentId];
  } catch (error) {
    console.error('❌ Failed to get status:', error.message);
    return null;
  }
}

async function sendMessage(toAgentId, message) {
  // Note: For demo purposes, just log the message
  // In production, this would call /api/agent-messages
  console.log(`💬 Message to ${toAgentId}: ${message}`);
  return true;
}

// ============================================================================
// TEST SCENARIOS
// ============================================================================

async function runTestAgent() {
  console.log('\n' + '='.repeat(60));
  console.log(`🤖 Starting Test Agent: ${CONFIG.agentName}`);
  console.log(`🆔 Agent ID: ${CONFIG.agentId}`);
  console.log(`🌐 Mission Control: ${CONFIG.missionControlUrl}`);
  console.log('='.repeat(60));

  // Step 1: Agent is already configured
  const registered = await registerAgent();
  if (!registered) {
    console.log('\n❌ Failed to start agent. Exiting.');
    process.exit(1);
  }

  console.log('\n✅ Agent is now active in Mission Control!');
  console.log('   Check: https://project-manager-blue-three.vercel.app');
  console.log('   Click AGENTS tab → Look for "Developer Agent"\n');

  // Step 2: Test different statuses
  const tasks = [
    { status: 'working', task: 'Analyzing requirements...', todo: 'Understand user needs' },
    { status: 'working', task: 'Processing data...', todo: 'Transform inputs' },
    { status: 'working', task: 'Generating output...', todo: 'Create deliverable' },
    { status: 'working', task: 'Validating results...', todo: 'Quality check' },
    { status: 'done', task: 'Task completed successfully!', todo: null },
    { status: 'idle', task: 'Waiting for next task...', todo: null },
  ];

  console.log('🔄 Running status updates...\n');
  console.log('   Watch the Mission Control AGENTS tab');
  console.log('   You should see status changing in real-time!\n');

  for (let i = 0; i < tasks.length; i++) {
    await updateStatus(tasks[i].status, tasks[i].task, tasks[i].todo);
    await sleep(CONFIG.updateInterval);
  }

  // Step 3: Test inter-agent messaging
  console.log('\n📧 Testing inter-agent messaging...');

  await sendMessage('software-dev', 'Hello from test agent! Ready to coordinate?');
  await sendMessage('qa', 'Can you help me with testing?');
  await sendMessage('marketing', 'Need marketing advice for this task');

  console.log('\n✅ Messages sent! Check agent message history');

  // Step 4: Show final status
  console.log('\n📊 Final Agent Status:');
  const finalStatus = await getStatus();
  if (finalStatus) {
    console.log(`   Status: ${finalStatus.status}`);
    console.log(`   Current Task: ${finalStatus.currentTask}`);
    console.log(`   Todos: ${finalStatus.todos?.length || 0} items`);

    if (finalStatus.todos && finalStatus.todos.length > 0) {
      console.log('\n   Todo List:');
      finalStatus.todos.forEach((todo, i) => {
        const status = todo.done ? '✅' : '⏳';
        console.log(`   ${status} ${todo.text}`);
      });
    }
  }

  // Done
  console.log('\n' + '='.repeat(60));
  console.log('✅ Test completed!');
  console.log(`🌐 Mission Control: ${CONFIG.missionControlUrl}/agents`);
  console.log('🎯 The agent is still active and visible!');
  console.log('💡 It will show status "idle" after test completes');
  console.log('='.repeat(60) + '\n');

  // Keep agent running to show in Mission Control
  console.log('⏳ Agent will remain visible for observation...');
  console.log('   Press Ctrl+C to stop the agent\n');

  // Periodically update status to keep alive
  setInterval(async () => {
    await updateStatus('idle', 'Waiting for tasks...');
  }, 30000); // Every 30 seconds
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// MAIN
// ============================================================================

process.on('SIGINT', async () => {
  console.log('\n\n🛑 Stopping test agent...');
  await updateStatus('idle', 'Agent stopped by user');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n\n🛑 Stopping test agent...');
  await updateStatus('idle', 'Agent terminated');
  process.exit(0);
});

// Run the test
runTestAgent().catch(error => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});
