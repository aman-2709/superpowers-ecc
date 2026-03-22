import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';

const DEFAULT_ROOT = path.join(os.homedir(), '.claude', 'superpowers-ecc');

export class Store {
  constructor(root = DEFAULT_ROOT) {
    this.root = root;
  }

  ensureDir(dir) {
    const fullPath = path.join(this.root, dir);
    fs.mkdirSync(fullPath, { recursive: true });
    return fullPath;
  }

  /**
   * Auto-create the full directory tree and default config.
   * Safe to call multiple times (idempotent).
   */
  init() {
    this.ensureDir('sessions');
    this.ensureDir('instincts');
    const configPath = path.join(this.root, 'config.json');
    if (!fs.existsSync(configPath)) {
      this.write('config.json', {});
    }
  }

  /**
   * Read and parse a JSON file. Returns null if the file does not exist.
   */
  read(filePath) {
    const fullPath = path.join(this.root, filePath);
    try {
      return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
    } catch (e) {
      if (e.code === 'ENOENT') return null;
      throw e;
    }
  }

  /**
   * Atomically write JSON data to a file.
   * Writes to a temp file first, then renames to prevent corruption.
   * Auto-creates parent directories.
   */
  write(filePath, data) {
    const fullPath = path.join(this.root, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    const tmpPath = fullPath + '.tmp.' + crypto.randomBytes(4).toString('hex');
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2));
    fs.renameSync(tmpPath, fullPath);
  }

  /**
   * List JSON filenames in a directory. Returns [] if dir does not exist.
   */
  list(dir) {
    const fullPath = path.join(this.root, dir);
    try {
      return fs.readdirSync(fullPath).filter(f => f.endsWith('.json'));
    } catch (e) {
      if (e.code === 'ENOENT') return [];
      throw e;
    }
  }

  /**
   * Delete a file. Silent if the file does not exist.
   */
  delete(filePath) {
    const fullPath = path.join(this.root, filePath);
    try {
      fs.unlinkSync(fullPath);
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
    }
  }

  /**
   * Generate a random UUID v4.
   */
  generateId() {
    return crypto.randomUUID();
  }
}
