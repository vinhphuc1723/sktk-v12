// ============================================================
// SKTK V12 – app.js  (Main Application Logic)
// ============================================================

// ── STATE ────────────────────────────────────────────────────
var APP = {
  user: null,
  currentPage: 'home',
  photos: [],
  selectedPhotos: new Set(),
  unionTx: [
    {id:1,date:'05/05/2026',type:'thu',content:'Đoàn phí tháng 5',amount:2400000,person:'Nguyễn Anh Tuấn',note:'12 thành viên × 200k'},
    {id:2,date:'03/05/2026',type:'thu',content:'Quyên góp sự kiện',amount:1800000,person:'Mc Danh Tung',note:''},
    {id:3,date:'06/05/2026',type:'chi',content:'Thăm hỏi ốm đau',amount:500000,person:'Nguyễn Anh Tuấn',note:'Hỗ trợ đ/c Linh'},
    {id:4,date:'07/05/2026',type:'chi',content:'Mua sắm thiết bị VP',amount:1300000,person:'Mc Danh Tung',note:'Máy in, vật tư'},
  ],
  recentTx: [],
  members: [
    {id:1,name:'Mc Danh Tung',role:'Lãnh đạo phòng',color:'#c8102e',dept:'lanhdao',phone:'0901234567',email:'danhlung@vtv.vn',skill:'Dẫn CT'},
    {id:2,name:'Nguyễn Anh Tuấn',role:'Phó phòng / Trợ lý',color:'#1565c0',dept:'lanhdao',phone:'0912345678',email:'anhtuan@vtv.vn',skill:'Đạo diễn'},
    {id:3,name:'Trần Minh Linh',role:'Biên tập viên',color:'#2e7d32',dept:'bientap',phone:'0923456789',email:'minhlinh@vtv.vn',skill:'Biên tập'},
    {id:4,name:'Lê Văn Hùng',role:'Kỹ thuật viên',color:'#e65100',dept:'kythuat',phone:'0934567890',email:'vanhung@vtv.vn',skill:'Kỹ thuật'},
    {id:5,name:'Phạm Thu Hà',role:'Biên tập viên',color:'#880e4f',dept:'bientap',phone:'0945678901',email:'thuha@vtv.vn',skill:'Biên tập'},
    {id:6,name:'Đoàn Văn Nam',role:'Đạo diễn',color:'#4a148c',dept:'bientap',phone:'0956789012',email:'vannam@vtv.vn',skill:'Đạo diễn'},
  ],
  notifications: [
    {id:1,icon:'📢',title:'Họp giao ban tuần 20/2026',desc:'Mời toàn thể CBNV tham dự họp giao ban tuần 20 lúc 8h00 thứ Hai 11/05/2026',time:'07/05/2026 – 16:30',unread:true},
    {id:2,icon:'🎭',title:'Lịch sản xuất CT Tạp Kỹ T5/2026',desc:'Cập nhật lịch sản xuất chương trình Tạp Kỹ tháng 5/2026',time:'06/05/2026 – 09:15',unread:true},
    {id:3,icon:'💼',title:'Thu đoàn phí tháng 5/2026',desc:'Đề nghị nộp đoàn phí tháng 5 trước ngày 15/05/2026',time:'05/05/2026 – 08:00',unread:true},
    {id:4,icon:'📅',title:'Lịch nghỉ lễ 30/4 – 1/5/2026',desc:'Thông báo lịch nghỉ lễ theo quy định của Đài THVN',time:'28/04/2026 – 14:00',unread:false},
  ],
  missions: [
    'Sản xuất các chương trình tạp kỹ, xiếc, ảo thuật',
    'Tổ chức và dàn dựng các tiết mục sân khấu',
    'Phối hợp với các đơn vị nghệ thuật trong và ngoài nước',
    'Đào tạo và phát triển đội ngũ nghệ sĩ',
    'Bảo tồn và phát triển nghệ thuật truyền thống dân tộc',
  ],
  attData: [
    {name:'Mc Danh Tung',role:'Lãnh đạo',color:'#c8102e',status:'present'},
    {name:'Nguyễn Anh Tuấn',role:'Phó phòng',color:'#1565c0',status:'present'},
    {name:'Trần Minh Linh',role:'Biên tập',color:'#2e7d32',status:'absent'},
    {name:'Lê Văn Hùng',role:'Kỹ thuật',color:'#e65100',status:'late'},
    {name:'Phạm Thu Hà',role:'Biên tập',color:'#880e4f',status:'present'},
    {name:'Đoàn Văn Nam',role:'Đạo diễn',color:'#4a148c',status:'present'},
    {name:'Ngô Thị Lan',role:'Kỹ thuật',color:'#006064',status:'absent'},
    {name:'Vũ Hoàng Long',role:'Sản xuất',color:'#33691e',status:'present'},
    {name:'Đinh Thị Mai',role:'Biên tập',color:'#bf360c',status:'present'},
    {name:'Hà Minh Đức',role:'Kỹ thuật',color:'#1a237e',status:'late'},
    {name:'Bùi Thị Nga',role:'Hành chính',color:'#4e342e',status:'present'},
    {name:'Cao Văn Tùng',role:'Kỹ thuật',color:'#37474f',status:'present'},
  ],
  // Image editor state
  edImg: null, edCtx: null, edRot: 0, edFH: false, edFV: false, edZoom: 1, edPhotoId: null,
  // PWA install
  deferredPrompt: null,
};

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  setDateDisplay();
  loadFromStorage();
  registerSW();
  setupPWAInstall();

  // Keyboard support
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { closeAllModals(); closeSidebar(); }
  });

  // iOS standalone detection
  if (window.navigator.standalone === true) {
    document.body.classList.add('ios-standalone');
  }
});

