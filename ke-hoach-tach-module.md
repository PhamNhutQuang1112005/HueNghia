# KẾ HOẠCH TÁCH MODULE — Web Nhà Xe Huê Nghĩa

> Cập nhật 07/08/2026. Số liệu đo trực tiếp trên mã nguồn hiện tại, không phải ước lượng.

## 0. Hiện trạng

### 0.1 Quy mô

| Trang | JS (dòng / hàm) | CSS (dòng / rule) | HTML (dòng / inline handler) |
|---|---|---|---|
| callcenter | 3.752 / 133 | 4.834 / 650 | 1.431 / 109 |
| ticketstaff | 3.772 / 131 | 4.515 / 609 | 996 / 98 |
| shuttle | 1.565 / 50 | 973 / 222 | 534 / 34 |
| pickup-list | 770 / 36 | 439 / 159 | 261 / 18 |
| login (index) | 159 / 3 | 329 / 47 | 93 / 0 |
| **Tổng** | **10.018 / 353** | **11.090 / 1.687** | **3.315 / 259** |

Cộng thêm 71 inline handler sinh động trong template string của JS → **tổng 330 inline handler, trỏ tới 98 hàm đích duy nhất**.

Mỗi trang hiện nạp đúng 1 file JS + 1–2 file CSS, không dùng chung gì. Riêng `pickup-list.html` đã nạp cả `shuttle.css` + `pickup-list.css` — tức việc chia sẻ CSS đã bắt đầu tự phát, chưa có quy tắc.

### 0.2 Trùng lặp JS — đối chiếu từng cặp trang

So sánh **nội dung hàm** (chuẩn hoá khoảng trắng), không chỉ so tên:

| Cặp trang | Trùng tên | Giống hệt 100% | Khác nội dung |
|---|---|---|---|
| callcenter ↔ ticketstaff | 103 | **70** | 33 |
| callcenter ↔ pickup-list | 16 | 4 | 12 |
| ticketstaff ↔ pickup-list | 16 | 3 | 13 |
| pickup-list ↔ shuttle | 13 | 2 | 11 |
| callcenter ↔ shuttle | 10 | 0 | 10 |
| ticketstaff ↔ shuttle | 9 | 0 | 9 |

Hàm chỉ có ở đúng 1 trang: callcenter 28, ticketstaff 27, shuttle 34, pickup-list 14.

> ⚠️ Bản kế hoạch trước ghi "62 giống hệt / 45 khác nội dung / 30 riêng cc / 27 riêng ts". Con số đó đếm bằng cách so danh sách tên hàm có dòng lặp nên bị lệch. Số đúng là bảng trên.

### 0.3 Ba nhóm hàm dùng chung xuyên nhiều trang (bản cũ bỏ sót hoàn toàn)

**Nhóm A — Lịch / ngày (có ở cả 4 trang):**
`renderCalendar`, `shiftMonth`, `pickDate`, `goToday`, `toggleCalendar`, `updateCalTrigger`

Mức giống nhau so với bản callcenter: ticketstaff 84–100%, shuttle 45–89%, pickup-list 45–71%. Khác biệt chủ yếu ở tên phần tử DOM và định dạng ngày hiển thị → gộp được thành 1 widget nhận tham số cấu hình, nhưng phải làm cẩn thận vì không phải copy thẳng.

**Nhóm B — Sơ đồ ghế / seat bank (có ở 3 trang: callcenter, ticketstaff, pickup-list):**

| Hàm | cc↔ts | cc↔pl |
|---|---|---|
| `getSeatCodesForVehicleType` | 100% | 100% |
| `saveSeatBank` | 100% | 100% |
| `buildSequentialSeatCodes` | 100% | 89% |
| `loadSeatBank` | 100% | 74% |
| `generateTripSeatPlanForVehicleType` | 100% | 56% |
| `groupSeat` | 80% | 100% |
| `makeSeat` | 61% | 76% |

**Nhóm C — UI vặt (4 trang):** `showToast` (78–100%), `openMenu`, `closeMenu`, `toggleSearchResults` (100%), `pickSearchResult` (100% ở 3 trang).

### 0.4 Trùng lặp DỮ LIỆU / hằng số (bản cũ không nhắc tới — rủi ro cao nhất)

Các khối dữ liệu dưới đây được **copy nguyên văn, hash trùng khớp** giữa các file:

| Hằng số | Có ở | Trạng thái |
|---|---|---|
| `VEHICLE_TYPE_SEATS` | callcenter, ticketstaff, pickup-list | giống hệt |
| `STAFF_CODE_MAP` | callcenter, ticketstaff | giống hệt |
| `CUSTOMER_HISTORY_DATA` | callcenter, ticketstaff | giống hệt |
| `DEFAULT_SGCD_TRIPS` / `DEFAULT_CDSG_TRIPS` | callcenter, ticketstaff | giống hệt |
| `OCCUPIED_STATES`, `TS_WINDOW_HOURS`, `DEFAULT_SUB_SEAT_PRICE`, `DEFAULT_STAFF_STATION`, `ZONE1_COLLAPSED_KEY` | callcenter, ticketstaff | giống hệt |

**Key `localStorage` bị khai báo lặp ở nhiều nơi:**

| Key | Khai báo ở |
|---|---|
| `hn_trip_seat_bank_v12` | callcenter, ticketstaff, pickup-list, shuttle (4 file) |
| `hn_trips_meta_v9` | callcenter, ticketstaff, pickup-list (3 file) |
| `hn_pickup_passengers_v6` | callcenter (×2, trong thân hàm), ticketstaff (×2), pickup-list (×1) — **5 chỗ** |
| `hn_current_user` | cả 4 trang, viết thẳng chuỗi, không có hằng số |

Đây là loại trùng lặp **nguy hiểm hơn trùng hàm**: nếu sửa key ở 1 file mà quên file khác, 2 trang sẽ đọc/ghi 2 kho dữ liệu khác nhau và mất đồng bộ mà không báo lỗi. Xử lý ưu tiên — xem Giai đoạn 2.

### 0.5 Trùng lặp CSS — ĐÃ ĐO (bản cũ ghi "chưa kiểm tra")

`callcenter.css` vs `ticketstaff.css`:

- **540 rule có selector giống nhau VÀ nội dung giống hệt** → **3.351 dòng trùng lặp**
- Chiếm **85% `callcenter.css`** và **90% `ticketstaff.css`**
- Riêng callcenter: 610 dòng · riêng ticketstaff: 357 dòng
- Chỉ **8 selector trùng tên nhưng khác nội dung** — phải giữ riêng theo trang:
  `:root`, `.pill-btn`, `.pill-btn.active`, `.tab-btn-group`, `.ticket .price`, `.ticket .edit-price`, `.seat-footbtn`, `.zone3`

Biến `:root`: 13 biến giống nhau ở **cả 5 file** (`--black`, `--border-gray`, `--green`, `--radius-sm/md/lg`, `--red`, `--red-light`, `--surface`, `--surface-2`, `--text-main`, `--text-sub`, `--white`); 19 biến chung riêng cc+ts.

Nợ kỹ thuật CSS khác: `!important` — callcenter 59, ticketstaff 61, shuttle 18, pickup-list 1. Selector bị khai báo trùng **trong cùng 1 file**: callcenter 16, ticketstaff 16.

