# Contributing to superpowers-ecc

## Project Structure

```
skills/          # Skill directories (each with SKILL.md)
agents/          # Standalone agent prompts (.md)
commands/        # Slash commands (.md with frontmatter)
rules/           # Language-specific rules (common/, typescript/, python/, golang/)
hooks/           # Session hooks
tests/           # Automated tests (Node.js, no deps)
```

## Adding Content

### Skills

1. Create a directory under `skills/` (e.g., `skills/my-skill/`)
2. Add a `SKILL.md` with YAML frontmatter:
   ```markdown
   ---
   name: my-skill
   description: One-line description of what the skill does.
   ---
   # Skill content here
   ```
3. Optionally add supporting files in the same directory.

### Agents

Add a `.md` file to `agents/` (e.g., `agents/my-agent.md`). The file contains the full system prompt for the standalone agent.

### Commands

Add a `.md` file to `commands/` with YAML frontmatter:
```markdown
---
description: "One-line description shown in /help"
---
Command instructions here.
```

### Rules

Add a `.md` file to the appropriate `rules/` subdirectory:
- `rules/common/` — language-agnostic rules
- `rules/typescript/`, `rules/python/`, `rules/golang/` — language-specific

## Development

### Prerequisites

- Node.js >= 18
- No npm dependencies required for core functionality

### Running Tests

```bash
npm test
```

All tests use plain Node.js (`node:assert`, `node:test`) with zero external dependencies.

### Code Style

- ES modules (`import`/`export`, not `require`)
- No npm dependencies for core — stdlib only
- Keep files focused and small
- Explicit over clever

## Pull Request Process

1. Fork the repo and create a feature branch
2. Make your changes
3. Run `npm test` and ensure all tests pass
4. Open a PR against `main` with a clear description
5. One approval required before merge

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
