/* =========================================================
   SHUTTLE.JS — Điều hành trung chuyển
   Huệ Nghĩa Express

   File này bám sát tài liệu SRS_TrungChuyen.docx. Mỗi khối
   chức năng được chú thích theo đúng mã FR-xx / BR-xx tương
   ứng trong tài liệu để tiện truy vết khi kiểm thử (QA) hoặc
   đối chiếu lại với Product Owner.

   Dữ liệu khách hàng, tài xế trong file này là dữ liệu MẪU
   (mock) để minh họa đầy đủ các luồng nghiệp vụ. Khi triển
   khai thực tế, các mảng "customers" và "vehicles" cần được
   thay bằng dữ liệu lấy từ API (đồng bộ từ hệ thống bán vé và
   hệ thống quản lý đội xe — xem mục 2.3 "Giả định" trong SRS).
   ========================================================= */

/* ---------------------------------------------------------
   MÔ PHỎNG THỜI GIAN HIỆN TẠI (chỉ phục vụ demo)
   Trong hệ thống thật, luôn dùng new Date() thực tế. Ở đây
   ta cố định "now" để các khách "sắp trễ giờ" (BR-02) luôn
   hiển thị đúng trạng thái minh họa mỗi khi mở trang, không
   phụ thuộc vào giờ máy người xem.
--------------------------------------------------------- */
const NOW_SIMULATED = { hour: 6, minute: 20 };
const NOW_MINUTES = NOW_SIMULATED.hour * 60 + NOW_SIMULATED.minute;

// BR-02: ngưỡng "sắp trễ giờ xuất bến" — mặc định 30–45 phút, có thể
// cấu hình theo hệ thống. Ở đây chọn 40 phút làm giá trị demo.
const LATE_THRESHOLD_MINUTES = 40;

function timeStrToMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/* ---------------------------------------------------------
   DỮ LIỆU MẪU — KHÁCH HÀNG CẦN TRUNG CHUYỂN
--------------------------------------------------------- */
let customers = [
  {
    id: "KH01", tab: "don",
    name: "Nguyễn Văn An", phone: "0809123456",
    pax: 2, note: "Có trẻ em", noteImportant: false,
    ward: "Phường 5", district: "Quận 5", addressDetail: "123 Nguyễn Trãi, P.5, Q.5, TP.HCM",
    seats: "A01, A02", ticketPrice: 280000, departTime: "06:45", route: "Sài Gòn - Châu Đốc",
    departStation: "Bến xe Miền Tây", arriveStation: "Bến xe Châu Đốc",
    station: "kdv", manifest: "sang", vehicleClass: "tuyen",
    driverName: null, driverPhone: null, driverPlate: null, driverVehicleType: null,
    status: "waiting", urgentFlag: false
  },
  {
    id: "KH02", tab: "don",
    name: "Trần Thị Mai", phone: "0912345678",
    pax: 1, note: "", noteImportant: false,
    ward: "Phường Bình Hưng Hòa", district: "Bình Tân", addressDetail: "45 Lê Văn Quới, Bình Hưng Hòa, Bình Tân",
    seats: "B03", ticketPrice: 280000, departTime: "07:10", route: "Sài Gòn - Châu Đốc",
    departStation: "Trạm số 4 Tống Văn Trân", arriveStation: "Bến xe Châu Đốc",
    station: "asuong", manifest: "sang", vehicleClass: "tuyen",
    driverName: "Lê Văn Cường", driverPhone: "0907111222", driverPlate: "51B-111.11", driverVehicleType: "Xe 16 chỗ",
    status: "enroute", urgentFlag: false
  },
  {
    id: "KH03", tab: "don",
    name: "Lê Hoàng Nam", phone: "0933778899",
    pax: 4, note: "Hành lý nhiều", noteImportant: true,
    ward: "Phường Tân Sơn Nhì", district: "Tân Phú", addressDetail: "78 Âu Cơ, Tân Sơn Nhì, Tân Phú",
    seats: "A05, A06, A07, A08", ticketPrice: 280000, departTime: "08:00", route: "Sài Gòn - Châu Đốc",
    departStation: "Trạm Q.5", arriveStation: "Bến xe Châu Đốc",
    station: "q5", manifest: "sang", vehicleClass: "hopdong",
    driverName: null, driverPhone: null, driverPlate: null, driverVehicleType: null,
    status: "waiting", urgentFlag: false
  },
  {
    id: "KH04", tab: "don",
    name: "Phạm Thùy Linh", phone: "0987654321",
    pax: 1, note: "Khách VIP — ưu tiên xử lý", noteImportant: true,
    ward: "Phường 12", district: "Quận 10", addressDetail: "56 Sư Vạn Hạnh, P.12, Q.10",
    seats: "A09", ticketPrice: 300000, departTime: "09:00", route: "Sài Gòn - Châu Đốc",
    departStation: "Văn phòng trung tâm", arriveStation: "Bến xe Châu Đốc",
    station: "vp", manifest: "sang", vehicleClass: "tuyen",
    driverName: null, driverPhone: null, driverPlate: null, driverVehicleType: null,
    status: "waiting", urgentFlag: true
  },
  {
    id: "KH05", tab: "don",
    name: "Võ Minh Khoa", phone: "0809654321",
    pax: 3, note: "Không bắt máy 2 lần", noteImportant: true,
    ward: "Xã Bà Điểm", district: "Hóc Môn", addressDetail: "12 Nguyễn Ảnh Thủ, Bà Điểm, Hóc Môn",
    seats: "B10, B11, B12", ticketPrice: 280000, departTime: "07:30", route: "Sài Gòn - Châu Đốc",
    departStation: "Bến xe Miền Tây", arriveStation: "Bến xe Châu Đốc",
    station: "kdv", manifest: "sang", vehicleClass: "tuyen",
    driverName: "Trần Văn Hải", driverPhone: "0907222333", driverPlate: "51B-222.22", driverVehicleType: "Xe 16 chỗ",
    issueType: "Không liên lạc được", status: "issue", urgentFlag: false
  },
  {
    id: "KH06", tab: "don",
    name: "Huỳnh Ngọc Ánh", phone: "0901234567",
    pax: 2, note: "", noteImportant: false,
    ward: "Phường Tân Thới Nhất", district: "Quận 12", addressDetail: "9 Nguyễn Văn Quá, Tân Thới Nhất, Q.12",
    seats: "A13, A14", ticketPrice: 280000, departTime: "06:10", route: "Sài Gòn - Châu Đốc",
    departStation: "Trạm số 4 Tống Văn Trân", arriveStation: "Bến xe Châu Đốc",
    station: "asuong", manifest: "sang", vehicleClass: "tuyen",
    driverName: "Ngô Văn Phúc", driverPhone: "0907333444", driverPlate: "50H-333.33", driverVehicleType: "Xe 7 chỗ",
    status: "enroute", urgentFlag: false
  },
  {
    id: "KH07", tab: "tra",
    name: "Đặng Quốc Huy", phone: "0966998877",
    pax: 2, note: "", noteImportant: false,
    ward: "Phường 4", district: "Quận 5", addressDetail: "34 Trần Hưng Đạo, P.4, Q.5",
    seats: "B01, B02", ticketPrice: 280000, departTime: "10:30", route: "Châu Đốc - Sài Gòn",
    departStation: "Bến xe Châu Đốc", arriveStation: "Trạm Q.5",
    station: "q5", manifest: "chieu", vehicleClass: "tuyen",
    driverName: null, driverPhone: null, driverPlate: null, driverVehicleType: null,
    status: "waiting", urgentFlag: false
  },
  {
    id: "KH08", tab: "tra",
    name: "Bùi Thảo Vy", phone: "0913579246",
    pax: 5, note: "Nhóm gia đình, có người lớn tuổi", noteImportant: true,
    ward: "Phường Tân Hưng Thuận", district: "Quận 12", addressDetail: "22 Tô Ký, Tân Hưng Thuận, Q.12",
    seats: "A15, A16, A17, A18, A19", ticketPrice: 280000, departTime: "06:35", route: "Châu Đốc - Sài Gòn",
    departStation: "Bến xe Châu Đốc", arriveStation: "Bến xe Miền Tây",
    station: "kdv", manifest: "sang", vehicleClass: "hopdong",
    driverName: null, driverPhone: null, driverPlate: null, driverVehicleType: null,
    status: "waiting", urgentFlag: false
  },
  {
    id: "KH09", tab: "tra",
    name: "Nguyễn Thanh Tùng", phone: "0938001122",
    pax: 1, note: "", noteImportant: false,
    ward: "Phường Bình Trị Đông", district: "Bình Tân", addressDetail: "67 Kinh Dương Vương, Bình Trị Đông, Bình Tân",
    seats: "B04", ticketPrice: 280000, departTime: "11:15", route: "Châu Đốc - Sài Gòn",
    departStation: "Bến xe Châu Đốc", arriveStation: "Bến xe Miền Tây",
    station: "kdv", manifest: "chieu", vehicleClass: "tuyen",
    driverName: "Lê Hoài Nam", driverPhone: "0927333444", driverPlate: "51B-444.44", driverVehicleType: "Xe 16 chỗ",
    status: "enroute", urgentFlag: false
  },
  {
    id: "KH10", tab: "tra",
    name: "Lý Thị Hồng", phone: "0989112233",
    pax: 2, note: "", noteImportant: false,
    ward: "Phường Sơn Kỳ", district: "Tân Phú", addressDetail: "15 Gò Dầu, Sơn Kỳ, Tân Phú",
    seats: "A03, A04", ticketPrice: 300000, departTime: "09:45", route: "Châu Đốc - Sài Gòn",
    departStation: "Bến xe Châu Đốc", arriveStation: "Văn phòng trung tâm",
    station: "vp", manifest: "chieu", vehicleClass: "tuyen",
    driverName: "Phạm Đức Duy", driverPhone: "0936444555", driverPlate: "51B-555.55", driverVehicleType: "Xe 7 chỗ",
    status: "enroute", urgentFlag: false
  },
  {
    id: "KH11", tab: "don",
    name: "Cao Văn Đức", phone: "0908771122",
    pax: 2, note: "Khách trạm Bến Cát", noteImportant: false,
    ward: "Phường Mỹ Phước", district: "Bến Cát", addressDetail: "12 Quốc Lộ 13, Mỹ Phước, Bến Cát, Bình Dương",
    seats: "A10, A11", ticketPrice: 200000, departTime: "06:30", route: "Bình Dương - Châu Đốc",
    departStation: "Trạm Bến Cát", arriveStation: "Bến xe Châu Đốc",
    station: "bencat", region: "binhduong", manifest: "sang", vehicleClass: "tuyen",
    driverName: null, driverPhone: null, driverPlate: null, driverVehicleType: null,
    status: "waiting", urgentFlag: false
  },
  {
    id: "KH12", tab: "don",
    name: "Trương Minh Tuấn", phone: "0967345678",
    pax: 1, note: "", noteImportant: false,
    ward: "Phường Phú Chánh", district: "Tân Uyên", addressDetail: "45 ĐT742, Phú Chánh, Tân Uyên, Bình Dương",
    seats: "B05", ticketPrice: 200000, departTime: "08:15", route: "Bình Dương - Châu Đốc",
    departStation: "Trạm Phú Chánh", arriveStation: "Bến xe Châu Đốc",
    station: "phuchanh", region: "binhduong", manifest: "sang", vehicleClass: "tuyen",
    driverName: "Nguyễn Văn Bình", driverPhone: "0909111222", driverPlate: "61B-001.23", driverVehicleType: "Xe 16 chỗ",
    status: "enroute", urgentFlag: false
  },
  {
    id: "KH13", tab: "don",
    name: "Nguyễn Thị Hoa", phone: "0903445566",
    pax: 3, note: "", noteImportant: false,
    ward: "Thị trấn Châu Đốc", district: "Châu Đốc", addressDetail: "89 Lê Lợi, Châu Đốc, An Giang",
    seats: "A01, A02, A03", ticketPrice: 150000, departTime: "07:45", route: "Châu Đốc - Sài Gòn",
    departStation: "Trạm Châu Đốc", arriveStation: "Trạm 508 KDV",
    station: "chaudoc", region: "angiang", manifest: "sang", vehicleClass: "tuyen",
    driverName: null, driverPhone: null, driverPlate: null, driverVehicleType: null,
    status: "waiting", urgentFlag: false
  },
  {
    id: "KH14", tab: "don",
    name: "Trần Văn Tấn", phone: "0971223344",
    pax: 1, note: "Ưu tiên rước sớm", noteImportant: true,
    ward: "Thị trấn An Phú", district: "An Phú", addressDetail: "123 Thoại Ngọc Hầu, An Phú, An Giang",
    seats: "B02", ticketPrice: 160000, departTime: "05:30", route: "An Phú - Sài Gòn",
    departStation: "Trạm An Phú", arriveStation: "Trạm 508 KDV",
    station: "anphu", region: "angiang", manifest: "sang", vehicleClass: "tuyen",
    driverName: "Trịnh Công Sơn", driverPhone: "0918222333", driverPlate: "67B-002.34", driverVehicleType: "Xe 7 chỗ",
    status: "enroute", urgentFlag: true
  },
  {
    id: "KH15", tab: "don",
    name: "Lâm Quốc Trọng", phone: "0982334455",
    pax: 2, note: "", noteImportant: false,
    ward: "Thị trấn Trảng Bàng", district: "Trảng Bàng", addressDetail: "56 QL22, Trảng Bàng, Tây Ninh",
    seats: "A07, A08", ticketPrice: 180000, departTime: "09:15", route: "Tây Ninh - Sài Gòn",
    departStation: "Trạm Trảng Bàng", arriveStation: "Trạm số 4 TVT",
    station: "trangbang", region: "tayninh", manifest: "sang", vehicleClass: "hopdong",
    driverName: null, driverPhone: null, driverPlate: null, driverVehicleType: null,
    status: "waiting", urgentFlag: false
  }
];


