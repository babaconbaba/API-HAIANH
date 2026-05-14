import { getPoolFromReq } from '../config/database';
import { Router } from 'express';
import { asyncHandler, sql, getPool } from '../lib/voucherHelper';
import { parsePagination, paginatedResponse } from '../middleware/pagination';
import { ApiError } from '../middleware/errorHandler';
import { generateGUID } from '../lib/guid';
import { insertRow } from '../lib/schemaInsert';

const router = Router();

// ─── Contract List ───

router.get('/', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'ContractCode');
  const search = req.query.search as string;
  const status = req.query.status as string;

  let where = 'WHERE 1=1';
  const request = pool.request();
  if (search) {
    where += ` AND (ContractCode LIKE @search OR ContractName LIKE @search OR AccountObjectName LIKE @search)`;
    request.input('search', sql.NVarChar, `%${search}%`);
  }
  if (status !== undefined) {
    where += ` AND ContractStatus = @status`;
    request.input('status', sql.Int, parseInt(status));
  }

  try {
    const countResult = await request.query(`SELECT COUNT(*) AS total FROM Contract ${where}`);
    const total = countResult.recordset[0].total;

    const req2 = pool.request();
    if (search) req2.input('search', sql.NVarChar, `%${search}%`);
    if (status !== undefined) req2.input('status', sql.Int, parseInt(status));
    req2.input('offset', sql.Int, p.offset);
    req2.input('pageSize', sql.Int, p.pageSize);

    const result = await req2.query(
      `SELECT ContractID, ContractCode, ContractName, ContractType,
              SignDate, StartDate, EndDate, ContractStatus,
              AccountObjectID, AccountObjectName, AccountObjectCode,
              ContractAmount, AccumulatedAmount, RemainingAmount,
              CurrencyID, ExchangeRate,
              BranchID, Inactive, CreatedDate, ModifiedDate
       FROM Contract ${where}
       ORDER BY ${p.sortBy} ${p.sortDir}
       OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`
    );

    res.json(paginatedResponse(result.recordset, total, p));
  } catch {
    res.json({ success: true, data: [], message: 'Contract table not available in this database' });
  }
}));

// ─── Contract Detail ───

router.get('/:id', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  try {
    const result = await pool.request()
      .input('id', sql.UniqueIdentifier, req.params.id)
      .query('SELECT * FROM Contract WHERE ContractID = @id');
    if (!result.recordset.length) throw new ApiError(404, 'NOT_FOUND', 'Contract not found');
    res.json({ success: true, data: result.recordset[0] });
  } catch (err: any) {
    if (err.code === 'NOT_FOUND') throw err;
    res.json({ success: true, data: null, message: 'Contract table not available' });
  }
}));

// ─── Create Contract ───

router.post('/', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const b = req.body;
  const id = generateGUID();

  const data: Record<string, any> = {
    ...b,
    ContractID: id,
    ContractStatus: b.ContractStatus ?? 0,
    Inactive: b.Inactive ?? false,
    CreatedDate: new Date(),
    CreatedBy: req.user?.username || 'api',
    ModifiedDate: new Date(),
    ModifiedBy: req.user?.username || 'api',
  };

  await insertRow(pool, 'Contract', data, req.sqlInstance, req.sqlDatabase, req.sqlAuth, req.sqlUsername, req.sqlPassword);
  res.status(201).json({ success: true, data: { ContractID: id } });
}));

// ─── Update Contract ───

router.put('/:id', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const b = req.body;
  const sets: string[] = [];
  const request = pool.request();
  request.input('id', sql.UniqueIdentifier, req.params.id);

  const fields: Record<string, any> = {
    ContractCode: sql.NVarChar, ContractName: sql.NVarChar,
    ContractType: sql.Int, ContractStatus: sql.Int,
    SignDate: sql.DateTime, StartDate: sql.DateTime, EndDate: sql.DateTime,
    AccountObjectID: sql.UniqueIdentifier, AccountObjectName: sql.NVarChar,
    ContractAmount: sql.Decimal(18, 4),
    CurrencyID: sql.NVarChar, ExchangeRate: sql.Decimal(18, 4),
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
    `UPDATE Contract SET ${sets.join(', ')} WHERE ContractID = @id`
  );
  if (!result.rowsAffected[0]) throw new ApiError(404, 'NOT_FOUND', 'Contract not found');
  res.json({ success: true });
}));

// ─── Delete Contract ───

router.delete('/:id', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const result = await pool.request()
    .input('id', sql.UniqueIdentifier, req.params.id)
    .query('DELETE FROM Contract WHERE ContractID = @id');
  if (!result.rowsAffected[0]) throw new ApiError(404, 'NOT_FOUND', 'Contract not found');
  res.json({ success: true });
}));

// ─── Contract GL entries ───

router.get('/:id/ledger', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const result = await pool.request()
    .input('contractId', sql.UniqueIdentifier, req.params.id)
    .query(
      `SELECT RefNo, RefDate, PostedDate, AccountNumber, CorrespondingAccountNumber,
              DebitAmount, CreditAmount, Description
       FROM GeneralLedger
       WHERE ContractID = @contractId
       ORDER BY PostedDate, RefNo`
    );
  res.json({ success: true, data: result.recordset });
}));

export default router;
