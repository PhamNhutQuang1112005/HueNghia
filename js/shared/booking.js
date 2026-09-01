// shared/booking.js — Panel đặt vé, ghế phụ, menu ghế, chuyển ghế, lịch sử khách, đặt lại vé. Dùng chung callcenter/ticketstaff.
// Nạp bằng <script> thường TRƯỚC script chính của trang — không dùng export/import.

// ===== Trang "Lịch sử hành khách" (Zone header, dạng bảng đầy đủ + bộ lọc ở đầu) — khác với view "Tìm
// kiếm vé khách hàng" (customerHistoryView) ở chỗ hiển thị TẤT CẢ khách chứ không theo 1 SĐT cụ thể. =====
let _allPassengerHistoryRaw = [];

// ===== Lịch chọn ngày cho bộ lọc "Ngày đi" trang Lịch sử hành khách — cùng dạng lịch chọn-ngày-bất-kỳ
// như #pkCalendarPanel (trang Rước liền), nhưng GIỮ nút "Tất cả" (khác #rbCalendarPanel ở modal Đặt lại
// vé, nơi đã bỏ nút này) vì trang này về bản chất là xem toàn bộ lịch sử — "Tất cả ngày" là trạng thái
// mặc định có ý nghĩa, không phải trường hợp biên. =====
const PH_MONTH_NAMES = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
let phCalDate = new Date();
let phSelectedDateStr = null; // null = "Tất cả ngày"
let phCalendarOpen = false;

function phRenderCalendar() {
  const calGrid = document.getElementById('phCalGrid');
  const monthLabel = document.getElementById('phCalMonthLabel');
  if (!calGrid || !monthLabel) return;
  const today = new Date();
  const y = phCalDate.getFullYear(), m = phCalDate.getMonth();
  monthLabel.textContent = `${PH_MONTH_NAMES[m]}, ${y}`;
  const first = new Date(y, m, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const daysInPrevMonth = new Date(y, m, 0).getDate();
  let html = '';
  ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].forEach(d => { html += `<div class="cal-dow">${d}</div>`; });
  for (let i = 0; i < startOffset; i++) {
    html += `<div class="cal-day muted">${daysInPrevMonth - startOffset + i + 1}</div>`;
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(y, m, d);
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = dateObj.toDateString() === today.toDateString();
    const isSelected = dateStr === phSelectedDateStr;
    html += `<div class="cal-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" data-action="phPickDate" data-args='[${y},${m},${d}]'>${d}</div>`;
  }
  const totalCells = startOffset + daysInMonth;
  const trailing = (7 - (totalCells % 7)) % 7;
  for (let i = 1; i <= trailing; i++) {
    html += `<div class="cal-day muted">${i}</div>`;
  }
  calGrid.innerHTML = html;
}

function phShiftMonth(dir) {
  phCalDate = new Date(phCalDate.getFullYear(), phCalDate.getMonth() + dir, 1);
  phRenderCalendar();
}

function phGoToday() {
  const today = new Date();
  phCalDate = new Date(today);
  phSelectedDateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  phRenderCalendar();
  phUpdateCalTrigger();
  phToggleCalendar(false);
  renderPassengerHistoryTable();
}

function phPickDate(y, m, d) {
  phSelectedDateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  phRenderCalendar();
  phUpdateCalTrigger();
  phToggleCalendar(false);
  renderPassengerHistoryTable();
}

function phClearDateFilter() {
  phSelectedDateStr = null;
  phRenderCalendar();
  phUpdateCalTrigger();
  phToggleCalendar(false);
  renderPassengerHistoryTable();
}

function phUpdateCalTrigger() {
  const label = document.getElementById('phFilterDateLabel');
  if (!label) return;
  label.textContent = phSelectedDateStr ? formatHistoryDate(phSelectedDateStr) : 'Tất cả ngày';
}

function phToggleCalendar(force) {
  const panel = document.getElementById('phCalendarPanel');
  const btn = document.getElementById('phFilterDateBtn');
  if (!panel || !btn) return;
  phCalendarOpen = typeof force === 'boolean' ? force : !phCalendarOpen;
  panel.classList.toggle('open', phCalendarOpen);
  btn.classList.toggle('open', phCalendarOpen);
}

document.addEventListener('click', (e) => {
  if (phCalendarOpen && !e.target.closest('#phCalendarPanel') && !e.target.closest('#phFilterDateBtn')) {
    phToggleCalendar(false);
  }
});

function openPassengerHistoryView() {
  _allPassengerHistoryRaw = loadAllPassengerHistory();
  rebuildPhFilterOptions();
  phRenderCalendar();
  phUpdateCalTrigger();
  // Luôn quay về bảng lịch sử mặc định khi vào lại trang này — tránh giữ trạng thái "đang xem Ghế hủy"
  // từ lần trước, gây hiểu nhầm là trang chưa tải xong dữ liệu lịch sử mới.
  if (phCancelledViewActive) {
    phCancelledViewActive = false;
    const btn = document.getElementById('phCancelledBtn');
    const cancelledWrap = document.getElementById('phCancelledTableWrap');
    const cancelledEmpty = document.getElementById('phCancelledEmpty');
    if (btn) btn.classList.remove('active');
    if (cancelledWrap) cancelledWrap.style.display = 'none';
    if (cancelledEmpty) cancelledEmpty.style.display = 'none';
    const historyWrap = document.getElementById('phHistoryTableWrap');
    if (historyWrap) historyWrap.style.display = '';
  }
  renderPassengerHistoryTable();
}

// Suy chiều của 1 tuyến: ưu tiên store dùng chung (FleetStore — hướng do Admin cấu hình, đúng cả với
// tuyến KHÔNG bắt đầu bằng "Sài Gòn"), fallback về quy ước cũ route.startsWith('Sài Gòn').
function phRouteSense(route) {
  try {
    if (window.FleetStore && typeof FleetStore.getRouteSense === 'function') {
      const s = FleetStore.getRouteSense(route);
      if (s === 'di' || s === 've') return s;
    }
  } catch (e) { /* fallback */ }
  return (route || '').startsWith('Sài Gòn') ? 'di' : 've';
}

// Tuyến đường phụ thuộc vào hướng đi đã chọn (Chiều đi = xuất phát từ Sài Gòn, Chiều về = ngược lại).
function rebuildPhRouteOptions() {
  const routeEl = document.getElementById('phFilterRoute');
  if (!routeEl) return;
  const dirVal = document.getElementById('phFilterDirection')?.value || '';
  const prevVal = routeEl.value;
  const pool = _allPassengerHistoryRaw.filter(r => {
    if (!dirVal) return true;
    const isDi = phRouteSense(r.route) === 'di';
    return dirVal === 'chieu-di' ? isDi : !isDi;
  });
  const routes = Array.from(new Set(pool.map(r => r.route).filter(Boolean))).sort();
  routeEl.innerHTML = `<option value="all">Tất cả tuyến</option>` +
    routes.map(r => `<option value="${r}">${r}</option>`).join('');
  routeEl.value = routes.includes(prevVal) ? prevVal : 'all';
}

function phOnFilterDirectionChange() {
  rebuildPhRouteOptions();
  renderPassengerHistoryTable();
}

function rebuildPhFilterOptions() {
  const routeEl = document.getElementById('phFilterRoute');
  const staffEl = document.getElementById('phFilterStaff');
  if (!routeEl) return;
  rebuildPhRouteOptions();
  if (staffEl) {
    // Nhân viên "Đặt" và "Bán" có thể khác nhau trên cùng 1 vé (bookStaff/sellStaff) — gộp chung 1 danh
    // sách lựa chọn, lọc thì khớp với 1 trong 2 vai trò (xem renderPassengerHistoryTable()).
    const staffCodes = Array.from(new Set(
      _allPassengerHistoryRaw.flatMap(r => [r.bookStaff, r.sellStaff]).filter(s => s && s !== '—')
    )).sort();
    staffEl.innerHTML = `<option value="all">Tất cả nhân viên</option>` +
      staffCodes.map(s => `<option value="${s}">${s}</option>`).join('');
  }
}

function resetPhFilters() {
  const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
  setVal('phSearchInput', '');
  phSelectedDateStr = null;
  phCalDate = new Date();
  phUpdateCalTrigger();
  phRenderCalendar();
  setVal('phFilterDirection', '');
  rebuildPhRouteOptions();
  setVal('phFilterTime', 'all');
  setVal('phFilterStaff', 'all');
  renderPassengerHistoryTable();
}

let phSearchInputDebounceTimer = null;
function phOnSearchInput(val) {
  clearTimeout(phSearchInputDebounceTimer);
  phSearchInputDebounceTimer = setTimeout(renderPassengerHistoryTable, 300);
}

function renderPassengerHistoryTable() {
  const searchVal = (document.getElementById('phSearchInput')?.value || '').trim().toLowerCase();
  const dirVal = document.getElementById('phFilterDirection')?.value || '';
  const routeVal = document.getElementById('phFilterRoute')?.value || 'all';
  const timeVal = document.getElementById('phFilterTime')?.value || 'all';
  const staffVal = document.getElementById('phFilterStaff')?.value || 'all';

  const filtered = (_allPassengerHistoryRaw || []).filter(r => {
    if (searchVal) {
      const matchName = r.name && r.name.toLowerCase().includes(searchVal);
      const matchPhone = r.phone && r.phone.toLowerCase().includes(searchVal);
      if (!matchName && !matchPhone) return false;
    }
    if (phSelectedDateStr && r.date !== phSelectedDateStr) return false;
    if (dirVal) {
      const isDi = phRouteSense(r.route) === 'di';
      if (dirVal === 'chieu-di' && !isDi) return false;
      if (dirVal === 'chieu-ve' && isDi) return false;
    }
    if (routeVal !== 'all' && r.route !== routeVal) return false;
    if (timeVal !== 'all') {
      const hh = parseInt((r.time || '00:00').split(':')[0], 10);
      if (timeVal === 'morning' && (hh < 0 || hh >= 12)) return false;
      if (timeVal === 'afternoon' && (hh < 12 || hh >= 18)) return false;
      if (timeVal === 'evening' && (hh < 18 || hh > 24)) return false;
    }
    if (staffVal !== 'all' && r.bookStaff !== staffVal && r.sellStaff !== staffVal) return false;
    return true;
  });

  // idx phải trỏ đúng vị trí trong mảng ĐANG HIỂN THỊ (đã lọc) — openEditFromHistory/goToTripFromHistory
  // đọc lại đúng mảng này qua window._historyResults, cùng quy ước với customerHistoryView.
  window._historyResults = filtered;
  _historyResults = filtered;

  const tbody = document.getElementById('phHistoryTableBody');
  const emptyEl = document.getElementById('phHistoryEmpty');
  if (tbody) tbody.innerHTML = filtered.map((r, idx) => renderPassengerHistoryRowHtml(r, idx)).join('');
  if (emptyEl) emptyEl.style.display = filtered.length ? 'none' : 'block';
}

