import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKILLS_DIR = join(ROOT, 'skills');

const EXPECTED_SKILL_COUNT = 14;

/**
 * Parse YAML frontmatter from a markdown file.
 * Returns an object with key-value pairs, or null if no frontmatter found.
 */
function parseFrontmatter(content) {
  if (!content.startsWith('---')) return null;

  const endIndex = content.indexOf('\n---', 3);
  if (endIndex === -1) return null;

  const yaml = content.slice(4, endIndex); // skip opening "---\n"
  const fields = {};

  for (const line of yaml.split('\n')) {
    const match = line.match(/^(\w[\w-]*):\s*(.+)/);
    if (match) {
      fields[match[1]] = match[2].trim();
    }
  }

  return fields;
}

describe('skills validation', () => {
  const entries = readdirSync(SKILLS_DIR, { withFileTypes: true });
  const skillDirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);

  it(`skill count matches expected (${EXPECTED_SKILL_COUNT})`, () => {
    assert.equal(
      skillDirs.length,
      EXPECTED_SKILL_COUNT,
      `Expected ${EXPECTED_SKILL_COUNT} skill directories, found ${skillDirs.length}: ${skillDirs.join(', ')}`,
    );
  });

  it('every skill directory contains a SKILL.md', () => {
    const missing = [];
    for (const dir of skillDirs) {
      try {
        statSync(join(SKILLS_DIR, dir, 'SKILL.md'));
      } catch {
        missing.push(dir);
      }
    }
    assert.equal(missing.length, 0, `Missing SKILL.md in: ${missing.join(', ')}`);
  });

  it('every SKILL.md has frontmatter with name and description', () => {
    const problems = [];
    for (const dir of skillDirs) {
      const content = readFileSync(join(SKILLS_DIR, dir, 'SKILL.md'), 'utf-8');
      const fm = parseFrontmatter(content);
      if (!fm) {
        problems.push(`${dir}: no frontmatter`);
      } else {
        if (!fm.name) problems.push(`${dir}: missing name`);
        if (!fm.description) problems.push(`${dir}: missing description`);
      }
    }
    assert.equal(problems.length, 0, `Frontmatter issues:\n  ${problems.join('\n  ')}`);
  });

  it('no orphan files outside skill subdirectories', () => {
    const orphans = entries.filter((e) => !e.isDirectory()).map((e) => e.name);
    assert.equal(
      orphans.length,
      0,
      `Found orphan files in skills/: ${orphans.join(', ')}`,
    );
  });
});
