/* ================= DỮ LIỆU MẪU ================= */

/* Danh sách khách đăng ký rước liền */
let pickupPassengers = [
  {
    id: 1,
    name: 'Nguyễn Thị Hồng',
    phone: '0909123456',
    fromStation: 'Trạm Kinh Dương Vương',
    toStation: 'Trạm Châu Đốc',
    fromTransfer: '12 Kinh Dương Vương, Q.Bình Tân',
    toTransfer: 'Ngã 3 Vĩnh Xương, Châu Đốc',
    note: 'Khách lớn tuổi, cần hỗ trợ lên xuống xe',
    luggage: true,
    assigned: null
  },
  {
    id: 2,
    name: 'Trần Văn Bình',
    phone: '0918234567',
    fromStation: 'Trạm An Sương',
    toStation: 'Trạm Long Xuyên',
    fromTransfer: '45 Trường Chinh, Q.12',
    toTransfer: 'Công viên Long Xuyên',
    note: '',
    luggage: false,
    assigned: { tripId: 't1', seat: '04' }
  },
  {
    id: 3,
    name: 'Lê Thị Mai',
    phone: '0933345678',
    fromStation: 'Trạm Q.5',
    toStation: 'Trạm Tân Châu',
    fromTransfer: '88 Nguyễn Trãi, Q.5',
    toTransfer: 'Bến phà Tân Châu',
    note: 'Đi cùng 1 trẻ nhỏ',
    luggage: true,
    assigned: null
  },
  {
    id: 4,
    name: 'Phạm Quốc Huy',
    phone: '0944456789',
    fromStation: 'Văn phòng trung tâm',
    toStation: 'Bến xe Châu Đốc',
    fromTransfer: '120 Lê Hồng Phong, Q.10',
    toTransfer: 'Bến xe Châu Đốc',
    note: '',
    luggage: false,
    assigned: null
  },
  {
    id: 5,
    name: 'Võ Thị Kim Ngân',
    phone: '0977567890',
    fromStation: 'Trạm Kinh Dương Vương',
    toStation: 'Trạm Cần Thơ',
    fromTransfer: '5 Hồ Học Lãm, Bình Tân',
    toTransfer: 'Bến Ninh Kiều, Cần Thơ',
    note: 'Gọi trước 15 phút khi xe tới',
    luggage: true,
    assigned: null
  }
];

/* Danh sách phơi xe (xe trung chuyển đang sẵn sàng nhận khách rước) */
/* seats: trạng thái từng ghế — 'empty' (trống, có thể chọn) | 'blocked' (đã có khách, không chọn được) */
let shuttleTrips = [
  {
    id: 't1',
    time: '05:30',
    plate: '51F-123.45',
    route: 'TP.HCM → Châu Đốc',
    driver: 'Nguyễn Văn Tâm',
    vehicleType: 'Limousine 15 Phòng',
    seats: {
      '01': 'blocked', '02': 'empty',
      '03': 'empty', '04': 'blocked', '05': 'empty',
      '06': 'blocked', '07': 'empty', '08': 'empty',
      '09': 'empty', '10': 'empty', '11': 'empty',
      '12': 'empty', '13': 'empty', '14': 'empty', '15': 'empty'
    }
  },
  {
    id: 't2',
    time: '06:00',
    plate: '51F-678.90',
    route: 'TP.HCM → Long Xuyên',
    driver: 'Trần Minh Khoa',
    vehicleType: 'Limousine 15 Phòng',
    seats: {
      '01': 'blocked', '02': 'blocked',
      '03': 'blocked', '04': 'empty', '05': 'empty',
      '06': 'blocked', '07': 'empty', '08': 'empty',
      '09': 'empty', '10': 'empty', '11': 'empty',
      '12': 'empty', '13': 'empty', '14': 'empty', '15': 'empty'
    }
  },
  {
    id: 't3',
    time: '06:30',
    plate: '51F-345.67',
    route: 'TP.HCM → Cần Thơ',
    driver: 'Lê Hoàng Sơn',
    vehicleType: 'Limousine 15 Phòng',
    seats: {
      '01': 'empty', '02': 'empty',
      '03': 'empty', '04': 'empty', '05': 'empty',
      '06': 'empty', '07': 'empty', '08': 'empty',
      '09': 'empty', '10': 'empty', '11': 'empty',
      '12': 'empty', '13': 'empty', '14': 'empty', '15': 'empty'
    }
  }
];

