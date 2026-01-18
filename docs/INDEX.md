# TÀI LIỆU DỰ ÁN - PROJECT DOCUMENTATION

## Hệ Thống Quản Lý Văn Phòng Bất Động Sản

> **Đề tài**: Phần mềm quản lý văn phòng bất động sản  
> **Phương pháp**: Lập trình hướng đối tượng (OOP)  
> **Môn học**: SE100 - Phần mềm hướng đối tượng

---

## 📚 DANH MỤC TÀI LIỆU

### 1. **README.md** - Tài Liệu Chính

📄 [README.md](../README.md)

**Nội dung**:

- Giới thiệu tổng quan dự án
- Hướng dẫn cài đặt và chạy
- Công nghệ sử dụng (Backend/Frontend stack)
- Cấu trúc dự án chi tiết
- API Documentation links
- Hướng dẫn deploy lên Render.com
- Workflow & Git strategy
- Testing & Contributing guidelines

**Đối tượng**: Developer mới tham gia dự án, người dùng cuối

---

### 2. **context_design.md** - Thiết Kế Hệ Thống

📄 [docs/context_design.md](context_design.md)

**Nội dung**:

- Tổng quan hệ thống và phạm vi chức năng
- Kiến trúc hướng đối tượng (OOP Architecture)
- Cấu trúc dữ liệu (Data Structures)
  - Class Diagram với Mermaid
  - Chi tiết các Entity Classes
  - Enumerations
  - Relationships
- Business Logic & API Specifications
  - Các module API (Auth, Staff, Client, RealEstate, ...)
  - Business rules cho từng endpoint
- Use Cases & Workflows

**Đối tượng**: Team developers, architects, technical reviewers

---

### 3. **architecture-and-oop.md** - Kiến Trúc và OOP

📄 [docs/architecture-and-oop.md](architecture-and-oop.md)

**Nội dung**:

- **Kiến trúc tổng quan**
  - Layered Architecture (4-tier)
  - Request Flow chi tiết
- **Nguyên tắc OOP**
  - Encapsulation với ví dụ cụ thể
  - Abstraction trong Service/Repository
  - Separation of Concerns (SRP)
  - Dependency Injection
- **Design Patterns**
  - Repository Pattern
  - Service Layer Pattern
  - Middleware Pattern
- **Best Practices**
  - Error Handling
  - Input Validation
  - Logging
  - Testing (Unit & Integration)
- **Code Examples** - Complete feature implementation

**Đối tượng**: Developers học về OOP, architects, code reviewers

---

### 4. **build-and-deploy.md** - Hướng Dẫn Build & Deploy

📄 [docs/build-and-deploy.md](build-and-deploy.md)

**Nội dung**:

- Docker setup và build
- Deployment lên Render.com
- Environment variables configuration
- CI/CD pipeline (nếu có)

**Đối tượng**: DevOps, deployment team

---

## 🎯 SƠ ĐỒ TÀI LIỆU

```
📁 real-estate-office-management/
│
├── 📄 README.md                          ← Điểm khởi đầu
│   ├── Giới thiệu & Features
│   ├── Cài đặt Quick Start
│   ├── Tech Stack
│   └── Link đến các docs khác
│
├── 📁 docs/
│   │
│   ├── 📄 INDEX.md                       ← File này
│   │   └── Tổng quan tất cả tài liệu
│   │
│   ├── 📄 context_design.md              ← Thiết kế chi tiết
│   │   ├── Class Diagram
│   │   ├── Data Structures
│   │   ├── Business Logic
│   │   └── API Specifications
│   │
│   ├── 📄 architecture-and-oop.md        ← OOP Deep Dive
│   │   ├── Layered Architecture
│   │   ├── OOP Principles với examples
│   │   ├── Design Patterns
│   │   └── Best Practices + Code Examples
│   │
│   └── 📄 build-and-deploy.md            ← Deployment
│       ├── Docker
│       ├── Render.com
│       └── Environment Setup
│
└── 📁 backend/
    └── 📁 src/
        └── 📁 docs/                      ← Swagger Docs
            ├── auth.docs.js
            ├── staff.docs.js
            └── ... (API endpoint docs)
```

---

## 🎓 HƯỚNG DẪN ĐỌC TÀI LIỆU

### Cho Developer Mới

**Bước 1**: Đọc [README.md](../README.md)

- Hiểu tổng quan dự án
- Cài đặt môi trường local
- Chạy được backend + frontend

