# superpowers-ecc — Plugin Design Plan

> A focused, production-grade Claude Code plugin that takes the disciplined workflow backbone of `superpowers` and fuses it with the best tooling from `everything-claude-code`. No bloat. No overlap. Just the best of both.

---

## 🎯 Design Philosophy

| Principle | Meaning |
|---|---|
| **Workflow-first** | superpowers' 7-step loop is the spine. Everything else serves it. |
| **Curated, not comprehensive** | 108 skills → ~30. Quality over quantity. |
| **Security by default** | AgentShield + security-review baked in, not optional. |
| **Cross-platform** | Claude Code primary; Cursor + Codex + OpenCode as first-class targets. |
| **Memory that learns** | Sessions accumulate instincts. The agent gets smarter over time. |
| **Token-aware** | Built-in compaction strategy and model routing from day one. |

---

## 📦 What to KEEP from superpowers

These are the irreplaceable pieces that make superpowers' workflow coherent. Do not dilute them.

### Core Workflow Skills (All 7 — non-negotiable)
| Skill | Why Keep |
|---|---|
| `brainstorming` | Socratic spec refinement before any code is written. Prevents scope drift. |
| `using-git-worktrees` | Isolated branch per task. Critical for parallel work and safe rollback. |
| `writing-plans` | Breaks work into 2–5 min tasks with exact file paths. Keeps agents on rails. |
| `subagent-driven-development` | Two-stage review (spec + code quality). The core execution engine. |
| `test-driven-development` | RED-GREEN-REFACTOR enforced. Deletes pre-test code. Non-negotiable. |
| `requesting-code-review` | Pre-review checklist between tasks. Catches drift early. |
| `finishing-a-development-branch` | Clean merge/PR/discard decision. Prevents orphaned branches. |

### Supporting Skills (Keep, they complete the workflow)
| Skill | Why Keep |
|---|---|
| `systematic-debugging` | 4-phase root cause process. Replaces ad-hoc debugging. |
| `verification-before-completion` | Evidence before declaring success. Pairs with TDD. |
| `executing-plans` | Batch execution with human checkpoints. Alternative to subagent mode. |
| `dispatching-parallel-agents` | Concurrent subagent patterns. |
| `receiving-code-review` | How to respond to review feedback. |
| `writing-skills` | Meta-skill for creating new skills. Enables the plugin to grow. |
| `using-superpowers` | Onboarding skill. |

### Plugin Infra
- `.claude-plugin/` manifest structure
- `/plugin marketplace` system
- `RELEASE-NOTES.md` + versioned releases pattern

---

## 📦 What to KEEP from everything-claude-code

Only the skills/components that add genuine capability not covered by superpowers.

### Security (Highest Priority Add)
| Component | Why Keep |
|---|---|
| `security-review` skill | OWASP checklist. Works alongside TDD, not instead of it. |
| `AgentShield` integration (`/security-scan`) | Automated config scanning. Hackathon-grade tooling. |
| `security-reviewer` agent | Dedicated agent for vulnerability analysis. |

### Memory & Learning (High Priority Add)
| Component | Why Keep |
|---|---|
| `continuous-learning-v2` skill | Extracts patterns from sessions into instincts with confidence scoring. |
| `instinct-status / import / export / evolve` commands | The CLI surface for the learning system. |
| Memory persistence hooks (`session-start.js`, `session-end.js`) | Cross-session context survival. superpowers has zero memory. |

### Multi-Language Rules (Medium Priority — selective)
Keep only mature, well-tested rule sets:
| Rules | Why Keep |
|---|---|
| `common/` rules | Language-agnostic. Universal value. |
| `typescript/` rules | Broadest usage. Well-maintained. |
| `python/` rules | Second most common stack. |
| `golang/` rules | Well-maintained in ECC. |

**Drop:** swift, php, perl, java — niche, adds install complexity with marginal gain for most users.

### Agents (Selective Keep)
| Agent | Why Keep |
|---|---|
| `planner.md` | Feature implementation planning. Complements superpowers' writing-plans. |
| `architect.md` | System design decisions. |
| `code-reviewer.md` | Quality and security review. |
| `security-reviewer.md` | Dedicated security agent. |
| `build-error-resolver.md` | Extremely practical. Saves cycles. |
| `refactor-cleaner.md` | Dead code removal. |
| `e2e-runner.md` | E2E testing with Playwright. |

**Drop:** `go-reviewer`, `go-build-resolver`, `python-reviewer`, `database-reviewer` — too language-specific, bloats the agent list. These can be optional add-ons.

