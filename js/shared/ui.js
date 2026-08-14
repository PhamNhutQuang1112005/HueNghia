// shared/ui.js — Toast, modal/panel đóng chung, dropdown tìm kiếm, helper <select>. Dùng chung callcenter/ticketstaff.
// Nạp bằng <script> thường TRƯỚC script chính của trang — không dùng export/import.

function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toastText').textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

function closeModal(id) { document.getElementById(id).classList.remove('open'); }

/* ---- Zone 4: Panel đặt vé ---- */
function openBookingPanel(seats, options = {}) {
  const mode = options.mode || 'booking';
  currentPanelMode = mode;
  currentPanelSeats = seats.slice();
  currentPanelSeat = seats[0];
  currentEditSeatCode = mode === 'edit' ? seats[0].code : null;
  const seat = seats[0];
  // Vé đã bán (state 'sold') chỉ xem thông tin, không cho lưu/bán lại — ẩn nút "Lưu thay đổi" (cả 2
  // trang) và "Bán vé" (riêng ticketstaff) thay vì chặn không cho mở panel như trước.
  const isReadOnly = mode === 'edit' && seat && seat.state === 'sold';
  const saveBtn = document.getElementById('savePanelBtn');
  const sellBtn = document.getElementById('sellPanelBtn');
  if (saveBtn) saveBtn.style.display = isReadOnly ? 'none' : '';
  if (sellBtn) sellBtn.style.display = isReadOnly ? 'none' : '';
  document.getElementById('panelSeatCode').textContent = seats.map(s => s.code).join(', ');
  document.getElementById('panelTitleMode').textContent = isReadOnly ? 'Thông tin ghế' : (mode === 'edit' ? 'Sửa thông tin ghế' : 'Đặt vé');
  document.getElementById('t_seat').textContent = seat.code;
  document.getElementById('t_price').textContent = seat.price.toLocaleString('vi-VN') + 'đ';
  // Lý do giá 0đ lưu riêng ở seat.zeroPriceReason (không gộp vào seat.note) — mở sửa lại thì trả đúng
  // về ô "Lý do giá 0đ", ô "Ghi chú" chỉ chứa đúng phần ghi chú người dùng gõ.
  const zeroReasonInput = document.getElementById('f_zero_price_reason');
  if (zeroReasonInput) zeroReasonInput.value = (mode === 'edit' && seat.zeroPriceReason) ? seat.zeroPriceReason : '';
  updateZeroPriceReasonVisibility();

  // Cọc tiền lưu riêng ở seat.depositAmount/seat.depositMethod (không gộp vào seat.note/giá vé) —
  // mở sửa lại thì trả đúng về ô "Đặt cọc", giống cách "Lý do giá 0đ" đã làm ở trên.
  const depositEnabledInput = document.getElementById('f_deposit_enabled');
  const depositAmountInput = document.getElementById('f_deposit_amount');
  const depositMethodInputs = document.querySelectorAll('input[name="f_deposit_method"]');
  const hasDeposit = mode === 'edit' && !!seat.depositAmount;
  if (depositEnabledInput) depositEnabledInput.checked = hasDeposit;
  if (depositAmountInput) depositAmountInput.value = hasDeposit ? seat.depositAmount : '';
  depositMethodInputs.forEach(r => { r.checked = r.value === (hasDeposit ? seat.depositMethod : 'Tiền mặt'); });

  // Vé mẫu trước đây luôn hiện cứng "07:00 - Sài Gòn - Châu Đốc • 08/07/2026" bất kể đang mở phơi
  // nào — lấy đúng giờ/tuyến/ngày của phơi đang xem (currentTripId) để hiển thị đúng.
  const tripMeta = (typeof allTripsMeta !== 'undefined' && allTripsMeta) ? allTripsMeta.find(t => t.id === currentTripId) : null;
  const tripRoute = tripMeta ? (tripMeta.route || '') : '';
  const tripTime = tripMeta ? (tripMeta.time || '') : '';
  const tripDateText = tripMeta && tripMeta.date ? formatHistoryDate(tripMeta.date) : '';
  const tripLine = [tripTime, tripDateText].filter(Boolean).join(' • ');
  const panelHeadSub = document.getElementById('panelHeadSub');
  if (panelHeadSub) panelHeadSub.textContent = [tripTime && tripRoute ? `${tripTime} - ${tripRoute}` : (tripRoute || tripTime), tripDateText].filter(Boolean).join(' • ');
  const tRouteEl = document.getElementById('t_route');
  if (tRouteEl) tRouteEl.textContent = tripRoute || '—';
  const tDatetimeEl = document.getElementById('t_datetime');
  if (tDatetimeEl) tDatetimeEl.textContent = tripLine || '—';
  const batchWrap = document.getElementById('batchChipRow');
  if (seats.length > 1) {
    batchWrap.style.display = 'flex';
    batchWrap.innerHTML = seats.map(s => `<span class="seat-chip">${s.code}</span>`).join('');
  } else {
    batchWrap.style.display = 'none';
  }
  const phoneEl = document.getElementById('f_phone');
  const nameEl = document.getElementById('f_name');
  const noteEl = document.getElementById('f_note');
  const typeEl = document.getElementById('f_type');
  const transshipEl = document.getElementById('f_transship');
  const transshipSelectEl = document.getElementById('f_transship_select');
  const destinationEl = document.getElementById('f_destination');
  const arrivalTransferEl = document.getElementById('f_arrival_transfer');
  const luggageEl = document.getElementById('f_luggage');
  if (mode === 'edit' && seat) {
    const phones = (seat.phone || '').split(',').map(p => p.trim()).filter(Boolean);
    phoneEl.value = phones[0] || '';
    renderExtraPhoneFields('f_phone_extra', phones.slice(1), 'refreshTicket');
    nameEl.value = seat.customerName || '';
    noteEl.value = seat.note || '';
    typeEl.value = seat.guestType || 'Khách trạm';
    destinationEl.value = seat.lastStop || '';
    if (transshipEl) transshipEl.value = (seat.guestType === 'Trung chuyển' || seat.guestType === 'Rước liền') ? seat.transshipStation || '' : '';
    // Dùng setSelectOptionValue() thay vì gán thẳng .value: địa chỉ trong seat.transshipStation có thể
    // không khớp đúng 1 trong các <option> cố định của dropdown (dữ liệu mẫu sinh địa chỉ tự do) — gán
    // thẳng sẽ bị bỏ chọn âm thầm, khiến "Lưu"/"Bán vé" luôn báo thiếu "địa điểm rước" dù đã có dữ liệu.
    if (transshipSelectEl) {
      if (seat.guestType === 'Rước đường' && seat.transshipStation) {
        setSelectOptionValue('f_transship_select', seat.transshipStation);
      } else {
        transshipSelectEl.value = '';
      }
    }
    if (arrivalTransferEl) arrivalTransferEl.value = seat.arrivalTransfer || '';
    if (luggageEl) luggageEl.checked = !!seat.hasLuggage;
    onGuestTypeChange();
    setStationValue(seat.firstStop || DEFAULT_STAFF_STATION);
  } else {
    phoneEl.value = '';
    renderExtraPhoneFields('f_phone_extra', [], 'refreshTicket');
    nameEl.value = '';
    noteEl.value = '';
    typeEl.value = 'Khách trạm';
    destinationEl.value = '';
    if (transshipEl) transshipEl.value = '';
    if (transshipSelectEl) transshipSelectEl.value = '';
    if (arrivalTransferEl) arrivalTransferEl.value = '';
    if (luggageEl) luggageEl.checked = false;
    onGuestTypeChange();
  }
  refreshTicket();
  document.getElementById('bookingOverlay').classList.add('open');
  document.getElementById('savePanelBtnText').textContent = mode === 'edit' ? 'Lưu thay đổi' : 'Đặt vé';
}

