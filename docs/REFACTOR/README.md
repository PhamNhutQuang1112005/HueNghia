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

## Quy trình mỗi phase

```
REFACTOR (phase nhỏ)  →  TEST theo 01-PHASE-A-CHECKLIST  →  FIX nếu lệch
                      →  VERIFY khớp cột "GỐC"           →  COMMIT  →  phase tiếp theo
```

Chưa tự động chạy hết các phase — mỗi phase báo cáo kết quả trước khi tiếp tục.
