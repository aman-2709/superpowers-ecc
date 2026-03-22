---
name: dispatching-parallel-agents
description: Use when facing 2+ independent tasks that can be worked on without shared state or sequential dependencies
---

# Dispatching Parallel Agents

## Overview

You delegate tasks to specialized agents with isolated context. By precisely crafting their instructions and context, you ensure they stay focused and succeed at their task. They should never inherit your session's context or history — you construct exactly what they need. This also preserves your own context for coordination work.

When you have multiple unrelated failures (different test files, different subsystems, different bugs), investigating them sequentially wastes time. Each investigation is independent and can happen in parallel.

**Core principle:** Dispatch one agent per independent problem domain. Let them work concurrently.

## When to Use

```dot
digraph when_to_use {
    "Multiple failures?" [shape=diamond];
    "Are they independent?" [shape=diamond];
    "Single agent investigates all" [shape=box];
    "One agent per problem domain" [shape=box];
    "Can they work in parallel?" [shape=diamond];
    "Sequential agents" [shape=box];
    "Parallel dispatch" [shape=box];

    "Multiple failures?" -> "Are they independent?" [label="yes"];
    "Are they independent?" -> "Single agent investigates all" [label="no - related"];
    "Are they independent?" -> "Can they work in parallel?" [label="yes"];
    "Can they work in parallel?" -> "Parallel dispatch" [label="yes"];
    "Can they work in parallel?" -> "Sequential agents" [label="no - shared state"];
}
```

**Use when:**
- 3+ test files failing with different root causes
- Multiple subsystems broken independently
- Each problem can be understood without context from others
- No shared state between investigations

**Don't use when:**
- Failures are related (fix one might fix others)
- Need to understand full system state
- Agents would interfere with each other

## The Pattern

### 1. Identify Independent Domains

Group failures by what's broken:
- File A tests: Tool approval flow
- File B tests: Batch completion behavior
- File C tests: Abort functionality

Each domain is independent - fixing tool approval doesn't affect abort tests.

### 2. Create Focused Agent Tasks

Each agent gets:
- **Specific scope:** One test file or subsystem
- **Clear goal:** Make these tests pass
- **Constraints:** Don't change other code
- **Expected output:** Summary of what you found and fixed

### 3. Dispatch in Parallel

```typescript
// In Claude Code / AI environment
Task("Fix agent-tool-abort.test.ts failures")
Task("Fix batch-completion-behavior.test.ts failures")
Task("Fix tool-approval-race-conditions.test.ts failures")
// All three run concurrently
```

### 4. Review and Integrate

When agents return:
- Read each summary
- Verify fixes don't conflict
- Run full test suite
- Integrate all changes

## Agent Prompt Structure

Good agent prompts are:
1. **Focused** - One clear problem domain
2. **Self-contained** - All context needed to understand the problem
3. **Specific about output** - What should the agent return?

```markdown
Fix the 3 failing tests in src/agents/agent-tool-abort.test.ts:

1. "should abort tool with partial output capture" - expects 'interrupted at' in message
2. "should handle mixed completed and aborted tools" - fast tool aborted instead of completed
3. "should properly track pendingToolCount" - expects 3 results but gets 0

These are timing/race condition issues. Your task:

1. Read the test file and understand what each test verifies
2. Identify root cause - timing issues or actual bugs?
3. Fix by:
   - Replacing arbitrary timeouts with event-based waiting
   - Fixing bugs in abort implementation if found
   - Adjusting test expectations if testing changed behavior

Do NOT just increase timeouts - find the real issue.

Return: Summary of what you found and what you fixed.
```

## Common Mistakes

**❌ Too broad:** "Fix all the tests" - agent gets lost
**✅ Specific:** "Fix agent-tool-abort.test.ts" - focused scope

**❌ No context:** "Fix the race condition" - agent doesn't know where
**✅ Context:** Paste the error messages and test names

**❌ No constraints:** Agent might refactor everything
**✅ Constraints:** "Do NOT change production code" or "Fix tests only"

**❌ Vague output:** "Fix it" - you don't know what changed
**✅ Specific:** "Return summary of root cause and changes"

## When NOT to Use

**Related failures:** Fixing one might fix others - investigate together first
**Need full context:** Understanding requires seeing entire system
**Exploratory debugging:** You don't know what's broken yet
**Shared state:** Agents would interfere (editing same files, using same resources)

## Real Example from Session

**Scenario:** 6 test failures across 3 files after major refactoring

**Failures:**
- agent-tool-abort.test.ts: 3 failures (timing issues)
- batch-completion-behavior.test.ts: 2 failures (tools not executing)
- tool-approval-race-conditions.test.ts: 1 failure (execution count = 0)

**Decision:** Independent domains - abort logic separate from batch completion separate from race conditions

