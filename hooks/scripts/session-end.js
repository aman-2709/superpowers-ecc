#!/usr/bin/env node

/**
 * Session end hook — runs when a Claude Code session stops.
 *
 * Finds the most recent session without an `ended_at` timestamp and closes it.
 * Runs async with a 10s timeout — must not block the user.
 */

import { Store } from '../../state/store.js';

const store = new Store();

const index = store.read('sessions/index.json');
if (!index || !Array.isArray(index.sessions) || index.sessions.length === 0) {
  // No sessions recorded — nothing to close.
  process.exit(0);
}

// Find the most recent session with no ended_at (search from the end)
const session = index.sessions.findLast((s) => !s.ended_at);

if (session) {
  session.ended_at = new Date().toISOString();
  store.write('sessions/index.json', index);
}

process.exit(0);