function renderPassengerHistoryRowHtml(r, idx) {
  const { firstStopHtml, lastStopHtml } = getHistoryStopsDisplay(r);
  const plate = r.plate || '51F-123.45';
  const vehicleType = r.vehicleType || 'Limousine 24 Phòng';
  const driver = r.driver || 'Trần Văn Hùng';
  const helper = r.helper || 'Nguyễn Văn Bình';
  const bookStaffStr = getStaffCode(r.bookStaff || r.staff) || 'NV01';
  const sellStaffStr = r.sellStaff ? (getStaffCode(r.sellStaff) || r.sellStaff) : (r.paid ? 'NV05' : '—');
  const priceStr = r.price ? r.price.toLocaleString('vi-VN') + 'đ' : '—';
  const seatCount = r.seat ? r.seat.split(',').map(s => s.trim()).filter(Boolean).length : 0;
  // Cột "Thời gian" gộp luôn phần ngày (không còn cột "Ngày" riêng vì trùng thông tin) — lấy cả ngày
  // lẫn giờ từ cùng 1 mốc seat.actionTime thay vì ghép với r.date (ngày khởi hành chuyến, có thể khác
  // ngày nhân viên thao tác).
  const actionTimeStr = r.actionTime ? `${formatHistoryDate(r.actionTime)} ${formatActionTime(r.actionTime)}` : '—';
  // Ghi chú của khách hàng — chỉ hiện chữ (không icon), line-clamp 2 dòng để không kéo dài chiều cao hàng.
  const noteSafe = escapeHtml(r.note || '');
  const noteHtml = r.note
    ? `<span class="pax-note-clamp">${noteSafe}</span>`
    : `<span class="pax-note-empty">—</span>`;
  // Phân biệt nhân viên đặt/bán bằng màu tag thay vì chữ "Đặt:"/"Bán:" — đặt (giữ chỗ) tag nền vàng,
  // bán (thu tiền, chốt vé) tag nền đỏ, theo đúng 2 tông màu trạng thái đã dùng xuyên suốt hệ thống
  // (vàng = đang chờ/giữ chỗ, đỏ = thương hiệu/hoàn tất). Chưa có nhân viên bán (sellStaffStr === '—')
  // thì hiện gạch ngang trung tính, không tô màu đỏ cho ô rỗng.
  const staffTagsHtml = `<div class="staff-tag-stack">
    <span class="staff-tag staff-tag-book">${bookStaffStr}</span>
    ${sellStaffStr === '—' ? `<span class="staff-tag staff-tag-empty">—</span>` : `<span class="staff-tag staff-tag-sell">${sellStaffStr}</span>`}
  </div>`;

  return `
    <tr>
      <td style="text-align:center; font-weight:600; color:#6b7280;">${idx + 1}</td>
      <td>
        <span class="ch-trip-link" data-action="goToTripFromHistory" data-args='${JSON.stringify(["__event__", idx])}' title="Biển số xe: ${plate} • Loại xe: ${vehicleType} • Tài xế: ${driver} • Phụ xe: ${helper}">${r.route} — ${r.time}</span>
      </td>
      <td class="ch-col-ellipsis" title="${r.name || '—'}">${r.name || '—'}</td>
      <td class="mono ch-col-nowrap">${r.phone || '—'}</td>
      <td>
        <div class="pax-route">
          <div class="pax-route-row pax-route-from">
            <svg class="pax-route-icon" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/></svg>
            <div class="pax-route-text">${firstStopHtml}</div>
          </div>
          <div class="pax-route-connector"></div>
          <div class="pax-route-row pax-route-to">
            <svg class="pax-route-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
            <div class="pax-route-text">${lastStopHtml}</div>
          </div>
        </div>
      </td>
      <td class="mono">${seatCount || '—'}</td>
      <td class="mono">${r.seat || '—'}</td>
      <td style="text-align:right;">${priceStr}</td>
      <td title="${noteSafe}">${noteHtml}</td>
      <td>${staffTagsHtml}</td>
      <td class="mono" style="color:var(--text-sub);font-style:italic;font-weight:400;">${actionTimeStr}</td>
      <td><button type="button" class="btn ph-rebook-btn" data-action="openRebookFromHistory" data-args='${JSON.stringify([idx])}' title="Đặt lại" aria-label="Đặt lại"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg></button></td>
    </tr>
  `;
}

// ===== Nút "Ghế hủy" trên trang "Lịch sử hành khách" — khác tab "Ghế hủy" trong màn đặt vé (chỉ xem
// được ghế hủy của 1 chuyến đang chọn), nút này gộp ghế hủy của TẤT CẢ phơi xe (mọi tripSeatBank) lại
// thành 1 danh sách duy nhất, kèm nguyên nhân hủy, để tra cứu nhanh không cần mở từng chuyến. =====
let phCancelledViewActive = false;

// Nhân viên đang đăng nhập thực hiện thao tác hủy ghế — đọc từ phiên đăng nhập (giống
// getCurrentStaffLabel() ở ticketstaff-manifest-core.js), đặt ở đây (file dùng chung booking.js) vì
// trước đây callcenter.html không nạp ticketstaff-manifest-core.js (nay callcenter.html đã gộp vào
// ticketstaff.html, chỗ khai báo vẫn giữ ở đây vì booking.js là code lõi đặt vé dùng chung).
function getCurrentActionStaffCode() {
  try {
    const raw = sessionStorage.getItem(HN_CURRENT_USER_KEY);
    if (raw) {
      const user = JSON.parse(raw);
      if (user && user.username) return getStaffCode(user.username) || user.username;
    }
  } catch (e) { /* ignore */ }
  const nameEl = document.getElementById('userName');
  return (nameEl && nameEl.textContent.trim()) || 'NV trực';
}

function loadAllCancelledSeats() {
  const results = [];
  Object.keys(tripSeatBank || {}).forEach(tripId => {
    const bank = tripSeatBank[tripId];
    if (!bank || !Array.isArray(bank.cancelledSeats) || bank.cancelledSeats.length === 0) return;
    const tripMeta = (allTripsMeta || []).find(t => t.id === tripId);
    bank.cancelledSeats.forEach(item => {
      results.push({
        ...item,
        route: (tripMeta && tripMeta.route) || '—',
        time: (tripMeta && tripMeta.time) || ''
      });
    });
  });
  return results.sort((a, b) => (b.cancelTime || '').localeCompare(a.cancelTime || ''));
}

function renderPhCancelledTable() {
  const all = loadAllCancelledSeats();
  const tbody = document.getElementById('phCancelledTableBody');
  const emptyEl = document.getElementById('phCancelledEmpty');
  if (!tbody) return;

  if (!all.length) {
    tbody.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'block';
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';

  tbody.innerHTML = all.map((item, idx) => {
    // Hành trình trình bày giống hệt cột "Hành trình" bảng Lịch sử hành khách (chấm đỏ = điểm đi, ghim
    // xám = điểm đến, nối bằng 1 đường kẻ ngắn) — getHistoryStopsDisplay() chỉ cần firstStop/lastStop,
    // cancelledRecord không có guestType nên tự bỏ qua phần đón/trả trung chuyển, chỉ hiện đúng 2 trạm.
    const { firstStopHtml, lastStopHtml } = getHistoryStopsDisplay(item);
    const priceStr = item.price ? item.price.toLocaleString('vi-VN') + 'đ' : '—';
    const reasonText = item.reason || 'Không có lý do';
    const timeText = item.cancelTime || '—';
    const tripLabel = item.time ? `${item.route} — ${item.time}` : (item.route || '—');
    const staffStr = getStaffCode(item.cancelStaff) || item.cancelStaff || '—';

    return `
      <tr>
        <td style="text-align:center; font-weight:600; color:#6b7280;">${idx + 1}</td>
        <td>${tripLabel}</td>
        <td><b>${item.customerName || '—'}</b></td>
        <td>${item.phone || '—'}</td>
        <td>
          <div class="pax-route">
            <div class="pax-route-row pax-route-from">
              <svg class="pax-route-icon" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/></svg>
              <div class="pax-route-text">${firstStopHtml}</div>
            </div>
            <div class="pax-route-connector"></div>
            <div class="pax-route-row pax-route-to">
              <svg class="pax-route-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
              <div class="pax-route-text">${lastStopHtml}</div>
            </div>
          </div>
        </td>
        <td class="mono" style="text-align:center;">1</td>
        <td class="mono" style="text-align:center;"><b style="color:var(--red,#C20D08);">${item.code}</b></td>
        <td style="font-weight:600;">${priceStr}</td>
        <td style="color:#dc2626; font-weight:600;">${reasonText}</td>
        <td>${staffStr}</td>
        <td style="color:#6b7280; font-size:13px;">${timeText}</td>
      </tr>
    `;
  }).join('');
}

function phToggleCancelledView() {
  phCancelledViewActive = !phCancelledViewActive;
  const btn = document.getElementById('phCancelledBtn');
  const historyWrap = document.getElementById('phHistoryTableWrap');
  const cancelledWrap = document.getElementById('phCancelledTableWrap');
  const historyEmpty = document.getElementById('phHistoryEmpty');
  const cancelledEmpty = document.getElementById('phCancelledEmpty');
  if (btn) btn.classList.toggle('active', phCancelledViewActive);

  if (phCancelledViewActive) {
    if (historyWrap) historyWrap.style.display = 'none';
    if (historyEmpty) historyEmpty.style.display = 'none';
    if (cancelledWrap) cancelledWrap.style.display = '';
    renderPhCancelledTable();
  } else {
    if (cancelledWrap) cancelledWrap.style.display = 'none';
    if (cancelledEmpty) cancelledEmpty.style.display = 'none';
    if (historyWrap) historyWrap.style.display = '';
    renderPassengerHistoryTable();
  }
}

function cancelTransferSelection() {
  exitMultiSelectMode();
  showToast('Đã hủy thao tác chuyển ghế');
}

// Chặn các thao tác đơn lẻ trên 1 ghế (đặt vé, sửa vé, hủy vé, mở menu ghế) trong lúc đang chọn nhiều
// ghế để chuyển ghế/đặt vé nhóm — trước đây các nút này không kiểm tra multiSelectMode nên bấm được
// song song, gây lẫn lộn trạng thái. Trả về true nếu đã chặn (gọi nơi dùng: if (blockIfMultiSelectActive()) return;).
function blockIfMultiSelectActive() {
  if (!multiSelectMode) return false;
  const modeLabel = selectionMode === 'transfer' ? 'chuyển ghế' : 'đặt vé nhóm';
  showToast(`Đang chọn ghế để ${modeLabel} — vui lòng hoàn tất hoặc hủy thao tác này trước`);
  return true;
}

function cancelledSeatCard(seat) {
  const firstStopShort = shortenStopName(seat.firstStop) || '—';
  const lastStopShort = shortenStopName(seat.lastStop) || '—';
  const routeStr = `${firstStopShort} → ${lastStopShort}`;
  const custName = seat.customerName || '—';
  const custPhone = seat.phone || '—';
  const noteStr = seat.note || '—';
  const priceStr = seat.price ? seat.price.toLocaleString('vi-VN') + 'đ' : '—';

  return `
  <div class="seat-card cancelled" data-code="${seat.code}">
    <div class="seat-top">
      <div>
        <div class="seat-code">${seat.code}</div>
      </div>
      <div class="seat-top-right">
        <div class="seat-price-tag">${priceStr}</div>
      </div>
    </div>
    <div class="seat-body">
      <div class="seat-line route-single-line"><span class="seat-label-full">Chặng đi: </span><span class="seat-stop" title="${routeStr}">${routeStr}</span></div>
      <div class="route-split-line">
        <div class="route-split-row"><span class="route-split-label">Đi:</span><span class="seat-stop" title="${firstStopShort}">${firstStopShort}</span></div>
        <div class="route-split-row"><span class="route-split-label">Đến:</span><span class="seat-stop" title="${lastStopShort}">${lastStopShort}</span></div>
      </div>
      <div class="seat-line" style="color:var(--text-main); font-weight:700;"><span class="seat-label-full">Khách hàng: </span><span class="seat-label-short">KH: </span>${custName}</div>
      <div class="seat-line" style="color:var(--text-main); font-weight:700;"><span class="seat-label-full">Số điện thoại: </span><span class="seat-label-short">SĐT: </span>${custPhone}</div>
      <div class="seat-note" title="${noteStr}"><span class="seat-label-full">Ghi chú: </span><span class="seat-label-short">GC: </span>${noteStr}</div>
    </div>
    <button type="button" class="seat-footbtn cancelled" data-action="startTransferFromCancelled" data-stop-propagation="1" data-args='${JSON.stringify([seat.id])}'>
      <span class="foot-text-normal">GHẾ ĐÃ HỦY</span><span class="foot-text-hover">CHUYỂN GHẾ</span>
    </button>
  </div>`;
}

function clearPaxFilter() {
  document.querySelectorAll('.pax-filter-opt input').forEach(cb => cb.checked = false);
  renderPassengerList();
}

function closeCustomerHistory() {
  customerHistoryActive = false;
  currentSearchPhone = '';
  const chView = document.getElementById('customerHistoryView');
  if (chView) chView.style.display = 'none';
  const rightCol = document.querySelector('.right-col');
  if (rightCol) {
    ['.zone2', '.tabs'].forEach(sel => {
      const el = rightCol.querySelector(sel);
      if (el) el.style.display = '';
    });
  }
  const activeTabEl = document.querySelector('.tabs .tab-item.active');
  const match = activeTabEl ? /switchTab\('([^']+)'/.exec(activeTabEl.getAttribute('onclick') || '') : null;
  switchTab(match ? match[1] : 'seatmap', activeTabEl || document.querySelector('.tabs .tab-item'));

  const si = document.getElementById('searchInput');
  if (si) si.value = '';
}

function closeRebookModal() {
  const modal = document.getElementById('rebookModal');
  if (modal) {
    modal.classList.remove('open');
    modal.style.display = 'none';
    modal.style.setProperty('display', 'none', 'important');
  }
}

function closeSeatMenu() { document.getElementById('seatMenu').classList.remove('open'); }

