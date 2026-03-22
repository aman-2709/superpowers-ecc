---
description: "Cluster related instincts and evolve them into skills, commands, or agents"
---

# /evolve - Evolve Instincts into Higher-Level Structures

Analyzes instincts and clusters related ones into higher-level structures:
- **Commands**: When instincts describe user-invoked actions
- **Skills**: When instincts describe auto-triggered behaviors
- **Agents**: When instincts describe complex, multi-step processes

## Usage

```
/evolve                    # Analyze all instincts and suggest evolutions
/evolve --generate         # Also generate files for evolved artifacts
```

## Evolution Rules

### Cluster -> Command (User-Invoked)
When instincts describe actions a user would explicitly request:
- Multiple instincts about "when user asks to..."
- Instincts with triggers like "when creating a new X"
- Instincts that follow a repeatable sequence

Example:
- `new-table-step1`: "when adding a database table, create migration"
- `new-table-step2`: "when adding a database table, update schema"
- `new-table-step3`: "when adding a database table, regenerate types"

-> Creates: `/new-table` command

### Cluster -> Skill (Auto-Triggered)
When instincts describe behaviors that should happen automatically:
- Pattern-matching triggers
- Error handling responses
- Code style enforcement

Example:
- `prefer-functional`: "when writing functions, prefer functional style"
- `use-immutable`: "when modifying state, use immutable patterns"
- `avoid-classes`: "when designing modules, avoid class-based design"

-> Creates: `functional-patterns` skill

### Cluster -> Agent (Needs Depth/Isolation)
When instincts describe complex, multi-step processes that benefit from isolation:
- Debugging workflows
- Refactoring sequences
- Research tasks

Example:
- `debug-step1`: "when debugging, first check logs"
- `debug-step2`: "when debugging, isolate the failing component"
- `debug-step3`: "when debugging, create minimal reproduction"
- `debug-step4`: "when debugging, verify fix with test"

-> Creates: `debugger` agent

## What to Do

1. Read all instincts from `~/.claude/superpowers-ecc/instincts/` using `state/store.js`:
   - `store.list('instincts')` to enumerate files
   - `store.read('instincts/<file>')` for each
2. Group instincts by trigger/domain patterns
3. Identify clusters of 3+ related instincts with confidence >= 0.5
4. Classify each cluster:
   - **Skill candidates**: trigger clusters with auto-triggered behaviors
   - **Command candidates**: high-confidence workflow instincts with user-invoked actions
   - **Agent candidates**: larger clusters describing multi-step processes
5. Present analysis and ask for confirmation before generating

## Output Format

```
============================================================
  EVOLVE ANALYSIS - 12 instincts
============================================================

High confidence instincts (>=50%): 8

## SKILL CANDIDATES (1)
  1. Cluster: "functional-patterns"
     Instincts: 3
     Avg confidence: 73%
     Domain: code-style
     - prefer-functional (0.8)
     - use-immutable (0.7)
     - avoid-classes (0.7)

## COMMAND CANDIDATES (1)
  1. /new-table
     From: 3 instincts
     Avg confidence: 84%
     - new-table-step1 (0.85)
     - new-table-step2 (0.80)
     - new-table-step3 (0.87)

## AGENT CANDIDATES (1)
  1. debugger
     Covers 4 instincts
     Avg confidence: 72%
     - debug-step1 (0.8)
     - debug-step2 (0.7)
     - debug-step3 (0.65)
     - debug-step4 (0.7)

============================================================
  Use /evolve --generate to create evolved artifacts.
============================================================
```

## Generated File Formats

When `--generate` is passed, write evolved artifacts:

### Command
```markdown
---
description: "Create a new database table with migration, schema update, and type generation"
evolved_from:
  - new-table-migration
  - update-schema
  - regenerate-types
---

# New Table Command

[Generated content based on clustered instincts]

## Steps
1. ...
2. ...
```

### Skill (SKILL.md)
```markdown
---
name: functional-patterns
description: Enforce functional programming patterns
evolved_from:
  - prefer-functional
  - use-immutable
  - avoid-classes
---

# Functional Patterns Skill

[Generated content based on clustered instincts]
```

### Agent
```markdown
---
name: debugger
description: Systematic debugging agent
evolved_from:
  - debug-check-logs
  - debug-isolate
  - debug-reproduce
---

# Debugger Agent

[Generated content based on clustered instincts]
```

## Flags

- `--generate`: Generate evolved files in addition to analysis output

## Notes

- Only instincts with confidence >= 0.5 are candidates for evolution
- Clusters need at least 3 related instincts to be considered
- Generated artifacts are placed in the current project's commands/, skills/, or agents/ directory
- Source instincts are preserved (not deleted) after evolution
