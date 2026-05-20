/**
 * RefTypeCategory codes from SYSAutoID — used for auto-numbering.
 * These are NOT the same as RefType in SYSRefType table!
 */
export const REF_TYPE_CATEGORY = {
  // Cash (CA)
  CA_RECEIPT: 101,          // Phiếu thu (PT)
  CA_PAYMENT: 102,          // Phiếu chi (PC)
  CA_AUDIT: 103,            // Kiểm kê quỹ (KKQ)

  // Bank (BA)
  BA_DEPOSIT: 150,          // Thu tiền gửi (NTTK)
  BA_WITHDRAW: 151,         // Ủy nhiệm chi (UNC)
  BA_CHECK_CASH: 152,       // Séc tiền mặt (STM)
  BA_CHECK_TRANSFER: 153,   // Séc chuyển khoản (SCK)
  BA_INTERNAL_TRANSFER: 156,// Chuyển tiền nội bộ (CTNB)

  // Inventory (IN)
  IN_INWARD: 201,           // Nhập kho (NK)
  IN_OUTWARD: 202,          // Xuất kho (XK)
  IN_TRANSFER: 203,         // Chuyển kho (CK)
  IN_PRODUCTION_ORDER: 204, // Lệnh sản xuất (LSX)
  IN_ASSEMBLY: 205,         // Lệnh lắp ráp/tháo dỡ (LRTD)
  IN_AUDIT: 206,            // Kiểm kê kho (KKK)

  // Fixed Assets (FA)
  FA_FIXED_ASSET: 250,      // Ghi tăng TSCĐ (GTTS)
  FA_DECREMENT: 251,        // Ghi giảm TSCĐ (GGTS)
  FA_ADJUSTMENT: 252,       // Đánh giá lại (ĐGL)
  FA_TRANSFER: 253,         // Điều chuyển TSCĐ (ĐCTS)
  FA_DEPRECIATION: 254,     // Khấu hao (KH)
  FA_AUDIT: 255,            // Kiểm kê TSCĐ (KKTS)
  FA_LEASE_TO_OWN: 256,     // Chuyển TS thuê TC → CSH (CTTC)

  // Purchase (PU)
  PU_ORDER: 301,            // Đơn mua hàng (ĐMH)
  PU_VOUCHER: 302,          // Mua hàng (MH) — cũng dùng cho Cat=201 khi mua nhập kho
  PU_RETURN: 303,           // Hàng mua trả lại (MTL)
  PU_DISCOUNT: 304,         // Hàng mua giảm giá (MGG)
  PU_SERVICE: 305,          // Mua dịch vụ (MDV)

  // Sales (SA)
  SA_QUOTE: 351,            // Báo giá (BG)
  SA_ORDER: 352,            // Đơn đặt hàng (ĐH)
  SA_VOUCHER: 353,          // Bán hàng (BH)
  SA_RETURN: 354,           // Hàng bán trả lại (BTL)
  SA_DISCOUNT: 355,         // Giảm giá hàng bán (BGG)

  // General Ledger (GL)
  GL_VOUCHER: 401,          // Chứng từ nghiệp vụ khác (NVK)
  GL_PREPAID: 402,          // Phân bổ chi phí trả trước (PBPTT)
  GL_CONCURRENT: 403,       // Chứng từ ghi đồng thời
  GL_POSTING: 404,          // Chứng từ ghi sổ
  GL_COST_TRANSFER: 408,    // Kết chuyển chi phí (KC)
  GL_ACCEPTANCE: 409,       // Nghiệm thu (NT)
  GL_COST_ALLOC: 410,       // Phân bổ CP BH/QLDN (PB)
  GL_ADVANCE_SETTLE: 411,   // Quyết toán tạm ứng (QTTU)
  GL_DEFERRED_REVENUE: 412, // Phân bổ doanh thu nhận trước (PBDT)

  // Supply/Tools (SU)
  SU_INCREMENT: 450,        // Ghi tăng CCDC (GTCC)
  SU_TRANSFER: 451,         // Điều chuyển CCDC (ĐCCC)
  SU_DECREMENT: 452,        // Ghi giảm CCDC (GGCC)
  SU_ALLOCATION: 453,       // Phân bổ CCDC (PBCC)
} as const;

