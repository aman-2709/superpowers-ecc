#!/usr/bin/env node

/**
 * Pre-compact hook — runs before Claude Code compacts conversation history.
 *
 * Records a compaction timestamp on the current (most recent open) session.
 * Simple and fast.
 */

import { Store } from '../../state/store.js';

const store = new Store();

const index = store.read('sessions/index.json');
if (!index || !Array.isArray(index.sessions) || index.sessions.length === 0) {
  process.exit(0);
}

// Find the most recent session with no ended_at
const session = index.sessions.findLast((s) => !s.ended_at);

if (session) {
  if (!Array.isArray(session.compactions)) {
    session.compactions = [];
  }
  session.compactions.push(new Date().toISOString());
  store.write('sessions/index.json', index);
}

process.exit(0);
