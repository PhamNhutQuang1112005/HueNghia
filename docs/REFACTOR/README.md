# Tái cấu trúc source web local — Huệ Nghĩa Express

Thư mục này chứa tài liệu cho việc **hệ thống hoá lại source code web local hiện tại**
(HTML + CSS + JS thuần trong `html/`, `css/`, `js/`).

Mục tiêu: source sạch, có cấu trúc, dễ bảo trì/mở rộng — **giữ nguyên 100% giao diện,
hành vi và nghiệp vụ hiện tại**. Không xây backend/DB, không đổi framework, không deploy.

## Tài liệu

| File | Nội dung |
|---|---|
| `00-AUDIT.md` | Kết quả audit toàn bộ source (pages, JS, CSS, data, component, permission, vấn đề, cấu trúc đích, kế hoạch, rủi ro). |
| `01-PHASE-A-CHECKLIST.md` | Checklist test thủ công dùng làm **mốc so sánh** (regression baseline). Duyệt trước khi refactor để chốt "GỐC OK", duyệt lại sau MỖI phase. |

## Điểm lùi an toàn (Phase 0)

- Nhánh refactor: **`refactor/restructure`** (mọi thay đổi refactor nằm ở đây).
- Nhánh gốc sạch: **`main`** — không đụng tới trong quá trình refactor.
- Snapshot WIP ngay trước refactor: tag **`pre-refactor`**.

Khôi phục toàn bộ về trạng thái trước refactor:

```bash
git checkout pre-refactor      # xem lại đúng trạng thái gốc
# hoặc
git checkout main              # nhánh gốc chưa có WIP admin/shuttle-merge
```

## Lưu ý về thư mục `web/`

`web/` là một bản **migrate sang Next.js + Supabase đang dang dở**, KHÔNG phải web local
hiện tại và **NGOÀI phạm vi** đợt tái cấu trúc này. Không sửa, không trộn, không xoá —
để nguyên cho giai đoạn sau. Web local đang chạy = `html/` + `css/` + `js/`.

## Tiến độ

| Phase | Trạng thái | Ghi chú |
|---|---|---|
| 0 — Điểm lùi an toàn | ✅ | nhánh `refactor/restructure`, tag `pre-refactor` |
| A — Checklist baseline | ✅ (tài liệu) | `01-PHASE-A-CHECKLIST.md` — cần người duyệt điền cột GỐC |
| B — Tạo cây `src/`, di chuyển file | ✅ | `git mv` thuần (0 đổi nội dung JS/CSS) + sửa đường dẫn `<link>/<script>` trong 3 HTML |
| C — Tách dữ liệu mẫu → `src/data/` | ✅ | `CUSTOMER_HISTORY_DATA`, `DEFAULT_*_TRIPS`, các pool sinh ghế (`nameSamples`…) ra khỏi `constants.js` + `ticketstaff.js`. Chỉ `ticketstaff.html` nạp thêm 3 file `src/data/*`; hành vi giữ nguyên (biến global như cũ). |
| D — Tách `booking-ui.css` → `booking-ui/` | ✅ | Cắt 5139 dòng thành 11 lát liền mạch theo banner Zone. `cmp`+`sha256` xác nhận ghép lại giống hệt từng byte. `ticketstaff.html` nạp 11 `<link>` đúng thứ tự 01→11. Xem `src/shared/css/booking-ui/README.md`. |
| E trở đi | ⬜ | chưa bắt đầu |

### Cây thư mục sau Phase B

```
src/
├── pages/
│   ├── index.html · ticketstaff.html · admin.html   (3 trang — cùng cấp, điều hướng giữ nguyên)
│   ├── login/       login.css · login.js
│   ├── ticketstaff/ ticketstaff.css · ticketstaff.js · ticketstaff-manifest-core.js · ticketstaff-manifest-ui.js
│   └── admin/        admin.css · admin.js
├── shared/
│   ├── css/  variables.css · base.css · booking-ui/ (11 lát của booking-ui.css — Phase D)
│   └── js/   storage-keys.js · format.js · constants.js · seat-bank.js · fleet-store.js · ui.js · booking.js · events.js
├── assets/
│   └── img/  login-hero.png
└── data/   sample-seat-pool.js · sample-customer-history.js · sample-trip-templates.js  (dữ liệu MẪU — Phase C)
```

`src/shared/` là **kho tạm** — các phase sau sẽ tách/nâng dần thành `core/`, `services/`, `ui/`,
`data/`, `auth/`, `state/` như cấu trúc đích ở `00-AUDIT.md` mục I, khi từng file được dọn.
Thứ tự nạp `<script>` giữ **nguyên xi** so với trước.

## Quy trình mỗi phase

```
REFACTOR (phase nhỏ)  →  TEST theo 01-PHASE-A-CHECKLIST  →  FIX nếu lệch
                      →  VERIFY khớp cột "GỐC"           →  COMMIT  →  phase tiếp theo
```

Chưa tự động chạy hết các phase — mỗi phase báo cáo kết quả trước khi tiếp tục.
