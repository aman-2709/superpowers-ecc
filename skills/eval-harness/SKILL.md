---
name: eval-harness
description: Formal evaluation framework for Claude Code sessions implementing eval-driven development (EDD) principles
tools: Read, Write, Edit, Bash, Grep, Glob
---

# Eval Harness Skill

A formal evaluation framework for Claude Code sessions, implementing eval-driven development (EDD) principles.

## When to Activate

- Setting up eval-driven development (EDD) for AI-assisted workflows
- Defining pass/fail criteria for Claude Code task completion
- Measuring agent reliability with pass@k metrics
- Creating regression test suites for prompt or agent changes
- Benchmarking agent performance across model versions

## Philosophy

Eval-Driven Development treats evals as the "unit tests of AI development":
- Define expected behavior BEFORE implementation
- Run evals continuously during development
- Track regressions with each change
- Use pass@k metrics for reliability measurement

## Eval Types

### Capability Evals
Test if Claude can do something it couldn't before:
```markdown
[CAPABILITY EVAL: feature-name]
Task: Description of what Claude should accomplish
Success Criteria:
  - [ ] Criterion 1
  - [ ] Criterion 2
  - [ ] Criterion 3
Expected Output: Description of expected result
```

### Regression Evals
Ensure changes don't break existing functionality:
```markdown
[REGRESSION EVAL: feature-name]
Baseline: SHA or checkpoint name
Tests:
  - existing-test-1: PASS/FAIL
  - existing-test-2: PASS/FAIL
  - existing-test-3: PASS/FAIL
Result: X/Y passed (previously Y/Y)
```

## Grader Types

### 1. Code-Based Grader (Exact Match)
Deterministic checks using code. Use when outputs are predictable and verifiable programmatically.

**When to use:** Deterministic outputs, parsing tasks, structured data extraction, code generation with testable behavior.

```bash
# Check if file contains expected pattern
grep -q "export function handleAuth" src/auth.ts && echo "PASS" || echo "FAIL"

# Check if tests pass
npm test -- --testPathPattern="auth" && echo "PASS" || echo "FAIL"

# Check if build succeeds
npm run build && echo "PASS" || echo "FAIL"

# Exact output comparison
diff <(node generate.js) expected-output.txt && echo "PASS" || echo "FAIL"
```

**Strengths:** Fully reproducible, zero cost per eval run, no grader variance.
**Weaknesses:** Cannot assess quality, style, or partial correctness.

### 2. Rule-Based Grader
Regex and schema constraints for structured validation.

**When to use:** Outputs that must conform to a schema, format, or pattern but exact content varies.

```bash
# JSON schema validation
ajv validate -s schema.json -d output.json && echo "PASS" || echo "FAIL"

# Regex pattern matching
echo "$OUTPUT" | grep -qP '^\d{4}-\d{2}-\d{2}T' && echo "PASS" || echo "FAIL"

# Structural checks
jq '.data | length > 0' output.json && echo "PASS" || echo "FAIL"
```

**Strengths:** Flexible enough for variable outputs, still deterministic.
**Weaknesses:** Cannot assess semantic meaning or quality.

### 3. LLM-as-Judge Grader (Model-Based)
Use Claude or another LLM to evaluate open-ended outputs against a rubric.

**When to use:** Subjective quality assessment, creative tasks, code review quality, explanation clarity, tasks where "correct" is a spectrum.

```markdown
[MODEL GRADER PROMPT]
Evaluate the following code change against these criteria:
1. Does it solve the stated problem? (0-2 points)
2. Is it well-structured and readable? (0-2 points)
3. Are edge cases handled? (0-2 points)
4. Is error handling appropriate? (0-2 points)
5. Would this pass code review? (0-2 points)

Score: X/10
PASS threshold: >= 7/10
Reasoning: [explanation]
```

**Strengths:** Can assess nuance, quality, and partial correctness.
**Weaknesses:** Non-deterministic (run multiple times), adds cost per eval, grader itself can have biases.

