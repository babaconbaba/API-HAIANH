# MISA SME 2026 — REST API Documentation

**Base URL**: `http://localhost:3003`
**Auth**: Header `Authorization: ApiKey <key>` hoặc `Bearer <jwt>`
**Multi-tenant**: Header `X-SQL-Instance` + `X-SQL-Database` để chọn database
**Swagger UI**: `http://localhost:3003/docs`

---

## Authentication

| Mode | Header | Ví dụ |
|------|--------|-------|
| API Key | `Authorization: ApiKey <key>` | `ApiKey misa-api-key-2026` |
| JWT | `Authorization: Bearer <token>` | `Bearer eyJ...` |

> Auth luôn bắt buộc. Tenant headers được validate regex `[a-zA-Z0-9._\\-]` chống injection.

---

## Response Format

```json
// Success
{
  "success": true,
  "data": { ... },
  "pagination": {             // chỉ có ở list endpoints
    "page": 1,
    "pageSize": 20,
    "totalCount": 137,
    "totalPages": 7
  }
}

// Error
{
  "success": false,
  "error": {
    "code": "NOT_FOUND | AUTH_INVALID | AUTH_REQUIRED | VALIDATION_ERROR | SCHEMA_ERROR | DUPLICATE | CONSTRAINT_ERROR | INTERNAL_ERROR",
    "message": "Human-readable message"
  }
}
```

### Error Codes

| HTTP | Code | Khi nào |
|------|------|---------|
| 400 | VALIDATION_ERROR | Invalid GUID, date format, JSON body |
| 401 | AUTH_REQUIRED | Thiếu auth header |
| 401 | AUTH_INVALID | Sai API key hoặc JWT |
| 404 | NOT_FOUND | Entity hoặc endpoint không tìm thấy |
| 409 | DUPLICATE | Trùng primary/unique key |
| 409 | CONSTRAINT_ERROR | Vi phạm foreign key |
| 422 | VALIDATION_ERROR | Thiếu required field, no fields to update |
| 500 | INTERNAL_ERROR | Lỗi server (không leak thông tin nội bộ) |

---

## Pagination & Filtering (all list endpoints)

| Param | Type | Default | Mô tả |
|-------|------|---------|-------|
| `page` | int | 1 | Trang (min 1) |
| `pageSize` | int | 20 | Số record/trang (max 200) |
| `sortBy` | string | RefDate | Column sort (allowlist validated) |
| `sortDir` | string | DESC | ASC hoặc DESC |
| `search` | string | | Full-text trên RefNo/JournalMemo/Code/Name |
| `dateFrom` | string | | YYYY-MM-DD |
| `dateTo` | string | | YYYY-MM-DD |
| `isPosted` | bool | | true/false filter |
| `refType` | int | | Filter theo RefType |

---

## 1. System — `/api/system`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/health` | Health check + DB connection |
| GET | `/ref-types` | Danh sách SYSRefType |
| GET | `/branches` | Danh sách OrganizationUnit (chi nhánh) |
| GET | `/databases` | Danh sách database trên SQL instance |

---

## 2. Dictionary — `/api/dictionary`

### Account Objects (Khách hàng / NCC / Nhân viên)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/account-objects` | List (paginated, `?type=0\|1\|2`, `?search=`) |
| GET | `/account-objects/:id` | Chi tiết |
| POST | `/account-objects` | Tạo mới |
| PUT | `/account-objects/:id` | Cập nhật |
| DELETE | `/account-objects/:id` | Xóa |

**POST body**:
```json
{
  "AccountObjectCode": "KH001",
  "AccountObjectName": "Công ty ABC",
  "AccountObjectType": 0,      // 0=KH, 1=NCC, 2=NV
  "Address": "123 ABC St",
  "Tel": "0901234567",
  "CompanyTaxCode": "1234567890",
  "BankAccount": "000111222",
  "BankName": "Vietcombank"
}
```

### Inventory Items (Hàng hóa / Vật tư / Dịch vụ)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/inventory-items` | List (paginated, `?search=`) |
| GET | `/inventory-items/:id` | Chi tiết |
| POST | `/inventory-items` | Tạo mới |
| PUT | `/inventory-items/:id` | Cập nhật |
| DELETE | `/inventory-items/:id` | Xóa |

