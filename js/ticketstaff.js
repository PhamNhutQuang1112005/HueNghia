/* ===================== DỮ LIỆU GHẾ MẪU ===================== */

// ===== Storage & Data Models =====
const staffList = ["tuyetphuong.huenghia", "minh.tran", "nguyen.long", "thi.hoa"];
function getStaffCode(usernameOrCode) {
  if (!usernameOrCode) return null;
  return STAFF_CODE_MAP[usernameOrCode] || usernameOrCode;
}
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

function getPastDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
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
  const dAddr = (isBooked && (gType === 'Trung chuyển' || Math.random() > 0.4)) ? dropoffAddrs[Math.floor(Math.random() * dropoffAddrs.length)] : '';
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
    firstStop: mainSeat.firstStop,
    lastStop: mainSeat.lastStop,
    note: mainSeat.note,
    hasLuggage: mainSeat.hasLuggage,
    paid: mainSeat.paid,
    count: 2
  });
}


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
    cancelledSeats: [
      {
        id: 'c1',
        code: 'A5',
        customerName: 'Nguyễn Văn An',
        phone: '0809123456',
        firstStop: 'Kinh Dương Vương',
        lastStop: 'BX Châu Đốc',
        price: 280000,
        reason: 'Khách bận đột xuất',
        cancelTime: '08:15 06/07/2026',
        ticketNo: 'MS0098',
        note: 'Đã hoàn tiền 100%'
      }
    ]
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
    const firstStopShort = shortenStopName(item.firstStop) || '—';
    const lastStopShort = shortenStopName(item.lastStop) || '—';
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
          </tr>
        `;
      }).join('');
    }
  }
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

  const firstStopShort = shortenStopName(seat.firstStop) || '—';
  const lastStopShort = shortenStopName(seat.lastStop) || '—';
  const routeStr = `${firstStopShort} → ${lastStopShort}`;

  const textColor = isEmpty ? 'color:var(--text-sub);' : 'color:var(--text-main); font-weight:700;';
  const displayRoute = isEmpty ? '—' : routeStr;
  const displayFirst = isEmpty ? '—' : firstStopShort;
  const displayLast = isEmpty ? '—' : lastStopShort;
  const custName = isEmpty ? '—' : (seat.customerName || '—');
  const custPhone = isEmpty ? '—' : (seat.phone || '—');
  const noteStr = seat.note || '—';

  const linesHtml = `
    ${isEmpty ? '' : groupLabelHtml}
    <div class="seat-line route-single-line"><span class="seat-label-full">Chặng đi: </span><span class="seat-stop" title="${displayRoute}">${displayRoute}</span></div>
    <div class="route-split-line">
      <div class="route-split-row"><span class="route-split-label">Đi:</span><span class="seat-stop" title="${displayFirst}">${displayFirst}</span></div>
      <div class="route-split-row"><span class="route-split-label">Đến:</span><span class="seat-stop" title="${displayLast}">${displayLast}</span></div>
    </div>
    <div class="seat-line" style="${textColor}"><span class="seat-label-full">Khách hàng: </span><span class="seat-label-short">KH: </span>${custName}</div>
    <div class="seat-line" style="${textColor}"><span class="seat-label-full">Số điện thoại: </span><span class="seat-label-short">SĐT: </span>${custPhone}</div>
    <div class="seat-note" title="${seat.note || ''}"><span class="seat-label-full">Ghi chú: </span><span class="seat-label-short">GC: </span>${noteStr}</div>
  `;

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
    if (s.paid) paidRevenue += price;
    else unpaidRevenue += price;
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

function toggleZone1() {
  setZone1Collapsed(!document.body.classList.contains('zone1-collapsed'));
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


// ===== Seat Selection & Transfer =====

// Xử lý sự kiện nhấp chuột chọn ghế trên sơ đồ
function onSeatClick(ev, code) {
  if (ev.detail > 1) { return; }
  const seat = findSeat(code);
  if (seat && seat.phone) {
    fillSearchInputWithPhone(seat.phone);
  }
  if (seat.locked) { showToast(`Ghế ${code} đang được ${seat.lockedBy} thao tác`); return; }

  // Check if this is an extra leftover seat
  const isExtraSeat = extraLeftoverSeats.some(s => s.code === code);
  if (isExtraSeat) {
    openAssignSeatModal(code);
    ev.stopPropagation();
    return;
  }

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
  if (!multiSelectMode || !selectedSourceSeats.length || !selectedTargetSeats.length) {
    showToast('Vui lòng chọn ít nhất 1 ghế đã đặt và 1 ghế trống');
    return;
  }

  const pairCount = Math.min(selectedSourceSeats.length, selectedTargetSeats.length);
  if (pairCount === 0) { showToast('Vui lòng chọn ít nhất 1 ghế trống để chuyển'); return; }
  const sourceTripId = transferSourceTripId || currentTripId;
  const targetTripId = transferTargetTripId || currentTripId;

  for (let i = 0; i < pairCount; i++) {
    const sourceSeat = findSeatInTrip(sourceTripId, selectedSourceSeats[i]);
    const targetSeat = findSeatInTrip(targetTripId, selectedTargetSeats[i]);
    if (!sourceSeat || !OCCUPIED_STATES.includes(sourceSeat.state) || !targetSeat || targetSeat.state !== 'empty') continue;

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
      guestType: sourceSeat.guestType,
      transshipStation: sourceSeat.transshipStation,
      arrivalTransfer: sourceSeat.arrivalTransfer
    });
    clearSeatToEmpty(sourceSeat);
  }

  renderSeats();
  if (document.getElementById('zone3Passengers').style.display !== 'none') renderPassengerList();
  exitMultiSelectMode();
  showToast(`Đã chuyển ${pairCount} ghế thành công`);
}

/* Đưa ghế về trạng thái trống hoàn toàn — không giữ lại bất kỳ thông tin khách nào */
function clearSeatToEmpty(seat) {
  Object.assign(seat, {
    state: 'empty', count: 1, customerName: null, phone: null, firstStop: null,
    lastStop: null, note: null, staff: null, callState: null, pickupTime: null,
    ticketNo: null, paid: false, hasLuggage: false, guestType: null,
    transshipStation: null, arrivalTransfer: null
  });
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
   - Trung chuyển: có thêm ô nhập nơi trung chuyển (bắt buộc).
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

  const isTransshipLike = (type === 'Trung chuyển' || type === 'Rước liền');
  if (isTransshipLike && transshipVal) {
    transshipLabel.textContent = type === 'Rước liền' ? 'Rước liền' : 'Trạm trung chuyển';
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
  updateTicketQR();
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

function printTicket(seats) {
  if (!seats || seats.length === 0) return;

  const currentTrip = (allTripsMeta && allTripsMeta.find(t => t.id === currentTripId)) || { route: 'Sài Gòn - Châu Đốc', time: '07:00' };
  const firstSeat = seats[0];
  const seatsText = seats.map(s => s.code).join(', ');
  const ticketNo = firstSeat.ticketNo || ('SGCD-' + String(Math.floor(1000 + Math.random() * 9000)));
  const customerName = firstSeat.customerName || document.getElementById('f_name').value.trim() || 'Khách lẻ';
  const phone = firstSeat.phone || document.getElementById('f_phone').value.trim() || '—';
  const fromStation = firstSeat.firstStop || getStationValue().trim() || 'Trạm Kinh Dương Vương';
  const toStation = firstSeat.lastStop || document.getElementById('f_destination').value.trim() || 'Trạm Châu Đốc';
  const unitPrice = firstSeat.price || getEditedPrice();
  const totalPrice = unitPrice * seats.length;

  const qrText = buildScannableQRText(ticketNo, seatsText, customerName, phone, currentTrip.route || 'Sài Gòn - Châu Đốc', currentTrip.time || '07:00');
  const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=1&data=${encodeURIComponent(qrText)}`;

  const now = new Date();
  const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('vi-VN');
  const nowStr = `${timeStr} - ${dateStr}`;

  const printHtml = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
    <meta charset="UTF-8">
    <title>In Vé Xe Huệ Nghĩa - ${ticketNo}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
      @page { size: 80mm auto; margin: 0; }
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        width: 76mm;
        margin: 0 auto;
        padding: 12px 6px;
        color: #111213;
        background: #fff;
        font-size: 12.5px;
        line-height: 1.35;
      }
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
    </style>
    </head>
    <body>

    <div class="brand-header">
      <div class="brand-badge">HN</div>
      <div class="brand-name">HUỆ NGHĨA EXPRESS</div>
      <div class="brand-sub">Hệ thống Đặt vé & Trung chuyển Chuyên nghiệp</div>
    </div>

    <div class="ticket-title">VÉ XE KHÁCH</div>
    <div class="dash-line"></div>

    <div class="kv-row"><span class="kv-label">Mã vé:</span><span class="kv-val">${ticketNo}</span></div>
    <div class="kv-row"><span class="kv-label">Ngày in:</span><span class="kv-val">${nowStr}</span></div>

    <div class="dash-line"></div>

    <div class="seat-box">SỐ GHẾ: ${seatsText}</div>

    <div class="kv-row"><span class="kv-label">Hành khách:</span><span class="kv-val">${customerName}</span></div>
    <div class="kv-row"><span class="kv-label">Điện thoại:</span><span class="kv-val">${phone}</span></div>
    <div class="kv-row"><span class="kv-label">Tuyến xe:</span><span class="kv-val">${currentTrip.route || 'Sài Gòn - Châu Đốc'}</span></div>
    <div class="kv-row"><span class="kv-label">Giờ xuất bến:</span><span class="kv-val">${currentTrip.time || '07:00'}</span></div>
    <div class="kv-row"><span class="kv-label">Trạm đi:</span><span class="kv-val">${fromStation}</span></div>
    <div class="kv-row"><span class="kv-label">Trạm đến:</span><span class="kv-val">${toStation}</span></div>

    <div class="dash-line"></div>

    <div class="kv-row"><span class="kv-label">Đơn giá:</span><span class="kv-val">${unitPrice.toLocaleString('vi-VN')}đ/vé</span></div>
    <div class="total-price-box">TỔNG TIỀN: ${totalPrice.toLocaleString('vi-VN')}đ</div>

    <div class="qr-container">
      <img class="qr-img" src="${qrImgUrl}" alt="Mã QR Lên Xe">
      <div style="font-weight:800; font-size:11.5px; margin-top:2px;">MÃ QR XÁC NHẬN LÊN XE</div>
      <div style="font-size:10px; color:#555;">Quét mã QR để kiểm tra trạng thái lên xe</div>
    </div>

    <div class="footer-note">
      <b>Cảm ơn quý khách đã chọn Huệ Nghĩa Express!</b><br>
      Tổng đài đặt vé & hỗ trợ: <b>1900 63 64 99</b>
    </div>

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

  const printWin = window.open('', '_blank', 'width=450,height=600');
  if (printWin) {
    printWin.document.open();
    printWin.document.write(printHtml);
    printWin.document.close();
  }
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
}