**Best practices for LLM-as-judge:**
- Use a rubric with specific, observable criteria (not vague "is it good?")
- Run the grader 3-5 times and take majority vote to reduce variance
- Use a stronger model as judge than the model being evaluated when possible
- Periodically calibrate against human judgments

### 4. Semantic Similarity Grader
Compare output meaning against a reference, tolerating surface-level variation.

**When to use:** Meaning preservation tasks (summarization, paraphrasing, translation), information extraction where phrasing varies, any task where multiple correct answers exist.

```python
# Using embeddings for semantic comparison
from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer('all-MiniLM-L6-v2')

reference = "The function authenticates users via JWT tokens"
output = "User authentication is handled through JSON Web Tokens"

ref_embedding = model.encode(reference)
out_embedding = model.encode(output)

similarity = np.dot(ref_embedding, out_embedding) / (
    np.linalg.norm(ref_embedding) * np.linalg.norm(out_embedding)
)

# Typical thresholds:
# > 0.85: strong match (PASS for paraphrasing)
# > 0.70: reasonable match (PASS for summarization)
# < 0.50: likely different meaning (FAIL)
print("PASS" if similarity > 0.85 else "FAIL")
```

**Strengths:** Tolerates rephrasing, catches meaning drift.
**Weaknesses:** Threshold tuning required, embedding model quality matters.

### 5. Human Grader
Flag for manual review when automated grading is insufficient.

**When to use:** Security-sensitive changes, ambiguous requirements, establishing initial baselines before automating.

```markdown
[HUMAN REVIEW REQUIRED]
Change: Description of what changed
Reason: Why human review is needed
Risk Level: LOW/MEDIUM/HIGH
```

### Choosing the Right Grader

| Task Type | Recommended Grader | Example |
|-----------|-------------------|---------|
| Code compiles/tests pass | Code-based (exact match) | Build verification |
| Output matches format | Rule-based | API response shape |
| Code quality/readability | LLM-as-judge | Refactoring tasks |
| Summary accuracy | Semantic similarity | Documentation generation |
| Creative writing | LLM-as-judge | Content generation |
| Data extraction | Code-based + rule-based | Parsing structured data |
| Security changes | Human + code-based | Auth modifications |
| Translation quality | Semantic similarity + LLM-as-judge | Localization |

## Metrics

### pass@k
"At least one success in k attempts" — the primary reliability metric for AI-assisted tasks.

- **pass@1**: First attempt success rate. The most stringent measure — does the agent get it right without retries?
- **pass@3**: Success within 3 attempts. Practical reliability under controlled retries.
- **pass@5**: Success within 5 attempts. Useful for hard tasks where you expect some variance.

**How to calculate:**
```
pass@k = 1 - C(n-c, k) / C(n, k)

where:
  n = total number of samples
  c = number of correct samples
  k = number of attempts considered
```

**How to interpret:**
- pass@1 = 0.80 means 80% of the time it works on the first try
- pass@3 = 0.95 means you'll almost certainly get a correct result within 3 tries
- A large gap between pass@1 and pass@3 suggests the task is solvable but the agent is inconsistent — consider improving prompts or adding constraints

**Sample size guidance:**
- Minimum 20 runs for directional signal
- 50+ runs for reliable pass@1 estimates
- 100+ runs for comparing two configurations with statistical significance
- For pass@3, you need fewer total runs since each "trial" uses 3 samples

### pass^k
"All k trials succeed" — a stricter reliability bar.

- **pass^3**: 3 consecutive successes required
- Use for critical paths where any failure is unacceptable

**Relationship:** pass^k = (pass@1)^k approximately, so:
- If pass@1 = 0.90, then pass^3 ~ 0.73
- If pass@1 = 0.95, then pass^3 ~ 0.86
- If pass@1 = 0.99, then pass^3 ~ 0.97

### Recommended Thresholds

