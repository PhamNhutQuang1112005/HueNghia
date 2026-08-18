/* ===================== DỮ LIỆU GHẾ MẪU ===================== */
const staffList = ["tuyetphuong.huenghia", "minh.tran", "nguyen.long", "thi.hoa"];
// Ánh xạ username đăng nhập -> mã nhân viên hiển thị (NV01, NV02...) để đồng bộ định dạng
// với dữ liệu lịch sử tĩnh (CUSTOMER_HISTORY_DATA), tránh hiện thẳng username thô ngoài UI.
const stopsFirst = ["Trạm Kinh Dương Vương", "Trạm An Sương", "Trạm Q.5", "Văn phòng trung tâm"];
const stopsLast = ["Trạm Châu Đốc", "Trạm Tân Châu", "Bến xe Châu Đốc"];
const pickupTimes = ["07:00", "08:30", "10:00", "13:15", "15:30", "17:00"];
const noteSamples = ["", "Khách quen, hay đi ghế gần cửa", "Yêu cầu ghế tầng dưới", "Có trẻ nhỏ đi cùng", ""];
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

function fillSearchInputWithPhone(phone) {
  if (!phone) return;
  const cleanPhone = String(phone).trim();
  if (!cleanPhone || cleanPhone === '—' || cleanPhone === 'undefined' || cleanPhone === 'null') return;
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.value = cleanPhone;
  }
}

// Mock history data (past trips)

let pickupTimeIdx = 0, custIdx = 0, ticketSeq = 1;
var currentView = 'booking'; // 'booking' or 'phoi'

function makeSeat(code, state, opts = {}) {
  const isBooked = ['sold', 'hold', 'free', 'cargo'].includes(state);
  const sampleIdx = isBooked ? (custIdx++) % nameSamples.length : 0;
  const base = {
    code, state, // empty | hold | sold | free | cargo
    locked: false,
    price: state === 'free' ? 0 : 280000,
    callState: isBooked ? "Chưa gọi" : null,
    firstStop: isBooked ? stopsFirst[Math.floor(Math.random() * stopsFirst.length)] : null,
    lastStop: isBooked ? stopsLast[Math.floor(Math.random() * stopsLast.length)] : null,
    staff: isBooked ? staffList[Math.floor(Math.random() * staffList.length)] : null,
    customerName: isBooked ? nameSamples[sampleIdx] : null,
    note: isBooked ? noteSamples[Math.floor(Math.random() * noteSamples.length)] : null,
    count: 1,
    pickupTime: isBooked ? pickupTimes[(pickupTimeIdx++) % pickupTimes.length] : null,
    phone: isBooked ? phonePool[sampleIdx] : null,
    ticketNo: isBooked ? ("SGCD-" + String(ticketSeq++).padStart(4, '0')) : null,
    paid: isBooked ? (state === 'free' ? true : (state === 'sold' ? Math.random() > 0.25 : Math.random() > 0.6)) : false,
    hasLuggage: isBooked ? Math.random() > 0.55 : false
  };
  return Object.assign(base, opts);
}

// Ghép ghế liền kề vào chung 1 vé (cùng khách, cùng SĐT, cùng mã vé, cùng điểm đi/đến...)
// để dữ liệu ghế trên sơ đồ và dữ liệu ở danh sách hành khách luôn khớp nhau tuyệt đối.
function groupSeat(mainSeat, code, state) {
  mainSeat.count = 2;
  return makeSeat(code, state, {
    ticketNo: mainSeat.ticketNo,
    customerName: mainSeat.customerName,
    phone: mainSeat.phone,
    pickupTime: mainSeat.pickupTime,
    firstStop: mainSeat.firstStop,
    lastStop: mainSeat.lastStop,
    note: mainSeat.note,
    hasLuggage: mainSeat.hasLuggage,
    paid: mainSeat.paid,
    count: 2
  });
}

// Sinh dữ liệu ghế mẫu cho các chuyến còn lại (mỗi ghế là 1 khách hàng độc nhất)

let isSyncingFromStorage = false;

const a1 = makeSeat("A1", "sold");
const a2 = groupSeat(a1, "A2", "sold");
const a10 = makeSeat("A10", "hold");
const a11 = groupSeat(a10, "A11", "hold");
const a12 = makeSeat("A12", "sold", {
  customerName: "Võ Minh Khoa",
  phone: "0809654321",
  firstStop: "Trạm An Sương",
  lastStop: "Trạm Long Xuyên",
  guestType: "Rước đường",
  transshipStation: "45 Trường Chinh, Q.12"
});

let seatPlanDown = [
  a1, a2, makeSeat("A3", "empty"), makeSeat("A4", "hold"),
  makeSeat("A5", "sold"), makeSeat("A6", "empty"), makeSeat("A7", "sold"), makeSeat("A8", "free"),
  makeSeat("A9", "empty"), a10, a11, a12,
];
seatPlanDown[2].locked = true; // ví dụ trạng thái khoá tạm thời (BR-05)
seatPlanDown[2].lockedBy = "NV. Hồng";

const b2 = makeSeat("B2", "sold");
const b3 = groupSeat(b2, "B3", "sold");

let seatPlanUp = [
  makeSeat("B1", "empty"), b2, b3, makeSeat("B4", "empty"),
  makeSeat("B5", "sold"), makeSeat("B6", "empty"), makeSeat("B7", "hold"), makeSeat("B8", "hold"),
  makeSeat("B9", "empty"), makeSeat("B10", "sold"), makeSeat("B11", "free"), makeSeat("B12", "empty"),
];

// Danh sách các chuyến (khớp với data-trip trên trip-card ở Zone 1) để có thể
// chuyển ghế của khách sang một chuyến xe khác, không chỉ trong cùng 1 chuyến.
const todayStr = new Date().toISOString().split("T")[0];

function loadAllTrips() {
  const saved = localStorage.getItem(HN_TRIPS_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsed.forEach(t => {
          t.date = todayStr;
        });
        localStorage.setItem(HN_TRIPS_KEY, JSON.stringify(parsed));
        return parsed;
      }
    } catch (e) {
      console.error("Failed to parse trips", e);
    }
  }
  return [...DEFAULT_SGCD_TRIPS, ...DEFAULT_CDSG_TRIPS];
}

let allTripsMeta = loadAllTrips();
let sgcdTripsMeta = allTripsMeta.filter(t => (t.route.includes('Sài Gòn -') || t.route.includes('Sài Gòn →')) && t.status !== 'Đã hủy');
let cdsgTripsMeta = allTripsMeta.filter(t => (t.route.includes('Châu Đốc -') || t.route.includes('Long Xuyên -') || t.route.includes('Cần Thơ -')) && t.status !== 'Đã hủy');

let extraLeftoverSeats = []; // danh sách "ghế dư" khi đổi loại xe làm mất mã ghế đang có khách
let subSeats = []; // danh sách "ghế phụ" tự thêm (chỉ có ghi chú + giá tiền), ô "+" luôn ở cuối danh sách này
let cancelledSeats = []; // danh sách ghế đã hủy của chuyến hiện tại

const savedBank = loadSeatBank();
const tripSeatBank = savedBank || {};
if (!savedBank) {
  tripSeatBank['1'] = {
    down: seatPlanDown,
    up: seatPlanUp,
    plate: '51F-123.45',
    vehicleType: 'Limousine 24 Phòng',
    driver: 'Trần Văn Hùng',
    helper: 'Nguyễn Thị Hương',
    cancelledSeats: []
  };
  allTripsMeta.forEach(t => {
    if (t.id !== '1') {
      const plan = generateTripSeatPlanForVehicleType(t.vehicleType || 'Giường nằm 34 chỗ');
      tripSeatBank[t.id] = {
        down: plan.down,
        up: plan.up,
        plate: t.plate || '50H-678.90',
        vehicleType: t.vehicleType || 'Giường nằm 34 chỗ',
        driver: 'Phạm Quốc Bảo',
        helper: 'Đỗ Văn Sơn',
        cancelledSeats: []
      };
    }
  });
  cancelledSeats = tripSeatBank['1'].cancelledSeats || [];
  saveSeatBank();
} else {
  seatPlanDown = tripSeatBank['1'].down;
  seatPlanUp = tripSeatBank['1'].up;
  extraLeftoverSeats = tripSeatBank['1'].extraSeats || [];
  subSeats = tripSeatBank['1'].subSeats || [];
  cancelledSeats = tripSeatBank['1'].cancelledSeats || [];
}

let currentTripId = '1';
let zone1HourFilter = 'all'; // lọc zone1 theo giờ (dropdown #zone1HourFilter) — khai báo sớm vì renderSeats() gọi renderZone1TripList() ngay khi script vừa nạp

window.addEventListener('storage', (e) => {
  if (e.key === HN_STORAGE_KEY || e.key === HN_TRIPS_KEY) {
    if (e.key === HN_TRIPS_KEY) {
      allTripsMeta = loadAllTrips();
      sgcdTripsMeta = allTripsMeta.filter(t => (t.route.includes('Sài Gòn -') || t.route.includes('Sài Gòn →')) && t.status !== 'Đã hủy');
      cdsgTripsMeta = allTripsMeta.filter(t => (t.route.includes('Châu Đốc -') || t.route.includes('Long Xuyên -') || t.route.includes('Cần Thơ -')) && t.status !== 'Đã hủy');
    }
    const newBank = loadSeatBank();
    if (newBank) {
      isSyncingFromStorage = true;
      Object.keys(newBank).forEach(k => {
        tripSeatBank[k] = newBank[k];
      });
      if (tripSeatBank[currentTripId]) {
        seatPlanDown = tripSeatBank[currentTripId].down;
        seatPlanUp = tripSeatBank[currentTripId].up;
        extraLeftoverSeats = tripSeatBank[currentTripId].extraSeats || [];
        subSeats = tripSeatBank[currentTripId].subSeats || [];
        cancelledSeats = tripSeatBank[currentTripId].cancelledSeats || [];
        updateCancelledTabCount();
        if (document.getElementById('zone3Cancelled') && document.getElementById('zone3Cancelled').style.display !== 'none') {
          renderCancelledListTable();
        }

        // Update header details from bank
        const plateVal = tripSeatBank[currentTripId].plate || '51F-123.45';
        const vehicleType = tripSeatBank[currentTripId].vehicleType || 'Limousine 24 Phòng';
        const driverVal = tripSeatBank[currentTripId].driver || 'Trần Văn Hùng';
        const helperVal = tripSeatBank[currentTripId].helper || 'Nguyễn Thị Hương';

        const headerPlate = document.getElementById('headerPlate');
        if (headerPlate) headerPlate.textContent = plateVal;

        const carTypeEl = document.querySelector('.car-type');
        if (carTypeEl) {
          const svgIcon = carTypeEl.querySelector('svg');
          carTypeEl.innerHTML = '';
          if (svgIcon) carTypeEl.appendChild(svgIcon);
          carTypeEl.appendChild(document.createTextNode(' ' + vehicleType));
        }

        const headerDriver = document.getElementById('headerDriver');
        if (headerDriver) headerDriver.textContent = driverVal;

        const headerHelper = document.getElementById('headerHelper');
        if (headerHelper) headerHelper.textContent = helperVal;
      }
      renderSeats();
      if (document.getElementById('zone3Passengers').style.display !== 'none') renderPassengerList();
      if (document.getElementById('zone3Transship')?.style.display !== 'none') renderTransshipTables();
      renderZone1TripList();
      if (typeof currentView !== 'undefined' && currentView === 'phoi') {
        applyFilters();
      }
      isSyncingFromStorage = false;
    }
  }
});

// Tài xế vừa được gán ở trang shuttle.html (tab khác) -> render lại ngay cột "Tài xế" nếu đang mở tab
// Trung chuyển, không cần tải lại trang.
window.addEventListener('storage', (e) => {
  if (e.key === HN_SHUTTLE_DRIVER_KEY) renderTransshipTables();
});

let multiSelectMode = false;
let selectionMode = null; // 'transfer' | 'group' | null — loại thao tác đang thực hiện
let selectedSourceSeats = [];
let selectedTargetSeats = [];
let transferSourceTripId = null; // chuyến của các ghế nguồn đang chọn để chuyển
let transferTargetTripId = null; // chuyến đang xem để chọn ghế trống làm đích (có thể khác chuyến nguồn)
let transferSourceCancelId = null; // id bản ghi trong cancelledSeats đang chọn để "chuyển ghế" sang phơi khác (thay vì 1 ghế nguồn còn sống)
let currentPanelSeat = null;
let currentPanelSeats = [];
let currentCancelSeat = null;
let currentEditSeatCode = null;
let currentPanelMode = 'booking';

/* ===================== TABS: SƠ ĐỒ GHẾ / HÀNH KHÁCH / GHẾ HỦY ===================== */
function switchTab(tab, el) {
  document.querySelectorAll('.tabs .tab-item').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');

  const seatSection = document.querySelector('.zone3:not(.passenger-view)');
  const paxSection = document.getElementById('zone3Passengers');
  const transSection = document.getElementById('zone3Transship');
  const cancelledSection = document.getElementById('zone3Cancelled');
  const sticky = document.querySelector('.sticky-actions');

  [seatSection, paxSection, transSection, cancelledSection, sticky].forEach(sec => { if (sec) sec.style.display = 'none'; });

  if (tab === 'seatmap') {
    if (seatSection) seatSection.style.display = '';
    updateTransferBarVisibility();
  } else if (tab === 'passengers') {
    if (paxSection) paxSection.style.display = 'flex';
    renderPassengerList();
  } else if (tab === 'transship') {
    if (transSection) transSection.style.display = 'flex';
    if (typeof renderTransshipTables === 'function') renderTransshipTables();
  } else if (tab === 'cancelled') {
    if (cancelledSection) cancelledSection.style.display = 'flex';
    renderCancelledListTable();
  }
}

