import { getPoolFromReq } from '../config/database';
import { Router } from 'express';
import { asyncHandler, sql, getPool } from '../lib/voucherHelper';
import { parsePagination, paginatedResponse } from '../middleware/pagination';

const router = Router();

// ─── PrepaidExpenses (Chi phí trả trước - TK 242) ───

router.get('/prepaid-expenses', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'RefDate');
  try {
    const countResult = await pool.request().query('SELECT COUNT(*) AS total FROM PrepaidExpenses');
    const total = countResult.recordset[0].total;
    const req2 = pool.request(); req2.input('offset', sql.Int, p.offset); req2.input('pageSize', sql.Int, p.pageSize);
    const result = await req2.query(`SELECT * FROM PrepaidExpenses ORDER BY RefDate DESC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`);
    res.json(paginatedResponse(result.recordset, total, p));
  } catch { res.json({ success: true, data: [] }); }
}));

router.get('/prepaid-expenses/:id', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const master = await pool.request().input('id', sql.UniqueIdentifier, req.params.id)
    .query('SELECT * FROM PrepaidExpenses WHERE PrepaidExpenseID = @id');
  if (!master.recordset.length) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Not found' } }); return; }
  let details: any[] = [];
  try { details = (await pool.request().input('id', sql.UniqueIdentifier, req.params.id).query('SELECT * FROM PrepaidExpensesDetail WHERE PrepaidExpenseID = @id')).recordset; } catch (e: any) { console.warn('[WARN]', e.message?.substring(0, 100)); }
  res.json({ success: true, data: { ...master.recordset[0], details } });
}));

// ─── PreReceiptRevenue (Doanh thu chưa thực hiện) ───

router.get('/deferred-revenue', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'RefDate');
  try {
    const countResult = await pool.request().query('SELECT COUNT(*) AS total FROM PreReceiptRevenue');
    const total = countResult.recordset[0].total;
    const req2 = pool.request(); req2.input('offset', sql.Int, p.offset); req2.input('pageSize', sql.Int, p.pageSize);
    const result = await req2.query(`SELECT * FROM PreReceiptRevenue ORDER BY RefDate DESC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`);
    res.json(paginatedResponse(result.recordset, total, p));
  } catch { res.json({ success: true, data: [] }); }
}));

// ─── Job (Đối tượng THCP / Vụ việc) ───

router.get('/jobs', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const search = req.query.search as string;
  let where = 'WHERE 1=1';
  const request = pool.request();
  if (search) { where += ` AND (JobCode LIKE @search OR JobName LIKE @search)`; request.input('search', sql.NVarChar, `%${search}%`); }
  try {
    const result = await request.query(`SELECT * FROM Job ${where} ORDER BY JobCode`);
    res.json({ success: true, data: result.recordset });
  } catch { res.json({ success: true, data: [] }); }
}));

router.get('/jobs/:id', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const result = await pool.request().input('id', sql.UniqueIdentifier, req.params.id)
    .query('SELECT * FROM Job WHERE JobID = @id');
  if (!result.recordset.length) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Job not found' } }); return; }
  res.json({ success: true, data: result.recordset[0] });
}));

// ─── ProjectWork (Công trình / Dự án) ───

router.get('/projects', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const search = req.query.search as string;
  let where = 'WHERE 1=1';
  const request = pool.request();
  if (search) { where += ` AND (ProjectWorkCode LIKE @search OR ProjectWorkName LIKE @search)`; request.input('search', sql.NVarChar, `%${search}%`); }
  try {
    const result = await request.query(`SELECT * FROM ProjectWork ${where} ORDER BY ProjectWorkCode`);
    res.json({ success: true, data: result.recordset });
  } catch { res.json({ success: true, data: [] }); }
}));

router.get('/projects/:id', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const result = await pool.request().input('id', sql.UniqueIdentifier, req.params.id)
    .query('SELECT * FROM ProjectWork WHERE ProjectWorkID = @id');
  if (!result.recordset.length) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'ProjectWork not found' } }); return; }
  res.json({ success: true, data: result.recordset[0] });
}));

