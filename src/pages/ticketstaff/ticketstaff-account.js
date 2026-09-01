/* ===================== TÀI KHOẢN / ĐĂNG XUẤT ===================== */
(function initUserMenu() {
  const menu = document.getElementById('userMenu');
  const chipBtn = document.getElementById('userChipBtn');
  const dropdown = document.getElementById('userDropdown');
  const logoutBtn = document.getElementById('logoutBtn');
  if (!menu || !chipBtn || !dropdown || !logoutBtn) return;

  // Hiển thị thông tin người dùng từ phiên đăng nhập (nếu có)
  const user = Session.get();
  if (user) {
    const nameEl = document.getElementById('userName');
    const avatarEl = document.getElementById('userAvatar');
    const roleEl = document.getElementById('userRoleLabel');
    const userEl = document.getElementById('userUsername');
    const display = user.username || 'Nhân viên';
    if (nameEl) nameEl.textContent = display;
    if (avatarEl) avatarEl.textContent = display.charAt(0).toUpperCase();
    if (roleEl) roleEl.textContent = user.roleLabel || 'Nhân viên tổng đài';
    if (userEl) userEl.textContent = user.username || '';
  }

  function closeMenu() {
    menu.classList.remove('open');
    chipBtn.setAttribute('aria-expanded', 'false');
    dropdown.hidden = true;
  }
  function openMenu() {
    menu.classList.add('open');
    chipBtn.setAttribute('aria-expanded', 'true');
    dropdown.hidden = false;
  }

  chipBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (menu.classList.contains('open')) closeMenu();
    else openMenu();
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target)) closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  logoutBtn.addEventListener('click', () => {
    Session.clear();
    window.location.href = 'index.html';
  });
})();

/* ===================== CUSTOMER HISTORY SEARCH ===================== */

let customerHistoryActive = false;
let currentSearchPhone = '';
let rebookSelectedSeats = [];
let rebookSelectedTripId = null;
let _historyResults = [];
let _rawHistoryResults = [];
let historyColumnFilters = {};
let activePopoverColKey = null;

window.addEventListener('popstate', function (e) {
  const s = e.state;
  if (s?.view === 'customerHistory' && s.phone) {
    openCustomerHistory(s.phone, false);
  } else if (s?.view === 'trip' && s.tripId) {
    if (customerHistoryActive) closeCustomerHistory();
    const card = document.querySelector(`.trip-card[data-trip="${s.tripId}"]`);
    if (card) {
      const tripMeta = allTripsMeta?.find(t => t.id === s.tripId);
      selectTrip(card, tripMeta?.time, tripMeta?.route);
    }
  } else if (customerHistoryActive) {
    closeCustomerHistory();
  }
});

function confirmRebook() {
  const getVal = id => document.getElementById(id)?.value?.trim() || '';
  const name = getVal('rbName');
  const phone = getVal('rbPhone');
  const guestType = document.getElementById('rbGuestType')?.value || 'Khách trạm';
  const firstStop = document.getElementById('rbFirstStop').value;
  const transship = guestType === 'Rước đường'
    ? (document.getElementById('rbTransshipSelect')?.value || '')
    : (document.getElementById('rbTransshipInput')?.value?.trim() || '');
  const lastStop = document.getElementById('rbLastStop').value;
  const note = getVal('rbNote');

  if (!name || !phone) { showToast('Vui lòng nhập họ tên và SĐT', 'error'); return; }
  if (!rebookSelectedTripId || !rebookSelectedSeats.length) { showToast('Vui lòng chọn chuyến và ghế', 'error'); return; }

  const bank = tripSeatBank[rebookSelectedTripId];
  if (!bank) { showToast('Lỗi dữ liệu chuyến', 'error'); return; }

  const tripMeta = allTripsMeta.find(t => t.id === rebookSelectedTripId);
  const prefix = (tripMeta?.route?.includes('Sài Gòn')) ? 'SGCD' : 'CDSG';
  const newTicketNo = `${prefix}-${Math.floor(Math.random() * 9000) + 1000}`;
  const allSeats = [...(bank.down || []), ...(bank.up || [])];
  let bookedCount = 0;

  rebookSelectedSeats.forEach(code => {
    const seat = allSeats.find(s => s.code === code);
    if (seat && seat.state === 'empty') {
      Object.assign(seat, {
        state: 'hold',
        customerName: name,
        phone,
        firstStop,
        lastStop,
        note,
        ticketNo: newTicketNo,
        paid: false,
        count: rebookSelectedSeats.length,
        staff: (typeof currentUser !== 'undefined' && currentUser) ? currentUser.username : 'system'
      });
      bookedCount++;
    }
  });

  if (!bookedCount) { showToast('Không thể đặt ghế đã chọn', 'error'); return; }

  saveSeatBank();
  if (currentTripId === rebookSelectedTripId) {
    seatPlanDown = bank.down;
    seatPlanUp = bank.up;
    renderSeats();
  }
  showToast(`Đặt lại thành công ${bookedCount} ghế cho ${name}`);
  closeRebookModal();
  openCustomerHistory(phone);
}

