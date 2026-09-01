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

