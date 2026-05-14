import { getPoolFromReq } from '../config/database';
import { Router } from 'express';
import { asyncHandler, sql, getPool } from '../lib/voucherHelper';
import { parsePagination, paginatedResponse } from '../middleware/pagination';
import { ApiError } from '../middleware/errorHandler';
import { generateGUID } from '../lib/guid';
import { insertRow } from '../lib/schemaInsert';

const router = Router();

// ─── Budget List ───

router.get('/', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'BudgetCode');
  const year = req.query.year as string;

  let where = 'WHERE 1=1';
  const request = pool.request();
  if (year) {
    where += ` AND BudgetYear = @year`;
    request.input('year', sql.Int, parseInt(year));
  }

  try {
    const countResult = await request.query(`SELECT COUNT(*) AS total FROM Budget ${where}`);
    const total = countResult.recordset[0].total;

    const req2 = pool.request();
    if (year) req2.input('year', sql.Int, parseInt(year));
    req2.input('offset', sql.Int, p.offset);
    req2.input('pageSize', sql.Int, p.pageSize);

    const result = await req2.query(
      `SELECT * FROM Budget ${where}
       ORDER BY ${p.sortBy} ${p.sortDir}
       OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`
    );

    res.json(paginatedResponse(result.recordset, total, p));
  } catch {
    res.json({ success: true, data: [], message: 'Budget table not available in this database' });
  }
}));

// ─── Budget Detail ───

router.get('/:id', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  try {
    const master = await pool.request()
      .input('id', sql.UniqueIdentifier, req.params.id)
      .query('SELECT * FROM Budget WHERE BudgetID = @id');
    if (!master.recordset.length) throw new ApiError(404, 'NOT_FOUND', 'Budget not found');

    let details: any[] = [];
    try {
      const detailResult = await pool.request()
        .input('id', sql.UniqueIdentifier, req.params.id)
        .query('SELECT * FROM BudgetDetail WHERE BudgetID = @id ORDER BY SortOrder');
      details = detailResult.recordset;
    } catch {}

    res.json({ success: true, data: { ...master.recordset[0], details } });
  } catch (err: any) {
    if (err.code === 'NOT_FOUND') throw err;
    res.json({ success: true, data: null, message: 'Budget table not available' });
  }
}));

// ─── Create Budget ───

router.post('/', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const b = req.body;
  const id = generateGUID();

  const data: Record<string, any> = {
    ...b,
    BudgetID: id,
    Inactive: b.Inactive ?? false,
    CreatedDate: new Date(),
    CreatedBy: req.user?.username || 'api',
    ModifiedDate: new Date(),
    ModifiedBy: req.user?.username || 'api',
  };
  delete data.details;

  await insertRow(pool, 'Budget', data, req.sqlInstance, req.sqlDatabase, req.sqlAuth, req.sqlUsername, req.sqlPassword);
  res.status(201).json({ success: true, data: { BudgetID: id } });
}));

// ─── Update Budget ───

router.put('/:id', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const b = req.body;
  const sets: string[] = [];
  const request = pool.request();
  request.input('id', sql.UniqueIdentifier, req.params.id);

  const fields: Record<string, any> = {
    BudgetCode: sql.NVarChar, BudgetName: sql.NVarChar,
    BudgetYear: sql.Int, BudgetType: sql.Int,
    TotalAmount: sql.Decimal(18, 4),
    BranchID: sql.UniqueIdentifier, Inactive: sql.Bit,
  };

  for (const [field, type] of Object.entries(fields)) {
    if (b[field] !== undefined) {
      sets.push(`${field} = @${field}`);
      request.input(field, type, b[field]);
    }
  }

  if (!sets.length) throw new ApiError(422, 'VALIDATION_ERROR', 'No fields to update');
  sets.push('ModifiedDate = GETDATE()');
  sets.push('ModifiedBy = @_modifiedBy');
  request.input('_modifiedBy', sql.NVarChar, req.user?.username || 'api');

  const result = await request.query(
    `UPDATE Budget SET ${sets.join(', ')} WHERE BudgetID = @id`
  );
  if (!result.rowsAffected[0]) throw new ApiError(404, 'NOT_FOUND', 'Budget not found');
  res.json({ success: true });
}));

// ─── Delete Budget ───

router.delete('/:id', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  try {
    await pool.request()
      .input('id', sql.UniqueIdentifier, req.params.id)
      .query('DELETE FROM BudgetDetail WHERE BudgetID = @id');
  } catch {}
  const result = await pool.request()
    .input('id', sql.UniqueIdentifier, req.params.id)
    .query('DELETE FROM Budget WHERE BudgetID = @id');
  if (!result.rowsAffected[0]) throw new ApiError(404, 'NOT_FOUND', 'Budget not found');
  res.json({ success: true });
}));

// ─── Budget vs Actual (So sánh ngân sách - thực tế) ───

router.get('/analysis/vs-actual', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const year = parseInt(req.query.year as string) || new Date().getFullYear();
  const dateFrom = `${year}-01-01`;
  const dateTo = `${year}-12-31`;

  // Get actual figures from GL
  const actual = await pool.request()
    .input('dateFrom', sql.DateTime, new Date(dateFrom))
    .input('dateTo', sql.DateTime, new Date(dateTo))
    .query(
      `SELECT LEFT(AccountNumber, 3) AS AccountGroup,
              SUM(DebitAmount) AS ActualDebit,
              SUM(CreditAmount) AS ActualCredit
       FROM GeneralLedger
       WHERE PostedDate >= @dateFrom AND PostedDate <= @dateTo
       GROUP BY LEFT(AccountNumber, 3)
       ORDER BY LEFT(AccountNumber, 3)`
    );

  res.json({ success: true, data: actual.recordset, year });
}));

export default router;
