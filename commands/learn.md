---
description: "Analyze the current session and extract reusable patterns as instincts"
---

# /learn - Extract Reusable Patterns

Analyze the current session and extract any patterns worth saving as instincts.

## Trigger

Run `/learn` at any point during a session when you've solved a non-trivial problem.

## What to Extract

Look for:

1. **Error Resolution Patterns**
   - What error occurred?
   - What was the root cause?
   - What fixed it?
   - Is this reusable for similar errors?

2. **Debugging Techniques**
   - Non-obvious debugging steps
   - Tool combinations that worked
   - Diagnostic patterns

3. **Workarounds**
   - Library quirks
   - API limitations
   - Version-specific fixes

4. **Codebase Patterns**
   - Conventions discovered
   - Architecture decisions made
   - Integration patterns

## Output Format

Create an instinct JSON file at `~/.claude/superpowers-ecc/instincts/<id>.json`:

```json
{
  "id": "pattern-name",
  "trigger": "when [condition that activates this pattern]",
  "action": "Description of what to do",
  "confidence": 0.3,
  "domain": "code-style|testing|git|debugging|workflow|security|tooling",
  "evidence": [
    "Observed: [what happened in this session]"
  ],
  "created_at": "2026-03-22T10:00:00Z",
  "updated_at": "2026-03-22T10:00:00Z"
}
```

## Process

1. Review the session for extractable patterns
2. Identify the most valuable/reusable insight
3. Check if a matching instinct already exists in `~/.claude/superpowers-ecc/instincts/`:
   - If it exists, update its confidence (increment toward next tier) and append new evidence
   - If new, create an instinct with confidence 0.3 (tentative)
4. Draft the instinct JSON
5. Ask user to confirm before saving
6. Write via `state/store.js`:
   - `store.write('instincts/<id>.json', instinct)`
   - Update `instincts/index.json` with the new/updated entry

## Confidence Tiers

| Score | Meaning |
|-------|---------|
| 0.3 | Tentative -- suggested but not enforced |
| 0.5 | Moderate -- applied when relevant |
| 0.7 | Strong -- auto-approved for application |
| 0.9 | Near-certain -- core behavior |

## Notes

- Don't extract trivial fixes (typos, simple syntax errors)
- Don't extract one-time issues (specific API outages, etc.)
- Focus on patterns that will save time in future sessions
- Keep instincts focused -- one trigger, one action per instinct
- Use descriptive kebab-case IDs (e.g., `grep-before-edit`, `validate-user-input`)
