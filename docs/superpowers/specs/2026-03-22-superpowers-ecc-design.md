# superpowers-ecc — Design Specification

> A focused, production-grade Claude Code plugin that takes the disciplined workflow backbone of superpowers (v5.0.5) and fuses it with the best tooling from everything-claude-code (v1.9.0). No bloat. No overlap. Just the best of both.

---

## Design Philosophy

| Principle | Meaning |
|---|---|
| **Workflow-first** | superpowers' 7-step loop is the spine. Everything else serves it. |
| **Curated, not comprehensive** | 130+ skills across both repos become 24 standalone + 1 embedded sub-technique. Quality over quantity. |
| **Security by default** | Security review + security-reviewer agent baked in, not optional. |
| **Cross-platform** | Claude Code primary; Cursor + Codex CLI + OpenCode as first-class targets via superpowers' manifest pattern. |
| **Memory that learns** | Sessions accumulate instincts via JSON-backed state. The agent gets smarter over time. |
| **Token-aware** | Built-in compaction strategy and model routing from day one. |

---

## Skill Inventory (24 standalone + 1 embedded sub-technique)

### Superpowers Core Workflow (7)

| # | Skill | Purpose |
|---|---|---|
| 1 | `brainstorming` | Socratic spec refinement before any code is written |
| 2 | `using-git-worktrees` | Isolated branch per task for parallel work and safe rollback |
| 3 | `writing-plans` | Breaks work into 2-5 min tasks with exact file paths |
| 4 | `subagent-driven-development` | Two-stage review (spec + code quality) execution engine. Contains `iterative-retrieval.md` as a sub-technique for long-running tasks |
| 5 | `test-driven-development` | RED-GREEN-REFACTOR enforced. Phase 1 ports superpowers-only version verbatim; Phase 4.2 merges in ECC coverage targets + anti-patterns (final merged state) |
| 6 | `requesting-code-review` | Pre-review checklist between tasks |
| 7 | `finishing-a-development-branch` | Clean merge/PR/discard decision |

### Superpowers Supporting (7)

| # | Skill | Purpose |
|---|---|---|
| 8 | `systematic-debugging` | 4-phase root cause process |
| 9 | `verification-before-completion` | Evidence before declaring success |
| 10 | `executing-plans` | Batch execution with human checkpoints |
| 11 | `dispatching-parallel-agents` | Concurrent subagent patterns. Includes cascade method (fan-out, collect, synthesize) and scaling decision framework for when to parallelize vs. stay sequential |
| 12 | `receiving-code-review` | How to respond to review feedback with technical rigor |
| 13 | `writing-skills` | Meta-skill for creating new skills |
| 14 | `using-superpowers-ecc` | Onboarding skill (rewritten from using-superpowers to cover two-layer agent architecture, JSON state system, and ECC additions) |

### ECC Additions (10 standalone)

| # | Skill | Purpose |
|---|---|---|
| 15 | `security-review` | OWASP checklist, works alongside TDD |
| 16 | `continuous-learning-v2` | Instinct system with confidence scoring, backed by JSON state |
| 17 | `search-first` | Research-before-coding, prevents hallucinated API usage |
| 18 | `eval-harness` | Eval-driven development, pairs with verification-before-completion. Covers grader types (LLM-as-judge, exact match, semantic similarity) and pass@k metrics |
| 19 | `verification-loop` | Continuous verification: build, test, lint, typecheck |
| 20 | `strategic-compact` | Token-aware compaction suggestions at logical breakpoints |
| 21 | `token-optimization` | System prompt slimming, background processes, and model selection guidance. Complements strategic-compact (which covers compaction); this covers everything else in token budget management |
| 22 | `api-design` | REST API patterns, pagination, error responses |
| 23 | `deployment-patterns` | CI/CD, Docker, health checks, rollbacks |
| 24 | `e2e-testing` | Playwright E2E patterns |

