import { getPoolFromReq } from '../config/database';
import { Router } from 'express';
import { asyncHandler, listVouchers, getVoucherWithDetails, deleteVoucher, sql, getPool } from '../lib/voucherHelper';
import { parsePagination, paginatedResponse } from '../middleware/pagination';
import { createVoucher } from '../lib/voucherWriter';
import { REF_TYPES, REF_TYPE_CATEGORY } from '../config/refTypes';

const router = Router();

const PU_COLS = `RefID, RefType, RefDate, PostedDate, RefNoFinance, RefNoManagement,
  IsPostedFinance, JournalMemo, TotalAmount, TotalAmountOC,
  TotalVATAmount, TotalImportTaxAmount, TotalFreightAmount,
  CurrencyID, ExchangeRate, AccountObjectID, AccountObjectName,
  EmployeeID, BranchID, CreatedDate, ModifiedDate`;

// ─── PUVoucher (Mua hàng) ───

router.get('/vouchers', asyncHandler(async (req, res) => {
  res.json(await listVouchers(req, 'PUVoucher', PU_COLS));
}));

router.get('/vouchers/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'PUVoucher', 'PUVoucherDetail', req.params.refId));
}));

router.post('/vouchers', asyncHandler(async (req, res) => {
  const result = await createVoucher(req, {
    masterTable: 'PUVoucher', detailTable: 'PUVoucherDetail',
    refType: REF_TYPES.PU_VOUCHER, refTypeCategory: REF_TYPE_CATEGORY.PU_VOUCHER,
    postToGL: true,
  });
  res.status(201).json({ success: true, data: result });
}));

router.delete('/vouchers/:refId', asyncHandler(async (req, res) => {
  res.json(await deleteVoucher(req, 'PUVoucher', 'PUVoucherDetail', req.params.refId));
}));

// ─── PUOrder (Đơn mua hàng) ───

router.get('/orders', asyncHandler(async (req, res) => {
  res.json(await listVouchers(req, 'PUOrder',
    `RefID, RefType, RefDate, RefNo, AccountObjectID, AccountObjectName,
     TotalAmount, TotalAmountOC, EmployeeID, BranchID, CreatedDate`, 'RefDate'));
}));

router.get('/orders/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'PUOrder', 'PUOrderDetail', req.params.refId));
}));

router.post('/orders', asyncHandler(async (req, res) => {
  const result = await createVoucher(req, {
    masterTable: 'PUOrder', detailTable: 'PUOrderDetail',
    refType: REF_TYPES.PU_ORDER, refTypeCategory: REF_TYPE_CATEGORY.PU_ORDER,
    postToGL: false,
  });
  res.status(201).json({ success: true, data: result });
}));

router.delete('/orders/:refId', asyncHandler(async (req, res) => {
  res.json(await deleteVoucher(req, 'PUOrder', 'PUOrderDetail', req.params.refId));
}));

// ─── PUReturn (Hàng mua trả lại) ───

router.get('/returns', asyncHandler(async (req, res) => {
  res.json(await listVouchers(req, 'PUReturn',
    `RefID, RefType, RefDate, PostedDate, RefNoFinance, RefNoManagement,
     IsPostedFinance, JournalMemo, TotalAmount, TotalAmountOC,
     TotalVATAmount, CurrencyID, ExchangeRate, AccountObjectID, AccountObjectName,
     EmployeeID, BranchID, CreatedDate, ModifiedDate`));
}));

router.get('/returns/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'PUReturn', 'PUReturnDetail', req.params.refId));
}));

router.post('/returns', asyncHandler(async (req, res) => {
  const result = await createVoucher(req, {
    masterTable: 'PUReturn', detailTable: 'PUReturnDetail',
    refType: REF_TYPES.PU_RETURN, refTypeCategory: REF_TYPE_CATEGORY.PU_RETURN,
    postToGL: true,
  });
  res.status(201).json({ success: true, data: result });
}));

