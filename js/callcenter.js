/* ===================== DỮ LIỆU GHẾ MẪU ===================== */
const staffList = ["tuyetphuong.huenghia", "minh.tran", "nguyen.long", "thi.hoa"];
// Ánh xạ username đăng nhập -> mã nhân viên hiển thị (NV01, NV02...) để đồng bộ định dạng
// với dữ liệu lịch sử tĩnh (CUSTOMER_HISTORY_DATA), tránh hiện thẳng username thô ngoài UI.
const STAFF_CODE_MAP = {
  "tuyetphuong.huenghia": "NV01",
  "minh.tran": "NV02",
  "nguyen.long": "NV03",
  "thi.hoa": "NV04"
};
function getStaffCode(usernameOrCode) {
  if (!usernameOrCode) return null;
  return STAFF_CODE_MAP[usernameOrCode] || usernameOrCode;
}
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

function getPastDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

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
const CUSTOMER_HISTORY_DATA = [
  { date: getPastDate(3), phone: '0809123456', name: 'Nguyễn Văn An', ticketNo: 'SGCD-H001', route: 'Sài Gòn - Châu Đốc', time: '07:00', seat: 'A1', firstStop: 'Trạm Kinh Dương Vương', lastStop: 'Trạm Châu Đốc', guestType: 'Khách trạm', transship: '', dropoffAddress: '145 Lý Thái Tổ, P.1, TP. Châu Đốc', state: 'sold', paid: true, price: 280000, plate: '51F-123.45', vehicleType: 'Limousine 24 Phòng', driver: 'Trần Văn Hùng', helper: 'Nguyễn Thị Hương', bookStaff: 'NV01', sellStaff: 'NV05' },
  { date: getPastDate(10), phone: '0809123456', name: 'Nguyễn Văn An', ticketNo: 'CDSG-H002', route: 'Châu Đốc - Sài Gòn', time: '06:00', seat: 'B3', firstStop: 'Trạm Châu Đốc', lastStop: 'Trạm Q.5', guestType: 'Trung chuyển', pickupAddress: 'Khách sạn Victoria, Châu Đốc', dropoffAddress: '456 An Dương Vương, P.9, Q.5', state: 'sold', paid: true, price: 280000, plate: '51F-123.45', vehicleType: 'Limousine 24 Phòng', driver: 'Phạm Quốc Bảo', helper: 'Đỗ Văn Sơn', bookStaff: 'NV02', sellStaff: 'NV03' },
  { date: getPastDate(4), phone: '0912345678', name: 'Trần Thị Mai', ticketNo: 'SGCD-H003', route: 'Sài Gòn - Châu Đốc', time: '08:30', seat: 'A2, A3', firstStop: 'Trạm Q.5', lastStop: 'Trạm Tân Châu', guestType: 'Trung chuyển', pickupAddress: 'KDC Bình Hưng, Bình Chánh', dropoffAddress: '12 Nguyễn Huệ, Thị xã Tân Châu', state: 'sold', paid: true, price: 560000, plate: '50H-678.90', vehicleType: 'Giường nằm 34 chỗ', driver: 'Phạm Quốc Bảo', helper: 'Đỗ Văn Sơn', bookStaff: 'NV04', sellStaff: 'NV08' },
  { date: getPastDate(14), phone: '0912345678', name: 'Trần Thị Mai', ticketNo: 'CDSG-H004', route: 'Châu Đốc - Sài Gòn', time: '09:15', seat: 'B1', firstStop: 'Bến xe Châu Đốc', lastStop: 'Trạm Kinh Dương Vương', guestType: 'Khách trạm', transship: '', state: 'sold', paid: false, price: 280000, plate: '50H-678.90', vehicleType: 'Giường nằm 34 chỗ', driver: 'Trần Văn Hùng', helper: 'Nguyễn Thị Hương', bookStaff: 'NV02', sellStaff: '—' },
  { date: getPastDate(5), phone: '0933778899', name: 'Lê Hoàng Nam', ticketNo: 'SGCD-H005', route: 'Sài Gòn - Châu Đốc', time: '10:00', seat: 'A6', firstStop: 'Trạm Kinh Dương Vương', lastStop: 'Trạm Châu Đốc', guestType: 'Khách trạm', transship: '', state: 'sold', paid: true, price: 280000, plate: '51F-222.33', vehicleType: 'Limousine 24 Phòng', driver: 'Trần Văn Hùng', helper: 'Nguyễn Văn Bình', bookStaff: 'NV01', sellStaff: 'NV02' },
  { date: getPastDate(18), phone: '0933778899', name: 'Lê Hoàng Nam', ticketNo: 'CDSG-H006', route: 'Châu Đốc - Sài Gòn', time: '14:00', seat: 'A10, A11', firstStop: 'Trạm Tân Châu', lastStop: 'Trạm An Sương', guestType: 'Trung chuyển', pickupAddress: 'Chợ Mới, An Giang', dropoffAddress: 'Chợ Bà Điểm, Hóc Môn', state: 'sold', paid: true, price: 560000, plate: '50H-345.67', vehicleType: 'Ghế ngồi 45 chỗ', driver: 'Phạm Quốc Bảo', helper: 'Đỗ Văn Sơn', bookStaff: 'NV05', sellStaff: 'NV05' },
  { date: getPastDate(6), phone: '0987654321', name: 'Phạm Thùy Linh', ticketNo: 'SGCD-H007', route: 'Sài Gòn - Châu Đốc', time: '17:00', seat: 'B5', firstStop: 'Trạm Q.5', lastStop: 'Bến xe Châu Đốc', guestType: 'Rước đường', pickupAddress: 'Cầu vượt Củ Chi, QL22', state: 'sold', paid: true, price: 250000, plate: '50H-678.90', vehicleType: 'Giường nằm 34 chỗ', driver: 'Trần Văn Hùng', helper: 'Nguyễn Thị Hương', bookStaff: 'NV02', sellStaff: 'NV07' },
  { date: getPastDate(7), phone: '0809654321', name: 'Võ Minh Khoa', ticketNo: 'SGCD-H008', route: 'Sài Gòn - Châu Đốc', time: '07:00', seat: 'A4', firstStop: 'Trạm An Sương', lastStop: 'Trạm Châu Đốc', guestType: 'Rước đường', pickupAddress: 'Ngã 4 An Sương, Q.12', state: 'sold', paid: true, price: 280000, plate: '51F-123.45', vehicleType: 'Limousine 24 Phòng', driver: 'Trần Văn Hùng', helper: 'Nguyễn Văn Bình', bookStaff: 'NV03', sellStaff: 'NV03' },
  { date: getPastDate(8), phone: '0901234567', name: 'Huỳnh Ngọc Ánh', ticketNo: 'SGCD-H009', route: 'Sài Gòn - Châu Đốc', time: '08:30', seat: 'A9', firstStop: 'Trạm Q.5', lastStop: 'Trạm Tân Châu', guestType: 'Trung chuyển', dropoffAddress: '78 Hùng Vương, Tân Châu', state: 'sold', paid: true, price: 250000, plate: '50H-678.90', vehicleType: 'Giường nằm 34 chỗ', driver: 'Trần Văn Hùng', helper: 'Nguyễn Thị Hương', bookStaff: 'NV01', sellStaff: 'NV06' },
  { date: getPastDate(9), phone: '0966998877', name: 'Đặng Quốc Huy', ticketNo: 'SGCD-H010', route: 'Sài Gòn - Châu Đốc', time: '15:30', seat: 'A3', firstStop: 'Văn phòng trung tâm', lastStop: 'Trạm Châu Đốc', guestType: 'Khách trạm', transship: '', state: 'sold', paid: true, price: 280000, plate: '51F-222.33', vehicleType: 'Limousine 24 Phòng', driver: 'Trần Văn Hùng', helper: 'Nguyễn Văn Bình', bookStaff: 'NV05', sellStaff: 'NV05' },
  { date: getPastDate(11), phone: '0913579246', name: 'Bùi Thảo Vy', ticketNo: 'CDSG-H011', route: 'Châu Đốc - Sài Gòn', time: '09:15', seat: 'A12', firstStop: 'Bến xe Châu Đốc', lastStop: 'Trạm An Sương', guestType: 'Khách trạm', transship: '', state: 'sold', paid: true, price: 250000, plate: '50H-678.90', vehicleType: 'Giường nằm 34 chỗ', driver: 'Trần Văn Hùng', helper: 'Nguyễn Thị Hương', bookStaff: 'NV03', sellStaff: 'NV04' },
  { date: getPastDate(12), phone: '0938001122', name: 'Nguyễn Thanh Tùng', ticketNo: 'SGCD-H012', route: 'Sài Gòn - Châu Đốc', time: '10:00', seat: 'B6', firstStop: 'Trạm Kinh Dương Vương', lastStop: 'Trạm Châu Đốc', guestType: 'Khách trạm', transship: '', state: 'sold', paid: true, price: 280000, plate: '51F-222.33', vehicleType: 'Limousine 24 Phòng', driver: 'Phạm Quốc Bảo', helper: 'Đỗ Văn Sơn', bookStaff: 'NV02', sellStaff: 'NV08' },
  { date: getPastDate(13), phone: '0989112233', name: 'Lý Thị Hồng', ticketNo: 'SGCD-H013', route: 'Sài Gòn - Châu Đốc', time: '17:00', seat: 'A11', firstStop: 'Trạm An Sương', lastStop: 'Bến xe Châu Đốc', guestType: 'Khách trạm', transship: '', state: 'sold', paid: true, price: 250000, plate: '50H-678.90', vehicleType: 'Giường nằm 34 chỗ', driver: 'Trần Văn Hùng', helper: 'Nguyễn Văn Bình', bookStaff: 'NV01', sellStaff: 'NV01' },
  { date: getPastDate(15), phone: '0908771122', name: 'Cao Văn Đức', ticketNo: 'CDSG-H014', route: 'Châu Đốc - Sài Gòn', time: '14:00', seat: 'A5, A6', firstStop: 'Trạm Tân Châu', lastStop: 'Trạm Q.5', guestType: 'Trung chuyển', dropoffAddress: '102 Nguyễn Trãi, P.3, Q.5', state: 'sold', paid: false, price: 560000, plate: '51F-222.33', vehicleType: 'Limousine 24 Phòng', driver: 'Phạm Quốc Bảo', helper: 'Đỗ Văn Sơn', bookStaff: 'NV04', sellStaff: '—' },
  { date: getPastDate(16), phone: '0967345678', name: 'Trương Minh Tuấn', ticketNo: 'SGCD-H015', route: 'Sài Gòn - Châu Đốc', time: '08:30', seat: 'B4', firstStop: 'Trạm Q.5', lastStop: 'Trạm Châu Đốc', guestType: 'Khách trạm', transship: '', state: 'sold', paid: true, price: 250000, plate: '50H-678.90', vehicleType: 'Giường nằm 34 chỗ', driver: 'Trần Văn Hùng', helper: 'Nguyễn Thị Hương', bookStaff: 'NV02', sellStaff: 'NV05' }
];

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

