/**
 * RefTypeCategory codes from SYSAutoID — used for auto-numbering.
 * These are NOT the same as RefType in SYSRefType table!
 */
export const REF_TYPE_CATEGORY = {
  // Cash (CA)
  CA_RECEIPT: 101,          // Phiếu thu (PT)
  CA_PAYMENT: 102,          // Phiếu chi (PC)

  // Bank (BA)
  BA_DEPOSIT: 150,          // Thu tiền gửi (NTTK)
  BA_WITHDRAW: 151,         // Ủy nhiệm chi (UNC)
  BA_INTERNAL_TRANSFER: 156,// Chuyển tiền nội bộ (CTNB)

  // Inventory (IN)
  IN_INWARD: 201,           // Nhập kho (NK)
  IN_OUTWARD: 202,          // Xuất kho (XK)
  IN_TRANSFER: 203,         // Chuyển kho (CK)

  // Fixed Assets (FA)
  FA_FIXED_ASSET: 250,      // Ghi tăng TSCĐ (GTTS)
  FA_DECREMENT: 251,        // Ghi giảm TSCĐ (GGTS)
  FA_ADJUSTMENT: 252,       // Đánh giá lại (ĐGL)
  FA_TRANSFER: 253,         // Điều chuyển TSCĐ (ĐCTS)
  FA_DEPRECIATION: 254,     // Khấu hao (KH)

  // Purchase (PU)
  PU_ORDER: 301,            // Đơn mua hàng (ĐMH)
  PU_VOUCHER: 302,          // Mua hàng (MH)
  PU_RETURN: 303,           // Hàng mua trả lại (MTL)
  PU_SERVICE: 305,          // Mua dịch vụ (MDV)

  // Sales (SA)
  SA_QUOTE: 351,            // Báo giá (BG)
  SA_ORDER: 352,            // Đơn đặt hàng (ĐH)
  SA_VOUCHER: 353,          // Bán hàng (BH)
  SA_RETURN: 354,           // Hàng bán trả lại (BTL)
  SA_DISCOUNT: 355,         // Giảm giá (BGG)

  // General Ledger (GL)
  GL_VOUCHER: 401,          // Chứng từ nghiệp vụ khác (NVK)
  GL_PREPAID: 402,          // Phân bổ chi phí trả trước (PBPTT)

  // Supply/Tools (SU)
  SU_INCREMENT: 450,        // Ghi tăng CCDC (GTCC)
  SU_TRANSFER: 451,         // Điều chuyển CCDC (ĐCCC)
  SU_DECREMENT: 452,        // Ghi giảm CCDC (GGCC)
  SU_ALLOCATION: 453,       // Phân bổ CCDC (PBCC)
} as const;

/**
 * RefType codes from SYSRefType table — used in voucher RefType field.
 */
export const REF_TYPES = {
  CA_RECEIPT: 1010,
  CA_PAYMENT: 1020,
  BA_DEPOSIT: 1500,
  BA_WITHDRAW: 1510,
  BA_INTERNAL_TRANSFER: 1560,
  IN_INWARD: 2013,
  IN_OUTWARD: 2020,
  IN_TRANSFER: 2030,
  FA_FIXED_ASSET: 250,
  FA_DECREMENT: 251,
  FA_ADJUSTMENT: 252,
  FA_TRANSFER: 253,
  FA_DEPRECIATION: 254,
  PU_ORDER: 301,
  PU_VOUCHER: 302,
  PU_RETURN: 3030,
  PU_SERVICE: 330,
  SA_QUOTE: 3510,
  SA_ORDER: 3520,
  SA_VOUCHER: 3530,
  SA_RETURN: 3540,
  SA_DISCOUNT: 3550,
  SA_INVOICE: 3560,
  GL_VOUCHER: 4011,
  GL_PREPAID: 4020,
  SU_INCREMENT: 450,
  SU_TRANSFER: 451,
  SU_DECREMENT: 452,
  SU_ALLOCATION: 453,
} as const;

export type RefTypeCode = typeof REF_TYPES[keyof typeof REF_TYPES];