### Embedded Sub-Technique (1)

| Skill | Location | Purpose |
|---|---|---|
| `iterative-retrieval` | `subagent-driven-development/iterative-retrieval.md` | Progressive context refinement for long-running subagent tasks |

---

## Two-Layer Agent Architecture

| Layer | What | When dispatched | Examples |
|---|---|---|---|
| **Embedded subagent prompts** (superpowers) | Task-scoped prompts inside skills | Automatically by `subagent-driven-development` during plan execution | `implementer-prompt.md`, `spec-reviewer-prompt.md`, `code-quality-reviewer-prompt.md` |
| **Standalone agents** (ECC) | Domain-expert agents in `agents/` | On-demand via commands or user request | `planner.md`, `security-reviewer.md`, `build-error-resolver.md` |

Embedded prompts are **execution machinery** — they run as part of the workflow loop with tightly scoped context curated by the controlling skill. Standalone agents are **consultants** — you call them when you need domain expertise outside the loop.

### Standalone Agents (7)

| Agent | Purpose |
|---|---|
| `planner.md` | Feature implementation planning (complements `writing-plans` skill) |
| `architect.md` | System design decisions |
| `code-reviewer.md` | Code quality and maintainability review |
| `security-reviewer.md` | Dedicated vulnerability analysis |
| `build-error-resolver.md` | Generic build failure resolution |
| `refactor-cleaner.md` | Dead code removal |
| `e2e-runner.md` | Playwright E2E test execution |

---

## Commands (24)

| Command | Source | Triggers |
|---|---|---|
| `/brainstorm` | superpowers | `brainstorming` skill |
| `/write-plan` | superpowers | `writing-plans` skill |
| `/execute-plan` | superpowers | `executing-plans` skill |
| `/plan` | ECC | Alias for `/write-plan` — identical behavior, shorter name for ECC users |
| `/tdd` | ECC | `test-driven-development` skill |
| `/code-review` | ECC | `requesting-code-review` skill |
| `/build-fix` | ECC | `build-error-resolver` agent |
| `/security-scan` | ECC | `security-reviewer` agent |
| `/refactor-clean` | ECC | `refactor-cleaner` agent |
| `/e2e` | ECC | `e2e-runner` agent |
| `/learn` | ECC | Mid-session pattern extraction |
| `/learn-eval` | ECC | Evaluate learned patterns |
| `/checkpoint` | ECC | Save verification checkpoint |
| `/verify` | ECC | Run verification loop |
| `/instinct-status` | ECC | List instincts with confidence scores |
| `/instinct-import` | ECC | Import instincts from file |
| `/instinct-export` | ECC | Export instincts to file |
| `/evolve` | ECC | Mature high-confidence instincts |
| `/multi-plan` | ECC | Multi-agent planning |
| `/multi-execute` | ECC | Multi-agent execution |
| `/sessions` | ECC | Session history |
| `/quality-gate` | ECC | Pre-merge quality check |
| `/model-route` | ECC | Route tasks to right model by complexity |
| `/test-coverage` | ECC | Coverage analysis |

---

## Rules

| Rule Set | Scope | Install |
|---|---|---|
| `common/` | Language-agnostic (coding style, git workflow, testing, performance, patterns, hooks, agents, security) | Always |
| `typescript/` | TypeScript/JavaScript | Optional via `install.sh typescript` |
| `python/` | Python | Optional via `install.sh python` |
| `golang/` | Go | Optional via `install.sh golang` |

---

## State Persistence

All state stored as JSON files in `~/.claude/superpowers-ecc/`. Directory tree auto-created on first access by `state/store.js`.

```
~/.claude/superpowers-ecc/
├── sessions/
│   ├── <session-id>.json          # Per-session state snapshots
│   └── index.json                 # Session history
├── instincts/
│   ├── <instinct-id>.json         # Individual learned patterns
│   └── index.json                 # Instinct registry with confidence scores
└── config.json                    # User preferences
```

