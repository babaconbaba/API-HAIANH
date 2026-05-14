import sql from 'mssql/msnodesqlv8';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate next RefNo from SYSAutoID table.
 * Must be called within a transaction for atomicity.
 */
export async function generateRefNo(
  transaction: sql.Transaction,
  refType: number,
  branchId?: string,
  displayOnBook: number = 0
): Promise<string> {
  const request = new sql.Request(transaction);

  // Lock and read current value
  // SYSAutoID uses RefTypeCategory (not RefType)
  request.input('refTypeCategory', sql.Int, refType);
  const result = await request.query(
    `SELECT TOP 1 Prefix, Value, Suffix, LengthOfValue
     FROM SYSAutoID WITH (UPDLOCK, HOLDLOCK)
     WHERE RefTypeCategory = @refTypeCategory
     ORDER BY AutoID`
  );

  if (!result.recordset.length) {
    // No auto-number config — use UUID suffix to guarantee uniqueness
    return `API${uuidv4().slice(0, 8).toUpperCase()}`;
  }

  const row = result.recordset[0];
  const newValue = (row.Value || 0) + 1;
  const prefix = row.Prefix || '';
  const suffix = row.Suffix || '';
  const padLen = row.LengthOfValue || 5;

  // Update counter
  const updateReq = new sql.Request(transaction);
  updateReq.input('refTypeCategory', sql.Int, refType);
  updateReq.input('newValue', sql.Decimal(18, 0), newValue);
  await updateReq.query(
    `UPDATE SYSAutoID SET Value = @newValue WHERE RefTypeCategory = @refTypeCategory`
  );

  // Build RefNo: prefix + zero-padded number + suffix
  const numStr = String(newValue).padStart(padLen, '0');
  return `${prefix}${numStr}${suffix}`;
}