router.delete('/returns/:refId', asyncHandler(async (req, res) => {
  res.json(await deleteVoucher(req, 'PUReturn', 'PUReturnDetail', req.params.refId));
}));

// ─── PUService (Mua dịch vụ) ───

router.get('/services', asyncHandler(async (req, res) => {
  res.json(await listVouchers(req, 'PUService',
    `RefID, RefType, RefDate, PostedDate, RefNoFinance, RefNoManagement,
     IsPostedFinance, JournalMemo, TotalAmount, TotalAmountOC,
     TotalVATAmount, CurrencyID, ExchangeRate, AccountObjectID, AccountObjectName,
     EmployeeID, BranchID, CreatedDate, ModifiedDate`));
}));

router.get('/services/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'PUService', 'PUServiceDetail', req.params.refId));
}));

router.post('/services', asyncHandler(async (req, res) => {
  const result = await createVoucher(req, {
    masterTable: 'PUService', detailTable: 'PUServiceDetail',
    refType: REF_TYPES.PU_SERVICE, refTypeCategory: REF_TYPE_CATEGORY.PU_SERVICE,
    postToGL: true,
  });
  res.status(201).json({ success: true, data: result });
}));

router.delete('/services/:refId', asyncHandler(async (req, res) => {
  res.json(await deleteVoucher(req, 'PUService', 'PUServiceDetail', req.params.refId));
}));

// ─── PUInvoice (Hóa đơn mua hàng) ───

router.get('/invoices', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'RefDate');
  const dateFrom = req.query.dateFrom as string;
  const dateTo = req.query.dateTo as string;
  let where = 'WHERE 1=1';
  const request = pool.request();
  if (dateFrom) { where += ' AND RefDate >= @dateFrom'; request.input('dateFrom', sql.DateTime, new Date(dateFrom)); }
  if (dateTo) { where += ' AND RefDate <= @dateTo'; request.input('dateTo', sql.DateTime, new Date(dateTo)); }
  const countResult = await request.query(`SELECT COUNT(*) AS total FROM PUInvoice ${where}`);
  const total = countResult.recordset[0].total;
  const req2 = pool.request();
  if (dateFrom) req2.input('dateFrom', sql.DateTime, new Date(dateFrom));
  if (dateTo) req2.input('dateTo', sql.DateTime, new Date(dateTo));
  req2.input('offset', sql.Int, p.offset); req2.input('pageSize', sql.Int, p.pageSize);
  const result = await req2.query(`SELECT * FROM PUInvoice ${where} ORDER BY RefDate DESC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`);
  res.json(paginatedResponse(result.recordset, total, p));
}));

router.get('/invoices/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'PUInvoice', 'PUInvoiceDetail', req.params.refId));
}));

// ─── PUDiscount (Giảm giá mua hàng) ───

router.get('/discounts', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'RefDate');
  const countResult = await pool.request().query('SELECT COUNT(*) AS total FROM PUDiscount');
  const total = countResult.recordset[0].total;
  const req2 = pool.request(); req2.input('offset', sql.Int, p.offset); req2.input('pageSize', sql.Int, p.pageSize);
  const result = await req2.query(`SELECT * FROM PUDiscount ORDER BY RefDate DESC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`);
  res.json(paginatedResponse(result.recordset, total, p));
}));

router.get('/discounts/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'PUDiscount', 'PUDiscountDetail', req.params.refId));
}));

router.post('/discounts', asyncHandler(async (req, res) => {
  const result = await createVoucher(req, {
    masterTable: 'PUDiscount', detailTable: 'PUDiscountDetail',
    refType: REF_TYPES.PU_DISCOUNT, refTypeCategory: REF_TYPE_CATEGORY.PU_DISCOUNT,
    postToGL: true,
  });
  res.status(201).json({ success: true, data: result });
}));

router.delete('/discounts/:refId', asyncHandler(async (req, res) => {
  res.json(await deleteVoucher(req, 'PUDiscount', 'PUDiscountDetail', req.params.refId));
}));

export default router;