> ⚠️ **Số liệu trên đo TRƯỚC Giai đoạn 1 (tách CSS)** — sau khi tách, phần lớn cả 2 loại nợ kỹ thuật này đã
> **di chuyển sang `css/shared/booking-ui.css`** cùng với 3.351 dòng trùng lặp, không còn nằm ở
> `callcenter.css`/`ticketstaff.css` như bảng trên ghi. Đã đo lại chính xác ở Giai đoạn 7 — xem mục đó.

Không có `@media` nào trong callcenter/ticketstaff/pickup-list (chỉ shuttle có 1) → tách file không phải lo vấn đề thứ tự media query.

### 0.6 Trùng lặp HTML

`callcenter.html` và `ticketstaff.html` dùng chung **131 trên 157 `id`** (83%) — cùng bộ modal, cùng panel đặt vé, cùng bảng lịch sử khách. Riêng callcenter 63 id, riêng ticketstaff 26 id. Con số này khớp với 540 rule CSS trùng: hai trang về bản chất là **một giao diện, hai bản copy**.

`pickup-list` ↔ `shuttle`: 19 id chung.

### 0.7 Lỗi/dead code phát hiện được — xử lý trước khi tách

**(a) 3 hàm bị khai báo 2 lần trong `ticketstaff.js`** — do function hoisting, bản khai báo sau ghi đè bản trước, nên bản đầu là code chết:

| Hàm | Bản CHẾT (xóa) | Bản ĐANG CHẠY (giữ) |
|---|---|---|
| `fillSearchInputWithPhone` | dòng 59 (9 dòng, có kiểm tra SĐT) | dòng 2189 (4 dòng, không kiểm tra) |
| `openCancelModal` | dòng 1191 (7 dòng, dùng `currentCancelSeat`) | dòng 1884 (11 dòng, dùng `currentCancelSeatCode`) |
| `checkCancelReason` | dòng 1198 (4 dòng) | dòng 1896 (7 dòng, có null-check) |

Hệ quả liên đới: biến `currentCancelSeat` (khai báo dòng 445) giờ thành thừa, và `confirmCancel()` phải viết phòng hờ `currentCancelSeatCode || currentCancelSeat`.

Xóa 3 khai báo chết → đổi hết tham chiếu về `currentCancelSeatCode` → xóa biến `currentCancelSeat` và điều kiện `||` thừa. **Hành vi ứng dụng không đổi** vì bản đang chạy vốn là bản thứ hai.

**(b) 2 hàm được gọi nhưng KHÔNG tồn tại** — đang ném `ReferenceError` mỗi khi người dùng thao tác:

| Hàm | Số chỗ gọi | Ở đâu |
|---|---|---|
| `updateRebookPreview()` | **18** | `callcenter.html` (9) + `ticketstaff.html` (9) — toàn bộ ô nhập của form "đặt lại vé" (`rbName`, `rbPhone`, `rbFirstStop`, `rbLastStop`, `rbNote`, `rbLuggage`...) |
| `resetPhoiFilters()` | 1 | `callcenter.html:751` — nút "xoá lọc" ở tab phôi |

Không có định nghĩa nào trong bất kỳ file JS nào. Đây là tàn dư của tính năng bị gỡ nhưng quên xoá handler.

**Quyết định: xoá 19 inline handler chết này.** Không viết bổ sung 2 hàm — đó là thêm tính năng, vi phạm nguyên tắc #15. Ghi vào "danh sách đề xuất sau" ở mục 6.

**(c) `shuttle.js` đọc sai key `localStorage`** — dòng 1393 đọc `'hn_all_trips_meta_v1'`, nhưng **không file nào ghi key đó**; cả 3 trang còn lại dùng `'hn_trips_meta_v9'`. Hậu quả: `allTripsMeta` trong `loadBookingsFromStorage()` luôn rỗng → tuyến và giờ của khách đồng bộ sang shuttle rơi về giá trị dự phòng (`bank.route`/`bank.time` hoặc mặc định `'Sài Gòn - Châu Đốc'` / `'07:00'`) thay vì lấy đúng từ chuyến.

Không tự sửa trong đợt refactor này (đây là sửa lỗi nghiệp vụ, không phải tách module) — nhưng khi gom key vào `shared/storage-keys.js` ở Giai đoạn 2 thì mâu thuẫn này sẽ lộ ra rõ ràng và phải hỏi ý bạn lúc đó.

---

## 1. Mục tiêu

1. Xoá trùng lặp thật: **3.351 dòng CSS** + **70 hàm JS** giống hệt → mỗi thứ chỉ còn 1 nguồn
2. Gom hằng số/dữ liệu/key `localStorage` dùng chung về 1 chỗ — hết nguy cơ lệch key giữa các trang
3. Mỗi trang chỉ tải đúng phần code nó cần
4. Bỏ hoàn toàn inline `onclick=` (330 chỗ) → event delegation qua `data-action`
5. Không phá nghiệp vụ hiện có — làm theo giai đoạn nhỏ, test được từng bước

**Quyết định kiến trúc:** ~~ES Module (`import`/`export`, `<script type="module">`)~~ — **đã thử ở Giai đoạn 2 rồi bỏ** vì `type="module"` bị trình duyệt chặn CORS khi mở file bằng `file://` (project không có dev server, người dùng mở trực tiếp file HTML). Chuyển về **script thường**: các file `shared/*.js` không dùng `export`, chỉ khai báo `const` top-level bình thường; mỗi trang nạp `shared/storage-keys.js` + `shared/constants.js` bằng `<script src=...>` (không `type="module"`) **trước** script chính của trang — nhờ các thẻ `<script>` thường trong cùng 1 trang chia sẻ chung 1 global lexical scope nên `const` khai báo ở file nạp trước vẫn dùng được ở file nạp sau, không cần `import`. Không cần shim `window.<tên hàm>` vì hàm khai báo bằng `function` ở script thường đã tự động nằm trên `window`.

---

## 2. Kiến trúc thư mục đề xuất

```
css/
  shared/
    variables.css       ← 13 biến chung cả 5 trang + 19 biến chung cc/ts
    base.css            ← reset, typography, topbar, user-menu (4 trang đều có)
    booking-ui.css      ← 540 rule giống hệt cc/ts: sơ đồ ghế, modal, panel đặt vé,
                          bảng lịch sử khách, calendar popover  (~3.351 dòng)
  callcenter.css        ← còn ~610 dòng riêng + 8 selector ghi đè
  ticketstaff.css       ← còn ~357 dòng riêng + 8 selector ghi đè
  pickup-list.css / shuttle.css / login.css   ← nhập sau, Giai đoạn 6

js/
  shared/
    constants.js        ← VEHICLE_TYPE_SEATS, STAFF_CODE_MAP, DEFAULT_*_TRIPS,
                          OCCUPIED_STATES, CUSTOMER_HISTORY_DATA...
    storage-keys.js     ← toàn bộ key hn_* — 1 nguồn duy nhất
    seat-bank.js        ← Nhóm B: load/saveSeatBank, getSeatCodesForVehicleType,
                          buildSequentialSeatCodes, generateTripSeatPlan...
    calendar.js         ← Nhóm A: widget lịch dùng chung 4 trang
    ui.js               ← Nhóm C: showToast, openMenu/closeMenu, dropdown tìm kiếm
    format.js           ← shortenStopName, normalizeSearchText, formatHistoryDate,
                          abbrRouteName, getPastDate...
    booking.js          ← phần lớn trong 70 hàm giống hệt cc/ts: panel đặt vé,
                          ghế phụ, chuyển ghế, lịch sử khách, đặt lại vé
    events.js           ← dispatcher đọc data-action, registry hàm
  callcenter/
    state.js  trip.js  phoi.js  main.js       ← 28 hàm riêng + bản callcenter của 33 hàm khác nội dung
  ticketstaff/
    state.js  ticketing.js  assign-seat.js  main.js   ← 27 hàm riêng + bản ticketstaff của 33 hàm
  pickup-list/ , shuttle/                     ← nhập sau, Giai đoạn 6
  login.js                                    ← để nguyên (159 dòng, 3 hàm, không chung gì)
```

