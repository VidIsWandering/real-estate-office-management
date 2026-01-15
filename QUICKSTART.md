# Quick Start Guide - Real Estate Office Management

## 🚀 Khởi động nhanh

### Lần đầu setup

```bash
# 1. Clone repo (nếu chưa có)
git clone <repository-url>
cd real-estate-office-management

# 2. Setup môi trường
make setup
# Hoặc thủ công:
cp backend/.env.example backend/.env
# Sau đó edit backend/.env với JWT secrets

# 3. Khởi động services
make up
```

### Hàng ngày

```bash
# Khởi động
make up           # Chạy background
# hoặc
make dev          # Chạy với logs

# Dừng
make down

# Restart nhanh
make restart

# Rebuild sau khi thay đổi dependencies
make rebuild
```

## 📍 URLs

Sau khi chạy `make up`:

| Service         | URL                            | Mô tả                         |
| --------------- | ------------------------------ | ----------------------------- |
| **Frontend**    | http://localhost:3000          | Giao diện người dùng          |
| **Backend API** | http://localhost:8081          | REST API                      |
| **API Docs**    | http://localhost:8081/api-docs | Swagger documentation         |
| **Database**    | localhost:5433                 | PostgreSQL (user: devuser)    |
| **Adminer**     | http://localhost:8082          | Database GUI (`make adminer`) |

## 📝 Các lệnh thường dùng

```bash
# Development
make dev          # Khởi động tất cả với logs
make up           # Khởi động background
make down         # Dừng tất cả
make restart      # Restart nhanh
make rebuild      # Rebuild + restart

# Logs
make logs                # Xem tất cả logs
make logs-backend        # Chỉ backend
make logs-frontend       # Chỉ frontend
make logs-db             # Chỉ database

# Database
make db-reset            # Reset database (xóa data)
make db-shell            # Mở PostgreSQL shell
make adminer             # Mở database GUI

# Testing & Code Quality
make test                # Chạy tests
make lint                # Kiểm tra code
make format              # Format code

# Cleanup
make clean               # Xóa hết (containers + volumes)
```

## 🔧 Cấu hình môi trường

File `.env` trong thư mục root (tạo tự động bằng `make setup`):

```env
# Database
DB_USER=devuser
DB_PASSWORD=devpassword
DB_NAME=se100_dev_db
DB_EXTERNAL_PORT=5433

# Service Ports
BACKEND_PORT=8081
FRONTEND_PORT=3000
ADMINER_PORT=8082

# Environment
NODE_ENV=development
```

File `backend/.env`:

```env
# Server
PORT=8080
NODE_ENV=development

# Database - được override bởi docker-compose
DB_HOST=db
DB_PORT=5432
DB_USER=devuser
DB_PASSWORD=devpassword
DB_NAME=se100_dev_db

# JWT (QUAN TRỌNG: Phải thay đổi trong production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## 🐛 Troubleshooting

### Port đã được sử dụng

Đổi port trong `.env`:

```env
FRONTEND_PORT=3001
BACKEND_PORT=8082
```

### Database không khởi tạo

```bash
make db-reset
```

### Hot-reload không hoạt động

```bash
make rebuild
```

### Containers không start

```bash
make clean
make up
```

### Xem logs để debug

```bash
make logs              # Tất cả
make logs-backend      # Backend
make logs-frontend     # Frontend
make logs-db           # Database
```

## ✨ Hot-Reload

Cả frontend và backend đều hỗ trợ hot-reload:

- **Frontend**: Thay đổi trong `frontend/src/` tự động reload
- **Backend**: Thay đổi trong `backend/src/` tự động reload

Không cần rebuild containers khi thay đổi code!

## 📦 Cài đặt dependencies mới

```bash
# Backend
cd backend
npm install <package-name>
cd ..
make rebuild

# Frontend
cd frontend
npm install <package-name>
cd ..
make rebuild
```

## 🗄️ Database Tools

### Adminer (Web GUI)

```bash
make adminer
# Mở: http://localhost:8082
# System: PostgreSQL
# Server: db
# Username: devuser
# Password: devpassword
# Database: se100_dev_db
```

### PostgreSQL Shell

```bash
make db-shell
# Sau đó có thể chạy SQL commands:
# \dt              # List tables
# \d table_name    # Describe table
# SELECT * FROM account;
```

## 📚 Tài liệu

- [Docker Setup chi tiết](docs/docker-setup.md)
- [API Documentation](http://localhost:8081/api-docs) (sau khi start services)
- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)

## 🎯 Workflow phát triển

1. **Start services**: `make up`
2. **Xem logs**: `make logs` (trong terminal khác)
3. **Code** trong `backend/src/` hoặc `frontend/src/`
4. **Changes tự động reload**
5. **Test** tại http://localhost:3000
6. **Commit & push**
7. **Stop**: `make down`

## 💡 Tips

- Dùng `make help` để xem tất cả commands
- Dùng `make dev` để xem logs realtime
- Dùng `make adminer` để quản lý database qua GUI
- Containers tự động restart nếu crash (除非 manually stopped)
- Database data được persist trong Docker volume
