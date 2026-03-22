import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
import { dirname } from 'node:path';

const PROJECT_ROOT = path.resolve(__dirname, '..');
const HOOKS_JSON_PATH = path.join(PROJECT_ROOT, 'hooks', 'hooks.json');

describe('Session hooks', () => {
  it('hooks/hooks.json exists and is valid JSON', () => {
    assert.ok(fs.existsSync(HOOKS_JSON_PATH), 'hooks/hooks.json should exist');
    const raw = fs.readFileSync(HOOKS_JSON_PATH, 'utf-8');
    let parsed;
    assert.doesNotThrow(() => {
      parsed = JSON.parse(raw);
    }, 'hooks.json should be valid JSON');
    assert.ok(parsed && typeof parsed === 'object', 'hooks.json should parse to an object');
  });

  it('hooks.json contains entries for PreToolUse, Stop, and Notification', () => {
    const config = JSON.parse(fs.readFileSync(HOOKS_JSON_PATH, 'utf-8'));
    assert.ok(config.hooks, 'hooks.json should have a top-level "hooks" key');
    for (const eventType of ['PreToolUse', 'Stop', 'Notification']) {
      assert.ok(
        Array.isArray(config.hooks[eventType]),
        `hooks.json should have an array for event type "${eventType}"`
      );
      assert.ok(
        config.hooks[eventType].length > 0,
        `hooks.json "${eventType}" array should not be empty`
      );
    }
  });

  it('all scripts referenced in hooks.json exist on disk', () => {
    const config = JSON.parse(fs.readFileSync(HOOKS_JSON_PATH, 'utf-8'));
    for (const [eventType, matchers] of Object.entries(config.hooks)) {
      for (const matcher of matchers) {
        for (const hook of matcher.hooks) {
          // Extract the script path from the command string.
          // Commands look like: "node $CLAUDE_PLUGIN_ROOT/hooks/scripts/session-start.js"
          // We resolve $CLAUDE_PLUGIN_ROOT to the project root.
          const command = hook.command.replace('$CLAUDE_PLUGIN_ROOT', PROJECT_ROOT);
          const parts = command.split(/\s+/);
          // The script path is the last argument (after "node")
          const scriptPath = parts[parts.length - 1];
          assert.ok(
            fs.existsSync(scriptPath),
            `Script "${scriptPath}" referenced by ${eventType} hook should exist on disk`
          );
        }
      }
    }
  });
});