---

## 3. Các giai đoạn

### Giai đoạn 0 — Chuẩn bị
- [x] Backup 15 file gốc
- [x] Đối chiếu nội dung từng hàm giữa 5 trang (mục 0.2)
- [x] Đo trùng lặp CSS (mục 0.5)
- [x] Lập danh sách hằng số/key dùng chung (mục 0.4)
- [ ] Dọn dead code mục 0.7(a): 3 khai báo trùng trong `ticketstaff.js` + biến `currentCancelSeat`
- [ ] Xoá 19 inline handler chết mục 0.7(b)
- [ ] Lập danh sách biến toàn cục cần chuyển thành state module — đã đếm sơ bộ: callcenter ~40 `let` top-level, ticketstaff ~42, pickup-list 9, shuttle 11
- **Bàn giao:** bạn test lại luồng "huỷ ghế" trên ticketstaff và form "đặt lại vé" — phải y hệt trước khi dọn

### Giai đoạn 1 — Tách CSS chung (làm TRƯỚC vì rủi ro thấp, thu hồi lớn nhất)
Không đụng file JS nào. Chỉ tách file + đổi thẻ `<link>`.

- [ ] Tạo `css/shared/variables.css` — 13 biến chung 5 trang; 6 biến `:root` khác nhau giữa cc/ts thì để lại trong file riêng của từng trang (ghi đè sau)
- [ ] Tạo `css/shared/base.css` — reset, font, topbar, user-menu
- [ ] Tạo `css/shared/booking-ui.css` — 540 rule giống hệt (~3.351 dòng)
- [ ] Rút gọn `callcenter.css` còn ~610 dòng riêng, `ticketstaff.css` còn ~357 dòng riêng, **giữ nguyên thứ tự khai báo tương đối** của 8 selector khác nội dung để cascade không đổi
- [ ] Cập nhật `<link>` trong 2 HTML: `variables → base → booking-ui → <trang>.css` (file riêng đứng CUỐI để ghi đè đúng)
- [ ] Tăng `?v=` để tránh cache
- **Bàn giao:** so sánh trực quan callcenter.html và ticketstaff.html trước/sau — mọi thứ phải giống hệt về mặt hình ảnh, kể cả 8 chỗ khác biệt kể trên (nút pill, tab, giá vé, ghế zone3)
- **Kiểm tra nhanh:** mở DevTools ở vài phần tử đại diện, xác nhận không có rule nào bị "gạch ngang" bất thường do đổi thứ tự cascade

### Giai đoạn 2 — Gom hằng số & key localStorage (rủi ro thấp, chưa đổi kiến trúc) — ĐÃ XONG
- [x] Tạo `js/shared/storage-keys.js` (5 key) + `js/shared/constants.js` (8 hằng số/dữ liệu)
- [x] Trong `callcenter.js`/`ticketstaff.js`/`pickup-list.js`/`shuttle.js`: xoá khai báo cục bộ — bao gồm cả 5 chỗ khai báo lặp `HN_PICKUP_PAX_KEY` (kể cả 2 chỗ function-scoped bị bỏ sót ở lần đo trước) và 8 chỗ viết thẳng chuỗi `'hn_current_user'`
- [x] Nạp `shared/storage-keys.js` + `shared/constants.js` bằng `<script src=...>` thường (không `type="module"`) trước script chính mỗi trang — xem lại quyết định kiến trúc ở mục 1, không dùng `import`/`export`
- [x] Mâu thuẫn `hn_all_trips_meta_v1` mục 0.7(c) → đã hỏi và sửa thành `HN_TRIPS_KEY` theo xác nhận của bạn
- [x] `constants.js` tự tính biến `todayStr__constants` riêng (đổi tên tránh đụng `const todayStr` khai báo ở mỗi trang — do dùng script thường, các `<script>` cùng trang chia sẻ chung global scope nên trùng tên sẽ vỡ `SyntaxError`)
- [x] Đã mô phỏng thứ tự nạp script bằng Node `vm` để xác nhận không còn xung đột khai báo trùng tên ở cả 4 trang
- **Phát hiện thêm:** `confirmRebookAndSell()` được gọi ở `callcenter.html:1069` (nút "Bán vé" trong panel đặt lại vé) nhưng chỉ định nghĩa trong `ticketstaff.js`, không có trong `callcenter.js` — cùng nhóm lỗi với `updateRebookPreview`/`resetPhoiFilters` đã xử lý ở Giai đoạn 0. Nút mặc định `disabled` nên rủi ro thấp. Chưa xử lý, ghi vào mục 6.
- **Bàn giao:** test đồng bộ chéo — đặt vé ở callcenter, kiểm tra dữ liệu hiện đúng ở ticketstaff / pickup-list / shuttle

### Giai đoạn 3 — Tách các module shared JS thuần tuý — ĐÃ XONG (trừ calendar.js)
Chỉ chuyển những hàm **giống hệt 100%**, không sửa nội dung — dễ đối chiếu.

- [x] `shared/format.js` — 6 hàm: `abbrRouteName`, `formatHistoryDate`, `getPastDate`, `getStaffCode`, `normalizeSearchText`, `shortenStopName`
- [x] `shared/seat-bank.js` — 5 hàm: `buildSequentialSeatCodes`, `generateTripSeatPlanForVehicleType`, `getSeatCodesForVehicleType`, `loadSeatBank`, `saveSeatBank`
- [x] `shared/ui.js` — 9 hàm: `showToast`, `closeModal`, `closePanel`, `pickSearchResult`, `toggleSearchResults`, `toggleCalendar`, `getStationValue`, `setStationValue`, `setSelectOptionValue` (`toggleCalendar` xếp tạm vào đây thay vì tạo hẳn `calendar.js` chỉ cho 1 hàm — xem mục dưới)
- [x] `shared/booking.js` — 50 hàm còn lại trong 70 hàm giống hệt cc/ts (panel đặt vé, ghế phụ, menu ghế, chuyển ghế, lịch sử khách, đặt lại vé)
- [x] Tiện thể chuyển luôn `CUSTOMER_HISTORY_DATA` vào `shared/constants.js` (hoãn từ Giai đoạn 2 vì phụ thuộc `getPastDate()` — nay `getPastDate` đã có trong `format.js` nên chuyển được). **Thứ tự nạp bắt buộc: `storage-keys.js → format.js → constants.js → seat-bank.js → ui.js → booking.js → script chính`** vì `constants.js` gọi `getPastDate()` ngay khi chạy
- [x] `callcenter.js`/`ticketstaff.js` xoá bản copy — đối chiếu lại: mỗi hàm chỉ 1 khai báo/file trước khi xoá, quét lại sau khi xoá xác nhận 0 hàm còn sót (kể cả bản lồng trong hàm khác)
- [x] `pickup-list.html` phải thêm `shared/format.js` dù chưa dùng trực tiếp — vì đã nạp sẵn `shared/constants.js` (từ Giai đoạn 2) và giờ file đó phụ thuộc `format.js`
- [ ] `shared/calendar.js` — **chưa làm**, đúng như dự tính: 4 bản `renderCalendar`/`shiftMonth`/`pickDate`/`goToday`/`updateCalTrigger` chỉ giống 45–100% (không phải 100%), thuộc nhóm "khác nội dung", nằm ngoài quy tắc "chỉ chuyển hàm giống hệt" của giai đoạn này. Để dành cho Giai đoạn 6 khi làm cùng lúc với pickup-list/shuttle, lúc đó cần tham số hoá
- **Kiểm tra đã làm:** mô phỏng nạp script bằng Node `vm` cho cả 4 trang theo đúng thứ tự mới — chạy hết không lỗi
- **Bàn giao:** test cả 2 trang callcenter/ticketstaff (lần đầu dùng chung 1 nguồn — sửa 1 chỗ ảnh hưởng cả 2), và test lại pickup-list (thêm `format.js` mới)