// ── STORAGE ───────────────────────────────────────────────────
function saveToStorage() {
  try {
    var data = {
      user: APP.user,
      photos: APP.photos.map(function(p) { return {id:p.id,name:p.name,src:p.src,cat:p.cat,ts:p.ts}; }),
      unionTx: APP.unionTx,
      notifications: APP.notifications,
      attData: APP.attData,
    };
    localStorage.setItem('sktk_v12', JSON.stringify(data));
  } catch(e) { console.warn('Storage save failed:', e); }
}

function loadFromStorage() {
  try {
    var raw = localStorage.getItem('sktk_v12');
    if (raw) {
      var data = JSON.parse(raw);
      if (data.photos) APP.photos = data.photos;
      if (data.unionTx) APP.unionTx = data.unionTx;
      if (data.notifications) APP.notifications = data.notifications;
      if (data.attData) APP.attData = data.attData;
    }
  } catch(e) { console.warn('Storage load failed:', e); }
}

// ── SERVICE WORKER (PWA) ──────────────────────────────────────
function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(function(reg) { console.log('SW registered:', reg.scope); })
      .catch(function(err) { console.log('SW registration failed:', err); });
  }
}

function setupPWAInstall() {
  window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    APP.deferredPrompt = e;
    // Show install banner after 3 seconds
    setTimeout(function() {
      var banner = document.getElementById('install-banner');
      if (banner) banner.classList.add('show');
    }, 3000);
  });
  window.addEventListener('appinstalled', function() {
    var banner = document.getElementById('install-banner');
    if (banner) banner.classList.remove('show');
    toast('Đã cài đặt SKTK V12 thành công! 🎉', 'ok');
  });
}

function installApp() {
  if (APP.deferredPrompt) {
    APP.deferredPrompt.prompt();
    APP.deferredPrompt.userChoice.then(function(r) {
      if (r.outcome === 'accepted') toast('Đang cài đặt ứng dụng...', 'ok');
      APP.deferredPrompt = null;
    });
  } else {
    // iOS instruction
    toast('Trên iOS: Nhấn nút Chia sẻ → "Thêm vào màn hình chính"', 'info');
  }
  dismissInstall();
}

function dismissInstall() {
  var banner = document.getElementById('install-banner');
  if (banner) banner.classList.remove('show');
}

// ── AUTH ──────────────────────────────────────────────────────
function selectRole(el) {
  document.querySelectorAll('.role-option').forEach(function(r) { r.classList.remove('selected'); });
  el.classList.add('selected');
}

function doLogin() {
  var user = (document.getElementById('loginUser').value || '').trim();
  var pass = (document.getElementById('loginPass').value || '').trim();
  var roleEl = document.querySelector('.role-option.selected');
  var role = roleEl ? roleEl.dataset.role : 'nhanvien';

  if (!user || !pass) { toast('Vui lòng nhập đầy đủ thông tin!'); return; }

  // Simple auth (in production: call backend API)
  var roleNames = {lanhdao:'Lãnh đạo phòng', trolý:'Trợ lý phòng', nhanvien:'Nhân viên', admin:'Quản trị hệ thống'};
  APP.user = { username: user, role: role, roleName: roleNames[role] || 'Nhân viên', displayName: formatDisplayName(user) };

  // Save session
  try { sessionStorage.setItem('sktk_session', JSON.stringify(APP.user)); } catch(e) {}

  // Update UI
  var dn = document.getElementById('hdr-name');
  var dr = document.getElementById('hdr-role');
  var av = document.getElementById('hdr-avatar');
  if (dn) dn.textContent = APP.user.displayName;
  if (dr) dr.textContent = APP.user.roleName;
  if (av) av.textContent = getInitials(APP.user.displayName);

  // Switch screen
  document.getElementById('screen-login').classList.remove('active');
  var appScreen = document.getElementById('screen-app');
  appScreen.classList.add('active');

  // Init all UI
  initApp();
  toast('Chào mừng ' + APP.user.displayName + '!', 'ok');
}