function startTransferMode(sourceCode) {
  const seat = findSeat(sourceCode);
  if (!seat) return;
  multiSelectMode = true;
  selectionMode = 'transfer';
  selectedSourceSeats = [sourceCode];
  selectedTargetSeats = [];
  transferSourceTripId = currentTripId;
  transferTargetTripId = currentTripId;
  document.querySelectorAll('.seat-card').forEach(c => { c.style.outline = 'none'; });
  const sourceCard = document.querySelector(`.seat-card[data-code="${sourceCode}"]`);
  if (sourceCard) { sourceCard.style.outline = '2.5px solid var(--red)'; sourceCard.style.outlineOffset = '1px'; }
  updateTransferHint();
  showToast(`Đã chọn ghế ${sourceCode}. Bấm ghế trống để chuyển sang (có thể chọn chuyến khác ở Zone 1).`);
}

function confirmSelectionAction() {
  if (transferSourceCancelId) {
    confirmRestoreFromCancelled();
    return;
  }
  if (selectedSourceSeats.length > 0) {
    confirmTransfer();
    return;
  }
  openGroupBookingFromSelection();
}

function deleteSubSeat(code) {
  subSeats = subSeats.filter(s => s.code !== code);
  if (tripSeatBank[currentTripId]) tripSeatBank[currentTripId].subSeats = subSeats;
  saveSeatBank();
  renderSubSeats();
  updateTripStats();
  updatePassengerTabCount();
  showToast('Đã xóa ghế phụ');
}

function exitMultiSelectMode() {
  multiSelectMode = false;
  selectionMode = null;
  selectedSourceSeats = [];
  selectedTargetSeats = [];
  transferSourceTripId = null;
  transferTargetTripId = null;
  transferSourceCancelId = null;
  document.querySelectorAll('.seat-card').forEach(c => {
    c.style.outline = 'none';
    c.style.boxShadow = 'none';
  });
  document.getElementById('stickyHint').textContent = '';
  updateTransferBarVisibility();
}

function findSeat(code) {
  return seatPlanDown.find(s => s.code === code) || seatPlanUp.find(s => s.code === code) || extraLeftoverSeats.find(s => s.code === code);
}

function findSeatInTrip(tripId, code) {
  const bank = tripSeatBank[tripId];
  if (!bank) return null;
  return bank.down.find(s => s.code === code) || bank.up.find(s => s.code === code) || (bank.extraSeats || []).find(s => s.code === code);
}

function getHistoryStopsDisplay(r) {
  if (!r) return { firstStopHtml: '—', lastStopHtml: '—' };
  const type = r.guestType || 'Khách trạm';
  let firstStopHtml = r.firstStop || '—';
  let lastStopHtml = r.lastStop || '—';

  const pickupLoc = r.transshipStation || r.transship || r.pickupAddress || r.fromTransfer || '';
  const dropLoc = r.dropoffAddress || r.arrivalTransfer || (type === 'Trung chuyển' ? (r.transshipStation || r.transship || '') : '');

  if (type === 'Rước liền' && pickupLoc) {
    firstStopHtml = `${r.firstStop || 'Trạm đi'}<div class="ch-sub-address" style="font-size:12px;color:var(--text-sub);margin-top:2px;">Rước liền: ${pickupLoc}</div>`;
  } else if (type === 'Rước đường' && pickupLoc) {
    firstStopHtml = `${r.firstStop || 'Trạm đi'}<div class="ch-sub-address" style="font-size:12px;color:var(--text-sub);margin-top:2px;">Rước: ${pickupLoc}</div>`;
  } else if (type === 'Trung chuyển' && pickupLoc) {
    firstStopHtml = `${r.firstStop || 'Trạm đi'}<div class="ch-sub-address" style="font-size:12px;color:var(--text-sub);margin-top:2px;">Đón: ${pickupLoc}</div>`;
  }
  // Tách riêng khỏi nhánh trên (thay vì if/else-if chung 1 chuỗi): trước đây "Rước liền"/"Rước đường" khớp
  // nhánh của mình rồi dừng, không bao giờ chạy tới đây nên "Trung chuyển đến" (dropLoc) bị bỏ sót dù đã nhập.
  if (dropLoc) {
    const dropLabel = type === 'Trung chuyển' ? 'TC: ' : '';
    lastStopHtml = `${r.lastStop || 'Trạm đến'}<div class="ch-sub-address" style="font-size:12px;color:var(--text-sub);margin-top:2px;">${dropLabel}${dropLoc}</div>`;
  }

  return { firstStopHtml, lastStopHtml };
}

