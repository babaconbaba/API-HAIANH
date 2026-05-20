import sql from 'mssql/msnodesqlv8';
import { getPool } from '../config/database';

interface ColumnInfo {
  name: string;
  type: string;
  isNullable: boolean;
  isIdentity: boolean;
}

const schemaCache = new Map<string, ColumnInfo[]>();

/** Get column metadata for a table (cached) */
async function getColumns(tableName: string, instance?: string, database?: string, auth?: string, username?: string, password?: string): Promise<ColumnInfo[]> {
  const key = `${instance || ''}/${database || ''}/${tableName}`;
  if (schemaCache.has(key)) return schemaCache.get(key)!;

  const pool = await getPool(instance, database, auth, username, password);
  const result = await pool.request()
    .input('tableName', sql.NVarChar, tableName)
    .query(`
      SELECT c.name, t.name AS typeName, c.is_nullable AS isNullable, c.is_identity AS isIdentity, c.is_computed AS isComputed
      FROM sys.columns c
      JOIN sys.objects o ON c.object_id = o.object_id
      JOIN sys.types t ON c.user_type_id = t.user_type_id
      WHERE o.name = @tableName AND c.is_computed = 0
      ORDER BY c.column_id
    `);

  const cols = result.recordset.map((r: any) => ({
    name: r.name,
    type: r.typeName,
    isNullable: !!r.isNullable,
    isIdentity: !!r.isIdentity,
  }));

  schemaCache.set(key, cols);
  return cols;
}

/** Map SQL type string to mssql type */
function getSqlType(typeName: string): any {
  switch (typeName) {
    case 'uniqueidentifier': return sql.UniqueIdentifier;
    case 'int': return sql.Int;
    case 'bit': return sql.Bit;
    case 'datetime': return sql.DateTime;
    case 'decimal': case 'money': return sql.Decimal(18, 4);
    case 'nvarchar': case 'varchar': case 'ntext': return sql.NVarChar;
    case 'timestamp': return null; // skip - auto-generated
    default: return sql.NVarChar;
  }
}

// Columns with FK constraints that can't use empty GUID — skip if not provided
const FK_GUID_COLUMNS = new Set([
  'AccountObjectID', 'EmployeeID', 'BankAccountID',
  'StockID', 'FixedAssetID', 'SupplyID', 'ProjectWorkID', 'JobID',
  'ContractID', 'OrderID', 'PUContractID', 'BudgetItemID', 'ExpenseItemID',
  'FixedAssetCategoryID', 'SupplyCategoryID', 'InventoryItemCategoryID',
  'PaymentTermID', 'EmployeeIDReview', 'EmployeeIDDeliver',
  'ListItemID', 'DebtAgreementID', 'UnitID', 'MainUnitID',
  'InventoryItemID', 'InwardStockID', 'OutwardStockID',
  'TransferStockID', 'RefundStockID', 'ProductionOrderID',
]);

// nvarchar columns with FK to Account table — can't default to empty string
const FK_ACCOUNT_COLUMNS = new Set([
  'DebitAccount', 'CreditAccount', 'DiscountAccount', 'VATAccount',
  'ExportTaxAccount', 'ImportTaxAccount', 'SpecialConsumeTaxAccount',
  'DeductionDebitAccount', 'AntiDumpingTaxAccount',
  'CashOutDiffAccountNumberFinance', 'CashOutDiffAccountNumberManagement',
  'DepreciationAccount', 'OrgPriceAccount', 'AllocationAccount',
  'CostAccount', 'ExpenseAccount', 'RevenueAccount',
]);

/** Get default value for a NOT NULL column */
function getDefault(typeName: string, colName: string): any {
  switch (typeName) {
    case 'uniqueidentifier':
      if (FK_GUID_COLUMNS.has(colName)) return null;
      return '00000000-0000-0000-0000-000000000000';
    case 'int':
      return 0;
    case 'bit':
      return false;
    case 'datetime':
      return new Date();
    case 'decimal': case 'money':
      return 0;
    case 'nvarchar': case 'varchar': case 'ntext':
      if (colName === 'ExchangeRateOperator') return '*';
      if (FK_ACCOUNT_COLUMNS.has(colName)) return null; // skip FK account columns
      return '';
    default:
      return '';
  }
}

/**
 * Build and execute an INSERT statement for a table.
 * Automatically handles all NOT NULL columns with defaults.
 *
 * @param transactionOrPool - sql.Transaction or sql.ConnectionPool
 * @param tableName - target table
 * @param data - object with column values (user-provided)
 * @param instance - SQL instance (for schema lookup)
 * @param database - database name
 */
