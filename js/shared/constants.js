// Hằng số/dữ liệu dùng chung giữa callcenter và ticketstaff — nội dung giống hệt (đo 07/08/2026).
// Nạp bằng thẻ <script> thường (không phải module) TRƯỚC script chính của từng trang —
// const top-level ở đây dùng chung được cho các <script> nạp sau trong cùng trang.
// LƯU Ý THỨ TỰ NẠP: file này dùng getPastDate() ngay khi chạy (tính CUSTOMER_HISTORY_DATA) nên
// shared/format.js PHẢI nạp TRƯỚC shared/constants.js.

const STAFF_CODE_MAP = {
  "tuyetphuong.huenghia": "NV01",
  "minh.tran": "NV02",
  "nguyen.long": "NV03",
  "thi.hoa": "NV04"
};

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

const DEFAULT_STAFF_STATION = 'Trạm Kinh Dương Vương'; // Trạm đi mặc định theo nhân viên trạm đang đăng nhập
const DEFAULT_SUB_SEAT_PRICE = 280000;
const OCCUPIED_STATES = ['sold', 'hold', 'cargo', 'free'];

const todayStr__constants = new Date().toISOString().split("T")[0];

// isTemplate:true đánh dấu đây là "phơi mẫu" cố định dùng cho chế độ chọn mẫu tạo hàng loạt (xem
// toggleBulkTemplateMode() trong callcenter.js) — phơi tạo mới (đơn lẻ hay hàng loạt) KHÔNG có cờ này
// nên không lẫn vào danh sách mẫu, dù được thêm vào allTripsMeta chung với các phơi mẫu.
const DEFAULT_SGCD_TRIPS = [
  { id: '1', name: 'Sài Gòn - Châu Đốc (07:00) - Xuất bến VP Q.5', time: '07:00', route: 'Sài Gòn - Châu Đốc', plate: '51F-123.45', vehicleType: 'Limousine 24 Phòng', date: todayStr__constants, price: 280000, status: 'Đang bán', note: 'Xuất bến VP Q.5 - Tải 24 phòng VIP', isTemplate: true },
  { id: '2', name: 'Sài Gòn - Châu Đốc (08:30) - Chạy bến An Sương', time: '08:30', route: 'Sài Gòn - Châu Đốc', plate: '50H-678.90', vehicleType: 'Giường nằm 34 chỗ', date: todayStr__constants, price: 250000, status: 'Đã chỉ định xe', note: 'Chạy bến An Sương - Đón dọc QL22', isTemplate: true },
  { id: '3', name: 'Sài Gòn - Châu Đốc (10:00) - Chuyến sáng trung tâm', time: '10:00', route: 'Sài Gòn - Châu Đốc', plate: '', vehicleType: 'Limousine 24 Phòng', date: todayStr__constants, price: 280000, status: 'Chưa chỉ định xe', note: 'Chuyến sáng trung tâm - Đã mở bán', isTemplate: true },
  { id: '4', name: 'Sài Gòn - Châu Đốc (13:15) - Tăng cường xe 45 chỗ', time: '13:15', route: 'Sài Gòn - Châu Đốc', plate: '50H-345.67', vehicleType: 'Ghế ngồi 45 chỗ', date: todayStr__constants, price: 180000, status: 'Đã chỉ định xe', note: 'Tăng cường xe 45 chỗ - Rước Kinh Dương Vương', isTemplate: true },
  { id: '5', name: 'Sài Gòn - Châu Đốc (15:30) - Tuyến cố định chiều', time: '15:30', route: 'Sài Gòn - Châu Đốc', plate: '', vehicleType: 'Limousine 24 Phòng', date: todayStr__constants, price: 280000, status: 'Chưa chỉ định xe', note: 'Tuyến cố định chiều - Đón khách VP Q5', isTemplate: true },
  { id: '6', name: 'Sài Gòn - Châu Đốc (17:00) - Chuyến chiều tối', time: '17:00', route: 'Sài Gòn - Châu Đốc', plate: '', vehicleType: 'Giường nằm 34 chỗ', date: todayStr__constants, price: 250000, status: 'Chưa chỉ định xe', note: 'Chuyến chiều tối - Xe giường nằm 34 chỗ', isTemplate: true },
];

