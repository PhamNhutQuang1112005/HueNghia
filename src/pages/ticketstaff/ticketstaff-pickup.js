// ===================== RƯỚC LIỀN (gộp từ pickup-list.js) =====================
// Toàn bộ phần dưới đây được gộp từ file js/pickup-list.js cũ (trang pickup-list.html đã bị xoá,
// nút "Rước liền" giờ chuyển view ngay trong trang qua switchView('pickup') thay vì điều hướng sang
// trang khác). Các biến/hàm bị trùng tên với phần code phía trên (nhưng khác chức năng) đã đổi tên
// với tiền tố "pk"; các hằng dữ liệu mẫu giống hệt (staffList, stopsFirst, stopsLast, nameSamples,
// noteSamples, phonePool) và biến allTripsMeta/tripSeatBank dùng lại bản đã có ở trên, không tạo bản
// sao riêng nữa — tránh 2 bản dữ liệu ghế lệch nhau ngay trên cùng 1 trang.

const DEFAULT_PICKUP_PASSENGERS = [
  { id: 1, name: 'Nguyễn Thị Hồng', phone: '0909123456', ticketCount: 1, fromStation: 'Trạm Kinh Dương Vương', toStation: 'Trạm Châu Đốc', fromTransfer: '12 Kinh Dương Vương, Q.Bình Tân', toTransfer: 'Ngã 3 Vĩnh Xương, Châu Đốc', note: 'Khách lớn tuổi, cần hỗ trợ lên xuống xe', assigned: null, date: '2026-07-18', createdAt: '2026-07-18T07:05:00', printedAt: '2026-07-18T07:10:00', statusNote: 'Khách yêu cầu gọi trước 10 phút khi xe tới' },
  { id: 2, name: 'Trần Văn Bình', phone: '0918234567', ticketCount: 1, fromStation: 'Trạm An Sương', toStation: 'Trạm Long Xuyên', fromTransfer: '45 Trường Chinh, Q.12', toTransfer: 'Công viên Long Xuyên', note: '', assigned: { tripId: '1', seat: 'A12' }, date: '2026-07-18', createdAt: '2026-07-18T07:20:00', printedAt: '2026-07-18T07:35:00', statusNote: '' },
  { id: 3, name: 'Lê Thị Mai', phone: '0933345678', ticketCount: 2, fromStation: 'Trạm Q.5', toStation: 'Trạm Tân Châu', fromTransfer: '88 Nguyễn Trãi, Q.5', toTransfer: 'Bến phà Tân Châu', note: 'Đi cùng 1 trẻ nhỏ', assigned: null, date: '2026-07-18', createdAt: '2026-07-18T08:10:00', printedAt: '', statusNote: 'Đang chờ xác nhận trung chuyển đón' },
  { id: 4, name: 'Phạm Quốc Huy', phone: '0944456789', ticketCount: 1, fromStation: 'Văn phòng trung tâm', toStation: 'Bến xe Châu Đốc', fromTransfer: '120 Lê Hồng Phong, Q.10', toTransfer: 'Bến xe Châu Đốc', note: '', assigned: null, date: '2026-07-18', createdAt: '2026-07-18T08:45:00', printedAt: '', statusNote: '' },
  { id: 5, name: 'Võ Thị Kim Ngân', phone: '0977567890', ticketCount: 2, fromStation: 'Trạm Kinh Dương Vương', toStation: 'Trạm Cần Thơ', fromTransfer: '5 Hồ Học Lãm, Bình Tân', toTransfer: 'Bến Ninh Kiều, Cần Thơ', note: 'Gọi trước 15 phút khi xe tới', assigned: null, date: '2026-07-18', createdAt: '2026-07-18T09:15:00', printedAt: '2026-07-18T09:20:00', statusNote: 'Đã liên hệ tài xế, đang chờ xác nhận giờ đón' }
];

// Tải danh sách hành khách rước liền từ LocalStorage
function loadPickupPassengers() {
  let storedPax = PickupService.readFirstNonEmpty(['hn_pickup_passengers_v5', 'hn_pickup_passengers_v4', 'hn_pickup_passengers_v3']);

  const defaults = JSON.parse(JSON.stringify(DEFAULT_PICKUP_PASSENGERS));
  defaults.forEach(def => {
    if (!storedPax.some(p => p.id === def.id || (p.name === def.name && p.phone === def.phone))) {
      storedPax.push(def);
    }
  });

  PickupService.save(storedPax);
  return storedPax;
}

// Lưu danh sách hành khách rước liền vào LocalStorage
// KHÔNG tự dispatch StorageEvent: nơi gọi hàm này đã tự pkRenderPaxTable() ngay sau đó, dispatch thêm
// chỉ khiến trang tự nghe lại sự kiện của chính mình và render thừa lần 2 (xem js/shared/seat-bank.js).
function savePickupPassengers() {
  PickupService.save(pickupPassengers);
}

let pickupPassengers = loadPickupPassengers();

// Dữ liệu mẫu minh hoạ trạng thái "đã gán tài xế" ở cột "Trạng thái" (trang Rước liền) — cột này đọc
// tên tài xế từ HN_SHUTTLE_DRIVER_KEY (ghi bởi trang shuttle.html thật, xem pkRenderPaxTable()); chỉ
// set khi key này CHƯA có gì trong localStorage, để không đè lên phân công tài xế thật đã gán. Gán mẫu
// cho Trần Văn Bình (chỉ có tài xế, chưa có ghi chú) và Võ Thị Kim Ngân (có cả tài xế lẫn ghi chú) để
// đủ minh hoạ mọi trạng thái của cột: trống / chỉ ghi chú / chỉ tài xế / cả hai.
function seedDefaultShuttleDriverAssignment() {
  try {
    if (ShuttleDriverService.hasAny()) return;
    const sampleMap = {
      '0918234567_don': { driverName: 'Nguyễn Văn Tài', driverPhone: '0912345678', driverPlate: '51B-888.99', driverVehicleType: 'Xe 7 chỗ trung chuyển' },
      '0977567890_don': { driverName: 'Lê Minh Phát', driverPhone: '0938765432', driverPlate: '51B-234.56', driverVehicleType: 'Xe 16 chỗ trung chuyển' }
    };
    ShuttleDriverService.setMap(sampleMap);
  } catch (e) { }
}
seedDefaultShuttleDriverAssignment();

// ===== Lịch chọn ngày lọc danh sách rước liền (widget riêng, khác lịch #calTrigger của Zone 1) =====
const PK_DEMO_TODAY = new Date(2026, 6, 18);
let pkCalDate = new Date(PK_DEMO_TODAY);
let pkSelectedDate = new Date(PK_DEMO_TODAY);
let pkCalendarOpen = false;

let pkFilterState = {
  fromStation: 'all',
  toStation: 'all',
  timeSlot: 'all',
  status: 'all',
  search: ''
};

// ===== Nav 4-tab (Tất cả/Trung chuyển đón/Rước liền/Trung chuyển trả) + chọn dòng (checkbox) ở
// #pickupView — phân quyền theo role đăng nhập (pkIsShuttleDispatchRole()). =====
let pkSubTab = 'all'; // 'all' | 'don' | 'ruoclien' | 'tra'
let pkSelectedIds = new Set(); // key theo pkPickupRowKey()/pkTransshipRowKey() — dùng chung 1 Set cho cả 2 loại dòng

// role = 'shuttle_dispatch' (tài khoản trungchuyen01) -> chế độ "trung chuyển": chọn nhiều, nút "Cập
// nhật" (gán/sửa tài xế). Mọi role khác -> chế độ "bán vé": chọn 1, nút "Chỉ định" (gán chuyến+ghế /
// mở phơi đã gán). role chỉ là nhãn hiển thị trong session hiện tại — dùng lại đúng field đã có, không
// thêm role/tài khoản mới.
function pkIsShuttleDispatchRole() {
  return Auth.isShuttleDispatch();
}

function pkSwitchSubTab(tab) {
  pkSubTab = tab;
  document.querySelectorAll('#pkSubtabs .pk-subtab').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-args') === `["${tab}"]`);
  });
  pkSelectedIds.clear();
  pkRenderPaxTable();
}

// Điều kiện lọc 1 dòng (mergedRows) theo 1 trong 4 tab — tách riêng khỏi pkRenderPaxTable() để dùng
// chung cho cả việc lọc danh sách hiển thị (tab đang xem) lẫn đếm số lượng cho tất cả 4 tab cùng lúc
// (hiện bên cạnh tên tab, xem pkRenderPaxTable()).
function pkRowMatchesSubTab(row, tab) {
  if (tab === 'all') return true;
  if (tab === 'ruoclien') return row.kind === 'pk';
  if (row.kind !== 'ts') return false;
  const m = row.data.main;
  if (tab === 'don') return !!(m.pickupAddress || m.transship || m.transshipStation);
  if (tab === 'tra') return !!(m.dropoffAddress || m.arrivalTransfer);
  return true;
}

function pkToggleRow(key, checkboxEl) {
  if (checkboxEl.checked) {
    if (!pkIsShuttleDispatchRole()) pkSelectedIds.clear(); // chế độ bán vé: chọn 1 — bỏ chọn cũ trước
    pkSelectedIds.add(key);
  } else {
    pkSelectedIds.delete(key);
  }
  pkRenderPaxTable();
}

function pkToggleAllVisible(checkboxEl) {
  if (!pkIsShuttleDispatchRole()) {
    // Chế độ bán vé chỉ chọn 1 — "chọn tất cả" không áp dụng, coi như bỏ chọn.
    checkboxEl.checked = false;
    pkSelectedIds.clear();
    pkRenderPaxTable();
    return;
  }
  // Đọc đúng key của từng dòng đang hiển thị trực tiếp từ data-args mỗi checkbox (đã gắn ở
  // pkRenderPickupRow/pkRenderTransshipRow), tránh phải tính lại visibleRows ở đây.
  const rowCheckboxes = document.querySelectorAll('#pkPaxTableBody td.col-check input[type="checkbox"]');
  rowCheckboxes.forEach(cb => {
    let key = null;
    try { key = JSON.parse(cb.dataset.args || '[]')[0]; } catch (e) { /* ignore */ }
    if (!key) return;
    if (checkboxEl.checked) pkSelectedIds.add(key);
    else pkSelectedIds.delete(key);
  });
  pkRenderPaxTable();
}

function pkClearSelection() {
  pkSelectedIds.clear();
  pkRenderPaxTable();
}

