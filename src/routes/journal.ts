import { getPoolFromReq } from '../config/database';
import { Router } from 'express';
import { asyncHandler, listVouchers, getVoucherWithDetails, deleteVoucher, sql, getPool } from '../lib/voucherHelper';
import { parsePagination, paginatedResponse } from '../middleware/pagination';
import { createVoucher } from '../lib/voucherWriter';
import { REF_TYPES, REF_TYPE_CATEGORY } from '../config/refTypes';

const router = Router();

const VOUCHER_COLS = `RefID, RefType, RefDate, PostedDate, RefNoFinance, RefNoManagement,
  IsPostedFinance, IsPostedManagement, JournalMemo, TotalAmount, TotalAmountOC,
  CurrencyID, ExchangeRate, AccountObjectID, AccountObjectName, BranchID,
  CreatedDate, ModifiedDate`;

// ─── GeneralLedger (read-only query) ───

router.get('/general-ledger', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const dateFrom = req.query.dateFrom as string;
  const dateTo = req.query.dateTo as string;
  const account = req.query.account as string;
  const refType = req.query.refType as string;
  const branchId = req.query.branchId as string;
  const limit = Math.min(500, parseInt(req.query.limit as string) || 100);

  let where = 'WHERE 1=1';
  const request = pool.request();
  if (dateFrom) { where += ' AND PostedDate >= @dateFrom'; request.input('dateFrom', sql.DateTime, new Date(dateFrom)); }
  if (dateTo) { where += ' AND PostedDate <= @dateTo'; request.input('dateTo', sql.DateTime, new Date(dateTo)); }
  if (account) { where += ' AND AccountNumber = @account'; request.input('account', sql.NVarChar, account); }
  if (refType) { where += ' AND RefType = @refType'; request.input('refType', sql.Int, parseInt(refType)); }
  if (branchId) { where += ' AND BranchID = @branchId'; request.input('branchId', sql.UniqueIdentifier, branchId); }
  request.input('limit', sql.Int, limit);

  const result = await request.query(
    `SELECT TOP (@limit) *
     FROM GeneralLedger ${where} ORDER BY PostedDate DESC, RefNo`
  );
  res.json({ success: true, data: result.recordset, count: result.recordset.length });
}));

// ─── GeneralLedger account balance ───

router.get('/account-balance', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const account = req.query.account as string;
  const dateFrom = req.query.dateFrom as string;
  const dateTo = req.query.dateTo as string;

  if (!account) {
    res.status(422).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'account is required' } });
    return;
  }

  const request = pool.request();
  request.input('account', sql.NVarChar, account);

  let dateWhere = '';
  if (dateFrom) { dateWhere += ' AND PostedDate >= @dateFrom'; request.input('dateFrom', sql.DateTime, new Date(dateFrom)); }
  if (dateTo) { dateWhere += ' AND PostedDate <= @dateTo'; request.input('dateTo', sql.DateTime, new Date(dateTo)); }

  const result = await request.query(
    `SELECT AccountNumber,
            SUM(CASE WHEN DebitAmount > 0 THEN DebitAmount ELSE 0 END) AS TotalDebit,
            SUM(CASE WHEN CreditAmount > 0 THEN CreditAmount ELSE 0 END) AS TotalCredit,
            SUM(ISNULL(DebitAmount,0)) - SUM(ISNULL(CreditAmount,0)) AS Balance,
            COUNT(*) AS EntryCount
     FROM GeneralLedger
     WHERE AccountNumber = @account ${dateWhere}
     GROUP BY AccountNumber`
  );

  res.json({ success: true, data: result.recordset[0] || { AccountNumber: account, TotalDebit: 0, TotalCredit: 0, Balance: 0, EntryCount: 0 } });
}));

// ─── GLVoucher (Chứng từ nghiệp vụ khác) ───