// ─── ExpenseItem (Khoản mục chi phí) ───

router.get('/expense-items', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  try {
    const result = await pool.request().query('SELECT * FROM ExpenseItem ORDER BY ExpenseItemCode');
    res.json({ success: true, data: result.recordset });
  } catch { res.json({ success: true, data: [] }); }
}));

// ─── OpeningAccountEntry (Số dư đầu kỳ TK) ───

router.get('/opening-accounts', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'RefDate');
  try {
    const countResult = await pool.request().query('SELECT COUNT(*) AS total FROM OpeningAccountEntry');
    const total = countResult.recordset[0].total;
    const req2 = pool.request(); req2.input('offset', sql.Int, p.offset); req2.input('pageSize', sql.Int, p.pageSize);
    const result = await req2.query(`SELECT * FROM OpeningAccountEntry ORDER BY RefDate DESC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`);
    res.json(paginatedResponse(result.recordset, total, p));
  } catch { res.json({ success: true, data: [] }); }
}));

// ─── OpeningInventoryEntry (Số dư đầu kỳ kho) ───

router.get('/opening-inventory', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'RefDate');
  try {
    const countResult = await pool.request().query('SELECT COUNT(*) AS total FROM OpeningInventoryEntry');
    const total = countResult.recordset[0].total;
    const req2 = pool.request(); req2.input('offset', sql.Int, p.offset); req2.input('pageSize', sql.Int, p.pageSize);
    const result = await req2.query(`SELECT * FROM OpeningInventoryEntry ORDER BY RefDate DESC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`);
    res.json(paginatedResponse(result.recordset, total, p));
  } catch { res.json({ success: true, data: [] }); }
}));

// ─── BudgetItem (Mục ngân sách) ───

router.get('/budget-items', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  try {
    const result = await pool.request().query('SELECT * FROM BudgetItem ORDER BY BudgetItemCode');
    res.json({ success: true, data: result.recordset });
  } catch { res.json({ success: true, data: [] }); }
}));

// ─── Bank (Ngân hàng master) ───

router.get('/banks', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  try {
    const result = await pool.request().query('SELECT * FROM Bank ORDER BY BankName');
    res.json({ success: true, data: result.recordset });
  } catch { res.json({ success: true, data: [] }); }
}));

// ─── CCY (Tỷ giá) ───

router.get('/exchange-rates', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  try {
    const result = await pool.request().query('SELECT * FROM CCY ORDER BY ExchangeRateDate DESC');
    res.json({ success: true, data: result.recordset });
  } catch { res.json({ success: true, data: [] }); }
}));

// ─── PUContract (Hợp đồng mua) ───

router.get('/purchase-contracts', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'RefDate');
  try {
    const countResult = await pool.request().query('SELECT COUNT(*) AS total FROM PUContract');
    const total = countResult.recordset[0].total;
    const req2 = pool.request(); req2.input('offset', sql.Int, p.offset); req2.input('pageSize', sql.Int, p.pageSize);
    const result = await req2.query(`SELECT * FROM PUContract ORDER BY RefDate DESC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`);
    res.json(paginatedResponse(result.recordset, total, p));
  } catch { res.json({ success: true, data: [] }); }
}));

router.get('/purchase-contracts/:id', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const master = await pool.request().input('id', sql.UniqueIdentifier, req.params.id).query('SELECT * FROM PUContract WHERE RefID = @id');
  if (!master.recordset.length) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Not found' } }); return; }
  let details: any[] = [];
  try { details = (await pool.request().input('id', sql.UniqueIdentifier, req.params.id).query('SELECT * FROM PUContractDetailInventoryItem WHERE RefID = @id')).recordset; } catch (e: any) { console.warn('[WARN]', e.message?.substring(0, 100)); }
  res.json({ success: true, data: { ...master.recordset[0], details } });
}));

// ─── SAPolicy (Chính sách giá) ───

router.get('/sale-policies', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  try {
    const result = await pool.request().query('SELECT * FROM SAPolicy ORDER BY SAPolicyCode');
    res.json({ success: true, data: result.recordset });
  } catch { res.json({ success: true, data: [] }); }
}));

