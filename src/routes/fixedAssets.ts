import { getPoolFromReq } from '../config/database';
import { Router } from 'express';
import { asyncHandler, getVoucherWithDetails, deleteVoucher, sql, getPool } from '../lib/voucherHelper';
import { createVoucher } from '../lib/voucherWriter';
import { parsePagination, paginatedResponse } from '../middleware/pagination';
import { ApiError } from '../middleware/errorHandler';
import { generateGUID } from '../lib/guid';
import { insertRow } from '../lib/schemaInsert';
import { REF_TYPES, REF_TYPE_CATEGORY } from '../config/refTypes';

const router = Router();

// ─── FixedAsset (Master data) ───

router.get('/assets', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'FixedAssetCode');
  const search = req.query.search as string;

  let where = 'WHERE 1=1';
  const request = pool.request();
  if (search) {
    where += ` AND (FixedAssetCode LIKE @search OR FixedAssetName LIKE @search)`;
    request.input('search', sql.NVarChar, `%${search}%`);
  }

  const countResult = await request.query(`SELECT COUNT(*) AS total FROM FixedAsset ${where}`);
  const total = countResult.recordset[0].total;

  const req2 = pool.request();
  if (search) req2.input('search', sql.NVarChar, `%${search}%`);
  req2.input('offset', sql.Int, p.offset);
  req2.input('pageSize', sql.Int, p.pageSize);

  const result = await req2.query(
    `SELECT FixedAssetID, FixedAssetCode, FixedAssetName, FixedAssetCategoryID,
            OrgPrice, DepreciationAmount, AccumDepreciationAmount, RemainingAmount,
            LifeTime, LifeTimeRemaining, MonthlyDepreciationAmount,
            DepreciationAccount, OrgPriceAccount,
            OrganizationUnitID, BranchID, Inactive,
            CreatedDate, ModifiedDate
     FROM FixedAsset ${where}
     ORDER BY ${p.sortBy} ${p.sortDir}
     OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`
  );

  res.json(paginatedResponse(result.recordset, total, p));
}));

router.get('/assets/:id', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const result = await pool.request()
    .input('id', sql.UniqueIdentifier, req.params.id)
    .query('SELECT * FROM FixedAsset WHERE FixedAssetID = @id');
  if (!result.recordset.length) {
    throw new ApiError(404, 'NOT_FOUND', 'FixedAsset not found');
  }
  res.json({ success: true, data: result.recordset[0] });
}));

router.post('/assets', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const b = req.body;
  const id = generateGUID();

  const data: Record<string, any> = {
    ...b,
    FixedAssetID: id,
    Inactive: b.Inactive ?? false,
    CreatedDate: new Date(),
    CreatedBy: req.user?.username || 'api',
    ModifiedDate: new Date(),
    ModifiedBy: req.user?.username || 'api',
  };

  await insertRow(pool, 'FixedAsset', data, req.sqlInstance, req.sqlDatabase, req.sqlAuth, req.sqlUsername, req.sqlPassword);
  res.status(201).json({ success: true, data: { FixedAssetID: id } });
}));

router.put('/assets/:id', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const b = req.body;
  const sets: string[] = [];
  const request = pool.request();
  request.input('id', sql.UniqueIdentifier, req.params.id);

  const fields: Record<string, any> = {
    FixedAssetCode: sql.NVarChar, FixedAssetName: sql.NVarChar,
    FixedAssetCategoryID: sql.UniqueIdentifier,
    OrgPrice: sql.Decimal(18, 4), DepreciationAmount: sql.Decimal(18, 4),
    LifeTime: sql.Int, MonthlyDepreciationAmount: sql.Decimal(18, 4),
    DepreciationAccount: sql.NVarChar, OrgPriceAccount: sql.NVarChar,
    OrganizationUnitID: sql.UniqueIdentifier, BranchID: sql.UniqueIdentifier,
    Inactive: sql.Bit,
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
    `UPDATE FixedAsset SET ${sets.join(', ')} WHERE FixedAssetID = @id`
  );
  if (!result.rowsAffected[0]) throw new ApiError(404, 'NOT_FOUND', 'FixedAsset not found');
  res.json({ success: true });
}));

