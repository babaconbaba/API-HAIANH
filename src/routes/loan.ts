import { getPoolFromReq } from '../config/database';
import { Router } from 'express';
import { asyncHandler, sql, getPool } from '../lib/voucherHelper';
import { parsePagination, paginatedResponse } from '../middleware/pagination';
import { ApiError } from '../middleware/errorHandler';

const router = Router();

// ─── LOANAgreement (Khế ước vay) ───

router.get('/agreements', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'RefDate');
  const search = req.query.search as string;

  let where = 'WHERE 1=1';
  const request = pool.request();
  if (search) {
    where += ` AND (AgreementCode LIKE @search OR AgreementName LIKE @search OR AccountObjectName LIKE @search)`;
    request.input('search', sql.NVarChar, `%${search}%`);
  }

  try {
    const countResult = await request.query(`SELECT COUNT(*) AS total FROM LOANAgreement ${where}`);
    const total = countResult.recordset[0].total;

    const req2 = pool.request();
    if (search) req2.input('search', sql.NVarChar, `%${search}%`);
    req2.input('offset', sql.Int, p.offset);
    req2.input('pageSize', sql.Int, p.pageSize);

    const result = await req2.query(
      `SELECT * FROM LOANAgreement ${where}
       ORDER BY RefDate DESC
       OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`
    );

    res.json(paginatedResponse(result.recordset, total, p));
  } catch {
    res.json({ success: true, data: [], message: 'LOANAgreement table not available' });
  }
}));

router.get('/agreements/:id', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  try {
    const master = await pool.request()
      .input('id', sql.UniqueIdentifier, req.params.id)
      .query('SELECT * FROM LOANAgreement WHERE LOANAgreementID = @id');
    if (!master.recordset.length) throw new ApiError(404, 'NOT_FOUND', 'LOANAgreement not found');

    let calendar: any[] = [];
    try {
      const calResult = await pool.request()
        .input('id', sql.UniqueIdentifier, req.params.id)
        .query('SELECT * FROM LOANAgreementCalendar WHERE LOANAgreementID = @id ORDER BY DueDate');
      calendar = calResult.recordset;
    } catch {}

    let payments: any[] = [];
    try {
      const payResult = await pool.request()
        .input('id', sql.UniqueIdentifier, req.params.id)
        .query('SELECT * FROM LOANAgreementPayment WHERE LOANAgreementID = @id ORDER BY PaymentDate');
      payments = payResult.recordset;
    } catch {}

    res.json({ success: true, data: { ...master.recordset[0], calendar, payments } });
  } catch (err: any) {
    if (err.code === 'NOT_FOUND') throw err;
    res.json({ success: true, data: null, message: 'LOANAgreement not available' });
  }
}));

// ─── Loan Profiles ───

router.get('/profiles', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  try {
    const result = await pool.request().query('SELECT * FROM LoanProfile ORDER BY LoanProfileCode');
    res.json({ success: true, data: result.recordset });
  } catch {
    res.json({ success: true, data: [], message: 'LoanProfile not available' });
  }
}));

export default router;