function pkUpdateActionBar() {
  const bar = document.getElementById('pkActionBar');
  const hint = document.getElementById('pkActionHint');
  const btn = document.getElementById('pkActionBtn');
  if (!bar) return;
  if (pkSelectedIds.size === 0) {
    bar.style.display = 'none';
    return;
  }
  bar.style.display = 'flex';
  const isDispatch = pkIsShuttleDispatchRole();
  if (hint) hint.textContent = `Đã chọn ${pkSelectedIds.size} khách`;
  if (btn) btn.textContent = isDispatch ? 'Cập nhật' : 'Chỉ định';
}

function pkConfirmSelectionAction() {
  if (pkSelectedIds.size === 0) return;
  if (!pkIsShuttleDispatchRole()) {
    // Chế độ bán vé: luôn đúng 1 key — gọi lại đúng hành động sẵn có theo loại dòng.
    const key = Array.from(pkSelectedIds)[0];
    if (key.startsWith('pk:')) {
      pkOpenAssignModal(Number(key.slice(3)));
    } else if (key.startsWith('ts:')) {
      const row = pkFindMergedRowByKey(key);
      if (row) sellTicketForTrip(row.data.tripId);
    }
    return;
  }
  pkOpenDriverUpdateModal(Array.from(pkSelectedIds));
}

// Tìm lại đúng dòng (kind+data) trong danh sách đang hiển thị theo key — dùng khi thanh nổi cần biết
// dòng đó thuộc loại nào (pk/ts) để gọi đúng hành động hoặc lấy đúng thông tin khách (tên/SĐT).
function pkFindMergedRowByKey(key) {
  if (key.startsWith('pk:')) {
    const id = Number(key.slice(3));
    const p = pickupPassengers.find(pp => pp.id === id);
    return p ? { kind: 'pk', data: p, key } : null;
  }
  const pkSelectedDateStr = `${pkSelectedDate.getFullYear()}-${String(pkSelectedDate.getMonth() + 1).padStart(2, '0')}-${String(pkSelectedDate.getDate()).padStart(2, '0')}`;
  const rows = pkGetTransshipRows(pkSelectedDateStr, pkFilterState, new Set());
  const row = rows.find(r => pkTransshipRowKey(r) === key);
  return row ? { kind: 'ts', data: row, key } : null;
}

// Tên + SĐT của 1 dòng (bất kể pk/ts) — dùng để hiện nhãn khách trong modal cập nhật tài xế.
function pkRowNameAndPhone(row) {
  if (row.kind === 'pk') return { name: row.data.name || '', phone: row.data.phone || '' };
  return { name: row.data.main.customerName || 'Khách', phone: row.data.main.phone || '' };
}

// ===== Modal "Cập nhật tài xế trung chuyển" (#pkUpdateStatusModal, role trung chuyển) — port cách làm
// từ shuttle.js (openUpdateStatusModal/saveStatusUpdate), ghi cùng key HN_SHUTTLE_DRIVER_KEY nên đồng
// bộ 2 chiều với shuttle.html. Đơn giản hơn bản gốc: chỉ gồm tài xế/loại xe/biển số (không có phần chọn
// trạng thái đón — ticketstaff hiện chưa theo dõi trạng thái đón riêng cho khách trung chuyển). =====
function pkBuildDriversPool() {
  try {
    if (window.FleetStore && typeof FleetStore.getStaff === 'function') {
      const list = FleetStore.getStaff({ role: 'shuttle_driver' })
        .filter((s) => s.active !== false)
        .map((s) => ({ id: s.code || s.name, driverName: s.name, driverPhone: s.phone || '', license: s.license || '' }));
      if (list.length) return list;
    }
  } catch (e) { /* ignore, dùng fallback bên dưới */ }
  return [
    { id: "TX01", driverName: "Nguyễn Văn Bình", driverPhone: "0909111222", license: "D" },
    { id: "TX02", driverName: "Trịnh Công Sơn", driverPhone: "0918222333", license: "B2" },
    { id: "TX03", driverName: "Lê Hoài Nam", driverPhone: "0927333444", license: "E" },
    { id: "TX04", driverName: "Phạm Đức Duy", driverPhone: "0936444555", license: "D" },
    { id: "TX05", driverName: "Trần Văn Hải", driverPhone: "0907222333", license: "FC" }
  ];
}

function pkPopulateFleetSelects() {
  try {
    if (!window.FleetStore) return;
    const plates = FleetStore.getVehicles({ scope: 'shuttle' }).filter((v) => v.active !== false).map((v) => v.plate);
    const plateSelect = document.getElementById('pkStatusPlateSelect');
    if (plateSelect && plates.length) {
      const cur = plateSelect.value;
      plateSelect.innerHTML = plates.map((p) => `<option value="${p}">${p}</option>`).join('');
      if (cur && plates.indexOf(cur) !== -1) plateSelect.value = cur;
    }
    const types = FleetStore.getVehicleTypes({ scope: 'shuttle' }).filter((v) => v.active !== false).map((v) => v.name);
    const typeSelect = document.getElementById('pkStatusVehicleTypeSelect');
    if (typeSelect && types.length) {
      const cur = typeSelect.value;
      typeSelect.innerHTML = types.map((t) => `<option value="${t}">${t}</option>`).join('');
      if (cur && types.indexOf(cur) !== -1) typeSelect.value = cur;
    }
  } catch (e) { console.warn('[ticketstaff] pkPopulateFleetSelects lỗi', e); }
}

// Khoá lưu tài xế trung chuyển — Y HỆT công thức shuttleDriverLegKey() bên shuttle.js (SĐT + "_don"/"_tra")
// để 2 trang đọc/ghi chung 1 định dạng. Dòng "pk" (rước liền) và dòng "ts" hiện chỉ theo dõi chặng "đón"
// (khớp đúng cách cột "Trung chuyển" đang đọc — xem driverKey trong pkRenderPickupRow/pkRenderTransshipRow).
function pkShuttleDriverLegKey(phone) {
  return `${String(phone || '').replace(/\s+/g, '')}_don`;
}

// Nhãn + màu trạng thái đón — Y HỆT STATUS_LABELS bên shuttle.js, để tag hiển thị ở cột "Trung chuyển"
// (cả 2 role đều thấy) đồng bộ đúng 4 trạng thái/màu sắc với trang shuttle.html.
const PK_STATUS_LABELS = {
  waiting: { text: 'Chờ điều phối', cls: 'status-waiting' },
  enroute: { text: 'Đang trung chuyển', cls: 'status-enroute' },
  onboard: { text: 'Đã đón', cls: 'status-onboard' },
  issue: { text: 'Không đón được', cls: 'status-issue' }
};

function pkReadShuttleDriverMap() {
  return ShuttleDriverService.getMap();
}

// ===== Modal "Ghi chú trung chuyển" (#pkDriverNoteModal, cột "Trung chuyển" — role trung chuyển) —
// cùng pattern với pkOpenStatusNoteModal/pkSaveStatusNote (cột "Phòng vé", role bán vé), chỉ khác lưu
// vào driverNote của đúng entry HN_SHUTTLE_DRIVER_KEY (khoá theo SĐT, không phải theo id khách). =====
let pkDriverNoteActiveKey = null;

function pkOpenDriverNoteModal(key) {
  pkDriverNoteActiveKey = key;
  const row = pkFindMergedRowByKey(key);
  const input = document.getElementById('pkDriverNoteInput');
  if (!row) { if (input) input.value = ''; return; }
  const { phone } = pkRowNameAndPhone(row);
  const shuttleDriverMap = pkReadShuttleDriverMap();
  const entry = shuttleDriverMap[pkShuttleDriverLegKey(phone)];
  if (input) input.value = (entry && entry.driverNote) || '';
  const modal = document.getElementById('pkDriverNoteModal');
  if (modal) modal.classList.add('open');
}

function pkSaveDriverNote() {
  if (!pkDriverNoteActiveKey) return;
  const row = pkFindMergedRowByKey(pkDriverNoteActiveKey);
  if (!row) { closeModal('pkDriverNoteModal'); pkDriverNoteActiveKey = null; return; }
  const { phone } = pkRowNameAndPhone(row);
  if (!phone) { closeModal('pkDriverNoteModal'); pkDriverNoteActiveKey = null; return; }

  const input = document.getElementById('pkDriverNoteInput');
  const value = input ? input.value.trim() : '';
  const legKey = pkShuttleDriverLegKey(phone);
  const shuttleDriverMap = pkReadShuttleDriverMap();
  const entry = shuttleDriverMap[legKey] || {};
  const changed = (entry.driverNote || '') !== value;
  entry.driverNote = value;
  shuttleDriverMap[legKey] = entry;

  ShuttleDriverService.setMap(shuttleDriverMap);
  if (changed) pkMarkRowUpdated(pkDriverNoteActiveKey);

  closeModal('pkDriverNoteModal');
  pkDriverNoteActiveKey = null;
  pkRenderPaxTable();
}

function pkOnStatusSelectChange() {
  const statusVal = document.getElementById('pkStatusSelect').value;
  const reasonBox = document.getElementById('pkStatusReasonBox');
  if (reasonBox) reasonBox.style.display = (statusVal === 'issue') ? 'flex' : 'none';
}

let pkUpdateTargetKeys = [];

