# Kế hoạch migrate sang Next.js + Supabase

Checklist theo dõi tiến độ chuyển từ code cũ (`html/`, `css/`, `js/`) sang `web/`. Đi theo đúng thứ tự
phụ thuộc thật của code cũ (dựa theo thứ tự `<script>` nạp trong các trang HTML): từ phần không phụ
thuộc gì → lõi nghiệp vụ → trang đơn giản nhất (kiểm chứng cả pipeline) → trang phức tạp dần.

Đánh dấu `[x]` khi hoàn thành từng mục. Không cần làm tuần tự tuyệt đối trong 1 giai đoạn, nhưng nên
xong giai đoạn trước mới sang giai đoạn sau vì các giai đoạn sau phụ thuộc vào giai đoạn trước.

## Giai đoạn 0 — Hạ tầng

- [ ] `npx create-next-app@latest` trong `web/` (TypeScript, App Router)
- [ ] Tạo project Supabase, lấy URL + anon key + service role key
- [ ] Điền `.env.example` → đổi tên `.env.local`
- [ ] Viết `supabase/schema.sql` (bảng `trips`, `seats`, `passengers`, `users`, `shuttle_driver_assignments`)
- [ ] Chạy migration đầu tiên, kiểm tra kết nối DB từ Next.js
- [ ] Cấu hình Supabase Auth (hoặc NextAuth) cơ bản

## Giai đoạn 1 — Logic thuần (không phụ thuộc file nào khác)

- [ ] `js/shared/storage-keys.js` → phản ánh vào `supabase/schema.sql` (mỗi key = 1 bảng/field)
- [ ] `js/shared/format.js` → `src/lib/format.ts`
- [ ] `js/shared/constants.js` → `src/lib/constants.ts`

## Giai đoạn 2 — Lõi nghiệp vụ (trái tim hệ thống, mọi trang đều dùng)

- [ ] `js/shared/seat-bank.js` → `src/lib/seat-bank.ts` + `src/hooks/useSeatBank.ts`
- [ ] `js/shared/booking.js` → `src/lib/booking.ts` + `src/components/booking/`
- [ ] `js/shared/events.js` → `src/lib/events.ts`

## Giai đoạn 3 — UI dùng chung

- [ ] `js/shared/ui.js` → `src/components/ui/` (Button, Modal, các phần tử lặp lại)
- [ ] `css/shared/variables.css` → `src/styles/variables.css`
- [ ] `css/shared/base.css` → `src/styles/base.css`
- [ ] `css/shared/booking-ui.css` → tách vào `src/styles/booking-ui/*.css` theo đúng comment Zone sẵn có

## Giai đoạn 4 — Trang Đăng nhập

Trang đơn giản nhất, không đụng booking/seat-bank — dùng để xác nhận Next.js + Supabase Auth chạy
thông suốt trước khi làm các trang lớn.

- [ ] `html/index.html` + `js/login.js` + `css/login.css` → `src/app/(auth)/login/page.tsx`
- [ ] Test đăng nhập/đăng xuất end-to-end

## Giai đoạn 5 — Trang Shuttle (trung chuyển)

Nhỏ nhất trong 3 trang nghiệp vụ (1566 dòng, không load booking.js/seat-bank.js/ui.js ở bản cũ) —
làm "vertical slice" đầu tiên để kiểm chứng toàn luồng UI + API + DB hoạt động tốt.

- [ ] `js/shuttle.js` → `src/app/(dashboard)/shuttle/page.tsx` + `src/components/shuttle/`
- [ ] `src/app/api/shuttle-drivers/route.ts` (thay `HN_SHUTTLE_DRIVER_KEY`)
- [ ] `css/shuttle.css` → CSS module riêng cho trang shuttle
- [ ] Đối chiếu chức năng với bản cũ

## Giai đoạn 6 — Trang Callcenter

2943 dòng, dùng lại `booking.ts` + `seat-bank.ts` + `components/ui/` đã xong ở giai đoạn 2-3.

- [ ] `js/callcenter.js` → `src/app/(dashboard)/callcenter/page.tsx`
- [ ] `src/app/api/trips/route.ts`, `src/app/api/passengers/route.ts`
- [ ] `css/callcenter.css` → CSS module riêng cho trang callcenter
- [ ] Đối chiếu chức năng với bản cũ

## Giai đoạn 7 — Trang Ticketstaff

Phức tạp và dài nhất (~4726 dòng gộp 3 file) — để cuối vì tận dụng toàn bộ pattern/component đã
ổn định từ callcenter.

- [ ] `js/ticketstaff.js` → `src/app/(dashboard)/ticketstaff/page.tsx`
- [ ] `js/ticketstaff-manifest-core.js` → `src/lib/` (logic manifest chuyến)
- [ ] `js/ticketstaff-manifest-ui.js` → `src/components/` (UI manifest chuyến)
- [ ] `src/app/api/seats/route.ts`
- [ ] `css/ticketstaff.css` → CSS module riêng cho trang ticketstaff
- [ ] Đối chiếu chức năng với bản cũ

## Giai đoạn 8 — Kiểm thử & Deploy

- [ ] Chạy song song bản cũ và bản mới, đối chiếu từng nghiệp vụ (đặt vé, xếp ghế, trung chuyển...)
- [ ] Import dữ liệu thật (nếu có) từ localStorage/bản cũ sang Supabase
- [ ] Push GitHub → deploy Next.js lên Vercel
- [ ] Trỏ domain, tắt bản cũ