function formatDisplayName(s) {
  // Try to format: DanhTung → Danh Tung
  return s.replace(/([a-z])([A-Z])/g, '$1 $2')
           .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
}

function getInitials(name) {
  return name.split(' ').map(function(w) { return w[0]; }).slice(-2).join('').toUpperCase();
}

function confirmLogout() {
  if (!confirm('Bạn có chắc muốn đăng xuất?')) return;
  doLogout();
}

function doLogout() {
  APP.user = null;
  // Clear ALL auth storage (cross-browser)
  try { sessionStorage.removeItem('sktk_session'); } catch(e) {}
  try { localStorage.removeItem('sktk_auth'); } catch(e) {}
  // Clear auth cookies
  var cookies = document.cookie.split(';');
  for (var i = 0; i < cookies.length; i++) {
    var c = cookies[i].trim();
    var name = c.split('=')[0];
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' + window.location.hostname;
  }
  // Switch back to login
  document.getElementById('screen-app').classList.remove('active');
  document.getElementById('screen-login').classList.add('active');
  // Clear login fields
  var lu = document.getElementById('loginUser');
  var lp = document.getElementById('loginPass');
  if (lp) lp.value = '';
  toast('Đã đăng xuất thành công!', 'ok');
}

// ── INIT APP ──────────────────────────────────────────────────
function initApp() {
  setDateDisplay();
  renderMissions();
  renderPersonList(null);
  renderPhotos(null);
  renderAttGrid();
  renderAttHistory();
  renderAttStats();
  renderUnionTable();
  renderNotifications();
  updateNotifBadge();
}

function setDateDisplay() {
  var d = new Date();
  var days = ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
  var str = days[d.getDay()] + ', ' + pad(d.getDate()) + '/' + pad(d.getMonth()+1) + '/' + d.getFullYear();
  ['date-home','date-att'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.textContent = str;
  });
}

function pad(n) { return n < 10 ? '0' + n : '' + n; }

// ── NAVIGATION ────────────────────────────────────────────────
function showPage(page) {
  APP.currentPage = page;
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  var pg = document.getElementById('page-' + page);
  if (pg) pg.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
  var nav = document.getElementById('nav-' + page);
  if (nav) nav.classList.add('active');
  // Scroll to top
  var mc = document.getElementById('main-content');
  if (mc) mc.scrollTop = 0;
}

function setMN(btn) {
  document.querySelectorAll('.mn-item').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
}

function subTab(prefix, tab, el) {
  var card = el ? el.closest('.page-card') : document;
  if (!card) card = document;
  card.querySelectorAll('.sub-tab').forEach(function(t) { t.classList.remove('active'); });
  card.querySelectorAll('.tab-pane').forEach(function(t) { t.classList.remove('active'); });
  if (el) el.classList.add('active');
  var pane = document.getElementById(prefix + '-' + tab);
  if (pane) pane.classList.add('active');
}

function setPeriod(btn) {
  var grp = btn.closest('.period-grp');
  if (grp) grp.querySelectorAll('.period-btn').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('open');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('open');
}

// ── MISSIONS ──────────────────────────────────────────────────
function renderMissions() {
  var el = document.getElementById('mission-list');
  if (!el) return;
  el.innerHTML = APP.missions.map(function(m, i) {
    return '<div style="display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid #f5f5f5">'
      + '<div style="background:#c8102e;color:#fff;width:22px;height:22px;border-radius:50%;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">'+(i+1)+'</div>'
      + '<div style="font-size:12px;color:#444;line-height:1.6">'+m+'</div></div>';
  }).join('');
}

// ── PERSONNEL ────────────────────────────────────────────────
function renderPersonList(filter) {
  var el = document.getElementById('person-list');
  if (!el) return;
  var list = filter ? APP.members.filter(function(m) { return m.dept === filter; }) : APP.members;
  el.innerHTML = list.map(function(m) {
    var ini = m.name.split(' ').map(function(w){return w[0];}).slice(-2).join('');
    return '<div class="person-card">'
      +'<div class="person-av" style="background:'+m.color+'">'+ini+'</div>'
      +'<div class="person-details">'
      +'<div class="person-name">'+m.name+'</div>'
      +'<div class="person-role-tag">'+m.role+'</div>'
      +'<div class="person-tags">'
      +'<span class="person-tag">📱 '+m.phone+'</span>'
      +'<span class="person-tag">📧 '+m.email+'</span>'
      +'<span class="person-tag">🎭 '+m.skill+'</span>'
      +'</div></div>'
      +'<div class="person-acts">'
      +'<button class="btn btn-gray btn-xs" onclick="toast(\'Xem chi tiết: '+m.name+'\',\'info\')">👁 Xem</button>'
      +'<button class="btn btn-orange btn-xs" onclick="toast(\'Chỉnh sửa: '+m.name+'\',\'info\')">✏ Sửa</button>'
      +'</div></div>';
  }).join('');
}