const DEFAULT_CDSG_TRIPS = [
  { id: '7', name: 'Châu Đốc - Sài Gòn (06:00) - Xuất bến sớm Bến Xe CD', time: '06:00', route: 'Châu Đốc - Sài Gòn', plate: '51F-123.45', vehicleType: 'Limousine 24 Phòng', date: todayStr__constants, price: 280000, status: 'Đã chỉ định xe', note: 'Xuất bến sớm Bến Xe CD - Trả Q.5 & An Sương', isTemplate: true },
  { id: '8', name: 'Châu Đốc - Sài Gòn (09:15) - Chuyến sáng Châu Đốc', time: '09:15', route: 'Châu Đốc - Sài Gòn', plate: '50H-678.90', vehicleType: 'Giường nằm 34 chỗ', date: todayStr__constants, price: 250000, status: 'Đã chỉ định xe', note: 'Chuyến sáng Châu Đốc - Trung chuyển tận nơi', isTemplate: true },
  { id: '9', name: 'Châu Đốc - Sài Gòn (14:00) - Tuyến cố định rước khách', time: '14:00', route: 'Châu Đốc - Sài Gòn', plate: '', vehicleType: 'Limousine 24 Phòng', date: todayStr__constants, price: 280000, status: 'Chưa chỉ định xe', note: 'Tuyến cố định rước khách dọc đường', isTemplate: true },
  { id: '10', name: 'Châu Đốc - Sài Gòn (21:00) - Chuyến đêm Limousine VIP', time: '21:00', route: 'Châu Đốc - Sài Gòn', plate: '', vehicleType: 'Giường nằm 34 chỗ', date: todayStr__constants, price: 250000, status: 'Chưa chỉ định xe', note: 'Chuyến đêm Limousine VIP - Chạy thẳng Sài Gòn', isTemplate: true },
];

// Thêm phơi mẫu cho các tuyến Long Xuyên/Cần Thơ — trạm đi/đến/trạm đón khớp đúng TRIP_DIRECTIONS_CFG
// (sg-lx/lx-sg/sg-ct/ct-sg, xem callcenter.js) để nút "Bán vé"/lộ trình hoạt động đúng khi nhân bản.
const DEFAULT_EXTRA_TEMPLATE_TRIPS = [
  { id: '11', name: 'Sài Gòn - Long Xuyên (09:00) - Chuyến sáng cao tốc', time: '09:00', route: 'Sài Gòn - Long Xuyên', plate: '', vehicleType: 'Giường nằm 34 chỗ', date: todayStr__constants, price: 150000, status: 'Chưa chỉ định xe', note: 'Chuyến sáng cao tốc - Đón An Sương', fromStation: 'Văn phòng trung tâm', toStation: 'Bến xe Long Xuyên', pickupStations: ['Trạm An Sương'], isTemplate: true },
  { id: '12', name: 'Long Xuyên - Sài Gòn (13:00) - Chuyến trưa về SG', time: '13:00', route: 'Long Xuyên - Sài Gòn', plate: '51F-234.56', vehicleType: 'Limousine 24 Phòng', date: todayStr__constants, price: 150000, status: 'Đã chỉ định xe', note: 'Chuyến trưa về SG - Xuất bến Long Xuyên', fromStation: 'Bến xe Long Xuyên', toStation: 'Văn phòng trung tâm', pickupStations: [], isTemplate: true },
  { id: '13', name: 'Sài Gòn - Cần Thơ (11:00) - Chuyến trưa miền Tây', time: '11:00', route: 'Sài Gòn - Cần Thơ', plate: '', vehicleType: 'Ghế ngồi 45 chỗ', date: todayStr__constants, price: 180000, status: 'Chưa chỉ định xe', note: 'Chuyến trưa miền Tây - Đón An Sương', fromStation: 'Trạm An Sương', toStation: 'Bến Ninh Kiều', pickupStations: ['Trạm An Sương'], isTemplate: true },
  { id: '14', name: 'Cần Thơ - Sài Gòn (16:00) - Chuyến chiều về SG', time: '16:00', route: 'Cần Thơ - Sài Gòn', plate: '50H-789.01', vehicleType: 'Giường nằm 34 chỗ', date: todayStr__constants, price: 180000, status: 'Đã chỉ định xe', note: 'Chuyến chiều về SG - Xuất bến Ninh Kiều', fromStation: 'Bến Ninh Kiều', toStation: 'Văn phòng trung tâm', pickupStations: [], isTemplate: true },
];
