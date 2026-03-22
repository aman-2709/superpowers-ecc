---
description: "Import instincts from a JSON file into the local instinct library"
---

# /instinct-import - Import Instincts

Import instincts from a local JSON file or URL.

## Usage

```
/instinct-import instincts-export.json
/instinct-import https://example.com/team-instincts.json
/instinct-import instincts-export.json --dry-run
/instinct-import instincts-export.json --min-confidence 0.7
/instinct-import instincts-export.json --force
```

## What to Do

1. Fetch the instinct file (local path or URL)
2. Parse and validate the JSON format -- expected shape:
   ```json
   {
     "exported_at": "2026-03-22T12:00:00Z",
     "instincts": [
       {
         "id": "pattern-name",
         "trigger": "when [condition]",
         "action": "what to do",
         "confidence": 0.7,
         "domain": "code-style",
         "evidence": ["..."]
       }
     ]
   }
   ```
3. Apply `--min-confidence` filter if specified
4. Check for duplicates with existing instincts in `~/.claude/superpowers-ecc/instincts/`
5. Categorize as New, Update (import has higher confidence), or Skip (local is equal/higher)
6. Show summary and ask for confirmation (unless `--force`)
7. Write instincts via `state/store.js`:
   - `store.write('instincts/<id>.json', instinct)` for each
   - Update `instincts/index.json` with new/updated entries

## Import Process Output

```
Importing instincts from: team-instincts.json
================================================

Found 12 instincts to import.

Analyzing conflicts...

## New Instincts (8)
These will be added:
  + use-zod-validation (confidence: 0.7)
  + prefer-named-exports (confidence: 0.65)
  + test-async-functions (confidence: 0.8)
  ...

## Duplicate Instincts (3)
Already have similar instincts:
  ~ prefer-functional-style
     Local: 0.8 confidence, 12 observations
     Import: 0.7 confidence
     -> Keep local (higher confidence)

  ~ test-first-workflow
     Local: 0.75 confidence
     Import: 0.9 confidence
     -> Update to import (higher confidence)

## Skipped (1)
  - trivial-pattern (below --min-confidence threshold)

Import 8 new, update 1?
```

## Merge Behavior

When importing an instinct with an existing ID:
- Higher-confidence import becomes an update candidate
- Equal/lower-confidence import is skipped
- Evidence arrays are merged (deduplicated) on update
- User confirms unless `--force` is used

## Source Tracking

Imported instincts are marked with:
```json
{
  "source": "imported",
  "imported_from": "team-instincts.json",
  "imported_at": "2026-03-22T12:00:00Z"
}
```

## Flags

- `--dry-run`: Preview without importing
- `--force`: Skip confirmation prompt
- `--min-confidence <n>`: Only import instincts above threshold

## Completion Output

```
Import complete!

Added: 8 instincts
Updated: 1 instinct
Skipped: 3 instincts (equal/higher confidence already exists)

Instincts saved to: ~/.claude/superpowers-ecc/instincts/

Run /instinct-status to see all instincts.
```