/* Bố cục sơ đồ ghế xe trung chuyển (van 15 chỗ, hàng cuối băng ghế 4 chỗ) */
const VAN_LAYOUT = [
  ['02', '03'],            // hàng 1 (lùi vào giữa, chừa chỗ tài xế)
  ['04', '05', '06'],
  ['07', '08', '09'],
  ['10', '11', '12'],
  ['13', '14', '15', '16'] // hàng cuối rộng
];
/* Lưu ý: mã ghế ở layout trên chỉ dùng để canh bố cục hiển thị,
   ta map lại theo đúng số ghế thực tế 01..15 bên dưới */
const SEAT_ROWS = [
  ['01', '02'],
  ['03', '04', '05'],
  ['06', '07', '08'],
  ['09', '10', '11'],
  ['12', '13', '14', '15']
];

let activePaxId = null;
let activeTripId = null;
let selectedSeat = null;
let tripSearchKeyword = '';

/* ================= RENDER DANH SÁCH KHÁCH ================= */

function renderPaxTable(){
  const tbody = document.getElementById('paxTableBody');
  const pending = pickupPassengers.filter(p => !p.assigned).length;
  document.getElementById('paxCountChip').textContent = pending + ' khách chờ chỉ định';

  if(pickupPassengers.length === 0){
    tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;padding:28px;color:var(--text-sub);font-weight:600;">Chưa có khách rước liền nào</td></tr>';
    return;
  }

  tbody.innerHTML = pickupPassengers.map((p, idx) => {
    const luggageMark = `<span class="luggage-mark ${p.luggage ? 'yes' : ''}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m5 13 4 4L19 7"/></svg></span>`;
    let statusCell, actionCell;
    if(p.assigned){
      const trip = shuttleTrips.find(t => t.id === p.assigned.tripId);
      statusCell = `
        <div class="assigned-info">
          <b>${trip ? trip.time + ' - ' + trip.plate : '—'}</b>
          <span>Ghế ${p.assigned.seat}</span>
        </div>`;
      actionCell = `<button class="assign-action-btn reassign" onclick="openAssignModal(${p.id})">Đổi chỉ định</button>`;
    } else {
      statusCell = `<span class="status-tag pending">Chưa chỉ định</span>`;
      actionCell = `
        <button class="assign-action-btn" onclick="openAssignModal(${p.id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 5v14M5 12h14"/></svg>
          Chỉ định
        </button>`;
    }

    return `
      <tr>
        <td>${idx + 1}</td>
        <td class="name-cell"><span class="pax-name">${p.name}</span></td>
        <td class="pax-phone">${p.phone}</td>
        <td>
          <div class="route-line"><b>${p.fromStation}</b><span>→ ${p.toStation}</span></div>
        </td>
        <td>${p.fromTransfer || '—'}</td>
        <td>${p.toTransfer || '—'}</td>
        <td class="note-cell">${p.note || '—'}</td>
        <td class="center">${luggageMark}</td>
        <td class="center">${statusCell}</td>
        <td class="center">${actionCell}</td>
      </tr>`;
  }).join('');
}

/* ================= MODAL CHỈ ĐỊNH XE ================= */