router.delete('/assets/:id', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const result = await pool.request()
    .input('id', sql.UniqueIdentifier, req.params.id)
    .query('DELETE FROM FixedAsset WHERE FixedAssetID = @id');
  if (!result.rowsAffected[0]) throw new ApiError(404, 'NOT_FOUND', 'FixedAsset not found');
  res.json({ success: true });
}));

// ─── FixedAssetCategory ───

router.get('/categories', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  try {
    const result = await pool.request().query(
      `SELECT * FROM FixedAssetCategory ORDER BY FixedAssetCategoryCode`
    );
    res.json({ success: true, data: result.recordset });
  } catch {
    res.json({ success: true, data: [], message: 'FixedAssetCategory table not available' });
  }
}));

// ─── FADepreciation (Khấu hao TSCĐ) ───

router.get('/depreciation', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'RefDate');
  const dateFrom = req.query.dateFrom as string;
  const dateTo = req.query.dateTo as string;

  let where = 'WHERE 1=1';
  const request = pool.request();
  if (dateFrom) { where += ' AND RefDate >= @dateFrom'; request.input('dateFrom', sql.DateTime, new Date(dateFrom)); }
  if (dateTo) { where += ' AND RefDate <= @dateTo'; request.input('dateTo', sql.DateTime, new Date(dateTo)); }

  const countResult = await request.query(`SELECT COUNT(*) AS total FROM FADepreciation ${where}`);
  const total = countResult.recordset[0].total;

  const req2 = pool.request();
  if (dateFrom) req2.input('dateFrom', sql.DateTime, new Date(dateFrom));
  if (dateTo) req2.input('dateTo', sql.DateTime, new Date(dateTo));
  req2.input('offset', sql.Int, p.offset);
  req2.input('pageSize', sql.Int, p.pageSize);

  const result = await req2.query(
    `SELECT * FROM FADepreciation ${where}
     ORDER BY RefDate DESC
     OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`
  );

  res.json(paginatedResponse(result.recordset, total, p));
}));

router.get('/depreciation/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'FADepreciation', 'FADepreciationDetail', req.params.refId));
}));

router.post('/depreciation', asyncHandler(async (req, res) => {
  const result = await createVoucher(req, {
    masterTable: 'FADepreciation', detailTable: 'FADepreciationDetail',
    refType: REF_TYPES.FA_DEPRECIATION, refTypeCategory: REF_TYPE_CATEGORY.FA_DEPRECIATION,
    postToGL: true,
  });
  res.status(201).json({ success: true, data: result });
}));

router.delete('/depreciation/:refId', asyncHandler(async (req, res) => {
  res.json(await deleteVoucher(req, 'FADepreciation', 'FADepreciationDetail', req.params.refId));
}));

// ─── SUIncrement (Tools/CCDC) ───

router.get('/tools', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'SupplyCode');
  const search = req.query.search as string;

  let where = 'WHERE 1=1';
  const request = pool.request();
  if (search) {
    where += ` AND (SupplyCode LIKE @search OR SupplyName LIKE @search)`;
    request.input('search', sql.NVarChar, `%${search}%`);
  }

  const countResult = await request.query(`SELECT COUNT(*) AS total FROM SUIncrement ${where}`);
  const total = countResult.recordset[0].total;

  const req2 = pool.request();
  if (search) req2.input('search', sql.NVarChar, `%${search}%`);
  req2.input('offset', sql.Int, p.offset);
  req2.input('pageSize', sql.Int, p.pageSize);

  const result = await req2.query(
    `SELECT SupplyID, SupplyCode, SupplyName, Quantity, UnitPrice, Amount,
            AllocationTime, RemainingAllocationTime, TermlyAllocationAmount,
            AllocatedAmount, RemaingAmount, AllocationAccount,
            BranchID, RefDate, CreatedDate
     FROM SUIncrement ${where}
     ORDER BY ${p.sortBy} ${p.sortDir}
     OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`
  );

  res.json(paginatedResponse(result.recordset, total, p));
}));

