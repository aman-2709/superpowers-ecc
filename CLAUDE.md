# superpowers-ecc

Plugin combining superpowers workflow discipline with curated ECC tooling.

## Structure
- `skills/` — 24 standalone skills (superpowers SKILL.md format)
- `agents/` — 7 standalone domain-expert agents
- `commands/` — 24 slash commands
- `rules/` — Language-specific rule sets (common, typescript, python, golang)
- `hooks/` — Session persistence and compaction hooks
- `state/` — JSON state persistence library

## Key Concepts
- Skills use superpowers naming and SKILL.md format
- Two-layer agent architecture: embedded subagent prompts (execution) + standalone agents (consultation)
- State persisted as JSON in ~/.claude/superpowers-ecc/