// Trả về true nếu chuyển phơi thành công, false nếu chuyến quá cũ/không còn — openEditFromHistory() dựa
// vào giá trị này để biết có nên tiếp tục mở panel sửa ghế hay không (tránh sửa nhầm ghế của phơi khác
// nếu chuyển phơi thất bại). Các nơi gọi hàm này từ trước (link tên phơi) không đọc giá trị trả về, không
// ảnh hưởng hành vi cũ.
// highlightSeat=false khi gọi từ goToTransshipFromHistory (tag "Trung chuyển") — nơi đó tự chuyển sang
// tab "Trung chuyển" và highlight đúng hàng của khách trong bảng đó, sơ đồ ghế không hiện nên không cần
// (và không nên) bật thêm tab "Sơ đồ ghế" chồng lên.
function goToTripFromHistory(e, idx, pushHistory = true, highlightSeat = true) {
  if (e) e.stopPropagation();
  const list = window._historyResults || _historyResults || [];
  const r = list[idx];
  if (!r) return false;

  const prevPhone = currentSearchPhone || r.phone;
  closeCustomerHistory();

  if (typeof currentView !== 'undefined' && currentView !== 'booking' && typeof switchView === 'function') {
    switchView('booking');
  }

  let targetTripId = r.tripId || allTripsMeta?.find(t => t.route === r.route && (t.time === r.time || !r.time))?.id;
  if (!targetTripId || !tripSeatBank[targetTripId]) {
    showToast(`Chuyến "${r.route} (${r.time})" đã quá cũ, không còn phơi xe để hiển thị`, 'warning');
    return false;
  }

  if (pushHistory) {
    try { history.pushState({ view: 'trip', tripId: targetTripId, phone: prevPhone }, '', '#trip-' + targetTripId); } catch (err) { }
  }

  const targetDir = r.route?.trim().startsWith('Châu Đốc') ? 'cd-sg' : 'sg-cd';
  if (typeof selectedDirection !== 'undefined' && selectedDirection !== targetDir && directionLabels?.[targetDir]) {
    selectedDirection = targetDir;
    selectedRoute = 'all';
    const dVal = document.getElementById('directionTrigger');
    if (dVal) dVal.value = directionLabels[targetDir];
    const rVal = document.getElementById('routeTrigger');
    if (rVal) rVal.value = 'Tất cả tuyến';
    document.querySelectorAll('#directionDropdown .dropdown-item').forEach(item => {
      item.classList.toggle('active', item.dataset.dir === targetDir);
    });
    if (typeof renderRouteOptions === 'function') renderRouteOptions();
    const sgList = document.getElementById('tripListSGCD');
    const cdList = document.getElementById('tripListCDSG');
    if (sgList && cdList) {
      sgList.style.display = targetDir === 'cd-sg' ? 'none' : '';
      cdList.style.display = targetDir === 'cd-sg' ? '' : 'none';
    }
  }

  const card = document.querySelector(`.trip-card[data-trip="${targetTripId}"]`);
  if (card) {
    selectTrip(card, r.time, r.route);
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else if (typeof selectTrip === 'function') {
    const tripMeta = allTripsMeta.find(t => t.id === targetTripId);
    if (tripMeta) {
      const dummy = document.createElement('div');
      dummy.dataset.trip = targetTripId;
      selectTrip(dummy, tripMeta.time, tripMeta.route);
    }
  }

  // Chuyển thẳng sang tab "Sơ đồ ghế" rồi cuộn tới + highlight tạm đúng thẻ ghế của khách đó (r.seat) —
  // bấm tên phơi từ lịch sử mà vẫn phải tự dò lại ghế nào giữa 24-45 ghế thì mất tác dụng "nhảy nhanh".
  if (highlightSeat && r.seat) {
    if (typeof switchTab === 'function') {
      switchTab('seatmap', document.getElementById('tabSeatmapItem'));
    }
    requestAnimationFrame(() => {
      const seatEl = document.querySelector(`.seat-card[data-code="${r.seat}"]`);
      if (!seatEl) return;
      seatEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      seatEl.classList.add('seat-card-flash-highlight');
      setTimeout(() => seatEl.classList.remove('seat-card-flash-highlight'), 2200);
    });
  }

  showToast(`Đã chuyển sang phơi chuyến: ${r.route} (${r.time})`);
  return true;
}

// Bấm tag "Trung chuyển" trên thẻ lịch sử khách hàng (renderHistorySeatCardHtml) — nhảy tới đúng phơi
// (dùng lại goToTripFromHistory), mở thẳng tab "Trung chuyển" (switchTab, ticketstaff.js) rồi cuộn tới +
// highlight tạm đúng hàng của khách đó (khớp theo ticketNo) để không phải tự dò lại trong danh sách.
function goToTransshipFromHistory(e, idx) {
  if (e) e.stopPropagation();
  const list = window._historyResults || _historyResults || [];
  const r = list[idx];
  if (!r) return;

  const switched = goToTripFromHistory(null, idx, false, false);
  if (!switched) return;

  if (typeof switchTab === 'function') {
    switchTab('transship', document.getElementById('tabTransshipItem'));
  }

  // renderTransshipTables() (gọi bên trong switchTab) render lại toàn bộ tbody đồng bộ ngay trong cùng
  // lượt gọi ở trên — không cần chờ thêm, nhưng vẫn để trong rAF để chắc chắn trình duyệt đã áp layout
  // mới trước khi scrollIntoView (tránh cuộn hụt do bảng vừa được gắn vào DOM/đổi display ngay trước đó).
  requestAnimationFrame(() => {
    if (!r.ticketNo) return;
    const row = document.querySelector(`#transshipPickupBody tr[data-ticket="${r.ticketNo}"], #transshipDropoffBody tr[data-ticket="${r.ticketNo}"]`);
    if (!row) return;
    row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    row.classList.add('ts-row-highlight');
    setTimeout(() => row.classList.remove('ts-row-highlight'), 2200);
  });
}

// Nhãn màu riêng cho từng loại khách (khớp đúng 4 giá trị guestType có trong hệ thống, xem
// f_type/onGuestTypeChange) — dùng cho tag "Loại khách" trên thẻ lịch sử (renderHistorySeatCardHtml).
const CH_GUEST_TAG_CLASS = {
  'Khách trạm': 'ch-guest-tag--station',
  'Trung chuyển': 'ch-guest-tag--transship',
  'Rước đường': 'ch-guest-tag--roadside',
  'Rước liền': 'ch-guest-tag--roadside'
};

function renderHistorySeatCardHtml(r, custName, custPhone) {
  const { firstStopHtml, lastStopHtml } = getHistoryStopsDisplay(r);
  const bookStaffStr = getStaffCode(r.bookStaff || r.staff) || 'NV01';
  const sellStaffStr = r.sellStaff ? (getStaffCode(r.sellStaff) || r.sellStaff) : (r.paid ? 'NV05' : '—');
  const stateClass = r.state === 'sold' ? 'sold' : (r.state === 'hold' ? 'hold' : 'sold');
  // Cùng quy ước nhãn nút footer với thẻ ghế bên sơ đồ ghế chính (seatCard() trong callcenter.js/
  // ticketstaff.js) — ghế đã bán hiện "THÔNG TIN" khi hover (mở panel chỉ xem, không sửa được), ghế
  // "hold" hiện "CHỈNH SỬA".
  const footLabel = 'KDV - CHÂU ĐỐC';
  const footHoverLabel = r.state === 'sold' ? 'THÔNG TIN' : 'CHỈNH SỬA';

  // Tag "Loại khách" thay cho tag "Hôm nay" cũ (isToday luôn true nên tag cũ không mang thông tin gì hữu
  // ích). Riêng "Trung chuyển" bấm được — nhảy tới đúng phơi rồi mở thẳng tab "Trung chuyển", cuộn tới +
  // highlight đúng hàng của khách đó (goToTransshipFromHistory, khớp theo ticketNo).
  const guestType = r.guestType || 'Khách trạm';
  const guestTagClass = CH_GUEST_TAG_CLASS[guestType] || 'ch-guest-tag--station';
  const guestTagHtml = guestType === 'Trung chuyển'
    ? `<span class="ch-history-badge ${guestTagClass} ch-guest-tag--clickable" data-action="goToTransshipFromHistory" data-stop-propagation="1" data-args='${JSON.stringify(["__event__", r.origIdx])}' title="Xem trong Danh sách trung chuyển">${guestType}</span>`
    : `<span class="ch-history-badge ${guestTagClass}">${guestType}</span>`;

  return `
    <div class="seat-card ${stateClass} ch-seat-card-item" data-code="${r.seat}">
      <div class="seat-top">
        <div>
          <div class="seat-code" style="display:inline-block; vertical-align:middle; font-size:16px; font-weight:800;">${r.seat}</div>
          <span style="margin-left:6px;">${guestTagHtml}</span>
        </div>
        <div class="seat-top-right">
          <div class="seat-price-tag">${r.price ? r.price.toLocaleString('vi-VN') + 'đ' : '—'}</div>
        </div>
      </div>

      <div class="seat-line" style="margin-top:2px;">
        <span class="seat-label-full" style="font-weight:700;color:var(--text-sub);">Trạm đi: </span>
        <span class="seat-stop" style="font-weight:700;">${firstStopHtml}</span>
      </div>

      <div class="seat-line" style="margin-top:2px;">
        <span class="seat-label-full" style="font-weight:700;color:var(--text-sub);">Trạm đến: </span>
        <span class="seat-stop" style="font-weight:700;">${lastStopHtml}</span>
      </div>

      <div class="seat-line" style="color:var(--text-main); font-weight:700; margin-top:4px;">
        <span class="seat-label-full">Khách hàng: </span>${custName}
      </div>
      <div class="seat-line" style="color:var(--text-main); font-weight:700;">
        <span class="seat-label-full">SĐT: </span>${custPhone}
      </div>

      <div class="seat-line" style="color:var(--text-sub); font-size:11.5px; margin-top:4px;">
        <span class="seat-label-full">Nhân viên: </span>Đặt: <b>${bookStaffStr}</b> | Bán: <b class="${sellStaffStr === '—' ? 'none' : ''}">${sellStaffStr}</b>
      </div>

      <button class="seat-footbtn" type="button" data-action="openEditFromHistory" data-stop-propagation="1" data-args='${JSON.stringify([r.origIdx])}'>
        <span class="foot-text-normal">${footLabel}</span>
        <span class="foot-text-hover">${footHoverLabel}</span>
      </button>
    </div>
  `;
}

// 1 thẻ cho MỖI lần đặt vé trong lịch sử — không gom theo tuyến nữa, hiện đầy đủ toàn bộ (đã bỏ icon "i"
// + modal xem thêm). idx là vị trí của r trong mảng results gốc, dùng cho goToTripFromHistory/rebook.
function renderHistoryCardHtml(r, idx, custName, custPhone) {
  const formattedDate = formatHistoryDate(r.date);
  const plate = r.plate || '51F-123.45';
  const vehicleType = r.vehicleType || 'Limousine 24 Phòng';
  const driver = r.driver || 'Trần Văn Hùng';
  const helper = r.helper || 'Nguyễn Văn Bình';

  return `
    <div class="ch-trip-seatmap-card">
      <div class="ch-trip-header">
        <div class="ch-trip-title-info" data-action="goToTripFromHistory" data-args='${JSON.stringify(["__event__", idx])}' title="Biển số xe: ${plate} • Loại xe: ${vehicleType} • Tài xế: ${driver} • Phụ xe: ${helper}">
          <div class="ch-trip-name">
            <span class="ch-trip-link">${r.route} — ${r.time}</span>
            <span class="ch-date-tag">${formattedDate}</span>
          </div>
        </div>
      </div>

      <div class="ch-seat-cards-grid">
        ${renderHistorySeatCardHtml({ ...r, origIdx: idx }, custName, custPhone)}
      </div>
    </div>
  `;
}

// callcenter và ticketstaff dùng CHUNG hàm này (nội dung gốc giống hệt nhau, chỉ khác 1 chỗ kiểm tra
// firstResult thừa không ảnh hưởng hành vi vì luôn có results.length > 0 tại điểm đó — đã đối chiếu bằng
// diff trước khi gộp).
function renderHistorySeatMap(results) {
  const body = document.getElementById('chBody');
  if (!body) return;

  const headerHtml = `
    <div class="ch-search-header">
      <h3 class="ch-search-title">Tìm kiếm vé khách hàng</h3>
      <button type="button" class="btn btn-secondary" data-action="closeCustomerHistory">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="M18 6L6 18M6 6l12 12"/></svg>
        Đóng
      </button>
    </div>
  `;

  if (!results?.length) {
    body.innerHTML = headerHtml + `
      <div class="ch-empty" style="text-align:center;padding:40px;color:var(--text-sub);">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:40px;height:40px;margin-bottom:8px;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <div style="font-weight:600;">Không tìm thấy vé phù hợp</div>
      </div>`;
    return;
  }
  _historyResults = results;
  window._historyResults = results;

  const firstResult = results[0];
  const custName = firstResult ? (firstResult.name || 'Khách hàng') : 'Khách hàng';
  const custPhone = firstResult ? (firstResult.phone || currentSearchPhone || '—') : '—';

  const cardsHtml = results.map((r, idx) => renderHistoryCardHtml(r, idx, custName, custPhone)).join('');

  body.innerHTML = headerHtml + `<div class="ch-seatmaps-list" id="chSeatmapsList">${cardsHtml}</div>`;
}

function groupHistoryResults(rawResults) {
  if (!rawResults?.length) return [];
  const map = new Map();

  rawResults.forEach(item => {
    const phone = (item.phone || '').replace(/[\s.\-]/g, '');
    const name = (item.name || '').trim().toLowerCase();
    const tripKey = item.tripId || `${item.date}_${item.route}_${item.time}`;
    const groupKey = `${tripKey}_${phone}_${name}_${item.state}_${!!item.paid}`;

    if (!map.has(groupKey)) {
      map.set(groupKey, {
        ...item,
        seatsArray: item.seat ? item.seat.split(',').map(s => s.trim()) : [],
        ticketsArray: item.ticketNo ? [item.ticketNo] : [],
        totalPrice: Number(item.price) || 0
      });
    } else {
      const g = map.get(groupKey);
      if (item.seat) {
        item.seat.split(',').forEach(s => {
          const t = s.trim();
          if (t && !g.seatsArray.includes(t)) g.seatsArray.push(t);
        });
      }
      if (item.ticketNo && !g.ticketsArray.includes(item.ticketNo)) g.ticketsArray.push(item.ticketNo);
      g.totalPrice += Number(item.price) || 0;
      if (!g.pickupAddress && item.pickupAddress) g.pickupAddress = item.pickupAddress;
      if (!g.dropoffAddress && item.dropoffAddress) g.dropoffAddress = item.dropoffAddress;
      if (!g.note && item.note) g.note = item.note;
    }
  });

  return Array.from(map.values()).map(g => {
    g.seat = g.seatsArray.join(', ');
    g.ticketNo = g.ticketsArray.join(', ');
    g.price = g.totalPrice;
    delete g.seatsArray;
    delete g.ticketsArray;
    delete g.totalPrice;
    return g;
  });
}

function miniSeatHtml(seat, tripId) {
  if (seat.state === 'hidden') return '<div class="ch-mini-seat hidden-placeholder"></div>';
  const isAvailable = seat.state === 'empty' && !seat.locked;
  const stateClass = seat.locked ? 'locked' : seat.state;
  const selectedClass = rebookSelectedSeats.includes(seat.code) ? 'selected' : '';
  const clickHandler = isAvailable ? `data-action="toggleRebookSeat" data-args='${JSON.stringify([seat.code, tripId])}'` : '';
  return `<div class="ch-mini-seat ${stateClass} ${selectedClass}" ${clickHandler}>${seat.code}</div>`;
}

function nextSubSeatCode() {
  let max = 0;
  subSeats.forEach(s => {
    const m = /^S(\d+)$/.exec(s.code);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  });
  return 'S' + (max + 1);
}

function onGuestTypeChange() {
  const type = document.getElementById('f_type').value;
  const stationLabel = document.getElementById('f_station_label');
  const transshipWrap = document.getElementById('f_transship_wrap');
  const transshipLabel = document.getElementById('f_transship_label');
  const transshipInput = document.getElementById('f_transship');
  const stationRow = document.getElementById('f_station_row');

  stationLabel.textContent = 'Trạm đi';

  // "Địa điểm rước" (Rước đường) và "Trung chuyển đi" (Trung chuyển) dùng chung 1 ô combobox (input +
  // datalist stopPointList) — vừa gõ tự do vừa chọn gợi ý, khác nhau ở nhãn/placeholder hiển thị.
  const isTransshipLike = (type === 'Trung chuyển');
  const needsTransship = (type === 'Trung chuyển' || type === 'Rước đường');
  transshipInput.style.display = needsTransship ? 'block' : 'none';
  transshipLabel.textContent = isTransshipLike ? 'Trung chuyển đi' : 'Địa điểm rước';
  transshipInput.placeholder = isTransshipLike ? 'Nơi trung chuyển...' : 'Nhập địa điểm rước...';
  transshipWrap.style.display = needsTransship ? 'flex' : 'none';

  stationRow.style.setProperty('--cols', needsTransship ? 2 : 1);
  refreshTicket();
}

/* ===================== "Trạm đi"/"Trạm đến"/"Địa điểm rước" — Searchable Combobox ===================== */
// Cả 3 ô này trước đây mỗi ô 1 kiểu khác nhau (select cố định, hoặc input list="..." datalist) — mở/đóng
// không nhất quán giữa trình duyệt, không tự bôi đen text, không lọc real-time đáng tin cậy, không có
// trạng thái "không tìm thấy", không điều khiển được bằng bàn phím. initDatalistCombobox() dựng 1 kiểu
// dropdown chung cho cả 3, gắn thẳng vào <body> với position:fixed (tính lại toạ độ theo input mỗi lần
// mở/cuộn/resize) để không bao giờ bị .panel-body (overflow-y:auto) cắt mất dù các ô này đều nằm trong
// đó. Danh sách gợi ý đọc từ đúng <datalist> có sẵn của từng ô (không thêm/đổi dữ liệu).
function initDatalistCombobox(inputId, datalistId, emptyMessage) {
  const input = document.getElementById(inputId);
  if (!input) return;

  input.setAttribute('autocomplete', 'off');

  let dropdownEl = null;
  let currentOptions = [];
  let highlightedIndex = -1;
  // Bấm chọn 1 option xong, focus vẫn còn nguyên trên input (xem mousedown bên dưới) — không được coi
  // đây là 1 lượt "focus mới" nữa vì handler 'focus' sẽ tự bôi đen + mở lại toàn bộ danh sách, trái với
  // yêu cầu "không trigger lại việc select toàn bộ text ngay sau khi option được chọn".
  let justSelected = false;

  function getOptionValues() {
    return Array.from(document.querySelectorAll(`#${datalistId} option`))
      .map(o => o.value)
      .filter(Boolean);
  }

  function ensureDropdown() {
    if (dropdownEl) return dropdownEl;
    dropdownEl = document.createElement('div');
    dropdownEl.className = 'datalist-combo-dropdown';
    document.body.appendChild(dropdownEl);
    return dropdownEl;
  }

  function isOpen() {
    return !!dropdownEl && dropdownEl.classList.contains('open');
  }

  function positionDropdown() {
    if (!dropdownEl) return;
    const rect = input.getBoundingClientRect();
    dropdownEl.style.left = rect.left + 'px';
    dropdownEl.style.top = (rect.bottom + 4) + 'px';
    dropdownEl.style.width = rect.width + 'px';
  }

  function renderOptions(list) {
    const dd = ensureDropdown();
    currentOptions = list;
    highlightedIndex = -1;
    dd.innerHTML = list.length
      ? list.map((opt, i) => `<div class="datalist-combo-option" data-index="${i}">${escapeHtml(opt)}</div>`).join('')
      : `<div class="datalist-combo-empty">${escapeHtml(emptyMessage)}</div>`;
  }

  function openDropdown(filterText) {
    const all = getOptionValues();
    const query = (filterText || '').trim().toLowerCase();
    renderOptions(query ? all.filter(o => o.toLowerCase().includes(query)) : all);
    positionDropdown();
    ensureDropdown().classList.add('open');
  }

  function closeDropdown() {
    if (dropdownEl) dropdownEl.classList.remove('open');
    highlightedIndex = -1;
  }

  function updateHighlight() {
    if (!dropdownEl) return;
    dropdownEl.querySelectorAll('.datalist-combo-option').forEach((el, i) => {
      const active = i === highlightedIndex;
      el.classList.toggle('highlighted', active);
      if (active) el.scrollIntoView({ block: 'nearest' });
    });
  }

  function selectValue(value) {
    input.value = value;
    closeDropdown();
    justSelected = true;
    // events.js chỉ nghe event 'input' thật để chạy data-input-action="refreshTicket" — gán .value bằng
    // JS không tự bắn event, phải tự dispatch để phần xem trước vé cập nhật ngay theo giá trị vừa chọn.
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  input.addEventListener('focus', () => {
    if (justSelected) { justSelected = false; return; }
    input.select();
    openDropdown('');
  });

  // Input đã đang focus sẵn thì 'focus' không bắn lại — vẫn cần 'click' để bấm lại lần nữa sau khi đã
  // chọn 1 giá trị (bôi đen + mở lại toàn bộ danh sách) vẫn hoạt động đúng.
  input.addEventListener('click', () => {
    input.select();
    openDropdown('');
  });

  input.addEventListener('input', () => {
    openDropdown(input.value);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen()) { openDropdown(input.value); return; }
      if (currentOptions.length) {
        highlightedIndex = (highlightedIndex + 1) % currentOptions.length;
        updateHighlight();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen()) { openDropdown(input.value); return; }
      if (currentOptions.length) {
        highlightedIndex = (highlightedIndex - 1 + currentOptions.length) % currentOptions.length;
        updateHighlight();
      }
    } else if (e.key === 'Enter') {
      if (isOpen() && highlightedIndex >= 0 && currentOptions[highlightedIndex] !== undefined) {
        e.preventDefault();
        selectValue(currentOptions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      if (isOpen()) {
        e.preventDefault();
        closeDropdown();
      }
    }
    // Backspace/Delete/Tab: không can thiệp, giữ nguyên hành vi mặc định của trình duyệt.
  });

  // Bắt buộc dùng 'mousedown' + preventDefault() (không phải 'click') trên option — 'click' bắn SAU
  // 'blur', nên nếu chỉ nghe 'click' thì input đã blur/đóng dropdown trước khi lựa chọn được xử lý, làm
  // mất lượt bấm (lỗi kinh điển "chọn option bị mất do input blur trước"). preventDefault() ở mousedown
  // chặn luôn việc input mất focus, nên không có 'blur' nào xảy ra ở giữa cả.
  document.addEventListener('mousedown', (e) => {
    const optionEl = e.target.closest('.datalist-combo-option');
    if (optionEl && dropdownEl && dropdownEl.contains(optionEl)) {
      e.preventDefault();
      const idx = parseInt(optionEl.getAttribute('data-index'), 10);
      if (currentOptions[idx] !== undefined) selectValue(currentOptions[idx]);
      return;
    }
    if (e.target === input) return;
    if (isOpen() && dropdownEl && !dropdownEl.contains(e.target)) closeDropdown();
  });

  input.addEventListener('blur', () => {
    // Rời input bằng Tab/click ra ngoài không qua option (bấm option đã được giữ focus nhờ
    // preventDefault() ở mousedown nên không rơi vào đây) — đóng dropdown lại cho gọn.
    closeDropdown();
  });

  window.addEventListener('scroll', () => { if (isOpen()) positionDropdown(); }, true);
  window.addEventListener('resize', () => { if (isOpen()) positionDropdown(); });
}

initDatalistCombobox('f_transship', 'stopPointList', 'Không tìm thấy địa điểm');
initDatalistCombobox('f_station_select', 'departureStationList', 'Không tìm thấy trạm');
initDatalistCombobox('f_destination', 'destinationStationList', 'Không tìm thấy trạm');

function onRebookGuestTypeChange() {
  const type = document.getElementById('rbGuestType')?.value || 'Khách trạm';
  const stationLabel = document.getElementById('rbStationLabel');
  const transshipWrap = document.getElementById('rbTransshipWrap');
  const transshipLabel = document.getElementById('rbTransshipLabel');
  const transshipSelect = document.getElementById('rbTransshipSelect');
  const transshipInput = document.getElementById('rbTransshipInput');
  const stationRow = document.getElementById('rbStationRow');

  const isTransshipLike = (type === 'Trung chuyển');
  if (type === 'Rước đường') {
    if (stationLabel) stationLabel.textContent = 'Trạm đi';
    if (transshipLabel) transshipLabel.textContent = 'Địa điểm rước';
    if (transshipSelect) transshipSelect.style.display = 'block';
    if (transshipInput) transshipInput.style.display = 'none';
    if (transshipWrap) transshipWrap.style.display = 'flex';
  } else {
    if (stationLabel) stationLabel.textContent = 'Trạm đi';
    if (transshipSelect) transshipSelect.style.display = 'none';
    if (transshipInput) {
      transshipInput.style.display = isTransshipLike ? 'block' : 'none';
      transshipInput.placeholder = isTransshipLike ? 'Nơi trung chuyển...' : 'Nhập địa điểm rước...';
    }
    if (transshipLabel) transshipLabel.textContent = isTransshipLike ? 'Trung chuyển đi' : 'Địa điểm rước';
    if (transshipWrap) transshipWrap.style.display = isTransshipLike ? 'flex' : 'none';
  }
  if (stationRow) stationRow.style.setProperty('--cols', (!transshipWrap || transshipWrap.style.display === 'none') ? 1 : 2);
}

function openCustomerHistory(phone, pushHistory = true) {
  fillSearchInputWithPhone(phone);
  historyColumnFilters = {};
  const results = searchCustomerByPhone(phone);
  _rawHistoryResults = results;

  if (!results.length) {
    showToast('Không tìm thấy vé phù hợp với: ' + phone, 'error');
    return;
  }
  customerHistoryActive = true;
  currentSearchPhone = phone;

  if (pushHistory) {
    try {
      if (!history.state || history.state.view !== 'customerHistory' || history.state.phone !== phone) {
        history.pushState({ view: 'customerHistory', phone }, '', '#history-' + encodeURIComponent(phone));
      }
    } catch (err) { }
  }

  const firstResult = results[0];
  const setTxt = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
  setTxt('chName', firstResult.name || 'Khách hàng');
  setTxt('chPhone', firstResult.phone || phone);
  setTxt('chAvatar', (firstResult.name || 'K').charAt(0).toUpperCase());

  renderHistorySeatMap(results);

  const rightCol = document.querySelector('.right-col');
  if (rightCol) {
    ['.zone2', '.tabs'].forEach(sel => {
      const el = rightCol.querySelector(sel);
      if (el) el.style.display = 'none';
    });
    // Thanh chọn ghế lấy theo id (xem updateTransferBarVisibility) — '.sticky-actions' sẽ trúng nhầm #tsPrintActionBar.
    const seatTransferBar = document.getElementById('seatTransferBar');
    if (seatTransferBar) seatTransferBar.style.display = 'none';
    rightCol.querySelectorAll('.zone3').forEach(el => el.style.display = 'none');
  }

  const chView = document.getElementById('customerHistoryView');
  if (chView) chView.style.display = 'flex';
  const sr = document.getElementById('searchResults');
  if (sr) sr.classList.remove('open');
}

function openGroupBookingFromSelection() {
  if (!multiSelectMode || selectedTargetSeats.length === 0) {
    showToast('Vui lòng chọn ít nhất 1 ghế trống để đặt vé nhóm');
    return;
  }
  const seats = selectedTargetSeats.map(code => findSeat(code)).filter(Boolean);
  if (seats.length === 0) {
    showToast('Không tìm thấy ghế đã chọn');
    return;
  }
  openBookingPanel(seats);
}

// Nút "Chỉnh sửa" trên thẻ vé ở view "Tìm kiếm vé khách hàng" (renderHistorySeatCardHtml — chỉ chứa vé
// TRONG NGÀY, xem searchCustomerByPhone) gọi hàm này — chuyển đúng phơi (dùng lại goToTripFromHistory)
// rồi mở panel sửa ghế y hệt bên sơ đồ vé (openBookingPanel mode 'edit'), thay vì mở form đặt lại vé mới.
// Trang "Lịch sử hành khách" (renderPassengerHistoryRowHtml) KHÔNG dùng hàm này — trang đó gồm cả vé quá
// khứ đã kết thúc (CUSTOMER_HISTORY_DATA, không còn ghế sống để sửa) nên vẫn dùng openRebookFromHistory.
function openEditFromHistory(idx) {
  const list = window._historyResults || _historyResults || _rawHistoryResults || [];
  const r = list[idx];
  if (!r) { showToast('Không tìm thấy dữ liệu vé để sửa', 'error'); return; }

  const switched = goToTripFromHistory(null, idx, false);
  if (!switched) return; // goToTripFromHistory đã tự báo toast lỗi (chuyến quá cũ/không còn phơi)

  const codes = (r.seat || '').split(',').map(s => s.trim()).filter(Boolean);
  const seats = codes.map(c => findSeat(c)).filter(Boolean);
  if (!seats.length) { showToast('Không tìm thấy ghế để sửa', 'error'); return; }
  openBookingPanel(seats, { mode: 'edit' });
}

// Nút "Đặt lại vé" trong bảng trang "Lịch sử hành khách" (renderPassengerHistoryRowHtml) gọi hàm này —
// trang đó gồm cả vé quá khứ đã kết thúc, không còn ghế sống để "sửa" nên tạo vé đặt lại mới thay vì mở
// panel sửa (khác với view "Tìm kiếm vé khách hàng", chỉ vé trong ngày, dùng openEditFromHistory).
function openRebookFromHistory(idx) {
  try {
    // idx là vị trí trong mảng kết quả lịch sử (window._historyResults) — mỗi thẻ lịch sử render trực
    // tiếp từ mảng này (renderHistoryCardHtml), nên idx của mỗi thẻ trùng đúng vị trí trong mảng.
    const list = window._historyResults || _historyResults || _rawHistoryResults || [];
    const r = list[idx];
    if (!r) { showToast('Không tìm thấy dữ liệu vé để đặt lại', 'error'); return; }

    const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
    setVal('rbName', r.name || '');
    setVal('rbPhone', r.phone || currentSearchPhone || '');

    const guestType = r.guestType || 'Khách trạm';
    setVal('rbGuestType', guestType);
    onRebookGuestTypeChange();

    setSelectOptionValue('rbFirstStop', r.firstStop || 'Trạm Kinh Dương Vương');
    // Cùng công thức fallback với getHistoryStopsDisplay() — giữ nhất quán giữa thông tin hiển thị ở
    // danh sách lịch sử và thông tin điền sẵn vào form đặt lại vé (trước đây thiếu transshipStation/
    // fromTransfer nên có trường hợp danh sách hiện thông tin nhưng form đặt lại vé lại trống).
    const pickupVal = r.transshipStation || r.transship || r.pickupAddress || r.fromTransfer || '';
    const transshipInput = document.getElementById('rbTransshipInput');
    const transshipSelect = document.getElementById('rbTransshipSelect');
    if (guestType === 'Rước đường' && transshipSelect) setSelectOptionValue('rbTransshipSelect', pickupVal);
    if (transshipInput) transshipInput.value = pickupVal;

    setSelectOptionValue('rbLastStop', r.lastStop || 'Trạm Châu Đốc');
    const arrTransEl = document.getElementById('rbArrivalTransfer');
    if (arrTransEl) arrTransEl.value = r.dropoffAddress || r.arrivalTransfer || (guestType === 'Trung chuyển' ? (r.transshipStation || r.transship || '') : '');

    setVal('rbNote', r.note || '');
    const luggageEl = document.getElementById('rbLuggage');
    if (luggageEl) luggageEl.checked = !!r.hasLuggage;

    const subEl = document.getElementById('rbSubtitle');
    if (subEl) subEl.textContent = `Đặt lại từ vé cũ: ${r.route} (${r.time}) — Ghế ${r.seat}`;

    rebookSelectedSeats = [];
    rebookSelectedTripId = null;
    rbSelectedDateStr = rbTodayStr();
    rbCalDate = new Date();
    rbUpdateCalTrigger();
    rbRenderCalendar();
    setVal('rbFilterTime', 'all');
    renderRebookTripList();

    const mapEl = document.getElementById('rbSeatMap');
    if (mapEl) mapEl.innerHTML = '<p class="ch-seat-placeholder">Vui lòng chọn phơi xe trước</p>';

    updateRebookBtn();

    const modal = document.getElementById('rebookModal');
    if (modal) {
      modal.classList.add('open');
      modal.style.display = 'flex';
      modal.style.setProperty('display', 'flex', 'important');
    } else {
      showToast('Không tìm thấy giao diện đặt lại vé (rebookModal)', 'error');
    }
  } catch (err) {
    console.error('Error opening rebook modal:', err);
    showToast('Lỗi mở khung đặt lại vé: ' + err.message, 'error');
  }
}

function openSeatMenu(ev, seat) {
  if (blockIfMultiSelectActive()) return;
  const menu = document.getElementById('seatMenu');
  menu.innerHTML = `
    <button data-action="closeSeatMenuAndStartTransfer" data-args='${JSON.stringify([seat.code])}'>Chuyển vé</button>
  `;
  const rect = ev.target.closest('.seat-card').getBoundingClientRect();
  menu.style.top = (window.scrollY + rect.bottom + 4) + 'px';
  menu.style.left = (window.scrollX + rect.left) + 'px';
  menu.classList.add('open');
  ev.stopPropagation();
}

function openSubSeatModal(code) {
  editingSubSeatCode = code || null;
  const titleEl = document.getElementById('subSeatModalTitle');
  const noteEl = document.getElementById('subSeatNote');
  const priceDisplayEl = document.getElementById('subSeatPriceDisplay');
  if (editingSubSeatCode) {
    const seat = subSeats.find(s => s.code === editingSubSeatCode);
    if (!seat) return;
    if (titleEl) titleEl.textContent = `Sửa ghế phụ ${seat.code}`;
    if (noteEl) noteEl.value = seat.note || '';
    if (priceDisplayEl) priceDisplayEl.textContent = (seat.price || DEFAULT_SUB_SEAT_PRICE).toLocaleString('vi-VN') + 'đ';
  } else {
    if (titleEl) titleEl.textContent = 'Thêm ghế phụ';
    if (noteEl) noteEl.value = '';
    if (priceDisplayEl) priceDisplayEl.textContent = DEFAULT_SUB_SEAT_PRICE.toLocaleString('vi-VN') + 'đ';
  }
  document.getElementById('subSeatModal').classList.add('open');
}

function renderCancelledSeats() {
  const section = document.getElementById('cancelledSeatsSection');
  const list = document.getElementById('cancelledSeatsList');
  if (!section || !list) return;

  // Danh sách rút gọn cuối Zone 3 chỉ hiện vé hủy CHƯA được chuyển ghế (còn cần xử lý) — vé đã chuyển
  // vẫn còn nguyên trong cancelledSeats và vẫn hiện đủ ở tab "Ghế hủy" (Zone 2) để lưu vết lịch sử.
  const activeCancelled = (cancelledSeats || []).filter(c => !c.restored);
  if (activeCancelled.length === 0) {
    section.style.display = 'none';
    list.innerHTML = '';
    return;
  }
  section.style.display = '';

  const totalSeats = [...seatPlanDown, ...seatPlanUp].filter(s => s.state !== 'hidden').length;
  const useThreeCols = totalSeats >= 34;
  list.classList.toggle('cols-3', useThreeCols);

  list.innerHTML = activeCancelled.map(cancelledSeatCard).join('');
}

/* ---- Chuyển ghế từ danh sách ghế hủy sang 1 ghế trống ở phơi bất kỳ — tái dùng nguyên cơ chế
   "chuyển ghế" sẵn có (multiSelectMode/selectionMode='transfer', thanh .sticky-actions, chọn phơi
   khác ở Zone 1 trong lúc chọn). Khác transfer thường ở chỗ nguồn là 1 bản ghi trong cancelledSeats
   (không phải ghế đang có khách) nên KHÔNG xoá/clear gì ở "nguồn" — chỉ áp dữ liệu vào ghế đích, giữ
   nguyên bản ghi trong cancelledSeats để lưu vết (không xoá). */
// Tra bản ghi vé hủy theo ĐÚNG phơi nguồn (transferSourceTripId), không dùng biến toàn cục
// cancelledSeats trực tiếp — biến đó phản ánh phơi ĐANG XEM, mà trong lúc chuyển ghế người dùng có
// thể đã bấm sang phơi khác ở Zone 1 (để chọn ghế đích) nên cancelledSeats lúc đó là của phơi đích.
function findCancelledRecordInTrip(tripId, cancelId) {
  const bank = tripSeatBank[tripId];
  const list = (bank && bank.cancelledSeats) || (tripId === currentTripId ? cancelledSeats : null) || [];
  return list.find(c => c.id === cancelId);
}

function startTransferFromCancelled(cancelId) {
  if (blockIfMultiSelectActive()) return;
  const record = (cancelledSeats || []).find(c => c.id === cancelId);
  if (!record) { showToast('Không tìm thấy vé đã hủy này'); return; }
  multiSelectMode = true;
  selectionMode = 'transfer';
  selectedSourceSeats = [];
  selectedTargetSeats = [];
  transferSourceCancelId = cancelId;
  transferSourceTripId = currentTripId;
  transferTargetTripId = currentTripId;
  document.querySelectorAll('.seat-card').forEach(c => { c.style.outline = 'none'; });
  updateTransferHint();
  showToast(`Đã chọn vé hủy của ${record.customerName || 'khách'}. Bấm ghế trống để chuyển sang (có thể chọn chuyến khác ở Zone 1).`);
}

function confirmRestoreFromCancelled() {
  const record = findCancelledRecordInTrip(transferSourceTripId, transferSourceCancelId);
  if (!record || selectedTargetSeats.length === 0) {
    showToast('Vui lòng chọn 1 ghế trống để chuyển vé hủy sang');
    return;
  }
  const targetTripId = transferTargetTripId || currentTripId;
  const targetCode = selectedTargetSeats[0];
  const targetSeat = findSeatInTrip(targetTripId, targetCode);
  if (!targetSeat || targetSeat.state !== 'empty') {
    showToast('Ghế đích không còn trống, vui lòng chọn ghế khác');
    return;
  }

  Object.assign(targetSeat, {
    state: 'hold',
    customerName: record.customerName,
    phone: record.phone,
    firstStop: record.firstStop,
    lastStop: record.lastStop,
    price: record.price,
    note: record.note,
    ticketNo: record.ticketNo,
    paid: false,
    count: 1
  });
  // Không xoá record khỏi cancelledSeats — giữ lại để lưu vết theo yêu cầu nghiệp vụ (tab "Ghế hủy"
  // vẫn hiện đủ mọi bản ghi). Chỉ đánh dấu "restored" để danh sách rút gọn cuối Zone 3 (nơi để bấm
  // chuyển ghế) ẩn bớt các vé đã xử lý xong, tránh chuyển nhầm lần 2 vào cùng 1 vé hủy.
  const trip = allTripsMeta.find(t => t.id === targetTripId);
  record.restored = true;
  record.restoredToSeat = targetCode;
  record.restoredToTripLabel = trip ? trip.time : '';
  record.restoredAt = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN');

  saveSeatBank();
  if (targetTripId === currentTripId) renderSeats();
  renderCancelledSeats();
  if (document.getElementById('zone3Passengers') && document.getElementById('zone3Passengers').style.display !== 'none' && typeof renderPassengerList === 'function') {
    renderPassengerList();
  }
  if (typeof renderCancelledListTable === 'function') renderCancelledListTable();

  const restoredName = record.customerName;
  exitMultiSelectMode();
  showToast(`Đã chuyển vé hủy của ${restoredName || 'khách'} sang ghế ${targetCode}${trip ? ' · phơi ' + trip.time : ''}`);
}

function renderLiveSearchResults(query) {
  const dropdown = document.getElementById('searchResults');
  if (!dropdown) return;
  if (!query || !query.trim().length) {
    dropdown.classList.remove('open');
    return;
  }

  const custMatches = searchCustomerByPhone(query);
  const customerMap = new Map();
  custMatches.forEach(m => {
    const key = `${m.phone || ''}_${m.name || ''}`;
    if (!customerMap.has(key)) customerMap.set(key, m);
  });
  const topCustMatches = Array.from(customerMap.values()).slice(0, 5);

  let html = '';
  if (topCustMatches.length) {
    html += topCustMatches.map(m => {
      const phoneDisp = m.phone ? ` (<span style="color:var(--red);font-weight:700;">${m.phone}</span>)` : '';
      return `
        <div class="search-result-row" data-action="searchResultRowClick" data-args='${JSON.stringify([m.phone || '', m.phone || m.name])}'>
          <div>
            <div class="src-name">${m.name || 'Khách hàng'}${phoneDisp}</div>
            <div class="src-meta">${m.route} • ${m.time} • Ghế ${m.seat}</div>
          </div>
        </div>`;
    }).join('');
  }
  if (!html) {
    html = '<div class="search-result-row" style="color:var(--text-sub);justify-content:center;padding:12px;">Không tìm thấy kết quả phù hợp</div>';
  }
  dropdown.innerHTML = html;
  dropdown.classList.add('open');
}

function renderMiniSeatMap(tripId) {
  const container = document.getElementById('rbSeatMap');
  if (!container) return;
  const bank = tripSeatBank?.[tripId];
  if (!bank) {
    container.innerHTML = '<p class="ch-seat-placeholder">Không có dữ liệu phơi xe</p>';
    return;
  }
  const downSeats = bank.down || [];
  const upSeats = bank.up || [];
  const validDown = downSeats.filter(s => s.state !== 'hidden');
  const validUp = upSeats.filter(s => s.state !== 'hidden');
  const colsClass = (validDown.length + validUp.length) >= 34 ? 'cols-3' : '';

  container.innerHTML = `
    <div class="ch-mini-floors">
      <div class="ch-mini-floor">
        <div class="ch-mini-floor-title">TẦNG DƯỚI</div>
        <div class="ch-mini-grid ${colsClass}">${downSeats.map(s => miniSeatHtml(s, tripId)).join('')}</div>
      </div>
      <div class="ch-mini-floor">
        <div class="ch-mini-floor-title">TẦNG TRÊN</div>
        <div class="ch-mini-grid ${colsClass}">${upSeats.map(s => miniSeatHtml(s, tripId)).join('')}</div>
      </div>
    </div>`;
}

// ===== Lịch chọn ngày cho bộ lọc "Chọn phơi xe" trong modal Đặt lại vé =====
// Đặt lại vé có thể chuyển khách sang MỘT NGÀY KHÁC (không chỉ trong các ngày đã có sẵn phơi), nên dùng
// lịch chọn-ngày-bất-kỳ (giống #calTrigger Zone 1 / #pkFilterDateBtn trang Rước liền) thay vì <select>
// chỉ liệt kê những ngày đã có dữ liệu. Đây là lịch RIÊNG (tiền tố "rb"), không dùng chung toggleCalendar()
// của js/shared/ui.js vì hàm đó gắn cứng vào #calendarPanel/#calTrigger của Zone 1.
const RB_MONTH_NAMES = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
function rbTodayStr() {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
}
let rbCalDate = new Date();
let rbSelectedDateStr = rbTodayStr(); // null = "Tất cả ngày"; mặc định = hôm nay, giống mọi lịch khác trong app
let rbCalendarOpen = false;

function rbRenderCalendar() {
  const calGrid = document.getElementById('rbCalGrid');
  const monthLabel = document.getElementById('rbCalMonthLabel');
  if (!calGrid || !monthLabel) return;
  const today = new Date();
  const y = rbCalDate.getFullYear(), m = rbCalDate.getMonth();
  monthLabel.textContent = `${RB_MONTH_NAMES[m]}, ${y}`;
  const first = new Date(y, m, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const daysInPrevMonth = new Date(y, m, 0).getDate();
  let html = '';
  ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].forEach(d => { html += `<div class="cal-dow">${d}</div>`; });
  for (let i = 0; i < startOffset; i++) {
    html += `<div class="cal-day muted">${daysInPrevMonth - startOffset + i + 1}</div>`;
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(y, m, d);
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = dateObj.toDateString() === today.toDateString();
    const isSelected = dateStr === rbSelectedDateStr;
    html += `<div class="cal-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" data-action="rbPickDate" data-args='[${y},${m},${d}]'>${d}</div>`;
  }
  const totalCells = startOffset + daysInMonth;
  const trailing = (7 - (totalCells % 7)) % 7;
  for (let i = 1; i <= trailing; i++) {
    html += `<div class="cal-day muted">${i}</div>`;
  }
  calGrid.innerHTML = html;
}

function rbShiftMonth(dir) {
  rbCalDate = new Date(rbCalDate.getFullYear(), rbCalDate.getMonth() + dir, 1);
  rbRenderCalendar();
}

function rbGoToday() {
  rbCalDate = new Date();
  rbSelectedDateStr = rbTodayStr();
  rbRenderCalendar();
  rbUpdateCalTrigger();
  rbToggleCalendar(false);
  renderRebookTripList();
}

function rbPickDate(y, m, d) {
  rbSelectedDateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  rbRenderCalendar();
  rbUpdateCalTrigger();
  rbToggleCalendar(false);
  renderRebookTripList();
}

function rbUpdateCalTrigger() {
  const label = document.getElementById('rbFilterDateLabel');
  if (!label) return;
  if (!rbSelectedDateStr) { label.textContent = 'Tất cả ngày'; return; }
  label.textContent = rbSelectedDateStr === rbTodayStr() ? `Hôm nay (${formatHistoryDate(rbSelectedDateStr)})` : formatHistoryDate(rbSelectedDateStr);
}

function rbToggleCalendar(force) {
  const panel = document.getElementById('rbCalendarPanel');
  const btn = document.getElementById('rbFilterDateBtn');
  if (!panel || !btn) return;
  rbCalendarOpen = typeof force === 'boolean' ? force : !rbCalendarOpen;
  panel.classList.toggle('open', rbCalendarOpen);
  btn.classList.toggle('open', rbCalendarOpen);
}

document.addEventListener('click', (e) => {
  if (rbCalendarOpen && !e.target.closest('#rbCalendarPanel') && !e.target.closest('#rbFilterDateBtn')) {
    rbToggleCalendar(false);
  }
});

function renderRebookTripList() {
  const container = document.getElementById('rbTripList');
  if (!container) return;
  const timeVal = document.getElementById('rbFilterTime')?.value || 'all';
  let html = '';
  (allTripsMeta || []).forEach(trip => {
    if (trip.status === 'Đã hủy') return;
    if (rbSelectedDateStr && trip.date !== rbSelectedDateStr) return;
    if (timeVal !== 'all') {
      const hh = parseInt((trip.time || '00:00').split(':')[0], 10);
      if (timeVal === 'morning' && (hh < 0 || hh >= 12)) return;
      if (timeVal === 'afternoon' && (hh < 12 || hh >= 18)) return;
      if (timeVal === 'evening' && (hh < 18 || hh > 24)) return;
    }
    const bank = tripSeatBank?.[trip.id];
    const totalSeats = bank ? bank.down.filter(s => s.state !== 'hidden').length + bank.up.filter(s => s.state !== 'hidden').length : 0;
    const bookedSeats = bank ? [...bank.down, ...bank.up].filter(s => ['sold', 'hold', 'free', 'cargo'].includes(s.state)).length : 0;
    const selected = trip.id === rebookSelectedTripId ? 'selected' : '';
    const plate = trip.plate || 'Chưa có';
    const vehicleType = trip.vehicleType || 'Chưa rõ';
    const isLimo = vehicleType.toLowerCase().includes('limousine') || vehicleType.toLowerCase().includes('limo');
    const seatTagClass = isLimo ? 'tag-limo' : 'tag-normal';
    const displayTripName = trip.name || `${trip.route} (${trip.time})`;

    // Dùng nguyên .trip-card/.trip-card-row1/.trip-card-row2/.trip-seat-tag của renderZone1TripList()
    // (js/callcenter.js, js/ticketstaff.js) để danh sách phơi trong modal "Đặt lại vé" giống y hệt danh
    // sách phơi Zone 1, không phải bản .ch-trip-card riêng nữa.
    html += `
      <div class="trip-card ${selected}" data-trip="${trip.id}" data-action="selectRebookTrip" data-args='${JSON.stringify([trip.id])}'>
        <div class="trip-card-row1">
          <div class="trip-info-left">
            <span class="trip-time">${trip.time}</span>
            <span class="trip-plate-inline">${plate}</span>
          </div>
          <div class="trip-seat-tag ${seatTagClass}">${bookedSeats}/${totalSeats}</div>
        </div>
        <div class="trip-card-row2">
          <span class="trip-name-text">${displayTripName}</span>
        </div>
      </div>`;
  });
  container.innerHTML = html || `<div class="ch-trip-empty">Không có phơi xe phù hợp với bộ lọc.</div>`;
}

function renderRouteOptions(filterText) {
  const container = document.getElementById('routeDropdown');
  if (!container) return;
  const kw = normalizeSearchText(filterText || '');
  const routes = routeOptions[selectedDirection].filter(route => !kw || normalizeSearchText(route.label).includes(kw));
  container.innerHTML = routes.length ? routes.map(route => `
    <div class="dropdown-item ${route.id === selectedRoute ? 'active' : ''}" data-route="${route.id}" data-action="selectRoute" data-args='${JSON.stringify([route.id])}'>
      <span>${route.label}</span>
      <span class="dropdown-item-check">✓</span>
    </div>
  `).join('') : `<div class="dropdown-empty">Không tìm thấy tuyến phù hợp</div>`;
}

function renderDirectionOptions(filterText) {
  const container = document.getElementById('directionDropdown');
  if (!container) return;
  const kw = normalizeSearchText(filterText || '');
  const dirs = Object.keys(directionLabels).filter(dir => !kw || normalizeSearchText(directionLabels[dir]).includes(kw));
  container.innerHTML = dirs.length ? dirs.map(dir => `
    <div class="dropdown-item ${dir === selectedDirection ? 'active' : ''}" data-dir="${dir}" data-action="toggleDirection" data-args='${JSON.stringify([dir])}'>
      <span>${directionLabels[dir]}</span>
      <span class="dropdown-item-check">✓</span>
    </div>
  `).join('') : `<div class="dropdown-empty">Không tìm thấy hướng phù hợp</div>`;
}

// Combobox tìm-để-chọn cho "Hướng đi"/"Tuyến" ở Zone 1 — gõ để lọc realtime trong danh sách lựa chọn
// (renderDirectionOptions/renderRouteOptions có sẵn, giữ nguyên), để trống ô thì hiện lại toàn bộ. Dùng
// addEventListener trực tiếp (không qua data-action) vì cần bắt focus/blur/keydown — dispatcher dùng
// chung chỉ hỗ trợ click/change/input/blur/submit qua data-*-action, còn ở đây phải tự quản lý theo từng
// ô nên gắn thẳng cho gọn, giống cách #searchInput đã làm.
//
// wireZone1Combobox() dùng chung cho cả 2 ô — cùng hành vi searchable combobox với #f_transship (bôi đen
// + mở toàn bộ danh sách khi click/focus, điều hướng bằng bàn phím, không mất lượt chọn do input blur
// trước khi click option kịp xử lý): trước đây đóng dropdown bằng setTimeout 150ms sau blur — 1 hack dựa
// vào thời gian, có thể trật nếu máy chậm/DOM nặng. Đổi hẳn sang mousedown+preventDefault() trên item để
// input KHÔNG BAO GIỜ blur khi bấm chọn (loại bỏ hẳn race condition thay vì chỉ né bằng độ trễ).
function wireZone1Combobox(inputId, panelId, renderFn, getCanonicalValueFn) {
  const input = document.getElementById(inputId);
  const panel = document.getElementById(panelId);
  if (!input || !panel) return;
  let highlightedIndex = -1;

  function items() {
    return Array.from(panel.querySelectorAll('.dropdown-item'));
  }

  function updateHighlight() {
    items().forEach((el, i) => {
      const active = i === highlightedIndex;
      el.classList.toggle('kbd-highlight', active);
      if (active) el.scrollIntoView({ block: 'nearest' });
    });
  }

  function open(filterText) {
    renderFn(filterText || '');
    highlightedIndex = -1;
    panel.classList.add('open');
  }

  function close() {
    panel.classList.remove('open');
    highlightedIndex = -1;
    input.value = getCanonicalValueFn();
  }

  input.addEventListener('focus', () => {
    input.select();
    open('');
  });
  // Input đã đang focus sẵn thì 'focus' không bắn lại — vẫn cần 'click' để bấm lại lần nữa sau khi đã
  // chọn 1 giá trị (bôi đen + mở lại toàn bộ danh sách từ đầu) hoạt động đúng.
  input.addEventListener('click', () => {
    input.select();
    open('');
  });
  input.addEventListener('input', () => {
    open(input.value);
  });
  input.addEventListener('blur', close);

  input.addEventListener('keydown', (e) => {
    const list = items();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!panel.classList.contains('open')) { open(input.value); return; }
      if (list.length) { highlightedIndex = (highlightedIndex + 1) % list.length; updateHighlight(); }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!panel.classList.contains('open')) { open(input.value); return; }
      if (list.length) { highlightedIndex = (highlightedIndex - 1 + list.length) % list.length; updateHighlight(); }
    } else if (e.key === 'Enter') {
      if (panel.classList.contains('open') && highlightedIndex >= 0 && list[highlightedIndex]) {
        e.preventDefault();
        list[highlightedIndex].click(); // đi qua đúng data-action="toggleDirection"/"selectRoute" có sẵn
      }
    } else if (e.key === 'Escape') {
      if (panel.classList.contains('open')) {
        e.preventDefault();
        close();
      }
    }
    // Backspace/Delete/Tab: không can thiệp, giữ nguyên hành vi mặc định của trình duyệt.
  });

  // preventDefault() ở mousedown (không phải click) trên item — chặn input mất focus TRƯỚC khi
  // toggleDirection()/selectRoute() (gọi qua data-action lúc 'click' bắn sau đó) kịp chạy, nên không còn
  // phải né bằng setTimeout nữa.
  panel.addEventListener('mousedown', (e) => {
    if (e.target.closest('.dropdown-item')) e.preventDefault();
  });
}

