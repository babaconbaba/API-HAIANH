# MISA SME 2026 — REST API Documentation

**Production**: `http://192.168.99.216:3004`
**Swagger UI**: `http://192.168.99.216:3004/docs` (Try it out trực tiếp)

---

## Quick Start

```bash
# Clone
git clone https://github.com/babaconbaba/API-HAIANH.git
cd API-HAIANH

# Config
cp .env.example .env
# Sửa .env: SQL_INSTANCE, SQL_DATABASE, SQL_AUTH, SQL_USERNAME, SQL_PASSWORD

# Run
npm install
npm start                # single process
npm run start:cluster    # multi-core (production)
```

### .env Configuration

```env
PORT=3003
NODE_ENV=production

# Auth
AUTH_MODE=apikey
API_KEYS=misa-api-key-2026       # comma-separated, nhiều key cách nhau dấu phẩy
JWT_SECRET=change-me-in-production

# SQL Server
SQL_INSTANCE=192.168.99.200\\MISASME2026
SQL_DATABASE=HAG2026
SQL_AUTH=sql                      # sql hoặc windows
SQL_USERNAME=sa
SQL_PASSWORD=123456789A@

# Pool (tùy chỉnh)
SQL_POOL_MAX=50                   # max connections per pool
SQL_POOL_MIN=0
SQL_REQUEST_TIMEOUT=30000         # ms

# Cluster
WORKERS=4                         # mặc định = số CPU cores

# Rate Limit
RATE_LIMIT_MAX=1000               # requests per 15 min per IP
```

---

## Authentication

```
Authorization: ApiKey misa-api-key-2026
```

Bắt buộc trên tất cả `/api/*` endpoints. Không có → `401 AUTH_REQUIRED`.

---

## Multi-tenant (Remote SQL)

Mỗi request có thể kết nối SQL Server khác qua headers:

| Header | Mô tả | Ví dụ |
|--------|-------|-------|
| `X-SQL-Instance` | SQL Server | `192.168.99.200\MISASME2026` |
| `X-SQL-Database` | Database | `HAG2026` |
| `X-SQL-Auth` | Auth mode | `sql` hoặc `windows` |
| `X-SQL-Username` | Username | `sa` |
| `X-SQL-Password` | Password | `123456789A@` |

Không truyền → dùng default từ `.env`.

```bash
# Ví dụ: kết nối DB khác
curl -H "Authorization: ApiKey misa-api-key-2026" \
  -H "X-SQL-Instance: 10.0.0.50\\MISASME2026" \
  -H "X-SQL-Database: CompanyB2026" \
  -H "X-SQL-Auth: sql" \
  -H "X-SQL-Username: sa" \
  -H "X-SQL-Password: password123" \
  http://localhost:3003/api/system/health
```

---

## Response Format

```json
// Thành công
{
  "success": true,
  "data": { ... },
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalCount": 1636,
    "totalPages": 82
  }
}

// Tạo mới
{
  "success": true,
  "data": {
    "RefID": "A637E8C3-4E18-493C-835C-A967F4CD19E4",
    "RefNo": "PT00001"
  }
}

// Lỗi
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Sum of detail amounts (500000) does not match TotalAmount (1000000)."
  }
}
```

### Error Codes

| HTTP | Code | Khi nào |
|------|------|---------|
| 400 | `VALIDATION_ERROR` | Invalid GUID, date, JSON |
| 400 | `MISSING_DATABASE` | Thiếu database header + env |
| 400 | `MISSING_CREDENTIALS` | SQL Auth thiếu username |
| 401 | `AUTH_REQUIRED` | Thiếu Authorization header |
| 401 | `AUTH_INVALID` | Sai API key / JWT |
| 401 | `SQL_AUTH_FAILED` | Sai SQL credentials |
| 404 | `NOT_FOUND` | Không tìm thấy |
| 409 | `DUPLICATE` | Trùng key |
| 409 | `CONSTRAINT_ERROR` | Vi phạm FK |
| 422 | `VALIDATION_ERROR` | Thiếu required field, TotalAmount != sum details |
| 429 | `RATE_LIMITED` | Quá 1000 req/15min |
| 500 | `INTERNAL_ERROR` | Lỗi server |
| 503 | `SQL_CONNECTION_FAILED` | Không kết nối SQL Server |

---

## Pagination & Filtering

Áp dụng cho tất cả list endpoints:

