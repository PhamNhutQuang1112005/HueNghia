/* =========================================================
   ADMIN.JS — Trang Admin "Quản lý nhà xe"
   Nhà xe Huệ Nghĩa Express
   =========================================================

   Trung tâm quản trị: Hướng → Tuyến → Chuyến, Xe, Nhân viên. KHÔNG có DB/API
   riêng — dùng CHUNG localStorage với ticketstaff.html:
     - Hướng/Tuyến/Loại xe/Xe/Nhân viên  → window.FleetStore (js/shared/fleet-store.js)
     - Chuyến (phơi)                      → HN_TRIPS_KEY 'hn_trips_meta_v9'  (+ seat bank HN_STORAGE_KEY)
     - Phơi tài chính bất biến            → 'hn_ts_manifests_v1'  → CHỈ ĐỌC, không CRUD
   "Quản lý chuyến" bê nguyên pattern tab "Quản lý phơi" của ticketstaff
   (applyFilters / renderTable / saveSingleTrip trong js/ticketstaff.js).

   Nạp SAU storage-keys/format/constants/seat-bank/fleet-store, TRƯỚC events.js.
   ========================================================= */

/* ---------------------------------------------------------
   GUARD — trang duy nhất có kiểm tra vai trò. Các trang khác (ticketstaff/
   shuttle) cố tình KHÔNG chặn, giữ nguyên hiện trạng hệ thống demo.
   --------------------------------------------------------- */
(function adminGuard() {
  var u = null;
  try { u = JSON.parse(sessionStorage.getItem(HN_CURRENT_USER_KEY) || 'null'); } catch (e) {}
  if (!u || u.role !== 'admin') {
    location.replace('index.html');
  }
})();

var TS_MANIFESTS_KEY = 'hn_ts_manifests_v1'; // khai báo trong ticketstaff-manifest-core.js (không nạp ở đây)
var TRIP_STATUSES = ['Chưa chỉ định xe', 'Đã chỉ định xe', 'Đang bán', 'Đã khởi hành', 'Đã hủy'];
var STATUS_CLASS = {
  'Chưa chỉ định xe': 'chua-chi-dinh',
  'Đã chỉ định xe': 'da-chi-dinh',
  'Đang bán': 'dang-ban',
  'Đã khởi hành': 'da-khoi-hanh',
  'Đã hủy': 'da-huy'
};

/* ---------------------------------------------------------
   HELPERS
   --------------------------------------------------------- */
function $(id) { return document.getElementById(id); }
function esc(s) { return (typeof escapeHtml === 'function') ? escapeHtml(s) : String(s == null ? '' : s); }
function fmtMoney(n) { return (Number(n) || 0).toLocaleString('vi-VN') + 'đ'; }
function todayISO() { return new Date().toISOString().slice(0, 10); }
function fmtDate(iso) {
  if (!iso || typeof iso !== 'string') return '—';
  var p = iso.split('-');
  return p.length === 3 ? (p[2] + '/' + p[1] + '/' + p[0]) : iso;
}
function fmtStamp(ts) {
  var d = new Date(ts);
  if (isNaN(d)) return '—';
  var pad = function (x) { return String(x).padStart(2, '0'); };
  return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}

var _toastTimer = null;
function showToast(msg) {
  var t = $('toast');
  $('toastText').textContent = msg;
  t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2800);
}

function openAdminModal(html, wide, fill) {
  var box = $('adminModalBox');
  box.innerHTML = html;
  box.classList.toggle('modal-wide', !!wide);
  box.classList.toggle('modal-fill', !!fill);
  $('adminModal').classList.add('open');
}
function closeAdminModal() { $('adminModal').classList.remove('open'); }
function closeModal(id) { var m = $(id); if (m) m.classList.remove('open'); } // cho data-action="closeModal"

