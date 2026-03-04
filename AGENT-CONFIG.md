# OpenClaw Agent Configuration

## Agent List Configuration

Add these agents to your `openclaw.json` under `agents.list`:

```json
{
  "agents": {
    "list": [
      {
        "id": "main",
        "model": {
          "fallbacks": ["zai/glm-4.7"]
        }
      },
      {
        "id": "software-dev",
        "label": "Software Development",
        "model": {
          "primary": "kilocode/minimax/minimax-m2.5:free",
          "fallbacks": ["zai/glm-4.7-flash"]
        },
        "workspace": "/home/clawdonaws/.openclaw/workspace/software-dev",
        "subagents": {
          "maxConcurrent": 6
        }
      },
      {
        "id": "analysis",
        "label": "Analysis",
        "model": {
          "primary": "zai/glm-4.7",
          "fallbacks": ["kilocode/minimax/minimax-m2.5:free"]
        },
        "workspace": "/home/clawdonaws/.openclaw/workspace/analysis",
        "subagents": {
          "maxConcurrent": 4
        }
      },
      {
        "id": "marketing",
        "label": "Marketing (xMax)",
        "model": {
          "primary": "kilocode/minimax/minimax-m2.5:free",
          "fallbacks": ["zai/glm-4.7-flash"]
        },
        "workspace": "/home/clawdonaws/.openclaw/workspace/marketing",
        "subagents": {
          "maxConcurrent": 4
        }
      },
      {
        "id": "developer",
        "label": "Developer",
        "model": {
          "primary": "kilocode/minimax/minimax-m2.5:free"
        },
        "workspace": "/home/clawdonaws/.openclaw/workspace/software-dev"
      },
      {
        "id": "qa",
        "label": "QA Engineer",
        "model": {
          "primary": "kilocode/minimax/minimax-m2.5:free"
        },
        "workspace": "/home/clawdonaws/.openclaw/workspace/software-dev"
      },
      {
        "id": "devops",
        "label": "DevOps Engineer",
        "model": {
          "primary": "kilocode/minimax/minimax-m2.5:free"
        },
        "workspace": "/home/clawdonaws/.openclaw/workspace/software-dev"
      },
      {
        "id": "manual-tester",
        "label": "Manual Tester",
        "model": {
          "primary": "kilocode/minimax/minimax-m2.5:free"
        },
        "workspace": "/home/clawdonaws/.openclaw/workspace/software-dev"
      },
      {
        "id": "product-architect",
        "label": "Product Architect",
        "model": {
          "primary": "zai/glm-4.7"
        },
        "workspace": "/home/clawdonaws/.openclaw/workspace/software-dev"
      },
      {
        "id": "performance-analyst",
        "label": "Performance Analyst",
        "model": {
          "primary": "zai/glm-4.7"
        },
        "workspace": "/home/clawdonaws/.openclaw/workspace/analysis"
      },
      {
        "id": "code-reviewer",
        "label": "Code Reviewer",
        "model": {
          "primary": "zai/glm-4.7"
        },
        "workspace": "/home/clawdonaws/.openclaw/workspace/analysis"
      },
      {
        "id": "security-auditor",
        "label": "Security Auditor",
        "model": {
          "primary": "zai/glm-4.7"
        },
        "workspace": "/home/clawdonaws/.openclaw/workspace/analysis"
      },
      {
        "id": "data-analyst",
        "label": "Data Analyst",
        "model": {
          "primary": "zai/glm-4.7"
        },
        "workspace": "/home/clawdonaws/.openclaw/workspace/analysis"
      },
      {
        "id": "social-media-manager",
        "label": "Social Media Manager",
        "model": {
          "primary": "kilocode/minimax/minimax-m2.5:free"
        },
        "workspace": "/home/clawdonaws/.openclaw/workspace/marketing"
      },
      {
        "id": "content-creator",
        "label": "Content Creator",
        "model": {
          "primary": "kilocode/minimax/minimax-m2.5:free"
        },
        "workspace": "/home/clawdonaws/.openclaw/workspace/marketing"
      },
      {
        "id": "growth-strategist",
        "label": "Growth Strategist",
        "model": {
          "primary": "zai/glm-4.7"
        },
        "workspace": "/home/clawdonaws/.openclaw/workspace/marketing"
      },
      {
        "id": "brand-manager",
        "label": "Brand Manager",
        "model": {
          "primary": "zai/glm-4.7"
        },
        "workspace": "/home/clawdonaws/.openclaw/workspace/marketing"
      }
    ]
  }
}
```

## Agent Mappings

### Software Development Hierarchy
```
software-dev (Manager)
├── developer (Code)
├── qa (Testing)
├── devops (Deployment)
├── manual-tester (Validation)
└── product-architect (Specs)
```

### Analysis Hierarchy
```
analysis (Manager)
├── performance-analyst (Metrics)
├── code-reviewer (Quality)
├── security-auditor (Security)
└── data-analyst (Data)
```

### Marketing Hierarchy
```
marketing (Manager - xMax)
├── social-media-manager (X/Twitter, Reddit)
├── content-creator (Blogs, Articles)
├── growth-strategist (Growth hacking)
└── brand-manager (Brand voice)
```

## Usage

### From Main Session (Chrisly - CEO)

```javascript
// Delegate to Software Development Agent
sessions_spawn({
  agentId: "software-dev",
  task: "Build a Chrome extension that converts articles to flashcards"
})

// Delegate to Analysis Agent
sessions_spawn({
  agentId: "analysis",
  task: "Analyze the codebase performance and security"
})

// Delegate to Marketing Agent
sessions_spawn({
  agentId: "marketing",
  task: "Create viral Twitter thread about AI coding assistants"
})
```

### From Manager Agents to Sub-Agents

```javascript
// Software Development Manager spawns Developer
sessions_spawn({
  agentId: "developer",
  task: "Implement the flashcard generation logic"
})

// Software Development Manager spawns QA
sessions_spawn({
  agentId: "qa",
  task: "Test the flashcard generation edge cases"
})

// Marketing Manager spawns Content Creator
sessions_spawn({
  agentId: "content-creator",
  task: "Write a blog post about AI agents"
})
```

## Next Steps

1. **Apply config** - Run `gateway config.apply` with the updated config
2. **Create workspaces** - Make directories for each team
3. **Test hierarchy** - Spawn agents and verify delegation
4. **Update SOUL.md** - Document the new structure

## Benefits

✅ **Clear separation** - Each domain has its own workspace
✅ **Specialized models** - Deep tasks use GLM-4.7, fast tasks use MiniMax
✅ **Scalable** - Easy to add more sub-agents
✅ **Parallel work** - Multiple agents can work independently
✅ **Organized** - Each team has their own files and context
