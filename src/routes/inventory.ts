import { getPoolFromReq } from '../config/database';
import { Router } from 'express';
import { asyncHandler, listVouchers, getVoucherWithDetails, deleteVoucher, getPool, sql } from '../lib/voucherHelper';
import { parsePagination, paginatedResponse } from '../middleware/pagination';
import { createVoucher } from '../lib/voucherWriter';
import { REF_TYPES, REF_TYPE_CATEGORY } from '../config/refTypes';

const router = Router();

const IN_COLS = `RefID, RefType, RefDate, PostedDate, RefNoFinance, RefNoManagement,
  IsPostedFinance, JournalMemo, TotalAmountFinance, TotalAmountManagement,
  AccountObjectID, AccountObjectName,
  BranchID, CreatedDate, ModifiedDate`;

// ─── INInward (Nhập kho) ───

router.get('/inwards', asyncHandler(async (req, res) => {
  res.json(await listVouchers(req, 'INInward', IN_COLS));
}));

router.get('/inwards/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'INInward', 'INInwardDetail', req.params.refId));
}));

router.post('/inwards', asyncHandler(async (req, res) => {
  const result = await createVoucher(req, {
    masterTable: 'INInward', detailTable: 'INInwardDetail',
    refType: REF_TYPES.IN_INWARD, refTypeCategory: REF_TYPE_CATEGORY.IN_INWARD,
    postToGL: false,
  });
  res.status(201).json({ success: true, data: result });
}));

router.delete('/inwards/:refId', asyncHandler(async (req, res) => {
  res.json(await deleteVoucher(req, 'INInward', 'INInwardDetail', req.params.refId));
}));

// ─── INOutward (Xuất kho) ───

router.get('/outwards', asyncHandler(async (req, res) => {
  res.json(await listVouchers(req, 'INOutward', IN_COLS));
}));

router.get('/outwards/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'INOutward', 'INOutwardDetail', req.params.refId));
}));

router.post('/outwards', asyncHandler(async (req, res) => {
  const result = await createVoucher(req, {
    masterTable: 'INOutward', detailTable: 'INOutwardDetail',
    refType: REF_TYPES.IN_OUTWARD, refTypeCategory: REF_TYPE_CATEGORY.IN_OUTWARD,
    postToGL: false,
  });
  res.status(201).json({ success: true, data: result });
}));

router.delete('/outwards/:refId', asyncHandler(async (req, res) => {
  res.json(await deleteVoucher(req, 'INOutward', 'INOutwardDetail', req.params.refId));
}));

// ─── INTransfer (Chuyển kho) ───

router.get('/transfers', asyncHandler(async (req, res) => {
  res.json(await listVouchers(req, 'INTransfer', IN_COLS));
}));

router.get('/transfers/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'INTransfer', 'INTransferDetail', req.params.refId));
}));

router.post('/transfers', asyncHandler(async (req, res) => {
  const result = await createVoucher(req, {
    masterTable: 'INTransfer', detailTable: 'INTransferDetail',
    refType: REF_TYPES.IN_TRANSFER, refTypeCategory: REF_TYPE_CATEGORY.IN_TRANSFER,
    postToGL: false,
  });
  res.status(201).json({ success: true, data: result });
}));

router.delete('/transfers/:refId', asyncHandler(async (req, res) => {
  res.json(await deleteVoucher(req, 'INTransfer', 'INTransferDetail', req.params.refId));
}));

// ─── INAssemblyDisassembly (Lắp ráp / Tháo dỡ) ───

router.get('/assemblies', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'RefDate');
  const countResult = await pool.request().query('SELECT COUNT(*) AS total FROM INAssemblyDisassembly');
  const total = countResult.recordset[0].total;
  const req2 = pool.request(); req2.input('offset', sql.Int, p.offset); req2.input('pageSize', sql.Int, p.pageSize);
  const result = await req2.query(`SELECT * FROM INAssemblyDisassembly ORDER BY RefDate DESC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`);
  res.json(paginatedResponse(result.recordset, total, p));
}));

router.get('/assemblies/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'INAssemblyDisassembly', 'INAssemblyDisassemblyDetail', req.params.refId));
}));

// ─── Stock (Kho) ───

router.get('/stocks', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  try {
    const result = await pool.request().query(
      `SELECT * FROM Stock ORDER BY StockCode`
    );
    res.json({ success: true, data: result.recordset });
  } catch {
    res.json({ success: true, data: [], message: 'Stock table not available' });
  }
}));

export default router;