| Param | Type | Default | Mô tả |
|-------|------|---------|-------|
| `page` | int | 1 | Trang |
| `pageSize` | int | 20 | Số record/trang (max 200) |
| `sortBy` | string | RefDate | Column sort |
| `sortDir` | string | DESC | `ASC` / `DESC` |
| `search` | string | | Tìm kiếm trên RefNo, JournalMemo, Code, Name |
| `dateFrom` | string | | `YYYY-MM-DD` |
| `dateTo` | string | | `YYYY-MM-DD` |
| `isPosted` | bool | | Filter đã ghi sổ |
| `refType` | int | | Filter theo loại chứng từ |

---

## Auto-fill (Kế thừa tự động)

Khi truyền `AccountObjectID`, API tự động fill:
- `AccountObjectName` — Tên KH/NCC
- `AccountObjectAddress` — Địa chỉ
- `AccountObjectTaxCode` — Mã số thuế
- `AccountObjectContactName` — Người liên hệ
- `detail.AccountObjectID` — Kế thừa từ master xuống detail lines

**Không cần truyền** Name/Address/TaxCode nếu đã truyền ID.

---

## Tạo chứng từ (POST)

### Flow tự động

1. `RefID` — Auto-generate GUID
2. `RefNo` / `RefNoFinance` — Auto-increment từ `SYSAutoID`
3. `BranchID` — Default chi nhánh đầu tiên
4. `AccountObject*` — Auto-fill từ AccountObject table
5. Validate: `SUM(details.Amount) == TotalAmount`
6. Insert master → Insert details → Post GL (nếu có)
7. Toàn bộ trong 1 SQL transaction, rollback nếu lỗi

### Master fields

```json
{
  "RefDate": "2026-05-20",
  "PostedDate": "2026-05-20",
  "JournalMemo": "Mô tả chứng từ",
  "TotalAmount": 10000000,
  "TotalAmountOC": 10000000,
  "CurrencyID": "VND",
  "ExchangeRate": 1,
  "AccountObjectID": "uuid — tự fill Name, Address, TaxCode",
  "BranchID": "uuid — mặc định chi nhánh đầu tiên",
  "ReasonTypeID": 13,
  "BankAccountID": "uuid — cho BA vouchers",
  "BankName": "Tên ngân hàng",
  "Month": 5,
  "Year": 2026,
  "IsSaleWithOutward": true,
  "TotalSaleAmount": 10000000,
  "TotalVATAmount": 1000000,
  "TotalDiscountAmount": 0,
  "details": [...]
}
```

### Detail fields

```json
{
  "DebitAccount": "1111",
  "CreditAccount": "131",
  "Amount": 10000000,
  "AmountOC": 10000000,
  "Description": "Mô tả dòng",
  "Quantity": 100,
  "UnitPrice": 100000,
  "InventoryItemID": "uuid — bắt buộc cho SA/PU/IN",
  "AccountObjectID": "uuid — kế thừa từ master",
  "StockID": "uuid — kho",
  "UnitID": "uuid — đơn vị tính",
  "MainUnitID": "uuid — ĐVT chính",
  "MainQuantity": 100,
  "MainConvertRate": 1,
  "MainUnitPrice": 100000,
  "OrderID": "uuid — liên kết đơn hàng",
  "JobID": "uuid — đối tượng THCP",
  "ExpenseItemID": "uuid — khoản mục chi phí",
  "BudgetItemID": "uuid — mục ngân sách",
  "OrganizationUnitID": "uuid — phòng ban",
  "PurchasePurposeID": "uuid — mục đích mua",
  "VATAccount": "33311",
  "VATRate": 10,
  "VATAmount": 1000000,
  "VATDescription": "Thuế GTGT 10%",
  "DiscountAccount": "52111",
  "InvNo": "Số hóa đơn",
  "InvDate": "2026-05-20"
}
```

> Tất cả fields đều optional (trừ DebitAccount, CreditAccount, Amount). Truyền bao nhiêu cũng được — API pass-through vào SQL.

### Xóa chứng từ (DELETE)

1. Unpost GL → Delete details → Delete master
2. Atomic transaction, rollback nếu lỗi

---

## Ví dụ tích hợp

### 1. Phiếu thu (Cash Receipt)

