---
description: "Show all learned instincts grouped by domain with confidence scores"
---

# /instinct-status - View Learned Instincts

Shows all learned instincts, grouped by domain with confidence bars and observation stats.

## Usage

```
/instinct-status
```

## What to Do

1. Read all instinct files from `~/.claude/superpowers-ecc/instincts/` using `state/store.js`:
   - `store.list('instincts')` to get all instinct JSON files
   - `store.read('instincts/<file>')` for each file
   - Also read `instincts/index.json` for the registry
2. Group instincts by domain
3. Sort by confidence within each domain (highest first)
4. Display with confidence bars, evidence count, and timestamps

## Output Format

```
============================================================
  INSTINCT STATUS - 12 total
============================================================

  ## CODE-STYLE (3)
    ███████░░░  70%  prefer-functional-style
              trigger: when writing new functions
              evidence: 5 observations | updated: 2026-03-22

    █████░░░░░  50%  use-const-over-let
              trigger: when declaring variables
              evidence: 3 observations | updated: 2026-03-20

  ## TESTING (2)
    █████████░  85%  test-first-workflow
              trigger: when implementing new features
              evidence: 8 observations | updated: 2026-03-21

  ## DEBUGGING (1)
    ███░░░░░░░  30%  check-logs-first
              trigger: when debugging failures
              evidence: 1 observation | updated: 2026-03-22

============================================================
  Confidence: 0.3=tentative  0.5=moderate  0.7=strong  0.9=near-certain
============================================================
```

## Confidence Bar Rendering

Map confidence (0.0-1.0) to a 10-character bar:

| Confidence | Bar |
|------------|-----|
| 0.3 | `███░░░░░░░` |
| 0.5 | `█████░░░░░` |
| 0.7 | `███████░░░` |
| 0.9 | `█████████░` |
| 1.0 | `██████████` |

## Empty State

If no instincts exist yet:

```
============================================================
  INSTINCT STATUS - 0 total
============================================================

  No instincts learned yet.

  Run /learn after solving a non-trivial problem to extract
  your first instinct, or /instinct-import to load instincts
  from a file.
============================================================
```
