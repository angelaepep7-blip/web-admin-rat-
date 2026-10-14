// lib/db.js
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, {recursive:true});

const db = new Database(path.join(DATA_DIR, 'panel.db'));
db.exec(`
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS devices (
  device_id TEXT PRIMARY KEY, brand TEXT, model TEXT, android TEXT,
  sdk INTEGER, battery INTEGER, last_seen TEXT
);
CREATE TABLE IF NOT EXISTS commands (
  id INTEGER PRIMARY KEY AUTOINCREMENT, device_id TEXT,
  action TEXT, arg TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP, delivered INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS uploads (
  id INTEGER PRIMARY KEY AUTOINCREMENT, device_id TEXT,
  type TEXT, data TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

module.exports = db;
