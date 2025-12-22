# 🚀 Đồ án SE100: Phần mềm Quản lý Văn phòng Bất động sản

Dự án này là hệ thống Quản lý Văn phòng Bất động sản, bao gồm Frontend (Next.js), Backend (Node.js/Express), và Database (PostgreSQL).

## 📋 Mục lục

- [Yêu cầu Môi trường](#1-yêu-cầu-môi-trường-bắt-buộc)
- [Hướng dẫn Chạy Local](#2-hướng-dẫn-chạy-local-phát-triển)
- [API Documentation](#-api-documentation)
- [Quy trình Làm việc](#3-quy-trình-làm-việc-workflow)
- [Các Môi trường Cloud](#4-các-môi-trường-cloud)

## 1. Yêu cầu Môi trường (Bắt buộc)

Trước khi bắt đầu, bạn cần cài đặt:

- **Git**
- **Docker Desktop** (Đảm bảo Docker Desktop đang ở trạng thái Running trước khi chạy lệnh)
- **Make** (optional - để dùng các lệnh tắt)

## 2. Hướng dẫn Chạy Local (Phát triển)

### 🚀 Quick Start (sử dụng Make)

```bash
# 1. Setup lần đầu
make setup

# 2. Chỉnh sửa backend/.env với JWT_SECRET và các config cần thiết

# 3. Chạy development
make dev

# 4. Truy cập
# - API: http://localhost:8081
# - Swagger Docs: http://localhost:8081/api-docs
```

### 📝 Hướng dẫn Chi tiết

#### Bước 1: Lấy "Chìa khóa" (Secrets)

Chúng ta cần các "chìa khóa" (biến môi trường) để chạy dự án.

**Tạo tài khoản Cloudinary**: Mỗi thành viên bắt buộc phải tự tạo một tài khoản Cloudinary miễn phí (dùng cho việc test upload file cá nhân).

Sau khi tạo, vào Dashboard và lấy 3 "chìa khóa":

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

**Lấy "Chìa khóa" JWT**: Tạo 2 chuỗi bí mật ngẫu nhiên:

```bash
# Chạy 2 lần để lấy 2 key khác nhau
openssl rand -base64 32
```

#### Bước 2: Thiết lập file .env

```bash
# Copy file mẫu
cp backend/.env.example backend/.env

# Mở và chỉnh sửa
nano backend/.env  # hoặc dùng editor khác
```

Các biến **BẮT BUỘC** phải điền:

- `JWT_SECRET` - chuỗi bí mật cho access token
- `JWT_REFRESH_SECRET` - chuỗi bí mật cho refresh token

#### Bước 3: Khởi động Docker

```bash
# Sử dụng Makefile (recommended)
make dev

# Hoặc sử dụng docker-compose trực tiếp
docker-compose up db backend
```

#### Bước 4: Truy cập Môi trường Local

| Service      | URL                                 | Mô tả          |
| ------------ | ----------------------------------- | -------------- |
| Backend API  | http://localhost:8081               | REST API       |
| **API Docs** | http://localhost:8081/api-docs      | **Swagger UI** |
| OpenAPI JSON | http://localhost:8081/api-docs.json | OpenAPI spec   |
| Health Check | http://localhost:8081/health        | Server status  |
| Database     | localhost:5433                      | PostgreSQL     |

### 🛠️ Các lệnh hữu ích

```bash
# Xem tất cả lệnh có sẵn
make help

# Development
make dev          # Chạy backend + db (hot-reload)
make up           # Chạy ở background
make down         # Tắt services
make logs         # Xem logs backend

# Database
make db-reset     # Reset database (xóa hết data)
make db-shell     # Mở PostgreSQL shell

# Quality
make test         # Chạy tests
make lint         # Kiểm tra code style
make format       # Format code
```

## 📚 API Documentation

Sau khi chạy backend, truy cập **Swagger UI** tại:

👉 **http://localhost:8081/api-docs**

### Các Module API

| Module       | Prefix                 | Mô tả                            |
| ------------ | ---------------------- | -------------------------------- |
| Auth         | `/api/v1/auth`         | Đăng nhập, đăng ký, đổi mật khẩu |
| Staff        | `/api/v1/staff`        | Quản lý nhân viên                |
| Clients      | `/api/v1/clients`      | Quản lý khách hàng               |
| Real Estates | `/api/v1/real-estates` | Quản lý BĐS                      |
| Appointments | `/api/v1/appointments` | Lịch hẹn xem nhà                 |
| Transactions | `/api/v1/transactions` | Giao dịch & đàm phán             |
| Contracts    | `/api/v1/contracts`    | Quản lý hợp đồng                 |
| Vouchers     | `/api/v1/vouchers`     | Chứng từ thu chi                 |
| Reports      | `/api/v1/reports`      | Báo cáo & thống kê               |
| System       | `/api/v1/system`       | Cấu hình hệ thống                |

### Roles & Permissions

> **Architecture**: Layered Architecture với Service-Repository Pattern

| Position        | Mô tả                                        |
| --------------- | -------------------------------------------- |
| `manager`       | Quản lý nhân viên, xem báo cáo, audit logs   |
| `agent`         | Quản lý BĐS, khách hàng, lịch hẹn, giao dịch |
| `legal_officer` | Kiểm tra pháp lý BĐS, xử lý hợp đồng         |
| `accountant`    | Quản lý chứng từ thu chi, payments           |

### Test Accounts (Development)

| Username    | Password    | Position      |
| ----------- | ----------- | ------------- |
| manager1    | password123 | manager       |
| agent1      | password123 | agent         |
| legal1      | password123 | legal_officer |
| accountant1 | password123 | accountant    |

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
