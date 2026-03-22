---
name: token-optimization
description: Use when context is growing large, responses are slow, or you need to optimize token budget across system prompt, background processes, and model selection
---

# Token Optimization Skill

Strategies for managing and reducing token consumption across Claude Code sessions. Complements the `strategic-compact` skill (which covers compaction mechanics) — this skill covers everything else in token budget management.

## When to Activate

- Context window is growing large and responses are slowing down
- System prompt or CLAUDE.md has grown unwieldy
- You're running expensive operations that could use a cheaper model
- Background hooks or processes are consuming excessive tokens
- You need to plan token budget across a multi-phase task
- Cost per session is higher than expected

## System Prompt Slimming

The system prompt (CLAUDE.md, settings, skills) is injected on every turn. Every byte here is multiplied by the number of turns in your session.

### Minimize CLAUDE.md

```markdown
# BEFORE (bloated — 2000 tokens)
## Project Overview
This is a Next.js application that uses TypeScript and Tailwind CSS.
We follow the Airbnb style guide with some modifications. The project
was started in January 2024 and uses pnpm as the package manager.
Our testing framework is Vitest with React Testing Library...
[3 more paragraphs of prose]

## Coding Standards
- Always use TypeScript strict mode
- Always use functional components
- Always use named exports
- Always add JSDoc comments to public functions
- Always handle errors with try/catch
- Always use semantic HTML
[20 more "always" rules]

# AFTER (lean — 400 tokens)
## Stack
Next.js 14, TypeScript (strict), Tailwind, Vitest, pnpm

## Standards
Functional components, named exports, semantic HTML.
Error handling: try/catch with typed errors.
See eslint config for style rules — don't duplicate here.
```

**Rules of thumb:**
- If your linter already enforces it, don't repeat it in CLAUDE.md
- Use bullet points, not paragraphs
- Reference files instead of inlining content: "See `docs/architecture.md`" instead of copying architecture docs
- Remove context that Claude already knows (e.g., "TypeScript is a typed superset of JavaScript")

### Use Skill References Over Inline Content

```markdown
# BEFORE: 500 tokens of API design rules inlined in CLAUDE.md
## API Design
[entire api-design skill content pasted here]

# AFTER: 10 tokens
Follow the `api-design` skill for API conventions.
```

Skills are loaded on-demand when relevant. CLAUDE.md is loaded on every turn.

### Remove Redundant Instructions

Common sources of redundancy:
- **CLAUDE.md + .cursorrules + .editorconfig** — pick one source of truth
- **CLAUDE.md + eslint/prettier config** — linters enforce style; don't also describe it
- **CLAUDE.md + tsconfig.json** — TypeScript config is self-documenting
- **Multiple "always do X" rules that say the same thing differently**

### Audit Prompt Size

```bash
# Check total CLAUDE.md size
wc -c .claude/CLAUDE.md ~/.claude/CLAUDE.md 2>/dev/null

# Rough token estimate (1 token ~ 4 chars for English)
wc -c .claude/CLAUDE.md | awk '{printf "~%d tokens\n", $1/4}'
```

## Background Process Management

Hooks (PreToolUse, PostToolUse) and background processes consume tokens on every tool call. A verbose hook that runs on every `Write` or `Edit` can silently burn thousands of tokens per session.

### Identify Token-Consuming Hooks

```bash
# List all configured hooks
cat .claude/settings.json | jq '.hooks'

# Check hook script sizes and output verbosity
# Run a hook manually and measure output size
echo "test" | wc -c  # baseline
```

### Reduce Hook Output

```bash
# BEFORE: Hook dumps full lint output (500+ lines)
npm run lint

# AFTER: Hook reports only count
npm run lint --quiet 2>&1 | tail -1
# Or even better: exit code only
npm run lint --quiet > /dev/null 2>&1 && echo "OK" || echo "LINT FAIL"
```

### Hook Optimization Strategies

| Strategy | Token Impact | Example |
|----------|-------------|---------|
| Reduce output verbosity | High | `--quiet`, `--silent`, pipe to `/dev/null` |
| Run conditionally | High | Only lint changed files, not entire project |
| Batch hook execution | Medium | Combine multiple checks into one hook |
| Remove redundant hooks | High | Don't lint on every edit if you lint pre-commit |

### Audit Hook Token Cost

