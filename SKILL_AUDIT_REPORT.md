# Skill Audit Report

Based on OpenAI best practices from https://developers.openai.com/blog/skills-shell-tips

**Date:** 2026-02-15
**Audited Skills:** 7 (discord, notion, weather, canvas, tmux, github, coding-agent)

---

## Audit Checklist Results

### General Findings

**Good:**
- Clear frontmatter with name, description, metadata
- Organized structure with sections and examples
- Practical examples provided
- Documented configuration and setup

**Needs Improvement:**
- Most skills lack "Use when / Don't use when" blocks
- Few negative examples or edge case coverage
- Templates/examples are mostly inline, not in dedicated skill sections
- Limited long-run design thinking (container reuse, compaction)

---

## Skill-by-Skill Analysis

### 1. Discord

**Description Quality:** ❌
- Has high-level description but no routing logic
- No "Use when vs. don't use when" section
- No negative examples or edge cases

**Structure:** ✅
- Good frontmatter
- Organized with "Musts", "Targets", "Common Actions"
- Clear examples for each action type

**Edge Cases:** ⚠️
- Mentions gating via `channels.discord.actions.*`
- Mentions optional multi-account

**Long-run Design:** ❌
- No mention of container reuse or persistence
- No compaction strategy
- Not designed for long-running workflows

**Recommendations:**
- Add "Use when vs. don't use when" block to description
- Add negative examples: "Don't use Discord for private messages with encryption" or "Don't use when channel is muted"
- Add edge case coverage for rate limits and permission errors

---

### 2. Notion

**Description Quality:** ❌
- Has detailed description but no routing logic
- No "Use when vs. don't use when" section
- No negative examples or edge cases

**Structure:** ✅
- Good frontmatter with API version note
- Well-organized sections: Setup, API Basics, Common Operations, Property Types, Key Differences
- Concrete examples for all operations

**Edge Cases:** ⚠️
- Mentions rate limit (~3 requests/second)
- Mentions UUID format
- Notes API can't set database view filters

**Long-run Design:** ❌
- No mention of container reuse
- No compaction strategy
- Not designed for long-running workflows

**Recommendations:**
- Add "Use when vs. don't use when" block to description
- Add negative examples: "Don't use Notion for high-frequency real-time updates" or "Don't use for time-sensitive triggers"
- Add edge case coverage for rate limits, network failures, API version changes

---

### 3. Weather

**Description Quality:** ❌
- Has simple description but no routing logic
- No "Use when vs. don't use when" section
- No negative examples or edge cases

**Structure:** ✅
- Good frontmatter
- Organized sections: Primary (wttr.in), Fallback (Open-Meteo), Tips
- Clear command examples

**Edge Cases:** ⚠️
- Mentions format codes
- Mentions URL encoding requirements
- Notes both services are free, no API keys

**Long-run Design:** ❌
- No mention of container reuse
- No compaction strategy
- Not designed for long-running workflows (ephemeral service)

**Recommendations:**
- Add "Use when vs. don't use when" block to description
- Add negative examples: "Don't use for historical weather data" or "Don't use when offline"
- Add edge case coverage for network failures, service outages

---

### 4. Canvas

**Description Quality:** ❌
- Has detailed description but no routing logic
- No "Use when vs. don't use when" section
- No negative examples or edge cases

**Structure:** ✅
- Good frontmatter
- Excellent organization: Overview, Architecture, Tailscale Integration, Actions, Configuration, Workflow, Debugging
- Clear diagrams and tables
- Comprehensive debugging section

**Edge Cases:** ⚠️
- Mentions Tailscale hostname issues
- Mentions live reload not working
- Mentions node connectivity

**Long-run Design:** ❌
- Mentions persistence ("The canvas persists until you hide it")
- No mention of container reuse across steps
- No compaction strategy
- Could benefit from workflow pattern for multi-step canvas presentations

**Recommendations:**
- Add "Use when vs. don't use when" block to description
- Add negative examples: "Don't use for real-time interactive dashboards requiring WebSocket" or "Don't use when node network is unstable"
- Add edge case coverage for node disconnection, browser compatibility, mobile responsiveness

---

### 5. Tmux

**Description Quality:** ❌
- Has functional description but no routing logic
- No "Use when vs. don't use when" section
- No negative examples or edge cases

**Structure:** ✅
- Good frontmatter
- Excellent organization: Quickstart, Socket convention, Targeting, Finding sessions, Sending input, Watching output, Spawning processes, Cleanup, Helper
- Very detailed examples with code blocks
- Mentions orchestration of coding agents

**Edge Cases:** ⚠️
- Mentions PTY requirements for coding agents
- Mentions Windows/WSL differences
- Mentions shell prompt detection

**Long-run Design:** ⚠️
- Mentions orchestrating coding agents in parallel (good!)
- Mentions socket persistence across sessions
- No explicit container reuse pattern
- Could benefit from workflow pattern for long-running tmux sessions