### Giai đoạn 4 — Event delegation, bỏ inline handler — ĐÃ XONG
- [x] Tạo `shared/events.js`: dispatcher lắng nghe `click/change/input/blur/submit` ở `document` (capture phase), dùng `closest()` tìm phần tử `data-action`/`data-change-action`/`data-input-action`/`data-blur-action`/`data-submit-action` gần nhất, tra hàm **động qua `window[tên]`** thay vì object registry thủ công (vì toàn bộ hàm nghiệp vụ vốn đã là hàm global trong kiến trúc script-thường — tự nó đã là "registry", không cần bảng ánh xạ trùng lặp dễ lệch). Chỉ ~4 trường hợp gộp-2-lệnh/điều-hướng mới cần đăng ký thủ công trong `SYNTHETIC_ACTIONS`
- [x] Tham số truyền qua `data-args='["…"]'` (JSON) — 3 token đặc biệt được thay bằng giá trị thật lúc bấm (không lưu tĩnh): `"__this__"`, `"__event__"`, `"__this_value__"` (cho input đọc `el.value` trực tiếp)
- [x] Chuyển toàn bộ 232 điểm inline (109 tĩnh callcenter.html + 98 tĩnh ticketstaff.html + 43 sinh động trong callcenter.js/ticketstaff.js, gồm **1 chỗ phát hiện thêm** ngoài kiểm kê ban đầu — `selectAssignTargetSeat` trong ticketstaff.js bị bỏ sót vì nằm sau dấu backtick chứ không phải khoảng trắng, quét lại broad-pattern mới bắt được)
- [x] 5 chỗ `event.stopPropagation()` inline → cờ `data-stop-propagation="1"`, dispatcher gọi ở đầu, TRƯỚC khi chạy hàm chính. Xác nhận đúng ngữ nghĩa gốc bằng cách truy vết 1 trường hợp cụ thể (`showContextMenu`/nút "..." trong callcenter.js): có 1 listener `document.addEventListener("click", ()=>{đóng menu})` ở **bubble phase** đăng ký sẵn trong code — dispatcher mới chạy ở **capture phase** nên `stopPropagation()` gọi đúng lúc, ngăn listener đó chạy giống hệt hành vi gốc
- [x] 2 chỗ `${footBtnClick}` (biến JS giữ nguyên cả chuỗi lệnh onclick, tuỳ điều kiện rỗng/có khách) → 1 synthetic action `seatFootBtnClick` đọc `data-seat-code` + `data-edit-mode`, xoá hẳn biến `footBtnClick`
- [x] Bật cảnh báo `console.warn` khi `data-action` không có hàm — đã xác nhận **không phát sinh warning mới** so với lỗi đã biết (`confirmRebookAndSell` thiếu trên callcenter, từ Giai đoạn 2), tức chuyển đổi không làm hỏng thêm gì
- [x] **Kiểm tra đã làm** (không có trình duyệt để test trực tiếp):
  - Đối chiếu **231 chỗ inline kiểm kê ban đầu**, phát hiện thêm 1 → tổng 232, khớp chính xác số lượng `data-*action` sau khi chuyển
  - Đối chiếu **toàn bộ tên action** (61 ở callcenter, 57 ở ticketstaff) đều resolve được qua `window[tên]` hoặc `SYNTHETIC_ACTIONS` — chỉ 1 trường hợp thiếu, đúng bằng bug đã biết trước
  - Mô phỏng Node `vm`: nạp đúng thứ tự `shared/*.js → script chính → events.js`, gọi thử dispatcher với `data-action` giả — chạy không lỗi
  - Đối chiếu diff từng dòng với bản gốc (backup trước khi chuyển) cho toàn bộ điểm chuyển đổi phức tạp (nhiều tham số, `this`, `event`, số, chuỗi có dấu tiếng Việt)
- [x] **Phát hiện và sửa lỗi phát sinh ngoài dự tính:** ghi file bằng Python trên Windows (dùng ở Giai đoạn 1/3/4 khi cần biến đổi hàng loạt) mặc định dịch `\n` → `\r\n`, làm 12 file bị lẫn CRLF trong khi chuẩn thật của repo là LF thuần (xác nhận qua git blob HEAD, `core.autocrlf=false`). Đã chuẩn hoá lại toàn bộ 12 file này về LF — không đụng tới các file vốn đã CRLF từ trước khi tôi thao tác (`css/pickup-list.css`, `css/shuttle.css`, `html/shuttle.html`, `js/shuttle.js` — CRLF có sẵn, không phải do tôi gây ra)
- **Bàn giao:** test toàn bộ thao tác trên 2 trang callcenter/ticketstaff trên trình duyệt thật — đây là giai đoạn rủi ro cao nhất, mọi nút bấm/thay đổi input đều đã đổi cơ chế, cần xác nhận kỹ trước khi qua Giai đoạn 5

### Sự cố sau bàn giao Giai đoạn 4 — ĐÃ SỬA (08/08/2026)

Bạn báo lỗi trên trình duyệt thật: **nút đặt vé, chỉnh sửa vé, chọn ghế để chuyển ghế, chọn ghế để đặt vé nhóm đều hỏng**. Đúng như dự đoán ở nguyên tắc an toàn #3 (không có trình duyệt để tự test) — mô phỏng Node `vm` không bắt được các lỗi này vì chúng chỉ lộ ra khi gọi đúng hàm với đúng ngữ cảnh runtime cụ thể, chứ không phải lỗi cú pháp/tham chiếu. Đã tìm ra **3 nguyên nhân riêng biệt**, đều do cách viết dispatcher/script chuyển đổi ở Giai đoạn 4, không phải do bản thân việc bỏ inline handler:

