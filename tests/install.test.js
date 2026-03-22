import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

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
});
