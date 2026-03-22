# superpowers-ecc

A focused Claude Code plugin merging superpowers workflow discipline with curated ECC tooling.

## Quick Start

```bash
/plugin marketplace add https://github.com/aman-2709/superpowers-ecc
/plugin install superpowers-ecc@superpowers-ecc
```

## What's Included

| Component | Count | Details |
|-----------|-------|---------|
| Skills | 24 | 14 workflow + 10 tooling |
| Standalone agents | 7 | Domain consultants (planner, architect, etc.) |
| Slash commands | 24 | Workflow, quality, security, learning, orchestration |
| Rule sets | 4 | common + typescript + python + golang |
| Session persistence | -- | Checkpoint/restore with learning system |
| Cross-platform | 4 | Claude Code, Cursor, OpenCode, Codex CLI |

## Workflow Overview

The plugin enforces a 7-step development loop:

```
brainstorm -> worktree -> plan -> implement (subagent-driven) -> review -> verify -> merge
```

Each step has a dedicated skill with guardrails. The `/plan` command wires together brainstorming, planning, and execution into a single coordinated flow.

## Two-Layer Agent Architecture

| Layer | Purpose | Examples |
|-------|---------|----------|
| Embedded subagent prompts | Execution machinery | implementer, spec-reviewer, quality-reviewer |
| Standalone agents | Domain consultants | planner, architect, security-reviewer, build-error-resolver |

Embedded prompts are invoked automatically during `/execute-plan`. Standalone agents are called on-demand via their slash commands or by other skills that need specialist input.

## Learning System

The continuous learning system observes patterns across sessions and codifies them as **instincts** -- lightweight heuristics that evolve over time.

**Lifecycle:** observe patterns -> score confidence -> evolve into skills

| Command | Purpose |
|---------|---------|
| `/learn` | Record an observation or pattern |
| `/learn-eval` | Evaluate and score recorded instincts |
| `/evolve` | Promote high-confidence instincts to skills |
| `/instinct-status` | Show current instincts and their confidence scores |
| `/instinct-import` | Import instincts from a file |
| `/instinct-export` | Export instincts to a file |

## Commands Reference

### Workflow

| Command | Description |
|---------|-------------|
| `/brainstorm` | Structured ideation with spec document output |
| `/write-plan` | Generate an implementation plan from a spec |
| `/execute-plan` | Run a plan via subagent-driven implementation |
| `/plan` | End-to-end: brainstorm, plan, and execute |

### Quality

| Command | Description |
|---------|-------------|
| `/tdd` | Test-driven development cycle |
| `/code-review` | Request a code review |
| `/verify` | Run verification checks before completion |
| `/quality-gate` | Enforce quality standards on changes |
| `/test-coverage` | Analyze and report test coverage |

### Security

| Command | Description |
|---------|-------------|
| `/security-scan` | Run security review on code changes |

### Agents

| Command | Description |
|---------|-------------|
| `/build-fix` | Invoke build-error-resolver agent |
| `/refactor-clean` | Invoke refactor-cleaner agent |
| `/e2e` | Invoke e2e-runner agent |

### Learning

| Command | Description |
|---------|-------------|
| `/learn` | Record a pattern or observation |
| `/learn-eval` | Evaluate instinct confidence |
| `/evolve` | Promote instincts to skills |
| `/instinct-status` | Show instinct scores |
| `/instinct-import` | Import instincts |
| `/instinct-export` | Export instincts |

### Orchestration

| Command | Description |
|---------|-------------|
| `/multi-plan` | Plan across multiple worktrees |
| `/multi-execute` | Execute across multiple worktrees |

### Session

| Command | Description |
|---------|-------------|
| `/sessions` | List and manage sessions |
| `/checkpoint` | Save session state for later restore |

### Optimization

| Command | Description |
|---------|-------------|
| `/model-route` | Route tasks to appropriate model tiers |

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
