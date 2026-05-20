import swaggerJsdoc from 'swagger-jsdoc';

const idParam = (name = 'id') => ({ in: 'path' as const, name, required: true, schema: { type: 'string', format: 'uuid' } });
const refIdParam = idParam('refId');
const paged = [
  { $ref: '#/components/parameters/page' }, { $ref: '#/components/parameters/pageSize' },
  { $ref: '#/components/parameters/search' },
];
const pagedDated = [
  ...paged, { $ref: '#/components/parameters/dateFrom' }, { $ref: '#/components/parameters/dateTo' },
];
const ok = { 200: { description: 'Thành công', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } }, 401: { $ref: '#/components/responses/Unauthorized' }, 500: { $ref: '#/components/responses/ServerError' } };
const created = { 201: { description: 'Tạo thành công', content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateResponse' } } } }, 422: { $ref: '#/components/responses/ValidationError' }, 401: { $ref: '#/components/responses/Unauthorized' } };

function bodyRef(schemaName: string) {
  return { content: { 'application/json': { schema: { $ref: `#/components/schemas/${schemaName}` } } } };
}

// Voucher CRUD paths with specific summaries
function voucherCrud(prefix: string, tag: string, nameVi: string, opts: { post?: boolean; postGL?: boolean; bodySchema?: string } = {}) {
  const hasPost = opts.post !== false;
  const postGL = opts.postGL !== false;
  const schema = opts.bodySchema || 'VoucherCreate';
  const paths: Record<string, any> = {};
  paths[`${prefix}`] = {
    get: { tags: [tag], summary: `Danh sách ${nameVi}`, parameters: pagedDated, responses: ok },
    ...(hasPost ? { post: { tags: [tag], summary: `Tạo ${nameVi}${postGL ? ' + ghi sổ GL' : ''}`, requestBody: bodyRef(schema), responses: created } } : {}),
  };
  paths[`${prefix}/{refId}`] = {
    get: { tags: [tag], summary: `Chi tiết ${nameVi}`, parameters: [refIdParam], responses: ok },
    ...(hasPost ? { delete: { tags: [tag], summary: `Xóa ${nameVi}${postGL ? ' + gỡ GL' : ''}`, parameters: [refIdParam], responses: ok } } : {}),
  };
  return paths;
}

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MISA SME 2026 API',
      version: '4.0.0',
      description: `REST API kết nối trực tiếp database MISA SME 2026. Địt Nhau Với Misa Vãi Lồn

---

# HƯỚNG DẪN NHANH ĐỊT NHAU VỚI MISA

## Bước 0: Headers bắt buộc cho MỌI request
\`\`\`
Authorization: ApiKey misa-api-key-2026
X-SQL-Instance: 192.168.99.200\\\\MISASME2026
X-SQL-Database: HAG2026
X-SQL-Auth: sql
X-SQL-Username: sa
X-SQL-Password: 123456789A@
\`\`\`

## Bước 1: Tìm ID khách hàng/NCC
**KHÔNG ĐƯỢC truyền tên text.** Phải tìm UUID ID trước.

\`\`\`bash
# Tìm khách hàng (type=1)
curl http://192.168.99.216:3004/api/dictionary/account-objects?type=1&search=GHTK \\
  -H "Authorization: ApiKey misa-api-key-2026" \\
  -H "X-SQL-Instance: 192.168.99.200\\\\MISASME2026" \\
  -H "X-SQL-Database: HAG2026" \\
  -H "X-SQL-Auth: sql" -H "X-SQL-Username: sa" -H "X-SQL-Password: 123456789A@"

# Response → lấy AccountObjectID:
# "AccountObjectID": "0DF5DAE9-FFB1-412A-B19F-5E4467AE7FEB"
\`\`\`

\`\`\`bash
# Tìm NCC (type=0)
curl http://192.168.99.216:3004/api/dictionary/account-objects?type=0&search=Binh+Duong \\
  -H "Authorization: ApiKey misa-api-key-2026" ...
\`\`\`

## Bước 2: Tìm ID hàng hóa (nếu cần cho SA/PU/IN)
\`\`\`bash
curl http://192.168.99.216:3004/api/dictionary/inventory-items?search=POLO \\
  -H "Authorization: ApiKey misa-api-key-2026" ...

# Response → lấy:
# "InventoryItemID": "0599D9EA-49FB-4441-8B9B-5AC17ED9AED9"
# "UnitID": "3A3D4460-F54B-46B5-A26A-CD416A020FA7"  (đơn vị tính)
\`\`\`

## Bước 3: Tìm ID kho (nếu cần)
\`\`\`bash
curl http://192.168.99.216:3004/api/inventory/stocks \\
  -H "Authorization: ApiKey misa-api-key-2026" ...

# Response → lấy:
# "StockID": "0D83E65A-D5E3-4E2F-8FC9-B01B5B738D24"
\`\`\`

## Bước 4: Tìm ID tài khoản ngân hàng (nếu cần cho BA)
\`\`\`bash
curl http://192.168.99.216:3004/api/dictionary/bank-accounts \\
  -H "Authorization: ApiKey misa-api-key-2026" ...

# Response → lấy:
# "BankAccountID": "BE40299A-E40B-401F-A9F3-2D5DA7A0A676"
\`\`\`

---

# VÍ DỤ ĐẦY ĐỦ — COPY PASTE

## Tạo PHIẾU CHI
\`\`\`bash
curl -X POST http://192.168.99.216:3004/api/journal/cash/payments \\
  -H "Content-Type: application/json" \\
  -H "Authorization: ApiKey misa-api-key-2026" \\
  -H "X-SQL-Instance: 192.168.99.200\\\\MISASME2026" \\
  -H "X-SQL-Database: HAG2026" \\
  -H "X-SQL-Auth: sql" \\
  -H "X-SQL-Username: sa" \\
  -H "X-SQL-Password: 123456789A@" \\
  -d '{
    "JournalMemo": "Chi tra tien NCC ABC",
    "TotalAmount": 5000000,
    "AccountObjectID": "3A848988-EDFE-4726-AA93-D13D5EC958FB",
    "ReasonTypeID": 23,
    "details": [{
      "DebitAccount": "331",
      "CreditAccount": "1111",
      "Amount": 5000000,
      "Description": "Tra tien mua NVL"
    }]
  }'
\`\`\`

## Tạo ỦY NHIỆM CHI
\`\`\`bash
curl -X POST http://192.168.99.216:3004/api/journal/bank/withdrawals \\
  -H "Content-Type: application/json" \\
  -H "Authorization: ApiKey misa-api-key-2026" \\
  -H "X-SQL-Instance: 192.168.99.200\\\\MISASME2026" \\
  -H "X-SQL-Database: HAG2026" \\
  -H "X-SQL-Auth: sql" \\
  -H "X-SQL-Username: sa" \\
  -H "X-SQL-Password: 123456789A@" \\
  -d '{
    "JournalMemo": "UNC tra tien NCC",
    "TotalAmount": 10000000,
    "AccountObjectID": "3A848988-EDFE-4726-AA93-D13D5EC958FB",
    "BankAccountID": "BE40299A-E40B-401F-A9F3-2D5DA7A0A676",
    "ReasonTypeID": 43,
    "details": [{
      "DebitAccount": "331",
      "CreditAccount": "1121",
      "Amount": 10000000
    }]
  }'
\`\`\`

## Tạo BÁN HÀNG (có hàng hóa)
\`\`\`bash
curl -X POST http://192.168.99.216:3004/api/sales/vouchers \\
  -H "Content-Type: application/json" \\
  -H "Authorization: ApiKey misa-api-key-2026" \\
  -H "X-SQL-Instance: 192.168.99.200\\\\MISASME2026" \\
  -H "X-SQL-Database: HAG2026" \\
  -H "X-SQL-Auth: sql" \\
  -H "X-SQL-Username: sa" \\
  -H "X-SQL-Password: 123456789A@" \\
  -d '{
    "JournalMemo": "Ban hang cho GHTK",
    "TotalAmount": 500000,
    "AccountObjectID": "0DF5DAE9-FFB1-412A-B19F-5E4467AE7FEB",
    "details": [{
      "DebitAccount": "131",
      "CreditAccount": "51115",
      "Amount": 500000,
      "InventoryItemID": "0599D9EA-49FB-4441-8B9B-5AC17ED9AED9",
      "StockID": "0D83E65A-D5E3-4E2F-8FC9-B01B5B738D24",
      "UnitID": "3A3D4460-F54B-46B5-A26A-CD416A020FA7",
      "Quantity": 10,
      "UnitPrice": 50000,
      "SaleQuantity": 10,
      "SaleAmount": 500000,
      "SaleAmountOC": 500000,
      "Description": "POLO x10"
    }]
  }'
\`\`\`

## Tạo MUA HÀNG
\`\`\`bash
curl -X POST http://192.168.99.216:3004/api/purchase/vouchers \\
  -H "Content-Type: application/json" \\
  -H "Authorization: ApiKey misa-api-key-2026" \\
  -H "X-SQL-Instance: 192.168.99.200\\\\MISASME2026" \\
  -H "X-SQL-Database: HAG2026" \\
  -H "X-SQL-Auth: sql" \\
  -H "X-SQL-Username: sa" \\
  -H "X-SQL-Password: 123456789A@" \\
  -d '{
    "JournalMemo": "Mua NVL tu NCC",
    "TotalAmount": 300000,
    "AccountObjectID": "B5C8EF7D-4476-47B9-B7D4-42CB9BD87C2C",
    "details": [{
      "DebitAccount": "1561",
      "CreditAccount": "331",
      "Amount": 300000,
      "InventoryItemID": "72817271-ADFB-4618-A4AA-4F84C663072F",
      "StockID": "0D83E65A-D5E3-4E2F-8FC9-B01B5B738D24",
      "UnitID": "71112249-98CE-4334-A06D-34736155FA35",
      "Quantity": 15,
      "UnitPrice": 20000,
      "PurchaseQuantity": 15,
      "PurchaseAmount": 300000,
      "PurchaseAmountOC": 300000,
      "Description": "NVL xi mang x15"
    }]
  }'
\`\`\`

## Xóa chứng từ
\`\`\`bash
curl -X DELETE http://192.168.99.216:3004/api/journal/cash/payments/{RefID} \\
  -H "Authorization: ApiKey misa-api-key-2026" \\
  -H "X-SQL-Instance: 192.168.99.200\\\\MISASME2026" ...
\`\`\`

---

# GHI NHỚ

| Truyền gì | Lấy ở đâu | Ví dụ |
|-----------|-----------|-------|
| \`AccountObjectID\` | \`GET /dictionary/account-objects?type=1\` (KH) hoặc \`?type=0\` (NCC) | \`3A848988-...\` |
| \`BankAccountID\` | \`GET /dictionary/bank-accounts\` | \`BE40299A-...\` |
| \`InventoryItemID\` | \`GET /dictionary/inventory-items\` | \`0599D9EA-...\` |
| \`StockID\` | \`GET /inventory/stocks\` | \`0D83E65A-...\` |
| \`UnitID\` | \`GET /dictionary/units\` hoặc trong InventoryItem response | \`3A3D4460-...\` |

**KHÔNG BAO GIỜ** truyền text name. LUÔN truyền UUID ID. API tự fill tên.

---

## Tính năng
- **240+ endpoints** — 16 modules kế toán đầy đủ
- **CRUD + GL Posting** — Tạo chứng từ tự động ghi sổ cái + list tables (MISA desktop hiện đúng)
- **130+ RefType sub-types** — Hỗ trợ tất cả loại chứng từ con trong MISA
- **Auto-fill** — Truyền AccountObjectID → tự fill Name, Address, TaxCode, ContactName
- **Auto-fill BankAccount** — Truyền BankAccountID → tự fill BankAccountNumber, BankName
- **Auto-fill InventoryItem** — Truyền InventoryItemID → tự fill Code, Name cho SaleLedger/PurchaseLedger
- **RefNo tự động** — Đọc SYSAutoID theo BranchID, prefix đúng chi nhánh
- **Multi-tenant** — Kết nối nhiều SQL Server / database qua headers
- **Generic query** — Đọc bất kỳ 150+ tables qua \`/system/query/:table\`

## Authentication
\`\`\`
Authorization: ApiKey misa-api-key-2026
\`\`\`

## Multi-tenant (Remote SQL)
| Header | Bắt buộc | Mô tả | Ví dụ |
|--------|----------|-------|-------|
| \`X-SQL-Instance\` | Có | SQL Server instance | \`192.168.99.200\\\\MISASME2026\` |
| \`X-SQL-Database\` | Có | Tên database | \`HAG2026\` |
| \`X-SQL-Auth\` | Có | Loại auth | \`sql\` hoặc \`windows\` |
| \`X-SQL-Username\` | Có (sql) | Username | \`sa\` |
| \`X-SQL-Password\` | Có (sql) | Password | \`MyPassword123\` |

## Cách tạo chứng từ (QUAN TRỌNG)

### Bước 1: Chọn endpoint
Mỗi module có endpoint riêng. VD: \`POST /journal/cash/payments\` cho phiếu chi.

### Bước 2: Truyền RefType (tùy chọn)
Mỗi endpoint có RefType mặc định. Muốn tạo loại con khác, truyền \`RefType\` trong body.

**Ví dụ:** Endpoint \`/journal/cash/payments\` mặc định RefType=1020 (Phiếu chi).
Muốn tạo "Phiếu chi trả tiền NCC", truyền \`"RefType": 1021\`.

### Bước 3: Truyền đầy đủ fields
- \`TotalAmount\` — Tổng tiền (BẮT BUỘC)
- \`details\` — Mảng dòng hạch toán (BẮT BUỘC, ít nhất 1 dòng)
- Mỗi dòng detail cần: \`DebitAccount\`, \`CreditAccount\`, \`Amount\`
- Tổng Amount các dòng detail PHẢI = TotalAmount

### Auto-fill (tự điền)
| Truyền | API tự fill |
|--------|-------------|
| \`AccountObjectID\` | AccountObjectName, Address, TaxCode, ContactName |
| \`BankAccountID\` | BankAccountNumber, BankName |
| \`InventoryItemID\` (detail) | InventoryItemCode, InventoryItemName (cho SaleLedger/PurchaseLedger) |

### RefType sub-types đầy đủ

**Tiền mặt (CA):**
| RefType | Tên | Endpoint |
|---------|-----|----------|
| 1010 | Phiếu thu | \`POST /journal/cash/receipts\` |
| 1011 | Phiếu thu tiền mặt KH | \`POST /journal/cash/receipts\` + \`"RefType":1011\` |
| 1013 | Phiếu thu hoàn thuế | \`POST /journal/cash/receipts\` + \`"RefType":1013\` |
| 1020 | Phiếu chi | \`POST /journal/cash/payments\` |
| 1021 | Chi trả tiền NCC | \`POST /journal/cash/payments\` + \`"RefType":1021\` |
| 1022 | Chi nộp thuế | \`POST /journal/cash/payments\` + \`"RefType":1022\` |
| 1025 | Chi nộp bảo hiểm | \`POST /journal/cash/payments\` + \`"RefType":1025\` |
| 1026 | Chi trả lương NV | \`POST /journal/cash/payments\` + \`"RefType":1026\` |

**Ngân hàng (BA):**
| RefType | Tên | Endpoint |
|---------|-----|----------|
| 1500 | Thu tiền gửi | \`POST /journal/bank/deposits\` |
| 1502 | Thu TG từ KH | \`POST /journal/bank/deposits\` + \`"RefType":1502\` |
| 1510 | Ủy nhiệm chi | \`POST /journal/bank/withdrawals\` |
| 1511 | UNC trả tiền NCC | \`POST /journal/bank/withdrawals\` + \`"RefType":1511\` |
| 1512 | Chi TG nộp thuế | \`POST /journal/bank/withdrawals\` + \`"RefType":1512\` |
| 1560 | Chuyển tiền nội bộ | \`POST /journal/bank/internal-transfers\` |

**Kho (IN):**
| RefType | Tên | Endpoint |
|---------|-----|----------|
| 2010 | NK thành phẩm SX | \`POST /inventory/inwards\` + \`"RefType":2010\` |
| 2013 | NK từ hàng bán trả lại | \`POST /inventory/inwards\` + \`"RefType":2013\` |
| 2014 | NK khác (mặc định) | \`POST /inventory/inwards\` |
| 2020 | XK bán hàng (mặc định) | \`POST /inventory/outwards\` |
| 2022 | XK khác | \`POST /inventory/outwards\` + \`"RefType":2022\` |
| 2023 | XK sản xuất | \`POST /inventory/outwards\` + \`"RefType":2023\` |
| 2030 | Chuyển kho | \`POST /inventory/transfers\` |

**Mua hàng (PU):**
| RefType | Tên | Endpoint |
|---------|-----|----------|
| 302 | Mua hàng TN nhập kho chưa TT (mặc định) | \`POST /purchase/vouchers\` |
| 312 | Mua hàng TN ko qua kho chưa TT | \`POST /purchase/vouchers\` + \`"RefType":312\` |
| 318 | Mua hàng NK nhập kho chưa TT | \`POST /purchase/vouchers\` + \`"RefType":318\` |
| 330 | Mua dịch vụ chưa TT | \`POST /purchase/services\` |
| 3030 | Hàng mua trả lại (giảm trừ CN) | \`POST /purchase/returns\` |
| 3040 | Hàng mua giảm giá | \`POST /purchase/discounts\` |

**Bán hàng (SA):**
| RefType | Tên | Endpoint |
|---------|-----|----------|
| 3530 | Bán hàng TN chưa thu tiền (mặc định) | \`POST /sales/vouchers\` |
| 3531 | Bán hàng - Tiền mặt | \`POST /sales/vouchers\` + \`"RefType":3531\` |
| 3532 | Bán hàng xuất khẩu | \`POST /sales/vouchers\` + \`"RefType":3532\` |
| 3540 | Hàng bán trả lại | \`POST /sales/returns\` |
| 3550 | Giảm giá hàng bán | \`POST /sales/discounts\` |
| 3520 | Đơn đặt hàng | \`POST /sales/orders\` |

**Sổ cái (GL):**
| RefType | Tên | Endpoint |
|---------|-----|----------|
| 4010 | CT nghiệp vụ khác (mặc định) | \`POST /journal/gl-vouchers\` |
| 4011 | Khấu trừ thuế | \`POST /journal/gl-vouchers\` + \`"RefType":4011\` |
| 4012 | Kết chuyển lãi lỗ | \`POST /journal/gl-vouchers\` + \`"RefType":4012\` |
| 4014 | Bù trừ công nợ | \`POST /journal/gl-vouchers\` + \`"RefType":4014\` |

Xem đầy đủ 130+ RefTypes tại \`GET /system/ref-types\`
`,
    },
    servers: [{ url: '/api', description: 'MISA SME API Server' }],
    tags: [
      { name: 'System', description: 'Hệ thống — health check, danh sách DB, tables, branches' },
      { name: 'Danh mục', description: 'Khách hàng, NCC, hàng hóa, tài khoản, đơn vị tính, kho...' },
      { name: 'Tiền mặt', description: 'Phiếu thu (CAReceipt), phiếu chi (CAPayment)' },
      { name: 'Ngân hàng', description: 'Thu tiền gửi (BADeposit), ủy nhiệm chi (BAWithDraw), chuyển tiền NB' },
      { name: 'Sổ cái', description: 'General Ledger, CT nghiệp vụ khác (GLVoucher)' },
      { name: 'Bán hàng', description: 'Báo giá → Đơn hàng → Bán hàng → Hóa đơn → Giảm giá → Trả lại' },
      { name: 'Mua hàng', description: 'Đơn mua → Mua hàng → Mua DV → Hóa đơn → Giảm giá → Trả lại' },
      { name: 'Kho', description: 'Nhập kho, xuất kho, chuyển kho, lắp ráp/tháo dỡ' },
      { name: 'TSCĐ', description: 'Tài sản cố định — ghi tăng, khấu hao, điều chuyển, ghi giảm' },
      { name: 'CCDC', description: 'Công cụ dụng cụ — ghi tăng, phân bổ, điều chuyển, ghi giảm' },
      { name: 'Tiền lương', description: 'Bảng lương, chấm công, BHXH, thuế TNCN' },
      { name: 'Thuế', description: 'VAT đầu vào/ra, thuế TNDN, tổng hợp thuế' },
      { name: 'Báo cáo', description: 'CĐPS, KQKD, CĐKT, lưu chuyển tiền, công nợ, tồn kho, dashboard' },
      { name: 'Hợp đồng', description: 'Hợp đồng mua bán' },
      { name: 'Ngân sách', description: 'Ngân sách và so sánh thực tế' },
      { name: 'Khế ước vay', description: 'Hợp đồng vay, khế ước, hồ sơ vay' },
      { name: 'Giá thành', description: 'Kỳ tính giá thành, phân bổ chi phí, nghiệm thu' },
      { name: 'Kiểm kê', description: 'Kiểm kê quỹ, kho, TSCĐ, CCDC' },
      { name: 'Tổng hợp', description: 'Chi phí trả trước, công trình, khoản mục CP, ngân hàng, tỷ giá...' },
      { name: 'Sổ phụ', description: 'Sổ kho, sổ TSCĐ, sổ bán hàng, sổ mua hàng' },
    ],
    components: {
      securitySchemes: {
        ApiKey: { type: 'apiKey', in: 'header', name: 'Authorization', description: 'ApiKey misa-api-key-2026' },
      },
      parameters: {
        page: { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
        pageSize: { in: 'query', name: 'pageSize', schema: { type: 'integer', default: 20, maximum: 200 } },
        sortBy: { in: 'query', name: 'sortBy', schema: { type: 'string' } },
        sortDir: { in: 'query', name: 'sortDir', schema: { type: 'string', enum: ['ASC', 'DESC'], default: 'DESC' } },
        search: { in: 'query', name: 'search', schema: { type: 'string' } },
        dateFrom: { in: 'query', name: 'dateFrom', schema: { type: 'string', format: 'date' } },
        dateTo: { in: 'query', name: 'dateTo', schema: { type: 'string', format: 'date' } },
      },
      responses: {
        Unauthorized: { description: 'Chưa xác thực', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' }, example: { success: false, error: { code: 'AUTH_REQUIRED', message: 'Authorization required' } } } } },
        ValidationError: { description: 'Lỗi validation', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' }, example: { success: false, error: { code: 'VALIDATION_ERROR', message: "Sum of detail amounts (500000) does not match TotalAmount (1000000)." } } } } },
        NotFound: { description: 'Không tìm thấy', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' }, example: { success: false, error: { code: 'NOT_FOUND', message: 'SAVoucher not found' } } } } },
        ServerError: { description: 'Lỗi server', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' }, example: { success: false, error: { code: 'INTERNAL_ERROR', message: 'An internal error occurred.' } } } } },
      },
      schemas: {
        // ── Response Schemas ──
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object', description: 'Dữ liệu trả về (object hoặc array)' },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer', example: 1 },
                pageSize: { type: 'integer', example: 20 },
                totalCount: { type: 'integer', example: 1636 },
                totalPages: { type: 'integer', example: 82 },
              },
            },
          },
        },
        CreateResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                RefID: { type: 'string', format: 'uuid', example: 'A637E8C3-4E18-493C-835C-A967F4CD19E4' },
                RefNo: { type: 'string', example: 'PT00001' },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', enum: ['AUTH_REQUIRED','AUTH_INVALID','NOT_FOUND','VALIDATION_ERROR','DUPLICATE','CONSTRAINT_ERROR','MISSING_DATABASE','MISSING_CREDENTIALS','SQL_AUTH_FAILED','SQL_CONNECTION_FAILED','RATE_LIMITED','INTERNAL_ERROR'] },
                message: { type: 'string' },
                details: { type: 'object', description: 'Chi tiết lỗi (development mode)' },
              },
            },
          },
        },

        // ── Voucher (chứng từ chung — dùng cho CA, BA, GL) ──
        VoucherCreate: {
          type: 'object',
          required: ['TotalAmount', 'details'],
          description: `**Cấu trúc chung cho TẤT CẢ chứng từ.**
Tổng Amount các dòng detail PHẢI bằng TotalAmount, nếu không sẽ lỗi 422.

**Ví dụ phiếu chi:** \`POST /journal/cash/payments\`
\`\`\`json
{
  "RefType": 1020,
  "JournalMemo": "Chi trả tiền NCC ABC",
  "TotalAmount": 5000000,
  "AccountObjectID": "3A848988-EDFE-4726-AA93-D13D5EC958FB",
  "ReasonTypeID": 23,
  "details": [{
    "DebitAccount": "331",
    "CreditAccount": "1111",
    "Amount": 5000000,
    "Description": "Trả tiền mua NVL"
  }]
}
\`\`\`

**Ví dụ ủy nhiệm chi:** \`POST /journal/bank/withdrawals\`
\`\`\`json
{
  "RefType": 1510,
  "JournalMemo": "UNC trả tiền NCC",
  "TotalAmount": 10000000,
  "AccountObjectID": "...",
  "BankAccountID": "BE40299A-E40B-401F-A9F3-2D5DA7A0A676",
  "ReasonTypeID": 43,
  "details": [{
    "DebitAccount": "331",
    "CreditAccount": "1121",
    "Amount": 10000000
  }]
}
\`\`\``,
          properties: {
            RefType: { type: 'integer', description: 'Loại chứng từ con. Mặc định theo endpoint. Truyền để chọn loại con cụ thể (VD: 1021=chi NCC, 1022=chi thuế). Xem GET /system/ref-types', example: 1020 },
            RefDate: { type: 'string', format: 'date', example: '2026-05-20', description: 'Ngày chứng từ. Mặc định = hôm nay. MISA lưu midnight T00:00:00' },
            PostedDate: { type: 'string', format: 'date', description: 'Ngày hạch toán. Mặc định = RefDate' },
            JournalMemo: { type: 'string', example: 'Chi trả tiền NCC Hồng Hà', description: 'Diễn giải chứng từ (hiện trên MISA desktop)' },
            TotalAmount: { type: 'number', example: 5000000, description: 'BẮT BUỘC. Tổng tiền. PHẢI = sum(detail.Amount)' },
            TotalAmountOC: { type: 'number', description: 'Tổng tiền nguyên tệ (mặc định = TotalAmount). Chỉ dùng khi CurrencyID != VND' },
            CurrencyID: { type: 'string', default: 'VND', description: 'Mã tiền tệ. Mặc định VND' },
            ExchangeRate: { type: 'number', default: 1, description: 'Tỷ giá. Mặc định 1 (VND)' },
            AccountObjectID: { type: 'string', format: 'uuid', description: 'ID khách hàng/NCC. Truyền ID → API tự fill Name, Address, TaxCode, ContactName' },
            AccountObjectName: { type: 'string', description: 'Tên KH/NCC (tự fill nếu truyền AccountObjectID)' },
            AccountObjectAddress: { type: 'string', description: 'Địa chỉ (tự fill)' },
            AccountObjectContactName: { type: 'string', description: 'Người liên hệ (tự fill)' },
            BranchID: { type: 'string', format: 'uuid', description: 'Chi nhánh. Mặc định = chi nhánh đầu tiên trong DB' },
            DisplayOnBook: { type: 'integer', enum: [0, 1, 2], default: 0, description: '0=Sổ tài chính, 1=Sổ quản trị, 2=Cả hai' },
            ReasonTypeID: { type: 'integer', description: 'Lý do thu/chi. **CA:** 13=thu KH, 23=chi NCC. **BA:** 34=thu TGNH, 43=chi TGNH. Xem bảng ReasonType trong MISA' },
            BankAccountID: { type: 'string', format: 'uuid', description: '**Cho BA (ngân hàng).** ID tài khoản ngân hàng. Truyền ID → tự fill BankAccountNumber, BankName' },
            BankName: { type: 'string', description: 'Tên ngân hàng (tự fill nếu truyền BankAccountID)' },
            EmployeeID: { type: 'string', format: 'uuid', description: 'Nhân viên phụ trách' },
            details: {
              type: 'array',
              description: 'BẮT BUỘC. Mảng dòng hạch toán. Ít nhất 1 dòng.',
              items: { $ref: '#/components/schemas/VoucherDetail' },
            },
          },
        },
        VoucherDetail: {
          type: 'object',
          required: ['DebitAccount', 'CreditAccount', 'Amount'],
          description: `**Dòng hạch toán.** Mỗi dòng = 1 bút toán Nợ/Có.

**Ví dụ đơn giản (CA/BA/GL):**
\`\`\`json
{ "DebitAccount": "331", "CreditAccount": "1111", "Amount": 5000000, "Description": "Trả tiền NCC" }
\`\`\`

**Ví dụ có hàng hóa (SA/PU/IN):**
\`\`\`json
{
  "DebitAccount": "1561", "CreditAccount": "331", "Amount": 2000000,
  "InventoryItemID": "0599D9EA-49FB-4441-8B9B-5AC17ED9AED9",
  "StockID": "0D83E65A-D5E3-4E2F-8FC9-B01B5B738D24",
  "UnitID": "3A3D4460-F54B-46B5-A26A-CD416A020FA7",
  "Quantity": 100, "UnitPrice": 20000,
  "Description": "Xi măng x100 bao"
}
\`\`\``,
          properties: {
            DebitAccount: { type: 'string', example: '1111', description: 'BẮT BUỘC. Tài khoản Nợ (VD: 1111=tiền mặt, 1121=TGNH, 131=phải thu, 331=phải trả, 1561=hàng hóa, 632=giá vốn)' },
            CreditAccount: { type: 'string', example: '131', description: 'BẮT BUỘC. Tài khoản Có' },
            Amount: { type: 'number', example: 5000000, description: 'BẮT BUỘC. Số tiền dòng này' },
            AmountOC: { type: 'number', description: 'Số tiền nguyên tệ (mặc định = Amount). Chỉ dùng khi ngoại tệ' },
            Description: { type: 'string', example: 'Mua NVL xi măng', description: 'Diễn giải dòng' },
            // === Hàng hóa (cho SA/PU/IN) ===
            InventoryItemID: { type: 'string', format: 'uuid', description: '**SA/PU/IN:** ID hàng hóa/vật tư. Lấy từ GET /dictionary/inventory-items' },
            StockID: { type: 'string', format: 'uuid', description: '**SA/PU/IN:** ID kho. Lấy từ GET /inventory/stocks' },
            UnitID: { type: 'string', format: 'uuid', description: '**SA/PU/IN:** ID đơn vị tính. Lấy từ GET /dictionary/units' },
            Quantity: { type: 'number', example: 100, description: 'Số lượng' },
            UnitPrice: { type: 'number', example: 20000, description: 'Đơn giá' },
            // === Quy đổi ĐVT ===
            MainUnitID: { type: 'string', format: 'uuid', description: 'ĐVT chính (mặc định = UnitID)' },
            MainQuantity: { type: 'number', description: 'SL quy đổi ĐVT chính (mặc định = Quantity)' },
            MainConvertRate: { type: 'number', default: 1, description: 'Tỷ lệ quy đổi (mặc định 1)' },
            MainUnitPrice: { type: 'number', description: 'Đơn giá ĐVT chính (mặc định = UnitPrice)' },
            // === Bán hàng (SA) ===
            SaleQuantity: { type: 'number', description: '**SA:** Số lượng bán (mặc định = Quantity)' },
            SaleAmount: { type: 'number', description: '**SA:** Tiền bán (mặc định = Amount)' },
            SaleAmountOC: { type: 'number', description: '**SA:** Tiền bán nguyên tệ' },
            // === Mua hàng (PU) ===
            PurchaseQuantity: { type: 'number', description: '**PU:** Số lượng mua (mặc định = Quantity)' },
            PurchaseAmount: { type: 'number', description: '**PU:** Tiền mua (mặc định = Amount)' },
            PurchaseAmountOC: { type: 'number', description: '**PU:** Tiền mua nguyên tệ' },
            // === Thuế ===
            VATAccount: { type: 'string', example: '33311', description: 'TK thuế GTGT' },
            VATRate: { type: 'number', example: 10, description: 'Thuế suất % (10, 8, 5, 0)' },
            VATAmount: { type: 'number', description: 'Tiền thuế GTGT' },
            VATDescription: { type: 'string', description: 'Diễn giải thuế' },
            DiscountAccount: { type: 'string', example: '52111', description: 'TK chiết khấu/giảm giá' },
            DiscountRate: { type: 'number', description: '% chiết khấu' },
            DiscountAmount: { type: 'number', description: 'Tiền chiết khấu' },
            // === Hóa đơn ===
            InvNo: { type: 'string', description: 'Số hóa đơn (mua hàng)' },
            InvDate: { type: 'string', format: 'date', description: 'Ngày hóa đơn' },
            InvSeries: { type: 'string', description: 'Ký hiệu hóa đơn' },
            // === Liên kết ===
            AccountObjectID: { type: 'string', format: 'uuid', description: 'Đối tượng dòng (kế thừa từ master nếu không truyền)' },
            OrderID: { type: 'string', format: 'uuid', description: 'Liên kết đơn hàng (SAOrder/PUOrder)' },
            JobID: { type: 'string', format: 'uuid', description: 'Đối tượng THCP (tính giá thành)' },
            ExpenseItemID: { type: 'string', format: 'uuid', description: 'Khoản mục chi phí' },
            BudgetItemID: { type: 'string', format: 'uuid', description: 'Mục ngân sách' },
            OrganizationUnitID: { type: 'string', format: 'uuid', description: 'Phòng ban' },
            ContractID: { type: 'string', format: 'uuid', description: 'Hợp đồng' },
            ProjectWorkID: { type: 'string', format: 'uuid', description: 'Công trình/dự án' },
          },
        },

        // ── Sales Voucher ──
        SAVoucherCreate: {
          type: 'object',
          required: ['TotalAmount', 'details'],
          description: `**Bán hàng.** RefType mặc định: 3530 (bán hàng TN chưa thu tiền).
Sub-types: 3531=bán TM, 3532=xuất khẩu, 3534=đại lý, 3535=ủy thác.

**Ví dụ bán hàng chưa thu tiền:**
\`\`\`json
{
  "JournalMemo": "Bán hàng cho GHTK",
  "TotalAmount": 6527778,
  "AccountObjectID": "0DF5DAE9-FFB1-412A-B19F-5E4467AE7FEB",
  "details": [{
    "DebitAccount": "131", "CreditAccount": "51115",
    "Amount": 6527778,
    "InventoryItemID": "0599D9EA-49FB-4441-8B9B-5AC17ED9AED9",
    "StockID": "0D83E65A-D5E3-4E2F-8FC9-B01B5B738D24",
    "UnitID": "3A3D4460-F54B-46B5-A26A-CD416A020FA7",
    "Quantity": 50, "UnitPrice": 130555.55,
    "SaleQuantity": 50, "SaleAmount": 6527778, "SaleAmountOC": 6527778,
    "Description": "POLO ÁO SẴN PRIME COTTON 03"
  }]
}
\`\`\`

**Lưu ý:** API tự insert SaleLedger (per detail line) + GeneralLedger + CustomFieldLedger.
Truyền InventoryItemID → tự lookup InventoryItemCode/Name cho SaleLedger.`,
          properties: {
            RefType: { type: 'integer', example: 3530, description: '3530=chưa thu tiền (mặc định), 3531=tiền mặt, 3532=xuất khẩu' },
            RefDate: { type: 'string', format: 'date', example: '2026-05-20' },
            JournalMemo: { type: 'string', example: 'Bán hàng cho Công ty GHTK' },
            TotalAmount: { type: 'number', example: 6527778, description: 'Tổng tiền bán hàng (= sum detail.Amount)' },
            TotalSaleAmount: { type: 'number', example: 6527778, description: 'Tổng doanh thu (mặc định = TotalAmount)' },
            TotalVATAmount: { type: 'number', example: 0, description: 'Tổng thuế GTGT' },
            TotalDiscountAmount: { type: 'number', example: 0, description: 'Tổng chiết khấu' },
            AccountObjectID: { type: 'string', format: 'uuid', description: 'ID khách hàng' },
            details: {
              type: 'array', items: {
                type: 'object', required: ['DebitAccount','CreditAccount','Amount','InventoryItemID','Quantity','UnitPrice'],
                properties: {
                  DebitAccount: { type: 'string', example: '131', description: 'TK Nợ (131=phải thu KH)' },
                  CreditAccount: { type: 'string', example: '51115', description: 'TK Có (5111x=doanh thu)' },
                  Amount: { type: 'number', example: 6527778 },
                  InventoryItemID: { type: 'string', format: 'uuid', description: 'ID hàng hóa' },
                  StockID: { type: 'string', format: 'uuid', description: 'ID kho xuất' },
                  UnitID: { type: 'string', format: 'uuid', description: 'ID đơn vị tính' },
                  Quantity: { type: 'number', example: 50 },
                  UnitPrice: { type: 'number', example: 130555.55 },
                  SaleQuantity: { type: 'number', example: 50, description: 'SL bán (mặc định = Quantity)' },
                  SaleAmount: { type: 'number', example: 6527778, description: 'Tiền bán (mặc định = Amount)' },
                  SaleAmountOC: { type: 'number', example: 6527778 },
                  Description: { type: 'string', example: 'POLO ÁO SẴN PRIME COTTON 03' },
                  VATRate: { type: 'number', example: 10 },
                  VATAmount: { type: 'number', example: 0 },
                  VATAccount: { type: 'string', example: '33311' },
                  DiscountAccount: { type: 'string', example: '52113' },
                },
              },
            },
          },
        },

        // ── Sales Order (không hạch toán) ──
        SAOrderCreate: {
          type: 'object',
          required: ['TotalAmount', 'details'],
          properties: {
            RefDate: { type: 'string', format: 'date', example: '2026-01-10' },
            JournalMemo: { type: 'string', example: 'Đơn hàng #001' },
            TotalAmount: { type: 'number', example: 5000000 },
            AccountObjectName: { type: 'string', example: 'Khách hàng XYZ' },
            details: {
              type: 'array', items: {
                type: 'object', properties: {
                  Description: { type: 'string', example: 'Sản phẩm B' },
                  Amount: { type: 'number', example: 5000000 },
                  Quantity: { type: 'number', example: 50 },
                  UnitPrice: { type: 'number', example: 100000 },
                },
              },
            },
          },
        },

        // ── Purchase Voucher ──
        PUVoucherCreate: {
          type: 'object',
          required: ['TotalAmount', 'details'],
          description: `**Mua hàng.** RefType mặc định: 302 (mua hàng TN nhập kho chưa TT).

Sub-types phổ biến:
- 302 = Mua hàng TN nhập kho chưa thanh toán
- 312 = Mua hàng TN không qua kho chưa TT
- 318 = Mua hàng nhập khẩu nhập kho chưa TT
- 307 = Mua hàng nhập kho + trả tiền mặt
- 308 = Mua hàng nhập kho + UNC

**Ví dụ mua hàng nhập kho:**
\`\`\`json
{
  "JournalMemo": "Mua dịch vụ gia công",
  "TotalAmount": 340000,
  "AccountObjectID": "B5C8EF7D-4476-47B9-B7D4-42CB9BD87C2C",
  "details": [{
    "DebitAccount": "62773", "CreditAccount": "331",
    "Amount": 340000,
    "InventoryItemID": "72817271-ADFB-4618-A4AA-4F84C663072F",
    "StockID": "0D83E65A-D5E3-4E2F-8FC9-B01B5B738D24",
    "UnitID": "71112249-98CE-4334-A06D-34736155FA35",
    "Quantity": 17, "UnitPrice": 20000,
    "PurchaseQuantity": 17, "PurchaseAmount": 340000, "PurchaseAmountOC": 340000,
    "Description": "407240-TT"
  }]
}
\`\`\`

**Lưu ý:** API tự insert PurchaseLedger (per detail line) + GeneralLedger + CustomFieldLedger.`,
          properties: {
            RefType: { type: 'integer', example: 302, description: '302=nhập kho chưa TT (mặc định), 312=ko kho chưa TT, 318=NK nhập kho, 307=nhập kho+TM, 308=nhập kho+UNC' },
            RefDate: { type: 'string', format: 'date', example: '2026-05-20' },
            JournalMemo: { type: 'string', example: 'Mua dịch vụ gia công' },
            TotalAmount: { type: 'number', example: 340000 },
            AccountObjectID: { type: 'string', format: 'uuid', description: 'ID nhà cung cấp' },
            IncludeInvoice: { type: 'integer', default: 0, description: '0=chưa có HĐ, 1=có HĐ kèm theo' },
            details: {
              type: 'array', items: {
                type: 'object', required: ['DebitAccount','CreditAccount','Amount'],
                properties: {
                  DebitAccount: { type: 'string', example: '1561', description: 'TK Nợ (1561=hàng hóa, 152=NVL, 627=CPSX)' },
                  CreditAccount: { type: 'string', example: '331', description: 'TK Có (331=phải trả NCC)' },
                  Amount: { type: 'number', example: 340000 },
                  InventoryItemID: { type: 'string', format: 'uuid', description: 'ID hàng hóa' },
                  StockID: { type: 'string', format: 'uuid', description: 'ID kho nhập' },
                  UnitID: { type: 'string', format: 'uuid', description: 'ID đơn vị tính' },
                  Quantity: { type: 'number', example: 17 },
                  UnitPrice: { type: 'number', example: 20000 },
                  PurchaseQuantity: { type: 'number', example: 17, description: 'SL mua (mặc định = Quantity)' },
                  PurchaseAmount: { type: 'number', example: 340000, description: 'Tiền mua (mặc định = Amount)' },
                  PurchaseAmountOC: { type: 'number', example: 340000 },
                  Description: { type: 'string', example: 'NVL xi măng x17 bao' },
                  InvNo: { type: 'string', description: 'Số hóa đơn mua' },
                  InvDate: { type: 'string', format: 'date', description: 'Ngày hóa đơn' },
                  JobID: { type: 'string', format: 'uuid', description: 'Đối tượng THCP' },
                  ExpenseItemID: { type: 'string', format: 'uuid', description: 'Khoản mục CP' },
                },
              },
            },
          },
        },

        // ── Cash Receipt (Phiếu thu) ──
        CAReceiptCreate: {
          type: 'object',
          required: ['TotalAmount', 'details'],
          description: `**Phiếu thu.** RefType mặc định 1010.
Sub-types: 1011=thu TM khách hàng, 1013=thu hoàn thuế.

**QUAN TRỌNG:** Truyền \`AccountObjectID\` (UUID) — KHÔNG truyền text name.
Lấy ID từ \`GET /dictionary/account-objects?type=1\` (type=1 = khách hàng).
API tự fill AccountObjectName, Address, TaxCode, ContactName.

**Ví dụ:**
\`\`\`json
{
  "RefType": 1010,
  "JournalMemo": "Thu tiền KH Đại Dương",
  "TotalAmount": 5000000,
  "AccountObjectID": "3A848988-EDFE-4726-AA93-D13D5EC958FB",
  "ReasonTypeID": 13,
  "details": [{
    "DebitAccount": "1111",
    "CreditAccount": "131",
    "Amount": 5000000,
    "Description": "Thu tiền bán hàng"
  }]
}
\`\`\``,
          properties: {
            RefType: { type: 'integer', example: 1010, description: '1010=phiếu thu (mặc định), 1011=thu TM KH, 1013=thu hoàn thuế' },
            RefDate: { type: 'string', format: 'date', example: '2026-05-20', description: 'Ngày chứng từ (mặc định hôm nay)' },
            JournalMemo: { type: 'string', example: 'Thu tiền KH Đại Dương' },
            TotalAmount: { type: 'number', example: 5000000, description: 'BẮT BUỘC. Tổng tiền = sum(detail.Amount)' },
            AccountObjectID: { type: 'string', format: 'uuid', example: '3A848988-EDFE-4726-AA93-D13D5EC958FB', description: 'BẮT BUỘC. ID khách hàng (lấy từ GET /dictionary/account-objects). API tự fill Name, Address, TaxCode' },
            ReasonTypeID: { type: 'integer', example: 13, description: 'Lý do thu: 13=thu KH, 34=thu TGNH. Lấy từ bảng ReasonType' },
            details: {
              type: 'array', description: 'BẮT BUỘC. Mảng dòng hạch toán.', items: {
                type: 'object', required: ['DebitAccount','CreditAccount','Amount'], properties: {
                  DebitAccount: { type: 'string', example: '1111', description: 'TK Nợ: 1111=tiền mặt VND' },
                  CreditAccount: { type: 'string', example: '131', description: 'TK Có: 131=phải thu KH' },
                  Amount: { type: 'number', example: 5000000, description: 'Số tiền' },
                  Description: { type: 'string', example: 'Thu tiền bán hàng' },
                  BudgetItemID: { type: 'string', format: 'uuid', description: 'Mục ngân sách (tùy chọn)' },
                },
              },
            },
          },
        },

        // ── Cash Payment (Phiếu chi) ──
        CAPaymentCreate: {
          type: 'object',
          required: ['TotalAmount', 'details'],
          description: `**Phiếu chi.** RefType mặc định 1020.
Sub-types: 1021=chi trả NCC, 1022=chi nộp thuế, 1025=chi BH, 1026=chi lương.

**QUAN TRỌNG:** Truyền \`AccountObjectID\` (UUID) — KHÔNG truyền text name.
Lấy ID từ \`GET /dictionary/account-objects?type=0\` (type=0 = nhà cung cấp).

**Ví dụ:**
\`\`\`json
{
  "RefType": 1020,
  "JournalMemo": "Chi trả tiền NCC ABC",
  "TotalAmount": 3000000,
  "AccountObjectID": "3A848988-EDFE-4726-AA93-D13D5EC958FB",
  "ReasonTypeID": 23,
  "details": [{
    "DebitAccount": "331",
    "CreditAccount": "1111",
    "Amount": 3000000,
    "Description": "Trả tiền mua NVL"
  }]
}
\`\`\``,
          properties: {
            RefType: { type: 'integer', example: 1020, description: '1020=phiếu chi (mặc định), 1021=chi NCC, 1022=chi thuế, 1026=chi lương' },
            RefDate: { type: 'string', format: 'date', example: '2026-05-20' },
            JournalMemo: { type: 'string', example: 'Chi trả tiền NCC ABC' },
            TotalAmount: { type: 'number', example: 3000000, description: 'BẮT BUỘC. Tổng tiền = sum(detail.Amount)' },
            AccountObjectID: { type: 'string', format: 'uuid', example: '3A848988-EDFE-4726-AA93-D13D5EC958FB', description: 'ID nhà cung cấp (lấy từ GET /dictionary/account-objects?type=0)' },
            ReasonTypeID: { type: 'integer', example: 23, description: 'Lý do chi: 23=chi NCC' },
            details: {
              type: 'array', description: 'Mảng dòng hạch toán', items: {
                type: 'object', required: ['DebitAccount','CreditAccount','Amount'], properties: {
                  DebitAccount: { type: 'string', example: '331', description: 'TK Nợ: 331=phải trả NCC' },
                  CreditAccount: { type: 'string', example: '1111', description: 'TK Có: 1111=tiền mặt VND' },
                  Amount: { type: 'number', example: 3000000 },
                  Description: { type: 'string', example: 'Trả tiền mua NVL' },
                },
              },
            },
          },
        },

        // ── Bank Deposit (Thu tiền gửi) ──
        BADepositCreate: {
          type: 'object',
          required: ['TotalAmount', 'details'],
          description: `**Thu tiền gửi ngân hàng.** RefType mặc định 1500.
Sub-types: 1502=thu TG từ KH.

**QUAN TRỌNG:**
- Truyền \`AccountObjectID\` (UUID) — ID khách hàng/NCC
- Truyền \`BankAccountID\` (UUID) — ID tài khoản ngân hàng
- Lấy BankAccountID từ \`GET /dictionary/bank-accounts\`

**Ví dụ:**
\`\`\`json
{
  "RefType": 1500,
  "JournalMemo": "Thu tiền gửi từ KH ABC",
  "TotalAmount": 20000000,
  "AccountObjectID": "3A848988-EDFE-4726-AA93-D13D5EC958FB",
  "BankAccountID": "BE40299A-E40B-401F-A9F3-2D5DA7A0A676",
  "ReasonTypeID": 34,
  "details": [{
    "DebitAccount": "1121",
    "CreditAccount": "131",
    "Amount": 20000000
  }]
}
\`\`\`

**Cũng dùng cho Ủy nhiệm chi** (\`POST /journal/bank/withdrawals\`):
\`\`\`json
{
  "RefType": 1510,
  "JournalMemo": "UNC trả tiền NCC",
  "TotalAmount": 10000000,
  "AccountObjectID": "...",
  "BankAccountID": "BE40299A-E40B-401F-A9F3-2D5DA7A0A676",
  "ReasonTypeID": 43,
  "details": [{ "DebitAccount": "331", "CreditAccount": "1121", "Amount": 10000000 }]
}
\`\`\``,
          properties: {
            RefType: { type: 'integer', example: 1500, description: '1500=thu TG (mặc định), 1502=thu từ KH. UNC: 1510, 1511=UNC trả NCC' },
            RefDate: { type: 'string', format: 'date', example: '2026-05-20' },
            JournalMemo: { type: 'string', example: 'Thu tiền gửi từ KH ABC' },
            TotalAmount: { type: 'number', example: 20000000, description: 'BẮT BUỘC. Tổng tiền = sum(detail.Amount)' },
            AccountObjectID: { type: 'string', format: 'uuid', example: '3A848988-EDFE-4726-AA93-D13D5EC958FB', description: 'ID KH/NCC (lấy từ GET /dictionary/account-objects)' },
            BankAccountID: { type: 'string', format: 'uuid', example: 'BE40299A-E40B-401F-A9F3-2D5DA7A0A676', description: 'BẮT BUỘC cho BA. ID TK ngân hàng (lấy từ GET /dictionary/bank-accounts). API tự fill BankName' },
            ReasonTypeID: { type: 'integer', example: 34, description: 'Lý do: 34=thu TGNH, 43=chi TGNH' },
            details: {
              type: 'array', items: {
                type: 'object', required: ['DebitAccount','CreditAccount','Amount'], properties: {
                  DebitAccount: { type: 'string', example: '1121', description: 'TK Nợ: 1121=TGNH VND' },
                  CreditAccount: { type: 'string', example: '131', description: 'TK Có: 131=phải thu KH' },
                  Amount: { type: 'number', example: 20000000 },
                },
              },
            },
          },
        },

        // ── Inventory Inward (Nhập kho) ──
        INInwardCreate: {
          type: 'object',
          required: ['TotalAmount', 'details'],
          description: `**Nhập kho.** RefType mặc định: 2014 (nhập kho khác).

Sub-types: 2010=NK thành phẩm SX, 2012=NK tháo dỡ, 2013=NK từ hàng bán trả lại, 2014=NK khác.

**Ví dụ nhập kho:**
\`\`\`json
{
  "JournalMemo": "Nhập kho NVL từ NCC ABC",
  "TotalAmount": 200000,
  "AccountObjectID": "3A848988-EDFE-4726-AA93-D13D5EC958FB",
  "details": [{
    "DebitAccount": "1561", "CreditAccount": "331",
    "Amount": 200000,
    "InventoryItemID": "0599D9EA-49FB-4441-8B9B-5AC17ED9AED9",
    "StockID": "0D83E65A-D5E3-4E2F-8FC9-B01B5B738D24",
    "UnitID": "3A3D4460-F54B-46B5-A26A-CD416A020FA7",
    "Quantity": 10, "UnitPrice": 20000
  }]
}
\`\`\`

**Xuất kho** dùng \`POST /inventory/outwards\`, RefType mặc định 2020 (XK bán hàng).
Sub-types: 2022=XK khác, 2023=XK sản xuất, 2021=XK cho chi nhánh.`,
          properties: {
            RefType: { type: 'integer', example: 2014, description: '2014=NK khác (mặc định), 2010=NK TP SX, 2013=NK trả lại' },
            RefDate: { type: 'string', format: 'date' },
            JournalMemo: { type: 'string', example: 'Nhập kho NVL từ NCC' },
            TotalAmount: { type: 'number', example: 200000 },
            AccountObjectID: { type: 'string', format: 'uuid' },
            details: {
              type: 'array', items: {
                type: 'object', required: ['DebitAccount','CreditAccount','Amount','InventoryItemID','Quantity','UnitPrice'],
                properties: {
                  DebitAccount: { type: 'string', example: '1561', description: '1561=hàng hóa, 152=NVL, 155=TP' },
                  CreditAccount: { type: 'string', example: '331', description: '331=phải trả NCC' },
                  Amount: { type: 'number', example: 200000 },
                  InventoryItemID: { type: 'string', format: 'uuid', description: 'BẮT BUỘC cho kho. ID hàng hóa' },
                  StockID: { type: 'string', format: 'uuid', description: 'ID kho nhập' },
                  UnitID: { type: 'string', format: 'uuid', description: 'ID đơn vị tính' },
                  Quantity: { type: 'number', example: 10 },
                  UnitPrice: { type: 'number', example: 20000 },
                },
              },
            },
          },
        },

        // ── GL Voucher (Chứng từ nghiệp vụ khác) ──
        GLVoucherCreate: {
          type: 'object',
          required: ['TotalAmount', 'details'],
          description: `**Chứng từ nghiệp vụ khác.** Dùng cho các bút toán không thuộc CA/BA/SA/PU/IN.

RefType mặc định: 4010. Sub-types: 4011=khấu trừ thuế, 4012=kết chuyển lãi lỗ, 4013=xử lý tỷ giá, 4014=bù trừ công nợ, 4015=quyết toán tạm ứng.

**Ví dụ kết chuyển lãi lỗ:**
\`\`\`json
{
  "RefType": 4012,
  "JournalMemo": "Kết chuyển lãi lỗ Q1/2026",
  "TotalAmount": 50000000,
  "details": [{
    "DebitAccount": "911", "CreditAccount": "4212",
    "Amount": 50000000,
    "Description": "Kết chuyển lãi Q1"
  }]
}
\`\`\`

**Ví dụ bù trừ công nợ:**
\`\`\`json
{
  "RefType": 4014,
  "JournalMemo": "Bù trừ CN Cty ABC",
  "TotalAmount": 10000000,
  "AccountObjectID": "...",
  "details": [{
    "DebitAccount": "331", "CreditAccount": "131",
    "Amount": 10000000,
    "Description": "Bù trừ CN phải thu/phải trả"
  }]
}
\`\`\``,
          properties: {
            RefType: { type: 'integer', example: 4010, description: '4010=NV khác, 4011=khấu trừ thuế, 4012=KC lãi lỗ, 4014=bù trừ CN' },
            RefDate: { type: 'string', format: 'date' },
            JournalMemo: { type: 'string', example: 'Kết chuyển lãi lỗ' },
            TotalAmount: { type: 'number', example: 50000000 },
            AccountObjectID: { type: 'string', format: 'uuid', description: 'Đối tượng (cho bù trừ CN)' },
            details: {
              type: 'array', items: {
                type: 'object', required: ['DebitAccount','CreditAccount','Amount'],
                properties: {
                  DebitAccount: { type: 'string', example: '911' },
                  CreditAccount: { type: 'string', example: '4212' },
                  Amount: { type: 'number', example: 50000000 },
                  Description: { type: 'string', example: 'Kết chuyển lãi' },
                },
              },
            },
          },
        },

        // ── Account Object (Khách hàng / NCC) ──
        AccountObjectCreate: {
          type: 'object',
          required: ['AccountObjectCode', 'AccountObjectName'],
          properties: {
            AccountObjectCode: { type: 'string', example: 'KH001' },
            AccountObjectName: { type: 'string', example: 'Công ty TNHH ABC' },
            AccountObjectType: { type: 'integer', enum: [0, 1, 2], description: '0=Vendor, 1=Customer, 2=Employee' },
            Address: { type: 'string', example: '123 Cầu Giấy, Hà Nội' },
            Tel: { type: 'string', example: '024-1234567' },
            Mobile: { type: 'string', example: '0901234567' },
            EmailAddress: { type: 'string', example: 'contact@abc.vn' },
            CompanyTaxCode: { type: 'string', example: '0100123456' },
            BankAccount: { type: 'string', example: '0001234567890' },
            BankName: { type: 'string', example: 'Vietcombank HN' },
          },
        },

        // ── Inventory Item (Hàng hóa) ──
        InventoryItemCreate: {
          type: 'object',
          required: ['InventoryItemCode', 'InventoryItemName'],
          properties: {
            InventoryItemCode: { type: 'string', example: 'SP001' },
            InventoryItemName: { type: 'string', example: 'Xi măng Holcim' },
            UnitPrice: { type: 'number', example: 68950 },
            SalePrice1: { type: 'number', example: 85000 },
            SalePrice2: { type: 'number', example: 82000 },
            InventoryAccount: { type: 'string', example: '156' },
            COGSAccount: { type: 'string', example: '632' },
            SaleAccount: { type: 'string', example: '5111' },
          },
        },

        // ── Fixed Asset ──
        FixedAssetCreate: {
          type: 'object',
          required: ['FixedAssetCode', 'FixedAssetName'],
          properties: {
            FixedAssetCode: { type: 'string', example: 'TSCD001' },
            FixedAssetName: { type: 'string', example: 'Máy tính Dell Vostro' },
            OrgPrice: { type: 'number', example: 15000000 },
            LifeTime: { type: 'integer', example: 36, description: 'Thời gian sử dụng (tháng)' },
            DepreciationAccount: { type: 'string', example: '2141' },
            OrgPriceAccount: { type: 'string', example: '21114' },
            FixedAssetCategoryID: { type: 'string', format: 'uuid' },
          },
        },

        // ── Tool/CCDC ──
        ToolCreate: {
          type: 'object',
          required: ['SupplyCode', 'SupplyName'],
          properties: {
            SupplyCode: { type: 'string', example: 'CCDC001' },
            SupplyName: { type: 'string', example: 'Bàn làm việc' },
            Quantity: { type: 'number', example: 10 },
            UnitPrice: { type: 'number', example: 2000000 },
            Amount: { type: 'number', example: 20000000 },
            AllocationTime: { type: 'integer', example: 24, description: 'Số kỳ phân bổ' },
            AllocationAccount: { type: 'string', example: '242' },
          },
        },

        // ── Contract ──
        ContractCreate: {
          type: 'object',
          required: ['ContractCode', 'ContractName'],
          properties: {
            ContractCode: { type: 'string', example: 'HD001' },
            ContractName: { type: 'string', example: 'HĐ xây dựng nhà xưởng' },
            ContractType: { type: 'integer' },
            SignDate: { type: 'string', format: 'date' },
            StartDate: { type: 'string', format: 'date' },
            EndDate: { type: 'string', format: 'date' },
            ContractAmount: { type: 'number', example: 500000000 },
            AccountObjectName: { type: 'string', example: 'Công ty XD Hà Thành' },
          },
        },

        // ── Budget ──
        BudgetCreate: {
          type: 'object',
          properties: {
            BudgetCode: { type: 'string', example: 'NS2026' },
            BudgetName: { type: 'string', example: 'Ngân sách năm 2026' },
            BudgetYear: { type: 'integer', example: 2026 },
            TotalAmount: { type: 'number', example: 1000000000 },
          },
        },
      },
    },
    paths: {
      // ── System ──
      '/system/health': { get: { tags: ['System'], summary: 'Health check + DB connection', responses: ok } },
      '/system/branches': { get: { tags: ['System'], summary: 'Danh sách chi nhánh', responses: ok } },
      '/system/ref-types': { get: { tags: ['System'], summary: 'Danh sách RefType', responses: ok } },
      '/system/databases': { get: { tags: ['System'], summary: 'Danh sách databases', responses: ok } },
      '/system/tables': { get: { tags: ['System'], summary: 'Danh sách tables trong DB', responses: ok } },
      '/system/tables-with-data': { get: { tags: ['System'], summary: 'Tables có data (sorted by row count)', responses: ok } },
      '/system/table-info/{table}': { get: { tags: ['System'], summary: 'Column info + row count cho 1 table', parameters: [{ in: 'path', name: 'table', required: true, schema: { type: 'string' }, description: 'Tên table' }], responses: ok } },
      '/system/query/{table}': { get: { tags: ['System'], summary: 'Query bất kỳ table (150+ whitelisted)', description: 'Đọc data từ bất kỳ table được phép.\n\n**Sub-details tự động trả trong GET detail** — endpoint này cho trường hợp cần query riêng.\n\nVí dụ: `/system/query/GeneralLedger?pageSize=100`, `/system/query/CAPaymentDetailTax?refId=xxx`', parameters: [{ in: 'path', name: 'table', required: true, schema: { type: 'string' }, description: 'Tên table' }, { in: 'query', name: 'refId', schema: { type: 'string', format: 'uuid' }, description: 'Filter theo RefID' }, { $ref: '#/components/parameters/page' }, { $ref: '#/components/parameters/pageSize' }], responses: ok } },

      // ── Dictionary ──
      '/dictionary/account-objects': {
        get: { tags: ['Danh mục'], summary: 'DS khách hàng/NCC/NV', parameters: [...paged, { in: 'query', name: 'type', schema: { type: 'integer', enum: [0, 1, 2] }, description: '0=Vendor, 1=Customer, 2=Employee' }], responses: ok },
        post: { tags: ['Danh mục'], summary: 'Tạo khách hàng/NCC', requestBody: bodyRef('AccountObjectCreate'), responses: created },
      },
      '/dictionary/account-objects/{id}': {
        get: { tags: ['Danh mục'], summary: 'Chi tiết đối tượng', parameters: [idParam()], responses: ok },
        put: { tags: ['Danh mục'], summary: 'Cập nhật đối tượng', parameters: [idParam()], requestBody: bodyRef('AccountObjectCreate'), responses: ok },
        delete: { tags: ['Danh mục'], summary: 'Xóa đối tượng', parameters: [idParam()], responses: ok },
      },
      '/dictionary/inventory-items': {
        get: { tags: ['Danh mục'], summary: 'DS hàng hóa/vật tư', parameters: paged, responses: ok },
        post: { tags: ['Danh mục'], summary: 'Tạo hàng hóa', requestBody: bodyRef('InventoryItemCreate'), responses: created },
      },
      '/dictionary/inventory-items/{id}': {
        get: { tags: ['Danh mục'], summary: 'Chi tiết hàng hóa', parameters: [idParam()], responses: ok },
        put: { tags: ['Danh mục'], summary: 'Cập nhật hàng hóa', parameters: [idParam()], requestBody: bodyRef('InventoryItemCreate'), responses: ok },
        delete: { tags: ['Danh mục'], summary: 'Xóa hàng hóa', parameters: [idParam()], responses: ok },
      },
      '/dictionary/accounts': { get: { tags: ['Danh mục'], summary: 'Hệ thống tài khoản', responses: ok } },
      '/dictionary/accounts/{accountNumber}': { get: { tags: ['Danh mục'], summary: 'Chi tiết tài khoản', parameters: [idParam('accountNumber')], responses: ok } },
      '/dictionary/employees': { get: { tags: ['Danh mục'], summary: 'DS nhân viên', parameters: [{ $ref: '#/components/parameters/search' }], responses: ok } },
      '/dictionary/organization-units': { get: { tags: ['Danh mục'], summary: 'Chi nhánh/phòng ban', responses: ok } },
      '/dictionary/units': { get: { tags: ['Danh mục'], summary: 'Đơn vị tính', responses: ok } },
      '/dictionary/bank-accounts': { get: { tags: ['Danh mục'], summary: 'TK ngân hàng', responses: ok } },
      '/dictionary/inventory-categories': { get: { tags: ['Danh mục'], summary: 'Nhóm hàng hóa', responses: ok } },
      '/dictionary/payment-terms': { get: { tags: ['Danh mục'], summary: 'Điều khoản thanh toán', responses: ok } },
      '/dictionary/currencies': { get: { tags: ['Danh mục'], summary: 'Loại tiền', responses: ok } },

      // ── Sales ──
      ...voucherCrud('/sales/vouchers', 'Bán hàng', 'chứng từ bán hàng', { bodySchema: 'SAVoucherCreate' }),
      ...voucherCrud('/sales/orders', 'Bán hàng', 'đơn đặt hàng', { postGL: false, bodySchema: 'SAOrderCreate' }),
      ...voucherCrud('/sales/returns', 'Bán hàng', 'hàng bán trả lại', { bodySchema: 'SAVoucherCreate' }),
      ...voucherCrud('/sales/invoices', 'Bán hàng', 'hóa đơn', { postGL: false, bodySchema: 'SAOrderCreate' }),
      ...voucherCrud('/sales/quotes', 'Bán hàng', 'báo giá', { postGL: false, bodySchema: 'SAOrderCreate' }),
      ...voucherCrud('/sales/discounts', 'Bán hàng', 'giảm giá', { bodySchema: 'SAVoucherCreate' }),

      // ── Purchase ──
      ...voucherCrud('/purchase/vouchers', 'Mua hàng', 'chứng từ mua hàng', { bodySchema: 'PUVoucherCreate' }),
      ...voucherCrud('/purchase/orders', 'Mua hàng', 'đơn mua hàng', { postGL: false, bodySchema: 'SAOrderCreate' }),
      ...voucherCrud('/purchase/returns', 'Mua hàng', 'hàng mua trả lại', { bodySchema: 'PUVoucherCreate' }),
      ...voucherCrud('/purchase/services', 'Mua hàng', 'mua dịch vụ', { bodySchema: 'PUVoucherCreate' }),
      '/purchase/invoices': { get: { tags: ['Mua hàng'], summary: 'Hóa đơn mua hàng', parameters: pagedDated, responses: ok } },
      '/purchase/invoices/{refId}': { get: { tags: ['Mua hàng'], summary: 'Chi tiết hóa đơn mua', parameters: [refIdParam], responses: ok } },
      ...voucherCrud('/purchase/discounts', 'Mua hàng', 'giảm giá mua hàng', { bodySchema: 'PUVoucherCreate' }),

      // ── Inventory ──
      ...voucherCrud('/inventory/inwards', 'Kho', 'phiếu nhập kho', { bodySchema: 'INInwardCreate' }),
      ...voucherCrud('/inventory/outwards', 'Kho', 'phiếu xuất kho', { bodySchema: 'INInwardCreate' }),
      ...voucherCrud('/inventory/transfers', 'Kho', 'phiếu chuyển kho', { bodySchema: 'INInwardCreate' }),
      '/inventory/assemblies': { get: { tags: ['Kho'], summary: 'Lắp ráp / Tháo dỡ', parameters: pagedDated, responses: ok } },
      '/inventory/assemblies/{refId}': { get: { tags: ['Kho'], summary: 'Chi tiết lắp ráp', parameters: [refIdParam], responses: ok } },
      '/inventory/stocks': { get: { tags: ['Kho'], summary: 'Danh sách kho', responses: ok } },

      // ── Journal ──
      '/journal/general-ledger': {
        get: { tags: ['Sổ cái'], summary: 'Truy vấn sổ cái', parameters: [
          { in: 'query', name: 'account', schema: { type: 'string' }, description: 'Mã TK: 111, 131...' },
          { in: 'query', name: 'refType', schema: { type: 'integer' } },
          { in: 'query', name: 'branchId', schema: { type: 'string', format: 'uuid' } },
          { $ref: '#/components/parameters/dateFrom' }, { $ref: '#/components/parameters/dateTo' },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 100, maximum: 500 } },
        ], responses: ok },
      },
      '/journal/account-balance': {
        get: { tags: ['Sổ cái'], summary: 'Số dư tài khoản', parameters: [
          { in: 'query', name: 'account', required: true, schema: { type: 'string' }, description: 'Mã TK (bắt buộc)' },
          { $ref: '#/components/parameters/dateFrom' }, { $ref: '#/components/parameters/dateTo' },
        ], responses: ok },
      },
      ...voucherCrud('/journal/gl-vouchers', 'Sổ cái', 'chứng từ nghiệp vụ khác', { bodySchema: 'GLVoucherCreate' }),
      ...voucherCrud('/journal/cash/receipts', 'Tiền mặt', 'phiếu thu', { bodySchema: 'CAReceiptCreate' }),
      ...voucherCrud('/journal/cash/payments', 'Tiền mặt', 'phiếu chi', { bodySchema: 'CAPaymentCreate' }),
      ...voucherCrud('/journal/bank/deposits', 'Ngân hàng', 'thu tiền gửi', { bodySchema: 'BADepositCreate' }),
      ...voucherCrud('/journal/bank/withdrawals', 'Ngân hàng', 'ủy nhiệm chi', { bodySchema: 'BADepositCreate' }),
      ...voucherCrud('/journal/bank/internal-transfers', 'Ngân hàng', 'chuyển tiền nội bộ', { bodySchema: 'VoucherCreate' }),

      // ── Fixed Assets ──
      '/fixed-assets/assets': {
        get: { tags: ['TSCĐ'], summary: 'DS tài sản cố định', parameters: paged, responses: ok },
        post: { tags: ['TSCĐ'], summary: 'Tạo TSCĐ', requestBody: bodyRef('FixedAssetCreate'), responses: created },
      },
      '/fixed-assets/assets/{id}': {
        get: { tags: ['TSCĐ'], summary: 'Chi tiết TSCĐ', parameters: [idParam()], responses: ok },
        put: { tags: ['TSCĐ'], summary: 'Cập nhật TSCĐ', parameters: [idParam()], requestBody: bodyRef('FixedAssetCreate'), responses: ok },
        delete: { tags: ['TSCĐ'], summary: 'Xóa TSCĐ', parameters: [idParam()], responses: ok },
      },
      '/fixed-assets/categories': { get: { tags: ['TSCĐ'], summary: 'Loại TSCĐ', responses: ok } },
      ...voucherCrud('/fixed-assets/depreciation', 'TSCĐ', 'khấu hao', { bodySchema: 'VoucherCreate' }),
      '/fixed-assets/decrements': { get: { tags: ['TSCĐ'], summary: 'Ghi giảm TSCĐ', parameters: pagedDated, responses: ok } },
      '/fixed-assets/decrements/{refId}': { get: { tags: ['TSCĐ'], summary: 'Chi tiết ghi giảm', parameters: [refIdParam], responses: ok } },
      '/fixed-assets/adjustments': { get: { tags: ['TSCĐ'], summary: 'Đánh giá lại TSCĐ', parameters: pagedDated, responses: ok } },
      '/fixed-assets/adjustments/{refId}': { get: { tags: ['TSCĐ'], summary: 'Chi tiết đánh giá lại', parameters: [refIdParam], responses: ok } },
      '/fixed-assets/transfers': { get: { tags: ['TSCĐ'], summary: 'Điều chuyển TSCĐ', parameters: pagedDated, responses: ok } },
      '/fixed-assets/transfers/{refId}': { get: { tags: ['TSCĐ'], summary: 'Chi tiết điều chuyển', parameters: [refIdParam], responses: ok } },

      // ── CCDC ──
      '/fixed-assets/tools': {
        get: { tags: ['CCDC'], summary: 'DS công cụ dụng cụ', parameters: paged, responses: ok },
        post: { tags: ['CCDC'], summary: 'Tạo CCDC', requestBody: bodyRef('ToolCreate'), responses: created },
      },
      '/fixed-assets/tools/{id}': {
        get: { tags: ['CCDC'], summary: 'Chi tiết CCDC', parameters: [idParam()], responses: ok },
        put: { tags: ['CCDC'], summary: 'Cập nhật CCDC', parameters: [idParam()], requestBody: bodyRef('ToolCreate'), responses: ok },
        delete: { tags: ['CCDC'], summary: 'Xóa CCDC', parameters: [idParam()], responses: ok },
      },
      '/fixed-assets/tool-categories': { get: { tags: ['CCDC'], summary: 'Loại CCDC', responses: ok } },
      ...voucherCrud('/fixed-assets/allocations', 'CCDC', 'phân bổ CCDC', { bodySchema: 'VoucherCreate' }),
      '/fixed-assets/tool-decrements': { get: { tags: ['CCDC'], summary: 'Ghi giảm CCDC', parameters: pagedDated, responses: ok } },
      '/fixed-assets/tool-decrements/{refId}': { get: { tags: ['CCDC'], summary: 'Chi tiết ghi giảm CCDC', parameters: [refIdParam], responses: ok } },
      '/fixed-assets/tool-transfers': { get: { tags: ['CCDC'], summary: 'Điều chuyển CCDC', parameters: pagedDated, responses: ok } },
      '/fixed-assets/tool-transfers/{refId}': { get: { tags: ['CCDC'], summary: 'Chi tiết điều chuyển CCDC', parameters: [refIdParam], responses: ok } },

      // ── Payroll ──
      '/payroll/employees': { get: { tags: ['Tiền lương'], summary: 'DS nhân viên', parameters: [...paged, { in: 'query', name: 'departmentId', schema: { type: 'string', format: 'uuid' } }], responses: ok } },
      '/payroll/vouchers': { get: { tags: ['Tiền lương'], summary: 'Chứng từ lương', parameters: [{ $ref: '#/components/parameters/dateFrom' }, { $ref: '#/components/parameters/dateTo' }], responses: ok } },
      '/payroll/salary-sheet': { get: { tags: ['Tiền lương'], summary: 'Bảng lương (từ GL)', parameters: [{ in: 'query', name: 'month', schema: { type: 'integer' } }, { in: 'query', name: 'year', schema: { type: 'integer' } }], responses: ok } },
      '/payroll/salary-sheets': { get: { tags: ['Tiền lương'], summary: 'DS bảng lương (PASalarySheet)', parameters: pagedDated, responses: ok } },
      '/payroll/salary-sheets/{refId}': { get: { tags: ['Tiền lương'], summary: 'Chi tiết bảng lương + dòng NV', parameters: [refIdParam], responses: ok } },
      '/payroll/salary-expenses': { get: { tags: ['Tiền lương'], summary: 'Phân bổ chi phí lương', parameters: pagedDated, responses: ok } },
      '/payroll/timesheets': { get: { tags: ['Tiền lương'], summary: 'Bảng chấm công', parameters: pagedDated, responses: ok } },
      '/payroll/timesheets/{refId}': { get: { tags: ['Tiền lương'], summary: 'Chi tiết chấm công', parameters: [refIdParam], responses: ok } },
      '/payroll/insurance': { get: { tags: ['Tiền lương'], summary: 'BHXH/BHYT/BHTN (TK 338)', parameters: [{ in: 'query', name: 'month', schema: { type: 'integer' } }, { in: 'query', name: 'year', schema: { type: 'integer' } }], responses: ok } },
      '/payroll/pit': { get: { tags: ['Tiền lương'], summary: 'Thuế TNCN (TK 3335)', parameters: [{ in: 'query', name: 'month', schema: { type: 'integer' } }, { in: 'query', name: 'year', schema: { type: 'integer' } }], responses: ok } },

      // ── Tax ──
      '/tax/vat-input': { get: { tags: ['Thuế'], summary: 'VAT đầu vào TK 133', parameters: pagedDated, responses: ok } },
      '/tax/vat-output': { get: { tags: ['Thuế'], summary: 'VAT đầu ra TK 3331', parameters: pagedDated, responses: ok } },
      '/tax/vat-summary': { get: { tags: ['Thuế'], summary: 'Tổng hợp VAT (Input/Output/Payable)', parameters: [{ $ref: '#/components/parameters/dateFrom' }, { $ref: '#/components/parameters/dateTo' }], responses: ok } },
      '/tax/cit': { get: { tags: ['Thuế'], summary: 'Thuế TNDN TK 3334', parameters: [{ $ref: '#/components/parameters/dateFrom' }, { $ref: '#/components/parameters/dateTo' }], responses: ok } },
      '/tax/summary': { get: { tags: ['Thuế'], summary: 'Tổng hợp thuế TK 333x', parameters: [{ $ref: '#/components/parameters/dateFrom' }, { $ref: '#/components/parameters/dateTo' }], responses: ok } },

      // ── Reports ──
      '/reports/trial-balance': { get: { tags: ['Báo cáo'], summary: 'Bảng cân đối phát sinh', parameters: [{ $ref: '#/components/parameters/dateFrom' }, { $ref: '#/components/parameters/dateTo' }, { in: 'query', name: 'grade', schema: { type: 'integer', default: 1 }, description: '1=TK cấp 1, 2=cấp 2' }], responses: ok } },
      '/reports/income-statement': { get: { tags: ['Báo cáo'], summary: 'Báo cáo kết quả kinh doanh', parameters: [{ $ref: '#/components/parameters/dateFrom' }, { $ref: '#/components/parameters/dateTo' }], responses: ok } },
      '/reports/balance-sheet': { get: { tags: ['Báo cáo'], summary: 'Bảng cân đối kế toán', parameters: [{ in: 'query', name: 'asOfDate', schema: { type: 'string', format: 'date' } }], responses: ok } },
      '/reports/cash-flow': { get: { tags: ['Báo cáo'], summary: 'Lưu chuyển tiền tệ', parameters: [{ $ref: '#/components/parameters/dateFrom' }, { $ref: '#/components/parameters/dateTo' }], responses: ok } },
      '/reports/receivables': { get: { tags: ['Báo cáo'], summary: 'Công nợ phải thu TK 131', parameters: [{ in: 'query', name: 'asOfDate', schema: { type: 'string', format: 'date' } }], responses: ok } },
      '/reports/payables': { get: { tags: ['Báo cáo'], summary: 'Công nợ phải trả TK 331', parameters: [{ in: 'query', name: 'asOfDate', schema: { type: 'string', format: 'date' } }], responses: ok } },
      '/reports/inventory-balance': { get: { tags: ['Báo cáo'], summary: 'Tồn kho TK 152-156', parameters: [{ in: 'query', name: 'asOfDate', schema: { type: 'string', format: 'date' } }], responses: ok } },
      '/reports/revenue-by-period': { get: { tags: ['Báo cáo'], summary: 'Doanh thu theo tháng/quý', parameters: [{ in: 'query', name: 'year', schema: { type: 'integer' } }, { in: 'query', name: 'groupBy', schema: { type: 'string', enum: ['month', 'quarter'] } }], responses: ok } },
      '/reports/account-ledger': { get: { tags: ['Báo cáo'], summary: 'Sổ chi tiết TK + RunningBalance', parameters: [{ in: 'query', name: 'account', required: true, schema: { type: 'string' } }, { $ref: '#/components/parameters/dateFrom' }, { $ref: '#/components/parameters/dateTo' }], responses: ok } },
      '/reports/dashboard': { get: { tags: ['Báo cáo'], summary: 'Tổng quan: Revenue/COGS/Cash/AR/AP', parameters: [{ in: 'query', name: 'year', schema: { type: 'integer' } }], responses: ok } },

      // ── Contracts ──
      '/contracts': {
        get: { tags: ['Hợp đồng'], summary: 'DS hợp đồng', parameters: [...paged, { in: 'query', name: 'status', schema: { type: 'integer' } }], responses: ok },
        post: { tags: ['Hợp đồng'], summary: 'Tạo hợp đồng', requestBody: bodyRef('ContractCreate'), responses: created },
      },
      '/contracts/{id}': {
        get: { tags: ['Hợp đồng'], summary: 'Chi tiết hợp đồng', parameters: [idParam()], responses: ok },
        put: { tags: ['Hợp đồng'], summary: 'Cập nhật hợp đồng', parameters: [idParam()], requestBody: bodyRef('ContractCreate'), responses: ok },
        delete: { tags: ['Hợp đồng'], summary: 'Xóa hợp đồng', parameters: [idParam()], responses: ok },
      },
      '/contracts/{id}/ledger': { get: { tags: ['Hợp đồng'], summary: 'GL entries hợp đồng', parameters: [idParam()], responses: ok } },

      // ── Budget ──
      '/budget': {
        get: { tags: ['Ngân sách'], summary: 'DS ngân sách', parameters: [...paged, { in: 'query', name: 'year', schema: { type: 'integer' } }], responses: ok },
        post: { tags: ['Ngân sách'], summary: 'Tạo ngân sách', requestBody: bodyRef('BudgetCreate'), responses: created },
      },
      '/budget/{id}': {
        get: { tags: ['Ngân sách'], summary: 'Chi tiết + detail lines', parameters: [idParam()], responses: ok },
        put: { tags: ['Ngân sách'], summary: 'Cập nhật', parameters: [idParam()], requestBody: bodyRef('BudgetCreate'), responses: ok },
        delete: { tags: ['Ngân sách'], summary: 'Xóa (cascade)', parameters: [idParam()], responses: ok },
      },
      '/budget/analysis/vs-actual': { get: { tags: ['Ngân sách'], summary: 'Ngân sách vs thực tế', parameters: [{ in: 'query', name: 'year', schema: { type: 'integer' } }], responses: ok } },

      // ── Loan ──
      '/loan/agreements': { get: { tags: ['Khế ước vay'], summary: 'DS khế ước vay', parameters: paged, responses: ok } },
      '/loan/agreements/{id}': { get: { tags: ['Khế ước vay'], summary: 'Chi tiết + lịch trả nợ', parameters: [idParam()], responses: ok } },
      '/loan/profiles': { get: { tags: ['Khế ước vay'], summary: 'Hồ sơ vay', responses: ok } },

      // ── Costing ──
      '/costing/periods': { get: { tags: ['Giá thành'], summary: 'Kỳ tính giá thành', parameters: pagedDated, responses: ok } },
      '/costing/periods/{refId}': { get: { tags: ['Giá thành'], summary: 'Chi tiết kỳ', parameters: [refIdParam], responses: ok } },
      '/costing/opening': { get: { tags: ['Giá thành'], summary: 'Dở dang đầu kỳ', parameters: pagedDated, responses: ok } },
      '/costing/cost-vouchers': { get: { tags: ['Giá thành'], summary: 'Chứng từ giá thành', parameters: pagedDated, responses: ok } },
      '/costing/allocation-expenses': { get: { tags: ['Giá thành'], summary: 'Phân bổ chi phí', parameters: pagedDated, responses: ok } },
      '/costing/allocation-expenses/{refId}': { get: { tags: ['Giá thành'], summary: 'Chi tiết phân bổ', parameters: [refIdParam], responses: ok } },
      '/costing/allocation-quantum': { get: { tags: ['Giá thành'], summary: 'Phân bổ định mức', parameters: pagedDated, responses: ok } },
      '/costing/expense-transfers': { get: { tags: ['Giá thành'], summary: 'Kết chuyển chi phí', parameters: pagedDated, responses: ok } },
      '/costing/expense-transfers/{refId}': { get: { tags: ['Giá thành'], summary: 'Chi tiết kết chuyển', parameters: [refIdParam], responses: ok } },
      '/costing/accepted': { get: { tags: ['Giá thành'], summary: 'Nghiệm thu', parameters: pagedDated, responses: ok } },
      '/costing/accepted/{refId}': { get: { tags: ['Giá thành'], summary: 'Chi tiết nghiệm thu', parameters: [refIdParam], responses: ok } },
      '/costing/uncomplete': { get: { tags: ['Giá thành'], summary: 'Dở dang cuối kỳ', parameters: pagedDated, responses: ok } },
      '/costing/product-cost': { get: { tags: ['Giá thành'], summary: 'Chi tiết giá thành SP', responses: ok } },
      '/costing/product-quantum': { get: { tags: ['Giá thành'], summary: 'Định mức NVL', responses: ok } },

      // ── Audit ──
      '/audit/cash': { get: { tags: ['Kiểm kê'], summary: 'Kiểm kê quỹ', parameters: pagedDated, responses: ok } },
      '/audit/cash/{refId}': { get: { tags: ['Kiểm kê'], summary: 'Chi tiết kiểm kê quỹ', parameters: [refIdParam], responses: ok } },
      '/audit/inventory': { get: { tags: ['Kiểm kê'], summary: 'Kiểm kê kho', parameters: pagedDated, responses: ok } },
      '/audit/inventory/{refId}': { get: { tags: ['Kiểm kê'], summary: 'Chi tiết kiểm kê kho', parameters: [refIdParam], responses: ok } },
      '/audit/fixed-assets': { get: { tags: ['Kiểm kê'], summary: 'Kiểm kê TSCĐ', parameters: pagedDated, responses: ok } },
      '/audit/fixed-assets/{refId}': { get: { tags: ['Kiểm kê'], summary: 'Chi tiết kiểm kê TSCĐ', parameters: [refIdParam], responses: ok } },
      '/audit/tools': { get: { tags: ['Kiểm kê'], summary: 'Kiểm kê CCDC', parameters: pagedDated, responses: ok } },
      '/audit/tools/{refId}': { get: { tags: ['Kiểm kê'], summary: 'Chi tiết kiểm kê CCDC', parameters: [refIdParam], responses: ok } },

      // ── General ──
      '/general/prepaid-expenses': { get: { tags: ['Tổng hợp'], summary: 'Chi phí trả trước TK 242', parameters: pagedDated, responses: ok } },
      '/general/prepaid-expenses/{id}': { get: { tags: ['Tổng hợp'], summary: 'Chi tiết CPTT', parameters: [idParam()], responses: ok } },
      '/general/deferred-revenue': { get: { tags: ['Tổng hợp'], summary: 'Doanh thu chưa thực hiện', parameters: pagedDated, responses: ok } },
      '/general/jobs': { get: { tags: ['Tổng hợp'], summary: 'Đối tượng THCP', parameters: [{ $ref: '#/components/parameters/search' }], responses: ok } },
      '/general/jobs/{id}': { get: { tags: ['Tổng hợp'], summary: 'Chi tiết vụ việc', parameters: [idParam()], responses: ok } },
      '/general/projects': { get: { tags: ['Tổng hợp'], summary: 'Công trình / Dự án', parameters: [{ $ref: '#/components/parameters/search' }], responses: ok } },
      '/general/projects/{id}': { get: { tags: ['Tổng hợp'], summary: 'Chi tiết công trình', parameters: [idParam()], responses: ok } },
      '/general/expense-items': { get: { tags: ['Tổng hợp'], summary: 'Khoản mục chi phí', responses: ok } },
      '/general/opening-accounts': { get: { tags: ['Tổng hợp'], summary: 'Số dư đầu kỳ TK', parameters: pagedDated, responses: ok } },
      '/general/opening-inventory': { get: { tags: ['Tổng hợp'], summary: 'Số dư đầu kỳ kho', parameters: pagedDated, responses: ok } },
      '/general/budget-items': { get: { tags: ['Tổng hợp'], summary: 'Mục ngân sách', responses: ok } },
      '/general/banks': { get: { tags: ['Tổng hợp'], summary: 'DS ngân hàng', responses: ok } },
      '/general/exchange-rates': { get: { tags: ['Tổng hợp'], summary: 'Tỷ giá', responses: ok } },
      '/general/purchase-contracts': { get: { tags: ['Tổng hợp'], summary: 'Hợp đồng mua', parameters: pagedDated, responses: ok } },
      '/general/purchase-contracts/{id}': { get: { tags: ['Tổng hợp'], summary: 'Chi tiết HĐ mua', parameters: [idParam()], responses: ok } },
      '/general/sale-policies': { get: { tags: ['Tổng hợp'], summary: 'Chính sách giá', responses: ok } },
      '/general/sale-groups': { get: { tags: ['Tổng hợp'], summary: 'Nhóm KH bán hàng', responses: ok } },
      '/general/production-orders': { get: { tags: ['Tổng hợp'], summary: 'Lệnh sản xuất', parameters: pagedDated, responses: ok } },
      '/general/production-orders/{refId}': { get: { tags: ['Tổng hợp'], summary: 'Chi tiết lệnh SX', parameters: [refIdParam], responses: ok } },
      '/general/investment-projects': { get: { tags: ['Tổng hợp'], summary: 'Dự án đầu tư', responses: ok } },
      '/general/debt-periods': { get: { tags: ['Tổng hợp'], summary: 'Kỳ công nợ', responses: ok } },
      '/general/debt-lists': { get: { tags: ['Tổng hợp'], summary: 'Bảng kê công nợ', parameters: pagedDated, responses: ok } },
      '/general/bank-reconcile': { get: { tags: ['Tổng hợp'], summary: 'Đối chiếu ngân hàng', responses: ok } },
      '/general/inventory-ledger': { get: { tags: ['Sổ phụ'], summary: 'Sổ kho', parameters: [...pagedDated, { in: 'query', name: 'inventoryItemId', schema: { type: 'string', format: 'uuid' } }], responses: ok } },
      '/general/fixed-asset-ledger': { get: { tags: ['Sổ phụ'], summary: 'Sổ TSCĐ', parameters: pagedDated, responses: ok } },
      '/general/sale-ledger': { get: { tags: ['Sổ phụ'], summary: 'Sổ bán hàng', parameters: pagedDated, responses: ok } },
      '/general/purchase-ledger': { get: { tags: ['Sổ phụ'], summary: 'Sổ mua hàng', parameters: pagedDated, responses: ok } },
      '/general/locations': { get: { tags: ['Tổng hợp'], summary: 'Địa điểm', responses: ok } },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