function openAssignModal(paxId){
  activePaxId = paxId;
  const pax = pickupPassengers.find(p => p.id === paxId);
  if(!pax) return;

  document.getElementById('assignModalSub').textContent =
    `Khách: ${pax.name} · ${pax.phone} · ${pax.fromStation} → ${pax.toStation}`;

  // Nếu khách đã có chỉ định trước đó, mở sẵn đúng phơi xe & ghế đó
  activeTripId = pax.assigned ? pax.assigned.tripId : shuttleTrips[0].id;
  selectedSeat = pax.assigned ? pax.assigned.seat : null;
  tripSearchKeyword = '';
  const searchInput = document.getElementById('tripSearchInput');
  if(searchInput) searchInput.value = '';

  renderTripList();
  renderSeatMap();
  updateConfirmState();

  document.getElementById('assignPickupModal').classList.add('open');
}

function closeAssignModal(){
  document.getElementById('assignPickupModal').classList.remove('open');
  activePaxId = null; activeTripId = null; selectedSeat = null; tripSearchKeyword = '';
}

function filterTripList(keyword){
  tripSearchKeyword = keyword || '';
  renderTripList();
}

function renderTripList(){
  const wrap = document.getElementById('tripListPanel');
  const kw = tripSearchKeyword.trim().toLowerCase();
  const filtered = !kw ? shuttleTrips : shuttleTrips.filter(t =>
    t.time.toLowerCase().includes(kw) ||
    t.plate.toLowerCase().includes(kw) ||
    t.route.toLowerCase().includes(kw) ||
    t.driver.toLowerCase().includes(kw)
  );

  if(filtered.length === 0){
    wrap.innerHTML = '<div class="trip-empty-msg">Không tìm thấy phơi xe phù hợp</div>';
    return;
  }

  wrap.innerHTML = filtered.map(t => {
    const totalSeats = Object.keys(t.seats).length;
    const bookedSeats = Object.values(t.seats).filter(s => s === 'blocked').length;
    const selected = t.id === activeTripId ? 'selected' : '';
    return `
      <div class="trip-card ${selected}" onclick="selectTrip('${t.id}')">
        <div>
          <div class="trip-time-row">
            <span class="trip-time">${t.time}</span>
            <span class="trip-plate-inline">${t.plate}</span>
          </div>
          <div class="trip-sub">${t.route} • ${t.vehicleType}</div>
        </div>
        <div class="trip-nums">
          <div class="n1">${bookedSeats}/${totalSeats}</div>
          <div class="n2">đã đặt</div>
        </div>
      </div>`;
  }).join('');
}

function selectTrip(tripId){
  if(tripId === activeTripId) return;
  activeTripId = tripId;
  selectedSeat = null;
  renderTripList();
  renderSeatMap();
  updateConfirmState();
}

function renderSeatMap(){
  const frame = document.getElementById('vanFrame');
  const trip = shuttleTrips.find(t => t.id === activeTripId);
  if(!trip){ frame.innerHTML = ''; return; }

  frame.innerHTML = SEAT_ROWS.map(row => {
    const seats = row.map(code => {
      const state = trip.seats[code]; // 'empty' | 'blocked'
      let cls = state;
      if(state === 'empty' && code === selectedSeat) cls = 'selected';
      const clickable = (state === 'empty') ? `onclick="selectSeat('${code}')"` : '';
      return `<div class="van-seat ${cls}" ${clickable}>
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V17C19 18.6569 17.6569 20 16 20H8C6.34315 20 5 18.6569 5 17V5Z"/>
          <path d="M2 8C2 7.44772 2.44772 7 3 7H5V15H3C2.44772 15 2 14.5523 2 14V8Z"/>
          <path d="M19 7H21C21.5523 7 22 7.44772 22 8V14C22 14.5523 21.5523 15 21 15H19V7Z"/>
        </svg>
        <span class="seat-num">${code}</span>
      </div>`;
    }).join('');
    return `<div class="van-row">${seats}</div>`;
  }).join('');

  document.getElementById('seatSelectedTag').textContent = selectedSeat ? ('Ghế ' + selectedSeat) : '';
}

