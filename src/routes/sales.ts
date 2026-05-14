import { getPoolFromReq } from '../config/database';
import { Router } from 'express';
import { asyncHandler, listVouchers, getVoucherWithDetails, deleteVoucher, sql, getPool } from '../lib/voucherHelper';
import { parsePagination, paginatedResponse } from '../middleware/pagination';
import { createVoucher } from '../lib/voucherWriter';
import { REF_TYPES, REF_TYPE_CATEGORY } from '../config/refTypes';

const router = Router();

const SA_COLS = `RefID, RefType, RefDate, PostedDate, RefNoFinance, RefNoManagement,
  IsPostedFinance, JournalMemo, TotalAmount, TotalAmountOC, TotalSaleAmount,
  TotalVATAmount, TotalDiscountAmount, CurrencyID, ExchangeRate,
  AccountObjectID, AccountObjectName, AccountObjectAddress, EmployeeID,
  BranchID, InvNo, InvDate, CreatedDate, ModifiedDate`;

// ─── SAVoucher (Bán hàng) ───

router.get('/vouchers', asyncHandler(async (req, res) => {
  res.json(await listVouchers(req, 'SAVoucher', SA_COLS));
}));

router.get('/vouchers/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'SAVoucher', 'SAVoucherDetail', req.params.refId));
}));

router.post('/vouchers', asyncHandler(async (req, res) => {
  const result = await createVoucher(req, {
    masterTable: 'SAVoucher', detailTable: 'SAVoucherDetail',
    refType: REF_TYPES.SA_VOUCHER, refTypeCategory: REF_TYPE_CATEGORY.SA_VOUCHER,
    postToGL: true,
  });
  res.status(201).json({ success: true, data: result });
}));

router.delete('/vouchers/:refId', asyncHandler(async (req, res) => {
  res.json(await deleteVoucher(req, 'SAVoucher', 'SAVoucherDetail', req.params.refId));
}));

// ─── SAOrder (Đơn đặt hàng) ───

router.get('/orders', asyncHandler(async (req, res) => {
  res.json(await listVouchers(req, 'SAOrder',
    `RefID, RefType, RefDate, RefNo, AccountObjectID, AccountObjectName,
     TotalAmount, TotalAmountOC, EmployeeID, BranchID, CreatedDate`, 'RefDate'));
}));

router.get('/orders/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'SAOrder', 'SAOrderDetail', req.params.refId));
}));

router.post('/orders', asyncHandler(async (req, res) => {
  const result = await createVoucher(req, {
    masterTable: 'SAOrder', detailTable: 'SAOrderDetail',
    refType: REF_TYPES.SA_ORDER, refTypeCategory: REF_TYPE_CATEGORY.SA_ORDER,
    postToGL: false,
  });
  res.status(201).json({ success: true, data: result });
}));

router.delete('/orders/:refId', asyncHandler(async (req, res) => {
  res.json(await deleteVoucher(req, 'SAOrder', 'SAOrderDetail', req.params.refId));
}));

// ─── SAReturn (Hàng bán trả lại) ───

router.get('/returns', asyncHandler(async (req, res) => {
  res.json(await listVouchers(req, 'SAReturn', SA_COLS));
}));

router.get('/returns/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'SAReturn', 'SAReturnDetail', req.params.refId));
}));

router.post('/returns', asyncHandler(async (req, res) => {
  const result = await createVoucher(req, {
    masterTable: 'SAReturn', detailTable: 'SAReturnDetail',
    refType: REF_TYPES.SA_RETURN, refTypeCategory: REF_TYPE_CATEGORY.SA_RETURN,
    postToGL: true,
  });
  res.status(201).json({ success: true, data: result });
}));

router.delete('/returns/:refId', asyncHandler(async (req, res) => {
  res.json(await deleteVoucher(req, 'SAReturn', 'SAReturnDetail', req.params.refId));
}));

// ─── SAInvoice (Hóa đơn) ───