function renderCancelledListTable() {
  const tbody = document.getElementById('cancelledTableBody');
  const hint = document.getElementById('cancelledResultHint');
  if (!tbody) return;

  updateCancelledTabCount();

  if (!cancelledSeats || cancelledSeats.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:24px; color:#6b7280; font-size:14px;">Chưa có ghế nào bị hủy trong chuyến này</td></tr>`;
    if (hint) hint.textContent = 'Danh sách ghế đã hủy (0 ghế)';
    return;
  }

  if (hint) hint.textContent = `Danh sách ghế đã hủy (${cancelledSeats.length} ghế)`;

  tbody.innerHTML = cancelledSeats.map((item, index) => {
    const firstStopShort = (item.firstStop ? item.firstStop.replace('Trạm ', '').replace('Văn phòng ', 'VP ') : '—');
    const lastStopShort = (item.lastStop ? item.lastStop.replace('Trạm ', '').replace('Văn phòng ', 'VP ') : '—');
    const routeStr = `${firstStopShort} → ${lastStopShort}`;
    const priceStr = item.price ? item.price.toLocaleString('vi-VN') + 'đ' : '—';
    const reasonText = item.reason || 'Không có lý do';
    const timeText = item.cancelTime || '—';

    return `
      <tr>
        <td style="text-align:center; font-weight:600; color:#6b7280;">${index + 1}</td>
        <td><b style="color:var(--red,#C20D08);">${item.code}</b></td>
        <td><b>${item.customerName || '—'}</b></td>
        <td>${item.phone || '—'}</td>
        <td>${routeStr}</td>
        <td style="font-weight:600;">${priceStr}</td>
        <td style="color:#ef4444; font-weight:500;">${reasonText}</td>
        <td style="color:#6b7280; font-size:13px;">${timeText}</td>
      </tr>`;
  }).join('');
}

document.addEventListener('click', function (e) {
  const wrap = document.querySelector('.pax-filter-wrap');
  if (wrap && !wrap.contains(e.target)) document.getElementById('paxFilterDropdown').classList.remove('open');
});

function getAllBookedSeats() {
  return [...seatPlanDown.map(s => ({ ...s, floor: 'down' })), ...seatPlanUp.map(s => ({ ...s, floor: 'up' }))]
    .filter(s => ['sold', 'hold', 'free', 'cargo'].includes(s.state));
}

// Gom các ghế cùng chung 1 mã vé (ticketNo) thành 1 dòng hành khách duy nhất,
// dùng đúng mã ghế thật trên sơ đồ thay vì suy đoán ghế kế tiếp — đảm bảo
// danh sách ghế và danh sách hành khách luôn thống nhất với nhau.
function groupSeatsByTicket(seats) {
  const seen = new Set();
  const groups = [];
  seats.forEach(s => {
    if (seen.has(s.ticketNo)) return;
    seen.add(s.ticketNo);
    const members = seats.filter(x => x.ticketNo === s.ticketNo).sort((a, b) => a.code.localeCompare(b.code));
    groups.push({ main: s, members });
  });
  return groups;
}

function renderPassengerList() {
  const checked = v => document.querySelector(`.pax-filter-opt input[value="${v}"]`).checked;
  const payFilters = ['paid', 'debt'].filter(checked);
  const posFilters = ['down', 'up'].filter(checked);
  const activeCount = payFilters.length + posFilters.length;

  const btnCount = document.getElementById('paxFilterCount');
  if (btnCount) {
    btnCount.style.display = activeCount > 0 ? 'inline-block' : 'none';
    btnCount.textContent = activeCount;
  }

  let seats = getAllBookedSeats();
  if (payFilters.length) seats = seats.filter(s => payFilters.includes(s.paid ? 'paid' : 'debt'));
  if (posFilters.length) seats = seats.filter(s => posFilters.includes(s.floor));

  const groups = groupSeatsByTicket(seats);
  const tbody = document.getElementById('paxTableBody');
  if (tbody) {
    if (!groups.length) {
      tbody.innerHTML = '<tr class="pax-empty-row"><td colspan="11">Không có hành khách phù hợp bộ lọc</td></tr>';
    } else {
      tbody.innerHTML = groups.map((g, index) => {
        const s = g.main;
        const count = g.members.length;
        const codesStr = g.members.map(m => m.code).join(', ');
        // Vé giá 0đ (qua ô "Lý do giá 0đ") cũng tính là vé miễn phí như ghế trạng thái 'free', không
        // riêng gì ghế state==='free' — cả 2 trường hợp đều không có gì để thu/nợ.
        const isFree = s.state === 'free' || s.price === 0;
        const totalPrice = s.price * count;
        // Đã cọc (seat.depositAmount) lưu 1 lần cho cả nhóm vé (không nhân theo count) — xem giải
        // thích ở applyFormToSeat lúc lưu vé. Vé đã "Bán" (paid) thì đã thu đủ, không còn cọc dở dang.
        const daThuAmount = isFree ? 0 : (s.paid ? totalPrice : Math.min(s.depositAmount || 0, totalPrice));
        const conNoAmount = isFree ? 0 : (totalPrice - daThuAmount);
        const daThuText = isFree ? 'Miễn phí' : (daThuAmount > 0 ? daThuAmount.toLocaleString('vi-VN') + 'đ' : '—');
        const conNoText = isFree ? 'Miễn phí' : (conNoAmount > 0 ? conNoAmount.toLocaleString('vi-VN') + 'đ' : '—');
        const payCellClass = isFree ? ' free' : '';
        const { firstStopHtml, lastStopHtml } = getHistoryStopsDisplay(s);

        return `
        <tr data-action="fillSearchInputWithPhone" data-args='${JSON.stringify([s.phone])}' style="cursor:pointer;">
          <td class="mono">${index + 1}</td>
          <td>${s.customerName || '—'}</td>
          <td class="mono">${s.phone}</td>
          <td>${firstStopHtml}</td>
          <td>${lastStopHtml}</td>
          <td class="mono">${count}</td>
          <td>${codesStr}</td>
          <td class="pax-pay-cell${payCellClass}"><div class="pax-pay-amount">${daThuText}</div></td>
          <td class="pax-pay-cell${payCellClass}"><div class="pax-pay-amount">${conNoText}</div></td>
          <td class="pax-luggage-cell"><span class="pax-luggage-mark ${s.hasLuggage ? 'yes' : 'no'}">${s.hasLuggage ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : ''}</span></td>
          <td class="pax-note-cell" title="${seatNoteWithReason(s) || ''}"><span class="pax-note-clamp">${seatNoteWithReason(s) || '—'}</span></td>
        </tr>`;
      }).join('');
    }
  }

  const countBadge = document.getElementById('paxCountBadge');
  if (countBadge) countBadge.textContent = `${groups.length} khách`;
  const hintEl = document.getElementById('paxResultHint');
  if (hintEl) hintEl.textContent = `(${groups.length} vé / ${groupSeatsByTicket(getAllBookedSeats()).length} vé)`;
}

function renderTransshipTables() {
  const pickupBody = document.getElementById('transshipPickupBody');
  const dropoffBody = document.getElementById('transshipDropoffBody');
  const pickupCntEl = document.getElementById('transshipPickupCount');
  const dropoffCntEl = document.getElementById('transshipDropoffCount');
  const tabCntEl = document.getElementById('transshipTabCnt');

  const allBooked = getAllBookedSeats();
  const grouped = groupSeatsByTicket(allBooked);

  // Tài xế trung chuyển được gán ở trang shuttle.html, đọc lại qua HN_SHUTTLE_DRIVER_KEY (khoá theo
  // "sđt_don" — xem shuttleDriverLegKey() bên shuttle.js) để hiện đúng tên thay vì tên giả cố định.
  let shuttleDriverMap = {};
  try {
    const rawDriverMap = localStorage.getItem(HN_SHUTTLE_DRIVER_KEY);
    if (rawDriverMap) shuttleDriverMap = JSON.parse(rawDriverMap);
  } catch (e) { }

  const pickupList = grouped.filter(g => {
    const s = g.main;
    return s.guestType === 'Trung chuyển' || s.guestType === 'Rước liền' || s.guestType === 'Rước đường' || !!s.pickupAddress || !!s.transship;
  });

  const dropoffList = grouped.filter(g => {
    const s = g.main;
    return s.guestType === 'Trung chuyển' || !!s.dropoffAddress || !!s.arrivalTransfer;
  });

  if (pickupCntEl) pickupCntEl.textContent = `${pickupList.length} khách`;
  if (dropoffCntEl) dropoffCntEl.textContent = `${dropoffList.length} khách`;
  if (tabCntEl) tabCntEl.textContent = `(${pickupList.length} | ${dropoffList.length})`;

  if (pickupBody) {
    if (!pickupList.length) {
      pickupBody.innerHTML = '<tr><td colspan="9" class="ts-empty">Không có hành khách cần trung chuyển đón trong chuyến này</td></tr>';
    } else {
      pickupBody.innerHTML = pickupList.map((g, idx) => {
        const item = g.main;
        const driverKey = `${(item.phone || '').replace(/\s+/g, '')}_don`;
        const assignedDriver = shuttleDriverMap[driverKey];
        const driverCellHtml = assignedDriver
          ? `<b title="SĐT: ${assignedDriver.driverPhone || '—'} · Biển số: ${assignedDriver.driverPlate || '—'}${assignedDriver.driverVehicleType ? ' · ' + assignedDriver.driverVehicleType : ''}">${assignedDriver.driverName}</b>`
          : `<span style="color:var(--text-sub); font-style:italic;">Chưa gán tài xế</span>`;
        const pickupLoc = item.pickupAddress || item.transship || item.transshipStation || item.firstStop || '—';
        const seatCodes = g.members ? g.members.map(s => s.code).join(', ') : (item.code || '—');
        const seatCount = g.members ? g.members.length : 1;
        const phone = item.phone || '—';
        const totalPrice = item.price ? (item.price * seatCount).toLocaleString('vi-VN') + 'đ' : '—';
        const note = seatNoteWithReason(item) || '—';
        const statusBadge = item.paid ? '<span class="ts-status-badge ongoing">Đang đón</span>' : '<span class="ts-status-badge pending">Chờ đón</span>';

        return `
          <tr>
            <td>${idx + 1}</td>
            <td>${driverCellHtml}</td>
            <td class="ts-address">${pickupLoc}</td>
            <td><b>${seatCodes}</b> (${seatCount} ghế)</td>
            <td style="font-weight:600;">${item.customerName || 'Khách'}</td>
            <td>${phone}</td>
            <td style="font-weight:700;color:var(--text-main);">${totalPrice}</td>
            <td>${statusBadge}</td>
            <td class="ts-note">${note}</td>
          </tr>`;
      }).join('');
    }
  }

  if (dropoffBody) {
    if (!dropoffList.length) {
      dropoffBody.innerHTML = '<tr><td colspan="8" class="ts-empty">Không có hành khách cần trung chuyển trả trong chuyến này</td></tr>';
    } else {
      dropoffBody.innerHTML = dropoffList.map((g, idx) => {
        const item = g.main;
        const dropoffLoc = item.dropoffAddress || item.arrivalTransfer || item.lastStop || '—';
        const seatCodes = g.members ? g.members.map(s => s.code).join(', ') : (item.code || '—');
        const seatCount = g.members ? g.members.length : 1;
        const phone = item.phone || '—';
        const totalPrice = item.price ? (item.price * seatCount).toLocaleString('vi-VN') + 'đ' : '—';
        const note = seatNoteWithReason(item) || '—';
        const statusBadge = item.paid ? '<span class="ts-status-badge done">Đã trả</span>' : '<span class="ts-status-badge blue">Chờ trả</span>';

        return `
          <tr>
            <td>${idx + 1}</td>
            <td class="ts-address">${dropoffLoc}</td>
            <td><b>${seatCodes}</b> (${seatCount} ghế)</td>
            <td style="font-weight:600;">${item.customerName || 'Khách'}</td>
            <td>${phone}</td>
            <td style="font-weight:700;color:var(--text-main);">${totalPrice}</td>
            <td>${statusBadge}</td>
            <td class="ts-note">${note}</td>
          </tr>`;
      }).join('');
    }
  }
}

// Gom ghế theo ticketNo 1 lần duy nhất cho cả lượt render (renderSeats() gọi 1 lần, truyền map vào
// seatCard() cho từng ghế) thay vì mỗi ghế tự quét lại toàn bộ seatPlanDown+seatPlanUp — tránh O(n²)
// khi xe có nhiều ghế (~44-47 ghế → tới ~2000 lượt so sánh dư thừa mỗi lần render trước khi sửa).
function buildTicketGroupMap() {
  const map = new Map();
  [...seatPlanDown, ...seatPlanUp].forEach(s => {
    if (!s.ticketNo) return;
    if (!map.has(s.ticketNo)) map.set(s.ticketNo, []);
    map.get(s.ticketNo).push(s);
  });
  return map;
}

