---
description: "Multi-model collaborative planning — context retrieval and dual-model analysis to generate step-by-step implementation plans"
---

# Multi-Plan Command

Multi-model collaborative planning: context retrieval + dual-model analysis to generate a step-by-step implementation plan.

$ARGUMENTS

## Core Protocols

- **Language Protocol**: Use **English** when interacting with tools/models, communicate with user in their language
- **Mandatory Parallel**: Model calls MUST use `run_in_background: true` to avoid blocking the main thread
- **Code Sovereignty**: External models have **zero filesystem write access** -- all modifications by Claude
- **Stop-Loss Mechanism**: Do not proceed to next phase until current phase output is validated
- **Planning Only**: This command allows reading context and writing plan files, but **NEVER modify production code**

## Execution Workflow

**Planning Task**: $ARGUMENTS

### Phase 1: Full Context Retrieval

`[Mode: Research]`

#### 1.1 Context Retrieval

Use Claude Code built-in tools to gather context:
1. **Glob**: Find relevant files by pattern (e.g., `Glob("**/*.ts")`, `Glob("src/**/*.py")`)
2. **Grep**: Search for key symbols, function names, class definitions
3. **Read**: Read discovered files to gather complete context

#### 1.2 Completeness Check

- Must obtain **complete definitions and signatures** for relevant classes, functions, variables
- If context insufficient, trigger **recursive retrieval**
- Prioritize output: entry file + line number + key symbol name

#### 1.3 Requirement Alignment

- If requirements still have ambiguity, **MUST** output guiding questions for user
- Until requirement boundaries are clear (no omissions, no redundancy)

### Phase 2: Multi-Model Collaborative Analysis

`[Mode: Analysis]`

#### 2.1 Distribute Inputs

**Parallel call** multiple models (`run_in_background: true`):

Distribute **original requirement** (without preset opinions) to models:

1. **Backend Analysis**:
   - Focus: Technical feasibility, architecture impact, performance considerations, potential risks
   - OUTPUT: Multi-perspective solutions + pros/cons analysis

2. **Frontend Analysis**:
   - Focus: UI/UX impact, user experience, visual design
   - OUTPUT: Multi-perspective solutions + pros/cons analysis

Wait for all models' complete results. **Save SESSION_ID** for later use.

#### 2.2 Cross-Validation

Integrate perspectives and iterate for optimization:

1. **Identify consensus** (strong signal)
2. **Identify divergence** (needs weighing)
3. **Complementary strengths**: Backend logic follows backend model, Frontend design follows frontend model
4. **Logical reasoning**: Eliminate logical gaps in solutions

#### 2.3 Generate Implementation Plan (Claude Final Version)

Synthesize all analyses, generate **Step-by-step Implementation Plan**:

```markdown
## Implementation Plan: <Task Name>

### Task Type
- [ ] Frontend
- [ ] Backend
- [ ] Fullstack (Parallel)

### Technical Solution
<Optimal solution synthesized from all model analyses>

### Implementation Steps
1. <Step 1> - Expected deliverable
2. <Step 2> - Expected deliverable
...

### Key Files
| File | Operation | Description |
|------|-----------|-------------|
| path/to/file.ts:L10-L50 | Modify | Description |

### Risks and Mitigation
| Risk | Mitigation |
|------|------------|
```

### Phase 2 End: Plan Delivery (Not Execution)

**Responsibilities end here, MUST execute the following actions**:

1. Present complete implementation plan to user (including pseudo-code)
2. Save plan to `.claude/plan/<feature-name>.md`
3. Output prompt for user to review and optionally execute via `/multi-execute`

**ABSOLUTELY FORBIDDEN**:
- Auto-execute after planning (execution is `/multi-execute`'s responsibility)
- Any write operations to production code
- Continue triggering model calls when user hasn't explicitly requested modifications

## Plan Modification Flow

If user requests plan modifications:

1. Adjust plan content based on user feedback
2. Update `.claude/plan/<feature-name>.md` file
3. Re-present modified plan
4. Prompt user to review or execute again

## Key Rules

1. **Plan only, no implementation** -- This command does not execute any code changes
2. **No Y/N prompts** -- Only present plan, let user decide next steps
3. External models have **zero filesystem write access**