function filterPerson(dept, el) {
  document.querySelectorAll('#home-nhansu .chip').forEach(function(c) { c.classList.remove('active'); });
  el.classList.add('active');
  renderPersonList(dept === 'all' ? null : dept);
}

// ── ATTENDANCE ────────────────────────────────────────────────
function renderAttGrid() {
  var el = document.getElementById('att-grid');
  if (!el) return;
  var p=0, a=0, l=0;
  el.innerHTML = APP.attData.map(function(m, i) {
    var ini = m.name.split(' ').map(function(w){return w[0];}).slice(-2).join('');
    if(m.status==='present') p++;
    else if(m.status==='absent') a++;
    else l++;
    var sLabel = m.status==='present'?'Có mặt':m.status==='absent'?'Vắng mặt':'Đi muộn';
    var bClass = m.status==='present'?'badge-green':m.status==='absent'?'badge-red':'badge-orange';
    var chkClass = m.status==='present'?'on':m.status==='late'?'late':'';
    var chkTxt = m.status==='present'?'✓':m.status==='late'?'⌚':'';
    return '<div class="att-card" onclick="cycleAtt('+i+')">'
      +'<div class="att-av" style="background:'+m.color+'">'+ini+'</div>'
      +'<div class="att-info"><div class="att-name">'+m.name+'</div><div class="att-role">'+m.role+'</div></div>'
      +'<span class="badge '+bClass+'">'+sLabel+'</span>'
      +'<div class="att-check-btn '+chkClass+'" id="chk-'+i+'">'+chkTxt+'</div>'
      +'</div>';
  }).join('');
  var ep=document.getElementById('cnt-p');if(ep)ep.textContent=p;
  var ea=document.getElementById('cnt-a');if(ea)ea.textContent=a;
  var el2=document.getElementById('cnt-l');if(el2)el2.textContent=l;
}

function cycleAtt(i) {
  var cycle = ['present','absent','late'];
  var cur = APP.attData[i].status;
  APP.attData[i].status = cycle[(cycle.indexOf(cur)+1)%3];
  renderAttGrid();
  saveToStorage();
  toast('Điểm danh: '+APP.attData[i].name+' → '+(APP.attData[i].status==='present'?'Có mặt':APP.attData[i].status==='absent'?'Vắng mặt':'Đi muộn'), 'ok');
}

function renderAttHistory() {
  var el = document.getElementById('att-hist-body');
  if (!el) return;
  var days = ['T2','T3','T4','T5','T6'];
  el.innerHTML = APP.members.slice(0,6).map(function(m, i) {
    var row = '<tr><td>'+(i+1)+'</td><td>'+m.name+'</td>';
    var p=0,a=0,l=0;
    days.forEach(function() {
      var r = Math.random();
      if(r>0.15){row+='<td style="color:#2e7d32;text-align:center">✓</td>';p++;}
      else if(r>0.07){row+='<td style="color:#e65100;text-align:center">⌚</td>';l++;}
      else{row+='<td style="color:#c62828;text-align:center">✗</td>';a++;}
    });
    row+='<td class="num c-green">'+p+'</td><td class="num c-red">'+a+'</td><td class="num">'+l+'</td></tr>';
    return row;
  }).join('');
}

function renderAttStats() {
  var el = document.getElementById('att-stats-body');
  if (!el) return;
  el.innerHTML = APP.members.slice(0,6).map(function(m, i) {
    var p=18+Math.floor(Math.random()*4), a=Math.floor(Math.random()*3), l=Math.floor(Math.random()*2);
    var rate = Math.round(p/(p+a+l)*100);
    return '<tr><td>'+(i+1)+'</td><td>'+m.name+'</td><td>'+m.role+'</td>'
      +'<td class="num c-green">'+p+'</td><td class="num c-red">'+a+'</td><td class="num">'+l+'</td>'
      +'<td class="num c-green">'+rate+'%</td></tr>';
  }).join('');
}