function seatCard(seat, ticketGroupMap) {
  if (seat.state === 'hidden') {
    return `<div class="seat-card hidden-placeholder"></div>`;
  }
  const stateClass = seat.locked ? "locked" : seat.state;
  const lockHtml = seat.locked ? `<div class="lock-tag"><svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>${seat.lockedBy || 'Đang giữ'}</div>` : "";
  const isEmpty = seat.state === "empty";
  const isCancelable = ["sold", "hold", "free", "cargo"].includes(seat.state);
  const footLabel = isEmpty ? "ĐẶT VÉ" : "KDV - CHÂU ĐỐC";
  const footHoverLabel = seat.state === 'sold' ? "THÔNG TIN" : "CHỈNH SỬA";
  const cancelTag = isCancelable
    ? `<button type="button" class="seat-cancel-tag" data-action="openCancelModal" data-stop-propagation="1" data-args='${JSON.stringify([seat.code])}'>Hủy</button>`
    : "";
  // Vé sửa giá còn 0đ (qua "Lý do giá 0đ") hiện y hệt kiểu ghế 'free' (nền/viền xám, "Miễn phí")
  // dù seat.state thật vẫn là hold/sold/cargo — không đổi seat.state để không ảnh hưởng logic khác
  // (đếm ghế đã bán, filter, thống kê...), chỉ đổi lớp CSS hiển thị cho riêng thẻ ghế này.
  const isFreeDisplay = !isEmpty && !seat.locked && (seat.state === 'free' || seat.price === 0);
  const cardStateClass = isFreeDisplay ? 'free' : stateClass;
  const priceHtml = isEmpty ? `<div class="seat-price-tag"></div>` : (isFreeDisplay ? `<div class="seat-price-tag">Miễn phí</div>` : `<div class="seat-price-tag">${seat.price.toLocaleString('vi-VN')}đ</div>`);
  const depositHtml = (!isEmpty && seat.depositAmount) ? `<div class="seat-deposit-tag" title="Đã cọc ${seat.depositAmount.toLocaleString('vi-VN')}đ (${seat.depositMethod || 'Tiền mặt'})">Cọc: ${seat.depositAmount.toLocaleString('vi-VN')}đ</div>` : '';

  // Group booking badge logic
  let groupLabelHtml = "";
  if (!isEmpty && seat.ticketNo) {
    const groupSeats = (ticketGroupMap || buildTicketGroupMap()).get(seat.ticketNo) || [];
    if (groupSeats.length > 1) {
      const sortedGroup = [...groupSeats].sort((a, b) => a.code.localeCompare(b.code));
      const groupName = sortedGroup.map(s => s.code).join('-');
      groupLabelHtml = `<div class="seat-line" style="margin-bottom:2px;" title="Ghế đi chung: ${groupName}"><span class="group-badge" style="font-size:10.5px; font-weight:800; color:var(--red); background:var(--red-light); padding:1px 5px; border-radius:4px; display:inline-block; border:1px solid rgba(245,16,11,0.25); white-space:nowrap; vertical-align:middle;">C: ${groupName}</span></div>`;
    }
  }

  // Body content depending on booking status
  let linesHtml = "";
  const firstStopShort = shortenStopName(seat.firstStop) || '—';
  const lastStopShort = shortenStopName(seat.lastStop) || '—';
  const routeStr = `${firstStopShort} → ${lastStopShort}`;

  if (isEmpty) {
    linesHtml = `
      <div class="seat-line route-single-line"><span class="seat-label-full">Chặng đi: </span><span class="seat-stop" title="—">—</span></div>
      <div class="route-split-line">
        <div class="route-split-row"><span class="route-split-label">Đi:</span><span class="seat-stop" title="—">—</span></div>
        <div class="route-split-row"><span class="route-split-label">Đến:</span><span class="seat-stop" title="—">—</span></div>
      </div>
      <div class="seat-line" style="color:var(--black);">KH: —</div>
      <div class="seat-line" style="color:var(--black);">SĐT: —</div>
      <div class="seat-note" title="${seat.note || ''}"><span class="seat-label-full">Ghi chú: </span><span class="seat-label-short">GC: </span>${seat.note || '—'}</div>
    `;
  } else {
    const displayNote = seatNoteWithReason(seat);
    const pickupTransferAddr = seat.transshipStation ? seat.transshipStation : '';
    const dropoffTransferAddr = seat.arrivalTransfer ? seat.arrivalTransfer : '';
    const firstTitle = pickupTransferAddr ? `Trung chuyển đón: ${pickupTransferAddr}` : firstStopShort;
    const lastTitle = dropoffTransferAddr ? `Trung chuyển trả: ${dropoffTransferAddr}` : lastStopShort;
    const routeTitle = (pickupTransferAddr || dropoffTransferAddr)
      ? `Đón: ${pickupTransferAddr || firstStopShort} • Trả: ${dropoffTransferAddr || lastStopShort}`
      : routeStr;
    linesHtml = `
      ${groupLabelHtml}
      <div class="seat-line route-single-line"><span class="seat-label-full">Chặng đi: </span><span class="seat-stop" title="${routeTitle}">${routeStr}</span></div>
      <div class="route-split-line">
        <div class="route-split-row"><span class="route-split-label">Đi:</span><span class="seat-stop" title="${firstTitle}">${firstStopShort}</span></div>
        <div class="route-split-row"><span class="route-split-label">Đến:</span><span class="seat-stop" title="${lastTitle}">${lastStopShort}</span></div>
      </div>
      <div class="seat-line" style="color:var(--black);">KH: ${seat.customerName || '—'}</div>
      <div class="seat-line" style="color:var(--black);">SĐT: ${seat.phone || '—'}</div>
      <div class="seat-note" title="${displayNote}"><span class="seat-label-full">Ghi chú: </span><span class="seat-label-short">GC: </span>${displayNote || '—'}</div>
    `;
  }

  return `
  <div class="seat-card ${cardStateClass}" data-code="${seat.code}" data-action="onSeatClick" data-args='${JSON.stringify(["__event__", seat.code])}'>
    ${lockHtml}
    <div class="seat-top">
      <div>
        <div class="seat-code" style="display:inline-block; vertical-align:middle;">${seat.code}</div>${isEmpty ? '' : guestTypeTagHtml(seat.guestType)}
      </div>
      <div class="seat-top-right">${depositHtml}${priceHtml}${cancelTag}</div>
    </div>
    ${linesHtml}
    <button class="seat-footbtn" type="button" data-action="seatFootBtnClick" data-stop-propagation="1" data-seat-code="${seat.code}" data-edit-mode="${isEmpty ? '0' : '1'}"><span class="foot-text-normal">${footLabel}</span><span class="foot-text-hover">${footHoverLabel}</span></button>
  </div>`;
}

function renderSeats() {
  const totalSeats = [...seatPlanDown, ...seatPlanUp].filter(s => s.state !== 'hidden').length;
  const useThreeCols = totalSeats >= 34;

  const floorDownEl = document.getElementById('floorDown');
  const floorUpEl = document.getElementById('floorUp');
  const ticketGroupMap = buildTicketGroupMap();

  if (floorDownEl) {
    floorDownEl.classList.toggle('cols-3', useThreeCols);
    floorDownEl.innerHTML = seatPlanDown.map(s => seatCard(s, ticketGroupMap)).join('');
  }
  if (floorUpEl) {
    floorUpEl.classList.toggle('cols-3', useThreeCols);
    floorUpEl.innerHTML = seatPlanUp.map(s => seatCard(s, ticketGroupMap)).join('');
  }

  updatePassengerTabCount();
  updateTripStats();
  renderSubSeats();
  renderCancelledSeats();
  renderZone1TripList();

  if (typeof isSyncingFromStorage !== 'undefined' && !isSyncingFromStorage) {
    saveSeatBank();
  }
}

function updateTripStats() {
  const totalSeats = [...seatPlanDown, ...seatPlanUp].filter(s => s.state !== 'hidden').length + subSeats.length;

  // Calculate booked seats
  const bookedSeats = [...seatPlanDown, ...seatPlanUp].filter(s => ['sold', 'hold', 'free', 'cargo'].includes(s.state)).concat(subSeats);
  const soldSeats = bookedSeats.filter(s => s.state === 'sold' || s.state === 'sub');

  // Calculate revenue
  let totalRevenue = 0;
  let paidRevenue = 0;
  let unpaidRevenue = 0;

  bookedSeats.forEach(s => {
    if (s.state === 'free') return;
    const price = s.price || 280000;
    totalRevenue += price;
    if (s.paid) {
      paidRevenue += price;
    } else {
      // Vé chưa "Bán" nhưng có cọc (seat.depositAmount) thì tính đúng phần đã thu là số tiền cọc,
      // phần còn lại (giá vé - cọc) mới là chưa thu — không tính cả giá vé là chưa thu như trước.
      const deposit = Math.min(s.depositAmount || 0, price);
      paidRevenue += deposit;
      unpaidRevenue += price - deposit;
    }
  });

  // Format numbers
  const formatMoney = (val) => val.toLocaleString('vi-VN') + 'đ';

  // Update DOM elements
  const elDaBan = document.getElementById('statsDaBan');
  if (elDaBan) elDaBan.textContent = `${soldSeats.length}/${totalSeats}`;

  const elDaDat = document.getElementById('statsDaDat');
  if (elDaDat) elDaDat.textContent = `${bookedSeats.length}/${totalSeats}`;

  const elTongTien = document.getElementById('statsTongTien');
  if (elTongTien) elTongTien.textContent = formatMoney(totalRevenue);

  const elDaThu = document.getElementById('statsDaThu');
  if (elDaThu) elDaThu.textContent = formatMoney(paidRevenue);

  const elChuaThu = document.getElementById('statsChuaThu');
  if (elChuaThu) elChuaThu.textContent = formatMoney(unpaidRevenue);

  // Update selected trip card in sidebar
  const selectedTripCard = document.querySelector('.trip-card.selected');
  if (selectedTripCard) {
    const numEl = selectedTripCard.querySelector('.trip-nums .n1');
    if (numEl) {
      numEl.textContent = `${bookedSeats.length}/${totalSeats}`;
    }
  }
}

function renderZone1TripList() {
  const sgcdWrap = document.getElementById('tripListSGCD');
  const cdsgWrap = document.getElementById('tripListCDSG');
  if (!sgcdWrap || !cdsgWrap) return;

  const mapTrip = t => {
    const plan = tripSeatBank[t.id];
    const totalSeats = plan ? plan.down.filter(s => s.state !== 'hidden').length + plan.up.filter(s => s.state !== 'hidden').length : 24;
    const subSeatsCount = plan && plan.subSeats ? plan.subSeats.length : 0;
    const bookedSeats = plan ? [...plan.down, ...plan.up].filter(s => ['sold', 'hold', 'free', 'cargo'].includes(s.state)).length + subSeatsCount : 0;
    const selected = t.id === currentTripId ? 'selected' : '';
    const plate = plan && plan.plate ? plan.plate : (t.plate || 'Chưa có');
    const vehicleType = plan && plan.vehicleType ? plan.vehicleType : (t.vehicleType || 'Chưa rõ');
    const isLimo = vehicleType.toLowerCase().includes('limousine') || vehicleType.toLowerCase().includes('limo');
    const seatTagClass = isLimo ? 'tag-limo' : 'tag-normal';
    const displayTripName = t.name || `${t.route} (${t.time})`;
    const tooltipText = `Tên phơi: ${displayTripName}\nBiển số: ${plate}\nLoại xe: ${vehicleType}${t.note ? '\nGhi chú: ' + t.note : ''}`;

    return `
      <div class="trip-card ${selected}" data-trip="${t.id}" data-action="selectTrip" data-args='${JSON.stringify(["__this__", t.time, t.route])}' title="${tooltipText}">
        <div class="trip-card-row1">
          <div class="trip-info-left">
            <span class="trip-time">${t.time}</span>
            <span class="trip-plate-inline">${plate}</span>
          </div>
          <div class="trip-seat-tag ${seatTagClass}">${bookedSeats}/${totalSeats + subSeatsCount}</div>
        </div>
        <div class="trip-card-row2">
          <span class="trip-name-text">${displayTripName}</span>
        </div>
      </div>
    `;
  };

  const matchesHourFilter = t => zone1HourFilter === 'all' || parseInt((t.time || '').split(':')[0], 10) === parseInt(zone1HourFilter, 10);

  sgcdWrap.innerHTML = sgcdTripsMeta.filter(matchesHourFilter).map(mapTrip).join('');
  cdsgWrap.innerHTML = cdsgTripsMeta.filter(matchesHourFilter).map(mapTrip).join('');
}

/* ===================== GHẾ PHỤ (chỉ ghi chú + giá tiền) ===================== */

let editingSubSeatCode = null;

function saveSubSeat() {
  const note = document.getElementById('subSeatNote').value.trim();

  if (editingSubSeatCode) {
    const seat = subSeats.find(s => s.code === editingSubSeatCode);
    if (seat) {
      seat.note = note;
    }
  } else {
    subSeats.push({
      code: nextSubSeatCode(),
      state: 'sub',
      note,
      price: DEFAULT_SUB_SEAT_PRICE,
      paid: true
    });
  }

  if (tripSeatBank[currentTripId]) tripSeatBank[currentTripId].subSeats = subSeats;
  saveSeatBank();
  renderSubSeats();
  updateTripStats();
  updatePassengerTabCount();
  closeModal('subSeatModal');
  showToast(editingSubSeatCode ? 'Đã cập nhật ghế phụ' : 'Đã thêm ghế phụ');
}

renderSeats();

function setZone1Collapsed(collapsed) {
  document.body.classList.toggle('zone1-collapsed', collapsed);
  const btn = document.getElementById('zone1ToggleBtn');
  if (btn) {
    const label = collapsed ? 'Hiện zone 1' : 'Ẩn zone 1';
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
  }
  try { localStorage.setItem(ZONE1_COLLAPSED_KEY, collapsed ? '1' : '0'); } catch (e) { }
}

function toggleZone2Grid() {
  const zone2 = document.querySelector('.zone2');
  const btn = document.querySelector('.z2-collapse-btn');
  if (!zone2 || !btn) return;
  const text = btn.querySelector('.collapse-text');
  const svg = btn.querySelector('svg');

  const isCollapsed = zone2.classList.toggle('collapsed');
  if (isCollapsed) {
    if (text) text.textContent = 'Mở rộng';
    btn.title = 'Mở rộng thông tin xe';
    if (svg) svg.style.transform = 'rotate(180deg)';
  } else {
    if (text) text.textContent = 'Thu gọn';
    btn.title = 'Thu gọn thông tin xe';
    if (svg) svg.style.transform = 'none';
  }
}

try {
  setZone1Collapsed(localStorage.getItem(ZONE1_COLLAPSED_KEY) === '1');
} catch (e) { }

