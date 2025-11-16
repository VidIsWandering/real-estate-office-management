# 🚀 Đồ án SE100: Phần mềm Quản lý Văn phòng Bất động sản

Dự án này là hệ thống Quản lý Văn phòng Bất động sản, bao gồm Frontend (React), Backend (Node.js), và Database (PostgreSQL).

## 1. Yêu cầu Môi trường (Bắt buộc)

Trước khi bắt đầu, bạn cần cài đặt:

- **Git**
- **Docker Desktop** (Đảm bảo Docker Desktop đang ở trạng thái Running trước khi chạy lệnh)

## 2. Hướng dẫn Chạy Local (Phát triển)

Đây là quy trình chuẩn để chạy toàn bộ dự án trên máy cá nhân của bạn.

### Bước 1: Lấy "Chìa khóa" (Secrets)

Chúng ta cần các "chìa khóa" (biến môi trường) để chạy dự án.

**Tạo tài khoản Cloudinary**: Mỗi thành viên bắt buộc phải tự tạo một tài khoản Cloudinary miễn phí (dùng cho việc test upload file cá nhân).

Sau khi tạo, vào Dashboard và lấy 3 "chìa khóa":

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

**Lấy "Chìa khóa" JWT**: Tạm thời, hãy dùng một chuỗi bí mật ngẫu nhiên, ví dụ: `day-la-khoa-bi-mat-local-cua-toi-123`

### Bước 2: Thiết lập file .env

Bạn cần tạo 2 file `.env` (file này sẽ bị Git bỏ qua):

**Backend**:

1. Copy file `backend/.env.example` thành một file mới tên là `backend/.env`.
2. Mở file `backend/.env` và điền các "chìa khóa" bạn vừa lấy ở Bước 1 vào.

**Frontend**:

1. Copy file `frontend/.env.example` thành một file mới tên là `frontend/.env`.
2. (File này đã được cấu hình sẵn, không cần sửa).

### Bước 3: Khởi động Docker

Mở một terminal ở thư mục gốc của dự án và chạy lệnh:

```bash
docker compose up -d --build
```

- `--build`: Chỉ cần chạy lần đầu tiên (hoặc khi Dockerfile thay đổi).
- `-d`: Chạy ở chế độ nền (detached).

### Bước 4: Truy cập Môi trường Local

Sau khi các container khởi động (có thể mất 1-2 phút lần đầu), bạn có thể truy cập:

- **Frontend (React)**: http://localhost:3000
- **Backend (Node.js)**: http://localhost:8081
- **Database (Postgres)**: localhost:5433 (có thể kết nối bằng DataGrip/DBeaver nếu cần)

### Các lệnh Docker hữu ích

**Khởi động lại (Tắt và Mở)**:

```bash
docker compose up -d
```

**Xem Logs (Nhật ký) của Backend**:

```bash
docker compose logs -f backend
```

**Tắt toàn bộ (Stop & Xóa container)**:

```bash
docker compose down
```

## 3. Quy trình Làm việc (Workflow)

**TUYỆT ĐỐI KHÔNG** push thẳng lên `main` hoặc `develop`.

1. **Luôn bắt đầu từ develop**:

```bash
git checkout develop
git pull origin develop
```

2. **Tạo nhánh Feature mới**: Đặt tên theo quy ước: `feature/ten-tinh-nang` (ví dụ: `feature/be-login-api`)

```bash
git checkout -b feature/ten-tinh-nang
```

3. **Code & Commit**: Thực hiện code trên nhánh này.

4. **Tạo Pull Request (PR)**:

   - Đẩy (push) nhánh của bạn lên GitHub:

   ```bash
   git push -u origin feature/ten-tinh-nang
   ```

   - Lên GitHub, tạo Pull Request từ nhánh của bạn vào nhánh `develop`.

5. **Review & Merge**: Gắn thẻ (tag) Leader hoặc thành viên khác vào review. Sau khi được chấp thuận (approve), Leader sẽ merge PR.

## 4. Các Môi trường Cloud

### Staging (Kiểm thử):

- **Frontend**: https://real-estate-offic-git-8f9a7b-nguyen-quoc-baos-projects-076482f2.vercel.app/
- **Backend**: https://real-estate-office-management-stag.onrender.com/

**Mục đích**: Tự động deploy mỗi khi code được merge vào `develop`. Dùng để cả team kiểm thử tích hợp.

### Production (Demo):

- **Frontend**: https://real-estate-office-management-prod.vercel.app/
- **Backend**: https://real-estate-office-management-prod.onrender.com/

**Mục đích**: Chỉ Leader mới merge code vào `main`. Dùng để demo cho giảng viên.
