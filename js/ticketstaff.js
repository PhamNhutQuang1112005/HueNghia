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
        parsed.forEach((t, idx) => {
          if (!t.date || t.date === '2026-07-29') t.date = todayStr;
          // Phơi cũ nạp từ trước khi có createdAt (seed/mẫu) không có mốc thời gian tạo thật — gán tạm
          // theo thứ tự trong mảng (số rất nhỏ so với Date.now()) để phơi tạo thật sự sau này luôn nổi
          // lên đầu danh sách (xem applyFilters), còn phơi cũ vẫn giữ đúng thứ tự tương đối với nhau.
          if (!t.createdAt) t.createdAt = idx;
        });
        localStorage.setItem(HN_TRIPS_KEY, JSON.stringify(parsed));
        return parsed;
      }
    } catch (e) {
      console.error("Failed to parse trips", e);
    }
  }
  return [...DEFAULT_SGCD_TRIPS, ...DEFAULT_CDSG_TRIPS, ...DEFAULT_EXTRA_TEMPLATE_TRIPS];
}

// Lọc allTripsMeta thành 2 danh sách theo chiều (dùng chung ở nơi cần đồng bộ lại sau khi allTripsMeta thay đổi).
// Suy chiều bằng "route bắt đầu bằng Sài Gòn" (giống đúng quy ước fDir ở applyFilters bên dưới) thay vì
// liệt kê từng tiền tố điểm đến — liệt kê thiếu tiền tố (VD "An Giang -") từng khiến phơi tuyến đó biến
// mất khỏi Zone1 nên nút "Bán vé" không tìm thấy thẻ phơi để chuyển tới.
function refreshTripMetaFilters() {
  sgcdTripsMeta = allTripsMeta.filter(t => t.route && t.route.startsWith('Sài Gòn') && t.status !== 'Đã hủy');
  cdsgTripsMeta = allTripsMeta.filter(t => t.route && !t.route.startsWith('Sài Gòn') && t.status !== 'Đã hủy');
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

// Cột "Trạng thái" (2 bảng Trung chuyển đón/trả) — bấm để ghi/sửa ghi chú riêng (VD "đã gọi tài xế",
// "khách xin đón trễ 10p"), KHÔNG hiện thẳng nội dung ghi chú trên tag (khác kiểu cột "Trung chuyển"
// .pk-transship-cell ở trang Rước liền) — chỉ đổi viền/nền báo có ghi chú, rê chuột vào mới thấy qua title="...".
// Chiều "đón": "Đang đón" chỉ đúng khi ĐÃ gán tài xế trung chuyển (hasAssignedDriver, xem cột "Tài xế"
// cùng hàng) — trước đây dùng nhầm item.paid (trạng thái thu tiền vé, không liên quan gì đến việc đã có
// tài xế đi đón hay chưa) nên hiện sai. Chiều "trả" chưa có cột gán tài xế hiển thị ở bảng này nên vẫn
// giữ nguyên theo item.paid như cũ.
function tsRenderTransshipStatusBadge(item, leg, hasAssignedDriver) {
  const noteField = leg === 'dropoff' ? 'transshipDropoffNote' : 'transshipPickupNote';
  const note = item[noteField] || '';
  const label = leg === 'dropoff'
    ? (item.paid ? 'Đã trả' : 'Chờ trả')
    : (hasAssignedDriver ? 'Đang đón' : 'Chờ đón');
  const statusClass = leg === 'dropoff'
    ? (item.paid ? 'done' : 'blue')
    : (hasAssignedDriver ? 'ongoing' : 'pending');
  const title = note ? note : 'Bấm để ghi chú trạng thái';
  return `<button type="button" class="ts-status-badge ${statusClass}${note ? ' has-note' : ''}" data-action="openTransshipStatusNoteModal" data-stop-propagation="1" data-args='${JSON.stringify([item.ticketNo || '', leg])}' title="${escapeHtml(title)}">${label}</button>`;
}

// Tìm lại đúng các ghế THẬT (không phải bản sao qua getAllBookedSeats()) theo ticketNo — cần sửa trực
// tiếp lên seatPlanDown/Up/extraLeftoverSeats thì lưu mới có tác dụng, sửa lên bản sao không lưu được gì.
// Trước tiên tìm ở phơi đang mở; không thấy thì quét toàn bộ tripSeatBank để bảng gộp trang "Trung
// chuyển" (gộp khách trung chuyển từ MỌI phơi) cũng ghi/sửa ghi chú trạng thái được như bảng rước liền.
function tsFindRealSeatsByTicket(ticketNo) {
  const cur = [...seatPlanDown, ...seatPlanUp, ...(extraLeftoverSeats || [])].filter(s => s.ticketNo === ticketNo);
  if (cur.length) return cur;
  const out = [];
  Object.keys(tripSeatBank || {}).forEach(tid => {
    const b = tripSeatBank[tid];
    if (!b) return;
    [...(b.down || []), ...(b.up || []), ...(b.extraSeats || [])].forEach(s => {
      if (s && s.ticketNo === ticketNo) out.push(s);
    });
  });
  return out;
}

let tsTransshipStatusNoteActive = null; // { ticketNo, leg }

function openTransshipStatusNoteModal(ticketNo, leg) {
  if (!ticketNo) return;
  const seats = tsFindRealSeatsByTicket(ticketNo);
  if (!seats.length) return;
  tsTransshipStatusNoteActive = { ticketNo, leg };
  const noteField = leg === 'dropoff' ? 'transshipDropoffNote' : 'transshipPickupNote';
  const input = document.getElementById('tsStatusNoteInput');
  if (input) input.value = seats[0][noteField] || '';
  const modal = document.getElementById('tsStatusNoteModal');
  if (modal) modal.classList.add('open');
}

function saveTransshipStatusNote() {
  if (!tsTransshipStatusNoteActive) return;
  const { ticketNo, leg } = tsTransshipStatusNoteActive;
  const noteField = leg === 'dropoff' ? 'transshipDropoffNote' : 'transshipPickupNote';
  const input = document.getElementById('tsStatusNoteInput');
  const value = input ? input.value.trim() : '';

  const realSeats = tsFindRealSeatsByTicket(ticketNo);
  const changed = realSeats.some(s => (s[noteField] || '') !== value);
  realSeats.forEach(s => { s[noteField] = value; });
  saveSeatBank();

  // Ghi chú cột "Phòng vé" của dòng khách trung chuyển vừa đổi -> đánh dấu để đẩy dòng đó lên đầu bảng
  // gộp trang "Trung chuyển" (giống hành vi của khách rước liền khi sửa ghi chú).
  if (changed && leg !== 'dropoff') pkMarkRowUpdated(pkTransshipRowKey(ticketNo));

  closeModal('tsStatusNoteModal');
  tsTransshipStatusNoteActive = null;
  renderTransshipTables();
  if (currentView === 'pickup') pkRenderPaxTable();
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

  // 2 bảng dưới đây dùng chung định dạng .pax-table với bảng "Hành khách" (cột Ghế theo kiểu SL:/VT:,
  // cột Ghi chú theo kiểu icon-chỉ-hiện-khi-có-nội-dung + escapeHtml, không in đậm tên/SĐT/tiền) để giao
  // diện nhất quán giữa các tab. escapeHtml() áp dụng cho mọi text tự do (tên tài xế/khách, địa chỉ, ghi
  // chú) vì đây đều là dữ liệu nhập tay — chèn thẳng vào title="..."/HTML mà không escape sẽ vỡ layout
  // giống lỗi từng gặp ở cột Ghi chú bảng Hành khách nếu text chứa dấu ngoặc kép/&/<.
  // Render Table 1: DANH SÁCH TRUNG CHUYỂN ĐÓN
  if (pickupBody) {
    if (pickupList.length === 0) {
      pickupBody.innerHTML = '<tr><td colspan="10" class="ts-empty">Không có hành khách cần trung chuyển đón trong chuyến này</td></tr>';
    } else {
      pickupBody.innerHTML = pickupList.map((g, idx) => {
        const item = g.main;
        const driverKey = `${(item.phone || '').replace(/\s+/g, '')}_don`;
        const assignedDriver = shuttleDriverMap[driverKey];
        const driverTooltip = assignedDriver
          ? `SĐT: ${assignedDriver.driverPhone || '—'} · Biển số: ${assignedDriver.driverPlate || '—'}${assignedDriver.driverVehicleType ? ' · ' + assignedDriver.driverVehicleType : ''}`
          : '';
        const driverCellHtml = assignedDriver
          ? `<span title="${escapeHtml(driverTooltip)}">${escapeHtml(assignedDriver.driverName)}</span>`
          : `<span class="ts-driver-unassigned">Chưa gán tài xế</span>`;
        const pickupLoc = escapeHtml(item.pickupAddress || item.transship || item.transshipStation || item.firstStop || '—');
        const seatCodes = g.members ? g.members.map(s => s.code) : [item.code || '—'];
        const seatCount = g.members ? g.members.length : 1;
        const phone = item.phone || '—';
        const totalPrice = item.price ? (item.price * seatCount).toLocaleString('vi-VN') + 'đ' : '—';
        const note = seatNoteWithReason(item);
        const noteSafe = escapeHtml(note);
        const noteHtml = note
          ? `<div class="pax-note-row"><svg class="pax-note-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span class="pax-note-clamp">${noteSafe}</span></div>`
          : `<span class="pax-note-empty">—</span>`;
        const customerNameSafe = escapeHtml(item.customerName || 'Khách');
        const statusBadge = tsRenderTransshipStatusBadge(item, 'pickup', !!assignedDriver);

        return `
          <tr data-ticket="${escapeHtml(item.ticketNo || '')}">
            <td class="mono pax-col-stt">${idx + 1}</td>
            <td class="pax-col-driver">${driverCellHtml}</td>
            <td class="pax-col-address">${pickupLoc}</td>
            <td class="pax-col-sl">${seatCount}</td>
            <td class="pax-col-vt">${seatCodes.join(', ')}</td>
            <td class="pax-col-name">${customerNameSafe}</td>
            <td class="pax-col-phone">${phone}</td>
            <td class="pax-col-total">${totalPrice}</td>
            <td class="pax-col-status">${statusBadge}</td>
            <td class="pax-col-note" title="${noteSafe}">${noteHtml}</td>
          </tr>
        `;
      }).join('');
    }
  }

  // Render Table 2: DANH SÁCH TRUNG CHUYỂN TRẢ
  if (dropoffBody) {
    if (dropoffList.length === 0) {
      dropoffBody.innerHTML = '<tr><td colspan="9" class="ts-empty">Không có hành khách cần trung chuyển trả trong chuyến này</td></tr>';
    } else {
      dropoffBody.innerHTML = dropoffList.map((g, idx) => {
        const item = g.main;
        const dropoffLoc = escapeHtml(item.dropoffAddress || item.arrivalTransfer || item.lastStop || '—');
        const seatCodes = g.members ? g.members.map(s => s.code) : [item.code || '—'];
        const seatCount = g.members ? g.members.length : 1;
        const phone = item.phone || '—';
        const totalPrice = item.price ? (item.price * seatCount).toLocaleString('vi-VN') + 'đ' : '—';
        const note = seatNoteWithReason(item);
        const noteSafe = escapeHtml(note);
        const noteHtml = note
          ? `<div class="pax-note-row"><svg class="pax-note-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span class="pax-note-clamp">${noteSafe}</span></div>`
          : `<span class="pax-note-empty">—</span>`;
        const customerNameSafe = escapeHtml(item.customerName || 'Khách');
        const statusBadge = tsRenderTransshipStatusBadge(item, 'dropoff');

        return `
          <tr data-ticket="${escapeHtml(item.ticketNo || '')}">
            <td class="mono pax-col-stt">${idx + 1}</td>
            <td class="pax-col-address">${dropoffLoc}</td>
            <td class="pax-col-sl">${seatCount}</td>
            <td class="pax-col-vt">${seatCodes.join(', ')}</td>
            <td class="pax-col-name">${customerNameSafe}</td>
            <td class="pax-col-phone">${phone}</td>
            <td class="pax-col-total">${totalPrice}</td>
            <td class="pax-col-status">${statusBadge}</td>
            <td class="pax-col-note" title="${noteSafe}">${noteHtml}</td>
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
      tbody.innerHTML = '<tr class="pax-empty-row"><td colspan="10">Không có hành khách phù hợp bộ lọc</td></tr>';
    } else {
      tbody.innerHTML = groups.map((g, index) => {
        const s = g.main;
        const count = g.members.length;
        const seatCodes = g.members.map(m => m.code);
        // Vé giá 0đ (qua ô "Lý do giá 0đ") cũng tính là vé miễn phí như ghế trạng thái 'free', không
        // riêng gì ghế state==='free' — cả 2 trường hợp đều không có gì để thu/nợ.
        const isFree = s.state === 'free' || s.price === 0;
        const totalPrice = s.price * count;
        // Đã cọc (seat.depositAmount) lưu 1 lần cho cả nhóm vé (không nhân theo count) — xem giải
        // thích ở applyFormToSeat lúc lưu vé. Vé đã "Bán" (paid) thì đã thu đủ, không còn cọc dở dang.
        const daThuAmount = isFree ? 0 : (s.paid ? totalPrice : Math.min(s.depositAmount || 0, totalPrice));
        const conNoAmount = isFree ? 0 : (totalPrice - daThuAmount);
        const { firstStopHtml, lastStopHtml } = getHistoryStopsDisplay(s);
        const note = seatNoteWithReason(s);

        const daThuText = isFree ? 'Miễn phí' : (daThuAmount > 0 ? daThuAmount.toLocaleString('vi-VN') + 'đ' : '—');
        const conNoText = isFree ? 'Miễn phí' : (conNoAmount > 0 ? conNoAmount.toLocaleString('vi-VN') + 'đ' : '—');

        const luggageHtml = s.hasLuggage
          ? `<span class="pax-luggage-mark" title="Có hành lý ký gửi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/></svg></span>`
          : `<span class="pax-luggage-empty">—</span>`;

        // Ghi chú do nhân viên nhập tay có thể chứa dấu ngoặc kép/&/< — phải escapeHtml() trước khi chèn,
        // nếu không sẽ phá vỡ thuộc tính title="..." hoặc bị hiểu nhầm thành thẻ HTML, làm lệch cả hàng.
        const noteSafe = escapeHtml(note);
        const noteHtml = note
          ? `<div class="pax-note-row"><svg class="pax-note-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span class="pax-note-clamp">${noteSafe}</span></div>`
          : `<span class="pax-note-empty">—</span>`;

        return `
        <tr data-action="fillSearchInputWithPhone" data-args='${JSON.stringify([s.phone])}' style="cursor:pointer;">
          <td class="mono pax-col-stt">${index + 1}</td>
          <td class="pax-col-name">${s.customerName || '—'}</td>
          <td class="pax-col-phone">${s.phone || '—'}</td>
          <td class="pax-col-route">
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
          <td class="pax-col-sl">${count}</td>
          <td class="pax-col-vt">${seatCodes.join(', ')}</td>
          <td class="pax-col-paid">${daThuText}</td>
          <td class="pax-col-debt">${conNoText}</td>
          <td class="pax-col-luggage">${luggageHtml}</td>
          <td class="pax-col-note" title="${noteSafe}">${noteHtml}</td>
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
  const transshipVal = document.getElementById('f_transship').value.trim();

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
  if (type === 'Rước đường' && !document.getElementById('f_transship').value.trim()) {
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
    seat.transshipStation = document.getElementById('f_transship').value.trim();
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
    // Mốc giờ nhân viên thao tác — hiện ở cột "Thời gian" bảng Lịch sử (xem formatActionTime trong
    // shared/format.js). Ghi đè mỗi lần lưu form (tạo mới lẫn sửa vé) nên luôn phản ánh lần thao tác
    // gần nhất trên ghế này, không riêng lần đặt đầu tiên.
    seat.actionTime = new Date().toISOString();
    // Gắn nhãn trạm bán/giai đoạn bán CHỈ 1 LẦN lúc tạo vé mới (seat.soldPhase chưa có) — sửa vé sau đó
    // không được đổi lại đã bán ở trạm nào/giai đoạn nào, tránh sai lệch báo cáo doanh thu theo trạm và
    // lịch sử Re-open (xem js/ticketstaff-manifest-core.js).
    if (!seat.soldPhase) {
      seat.sellingStation = (typeof getCurrentStation === 'function') ? getCurrentStation() : '';
      const tripStatus = (typeof getTripLifecycleStatus === 'function') ? getTripLifecycleStatus(currentTripId) : 'SELLING';
      seat.soldPhase = tripStatus === 'SELLING' ? 'PRE_DEPART' : 'POST_DEPART';
      seat.reopenEventId = (tripStatus === 'REOPEN' && typeof getActiveReopenEvent === 'function')
        ? ((getActiveReopenEvent(currentTripId) || {}).id || null)
        : null;
    }
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
  if (type === 'Rước đường' && !document.getElementById('f_transship').value.trim()) {
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
      seat.actionTime = new Date().toISOString();
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
    seat.transshipStation = document.getElementById('f_transship').value.trim();
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
    // Mốc giờ nhân viên thao tác — hiện ở cột "Thời gian" bảng Lịch sử (xem formatActionTime trong
    // shared/format.js).
    seat.actionTime = new Date().toISOString();
    // Gắn nhãn trạm bán/giai đoạn bán CHỈ 1 LẦN lúc tạo vé mới (seat.soldPhase chưa có) — xem giải thích
    // ở applyFormToSeat phía trên.
    if (!seat.soldPhase) {
      seat.sellingStation = (typeof getCurrentStation === 'function') ? getCurrentStation() : '';
      const tripStatus = (typeof getTripLifecycleStatus === 'function') ? getTripLifecycleStatus(currentTripId) : 'SELLING';
      seat.soldPhase = tripStatus === 'SELLING' ? 'PRE_DEPART' : 'POST_DEPART';
      seat.reopenEventId = (tripStatus === 'REOPEN' && typeof getActiveReopenEvent === 'function')
        ? ((getActiveReopenEvent(currentTripId) || {}).id || null)
        : null;
    }
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
    cancelStaff: getCurrentActionStaffCode(),
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

  // Biển số xe cũng phải ghi lại vào allTripsMeta (không chỉ tripSeatBank) — đây là dữ liệu mà cột "Biển
  // số" ở thẻ phơi bên phần quản lý phơi (renderTable) đọc trực tiếp, thiếu dòng này thì gán xe ở Zone 2
  // không thấy phản ánh lại bên quản lý phơi.
  const tripMeta = allTripsMeta.find(t => t.id === currentTripId);
  if (tripMeta) tripMeta.plate = plateVal;

  saveData();
  refreshTripsList();

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

// Đồng bộ lại header Zone 2 (biển số/loại xe/tài xế/phụ xe) theo đúng tripSeatBank của 1 phơi — dùng
// chung cho lúc chọn phơi ở Zone 1 (selectTrip) và lúc sửa biển số 1 phơi đang được chọn từ phần quản
// lý phơi (saveSingleTrip gọi refreshVehicleHeaderIfCurrent) để 2 nơi luôn hiện cùng 1 biển số xe.
function refreshVehicleHeader(bank) {
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

// Gọi sau khi lưu 1 phơi ở modal quản lý phơi — nếu đúng phơi đang được chọn/xem ở Zone 2 thì refresh
// ngay header, không phải bấm chọn lại phơi ở Zone 1 mới thấy biển số/loại xe vừa sửa.
function refreshVehicleHeaderIfCurrent(tripId) {
  if (!tripId || tripId !== currentTripId) return;
  const bank = tripSeatBank[tripId];
  if (bank) refreshVehicleHeader(bank);
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

  refreshVehicleHeader(bank);

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
  // Rời khỏi tab Phơi xe khi đang ở chế độ chọn "phơi mẫu" (tạo hàng loạt) — thoát luôn chế độ chọn để
  // tránh trạng thái treo lơ lửng khi quay lại tab này lần sau (chuyển từ callcenter.js qua).
  if (currentView === 'phoi' && viewName !== 'phoi' && phoiBulkMode) toggleBulkTemplateMode();
  currentView = viewName;

  const zone1 = document.querySelector('aside.zone1');
  const zone1Toggle = document.getElementById('zone1ToggleBtn');
  const rightCol = document.querySelector('.right-col');
  const historyView = document.getElementById('historyView');
  const pickupView = document.getElementById('pickupView');
  const phoiView = document.getElementById('phoiView');
  const tabBooking = document.getElementById('tabBooking');
  const tabPickup = document.getElementById('tabPickup');
  const tabHistory = document.getElementById('tabHistory');
  const tabPhoi = document.getElementById('tabPhoi');
  const searchInput = document.getElementById('searchInput');

  if (searchInput) searchInput.value = '';

  if (tabBooking) tabBooking.classList.remove('active');
  if (tabPickup) tabPickup.classList.remove('active');
  if (tabHistory) tabHistory.classList.remove('active');
  if (tabPhoi) tabPhoi.classList.remove('active');

  if (historyView) historyView.style.display = 'none';
  if (pickupView) pickupView.style.display = 'none';
  if (phoiView) phoiView.style.display = 'none';

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
    if (searchInput) searchInput.placeholder = 'Tìm tên, SĐT khách trung chuyển...';
    pkRenderCalendar();
    pkRenderPaxTable();
  } else if (viewName === 'phoi') {
    if (zone1) zone1.style.display = 'none';
    if (zone1Toggle) zone1Toggle.style.display = 'none';
    if (rightCol) rightCol.style.display = 'none';
    if (phoiView) phoiView.style.display = 'flex';
    if (tabPhoi) tabPhoi.classList.add('active');
    if (searchInput) searchInput.placeholder = 'Tìm kiếm phơi xe...';
    applyFilters();
  } else {
    if (zone1) zone1.style.display = '';
    if (zone1Toggle) zone1Toggle.style.display = '';
    if (rightCol) rightCol.style.display = '';
    if (tabBooking) tabBooking.classList.add('active');
    if (searchInput) searchInput.placeholder = 'Tìm kiếm theo SĐT, Mã vé, Tên hành khách...';
  }
}

/* ===================== PHƠI XE MANAGEMENT (chuyển từ callcenter.js qua) ===================== */

// Routes default configuration
const ROUTES_CFG = {
  'chieu-di': [
    { label: 'Sài Gòn - Châu Đốc', abbr: 'SG-CD', price: 280000 },
    { label: 'Sài Gòn - Long Xuyên', abbr: 'SG-LX', price: 150000 },
    { label: 'Sài Gòn - Cần Thơ', abbr: 'SG-CT', price: 180000 },
    { label: 'Sài Gòn - An Giang', abbr: 'SG-AG', price: 160000 }
  ],
  'chieu-ve': [
    { label: 'Châu Đốc - Sài Gòn', abbr: 'CD-SG', price: 280000 },
    { label: 'Long Xuyên - Sài Gòn', abbr: 'LX-SG', price: 150000 },
    { label: 'Cần Thơ - Sài Gòn', abbr: 'CT-SG', price: 180000 },
    { label: 'An Giang - Sài Gòn', abbr: 'AG-SG', price: 160000 },
    { label: 'Châu Đốc - An Giang', abbr: 'CD-AG', price: 90000 },
    { label: 'An Giang - Châu Đốc', abbr: 'AG-CD', price: 90000 }
  ]
};

// Cấu hình "Hướng đi" cho modal Tạo phơi xe (singleModal) — 1 dropdown phẳng liệt kê thẳng từng cặp
// tuyến theo dạng mũi tên (thay vì 2 bước Chiều đi/Chiều về rồi mới chọn Tuyến như ROUTES_CFG ở trên,
// ROUTES_CFG vẫn giữ nguyên để các chỗ khác dùng — tìm tên viết tắt/giá khi lưu phơi, tên gợi ý khi để
// trống Tên phơi). Mỗi hướng có sẵn danh sách Trạm đi/Trạm đến cụ thể để chọn, và danh sách trạm dọc
// đường có thể nhận thêm khách (Trạm có thể nhận). "An Giang" là điểm mới, trạm tự đặt tên — khác với
// Long Xuyên (đã có sẵn dữ liệu ở nơi khác trong hệ thống) nên không dùng chung trạm.
const TRIP_DIRECTIONS_CFG = {
  'sg-cd': {
    label: 'SG → CĐ', route: 'Sài Gòn - Châu Đốc', price: 280000,
    fromStations: ['Văn phòng trung tâm', 'Trạm Kinh Dương Vương', 'Trạm An Sương', 'Trạm Q.5'],
    toStations: ['Bến xe Châu Đốc', 'Trạm Châu Đốc', 'Trạm Tân Châu'],
    pickupStations: ['Trạm An Sương', 'Trạm Q.5', 'Trạm Kinh Dương Vương', 'Trạm Tân Châu']
  },
  'cd-sg': {
    label: 'CĐ → SG', route: 'Châu Đốc - Sài Gòn', price: 280000,
    fromStations: ['Bến xe Châu Đốc', 'Trạm Châu Đốc', 'Trạm Tân Châu'],
    toStations: ['Văn phòng trung tâm', 'Trạm Kinh Dương Vương', 'Trạm An Sương'],
    pickupStations: ['Trạm Tân Châu', 'Trạm An Sương']
  },
  'sg-lx': {
    label: 'SG → LX', route: 'Sài Gòn - Long Xuyên', price: 150000,
    fromStations: ['Văn phòng trung tâm', 'Trạm Kinh Dương Vương', 'Trạm An Sương'],
    toStations: ['Bến xe Long Xuyên', 'Trạm Long Xuyên'],
    pickupStations: ['Trạm An Sương']
  },
  'lx-sg': {
    label: 'LX → SG', route: 'Long Xuyên - Sài Gòn', price: 150000,
    fromStations: ['Bến xe Long Xuyên', 'Trạm Long Xuyên'],
    toStations: ['Văn phòng trung tâm', 'Trạm Kinh Dương Vương'],
    pickupStations: []
  },
  'sg-ct': {
    label: 'SG → CT', route: 'Sài Gòn - Cần Thơ', price: 180000,
    fromStations: ['Văn phòng trung tâm', 'Trạm Kinh Dương Vương', 'Trạm An Sương'],
    toStations: ['Bến xe Cần Thơ', 'Bến Ninh Kiều'],
    pickupStations: ['Trạm An Sương']
  },
  'ct-sg': {
    label: 'CT → SG', route: 'Cần Thơ - Sài Gòn', price: 180000,
    fromStations: ['Bến xe Cần Thơ', 'Bến Ninh Kiều'],
    toStations: ['Văn phòng trung tâm', 'Trạm Kinh Dương Vương'],
    pickupStations: []
  },
  'sg-ag': {
    label: 'SG → AG', route: 'Sài Gòn - An Giang', price: 160000,
    fromStations: ['Văn phòng trung tâm', 'Trạm Kinh Dương Vương', 'Trạm An Sương'],
    toStations: ['Bến xe An Giang', 'Trạm Châu Thành', 'Trạm Tri Tôn'],
    pickupStations: ['Trạm An Sương']
  },
  'ag-sg': {
    label: 'AG → SG', route: 'An Giang - Sài Gòn', price: 160000,
    fromStations: ['Bến xe An Giang', 'Trạm Châu Thành', 'Trạm Tri Tôn'],
    toStations: ['Văn phòng trung tâm', 'Trạm Kinh Dương Vương'],
    pickupStations: []
  },
  'cd-ag': {
    label: 'CĐ → AG', route: 'Châu Đốc - An Giang', price: 90000,
    fromStations: ['Bến xe Châu Đốc', 'Trạm Châu Đốc', 'Trạm Tân Châu'],
    toStations: ['Bến xe An Giang', 'Trạm Châu Thành', 'Trạm Tri Tôn'],
    pickupStations: ['Trạm Tân Châu']
  },
  'ag-cd': {
    label: 'AG → CĐ', route: 'An Giang - Châu Đốc', price: 90000,
    fromStations: ['Bến xe An Giang', 'Trạm Châu Thành', 'Trạm Tri Tôn'],
    toStations: ['Bến xe Châu Đốc', 'Trạm Châu Đốc'],
    pickupStations: []
  }
};

// Global variables specific to Phơi xe
let phoiBulkMode = false; // chế độ chọn "phơi mẫu" để tạo hàng loạt — xem toggleBulkTemplateMode()
let bulkTemplateIds = [];
let phoiFilterDebounceTimer = null;

// refreshTripMetaFilters()/renderZone1TripList() đã có sẵn ở trên (đọc chung allTripsMeta) — hàm này chỉ
// là 1 wrapper giữ đúng tên gọi refreshTripsList() như code gốc bên callcenter.js.
function refreshTripsList() {
  refreshTripMetaFilters();
  renderZone1TripList();
}

// saveSeatBank() (js/shared/seat-bank.js) đã lưu tripSeatBank vào HN_STORAGE_KEY — chỉ cần tự lưu thêm
// allTripsMeta vào HN_TRIPS_KEY ở đây, không lặp lại literal localStorage.setItem cho HN_STORAGE_KEY.
function saveData() {
  localStorage.setItem(HN_TRIPS_KEY, JSON.stringify(allTripsMeta));
  saveSeatBank();
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
    updateSingleTripNameSuggestion();
  }
}

// Đổ danh sách "Hướng đi" (modal Tạo phơi xe đơn) từ TRIP_DIRECTIONS_CFG — gọi lại mỗi lần mở modal
// (openSingleModal/openEditModal) thay vì đổ 1 lần lúc nạp trang, để không phụ thuộc thứ tự script chạy
// trước/sau khi HTML đã sẵn sàng.
function populateTripDirectionSelect() {
  const sel = document.getElementById("tripDirection");
  if (!sel) return;
  sel.innerHTML = '<option value="">-- Chọn hướng tuyến --</option>' +
    Object.keys(TRIP_DIRECTIONS_CFG).map(key => `<option value="${key}">${TRIP_DIRECTIONS_CFG[key].label}</option>`).join('');
}

// Chọn "Hướng đi" xong mới có Trạm đi/Trạm đến/Trạm có thể nhận cụ thể để chọn (mỗi hướng 1 bộ trạm
// riêng, xem TRIP_DIRECTIONS_CFG) — đổi hướng thì đổ lại toàn bộ 3 ô này từ đầu, đồng thời set sẵn giá vé
// mặc định theo hướng (nhân viên vẫn sửa lại được nếu cần).
function onTripDirectionChange() {
  const dirKey = document.getElementById("tripDirection").value;
  const fromSel = document.getElementById("tripFromStation");
  const toSel = document.getElementById("tripToStation");
  const priceInput = document.getElementById("tripPrice");
  const cfg = TRIP_DIRECTIONS_CFG[dirKey];

  if (!cfg) {
    fromSel.innerHTML = '<option value="">-- Chọn hướng đi trước --</option>';
    toSel.innerHTML = '<option value="">-- Chọn hướng đi trước --</option>';
    renderPickupStationPills([]);
    return;
  }

  fromSel.innerHTML = '<option value="">-- Chọn trạm đi --</option>' +
    cfg.fromStations.map(s => `<option value="${s}">${s}</option>`).join('');
  toSel.innerHTML = '<option value="">-- Chọn trạm đến --</option>' +
    cfg.toStations.map(s => `<option value="${s}">${s}</option>`).join('');
  renderPickupStationPills(cfg.pickupStations);
  priceInput.value = cfg.price;

  updateSingleTripNameSuggestion();
}

// "Trạm có thể nhận thêm khách" hiện dạng chip checkbox nằm ngang (không phải <select multiple> cao
// lêu nghêu) — mỗi chip tự đổi màu qua class "checked" khi tick (xem toggleStationPill bên dưới), vì
// component chọn nhiều bằng checkbox không có trạng thái ":checked" ở cấp <label> để CSS tự bắt được.
function renderPickupStationPills(stations) {
  const container = document.getElementById("tripPickupStations");
  if (!container) return;
  if (!stations || !stations.length) {
    container.innerHTML = '<span class="station-pick-empty">Không có trạm dọc đường</span>';
    return;
  }
  container.innerHTML = stations.map(s => `
    <label class="station-pick-pill">
      <input type="checkbox" value="${s}" data-change-action="toggleStationPill" data-args='["__this__"]'>
      ${s}
    </label>`).join('');
}

function toggleStationPill(checkbox) {
  const pill = checkbox.closest('.station-pick-pill');
  if (pill) pill.classList.toggle('checked', checkbox.checked);
}

// Tên phơi tự cập nhật theo đúng format "Trạm đi - Trạm đến" mỗi khi 1 trong 2 ô đổi — nhân viên vẫn
// gõ tay đè lên được sau đó nếu muốn tên khác, chỉ auto-fill lại khi Trạm đi/Trạm đến đổi tiếp.
function updateSingleTripNameSuggestion() {
  const fromVal = document.getElementById("tripFromStation").value;
  const toVal = document.getElementById("tripToStation").value;
  const timeVal = document.getElementById("tripTime").value;
  const nameInput = document.getElementById("tripName");
  if (!fromVal || !toVal) return;
  // Có kèm giờ khởi hành trong tên gợi ý (nếu đã chọn giờ) — thiếu giờ khiến 2 phơi cùng tuyến, cùng
  // ngày nhưng khác giờ (VD 07:00 và 08:30) bị gợi ý trùng tên nhau, dẫn tới báo lỗi trùng tên (BR-01)
  // sai khi lưu phơi thứ 2 dù đây là 2 chuyến khác nhau.
  nameInput.value = timeVal ? `${fromVal} - ${toVal} (${timeVal})` : `${fromVal} - ${toVal}`;
}

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
  const filterStatusEl = document.getElementById("filterStatus");
  const fStatus = filterStatusEl ? filterStatusEl.value : '';

  if (!Array.isArray(allTripsMeta)) allTripsMeta = [];

  const filtered = allTripsMeta.filter(t => {
    if (!t) return false;

    // Chế độ chọn "phơi mẫu" (tạo hàng loạt) luôn hiện đủ toàn bộ danh sách mẫu cố định (isTemplate:true,
    // xem constants.js), bỏ qua mọi bộ lọc tên/ngày/hướng/tuyến đang để dở trên thanh lọc — nếu không,
    // bấm "Tạo phơi xe hàng loạt" lúc đang lọc dở (VD đổi "Ngày khởi hành" sang hôm khác) sẽ lọc mất hết
    // mẫu do các bộ lọc đó vốn để tìm phơi thật, không áp dụng được cho danh sách mẫu.
    if (phoiBulkMode) return t.isTemplate && t.status !== 'Đã hủy';

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

    // Lọc đúng theo ngày đã chọn — kể cả khi ngày đó trùng hôm nay (trước đây "hôm nay" bị coi là giá
    // trị mặc định "bỏ qua lọc ngày", khiến danh sách trộn lẫn phơi của mọi ngày lại với nhau).
    if (fDate && t.date && t.date !== fDate) return false;

    if (fDir) {
      if (fDir === 'chieu-di' && !routeStr.startsWith('Sài Gòn')) return false;
      if (fDir === 'chieu-ve' && routeStr.startsWith('Sài Gòn')) return false;
    }

    if (fRoute && routeStr !== fRoute) return false;

    if (fStatus && (t.status || 'Chưa chỉ định xe') !== fStatus) return false;

    return true;
  });

  // Phơi tạo gần nhất (createdAt lớn nhất) lên đầu — thay vì sắp theo giờ khởi hành như trước, để nhân
  // viên thấy ngay phơi vừa tạo đơn/tạo hàng loạt mà không phải dò tìm trong danh sách.
  filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  renderTable(filtered);
}

// Đưa thanh lọc phơi xe về mặc định
function resetPhoiFilters() {
  const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  setVal('filterName', '');
  setVal('filterDate', '');
  setVal('filterDirection', '');
  setVal('filterStatus', '');
  onFilterDirectionChange(); // dựng lại option của filterRoute theo đúng trạng thái "Tất cả"
  applyFilters();
}

// Card grid rendering
function renderTable(trips) {
  const grid = document.getElementById("tripsCardGrid");
  const emptyState = document.getElementById("emptyState");
  if (!grid) return;
  grid.innerHTML = '';

  if (!Array.isArray(trips) || trips.length === 0) {
    if (emptyState) emptyState.style.display = "flex";
    return;
  }
  if (emptyState) emptyState.style.display = "none";

  trips.forEach((t) => {
    if (!t) return;
    const timeStr = t.time || '00:00';
    const routeStr = t.route || '';
    const timeFormatted = timeStr.replace(':', 'h');

    const displayName = t.name || `${routeStr} (${timeFormatted})`;

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

    let statusClass = 'chua-chi-dinh';
    let label = t.status || 'Chưa chỉ định xe';
    if (label === 'Đã chỉ định xe') statusClass = 'da-chi-dinh';
    if (label === 'Đang bán') statusClass = 'dang-ban';
    if (label === 'Đã khởi hành') statusClass = 'da-khoi-hanh';
    if (label === 'Đã hủy') statusClass = 'da-huy';

    const sellDisabled = label === 'Đã hủy';

    const card = document.createElement("div");
    card.setAttribute("data-id", t.id);

    // Chế độ chọn "phơi mẫu" để tạo hàng loạt (bật/tắt bằng nút "Tạo phơi xe hàng loạt") — thẻ phơi lược
    // bớt route-btn/footer, cả thẻ trở thành 1 điểm bấm chọn/bỏ chọn giống chọn ghế ở sơ đồ ghế, có dấu
    // tích ở góc phải trên báo trạng thái đã chọn (xem toggleBulkTemplateMode/toggleBulkTemplateSelect).
    if (phoiBulkMode) {
      const selected = bulkTemplateIds.includes(t.id);
      card.className = `phoi-card phoi-card-selectable status-${statusClass}${selected ? ' selected' : ''}`;
      card.setAttribute("data-action", "toggleBulkTemplateSelect");
      card.setAttribute("data-args", JSON.stringify([t.id]));

      card.innerHTML = `
        <div class="phoi-card-select-check">${selected ? '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>' : ''}</div>
        <div class="phoi-card-top">
          <div class="phoi-card-schedule">
            <div class="phoi-card-time-row">
              <span class="phoi-card-time">${timeStr}</span>
              <span class="trip-plate-inline">${t.plate || '—'}</span>
            </div>
            <span class="phoi-card-date">${formattedDate}</span>
          </div>
          <span class="status-badge ${statusClass}"><span class="status-dot"></span>${label}</span>
        </div>
        <div class="phoi-card-name">${displayName}</div>
        <div class="phoi-card-meta">
          <div class="phoi-card-meta-item">
            <label>Loại xe</label>
            <span>${t.vehicleType || '—'}</span>
          </div>
          <div class="phoi-card-meta-item">
            <label>Ghế trống</label>
            <span>${emptyCount}/${totalCount}</span>
          </div>
          <div class="phoi-card-meta-item">
            <label>Giá vé</label>
            <span>${(t.price || 280000).toLocaleString('vi-VN')}đ</span>
          </div>
        </div>
      `;
      grid.appendChild(card);
      return;
    }

    card.className = `phoi-card status-${statusClass}`;
    card.addEventListener("dblclick", () => openEditModal(t.id));

    card.innerHTML = `
      <div class="phoi-card-top">
        <div class="phoi-card-schedule">
          <div class="phoi-card-time-row">
            <span class="phoi-card-time">${timeStr}</span>
            <span class="trip-plate-inline">${t.plate || '—'}</span>
          </div>
          <span class="phoi-card-date">${formattedDate}</span>
        </div>
        <button type="button" class="phoi-route-btn" title="Xem lộ trình" data-action="showTripRoute" data-stop-propagation="1" data-args='${JSON.stringify([t.id])}'>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
            <path d="M15 5.764v15.472" />
            <path d="M9 3.236v15.472" />
          </svg>
        </button>
        <span class="status-badge ${statusClass}"><span class="status-dot"></span>${label}</span>
      </div>
      <div class="phoi-card-name">${displayName}</div>
      <div class="phoi-card-meta">
        <div class="phoi-card-meta-item">
          <label>Loại xe</label>
          <span>${t.vehicleType || '—'}</span>
        </div>
        <div class="phoi-card-meta-item">
          <label>Ghế trống</label>
          <span>${emptyCount}/${totalCount}</span>
        </div>
        <div class="phoi-card-meta-item">
          <label>Giá vé</label>
          <span>${(t.price || 280000).toLocaleString('vi-VN')}đ</span>
        </div>
      </div>
      <div class="phoi-card-footer">
        <button type="button" class="btn btn-secondary phoi-edit-btn" data-action="openEditModal" data-stop-propagation="1" data-args='${JSON.stringify([t.id])}'>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px; height:14px;">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
          Chỉnh sửa
        </button>
        <button type="button" class="btn btn-primary phoi-sell-btn" data-action="sellTicketForTrip" data-stop-propagation="1" data-args='${JSON.stringify([t.id])}' ${sellDisabled ? 'disabled' : ''}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px; height:14px;">
            <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1a2 2 0 0 0 0 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a2 2 0 0 0 0-4V9Z" />
            <path d="M13 5v2M13 17v2M13 11v2" />
          </svg>
          Bán vé
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Nút "Hủy phơi xe" trong modal "Chỉnh sửa phơi xe" (chỉ hiện khi sửa phơi có sẵn — xem openEditModal).
function cancelTripFromModal() {
  const id = document.getElementById("editTripId").value;
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
    closeSingleModal();
  }
}

// Nút "Bán vé" trên thẻ phơi (trang Phơi xe) — chuyển sang tab Đặt vé và chọn sẵn đúng phơi đó ở Zone 1
// để nhân viên bán vé ngay, không phải tự tìm lại chuyến trong danh sách.
function sellTicketForTrip(tripId) {
  if (typeof selectZone1Hour === 'function') selectZone1Hour('all');
  switchView('booking');

  const trip = allTripsMeta.find(t => t.id === tripId);

  // Zone 1 tách riêng 2 danh sách Chiều đi (#tripListSGCD) / Chiều về (#tripListCDSG), luôn chỉ hiện 1
  // trong 2 (cái còn lại display:none). Thiếu bước hiện đúng danh sách chứa phơi đích thì thẻ phơi vẫn
  // được chọn đúng ngầm bên dưới nhưng nằm trong danh sách đang ẩn — nhìn như bấm "Bán vé" không nhảy
  // tới đâu cả, nhất là với phơi chiều về.
  const sgList = document.getElementById('tripListSGCD');
  const cdList = document.getElementById('tripListCDSG');
  if (trip && sgList && cdList) {
    const isCD = !trip.route.startsWith('Sài Gòn');
    sgList.style.display = isCD ? 'none' : '';
    cdList.style.display = isCD ? '' : 'none';
    selectedDirection = isCD ? 'cd-sg' : 'sg-cd';
  }

  const cardEl = document.querySelector(`.trip-card[data-trip="${tripId}"]`);
  if (cardEl) {
    selectTrip(cardEl, trip ? trip.time : '', trip ? trip.route : '');
    cardEl.scrollIntoView({ block: 'nearest' });
  } else {
    showToast('Không tìm thấy phơi xe này trong danh sách đặt vé.');
  }
}

// Icon bản đồ trên thẻ phơi — mở modal xem lộ trình (điểm xuất phát, các điểm đón dọc đường, điểm đến)
// dựng từ đúng dữ liệu đã lưu khi tạo/sửa phơi (trip.fromStation/toStation/pickupStations).
const TRIP_ROUTE_STEP_ICONS = {
  start: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/></svg>',
  stop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-6.5-5.86-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.14-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.2"/></svg>',
  end: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V4"/><path d="M5 4h13l-3 4 3 4H5"/></svg>'
};

function renderTripRouteStep(step) {
  return `
    <div class="trip-route-step ${step.type}">
      <div class="trip-route-step-marker">${TRIP_ROUTE_STEP_ICONS[step.type]}</div>
      <div class="trip-route-step-body">
        <div class="trip-route-step-label">${step.label}</div>
        <div class="trip-route-step-name">${step.name}</div>
      </div>
    </div>
  `;
}

function showTripRoute(tripId) {
  const trip = allTripsMeta.find(t => t.id === tripId);
  if (!trip) return;

  const nameEl = document.getElementById('tripRouteName');
  const metaEl = document.getElementById('tripRouteMeta');
  const timelineEl = document.getElementById('tripRouteTimeline');
  if (!timelineEl) return;

  if (nameEl) nameEl.textContent = trip.name || `${trip.route} (${trip.time})`;

  let formattedDate = '';
  if (trip.date && typeof trip.date === 'string') {
    const parts = trip.date.split('-');
    if (parts.length === 3) formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  if (metaEl) metaEl.textContent = [trip.time, formattedDate, trip.plate].filter(Boolean).join(' • ');

  const steps = [];
  if (trip.fromStation) steps.push({ type: 'start', label: 'Điểm xuất phát', name: trip.fromStation });
  (Array.isArray(trip.pickupStations) ? trip.pickupStations : []).forEach(s => {
    steps.push({ type: 'stop', label: 'Điểm đón khách', name: s });
  });
  if (trip.toStation) steps.push({ type: 'end', label: 'Điểm đến', name: trip.toStation });

  timelineEl.innerHTML = steps.length
    ? steps.map(renderTripRouteStep).join('')
    : `<p class="trip-route-empty">Chưa có thông tin lộ trình chi tiết cho phơi xe này.</p>`;

  document.getElementById('tripRouteModal').classList.add('open');
}

// Single Modal triggers
function openSingleModal() {
  document.getElementById("singleModalTitle").textContent = "Tạo phơi xe mới";
  document.getElementById("singleForm").reset();
  document.getElementById("editTripId").value = '';
  document.getElementById("editStatusRow").style.display = "none";
  document.getElementById("btnSaveSingle").disabled = false;
  document.getElementById("btnCancelTrip").style.display = "none";

  populateTripDirectionSelect();
  onTripDirectionChange();

  const today = new Date().toISOString().split("T")[0];
  document.getElementById("tripDate").value = today;
  document.getElementById("singleModal").classList.add("active");
  document.getElementById("singleModal").classList.add("open");
}

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

  document.getElementById("tripDate").value = trip.date || '';
  document.getElementById("tripTime").value = trip.time || '';
  document.getElementById("tripVehicleType").value = trip.vehicleType || 'Limousine 24 Phòng';
  document.getElementById("tripNote").value = trip.note || '';

  document.getElementById("tripStatus").value = trip.status || 'Chưa chỉ định xe';
  document.getElementById("tripPlate").value = trip.plate || '';

  // Suy ngược đúng key hướng đi (vd 'sg-cd') từ chuỗi route đã lưu ('Sài Gòn - Châu Đốc') để chọn sẵn
  // trong dropdown "Hướng đi" — phơi tạo trước khi có tính năng này (chưa lưu fromStation/toStation) vẫn
  // suy ra đúng hướng qua route, chỉ là Trạm đi/Trạm đến sẽ để trống cho nhân viên tự chọn lại.
  populateTripDirectionSelect();
  const dirKey = Object.keys(TRIP_DIRECTIONS_CFG).find(k => TRIP_DIRECTIONS_CFG[k].route === trip.route) || '';
  document.getElementById("tripDirection").value = dirKey;
  onTripDirectionChange();

  document.getElementById("tripFromStation").value = trip.fromStation || '';
  document.getElementById("tripToStation").value = trip.toStation || '';
  const savedPickups = Array.isArray(trip.pickupStations) ? trip.pickupStations : [];
  document.querySelectorAll("#tripPickupStations input[type='checkbox']").forEach(cb => {
    cb.checked = savedPickups.includes(cb.value);
    cb.closest('.station-pick-pill').classList.toggle('checked', cb.checked);
  });

  // Ghi đè lại giá vé/tên phơi thật của phơi này — onTripDirectionChange() ở trên vừa set giá mặc định
  // theo hướng nên phải set lại SAU, nếu không sẽ mất giá vé thật đã lưu trước đó.
  document.getElementById("tripPrice").value = trip.price || 280000;
  document.getElementById("tripName").value = trip.name || '';

  const isReadOnly = (trip.status === 'Đã khởi hành' || trip.status === 'Đã hủy');
  const inputs = document.querySelectorAll("#singleForm input, #singleForm select, #singleForm button[type='submit']");
  inputs.forEach(el => {
    if (el.id !== 'btnSaveSingle') el.disabled = isReadOnly;
  });
  document.getElementById("btnSaveSingle").disabled = isReadOnly;

  const btnCancelTrip = document.getElementById("btnCancelTrip");
  btnCancelTrip.style.display = "";
  btnCancelTrip.disabled = isReadOnly;

  document.getElementById("singleModal").classList.add("active");
  document.getElementById("singleModal").classList.add("open");
}

// Cập nhật phơi đã có. Trả về false nếu người dùng huỷ xác nhận đổi loại xe (báo cho saveSingleTrip
// dừng lại, không lưu/đóng modal) — giữ đúng hành vi early-return của bản gốc.
function updateExistingTrip(id, fields) {
  const { finalName, dateVal, routeVal, fromStationVal, toStationVal, pickupStationsVal, timeVal, vehicleVal, priceVal, noteVal, statusVal, plateVal } = fields;
  const tripIdx = allTripsMeta.findIndex(t => t.id === id);
  if (tripIdx === -1) return true;
  const trip = allTripsMeta[tripIdx];

  trip.name = finalName;
  trip.date = dateVal;
  trip.route = routeVal;
  trip.fromStation = fromStationVal;
  trip.toStation = toStationVal;
  trip.pickupStations = pickupStationsVal;
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
  const { finalName, dateVal, routeVal, fromStationVal, toStationVal, pickupStationsVal, timeVal, vehicleVal, priceVal, noteVal } = fields;
  const newId = (Date.now().toString() + Math.random().toString(36).substr(2, 5));
  const newTrip = {
    id: newId,
    name: finalName,
    date: dateVal,
    route: routeVal,
    fromStation: fromStationVal,
    toStation: toStationVal,
    pickupStations: pickupStationsVal,
    time: timeVal,
    vehicleType: vehicleVal,
    price: priceVal,
    note: noteVal,
    status: 'Chưa chỉ định xe',
    plate: '',
    createdAt: Date.now()
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
  const fromStationVal = document.getElementById("tripFromStation").value;
  const toStationVal = document.getElementById("tripToStation").value;
  const pickupStationsVal = Array.from(document.querySelectorAll("#tripPickupStations input[type='checkbox']:checked")).map(cb => cb.value);
  const timeVal = document.getElementById("tripTime").value;
  const vehicleVal = document.getElementById("tripVehicleType").value;
  const priceVal = parseInt(document.getElementById("tripPrice").value) || 280000;
  const noteVal = document.getElementById("tripNote").value.trim();
  const statusVal = document.getElementById("tripStatus").value || 'Chưa chỉ định xe';
  const plateVal = document.getElementById("tripPlate").value.trim();

  const dirCfg = TRIP_DIRECTIONS_CFG[dirVal];
  if (!dirCfg || !fromStationVal || !toStationVal) {
    showToast('Vui lòng chọn đầy đủ Hướng đi, Trạm đi và Trạm đến');
    return;
  }
  const routeVal = dirCfg.route;
  const suggested = `${fromStationVal} - ${toStationVal}`;
  const finalName = nameVal || suggested;

  // Không ràng buộc trùng tên/trùng giờ phơi nữa — nhân viên có thể chủ động tạo nhiều phơi trùng tên
  // hoặc trùng giờ khởi hành trong cùng 1 ngày nếu cần (VD tăng cường thêm xe cùng khung giờ).
  const fields = { finalName, dateVal, routeVal, fromStationVal, toStationVal, pickupStationsVal, timeVal, vehicleVal, priceVal, noteVal, statusVal, plateVal };

  if (id) {
    if (!updateExistingTrip(id, fields)) return;
  } else {
    createNewTrip(fields);
  }

  saveData();
  refreshTripsList();
  refreshVehicleHeaderIfCurrent(id);
  applyFilters();
  closeSingleModal();
}

// ===== Tạo phơi xe hàng loạt từ "phơi mẫu" =====
// Bấm "Tạo phơi xe hàng loạt" để bật chế độ chọn — thẻ phơi trong danh sách trở thành "phơi mẫu" bấm
// chọn được (giống chọn ghế ở sơ đồ ghế), thanh dính đáy hiện ra cho chọn khoảng Từ ngày/Đến ngày rồi
// bấm "Tạo hàng loạt" để nhân bản các phơi mẫu đã chọn cho mỗi ngày trong khoảng đó. Bấm lại nút "Tạo
// phơi xe hàng loạt" (hoặc "Hủy" trên thanh) để thoát chế độ chọn, quay về danh sách phơi bình thường —
// sau khi tạo thành công cũng tự thoát để thấy ngay các phơi vừa tạo trong danh sách.
function toggleBulkTemplateMode() {
  phoiBulkMode = !phoiBulkMode;
  bulkTemplateIds = [];

  const labelEl = document.getElementById("btnBulkCreateLabel");
  const btn = document.getElementById("btnBulkCreate");
  const bar = document.getElementById("bulkTemplateBar");
  const singleCreateBtn = document.getElementById("btnSingleCreate");

  if (phoiBulkMode) {
    if (labelEl) labelEl.textContent = "Hủy chọn phơi mẫu";
    if (btn) btn.classList.add("active-bulk");
    if (bar) bar.style.display = "flex";
    if (singleCreateBtn) singleCreateBtn.style.display = "none";

    const today = new Date().toISOString().split("T")[0];
    const fromEl = document.getElementById("bulkTplFromDate");
    const toEl = document.getElementById("bulkTplToDate");
    if (fromEl) { fromEl.value = today; fromEl.min = today; }
    if (toEl) { toEl.value = today; toEl.min = today; }
  } else {
    if (labelEl) labelEl.textContent = "Tạo phơi xe hàng loạt";
    if (btn) btn.classList.remove("active-bulk");
    if (bar) bar.style.display = "none";
    if (singleCreateBtn) singleCreateBtn.style.display = "";
  }

  updateBulkTemplateHint();
  applyFilters();
}

function toggleBulkTemplateSelect(id) {
  const idx = bulkTemplateIds.indexOf(id);
  if (idx === -1) bulkTemplateIds.push(id);
  else bulkTemplateIds.splice(idx, 1);
  updateBulkTemplateHint();
  applyFilters();
}

function updateBulkTemplateHint() {
  const hint = document.getElementById("bulkTemplateHint");
  const createBtn = document.getElementById("bulkTemplateCreateBtn");
  if (hint) {
    hint.textContent = bulkTemplateIds.length
      ? `Đã chọn ${bulkTemplateIds.length} phơi mẫu`
      : "Chọn các phơi mẫu bên trên để tạo hàng loạt theo khoảng ngày";
  }
  if (createBtn) createBtn.disabled = bulkTemplateIds.length === 0;
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

// Nhân bản từng "phơi mẫu" cho mỗi ngày trong khoảng đã chọn — giữ nguyên tuyến/giờ/loại xe/giá/tên/
// trạm đi-đến/trạm đón dọc đường, KHÔNG copy biển số hay trạng thái của mẫu (phơi mới luôn bắt đầu
// "Chưa chỉ định xe" như tạo phơi đơn thật sự). Không ràng buộc trùng tên/trùng lịch — nhân viên có thể
// chủ động tạo thêm phơi trùng tên hoặc trùng giờ nếu cần (VD tăng cường thêm xe).
function createBulkTripsFromTemplates(validDates, templates) {
  let createdCount = 0;

  validDates.forEach(dateVal => {
    templates.forEach(tpl => {
      const finalName = tpl.name || `${tpl.route} (${tpl.time})`;
      const newId = (Date.now().toString() + Math.random().toString(36).substr(2, 5));
      const newTrip = {
        id: newId,
        name: finalName,
        date: dateVal,
        route: tpl.route,
        time: tpl.time,
        vehicleType: tpl.vehicleType,
        price: tpl.price,
        status: 'Chưa chỉ định xe',
        plate: '',
        note: tpl.note || '',
        fromStation: tpl.fromStation || '',
        toStation: tpl.toStation || '',
        pickupStations: Array.isArray(tpl.pickupStations) ? [...tpl.pickupStations] : [],
        createdAt: Date.now()
      };
      allTripsMeta.push(newTrip);

      tripSeatBank[newId] = generateNewEmptyPlan(tpl.vehicleType, tpl.price);
      tripSeatBank[newId].plate = '';
      tripSeatBank[newId].vehicleType = tpl.vehicleType;
      tripSeatBank[newId].driver = '';
      tripSeatBank[newId].helper = '';
      tripSeatBank[newId].subSeats = [];
      tripSeatBank[newId].extraSeats = [];

      createdCount++;
    });
  });

  return { createdCount };
}

function confirmBulkFromTemplates() {
  if (bulkTemplateIds.length === 0) return;

  const fromDateStr = document.getElementById("bulkTplFromDate").value;
  const toDateStr = document.getElementById("bulkTplToDate").value;
  if (!fromDateStr || !toDateStr) {
    alert("Vui lòng chọn Từ ngày và Đến ngày.");
    return;
  }
  if (new Date(toDateStr) < new Date(fromDateStr)) {
    alert("Ngày kết thúc không được nhỏ hơn ngày bắt đầu.");
    return;
  }

  const validDates = computeBulkTripDates(fromDateStr, toDateStr, [0, 1, 2, 3, 4, 5, 6]);
  const templates = bulkTemplateIds.map(id => allTripsMeta.find(t => t.id === id)).filter(Boolean);
  const totalExpected = validDates.length * templates.length;

  const confirmed = confirm(`Hệ thống sẽ tạo khoảng ${totalExpected} phơi xe từ ${templates.length} phơi mẫu đã chọn. Xác nhận tạo?`);
  if (!confirmed) return;

  const { createdCount } = createBulkTripsFromTemplates(validDates, templates);

  // Giữ nguyên bộ lọc "Ngày khởi hành" đang chọn (mặc định hôm nay) — phơi vừa tạo hàng loạt vẫn nằm
  // đúng ngày của nó trong dữ liệu, chỉ hiện ra khi lọc đúng ngày đó, không tự ý gộp hiện tất cả các ngày.
  saveData();
  refreshTripsList();
  // Ở lại chế độ chọn "phơi mẫu" sau khi tạo xong (không gọi toggleBulkTemplateMode() để thoát) — nhân
  // viên có thể chọn tiếp mẫu khác hoặc đổi khoảng ngày để tạo thêm đợt khác ngay, không phải bấm lại nút
  // "Tạo phơi xe hàng loạt" từ đầu mỗi lần. Chỉ xoá lượt chọn mẫu cũ để tránh tạo trùng đợt vừa xong.
  bulkTemplateIds = [];
  updateBulkTemplateHint();
  applyFilters();

  alert(`Đã tạo thành công ${createdCount} phơi xe.`);
}

// Init phơi dates and event listeners
(function initPhoiDashboard() {
  const today = new Date().toISOString().split("T")[0];
  const filterDate = document.getElementById("filterDate");
  const tripDate = document.getElementById("tripDate");

  if (filterDate) filterDate.value = today;
  if (tripDate) {
    tripDate.value = today;
    tripDate.min = today;
  }
})();

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
        <div class="z1-header">
          <div class="z1-time-block">
            <div class="z1-clock"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg></div>
            <span class="trip-time">${t.time}</span>
          </div>
          <div class="z1-divider"></div>
          <span class="trip-plate-inline">${plate}</span>
          <div class="trip-seat-tag ${seatTagClass}">${bookedSeats}/${totalSeats}</div>
        </div>
        <div class="z1-name-row">
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
  if (e.key === HN_SHUTTLE_DRIVER_KEY) {
    renderTransshipTables();
    // So bản đồ tài xế mới/cũ -> đánh dấu cập nhật cho các dòng khách có SĐT vừa đổi (cột "Trung chuyển")
    // rồi render lại để những dòng đó nổi lên đầu bảng gộp.
    pkApplyShuttleDriverChange();
    if (currentView === 'pickup') pkRenderPaxTable();
  }
});

// ===================== RƯỚC LIỀN (gộp từ pickup-list.js) =====================
// Toàn bộ phần dưới đây được gộp từ file js/pickup-list.js cũ (trang pickup-list.html đã bị xoá,
// nút "Rước liền" giờ chuyển view ngay trong trang qua switchView('pickup') thay vì điều hướng sang
// trang khác). Các biến/hàm bị trùng tên với phần code phía trên (nhưng khác chức năng) đã đổi tên
// với tiền tố "pk"; các hằng dữ liệu mẫu giống hệt (staffList, stopsFirst, stopsLast, nameSamples,
// noteSamples, phonePool) và biến allTripsMeta/tripSeatBank dùng lại bản đã có ở trên, không tạo bản
// sao riêng nữa — tránh 2 bản dữ liệu ghế lệch nhau ngay trên cùng 1 trang.

const DEFAULT_PICKUP_PASSENGERS = [
  { id: 1, name: 'Nguyễn Thị Hồng', phone: '0909123456', ticketCount: 1, fromStation: 'Trạm Kinh Dương Vương', toStation: 'Trạm Châu Đốc', fromTransfer: '12 Kinh Dương Vương, Q.Bình Tân', toTransfer: 'Ngã 3 Vĩnh Xương, Châu Đốc', note: 'Khách lớn tuổi, cần hỗ trợ lên xuống xe', assigned: null, date: '2026-07-18', createdAt: '2026-07-18T07:05:00', printedAt: '2026-07-18T07:10:00', statusNote: 'Khách yêu cầu gọi trước 10 phút khi xe tới' },
  { id: 2, name: 'Trần Văn Bình', phone: '0918234567', ticketCount: 1, fromStation: 'Trạm An Sương', toStation: 'Trạm Long Xuyên', fromTransfer: '45 Trường Chinh, Q.12', toTransfer: 'Công viên Long Xuyên', note: '', assigned: { tripId: '1', seat: 'A12' }, date: '2026-07-18', createdAt: '2026-07-18T07:20:00', printedAt: '2026-07-18T07:35:00', statusNote: '' },
  { id: 3, name: 'Lê Thị Mai', phone: '0933345678', ticketCount: 2, fromStation: 'Trạm Q.5', toStation: 'Trạm Tân Châu', fromTransfer: '88 Nguyễn Trãi, Q.5', toTransfer: 'Bến phà Tân Châu', note: 'Đi cùng 1 trẻ nhỏ', assigned: null, date: '2026-07-18', createdAt: '2026-07-18T08:10:00', printedAt: '', statusNote: 'Đang chờ xác nhận trung chuyển đón' },
  { id: 4, name: 'Phạm Quốc Huy', phone: '0944456789', ticketCount: 1, fromStation: 'Văn phòng trung tâm', toStation: 'Bến xe Châu Đốc', fromTransfer: '120 Lê Hồng Phong, Q.10', toTransfer: 'Bến xe Châu Đốc', note: '', assigned: null, date: '2026-07-18', createdAt: '2026-07-18T08:45:00', printedAt: '', statusNote: '' },
  { id: 5, name: 'Võ Thị Kim Ngân', phone: '0977567890', ticketCount: 2, fromStation: 'Trạm Kinh Dương Vương', toStation: 'Trạm Cần Thơ', fromTransfer: '5 Hồ Học Lãm, Bình Tân', toTransfer: 'Bến Ninh Kiều, Cần Thơ', note: 'Gọi trước 15 phút khi xe tới', assigned: null, date: '2026-07-18', createdAt: '2026-07-18T09:15:00', printedAt: '2026-07-18T09:20:00', statusNote: 'Đã liên hệ tài xế, đang chờ xác nhận giờ đón' }
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

// Dữ liệu mẫu minh hoạ trạng thái "đã gán tài xế" ở cột "Trạng thái" (trang Rước liền) — cột này đọc
// tên tài xế từ HN_SHUTTLE_DRIVER_KEY (ghi bởi trang shuttle.html thật, xem pkRenderPaxTable()); chỉ
// set khi key này CHƯA có gì trong localStorage, để không đè lên phân công tài xế thật đã gán. Gán mẫu
// cho Trần Văn Bình (chỉ có tài xế, chưa có ghi chú) và Võ Thị Kim Ngân (có cả tài xế lẫn ghi chú) để
// đủ minh hoạ mọi trạng thái của cột: trống / chỉ ghi chú / chỉ tài xế / cả hai.
function seedDefaultShuttleDriverAssignment() {
  try {
    if (localStorage.getItem(HN_SHUTTLE_DRIVER_KEY)) return;
    const sampleMap = {
      '0918234567_don': { driverName: 'Nguyễn Văn Tài', driverPhone: '0912345678', driverPlate: '51B-888.99', driverVehicleType: 'Xe 7 chỗ trung chuyển' },
      '0977567890_don': { driverName: 'Lê Minh Phát', driverPhone: '0938765432', driverPlate: '51B-234.56', driverVehicleType: 'Xe 16 chỗ trung chuyển' }
    };
    localStorage.setItem(HN_SHUTTLE_DRIVER_KEY, JSON.stringify(sampleMap));
  } catch (e) { }
}
seedDefaultShuttleDriverAssignment();

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

/* ---- Modal thông tin khách rước (chuyển từ callcenter.js qua) ---- */
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
  refreshPickupPrice();
}
function openPickupModal() {
  const modal = document.getElementById('pickupModal');
  document.getElementById('pickupCustomerName').value = '';
  document.getElementById('pickupPhone').value = '';
  renderExtraPhoneFields('pickup_phone_extra', [], 'refreshPickupPreview');
  document.getElementById('pickupTicketCount').value = '1';
  document.getElementById('pickupStation').value = '';
  document.getElementById('pickupAddress').value = '';
  document.getElementById('pickupDestination').value = '';
  document.getElementById('pickupTrip').value = '';
  document.getElementById('pickupNote').value = '';
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

  if (!name || !phone) {
    showToast('Vui lòng nhập họ tên và số điện thoại khách');
    return;
  }

  const defaults = [
    { id: 1, name: 'Nguyễn Thị Hồng', phone: '0909123456', ticketCount: 1, fromStation: 'Trạm Kinh Dương Vương', toStation: 'Trạm Châu Đốc', fromTransfer: '12 Kinh Dương Vương, Q.Bình Tân', toTransfer: 'Ngã 3 Vĩnh Xương, Châu Đốc', note: 'Khách lớn tuổi, cần hỗ trợ lên xuống xe', assigned: null, guestType: 'Rước liền', isRuocLien: true, createdAt: '2026-07-18T07:05:00', printedAt: '2026-07-18T07:10:00', statusNote: 'Khách yêu cầu gọi trước 10 phút khi xe tới' },
    { id: 2, name: 'Trần Văn Bình', phone: '0918234567', ticketCount: 1, fromStation: 'Trạm An Sương', toStation: 'Trạm Long Xuyên', fromTransfer: '45 Trường Chinh, Q.12', toTransfer: 'Công viên Long Xuyên', note: '', assigned: { tripId: '1', seat: 'A12' }, guestType: 'Rước liền', isRuocLien: true, createdAt: '2026-07-18T07:20:00', printedAt: '2026-07-18T07:35:00', statusNote: '' },
    { id: 3, name: 'Lê Thị Mai', phone: '0933345678', ticketCount: 2, fromStation: 'Trạm Q.5', toStation: 'Trạm Tân Châu', fromTransfer: '88 Nguyễn Trãi, Q.5', toTransfer: 'Bến phà Tân Châu', note: 'Đi cùng 1 trẻ nhỏ', assigned: null, guestType: 'Rước liền', isRuocLien: true, createdAt: '2026-07-18T08:10:00', printedAt: '', statusNote: 'Đang chờ xác nhận trung chuyển đón' },
    { id: 4, name: 'Phạm Quốc Huy', phone: '0944456789', ticketCount: 1, fromStation: 'Văn phòng trung tâm', toStation: 'Bến xe Châu Đốc', fromTransfer: '120 Lê Hồng Phong, Q.10', toTransfer: 'Bến xe Châu Đốc', note: '', assigned: null, guestType: 'Rước liền', isRuocLien: true, createdAt: '2026-07-18T08:45:00', printedAt: '', statusNote: '' },
    { id: 5, name: 'Võ Thị Kim Ngân', phone: '0977567890', ticketCount: 2, fromStation: 'Trạm Kinh Dương Vương', toStation: 'Trạm Cần Thơ', fromTransfer: '5 Hồ Học Lãm, Bình Tân', toTransfer: 'Bến Ninh Kiều, Cần Thơ', note: 'Gọi trước 15 phút khi xe tới', assigned: null, guestType: 'Rước liền', isRuocLien: true, createdAt: '2026-07-18T09:15:00', printedAt: '2026-07-18T09:20:00', statusNote: 'Đã liên hệ tài xế, đang chờ xác nhận giờ đón' }
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
    assigned: null,
    guestType: 'Rước liền',
    isRuocLien: true,
    // Cột "Thời gian" trang Rước liền — mốc lúc thông tin khách được nhập từ modal "Rước liền" này.
    createdAt: new Date().toISOString()
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

// ===== Danh sách hành khách rước liền =====

// "Đẩy lên đầu khi có cập nhật mới" — mỗi lần cột "Trung chuyển" (tài xế/ghi chú tài xế đổi bên
// shuttle.html) hoặc cột "Phòng vé" (ghi chú trạng thái) của MỘT dòng thay đổi thì gọi pkMarkRowUpdated()
// với khoá dòng đó; pkRenderPaxTable() sắp các dòng có mốc cập nhật lên trước (mới nhất trước), áp dụng
// cho CẢ khách rước liền lẫn khách trung chuyển trong cùng bảng gộp. Mốc chỉ sống trong phiên làm việc.
let pkUpdateSeq = 0;
const pkRowUpdateStamp = new Map(); // rowKey -> seq (số càng lớn = cập nhật càng mới)
function pkMarkRowUpdated(rowKey) {
  if (!rowKey) return;
  pkUpdateSeq += 1;
  pkRowUpdateStamp.set(rowKey, pkUpdateSeq);
}
function pkPickupRowKey(p) { return 'pk:' + p.id; }
function pkTransshipRowKey(ticketNoOrRow) {
  if (ticketNoOrRow && ticketNoOrRow.main) return 'ts:' + (ticketNoOrRow.main.ticketNo || ticketNoOrRow.seatCodes.join(','));
  return 'ts:' + (ticketNoOrRow || '');
}

// Bản đồ tài xế trung chuyển (HN_SHUTTLE_DRIVER_KEY) lần trước — để so ra ĐÚNG những SĐT vừa đổi khi có
// sự kiện 'storage', rồi đánh dấu cập nhật cho các dòng khách tương ứng (cả rước liền lẫn trung chuyển).
let pkPrevShuttleDriverMap = (() => {
  try { return JSON.parse(localStorage.getItem(HN_SHUTTLE_DRIVER_KEY) || '{}') || {}; } catch (e) { return {}; }
})();
let pkPendingTransshipUpdatePhones = null; // Set<phone> — dòng trung chuyển cần đánh dấu ở lần render kế
function pkApplyShuttleDriverChange() {
  let newMap = {};
  try { newMap = JSON.parse(localStorage.getItem(HN_SHUTTLE_DRIVER_KEY) || '{}') || {}; } catch (e) { newMap = {}; }
  const changedPhones = new Set();
  new Set([...Object.keys(newMap), ...Object.keys(pkPrevShuttleDriverMap)]).forEach(k => {
    if (JSON.stringify(newMap[k] || null) !== JSON.stringify(pkPrevShuttleDriverMap[k] || null)) {
      changedPhones.add(String(k).replace(/_(don|tra)$/, ''));
    }
  });
  pkPrevShuttleDriverMap = newMap;
  if (!changedPhones.size) return;
  pickupPassengers.forEach(p => {
    if (changedPhones.has(String(p.phone || '').replace(/\s+/g, ''))) pkMarkRowUpdated(pkPickupRowKey(p));
  });
  pkPendingTransshipUpdatePhones = changedPhones; // dòng trung chuyển gộp từ seat bank — đánh dấu ở pkRenderPaxTable
}

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

  // Tài xế trung chuyển được gán ở trang shuttle.html, đọc lại qua HN_SHUTTLE_DRIVER_KEY (khoá theo
  // "sđt_don" — xem shuttleDriverLegKey() bên shuttle.js) — dùng cùng công thức khoá với cột "Tài xế"
  // bảng "Trung chuyển đón" (renderTransshipTables). Dùng chung cho cả dòng khách rước liền lẫn dòng
  // hành khách trung chuyển gộp bên dưới.
  let shuttleDriverMap = {};
  try {
    const rawDriverMap = localStorage.getItem(HN_SHUTTLE_DRIVER_KEY);
    if (rawDriverMap) shuttleDriverMap = JSON.parse(rawDriverMap);
  } catch (e) { }

  const pkRenderPickupRow = (p, idx, shuttleDriverMap) => {
    // Hành trình — gộp Trạm đi/Trạm đến (điểm chính) với Trung chuyển đi/đến (địa chỉ đón/trả cụ thể)
    // thành 1 cột duy nhất, cùng kiểu trình bày .pax-route/.pax-route-row/.pax-route-connector với cột
    // "Hành trình" bảng Lịch sử hành khách (chấm đỏ = điểm đi, ghim xám = điểm đến).
    const firstStopHtml = p.fromTransfer
      ? `${escapeHtml(p.fromStation || '—')}<div class="ch-sub-address" style="font-size:12px;color:var(--text-sub);margin-top:2px;">Đón: ${escapeHtml(p.fromTransfer)}</div>`
      : escapeHtml(p.fromStation || '—');
    const lastStopHtml = p.toTransfer
      ? `${escapeHtml(p.toStation || '—')}<div class="ch-sub-address" style="font-size:12px;color:var(--text-sub);margin-top:2px;">Trả: ${escapeHtml(p.toTransfer)}</div>`
      : escapeHtml(p.toStation || '—');
    const routeHtml = `
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
      </div>`;

    // "Số ghế" — trước đây là cột "Tên phơi xe" (tên phơi + ghế). Giờ chỉ hiện SỐ GHẾ đã chỉ định; bấm
    // vào số ghế thì nhảy thẳng sang phơi được chỉ định (sellTicketForTrip → switchView('booking') + chọn
    // đúng thẻ phơi ở Zone 1). Chưa gán phơi nào thì hiện dấu "_".
    let seatCell, actionCell;
    if (p.assigned) {
      const seatStr = p.assigned.seat || (Array.isArray(p.assigned.seats) ? p.assigned.seats.join(', ') : 'Rước liền');
      seatCell = `<button type="button" class="pk-seat-link" data-action="sellTicketForTrip" data-args='${JSON.stringify([p.assigned.tripId])}' title="Bấm để mở phơi đã chỉ định">${escapeHtml(seatStr)}</button>`;
      actionCell = `<button class="assign-action-btn reassign" data-action="pkOpenAssignModal" data-args='[${p.id}]'>Đổi chỉ định</button>`;
    } else {
      seatCell = `<span class="pk-seat-none">_</span>`;
      actionCell = `<button class="assign-action-btn" data-action="pkOpenAssignModal" data-args='[${p.id}]'><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 5v14M5 12h14"/></svg>Chỉ định</button>`;
    }

    // "Thời gian" — thời điểm thông tin khách được nhập từ modal "Rước liền" (savePickupInfo() ở trên
    // ghi p.createdAt lúc lưu modal; syncRuocLienToPickupList() ở js/shared/booking.js cũng ghi/giữ
    // nguyên trường này cho đường nhập liệu qua panel đặt vé). Khách demo/nhập từ trước khi có trường
    // này thì hiện "—" thay vì báo lỗi.
    const createdTimeStr = p.createdAt ? `${formatHistoryDate(p.createdAt)}<br>${formatActionTime(p.createdAt)}` : '—';

    // "In lúc" — thời điểm danh sách được in, dành cho trang Trung chuyển làm sau (chưa có nơi nào ghi
    // p.printedAt) — hiện "—" cho tới khi tính năng in đó được triển khai.
    const printedTimeStr = p.printedAt ? `${formatHistoryDate(p.printedAt)}<br>${formatActionTime(p.printedAt)}` : '—';

    // Cột "Trung chuyển" — CHỈ tên tài xế trung chuyển đã gán bên trang shuttle.html + ghi chú của tài xế
    // đó (driverNote, cũng lấy từ shuttle). Để trống nếu chưa gán. KHÔNG hiện ghi chú của cột "Phòng vé"
    // (p.statusNote) ở đây. Chỉ để HIỂN THỊ, không bấm được.
    const driverKey = `${(p.phone || '').replace(/\s+/g, '')}_don`;
    const assignedDriver = shuttleDriverMap[driverKey];
    const hasStatusNote = !!p.statusNote;
    const driverNote = (assignedDriver && assignedDriver.driverNote) || '';
    const transshipCell = assignedDriver
      ? `<div class="pk-transship-cell">
          <span class="pk-driver-name">${escapeHtml(assignedDriver.driverName)}</span>
          ${driverNote ? `<span class="pk-driver-sub">${escapeHtml(driverNote)}</span>` : ''}
        </div>`
      : '';

    // Cột "Phòng vé" — ghi chú trạng thái đón do phòng vé nhập (p.statusNote), hiện thẳng NỘI DUNG trong ô
    // giống cột "Trung chuyển". Luôn bấm được (dù có ghi chú hay trống) để mở modal ghi/sửa
    // (#pkStatusNoteModal). Ghi/đổi ghi chú xong thì đẩy khách này lên đầu danh sách (xem pkSaveStatusNote()).
    const phongVeCell = `<button type="button" class="pk-note-cell${hasStatusNote ? ' has-note' : ''}" data-action="pkOpenStatusNoteModal" data-args='[${p.id}]' title="Bấm để ghi/sửa ghi chú trạng thái">
        ${hasStatusNote
          ? `<span class="pk-note-text">${escapeHtml(p.statusNote)}</span>`
          : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`}
      </button>`;

    return `
      <tr>
        <td class="col-stt">${idx + 1}</td>
        <td><div class="pax-info"><div class="pax-name">KH: ${escapeHtml(p.name || '')}</div><div class="pax-phone">SĐT: ${escapeHtml(p.phone || '')}</div></div></td>
        <td>${routeHtml}</td>
        <td class="center" style="font-weight:700; font-size:13.5px; color:var(--text-main);">${p.ticketCount || p.count || 1}</td>
        <td class="center">${seatCell}</td>
        <td class="note-cell">${p.note ? escapeHtml(p.note) : '—'}</td>
        <td class="center mono" style="font-size:12px; color:var(--text-sub);">${createdTimeStr}</td>
        <td class="center mono" style="font-size:12px; color:var(--text-sub);">${printedTimeStr}</td>
        <td class="center">${transshipCell}</td>
        <td class="center">${phongVeCell}</td>
        <td class="center col-action">${actionCell}</td>
      </tr>`;
  };

  // ===== Hành khách trung chuyển — gộp từ MỌI phơi (trang này không chọn phơi cụ thể như tab
  // "Trung chuyển" bên Quản lý vé). Bỏ qua các vé vốn là khách rước liền ĐÃ được chỉ định ở bảng trên
  // để không hiện trùng 2 dòng. Chung tbody, nối tiếp ngay dưới danh sách rước liền. =====
  const pickupAssignedSeatKeys = new Set();
  pickupPassengers.forEach(p => {
    if (!p.assigned) return;
    const seats = p.assigned.seats || (p.assigned.seat ? String(p.assigned.seat).split(',').map(s => s.trim()).filter(Boolean) : []);
    seats.forEach(code => pickupAssignedSeatKeys.add(`${p.assigned.tripId}|${code}`));
  });
  const transshipRows = pkGetTransshipRows(pkSelectedDateStr, pkFilterState, pickupAssignedSeatKeys);

  // Có SĐT tài xế trung chuyển vừa đổi bên shuttle (từ pkApplyShuttleDriverChange) -> đánh dấu cập nhật
  // cho đúng dòng khách trung chuyển tương ứng, để nó cũng được đẩy lên đầu như dòng rước liền.
  if (pkPendingTransshipUpdatePhones && pkPendingTransshipUpdatePhones.size) {
    transshipRows.forEach(r => {
      if (pkPendingTransshipUpdatePhones.has(String(r.main.phone || '').replace(/\s+/g, ''))) {
        pkMarkRowUpdated(pkTransshipRowKey(r));
      }
    });
    pkPendingTransshipUpdatePhones = null;
  }

  // Gộp 2 loại dòng rồi sắp các dòng CÓ mốc cập nhật lên trước (mới nhất trước). Array.sort ổn định nên
  // các dòng chưa từng cập nhật (mốc 0) giữ nguyên thứ tự: rước liền trước, trung chuyển sau.
  const mergedRows = [
    ...filtered.map(p => ({ kind: 'pk', data: p, key: pkPickupRowKey(p) })),
    ...transshipRows.map(r => ({ kind: 'ts', data: r, key: pkTransshipRowKey(r) }))
  ];
  mergedRows.sort((a, b) => (pkRowUpdateStamp.get(b.key) || 0) - (pkRowUpdateStamp.get(a.key) || 0));

  const rowsHtml = mergedRows.map((row, idx) => row.kind === 'pk'
    ? pkRenderPickupRow(row.data, idx, shuttleDriverMap)
    : pkRenderTransshipRow(row.data, idx, shuttleDriverMap)
  ).join('');

  if (!rowsHtml) {
    tbody.innerHTML = '';
    if (gridEmpty) gridEmpty.style.display = 'block';
    return;
  }
  if (gridEmpty) gridEmpty.style.display = 'none';
  tbody.innerHTML = rowsHtml;
}

// Gom hành khách trung chuyển (có địa chỉ trung chuyển đón/trả, hoặc guestType 'Trung chuyển') từ seat
// bank của MỌI phơi — trả về mảng { tripId, trip, main, seatCodes, seatCount }. Lọc theo từ khoá tìm
// kiếm (tên/SĐT/mã ghế), bộ lọc trạm đi/đến, khung giờ (theo giờ phơi) và trạng thái giống bảng rước
// liền. KHÔNG lọc theo ngày: vé trung chuyển trong seat bank không mang ngày riêng cho từng khách nên
// trang này gộp toàn bộ hành khách trung chuyển của mọi phơi. Bỏ các ghế đã nằm trong danh sách khách
// rước liền đã chỉ định (tránh hiện trùng 2 dòng).
function pkGetTransshipRows(selectedDateStr, filterState, skipSeatKeys) {
  const kw = (filterState.search || '').toLowerCase();
  const rows = [];
  const seen = new Set();

  Object.keys(tripSeatBank || {}).forEach(tripId => {
    const bank = tripSeatBank[tripId];
    if (!bank) return;
    const trip = allTripsMeta.find(t => String(t.id) === String(tripId));

    // Khung giờ theo giờ khởi hành của phơi (bỏ qua khi đang gõ tìm kiếm — lúc đó tìm trên toàn bộ).
    if (!kw && filterState.timeSlot !== 'all' && trip && trip.time) {
      const hh = parseInt(String(trip.time).split(':')[0], 10);
      if (filterState.timeSlot === 'morning' && !(hh >= 0 && hh < 12)) return;
      if (filterState.timeSlot === 'afternoon' && !(hh >= 12 && hh < 18)) return;
      if (filterState.timeSlot === 'evening' && !(hh >= 18 && hh <= 24)) return;
    }

    const seats = [...(bank.down || []), ...(bank.up || []), ...(bank.extraSeats || [])]
      .filter(s => s && ['sold', 'hold', 'free', 'cargo'].includes(s.state));

    const byTicket = new Map();
    seats.forEach(s => {
      const key = tripId + '|' + (s.ticketNo || ('T-' + s.code));
      if (!byTicket.has(key)) byTicket.set(key, []);
      byTicket.get(key).push(s);
    });

    byTicket.forEach((members, key) => {
      members.sort((a, b) => String(a.code).localeCompare(String(b.code)));
      const main = members[0];
      const isTransship = main.guestType === 'Trung chuyển'
        || !!main.pickupAddress || !!main.transship || !!main.transshipStation
        || !!main.dropoffAddress || !!main.arrivalTransfer;
      if (!isTransship) return;
      if (skipSeatKeys && members.some(s => skipSeatKeys.has(tripId + '|' + s.code))) return;
      if (seen.has(key)) return;
      seen.add(key);
      rows.push({ tripId, trip, main, seatCodes: members.map(s => s.code), seatCount: members.length });
    });
  });

  return rows.filter(r => {
    const m = r.main;
    // Trạng thái: dòng trung chuyển luôn đã có ghế -> coi như "đã chỉ định".
    if (filterState.status === 'pending') return false;
    if (!kw && filterState.fromStation !== 'all' && m.firstStop !== filterState.fromStation) return false;
    if (!kw && filterState.toStation !== 'all' && m.lastStop !== filterState.toStation) return false;
    if (!kw) return true;
    return (m.customerName && m.customerName.toLowerCase().includes(kw))
      || (m.phone && String(m.phone).toLowerCase().includes(kw))
      || r.seatCodes.some(c => String(c).toLowerCase().includes(kw));
  });
}

// Chỉ số ổn định (không đổi giữa các lần render) suy từ chuỗi khoá — dùng để gán dữ liệu mẫu tài xế/
// giờ in cho khách trung chuyển sao cho mỗi khách luôn nhận cùng 1 giá trị, không nhấp nháy.
function pkStableIndex(str, mod) {
  let h = 0;
  const s = String(str || '');
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return mod ? h % mod : h;
}

// Dữ liệu mẫu tài xế trung chuyển (dùng khi seat bank chưa có tài xế thật gán từ trang shuttle.html) —
// để cột "Trung chuyển" của khách trung chuyển không bị trống trong bản demo.
const PK_TS_SAMPLE_DRIVERS = [
  { name: 'Trần Văn Hùng', phone: '0908 111 222', note: 'Đã liên hệ khách, hẹn đón đúng giờ' },
  { name: 'Nguyễn Văn Nam', phone: '0918 333 444', note: 'Khách chờ ở sảnh, xe 7 chỗ' },
  { name: 'Phạm Quốc Bảo', phone: '0937 555 666', note: 'Đón thêm 1 khách cùng điểm' },
  { name: 'Lê Hoàng Anh', phone: '0946 777 888', note: 'Xe đang trên đường, ETA 10 phút' },
  { name: 'Võ Thành Long', phone: '0977 999 000', note: '' }
];

// Mốc thời gian mẫu — suy ổn định từ giờ khởi hành phơi (trước giờ chạy `minutesBefore` phút), trả về
// chuỗi ISO để formatHistoryDate()/formatActionTime() hiển thị 2 dòng giống cột "Thời gian"/"In lúc"
// bảng khách rước liền.
function pkSampleStamp(trip, minutesBefore, seed) {
  const base = (trip && trip.date) ? trip.date : '2026-07-18';
  const t = (trip && trip.time) ? String(trip.time) : '07:00';
  const parts = t.split(':').map(Number);
  let total = (parts[0] || 0) * 60 + (parts[1] || 0) - minutesBefore - (seed % 15);
  if (total < 0) total += 1440;
  const H = String(Math.floor(total / 60) % 24).padStart(2, '0');
  const M = String(total % 60).padStart(2, '0');
  return `${base}T${H}:${M}:00`;
}

// 1 dòng "hành khách trung chuyển" trong bảng gộp — các cột Thời gian / In lúc / Trung chuyển / Phòng vé
// / Thao tác render Y HỆT dòng khách rước liền (cùng markup, class, định dạng 2 dòng, nút bấm). Phần
// khác duy nhất là nguồn dữ liệu: lấy từ seat bank (khách trung chuyển của mọi phơi) + dữ liệu mẫu ổn
// định khi chưa có giá trị thật. Ghi chú "Phòng vé" bấm được, sửa qua #tsStatusNoteModal theo ticketNo.
function pkRenderTransshipRow(r, idx, shuttleDriverMap) {
  const m = r.main;
  const sampleSeed = pkStableIndex(m.phone || m.ticketNo || r.seatCodes[0] || String(idx), PK_TS_SAMPLE_DRIVERS.length);
  const sampleDriver = PK_TS_SAMPLE_DRIVERS[sampleSeed];
  const routeParts = (r.trip && r.trip.route ? String(r.trip.route).split(' - ') : []);
  const fromMain = escapeHtml(m.firstStop || routeParts[0] || '—');
  const toMain = escapeHtml(m.lastStop || routeParts[routeParts.length - 1] || '—');
  const fromSub = m.pickupAddress || m.transship || m.transshipStation || '';
  const toSub = m.dropoffAddress || m.arrivalTransfer || '';
  const firstStopHtml = fromSub
    ? `${fromMain}<div class="ch-sub-address" style="font-size:12px;color:var(--text-sub);margin-top:2px;">Đón: ${escapeHtml(fromSub)}</div>`
    : fromMain;
  const lastStopHtml = toSub
    ? `${toMain}<div class="ch-sub-address" style="font-size:12px;color:var(--text-sub);margin-top:2px;">Trả: ${escapeHtml(toSub)}</div>`
    : toMain;
  const routeHtml = `
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
    </div>`;

  const driverKey = `${String(m.phone || '').replace(/\s+/g, '')}_don`;
  const assignedDriver = shuttleDriverMap[driverKey];
  // Cột "Trung chuyển": CHỈ tên tài xế + ghi chú của tài xế đó (driverNote), đều từ trang shuttle.html —
  // dùng dữ liệu mẫu ổn định khi seat bank chưa có tài xế thật. KHÔNG hiện ghi chú của cột "Phòng vé".
  const drvName = (assignedDriver && assignedDriver.driverName) || sampleDriver.name;
  const drvNote = (assignedDriver && assignedDriver.driverNote) || sampleDriver.note || '';
  const transshipCell = `<div class="pk-transship-cell">
      <span class="pk-driver-name">${escapeHtml(drvName)}</span>
      ${drvNote ? `<span class="pk-driver-sub">${escapeHtml(drvNote)}</span>` : ''}
    </div>`;

  // Cột "Phòng vé": Y HỆT dòng rước liền — nút .pk-note-cell bấm để ghi/sửa ghi chú trạng thái đón. Ở
  // đây khoá theo ticketNo (mở #tsStatusNoteModal, saveTransshipStatusNote ghi vào seat bank). Có ghi
  // chú thì hiện nội dung, chưa có thì hiện icon bút chì — giống hệt cột "Phòng vé" bảng rước liền.
  const pickupNote = m.transshipPickupNote || '';
  const hasStatusNote = !!pickupNote;
  const phongVeCell = `<button type="button" class="pk-note-cell${hasStatusNote ? ' has-note' : ''}" data-action="openTransshipStatusNoteModal" data-args='${JSON.stringify([m.ticketNo || '', 'pickup'])}' title="Bấm để ghi/sửa ghi chú trạng thái">
      ${hasStatusNote
        ? `<span class="pk-note-text">${escapeHtml(pickupNote)}</span>`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`}
    </button>`;

  // Cột "Thời gian" / "In lúc": 2 dòng ngày + giờ giống dòng rước liền (dùng mốc mẫu ổn định vì vé trong
  // seat bank không mang mốc tạo/in riêng).
  const createdAt = pkSampleStamp(r.trip, 210, sampleSeed);
  const timeStr = `${formatHistoryDate(createdAt)}<br>${formatActionTime(createdAt)}`;
  const printedAt = m.printedAt || pkSampleStamp(r.trip, 90, sampleSeed);
  const printedStr = `${formatHistoryDate(printedAt)}<br>${formatActionTime(printedAt)}`;

  const seatCell = `<button type="button" class="pk-seat-link" data-action="sellTicketForTrip" data-args='${JSON.stringify([r.tripId])}' title="Bấm để mở phơi đã chỉ định">${escapeHtml(r.seatCodes.join(', '))}</button>`;
  // Cột "Thao tác": Y HỆT dòng rước liền đã chỉ định — nút "Đổi chỉ định" (kiểu viền trắng). Khách trung
  // chuyển đã có vé trên phơi nên bấm là mở thẳng phơi đó để sửa (sellTicketForTrip).
  const actionCell = `<button class="assign-action-btn reassign" data-action="sellTicketForTrip" data-args='${JSON.stringify([r.tripId])}'>Đổi chỉ định</button>`;

  return `
    <tr>
      <td class="col-stt">${idx + 1}</td>
      <td><div class="pax-info"><span class="pk-type-chip">Trung chuyển</span><div class="pax-name">KH: ${escapeHtml(m.customerName || 'Khách')}</div><div class="pax-phone">SĐT: ${escapeHtml(m.phone || '')}</div></div></td>
      <td>${routeHtml}</td>
      <td class="center" style="font-weight:700; font-size:13.5px; color:var(--text-main);">${r.seatCount}</td>
      <td class="center">${seatCell}</td>
      <td class="note-cell">${m.note ? escapeHtml(m.note) : '—'}</td>
      <td class="center mono" style="font-size:12px; color:var(--text-sub);">${timeStr}</td>
      <td class="center mono" style="font-size:12px; color:var(--text-sub);">${printedStr}</td>
      <td class="center">${transshipCell}</td>
      <td class="center">${phongVeCell}</td>
      <td class="center col-action">${actionCell}</td>
    </tr>`;
}

// ===== Modal ghi chú trạng thái đón khách rước liền (#pkStatusNoteModal, cột "Phòng vé") =====

let pkStatusNoteActiveId = null;

function pkOpenStatusNoteModal(paxId) {
  pkStatusNoteActiveId = paxId;
  const pax = pickupPassengers.find(p => p.id === paxId);
  const input = document.getElementById('pkStatusNoteInput');
  if (input) input.value = (pax && pax.statusNote) || '';
  const modal = document.getElementById('pkStatusNoteModal');
  if (modal) modal.classList.add('open');
}

function pkSaveStatusNote() {
  if (pkStatusNoteActiveId == null) return;
  const idx = pickupPassengers.findIndex(p => p.id === pkStatusNoteActiveId);
  if (idx === -1) { closeModal('pkStatusNoteModal'); pkStatusNoteActiveId = null; return; }

  const input = document.getElementById('pkStatusNoteInput');
  const value = input ? input.value.trim() : '';
  const pax = pickupPassengers[idx];
  const changed = (pax.statusNote || '') !== value;
  pax.statusNote = value;

  // Chỉ đẩy lên đầu danh sách khi ghi chú VỪA được thêm mới hoặc đổi nội dung — bấm "Lưu" mà không đổi
  // gì thì giữ nguyên vị trí, tránh xáo trộn danh sách không cần thiết. Đánh dấu mốc cập nhật để dòng
  // này nổi lên đầu bảng gộp, đứng trên cả các dòng khách trung chuyển.
  if (changed) {
    pickupPassengers.splice(idx, 1);
    pickupPassengers.unshift(pax);
    pkMarkRowUpdated(pkPickupRowKey(pax));
  }

  savePickupPassengers();
  closeModal('pkStatusNoteModal');
  pkStatusNoteActiveId = null;
  pkRenderPaxTable();
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