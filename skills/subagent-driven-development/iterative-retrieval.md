# Iterative Retrieval

Sub-technique for progressive context refinement in long-running subagent tasks.

Referenced by: `subagent-driven-development/SKILL.md` ("For Long-Running Tasks" section)

## The Problem

Subagents are spawned with limited context. They don't know which files are relevant, what patterns exist, or what terminology the project uses.

Standard approaches fail:
- **Send everything**: Exceeds context limits
- **Send nothing**: Agent lacks critical information
- **Guess what's needed**: Often wrong

## The Solution: Iterative Retrieval

A 4-phase loop that progressively refines context (max 3 cycles):

```
DISPATCH → EVALUATE → REFINE → LOOP
```

### Phase 1: DISPATCH

Start with a broad query based on the task description:
- High-level file patterns (`src/**/*.ts`, `lib/**/*.ts`)
- Keywords from the task description
- Exclude test files and obvious non-matches

### Phase 2: EVALUATE

Score each retrieved file for relevance:
- **High (0.8-1.0)**: Directly implements target functionality
- **Medium (0.5-0.7)**: Contains related patterns or types
- **Low (0.2-0.4)**: Tangentially related
- **None (0-0.2)**: Not relevant — exclude in next cycle

Note what's missing: "I found the auth module but not the session manager it references."

### Phase 3: REFINE

Update search based on what you learned:
- Add terminology discovered in the codebase (e.g., project uses "throttle" not "rate limit")
- Add file paths referenced by high-relevance files
- Exclude confirmed irrelevant paths
- Target specific gaps identified in evaluation

### Phase 4: LOOP

Repeat with refined criteria. Stop when:
- 3+ high-relevance files found with no critical gaps
- 3 cycles completed (proceed with best available context)

## Example: Bug Fix Context

```
Task: "Fix the authentication token expiry bug"

Cycle 1:
  DISPATCH: Search for "token", "auth", "expiry" in src/**
  EVALUATE: Found auth.ts (0.9), tokens.ts (0.8), user.ts (0.3)
  REFINE: Add "refresh", "jwt" keywords; exclude user.ts

Cycle 2:
  DISPATCH: Search refined terms
  EVALUATE: Found session-manager.ts (0.95), jwt-utils.ts (0.85)
  → Sufficient context (4 high-relevance files, no gaps)

Result: auth.ts, tokens.ts, session-manager.ts, jwt-utils.ts
```

## Example: Feature Implementation

```
Task: "Add rate limiting to API endpoints"

Cycle 1:
  DISPATCH: Search "rate", "limit", "api" in routes/**
  EVALUATE: No matches — codebase uses "throttle" terminology
  REFINE: Add "throttle", "middleware" keywords

Cycle 2:
  DISPATCH: Search refined terms
  EVALUATE: Found throttle.ts (0.9), middleware/index.ts (0.7)
  REFINE: Need router patterns

Cycle 3:
  DISPATCH: Search "router", "express" patterns
  EVALUATE: Found router-setup.ts (0.8)
  → Sufficient context after 3 cycles

Result: throttle.ts, middleware/index.ts, router-setup.ts
```

## Best Practices

1. **Start broad, narrow progressively** — Don't over-specify initial queries
2. **Learn codebase terminology** — First cycle often reveals naming conventions
3. **Track what's missing** — Explicit gap identification drives refinement
4. **Stop at "good enough"** — 3 high-relevance files beats 10 mediocre ones
5. **Exclude confidently** — Low-relevance files won't become relevant
