# MISA SME 2026 — REST API Documentation

**Base URL**: `http://localhost:3003`
**Swagger UI**: `http://localhost:3003/docs`

---

## Setup

```bash
# Install
npm install

# Configure .env
PORT=3003
SQL_INSTANCE=192.168.1.232\\MISASME2026   # hoặc .\\MISASME2026
SQL_DATABASE=MISASME2026SampleTT133
SQL_AUTH=windows                           # windows | sql
SQL_USERNAME=                              # cho SQL Auth
SQL_PASSWORD=
API_KEYS=misa-api-key-2026                 # comma-separated
JWT_SECRET=change-me

# Start
npm start          # production
npm run dev        # hot-reload
```

---

## Authentication

| Mode | Header | Ví dụ |
|------|--------|-------|
| API Key | `Authorization: ApiKey <key>` | `ApiKey misa-api-key-2026` |
| JWT | `Authorization: Bearer <token>` | `Bearer eyJ...` |

Auth bắt buộc trên tất cả `/api/*` endpoints.

---

## Multi-tenant / Remote SQL

Mỗi request có thể chọn SQL Server + database khác qua headers:

| Header | Mô tả | Ví dụ |
|--------|-------|-------|
| `X-SQL-Instance` | SQL Server instance | `192.168.1.100\MISASME2026` |
| `X-SQL-Database` | Database name | `CompanyDB2026` |
| `X-SQL-Auth` | Auth mode | `windows` hoặc `sql` |
| `X-SQL-Username` | SQL username (khi auth=sql) | `sa` |
| `X-SQL-Password` | SQL password | `MyPass123` |

Không truyền → dùng default từ `.env`.

```bash
# Ví dụ: kết nối SQL Server khác qua IP
curl -H "Authorization: ApiKey misa-api-key-2026" \
  -H "X-SQL-Instance: 10.0.0.50\\MISASME2026" \
  -H "X-SQL-Database: HaiAnh2026" \
  -H "X-SQL-Auth: sql" \
  -H "X-SQL-Username: sa" \
  -H "X-SQL-Password: password123" \
  http://localhost:3003/api/system/health
```

---

## Response Format

```json
// Success
{
  "success": true,
  "data": { ... },
  "pagination": { "page": 1, "pageSize": 20, "totalCount": 137, "totalPages": 7 }
}

// Error
{
  "success": false,
  "error": { "code": "NOT_FOUND", "message": "..." }
}
```

### Error Codes

| HTTP | Code | Khi nào |
|------|------|---------|
| 400 | VALIDATION_ERROR | Invalid GUID, date, JSON |
| 400 | MISSING_DATABASE | Thiếu database (header + env đều rỗng) |
| 400 | MISSING_CREDENTIALS | SQL Auth thiếu username |
| 401 | AUTH_REQUIRED | Thiếu auth header |
| 401 | AUTH_INVALID | Sai API key / JWT |
| 401 | SQL_AUTH_FAILED | Sai SQL credentials hoặc connection failed |
| 404 | NOT_FOUND | Không tìm thấy |
| 409 | DUPLICATE | Trùng key |
| 409 | CONSTRAINT_ERROR | Vi phạm FK |
| 422 | VALIDATION_ERROR | Thiếu required field, TotalAmount không khớp details |
| 500 | INTERNAL_ERROR | Lỗi server |
| 503 | SQL_CONNECTION_FAILED | Không kết nối được SQL Server |

---

## Pagination & Filtering

Áp dụng cho tất cả list endpoints:

| Param | Type | Default | Mô tả |
|-------|------|---------|-------|
| `page` | int | 1 | Trang |
| `pageSize` | int | 20 | Số record/trang (max 200) |
| `sortBy` | string | RefDate | Sort column (allowlist validated) |
| `sortDir` | string | DESC | ASC / DESC |
| `search` | string | | Tìm kiếm trên RefNo, JournalMemo, Code, Name |
| `dateFrom` | string | | `YYYY-MM-DD` |
| `dateTo` | string | | `YYYY-MM-DD` |
| `isPosted` | bool | | Filter đã ghi sổ |
| `refType` | int | | Filter theo loại chứng từ |