function closePanel() {
  currentPanelMode = 'booking';
  currentEditSeatCode = null;
  document.getElementById('bookingOverlay').classList.remove('open');
}

// Giá vé 0đ bắt buộc phải nhập lý do (ô riêng, lưu vào seat.zeroPriceReason — không dùng chung ô
// "Ghi chú"/seat.note) — hiện/ẩn ô này theo giá đang hiển thị trên vé mẫu. Gọi lại mỗi khi giá thay
// đổi (mở panel, sửa giá). Ô này luôn được openBookingPanel() điền sẵn từ seat.zeroPriceReason khi
// sửa 1 ghế đã có giá 0đ từ trước nên không cần bắt gõ lại mỗi lần lưu.
function updateZeroPriceReasonVisibility() {
  const priceEl = document.getElementById('t_price');
  const wrap = document.getElementById('zeroPriceReasonWrap');
  if (!priceEl || !wrap) return;
  const price = parseInt((priceEl.textContent || '').replace(/[^0-9]/g, '')) || 0;
  wrap.style.display = price === 0 ? 'flex' : 'none';
}

/* ---- Nhiều số điện thoại ở ô "Số điện thoại" — dùng chung cho panel đặt vé (wrapId "f_phone_extra")
   và modal "Thông tin khách rước" (wrapId "pickup_phone_extra"). refreshAction là tên hàm global cần
   gọi lại sau khi thêm/xoá 1 ô (vd "refreshTicket", "refreshPickupPreview") để cập nhật phần xem trước. ---- */
