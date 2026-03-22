# Superpowers-ECC for Codex CLI

Two-layer architecture: superpowers (core skills) + ECC (agents, commands, hooks).

## Agents

Defined in `agents/`. Dispatch via subagent when tasks match:

| Agent | Model | Purpose |
|-------|-------|---------|
| architect | opus | System design, scalability, technical decisions |
| planner | opus | Feature planning, complex refactoring strategy |
| code-reviewer | sonnet | Code quality, security, maintainability review |
| security-reviewer | sonnet | OWASP Top 10, secrets, injection, unsafe crypto |
| build-error-resolver | sonnet | Fix build/type errors with minimal diffs |
| refactor-cleaner | sonnet | Dead code removal, consolidation, cleanup |
| e2e-runner | sonnet | E2E testing with browser automation |

## Key Skills

Skills in `skills/`. Load as needed:

- **using-superpowers-ecc** -- Bootstrap; auto-loaded
- **test-driven-development** -- TDD workflow with 80%+ coverage
- **systematic-debugging** -- Structured debugging methodology
- **security-review** -- Security audit checklist
- **strategic-compact** -- Context management for long sessions
- **verification-before-completion** -- Build, test, lint, typecheck gate
- **writing-plans** / **executing-plans** -- Plan-then-execute workflow
- **subagent-driven-development** -- Multi-agent task decomposition

## Key Differences from Claude Code

| Feature | Claude Code | Codex CLI |
|---------|------------|-----------|
| Hooks | session-start, session-end, pre-compact, suggest-compact | Not supported |
| Context | CLAUDE.md + plugin | AGENTS.md only |
| Skills | Plugin auto-discovery | `skills/` directory |
| Agents | Task tool subagents | Multi-agent via `[agents.<name>]` |

## Security Without Hooks

1. Validate inputs at system boundaries
2. Never hardcode secrets -- use environment variables
3. Run `npm audit` / `pip audit` before committing
4. Review `git diff` before every push