router.get('/gl-vouchers', asyncHandler(async (req, res) => {
  res.json(await listVouchers(req, 'GLVoucher', VOUCHER_COLS));
}));

router.get('/gl-vouchers/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'GLVoucher', 'GLVoucherDetail', req.params.refId));
}));

router.post('/gl-vouchers', asyncHandler(async (req, res) => {
  const result = await createVoucher(req, {
    masterTable: 'GLVoucher', detailTable: 'GLVoucherDetail',
    refType: REF_TYPES.GL_VOUCHER, refTypeCategory: REF_TYPE_CATEGORY.GL_VOUCHER,
    postToGL: false,
  });
  res.status(201).json({ success: true, data: result });
}));

router.delete('/gl-vouchers/:refId', asyncHandler(async (req, res) => {
  res.json(await deleteVoucher(req, 'GLVoucher', 'GLVoucherDetail', req.params.refId));
}));

// ─── Cash Receipts (Phiếu thu) ───

router.get('/cash/receipts', asyncHandler(async (req, res) => {
  res.json(await listVouchers(req, 'CAReceipt', VOUCHER_COLS));
}));

router.get('/cash/receipts/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'CAReceipt', 'CAReceiptDetail', req.params.refId));
}));

router.post('/cash/receipts', asyncHandler(async (req, res) => {
  const result = await createVoucher(req, {
    masterTable: 'CAReceipt', detailTable: 'CAReceiptDetail',
    refType: REF_TYPES.CA_RECEIPT, refTypeCategory: REF_TYPE_CATEGORY.CA_RECEIPT,
    postToGL: false,
  });
  res.status(201).json({ success: true, data: result });
}));

router.delete('/cash/receipts/:refId', asyncHandler(async (req, res) => {
  res.json(await deleteVoucher(req, 'CAReceipt', 'CAReceiptDetail', req.params.refId));
}));

// ─── Cash Payments (Phiếu chi) ───

router.get('/cash/payments', asyncHandler(async (req, res) => {
  res.json(await listVouchers(req, 'CAPayment', VOUCHER_COLS));
}));

router.get('/cash/payments/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'CAPayment', 'CAPaymentDetail', req.params.refId));
}));

router.post('/cash/payments', asyncHandler(async (req, res) => {
  const result = await createVoucher(req, {
    masterTable: 'CAPayment', detailTable: 'CAPaymentDetail',
    refType: REF_TYPES.CA_PAYMENT, refTypeCategory: REF_TYPE_CATEGORY.CA_PAYMENT,
    postToGL: false,
  });
  res.status(201).json({ success: true, data: result });
}));

router.delete('/cash/payments/:refId', asyncHandler(async (req, res) => {
  res.json(await deleteVoucher(req, 'CAPayment', 'CAPaymentDetail', req.params.refId));
}));

// ─── Bank Deposits (Thu tiền gửi) ───

router.get('/bank/deposits', asyncHandler(async (req, res) => {
  res.json(await listVouchers(req, 'BADeposit', VOUCHER_COLS));
}));

router.get('/bank/deposits/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'BADeposit', 'BADepositDetail', req.params.refId));
}));

router.post('/bank/deposits', asyncHandler(async (req, res) => {
  const result = await createVoucher(req, {
    masterTable: 'BADeposit', detailTable: 'BADepositDetail',
    refType: REF_TYPES.BA_DEPOSIT, refTypeCategory: REF_TYPE_CATEGORY.BA_DEPOSIT,
    postToGL: false,
  });
  res.status(201).json({ success: true, data: result });
}));

router.delete('/bank/deposits/:refId', asyncHandler(async (req, res) => {
  res.json(await deleteVoucher(req, 'BADeposit', 'BADepositDetail', req.params.refId));
}));

// ─── Bank Withdrawals (Ủy nhiệm chi) ───

router.get('/bank/withdrawals', asyncHandler(async (req, res) => {
  res.json(await listVouchers(req, 'BAWithDraw', VOUCHER_COLS));
}));