**Bước 2**: Xem [Swagger UI](http://localhost:8081/api-docs)

- Khám phá các API endpoints
- Test API trực tiếp từ Swagger

**Bước 3**: Đọc [context_design.md](context_design.md)

- Hiểu cấu trúc dữ liệu
- Nắm business logic
- Biết các entity relationships

**Bước 4**: Đọc [architecture-and-oop.md](architecture-and-oop.md)

- Học cách áp dụng OOP
- Hiểu code structure
- Áp dụng best practices

---

### Cho Technical Reviewer / Giảng Viên

**1. Tổng quan nhanh**: [README.md](../README.md)

- Features và tech stack
- Kiến trúc tổng thể

**2. Thiết kế hệ thống**: [context_design.md](context_design.md)

- Class Diagram
- Business rules
- API specifications

**3. Đánh giá OOP**: [architecture-and-oop.md](architecture-and-oop.md)

- Nguyên tắc OOP được áp dụng
- Design patterns
- Code quality

**4. Demo trực tiếp**:

- [Swagger UI](http://localhost:8081/api-docs) - Test APIs
- [Frontend](http://localhost:3000) - Xem giao diện

---

## 📊 KIẾN TRÚC HỆ THỐNG (Tóm Tắt)

### Tech Stack

```
Frontend:  Next.js 15 + TypeScript + TailwindCSS
           ↕ REST API
Backend:   Node.js + Express.js
           ↕ SQL
Database:  PostgreSQL 15
```

### Layers

```
┌─────────────────────────────────────┐
│   Controllers (HTTP Handlers)       │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Services (Business Logic)         │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Repositories (Data Access)        │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Models (Domain Entities)          │
└─────────────────────────────────────┘
```

### Core Entities

- **Account** - Tài khoản đăng nhập
- **Staff** - Nhân viên (Manager, Agent, Legal Officer, Accountant)
- **Client** - Khách hàng (Buyer, Seller, Landlord, Tenant)
- **RealEstate** - Bất động sản
- **Appointment** - Lịch hẹn xem nhà
- **Transaction** - Giao dịch mua/bán/thuê
- **Contract** - Hợp đồng
- **Voucher** - Phiếu thu/chi

---

## 🔑 ĐIỂM NỔI BẬT CỦA DỰ ÁN

### 1. Áp Dụng OOP Đầy Đủ

✅ **Encapsulation**: Data và methods được đóng gói trong classes  
✅ **Abstraction**: Service/Repository trừu tượng hóa complexity  
✅ **SRP**: Mỗi class một trách nhiệm duy nhất  
✅ **Dependency Injection**: Loose coupling, dễ test

### 2. Design Patterns

✅ **Repository Pattern**: Trừu tượng hóa data access  
✅ **Service Layer Pattern**: Business logic separation  
✅ **Middleware Pattern**: Cross-cutting concerns  
✅ **Factory Pattern**: Object creation

### 3. Code Quality

✅ **ESLint** + **Prettier**: Code formatting  
✅ **Joi Validation**: Input validation  
✅ **Winston Logger**: Comprehensive logging  
✅ **Jest Testing**: Unit + Integration tests  
✅ **Swagger Docs**: API documentation

### 4. Modern Stack

✅ **TypeScript** (Frontend): Type safety  
✅ **Next.js 15**: Latest React framework  
✅ **PostgreSQL 15**: Robust database  
✅ **Docker**: Containerization  
✅ **Render.com**: Cloud deployment

---

## 📞 LIÊN HỆ & HỖ TRỢ

### Khi Gặp Vấn Đề

1. **Kiểm tra tài liệu** trong thư mục `docs/`
2. **Xem Swagger UI**: http://localhost:8081/api-docs
3. **Check logs**: `docker-compose logs -f backend`
4. **Debug commands**: Xem phần Support trong README.md

### Common Issues

| Vấn đề                    | Giải pháp                            |
| ------------------------- | ------------------------------------ |
| Database connection error | Kiểm tra Docker đang chạy            |
| JWT errors                | Kiểm tra `.env` có JWT secrets       |
| File upload errors        | Kiểm tra Cloudinary credentials      |
| Port conflicts            | Đổi ports trong `docker-compose.yml` |

---

## 🎯 KẾT LUẬN

Dự án này là một ví dụ điển hình về việc áp dụng **lập trình hướng đối tượng** trong phát triển phần mềm thực tế.

**Các nguyên tắc OOP** được implement xuyên suốt:

- Models đóng gói data và behavior
- Services trừu tượng hóa business logic
- Repositories tách biệt data access
- Clear separation of concerns
- Dependency injection cho loose coupling

**Design patterns** được sử dụng hợp lý để tăng maintainability và scalability.

**Tài liệu đầy đủ** giúp team members dễ dàng onboard và contribute.

---

**📚 Bắt đầu từ đây**: [README.md](../README.md)

**🏗️ Thiết kế chi tiết**: [context_design.md](context_design.md)

**💡 OOP Deep Dive**: [architecture-and-oop.md](architecture-and-oop.md)

---

**✨ Happy Learning & Coding!**
