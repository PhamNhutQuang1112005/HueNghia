// Key localStorage/sessionStorage dùng chung giữa các trang — nguồn duy nhất, tránh lệch key giữa các trang.
// Nạp bằng thẻ <script> thường (không phải module) TRƯỚC script chính của từng trang —
// const top-level ở đây dùng chung được cho các <script> nạp sau trong cùng trang.
const HN_STORAGE_KEY = 'hn_trip_seat_bank_v12';
const HN_TRIPS_KEY = 'hn_trips_meta_v9';
const HN_PICKUP_PAX_KEY = 'hn_pickup_passengers_v6';
const HN_CURRENT_USER_KEY = 'hn_current_user';
const ZONE1_COLLAPSED_KEY = 'callcenter.zone1Collapsed';
// Tài xế trung chuyển gán ở trang shuttle.html, đọc lại ở cột "Tài xế" bảng Trung chuyển đón
// (ticketstaff.html/callcenter.html) — khoá theo "sđt_chặng" (chặng 'don' gộp cả khách Rước liền,
// vì shuttle.html xếp Rước liền vào cùng nhóm "đón" khi đồng bộ từ tripSeatBank).
const HN_SHUTTLE_DRIVER_KEY = 'hn_shuttle_driver_assign_v1';