/**
 * RefType codes from SYSRefType table — used in voucher RefType field.
 * User can override via request body `RefType` field.
 * These are DEFAULT RefTypes per endpoint.
 */
export const REF_TYPES = {
  // ===== CASH =====
  CA_RECEIPT: 1010,                    // Phiếu thu
  CA_RECEIPT_CUSTOMER: 1011,           // Phiếu thu tiền mặt khách hàng
  CA_RECEIPT_CUSTOMER_BATCH: 1012,     // Phiếu thu tiền mặt KH hàng loạt
  CA_RECEIPT_TAX_REFUND: 1013,         // Phiếu thu hoàn thuế
  CA_PAYMENT: 1020,                    // Phiếu chi
  CA_PAYMENT_SUPPLIER: 1021,           // Phiếu chi trả tiền NCC
  CA_PAYMENT_TAX: 1022,               // Phiếu chi nộp thuế
  CA_PAYMENT_PIT: 1023,               // Chi tiền mặt nộp thuế TNCN
  CA_PAYMENT_IMPORT_TAX: 1024,        // Phiếu chi nộp thuế hàng NK
  CA_PAYMENT_INSURANCE: 1025,         // Phiếu chi nộp tiền bảo hiểm
  CA_PAYMENT_SALARY: 1026,            // Phiếu chi trả lương nhân viên
  CA_AUDIT: 1030,                     // Kiểm kê quỹ

  // ===== BANK =====
  BA_DEPOSIT: 1500,                    // Thu tiền gửi
  BA_DEPOSIT_TAX_REFUND: 1501,        // Thu hoàn thuế
  BA_DEPOSIT_CUSTOMER: 1502,          // Thu tiền gửi từ KH
  BA_DEPOSIT_CUSTOMER_BATCH: 1503,    // Thu tiền gửi từ KH hàng loạt
  BA_WITHDRAW: 1510,                   // Ủy nhiệm chi
  BA_WITHDRAW_SUPPLIER: 1511,         // UNC trả tiền NCC
  BA_WITHDRAW_TAX: 1512,              // Chi tiền gửi nộp thuế
  BA_WITHDRAW_PIT: 1513,              // Chi tiền gửi nộp thuế TNCN
  BA_WITHDRAW_IMPORT_TAX: 1514,       // Chi tiền gửi nộp thuế hàng NK
  BA_CHECK_CASH: 1520,                // Séc tiền mặt
  BA_CHECK_CASH_SUPPLIER: 1521,       // Séc tiền mặt trả tiền NCC
  BA_WITHDRAW_INSURANCE: 1522,        // UNC nộp tiền bảo hiểm
  BA_WITHDRAW_SALARY: 1523,           // UNC trả lương nhân viên
  BA_CHECK_TRANSFER: 1530,            // Séc chuyển khoản
  BA_CHECK_TRANSFER_SUPPLIER: 1531,   // Séc CK trả tiền NCC
  BA_INTERNAL_TRANSFER: 1560,         // Chuyển tiền nội bộ

  // ===== INVENTORY =====
  // Generic aliases (default RefType per endpoint)
  IN_INWARD: 2014,                     // Default: Nhập kho khác
  IN_OUTWARD: 2020,                    // Default: Xuất kho bán hàng
  PU_VOUCHER: 302,                     // Default: Mua hàng TN nhập kho chưa TT

  IN_INWARD_PRODUCTION: 2010,         // Nhập kho thành phẩm sản xuất
  IN_INWARD_ASSEMBLY: 2011,           // Nhập kho thành phẩm lắp ráp
  IN_INWARD_DISASSEMBLY: 2012,        // Nhập kho thành phẩm tháo dỡ
  IN_INWARD_RETURN: 2013,             // Nhập kho từ hàng bán trả lại
  IN_INWARD_OTHER: 2014,              // Nhập kho khác
  IN_INWARD_AUDIT: 2015,              // Nhập kho từ kiểm kê
  IN_INWARD_AUDIT_ADJ: 2016,          // Nhập kho từ kiểm kê (có điều chỉnh)
  IN_INWARD_OUTSOURCE: 2017,          // Nhập kho hàng nhận gia công
  IN_OUTWARD_SALES: 2020,             // Xuất kho bán hàng
  IN_OUTWARD_BRANCH: 2021,            // Xuất hàng cho chi nhánh khác
  IN_OUTWARD_OTHER: 2022,             // Xuất kho khác
  IN_OUTWARD_PRODUCTION: 2023,        // Xuất kho sản xuất
  IN_OUTWARD_ASSEMBLY: 2024,          // Xuất kho lắp ráp
  IN_OUTWARD_DISASSEMBLY: 2025,       // Xuất kho tháo dỡ
  IN_OUTWARD_AUDIT: 2026,             // Xuất kho từ kiểm kê
  IN_OUTWARD_AUDIT_ADJ: 2027,         // Xuất kho từ kiểm kê (có điều chỉnh)
  IN_TRANSFER: 2030,                  // Xuất kho kiêm vận chuyển nội bộ
  IN_TRANSFER_CONSIGNMENT: 2031,      // Xuất kho gửi bán đại lý
  IN_TRANSFER_INTERNAL: 2032,         // Xuất chuyển kho nội bộ
  IN_PRODUCTION_ORDER: 2040,          // Lệnh sản xuất
  IN_ASSEMBLY: 2050,                  // Lệnh lắp ráp
  IN_DISASSEMBLY: 2051,               // Lệnh tháo dỡ
  IN_AUDIT: 2060,                     // Bảng kiểm kê vật tư hàng hóa

  // ===== PURCHASE =====
  PU_ORDER: 301,                       // Đơn mua hàng
  PU_DOMESTIC_STOCK: 302,             // Mua hàng TN nhập kho chưa TT
  PU_DOMESTIC_STOCK_CASH: 307,        // Mua hàng TN nhập kho - Tiền mặt
  PU_DOMESTIC_STOCK_UNC: 308,         // Mua hàng TN nhập kho - UNC
  PU_DOMESTIC_STOCK_CK: 309,          // Mua hàng TN nhập kho - CK
  PU_DOMESTIC_STOCK_STM: 310,         // Mua hàng TN nhập kho - Séc TM
  PU_DOMESTIC_NOSTOCK: 312,           // Mua hàng TN không qua kho chưa TT
  PU_DOMESTIC_NOSTOCK_CASH: 313,      // Mua hàng TN ko qua kho - TM
  PU_DOMESTIC_NOSTOCK_UNC: 314,       // Mua hàng TN ko qua kho - UNC
  PU_DOMESTIC_NOSTOCK_CK: 315,        // Mua hàng TN ko qua kho - CK
  PU_DOMESTIC_NOSTOCK_STM: 316,       // Mua hàng TN ko qua kho - Séc TM
  PU_IMPORT_STOCK: 318,               // Mua hàng NK nhập kho chưa TT
  PU_IMPORT_STOCK_CASH: 319,          // Mua hàng NK nhập kho - TM
  PU_IMPORT_STOCK_UNC: 320,           // Mua hàng NK nhập kho - UNC
  PU_IMPORT_STOCK_CK: 321,            // Mua hàng NK nhập kho - CK
  PU_IMPORT_STOCK_STM: 322,           // Mua hàng NK nhập kho - Séc TM
  PU_IMPORT_NOSTOCK: 324,             // Mua hàng NK ko qua kho chưa TT
  PU_IMPORT_NOSTOCK_CASH: 325,        // Mua hàng NK ko qua kho - TM
  PU_IMPORT_NOSTOCK_UNC: 326,         // Mua hàng NK ko qua kho - UNC
  PU_IMPORT_NOSTOCK_CK: 327,          // Mua hàng NK ko qua kho - CK
  PU_IMPORT_NOSTOCK_STM: 328,         // Mua hàng NK ko qua kho - Séc TM
  PU_SERVICE: 330,                     // Mua dịch vụ chưa TT
  PU_SERVICE_CASH: 331,               // Mua dịch vụ - TM
  PU_SERVICE_UNC: 332,                // Mua dịch vụ - UNC
  PU_SERVICE_CK: 333,                 // Mua dịch vụ - CK
  PU_SERVICE_STM: 334,                // Mua dịch vụ - Séc TM
  PU_RETURN: 3030,                     // Hàng mua trả lại - Giảm trừ công nợ
  PU_RETURN_CASH: 3031,               // Hàng mua trả lại - Thu tiền mặt
  PU_RETURN_STOCK: 3032,              // Hàng mua trả lại nhập kho - Giảm trừ CN
  PU_RETURN_STOCK_CASH: 3033,         // Hàng mua trả lại nhập kho - Thu TM
  PU_DISCOUNT: 3040,                   // Hàng mua giảm giá - Giảm trừ CN
  PU_DISCOUNT_CASH: 3041,             // Hàng mua giảm giá - Thu TM
  PU_DISCOUNT_STOCK: 3042,            // Hàng mua giảm giá nhập kho - Giảm trừ CN
  PU_DISCOUNT_STOCK_CASH: 3043,       // Hàng mua giảm giá nhập kho - Thu TM
  PU_INVOICE: 3400,                    // Nhận hóa đơn mua hàng
  PU_INVOICE_DISCOUNT: 3402,          // Hóa đơn giảm giá
  PU_INVOICE_RETURN: 3403,            // Hóa đơn hàng bán trả lại

  // ===== SALES =====
  SA_QUOTE: 3510,                      // Báo giá
  SA_ORDER: 3520,                      // Đơn đặt hàng
  SA_VOUCHER: 3530,                    // Bán hàng TN chưa thu tiền
  SA_VOUCHER_CASH: 3531,              // Bán hàng TN - Tiền mặt
  SA_VOUCHER_EXPORT: 3532,            // Bán hàng xuất khẩu
  SA_VOUCHER_AGENT: 3534,             // Bán hàng đại lý
  SA_VOUCHER_CONSIGNMENT: 3535,       // Bán hàng ủy thác/ký gửi
  SA_VOUCHER_ENTRUST: 3536,           // Bán hàng ủy thác
  SA_VOUCHER_BRANCH: 3537,            // Bán hàng cho chi nhánh
  SA_VOUCHER_CK: 3538,               // Bán hàng - CK
  SA_RETURN: 3540,                     // Hàng bán trả lại - Giảm trừ CN
  SA_RETURN_CASH: 3541,               // Hàng bán trả lại - Chi TM
  SA_RETURN_STOCK: 3542,              // Hàng bán trả lại nhập kho - Giảm trừ CN
  SA_RETURN_STOCK_CASH: 3543,         // Hàng bán trả lại nhập kho - Chi TM
  SA_RETURN_UNC: 3544,                // Hàng bán trả lại - UNC
  SA_RETURN_STOCK_UNC: 3545,          // Hàng bán trả lại nhập kho - UNC
  SA_DISCOUNT: 3550,                   // Giảm giá hàng bán - Giảm trừ CN
  SA_DISCOUNT_CASH: 3551,             // Giảm giá hàng bán - Chi TM
  SA_DISCOUNT_STOCK: 3552,            // Giảm giá hàng bán nhập kho - Giảm trừ CN
  SA_DISCOUNT_STOCK_CASH: 3553,       // Giảm giá hàng bán nhập kho - Chi TM
  SA_DISCOUNT_UNC: 3554,              // Giảm giá hàng bán - UNC
  SA_DISCOUNT_STOCK_UNC: 3555,        // Giảm giá hàng bán nhập kho - UNC
  SA_INVOICE: 3560,                    // Hóa đơn bán hàng TN
  SA_INVOICE_EXPORT: 3562,            // Hóa đơn bán hàng XK
  SA_INVOICE_RETURN: 3564,            // Hóa đơn trả lại hàng mua

  // ===== GENERAL LEDGER =====
  GL_VOUCHER: 4010,                    // Chứng từ nghiệp vụ khác
  GL_TAX_OFFSET: 4011,               // Khấu trừ thuế
  GL_PROFIT_LOSS: 4012,              // Kết chuyển lãi lỗ
  GL_EXCHANGE_RATE: 4013,            // Chứng từ xử lý chênh lệch tỷ giá
  GL_DEBT_OFFSET: 4014,              // Chứng từ bù trừ công nợ
  GL_ADVANCE_SETTLE: 4015,           // Chứng từ quyết toán tạm ứng
  GL_EXCHANGE_REVALUE: 4016,         // XL chênh lệch tỷ giá - đánh giá lại TK ngoại tệ
  GL_EXCHANGE_OUTWARD: 4017,         // XL chênh lệch tỷ giá - tính tỷ giá xuất quỹ
  GL_VAT_ADJUST: 4018,               // Điều chỉnh thuế GTGT
  GL_PREPAID: 4020,                   // Phân bổ chi phí trả trước
  GL_CONCURRENT: 4030,               // Chứng từ ghi đồng thời
  GL_POSTING: 4040,                   // Chứng từ ghi sổ
  GL_DEFERRED_REVENUE: 4120,         // Phân bổ doanh thu nhận trước

  // ===== FIXED ASSETS =====
  FA_FIXED_ASSET: 250,
  FA_DECREMENT: 251,
  FA_ADJUSTMENT: 252,
  FA_TRANSFER: 253,
  FA_DEPRECIATION: 254,

  // ===== SUPPLY/TOOLS =====
  SU_INCREMENT: 450,
  SU_TRANSFER: 451,
  SU_DECREMENT: 452,
  SU_ALLOCATION: 453,
} as const;