1. **`ev.currentTarget` không còn đúng khi dùng event delegation.** `onSeatClick` (callcenter.js, ticketstaff.js) và `openSeatMenu` (shared/booking.js) dùng `ev.currentTarget` để lấy thẻ ghế đang bấm — đúng khi listener gắn trực tiếp lên từng thẻ (cách cũ), nhưng SAI khi listener gắn tập trung ở `document` (cách mới): `currentTarget` lúc này luôn là `document`, không phải thẻ ghế → gọi `.style` trên `document` vỡ ngay. **Sửa:** đổi thành `ev.target.closest('.seat-card')` — tự tìm đúng thẻ ghế bất kể click vào phần tử con nào bên trong, không phụ thuộc nơi gắn listener. Đây là lỗi trực tiếp gây hỏng "chọn ghế để chuyển ghế" và "chọn ghế để đặt vé nhóm".
2. **Lỗi tự viết trong `events.js`: nhầm tham số hàm với `this`.** `SYNTHETIC_ACTIONS.seatFootBtnClick` (nút "ĐẶT VÉ"/"KDV - CHÂU ĐỐC" ở chân mỗi ghế) khai báo tham số tên `el`, nhưng dispatcher gọi bằng `fn.apply(el, args)` — `.apply()` gán tham số 1 vào **`this`**, không phải vào tham số khai báo; vì phần tử này không có `data-args` nên `args=[]`, khiến tham số `el` luôn là `undefined` → `el.getAttribute(...)` vỡ ngay khi bấm. **Sửa:** đổi sang đọc qua `this` thay vì tham số. Đây là lỗi trực tiếp gây hỏng "nút đặt vé" và "chỉnh sửa vé".
3. **Phạm vi quét ở Giai đoạn 4 bỏ sót `js/shared/*.js`.** Script kiểm kê/chuyển đổi ban đầu chỉ quét 4 file gốc (`html/callcenter.html`, `html/ticketstaff.html`, `js/callcenter.js`, `js/ticketstaff.js`), nhưng Giai đoạn 3 đã tách một phần code sang `js/shared/booking.js` — nơi này còn sót **8 chỗ `onclick=` chưa chuyển** (trong `miniSeatHtml`, `openSeatMenu`, tìm khách qua SĐT, `renderRebookTripList`, `renderRouteOptions`, `subSeatAddTile`, `subSeatCard` ×2). Các nút này lặng lẽ vẫn dùng cơ chế cũ (vẫn chạy được vì `function` khai báo thường luôn nằm trên `window`) nhưng không nhất quán với phần còn lại — đã chuyển nốt sang `data-action`, thêm 2 synthetic action mới (`closeSeatMenuAndStartTransfer`, `searchResultRowClick`).

**Phát hiện phụ (không phải bug hành vi, chỉ là sai vị trí tổ chức code):** trong lúc rà lỗi #3, phát hiện script tách hàm ở Giai đoạn 3 có lỗi biên khi gặp **hàm viết 1 dòng** (VD: `function closeModal(id) { ... }` gói gọn trên 1 dòng) — thuật toán tìm điểm kết thúc hàm bằng cách tìm dòng chỉ chứa `"}"`, nên với hàm 1 dòng nó tìm lố sang tận hàm kế tiếp. Hậu quả: `openBookingPanel` (đúng ra thuộc nhóm "booking") bị gộp lẫn vào `ui.js` (ăn theo `closeModal`), và `startTransferMode` bị gộp lẫn vào `booking.js` (ăn theo `closeSeatMenu`). Đã xác minh qua git HEAD: cả 2 hàm này vốn **giống hệt nhau giữa callcenter/ticketstaff** nên không mất dữ liệu, chỉ là đặt sai file. Không sửa vị trí ngay (tránh thêm rủi ro ngoài phạm vi đang sửa) — để dành dọn ở Giai đoạn 5/7.

**Kiểm tra sau khi sửa:** dựng mô phỏng DOM đầy đủ hơn bằng Node `vm` (có `closest`/`matches`/`classList` thật, leo cây cha đúng cách) để gọi thử trực tiếp qua dispatcher — xác nhận cả 4 luồng (đặt vé, sửa vé, chuyển ghế, đặt vé nhóm) chạy đúng, đúng thẻ ghế được cập nhật `style.outline`, đúng `openBookingPanel`/`findSeat` được gọi với đúng tham số, trên cả 2 trang.

---

### Giai đoạn 5 — Tách module riêng từng trang — (1)+(2) ĐÃ XONG, (3) hoãn lại
Đã trao đổi và chốt: làm (1) rà hàm thừa + (2) tách hàm dài trước (rủi ro thấp); việc (3) tách hẳn
`callcenter.js`/`ticketstaff.js` thành nhiều file (`state.js`/`trip.js`/`main.js`...) tạm hoãn vì thuần tổ
chức lại code, không giảm trùng lặp, trong khi rủi ro thật (kiến trúc script-thường, nhiều biến trạng thái
chạy ngay khi nạp trang — tách sai thứ tự dễ vỡ mà khó phát hiện).

> ⏸️ **(3) hoãn tới sau khi xong Giai đoạn 6-7**, không phải huỷ bỏ. Lý do hoãn: nội dung 2 file cần ổn định
> hẳn trước khi đổi cấu trúc file, tránh vừa sửa code vừa tách file cùng lúc (dễ lẫn 2 loại thay đổi khi có
> lỗi). Cũng có thể **bỏ hẳn (3)** nếu tới lúc đó 2 file (hiện ~2350 dòng, đã giảm sau khi tách hàm dài ở
> mục trên) vẫn đủ dễ đọc — (3) không sửa bug, không giảm trùng lặp, chỉ dễ tìm code hơn, nên không bắt buộc.

- [x] Rà hàm khai báo trong `shared/*.js` mà không trang nào gọi tới → xoá: tìm 4 ứng viên, 2 là báo động
  giả (`cancelledSeatCard`, `subSeatCard` — dùng dạng callback `.map(tenHàm)` không ngoặc, quét ban đầu bỏ
  sót), xoá đúng 2 hàm chết thật (`abbrRouteName`, `renderHistoryTable`)
- [x] Tách 4 hàm dài đã đo — kèm phát hiện thêm khi tách `renderHistorySeatMap`: bản callcenter/ticketstaff
  thực ra **giống hệt nhau** (chỉ khác 1 dòng kiểm tra thừa vô hại, đã đối chiếu bằng diff), nên gộp thẳng
  về `shared/booking.js` luôn — vừa hết trùng lặp vừa hết dài:
  - `renderHistorySeatMap`: 228/229 dòng → gộp 2 trang thành 1 bản trong `shared/booking.js`, còn **109
    dòng** + 4 hàm phụ mới (`rebuildChDateRouteOptions`, `groupHistoryResultsByTrip`,
    `renderHistorySeatCardHtml`, `renderHistoryTripCardHtml`)
  - `printTicket` (ticketstaff.js): 153 → **36 dòng** + tách `buildTicketPrintHtml()` (khối HTML/CSS in vé tĩnh)
  - `generateBulkTrips` (callcenter.js): 112 → **52 dòng** + tách `computeBulkTripDates()`, `createBulkTrips()`
  - `saveSingleTrip` (callcenter.js): 96 → **47 dòng** + tách `updateExistingTrip()`, `createNewTrip()`