```bash
# Tạo phiếu thu 50 triệu
curl -X POST http://localhost:3003/api/journal/cash/receipts \
  -H "Authorization: ApiKey misa-api-key-2026" \
  -H "Content-Type: application/json" \
  -d '{
    "AccountObjectID": "A42CDF8A-6FE2-4CD7-98A0-00757350D37F",
    "ReasonTypeID": 13,
    "JournalMemo": "Thu tiền khách hàng Hòa Phát",
    "TotalAmount": 50000000,
    "details": [{
      "DebitAccount": "1111",
      "CreditAccount": "131",
      "Amount": 50000000,
      "AmountOC": 50000000,
      "Description": "Thu tiền hàng theo HĐ 001/2026",
      "BudgetItemID": "29CDEF21-31A8-4DC9-9A05-9AB46816FA6C",
      "OrganizationUnitID": "32C83F91-35A9-4ADC-BD74-F9FE5E3FDD2A"
    }]
  }'

# Response
{
  "success": true,
  "data": { "RefID": "A637E8C3-...", "RefNo": "VPPT000730" }
}
```

### 2. Bán hàng + VAT (Sales Voucher)

```bash
curl -X POST http://localhost:3003/api/sales/vouchers \
  -H "Authorization: ApiKey misa-api-key-2026" \
  -H "Content-Type: application/json" \
  -d '{
    "AccountObjectID": "0DF5DAE9-FFB1-412A-B19F-5E4467AE7FE0",
    "JournalMemo": "Bán thép tấm 10mm cho Hòa Phát",
    "TotalAmount": 110000000,
    "TotalSaleAmount": 100000000,
    "TotalVATAmount": 10000000,
    "IsSaleWithOutward": true,
    "details": [
      {
        "DebitAccount": "131",
        "CreditAccount": "5111",
        "Amount": 100000000,
        "Quantity": 20,
        "UnitPrice": 5000000,
        "InventoryItemID": "BF9426A8-84F5-4BF1-AA75-A62BC1073826",
        "StockID": "0D83E65A-D5E3-4E2F-8FC9-B01B5B738D2A",
        "UnitID": "39E7C3D8-CA57-400D-9EBC-BF6A48717B7E",
        "MainUnitID": "39E7C3D8-CA57-400D-9EBC-BF6A48717B7E",
        "MainQuantity": 20,
        "MainConvertRate": 1,
        "VATAccount": "33311",
        "VATRate": 10,
        "VATDescription": "Thuế GTGT 10%",
        "OrderID": "E838A404-5793-4196-AD10-09AE3F961AC0"
      },
      {
        "DebitAccount": "131",
        "CreditAccount": "33311",
        "Amount": 10000000,
        "InventoryItemID": "BF9426A8-84F5-4BF1-AA75-A62BC1073826",
        "Description": "Thuế GTGT 10%"
      }
    ]
  }'
```

### 3. Mua hàng (Purchase Voucher)

```bash
curl -X POST http://localhost:3003/api/purchase/vouchers \
  -H "Authorization: ApiKey misa-api-key-2026" \
  -H "Content-Type: application/json" \
  -d '{
    "AccountObjectID": "C3FA3A14-A7EA-44AB-BAC4-51B0C3DD795F",
    "JournalMemo": "Mua thép cuộn CB240 từ Việt Nhật",
    "TotalAmount": 80000000,
    "details": [{
      "DebitAccount": "152",
      "CreditAccount": "331",
      "Amount": 80000000,
      "Quantity": 10,
      "UnitPrice": 8000000,
      "InventoryItemID": "FC3C4094-5289-46AB-8960-ABE6EC4E1B14",
      "UnitID": "71112249-98CE-4334-A06D-34736155FA3E",
      "ExpenseItemID": "F5C7D93F-C480-473E-8E2E-0A36E00509B3",
      "OrganizationUnitID": "4A5F59EF-ED4E-4073-BA85-2DA2B49AB21A",
      "VATAccount": "1331",
      "VATRate": 10,
      "VATDescription": "Thuế GTGT 10%",
      "InvNo": "1755613",
      "InvDate": "2026-05-18"
    }]
  }'
```

### 4. Dashboard

```bash
curl http://localhost:3003/api/reports/dashboard?year=2026 \
  -H "Authorization: ApiKey misa-api-key-2026"

# Response
{
  "success": true,
  "data": {
    "year": 2026,
    "RevenueYTD": 22183869378,
    "COGSYTD": 1616527315,
    "CashOnHand": 300747577,
    "BankBalance": 9933481825.2,
    "TotalReceivables": 15942145402.8,
    "TotalPayables": 21267512330.8
  }
}
```

---

## Endpoints (229 total)