### `state/store.js` Contract

- **Auto-create**: On first call, creates full directory tree (`sessions/`, `instincts/`, `config.json`) if absent.
- **Atomic writes**: Write to temp file, then `fs.renameSync` to target. Prevents corruption on crash.
- **No dependencies**: Node.js builtins only (`fs`, `path`, `os`, `crypto` for session IDs).
- **API surface**: `read(path)`, `write(path, data)`, `list(dir)`, `delete(path)`, `ensureDir(path)`.

---

## Hooks

| Hook | Type | Script | Purpose |
|---|---|---|---|
| Session start | `PreToolUse` | `session-start.js` | Initialize store, create session on first tool use (idempotent) |
| Session end | `Stop` | `session-end.js` | Persist current state to JSON |
| Pre-compaction | `Notification` | `pre-compact.js` | Save state on notification events |
| Compaction suggestion | `Stop` | `suggest-compact.js` | Suggest compaction at logical breakpoints |

Valid Claude Code plugin hook types: `PreToolUse`, `PostToolUse`, `Notification`, `Stop`. All hook scripts use `state/store.js` for persistence. Platform-agnostic Node.js.

---

## Cross-Platform Strategy

| Platform | Mechanism | Details |
|---|---|---|
| **Claude Code** | `.claude-plugin/plugin.json` manifest | Primary target. Skills, agents, commands auto-discovered. |
| **Cursor** | `.cursor/hooks.json` | Points to shared `hooks/scripts/`. Cursor discovers skills via its plugin system. |
| **OpenCode** | `.opencode/plugins/superpowers-ecc.js` | Config hook injects bootstrap context, references shared skills directory. |
| **Codex CLI** | `.codex/AGENTS.md` | Maps to shared agents + skill references. Codex macOS app not supported. |

Superpowers' manifest pattern is the canonical source. Platform-specific config directories wire into shared hook scripts and skill definitions.

---

## Merge Strategy

### Merge 1: `test-driven-development`

| Aspect | Source |
|---|---|
| RED-GREEN-REFACTOR enforcement, strict ordering, "watch it fail" gate | superpowers (base document) |
| 80% line/function/branch coverage requirement | ECC (appended section) |
| Testing anti-patterns checklist | ECC (appended section) |
| Post-GREEN verification: trigger `verification-loop` for build/lint/typecheck | New (appended section) |

Superpowers version is the base. ECC additions appended as new sections — keeps core discipline intact while adding breadth.

### Merge 2: `writing-plans` + planner agent

| Aspect | Source |
|---|---|
| Planning methodology (2-5 min tasks, exact file paths, verification steps) | superpowers (skill unchanged) |
| Plan review loop (subagent dispatch, fix/re-dispatch) | superpowers (skill unchanged) |
| `/plan` command | ECC (alias that invokes `writing-plans` skill) |
| `planner.md` agent | ECC (standalone agent for fully delegated planning) |

The skill stays as-is. `/plan` is a convenience alias. The standalone planner agent is available for users who want to delegate entire planning to a subagent.

### Merge 3: `subagent-driven-development` + iterative-retrieval

| Aspect | Source |
|---|---|
| Two-stage review loop (implementer -> spec reviewer -> quality reviewer) | superpowers (unchanged) |
| Embedded subagent prompts | superpowers (unchanged) |
| Progressive context refinement for long-running tasks | ECC (added as `iterative-retrieval.md` reference doc) |

Main SKILL.md gets a new section: **"For Long-Running Tasks"** pointing to `iterative-retrieval.md` with guidance on when to use progressive context refinement vs. single-shot dispatch.

---

## Repository Structure

