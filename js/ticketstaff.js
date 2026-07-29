/* ===================== DỮ LIỆU GHẾ MẪU ===================== */
const staffList = ["tuyetphuong.huenghia","minh.tran","nguyen.long","thi.hoa"];
const stopsFirst = ["Trạm Kinh Dương Vương","Trạm An Sương","Trạm Q.5","Văn phòng trung tâm"];
const stopsLast = ["Trạm Châu Đốc","Trạm Tân Châu","Bến xe Châu Đốc"];
const nameSamples = ["Nguyễn Văn An","Trần Thị Mai","Lê Hoàng Nam","Phạm Thùy Linh","Võ Minh Khoa","Huỳnh Ngọc Ánh","Đặng Quốc Huy","Bùi Thảo Vy"];
const noteSamples = ["","Khách quen, hay đi ghế gần cửa","Yêu cầu ghế tầng dưới","Có trẻ nhỏ đi cùng",""];
const pickupAddress = {
  "Trạm Kinh Dương Vương": "Số 123 Kinh Dương Vương, Q.Bình Tân, TP.HCM",
  "Trạm An Sương": "Ngã tư An Sương, Q.12, TP.HCM",
  "Trạm Q.5": "Số 45 Trần Hưng Đạo, Q.5, TP.HCM",
  "Văn phòng trung tâm": "Số 8 Nguyễn Văn Cừ, Q.1, TP.HCM"
};
const pickupTimes = ["06:15","06:20","06:25","06:30","06:35","06:40","06:45","06:50","06:55","06:20","06:35","06:50"];
const phonePool = ["0909123456","0912345678","0933778899","0987654321","0977112233","0901234567","0966998877","0913579246","0938001122","0989112233","0908771122","0967345678"];
let pickupTimeIdx = 0, phoneIdx = 0, ticketSeq = 1, nameIdx = 0;

function makeSeat(code, state, opts = {}){
  const isBooked = ['sold','hold','free','cargo'].includes(state);
  const base = {
    code, state, // empty | hold | sold | free | cargo
    locked: false,
    price: state === 'free' ? 0 : 280000,
    callState: isBooked ? "Chưa gọi" : null,
    firstStop: isBooked ? stopsFirst[Math.floor(Math.random()*stopsFirst.length)] : null,
    lastStop: isBooked ? stopsLast[Math.floor(Math.random()*stopsLast.length)] : null,
    staff: isBooked ? staffList[Math.floor(Math.random()*staffList.length)] : null,
    customerName: isBooked ? nameSamples[(nameIdx++) % nameSamples.length] : null,
    note: isBooked ? noteSamples[Math.floor(Math.random()*noteSamples.length)] : null,
    count: 1,
    pickupTime: isBooked ? pickupTimes[(pickupTimeIdx++) % pickupTimes.length] : null,
    phone: isBooked ? phonePool[(phoneIdx++) % phonePool.length] : null,
    ticketNo: isBooked ? ("SGCD-" + String(ticketSeq++).padStart(4,'0')) : null,
    paid: isBooked ? (state==='free' ? true : (state==='sold' ? Math.random()>0.25 : Math.random()>0.6)) : false,
    hasLuggage: isBooked ? Math.random()>0.55 : false
  };
  return Object.assign(base, opts);
}

// Ghép ghế liền kề vào chung 1 vé (cùng khách, cùng SĐT, cùng mã vé, cùng điểm đi/đến...)
// để dữ liệu ghế trên sơ đồ và dữ liệu ở danh sách hành khách luôn khớp nhau tuyệt đối.
function groupSeat(mainSeat, code, state){
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

const VEHICLE_TYPE_SEATS = {
  "Limousine 34 giường": 34,
  "Xe thường 36 giường": 36,
  "Xe thường 40 giường": 40,
  "Xe thường 41 giường": 41,
  "Xe VIP 24 phòng": 24,
  "Xe 44 giường": 44,
  "Xe Limousine 9 chỗ": 9,
  "Xe Limousine 11 chỗ": 11,
  "Xe Limousine 19 chỗ": 19,
  "Xe Limousine 28 chỗ": 28,
  "Xe thường 16 chỗ": 16,
  "Xe thường 26 chỗ": 26,
  "Xe thường 28 chỗ": 28,
  "Xe thường 47 chỗ": 47,
  "Xe Limousine 18 chỗ": 18,
  "Limousine 24 Phòng": 24,
  "Giường nằm 34 chỗ": 34,
  "Ghế ngồi 45 chỗ": 45
};

function buildSequentialSeatCodes(total){
  const downCount = Math.ceil(total / 2);
  const upCount = total - downCount;
  const down = Array.from({length: downCount}, (_, i) => "A" + (i + 1));
  const up = Array.from({length: upCount}, (_, i) => "B" + (i + 1));
  return { down, up };
}

function getSeatCodesForVehicleType(typeLabel){
  const total = VEHICLE_TYPE_SEATS[typeLabel];
  if(typeLabel === "Limousine 34 giường" || typeLabel === "Giường nằm 34 chỗ"){
    const base = buildSequentialSeatCodes(VEHICLE_TYPE_SEATS["Xe thường 36 giường"]);
    return {
      down: base.down.map(c => c === "A3" ? "A3_hidden" : c),
      up: base.up.map(c => c === "B3" ? "B3_hidden" : c),
    };
  }
  return buildSequentialSeatCodes(total);
}

const a1 = makeSeat("A1","sold");
const a2 = groupSeat(a1, "A2", "sold");
const a10 = makeSeat("A10","hold");
const a11 = groupSeat(a10, "A11", "hold");
const a12 = makeSeat("A12", "sold", {
  customerName: "Trần Văn Bình",
  phone: "0918234567",
  firstStop: "Trạm An Sương",
  lastStop: "Trạm Long Xuyên",
  transshipStation: "45 Trường Chinh, Q.12"
});

let seatPlanDown = [
  a1, a2, makeSeat("A3","empty"), makeSeat("A4","cargo"),
  makeSeat("A5","sold"), makeSeat("A6","empty"), makeSeat("A7","sold"), makeSeat("A8","free"),
  makeSeat("A9","empty"), a10, a11, a12,
];
seatPlanDown[2].locked = true; // ví dụ trạng thái khoá tạm thời (BR-05)
seatPlanDown[2].lockedBy = "NV. Hồng";

const b2 = makeSeat("B2","sold");
const b3 = groupSeat(b2, "B3", "sold");

let seatPlanUp = [
  makeSeat("B1","empty"), b2, b3, makeSeat("B4","empty"),
  makeSeat("B5","sold"), makeSeat("B6","empty"), makeSeat("B7","cargo"), makeSeat("B8","hold"),
  makeSeat("B9","empty"), makeSeat("B10","sold"), makeSeat("B11","free"), makeSeat("B12","empty"),
];

// Danh sách các chuyến (khớp với data-trip trên trip-card ở Zone 1) để có thể
// chuyển ghế của khách sang một chuyến xe khác, không chỉ trong cùng 1 chuyến.
const sgcdTripsMeta = [
  { id:'1', time:'07:00', route:'Sài Gòn - Châu Đốc', plate: '51F-123.45', vehicleType: 'Limousine 24 Phòng' },
  { id:'2', time:'08:30', route:'Sài Gòn - Châu Đốc', plate: '50H-678.90', vehicleType: 'Giường nằm 34 chỗ' },
  { id:'3', time:'10:00', route:'Sài Gòn - Châu Đốc', plate: '51F-234.56', vehicleType: 'Limousine 24 Phòng' },
  { id:'4', time:'13:15', route:'Sài Gòn - Châu Đốc', plate: '50H-345.67', vehicleType: 'Ghế ngồi 45 chỗ' },
  { id:'5', time:'15:30', route:'Sài Gòn - Châu Đốc', plate: '51F-456.78', vehicleType: 'Limousine 24 Phòng' },
  { id:'6', time:'17:00', route:'Sài Gòn - Châu Đốc', plate: '50H-567.89', vehicleType: 'Giường nằm 34 chỗ' },
];
const cdsgTripsMeta = [
  { id:'7', time:'06:00', route:'Châu Đốc - Sài Gòn', plate: '51F-123.45', vehicleType: 'Limousine 24 Phòng' },
  { id:'8', time:'09:15', route:'Châu Đốc - Sài Gòn', plate: '50H-678.90', vehicleType: 'Giường nằm 34 chỗ' },
  { id:'9', time:'14:00', route:'Châu Đốc - Sài Gòn', plate: '51F-234.56', vehicleType: 'Limousine 24 Phòng' },
  { id:'10', time:'21:00', route:'Châu Đốc - Sài Gòn', plate: '50H-567.89', vehicleType: 'Giường nằm 34 chỗ' },
];
const allTripsMeta = [...sgcdTripsMeta, ...cdsgTripsMeta];

// Sinh dữ liệu ghế mẫu cho các chuyến còn lại, luôn chừa vài ghế trống để demo chuyển ghế.
function generateTripSeatPlanForVehicleType(vehicleType){
  const codes = getSeatCodesForVehicleType(vehicleType);
  const pattern = ['sold','hold','empty','empty','sold','empty','hold','free','empty','sold','cargo','empty'];
  const buildFloor = floorCodes => floorCodes.map((code, i) => {
    if (code.endsWith('_hidden')) return { code, state: 'hidden' };
    return makeSeat(code, pattern[i % pattern.length]);
  });
  return {
    down: buildFloor(codes.down),
    up: buildFloor(codes.up),
  };
}

const HN_STORAGE_KEY = 'hn_trip_seat_bank_v7';
let isSyncingFromStorage = false;

function saveSeatBank() {
  localStorage.setItem(HN_STORAGE_KEY, JSON.stringify(tripSeatBank));
}

function loadSeatBank() {
  const saved = localStorage.getItem(HN_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse seat bank", e);
    }
  }
  return null;
}

