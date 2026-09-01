/* =========================================================
   6. TÀI KHOẢN  (phase 1: chỉ đọc — nguồn là js/login.js)
   ========================================================= */
function renderAccountsView() {
  // Dẫn xuất từ nguồn duy nhất window.AUTH_ACCOUNTS (src/auth/accounts.js) — bảng chỉ-đọc.
  var rows = AUTH_ACCOUNTS.map(function (a) {
    return '<tr><td class="mono">' + esc(a.username) + '</td><td>' + esc(a.roleLabel) + '</td><td class="mono">' + esc(a.redirect) + '</td></tr>';
  }).join('');
  $('viewAccounts').innerHTML =
    '<div class="warn-inline">Chưa bật CRUD tài khoản: mật khẩu đang để dạng thô trong mã nguồn, chuyển sang localStorage sẽ mở rộng phạm vi rủi ro. Xem ghi chú giai đoạn 2 trong kế hoạch.</div>' +
    '<div class="table-wrap"><table class="admin-table"><thead><tr><th>Tài khoản</th><th>Vai trò</th><th>Trang đích</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
}

