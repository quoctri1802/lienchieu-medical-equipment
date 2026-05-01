# Hướng dẫn Triển khai Hệ thống Online (GitHub + Vercel + Render)

Hệ thống của bạn bao gồm 2 phần: **Frontend** (React/Vite) và **Backend** (Node.js/Express). Dưới đây là các bước để đưa chúng lên chạy online hoàn toàn miễn phí.

## Bước 1: Đưa Code lên GitHub (Thủ công)

Vì máy tính của bạn hiện chưa cài đặt Git, hãy làm theo cách này:

1. Truy cập [GitHub](https://github.com/) và tạo một Repository mới (ví dụ: `lienchieu-medical-equipment`).
2. Nhấn nút **"Add file"** -> **"Upload files"**.
3. Mở thư mục dự án trên máy tính, chọn tất cả các tệp (TRỪ thư mục `node_modules`) và kéo thả vào trình duyệt.
4. Nhấn **"Commit changes"**.

---

## Bước 2: Triển khai Backend lên Render (Miễn phí)

Backend cần được chạy trước để cung cấp API cho Frontend.

1. Truy cập [Render.com](https://render.com/) và đăng nhập bằng GitHub.
2. Nhấn **New +** -> **Web Service**.
3. Kết nối với Repository GitHub bạn vừa tạo.
4. Cấu hình như sau:
   - **Name**: `lienchieu-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
5. Nhấn **Advanced** -> **Add Environment Variable**:
   - `DATABASE_URL`: (Dán đường dẫn kết nối Neon PostgreSQL của bạn vào đây)
6. Nhấn **Create Web Service**. 
7. Sau khi chạy xong, Render sẽ cấp cho bạn một URL (ví dụ: `https://lienchieu-api.onrender.com`). **Hãy copy URL này.**

---

## Bước 3: Triển khai Frontend lên Vercel (Miễn phí)

1. Truy cập [Vercel.com](https://vercel.com/) và đăng nhập bằng GitHub.
2. Nhấn **Add New** -> **Project**.
3. Import Repository GitHub của bạn.
4. Cấu hình **Environment Variables**:
   - Thêm biến `VITE_API_URL`
   - Value: `https://lienchieu-api.onrender.com/api` (Dán URL từ Render ở Bước 2 vào, nhớ thêm `/api` ở cuối).
5. Nhấn **Deploy**.

---

## Kết quả
Sau khi Vercel chạy xong, bạn sẽ có một địa chỉ website chính thức (ví dụ: `https://lienchieu-equipment.vercel.app`) để truy cập từ bất cứ đâu, kể cả điện thoại!

**Lưu ý**: Vì sử dụng gói miễn phí của Render, sau một thời gian không dùng, server sẽ "ngủ". Khi bạn truy cập lại lần đầu, có thể mất khoảng 30-60 giây để hệ thống khởi động lại.