router.get('/invoices', asyncHandler(async (req, res) => {
  res.json(await listVouchers(req, 'SAInvoice',
    `RefID, RefType, InvNo, InvDate, InvSeries,
     AccountObjectID, AccountObjectName, TotalAmount, TotalAmountOC,
     BranchID, CreatedDate`, 'InvDate'));
}));

router.get('/invoices/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'SAInvoice', 'SAInvoiceDetail', req.params.refId));
}));

router.post('/invoices', asyncHandler(async (req, res) => {
  const result = await createVoucher(req, {
    masterTable: 'SAInvoice', detailTable: 'SAInvoiceDetail',
    refType: REF_TYPES.SA_INVOICE, refTypeCategory: REF_TYPE_CATEGORY.SA_VOUCHER,
    postToGL: false,
  });
  res.status(201).json({ success: true, data: result });
}));

router.delete('/invoices/:refId', asyncHandler(async (req, res) => {
  res.json(await deleteVoucher(req, 'SAInvoice', 'SAInvoiceDetail', req.params.refId));
}));

// ─── SAQuote (Báo giá) ───

router.get('/quotes', asyncHandler(async (req, res) => {
  res.json(await listVouchers(req, 'SAQuote',
    `RefID, RefType, RefDate, RefNo, AccountObjectID, AccountObjectName,
     TotalAmount, TotalAmountOC, EmployeeID, BranchID, CreatedDate`, 'RefDate'));
}));

router.get('/quotes/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'SAQuote', 'SAQuoteDetail', req.params.refId));
}));

router.post('/quotes', asyncHandler(async (req, res) => {
  const result = await createVoucher(req, {
    masterTable: 'SAQuote', detailTable: 'SAQuoteDetail',
    refType: REF_TYPES.SA_QUOTE, refTypeCategory: REF_TYPE_CATEGORY.SA_QUOTE,
    postToGL: false,
  });
  res.status(201).json({ success: true, data: result });
}));

router.delete('/quotes/:refId', asyncHandler(async (req, res) => {
  res.json(await deleteVoucher(req, 'SAQuote', 'SAQuoteDetail', req.params.refId));
}));

// ─── SADiscount (Giảm giá bán hàng) ───

router.get('/discounts', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'RefDate');
  const dateFrom = req.query.dateFrom as string;
  const dateTo = req.query.dateTo as string;
  let where = 'WHERE 1=1';
  const request = pool.request();
  if (dateFrom) { where += ' AND RefDate >= @dateFrom'; request.input('dateFrom', sql.DateTime, new Date(dateFrom)); }
  if (dateTo) { where += ' AND RefDate <= @dateTo'; request.input('dateTo', sql.DateTime, new Date(dateTo)); }
  const countResult = await request.query(`SELECT COUNT(*) AS total FROM SADiscount ${where}`);
  const total = countResult.recordset[0].total;
  const req2 = pool.request();
  if (dateFrom) req2.input('dateFrom', sql.DateTime, new Date(dateFrom));
  if (dateTo) req2.input('dateTo', sql.DateTime, new Date(dateTo));
  req2.input('offset', sql.Int, p.offset); req2.input('pageSize', sql.Int, p.pageSize);
  const result = await req2.query(`SELECT * FROM SADiscount ${where} ORDER BY RefDate DESC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`);
  res.json(paginatedResponse(result.recordset, total, p));
}));

router.get('/discounts/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'SADiscount', 'SADiscountDetail', req.params.refId));
}));

router.post('/discounts', asyncHandler(async (req, res) => {
  const result = await createVoucher(req, {
    masterTable: 'SADiscount', detailTable: 'SADiscountDetail',
    refType: REF_TYPES.SA_DISCOUNT, refTypeCategory: REF_TYPE_CATEGORY.SA_DISCOUNT,
    postToGL: true,
  });
  res.status(201).json({ success: true, data: result });
}));

router.delete('/discounts/:refId', asyncHandler(async (req, res) => {
  res.json(await deleteVoucher(req, 'SADiscount', 'SADiscountDetail', req.params.refId));
}));

export default router;
