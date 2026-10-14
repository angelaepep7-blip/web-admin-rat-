// api/command.js
const db = require('../lib/db');

module.exports = (req, res) => {
  const id = req.query.deviceId;
  if (!id) return res.json({});
  const row = db.prepare(
    `SELECT id,action,arg FROM commands WHERE device_id=?
     AND delivered=0 ORDER BY id ASC LIMIT 1`).get(id);
  if (!row) return res.json({});
  db.prepare(`UPDATE commands SET delivered=1 WHERE id=?`).run(row.id);
  res.json({action: row.action, arg: row.arg || ''});
};
