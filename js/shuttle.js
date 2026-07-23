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

function timeStrToMinutes(hhmm){
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/* ---------------------------------------------------------
   DỮ LIỆU MẪU — KHÁCH HÀNG CẦN TRUNG CHUYỂN
--------------------------------------------------------- */
let customers = [
  {
    id: "KH01", tab: "don",
    name: "Nguyễn Văn An", phone: "0908123456",
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
    name: "Trần Thị Bích", phone: "0912345678",
    pax: 1, note: "", noteImportant: false,
    ward: "Phường Bình Hưng Hòa", district: "Bình Tân", addressDetail: "45 Lê Văn Quới, Bình Hưng Hòa, Bình Tân",
    seats: "B03", ticketPrice: 280000, departTime: "07:10", route: "Sài Gòn - Châu Đốc",
    departStation: "Trạm An Sương", arriveStation: "Bến xe Châu Đốc",
    station: "asuong", manifest: "sang", vehicleClass: "tuyen",
    driverName: "Lê Văn Cường", driverPhone: "0907111222", driverPlate: "51B-111.11", driverVehicleType: "Xe 16 chỗ",
    status: "enroute", urgentFlag: false
  },
  {
    id: "KH03", tab: "don",
    name: "Phạm Minh Khoa", phone: "0933112233",
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
    name: "Lê Thị Hồng", phone: "0977889900",
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
    name: "Đỗ Văn Sang", phone: "0966554433",
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
    name: "Huỳnh Thị Kim", phone: "0989776655",
    pax: 2, note: "", noteImportant: false,
    ward: "Phường Tân Thới Nhất", district: "Quận 12", addressDetail: "9 Nguyễn Văn Quá, Tân Thới Nhất, Q.12",
    seats: "A13, A14", ticketPrice: 280000, departTime: "06:10", route: "Sài Gòn - Châu Đốc",
    departStation: "Trạm An Sương", arriveStation: "Bến xe Châu Đốc",
    station: "asuong", manifest: "sang", vehicleClass: "tuyen",
    driverName: "Ngô Văn Phúc", driverPhone: "0907333444", driverPlate: "50H-333.33", driverVehicleType: "Xe 7 chỗ",
    status: "onboard", urgentFlag: false
  },
  {
    id: "KH07", tab: "tra",
    name: "Vũ Thị Lan", phone: "0901234567",
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
    name: "Ngô Văn Đức", phone: "0918887766",
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
    name: "Bùi Thị Ngọc", phone: "0922334455",
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
    name: "Trịnh Văn Toàn", phone: "0955443322",
    pax: 2, note: "", noteImportant: false,
    ward: "Phường Sơn Kỳ", district: "Tân Phú", addressDetail: "15 Gò Dầu, Sơn Kỳ, Tân Phú",
    seats: "A03, A04", ticketPrice: 300000, departTime: "09:45", route: "Châu Đốc - Sài Gòn",
    departStation: "Bến xe Châu Đốc", arriveStation: "Văn phòng trung tâm",
    station: "vp", manifest: "chieu", vehicleClass: "tuyen",
    driverName: "Phạm Đức Duy", driverPhone: "0936444555", driverPlate: "51B-555.55", driverVehicleType: "Xe 7 chỗ",
    status: "onboard", urgentFlag: false
  }
];

/* ---------------------------------------------------------
   DỮ LIỆU MẪU — XE TRUNG CHUYỂN ĐANG RẢNH (dùng cho FR-07)
   --------------------------------------------------------- */
const vehiclesPool = [
  { id: "XE01", driverName: "Nguyễn Văn Bình", driverPhone: "0909111222", vehicleType: "Xe 16 chỗ", plate: "51B-666.66", capacity: 16, freeSeats: 10 },
  { id: "XE02", driverName: "Trịnh Công Sơn",  driverPhone: "0918222333", vehicleType: "Xe 7 chỗ",  plate: "51B-777.77", capacity: 7,  freeSeats: 3  },
  { id: "XE03", driverName: "Lê Hoài Nam",     driverPhone: "0927333444", vehicleType: "Xe 16 chỗ", plate: "50H-888.88", capacity: 16, freeSeats: 16 },
  { id: "XE04", driverName: "Phạm Đức Duy",    driverPhone: "0936444555", vehicleType: "Xe 7 chỗ",  plate: "51B-999.99", capacity: 7,  freeSeats: 0  }
];

/* ---------------------------------------------------------
   STATE
--------------------------------------------------------- */
let currentTab = "don";           // "don" | "tra" | "ruoclien"  (FR-02)
let selectedIds = new Set();      // Các dòng khách đang được chọn (FR-05)
let selectedVehicleId = null;     // Xe đang chọn trong popup gán tài xế (FR-07)
let issueTargetId = null;         // Khách hàng đang thao tác báo sự cố (BR-06)

const searchInput   = document.getElementById("globalSearch");
const searchResults = document.getElementById("searchResults");
const tableBody      = document.getElementById("tableBody");
const gridEmpty      = document.getElementById("gridEmpty");
const actionBar      = document.getElementById("actionBar");
const toast          = document.getElementById("toast");
const toastText      = document.getElementById("toastText");

/* =========================================================
   BR-02: Xác định khách "sắp trễ giờ xuất bến"
   ========================================================= */
function isLateSoon(customer){
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
function isUrgent(customer){
  return isLateSoon(customer) || customer.urgentFlag || customer.status === "issue";
}

/* =========================================================
   FR-03: Áp dụng bộ lọc (kết hợp AND) + tab hiện tại
   ========================================================= */
function getFilteredList(){
  const station = document.getElementById("filterStation").value;
  const manifest = document.getElementById("filterManifest").value;
  const vehicleClass = document.getElementById("filterVehicleClass").value;

  let list = customers.filter((c) => {
    if (currentTab === "ruoclien"){
      if (!isUrgent(c)) return false;
    } else {
      if (c.tab !== currentTab) return false;
    }
    if (station !== "all" && c.station !== station) return false;
    if (manifest !== "all" && c.manifest !== manifest) return false;
    if (vehicleClass !== "all" && c.vehicleClass !== vehicleClass) return false;
    return true;
  });

  // BR-01: luôn sắp xếp theo giờ khởi hành tăng dần (áp dụng cả 3 tab)
  list.sort((a, b) => timeStrToMinutes(a.departTime) - timeStrToMinutes(b.departTime));

  return list;
}

function applyFilters(){
  renderTable();
}

function resetFilters(){
  document.getElementById("filterStation").value = "all";
  document.getElementById("filterManifest").value = "all";
  document.getElementById("filterVehicleClass").value = "all";
  goToday();
  renderTable();
}

/* =========================================================
   FR-02: Chuyển tab trạng thái khách hàng
   ========================================================= */
function switchTab(tab){
  currentTab = tab;
  document.querySelectorAll(".side-tab").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });
  // Đổi tab -> danh sách chọn của tab cũ không còn phù hợp nữa
  clearSelection();
  renderTable();
}