// ── UNION ─────────────────────────────────────────────────────
function renderUnionTable() {
  var el = document.getElementById('union-tbl-body');
  if (!el) return;
  var total = 0;
  el.innerHTML = APP.unionTx.map(function(tx, i) {
    var sign = tx.type==='thu'?1:-1;
    total += sign * tx.amount;
    var fmtAmt = (tx.type==='thu'?'+':'-') + tx.amount.toLocaleString('vi-VN');
    var cls = tx.type==='thu'?'c-green':'c-red';
    var badge = tx.type==='thu'?'<span class="badge badge-green">THU</span>':'<span class="badge badge-red">CHI</span>';
    return '<tr><td>'+(i+1)+'</td><td>'+tx.date+'</td><td>'+badge+'</td><td>'+tx.content+'</td>'
      +'<td class="num '+cls+'">'+fmtAmt+'</td><td>'+tx.person+'</td><td>'+tx.note+'</td>'
      +'<td><button class="btn btn-orange btn-xs" onclick="editUnionTx('+tx.id+')">✏ Sửa</button></td></tr>';
  }).join('');
  var totEl = document.getElementById('union-total');
  if (totEl) {
    totEl.textContent = (total>=0?'+':'')+total.toLocaleString('vi-VN');
    totEl.className = 'num ' + (total>=0?'c-green':'c-red');
  }
}

function saveUnionTx() {
  var type = document.getElementById('u-type').value;
  var date = document.getElementById('u-date').value;
  var amount = parseInt(document.getElementById('u-amount').value);
  var content = (document.getElementById('u-content').value||'').trim();
  var person = document.getElementById('u-person').value;
  var note = (document.getElementById('u-note').value||'').trim();
  if (!amount || !content) { toast('Vui lòng nhập đầy đủ thông tin bắt buộc!'); return; }
  // Format date
  var d = new Date(date);
  var fdate = pad(d.getDate())+'/'+pad(d.getMonth()+1)+'/'+d.getFullYear();
  var tx = {id: Date.now(), date:fdate, type:type, content:content, amount:amount, person:person, note:note};
  APP.unionTx.unshift(tx);
  APP.recentTx.unshift(tx);
  renderUnionTable();
  renderRecentTx();
  clearUnionForm();
  saveToStorage();
  toast('Đã lưu giao dịch ' + (type==='thu'?'THU':'CHI') + ' thành công!', 'ok');
}

function renderRecentTx() {
  var el = document.getElementById('recent-tx');
  if (!el) return;
  if (APP.recentTx.length === 0) { el.innerHTML = '<span style="color:#999;font-style:italic">Chưa có giao dịch mới.</span>'; return; }
  el.innerHTML = APP.recentTx.slice(0,5).map(function(tx) {
    return '<div style="padding:8px;border-bottom:1px solid #f0f0f0;display:flex;gap:8px;align-items:center;font-size:12px">'
      +'<span class="badge '+(tx.type==='thu'?'badge-green':'badge-red')+'">'+(tx.type==='thu'?'THU':'CHI')+'</span>'
      +'<strong>'+tx.content+'</strong>'
      +' <span class="'+(tx.type==='thu'?'c-green':'c-red')+'">'+(tx.type==='thu'?'+':'-')+tx.amount.toLocaleString('vi-VN')+'đ</span>'
      +' <small style="color:#aaa;margin-left:auto">'+tx.person+' | '+tx.date+'</small>'
      +'</div>';
  }).join('');
}

function clearUnionForm() {
  document.getElementById('u-amount').value = '';
  document.getElementById('u-content').value = '';
  document.getElementById('u-note').value = '';
}

function editUnionTx(id) { toast('Chỉnh sửa giao dịch #' + id, 'info'); }

function loadUnionStats(period, btn) {
  setPeriod(btn);
  var d = {
    week:  {thu:'4.200.000', chi:'1.800.000', ton:'2.400.000', gd:'12'},
    month: {thu:'12.600.000', chi:'5.400.000', ton:'7.200.000', gd:'36'},
    year:  {thu:'52.000.000', chi:'22.000.000', ton:'30.000.000', gd:'144'},
  };
  var s = d[period];
  document.getElementById('u-thu').textContent = s.thu;
  document.getElementById('u-chi').textContent = s.chi;
  document.getElementById('u-ton').textContent = s.ton;
  document.getElementById('u-gd').textContent  = s.gd;
}

// ── NOTIFICATIONS ────────────────────────────────────────────
function renderNotifications() {
  var el = document.getElementById('notif-items');
  if (!el) return;
  el.innerHTML = APP.notifications.map(function(n) {
    return '<div class="notif-item'+(n.unread?' unread':'')+'" onclick="markRead('+n.id+')">'
      +'<div class="notif-icon">'+n.icon+'</div>'
      +'<div class="notif-body"><div class="notif-title">'+n.title+'</div><div class="notif-desc">'+n.desc+'</div><div class="notif-time">'+n.time+'</div></div>'
      +(n.unread?'<div class="notif-dot"></div>':'')
      +'</div>';
  }).join('');
}

function markRead(id) {
  var n = APP.notifications.find(function(x){return x.id===id;});
  if (n && n.unread) { n.unread = false; renderNotifications(); updateNotifBadge(); saveToStorage(); }
}

function updateNotifBadge() {
  var count = APP.notifications.filter(function(n){return n.unread;}).length;
  var badge = document.getElementById('notif-count');
  if (badge) { badge.textContent = count; badge.style.display = count ? '' : 'none'; }
}

