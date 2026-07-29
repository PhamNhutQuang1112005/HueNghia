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
    assigned: { tripId: '1', seat: 'A12' }
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
const HN_STORAGE_KEY = 'hn_trip_seat_bank_v6';

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

// Default seat generator (if storage empty)
const staffList = ["tuyetphuong.huenghia","minh.tran","nguyen.long","thi.hoa"];
const stopsFirst = ["Trạm Kinh Dương Vương","Trạm An Sương","Trạm Q.5","Văn phòng trung tâm"];
const stopsLast = ["Trạm Châu Đốc","Trạm Tân Châu","Bến xe Châu Đốc"];
const nameSamples = ["Nguyễn Văn An","Trần Thị Mai","Lê Hoàng Nam","Phạm Thùy Linh","Võ Minh Khoa","Huỳnh Ngọc Ánh","Đặng Quốc Huy","Bùi Thảo Vy"];
const noteSamples = ["","Khách quen, hay đi ghế gần cửa","Yêu cầu ghế tầng dưới","Có trẻ nhỏ đi cùng",""];
const pickupTimes = ["06:15","06:20","06:25","06:30","06:35","06:40","06:45","06:50","06:55","06:20","06:35","06:50"];
const phonePool = ["0909123456","0912345678","0933778899","0987654321","0977112233","0901234567","0966998877","0913579246","0938001122","0989112233","0908771122","0967345678"];
let pickupTimeIdx = 0, phoneIdx = 0, ticketSeq = 1, nameIdx = 0;

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