function updateTabBadges(){
  // Badge trên tab đã bỏ khỏi UI header — giữ hàm để không phá các chỗ gọi.
}

/* =========================================================
   Tiện ích hiển thị: màu tag địa chỉ theo khu vực (Quận/Huyện)
   để điều hành viên dễ gom nhóm khách theo khu vực (2.1, FR-04 cột 4)
   ========================================================= */
const DISTRICT_COLORS = {
  "Quận 5": "#EFF4FF;color:#1D4ED8",
  "Bình Tân": "#FFF7E0;color:#B45309",
  "Tân Phú": "#EAFBF1;color:#16A34A",
  "Quận 10": "#FCE7F3;color:#BE185D",
  "Hóc Môn": "#F3E8FF;color:#7C3AED",
  "Quận 12": "#FEF3C7;color:#92400E"
};
function districtTagStyle(district){
  const style = DISTRICT_COLORS[district] || "#E7E7E8;color:#374151";
  const [bg, colorPart] = style.split(";color:");
  return `background:${bg};color:${colorPart}`;
}

const STATUS_LABELS = {
  waiting: { text: "Chờ xử lý", cls: "status-waiting" },
  enroute: { text: "Đang đi rước", cls: "status-enroute" },
  onboard: { text: "Đã lên xe", cls: "status-onboard" },
  issue:   { text: "Sự cố / Không liên lạc", cls: "status-issue" }
};