function onSeatClick(ev, code) {
  if (ev.detail > 1) { return; }
  const seat = findSeat(code);
  if (seat && seat.phone) {
    fillSearchInputWithPhone(seat.phone);
  }
  if (seat.locked) { showToast(`Ghế ${code} đang được ${seat.lockedBy} thao tác`); return; }

  if (!multiSelectMode && OCCUPIED_STATES.includes(seat.state)) {
    multiSelectMode = true;
    selectionMode = 'transfer';
    selectedSourceSeats = [seat.code];
    selectedTargetSeats = [];
    transferSourceTripId = currentTripId;
    transferTargetTripId = currentTripId;
    document.querySelectorAll('.seat-card').forEach(c => { c.style.outline = 'none'; });
    const card = ev.target.closest('.seat-card');
    card.style.outline = '2px solid var(--red)';
    card.style.outlineOffset = '1px';
    card.style.boxShadow = 'none';
    updateTransferHint();
    showToast(`Đã kích hoạt chọn ghế từ ${seat.code}. Có thể chọn chuyến khác ở Zone 1 để chuyển sang.`);
    ev.stopPropagation();
    return;
  }

  if (!multiSelectMode && seat.state === 'empty') {
    multiSelectMode = true;
    selectionMode = 'group';
    selectedSourceSeats = [];
    selectedTargetSeats = [seat.code];
    document.querySelectorAll('.seat-card').forEach(c => { c.style.outline = 'none'; c.style.boxShadow = 'none'; });
    const card = ev.target.closest('.seat-card');
    card.style.outline = '2px solid var(--red)';
    card.style.outlineOffset = '1px';
    card.style.boxShadow = 'none';
    updateTransferHint();
    showToast(`Đã kích hoạt đặt vé nhóm từ ghế ${seat.code}`);
    ev.stopPropagation();
    return;
  }

  if (multiSelectMode) {
    const card = ev.target.closest('.seat-card');
    if (selectionMode === 'transfer' && OCCUPIED_STATES.includes(seat.state)) {
      if (currentTripId !== transferSourceTripId) {
        showToast('Vui lòng quay lại chuyến ban đầu để chọn thêm ghế nguồn');
        return;
      }
      const idx = selectedSourceSeats.indexOf(code);
      if (idx > -1) { selectedSourceSeats.splice(idx, 1); card.style.outline = 'none'; card.style.boxShadow = 'none'; }
      else { selectedSourceSeats.push(code); card.style.outline = '2px solid var(--red)'; card.style.outlineOffset = '1px'; card.style.boxShadow = 'none'; }
      if (selectedSourceSeats.length === 0 && selectedTargetSeats.length === 0) { exitMultiSelectMode(); return; }
      updateTransferHint();
      return;
    }

    if (seat.state === 'empty') {
      const idx = selectedTargetSeats.indexOf(code);
      if (idx > -1) { selectedTargetSeats.splice(idx, 1); card.style.outline = 'none'; card.style.boxShadow = 'none'; }
      else { selectedTargetSeats.push(code); card.style.outline = '2px solid var(--red)'; card.style.outlineOffset = '1px'; card.style.boxShadow = 'none'; }
      if (selectedSourceSeats.length === 0 && selectedTargetSeats.length === 0) { exitMultiSelectMode(); return; }
      updateTransferHint();
      return;
    }

    showToast('Chỉ có thể chọn ghế đã đặt làm nguồn và ghế trống làm đích');
    return;
  }

  if (seat.state === 'empty') {
    openBookingPanel([seat]);
  } else {
    openSeatMenu(ev, seat);
  }
}

function onSeatDoubleClick(ev, code) {
  const seat = findSeat(code);
  if (!seat || seat.locked) { return; }
  if (!OCCUPIED_STATES.includes(seat.state)) return;
  openBookingPanel([seat], { mode: 'edit' });
  ev.stopPropagation();
}

/* ---- Seat context menu (Hủy vé / Chuyển vé) ---- */
document.addEventListener('click', (e) => {
  if (!e.target.closest('#seatMenu') && !e.target.closest('.seat-card')) closeSeatMenu();
});

function confirmTransfer() {
  if (!multiSelectMode || selectedSourceSeats.length === 0 || selectedTargetSeats.length === 0) {
    showToast('Vui lòng chọn ít nhất 1 ghế đã đặt và 1 ghế trống');
    return;
  }

  const pairCount = Math.min(selectedSourceSeats.length, selectedTargetSeats.length);
  if (pairCount === 0) { showToast('Vui lòng chọn ít nhất 1 ghế trống để chuyển'); return; }
  const sourceTripId = transferSourceTripId || currentTripId;
  const targetTripId = transferTargetTripId || currentTripId;

  for (let i = 0; i < pairCount; i++) {
    const sourceCode = selectedSourceSeats[i];
    const targetCode = selectedTargetSeats[i];
    const sourceSeat = findSeatInTrip(sourceTripId, sourceCode);
    const targetSeat = findSeatInTrip(targetTripId, targetCode);
    if (!sourceSeat || !OCCUPIED_STATES.includes(sourceSeat.state) || !targetSeat || targetSeat.state !== 'empty') continue;

    const sourceState = sourceSeat.state;
    targetSeat.state = sourceState;
    targetSeat.firstStop = sourceSeat.firstStop;
    targetSeat.lastStop = sourceSeat.lastStop;
    targetSeat.phone = sourceSeat.phone;
    targetSeat.note = sourceSeat.note;
    targetSeat.customerName = sourceSeat.customerName;
    targetSeat.pickupTime = sourceSeat.pickupTime;
    targetSeat.ticketNo = sourceSeat.ticketNo;
    targetSeat.paid = sourceSeat.paid;
    targetSeat.count = sourceSeat.count;
    targetSeat.hasLuggage = sourceSeat.hasLuggage;
    targetSeat.luggageNote = sourceSeat.luggageNote;
    targetSeat.guestType = sourceSeat.guestType;
    targetSeat.transshipStation = sourceSeat.transshipStation;
    targetSeat.arrivalTransfer = sourceSeat.arrivalTransfer;
    targetSeat.price = sourceSeat.price;
    targetSeat.zeroPriceReason = sourceSeat.zeroPriceReason;
    targetSeat.depositAmount = sourceSeat.depositAmount;
    targetSeat.depositMethod = sourceSeat.depositMethod;
    targetSeat.paymentMethod = sourceSeat.paymentMethod;

    // Ghế dư không phải "mã ghế thật" của xe hiện tại (đã mất khi đổi loại xe) — chuyển đi xong thì
    // phải XOÁ khỏi extraLeftoverSeats hẳn, không thể clearSeatToEmpty() như ghế thường (sẽ để lại
    // 1 dòng "ghế dư trống" vô nghĩa trong danh sách).
    const extraIdx = extraLeftoverSeats.indexOf(sourceSeat);
    if (extraIdx > -1) {
      extraLeftoverSeats.splice(extraIdx, 1);
    } else {
      clearSeatToEmpty(sourceSeat);
    }
  }

  renderSeats();
  if (document.getElementById('zone3Passengers').style.display !== 'none') renderPassengerList();
  exitMultiSelectMode();
  showToast(`Đã chuyển ${pairCount} ghế thành công`);
}

/* ---- Modal hủy vé (BR-01) ---- */
function openCancelModal(code) {
  if (blockIfMultiSelectActive()) return;
  currentCancelSeat = code;
  document.getElementById('cancelSeatCode').textContent = code;
  document.getElementById('cancelReason').value = '';
  document.getElementById('confirmCancelBtn').disabled = true;
  document.getElementById('cancelModal').classList.add('open');
}
function checkCancelReason() {
  const val = document.getElementById('cancelReason').value.trim();
  document.getElementById('confirmCancelBtn').disabled = val.length === 0;
}
/* Đưa ghế về trạng thái trống hoàn toàn — không giữ lại bất kỳ thông tin khách nào */
function clearSeatToEmpty(seat) {
  seat.state = 'empty';
  seat.count = 1;
  seat.customerName = null;
  seat.phone = null;
  seat.firstStop = null;
  seat.lastStop = null;
  seat.note = null;
  seat.staff = null;
  seat.callState = null;
  seat.pickupTime = null;
  seat.ticketNo = null;
  seat.paid = false;
  seat.hasLuggage = false;
  seat.guestType = null;
  seat.transshipStation = null;
  seat.arrivalTransfer = null;
  seat.zeroPriceReason = null;
  seat.luggageNote = null;
}

function confirmCancel() {
  const code = currentCancelSeat;
  if (!code) return;
  const reasonEl = document.getElementById('cancelReason');
  const reason = reasonEl ? reasonEl.value.trim() : '';
  if (!reason) return;

  const seat = findSeat(code);
  if (!seat) return;

  const nowStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN');

  const cancelledRecord = {
    id: 'CANCEL_' + Date.now(),
    code: seat.code,
    customerName: seat.customerName || 'Khách vảng lai',
    phone: seat.phone || '—',
    firstStop: seat.firstStop || 'Kinh Dương Vương',
    lastStop: seat.lastStop || 'Châu Đốc',
    price: seat.price || 280000,
    reason: reason,
    cancelTime: nowStr,
    ticketNo: seat.ticketNo || '—',
    note: seatNoteWithReason(seat) || ''
  };

  if (!cancelledSeats) cancelledSeats = [];
  cancelledSeats.unshift(cancelledRecord);

  if (tripSeatBank[currentTripId]) {
    tripSeatBank[currentTripId].cancelledSeats = cancelledSeats;
  }

  // Reset trạng thái ghế về trống
  clearSeatToEmpty(seat);

  saveSeatBank();
  closeModal('cancelModal');
  renderSeats();
  updateCancelledTabCount();
  if (document.getElementById('zone3Cancelled') && document.getElementById('zone3Cancelled').style.display !== 'none') {
    renderCancelledListTable();
  }
  updateTripStats();
  updatePassengerTabCount();
  showToast(`Đã hủy ghế ${seat.code}. Lý do: ${reason}`);
}

/* Trạm đi và địa điểm rước thay đổi theo loại khách:
   - Khách trạm: dropdown chọn trạm đi, mặc định là trạm của nhân viên đang thao tác
     nhưng vẫn có thể chọn trạm đi khác trong danh sách.
   - Trung chuyển: có thêm ô nhập nơi trung chuyển (bắt buộc).
   - Rước đường: trạm đi vẫn là dropdown, còn địa điểm rước là dropdown danh sách điểm rước. */

function refreshTicket() {
  const type = document.getElementById('f_type').value;
  document.getElementById('t_name').textContent = document.getElementById('f_name').value || '—';
  document.getElementById('t_phone').textContent = collectPhoneValues('f_phone', 'f_phone_extra') || '—';
  document.getElementById('t_station').textContent = getStationValue() || '—';
  document.getElementById('t_destination').textContent = document.getElementById('f_destination').value || '—';
  // Ghi chú trên vé mẫu ghép hiển thị lý do giá 0đ (nếu có) đứng trước ghi chú thật — chỉ để xem
  // trước, không ghi ngược vào f_note (giữ tách riêng, xem applyFormToSeat lúc lưu).
  const noteFieldVal = document.getElementById('f_note').value.trim();
  const zeroReasonFieldVal = getEditedPrice() === 0 ? document.getElementById('f_zero_price_reason').value.trim() : '';
  const ticketNoteDisplay = zeroReasonFieldVal ? (noteFieldVal ? `${zeroReasonFieldVal} — ${noteFieldVal}` : zeroReasonFieldVal) : noteFieldVal;
  document.getElementById('t_note').textContent = ticketNoteDisplay || '—';

  const transshipLabel = document.getElementById('t_transship_label');
  const transshipRow = document.getElementById('t_transship_row');
  const transshipVal = type === 'Rước đường'
    ? document.getElementById('f_transship_select').value.trim()
    : document.getElementById('f_transship').value.trim();

  const isTransshipLike = (type === 'Trung chuyển');
  if (isTransshipLike && transshipVal) {
    transshipLabel.textContent = 'TC đi';
    transshipRow.style.display = 'flex';
    document.getElementById('t_transship').textContent = transshipVal;
  } else if (type === 'Rước đường' && transshipVal) {
    transshipLabel.textContent = 'Địa điểm rước';
    transshipRow.style.display = 'flex';
    document.getElementById('t_transship').textContent = transshipVal;
  } else {
    transshipRow.style.display = 'none';
  }

  const arrivalVal = document.getElementById('f_arrival_transfer').value.trim();
  const arrivalRow = document.getElementById('t_arrival_transfer_row');
  if (arrivalVal) {
    arrivalRow.style.display = 'flex';
    document.getElementById('t_arrival_transfer').textContent = arrivalVal;
  } else {
    arrivalRow.style.display = 'none';
  }

  const luggageChecked = document.getElementById('f_luggage').checked;
  document.getElementById('t_luggage_row').style.display = luggageChecked ? 'flex' : 'none';
  document.getElementById('f_luggage_note_row').style.display = luggageChecked ? '' : 'none';
  const luggageNoteVal = document.getElementById('f_luggage_note').value.trim();
  document.getElementById('t_luggage_val').textContent = luggageNoteVal ? `Có — ${luggageNoteVal}` : 'Có';

  const depositEnabled = document.getElementById('f_deposit_enabled').checked;
  const depositRow = document.getElementById('t_deposit_row');
  const depositAmount = parseInt(document.getElementById('f_deposit_amount').value, 10) || 0;
  if (depositEnabled && depositAmount > 0) {
    const depositMethod = document.querySelector('input[name="f_deposit_method"]:checked')?.value || 'Tiền mặt';
    depositRow.style.display = 'flex';
    document.getElementById('t_deposit').textContent = `${depositAmount.toLocaleString('vi-VN')}đ (${depositMethod})`;
  } else {
    depositRow.style.display = 'none';
  }
}

// Tick "Đặt cọc" -> mở ngay modal nhập số tiền + phương thức. Bỏ tick -> tắt cọc, xoá số tiền đã gõ
// để lần tick lại sau không giữ số cũ gây nhầm.
function onDepositToggle() {
  const checked = document.getElementById('f_deposit_enabled').checked;
  if (checked) {
    openDepositModal();
  } else {
    document.getElementById('f_deposit_amount').value = '';
    refreshTicket();
  }
}

function openDepositModal() {
  document.getElementById('f_deposit_amount').focus();
  document.getElementById('depositModal').classList.add('open');
}

// "Xác nhận" trong modal — bắt buộc phải có số tiền cọc > 0 mới cho đóng modal.
function closeDepositModal() {
  const amount = parseInt(document.getElementById('f_deposit_amount').value, 10) || 0;
  if (amount <= 0) {
    showToast('Vui lòng nhập số tiền cọc');
    return;
  }
  document.getElementById('depositModal').classList.remove('open');
  refreshTicket();
}

// "Hủy" trong modal — huỷ luôn việc đặt cọc, bỏ tick checkbox lại.
function cancelDepositModal() {
  document.getElementById('depositModal').classList.remove('open');
  document.getElementById('f_deposit_enabled').checked = false;
  document.getElementById('f_deposit_amount').value = '';
  refreshTicket();
}