```
superpowers-ecc/
├── .claude-plugin/
│   ├── plugin.json
│   └── marketplace.json
│
├── skills/                                    # 24 standalone skills
│   ├── brainstorming/SKILL.md
│   ├── using-git-worktrees/SKILL.md
│   ├── writing-plans/SKILL.md
│   ├── subagent-driven-development/
│   │   ├── SKILL.md
│   │   ├── implementer-prompt.md
│   │   ├── spec-reviewer-prompt.md
│   │   ├── code-quality-reviewer-prompt.md
│   │   └── iterative-retrieval.md
│   ├── test-driven-development/SKILL.md       # Merged
│   ├── requesting-code-review/SKILL.md
│   ├── finishing-a-development-branch/SKILL.md
│   ├── systematic-debugging/SKILL.md
│   ├── verification-before-completion/SKILL.md
│   ├── executing-plans/SKILL.md
│   ├── dispatching-parallel-agents/SKILL.md
│   ├── receiving-code-review/SKILL.md
│   ├── writing-skills/SKILL.md
│   ├── using-superpowers-ecc/SKILL.md
│   ├── security-review/SKILL.md
│   ├── continuous-learning-v2/SKILL.md
│   ├── search-first/SKILL.md
│   ├── eval-harness/SKILL.md
│   ├── verification-loop/SKILL.md
│   ├── strategic-compact/SKILL.md
│   ├── token-optimization/SKILL.md
│   ├── api-design/SKILL.md
│   ├── deployment-patterns/SKILL.md
│   └── e2e-testing/SKILL.md
│
├── agents/                                    # 7 standalone agents
│   ├── planner.md
│   ├── architect.md
│   ├── code-reviewer.md
│   ├── security-reviewer.md
│   ├── build-error-resolver.md
│   ├── refactor-cleaner.md
│   └── e2e-runner.md
│
├── commands/                                  # 24 slash commands
│   ├── brainstorm.md
│   ├── write-plan.md
│   ├── execute-plan.md
│   ├── plan.md
│   ├── tdd.md
│   ├── code-review.md
│   ├── build-fix.md
│   ├── security-scan.md
│   ├── refactor-clean.md
│   ├── e2e.md
│   ├── learn.md
│   ├── learn-eval.md
│   ├── checkpoint.md
│   ├── verify.md
│   ├── instinct-status.md
│   ├── instinct-import.md
│   ├── instinct-export.md
│   ├── evolve.md
│   ├── multi-plan.md
│   ├── multi-execute.md
│   ├── sessions.md
│   ├── quality-gate.md
│   ├── model-route.md
│   └── test-coverage.md
│
├── rules/
│   ├── common/
│   ├── typescript/
│   ├── python/
│   └── golang/
│
├── hooks/
│   ├── hooks.json
│   └── scripts/
│       ├── session-start.js
│       ├── session-end.js
│       ├── pre-compact.js
│       └── suggest-compact.js
│
├── state/
│   └── store.js
│
├── mcp-configs/
│   └── mcp-servers.json
│
├── tests/
│   ├── run-all.js
│   ├── install.test.js
│   ├── commands.test.js
│   ├── skills.test.js
│   ├── hooks.test.js
│   ├── agents.test.js
│   ├── rules.test.js
│   └── state.test.js
│
├── .cursor/hooks.json
├── .opencode/plugins/superpowers-ecc.js
├── .codex/AGENTS.md
│
├── install.sh
├── install.ps1
├── package.json
├── CLAUDE.md
├── AGENTS.md
├── README.md
├── CHANGELOG.md
└── LICENSE
```

---

## Development Phases

### Phase 1 — Foundation

**Goal:** Working plugin with superpowers' full workflow intact.