---

## 1. System — `/api/system`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/health` | Health check + DB status |
| GET | `/ref-types` | Danh sách SYSRefType |
| GET | `/branches` | Chi nhánh / phòng ban |
| GET | `/databases` | Danh sách databases trên SQL instance |
| GET | `/tables` | Danh sách tables trong database hiện tại |

---

## 2. Dictionary — `/api/dictionary`

### Account Objects (Khách hàng / NCC / Nhân viên)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/account-objects` | List (`?search=`, `?type=0\|1\|2`) |
| GET | `/account-objects/:id` | Chi tiết |
| POST | `/account-objects` | Tạo mới |
| PUT | `/account-objects/:id` | Cập nhật |
| DELETE | `/account-objects/:id` | Xóa |

```json
// POST body
{
  "AccountObjectCode": "KH001",
  "AccountObjectName": "Công ty ABC",
  "AccountObjectType": 0,         // 0=KH, 1=NCC, 2=NV
  "Address": "123 ABC St",
  "Tel": "0901234567",
  "CompanyTaxCode": "1234567890"
}
```

### Inventory Items (Hàng hóa / Vật tư / Dịch vụ)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/inventory-items` | List (`?search=`) |
| GET | `/inventory-items/:id` | Chi tiết |
| POST | `/inventory-items` | Tạo mới |
| PUT | `/inventory-items/:id` | Cập nhật |
| DELETE | `/inventory-items/:id` | Xóa |

### Other Dictionaries (Read-only)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/accounts` | Hệ thống tài khoản |
| GET | `/accounts/:accountNumber` | Chi tiết 1 tài khoản |
| GET | `/employees` | Nhân viên |
| GET | `/organization-units` | Chi nhánh / phòng ban |
| GET | `/bank-accounts` | Tài khoản ngân hàng |
| GET | `/units` | Đơn vị tính |
| GET | `/inventory-categories` | Nhóm hàng hóa |
| GET | `/payment-terms` | Điều khoản thanh toán |
| GET | `/currencies` | Loại tiền |

---

## 3. Journal — `/api/journal`

