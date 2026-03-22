# Changelog

## [1.0.0] - 2026-03-22

### Added
- 24 skills (14 from superpowers, 10 from ECC/new)
- 7 standalone agents (planner, architect, code-reviewer, security-reviewer, build-error-resolver, refactor-cleaner, e2e-runner)
- 24 slash commands covering workflow, quality, security, learning, and orchestration
- JSON state persistence for sessions and instincts (~/.claude/superpowers-ecc/)
- Session hooks (PreToolUse start, Stop end, Notification pre-compact, Stop suggest-compact)
- Rules: common (9), typescript (5), python (5), golang (5)
- Cross-platform: Claude Code (primary), Cursor, OpenCode, Codex CLI
- MCP server configs (GitHub, context7, sequential-thinking)
- 30 automated tests
- Two-layer agent architecture: embedded subagent prompts + standalone agents

### Merged
- TDD skills: superpowers discipline + ECC coverage targets + anti-patterns + verification-loop
- Planning: /plan aliases /write-plan, planner agent for delegated planning
- Subagent execution: iterative-retrieval sub-technique for long-running tasks

### Credits
- Workflow backbone from [superpowers](https://github.com/obra/superpowers) by Jesse Vincent
- Tooling from [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa
