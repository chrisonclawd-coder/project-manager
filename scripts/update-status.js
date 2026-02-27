const fs = require('fs');
const path = require('path');

const statusFile = path.join(__dirname, '..', 'data', 'team-status.json');
const PIPELINE_MEMBERS = ['developer', 'qa', 'devops', 'tester', 'xmax'];

function readData() {
  return JSON.parse(fs.readFileSync(statusFile, 'utf-8'));
}

function writeData(data) {
  fs.writeFileSync(statusFile, JSON.stringify(data, null, 2));
}

function nowIso() {
  return new Date().toISOString();
}

function touchMember(data, member) {
  if (!data[member]) {
    console.error(`Unknown member: ${member}`);
    process.exit(1);
  }
  data[member].updatedAt = nowIso();
}

function updateStatus(member, status, task = '', blocker = '') {
  const data = readData();

  if (!data[member]) {
    console.error(`Unknown member: ${member}`);
    process.exit(1);
  }

  data[member].status = status;
  data[member].currentTask = task;
  data[member].blocker = blocker;
  touchMember(data, member);

  writeData(data);
  console.log(`Updated ${member}: ${status} | task="${task}" | blocker="${blocker}"`);
}

function setPipelineStage(stage, task = '') {
  const data = readData();

  if (!PIPELINE_MEMBERS.includes(stage)) {
    console.error(`Unknown pipeline stage: ${stage}`);
    console.error(`Allowed: ${PIPELINE_MEMBERS.join(', ')}`);
    process.exit(1);
  }

  // Reset pipeline members
  for (const member of PIPELINE_MEMBERS) {
    if (!data[member]) continue;
    data[member].status = member === stage ? 'working' : 'idle';
    data[member].currentTask = member === stage ? task : '';
    data[member].blocker = '';
    touchMember(data, member);
  }

  // Manager heartbeat to reflect orchestration activity
  if (data.manager) {
    data.manager.status = 'working';
    data.manager.currentTask = `Orchestrating pipeline stage: ${stage}`;
    data.manager.blocker = '';
    touchMember(data, 'manager');
  }

  writeData(data);
  console.log(`Pipeline stage set: ${stage} | task="${task}"`);
}

function autoReset(task = '') {
  const data = readData();

  // Reset all pipeline members to idle
  for (const member of PIPELINE_MEMBERS) {
    if (!data[member]) continue;
    data[member].status = 'idle';
    data[member].currentTask = '';
    data[member].blocker = '';
    touchMember(data, member);
  }

  // Reset manager to idle with generic message
  if (data.manager) {
    data.manager.status = 'idle';
    data.manager.currentTask = task || 'Pipeline completed';
    data.manager.blocker = '';
    touchMember(data, 'manager');
  }

  writeData(data);
  console.log(`Pipeline auto-reset complete. ${task ? `Reason: "${task}"` : ''}`);
}

// CLI:
// 1) node update-status.js <member> <status> [task] [--blocker "text"]
// 2) node update-status.js --stage <developer|qa|devops|tester|xmax> [task]
// 3) node update-status.js --complete [reason]
const args = process.argv.slice(2);

if (args[0] === '--complete') {
  const reason = args.slice(1).join(' ').trim();
  autoReset(reason);
  process.exit(0);
}

if (args[0] === '--stage') {
  const stage = args[1];
  const task = args.slice(2).join(' ').trim();
  if (!stage) {
    console.error('Usage: node update-status.js --stage <developer|qa|devops|tester|xmax> [task]');
    process.exit(1);
  }
  setPipelineStage(stage, task);
  process.exit(0);
}

const blockerFlagIndex = args.indexOf('--blocker');
let blocker = '';
if (blockerFlagIndex !== -1) {
  blocker = args.slice(blockerFlagIndex + 1).join(' ').trim();
  args.splice(blockerFlagIndex);
}

const [member, status, ...taskParts] = args;
const task = taskParts.join(' ').trim();

if (!member || !status) {
  console.error('Usage: node update-status.js <member> <status> [task] [--blocker "text"]');
  console.error('   or: node update-status.js --stage <developer|qa|devops|tester|xmax> [task]');
  console.error('   or: node update-status.js --complete [reason]');
  process.exit(1);
}

updateStatus(member, status, task, blocker);