function publishNotif() {
  var title = (document.getElementById('ntitle').value||'').trim();
  var body  = (document.getElementById('nbody').value||'').trim();
  if (!title || !body) { toast('Nhập đầy đủ tiêu đề và nội dung!'); return; }
  var d = new Date();
  var ts = pad(d.getDate())+'/'+pad(d.getMonth()+1)+'/'+d.getFullYear()+' – '+pad(d.getHours())+':'+pad(d.getMinutes());
  APP.notifications.unshift({id:Date.now(), icon:'📢', title:title, desc:body, time:ts, unread:true});
  document.getElementById('ntitle').value = '';
  document.getElementById('nbody').value  = '';
  renderNotifications();
  updateNotifBadge();
  saveToStorage();
  toast('Đã đăng thông báo!', 'ok');
  subTab('notif','list', document.querySelector('[onclick*="notif-list"]') || document.querySelector('.sub-tab'));
}

// ── PHOTO ALBUM ───────────────────────────────────────────────
function triggerUpload() { document.getElementById('fileInput').click(); }

function handleUpload(evt) {
  var files = Array.from(evt.target.files);
  var count = 0;
  files.forEach(function(file) {
    var reader = new FileReader();
    reader.onload = function(e) {
      APP.photos.push({id: Date.now()+Math.random(), name:file.name, src:e.target.result, cat:'su-kien', ts:Date.now()});
      count++;
      if (count === files.length) { renderPhotos(null); saveToStorage(); toast('Đã tải lên '+count+' ảnh!', 'ok'); }
    };
    reader.readAsDataURL(file);
  });
  evt.target.value = '';
}

function renderPhotos(filter) {
  var grid = document.getElementById('photo-grid');
  if (!grid) return;
  var list = filter && filter !== 'all' ? APP.photos.filter(function(p){return p.cat===filter;}) : APP.photos;
  var uploadSlot = '<div class="upload-zone" onclick="triggerUpload()">'
    +'<div class="upload-icon">📸</div>'
    +'<div class="upload-text">Nhấn để <strong>tải ảnh lên</strong></div>'
    +'</div>';
  grid.innerHTML = uploadSlot + list.map(function(photo) {
    var sel = APP.selectedPhotos.has(photo.id) ? ' sel' : '';
    return '<div class="photo-item'+sel+'" id="pi-'+photo.id+'">'
      +'<img src="'+photo.src+'" alt="'+photo.name+'" onclick="openLightbox(\''+photo.id+'\')" loading="lazy">'
      +'<div class="photo-overlay">'
      +'<button class="po-btn" onclick="openLightbox(\''+photo.id+'\');event.stopPropagation()">👁</button>'
      +'<button class="po-btn" onclick="openPhotoEditor(\''+photo.id+'\');event.stopPropagation()">✏</button>'
      +'<button class="po-btn" onclick="downloadPhoto(\''+photo.id+'\');event.stopPropagation()">⬇</button>'
      +'<button class="po-btn" onclick="deletePhoto(\''+photo.id+'\');event.stopPropagation()">🗑</button>'
      +'</div></div>';
  }).join('');
}

function filterAlbum(cat, el) {
  document.querySelectorAll('#album-chips .chip').forEach(function(c){c.classList.remove('active');});
  el.classList.add('active');
  renderPhotos(cat);
}

function openLightbox(id) {
  var p = APP.photos.find(function(x){return x.id==id;});
  if (!p) return;
  document.getElementById('lb-img').src = p.src;
  document.getElementById('lb-title').textContent = p.name;
  document.getElementById('lb-edit-btn').onclick = function(){ closeModal('lb'); openPhotoEditor(id); };
  document.getElementById('lb-dl-btn').onclick = function(){ downloadPhoto(id); };
  document.getElementById('lb-del-btn').onclick = function(){ closeModal('lb'); deletePhoto(id); };
  openModal('lb');
}

function openPhotoEditor(id) {
  var p = APP.photos.find(function(x){return x.id==id;});
  if (!p) return;
  APP.edRot=0; APP.edFH=false; APP.edFV=false; APP.edZoom=1; APP.edPhotoId=id;
  ['sl-bright','sl-cont','sl-sat'].forEach(function(sid){
    var s=document.getElementById(sid); if(s)s.value=0;
  });
  var canvas = document.getElementById('editor-canvas');
  APP.edCtx = canvas.getContext('2d');
  APP.edImg = new Image();
  APP.edImg.onload = function() { canvas.width=APP.edImg.width; canvas.height=APP.edImg.height; drawEditor(); };
  APP.edImg.src = p.src;
  openModal('editor');
}