### 1. System — `/api/system` (5)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/health` | Health check + DB status |
| GET | `/ref-types` | Danh sách loại chứng từ (SYSRefType) |
| GET | `/branches` | Chi nhánh / phòng ban |
| GET | `/databases` | Danh sách databases trên SQL instance |
| GET | `/tables` | Danh sách tables trong database |

### 2. Dictionary — `/api/dictionary` (19)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/account-objects` | DS khách hàng/NCC (`?search=`, `?type=0\|1\|2`) |
| GET | `/account-objects/:id` | Chi tiết |
| POST | `/account-objects` | Tạo |
| PUT | `/account-objects/:id` | Cập nhật |
| DELETE | `/account-objects/:id` | Xóa |
| GET | `/inventory-items` | DS hàng hóa (`?search=`) |
| GET | `/inventory-items/:id` | Chi tiết |
| POST | `/inventory-items` | Tạo |
| PUT | `/inventory-items/:id` | Cập nhật |
| DELETE | `/inventory-items/:id` | Xóa |
| GET | `/accounts` | Hệ thống tài khoản |
| GET | `/accounts/:accountNumber` | Chi tiết TK |
| GET | `/employees` | Nhân viên |
| GET | `/organization-units` | Chi nhánh/phòng ban |
| GET | `/bank-accounts` | TK ngân hàng |
| GET | `/units` | Đơn vị tính |
| GET | `/inventory-categories` | Nhóm hàng hóa |
| GET | `/payment-terms` | Điều khoản thanh toán |
| GET | `/currencies` | Loại tiền |

### 3. Journal — `/api/journal` (26)

**GL Voucher (CT nghiệp vụ khác)** — CRUD + GL posting
| GET `/gl-vouchers` | POST `/gl-vouchers` | GET `/gl-vouchers/:refId` | DELETE `/gl-vouchers/:refId` |

**Cash Receipts (Phiếu thu)** — CRUD + GL posting
| GET `/cash/receipts` | POST `/cash/receipts` | GET `/cash/receipts/:refId` | DELETE `/cash/receipts/:refId` |

**Cash Payments (Phiếu chi)** — CRUD + GL posting
| GET `/cash/payments` | POST `/cash/payments` | GET `/cash/payments/:refId` | DELETE `/cash/payments/:refId` |

**Bank Deposits (Thu tiền gửi)** — CRUD + GL posting
| GET `/bank/deposits` | POST `/bank/deposits` | GET `/bank/deposits/:refId` | DELETE `/bank/deposits/:refId` |

**Bank Withdrawals (Ủy nhiệm chi)** — CRUD + GL posting
| GET `/bank/withdrawals` | POST `/bank/withdrawals` | GET `/bank/withdrawals/:refId` | DELETE `/bank/withdrawals/:refId` |

**Bank Internal Transfers (Chuyển tiền nội bộ)** — CRUD + GL posting
| GET `/bank/internal-transfers` | POST `/bank/internal-transfers` | GET `/bank/internal-transfers/:refId` | DELETE `/bank/internal-transfers/:refId` |

**General Ledger** — Read only
| GET `/general-ledger` | GET `/account-balance?account=1111` |

### 4. Sales — `/api/sales` (24)

| Module | GET list | POST | GET detail | DELETE | GL |
|--------|----------|------|------------|--------|----|
| Báo giá | `/quotes` | ✓ | `/:refId` | ✓ | — |
| Đơn đặt hàng | `/orders` | ✓ | `/:refId` | ✓ | — |
| **Bán hàng** | `/vouchers` | ✓ | `/:refId` | ✓ | **✓** |
| Hóa đơn | `/invoices` | ✓ | `/:refId` | ✓ | — |
| **Giảm giá BH** | `/discounts` | ✓ | `/:refId` | ✓ | **✓** |
| **Trả lại BH** | `/returns` | ✓ | `/:refId` | ✓ | **✓** |

### 5. Purchase — `/api/purchase` (20)

| Module | GET list | POST | GET detail | DELETE | GL |
|--------|----------|------|------------|--------|----|
| Đơn mua hàng | `/orders` | ✓ | `/:refId` | ✓ | — |
| **Mua hàng** | `/vouchers` | ✓ | `/:refId` | ✓ | **✓** |
| **Trả lại MH** | `/returns` | ✓ | `/:refId` | ✓ | **✓** |
| **Mua dịch vụ** | `/services` | ✓ | `/:refId` | ✓ | **✓** |
| Nhận hóa đơn | `/invoices` | — | `/:refId` | — | — |
| Giảm giá MH | `/discounts` | — | `/:refId` | — | — |