function onPriceEdit() {
  const el = document.getElementById('t_price');
  const num = parseInt(el.textContent.replace(/[^0-9]/g, '')) || 0;
  el.textContent = num.toLocaleString('vi-VN') + 'đ';
  updateZeroPriceReasonVisibility();
}

function getEditedPrice() {
  const el = document.getElementById('t_price');
  if (!el) return 280000;
  // Không dùng "|| 280000": giá 0đ (miễn phí, có lý do) là giá trị hợp lệ, không phải giá trị thiếu.
  const num = parseInt(el.textContent.replace(/[^0-9]/g, ''), 10);
  return Number.isNaN(num) ? 280000 : num;
}

// Số tiền cọc nhập ở form là TỔNG cho cả vé (ticketNo), nhưng khi sửa từ nút "Sửa" trên 1 ghế, panel
// chỉ nhận đúng 1 ghế đó (không phải cả nhóm) — nếu không đồng bộ, ghế còn lại cùng vé vẫn giữ
// depositAmount cũ, khiến cột "Đã thu"/"Còn nợ" (đọc từ ghế đại diện đầu nhóm, xem groupSeatsByTicket)
// hiện sai/không đổi khi sửa đúng ghế không phải ghế đại diện đó.
function syncDepositToTicketGroup(seat) {
  if (!seat.ticketNo) return;
  [...seatPlanDown, ...seatPlanUp, ...extraLeftoverSeats].forEach(s => {
    if (s !== seat && s.ticketNo === seat.ticketNo) {
      s.depositAmount = seat.depositAmount;
      s.depositMethod = seat.depositMethod;
    }
  });
}

function saveTicket() {
  const type = document.getElementById('f_type').value;

  if (type === 'Trung chuyển' && !document.getElementById('f_transship').value.trim()) {
    showToast('Vui lòng nhập trạm trung chuyển');
    return;
  }
  if (type === 'Rước đường' && !document.getElementById('f_transship_select').value.trim()) {
    showToast('Vui lòng chọn địa điểm rước');
    return;
  }
  if (type === 'Rước đường' && !getStationValue().trim()) {
    showToast('Vui lòng chọn trạm đi cho khách rước đường');
    return;
  }
  if (!document.getElementById('f_destination').value.trim()) {
    showToast('Vui lòng chọn trạm đến');
    return;
  }

  const editedPrice = getEditedPrice();
  if (editedPrice === 0 && !document.getElementById('f_zero_price_reason').value.trim()) {
    showToast('Vui lòng nhập lý do khi giá vé 0đ');
    return;
  }
  const depositEnabled = document.getElementById('f_deposit_enabled').checked;
  const depositAmountRaw = parseInt(document.getElementById('f_deposit_amount').value, 10) || 0;
  if (depositEnabled && depositAmountRaw <= 0) {
    showToast('Vui lòng nhập số tiền cọc');
    return;
  }
  if (depositEnabled && depositAmountRaw > editedPrice) {
    showToast('Số tiền cọc không được lớn hơn giá vé');
    return;
  }

  const applyFormToSeat = (seat) => {
    seat.customerName = document.getElementById('f_name').value.trim();
    seat.phone = collectPhoneValues('f_phone', 'f_phone_extra');
    seat.guestType = type;
    seat.firstStop = getStationValue().trim() || seat.firstStop;
    seat.lastStop = document.getElementById('f_destination').value.trim() || seat.lastStop;
    seat.transshipStation = type === 'Rước đường'
      ? document.getElementById('f_transship_select').value.trim()
      : document.getElementById('f_transship').value.trim();
    seat.arrivalTransfer = document.getElementById('f_arrival_transfer').value.trim();
    seat.hasLuggage = document.getElementById('f_luggage').checked;
    seat.luggageNote = seat.hasLuggage ? document.getElementById('f_luggage_note').value.trim() : '';
    seat.price = editedPrice;
    // Ghi chú giữ nguyên đúng những gì gõ ở ô "Ghi chú" — lý do giá 0đ lưu riêng ở zeroPriceReason,
    // chỉ ghép hiển thị chung lúc render (seatNoteWithReason) chứ không ghi đè vào note thật.
    seat.note = document.getElementById('f_note').value.trim();
    seat.zeroPriceReason = editedPrice === 0 ? document.getElementById('f_zero_price_reason').value.trim() : '';
    seat.depositAmount = depositEnabled ? depositAmountRaw : 0;
    seat.depositMethod = depositEnabled ? (document.querySelector('input[name="f_deposit_method"]:checked')?.value || 'Tiền mặt') : '';
  };

  const seatsTarget = currentPanelSeats.length ? currentPanelSeats : (currentPanelSeat ? [currentPanelSeat] : []);

  if (currentPanelMode === 'edit' && currentPanelSeat) {
    const seat = currentPanelSeat;
    applyFormToSeat(seat);
    syncDepositToTicketGroup(seat);
    renderSeats();
    if (document.getElementById('zone3Passengers').style.display !== 'none') renderPassengerList();
    closePanel();
    showToast(`Đã cập nhật thông tin ghế ${seat.code}`);
    return;
  }
  if (currentPanelSeats.length) {
    const groupTicketNo = "SGCD-" + String(ticketSeq++).padStart(4, '0');
    currentPanelSeats.forEach(seat => {
      applyFormToSeat(seat);
      seat.ticketNo = groupTicketNo;
      seat.paid = false;
      seat.count = currentPanelSeats.length;
      // Ghế có baga vẫn ghi seat.hasLuggage bình thường, không còn chuyển sang state 'cargo' riêng
      // (đã bỏ loại ghế màu xanh biển trên sơ đồ) — luôn giữ 'hold' như ghế đặt thường.
      seat.state = 'hold';
    });
    renderSeats();
    if (document.getElementById('zone3Passengers').style.display !== 'none') renderPassengerList();
  }
  closePanel();
  showToast(currentPanelSeats.length > 1 ? 'Đã đặt vé nhóm thành công' : 'Đã đặt vé thành công');
  if (multiSelectMode) exitMultiSelectMode();
}

/* ---- Modal thông tin khách rước ---- */
function refreshPickupPrice() {
  const station = document.getElementById('pickupStation').value.trim();
  const destination = document.getElementById('pickupDestination').value.trim();
  const priceRow = document.getElementById('pickupPriceRow');
  const priceVal = document.getElementById('pickupPriceValue');
  if (station && destination) {
    const basePrice = 280000;
    priceVal.textContent = basePrice.toLocaleString('vi-VN') + 'đ';
    priceRow.style.display = 'flex';
  } else {
    priceRow.style.display = 'none';
    priceVal.textContent = '—';
  }
}
function refreshPickupPreview() {
  document.getElementById('pickupPreviewName').textContent = document.getElementById('pickupCustomerName').value.trim() || '—';
  document.getElementById('pickupPreviewPhone').textContent = collectPhoneValues('pickupPhone', 'pickup_phone_extra') || '—';
  const countVal = parseInt(document.getElementById('pickupTicketCount').value) || 1;
  document.getElementById('pickupPreviewCount').textContent = countVal + ' vé';
  document.getElementById('pickupPreviewStation').textContent = document.getElementById('pickupStation').value.trim() || '—';
  document.getElementById('pickupPreviewAddress').textContent = document.getElementById('pickupAddress').value.trim() || '—';
  document.getElementById('pickupPreviewDestination').textContent = document.getElementById('pickupDestination').value.trim() || '—';
  document.getElementById('pickupPreviewTrip').textContent = document.getElementById('pickupTrip').value.trim() || '—';
  document.getElementById('pickupPreviewNote').textContent = document.getElementById('pickupNote').value.trim() || '—';
  const luggageRow = document.getElementById('pickupPreviewLuggage');
  if (luggageRow) { luggageRow.style.display = document.getElementById('pickupLuggage').checked ? 'flex' : 'none'; }
  refreshPickupPrice();
}
function openPickupModal() {
  const modal = document.getElementById('pickupModal');
  const tripEl = document.getElementById('tripTitle');
  const tripInput = document.getElementById('pickupTrip');
  if (tripEl && tripInput) { tripInput.value = tripEl.textContent.trim(); }
  document.getElementById('pickupCustomerName').value = '';
  document.getElementById('pickupPhone').value = '';
  renderExtraPhoneFields('pickup_phone_extra', [], 'refreshPickupPreview');
  document.getElementById('pickupTicketCount').value = '1';
  document.getElementById('pickupStation').value = '';
  document.getElementById('pickupAddress').value = '';
  document.getElementById('pickupDestination').value = '';
  document.getElementById('pickupTrip').value = '';
  document.getElementById('pickupNote').value = '';
  document.getElementById('pickupLuggage').checked = false;
  refreshPickupPreview();
  modal.classList.add('open');
}
function savePickupInfo() {
  const name = document.getElementById('pickupCustomerName').value.trim();
  const phone = collectPhoneValues('pickupPhone', 'pickup_phone_extra');
  const count = parseInt(document.getElementById('pickupTicketCount').value) || 1;
  const station = document.getElementById('pickupStation').value.trim() || 'Trạm Kinh Dương Vương';
  const address = document.getElementById('pickupAddress').value.trim() || '—';
  const destination = document.getElementById('pickupDestination').value.trim() || 'Trạm Châu Đốc';
  const destinationTransfer = document.getElementById('pickupTrip') ? document.getElementById('pickupTrip').value.trim() || '—' : '—';
  const tripNote = document.getElementById('pickupNote').value.trim() || '';
  const luggage = document.getElementById('pickupLuggage').checked;

  if (!name || !phone) {
    showToast('Vui lòng nhập họ tên và số điện thoại khách');
    return;
  }

  const defaults = [
    { id: 1, name: 'Nguyễn Thị Hồng', phone: '0909123456', ticketCount: 1, fromStation: 'Trạm Kinh Dương Vương', toStation: 'Trạm Châu Đốc', fromTransfer: '12 Kinh Dương Vương, Q.Bình Tân', toTransfer: 'Ngã 3 Vĩnh Xương, Châu Đốc', note: 'Khách lớn tuổi, cần hỗ trợ lên xuống xe', luggage: true, assigned: null, guestType: 'Rước liền', isRuocLien: true },
    { id: 2, name: 'Trần Văn Bình', phone: '0918234567', ticketCount: 1, fromStation: 'Trạm An Sương', toStation: 'Trạm Long Xuyên', fromTransfer: '45 Trường Chinh, Q.12', toTransfer: 'Công viên Long Xuyên', note: '', luggage: false, assigned: { tripId: '1', seat: 'A12' }, guestType: 'Rước liền', isRuocLien: true },
    { id: 3, name: 'Lê Thị Mai', phone: '0933345678', ticketCount: 2, fromStation: 'Trạm Q.5', toStation: 'Trạm Tân Châu', fromTransfer: '88 Nguyễn Trãi, Q.5', toTransfer: 'Bến phà Tân Châu', note: 'Đi cùng 1 trẻ nhỏ', luggage: true, assigned: null, guestType: 'Rước liền', isRuocLien: true },
    { id: 4, name: 'Phạm Quốc Huy', phone: '0944456789', ticketCount: 1, fromStation: 'Văn phòng trung tâm', toStation: 'Bến xe Châu Đốc', fromTransfer: '120 Lê Hồng Phong, Q.10', toTransfer: 'Bến xe Châu Đốc', note: '', luggage: false, assigned: null, guestType: 'Rước liền', isRuocLien: true },
    { id: 5, name: 'Võ Thị Kim Ngân', phone: '0977567890', ticketCount: 2, fromStation: 'Trạm Kinh Dương Vương', toStation: 'Trạm Cần Thơ', fromTransfer: '5 Hồ Học Lãm, Bình Tân', toTransfer: 'Bến Ninh Kiều, Cần Thơ', note: 'Gọi trước 15 phút khi xe tới', luggage: true, assigned: null, guestType: 'Rước liền', isRuocLien: true }
  ];

  let paxList = [];
  const keysToTry = [HN_PICKUP_PAX_KEY, 'hn_pickup_passengers_v5', 'hn_pickup_passengers_v4'];
  for (const k of keysToTry) {
    const saved = localStorage.getItem(k);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          paxList = parsed;
          break;
        }
      } catch (e) { }
    }
  }

  if (paxList.length === 0) {
    paxList = JSON.parse(JSON.stringify(defaults));
  }

  const newPax = {
    id: Date.now(),
    name: name,
    phone: phone,
    ticketCount: count,
    fromStation: station,
    fromTransfer: address,
    toStation: destination,
    toTransfer: destinationTransfer,
    note: tripNote,
    luggage: luggage,
    assigned: null,
    guestType: 'Rước liền',
    isRuocLien: true
  };

  paxList.unshift(newPax);
  const jsonStr = JSON.stringify(paxList);
  localStorage.setItem(HN_PICKUP_PAX_KEY, jsonStr);

  try {
    window.dispatchEvent(new StorageEvent('storage', {
      key: HN_PICKUP_PAX_KEY,
      newValue: jsonStr,
      storageArea: localStorage
    }));
  } catch (e) { }

  closeModal('pickupModal');
  showToast(`Đã lưu thông tin khách rước (${count} vé): ${name}`);
}

/* ---- Toast ---- */
let toastTimer;

/* ---- Search dropdown (SB-01) ---- */
function setSearchMode(mode) {
  const el = document.getElementById('searchModeSwitch');
  el.classList.toggle('mode-chuyen', mode === 'chuyen');
  el.classList.toggle('mode-ve', mode === 've');
  el.querySelectorAll('.search-mode-opt').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
  document.getElementById('searchInput').placeholder = mode === 'chuyen'
    ? 'Tìm kiếm theo tuyến, giờ chạy, biển số xe...'
    : 'Tìm kiếm theo SĐT, Mã vé, Tên hành khách...';
}
document.getElementById('searchInput').addEventListener('focus', () => {
  if (typeof currentView !== 'undefined' && (currentView === 'phoi' || currentView === 'history')) return;
  toggleSearchResults(true);
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-wrap')) document.getElementById('searchResults').classList.remove('open');
  if (!e.target.closest('#directionDropdown') && !e.target.closest('#directionTrigger')) document.getElementById('directionDropdown').classList.remove('open');
  if (!e.target.closest('#routeDropdown') && !e.target.closest('#routeTrigger')) document.getElementById('routeDropdown').classList.remove('open');
});

