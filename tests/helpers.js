import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Parse YAML frontmatter from a markdown file.
 * Returns an object with key-value pairs, or null if no frontmatter found.
 * Handles both LF and CRLF line endings.
 */
export function parseFrontmatter(content) {
  if (!content.startsWith('---')) return null;

  const firstNewline = content.indexOf('\n');
  if (firstNewline === -1) return null;

  const endIndex = content.indexOf('\n---', firstNewline);
  if (endIndex === -1) return null;

  const yaml = content.slice(firstNewline + 1, endIndex);
  const fields = {};

  for (const line of yaml.split('\n')) {
    const trimmed = line.replace(/\r$/, '');
    const match = trimmed.match(/^(\w[\w-]*):\s*(.+)/);
    if (match) {
      let value = match[2].trim();
      // Strip surrounding quotes
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      fields[match[1]] = value;
    }
  }

  return fields;
}