### 6. Inventory — `/api/inventory` (15)

| Module | GET list | POST | GET detail | DELETE | GL |
|--------|----------|------|------------|--------|----|
| **Nhập kho** | `/inwards` | ✓ | `/:refId` | ✓ | **✓** |
| **Xuất kho** | `/outwards` | ✓ | `/:refId` | ✓ | **✓** |
| **Chuyển kho** | `/transfers` | ✓ | `/:refId` | ✓ | **✓** |
| Lắp ráp | `/assemblies` | — | `/:refId` | — | — |
| Kho | `/stocks` | — | — | — | — |

### 7. Fixed Assets — `/api/fixed-assets` (30)

**TSCĐ**: GET `/assets` | POST | GET `/:id` | PUT `/:id` | DELETE `/:id`
**Loại TSCĐ**: GET `/categories`
**Khấu hao**: GET `/depreciation` | POST | GET `/:refId` | DELETE `/:refId`
**Ghi giảm**: GET `/decrements` | GET `/:refId`
**Đánh giá lại**: GET `/adjustments` | GET `/:refId`
**Điều chuyển**: GET `/transfers` | GET `/:refId`
**CCDC**: GET `/tools` | POST | GET `/:id` | PUT `/:id` | DELETE `/:id`
**Loại CCDC**: GET `/tool-categories`
**Phân bổ CCDC**: GET `/allocations` | POST | GET `/:refId` | DELETE `/:refId`
**Ghi giảm CCDC**: GET `/tool-decrements` | GET `/:refId`
**Điều chuyển CCDC**: GET `/tool-transfers` | GET `/:refId`

### 8. Payroll — `/api/payroll` (10)

| GET | `/employees` | `/vouchers` | `/salary-sheet` | `/salary-sheets` | `/salary-sheets/:refId` |
| GET | `/salary-expenses` | `/timesheets` | `/timesheets/:refId` | `/insurance` | `/pit` |

### 9. Tax — `/api/tax` (5)

| GET | `/vat-input` | `/vat-output` | `/vat-summary` | `/cit` | `/summary` |

### 10. Reports — `/api/reports` (10)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/trial-balance` | Bảng cân đối phát sinh (`?grade=1\|2`) |
| GET | `/income-statement` | Báo cáo KQKD |
| GET | `/balance-sheet` | Bảng CĐKT (`?asOfDate=`) |
| GET | `/cash-flow` | Lưu chuyển tiền tệ |
| GET | `/receivables` | Công nợ phải thu TK 131 |
| GET | `/payables` | Công nợ phải trả TK 331 |
| GET | `/inventory-balance` | Tồn kho TK 152-156 |
| GET | `/revenue-by-period` | Doanh thu theo tháng/quý |
| GET | `/account-ledger` | Sổ chi tiết TK (`?account=` bắt buộc) |
| GET | `/dashboard` | Tổng quan: DT, GV, tiền mặt, tiền NH, phải thu, phải trả |

### 11. Contracts — `/api/contracts` (6)

| GET `/` | POST `/` | GET `/:id` | PUT `/:id` | DELETE `/:id` | GET `/:id/ledger` |

### 12. Budget — `/api/budget` (6)

| GET `/` | POST `/` | GET `/:id` | PUT `/:id` | DELETE `/:id` | GET `/analysis/vs-actual` |

### 13. Loan — `/api/loan` (3)

| GET `/agreements` | GET `/agreements/:id` | GET `/profiles` |

### 14. General — `/api/general` (28)

| Endpoint | Mô tả |
|----------|-------|
| `/prepaid-expenses`, `/:id` | Chi phí trả trước |
| `/deferred-revenue` | Doanh thu chưa thực hiện |
| `/jobs`, `/:id` | Đối tượng THCP |
| `/projects`, `/:id` | Công trình / Dự án |
| `/expense-items` | Khoản mục chi phí |
| `/opening-accounts` | Số dư đầu kỳ TK |
| `/opening-inventory` | Số dư đầu kỳ kho |
| `/budget-items` | Mục ngân sách |
| `/banks` | DS ngân hàng |
| `/exchange-rates` | Tỷ giá |
| `/purchase-contracts`, `/:id` | Hợp đồng mua |
| `/sale-policies` | Chính sách giá |
| `/sale-groups` | Nhóm bán hàng |
| `/production-orders`, `/:refId` | Lệnh sản xuất |
| `/investment-projects` | Dự án đầu tư |
| `/debt-periods` | Kỳ công nợ |
| `/debt-lists` | DS công nợ |
| `/bank-reconcile` | Đối chiếu ngân hàng |
| `/inventory-ledger` | Sổ kho |
| `/fixed-asset-ledger` | Sổ TSCĐ |
| `/sale-ledger` | Sổ bán hàng |
| `/purchase-ledger` | Sổ mua hàng |
| `/locations` | Địa điểm |