function buildSequentialSeatCodes(total) {
  const downCount = Math.ceil(total / 2);
  const upCount = total - downCount;
  const down = Array.from({ length: downCount }, (_, i) => "A" + (i + 1));
  const up = Array.from({ length: upCount }, (_, i) => "B" + (i + 1));
  return { down, up };
}

function getSeatCodesForVehicleType(typeLabel) {
  const total = VEHICLE_TYPE_SEATS[typeLabel];
  if (typeLabel === "Limousine 34 giường" || typeLabel === "Giường nằm 34 chỗ") {
    const base = buildSequentialSeatCodes(VEHICLE_TYPE_SEATS["Xe thường 36 giường"]);
    return {
      down: base.down.map(c => c === "A3" ? "A3_hidden" : c),
      up: base.up.map(c => c === "B3" ? "B3_hidden" : c),
    };
  }
  return buildSequentialSeatCodes(total);
}

// Sinh dữ liệu ghế mẫu cho các chuyến còn lại (mỗi ghế là 1 khách hàng độc nhất)
function generateTripSeatPlanForVehicleType(vehicleType, tripId = '1') {
  const codes = getSeatCodesForVehicleType(vehicleType);
  const pattern = ['sold', 'empty', 'hold', 'empty', 'sold', 'empty', 'hold', 'free', 'empty', 'sold', 'cargo', 'empty'];
  let seatCustIdx = (parseInt(tripId || '1') * 7) % nameSamples.length;
  const buildFloor = floorCodes => floorCodes.map((code) => {
    if (code.endsWith('_hidden')) return { code, state: 'hidden' };
    const st = pattern[(seatCustIdx++) % pattern.length];
    return makeSeat(code, st);
  });
  return {
    down: buildFloor(codes.down),
    up: buildFloor(codes.up),
  };
}

const HN_STORAGE_KEY = 'hn_trip_seat_bank_v12';
let isSyncingFromStorage = false;

function saveSeatBank() {
  const jsonStr = JSON.stringify(tripSeatBank);
  localStorage.setItem(HN_STORAGE_KEY, jsonStr);
  try { window.dispatchEvent(new StorageEvent('storage', { key: HN_STORAGE_KEY, newValue: jsonStr })); } catch (e) { }
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
  a1, a2, makeSeat("A3", "empty"), makeSeat("A4", "cargo"),
  makeSeat("A5", "sold"), makeSeat("A6", "empty"), makeSeat("A7", "sold"), makeSeat("A8", "free"),
  makeSeat("A9", "empty"), a10, a11, a12,
];
seatPlanDown[2].locked = true; // ví dụ trạng thái khoá tạm thời (BR-05)
seatPlanDown[2].lockedBy = "NV. Hồng";

const b2 = makeSeat("B2", "sold");
const b3 = groupSeat(b2, "B3", "sold");

let seatPlanUp = [
  makeSeat("B1", "empty"), b2, b3, makeSeat("B4", "empty"),
  makeSeat("B5", "sold"), makeSeat("B6", "empty"), makeSeat("B7", "cargo"), makeSeat("B8", "hold"),
  makeSeat("B9", "empty"), makeSeat("B10", "sold"), makeSeat("B11", "free"), makeSeat("B12", "empty"),
];

// Danh sách các chuyến (khớp với data-trip trên trip-card ở Zone 1) để có thể
// chuyển ghế của khách sang một chuyến xe khác, không chỉ trong cùng 1 chuyến.
const todayStr = new Date().toISOString().split("T")[0];
const HN_TRIPS_KEY = 'hn_trips_meta_v9';
const DEFAULT_SGCD_TRIPS = [
  { id: '1', name: 'Sài Gòn - Châu Đốc (07:00) - Xuất bến VP Q.5', time: '07:00', route: 'Sài Gòn - Châu Đốc', plate: '51F-123.45', vehicleType: 'Limousine 24 Phòng', date: todayStr, price: 280000, status: 'Đang bán', note: 'Xuất bến VP Q.5 - Tải 24 phòng VIP' },
  { id: '2', name: 'Sài Gòn - Châu Đốc (08:30) - Chạy bến An Sương', time: '08:30', route: 'Sài Gòn - Châu Đốc', plate: '50H-678.90', vehicleType: 'Giường nằm 34 chỗ', date: todayStr, price: 250000, status: 'Đã chỉ định xe', note: 'Chạy bến An Sương - Đón dọc QL22' },
  { id: '3', name: 'Sài Gòn - Châu Đốc (10:00) - Chuyến sáng trung tâm', time: '10:00', route: 'Sài Gòn - Châu Đốc', plate: '', vehicleType: 'Limousine 24 Phòng', date: todayStr, price: 280000, status: 'Chưa chỉ định xe', note: 'Chuyến sáng trung tâm - Đã mở bán' },
  { id: '4', name: 'Sài Gòn - Châu Đốc (13:15) - Tăng cường xe 45 chỗ', time: '13:15', route: 'Sài Gòn - Châu Đốc', plate: '50H-345.67', vehicleType: 'Ghế ngồi 45 chỗ', date: todayStr, price: 180000, status: 'Đã chỉ định xe', note: 'Tăng cường xe 45 chỗ - Rước Kinh Dương Vương' },
  { id: '5', name: 'Sài Gòn - Châu Đốc (15:30) - Tuyến cố định chiều', time: '15:30', route: 'Sài Gòn - Châu Đốc', plate: '', vehicleType: 'Limousine 24 Phòng', date: todayStr, price: 280000, status: 'Chưa chỉ định xe', note: 'Tuyến cố định chiều - Đón khách VP Q5' },
  { id: '6', name: 'Sài Gòn - Châu Đốc (17:00) - Chuyến chiều tối', time: '17:00', route: 'Sài Gòn - Châu Đốc', plate: '', vehicleType: 'Giường nằm 34 chỗ', date: todayStr, price: 250000, status: 'Chưa chỉ định xe', note: 'Chuyến chiều tối - Xe giường nằm 34 chỗ' },
];
const DEFAULT_CDSG_TRIPS = [
  { id: '7', name: 'Châu Đốc - Sài Gòn (06:00) - Xuất bến sớm Bến Xe CD', time: '06:00', route: 'Châu Đốc - Sài Gòn', plate: '51F-123.45', vehicleType: 'Limousine 24 Phòng', date: todayStr, price: 280000, status: 'Đã chỉ định xe', note: 'Xuất bến sớm Bến Xe CD - Trả Q.5 & An Sương' },
  { id: '8', name: 'Châu Đốc - Sài Gòn (09:15) - Chuyến sáng Châu Đốc', time: '09:15', route: 'Châu Đốc - Sài Gòn', plate: '50H-678.90', vehicleType: 'Giường nằm 34 chỗ', date: todayStr, price: 250000, status: 'Đã chỉ định xe', note: 'Chuyến sáng Châu Đốc - Trung chuyển tận nơi' },
  { id: '9', name: 'Châu Đốc - Sài Gòn (14:00) - Tuyến cố định rước khách', time: '14:00', route: 'Châu Đốc - Sài Gòn', plate: '', vehicleType: 'Limousine 24 Phòng', date: todayStr, price: 280000, status: 'Chưa chỉ định xe', note: 'Tuyến cố định rước khách dọc đường' },
  { id: '10', name: 'Châu Đốc - Sài Gòn (21:00) - Chuyến đêm Limousine VIP', time: '21:00', route: 'Châu Đốc - Sài Gòn', plate: '', vehicleType: 'Giường nằm 34 chỗ', date: todayStr, price: 250000, status: 'Chưa chỉ định xe', note: 'Chuyến đêm Limousine VIP - Chạy thẳng Sài Gòn' },
];

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

