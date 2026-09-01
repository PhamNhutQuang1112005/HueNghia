// src/data/sample-trip-templates.js — Dữ liệu MẪU: các "phơi mẫu" cố định (isTemplate:true).
// Tách khỏi js/shared/constants.js (Phase C). Chỉ ticketstaff.js đọc (defaultTripsMeta fallback
// khi localStorage trống) — nạp trước ticketstaff.js trong ticketstaff.html. Không nạp ở admin.html.
// Tự chứa (todayStr__constants nằm luôn trong file này). Sau này thay bằng API => xoá khỏi HTML.

const todayStr__constants = new Date().toISOString().split("T")[0];

// isTemplate:true đánh dấu đây là "phơi mẫu" cố định dùng cho chế độ chọn mẫu tạo hàng loạt (xem
// toggleBulkTemplateMode() trong ticketstaff.js — tính năng Phơi xe trước đây ở callcenter.js, đã
// chuyển hẳn sang ticketstaff.js) — phơi tạo mới (đơn lẻ hay hàng loạt) KHÔNG có cờ này
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
// (sg-lx/lx-sg/sg-ct/ct-sg, xem ticketstaff.js) để nút "Bán vé"/lộ trình hoạt động đúng khi nhân bản.
const DEFAULT_EXTRA_TEMPLATE_TRIPS = [
  { id: '11', name: 'Sài Gòn - Long Xuyên (09:00) - Chuyến sáng cao tốc', time: '09:00', route: 'Sài Gòn - Long Xuyên', plate: '', vehicleType: 'Giường nằm 34 chỗ', date: todayStr__constants, price: 150000, status: 'Chưa chỉ định xe', note: 'Chuyến sáng cao tốc - Đón An Sương', fromStation: 'Văn phòng trung tâm', toStation: 'Bến xe Long Xuyên', pickupStations: ['Trạm An Sương'], isTemplate: true },
  { id: '12', name: 'Long Xuyên - Sài Gòn (13:00) - Chuyến trưa về SG', time: '13:00', route: 'Long Xuyên - Sài Gòn', plate: '51F-234.56', vehicleType: 'Limousine 24 Phòng', date: todayStr__constants, price: 150000, status: 'Đã chỉ định xe', note: 'Chuyến trưa về SG - Xuất bến Long Xuyên', fromStation: 'Bến xe Long Xuyên', toStation: 'Văn phòng trung tâm', pickupStations: [], isTemplate: true },
  { id: '13', name: 'Sài Gòn - Cần Thơ (11:00) - Chuyến trưa miền Tây', time: '11:00', route: 'Sài Gòn - Cần Thơ', plate: '', vehicleType: 'Ghế ngồi 45 chỗ', date: todayStr__constants, price: 180000, status: 'Chưa chỉ định xe', note: 'Chuyến trưa miền Tây - Đón An Sương', fromStation: 'Trạm An Sương', toStation: 'Bến Ninh Kiều', pickupStations: ['Trạm An Sương'], isTemplate: true },
  { id: '14', name: 'Cần Thơ - Sài Gòn (16:00) - Chuyến chiều về SG', time: '16:00', route: 'Cần Thơ - Sài Gòn', plate: '50H-789.01', vehicleType: 'Giường nằm 34 chỗ', date: todayStr__constants, price: 180000, status: 'Đã chỉ định xe', note: 'Chuyến chiều về SG - Xuất bến Ninh Kiều', fromStation: 'Bến Ninh Kiều', toStation: 'Văn phòng trung tâm', pickupStations: [], isTemplate: true },
];
