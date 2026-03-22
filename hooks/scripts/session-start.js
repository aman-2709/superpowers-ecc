#!/usr/bin/env node

/**
 * Session start hook — runs on PreToolUse.
 *
 * Idempotent: only creates a new session if no open session exists.
 * On first invocation per session, initializes the store directory tree
 * and creates a session entry. Subsequent invocations are no-ops.
 * Must be fast.
 */

import { Store } from '../../state/store.js';

const store = new Store();
store.init();

// Load session history
const index = store.read('sessions/index.json') ?? { sessions: [] };

// Check if there's already an open session (no ended_at)
const openSession = index.sessions.findLast(s => !s.ended_at);

if (openSession) {
  // Already have an open session — no-op
  process.exit(0);
}

// No open session — create one
const instinctCount = store.list('instincts').length;

const lastSession = index.sessions.findLast(s => s.ended_at);
const lastDateStr = lastSession?.started_at
  ? new Date(lastSession.started_at).toLocaleDateString()
  : 'none';

// Output context summary (only on first tool use of session)
console.error(
  `superpowers-ecc: ${instinctCount} instinct(s), last session: ${lastDateStr}`
);

const sessionId = store.generateId();
const now = new Date().toISOString();

index.sessions.push({
  id: sessionId,
  started_at: now,
  ended_at: null,
  compactions: [],
});

store.write('sessions/index.json', index);

process.exit(0);