function phoneExtraRowHtml(value, refreshAction) {
  return `<div class="phone-extra-row"><input type="tel" class="phone-extra-input" value="${value}" placeholder="09xxxxxxxx" data-input-action="${refreshAction}"><button type="button" class="phone-remove-btn" data-action="removeExtraPhoneField" data-args='["__this__","${refreshAction}"]' title="Bỏ số này">×</button></div>`;
}

function renderExtraPhoneFields(wrapId, phones, refreshAction) {
  const wrap = document.getElementById(wrapId);
  if (!wrap) return;
  wrap.innerHTML = phones.map(p => phoneExtraRowHtml(p, refreshAction)).join('');
}

function addExtraPhoneField(wrapId, refreshAction) {
  const wrap = document.getElementById(wrapId);
  if (!wrap) return;
  wrap.insertAdjacentHTML('beforeend', phoneExtraRowHtml('', refreshAction));
}

function removeExtraPhoneField(btnEl, refreshAction) {
  const row = btnEl.closest('.phone-extra-row');
  if (row) row.remove();
  if (refreshAction && typeof window[refreshAction] === 'function') window[refreshAction]();
}

// Gộp số điện thoại chính + các số thêm vào 1 chuỗi, cách nhau bởi ", " — giữ phone vẫn là 1 chuỗi
// như trước (mọi chỗ tìm kiếm/hiển thị SĐT khác đều đọc chuỗi này, tìm theo kiểu "chứa" nên vẫn tìm
// đúng dù có nhiều số).
function collectPhoneValues(mainFieldId, wrapId) {
  const main = (document.getElementById(mainFieldId)?.value || '').trim();
  const wrap = document.getElementById(wrapId);
  const extras = wrap ? Array.from(wrap.querySelectorAll('.phone-extra-input')).map(el => el.value.trim()) : [];
  return [main, ...extras].filter(Boolean).join(', ');
}

function pickSearchResult() {
  document.getElementById('searchResults').classList.remove('open');
  showToast('Đã điều hướng đến đúng phơi xe và ghế của khách');
}

function toggleSearchResults(force) {
  const el = document.getElementById('searchResults');
  if (force === true) { el.classList.add('open'); return; }
  el.classList.toggle('open');
}

function toggleCalendar(force) {
  calendarOpen = typeof force === 'boolean' ? force : !calendarOpen;
  document.getElementById('calendarPanel').classList.toggle('open', calendarOpen);
  document.getElementById('calTrigger').classList.toggle('open', calendarOpen);
}

function getStationValue() {
  return document.getElementById('f_station_select').value;
}

function setStationValue(val) {
  const selectEl = document.getElementById('f_station_select');
  const hasOption = Array.from(selectEl.options).some(o => o.value === val);
  if (hasOption) selectEl.value = val;
}

function setSelectOptionValue(selectId, val) {
  const sel = document.getElementById(selectId);
  if (!sel || !val) return;
  const exists = Array.from(sel.options).some(opt => opt.value === val || opt.text === val);
  if (!exists) {
    const opt = document.createElement('option');
    opt.value = val;
    opt.text = val;
    sel.add(opt);
  }
  sel.value = val;
}
