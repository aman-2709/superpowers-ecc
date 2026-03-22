import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './helpers.js';

const RULES_DIR = join(ROOT, 'rules');

describe('rules validation', () => {
  it('every .md file in rules/common/ is valid (non-empty) markdown', () => {
    const commonDir = join(RULES_DIR, 'common');
    const files = readdirSync(commonDir).filter((f) => f.endsWith('.md'));
    const problems = [];
    for (const file of files) {
      const content = readFileSync(join(commonDir, file), 'utf-8').trim();
      if (!content) {
        problems.push(`${file}: empty`);
      }
    }
    assert.equal(problems.length, 0, `Invalid markdown files:\n  ${problems.join('\n  ')}`);
  });

  it('rules/common/ has exactly 9 files', () => {
    const commonDir = join(RULES_DIR, 'common');
    const files = readdirSync(commonDir).filter((f) => f.endsWith('.md'));
    assert.equal(
      files.length,
      9,
      `Expected 9 files in rules/common/, found ${files.length}: ${files.join(', ')}`,
    );
  });

  it('optional rule dirs (typescript, python, golang) each have 5 files', () => {
    const langs = ['typescript', 'python', 'golang'];
    const problems = [];
    for (const lang of langs) {
      const langDir = join(RULES_DIR, lang);
      const files = readdirSync(langDir).filter((f) => f.endsWith('.md'));
      if (files.length !== 5) {
        problems.push(`${lang}: expected 5 files, found ${files.length} (${files.join(', ')})`);
      }
    }
    assert.equal(problems.length, 0, `File count issues:\n  ${problems.join('\n  ')}`);
  });
});