function drawEditor() {
  if (!APP.edCtx || !APP.edImg) return;
  var c = document.getElementById('editor-canvas');
  var bright = parseInt(document.getElementById('sl-bright').value)||0;
  var cont   = parseInt(document.getElementById('sl-cont').value)||0;
  var sv_b   = document.getElementById('sv-bright'); if(sv_b) sv_b.textContent=bright;
  var sv_c   = document.getElementById('sv-cont');   if(sv_c) sv_c.textContent=cont;
  APP.edCtx.save();
  APP.edCtx.clearRect(0,0,c.width,c.height);
  APP.edCtx.translate(c.width/2, c.height/2);
  APP.edCtx.rotate(APP.edRot * Math.PI/180);
  APP.edCtx.scale((APP.edFH?-1:1)*APP.edZoom, (APP.edFV?-1:1)*APP.edZoom);
  APP.edCtx.filter = 'brightness('+(1+bright/100)+') contrast('+(1+cont/100)+')';
  APP.edCtx.drawImage(APP.edImg, -APP.edImg.width/2, -APP.edImg.height/2);
  APP.edCtx.restore();
}

function ea(act) {
  if(act==='rotL') APP.edRot -= 90;
  else if(act==='rotR') APP.edRot += 90;
  else if(act==='flipH') APP.edFH = !APP.edFH;
  else if(act==='flipV') APP.edFV = !APP.edFV;
  else if(act==='zoomIn') APP.edZoom = Math.min(4, APP.edZoom+0.25);
  else if(act==='zoomOut') APP.edZoom = Math.max(0.1, APP.edZoom-0.25);
  else if(act==='reset') { APP.edRot=0; APP.edFH=false; APP.edFV=false; APP.edZoom=1; ['sl-bright','sl-cont','sl-sat'].forEach(function(s){var el=document.getElementById(s);if(el)el.value=0;}); }
  drawEditor();
}

function saveEdited() {
  var c = document.getElementById('editor-canvas');
  var newSrc = c.toDataURL('image/jpeg', 0.92);
  var idx = APP.photos.findIndex(function(p){return p.id==APP.edPhotoId;});
  if (idx >= 0) APP.photos[idx].src = newSrc;
  renderPhotos(null);
  saveToStorage();
  closeModal('editor');
  toast('Đã lưu ảnh!', 'ok');
}

function downloadEdited() {
  var c = document.getElementById('editor-canvas');
  var a = document.createElement('a');
  a.href = c.toDataURL('image/jpeg', 0.92);
  a.download = 'sktk_edited.jpg';
  a.click();
  toast('Đang tải ảnh về...', 'ok');
}

function downloadPhoto(id) {
  var p = APP.photos.find(function(x){return x.id==id;});
  if (!p) return;
  var a = document.createElement('a'); a.href=p.src; a.download=p.name; a.click();
  toast('Đang tải: '+p.name, 'ok');
}

function deletePhoto(id) {
  if (!confirm('Xóa ảnh này?')) return;
  APP.photos = APP.photos.filter(function(p){return p.id!=id;});
  APP.selectedPhotos.delete(id);
  renderPhotos(null);
  saveToStorage();
  toast('Đã xóa ảnh!');
}

function toggleSelectAll() {
  if (APP.selectedPhotos.size === APP.photos.length) APP.selectedPhotos.clear();
  else APP.photos.forEach(function(p){APP.selectedPhotos.add(p.id);});
  renderPhotos(null);
}

function deleteSelected() {
  if (APP.selectedPhotos.size === 0) { toast('Chưa chọn ảnh nào!'); return; }
  if (!confirm('Xóa '+APP.selectedPhotos.size+' ảnh đã chọn?')) return;
  APP.photos = APP.photos.filter(function(p){return !APP.selectedPhotos.has(p.id);});
  APP.selectedPhotos.clear();
  renderPhotos(null);
  saveToStorage();
  toast('Đã xóa ảnh đã chọn!');
}

function downloadSelected() {
  if (APP.selectedPhotos.size === 0) { toast('Chưa chọn ảnh nào!'); return; }
  var sel = APP.photos.filter(function(p){return APP.selectedPhotos.has(p.id);});
  sel.forEach(function(p){ var a=document.createElement('a');a.href=p.src;a.download=p.name;a.click(); });
  toast('Đang tải '+sel.length+' ảnh...', 'ok');
}

// ── MODALS ────────────────────────────────────────────────────
function openModal(id) { var el=document.getElementById('modal-'+id); if(el)el.classList.add('open'); }
function closeModal(id) { var el=document.getElementById('modal-'+id); if(el)el.classList.remove('open'); }
function closeAllModals() { document.querySelectorAll('.modal-overlay').forEach(function(m){m.classList.remove('open');}); }