function updateCancelledTabCount() {
  const cntEl = document.getElementById('cancelledTabCnt');
  if (cntEl) {
    cntEl.textContent = `(${cancelledSeats ? cancelledSeats.length : 0})`;
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
        <td width="50" style="text-align:center; font-weight:600; color:#6b7280;">${index + 1}</td>
        <td width="80"><b style="color:var(--red,#C20D08);">${item.code}</b></td>
        <td><b>${item.customerName || '—'}</b></td>
        <td>${item.phone || '—'}</td>
        <td>${routeStr}</td>
        <td style="font-weight:600;">${priceStr}</td>
        <td style="color:#ef4444; font-weight:500;">${reasonText}</td>
        <td style="color:#6b7280; font-size:13px;">${timeText}</td>
      </tr>`;
  }).join('');
}

function togglePaxFilter() {
  document.getElementById('paxFilterDropdown').classList.toggle('open');
}
document.addEventListener('click', function (e) {
  const wrap = document.querySelector('.pax-filter-wrap');
  if (wrap && !wrap.contains(e.target)) document.getElementById('paxFilterDropdown').classList.remove('open');
});
function clearPaxFilter() {
  document.querySelectorAll('.pax-filter-opt input').forEach(cb => cb.checked = false);
  renderPassengerList();
}

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
      tbody.innerHTML = '<tr class="pax-empty-row"><td colspan="10">Không có hành khách phù hợp bộ lọc</td></tr>';
    } else {
      tbody.innerHTML = groups.map((g, index) => {
        const s = g.main;
        const count = g.members.length;
        const codesStr = g.members.map(m => m.code).join(', ');
        const isFree = s.state === 'free';
        const payCellClass = isFree ? 'free' : (s.paid ? 'paid' : 'debt');
        const payCellText = isFree ? 'Miễn phí' : (s.price * count).toLocaleString('vi-VN') + 'đ';
        const { firstStopHtml, lastStopHtml } = getHistoryStopsDisplay(s);

        return `
        <tr onclick="fillSearchInputWithPhone('${s.phone}')" style="cursor:pointer;">
          <td class="mono">${index + 1}</td>
          <td>${s.customerName || '—'}</td>
          <td class="mono">${s.phone}</td>
          <td>${firstStopHtml}</td>
          <td>${lastStopHtml}</td>
          <td class="mono">${count}</td>
          <td class="mono">${codesStr}</td>
          <td class="pax-pay-cell ${payCellClass}"><div class="pax-pay-amount">${payCellText}</div></td>
          <td class="pax-luggage-cell"><span class="pax-luggage-mark ${s.hasLuggage ? 'yes' : 'no'}">${s.hasLuggage ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : ''}</span></td>
          <td class="pax-note-cell">${s.note || '—'}</td>
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
        const driverName = item.driver || 'Trần Văn Hùng (TC-01)';
        const pickupLoc = item.pickupAddress || item.transship || item.transshipStation || item.firstStop || '—';
        const seatCodes = g.members ? g.members.map(s => s.code).join(', ') : (item.code || '—');
        const seatCount = g.members ? g.members.length : 1;
        const phone = item.phone || '—';
        const totalPrice = item.price ? (item.price * seatCount).toLocaleString('vi-VN') + 'đ' : '—';
        const note = item.note || '—';
        const statusBadge = item.paid ? '<span class="ts-status-badge ongoing">Đang đón</span>' : '<span class="ts-status-badge pending">Chờ đón</span>';

        return `
          <tr>
            <td>${idx + 1}</td>
            <td><b>${driverName}</b></td>
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
        const note = item.note || '—';
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

function shortenStopName(name) {
  if (!name || name === '—') return '—';
  return name
    .replace('Trạm ', '')
    .replace('Bến xe ', 'BX ')
    .replace('Văn phòng ', 'VP ');
}

function seatCard(seat) {
  if (seat.state === 'hidden') {
    return `<div class="seat-card hidden-placeholder"></div>`;
  }
  const stateClass = seat.locked ? "locked" : seat.state;
  const lockHtml = seat.locked ? `<div class="lock-tag"><svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>${seat.lockedBy || 'Đang giữ'}</div>` : "";
  const isEmpty = seat.state === "empty";
  const isCancelable = ["sold", "hold", "free", "cargo"].includes(seat.state);
  const footLabel = isEmpty ? "ĐẶT VÉ" : "KDV - CHÂU ĐỐC";
  const cancelTag = isCancelable
    ? `<button type="button" class="seat-cancel-tag" onclick="event.stopPropagation(); openCancelModal('${seat.code}')">Hủy</button>`
    : "";
  const priceHtml = isEmpty ? `<div class="seat-price-tag"></div>` : (seat.state === 'free' ? `<div class="seat-price-tag">Miễn phí</div>` : `<div class="seat-price-tag">${seat.price.toLocaleString('vi-VN')}đ</div>`);
  const footBtnClick = isEmpty
    ? `event.stopPropagation(); openBookingPanel([findSeat('${seat.code}')])`
    : `event.stopPropagation(); openBookingPanel([findSeat('${seat.code}')], { mode: 'edit' });`;

  // Group booking badge logic
  let groupLabelHtml = "";
  if (!isEmpty && seat.ticketNo) {
    const allSeats = [...seatPlanDown, ...seatPlanUp];
    const groupSeats = allSeats.filter(s => s.ticketNo && s.ticketNo === seat.ticketNo);
    if (groupSeats.length > 1) {
      groupSeats.sort((a, b) => a.code.localeCompare(b.code));
      const groupName = groupSeats.map(s => s.code).join('-');
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
      <div class="seat-line" style="color:var(--text-sub);"><span class="seat-label-full">Khách hàng: </span><span class="seat-label-short">KH: </span>—</div>
      <div class="seat-line" style="color:var(--text-sub);"><span class="seat-label-full">Số điện thoại: </span><span class="seat-label-short">SĐT: </span>—</div>
      <div class="seat-note" title="${seat.note || ''}"><span class="seat-label-full">Ghi chú: </span><span class="seat-label-short">GC: </span>${seat.note || '—'}</div>
    `;
  } else {
    linesHtml = `
      ${groupLabelHtml}
      <div class="seat-line route-single-line"><span class="seat-label-full">Chặng đi: </span><span class="seat-stop" title="${routeStr}">${routeStr}</span></div>
      <div class="route-split-line">
        <div class="route-split-row"><span class="route-split-label">Đi:</span><span class="seat-stop" title="${firstStopShort}">${firstStopShort}</span></div>
        <div class="route-split-row"><span class="route-split-label">Đến:</span><span class="seat-stop" title="${lastStopShort}">${lastStopShort}</span></div>
      </div>
      <div class="seat-line" style="color:var(--text-main); font-weight:700;"><span class="seat-label-full">Khách hàng: </span><span class="seat-label-short">KH: </span>${seat.customerName || '—'}</div>
      <div class="seat-line" style="color:var(--text-main); font-weight:700;"><span class="seat-label-full">Số điện thoại: </span><span class="seat-label-short">SĐT: </span>${seat.phone || '—'}</div>
      <div class="seat-note" title="${seat.note || ''}"><span class="seat-label-full">Ghi chú: </span><span class="seat-label-short">GC: </span>${seat.note || '—'}</div>
    `;
  }

  return `
  <div class="seat-card ${stateClass}" data-code="${seat.code}" onclick="onSeatClick(event,'${seat.code}')">
    ${lockHtml}
    <div class="seat-top">
      <div>
        <div class="seat-code" style="display:inline-block; vertical-align:middle;">${seat.code}</div>
      </div>
      <div class="seat-top-right">${priceHtml}${cancelTag}</div>
    </div>
    ${linesHtml}
    <button class="seat-footbtn" type="button" onclick="${footBtnClick}"><span class="foot-text-normal">${footLabel}</span><span class="foot-text-hover">CHỈNH SỬA</span></button>
  </div>`;
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
    <div class="seat-footbtn cancelled">
      <span>GHẾ ĐÃ HỦY</span>
    </div>
  </div>`;
}

function renderCancelledSeats() {
  const section = document.getElementById('cancelledSeatsSection');
  const list = document.getElementById('cancelledSeatsList');
  if (!section || !list) return;

  if (!cancelledSeats || cancelledSeats.length === 0) {
    section.style.display = 'none';
    list.innerHTML = '';
    return;
  }
  section.style.display = '';

  const totalSeats = [...seatPlanDown, ...seatPlanUp].filter(s => s.state !== 'hidden').length;
  const useThreeCols = totalSeats >= 34;
  list.classList.toggle('cols-3', useThreeCols);

  list.innerHTML = cancelledSeats.map(cancelledSeatCard).join('');
}

function renderSeats() {
  const totalSeats = [...seatPlanDown, ...seatPlanUp].filter(s => s.state !== 'hidden').length;
  const useThreeCols = totalSeats >= 34;

  const floorDownEl = document.getElementById('floorDown');
  const floorUpEl = document.getElementById('floorUp');

  if (floorDownEl) {
    floorDownEl.classList.toggle('cols-3', useThreeCols);
    floorDownEl.innerHTML = seatPlanDown.map(seatCard).join('');
  }
  if (floorUpEl) {
    floorUpEl.classList.toggle('cols-3', useThreeCols);
    floorUpEl.innerHTML = seatPlanUp.map(seatCard).join('');
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

function abbrRouteName(route) {
  return route || '';
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

    return `
      <div class="trip-card ${selected}" data-trip="${t.id}" onclick="selectTrip(this,'${t.time}','${t.route}')">
        <div>
          <div class="trip-time-row">
            <span class="trip-time">${t.time}</span>
            <span class="trip-plate-inline">${plate}</span>
          </div>
          <div class="trip-sub">${abbrRouteName(t.route)} • ${vehicleType}</div>
        </div>
        <div class="trip-nums">
          <div class="n1">${bookedSeats}/${totalSeats + subSeatsCount}</div>
        </div>
      </div>
    `;
  };

  sgcdWrap.innerHTML = sgcdTripsMeta.map(mapTrip).join('');
  cdsgWrap.innerHTML = cdsgTripsMeta.map(mapTrip).join('');
}

/* ===================== GHẾ PHỤ (chỉ ghi chú + giá tiền) ===================== */
function subSeatCard(seat) {
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

function subSeatAddTile() {
  return `
  <div class="seat-card sub-add" onclick="openSubSeatModal()">
    <span class="sub-add-plus">+</span>
  </div>`;
}

function renderSubSeats() {
  const section = document.getElementById('subSeatsSection');
  const list = document.getElementById('subSeatsList');
  if (!section || !list) return;

  const totalSeats = [...seatPlanDown, ...seatPlanUp].filter(s => s.state !== 'hidden').length;
  const useThreeCols = totalSeats >= 34;
  list.classList.toggle('cols-3', useThreeCols);

  list.innerHTML = subSeats.map(subSeatCard).join('') + subSeatAddTile();
}

let editingSubSeatCode = null;

function nextSubSeatCode() {
  let max = 0;
  subSeats.forEach(s => {
    const m = /^S(\d+)$/.exec(s.code);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  });
  return 'S' + (max + 1);
}

const DEFAULT_SUB_SEAT_PRICE = 280000;

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

function deleteSubSeat(code) {
  subSeats = subSeats.filter(s => s.code !== code);
  if (tripSeatBank[currentTripId]) tripSeatBank[currentTripId].subSeats = subSeats;
  saveSeatBank();
  renderSubSeats();
  updateTripStats();
  updatePassengerTabCount();
  showToast('Đã xóa ghế phụ');
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

function toggleZone1() {
  setZone1Collapsed(!document.body.classList.contains('zone1-collapsed'));
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

function findSeat(code) {
  return seatPlanDown.find(s => s.code === code) || seatPlanUp.find(s => s.code === code) || extraLeftoverSeats.find(s => s.code === code);
}

function updateTransferBarVisibility() {
  const sticky = document.querySelector('.sticky-actions');
  if (!sticky) return;
  const paxSection = document.getElementById('zone3Passengers');
  const isSeatMapVisible = !paxSection || paxSection.style.display === 'none';
  const shouldShow = multiSelectMode && isSeatMapVisible;
  sticky.style.display = shouldShow ? 'flex' : 'none';
  const seatSection = document.querySelector('.zone3:not(.passenger-view)');
  if (seatSection) seatSection.classList.toggle('has-sticky-actions', shouldShow);
}

function updateTransferHint() {
  const bookedText = selectedSourceSeats.length ? `Đã chọn ghế đã đặt: ${selectedSourceSeats.join(', ')}` : '';
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
  updateTransferBarVisibility();
}

function findSeatInTrip(tripId, code) {
  const bank = tripSeatBank[tripId];
  if (!bank) return null;
  return bank.down.find(s => s.code === code) || bank.up.find(s => s.code === code);
}

function exitMultiSelectMode() {
  multiSelectMode = false;
  selectionMode = null;
  selectedSourceSeats = [];
  selectedTargetSeats = [];
  transferSourceTripId = null;
  transferTargetTripId = null;
  document.querySelectorAll('.seat-card').forEach(c => {
    c.style.outline = 'none';
    c.style.boxShadow = 'none';
  });
  document.getElementById('stickyHint').textContent = '';
  updateTransferBarVisibility();
}

function cancelTransferSelection() {
  exitMultiSelectMode();
  showToast('Đã hủy thao tác chuyển ghế');
}

const OCCUPIED_STATES = ['sold', 'hold', 'cargo', 'free'];

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
    const card = ev.currentTarget;
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
    const card = ev.currentTarget;
    card.style.outline = '2px solid var(--red)';
    card.style.outlineOffset = '1px';
    card.style.boxShadow = 'none';
    updateTransferHint();
    showToast(`Đã kích hoạt đặt vé nhóm từ ghế ${seat.code}`);
    ev.stopPropagation();
    return;
  }

  if (multiSelectMode) {
    const card = ev.currentTarget;
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
function openSeatMenu(ev, seat) {
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
document.addEventListener('click', (e) => {
  if (!e.target.closest('#seatMenu') && !e.target.closest('.seat-card')) closeSeatMenu();
});
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

function confirmSelectionAction() {
  if (selectedSourceSeats.length > 0) {
    confirmTransfer();
    return;
  }
  openGroupBookingFromSelection();
}

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
    targetSeat.guestType = sourceSeat.guestType;
    targetSeat.transshipStation = sourceSeat.transshipStation;
    targetSeat.arrivalTransfer = sourceSeat.arrivalTransfer;
    clearSeatToEmpty(sourceSeat);
  }

  renderSeats();
  if (document.getElementById('zone3Passengers').style.display !== 'none') renderPassengerList();
  exitMultiSelectMode();
  showToast(`Đã chuyển ${pairCount} ghế thành công`);
}

/* ---- Modal hủy vé (BR-01) ---- */
function openCancelModal(code) {
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
    note: seat.note || ''
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
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

/* ---- Zone 4: Panel đặt vé ---- */
function openBookingPanel(seats, options = {}) {
  const mode = options.mode || 'booking';
  currentPanelMode = mode;
  currentPanelSeats = seats.slice();
  currentPanelSeat = seats[0];
  currentEditSeatCode = mode === 'edit' ? seats[0].code : null;
  const seat = seats[0];
  document.getElementById('panelSeatCode').textContent = seats.map(s => s.code).join(', ');
  document.getElementById('panelTitleMode').textContent = mode === 'edit' ? 'Sửa thông tin ghế' : 'Đặt vé';
  document.getElementById('t_seat').textContent = seat.code;
  document.getElementById('t_price').textContent = seat.price.toLocaleString('vi-VN') + 'đ';
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
    phoneEl.value = seat.phone || '';
    nameEl.value = seat.customerName || '';
    noteEl.value = seat.note || '';
    typeEl.value = seat.guestType || 'Khách trạm';
    destinationEl.value = seat.lastStop || '';
    if (transshipEl) transshipEl.value = (seat.guestType === 'Trung chuyển' || seat.guestType === 'Rước liền') ? seat.transshipStation || '' : '';
    if (transshipSelectEl) transshipSelectEl.value = seat.guestType === 'Rước đường' ? seat.transshipStation || '' : '';
    if (arrivalTransferEl) arrivalTransferEl.value = seat.arrivalTransfer || '';
    if (luggageEl) luggageEl.checked = !!seat.hasLuggage;
    onGuestTypeChange();
    setStationValue(seat.firstStop || DEFAULT_STAFF_STATION);
  } else {
    phoneEl.value = '';
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

/* Trạm đi và địa điểm rước thay đổi theo loại khách:
   - Khách trạm: dropdown chọn trạm đi, mặc định là trạm của nhân viên đang thao tác
     nhưng vẫn có thể chọn trạm đi khác trong danh sách.
   - Trung chuyển / Rước liền: có thêm ô nhập địa chỉ trung chuyển/rước liền.
   - Rước đường: trạm đi vẫn là dropdown, còn địa điểm rước là dropdown danh sách điểm rước. */
function getStationValue() {
  return document.getElementById('f_station_select').value;
}
function setStationValue(val) {
  const selectEl = document.getElementById('f_station_select');
  const hasOption = Array.from(selectEl.options).some(o => o.value === val);
  if (hasOption) selectEl.value = val;
}
function onGuestTypeChange() {
  const type = document.getElementById('f_type').value;
  const stationLabel = document.getElementById('f_station_label');
  const selectEl = document.getElementById('f_station_select');
  const inputEl = document.getElementById('f_station_input');
  const transshipWrap = document.getElementById('f_transship_wrap');
  const transshipLabel = document.getElementById('f_transship_label');
  const transshipSelect = document.getElementById('f_transship_select');
  const transshipInput = document.getElementById('f_transship');
  const stationRow = document.getElementById('f_station_row');

  const isTransshipLike = (type === 'Trung chuyển' || type === 'Rước liền');
  if (type === 'Rước đường') {
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
    transshipInput.style.display = isTransshipLike ? 'block' : 'none';
    transshipLabel.textContent = isTransshipLike ? (type === 'Rước liền' ? 'Rước liền đi' : 'Trung chuyển đi') : 'Địa điểm rước';
    transshipInput.placeholder = isTransshipLike ? (type === 'Rước liền' ? 'Nhập địa chỉ rước liền...' : 'Nơi trung chuyển...') : 'Nhập địa điểm rước...';
    transshipWrap.style.display = isTransshipLike ? 'flex' : 'none';
  }
  stationRow.style.setProperty('--cols', transshipWrap.style.display === 'none' ? 1 : 2);
  refreshTicket();
}

function refreshTicket() {
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

  if (type === 'Trung chuyển' && transshipVal) {
    transshipLabel.textContent = 'Trạm trung chuyển';
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

  document.getElementById('t_luggage_row').style.display = document.getElementById('f_luggage').checked ? 'flex' : 'none';
}
function onPriceEdit() {
  const el = document.getElementById('t_price');
  const num = parseInt(el.textContent.replace(/[^0-9]/g, '')) || 0;
  el.textContent = num.toLocaleString('vi-VN') + 'đ';
}
function syncRuocLienToPickupList(seats) {
  const HN_PICKUP_PAX_KEY = 'hn_pickup_passengers_v6';
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
  const paxObj = {
    id: existingIdx > -1 ? paxList[existingIdx].id : Date.now(),
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
    isRuocLien: true
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

function saveTicket() {
  const type = document.getElementById('f_type').value;

  if (type === 'Trung chuyển' && !document.getElementById('f_transship').value.trim()) {
    showToast('Vui lòng nhập trạm trung chuyển');
    return;
  }
  if (type === 'Rước liền' && !document.getElementById('f_transship').value.trim()) {
    showToast('Vui lòng nhập địa chỉ rước liền');
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

  const seatsTarget = currentPanelSeats.length ? currentPanelSeats : (currentPanelSeat ? [currentPanelSeat] : []);

  if (currentPanelMode === 'edit' && currentPanelSeat) {
    const seat = currentPanelSeat;
    applyFormToSeat(seat);
    if (type === 'Rước liền') syncRuocLienToPickupList([seat]);
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
      seat.state = seat.hasLuggage ? 'cargo' : 'hold';
    });
    if (type === 'Rước liền') syncRuocLienToPickupList(currentPanelSeats);
    renderSeats();
    if (document.getElementById('zone3Passengers').style.display !== 'none') renderPassengerList();
  }
  closePanel();
  showToast(currentPanelSeats.length > 1 ? 'Đã đặt vé nhóm thành công' : 'Đã đặt vé thành công');
  if (multiSelectMode) toggleMultiSelect();
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
  document.getElementById('pickupPreviewPhone').textContent = document.getElementById('pickupPhone').value.trim() || '—';
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
  const phone = document.getElementById('pickupPhone').value.trim();
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

  const HN_PICKUP_PAX_KEY = 'hn_pickup_passengers_v6';
  const defaults = [
    { id: 1, name: 'Nguyễn Thị Hồng', phone: '0909123456', ticketCount: 1, fromStation: 'Trạm Kinh Dương Vương', toStation: 'Trạm Châu Đốc', fromTransfer: '12 Kinh Dương Vương, Q.Bình Tân', toTransfer: 'Ngã 3 Vĩnh Xương, Châu Đốc', note: 'Khách lớn tuổi, cần hỗ trợ lên xuống xe', luggage: true, assigned: null, guestType: 'Rước liền', isRuocLien: true },
    { id: 2, name: 'Trần Văn Bình', phone: '0918234567', ticketCount: 1, fromStation: 'Trạm An Sương', toStation: 'Trạm Long Xuyên', fromTransfer: '45 Trường Chinh, Q.12', toTransfer: 'Công viên Long Xuyên', note: '', luggage: false, assigned: { tripId: '1', seat: 'A12' }, guestType: 'Rước liền', isRuocLien: true },
    { id: 3, name: 'Lê Thị Mai', phone: '0933345678', ticketCount: 2, fromStation: 'Trạm Q.5', toStation: 'Trạm Tân Châu', fromTransfer: '88 Nguyễn Trãi, Q.5', toTransfer: 'Bến phà Tân Châu', note: 'Đi cùng 1 trẻ nhỏ', luggage: true, assigned: null, guestType: 'Rước liền', isRuocLien: true },
    { id: 4, name: 'Phạm Quốc Huy', phone: '0944456789', ticketCount: 1, fromStation: 'Văn phòng trung tâm', toStation: 'Bến xe Châu Đốc', fromTransfer: '120 Lê Hồng Phong, Q.10', toTransfer: 'Bến xe Châu Đốc', note: '', luggage: false, assigned: null, guestType: 'Rước liền', isRuocLien: true },
    { id: 5, name: 'Võ Thị Kim Ngân', phone: '0977567890', ticketCount: 2, fromStation: 'Trạm Kinh Dương Vương', toStation: 'Trạm Cần Thơ', fromTransfer: '5 Hồ Học Lãm, Bình Tân', toTransfer: 'Bến Ninh Kiều, Cần Thơ', note: 'Gọi trước 15 phút khi xe tới', luggage: true, assigned: null, guestType: 'Rước liền', isRuocLien: true }
  ];

  let paxList = [];
  const keysToTry = ['hn_pickup_passengers_v6', 'hn_pickup_passengers_v5', 'hn_pickup_passengers_v4'];
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
function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toastText').textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

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
function toggleSearchResults(force) {
  const el = document.getElementById('searchResults');
  if (force === true) { el.classList.add('open'); return; }
  el.classList.toggle('open');
}
document.getElementById('searchInput').addEventListener('focus', () => {
  if (typeof currentView !== 'undefined' && currentView === 'phoi') return;
  toggleSearchResults(true);
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-wrap')) document.getElementById('searchResults').classList.remove('open');
  if (!e.target.closest('#directionDropdown') && !e.target.closest('#directionTrigger')) document.getElementById('directionDropdown').classList.remove('open');
  if (!e.target.closest('#routeDropdown') && !e.target.closest('#routeTrigger')) document.getElementById('routeDropdown').classList.remove('open');
});
function pickSearchResult() {
  document.getElementById('searchResults').classList.remove('open');
  showToast('Đã điều hướng đến đúng phơi xe và ghế của khách');
}

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

  // Đang chuyển ghế và đã chọn ghế nguồn: cho phép bấm sang chuyến khác để chọn ghế trống làm đích,
  // không làm mất lựa chọn ghế nguồn đã chọn trước đó (không cần thêm nút nào).
  if (multiSelectMode && selectionMode === 'transfer' && selectedSourceSeats.length) {
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
function toggleDirectionDropdown(e) {
  e.stopPropagation();
  document.getElementById('directionDropdown').classList.toggle('open');
  document.getElementById('routeDropdown').classList.remove('open');
}
function toggleRouteDropdown(e) {
  e.stopPropagation();
  renderRouteOptions();
  document.getElementById('routeDropdown').classList.toggle('open');
  document.getElementById('directionDropdown').classList.remove('open');
}
function toggleDirection(dir) {
  if (!directionLabels[dir]) return;
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
function selectRoute(route) {
  const routeItem = routeOptions[selectedDirection].find(item => item.id === route);
  if (!routeItem) return;
  selectedRoute = route;
  document.getElementById('routeValue').textContent = routeItem.label;
  document.querySelectorAll('#routeDropdown .dropdown-item').forEach(item => {
    item.classList.toggle('active', item.dataset.route === route);
  });
  document.getElementById('routeDropdown').classList.remove('open');
  showToast('Chọn tuyến: ' + routeItem.label);
}
function renderRouteOptions() {
  const container = document.getElementById('routeDropdown');
  const routes = routeOptions[selectedDirection];
  container.innerHTML = routes.map(route => `
    <div class="dropdown-item ${route.id === selectedRoute ? 'active' : ''}" data-route="${route.id}" onclick="selectRoute('${route.id}')">
      <span>${route.label}</span>
      <span class="dropdown-item-check">✓</span>
    </div>
  `).join('');
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
    html += `<div class="cal-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" onclick="pickDate(${y},${m},${d})">${d}<span class="lunar">${lunar}/6</span></div>`;
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
function toggleCalendar(force) {
  calendarOpen = typeof force === 'boolean' ? force : !calendarOpen;
  document.getElementById('calendarPanel').classList.toggle('open', calendarOpen);
  document.getElementById('calTrigger').classList.toggle('open', calendarOpen);
}
document.addEventListener('click', (e) => {
  if (calendarOpen && !e.target.closest('.calendar') && !e.target.closest('#calTrigger')) {
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

function updateTsUI() {
  const leftPct = (tsStartHour / 24) * 100;
  const rightPct = ((tsStartHour + TS_WINDOW_HOURS) / 24) * 100;
  tsRange.style.left = leftPct + '%';
  tsRange.style.width = (rightPct - leftPct) + '%';
  document.getElementById('tsCurrent').textContent =
    String(tsStartHour).padStart(2, '0') + ':00 – ' + String(tsStartHour + TS_WINDOW_HOURS).padStart(2, '0') + ':00';
}
updateTsUI();

tsTrack.addEventListener('click', (e) => {
  const rect = tsTrack.getBoundingClientRect();
  let pct = ((e.clientX - rect.left) / rect.width) * 100;
  pct = Math.max(0, Math.min(100, pct));
  let hour = Math.round((pct / 100) * 24);
  hour = Math.max(0, Math.min(24 - TS_WINDOW_HOURS, hour));
  tsStartHour = hour;
  updateTsUI();
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
    sessionStorage.removeItem('hn_current_user');
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
  const tabBooking = document.getElementById('tabBooking');
  const tabPhoi = document.getElementById('tabPhoi');
  const ruocLienBtn = document.getElementById('ruocLienBtn');
  const searchInput = document.getElementById('searchInput');

  // Clear search input on switch
  searchInput.value = '';

  if (viewName === 'booking') {
    bookingView.style.display = 'flex';
    phoiView.style.display = 'none';
    tabBooking.classList.add('active');
    tabPhoi.classList.remove('active');
    if (ruocLienBtn) ruocLienBtn.style.display = 'inline-flex';

    // Restore original placeholder
    searchInput.placeholder = 'Tìm kiếm theo SĐT, Mã vé, Tên hành khách...';
  } else if (viewName === 'phoi') {
    bookingView.style.display = 'none';
    phoiView.style.display = 'flex';
    tabBooking.classList.remove('active');
    tabPhoi.classList.add('active');
    if (ruocLienBtn) ruocLienBtn.style.display = 'none';

    // Change placeholder to Phơi xe
    if (searchInput) searchInput.placeholder = 'Tìm kiếm phơi xe...';

    if (!Array.isArray(allTripsMeta) || allTripsMeta.length === 0) {
      allTripsMeta = loadAllTrips();
    }
    allTripsMeta.forEach(t => { t.date = todayStr; });

    applyFilters();
  }
}

// Intercept search input focus and search event
document.getElementById('searchInput').addEventListener('input', () => {
  if (currentView === 'phoi') {
    applyFilters();
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
      <td>${emptyCount}/${totalCount}</td>
      <td>${(t.price || 280000).toLocaleString('vi-VN')}đ</td>
      <td><span class="badge ${statusClass}">${label}</span></td>
      <td class="actions-cell">
        <button class="dots-btn" onclick="event.stopPropagation(); showContextMenu(event, '${t.id}')">...</button>
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

  if (id) {
    const tripIdx = allTripsMeta.findIndex(t => t.id === id);
    if (tripIdx !== -1) {
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
        if (!confirmed) return;
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
    }
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
        <button type="button" onclick="removeBulkTime('${t}')">&times;</button>
      </span>
    `;
  });
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

  const fromDate = new Date(fromDateStr);
  const toDate = new Date(toDateStr);
  if (toDate < fromDate) {
    alert("Ngày kết thúc không được nhỏ hơn ngày bắt đầu.");
    return;
  }

  const validDates = [];
  let current = new Date(fromDate);
  while (current <= toDate) {
    const dayOfWeek = current.getDay();
    if (weekdays.includes(dayOfWeek)) {
      validDates.push(current.toISOString().split("T")[0]);
    }
    current.setDate(current.getDate() + 1);
  }

  const totalExpected = validDates.length * bulkTimes.length;
  if (totalExpected === 0) {
    alert("Không tìm thấy ngày nào trùng khớp với cấu hình lặp lại trong khoảng thời gian đã chọn.");
    return;
  }

  const confirmed = confirm(`Hệ thống sẽ tạo khoảng ${totalExpected} phơi xe. Xác nhận tạo?`);
  if (!confirmed) return;

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