function selectSeat(code){
  const trip = shuttleTrips.find(t => t.id === activeTripId);
  if(!trip || trip.seats[code] !== 'empty') return;
  selectedSeat = (selectedSeat === code) ? null : code;
  renderSeatMap();
  updateConfirmState();
}

function updateConfirmState(){
  const btn = document.getElementById('confirmAssignBtn');
  const hint = document.getElementById('assignHint');
  if(activeTripId && selectedSeat){
    btn.disabled = false;
    hint.textContent = `Sẽ chỉ định ghế ${selectedSeat} — phơi xe ${shuttleTrips.find(t=>t.id===activeTripId).time}`;
  } else {
    btn.disabled = true;
    hint.textContent = 'Chọn 1 phơi xe và 1 ghế trống để chỉ định.';
  }
}

function confirmAssign(){
  if(!activePaxId || !activeTripId || !selectedSeat) return;
  const pax = pickupPassengers.find(p => p.id === activePaxId);
  const trip = shuttleTrips.find(t => t.id === activeTripId);
  if(!pax || !trip) return;

  // Nếu khách đang đổi chỉ định từ 1 ghế/phơi xe khác thì trả ghế cũ về trạng thái trống
  if(pax.assigned){
    const oldTrip = shuttleTrips.find(t => t.id === pax.assigned.tripId);
    if(oldTrip && oldTrip.seats[pax.assigned.seat] !== undefined){
      oldTrip.seats[pax.assigned.seat] = 'empty';
    }
  }

  trip.seats[selectedSeat] = 'blocked';
  pax.assigned = { tripId: trip.id, seat: selectedSeat };

  closeAssignModal();
  renderPaxTable();
  showToast(`Đã chỉ định ${pax.name} lên xe ${trip.plate} — ghế ${selectedSeat}`);
}

/* ================= TIỆN ÍCH ================= */

function showToast(msg){
  const toast = document.getElementById('toast');
  document.getElementById('toastText').textContent = msg;
  toast.classList.add('show');
  clearTimeout(window._pickupToastTimer);
  window._pickupToastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

document.getElementById('assignPickupModal').addEventListener('click', (e) => {
  if(e.target.id === 'assignPickupModal') closeAssignModal();
});

/* ---- Search dropdown (y chang trang ticketstaff) ---- */
function toggleSearchResults(force){
  const el = document.getElementById('searchResults');
  if(force===true){ el.classList.add('open'); return; }
  el.classList.toggle('open');
}
document.getElementById('searchInput').addEventListener('focus', ()=>toggleSearchResults(true));
document.addEventListener('click', (e)=>{
  if(!e.target.closest('.search-wrap')) document.getElementById('searchResults').classList.remove('open');
});
function pickSearchResult(){
  document.getElementById('searchResults').classList.remove('open');
  showToast('Đã điều hướng đến đúng phơi xe và ghế của khách');
}

/* ===================== TÀI KHOẢN / ĐĂNG XUẤT (y chang trang ticketstaff) ===================== */
(function initUserMenu(){
  const menu = document.getElementById('userMenu');
  const chipBtn = document.getElementById('userChipBtn');
  const dropdown = document.getElementById('userDropdown');
  const logoutBtn = document.getElementById('logoutBtn');
  if (!menu || !chipBtn || !dropdown || !logoutBtn) return;

  // Hiển thị thông tin người dùng từ phiên đăng nhập (nếu có)
  try {
    const raw = sessionStorage.getItem('hn_current_user');
    if (raw) {
      const user = JSON.parse(raw);
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
  } catch (_) { /* ignore */ }

  function closeMenu(){
    menu.classList.remove('open');
    chipBtn.setAttribute('aria-expanded', 'false');
    dropdown.hidden = true;
  }
  function openMenu(){
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
    sessionStorage.removeItem('hn_current_user');
    window.location.href = 'index.html';
  });
})();

renderPaxTable();