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

### Giai đoạn 3 — Tách các module shared JS thuần tuý
Chỉ chuyển những hàm **giống hệt 100%**, không sửa nội dung — dễ đối chiếu.

- [ ] `shared/format.js`, `shared/ui.js`, `shared/seat-bank.js` (phần 100% giống)
- [ ] `shared/booking.js` — phần lớn trong 70 hàm giống hệt cc/ts
- [ ] `shared/calendar.js` — **rủi ro cao hơn** vì 4 bản chỉ giống 45–100%, phải nhận tham số cấu hình. Cân nhắc: giai đoạn này chỉ gộp bản cc+ts (giống 84–100%), để pickup-list/shuttle nhập ở Giai đoạn 6
- [ ] `callcenter.js`/`ticketstaff.js` xoá bản copy trong file — dùng chung nhờ nạp `shared/*.js` bằng `<script>` thường trước script chính (không `import`, xem quyết định kiến trúc mục 1)
- **Bàn giao:** test cả 2 trang. Đây là lần đầu 2 trang dùng chung 1 nguồn — sửa 1 chỗ ảnh hưởng cả 2

### Giai đoạn 4 — Event delegation, bỏ inline handler
- [ ] Tạo `shared/events.js`: dispatcher đọc `data-action` + `data-*`, registry ánh xạ tên → hàm
- [ ] Chuyển 109 inline trong `callcenter.html` + 30 chỗ sinh động trong `callcenter.js`
- [ ] Chuyển 98 inline trong `ticketstaff.html` + 30 chỗ trong `ticketstaff.js`
- [ ] 7 chỗ `event.stopPropagation()` inline → xử lý trong dispatcher, ghi chú lý do từng chỗ
- [ ] Bật cảnh báo khi gặp `data-action` không có handler đăng ký — chính là cách bắt sớm loại lỗi `updateRebookPreview`
- **Bàn giao:** test toàn bộ thao tác trên 2 trang. Đây là giai đoạn rủi ro cao nhất — làm xong dừng chờ xác nhận
- Có thể chuyển dần từng phần (không bắt buộc chuyển hết 1 lần như bản ES Module đã bỏ) — vì dùng script thường, hàm `function` vẫn tự nằm trên `window`, inline handler cũ và `data-action` mới có thể tồn tại song song trong lúc chuyển

### Giai đoạn 5 — Tách module riêng từng trang
- [ ] `callcenter/`: 28 hàm riêng + bản callcenter của 33 hàm khác nội dung + state
- [ ] `ticketstaff/`: 27 hàm riêng + bản ticketstaff + state
- [ ] Tách các hàm dài đã đo: `renderHistorySeatMap` (229 dòng ở ticketstaff, 228 ở callcenter), `printTicket` (153), `generateBulkTrips` (112), `saveSingleTrip` (96)
- [ ] Rà hàm khai báo trong `shared/*.js` mà không trang nào gọi tới → xoá
- **Bàn giao:** test độc lập từng trang

### Giai đoạn 6 — Nhập pickup-list & shuttle vào shared
- [ ] `pickup-list.js`: dùng `shared/seat-bank.js`, `shared/calendar.js`, `shared/ui.js`, `shared/constants.js` (`VEHICLE_TYPE_SEATS` giống hệt)
- [ ] `shuttle.js`: dùng `shared/calendar.js`, `shared/ui.js`, `shared/storage-keys.js`; 34 hàm riêng giữ nguyên trong `shuttle/`
- [ ] Tách CSS: `pickup-list.html` đang nạp cả `shuttle.css` — làm rõ phần nào thật sự dùng chung, đưa vào `css/shared/`
- [ ] `login` để nguyên (159 dòng, không chung gì ngoài 13 biến `:root` — chỉ cần dùng `variables.css`)
- [ ] Chuyển 34 + 18 inline handler còn lại sang `data-action`

### Giai đoạn 7 — Dọn dẹp cuối
- [ ] Rà 16 selector khai báo trùng trong callcenter.css và 16 trong ticketstaff.css
- [ ] Rà 59 + 61 + 18 `!important` — cái nào còn cần sau khi cascade đã sạch
- [ ] Xem lại 33 hàm "trùng tên khác nội dung" cc↔ts: cặp nào chỉ khác 1–2 dòng thì gộp thành 1 hàm nhận tham số (nguyên tắc #6). **Làm sau cùng, không làm chung với lúc tách module**
- [ ] Xoá file JS/CSS gộp cũ

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

---

## 7. Thứ tự bắt đầu

**Giai đoạn 0 → 1.**

Giai đoạn 0 (dọn dead code) phải làm trước vì nếu không, code chết sẽ theo vào module mới.

Giai đoạn 1 (tách CSS) làm ngay sau vì: thu hồi lớn nhất (3.351 dòng), rủi ro thấp nhất (không đụng logic), test được bằng mắt, và làm gọn nền trước khi bước vào phần JS phức tạp.

Từ Giai đoạn 2 trở đi mới đụng vào JS đang chạy — mỗi giai đoạn dừng chờ bạn xác nhận.