/**
 * Map RefType → auto-numbering category.
 * PU vouchers with payment method use the payment's auto-number category.
 */
export const REFTYPE_TO_CATEGORY: Record<number, number> = {
  // CA
  1010: 101, 1011: 101, 1012: 101, 1013: 101,
  1020: 102, 1021: 102, 1022: 102, 1023: 102, 1024: 102, 1025: 102, 1026: 102,
  // BA
  1500: 150, 1501: 150, 1502: 150, 1503: 150,
  1510: 151, 1511: 151, 1512: 151, 1513: 151, 1514: 151, 1522: 151, 1523: 151,
  1520: 152, 1521: 152,
  1530: 153, 1531: 153,
  1560: 156,
  // IN
  2010: 201, 2011: 201, 2012: 201, 2013: 201, 2014: 201, 2015: 201, 2016: 201, 2017: 201,
  2020: 202, 2021: 202, 2022: 202, 2023: 202, 2024: 202, 2025: 202, 2026: 202, 2027: 202,
  2030: 203, 2031: 203, 2032: 203,
  // PU — pay-method variants use payment category
  301: 301,
  302: 302, 312: 302,
  307: 102, 313: 102, // tiền mặt → CA_PAYMENT category
  308: 151, 314: 151, 320: 151, 326: 151, 332: 151, // UNC
  309: 153, 315: 153, 321: 153, 327: 153, 333: 153, // CK
  310: 152, 316: 152, 322: 152, 328: 152, 334: 152, // STM
  318: 302, 324: 302,
  319: 102, 325: 102, 331: 102,
  330: 305,
  3030: 303, 3031: 101, 3032: 303, 3033: 101,
  3040: 304, 3041: 101, 3042: 304, 3043: 101,
  3400: 0, 3402: 0, 3403: 0,
  // SA
  3510: 351, 3520: 352,
  3530: 353, 3531: 353, 3532: 353, 3534: 353, 3535: 353, 3536: 353, 3537: 353, 3538: 353,
  3540: 354, 3541: 102, 3542: 354, 3543: 102, 3544: 354, 3545: 354,
  3550: 355, 3551: 102, 3552: 355, 3553: 102, 3554: 355, 3555: 355,
  3560: 0, 3562: 0, 3564: 0,
  // GL
  4010: 401, 4011: 401, 4012: 401, 4013: 401, 4014: 401, 4015: 411, 4016: 401, 4017: 401, 4018: 401,
  4020: 402, 4030: 403, 4040: 404, 4120: 412,
  // FA
  250: 250, 251: 251, 252: 252, 253: 253, 254: 254,
  // SU
  450: 450, 451: 451, 452: 452, 453: 453,
};

export type RefTypeCode = typeof REF_TYPES[keyof typeof REF_TYPES];