router.get('/tools/:id', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const result = await pool.request()
    .input('id', sql.UniqueIdentifier, req.params.id)
    .query('SELECT * FROM SUIncrement WHERE SupplyID = @id');
  if (!result.recordset.length) {
    throw new ApiError(404, 'NOT_FOUND', 'SUIncrement not found');
  }
  res.json({ success: true, data: result.recordset[0] });
}));

router.post('/tools', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const b = req.body;
  const id = generateGUID();

  const data: Record<string, any> = {
    ...b,
    SupplyID: id,
    CreatedDate: new Date(),
    CreatedBy: req.user?.username || 'api',
    ModifiedDate: new Date(),
    ModifiedBy: req.user?.username || 'api',
  };

  await insertRow(pool, 'SUIncrement', data, req.sqlInstance, req.sqlDatabase, req.sqlAuth, req.sqlUsername, req.sqlPassword);
  res.status(201).json({ success: true, data: { SupplyID: id } });
}));

router.put('/tools/:id', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const b = req.body;
  const sets: string[] = [];
  const request = pool.request();
  request.input('id', sql.UniqueIdentifier, req.params.id);

  const fields: Record<string, any> = {
    SupplyCode: sql.NVarChar, SupplyName: sql.NVarChar,
    Quantity: sql.Decimal(18, 4), UnitPrice: sql.Decimal(18, 4), Amount: sql.Decimal(18, 4),
    AllocationTime: sql.Int, TermlyAllocationAmount: sql.Decimal(18, 4),
    AllocationAccount: sql.NVarChar, BranchID: sql.UniqueIdentifier,
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
    `UPDATE SUIncrement SET ${sets.join(', ')} WHERE SupplyID = @id`
  );
  if (!result.rowsAffected[0]) throw new ApiError(404, 'NOT_FOUND', 'SUIncrement not found');
  res.json({ success: true });
}));

router.delete('/tools/:id', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const result = await pool.request()
    .input('id', sql.UniqueIdentifier, req.params.id)
    .query('DELETE FROM SUIncrement WHERE SupplyID = @id');
  if (!result.rowsAffected[0]) throw new ApiError(404, 'NOT_FOUND', 'SUIncrement not found');
  res.json({ success: true });
}));

// ─── SUAllocation (Phân bổ CCDC) ───

router.get('/allocations', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'RefDate');
  const dateFrom = req.query.dateFrom as string;
  const dateTo = req.query.dateTo as string;

  let where = 'WHERE 1=1';
  const request = pool.request();
  if (dateFrom) { where += ' AND RefDate >= @dateFrom'; request.input('dateFrom', sql.DateTime, new Date(dateFrom)); }
  if (dateTo) { where += ' AND RefDate <= @dateTo'; request.input('dateTo', sql.DateTime, new Date(dateTo)); }

  const countResult = await request.query(`SELECT COUNT(*) AS total FROM SUAllocation ${where}`);
  const total = countResult.recordset[0].total;

  const req2 = pool.request();
  if (dateFrom) req2.input('dateFrom', sql.DateTime, new Date(dateFrom));
  if (dateTo) req2.input('dateTo', sql.DateTime, new Date(dateTo));
  req2.input('offset', sql.Int, p.offset);
  req2.input('pageSize', sql.Int, p.pageSize);

  const result = await req2.query(
    `SELECT * FROM SUAllocation ${where}
     ORDER BY RefDate DESC
     OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`
  );

  res.json(paginatedResponse(result.recordset, total, p));
}));

router.get('/allocations/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'SUAllocation', 'SUAllocationDetailTable', req.params.refId));
}));

router.post('/allocations', asyncHandler(async (req, res) => {
  const result = await createVoucher(req, {
    masterTable: 'SUAllocation', detailTable: 'SUAllocationDetailTable',
    refType: REF_TYPES.SU_ALLOCATION, refTypeCategory: REF_TYPE_CATEGORY.SU_ALLOCATION,
    postToGL: true,
  });
  res.status(201).json({ success: true, data: result });
}));

router.delete('/allocations/:refId', asyncHandler(async (req, res) => {
  res.json(await deleteVoucher(req, 'SUAllocation', 'SUAllocationDetailTable', req.params.refId));
}));

// ─── FADecrement (Ghi giảm TSCĐ) ───

