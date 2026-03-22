import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './helpers.js';

const AGENTS_DIR = join(ROOT, 'agents');

const EXPECTED_AGENT_COUNT = 7;

describe('agents validation', () => {
  const entries = readdirSync(AGENTS_DIR);

  it('every file in agents/ is a .md file', () => {
    const nonMd = entries.filter((f) => !f.endsWith('.md'));
    assert.equal(
      nonMd.length,
      0,
      `Found non-.md files in agents/: ${nonMd.join(', ')}`,
    );
  });

  it(`agent count is exactly ${EXPECTED_AGENT_COUNT}`, () => {
    assert.equal(
      entries.length,
      EXPECTED_AGENT_COUNT,
      `Expected ${EXPECTED_AGENT_COUNT} agents, found ${entries.length}: ${entries.join(', ')}`,
    );
  });
});