### Commands (Selective Keep)
| Command | Why Keep |
|---|---|
| `/plan` | Planning trigger. |
| `/tdd` | TDD workflow trigger. |
| `/code-review` | Quality review. |
| `/build-fix` | Fix build errors fast. |
| `/security-scan` | AgentShield integration. |
| `/refactor-clean` | Dead code cleanup. |
| `/e2e` | E2E test generation. |
| `/learn` + `/learn-eval` | Pattern extraction mid-session. |
| `/checkpoint` + `/verify` | Verification loop. |
| `/instinct-status` + `/evolve` | Learning system. |
| `/multi-plan` + `/multi-execute` | Multi-agent orchestration. |
| `/sessions` | Session history. |
| `/test-coverage` | Coverage analysis. |
| `/update-docs` | Documentation sync. |
| `/harness-audit` | Audit reliability and risk posture. |
| `/model-route` | Route tasks to right model by complexity. |
| `/quality-gate` | Pre-merge quality check. |

**Drop:** `/pm2`, `/go-*`, `/python-review`, `/update-codemaps`, `/loop-start`, `/loop-status` — too operational or too language-specific.

### Token Optimization (Keep)
- `strategic-compact` skill — manual compaction suggestions at logical breakpoints
- `contexts/` (dev, review, research modes) — lightweight dynamic system prompt injection
- Token optimization settings guide in README

### Skills to Selectively Port
| Skill | Why Keep |
|---|---|
| `search-first` | Research-before-coding. Prevents hallucinated API usage. |
| `eval-harness` | Eval-driven development. Pairs with verification-before-completion. |
| `verification-loop` | Continuous verification (build, test, lint, typecheck). |
| `tdd-workflow` | ECC's TDD skill is slightly more detailed than superpowers' — worth merging. |
| `api-design` | REST API design, pagination, error responses. |
| `deployment-patterns` | CI/CD, Docker, health checks, rollbacks. |
| `e2e-testing` | Playwright E2E patterns. |
| `iterative-retrieval` | Progressive context refinement for subagents. Pairs with subagent-driven-dev. |

---

## 🗑️ What to DROP Entirely

### From superpowers
- Nothing significant to drop. It's already lean.

### From everything-claude-code
| Cut | Reason |
|---|---|
| `frontend-slides` skill | Too niche. Not core dev workflow. |
| `article-writing`, `content-engine`, `investor-materials`, `investor-outreach`, `market-research` | Content/business skills. Wrong scope for a dev plugin. |
| `videodb` skill | Highly niche. |
| `liquid-glass-design`, `foundation-models-on-device`, `swift-concurrency-6-2` | Apple-platform only. Too narrow. |
| `clickhouse-io` | Niche analytics DB. |
| `nutrient-document-processing` | Third-party API wrapper. |
| `plankton-code-quality` integration | External dependency. Overkill for most users. |
| `configure-ecc` wizard | Rebuild as `configure-secc` specific to this plugin. |
| `skill-stocktake` | Meta-skill for auditing ECC specifically. Not needed in merged plugin. |
| `pm2` commands | Operational concern, not dev workflow. |
| `multi-backend`, `multi-frontend` | Too prescriptive. `/multi-plan` + `/multi-execute` cover it. |
| Language-specific skills for swift, php, perl, java, cpp | Drop from core. Could be optional packages. |
| Codex macOS app support | Reduce to Codex CLI only. macOS app config is fragile. |
| `autonomous-loops` | Experimental. Too risky without hardened guardrails. |
| All `saas-nextjs-CLAUDE.md`, `go-microservice-CLAUDE.md` etc. example configs | Put in `/examples` as optional, not default. |

---

## 🏗️ Proposed Repository Structure

