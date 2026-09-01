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

