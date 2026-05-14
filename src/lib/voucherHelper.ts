import { Request, Response, NextFunction } from 'express';
import sql from 'mssql/msnodesqlv8';
import { getPool, getPoolFromReq } from '../config/database';
import { generateGUID } from './guid';
import { generateRefNo } from './autoNumber';
import { postToGeneralLedger, unpostFromGeneralLedger, GLEntry, GLHeader } from './glPosting';
import { parsePagination, paginatedResponse } from '../middleware/pagination';
import { ApiError } from '../middleware/errorHandler';

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

/** Generic list vouchers with pagination */
export async function listVouchers(
  req: Request,
  tableName: string,
  selectCols: string,
  defaultSort = 'RefDate'
) {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, defaultSort);
  const search = req.query.search as string;
  const refType = req.query.refType as string;
  const dateFrom = req.query.dateFrom as string;
  const dateTo = req.query.dateTo as string;
  const isPosted = req.query.isPosted as string;

  let where = 'WHERE 1=1';
  const request = pool.request();

  if (search) {
    where += ` AND (RefNoFinance LIKE @search OR JournalMemo LIKE @search)`;
    request.input('search', sql.NVarChar, `%${search}%`);
  }
  if (refType) {
    where += ` AND RefType = @refType`;
    request.input('refType', sql.Int, parseInt(refType));
  }
  // Date filter — only add if dateCol is valid for this table
  const dateCol = defaultSort === 'InvDate' ? 'InvDate' : 'RefDate';
  if (dateFrom) {
    where += ` AND ${dateCol} >= @dateFrom`;
    request.input('dateFrom', sql.DateTime, new Date(dateFrom));
  }
  if (dateTo) {
    where += ` AND ${dateCol} <= @dateTo`;
    request.input('dateTo', sql.DateTime, new Date(dateTo));
  }
  if (isPosted !== undefined) {
    where += ` AND IsPostedFinance = @isPosted`;
    request.input('isPosted', sql.Bit, isPosted === 'true' ? 1 : 0);
  }

  const countResult = await request.query(`SELECT COUNT(*) AS total FROM ${tableName} ${where}`);
  const total = countResult.recordset[0].total;

  const req2 = pool.request();
  if (search) req2.input('search', sql.NVarChar, `%${search}%`);
  if (refType) req2.input('refType', sql.Int, parseInt(refType));
  if (dateFrom) req2.input('dateFrom', sql.DateTime, new Date(dateFrom));
  if (dateTo) req2.input('dateTo', sql.DateTime, new Date(dateTo));
  if (isPosted !== undefined) req2.input('isPosted', sql.Bit, isPosted === 'true' ? 1 : 0);
  req2.input('offset', sql.Int, p.offset);
  req2.input('pageSize', sql.Int, p.pageSize);

  const result = await req2.query(
    `SELECT ${selectCols} FROM ${tableName} ${where}
     ORDER BY ${p.sortBy} ${p.sortDir}
     OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`
  );

  return paginatedResponse(result.recordset, total, p);
}

/** Get voucher by RefID with detail lines */
export async function getVoucherWithDetails(
  req: Request,
  masterTable: string,
  detailTable: string,
  refId: string | string[]
) {
  const id = Array.isArray(refId) ? refId[0] : refId;
  const pool = await getPoolFromReq(req);

  const masterResult = await pool.request()
    .input('refId', sql.UniqueIdentifier, id)
    .query(`SELECT * FROM ${masterTable} WHERE RefID = @refId`);

  if (!masterResult.recordset.length) {
    throw new ApiError(404, 'NOT_FOUND', `${masterTable} not found`);
  }

  const detailResult = await pool.request()
    .input('refId', sql.UniqueIdentifier, id)
    .query(`SELECT * FROM ${detailTable} WHERE RefID = @refId ORDER BY SortOrder`);

  return {
    success: true,
    data: {
      ...masterResult.recordset[0],
      details: detailResult.recordset,
    },
  };
}

/** Delete voucher: unpost GL + delete details + delete master */
export async function deleteVoucher(
  req: Request,
  masterTable: string,
  detailTable: string,
  refId: string | string[]
) {
  const id = Array.isArray(refId) ? refId[0] : refId;
  const pool = await getPoolFromReq(req);
  const transaction = new sql.Transaction(pool);
  await transaction.begin();

  try {
    await unpostFromGeneralLedger(transaction, id);

    const delDetail = new sql.Request(transaction);
    delDetail.input('refId', sql.UniqueIdentifier, id);
    await delDetail.query(`DELETE FROM ${detailTable} WHERE RefID = @refId`);

    const delMaster = new sql.Request(transaction);
    delMaster.input('refId', sql.UniqueIdentifier, id);
    const result = await delMaster.query(`DELETE FROM ${masterTable} WHERE RefID = @refId`);

    if (!result.rowsAffected[0]) {
      await transaction.rollback();
      throw new ApiError(404, 'NOT_FOUND', `${masterTable} not found`);
    }

    await transaction.commit();
    return { success: true };
  } catch (err) {
    try { await transaction.rollback(); } catch {}
    throw err;
  }
}

export { sql, getPool, getPoolFromReq, generateGUID, generateRefNo, postToGeneralLedger, GLEntry, GLHeader };
