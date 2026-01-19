# TỔNG QUAN DỰ ÁN - QUICK REFERENCE

## Hệ Thống Quản Lý Văn Phòng Bất Động Sản

> **📚 SE100 - Phần Mềm Hướng Đối Tượng**  
> **🎯 Đề tài**: Phần mềm quản lý văn phòng bất động sản  
> **🔧 Phương pháp**: Lập trình hướng đối tượng (OOP)

---

## 🎯 MỤC TIÊU

Xây dựng hệ thống quản lý toàn diện cho văn phòng bất động sản, số hóa quy trình từ **đăng tin** → **quản lý khách hàng** → **đặt lịch hẹn** → **đàm phán** → **ký hợp đồng** → **thanh toán** → **báo cáo**.

---

## 🏗️ KIẾN TRÚC & CÔNG NGHỆ

### Tech Stack

```
┌──────────────────────────────────────┐
│  Frontend: Next.js 15 + TypeScript   │
│  UI: TailwindCSS + Shadcn/ui         │
└──────────────────────────────────────┘
              ↕ REST API
┌──────────────────────────────────────┐
│  Backend: Node.js + Express.js       │
│  OOP: Layered Architecture           │
└──────────────────────────────────────┘
              ↕ SQL
┌──────────────────────────────────────┐
│  Database: PostgreSQL 15             │
└──────────────────────────────────────┘
```

### Layered Architecture (4-Tier)

```
Controllers  → Xử lý HTTP request/response
     ↓
Services     → Business logic & orchestration
     ↓
Repositories → Database CRUD operations
     ↓
Models       → Domain entities (OOP classes)
```

---

## 🎨 ÁP DỤNG OOP

### 1. Encapsulation (Đóng gói)

✅ **Ví dụ**: Class `Contract` đóng gói data và methods

```javascript
class Contract {
  constructor(data) {
    this.total_value = data.total_value;
    this.remaining_amount = data.remaining_amount;
  }

  isFullyPaid() {
    return this.remaining_amount === 0;
  }

  recordPayment(amount) {
    this.remaining_amount -= amount;
  }
}
```

### 2. Abstraction (Trừu tượng hóa)

✅ **Ví dụ**: Service che giấu complexity

```javascript
class RealEstateService {
  async create(data, user) {
    // Ẩn đi các bước phức tạp:
    // - Validate owner
    // - Check permission
    // - Process files
    // - Create in database
    return await this.realEstateRepo.create(data);
  }
}
```

### 3. Separation of Concerns (SRP)

✅ **Mỗi layer một trách nhiệm**:

- **Controller**: Chỉ xử lý HTTP
- **Service**: Chỉ business logic
- **Repository**: Chỉ database operations
- **Model**: Chỉ định nghĩa entities

### 4. Dependency Injection

✅ **Loose coupling**:

```javascript
class RealEstateService {
  constructor(realEstateRepo, clientRepo, fileService) {
    // Dependencies được inject từ bên ngoài
    this.realEstateRepo = realEstateRepo;
    this.clientRepo = clientRepo;
    this.fileService = fileService;
  }
}
```

---

## 📊 DỮ LIỆU & ENTITIES

### Core Entities (8 chính)

| Entity          | Mô tả         | Key Properties                      |
| --------------- | ------------- | ----------------------------------- |
| **Account**     | Tài khoản     | username, password, isActive        |
| **Staff**       | Nhân viên     | position, assignedArea, status      |
| **Client**      | Khách hàng    | type, requirement, staff_id         |
| **RealEstate**  | Bất động sản  | title, price, location, status      |
| **Appointment** | Lịch hẹn      | startTime, endTime, status          |
| **Transaction** | Giao dịch     | offerPrice, terms, status           |
| **Contract**    | Hợp đồng      | totalValue, remainingAmount, status |
| **Voucher**     | Phiếu thu/chi | type, amount, paymentMethod         |

### Relationships

```
Account 1──1 Staff
Staff 1──* Client
Client 1──* RealEstate
RealEstate 1──* Appointment
RealEstate 1──* Transaction
Transaction 1──1 Contract
Contract 1──* Voucher
```

---

## 👥 VAI TRÒ & CHỨC NĂNG

| Vai trò           | Chức năng chính                                         |
| ----------------- | ------------------------------------------------------- |
| **Manager**       | Quản lý nhân viên, xem tất cả dữ liệu, báo cáo tổng hợp |
| **Agent**         | Quản lý khách hàng, BĐS, lịch hẹn, tạo giao dịch        |
| **Legal Officer** | Kiểm tra pháp lý BĐS, soạn thảo hợp đồng                |
| **Accountant**    | Ghi phiếu thu/chi, quản lý công nợ, báo cáo tài chính   |

---

## 🔄 WORKFLOW CHÍNH

### Quy Trình Giao Dịch BĐS (End-to-End)

