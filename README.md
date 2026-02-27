# X Strategy Manager

Project to manage X (Twitter) growth strategy sessions.

## Structure

- `sessions/` - Session templates and engagement posts
- `tweets/` - Tweet templates and daily tweets
- `config/` - Configuration files (API keys, preferences)
- `docs/` - Documentation

## Usage

Run sessions using the OpenClaw `sessions_spawn` command with model `zai/glm-4.7`.

## Tavily Research Feed Setup

Set your Tavily API key before starting the app:

```bash
export TAVILY_API_KEY=your_tavily_api_key_here
```

The XMAX WORK tab includes a **Research Feed** panel that pulls fresh Tavily results focused on X growth, AI/dev trends, and product marketing signals (Mdify, GuardSkills, AI agents, devtools, security).

## Daily Schedule

- 10am IST - Engage + Post
- 3pm IST - Engage + Post
- 6pm IST - Engage + Post
- 9pm IST - Engage + Growth Insights

## Team Live Status Helper

Use this helper to drive real-time software pipeline statuses in Mission Control:

```bash
# Set single member status
node scripts/update-status.js developer working "Implementing feature"

# Move pipeline stage (auto-sets developer/qa/devops/tester)
node scripts/update-status.js --stage developer "Implementing fix"
node scripts/update-status.js --stage qa "Running validation"
node scripts/update-status.js --stage devops "Deploying to production"
node scripts/update-status.js --stage tester "Manual verification"
```
