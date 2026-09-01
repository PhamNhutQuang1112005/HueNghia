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