```
1. Agent đăng tin BĐS
   └─ Status: pending_legal_check

2. Legal Officer kiểm tra pháp lý
   └─ Status: listed

3. Agent đặt lịch hẹn với Client
   └─ Appointment created

4. Hoàn tất lịch hẹn
   └─ Appointment status: completed

5. Agent tạo giao dịch (Transaction)
   └─ Transaction status: negotiating
   └─ RealEstate status: negotiating

6. Đàm phán và cập nhật offer

7. Hoàn tất đàm phán
   └─ Transaction status: pending_contract

8. Legal Officer tạo hợp đồng (Contract)
   └─ Contract status: draft → signed → notarized

9. Accountant ghi phiếu thu
   └─ Voucher created
   └─ Contract remaining_amount giảm

10. Hoàn tất
    └─ Contract status: finalized
    └─ RealEstate status: transacted
```

---

## 🛠️ DESIGN PATTERNS

### 1. Repository Pattern

```javascript
class RealEstateRepository {
  async create(data) {
    /* SQL INSERT */
  }
  async findById(id) {
    /* SQL SELECT */
  }
  async update(id, data) {
    /* SQL UPDATE */
  }
}
```

### 2. Service Layer Pattern

```javascript
class RealEstateService {
  async create(data, user) {
    // Orchestrate multiple repositories
    // Apply business rules
  }
}
```

### 3. Middleware Pattern

```javascript
app.use(authenticateToken); // Verify JWT
app.use(requireRole("manager")); // Check permission
app.use(validate(schema)); // Validate input
```

---

## 📈 BUSINESS RULES

| Rule    | Mô tả                                            |
| ------- | ------------------------------------------------ |
| **QĐ1** | Chỉ Manager tạo/sửa nhân viên                    |
| **QĐ2** | Agent chỉ quản lý client/BĐS được phân công      |
| **QĐ3** | BĐS phải qua kiểm tra pháp lý mới được list      |
| **QĐ4** | Không tạo appointment trùng thời gian            |
| **QĐ5** | Chỉ tạo transaction khi có appointment completed |
| **QĐ6** | Chỉ Legal Officer tạo/quản lý hợp đồng           |
| **QĐ7** | Chỉ Accountant tạo phiếu thu/chi                 |

---

## 🎯 ĐIỂM NỔI BẬT

### ✅ OOP Implementation

- **4 nguyên tắc OOP** được áp dụng xuyên suốt
- **Layered Architecture** rõ ràng
- **Design Patterns**: Repository, Service Layer, Middleware
- **SOLID Principles**: SRP, Dependency Injection

### ✅ Code Quality

- **ESLint + Prettier**: Code formatting
- **Joi Validation**: Input validation
- **Winston Logger**: Comprehensive logging
- **Jest**: Unit + Integration tests
- **Swagger**: Auto-generated API docs

### ✅ Modern Stack

- **TypeScript** (Frontend): Type safety
- **Next.js 15**: Latest React framework
- **PostgreSQL 15**: Robust RDBMS
- **Docker**: Containerization
- **Render.com**: Cloud deployment

---

## 📚 TÀI LIỆU

| File                        | Nội dung                                                |
| --------------------------- | ------------------------------------------------------- |
| **README.md**               | Hướng dẫn cài đặt, tech stack, deployment               |
| **context_design.md**       | Class diagram, entities, API specs, use cases           |
| **architecture-and-oop.md** | OOP principles, patterns, best practices, code examples |
| **INDEX.md**                | Tổng quan tất cả tài liệu                               |

---

## 🚀 DEMO

### Local Development

```bash
# Start all services
make dev

# Access services
- Backend API: http://localhost:8081
- Swagger Docs: http://localhost:8081/api-docs
- Frontend: http://localhost:3000
- Database: localhost:5433
```

### Production

- **Backend**: https://real-estate-office-management-prod.onrender.com
- **Frontend**: https://real-estate-office-management-prod.vercel.app

---

## 📊 THỐNG KÊ DỰ ÁN

### Backend

- **Models**: 13 classes (Account, Staff, Client, RealEstate, ...)
- **Services**: 12 services (Business logic)
- **Repositories**: 13 repositories (Data access)
- **Controllers**: 11 controllers (HTTP handlers)
- **Routes**: 10 route modules
- **Middlewares**: 4 (Auth, Validation, Error, Upload)
- **API Endpoints**: ~60 endpoints
- **Database Tables**: 15 tables
- **Migrations**: 8 SQL migration files

### Frontend

- **Pages**: ~20 pages (Dashboard, Staff, Client, RealEstate, ...)
- **Components**: ~50 reusable components
- **Hooks**: Custom hooks (useAuth, useApi, ...)
- **State Management**: Zustand

### Testing

- **Unit Tests**: Models, Services, Utils
- **Integration Tests**: API endpoints
- **Target Coverage**: >= 80%

---

## 🎓 KẾT LUẬN

Dự án này thể hiện:

✅ **Áp dụng OOP đầy đủ** với 4 nguyên tắc cơ bản  
✅ **Design Patterns** phù hợp cho từng layer  
✅ **Code Quality** cao với linting, validation, testing  
✅ **Modern Tech Stack** (Next.js, TypeScript, PostgreSQL)  
✅ **Documentation** đầy đủ và chi tiết  
✅ **Production Ready** với Docker và cloud deployment

---

## 📞 LIÊN HỆ

**Team SE100**

- **Đề tài**: Hệ thống quản lý văn phòng bất động sản
- **Phương pháp**: Lập trình hướng đối tượng (OOP)

---

**🎉 End of Quick Reference**

📖 **Chi tiết hơn**: Xem [README.md](../README.md) và [docs/](.)