router.get('/bank/withdrawals/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'BAWithDraw', 'BAWithDrawDetail', req.params.refId));
}));

router.post('/bank/withdrawals', asyncHandler(async (req, res) => {
  const result = await createVoucher(req, {
    masterTable: 'BAWithDraw', detailTable: 'BAWithDrawDetail',
    refType: REF_TYPES.BA_WITHDRAW, refTypeCategory: REF_TYPE_CATEGORY.BA_WITHDRAW,
    postToGL: false,
  });
  res.status(201).json({ success: true, data: result });
}));

router.delete('/bank/withdrawals/:refId', asyncHandler(async (req, res) => {
  res.json(await deleteVoucher(req, 'BAWithDraw', 'BAWithDrawDetail', req.params.refId));
}));

// ─── Bank Internal Transfer (Chuyển tiền nội bộ) ───

router.get('/bank/internal-transfers', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'RefDate');
  const dateFrom = req.query.dateFrom as string;
  const dateTo = req.query.dateTo as string;
  let where = 'WHERE 1=1';
  const request = pool.request();
  if (dateFrom) { where += ' AND RefDate >= @dateFrom'; request.input('dateFrom', sql.DateTime, new Date(dateFrom)); }
  if (dateTo) { where += ' AND RefDate <= @dateTo'; request.input('dateTo', sql.DateTime, new Date(dateTo)); }
  const countResult = await request.query(`SELECT COUNT(*) AS total FROM BAInternalTransfer ${where}`);
  const total = countResult.recordset[0].total;
  const req2 = pool.request();
  if (dateFrom) req2.input('dateFrom', sql.DateTime, new Date(dateFrom));
  if (dateTo) req2.input('dateTo', sql.DateTime, new Date(dateTo));
  req2.input('offset', sql.Int, p.offset); req2.input('pageSize', sql.Int, p.pageSize);
  const result = await req2.query(`SELECT * FROM BAInternalTransfer ${where} ORDER BY RefDate DESC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`);
  res.json(paginatedResponse(result.recordset, total, p));
}));

router.get('/bank/internal-transfers/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'BAInternalTransfer', 'BAInternalTransferDetail', req.params.refId));
}));

router.post('/bank/internal-transfers', asyncHandler(async (req, res) => {
  const result = await createVoucher(req, {
    masterTable: 'BAInternalTransfer', detailTable: 'BAInternalTransferDetail',
    refType: REF_TYPES.BA_INTERNAL_TRANSFER, refTypeCategory: REF_TYPE_CATEGORY.BA_INTERNAL_TRANSFER,
    postToGL: false,
  });
  res.status(201).json({ success: true, data: result });
}));

router.delete('/bank/internal-transfers/:refId', asyncHandler(async (req, res) => {
  res.json(await deleteVoucher(req, 'BAInternalTransfer', 'BAInternalTransferDetail', req.params.refId));
}));

// ─── GLVoucher (Chứng từ nghiệp vụ khác) ───

router.get('/gl-vouchers', asyncHandler(async (req, res) => {
  res.json(await listVouchers(req, 'GLVoucher', VOUCHER_COLS));
}));

router.get('/gl-vouchers/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'GLVoucher', 'GLVoucherDetail', req.params.refId));
}));

router.post('/gl-vouchers', asyncHandler(async (req, res) => {
  const result = await createVoucher(req, {
    masterTable: 'GLVoucher', detailTable: 'GLVoucherDetail',
    refType: REF_TYPES.GL_VOUCHER, refTypeCategory: REF_TYPE_CATEGORY.GL_VOUCHER,
    postToGL: false,
  });
  res.status(201).json({ success: true, data: result });
}));

router.delete('/gl-vouchers/:refId', asyncHandler(async (req, res) => {
  res.json(await deleteVoucher(req, 'GLVoucher', 'GLVoucherDetail', req.params.refId));
}));

export default router;
