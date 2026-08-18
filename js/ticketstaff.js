/* ===================== DỮ LIỆU GHẾ MẪU ===================== */

// ===== Storage & Data Models =====
const staffList = ["tuyetphuong.huenghia", "minh.tran", "nguyen.long", "thi.hoa"];
const stopsFirst = ["Trạm Kinh Dương Vương", "Trạm An Sương", "Trạm Q.5", "Văn phòng trung tâm"];
const stopsLast = ["Trạm Châu Đốc", "Trạm Tân Châu", "Bến xe Châu Đốc"];
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

// Mock history data (past trips)

let pickupTimeIdx = 0, custIdx = 0, ticketSeq = 1;
const pickupTimes = ["07:00", "08:30", "10:00", "13:15", "15:30", "17:00"];

// Khởi tạo đối tượng dữ liệu cho một ghế trên phơi xe
function makeSeat(code, state, opts = {}) {
  const isBooked = ['sold', 'hold', 'free', 'cargo'].includes(state);
  const sampleIdx = isBooked ? (custIdx++) % nameSamples.length : 0;
  const guestTypes = ['Trung chuyển', 'Rước đường', 'Trung chuyển', 'Khách trạm'];
  const gType = isBooked ? (opts.guestType || guestTypes[Math.floor(Math.random() * guestTypes.length)]) : null;
  const transAddrs = [
    '142 Lê Hồng Phong, P.2, Q.5, TP.HCM',
    '385 Kinh Dương Vương, P. An Lạc, Q. Bình Tân',
    '215 Nguyễn Trãi, P.3, Q.5, TP.HCM',
    'Vòng xoay An Lạc, Bình Tân, TP.HCM',
    '52 Cây Keo, P. Hiệp Tân, Q. Tân Phú',
    '78 Lý Thường Kiệt, Q.10, TP.HCM',
    '102 Quốc Lộ 1A, Bình Chánh, TP.HCM'
  ];
  const dropoffAddrs = [
    'Bến xe Châu Đốc, TP. Châu Đốc, An Giang',
    'Văn phòng Tân Châu, TX. Tân Châu, An Giang',
    '105 Nguyễn Huệ, P. Châu Phú A, TP. Châu Đốc',
    'Chợ Long Xuyên, TP. Long Xuyên, An Giang',
    'Trạm Tân Châu, Thị xã Tân Châu, An Giang',
    '228 Trần Hưng Đạo, TP. Long Xuyên, An Giang',
    'Khách sạn Victoria Châu Đốc, An Giang'
  ];
  const driverList = ['Trần Văn Hùng (TC-01)', 'Nguyễn Văn Nam (TC-03)', 'Phạm Quốc Bảo (TC-02)', 'Lê Hoàng Anh (TC-05)'];

  const tAddr = (isBooked && gType !== 'Khách trạm') ? transAddrs[Math.floor(Math.random() * transAddrs.length)] : '';
  const dAddr = (isBooked && gType !== 'Khách trạm' && (gType === 'Trung chuyển' || Math.random() > 0.4)) ? dropoffAddrs[Math.floor(Math.random() * dropoffAddrs.length)] : '';
  const driver = isBooked ? driverList[Math.floor(Math.random() * driverList.length)] : '';

  const base = {
    code, state, // empty | hold | sold | free | cargo
    locked: false,
    price: state === 'free' ? 0 : 280000,
    callState: isBooked ? "Chưa gọi" : null,
    guestType: gType,
    driver: driver,
    transshipStation: tAddr,
    transship: tAddr,
    pickupAddress: (gType === 'Rước đường' || gType === 'Trung chuyển') ? tAddr : '',
    dropoffAddress: dAddr,
    arrivalTransfer: dAddr,
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
    guestType: mainSeat.guestType,
    transshipStation: mainSeat.transshipStation,
    transship: mainSeat.transship,
    pickupAddress: mainSeat.pickupAddress,
    dropoffAddress: mainSeat.dropoffAddress,
    arrivalTransfer: mainSeat.arrivalTransfer,
    firstStop: mainSeat.firstStop,
    lastStop: mainSeat.lastStop,
    note: mainSeat.note,
    hasLuggage: mainSeat.hasLuggage,
    paid: mainSeat.paid,
    count: 2
  });
}

const a1 = makeSeat("A1", "sold");
const a2 = groupSeat(a1, "A2", "sold");
const a10 = makeSeat("A10", "hold");
const a11 = groupSeat(a10, "A11", "hold");
const a12 = makeSeat("A12", "sold", {
  customerName: "Võ Minh Khoa",
  phone: "0809654321",
  firstStop: "Trạm An Sương",
  lastStop: "Trạm Long Xuyên",
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
          if (!t.date || t.date === '2026-07-29') t.date = todayStr;
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

// Lọc allTripsMeta thành 2 danh sách theo chiều (dùng chung ở nơi cần đồng bộ lại sau khi allTripsMeta thay đổi)
function refreshTripMetaFilters() {
  sgcdTripsMeta = allTripsMeta.filter(t => (t.route.includes('Sài Gòn -') || t.route.includes('Sài Gòn →')) && t.status !== 'Đã hủy');
  cdsgTripsMeta = allTripsMeta.filter(t => (t.route.includes('Châu Đốc -') || t.route.includes('Long Xuyên -') || t.route.includes('Cần Thơ -')) && t.status !== 'Đã hủy');
}

let allTripsMeta = loadAllTrips();
let sgcdTripsMeta, cdsgTripsMeta;
refreshTripMetaFilters();

// Sinh dữ liệu ghế mẫu cho các chuyến còn lại (mỗi ghế là 1 khách hàng độc nhất)

let isSyncingFromStorage = false;

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
    driver: 'Trần Văn Hùng (TC-01)',
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
let currentView = 'booking'; // 'booking' | 'history' — goToTripFromHistory() (shared/booking.js) đọc biến này để tự chuyển về màn đặt vé khi cần

window.addEventListener('storage', (e) => {
  if (e.key === HN_STORAGE_KEY || e.key === HN_TRIPS_KEY) {
    if (e.key === HN_TRIPS_KEY) {
      allTripsMeta = loadAllTrips();
      refreshTripMetaFilters();
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

        // Update header details from bank
        const bank = tripSeatBank[currentTripId];
        const headerPlate = document.getElementById('headerPlate');
        if (headerPlate) headerPlate.textContent = bank.plate || '51F-123.45';

        const carTypeEl = document.querySelector('.car-type');
        if (carTypeEl) {
          const svgIcon = carTypeEl.querySelector('svg');
          carTypeEl.innerHTML = '';
          if (svgIcon) carTypeEl.appendChild(svgIcon);
          carTypeEl.appendChild(document.createTextNode(' ' + (bank.vehicleType || 'Limousine 24 Phòng')));
        }

        const headerDriver = document.getElementById('headerDriver');
        if (headerDriver) headerDriver.textContent = bank.driver || 'Trần Văn Hùng';

        const headerHelper = document.getElementById('headerHelper');
        if (headerHelper) headerHelper.textContent = bank.helper || 'Nguyễn Thị Hương';
      }
      renderSeats();
      renderExtraSeats();
      renderSubSeats();
      renderCancelledSeats();
      updateCancelledTabCount();
      renderZone1TripList();
      if (document.getElementById('zone3Passengers') && document.getElementById('zone3Passengers').style.display !== 'none') {
        renderPassengerList();
      }
      if (document.getElementById('zone3Cancelled') && document.getElementById('zone3Cancelled').style.display !== 'none') {
        renderCancelledListTable();
      }
      isSyncingFromStorage = false;
    }
  }
});

let multiSelectMode = false;
let selectionMode = null; // 'transfer' | 'group' | null — loại thao tác đang thực hiện
let selectedSourceSeats = [];
let selectedTargetSeats = [];
let transferSourceTripId = null; // chuyến của các ghế nguồn đang chọn để chuyển
let transferTargetTripId = null; // chuyến đang xem để chọn ghế trống làm đích (có thể khác chuyến nguồn)
let transferSourceCancelId = null; // id bản ghi trong cancelledSeats đang chọn để "chuyển ghế" sang phơi khác (thay vì 1 ghế nguồn còn sống)
let sellFromTransferBarSeats = null; // (các) ghế đang chờ bán nhanh từ thanh chuyển ghế, không qua panel sửa vé — xem sellFromTransferBar()
let currentPanelSeat = null;
let currentPanelSeats = [];
let currentEditSeatCode = null;
let currentPanelMode = 'booking';

// ===== Tabs & Zone 3: Views =====

// Chuyển đổi hiển thị tab (Sơ đồ ghế / Hành khách / Trung chuyển / Ghế hủy)
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
    renderTransshipTables();
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
    const firstStopShort = shortenStopName(item.firstStop) || '—';
    const lastStopShort = shortenStopName(item.lastStop) || '—';
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
        <td style="color:#dc2626; font-weight:600;">${reasonText}</td>
        <td style="color:#6b7280; font-size:13px;">${timeText}</td>
      </tr>
    `;
  }).join('');
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

  // Render Table 1: DANH SÁCH TRUNG CHUYỂN ĐÓN
  if (pickupBody) {
    if (pickupList.length === 0) {
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
          </tr>
        `;
      }).join('');
    }
  }

  // Render Table 2: DANH SÁCH TRUNG CHUYỂN TRẢ
  if (dropoffBody) {
    if (dropoffList.length === 0) {
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
          </tr>
        `;
      }).join('');
    }
  }
}

document.addEventListener('click', function (e) {
  const wrap = document.querySelector('.pax-filter-wrap');
  if (wrap && !wrap.contains(e.target)) document.getElementById('paxFilterDropdown').classList.remove('open');
});

function getAllBookedSeats() {
  return [...seatPlanDown.map(s => ({ ...s, floor: 'down' })), ...seatPlanUp.map(s => ({ ...s, floor: 'up' })), ...extraLeftoverSeats.map(s => ({ ...s, floor: 'extra' }))]
    .filter(s => ['sold', 'hold', 'free', 'cargo'].includes(s.state));
}

// Gom các ghế cùng chung 1 mã vé (ticketNo) thành 1 dòng hành khách duy nhất,
// dùng đúng mã ghế thật trên sơ đồ thay vì suy đoán ghế kế tiếp — đảm bảo
// danh sách ghế và danh sách hành khách luôn thống nhất với nhau.
function groupSeatsByTicket(seats) {
  const map = new Map();
  seats.forEach(s => {
    const key = s.ticketNo || ('T-' + s.code);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(s);
  });
  return Array.from(map.values()).map(members => {
    members.sort((a, b) => a.code.localeCompare(b.code));
    return { main: members[0], members };
  });
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
    if (groups.length === 0) {
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
        </tr>
        `;
      }).join('');
    }
  }

  const countBadge = document.getElementById('paxCountBadge');
  if (countBadge) countBadge.textContent = `${groups.length} khách`;
  const hintEl = document.getElementById('paxResultHint');
  if (hintEl) hintEl.textContent = `(${groups.length} vé / ${groupSeatsByTicket(getAllBookedSeats()).length} vé)`;
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

  const firstStopShort = shortenStopName(seat.firstStop) || '—';
  const lastStopShort = shortenStopName(seat.lastStop) || '—';
  const routeStr = `${firstStopShort} → ${lastStopShort}`;

  const textColor = 'color:var(--black);';
  const displayRoute = isEmpty ? '—' : routeStr;
  const displayFirst = isEmpty ? '—' : firstStopShort;
  const displayLast = isEmpty ? '—' : lastStopShort;
  const custName = isEmpty ? '—' : (seat.customerName || '—');
  const custPhone = isEmpty ? '—' : (seat.phone || '—');
  const noteStr = isEmpty ? (seat.note || '—') : (seatNoteWithReason(seat) || '—');

  const pickupTransferAddr = !isEmpty && seat.transshipStation ? seat.transshipStation : '';
  const dropoffTransferAddr = !isEmpty && seat.arrivalTransfer ? seat.arrivalTransfer : '';
  const firstTitle = pickupTransferAddr ? `Trung chuyển đón: ${pickupTransferAddr}` : displayFirst;
  const lastTitle = dropoffTransferAddr ? `Trung chuyển trả: ${dropoffTransferAddr}` : displayLast;
  const routeTitle = (pickupTransferAddr || dropoffTransferAddr)
    ? `Đón: ${pickupTransferAddr || displayFirst} • Trả: ${dropoffTransferAddr || displayLast}`
    : displayRoute;

  const linesHtml = `
    ${isEmpty ? '' : groupLabelHtml}
    <div class="seat-line route-single-line"><span class="seat-label-full">Chặng đi: </span><span class="seat-stop" title="${routeTitle}">${displayRoute}</span></div>
    <div class="route-split-line">
      <div class="route-split-row"><span class="route-split-label">Đi:</span><span class="seat-stop" title="${firstTitle}">${displayFirst}</span></div>
      <div class="route-split-row"><span class="route-split-label">Đến:</span><span class="seat-stop" title="${lastTitle}">${displayLast}</span></div>
    </div>
    <div class="seat-line" style="${textColor}">KH: ${custName}</div>
    <div class="seat-line" style="${textColor}">SĐT: ${custPhone}</div>
    <div class="seat-note" title="${noteStr}"><span class="seat-label-full">Ghi chú: </span><span class="seat-label-short">GC: </span>${noteStr}</div>
  `;

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

  if (typeof isSyncingFromStorage !== 'undefined' && !isSyncingFromStorage) {
    saveSeatBank();
  }
}
// ===== Zone 2: Vehicle Header & Stats =====