/* ---- Zone 1: Trip list select ---- */
function selectTrip(el, time, routeLabel) {
  if (customerHistoryActive) closeCustomerHistory();
  document.querySelectorAll('.trip-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  const tripId = el.dataset.trip;
  const tripMeta = allTripsMeta.find(m => m.id === tripId);
  const titleText = tripMeta ? (tripMeta.name || (time + ' - ' + (routeLabel || 'Sài Gòn - Châu Đốc'))) : (time + ' - ' + (routeLabel || 'Sài Gòn - Châu Đốc'));
  document.getElementById('tripTitle').textContent = titleText;
  if (!tripId || !tripSeatBank[tripId]) return;

  // Sync state
  currentTripId = tripId;
  seatPlanDown = tripSeatBank[tripId].down;
  seatPlanUp = tripSeatBank[tripId].up;
  extraLeftoverSeats = tripSeatBank[tripId].extraSeats || [];
  subSeats = tripSeatBank[tripId].subSeats || [];

  // Update header details from bank
  const plateVal = tripSeatBank[tripId].plate || '51F-123.45';
  const vehicleType = tripSeatBank[tripId].vehicleType || 'Limousine 24 Phòng';
  const driverVal = tripSeatBank[tripId].driver || 'Trần Văn Hùng';
  const helperVal = tripSeatBank[tripId].helper || 'Nguyễn Thị Hương';

  const headerPlate = document.getElementById('headerPlate');
  if (headerPlate) headerPlate.textContent = plateVal;

  const carTypeEl = document.querySelector('.car-type');
  if (carTypeEl) {
    const svgIcon = carTypeEl.querySelector('svg');
    carTypeEl.innerHTML = '';
    if (svgIcon) carTypeEl.appendChild(svgIcon);
    carTypeEl.appendChild(document.createTextNode(' ' + vehicleType));
  }

  const headerDriver = document.getElementById('headerDriver');
  if (headerDriver) headerDriver.textContent = driverVal;

  const headerHelper = document.getElementById('headerHelper');
  if (headerHelper) headerHelper.textContent = helperVal;

  // Đang chuyển ghế và đã chọn ghế nguồn (hoặc 1 vé hủy làm nguồn): cho phép bấm sang chuyến khác để
  // chọn ghế trống làm đích, không làm mất lựa chọn nguồn đã chọn trước đó (không cần thêm nút nào).
  if (multiSelectMode && selectionMode === 'transfer' && (selectedSourceSeats.length || transferSourceCancelId)) {
    currentTripId = tripId;
    seatPlanDown = tripSeatBank[tripId].down;
    seatPlanUp = tripSeatBank[tripId].up;
    extraLeftoverSeats = tripSeatBank[tripId].extraSeats || [];
    subSeats = tripSeatBank[tripId].subSeats || [];
    if (transferTargetTripId !== tripId) {
      selectedTargetSeats = [];
      transferTargetTripId = tripId;
    }
    renderSeats();
    if (transferSourceTripId === tripId) {
      selectedSourceSeats.forEach(code => {
        const card = document.querySelector(`.seat-card[data-code="${code}"]`);
        if (card) { card.style.outline = '2px solid var(--red)'; card.style.outlineOffset = '1px'; }
      });
    }
    if (transferTargetTripId === tripId) {
      selectedTargetSeats.forEach(code => {
        const card = document.querySelector(`.seat-card[data-code="${code}"]`);
        if (card) { card.style.outline = '2px solid var(--red)'; card.style.outlineOffset = '1px'; }
      });
    }
    if (document.getElementById('zone3Passengers').style.display !== 'none') renderPassengerList();
    updateTransferHint();
    return;
  }

  if (multiSelectMode) exitMultiSelectMode();

  currentTripId = tripId;
  seatPlanDown = tripSeatBank[tripId].down;
  seatPlanUp = tripSeatBank[tripId].up;
  extraLeftoverSeats = tripSeatBank[tripId].extraSeats || [];
  subSeats = tripSeatBank[tripId].subSeats || [];
  cancelledSeats = tripSeatBank[tripId].cancelledSeats || [];
  renderSeats();
  updateCancelledTabCount();
  if (document.getElementById('zone3Passengers').style.display !== 'none') renderPassengerList();
  if (document.getElementById('zone3Cancelled') && document.getElementById('zone3Cancelled').style.display !== 'none') renderCancelledListTable();
}
let selectedDirection = 'sg-cd';
let selectedRoute = 'all';
const directionLabels = {
  'sg-cd': 'Sài Gòn → Châu Đốc',
  'cd-sg': 'Châu Đốc → Sài Gòn'
};
const routeOptions = {
  'sg-cd': [
    { id: 'all', label: 'Tất cả tuyến' },
    { id: 'sg-cd', label: 'Sài Gòn - Châu Đốc' }
  ],
  'cd-sg': [
    { id: 'all', label: 'Tất cả tuyến' },
    { id: 'cd-sg', label: 'Châu Đốc - Sài Gòn' }
  ]
};
function updateTripListForDirection(dir) {
  const sgList = document.getElementById('tripListSGCD');
  const cdList = document.getElementById('tripListCDSG');
  if (!sgList || !cdList) return;
  if (dir === 'cd-sg') {
    sgList.style.display = 'none';
    cdList.style.display = '';
    const firstCard = cdList.querySelector('.trip-card');
    if (firstCard) selectTrip(firstCard, firstCard.querySelector('.trip-time').textContent, 'Châu Đốc - Sài Gòn');
  } else {
    cdList.style.display = 'none';
    sgList.style.display = '';
    const firstCard = sgList.querySelector('.trip-card');
    if (firstCard) selectTrip(firstCard, firstCard.querySelector('.trip-time').textContent, 'Sài Gòn - Châu Đốc');
  }
}
function resetRoute() {
  showToast('Đổi Hướng đi → làm mới Tuyến và Danh sách phơi xe (BR-06)');
}

/* ---- Zone 1: Calendar ---- */
let calDate = new Date(2026, 6, 8); // 08/07/2026
let selectedDate = new Date(2026, 6, 8);
const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
function renderCalendar() {
  const y = calDate.getFullYear(), m = calDate.getMonth();
  document.getElementById('calMonthLabel').textContent = `${monthNames[m]}, ${y}`;
  const first = new Date(y, m, 1);
  const startOffset = (first.getDay() + 6) % 7; // T2 đầu tuần
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const daysInPrevMonth = new Date(y, m, 0).getDate();
  const today = new Date(2026, 6, 8);
  let html = '';
  ["T2", "T3", "T4", "T5", "T6", "T7", "CN"].forEach(d => html += `<div class="cal-dow">${d}</div>`);
  for (let i = 0; i < startOffset; i++) {
    html += `<div class="cal-day muted">${daysInPrevMonth - startOffset + i + 1}</div>`;
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(y, m, d);
    const isToday = dateObj.toDateString() === today.toDateString();
    const isSelected = dateObj.toDateString() === selectedDate.toDateString();
    const lunar = ((d + 16) % 30) + 1;
    html += `<div class="cal-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" data-action="pickDate" data-args='${JSON.stringify([y, m, d])}'>${d}<span class="lunar">${lunar}/6</span></div>`;
  }
  const totalCells = startOffset + daysInMonth;
  const trailing = (7 - (totalCells % 7)) % 7;
  for (let i = 1; i <= trailing; i++) { html += `<div class="cal-day muted">${i}</div>`; }
  document.getElementById('calGrid').innerHTML = html;
}
function shiftMonth(dir) { calDate = new Date(calDate.getFullYear(), calDate.getMonth() + dir, 1); renderCalendar(); }
function goToday() { calDate = new Date(2026, 6, 8); selectedDate = new Date(2026, 6, 8); renderCalendar(); updateCalTrigger(); }
function pickDate(y, m, d) {
  selectedDate = new Date(y, m, d);
  renderCalendar();
  updateCalTrigger();
  toggleCalendar(false); // chọn xong tự thu gọn lại
}

const dowNames = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
function updateCalTrigger() {
  const today = new Date(2026, 6, 8);
  const isToday = selectedDate.toDateString() === today.toDateString();
  const d = String(selectedDate.getDate()).padStart(2, '0');
  const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
  document.getElementById('calTriggerDate').textContent = isToday ? 'Hôm nay' : `${d}/${m}`;
}

let calendarOpen = false;
document.addEventListener('click', (e) => {
  if (calendarOpen && !e.target.closest('.calendar') && !e.target.closest('#calTrigger')) {
    toggleCalendar(false);
  }
});

renderCalendar();
updateCalTrigger();

/* ---- Zone 1: lọc danh sách phơi theo giờ khởi hành (popover 2 cột Sáng/Chiều thay cho <select> cũ) ---- */
function toggleZone1HourPopover(force) {
  const popover = document.getElementById('zone1HourPopover');
  const btn = document.getElementById('zone1HourFilterBtn');
  if (!popover || !btn) return;
  const willOpen = typeof force === 'boolean' ? force : !popover.classList.contains('open');
  popover.classList.toggle('open', willOpen);
  btn.classList.toggle('open', willOpen);
  if (willOpen) updateZone1HourPopoverSelection();
}

function updateZone1HourPopoverSelection() {
  document.querySelectorAll('#zone1HourPopover [data-action="selectZone1Hour"]').forEach(b => {
    const val = JSON.parse(b.getAttribute('data-args'))[0];
    b.classList.toggle('selected', val === zone1HourFilter);
  });
}

function selectZone1Hour(value) {
  zone1HourFilter = value;
  const label = document.getElementById('zone1HourFilterLabel');
  if (label) label.textContent = value === 'all' ? 'Tất cả các giờ' : (String(value).padStart(2, '0') + ':00');
  toggleZone1HourPopover(false);
  renderZone1TripList();
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('#zone1HourPopover') && !e.target.closest('#zone1HourFilterBtn')) {
    toggleZone1HourPopover(false);
  }
});

/* ===================== TÀI KHOẢN / ĐĂNG XUẤT ===================== */
(function initUserMenu() {
  const menu = document.getElementById('userMenu');
  const chipBtn = document.getElementById('userChipBtn');
  const dropdown = document.getElementById('userDropdown');
  const logoutBtn = document.getElementById('logoutBtn');
  if (!menu || !chipBtn || !dropdown || !logoutBtn) return;

  // Hiển thị thông tin người dùng từ phiên đăng nhập (nếu có)
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
  } catch (_) { /* ignore */ }

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
    sessionStorage.removeItem(HN_CURRENT_USER_KEY);
    window.location.href = 'index.html';
  });
})();

/* ===================== PHƠI XE MANAGEMENT (SPA VIEW & MODALS) ===================== */

// Routes default configuration
const ROUTES_CFG = {
  'chieu-di': [
    { label: 'Sài Gòn - Châu Đốc', abbr: 'SG-CD', price: 280000 },
    { label: 'Sài Gòn - Long Xuyên', abbr: 'SG-LX', price: 150000 },
    { label: 'Sài Gòn - Cần Thơ', abbr: 'SG-CT', price: 180000 }
  ],
  'chieu-ve': [
    { label: 'Châu Đốc - Sài Gòn', abbr: 'CD-SG', price: 280000 },
    { label: 'Long Xuyên - Sài Gòn', abbr: 'LX-SG', price: 150000 },
    { label: 'Cần Thơ - Sài Gòn', abbr: 'CT-SG', price: 180000 }
  ]
};

// Global variables specific to Phơi xe
let bulkTimes = [];
let contextMenuTargetId = null;

// View Switcher (SPA)
function switchView(viewName) {
  if (viewName === currentView) return;
  currentView = viewName;

  const bookingView = document.getElementById('bookingView');
  const phoiView = document.getElementById('phoiView');
  const historyView = document.getElementById('historyView');
  const tabBooking = document.getElementById('tabBooking');
  const tabPhoi = document.getElementById('tabPhoi');
  const tabHistory = document.getElementById('tabHistory');
  const ruocLienBtn = document.getElementById('ruocLienBtn');
  const searchInput = document.getElementById('searchInput');

  // Clear search input on switch
  searchInput.value = '';

  bookingView.style.display = 'none';
  phoiView.style.display = 'none';
  if (historyView) historyView.style.display = 'none';
  tabBooking.classList.remove('active');
  tabPhoi.classList.remove('active');
  if (tabHistory) tabHistory.classList.remove('active');

  if (viewName === 'booking') {
    bookingView.style.display = 'flex';
    tabBooking.classList.add('active');
    if (ruocLienBtn) ruocLienBtn.style.display = 'inline-flex';

    // Restore original placeholder
    searchInput.placeholder = 'Tìm kiếm theo SĐT, Mã vé, Tên hành khách...';
  } else if (viewName === 'phoi') {
    phoiView.style.display = 'flex';
    tabPhoi.classList.add('active');
    if (ruocLienBtn) ruocLienBtn.style.display = 'none';

    // Change placeholder to Phơi xe
    if (searchInput) searchInput.placeholder = 'Tìm kiếm phơi xe...';

    if (!Array.isArray(allTripsMeta) || allTripsMeta.length === 0) {
      allTripsMeta = loadAllTrips();
    }
    allTripsMeta.forEach(t => { t.date = todayStr; });

    applyFilters();
  } else if (viewName === 'history') {
    if (historyView) historyView.style.display = 'flex';
    if (tabHistory) tabHistory.classList.add('active');
    if (ruocLienBtn) ruocLienBtn.style.display = 'none';
    if (searchInput) searchInput.placeholder = 'Tìm tên, SĐT trong lịch sử...';

    openPassengerHistoryView();
  }
}

// Intercept search input focus and search event
let phoiFilterDebounceTimer = null;
document.getElementById('searchInput').addEventListener('input', () => {
  if (currentView === 'phoi') {
    clearTimeout(phoiFilterDebounceTimer);
    phoiFilterDebounceTimer = setTimeout(applyFilters, 300);
  }
});

