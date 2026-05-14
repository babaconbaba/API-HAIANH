import { getPoolFromReq } from '../config/database';
import { Router } from 'express';
import { asyncHandler, listVouchers, getVoucherWithDetails, deleteVoucher, sql, getPool } from '../lib/voucherHelper';
import { parsePagination, paginatedResponse } from '../middleware/pagination';

const router = Router();

// ─── Employee List (from AccountObject type=2) ───

router.get('/employees', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'AccountObjectCode');
  const search = req.query.search as string;
  const departmentId = req.query.departmentId as string;

  let where = `WHERE (AccountObjectType = 2 OR AccountObjectCode LIKE 'NV%' OR AccountObjectCode LIKE 'EMP%')`;
  const request = pool.request();
  if (search) {
    where += ` AND (AccountObjectCode LIKE @search OR AccountObjectName LIKE @search)`;
    request.input('search', sql.NVarChar, `%${search}%`);
  }
  if (departmentId) {
    where += ` AND OrganizationUnitID = @departmentId`;
    request.input('departmentId', sql.UniqueIdentifier, departmentId);
  }

  const countResult = await request.query(`SELECT COUNT(*) AS total FROM AccountObject ${where}`);
  const total = countResult.recordset[0].total;

  const req2 = pool.request();
  if (search) req2.input('search', sql.NVarChar, `%${search}%`);
  if (departmentId) req2.input('departmentId', sql.UniqueIdentifier, departmentId);
  req2.input('offset', sql.Int, p.offset);
  req2.input('pageSize', sql.Int, p.pageSize);

  const result = await req2.query(
    `SELECT AccountObjectID AS EmployeeID, AccountObjectCode AS EmployeeCode,
            AccountObjectName AS EmployeeName, Mobile, EmailAddress AS Email,
            Address, OrganizationUnitID AS DepartmentID,
            Inactive, CreatedDate, ModifiedDate
     FROM AccountObject ${where}
     ORDER BY ${p.sortBy} ${p.sortDir}
     OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`
  );

  res.json(paginatedResponse(result.recordset, total, p));
}));

// ─── Payroll Vouchers (Chứng từ lương) ───
// MISA stores payroll in PayrollDetail / PayrollHeader or similar tables

router.get('/vouchers', asyncHandler(async (req, res) => {
  // Try PayRoll table first, fallback gracefully
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'RefDate');
  const dateFrom = req.query.dateFrom as string;
  const dateTo = req.query.dateTo as string;

  let where = 'WHERE 1=1';
  const request = pool.request();
  if (dateFrom) { where += ' AND RefDate >= @dateFrom'; request.input('dateFrom', sql.DateTime, new Date(dateFrom)); }
  if (dateTo) { where += ' AND RefDate <= @dateTo'; request.input('dateTo', sql.DateTime, new Date(dateTo)); }
  request.input('offset', sql.Int, p.offset);
  request.input('pageSize', sql.Int, p.pageSize);

  try {
    const countResult = await request.query(`SELECT COUNT(*) AS total FROM PayRoll ${where}`);
    const total = countResult.recordset[0].total;

    const req2 = pool.request();
    if (dateFrom) req2.input('dateFrom', sql.DateTime, new Date(dateFrom));
    if (dateTo) req2.input('dateTo', sql.DateTime, new Date(dateTo));
    req2.input('offset', sql.Int, p.offset);
    req2.input('pageSize', sql.Int, p.pageSize);

    const result = await req2.query(
      `SELECT * FROM PayRoll ${where}
       ORDER BY RefDate DESC
       OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`
    );

    res.json(paginatedResponse(result.recordset, total, p));
  } catch {
    res.json({ success: true, data: [], message: 'PayRoll table not available in this database' });
  }
}));

// ─── Salary Sheet (Bảng lương) ───

router.get('/salary-sheet', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
  const year = parseInt(req.query.year as string) || new Date().getFullYear();

  try {
    const result = await pool.request()
      .input('month', sql.Int, month)
      .input('year', sql.Int, year)
      .query(
        `SELECT * FROM PayRollDetail
         WHERE MONTH(RefDate) = @month AND YEAR(RefDate) = @year
         ORDER BY EmployeeCode`
      );
    res.json({ success: true, data: result.recordset, month, year });
  } catch {
    // Fallback: query GL entries related to salary accounts (334, 338)
    const result = await pool.request()
      .input('month', sql.Int, month)
      .input('year', sql.Int, year)
      .query(
        `SELECT RefNo, PostedDate, AccountNumber, DebitAmount, CreditAmount,
                Description, AccountObjectName
         FROM GeneralLedger
         WHERE (AccountNumber LIKE '334%' OR AccountNumber LIKE '338%')
           AND MONTH(PostedDate) = @month AND YEAR(PostedDate) = @year
         ORDER BY PostedDate, RefNo`
      );
    res.json({ success: true, data: result.recordset, month, year, source: 'GeneralLedger' });
  }
}));