**Dispatch:**
```
Agent 1 → Fix agent-tool-abort.test.ts
Agent 2 → Fix batch-completion-behavior.test.ts
Agent 3 → Fix tool-approval-race-conditions.test.ts
```

**Results:**
- Agent 1: Replaced timeouts with event-based waiting
- Agent 2: Fixed event structure bug (threadId in wrong place)
- Agent 3: Added wait for async tool execution to complete

**Integration:** All fixes independent, no conflicts, full suite green

**Time saved:** 3 problems solved in parallel vs sequentially

## Key Benefits

1. **Parallelization** - Multiple investigations happen simultaneously
2. **Focus** - Each agent has narrow scope, less context to track
3. **Independence** - Agents don't interfere with each other
4. **Speed** - 3 problems solved in time of 1

## Verification

After agents return:
1. **Review each summary** - Understand what changed
2. **Check for conflicts** - Did agents edit same code?
3. **Run full suite** - Verify all fixes work together
4. **Spot check** - Agents can make systematic errors

## Real-World Impact

From debugging session (2025-10-03):
- 6 failures across 3 files
- 3 agents dispatched in parallel
- All investigations completed concurrently
- All fixes integrated successfully
- Zero conflicts between agent changes

## Cascade Method (Fan-Out → Collect → Synthesize)

The cascade method is a structured three-phase approach for parallel investigation where the goal is a single coherent output assembled from multiple independent explorations.

### Fan-Out

Dispatch N agents with independent, focused scopes. Each agent gets a clear, narrow question or investigation area. The key constraint: agents must not need each other's results to do their work.

Design each agent's prompt to:
- Ask one specific question or investigate one specific area
- Include all context the agent needs (no cross-referencing other agents)
- Define a structured output format so results are easy to merge later

### Collect

Gather results from all agents. As results come in, actively note:
- **Conflicts** — agents reached different conclusions about the same thing
- **Overlaps** — multiple agents found the same evidence (reinforces confidence)
- **Gaps** — areas none of the agents covered (may need a follow-up dispatch)

### Synthesize

Merge results into a single coherent output. Resolve conflicts by:
- Weighing specificity — an agent that found the exact line of code beats one that found a general pattern
- Weighing evidence depth — an agent with a reproduction case beats one with a hypothesis
- Flagging unresolvable disagreements for human review rather than silently picking a winner

### Cascade Example: Cross-Subsystem Bug Investigation

**Scenario:** Users report intermittent 500 errors on checkout. The checkout flow touches three subsystems: payment processing, inventory reservation, and order creation.

**Fan-Out:**
```
Agent 1 → "Investigate payment processing for sources of 500 errors during
           checkout. Check error logs, exception handlers, and external API
           call timeouts. Return: error patterns found, frequency, and
           suspected root causes."

Agent 2 → "Investigate inventory reservation for sources of 500 errors during
           checkout. Check for race conditions in stock decrement, deadlocks,
           and failed rollbacks. Return: error patterns found, frequency, and
           suspected root causes."

Agent 3 → "Investigate order creation for sources of 500 errors during
           checkout. Check for validation failures, database constraint
           violations, and transaction isolation issues. Return: error patterns
           found, frequency, and suspected root causes."
```

**Collect:**
- Agent 1: Found payment API timeouts at 3s, causing ~40% of 500s
- Agent 2: Found deadlock on `inventory_locks` table under concurrent writes, causing ~35% of 500s
- Agent 3: Found order creation fails when inventory reservation times out, causing ~25% of 500s — references "upstream timeout"

**Synthesize:**
- Agents 1 and 3 have an overlap: Agent 3's "upstream timeout" is Agent 1's payment API timeout cascading through the system
- Agent 2 found an independent root cause (deadlock)
- Root cause analysis: Two independent issues — (1) payment API timeout at 3s is too aggressive, cascading to order creation failures, and (2) inventory reservation has a deadlock under concurrent writes
- Recommendation: Increase payment timeout to 10s with circuit breaker, and fix inventory locking strategy to use row-level locks instead of table-level locks

## When to Parallelize vs. Stay Sequential

| Signal | Approach | Why |
|---|---|---|
| Tasks share no files or state | Parallelize | No merge conflicts, no coordination needed |
| Tasks read same files but don't write | Parallelize | Read-only access is safe to share |
| Tasks write to same files | Sequential | Concurrent writes cause conflicts |
| Task B depends on Task A's output | Sequential | Data dependency requires ordering |
| Exploration/research with independent scopes | Parallelize | Investigation is inherently parallelizable |
| Fewer than 3 tasks | Usually sequential | Dispatch overhead exceeds time savings |
| Tasks require different expertise domains | Parallelize | Specialized agents perform better in isolation |
| Tasks share complex state (database, external API) | Sequential | Shared mutable state is dangerous |