| Eval Type | Metric | Target | Rationale |
|-----------|--------|--------|-----------|
| Capability evals | pass@3 | >= 0.90 | Agent can do the task reliably with retries |
| Regression evals | pass^3 | = 1.00 | Existing functionality must never break |
| Release-critical | pass@1 | >= 0.95 | High confidence without retries |
| Exploratory/new | pass@3 | >= 0.50 | Still learning, tracking improvement |

## Eval Workflow

### 1. Define (Before Coding)
```markdown
## EVAL DEFINITION: feature-xyz

### Capability Evals
1. Can create new user account
2. Can validate email format
3. Can hash password securely

### Regression Evals
1. Existing login still works
2. Session management unchanged
3. Logout flow intact

### Success Metrics
- pass@3 > 90% for capability evals
- pass^3 = 100% for regression evals
```

### 2. Implement
Write code to pass the defined evals.

### 3. Evaluate
```bash
# Run capability evals
[Run each capability eval, record PASS/FAIL]

# Run regression evals
npm test -- --testPathPattern="existing"

# Generate report
```

### 4. Report
```markdown
EVAL REPORT: feature-xyz
========================

Capability Evals:
  create-user:     PASS (pass@1)
  validate-email:  PASS (pass@2)
  hash-password:   PASS (pass@1)
  Overall:         3/3 passed

Regression Evals:
  login-flow:      PASS
  session-mgmt:    PASS
  logout-flow:     PASS
  Overall:         3/3 passed

Metrics:
  pass@1: 67% (2/3)
  pass@3: 100% (3/3)

Status: READY FOR REVIEW
```

## Integration Patterns

### Pre-Implementation
```
/eval define feature-name
```
Creates eval definition file at `.claude/evals/feature-name.md`

### During Implementation
```
/eval check feature-name
```
Runs current evals and reports status

### Post-Implementation
```
/eval report feature-name
```
Generates full eval report

## Eval Storage

Store evals in project:
```
.claude/
  evals/
    feature-xyz.md      # Eval definition
    feature-xyz.log     # Eval run history
    baseline.json       # Regression baselines
```

## Best Practices

1. **Define evals BEFORE coding** - Forces clear thinking about success criteria
2. **Run evals frequently** - Catch regressions early
3. **Track pass@k over time** - Monitor reliability trends
4. **Use code graders when possible** - Deterministic > probabilistic
5. **Human review for security** - Never fully automate security checks
6. **Keep evals fast** - Slow evals don't get run
7. **Version evals with code** - Evals are first-class artifacts

## Example: Adding Authentication

```markdown
## EVAL: add-authentication

### Phase 1: Define (10 min)
Capability Evals:
- [ ] User can register with email/password
- [ ] User can login with valid credentials
- [ ] Invalid credentials rejected with proper error
- [ ] Sessions persist across page reloads
- [ ] Logout clears session

Regression Evals:
- [ ] Public routes still accessible
- [ ] API responses unchanged
- [ ] Database schema compatible

### Phase 2: Implement (varies)
[Write code]

### Phase 3: Evaluate
Run: /eval check add-authentication

### Phase 4: Report
EVAL REPORT: add-authentication
==============================
Capability: 5/5 passed (pass@3: 100%)
Regression: 3/3 passed (pass^3: 100%)
Status: SHIP IT
```

## Eval Anti-Patterns

- **Overfitting prompts to known eval examples** — optimize for the pattern, not specific cases
- **Measuring only happy-path outputs** — always include edge cases and error scenarios
- **Ignoring cost and latency drift while chasing pass rates** — track cost per eval run
- **Allowing flaky graders in release gates** — a flaky grader is worse than no grader
- **Too few samples** — pass@1 from 5 runs is not statistically meaningful

## Minimal Eval Artifact Layout

```
.claude/evals/<feature>.md          # Eval definition
.claude/evals/<feature>.log         # Eval run history
docs/releases/<version>/eval-summary.md   # Release snapshot
```
