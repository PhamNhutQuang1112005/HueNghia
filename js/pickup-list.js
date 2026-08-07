// ===== Storage & Data Models =====

const DEFAULT_PICKUP_PASSENGERS = [
  { id: 1, name: 'Nguyễn Thị Hồng', phone: '0909123456', ticketCount: 1, fromStation: 'Trạm Kinh Dương Vương', toStation: 'Trạm Châu Đốc', fromTransfer: '12 Kinh Dương Vương, Q.Bình Tân', toTransfer: 'Ngã 3 Vĩnh Xương, Châu Đốc', note: 'Khách lớn tuổi, cần hỗ trợ lên xuống xe', luggage: true, assigned: null },
  { id: 2, name: 'Trần Văn Bình', phone: '0918234567', ticketCount: 1, fromStation: 'Trạm An Sương', toStation: 'Trạm Long Xuyên', fromTransfer: '45 Trường Chinh, Q.12', toTransfer: 'Công viên Long Xuyên', note: '', luggage: false, assigned: { tripId: '1', seat: 'A12' } },
  { id: 3, name: 'Lê Thị Mai', phone: '0933345678', ticketCount: 2, fromStation: 'Trạm Q.5', toStation: 'Trạm Tân Châu', fromTransfer: '88 Nguyễn Trãi, Q.5', toTransfer: 'Bến phà Tân Châu', note: 'Đi cùng 1 trẻ nhỏ', luggage: true, assigned: null },
  { id: 4, name: 'Phạm Quốc Huy', phone: '0944456789', ticketCount: 1, fromStation: 'Văn phòng trung tâm', toStation: 'Bến xe Châu Đốc', fromTransfer: '120 Lê Hồng Phong, Q.10', toTransfer: 'Bến xe Châu Đốc', note: '', luggage: false, assigned: null },
  { id: 5, name: 'Võ Thị Kim Ngân', phone: '0977567890', ticketCount: 2, fromStation: 'Trạm Kinh Dương Vương', toStation: 'Trạm Cần Thơ', fromTransfer: '5 Hồ Học Lãm, Bình Tân', toTransfer: 'Bến Ninh Kiều, Cần Thơ', note: 'Gọi trước 15 phút khi xe tới', luggage: true, assigned: null }
];

// Tải danh sách hành khách rước liền từ LocalStorage
function loadPickupPassengers() {
  const keysToTry = [HN_PICKUP_PAX_KEY, 'hn_pickup_passengers_v5', 'hn_pickup_passengers_v4', 'hn_pickup_passengers_v3'];
  let storedPax = [];

  for (const k of keysToTry) {
    const saved = localStorage.getItem(k);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) { storedPax = parsed; break; }
      } catch (e) { }
    }
  }

  const defaults = JSON.parse(JSON.stringify(DEFAULT_PICKUP_PASSENGERS));
  defaults.forEach(def => {
    if (!storedPax.some(p => p.id === def.id || (p.name === def.name && p.phone === def.phone))) {
      storedPax.push(def);
    }
  });

  localStorage.setItem(HN_PICKUP_PAX_KEY, JSON.stringify(storedPax));
  return storedPax;
}

// Lưu danh sách hành khách rước liền vào LocalStorage
function savePickupPassengers() {
  const jsonStr = JSON.stringify(pickupPassengers);
  localStorage.setItem(HN_PICKUP_PAX_KEY, jsonStr);
  try { window.dispatchEvent(new StorageEvent('storage', { key: HN_PICKUP_PAX_KEY, newValue: jsonStr })); } catch (e) { }
}

let pickupPassengers = loadPickupPassengers();

const sgcdTripsMeta = [
  { id: '1', time: '07:00', route: 'Sài Gòn - Châu Đốc', plate: '51F-123.45', vehicleType: 'Limousine 24 Phòng' },
  { id: '2', time: '08:30', route: 'Sài Gòn - Châu Đốc', plate: '50H-678.90', vehicleType: 'Giường nằm 34 chỗ' },
  { id: '3', time: '10:00', route: 'Sài Gòn - Châu Đốc', plate: '51F-234.56', vehicleType: 'Limousine 24 Phòng' },
  { id: '4', time: '13:15', route: 'Sài Gòn - Châu Đốc', plate: '50H-345.67', vehicleType: 'Ghế ngồi 45 chỗ' },
  { id: '5', time: '15:30', route: 'Sài Gòn - Châu Đốc', plate: '51F-456.78', vehicleType: 'Limousine 24 Phòng' },
  { id: '6', time: '17:00', route: 'Sài Gòn - Châu Đốc', plate: '50H-567.89', vehicleType: 'Giường nằm 34 chỗ' },
];
const cdsgTripsMeta = [
  { id: '7', time: '06:00', route: 'Châu Đốc - Sài Gòn', plate: '51F-123.45', vehicleType: 'Limousine 24 Phòng' },
  { id: '8', time: '09:15', route: 'Châu Đốc - Sài Gòn', plate: '50H-678.90', vehicleType: 'Giường nằm 34 chỗ' },
  { id: '9', time: '14:00', route: 'Châu Đốc - Sài Gòn', plate: '51F-234.56', vehicleType: 'Limousine 24 Phòng' },
  { id: '10', time: '21:00', route: 'Châu Đốc - Sài Gòn', plate: '50H-567.89', vehicleType: 'Giường nằm 34 chỗ' },
];