### Other Dictionaries (Read-only)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/accounts` | Hệ thống tài khoản (137 TK) |
| GET | `/accounts/:accountNumber` | Chi tiết 1 tài khoản |
| GET | `/employees` | Danh sách nhân viên (`?search=`) |
| GET | `/organization-units` | Chi nhánh / phòng ban |
| GET | `/units` | Đơn vị tính |
| GET | `/bank-accounts` | Tài khoản ngân hàng |
| GET | `/inventory-categories` | Nhóm hàng hóa |
| GET | `/payment-terms` | Điều khoản thanh toán |
| GET | `/currencies` | Loại tiền |

---

## 3. Journal — `/api/journal`

### General Ledger (Sổ cái)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/general-ledger` | Query GL (`?account=`, `?dateFrom=`, `?dateTo=`, `?refType=`, `?branchId=`, `?limit=`) |
| GET | `/account-balance` | Số dư tài khoản (`?account=` **bắt buộc**, `?dateFrom=`, `?dateTo=`) |

### GL Voucher (Chứng từ nghiệp vụ khác)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/gl-vouchers` | List (paginated) |
| GET | `/gl-vouchers/:refId` | Chi tiết + detail lines |
| POST | `/gl-vouchers` | Tạo + hạch toán GL |
| DELETE | `/gl-vouchers/:refId` | Xóa + gỡ GL |

### Cash Receipts (Phiếu thu)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/cash/receipts` | List |
| GET | `/cash/receipts/:refId` | Chi tiết |
| POST | `/cash/receipts` | Tạo + hạch toán GL |
| DELETE | `/cash/receipts/:refId` | Xóa + gỡ GL |

### Cash Payments (Phiếu chi)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/cash/payments` | List |
| GET | `/cash/payments/:refId` | Chi tiết |
| POST | `/cash/payments` | Tạo + hạch toán GL |
| DELETE | `/cash/payments/:refId` | Xóa + gỡ GL |

### Bank Deposits (Thu tiền gửi)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/bank/deposits` | List |
| GET | `/bank/deposits/:refId` | Chi tiết |
| POST | `/bank/deposits` | Tạo + hạch toán GL |
| DELETE | `/bank/deposits/:refId` | Xóa + gỡ GL |

### Bank Withdrawals (Ủy nhiệm chi)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/bank/withdrawals` | List |
| GET | `/bank/withdrawals/:refId` | Chi tiết |
| POST | `/bank/withdrawals` | Tạo + hạch toán GL |
| DELETE | `/bank/withdrawals/:refId` | Xóa + gỡ GL |

**POST body** (áp dụng cho tất cả voucher):
```json
{
  "JournalMemo": "Mô tả chứng từ",
  "TotalAmount": 10000000,
  "CurrencyID": "VND",
  "ExchangeRate": 1,
  "AccountObjectName": "Tên KH/NCC",
  "details": [
    {
      "DebitAccount": "1111",
      "CreditAccount": "131",
      "Amount": 10000000,
      "Quantity": 100,
      "UnitPrice": 100000,
      "Description": "Mô tả dòng"
    }
  ]
}
```

---

## 4. Sales — `/api/sales`

### Vouchers (Bán hàng)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/vouchers` | List (paginated) |
| GET | `/vouchers/:refId` | Chi tiết + detail lines |
| POST | `/vouchers` | Tạo + hạch toán GL |
| DELETE | `/vouchers/:refId` | Xóa + gỡ GL |

### Orders (Đơn đặt hàng)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/orders` | List |
| GET | `/orders/:refId` | Chi tiết |
| POST | `/orders` | Tạo (không hạch toán GL) |
| DELETE | `/orders/:refId` | Xóa |

### Returns (Hàng bán trả lại)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/returns` | List |
| GET | `/returns/:refId` | Chi tiết |
| POST | `/returns` | Tạo + hạch toán GL |
| DELETE | `/returns/:refId` | Xóa + gỡ GL |

### Invoices (Hóa đơn)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/invoices` | List |
| GET | `/invoices/:refId` | Chi tiết |
| POST | `/invoices` | Tạo |
| DELETE | `/invoices/:refId` | Xóa |

### Quotes (Báo giá)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/quotes` | List |
| GET | `/quotes/:refId` | Chi tiết |
| POST | `/quotes` | Tạo |
| DELETE | `/quotes/:refId` | Xóa |

---

## 5. Purchase — `/api/purchase`

### Vouchers (Mua hàng)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/vouchers` | List (paginated) |
| GET | `/vouchers/:refId` | Chi tiết + detail lines |
| POST | `/vouchers` | Tạo + hạch toán GL |
| DELETE | `/vouchers/:refId` | Xóa + gỡ GL |

