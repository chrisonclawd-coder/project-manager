# OpenAI Skills/Shell/Compaction Best Practices

Based on https://developers.openai.com/blog/skills-shell-tips

## Core Principles

**Skills** = Versioned, reusable procedures the model loads on demand
**Shell** = Execution environment (hosted or local) for agents
**Compaction** = Automatic context window management for long runs

---

## Skill Design Rules

### 1. Write descriptions like routing logic (not marketing copy)

Description is the model's decision boundary. Should answer:
- When should I use this?
- When should I not use this?
- What are the outputs and success criteria?

Include a short "Use when vs. don't use when" block directly in the description.

### 2. Add negative examples and edge cases

Reduces misfires. Explicit "Don't call this skill when..." cases help the model route more cleanly, especially when you have multiple similar skills.

### 3. Put templates and examples inside the skill

- Available exactly when needed (when skill is invoked)
- Don't inflate tokens for unrelated queries

Best for:
- Structured reports
- Escalation triage summaries
- Account plans
- Data analysis writeups

### 4. Design for long runs early

- Reuse same container across steps when you want stable dependencies, cached files, and intermediate outputs
- Pass previous_response_id for thread continuation
- Use compaction as default long-run primitive, not emergency fallback

### 5. Explicit skill usage when you need determinism

When running production workflows with clear contract, say "Use the <skill name> skill." This turns fuzzy routing into explicit contract.

---

## Security Rules

### 6. Treat skills + networking as high-risk combo

Design for containment:
- Skills: allowed
- Shell: allowed
- Network: enabled only with minimal allowlist, per request, for narrowly scoped tasks

### 7. Use /mnt/data as handoff boundary for artifacts

Tools write to disk, models reason over disk, developers retrieve from disk.

### 8. Two-layer allowlist system

- **Org-level**: Configured by admin, sets maximum allowed destinations
- **Request-level**: Must be subset of org allowlist

Implications:
- Keep org allowlist small and stable (trusted destinations)
- Keep request allowlists even smaller (destinations needed for this job)

### 9. Use domain_secrets for authenticated calls

Avoid credential leakage. Model sees placeholders ($API_KEY), sidecar injects real values only for approved destinations.

---

## Technical Patterns

### 10. Use same APIs in cloud and locally

- Skills work with hosted shell and local shell mode
- Shell has local execution mode (execute shell_call yourself, return shell_call_output)
- Keep skills same across both modes (workflow stays stable)

**Dev loop:**
- Start local (fast iteration, internal tooling, easy debugging)
- Move to hosted containers when you want repeatability, isolation, deployment consistency

---

## Build Patterns

### Pattern A: Install → fetch → write artifact

Simplest pattern for hosted shell:
- Install dependencies
- Scrape or call API
- Write report to /mnt/data/report.md

Creates clean review boundary for user/app.

### Pattern B: Skills + shell for repeatable workflows

Once you have successful shell workflows:

- Encode workflow (steps, guardrails, templates) in a skill
- Mount skill into shell environment
- Agent follows skill to produce artifacts deterministically

Effective for:
- Spreadsheet analysis/editing
- Dataset cleaning + summary generation
- Standardized report generation for recurring business processes

### Pattern C (advanced): Skills as enterprise workflow carriers

Skills close gap between single tool invocation and multi-tool orchestration.

Example from Glean:
- Salesforce-oriented skill: eval accuracy 73% → 85%
- Reduced time-to-first-token by 18.1%
- Tactics: careful routing, negative examples, embedded templates
- Skills encode recurring tasks: account planning, escalation triage, brand-aligned content generation

Skills become living SOPs (standard operating procedures).

---

## Summary

**Use skills to encode the how (procedures, templates, guardrails).**
**Use shell to execute the do (install, run, write artifacts).**
**Use compaction to keep long runs coherent (without hand-managing context).**
**Start locally when iterating quickly.**
**Move to hosted containers when you want repeatable, isolated execution.**
**Keep networking locked down with org-level and request-level allowlists, and use domain secrets for authenticated calls.**
