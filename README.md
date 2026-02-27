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