// Modal "Cập nhật trạng thái khách hàng" — Y CHANG shuttle.html #updateStatusModal: 1 khách thì hiện cả
// trạng thái lẫn tài xế/loại xe/biển số để sửa chung 1 lần; nhiều khách (hàng loạt) thì ẩn hẳn phần tài
// xế (đúng như statusDriverSection bị ẩn trong openBulkUpdateStatusModal() bên shuttle.js — gán tài xế
// hàng loạt không nằm trong modal này) và bắt buộc các khách đã chọn phải CÙNG trạng thái hiện tại.
function pkOpenDriverUpdateModal(keys) {
  const rows = keys.map(k => pkFindMergedRowByKey(k)).filter(Boolean);
  if (!rows.length) return;
  const shuttleDriverMap = pkReadShuttleDriverMap();
  const statusOf = (row) => {
    const { phone } = pkRowNameAndPhone(row);
    const assigned = shuttleDriverMap[pkShuttleDriverLegKey(phone)];
    return (assigned && assigned.status) || 'waiting';
  };

  const driverSection = document.getElementById('pkStatusDriverSection');
  const title = document.getElementById('pkUpdateStatusModalTitle');
  const statusSelect = document.getElementById('pkStatusSelect');
  const reasonInput = document.getElementById('pkStatusReasonInput');

  if (rows.length > 1) {
    const firstStatus = statusOf(rows[0]);
    const sameStatus = rows.every((r) => statusOf(r) === firstStatus);
    if (!sameStatus) {
      showToast('Các khách hàng đã chọn không cùng trạng thái hiện tại. Vui lòng chọn nhóm khách có cùng trạng thái!');
      return;
    }
    pkUpdateTargetKeys = keys.slice();
    if (title) title.textContent = 'Cập nhật trạng thái hàng loạt';
    const totalPax = rows.reduce((sum, r) => sum + (r.kind === 'pk' ? (r.data.ticketCount || r.data.count || 1) : r.data.seatCount), 0);
    document.getElementById('pkUpdateStatusCustomerLabel').textContent =
      `Đang chọn ${rows.length} khách hàng (${totalPax} pax) — Trạng thái hiện tại: "${PK_STATUS_LABELS[firstStatus].text}"`;
    statusSelect.value = firstStatus;
    if (reasonInput) reasonInput.value = '';
    if (driverSection) driverSection.style.display = 'none';
  } else {
    pkUpdateTargetKeys = keys.slice();
    if (title) title.textContent = 'Cập nhật trạng thái khách hàng';
    const { name, phone } = pkRowNameAndPhone(rows[0]);
    document.getElementById('pkUpdateStatusCustomerLabel').textContent = `Khách hàng: ${name} (${phone})`;
    const currentStatus = statusOf(rows[0]);
    statusSelect.value = currentStatus;
    const assigned = shuttleDriverMap[pkShuttleDriverLegKey(phone)];
    if (reasonInput) reasonInput.value = (currentStatus === 'issue' && assigned && assigned.note) ? assigned.note : '';
    if (driverSection) driverSection.style.display = 'block';

    pkPopulateFleetSelects();
    const driversPool = pkBuildDriversPool();
    const driverSelect = document.getElementById('pkStatusDriverSelect');
    driverSelect.innerHTML = `<option value="">-- Giữ nguyên / chưa gán --</option>` +
      driversPool.map((d) => `<option value="${d.id}">Tài xế ${d.driverName} — SĐT: ${d.driverPhone} (${d.license.replace(/^Bằng\s*/i, '')})</option>`).join('');
    driverSelect.value = '';
    if (assigned) {
      const current = driversPool.find((d) => d.driverName === assigned.driverName);
      driverSelect.value = current ? current.id : '';
      if (assigned.driverVehicleType) document.getElementById('pkStatusVehicleTypeSelect').value = assigned.driverVehicleType;
      if (assigned.driverPlate) document.getElementById('pkStatusPlateSelect').value = assigned.driverPlate;
    }
  }

  document.getElementById('pkUpdateStatusTargetKeys').value = JSON.stringify(pkUpdateTargetKeys);
  pkOnStatusSelectChange();
  document.getElementById('pkUpdateStatusModal').classList.add('open');
}

function pkSaveDriverUpdate() {
  const newStatus = document.getElementById('pkStatusSelect').value;
  const noteVal = document.getElementById('pkStatusReasonInput').value.trim();
  const isBulk = pkUpdateTargetKeys.length > 1;

  let driver = null;
  let vehicleType = '';
  let plate = '';
  if (!isBulk) {
    const driverSelect = document.getElementById('pkStatusDriverSelect');
    if (driverSelect.value) {
      driver = pkBuildDriversPool().find((d) => d.id === driverSelect.value) || null;
      vehicleType = document.getElementById('pkStatusVehicleTypeSelect').value;
      plate = document.getElementById('pkStatusPlateSelect').value;
    }
  }

  const shuttleDriverMap = pkReadShuttleDriverMap();

  pkUpdateTargetKeys.forEach((key) => {
    const row = pkFindMergedRowByKey(key);
    if (!row) return;
    const { phone } = pkRowNameAndPhone(row);
    if (!phone) return;
    const legKey = pkShuttleDriverLegKey(phone);
    const entry = shuttleDriverMap[legKey] || {};
    entry.status = newStatus;
    entry.note = newStatus === 'issue' ? (noteVal || 'Không liên lạc được') : '';
    entry.noteImportant = newStatus === 'issue';
    if (driver) {
      entry.driverName = driver.driverName;
      entry.driverPhone = driver.driverPhone;
      entry.driverVehicleType = vehicleType;
      entry.driverPlate = plate;
    }
    shuttleDriverMap[legKey] = entry;
    pkMarkRowUpdated(key);
  });

  ShuttleDriverService.setMap(shuttleDriverMap);

  closeModal('pkUpdateStatusModal');
  pkSelectedIds.clear();
  const count = pkUpdateTargetKeys.length;
  pkUpdateTargetKeys = [];
  showToast(count > 1
    ? `Đã cập nhật trạng thái cho ${count} khách hàng thành "${PK_STATUS_LABELS[newStatus].text}".`
    : `Đã cập nhật trạng thái thành "${PK_STATUS_LABELS[newStatus].text}"${driver ? ` và gán tài xế ${driver.driverName}` : ''}.`);
  pkRenderPaxTable();
}

function pkRenderCalendar() {
  const calGrid = document.getElementById("pkCalGrid");
  const monthLabel = document.getElementById("pkCalMonthLabel");
  if (!calGrid || !monthLabel) return;
  const y = pkCalDate.getFullYear(), m = pkCalDate.getMonth();
  monthLabel.textContent = `${monthNames[m]}, ${y}`;
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
    const isToday = dateObj.toDateString() === PK_DEMO_TODAY.toDateString();
    const isSelected = dateObj.toDateString() === pkSelectedDate.toDateString();
    const lunar = ((d + 16) % 30) + 1;
    html += `<div class="cal-day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}" data-action="pkPickDate" data-args='[${y},${m},${d}]'>${d}<span class="lunar">${lunar}/6</span></div>`;
  }
  const totalCells = startOffset + daysInMonth;
  const trailing = (7 - (totalCells % 7)) % 7;
  for (let i = 1; i <= trailing; i++) {
    html += `<div class="cal-day muted">${i}</div>`;
  }
  calGrid.innerHTML = html;
}

function pkShiftMonth(dir) {
  pkCalDate = new Date(pkCalDate.getFullYear(), pkCalDate.getMonth() + dir, 1);
  pkRenderCalendar();
}

function pkGoToday() {
  pkCalDate = new Date(PK_DEMO_TODAY);
  pkSelectedDate = new Date(PK_DEMO_TODAY);
  pkRenderCalendar();
  pkUpdateCalTrigger();
  pkToggleCalendar(false);
  pkApplyFilters();
}

function pkPickDate(y, m, d) {
  pkSelectedDate = new Date(y, m, d);
  pkRenderCalendar();
  pkUpdateCalTrigger();
  pkToggleCalendar(false);
  pkApplyFilters();
}

function pkUpdateCalTrigger() {
  const dateLabel = document.getElementById("pkFilterDateLabel");
  if (!dateLabel) return;
  const isToday = pkSelectedDate.toDateString() === PK_DEMO_TODAY.toDateString();
  const d = String(pkSelectedDate.getDate()).padStart(2, "0");
  const m = String(pkSelectedDate.getMonth() + 1).padStart(2, "0");
  const y = pkSelectedDate.getFullYear();
  dateLabel.textContent = isToday ? `Hôm nay (${d}/${m}/${y})` : `${d}/${m}/${y}`;
}

// Lịch riêng của #pickupView — không dùng chung toggleCalendar()/js/shared/ui.js vì hàm đó gắn cứng
// vào #calendarPanel/#calTrigger (lịch Zone 1), trong khi lịch lọc rước liền dùng id khác
// (#pkCalendarPanel/#pkFilterDateBtn) để không trùng.
function pkToggleCalendar(force) {
  const panel = document.getElementById("pkCalendarPanel");
  const btn = document.getElementById("pkFilterDateBtn");
  if (!panel || !btn) return;
  pkCalendarOpen = typeof force === "boolean" ? force : !pkCalendarOpen;
  panel.classList.toggle("open", pkCalendarOpen);
  btn.classList.toggle("open", pkCalendarOpen);
}

document.addEventListener("click", (e) => {
  if (
    pkCalendarOpen &&
    !e.target.closest("#pkCalendarPanel") &&
    !e.target.closest("#pkFilterDateBtn")
  ) {
    pkToggleCalendar(false);
  }
});

function pkApplyFilters() {
  const fromEl = document.getElementById('pkFilterFromStation');
  const toEl = document.getElementById('pkFilterToStation');
  const timeEl = document.getElementById('pkFilterTimeSlot');
  const statusEl = document.getElementById('pkFilterStatus');

  pkFilterState.fromStation = fromEl ? fromEl.value : 'all';
  pkFilterState.toStation = toEl ? toEl.value : 'all';
  pkFilterState.timeSlot = timeEl ? timeEl.value : 'all';
  pkFilterState.status = statusEl ? statusEl.value : 'all';

  pkRenderPaxTable();
}

function pkResetFilters() {
  pkFilterState = { fromStation: 'all', toStation: 'all', timeSlot: 'all', status: 'all', search: '' };
  const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  setVal('pkFilterFromStation', 'all');
  setVal('pkFilterToStation', 'all');
  setVal('pkFilterTimeSlot', 'all');
  setVal('pkFilterStatus', 'all');
  setVal('pkSearchInput', '');
  const headerSearchEl = document.getElementById('searchInput');
  if (headerSearchEl) headerSearchEl.value = '';
  pkFilterState.search = '';
  pkGoToday();
}

let pkSearchInputDebounceTimer = null;
function pkOnSearchInput(val) {
  clearTimeout(pkSearchInputDebounceTimer);
  pkSearchInputDebounceTimer = setTimeout(() => {
    pkFilterState.search = val || '';
    pkRenderPaxTable();
  }, 300);
}