### Orders (Đơn mua hàng)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/orders` | List |
| GET | `/orders/:refId` | Chi tiết |
| POST | `/orders` | Tạo |
| DELETE | `/orders/:refId` | Xóa |

### Returns (Hàng mua trả lại)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/returns` | List |
| GET | `/returns/:refId` | Chi tiết |
| POST | `/returns` | Tạo + hạch toán GL |
| DELETE | `/returns/:refId` | Xóa + gỡ GL |

---

## 6. Inventory — `/api/inventory`

### Inwards (Nhập kho)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/inwards` | List |
| GET | `/inwards/:refId` | Chi tiết |
| POST | `/inwards` | Tạo + hạch toán GL |
| DELETE | `/inwards/:refId` | Xóa + gỡ GL |

### Outwards (Xuất kho)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/outwards` | List |
| GET | `/outwards/:refId` | Chi tiết |
| POST | `/outwards` | Tạo + hạch toán GL |
| DELETE | `/outwards/:refId` | Xóa + gỡ GL |

### Transfers (Chuyển kho)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/transfers` | List |
| GET | `/transfers/:refId` | Chi tiết |
| POST | `/transfers` | Tạo + hạch toán GL |
| DELETE | `/transfers/:refId` | Xóa + gỡ GL |

---

## 7. Fixed Assets & Tools — `/api/fixed-assets`

### Fixed Assets (TSCĐ)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/assets` | List (paginated, `?search=`) |
| GET | `/assets/:id` | Chi tiết |
| POST | `/assets` | Tạo mới |
| PUT | `/assets/:id` | Cập nhật |
| DELETE | `/assets/:id` | Xóa |

### Categories (Loại TSCĐ)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/categories` | Danh sách loại TSCĐ |

### Depreciation (Khấu hao)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/depreciation` | List (paginated, `?dateFrom=`, `?dateTo=`) |
| GET | `/depreciation/:refId` | Chi tiết |
| POST | `/depreciation` | Tạo + hạch toán GL |
| DELETE | `/depreciation/:refId` | Xóa + gỡ GL |

### Tools/CCDC (Công cụ dụng cụ)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/tools` | List (paginated, `?search=`) |
| GET | `/tools/:id` | Chi tiết |
| POST | `/tools` | Tạo mới |
| PUT | `/tools/:id` | Cập nhật |
| DELETE | `/tools/:id` | Xóa |

### Allocations (Phân bổ CCDC)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/allocations` | List (paginated, `?dateFrom=`, `?dateTo=`) |
| GET | `/allocations/:refId` | Chi tiết |
| POST | `/allocations` | Tạo + hạch toán GL |
| DELETE | `/allocations/:refId` | Xóa + gỡ GL |

---

## 8. Payroll — `/api/payroll`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/employees` | DS nhân viên (paginated, `?search=`, `?departmentId=`) |
| GET | `/vouchers` | Chứng từ lương (paginated, `?dateFrom=`, `?dateTo=`) |
| GET | `/salary-sheet` | Bảng lương (`?month=`, `?year=`) |
| GET | `/insurance` | BHXH/BHYT/BHTN (`?month=`, `?year=`) — từ TK 338 |
| GET | `/pit` | Thuế TNCN (`?month=`, `?year=`) — từ TK 3335 |

---

## 9. Tax — `/api/tax`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/vat-input` | Thuế GTGT đầu vào TK 133 (paginated, `?dateFrom=`, `?dateTo=`) |
| GET | `/vat-output` | Thuế GTGT đầu ra TK 3331 (paginated, `?dateFrom=`, `?dateTo=`) |
| GET | `/vat-summary` | Tổng hợp VAT: Input/Output/Payable (`?dateFrom=`, `?dateTo=`) |
| GET | `/cit` | Thuế TNDN TK 3334 (`?dateFrom=`, `?dateTo=`) |
| GET | `/summary` | Tổng hợp tất cả thuế TK 333x (`?dateFrom=`, `?dateTo=`) |

---

## 10. Reports — `/api/reports`

### Báo cáo tài chính

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/trial-balance` | Bảng cân đối phát sinh (`?dateFrom=`, `?dateTo=`, `?grade=1\|2`) |
| GET | `/income-statement` | Báo cáo KQKD (`?dateFrom=`, `?dateTo=`) |
| GET | `/balance-sheet` | Bảng CĐKT (`?asOfDate=`) |
| GET | `/cash-flow` | Lưu chuyển tiền tệ (`?dateFrom=`, `?dateTo=`) |

### Công nợ

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/receivables` | Công nợ phải thu TK 131 (`?asOfDate=`) |
| GET | `/payables` | Công nợ phải trả TK 331 (`?asOfDate=`) |

