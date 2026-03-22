import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { Store } from '../state/store.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const TEST_ROOT = path.join(os.tmpdir(), `secc-test-${Date.now()}`);

describe('Store', () => {
  let store;

  before(() => {
    store = new Store(TEST_ROOT);
  });

  after(() => {
    fs.rmSync(TEST_ROOT, { recursive: true, force: true });
  });

  it('auto-creates directory tree on init()', () => {
    store.init();
    assert.ok(fs.existsSync(path.join(TEST_ROOT, 'sessions')));
    assert.ok(fs.existsSync(path.join(TEST_ROOT, 'instincts')));
  });

  it('init creates config.json with empty object', () => {
    // init() was already called above, but call again to test idempotency
    store.init();
    const configPath = path.join(TEST_ROOT, 'config.json');
    assert.ok(fs.existsSync(configPath));
    const data = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    assert.deepStrictEqual(data, {});
  });

  it('read returns null for nonexistent file', () => {
    const result = store.read('does/not/exist.json');
    assert.strictEqual(result, null);
  });

  it('write then read round-trips JSON data', () => {
    const payload = { name: 'test', count: 42, nested: { a: true } };
    store.write('sessions/abc.json', payload);
    const result = store.read('sessions/abc.json');
    assert.deepStrictEqual(result, payload);
  });

  it('list returns JSON filenames in a directory', () => {
    store.write('sessions/one.json', { id: 1 });
    store.write('sessions/two.json', { id: 2 });
    // Write a non-JSON file to verify filtering
    const nonJsonPath = path.join(TEST_ROOT, 'sessions', 'notes.txt');
    fs.writeFileSync(nonJsonPath, 'not json');

    const files = store.list('sessions');
    assert.ok(files.includes('one.json'));
    assert.ok(files.includes('two.json'));
    assert.ok(!files.includes('notes.txt'));
  });

  it('list returns empty array for nonexistent directory', () => {
    const files = store.list('nonexistent');
    assert.deepStrictEqual(files, []);
  });

  it('delete removes a file', () => {
    store.write('sessions/to-delete.json', { tmp: true });
    assert.ok(fs.existsSync(path.join(TEST_ROOT, 'sessions', 'to-delete.json')));
    store.delete('sessions/to-delete.json');
    assert.ok(!fs.existsSync(path.join(TEST_ROOT, 'sessions', 'to-delete.json')));
  });

  it('delete is silent for nonexistent file', () => {
    // Should not throw
    store.delete('nonexistent/file.json');
  });

  it('write is atomic (uses temp file then rename)', () => {
    // Verify no leftover .tmp files after write
    store.write('sessions/atomic-test.json', { atomic: true });
    const dir = path.join(TEST_ROOT, 'sessions');
    const files = fs.readdirSync(dir);
    const tmpFiles = files.filter(f => f.includes('.tmp.'));
    assert.strictEqual(tmpFiles.length, 0, 'No temp files should remain after write');
    // Verify the data was written correctly
    const data = store.read('sessions/atomic-test.json');
    assert.deepStrictEqual(data, { atomic: true });
  });

  it('generateId returns a valid UUID', () => {
    const id = store.generateId();
    assert.match(id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    // Two calls produce different IDs
    const id2 = store.generateId();
    assert.notStrictEqual(id, id2);
  });
});