// Cập nhật số liệu thống kê (Đã bán, Đã đặt, Doanh thu, Thu/Nợ)
function updateTripStats() {
  const allSeats = [...seatPlanDown, ...seatPlanUp];
  const totalSeats = allSeats.filter(s => s.state !== 'hidden').length + subSeats.length;
  const bookedSeats = allSeats.filter(s => ['sold', 'hold', 'free', 'cargo'].includes(s.state)).concat(subSeats);
  const soldSeats = bookedSeats.filter(s => s.state === 'sold' || s.state === 'sub');

  let totalRevenue = 0, paidRevenue = 0, unpaidRevenue = 0;
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

  const fmt = val => val.toLocaleString('vi-VN') + 'đ';
  const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  setTxt('statsDaBan', `${soldSeats.length}/${totalSeats}`);
  setTxt('statsDaDat', `${bookedSeats.length}/${totalSeats}`);
  setTxt('statsTongTien', fmt(totalRevenue));
  setTxt('statsDaThu', fmt(paidRevenue));
  setTxt('statsChuaThu', fmt(unpaidRevenue));

  const numEl = document.querySelector('.trip-card.selected .trip-nums .n1');
  if (numEl) numEl.textContent = `${bookedSeats.length}/${totalSeats}`;
}
renderSeats();
renderExtraSeats();
renderSubSeats();
renderCancelledSeats();
updateCancelledTabCount();
renderZone1TripList();

function setZone1Collapsed(collapsed) {
  document.body.classList.toggle('zone1-collapsed', collapsed);
  const btn = document.getElementById('zone1ToggleBtn');
  if (btn) {
    const label = collapsed ? 'Hiện zone 1' : 'Ẩn zone 1';
    btn.setAttribute('aria-label', label);
    btn.title = label;
  }
  try { localStorage.setItem(ZONE1_COLLAPSED_KEY, collapsed ? '1' : '0'); } catch (e) { }
}

function toggleZone2Grid() {
  const zone2 = document.querySelector('.zone2');
  const btn = document.querySelector('.z2-collapse-btn');
  if (!zone2 || !btn) return;
  const isCollapsed = zone2.classList.toggle('collapsed');
  const text = btn.querySelector('.collapse-text');
  const svg = btn.querySelector('svg');
  if (text) text.textContent = isCollapsed ? 'Mở rộng' : 'Thu gọn';
  btn.title = (isCollapsed ? 'Mở rộng' : 'Thu gọn') + ' thông tin xe';
  if (svg) svg.style.transform = isCollapsed ? 'rotate(180deg)' : 'none';
}

try {
  setZone1Collapsed(localStorage.getItem(ZONE1_COLLAPSED_KEY) === '1');
} catch (e) { }

// ===== Seat Selection & Transfer =====