router.get('/sale-groups', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  try {
    const result = await pool.request().query('SELECT * FROM SASaleGroup ORDER BY SASaleGroupCode');
    res.json({ success: true, data: result.recordset });
  } catch { res.json({ success: true, data: [] }); }
}));

// ─── INProductionOrder (Lệnh sản xuất) ───

router.get('/production-orders', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'RefDate');
  try {
    const countResult = await pool.request().query('SELECT COUNT(*) AS total FROM INProductionOrder');
    const total = countResult.recordset[0].total;
    const req2 = pool.request(); req2.input('offset', sql.Int, p.offset); req2.input('pageSize', sql.Int, p.pageSize);
    const result = await req2.query(`SELECT * FROM INProductionOrder ORDER BY RefDate DESC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`);
    res.json(paginatedResponse(result.recordset, total, p));
  } catch { res.json({ success: true, data: [] }); }
}));

router.get('/production-orders/:refId', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  try {
    const master = await pool.request().input('id', sql.UniqueIdentifier, req.params.refId).query('SELECT * FROM INProductionOrder WHERE RefID = @id');
    if (!master.recordset.length) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Not found' } }); return; }
    const details = await pool.request().input('id', sql.UniqueIdentifier, req.params.refId).query('SELECT * FROM INProductionOrderDetail WHERE RefID = @id');
    const products = await pool.request().input('id', sql.UniqueIdentifier, req.params.refId).query('SELECT * FROM INProductionOrderProduct WHERE RefID = @id');
    res.json({ success: true, data: { ...master.recordset[0], details: details.recordset, products: products.recordset } });
  } catch (e: any) { res.json({ success: true, data: null, message: e.message }); }
}));

// ─── InvestmentProject (Dự án đầu tư) ───

router.get('/investment-projects', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  try {
    const result = await pool.request().query('SELECT * FROM InvestmentProject ORDER BY InvestmentProjectCode');
    res.json({ success: true, data: result.recordset });
  } catch { res.json({ success: true, data: [] }); }
}));

// ─── DebtTracking (Theo dõi công nợ) ───

router.get('/debt-periods', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  try {
    const result = await pool.request().query('SELECT * FROM DebtPeriod ORDER BY FromDate DESC');
    res.json({ success: true, data: result.recordset });
  } catch { res.json({ success: true, data: [] }); }
}));

router.get('/debt-lists', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'RefDate');
  try {
    const countResult = await pool.request().query('SELECT COUNT(*) AS total FROM DebtList');
    const total = countResult.recordset[0].total;
    const req2 = pool.request(); req2.input('offset', sql.Int, p.offset); req2.input('pageSize', sql.Int, p.pageSize);
    const result = await req2.query(`SELECT * FROM DebtList ORDER BY RefDate DESC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`);
    res.json(paginatedResponse(result.recordset, total, p));
  } catch { res.json({ success: true, data: [] }); }
}));

// ─── BAReconcile (Đối chiếu ngân hàng) ───

router.get('/bank-reconcile', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  try {
    const result = await pool.request().query('SELECT * FROM BAReconcile ORDER BY 1');
    res.json({ success: true, data: result.recordset });
  } catch { res.json({ success: true, data: [] }); }
}));

// ─── Ledgers (Sổ phụ) ───

router.get('/inventory-ledger', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'PostedDate');
  const dateFrom = req.query.dateFrom as string;
  const dateTo = req.query.dateTo as string;
  const itemId = req.query.inventoryItemId as string;
  let where = 'WHERE 1=1';
  const request = pool.request();
  if (dateFrom) { where += ' AND PostedDate >= @dateFrom'; request.input('dateFrom', sql.DateTime, new Date(dateFrom)); }
  if (dateTo) { where += ' AND PostedDate <= @dateTo'; request.input('dateTo', sql.DateTime, new Date(dateTo)); }
  if (itemId) { where += ' AND InventoryItemID = @itemId'; request.input('itemId', sql.UniqueIdentifier, itemId); }
  try {
    const countResult = await request.query(`SELECT COUNT(*) AS total FROM InventoryLedger ${where}`);
    const total = countResult.recordset[0].total;
    const req2 = pool.request();
    if (dateFrom) req2.input('dateFrom', sql.DateTime, new Date(dateFrom));
    if (dateTo) req2.input('dateTo', sql.DateTime, new Date(dateTo));
    if (itemId) req2.input('itemId', sql.UniqueIdentifier, itemId);
    req2.input('offset', sql.Int, p.offset); req2.input('pageSize', sql.Int, p.pageSize);
    const result = await req2.query(`SELECT * FROM InventoryLedger ${where} ORDER BY PostedDate DESC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`);
    res.json(paginatedResponse(result.recordset, total, p));
  } catch { res.json({ success: true, data: [] }); }
}));

