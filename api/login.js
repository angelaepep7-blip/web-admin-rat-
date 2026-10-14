// api/login.js
const db = require('../../lib/db');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
  const {username, password} = req.body || {};
  const row = db.prepare(`SELECT * FROM admin_users WHERE username=?`).get(username);
  if (!row) return res.json({ok:false});
  const ok = await bcrypt.compare(password, row.password_hash);
  if (!ok) return res.json({ok:false});
  const sid = require('crypto').randomBytes(16).toString('hex');
  res.setHeader('Set-Cookie',
    `admin_sid=${sid}; Path=/; HttpOnly; SameSite=Strict`);
  res.json({ok:true, sid});
};
