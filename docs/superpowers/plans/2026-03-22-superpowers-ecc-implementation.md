# superpowers-ecc Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a focused Claude Code plugin merging superpowers' 14 workflow skills with 10 curated ECC additions, 7 agents, 24 commands, JSON state persistence, and cross-platform support.

**Architecture:** Superpowers' skill/manifest structure is the foundation. ECC components are ported into that structure. `state/store.js` provides JSON-backed persistence (replacing ECC's SQLite). Hook scripts wire into the state layer for session and learning continuity.

**Tech Stack:** Node.js >=18, no npm dependencies. Markdown skills/agents/commands. JSON for state persistence. Shell scripts for installation.

**Source directories:**
- Superpowers: `/home/xl4/dev/personal-projects/superpowers/`
- ECC: `/home/xl4/dev/personal-projects/everything-claude-code/`
- Target: `/home/xl4/dev/personal-projects/superpowers-ecc/`

**Spec:** `docs/superpowers/specs/2026-03-22-superpowers-ecc-design.md`

---

## Phase 1 — Foundation

### Task 1: Initialize repository scaffolding

**Files:**
- Create: `package.json`
- Create: `.claude-plugin/plugin.json`
- Create: `.claude-plugin/marketplace.json`
- Create: `LICENSE`
- Create: `CLAUDE.md`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "superpowers-ecc",
  "version": "0.1.0",
  "description": "Focused Claude Code plugin merging superpowers workflow discipline with curated ECC tooling",
  "author": "xl4",
  "license": "MIT",
  "type": "module",
  "engines": {
    "node": ">=18.0.0"
  }
}
```

- [ ] **Step 2: Create `.claude-plugin/plugin.json`**

```json
{
  "name": "superpowers-ecc",
  "description": "Disciplined workflow skills, security review, learning system, and cross-platform tooling for Claude Code",
  "version": "0.1.0",
  "author": {
    "name": "xl4"
  },
  "license": "MIT",
  "keywords": ["skills", "tdd", "debugging", "security", "learning", "workflows"]
}
```

- [ ] **Step 3: Create `.claude-plugin/marketplace.json`**

Model after ECC's marketplace.json but with superpowers-ecc metadata. Include `$schema`, `name`, `description`, `owner`, `plugins` array with single entry pointing to `./`.

- [ ] **Step 4: Create `LICENSE`**

Standard MIT license.

- [ ] **Step 5: Create `CLAUDE.md`**

```markdown
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
```

- [ ] **Step 6: Commit**

```bash
git add package.json .claude-plugin/ LICENSE CLAUDE.md
git commit -m "feat: initialize superpowers-ecc repository scaffolding"
```

---

### Task 2: Port 7 core workflow skills from superpowers

**Files:**
- Create: `skills/brainstorming/` — copy all 8 files from superpowers
- Create: `skills/using-git-worktrees/SKILL.md`
- Create: `skills/writing-plans/` — copy SKILL.md + plan-document-reviewer-prompt.md
- Create: `skills/subagent-driven-development/` — copy SKILL.md + 3 prompt files
- Create: `skills/test-driven-development/` — copy SKILL.md + testing-anti-patterns.md (superpowers-only version; merge happens in Phase 4)
- Create: `skills/requesting-code-review/` — copy SKILL.md + code-reviewer.md
- Create: `skills/finishing-a-development-branch/SKILL.md`

- [ ] **Step 1: Copy `brainstorming/` skill directory**

Copy all files from `../superpowers/skills/brainstorming/`:
- `SKILL.md`
- `spec-document-reviewer-prompt.md`
- `visual-companion.md`
- `scripts/frame-template.html`
- `scripts/helper.js`
- `scripts/server.cjs`
- `scripts/start-server.sh`
- `scripts/stop-server.sh`

Verbatim copy, no modifications.

- [ ] **Step 2: Copy `using-git-worktrees/SKILL.md`**

Verbatim from `../superpowers/skills/using-git-worktrees/SKILL.md`.

- [ ] **Step 3: Copy `writing-plans/` skill directory**

Copy from `../superpowers/skills/writing-plans/`:
- `SKILL.md`
- `plan-document-reviewer-prompt.md`

Verbatim copy.

- [ ] **Step 4: Copy `subagent-driven-development/` skill directory**

Copy from `../superpowers/skills/subagent-driven-development/`:
- `SKILL.md`
- `implementer-prompt.md`
- `spec-reviewer-prompt.md`
- `code-quality-reviewer-prompt.md`

Verbatim copy.

- [ ] **Step 5: Copy `test-driven-development/` skill directory**

Copy from `../superpowers/skills/test-driven-development/`:
- `SKILL.md`
- `testing-anti-patterns.md`

Verbatim copy. This is the superpowers-only version. The ECC merge happens in Phase 4, Task 20.

- [ ] **Step 6: Copy `requesting-code-review/` skill directory**

Copy from `../superpowers/skills/requesting-code-review/`:
- `SKILL.md`
- `code-reviewer.md`

Verbatim copy.

- [ ] **Step 7: Copy `finishing-a-development-branch/SKILL.md`**

Verbatim from `../superpowers/skills/finishing-a-development-branch/SKILL.md`.

- [ ] **Step 8: Verify all 7 skills have valid YAML frontmatter**

Run: Check each SKILL.md starts with `---` and contains `name:` and `description:` fields.

- [ ] **Step 9: Commit**

```bash
git add skills/
git commit -m "feat: port 7 core workflow skills from superpowers"
```

---

### Task 3: Port 6 supporting skills from superpowers

**Files:**
- Create: `skills/systematic-debugging/` — copy SKILL.md + 8 supporting files (skip CREATION-LOG.md and test-* files)
- Create: `skills/verification-before-completion/SKILL.md`
- Create: `skills/executing-plans/SKILL.md`
- Create: `skills/dispatching-parallel-agents/SKILL.md`
- Create: `skills/receiving-code-review/SKILL.md`
- Create: `skills/writing-skills/` — copy SKILL.md + 4 supporting files

- [ ] **Step 1: Copy `systematic-debugging/` skill directory**

Copy from `../superpowers/skills/systematic-debugging/`:
- `SKILL.md`
- `condition-based-waiting.md`
- `condition-based-waiting-example.ts`
- `defense-in-depth.md`
- `find-polluter.sh`
- `root-cause-tracing.md`

Skip: `CREATION-LOG.md` (meta/dev artifact), `test-academic.md`, `test-pressure-1.md`, `test-pressure-2.md`, `test-pressure-3.md` (test fixtures for skill development, not runtime).

- [ ] **Step 2: Copy `verification-before-completion/SKILL.md`**

Verbatim from superpowers.

- [ ] **Step 3: Copy `executing-plans/SKILL.md`**

Verbatim from superpowers.

- [ ] **Step 4: Copy `dispatching-parallel-agents/SKILL.md`**

Verbatim from superpowers. (Expansion with cascade method and scaling framework happens in Phase 4, Task 22.)

- [ ] **Step 5: Copy `receiving-code-review/SKILL.md`**

Verbatim from superpowers.

- [ ] **Step 6: Copy `writing-skills/` skill directory**

Copy from `../superpowers/skills/writing-skills/`:
- `SKILL.md`
- `anthropic-best-practices.md`
- `graphviz-conventions.dot`
- `persuasion-principles.md`
- `render-graphs.js`
- `examples/CLAUDE_MD_TESTING.md`

Verbatim copy.

- [ ] **Step 7: Verify all 6 skills have valid YAML frontmatter**

- [ ] **Step 8: Commit**

```bash
git add skills/
git commit -m "feat: port 6 supporting skills from superpowers"
```

---

### Task 4: Write `using-superpowers-ecc` onboarding skill

**Files:**
- Create: `skills/using-superpowers-ecc/SKILL.md`
- Create: `skills/using-superpowers-ecc/references/codex-tools.md` — copy from superpowers
- Create: `skills/using-superpowers-ecc/references/gemini-tools.md` — copy from superpowers

- [ ] **Step 1: Copy reference files from superpowers' `using-superpowers/references/`**

Copy `codex-tools.md` and `gemini-tools.md` verbatim.

- [ ] **Step 2: Write new `SKILL.md`**

Start from `../superpowers/skills/using-superpowers/SKILL.md` as the base. Rewrite to cover:

1. **Rename all references** from "superpowers" to "superpowers-ecc" throughout
2. **Add "Two-Layer Agent Architecture" section** explaining:
   - Embedded subagent prompts (execution machinery inside skills like `subagent-driven-development`)
   - Standalone agents in `agents/` (domain-expert consultants dispatched via commands)
   - When to use each layer
3. **Add "State & Learning System" section** explaining:
   - JSON state in `~/.claude/superpowers-ecc/`
   - Sessions persist context across conversations
   - Instincts accumulate learned patterns with confidence scores
   - Commands: `/learn`, `/evolve`, `/instinct-status`
4. **Add "ECC Additions" section** listing the 10 ECC skills and what they add beyond the superpowers core
5. **Update skill inventory** to list all 24 skills grouped by category

Keep the existing sections: How to Access Skills, Skill Priority, Skill Types, User Instructions, Platform Adaptation.

- [ ] **Step 3: Verify frontmatter is valid**

Frontmatter should be:
```yaml
---
name: using-superpowers-ecc
description: Use when starting any conversation - establishes how to find and use skills, requiring Skill tool invocation before ANY response including clarifying questions
---
```

- [ ] **Step 4: Commit**

```bash
git add skills/using-superpowers-ecc/
git commit -m "feat: write using-superpowers-ecc onboarding skill with two-layer architecture docs"
```

---

### Task 5: Port superpowers commands

**Files:**
- Create: `commands/brainstorm.md`
- Create: `commands/write-plan.md`
- Create: `commands/execute-plan.md`

- [ ] **Step 1: Write `commands/brainstorm.md`**

Do NOT copy the deprecated stub from superpowers. Write a proper command file:

```markdown
---
description: "Start a brainstorming session to refine ideas into specs before writing code"
---

