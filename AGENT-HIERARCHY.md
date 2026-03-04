# Agent Hierarchy Design

## Overview
Multi-tier agent system with specialized domains and sub-agents.

## Structure

```
CHRISLY (CEO - Main Agent)
    │
    ├── Software Development Agent (Manager)
    │       ├── Developer
    │       ├── QA Engineer
    │       ├── DevOps Engineer
    │       ├── Manual Tester
    │       └── Product Architect
    │
    ├── Analysis Agent (Manager)
    │       ├── Performance Analyst
    │       ├── Code Reviewer
    │       ├── Security Auditor
    │       └── Data Analyst
    │
    └── Marketing Agent (xMax - Manager)
            ├── Social Media Manager
            ├── Content Creator
            ├── Growth Strategist
            └── Brand Manager
```

## Agent Details

### 1. Software Development Agent (Manager)
**Purpose:** Orchestrates development tasks, delegates to sub-agents

**Sub-Agents:**
- **Developer**: Writes code, implements features
- **QA Engineer**: Functional testing, edge cases, regression testing
- **DevOps Engineer**: Builds, deployments, CI/CD
- **Manual Tester**: Production validation, UX testing
- **Product Architect**: Specs, requirements, acceptance criteria

**Model:** `kilocode/minimax/minimax-m2.5:free` (fast, efficient)
**Workspace:** `/home/clawdonaws/.openclaw/workspace/software-dev`

### 2. Analysis Agent (Manager)
**Purpose:** Analyzes data, code, performance, and provides insights

**Sub-Agents:**
- **Performance Analyst**: Metrics, trends, optimization opportunities
- **Code Reviewer**: Code quality, best practices, patterns
- **Security Auditor**: Vulnerability scanning, security review
- **Data Analyst**: Data processing, insights, reports

**Model:** `zai/glm-4.7` (deep reasoning)
**Workspace:** `/home/clawdonaws/.openclaw/workspace/analysis`

### 3. Marketing Agent (xMax - Manager)
**Purpose:** Handles marketing, social media, branding, growth

**Sub-Agents:**
- **Social Media Manager**: Twitter/X, Reddit, LinkedIn posts
- **Content Creator**: Blog posts, articles, tutorials
- **Growth Strategist**: Growth hacking, viral mechanics
- **Brand Manager**: Brand voice, guidelines, positioning

**Model:** `kilocode/minimax/minimax-m2.5:free` (fast for content)
**Workspace:** `/home/clawdonaws/.openclaw/workspace/marketing`

## Workflow Example

### Software Development Task
```
User: "Build a Chrome extension"
    ↓
Chrisly (CEO) receives task
    ↓
Classifies: Software Development
    ↓
Forwards to: Software Development Agent
    ↓
Software Development Agent (Manager):
    1. Product Architect → Specs & Requirements
    2. Developer → Write code
    3. QA → Test code
    4. DevOps → Deploy
    5. Manual Tester → Production validation
    ↓
Reports back to Chrisly
    ↓
Chrisly reports to user
```

### Analysis Task
```
User: "Analyze codebase performance"
    ↓
Chrisly receives task
    ↓
Classifies: Analysis
    ↓
Forwards to: Analysis Agent
    ↓
Analysis Agent:
    1. Code Reviewer → Review code quality
    2. Performance Analyst → Analyze metrics
    3. Security Auditor → Check vulnerabilities
    ↓
Consolidates insights
    ↓
Reports back to Chrisly
```

### Marketing Task
```
User: "Create viral tweet thread about AI"
    ↓
Chrisly receives task
    ↓
Classifies: Marketing
    ↓
Forwards to: Marketing Agent (xMax)
    ↓
Marketing Agent:
    1. Content Creator → Draft content
    2. Brand Manager → Review brand alignment
    3. Social Media Manager → Optimize for platform
    ↓
xMax submits to Chrisly for approval
    ↓
Chrisly approves → Publish
```

## Configuration

Each agent needs:
- Unique ID
- Model assignment
- Workspace directory
- Parent/child relationships
- Permissions and capabilities

## Benefits

✅ **Specialization** - Each agent is expert in their domain
✅ **Parallelization** - Multiple agents can work simultaneously
✅ **Scalability** - Easy to add new sub-agents
✅ **Clarity** - Clear hierarchy and responsibilities
✅ **Efficiency** - Right tool for the right job
