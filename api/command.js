// api/admin/command.js
const db = require('../../lib/db');

module.exports = (req, res) => {
  const {deviceId, action, arg} = req.body || {};
  if (!deviceId || !action) return res.status(400).json({ok:false});
  db.prepare(`INSERT INTO commands (device_id,action,arg) VALUES (?,?,?)`)
    .run(deviceId, action, arg || '');
  res.json({ok:true});
};
