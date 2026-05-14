import { getPoolFromReq } from '../config/database';
import { Router } from 'express';
import { asyncHandler, sql, getPool } from '../lib/voucherHelper';
import { parsePagination, paginatedResponse } from '../middleware/pagination';

const router = Router();

// ─── VAT Input (Thuế GTGT đầu vào) ───

router.get('/vat-input', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const dateFrom = req.query.dateFrom as string;
  const dateTo = req.query.dateTo as string;
  const p = parsePagination(req, 'PostedDate');

  let where = `WHERE AccountNumber LIKE '133%'`;
  const request = pool.request();
  if (dateFrom) { where += ' AND PostedDate >= @dateFrom'; request.input('dateFrom', sql.DateTime, new Date(dateFrom)); }
  if (dateTo) { where += ' AND PostedDate <= @dateTo'; request.input('dateTo', sql.DateTime, new Date(dateTo)); }

  const countResult = await request.query(`SELECT COUNT(*) AS total FROM GeneralLedger ${where}`);
  const total = countResult.recordset[0].total;

  const req2 = pool.request();
  if (dateFrom) req2.input('dateFrom', sql.DateTime, new Date(dateFrom));
  if (dateTo) req2.input('dateTo', sql.DateTime, new Date(dateTo));
  req2.input('offset', sql.Int, p.offset);
  req2.input('pageSize', sql.Int, p.pageSize);

  const result = await req2.query(
    `SELECT RefID, RefNo, RefDate, PostedDate, AccountNumber,
            DebitAmount, CreditAmount, Description,
            AccountObjectName, InvNo, InvDate, InvSeries,
            BranchID
     FROM GeneralLedger ${where}
     ORDER BY ${p.sortBy} ${p.sortDir}
     OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`
  );

  res.json(paginatedResponse(result.recordset, total, p));
}));

// ─── VAT Output (Thuế GTGT đầu ra) ───

router.get('/vat-output', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const dateFrom = req.query.dateFrom as string;
  const dateTo = req.query.dateTo as string;
  const p = parsePagination(req, 'PostedDate');

  let where = `WHERE AccountNumber LIKE '3331%'`;
  const request = pool.request();
  if (dateFrom) { where += ' AND PostedDate >= @dateFrom'; request.input('dateFrom', sql.DateTime, new Date(dateFrom)); }
  if (dateTo) { where += ' AND PostedDate <= @dateTo'; request.input('dateTo', sql.DateTime, new Date(dateTo)); }

  const countResult = await request.query(`SELECT COUNT(*) AS total FROM GeneralLedger ${where}`);
  const total = countResult.recordset[0].total;

  const req2 = pool.request();
  if (dateFrom) req2.input('dateFrom', sql.DateTime, new Date(dateFrom));
  if (dateTo) req2.input('dateTo', sql.DateTime, new Date(dateTo));
  req2.input('offset', sql.Int, p.offset);
  req2.input('pageSize', sql.Int, p.pageSize);

  const result = await req2.query(
    `SELECT RefID, RefNo, RefDate, PostedDate, AccountNumber,
            DebitAmount, CreditAmount, Description,
            AccountObjectName, InvNo, InvDate, InvSeries,
            BranchID
     FROM GeneralLedger ${where}
     ORDER BY ${p.sortBy} ${p.sortDir}
     OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`
  );

  res.json(paginatedResponse(result.recordset, total, p));
}));

// ─── VAT Summary (Tổng hợp thuế GTGT) ───

router.get('/vat-summary', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const dateFrom = req.query.dateFrom as string;
  const dateTo = req.query.dateTo as string;

  const request = pool.request();
  let dateWhere = '';
  if (dateFrom) { dateWhere += ' AND PostedDate >= @dateFrom'; request.input('dateFrom', sql.DateTime, new Date(dateFrom)); }
  if (dateTo) { dateWhere += ' AND PostedDate <= @dateTo'; request.input('dateTo', sql.DateTime, new Date(dateTo)); }

  const result = await request.query(
    `SELECT
       SUM(CASE WHEN AccountNumber LIKE '133%' THEN DebitAmount ELSE 0 END) AS VATInputDebit,
       SUM(CASE WHEN AccountNumber LIKE '133%' THEN CreditAmount ELSE 0 END) AS VATInputCredit,
       SUM(CASE WHEN AccountNumber LIKE '3331%' THEN DebitAmount ELSE 0 END) AS VATOutputDebit,
       SUM(CASE WHEN AccountNumber LIKE '3331%' THEN CreditAmount ELSE 0 END) AS VATOutputCredit,
       SUM(CASE WHEN AccountNumber LIKE '3331%' THEN CreditAmount ELSE 0 END)
         - SUM(CASE WHEN AccountNumber LIKE '133%' THEN DebitAmount ELSE 0 END) AS VATPayable
     FROM GeneralLedger
     WHERE (AccountNumber LIKE '133%' OR AccountNumber LIKE '3331%') ${dateWhere}`
  );

  res.json({ success: true, data: result.recordset[0] });
}));

// ─── Corporate Income Tax (Thuế TNDN - TK 3334) ───

router.get('/cit', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const dateFrom = req.query.dateFrom as string;
  const dateTo = req.query.dateTo as string;

  const request = pool.request();
  let dateWhere = '';
  if (dateFrom) { dateWhere += ' AND PostedDate >= @dateFrom'; request.input('dateFrom', sql.DateTime, new Date(dateFrom)); }
  if (dateTo) { dateWhere += ' AND PostedDate <= @dateTo'; request.input('dateTo', sql.DateTime, new Date(dateTo)); }

  const result = await request.query(
    `SELECT AccountNumber,
            SUM(DebitAmount) AS TotalDebit,
            SUM(CreditAmount) AS TotalCredit,
            SUM(ISNULL(CreditAmount,0)) - SUM(ISNULL(DebitAmount,0)) AS Balance
     FROM GeneralLedger
     WHERE AccountNumber LIKE '3334%' ${dateWhere}
     GROUP BY AccountNumber
     ORDER BY AccountNumber`
  );

  res.json({ success: true, data: result.recordset });
}));

// ─── Tax Summary by Account (Tổng hợp theo TK thuế 333x) ───

router.get('/summary', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const dateFrom = req.query.dateFrom as string;
  const dateTo = req.query.dateTo as string;

  const request = pool.request();
  let dateWhere = '';
  if (dateFrom) { dateWhere += ' AND PostedDate >= @dateFrom'; request.input('dateFrom', sql.DateTime, new Date(dateFrom)); }
  if (dateTo) { dateWhere += ' AND PostedDate <= @dateTo'; request.input('dateTo', sql.DateTime, new Date(dateTo)); }

  const result = await request.query(
    `SELECT AccountNumber,
            SUM(DebitAmount) AS TotalDebit,
            SUM(CreditAmount) AS TotalCredit,
            SUM(ISNULL(CreditAmount,0)) - SUM(ISNULL(DebitAmount,0)) AS Balance,
            COUNT(*) AS EntryCount
     FROM GeneralLedger
     WHERE AccountNumber LIKE '333%' ${dateWhere}
     GROUP BY AccountNumber
     ORDER BY AccountNumber`
  );

  res.json({ success: true, data: result.recordset });
}));

export default router;