// ─── Insurance summary (BHXH, BHYT, BHTN) ───

router.get('/insurance', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
  const year = parseInt(req.query.year as string) || new Date().getFullYear();

  const result = await pool.request()
    .input('month', sql.Int, month)
    .input('year', sql.Int, year)
    .query(
      `SELECT AccountNumber,
              SUM(DebitAmount) AS TotalDebit,
              SUM(CreditAmount) AS TotalCredit
       FROM GeneralLedger
       WHERE AccountNumber LIKE '338%'
         AND MONTH(PostedDate) = @month AND YEAR(PostedDate) = @year
       GROUP BY AccountNumber
       ORDER BY AccountNumber`
    );

  res.json({ success: true, data: result.recordset, month, year });
}));

// ─── PIT (Personal Income Tax / Thuế TNCN) ───

router.get('/pit', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
  const year = parseInt(req.query.year as string) || new Date().getFullYear();

  const result = await pool.request()
    .input('month', sql.Int, month)
    .input('year', sql.Int, year)
    .query(
      `SELECT AccountNumber, AccountObjectName,
              SUM(DebitAmount) AS TotalDebit,
              SUM(CreditAmount) AS TotalCredit
       FROM GeneralLedger
       WHERE AccountNumber LIKE '3335%'
         AND MONTH(PostedDate) = @month AND YEAR(PostedDate) = @year
       GROUP BY AccountNumber, AccountObjectName
       ORDER BY AccountObjectName`
    );

  res.json({ success: true, data: result.recordset, month, year });
}));

// ─── PASalarySheet (Bảng lương chính thức) ───

router.get('/salary-sheets', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'RefDate');
  try {
    const countResult = await pool.request().query('SELECT COUNT(*) AS total FROM PASalarySheet');
    const total = countResult.recordset[0].total;
    const req2 = pool.request(); req2.input('offset', sql.Int, p.offset); req2.input('pageSize', sql.Int, p.pageSize);
    const result = await req2.query(`SELECT * FROM PASalarySheet ORDER BY RefDate DESC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`);
    res.json(paginatedResponse(result.recordset, total, p));
  } catch { res.json({ success: true, data: [], message: 'PASalarySheet not available' }); }
}));

router.get('/salary-sheets/:refId', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  try {
    const master = await pool.request().input('id', sql.UniqueIdentifier, req.params.refId)
      .query('SELECT * FROM PASalarySheet WHERE RefID = @id');
    if (!master.recordset.length) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'PASalarySheet not found' } }); return; }
    const details = await pool.request().input('id', sql.UniqueIdentifier, req.params.refId)
      .query('SELECT * FROM PASalarySheetDetail WHERE RefID = @id ORDER BY SortOrder');
    res.json({ success: true, data: { ...master.recordset[0], details: details.recordset } });
  } catch (err: any) { res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } }); }
}));

// ─── PASalaryExpense (Phân bổ chi phí lương) ───

router.get('/salary-expenses', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'RefDate');
  try {
    const countResult = await pool.request().query('SELECT COUNT(*) AS total FROM PASalaryExpense');
    const total = countResult.recordset[0].total;
    const req2 = pool.request(); req2.input('offset', sql.Int, p.offset); req2.input('pageSize', sql.Int, p.pageSize);
    const result = await req2.query(`SELECT * FROM PASalaryExpense ORDER BY RefDate DESC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`);
    res.json(paginatedResponse(result.recordset, total, p));
  } catch { res.json({ success: true, data: [], message: 'PASalaryExpense not available' }); }
}));

// ─── PATimeSheet (Bảng chấm công) ───

router.get('/timesheets', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'RefDate');
  try {
    const countResult = await pool.request().query('SELECT COUNT(*) AS total FROM PATimeSheet');
    const total = countResult.recordset[0].total;
    const req2 = pool.request(); req2.input('offset', sql.Int, p.offset); req2.input('pageSize', sql.Int, p.pageSize);
    const result = await req2.query(`SELECT * FROM PATimeSheet ORDER BY RefDate DESC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`);
    res.json(paginatedResponse(result.recordset, total, p));
  } catch { res.json({ success: true, data: [], message: 'PATimeSheet not available' }); }
}));

router.get('/timesheets/:refId', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  try {
    const master = await pool.request().input('id', sql.UniqueIdentifier, req.params.refId)
      .query('SELECT * FROM PATimeSheet WHERE RefID = @id');
    if (!master.recordset.length) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'PATimeSheet not found' } }); return; }
    const details = await pool.request().input('id', sql.UniqueIdentifier, req.params.refId)
      .query('SELECT * FROM PATimeSheetDetail WHERE RefID = @id');
    res.json({ success: true, data: { ...master.recordset[0], details: details.recordset } });
  } catch (err: any) { res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } }); }
}));

export default router;