- **Kiểm tra đã làm:** dùng **jsdom** (dựng DOM thật, chạy đúng thẻ `<script>` theo thứ tự thật) thay cho
  mô phỏng `vm` thủ công trước đó — độ chính xác cao hơn hẳn vì `vm` không parse được `innerHTML`. Test qua
  dispatcher/gọi hàm trực tiếp trên cả 2 trang: mở lịch sử khách hàng, đổi bộ lọc, in vé (đối chiếu nội dung
  HTML xuất ra), tạo/sửa phơi đơn, tạo phơi hàng loạt (đối chiếu đúng số lượng + tên phơi sinh ra) — tất cả
  khớp kết quả mong đợi, không có hồi quy so với Giai đoạn 0-4
- **Bàn giao:** test độc lập từng trang trên trình duyệt thật trước khi quyết định có làm tiếp (3) hay không

### Giai đoạn 6 — Nhập pickup-list & shuttle vào shared — phần an toàn ĐÃ XONG, `shared/calendar.js` hoãn lại

> Đã trao đổi và chốt: làm phần rủi ro thấp trước (gộp hàm giống hệt, tách CSS trùng, chuyển inline handler),
> **hoãn `shared/calendar.js`** vì việc đó phải sửa lại cả `callcenter.js`/`ticketstaff.js` (2 file đã ổn định
> qua Giai đoạn 0-5) để dùng chung với pickup-list/shuttle — rủi ro cao nhất trong giai đoạn này.
>
> **Phát hiện quan trọng khi rà hàm:** không phải cứ trùng tên là gộp được. `generateTripSeatPlanForVehicleType`
> của `pickup-list.js` chỉ giống bản dùng chung ở cc/ts **56%** (pattern trạng thái ghế khác thứ tự) — **giữ
> nguyên bản riêng** của pickup-list.js (có ghi chú giải thích ngay tại chỗ khai báo), không gộp. Tương tự,
> `toggleCalendar`/`showToast`/`pickSearchResult` của `shuttle.js` dùng ID phần tử hoặc logic khác — **giữ
> nguyên, không nạp `shared/ui.js` cho shuttle.html** (chỉ 1 hàm `closeModal` giống hệt, không đáng để thêm 1
> dependency mới kèm theo mấy hàm không dùng tới).

- [x] `pickup-list.js`: xoá 4 hàm giống hệt/tương đương 100% (`buildSequentialSeatCodes`, `getSeatCodesForVehicleType`,
  `saveSeatBank`, `loadSeatBank`), dùng bản trong `shared/seat-bank.js`; dùng `shared/ui.js` cho `showToast`
  (thêm `let toastTimer;`), `toggleSearchResults`, `pickSearchResult`. `pickup-list.html` nạp thêm
  `shared/seat-bank.js` + `shared/ui.js` trước `pickup-list.js`
- [x] `shuttle.js`: đã dùng đúng `shared/storage-keys.js` từ trước (không cần sửa gì). Không nạp
  `shared/constants.js`/`format.js`/`ui.js` — xác nhận qua rà toàn bộ file: shuttle.js có mô hình dữ liệu mẫu
  riêng biệt hoàn toàn (miền trung chuyển, không phải miền đặt vé), không dùng bất kỳ hằng số/hàm nào trong
  các file đó
- [x] Tách CSS: 13 biến `:root` + `*`/`html,body`/`body`/`button`/`a`/`.mono`/`.app`/`.topbar`(riêng pickup-list.css,
  shuttle.css giữ bản `.topbar` riêng vì khác nội dung)/`.topbar-spacer`/`.user-menu`/`.user-menu.open .user-chip>svg`
  giống hệt `css/shared/variables.css`/`base.css` → xoá khỏi `pickup-list.css`/`shuttle.css`, thêm `<link>`
  `variables.css` + `base.css` vào 2 HTML (trước `shuttle.css`/`pickup-list.css` để cascade đúng thứ tự ghi đè).
  Các selector trùng nhau giữa `pickup-list.css`↔`shuttle.css` nhưng KHÔNG nằm trong phạm vi base.css
  (`.search-btn`, `.btn-secondary`, `.toast`...) — **để nguyên**, chưa gộp (out of scope đợt này, xem mục 6)
- [x] Chuyển 18 inline handler tĩnh + 5 động (template string) trong pickup-list.html/js sang `data-action`;
  34 inline handler tĩnh + 6 động trong shuttle.html/js sang `data-action`. Thêm `js/shared/events.js` vào cả
  2 trang. Thêm 2 synthetic action mới vào `events.js`: `navigateToTicketStaff` (nút "Quản lý vé" ở
  pickup-list), `submitCustomerForm` (form thêm khách ở shuttle — gốc gọi `event.preventDefault()` +
  `saveCustomer()` liền nhau, không gộp về 1 hàm được)
- [ ] `shared/calendar.js` — **hoãn**, cần xác nhận trước khi làm vì đụng vào callcenter.js/ticketstaff.js
- [ ] `login` để nguyên (159 dòng, không chung gì ngoài 13 biến `:root` — chỉ cần dùng `variables.css`) — chưa đụng tới
- **Kiểm tra đã làm:** jsdom nạp cả 2 trang theo đúng thứ tự script mới, mô phỏng bấm/gõ qua dispatcher cho
  toàn bộ luồng chính (đổi tab, mở/đóng lịch, lọc, chọn dòng/chọn tất cả, mở modal gán tài xế, đổi tài xế,
  cập nhật trạng thái, submit form khách — xác nhận `defaultPrevented=true` không bị reload trang, gán ghế
  rước liền, bán vé) — 0 cảnh báo "không tìm thấy hàm cho data-action", không lỗi runtime
- **Bàn giao:** test cả 2 trang trên trình duyệt thật trước khi quyết định có làm tiếp `shared/calendar.js` hay không

### Giai đoạn 7 — Dọn dẹp cuối (09/08/2026)

> ⚠️ Trước khi làm, đã **đo lại từ đầu** toàn bộ số liệu của mục này thay vì tin số cũ trong kế hoạch —
> giữa lúc viết kế hoạch (07/08) và lúc làm Giai đoạn 7 (09/08) đã có nhiều đợt sửa bug/thêm tính năng
> trực tiếp trên `callcenter`/`ticketstaff` nằm ngoài trình tự Giai đoạn 0-6, nên số liệu cũ lệch khá xa.

- [x] **Rà selector khai báo trùng trong cùng 1 file** — số cũ "16 ở callcenter.css + 16 ở ticketstaff.css"
  **sai vị trí**: sau khi tách CSS ở Giai đoạn 1, 2 file đó không còn selector nào trùng (đo lại = 0 cả
  hai). Trùng lặp thật nằm ở **`css/shared/booking-ui.css`**: **15 selector bị khai báo 2-3 lần** (16 lượt
  khai báo thừa), toàn bộ đều thuộc khu vực "Lịch sử khách hàng" (`.customer-history-view`, `.ch-trip-link`,
  `.ch-btn-rebook-row`(+`:hover`), `.ch-history-badge`×3, `.ch-seatmaps-list`, `.ch-trip-seatmap-card`(+`:hover`),
  `.ch-seat-pill`, `.ch-trip-header`, `.ch-trip-title-info`, `.ch-trip-ico`, `.ch-trip-name`, `.ch-date-tag`,
  `.ch-trip-subinfo`) — di sản của nhiều lần thiết kế lại tính năng này (1 bản HTML dạng `<table>` cũ hoàn
  toàn không còn dùng, 1 bản dạng thẻ lưới cũ, 1 bản hiện đang chạy thật) bị nối đuôi nhau trong file mà
  không xoá bản cũ. Đã đối chiếu **từng thuộc tính CSS** giữa các bản trùng (không xoá ẩu theo cụm) để giữ
  đúng 100% giao diện đang chạy: thuộc tính nào chỉ có ở bản cũ nhưng KHÔNG bị bản mới ghi đè (áp dụng
  cascade CSS thật) thì gộp vào bản đang chạy trước khi xoá bản cũ; thuộc tính nào bị bản mới ghi đè thì bỏ
  hẳn. Kèm xoá đúng phần CSS của bảng `<table>` lịch sử cũ (`.ch-history-table` và 10 selector con — xác
  nhận qua `grep` toàn bộ `js/`+`html/` không còn nơi nào sinh ra các class này) và 1 rule `.ch-active-seat`
  mồ côi hoàn toàn (class không được JS nào gán). **Không đụng** tới các selector dùng chung tên nhưng thật
  ra phục vụ tính năng khác đứng cạnh đó trong cùng khối comment (`.ch-trip-card`, `.ch-empty`, `.ch-trip-list`
  — của modal "Đặt lại vé", không phải lịch sử khách hàng). booking-ui.css: 580 → 549 selector, 4228 → 3999
  dòng, khớp dấu ngoặc `{`/`}` sau khi sửa
