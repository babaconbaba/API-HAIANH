import sql from 'mssql';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate next RefNo from SYSAutoID table.
 * Uses a SEPARATE short transaction to avoid holding the lock during the entire voucher transaction.
 * This prevents deadlock when multiple vouchers are created concurrently.
 */
export async function generateRefNo(
  pool: sql.ConnectionPool,
  refType: number,
  branchId?: string,
  displayOnBook: number = 0
): Promise<string> {
  // Use a separate short transaction just for auto-numbering
  const tx = new sql.Transaction(pool);
  await tx.begin();

  try {
    const request = new sql.Request(tx);
    request.input('refTypeCategory', sql.Int, refType);

    let query: string;
    if (branchId) {
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
      await tx.commit();
      return `API${uuidv4().slice(0, 8).toUpperCase()}`;
    }

    const row = result.recordset[0];
    const newValue = (row.Value || 0) + 1;
    const prefix = row.Prefix || '';
    const suffix = row.Suffix || '';
    const padLen = row.LengthOfValue || 5;

    const updateReq = new sql.Request(tx);
    updateReq.input('autoId', sql.UniqueIdentifier, row.AutoID);
    updateReq.input('newValue', sql.Decimal(18, 0), newValue);
    await updateReq.query(`UPDATE SYSAutoID SET Value = @newValue WHERE AutoID = @autoId`);

    await tx.commit();

    const numStr = String(newValue).padStart(padLen, '0');
    return `${prefix}${numStr}${suffix}`;
  } catch (err) {
    try { await tx.rollback(); } catch { /* already rolled back */ }
    throw err;
  }
}
