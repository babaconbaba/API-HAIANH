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
      version: '3.0.0',
      description: `REST API kết nối trực tiếp database MISA SME 2026.

## Tính năng
- **232 endpoints** — 16 modules kế toán đầy đủ
- **CRUD + GL Posting** — Tạo chứng từ tự động ghi sổ cái
- **Sub-details tự động** — GET detail trả kèm tất cả sub-tables (tax, cost, allocation...)
- **Multi-tenant** — Kết nối nhiều SQL Server / database qua headers
- **Auto-fill** — Truyền AccountObjectID tự fill Name, Address, TaxCode, ContactName
- **Generic query** — Đọc bất kỳ 150+ tables qua \`/system/query/:table\`
- **134,924+ chứng từ** đã test trên DB production thật (HAG2026)

## Authentication
\`\`\`
Authorization: ApiKey misa-api-key-2026
\`\`\`

## Multi-tenant (Remote SQL)
| Header | Mô tả |
|--------|-------|
| \`X-SQL-Instance\` | SQL Server (VD: \`192.168.1.100\\\\MISASME2026\`) |
| \`X-SQL-Database\` | Database name |
| \`X-SQL-Auth\` | \`windows\` hoặc \`sql\` |
| \`X-SQL-Username\` | Username (cho SQL Auth) |
| \`X-SQL-Password\` | Password |

## Auto-fill (kế thừa)
Khi truyền \`AccountObjectID\`, API tự động fill:
- \`AccountObjectName\` — Tên KH/NCC
- \`AccountObjectAddress\` — Địa chỉ
- \`AccountObjectTaxCode\` — Mã số thuế
- \`AccountObjectContactName\` — Người liên hệ
- \`detail.AccountObjectID\` — Kế thừa xuống dòng detail
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

        // ── Voucher (chứng từ chung) ──
        VoucherCreate: {
          type: 'object',
          required: ['TotalAmount', 'details'],
          properties: {
            RefDate: { type: 'string', format: 'date', example: '2026-01-15', description: 'Ngày chứng từ (mặc định hôm nay)' },
            PostedDate: { type: 'string', format: 'date', description: 'Ngày hạch toán (mặc định = RefDate)' },
            JournalMemo: { type: 'string', example: 'Thu tiền khách hàng ABC' },
            TotalAmount: { type: 'number', example: 10000000 },
            CurrencyID: { type: 'string', default: 'VND' },
            ExchangeRate: { type: 'number', default: 1 },
            AccountObjectID: { type: 'string', format: 'uuid', description: 'ID KH/NCC — tự fill Name, Address, TaxCode, ContactName' },
            AccountObjectName: { type: 'string', description: 'Tự fill nếu truyền AccountObjectID' },
            BranchID: { type: 'string', format: 'uuid', description: 'Mặc định chi nhánh đầu tiên' },
            ReasonTypeID: { type: 'integer', description: 'Lý do thu/chi (13=thu KH, 23=chi NCC, 34=thu TGNH, 43=chi TGNH)' },
            BankAccountID: { type: 'string', format: 'uuid', description: 'TK ngân hàng (cho BA vouchers)' },
            BankName: { type: 'string', description: 'Tên ngân hàng' },
            Month: { type: 'integer', description: 'Tháng (cho GL vouchers)' },
            Year: { type: 'integer', description: 'Năm (cho GL vouchers)' },
            IsSaleWithOutward: { type: 'boolean', description: 'Xuất kho kèm bán hàng (SA)' },
            AccountObjectTaxCode: { type: 'string', description: 'MST (tự fill từ AccountObject)' },
            details: {
              type: 'array',
              items: { $ref: '#/components/schemas/VoucherDetail' },
            },
          },
        },
        VoucherDetail: {
          type: 'object',
          required: ['DebitAccount', 'CreditAccount', 'Amount'],
          properties: {
            DebitAccount: { type: 'string', example: '1111', description: 'TK Nợ' },
            CreditAccount: { type: 'string', example: '131', description: 'TK Có' },
            Amount: { type: 'number', example: 10000000 },
            AmountOC: { type: 'number', description: 'Số tiền nguyên tệ (mặc định = Amount)' },
            Description: { type: 'string', example: 'Thu tiền bán hàng' },
            Quantity: { type: 'number', example: 100 },
            UnitPrice: { type: 'number', example: 100000 },
            InventoryItemID: { type: 'string', format: 'uuid', description: 'Mã hàng (bắt buộc cho SA/PU/IN)' },
            AccountObjectID: { type: 'string', format: 'uuid', description: 'Đối tượng dòng (kế thừa từ master)' },
            StockID: { type: 'string', format: 'uuid', description: 'Kho' },
            UnitID: { type: 'string', format: 'uuid', description: 'Đơn vị tính' },
            MainUnitID: { type: 'string', format: 'uuid', description: 'ĐVT chính' },
            MainQuantity: { type: 'number', description: 'SL quy đổi ĐVT chính' },
            MainConvertRate: { type: 'number', description: 'Tỷ lệ quy đổi (mặc định 1)' },
            MainUnitPrice: { type: 'number', description: 'Đơn giá ĐVT chính' },
            OrderID: { type: 'string', format: 'uuid', description: 'Liên kết đơn hàng' },
            JobID: { type: 'string', format: 'uuid', description: 'Đối tượng THCP' },
            ExpenseItemID: { type: 'string', format: 'uuid', description: 'Khoản mục chi phí' },
            BudgetItemID: { type: 'string', format: 'uuid', description: 'Mục ngân sách' },
            OrganizationUnitID: { type: 'string', format: 'uuid', description: 'Phòng ban' },
            PurchasePurposeID: { type: 'string', format: 'uuid', description: 'Mục đích mua' },
            VATAccount: { type: 'string', example: '33311', description: 'TK thuế GTGT' },
            VATRate: { type: 'number', example: 10, description: 'Thuế suất %' },
            VATAmount: { type: 'number', description: 'Tiền thuế' },
            VATDescription: { type: 'string', description: 'Diễn giải thuế' },
            DiscountAccount: { type: 'string', example: '52111', description: 'TK chiết khấu' },
            InvNo: { type: 'string', description: 'Số hóa đơn (mua hàng)' },
            InvDate: { type: 'string', format: 'date', description: 'Ngày hóa đơn' },
          },
        },

        // ── Sales Voucher ──
        SAVoucherCreate: {
          type: 'object',
          required: ['TotalAmount', 'details'],
          properties: {
            RefDate: { type: 'string', format: 'date', example: '2026-01-15' },
            JournalMemo: { type: 'string', example: 'Bán hàng cho Công ty ABC' },
            TotalAmount: { type: 'number', example: 11000000 },
            TotalSaleAmount: { type: 'number', example: 10000000 },
            TotalVATAmount: { type: 'number', example: 1000000 },
            AccountObjectID: { type: 'string', format: 'uuid' },
            AccountObjectName: { type: 'string', example: 'Công ty ABC' },
            BranchID: { type: 'string', format: 'uuid' },
            details: {
              type: 'array', items: {
                type: 'object', properties: {
                  DebitAccount: { type: 'string', example: '131' },
                  CreditAccount: { type: 'string', example: '5111' },
                  Amount: { type: 'number', example: 10000000 },
                  Quantity: { type: 'number', example: 100 },
                  UnitPrice: { type: 'number', example: 100000 },
                  InventoryItemID: { type: 'string', format: 'uuid' },
                  Description: { type: 'string', example: 'Sản phẩm A x100' },
                  VATRate: { type: 'number', example: 10 },
                  VATAmount: { type: 'number', example: 1000000 },
                  VATAccount: { type: 'string', example: '33311' },
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
          properties: {
            RefDate: { type: 'string', format: 'date', example: '2026-01-20' },
            JournalMemo: { type: 'string', example: 'Mua NVL từ NCC Hồng Hà' },
            TotalAmount: { type: 'number', example: 8000000 },
            AccountObjectName: { type: 'string', example: 'Công ty TNHH Hồng Hà' },
            details: {
              type: 'array', items: {
                type: 'object', properties: {
                  DebitAccount: { type: 'string', example: '152' },
                  CreditAccount: { type: 'string', example: '331' },
                  Amount: { type: 'number', example: 8000000 },
                  Quantity: { type: 'number', example: 200 },
                  UnitPrice: { type: 'number', example: 40000 },
                  Description: { type: 'string', example: 'Xi măng x200 bao' },
                },
              },
            },
          },
        },

        // ── Cash Receipt (Phiếu thu) ──
        CAReceiptCreate: {
          type: 'object',
          required: ['TotalAmount', 'details'],
          properties: {
            RefDate: { type: 'string', format: 'date', example: '2026-02-01' },
            JournalMemo: { type: 'string', example: 'Thu tiền KH Đại Dương' },
            TotalAmount: { type: 'number', example: 5000000 },
            AccountObjectName: { type: 'string', example: 'Công ty CP Đại Dương' },
            details: {
              type: 'array', items: {
                type: 'object', properties: {
                  DebitAccount: { type: 'string', example: '1111', description: 'Tiền mặt VND' },
                  CreditAccount: { type: 'string', example: '131', description: 'Phải thu KH' },
                  Amount: { type: 'number', example: 5000000 },
                  Description: { type: 'string', example: 'Thu tiền hàng' },
                },
              },
            },
          },
        },

        // ── Cash Payment (Phiếu chi) ──
        CAPaymentCreate: {
          type: 'object',
          required: ['TotalAmount', 'details'],
          properties: {
            RefDate: { type: 'string', format: 'date', example: '2026-02-05' },
            JournalMemo: { type: 'string', example: 'Chi trả NCC Lan Tân' },
            TotalAmount: { type: 'number', example: 3000000 },
            details: {
              type: 'array', items: {
                type: 'object', properties: {
                  DebitAccount: { type: 'string', example: '331', description: 'Phải trả NCC' },
                  CreditAccount: { type: 'string', example: '1111', description: 'Tiền mặt VND' },
                  Amount: { type: 'number', example: 3000000 },
                },
              },
            },
          },
        },

        // ── Bank Deposit (Thu tiền gửi) ──
        BADepositCreate: {
          type: 'object',
          required: ['TotalAmount', 'details'],
          properties: {
            RefDate: { type: 'string', format: 'date' },
            JournalMemo: { type: 'string', example: 'Thu TGNH từ KH' },
            TotalAmount: { type: 'number', example: 20000000 },
            details: {
              type: 'array', items: {
                type: 'object', properties: {
                  DebitAccount: { type: 'string', example: '1121', description: 'TGNH VND' },
                  CreditAccount: { type: 'string', example: '131' },
                  Amount: { type: 'number', example: 20000000 },
                },
              },
            },
          },
        },

        // ── Inventory Inward (Nhập kho) ──
        INInwardCreate: {
          type: 'object',
          required: ['details'],
          properties: {
            RefDate: { type: 'string', format: 'date' },
            JournalMemo: { type: 'string', example: 'Nhập kho NVL từ NCC' },
            TotalAmountFinance: { type: 'number', example: 5000000 },
            details: {
              type: 'array', items: {
                type: 'object', properties: {
                  DebitAccount: { type: 'string', example: '152', description: 'NVL' },
                  CreditAccount: { type: 'string', example: '331', description: 'Phải trả NCC' },
                  Amount: { type: 'number', example: 5000000 },
                  Quantity: { type: 'number', example: 100 },
                  UnitPrice: { type: 'number', example: 50000 },
                  InventoryItemID: { type: 'string', format: 'uuid' },
                },
              },
            },
          },
        },

        // ── GL Voucher (Chứng từ nghiệp vụ khác) ──
        GLVoucherCreate: {
          type: 'object',
          required: ['TotalAmount', 'details'],
          properties: {
            RefDate: { type: 'string', format: 'date' },
            JournalMemo: { type: 'string', example: 'Kết chuyển lãi lỗ' },
            TotalAmount: { type: 'number', example: 1000000 },
            details: {
              type: 'array', items: {
                type: 'object', properties: {
                  DebitAccount: { type: 'string', example: '911' },
                  CreditAccount: { type: 'string', example: '4212' },
                  Amount: { type: 'number', example: 1000000 },
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
      '/purchase/discounts': { get: { tags: ['Mua hàng'], summary: 'Giảm giá mua hàng', parameters: pagedDated, responses: ok } },
      '/purchase/discounts/{refId}': { get: { tags: ['Mua hàng'], summary: 'Chi tiết giảm giá mua', parameters: [refIdParam], responses: ok } },

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