// Update loadTrips metadata sync
function refreshTripsList() {
  sgcdTripsMeta = allTripsMeta.filter(t => (t.route.includes('Sài Gòn -') || t.route.includes('Sài Gòn →')) && t.status !== 'Đã hủy');
  cdsgTripsMeta = allTripsMeta.filter(t => (t.route.includes('Châu Đốc -') || t.route.includes('Long Xuyên -') || t.route.includes('Cần Thơ -')) && t.status !== 'Đã hủy');
  renderZone1TripList();
}

function saveData() {
  localStorage.setItem(HN_TRIPS_KEY, JSON.stringify(allTripsMeta));
  localStorage.setItem(HN_STORAGE_KEY, JSON.stringify(tripSeatBank));
}

function generateNewEmptyPlan(vehicleType, priceValue = 280000) {
  const codes = getSeatCodesForVehicleType(vehicleType);
  const buildFloor = floorCodes => floorCodes.map(code => {
    if (code.endsWith('_hidden')) return { code, state: 'hidden' };
    return {
      code,
      state: 'empty',
      locked: false,
      price: priceValue,
      callState: null,
      firstStop: null,
      lastStop: null,
      staff: null,
      customerName: null,
      note: null,
      count: 1,
      pickupTime: null,
      phone: null,
      ticketNo: null,
      paid: false,
      hasLuggage: false
    };
  });
  return {
    down: buildFloor(codes.down),
    up: buildFloor(codes.up)
  };
}

// Direction selection for filters and modals
function onFilterDirectionChange() {
  const dir = document.getElementById("filterDirection").value;
  const routeSelect = document.getElementById("filterRoute");
  routeSelect.innerHTML = '<option value="">Tất cả tuyến</option>';

  if (dir && ROUTES_CFG[dir]) {
    ROUTES_CFG[dir].forEach(r => {
      routeSelect.innerHTML += `<option value="${r.label}">${r.label}</option>`;
    });
  }
}

function onModalDirectionChange(modalType) {
  const dir = document.getElementById(modalType === 'single' ? "tripDirection" : "bulkDirection").value;
  const routeSelect = document.getElementById(modalType === 'single' ? "tripRoute" : "bulkRoute");
  routeSelect.innerHTML = '<option value="">-- Chọn tuyến --</option>';

  if (dir && ROUTES_CFG[dir]) {
    ROUTES_CFG[dir].forEach(r => {
      routeSelect.innerHTML += `<option value="${r.label}">${r.label}</option>`;
    });
  }
}

function onRouteSelect(modalType) {
  const dir = document.getElementById(modalType === 'single' ? "tripDirection" : "bulkDirection").value;
  const routeVal = document.getElementById(modalType === 'single' ? "tripRoute" : "bulkRoute").value;
  const priceInput = document.getElementById(modalType === 'single' ? "tripPrice" : "bulkPrice");

  if (dir && routeVal && ROUTES_CFG[dir]) {
    const routeObj = ROUTES_CFG[dir].find(r => r.label === routeVal);
    if (routeObj) {
      priceInput.value = routeObj.price;
    }
  }
  if (modalType === 'single') {
    suggestSingleTripName();
  }
}

function suggestSingleTripName() {
  const routeVal = document.getElementById("tripRoute").value;
  const timeVal = document.getElementById("tripTime").value;
  const noteVal = document.getElementById("tripNote").value.trim();
  const nameInput = document.getElementById("tripName");

  if (!routeVal || !timeVal) return;

  let baseName = `${routeVal} (${timeVal})`;
  if (noteVal) {
    baseName += ` - ${noteVal}`;
  }
  nameInput.value = baseName;
}

// Listeners for suggestions in single modal
const tripTimeInput = document.getElementById("tripTime");
if (tripTimeInput) tripTimeInput.addEventListener("input", suggestSingleTripName);
const tripRouteInput = document.getElementById("tripRoute");
if (tripRouteInput) tripRouteInput.addEventListener("change", suggestSingleTripName);
const tripNoteInput = document.getElementById("tripNote");
if (tripNoteInput) tripNoteInput.addEventListener("input", suggestSingleTripName);

// Search Filters implementation
function applyFilters() {
  const filterNameEl = document.getElementById("filterName");
  const filterNameVal = filterNameEl ? filterNameEl.value.trim().toLowerCase() : '';
  const searchInput = document.getElementById("searchInput");
  const searchInputVal = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const fName = filterNameVal || searchInputVal;

  const filterDateEl = document.getElementById("filterDate");
  const fDate = filterDateEl ? filterDateEl.value : '';
  const filterDirEl = document.getElementById("filterDirection");
  const fDir = filterDirEl ? filterDirEl.value : '';
  const filterRouteEl = document.getElementById("filterRoute");
  const fRoute = filterRouteEl ? filterRouteEl.value : '';

  if (!Array.isArray(allTripsMeta)) allTripsMeta = [];

  const filtered = allTripsMeta.filter(t => {
    if (!t) return false;
    const timeStr = t.time || '';
    const routeStr = t.route || '';
    const plateStr = t.plate || '';
    const vehicleTypeStr = t.vehicleType || '';

    if (fName) {
      const matchName = timeStr.toLowerCase().includes(fName) ||
        routeStr.toLowerCase().includes(fName) ||
        plateStr.toLowerCase().includes(fName) ||
        vehicleTypeStr.toLowerCase().includes(fName);
      let abbr = '';
      if (typeof ROUTES_CFG === 'object' && ROUTES_CFG) {
        Object.keys(ROUTES_CFG).forEach(k => {
          if (Array.isArray(ROUTES_CFG[k])) {
            const found = ROUTES_CFG[k].find(r => r.label === routeStr);
            if (found) abbr = found.abbr;
          }
        });
      }
      const timeFormatted = timeStr ? timeStr.replace(':', 'h') : '';
      const suggestedName = `${abbr} ${timeFormatted}`.trim().toLowerCase();
      const customNameMatches = t.name ? t.name.toLowerCase().includes(fName) : suggestedName.includes(fName);

      if (!matchName && !customNameMatches) return false;
    }

    if (fDate && fDate !== todayStr && t.date && t.date !== fDate) return false;

    if (fDir) {
      if (fDir === 'chieu-di' && !routeStr.startsWith('Sài Gòn')) return false;
      if (fDir === 'chieu-ve' && routeStr.startsWith('Sài Gòn')) return false;
    }

    if (fRoute && routeStr !== fRoute) return false;

    return true;
  });

  filtered.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  renderTable(filtered);
}

// Đưa thanh lọc phơi xe về mặc định — nút "Đặt lại" trước đây gọi hàm không tồn tại (resetPhoiFilters),
// bấm không có tác dụng gì.
function resetPhoiFilters() {
  const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  setVal('filterName', '');
  setVal('filterDate', '');
  setVal('filterDirection', '');
  setVal('filterStatus', '');
  onFilterDirectionChange(); // dựng lại option của filterRoute theo đúng trạng thái "Tất cả"
  applyFilters();
}