// ── EXPORT ────────────────────────────────────────────────────
function exportExcel(name) {
  if (typeof XLSX === 'undefined') { toast('Đang tải thư viện Excel...', 'info'); return; }
  // Build workbook data
  var data = buildExcelData(name);
  var wb = XLSX.utils.book_new();
  var ws = XLSX.utils.aoa_to_sheet(data);
  // Style header row
  ws['!cols'] = [{wch:5},{wch:20},{wch:15},{wch:25},{wch:15},{wch:15},{wch:15},{wch:15}];
  XLSX.utils.book_append_sheet(wb, ws, 'Dữ liệu');
  var today = new Date();
  var fname = 'SKTK_'+name+'_'+pad(today.getDate())+pad(today.getMonth()+1)+today.getFullYear()+'.xlsx';
  XLSX.writeFile(wb, fname);
  toast('Đã xuất file Excel: '+fname, 'ok');
}

function buildExcelData(name) {
  var today = new Date().toLocaleDateString('vi-VN');
  var header = [['PHÒNG SÂN KHẤU TẠP KỸ – BAN VĂN NGHỆ VTV'],['Báo cáo: ' + name.toUpperCase()],['Ngày xuất: ' + today],[]];
  if (name.includes('cong-doan') || name.includes('tk-congdoan')) {
    header.push(['#','Ngày','Loại','Nội dung','Số tiền (VNĐ)','Người TH','Ghi chú']);
    APP.unionTx.forEach(function(tx, i) {
      header.push([i+1, tx.date, tx.type.toUpperCase(), tx.content, (tx.type==='thu'?1:-1)*tx.amount, tx.person, tx.note]);
    });
    var total = APP.unionTx.reduce(function(s,t){return s+(t.type==='thu'?1:-1)*t.amount;},0);
    header.push(['','','','TỔNG CỘNG', total,'','']);
  } else if (name.includes('diemdanh')) {
    header.push(['#','Họ và tên','Chức vụ','Trạng thái','Thời gian']);
    APP.attData.forEach(function(m,i){
      header.push([i+1,m.name,m.role,m.status==='present'?'Có mặt':m.status==='absent'?'Vắng mặt':'Đi muộn',today]);
    });
  } else {
    header.push(['#','Nội dung','Giá trị','Ghi chú']);
    header.push([1,'Dữ liệu '+name,'---','']);
  }
  return header;
}

function exportWord(title) {
  var today = new Date().toLocaleDateString('vi-VN');
  var content = '<!DOCTYPE html><html><head><meta charset="UTF-8">'
    +'<style>body{font-family:Times New Roman,serif;margin:2cm}h1{color:#c8102e;text-align:center;font-size:16pt}h2{color:#1a3a6b;font-size:14pt}.header{text-align:center;border-bottom:2px solid #c8102e;padding-bottom:12px;margin-bottom:20px}.date{text-align:right;color:#666;font-size:11pt}table{width:100%;border-collapse:collapse;margin-top:16px}th{background:#c8102e;color:white;padding:8px;font-size:11pt}td{padding:7px;border:1px solid #ddd;font-size:10.5pt}tr:nth-child(even)td{background:#fff5f5}.footer{margin-top:30px;text-align:center;color:#888;font-size:10pt;border-top:1px solid #eee;padding-top:12px}</style>'
    +'</head><body>'
    +'<div class="header"><h1>PHÒNG SÂN KHẤU TẠP KỸ – BAN VĂN NGHỆ VTV</h1><h2>'+title+'</h2></div>'
    +'<div class="date">Ngày xuất: '+today+'</div>'
    +'<p>Kính gửi: Ban lãnh đạo và toàn thể cán bộ nhân viên Phòng Sân Khấu Tạp Kỹ</p>'
    +'<p>Nội dung báo cáo <strong>'+title+'</strong> được tổng hợp từ hệ thống SKTK V12.</p>';
  content += '<div class="footer">Trân trọng.<br>Phòng Sân Khấu Tạp Kỹ – Ban Văn Nghệ VTV<br>SKTK V12 © 2026</div></body></html>';
  var blob = new Blob(['\ufeff'+content], {type:'application/msword;charset=utf-8'});
  var today2 = new Date();
  var fname = 'SKTK_'+title.replace(/ /g,'_')+'_'+pad(today2.getDate())+pad(today2.getMonth()+1)+today2.getFullYear()+'.doc';
  var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = fname; a.click();
  toast('Đã xuất file Word: '+fname, 'ok');
}

// ── TOAST ────────────────────────────────────────────────────
function toast(msg, type) {
  var wrap = document.getElementById('toast-wrap');
  if (!wrap) return;
  var div = document.createElement('div');
  div.className = 'toast' + (type ? ' '+type : '');
  div.textContent = msg;
  wrap.appendChild(div);
  setTimeout(function(){ div.style.opacity='0'; div.style.transform='translateX(16px)'; div.style.transition='.3s'; setTimeout(function(){div.remove();},300); }, 3000);
}
