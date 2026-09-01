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

