# PROJECT CONTEXT: REAL ESTATE MANAGEMENT SYSTEM

> **Instruction for AI:** This file is the Single Source of Truth for generating API Contracts (OpenAPI/Swagger). Use the Data Structures from Section A and Business Logic from Section B.

---

## A. DATA STRUCTURES (Based on Class Diagram)

Here represent the Domain Models and DTOs in Mermaid format.

```mermaid
classDiagram
    %% ENUMS %%
    class StaffPosition {
        <<enumeration>>
        AGENT
        LEGAL_OFFICER
        ACCOUNTANT
        MANAGER
    }
    class ClientType {
        <<enumeration>>
        BUYER
        SELLER
        LANDLORD
        TENANT
    }
    class RealEstateStatus {
        <<enumeration>>
        CREATED
        PENDING_LEGAL_CHECK
        LISTED
        NEGOTIATING
        TRANSACTED
        SUSPENDED
    }
    class TransactionStatus {
        <<enumeration>>
        NEGOTIATING
        PENDING_CONTRACT
        CANCELLED
    }
    class AppointmentStatus {
        <<enumeration>>
        CREATED
        CONFIRMED
        COMPLETED
        CANCELLED
    }
    class ContractStatus {
        <<enumeration>>
        DRAFT
        PENDING_SIGNATURE
        SIGNED
        NOTARIZED
        FINALIZED
        CANCELLED
    }
    class VoucherType {
        <<enumeration>>
        RECEIPT
        PAYMENT
    }
    class DirectionType {
        <<enumeration>>
        NORTH
        SOUTH
        EAST
        WEST
        NORTHEAST
        NORTHWEST
        SOUTHEAST
        SOUTHWEST
    }
    class PaymentMethod {
        <<enumeration>>
        CASH
        BANK_TRANSFER
    }

    %% ENTITIES %%
    class PersonInformation {
        +String fullName
        +String email
        +String phoneNumber
        +String address
    }

    class Account {
        +String username
        +String password
        +boolean isActive
    }

    class File {
        +String id
        +String url
        +String name
        +String type
        +Datetime uploadedAt
    }

    class Staff {
        +String id
        +Account account
        +PersonInformation information
        +StaffPosition position
        +String assignedArea
        +StaffStatus status
    }

    class Client {
        +String id
        +PersonInformation information
        +ClientType type
        +String referralSrc
        +String requirement
    }

    class RealEstate {
        +String id
        +String title
        +String type
        +TransactionType transactionType
        +String location
        +Number price
        +Number area
        +String description
        +DirectionType direction
        +List~File~ mediaFiles
        +Client owner
        +List~File~ legalDocuments
        +Staff assignedAgent
        +RealEstateStatus status
    }

    class Appointment {
        +String id
        +RealEstate relatedRealEstate
        +Client client
        +Staff assignedAgent
        +Datetime startTime
        +Datetime endTime
        +String location
        +AppointmentStatus status
        +String note
    }

    class Transaction {
        +String id
        +RealEstate relatedRealEstate
        +Client client
        +Staff assignedAgent
        +Number offerPrice
        +String terms
        +TransactionStatus status
        +String cancellationReason
    }

    class Contract {
        +String id
        +Transaction transaction
        +ContractType type
        +Client partyA
        +Client partyB
        +Number totalValue
        +Number depositAmount
        +String paymentTerms
        +Number remainingAmount
        +Date signedDate
        +Date effectiveDate
        +Date expirationDate
        +List~File~ attachments
        +ContractStatus status
        +Staff assignedLegalOfficer
    }

    class Voucher {
        +String id
        +Contract relatedContract
        +VoucherType type
        +String party
        +Datetime paymentTime
        +Number amount
        +PaymentMethod paymentMethod
        +String paymentDescription
        +List~File~ attachments
        +Staff assignedAccountant
        +VoucherStatus status
    }

    class SystemLog {
        +String id
        +String actorId
        +String actionType
        +String targetId
        +Datetime timestamp
        +String details
    }

    %% RELATIONSHIPS %%
    Staff --* Account
    Staff --* PersonInformation
    RealEstate "1" --> "1" Client : owner
    RealEstate "*" --> "1" Staff : assignedAgent
    Appointment "*" --> "1" RealEstate
    Appointment "*" --> "1" Client
    Transaction "*" --> "1" RealEstate
    Contract "1" --> "1" Transaction
    Contract "*" --> "1" Staff : legalOfficer
    Voucher "*" --> "1" Contract

---

## B. API BEHAVIORS & SPECIFICATIONS (Based on Use Cases)

### 1. Auth Module
* **POST /api/auth/login** (UC1.2)
    * Input: `username`, `password`
    * Output: `accessToken`, `refreshToken`, `userInfo`, `role`
    * Errors: 401 (Invalid credentials), 403 (Account disabled)

### 2. Staff Management (Role: Manager)
* **POST /api/staff** (UC1.1)
    * Description: Create new staff profile.
    * Input: `PersonInformation`, `StaffPosition`, `Account` details.
* **PUT /api/staff/{id}** (UC1.1)
    * Description: Update staff information.
* **PUT /api/staff/{id}/status** (UC1.1)
    * Description: Deactivate/Activate staff.
* **PUT /api/staff/{id}/permissions** (UC9.1)
    * Description: Manager updates user permissions.

### 3. Client Module (Role: Agent)
* **POST /api/clients** (UC2.1)
    * Description: Add potential client (Buyer/Owner).
    * Logic: Check duplicate phone/email.
* **POST /api/clients/{id}/notes** (UC2.2)
    * Description: Add contact history/log.
* **GET /api/clients/{id}/notes** (UC2.2)
    * Description: View contact history.

### 4. Real Estate Module
* **POST /api/real-estates** (Role: Agent) (UC3.1)
    * Input: Property details, `ownerId`, `mediaFiles`.
    * Initial Status: `CREATED` or `PENDING_LEGAL_CHECK`.
* **PUT /api/real-estates/{id}** (Role: Agent) (UC3.3)
    * Description: Update info. Track price history if price changes.
* **PUT /api/real-estates/{id}/legal-check** (Role: Legal Officer) (UC3.2)
    * Input: `isApproved`, `note`.
    * Logic: Update status to `LISTED` if approved, else keep `PENDING_LEGAL_CHECK`.
* **PATCH /api/real-estates/{id}/status** (UC3.4)
    * Input: `status` (SUSPENDED/LISTED).

### 5. Appointment Module
* **POST /api/appointments** (Role: Agent) (UC4.1)
    * Input: `realEstateId`, `clientId`, `startTime`, `endTime`.
    * Validation: Check Agent's schedule conflict (QĐ4).
* **GET /api/appointments** (UC4.3)
    * Filters: date range, staffId (Manager only), status.
* **PATCH /api/appointments/{id}/status** (UC4.2)
    * Input: `status` (CONFIRMED/CANCELLED/COMPLETED), `resultNote`.

### 6. Transaction & Negotiation
* **POST /api/transactions** (Role: Agent) (UC5.1)
    * Pre-condition: Client must have a completed Appointment for this Property.
    * Input: `realEstateId`, `clientId`, `offerPrice`.
    * Effect: Set RealEstate status to `NEGOTIATING`.
* **PUT /api/transactions/{id}** (UC5.2)
    * Description: Update price/terms during negotiation.
* **PUT /api/transactions/{id}/finalize** (UC5.3)
    * Description: Move to Contract phase.
    * Effect: Status `PENDING_CONTRACT`, Notify Legal Officer.
* **PUT /api/transactions/{id}/cancel** (UC5.4)
    * Input: `reason`.
    * Effect: Transaction `CANCELLED`, RealEstate back to `LISTED`.

### 7. Contract Module (Role: Legal Officer)
* **POST /api/contracts** (UC6.1)
    * Input: `transactionId`, `terms`, `partyA`, `partyB`.
    * Status: `DRAFT` -> `PENDING_SIGNATURE`.
* **PATCH /api/contracts/{id}/status** (UC6.2)
    * Input: `status` (SIGNED/NOTARIZED/FINALIZED/CANCELLED).
* **POST /api/contracts/{id}/files** (UC6.3)
    * Description: Upload signed/notarized documents.

### 8. Payment & Voucher Module (Role: Accountant)
* **POST /api/vouchers** (UC7.1, UC7.3)
    * Description: Record payment (Receipt) or Expense (Payment).
    * Input: `contractId` (optional), `amount`, `type`, `attachments`.
    * Logic: Update `paidAmount` in Contract if related.
* **GET /api/debts** (UC7.2)
    * Description: Get contracts with `remainingAmount > 0`.

### 9. Reporting & System Module
* **GET /api/reports/revenue** (UC8.1)
    * Filter by time, agent.
* **GET /api/reports/performance** (UC8.2)
    * Stats on Agent's deals/appointments.
* **GET /api/reports/real-estate-status** (UC8.3)
* **GET /api/reports/financial** (UC8.4)
* **GET /api/logs** (UC9.3)
    * Description: System activity logs (Role: Manager).
* **PUT /api/system/config** (UC9.4)
    * Description: Update system settings.