// Tải danh sách thông tin chuyến xe từ LocalStorage
function loadAllTripsMeta() {
  const saved = localStorage.getItem(HN_TRIPS_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) { }
  }
  return [...sgcdTripsMeta, ...cdsgTripsMeta];
}

let allTripsMeta = loadAllTripsMeta();

const staffList = ["tuyetphuong.huenghia", "minh.tran", "nguyen.long", "thi.hoa"];
const stopsFirst = ["Trạm Kinh Dương Vương", "Trạm An Sương", "Trạm Q.5", "Văn phòng trung tâm"];
const stopsLast = ["Trạm Châu Đốc", "Trạm Tân Châu", "Bến xe Châu Đốc"];
// 2. Danh sách Khách hàng mẫu & Số điện thoại mẫu (50 profiles độc nhất)
const nameSamples = [
  "Nguyễn Văn An", "Trần Thị Mai", "Lê Hoàng Nam", "Phạm Thùy Linh",
  "Võ Minh Khoa", "Huỳnh Ngọc Ánh", "Đặng Quốc Huy", "Bùi Thảo Vy",
  "Nguyễn Thanh Tùng", "Lý Thị Hồng", "Cao Văn Đức", "Trương Minh Tuấn",
  "Đỗ Thị Bích", "Phan Văn Cường", "Hồ Thanh Hải", "Dương Quốc Bảo",
  "Ngô Thị Yến", "Trịnh Văn Lâm", "Đinh Thị Hoa", "Mai Văn Hùng",
  "Lâm Thị Ngọc", "Hoàng Văn Thái", "Vũ Thị Kim", "Đoàn Văn Lộc",
  "Tạ Thị Thu", "Quách Văn Sang", "Đặng Thị Nga", "Bùi Văn Tâm",
  "Nguyễn Thị Tuyết", "Trần Văn Phát", "Lê Thị Thắm", "Phạm Văn Sơn",
  "Võ Thị Diệu", "Huỳnh Văn Quyền", "Cao Thị Hạnh", "Trương Văn Khang",
  "Lý Văn Tấn", "Phan Thị Thảo", "Đỗ Văn Nghĩa", "Hồ Thị Phượng",
  "Dương Văn Kiên", "Ngô Thị Vân", "Trịnh Văn Trung", "Đinh Văn Phong",
  "Mai Thị Loan", "Lâm Văn Phú", "Hoàng Thị Trinh", "Vũ Văn Quý",
  "Đoàn Thị Trúc", "Tạ Văn Vinh"
];
const noteSamples = ["", "Khách quen, hay đi ghế gần cửa", "Yêu cầu ghế tầng dưới", "Có trẻ nhỏ đi cùng", ""];
const pickupTimes = ["06:15", "06:20", "06:25", "06:30", "06:35", "06:40", "06:45", "06:50", "06:55", "06:20", "06:35", "06:50"];
const phonePool = [
  "0809123456", "0912345678", "0933778899", "0987654321",
  "0809654321", "0901234567", "0966998877", "0913579246",
  "0938001122", "0989112233", "0908771122", "0967345678",
  "0903112233", "0918223344", "0927334455", "0936445566",
  "0945556677", "0954667788", "0963778899", "0972889900",
  "0981990011", "0909001122", "0917112233", "0926223344",
  "0935334455", "0944445566", "0953556677", "0962667788",
  "0971778899", "0980889900", "0908990011", "0916001122",
  "0925112233", "0934223344", "0943334455", "0952445566",
  "0961556677", "0970667788", "0989778899", "0907889900",
  "0915990011", "0924001122", "0933112244", "0942223355",
  "0951334466", "0960445577", "0979556688", "0988667799",
  "0906778800", "0914889911"
];
let pickupTimeIdx = 0, phoneIdx = 0, ticketSeq = 1, nameIdx = 0;

// Sinh danh sách mã ghế tầng dưới (A) và tầng trên (B)
function buildSequentialSeatCodes(total) {
  const downCount = Math.ceil(total / 2);
  const upCount = total - downCount;
  return {
    down: Array.from({ length: downCount }, (_, i) => "A" + (i + 1)),
    up: Array.from({ length: upCount }, (_, i) => "B" + (i + 1))
  };
}

