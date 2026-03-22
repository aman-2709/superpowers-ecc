---
description: "Export instincts to a portable JSON file for sharing or backup"
---

# /instinct-export - Export Instincts

Exports instincts to a shareable JSON file. Useful for:
- Sharing with teammates
- Transferring to a new machine
- Backing up learned patterns

## Usage

```
/instinct-export                              # Export all instincts to stdout
/instinct-export --output my-instincts.json   # Export to file
/instinct-export --domain testing             # Export only testing instincts
/instinct-export --min-confidence 0.7         # Only export high-confidence instincts
```

## What to Do

1. Load all instincts from `~/.claude/superpowers-ecc/instincts/` using `state/store.js`:
   - `store.list('instincts')` to enumerate files
   - `store.read('instincts/<file>')` for each
2. Apply filters (`--domain`, `--min-confidence`)
3. Write JSON export to file (or display to stdout if no `--output` provided)

## Output Format

Creates a JSON file:

```json
{
  "exported_at": "2026-03-22T12:00:00Z",
  "source": "superpowers-ecc",
  "count": 12,
  "filters": {
    "domain": null,
    "min_confidence": null
  },
  "instincts": [
    {
      "id": "prefer-functional-style",
      "trigger": "when writing new functions",
      "action": "Use functional patterns over classes when appropriate",
      "confidence": 0.8,
      "domain": "code-style",
      "evidence": [
        "Observed 5 instances of functional pattern preference"
      ],
      "created_at": "2026-03-15T10:00:00Z",
      "updated_at": "2026-03-22T12:00:00Z"
    }
  ]
}
```

## Flags

- `--domain <name>`: Export only instincts with the specified domain
- `--min-confidence <n>`: Minimum confidence threshold (0.0-1.0)
- `--output <file>`: Output file path (prints to stdout when omitted)

## Notes

- Only instincts are exported -- raw session data is never included
- No actual code or conversation content is stored in instincts
- Exported files are compatible with `/instinct-import`
