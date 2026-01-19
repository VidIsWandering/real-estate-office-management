# KIẾN TRÚC VÀ LẬP TRÌNH HƯỚNG ĐỐI TƯỢNG

## Architecture & Object-Oriented Programming Guide

> **Tài liệu này**: Hướng dẫn chi tiết về kiến trúc hệ thống và cách áp dụng nguyên tắc OOP trong dự án.

---

## MỤC LỤC

- [1. GIỚI THIỆU](#1-giới-thiệu)
- [2. KIẾN TRÚC TỔNG QUAN](#2-kiến-trúc-tổng-quan)
- [3. NGUYÊN TẮC OOP](#3-nguyên-tắc-oop)
- [4. DESIGN PATTERNS](#4-design-patterns)
- [5. BEST PRACTICES](#5-best-practices)
- [6. CODE EXAMPLES](#6-code-examples)

---

## 1. GIỚI THIỆU

### 1.1 Phương Pháp Phát Triển

Dự án này áp dụng **Lập trình hướng đối tượng (OOP)** kết hợp với các **Design Patterns** hiện đại để xây dựng một hệ thống quản lý bất động sản linh hoạt, dễ bảo trì và mở rộng.

### 1.2 Lợi Ích Của OOP

#### **Maintainability (Dễ bảo trì)**

- Code được tổ chức theo modules rõ ràng
- Dễ dàng tìm và sửa lỗi
- Thay đổi ở một nơi không ảnh hưởng toàn hệ thống

#### **Reusability (Tái sử dụng)**

- Code được viết một lần, sử dụng nhiều nơi
- Các class có thể extend hoặc compose
- Giảm duplicate code

#### **Scalability (Khả năng mở rộng)**

- Dễ dàng thêm tính năng mới
- Không cần refactor toàn bộ hệ thống
- Hỗ trợ team lớn làm việc parallel

#### **Testability (Dễ test)**

- Unit test từng class/method độc lập
- Mock dependencies dễ dàng
- Integration test theo layers

---

## 2. KIẾN TRÚC TỔNG QUAN

### 2.1 Layered Architecture

Hệ thống sử dụng **4-tier architecture** với các tầng rõ ràng:

```
┌─────────────────────────────────────────────────────┐
│                                                      │
│               PRESENTATION LAYER                     │
│                   (Frontend)                         │
│                                                      │
│   Next.js App Router                                 │
│   ├── Pages/Routes                                   │
│   ├── React Components                               │
│   ├── State Management (Zustand)                     │
│   ├── API Client                                     │
│   └── UI Components (Shadcn)                         │
│                                                      │
└─────────────────────────────────────────────────────┘
                        ↕ HTTP/REST
┌─────────────────────────────────────────────────────┐
│                                                      │
│               APPLICATION LAYER                      │
│                   (Backend API)                      │
│                                                      │
│   Express.js Application                             │
│   ├── Routes (Định nghĩa endpoints)                 │
│   ├── Controllers (HTTP handlers)                    │
│   ├── Middlewares (Auth, Validation, Error)         │
│   └── Validators (Joi schemas)                       │
│                                                      │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                                                      │
│                BUSINESS LAYER                        │
│                   (Services)                         │
│                                                      │
│   Business Logic & Orchestration                     │
│   ├── Services (Business rules)                      │
│   ├── Domain Logic                                   │
│   ├── Transaction Management                         │
│   └── External API Integration                       │
│                                                      │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                                                      │
│                DATA ACCESS LAYER                     │
│               (Repositories & Models)                │
│                                                      │
│   Data Operations                                    │
│   ├── Repositories (CRUD)                            │
│   ├── Models (Domain entities)                       │
│   ├── Query Builders                                 │
│   └── Database Migrations                            │
│                                                      │
└─────────────────────────────────────────────────────┘
                        ↕ SQL
┌─────────────────────────────────────────────────────┐
│                                                      │
│                  DATABASE LAYER                      │
│                   (PostgreSQL)                       │
│                                                      │
│   Persistent Storage                                 │
│   ├── Tables & Indexes                               │
│   ├── Constraints & Triggers                         │
│   └── Views & Stored Procedures                      │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### 2.2 Request Flow

Ví dụ: Agent tạo giao dịch mới

```
┌────────┐
│ Agent  │
└───┬────┘
    │ POST /api/v1/transactions
    ↓
┌───────────────┐
│   ROUTE       │ app.use('/api/v1/transactions', transactionRoutes)
└───┬───────────┘
    │
    ↓
┌───────────────┐
│  MIDDLEWARE   │ authMiddleware → validateMiddleware
└───┬───────────┘
    │ • Verify JWT token
    │ • Extract user info
    │ • Validate request body
    ↓
┌───────────────┐
│  CONTROLLER   │ transactionController.create(req, res, next)
└───┬───────────┘
    │ • Parse request
    │ • Call service
    │ • Format response
    ↓
┌───────────────┐
│   SERVICE     │ transactionService.create(data, user)
└───┬───────────┘
    │ • Check business rules:
    │   - Appointment must be completed
    │   - User has permission
    │ • Orchestrate repositories:
    │   - appointmentRepo.findCompleted()
    │   - transactionRepo.create()
    │   - realEstateRepo.updateStatus()
    ↓
┌───────────────┐
│  REPOSITORY   │ transactionRepository.create(data)
└───┬───────────┘
    │ • Build SQL query
    │ • Execute query
    │ • Map result to Model
    ↓
┌───────────────┐
│    MODEL      │ new Transaction(result.rows[0])
└───┬───────────┘
    │ • Validate data
    │ • Return instance
    ↓
┌───────────────┐
│  RESPONSE     │ 201 Created { transaction: {...} }
└───────────────┘
```

---

## 3. NGUYÊN TẮC OOP

### 3.1 Encapsulation (Đóng gói)

**Định nghĩa**: Gom data và methods liên quan vào một đơn vị (class), ẩn đi chi tiết implementation.

#### Ví dụ: Model Class

```javascript
// backend/src/models/contract.model.js
class Contract {
  constructor(data) {
    // Private-like properties (convention: không expose trực tiếp)
    this.id = data.id;
    this.transaction_id = data.transaction_id;
    this.total_value = data.total_value;
    this.deposit_amount = data.deposit_amount;
    this.remaining_amount = data.remaining_amount;
    this.status = data.status || "draft";
  }

  // Public method: Business logic encapsulated
  isFullyPaid() {
    return this.remaining_amount === 0;
  }

  getRemainingDebt() {
    return this.remaining_amount;
  }

  // Public method: Update payment
  recordPayment(amount) {
    if (amount <= 0) {
      throw new Error("Payment amount must be positive");
    }
    if (amount > this.remaining_amount) {
      throw new Error("Payment exceeds remaining debt");
    }
    this.remaining_amount -= amount;
  }

  // Public interface: Serialize to JSON
  toJSON() {
    return {
      id: this.id,
      transaction_id: this.transaction_id,
      total_value: this.total_value,
      deposit_amount: this.deposit_amount,
      remaining_amount: this.remaining_amount,
      status: this.status,
      is_fully_paid: this.isFullyPaid(),
    };
  }
}

module.exports = Contract;
```

**Lợi ích**:

- Chi tiết implementation ẩn bên trong class
- External code chỉ dùng public methods
- Dễ thay đổi internal logic mà không ảnh hưởng client code

---

### 3.2 Abstraction (Trừu tượng hóa)

**Định nghĩa**: Ẩn đi complexity, chỉ expose những gì cần thiết.

#### Ví dụ: Service Abstraction

```javascript
// backend/src/services/real-estate.service.js
class RealEstateService {
  constructor(realEstateRepo, clientRepo, staffRepo, fileService) {
    this.realEstateRepo = realEstateRepo;
    this.clientRepo = clientRepo;
    this.staffRepo = staffRepo;
    this.fileService = fileService;
  }

  // High-level method: Client không cần biết chi tiết
  async create(data, user) {
    // Step 1: Validate owner exists
    const owner = await this.clientRepo.findById(data.owner_id);
    if (!owner) {
      throw new Error("Owner does not exist");
    }

    // Step 2: Check permission
    await this._checkPermission(owner, user);

    // Step 3: Process files
    const mediaFiles = await this.fileService.createManyFiles(data.media_files);
    const legalDocs = await this.fileService.createManyFiles(data.legal_docs);

    // Step 4: Create real estate
    const realEstate = await this.realEstateRepo.create({
      ...data,
      media_files: mediaFiles.map((f) => f.id),
      legal_docs: legalDocs.map((f) => f.id),
    });

    return { realEstate: realEstate.toJSON() };
  }

  // Private helper method (abstracted away from client)
  async _checkPermission(owner, user) {
    const { STAFF_ROLES } = require("../config/constants");
    if (
      owner.staff_id !== user.staff_id &&
      user.position !== STAFF_ROLES.MANAGER
    ) {
      throw new Error("You do not have permission to manage this customer");
    }
  }
}

module.exports = RealEstateService;
```

**Lợi ích**:

- Controller chỉ cần gọi `service.create()`, không quan tâm chi tiết
- Complexity được ẩn đi
- Dễ test và maintain

---

### 3.3 Separation of Concerns (SRP)

**Định nghĩa**: Mỗi class chỉ có một trách nhiệm duy nhất.

#### Ví dụ: Clear Separation

```javascript
// ❌ BAD: Controller làm quá nhiều việc
class RealEstateController {
  async create(req, res) {
    // Validate input (không nên ở đây)
    if (!req.body.title)
      return res.status(400).json({ error: "Title required" });

    // Business logic (không nên ở đây)
    const owner = await db.query("SELECT * FROM client WHERE id = $1", [
      req.body.owner_id,
    ]);
    if (!owner) return res.status(404).json({ error: "Owner not found" });

    // Database operation (không nên ở đây)
    const result = await db.query("INSERT INTO real_estate ...");

    // File upload (không nên ở đây)
    const files = await cloudinary.upload(req.files);

    res.json(result);
  }
}
```

```javascript
// ✅ GOOD: Clear separation of concerns

// 1. VALIDATOR: Chỉ validate input
// backend/src/validators/real-estate.validator.js
const realEstateCreateSchema = Joi.object({
  title: Joi.string().required(),
  owner_id: Joi.string().required(),
  price: Joi.number().positive().required(),
  // ...
});

// 2. CONTROLLER: Chỉ xử lý HTTP
// backend/src/controllers/real-estate.controller.js
class RealEstateController {
  async create(req, res, next) {
    try {
      const result = await realEstateService.create(req.body, req.user);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
}

// 3. SERVICE: Business logic
// backend/src/services/real-estate.service.js
class RealEstateService {
  async create(data, user) {
    const owner = await this.clientRepo.findById(data.owner_id);
    // ... business rules
    return await this.realEstateRepo.create(data);
  }
}

// 4. REPOSITORY: Database operations
// backend/src/repositories/real-estate.repository.js
class RealEstateRepository {
  async create(data) {
    const result = await db.query("INSERT INTO real_estate ...", values);
    return new RealEstate(result.rows[0]);
  }
}

// 5. FILE SERVICE: File handling
// backend/src/services/file.service.js
class FileService {
  async createManyFiles(files) {
    // Upload to Cloudinary
    // Save to database
  }
}
```

---

### 3.4 Dependency Injection

**Định nghĩa**: Inject dependencies từ bên ngoài thay vì tạo bên trong class.

```javascript
// ❌ BAD: Hard-coded dependencies
class RealEstateService {
  constructor() {
    // Tạo dependencies bên trong → tight coupling
    this.realEstateRepo = new RealEstateRepository();
    this.clientRepo = new ClientRepository();
  }
}

// ✅ GOOD: Injected dependencies
class RealEstateService {
  constructor(realEstateRepo, clientRepo, fileService) {
    // Nhận dependencies từ bên ngoài → loose coupling
    this.realEstateRepo = realEstateRepo;
    this.clientRepo = clientRepo;
    this.fileService = fileService;
  }
}

// Usage
const realEstateRepo = new RealEstateRepository(db);
const clientRepo = new ClientRepository(db);
const fileService = new FileService(cloudinary);

const realEstateService = new RealEstateService(
  realEstateRepo,
  clientRepo,
  fileService
);
```

**Lợi ích**:

- Dễ test (có thể inject mock dependencies)
- Loose coupling
- Dễ thay thế implementation

---

## 4. DESIGN PATTERNS

### 4.1 Repository Pattern

**Mục đích**: Trừu tượng hóa data access, tách biệt business logic khỏi database.

```javascript
// backend/src/repositories/client.repository.js
class ClientRepository {
  constructor(db) {
    this.db = db;
  }

  // CRUD methods
  async findById(id) {
    const result = await this.db.query("SELECT * FROM client WHERE id = $1", [
      id,
    ]);
    return result.rows[0] ? new Client(result.rows[0]) : null;
  }

  async findAll(filters) {
    let query = "SELECT * FROM client WHERE 1=1";
    const params = [];

    if (filters.staff_id) {
      params.push(filters.staff_id);
      query += ` AND staff_id = $${params.length}`;
    }

    if (filters.type) {
      params.push(filters.type);
      query += ` AND type = $${params.length}`;
    }

    const result = await this.db.query(query, params);
    return result.rows.map((row) => new Client(row));
  }

  async create(data) {
    const result = await this.db.query(
      `INSERT INTO client (full_name, email, phone_number, type, staff_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [data.full_name, data.email, data.phone_number, data.type, data.staff_id]
    );
    return new Client(result.rows[0]);
  }

  async update(id, data) {
    const result = await this.db.query(
      `UPDATE client SET full_name = $1, email = $2 WHERE id = $3 RETURNING *`,
      [data.full_name, data.email, id]
    );
    return new Client(result.rows[0]);
  }

  async delete(id) {
    await this.db.query("DELETE FROM client WHERE id = $1", [id]);
  }
}

module.exports = ClientRepository;
```

---

### 4.2 Service Layer Pattern

**Mục đích**: Encapsulate business logic, orchestrate operations.

```javascript
// backend/src/services/transaction.service.js
class TransactionService {
  constructor(transactionRepo, appointmentRepo, realEstateRepo) {
    this.transactionRepo = transactionRepo;
    this.appointmentRepo = appointmentRepo;
    this.realEstateRepo = realEstateRepo;
  }

  async create(data, user) {
    // Business Rule 1: Appointment phải completed
    const completedAppointment =
      await this.appointmentRepo.findCompletedByRealEstateAndClient(
        data.real_estate_id,
        data.client_id
      );

    if (!completedAppointment) {
      throw new Error(
        "Client must have a completed appointment before creating transaction"
      );
    }

    // Business Rule 2: Check permission
    if (
      user.position !== "manager" &&
      user.staff_id !== completedAppointment.staff_id
    ) {
      throw new Error("Permission denied");
    }

    // Business Rule 3: Real estate phải ở trạng thái 'listed'
    const realEstate = await this.realEstateRepo.findById(data.real_estate_id);
    if (realEstate.status !== "listed") {
      throw new Error("Real estate is not available for transaction");
    }

    // Create transaction
    const transaction = await this.transactionRepo.create({
      ...data,
      staff_id: user.staff_id,
      status: "negotiating",
    });

    // Update real estate status
    await this.realEstateRepo.updateStatus(data.real_estate_id, "negotiating");

    return { transaction: transaction.toJSON() };
  }

  async finalize(transactionId, user) {
    const transaction = await this.transactionRepo.findById(transactionId);

    // Business rules
    if (transaction.status !== "negotiating") {
      throw new Error("Transaction is not in negotiating status");
    }

    // Update transaction
    await this.transactionRepo.updateStatus(transactionId, "pending_contract");

    // Notify legal officer (future: event/notification system)

    return { transaction };
  }
}

module.exports = TransactionService;
```

---

### 4.3 Middleware Pattern

**Mục đích**: Cross-cutting concerns (authentication, logging, error handling).

```javascript
// backend/src/middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/environment");

/**
 * Middleware: Verify JWT token
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user; // Attach user to request
    next();
  });
};

/**
 * Middleware: Check role permission
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!allowedRoles.includes(req.user.position)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
};

module.exports = { authenticateToken, requireRole };
```

Usage:

```javascript
// backend/src/routes/staff.routes.js
const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staff.controller");
const {
  authenticateToken,
  requireRole,
} = require("../middlewares/auth.middleware");

// Only manager can create staff
router.post(
  "/",
  authenticateToken,
  requireRole("manager"),
  staffController.create
);

// Any authenticated user can view their own profile
router.get("/me", authenticateToken, staffController.getProfile);

module.exports = router;
```

---

## 5. BEST PRACTICES

### 5.1 Error Handling

**Centralized Error Handler**:

```javascript
// backend/src/middlewares/error.middleware.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  // Default to 500 if not specified
  statusCode = statusCode || 500;
  message = message || "Internal Server Error";

  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  // Send response
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = { AppError, errorHandler };
```

Usage:

```javascript
// In service
if (!owner) {
  throw new AppError("Owner not found", 404);
}

// In controller
try {
  const result = await service.create(req.body, req.user);
  res.status(201).json(result);
} catch (error) {
  next(error); // Pass to error handler middleware
}
```

---

### 5.2 Input Validation

**Use Joi Schemas**:

```javascript
// backend/src/validators/transaction.validator.js
const Joi = require("joi");

const transactionCreateSchema = Joi.object({
  real_estate_id: Joi.string().required(),
  client_id: Joi.string().required(),
  offer_price: Joi.number().positive().required(),
  terms: Joi.string().optional(),
});

const transactionUpdateSchema = Joi.object({
  offer_price: Joi.number().positive().optional(),
  terms: Joi.string().optional(),
  status: Joi.string()
    .valid("negotiating", "pending_contract", "cancelled")
    .optional(),
});

module.exports = {
  transactionCreateSchema,
  transactionUpdateSchema,
};
```

**Validation Middleware**:

```javascript
// backend/src/middlewares/validate.middleware.js
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        error: "Validation failed",
        details: errors,
      });
    }

    req.body = value; // Use validated & sanitized value
    next();
  };
};

module.exports = validate;
```

---

### 5.3 Logging

**Winston Logger**:

```javascript
// backend/src/utils/logger.js
const winston = require("winston");

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

module.exports = logger;
```

Usage:

```javascript
const logger = require("../utils/logger");

// In service
logger.info("Creating new real estate", { data, user: user.username });

// In error handler
logger.error("Failed to create transaction", {
  error: err.message,
  stack: err.stack,
  user: req.user,
});
```

---

### 5.4 Testing

**Unit Test Example**:

```javascript
// backend/src/__tests__/unit/models/contract.model.test.js
const Contract = require("../../../models/contract.model");

describe("Contract Model", () => {
  describe("isFullyPaid()", () => {
    it("should return true when remaining amount is 0", () => {
      const contract = new Contract({
        id: "1",
        total_value: 1000000,
        remaining_amount: 0,
      });

      expect(contract.isFullyPaid()).toBe(true);
    });

    it("should return false when remaining amount > 0", () => {
      const contract = new Contract({
        id: "1",
        total_value: 1000000,
        remaining_amount: 500000,
      });

      expect(contract.isFullyPaid()).toBe(false);
    });
  });

  describe("recordPayment()", () => {
    it("should decrease remaining amount", () => {
      const contract = new Contract({
        id: "1",
        total_value: 1000000,
        remaining_amount: 500000,
      });

      contract.recordPayment(200000);

      expect(contract.remaining_amount).toBe(300000);
    });

    it("should throw error if payment exceeds remaining debt", () => {
      const contract = new Contract({
        id: "1",
        total_value: 1000000,
        remaining_amount: 100000,
      });

      expect(() => {
        contract.recordPayment(200000);
      }).toThrow("Payment exceeds remaining debt");
    });
  });
});
```

**Integration Test Example**:

```javascript
// backend/src/__tests__/integration/real-estate.test.js
const request = require("supertest");
const app = require("../../app");

describe("POST /api/v1/real-estates", () => {
  let authToken;

  beforeAll(async () => {
    // Login to get token
    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ username: "agent1", password: "password123" });

    authToken = loginRes.body.accessToken;
  });

  it("should create real estate successfully", async () => {
    const res = await request(app)
      .post("/api/v1/real-estates")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "Luxury Apartment",
        type: "apartment",
        transaction_type: "sale",
        location: "123 Main St",
        price: 5000000,
        area: 120,
        owner_id: "1",
      });

    expect(res.status).toBe(201);
    expect(res.body.realEstate).toHaveProperty("id");
    expect(res.body.realEstate.title).toBe("Luxury Apartment");
  });

  it("should return 401 without token", async () => {
    const res = await request(app)
      .post("/api/v1/real-estates")
      .send({ title: "Test" });

    expect(res.status).toBe(401);
  });
});
```

---

## 6. CODE EXAMPLES

### 6.1 Complete Feature: Create Transaction

#### Step 1: Define Route

```javascript
// backend/src/routes/transaction.routes.js
const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction.controller");
const {
  authenticateToken,
  requireRole,
} = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  transactionCreateSchema,
} = require("../validators/transaction.validator");

router.post(
  "/",
  authenticateToken,
  requireRole("agent", "manager"),
  validate(transactionCreateSchema),
  transactionController.create
);

module.exports = router;
```

#### Step 2: Controller

```javascript
// backend/src/controllers/transaction.controller.js
const transactionService = require("../services/transaction.service");

class TransactionController {
  async create(req, res, next) {
    try {
      const result = await transactionService.create(req.body, req.user);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TransactionController();
```

#### Step 3: Service (Business Logic)

```javascript
// backend/src/services/transaction.service.js
const { AppError } = require("../middlewares/error.middleware");

class TransactionService {
  constructor(transactionRepo, appointmentRepo, realEstateRepo) {
    this.transactionRepo = transactionRepo;
    this.appointmentRepo = appointmentRepo;
    this.realEstateRepo = realEstateRepo;
  }

  async create(data, user) {
    // Validate: Appointment must be completed
    const appointment =
      await this.appointmentRepo.findCompletedByRealEstateAndClient(
        data.real_estate_id,
        data.client_id
      );

    if (!appointment) {
      throw new AppError(
        "Client must have a completed appointment before creating transaction",
        400
      );
    }

    // Validate: Permission
    if (user.position !== "manager" && user.staff_id !== appointment.staff_id) {
      throw new AppError(
        "You do not have permission to create this transaction",
        403
      );
    }

    // Validate: Real estate status
    const realEstate = await this.realEstateRepo.findById(data.real_estate_id);
    if (realEstate.status !== "listed") {
      throw new AppError("Real estate is not available for transaction", 400);
    }

    // Create transaction
    const transaction = await this.transactionRepo.create({
      ...data,
      staff_id: user.staff_id,
      status: "negotiating",
    });

    // Update real estate status
    await this.realEstateRepo.updateStatus(data.real_estate_id, "negotiating");

    return { transaction: transaction.toJSON() };
  }
}

module.exports = new TransactionService(
  require("../repositories/transaction.repository"),
  require("../repositories/appointment.repository"),
  require("../repositories/real-estate.repository")
);
```

#### Step 4: Repository (Data Access)

```javascript
// backend/src/repositories/transaction.repository.js
const db = require("../config/database");
const Transaction = require("../models/transaction.model");

class TransactionRepository {
  async create(data) {
    const result = await db.query(
      `INSERT INTO transaction (
        real_estate_id, client_id, staff_id, offer_price, terms, status
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        data.real_estate_id,
        data.client_id,
        data.staff_id,
        data.offer_price,
        data.terms,
        data.status,
      ]
    );

    return new Transaction(result.rows[0]);
  }

  async findById(id) {
    const result = await db.query("SELECT * FROM transaction WHERE id = $1", [
      id,
    ]);
    return result.rows[0] ? new Transaction(result.rows[0]) : null;
  }
}

module.exports = new TransactionRepository();
```

#### Step 5: Model

```javascript
// backend/src/models/transaction.model.js
class Transaction {
  constructor(data) {
    this.id = data.id;
    this.real_estate_id = data.real_estate_id;
    this.client_id = data.client_id;
    this.staff_id = data.staff_id;
    this.offer_price = data.offer_price;
    this.terms = data.terms;
    this.status = data.status || "negotiating";
    this.created_at = data.created_at;
  }

  canFinalize() {
    return this.status === "negotiating";
  }

  toJSON() {
    return {
      id: this.id,
      real_estate_id: this.real_estate_id,
      client_id: this.client_id,
      staff_id: this.staff_id,
      offer_price: this.offer_price,
      terms: this.terms,
      status: this.status,
      created_at: this.created_at,
    };
  }
}

module.exports = Transaction;
```

---

## TÓM TẮT

### Checklist Áp Dụng OOP

✅ **Encapsulation**

- [ ] Data và methods được gom vào classes
- [ ] Private/public separation rõ ràng
- [ ] Expose minimal interface

✅ **Abstraction**

- [ ] Service layer che giấu complexity
- [ ] Repository trừu tượng hóa data access
- [ ] Clear public API

✅ **Separation of Concerns**

- [ ] Controller chỉ xử lý HTTP
- [ ] Service chứa business logic
- [ ] Repository xử lý database
- [ ] Model định nghĩa entities

✅ **Dependency Injection**

- [ ] Dependencies được inject từ bên ngoài
- [ ] Loose coupling
- [ ] Dễ test với mock

✅ **Error Handling**

- [ ] Centralized error handler
- [ ] Custom error classes
- [ ] Proper HTTP status codes

✅ **Validation**

- [ ] Input validation với Joi
- [ ] Validation middleware
- [ ] Clear error messages

✅ **Testing**

- [ ] Unit tests cho models/services
- [ ] Integration tests cho APIs
- [ ] Test coverage >= 80%

---

**🎯 Remember**: Áp dụng OOP không phải để code phức tạp, mà để code dễ đọc, dễ maintain, và dễ mở rộng!