function getEditedPrice() {
  const el = document.getElementById('t_price');
  if (!el) return 280000;
  return parseInt(el.textContent.replace(/[^0-9]/g, '')) || 280000;
}

function syncRuocLienToPickupList(seats) {
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

  const editedPrice = getEditedPrice();
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
    seat.price = editedPrice;
  };

  const seatsTarget = currentPanelSeats.length ? currentPanelSeats : (currentPanelSeat ? [currentPanelSeat] : []);
  if (!seatsTarget.length) { closePanel(); return; }

  if (currentPanelMode === 'edit' && currentPanelSeat) {
    const seat = currentPanelSeat;
    applyFormToSeat(seat);
    if (type === 'Rước liền') syncRuocLienToPickupList([seat]);
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
    seat.state = seat.hasLuggage ? 'cargo' : 'hold';
  });

  if (type === 'Rước liền') syncRuocLienToPickupList(seatsTarget);
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

  const editedPrice = getEditedPrice();
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
    seat.price = editedPrice;
  };

  const seatsToSell = currentPanelSeats.length ? currentPanelSeats : (currentPanelSeat ? [currentPanelSeat] : []);
  if (!seatsToSell.length) { closePanel(); return; }

  const groupTicketNo = (currentPanelMode === 'edit' && currentPanelSeat && currentPanelSeat.ticketNo)
    ? currentPanelSeat.ticketNo
    : ("SGCD-" + String(ticketSeq++).padStart(4, '0'));

  seatsToSell.forEach(seat => {
    applyFormToSeat(seat);
    seat.ticketNo = seat.ticketNo || groupTicketNo;
    seat.paid = true;
    seat.count = seatsToSell.length;
    seat.state = 'sold'; // Bán vé -> ghế chuyển sang màu đỏ (đã bán)
  });

  renderSeats();
  saveSeatBank();
  if (document.getElementById('zone3Passengers').style.display !== 'none') renderPassengerList();

  closePanel();
  showToast(seatsToSell.length > 1
    ? 'Đã bán vé thành công cho ' + seatsToSell.length + ' ghế'
    : 'Đã bán vé thành công — Ghế ' + seatsToSell[0].code);
  if (typeof multiSelectMode !== 'undefined' && multiSelectMode) {
    if (typeof exitMultiSelectMode === 'function') exitMultiSelectMode();
  }

  // In vé trực tiếp có mã QR xác nhận lên xe
  printTicket(seatsToSell);
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

  list.innerHTML = extraLeftoverSeats.map(seatCard).join('');
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