/* ---------------------------------------------------------
   CẤU HÌNH TRẠM VÀ KHU VỰC
--------------------------------------------------------- */
const STATIONS_BY_REGION = {
  saigon: [
    { value: "kdv", label: "Trạm 508 KDV" },
    { value: "tvt", label: "Trạm số 4 TVT" },
    { value: "ldh", label: "Trạm số 58 LDH" },
    { value: "asuong", label: "Trạm An Sương" },
    { value: "q5", label: "Trạm Q.5" },
    { value: "vp", label: "Văn phòng trung tâm" }
  ],
  binhduong: [
    { value: "bencat", label: "Trạm Bến Cát" },
    { value: "phuchanh", label: "Trạm Phú Chánh" },
    { value: "tudang", label: "Trạm Thủ Dầu Một" }
  ],
  angiang: [
    { value: "chaudoc", label: "Trạm Châu Đốc" },
    { value: "anphu", label: "Trạm An Phú" },
    { value: "triton", label: "Trạm Tri Tôn" },
    { value: "tanchau", label: "Trạm Tân Châu" }
  ],
  tayninh: [
    { value: "tayninh", label: "Trạm Tây Ninh" },
    { value: "trangbang", label: "Trạm Trảng Bàng" }
  ]
};

const REGION_NAMES = {
  saigon: "Sài Gòn",
  binhduong: "Bình Dương",
  angiang: "An Giang",
  tayninh: "Tây Ninh"
};

const STATION_REGION_MAP = {
  kdv: "saigon", tvt: "saigon", ldh: "saigon", asuong: "saigon", q5: "saigon", vp: "saigon",
  bencat: "binhduong", phuchanh: "binhduong", tudang: "binhduong",
  chaudoc: "angiang", anphu: "angiang", triton: "angiang", tanchau: "angiang",
  tayninh: "tayninh", trangbang: "tayninh"
};

function getCustomerRegion(c) {
  if (c.region) return c.region;
  return STATION_REGION_MAP[c.station] || "saigon";
}