(function initZone1ComboBoxes() {
  wireZone1Combobox('directionTrigger', 'directionDropdown', renderDirectionOptions,
    () => directionLabels[selectedDirection] || '');
  wireZone1Combobox('routeTrigger', 'routeDropdown', renderRouteOptions, () => {
    const item = routeOptions[selectedDirection].find(r => r.id === selectedRoute);
    return item ? item.label : '';
  });
})();

function renderSubSeats() {
  const section = document.getElementById('subSeatsSection');
  const list = document.getElementById('subSeatsList');
  if (!section || !list) return;

  const totalSeats = [...seatPlanDown, ...seatPlanUp].filter(s => s.state !== 'hidden').length;
  const useThreeCols = totalSeats >= 34;
  list.classList.toggle('cols-3', useThreeCols);

  list.innerHTML = subSeats.map(subSeatCard).join('') + subSeatAddTile();
}

// Quét tripSeatBank (phơi đang có trong ngày), trả về danh sách vé đã đặt/bán/rước dạng phẳng (chưa gom
// nhóm) — dùng chung cho tìm kiếm theo SĐT/tên (searchCustomerByPhone, chỉ lấy khớp matchSeatFn) và trang
// "Lịch sử hành khách" (loadAllPassengerHistory, lấy hết không lọc).
function scanTripSeatBankHistory(matchSeatFn) {
  const rawResults = [];
  Object.keys(tripSeatBank).forEach(tripId => {
    const bank = tripSeatBank[tripId];
    const tripMeta = allTripsMeta.find(t => t.id === tripId);
    if (!bank || !tripMeta) return;

    [...(bank.down || []), ...(bank.up || []), ...(bank.subSeats || [])].forEach(seat => {
      if (['sold', 'hold', 'free', 'cargo'].includes(seat.state) && matchSeatFn(seat)) {
        rawResults.push({
          date: tripMeta.date || todayStr,
          phone: seat.phone,
          name: seat.customerName,
          guestType: seat.guestType || 'Khách trạm',
          transship: seat.transshipStation || seat.transship || '',
          pickupAddress: seat.pickupAddress || '',
          dropoffAddress: seat.dropoffAddress || '',
          note: seatNoteWithReason(seat),
          ticketNo: seat.ticketNo,
          route: tripMeta.route,
          time: tripMeta.time,
          seat: seat.code,
          firstStop: seat.firstStop,
          lastStop: seat.lastStop,
          state: seat.state,
          paid: seat.paid,
          price: seat.price,
          plate: bank.plate || tripMeta.plate,
          vehicleType: bank.vehicleType || tripMeta.vehicleType,
          driver: bank.driver || '',
          helper: bank.helper || '',
          bookStaff: getStaffCode(seat.staff) || 'NV01',
          sellStaff: seat.paid ? (getStaffCode(seat.staff) || 'NV05') : '—',
          actionTime: seat.actionTime || '',
          isToday: true,
          tripId
        });
      }
    });
  });
  return rawResults;
}