For a session with N tool calls and a hook that produces M tokens of output:
- Total hook cost = N * M tokens
- A hook producing 200 tokens per call across 50 tool calls = 10,000 tokens just from hooks
- That's equivalent to ~4 pages of prose, consumed silently

## Model Selection Guidance

Not every task needs the most capable (and most expensive) model. Route tasks to the right model for the best cost/quality tradeoff.

### When to Use Each Model Tier

| Model | Best For | Cost | Quality |
|-------|----------|------|---------|
| **Opus** | Complex architecture, multi-file refactoring, nuanced code review, novel problem-solving | Highest | Highest |
| **Sonnet** | Standard feature implementation, bug fixes, test writing, most day-to-day coding | Medium | High |
| **Haiku** | Simple edits, formatting, boilerplate generation, quick lookups, file renaming | Lowest | Good for simple tasks |

### Task Routing Heuristics

**Use Opus when:**
- Designing system architecture from scratch
- Debugging complex, multi-component issues
- Writing code that requires deep domain knowledge
- Tasks where getting it wrong is expensive (security, data migrations)
- You need the best possible code review

**Use Sonnet when:**
- Implementing features from a clear spec
- Writing tests for existing code
- Standard refactoring (extract function, rename, move)
- Most everyday development tasks

**Use Haiku when:**
- Generating boilerplate (interfaces, types, stubs)
- Simple find-and-replace across files
- Formatting or restructuring existing content
- Quick factual lookups in code
- Tasks that are mostly mechanical

### Model Switching in Practice

Switch models mid-session when the task complexity changes:
- Start with Sonnet for implementation
- Switch to Opus for the tricky edge case
- Switch to Haiku for writing test boilerplate

## Token Budget Awareness

### Monitor Context Usage

Signs your context is getting large:
- Responses are noticeably slower
- Claude starts "forgetting" earlier context
- You see auto-compaction warnings
- The session has been running for 30+ minutes with many tool calls

### When to Compact vs. Start Fresh

| Situation | Action |
|-----------|--------|
| Completed a major milestone, starting new work | `/compact` (see `strategic-compact` skill) |
| Context is large but you're mid-task | Continue — compacting mid-task loses critical context |
| Exploring many files but haven't started implementing | `/compact` with a summary of findings, then implement |
| Session has drifted far from original task | Start fresh — compaction can't recover lost focus |
| Debugging with many failed attempts in context | Start fresh — old failures add noise, not signal |

### Reduce Token Consumption During Work

**Read selectively:**
```bash
# BEFORE: Read entire file (2000 lines)
Read file.ts

# AFTER: Read only what you need
Read file.ts lines 45-80
```

**Search before reading:**
```bash
# BEFORE: Read 5 files looking for a function
# AFTER: Grep to find it, then read only that file
rg "function handleAuth" --type ts -l
```

**Limit tool output:**
```bash
# BEFORE: Full test output (500 lines)
npm test

# AFTER: Summary only
npm test 2>&1 | tail -20
```

### Token Budget Planning for Large Tasks

For multi-phase tasks, plan your token budget:

```
Phase 1: Research (explore files, understand codebase)
  → Target: 30% of budget
  → Compact after research, keep findings summary

Phase 2: Plan (design solution, get approval)
  → Target: 10% of budget
  → Compact after plan approval, keep the plan

Phase 3: Implement (write code)
  → Target: 40% of budget
  → Compact between major components if needed

Phase 4: Verify (tests, review)
  → Target: 20% of budget
  → No compaction needed — session is ending
```

### Cost Estimation

Rough cost awareness for planning:
- 1M input tokens ~ varies by model and provider
- A typical 30-minute session: 50K-200K tokens
- A complex multi-hour session: 200K-800K tokens
- Each file read: ~500-5000 tokens depending on file size
- Each tool call + response: ~200-2000 tokens

## Anti-Patterns

- **Kitchen-sink CLAUDE.md**: Putting every possible instruction in CLAUDE.md instead of using skills
- **Verbose hooks on hot paths**: Running full lint/test suite on every file edit
- **Reading entire files**: When you only need a specific function or section
- **Using Opus for everything**: Burning budget on tasks that Haiku handles fine
- **Never compacting**: Letting context grow until auto-compaction happens at an inopportune time
- **Over-compacting**: Compacting so frequently that you lose important context and have to re-read files
