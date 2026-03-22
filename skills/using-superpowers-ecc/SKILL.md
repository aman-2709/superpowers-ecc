---
name: using-superpowers-ecc
description: Use when starting any conversation - establishes how to find and use skills, requiring Skill tool invocation before ANY response including clarifying questions
---

<SUBAGENT-STOP>
If you were dispatched as a subagent to execute a specific task, skip this skill.
</SUBAGENT-STOP>

<EXTREMELY-IMPORTANT>
If you think there is even a 1% chance a skill might apply to what you are doing, you ABSOLUTELY MUST invoke the skill.

IF A SKILL APPLIES TO YOUR TASK, YOU DO NOT HAVE A CHOICE. YOU MUST USE IT.

This is not negotiable. This is not optional. You cannot rationalize your way out of this.
</EXTREMELY-IMPORTANT>

## Instruction Priority

Superpowers-ecc skills override default system prompt behavior, but **user instructions always take precedence**:

1. **User's explicit instructions** (CLAUDE.md, GEMINI.md, AGENTS.md, direct requests) — highest priority
2. **Superpowers-ecc skills** — override default system behavior where they conflict
3. **Default system prompt** — lowest priority

If CLAUDE.md, GEMINI.md, or AGENTS.md says "don't use TDD" and a skill says "always use TDD," follow the user's instructions. The user is in control.

## How to Access Skills

**In Claude Code:** Use the `Skill` tool. When you invoke a skill, its content is loaded and presented to you—follow it directly. Never use the Read tool on skill files.

**In Gemini CLI:** Skills activate via the `activate_skill` tool. Gemini loads skill metadata at session start and activates the full content on demand.

**In other environments:** Check your platform's documentation for how skills are loaded.

## Platform Adaptation

Skills use Claude Code tool names. Non-CC platforms: see `references/codex-tools.md` (Codex) for tool equivalents. Gemini CLI users get the tool mapping loaded automatically via GEMINI.md.

# Using Skills

## The Rule

**Invoke relevant or requested skills BEFORE any response or action.** Even a 1% chance a skill might apply means that you should invoke the skill to check. If an invoked skill turns out to be wrong for the situation, you don't need to use it.

```dot
digraph skill_flow {
    "User message received" [shape=doublecircle];
    "About to EnterPlanMode?" [shape=doublecircle];
    "Already brainstormed?" [shape=diamond];
    "Invoke brainstorming skill" [shape=box];
    "Might any skill apply?" [shape=diamond];
    "Invoke Skill tool" [shape=box];
    "Announce: 'Using [skill] to [purpose]'" [shape=box];
    "Has checklist?" [shape=diamond];
    "Create TodoWrite todo per item" [shape=box];
    "Follow skill exactly" [shape=box];
    "Respond (including clarifications)" [shape=doublecircle];

    "About to EnterPlanMode?" -> "Already brainstormed?";
    "Already brainstormed?" -> "Invoke brainstorming skill" [label="no"];
    "Already brainstormed?" -> "Might any skill apply?" [label="yes"];
    "Invoke brainstorming skill" -> "Might any skill apply?";

    "User message received" -> "Might any skill apply?";
    "Might any skill apply?" -> "Invoke Skill tool" [label="yes, even 1%"];
    "Might any skill apply?" -> "Respond (including clarifications)" [label="definitely not"];
    "Invoke Skill tool" -> "Announce: 'Using [skill] to [purpose]'";
    "Announce: 'Using [skill] to [purpose]'" -> "Has checklist?";
    "Has checklist?" -> "Create TodoWrite todo per item" [label="yes"];
    "Has checklist?" -> "Follow skill exactly" [label="no"];
    "Create TodoWrite todo per item" -> "Follow skill exactly";
}
```

## Red Flags

These thoughts mean STOP—you're rationalizing:

| Thought | Reality |
|---------|---------|
| "This is just a simple question" | Questions are tasks. Check for skills. |
| "I need more context first" | Skill check comes BEFORE clarifying questions. |
| "Let me explore the codebase first" | Skills tell you HOW to explore. Check first. |
| "I can check git/files quickly" | Files lack conversation context. Check for skills. |
| "Let me gather information first" | Skills tell you HOW to gather information. |
| "This doesn't need a formal skill" | If a skill exists, use it. |
| "I remember this skill" | Skills evolve. Read current version. |
| "This doesn't count as a task" | Action = task. Check for skills. |
| "The skill is overkill" | Simple things become complex. Use it. |
| "I'll just do this one thing first" | Check BEFORE doing anything. |
| "This feels productive" | Undisciplined action wastes time. Skills prevent this. |
| "I know what that means" | Knowing the concept ≠ using the skill. Invoke it. |

## Skill Priority

When multiple skills could apply, use this order:

1. **Process skills first** (brainstorming, debugging) - these determine HOW to approach the task
2. **Implementation skills second** (api-design, deployment-patterns) - these guide execution

"Let's build X" → brainstorming first, then implementation skills.
"Fix this bug" → debugging first, then domain-specific skills.

## Skill Types

**Rigid** (TDD, debugging): Follow exactly. Don't adapt away discipline.

**Flexible** (patterns): Adapt principles to context.

The skill itself tells you which.

## User Instructions

Instructions say WHAT, not HOW. "Add X" or "Fix Y" doesn't mean skip workflows.

# Two-Layer Agent Architecture

Superpowers-ecc uses two complementary layers for agent-based work:

## Layer 1: Embedded Subagent Prompts

Skills like `subagent-driven-development` contain execution machinery — they define how to decompose work, dispatch subagents via the `Task` tool, and coordinate results. These are **process skills** that drive multi-agent workflows from within a conversation.

