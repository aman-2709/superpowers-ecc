#!/usr/bin/env node

/**
 * Session start hook — runs on every Claude Code session start.
 *
 * Creates a new session entry in the store and outputs a brief context summary.
 * Must be fast and side-effect-light.
 */

import { Store } from '../../state/store.js';

const store = new Store();
store.init();

// Load session history
const index = store.read('sessions/index.json') ?? { sessions: [] };

// Load instincts to report count
const instinctFiles = store.list('instincts');
const instinctCount = instinctFiles.length;

// Build context summary
const lastSession = index.sessions.length > 0
  ? index.sessions[index.sessions.length - 1]
  : null;

const lastDateStr = lastSession?.started_at
  ? new Date(lastSession.started_at).toLocaleDateString()
  : 'none';

console.log(
  `superpowers-ecc: loaded ${instinctCount} instinct(s), last session: ${lastDateStr}`
);

// Create new session entry
const sessionId = store.generateId();
const now = new Date().toISOString();

const session = {
  id: sessionId,
  started_at: now,
  ended_at: null,
  compactions: [],
};

index.sessions.push(session);
store.write('sessions/index.json', index);

process.exit(0);