router.get('/decrements', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'RefDate');
  try {
    const countResult = await pool.request().query('SELECT COUNT(*) AS total FROM FADecrement');
    const total = countResult.recordset[0].total;
    const req2 = pool.request(); req2.input('offset', sql.Int, p.offset); req2.input('pageSize', sql.Int, p.pageSize);
    const result = await req2.query(`SELECT * FROM FADecrement ORDER BY RefDate DESC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`);
    res.json(paginatedResponse(result.recordset, total, p));
  } catch { res.json({ success: true, data: [], message: 'FADecrement not available' }); }
}));

router.get('/decrements/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'FADecrement', 'FADecrementDetail', req.params.refId));
}));

// ─── FAAdjustment (Đánh giá lại TSCĐ) ───

router.get('/adjustments', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'RefDate');
  try {
    const countResult = await pool.request().query('SELECT COUNT(*) AS total FROM FAAdjustment');
    const total = countResult.recordset[0].total;
    const req2 = pool.request(); req2.input('offset', sql.Int, p.offset); req2.input('pageSize', sql.Int, p.pageSize);
    const result = await req2.query(`SELECT * FROM FAAdjustment ORDER BY RefDate DESC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`);
    res.json(paginatedResponse(result.recordset, total, p));
  } catch { res.json({ success: true, data: [], message: 'FAAdjustment not available' }); }
}));

router.get('/adjustments/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'FAAdjustment', 'FAAdjustmentDetail', req.params.refId));
}));

// ─── FATransfer (Điều chuyển TSCĐ) ───

router.get('/transfers', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'RefDate');
  try {
    const countResult = await pool.request().query('SELECT COUNT(*) AS total FROM FATransfer');
    const total = countResult.recordset[0].total;
    const req2 = pool.request(); req2.input('offset', sql.Int, p.offset); req2.input('pageSize', sql.Int, p.pageSize);
    const result = await req2.query(`SELECT * FROM FATransfer ORDER BY RefDate DESC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`);
    res.json(paginatedResponse(result.recordset, total, p));
  } catch { res.json({ success: true, data: [], message: 'FATransfer not available' }); }
}));

router.get('/transfers/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'FATransfer', 'FATransferDetail', req.params.refId));
}));

// ─── SUDecrement (Ghi giảm CCDC) ───

router.get('/tool-decrements', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'RefDate');
  try {
    const countResult = await pool.request().query('SELECT COUNT(*) AS total FROM SUDecrement');
    const total = countResult.recordset[0].total;
    const req2 = pool.request(); req2.input('offset', sql.Int, p.offset); req2.input('pageSize', sql.Int, p.pageSize);
    const result = await req2.query(`SELECT * FROM SUDecrement ORDER BY RefDate DESC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`);
    res.json(paginatedResponse(result.recordset, total, p));
  } catch { res.json({ success: true, data: [], message: 'SUDecrement not available' }); }
}));

router.get('/tool-decrements/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'SUDecrement', 'SUDecrementDetail', req.params.refId));
}));

// ─── SUTransfer (Điều chuyển CCDC) ───

router.get('/tool-transfers', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'RefDate');
  try {
    const countResult = await pool.request().query('SELECT COUNT(*) AS total FROM SUTransfer');
    const total = countResult.recordset[0].total;
    const req2 = pool.request(); req2.input('offset', sql.Int, p.offset); req2.input('pageSize', sql.Int, p.pageSize);
    const result = await req2.query(`SELECT * FROM SUTransfer ORDER BY RefDate DESC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`);
    res.json(paginatedResponse(result.recordset, total, p));
  } catch { res.json({ success: true, data: [], message: 'SUTransfer not available' }); }
}));

router.get('/tool-transfers/:refId', asyncHandler(async (req, res) => {
  res.json(await getVoucherWithDetails(req, 'SUTransfer', 'SUTransferDetail', req.params.refId));
}));

// ─── SupplyCategory (Loại CCDC) ───

router.get('/tool-categories', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  try {
    const result = await pool.request().query('SELECT * FROM SupplyCategory ORDER BY SupplyCategoryCode');
    res.json({ success: true, data: result.recordset });
  } catch { res.json({ success: true, data: [], message: 'SupplyCategory not available' }); }
}));

export default router;
