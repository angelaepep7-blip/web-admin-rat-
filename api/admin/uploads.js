// api/admin/uploads.js
const db = require('../../lib/db');

module.exports = (req, res) => {
  const id = req.query.deviceId;
  if (!id) return res.json([]);
  res.json(db.prepare(`SELECT * FROM uploads WHERE device_id=?
                       ORDER BY id DESC LIMIT 50`).all(id));
};
