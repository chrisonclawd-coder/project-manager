# Agent Hierarchy - Quick Start Guide

## Setup Complete ✅

Workspaces created:
- `/home/clawdonaws/.openclaw/workspace/software-dev`
- `/home/clawdonaws/.openclaw/workspace/analysis`
- `/home/clawdonaws/.openclaw/workspace/marketing`

Config ready: `agent-config-patch.json`

---

## How It Works

```
You (Main Session / Chrisly - CEO)
    │
    ├── Software Development Agent
    │       ├── Developer
    │       ├── QA Engineer
    │       ├── DevOps Engineer
    │       ├── Manual Tester
    │       └── Product Architect
    │
    ├── Analysis Agent
    │       ├── Performance Analyst
    │       ├── Code Reviewer
    │       ├── Security Auditor
    │       └── Data Analyst
    │
    └── Marketing Agent (xMax)
            ├── Social Media Manager
            ├── Content Creator
            ├── Growth Strategist
            └── Brand Manager
```

---

## Usage Examples

### 1. Software Development Tasks

**Build something:**
```
"Tell the software dev team to build a Chrome extension"
```
→ Spawns: Software Development Agent (Manager)
→ Manager delegates to Developer → QA → DevOps → Manual Tester

**Fix a bug:**
```
"Tell the software dev team to fix the login bug"
```
→ Spawns: Software Development Agent (Manager)
→ Manager delegates to Developer → QA

**Write specs:**
```
"Ask the Product Architect to write specs for a new feature"
```
→ Spawns: Product Architect directly

---

### 2. Analysis Tasks

**Review code:**
```
"Tell the analysis team to review the codebase"
```
→ Spawns: Analysis Agent (Manager)
→ Manager delegates to Code Reviewer → Security Auditor

**Check performance:**
```
"Ask the Performance Analyst to analyze app performance"
```
→ Spawns: Performance Analyst directly

**Security audit:**
```
"Tell the Security Auditor to scan for vulnerabilities"
```
→ Spawns: Security Auditor directly

---

### 3. Marketing Tasks

**Create social media post:**
```
"Tell the marketing team to create a viral tweet thread about AI"
```
→ Spawns: Marketing Agent (xMax)
→ xMax delegates to Content Creator → Brand Manager → Social Media Manager

**Write blog post:**
```
"Ask the Content Creator to write a blog post about coding assistants"
```
→ Spawns: Content Creator directly

**Growth strategy:**
```
"Ask the Growth Strategist to plan a viral campaign"
```
→ Spawns: Growth Strategist directly

---

## Apply the Config

**Option 1: Ask me to apply it**
```
"Apply the agent config"
```
→ I'll run `gateway config.apply` with the patch

**Option 2: Manual apply**
```bash
# Copy the patch content to your openclaw.json agents.list section
# Then restart the gateway
openclaw gateway restart
```

---

## Verify It Works

After applying config:

```bash
# List all available agents
openclaw agents list

# You should see:
# - main (CEO / Chrisly)
# - software-dev (Manager)
# - analysis (Manager)
# - marketing (Manager)
# - developer, qa, devops, manual-tester, product-architect
# - performance-analyst, code-reviewer, security-auditor, data-analyst
# - social-media-manager, content-creator, growth-strategist, brand-manager
```

---

## Models Used

**Fast tasks (MiniMax M2.5 Free):**
- Software Development Agent (Manager)
- Developer, QA, DevOps, Manual Tester
- Social Media Manager, Content Creator

**Deep reasoning (GLM-4.7):**
- Analysis Agent (Manager)
- Performance Analyst, Code Reviewer, Security Auditor, Data Analyst
- Product Architect, Growth Strategist, Brand Manager

**Cost:** All models are free or have zero configured cost

---

## Benefits

✅ **Specialization** - Each agent is expert in their domain
✅ **Parallel work** - Multiple agents work independently
✅ **Organized** - Each team has their own workspace
✅ **Scalable** - Easy to add more sub-agents
✅ **Clear hierarchy** - Chrisly (CEO) → Managers → Sub-agents

---

## Next Steps

1. **Apply the config** - Say "apply the agent config"
2. **Test it out** - Ask me to delegate a task
3. **Check workspaces** - Review files in each team's directory

---

## Files Created

- `AGENT-HIERARCHY.md` - Full design document
- `AGENT-CONFIG.md` - Detailed configuration guide
- `agent-config-patch.json` - Config patch to apply
- `setup-agents.sh` - Setup script (already run)
- `software-dev/README.md` - Dev team workspace
- `analysis/README.md` - Analysis team workspace
- `marketing/README.md` - Marketing team workspace
