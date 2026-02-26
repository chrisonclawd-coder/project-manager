const fs = require('fs');
const path = require('path');

const statusFile = path.join(__dirname, '..', 'data', 'team-status.json');

function updateStatus(member, status, task = '', blocker = '') {
  const data = JSON.parse(fs.readFileSync(statusFile, 'utf-8'));

  if (!data[member]) {
    console.error(`Unknown member: ${member}`);
    process.exitCode = 1;
    return;
  }

  data[member].status = status;
  data[member].currentTask = task;
  data[member].blocker = blocker;
  data[member].updatedAt = new Date().toISOString();

  fs.writeFileSync(statusFile, JSON.stringify(data, null, 2));
  console.log(`Updated ${member}: ${status} | task="${task}" | blocker="${blocker}"`);
}

// CLI:
// node update-status.js <member> <status> [task] [--blocker "text"]
const args = process.argv.slice(2);
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
  process.exit(1);
}

updateStatus(member, status, task, blocker);
