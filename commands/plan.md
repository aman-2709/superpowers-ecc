---
description: "Alias for /write-plan — create a detailed implementation plan with bite-sized tasks"
---

This command is an alias for `/write-plan` — identical behavior, shorter name. Invokes the **superpowers-ecc:writing-plans** skill.

Use `/plan` when you have an approved spec or clear requirements and need to break them into implementable tasks with exact file paths, code, and verification steps.

## Interactive vs. Delegated Planning

- **`/plan` (this command)** — Interactive planning via the `writing-plans` skill. You collaborate with Claude to break work into bite-sized tasks with exact file paths and verification steps. Recommended for most work.
- **`planner` agent** — Fully delegated planning. Dispatches the standalone `planner.md` agent to generate a plan autonomously. Use when you want to hand off planning entirely (e.g., dispatching via subagent-driven-development).
