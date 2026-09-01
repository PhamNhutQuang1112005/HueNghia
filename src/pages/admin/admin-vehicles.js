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

