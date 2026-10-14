// api/devices.js
const db = require('../../lib/db');

module.exports = (req, res) => {
  res.json(db.prepare(`SELECT * FROM devices ORDER BY last_seen DESC`).all());
};
