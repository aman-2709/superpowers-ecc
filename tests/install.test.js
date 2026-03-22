import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './helpers.js';

describe('install validation', () => {
  it('plugin.json exists and has required fields', () => {
    const raw = readFileSync(join(ROOT, '.claude-plugin', 'plugin.json'), 'utf-8');
    const plugin = JSON.parse(raw);

    assert.ok(plugin.name, 'plugin.json must have a name field');
    assert.ok(plugin.description, 'plugin.json must have a description field');
    assert.ok(plugin.version, 'plugin.json must have a version field');
  });

  it('package.json has engines.node containing "18"', () => {
    const raw = readFileSync(join(ROOT, 'package.json'), 'utf-8');
    const pkg = JSON.parse(raw);

    assert.ok(pkg.engines, 'package.json must have an engines field');
    assert.ok(pkg.engines.node, 'package.json must have engines.node');
    assert.ok(
      pkg.engines.node.includes('18'),
      `engines.node should reference Node 18, got: "${pkg.engines.node}"`,
    );
  });

  it('marketplace.json exists and is valid JSON', () => {
    const raw = readFileSync(join(ROOT, '.claude-plugin', 'marketplace.json'), 'utf-8');
    const marketplace = JSON.parse(raw);

    assert.equal(typeof marketplace, 'object', 'marketplace.json must parse to an object');
  });

  it('CLAUDE.md exists', () => {
    assert.ok(existsSync(join(ROOT, 'CLAUDE.md')), 'CLAUDE.md must exist at the project root');
  });

  it('AGENTS.md exists', () => {
    assert.ok(existsSync(join(ROOT, 'AGENTS.md')), 'AGENTS.md must exist at the project root');
  });
});