router.get('/fixed-asset-ledger', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'PostedDate');
  try {
    const countResult = await pool.request().query('SELECT COUNT(*) AS total FROM FixedAssetLedger');
    const total = countResult.recordset[0].total;
    const req2 = pool.request(); req2.input('offset', sql.Int, p.offset); req2.input('pageSize', sql.Int, p.pageSize);
    const result = await req2.query(`SELECT * FROM FixedAssetLedger ORDER BY PostedDate DESC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`);
    res.json(paginatedResponse(result.recordset, total, p));
  } catch { res.json({ success: true, data: [] }); }
}));

router.get('/sale-ledger', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'PostedDate');
  const dateFrom = req.query.dateFrom as string;
  const dateTo = req.query.dateTo as string;
  let where = 'WHERE 1=1';
  const request = pool.request();
  if (dateFrom) { where += ' AND PostedDate >= @dateFrom'; request.input('dateFrom', sql.DateTime, new Date(dateFrom)); }
  if (dateTo) { where += ' AND PostedDate <= @dateTo'; request.input('dateTo', sql.DateTime, new Date(dateTo)); }
  try {
    const countResult = await request.query(`SELECT COUNT(*) AS total FROM SaleLedger ${where}`);
    const total = countResult.recordset[0].total;
    const req2 = pool.request();
    if (dateFrom) req2.input('dateFrom', sql.DateTime, new Date(dateFrom));
    if (dateTo) req2.input('dateTo', sql.DateTime, new Date(dateTo));
    req2.input('offset', sql.Int, p.offset); req2.input('pageSize', sql.Int, p.pageSize);
    const result = await req2.query(`SELECT * FROM SaleLedger ${where} ORDER BY PostedDate DESC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`);
    res.json(paginatedResponse(result.recordset, total, p));
  } catch { res.json({ success: true, data: [] }); }
}));

router.get('/purchase-ledger', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'PostedDate');
  const dateFrom = req.query.dateFrom as string;
  const dateTo = req.query.dateTo as string;
  let where = 'WHERE 1=1';
  const request = pool.request();
  if (dateFrom) { where += ' AND PostedDate >= @dateFrom'; request.input('dateFrom', sql.DateTime, new Date(dateFrom)); }
  if (dateTo) { where += ' AND PostedDate <= @dateTo'; request.input('dateTo', sql.DateTime, new Date(dateTo)); }
  try {
    const countResult = await request.query(`SELECT COUNT(*) AS total FROM PurchaseLedger ${where}`);
    const total = countResult.recordset[0].total;
    const req2 = pool.request();
    if (dateFrom) req2.input('dateFrom', sql.DateTime, new Date(dateFrom));
    if (dateTo) req2.input('dateTo', sql.DateTime, new Date(dateTo));
    req2.input('offset', sql.Int, p.offset); req2.input('pageSize', sql.Int, p.pageSize);
    const result = await req2.query(`SELECT * FROM PurchaseLedger ${where} ORDER BY PostedDate DESC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`);
    res.json(paginatedResponse(result.recordset, total, p));
  } catch { res.json({ success: true, data: [] }); }
}));

// ─── Location (Địa điểm) ───

router.get('/locations', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  try {
    const result = await pool.request().query('SELECT * FROM Location ORDER BY LocationCode');
    res.json({ success: true, data: result.recordset });
  } catch { res.json({ success: true, data: [] }); }
}));

export default router;