/* =========================================================
   FR-04: Render bảng danh sách khách cần trung chuyển
   ========================================================= */
function renderTable(){
  const list = getFilteredList();
  updateTabBadges();

  if (list.length === 0){
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

    let statusText = statusInfo.text;
    if (c.status === "issue") {
      statusText = c.issueType || "Sự cố khác";
    }

    return `
      <tr class="${isSelected ? "selected-row" : ""}" data-id="${c.id}">
        <td class="col-check">
          <input type="checkbox" ${isSelected ? "checked" : ""} onchange="toggleRow('${c.id}', this)">
        </td>
        <td class="col-stt">${index + 1}</td>
        <td>
          <div class="cell-name">${c.name}${c.urgentFlag ? " ⭐" : ""}</div>
        </td>
        <td>
          <div class="cell-phone">${c.phone}</div>
        </td>
        <td>
          <span class="pax-chip">${c.pax} người</span>
        </td>
        <td>
          <div class="addr-detail" style="color: var(--black); font-weight: 500;">
            ${c.addressDetail}
          </div>
        </td>
        <td>
          <div class="${late ? "ticket-cell late" : "ticket-cell"}">
            <div class="ticket-code" style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
              <span>Ghế: ${c.seats}</span>
              <span class="ticket-price" style="margin-top: 0; white-space: nowrap;">${c.ticketPrice.toLocaleString('vi-VN')}đ</span>
            </div>
            <div class="ticket-time">${c.departTime}${late ? " ⚠️" : ""}</div>
            <div class="ticket-route">${c.route}</div>
            <div class="ticket-stations">
              <div><span>Trạm đi:</span> <b>${c.departStation}</b></div>
              <div><span>Trạm đến:</span> <b>${c.arriveStation}</b></div>
            </div>
          </div>
        </td>
        <td>
          ${c.driverName
            ? `<div class="driver-name">${c.driverName}</div>
               <div class="driver-phone">${c.driverPhone || '—'}</div>
               <div class="driver-plate">${c.driverPlate}</div>
               <div class="driver-type">${c.driverVehicleType || '—'}</div>`
            : `<span class="driver-empty">Chưa gán tài xế</span>`}
        </td>
        <td>
          <span class="status-label ${statusInfo.cls}">${statusText}</span>
        </td>
        <td>
          ${c.note ? `<div class="cell-note ${c.noteImportant ? "important" : ""}" title="${c.note}">${c.note}</div>` : "—"}
        </td>
        <td style="text-align: center; vertical-align: middle;">
          <div class="row-menu-wrap">
            <button class="row-menu-btn" onclick="toggleRowMenu('${c.id}', event)" aria-label="Thao tác">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width: 15px; height: 15px;">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z"/>
              </svg>
            </button>
            <div class="row-menu-dropdown" id="menu-${c.id}">
              <button type="button" onclick="openEditCustomerModal('${c.id}')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px; stroke: var(--text-main);"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z"/></svg>
                Sửa thông tin
              </button>
              <button type="button" onclick="openDeleteModal('${c.id}')" class="danger">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px; stroke: var(--red);"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                Xóa vé
              </button>
              ${c.status === "enroute" ? `
                <button type="button" onclick="markOnboard('${c.id}')">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px; stroke: var(--text-main);"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Đã lên xe
                </button>
              ` : ""}
              ${c.status !== "issue" ? `
                <button type="button" onclick="openIssueModal('${c.id}')" class="danger">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px; stroke: var(--red);"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  Báo sự cố
                </button>
              ` : ""}
            </div>
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
function toggleRow(id, checkboxEl){
  if (checkboxEl.checked) selectedIds.add(id);
  else selectedIds.delete(id);
  syncRowHighlight(id, checkboxEl.checked);
  updateActionBar();
}

function syncRowHighlight(id, isSelected){
  const row = tableBody.querySelector(`tr[data-id="${id}"]`);
  if (row) row.classList.toggle("selected-row", isSelected);
}

function toggleAll(checkboxEl){
  const list = getFilteredList();
  if (checkboxEl.checked){
    list.forEach((c) => selectedIds.add(c.id));
  } else {
    list.forEach((c) => selectedIds.delete(c.id));
  }
  renderTable();
  updateActionBar();
}

function clearSelection(){
  selectedIds.clear();
  renderTable();
  updateActionBar();
}

/* =========================================================
   FR-06: Khung thao tác Gán Tài Xế (Action Bar)
   ========================================================= */
function updateActionBar(){
  const count = selectedIds.size;
  if (count === 0){
    actionBar.classList.remove("show");
    return;
  }
  const totalPax = customers
    .filter((c) => selectedIds.has(c.id))
    .reduce((sum, c) => sum + c.pax, 0);

  document.getElementById("actionCount").textContent = `Đã chọn ${count} khách`;
  document.getElementById("actionPax").textContent = `${totalPax} pax`;
  actionBar.classList.add("show");
}

/* =========================================================
   FR-07: Popup chọn xe trung chuyển và gán tài xế
   ========================================================= */
function openAssignModal(){
  if (selectedIds.size === 0) return;
  selectedVehicleId = null;
  document.getElementById("capacityWarn").style.display = "none";
  document.getElementById("dispatchErrorBox").style.display = "none";
  document.getElementById("confirmAssignBtn").disabled = true;

  const totalPax = getSelectedTotalPax();
  document.getElementById("assignSummary").textContent =
    `Đang gán cho ${selectedIds.size} khách — tổng ${totalPax} pax`;

  renderVehicleList();
  document.getElementById("assignModal").classList.add("open");
}

function getSelectedTotalPax(){
  return customers
    .filter((c) => selectedIds.has(c.id))
    .reduce((sum, c) => sum + c.pax, 0);
}

function renderVehicleList(){
  const totalPax = getSelectedTotalPax();
  const vehicleList = document.getElementById("vehicleList");

  vehicleList.innerHTML = vehiclesPool.map((v) => {
    const overCapacity = totalPax > v.freeSeats;
    const seatsClass = v.freeSeats === 0 ? "full" : (v.freeSeats < totalPax ? "tight" : "");
    const isSelected = selectedVehicleId === v.id;

    return `
      <div class="vehicle-row ${isSelected ? "selected" : ""} ${v.freeSeats === 0 ? "disabled" : ""}"
           onclick="${v.freeSeats === 0 ? "" : `pickVehicle('${v.id}')`}">
        <div class="vehicle-main">
          <b>Tài xế ${v.driverName} — SĐT: ${v.driverPhone}</b>
          <span>${v.plate} — ${v.vehicleType}</span>
        </div>
        <div class="vehicle-seats ${seatsClass}">
          ${v.freeSeats === 0 ? "Hết chỗ" : `Đang rảnh ${v.freeSeats} chỗ`}
        </div>
      </div>
    `;
  }).join("");
}

function pickVehicle(vehicleId){
  selectedVehicleId = vehicleId;
  const vehicle = vehiclesPool.find((v) => v.id === vehicleId);
  const totalPax = getSelectedTotalPax();

  // BR-04: chặn xác nhận nếu tổng pax vượt quá số chỗ trống của xe
  const overCapacity = totalPax > vehicle.freeSeats;
  document.getElementById("capacityWarn").style.display = overCapacity ? "flex" : "none";
  document.getElementById("confirmAssignBtn").disabled = overCapacity;
  document.getElementById("dispatchErrorBox").style.display = "none";

  renderVehicleList();
}

function confirmAssign(){
  if (!selectedVehicleId) return;
  const vehicle = vehiclesPool.find((v) => v.id === selectedVehicleId);
  const totalPax = getSelectedTotalPax();

  // BR-04 (kiểm tra lại lần cuối trước khi xác nhận)
  if (totalPax > vehicle.freeSeats){
    document.getElementById("capacityWarn").style.display = "flex";
    return;
  }

  // FR-07 — Xử lý lỗi: mô phỏng ~15% khả năng đẩy lệnh thất bại
  // (mất kết nối / tài xế không phản hồi). Khi đó giữ nguyên trạng
  // thái "Chờ xử lý" để điều hành viên có thể gán lại.
  const dispatchFailed = Math.random() < 0.15;

  if (dispatchFailed){
    document.getElementById("dispatchErrorBox").style.display = "flex";
    return;
  }

  // Thành công: cập nhật cột "Tài xế trung chuyển" + "Trạng thái hiện tại"
  // cho toàn bộ khách đã chọn (BR-05: Chờ xử lý -> Đang đi rước)
  customers.forEach((c) => {
    if (selectedIds.has(c.id)){
      c.driverName = vehicle.driverName;
      c.driverPlate = vehicle.plate;
      c.driverPhone = vehicle.driverPhone;
      c.driverVehicleType = vehicle.vehicleType;
      c.status = "enroute";
    }
  });

  // Cập nhật số chỗ trống còn lại của xe vừa gán (mô phỏng)
  vehicle.freeSeats = Math.max(0, vehicle.freeSeats - totalPax);

  closeModal("assignModal");
  clearSelection();
  showToast(`Đã điều phối ${totalPax} pax cho tài xế ${vehicle.driverName}.`);
}

/* =========================================================
   BR-05: Xác nhận thủ công "Đã lên xe" (Đang đi rước -> Đã lên xe)
   ========================================================= */
function markOnboard(id){
  const customer = customers.find((c) => c.id === id);
  if (!customer) return;
  customer.status = "onboard";
  renderTable();
  showToast(`Đã cập nhật "${customer.name}" sang trạng thái Đã lên xe.`);
}

/* =========================================================
   BR-06: Báo sự cố / Không liên lạc được (thủ công)
   ========================================================= */
function openIssueModal(id){
  issueTargetId = id;
  const customer = customers.find((c) => c.id === id);
  document.getElementById("issueCustomerLabel").textContent = `Khách hàng: ${customer.name} — ${customer.phone}`;
  document.getElementById("issueType").value = "Không liên lạc được";
  document.getElementById("issueNote").value = "";
  document.getElementById("issueModal").classList.add("open");
}

function confirmIssue(){
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
function stripDiacritics(str){
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
  if (query.length === 0){
    searchResults.classList.remove("open");
    return;
  }
  // Debounce ~300ms theo yêu cầu FR-01
  searchDebounceTimer = setTimeout(() => runGlobalSearch(query), 300);
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".side-search-wrap")){
    searchResults.classList.remove("open");
  }
});

function runGlobalSearch(query){
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

function renderSearchResults(matches){
  if (matches.length === 0){
    searchResults.innerHTML = `<div class="side-search-empty">Không tìm thấy kết quả phù hợp.</div>`;
    searchResults.classList.add("open");
    return;
  }

  searchResults.innerHTML = matches.map((c) => `
    <div class="side-search-row" onclick="pickSearchResult('${c.id}')">
      <div>
        <div class="side-search-name">${c.name}</div>
        <div class="side-search-meta">${c.phone} • Ghế: ${c.seats} • ${c.departTime}</div>
      </div>
    </div>
  `).join("");
  searchResults.classList.add("open");
}

// Khi chọn 1 kết quả: chuyển đúng tab, lọc/nổi bật đúng dòng khách (FR-01)
function pickSearchResult(id){
  const customer = customers.find((c) => c.id === id);
  if (!customer) return;

  searchResults.classList.remove("open");
  searchInput.value = "";

  switchTab(customer.tab);

  // Đợi bảng render xong rồi highlight + cuộn tới đúng dòng
  setTimeout(() => {
    const row = tableBody.querySelector(`tr[data-id="${id}"]`);
    if (row){
      row.scrollIntoView({ behavior: "smooth", block: "center" });
      row.style.outline = "2px solid var(--red)";
      setTimeout(() => { row.style.outline = "none"; }, 1600);
    }
  }, 50);
}

/* =========================================================
   CRUD KHÁCH HÀNG (Thêm mới / Sửa thông tin)
   ========================================================= */
function openAddCustomerModal(){
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

function openEditCustomerModal(id){
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

function saveCustomer(){
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

function openDeleteModal(id){
  deleteTargetId = id;
  const customer = customers.find((c) => c.id === id);
  if (!customer) return;
  document.getElementById("deleteCustomerLabel").textContent = `Khách hàng: ${customer.name} — Ghế: ${customer.seats}`;
  document.getElementById("deleteReason").value = "";
  document.getElementById("confirmDeleteBtn").disabled = true;
  document.getElementById("deleteModal").classList.add("open");
}

function confirmDelete(){
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
function closeModal(id){
  document.getElementById(id).classList.remove("open");
}

let toastTimer = null;
function showToast(message){
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
const monthNames = ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6","Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"];
let calendarOpen = false;

function renderCalendar(){
  const y = calDate.getFullYear(), m = calDate.getMonth();
  document.getElementById("calMonthLabel").textContent = `${monthNames[m]}, ${y}`;
  const first = new Date(y, m, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const daysInPrevMonth = new Date(y, m, 0).getDate();
  let html = "";
  ["T2","T3","T4","T5","T6","T7","CN"].forEach((d) => {
    html += `<div class="cal-dow">${d}</div>`;
  });
  for (let i = 0; i < startOffset; i++){
    html += `<div class="cal-day muted">${daysInPrevMonth - startOffset + i + 1}</div>`;
  }
  for (let d = 1; d <= daysInMonth; d++){
    const dateObj = new Date(y, m, d);
    const isToday = dateObj.toDateString() === DEMO_TODAY.toDateString();
    const isSelected = dateObj.toDateString() === selectedDate.toDateString();
    const lunar = ((d + 16) % 30) + 1;
    html += `<div class="cal-day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}" onclick="pickDate(${y},${m},${d})">${d}<span class="lunar">${lunar}/6</span></div>`;
  }
  const totalCells = startOffset + daysInMonth;
  const trailing = (7 - (totalCells % 7)) % 7;
  for (let i = 1; i <= trailing; i++){
    html += `<div class="cal-day muted">${i}</div>`;
  }
  document.getElementById("calGrid").innerHTML = html;
}

function shiftMonth(dir){
  calDate = new Date(calDate.getFullYear(), calDate.getMonth() + dir, 1);
  renderCalendar();
}

function goToday(){
  calDate = new Date(DEMO_TODAY);
  selectedDate = new Date(DEMO_TODAY);
  renderCalendar();
  updateCalTrigger();
  toggleCalendar(false);
}

function pickDate(y, m, d){
  selectedDate = new Date(y, m, d);
  renderCalendar();
  updateCalTrigger();
  toggleCalendar(false);
  applyFilters();
}

function updateCalTrigger(){
  const isToday = selectedDate.toDateString() === DEMO_TODAY.toDateString();
  const d = String(selectedDate.getDate()).padStart(2, "0");
  const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
  const y = selectedDate.getFullYear();
  document.getElementById("filterDateLabel").textContent =
    isToday ? `Hôm nay (${d}/${m}/${y})` : `${d}/${m}/${y}`;
}

function toggleCalendar(force){
  calendarOpen = typeof force === "boolean" ? force : !calendarOpen;
  document.getElementById("calendarPanel").classList.toggle("open", calendarOpen);
  document.getElementById("filterDateBtn").classList.toggle("open", calendarOpen);
}

document.addEventListener("click", (e) => {
  if (
    calendarOpen &&
    !e.target.closest("#calendarPanel") &&
    !e.target.closest("#filterDateBtn")
  ){
    toggleCalendar(false);
  }
});

/* ---------------------------------------------------------
   KHỞI TẠO
--------------------------------------------------------- */
renderTable();
renderCalendar();
updateCalTrigger();

/* ===================== TÀI KHOẢN / ĐĂNG XUẤT ===================== */
(function initUserMenu(){
  const menu = document.getElementById('userMenu');
  const chipBtn = document.getElementById('userChipBtn');
  const dropdown = document.getElementById('userDropdown');
  const logoutBtn = document.getElementById('logoutBtn');
  if (!menu || !chipBtn || !dropdown || !logoutBtn) return;

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
      if (roleEl) roleEl.textContent = user.roleLabel || 'Điều hành trung chuyển';
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