let currentCancelSeatCode = null;

function openCancelModal(code) {
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

function nextSubSeatCode() {
  let max = 0;
  subSeats.forEach(s => {
    const m = /^S(\d+)$/.exec(s.code);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  });
  return 'S' + (max + 1);
}


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

function deleteSubSeat(code) {
  subSeats = subSeats.filter(s => s.code !== code);
  if (tripSeatBank[currentTripId]) tripSeatBank[currentTripId].subSeats = subSeats;
  saveSeatBank();
  renderSubSeats();
  updateTripStats();
  updatePassengerTabCount();
  showToast('Đã xóa ghế phụ');
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
function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toastText').textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ---- Search dropdown (SB-01) ---- */
function toggleSearchResults(force) {
  const el = document.getElementById('searchResults');
  if (force === true) { el.classList.add('open'); return; }
  el.classList.toggle('open');
}
document.getElementById('searchInput').addEventListener('focus', () => toggleSearchResults(true));
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

function pickSearchResult() {
  document.getElementById('searchResults').classList.remove('open');
  showToast('Đã điều hướng đến đúng phơi xe và ghế của khách');
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

  if (multiSelectMode && selectionMode === 'transfer' && selectedSourceSeats.length) {
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
    html += `<div class="cal-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" onclick="pickDate(${y},${m},${d})">${d}<span class="lunar">${lunar}/6</span></div>`;
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

/* ---- Zone 1: Time range slider (bấm chọn, khung 6 giờ: 0h -> 6h -> 12h -> 18h -> 24h) ---- */
const tsTrack = document.getElementById('tsTrack');
const tsRange = document.getElementById('tsRange');
let tsStartHour = 0; // 00:00 – 06:00 mặc định

function updateTsUI() {
  const leftPct = (tsStartHour / 24) * 100;
  const widthPct = (TS_WINDOW_HOURS / 24) * 100;
  if (tsRange) {
    tsRange.style.left = leftPct + '%';
    tsRange.style.width = widthPct + '%';
  }
}

if (tsTrack) {
  updateTsUI();

  tsTrack.addEventListener('click', (e) => {
    const rect = tsTrack.getBoundingClientRect();
    let pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    
    // 4 khung giờ cách nhau 6h: 0h (0-6h), 6h (6-12h), 12h (12-18h), 18h (18-24h)
    let slot = Math.floor(pct / 25);
    if (slot > 3) slot = 3;
    tsStartHour = slot * 6;
    updateTsUI();
    renderZone1TripList();
  });
}

/* ===================== MODAL CHỈ ĐỊNH GHẾ DƯ CHO PHƠI KHÁC ===================== */
let activeAssignSourceSeatCode = null;
let activeAssignTargetTripId = null;
let selectedAssignTargetSeatCode = null;
let assignSeatTripSearchKeyword = '';

function openAssignSeatModal(seatCode) {
  activeAssignSourceSeatCode = seatCode;
  const seat = findSeat(seatCode);
  if (!seat) return;

  const modalSub = document.getElementById('assignSeatModalSub');
  if (modalSub) {
    modalSub.textContent = `Khách: ${seat.customerName || '—'} · ${seat.phone || '—'} · Ghế dư hiện tại: ${seatCode}`;
  }

  activeAssignTargetTripId = currentTripId;
  selectedAssignTargetSeatCode = null;
  assignSeatTripSearchKeyword = '';

  const searchInput = document.getElementById('assignSeatTripSearch');
  if (searchInput) searchInput.value = '';

  renderAssignSeatTripList();
  renderAssignSeatMap();
  updateAssignSeatConfirmState();

  document.getElementById('assignSeatModal').classList.add('open');
}

function closeAssignSeatModal() {
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

function renderAssignSeatTripList() {
  const wrap = document.getElementById('assignSeatTripList');
  if (!wrap) return;
  const kw = assignSeatTripSearchKeyword.trim().toLowerCase();

  const filtered = !kw ? allTripsMeta : allTripsMeta.filter(t =>
    t.time.toLowerCase().includes(kw) ||
    (t.plate && t.plate.toLowerCase().includes(kw)) ||
    t.route.toLowerCase().includes(kw) ||
    (t.vehicleType && t.vehicleType.toLowerCase().includes(kw))
  );

  if (filtered.length === 0) {
    wrap.innerHTML = '<div class="trip-empty-msg" style="padding:16px 4px; text-align:center; font-size:13.5px; color:var(--text-sub); font-weight:600;">Không tìm thấy phơi xe phù hợp</div>';
    return;
  }

  wrap.innerHTML = filtered.map(t => {
    const plan = tripSeatBank[t.id];
    const totalSeats = plan ? (plan.down.length + plan.up.length) : 0;
    const bookedSeats = plan ? [...plan.down, ...plan.up].filter(s => ['sold', 'hold', 'free', 'cargo'].includes(s.state)).length : 0;
    const selected = t.id === activeAssignTargetTripId ? 'selected' : '';
    const plate = t.plate || 'Chưa có';
    const fullTripName = t.name ? `${t.name} • ${vehicleType}` : `${t.route} • ${vehicleType}`;

    return `
      <div class="trip-card ${selected}" onclick="selectAssignSeatTrip('${t.id}')">
        <div>
          <div class="trip-time-row">
            <span class="trip-time">${t.time}</span>
            <span class="trip-plate-inline">${plate}</span>
          </div>
          <div class="trip-sub" title="${fullTripName}">${fullTripName}</div>
        </div>
        <div class="trip-nums">
          <div class="n1">${bookedSeats}/${totalSeats}</div>
          <div class="n2">đã đặt</div>
        </div>
      </div>`;
  }).join('');
}

function selectAssignSeatTrip(tripId) {
  if (tripId === activeAssignTargetTripId) return;
  activeAssignTargetTripId = tripId;
  selectedAssignTargetSeatCode = null;
  renderAssignSeatTripList();
  renderAssignSeatMap();
  updateAssignSeatConfirmState();
}

function renderAssignSeatMap() {
  const tripId = activeAssignTargetTripId;
  const tripPlan = tripSeatBank[tripId];
  const floorDownEl = document.getElementById('assignSeatFloorDown');
  const floorUpEl = document.getElementById('assignSeatFloorUp');

  if (!tripPlan || !floorDownEl || !floorUpEl) return;

  const mapSeat = seat => {
    if (seat.state === 'hidden') {
      return `<div class="van-seat" style="visibility:hidden; pointer-events:none;"></div>`;
    }
    const isTarget = seat.code === selectedAssignTargetSeatCode;
    const isBooked = ['sold', 'hold', 'free', 'cargo'].includes(seat.state);
    let cls = 'empty';
    if (isBooked) cls = 'blocked';
    else if (isTarget) cls = 'selected';

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
  if (tag) tag.textContent = selectedAssignTargetSeatCode ? ('Ghế ' + selectedAssignTargetSeatCode) : '';
}

function selectAssignTargetSeat(code) {
  const tripPlan = tripSeatBank[activeAssignTargetTripId];
  if (!tripPlan) return;
  const seat = [...tripPlan.down, ...tripPlan.up].find(s => s.code === code);
  if (!seat || ['sold', 'hold', 'free', 'cargo'].includes(seat.state)) return;

  selectedAssignTargetSeatCode = (selectedAssignTargetSeatCode === code) ? null : code;
  renderAssignSeatMap();
  updateAssignSeatConfirmState();
}

function updateAssignSeatConfirmState() {
  const btn = document.getElementById('confirmAssignSeatBtn');
  const hint = document.getElementById('assignSeatHint');
  if (!btn) return;

  if (activeAssignTargetTripId && selectedAssignTargetSeatCode) {
    btn.disabled = false;
    if (hint) hint.textContent = `Sẵn sàng chỉ định ghế ${activeAssignSourceSeatCode} sang chuyến ${activeAssignTargetTripId}, ghế ${selectedAssignTargetSeatCode}`;
  } else {
    btn.disabled = true;
    if (hint) hint.textContent = 'Chọn 1 phơi xe và 1 ghế trống để chỉ định.';
  }
}

function confirmAssignSeat() {
  if (!activeAssignSourceSeatCode || !activeAssignTargetTripId || !selectedAssignTargetSeatCode) return;

  const sourceIdx = extraLeftoverSeats.findIndex(s => s.code === activeAssignSourceSeatCode);
  if (sourceIdx === -1) {
    showToast('Không tìm thấy ghế dư nguồn');
    return;
  }
  const sourceSeat = extraLeftoverSeats[sourceIdx];

  const tripPlan = tripSeatBank[activeAssignTargetTripId];
  if (!tripPlan) {
    showToast('Không tìm thấy sơ đồ phơi xe đích');
    return;
  }
  const targetSeat = [...tripPlan.down, ...tripPlan.up].find(s => s.code === selectedAssignTargetSeatCode);
  if (!targetSeat || ['sold', 'hold', 'free', 'cargo'].includes(targetSeat.state)) {
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

  if (activeAssignTargetTripId === currentTripId) {
    seatPlanDown = tripPlan.down;
    seatPlanUp = tripPlan.up;
    renderSeats();
  }

  renderExtraSeats();
  if (document.getElementById('zone3Passengers').style.display !== 'none') renderPassengerList();
  closeAssignSeatModal();
  showToast(`Đã chỉ định ghế ${activeAssignSourceSeatCode} sang chuyến ${activeAssignTargetTripId}, ghế ${selectedAssignTargetSeatCode} thành công`);
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
      <div class="trip-card ${selected}" data-trip="${t.id}" onclick="selectTrip(this,'${t.time}','${t.route}')" title="${tooltipText}">
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

  sgcdWrap.innerHTML = sgcdTripsMeta.map(mapTrip).join('');
  CDSG_TABS_MAPPING_VERIFICATION_CHECK:
  cdsgWrap.innerHTML = cdsgTripsMeta.map(mapTrip).join('');
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

  renderHistorySeatMap(results, true);

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

let chFilterState = { date: 'all', route: 'all', time: 'all', status: 'all' };

function applyChFilters() {
  const dateVal = document.getElementById('chFilterDate')?.value || 'all';
  const routeVal = document.getElementById('chFilterRoute')?.value || 'all';
  const timeVal = document.getElementById('chFilterTime')?.value || 'all';
  const statusVal = document.getElementById('chFilterStatus')?.value || 'all';

  chFilterState = { date: dateVal, route: routeVal, time: timeVal, status: statusVal };

  const filtered = (_rawHistoryResults || []).filter(r => {
    if (dateVal !== 'all' && r.date !== dateVal) return false;
    if (routeVal !== 'all' && r.route !== routeVal) return false;
    if (timeVal !== 'all') {
      const hh = parseInt((r.time || '00:00').split(':')[0], 10);
      if (timeVal === 'morning' && (hh < 0 || hh >= 12)) return false;
      if (timeVal === 'afternoon' && (hh < 12 || hh >= 18)) return false;
      if (timeVal === 'evening' && (hh < 18 || hh > 24)) return false;
    }
    if (statusVal !== 'all') {
      if (statusVal === 'today' && !r.isToday) return false;
      if (statusVal === 'past' && r.isToday) return false;
      if (statusVal === 'sold' && r.state !== 'sold') return false;
      if (statusVal === 'hold' && r.state !== 'hold') return false;
    }
    return true;
  });

  renderHistorySeatMap(filtered, false);
}

function resetChFilters() {
  const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  setVal('chFilterDate', 'all');
  setVal('chFilterRoute', 'all');
  setVal('chFilterTime', 'all');
  setVal('chFilterStatus', 'all');
  chFilterState = { date: 'all', route: 'all', time: 'all', status: 'all' };
  renderHistorySeatMap(_rawHistoryResults || [], false);
}

function renderHistorySeatMap(results, rebuildFilterOptions = true) {
  const body = document.getElementById('chBody');
  if (!body) return;

  if (!results?.length) {
    body.innerHTML = `
      <div class="filter-toolbar ch-filter-toolbar">
        <div class="filter-field">
          <label>Ngày đi</label>
          <select id="chFilterDate" onchange="applyChFilters()"><option value="all">Tất cả ngày</option></select>
        </div>
        <div class="filter-field">
          <label>Tuyến đường</label>
          <select id="chFilterRoute" onchange="applyChFilters()"><option value="all">Tất cả tuyến</option></select>
        </div>
        <div class="filter-field">
          <label>Khung giờ</label>
          <select id="chFilterTime" onchange="applyChFilters()">
            <option value="all">Tất cả khung giờ</option>
            <option value="morning">Sáng (00:00 - 12:00)</option>
            <option value="afternoon">Chiều (12:00 - 18:00)</option>
            <option value="evening">Tối (18:00 - 24:00)</option>
          </select>
        </div>
        <div class="filter-field">
          <label>Trạng thái</label>
          <select id="chFilterStatus" onchange="applyChFilters()">
            <option value="all">Tất cả trạng thái</option>
            <option value="today">Hôm nay</option>
            <option value="past">Lịch sử quá khứ</option>
            <option value="sold">Đã bán</option>
            <option value="hold">Đã đặt</option>
          </select>
        </div>
        <div class="filter-reset" style="display:flex;gap:8px;align-items:center;">
          <button type="button" class="btn btn-secondary" onclick="resetChFilters()">Đặt lại bộ lọc</button>
          <button type="button" class="btn btn-secondary" onclick="closeCustomerHistory()" style="display:flex;align-items:center;gap:6px;font-weight:700;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="M18 6L6 18M6 6l12 12"/></svg>
            Đóng lịch sử
          </button>
        </div>
      </div>
      <div class="ch-empty" style="text-align:center;padding:40px;color:var(--text-sub);">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:40px;height:40px;margin-bottom:8px;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <div style="font-weight:600;">Không tìm thấy lịch sử phù hợp bộ lọc</div>
      </div>`;

    if (rebuildFilterOptions && _rawHistoryResults?.length) {
      const dates = Array.from(new Set(_rawHistoryResults.map(r => r.date).filter(Boolean))).sort().reverse();
      const routes = Array.from(new Set(_rawHistoryResults.map(r => r.route).filter(Boolean))).sort();
      const dateOpts = `<option value="all">Tất cả ngày (${_rawHistoryResults.length} vé)</option>` +
        dates.map(d => `<option value="${d}">${formatHistoryDate(d)}</option>`).join('');
      const routeOpts = `<option value="all">Tất cả tuyến</option>` +
        routes.map(r => `<option value="${r}">${r}</option>`).join('');
      const dateEl = document.getElementById('chFilterDate');
      const routeEl = document.getElementById('chFilterRoute');
      if (dateEl) dateEl.innerHTML = dateOpts;
      if (routeEl) routeEl.innerHTML = routeOpts;
    }
    return;
  }

  _historyResults = results;
  window._historyResults = results;

  const firstResult = results[0];
  const custName = firstResult.name || 'Khách hàng';
  const custPhone = firstResult.phone || currentSearchPhone || '—';

  // Group results by Trip (date + route + time + tripId)
  const tripGroupsMap = new Map();
  results.forEach((r, idx) => {
    const tripKey = `${r.date}_${r.route}_${r.time}_${r.tripId || ''}`;
    if (!tripGroupsMap.has(tripKey)) {
      tripGroupsMap.set(tripKey, {
        date: r.date,
        route: r.route,
        time: r.time,
        tripId: r.tripId,
        plate: r.plate,
        vehicleType: r.vehicleType,
        driver: r.driver,
        helper: r.helper,
        isToday: r.isToday,
        items: []
      });
    }
    tripGroupsMap.get(tripKey).items.push({ ...r, origIdx: idx });
  });

  const tripGroups = Array.from(tripGroupsMap.values());

  let cardsHtml = '';
  tripGroups.forEach(group => {
    const formattedDate = formatHistoryDate(group.date);
    const plate = group.plate || '51F-123.45';
    const vehicleType = group.vehicleType || 'Limousine 24 Phòng';
    const driver = group.driver || 'Trần Văn Hùng';
    const helper = group.helper || 'Nguyễn Văn Bình';
    const firstOrigIdx = group.items[0].origIdx;

    let seatCardsHtml = group.items.map(r => {
      const { firstStopHtml, lastStopHtml } = getHistoryStopsDisplay(r);
      const bookStaffStr = getStaffCode(r.bookStaff || r.staff) || 'NV01';
      const sellStaffStr = r.sellStaff ? (getStaffCode(r.sellStaff) || r.sellStaff) : (r.paid ? 'NV05' : '—');
      const stateClass = r.state === 'sold' ? 'sold' : (r.state === 'hold' ? 'hold' : 'sold');

      return `
        <div class="seat-card ${stateClass} ch-seat-card-item" data-code="${r.seat}">
          <div class="seat-top">
            <div>
              <div class="seat-code" style="display:inline-block; vertical-align:middle; font-size:16px; font-weight:800;">${r.seat}</div>
              ${r.isToday ? '<span class="ch-history-badge" style="margin-left:6px;">Hôm nay</span>' : ''}
            </div>
            <div class="seat-top-right">
              <div class="seat-price-tag">${r.price ? r.price.toLocaleString('vi-VN') + 'đ' : '—'}</div>
            </div>
          </div>

          <div class="seat-line" style="margin-top:2px;">
            <span class="seat-label-full" style="font-weight:700;color:var(--text-sub);">Trạm đi: </span>
            <span class="seat-stop" style="font-weight:700;">${firstStopHtml}</span>
          </div>

          <div class="seat-line" style="margin-top:2px;">
            <span class="seat-label-full" style="font-weight:700;color:var(--text-sub);">Trạm đến: </span>
            <span class="seat-stop" style="font-weight:700;">${lastStopHtml}</span>
          </div>

          <div class="seat-line" style="color:var(--text-main); font-weight:700; margin-top:4px;">
            <span class="seat-label-full">Khách hàng: </span>${custName}
          </div>
          <div class="seat-line" style="color:var(--text-main); font-weight:700;">
            <span class="seat-label-full">SĐT: </span>${custPhone}
          </div>

          <div class="seat-line" style="color:var(--text-sub); font-size:11.5px; margin-top:4px;">
            <span class="seat-label-full">Nhân viên: </span>Đặt: <b>${bookStaffStr}</b> | Bán: <b class="${sellStaffStr === '—' ? 'none' : ''}">${sellStaffStr}</b>
          </div>

          <button class="seat-footbtn" type="button" onclick="event.stopPropagation(); openRebookFromHistory(${r.origIdx})">
            <span class="foot-text-normal">ĐẶT LẠI VÉ NÀY</span>
            <span class="foot-text-hover">ĐẶT LẠI VÉ NÀY</span>
          </button>
        </div>
      `;
    }).join('');

    cardsHtml += `
      <div class="ch-trip-seatmap-card">
        <div class="ch-trip-header">
          <div class="ch-trip-title-info" onclick="goToTripFromHistory(event, ${firstOrigIdx})" title="Biển số xe: ${plate} • Loại xe: ${vehicleType} • Tài xế: ${driver} • Phụ xe: ${helper}">
            <div class="ch-trip-name">
              <span class="ch-trip-link">${group.route} — ${group.time}</span>
              <span class="ch-date-tag">${formattedDate}</span>
            </div>
          </div>
        </div>

        <div class="ch-seat-cards-grid">
          ${seatCardsHtml}
        </div>
      </div>
    `;
  });

  const bannerHtml = `
    <!-- Bộ lọc dữ liệu kiểu trang Shuttle -->
    <div class="filter-toolbar ch-filter-toolbar">
      <div class="filter-field">
        <label>Ngày đi</label>
        <select id="chFilterDate" onchange="applyChFilters()">
          <!-- JS dynamic -->
        </select>
      </div>
      <div class="filter-field">
        <label>Tuyến đường</label>
        <select id="chFilterRoute" onchange="applyChFilters()">
          <!-- JS dynamic -->
        </select>
      </div>
      <div class="filter-field">
        <label>Khung giờ</label>
        <select id="chFilterTime" onchange="applyChFilters()">
          <option value="all" ${chFilterState.time === 'all' ? 'selected' : ''}>Tất cả khung giờ</option>
          <option value="morning" ${chFilterState.time === 'morning' ? 'selected' : ''}>Sáng (00:00 - 12:00)</option>
          <option value="afternoon" ${chFilterState.time === 'afternoon' ? 'selected' : ''}>Chiều (12:00 - 18:00)</option>
          <option value="evening" ${chFilterState.time === 'evening' ? 'selected' : ''}>Tối (18:00 - 24:00)</option>
        </select>
      </div>
      <div class="filter-field">
        <label>Trạng thái</label>
        <select id="chFilterStatus" onchange="applyChFilters()">
          <option value="all" ${chFilterState.status === 'all' ? 'selected' : ''}>Tất cả trạng thái</option>
          <option value="today" ${chFilterState.status === 'today' ? 'selected' : ''}>Hôm nay</option>
          <option value="past" ${chFilterState.status === 'past' ? 'selected' : ''}>Lịch sử quá khứ</option>
          <option value="sold" ${chFilterState.status === 'sold' ? 'selected' : ''}>Đã bán</option>
          <option value="hold" ${chFilterState.status === 'hold' ? 'selected' : ''}>Đã đặt</option>
        </select>
      </div>
      <div class="filter-reset" style="display:flex;gap:8px;align-items:center;">
        <button type="button" class="btn btn-secondary" onclick="resetChFilters()">Đặt lại bộ lọc</button>
        <button type="button" class="btn btn-secondary" onclick="closeCustomerHistory()" style="display:flex;align-items:center;gap:6px;font-weight:700;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="M18 6L6 18M6 6l12 12"/></svg>
          Đóng lịch sử
        </button>
      </div>
    </div>

    <div class="ch-seatmaps-list" id="chSeatmapsList">${cardsHtml}</div>
  `;

  body.innerHTML = bannerHtml;

  if (rebuildFilterOptions && _rawHistoryResults?.length) {
    const dates = Array.from(new Set(_rawHistoryResults.map(r => r.date).filter(Boolean))).sort().reverse();
    const routes = Array.from(new Set(_rawHistoryResults.map(r => r.route).filter(Boolean))).sort();

    const dateOpts = `<option value="all">Tất cả ngày (${_rawHistoryResults.length} vé)</option>` +
      dates.map(d => `<option value="${d}">${formatHistoryDate(d)}</option>`).join('');
    const routeOpts = `<option value="all">Tất cả tuyến</option>` +
      routes.map(r => `<option value="${r}">${r}</option>`).join('');

    const dateEl = document.getElementById('chFilterDate');
    const routeEl = document.getElementById('chFilterRoute');
    if (dateEl) dateEl.innerHTML = dateOpts;
    if (routeEl) routeEl.innerHTML = routeOpts;
  }
}

function renderHistoryTable(results) {
  renderHistorySeatMap(results, true);
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
      showToast('Vui lòng nhập số điện thoại, tên hoặc mã vé để tìm kiếm', 'warning');
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
  }
});