/* localStorage đọc/ghi cho khoá KHÔNG thuộc FleetStore */
function lsRead(key, fallback) {
  try {
    var raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    var v = JSON.parse(raw);
    return v == null ? fallback : v;
  } catch (e) { return fallback; }
}
function lsWrite(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

function getTrips() { return lsRead(HN_TRIPS_KEY, []); }
function setTrips(list) { lsWrite(HN_TRIPS_KEY, list); }
function getManifests() { return lsRead(TS_MANIFESTS_KEY, {}); }

/* ---------------------------------------------------------
   USER MENU  (port initUserMenu() từ ticketstaff.js — cùng id DOM)
   --------------------------------------------------------- */
function initAdminUserMenu() {
  var u = null;
  try { u = JSON.parse(sessionStorage.getItem(HN_CURRENT_USER_KEY) || 'null'); } catch (e) {}
  var name = (u && u.username) || 'Quản trị viên';
  $('userName').textContent = name;
  $('userUsername').textContent = (u && u.username) || '—';
  $('userRoleLabel').textContent = (u && u.roleLabel) || 'Quản trị viên hệ thống';
  $('userAvatar').textContent = (name[0] || 'A').toUpperCase();
}
function toggleAdminUserMenu() { $('userMenu').classList.toggle('open'); }
function adminLogout() {
  sessionStorage.removeItem(HN_CURRENT_USER_KEY);
  window.location.href = 'index.html';
}
document.addEventListener('click', function (e) {
  var m = $('userMenu');
  if (m && m.classList.contains('open') && !m.contains(e.target)) m.classList.remove('open');
});

/* ---------------------------------------------------------
   VIEW ROUTING
   --------------------------------------------------------- */
var CURRENT_VIEW = 'viewDashboard';
var VIEW_RENDERERS = {
  viewDashboard: renderDashboard,
  viewDirections: renderDirectionsView,
  viewTrips: renderTripsView,
  viewVehicles: renderVehiclesView,
  viewStaff: renderStaffView,
  viewAccounts: renderAccountsView,
  viewActivity: renderActivityView,
  viewSettings: renderSettingsView
};

function switchAdminView(view) {
  if (!VIEW_RENDERERS[view]) return;
  CURRENT_VIEW = view;
  document.querySelectorAll('.admin-view').forEach(function (s) { s.hidden = s.id !== view; });
  document.querySelectorAll('.admin-nav-item').forEach(function (b) {
    var a = b.getAttribute('data-args') || '';
    b.classList.toggle('active', a.indexOf('"' + view + '"') !== -1);
  });
  VIEW_RENDERERS[view]();
}

/* Admin sửa dữ liệu ở tab khác → render lại view đang mở. */
window.addEventListener('storage', function (e) {
  if (!e.key) return;
  var watched = [HN_DIRECTIONS_KEY, HN_ROUTES_KEY, HN_STATIONS_KEY, HN_VEHICLE_TYPES_KEY, HN_VEHICLES_KEY, HN_STAFF_KEY, HN_TRIPS_KEY, HN_ADMIN_ACTIVITY_KEY];
  if (watched.indexOf(e.key) !== -1 && VIEW_RENDERERS[CURRENT_VIEW]) VIEW_RENDERERS[CURRENT_VIEW]();
});

/* =========================================================
   1. DASHBOARD
   ========================================================= */
function renderDashboard() {
  var trips = getTrips();
  var today = todayISO();
  var byStatus = {};
  TRIP_STATUSES.forEach(function (s) { byStatus[s] = 0; });
  trips.forEach(function (t) { var s = (t && t.status) || 'Chưa chỉ định xe'; byStatus[s] = (byStatus[s] || 0) + 1; });
  var todayTrips = trips.filter(function (t) { return t && t.date === today; });

  var dirs = FleetStore.getDirections();
  var routes = FleetStore.getRoutes();
  var vehLine = FleetStore.getVehicles({ scope: 'line' });
  var vehShuttle = FleetStore.getVehicles({ scope: 'shuttle' });
  var staff = FleetStore.getStaff();
  var manifests = Object.keys(getManifests()).length;

  var cards = [
    ['Tổng số hướng', dirs.filter(activeOf).length + ' / ' + dirs.length],
    ['Tổng số tuyến', routes.filter(activeOf).length + ' / ' + routes.length],
    ['Tổng số trạm', FleetStore.getStations().length],
    ['Tổng số chuyến', trips.length],
    ['Phơi đã lập (tài chính)', manifests],
    ['Xe tuyến', vehLine.filter(activeOf).length],
    ['Xe trung chuyển', vehShuttle.filter(activeOf).length],
    ['Nhân viên', staff.filter(activeOf).length],
    ['Chuyến hôm nay', todayTrips.length],
    ['Đang bán', byStatus['Đang bán'] || 0],
    ['Đã khởi hành', byStatus['Đã khởi hành'] || 0],
    ['Đã hủy', byStatus['Đã hủy'] || 0],
    ['Chưa chỉ định xe', byStatus['Chưa chỉ định xe'] || 0]
  ];

  var rows = todayTrips.length
    ? todayTrips.sort(byTime).map(function (t) {
        return '<tr><td>' + esc(t.time || '—') + '</td><td>' + esc(t.route || '—') + '</td><td>' + esc(t.plate || '—') +
          '</td><td>' + statusBadge(t.status) + '</td></tr>';
      }).join('')
    : '<tr><td colspan="4" class="empty-state">Chưa có chuyến nào cho hôm nay.</td></tr>';

  $('viewDashboard').innerHTML =
    '<div class="stat-grid">' + cards.map(function (c) {
      return '<div class="stat-card"><div class="k">' + esc(c[0]) + '</div><div class="v ' + (String(c[1]).length > 5 ? 'small' : '') + '">' + esc(c[1]) + '</div></div>';
    }).join('') + '</div>' +
    '<h3>Chuyến hôm nay (' + fmtDate(today) + ')</h3>' +
    '<div class="table-wrap"><table class="admin-table"><thead><tr><th>Giờ</th><th>Tuyến</th><th>Biển số</th><th>Trạng thái</th></tr></thead><tbody>' +
    rows + '</tbody></table></div>';
}
function activeOf(x) { return x && x.active !== false; }
// Tag trạng thái Bật/Tắt cho cột "Trạng thái".
function activeTag(on) {
  return on
    ? '<span class="badge badge-on">Bật</span>'
    : '<span class="badge badge-off">Tắt</span>';
}
function byTime(a, b) { return String(a.time || '').localeCompare(String(b.time || '')); }
function byOrder(a, b) { return (a.order || 0) - (b.order || 0); }
function statusBadge(s) {
  s = s || 'Chưa chỉ định xe';
  return '<span class="status-badge ' + (STATUS_CLASS[s] || 'chua-chi-dinh') + '">' + esc(s) + '</span>';
}

/* =========================================================
   2. QUẢN LÝ TRẠM
   - Danh mục trạm theo 3 địa điểm: Sài Gòn / Bình Dương / An Giang
   - 4 hướng chính, mỗi hướng có các tuyến chính
   - Chọn một tuyến chính → thêm "Trạm có thể nhận" lấy từ danh mục trạm của từng địa điểm
   ========================================================= */
var SELECTED_DIR_ID = null;
var SELECTED_ROUTE_ID = null;
var STATION_GROUPS = [['fromStations', 'Trạm điểm đi'], ['toStations', 'Trạm điểm đến'], ['pickupStations', 'Trạm có thể nhận thêm khách']];
var REGION_META = [['saigon', 'Trạm Sài Gòn'], ['binhduong', 'Trạm Bình Dương'], ['angiang', 'Trạm An Giang']];

function renderDirectionsView() {
  var dirs = FleetStore.getDirections().slice().sort(byOrder);
  var routes = FleetStore.getRoutes();
  var stations = FleetStore.getStations();
  if (!SELECTED_DIR_ID || !dirs.some(function (d) { return d.id === SELECTED_DIR_ID; })) {
    SELECTED_DIR_ID = dirs.length ? dirs[0].id : null;
  }

  // ----- Danh mục trạm theo địa điểm -----
  var locCards = REGION_META.map(function (rm) {
    var region = rm[0], title = rm[1];
    var st = stations.filter(function (s) { return s.region === region; });
    var chips = st.map(function (s) {
      return '<span class="chip">' + esc(s.name) +
        '<button title="Xoá trạm" data-action="adminRemoveLocationStation" data-args=\'["' + esc(s.name) + '"]\'>&times;</button></span>';
    }).join('') || '<span class="hint-inline">Chưa có trạm.</span>';
    return '<div class="loc-card">' +
      '<div class="loc-card-head"><span>' + esc(title) + ' <span class="sp-count">' + st.length + '</span></span>' +
        '<button class="btn btn-sm btn-primary" data-action="adminAddLocationStation" data-args=\'["' + region + '"]\'>+ Thêm trạm</button></div>' +
      '<div class="chip-editor">' + chips + '</div>' +
    '</div>';
  }).join('');

  // ----- Hướng & tuyến chính -----
  var rows = dirs.map(function (d) {
    var cnt = routes.filter(function (r) { return r.directionId === d.id; }).length;
    return '<div class="dir-row ' + (d.id === SELECTED_DIR_ID ? 'active' : '') + '" data-action="adminSelectDirection" data-args=\'["' + esc(d.id) + '"]\'>' +
      '<span class="dir-label">' + esc(d.label) + '</span>' +
      '<span class="dir-count">' + cnt + ' tuyến</span>' +
      activeTag(activeOf(d)) +
      '</div>';
  }).join('') || '<div class="empty-state">Chưa có hướng nào.</div>';

  var sel = dirs.find(function (d) { return d.id === SELECTED_DIR_ID; });
  var selRoutes = sel ? routes.filter(function (r) { return r.directionId === sel.id; }).sort(byOrder) : [];
  if (SELECTED_ROUTE_ID && !selRoutes.some(function (r) { return r.id === SELECTED_ROUTE_ID; })) SELECTED_ROUTE_ID = null;
  var right = sel ? renderDirectionDetail(sel, selRoutes) :
    '<div class="empty-state">Chọn một hướng ở cột trái.</div>';

  $('viewDirections').innerHTML =
    '<h3>Trạm theo địa điểm</h3>' +
    '<div class="loc-grid">' + locCards + '</div>' +
    '<h3>Hướng &amp; tuyến chính</h3>' +
    '<div class="hier">' +
      '<div class="pane"><div class="pane-head"><span>Hướng chính</span>' +
        '<button class="btn btn-sm btn-primary" data-action="adminOpenDirectionModal">+ Thêm hướng</button></div>' +
        rows +
      '</div>' +
      '<div class="pane">' + right + '</div>' +
    '</div>';
}

function adminAddLocationStation(region) {
  var name = (prompt('Tên trạm mới:') || '').trim();
  if (!name) return;
  if (!FleetStore.addStation(name, region)) { showToast('Trạm "' + name + '" đã có trong danh mục.'); return; }
  FleetStore.log({ action: 'create', entity: 'station', entityId: name, summary: 'Thêm trạm "' + name + '"' });
  showToast('Đã thêm trạm.');
  renderDirectionsView();
}
function adminRemoveLocationStation(name) {
  var used = FleetStore.stationUsage(name);
  var msg = used ? 'Trạm "' + name + '" đang dùng ở ' + used + ' tuyến. Xoá trạm và gỡ khỏi các tuyến đó?' : 'Xoá trạm "' + name + '"?';
  if (!confirm(msg)) return;
  FleetStore.removeStation(name);
  FleetStore.log({ action: 'delete', entity: 'station', entityId: name, summary: 'Xoá trạm "' + name + '"' + (used ? ' (gỡ khỏi ' + used + ' tuyến)' : '') });
  showToast('Đã xoá trạm.');
  renderDirectionsView();
}

function renderDirectionDetail(d, routes) {
  var routeRows = routes.length ? routes.map(function (r) {
    var stnCount = (r.fromStations || []).length + (r.toStations || []).length + (r.pickupStations || []).length;
    var expanded = r.id === SELECTED_ROUTE_ID;
    var main = '<tr class="' + (expanded ? 'is-selected' : '') + '"><td class="mono">' + esc(r.abbr || '—') + '</td><td>' + esc(r.label) + '</td><td class="num">' + fmtMoney(r.price) + '</td>' +
      '<td class="num">' + stnCount + '</td>' +
      '<td class="col-status">' + activeTag(activeOf(r)) + '</td>' +
      '<td class="row-actions">' +
        '<button class="btn btn-sm" data-action="adminToggleRouteStations" data-args=\'["' + esc(r.id) + '"]\'>' + (expanded ? 'Ẩn trạm' : 'Trạm') + '</button>' +
        '<button class="btn btn-sm" data-action="adminOpenRouteModal" data-args=\'["' + esc(r.id) + '"]\'>Sửa</button>' +
        '<button class="btn btn-sm btn-danger" data-action="adminDeleteRoute" data-args=\'["' + esc(r.id) + '"]\'>Xoá</button>' +
      '</td></tr>';
    if (!expanded) return main;
    return main + '<tr class="is-selected"><td colspan="6" style="padding:12px 16px;background:var(--surface-2);">' + renderRouteStationEditor(r) + '</td></tr>';
  }).join('') : '<tr><td colspan="6" class="empty-state">Hướng này chưa có tuyến nào.</td></tr>';

  return '<div class="pane-head"><span>' + esc(d.label) + '</span>' +
    '<span style="display:flex;gap:6px;">' +
      '<button class="btn btn-sm" data-action="adminToggleDirectionActive" data-args=\'["' + esc(d.id) + '"]\'>' + (activeOf(d) ? 'Tắt hướng' : 'Bật hướng') + '</button>' +
      '<button class="btn btn-sm" data-action="adminOpenDirectionModal" data-args=\'["' + esc(d.id) + '"]\'>Sửa hướng</button>' +
      '<button class="btn btn-sm btn-danger" data-action="adminDeleteDirection" data-args=\'["' + esc(d.id) + '"]\'>Xoá hướng</button>' +
    '</span></div>' +
    '<div class="pane-head" style="border-top:1px solid var(--surface);"><span>Tuyến chính của hướng này</span>' +
      '<button class="btn btn-sm btn-primary" data-action="adminOpenRouteModal" data-args=\'["","' + esc(d.id) + '"]\'>+ Thêm tuyến</button></div>' +
    '<div class="table-wrap" style="border:0;border-radius:0;"><table class="admin-table"><thead><tr><th>Mã</th><th>Tên tuyến chính</th><th class="num">Giá vé</th><th class="num">Trạm</th><th class="col-status">Trạng thái</th><th class="th-actions">Thao tác</th></tr></thead><tbody>' +
    routeRows + '</tbody></table></div>';
}

function renderRouteStationEditor(r) {
  return '<div style="font-weight:700;font-size:13px;margin-bottom:8px;">Trạm của tuyến: ' + esc(r.label) + '</div>' +
    STATION_GROUPS.map(function (g) {
      var kind = g[0], title = g[1];
      var chips = (r[kind] || []).map(function (s, i) {
        return '<span class="chip">' + esc(s) + '<button data-action="adminRemoveRouteStation" data-args=\'["' + esc(r.id) + '","' + kind + '",' + i + ']\'>&times;</button></span>';
      }).join('');
      return '<div style="margin-bottom:10px;">' +
        '<div class="grp-label">' + title + '</div>' +
        '<div class="chip-editor">' + (chips || '<span class="hint-inline">Chưa có trạm.</span>') +
          '<button class="btn btn-sm btn-ghost" data-action="adminOpenStationPicker" data-args=\'["' + esc(r.id) + '","' + kind + '"]\'>+ chọn trạm</button>' +
        '</div>' +
      '</div>';
    }).join('');
}

function adminSelectDirection(id) { SELECTED_DIR_ID = id; SELECTED_ROUTE_ID = null; renderDirectionsView(); }
function adminToggleRouteStations(id) { SELECTED_ROUTE_ID = (SELECTED_ROUTE_ID === id) ? null : id; renderDirectionsView(); }

// Suy chiều nội bộ từ tên hướng (để bộ lọc "Chiều đi / Chiều về" ở TicketStaff vẫn chạy) — KHÔNG hiển thị.
function senseFromLabel(label) {
  return /^\s*(Sài Gòn|Bình Dương)\b/i.test(label || '') ? 'di' : 've';
}

function adminOpenDirectionModal(id) {
  var d = id ? FleetStore.getDirections().find(function (x) { return x.id === id; }) : null;
  openAdminModal(
    '<h3>' + (d ? 'Sửa hướng' : 'Thêm hướng') + '</h3>' +
    '<form class="admin-form" data-submit-action="adminSaveDirection" data-args=\'["__event__"]\'>' +
      '<input type="hidden" id="dmId" value="' + (d ? esc(d.id) : '') + '">' +
      '<div class="fld"><label>Tên hướng *</label><input id="dmLabel" required value="' + (d ? esc(d.label) : '') + '" placeholder="VD: Sài Gòn - An Giang"></div>' +
      '<div class="fld"><label>Mã hướng (id) *</label><input id="dmKey" required value="' + (d ? esc(d.id) : '') + '" ' + (d ? 'readonly' : '') + ' placeholder="vd: sg-ag"></div>' +
      '<div class="fld"><label><input type="checkbox" id="dmActive" ' + (!d || activeOf(d) ? 'checked' : '') + '> Đang hoạt động</label></div>' +
      '<div class="modal-actions"><button type="button" class="btn" data-action="closeAdminModal">Huỷ</button><button type="submit" class="btn btn-primary">Lưu</button></div>' +
    '</form>'
  );
}

function adminSaveDirection(e) {
  e.preventDefault();
  var id0 = $('dmId').value;
  var key = $('dmKey').value.trim();
  var label = $('dmLabel').value.trim();
  if (!key || !label) { showToast('Nhập đủ Tên hướng và Mã hướng.'); return; }
  var list = FleetStore.getDirections();
  if (!id0 && list.some(function (x) { return x.id === key; })) { showToast('Mã hướng đã tồn tại.'); return; }
  var active = $('dmActive').checked;

  if (id0) {
    var d = list.find(function (x) { return x.id === id0; });
    var before = JSON.parse(JSON.stringify(d));
    d.label = label; d.active = active; d.sense = senseFromLabel(label);
    FleetStore.setDirections(list);
    FleetStore.log({ action: 'update', entity: 'direction', entityId: id0, summary: 'Sửa hướng ' + label, before: before, after: d });
  } else {
    var maxOrder = list.reduce(function (m, x) { return Math.max(m, x.order || 0); }, -1);
    var nd = { id: key, label: label, sense: senseFromLabel(label), active: active, order: maxOrder + 1 };
    list.push(nd);
    FleetStore.setDirections(list);
    FleetStore.log({ action: 'create', entity: 'direction', entityId: key, summary: 'Thêm hướng ' + label, after: nd });
    SELECTED_DIR_ID = key;
  }
  closeAdminModal();
  showToast('Đã lưu hướng.');
  renderDirectionsView();
}

function adminToggleDirectionActive(id) {
  var list = FleetStore.getDirections();
  var d = list.find(function (x) { return x.id === id; });
  if (!d) return;
  d.active = !activeOf(d);
  FleetStore.setDirections(list);
  FleetStore.log({ action: 'toggle', entity: 'direction', entityId: id, summary: (d.active ? 'Bật' : 'Tắt') + ' hướng ' + d.label });
  showToast(d.active ? 'Đã bật hướng.' : 'Đã tắt hướng.');
  renderDirectionsView();
}

function adminDeleteDirection(id) {
  var chk = FleetStore.canDeleteDirection(id);
  if (!chk.ok) { showToast('Không thể xoá: ' + chk.reason); return; }
  if (!confirm('Xoá hướng này?')) return;
  var list = FleetStore.getDirections().filter(function (x) { return x.id !== id; });
  FleetStore.setDirections(list);
  FleetStore.log({ action: 'delete', entity: 'direction', entityId: id, summary: 'Xoá hướng ' + id });
  showToast('Đã xoá hướng.');
  renderDirectionsView();
}

/* ---- Trạm của tuyến ---- */
function mutateRoute(id, fn) {
  var list = FleetStore.getRoutes();
  var r = list.find(function (x) { return x.id === id; });
  if (!r) return;
  fn(r);
  FleetStore.setRoutes(list);
}
function adminRemoveRouteStation(routeId, kind, idx) {
  var removed = '';
  mutateRoute(routeId, function (r) {
    if (!Array.isArray(r[kind])) return;
    removed = r[kind][idx];
    r[kind].splice(idx, 1);
  });
  FleetStore.log({ action: 'update', entity: 'route', entityId: routeId, summary: 'Bỏ trạm "' + removed + '" khỏi ' + kind });
  renderDirectionsView();
}
function adminOpenStationPicker(routeId, kind) {
  var r = FleetStore.getRoutes().find(function (x) { return x.id === routeId; });
  if (!r) return;
  var groupLabel = (STATION_GROUPS.filter(function (g) { return g[0] === kind; })[0] || ['', 'Trạm'])[1];
  var chosen = {};
  (r[kind] || []).forEach(function (s) { chosen[s] = true; });
  var byRegion = { saigon: [], binhduong: [], angiang: [], '': [] };
  FleetStore.getStations().forEach(function (s) { (byRegion[s.region] || byRegion['']).push(s.name); });
  var regionTitle = { saigon: 'Trạm Sài Gòn', binhduong: 'Trạm Bình Dương', angiang: 'Trạm An Giang', '': 'Trạm khác' };
  var groupsHtml = Object.keys(byRegion).filter(function (k) { return byRegion[k].length; }).map(function (k) {
    return '<div class="sp-region">' +
      '<div class="grp-label">' + regionTitle[k] + ' <span class="sp-count">' + byRegion[k].length + '</span></div>' +
      '<div class="chip-editor">' + byRegion[k].map(function (n) {
        var a = esc(n);
        return '<label class="chip sp-opt" title="' + a + '"><input type="checkbox" value="' + a + '"' + (chosen[n] ? ' checked' : '') + '><span>' + a + '</span></label>';
      }).join('') + '</div>' +
    '</div>';
  }).join('');
  openAdminModal(
    '<h3>Chọn trạm — ' + esc(groupLabel) + '</h3>' +
    '<form class="admin-form" data-submit-action="adminSaveStationPick" data-args=\'["__event__"]\'>' +
      '<p class="sp-hint hint-inline">Tuyến: <b>' + esc(r.label) + '</b></p>' +
      '<input type="hidden" id="spRoute" value="' + esc(routeId) + '"><input type="hidden" id="spKind" value="' + esc(kind) + '">' +
      '<div class="sp-list" id="spList">' + (groupsHtml || '<span class="hint-inline">Danh mục trạm trống.</span>') + '</div>' +
      '<div class="fld sp-addfld"><label>Thêm trạm mới vào danh mục</label>' +
        '<div class="sp-addrow">' +
          '<input id="spNew" placeholder="Tên trạm mới">' +
          '<select id="spNewRegion"><option value="">— chọn vùng —</option><option value="saigon">Sài Gòn</option><option value="binhduong">Bình Dương</option><option value="angiang">An Giang</option></select>' +
        '</div></div>' +
      '<div class="modal-actions"><button type="button" class="btn" data-action="closeAdminModal">Huỷ</button><button type="submit" class="btn btn-primary">Lưu</button></div>' +
    '</form>',
    false, true
  );
}
function adminSaveStationPick(e) {
  e.preventDefault();
  var routeId = $('spRoute').value, kind = $('spKind').value;
  var picked = Array.prototype.map.call($('spList').querySelectorAll('input[type=checkbox]:checked'), function (c) { return c.value; });
  var newName = ($('spNew').value || '').trim();
  if (newName) {
    FleetStore.addStation(newName, $('spNewRegion').value);
    if (picked.indexOf(newName) === -1) picked.push(newName);
  }
  mutateRoute(routeId, function (r) { r[kind] = picked; });
  FleetStore.log({ action: 'update', entity: 'route', entityId: routeId, summary: 'Cập nhật ' + kind + ' (' + picked.length + ' trạm)' });
  closeAdminModal();
  showToast('Đã lưu trạm.');
  renderDirectionsView();
}

function adminOpenRouteModal(id, directionId) {
  var routes = FleetStore.getRoutes();
  var r = id ? routes.find(function (x) { return x.id === id; }) : null;
  var dirs = FleetStore.getDirections().slice().sort(byOrder);
  var parentId = r ? r.directionId : (directionId || SELECTED_DIR_ID || (dirs[0] && dirs[0].id));
  openAdminModal(
    '<h3>' + (r ? 'Sửa tuyến' : 'Thêm tuyến') + '</h3>' +
    '<form class="admin-form" data-submit-action="adminSaveRoute" data-args=\'["__event__"]\'>' +
      '<input type="hidden" id="rmId" value="' + (r ? esc(r.id) : '') + '">' +
      '<div class="fld"><label>Thuộc hướng *</label><select id="rmDir">' +
        dirs.map(function (d) { return '<option value="' + esc(d.id) + '"' + (d.id === parentId ? ' selected' : '') + '>' + esc(d.label) + '</option>'; }).join('') +
      '</select></div>' +
      '<div class="fld"><label>Tên tuyến * <span class="hint-inline">(chuỗi này được lưu vào mọi phơi — đổi tên sẽ không tự sửa phơi cũ)</span></label>' +
        '<input id="rmLabel" required value="' + (r ? esc(r.label) : '') + '" placeholder="VD: Sài Gòn - Long Xuyên"></div>' +
      '<div class="fld-row">' +
        '<div class="fld"><label>Mã tuyến</label><input id="rmAbbr" value="' + (r ? esc(r.abbr || '') : '') + '" placeholder="SG-LX"></div>' +
        '<div class="fld"><label>Giá vé (đ) *</label><input id="rmPrice" type="number" min="0" step="5000" required value="' + (r ? (r.price || 0) : '') + '"></div>' +
      '</div>' +
      '<div class="fld"><label><input type="checkbox" id="rmActive" ' + (!r || activeOf(r) ? 'checked' : '') + '> Đang hoạt động</label></div>' +
      '<div class="hint-inline">Sau khi lưu, bấm "Trạm" ở dòng tuyến để chọn trạm đi / đến / đón.</div>' +
      '<div class="modal-actions"><button type="button" class="btn" data-action="closeAdminModal">Huỷ</button><button type="submit" class="btn btn-primary">Lưu</button></div>' +
    '</form>'
  );
}

function adminSaveRoute(e) {
  e.preventDefault();
  var id0 = $('rmId').value;
  var label = $('rmLabel').value.trim();
  var dirId = $('rmDir').value;
  var price = parseInt($('rmPrice').value, 10) || 0;
  if (!label || !dirId) { showToast('Nhập đủ Tên tuyến và hướng.'); return; }
  var list = FleetStore.getRoutes();
  if (list.some(function (x) { return x.label === label && x.id !== id0; })) { showToast('Tên tuyến đã tồn tại.'); return; }
  var abbr = $('rmAbbr').value.trim();
  var active = $('rmActive').checked;

  if (id0) {
    var r = list.find(function (x) { return x.id === id0; });
    var before = JSON.parse(JSON.stringify(r));
    r.label = label; r.directionId = dirId; r.price = price; r.abbr = abbr; r.active = active;
    FleetStore.setRoutes(list);
    FleetStore.log({ action: 'update', entity: 'route', entityId: id0, summary: 'Sửa tuyến ' + label, before: before, after: r });
  } else {
    var newId = dirId + '-' + Date.now().toString(36);
    var maxOrder = list.filter(function (x) { return x.directionId === dirId; }).reduce(function (m, x) { return Math.max(m, x.order || 0); }, -1);
    var nr = { id: newId, directionId: dirId, label: label, abbr: abbr, price: price, active: active, order: maxOrder + 1, fromStations: [], toStations: [], pickupStations: [] };
    list.push(nr);
    FleetStore.setRoutes(list);
    FleetStore.log({ action: 'create', entity: 'route', entityId: newId, summary: 'Thêm tuyến ' + label, after: nr });
    SELECTED_ROUTE_ID = newId;
  }
  SELECTED_DIR_ID = dirId;
  closeAdminModal();
  showToast('Đã lưu tuyến.');
  renderDirectionsView();
}

function adminDeleteRoute(id) {
  var chk = FleetStore.canDeleteRoute(id);
  if (!chk.ok) { showToast('Không thể xoá: ' + chk.reason); return; }
  if (!confirm('Xoá tuyến này?')) return;
  var list = FleetStore.getRoutes().filter(function (x) { return x.id !== id; });
  FleetStore.setRoutes(list);
  FleetStore.log({ action: 'delete', entity: 'route', entityId: id, summary: 'Xoá tuyến ' + id });
  if (SELECTED_ROUTE_ID === id) SELECTED_ROUTE_ID = null;
  showToast('Đã xoá tuyến.');
  renderDirectionsView();
}

/* =========================================================
   3. QUẢN LÝ CHUYẾN
   Thiết kế BÁM SÁT tab "Quản lý phơi" của TicketStaff:
   - thanh lọc: Tên phơi / Ngày khởi hành / Hướng đi (Chiều đi–về) / Tuyến đi / Trạng thái
   - danh sách dạng THẺ (.phoi-card): giờ + biển số + ngày + badge trạng thái + tên phơi
     + meta (Loại xe / Ghế trống / Giá vé) + footer 2 nút.
   Cùng nguồn dữ liệu hn_trips_meta_v9 + seat bank hn_trip_seat_bank_v12.
   ========================================================= */
var TRIP_FILTERS = { name: '', date: '', sense: '', route: '', status: '' };
var ADMIN_BULK = { mode: false, ids: [] }; // "Tạo phơi xe hàng loạt" — chọn phơi mẫu (isTemplate) rồi nhân bản theo khoảng ngày

function fld(label, inner) { return '<div class="filter-field"><label>' + esc(label) + '</label>' + inner + '</div>'; }
function uniq(a) { return Array.from(new Set(a)); }

function renderTripsView() {
  var trips = getTrips();
  var seatBank = lsRead(HN_STORAGE_KEY, {});
  var seatMap = FleetStore.vehicleTypeSeats();
  var rc = FleetStore.buildRoutesCfg();               // { 'chieu-di':[{label,abbr,price}], 'chieu-ve':[...] }
  var routeOpts = TRIP_FILTERS.sense === 'chieu-di' ? rc['chieu-di']
    : TRIP_FILTERS.sense === 'chieu-ve' ? rc['chieu-ve']
    : rc['chieu-di'].concat(rc['chieu-ve']);

  var f = TRIP_FILTERS;
  var list = trips.filter(function (t) {
    if (!t) return false;
    // Chế độ chọn "phơi mẫu" luôn hiện đủ toàn bộ mẫu cố định, bỏ qua thanh lọc (giống TicketStaff).
    if (ADMIN_BULK.mode) return t.isTemplate && t.status !== 'Đã hủy';
    if (f.name) {
      var hay = ((t.name || '') + ' ' + (t.route || '') + ' ' + (t.time || '') + ' ' + (t.plate || '')).toLowerCase();
      if (hay.indexOf(f.name.toLowerCase()) === -1) return false;
    }
    if (f.date && t.date && t.date !== f.date) return false;
    if (f.sense) {
      var s = FleetStore.getRouteSense(t.route);
      if (!s) s = String(t.route || '').indexOf('Sài Gòn') === 0 ? 'di' : 've';
      if (f.sense === 'chieu-di' && s !== 'di') return false;
      if (f.sense === 'chieu-ve' && s !== 've') return false;
    }
    if (f.route && t.route !== f.route) return false;
    if (f.status && (t.status || 'Chưa chỉ định xe') !== f.status) return false;
    return true;
  }).sort(function (a, b) { return (b.createdAt || 0) - (a.createdAt || 0); });

  function optList(arr, cur, valFn, txtFn) {
    return arr.map(function (x) {
      var v = valFn(x); return '<option value="' + esc(v) + '"' + (String(cur) === String(v) ? ' selected' : '') + '>' + esc(txtFn(x)) + '</option>';
    }).join('');
  }

  var ICN_EDIT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
  var ICN_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  var ICN_ROUTE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15.472M9 3.236v15.472"/></svg>';
  var ICN_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

  function seatInfo(t) {
    var plan = seatBank[t.id], empty = 0, total = 0;
    if (plan && Array.isArray(plan.down) && Array.isArray(plan.up)) {
      var comb = plan.down.concat(plan.up);
      empty = comb.filter(function (s) { return s && s.state === 'empty'; }).length;
      total = comb.filter(function (s) { return s && s.state !== 'hidden'; }).length;
    } else { total = seatMap[t.vehicleType] || 24; empty = total; }
    return empty + '/' + total;
  }
  function cardInner(t, cls, st) {
    var timeStr = t.time || '00:00';
    var name = t.name || ((t.route || '') + ' (' + timeStr.replace(':', 'h') + ')');
    return '<div class="phoi-card-top">' +
        '<div class="phoi-card-schedule">' +
          '<div class="phoi-card-time-row"><span class="phoi-card-time">' + esc(timeStr) + '</span>' +
          '<span class="trip-plate-inline">' + esc(t.plate || '—') + '</span></div>' +
          '<span class="phoi-card-date">' + fmtDate(t.date) + '</span>' +
        '</div>' +
        '<span class="status-badge ' + cls + '"><span class="status-dot"></span>' + esc(st) + '</span>' +
      '</div>' +
      '<div class="phoi-card-name">' + esc(name) + '</div>' +
      '<div class="phoi-card-meta">' +
        '<div class="phoi-card-meta-item"><label>Loại xe</label><span>' + esc(t.vehicleType || '—') + '</span></div>' +
        '<div class="phoi-card-meta-item"><label>Ghế trống</label><span>' + seatInfo(t) + '</span></div>' +
        '<div class="phoi-card-meta-item"><label>Giá vé</label><span>' + fmtMoney(t.price || 0) + '</span></div>' +
      '</div>';
  }

  function tripCard(t) {
    var st = t.status || 'Chưa chỉ định xe';
    var cls = STATUS_CLASS[st] || 'chua-chi-dinh';

    if (ADMIN_BULK.mode) {
      var sel = ADMIN_BULK.ids.indexOf(t.id) !== -1;
      return '<div class="phoi-card phoi-card-selectable status-' + cls + (sel ? ' selected' : '') + '" data-action="adminToggleBulkSelect" data-args=\'["' + esc(t.id) + '"]\'>' +
        '<div class="phoi-card-select-check">' + (sel ? ICN_CHECK : '') + '</div>' +
        cardInner(t, cls, st) +
      '</div>';
    }

    var canCancel = st !== 'Đã hủy' && st !== 'Đã khởi hành';
    return '<div class="phoi-card status-' + cls + '" data-action="adminOpenTripModal" data-args=\'["' + esc(t.id) + '"]\'>' +
      '<button type="button" class="phoi-route-btn" title="Xem lộ trình" data-action="adminShowTripRoute" data-stop-propagation="1" data-args=\'["' + esc(t.id) + '"]\'>' + ICN_ROUTE + '</button>' +
      cardInner(t, cls, st) +
      '<div class="phoi-card-footer">' +
        '<button type="button" class="btn btn-secondary phoi-edit-btn" data-action="adminOpenTripModal" data-stop-propagation="1" data-args=\'["' + esc(t.id) + '"]\'>' + ICN_EDIT + 'Chỉnh sửa</button>' +
        '<button type="button" class="btn btn-danger phoi-sell-btn" data-action="adminCancelTrip" data-stop-propagation="1" data-args=\'["' + esc(t.id) + '"]\'' + (canCancel ? '' : ' disabled') + '>' + ICN_X + 'Huỷ chuyến</button>' +
      '</div>' +
    '</div>';
  }

  var grid = list.length
    ? '<div class="phoi-card-grid">' + list.map(tripCard).join('') + '</div>'
    : '<div class="grid-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg><p>' +
      (ADMIN_BULK.mode ? 'Chưa có phơi mẫu nào.' : 'Không tìm thấy chuyến phù hợp với bộ lọc.') + '</p></div>';

  var today = todayISO();
  var bulkBar = ADMIN_BULK.mode
    ? '<div class="bulk-bar">' +
        '<span class="bulk-bar-hint">' + (ADMIN_BULK.ids.length ? 'Đã chọn ' + ADMIN_BULK.ids.length + ' phơi mẫu' : 'Chọn các phơi mẫu bên dưới để nhân bản theo khoảng ngày') + '</span>' +
        '<div class="bulk-bar-fields">' +
          '<div class="filter-field"><label>Từ ngày</label><input type="date" id="bkFrom" value="' + today + '" min="' + today + '"></div>' +
          '<div class="filter-field"><label>Đến ngày</label><input type="date" id="bkTo" value="' + today + '" min="' + today + '"></div>' +
          '<button class="btn" data-action="adminToggleBulkMode">Hủy</button>' +
          '<button class="btn btn-primary" data-action="adminBulkCreate"' + (ADMIN_BULK.ids.length ? '' : ' disabled') + '>Tạo hàng loạt</button>' +
        '</div>' +
      '</div>'
    : '';

  var body = bulkBar + '<div class="phoi-grid-wrap">' + grid + '</div>';

  $('viewTrips').innerHTML =
    '<div class="filter-toolbar">' +
      fld('Tên phơi', '<input type="text" id="tfName" value="' + esc(f.name) + '" placeholder="Nhập tên phơi..." data-change-action="adminTripFilterInput" data-args=\'["name","__this_value__"]\'>') +
      fld('Ngày khởi hành', '<input type="date" id="tfDate" value="' + esc(f.date) + '" data-change-action="adminTripFilterInput" data-args=\'["date","__this_value__"]\'>') +
      fld('Hướng đi', '<select id="tfSense" data-change-action="adminTripFilterInput" data-args=\'["sense","__this_value__"]\'>' +
        '<option value="">Tất cả</option>' +
        '<option value="chieu-di"' + (f.sense === 'chieu-di' ? ' selected' : '') + '>Chiều đi</option>' +
        '<option value="chieu-ve"' + (f.sense === 'chieu-ve' ? ' selected' : '') + '>Chiều về</option></select>') +
      fld('Tuyến đi', '<select id="tfRoute" data-change-action="adminTripFilterInput" data-args=\'["route","__this_value__"]\'>' +
        '<option value="">Tất cả tuyến</option>' + optList(routeOpts, f.route, function (r) { return r.label; }, function (r) { return r.label; }) + '</select>') +
      fld('Trạng thái', '<select id="tfStatus" data-change-action="adminTripFilterInput" data-args=\'["status","__this_value__"]\'>' +
        '<option value="">Tất cả trạng thái</option>' + optList(TRIP_STATUSES, f.status, function (x) { return x; }, function (x) { return x; }) + '</select>') +
      '<button class="btn btn-primary" data-action="adminTripSearch">Tìm kiếm</button>' +
      '<button class="btn" data-action="adminResetTripFilters">Đặt lại</button>' +
      '<div class="filter-spacer"></div>' +
      '<button class="btn' + (ADMIN_BULK.mode ? ' bulk-toggle-active' : '') + '" data-action="adminToggleBulkMode">' +
        (ADMIN_BULK.mode ? 'Hủy chọn phơi mẫu' : 'Tạo phơi xe hàng loạt') + '</button>' +
      (ADMIN_BULK.mode ? '' : '<button class="btn btn-primary" data-action="adminOpenTripModal" data-args=\'[""]\'>+ Tạo phơi xe</button>') +
    '</div>' +
    body;
}

function adminTripSearch() {
  var el = $('tfName');
  if (el) TRIP_FILTERS.name = el.value || '';
  renderTripsView();
}
function adminTripFilterInput(field, val) {
  if (!(field in TRIP_FILTERS)) return;
  TRIP_FILTERS[field] = val || '';
  if (field === 'sense') TRIP_FILTERS.route = ''; // đổi Hướng đi → dựng lại danh sách Tuyến
  renderTripsView();
}
function adminResetTripFilters() {
  Object.keys(TRIP_FILTERS).forEach(function (k) { TRIP_FILTERS[k] = ''; });
  renderTripsView();
}

/* ---- Xem lộ trình (điểm xuất phát → điểm đón dọc đường → điểm đến) ---- */
function adminShowTripRoute(id) {
  var t = getTrips().find(function (x) { return x.id === id; });
  if (!t) return;
  var steps = [];
  if (t.fromStation) steps.push(['start', 'Điểm xuất phát', t.fromStation]);
  (Array.isArray(t.pickupStations) ? t.pickupStations : []).forEach(function (s) { steps.push(['stop', 'Điểm đón khách', s]); });
  if (t.toStation) steps.push(['end', 'Điểm đến', t.toStation]);
  var timeline = steps.length
    ? steps.map(function (s) {
        return '<div class="route-step ' + s[0] + '"><span class="route-step-dot"></span>' +
          '<div class="route-step-body"><div class="route-step-label">' + esc(s[1]) + '</div>' +
          '<div class="route-step-name">' + esc(s[2]) + '</div></div></div>';
      }).join('')
    : '<p class="hint-inline">Chưa có thông tin lộ trình chi tiết cho chuyến này.</p>';
  openAdminModal(
    '<h3>Lộ trình chuyến</h3>' +
    '<div class="admin-form">' +
      '<div style="font-weight:800;font-size:14px;">' + esc(t.name || t.route || '—') + '</div>' +
      '<p class="hint-inline" style="margin:4px 0 14px;">' + [esc(t.time || ''), fmtDate(t.date), esc(t.plate || '')].filter(Boolean).join(' • ') + '</p>' +
      '<div class="route-timeline">' + timeline + '</div>' +
      '<div class="modal-actions"><button type="button" class="btn btn-primary" data-action="closeAdminModal">Đóng</button></div>' +
    '</div>'
  );
}

/* ---- Tạo phơi xe hàng loạt từ phơi mẫu ---- */
function adminToggleBulkMode() {
  ADMIN_BULK.mode = !ADMIN_BULK.mode;
  ADMIN_BULK.ids = [];
  renderTripsView();
}
function adminToggleBulkSelect(id) {
  var i = ADMIN_BULK.ids.indexOf(id);
  if (i === -1) ADMIN_BULK.ids.push(id); else ADMIN_BULK.ids.splice(i, 1);
  renderTripsView();
}
function adminBulkCreate() {
  if (!ADMIN_BULK.ids.length) { showToast('Chưa chọn phơi mẫu nào.'); return; }
  var from = ($('bkFrom') || {}).value || '';
  var to = ($('bkTo') || {}).value || '';
  if (!from || !to) { showToast('Chọn Từ ngày và Đến ngày.'); return; }
  if (new Date(to) < new Date(from)) { showToast('Đến ngày không được nhỏ hơn Từ ngày.'); return; }

  var dates = [];
  var cur = new Date(from), end = new Date(to);
  while (cur <= end) { dates.push(cur.toISOString().slice(0, 10)); cur.setDate(cur.getDate() + 1); }

  var trips = getTrips();
  var templates = ADMIN_BULK.ids.map(function (id) { return trips.find(function (x) { return x.id === id; }); }).filter(Boolean);
  var total = dates.length * templates.length;
  if (!confirm('Sẽ tạo khoảng ' + total + ' chuyến từ ' + templates.length + ' phơi mẫu. Xác nhận?')) return;

  var created = 0, n = 0;
  dates.forEach(function (d) {
    templates.forEach(function (tpl) {
      var newId = String(Date.now()) + '_' + (n++);
      trips.push({
        id: newId,
        name: tpl.name || ((tpl.route || '') + ' (' + (tpl.time || '') + ')'),
        date: d, route: tpl.route, time: tpl.time,
        fromStation: tpl.fromStation || '', toStation: tpl.toStation || '',
        pickupStations: Array.isArray(tpl.pickupStations) ? tpl.pickupStations.slice() : [],
        vehicleType: tpl.vehicleType, price: tpl.price,
        status: 'Chưa chỉ định xe', plate: '', note: tpl.note || '', createdAt: Date.now() + n
      });
      created++;
    });
  });
  setTrips(trips);
  // seat bank rỗng cho từng chuyến vừa tạo
  trips.slice(trips.length - created).forEach(function (nt) { regenSeatBankForType(nt.id, nt.vehicleType, nt.price); });
  FleetStore.log({ action: 'bulk-create', entity: 'trip', summary: 'Tạo hàng loạt ' + created + ' chuyến từ ' + templates.length + ' phơi mẫu' });
  ADMIN_BULK.ids = [];
  showToast('Đã tạo ' + created + ' chuyến.');
  renderTripsView();
}

/* Modal "Tạo phơi xe mới" / "Chỉnh sửa phơi xe" — dựng GIỐNG #singleModal của TicketStaff:
   Hướng đi → Trạm đi | Trạm đến → Ngày | Giờ → Trạm có thể nhận thêm khách → Giá vé | Loại xe →
   Ghi chú → (chỉ khi sửa) Trạng thái | Biển số → Tên phơi. Footer: [Hủy phơi xe] [Đóng] [Lưu]. */
function adminOpenTripModal(id) {
  var trips = getTrips();
  var t = id ? trips.find(function (x) { return x.id === id; }) : null;
  var readOnly = !!t && (t.status === 'Đã khởi hành' || t.status === 'Đã hủy');
  var cfg = FleetStore.buildTripDirectionsCfg();               // { [routeId]: {label,route,price,fromStations,toStations,pickupStations,directionLabel} }
  var dirKeys = Object.keys(cfg);
  var curDirKey = t ? (dirKeys.find(function (k) { return cfg[k].route === t.route; }) || '') : '';
  var ro = roDis(readOnly);

  var dirOpts = '<option value="">-- Chọn hướng tuyến --</option>' +
    dirKeys.map(function (k) {
      return '<option value="' + esc(k) + '"' + (k === curDirKey ? ' selected' : '') + '>' + esc(cfg[k].route) + '</option>';
    }).join('');

  var vtypes = FleetStore.getVehicleTypes({ scope: 'line' }).filter(function (v) { return activeOf(v) && v.featuredForTrip; });
  if (!vtypes.length) vtypes = FleetStore.getVehicleTypes({ scope: 'line' }).filter(activeOf);
  var curType = t ? (t.vehicleType || '') : (vtypes[0] && vtypes[0].name) || '';
  if (curType && !vtypes.some(function (v) { return v.name === curType; })) vtypes = vtypes.concat([{ name: curType }]);

  openAdminModal(
    '<h3>' + (t ? 'Chỉnh sửa phơi xe' : 'Tạo phơi xe mới') + '</h3>' +
    '<form class="admin-form" data-submit-action="adminSaveTrip" data-args=\'["__event__"]\'>' +
      '<input type="hidden" id="ttId" value="' + (t ? esc(t.id) : '') + '">' +

      '<div class="fld"><label>Hướng đi <span class="req">*</span></label>' +
        '<select id="ttDir" ' + ro + ' data-change-action="adminTripDirChange">' + dirOpts + '</select></div>' +

      '<div class="fld-row">' +
        '<div class="fld"><label>Trạm đi <span class="req">*</span></label>' +
          '<select id="ttFrom" ' + ro + ' data-change-action="adminTripNameSuggest"><option value="">-- Chọn hướng đi trước --</option></select></div>' +
        '<div class="fld"><label>Trạm đến <span class="req">*</span></label>' +
          '<select id="ttTo" ' + ro + ' data-change-action="adminTripNameSuggest"><option value="">-- Chọn hướng đi trước --</option></select></div>' +
      '</div>' +

      '<div class="fld-row">' +
        '<div class="fld"><label>Ngày khởi hành <span class="req">*</span></label>' +
          '<input type="date" id="ttDate" ' + ro + ' value="' + (t ? esc(t.date || '') : todayISO()) + '"></div>' +
        '<div class="fld"><label>Giờ khởi hành <span class="req">*</span></label>' +
          '<input type="time" id="ttTime" ' + ro + ' value="' + (t ? esc(t.time || '') : '') + '" data-change-action="adminTripNameSuggest"></div>' +
      '</div>' +

      '<div class="fld"><label>Trạm có thể nhận thêm khách</label>' +
        '<div class="station-pick-group" id="ttPickups"></div></div>' +

      '<div class="fld-row">' +
        '<div class="fld"><label>Giá vé (đ) <span class="req">*</span></label>' +
          '<input type="number" id="ttPrice" min="0" step="5000" ' + ro + ' placeholder="Lấy theo hướng đi" value="' + (t ? (t.price || '') : '') + '"></div>' +
        '<div class="fld"><label>Loại xe <span class="req">*</span></label>' +
          '<select id="ttType" ' + ro + '>' +
            vtypes.map(function (v) { return '<option value="' + esc(v.name) + '"' + (v.name === curType ? ' selected' : '') + '>' + esc(v.name) + '</option>'; }).join('') +
          '</select></div>' +
      '</div>' +

      '<div class="fld"><label>Ghi chú</label>' +
        '<input type="text" id="ttNote" ' + ro + ' placeholder="Thông tin nội bộ xe tăng cường..." value="' + (t ? esc(t.note || '') : '') + '"></div>' +

      (t ? '<div class="fld-row">' +
        '<div class="fld"><label>Trạng thái phơi xe</label><select id="ttStatus" ' + ro + '>' +
          TRIP_STATUSES.map(function (s) { return '<option value="' + esc(s) + '"' + (s === (t.status || '') ? ' selected' : '') + '>' + esc(s) + '</option>'; }).join('') +
        '</select></div>' +
        '<div class="fld"><label>Biển số xe chỉ định</label><input type="text" id="ttPlate" ' + ro + ' placeholder="VD: 51F-123.45" value="' + esc(t.plate || '') + '"></div>' +
      '</div>' : '') +

      '<div class="fld"><label>Tên phơi <span class="req">*</span></label>' +
        '<input type="text" id="ttName" ' + ro + ' placeholder="Tự cập nhật theo Trạm đi - Trạm đến" value="' + (t ? esc(t.name || '') : '') + '"></div>' +

      '<div class="modal-actions">' +
        (t ? '<button type="button" class="btn btn-danger" data-action="adminCancelTripFromModal" data-args=\'["' + esc(t.id) + '"]\' style="margin-right:auto;"' + (readOnly ? ' disabled' : '') + '>Hủy phơi xe</button>' : '') +
        '<button type="button" class="btn" data-action="closeAdminModal">Đóng</button>' +
        (readOnly ? '' : '<button type="submit" class="btn btn-primary">Lưu</button>') +
      '</div>' +
    '</form>'
  );

  adminTripDirChange();                 // đổ Trạm đi/đến + pill Trạm đón + giá theo hướng đang chọn
  if (t) {
    if (t.fromStation) setSelect('ttFrom', t.fromStation);
    if (t.toStation) setSelect('ttTo', t.toStation);
    // tick lại các trạm đón đã lưu
    var saved = Array.isArray(t.pickupStations) ? t.pickupStations : [];
    Array.prototype.forEach.call(document.querySelectorAll('#ttPickups input[type=checkbox]'), function (cb) {
      cb.checked = saved.indexOf(cb.value) !== -1;
      var pill = cb.closest('.station-pick-pill');
      if (pill) pill.classList.toggle('checked', cb.checked);
    });
    // giá vé & tên phơi thật của phơi này (đặt SAU adminTripDirChange vì hàm đó vừa set giá mặc định theo hướng)
    if ($('ttPrice')) $('ttPrice').value = t.price || 280000;
    if ($('ttName')) $('ttName').value = t.name || '';
  }
}
function roDis(ro) { return ro ? 'disabled' : ''; }
function setSelect(id, val) {
  var s = $(id); if (!s) return;
  if (!Array.prototype.some.call(s.options, function (o) { return o.value === val; })) s.add(new Option(val, val));
  s.value = val;
}

// Đổi Hướng đi → dựng lại Trạm đi/Trạm đến + danh sách pill "Trạm có thể nhận thêm khách" + giá vé mặc định.
function adminTripDirChange() {
  var cfg = FleetStore.buildTripDirectionsCfg();
  var d = cfg[$('ttDir') ? $('ttDir').value : ''];
  var fromSel = $('ttFrom'), toSel = $('ttTo'), pickBox = $('ttPickups'), priceEl = $('ttPrice');

  if (!d) {
    if (fromSel) fromSel.innerHTML = '<option value="">-- Chọn hướng đi trước --</option>';
    if (toSel) toSel.innerHTML = '<option value="">-- Chọn hướng đi trước --</option>';
    if (pickBox) pickBox.innerHTML = '<span class="station-pick-empty">Không có trạm dọc đường</span>';
    return;
  }
  if (fromSel) fromSel.innerHTML = '<option value="">-- Chọn trạm đi --</option>' +
    (d.fromStations || []).map(function (s) { return '<option value="' + esc(s) + '">' + esc(s) + '</option>'; }).join('');
  if (toSel) toSel.innerHTML = '<option value="">-- Chọn trạm đến --</option>' +
    (d.toStations || []).map(function (s) { return '<option value="' + esc(s) + '">' + esc(s) + '</option>'; }).join('');

  var opts = d.pickupStations || [];
  if (pickBox) {
    pickBox.innerHTML = opts.length
      ? opts.map(function (s) {
          return '<label class="station-pick-pill"><input type="checkbox" value="' + esc(s) + '" data-change-action="adminTogglePickup" data-args=\'["__this__"]\'>' + esc(s) + '</label>';
        }).join('')
      : '<span class="station-pick-empty">Không có trạm dọc đường</span>';
  }
  if (priceEl) priceEl.value = d.price || '';
  adminTripNameSuggest();
}

function adminTogglePickup(cb) {
  var pill = cb.closest('.station-pick-pill');
  if (pill) pill.classList.toggle('checked', cb.checked);
}

// Tên phơi tự gợi ý "Trạm đi - Trạm đến (giờ)" mỗi khi đổi Trạm đi / Trạm đến / Giờ (nhân viên vẫn gõ đè được).
function adminTripNameSuggest() {
  var from = ($('ttFrom') || {}).value || '';
  var to = ($('ttTo') || {}).value || '';
  var time = ($('ttTime') || {}).value || '';
  var nameEl = $('ttName');
  if (!nameEl || !from || !to) return;
  nameEl.value = time ? (from + ' - ' + to + ' (' + time + ')') : (from + ' - ' + to);
}

function adminCancelTripFromModal(id) {
  closeAdminModal();
  adminCancelTrip(id);
}

function adminSaveTrip(e) {
  e.preventDefault();
  var id = $('ttId').value;
  var cfg = FleetStore.buildTripDirectionsCfg();
  var d = cfg[$('ttDir').value];
  var from = $('ttFrom').value, to = $('ttTo').value;
  if (!d || !from || !to) { showToast('Vui lòng chọn đầy đủ Hướng đi, Trạm đi và Trạm đến.'); return; }
  var date = $('ttDate').value, time = $('ttTime').value;
  if (!date || !time) { showToast('Vui lòng nhập Ngày và Giờ khởi hành.'); return; }
  var price = parseInt($('ttPrice').value, 10) || d.price || 280000;
  var vehicleType = $('ttType').value;
  var name = $('ttName').value.trim() || (from + ' - ' + to);
  var note = $('ttNote').value.trim();
  var pickups = Array.prototype.map.call(
    document.querySelectorAll('#ttPickups input[type=checkbox]:checked'), function (cb) { return cb.value; });
  var trips = getTrips();

  if (id) {
    var t = trips.find(function (x) { return x.id === id; });
    if (!t) { showToast('Không tìm thấy phơi xe.'); return; }
    var before = JSON.parse(JSON.stringify(t));
    var typeChanged = t.vehicleType !== vehicleType;
    if (typeChanged && !confirm('Cảnh báo: Thay đổi loại xe sẽ xoá toàn bộ sơ đồ ghế cũ và sinh lại ghế trống mới. Tiếp tục?')) return;
    t.route = d.route; t.fromStation = from; t.toStation = to; t.pickupStations = pickups;
    t.date = date; t.time = time; t.price = price; t.vehicleType = vehicleType; t.name = name; t.note = note;
    if ($('ttStatus')) t.status = $('ttStatus').value;
    if ($('ttPlate')) t.plate = $('ttPlate').value.trim();
    setTrips(trips);
    if (typeChanged) regenSeatBankForType(id, vehicleType, price);
    FleetStore.log({ action: 'update', entity: 'trip', entityId: id, summary: 'Sửa phơi ' + name, before: before, after: t });
  } else {
    var newId = String(Date.now());
    var nt = {
      id: newId, name: name, date: date, route: d.route, fromStation: from, toStation: to,
      pickupStations: pickups, time: time, vehicleType: vehicleType, price: price,
      note: note, status: 'Chưa chỉ định xe', plate: '', createdAt: Date.now()
    };
    trips.push(nt);
    setTrips(trips);
    regenSeatBankForType(newId, vehicleType, price);
    FleetStore.log({ action: 'create', entity: 'trip', entityId: newId, summary: 'Tạo phơi ' + name, after: nt });
  }
  closeAdminModal();
  showToast('Đã lưu phơi xe.');
  renderTripsView();
}

/* Sinh seat bank rỗng cho chuyến mới / khi đổi loại xe — ghi thẳng HN_STORAGE_KEY (không dùng global
   tripSeatBank của ticketstaff). Nếu bank hiện có ghế đã bán thì KHÔNG đụng (an toàn dữ liệu). */
function regenSeatBankForType(tripId, vehicleType, price) {
  var bank = lsRead(HN_STORAGE_KEY, {});
  var cur = bank[tripId];
  if (cur && hasSoldSeats(cur)) {
    showToast('Chuyến đã có ghế bán — giữ nguyên sơ đồ ghế, chỉ đổi thông tin loại xe.');
    cur.vehicleType = vehicleType;
    bank[tripId] = cur;
    lsWrite(HN_STORAGE_KEY, bank);
    return;
  }
  var codes;
  try { codes = getSeatCodesForVehicleType(vehicleType); } catch (e) { codes = { down: [], up: [] }; }
  var mk = function (arr) {
    return (arr || []).map(function (c) {
      if (String(c).endsWith('_hidden')) return { code: c, state: 'hidden' };
      return { code: c, state: 'empty', locked: false, price: Number(price) || 280000, count: 1 };
    });
  };
  bank[tripId] = {
    down: mk(codes.down), up: mk(codes.up),
    plate: (cur && cur.plate) || '', vehicleType: vehicleType,
    driver: (cur && cur.driver) || '', helper: (cur && cur.helper) || '',
    cancelledSeats: [], subSeats: [], extraSeats: []
  };
  lsWrite(HN_STORAGE_KEY, bank);
}
function hasSoldSeats(bank) {
  var chk = function (a) { return (a || []).some(function (s) { return s && (s.state === 'sold' || s.state === 'hold'); }); };
  return chk(bank.down) || chk(bank.up) || chk(bank.subSeats);
}

function adminCancelTrip(id) {
  if (!confirm('Đánh dấu chuyến này là "Đã hủy"?')) return;
  var trips = getTrips();
  var t = trips.find(function (x) { return x.id === id; });
  if (!t) return;
  t.status = 'Đã hủy';
  setTrips(trips);
  FleetStore.log({ action: 'cancel', entity: 'trip', entityId: id, summary: 'Huỷ chuyến ' + (t.name || id) });
  showToast('Đã huỷ chuyến.');
  renderTripsView();
}

/* =========================================================
   4. QUẢN LÝ XE
   ========================================================= */
function renderVehiclesView() {
  var all = FleetStore.getVehicles();
  var rows = all.length ? all.map(function (v, i) {
    return '<tr>' +
      '<td class="mono">' + esc(v.plate) + '</td>' +
      '<td>' + esc(v.vehicleType || '—') + '</td>' +
      '<td class="num">' + (v.seats || 0) + '</td>' +
      '<td>' + (v.scope === 'shuttle' ? 'Trung chuyển' : 'Tuyến') + '</td>' +
      '<td class="col-status">' + activeTag(activeOf(v)) + '</td>' +
      '<td>' + esc(v.note || '') + '</td>' +
      '<td class="row-actions">' +
        '<button class="btn btn-sm" data-action="adminOpenVehicleModal" data-args=\'[' + i + ']\'>Sửa</button>' +
        '<button class="btn btn-sm btn-danger" data-action="adminDeleteVehicle" data-args=\'[' + i + ']\'>Xoá</button>' +
      '</td></tr>';
  }).join('') : '<tr><td colspan="7" class="empty-state">Chưa có xe nào.</td></tr>';

  $('viewVehicles').innerHTML =
    '<div class="filter-toolbar"><div class="filter-spacer"></div>' +
      '<button class="btn btn-primary" data-action="adminOpenVehicleModal" data-args=\'[-1]\'>+ Thêm xe</button></div>' +
    '<div class="table-wrap"><table class="admin-table"><thead><tr><th>Biển số</th><th>Loại xe</th><th class="num">Số ghế</th><th>Nhóm</th><th class="col-status">Trạng thái</th><th>Ghi chú</th><th class="th-actions">Thao tác</th></tr></thead><tbody>' +
    rows + '</tbody></table></div>';
}

function adminOpenVehicleModal(idx) {
  var all = FleetStore.getVehicles();
  var v = idx >= 0 ? all[idx] : null;
  var typeScope = v ? v.scope : 'line';
  var typeOpts = function (scope) {
    return FleetStore.getVehicleTypes({ scope: scope }).filter(activeOf).map(function (x) {
      return '<option value="' + esc(x.name) + '" data-seats="' + (x.seats || 0) + '"' + (v && v.vehicleType === x.name ? ' selected' : '') + '>' + esc(x.name) + ' (' + (x.seats || 0) + ' ghế)</option>';
    }).join('');
  };
  openAdminModal(
    '<h3>' + (v ? 'Sửa xe' : 'Thêm xe') + '</h3>' +
    '<form class="admin-form" data-submit-action="adminSaveVehicle" data-args=\'["__event__"]\'>' +
      '<input type="hidden" id="vmIdx" value="' + idx + '">' +
      '<div class="fld-row">' +
        '<div class="fld"><label>Biển số *</label><input id="vmPlate" required value="' + (v ? esc(v.plate) : '') + '"></div>' +
        '<div class="fld"><label>Nhóm *</label><select id="vmScope" data-change-action="adminVehicleScopeChange"><option value="line"' + (typeScope === 'line' ? ' selected' : '') + '>Tuyến</option><option value="shuttle"' + (typeScope === 'shuttle' ? ' selected' : '') + '>Trung chuyển</option></select></div>' +
      '</div>' +
      '<div class="fld"><label>Loại xe</label><select id="vmType" data-change-action="adminVehicleTypeChange">' +
        '<option value="">-- Chọn --</option>' + typeOpts(typeScope) + '</select></div>' +
      '<div class="fld-row">' +
        '<div class="fld"><label>Số ghế</label><input type="number" id="vmSeats" min="0" value="' + (v ? (v.seats || 0) : 0) + '"></div>' +
        '<div class="fld"><label><input type="checkbox" id="vmActive" ' + (!v || activeOf(v) ? 'checked' : '') + '> Hoạt động</label></div>' +
      '</div>' +
      '<div class="fld"><label>Ghi chú</label><input id="vmNote" value="' + (v ? esc(v.note || '') : '') + '"></div>' +
      '<div class="modal-actions"><button type="button" class="btn" data-action="closeAdminModal">Huỷ</button><button type="submit" class="btn btn-primary">Lưu</button></div>' +
    '</form>'
  );
}
function adminVehicleScopeChange() {
  var scope = $('vmScope').value;
  var sel = $('vmType');
  sel.innerHTML = '<option value="">-- Chọn --</option>' + FleetStore.getVehicleTypes({ scope: scope }).filter(activeOf).map(function (x) {
    return '<option value="' + esc(x.name) + '" data-seats="' + (x.seats || 0) + '">' + esc(x.name) + ' (' + (x.seats || 0) + ' ghế)</option>';
  }).join('');
}
function adminVehicleTypeChange() {
  var opt = $('vmType').selectedOptions[0];
  if (opt && opt.dataset.seats) $('vmSeats').value = opt.dataset.seats;
}
function adminSaveVehicle(e) {
  e.preventDefault();
  var idx = parseInt($('vmIdx').value, 10);
  var all = FleetStore.getVehicles();
  var plate = $('vmPlate').value.trim();
  if (!plate) { showToast('Nhập biển số.'); return; }
  if (all.some(function (x, i) { return x.plate === plate && i !== idx; })) { showToast('Biển số đã tồn tại.'); return; }
  var rec = {
    plate: plate, scope: $('vmScope').value, vehicleType: $('vmType').value,
    seats: parseInt($('vmSeats').value, 10) || 0, active: $('vmActive').checked,
    note: $('vmNote').value.trim(),
    driverDefault: (idx >= 0 && all[idx] && all[idx].driverDefault) || '',
    helperDefault: (idx >= 0 && all[idx] && all[idx].helperDefault) || ''
  };
  if (idx >= 0) {
    var before = all[idx];
    all[idx] = rec;
    FleetStore.log({ action: 'update', entity: 'vehicle', entityId: plate, summary: 'Sửa xe ' + plate, before: before, after: rec });
  } else {
    all.push(rec);
    FleetStore.log({ action: 'create', entity: 'vehicle', entityId: plate, summary: 'Thêm xe ' + plate, after: rec });
  }
  FleetStore.setVehicles(all);
  closeAdminModal();
  showToast('Đã lưu xe.');
  renderVehiclesView();
}
function adminDeleteVehicle(idx) {
  var all = FleetStore.getVehicles();
  var v = all[idx];
  if (!v) return;
  var chk = FleetStore.canDeleteVehicle(v.plate);
  if (!chk.ok) { showToast('Không thể xoá: ' + chk.reason); return; }
  if (!confirm('Xoá xe ' + v.plate + '?')) return;
  all.splice(idx, 1);
  FleetStore.setVehicles(all);
  FleetStore.log({ action: 'delete', entity: 'vehicle', entityId: v.plate, summary: 'Xoá xe ' + v.plate });
  showToast('Đã xoá xe.');
  renderVehiclesView();
}

/* =========================================================
   5. QUẢN LÝ NHÂN VIÊN
   ========================================================= */
var STAFF_ROLES = [['ticket', 'Nhân viên vé'], ['driver', 'Tài xế'], ['helper', 'Phụ xe'], ['shuttle_driver', 'Tài xế trung chuyển']];
function roleLabel(r) { var m = STAFF_ROLES.find(function (x) { return x[0] === r; }); return m ? m[1] : r; }

function renderStaffView() {
  var all = FleetStore.getStaff();
  var rows = all.length ? all.map(function (s, i) {
    return '<tr>' +
      '<td class="mono">' + esc(s.code || '—') + '</td>' +
      '<td>' + esc(s.name || '—') + (s.username ? '<div class="cell-sub">@' + esc(s.username) + '</div>' : '') + '</td>' +
      '<td>' + esc(roleLabel(s.role)) + '</td>' +
      '<td>' + esc(s.phone || '') + '</td>' +
      '<td>' + esc(s.license || '') + '</td>' +
      '<td class="col-status">' + activeTag(activeOf(s)) + '</td>' +
      '<td class="row-actions">' +
        '<button class="btn btn-sm" data-action="adminOpenStaffModal" data-args=\'[' + i + ']\'>Sửa</button>' +
        '<button class="btn btn-sm btn-danger" data-action="adminDeleteStaff" data-args=\'[' + i + ']\'>Xoá</button>' +
      '</td></tr>';
  }).join('') : '<tr><td colspan="7" class="empty-state">Chưa có nhân viên nào.</td></tr>';

  $('viewStaff').innerHTML =
    '<div class="filter-toolbar"><div class="filter-spacer"></div>' +
      '<button class="btn btn-primary" data-action="adminOpenStaffModal" data-args=\'[-1]\'>+ Thêm nhân viên</button></div>' +
    '<div class="table-wrap"><table class="admin-table"><thead><tr><th>Mã</th><th>Họ tên</th><th>Vai trò</th><th>SĐT</th><th>Bằng lái</th><th class="col-status">Trạng thái</th><th class="th-actions">Thao tác</th></tr></thead><tbody>' +
    rows + '</tbody></table></div>';
}

function adminOpenStaffModal(idx) {
  var all = FleetStore.getStaff();
  var s = idx >= 0 ? all[idx] : null;
  openAdminModal(
    '<h3>' + (s ? 'Sửa nhân viên' : 'Thêm nhân viên') + '</h3>' +
    '<form class="admin-form" data-submit-action="adminSaveStaff" data-args=\'["__event__"]\'>' +
      '<input type="hidden" id="smIdx" value="' + idx + '">' +
      '<div class="fld-row">' +
        '<div class="fld"><label>Họ tên *</label><input id="smName" required value="' + (s ? esc(s.name || '') : '') + '"></div>' +
        '<div class="fld"><label>Mã NV</label><input id="smCode" value="' + (s ? esc(s.code || '') : '') + '"></div>' +
      '</div>' +
      '<div class="fld"><label>Vai trò *</label><select id="smRole">' +
        STAFF_ROLES.map(function (r) { return '<option value="' + r[0] + '"' + (s && s.role === r[0] ? ' selected' : '') + '>' + r[1] + '</option>'; }).join('') +
      '</select></div>' +
      '<div class="fld-row">' +
        '<div class="fld"><label>SĐT</label><input id="smPhone" value="' + (s ? esc(s.phone || '') : '') + '"></div>' +
        '<div class="fld"><label>Bằng lái</label><input id="smLicense" value="' + (s ? esc(s.license || '') : '') + '"></div>' +
      '</div>' +
      '<div class="fld"><label>Tài khoản đăng nhập (nếu có)</label><input id="smUser" value="' + (s ? esc(s.username || '') : '') + '"></div>' +
      '<div class="fld"><label><input type="checkbox" id="smActive" ' + (!s || activeOf(s) ? 'checked' : '') + '> Đang làm việc</label></div>' +
      '<div class="modal-actions"><button type="button" class="btn" data-action="closeAdminModal">Huỷ</button><button type="submit" class="btn btn-primary">Lưu</button></div>' +
    '</form>'
  );
}
function adminSaveStaff(e) {
  e.preventDefault();
  var idx = parseInt($('smIdx').value, 10);
  var all = FleetStore.getStaff();
  var name = $('smName').value.trim();
  if (!name) { showToast('Nhập họ tên.'); return; }
  var rec = {
    code: $('smCode').value.trim(), name: name, username: $('smUser').value.trim(),
    role: $('smRole').value, phone: $('smPhone').value.trim(), license: $('smLicense').value.trim(),
    active: $('smActive').checked
  };
  if (idx >= 0) {
    var before = all[idx];
    all[idx] = rec;
    FleetStore.log({ action: 'update', entity: 'staff', entityId: name, summary: 'Sửa nhân viên ' + name, before: before, after: rec });
  } else {
    all.push(rec);
    FleetStore.log({ action: 'create', entity: 'staff', entityId: name, summary: 'Thêm nhân viên ' + name, after: rec });
  }
  FleetStore.setStaff(all);
  closeAdminModal();
  showToast('Đã lưu nhân viên.');
  renderStaffView();
}
function adminDeleteStaff(idx) {
  var all = FleetStore.getStaff();
  var s = all[idx];
  if (!s) return;
  var chk = FleetStore.canDeleteStaff(s.name || s.code);
  if (!chk.ok) { showToast('Không thể xoá: ' + chk.reason); return; }
  if (!confirm('Xoá nhân viên ' + s.name + '?')) return;
  all.splice(idx, 1);
  FleetStore.setStaff(all);
  FleetStore.log({ action: 'delete', entity: 'staff', entityId: s.name || s.code, summary: 'Xoá nhân viên ' + (s.name || s.code) });
  showToast('Đã xoá nhân viên.');
  renderStaffView();
}

/* =========================================================
   6. TÀI KHOẢN  (phase 1: chỉ đọc — nguồn là js/login.js)
   ========================================================= */
var LOGIN_ACCOUNTS_MIRROR = [
  { username: 'tongdai01', roleLabel: 'Nhân viên tổng đài', redirect: 'ticketstaff.html' },
  { username: 'trungchuyen01', roleLabel: 'Điều hành trung chuyển', redirect: 'ticketstaff.html' },
  { username: 'quantri01', roleLabel: 'Quản trị viên hệ thống', redirect: 'admin.html' },
  { username: 'dieuhanh01', roleLabel: 'Điều hành bến xe', redirect: 'dieuhanh.html' },
  { username: 'ketoan01', roleLabel: 'Kế toán / Thu ngân', redirect: 'ketoan.html' },
  { username: 'taixe01', roleLabel: 'Tài xế / Phụ xe', redirect: 'taixe.html' }
];
function renderAccountsView() {
  var rows = LOGIN_ACCOUNTS_MIRROR.map(function (a) {
    return '<tr><td class="mono">' + esc(a.username) + '</td><td>' + esc(a.roleLabel) + '</td><td class="mono">' + esc(a.redirect) + '</td></tr>';
  }).join('');
  $('viewAccounts').innerHTML =
    '<div class="warn-inline">Chưa bật CRUD tài khoản: mật khẩu đang để dạng thô trong mã nguồn, chuyển sang localStorage sẽ mở rộng phạm vi rủi ro. Xem ghi chú giai đoạn 2 trong kế hoạch.</div>' +
    '<div class="table-wrap"><table class="admin-table"><thead><tr><th>Tài khoản</th><th>Vai trò</th><th>Trang đích</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
}

/* =========================================================
   7. NHẬT KÝ HOẠT ĐỘNG
   ========================================================= */
var ACT_FILTER = { entity: '', action: '' };
function renderActivityView() {
  var list = FleetStore.getActivity().slice().reverse();
  var entities = uniq(list.map(function (x) { return x.entity; }).filter(Boolean));
  var actions = uniq(list.map(function (x) { return x.action; }).filter(Boolean));
  var filtered = list.filter(function (x) {
    if (ACT_FILTER.entity && x.entity !== ACT_FILTER.entity) return false;
    if (ACT_FILTER.action && x.action !== ACT_FILTER.action) return false;
    return true;
  });
  var rows = filtered.length ? filtered.map(function (x) {
    return '<tr><td>' + esc(fmtStamp(x.ts)) + '</td><td>' + esc(x.user || '') + '</td><td>' + esc(x.action || '') +
      '</td><td>' + esc(x.entity || '') + (x.entityId ? ' <span class="mono" style="color:var(--text-sub);">#' + esc(x.entityId) + '</span>' : '') +
      '</td><td>' + esc(x.summary || '') + '</td></tr>';
  }).join('') : '<tr><td colspan="5" class="empty-state">Chưa có hoạt động nào được ghi.</td></tr>';

  var opt = function (arr, cur) { return '<option value="">Tất cả</option>' + arr.map(function (v) { return '<option value="' + esc(v) + '"' + (v === cur ? ' selected' : '') + '>' + esc(v) + '</option>'; }).join(''); };
  $('viewActivity').innerHTML =
    '<div class="filter-toolbar">' +
      fld('Đối tượng', '<select data-change-action="adminActFilter" data-args=\'["entity","__this_value__"]\'>' + opt(entities, ACT_FILTER.entity) + '</select>') +
      fld('Hành động', '<select data-change-action="adminActFilter" data-args=\'["action","__this_value__"]\'>' + opt(actions, ACT_FILTER.action) + '</select>') +
    '</div>' +
    '<div class="table-wrap"><table class="admin-table"><thead><tr><th>Thời gian</th><th>Người thực hiện</th><th>Hành động</th><th>Đối tượng</th><th>Tóm tắt</th></tr></thead><tbody>' +
    rows + '</tbody></table></div>';
}
function adminActFilter(field, val) { ACT_FILTER[field] = val || ''; renderActivityView(); }

/* =========================================================
   8. CÀI ĐẶT
   ========================================================= */
function renderSettingsView() {
  $('viewSettings').innerHTML =
    '<div class="table-wrap" style="padding:16px;display:flex;flex-direction:column;gap:12px;max-width:560px;">' +
      '<button class="btn" data-action="adminExportConfig">Xuất cấu hình (JSON)</button>' +
      '<label class="btn" style="justify-content:center;">Nhập cấu hình từ file<input type="file" id="cfgFile" accept="application/json" style="display:none;" data-change-action="adminImportConfig" data-args=\'["__event__"]\'></label>' +
      '<button class="btn btn-danger" data-action="adminResetConfig">Khôi phục cấu hình mặc định</button>' +
      '<span class="hint-inline">Các file JS nạp kèm <code>?v=</code> để tránh cache — khi cập nhật mã, tăng số phiên bản trong HTML.</span>' +
    '</div>';
}
function adminExportConfig() {
  var data = {
    directions: FleetStore.getDirections(), routes: FleetStore.getRoutes(),
    vehicleTypes: FleetStore.getVehicleTypes(), vehicles: FleetStore.getVehicles(), staff: FleetStore.getStaff()
  };
  var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'huenghia-fleet-config-' + todayISO() + '.json';
  a.click();
  URL.revokeObjectURL(a.href);
  FleetStore.log({ action: 'export', entity: 'config', summary: 'Xuất cấu hình đội xe' });
}
function adminImportConfig(e) {
  var file = e.target.files && e.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function () {
    try {
      var d = JSON.parse(reader.result);
      if (!confirm('Ghi đè cấu hình hiện tại bằng nội dung file?')) return;
      if (Array.isArray(d.directions)) FleetStore.setDirections(d.directions);
      if (Array.isArray(d.routes)) FleetStore.setRoutes(d.routes);
      if (Array.isArray(d.vehicleTypes)) FleetStore.setVehicleTypes(d.vehicleTypes);
      if (Array.isArray(d.vehicles)) FleetStore.setVehicles(d.vehicles);
      if (Array.isArray(d.staff)) FleetStore.setStaff(d.staff);
      FleetStore.log({ action: 'import', entity: 'config', summary: 'Nhập cấu hình từ file ' + file.name });
      showToast('Đã nhập cấu hình.');
      switchAdminView(CURRENT_VIEW);
    } catch (err) { showToast('File không hợp lệ.'); }
  };
  reader.readAsText(file);
}
function adminResetConfig() {
  if (!confirm('Xoá toàn bộ cấu hình đội xe và tạo lại theo mặc định? (Chuyến/phơi không bị ảnh hưởng)')) return;
  FleetStore.resetToSeed();
  FleetStore.log({ action: 'reset', entity: 'config', summary: 'Khôi phục cấu hình mặc định' });
  showToast('Đã khôi phục mặc định.');
  switchAdminView(CURRENT_VIEW);
}

/* ---------------------------------------------------------
   BOOT
   --------------------------------------------------------- */
initAdminUserMenu();
switchAdminView('viewDashboard');
