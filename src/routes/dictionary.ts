import { getPoolFromReq } from '../config/database';
import { Router, Request, Response, NextFunction } from 'express';
import { getPool, sql } from '../config/database';
import { generateGUID } from '../lib/guid';
import { insertRow } from '../lib/schemaInsert';
import { parsePagination, paginatedResponse } from '../middleware/pagination';
import { ApiError } from '../middleware/errorHandler';

const router = Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

// ─── AccountObject (Customers / Vendors / Employees) ───

router.get('/account-objects', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'AccountObjectCode');
  const search = req.query.search as string;
  const type = req.query.type as string;

  let where = 'WHERE 1=1';
  const request = pool.request();

  if (search) {
    where += ` AND (AccountObjectCode LIKE @search OR AccountObjectName LIKE @search OR CompanyTaxCode LIKE @search)`;
    request.input('search', sql.NVarChar, `%${search}%`);
  }
  if (type !== undefined) {
    where += ` AND AccountObjectType = @type`;
    request.input('type', sql.Int, parseInt(type));
  }

  const countResult = await request.query(`SELECT COUNT(*) AS total FROM AccountObject ${where}`);
  const total = countResult.recordset[0].total;

  const request2 = pool.request();
  if (search) request2.input('search', sql.NVarChar, `%${search}%`);
  if (type !== undefined) request2.input('type', sql.Int, parseInt(type));
  request2.input('offset', sql.Int, p.offset);
  request2.input('pageSize', sql.Int, p.pageSize);

  const result = await request2.query(
    `SELECT AccountObjectID, AccountObjectCode, AccountObjectName,
            AccountObjectType, Address, Tel, Mobile, Fax, EmailAddress, CompanyTaxCode,
            BankAccount, BankName, Inactive,
            CreatedDate, CreatedBy, ModifiedDate, ModifiedBy
     FROM AccountObject ${where}
     ORDER BY ${p.sortBy} ${p.sortDir}
     OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`
  );

  res.json(paginatedResponse(result.recordset, total, p));
}));

router.get('/account-objects/:id', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const result = await pool.request()
    .input('id', sql.UniqueIdentifier, req.params.id)
    .query('SELECT * FROM AccountObject WHERE AccountObjectID = @id');

  if (!result.recordset.length) throw new ApiError(404, 'NOT_FOUND', 'AccountObject not found');
  res.json({ success: true, data: result.recordset[0] });
}));

router.post('/account-objects', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const id = generateGUID();
  const b = req.body;

  await pool.request()
    .input('AccountObjectID', sql.UniqueIdentifier, id)
    .input('AccountObjectCode', sql.NVarChar, b.AccountObjectCode)
    .input('AccountObjectName', sql.NVarChar, b.AccountObjectName)
    .input('AccountObjectType', sql.Int, b.AccountObjectType ?? 0)
    .input('Address', sql.NVarChar, b.Address || '')
    .input('Tel', sql.NVarChar, b.Tel || '')
    .input('Mobile', sql.NVarChar, b.Mobile || '')
    .input('EmailAddress', sql.NVarChar, b.EmailAddress || b.Email || '')
    .input('CompanyTaxCode', sql.NVarChar, b.CompanyTaxCode || b.TaxCode || '')
    .input('BankAccount', sql.NVarChar, b.BankAccount || '')
    .input('BankName', sql.NVarChar, b.BankName || '')
    .input('Inactive', sql.Bit, b.Inactive ?? false)
    .input('CreatedDate', sql.DateTime, new Date())
    .input('CreatedBy', sql.NVarChar, req.user?.username || 'api')
    .query(
      `INSERT INTO AccountObject
       (AccountObjectID, AccountObjectCode, AccountObjectName, AccountObjectType,
        Address, Tel, Mobile, EmailAddress, CompanyTaxCode, BankAccount, BankName,
        Inactive, CreatedDate, CreatedBy, ModifiedDate, ModifiedBy)
       VALUES
       (@AccountObjectID, @AccountObjectCode, @AccountObjectName, @AccountObjectType,
        @Address, @Tel, @Mobile, @EmailAddress, @CompanyTaxCode, @BankAccount, @BankName,
        @Inactive, @CreatedDate, @CreatedBy, @CreatedDate, @CreatedBy)`
    );

  res.status(201).json({ success: true, data: { AccountObjectID: id } });
}));