This command invokes the **superpowers-ecc:brainstorming** skill.

Use `/brainstorm` when starting any new feature, project, or significant change. The skill guides you through Socratic spec refinement before any code is written.
```

- [ ] **Step 2: Write `commands/write-plan.md`**

```markdown
---
description: "Create a detailed implementation plan with bite-sized tasks"
---

This command invokes the **superpowers-ecc:writing-plans** skill.

Use `/write-plan` when you have an approved spec or clear requirements and need to break them into implementable tasks with exact file paths, code, and verification steps.
```

- [ ] **Step 3: Write `commands/execute-plan.md`**

```markdown
---
description: "Execute an implementation plan with human checkpoints between task batches"
---

This command invokes the **superpowers-ecc:executing-plans** skill.

Use `/execute-plan` when you have a written plan and want to execute it inline with checkpoint reviews between batches. For subagent-per-task execution, use the subagent-driven-development skill directly.
```

- [ ] **Step 4: Commit**

```bash
git add commands/
git commit -m "feat: add brainstorm, write-plan, and execute-plan commands"
```

---

### Task 6: Write initial test suite

**Files:**
- Create: `tests/run-all.js`
- Create: `tests/install.test.js`
- Create: `tests/skills.test.js`
- Create: `tests/commands.test.js`

- [ ] **Step 1: Write test runner `tests/run-all.js`**

Simple Node.js test runner that:
- Discovers all `*.test.js` files in `tests/`
- Runs each via `node:test` (built-in since Node 18)
- Reports pass/fail count and exits with appropriate code
- No dependencies

```javascript
import { run } from 'node:test';
import { spec } from 'node:test/reporters';
import { glob } from 'node:fs';
// ... discover and run all test files
```

- [ ] **Step 2: Write `tests/install.test.js`**

Tests (~3 tests):
- `.claude-plugin/plugin.json` exists and is valid JSON with required fields (`name`, `description`, `version`)
- `package.json` exists and has `engines.node >= 18`
- `.claude-plugin/marketplace.json` exists and is valid JSON

- [ ] **Step 3: Write `tests/skills.test.js`**

Tests (~4 tests):
- Every directory in `skills/` contains a `SKILL.md`
- Every `SKILL.md` has YAML frontmatter with `name` and `description` fields
- Skill count matches expected (currently 14, will grow)
- No orphan files outside skill directories

- [ ] **Step 4: Write `tests/commands.test.js`**

Tests (~3 tests):
- Every file in `commands/` is a `.md` file
- Every command file has YAML frontmatter with `description` field
- Command count matches expected (currently 3, will grow)

- [ ] **Step 5: Run tests**

Run: `node --test tests/*.test.js`
Expected: All 10 tests pass.

- [ ] **Step 6: Add test script to `package.json`**

Add `"test": "node --test tests/*.test.js"` to scripts.

- [ ] **Step 7: Commit**

```bash
git add tests/ package.json
git commit -m "feat: add initial test suite (install, skills, commands validation)"
```

---

## Phase 2 — Security & Learning Layer

### Task 7: Build `state/store.js`

**Files:**
- Create: `state/store.js`
- Create: `tests/state.test.js`

- [ ] **Step 1: Write failing tests for `state/store.js`**

Create `tests/state.test.js` with tests (~5 tests):

```javascript
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { Store } from '../state/store.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// Use temp dir for tests, not real ~/.claude/
const TEST_ROOT = path.join(os.tmpdir(), `secc-test-${Date.now()}`);

describe('Store', () => {
  it('auto-creates directory tree on first access');
  it('read returns null for nonexistent file');
  it('write then read round-trips JSON data');
  it('list returns filenames in a directory');
  it('delete removes a file');
  it('write is atomic (temp file then rename)');
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test tests/state.test.js`
Expected: FAIL — `Store` not found.

- [ ] **Step 3: Implement `state/store.js`**

```javascript
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';

const DEFAULT_ROOT = path.join(os.homedir(), '.claude', 'superpowers-ecc');

export class Store {
  constructor(root = DEFAULT_ROOT) {
    this.root = root;
  }

  ensureDir(dir) {
    const fullPath = path.join(this.root, dir);
    fs.mkdirSync(fullPath, { recursive: true });
    return fullPath;
  }

  // Auto-create full directory tree on first call
  init() {
    this.ensureDir('sessions');
    this.ensureDir('instincts');
    const configPath = path.join(this.root, 'config.json');
    if (!fs.existsSync(configPath)) {
      this.write('config.json', {});
    }
  }

  read(filePath) {
    const fullPath = path.join(this.root, filePath);
    try {
      return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
    } catch (e) {
      if (e.code === 'ENOENT') return null;
      throw e;
    }
  }

  write(filePath, data) {
    const fullPath = path.join(this.root, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    const tmpPath = fullPath + '.tmp.' + crypto.randomBytes(4).toString('hex');
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2));
    fs.renameSync(tmpPath, fullPath);
  }

  list(dir) {
    const fullPath = path.join(this.root, dir);
    try {
      return fs.readdirSync(fullPath).filter(f => f.endsWith('.json'));
    } catch (e) {
      if (e.code === 'ENOENT') return [];
      throw e;
    }
  }

  delete(filePath) {
    const fullPath = path.join(this.root, filePath);
    try { fs.unlinkSync(fullPath); } catch (e) {
      if (e.code !== 'ENOENT') throw e;
    }
  }

  generateId() {
    return crypto.randomUUID();
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test tests/state.test.js`
Expected: All 5-6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add state/ tests/state.test.js
git commit -m "feat: add JSON state store with auto-create and atomic writes"
```

---

### Task 8: Port `security-review` skill

**Files:**
- Create: `skills/security-review/SKILL.md` — adapt from ECC
- Create: `skills/security-review/cloud-infrastructure-security.md` — copy from ECC

- [ ] **Step 1: Copy `SKILL.md` from ECC**

Copy from `../everything-claude-code/skills/security-review/SKILL.md`. Update the frontmatter `name` field to match the directory name. Remove any ECC-specific references (harness commands, ECC-specific agents). Keep the OWASP checklist content intact.

- [ ] **Step 2: Copy `cloud-infrastructure-security.md`**

Verbatim from ECC.

- [ ] **Step 3: Verify frontmatter**

- [ ] **Step 4: Commit**

```bash
git add skills/security-review/
git commit -m "feat: port security-review skill from ECC"
```

---

### Task 9: Port `security-reviewer` agent and `/security-scan` command

**Files:**
- Create: `agents/security-reviewer.md` — copy from ECC
- Create: `commands/security-scan.md` — new (doesn't exist in ECC)

- [ ] **Step 1: Copy `security-reviewer.md` agent from ECC**

Copy from `../everything-claude-code/agents/security-reviewer.md`. Remove ECC-specific references. Keep vulnerability analysis methodology intact.

- [ ] **Step 2: Write `commands/security-scan.md`**

```markdown
---
description: "Run security analysis on the current codebase using the security-reviewer agent"
---

# Security Scan

Dispatches the **security-reviewer** agent to perform vulnerability analysis on the codebase.

## What This Command Does

1. Scans for OWASP Top 10 vulnerabilities
2. Reviews authentication and authorization patterns
3. Checks for hardcoded secrets and credentials
4. Analyzes dependency security posture
5. Reports findings with severity and remediation guidance

## When to Use

- Before merging to main
- After adding authentication/authorization code
- When handling user input or external data
- During pre-release security review
- Alongside `/quality-gate` for comprehensive pre-merge checks

## Related

- `security-review` skill — OWASP checklist for manual review
- `/quality-gate` — Pre-merge quality check (includes security)
```

- [ ] **Step 3: Commit**

```bash
git add agents/security-reviewer.md commands/security-scan.md
git commit -m "feat: add security-reviewer agent and /security-scan command"
```

---

### Task 10: Port `continuous-learning-v2` skill (JSON-backed)

**Files:**
- Create: `skills/continuous-learning-v2/SKILL.md` — adapt from ECC, rewrite state references
- Note: ECC's continuous-learning-v2 has shell scripts and Python scripts that depend on SQLite. We rewrite the skill to use `state/store.js` and keep only the SKILL.md with updated instructions.

- [ ] **Step 1: Read ECC's `continuous-learning-v2/SKILL.md`**

Read: `../everything-claude-code/skills/continuous-learning-v2/SKILL.md`

- [ ] **Step 2: Write adapted `SKILL.md`**

Rewrite the skill to:
- Replace all SQLite/sql.js references with JSON state (`state/store.js`)
- Replace Python instinct-cli references with command references (`/instinct-status`, `/instinct-import`, `/instinct-export`)
- Keep the core methodology: observation → analysis → confidence scoring → instinct creation → skill evolution
- Keep the instinct data model: `{ id, pattern, context, confidence, examples, created_at, updated_at }`
- Instincts stored as individual JSON files in `~/.claude/superpowers-ecc/instincts/`
- Index maintained in `instincts/index.json` with confidence scores
- Remove shell script dependencies (`observe.sh`, `observer-loop.sh`, etc.)
- Reference hooks (`session-end.js`) for automatic observation capture

Frontmatter:
```yaml
---
name: continuous-learning-v2
description: Use when extracting reusable patterns from sessions into instincts with confidence scoring for cross-session learning
---
```

- [ ] **Step 3: Verify frontmatter**

- [ ] **Step 4: Commit**

```bash
git add skills/continuous-learning-v2/
git commit -m "feat: port continuous-learning-v2 skill with JSON-backed state"
```

---

### Task 11: Port instinct and learning commands

**Files:**
- Create: `commands/learn.md` — adapt from ECC
- Create: `commands/learn-eval.md` — adapt from ECC
- Create: `commands/instinct-status.md` — adapt from ECC
- Create: `commands/instinct-import.md` — adapt from ECC
- Create: `commands/instinct-export.md` — adapt from ECC
- Create: `commands/evolve.md` — adapt from ECC

- [ ] **Step 1: Copy and adapt `/learn` command**

Copy from `../everything-claude-code/commands/learn.md`. Update file path references from `~/.claude/skills/learned/` to `~/.claude/superpowers-ecc/instincts/`. Reference `state/store.js` for persistence.

- [ ] **Step 2: Copy and adapt `/learn-eval` command**

Copy from `../everything-claude-code/commands/learn-eval.md`. Update state references.

- [ ] **Step 3: Copy and adapt `/instinct-status` command**

Copy from `../everything-claude-code/commands/instinct-status.md`. Update to read from `~/.claude/superpowers-ecc/instincts/index.json`.

- [ ] **Step 4: Copy and adapt `/instinct-import` command**

Copy from `../everything-claude-code/commands/instinct-import.md`. Update paths.

- [ ] **Step 5: Copy and adapt `/instinct-export` command**

Copy from `../everything-claude-code/commands/instinct-export.md`. Update paths.

- [ ] **Step 6: Copy and adapt `/evolve` command**

Copy from `../everything-claude-code/commands/evolve.md`. Update state references.

- [ ] **Step 7: Verify all 6 commands have valid frontmatter**

- [ ] **Step 8: Commit**

```bash
git add commands/
git commit -m "feat: port instinct and learning commands (learn, evolve, instinct-status/import/export)"
```

---

### Task 12: Build session hooks

**Files:**
- Create: `hooks/hooks.json`
- Create: `hooks/scripts/session-start.js`
- Create: `hooks/scripts/session-end.js`
- Create: `hooks/scripts/pre-compact.js`
- Create: `tests/hooks.test.js`

- [ ] **Step 1: Write failing tests for hooks**

Create `tests/hooks.test.js` with tests (~3 tests):
- `hooks/hooks.json` exists and is valid JSON
- `hooks.json` contains entries for `SessionStart`, `Stop`, and `PreCompact` event types
- All referenced scripts exist on disk

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test tests/hooks.test.js`
Expected: FAIL — hooks.json doesn't exist.

- [ ] **Step 3: Write `hooks/hooks.json`**

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "node hooks/scripts/session-start.js"
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "node hooks/scripts/session-end.js",
            "async": true,
            "timeout": 10000
          }
        ]
      }
    ],
    "PreCompact": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "node hooks/scripts/pre-compact.js"
          }
        ]
      }
    ]
  }
}
```

- [ ] **Step 4: Write `hooks/scripts/session-start.js`**

Uses `Store` from `../../state/store.js`:
- Calls `store.init()` to ensure directory tree exists
- Reads `sessions/index.json` for session history
- Outputs brief context summary to stdout (last session date, instinct count)
- Creates new session entry with `store.generateId()`

- [ ] **Step 5: Write `hooks/scripts/session-end.js`**

Uses `Store`:
- Saves current session state to `sessions/<session-id>.json`
- Updates `sessions/index.json` with session end timestamp
- Async, 10s timeout — must not block the user

- [ ] **Step 6: Write `hooks/scripts/pre-compact.js`**

Uses `Store`:
- Saves a snapshot of current session state before compaction
- Updates session record with compaction timestamp

- [ ] **Step 7: Run tests**

Run: `node --test tests/hooks.test.js`
Expected: All 3 tests pass.

- [ ] **Step 8: Commit**

```bash
git add hooks/ tests/hooks.test.js
git commit -m "feat: add session hooks (start, end, pre-compact) backed by JSON state"
```

---

### Task 13: Port `strategic-compact` skill and suggest-compact hook

**Files:**
- Create: `skills/strategic-compact/SKILL.md` — adapt from ECC
- Create: `hooks/scripts/suggest-compact.js` — new, inspired by ECC's `suggest-compact.sh`

- [ ] **Step 1: Copy and adapt `strategic-compact/SKILL.md`**

Copy from `../everything-claude-code/skills/strategic-compact/SKILL.md`. Remove ECC-specific references. Keep the core: when to suggest compaction, what context to preserve, logical breakpoint detection.

- [ ] **Step 2: Write `hooks/scripts/suggest-compact.js`**

A `Stop` hook that:
- Checks message count / estimated token usage from session state
- If above threshold, outputs a suggestion to the user about compacting
- Lightweight — no external dependencies

- [ ] **Step 3: Update `hooks/hooks.json`** to add suggest-compact as a second `Stop` hook

- [ ] **Step 4: Commit**

```bash
git add skills/strategic-compact/ hooks/
git commit -m "feat: port strategic-compact skill and add suggest-compact hook"
```

---

### Task 14: Phase 2 verification

- [ ] **Step 1: Run full test suite**

Run: `node --test tests/*.test.js`
Expected: ~15 tests pass.

- [ ] **Step 2: Verify skill count**

Count directories in `skills/` — should be 17 (14 superpowers + security-review + continuous-learning-v2 + strategic-compact).

- [ ] **Step 3: Verify command count**

Count files in `commands/` — should be 10 (3 superpowers + security-scan + learn + learn-eval + instinct-status + instinct-import + instinct-export + evolve = 10).

- [ ] **Step 4: Manual smoke test**

Run the full Phase 1 workflow (brainstorm -> write-plan -> execute-plan) with all Phase 2 hooks enabled. Verify no hook conflicts with skill execution.

- [ ] **Step 5: Commit any fixes from verification**

---

## Phase 3 — Rules, Agents & Commands

### Task 15: Port rules from ECC

**Files:**
- Create: `rules/common/` — 9 files from ECC
- Create: `rules/typescript/` — 5 files from ECC
- Create: `rules/python/` — 5 files from ECC
- Create: `rules/golang/` — 5 files from ECC
- Create: `tests/rules.test.js`

- [ ] **Step 1: Write failing test**

Create `tests/rules.test.js` with tests (~3 tests):
- Every `.md` file in `rules/common/` is valid markdown
- `rules/common/` has exactly 9 files
- Optional rule dirs (`typescript/`, `python/`, `golang/`) each have 5 files

- [ ] **Step 2: Copy `rules/common/` from ECC**

Copy all 9 files verbatim from `../everything-claude-code/rules/common/`:
- `agents.md`, `coding-style.md`, `development-workflow.md`, `git-workflow.md`, `hooks.md`, `patterns.md`, `performance.md`, `security.md`, `testing.md`

- [ ] **Step 3: Copy `rules/typescript/` from ECC**

Copy all 5 files: `coding-style.md`, `hooks.md`, `patterns.md`, `security.md`, `testing.md`

- [ ] **Step 4: Copy `rules/python/` from ECC**

Copy all 5 files (same pattern).

- [ ] **Step 5: Copy `rules/golang/` from ECC**

Copy all 5 files (same pattern).

- [ ] **Step 6: Run tests**

Run: `node --test tests/rules.test.js`
Expected: All 3 tests pass.

- [ ] **Step 7: Commit**

```bash
git add rules/ tests/rules.test.js
git commit -m "feat: port common, typescript, python, and golang rules from ECC"
```

---

### Task 16: Port 6 remaining standalone agents

**Files:**
- Create: `agents/planner.md`
- Create: `agents/architect.md`
- Create: `agents/code-reviewer.md`
- Create: `agents/build-error-resolver.md`
- Create: `agents/refactor-cleaner.md`
- Create: `agents/e2e-runner.md`
- Create: `tests/agents.test.js`

Note: `security-reviewer.md` already ported in Task 9.

- [ ] **Step 1: Write failing test**

Create `tests/agents.test.js` with tests (~2 tests):
- Every file in `agents/` is a `.md` file
- Agent count is exactly 7

- [ ] **Step 2: Copy 6 agents from ECC**

Copy each verbatim from `../everything-claude-code/agents/`:
- `planner.md`
- `architect.md`
- `code-reviewer.md`
- `build-error-resolver.md`
- `refactor-cleaner.md`
- `e2e-runner.md`

Remove any ECC-specific references (ECC harness commands, ECC-specific file paths). Keep the core agent methodology intact.

- [ ] **Step 3: Run tests**

Run: `node --test tests/agents.test.js`
Expected: All 2 tests pass.

- [ ] **Step 4: Commit**

```bash
git add agents/ tests/agents.test.js
git commit -m "feat: port 6 standalone agents from ECC (planner, architect, code-reviewer, build-error-resolver, refactor-cleaner, e2e-runner)"
```

---

### Task 17: Port remaining 14 commands

**Files:**
- Create 14 command files in `commands/`

- [ ] **Step 1: Copy and adapt commands from ECC**

For each of these 14 commands, copy from `../everything-claude-code/commands/` and update references:

| Command | ECC Source | Adaptation Needed |
|---|---|---|
| `plan.md` | `plan.md` | Change to invoke `superpowers-ecc:writing-plans` skill (alias for `/write-plan`) |
| `tdd.md` | `tdd.md` | Change to invoke `superpowers-ecc:test-driven-development` skill instead of ECC's tdd-guide agent |
| `code-review.md` | `code-review.md` | Change to invoke `superpowers-ecc:requesting-code-review` skill |
| `build-fix.md` | `build-fix.md` | Keep reference to `build-error-resolver` agent |
| `refactor-clean.md` | `refactor-clean.md` | Keep reference to `refactor-cleaner` agent |
| `e2e.md` | `e2e.md` | Keep reference to `e2e-runner` agent |
| `checkpoint.md` | `checkpoint.md` | Update file paths to use `~/.claude/superpowers-ecc/` |
| `verify.md` | `verify.md` | Minimal changes |
| `multi-plan.md` | `multi-plan.md` | Update skill references |
| `multi-execute.md` | `multi-execute.md` | Update skill references |
| `sessions.md` | `sessions.md` | Update to read from `~/.claude/superpowers-ecc/sessions/` |
| `quality-gate.md` | `quality-gate.md` | Minimal changes |
| `model-route.md` | `model-route.md` | Minimal changes |
| `test-coverage.md` | `test-coverage.md` | Minimal changes |

- [ ] **Step 2: Verify all 24 commands have valid frontmatter**

Total command count: 3 (Phase 1) + 1 (security-scan) + 6 (instinct/learning) + 14 (this task) = 24.

- [ ] **Step 3: Update `tests/commands.test.js` expected count to 24**

- [ ] **Step 4: Run tests**

Run: `node --test tests/commands.test.js`
Expected: PASS with 24 commands.

- [ ] **Step 5: Commit**

```bash
git add commands/ tests/commands.test.js
git commit -m "feat: port remaining 14 commands from ECC (plan, tdd, code-review, build-fix, etc.)"
```

---

### Task 18: Add cross-platform support configs

**Files:**
- Create: `.cursor/hooks.json`
- Create: `.opencode/plugins/superpowers-ecc.js`
- Create: `.codex/AGENTS.md`

- [ ] **Step 1: Create `.cursor/hooks.json`**

Point to shared hook scripts in `hooks/scripts/`. Follow superpowers' Cursor plugin pattern from `../superpowers/.cursor-plugin/plugin.json`.

- [ ] **Step 2: Create `.opencode/plugins/superpowers-ecc.js`**

Adapt from `../superpowers/.opencode/plugins/superpowers.js`:
- Update plugin name to "superpowers-ecc"
- Update skill directory reference
- Keep the config hook pattern that injects bootstrap context

- [ ] **Step 3: Create `.codex/AGENTS.md`**

Adapt from `../everything-claude-code/.codex/AGENTS.md`:
- Reference superpowers-ecc's 7 agents
- Reference key skills
- Map to shared agent files in `agents/`

- [ ] **Step 4: Commit**

```bash
git add .cursor/ .opencode/ .codex/
git commit -m "feat: add Cursor, OpenCode, and Codex CLI cross-platform support"
```

---

### Task 19: Write `AGENTS.md` documenting two-layer architecture

**Files:**
- Create: `AGENTS.md`

- [ ] **Step 1: Write `AGENTS.md`**

Document the two-layer agent architecture:

```markdown
# Agents

superpowers-ecc uses a two-layer agent architecture.

## Layer 1: Embedded Subagent Prompts (Execution)

Task-scoped prompts inside skills, dispatched automatically during plan execution by `subagent-driven-development`:

- `implementer-prompt.md` — Implements a single task from the plan
- `spec-reviewer-prompt.md` — Reviews implementation against spec requirements
- `code-quality-reviewer-prompt.md` — Reviews code quality and maintainability

These are **execution machinery**. They run as part of the workflow loop with tightly scoped context.

## Layer 2: Standalone Agents (Consultation)

Domain-expert agents in `agents/`, dispatched on-demand via commands or user request:

| Agent | Command | Purpose |
|---|---|---|
| `planner.md` | `/plan` | Feature implementation planning |
| `architect.md` | — | System design decisions |
| `code-reviewer.md` | `/code-review` | Code quality review |
| `security-reviewer.md` | `/security-scan` | Vulnerability analysis |
| `build-error-resolver.md` | `/build-fix` | Build failure resolution |
| `refactor-cleaner.md` | `/refactor-clean` | Dead code removal |
| `e2e-runner.md` | `/e2e` | Playwright E2E testing |

These are **consultants**. Call them when you need domain expertise outside the workflow loop.

## When to Use Which

- **Building features with a plan?** → Embedded prompts run automatically via subagent-driven-development
- **Need a security audit?** → `/security-scan` dispatches the standalone security-reviewer
- **Build broken?** → `/build-fix` dispatches the standalone build-error-resolver
- **Want code reviewed?** → `/code-review` triggers the requesting-code-review skill, which dispatches the code-reviewer agent
```

- [ ] **Step 2: Commit**

```bash
git add AGENTS.md
git commit -m "feat: document two-layer agent architecture in AGENTS.md"
```

---

## Phase 4 — Skill Expansion & Merges

### Task 20: Merge TDD skills

**Files:**
- Modify: `skills/test-driven-development/SKILL.md`

- [ ] **Step 1: Read ECC's TDD skill**

Read: `../everything-claude-code/skills/tdd-workflow/SKILL.md`

- [ ] **Step 2: Append ECC additions to superpowers' TDD skill**

The superpowers version is the base (already ported in Task 2). Append these sections:

**"Coverage Requirements" section** (from ECC):
- 80% minimum for all code
- 100% required for: financial calculations, auth, security, core business logic

**"Testing Anti-Patterns" section** (reference):
- Add a reference to the existing `testing-anti-patterns.md` file (already ported)
- Add any additional anti-patterns from ECC's tdd-workflow: mocking internals, testing implementation details, etc.

**"Post-GREEN Verification" section** (new):
- After GREEN phase, trigger `verification-loop` skill for build/lint/typecheck
- Reference: `superpowers-ecc:verification-loop`

Do NOT change the core RED-GREEN-REFACTOR discipline. Append only.

- [ ] **Step 3: Verify the merged SKILL.md is coherent**

Read through the full file. Ensure no contradictions between superpowers' strict ordering and ECC's additions.

- [ ] **Step 4: Commit**

```bash
git add skills/test-driven-development/
git commit -m "feat: merge TDD skills — add coverage targets, anti-patterns, and verification-loop reference"
```

---

### Task 21: Port 7 ECC skills

**Files:**
- Create: `skills/search-first/SKILL.md`
- Create: `skills/eval-harness/SKILL.md`
- Create: `skills/verification-loop/SKILL.md`
- Create: `skills/token-optimization/SKILL.md` — **new, not in ECC**
- Create: `skills/api-design/SKILL.md`
- Create: `skills/deployment-patterns/SKILL.md`
- Create: `skills/e2e-testing/SKILL.md`

- [ ] **Step 1: Copy `search-first/SKILL.md` from ECC**

Verbatim from `../everything-claude-code/skills/search-first/SKILL.md`. Remove ECC-specific references.

- [ ] **Step 2: Copy and expand `eval-harness/SKILL.md` from ECC**

Copy from ECC, then expand to include:
- **Grader types section**: LLM-as-judge, exact match, semantic similarity — when to use each
- **Metrics section**: pass@k metrics, how to interpret, sample size guidance
- Keep existing eval methodology intact

- [ ] **Step 3: Copy `verification-loop/SKILL.md` from ECC**

Verbatim from ECC. Remove ECC-specific references.

- [ ] **Step 4: Write `token-optimization/SKILL.md` (new skill)**

This skill does NOT exist in ECC — write from scratch based on spec requirements:

```yaml
---
name: token-optimization
description: Use when context is growing large, responses are slow, or you need to optimize token budget across system prompt, background processes, and model selection
---
```

Content should cover:
- **System prompt slimming**: Minimize CLAUDE.md and rule injection, use skill references over inline content
- **Background process management**: Identify and reduce token-consuming background hooks/processes
- **Model selection guidance**: When to use Opus vs Sonnet vs Haiku for different task types, cost/quality tradeoffs
- **Token budget awareness**: How to monitor context usage, when to compact vs. start fresh
- Complements `strategic-compact` (which covers compaction mechanics); this covers everything else

- [ ] **Step 5: Copy `api-design/SKILL.md` from ECC**

Verbatim. Remove ECC-specific references.

- [ ] **Step 6: Copy `deployment-patterns/SKILL.md` from ECC**

Verbatim. Remove ECC-specific references.

- [ ] **Step 7: Copy `e2e-testing/SKILL.md` from ECC**

Verbatim. Remove ECC-specific references.

- [ ] **Step 8: Verify all 7 new skills have valid frontmatter**

- [ ] **Step 9: Update `tests/skills.test.js` expected count to 24**

- [ ] **Step 10: Run tests**

Run: `node --test tests/skills.test.js`
Expected: PASS with 24 skills.

- [ ] **Step 11: Commit**

```bash
git add skills/ tests/skills.test.js
git commit -m "feat: port 6 ECC skills and write new token-optimization skill (24 total)"
```

---

### Task 22: Expand `dispatching-parallel-agents` skill

**Files:**
- Modify: `skills/dispatching-parallel-agents/SKILL.md`

- [ ] **Step 1: Read current SKILL.md**

- [ ] **Step 2: Append cascade method section**

Add a new section: **"Cascade Method (Fan-Out → Collect → Synthesize)"**:
- **Fan-out**: Dispatch N agents with independent, focused scopes
- **Collect**: Gather results from all agents, noting conflicts and overlaps
- **Synthesize**: Merge results into a single coherent output, resolving conflicts

Include a concrete example (e.g., researching a bug across 3 subsystems).

- [ ] **Step 3: Append scaling decision framework**

Add section: **"When to Parallelize vs. Stay Sequential"**:

| Signal | Approach |
|---|---|
| Tasks share no files or state | Parallelize |
| Tasks read same files but don't write | Parallelize |
| Tasks write to same files | Sequential |
| Task B depends on Task A's output | Sequential |
| Exploration/research with independent scopes | Parallelize |
| Fewer than 3 tasks | Usually sequential (overhead not worth it) |

- [ ] **Step 4: Commit**

```bash
git add skills/dispatching-parallel-agents/
git commit -m "feat: expand dispatching-parallel-agents with cascade method and scaling framework"
```

---

### Task 23: Merge planning and subagent skills

**Files:**
- Modify: `commands/plan.md` — ensure it invokes `writing-plans` skill
- Create: `skills/subagent-driven-development/iterative-retrieval.md`
- Modify: `skills/subagent-driven-development/SKILL.md` — add "For Long-Running Tasks" section

- [ ] **Step 1: Verify `commands/plan.md` invokes `writing-plans` skill**

Read `commands/plan.md` (created in Task 17). Ensure it says: "This command is an alias for `/write-plan` — identical behavior, shorter name."

- [ ] **Step 2: Write `iterative-retrieval.md`**

Read ECC's iterative-retrieval skill if it exists, otherwise write based on the concept:

```markdown
# Iterative Retrieval

Sub-technique for progressive context refinement in long-running subagent tasks.

## When to Use

- Task requires exploring large codebases where relevant files aren't known upfront
- Subagent needs to refine its understanding across multiple search/read cycles
- Single-shot context provision would be too large or miss key files

## Pattern

1. **Initial scope**: Provide the subagent with the task description and entry points only
2. **First pass**: Subagent explores, identifies relevant files, reports what it found
3. **Refinement**: Controller reviews findings, narrows or redirects scope
4. **Second pass**: Subagent dives deeper with refined context
5. **Repeat** until the subagent has sufficient context to implement

## When NOT to Use

- Task scope is well-defined and all relevant files are known
- Task can be completed in a single subagent dispatch
- The overhead of multiple rounds exceeds the benefit

## Integration

This technique is used within `subagent-driven-development` for tasks where the implementer-prompt needs to discover context rather than receiving it upfront.
```

- [ ] **Step 3: Add "For Long-Running Tasks" section to `subagent-driven-development/SKILL.md`**

Append after the existing content:

```markdown
## For Long-Running Tasks

When a task requires exploring a large codebase where relevant files aren't known upfront, use iterative retrieval instead of single-shot subagent dispatch. See `iterative-retrieval.md` in this directory for the pattern.

Use iterative retrieval when:
- The implementer would need to search/explore before it can implement
- The controller can't predict which files are relevant
- The task spans multiple subsystems

Use single-shot dispatch (default) when:
- All relevant files are known and can be provided in context
- The task is focused on a single file or small set of files
```

- [ ] **Step 4: Commit**

```bash
git add skills/subagent-driven-development/ commands/plan.md
git commit -m "feat: add iterative-retrieval sub-technique and wire /plan as alias for /write-plan"
```

---

### Task 24: Add MCP server configs

**Files:**
- Create: `mcp-configs/mcp-servers.json`

- [ ] **Step 1: Write `mcp-servers.json`**

Include commonly useful MCP servers (GitHub, context7, sequential-thinking). Keep it minimal — users can add more. Reference ECC's `mcp-configs/mcp-servers.json` for format but only include universally useful servers.

- [ ] **Step 2: Commit**

```bash
git add mcp-configs/
git commit -m "feat: add MCP server configuration templates"
```

---

### Task 25: Phase 4 verification

- [ ] **Step 1: Run full test suite**

Run: `node --test tests/*.test.js`
Expected: ~27 tests pass.

- [ ] **Step 2: Verify counts**

- 24 skills (directories in `skills/`)
- 7 agents (files in `agents/`)
- 24 commands (files in `commands/`)
- 4 rule sets (directories in `rules/`)

- [ ] **Step 3: Commit any fixes**

---

## Phase 5 — Polish & Launch

### Task 26: Write README

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write README with shortform and longform sections**

Structure:
1. **Header**: Plugin name, one-line description, badges
2. **Quick Start**: 2-command install
3. **What's Included**: Skills (24), agents (7), commands (24), rules (4 sets)
4. **Workflow Overview**: The 7-step loop (brainstorm → worktree → plan → implement → review → verify → merge)
5. **Two-Layer Agent Architecture**: Brief explanation with table
6. **Learning System**: How instincts work
7. **Commands Reference**: Table of all 24 commands
8. **Cross-Platform Support**: Claude Code, Cursor, OpenCode, Codex CLI
9. **Configuration**: Language rules, MCP servers, hooks
10. **Contributing**: Link to CONTRIBUTING.md
11. **License**: MIT
12. **Credits**: Superpowers by Jesse Vincent, ECC by Affaan Mustafa

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add README with quick start, workflow overview, and full reference"
```

---

### Task 27: Write CONTRIBUTING.md and CHANGELOG.md

**Files:**
- Create: `CONTRIBUTING.md`
- Create: `CHANGELOG.md`

- [ ] **Step 1: Write `CONTRIBUTING.md`**

Include: how to add skills, how to add agents, how to add commands, how to run tests, PR process.

- [ ] **Step 2: Write `CHANGELOG.md`**

```markdown
# Changelog

## [0.1.0] - 2026-03-22

### Added
- 24 skills (14 from superpowers, 10 from ECC/new)
- 7 standalone agents from ECC
- 24 slash commands
- JSON state persistence (sessions, instincts)
- Session hooks (start, end, pre-compact, suggest-compact)
- Rules: common, typescript, python, golang
- Cross-platform: Claude Code, Cursor, OpenCode, Codex CLI
- 30 automated tests
```

- [ ] **Step 3: Commit**

```bash
git add CONTRIBUTING.md CHANGELOG.md
git commit -m "docs: add CONTRIBUTING.md and CHANGELOG.md"
```

---

### Task 28: Build install scripts

**Files:**
- Create: `install.sh`
- Create: `install.ps1`

- [ ] **Step 1: Write `install.sh`**

```bash
#!/usr/bin/env bash
set -euo pipefail

# Usage: ./install.sh [typescript|python|golang]

PLUGIN_DIR="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_DIR="${HOME}/.claude"

echo "Installing superpowers-ecc..."

# Verify Node.js >= 18
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "Error: Node.js >= 18 required (found v$(node -v))"
  exit 1
fi

# Initialize state directory
node -e "import('${PLUGIN_DIR}/state/store.js').then(m => new m.Store().init())"

echo "Base plugin ready."

# Optional language rules
if [ "${1:-}" != "" ]; then
  LANG="$1"
  if [ -d "${PLUGIN_DIR}/rules/${LANG}" ]; then
    echo "Language rules for ${LANG} will be loaded from rules/${LANG}/"
  else
    echo "Warning: No rules found for '${LANG}'. Available: typescript, python, golang"
  fi
fi

echo "Done. Use '/plugin install' in Claude Code to register."
```

- [ ] **Step 2: Write `install.ps1`**

PowerShell equivalent of install.sh.

- [ ] **Step 3: Make install.sh executable**

```bash
chmod +x install.sh
```

- [ ] **Step 4: Commit**

```bash
git add install.sh install.ps1
git commit -m "feat: add install scripts for Linux/macOS and Windows"
```

---

### Task 29: Reach 30 tests

**Files:**
- Modify: `tests/install.test.js` — add edge case tests
- Modify: `tests/skills.test.js` — add content validation tests
- Modify: `tests/state.test.js` — add edge case tests

- [ ] **Step 1: Count current tests**

Run: `node --test tests/*.test.js` and count.

- [ ] **Step 2: Add tests to reach 30**

Areas to add tests:
- `install.test.js`: Verify `CLAUDE.md` exists, verify `AGENTS.md` exists, verify `LICENSE` exists
- `skills.test.js`: Verify no skill name contains spaces, verify supporting files referenced in SKILL.md exist
- `state.test.js`: Verify `init()` creates `config.json` with empty object, verify `write()` creates parent directories
- `hooks.test.js`: Verify hook scripts are valid JavaScript (no syntax errors via `node --check`)
- `agents.test.js`: Verify each agent file contains a `#` heading
- `commands.test.js`: Verify each command's `description` field is non-empty

- [ ] **Step 3: Run full suite**

Run: `node --test tests/*.test.js`
Expected: 30 tests pass.

- [ ] **Step 4: Commit**

```bash
git add tests/
git commit -m "test: expand test suite to 30 tests"
```

---

### Task 30: GitHub Actions CI

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Write CI workflow**

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm test
```

- [ ] **Step 2: Commit**

```bash
git add .github/
git commit -m "ci: add GitHub Actions workflow for Node 18/20/22"
```

---

### Task 31: Final verification and v1.0.0

- [ ] **Step 1: Final inventory check**

Verify:
- 24 skill directories
- 7 agent files
- 24 command files
- 4 rule directories (common + 3 languages)
- 4 hook scripts
- 1 state store module
- 30+ tests passing

- [ ] **Step 2: Update versions to 1.0.0**

Update `version` in:
- `package.json`
- `.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

- [ ] **Step 3: Update `CHANGELOG.md` version**

Change `[0.1.0]` to `[1.0.0]`.

- [ ] **Step 4: Commit**

```bash
git add package.json .claude-plugin/ CHANGELOG.md
git commit -m "chore: bump version to 1.0.0 for initial release"
```

- [ ] **Step 5: Tag release**

```bash
git tag -a v1.0.0 -m "v1.0.0 — Initial release of superpowers-ecc"
```
