#!/usr/bin/env node

/**
 * Suggest-compact hook — runs on Stop events.
 *
 * Tracks message count in the current session and suggests `/compact`
 * when the count exceeds a threshold. Outputs to stderr so messages
 * appear as non-blocking notices (stdout is reserved for tool responses).
 *
 * Runs async with a 5s timeout — must not block the user.
 */

import { Store } from '../../state/store.js';

const THRESHOLD = parseInt(process.env.COMPACT_THRESHOLD, 10) || 50;
const REMINDER_INTERVAL = 25;

const store = new Store();

// Find the current (open) session
const index = store.read('sessions/index.json');
if (!index || !Array.isArray(index.sessions) || index.sessions.length === 0) {
  process.exit(0);
}

const session = index.sessions.findLast((s) => !s.ended_at);
if (!session) {
  process.exit(0);
}

// Increment message counter
session.message_count = (session.message_count ?? 0) + 1;
store.write('sessions/index.json', index);

const count = session.message_count;

// Check if we should suggest compaction
if (count === THRESHOLD) {
  console.error(
    `[superpowers-ecc] ${count} messages in this session. ` +
    `Consider running /compact at a logical breakpoint to preserve context quality.`
  );
} else if (count > THRESHOLD && (count - THRESHOLD) % REMINDER_INTERVAL === 0) {
  console.error(
    `[superpowers-ecc] ${count} messages — context may be degrading. ` +
    `Run /compact with a summary of your current focus.`
  );
}

process.exit(0);