router.put('/account-objects/:id', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const b = req.body;
  const sets: string[] = [];
  const request = pool.request();
  request.input('id', sql.UniqueIdentifier, req.params.id);

  const fields: Record<string, any> = {
    AccountObjectCode: sql.NVarChar, AccountObjectName: sql.NVarChar,
    AccountObjectType: sql.Int,
    Address: sql.NVarChar, Tel: sql.NVarChar, Mobile: sql.NVarChar,
    EmailAddress: sql.NVarChar, CompanyTaxCode: sql.NVarChar,
    BankAccount: sql.NVarChar, BankName: sql.NVarChar, Inactive: sql.Bit,
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
    `UPDATE AccountObject SET ${sets.join(', ')} WHERE AccountObjectID = @id`
  );

  if (!result.rowsAffected[0]) throw new ApiError(404, 'NOT_FOUND', 'AccountObject not found');
  res.json({ success: true });
}));

router.delete('/account-objects/:id', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const result = await pool.request()
    .input('id', sql.UniqueIdentifier, req.params.id)
    .query('DELETE FROM AccountObject WHERE AccountObjectID = @id');
  if (!result.rowsAffected[0]) throw new ApiError(404, 'NOT_FOUND', 'AccountObject not found');
  res.json({ success: true });
}));

// ─── InventoryItem (Products / Services) ───

router.get('/inventory-items', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const p = parsePagination(req, 'InventoryItemCode');
  const search = req.query.search as string;
  let where = 'WHERE 1=1';
  const request = pool.request();
  if (search) {
    where += ` AND (InventoryItemCode LIKE @search OR InventoryItemName LIKE @search)`;
    request.input('search', sql.NVarChar, `%${search}%`);
  }

  const countResult = await request.query(`SELECT COUNT(*) AS total FROM InventoryItem ${where}`);
  const total = countResult.recordset[0].total;

  const request2 = pool.request();
  if (search) request2.input('search', sql.NVarChar, `%${search}%`);
  request2.input('offset', sql.Int, p.offset);
  request2.input('pageSize', sql.Int, p.pageSize);

  const result = await request2.query(
    `SELECT InventoryItemID, InventoryItemCode, InventoryItemName,
            UnitID, UnitPrice, SalePrice1, SalePrice2, SalePrice3,
            InventoryAccount, SaleAccount, COGSAccount,
            Inactive, CreatedDate, ModifiedDate
     FROM InventoryItem ${where}
     ORDER BY ${p.sortBy} ${p.sortDir}
     OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`
  );

  res.json(paginatedResponse(result.recordset, total, p));
}));

router.get('/inventory-items/:id', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const result = await pool.request()
    .input('id', sql.UniqueIdentifier, req.params.id)
    .query('SELECT * FROM InventoryItem WHERE InventoryItemID = @id');
  if (!result.recordset.length) throw new ApiError(404, 'NOT_FOUND', 'InventoryItem not found');
  res.json({ success: true, data: result.recordset[0] });
}));

router.post('/inventory-items', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const b = req.body;
  const id = generateGUID();

  const data: Record<string, any> = {
    ...b,
    InventoryItemID: id,
    Inactive: b.Inactive ?? false,
    CreatedDate: new Date(),
    CreatedBy: req.user?.username || 'api',
    ModifiedDate: new Date(),
    ModifiedBy: req.user?.username || 'api',
  };

  await insertRow(pool, 'InventoryItem', data, req.sqlInstance, req.sqlDatabase, req.sqlAuth, req.sqlUsername, req.sqlPassword);
  res.status(201).json({ success: true, data: { InventoryItemID: id } });
}));

router.put('/inventory-items/:id', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const b = req.body;
  const sets: string[] = [];
  const request = pool.request();
  request.input('id', sql.UniqueIdentifier, req.params.id);

  const fields: Record<string, any> = {
    InventoryItemCode: sql.NVarChar, InventoryItemName: sql.NVarChar,
    UnitID: sql.UniqueIdentifier,
    UnitPrice: sql.Decimal(18, 4), SalePrice1: sql.Decimal(18, 4),
    SalePrice2: sql.Decimal(18, 4), SalePrice3: sql.Decimal(18, 4),
    InventoryAccount: sql.NVarChar, SaleAccount: sql.NVarChar, COGSAccount: sql.NVarChar,
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
    `UPDATE InventoryItem SET ${sets.join(', ')} WHERE InventoryItemID = @id`
  );
  if (!result.rowsAffected[0]) throw new ApiError(404, 'NOT_FOUND', 'InventoryItem not found');
  res.json({ success: true });
}));