function normalizeSearchText(str) {
  return (str || '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim();
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

  const rawResults = [];
  Object.keys(tripSeatBank).forEach(tripId => {
    const bank = tripSeatBank[tripId];
    const tripMeta = allTripsMeta.find(t => t.id === tripId);
    if (!bank || !tripMeta) return;

    [...(bank.down || []), ...(bank.up || []), ...(bank.subSeats || [])].forEach(seat => {
      if (['sold', 'hold', 'free', 'cargo'].includes(seat.state) && isMatch(seat.phone, seat.customerName, seat.ticketNo)) {
        rawResults.push({
          date: tripMeta.date || todayStr,
          phone: seat.phone,
          name: seat.customerName,
          guestType: seat.guestType || 'Khách trạm',
          transship: seat.transshipStation || seat.transship || '',
          pickupAddress: seat.pickupAddress || '',
          dropoffAddress: seat.dropoffAddress || '',
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
          isToday: true,
          tripId
        });
      }
    });
  });

  CUSTOMER_HISTORY_DATA.forEach(h => {
    if (isMatch(h.phone, h.name, h.ticketNo)) rawResults.push({ ...h, isToday: false });
  });

  return groupHistoryResults(rawResults).sort((a, b) => b.date.localeCompare(a.date));
}

function onRebookGuestTypeChange() {
  const type = document.getElementById('rbGuestType')?.value || 'Khách trạm';
  const stationLabel = document.getElementById('rbStationLabel');
  const transshipWrap = document.getElementById('rbTransshipWrap');
  const transshipLabel = document.getElementById('rbTransshipLabel');
  const transshipSelect = document.getElementById('rbTransshipSelect');
  const transshipInput = document.getElementById('rbTransshipInput');
  const stationRow = document.getElementById('rbStationRow');

  const isTransshipLike = (type === 'Trung chuyển' || type === 'Rước liền');
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
      transshipInput.placeholder = isTransshipLike ? (type === 'Rước liền' ? 'Nhập địa chỉ rước liền...' : 'Nơi trung chuyển...') : 'Nhập địa điểm rước...';
    }
    if (transshipLabel) transshipLabel.textContent = isTransshipLike ? (type === 'Rước liền' ? 'Rước liền đi' : 'Trung chuyển đi') : 'Địa điểm rước';
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
    showToast('Không tìm thấy lịch sử đặt vé phù hợp với: ' + phone, 'error');
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

  renderHistoryTable(results);

  const rightCol = document.querySelector('.right-col');
  if (rightCol) {
    ['.zone2', '.tabs', '.sticky-actions'].forEach(sel => {
      const el = rightCol.querySelector(sel);
      if (el) el.style.display = 'none';
    });
    rightCol.querySelectorAll('.zone3').forEach(el => el.style.display = 'none');
  }

  const chView = document.getElementById('customerHistoryView');
  if (chView) chView.style.display = 'flex';
  const sr = document.getElementById('searchResults');
  if (sr) sr.classList.remove('open');
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

function goToTripFromHistory(e, idx, pushHistory = true) {
  if (e) e.stopPropagation();
  const list = window._historyResults || _historyResults || [];
  const r = list[idx];
  if (!r) return;

  const prevPhone = currentSearchPhone || r.phone;
  closeCustomerHistory();

  if (typeof currentView !== 'undefined' && currentView !== 'booking' && typeof switchView === 'function') {
    switchView('booking');
  }

  let targetTripId = r.tripId || allTripsMeta?.find(t => t.route === r.route && (t.time === r.time || !r.time))?.id;
  if (!targetTripId || !tripSeatBank[targetTripId]) {
    showToast(`Chuyến "${r.route} (${r.time})" đã quá cũ, không còn phơi xe để hiển thị`, 'warning');
    return;
  }

  if (pushHistory) {
    try { history.pushState({ view: 'trip', tripId: targetTripId, phone: prevPhone }, '', '#trip-' + targetTripId); } catch (err) { }
  }

  const targetDir = r.route?.trim().startsWith('Châu Đốc') ? 'cd-sg' : 'sg-cd';
  if (typeof selectedDirection !== 'undefined' && selectedDirection !== targetDir && directionLabels?.[targetDir]) {
    selectedDirection = targetDir;
    selectedRoute = 'all';
    const dVal = document.getElementById('directionValue');
    if (dVal) dVal.textContent = directionLabels[targetDir];
    const rVal = document.getElementById('routeValue');
    if (rVal) rVal.textContent = 'Tất cả tuyến';
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
  showToast(`Đã chuyển sang phơi chuyến: ${r.route} (${r.time})`);
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
  } else if (type === 'Trung chuyển') {
    if (pickupLoc) firstStopHtml = `${r.firstStop || 'Trạm đi'}<div class="ch-sub-address" style="font-size:12px;color:var(--text-sub);margin-top:2px;">Đón: ${pickupLoc}</div>`;
    if (dropLoc) lastStopHtml = `${r.lastStop || 'Trạm đến'}<div class="ch-sub-address" style="font-size:12px;color:var(--text-sub);margin-top:2px;">TC: ${dropLoc}</div>`;
  } else if (dropLoc) {
    lastStopHtml = `${r.lastStop || 'Trạm đến'}<div class="ch-sub-address" style="font-size:12px;color:var(--text-sub);margin-top:2px;">${dropLoc}</div>`;
  }

  return { firstStopHtml, lastStopHtml };
}

function getColValueForFilter(r, colKey) {
  if (!r) return '';
  switch (colKey) {
    case 'date': return formatHistoryDate(r.date);
    case 'route': return r.route || '';
    case 'time': return r.time || '';
    case 'phone': return r.phone || currentSearchPhone || '';
    case 'seat': return r.seat || '';
    case 'firstStop': case 'lastStop': {
      const div = document.createElement('div');
      div.innerHTML = colKey === 'firstStop' ? getHistoryStopsDisplay(r).firstStopHtml : getHistoryStopsDisplay(r).lastStopHtml;
      return div.textContent.trim() || '—';
    }
    case 'staff': {
      const book = getStaffCode(r.bookStaff || r.staff) || 'NV01';
      const sell = r.sellStaff ? (getStaffCode(r.sellStaff) || r.sellStaff) : (r.paid ? 'NV05' : '—');
      return `Đặt: ${book} | Bán: ${sell}`;
    }
    default: return String(r[colKey] || '');
  }
}

function getFilteredHistoryResults() {
  if (!_rawHistoryResults?.length) return [];
  return _rawHistoryResults.filter(r => {
    for (const colKey in historyColumnFilters) {
      const allowedSet = historyColumnFilters[colKey];
      if (allowedSet instanceof Set && !allowedSet.has(getColValueForFilter(r, colKey))) return false;
    }
    return true;
  });
}

function toggleHistoryColumnFilter(event, colKey) {
  if (event) event.stopPropagation();
  let popover = document.getElementById('chExcelFilterPopover');
  if (!popover) {
    popover = document.createElement('div');
    popover.id = 'chExcelFilterPopover';
    popover.className = 'ch-excel-filter-popover';
    document.body.appendChild(popover);
  }

  if (activePopoverColKey === colKey && popover.style.display !== 'none') {
    popover.style.display = 'none';
    activePopoverColKey = null;
    return;
  }
  activePopoverColKey = colKey;

  const allValues = Array.from(new Set((_rawHistoryResults || []).map(r => getColValueForFilter(r, colKey)))).sort();
  const currentSet = historyColumnFilters[colKey] ? new Set(historyColumnFilters[colKey]) : new Set(allValues);
  const allChecked = currentSet.size === allValues.length;

  let html = `<input type="text" class="ch-popover-search" placeholder="Tìm kiếm..." oninput="filterExcelDropdownItems(this.value)">`;
  html += `
    <label class="ch-popover-opt" style="font-weight:700;border-bottom:1px solid #f1f5f9;padding-bottom:6px;">
      <input type="checkbox" class="ch-select-all" ${allChecked ? 'checked' : ''} onchange="toggleExcelSelectAll(this, '${colKey}')">
      <span>(Chọn tất cả)</span>
    </label>
    <div class="ch-popover-list" id="chPopoverList">
  `;

  allValues.forEach(val => {
    const isChecked = currentSet.has(val);
    const escVal = escapeHtml(val);
    html += `
      <label class="ch-popover-opt ch-popover-item">
        <input type="checkbox" value="${escVal}" ${isChecked ? 'checked' : ''} onchange="updateExcelSelectAllState('${colKey}')">
        <span>${escVal}</span>
      </label>
    `;
  });

  html += `</div>
    <div class="ch-popover-actions">
      <button type="button" class="ch-popover-btn clear" onclick="clearHistoryColumnFilter('${colKey}')">Bỏ lọc</button>
      <button type="button" class="ch-popover-btn apply" onclick="applyHistoryColumnFilter('${colKey}')">Áp dụng</button>
    </div>
  `;

  popover.innerHTML = html;

  const rect = event.currentTarget.getBoundingClientRect();
  popover.style.display = 'block';
  const left = Math.max(10, (rect.left + 240 > window.innerWidth) ? (window.innerWidth - 250) : rect.left);
  popover.style.top = (rect.bottom + window.scrollY + 4) + 'px';
  popover.style.left = left + 'px';
}

function escapeHtml(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function filterExcelDropdownItems(query) {
  const q = query.toLowerCase().trim();
  document.querySelectorAll('#chPopoverList .ch-popover-item').forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(q) ? 'flex' : 'none';
  });
}

