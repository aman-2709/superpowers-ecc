---
description: "Extract reusable patterns from the session with a quality gate before saving as instincts"
---

# /learn-eval - Extract, Evaluate, then Save

Extends `/learn` with a quality gate and knowledge-placement awareness before writing any instinct.

## What to Extract

Look for:

1. **Error Resolution Patterns** -- root cause + fix + reusability
2. **Debugging Techniques** -- non-obvious steps, tool combinations
3. **Workarounds** -- library quirks, API limitations, version-specific fixes
4. **Codebase Patterns** -- conventions, architecture decisions, integration patterns

## Process

1. Review the session for extractable patterns
2. Identify the most valuable/reusable insight

3. Draft the instinct JSON:

```json
{
  "id": "pattern-name",
  "trigger": "when [condition]",
  "action": "What to do -- with code examples if applicable",
  "confidence": 0.3,
  "domain": "code-style|testing|git|debugging|workflow|security|tooling",
  "evidence": [
    "Observed: [what happened in this session]"
  ],
  "created_at": "2026-03-22T10:00:00Z",
  "updated_at": "2026-03-22T10:00:00Z"
}
```

4. **Quality gate -- Checklist + Holistic verdict**

   ### 4a. Required checklist (verify by actually reading files)

   Execute **all** of the following before evaluating the draft:

   - [ ] Read existing instincts in `~/.claude/superpowers-ecc/instincts/` to check for content overlap
   - [ ] Check CLAUDE.md (both project and global) for overlap
   - [ ] Consider whether updating an existing instinct's evidence would suffice
   - [ ] Confirm this is a reusable pattern, not a one-off fix

   ### 4b. Holistic verdict

   Synthesize the checklist results and draft quality, then choose **one** of the following:

   | Verdict | Meaning | Next Action |
   |---------|---------|-------------|
   | **Save** | Unique, specific, well-scoped | Proceed to Step 5 |
   | **Improve then Save** | Valuable but needs refinement | List improvements, revise, re-evaluate (once) |
   | **Absorb into [X]** | Should be merged into an existing instinct | Show target instinct and additions, proceed to Step 5 |
   | **Drop** | Trivial, redundant, or too abstract | Explain reasoning and stop |

   **Guideline dimensions** (informing the verdict, not scored):

   - **Specificity & Actionability**: Contains concrete code examples or commands
   - **Scope Fit**: Trigger, action, and domain are aligned and focused on a single pattern
   - **Uniqueness**: Provides value not covered by existing instincts
   - **Reusability**: Realistic trigger scenarios exist in future sessions

5. **Verdict-specific confirmation flow**

   - **Improve then Save**: Present improvements + revised draft + updated checklist/verdict; if revised verdict is **Save**, save after confirmation, otherwise follow new verdict
   - **Save**: Present instinct file path + checklist results + 1-line verdict rationale + full draft, save after user confirmation
   - **Absorb into [X]**: Present target instinct path + changes (new evidence, adjusted confidence) + checklist results + verdict rationale, update after user confirmation
   - **Drop**: Show checklist results + reasoning only (no confirmation needed)

6. Save / Absorb to `~/.claude/superpowers-ecc/instincts/` via `state/store.js`
   - `store.write('instincts/<id>.json', instinct)`
   - Update `instincts/index.json` with the new/updated entry

## Output Format for Step 4

```
### Checklist
- [x] Existing instincts: no overlap (or: overlap found with [X])
- [x] CLAUDE.md: no overlap (or: overlap found)
- [x] Existing instinct update: new instinct appropriate (or: should absorb into [X])
- [x] Reusability: confirmed (or: one-off, Drop)

### Verdict: Save / Improve then Save / Absorb into [X] / Drop

**Rationale:** (1-2 sentences explaining the verdict)
```

## Notes

- Don't extract trivial fixes (typos, simple syntax errors)
- Don't extract one-time issues (specific API outages, etc.)
- Focus on patterns that will save time in future sessions
- Keep instincts focused -- one trigger, one action per instinct
- When the verdict is Absorb, update the existing instinct's evidence and confidence rather than creating a new file
