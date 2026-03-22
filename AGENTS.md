# Agents

superpowers-ecc uses a two-layer agent architecture.

## Layer 1: Embedded Subagent Prompts (Execution)

Task-scoped prompts inside skills, dispatched automatically during plan execution by `subagent-driven-development`:

- `implementer-prompt.md` — Implements a single task from the plan
- `spec-reviewer-prompt.md` — Reviews implementation against spec requirements
- `code-quality-reviewer-prompt.md` — Reviews code quality and maintainability

These are **execution machinery**. They run as part of the workflow loop with tightly scoped context.

## Layer 2: Standalone Agents (Consultation)

Domain-expert agents in `agents/`, dispatched on-demand via commands or user request:

| Agent | Command | Purpose |
|---|---|---|
| `planner.md` | `/plan` | Feature implementation planning |
| `architect.md` | — | System design decisions |
| `code-reviewer.md` | `/code-review` | Code quality review |
| `security-reviewer.md` | `/security-scan` | Vulnerability analysis |
| `build-error-resolver.md` | `/build-fix` | Build failure resolution |
| `refactor-cleaner.md` | `/refactor-clean` | Dead code removal |
| `e2e-runner.md` | `/e2e` | Playwright E2E testing |

These are **consultants**. Call them when you need domain expertise outside the workflow loop.

## When to Use Which

- **Building features with a plan?** → Embedded prompts run automatically via subagent-driven-development
- **Need a security audit?** → `/security-scan` dispatches the standalone security-reviewer
- **Build broken?** → `/build-fix` dispatches the standalone build-error-resolver
- **Want code reviewed?** → `/code-review` triggers the requesting-code-review skill, which dispatches the code-reviewer agent