### 15. Costing — `/api/costing` (14)

| Endpoint | Mô tả |
|----------|-------|
| `/periods`, `/:refId` | Kỳ tính giá thành |
| `/opening` | Dở dang đầu kỳ |
| `/cost-vouchers` | Chứng từ giá thành |
| `/allocation-expenses`, `/:refId` | Phân bổ chi phí |
| `/allocation-quantum` | Phân bổ định mức |
| `/expense-transfers`, `/:refId` | Kết chuyển chi phí |
| `/accepted`, `/:refId` | Nghiệm thu |
| `/uncomplete` | Dở dang cuối kỳ |
| `/product-cost` | Chi tiết giá thành SP |
| `/product-quantum` | Định mức NVL |

### 16. Audit — `/api/audit` (8)

| GET | `/cash`, `/:refId` | Kiểm kê quỹ |
| GET | `/inventory`, `/:refId` | Kiểm kê kho |
| GET | `/fixed-assets`, `/:refId` | Kiểm kê TSCĐ |
| GET | `/tools`, `/:refId` | Kiểm kê CCDC |

---

## ReasonTypeID (Lý do thu/chi)

| ID | Loại |
|----|------|
| 13 | Thu tiền khách hàng |
| 23 | Chi trả nhà cung cấp |
| 34 | Thu tiền gửi ngân hàng |
| 43 | Chi tiền gửi ngân hàng |

---

## RefType (Loại chứng từ)

| Code | Loại |
|------|------|
| 1010 | Phiếu thu |
| 1020 | Phiếu chi |
| 1500 | Thu tiền gửi |
| 1510 | Ủy nhiệm chi |
| 1560 | Chuyển tiền nội bộ |
| 250 | Ghi tăng TSCĐ |
| 254 | Khấu hao |
| 301 | Đơn mua hàng |
| 302 | Mua hàng |
| 330 | Mua dịch vụ |
| 3030 | Trả lại hàng mua |
| 3510 | Báo giá |
| 3520 | Đơn đặt hàng |
| 3530 | Bán hàng |
| 3540 | Trả lại hàng bán |
| 3550 | Giảm giá bán hàng |
| 3560 | Hóa đơn |
| 4011 | CT nghiệp vụ khác |
| 450 | Ghi tăng CCDC |

---

## Endpoint Summary

| # | Module | Prefix | Endpoints |
|---|--------|--------|-----------|
| 1 | System | `/api/system` | 5 |
| 2 | Dictionary | `/api/dictionary` | 19 |
| 3 | Journal | `/api/journal` | 26 |
| 4 | Sales | `/api/sales` | 24 |
| 5 | Purchase | `/api/purchase` | 20 |
| 6 | Inventory | `/api/inventory` | 15 |
| 7 | Fixed Assets | `/api/fixed-assets` | 30 |
| 8 | Payroll | `/api/payroll` | 10 |
| 9 | Tax | `/api/tax` | 5 |
| 10 | Reports | `/api/reports` | 10 |
| 11 | Contracts | `/api/contracts` | 6 |
| 12 | Budget | `/api/budget` | 6 |
| 13 | Loan | `/api/loan` | 3 |
| 14 | General | `/api/general` | 28 |
| 15 | Costing | `/api/costing` | 14 |
| 16 | Audit | `/api/audit` | 8 |
| | **TỔNG** | | **229** |

---

## Production

| Item | Value |
|------|-------|
| Server | `192.168.99.216:3004` |
| DB | `HAG2026 @ 192.168.99.200\MISASME2026` |
| Data | 134,924 chứng từ, 12,565 hàng hóa, 1,636 KH/NCC |
| Pool | 50 connections |
| Cluster | Multi-core support (`npm run start:cluster`) |
| Compression | Gzip (giảm 86% response size) |
| Rate Limit | 1000 req/15min/IP |

Tested: 11/11 voucher types = **0 missing fields** vs MISA desktop.
