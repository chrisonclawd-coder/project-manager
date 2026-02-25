const fs = require('fs');
const path = require('path');

const statusFile = path.join(__dirname, '..', 'data', 'team-status.json');

function updateStatus(member, status, task) {
  const data = JSON.parse(fs.readFileSync(statusFile, 'utf-8'));
  if (data[member]) {
    data[member].status = status;
    data[member].currentTask = task;
    fs.writeFileSync(statusFile, JSON.stringify(data, null, 2));
    console.log(`Updated ${member}: ${status} - ${task}`);
  }
}

// CLI: node update-status.js <member> <status> <task>
const [,, member, status, ...taskParts] = process.argv;
if (member && status) {
  updateStatus(member, status, taskParts.join(' '));
}