function searchCustomerByPhone(query) {
  const raw = (query || '').toString().trim();
  if (!raw) return [];

  const rawNoSpace = raw.replace(/[\s.\-]/g, '');
  const isPhone = /^\+?[0-9]+$/.test(rawNoSpace);
  const normPhone = rawNoSpace.replace(/^\+84/, '0');
  const normText = normalizeSearchText(raw);

  const isMatch = (p, n, t) => isPhone
    ? (p || '').replace(/[\s.\-]/g, '').replace(/^\+84/, '0').includes(normPhone)
    : (n && normalizeSearchText(n).includes(normText)) || (t && t.toLowerCase().includes(normText));

  // Tìm kiếm lịch sử từ thanh tìm kiếm header chỉ lấy phơi đang có trong ngày (tripSeatBank), không lấy
  // dữ liệu lịch sử quá khứ (CUSTOMER_HISTORY_DATA) theo yêu cầu — trước đây có gộp cả 2 nguồn. Muốn xem
  // cả lịch sử quá khứ của TẤT CẢ khách thì dùng trang "Lịch sử hành khách" (loadAllPassengerHistory).
  const rawResults = scanTripSeatBankHistory(seat => isMatch(seat.phone, seat.customerName, seat.ticketNo));
  return groupHistoryResults(rawResults).sort((a, b) => b.date.localeCompare(a.date));
}

