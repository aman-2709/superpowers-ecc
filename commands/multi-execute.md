---
description: "Multi-model collaborative execution — get prototype from plan, Claude refactors and implements, multi-model audit"
---

# Multi-Execute Command

Multi-model collaborative execution: get prototype from plan, Claude refactors and implements, multi-model audit and delivery.

$ARGUMENTS

## Core Protocols

- **Language Protocol**: Use **English** when interacting with tools/models, communicate with user in their language
- **Code Sovereignty**: External models have **zero filesystem write access** -- all modifications by Claude
- **Dirty Prototype Refactoring**: Treat external model output as "dirty prototype", must refactor to production-grade code
- **Stop-Loss Mechanism**: Do not proceed to next phase until current phase output is validated
- **Prerequisite**: Only execute after user has reviewed the plan from `/multi-plan`

## Execution Workflow

**Execute Task**: $ARGUMENTS

### Phase 0: Read Plan

`[Mode: Prepare]`

1. **Identify Input Type**:
   - Plan file path (e.g., `.claude/plan/xxx.md`)
   - Direct task description

2. **Read Plan Content**:
   - If plan file path provided, read and parse
   - Extract: task type, implementation steps, key files

3. **Task Type Routing**:

   | Task Type | Detection | Route |
   |-----------|-----------|-------|
   | **Frontend** | Pages, components, UI, styles, layout | Frontend model |
   | **Backend** | API, interfaces, database, logic, algorithms | Backend model |
   | **Fullstack** | Contains both frontend and backend | Parallel |

### Phase 1: Quick Context Retrieval

`[Mode: Retrieval]`

Use Claude Code built-in tools to gather context:
1. **Glob**: Find target files from plan's "Key Files" table
2. **Grep**: Search for key symbols, function names, type definitions
3. **Read**: Read discovered files to gather complete context

### Phase 2: Prototype Acquisition

`[Mode: Prototype]`

**Route Based on Task Type**:

- **Frontend/UI/Styles**: Use frontend-focused model for CSS/React/Vue prototype
- **Backend/Logic/Algorithms**: Use backend-focused model for logic and architecture
- **Fullstack**: Parallel calls for both frontend and backend

All model calls use `run_in_background: true` and output **Unified Diff Patch ONLY**.

### Phase 3: Code Implementation

`[Mode: Implement]`

**Claude as Code Sovereign executes the following steps**:

1. **Read Diff**: Parse Unified Diff Patch returned by models
2. **Mental Sandbox**: Simulate applying diff, check logical consistency
3. **Refactor and Clean**: Refactor "dirty prototype" to highly readable, maintainable code
4. **Minimal Scope**: Changes limited to requirement scope only
5. **Apply Changes**: Use Edit/Write tools to execute actual modifications
6. **Self-Verification**: Run project's lint / typecheck / tests

### Phase 4: Audit and Delivery

`[Mode: Audit]`

#### 4.1 Automatic Audit

After changes take effect, parallel call models for Code Review:
- Focus: Security, performance, error handling, logic correctness, accessibility

#### 4.2 Integrate and Fix

1. Synthesize review feedback
2. Execute necessary fixes
3. Repeat audit as needed (until risk is acceptable)

#### 4.3 Delivery Confirmation

After audit passes, report to user:

```markdown
## Execution Complete

### Change Summary
| File | Operation | Description |
|------|-----------|-------------|

### Audit Results
- Backend review: <Passed/Found N issues>
- Frontend review: <Passed/Found N issues>

### Recommendations
1. [ ] <Suggested test steps>
2. [ ] <Suggested verification steps>
```

## Key Rules

1. **Code Sovereignty** -- All file modifications by Claude, external models have zero write access
2. **Dirty Prototype Refactoring** -- External model output treated as draft, must refactor
3. **Minimal Changes** -- Only modify necessary code, no side effects
4. **Mandatory Audit** -- Must perform multi-model Code Review after changes

## Usage

```bash
# Execute plan file
/multi-execute .claude/plan/feature-name.md

# Execute task directly (for plans already discussed in context)
/multi-execute implement user authentication based on previous plan
```
