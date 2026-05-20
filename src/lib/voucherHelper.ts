import { Request, Response, NextFunction } from 'express';
import sql from 'mssql';
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
// Sub-detail table map — key: masterTable, value: extra tables to query
const SUB_DETAIL_TABLES: Record<string, string[]> = {
  CAReceipt: ['CAReceiptPaymentList'],
  CAPayment: ['CAPaymentDetailTax', 'CAPaymentDetailSalary', 'CAPaymentDetailPersonalIncomeTax', 'CAPaymentDetailImportVAT'],
  BADeposit: ['BADepositWithdrawList'],
  BAWithDraw: ['BAWithdrawDetailTax', 'BAWithDrawDetailSalary', 'BAWithdrawDetailPersonalIncomeTax', 'BAWithdrawDetailImportVAT'],
  GLVoucher: ['GLVoucherDetailTax', 'GLVoucherDetailExpenses', 'GLVoucherDetailExpensesAllocation', 'GLVoucherDetailRevenue', 'GLVoucherDetailRevenueAllocation', 'GLVoucherDetailDebtPayment', 'GLVoucherDetailAdvancedPayment', 'GLVoucherDetailForeignExchange'],
  SAVoucher: ['SaleOutwardReference', 'SaleOutwardReferenceDetail'],
  SAReturn: ['SAReturnInwardReferenceDetail'],
  PUVoucher: ['PUVoucherDetailCost'],
  FixedAsset: ['FixedAssetDetail', 'FixedAssetDetailAccessory', 'FixedAssetDetailAllocation', 'FixedAssetDetailSource'],
  FADepreciation: ['FADepreciationDetailAllocation', 'FADepreciationDetailPost'],
  FADecrement: ['FADecrementDetailPost'],
  FAAdjustment: ['FAAdjustmentDetailPost'],
  SUIncrement: ['SUIncrementDetail', 'SUIncrementDetailAllocation', 'SUIncrementDetailDepartment', 'SUIncrementDetailSource'],
  SUAllocation: ['SUAllocationDetailExpense', 'SUAllocationDetailPost', 'SUAllocationDetailTable'],
  SUDecrement: ['SUDecrementDetail'],
  Contract: ['ContractDetailInventoryItem', 'ContractDetailPayment', 'ContractDetailPaymentReference', 'ContractDetailExpense', 'ContractDetailRevenue', 'ContractDetailContact'],
  PASalarySheet: ['PASalaryExpenseDetail'],
  PASalaryExpense: ['PASalaryExpenseAllocationDetail'],
};

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

  const data: Record<string, any> = {
    ...masterResult.recordset[0],
    details: detailResult.recordset,
  };

  // Query sub-detail tables
  const subTables = SUB_DETAIL_TABLES[masterTable] || [];
  for (const subTable of subTables) {
    try {
      const subResult = await pool.request()
        .input('refId', sql.UniqueIdentifier, id)
        .query(`SELECT * FROM [${subTable}] WHERE RefID = @refId`);
      if (subResult.recordset.length > 0) {
        // camelCase key: "CAPaymentDetailTax" → "detailTax", "FixedAssetDetailAllocation" → "detailAllocation"
        const key = subTable
          .replace(masterTable, '')
          .replace(/^Detail/, 'detail')
          .replace(/^_/, '')
          || subTable;
        const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
        data[camelKey] = subResult.recordset;
      }
    } catch {
      // Table doesn't exist in this DB — skip silently
    }
  }

  return { success: true, data };
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

    // Delete from ALL list/ledger tables MISA uses
    for (const plTable of [
      'CAReceiptPaymentList', 'BADepositWithdrawList', 'INInwardOutwardList',
      'SaleLedger', 'PurchaseLedger', 'InventoryLedger', 'TaxLedger', 'SupplyLedger', 'FixedAssetLedger',
      'AccountObjectLedger', 'CustomFieldLedger',
    ]) {
      try {
        const delL = new sql.Request(transaction);
        delL.input('refId', sql.UniqueIdentifier, id);
        await delL.query(`DELETE FROM [${plTable}] WHERE RefID = @refId`);
      } catch (e: any) { console.warn(`[WARN] delete ${plTable}:`, e.message?.substring(0, 80)); }
    }

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
    try { await transaction.rollback(); } catch (e: any) { console.warn('[WARN]', e.message?.substring(0, 100)); }
    throw err;
  }
}

export { sql, getPool, getPoolFromReq, generateGUID, generateRefNo, postToGeneralLedger, GLEntry, GLHeader };
