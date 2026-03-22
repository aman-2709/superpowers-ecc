/**
 * Simple test runner that discovers and runs all *.test.js files in tests/.
 *
 * Usage: node tests/run-all.js
 *
 * Uses the built-in node:test runner (Node >= 18). Each test file is executed
 * as a child process so failures are isolated.
 */

import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const testFiles = readdirSync(__dirname)
  .filter((f) => f.endsWith('.test.js'))
  .sort();

if (testFiles.length === 0) {
  console.error('No test files found.');
  process.exit(1);
}

let passed = 0;
let failed = 0;

for (const file of testFiles) {
  const filePath = join(__dirname, file);
  try {
    execFileSync(process.execPath, ['--test', filePath], { stdio: 'inherit' });
    passed++;
  } catch {
    failed++;
  }
}

console.log(`\nResults: ${passed} passed, ${failed} failed out of ${testFiles.length} file(s).`);
process.exit(failed > 0 ? 1 : 0);