// Lấy sơ đồ mã ghế theo loại xe
function getSeatCodesForVehicleType(typeLabel) {
  const total = VEHICLE_TYPE_SEATS[typeLabel];
  if (typeLabel === "Limousine 34 giường" || typeLabel === "Giường nằm 34 chỗ") {
    const base = buildSequentialSeatCodes(VEHICLE_TYPE_SEATS["Xe thường 36 giường"]);
    return {
      down: base.down.map(c => c === "A3" ? "A3_hidden" : c),
      up: base.up.map(c => c === "B3" ? "B3_hidden" : c)
    };
  }
  return buildSequentialSeatCodes(total);
}

// Khởi tạo thông tin ghế đơn
function makeSeat(code, state, opts = {}) {
  const isBooked = ['sold', 'hold', 'free', 'cargo'].includes(state);
  return Object.assign({
    code, state, locked: false, price: state === 'free' ? 0 : 280000,
    callState: isBooked ? "Chưa gọi" : null,
    firstStop: isBooked ? stopsFirst[Math.floor(Math.random() * stopsFirst.length)] : null,
    lastStop: isBooked ? stopsLast[Math.floor(Math.random() * stopsLast.length)] : null,
    staff: isBooked ? staffList[Math.floor(Math.random() * staffList.length)] : null,
    customerName: isBooked ? nameSamples[(nameIdx++) % nameSamples.length] : null,
    note: isBooked ? noteSamples[Math.floor(Math.random() * noteSamples.length)] : null,
    count: 1,
    pickupTime: isBooked ? pickupTimes[(pickupTimeIdx++) % pickupTimes.length] : null,
    phone: isBooked ? phonePool[(phoneIdx++) % phonePool.length] : null,
    ticketNo: isBooked ? ("SGCD-" + String(ticketSeq++).padStart(4, '0')) : null,
    paid: isBooked ? (state === 'free' ? true : (state === 'sold' ? Math.random() > 0.25 : Math.random() > 0.6)) : false,
    hasLuggage: isBooked ? Math.random() > 0.55 : false
  }, opts);
}

// Ghép thông tin ghế nhóm
function groupSeat(mainSeat, code, state) {
  mainSeat.count = 2;
  return makeSeat(code, state, {
    ticketNo: mainSeat.ticketNo, customerName: mainSeat.customerName,
    phone: mainSeat.phone, pickupTime: mainSeat.pickupTime,
    firstStop: mainSeat.firstStop, lastStop: mainSeat.lastStop,
    note: mainSeat.note, hasLuggage: mainSeat.hasLuggage,
    paid: mainSeat.paid, count: 2
  });
}

// Sinh sơ đồ ghế mặc định cho phơi xe
function generateTripSeatPlanForVehicleType(vehicleType) {
  const codes = getSeatCodesForVehicleType(vehicleType);
  const pattern = ['sold', 'hold', 'empty', 'empty', 'sold', 'empty', 'hold', 'free', 'empty', 'sold', 'cargo', 'empty'];
  const buildFloor = floorCodes => floorCodes.map((code, i) => {
    if (code.endsWith('_hidden')) return { code, state: 'hidden' };
    return makeSeat(code, pattern[i % pattern.length]);
  });
  return { down: buildFloor(codes.down), up: buildFloor(codes.up) };
}

let tripSeatBank = {};

// Lưu sơ đồ ghế vào LocalStorage
function saveSeatBank() {
  const jsonStr = JSON.stringify(tripSeatBank);
  localStorage.setItem(HN_STORAGE_KEY, jsonStr);
  try { window.dispatchEvent(new StorageEvent('storage', { key: HN_STORAGE_KEY, newValue: jsonStr })); } catch (e) { }
}