/* ---- Modal thông tin khách rước (chuyển từ callcenter.js qua) ---- */
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
  document.getElementById('pickupPreviewPhone').textContent = collectPhoneValues('pickupPhone', 'pickup_phone_extra') || '—';
  const countVal = parseInt(document.getElementById('pickupTicketCount').value) || 1;
  document.getElementById('pickupPreviewCount').textContent = countVal + ' vé';
  document.getElementById('pickupPreviewStation').textContent = document.getElementById('pickupStation').value.trim() || '—';
  document.getElementById('pickupPreviewAddress').textContent = document.getElementById('pickupAddress').value.trim() || '—';
  document.getElementById('pickupPreviewDestination').textContent = document.getElementById('pickupDestination').value.trim() || '—';
  document.getElementById('pickupPreviewTrip').textContent = document.getElementById('pickupTrip').value.trim() || '—';
  document.getElementById('pickupPreviewNote').textContent = document.getElementById('pickupNote').value.trim() || '—';
  refreshPickupPrice();
}
function openPickupModal() {
  const modal = document.getElementById('pickupModal');
  document.getElementById('pickupCustomerName').value = '';
  document.getElementById('pickupPhone').value = '';
  renderExtraPhoneFields('pickup_phone_extra', [], 'refreshPickupPreview');
  document.getElementById('pickupTicketCount').value = '1';
  document.getElementById('pickupStation').value = '';
  document.getElementById('pickupAddress').value = '';
  document.getElementById('pickupDestination').value = '';
  document.getElementById('pickupTrip').value = '';
  document.getElementById('pickupNote').value = '';
  refreshPickupPreview();
  modal.classList.add('open');
}
function savePickupInfo() {
  const name = document.getElementById('pickupCustomerName').value.trim();
  const phone = collectPhoneValues('pickupPhone', 'pickup_phone_extra');
  const count = parseInt(document.getElementById('pickupTicketCount').value) || 1;
  const station = document.getElementById('pickupStation').value.trim() || 'Trạm Kinh Dương Vương';
  const address = document.getElementById('pickupAddress').value.trim() || '—';
  const destination = document.getElementById('pickupDestination').value.trim() || 'Trạm Châu Đốc';
  const destinationTransfer = document.getElementById('pickupTrip') ? document.getElementById('pickupTrip').value.trim() || '—' : '—';
  const tripNote = document.getElementById('pickupNote').value.trim() || '';

  if (!name || !phone) {
    showToast('Vui lòng nhập họ tên và số điện thoại khách');
    return;
  }

  const defaults = [
    { id: 1, name: 'Nguyễn Thị Hồng', phone: '0909123456', ticketCount: 1, fromStation: 'Trạm Kinh Dương Vương', toStation: 'Trạm Châu Đốc', fromTransfer: '12 Kinh Dương Vương, Q.Bình Tân', toTransfer: 'Ngã 3 Vĩnh Xương, Châu Đốc', note: 'Khách lớn tuổi, cần hỗ trợ lên xuống xe', assigned: null, guestType: 'Rước liền', isRuocLien: true, createdAt: '2026-07-18T07:05:00', printedAt: '2026-07-18T07:10:00', statusNote: 'Khách yêu cầu gọi trước 10 phút khi xe tới' },
    { id: 2, name: 'Trần Văn Bình', phone: '0918234567', ticketCount: 1, fromStation: 'Trạm An Sương', toStation: 'Trạm Long Xuyên', fromTransfer: '45 Trường Chinh, Q.12', toTransfer: 'Công viên Long Xuyên', note: '', assigned: { tripId: '1', seat: 'A12' }, guestType: 'Rước liền', isRuocLien: true, createdAt: '2026-07-18T07:20:00', printedAt: '2026-07-18T07:35:00', statusNote: '' },
    { id: 3, name: 'Lê Thị Mai', phone: '0933345678', ticketCount: 2, fromStation: 'Trạm Q.5', toStation: 'Trạm Tân Châu', fromTransfer: '88 Nguyễn Trãi, Q.5', toTransfer: 'Bến phà Tân Châu', note: 'Đi cùng 1 trẻ nhỏ', assigned: null, guestType: 'Rước liền', isRuocLien: true, createdAt: '2026-07-18T08:10:00', printedAt: '', statusNote: 'Đang chờ xác nhận trung chuyển đón' },
    { id: 4, name: 'Phạm Quốc Huy', phone: '0944456789', ticketCount: 1, fromStation: 'Văn phòng trung tâm', toStation: 'Bến xe Châu Đốc', fromTransfer: '120 Lê Hồng Phong, Q.10', toTransfer: 'Bến xe Châu Đốc', note: '', assigned: null, guestType: 'Rước liền', isRuocLien: true, createdAt: '2026-07-18T08:45:00', printedAt: '', statusNote: '' },
    { id: 5, name: 'Võ Thị Kim Ngân', phone: '0977567890', ticketCount: 2, fromStation: 'Trạm Kinh Dương Vương', toStation: 'Trạm Cần Thơ', fromTransfer: '5 Hồ Học Lãm, Bình Tân', toTransfer: 'Bến Ninh Kiều, Cần Thơ', note: 'Gọi trước 15 phút khi xe tới', assigned: null, guestType: 'Rước liền', isRuocLien: true, createdAt: '2026-07-18T09:15:00', printedAt: '2026-07-18T09:20:00', statusNote: 'Đã liên hệ tài xế, đang chờ xác nhận giờ đón' }
  ];

  let paxList = PickupService.readFirstNonEmpty(['hn_pickup_passengers_v5', 'hn_pickup_passengers_v4']);
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
    assigned: null,
    guestType: 'Rước liền',
    isRuocLien: true,
    // Cột "Thời gian" trang Rước liền — mốc lúc thông tin khách được nhập từ modal "Rước liền" này.
    createdAt: new Date().toISOString()
  };

  paxList.unshift(newPax);
  PickupService.saveAndBroadcast(paxList);

  closeModal('pickupModal');
  showToast(`Đã lưu thông tin khách rước (${count} vé): ${name}`);
}

// ===== Danh sách hành khách rước liền =====

/* ---------------------------------------------------------------------------
   PHÂN QUYỀN 2 CỘT theo role (1 chỗ duy nhất) — dùng cho CẢ dòng khách rước
   liền (pkRenderPickupRow) lẫn dòng khách trung chuyển (pkRenderTransshipRow):

     Cột "Trung chuyển" (ghi chú tài xế) : role trung chuyển BẤM ĐƯỢC (mở
        #pkDriverNoteModal) — role phòng vé chỉ xem.
     Cột "Phòng vé" (ghi chú trạng thái đón) : role phòng vé BẤM ĐƯỢC — role
        trung chuyển chỉ xem.

   `isDispatch` = pkIsShuttleDispatchRole() do nơi gọi truyền vào (đã tính sẵn
   1 lần/dòng, tránh đọc lại sessionStorage cho từng ô).
   --------------------------------------------------------------------------- */
function pkTransshipCellHtml(inner, rowKey, isDispatch) {
  return isDispatch
    ? `<button type="button" class="pk-transship-cell pk-transship-cell--clickable" data-action="pkOpenDriverNoteModal" data-args='["${rowKey}"]' title="Bấm để ghi/sửa ghi chú trung chuyển">${inner}</button>`
    : `<div class="pk-transship-cell">${inner}</div>`;
}
function pkPhongVeCellHtml(inner, hasNote, isDispatch, dataAction, dataArgsJson) {
  const cls = `pk-note-cell${hasNote ? ' has-note' : ''}`;
  return isDispatch
    ? `<div class="${cls} pk-note-cell--readonly">${inner}</div>`
    : `<button type="button" class="${cls}" data-action="${dataAction}" data-args='${dataArgsJson}' title="Bấm để ghi/sửa ghi chú trạng thái">${inner}</button>`;
}

// "Đẩy lên đầu khi có cập nhật mới" — mỗi lần cột "Trung chuyển" (tài xế/ghi chú tài xế đổi bên
// shuttle.html) hoặc cột "Phòng vé" (ghi chú trạng thái) của MỘT dòng thay đổi thì gọi pkMarkRowUpdated()
// với khoá dòng đó; pkRenderPaxTable() sắp các dòng có mốc cập nhật lên trước (mới nhất trước), áp dụng
// cho CẢ khách rước liền lẫn khách trung chuyển trong cùng bảng gộp. Mốc chỉ sống trong phiên làm việc.
let pkUpdateSeq = 0;
const pkRowUpdateStamp = new Map(); // rowKey -> seq (số càng lớn = cập nhật càng mới)
function pkMarkRowUpdated(rowKey) {
  if (!rowKey) return;
  pkUpdateSeq += 1;
  pkRowUpdateStamp.set(rowKey, pkUpdateSeq);
}
function pkPickupRowKey(p) { return 'pk:' + p.id; }
function pkTransshipRowKey(ticketNoOrRow) {
  if (ticketNoOrRow && ticketNoOrRow.main) return 'ts:' + (ticketNoOrRow.main.ticketNo || ticketNoOrRow.seatCodes.join(','));
  return 'ts:' + (ticketNoOrRow || '');
}

// Bản đồ tài xế trung chuyển (HN_SHUTTLE_DRIVER_KEY) lần trước — để so ra ĐÚNG những SĐT vừa đổi khi có
// sự kiện 'storage', rồi đánh dấu cập nhật cho các dòng khách tương ứng (cả rước liền lẫn trung chuyển).
let pkPrevShuttleDriverMap = ShuttleDriverService.getMap();
let pkPendingTransshipUpdatePhones = null; // Set<phone> — dòng trung chuyển cần đánh dấu ở lần render kế
function pkApplyShuttleDriverChange() {
  let newMap = ShuttleDriverService.getMap();
  const changedPhones = new Set();
  new Set([...Object.keys(newMap), ...Object.keys(pkPrevShuttleDriverMap)]).forEach(k => {
    if (JSON.stringify(newMap[k] || null) !== JSON.stringify(pkPrevShuttleDriverMap[k] || null)) {
      changedPhones.add(String(k).replace(/_(don|tra)$/, ''));
    }
  });
  pkPrevShuttleDriverMap = newMap;
  if (!changedPhones.size) return;
  pickupPassengers.forEach(p => {
    if (changedPhones.has(String(p.phone || '').replace(/\s+/g, ''))) pkMarkRowUpdated(pkPickupRowKey(p));
  });
  pkPendingTransshipUpdatePhones = changedPhones; // dòng trung chuyển gộp từ seat bank — đánh dấu ở pkRenderPaxTable
}

