// api/beacon.js
const db = require('../lib/db');

module.exports = (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({error:'method'});
  const b = req.body || {};
  if (!b.deviceId) return res.status(400).json({error:'no deviceId'});
  db.prepare(`INSERT INTO devices (device_id,brand,model,android,sdk,battery,last_seen)
              VALUES (?,?,?,?,?,?,?)
              ON CONFLICT(device_id) DO UPDATE SET
                brand=excluded.brand, model=excluded.model, android=excluded.android,
                sdk=excluded.sdk, battery=excluded.battery, last_seen=excluded.last_seen`)
    .run(b.deviceId, b.brand||'', b.model||'', b.android||'',
         b.sdk||0, b.battery||0, new Date().toISOString());
  res.json({ok:true});
};