function populateStationDropdown(selectedRegion = "all") {
  const stationSelect = document.getElementById("filterStation");
  if (!stationSelect) return;

  const currentVal = stationSelect.value;

  if (selectedRegion === "all") {
    let html = `<option value="all">Tất cả trạm</option>`;
    for (const [rCode, rName] of Object.entries(REGION_NAMES)) {
      const stations = STATIONS_BY_REGION[rCode] || [];
      if (stations.length > 0) {
        html += `<optgroup label="${rName}">`;
        stations.forEach(s => {
          html += `<option value="${s.value}">${s.label}</option>`;
        });
        html += `</optgroup>`;
      }
    }
    stationSelect.innerHTML = html;
  } else {
    const rName = REGION_NAMES[selectedRegion] || "";
    const stations = STATIONS_BY_REGION[selectedRegion] || [];
    let html = `<option value="all">Tất cả trạm (${rName})</option>`;
    stations.forEach(s => {
      html += `<option value="${s.value}">${s.label}</option>`;
    });
    stationSelect.innerHTML = html;
  }

  if (currentVal && Array.from(stationSelect.options).some(o => o.value === currentVal)) {
    stationSelect.value = currentVal;
  } else {
    stationSelect.value = "all";
  }
}

function onRegionChange() {
  const region = document.getElementById("filterRegion") ? document.getElementById("filterRegion").value : "all";
  populateStationDropdown(region);
  applyFilters();
}

/* ---------------------------------------------------------
   DỮ LIỆU MẪU — DANH SÁCH TÀI XẾ TRUNG CHUYỂN
   --------------------------------------------------------- */
const driversPool = [
  { id: "TX01", driverName: "Nguyễn Văn Bình", driverPhone: "0909111222", license: "D" },
  { id: "TX02", driverName: "Trịnh Công Sơn", driverPhone: "0918222333", license: "B2" },
  { id: "TX03", driverName: "Lê Hoài Nam", driverPhone: "0927333444", license: "E" },
  { id: "TX04", driverName: "Phạm Đức Duy", driverPhone: "0936444555", license: "D" },
  { id: "TX05", driverName: "Trần Văn Hải", driverPhone: "0907222333", license: "FC" }
];

/* ---------------------------------------------------------
   STATE
--------------------------------------------------------- */
let currentTab = "don";           // "don" | "tra" | "ruoclien"  (FR-02)
let selectedIds = new Set();      // Các dòng khách đang được chọn (FR-05)
let selectedVehicleId = null;     // Xe đang chọn trong popup gán tài xế (FR-07)
let issueTargetId = null;         // Khách hàng đang thao tác báo sự cố (BR-06)

const searchInput = document.getElementById("globalSearch");
const searchResults = document.getElementById("searchResults");
const tableBody = document.getElementById("tableBody");
const gridEmpty = document.getElementById("gridEmpty");
const actionBar = document.getElementById("actionBar");
const toast = document.getElementById("toast");
const toastText = document.getElementById("toastText");

/* =========================================================
   BR-02: Xác định khách "sắp trễ giờ xuất bến"
   ========================================================= */
function isLateSoon(customer) {
  const diff = timeStrToMinutes(customer.departTime) - NOW_MINUTES;
  return diff >= 0 && diff < LATE_THRESHOLD_MINUTES;
}

/* =========================================================
   BR-03: Một khách được coi là thuộc tab "Rước liền" nếu:
   - thỏa BR-02 (sắp trễ giờ), HOẶC
   - được đánh dấu thủ công (urgentFlag = true), HOẶC
   - đang ở trạng thái "Sự cố" (cần điều hành viên can thiệp ngay)
   Khách vẫn xuất hiện song song ở tab gốc (đón/trả) của họ.
   ========================================================= */
function isUrgent(customer) {
  return isLateSoon(customer) || customer.urgentFlag || customer.status === "issue";
}

/* =========================================================
   FR-03: Áp dụng bộ lọc (kết hợp AND) + tab hiện tại
   ========================================================= */
function getFilteredList() {
  const region = document.getElementById("filterRegion") ? document.getElementById("filterRegion").value : "all";
  const station = document.getElementById("filterStation") ? document.getElementById("filterStation").value : "all";
  const departTimeFilter = document.getElementById("filterDepartTime") ? document.getElementById("filterDepartTime").value : "all";
  const statusFilter = document.getElementById("filterStatus") ? document.getElementById("filterStatus").value : "all";
  const driverFilter = document.getElementById("filterDriver") ? document.getElementById("filterDriver").value : "all";

  let list = customers.filter((c) => {
    // 1. Tab hiện tại
    if (currentTab === "ruoclien") {
      if (c.tab !== "ruoclien" && !isUrgent(c)) return false;
    } else {
      if (c.tab !== currentTab) return false;
    }

    // 2. Lọc Khu vực
    if (region !== "all" && getCustomerRegion(c) !== region) return false;

    // 3. Lọc Trạm
    if (station !== "all" && c.station !== station) return false;

    // 4. Lọc Giờ đi
    if (departTimeFilter !== "all" && c.departTime) {
      const mins = timeStrToMinutes(c.departTime);
      if (departTimeFilter === "05-07" && (mins < 300 || mins >= 420)) return false;
      if (departTimeFilter === "07-09" && (mins < 420 || mins >= 540)) return false;
      if (departTimeFilter === "09-11" && (mins < 540 || mins >= 660)) return false;
      if (departTimeFilter === "11+" && mins < 660) return false;
    }

    // 5. Lọc Trạng thái
    if (statusFilter !== "all" && c.status !== statusFilter) return false;

    // 6. Lọc Tài xế
    if (driverFilter !== "all") {
      if (driverFilter === "unassigned" && c.driverName) return false;
      if (driverFilter === "assigned" && !c.driverName) return false;
      if (driverFilter.startsWith("TX")) {
        const dObj = driversPool.find(d => d.id === driverFilter);
        if (dObj && c.driverName !== dObj.driverName) return false;
      }
    }

    return true;
  });

  // BR-01: luôn sắp xếp theo giờ khởi hành tăng dần (áp dụng cả 3 tab)
  list.sort((a, b) => timeStrToMinutes(a.departTime) - timeStrToMinutes(b.departTime));

  return list;
}

function applyFilters() {
  renderTable();
}

function resetFilters() {
  if (document.getElementById("filterRegion")) document.getElementById("filterRegion").value = "all";
  populateStationDropdown("all");
  if (document.getElementById("filterStation")) document.getElementById("filterStation").value = "all";
  if (document.getElementById("filterDepartTime")) document.getElementById("filterDepartTime").value = "all";
  if (document.getElementById("filterStatus")) document.getElementById("filterStatus").value = "all";
  if (document.getElementById("filterDriver")) document.getElementById("filterDriver").value = "all";
  goToday();
  renderTable();
}

/* =========================================================
   FR-02: Chuyển tab trạng thái khách hàng
   ========================================================= */
function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll(".side-tab").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });
  // Đổi tab -> danh sách chọn của tab cũ không còn phù hợp nữa
  clearSelection();
  renderTable();
}

function updateTabBadges() {
  // Badge trên tab đã bỏ khỏi UI header — giữ hàm để không phá các chỗ gọi.
}

const STATUS_LABELS = {
  waiting: { text: "Chờ điều phối", cls: "status-waiting" },
  enroute: { text: "Đang trung chuyển", cls: "status-enroute" },
  onboard: { text: "Đã đón", cls: "status-onboard" },
  issue: { text: "Không đón được", cls: "status-issue" }
};

/* =========================================================
   FR-04: Render bảng danh sách khách cần trung chuyển
   ========================================================= */