- [x] **Rà `!important`** — số cũ (59/61/18/1, đo trước Giai đoạn 1) đã lỗi thời vì phần lớn nằm trong khối
  3.351 dòng đã chuyển sang `booking-ui.css`. Đo lại đúng hiện trạng: callcenter.css 3, ticketstaff.css 5,
  booking-ui.css 53, shuttle.css 18, pickup-list.css 1. Xét từng rule theo đặc trưng CSS thật (specificity
  theo bộ 3 số (id, class, thẻ), thứ tự nạp file, có bị style inline của JS chặn hay không) thay vì xoá theo
  cảm tính:
  - **callcenter.css, ticketstaff.css, pickup-list.css: xoá sạch, còn 0** — toàn bộ chỉ là tàn dư từ trước
    khi thứ tự nạp `variables → base → booking-ui → <trang>.css` được xác lập ở Giai đoạn 1; nay `!important`
    thừa vì selector cùng độ đặc hiệu ở file trang riêng đã tự thắng do nạp sau, hoặc do selector có `#id`
    vốn đã thắng bất kể `!important`
  - **booking-ui.css: 53 → 5**, 5 cái còn lại xác nhận **thật sự cần thiết**, có ví dụ cụ thể:
    `.calendar-popover{border-radius/border-top}` cần thắng `.calendar` (khai báo sau, cùng độ đặc hiệu,
    2 class đứng chung 1 phần tử) — không có sẽ mất góc bo tròn/viền trên của khung lịch dạng popover;
    `#rebookModal.open{display:flex}` cần thắng `style="display:none"` viết thẳng trong HTML (inline style
    chỉ có `!important` mới thắng nổi); `.ch-seat-card-item .seat-footbtn:hover{color,background}` cần thắng
    `.seat-card:not(.empty):hover .seat-footbtn` (độ đặc hiệu (0,4,0) > (0,3,0), nếu bỏ `!important` nút
    "Đặt lại vé này" khi hover sẽ đổi lại thành viền/chữ đỏ thay vì nền đỏ/chữ trắng)
  - **shuttle.css: chưa rà** (18 cái) — kiến trúc CSS riêng, không dùng chung `booking-ui.css` nên lý do
    "cascade đã sạch" của mục này không áp dụng trực tiếp; để dành nếu có nhu cầu dọn riêng file đó sau
- [ ] **Xem lại hàm "trùng tên khác nội dung" cc↔ts** — đo lại: **32 hàm** (số cũ 33, gần đúng dù đã qua
  nhiều đợt sửa ngoài kế hoạch — hầu hết chỉ xê dịch nhẹ). Danh sách đầy đủ (kèm số dòng mỗi bản):
  `fillSearchInputWithPhone, makeSeat, groupSeat, loadAllTrips, switchTab, renderCancelledListTable,
  getAllBookedSeats, groupSeatsByTicket, renderPassengerList, renderTransshipTables, seatCard, renderSeats,
  updateTripStats, renderZone1TripList, saveSubSeat, setZone1Collapsed, toggleZone2Grid, onSeatClick,
  confirmTransfer, openCancelModal, checkCancelReason, clearSeatToEmpty, confirmCancel, refreshTicket,
  onPriceEdit, saveTicket, selectTrip, updateTripListForDirection, renderCalendar, pickDate,
  updateCalTrigger, confirmRebook`. Ứng viên gộp rõ nhất (gần giống nhau nhất, cần diff dòng-theo-dòng
  thật trước khi gộp, chưa làm): `refreshTicket`, `switchTab`, `renderSeats`, `pickDate`. **Chưa gộp hàm
  nào** — việc này đổi *hành vi thực thi* (không chỉ dọn CSS tĩnh như 2 mục trên), rủi ro cao hơn hẳn và
  đúng như nguyên tắc #1 đã ghi "làm sau cùng, không làm chung đợt" — cần bạn xác nhận trước khi bắt đầu,
  và làm riêng từng hàm một, test lại sau mỗi hàm thay vì gộp hàng loạt
- [x] **Xoá file JS/CSS gộp cũ** — rà toàn bộ thư mục dự án và `git status`: không có file `.bak`/backup/
  bản sao cũ nào còn sót lại (bản gốc trước tách được giữ trong lịch sử git, không phải file vật lý riêng),
  nên không có gì để xoá — mục này coi như đã thoả mãn
- [ ] **Việc (3) hoãn từ Giai đoạn 5**: cân nhắc tách `callcenter.js`/`ticketstaff.js` thành nhiều file nhỏ hơn (`state.js`/`trip.js`/`main.js`...). Chỉ làm nếu tới lúc này 2 file vẫn thấy khó đọc — không bắt buộc, không sửa bug/không giảm trùng lặp. Nếu làm: dùng jsdom test kỹ thứ tự nạp `<script>` trước khi báo xong (rủi ro chính: biến trạng thái `let` chạy ngay khi nạp trang, tách sai thứ tự dễ vỡ khởi tạo)
- **Kiểm tra đã làm:** đối chiếu số dấu ngoặc `{`/`}` khớp nhau sau mỗi lần sửa `booking-ui.css`; chạy lại
  toàn bộ bộ test jsdom hiện có (multi-phone, tag loại khách, chuyển ghế từ danh sách hủy, combobox Zone 1,
  tách lý do giá 0đ) — không lỗi runtime, không hồi quy (các test này không tự kiểm tra được CSS bằng mắt)
- **Bàn giao:** so sánh trực quan trên trình duyệt thật khu vực "Lịch sử khách hàng" (khung lịch popover,
  card lịch sử theo phơi, nút "Đặt lại vé này" khi hover) — đây là vùng bị sửa nhiều nhất trong giai đoạn
  này và mình không có trình duyệt để tự xác nhận. Quyết định tiếp: có muốn gộp 32 hàm khác-nội-dung ở mục
  trên không, và có cần rà nốt 18 `!important` trong `shuttle.css` không

---

## 4. Nguyên tắc an toàn xuyên suốt