export async function insertRow(
  transactionOrPool: sql.Transaction | sql.ConnectionPool,
  tableName: string,
  data: Record<string, any>,
  instance?: string,
  database?: string,
  auth?: string,
  username?: string,
  password?: string
): Promise<void> {
  const columns = await getColumns(tableName, instance, database, auth, username, password);
  if (!columns.length) {
    throw new Error(`Table '${tableName}' not found or has no columns.`);
  }
  const insertCols: string[] = [];
  const insertParams: string[] = [];
  const request = new sql.Request(transactionOrPool as any);

  // Build case-insensitive key map: "Reftype" → data["RefType"]
  const dataKeyMap: Record<string, string> = {};
  for (const k of Object.keys(data)) {
    dataKeyMap[k.toLowerCase()] = k;
  }

  for (const col of columns) {
    // Skip identity columns (auto-increment) and timestamp
    if (col.isIdentity || col.type === 'timestamp') continue;

    const sqlType = getSqlType(col.type);
    if (!sqlType) continue;

    // Case-insensitive lookup: SQL column "Reftype" matches JS key "RefType"
    const dataKey = dataKeyMap[col.name.toLowerCase()];
    let value = dataKey ? data[dataKey] : undefined;

    // If not provided, determine default
    if (value === undefined || value === null) {
      if (!col.isNullable) {
        value = getDefault(col.type, col.name);
        // FK columns that are NOT NULL but not provided: skip entirely
        // SQL will throw the error if truly required — better than FK violation
        if (value === null && (FK_GUID_COLUMNS.has(col.name) || FK_ACCOUNT_COLUMNS.has(col.name))) continue;
      } else {
        value = null;
      }
    }

    // For FK columns: explicitly insert NULL to override bad DEFAULTs (e.g., DEFAULT 0 on nvarchar FK)
    if (value === null && col.isNullable && (FK_GUID_COLUMNS.has(col.name) || FK_ACCOUNT_COLUMNS.has(col.name))) {
      insertCols.push(col.name);
      insertParams.push(`@${col.name}`);
      request.input(col.name, sqlType, null);
      continue;
    }

    // Skip null nullable columns not explicitly in data
    if (value === null && col.isNullable && !dataKey) continue;

    // Coerce boolean values for numeric SQL types (msnodesqlv8 sends false as NULL for sql.Int)
    if (typeof value === 'boolean' && (col.type === 'int' || col.type === 'decimal' || col.type === 'money')) {
      value = value ? 1 : 0;
    }

    insertCols.push(col.name);
    insertParams.push(`@${col.name}`);
    request.input(col.name, sqlType, value);
  }

  if (!insertCols.length) {
    throw new Error(`No insertable columns for table '${tableName}'. Check that required fields are provided.`);
  }
  const sqlText = `INSERT INTO ${tableName} (${insertCols.join(', ')}) VALUES (${insertParams.join(', ')})`;
  await request.query(sqlText);
}

/**
 * Build and execute an UPDATE statement.
 * Only updates provided fields.
 */
export async function updateRow(
  transactionOrPool: sql.Transaction | sql.ConnectionPool,
  tableName: string,
  pkColumn: string,
  pkValue: string,
  data: Record<string, any>,
  instance?: string,
  database?: string,
  auth?: string,
  username?: string,
  password?: string
): Promise<number> {
  const columns = await getColumns(tableName, instance, database, auth, username, password);
  const sets: string[] = [];
  const request = new sql.Request(transactionOrPool as any);
  request.input('_pkValue', sql.UniqueIdentifier, pkValue);

  // Case-insensitive key map
  const dataKeyMap: Record<string, string> = {};
  for (const k of Object.keys(data)) dataKeyMap[k.toLowerCase()] = k;

  for (const col of columns) {
    if (col.isIdentity || col.type === 'timestamp') continue;
    if (col.name === pkColumn) continue;
    const dataKey = dataKeyMap[col.name.toLowerCase()];
    if (!dataKey || !(dataKey in data)) continue;

    const sqlType = getSqlType(col.type);
    if (!sqlType) continue;

    let value = data[dataKey];
    if (typeof value === 'boolean' && (col.type === 'int' || col.type === 'decimal' || col.type === 'money')) {
      value = value ? 1 : 0;
    }
    sets.push(`${col.name} = @${col.name}`);
    request.input(col.name, sqlType, value);
  }

  if (!sets.length) return 0;

  const result = await request.query(
    `UPDATE ${tableName} SET ${sets.join(', ')} WHERE ${pkColumn} = @_pkValue`
  );
  return result.rowsAffected[0];
}
