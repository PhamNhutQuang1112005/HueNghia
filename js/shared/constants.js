// Hằng số/dữ liệu dùng chung giữa callcenter và ticketstaff — nội dung giống hệt (đo 07/08/2026).
// CUSTOMER_HISTORY_DATA chưa chuyển vào đây vì phụ thuộc hàm getPastDate() — sẽ chuyển cùng lúc ở
// Giai đoạn 3 khi getPastDate được gộp vào shared/format.js.
// Nạp bằng thẻ <script> thường (không phải module) TRƯỚC script chính của từng trang —
// const top-level ở đây dùng chung được cho các <script> nạp sau trong cùng trang.

const STAFF_CODE_MAP = {
  "tuyetphuong.huenghia": "NV01",
  "minh.tran": "NV02",
  "nguyen.long": "NV03",
  "thi.hoa": "NV04"
};

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
const TS_WINDOW_HOURS = 6;

const todayStr__constants = new Date().toISOString().split("T")[0];

const DEFAULT_SGCD_TRIPS = [
  { id: '1', name: 'Sài Gòn - Châu Đốc (07:00) - Xuất bến VP Q.5', time: '07:00', route: 'Sài Gòn - Châu Đốc', plate: '51F-123.45', vehicleType: 'Limousine 24 Phòng', date: todayStr__constants, price: 280000, status: 'Đang bán', note: 'Xuất bến VP Q.5 - Tải 24 phòng VIP' },
  { id: '2', name: 'Sài Gòn - Châu Đốc (08:30) - Chạy bến An Sương', time: '08:30', route: 'Sài Gòn - Châu Đốc', plate: '50H-678.90', vehicleType: 'Giường nằm 34 chỗ', date: todayStr__constants, price: 250000, status: 'Đã chỉ định xe', note: 'Chạy bến An Sương - Đón dọc QL22' },
  { id: '3', name: 'Sài Gòn - Châu Đốc (10:00) - Chuyến sáng trung tâm', time: '10:00', route: 'Sài Gòn - Châu Đốc', plate: '', vehicleType: 'Limousine 24 Phòng', date: todayStr__constants, price: 280000, status: 'Chưa chỉ định xe', note: 'Chuyến sáng trung tâm - Đã mở bán' },
  { id: '4', name: 'Sài Gòn - Châu Đốc (13:15) - Tăng cường xe 45 chỗ', time: '13:15', route: 'Sài Gòn - Châu Đốc', plate: '50H-345.67', vehicleType: 'Ghế ngồi 45 chỗ', date: todayStr__constants, price: 180000, status: 'Đã chỉ định xe', note: 'Tăng cường xe 45 chỗ - Rước Kinh Dương Vương' },
  { id: '5', name: 'Sài Gòn - Châu Đốc (15:30) - Tuyến cố định chiều', time: '15:30', route: 'Sài Gòn - Châu Đốc', plate: '', vehicleType: 'Limousine 24 Phòng', date: todayStr__constants, price: 280000, status: 'Chưa chỉ định xe', note: 'Tuyến cố định chiều - Đón khách VP Q5' },
  { id: '6', name: 'Sài Gòn - Châu Đốc (17:00) - Chuyến chiều tối', time: '17:00', route: 'Sài Gòn - Châu Đốc', plate: '', vehicleType: 'Giường nằm 34 chỗ', date: todayStr__constants, price: 250000, status: 'Chưa chỉ định xe', note: 'Chuyến chiều tối - Xe giường nằm 34 chỗ' },
];

const DEFAULT_CDSG_TRIPS = [
  { id: '7', name: 'Châu Đốc - Sài Gòn (06:00) - Xuất bến sớm Bến Xe CD', time: '06:00', route: 'Châu Đốc - Sài Gòn', plate: '51F-123.45', vehicleType: 'Limousine 24 Phòng', date: todayStr__constants, price: 280000, status: 'Đã chỉ định xe', note: 'Xuất bến sớm Bến Xe CD - Trả Q.5 & An Sương' },
  { id: '8', name: 'Châu Đốc - Sài Gòn (09:15) - Chuyến sáng Châu Đốc', time: '09:15', route: 'Châu Đốc - Sài Gòn', plate: '50H-678.90', vehicleType: 'Giường nằm 34 chỗ', date: todayStr__constants, price: 250000, status: 'Đã chỉ định xe', note: 'Chuyến sáng Châu Đốc - Trung chuyển tận nơi' },
  { id: '9', name: 'Châu Đốc - Sài Gòn (14:00) - Tuyến cố định rước khách', time: '14:00', route: 'Châu Đốc - Sài Gòn', plate: '', vehicleType: 'Limousine 24 Phòng', date: todayStr__constants, price: 280000, status: 'Chưa chỉ định xe', note: 'Tuyến cố định rước khách dọc đường' },
  { id: '10', name: 'Châu Đốc - Sài Gòn (21:00) - Chuyến đêm Limousine VIP', time: '21:00', route: 'Châu Đốc - Sài Gòn', plate: '', vehicleType: 'Giường nằm 34 chỗ', date: todayStr__constants, price: 250000, status: 'Chưa chỉ định xe', note: 'Chuyến đêm Limousine VIP - Chạy thẳng Sài Gòn' },
];