// Table rendering
function renderTable(trips) {
  const tbody = document.getElementById("tripsTableBody");
  const emptyState = document.getElementById("emptyState");
  if (!tbody) return;
  tbody.innerHTML = '';

  if (!Array.isArray(trips) || trips.length === 0) {
    if (emptyState) emptyState.style.display = "flex";
    return;
  }
  if (emptyState) emptyState.style.display = "none";

  trips.forEach((t, i) => {
    if (!t) return;
    const timeStr = t.time || '00:00';
    const routeStr = t.route || '';
    const timeFormatted = timeStr.replace(':', 'h');

    let abbr = '';
    if (typeof ROUTES_CFG === 'object' && ROUTES_CFG) {
      Object.keys(ROUTES_CFG).forEach(k => {
        if (Array.isArray(ROUTES_CFG[k])) {
          const found = ROUTES_CFG[k].find(r => r.label === routeStr);
          if (found) abbr = found.abbr;
        }
      });
    }
    const displayName = t.name || `${routeStr} (${timeFormatted})`;
    const noteHtml = t.note ? `<div class="phoi-note-sub" style="font-size:11.5px; color:var(--text-sub); font-weight:500; margin-top:3px;"><span style="font-weight:700; color:var(--red); padding:1px 5px; background:var(--red-light); border-radius:3px; font-size:10.5px; margin-right:4px;">GC</span>${t.note}</div>` : '';

    const plan = (typeof tripSeatBank === 'object' && tripSeatBank) ? tripSeatBank[t.id] : null;
    let emptyCount = 0;
    let totalCount = 0;
    if (plan && Array.isArray(plan.down) && Array.isArray(plan.up)) {
      const combined = [...plan.down, ...plan.up];
      emptyCount = combined.filter(s => s.state === 'empty').length;
      totalCount = combined.filter(s => s.state !== 'hidden').length;
    } else {
      totalCount = (typeof VEHICLE_TYPE_SEATS === 'object' && VEHICLE_TYPE_SEATS && VEHICLE_TYPE_SEATS[t.vehicleType]) || 24;
      emptyCount = totalCount;
    }

    let formattedDate = '';
    if (t.date && typeof t.date === 'string') {
      const parts = t.date.split('-');
      if (parts.length === 3) {
        formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
      } else {
        formattedDate = t.date;
      }
    }
    const scheduleStr = `${timeStr} – ${formattedDate}`;

    let statusClass = 'chua-chi-dinh';
    let label = t.status || 'Chưa chỉ định xe';
    if (label === 'Đã chỉ định xe') statusClass = 'da-chi-dinh';
    if (label === 'Đang bán') statusClass = 'dang-ban';
    if (label === 'Đã khởi hành') statusClass = 'da-khoi-hanh';
    if (label === 'Đã hủy') statusClass = 'da-huy';

    const tr = document.createElement("tr");
    tr.setAttribute("data-id", t.id);
    tr.addEventListener("dblclick", () => openEditModal(t.id));

    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${scheduleStr}</td>
      <td>
        <div class="phoi-name-main" style="font-weight:700; color:var(--text-main); font-size:13px; line-height:1.35;">${displayName}</div>
        ${noteHtml}
      </td>
      <td>${t.plate || '—'}</td>
      <td style="text-align:center;">${emptyCount}/${totalCount}</td>
      <td style="text-align:right;">${(t.price || 280000).toLocaleString('vi-VN')}đ</td>
      <td style="text-align:center;"><span class="badge ${statusClass}">${label}</span></td>
      <td class="actions-cell">
        <button class="dots-btn" data-action="showContextMenu" data-stop-propagation="1" data-args='${JSON.stringify(["__event__", t.id])}'>...</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Single Modal triggers
function openSingleModal() {
  document.getElementById("singleModalTitle").textContent = "Tạo phơi xe mới";
  document.getElementById("singleForm").reset();
  document.getElementById("editTripId").value = '';
  document.getElementById("editStatusRow").style.display = "none";
  document.getElementById("btnSaveSingle").disabled = false;

  const today = new Date().toISOString().split("T")[0];
  document.getElementById("tripDate").value = today;
  document.getElementById("singleModal").classList.add("active");
  document.getElementById("singleModal").classList.add("open");
}

// Expose these helpers to global scope for button onclick events
window.openSingleModal = openSingleModal;
window.closeSingleModal = closeSingleModal;
window.openBulkModal = openBulkModal;
window.closeBulkModal = closeBulkModal;
window.addBulkTime = addBulkTime;
window.removeBulkTime = removeBulkTime;
window.onModalDirectionChange = onModalDirectionChange;
window.onFilterDirectionChange = onFilterDirectionChange;
window.onRouteSelect = onRouteSelect;
window.saveSingleTrip = saveSingleTrip;
window.generateBulkTrips = generateBulkTrips;
window.showContextMenu = showContextMenu;
window.onContextEdit = onContextEdit;
window.onContextDelete = onContextDelete;
window.switchView = switchView;
window.applyFilters = applyFilters;

function closeSingleModal() {
  document.getElementById("singleModal").classList.remove("active");
  document.getElementById("singleModal").classList.remove("open");
}

function openEditModal(id) {
  const trip = allTripsMeta.find(t => t.id === id);
  if (!trip) return;

  document.getElementById("singleModalTitle").textContent = "Chỉnh sửa phơi xe";
  document.getElementById("editTripId").value = id;
  document.getElementById("editStatusRow").style.display = "flex";

  document.getElementById("tripName").value = trip.name || '';
  document.getElementById("tripDate").value = trip.date || '';
  document.getElementById("tripTime").value = trip.time || '';
  document.getElementById("tripVehicleType").value = trip.vehicleType || 'Limousine 24 Phòng';
  document.getElementById("tripPrice").value = trip.price || 280000;
  document.getElementById("tripNote").value = trip.note || '';

  document.getElementById("tripStatus").value = trip.status || 'Chưa chỉ định xe';
  document.getElementById("tripPlate").value = trip.plate || '';

  let direction = 'chieu-di';
  if (!trip.route.startsWith('Sài Gòn')) direction = 'chieu-ve';
  document.getElementById("tripDirection").value = direction;

  onModalDirectionChange('single');
  document.getElementById("tripRoute").value = trip.route;

  const isReadOnly = (trip.status === 'Đã khởi hành' || trip.status === 'Đã hủy');
  const inputs = document.querySelectorAll("#singleForm input, #singleForm select, #singleForm button[type='submit']");
  inputs.forEach(el => {
    if (el.id !== 'btnSaveSingle') el.disabled = isReadOnly;
  });
  document.getElementById("btnSaveSingle").disabled = isReadOnly;

  document.getElementById("singleModal").classList.add("active");
  document.getElementById("singleModal").classList.add("open");
}

// Cập nhật phơi đã có. Trả về false nếu người dùng huỷ xác nhận đổi loại xe (báo cho saveSingleTrip
// dừng lại, không lưu/đóng modal) — giữ đúng hành vi early-return của bản gốc.
function updateExistingTrip(id, fields) {
  const { finalName, dateVal, routeVal, timeVal, vehicleVal, priceVal, noteVal, statusVal, plateVal } = fields;
  const tripIdx = allTripsMeta.findIndex(t => t.id === id);
  if (tripIdx === -1) return true;
  const trip = allTripsMeta[tripIdx];

  trip.name = finalName;
  trip.date = dateVal;
  trip.route = routeVal;
  trip.time = timeVal;
  trip.price = priceVal;
  trip.note = noteVal;
  trip.status = statusVal;

  if (trip.vehicleType !== vehicleVal) {
    const confirmed = confirm("Cảnh báo: Thay đổi loại xe sẽ xoá toàn bộ sơ đồ ghế cũ và sinh lại ghế trống mới. Tiếp tục?");
    if (!confirmed) return false;
    trip.vehicleType = vehicleVal;
    tripSeatBank[id] = generateNewEmptyPlan(vehicleVal, priceVal);
  }

  trip.plate = plateVal;

  if (tripSeatBank[id]) {
    tripSeatBank[id].plate = plateVal;
    tripSeatBank[id].vehicleType = vehicleVal;
    if (plateVal) {
      tripSeatBank[id].driver = tripSeatBank[id].driver || 'Phạm Quốc Bảo';
      tripSeatBank[id].helper = tripSeatBank[id].helper || 'Đỗ Văn Sơn';
    }
  }
  return true;
}

function createNewTrip(fields) {
  const { finalName, dateVal, routeVal, timeVal, vehicleVal, priceVal, noteVal } = fields;
  const newId = (Date.now().toString() + Math.random().toString(36).substr(2, 5));
  const newTrip = {
    id: newId,
    name: finalName,
    date: dateVal,
    route: routeVal,
    time: timeVal,
    vehicleType: vehicleVal,
    price: priceVal,
    note: noteVal,
    status: 'Chưa chỉ định xe',
    plate: ''
  };

  allTripsMeta.push(newTrip);

  tripSeatBank[newId] = generateNewEmptyPlan(vehicleVal, priceVal);
  tripSeatBank[newId].plate = '';
  tripSeatBank[newId].vehicleType = vehicleVal;
  tripSeatBank[newId].driver = '';
  tripSeatBank[newId].helper = '';
  tripSeatBank[newId].subSeats = [];
  tripSeatBank[newId].extraSeats = [];
}

function saveSingleTrip(e) {
  e.preventDefault();

  const id = document.getElementById("editTripId").value;
  const nameVal = document.getElementById("tripName").value.trim();
  const dateVal = document.getElementById("tripDate").value;
  const dirVal = document.getElementById("tripDirection").value;
  const routeVal = document.getElementById("tripRoute").value;
  const timeVal = document.getElementById("tripTime").value;
  const vehicleVal = document.getElementById("tripVehicleType").value;
  const priceVal = parseInt(document.getElementById("tripPrice").value) || 280000;
  const noteVal = document.getElementById("tripNote").value.trim();
  const statusVal = document.getElementById("tripStatus").value || 'Chưa chỉ định xe';
  const plateVal = document.getElementById("tripPlate").value.trim();

  let abbr = '';
  ROUTES_CFG[dirVal].forEach(r => {
    if (r.label === routeVal) abbr = r.abbr;
  });
  const suggested = `${abbr} ${timeVal.replace(':', 'h')}`;
  const finalName = nameVal || suggested;

  const isDuplicateName = allTripsMeta.some(t =>
    t.id !== id &&
    t.date === dateVal &&
    t.status !== 'Đã hủy' &&
    (t.name ? t.name.toLowerCase() === finalName.toLowerCase() : `${ROUTES_CFG[t.route.startsWith('Sài Gòn') ? 'chieu-di' : 'chieu-ve'].find(r => r.label === t.route).abbr} ${t.time.replace(':', 'h')}`.toLowerCase() === finalName.toLowerCase())
  );

  if (isDuplicateName) {
    alert(`Lỗi (BR-01): Tên phơi "${finalName}" đã tồn tại trong ngày khởi hành ${dateVal}.`);
    return;
  }

  const fields = { finalName, dateVal, routeVal, timeVal, vehicleVal, priceVal, noteVal, statusVal, plateVal };

  if (id) {
    if (!updateExistingTrip(id, fields)) return;
  } else {
    createNewTrip(fields);
  }

  saveData();
  refreshTripsList();
  applyFilters();
  closeSingleModal();
}

// Bulk Modal operations
function openBulkModal() {
  document.getElementById("bulkForm").reset();
  bulkTimes = [];
  renderTimeTags();

  const today = new Date().toISOString().split("T")[0];
  document.getElementById("bulkFromDate").value = today;
  document.getElementById("bulkToDate").value = today;

  document.getElementById("bulkModal").classList.add("active");
  document.getElementById("bulkModal").classList.add("open");
}

function closeBulkModal() {
  document.getElementById("bulkModal").classList.remove("active");
  document.getElementById("bulkModal").classList.remove("open");
}

function addBulkTime() {
  const timeInput = document.getElementById("bulkTimeInput");
  const timeVal = timeInput.value;
  if (!timeVal) return;

  if (bulkTimes.includes(timeVal)) {
    alert("Giờ khởi hành này đã có trong danh sách.");
    return;
  }
  bulkTimes.push(timeVal);
  bulkTimes.sort();
  timeInput.value = '';
  renderTimeTags();
}

function removeBulkTime(time) {
  bulkTimes = bulkTimes.filter(t => t !== time);
  renderTimeTags();
}

function renderTimeTags() {
  const container = document.getElementById("bulkTimeTags");
  container.innerHTML = '';
  bulkTimes.forEach(t => {
    container.innerHTML += `
      <span class="time-tag">
        ${t}
        <button type="button" data-action="removeBulkTime" data-args='${JSON.stringify([t])}'>&times;</button>
      </span>
    `;
  });
}

// Tính danh sách ngày (chuỗi yyyy-mm-dd) rơi vào các thứ trong tuần đã chọn, trong khoảng from..to.
function computeBulkTripDates(fromDateStr, toDateStr, weekdays) {
  const fromDate = new Date(fromDateStr);
  const toDate = new Date(toDateStr);
  const validDates = [];
  let current = new Date(fromDate);
  while (current <= toDate) {
    if (weekdays.includes(current.getDay())) {
      validDates.push(current.toISOString().split("T")[0]);
    }
    current.setDate(current.getDate() + 1);
  }
  return validDates;
}

// Tạo phơi xe cho từng cặp (ngày × giờ), bỏ qua nếu trùng tên hoặc trùng lịch với phơi đã có.
function createBulkTrips(validDates, routeVal, abbr, vehicleVal, priceVal) {
  let createdCount = 0;
  let skippedCount = 0;

  validDates.forEach(dateVal => {
    bulkTimes.forEach(timeVal => {
      const hhmm = timeVal.replace(':', 'h');
      const finalName = `${abbr} ${hhmm}`;

      const duplicateName = allTripsMeta.some(t =>
        t.date === dateVal &&
        t.status !== 'Đã hủy' &&
        (t.name ? t.name.toLowerCase() === finalName.toLowerCase() : `${ROUTES_CFG[t.route.startsWith('Sài Gòn') ? 'chieu-di' : 'chieu-ve'].find(r => r.label === t.route).abbr} ${t.time.replace(':', 'h')}`.toLowerCase() === finalName.toLowerCase())
      );

      const duplicateSchedule = allTripsMeta.some(t =>
        t.date === dateVal &&
        t.route === routeVal &&
        t.time === timeVal &&
        t.status !== 'Đã hủy'
      );

      if (duplicateName || duplicateSchedule) {
        skippedCount++;
      } else {
        const newId = (Date.now().toString() + Math.random().toString(36).substr(2, 5));
        const newTrip = {
          id: newId,
          name: finalName,
          date: dateVal,
          route: routeVal,
          time: timeVal,
          vehicleType: vehicleVal,
          price: priceVal,
          status: 'Chưa chỉ định xe',
          plate: '',
          note: ''
        };
        allTripsMeta.push(newTrip);

        tripSeatBank[newId] = generateNewEmptyPlan(vehicleVal, priceVal);
        tripSeatBank[newId].plate = '';
        tripSeatBank[newId].vehicleType = vehicleVal;
        tripSeatBank[newId].driver = '';
        tripSeatBank[newId].helper = '';
        tripSeatBank[newId].subSeats = [];
        tripSeatBank[newId].extraSeats = [];

        createdCount++;
      }
    });
  });

  return { createdCount, skippedCount };
}

function generateBulkTrips(e) {
  e.preventDefault();

  const dirVal = document.getElementById("bulkDirection").value;
  const routeVal = document.getElementById("bulkRoute").value;
  const fromDateStr = document.getElementById("bulkFromDate").value;
  const toDateStr = document.getElementById("bulkToDate").value;
  const vehicleVal = document.getElementById("bulkVehicleType").value;
  const priceVal = parseInt(document.getElementById("bulkPrice").value) || 280000;

  const checkedBoxes = document.querySelectorAll("input[name='bulkWeekdays']:checked");
  if (checkedBoxes.length === 0) {
    alert("Vui lòng chọn ít nhất một thứ lặp lại trong tuần.");
    return;
  }
  const weekdays = Array.from(checkedBoxes).map(cb => parseInt(cb.value));

  if (bulkTimes.length === 0) {
    alert("Vui lòng thêm ít nhất một mốc giờ khởi hành.");
    return;
  }

  let abbr = '';
  ROUTES_CFG[dirVal].forEach(r => {
    if (r.label === routeVal) abbr = r.abbr;
  });

  if (new Date(toDateStr) < new Date(fromDateStr)) {
    alert("Ngày kết thúc không được nhỏ hơn ngày bắt đầu.");
    return;
  }

  const validDates = computeBulkTripDates(fromDateStr, toDateStr, weekdays);

  const totalExpected = validDates.length * bulkTimes.length;
  if (totalExpected === 0) {
    alert("Không tìm thấy ngày nào trùng khớp với cấu hình lặp lại trong khoảng thời gian đã chọn.");
    return;
  }

  const confirmed = confirm(`Hệ thống sẽ tạo khoảng ${totalExpected} phơi xe. Xác nhận tạo?`);
  if (!confirmed) return;

  const { createdCount, skippedCount } = createBulkTrips(validDates, routeVal, abbr, vehicleVal, priceVal);

  saveData();
  refreshTripsList();
  applyFilters();
  closeBulkModal();

  alert(`Kết quả tạo hàng loạt:\n- Tạo thành công: ${createdCount} phơi xe.\n- Bỏ qua: ${skippedCount} phơi xe (do trùng lịch hoặc trùng tên phơi).`);
}

// Row Context Menu
function showContextMenu(e, id) {
  contextMenuTargetId = id;
  const menu = document.getElementById("rowContextMenu");
  menu.style.display = "block";
  menu.style.left = `${e.pageX - 100}px`;
  menu.style.top = `${e.pageY}px`;
}

function onContextEdit() {
  if (contextMenuTargetId) {
    openEditModal(contextMenuTargetId);
  }
}

function onContextDelete() {
  if (!contextMenuTargetId) return;
  const id = contextMenuTargetId;
  const trip = allTripsMeta.find(t => t.id === id);
  if (!trip) return;

  if (trip.status === 'Đã khởi hành') {
    alert("Lỗi: Không được hủy phơi xe đã khởi hành.");
    return;
  }
  if (trip.status === 'Đã hủy') {
    alert("Phơi xe đã ở trạng thái Hủy.");
    return;
  }

  const plan = tripSeatBank[id];
  let bookedCount = 0;
  if (plan) {
    const combined = [...plan.down, ...plan.up];
    bookedCount = combined.filter(s => ['sold', 'hold', 'free', 'cargo'].includes(s.state)).length;
  }

  let confirmed = false;
  if (bookedCount > 0) {
    confirmed = confirm(`CẢNH BÁO (BR-07): Phơi xe này đang có ${bookedCount} ghế đã bán/đặt. Bạn có chắc chắn muốn HỦY phơi xe này và bồi thường/chuyển khách?`);
    if (confirmed) {
      confirmed = confirm("Xác nhận hủy phơi xe một lần nữa (Thao tác không thể hoàn tác)?");
    }
  } else {
    confirmed = confirm(`Bạn có chắc chắn muốn hủy phơi xe "${trip.name || trip.time}"?`);
  }

  if (confirmed) {
    trip.status = 'Đã hủy';
    saveData();
    refreshTripsList();
    applyFilters();
  }
}

// Init phơi dates and event listeners
(function initPhoiDashboard() {
  const today = new Date().toISOString().split("T")[0];
  const filterDate = document.getElementById("filterDate");
  const tripDate = document.getElementById("tripDate");
  const bulkFromDate = document.getElementById("bulkFromDate");
  const bulkToDate = document.getElementById("bulkToDate");

  if (filterDate) filterDate.value = today;
  if (tripDate) {
    tripDate.value = today;
    tripDate.min = today;
  }
  if (bulkFromDate) {
    bulkFromDate.value = today;
    bulkFromDate.min = today;
  }
  if (bulkToDate) {
    bulkToDate.min = today;
  }

  // Close context menu clicking outside
  document.addEventListener("click", () => {
    const menu = document.getElementById("rowContextMenu");
    if (menu) menu.style.display = "none";
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
  const hasLuggage = !!document.getElementById('rbLuggage')?.checked;

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
      showToast('Vui lòng nhập SĐT, Tên hoặc Mã vé để tìm kiếm', 'warning');
    }
  }

  if (searchInput) {
    let liveSearchDebounceTimer = null;
    searchInput.addEventListener('input', function () {
      const val = this.value;
      // Tab "Lịch sử" đang mở: ô tìm kiếm chung trên header lọc luôn bảng lịch sử hành khách (tên/SĐT)
      // thay vì tra cứu lịch sử khách theo SĐT — đồng bộ giá trị sang #phSearchInput rồi gọi lại đúng
      // hàm lọc debounce sẵn có (phOnSearchInput), để 2 ô luôn hiện cùng 1 giá trị.
      if (typeof currentView !== 'undefined' && currentView === 'history') {
        const phField = document.getElementById('phSearchInput');
        if (phField) phField.value = val;
        phOnSearchInput(val);
        return;
      }
      clearTimeout(liveSearchDebounceTimer);
      liveSearchDebounceTimer = setTimeout(() => renderLiveSearchResults(val), 300);
    });
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        if (typeof currentView !== 'undefined' && currentView === 'history') return;
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