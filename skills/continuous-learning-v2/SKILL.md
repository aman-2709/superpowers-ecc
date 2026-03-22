---
name: continuous-learning-v2
description: Use when extracting reusable patterns from sessions into instincts with confidence scoring for cross-session learning
---

# Continuous Learning v2 - Instinct-Based Architecture

A learning system that turns Claude Code sessions into reusable knowledge through atomic "instincts" -- small learned behaviors with confidence scoring.

## When to Activate

- Extracting patterns from completed sessions into reusable instincts
- Reviewing, tuning, or curating learned instincts
- Evolving instincts into full skills, commands, or agents
- Exporting or importing instinct libraries
- Evaluating what the system has learned

## The Instinct Model

An instinct is a small, atomic learned behavior stored as JSON:

```json
{
  "id": "prefer-functional-style",
  "trigger": "when writing new functions",
  "action": "Use functional patterns over classes when appropriate",
  "confidence": 0.7,
  "domain": "code-style",
  "evidence": [
    "Observed 5 instances of functional pattern preference",
    "User corrected class-based approach to functional on 2026-01-15"
  ],
  "created_at": "2026-03-22T10:00:00Z",
  "updated_at": "2026-03-22T12:00:00Z"
}
```

**Properties:**
- **Atomic** -- one trigger, one action
- **Confidence-weighted** -- 0.3 = tentative, 0.9 = near certain
- **Domain-tagged** -- code-style, testing, git, debugging, workflow, etc.
- **Evidence-backed** -- tracks what observations created it

## How It Works

```
Session Activity
      |
      | SessionStart / Stop hooks capture session boundaries
      | via session-start.js and session-end.js
      v
+---------------------------------------------+
|  ~/.claude/superpowers-ecc/sessions/         |
|   <session-id>.json  (session summary)       |
|   index.json         (session registry)      |
+---------------------------------------------+
      |
      | /learn command analyzes session patterns
      v
+---------------------------------------------+
|          PATTERN DETECTION                   |
|   * User corrections -> instinct             |
|   * Error resolutions -> instinct            |
|   * Repeated workflows -> instinct           |
+---------------------------------------------+
      |
      | Creates/updates via state/store.js
      v
+---------------------------------------------+
|  ~/.claude/superpowers-ecc/instincts/        |
|   <instinct-id>.json  (individual instincts) |
|   index.json          (registry + scores)    |
+---------------------------------------------+
      |
      | /evolve clusters related instincts
      v
+---------------------------------------------+
|  Evolved artifacts (skills/commands/agents)  |
+---------------------------------------------+
```

## State Storage

All state lives under `~/.claude/superpowers-ecc/` as JSON files managed by `state/store.js`:

```
~/.claude/superpowers-ecc/
+-- instincts/
|   +-- <instinct-id>.json    # Individual instinct files
|   +-- index.json            # Registry with confidence scores
+-- sessions/
|   +-- <session-id>.json     # Session summaries
|   +-- index.json            # Session history
+-- config.json               # Global configuration
```

**Store API** (from `state/store.js`):
- `store.read('instincts/<id>.json')` -- read an instinct
- `store.write('instincts/<id>.json', data)` -- write an instinct (atomic)
- `store.list('instincts')` -- list all instinct files
- `store.delete('instincts/<id>.json')` -- remove an instinct
- `store.generateId()` -- create a UUID for new instincts

## Commands

| Command | Description |
|---------|-------------|
| `/instinct-status` | Show all instincts grouped by domain with confidence scores |
| `/evolve` | Cluster related instincts into skills, commands, or agents |
| `/instinct-export` | Export instincts to a portable JSON file |
| `/instinct-import <file>` | Import instincts from an exported file |
| `/learn` | Analyze the current or recent session and extract instincts |
| `/learn-eval` | Evaluate what the system has learned; review instinct quality |

### `/instinct-status`

