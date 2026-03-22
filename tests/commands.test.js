import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const COMMANDS_DIR = join(ROOT, 'commands');

const EXPECTED_COMMAND_COUNT = 3;

/**
 * Parse YAML frontmatter from a markdown file.
 * Returns an object with key-value pairs, or null if no frontmatter found.
 */
function parseFrontmatter(content) {
  if (!content.startsWith('---')) return null;

  const endIndex = content.indexOf('\n---', 3);
  if (endIndex === -1) return null;

  const yaml = content.slice(4, endIndex);
  const fields = {};

  for (const line of yaml.split('\n')) {
    const match = line.match(/^(\w[\w-]*):\s*(.+)/);
    if (match) {
      fields[match[1]] = match[2].trim();
    }
  }

  return fields;
}

describe('commands validation', () => {
  const files = readdirSync(COMMANDS_DIR);

  it(`command count matches expected (${EXPECTED_COMMAND_COUNT})`, () => {
    assert.equal(
      files.length,
      EXPECTED_COMMAND_COUNT,
      `Expected ${EXPECTED_COMMAND_COUNT} command files, found ${files.length}: ${files.join(', ')}`,
    );
  });

  it('every file in commands/ is a .md file', () => {
    const nonMd = files.filter((f) => !f.endsWith('.md'));
    assert.equal(nonMd.length, 0, `Non-.md files found: ${nonMd.join(', ')}`);
  });

  it('every command file has frontmatter with description', () => {
    const problems = [];
    for (const file of files) {
      const content = readFileSync(join(COMMANDS_DIR, file), 'utf-8');
      const fm = parseFrontmatter(content);
      if (!fm) {
        problems.push(`${file}: no frontmatter`);
      } else if (!fm.description) {
        problems.push(`${file}: missing description`);
      }
    }
    assert.equal(problems.length, 0, `Frontmatter issues:\n  ${problems.join('\n  ')}`);
  });
});
