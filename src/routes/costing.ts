import { getPoolFromReq } from '../config/database';
import { Router } from 'express';
import { asyncHandler, getVoucherWithDetails, sql, getPool } from '../lib/voucherHelper';
import { parsePagination, paginatedResponse } from '../middleware/pagination';

const router = Router();

// Helper: safe paginated list from any table
async function safeList(req: any, res: any, table: string, defaultSort = 'RefDate') {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, defaultSort);
  const dateFrom = req.query.dateFrom as string;
  const dateTo = req.query.dateTo as string;
  let where = 'WHERE 1=1';
  const request = pool.request();
  if (dateFrom) { where += ' AND RefDate >= @dateFrom'; request.input('dateFrom', sql.DateTime, new Date(dateFrom)); }
  if (dateTo) { where += ' AND RefDate <= @dateTo'; request.input('dateTo', sql.DateTime, new Date(dateTo)); }
  try {
    const countResult = await request.query(`SELECT COUNT(*) AS total FROM ${table} ${where}`);
    const total = countResult.recordset[0].total;
    const req2 = pool.request();
    if (dateFrom) req2.input('dateFrom', sql.DateTime, new Date(dateFrom));
    if (dateTo) req2.input('dateTo', sql.DateTime, new Date(dateTo));
    req2.input('offset', sql.Int, p.offset); req2.input('pageSize', sql.Int, p.pageSize);
    const result = await req2.query(`SELECT * FROM ${table} ${where} ORDER BY ${p.sortBy} ${p.sortDir} OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`);
    res.json(paginatedResponse(result.recordset, total, p));
  } catch { res.json({ success: true, data: [], pagination: { page: 1, pageSize: p.pageSize, totalCount: 0, totalPages: 0 } }); }
}

async function safeAll(req: any, res: any, table: string, orderBy = '1') {
  const pool = await getPoolFromReq(req);
  try {
    const result = await pool.request().query(`SELECT * FROM ${table} ORDER BY ${orderBy}`);
    res.json({ success: true, data: result.recordset });
  } catch { res.json({ success: true, data: [] }); }
}

// ─── JCPeriod (Kỳ tính giá thành) ───
router.get('/periods', asyncHandler(async (req, res) => safeList(req, res, 'JCPeriod')));
router.get('/periods/:refId', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  try {
    const master = await pool.request().input('id', sql.UniqueIdentifier, req.params.refId).query('SELECT * FROM JCPeriod WHERE RefID = @id');
    if (!master.recordset.length) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Not found' } }); return; }
    const details = await pool.request().input('id', sql.UniqueIdentifier, req.params.refId).query('SELECT * FROM JCPeriodDetail WHERE RefID = @id');
    res.json({ success: true, data: { ...master.recordset[0], details: details.recordset } });
  } catch (e: any) { res.json({ success: true, data: null, message: e.message }); }
}));

// ─── JCOPN (Dở dang đầu kỳ) ───
router.get('/opening', asyncHandler(async (req, res) => safeList(req, res, 'JCOPN')));

// ─── JCCostVoucher (Chứng từ giá thành) ───
router.get('/cost-vouchers', asyncHandler(async (req, res) => safeList(req, res, 'JCCostVoucher')));

// ─── JCAllocationExpense (Phân bổ chi phí) ───
router.get('/allocation-expenses', asyncHandler(async (req, res) => safeList(req, res, 'JCAllocationExpense')));
router.get('/allocation-expenses/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'JCAllocationExpense', 'JCAllocationExpenseDetail', req.params.refId));
}));

// ─── JCAllocationQuantum (Phân bổ định mức) ───
router.get('/allocation-quantum', asyncHandler(async (req, res) => safeList(req, res, 'JCAllocationQuantum')));

// ─── JCExpenseTranfer (Kết chuyển chi phí) ───
router.get('/expense-transfers', asyncHandler(async (req, res) => safeList(req, res, 'JCExpenseTranfer')));
router.get('/expense-transfers/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'JCExpenseTranfer', 'JCExpenseTranferDetail', req.params.refId));
}));

// ─── JCAccepted (Nghiệm thu) ───
router.get('/accepted', asyncHandler(async (req, res) => safeList(req, res, 'JCAccepted')));
router.get('/accepted/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'JCAccepted', 'JCAcceptedDetail', req.params.refId));
}));

// ─── JCUncomplete (Dở dang cuối kỳ) ───
router.get('/uncomplete', asyncHandler(async (req, res) => safeList(req, res, 'JCUncomplete')));

// ─── JCProductCostDetail (Chi tiết giá thành SP) ───
router.get('/product-cost', asyncHandler(async (req, res) => safeAll(req, res, 'JCProductCostDetail')));

// ─── JCProductQuantum (Định mức NVL) ───
router.get('/product-quantum', asyncHandler(async (req, res) => safeAll(req, res, 'JCProductQuantum')));

export default router;