function renderTable() {
  const list = getFilteredList();
  updateTabBadges();

  if (list.length === 0) {
    tableBody.innerHTML = "";
    gridEmpty.style.display = "block";
    document.getElementById("checkAll").checked = false;
    return;
  }
  gridEmpty.style.display = "none";

  tableBody.innerHTML = list.map((c, index) => {
    const late = isLateSoon(c);
    const statusInfo = STATUS_LABELS[c.status];
    const isSelected = selectedIds.has(c.id);
    const statusText = statusInfo.text;

    const driverCell = c.driverName
      ? `<div class="driver-name" title="Bằng lái: ${(c.driverLicense || '—')} · Biển số: ${c.driverPlate || '—'} · Loại xe: ${c.driverVehicleType || '—'}">${c.driverName}</div>
         <div class="driver-phone">${c.driverPhone || '—'}</div>`
      : `<span class="driver-empty">Chưa gán tài xế</span>`;

    return `
      <tr class="${isSelected ? "selected-row" : ""}" data-id="${c.id}">
        <td class="col-check">
          <input type="checkbox" ${isSelected ? "checked" : ""} data-change-action="toggleRow" data-args='["${c.id}","__this__"]'>
        </td>
        <td class="col-stt">${index + 1}</td>
        <td class="col-customer">
          <div class="cell-name">${c.name}${c.urgentFlag ? " ⭐" : ""}</div>
          <div class="cell-phone">${c.phone}</div>
        </td>
        <td class="col-addr">
          <div class="addr-detail">${c.addressDetail}</div>
        </td>
        <td class="col-pax">
          <span class="pax-chip">${c.pax}</span>
        </td>
        <td class="col-seats">
          <div class="seats-box" title="${c.seats}">${c.seats}</div>
        </td>
        <td class="col-trip">
          <div class="${late ? "ticket-cell late" : ""}">
            <div class="ticket-time">${c.departTime} - ${c.departDate || "18/07/2026"}${late ? ' <span class="late-blink-icon">⚠️</span>' : ""}</div>
            <div class="ticket-route">${c.departStation} → ${c.arriveStation}</div>
          </div>
        </td>
        <td class="col-price">
          <div class="ticket-price">${c.ticketPrice.toLocaleString('vi-VN')}đ</div>
        </td>
        <td class="col-driver">
          ${driverCell}
        </td>
        <td class="col-status">
          <span class="status-label ${statusInfo.cls}">${statusText}</span>
        </td>
        <td class="col-note">
          ${c.note ? `<div class="cell-note ${c.noteImportant ? "important" : ""}" title="${c.note}">${c.note}</div>` : "—"}
        </td>
        <td class="col-actions">
          <div class="table-actions">
            <button type="button" class="btn btn-secondary btn-rect" data-action="openUpdateStatusModal" data-args='["${c.id}"]' title="Cập nhật trạng thái, tài xế">
              Cập nhật
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  document.getElementById("checkAll").checked = list.every((c) => selectedIds.has(c.id));
}

/* =========================================================
   FR-05: Chọn nhiều khách hàng (multi-select)
   ========================================================= */
function toggleRow(id, checkboxEl) {
  if (checkboxEl.checked) selectedIds.add(id);
  else selectedIds.delete(id);
  syncRowHighlight(id, checkboxEl.checked);
  updateActionBar();
}

function syncRowHighlight(id, isSelected) {
  const row = tableBody.querySelector(`tr[data-id="${id}"]`);
  if (row) row.classList.toggle("selected-row", isSelected);
}

function toggleAll(checkboxEl) {
  const list = getFilteredList();
  if (checkboxEl.checked) {
    list.forEach((c) => selectedIds.add(c.id));
  } else {
    list.forEach((c) => selectedIds.delete(c.id));
  }
  renderTable();
  updateActionBar();
}

function clearSelection() {
  selectedIds.clear();
  renderTable();
  updateActionBar();
}

// Hàm gán tài xế riêng cho 1 khách hàng (kể cả khách đã được chỉ định trước đó)
/* =========================================================
   FR-06: Khung thao tác Gán Tài Xế (Action Bar)
   ========================================================= */
function updateActionBar() {
  const count = selectedIds.size;
  if (count === 0) {
    actionBar.classList.remove("show");
    return;
  }
  const selectedCusts = customers.filter((c) => selectedIds.has(c.id));
  const totalPax = selectedCusts.reduce((sum, c) => sum + c.pax, 0);

  document.getElementById("actionCount").textContent = `Đã chọn ${count} khách`;
  document.getElementById("actionPax").textContent = `${totalPax} pax`;

  // Hiển thị cảnh báo nếu chọn nhiều khách
  const assignedCount = selectedCusts.filter((c) => c.driverName).length;
  const statuses = new Set(selectedCusts.map((c) => c.status));

  let warningEl = document.getElementById("actionWarning");
  if (!warningEl) {
    warningEl = document.createElement("span");
    warningEl.id = "actionWarning";
    warningEl.style.cssText = "color: #ef4444; font-size: 12px; font-weight: 600; margin-left: 10px;";
    const infoBox = document.querySelector(".action-bar-info");
    if (infoBox) infoBox.appendChild(warningEl);
  }

  let warnings = [];
  if (count > 1 && assignedCount > 0) {
    warnings.push(`${assignedCount} khách đã gán tài`);
  }
  if (count > 1 && statuses.size > 1) {
    warnings.push(`không cùng trạng thái`);
  }

  if (warnings.length > 0) {
    warningEl.textContent = `⚠️ (${warnings.join(" • ")})`;
    warningEl.style.display = "inline";
  } else if (warningEl) {
    warningEl.style.display = "none";
  }

  actionBar.classList.add("show");
}

/* =========================================================
   FR-07: Popup chọn tài xế & xe trung chuyển
   ========================================================= */
function openAssignModal() {
  if (selectedIds.size === 0) return;

  const selectedCusts = customers.filter((c) => selectedIds.has(c.id));

  // RÀNG BUỘC NGHIỆP VỤ: Tài xế đã được chỉ định rồi thì KHÔNG được chỉ định lại khi chọn nhiều khách hàng.
  // Muốn gán lại khách đã gán thì phải chọn riêng khách đó thôi (selectedIds.size === 1).
  if (selectedIds.size > 1) {
    const alreadyAssigned = selectedCusts.filter((c) => c.driverName);
    if (alreadyAssigned.length > 0) {
      const names = alreadyAssigned.map((c) => c.name).join(", ");
      showToast(`Không thể gán lại tài xế khi chọn nhiều khách (${names}). Vui lòng chọn riêng từng khách để gán lại!`);
      return;
    }
  }

  const driverSelect = document.getElementById("assignDriverSelect");
  driverSelect.innerHTML = `<option value="">-- Chọn tài xế trung chuyển --</option>` +
    driversPool.map((d) => `<option value="${d.id}">Tài xế ${d.driverName} — SĐT: ${d.driverPhone} (${d.license.replace(/^Bằng\s*/i, '')})</option>`).join("");

  driverSelect.value = "";
  document.getElementById("assignVehicleTypeSelect").selectedIndex = 0;
  document.getElementById("assignPlateSelect").selectedIndex = 0;
  document.getElementById("dispatchErrorBox").style.display = "none";
  document.getElementById("confirmAssignBtn").disabled = true;

  const totalPax = getSelectedTotalPax();
  document.getElementById("assignSummary").textContent =
    `Đang gán cho ${selectedIds.size} khách — tổng ${totalPax} pax`;

  document.getElementById("assignModal").classList.add("open");
}

function getSelectedTotalPax() {
  return customers
    .filter((c) => selectedIds.has(c.id))
    .reduce((sum, c) => sum + c.pax, 0);
}

function onAssignFormChange() {
  const driverId = document.getElementById("assignDriverSelect").value;
  document.getElementById("confirmAssignBtn").disabled = !driverId;
  document.getElementById("dispatchErrorBox").style.display = "none";
}

// Ghép "sđt_chặng" — chặng 'don' gộp cả tab 'ruoclien' vì phía ticketstaff/callcenter gộp chung khách
// Rước liền vào bảng "Trung chuyển đón". Dùng cùng công thức này để ghi và để đọc lại ở 2 trang kia.
function shuttleDriverLegKey(phone, tab) {
  return `${(phone || '').replace(/\s+/g, '')}_${tab === 'tra' ? 'tra' : 'don'}`;
}

// Gán tài xế ở trang shuttle chỉ lưu tạm trong biến `customers` (mất khi tải lại/đồng bộ lại từ
// tripSeatBank) — ghi thêm vào localStorage riêng để ticketstaff.html/callcenter.html đọc được tên
// tài xế thật ở cột "Tài xế" bảng Trung chuyển đón, thay vì tên giả cố định như trước.
function persistShuttleDriverAssignment(assignedCusts, driver, plate, vehicleType) {
  try {
    const raw = localStorage.getItem(HN_SHUTTLE_DRIVER_KEY);
    const map = raw ? JSON.parse(raw) : {};
    assignedCusts.forEach((c) => {
      if (!c.phone) return;
      map[shuttleDriverLegKey(c.phone, c.tab)] = {
        driverName: driver.driverName,
        driverPhone: driver.driverPhone,
        driverPlate: plate,
        driverVehicleType: vehicleType,
        // Ghi chú của khách/chuyến nhập ở trang shuttle (c.note) — ticketstaff đọc lại để hiện dưới tên
        // tài xế ở cột "Trung chuyển" bảng Rước liền/Trung chuyển.
        driverNote: c.note || ''
      };
    });
    const jsonStr = JSON.stringify(map);
    localStorage.setItem(HN_SHUTTLE_DRIVER_KEY, jsonStr);
    window.dispatchEvent(new StorageEvent('storage', {
      key: HN_SHUTTLE_DRIVER_KEY,
      newValue: jsonStr,
      storageArea: localStorage
    }));
  } catch (e) { }
}

function confirmAssign() {
  const driverId = document.getElementById("assignDriverSelect").value;
  if (!driverId) return;

  const selectedCusts = customers.filter((c) => selectedIds.has(c.id));
  if (selectedIds.size > 1) {
    const alreadyAssigned = selectedCusts.filter((c) => c.driverName);
    if (alreadyAssigned.length > 0) {
      const names = alreadyAssigned.map((c) => c.name).join(", ");
      showToast(`Không thể gán lại tài xế khi chọn nhiều khách (${names}). Vui lòng chọn riêng từng khách!`);
      closeModal("assignModal");
      return;
    }
  }

  const driver = driversPool.find((d) => d.id === driverId);
  const vehicleType = document.getElementById("assignVehicleTypeSelect").value;
  const plate = document.getElementById("assignPlateSelect").value;
  const totalPax = getSelectedTotalPax();

  // FR-07 — Xử lý lỗi: mô phỏng ~15% khả năng đẩy lệnh thất bại
  const dispatchFailed = Math.random() < 0.15;

  if (dispatchFailed) {
    document.getElementById("dispatchErrorBox").style.display = "flex";
    return;
  }

  // Lưu danh sách khách được gán để in vé trung chuyển
  const assignedList = customers.filter((c) => selectedIds.has(c.id));

  // Thành công: cập nhật cột "Tài xế trung chuyển" + "Trạng thái hiện tại"
  customers.forEach((c) => {
    if (selectedIds.has(c.id)) {
      c.driverName = driver.driverName;
      c.driverPhone = driver.driverPhone;
      c.driverLicense = driver.license;
      c.driverPlate = plate;
      c.driverVehicleType = vehicleType;
      c.status = "enroute";
    }
  });
  persistShuttleDriverAssignment(assignedList, driver, plate, vehicleType);

  closeModal("assignModal");
  clearSelection();
  showToast(`Đã điều phối ${totalPax} pax cho tài xế ${driver.driverName} (${plate} - ${vehicleType}).`);

  // Phối hợp thông tin gán để mở Modal In vé trung chuyển
  const vehicleInfo = {
    driverName: driver.driverName,
    driverPhone: driver.driverPhone,
    driverLicense: driver.license,
    plate: plate,
    vehicleType: vehicleType
  };
  openPrintTicketModal(assignedList, vehicleInfo);
}

/* =========================================================
   IN VÉ / PHƠI TRUNG CHUYỂN CHO TÀI XẾ
   ========================================================= */
function openPrintTicketModal(assignedList, vehicle) {
  if (!assignedList || assignedList.length === 0) return;

  const container = document.getElementById("printTicketContainer");
  const now = new Date();
  const printTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} - ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
  const totalPax = assignedList.reduce((sum, c) => sum + c.pax, 0);

  container.innerHTML = `
    <div class="ticket-receipt">
      <div class="ticket-receipt-head">
        <div class="ticket-receipt-brand">NHÀ XE HUỆ NGHĨA EXPRESS</div>
        <div class="ticket-receipt-title">PHIẾU ĐIỀU PHỐI TRUNG CHUYỂN KHÁCH HÀNG</div>
        <div class="ticket-receipt-meta">Thời gian xuất lệnh: ${printTimeStr}</div>
      </div>

      <div class="ticket-driver-box">
        <div><b>Tài xế nhận lệnh:</b> ${vehicle.driverName} (${(vehicle.driverLicense || 'D').replace(/^Bằng\s*/i, '')})</div>
        <div><b>Số điện thoại tài xế:</b> ${vehicle.driverPhone}</div>
        <div><b>Biển số xe chỉ định:</b> ${vehicle.plate}</div>
        <div><b>Loại xe chỉ định:</b> ${vehicle.vehicleType}</div>
        <div><b>Tổng số khách:</b> ${assignedList.length} lượt khách (${totalPax} pax)</div>
      </div>

      <table class="ticket-table">
        <thead>
          <tr>
            <th style="width:30px; text-align:center;">STT</th>
            <th style="width:130px;">Tên khách & SĐT</th>
            <th>Địa chỉ đón / trả</th>
            <th style="width:50px; text-align:center;">Số vé</th>
            <th style="width:70px;">Số ghế</th>
            <th style="width:130px;">Chuyến đi & Giờ</th>
            <th style="width:75px; text-align:right;">Giá vé</th>
            <th style="width:90px;">Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          ${assignedList.map((c, idx) => `
            <tr>
              <td style="text-align:center; font-weight:600;">${idx + 1}</td>
              <td>
                <b>${c.name}</b><br>
                <span style="font-size:11px; color:#555;">${c.phone}</span>
              </td>
              <td>${c.addressDetail}</td>
              <td style="text-align:center; font-weight:700;">${c.pax}</td>
              <td><b>${c.seats}</b></td>
              <td>
                <b>${c.departTime}</b> - ${c.departDate || "18/07/2026"}<br>
                <span style="font-size:10.5px; color:#555;">${c.departStation} ➔ ${c.arriveStation}</span>
              </td>
              <td style="text-align:right; font-weight:600;">${c.ticketPrice.toLocaleString('vi-VN')}đ</td>
              <td>${c.note || "—"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <div class="ticket-sign-row">
        <div class="ticket-sign-box">
          <b>Điều hành viên</b>
          <span>(Ký & ghi rõ họ tên)</span>
          <div class="ticket-sign-space"></div>
        </div>
        <div class="ticket-sign-box">
          <b>Tài xế nhận lệnh</b>
          <span>(Ký & ghi rõ họ tên)</span>
          <div class="ticket-sign-space"></div>
        </div>
      </div>
    </div>
  `;

  document.getElementById("printTicketModal").classList.add("open");
}

function triggerPrintTicket() {
  window.print();
}

/* =========================================================
   CẬP NHẬT TRẠNG THÁI KHÁCH HÀNG (CÁ NHÂN & HÀNG LOẠT)
   ========================================================= */
function openUpdateStatusModal(id) {
  const c = customers.find((cust) => cust.id === id);
  if (!c) return;

  document.getElementById("updateStatusTargetId").value = id;
  if (document.getElementById("updateStatusModalTitle")) {
    document.getElementById("updateStatusModalTitle").textContent = "Cập nhật trạng thái khách hàng";
  }
  document.getElementById("updateStatusCustomerLabel").textContent = `Khách hàng: ${c.name} (${c.phone})`;
  document.getElementById("statusSelect").value = c.status;

  const reasonBox = document.getElementById("statusReasonBox");
  const reasonInput = document.getElementById("statusReasonInput");

  if (c.status === "issue") {
    reasonBox.style.display = "flex";
    reasonInput.value = c.note || "";
  } else {
    reasonBox.style.display = "none";
    reasonInput.value = "";
  }

  // Gán tài xế gộp chung vào modal này — chỉ áp dụng cho 1 khách lẻ, không hiện ở cập nhật hàng loạt
  document.getElementById("statusDriverSection").style.display = "block";
  const driverSelect = document.getElementById("statusDriverSelect");
  driverSelect.innerHTML = `<option value="">-- Giữ nguyên / chưa gán --</option>` +
    driversPool.map((d) => `<option value="${d.id}">Tài xế ${d.driverName} — SĐT: ${d.driverPhone} (${d.license.replace(/^Bằng\s*/i, '')})</option>`).join("");
  const currentDriver = driversPool.find((d) => d.driverName === c.driverName);
  driverSelect.value = currentDriver ? currentDriver.id : "";
  document.getElementById("statusVehicleTypeSelect").value = c.driverVehicleType || "Xe 16 chỗ";
  document.getElementById("statusPlateSelect").value = c.driverPlate || "51B-666.66";

  document.getElementById("updateStatusModal").classList.add("open");
}

// Mở modal Cập nhật trạng thái HÀNG LOẠT (chỉ cho phép khi các khách được chọn CÙNG TRẠNG THÁI)
function openBulkUpdateStatusModal() {
  if (selectedIds.size === 0) return;

  const selectedCusts = customers.filter((c) => selectedIds.has(c.id));
  const firstStatus = selectedCusts[0].status;
  const sameStatus = selectedCusts.every((c) => c.status === firstStatus);

  if (!sameStatus) {
    showToast(`Không thể cập nhật trạng thái hàng loạt: Các khách hàng đã chọn KHÔNG có cùng trạng thái hiện tại. Vui lòng chọn nhóm khách có cùng trạng thái!`);
    return;
  }

  document.getElementById("updateStatusTargetId").value = "BULK";
  if (document.getElementById("updateStatusModalTitle")) {
    document.getElementById("updateStatusModalTitle").textContent = "Cập nhật trạng thái hàng loạt";
  }

  const currentStatusLabel = STATUS_LABELS[firstStatus] ? STATUS_LABELS[firstStatus].text : firstStatus;
  const totalPax = selectedCusts.reduce((sum, c) => sum + c.pax, 0);

  document.getElementById("updateStatusCustomerLabel").textContent =
    `Đang chọn ${selectedIds.size} khách hàng (${totalPax} pax) — Trạng thái hiện tại: "${currentStatusLabel}"`;

  document.getElementById("statusSelect").value = firstStatus;

  const reasonBox = document.getElementById("statusReasonBox");
  const reasonInput = document.getElementById("statusReasonInput");

  if (firstStatus === "issue") {
    reasonBox.style.display = "flex";
    reasonInput.value = "";
  } else {
    reasonBox.style.display = "none";
    reasonInput.value = "";
  }

  // Gán tài xế hàng loạt đã có luồng riêng (nút "Chỉ định tài xế" trên action bar) — ẩn phần này đi
  document.getElementById("statusDriverSection").style.display = "none";

  document.getElementById("updateStatusModal").classList.add("open");
}

function onStatusSelectChange() {
  const statusVal = document.getElementById("statusSelect").value;
  const reasonBox = document.getElementById("statusReasonBox");
  reasonBox.style.display = (statusVal === "issue") ? "flex" : "none";
}

function saveStatusUpdate() {
  const targetVal = document.getElementById("updateStatusTargetId").value;
  const newStatus = document.getElementById("statusSelect").value;
  const noteVal = document.getElementById("statusReasonInput").value.trim();

  if (targetVal === "BULK") {
    if (selectedIds.size === 0) return;

    const selectedCusts = customers.filter((c) => selectedIds.has(c.id));
    const firstStatus = selectedCusts[0].status;
    const sameStatus = selectedCusts.every((c) => c.status === firstStatus);

    if (!sameStatus) {
      showToast(`Các khách hàng chọn không cùng trạng thái. Không thể cập nhật!`);
      closeModal("updateStatusModal");
      return;
    }

    selectedCusts.forEach((c) => {
      c.status = newStatus;
      if (newStatus === "issue") {
        c.note = noteVal || "Không liên lạc được";
        c.noteImportant = true;
      } else {
        c.note = "";
        c.noteImportant = false;
      }
    });

    closeModal("updateStatusModal");
    clearSelection();
    renderTable();
    showToast(`Đã cập nhật trạng thái cho ${selectedCusts.length} khách hàng thành "${STATUS_LABELS[newStatus].text}".`);
  } else {
    const c = customers.find((cust) => cust.id === targetVal);
    if (!c) return;

    c.status = newStatus;

    if (newStatus === "issue") {
      c.note = noteVal || "Không liên lạc được";
      c.noteImportant = true;
    } else {
      c.note = "";
      c.noteImportant = false;
    }

    const driverId = document.getElementById("statusDriverSelect").value;
    let driverMsg = "";
    if (driverId) {
      const driver = driversPool.find((d) => d.id === driverId);
      c.driverName = driver.driverName;
      c.driverPhone = driver.driverPhone;
      c.driverLicense = driver.license;
      c.driverVehicleType = document.getElementById("statusVehicleTypeSelect").value;
      c.driverPlate = document.getElementById("statusPlateSelect").value;
      driverMsg = ` và gán tài xế ${driver.driverName}`;
      persistShuttleDriverAssignment([c], driver, c.driverPlate, c.driverVehicleType);
    }

    closeModal("updateStatusModal");
    renderTable();
    showToast(`Đã cập nhật trạng thái khách "${c.name}" thành "${STATUS_LABELS[newStatus].text}"${driverMsg}.`);
  }
}

/* =========================================================
   BR-06: Báo sự cố / Không liên lạc được (thủ công)
   ========================================================= */
function openIssueModal(id) {
  issueTargetId = id;
  const customer = customers.find((c) => c.id === id);
  document.getElementById("issueCustomerLabel").textContent = `Khách hàng: ${customer.name} — ${customer.phone}`;
  document.getElementById("issueType").value = "Không liên lạc được";
  document.getElementById("issueNote").value = "";
  document.getElementById("issueModal").classList.add("open");
}

function confirmIssue() {
  const customer = customers.find((c) => c.id === issueTargetId);
  if (!customer) return;
  const issueType = document.getElementById("issueType").value;
  const note = document.getElementById("issueNote").value.trim();
  customer.status = "issue";
  customer.issueType = issueType;
  customer.note = `[${issueType}]` + (note ? `: ${note}` : "");
  customer.noteImportant = true;
  closeModal("issueModal");
  renderTable();
  showToast(`Đã báo sự cố cho khách "${customer.name}".`);
}

/* =========================================================
   FR-01: Thanh tìm kiếm nhanh (Global Search)
   Hỗ trợ: SĐT (tối thiểu 3 số cuối), mã vé, tên khách (gần đúng,
   không phân biệt hoa/thường, có dấu/không dấu), biển số xe.
   ========================================================= */
function stripDiacritics(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "D")
    .toLowerCase();
}

let searchDebounceTimer = null;

searchInput.addEventListener("input", () => {
  clearTimeout(searchDebounceTimer);
  const query = searchInput.value.trim();
  if (query.length === 0) {
    searchResults.classList.remove("open");
    return;
  }
  // Debounce ~300ms theo yêu cầu FR-01
  searchDebounceTimer = setTimeout(() => runGlobalSearch(query), 300);
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".side-search-wrap")) {
    searchResults.classList.remove("open");
  }
});

function runGlobalSearch(query) {
  const normalizedQuery = stripDiacritics(query);
  const isDigits = /^\d+$/.test(query);

  const matches = customers.filter((c) => {
    if (isDigits && query.length >= 3 && c.phone.endsWith(query)) return true;
    if (c.seats && c.seats.toLowerCase().includes(query.toLowerCase())) return true;
    if (stripDiacritics(c.name).includes(normalizedQuery)) return true;
    if (c.driverPlate && c.driverPlate.toLowerCase().includes(query.toLowerCase())) return true;
    return false;
  }).slice(0, 10); // Tối đa 10 kết quả

  renderSearchResults(matches);
}

function renderSearchResults(matches) {
  if (matches.length === 0) {
    searchResults.innerHTML = `<div class="side-search-empty">Không tìm thấy kết quả phù hợp.</div>`;
    searchResults.classList.add("open");
    return;
  }

  searchResults.innerHTML = matches.map((c) => `
    <div class="side-search-row" data-action="pickSearchResult" data-args='["${c.id}"]'>
      <div>
        <div class="side-search-name">${c.name}</div>
        <div class="side-search-meta">${c.phone} • Ghế: ${c.seats} • ${c.departTime}</div>
      </div>
    </div>
  `).join("");
  searchResults.classList.add("open");
}

// Khi chọn 1 kết quả: chuyển đúng tab, lọc/nổi bật đúng dòng khách (FR-01)
function pickSearchResult(id) {
  const customer = customers.find((c) => c.id === id);
  if (!customer) return;

  searchResults.classList.remove("open");
  searchInput.value = "";

  switchTab(customer.tab);

  // Đợi bảng render xong rồi highlight + cuộn tới đúng dòng
  setTimeout(() => {
    const row = tableBody.querySelector(`tr[data-id="${id}"]`);
    if (row) {
      row.scrollIntoView({ behavior: "smooth", block: "center" });
      row.style.outline = "2px solid var(--red)";
      setTimeout(() => { row.style.outline = "none"; }, 1600);
    }
  }, 50);
}

/* =========================================================
   CRUD KHÁCH HÀNG (Thêm mới / Sửa thông tin)
   ========================================================= */
function openAddCustomerModal() {
  document.getElementById("customerModalTitle").textContent = "Thêm khách trung chuyển mới";
  document.getElementById("custEditId").value = "";
  document.getElementById("customerForm").reset();

  // Set default values
  document.getElementById("custPax").value = "1";
  document.getElementById("custTab").value = currentTab === "ruoclien" ? "don" : currentTab;
  document.getElementById("custStation").value = document.getElementById("filterStation").value !== "all" ? document.getElementById("filterStation").value : "kdv";
  document.getElementById("custVehicleClass").value = "tuyen";
  document.getElementById("custDistrict").value = "Quận 5";
  document.getElementById("custTicketPrice").value = "280000";

  // Enable seat edit for new customers
  document.getElementById("custSeats").disabled = false;
  document.getElementById("custSeats").readOnly = false;

  document.getElementById("customerModal").classList.add("open");
}

function openEditCustomerModal(id) {
  const c = customers.find((cust) => cust.id === id);
  if (!c) return;

  document.getElementById("customerModalTitle").textContent = `Sửa thông tin khách hàng: ${c.name}`;
  document.getElementById("custEditId").value = c.id;

  document.getElementById("custName").value = c.name;
  document.getElementById("custPhone").value = c.phone;
  document.getElementById("custPax").value = c.pax;
  document.getElementById("custTab").value = c.tab;
  document.getElementById("custStation").value = c.station;
  document.getElementById("custVehicleClass").value = c.vehicleClass;

  // Split detail address to base address
  const addrParts = c.addressDetail.split(",");
  document.getElementById("custAddress").value = addrParts[0] ? addrParts[0].trim() : "";
  document.getElementById("custWard").value = c.ward;
  document.getElementById("custDistrict").value = c.district;
  document.getElementById("custNote").value = c.note || "";
  document.getElementById("custSeats").value = c.seats || "";

  // Disable seat edit for existing customers
  document.getElementById("custSeats").disabled = true;
  document.getElementById("custSeats").readOnly = true;

  document.getElementById("custTicketPrice").value = c.ticketPrice;
  document.getElementById("custRoute").value = c.route;
  document.getElementById("custDepartTime").value = c.departTime;
  document.getElementById("custDepartStation").value = c.departStation;
  document.getElementById("custArriveStation").value = c.arriveStation;

  document.getElementById("customerModal").classList.add("open");
}

function saveCustomer() {
  const editId = document.getElementById("custEditId").value;
  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const pax = parseInt(document.getElementById("custPax").value, 10) || 1;
  const tab = document.getElementById("custTab").value;
  const station = document.getElementById("custStation").value;
  const vehicleClass = document.getElementById("custVehicleClass").value;
  const addressBase = document.getElementById("custAddress").value.trim();
  const ward = document.getElementById("custWard").value.trim();
  const district = document.getElementById("custDistrict").value;
  const note = document.getElementById("custNote").value.trim();
  const seats = document.getElementById("custSeats").value.trim().toUpperCase();
  const ticketPrice = parseInt(document.getElementById("custTicketPrice").value, 10) || 0;
  const route = document.getElementById("custRoute").value.trim();
  const departTime = document.getElementById("custDepartTime").value.trim();
  const departStation = document.getElementById("custDepartStation").value.trim();
  const arriveStation = document.getElementById("custArriveStation").value.trim();

  const addressDetail = `${addressBase}, ${ward}, ${district}`;

  if (editId) {
    // SỬA khách hàng
    const c = customers.find((cust) => cust.id === editId);
    if (c) {
      c.name = name;
      c.phone = phone;
      c.pax = pax;
      c.tab = tab;
      c.station = station;
      c.vehicleClass = vehicleClass;
      c.ward = ward;
      c.district = district;
      c.addressDetail = addressDetail;
      c.note = note;
      c.seats = seats;
      c.ticketPrice = ticketPrice;
      c.route = route;
      c.departTime = departTime;
      c.departStation = departStation;
      c.arriveStation = arriveStation;

      showToast(`Đã cập nhật thông tin khách hàng "${name}".`);
    }
  } else {
    // THÊM khách hàng mới
    const maxIdNum = Math.max(...customers.map(c => parseInt(c.id.replace("KH", ""), 10))) || 10;
    const newId = "KH" + String(maxIdNum + 1).padStart(2, '0');

    const newCust = {
      id: newId,
      tab: tab,
      name: name,
      phone: phone,
      pax: pax,
      note: note,
      noteImportant: note ? true : false,
      ward: ward,
      district: district,
      addressDetail: addressDetail,
      seats: seats,
      ticketPrice: ticketPrice,
      departTime: departTime,
      route: route,
      departStation: departStation,
      arriveStation: arriveStation,
      station: station,
      manifest: "sang",
      vehicleClass: vehicleClass,
      driverName: null,
      driverPhone: null,
      driverPlate: null,
      driverVehicleType: null,
      status: "waiting",
      urgentFlag: false
    };

    customers.push(newCust);
    showToast(`Đã thêm khách hàng mới "${name}" thành công.`);
  }

  closeModal("customerModal");
  renderTable();
}

let deleteTargetId = null;

function openDeleteModal(id) {
  deleteTargetId = id;
  const customer = customers.find((c) => c.id === id);
  if (!customer) return;
  document.getElementById("deleteCustomerLabel").textContent = `Khách hàng: ${customer.name} — Ghế: ${customer.seats}`;
  document.getElementById("deleteReason").value = "";
  document.getElementById("confirmDeleteBtn").disabled = true;
  document.getElementById("deleteModal").classList.add("open");
}

function confirmDelete() {
  const customer = customers.find((c) => c.id === deleteTargetId);
  if (!customer) return;
  const reason = document.getElementById("deleteReason").value.trim();
  if (reason.length === 0) return;

  // Remove from customers array
  customers = customers.filter((c) => c.id !== deleteTargetId);

  // Clean from selectedIds if present
  selectedIds.delete(deleteTargetId);
  updateActionBar();

  closeModal("deleteModal");
  renderTable();
  showToast(`Đã xóa vé của khách "${customer.name}". Lý do: ${reason}`);
}

// Enforce mandatory delete reason check
document.getElementById("deleteReason").addEventListener("input", (e) => {
  document.getElementById("confirmDeleteBtn").disabled = e.target.value.trim().length === 0;
});

/* =========================================================
   THAO TÁC HÀNG (Dropdown Menu)
   ========================================================= */
function toggleRowMenu(id, event) {
  event.stopPropagation();

  // Close all other open dropdowns
  document.querySelectorAll(".row-menu-dropdown").forEach((el) => {
    if (el.id !== `menu-${id}`) {
      el.classList.remove("open");
    }
  });

  // Toggle the current dropdown menu
  const menu = document.getElementById(`menu-${id}`);
  if (menu) {
    menu.classList.toggle("open");
  }
}

// Close dropdowns when clicking outside
document.addEventListener("click", () => {
  document.querySelectorAll(".row-menu-dropdown").forEach((el) => {
    el.classList.remove("open");
  });
});

/* =========================================================
   TIỆN ÍCH CHUNG: Modal & Toast
   ========================================================= */
function closeModal(id) {
  document.getElementById(id).classList.remove("open");
}

let toastTimer = null;
function showToast(message) {
  toastText.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

/* ===================== LỊCH CHỌN NGÀY (FR-03) ===================== */
/* Demo cố định "hôm nay" = 18/07/2026 — khớp nhãn mặc định trên UI. */
const DEMO_TODAY = new Date(2026, 6, 18);
let calDate = new Date(DEMO_TODAY);
let selectedDate = new Date(DEMO_TODAY);
const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
let calendarOpen = false;

function renderCalendar() {
  const y = calDate.getFullYear(), m = calDate.getMonth();
  document.getElementById("calMonthLabel").textContent = `${monthNames[m]}, ${y}`;
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
    const isToday = dateObj.toDateString() === DEMO_TODAY.toDateString();
    const isSelected = dateObj.toDateString() === selectedDate.toDateString();
    const lunar = ((d + 16) % 30) + 1;
    html += `<div class="cal-day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}" data-action="pickDate" data-args='[${y},${m},${d}]'>${d}<span class="lunar">${lunar}/6</span></div>`;
  }
  const totalCells = startOffset + daysInMonth;
  const trailing = (7 - (totalCells % 7)) % 7;
  for (let i = 1; i <= trailing; i++) {
    html += `<div class="cal-day muted">${i}</div>`;
  }
  document.getElementById("calGrid").innerHTML = html;
}

function shiftMonth(dir) {
  calDate = new Date(calDate.getFullYear(), calDate.getMonth() + dir, 1);
  renderCalendar();
}

function goToday() {
  calDate = new Date(DEMO_TODAY);
  selectedDate = new Date(DEMO_TODAY);
  renderCalendar();
  updateCalTrigger();
  toggleCalendar(false);
}

function pickDate(y, m, d) {
  selectedDate = new Date(y, m, d);
  renderCalendar();
  updateCalTrigger();
  toggleCalendar(false);
  applyFilters();
}

function updateCalTrigger() {
  const isToday = selectedDate.toDateString() === DEMO_TODAY.toDateString();
  const d = String(selectedDate.getDate()).padStart(2, "0");
  const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
  const y = selectedDate.getFullYear();
  document.getElementById("filterDateLabel").textContent =
    isToday ? `Hôm nay (${d}/${m}/${y})` : `${d}/${m}/${y}`;
}

function toggleCalendar(force) {
  calendarOpen = typeof force === "boolean" ? force : !calendarOpen;
  document.getElementById("calendarPanel").classList.toggle("open", calendarOpen);
  document.getElementById("filterDateBtn").classList.toggle("open", calendarOpen);
}

document.addEventListener("click", (e) => {
  if (
    calendarOpen &&
    !e.target.closest("#calendarPanel") &&
    !e.target.closest("#filterDateBtn")
  ) {
    toggleCalendar(false);
  }
});

/* ---------------------------------------------------------
   ĐỒNG BỘ DỮ LIỆU TỪ NGUỒN ĐẶT VÉ (CALLCENTER & TICKETSTAFF)
--------------------------------------------------------- */
function loadBookingsFromStorage() {
  try {
    const rawBank = localStorage.getItem(HN_STORAGE_KEY);
    if (!rawBank) return;
    const tripSeatBank = JSON.parse(rawBank);

    const rawMeta = localStorage.getItem(HN_TRIPS_KEY);
    const allTripsMeta = rawMeta ? JSON.parse(rawMeta) : [];

    const extractedCustomers = [];
    let idxCounter = 100;

    Object.keys(tripSeatBank).forEach(tripId => {
      const bank = tripSeatBank[tripId];
      if (!bank) return;
      const tripMeta = (allTripsMeta && allTripsMeta.find(t => t.id === tripId)) || {};
      const route = tripMeta.route || bank.route || 'Sài Gòn - Châu Đốc';
      const time = tripMeta.time || bank.time || '07:00';

      const allSeats = [...(bank.down || []), ...(bank.up || []), ...(bank.subSeats || [])];
      
      const grouped = new Map();
      allSeats.forEach(seat => {
        if (!seat || !['sold', 'hold'].includes(seat.state) || !seat.customerName) return;
        const gType = seat.guestType || 'Khách trạm';
        const pickupLoc = seat.transshipStation || seat.transship || seat.pickupAddress || seat.fromTransfer || '';
        const dropLoc = seat.dropoffAddress || seat.arrivalTransfer || '';

        const isRuocLien = (gType === 'Rước liền');
        const isTrungChuyen = (gType === 'Trung chuyển');
        const hasAddress = !!(pickupLoc || dropLoc);

        if (!isRuocLien && !isTrungChuyen && !hasAddress) return;

        const groupKey = `${tripId}_${(seat.phone || '').replace(/\s+/g, '')}_${(seat.customerName || '').trim().toLowerCase()}_${gType}_${pickupLoc}_${dropLoc}`;
        if (!grouped.has(groupKey)) {
          grouped.set(groupKey, {
            ...seat,
            seatsArray: [seat.code],
            tripId,
            route,
            time
          });
        } else {
          const item = grouped.get(groupKey);
          if (seat.code && !item.seatsArray.includes(seat.code)) {
            item.seatsArray.push(seat.code);
          }
        }
      });

      grouped.forEach(item => {
        const seatsStr = item.seatsArray.join(', ');
        const isRuocLien = (item.guestType === 'Rước liền');
        const isCDSG = item.route ? (item.route.includes('Châu Đốc -') || item.route.includes('Long Xuyên -') || item.route.includes('Cần Thơ -')) : false;

        const pickupAddress = item.transshipStation || item.transship || item.pickupAddress || item.fromTransfer || '';
        const dropoffAddress = item.arrivalTransfer || item.dropoffAddress || item.toTransfer || '';

        const makeCustomerRecord = (tab, address) => {
          idxCounter++;
          return {
            id: `KH_SYNC_${idxCounter}`,
            tab,
            name: item.customerName,
            phone: item.phone || '',
            pax: item.seatsArray.length,
            note: item.note || '',
            noteImportant: !!item.hasLuggage,
            ward: '',
            district: '',
            addressDetail: address,
            seats: seatsStr,
            ticketPrice: Number(item.price) || 280000,
            departTime: item.time,
            route: item.route,
            departStation: item.firstStop || (isCDSG ? 'Bến xe Châu Đốc' : 'Bến xe Miền Tây'),
            arriveStation: item.lastStop || (isCDSG ? 'Bến xe Miền Tây' : 'Bến xe Châu Đốc'),
            station: 'kdv',
            manifest: 'sang',
            vehicleClass: 'tuyen',
            driverName: bank.driver || null,
            driverPhone: null,
            driverPlate: bank.plate || null,
            driverVehicleType: bank.vehicleType || null,
            status: 'waiting',
            urgentFlag: false
          };
        };

        if (isRuocLien) {
          extractedCustomers.push(makeCustomerRecord('ruoclien', pickupAddress || dropoffAddress || item.firstStop || 'Trạm Kinh Dương Vương'));
        }
        if (pickupAddress || item.guestType === 'Trung chuyển' || item.guestType === 'Rước đường' || isRuocLien) {
          extractedCustomers.push(makeCustomerRecord('don', pickupAddress || item.firstStop || 'Trạm Kinh Dương Vương'));
        }
        if (dropoffAddress) {
          extractedCustomers.push(makeCustomerRecord('tra', dropoffAddress || item.lastStop || 'Bến xe Châu Đốc'));
        }
      });
    });

    const staticFiltered = customers.filter(c => !c.id || !c.id.startsWith('KH_SYNC_'));
    customers = [...extractedCustomers, ...staticFiltered];
  } catch (e) {
    console.error('Error loading bookings in shuttle:', e);
  }
}

window.addEventListener('storage', (e) => {
  if (e.key === HN_STORAGE_KEY) {
    loadBookingsFromStorage();
    renderTable();
  }
});

/* ---------------------------------------------------------
   KHỞI TẠO
--------------------------------------------------------- */
loadBookingsFromStorage();
populateStationDropdown("all");
renderTable();
renderCalendar();
updateCalTrigger();

/* ===================== TÀI KHOẢN / ĐĂNG XUẤT ===================== */
(function initUserMenu() {
  const menu = document.getElementById('userMenu');
  const chipBtn = document.getElementById('userChipBtn');
  const dropdown = document.getElementById('userDropdown');
  const logoutBtn = document.getElementById('logoutBtn');
  if (!menu || !chipBtn || !dropdown || !logoutBtn) return;

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
      if (roleEl) roleEl.textContent = user.roleLabel || 'Điều hành trung chuyển';
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