function makeSeat(code, state, opts = {}){
  const isBooked = ['sold','hold','free','cargo'].includes(state);
  const base = {
    code, state,
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

let tripSeatBank = {};

function saveSeatBank() {
  localStorage.setItem(HN_STORAGE_KEY, JSON.stringify(tripSeatBank));
}

function loadSeatBank() {
  const saved = localStorage.getItem(HN_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return null;
}

function initSeatBank() {
  const saved = loadSeatBank();
  if (saved) {
    tripSeatBank = saved;
    return;
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

  const seatPlanDown = [
    a1, a2, makeSeat("A3","empty"), makeSeat("A4","cargo"),
    makeSeat("A5","sold"), makeSeat("A6","empty"), makeSeat("A7","sold"), makeSeat("A8","free"),
    makeSeat("A9","empty"), a10, a11, a12,
  ];

  const b2 = makeSeat("B2","sold");
  const b3 = groupSeat(b2, "B3", "sold");

  const seatPlanUp = [
    makeSeat("B1","empty"), b2, b3, makeSeat("B4","empty"),
    makeSeat("B5","sold"), makeSeat("B6","empty"), makeSeat("B7","cargo"), makeSeat("B8","hold"),
    makeSeat("B9","empty"), makeSeat("B10","sold"), makeSeat("B11","free"), makeSeat("B12","empty"),
  ];
  
  tripSeatBank['1'] = {
    down: seatPlanDown,
    up: seatPlanUp,
    plate: '51F-123.45',
    vehicleType: 'Limousine 24 Phòng',
    driver: 'Trần Văn Hùng',
    helper: 'Nguyễn Thị Hương'
  };
  allTripsMeta.forEach(t => {
    if(t.id !== '1') {
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
}

initSeatBank();

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
});

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
      const trip = allTripsMeta.find(t => t.id === p.assigned.tripId);
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

  activeTripId = pax.assigned ? pax.assigned.tripId : allTripsMeta[0].id;
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
  if(!wrap) return;
  const kw = tripSearchKeyword.trim().toLowerCase();
  
  const filtered = !kw ? allTripsMeta : allTripsMeta.filter(t =>
    t.time.toLowerCase().includes(kw) ||
    (t.plate && t.plate.toLowerCase().includes(kw)) ||
    t.route.toLowerCase().includes(kw) ||
    (t.vehicleType && t.vehicleType.toLowerCase().includes(kw))
  );

  if(filtered.length === 0){
    wrap.innerHTML = '<div class="trip-empty-msg">Không tìm thấy phơi xe phù hợp</div>';
    return;
  }

  wrap.innerHTML = filtered.map(t => {
    const plan = tripSeatBank[t.id];
    const totalSeats = plan ? plan.down.filter(s => s.state !== 'hidden').length + plan.up.filter(s => s.state !== 'hidden').length : 0;
    const bookedSeats = plan ? [...plan.down, ...plan.up].filter(s => ['sold','hold','free','cargo'].includes(s.state)).length : 0;
    const selected = t.id === activeTripId ? 'selected' : '';
    const plate = t.plate || 'Chưa có';
    const vehicleType = t.vehicleType || 'Chưa rõ';
    
    return `
      <div class="trip-card ${selected}" onclick="selectTrip('${t.id}')">
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

function selectTrip(tripId){
  if(tripId === activeTripId) return;
  activeTripId = tripId;
  selectedSeat = null;
  renderTripList();
  renderSeatMap();
  updateConfirmState();
}

function renderSeatMap(){
  const floorDownEl = document.getElementById('assignSeatFloorDown');
  const floorUpEl = document.getElementById('assignSeatFloorUp');
  
  const tripPlan = tripSeatBank[activeTripId];
  if(!tripPlan || !floorDownEl || !floorUpEl) return;

  const mapSeat = seat => {
    if(seat.state === 'hidden'){
      return `<div class="van-seat" style="visibility:hidden; pointer-events:none;"></div>`;
    }
    const isSelected = seat.code === selectedSeat;
    const isBooked = ['sold','hold','free','cargo'].includes(seat.state);
    let cls = 'empty';
    if(isBooked) cls = 'blocked';
    else if(isSelected) cls = 'selected';
    
    const clickable = !isBooked ? `onclick="selectSeat('${seat.code}')"` : '';
    
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

  document.getElementById('seatSelectedTag').textContent = selectedSeat ? ('Ghế ' + selectedSeat) : '';
}

function selectSeat(code){
  const tripPlan = tripSeatBank[activeTripId];
  if(!tripPlan) return;
  const seat = [...tripPlan.down, ...tripPlan.up].find(s => s.code === code);
  if(!seat || ['sold','hold','free','cargo'].includes(seat.state)) return;
  
  selectedSeat = (selectedSeat === code) ? null : code;
  renderSeatMap();
  updateConfirmState();
}

function updateConfirmState(){
  const btn = document.getElementById('confirmAssignBtn');
  const hint = document.getElementById('assignHint');
  if(!btn) return;
  
  if(activeTripId && selectedSeat){
    btn.disabled = false;
    const trip = allTripsMeta.find(t => t.id === activeTripId);
    hint.textContent = `Sẽ bán vé ghế ${selectedSeat} — phơi xe ${trip ? trip.time : activeTripId}`;
  } else {
    btn.disabled = true;
    hint.textContent = 'Chọn 1 phơi xe và 1 ghế trống để bán vé.';
  }
}

function confirmAssign(){
  if(!activePaxId || !activeTripId || !selectedSeat) return;
  const pax = pickupPassengers.find(p => p.id === activePaxId);
  if(!pax) return;

  const tripPlan = tripSeatBank[activeTripId];
  if(!tripPlan) return;

  // Nếu khách đang đổi chỉ định từ 1 ghế/phơi xe khác thì trả ghế cũ về trạng thái trống
  if(pax.assigned){
    const oldTripPlan = tripSeatBank[pax.assigned.tripId];
    if(oldTripPlan){
      const oldSeat = [...oldTripPlan.down, ...oldTripPlan.up].find(s => s.code === pax.assigned.seat);
      if(oldSeat){
        oldSeat.state = 'empty';
        oldSeat.customerName = null;
        oldSeat.phone = null;
        oldSeat.ticketNo = null;
        oldSeat.paid = false;
      }
    }
  }

  // Assign passenger to new seat in tripSeatBank
  const targetSeat = [...tripPlan.down, ...tripPlan.up].find(s => s.code === selectedSeat);
  if(targetSeat){
    targetSeat.state = 'sold'; // Bán vé
    targetSeat.customerName = pax.name;
    targetSeat.phone = pax.phone;
    targetSeat.firstStop = pax.fromStation;
    targetSeat.lastStop = pax.toStation;
    targetSeat.transshipStation = pax.fromTransfer;
    targetSeat.paid = true;
    targetSeat.count = 1;
    targetSeat.ticketNo = targetSeat.ticketNo || ("SGCD-" + String(Math.floor(1000 + Math.random()*9000)));
  }

  pax.assigned = { tripId: activeTripId, seat: selectedSeat };

  // Save the updated bank to localStorage so the ticketstaff tab gets updated!
  saveSeatBank();

  closeAssignModal();
  renderPaxTable();
  const trip = allTripsMeta.find(t => t.id === activeTripId);
  showToast(`Đã bán vé cho ${pax.name} lên xe ${trip ? (trip.plate || '') : ''} — ghế ${selectedSeat}`);
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