// Tải sơ đồ ghế từ LocalStorage
function loadSeatBank() {
  try {
    const saved = localStorage.getItem(HN_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (e) { return null; }
}

// Khởi tạo bộ dữ liệu sơ đồ ghế ban đầu
function initSeatBank() {
  const saved = loadSeatBank();
  if (saved) { tripSeatBank = saved; return; }

  const a1 = makeSeat("A1", "sold");
  const a2 = groupSeat(a1, "A2", "sold");
  const a10 = makeSeat("A10", "hold");
  const a11 = groupSeat(a10, "A11", "hold");
  const a12 = makeSeat("A12", "sold", {
    customerName: "Trần Văn Bình", phone: "0918234567",
    firstStop: "Trạm An Sương", lastStop: "Trạm Long Xuyên",
    transshipStation: "45 Trường Chinh, Q.12"
  });

  const seatPlanDown = [a1, a2, makeSeat("A3", "empty"), makeSeat("A4", "cargo"), makeSeat("A5", "sold"), makeSeat("A6", "empty"), makeSeat("A7", "sold"), makeSeat("A8", "free"), makeSeat("A9", "empty"), a10, a11, a12];
  const b2 = makeSeat("B2", "sold");
  const b3 = groupSeat(b2, "B3", "sold");
  const seatPlanUp = [makeSeat("B1", "empty"), b2, b3, makeSeat("B4", "empty"), makeSeat("B5", "sold"), makeSeat("B6", "empty"), makeSeat("B7", "cargo"), makeSeat("B8", "hold"), makeSeat("B9", "empty"), makeSeat("B10", "sold"), makeSeat("B11", "free"), makeSeat("B12", "empty")];

  tripSeatBank['1'] = { down: seatPlanDown, up: seatPlanUp, plate: '51F-123.45', vehicleType: 'Limousine 24 Phòng', driver: 'Trần Văn Hùng', helper: 'Nguyễn Thị Hương' };
  allTripsMeta.forEach(t => {
    if (t.id !== '1') {
      const plan = generateTripSeatPlanForVehicleType(t.vehicleType || 'Giường nằm 34 chỗ');
      tripSeatBank[t.id] = { down: plan.down, up: plan.up, plate: t.plate || '50H-678.90', vehicleType: t.vehicleType || 'Giường nằm 34 chỗ', driver: 'Phạm Quốc Bảo', helper: 'Đỗ Văn Sơn' };
    }
  });
  saveSeatBank();
}

initSeatBank();

// Đăng ký sự kiện đồng bộ dữ liệu giữa các tab
window.addEventListener('storage', (e) => {
  if (e.key === HN_STORAGE_KEY) {
    const newBank = loadSeatBank();
    if (newBank) {
      tripSeatBank = newBank;
      if (document.getElementById('assignPickupModal').classList.contains('open')) {
        renderTripList();
        renderSeatMap();
        updateConfirmState();
      }
      renderPaxTable();
    }
  }
  if (!e.key || e.key === HN_PICKUP_PAX_KEY) {
    pickupPassengers = loadPickupPassengers();
    renderPaxTable();
  }
});

let activePaxId = null, activeTripId = null, selectedSeats = [], tripSearchKeyword = '', customAssignPrice = null;

// ===== Filter & Calendar State =====
const DEMO_TODAY = new Date(2026, 6, 18);
let calDate = new Date(DEMO_TODAY);
let selectedDate = new Date(DEMO_TODAY);
const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
let calendarOpen = false;

let filterState = {
  fromStation: 'all',
  toStation: 'all',
  timeSlot: 'all',
  status: 'all',
  search: ''
};

function renderCalendar() {
  const calGrid = document.getElementById("calGrid");
  const monthLabel = document.getElementById("calMonthLabel");
  if (!calGrid || !monthLabel) return;
  const y = calDate.getFullYear(), m = calDate.getMonth();
  monthLabel.textContent = `${monthNames[m]}, ${y}`;
  const first = new Date(y, m, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const daysInPrevMonth = new Date(y, m, 0).getDate();
  let html = "";
  ["T2", "T3", "T4", "T5", "T6", "T7", "CN"].forEach((d) => {
    html += `<div class="cal-dow">${d}</div>`;
  });
  for (let i = 0; i < startOffset; i++) {
    html += `<div class="cal-day muted">${daysInPrevMonth - startOffset + i + 1}</div>`;
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(y, m, d);
    const isToday = dateObj.toDateString() === DEMO_TODAY.toDateString();
    const isSelected = dateObj.toDateString() === selectedDate.toDateString();
    const lunar = ((d + 16) % 30) + 1;
    html += `<div class="cal-day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}" onclick="pickDate(${y},${m},${d})">${d}<span class="lunar">${lunar}/6</span></div>`;
  }
  const totalCells = startOffset + daysInMonth;
  const trailing = (7 - (totalCells % 7)) % 7;
  for (let i = 1; i <= trailing; i++) {
    html += `<div class="cal-day muted">${i}</div>`;
  }
  calGrid.innerHTML = html;
}

function shiftMonth(dir) {
  calDate = new Date(calDate.getFullYear(), calDate.getMonth() + dir, 1);
  renderCalendar();
}

function goToday() {
  calDate = new Date(DEMO_TODAY);
  selectedDate = new Date(DEMO_TODAY);
  renderCalendar();
  updateCalTrigger();
  toggleCalendar(false);
  applyFilters();
}

function pickDate(y, m, d) {
  selectedDate = new Date(y, m, d);
  renderCalendar();
  updateCalTrigger();
  toggleCalendar(false);
  applyFilters();
}

function updateCalTrigger() {
  const dateLabel = document.getElementById("filterDateLabel");
  if (!dateLabel) return;
  const isToday = selectedDate.toDateString() === DEMO_TODAY.toDateString();
  const d = String(selectedDate.getDate()).padStart(2, "0");
  const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
  const y = selectedDate.getFullYear();
  dateLabel.textContent = isToday ? `Hôm nay (${d}/${m}/${y})` : `${d}/${m}/${y}`;
}

function toggleCalendar(force) {
  const panel = document.getElementById("calendarPanel");
  const btn = document.getElementById("filterDateBtn");
  if (!panel || !btn) return;
  calendarOpen = typeof force === "boolean" ? force : !calendarOpen;
  panel.classList.toggle("open", calendarOpen);
  btn.classList.toggle("open", calendarOpen);
}

document.addEventListener("click", (e) => {
  if (
    calendarOpen &&
    !e.target.closest("#calendarPanel") &&
    !e.target.closest("#filterDateBtn")
  ) {
    toggleCalendar(false);
  }
});

function applyFilters() {
  const fromEl = document.getElementById('filterFromStation');
  const toEl = document.getElementById('filterToStation');
  const timeEl = document.getElementById('filterTimeSlot');
  const statusEl = document.getElementById('filterStatus');

  filterState.fromStation = fromEl ? fromEl.value : 'all';
  filterState.toStation = toEl ? toEl.value : 'all';
  filterState.timeSlot = timeEl ? timeEl.value : 'all';
  filterState.status = statusEl ? statusEl.value : 'all';

  renderPaxTable();
}

function resetFilters() {
  filterState = { fromStation: 'all', toStation: 'all', timeSlot: 'all', status: 'all', search: '' };
  const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  setVal('filterFromStation', 'all');
  setVal('filterToStation', 'all');
  setVal('filterTimeSlot', 'all');
  setVal('filterStatus', 'all');
  const searchEl = document.getElementById('searchInput');
  if (searchEl) searchEl.value = '';
  goToday();
}

function onSearchInput(val) {
  filterState.search = val || '';
  renderPaxTable();
}

function toggleAll(checkAllEl) {
  const checkboxes = document.querySelectorAll('#paxTableBody input[type="checkbox"]');
  checkboxes.forEach(cb => cb.checked = checkAllEl.checked);
}

// ===== Passenger List View =====

// Render bảng danh sách hành khách rước liền
function renderPaxTable() {
  const tbody = document.getElementById('paxTableBody');
  const gridEmpty = document.getElementById('gridEmpty');
  if (!tbody) return;

  let filtered = pickupPassengers.filter(p => {
    if (filterState.fromStation !== 'all' && p.fromStation !== filterState.fromStation) return false;
    if (filterState.toStation !== 'all' && p.toStation !== filterState.toStation) return false;
    if (filterState.status === 'pending' && p.assigned) return false;
    if (filterState.status === 'assigned' && !p.assigned) return false;
    if (filterState.search) {
      const kw = filterState.search.toLowerCase();
      const matchName = p.name && p.name.toLowerCase().includes(kw);
      const matchPhone = p.phone && p.phone.toLowerCase().includes(kw);
      const matchTicket = p.assigned?.seat && String(p.assigned.seat).toLowerCase().includes(kw);
      if (!matchName && !matchPhone && !matchTicket) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    if (gridEmpty) gridEmpty.style.display = 'block';
    return;
  }
  if (gridEmpty) gridEmpty.style.display = 'none';

  tbody.innerHTML = filtered.map((p, idx) => {
    const luggageMark = `<span class="luggage-mark ${p.luggage ? 'yes' : ''}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m5 13 4 4L19 7"/></svg></span>`;
    let statusCell, actionCell;
    if (p.assigned) {
      const trip = allTripsMeta.find(t => t.id === p.assigned.tripId);
      const timeStr = p.assigned.time || (trip ? trip.time : '07:00');
      const plateStr = p.assigned.plate || (trip ? trip.plate : '51F-123.45');
      const seatStr = p.assigned.seat || (Array.isArray(p.assigned.seats) ? p.assigned.seats.join(', ') : 'Rước liền');
      statusCell = `<div class="assigned-info"><b style="color:var(--text-main); font-size:13.5px;">${timeStr} - ${plateStr}</b><span style="color:var(--text-sub); font-size:12.5px;">Ghế ${seatStr}</span></div>`;
      actionCell = `<button class="assign-action-btn reassign" onclick="openAssignModal(${p.id})">Đổi chỉ định</button>`;
    } else {
      statusCell = `<span class="status-tag pending">Chưa chỉ định</span>`;
      actionCell = `<button class="assign-action-btn" onclick="openAssignModal(${p.id})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 5v14M5 12h14"/></svg>Chỉ định</button>`;
    }

    return `
      <tr>
        <td class="col-stt">${idx + 1}</td>
        <td><div class="pax-info"><div class="pax-name">KH: ${p.name}</div><div class="pax-phone">SĐT: ${p.phone}</div></div></td>
        <td><div class="route-tags"><span class="route-tag route-from">Trạm đi: ${p.fromStation}</span><span class="route-tag route-to">Trạm đến: ${p.toStation}</span></div></td>
        <td class="center" style="font-weight:700; font-size:13.5px; color:var(--text-main);">${p.ticketCount || p.count || 1}</td>
        <td>${p.fromTransfer || '—'}</td>
        <td>${p.toTransfer || '—'}</td>
        <td class="note-cell">${p.note || '—'}</td>
        <td class="center">${luggageMark}</td>
        <td class="center">${statusCell}</td>
        <td class="center">${actionCell}</td>
      </tr>`;
  }).join('');
}

// ===== Assign Vehicle Modal =====

// Mở modal chỉ định xe cho khách hàng
function openAssignModal(paxId) {
  activePaxId = paxId;
  const pax = pickupPassengers.find(p => p.id === paxId);
  if (!pax) return;

  const countStr = (pax.ticketCount || pax.count || 1) + ' vé';
  document.getElementById('assignModalSub').textContent = `Khách: ${pax.name} · ${pax.phone} · SL: ${countStr} · ${pax.fromStation} → ${pax.toStation}`;
  activeTripId = pax.assigned ? pax.assigned.tripId : allTripsMeta[0].id;

  if (pax.assigned && pax.assigned.seats && Array.isArray(pax.assigned.seats)) {
    selectedSeats = [...pax.assigned.seats];
  } else if (pax.assigned && pax.assigned.seat) {
    selectedSeats = pax.assigned.seat.split(',').map(s => s.trim()).filter(Boolean);
  } else {
    selectedSeats = [];
  }

  const trip = allTripsMeta.find(t => t.id === activeTripId);
  customAssignPrice = pax.assigned && pax.assigned.price ? pax.assigned.price : (trip ? (trip.price || 280000) : 280000);
  const priceInput = document.getElementById('assignTripPrice');
  if (priceInput) priceInput.value = customAssignPrice;

  tripSearchKeyword = '';
  const searchInput = document.getElementById('tripSearchInput');
  if (searchInput) searchInput.value = '';

  renderTripList();
  renderSeatMap();
  updateConfirmState();
  document.getElementById('assignPickupModal').classList.add('open');
}

// Đóng modal chỉ định xe
function closeAssignModal() {
  document.getElementById('assignPickupModal').classList.remove('open');
  activePaxId = null; activeTripId = null; selectedSeats = []; tripSearchKeyword = ''; customAssignPrice = null;
}

// Lọc danh sách phơi xe theo từ khóa
function filterTripList(keyword) {
  tripSearchKeyword = keyword || '';
  renderTripList();
}

// Render danh sách phơi xe bên cột trái modal
function renderTripList() {
  const wrap = document.getElementById('tripListPanel');
  if (!wrap) return;
  const kw = tripSearchKeyword.trim().toLowerCase();

  const filtered = !kw ? allTripsMeta : allTripsMeta.filter(t =>
    t.time.toLowerCase().includes(kw) || (t.plate && t.plate.toLowerCase().includes(kw)) ||
    t.route.toLowerCase().includes(kw) || (t.vehicleType && t.vehicleType.toLowerCase().includes(kw))
  );

  if (filtered.length === 0) {
    wrap.innerHTML = '<div class="trip-empty-msg">Không tìm thấy phơi xe phù hợp</div>';
    return;
  }

  wrap.innerHTML = filtered.map(t => {
    const plan = tripSeatBank[t.id];
    const totalSeats = plan ? plan.down.filter(s => s.state !== 'hidden').length + plan.up.filter(s => s.state !== 'hidden').length : 0;
    const bookedSeats = plan ? [...plan.down, ...plan.up].filter(s => ['sold', 'hold', 'free', 'cargo'].includes(s.state)).length : 0;
    const selected = t.id === activeTripId ? 'selected' : '';
    const plate = t.plate || 'Chưa có';
    const vehicleType = t.vehicleType || 'Chưa rõ';

    return `
      <div class="trip-card ${selected}" onclick="selectTrip('${t.id}')">
        <div>
          <div class="trip-time-row"><span class="trip-time">${t.time}</span><span class="trip-plate-inline">${plate}</span></div>
          <div class="trip-sub">${t.route} • ${vehicleType}</div>
        </div>
        <div class="trip-nums"><div class="n1">${bookedSeats}/${totalSeats}</div><div class="n2">đã đặt</div></div>
      </div>`;
  }).join('');
}

// Chọn phơi xe trong modal chỉ định
function selectTrip(tripId) {
  if (tripId === activeTripId) return;
  activeTripId = tripId;
  selectedSeats = [];

  const trip = allTripsMeta.find(t => t.id === activeTripId);
  customAssignPrice = trip ? (trip.price || 280000) : 280000;
  const priceInput = document.getElementById('assignTripPrice');
  if (priceInput) priceInput.value = customAssignPrice;

  renderTripList();
  renderSeatMap();
  updateConfirmState();
}

// Xử lý thay đổi giá vé chỉ định
function onAssignPriceChange(val) {
  customAssignPrice = Math.max(0, parseInt(val) || 0);
  updateConfirmState();
}

// Render sơ đồ ghế phơi xe bên cột phải modal
function renderSeatMap() {
  const floorDownEl = document.getElementById('assignSeatFloorDown');
  const floorUpEl = document.getElementById('assignSeatFloorUp');
  const tripPlan = tripSeatBank[activeTripId];
  if (!tripPlan || !floorDownEl || !floorUpEl) return;

  const mapSeat = seat => {
    if (seat.state === 'hidden') {
      return `<div class="van-seat" style="visibility:hidden; pointer-events:none;"></div>`;
    }
    const isSelected = selectedSeats.includes(seat.code);
    const isBooked = ['sold', 'hold', 'free', 'cargo'].includes(seat.state);
    const cls = isBooked ? 'blocked' : (isSelected ? 'selected' : 'empty');
    const clickable = !isBooked ? `onclick="selectSeat('${seat.code}')"` : '';

    return `
      <div class="van-seat ${cls}" ${clickable}>
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V17C19 18.6569 17.6569 20 16 20H8C6.34315 20 5 18.6569 5 17V5Z"/>
          <path d="M2 8C2 7.44772 2.44772 7 3 7H5V15H3C2.44772 15 2 14.5523 2 14V8Z"/>
          <path d="M19 7H21C21.5523 7 22 7.44772 22 8V14C22 14.5523 21.5523 15 21 15H19V7Z"/>
        </svg>
        <span class="seat-num">${seat.code}</span>
      </div>`;
  };

  const totalSeats = tripPlan.down.length + tripPlan.up.length;
  const useThreeCols = totalSeats >= 34;

  floorDownEl.classList.toggle('cols-3', useThreeCols);
  floorDownEl.innerHTML = tripPlan.down.map(mapSeat).join('');

  if (tripPlan.up.length === 0) {
    floorUpEl.parentElement.style.display = 'none';
    floorDownEl.parentElement.style.maxWidth = '320px';
    floorDownEl.parentElement.style.margin = '0 auto';
  } else {
    floorUpEl.parentElement.style.display = 'flex';
    floorDownEl.parentElement.style.maxWidth = '';
    floorDownEl.parentElement.style.margin = '';
    floorUpEl.classList.toggle('cols-3', useThreeCols);
    floorUpEl.innerHTML = tripPlan.up.map(mapSeat).join('');
  }

  const tagEl = document.getElementById('seatSelectedTag');
  if (tagEl) tagEl.textContent = '';
}

// Chọn / hủy chọn ghế trên sơ đồ
function selectSeat(code) {
  const tripPlan = tripSeatBank[activeTripId];
  if (!tripPlan) return;
  const seat = [...tripPlan.down, ...tripPlan.up].find(s => s.code === code);
  if (!seat || ['sold', 'hold', 'free', 'cargo'].includes(seat.state)) return;

  const idx = selectedSeats.indexOf(code);
  if (idx !== -1) selectedSeats.splice(idx, 1);
  else selectedSeats.push(code);

  renderSeatMap();
  updateConfirmState();
}

// Đơn giá áp dụng: ưu tiên giá tuỳ chỉnh trong modal, nếu không thì lấy giá của phơi xe (mặc định 280000)
function getUnitPrice(trip) {
  return (customAssignPrice !== null && !isNaN(customAssignPrice)) ? customAssignPrice : (trip ? (trip.price || 280000) : 280000);
}

// Cập nhật trạng thái nút xác nhận bán vé và hiển thị tổng tiền
function updateConfirmState() {
  const btn = document.getElementById('confirmAssignBtn');
  const hint = document.getElementById('assignHint');
  const totalEl = document.getElementById('assignTotalPrice');
  if (!btn) return;

  const trip = allTripsMeta.find(t => t.id === activeTripId);
  const unitPrice = getUnitPrice(trip);
  const totalPrice = unitPrice * selectedSeats.length;

  if (totalEl) totalEl.textContent = totalPrice.toLocaleString('vi-VN') + 'đ';

  if (activeTripId && selectedSeats.length > 0) {
    btn.disabled = false;
    hint.innerHTML = `Sẽ chỉ định <b>${selectedSeats.length} ghế (${selectedSeats.join(', ')})</b> — phơi xe <b>${trip ? trip.time : activeTripId}</b>`;
  } else {
    btn.disabled = true;
    hint.textContent = 'Chọn 1 phơi xe và chọn 1 hoặc nhiều ghế trống để chỉ định.';
  }
}

// Thực hiện bán vé chỉ định xe rước liền cho khách
function confirmAssign() {
  if (!activePaxId || !activeTripId || selectedSeats.length === 0) return;
  const pax = pickupPassengers.find(p => p.id === activePaxId);
  if (!pax) return;

  const tripPlan = tripSeatBank[activeTripId];
  if (!tripPlan) return;

  // Nếu khách đang đổi chỉ định từ 1 hoặc nhiều ghế/phơi xe khác thì trả ghế cũ về trạng thái trống
  if (pax.assigned) {
    const oldTripPlan = tripSeatBank[pax.assigned.tripId];
    if (oldTripPlan) {
      const oldSeatsList = pax.assigned.seats || (pax.assigned.seat ? pax.assigned.seat.split(',').map(s => s.trim()).filter(Boolean) : []);
      oldSeatsList.forEach(code => {
        const oldSeat = [...oldTripPlan.down, ...oldTripPlan.up].find(s => s.code === code);
        if (oldSeat) {
          Object.assign(oldSeat, { state: 'empty', customerName: null, phone: null, ticketNo: null, paid: false });
        }
      });
    }
  }

  const trip = allTripsMeta.find(t => t.id === activeTripId);
  const unitPrice = getUnitPrice(trip);
  const ticketNumber = "SGCD-" + String(Math.floor(1000 + Math.random() * 9000));

  selectedSeats.forEach(code => {
    const targetSeat = [...tripPlan.down, ...tripPlan.up].find(s => s.code === code);
    if (targetSeat) {
      Object.assign(targetSeat, {
        state: 'sold', customerName: pax.name, phone: pax.phone,
        firstStop: pax.fromStation, lastStop: pax.toStation,
        transshipStation: pax.fromTransfer, price: unitPrice,
        paid: true, count: selectedSeats.length, ticketNo: ticketNumber
      });
    }
  });

  pax.assigned = { tripId: activeTripId, seat: selectedSeats.join(', '), seats: [...selectedSeats], price: unitPrice };

  saveSeatBank();
  savePickupPassengers();

  closeAssignModal();
  renderPaxTable();
  const totalPrice = unitPrice * selectedSeats.length;
  showToast(`Đã bán vé cho ${pax.name} lên xe ${trip ? (trip.plate || '') : ''} — ${selectedSeats.length} ghế (${selectedSeats.join(', ')}) · Tổng: ${totalPrice.toLocaleString('vi-VN')}đ`);
}

// ===== Utils =====

// Hiển thị thông báo Toast
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toastText').textContent = msg;
  toast.classList.add('show');
  clearTimeout(window._pickupToastTimer);
  window._pickupToastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

document.getElementById('assignPickupModal').addEventListener('click', (e) => {
  if (e.target.id === 'assignPickupModal') closeAssignModal();
});

// Bật / tắt khung kết quả tìm kiếm SĐT
function toggleSearchResults(force) {
  const el = document.getElementById('searchResults');
  if (force === true) { el.classList.add('open'); return; }
  el.classList.toggle('open');
}
document.getElementById('searchInput').addEventListener('focus', () => toggleSearchResults(true));
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-wrap')) document.getElementById('searchResults').classList.remove('open');
});
function pickSearchResult() {
  document.getElementById('searchResults').classList.remove('open');
  showToast('Đã điều hướng đến đúng phơi xe và ghế của khách');
}

// ===== User Menu & Logout =====
(function initUserMenu() {
  const menu = document.getElementById('userMenu');
  const chipBtn = document.getElementById('userChipBtn');
  const dropdown = document.getElementById('userDropdown');
  const logoutBtn = document.getElementById('logoutBtn');
  if (!menu || !chipBtn || !dropdown || !logoutBtn) return;

  try {
    const raw = sessionStorage.getItem(HN_CURRENT_USER_KEY);
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
  } catch (_) { }

  function closeMenu() { menu.classList.remove('open'); chipBtn.setAttribute('aria-expanded', 'false'); dropdown.hidden = true; }
  function openMenu() { menu.classList.add('open'); chipBtn.setAttribute('aria-expanded', 'true'); dropdown.hidden = false; }

  chipBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (menu.classList.contains('open')) closeMenu();
    else openMenu();
  });

  document.addEventListener('click', (e) => { if (!menu.contains(e.target)) closeMenu(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  logoutBtn.addEventListener('click', () => { sessionStorage.removeItem(HN_CURRENT_USER_KEY); window.location.href = 'index.html'; });
})();

renderCalendar();
renderPaxTable();