Read all instinct files from `~/.claude/superpowers-ecc/instincts/`. Display grouped by domain, sorted by confidence. Show:
- Instinct ID and trigger
- Confidence score with meaning (tentative/moderate/strong/near-certain)
- Evidence count
- Last updated timestamp

### `/learn`

Analyze the current session (or a specified session from `sessions/`) for patterns:

1. Look for **user corrections** -- where the user redirected your approach
2. Look for **error resolutions** -- what worked after something failed
3. Look for **repeated workflows** -- sequences the user follows consistently

For each pattern found:
- Check if a matching instinct already exists (update confidence + evidence)
- If new, create an instinct with confidence 0.3 (tentative)
- Write via `store.write('instincts/<id>.json', instinct)`
- Update `instincts/index.json` with the new entry

### `/evolve`

Cluster related instincts and propose evolution:
1. Group instincts by domain
2. Identify clusters of 3+ related instincts with confidence >= 0.5
3. Propose evolution into a skill, command, or agent
4. If approved, generate the evolved artifact

### `/learn-eval`

Review the quality of learned instincts:
- Flag low-confidence instincts that haven't been reinforced
- Identify contradicting instincts
- Suggest instincts to retire (stale, low confidence, no recent evidence)
- Show overall learning health metrics

### `/instinct-export`

Export instincts to a JSON file:
```json
{
  "exported_at": "2026-03-22T12:00:00Z",
  "instincts": [ ... ]
}
```
Filterable by domain or minimum confidence threshold.

### `/instinct-import <file>`

Import instincts from an exported file:
- Merge with existing instincts (matching by ID)
- Imported instincts start at confidence 0.3 unless they match an existing instinct
- Conflicts are flagged for manual resolution

## Confidence Scoring

Confidence evolves over time:

| Score | Meaning | Behavior |
|-------|---------|----------|
| 0.3 | Tentative | Suggested but not enforced |
| 0.5 | Moderate | Applied when relevant |
| 0.7 | Strong | Auto-approved for application |
| 0.9 | Near-certain | Core behavior |

**Confidence increases** when:
- Pattern is repeatedly observed across sessions
- User doesn't correct the suggested behavior
- Similar instincts from imported sources agree

**Confidence decreases** when:
- User explicitly corrects the behavior
- Pattern isn't observed for extended periods
- Contradicting evidence appears

## Scope Decision Guide

Use domain tags to categorize instincts:

| Domain | Examples |
|--------|---------|
| `code-style` | "Use functional style", "Prefer const over let" |
| `testing` | "Write tests first", "Use table-driven tests" |
| `git` | "Conventional commits", "Small focused commits" |
| `debugging` | "Grep before Edit", "Read before Write" |
| `workflow` | "Always handle errors", "Validate user input" |
| `security` | "Sanitize SQL", "Never commit secrets" |
| `tooling` | "Use ripgrep over grep", "Prefer Edit over Write" |

## Evolution Path

Instincts are the atomic unit. They evolve into larger structures:

```
Instincts (atomic behaviors)
    |
    | cluster by domain + relatedness
    v
Clusters (3+ related instincts)
    |
    | evolve into one of:
    v
+-- Skills    (SKILL.md -- process documentation)
+-- Commands  (slash commands -- automated workflows)
+-- Agents    (agent definitions -- specialized assistants)
```

The `/evolve` command guides this process. Only instincts with confidence >= 0.5 are candidates for evolution.

## Session Observation

Session data is captured at session boundaries (not per-tool-use):

- **`session-start.js`** (SessionStart hook) -- records session start time and context
- **`session-end.js`** (Stop hook) -- records session summary, duration, and key actions

Session files are stored in `~/.claude/superpowers-ecc/sessions/` and serve as the raw material for the `/learn` command.

## Privacy

- All data stays **local** on your machine
- Only **instincts** (patterns) can be exported -- not raw session data
- No actual code or conversation content is stored in instincts
- You control what gets exported via domain/confidence filters

---

*Instinct-based learning: teaching Claude your patterns, one session at a time.*