### General Ledger

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/general-ledger` | Query sổ cái (`?account=`, `?dateFrom=`, `?dateTo=`) |
| GET | `/account-balance` | Số dư TK (`?account=` **bắt buộc**) |

### GL Voucher (CT nghiệp vụ khác) — CRUD + GL

| GET | `/gl-vouchers` | POST | `/gl-vouchers` | GET | `/gl-vouchers/:refId` | DELETE | `/gl-vouchers/:refId` |

### Cash Receipts (Phiếu thu) — CRUD + GL

| GET | `/cash/receipts` | POST | `/cash/receipts` | GET | `/cash/receipts/:refId` | DELETE | `/cash/receipts/:refId` |

### Cash Payments (Phiếu chi) — CRUD + GL

| GET | `/cash/payments` | POST | `/cash/payments` | GET | `/cash/payments/:refId` | DELETE | `/cash/payments/:refId` |

### Bank Deposits (Thu tiền gửi) — CRUD + GL

| GET | `/bank/deposits` | POST | `/bank/deposits` | GET | `/bank/deposits/:refId` | DELETE | `/bank/deposits/:refId` |

### Bank Withdrawals (Ủy nhiệm chi) — CRUD + GL

| GET | `/bank/withdrawals` | POST | `/bank/withdrawals` | GET | `/bank/withdrawals/:refId` | DELETE | `/bank/withdrawals/:refId` |

### Bank Internal Transfers (Chuyển tiền nội bộ) — CRUD + GL

| GET | `/bank/internal-transfers` | POST | `/bank/internal-transfers` | GET | `/bank/internal-transfers/:refId` | DELETE | `/bank/internal-transfers/:refId` |

### Voucher POST body (áp dụng cho tất cả loại chứng từ)

```json
{
  "JournalMemo": "Mô tả chứng từ",
  "AccountObjectID": "guid",
  "AccountObjectName": "Tên KH/NCC",
  "TotalAmount": 10000000,
  "CurrencyID": "VND",
  "ExchangeRate": 1,
  "details": [
    {
      "DebitAccount": "1111",
      "CreditAccount": "131",
      "Amount": 10000000,
      "AmountOC": 10000000,
      "Quantity": 100,
      "UnitPrice": 100000,
      "InventoryItemID": "guid",
      "AccountObjectID": "guid",
      "Description": "Mô tả dòng"
    }
  ]
}
```

> **Lưu ý**: `InventoryItemID` bắt buộc cho SA/PU/IN detail lines (FK NOT NULL). Detail `Amount` tổng phải = `TotalAmount`.

---

## 4. Sales — `/api/sales`

| Module | Endpoint prefix | CRUD | GL Posting |
|--------|----------------|------|------------|
| Báo giá | `/quotes` | GET, POST, GET/:id, DELETE/:id | Không |
| Đơn đặt hàng | `/orders` | GET, POST, GET/:id, DELETE/:id | Không |
| **Bán hàng** | `/vouchers` | GET, POST, GET/:id, DELETE/:id | **Có** |
| Hóa đơn | `/invoices` | GET, POST, GET/:id, DELETE/:id | Không |
| **Giảm giá BH** | `/discounts` | GET, POST, GET/:id, DELETE/:id | **Có** |
| **Trả lại hàng bán** | `/returns` | GET, POST, GET/:id, DELETE/:id | **Có** |

Bán hàng POST body bổ sung: `TotalSaleAmount`, `TotalVATAmount`, `TotalDiscountAmount`.

---

## 5. Purchase — `/api/purchase`

| Module | Endpoint prefix | CRUD | GL Posting |
|--------|----------------|------|------------|
| Đơn mua hàng | `/orders` | GET, POST, GET/:id, DELETE/:id | Không |
| **Mua hàng** | `/vouchers` | GET, POST, GET/:id, DELETE/:id | **Có** |
| **Trả lại hàng mua** | `/returns` | GET, POST, GET/:id, DELETE/:id | **Có** |
| **Mua dịch vụ** | `/services` | GET, POST, GET/:id, DELETE/:id | **Có** |
| Nhận hóa đơn | `/invoices` | GET, GET/:id | Read-only |
| Giảm giá MH | `/discounts` | GET, GET/:id | Read-only |

---

## 6. Inventory — `/api/inventory`

| Module | Endpoint prefix | CRUD | GL Posting |
|--------|----------------|------|------------|
| **Nhập kho** | `/inwards` | GET, POST, GET/:id, DELETE/:id | **Có** |
| **Xuất kho** | `/outwards` | GET, POST, GET/:id, DELETE/:id | **Có** |
| **Chuyển kho** | `/transfers` | GET, POST, GET/:id, DELETE/:id | **Có** |
| Lắp ráp/Tháo dỡ | `/assemblies` | GET, GET/:id | Read-only |
| Kho | `/stocks` | GET | Read-only |

---

## 7. Fixed Assets — `/api/fixed-assets`

| Module | Endpoint prefix | CRUD |
|--------|----------------|------|
| Tài sản CĐ | `/assets` | GET, POST, PUT/:id, DELETE/:id, GET/:id |
| Loại TSCĐ | `/categories` | GET |
| Khấu hao | `/depreciation` | GET, POST, GET/:id, DELETE/:id |
| Ghi giảm | `/decrements` | GET, GET/:id |
| Đánh giá lại | `/adjustments` | GET, GET/:id |
| Điều chuyển | `/transfers` | GET, GET/:id |
| CCDC | `/tools` | GET, POST, PUT/:id, DELETE/:id, GET/:id |
| Phân bổ CCDC | `/allocations` | GET, POST, GET/:id, DELETE/:id |
| Ghi giảm CCDC | `/tool-decrements` | GET, GET/:id |
| Điều chuyển CCDC | `/tool-transfers` | GET, GET/:id |
| Loại CCDC | `/tool-categories` | GET |

---

## 8. Payroll — `/api/payroll`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/employees` | DS nhân viên (`?search=`, `?departmentId=`) |
| GET | `/vouchers` | Chứng từ lương |
| GET | `/salary-sheet` | Bảng lương (`?month=`, `?year=`) |
| GET | `/salary-sheets` | DS bảng lương chính thức |
| GET | `/salary-sheets/:refId` | Chi tiết bảng lương |
| GET | `/salary-expenses` | Phân bổ chi phí lương |
| GET | `/timesheets` | Bảng chấm công |
| GET | `/timesheets/:refId` | Chi tiết chấm công |
| GET | `/insurance` | BHXH/BHYT/BHTN (`?month=`, `?year=`) |
| GET | `/pit` | Thuế TNCN |