function toggleExcelSelectAll(selectAllCb, colKey) {
  const isChecked = selectAllCb.checked;
  document.querySelectorAll('#chPopoverList .ch-popover-item input[type="checkbox"]').forEach(cb => {
    if (cb.closest('.ch-popover-item').style.display !== 'none') cb.checked = isChecked;
  });
}

function updateExcelSelectAllState(colKey) {
  const checkboxes = Array.from(document.querySelectorAll('#chPopoverList .ch-popover-item input[type="checkbox"]'));
  const selectAllCb = document.querySelector('.ch-select-all');
  if (!selectAllCb) return;
  const visibleCbs = checkboxes.filter(cb => cb.closest('.ch-popover-item').style.display !== 'none');
  selectAllCb.checked = visibleCbs.length > 0 && visibleCbs.every(cb => cb.checked);
}

function applyHistoryColumnFilter(colKey) {
  const checkboxes = Array.from(document.querySelectorAll('#chPopoverList .ch-popover-item input[type="checkbox"]'));
  const selectedSet = new Set(checkboxes.filter(cb => cb.checked).map(cb => cb.value));
  const allValuesSet = new Set((_rawHistoryResults || []).map(r => getColValueForFilter(r, colKey)));

  if (selectedSet.size === allValuesSet.size) delete historyColumnFilters[colKey];
  else historyColumnFilters[colKey] = selectedSet;

  const popover = document.getElementById('chExcelFilterPopover');
  if (popover) popover.style.display = 'none';
  activePopoverColKey = null;

  renderHistoryTable(getFilteredHistoryResults());
}