**Recommendations:**
- Add "Use when vs. don't use when" block to description
- Add negative examples: "Don't use tmux when you need persistent processes across reboots" or "Don't use when battery life is a concern"
- Add edge case coverage for tmux server crashes, session conflicts, cleanup issues

---

### 6. GitHub

**Description Quality:** ❌
- Has functional description but no routing logic
- No "Use when vs. don't use when" section
- No negative examples or edge cases

**Structure:** ✅
- Good frontmatter with install instructions
- Organized sections: Pull Requests, API for Advanced Queries, JSON Output
- Clear examples for each subcommand

**Edge Cases:** ⚠️
- Mentions `--repo` requirement when not in git directory
- Mentions JSON output and filtering with `--jq`

**Long-run Design:** ❌
- No mention of container reuse
- No compaction strategy
- Not designed for long-running workflows

**Recommendations:**
- Add "Use when vs. don't use when" block to description
- Add negative examples: "Don't use GitHub skill when you need real-time webhooks" or "Don't use for API rate limit-heavy batch operations"
- Add edge case coverage for authentication failures, rate limits, branch protection rules

---

### 7. Coding Agent

**Description Quality:** ❌
- Has functional description but no routing logic
- No "Use when vs. don't use when" section
- No negative examples or edge cases

**Structure:** ✅
- Good frontmatter
- Excellent organization: Quick Start, The Pattern, Codex CLI, Claude Code, OpenCode, Pi Coding Agent, Parallel Issue Fixing, Rules, Progress Updates, Auto-Notify
- Very detailed with examples and warnings
- Mentions workflow patterns and best practices

**Edge Cases:** ⚠️
- Strong edge case coverage: "NEVER review PRs in ~/clawd", "NEVER checkout branches in ~/Projects/openclaw/"
- Mentions PTY requirements, git repo requirements
- Mentions rate limits, process cleanup

**Long-run Design:** ⚠️
- Mentions parallel execution with git worktrees (good!)
- Mentions background mode for long-running tasks
- Mentions process monitoring and cleanup
- Strong focus on long-running workflows with multiple agents

**Recommendations:**
- Add "Use when vs. don't use when" block to description
- Add negative examples: "Don't use coding agent when you need synchronous, guaranteed return" or "Don't use for non-code generation tasks"
- Add edge case coverage for agent failures, unexpected prompts, file conflicts

---

## Summary & Priorities

### High Priority Improvements (Apply to ALL skills)

1. **Add "Use when / Don't use when" blocks to descriptions**
   - This is the #1 issue across all skills
   - Will help model route to right skill
   - Should include concrete examples

2. **Add negative examples and edge cases**
   - Even 2-3 negative examples make routing much more reliable
   - Helps model avoid misfires

### Medium Priority Improvements (Apply to Most Skills)

3. **Move templates/examples into skill files**
   - Current skills have inline examples in descriptions
   - Should create dedicated "Templates" or "Examples" sections

4. **Design for long runs early**
   - Container reuse patterns
   - Compaction strategy (for skills with long-running workflows)
   - Progress tracking and status updates

### Low Priority (Specific to Certain Skills)

5. **Enhance workflow patterns**
   - Canvas: multi-step presentations
   - Tmux: long-running session patterns
   - Coding Agent: already strong here, can improve other skills

---

## Quick Wins (1-2 hours each)

**Easy fixes that will make immediate impact:**

1. **Discord**: Add "Use when vs. don't use when" + 2 negative examples (~15 min)
2. **Notion**: Add "Use when vs. don't use when" + 2 negative examples (~15 min)
3. **Weather**: Add "Use when vs. don't use when" + 2 negative examples (~10 min)
4. **Canvas**: Add "Use when vs. don't use when" + 2 negative examples (~15 min)
5. **Tmux**: Add "Use when vs. don't use when" + 2 negative examples (~15 min)
6. **GitHub**: Add "Use when vs. don't use when" + 2 negative examples (~15 min)
7. **Coding Agent**: Add "Use when vs. don't use when" + 2 negative examples (~15 min)

Total time: ~1.75 hours for all 7 skills

---

## Recommended Action Plan

**Week 1:**
- Day 1-2: Fix all 7 skills with "Use when / Don't use when" + negative examples (1-2 hours)
- Day 3: Create audit template for future skills
- Day 4: Implement improvements on 2-3 most-used skills
- Day 5: Test improvements with real queries

**Week 2:**
- Start building reusable workflow skills (spreadsheet analysis, report generation)
- Set up compaction for long-running sessions
- Implement allowlists

**Week 3:**
- Skills as living SOPs (account planning, triage, content generation)
- Cloud/local dev loop

---

## Next Steps

1. **Create audit template** for future skills
2. **Fix all 7 skills** with quick wins (1-2 hours)
3. **Build reusable workflow skill** (spreadsheet analysis)
4. **Test improvements** with real queries

Want me to start with the quick wins on all 7 skills?