```
superpowers-ecc/
├── .claude-plugin/
│   ├── plugin.json           # Plugin metadata
│   └── marketplace.json      # Marketplace catalog
│
├── skills/                   # ~30 curated skills
│   ├── brainstorming/        # [superpowers] Socratic spec refinement
│   ├── using-git-worktrees/  # [superpowers] Isolated workspaces
│   ├── writing-plans/        # [superpowers] Task decomposition
│   ├── subagent-driven-dev/  # [superpowers] Two-stage execution loop
│   ├── test-driven-dev/      # [MERGED] Best of both TDD skills
│   ├── requesting-code-review/  # [superpowers]
│   ├── finishing-branch/     # [superpowers]
│   ├── systematic-debugging/ # [superpowers]
│   ├── verification-before-completion/ # [superpowers]
│   ├── executing-plans/      # [superpowers]
│   ├── dispatching-parallel-agents/ # [superpowers]
│   ├── writing-skills/       # [superpowers] Meta-skill
│   ├── security-review/      # [ECC] OWASP checklist
│   ├── continuous-learning-v2/ # [ECC] Instinct system
│   ├── search-first/         # [ECC] Research before coding
│   ├── eval-harness/         # [ECC] Eval-driven dev
│   ├── verification-loop/    # [ECC] Build/test/lint/typecheck
│   ├── strategic-compact/    # [ECC] Token-aware compaction
│   ├── iterative-retrieval/  # [ECC] Subagent context refinement
│   ├── api-design/           # [ECC]
│   ├── deployment-patterns/  # [ECC]
│   └── e2e-testing/          # [ECC]
│
├── agents/                   # 7 specialized subagents
│   ├── planner.md            # Feature planning
│   ├── architect.md          # System design
│   ├── code-reviewer.md      # Quality review
│   ├── security-reviewer.md  # Vulnerability analysis
│   ├── build-error-resolver.md
│   ├── refactor-cleaner.md
│   └── e2e-runner.md
│
├── commands/                 # ~22 slash commands
│   ├── brainstorm.md         # /brainstorm
│   ├── write-plan.md         # /write-plan
│   ├── execute-plan.md       # /execute-plan
│   ├── plan.md               # /plan (ECC alias)
│   ├── tdd.md                # /tdd
│   ├── code-review.md        # /code-review
│   ├── build-fix.md          # /build-fix
│   ├── security-scan.md      # /security-scan
│   ├── refactor-clean.md     # /refactor-clean
│   ├── e2e.md                # /e2e
│   ├── learn.md              # /learn
│   ├── learn-eval.md         # /learn-eval
│   ├── checkpoint.md         # /checkpoint
│   ├── verify.md             # /verify
│   ├── instinct-status.md    # /instinct-status
│   ├── evolve.md             # /evolve
│   ├── multi-plan.md         # /multi-plan
│   ├── multi-execute.md      # /multi-execute
│   ├── sessions.md           # /sessions
│   ├── test-coverage.md      # /test-coverage
│   ├── harness-audit.md      # /harness-audit
│   ├── model-route.md        # /model-route
│   └── quality-gate.md       # /quality-gate
│
├── rules/
│   ├── common/               # Language-agnostic (always install)
│   │   ├── coding-style.md
│   │   ├── git-workflow.md
│   │   ├── testing.md
│   │   ├── performance.md
│   │   ├── patterns.md
│   │   ├── hooks.md
│   │   ├── agents.md
│   │   └── security.md
│   ├── typescript/
│   ├── python/
│   └── golang/
│
├── hooks/
│   ├── hooks.json            # All hook configs
│   └── scripts/
│       ├── session-start.js  # Load context on start [ECC]
│       ├── session-end.js    # Save state on end [ECC]
│       ├── pre-compact.js    # Pre-compaction save [ECC]
│       └── suggest-compact.js # Strategic compact suggestions [ECC]
│
├── contexts/
│   ├── dev.md                # Development mode context [ECC]
│   ├── review.md             # Code review mode context [ECC]
│   └── research.md           # Research mode context [ECC]
│
├── mcp-configs/
│   └── mcp-servers.json      # GitHub, Supabase, Vercel, Railway
│
├── tests/
│   └── run-all.js
│
├── .codex/                   # Codex CLI support
├── .opencode/                # OpenCode support
├── .cursor/                  # Cursor IDE support
│
├── install.sh
├── install.ps1
├── CLAUDE.md
├── AGENTS.md
├── README.md
├── CHANGELOG.md
└── LICENSE (MIT)
```

---

## 🔀 Merge Strategy for Overlapping Skills

Both plugins have TDD skills. Rather than picking one, merge them:

### Merged: `test-driven-development`
- **From superpowers:** The RED-GREEN-REFACTOR enforcement, deleting pre-test code, strict TDD ordering
- **From ECC:** 80% coverage requirement, testing anti-patterns reference, integration with eval-harness
- **New addition:** Reference to `verification-loop` for post-task build/lint/typecheck verification

### Merged: `writing-plans` (superpowers) + `/plan` command (ECC)
- superpowers has the deeper planning methodology (2–5 min tasks, exact file paths)
- ECC has the planner agent
- Merge: the command `/write-plan` triggers superpowers' methodology, with ECC's planner agent doing the heavy lifting

### Merged: Subagent execution
- superpowers: `subagent-driven-development` with two-stage review
- ECC: `iterative-retrieval` for progressive context refinement
- Merge: iterative-retrieval becomes a sub-technique within subagent-driven-dev for long-running tasks

---

## 🚀 Development Phases

### Phase 1 — Foundation (Week 1–2)
**Goal:** Working plugin with superpowers' full workflow intact.

- [ ] Initialize repo as `superpowers-ecc`
- [ ] Port all 7 core superpowers workflow skills verbatim
- [ ] Port superpowers' remaining 7 supporting skills
- [ ] Set up `.claude-plugin/` manifest
- [ ] Port superpowers' 3 commands (`/brainstorm`, `/write-plan`, `/execute-plan`)
- [ ] Verify plugin installs and all commands appear via `/help`
- [ ] Write smoke tests for install and command registration

