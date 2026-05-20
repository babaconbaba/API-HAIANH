import sql from 'mssql/msnodesqlv8';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate next RefNo from SYSAutoID table.
 * Must be called within a transaction for atomicity.
 * Matches by BranchID when available for correct branch-specific prefix.
 */
export async function generateRefNo(
  transaction: sql.Transaction,
  refType: number,
  branchId?: string,
  displayOnBook: number = 0
): Promise<string> {
  const request = new sql.Request(transaction);
  request.input('refTypeCategory', sql.Int, refType);

  let query: string;
  if (branchId) {
    // Try branch-specific entry first, fallback to non-branch entry
    request.input('branchId', sql.UniqueIdentifier, branchId);
    request.input('displayOnBook', sql.Int, displayOnBook);
    query = `SELECT TOP 1 AutoID, Prefix, Value, Suffix, LengthOfValue
             FROM SYSAutoID WITH (UPDLOCK, HOLDLOCK)
             WHERE RefTypeCategory = @refTypeCategory
               AND (BranchID = @branchId OR BranchID IS NULL)
               AND DisplayOnBook = @displayOnBook
             ORDER BY CASE WHEN BranchID = @branchId THEN 0 ELSE 1 END, AutoID`;
  } else {
    query = `SELECT TOP 1 AutoID, Prefix, Value, Suffix, LengthOfValue
             FROM SYSAutoID WITH (UPDLOCK, HOLDLOCK)
             WHERE RefTypeCategory = @refTypeCategory
             ORDER BY AutoID`;
  }

  const result = await request.query(query);

  if (!result.recordset.length) {
    return `API${uuidv4().slice(0, 8).toUpperCase()}`;
  }

  const row = result.recordset[0];
  const newValue = (row.Value || 0) + 1;
  const prefix = row.Prefix || '';
  const suffix = row.Suffix || '';
  const padLen = row.LengthOfValue || 5;

  // Update counter — only the matching row
  const updateReq = new sql.Request(transaction);
  updateReq.input('autoId', sql.UniqueIdentifier, row.AutoID);
  updateReq.input('newValue', sql.Decimal(18, 0), newValue);
  await updateReq.query(`UPDATE SYSAutoID SET Value = @newValue WHERE AutoID = @autoId`);

  const numStr = String(newValue).padStart(padLen, '0');
  return `${prefix}${numStr}${suffix}`;
}