1. **Không gộp 33 hàm "trùng tên khác nội dung"** khi tách module — đây là bẫy dễ gây lỗi nhất. Nếu có gộp thì để Giai đoạn 7, riêng biệt
2. **Mỗi giai đoạn dừng lại để bạn test thật** trước khi qua giai đoạn kế
3. Mình không có trình duyệt để chạy thử — mọi xác nhận "chạy đúng" phụ thuộc vào bạn test trên môi trường thật
4. Giữ file gốc cho đến khi toàn bộ giai đoạn hoàn tất và được xác nhận ổn định, để rollback nhanh
5. **Thứ tự nạp `<script>` phải đúng**: `shared/storage-keys.js` → `shared/constants.js` → script chính của trang. Sai thứ tự sẽ gây `ReferenceError` vì script chính dùng biến chưa được khai báo

---

## 5. Nguyên tắc sửa & viết code trong suốt quá trình

Áp dụng cho **mọi giai đoạn**, mỗi khi động vào 1 hàm/module là tiện thể dọn theo các nguyên tắc dưới — không làm riêng thành 1 đợt "refactor lớn" tách biệt, để tránh vừa đổi kiến trúc vừa đổi logic cùng lúc.

| # | Nguyên tắc | Áp dụng cụ thể vào codebase này |
|---|---|---|
| 1 | Loại bỏ code dư thừa | Xoá hàm/biến còn sót từ tính năng cũ (grep tên hàm xem còn được gọi ở đâu không trước khi xoá) — đã tìm được 3 hàm chết + 19 handler chết + 1 biến thừa |
| 2 | Loại bỏ Overengineering | Không tạo class/factory/abstraction cho chỗ chỉ cần 1 hàm thuần |
| 3 | Loại bỏ Boilerplate không cần thiết | Gộp các đoạn `if (!el) return;` lặp lại — chỉ khi helper thật sự làm code ngắn/rõ hơn |
| 4 | Loại bỏ Duplicate Code | Ưu tiên cao nhất: 3.351 dòng CSS + 70 hàm JS + toàn bộ hằng số/key ở mục 0.4 |
| 5 | Loại bỏ biến/hàm không dùng | Sau khi tách module, rà "dead code": hàm khai báo trong `shared/*.js` mà không trang nào gọi thì xoá |
| 6 | Gộp các hàm chức năng giống nhau | 33 hàm trùng tên khác nội dung: cặp nào chỉ khác 1 dòng điều kiện thì gộp thành 1 hàm nhận thêm tham số. **Giai đoạn 7** |
| 7 | Rút gọn if/else | Early return, gộp điều kiện — không rút tới mức khó đọc |
| 8 | Đơn giản hoá thuật toán, giữ nguyên kết quả | Vòng lặp lồng lọc/gom ghế → `filter`/`reduce`/`Map` nếu rõ hơn; kết quả phải test lại y hệt |
| 9 | Chia nhỏ hàm dài / gộp hàm quá nhỏ | `renderHistorySeatMap` (229), `printTicket` (153), `generateBulkTrips` (112), `loadBookingsFromStorage` (108), `renderTable` shuttle (97), `saveSingleTrip` (96) |
| 10 | Tối ưu khả năng đọc | Tên rõ nghĩa; comment chỗ logic nghiệp vụ đặc thù (vì sao cần `stopPropagation()`), không comment cái code đã tự nói |
| 11 | Tăng khả năng bảo trì | Mỗi file 1 domain rõ ràng, tránh phụ thuộc chéo lung tung giữa các `shared/*.js` |
| 12 | Giảm số dòng nếu không ảnh hưởng độ rõ ràng | Kết quả phụ, không phải mục tiêu — không ép rút gọn để "ăn thành tích số dòng" |
| 13 | Tuân thủ KISS / DRY / YAGNI | Nguyên tắc bao trùm |
| 14 | Không tạo abstraction khi chưa cần | `events.js` là abstraction **có lý do rõ ràng** (thay 330 inline handler) — nhưng không nhân rộng kiểu này cho chỗ chỉ dùng 1 lần |
| 15 | Không thêm tính năng ngoài yêu cầu | Toàn bộ quá trình là **refactor thuần tuý** — hành vi trước/sau phải giống hệt. Đây là lý do KHÔNG viết bổ sung `updateRebookPreview`/`resetPhoiFilters` dù thấy rõ chúng đang thiếu |

### Cách kiểm soát khi áp dụng

- Mỗi hàm sau khi refactor phải **đối chiếu input/output với bản gốc** — đặc biệt các hàm tính toán (giá vé, gom nhóm ghế, lọc chuyến)
- Gộp 33 hàm trùng tên khác nội dung (#6) là rủi ro nhất → làm **sau cùng**, Giai đoạn 7
- Nguyên tắc #15 áp dụng nghiêm ngặt nhất — phát hiện bug hoặc ý tưởng cải tiến thì ghi vào mục 6, không tự sửa

---

## 6. Danh sách đề xuất — GHI NHẬN, KHÔNG LÀM trong đợt này

| # | Vấn đề | Vị trí | Ghi chú |
|---|---|---|---|
| 1 | `updateRebookPreview()` không tồn tại | 18 chỗ ở callcenter.html + ticketstaff.html | Form "đặt lại vé" mất tính năng xem trước. Đợt này chỉ xoá handler chết. Nếu bạn muốn khôi phục → làm thành task riêng |
| 2 | `resetPhoiFilters()` không tồn tại | callcenter.html:751 | Nút "xoá lọc" tab phôi không hoạt động |
| 3 | `shuttle.js` đọc key `hn_all_trips_meta_v1` không ai ghi | shuttle.js:1393 | Tuyến/giờ khách đồng bộ rơi về giá trị mặc định. Nghi là gõ nhầm, phải là `hn_trips_meta_v9` — cần bạn xác nhận |
| 4 | `fillSearchInputWithPhone` bản đang chạy thiếu kiểm tra SĐT | ticketstaff.js:2189 | Bản chết ở dòng 59 có kiểm tra. Không tự ý ghép validation vào (nguyên tắc #15) |
| 5 | `hn_current_user` viết thẳng chuỗi, không có hằng số | 8 chỗ, 4 trang | Sẽ xử lý ở Giai đoạn 2 |
| 6 | `pickup-list.css`↔`shuttle.css` còn ~12 selector giống hệt nhau (`.user-chip`, `.user-dropdown`, `.search-btn`, `.btn-secondary`, `.toast`...) chưa gộp | 2 file, phát hiện ở Giai đoạn 6 | Không nằm trong phạm vi "topbar/user-menu" mà `base.css` đã định nghĩa; muốn gộp đúng phải đối chiếu thêm với `callcenter.css`/`ticketstaff.css` (vì `base.css` dùng chung cả 5 trang) — ngoài phạm vi 1 lượt sửa nhỏ, để dành Giai đoạn 7 |

---

## 7. Thứ tự bắt đầu

**Giai đoạn 0 → 1.**

Giai đoạn 0 (dọn dead code) phải làm trước vì nếu không, code chết sẽ theo vào module mới.

Giai đoạn 1 (tách CSS) làm ngay sau vì: thu hồi lớn nhất (3.351 dòng), rủi ro thấp nhất (không đụng logic), test được bằng mắt, và làm gọn nền trước khi bước vào phần JS phức tạp.

Từ Giai đoạn 2 trở đi mới đụng vào JS đang chạy — mỗi giai đoạn dừng chờ bạn xác nhận.
