// api/admin/setup.js
const db = require('../../lib/db');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
  const count = db.prepare(`SELECT COUNT(*) c FROM admin_users`).get().c;
  if (count > 0) return res.json({ok:false, error:'akun ada'});
  const {username, password} = req.body || {};
  if (!username || !password) return res.json({ok:false, error:'kosong'});
  const hash = await bcrypt.hash(password, 10);
  db.prepare(`INSERT INTO admin_users (username, password_hash) VALUES (?, ?)`)
    .run(username, hash);
  res.json({ok:true});
};
