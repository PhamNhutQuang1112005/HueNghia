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