function clearHistoryColumnFilter(colKey) {
  delete historyColumnFilters[colKey];
  const popover = document.getElementById('chExcelFilterPopover');
  if (popover) popover.style.display = 'none';
  activePopoverColKey = null;

  renderHistoryTable(getFilteredHistoryResults());
}

document.addEventListener('click', function (e) {
  const popover = document.getElementById('chExcelFilterPopover');
  if (popover && popover.style.display !== 'none') {
    if (!e.target.closest('#chExcelFilterPopover') && !e.target.closest('.ch-col-filter-btn')) {
      popover.style.display = 'none';
      activePopoverColKey = null;
    }
  }
});

function renderHistoryTable(results) {
  const body = document.getElementById('chBody');
  if (!body) return;
  if (!results?.length) {
    body.innerHTML = '<div class="ch-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg><span>Không tìm thấy lịch sử</span></div>';
    return;
  }
  _historyResults = results;
  window._historyResults = results;

  const cols = [
    { key: 'date', label: 'Ngày', filterable: true },
    { key: 'route', label: 'Chuyến', filterable: true },
    { key: 'time', label: 'Giờ', filterable: true },
    { key: 'phone', label: 'SDT', filterable: true },
    { key: 'seat', label: 'Ghế', filterable: true },
    { key: 'firstStop', label: 'Trạm đi', filterable: true },
    { key: 'lastStop', label: 'Trạm đến', filterable: true },
    { key: 'staff', label: 'Nhân viên', filterable: true },
    { key: 'price', label: 'Giá vé', filterable: false },
    { key: 'actions', label: 'Chức năng', filterable: false }
  ];

  const headers = cols.map(c => {
    if (!c.filterable) return `<th>${c.label}</th>`;
    const isFiltered = historyColumnFilters[c.key] !== undefined;
    return `
      <th class="ch-th-filterable">
        <div class="ch-th-content">
          <span>${c.label}</span>
          <button type="button" class="ch-col-filter-btn ${isFiltered ? 'active' : ''}" onclick="toggleHistoryColumnFilter(event, '${c.key}')" title="Lọc ${c.label}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          </button>
        </div>
      </th>`;
  }).join('');

  const rows = results.map((r, idx) => {
    const todayBadge = r.isToday ? ' <span class="ch-history-badge">Hôm nay</span>' : '';
    const dateFormatted = formatHistoryDate(r.date);
    const phoneDisplay = r.phone || currentSearchPhone || '';
    const { firstStopHtml, lastStopHtml } = getHistoryStopsDisplay(r);
    const bookStaffStr = getStaffCode(r.bookStaff || r.staff) || 'NV01';
    const sellStaffStr = r.sellStaff ? (getStaffCode(r.sellStaff) || r.sellStaff) : (r.paid ? 'NV05' : '—');
    const staffHtml = `<div class="ch-staff-cell"><div><span class="ch-staff-lbl">Đặt:</span> <span class="ch-staff-val">${bookStaffStr}</span></div><div><span class="ch-staff-lbl">Bán:</span> <span class="ch-staff-val sell ${sellStaffStr === '—' ? 'none' : ''}">${sellStaffStr}</span></div></div>`;

    return `
    <tr data-idx="${idx}" onclick="fillSearchInputWithPhone('${phoneDisplay}')" style="cursor:pointer;">
      <td class="ch-date">${dateFormatted}${todayBadge}</td>
      <td class="ch-route"><span class="ch-trip-link" onclick="goToTripFromHistory(event, ${idx})" title="Nhấp để chuyển sang phơi chuyến này">${r.route}</span></td>
      <td>${r.time}</td>
      <td>${phoneDisplay}</td>
      <td><span class="ch-seat-code">${r.seat}</span></td>
      <td>${firstStopHtml}</td>
      <td>${lastStopHtml}</td>
      <td>${staffHtml}</td>
      <td style="font-weight:700;">${r.price ? r.price.toLocaleString('vi-VN') + 'đ' : '—'}</td>
      <td><button type="button" class="ch-btn-rebook-row" onclick="event.stopPropagation(); openRebookFromHistory(${idx})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px;"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>Đặt lại</button></td>
    </tr>`;
  }).join('');

  body.innerHTML = `<table class="ch-history-table"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
}

function formatHistoryDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
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

function openRebookFromHistory(idx) {
  try {
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
    const pickupVal = r.transship || r.pickupAddress || '';
    const transshipInput = document.getElementById('rbTransshipInput');
    const transshipSelect = document.getElementById('rbTransshipSelect');
    if (guestType === 'Rước đường' && transshipSelect) setSelectOptionValue('rbTransshipSelect', pickupVal);
    if (transshipInput) transshipInput.value = pickupVal;

    setSelectOptionValue('rbLastStop', r.lastStop || 'Trạm Châu Đốc');
    const arrTransEl = document.getElementById('rbArrivalTransfer');
    if (arrTransEl) arrTransEl.value = r.arrivalTransfer || r.dropoffAddress || '';

    setVal('rbNote', r.note || '');
    const luggageEl = document.getElementById('rbLuggage');
    if (luggageEl) luggageEl.checked = !!r.hasLuggage;

    const subEl = document.getElementById('rbSubtitle');
    if (subEl) subEl.textContent = `Đặt lại từ vé cũ: ${r.route} (${r.time}) — Ghế ${r.seat}`;

    rebookSelectedSeats = [];
    rebookSelectedTripId = null;
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

function closeRebookModal() {
  const modal = document.getElementById('rebookModal');
  if (modal) {
    modal.classList.remove('open');
    modal.style.display = 'none';
    modal.style.setProperty('display', 'none', 'important');
  }
}

function renderRebookTripList() {
  const container = document.getElementById('rbTripList');
  if (!container) return;
  let html = '';
  (allTripsMeta || []).forEach(trip => {
    if (trip.status === 'Đã hủy') return;
    const bank = tripSeatBank?.[trip.id];
    let emptyCount = 0;
    if (bank) {
      [...(bank.down || []), ...(bank.up || [])].forEach(s => {
        if (s.state === 'empty' && !s.locked) emptyCount++;
      });
    }
    html += `
      <div class="ch-trip-card" data-trip="${trip.id}" onclick="selectRebookTrip('${trip.id}')">
        <div>
          <div class="ch-trip-time">${trip.time} — ${trip.route}</div>
          <div class="ch-trip-route">${trip.vehicleType} • ${trip.plate || 'Chưa chỉ định'}</div>
        </div>
        <div class="ch-trip-avail">${emptyCount} trống</div>
      </div>`;
  });
  container.innerHTML = html;
}

function selectRebookTrip(tripId) {
  rebookSelectedTripId = tripId;
  rebookSelectedSeats = [];
  document.querySelectorAll('.ch-trip-card').forEach(c => c.classList.remove('selected'));
  const card = document.querySelector(`.ch-trip-card[data-trip="${tripId}"]`);
  if (card) card.classList.add('selected');
  renderMiniSeatMap(tripId);
  updateRebookBtn();
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

function miniSeatHtml(seat, tripId) {
  if (seat.state === 'hidden') return '<div class="ch-mini-seat hidden-placeholder"></div>';
  const isAvailable = seat.state === 'empty' && !seat.locked;
  const stateClass = seat.locked ? 'locked' : seat.state;
  const selectedClass = rebookSelectedSeats.includes(seat.code) ? 'selected' : '';
  const clickHandler = isAvailable ? `onclick="toggleRebookSeat('${seat.code}','${tripId}')"` : '';
  return `<div class="ch-mini-seat ${stateClass} ${selectedClass}" ${clickHandler}>${seat.code}</div>`;
}

function toggleRebookSeat(code, tripId) {
  if (tripId !== rebookSelectedTripId) return;
  const idx = rebookSelectedSeats.indexOf(code);
  if (idx >= 0) rebookSelectedSeats.splice(idx, 1);
  else rebookSelectedSeats.push(code);
  renderMiniSeatMap(tripId);
  updateRebookBtn();
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

function renderLiveSearchResults(query) {
  const dropdown = document.getElementById('searchResults');
  if (!dropdown) return;
  if (!query || !query.trim().length) {
    dropdown.classList.remove('open');
    return;
  }
  const matches = searchCustomerByPhone(query);
  if (!matches.length) {
    dropdown.innerHTML = '<div class="search-result-row" style="color:var(--text-sub);justify-content:center;padding:12px;">Không tìm thấy lịch sử phù hợp</div>';
  } else {
    const customerMap = new Map();
    matches.forEach(m => {
      const key = `${m.phone || ''}_${m.name || ''}`;
      if (!customerMap.has(key)) customerMap.set(key, m);
    });
    const topMatches = Array.from(customerMap.values()).slice(0, 5);
    dropdown.innerHTML = topMatches.map(m => {
      const phoneDisp = m.phone ? ` (<span style="color:var(--red);font-weight:700;">${m.phone}</span>)` : '';
      return `
        <div class="search-result-row" onclick="fillSearchInputWithPhone('${m.phone || ''}'); openCustomerHistory('${m.phone || m.name}')">
          <div>
            <div class="src-name">${m.name || 'Khách hàng'}${phoneDisp}</div>
            <div class="src-meta">${m.route} • ${m.time} • Ghế ${m.seat}</div>
          </div>
        </div>`;
    }).join('');
  }
  dropdown.classList.add('open');
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
    searchInput.addEventListener('input', function () {
      renderLiveSearchResults(this.value);
    });
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
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