// api/upload.js
const db = require('../lib/db');

module.exports = (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({error:'method'});
  const b = req.body || {};
  if (!b.deviceId) return res.status(400).json({error:'no deviceId'});
  db.prepare(`INSERT INTO uploads (device_id,type,data) VALUES (?,?,?)`)
    .run(b.deviceId, b.type || 'unknown', b.data || '');
  res.json({ok:true});
};
