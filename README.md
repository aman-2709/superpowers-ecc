# superpowers-ecc

A focused Claude Code plugin merging superpowers workflow discipline with curated ECC tooling.

## Prerequisites

- [Claude Code](https://claude.ai/download) v2.1.0+
- Node.js 18+

## Quick Start

```bash
/plugin marketplace add https://github.com/aman-2709/superpowers-ecc
/plugin install superpowers-ecc@superpowers-ecc
/reload-plugins
```

### After Installing

Start with `/superpowers-ecc:brainstorm` to kick off a new feature or project. The brainstorming skill guides you through spec refinement, then transitions to planning and implementation.

## What's Included

| Component | Count | Details |
|-----------|-------|---------|
| Skills | 24 | 14 workflow + 10 tooling |
| Standalone agents | 7 | Domain consultants (planner, architect, etc.) |
| Slash commands | 24 | Workflow, quality, security, learning, orchestration |
| Rule sets | 4 | common + typescript + python + golang |
| Learning system | 6 commands | Instincts, confidence scoring, cross-session memory |
| Cross-platform | 4 | Claude Code, Cursor, OpenCode, Codex CLI |

## Workflow Overview

The plugin enforces a 7-step development loop:

```
brainstorm -> worktree -> plan -> implement (subagent-driven) -> review -> verify -> merge
```

Each step has a dedicated skill with guardrails. Start with `/superpowers-ecc:brainstorm` to enter the loop.

## Two-Layer Agent Architecture

| Layer | Purpose | Examples |
|-------|---------|----------|
| Embedded subagent prompts | Execution machinery | implementer, spec-reviewer, quality-reviewer |
| Standalone agents | Domain consultants | planner, architect, security-reviewer, build-error-resolver |

Embedded prompts are invoked automatically during `/superpowers-ecc:execute-plan`. Standalone agents are called on-demand via their slash commands or by other skills that need specialist input.

## Learning System

The continuous learning system observes patterns across sessions and codifies them as **instincts** -- lightweight heuristics that evolve over time.

**Lifecycle:** observe patterns -> score confidence -> evolve into skills

| Command | Purpose |
|---------|---------|
| `/superpowers-ecc:learn` | Record an observation or pattern |
| `/superpowers-ecc:learn-eval` | Evaluate and score recorded instincts |
| `/superpowers-ecc:evolve` | Promote high-confidence instincts to skills |
| `/superpowers-ecc:instinct-status` | Show current instincts and their confidence scores |
| `/superpowers-ecc:instinct-import` | Import instincts from a file |
| `/superpowers-ecc:instinct-export` | Export instincts to a file |

## Commands Reference

### Workflow

| Command | Description |
|---------|-------------|
| `/superpowers-ecc:brainstorm` | Structured ideation with spec document output |
| `/superpowers-ecc:write-plan` | Generate an implementation plan from a spec |
| `/superpowers-ecc:execute-plan` | Run a plan via subagent-driven implementation |
| `/superpowers-ecc:plan` | Alias for `/superpowers-ecc:write-plan` — shorter name, same behavior |

### Quality

| Command | Description |
|---------|-------------|
| `/superpowers-ecc:tdd` | Test-driven development cycle |
| `/superpowers-ecc:code-review` | Request a code review |
| `/superpowers-ecc:verify` | Run verification checks before completion |
| `/superpowers-ecc:quality-gate` | Enforce quality standards on changes |
| `/superpowers-ecc:test-coverage` | Analyze and report test coverage |

### Security

| Command | Description |
|---------|-------------|
| `/superpowers-ecc:security-scan` | Run security review on code changes |

### Agents

| Command | Description |
|---------|-------------|
| `/superpowers-ecc:build-fix` | Invoke build-error-resolver agent |
| `/superpowers-ecc:refactor-clean` | Invoke refactor-cleaner agent |
| `/superpowers-ecc:e2e` | Invoke e2e-runner agent |

### Learning

| Command | Description |
|---------|-------------|
| `/superpowers-ecc:learn` | Record a pattern or observation |
| `/superpowers-ecc:learn-eval` | Evaluate instinct confidence |
| `/superpowers-ecc:evolve` | Promote instincts to skills |
| `/superpowers-ecc:instinct-status` | Show instinct scores |
| `/superpowers-ecc:instinct-import` | Import instincts |
| `/superpowers-ecc:instinct-export` | Export instincts |

### Orchestration

| Command | Description |
|---------|-------------|
| `/superpowers-ecc:multi-plan` | Plan across multiple worktrees |
| `/superpowers-ecc:multi-execute` | Execute across multiple worktrees |

### Session

| Command | Description |
|---------|-------------|
| `/superpowers-ecc:sessions` | List and manage sessions |
| `/superpowers-ecc:checkpoint` | Save session state for later restore |

### Optimization

| Command | Description |
|---------|-------------|
| `/superpowers-ecc:model-route` | Route tasks to appropriate model tiers |

## Cross-Platform Support

| Platform | Status | Notes |
|----------|--------|-------|
| Claude Code | Primary | Full support via plugin system |
| Cursor | Supported | Rules in `.cursor/rules/`, hooks in `.cursor/hooks.json` |
| OpenCode | Supported | Rules in `.opencode/rules/` |
| Codex CLI | Supported | Instructions in `.codex/AGENTS.md` |

## Configuration

### Language Rules

Install language-specific rule sets with:

```bash
./install.sh typescript   # TypeScript rules
./install.sh python       # Python rules
./install.sh golang       # Go rules
```

The `common` rule set is always active and covers coding style, git workflow, testing, security, performance, and agent coordination.

### MCP Servers

MCP server configurations are in `mcp-configs/mcp-servers.json`. Copy or merge into your project's `.mcp.json` to enable tool integrations.

## Credits

Built on [superpowers](https://github.com/obra/superpowers) by Jesse Vincent and [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa.

## License

MIT