function confirmRebookAndSell() {
  const bank = tripSeatBank[rebookSelectedTripId];
  if (!bank) { showToast('Lỗi dữ liệu chuyến', 'error'); return; }
  const tripMeta = allTripsMeta.find(t => t.id === rebookSelectedTripId);
  const prefix = (tripMeta && tripMeta.route.includes('Sài Gòn')) ? 'SGCD' : 'CDSG';
  const newTicketNo = prefix + '-' + String(Math.floor(Math.random() * 9000) + 1000);
  const allSeats = [...(bank.down || []), ...(bank.up || [])];
  let soldCount = 0;
  rebookSelectedSeats.forEach(code => {
    const seat = allSeats.find(s => s.code === code);
    if (seat && seat.state === 'empty') {
      seat.state = 'sold';
      seat.customerName = name;
      seat.phone = phone;
      seat.guestType = guestType;
      seat.firstStop = firstStop;
      seat.transship = transship;
      seat.lastStop = lastStop;
      seat.arrivalTransfer = arrivalTransfer;
      seat.note = note;
      seat.hasLuggage = hasLuggage;
      seat.ticketNo = newTicketNo;
      seat.paid = true;
      seat.count = rebookSelectedSeats.length;
      seat.staff = (typeof currentUser !== 'undefined' && currentUser) ? currentUser.username : 'system';
      seat.actionTime = new Date().toISOString();
      // Đặt lại vé có thể chọn sang 1 phơi xe KHÁC phơi đang xem (rebookSelectedTripId, không phải
      // currentTripId) — phải kiểm tra trạng thái đúng phơi đích thì gắn nhãn trạm/giai đoạn mới đúng.
      if (!seat.soldPhase) {
        seat.sellingStation = (typeof getCurrentStation === 'function') ? getCurrentStation() : '';
        const tripStatus = (typeof getTripLifecycleStatus === 'function') ? getTripLifecycleStatus(rebookSelectedTripId) : 'SELLING';
        seat.soldPhase = tripStatus === 'SELLING' ? 'PRE_DEPART' : 'POST_DEPART';
        seat.reopenEventId = (tripStatus === 'REOPEN' && typeof getActiveReopenEvent === 'function')
          ? ((getActiveReopenEvent(rebookSelectedTripId) || {}).id || null)
          : null;
      }
      soldCount++;
    }
  });
  if (soldCount === 0) { showToast('Không thể bán ghế đã chọn', 'error'); return; }
  saveSeatBank();
  if (currentTripId === rebookSelectedTripId) {
    seatPlanDown = bank.down;
    seatPlanUp = bank.up;
    renderSeats();
  }
  showToast(`Đã bán vé thành công ${soldCount} ghế cho ${name}`);
  closeRebookModal();
  openCustomerHistory(phone);
}

// Hook into search input
(function () {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.querySelector('.search-btn');

  function handlePhoneSearch() {
    if (!searchInput) return;
    const raw = searchInput.value.trim();
    if (raw.length > 0) {
      openCustomerHistory(raw);
    } else {
      showToast('Vui lòng nhập số điện thoại, tên hoặc mã vé để tìm kiếm', 'warning');
    }
  }

  if (searchInput) {
    let liveSearchDebounceTimer = null;
    searchInput.addEventListener('input', function () {
      const val = this.value;
      // Tab "Rước liền"/"Lịch sử" đang mở: ô tìm kiếm chung trên header lọc luôn danh sách đang xem
      // (tên/SĐT) thay vì tra cứu lịch sử khách theo SĐT — đồng bộ giá trị sang đúng ô tìm kiếm riêng
      // của view đó rồi gọi lại đúng hàm lọc debounce sẵn có (pkOnSearchInput/phOnSearchInput), để 2 ô
      // luôn hiện cùng 1 giá trị thay vì mỗi ô 1 trạng thái riêng.
      if (typeof currentView !== 'undefined' && currentView === 'pickup') {
        const pkField = document.getElementById('pkSearchInput');
        if (pkField) pkField.value = val;
        pkOnSearchInput(val);
        return;
      }
      if (typeof currentView !== 'undefined' && currentView === 'history') {
        const phField = document.getElementById('phSearchInput');
        if (phField) phField.value = val;
        phOnSearchInput(val);
        return;
      }
      if (typeof currentView !== 'undefined' && currentView === 'phoi') {
        const nameField = document.getElementById('filterName');
        if (nameField) nameField.value = val;
        clearTimeout(phoiFilterDebounceTimer);
        phoiFilterDebounceTimer = setTimeout(applyFilters, 300);
        return;
      }
      clearTimeout(liveSearchDebounceTimer);
      liveSearchDebounceTimer = setTimeout(() => renderLiveSearchResults(val), 300);
    });
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        if (typeof currentView !== 'undefined' && (currentView === 'pickup' || currentView === 'history' || currentView === 'phoi')) return;
        e.preventDefault();
        handlePhoneSearch();
      }
    });
  }
  if (searchBtn) {
    searchBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      handlePhoneSearch();
    });
  }
})();

window.addEventListener('storage', (e) => {
  if (!e.key || e.key === HN_PICKUP_PAX_KEY) {
    pickupPassengers = loadPickupPassengers();
    if (currentView === 'pickup') pkRenderPaxTable();
  }
});

// Tài xế vừa được gán ở trang shuttle.html (tab khác) -> render lại ngay cột "Tài xế" nếu đang mở tab
// Trung chuyển, không cần tải lại trang.
window.addEventListener('storage', (e) => {
  if (e.key === HN_SHUTTLE_DRIVER_KEY) {
    renderTransshipTables();
    // So bản đồ tài xế mới/cũ -> đánh dấu cập nhật cho các dòng khách có SĐT vừa đổi (cột "Trung chuyển")
    // rồi render lại để những dòng đó nổi lên đầu bảng gộp.
    pkApplyShuttleDriverChange();
    if (currentView === 'pickup') pkRenderPaxTable();
  }
});