### Kho & Doanh thu

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/inventory-balance` | Tồn kho TK 152/153/155/156 (`?asOfDate=`) |
| GET | `/revenue-by-period` | Doanh thu theo tháng/quý (`?year=`, `?groupBy=month\|quarter`) |

### Sổ chi tiết & Tổng quan

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/account-ledger` | Sổ chi tiết TK (`?account=` **bắt buộc**, `?dateFrom=`, `?dateTo=`) — kèm RunningBalance |
| GET | `/dashboard` | Tổng quan: Revenue/COGS/Cash/Receivables/Payables (`?year=`) |

---

## 11. Contracts — `/api/contracts`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | List (paginated, `?search=`, `?status=`) |
| GET | `/:id` | Chi tiết |
| POST | `/` | Tạo mới |
| PUT | `/:id` | Cập nhật |
| DELETE | `/:id` | Xóa |
| GET | `/:id/ledger` | GL entries liên quan đến hợp đồng |

---

## 12. Budget — `/api/budget`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | List (paginated, `?year=`) |
| GET | `/:id` | Chi tiết + detail lines |
| POST | `/` | Tạo mới |
| PUT | `/:id` | Cập nhật |
| DELETE | `/:id` | Xóa (cascade detail) |
| GET | `/analysis/vs-actual` | So sánh ngân sách vs thực tế (`?year=`) |

---

## Voucher Creation Flow

Khi tạo voucher (POST):

1. **RefID** — Auto-generate GUID
2. **RefNo** — Auto-increment từ `SYSAutoID` (prefix: PT, PC, BH, MH, NK, XK, NVK...)
3. **BranchID** — Default lấy chi nhánh đầu tiên nếu không truyền
4. **GL Posting** — Tự động tạo cặp Debit/Credit trong `GeneralLedger`
5. **Transaction** — Toàn bộ trong 1 SQL transaction, rollback nếu lỗi

Khi xóa voucher (DELETE):
1. **Unpost GL** — Xóa tất cả GL entries liên quan
2. **Delete details** — Xóa detail lines
3. **Delete master** — Xóa master record
4. **Transaction** — Atomic rollback

---

## Quick Start

```bash
# Start server
cd misa-sme-api && npm start

# Health check
curl -H "Authorization: ApiKey misa-api-key-2026" http://localhost:3003/api/system/health

# List customers
curl -H "Authorization: ApiKey misa-api-key-2026" "http://localhost:3003/api/dictionary/account-objects?type=0"

# Create sales voucher
curl -X POST -H "Authorization: ApiKey misa-api-key-2026" \
  -H "Content-Type: application/json" \
  http://localhost:3003/api/sales/vouchers \
  -d '{
    "JournalMemo": "Bán hàng cho KH",
    "TotalAmount": 10000000,
    "details": [{
      "DebitAccount": "131",
      "CreditAccount": "5111",
      "Amount": 10000000,
      "Quantity": 100,
      "UnitPrice": 100000
    }]
  }'

# Dashboard
curl -H "Authorization: ApiKey misa-api-key-2026" "http://localhost:3003/api/reports/dashboard?year=2025"

# Income statement
curl -H "Authorization: ApiKey misa-api-key-2026" \
  "http://localhost:3003/api/reports/income-statement?dateFrom=2025-01-01&dateTo=2025-12-31"
```

---

## Endpoint Summary

| Module | Prefix | Endpoints | CRUD |
|--------|--------|-----------|------|
| System | `/api/system` | 4 | Read |
| Dictionary | `/api/dictionary` | 17 | Full CRUD |
| Journal | `/api/journal` | 18 | Full CRUD + GL |
| Sales | `/api/sales` | 20 | Full CRUD + GL |
| Purchase | `/api/purchase` | 12 | Full CRUD + GL |
| Inventory | `/api/inventory` | 12 | Full CRUD + GL |
| Fixed Assets | `/api/fixed-assets` | 18 | Full CRUD + GL |
| Payroll | `/api/payroll` | 5 | Read |
| Tax | `/api/tax` | 5 | Read |
| Reports | `/api/reports` | 10 | Read |
| Contracts | `/api/contracts` | 6 | Full CRUD |
| Budget | `/api/budget` | 6 | Full CRUD |

**Total: ~133 endpoints** across 12 modules.