// Xử lý sự kiện nhấp chuột chọn ghế trên sơ đồ
function onSeatClick(ev, code) {
  if (ev.detail > 1) { return; }
  const seat = findSeat(code);
  if (seat && seat.phone) {
    fillSearchInputWithPhone(seat.phone);
  }
  if (seat.locked) { showToast(`Ghế ${code} đang được ${seat.lockedBy} thao tác`); return; }

  // Ghế dư (extraLeftoverSeats) dùng chung luồng "chuyển ghế" (chọn nguồn -> chọn ghế trống bất kỳ,
  // kể cả sang phơi khác) với ghế thường thay vì mở riêng modal — cùng nhánh OCCUPIED_STATES bên dưới,
  // vì ghế dư luôn ở 1 trong các trạng thái sold/hold/free/cargo giống ghế thường.
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

/* ---- Seat context menu (Hủy vé / Chuyển vé) ---- */
document.addEventListener('click', (e) => {
  if (!e.target.closest('#seatMenu') && !e.target.closest('.seat-card')) closeSeatMenu();
});

function confirmTransfer() {
  if (!multiSelectMode || !selectedSourceSeats.length || !selectedTargetSeats.length) {
    showToast('Vui lòng chọn ít nhất 1 ghế đã đặt và 1 ghế trống');
    return;
  }

  const pairCount = Math.min(selectedSourceSeats.length, selectedTargetSeats.length);
  if (pairCount === 0) { showToast('Vui lòng chọn ít nhất 1 ghế trống để chuyển'); return; }
  const sourceTripId = transferSourceTripId || currentTripId;
  const targetTripId = transferTargetTripId || currentTripId;

  let extraSeatsChanged = false;
  // Ghế đích của các ghế NGUỒN đã bán (state 'sold') — in lại vé cho đúng mã ghế/chuyến mới sau khi
  // chuyển, vì vé giấy khách đang cầm giờ ghi sai mã ghế/chuyến cũ.
  const reprintSeats = [];
  for (let i = 0; i < pairCount; i++) {
    const sourceSeat = findSeatInTrip(sourceTripId, selectedSourceSeats[i]);
    const targetSeat = findSeatInTrip(targetTripId, selectedTargetSeats[i]);
    if (!sourceSeat || !OCCUPIED_STATES.includes(sourceSeat.state) || !targetSeat || targetSeat.state !== 'empty') continue;

    const wasSold = sourceSeat.state === 'sold';

    Object.assign(targetSeat, {
      state: sourceSeat.state,
      firstStop: sourceSeat.firstStop,
      lastStop: sourceSeat.lastStop,
      phone: sourceSeat.phone,
      note: sourceSeat.note,
      customerName: sourceSeat.customerName,
      pickupTime: sourceSeat.pickupTime,
      ticketNo: sourceSeat.ticketNo,
      paid: sourceSeat.paid,
      count: sourceSeat.count,
      hasLuggage: sourceSeat.hasLuggage,
      luggageNote: sourceSeat.luggageNote,
      guestType: sourceSeat.guestType,
      transshipStation: sourceSeat.transshipStation,
      arrivalTransfer: sourceSeat.arrivalTransfer,
      price: sourceSeat.price,
      zeroPriceReason: sourceSeat.zeroPriceReason,
      depositAmount: sourceSeat.depositAmount,
      depositMethod: sourceSeat.depositMethod,
      paymentMethod: sourceSeat.paymentMethod
    });

    if (wasSold) reprintSeats.push(targetSeat);

    // Ghế dư không phải "mã ghế thật" của xe hiện tại (đã mất khi đổi loại xe) — chuyển đi xong thì
    // phải XOÁ khỏi extraLeftoverSeats hẳn, không thể clearSeatToEmpty() như ghế thường (sẽ để lại
    // 1 dòng "ghế dư trống" vô nghĩa trong danh sách).
    const extraIdx = extraLeftoverSeats.indexOf(sourceSeat);
    if (extraIdx > -1) {
      extraLeftoverSeats.splice(extraIdx, 1);
      extraSeatsChanged = true;
    } else {
      clearSeatToEmpty(sourceSeat);
    }
  }

  renderSeats();
  if (extraSeatsChanged) renderExtraSeats();
  if (document.getElementById('zone3Passengers').style.display !== 'none') renderPassengerList();
  exitMultiSelectMode();
  // Không tự động in lại vé cho ghế đã bán vừa chuyển — chỉ nhắc để nhân viên tự bấm "In lại vé"
  // trong panel xem thông tin ghế đó khi cần (xem reprintCurrentPanelTicket()).
  if (reprintSeats.length) {
    const codes = reprintSeats.map(s => s.code).join(', ');
    showToast(`Đã chuyển ${pairCount} ghế thành công — ghế ${codes} đã bán, mở lại ghế để bấm "In lại vé" cho khách`);
  } else {
    showToast(`Đã chuyển ${pairCount} ghế thành công`);
  }
}

/* Đưa ghế về trạng thái trống hoàn toàn — không giữ lại bất kỳ thông tin khách nào */
function clearSeatToEmpty(seat) {
  Object.assign(seat, {
    state: 'empty', count: 1, customerName: null, phone: null, firstStop: null,
    lastStop: null, note: null, staff: null, callState: null, pickupTime: null,
    ticketNo: null, paid: false, hasLuggage: false, guestType: null,
    transshipStation: null, arrivalTransfer: null, zeroPriceReason: null,
    luggageNote: null, paymentMethod: null
  });
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

  updateTicketQR();
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

function buildScannableQRText() {
  return 'https://caolinh2412.github.io/demo/';
}

function updateTicketQR() {
  const qrImg = document.getElementById('t_qr_img');
  if (!qrImg) return;
  const qrUrl = buildScannableQRText();

  qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=1&data=${encodeURIComponent(qrUrl)}`;
  qrImg.title = "Mã QR xác nhận vé lên xe — Nhấp để mở https://caolinh2412.github.io/demo/";
  qrImg.onclick = () => window.open(qrUrl, '_blank');
}

// Dựng đúng phần NỘI DUNG 1 tờ vé (không kèm <html>/<head>) — dùng chung cho cả in 1 vé
// (buildTicketPrintHtml) lẫn in nhiều vé gộp chung 1 cửa sổ (buildMultiTicketPrintHtml).
function buildTicketPageHtml(d) {
  return `
    <div class="brand-header">
      <div class="brand-badge">HN</div>
      <div class="brand-name">HUỆ NGHĨA EXPRESS</div>
      <div class="brand-sub">Hệ thống Đặt vé & Trung chuyển Chuyên nghiệp</div>
    </div>

    <div class="ticket-title">VÉ XE KHÁCH</div>
    <div class="dash-line"></div>

    <div class="kv-row"><span class="kv-label">Mã vé:</span><span class="kv-val">${d.ticketNo}</span></div>
    <div class="kv-row"><span class="kv-label">Ngày in:</span><span class="kv-val">${d.nowStr}</span></div>

    <div class="dash-line"></div>

    <div class="seat-box">SỐ GHẾ: ${d.seatsText}</div>

    <div class="kv-row"><span class="kv-label">Hành khách:</span><span class="kv-val">${d.customerName}</span></div>
    <div class="kv-row"><span class="kv-label">Điện thoại:</span><span class="kv-val">${d.phone}</span></div>
    <div class="kv-row"><span class="kv-label">Tuyến xe:</span><span class="kv-val">${d.route}</span></div>
    <div class="kv-row"><span class="kv-label">Giờ xuất bến:</span><span class="kv-val">${d.time}</span></div>
    <div class="kv-row"><span class="kv-label">Trạm đi:</span><span class="kv-val">${d.fromStation}</span></div>
    <div class="kv-row"><span class="kv-label">Trạm đến:</span><span class="kv-val">${d.toStation}</span></div>

    <div class="dash-line"></div>

    <div class="kv-row"><span class="kv-label">Đơn giá:</span><span class="kv-val">${d.unitPrice.toLocaleString('vi-VN')}đ/vé</span></div>
    <div class="total-price-box">TỔNG TIỀN: ${d.totalPrice.toLocaleString('vi-VN')}đ</div>
    <div class="kv-row"><span class="kv-label">Thanh toán:</span><span class="kv-val">${d.paymentMethod}</span></div>

    <div class="qr-container">
      <img class="qr-img" src="${d.qrImgUrl}" alt="Mã QR Lên Xe">
      <div style="font-weight:800; font-size:11.5px; margin-top:2px;">MÃ QR XÁC NHẬN LÊN XE</div>
      <div style="font-size:10px; color:#555;">Quét mã QR để kiểm tra trạng thái lên xe</div>
    </div>

    <div class="footer-note">
      <b>Cảm ơn quý khách đã chọn Huệ Nghĩa Express!</b><br>
      Tổng đài đặt vé & hỗ trợ: <b>1900 63 64 99</b>
    </div>
  `;
}

const TICKET_PRINT_STYLE = `
  @page { size: 80mm auto; margin: 0; }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    margin: 0;
    color: #111213;
    background: #fff;
    font-size: 12.5px;
    line-height: 1.35;
  }
  .ticket-page { width: 76mm; margin: 0 auto; padding: 12px 6px; }
  .ticket-page + .ticket-page { page-break-before: always; }
  .brand-header {
    text-align: center;
    border-bottom: 2px solid #000;
    padding-bottom: 8px;
    margin-bottom: 8px;
  }
  .brand-badge {
    display: inline-block;
    background: #C20D08;
    color: #fff;
    font-weight: 900;
    font-size: 16px;
    padding: 2px 8px;
    border-radius: 4px;
    margin-bottom: 4px;
  }
  .brand-name { font-size: 17px; font-weight: 900; letter-spacing: 0.5px; color: #000; }
  .brand-sub { font-size: 11px; font-weight: 600; color: #444; }
  .ticket-title { font-size: 15px; font-weight: 900; text-align: center; margin: 8px 0 4px; text-transform: uppercase; }
  .dash-line { border-bottom: 1px dashed #000; margin: 6px 0; }
  .kv-row { display: flex; justify-content: space-between; font-size: 12.5px; margin: 4px 0; }
  .kv-label { color: #333; font-weight: 600; }
  .kv-val { font-weight: 700; text-align: right; }
  .seat-box {
    font-size: 21px;
    font-weight: 900;
    text-align: center;
    border: 2px solid #000;
    padding: 6px;
    margin: 8px 0;
    background: #fafafa;
  }
  .total-price-box {
    text-align: center;
    font-size: 16px;
    font-weight: 900;
    margin: 8px 0;
    padding: 6px;
    border: 1px solid #000;
    background: #f0f0f0;
  }
  .qr-container {
    text-align: center;
    margin-top: 10px;
    padding-top: 8px;
    border-top: 1px dashed #000;
  }
  .qr-img { width: 140px; height: 140px; display: block; margin: 0 auto 6px; border: 1px solid #ccc; padding: 4px; background: #fff; }
  .footer-note { text-align: center; font-size: 10.5px; margin-top: 10px; line-height: 1.4; color: #333; }
`;

// Dựng HTML đầy đủ (kể cả <style> in nhiệt 80mm) cho cửa sổ in — 1 vé duy nhất.
function buildTicketPrintHtml(d) {
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
    <meta charset="UTF-8">
    <title>In Vé Xe Huệ Nghĩa - ${d.ticketNo}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>${TICKET_PRINT_STYLE}</style>
    </head>
    <body>
    <div class="ticket-page">${buildTicketPageHtml(d)}</div>
    <script>
      window.onload = function() {
        setTimeout(function() {
          window.print();
        }, 400);
      };
    </script>
    </body>
    </html>
  `;
}

// Dựng 1 cửa sổ in DUY NHẤT chứa NHIỀU tờ vé nối tiếp nhau (mỗi tờ 1 trang in riêng nhờ
// page-break-before), thay vì gọi window.open() nhiều lần — trình duyệt chặn popup nếu mở nhiều
// cửa sổ liên tiếp trong cùng 1 lần bấm nên in riêng từng ghế bằng nhiều window.open() thực tế chỉ
// ra được đúng 1 vé đầu, các vé sau bị chặn âm thầm (không báo lỗi gì).
function buildMultiTicketPrintHtml(dataList) {
  const pagesHtml = dataList.map(d => `<div class="ticket-page">${buildTicketPageHtml(d)}</div>`).join('');
  const titleTicketNo = dataList.length ? dataList[0].ticketNo : '';
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
    <meta charset="UTF-8">
    <title>In Vé Xe Huệ Nghĩa - ${titleTicketNo}${dataList.length > 1 ? ` (+${dataList.length - 1})` : ''}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>${TICKET_PRINT_STYLE}</style>
    </head>
    <body>
    ${pagesHtml}
    <script>
      window.onload = function() {
        setTimeout(function() {
          window.print();
        }, 400);
      };
    </script>
    </body>
    </html>
  `;
}

// Chuẩn bị dữ liệu hiển thị cho 1 tờ vé (không mở cửa sổ in) — tách khỏi printTicket() để dùng lại
// được cho cả in nhiều vé gộp chung 1 cửa sổ (xem printTicketsSeparately()).
function buildTicketPrintData(seats) {
  const currentTrip = (allTripsMeta && allTripsMeta.find(t => t.id === currentTripId)) || { route: 'Sài Gòn - Châu Đốc', time: '07:00' };
  const firstSeat = seats[0];
  const seatsText = seats.map(s => s.code).join(', ');
  const ticketNo = firstSeat.ticketNo || ('SGCD-' + String(Math.floor(1000 + Math.random() * 9000)));
  const customerName = firstSeat.customerName || document.getElementById('f_name').value.trim() || 'Khách lẻ';
  const phone = firstSeat.phone || collectPhoneValues('f_phone', 'f_phone_extra') || '—';
  const fromStation = firstSeat.firstStop || getStationValue().trim() || 'Trạm Kinh Dương Vương';
  const toStation = firstSeat.lastStop || document.getElementById('f_destination').value.trim() || 'Trạm Châu Đốc';
  const unitPrice = firstSeat.price || getEditedPrice();
  const totalPrice = unitPrice * seats.length;
  const route = currentTrip.route || 'Sài Gòn - Châu Đốc';
  const time = currentTrip.time || '07:00';
  const paymentMethod = firstSeat.paymentMethod || 'Tiền mặt';

  const qrText = buildScannableQRText(ticketNo, seatsText, customerName, phone, route, time);
  const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=1&data=${encodeURIComponent(qrText)}`;

  const now = new Date();
  const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('vi-VN');
  const nowStr = `${timeStr} - ${dateStr}`;

  return {
    ticketNo, nowStr, seatsText, customerName, phone, route, time,
    fromStation, toStation, unitPrice, totalPrice, qrImgUrl, paymentMethod
  };
}

function printTicket(seats) {
  if (!seats || seats.length === 0) return;
  const printHtml = buildTicketPrintHtml(buildTicketPrintData(seats));
  const printWin = window.open('', '_blank', 'width=450,height=600');
  if (printWin) {
    printWin.document.open();
    printWin.document.write(printHtml);
    printWin.document.close();
  }
}

/* Nút "In lại vé" trong panel xem thông tin ghế đã bán (chỉ hiện khi panel ở chế độ chỉ xem — xem
   openBookingPanel() ở js/shared/ui.js) — nhân viên chủ động bấm khi cần, không tự động in (VD:
   sau khi chuyển ghế đã bán sang ghế khác). */
function reprintCurrentPanelTicket() {
  const seats = currentPanelSeats.length ? currentPanelSeats : (currentPanelSeat ? [currentPanelSeat] : []);
  if (!seats.length) return;
  printTicketsSeparately(seats);
}

function focusPriceEdit() {
  const el = document.getElementById('t_price');
  if (!el) return;
  el.contentEditable = "true";
  el.focus();
  try {
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  } catch (e) { }
}

function onPriceEdit() {
  const el = document.getElementById('t_price');
  if (!el) return;
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
  if (!seatsTarget.length) { closePanel(); return; }

  if (currentPanelMode === 'edit' && currentPanelSeat) {
    const seat = currentPanelSeat;
    applyFormToSeat(seat);
    syncDepositToTicketGroup(seat);
    renderSeats();
    saveSeatBank();
    if (document.getElementById('zone3Passengers').style.display !== 'none') renderPassengerList();
    closePanel();
    showToast(`Đã cập nhật thông tin ghế ${seat.code}`);
    return;
  }

  const groupTicketNo = "SGCD-" + String(ticketSeq++).padStart(4, '0');
  seatsTarget.forEach(seat => {
    applyFormToSeat(seat);
    seat.ticketNo = groupTicketNo;
    seat.paid = false;
    seat.count = seatsTarget.length;
    // Ghế có baga vẫn ghi seat.hasLuggage bình thường, không còn chuyển sang state 'cargo' riêng
    // (đã bỏ loại ghế màu xanh biển trên sơ đồ) — luôn giữ 'hold' như ghế đặt thường.
    seat.state = 'hold';
  });

  renderSeats();
  saveSeatBank();
  if (document.getElementById('zone3Passengers').style.display !== 'none') renderPassengerList();

  closePanel();
  showToast(seatsTarget.length > 1 ? 'Đã đặt vé nhóm thành công' : 'Đã đặt vé thành công');
  if (typeof multiSelectMode !== 'undefined' && multiSelectMode) {
    if (typeof exitMultiSelectMode === 'function') exitMultiSelectMode();
  }
}

/* ---- Bán vé trực tiếp: xác nhận bán và chuyển ghế sang trạng thái đã bán (màu đỏ) ---- */
function sellTicket() {
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

  const seatsToSell = currentPanelSeats.length ? currentPanelSeats : (currentPanelSeat ? [currentPanelSeat] : []);
  if (!seatsToSell.length) { closePanel(); return; }

  // Form hợp lệ — chưa bán ngay, mở modal bắt buộc chọn phương thức thanh toán trước khi thật sự bán
  // + in vé. Việc bán vé thật sự chuyển sang confirmSellPayment().
  document.querySelectorAll('input[name="sellPaymentMethod"]').forEach(r => { r.checked = r.value === 'Tiền mặt'; });
  document.getElementById('sellPaymentModal').classList.add('open');
}

function closeSellPaymentModal() {
  document.getElementById('sellPaymentModal').classList.remove('open');
}

function confirmSellPayment() {
  const paymentMethod = document.querySelector('input[name="sellPaymentMethod"]:checked')?.value || 'Tiền mặt';

  // Bán nhanh từ thanh chuyển ghế (sellFromTransferBar()) — các ghế này có thể thuộc nhiều vé/khách
  // khác nhau nên KHÔNG đi qua panel sửa vé (không có 1 bộ dữ liệu chung để hiện), chỉ đánh dấu đã
  // bán bằng đúng dữ liệu sẵn có của từng ghế, không đụng tới thông tin khách/tuyến/giá/cọc.
  if (sellFromTransferBarSeats && sellFromTransferBarSeats.length) {
    const seats = sellFromTransferBarSeats;
    sellFromTransferBarSeats = null;
    seats.forEach(seat => {
      seat.paid = true;
      seat.state = 'sold';
      seat.paymentMethod = paymentMethod;
    });
    renderSeats();
    saveSeatBank();
    if (document.getElementById('zone3Passengers').style.display !== 'none') renderPassengerList();
    closeSellPaymentModal();
    showToast(seats.length > 1
      ? `Đã bán vé thành công cho ${seats.length} ghế`
      : `Đã bán vé thành công — Ghế ${seats[0].code}`);
    printTicketsSeparately(seats);
    return;
  }

  const type = document.getElementById('f_type').value;
  const editedPrice = getEditedPrice();
  const depositEnabled = document.getElementById('f_deposit_enabled').checked;
  const depositAmountRaw = parseInt(document.getElementById('f_deposit_amount').value, 10) || 0;

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
    seat.paymentMethod = paymentMethod;
  };

  const seatsToSell = currentPanelSeats.length ? currentPanelSeats : (currentPanelSeat ? [currentPanelSeat] : []);
  if (!seatsToSell.length) { closeSellPaymentModal(); closePanel(); return; }

  const groupTicketNo = (currentPanelMode === 'edit' && currentPanelSeat && currentPanelSeat.ticketNo)
    ? currentPanelSeat.ticketNo
    : ("SGCD-" + String(ticketSeq++).padStart(4, '0'));

  seatsToSell.forEach(seat => {
    applyFormToSeat(seat);
    seat.ticketNo = seat.ticketNo || groupTicketNo;
    seat.paid = true;
    seat.count = seatsToSell.length;
    seat.state = 'sold'; // Bán vé -> ghế chuyển sang màu đỏ (đã bán)
    syncDepositToTicketGroup(seat);
  });

  renderSeats();
  saveSeatBank();
  if (document.getElementById('zone3Passengers').style.display !== 'none') renderPassengerList();

  closeSellPaymentModal();
  closePanel();
  showToast(seatsToSell.length > 1
    ? 'Đã bán vé thành công cho ' + seatsToSell.length + ' ghế'
    : 'Đã bán vé thành công — Ghế ' + seatsToSell[0].code);
  if (typeof multiSelectMode !== 'undefined' && multiSelectMode) {
    if (typeof exitMultiSelectMode === 'function') exitMultiSelectMode();
  }

  // In vé trực tiếp có mã QR xác nhận lên xe — in riêng từng ghế 1 tờ, kể cả vé nhóm nhiều ghế
  // (xem printTicketsSeparately()), không gộp chung nhiều ghế vào 1 tờ vé nữa.
  printTicketsSeparately(seatsToSell);
}

/* In riêng 1 tờ vé cho MỖI ghế (kể cả các ghế cùng 1 vé nhóm) thay vì gộp chung như trước — áp dụng
   cho mọi luồng bán vé (bán qua panel lẫn bán nhanh từ thanh chuyển ghế). Số vé (ticketNo) trên từng
   tờ vẫn đúng vì mỗi ghế tự mang sẵn ticketNo chung của cả nhóm, chỉ khác là giá/route hiện đúng theo
   từng ghế thay vì cộng gộp cả nhóm.
   Gộp tất cả các tờ vào CHUNG 1 cửa sổ in (mỗi tờ 1 trang, ngăn cách bằng page-break) thay vì gọi
   window.open() riêng cho từng tờ — gọi nhiều window.open() liên tiếp trong cùng 1 lần bấm sẽ bị
   trình duyệt chặn popup từ tờ thứ 2 trở đi (chỉ tờ đầu mở được, không báo lỗi gì nên nhìn như "chỉ
   in được 1 vé"). */
function printTicketsSeparately(seats) {
  if (!seats || seats.length === 0) return;
  const dataList = seats.map(seat => buildTicketPrintData([seat]));
  const printHtml = buildMultiTicketPrintHtml(dataList);
  const printWin = window.open('', '_blank', 'width=450,height=600');
  if (printWin) {
    printWin.document.open();
    printWin.document.write(printHtml);
    printWin.document.close();
  }
}

/* Bán nhanh (các) ghế đang chọn làm nguồn ở thanh chuyển ghế — không mở panel sửa vé (các ghế có thể
   thuộc nhiều vé/khách khác nhau nên không có 1 bộ dữ liệu chung để hiện lên panel), chỉ hỏi xác nhận
   phương thức thanh toán rồi đánh dấu đã bán, giữ nguyên toàn bộ thông tin khách/tuyến/giá/cọc sẵn có
   của từng ghế. Chỉ khả dụng khi tất cả ghế đó chưa bán và đang ở đúng chuyến hiện xem (xem điều kiện
   hiện nút trong updateTransferHint() ở js/shared/booking.js). */
function sellFromTransferBar() {
  if (transferSourceCancelId || !selectedSourceSeats.length || transferSourceTripId !== currentTripId) return;
  const seats = selectedSourceSeats.map(code => findSeatInTrip(transferSourceTripId, code)).filter(Boolean);
  if (!seats.length || seats.some(s => s.state === 'sold')) {
    showToast('Chỉ có thể bán ghế chưa bán');
    return;
  }
  exitMultiSelectMode();
  sellFromTransferBarSeats = seats;
  document.querySelectorAll('input[name="sellPaymentMethod"]').forEach(r => { r.checked = r.value === 'Tiền mặt'; });
  document.getElementById('sellPaymentModal').classList.add('open');
}

/* In lại vé cho (các) ghế đang chọn làm nguồn ở thanh chuyển ghế — chỉ khả dụng khi tất cả ghế đó
   ĐÃ bán và đang ở đúng chuyến hiện xem (xem điều kiện hiện nút trong updateTransferHint() ở
   js/shared/booking.js). Không thoát chế độ chuyển ghế sau khi in — in vé không đổi dữ liệu gì nên
   nhân viên có thể tiếp tục bấm "Chuyển ghế" ngay sau đó nếu cần. */
function reprintFromTransferBar() {
  if (transferSourceCancelId || !selectedSourceSeats.length || transferSourceTripId !== currentTripId) return;
  const seats = selectedSourceSeats.map(code => findSeatInTrip(transferSourceTripId, code)).filter(Boolean);
  if (!seats.length || seats.some(s => s.state !== 'sold')) {
    showToast('Chỉ có thể in lại vé cho ghế đã bán');
    return;
  }
  printTicketsSeparately(seats);
}

/* ---- Modal chỉ định xe: đổi loại xe -> đổi sơ đồ ghế ---- */

// Vehicle type config successfully initialized at the top of the file

// Chuyển sơ đồ ghế hiện tại sang đúng số lượng/khung ghế của loại xe được chọn.
// Ghế nào giữ nguyên mã ở xe mới thì giữ nguyên toàn bộ thông tin khách (VD: khách A1 xe 36 chỗ
// chuyển sang xe 34 chỗ vẫn ở A1). Ghế đang có khách nhưng mã đó không còn tồn tại ở xe mới
// (VD: khách ở B3 xe 36 chỗ chuyển sang xe 34 chỗ - không có B3) sẽ dồn xuống danh sách "Ghế dư".
function applyVehicleType(typeLabel) {
  if (!typeLabel || !VEHICLE_TYPE_SEATS[typeLabel]) return;

  const target = getSeatCodesForVehicleType(typeLabel);
  const targetCodes = new Set([...target.down, ...target.up]);

  // Gom toàn bộ ghế đang có (kể cả ghế dư từ lần đổi trước) để tra cứu theo mã.
  const allCurrentSeats = [...seatPlanDown, ...seatPlanUp, ...extraLeftoverSeats];
  const seatByCode = {};
  allCurrentSeats.forEach(s => { seatByCode[s.code] = s; });

  seatPlanDown = target.down.map(code => {
    if (code.endsWith('_hidden')) return { code, state: 'hidden' };
    return seatByCode[code] ? { ...seatByCode[code], code } : makeSeat(code, "empty");
  });
  seatPlanUp = target.up.map(code => {
    if (code.endsWith('_hidden')) return { code, state: 'hidden' };
    return seatByCode[code] ? { ...seatByCode[code], code } : makeSeat(code, "empty");
  });

  // Save to bank so changes persist when switching trips
  if (tripSeatBank[currentTripId]) {
    tripSeatBank[currentTripId].down = seatPlanDown;
    tripSeatBank[currentTripId].up = seatPlanUp;
    // Thiếu dòng này khiến listener 'storage' (kích hoạt bởi saveSeatBank() ở cuối hàm) render lại
    // .car-type từ tripSeatBank[currentTripId].vehicleType — nếu không cập nhật ở đây, nó lấy giá trị
    // cũ/mặc định và ghi đè ngay lên .car-type vừa đổi phía dưới, khiến mở lại modal thấy loại xe cũ.
    tripSeatBank[currentTripId].vehicleType = typeLabel;
  }

  // Update header vehicle label
  const carTypeEl = document.querySelector('.car-type');
  if (carTypeEl) {
    const svgIcon = carTypeEl.querySelector('svg');
    carTypeEl.innerHTML = '';
    if (svgIcon) carTypeEl.appendChild(svgIcon);
    carTypeEl.appendChild(document.createTextNode(' ' + typeLabel));
  }

  // Update trip card subtext in the sidebar list
  const selectedTripCard = document.querySelector('.trip-card.selected');
  if (selectedTripCard) {
    const subEl = selectedTripCard.querySelector('.trip-sub');
    if (subEl) {
      const parts = subEl.textContent.split('•');
      subEl.textContent = parts[0].trim() + ' • ' + typeLabel;
    }
  }

  // Ghế dư: có khách (không phải ghế trống) nhưng mã không còn trong sơ đồ xe mới.
  extraLeftoverSeats = allCurrentSeats.filter(s => !targetCodes.has(s.code) && ['sold', 'hold', 'free', 'cargo'].includes(s.state));

  if (tripSeatBank[currentTripId]) {
    tripSeatBank[currentTripId].extraSeats = extraLeftoverSeats;
  }

  renderSeats();
  renderExtraSeats();
}

function renderExtraSeats() {
  const section = document.getElementById('extraSeatsSection');
  const list = document.getElementById('extraSeatsList');
  if (!section || !list) return;
  if (extraLeftoverSeats.length === 0) {
    section.style.display = 'none';
    list.innerHTML = '';
    return;
  }
  section.style.display = '';

  // Align columns configuration with the main seat map
  const totalSeats = [...seatPlanDown, ...seatPlanUp].filter(s => s.state !== 'hidden').length;
  const useThreeCols = totalSeats >= 34;
  list.classList.toggle('cols-3', useThreeCols);

  const ticketGroupMap = buildTicketGroupMap();
  list.innerHTML = extraLeftoverSeats.map(s => seatCard(s, ticketGroupMap)).join('');
}

/* ===================== GHẾ PHỤ (chỉ ghi chú + giá tiền) ===================== */

let currentCancelSeatCode = null;

function openCancelModal(code) {
  if (blockIfMultiSelectActive()) return;
  currentCancelSeatCode = code;
  const codeEl = document.getElementById('cancelSeatCode');
  const reasonEl = document.getElementById('cancelReason');
  const btn = document.getElementById('confirmCancelBtn');
  if (codeEl) codeEl.textContent = code;
  if (reasonEl) reasonEl.value = '';
  if (btn) btn.disabled = true;
  const modal = document.getElementById('cancelModal');
  if (modal) modal.classList.add('open');
}

function checkCancelReason() {
  const reasonEl = document.getElementById('cancelReason');
  const btn = document.getElementById('confirmCancelBtn');
  if (reasonEl && btn) {
    btn.disabled = !reasonEl.value.trim();
  }
}

function confirmCancel() {
  const code = currentCancelSeatCode;
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
  renderCancelledSeats();
  updateCancelledTabCount();
  if (document.getElementById('zone3Cancelled') && document.getElementById('zone3Cancelled').style.display !== 'none') {
    renderCancelledListTable();
  }
  updateTripStats();
  updatePassengerTabCount();
  showToast(`Đã hủy ghế ${seat.code}. Lý do: ${reason}`);
}

let editingSubSeatCode = null;

function saveSubSeat() {
  const note = document.getElementById('subSeatNote').value.trim();

  if (editingSubSeatCode) {
    const seat = subSeats.find(s => s.code === editingSubSeatCode);
    if (seat) {
      seat.note = note;
      // Giá tiền không được sửa, giữ nguyên giá đã lưu trước đó
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

function openAssignModal() {
  document.getElementById('assignModal').classList.add('open');
  document.getElementById('driverWarn').style.display = 'none';

  // Pre-select current vehicle type and add to select options if missing
  const carTypeEl = document.querySelector('.car-type');
  if (carTypeEl) {
    const cloned = carTypeEl.cloneNode(true);
    const svg = cloned.querySelector('svg');
    if (svg) svg.remove();
    const currentType = cloned.textContent.trim();

    const select = document.getElementById('vehicleTypeSelect');
    if (select) {
      let exists = false;
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].value === currentType) {
          exists = true;
          select.selectedIndex = i;
          break;
        }
      }
      if (!exists) {
        const newOpt = new Option(currentType, currentType);
        select.add(newOpt, 1); // Insert right after the placeholder
        select.selectedIndex = 1;
      }
    }
  }

  // Pre-populate plate and add to select options if missing, plus driver and helper
  const headerPlate = document.getElementById('headerPlate');
  const headerDriver = document.getElementById('headerDriver');
  const headerHelper = document.getElementById('headerHelper');

  if (headerPlate) {
    const currentPlate = headerPlate.textContent.trim();
    const plateSelect = document.getElementById('plateSelect');
    if (plateSelect) {
      let exists = false;
      for (let i = 0; i < plateSelect.options.length; i++) {
        if (plateSelect.options[i].value === currentPlate) {
          exists = true;
          plateSelect.selectedIndex = i;
          break;
        }
      }
      if (!exists) {
        const newOpt = new Option(currentPlate, currentPlate);
        plateSelect.add(newOpt, 0); // Insert at the top
        plateSelect.selectedIndex = 0;
      }
    }
  }
  if (headerDriver && document.getElementById('driverSelect')) {
    const val = headerDriver.textContent.trim();
    document.getElementById('driverSelect').value = val;
    dropdownState['driverDropdownContainer'] = { value: val, label: val };
    document.querySelectorAll('#driverDropdownPanel .dropdown-item').forEach(item => {
      item.classList.toggle('active', item.dataset.value === val);
    });
  }
  if (headerHelper && document.getElementById('helperSelect')) {
    const val = headerHelper.textContent.trim();
    document.getElementById('helperSelect').value = val;
    dropdownState['helperDropdownContainer'] = { value: val, label: val };
    document.querySelectorAll('#helperDropdownPanel .dropdown-item').forEach(item => {
      item.classList.toggle('active', item.dataset.value === val);
    });
  }
}
function checkDriverConflict() {
  const conflict = document.getElementById('driverSelect').value.includes('trùng lịch');
  document.getElementById('driverWarn').style.display = conflict ? 'flex' : 'none';
}
function saveAssign() {
  if (document.getElementById('driverWarn').style.display === 'flex') { showToast('Vui lòng chọn tài xế khác trước khi lưu (BR-07)'); return; }

  const select = document.getElementById('vehicleTypeSelect');
  if (select && select.value) {
    applyVehicleType(select.value);
  }

  // Update header info dynamically
  const plateVal = document.getElementById('plateSelect').value;
  const driverVal = document.getElementById('driverSelect').value;
  const helperVal = document.getElementById('helperSelect').value;

  const headerPlate = document.getElementById('headerPlate');
  const headerDriver = document.getElementById('headerDriver');
  const headerHelper = document.getElementById('headerHelper');

  if (headerPlate) headerPlate.textContent = plateVal;
  if (headerDriver) headerDriver.textContent = driverVal;
  if (headerHelper) headerHelper.textContent = helperVal;

  if (tripSeatBank[currentTripId]) {
    tripSeatBank[currentTripId].plate = plateVal;
    tripSeatBank[currentTripId].driver = driverVal;
    tripSeatBank[currentTripId].helper = helperVal;
  }

  saveSeatBank();
  renderZone1TripList();

  closeModal('assignModal');
  showToast('Đã lưu thông tin chỉ định xe');
}

/* ---- Modal khởi hành xe ---- */
function openDepartModal() {
  const tripEl = document.getElementById('tripTitle');
  const infoEl = document.getElementById('departTripInfo');
  if (tripEl && infoEl) infoEl.textContent = tripEl.textContent.trim();
  document.getElementById('departModal').classList.add('open');
}
function confirmDepart() {
  const tripEl = document.getElementById('tripTitle');
  closeModal('departModal');
  showToast('Xe đã khởi hành: ' + (tripEl ? tripEl.textContent.trim() : ''));
}

/* ---- Toast ---- */
let toastTimer;

/* ---- Search dropdown (SB-01) ---- */
document.getElementById('searchInput').addEventListener('focus', () => {
  if (typeof currentView !== 'undefined' && (currentView === 'pickup' || currentView === 'history')) return;
  toggleSearchResults(true);
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-wrap')) document.getElementById('searchResults').classList.remove('open');
  if (!e.target.closest('#directionDropdown') && !e.target.closest('#directionTrigger')) {
    const panel = document.getElementById('directionDropdown');
    if (panel) panel.classList.remove('open');
  }
  if (!e.target.closest('#routeDropdown') && !e.target.closest('#routeTrigger')) {
    const panel = document.getElementById('routeDropdown');
    if (panel) panel.classList.remove('open');
  }

  // Close searchable dropdowns (Driver & Helper) and save values if clicked outside
  document.querySelectorAll('.searchable-dropdown').forEach(container => {
    const panel = container.querySelector('.dropdown-panel');
    if (panel && panel.classList.contains('open') && !container.contains(e.target)) {
      panel.classList.remove('open');

      const input = container.querySelector('input');
      const state = dropdownState[container.id];
      if (input && state) {
        state.label = input.value;
        state.value = input.value;
      }
    }
  });
});

function fillSearchInputWithPhone(phone) {
  const input = document.getElementById('searchInput');
  if (input) input.value = phone;
}

/* ---- Zone 1: Trip list select ---- */
function selectTrip(el, time, routeLabel) {
  if (customerHistoryActive) closeCustomerHistory();
  document.querySelectorAll('.trip-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('tripTitle').textContent = time + ' - ' + (routeLabel || 'Sài Gòn - Châu Đốc');
  const tripId = el.dataset.trip;
  const bank = tripSeatBank[tripId];
  if (!tripId || !bank) return;

  // Sync state
  currentTripId = tripId;
  seatPlanDown = bank.down;
  seatPlanUp = bank.up;
  extraLeftoverSeats = bank.extraSeats || [];
  subSeats = bank.subSeats || [];
  cancelledSeats = bank.cancelledSeats || [];

  // Update header details from bank
  const headerPlate = document.getElementById('headerPlate');
  if (headerPlate) headerPlate.textContent = bank.plate || '51F-123.45';

  const carTypeEl = document.querySelector('.car-type');
  if (carTypeEl) {
    const svgIcon = carTypeEl.querySelector('svg');
    carTypeEl.innerHTML = '';
    if (svgIcon) carTypeEl.appendChild(svgIcon);
    carTypeEl.appendChild(document.createTextNode(' ' + (bank.vehicleType || 'Limousine 24 Phòng')));
  }

  const headerDriver = document.getElementById('headerDriver');
  if (headerDriver) headerDriver.textContent = bank.driver || 'Trần Văn Hùng';

  const headerHelper = document.getElementById('headerHelper');
  if (headerHelper) headerHelper.textContent = bank.helper || 'Nguyễn Thị Hương';

  if (multiSelectMode && selectionMode === 'transfer' && (selectedSourceSeats.length || transferSourceCancelId)) {
    if (transferTargetTripId !== tripId) {
      selectedTargetSeats = [];
      transferTargetTripId = tripId;
    }
    renderSeats();
    renderExtraSeats();
    renderSubSeats();
    renderCancelledSeats();
    updateCancelledTabCount();
    const markSeats = (seats) => seats.forEach(code => {
      const card = document.querySelector(`.seat-card[data-code="${code}"]`);
      if (card) { card.style.outline = '2px solid var(--red)'; card.style.outlineOffset = '1px'; }
    });
    if (transferSourceTripId === tripId) markSeats(selectedSourceSeats);
    if (transferTargetTripId === tripId) markSeats(selectedTargetSeats);
    if (document.getElementById('zone3Passengers').style.display !== 'none') renderPassengerList();
    if (document.getElementById('zone3Cancelled') && document.getElementById('zone3Cancelled').style.display !== 'none') renderCancelledListTable();
    updateTransferHint();
    return;
  }

  if (multiSelectMode) exitMultiSelectMode();

  renderSeats();
  renderExtraSeats();
  renderSubSeats();
  renderCancelledSeats();
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
  const isCD = dir === 'cd-sg';
  sgList.style.display = isCD ? 'none' : '';
  cdList.style.display = isCD ? '' : 'none';
  const activeList = isCD ? cdList : sgList;
  const firstCard = activeList.querySelector('.trip-card');
  if (firstCard) selectTrip(firstCard, firstCard.querySelector('.trip-time').textContent, isCD ? 'Châu Đốc - Sài Gòn' : 'Sài Gòn - Châu Đốc');
}

/* ===================== SEARCHABLE DROPDOWNS ===================== */
const dropdownState = {
  driverDropdownContainer: { value: '', label: '' },
  helperDropdownContainer: { value: '', label: '' }
};

function toggleSearchDropdown(containerId, event) {
  event.stopPropagation();

  // Close all other dropdowns
  document.querySelectorAll('.searchable-dropdown').forEach(d => {
    if (d.id !== containerId) {
      const panel = d.querySelector('.dropdown-panel');
      if (panel) panel.classList.remove('open');
    }
  });

  const container = document.getElementById(containerId);
  if (!container) return;
  const panel = container.querySelector('.dropdown-panel');
  if (!panel) return;
  const isOpen = panel.classList.contains('open');

  if (!isOpen) {
    panel.classList.add('open');
    const input = container.querySelector('input');
    if (input) {
      input.select();
    }
    filterDropdown(containerId);
  } else {
    panel.classList.remove('open');
  }
}

function filterDropdown(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const input = container.querySelector('input');
  if (!input) return;
  const filter = input.value.toLowerCase().trim();
  const items = container.querySelectorAll('.dropdown-item');

  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    if (text.includes(filter)) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });

  const panel = container.querySelector('.dropdown-panel');
  if (panel) panel.classList.add('open');
}

function selectSearchDropdownItem(containerId, label, value, type) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const input = container.querySelector('input');
  if (input) {
    input.value = label;
  }
  dropdownState[containerId] = { value, label };

  container.querySelectorAll('.dropdown-item').forEach(item => {
    const itemValue = item.dataset.value;
    item.classList.toggle('active', itemValue === value);
  });

  const panel = container.querySelector('.dropdown-panel');
  if (panel) panel.classList.remove('open');

  if (type === 'driver') {
    checkDriverConflict();
  }
}

/* ---- Zone 1: Calendar ---- */
let calDate = new Date(2026, 6, 8); // 08/07/2026
let selectedDate = new Date(2026, 6, 8);
const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
function renderCalendar() {
  const y = calDate.getFullYear(), m = calDate.getMonth();
  document.getElementById('calMonthLabel').textContent = `${monthNames[m]}, ${y}`;
  const startOffset = (new Date(y, m, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const daysInPrevMonth = new Date(y, m, 0).getDate();
  const todayStr = new Date(2026, 6, 8).toDateString();
  const selectedStr = selectedDate.toDateString();

  let html = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map(d => `<div class="cal-dow">${d}</div>`).join('');
  for (let i = 0; i < startOffset; i++) {
    html += `<div class="cal-day muted">${daysInPrevMonth - startOffset + i + 1}</div>`;
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(y, m, d);
    const dateStr = dateObj.toDateString();
    const isToday = dateStr === todayStr;
    const isSelected = dateStr === selectedStr;
    const lunar = ((d + 16) % 30) + 1;
    html += `<div class="cal-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" data-action="pickDate" data-args='${JSON.stringify([y, m, d])}'>${d}<span class="lunar">${lunar}/6</span></div>`;
  }
  const trailing = (7 - ((startOffset + daysInMonth) % 7)) % 7;
  for (let i = 1; i <= trailing; i++) { html += `<div class="cal-day muted">${i}</div>`; }
  document.getElementById('calGrid').innerHTML = html;
}
function shiftMonth(dir) { calDate = new Date(calDate.getFullYear(), calDate.getMonth() + dir, 1); renderCalendar(); }
function goToday() { calDate = new Date(2026, 6, 8); selectedDate = new Date(2026, 6, 8); renderCalendar(); updateCalTrigger(); }
function pickDate(y, m, d) {
  selectedDate = new Date(y, m, d);
  renderCalendar();
  updateCalTrigger();
  toggleCalendar(false);
}

function updateCalTrigger() {
  const isToday = selectedDate.toDateString() === new Date(2026, 6, 8).toDateString();
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

/* ===================== CHUYỂN MÀN "Đặt vé" <-> "Lịch sử hành khách" ===================== */
// ticketstaff không có #bookingView bọc riêng như callcenter (zone1/right-col nằm thẳng trong .main) nên
// ẩn/hiện từng phần thay vì chỉ đổi display của 1 wrapper. Tên hàm switchView(viewName) giữ đúng tên mà
// goToTripFromHistory() (shared/booking.js) đang gọi để tự chuyển về màn đặt vé khi cần.
function switchView(viewName) {
  if (viewName === currentView) return;
  currentView = viewName;

  const zone1 = document.querySelector('aside.zone1');
  const zone1Toggle = document.getElementById('zone1ToggleBtn');
  const rightCol = document.querySelector('.right-col');
  const historyView = document.getElementById('historyView');
  const pickupView = document.getElementById('pickupView');
  const tabBooking = document.getElementById('tabBooking');
  const tabPickup = document.getElementById('tabPickup');
  const tabHistory = document.getElementById('tabHistory');
  const searchInput = document.getElementById('searchInput');

  if (searchInput) searchInput.value = '';

  if (tabBooking) tabBooking.classList.remove('active');
  if (tabPickup) tabPickup.classList.remove('active');
  if (tabHistory) tabHistory.classList.remove('active');

  if (historyView) historyView.style.display = 'none';
  if (pickupView) pickupView.style.display = 'none';

  if (viewName === 'history') {
    if (zone1) zone1.style.display = 'none';
    if (zone1Toggle) zone1Toggle.style.display = 'none';
    if (rightCol) rightCol.style.display = 'none';
    if (historyView) historyView.style.display = 'flex';
    if (tabHistory) tabHistory.classList.add('active');
    if (searchInput) searchInput.placeholder = 'Tìm tên, SĐT trong lịch sử...';
    openPassengerHistoryView();
  } else if (viewName === 'pickup') {
    if (zone1) zone1.style.display = 'none';
    if (zone1Toggle) zone1Toggle.style.display = 'none';
    if (rightCol) rightCol.style.display = 'none';
    if (pickupView) pickupView.style.display = 'flex';
    if (tabPickup) tabPickup.classList.add('active');
    if (searchInput) searchInput.placeholder = 'Tìm tên, SĐT khách rước liền...';
    pkRenderCalendar();
    pkRenderPaxTable();
  } else {
    if (zone1) zone1.style.display = '';
    if (zone1Toggle) zone1Toggle.style.display = '';
    if (rightCol) rightCol.style.display = '';
    if (tabBooking) tabBooking.classList.add('active');
    if (searchInput) searchInput.placeholder = 'Tìm kiếm theo SĐT, Mã vé, Tên hành khách...';
  }
}

function renderZone1TripList() {
  const sgcdWrap = document.getElementById('tripListSGCD');
  const cdsgWrap = document.getElementById('tripListCDSG');
  if (!sgcdWrap || !cdsgWrap) return;

  const mapTrip = t => {
    const plan = tripSeatBank[t.id];
    const totalSeats = plan ? plan.down.filter(s => s.state !== 'hidden').length + plan.up.filter(s => s.state !== 'hidden').length : (t.totalSeats || 24);
    const bookedSeats = plan ? [...plan.down, ...plan.up].filter(s => ['sold', 'hold', 'free', 'cargo'].includes(s.state)).length : 0;
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
          <div class="trip-seat-tag ${seatTagClass}">${bookedSeats}/${totalSeats}</div>
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
      clearTimeout(liveSearchDebounceTimer);
      liveSearchDebounceTimer = setTimeout(() => renderLiveSearchResults(val), 300);
    });
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        if (typeof currentView !== 'undefined' && (currentView === 'pickup' || currentView === 'history')) return;
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

function updateHeaderPickupBadge() {
  const badge = document.getElementById('headerPickupBadge');
  if (!badge) return;
  let storedPax = [];
  try {
    const saved = localStorage.getItem(HN_PICKUP_PAX_KEY) || localStorage.getItem('hn_pickup_passengers_v5');
    if (saved) storedPax = JSON.parse(saved);
  } catch (e) {}

  if (!Array.isArray(storedPax) || storedPax.length === 0) {
    storedPax = [
      { id: 1, assigned: null },
      { id: 2, assigned: { tripId: '1' } },
      { id: 3, assigned: null },
      { id: 4, assigned: null },
      { id: 5, assigned: null }
    ];
  }

  const pendingCount = storedPax.filter(p => !p.assigned).length;
  badge.textContent = pendingCount;
  badge.style.display = pendingCount > 0 ? 'inline-block' : 'none';
}

updateHeaderPickupBadge();
window.addEventListener('storage', (e) => {
  if (!e.key || e.key === HN_PICKUP_PAX_KEY) {
    updateHeaderPickupBadge();
    pickupPassengers = loadPickupPassengers();
    if (currentView === 'pickup') pkRenderPaxTable();
  }
});

// Tài xế vừa được gán ở trang shuttle.html (tab khác) -> render lại ngay cột "Tài xế" nếu đang mở tab
// Trung chuyển, không cần tải lại trang.
window.addEventListener('storage', (e) => {
  if (e.key === HN_SHUTTLE_DRIVER_KEY) renderTransshipTables();
});

// ===================== RƯỚC LIỀN (gộp từ pickup-list.js) =====================
// Toàn bộ phần dưới đây được gộp từ file js/pickup-list.js cũ (trang pickup-list.html đã bị xoá,
// nút "Rước liền" giờ chuyển view ngay trong trang qua switchView('pickup') thay vì điều hướng sang
// trang khác). Các biến/hàm bị trùng tên với phần code phía trên (nhưng khác chức năng) đã đổi tên
// với tiền tố "pk"; các hằng dữ liệu mẫu giống hệt (staffList, stopsFirst, stopsLast, nameSamples,
// noteSamples, phonePool) và biến allTripsMeta/tripSeatBank dùng lại bản đã có ở trên, không tạo bản
// sao riêng nữa — tránh 2 bản dữ liệu ghế lệch nhau ngay trên cùng 1 trang.

const DEFAULT_PICKUP_PASSENGERS = [
  { id: 1, name: 'Nguyễn Thị Hồng', phone: '0909123456', ticketCount: 1, fromStation: 'Trạm Kinh Dương Vương', toStation: 'Trạm Châu Đốc', fromTransfer: '12 Kinh Dương Vương, Q.Bình Tân', toTransfer: 'Ngã 3 Vĩnh Xương, Châu Đốc', note: 'Khách lớn tuổi, cần hỗ trợ lên xuống xe', luggage: true, assigned: null, date: '2026-07-18' },
  { id: 2, name: 'Trần Văn Bình', phone: '0918234567', ticketCount: 1, fromStation: 'Trạm An Sương', toStation: 'Trạm Long Xuyên', fromTransfer: '45 Trường Chinh, Q.12', toTransfer: 'Công viên Long Xuyên', note: '', luggage: false, assigned: { tripId: '1', seat: 'A12' }, date: '2026-07-18' },
  { id: 3, name: 'Lê Thị Mai', phone: '0933345678', ticketCount: 2, fromStation: 'Trạm Q.5', toStation: 'Trạm Tân Châu', fromTransfer: '88 Nguyễn Trãi, Q.5', toTransfer: 'Bến phà Tân Châu', note: 'Đi cùng 1 trẻ nhỏ', luggage: true, assigned: null, date: '2026-07-18' },
  { id: 4, name: 'Phạm Quốc Huy', phone: '0944456789', ticketCount: 1, fromStation: 'Văn phòng trung tâm', toStation: 'Bến xe Châu Đốc', fromTransfer: '120 Lê Hồng Phong, Q.10', toTransfer: 'Bến xe Châu Đốc', note: '', luggage: false, assigned: null, date: '2026-07-18' },
  { id: 5, name: 'Võ Thị Kim Ngân', phone: '0977567890', ticketCount: 2, fromStation: 'Trạm Kinh Dương Vương', toStation: 'Trạm Cần Thơ', fromTransfer: '5 Hồ Học Lãm, Bình Tân', toTransfer: 'Bến Ninh Kiều, Cần Thơ', note: 'Gọi trước 15 phút khi xe tới', luggage: true, assigned: null, date: '2026-07-18' }
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
// KHÔNG tự dispatch StorageEvent: nơi gọi hàm này đã tự pkRenderPaxTable() ngay sau đó, dispatch thêm
// chỉ khiến trang tự nghe lại sự kiện của chính mình và render thừa lần 2 (xem js/shared/seat-bank.js).
function savePickupPassengers() {
  localStorage.setItem(HN_PICKUP_PAX_KEY, JSON.stringify(pickupPassengers));
}

let pickupPassengers = loadPickupPassengers();

// ===== Lịch chọn ngày lọc danh sách rước liền (widget riêng, khác lịch #calTrigger của Zone 1) =====
const PK_DEMO_TODAY = new Date(2026, 6, 18);
let pkCalDate = new Date(PK_DEMO_TODAY);
let pkSelectedDate = new Date(PK_DEMO_TODAY);
let pkCalendarOpen = false;

let pkFilterState = {
  fromStation: 'all',
  toStation: 'all',
  timeSlot: 'all',
  status: 'all',
  search: ''
};

function pkRenderCalendar() {
  const calGrid = document.getElementById("pkCalGrid");
  const monthLabel = document.getElementById("pkCalMonthLabel");
  if (!calGrid || !monthLabel) return;
  const y = pkCalDate.getFullYear(), m = pkCalDate.getMonth();
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
    const isToday = dateObj.toDateString() === PK_DEMO_TODAY.toDateString();
    const isSelected = dateObj.toDateString() === pkSelectedDate.toDateString();
    const lunar = ((d + 16) % 30) + 1;
    html += `<div class="cal-day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}" data-action="pkPickDate" data-args='[${y},${m},${d}]'>${d}<span class="lunar">${lunar}/6</span></div>`;
  }
  const totalCells = startOffset + daysInMonth;
  const trailing = (7 - (totalCells % 7)) % 7;
  for (let i = 1; i <= trailing; i++) {
    html += `<div class="cal-day muted">${i}</div>`;
  }
  calGrid.innerHTML = html;
}

function pkShiftMonth(dir) {
  pkCalDate = new Date(pkCalDate.getFullYear(), pkCalDate.getMonth() + dir, 1);
  pkRenderCalendar();
}

function pkGoToday() {
  pkCalDate = new Date(PK_DEMO_TODAY);
  pkSelectedDate = new Date(PK_DEMO_TODAY);
  pkRenderCalendar();
  pkUpdateCalTrigger();
  pkToggleCalendar(false);
  pkApplyFilters();
}

function pkPickDate(y, m, d) {
  pkSelectedDate = new Date(y, m, d);
  pkRenderCalendar();
  pkUpdateCalTrigger();
  pkToggleCalendar(false);
  pkApplyFilters();
}

function pkUpdateCalTrigger() {
  const dateLabel = document.getElementById("pkFilterDateLabel");
  if (!dateLabel) return;
  const isToday = pkSelectedDate.toDateString() === PK_DEMO_TODAY.toDateString();
  const d = String(pkSelectedDate.getDate()).padStart(2, "0");
  const m = String(pkSelectedDate.getMonth() + 1).padStart(2, "0");
  const y = pkSelectedDate.getFullYear();
  dateLabel.textContent = isToday ? `Hôm nay (${d}/${m}/${y})` : `${d}/${m}/${y}`;
}

// Lịch riêng của #pickupView — không dùng chung toggleCalendar()/js/shared/ui.js vì hàm đó gắn cứng
// vào #calendarPanel/#calTrigger (lịch Zone 1), trong khi lịch lọc rước liền dùng id khác
// (#pkCalendarPanel/#pkFilterDateBtn) để không trùng.
function pkToggleCalendar(force) {
  const panel = document.getElementById("pkCalendarPanel");
  const btn = document.getElementById("pkFilterDateBtn");
  if (!panel || !btn) return;
  pkCalendarOpen = typeof force === "boolean" ? force : !pkCalendarOpen;
  panel.classList.toggle("open", pkCalendarOpen);
  btn.classList.toggle("open", pkCalendarOpen);
}

document.addEventListener("click", (e) => {
  if (
    pkCalendarOpen &&
    !e.target.closest("#pkCalendarPanel") &&
    !e.target.closest("#pkFilterDateBtn")
  ) {
    pkToggleCalendar(false);
  }
});

function pkApplyFilters() {
  const fromEl = document.getElementById('pkFilterFromStation');
  const toEl = document.getElementById('pkFilterToStation');
  const timeEl = document.getElementById('pkFilterTimeSlot');
  const statusEl = document.getElementById('pkFilterStatus');

  pkFilterState.fromStation = fromEl ? fromEl.value : 'all';
  pkFilterState.toStation = toEl ? toEl.value : 'all';
  pkFilterState.timeSlot = timeEl ? timeEl.value : 'all';
  pkFilterState.status = statusEl ? statusEl.value : 'all';

  pkRenderPaxTable();
}

function pkResetFilters() {
  pkFilterState = { fromStation: 'all', toStation: 'all', timeSlot: 'all', status: 'all', search: '' };
  const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  setVal('pkFilterFromStation', 'all');
  setVal('pkFilterToStation', 'all');
  setVal('pkFilterTimeSlot', 'all');
  setVal('pkFilterStatus', 'all');
  setVal('pkSearchInput', '');
  const headerSearchEl = document.getElementById('searchInput');
  if (headerSearchEl) headerSearchEl.value = '';
  pkFilterState.search = '';
  pkGoToday();
}

let pkSearchInputDebounceTimer = null;
function pkOnSearchInput(val) {
  clearTimeout(pkSearchInputDebounceTimer);
  pkSearchInputDebounceTimer = setTimeout(() => {
    pkFilterState.search = val || '';
    pkRenderPaxTable();
  }, 300);
}

// ===== Danh sách hành khách rước liền =====

function pkRenderPaxTable() {
  const tbody = document.getElementById('pkPaxTableBody');
  const gridEmpty = document.getElementById('pkGridEmpty');
  if (!tbody) return;

  const pkSelectedDateStr = `${pkSelectedDate.getFullYear()}-${String(pkSelectedDate.getMonth() + 1).padStart(2, '0')}-${String(pkSelectedDate.getDate()).padStart(2, '0')}`;
  let filtered = pickupPassengers.filter(p => {
    // Đang gõ tìm kiếm: tìm trên TOÀN BỘ danh sách, bỏ qua bộ lọc ngày/trạm/trạng thái — trước đây lọc
    // ngày chạy TRƯỚC nên nếu lịch không đúng đang trỏ vào ngày của khách (VD khách được xếp cho 1 ngày
    // khác ngày "Hôm nay" đang chọn) thì tìm kiếm luôn ra rỗng dù tên/SĐT gõ đúng — đây chính là nguyên
    // nhân "tìm không được" mà không phải do sai chính tả.
    if (pkFilterState.search) {
      const kw = pkFilterState.search.toLowerCase();
      const matchName = p.name && p.name.toLowerCase().includes(kw);
      const matchPhone = p.phone && p.phone.toLowerCase().includes(kw);
      const matchTicket = p.assigned?.seat && String(p.assigned.seat).toLowerCase().includes(kw);
      return !!(matchName || matchPhone || matchTicket);
    }
    // Khách cũ lưu từ trước khi có cột "date" (chưa có trường này) luôn hiện, không bị lọc theo ngày —
    // chỉ lọc khi bản ghi CÓ ngày và khác ngày đang chọn trên lịch.
    if (p.date && p.date !== pkSelectedDateStr) return false;
    if (pkFilterState.fromStation !== 'all' && p.fromStation !== pkFilterState.fromStation) return false;
    if (pkFilterState.toStation !== 'all' && p.toStation !== pkFilterState.toStation) return false;
    if (pkFilterState.status === 'pending' && p.assigned) return false;
    if (pkFilterState.status === 'assigned' && !p.assigned) return false;
    // "Khung giờ" trước đây chưa từng được áp dụng ở đây (bug có sẵn từ pickup-list.js gốc, giữ nguyên
    // suốt lúc gộp code) — chọn khung giờ không lọc được gì cả. Khách CHƯA chỉ định chưa có giờ đón cụ
    // thể nên vẫn hiện bất kể khung giờ đang chọn; chỉ lọc khách ĐÃ chỉ định theo giờ của phơi đã gán —
    // giờ đó không lưu trực tiếp trên p.assigned, phải tra qua allTripsMeta theo tripId (đúng cách
    // pkRenderPaxTable tự hiển thị timeStr ở dưới).
    const assignedTripTime = p.assigned?.time || allTripsMeta.find(t => t.id === p.assigned?.tripId)?.time;
    if (pkFilterState.timeSlot !== 'all' && assignedTripTime) {
      const hh = parseInt(assignedTripTime.split(':')[0], 10);
      if (pkFilterState.timeSlot === 'morning' && (hh < 0 || hh >= 12)) return false;
      if (pkFilterState.timeSlot === 'afternoon' && (hh < 12 || hh >= 18)) return false;
      if (pkFilterState.timeSlot === 'evening' && (hh < 18 || hh > 24)) return false;
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
      actionCell = `<button class="assign-action-btn reassign" data-action="pkOpenAssignModal" data-args='[${p.id}]'>Đổi chỉ định</button>`;
    } else {
      statusCell = `<span class="status-tag pending">Chưa chỉ định</span>`;
      actionCell = `<button class="assign-action-btn" data-action="pkOpenAssignModal" data-args='[${p.id}]'><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 5v14M5 12h14"/></svg>Chỉ định</button>`;
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

// ===== Modal "Chỉ định xe rước liền" =====

let pkActivePaxId = null, pkActiveTripId = null, pkSelectedSeats = [], pkTripSearchKeyword = '', pkCustomAssignPrice = null;

function pkOpenAssignModal(paxId) {
  pkActivePaxId = paxId;
  const pax = pickupPassengers.find(p => p.id === paxId);
  if (!pax) return;

  const countStr = (pax.ticketCount || pax.count || 1) + ' vé';
  document.getElementById('pkAssignModalSub').textContent = `Khách: ${pax.name} · ${pax.phone} · SL: ${countStr} · ${pax.fromStation} → ${pax.toStation}`;
  pkActiveTripId = pax.assigned ? pax.assigned.tripId : allTripsMeta[0].id;

  if (pax.assigned && pax.assigned.seats && Array.isArray(pax.assigned.seats)) {
    pkSelectedSeats = [...pax.assigned.seats];
  } else if (pax.assigned && pax.assigned.seat) {
    pkSelectedSeats = pax.assigned.seat.split(',').map(s => s.trim()).filter(Boolean);
  } else {
    pkSelectedSeats = [];
  }

  const trip = allTripsMeta.find(t => t.id === pkActiveTripId);
  pkCustomAssignPrice = pax.assigned && pax.assigned.price ? pax.assigned.price : (trip ? (trip.price || 280000) : 280000);
  const priceInput = document.getElementById('pkAssignTripPrice');
  if (priceInput) priceInput.value = pkCustomAssignPrice;

  pkTripSearchKeyword = '';
  const searchInput = document.getElementById('pkTripSearchInput');
  if (searchInput) searchInput.value = '';

  pkRenderTripList();
  pkRenderSeatMap();
  pkUpdateConfirmState();
  document.getElementById('assignPickupModal').classList.add('open');
}

function pkCloseAssignModal() {
  document.getElementById('assignPickupModal').classList.remove('open');
  pkActivePaxId = null; pkActiveTripId = null; pkSelectedSeats = []; pkTripSearchKeyword = ''; pkCustomAssignPrice = null;
}

function pkFilterTripList(keyword) {
  pkTripSearchKeyword = keyword || '';
  pkRenderTripList();
}

function pkRenderTripList() {
  const wrap = document.getElementById('pkTripListPanel');
  if (!wrap) return;
  const kw = pkTripSearchKeyword.trim().toLowerCase();

  const filtered = !kw ? allTripsMeta : allTripsMeta.filter(t =>
    t.time.toLowerCase().includes(kw) || (t.plate && t.plate.toLowerCase().includes(kw)) ||
    t.route.toLowerCase().includes(kw) || (t.vehicleType && t.vehicleType.toLowerCase().includes(kw))
  );

  if (filtered.length === 0) {
    wrap.innerHTML = '<div class="pk-trip-empty-msg">Không tìm thấy phơi xe phù hợp</div>';
    return;
  }

  // Dùng nguyên class .trip-card/.trip-card-row1/.trip-card-row2/.trip-seat-tag của renderZone1TripList()
  // để danh sách phơi trong modal "Chỉ định xe" giống y hệt danh sách phơi Zone 1, không phải bản
  // .pk-trip-card riêng nữa.
  wrap.innerHTML = filtered.map(t => {
    const plan = tripSeatBank[t.id];
    const totalSeats = plan ? plan.down.filter(s => s.state !== 'hidden').length + plan.up.filter(s => s.state !== 'hidden').length : 0;
    const bookedSeats = plan ? [...plan.down, ...plan.up].filter(s => ['sold', 'hold', 'free', 'cargo'].includes(s.state)).length : 0;
    const selected = t.id === pkActiveTripId ? 'selected' : '';
    const plate = t.plate || 'Chưa có';
    const vehicleType = t.vehicleType || 'Chưa rõ';
    const isLimo = vehicleType.toLowerCase().includes('limousine') || vehicleType.toLowerCase().includes('limo');
    const seatTagClass = isLimo ? 'tag-limo' : 'tag-normal';
    const displayTripName = t.name || `${t.route} (${t.time})`;

    return `
      <div class="trip-card ${selected}" data-action="pkSelectTrip" data-args='["${t.id}"]'>
        <div class="trip-card-row1">
          <div class="trip-info-left">
            <span class="trip-time">${t.time}</span>
            <span class="trip-plate-inline">${plate}</span>
          </div>
          <div class="trip-seat-tag ${seatTagClass}">${bookedSeats}/${totalSeats}</div>
        </div>
        <div class="trip-card-row2">
          <span class="trip-name-text">${displayTripName}</span>
        </div>
      </div>`;
  }).join('');
}

function pkSelectTrip(tripId) {
  if (tripId === pkActiveTripId) return;
  pkActiveTripId = tripId;
  pkSelectedSeats = [];

  const trip = allTripsMeta.find(t => t.id === pkActiveTripId);
  pkCustomAssignPrice = trip ? (trip.price || 280000) : 280000;
  const priceInput = document.getElementById('pkAssignTripPrice');
  if (priceInput) priceInput.value = pkCustomAssignPrice;

  pkRenderTripList();
  pkRenderSeatMap();
  pkUpdateConfirmState();
}

function pkOnAssignPriceChange(val) {
  pkCustomAssignPrice = Math.max(0, parseInt(val) || 0);
  pkUpdateConfirmState();
}

function pkRenderSeatMap() {
  const floorDownEl = document.getElementById('pkAssignSeatFloorDown');
  const floorUpEl = document.getElementById('pkAssignSeatFloorUp');
  const tripPlan = tripSeatBank[pkActiveTripId];
  if (!tripPlan || !floorDownEl || !floorUpEl) return;

  const mapSeat = seat => {
    if (seat.state === 'hidden') {
      return `<div class="van-seat" style="visibility:hidden; pointer-events:none;"></div>`;
    }
    const isSelected = pkSelectedSeats.includes(seat.code);
    const isBooked = ['sold', 'hold', 'free', 'cargo'].includes(seat.state);
    const cls = isBooked ? 'blocked' : (isSelected ? 'selected' : 'empty');
    const clickable = !isBooked ? `data-action="pkSelectSeat" data-args='["${seat.code}"]'` : '';

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
}

function pkSelectSeat(code) {
  const tripPlan = tripSeatBank[pkActiveTripId];
  if (!tripPlan) return;
  const seat = [...tripPlan.down, ...tripPlan.up].find(s => s.code === code);
  if (!seat || ['sold', 'hold', 'free', 'cargo'].includes(seat.state)) return;

  const idx = pkSelectedSeats.indexOf(code);
  if (idx !== -1) pkSelectedSeats.splice(idx, 1);
  else pkSelectedSeats.push(code);

  pkRenderSeatMap();
  pkUpdateConfirmState();
}

// Đơn giá áp dụng: ưu tiên giá tuỳ chỉnh trong modal, nếu không thì lấy giá của phơi xe (mặc định 280000)
function pkGetUnitPrice(trip) {
  return (pkCustomAssignPrice !== null && !isNaN(pkCustomAssignPrice)) ? pkCustomAssignPrice : (trip ? (trip.price || 280000) : 280000);
}

function pkUpdateConfirmState() {
  const btn = document.getElementById('pkConfirmAssignBtn');
  const hint = document.getElementById('pkAssignHint');
  const totalEl = document.getElementById('pkAssignTotalPrice');
  if (!btn) return;

  const trip = allTripsMeta.find(t => t.id === pkActiveTripId);
  const unitPrice = pkGetUnitPrice(trip);
  const totalPrice = unitPrice * pkSelectedSeats.length;

  if (totalEl) totalEl.textContent = totalPrice.toLocaleString('vi-VN') + 'đ';

  if (pkActiveTripId && pkSelectedSeats.length > 0) {
    btn.disabled = false;
    hint.innerHTML = `Sẽ chỉ định <b>${pkSelectedSeats.length} ghế (${pkSelectedSeats.join(', ')})</b> — phơi xe <b>${trip ? trip.time : pkActiveTripId}</b>`;
  } else {
    btn.disabled = true;
    hint.textContent = 'Chọn 1 phơi xe và chọn 1 hoặc nhiều ghế trống để chỉ định.';
  }
}

function pkConfirmAssign() {
  if (!pkActivePaxId || !pkActiveTripId || pkSelectedSeats.length === 0) return;
  const pax = pickupPassengers.find(p => p.id === pkActivePaxId);
  if (!pax) return;

  const tripPlan = tripSeatBank[pkActiveTripId];
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

  const trip = allTripsMeta.find(t => t.id === pkActiveTripId);
  const unitPrice = pkGetUnitPrice(trip);
  const ticketNumber = "SGCD-" + String(Math.floor(1000 + Math.random() * 9000));

  pkSelectedSeats.forEach(code => {
    const targetSeat = [...tripPlan.down, ...tripPlan.up].find(s => s.code === code);
    if (targetSeat) {
      Object.assign(targetSeat, {
        state: 'sold', customerName: pax.name, phone: pax.phone,
        firstStop: pax.fromStation, lastStop: pax.toStation,
        transshipStation: pax.fromTransfer, price: unitPrice,
        paid: true, count: pkSelectedSeats.length, ticketNo: ticketNumber
      });
    }
  });

  pax.assigned = { tripId: pkActiveTripId, seat: pkSelectedSeats.join(', '), seats: [...pkSelectedSeats], price: unitPrice };

  saveSeatBank();
  savePickupPassengers();
  updateHeaderPickupBadge();

  pkCloseAssignModal();
  pkRenderPaxTable();
  const totalPrice = unitPrice * pkSelectedSeats.length;
  showToast(`Đã bán vé cho ${pax.name} lên xe ${trip ? (trip.plate || '') : ''} — ${pkSelectedSeats.length} ghế (${pkSelectedSeats.join(', ')}) · Tổng: ${totalPrice.toLocaleString('vi-VN')}đ`);
}

document.getElementById('assignPickupModal').addEventListener('click', (e) => {
  if (e.target.id === 'assignPickupModal') pkCloseAssignModal();
});