### Phase 2 — Security & Learning Layer (Week 2–3)
**Goal:** Add ECC's highest-value components without breaking workflow.

- [ ] Port `security-review` skill
- [ ] Port `security-reviewer` agent + `/security-scan` command
- [ ] Port `continuous-learning-v2` skill + instinct commands
- [ ] Port memory persistence hooks (`session-start.js`, `session-end.js`)
- [ ] Port `strategic-compact` skill + hooks
- [ ] Test that hooks don't conflict with superpowers' workflow
- [ ] Add AgentShield npm integration docs

### Phase 3 — Language Rules & Agents (Week 3–4)
**Goal:** Add the ECC infrastructure that broadens platform and language reach.

- [ ] Port `common/` rules
- [ ] Port `typescript/`, `python/`, `golang/` rules
- [ ] Port 7 selected agents (planner, architect, code-reviewer, security-reviewer, build-error-resolver, refactor-cleaner, e2e-runner)
- [ ] Port remaining 19 commands
- [ ] Port `contexts/` (dev, review, research)
- [ ] Port Cursor, OpenCode, Codex CLI support configs

### Phase 4 — Skill Expansion & Merging (Week 4–5)
**Goal:** Add remaining ECC skills, merge overlapping ones.

- [ ] Port `search-first`, `eval-harness`, `verification-loop`, `api-design`, `deployment-patterns`, `e2e-testing`, `iterative-retrieval`
- [ ] Merge TDD skills from both repos into single unified `test-driven-development`
- [ ] Merge planning skills + planner agent
- [ ] Merge subagent execution skills with iterative-retrieval as sub-technique
- [ ] Add `mcp-configs/mcp-servers.json`

### Phase 5 — Polish & Launch (Week 5–6)
**Goal:** Launch-ready plugin with docs, tests, and marketplace.

- [ ] Write unified README (shortform + longform sections)
- [ ] Write `CLAUDE.md` for project-level config example
- [ ] Build install scripts (`install.sh`, `install.ps1`)
- [ ] Write `CONTRIBUTING.md` + `CHANGELOG.md`
- [ ] Register plugin marketplace: `superpowers-ecc-marketplace`
- [ ] Set up GitHub Actions CI (install test + skills lint)
- [ ] First public release: `v1.0.0`

---

## ⚙️ Installation Design (Target UX)

The install experience should be 2 commands max:

```bash
# Step 1: Register marketplace
/plugin marketplace add your-org/superpowers-ecc

# Step 2: Install
/plugin install superpowers-ecc@superpowers-ecc
```

Then optionally install language rules:
```bash
# macOS/Linux
./install.sh typescript       # or python, golang

# Windows
.\install.ps1 typescript
```

---

## 📋 Key Decisions Summary

| Decision | Choice | Rationale |
|---|---|---|
| Workflow backbone | superpowers 7-step loop | It's coherent and proven. Don't dilute it. |
| Skill count | ~22 skills | superpowers' 14 + 8 ECC additions. No bloat. |
| Language rules | TypeScript, Python, Go | Covers 80% of users. Others can add manually. |
| Security tooling | AgentShield + security-review skill | Non-negotiable in 2026. |
| Memory system | ECC's continuous-learning-v2 | superpowers has nothing. This is a clear win. |
| Token strategy | ECC's strategic-compact + model-route | Practical and cost-saving. |
| Agents | 7 curated | Enough for real delegation without overwhelming. |
| Commands | ~22 commands | Covers full workflow without duplication. |
| Platform support | Claude Code (primary), Cursor, Codex CLI, OpenCode | Realistic. Drop Codex macOS app (too fragile). |
| Test suite | Port ECC's Node.js test runner | superpowers lacks tests. 997 tests is an asset. |
| Content/business skills | DROP entirely | Wrong scope for a dev workflow plugin. |
| Native language skills (Swift, PHP, Perl) | Drop from core | Optional add-ons in a separate contrib repo. |

---

## 🔥 The Unique Value of superpowers-ecc

Neither plugin alone gives you:

1. **Disciplined workflow** (superpowers) + **Security scanning** (ECC)
2. **Strict TDD** (superpowers) + **Instinct-based learning** (ECC)
3. **Subagent-driven execution** (superpowers) + **Cross-session memory** (ECC)
4. **YAGNI + DRY principles** (superpowers) + **Token optimization** (ECC)
5. **Proven dev loop** (superpowers) + **Multi-platform** (ECC)

superpowers-ecc is the answer to: *"I want Claude Code to be a disciplined senior engineer who remembers what it learns, scans for security issues, and works across all my tools."*

---

*Generated: March 2026 | MIT License intended*