function pkRenderPaxTable() {
  const tbody = document.getElementById('pkPaxTableBody');
  const gridEmpty = document.getElementById('pkGridEmpty');
  if (!tbody) return;

  const pkSelectedDateStr = `${pkSelectedDate.getFullYear()}-${String(pkSelectedDate.getMonth() + 1).padStart(2, '0')}-${String(pkSelectedDate.getDate()).padStart(2, '0')}`;
  let filtered = pickupPassengers.filter(p => {
    // Đang gõ tìm kiếm: tìm trên TOÀN BỘ danh sách, bỏ qua bộ lọc ngày/trạm/trạng thái — trước đây lọc
    // ngày chạy TRƯỚC nên nếu lịch không đúng đang trỏ vào ngày của khách (VD khách được xếp cho 1 ngày
    // khác ngày "Hôm nay" đang chọn) thì tìm kiếm luôn ra rỗng dù tên/SĐT gõ đúng — đây chính là nguyên
    // nhân "tìm không được" mà không phải do sai chính tả.
    if (pkFilterState.search) {
      const kw = pkFilterState.search.toLowerCase();
      const matchName = p.name && p.name.toLowerCase().includes(kw);
      const matchPhone = p.phone && p.phone.toLowerCase().includes(kw);
      const matchTicket = p.assigned?.seat && String(p.assigned.seat).toLowerCase().includes(kw);
      return !!(matchName || matchPhone || matchTicket);
    }
    // Khách cũ lưu từ trước khi có cột "date" (chưa có trường này) luôn hiện, không bị lọc theo ngày —
    // chỉ lọc khi bản ghi CÓ ngày và khác ngày đang chọn trên lịch.
    if (p.date && p.date !== pkSelectedDateStr) return false;
    if (pkFilterState.fromStation !== 'all' && p.fromStation !== pkFilterState.fromStation) return false;
    if (pkFilterState.toStation !== 'all' && p.toStation !== pkFilterState.toStation) return false;
    if (pkFilterState.status === 'pending' && p.assigned) return false;
    if (pkFilterState.status === 'assigned' && !p.assigned) return false;
    // "Khung giờ" trước đây chưa từng được áp dụng ở đây (bug có sẵn từ pickup-list.js gốc, giữ nguyên
    // suốt lúc gộp code) — chọn khung giờ không lọc được gì cả. Khách CHƯA chỉ định chưa có giờ đón cụ
    // thể nên vẫn hiện bất kể khung giờ đang chọn; chỉ lọc khách ĐÃ chỉ định theo giờ của phơi đã gán —
    // giờ đó không lưu trực tiếp trên p.assigned, phải tra qua allTripsMeta theo tripId (đúng cách
    // pkRenderPaxTable tự hiển thị timeStr ở dưới).
    const assignedTripTime = p.assigned?.time || allTripsMeta.find(t => t.id === p.assigned?.tripId)?.time;
    if (pkFilterState.timeSlot !== 'all' && assignedTripTime) {
      const hh = parseInt(assignedTripTime.split(':')[0], 10);
      if (pkFilterState.timeSlot === 'morning' && (hh < 0 || hh >= 12)) return false;
      if (pkFilterState.timeSlot === 'afternoon' && (hh < 12 || hh >= 18)) return false;
      if (pkFilterState.timeSlot === 'evening' && (hh < 18 || hh > 24)) return false;
    }
    return true;
  });

  // Tài xế trung chuyển được gán ở trang shuttle.html, đọc lại qua HN_SHUTTLE_DRIVER_KEY (khoá theo
  // "sđt_don" — xem shuttleDriverLegKey() bên shuttle.js) — dùng cùng công thức khoá với cột "Tài xế"
  // bảng "Trung chuyển đón" (renderTransshipTables). Dùng chung cho cả dòng khách rước liền lẫn dòng
  // hành khách trung chuyển gộp bên dưới.
  let shuttleDriverMap = ShuttleDriverService.getMap();

  const pkRenderPickupRow = (p, idx, shuttleDriverMap) => {
    // Hành trình — gộp Trạm đi/Trạm đến (điểm chính) với Trung chuyển đi/đến (địa chỉ đón/trả cụ thể)
    // thành 1 cột duy nhất, cùng kiểu trình bày .pax-route/.pax-route-row/.pax-route-connector với cột
    // "Hành trình" bảng Lịch sử hành khách (chấm đỏ = điểm đi, ghim xám = điểm đến).
    const firstStopHtml = p.fromTransfer
      ? `${escapeHtml(p.fromStation || '—')}<div class="ch-sub-address" style="font-size:12px;color:var(--text-sub);margin-top:2px;">Đón: ${escapeHtml(p.fromTransfer)}</div>`
      : escapeHtml(p.fromStation || '—');
    const lastStopHtml = p.toTransfer
      ? `${escapeHtml(p.toStation || '—')}<div class="ch-sub-address" style="font-size:12px;color:var(--text-sub);margin-top:2px;">Trả: ${escapeHtml(p.toTransfer)}</div>`
      : escapeHtml(p.toStation || '—');
    const routeHtml = `
      <div class="pax-route">
        <div class="pax-route-row pax-route-from">
          <svg class="pax-route-icon" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/></svg>
          <div class="pax-route-text">${firstStopHtml}</div>
        </div>
        <div class="pax-route-connector"></div>
        <div class="pax-route-row pax-route-to">
          <svg class="pax-route-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
          <div class="pax-route-text">${lastStopHtml}</div>
        </div>
      </div>`;

    // "Số ghế" — trước đây là cột "Tên phơi xe" (tên phơi + ghế). Giờ chỉ hiện SỐ GHẾ đã chỉ định; bấm
    // vào số ghế thì nhảy thẳng sang phơi được chỉ định (sellTicketForTrip → switchView('booking') + chọn
    // đúng thẻ phơi ở Zone 1). Chưa gán phơi nào thì hiện dấu "_".
    let seatCell;
    if (p.assigned) {
      const seatStr = p.assigned.seat || (Array.isArray(p.assigned.seats) ? p.assigned.seats.join(', ') : 'Rước liền');
      seatCell = `<button type="button" class="pk-seat-link" data-action="sellTicketForTrip" data-args='${JSON.stringify([p.assigned.tripId])}' title="Bấm để mở phơi đã chỉ định">${escapeHtml(seatStr)}</button>`;
    } else {
      seatCell = `<span class="pk-seat-none">_</span>`;
    }
    // Cột cuối — checkbox thay cho nút "Chỉ định"/"Đổi chỉ định" mỗi dòng (xem pkToggleRow/pkActionBar):
    // chọn dòng rồi bấm nút trên thanh nổi thay vì bấm trực tiếp trên từng dòng.
    const pkRowKey = pkPickupRowKey(p);
    const checkCell = `<input type="checkbox" ${pkSelectedIds.has(pkRowKey) ? 'checked' : ''} data-change-action="pkToggleRow" data-args='["${pkRowKey}","__this__"]'>`;

    // "Thời gian" — thời điểm thông tin khách được nhập từ modal "Rước liền" (savePickupInfo() ở trên
    // ghi p.createdAt lúc lưu modal). Khách demo/nhập từ trước khi có trường này thì hiện "—" thay vì báo lỗi.
    const createdTimeStr = p.createdAt ? `${formatHistoryDate(p.createdAt)}<br>${formatActionTime(p.createdAt)}` : '—';

    // "In lúc" — thời điểm danh sách được in, dành cho trang Trung chuyển làm sau (chưa có nơi nào ghi
    // p.printedAt) — hiện "—" cho tới khi tính năng in đó được triển khai.
    const printedTimeStr = p.printedAt ? `${formatHistoryDate(p.printedAt)}<br>${formatActionTime(p.printedAt)}` : '—';

    // Cột "Trung chuyển" — tên tài xế đã gán (shuttle.html) + ghi chú CỦA TRUNG CHUYỂN (driverNote).
    // Role trung chuyển bấm được để ghi/sửa driverNote (y hệt pattern cột "Phòng vé" ở role bán vé —
    // #pkDriverNoteModal, không mở modal Cập nhật trạng thái/tài xế lớn); role bán vé chỉ xem.
    const pkRowKeyForCell = pkPickupRowKey(p);
    const isDispatchRole = pkIsShuttleDispatchRole();
    const driverKey = pkShuttleDriverLegKey(p.phone);
    const assignedDriver = shuttleDriverMap[driverKey];
    const hasStatusNote = !!p.statusNote;
    const driverNote = (assignedDriver && assignedDriver.driverNote) || '';
    const driverNameHtml = assignedDriver
      ? `<span class="pk-driver-name">${escapeHtml(assignedDriver.driverName)}</span>`
      : `<span class="pk-driver-name pk-driver-empty"></span>`;
    const transshipInnerHtml = driverNote
      ? `${driverNameHtml}<span class="pk-driver-sub">${escapeHtml(driverNote)}</span>`
      : `${driverNameHtml}${isDispatchRole ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px;margin-top:2px;"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>` : ''}`;
    const transshipCell = pkTransshipCellHtml(transshipInnerHtml, pkRowKeyForCell, isDispatchRole);

    // Cột "Trạng thái" — TÁCH RIÊNG khỏi cột "Trung chuyển", hiện ở CẢ 2 role (chỉ xem — đổi trạng thái
    // qua thanh nổi "Cập nhật", xem pkOpenDriverUpdateModal/pkSaveDriverUpdate).
    const rowStatus = (assignedDriver && assignedDriver.status) || 'waiting';
    const statusCell = `<span class="pk-status-tag ${PK_STATUS_LABELS[rowStatus].cls}">${PK_STATUS_LABELS[rowStatus].text}</span>`;

    // Cột "Phòng vé" — ghi chú trạng thái đón do phòng vé nhập (p.statusNote), hiện thẳng NỘI DUNG trong ô
    // giống cột "Trung chuyển". Chỉ role bán vé bấm được để mở modal ghi/sửa (#pkStatusNoteModal) — role
    // trung chuyển chỉ xem (đây là ghi chú riêng của phòng vé, không phải việc của trung chuyển).
    const phongVeInnerHtml = hasStatusNote
      ? `<span class="pk-note-text">${escapeHtml(p.statusNote)}</span>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`;
    const phongVeCell = pkPhongVeCellHtml(phongVeInnerHtml, hasStatusNote, isDispatchRole, 'pkOpenStatusNoteModal', `[${p.id}]`);

    return `
      <tr class="${pkSelectedIds.has(pkRowKeyForCell) ? 'selected-row' : ''}">
        <td class="col-stt">${idx + 1}</td>
        <td><div class="pax-info"><div class="pax-name">KH: ${escapeHtml(p.name || '')}</div><div class="pax-phone">SĐT: ${escapeHtml(p.phone || '')}</div></div></td>
        <td>${routeHtml}</td>
        <td class="center" style="font-weight:700; font-size:13.5px; color:var(--text-main);">${p.ticketCount || p.count || 1}</td>
        <td class="center">${seatCell}</td>
        <td class="note-cell">${p.note ? escapeHtml(p.note) : '—'}</td>
        <td class="center mono" style="font-size:12px; color:var(--text-sub);">${createdTimeStr}</td>
        <td class="center mono" style="font-size:12px; color:var(--text-sub);">${printedTimeStr}</td>
        <td class="center">${statusCell}</td>
        <td class="center">${transshipCell}</td>
        <td class="center">${phongVeCell}</td>
        <td class="col-check">${checkCell}</td>
      </tr>`;
  };

  // ===== Hành khách trung chuyển — gộp từ MỌI phơi (trang này không chọn phơi cụ thể như tab
  // "Trung chuyển" bên Quản lý vé). Bỏ qua các vé vốn là khách rước liền ĐÃ được chỉ định ở bảng trên
  // để không hiện trùng 2 dòng. Chung tbody, nối tiếp ngay dưới danh sách rước liền. =====
  const pickupAssignedSeatKeys = new Set();
  pickupPassengers.forEach(p => {
    if (!p.assigned) return;
    const seats = p.assigned.seats || (p.assigned.seat ? String(p.assigned.seat).split(',').map(s => s.trim()).filter(Boolean) : []);
    seats.forEach(code => pickupAssignedSeatKeys.add(`${p.assigned.tripId}|${code}`));
  });
  const transshipRows = pkGetTransshipRows(pkSelectedDateStr, pkFilterState, pickupAssignedSeatKeys);
  // Vé trung chuyển vừa đặt/sửa từ modal đặt vé (seat.actionTime stamp mỗi lần lưu form) nổi lên đầu
  // nhóm trung chuyển — khách mới nhận thông tin đứng trước. Dòng chưa có actionTime (dữ liệu cũ) xuống sau.
  transshipRows.sort((a, b) => (Date.parse(b.main.actionTime) || 0) - (Date.parse(a.main.actionTime) || 0));

  // Có SĐT tài xế trung chuyển vừa đổi bên shuttle (từ pkApplyShuttleDriverChange) -> đánh dấu cập nhật
  // cho đúng dòng khách trung chuyển tương ứng, để nó cũng được đẩy lên đầu như dòng rước liền.
  if (pkPendingTransshipUpdatePhones && pkPendingTransshipUpdatePhones.size) {
    transshipRows.forEach(r => {
      if (pkPendingTransshipUpdatePhones.has(String(r.main.phone || '').replace(/\s+/g, ''))) {
        pkMarkRowUpdated(pkTransshipRowKey(r));
      }
    });
    pkPendingTransshipUpdatePhones = null;
  }

  // Gộp 2 loại dòng rồi sắp các dòng CÓ mốc cập nhật lên trước (mới nhất trước). Array.sort ổn định nên
  // các dòng chưa từng cập nhật (mốc 0) giữ nguyên thứ tự: rước liền trước, trung chuyển sau.
  const mergedRows = [
    ...filtered.map(p => ({ kind: 'pk', data: p, key: pkPickupRowKey(p) })),
    ...transshipRows.map(r => ({ kind: 'ts', data: r, key: pkTransshipRowKey(r) }))
  ];
  mergedRows.sort((a, b) => (pkRowUpdateStamp.get(b.key) || 0) - (pkRowUpdateStamp.get(a.key) || 0));

  // Lọc theo 1 trong 4 tab (Tất cả/Trung chuyển đón/Rước liền/Trung chuyển trả) — tab "all" giữ nguyên
  // y hệt hành vi gộp trước đây. Khách trung chuyển có cả 2 chặng đón+trả sẽ xuất hiện ở cả 2 tab đó,
  // giống cách shuttle.html cho khách "urgent" xuất hiện ở cả tab gốc lẫn tab "Rước liền".
  const visibleRows = mergedRows.filter(row => pkRowMatchesSubTab(row, pkSubTab));

  // Số lượng bên cạnh tên mỗi tab — đếm trên CẢ 4 tab (không chỉ tab đang xem) để chuyển tab vẫn thấy
  // đúng số ngay, không phải đợi bấm vào mới cập nhật.
  ['all', 'don', 'ruoclien', 'tra'].forEach((tab) => {
    const el = document.getElementById(`pkSubtabCount-${tab}`);
    if (el) el.textContent = `(${mergedRows.filter((row) => pkRowMatchesSubTab(row, tab)).length})`;
  });

  const rowsHtml = visibleRows.map((row, idx) => row.kind === 'pk'
    ? pkRenderPickupRow(row.data, idx, shuttleDriverMap)
    : pkRenderTransshipRow(row.data, idx, shuttleDriverMap)
  ).join('');

  // Dòng đã bị lọc khỏi tab đang xem thì bỏ chọn luôn (tránh giữ 1 lựa chọn "vô hình" khi đổi tab).
  const visibleKeys = new Set(visibleRows.map(row => row.key));
  Array.from(pkSelectedIds).forEach(key => { if (!visibleKeys.has(key)) pkSelectedIds.delete(key); });

  const checkAllEl = document.getElementById('pkCheckAll');
  if (checkAllEl) checkAllEl.checked = visibleRows.length > 0 && visibleRows.every(row => pkSelectedIds.has(row.key));

  if (!rowsHtml) {
    tbody.innerHTML = '';
    if (gridEmpty) gridEmpty.style.display = 'block';
    pkUpdateActionBar();
    return;
  }
  if (gridEmpty) gridEmpty.style.display = 'none';
  tbody.innerHTML = rowsHtml;
  pkUpdateActionBar();
}

// Gom hành khách trung chuyển (có địa chỉ trung chuyển đón/trả, hoặc guestType 'Trung chuyển') từ seat
// bank của MỌI phơi — trả về mảng { tripId, trip, main, seatCodes, seatCount }. Lọc theo từ khoá tìm
// kiếm (tên/SĐT/mã ghế), bộ lọc trạm đi/đến, khung giờ (theo giờ phơi) và trạng thái giống bảng rước
// liền. KHÔNG lọc theo ngày: vé trung chuyển trong seat bank không mang ngày riêng cho từng khách nên
// trang này gộp toàn bộ hành khách trung chuyển của mọi phơi. Bỏ các ghế đã nằm trong danh sách khách
// rước liền đã chỉ định (tránh hiện trùng 2 dòng).
function pkGetTransshipRows(selectedDateStr, filterState, skipSeatKeys) {
  const kw = (filterState.search || '').toLowerCase();
  const rows = [];
  const seen = new Set();

  Object.keys(tripSeatBank || {}).forEach(tripId => {
    const bank = tripSeatBank[tripId];
    if (!bank) return;
    const trip = allTripsMeta.find(t => String(t.id) === String(tripId));

    // Khung giờ theo giờ khởi hành của phơi (bỏ qua khi đang gõ tìm kiếm — lúc đó tìm trên toàn bộ).
    if (!kw && filterState.timeSlot !== 'all' && trip && trip.time) {
      const hh = parseInt(String(trip.time).split(':')[0], 10);
      if (filterState.timeSlot === 'morning' && !(hh >= 0 && hh < 12)) return;
      if (filterState.timeSlot === 'afternoon' && !(hh >= 12 && hh < 18)) return;
      if (filterState.timeSlot === 'evening' && !(hh >= 18 && hh <= 24)) return;
    }

    const seats = [...(bank.down || []), ...(bank.up || []), ...(bank.extraSeats || [])]
      .filter(s => s && ['sold', 'hold', 'free', 'cargo'].includes(s.state));

    const byTicket = new Map();
    seats.forEach(s => {
      const key = tripId + '|' + (s.ticketNo || ('T-' + s.code));
      if (!byTicket.has(key)) byTicket.set(key, []);
      byTicket.get(key).push(s);
    });

    byTicket.forEach((members, key) => {
      members.sort((a, b) => String(a.code).localeCompare(String(b.code)));
      const main = members[0];
      const isTransship = main.guestType === 'Trung chuyển'
        || !!main.pickupAddress || !!main.transship || !!main.transshipStation
        || !!main.dropoffAddress || !!main.arrivalTransfer;
      if (!isTransship) return;
      if (skipSeatKeys && members.some(s => skipSeatKeys.has(tripId + '|' + s.code))) return;
      if (seen.has(key)) return;
      seen.add(key);
      rows.push({ tripId, trip, main, seatCodes: members.map(s => s.code), seatCount: members.length });
    });
  });

  return rows.filter(r => {
    const m = r.main;
    // Trạng thái: dòng trung chuyển luôn đã có ghế -> coi như "đã chỉ định".
    if (filterState.status === 'pending') return false;
    if (!kw && filterState.fromStation !== 'all' && m.firstStop !== filterState.fromStation) return false;
    if (!kw && filterState.toStation !== 'all' && m.lastStop !== filterState.toStation) return false;
    if (!kw) return true;
    return (m.customerName && m.customerName.toLowerCase().includes(kw))
      || (m.phone && String(m.phone).toLowerCase().includes(kw))
      || r.seatCodes.some(c => String(c).toLowerCase().includes(kw));
  });
}

// Chỉ số ổn định (không đổi giữa các lần render) suy từ chuỗi khoá — dùng để gán dữ liệu mẫu tài xế/
// giờ in cho khách trung chuyển sao cho mỗi khách luôn nhận cùng 1 giá trị, không nhấp nháy.
function pkStableIndex(str, mod) {
  let h = 0;
  const s = String(str || '');
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return mod ? h % mod : h;
}

// Dữ liệu mẫu tài xế trung chuyển (dùng khi seat bank chưa có tài xế thật gán từ trang shuttle.html) —
// để cột "Trung chuyển" của khách trung chuyển không bị trống trong bản demo.
const PK_TS_SAMPLE_DRIVERS = [
  { name: 'Trần Văn Hùng', phone: '0908 111 222', note: 'Đã liên hệ khách, hẹn đón đúng giờ' },
  { name: 'Nguyễn Văn Nam', phone: '0918 333 444', note: 'Khách chờ ở sảnh, xe 7 chỗ' },
  { name: 'Phạm Quốc Bảo', phone: '0937 555 666', note: 'Đón thêm 1 khách cùng điểm' },
  { name: 'Lê Hoàng Anh', phone: '0946 777 888', note: 'Xe đang trên đường, ETA 10 phút' },
  { name: 'Võ Thành Long', phone: '0977 999 000', note: '' }
];

// Mốc thời gian mẫu — suy ổn định từ giờ khởi hành phơi (trước giờ chạy `minutesBefore` phút), trả về
// chuỗi ISO để formatHistoryDate()/formatActionTime() hiển thị 2 dòng giống cột "Thời gian"/"In lúc"
// bảng khách rước liền.
function pkSampleStamp(trip, minutesBefore, seed) {
  const base = (trip && trip.date) ? trip.date : '2026-07-18';
  const t = (trip && trip.time) ? String(trip.time) : '07:00';
  const parts = t.split(':').map(Number);
  let total = (parts[0] || 0) * 60 + (parts[1] || 0) - minutesBefore - (seed % 15);
  if (total < 0) total += 1440;
  const H = String(Math.floor(total / 60) % 24).padStart(2, '0');
  const M = String(total % 60).padStart(2, '0');
  return `${base}T${H}:${M}:00`;
}

// 1 dòng "hành khách trung chuyển" trong bảng gộp — các cột Thời gian / In lúc / Trung chuyển / Phòng vé
// / Thao tác render Y HỆT dòng khách rước liền (cùng markup, class, định dạng 2 dòng, nút bấm). Phần
// khác duy nhất là nguồn dữ liệu: lấy từ seat bank (khách trung chuyển của mọi phơi) + dữ liệu mẫu ổn
// định khi chưa có giá trị thật. Ghi chú "Phòng vé" bấm được, sửa qua #tsStatusNoteModal theo ticketNo.
function pkRenderTransshipRow(r, idx, shuttleDriverMap) {
  const m = r.main;
  const sampleSeed = pkStableIndex(m.phone || m.ticketNo || r.seatCodes[0] || String(idx), PK_TS_SAMPLE_DRIVERS.length);
  const routeParts = (r.trip && r.trip.route ? String(r.trip.route).split(' - ') : []);
  const fromMain = escapeHtml(m.firstStop || routeParts[0] || '—');
  const toMain = escapeHtml(m.lastStop || routeParts[routeParts.length - 1] || '—');
  const fromSub = m.pickupAddress || m.transship || m.transshipStation || '';
  const toSub = m.dropoffAddress || m.arrivalTransfer || '';
  const firstStopHtml = fromSub
    ? `${fromMain}<div class="ch-sub-address" style="font-size:12px;color:var(--text-sub);margin-top:2px;">Đón: ${escapeHtml(fromSub)}</div>`
    : fromMain;
  const lastStopHtml = toSub
    ? `${toMain}<div class="ch-sub-address" style="font-size:12px;color:var(--text-sub);margin-top:2px;">Trả: ${escapeHtml(toSub)}</div>`
    : toMain;
  // Cột "Hành trình" — 2 tab lọc riêng "Trung chuyển đón"/"Trung chuyển trả" chỉ cần đúng 1 chiều (chỉ
  // điểm đón / chỉ điểm trả), không cần hiện cả hành trình 2 chặng như tab "Tất cả"/"Rước liền".
  const fromRowHtml = `
      <div class="pax-route-row pax-route-from">
        <svg class="pax-route-icon" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/></svg>
        <div class="pax-route-text">${firstStopHtml}</div>
      </div>`;
  const toRowHtml = `
      <div class="pax-route-row pax-route-to">
        <svg class="pax-route-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
        <div class="pax-route-text">${lastStopHtml}</div>
      </div>`;
  const routeHtml = pkSubTab === 'don'
    ? `<div class="pax-route">${fromRowHtml}</div>`
    : pkSubTab === 'tra'
      ? `<div class="pax-route">${toRowHtml}</div>`
      : `<div class="pax-route">${fromRowHtml}<div class="pax-route-connector"></div>${toRowHtml}</div>`;

  const driverKey = pkShuttleDriverLegKey(m.phone);
  const assignedDriver = shuttleDriverMap[driverKey];
  const isDispatchRole = pkIsShuttleDispatchRole();
  // Cột "Trung chuyển" = tên tài xế đã gán (HN_SHUTTLE_DRIVER_KEY) + ghi chú của trung chuyển
  // (driverNote). ĐỂ TRỐNG khi chưa gán tài xế thật (không còn tên/ghi chú tài xế mẫu).
  // Bấm được / chỉ xem theo role: xem pkTransshipCellHtml().
  const drvName = (assignedDriver && assignedDriver.driverName) || '';
  const drvNote = (assignedDriver && assignedDriver.driverNote) || '';
  const tsTransshipInnerHtml = `<span class="pk-driver-name">${escapeHtml(drvName)}</span>${drvNote
    ? `<span class="pk-driver-sub">${escapeHtml(drvNote)}</span>`
    : (isDispatchRole ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px;margin-top:2px;"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>` : '')}`;
  const transshipCell = pkTransshipCellHtml(tsTransshipInnerHtml, pkTransshipRowKey(r), isDispatchRole);

  // Cột "Trạng thái" — TÁCH RIÊNG khỏi cột "Trung chuyển", hiện ở CẢ 2 role (chỉ xem — đổi trạng thái
  // qua thanh nổi "Cập nhật", xem pkOpenDriverUpdateModal/pkSaveDriverUpdate).
  const tsRowStatus = (assignedDriver && assignedDriver.status) || 'waiting';
  const statusCell = `<span class="pk-status-tag ${PK_STATUS_LABELS[tsRowStatus].cls}">${PK_STATUS_LABELS[tsRowStatus].text}</span>`;

  // Cột "Phòng vé": Y HỆT dòng rước liền — role bán vé bấm được để ghi/sửa ghi chú trạng thái đón (mở
  // #tsStatusNoteModal, khoá theo ticketNo); role trung chuyển chỉ xem (ghi chú riêng của phòng vé).
  const pickupNote = m.transshipPickupNote || '';
  const hasStatusNote = !!pickupNote;
  const phongVeInnerHtml = hasStatusNote
    ? `<span class="pk-note-text">${escapeHtml(pickupNote)}</span>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`;
  const phongVeCell = pkPhongVeCellHtml(phongVeInnerHtml, hasStatusNote, isDispatchRole, 'openTransshipStatusNoteModal', JSON.stringify([m.ticketNo || '', 'pickup']));

  // Cột "Thời gian" / "In lúc": 2 dòng ngày + giờ giống dòng rước liền (dùng mốc mẫu ổn định vì vé trong
  // seat bank không mang mốc tạo/in riêng).
  const createdAt = pkSampleStamp(r.trip, 210, sampleSeed);
  const timeStr = `${formatHistoryDate(createdAt)}<br>${formatActionTime(createdAt)}`;
  const printedAt = m.printedAt || pkSampleStamp(r.trip, 90, sampleSeed);
  const printedStr = `${formatHistoryDate(printedAt)}<br>${formatActionTime(printedAt)}`;

  const seatCell = `<button type="button" class="pk-seat-link" data-action="sellTicketForTrip" data-args='${JSON.stringify([r.tripId])}' title="Bấm để mở phơi đã chỉ định">${escapeHtml(r.seatCodes.join(', '))}</button>`;
  // Cột cuối — checkbox thay cho nút "Đổi chỉ định" mỗi dòng (xem pkToggleRow/pkActionBar): chọn dòng
  // rồi bấm nút trên thanh nổi, nút đó tự gọi lại đúng sellTicketForTrip cho dòng trung chuyển này.
  const pkRowKey = pkTransshipRowKey(r);
  const checkCell = `<input type="checkbox" ${pkSelectedIds.has(pkRowKey) ? 'checked' : ''} data-change-action="pkToggleRow" data-args='["${pkRowKey}","__this__"]'>`;

  return `
    <tr class="${pkSelectedIds.has(pkRowKey) ? 'selected-row' : ''}">
      <td class="col-stt">${idx + 1}</td>
      <td><div class="pax-info"><span class="pk-type-chip">Trung chuyển</span><div class="pax-name">KH: ${escapeHtml(m.customerName || 'Khách')}</div><div class="pax-phone">SĐT: ${escapeHtml(m.phone || '')}</div></div></td>
      <td>${routeHtml}</td>
      <td class="center" style="font-weight:700; font-size:13.5px; color:var(--text-main);">${r.seatCount}</td>
      <td class="center">${seatCell}</td>
      <td class="note-cell">${m.note ? escapeHtml(m.note) : '—'}</td>
      <td class="center mono" style="font-size:12px; color:var(--text-sub);">${timeStr}</td>
      <td class="center mono" style="font-size:12px; color:var(--text-sub);">${printedStr}</td>
      <td class="center">${statusCell}</td>
      <td class="center">${transshipCell}</td>
      <td class="center">${phongVeCell}</td>
      <td class="col-check">${checkCell}</td>
    </tr>`;
}

// ===== Modal ghi chú trạng thái đón khách rước liền (#pkStatusNoteModal, cột "Phòng vé") =====

let pkStatusNoteActiveId = null;

function pkOpenStatusNoteModal(paxId) {
  pkStatusNoteActiveId = paxId;
  const pax = pickupPassengers.find(p => p.id === paxId);
  const input = document.getElementById('pkStatusNoteInput');
  if (input) input.value = (pax && pax.statusNote) || '';
  const modal = document.getElementById('pkStatusNoteModal');
  if (modal) modal.classList.add('open');
}

function pkSaveStatusNote() {
  if (pkStatusNoteActiveId == null) return;
  const idx = pickupPassengers.findIndex(p => p.id === pkStatusNoteActiveId);
  if (idx === -1) { closeModal('pkStatusNoteModal'); pkStatusNoteActiveId = null; return; }

  const input = document.getElementById('pkStatusNoteInput');
  const value = input ? input.value.trim() : '';
  const pax = pickupPassengers[idx];
  const changed = (pax.statusNote || '') !== value;
  pax.statusNote = value;

  // Chỉ đẩy lên đầu danh sách khi ghi chú VỪA được thêm mới hoặc đổi nội dung — bấm "Lưu" mà không đổi
  // gì thì giữ nguyên vị trí, tránh xáo trộn danh sách không cần thiết. Đánh dấu mốc cập nhật để dòng
  // này nổi lên đầu bảng gộp, đứng trên cả các dòng khách trung chuyển.
  if (changed) {
    pickupPassengers.splice(idx, 1);
    pickupPassengers.unshift(pax);
    pkMarkRowUpdated(pkPickupRowKey(pax));
  }

  savePickupPassengers();
  closeModal('pkStatusNoteModal');
  pkStatusNoteActiveId = null;
  pkRenderPaxTable();
}

// ===== Modal "Chỉ định xe rước liền" =====

let pkActivePaxId = null, pkActiveTripId = null, pkSelectedSeats = [], pkTripSearchKeyword = '', pkCustomAssignPrice = null;

function pkOpenAssignModal(paxId) {
  pkActivePaxId = paxId;
  const pax = pickupPassengers.find(p => p.id === paxId);
  if (!pax) return;

  const countStr = (pax.ticketCount || pax.count || 1) + ' vé';
  document.getElementById('pkAssignModalSub').textContent = `Khách: ${pax.name} · ${pax.phone} · SL: ${countStr} · ${pax.fromStation} → ${pax.toStation}`;
  pkActiveTripId = pax.assigned ? pax.assigned.tripId : allTripsMeta[0].id;

  if (pax.assigned && pax.assigned.seats && Array.isArray(pax.assigned.seats)) {
    pkSelectedSeats = [...pax.assigned.seats];
  } else if (pax.assigned && pax.assigned.seat) {
    pkSelectedSeats = pax.assigned.seat.split(',').map(s => s.trim()).filter(Boolean);
  } else {
    pkSelectedSeats = [];
  }

  const trip = allTripsMeta.find(t => t.id === pkActiveTripId);
  pkCustomAssignPrice = pax.assigned && pax.assigned.price ? pax.assigned.price : (trip ? (trip.price || 280000) : 280000);
  const priceInput = document.getElementById('pkAssignTripPrice');
  if (priceInput) priceInput.value = pkCustomAssignPrice;

  pkTripSearchKeyword = '';
  const searchInput = document.getElementById('pkTripSearchInput');
  if (searchInput) searchInput.value = '';

  pkRenderTripList();
  pkRenderSeatMap();
  pkUpdateConfirmState();
  document.getElementById('assignPickupModal').classList.add('open');
}

function pkCloseAssignModal() {
  document.getElementById('assignPickupModal').classList.remove('open');
  pkActivePaxId = null; pkActiveTripId = null; pkSelectedSeats = []; pkTripSearchKeyword = ''; pkCustomAssignPrice = null;
}

function pkFilterTripList(keyword) {
  pkTripSearchKeyword = keyword || '';
  pkRenderTripList();
}

function pkRenderTripList() {
  const wrap = document.getElementById('pkTripListPanel');
  if (!wrap) return;
  const kw = pkTripSearchKeyword.trim().toLowerCase();

  const filtered = !kw ? allTripsMeta : allTripsMeta.filter(t =>
    t.time.toLowerCase().includes(kw) || (t.plate && t.plate.toLowerCase().includes(kw)) ||
    t.route.toLowerCase().includes(kw) || (t.vehicleType && t.vehicleType.toLowerCase().includes(kw))
  );

  if (filtered.length === 0) {
    wrap.innerHTML = '<div class="pk-trip-empty-msg">Không tìm thấy phơi xe phù hợp</div>';
    return;
  }

  // Dùng nguyên class .trip-card/.trip-card-row1/.trip-card-row2/.trip-seat-tag của renderZone1TripList()
  // để danh sách phơi trong modal "Chỉ định xe" giống y hệt danh sách phơi Zone 1, không phải bản
  // .pk-trip-card riêng nữa.
  wrap.innerHTML = filtered.map(t => {
    const plan = tripSeatBank[t.id];
    const totalSeats = plan ? plan.down.filter(s => s.state !== 'hidden').length + plan.up.filter(s => s.state !== 'hidden').length : 0;
    const bookedSeats = plan ? [...plan.down, ...plan.up].filter(s => ['sold', 'hold', 'free', 'cargo'].includes(s.state)).length : 0;
    const selected = t.id === pkActiveTripId ? 'selected' : '';
    const plate = t.plate || 'Chưa có';
    const vehicleType = t.vehicleType || 'Chưa rõ';
    const isLimo = vehicleType.toLowerCase().includes('limousine') || vehicleType.toLowerCase().includes('limo');
    const seatTagClass = isLimo ? 'tag-limo' : 'tag-normal';
    const displayTripName = t.name || `${t.route} (${t.time})`;

    return `
      <div class="trip-card ${selected}" data-action="pkSelectTrip" data-args='["${t.id}"]'>
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
      </div>`;
  }).join('');
}

function pkSelectTrip(tripId) {
  if (tripId === pkActiveTripId) return;
  pkActiveTripId = tripId;
  pkSelectedSeats = [];

  const trip = allTripsMeta.find(t => t.id === pkActiveTripId);
  pkCustomAssignPrice = trip ? (trip.price || 280000) : 280000;
  const priceInput = document.getElementById('pkAssignTripPrice');
  if (priceInput) priceInput.value = pkCustomAssignPrice;

  pkRenderTripList();
  pkRenderSeatMap();
  pkUpdateConfirmState();
}

function pkOnAssignPriceChange(val) {
  pkCustomAssignPrice = Math.max(0, parseInt(val) || 0);
  pkUpdateConfirmState();
}

function pkRenderSeatMap() {
  const floorDownEl = document.getElementById('pkAssignSeatFloorDown');
  const floorUpEl = document.getElementById('pkAssignSeatFloorUp');
  const tripPlan = tripSeatBank[pkActiveTripId];
  if (!tripPlan || !floorDownEl || !floorUpEl) return;

  const mapSeat = seat => {
    if (seat.state === 'hidden') {
      return `<div class="van-seat" style="visibility:hidden; pointer-events:none;"></div>`;
    }
    const isSelected = pkSelectedSeats.includes(seat.code);
    const isBooked = ['sold', 'hold', 'free', 'cargo'].includes(seat.state);
    const cls = isBooked ? 'blocked' : (isSelected ? 'selected' : 'empty');
    const clickable = !isBooked ? `data-action="pkSelectSeat" data-args='["${seat.code}"]'` : '';

    return `
      <div class="van-seat ${cls}" ${clickable}>
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V17C19 18.6569 17.6569 20 16 20H8C6.34315 20 5 18.6569 5 17V5Z"/>
          <path d="M2 8C2 7.44772 2.44772 7 3 7H5V15H3C2.44772 15 2 14.5523 2 14V8Z"/>
          <path d="M19 7H21C21.5523 7 22 7.44772 22 8V14C22 14.5523 21.5523 15 21 15H19V7Z"/>
        </svg>
        <span class="seat-num">${seat.code}</span>
      </div>`;
  };

  const totalSeats = tripPlan.down.length + tripPlan.up.length;
  const useThreeCols = totalSeats >= 34;

  floorDownEl.classList.toggle('cols-3', useThreeCols);
  floorDownEl.innerHTML = tripPlan.down.map(mapSeat).join('');

  if (tripPlan.up.length === 0) {
    floorUpEl.parentElement.style.display = 'none';
    floorDownEl.parentElement.style.maxWidth = '320px';
    floorDownEl.parentElement.style.margin = '0 auto';
  } else {
    floorUpEl.parentElement.style.display = 'flex';
    floorDownEl.parentElement.style.maxWidth = '';
    floorDownEl.parentElement.style.margin = '';
    floorUpEl.classList.toggle('cols-3', useThreeCols);
    floorUpEl.innerHTML = tripPlan.up.map(mapSeat).join('');
  }
}

function pkSelectSeat(code) {
  const tripPlan = tripSeatBank[pkActiveTripId];
  if (!tripPlan) return;
  const seat = [...tripPlan.down, ...tripPlan.up].find(s => s.code === code);
  if (!seat || ['sold', 'hold', 'free', 'cargo'].includes(seat.state)) return;

  const idx = pkSelectedSeats.indexOf(code);
  if (idx !== -1) pkSelectedSeats.splice(idx, 1);
  else pkSelectedSeats.push(code);

  pkRenderSeatMap();
  pkUpdateConfirmState();
}

// Đơn giá áp dụng: ưu tiên giá tuỳ chỉnh trong modal, nếu không thì lấy giá của phơi xe (mặc định 280000)
function pkGetUnitPrice(trip) {
  return (pkCustomAssignPrice !== null && !isNaN(pkCustomAssignPrice)) ? pkCustomAssignPrice : (trip ? (trip.price || 280000) : 280000);
}

function pkUpdateConfirmState() {
  const btn = document.getElementById('pkConfirmAssignBtn');
  const hint = document.getElementById('pkAssignHint');
  const totalEl = document.getElementById('pkAssignTotalPrice');
  if (!btn) return;

  const trip = allTripsMeta.find(t => t.id === pkActiveTripId);
  const unitPrice = pkGetUnitPrice(trip);
  const totalPrice = unitPrice * pkSelectedSeats.length;

  if (totalEl) totalEl.textContent = totalPrice.toLocaleString('vi-VN') + 'đ';

  if (pkActiveTripId && pkSelectedSeats.length > 0) {
    btn.disabled = false;
    hint.innerHTML = `Sẽ chỉ định <b>${pkSelectedSeats.length} ghế (${pkSelectedSeats.join(', ')})</b> — phơi xe <b>${trip ? trip.time : pkActiveTripId}</b>`;
  } else {
    btn.disabled = true;
    hint.textContent = 'Chọn 1 phơi xe và chọn 1 hoặc nhiều ghế trống để chỉ định.';
  }
}

function pkConfirmAssign() {
  if (!pkActivePaxId || !pkActiveTripId || pkSelectedSeats.length === 0) return;
  const pax = pickupPassengers.find(p => p.id === pkActivePaxId);
  if (!pax) return;

  const tripPlan = tripSeatBank[pkActiveTripId];
  if (!tripPlan) return;

  // Nếu khách đang đổi chỉ định từ 1 hoặc nhiều ghế/phơi xe khác thì trả ghế cũ về trạng thái trống
  if (pax.assigned) {
    const oldTripPlan = tripSeatBank[pax.assigned.tripId];
    if (oldTripPlan) {
      const oldSeatsList = pax.assigned.seats || (pax.assigned.seat ? pax.assigned.seat.split(',').map(s => s.trim()).filter(Boolean) : []);
      oldSeatsList.forEach(code => {
        const oldSeat = [...oldTripPlan.down, ...oldTripPlan.up].find(s => s.code === code);
        if (oldSeat) {
          Object.assign(oldSeat, { state: 'empty', customerName: null, phone: null, ticketNo: null, paid: false });
        }
      });
    }
  }

  const trip = allTripsMeta.find(t => t.id === pkActiveTripId);
  const unitPrice = pkGetUnitPrice(trip);
  const ticketNumber = "SGCD-" + String(Math.floor(1000 + Math.random() * 9000));

  pkSelectedSeats.forEach(code => {
    const targetSeat = [...tripPlan.down, ...tripPlan.up].find(s => s.code === code);
    if (targetSeat) {
      Object.assign(targetSeat, {
        state: 'sold', customerName: pax.name, phone: pax.phone,
        firstStop: pax.fromStation, lastStop: pax.toStation,
        transshipStation: pax.fromTransfer, price: unitPrice,
        paid: true, count: pkSelectedSeats.length, ticketNo: ticketNumber
      });
    }
  });

  pax.assigned = { tripId: pkActiveTripId, seat: pkSelectedSeats.join(', '), seats: [...pkSelectedSeats], price: unitPrice };

  saveSeatBank();
  savePickupPassengers();

  pkCloseAssignModal();
  pkRenderPaxTable();
  const totalPrice = unitPrice * pkSelectedSeats.length;
  showToast(`Đã bán vé cho ${pax.name} lên xe ${trip ? (trip.plate || '') : ''} — ${pkSelectedSeats.length} ghế (${pkSelectedSeats.join(', ')}) · Tổng: ${totalPrice.toLocaleString('vi-VN')}đ`);
}

document.getElementById('assignPickupModal').addEventListener('click', (e) => {
  if (e.target.id === 'assignPickupModal') pkCloseAssignModal();
});