---

## 9. Tax — `/api/tax`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/vat-input` | Thuế GTGT đầu vào (TK 133) |
| GET | `/vat-output` | Thuế GTGT đầu ra (TK 3331) |
| GET | `/vat-summary` | Tổng hợp VAT |
| GET | `/cit` | Thuế TNDN (TK 3334) |
| GET | `/summary` | Tổng hợp thuế (TK 333x) |

---

## 10. Reports — `/api/reports`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/trial-balance` | Bảng cân đối phát sinh (`?grade=1\|2`) |
| GET | `/income-statement` | Báo cáo KQKD |
| GET | `/balance-sheet` | Bảng CĐKT (`?asOfDate=`) |
| GET | `/cash-flow` | Lưu chuyển tiền tệ |
| GET | `/receivables` | Công nợ phải thu TK 131 |
| GET | `/payables` | Công nợ phải trả TK 331 |
| GET | `/inventory-balance` | Tồn kho TK 152/153/155/156 |
| GET | `/revenue-by-period` | Doanh thu theo kỳ (`?groupBy=month\|quarter`) |
| GET | `/account-ledger` | Sổ chi tiết TK (`?account=` **bắt buộc**) |
| GET | `/dashboard` | Tổng quan (`?year=`) |

---

## 11. Contracts — `/api/contracts`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | List (`?search=`, `?status=`) |
| GET | `/:id` | Chi tiết |
| POST | `/` | Tạo mới |
| PUT | `/:id` | Cập nhật |
| DELETE | `/:id` | Xóa |
| GET | `/:id/ledger` | GL entries liên quan |

---

## 12. Budget — `/api/budget`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | List (`?year=`) |
| GET | `/:id` | Chi tiết + details |
| POST | `/` | Tạo mới |
| PUT | `/:id` | Cập nhật |
| DELETE | `/:id` | Xóa |
| GET | `/analysis/vs-actual` | So sánh ngân sách vs thực tế |

---

## 13. Loan — `/api/loan`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/agreements` | DS hợp đồng vay / khế ước |
| GET | `/agreements/:id` | Chi tiết |
| GET | `/profiles` | Loan profiles |

---

## 14. General — `/api/general`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/prepaid-expenses` | Chi phí trả trước |
| GET | `/prepaid-expenses/:id` | Chi tiết |
| GET | `/deferred-revenue` | Doanh thu chưa thực hiện |
| GET | `/jobs` | Đối tượng THCP |
| GET | `/jobs/:id` | Chi tiết |
| GET | `/projects` | Công trình / Dự án |
| GET | `/projects/:id` | Chi tiết |
| GET | `/expense-items` | Khoản mục chi phí |
| GET | `/opening-accounts` | Số dư đầu kỳ TK |
| GET | `/opening-inventory` | Số dư đầu kỳ kho |
| GET | `/budget-items` | Mục ngân sách |
| GET | `/banks` | Ngân hàng master |
| GET | `/exchange-rates` | Tỷ giá |
| GET | `/purchase-contracts` | Hợp đồng mua |
| GET | `/purchase-contracts/:id` | Chi tiết |
| GET | `/sale-policies` | Chính sách giá |
| GET | `/sale-groups` | Nhóm bán hàng |
| GET | `/production-orders` | Lệnh sản xuất |
| GET | `/production-orders/:refId` | Chi tiết |
| GET | `/investment-projects` | Dự án đầu tư |
| GET | `/debt-periods` | Kỳ công nợ |
| GET | `/debt-lists` | DS công nợ |
| GET | `/bank-reconcile` | Đối chiếu ngân hàng |
| GET | `/inventory-ledger` | Sổ phụ kho |
| GET | `/fixed-asset-ledger` | Sổ phụ TSCĐ |
| GET | `/sale-ledger` | Sổ phụ bán hàng |
| GET | `/purchase-ledger` | Sổ phụ mua hàng |
| GET | `/locations` | Địa điểm |