| # | Task | Verification |
|---|---|---|
| 1.1 | Init repo: `package.json`, `.claude-plugin/plugin.json`, `LICENSE`, `CLAUDE.md` | `npm init` succeeds, plugin.json validates |
| 1.2 | Port 7 core workflow skills verbatim from superpowers | Each SKILL.md has valid frontmatter |
| 1.3 | Port 6 supporting skills verbatim + rewrite `using-superpowers-ecc` to cover two-layer agent architecture, JSON state system, and ECC additions | Valid frontmatter, onboarding content covers new features |
| 1.4 | Port superpowers' 3 commands (`brainstorm`, `write-plan`, `execute-plan`) | Commands discoverable |
| 1.5 | Write initial test suite: install, skill frontmatter, command registration (~10 tests) | `node tests/run-all.js` passes |
| 1.6 | Verify plugin installs in Claude Code | Manual: `/plugin install` works |

**Exit gate:** All 14 superpowers skills ported, 3 commands work, 10 tests pass.

### Phase 2 — Security & Learning Layer

**Goal:** Add ECC's highest-value components without breaking workflow.

| # | Task | Verification |
|---|---|---|
| 2.1 | Build `state/store.js` — JSON read/write with auto-create and atomic writes | State tests pass (~5 tests) |
| 2.2 | Port `security-review` skill from ECC | Frontmatter valid, skill content adapted |
| 2.3 | Port `security-reviewer` agent + `/security-scan` command | Agent has required sections |
| 2.4 | Port `continuous-learning-v2` skill — rewrite state layer to use `store.js` instead of SQLite | Instinct create/read/update works via JSON |
| 2.5 | Port instinct commands: `/learn`, `/learn-eval`, `/instinct-status`, `/instinct-import`, `/instinct-export`, `/evolve` | Commands register, basic smoke test |
| 2.6 | Port session hooks: `session-start.js`, `session-end.js`, `pre-compact.js` — backed by `store.js` | Hooks fire, state files created in `~/.claude/superpowers-ecc/` |
| 2.7 | Port `strategic-compact` skill + `suggest-compact.js` hook | Compaction suggestions appear at logical breakpoints |

**Exit gate:** Security review works, instincts persist across sessions as JSON, hooks don't conflict with workflow skills. ~15 tests pass. **Manual smoke test:** Run full Phase 1 workflow (brainstorm -> write-plan -> execute-plan) with all Phase 2 hooks enabled to verify no conflicts.

### Phase 3 — Rules, Agents & Commands

**Goal:** Add ECC infrastructure that broadens platform and language reach.

| # | Task | Verification |
|---|---|---|
| 3.1 | Port `common/` rules from ECC | Rules lint clean |
| 3.2 | Port `typescript/`, `python/`, `golang/` rules | Same |
| 3.3 | Port 6 remaining standalone agents (planner, architect, code-reviewer, build-error-resolver, refactor-cleaner, e2e-runner). Note: security-reviewer already ported in Phase 2.3. | Each agent has required sections |
| 3.4 | Port remaining commands: `/plan`, `/tdd`, `/code-review`, `/build-fix`, `/refactor-clean`, `/e2e`, `/checkpoint`, `/verify`, `/multi-plan`, `/multi-execute`, `/sessions`, `/quality-gate`, `/model-route`, `/test-coverage` | 24 total commands register |
| 3.5 | Add Cursor support (`.cursor/hooks.json` pointing to shared hook scripts) | Manual: hooks fire in Cursor |
| 3.6 | Add OpenCode support (`.opencode/plugins/superpowers-ecc.js`) | Manual: plugin loads in OpenCode |
| 3.7 | Add Codex CLI support (`.codex/AGENTS.md`) | Manual: agents discoverable in Codex |
| 3.8 | Document two-layer agent architecture in `AGENTS.md` | Doc exists, distinction is clear |

**Exit gate:** All 24 commands, all 7 agents, all rules, cross-platform configs in place. ~22 tests pass. Cross-platform config tasks (3.5-3.7) verified manually.

### Phase 4 — Skill Expansion & Merges

**Goal:** Add remaining ECC skills, merge overlapping ones.

