import { getPoolFromReq } from '../config/database';
import { Router } from 'express';
import { asyncHandler, getVoucherWithDetails, sql, getPool } from '../lib/voucherHelper';
import { parsePagination, paginatedResponse } from '../middleware/pagination';

const router = Router();

async function safeList(req: any, res: any, table: string) {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'RefDate');
  try {
    const countResult = await pool.request().query(`SELECT COUNT(*) AS total FROM ${table}`);
    const total = countResult.recordset[0].total;
    const req2 = pool.request(); req2.input('offset', sql.Int, p.offset); req2.input('pageSize', sql.Int, p.pageSize);
    const result = await req2.query(`SELECT * FROM ${table} ORDER BY RefDate DESC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`);
    res.json(paginatedResponse(result.recordset, total, p));
  } catch { res.json({ success: true, data: [], message: `${table} not available` }); }
}

// ─── CAAudit (Kiểm kê quỹ) ───
router.get('/cash', asyncHandler(async (req, res) => safeList(req, res, 'CAAudit')));
router.get('/cash/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'CAAudit', 'CAAuditDetail', req.params.refId));
}));

// ─── INAudit (Kiểm kê kho) ───
router.get('/inventory', asyncHandler(async (req, res) => safeList(req, res, 'INAudit')));
router.get('/inventory/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'INAudit', 'INAuditDetail', req.params.refId));
}));

// ─── FAAudit (Kiểm kê TSCĐ) ───
router.get('/fixed-assets', asyncHandler(async (req, res) => safeList(req, res, 'FAAudit')));
router.get('/fixed-assets/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'FAAudit', 'FAAuditDetail', req.params.refId));
}));

// ─── SUAudit (Kiểm kê CCDC) ───
router.get('/tools', asyncHandler(async (req, res) => safeList(req, res, 'SUAudit')));
router.get('/tools/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'SUAudit', 'SUAuditDetail', req.params.refId));
}));

export default router;