router.delete('/inventory-items/:id', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const result = await pool.request()
    .input('id', sql.UniqueIdentifier, req.params.id)
    .query('DELETE FROM InventoryItem WHERE InventoryItemID = @id');
  if (!result.rowsAffected[0]) throw new ApiError(404, 'NOT_FOUND', 'InventoryItem not found');
  res.json({ success: true });
}));

// ─── InventoryItemCategory ───

router.get('/inventory-categories', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  try {
    const result = await pool.request().query(
      `SELECT * FROM InventoryItemCategory ORDER BY 1`
    );
    res.json({ success: true, data: result.recordset });
  } catch {
    res.json({ success: true, data: [], message: 'InventoryItemCategory table not available' });
  }
}));

// ─── Account (Chart of Accounts) ───

router.get('/accounts', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const result = await pool.request().query(
    `SELECT AccountID, AccountNumber, AccountName, AccountNameEnglish,
            ParentID, Grade, IsParent, AccountCategoryKind,
            DetailByAccountObject, DetailByBankAccount, DetailByJob,
            DetailByProjectWork, DetailByContract, DetailByDepartment,
            Inactive
     FROM Account ORDER BY AccountNumber`
  );
  res.json({ success: true, data: result.recordset });
}));

router.get('/accounts/:accountNumber', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const result = await pool.request()
    .input('num', sql.NVarChar, req.params.accountNumber)
    .query('SELECT * FROM Account WHERE AccountNumber = @num');
  if (!result.recordset.length) throw new ApiError(404, 'NOT_FOUND', 'Account not found');
  res.json({ success: true, data: result.recordset[0] });
}));

// ─── Employee ───

router.get('/employees', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const search = req.query.search as string;

  let where = `WHERE (AccountObjectCode LIKE 'NV%' OR AccountObjectCode LIKE 'EMP%' OR AccountObjectType = 2)`;
  const request = pool.request();
  if (search) {
    where += ` AND (AccountObjectCode LIKE @search OR AccountObjectName LIKE @search)`;
    request.input('search', sql.NVarChar, `%${search}%`);
  }

  const result = await request.query(
    `SELECT AccountObjectID AS EmployeeID, AccountObjectCode AS EmployeeCode,
            AccountObjectName AS EmployeeName, Mobile, EmailAddress AS Email,
            Address, Inactive, CreatedDate, ModifiedDate
     FROM AccountObject ${where}
     ORDER BY AccountObjectCode`
  );
  res.json({ success: true, data: result.recordset });
}));

// ─── OrganizationUnit (Branches/Departments) ───

router.get('/organization-units', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const result = await pool.request().query(
    `SELECT OrganizationUnitID, OrganizationUnitCode, OrganizationUnitName,
            BranchID, ParentID, Grade, IsParent, OrganizationUnitTypeID,
            Address, CompanyTaxCode, Inactive
     FROM OrganizationUnit ORDER BY SortMISACodeID`
  );
  res.json({ success: true, data: result.recordset });
}));

// ─── Bank Account ───

router.get('/bank-accounts', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  try {
    const result = await pool.request().query(
      `SELECT * FROM BankAccount ORDER BY BankAccountNumber`
    );
    res.json({ success: true, data: result.recordset });
  } catch {
    res.json({ success: true, data: [], message: 'BankAccount table not available' });
  }
}));

// ─── Unit (Đơn vị tính) ───

router.get('/units', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const result = await pool.request().query(
    `SELECT UnitID, UnitName, Inactive FROM Unit ORDER BY UnitName`
  );
  res.json({ success: true, data: result.recordset });
}));

// ─── Currency ───

router.get('/currencies', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  try {
    const result = await pool.request().query(
      `SELECT * FROM Currency ORDER BY CurrencyID`
    );
    res.json({ success: true, data: result.recordset });
  } catch {
    res.json({ success: true, data: [], message: 'Currency table not available' });
  }
}));

// ─── PaymentTerm (Điều khoản thanh toán) ───

router.get('/payment-terms', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  try {
    const result = await pool.request().query(
      `SELECT * FROM PaymentTerm ORDER BY PaymentTermCode`
    );
    res.json({ success: true, data: result.recordset });
  } catch {
    res.json({ success: true, data: [], message: 'PaymentTerm table not available' });
  }
}));

export default router;