// Toàn bộ lịch sử vé của TẤT CẢ khách (không lọc theo SĐT/tên) cho trang "Lịch sử hành khách" — gồm cả
// phơi đang có trong ngày (tripSeatBank) lẫn dữ liệu quá khứ (CUSTOMER_HISTORY_DATA).
function loadAllPassengerHistory() {
  const rawResults = scanTripSeatBankHistory(() => true);
  CUSTOMER_HISTORY_DATA.forEach(h => rawResults.push({ ...h, isToday: false }));
  return groupHistoryResults(rawResults).sort((a, b) => b.date.localeCompare(a.date));
}

function selectRebookTrip(tripId) {
  rebookSelectedTripId = tripId;
  rebookSelectedSeats = [];
  document.querySelectorAll('#rbTripList .trip-card').forEach(c => c.classList.remove('selected'));
  const card = document.querySelector(`#rbTripList .trip-card[data-trip="${tripId}"]`);
  if (card) card.classList.add('selected');
  renderMiniSeatMap(tripId);
  updateRebookBtn();
}

function selectRoute(route) {
  const routeItem = routeOptions[selectedDirection].find(item => item.id === route);
  if (!routeItem) return;
  selectedRoute = route;
  const routeInput = document.getElementById('routeTrigger');
  if (routeInput) routeInput.value = routeItem.label;
  document.querySelectorAll('#routeDropdown .dropdown-item').forEach(item => {
    item.classList.toggle('active', item.dataset.route === route);
  });
  document.getElementById('routeDropdown').classList.remove('open');
  showToast('Chọn tuyến: ' + routeItem.label);
}