---

## 15. Costing — `/api/costing`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/periods` | Kỳ tính giá thành |
| GET | `/periods/:refId` | Chi tiết |
| GET | `/opening` | Dở dang đầu kỳ |
| GET | `/cost-vouchers` | Chứng từ giá thành |
| GET | `/allocation-expenses` | Phân bổ chi phí |
| GET | `/allocation-expenses/:refId` | Chi tiết |
| GET | `/allocation-quantum` | Phân bổ định mức |
| GET | `/expense-transfers` | Kết chuyển chi phí |
| GET | `/expense-transfers/:refId` | Chi tiết |
| GET | `/accepted` | Nghiệm thu |
| GET | `/accepted/:refId` | Chi tiết |
| GET | `/uncomplete` | Dở dang cuối kỳ |
| GET | `/product-cost` | Chi tiết giá thành SP |
| GET | `/product-quantum` | Định mức NVL |

---

## 16. Audit — `/api/audit`

| Module | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/cash` | Kiểm kê quỹ |
| GET | `/cash/:refId` | Chi tiết |
| GET | `/inventory` | Kiểm kê kho |
| GET | `/inventory/:refId` | Chi tiết |
| GET | `/fixed-assets` | Kiểm kê TSCĐ |
| GET | `/fixed-assets/:refId` | Chi tiết |
| GET | `/tools` | Kiểm kê CCDC |
| GET | `/tools/:refId` | Chi tiết |

---

## Voucher Flow

**Tạo (POST)**:
1. Auto-generate GUID → `RefID`
2. Auto-increment từ `SYSAutoID` → `RefNo` / `RefNoFinance`
3. Default `BranchID` từ `OrganizationUnit`
4. Validate: `SUM(details.Amount) == TotalAmount`
5. Insert master → Insert details → Post GL (nếu có)
6. Toàn bộ trong 1 SQL transaction

**Xóa (DELETE)**:
1. Unpost GL → Delete details → Delete master
2. Atomic transaction, rollback nếu lỗi

---

## Endpoint Summary

| # | Module | Prefix | Endpoints | Ghi chú |
|---|--------|--------|-----------|---------|
| 1 | System | `/api/system` | 5 | Read |
| 2 | Dictionary | `/api/dictionary` | 19 | Full CRUD |
| 3 | Journal | `/api/journal` | 26 | CRUD + GL |
| 4 | Sales | `/api/sales` | 24 | CRUD + GL |
| 5 | Purchase | `/api/purchase` | 20 | CRUD + GL |
| 6 | Inventory | `/api/inventory` | 15 | CRUD + GL |
| 7 | Fixed Assets | `/api/fixed-assets` | 30 | CRUD + GL |
| 8 | Payroll | `/api/payroll` | 10 | Read |
| 9 | Tax | `/api/tax` | 5 | Read |
| 10 | Reports | `/api/reports` | 10 | Read |
| 11 | Contracts | `/api/contracts` | 6 | Full CRUD |
| 12 | Budget | `/api/budget` | 6 | Full CRUD |
| 13 | Loan | `/api/loan` | 3 | Read |
| 14 | General | `/api/general` | 28 | Read |
| 15 | Costing | `/api/costing` | 14 | Read |
| 16 | Audit | `/api/audit` | 8 | Read |
| | **TỔNG** | | **229** | |
