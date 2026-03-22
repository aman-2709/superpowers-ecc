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