function subSeatAddTile() {
  return `
  <div class="seat-card sub-add" data-action="openSubSeatModal">
    <span class="sub-add-plus">+</span>
  </div>`;
}

function subSeatCard(seat) {
  return `
  <div class="seat-card sub" data-code="${seat.code}" data-action="openSubSeatModal" data-args='${JSON.stringify([seat.code])}'>
    <div class="seat-top">
      <div><div class="seat-code">${seat.code}</div></div>
      <div class="seat-top-right">
        <div class="seat-price-tag">${(seat.price || 0).toLocaleString('vi-VN')}đ</div>
        <button type="button" class="seat-cancel-tag" data-action="deleteSubSeat" data-stop-propagation="1" data-args='${JSON.stringify([seat.code])}'>Xóa</button>
      </div>
    </div>
    <div class="seat-note" title="${seat.note || ''}">${seat.note || '—'}</div>
  </div>`;
}

function syncRuocLienToPickupList(seats) {
  let paxList = [];
  try {
    const saved = localStorage.getItem(HN_PICKUP_PAX_KEY);
    if (saved) paxList = JSON.parse(saved);
  } catch (e) { }

  if (!Array.isArray(paxList)) paxList = [];

  const seatsArray = Array.isArray(seats) ? seats : [seats];
  const targetSeat = seatsArray[0];
  if (!targetSeat || targetSeat.guestType !== 'Rước liền') return;

  const name = targetSeat.customerName || 'Khách rước';
  const phone = targetSeat.phone || '';
  const count = seatsArray.length;
  const address = targetSeat.transshipStation || targetSeat.transship || targetSeat.pickupAddress || '';
  const station = targetSeat.firstStop || DEFAULT_STAFF_STATION;
  const destination = targetSeat.lastStop || 'Bến xe Châu Đốc';
  const destinationTransfer = targetSeat.arrivalTransfer || targetSeat.dropoffAddress || '';
  const tripNote = targetSeat.note || '';
  const luggage = !!targetSeat.hasLuggage;

  const existingIdx = paxList.findIndex(p => p.phone === phone && p.name === name);
  const existingPax = existingIdx > -1 ? paxList[existingIdx] : null;
  const paxObj = {
    id: existingPax ? existingPax.id : Date.now(),
    name,
    phone,
    ticketCount: count,
    fromStation: station,
    fromTransfer: address,
    toStation: destination,
    toTransfer: destinationTransfer,
    note: tripNote,
    luggage: luggage,
    assigned: { tripId: currentTripId, seat: seatsArray.map(s => s.code).join(', ') },
    guestType: 'Rước liền',
    isRuocLien: true,
    // "Thời gian" (trang Rước liền) — mốc lần đầu nhập thông tin, giữ nguyên qua các lần sửa vé sau đó
    // thay vì cập nhật lại mỗi lần lưu form. statusNote/printedAt (cột "Trạng thái"/"In lúc") cũng phải
    // giữ nguyên tương tự — nếu không, sửa vé "Rước liền" (VD đổi ghi chú, đổi ghế) sẽ vô tình xoá mất
    // ghi chú trạng thái đón khách đã nhập trước đó ở trang Rước liền vì paxObj này ghi đè toàn bộ record cũ.
    createdAt: (existingPax && existingPax.createdAt) || new Date().toISOString(),
    statusNote: existingPax ? existingPax.statusNote : undefined,
    printedAt: existingPax ? existingPax.printedAt : undefined
  };

  if (existingIdx > -1) {
    paxList[existingIdx] = paxObj;
  } else {
    paxList.unshift(paxObj);
  }

  const jsonStr = JSON.stringify(paxList);
  localStorage.setItem(HN_PICKUP_PAX_KEY, jsonStr);
  try {
    window.dispatchEvent(new StorageEvent('storage', {
      key: HN_PICKUP_PAX_KEY,
      newValue: jsonStr,
      storageArea: localStorage
    }));
  } catch (e) { }
}

function toggleDirection(dir) {
  if (!directionLabels[dir]) return;
  selectedDirection = dir;
  selectedRoute = 'all';
  const directionInput = document.getElementById('directionTrigger');
  if (directionInput) directionInput.value = directionLabels[dir];
  const routeInput = document.getElementById('routeTrigger');
  if (routeInput) routeInput.value = 'Tất cả tuyến';
  document.querySelectorAll('#directionDropdown .dropdown-item').forEach(item => {
    item.classList.toggle('active', item.dataset.dir === dir);
  });
  renderRouteOptions();
  updateTripListForDirection(dir);
  document.getElementById('directionDropdown').classList.remove('open');
  showToast('Chọn hướng: ' + directionLabels[dir]);
}

function togglePaxFilter() {
  document.getElementById('paxFilterDropdown').classList.toggle('open');
}

function toggleRebookSeat(code, tripId) {
  if (tripId !== rebookSelectedTripId) return;
  const idx = rebookSelectedSeats.indexOf(code);
  if (idx >= 0) rebookSelectedSeats.splice(idx, 1);
  else rebookSelectedSeats.push(code);
  renderMiniSeatMap(tripId);
  updateRebookBtn();
}

function toggleZone1() {
  setZone1Collapsed(!document.body.classList.contains('zone1-collapsed'));
}

function updateCancelledTabCount() {
  const cntEl = document.getElementById('cancelledTabCnt');
  if (cntEl) {
    cntEl.textContent = `(${cancelledSeats ? cancelledSeats.length : 0})`;
  }
}

function updatePassengerTabCount() {
  const allBooked = getAllBookedSeats();
  const grouped = groupSeatsByTicket(allBooked);

  const cntEl = document.getElementById('passengerTabCnt');
  if (cntEl) cntEl.textContent = `(${allBooked.length})`;

  const pickupCount = grouped.filter(g => {
    const s = g.main;
    return s.guestType === 'Trung chuyển' || s.guestType === 'Rước liền' || s.guestType === 'Rước đường' || !!s.pickupAddress || !!s.transship;
  }).length;

  const dropoffCount = grouped.filter(g => {
    const s = g.main;
    return s.guestType === 'Trung chuyển' || !!s.dropoffAddress || !!s.arrivalTransfer;
  }).length;

  const transTabCntEl = document.getElementById('transshipTabCnt');
  if (transTabCntEl) transTabCntEl.textContent = `(${pickupCount} | ${dropoffCount})`;

  const transSection = document.getElementById('zone3Transship');
  if (transSection && transSection.style.display !== 'none') {
    renderTransshipTables();
  }
}

function updateRebookBtn() {
  const btn = document.getElementById('rbConfirmBtn');
  const sellBtn = document.getElementById('rbSellBtn');
  const countEl = document.getElementById('rbSelectedCount');
  if (countEl) countEl.textContent = `(${rebookSelectedSeats.length} ghế)`;
  const isDisabled = !rebookSelectedTripId || !rebookSelectedSeats.length;
  if (btn) btn.disabled = isDisabled;
  if (sellBtn) sellBtn.disabled = isDisabled;
}

function updateTransferBarVisibility() {
  // Thanh chọn ghế (Chuyển ghế / Đặt vé nhóm) — lấy theo id, KHÔNG querySelector('.sticky-actions')
  // vì #tsPrintActionBar (thanh "In vé trung chuyển") dùng cùng class và đứng trước trong DOM.
  const sticky = document.getElementById('seatTransferBar');
  if (!sticky) return;
  const paxSection = document.getElementById('zone3Passengers');
  const isSeatMapVisible = !paxSection || paxSection.style.display === 'none';
  const shouldShow = multiSelectMode && isSeatMapVisible;
  sticky.style.display = shouldShow ? 'flex' : 'none';
  const seatSection = document.querySelector('.zone3:not(.passenger-view)');
  if (seatSection) seatSection.classList.toggle('has-sticky-actions', shouldShow);
}

function updateTransferHint() {
  let bookedText = '';
  if (transferSourceCancelId) {
    const record = findCancelledRecordInTrip(transferSourceTripId, transferSourceCancelId);
    bookedText = record ? `Đã chọn vé hủy: ${record.customerName || 'Khách'} (${record.phone || '—'})` : '';
  } else if (selectedSourceSeats.length) {
    bookedText = `Đã chọn ghế đã đặt: ${selectedSourceSeats.join(', ')}`;
  }
  const emptyText = selectedTargetSeats.length ? ` | Ghế trống: ${selectedTargetSeats.join(', ')}` : '';
  document.getElementById('stickyHint').textContent = bookedText + emptyText;
  const actionBtn = document.getElementById('stickyActionBtn');
  if (actionBtn) {
    if (selectionMode === 'transfer') {
      actionBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3v18"/><path d="m21 7-4-4-4 4"/><path d="M7 21V3"/><path d="m3 17 4 4 4-4"/></svg>Chuyển ghế';
    } else {
      actionBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"/><path d="M5 12h14"/></svg>Đặt vé nhóm';
    }
  }
  // Nút "Bán vé" trên thanh chuyển ghế (chỉ có ở ticketstaff, callcenter không có #stickySellBtn) —
  // chỉ hiện khi đang chọn nguồn là ghế thật (không phải vé hủy) thuộc ĐÚNG chuyến đang xem (tránh
  // in nhầm tuyến/giờ của chuyến khác nếu người dùng đã bấm sang Zone 1 chọn ghế đích ở chuyến khác)
  // và TẤT CẢ ghế nguồn đang chọn đều chưa bán (state khác 'sold').
  const sellBtn = document.getElementById('stickySellBtn');
  const reprintBtn = document.getElementById('stickyReprintBtn');
  if (sellBtn || reprintBtn) {
    const sourceSeats = (!transferSourceCancelId && selectedSourceSeats.length && transferSourceTripId === currentTripId)
      ? selectedSourceSeats.map(code => findSeatInTrip(transferSourceTripId, code)).filter(Boolean)
      : [];
    if (sellBtn) {
      const canSell = sourceSeats.length > 0 && sourceSeats.every(s => s.state !== 'sold');
      sellBtn.style.display = canSell ? '' : 'none';
    }
    // Nút "In lại vé" trên thanh chuyển ghế — chỉ hiện khi TẤT CẢ ghế nguồn đang chọn đều ĐÃ bán,
    // để nhân viên in lại vé ngay khi vừa chọn ghế mà không cần mở panel riêng.
    if (reprintBtn) {
      const canReprint = sourceSeats.length > 0 && sourceSeats.every(s => s.state === 'sold');
      reprintBtn.style.display = canReprint ? '' : 'none';
    }
  }
  updateTransferBarVisibility();
}