**When to use:** You're executing a multi-step implementation plan and need to parallelize work across subagents. The skill itself orchestrates the dispatch.

**Key skills:** `subagent-driven-development`, `dispatching-parallel-agents`, `executing-plans`

## Layer 2: Standalone Agents

The `agents/` directory contains domain-expert agents — specialized consultants you dispatch via commands. Each agent has a focused system prompt and a narrow domain of expertise.

| Agent | Domain |
|-------|--------|
| `planner` | Breaks down tasks into phased implementation plans |
| `architect` | System design, component boundaries, dependency analysis |
| `code-reviewer` | Code quality, patterns, correctness |
| `security-reviewer` | OWASP-based security analysis |
| `build-error-resolver` | Diagnoses and fixes build/compile errors |
| `refactor-cleaner` | Identifies and executes safe refactors |
| `e2e-runner` | Runs and debugs end-to-end test suites |

**When to use:** You need a focused expert opinion or to delegate a well-scoped task (review this PR, analyze this architecture, fix this build error). Dispatch via the appropriate command.

## Choosing Between Layers

| Situation | Use |
|-----------|-----|
| Multi-step implementation with parallelism | Layer 1 (embedded subagent prompts) |
| Focused expert task (review, analysis, diagnosis) | Layer 2 (standalone agents) |
| Complex project requiring both coordination and expertise | Both — Layer 1 orchestrates, Layer 2 agents get dispatched as subagents |

# State & Learning System

Superpowers-ecc persists state across conversations in `~/.claude/superpowers-ecc/`.

## Sessions

Sessions maintain context across multiple conversations on the same project or task. When a session is active, the agent has access to prior decisions, plans, and progress — avoiding the cold-start problem of each conversation starting from scratch.

## Instincts

The instinct system accumulates learned patterns with confidence scores. As the agent encounters repeated situations, successful approaches get reinforced and unsuccessful ones get deprioritized. Instincts represent "muscle memory" — things the agent has learned work well in this codebase or for this user.

Each instinct has:
- A **pattern** describing the situation
- A **response** describing the learned behavior
- A **confidence score** (0.0–1.0) that increases with successful application

## Commands

| Command | Purpose |
|---------|---------|
| `/learn` | Capture a new learning from the current context |
| `/evolve` | Review and update existing instincts based on new evidence |
| `/instinct-status` | Show current instincts and their confidence scores |

# ECC Additions

Beyond the 14 superpowers-origin skills, superpowers-ecc adds 10 skills that extend coverage into security, operations, continuous learning, and development rigor:

| Skill | What it adds |
|-------|-------------|
| `security-review` | OWASP-based security checklist for code and architecture review |
| `continuous-learning-v2` | Instinct system with confidence scoring — the learning engine behind `/learn`, `/evolve`, `/instinct-status` |
| `search-first` | Enforces research-before-coding discipline — read docs, search issues, check prior art |
| `eval-harness` | Eval-driven development with grader types (exact, llm, human) and pass@k metrics |
| `verification-loop` | Continuous build/test/lint/typecheck verification — catches breakage as you code |
| `strategic-compact` | Token-aware compaction suggestions — when to compact and what to preserve |
| `token-optimization` | System prompt slimming, model selection guidance, context budget management |
| `api-design` | REST patterns, pagination, error responses, versioning conventions |
| `deployment-patterns` | CI/CD pipelines, Docker configuration, health checks, rollback strategies |
| `e2e-testing` | Playwright end-to-end testing patterns, selectors, fixtures, debugging |

# Skill Inventory

All 24 skills grouped by category:

## Core Workflow (7)

| Skill | Purpose |
|-------|---------|
| `brainstorming` | Structured ideation before implementation |
| `writing-plans` | Phased implementation plans with clear deliverables |
| `executing-plans` | Plan execution with progress tracking |
| `test-driven-development` | Red-green-refactor TDD discipline |
| `systematic-debugging` | Hypothesis-driven bug investigation |
| `subagent-driven-development` | Multi-agent parallel execution |
| `dispatching-parallel-agents` | Parallel subagent dispatch patterns |

## Supporting (6)

| Skill | Purpose |
|-------|---------|
| `finishing-a-development-branch` | Branch completion checklist |
| `requesting-code-review` | How to request and structure code reviews |
| `receiving-code-review` | How to process and act on review feedback |
| `verification-before-completion` | Final verification before marking work done |
| `using-git-worktrees` | Git worktree workflows for parallel development |
| `writing-skills` | How to author new skills |

## Onboarding (1)

| Skill | Purpose |
|-------|---------|
| `using-superpowers-ecc` | This skill — how to find and use all other skills |

## Security & Quality (2)

| Skill | Purpose |
|-------|---------|
| `security-review` | OWASP-based security analysis |
| `verification-loop` | Continuous build/test/lint/typecheck verification |

## Development Rigor (3)

| Skill | Purpose |
|-------|---------|
| `search-first` | Research before coding |
| `eval-harness` | Eval-driven development with grader types and pass@k |
| `e2e-testing` | Playwright end-to-end testing patterns |

## Architecture & API (2)

| Skill | Purpose |
|-------|---------|
| `api-design` | REST patterns, pagination, error responses |
| `deployment-patterns` | CI/CD, Docker, health checks |

## Learning & Optimization (3)

| Skill | Purpose |
|-------|---------|
| `continuous-learning-v2` | Instinct system with confidence scoring |
| `strategic-compact` | Token-aware compaction suggestions |
| `token-optimization` | System prompt slimming, model selection |