let extraLeftoverSeats = []; // danh sách "ghế dư" khi đổi loại xe làm mất mã ghế đang có khách
let subSeats = []; // danh sách "ghế phụ" tự thêm (chỉ có ghi chú + giá tiền), ô "+" luôn ở cuối danh sách này

const savedBank = loadSeatBank();
const tripSeatBank = savedBank || {};
if (!savedBank) {
  tripSeatBank['1'] = {
    down: seatPlanDown,
    up: seatPlanUp,
    plate: '51F-123.45',
    vehicleType: 'Limousine 24 Phòng',
    driver: 'Trần Văn Hùng',
    helper: 'Nguyễn Thị Hương'
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
        helper: 'Đỗ Văn Sơn'
      };
    }
  });
  saveSeatBank();
} else {
  seatPlanDown = tripSeatBank['1'].down;
  seatPlanUp = tripSeatBank['1'].up;
  extraLeftoverSeats = tripSeatBank['1'].extraSeats || [];
  subSeats = tripSeatBank['1'].subSeats || [];
}

let currentTripId = '1';

window.addEventListener('storage', (e) => {
  if (e.key === HN_STORAGE_KEY) {
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
      renderExtraSeats();
      renderSubSeats();
      renderZone1TripList();
      if (document.getElementById('zone3Passengers') && document.getElementById('zone3Passengers').style.display !== 'none') {
        renderPassengerList();
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
let currentPanelSeat = null;
let currentPanelSeats = [];
let currentCancelSeat = null;
let currentEditSeatCode = null;
let currentPanelMode = 'booking';
const DEFAULT_STAFF_STATION = 'Trạm Kinh Dương Vương'; // Trạm đi mặc định theo nhân viên trạm đang đăng nhập
const ZONE1_COLLAPSED_KEY = 'callcenter.zone1Collapsed';

/* ===================== TABS: SƠ ĐỒ GHẾ / HÀNH KHÁCH ===================== */
function switchTab(tab, el){
  document.querySelectorAll('.tabs .tab-item').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  const seatSection = document.querySelector('.zone3:not(.passenger-view)');
  const paxSection = document.getElementById('zone3Passengers');
  const sticky = document.querySelector('.sticky-actions');
  if(tab==='seatmap'){
    seatSection.style.display = '';
    paxSection.style.display = 'none';
    updateTransferBarVisibility();
  } else if(tab==='passengers'){
    seatSection.style.display = 'none';
    paxSection.style.display = 'flex';
    sticky.style.display = 'none';
    renderPassengerList();
  }
}

function togglePaxFilter(){
  document.getElementById('paxFilterDropdown').classList.toggle('open');
}
document.addEventListener('click', function(e){
  const wrap = document.querySelector('.pax-filter-wrap');
  if(wrap && !wrap.contains(e.target)) document.getElementById('paxFilterDropdown').classList.remove('open');
});
function clearPaxFilter(){
  document.querySelectorAll('.pax-filter-opt input').forEach(cb=>cb.checked=false);
  renderPassengerList();
}

function getAllBookedSeats(){
  return [...seatPlanDown.map(s=>({...s, floor:'down'})), ...seatPlanUp.map(s=>({...s, floor:'up'})), ...extraLeftoverSeats.map(s=>({...s, floor:'extra'}))]
    .filter(s=>['sold','hold','free','cargo'].includes(s.state));
}

// Gom các ghế cùng chung 1 mã vé (ticketNo) thành 1 dòng hành khách duy nhất,
// dùng đúng mã ghế thật trên sơ đồ thay vì suy đoán ghế kế tiếp — đảm bảo
// danh sách ghế và danh sách hành khách luôn thống nhất với nhau.
function groupSeatsByTicket(seats){
  const seen = new Set();
  const groups = [];
  seats.forEach(s => {
    if(seen.has(s.ticketNo)) return;
    seen.add(s.ticketNo);
    const members = seats.filter(x => x.ticketNo === s.ticketNo).sort((a,b)=>a.code.localeCompare(b.code));
    groups.push({ main: s, members });
  });
  return groups;
}

function renderPassengerList(){
  const checked = v => document.querySelector('.pax-filter-opt input[value="'+v+'"]').checked;
  const payFilters = ['paid','debt'].filter(checked);
  const posFilters = ['down','up'].filter(checked);
  const activeCount = payFilters.length + posFilters.length;

  const btnCount = document.getElementById('paxFilterCount');
  if(activeCount>0){ btnCount.style.display='inline-block'; btnCount.textContent = activeCount; }
  else { btnCount.style.display='none'; }

  let seats = getAllBookedSeats();
  if(payFilters.length) seats = seats.filter(s => payFilters.includes(s.paid?'paid':'debt'));
  if(posFilters.length) seats = seats.filter(s => posFilters.includes(s.floor));

  const groups = groupSeatsByTicket(seats);

  const tbody = document.getElementById('paxTableBody');
  if(groups.length===0){
    tbody.innerHTML = '<tr class="pax-empty-row"><td colspan="10">Không có hành khách phù hợp bộ lọc</td></tr>';
  } else {
    const rows = [];
    groups.forEach((g,index) => {
      const s = g.main;
      const count = g.members.length;
      const codesStr = g.members.map(m=>m.code).join(', ');
      const isFree = s.state === 'free';
      const payCellClass = isFree ? 'free' : (s.paid ? 'paid' : 'debt');
      const payCellText = isFree ? 'Miễn phí' : (s.price*count).toLocaleString('vi-VN')+'đ';

      const row = `
      <tr>
        <td class="mono">${index + 1}</td>
        <td>${s.customerName || '—'}</td>
        <td class="mono">${s.phone}</td>
        <td>${s.firstStop || '—'}</td>
        <td>${s.lastStop}</td>
        <td class="mono">${count}</td>
        <td class="mono">${codesStr}</td>
        <td class="pax-pay-cell ${payCellClass}"><div class="pax-pay-amount">${payCellText}</div></td>
        <td class="pax-luggage-cell"><span class="pax-luggage-mark ${s.hasLuggage?'yes':'no'}">${s.hasLuggage?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>':''}</span></td>
        <td class="pax-note-cell">${s.note || '—'}</td>
      </tr>
      `;
      rows.push(row);
    });
    tbody.innerHTML = rows.join('');
  }

  document.getElementById('paxResultHint').textContent = groups.length + ' vé / ' + groupSeatsByTicket(getAllBookedSeats()).length + ' vé';
}

function shortenStopName(name) {
  if (!name || name === '—') return '—';
  return name
    .replace('Trạm ', '')
    .replace('Bến xe ', 'BX ')
    .replace('Văn phòng ', 'VP ');
}

function seatCard(seat){
  if (seat.state === 'hidden') {
    return `<div class="seat-card hidden-placeholder"></div>`;
  }
  const stateClass = seat.locked ? "locked" : seat.state;
  const lockHtml = seat.locked ? `<div class="lock-tag"><svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>${seat.lockedBy||'Đang giữ'}</div>` : "";
  const isEmpty = seat.state === "empty";
  const isCancelable = ["sold","hold","free","cargo"].includes(seat.state);
  const footLabel = isEmpty ? "ĐẶT VÉ" : "KDV - CHÂU ĐỐC";
  const cancelTag = isCancelable
    ? `<button type="button" class="seat-cancel-tag" onclick="event.stopPropagation(); openCancelModal('${seat.code}')">Hủy</button>`
    : "";
  const priceHtml = isEmpty ? `<div class="seat-price-tag"></div>` : (seat.state==='free' ? `<div class="seat-price-tag">Miễn phí</div>` : `<div class="seat-price-tag">${seat.price.toLocaleString('vi-VN')}đ</div>`);
  const footBtnClick = isEmpty 
    ? `event.stopPropagation(); openBookingPanel([findSeat('${seat.code}')])`
    : `event.stopPropagation();`;
  return `
  <div class="seat-card ${stateClass}" data-code="${seat.code}" onclick="onSeatClick(event,'${seat.code}')" ondblclick="onSeatDoubleClick(event,'${seat.code}')">
    ${lockHtml}
    <div class="seat-top">
      <div><div class="seat-code">${seat.code}</div></div>
      <div class="seat-top-right">${priceHtml}${cancelTag}</div>
    </div>
    <div class="seat-line"><span class="seat-label-full">Chặng đầu: </span><span class="seat-label-short">Đi: </span><span class="seat-stop" title="${seat.firstStop || ''}">${shortenStopName(seat.firstStop)}</span></div>
    <div class="seat-line"><span class="seat-label-full">Chặng cuối: </span><span class="seat-label-short">Đến: </span><span class="seat-stop" title="${seat.lastStop || ''}">${shortenStopName(seat.lastStop)}</span></div>
    <div class="seat-note" title="${seat.note || ''}"><span class="seat-label-full">Ghi chú: </span><span class="seat-label-short">GC: </span>${seat.note || '—'}</div>
    <button class="seat-footbtn" type="button" onclick="${footBtnClick}">${footLabel}</button>
  </div>`;
}

function renderSeats(){
  const totalSeats = [...seatPlanDown, ...seatPlanUp].filter(s => s.state !== 'hidden').length;
  const useThreeCols = totalSeats >= 34;

  const floorDownEl = document.getElementById('floorDown');
  const floorUpEl = document.getElementById('floorUp');

  if(floorDownEl) {
    floorDownEl.classList.toggle('cols-3', useThreeCols);
    floorDownEl.innerHTML = seatPlanDown.map(seatCard).join('');
  }
  if(floorUpEl) {
    floorUpEl.classList.toggle('cols-3', useThreeCols);
    floorUpEl.innerHTML = seatPlanUp.map(seatCard).join('');
  }

  updatePassengerTabCount();
  updateTripStats();

  if (typeof isSyncingFromStorage !== 'undefined' && !isSyncingFromStorage) {
    saveSeatBank();
  }
}
function updatePassengerTabCount(){
  const cntEl = document.getElementById('passengerTabCnt');
  if(cntEl) cntEl.textContent = '(' + getAllBookedSeats().length + ')';
}
function updateTripStats() {
  const totalSeats = [...seatPlanDown, ...seatPlanUp].filter(s => s.state !== 'hidden').length + subSeats.length;
  
  // Calculate booked seats (ghế phụ tính như ghế bình thường)
  const bookedSeats = [...seatPlanDown, ...seatPlanUp].filter(s => ['sold','hold','free','cargo'].includes(s.state)).concat(subSeats);
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
      unpaidRevenue += price;
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
renderSeats();
renderExtraSeats();
renderSubSeats();
renderZone1TripList();

function setZone1Collapsed(collapsed){
  document.body.classList.toggle('zone1-collapsed', collapsed);
  const btn = document.getElementById('zone1ToggleBtn');
  if(btn){
    const label = collapsed ? 'Hiện zone 1' : 'Ẩn zone 1';
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
  }
  try{ localStorage.setItem(ZONE1_COLLAPSED_KEY, collapsed ? '1' : '0'); }catch(e){}
}

function toggleZone1(){
  setZone1Collapsed(!document.body.classList.contains('zone1-collapsed'));
}

try{
  setZone1Collapsed(localStorage.getItem(ZONE1_COLLAPSED_KEY) === '1');
}catch(e){}

function findSeat(code){
  return seatPlanDown.find(s=>s.code===code) || seatPlanUp.find(s=>s.code===code) || extraLeftoverSeats.find(s=>s.code===code);
}

function updateTransferBarVisibility(){
  const sticky = document.querySelector('.sticky-actions');
  if(!sticky) return;
  const paxSection = document.getElementById('zone3Passengers');
  const isSeatMapVisible = !paxSection || paxSection.style.display === 'none';
  const shouldShow = multiSelectMode && isSeatMapVisible;
  sticky.style.display = shouldShow ? 'flex' : 'none';
  const seatSection = document.querySelector('.zone3:not(.passenger-view)');
  if(seatSection) seatSection.classList.toggle('has-sticky-actions', shouldShow);
}

function updateTransferHint(){
  const bookedText = selectedSourceSeats.length ? `Đã chọn ghế đã đặt: ${selectedSourceSeats.join(', ')}` : '';
  const emptyText = selectedTargetSeats.length ? ` | Ghế trống: ${selectedTargetSeats.join(', ')}` : '';
  document.getElementById('stickyHint').textContent = bookedText + emptyText;
  const actionBtn = document.getElementById('stickyActionBtn');
  if(actionBtn){
    if(selectionMode === 'transfer'){
      actionBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3v18"/><path d="m21 7-4-4-4 4"/><path d="M7 21V3"/><path d="m3 17 4 4 4-4"/></svg>Chuyển ghế';
    } else {
      actionBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"/><path d="M5 12h14"/></svg>Đặt vé nhóm';
    }
  }
  updateTransferBarVisibility();
}

function findSeatInTrip(tripId, code){
  const bank = tripSeatBank[tripId];
  if(!bank) return null;
  return bank.down.find(s=>s.code===code) || bank.up.find(s=>s.code===code);
}

function exitMultiSelectMode(){
  multiSelectMode = false;
  selectionMode = null;
  selectedSourceSeats = [];
  selectedTargetSeats = [];
  transferSourceTripId = null;
  transferTargetTripId = null;
  document.querySelectorAll('.seat-card').forEach(c=>{
    c.style.outline='none';
    c.style.boxShadow='none';
  });
  document.getElementById('stickyHint').textContent = '';
  updateTransferBarVisibility();
}

function cancelTransferSelection(){
  exitMultiSelectMode();
  showToast('Đã hủy thao tác chuyển ghế');
}

const OCCUPIED_STATES = ['sold','hold','cargo','free'];

function onSeatClick(ev, code){
  if(ev.detail > 1){ return; }
  const seat = findSeat(code);
  if(seat.locked){ showToast(`Ghế ${code} đang được ${seat.lockedBy} thao tác`); return; }

  // Check if this is an extra leftover seat
  const isExtraSeat = extraLeftoverSeats.some(s => s.code === code);
  if(isExtraSeat) {
    openAssignSeatModal(code);
    ev.stopPropagation();
    return;
  }

  if(!multiSelectMode && OCCUPIED_STATES.includes(seat.state)){
    multiSelectMode = true;
    selectionMode = 'transfer';
    selectedSourceSeats = [seat.code];
    selectedTargetSeats = [];
    transferSourceTripId = currentTripId;
    transferTargetTripId = currentTripId;
    document.querySelectorAll('.seat-card').forEach(c=>{c.style.outline='none';});
    const card = ev.currentTarget;
    card.style.outline = '2px solid var(--red)';
    card.style.outlineOffset = '1px';
    card.style.boxShadow = 'none';
    updateTransferHint();
    showToast(`Đã kích hoạt chọn ghế từ ${seat.code}. Có thể chọn chuyến khác ở Zone 1 để chuyển sang.`);
    ev.stopPropagation();
    return;
  }

  if(!multiSelectMode && seat.state === 'empty'){
    multiSelectMode = true;
    selectionMode = 'group';
    selectedSourceSeats = [];
    selectedTargetSeats = [seat.code];
    document.querySelectorAll('.seat-card').forEach(c=>{c.style.outline='none'; c.style.boxShadow='none';});
    const card = ev.currentTarget;
    card.style.outline = '2px solid var(--red)';
    card.style.outlineOffset = '1px';
    card.style.boxShadow = 'none';
    updateTransferHint();
    showToast(`Đã kích hoạt đặt vé nhóm từ ghế ${seat.code}`);
    ev.stopPropagation();
    return;
  }

  if(multiSelectMode){
    const card = ev.currentTarget;
    if(selectionMode === 'transfer' && OCCUPIED_STATES.includes(seat.state)){
      if(currentTripId !== transferSourceTripId){
        showToast('Vui lòng quay lại chuyến ban đầu để chọn thêm ghế nguồn');
        return;
      }
      const idx = selectedSourceSeats.indexOf(code);
      if(idx>-1){ selectedSourceSeats.splice(idx,1); card.style.outline='none'; card.style.boxShadow='none'; }
      else{ selectedSourceSeats.push(code); card.style.outline='2px solid var(--red)'; card.style.outlineOffset='1px'; card.style.boxShadow='none'; }
      if(selectedSourceSeats.length===0 && selectedTargetSeats.length===0){ exitMultiSelectMode(); return; }
      updateTransferHint();
      return;
    }

    if(seat.state === 'empty'){
      const idx = selectedTargetSeats.indexOf(code);
      if(idx>-1){ selectedTargetSeats.splice(idx,1); card.style.outline='none'; card.style.boxShadow='none'; }
      else{ selectedTargetSeats.push(code); card.style.outline='2px solid var(--red)'; card.style.outlineOffset='1px'; card.style.boxShadow='none'; }
      if(selectedSourceSeats.length===0 && selectedTargetSeats.length===0){ exitMultiSelectMode(); return; }
      updateTransferHint();
      return;
    }

    showToast('Chỉ có thể chọn ghế đã đặt làm nguồn và ghế trống làm đích');
    return;
  }

  if(seat.state === 'empty'){
    openBookingPanel([seat]);
  } else {
    openSeatMenu(ev, seat);
  }
}

function onSeatDoubleClick(ev, code){
  const seat = findSeat(code);
  if(!seat || seat.locked){ return; }
  if(!OCCUPIED_STATES.includes(seat.state)) return;
  openBookingPanel([seat], { mode: 'edit' });
  ev.stopPropagation();
}

/* ---- Seat context menu (Hủy vé / Chuyển vé) ---- */
function openSeatMenu(ev, seat){
  const menu = document.getElementById('seatMenu');
  menu.innerHTML = `
    <button onclick="closeSeatMenu(); startTransferMode('${seat.code}')">Chuyển vé</button>
  `;
  const rect = ev.currentTarget.getBoundingClientRect();
  menu.style.top = (window.scrollY + rect.bottom + 4) + 'px';
  menu.style.left = (window.scrollX + rect.left) + 'px';
  menu.classList.add('open');
  ev.stopPropagation();
}
document.addEventListener('click', (e)=>{
  if(!e.target.closest('#seatMenu') && !e.target.closest('.seat-card')) closeSeatMenu();
});
function closeSeatMenu(){ document.getElementById('seatMenu').classList.remove('open'); }

function startTransferMode(sourceCode){
  const seat = findSeat(sourceCode);
  if(!seat) return;
  multiSelectMode = true;
  selectionMode = 'transfer';
  selectedSourceSeats = [sourceCode];
  selectedTargetSeats = [];
  transferSourceTripId = currentTripId;
  transferTargetTripId = currentTripId;
  document.querySelectorAll('.seat-card').forEach(c=>{c.style.outline='none';});
  const sourceCard = document.querySelector(`.seat-card[data-code="${sourceCode}"]`);
  if(sourceCard){ sourceCard.style.outline='2.5px solid var(--red)'; sourceCard.style.outlineOffset='1px'; }
  updateTransferHint();
  showToast(`Đã chọn ghế ${sourceCode}. Bấm ghế trống để chuyển sang (có thể chọn chuyến khác ở Zone 1).`);
}

function openGroupBookingFromSelection(){
  if(!multiSelectMode || selectedTargetSeats.length === 0){
    showToast('Vui lòng chọn ít nhất 1 ghế trống để đặt vé nhóm');
    return;
  }
  const seats = selectedTargetSeats.map(code => findSeat(code)).filter(Boolean);
  if(seats.length === 0){
    showToast('Không tìm thấy ghế đã chọn');
    return;
  }
  openBookingPanel(seats);
}

function confirmSelectionAction(){
  if(selectedSourceSeats.length > 0){
    confirmTransfer();
    return;
  }
  openGroupBookingFromSelection();
}

function confirmTransfer(){
  if(!multiSelectMode || selectedSourceSeats.length===0 || selectedTargetSeats.length===0){
    showToast('Vui lòng chọn ít nhất 1 ghế đã đặt và 1 ghế trống');
    return;
  }

  const pairCount = Math.min(selectedSourceSeats.length, selectedTargetSeats.length);
  if(pairCount === 0){ showToast('Vui lòng chọn ít nhất 1 ghế trống để chuyển'); return; }
  const sourceTripId = transferSourceTripId || currentTripId;
  const targetTripId = transferTargetTripId || currentTripId;

  for(let i = 0; i < pairCount; i++){
    const sourceCode = selectedSourceSeats[i];
    const targetCode = selectedTargetSeats[i];
    const sourceSeat = findSeatInTrip(sourceTripId, sourceCode);
    const targetSeat = findSeatInTrip(targetTripId, targetCode);
    if(!sourceSeat || !OCCUPIED_STATES.includes(sourceSeat.state) || !targetSeat || targetSeat.state !== 'empty') continue;

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
    targetSeat.guestType = sourceSeat.guestType;
    targetSeat.transshipStation = sourceSeat.transshipStation;
    targetSeat.arrivalTransfer = sourceSeat.arrivalTransfer;
    clearSeatToEmpty(sourceSeat);
  }

  renderSeats();
  if(document.getElementById('zone3Passengers').style.display !== 'none') renderPassengerList();
  exitMultiSelectMode();
  showToast(`Đã chuyển ${pairCount} ghế thành công`);
}

/* ---- Modal hủy vé (BR-01) ---- */
function openCancelModal(code){
  currentCancelSeat = code;
  document.getElementById('cancelSeatCode').textContent = code;
  document.getElementById('cancelReason').value = '';
  document.getElementById('confirmCancelBtn').disabled = true;
  document.getElementById('cancelModal').classList.add('open');
}
function checkCancelReason(){
  const val = document.getElementById('cancelReason').value.trim();
  document.getElementById('confirmCancelBtn').disabled = val.length === 0;
}
/* Đưa ghế về trạng thái trống hoàn toàn — không giữ lại bất kỳ thông tin khách nào */
function clearSeatToEmpty(seat){
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
}

function confirmCancel(){
  const seat = findSeat(currentCancelSeat);
  clearSeatToEmpty(seat);
  renderSeats();
  closeModal('cancelModal');
  showToast(`Đã hủy vé ghế ${currentCancelSeat}`);
}
function closeModal(id){ document.getElementById(id).classList.remove('open'); }

/* ---- Zone 4: Panel đặt vé ---- */
function openBookingPanel(seats, options = {}){
  const mode = options.mode || 'booking';
  currentPanelMode = mode;
  currentPanelSeats = seats.slice();
  currentPanelSeat = seats[0];
  currentEditSeatCode = mode === 'edit' ? seats[0].code : null;
  const seat = seats[0];
  document.getElementById('panelSeatCode').textContent = seats.map(s=>s.code).join(', ');
  document.getElementById('panelTitleMode').textContent = mode === 'edit' ? 'Sửa thông tin ghế' : 'Đặt vé';
  document.getElementById('t_seat').textContent = seat.code;
  document.getElementById('t_price').textContent = seat.price.toLocaleString('vi-VN')+'đ';
  const batchWrap = document.getElementById('batchChipRow');
  if(seats.length>1){
    batchWrap.style.display='flex';
    batchWrap.innerHTML = seats.map(s=>`<span class="seat-chip">${s.code}</span>`).join('');
  } else {
    batchWrap.style.display='none';
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
  if(mode === 'edit' && seat){
    phoneEl.value = seat.phone || '';
    nameEl.value = seat.customerName || '';
    noteEl.value = seat.note || '';
    typeEl.value = seat.guestType || 'Khách trạm';
    destinationEl.value = seat.lastStop || '';
    if(transshipEl) transshipEl.value = seat.guestType === 'Trung chuyển' ? seat.transshipStation || '' : '';
    if(transshipSelectEl) transshipSelectEl.value = seat.guestType === 'Rước đường' ? seat.transshipStation || '' : '';
    if(arrivalTransferEl) arrivalTransferEl.value = seat.arrivalTransfer || '';
    if(luggageEl) luggageEl.checked = !!seat.hasLuggage;
    onGuestTypeChange();
    setStationValue(seat.firstStop || DEFAULT_STAFF_STATION);
  } else {
    phoneEl.value='';
    nameEl.value='';
    noteEl.value='';
    typeEl.value='Khách trạm';
    destinationEl.value='';
    if(transshipEl) transshipEl.value='';
    if(transshipSelectEl) transshipSelectEl.value='';
    if(arrivalTransferEl) arrivalTransferEl.value='';
    if(luggageEl) luggageEl.checked=false;
    onGuestTypeChange();
  }
  refreshTicket();
  document.getElementById('bookingOverlay').classList.add('open');
  document.getElementById('savePanelBtnText').textContent = mode === 'edit' ? 'Lưu thay đổi' : 'Đặt vé';
}
function closePanel(){
  currentPanelMode = 'booking';
  currentEditSeatCode = null;
  document.getElementById('bookingOverlay').classList.remove('open');
}

/* Trạm đi và địa điểm rước thay đổi theo loại khách:
   - Khách trạm: dropdown chọn trạm đi, mặc định là trạm của nhân viên đang thao tác
     nhưng vẫn có thể chọn trạm đi khác trong danh sách.
   - Trung chuyển: có thêm ô nhập nơi trung chuyển (bắt buộc).
   - Rước đường: trạm đi vẫn là dropdown, còn địa điểm rước là dropdown danh sách điểm rước. */
function getStationValue(){
  return document.getElementById('f_station_select').value;
}
function setStationValue(val){
  const selectEl = document.getElementById('f_station_select');
  const hasOption = Array.from(selectEl.options).some(o => o.value === val);
  if(hasOption) selectEl.value = val;
}
function onGuestTypeChange(){
  const type = document.getElementById('f_type').value;
  const stationLabel = document.getElementById('f_station_label');
  const selectEl = document.getElementById('f_station_select');
  const inputEl = document.getElementById('f_station_input');
  const transshipWrap = document.getElementById('f_transship_wrap');
  const transshipLabel = document.getElementById('f_transship_label');
  const transshipSelect = document.getElementById('f_transship_select');
  const transshipInput = document.getElementById('f_transship');
  const stationRow = document.getElementById('f_station_row');

  if(type === 'Rước đường'){
    stationLabel.textContent = 'Trạm đi';
    selectEl.style.display = 'block';
    inputEl.style.display = 'none';
    transshipLabel.textContent = 'Địa điểm rước';
    transshipSelect.style.display = 'block';
    transshipInput.style.display = 'none';
    transshipWrap.style.display = 'flex';
  } else {
    stationLabel.textContent = 'Trạm đi';
    selectEl.style.display = 'block';
    inputEl.style.display = 'none';
    transshipSelect.style.display = 'none';
    transshipInput.style.display = type === 'Trung chuyển' ? 'block' : 'none';
    transshipLabel.textContent = type === 'Trung chuyển' ? 'Trung chuyển đi' : 'Địa điểm rước';
    transshipInput.placeholder = type === 'Trung chuyển' ? 'Nơi trung chuyển...' : 'Nhập địa điểm rước...';
    transshipWrap.style.display = (type === 'Trung chuyển') ? 'flex' : 'none';
  }
  stationRow.style.setProperty('--cols', transshipWrap.style.display === 'none' ? 1 : 2);
  refreshTicket();
}

function refreshTicket(){
  const type = document.getElementById('f_type').value;
  document.getElementById('t_name').textContent = document.getElementById('f_name').value || '—';
  document.getElementById('t_phone').textContent = document.getElementById('f_phone').value || '—';
  document.getElementById('t_station').textContent = getStationValue() || '—';
  document.getElementById('t_destination').textContent = document.getElementById('f_destination').value || '—';
  document.getElementById('t_note').textContent = document.getElementById('f_note').value || '—';

  const transshipLabel = document.getElementById('t_transship_label');
  const transshipRow = document.getElementById('t_transship_row');
  const transshipVal = type === 'Rước đường'
    ? document.getElementById('f_transship_select').value.trim()
    : document.getElementById('f_transship').value.trim();

  if(type === 'Trung chuyển' && transshipVal){
    transshipLabel.textContent = 'Trạm trung chuyển';
    transshipRow.style.display = 'flex';
    document.getElementById('t_transship').textContent = transshipVal;
  } else if(type === 'Rước đường' && transshipVal){
    transshipLabel.textContent = 'Địa điểm rước';
    transshipRow.style.display = 'flex';
    document.getElementById('t_transship').textContent = transshipVal;
  } else {
    transshipRow.style.display = 'none';
  }

  const arrivalVal = document.getElementById('f_arrival_transfer').value.trim();
  const arrivalRow = document.getElementById('t_arrival_transfer_row');
  if(arrivalVal){
    arrivalRow.style.display = 'flex';
    document.getElementById('t_arrival_transfer').textContent = arrivalVal;
  } else {
    arrivalRow.style.display = 'none';
  }

  document.getElementById('t_luggage_row').style.display = document.getElementById('f_luggage').checked ? 'flex' : 'none';
}
function onPriceEdit(){
  const el = document.getElementById('t_price');
  const num = parseInt(el.textContent.replace(/[^0-9]/g,'')) || 0;
  el.textContent = num.toLocaleString('vi-VN')+'đ';
}
function saveTicket(){
  const type = document.getElementById('f_type').value;

  if(type === 'Trung chuyển' && !document.getElementById('f_transship').value.trim()){
    showToast('Vui lòng nhập trạm trung chuyển');
    return;
  }
  if(type === 'Rước đường' && !document.getElementById('f_transship_select').value.trim()){
    showToast('Vui lòng chọn địa điểm rước');
    return;
  }
  if(type === 'Rước đường' && !getStationValue().trim()){
    showToast('Vui lòng chọn trạm đi cho khách rước đường');
    return;
  }
  if(!document.getElementById('f_destination').value.trim()){
    showToast('Vui lòng chọn trạm đến');
    return;
  }

  const applyFormToSeat = (seat) => {
    seat.customerName = document.getElementById('f_name').value.trim();
    seat.phone = document.getElementById('f_phone').value.trim();
    seat.guestType = type;
    seat.firstStop = getStationValue().trim() || seat.firstStop;
    seat.lastStop = document.getElementById('f_destination').value.trim() || seat.lastStop;
    seat.transshipStation = type === 'Rước đường'
      ? document.getElementById('f_transship_select').value.trim()
      : document.getElementById('f_transship').value.trim();
    seat.arrivalTransfer = document.getElementById('f_arrival_transfer').value.trim();
    seat.hasLuggage = document.getElementById('f_luggage').checked;
    seat.note = document.getElementById('f_note').value.trim();
  };

  if(currentPanelMode === 'edit' && currentPanelSeat){
    const seat = currentPanelSeat;
    applyFormToSeat(seat);
    renderSeats();
    if(document.getElementById('zone3Passengers').style.display !== 'none') renderPassengerList();
    closePanel();
    showToast(`Đã cập nhật thông tin ghế ${seat.code}`);
    return;
  }
  if(currentPanelSeats.length){
    const groupTicketNo = "SGCD-" + String(ticketSeq++).padStart(4,'0');
    currentPanelSeats.forEach(seat => {
      applyFormToSeat(seat);
      seat.ticketNo = groupTicketNo;
      seat.paid = false;
      seat.count = currentPanelSeats.length;
      seat.state = seat.hasLuggage ? 'cargo' : 'hold';
    });
    renderSeats();
    if(document.getElementById('zone3Passengers').style.display !== 'none') renderPassengerList();
  }
  closePanel();
  showToast(currentPanelSeats.length > 1 ? 'Đã đặt vé nhóm thành công' : 'Đã đặt vé thành công');
  if(multiSelectMode) exitMultiSelectMode();
}

/* ---- Bán vé trực tiếp: xác nhận bán và chuyển ghế sang trạng thái đã bán (màu đỏ) ---- */
function sellTicket(){
  const type = document.getElementById('f_type').value;

  if(type === 'Trung chuyển' && !document.getElementById('f_transship').value.trim()){
    showToast('Vui lòng nhập trạm trung chuyển');
    return;
  }
  if(type === 'Rước đường' && !document.getElementById('f_transship_select').value.trim()){
    showToast('Vui lòng chọn địa điểm rước');
    return;
  }
  if(type === 'Rước đường' && !getStationValue().trim()){
    showToast('Vui lòng chọn trạm đi cho khách rước đường');
    return;
  }
  if(!document.getElementById('f_destination').value.trim()){
    showToast('Vui lòng chọn trạm đến');
    return;
  }

  const applyFormToSeat = (seat) => {
    seat.customerName = document.getElementById('f_name').value.trim();
    seat.phone = document.getElementById('f_phone').value.trim();
    seat.guestType = type;
    seat.firstStop = getStationValue().trim() || seat.firstStop;
    seat.lastStop = document.getElementById('f_destination').value.trim() || seat.lastStop;
    seat.transshipStation = type === 'Rước đường'
      ? document.getElementById('f_transship_select').value.trim()
      : document.getElementById('f_transship').value.trim();
    seat.arrivalTransfer = document.getElementById('f_arrival_transfer').value.trim();
    seat.hasLuggage = document.getElementById('f_luggage').checked;
    seat.note = document.getElementById('f_note').value.trim();
  };

  const seatsToSell = currentPanelSeats.length ? currentPanelSeats : (currentPanelSeat ? [currentPanelSeat] : []);
  if(!seatsToSell.length){ closePanel(); return; }

  const groupTicketNo = (currentPanelMode === 'edit' && currentPanelSeat && currentPanelSeat.ticketNo)
    ? currentPanelSeat.ticketNo
    : ("SGCD-" + String(ticketSeq++).padStart(4,'0'));

  seatsToSell.forEach(seat => {
    applyFormToSeat(seat);
    seat.ticketNo = seat.ticketNo || groupTicketNo;
    seat.paid = true;
    seat.count = seatsToSell.length;
    seat.state = 'sold'; // Bán vé -> ghế chuyển sang màu đỏ (đã bán)
  });

  renderSeats();
  if(document.getElementById('zone3Passengers').style.display !== 'none') renderPassengerList();
  closePanel();
  showToast(seatsToSell.length > 1
    ? 'Đã bán vé thành công cho ' + seatsToSell.length + ' ghế'
    : 'Đã bán vé thành công — Ghế ' + seatsToSell[0].code);
  if(multiSelectMode) exitMultiSelectMode();
}

/* ---- Modal chỉ định xe: đổi loại xe -> đổi sơ đồ ghế ---- */

// Vehicle type config successfully initialized at the top of the file

// Chuyển sơ đồ ghế hiện tại sang đúng số lượng/khung ghế của loại xe được chọn.
// Ghế nào giữ nguyên mã ở xe mới thì giữ nguyên toàn bộ thông tin khách (VD: khách A1 xe 36 chỗ
// chuyển sang xe 34 chỗ vẫn ở A1). Ghế đang có khách nhưng mã đó không còn tồn tại ở xe mới
// (VD: khách ở B3 xe 36 chỗ chuyển sang xe 34 chỗ - không có B3) sẽ dồn xuống danh sách "Ghế dư".
function applyVehicleType(typeLabel){
  if(!typeLabel || !VEHICLE_TYPE_SEATS[typeLabel]) return;

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
  if(tripSeatBank[currentTripId]) {
    tripSeatBank[currentTripId].down = seatPlanDown;
    tripSeatBank[currentTripId].up = seatPlanUp;
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
  extraLeftoverSeats = allCurrentSeats.filter(s => !targetCodes.has(s.code) && ['sold','hold','free','cargo'].includes(s.state));

  if(tripSeatBank[currentTripId]) {
    tripSeatBank[currentTripId].extraSeats = extraLeftoverSeats;
  }

  renderSeats();
  renderExtraSeats();
}

function renderExtraSeats(){
  const section = document.getElementById('extraSeatsSection');
  const list = document.getElementById('extraSeatsList');
  if(!section || !list) return;
  if(extraLeftoverSeats.length === 0){
    section.style.display = 'none';
    list.innerHTML = '';
    return;
  }
  section.style.display = '';

  // Align columns configuration with the main seat map
  const totalSeats = [...seatPlanDown, ...seatPlanUp].filter(s => s.state !== 'hidden').length;
  const useThreeCols = totalSeats >= 34;
  list.classList.toggle('cols-3', useThreeCols);

  list.innerHTML = extraLeftoverSeats.map(seatCard).join('');
}

/* ===================== GHẾ PHỤ (chỉ ghi chú + giá tiền) ===================== */
function subSeatCard(seat){
  return `
  <div class="seat-card sub" data-code="${seat.code}" onclick="openSubSeatModal('${seat.code}')">
    <div class="seat-top">
      <div><div class="seat-code">${seat.code}</div></div>
      <div class="seat-top-right">
        <div class="seat-price-tag">${(seat.price || 0).toLocaleString('vi-VN')}đ</div>
        <button type="button" class="seat-cancel-tag" onclick="event.stopPropagation(); deleteSubSeat('${seat.code}')">Xóa</button>
      </div>
    </div>
    <div class="seat-note" title="${seat.note || ''}">${seat.note || '—'}</div>
  </div>`;
}

function subSeatAddTile(){
  return `
  <div class="seat-card sub-add" onclick="openSubSeatModal()">
    <span class="sub-add-plus">+</span>
  </div>`;
}

function renderSubSeats(){
  const section = document.getElementById('subSeatsSection');
  const list = document.getElementById('subSeatsList');
  if(!section || !list) return;

  const totalSeats = [...seatPlanDown, ...seatPlanUp].filter(s => s.state !== 'hidden').length;
  const useThreeCols = totalSeats >= 34;
  list.classList.toggle('cols-3', useThreeCols);

  list.innerHTML = subSeats.map(subSeatCard).join('') + subSeatAddTile();
}

let editingSubSeatCode = null;

function nextSubSeatCode(){
  let max = 0;
  subSeats.forEach(s => {
    const m = /^S(\d+)$/.exec(s.code);
    if(m) max = Math.max(max, parseInt(m[1], 10));
  });
  return 'S' + (max + 1);
}

const DEFAULT_SUB_SEAT_PRICE = 280000;

function openSubSeatModal(code){
  editingSubSeatCode = code || null;
  const titleEl = document.getElementById('subSeatModalTitle');
  const noteEl = document.getElementById('subSeatNote');
  const priceDisplayEl = document.getElementById('subSeatPriceDisplay');
  if(editingSubSeatCode){
    const seat = subSeats.find(s => s.code === editingSubSeatCode);
    if(!seat) return;
    if(titleEl) titleEl.textContent = `Sửa ghế phụ ${seat.code}`;
    if(noteEl) noteEl.value = seat.note || '';
    if(priceDisplayEl) priceDisplayEl.textContent = (seat.price || DEFAULT_SUB_SEAT_PRICE).toLocaleString('vi-VN') + 'đ';
  } else {
    if(titleEl) titleEl.textContent = 'Thêm ghế phụ';
    if(noteEl) noteEl.value = '';
    if(priceDisplayEl) priceDisplayEl.textContent = DEFAULT_SUB_SEAT_PRICE.toLocaleString('vi-VN') + 'đ';
  }
  document.getElementById('subSeatModal').classList.add('open');
}

function saveSubSeat(){
  const note = document.getElementById('subSeatNote').value.trim();

  if(editingSubSeatCode){
    const seat = subSeats.find(s => s.code === editingSubSeatCode);
    if(seat){
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

  if(tripSeatBank[currentTripId]) tripSeatBank[currentTripId].subSeats = subSeats;
  saveSeatBank();
  renderSubSeats();
  updateTripStats();
  updatePassengerTabCount();
  closeModal('subSeatModal');
  showToast(editingSubSeatCode ? 'Đã cập nhật ghế phụ' : 'Đã thêm ghế phụ');
}

function deleteSubSeat(code){
  subSeats = subSeats.filter(s => s.code !== code);
  if(tripSeatBank[currentTripId]) tripSeatBank[currentTripId].subSeats = subSeats;
  saveSeatBank();
  renderSubSeats();
  updateTripStats();
  updatePassengerTabCount();
  showToast('Đã xóa ghế phụ');
}

function openAssignModal(){ 
  document.getElementById('assignModal').classList.add('open'); 
  document.getElementById('driverWarn').style.display='none'; 
  
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
function checkDriverConflict(){
  const conflict = document.getElementById('driverSelect').value.includes('trùng lịch');
  document.getElementById('driverWarn').style.display = conflict ? 'flex' : 'none';
}
function saveAssign(){
  if(document.getElementById('driverWarn').style.display === 'flex'){ showToast('Vui lòng chọn tài xế khác trước khi lưu (BR-07)'); return; }
  
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
function openDepartModal(){
  const tripEl = document.getElementById('tripTitle');
  const infoEl = document.getElementById('departTripInfo');
  if(tripEl && infoEl) infoEl.textContent = tripEl.textContent.trim();
  document.getElementById('departModal').classList.add('open');
}
function confirmDepart(){
  const tripEl = document.getElementById('tripTitle');
  closeModal('departModal');
  showToast('Xe đã khởi hành: ' + (tripEl ? tripEl.textContent.trim() : ''));
}

/* ---- Toast ---- */
let toastTimer;
function showToast(msg){
  const t = document.getElementById('toast');
  document.getElementById('toastText').textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'), 2600);
}

/* ---- Search dropdown (SB-01) ---- */
function setSearchMode(mode){
  const el = document.getElementById('searchModeSwitch');
  el.classList.toggle('mode-chuyen', mode==='chuyen');
  el.classList.toggle('mode-ve', mode==='ve');
  el.querySelectorAll('.search-mode-opt').forEach(b=>b.classList.toggle('active', b.dataset.mode===mode));
  document.getElementById('searchInput').placeholder = mode==='chuyen'
    ? 'Tìm kiếm theo tuyến, giờ chạy, biển số xe...'
    : 'Tìm kiếm theo SĐT, Mã vé, Tên hành khách...';
}
function toggleSearchResults(force){
  const el = document.getElementById('searchResults');
  if(force===true){ el.classList.add('open'); return; }
  el.classList.toggle('open');
}
document.getElementById('searchInput').addEventListener('focus', ()=>toggleSearchResults(true));
document.addEventListener('click', (e)=>{
  if(!e.target.closest('.search-wrap')) document.getElementById('searchResults').classList.remove('open');
  if(!e.target.closest('#directionDropdown') && !e.target.closest('#directionTrigger')) {
    const panel = document.getElementById('directionDropdown');
    if (panel) panel.classList.remove('open');
  }
  if(!e.target.closest('#routeDropdown') && !e.target.closest('#routeTrigger')) {
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
function pickSearchResult(){
  document.getElementById('searchResults').classList.remove('open');
  showToast('Đã điều hướng đến đúng phơi xe và ghế của khách');
}

/* ---- Zone 1: Trip list select ---- */
function selectTrip(el, time, routeLabel){
  document.querySelectorAll('.trip-card').forEach(c=>c.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('tripTitle').textContent = time + ' - ' + (routeLabel || 'Sài Gòn - Châu Đốc');
  const tripId = el.dataset.trip;
  if(!tripId || !tripSeatBank[tripId]) return;

  // Sync state
  currentTripId = tripId;
  seatPlanDown = tripSeatBank[tripId].down;
  seatPlanUp = tripSeatBank[tripId].up;
  extraLeftoverSeats = tripSeatBank[tripId].extraSeats || [];

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

  // Đang chuyển ghế và đã chọn ghế nguồn: cho phép bấm sang chuyến khác để chọn ghế trống làm đích,
  // không làm mất lựa chọn ghế nguồn đã chọn trước đó (không cần thêm nút nào).
  if(multiSelectMode && selectionMode === 'transfer' && selectedSourceSeats.length){
    currentTripId = tripId;
    seatPlanDown = tripSeatBank[tripId].down;
    seatPlanUp = tripSeatBank[tripId].up;
    extraLeftoverSeats = tripSeatBank[tripId].extraSeats || [];
    subSeats = tripSeatBank[tripId].subSeats || [];
    if(transferTargetTripId !== tripId){
      selectedTargetSeats = [];
      transferTargetTripId = tripId;
    }
    renderSeats();
    renderExtraSeats();
    renderSubSeats();
    if(transferSourceTripId === tripId){
      selectedSourceSeats.forEach(code=>{
        const card = document.querySelector(`.seat-card[data-code="${code}"]`);
        if(card){ card.style.outline='2px solid var(--red)'; card.style.outlineOffset='1px'; }
      });
    }
    if(transferTargetTripId === tripId){
      selectedTargetSeats.forEach(code=>{
        const card = document.querySelector(`.seat-card[data-code="${code}"]`);
        if(card){ card.style.outline='2px solid var(--red)'; card.style.outlineOffset='1px'; }
      });
    }
    if(document.getElementById('zone3Passengers').style.display !== 'none') renderPassengerList();
    updateTransferHint();
    return;
  }

  if(multiSelectMode) exitMultiSelectMode();

  currentTripId = tripId;
  seatPlanDown = tripSeatBank[tripId].down;
  seatPlanUp = tripSeatBank[tripId].up;
  extraLeftoverSeats = tripSeatBank[tripId].extraSeats || [];
  subSeats = tripSeatBank[tripId].subSeats || [];
  renderSeats();
  renderExtraSeats();
  renderSubSeats();
  if(document.getElementById('zone3Passengers').style.display !== 'none') renderPassengerList();
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
function updateTripListForDirection(dir){
  const sgList = document.getElementById('tripListSGCD');
  const cdList = document.getElementById('tripListCDSG');
  if(!sgList || !cdList) return;
  if(dir === 'cd-sg'){
    sgList.style.display = 'none';
    cdList.style.display = '';
    const firstCard = cdList.querySelector('.trip-card');
    if(firstCard) selectTrip(firstCard, firstCard.querySelector('.trip-time').textContent, 'Châu Đốc - Sài Gòn');
  } else {
    cdList.style.display = 'none';
    sgList.style.display = '';
    const firstCard = sgList.querySelector('.trip-card');
    if(firstCard) selectTrip(firstCard, firstCard.querySelector('.trip-time').textContent, 'Sài Gòn - Châu Đốc');
  }
}
function resetRoute(){
  showToast('Đổi Hướng đi → làm mới Tuyến và Danh sách phơi xe (BR-06)');
}
function toggleDirectionDropdown(e){
  e.stopPropagation();
  document.getElementById('directionDropdown').classList.toggle('open');
  document.getElementById('routeDropdown').classList.remove('open');
}
function toggleRouteDropdown(e){
  e.stopPropagation();
  renderRouteOptions();
  document.getElementById('routeDropdown').classList.toggle('open');
  document.getElementById('directionDropdown').classList.remove('open');
}
function toggleDirection(dir){
  if(!directionLabels[dir]) return;
  selectedDirection = dir;
  selectedRoute = 'all';
  document.getElementById('directionValue').textContent = directionLabels[dir];
  document.getElementById('routeValue').textContent = 'Tất cả tuyến';
  document.querySelectorAll('#directionDropdown .dropdown-item').forEach(item => {
    item.classList.toggle('active', item.dataset.dir === dir);
  });
  renderRouteOptions();
  updateTripListForDirection(dir);
  document.getElementById('directionDropdown').classList.remove('open');
  showToast('Chọn hướng: ' + directionLabels[dir]);
}
function selectRoute(route){
  const routeItem = routeOptions[selectedDirection].find(item => item.id === route);
  if(!routeItem) return;
  selectedRoute = route;
  document.getElementById('routeValue').textContent = routeItem.label;
  document.querySelectorAll('#routeDropdown .dropdown-item').forEach(item => {
    item.classList.toggle('active', item.dataset.route === route);
  });
  document.getElementById('routeDropdown').classList.remove('open');
  showToast('Chọn tuyến: ' + routeItem.label);
}
function renderRouteOptions(){
  const container = document.getElementById('routeDropdown');
  const routes = routeOptions[selectedDirection];
  container.innerHTML = routes.map(route => `
    <div class="dropdown-item ${route.id === selectedRoute ? 'active' : ''}" data-route="${route.id}" onclick="selectRoute('${route.id}')">
      <span>${route.label}</span>
      <span class="dropdown-item-check">✓</span>
    </div>
  `).join('');
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
let calDate = new Date(2026,6,8); // 08/07/2026
let selectedDate = new Date(2026,6,8);
const monthNames = ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6","Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"];
function renderCalendar(){
  const y = calDate.getFullYear(), m = calDate.getMonth();
  document.getElementById('calMonthLabel').textContent = `${monthNames[m]}, ${y}`;
  const first = new Date(y,m,1);
  const startOffset = (first.getDay()+6)%7; // T2 đầu tuần
  const daysInMonth = new Date(y,m+1,0).getDate();
  const daysInPrevMonth = new Date(y,m,0).getDate();
  const today = new Date(2026,6,8);
  let html = '';
  ["T2","T3","T4","T5","T6","T7","CN"].forEach(d=>html+=`<div class="cal-dow">${d}</div>`);
  for(let i=0;i<startOffset;i++){
    html += `<div class="cal-day muted">${daysInPrevMonth-startOffset+i+1}</div>`;
  }
  for(let d=1; d<=daysInMonth; d++){
    const dateObj = new Date(y,m,d);
    const isToday = dateObj.toDateString() === today.toDateString();
    const isSelected = dateObj.toDateString() === selectedDate.toDateString();
    const lunar = ((d+16)%30)+1;
    html += `<div class="cal-day ${isToday?'today':''} ${isSelected?'selected':''}" onclick="pickDate(${y},${m},${d})">${d}<span class="lunar">${lunar}/6</span></div>`;
  }
  const totalCells = startOffset + daysInMonth;
  const trailing = (7 - (totalCells % 7)) % 7;
  for(let i=1;i<=trailing;i++){ html += `<div class="cal-day muted">${i}</div>`; }
  document.getElementById('calGrid').innerHTML = html;
}
function shiftMonth(dir){ calDate = new Date(calDate.getFullYear(), calDate.getMonth()+dir, 1); renderCalendar(); }
function goToday(){ calDate = new Date(2026,6,8); selectedDate = new Date(2026,6,8); renderCalendar(); updateCalTrigger(); }
function pickDate(y,m,d){
  selectedDate = new Date(y,m,d);
  renderCalendar();
  updateCalTrigger();
  toggleCalendar(false); // chọn xong tự thu gọn lại
}

const dowNames = ["Chủ Nhật","Thứ Hai","Thứ Ba","Thứ Tư","Thứ Năm","Thứ Sáu","Thứ Bảy"];
function updateCalTrigger(){
  const today = new Date(2026,6,8);
  const isToday = selectedDate.toDateString() === today.toDateString();
  const d = String(selectedDate.getDate()).padStart(2,'0');
  const m = String(selectedDate.getMonth()+1).padStart(2,'0');
  document.getElementById('calTriggerDate').textContent = isToday ? 'Hôm nay' : `${d}/${m}`;
}

let calendarOpen = false;
function toggleCalendar(force){
  calendarOpen = typeof force === 'boolean' ? force : !calendarOpen;
  document.getElementById('calendarPanel').classList.toggle('open', calendarOpen);
  document.getElementById('calTrigger').classList.toggle('open', calendarOpen);
}
document.addEventListener('click', (e)=>{
  if(calendarOpen && !e.target.closest('.calendar') && !e.target.closest('#calTrigger')){
    toggleCalendar(false);
  }
});

renderCalendar();
updateCalTrigger();

/* ---- Zone 1: Time range slider (bấm chọn, khung cố định 2 giờ) ---- */
const tsTrack = document.getElementById('tsTrack');
const tsRange = document.getElementById('tsRange');
const TS_WINDOW_HOURS = 2;
let tsStartHour = 5; // 05:00 – 07:00 mặc định (theo dữ liệu ban đầu ~05:00-08:00, làm tròn còn 2h)

function updateTsUI(){
  const leftPct = (tsStartHour/24)*100;
  const rightPct = ((tsStartHour+TS_WINDOW_HOURS)/24)*100;
  tsRange.style.left = leftPct+'%';
  tsRange.style.width = (rightPct-leftPct)+'%';
  document.getElementById('tsCurrent').textContent =
    String(tsStartHour).padStart(2,'0')+':00 – '+String(tsStartHour+TS_WINDOW_HOURS).padStart(2,'0')+':00';
}
updateTsUI();

tsTrack.addEventListener('click', (e)=>{
  const rect = tsTrack.getBoundingClientRect();
  let pct = ((e.clientX - rect.left) / rect.width) * 100;
  pct = Math.max(0, Math.min(100, pct));
  let hour = Math.round((pct/100)*24);
  hour = Math.max(0, Math.min(24-TS_WINDOW_HOURS, hour));
  tsStartHour = hour;
  updateTsUI();
});

/* ===================== MODAL CHỈ ĐỊNH GHẾ DƯ CHO PHƠI KHÁC ===================== */
let activeAssignSourceSeatCode = null;
let activeAssignTargetTripId = null;
let selectedAssignTargetSeatCode = null;
let assignSeatTripSearchKeyword = '';

function openAssignSeatModal(seatCode){
  activeAssignSourceSeatCode = seatCode;
  const seat = findSeat(seatCode);
  if(!seat) return;
  
  const modalSub = document.getElementById('assignSeatModalSub');
  if(modalSub){
    modalSub.textContent = `Khách: ${seat.customerName || '—'} · ${seat.phone || '—'} · Ghế dư hiện tại: ${seatCode}`;
  }
  
  activeAssignTargetTripId = currentTripId;
  selectedAssignTargetSeatCode = null;
  assignSeatTripSearchKeyword = '';
  
  const searchInput = document.getElementById('assignSeatTripSearch');
  if(searchInput) searchInput.value = '';
  
  renderAssignSeatTripList();
  renderAssignSeatMap();
  updateAssignSeatConfirmState();
  
  document.getElementById('assignSeatModal').classList.add('open');
}

function closeAssignSeatModal(){
  document.getElementById('assignSeatModal').classList.remove('open');
  activeAssignSourceSeatCode = null;
  activeAssignTargetTripId = null;
  selectedAssignTargetSeatCode = null;
  assignSeatTripSearchKeyword = '';
}

function filterAssignSeatTripList(keyword) {
  assignSeatTripSearchKeyword = keyword || '';
  renderAssignSeatTripList();
}

function renderAssignSeatTripList(){
  const wrap = document.getElementById('assignSeatTripList');
  if(!wrap) return;
  const kw = assignSeatTripSearchKeyword.trim().toLowerCase();
  
  const filtered = !kw ? allTripsMeta : allTripsMeta.filter(t =>
    t.time.toLowerCase().includes(kw) ||
    (t.plate && t.plate.toLowerCase().includes(kw)) ||
    t.route.toLowerCase().includes(kw) ||
    (t.vehicleType && t.vehicleType.toLowerCase().includes(kw))
  );
  
  if(filtered.length === 0){
    wrap.innerHTML = '<div class="trip-empty-msg" style="padding:16px 4px; text-align:center; font-size:13.5px; color:var(--text-sub); font-weight:600;">Không tìm thấy phơi xe phù hợp</div>';
    return;
  }
  
  wrap.innerHTML = filtered.map(t => {
    const plan = tripSeatBank[t.id];
    const totalSeats = plan ? (plan.down.length + plan.up.length) : 0;
    const bookedSeats = plan ? [...plan.down, ...plan.up].filter(s => ['sold','hold','free','cargo'].includes(s.state)).length : 0;
    const selected = t.id === activeAssignTargetTripId ? 'selected' : '';
    const plate = t.plate || 'Chưa có';
    const vehicleType = t.vehicleType || 'Chưa rõ';
    
    return `
      <div class="trip-card ${selected}" onclick="selectAssignSeatTrip('${t.id}')">
        <div>
          <div class="trip-time-row">
            <span class="trip-time">${t.time}</span>
            <span class="trip-plate-inline">${plate}</span>
          </div>
          <div class="trip-sub">${t.route} • ${vehicleType}</div>
        </div>
        <div class="trip-nums">
          <div class="n1">${bookedSeats}/${totalSeats}</div>
          <div class="n2">đã đặt</div>
        </div>
      </div>`;
  }).join('');
}

function selectAssignSeatTrip(tripId){
  if(tripId === activeAssignTargetTripId) return;
  activeAssignTargetTripId = tripId;
  selectedAssignTargetSeatCode = null;
  renderAssignSeatTripList();
  renderAssignSeatMap();
  updateAssignSeatConfirmState();
}

function renderAssignSeatMap(){
  const tripId = activeAssignTargetTripId;
  const tripPlan = tripSeatBank[tripId];
  const floorDownEl = document.getElementById('assignSeatFloorDown');
  const floorUpEl = document.getElementById('assignSeatFloorUp');
  
  if(!tripPlan || !floorDownEl || !floorUpEl) return;
  
  const mapSeat = seat => {
    if(seat.state === 'hidden'){
      return `<div class="van-seat" style="visibility:hidden; pointer-events:none;"></div>`;
    }
    const isTarget = seat.code === selectedAssignTargetSeatCode;
    const isBooked = ['sold','hold','free','cargo'].includes(seat.state);
    let cls = 'empty';
    if(isBooked) cls = 'blocked';
    else if(isTarget) cls = 'selected';
    
    const clickable = !isBooked ? `onclick="selectAssignTargetSeat('${seat.code}')"` : '';
    
    return `
      <div class="van-seat ${cls}" ${clickable}>
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V17C19 18.6569 17.6569 20 16 20H8C6.34315 20 5 18.6569 5 17V5Z"/>
          <path d="M2 8C2 7.44772 2.44772 7 3 7H5V15H3C2.44772 15 2 14.5523 2 14V8Z"/>
          <path d="M19 7H21C21.5523 7 22 7.44772 22 8V14C22 14.5523 21.5523 15 21 15H19V7Z"/>
        </svg>
        <span class="seat-num">${seat.code}</span>
      </div>
    `;
  };
  
  const totalSeats = tripPlan.down.length + tripPlan.up.length;
  const useThreeCols = totalSeats >= 34;
  
  floorDownEl.classList.toggle('cols-3', useThreeCols);
  floorDownEl.innerHTML = tripPlan.down.map(mapSeat).join('');
  
  floorUpEl.classList.toggle('cols-3', useThreeCols);
  floorUpEl.innerHTML = tripPlan.up.map(mapSeat).join('');
  
  const tag = document.getElementById('assignSeatSelectedTag');
  if(tag) tag.textContent = selectedAssignTargetSeatCode ? ('Ghế ' + selectedAssignTargetSeatCode) : '';
}

function selectAssignTargetSeat(code){
  const tripPlan = tripSeatBank[activeAssignTargetTripId];
  if(!tripPlan) return;
  const seat = [...tripPlan.down, ...tripPlan.up].find(s => s.code === code);
  if(!seat || ['sold','hold','free','cargo'].includes(seat.state)) return;
  
  selectedAssignTargetSeatCode = (selectedAssignTargetSeatCode === code) ? null : code;
  renderAssignSeatMap();
  updateAssignSeatConfirmState();
}

function updateAssignSeatConfirmState(){
  const btn = document.getElementById('confirmAssignSeatBtn');
  const hint = document.getElementById('assignSeatHint');
  if(!btn) return;
  
  if(activeAssignTargetTripId && selectedAssignTargetSeatCode){
    btn.disabled = false;
    if(hint) hint.textContent = `Sẵn sàng chỉ định ghế ${activeAssignSourceSeatCode} sang chuyến ${activeAssignTargetTripId}, ghế ${selectedAssignTargetSeatCode}`;
  } else {
    btn.disabled = true;
    if(hint) hint.textContent = 'Chọn 1 phơi xe và 1 ghế trống để chỉ định.';
  }
}

function confirmAssignSeat(){
  if(!activeAssignSourceSeatCode || !activeAssignTargetTripId || !selectedAssignTargetSeatCode) return;
  
  const sourceIdx = extraLeftoverSeats.findIndex(s => s.code === activeAssignSourceSeatCode);
  if(sourceIdx === -1) {
    showToast('Không tìm thấy ghế dư nguồn');
    return;
  }
  const sourceSeat = extraLeftoverSeats[sourceIdx];
  
  const tripPlan = tripSeatBank[activeAssignTargetTripId];
  if(!tripPlan) {
    showToast('Không tìm thấy sơ đồ phơi xe đích');
    return;
  }
  const targetSeat = [...tripPlan.down, ...tripPlan.up].find(s => s.code === selectedAssignTargetSeatCode);
  if(!targetSeat || ['sold','hold','free','cargo'].includes(targetSeat.state)) {
    showToast('Ghế đích không hợp lệ hoặc đã có người đặt');
    return;
  }
  
  targetSeat.state = sourceSeat.state;
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
  targetSeat.guestType = sourceSeat.guestType;
  targetSeat.transshipStation = sourceSeat.transshipStation;
  targetSeat.arrivalTransfer = sourceSeat.arrivalTransfer;
  
  extraLeftoverSeats.splice(sourceIdx, 1);
  
  if (tripSeatBank[currentTripId]) {
    tripSeatBank[currentTripId].extraSeats = extraLeftoverSeats;
  }
  saveSeatBank();
  
  if(activeAssignTargetTripId === currentTripId){
    seatPlanDown = tripPlan.down;
    seatPlanUp = tripPlan.up;
    renderSeats();
  }
  
  renderExtraSeats();
  if(document.getElementById('zone3Passengers').style.display !== 'none') renderPassengerList();
  closeAssignSeatModal();
  showToast(`Đã chỉ định ghế ${activeAssignSourceSeatCode} sang chuyến ${activeAssignTargetTripId}, ghế ${selectedAssignTargetSeatCode} thành công`);
}

function renderZone1TripList() {
  const sgcdWrap = document.getElementById('tripListSGCD');
  const cdsgWrap = document.getElementById('tripListCDSG');
  if (!sgcdWrap || !cdsgWrap) return;
  
  const mapTrip = t => {
    const plan = tripSeatBank[t.id];
    const totalSeats = plan ? plan.down.filter(s => s.state !== 'hidden').length + plan.up.filter(s => s.state !== 'hidden').length : 0;
    const bookedSeats = plan ? [...plan.down, ...plan.up].filter(s => ['sold','hold','free','cargo'].includes(s.state)).length : 0;
    const selected = t.id === currentTripId ? 'selected' : '';
    const plate = plan && plan.plate ? plan.plate : (t.plate || 'Chưa có');
    const vehicleType = plan && plan.vehicleType ? plan.vehicleType : (t.vehicleType || 'Chưa rõ');
    
    return `
      <div class="trip-card ${selected}" data-trip="${t.id}" onclick="selectTrip(this,'${t.time}','${t.route}')">
        <div>
          <div class="trip-time-row">
            <span class="trip-time">${t.time}</span>
            <span class="trip-plate-inline">${plate}</span>
          </div>
          <div class="trip-sub">${t.route} • ${vehicleType}</div>
        </div>
        <div class="trip-nums">
          <div class="n1">${bookedSeats}/${totalSeats}</div>
        </div>
      </div>
    `;
  };
  
  sgcdWrap.innerHTML = sgcdTripsMeta.map(mapTrip).join('');
  CDSG_TABS_MAPPING_VERIFICATION_CHECK: 
  cdsgWrap.innerHTML = cdsgTripsMeta.map(mapTrip).join('');
}

/* ===================== TÀI KHOẢN / ĐĂNG XUẤT ===================== */
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