| # | Task | Verification |
|---|---|---|
| 4.1 | Port `search-first`, `eval-harness`, `verification-loop`, `token-optimization`, `api-design`, `deployment-patterns`, `e2e-testing` from ECC | 7 new skills with valid frontmatter |
| 4.2 | Merge TDD skills: superpowers base + ECC coverage target + anti-patterns + verification-loop reference | Merged SKILL.md reviewed |
| 4.3 | Merge planning: wire `/plan` command to `writing-plans` skill, document planner agent relationship | Command triggers correct skill |
| 4.4 | Add `iterative-retrieval.md` as sub-technique doc in `subagent-driven-development/`, add "For Long-Running Tasks" section to SKILL.md | Referenced correctly in SKILL.md |
| 4.5 | Add `mcp-configs/mcp-servers.json` | Valid JSON |

**Exit gate:** All 24 skills in place, 3 merges complete, ~27 tests pass.

### Phase 5 — Polish & Launch

**Goal:** Launch-ready plugin with docs, tests, and marketplace.

| # | Task | Verification |
|---|---|---|
| 5.1 | Write README (shortform + longform sections) | Renders correctly on GitHub |
| 5.2 | Write `CONTRIBUTING.md` + `CHANGELOG.md` | Files exist |
| 5.3 | Build `install.sh` + `install.ps1` (with optional language rule packs) | Install scripts work on Linux/macOS/Windows |
| 5.4 | Reach 30 tests passing | `node tests/run-all.js` — 30 pass |
| 5.5 | (Nice-to-have) Port `/update-docs` and `/harness-audit` commands | Commands register if added |
| 5.6 | Register plugin marketplace | `marketplace.json` valid |
| 5.7 | GitHub Actions CI: install test + skill lint + test suite | CI green |
| 5.8 | Tag `v1.0.0` | Release published |

**Exit gate:** Docs complete, CI green, 30 tests pass, v1.0.0 tagged.

---

## Key Decisions Log

| Decision | Choice | Rationale |
|---|---|---|
| Workflow backbone | superpowers 7-step loop | Coherent and proven. Don't dilute it. |
| Skill count | 24 standalone + 1 sub-technique | superpowers' 14 + 10 ECC additions. No bloat. |
| Language rules | TypeScript, Python, Go | Covers 80% of users. Others can add manually. |
| Security tooling | security-review skill + security-reviewer agent | Non-negotiable in 2026. |
| Memory system | ECC's continuous-learning-v2, backed by JSON | superpowers has nothing. Clear capability win. |
| State persistence | JSON files in `~/.claude/superpowers-ecc/` | No SQLite dependency. Auto-create on first run. |
| Token strategy | strategic-compact + token-optimization + model-route | Compaction, budget management, and routing. |
| Node.js requirement | `"engines": { "node": ">=18.0.0" }` in package.json | Required for fs.renameSync reliability and modern JS features. |
| Agent architecture | Two layers: embedded subagent prompts (execution) + standalone agents (consultation) | Serve different purposes, documented clearly. |
| Agents | 7 curated standalone | Enough for real delegation without overwhelming. |
| Commands | 24 | Covers full workflow without duplication. |
| Platform support | Claude Code (primary), Cursor, Codex CLI, OpenCode | Codex macOS app dropped (too fragile). |
| Cross-platform pattern | Superpowers' manifest primary, ECC config dirs for other platforms | Shared hook scripts, platform-specific wiring. |
| Test suite | 30 new tests inspired by ECC structure | Not a port. ECC's 997 tests are ECC-specific. |
| Skill naming | Keep all original superpowers names | Only rename: using-superpowers -> using-superpowers-ecc. |
| Content/business skills | DROP entirely | Wrong scope for a dev workflow plugin. |
| Niche language skills | Drop from core | Optional add-ons in separate contrib repo. |
| Contexts (dev/review/research) | DROP | Superpowers' skill system already handles mode switching. |

---

*Spec version: 1.0 | Date: 2026-03-22 | License: MIT*
