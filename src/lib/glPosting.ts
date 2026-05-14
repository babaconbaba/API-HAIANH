import sql from 'mssql/msnodesqlv8';
import { insertRow } from './schemaInsert';

export interface GLEntry {
  refDetailId: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  amountOC: number;
  description?: string;
  accountObjectId?: string;
  accountObjectName?: string;
  employeeId?: string;
  organizationUnitId?: string;
  inventoryItemId?: string;
}

export interface GLHeader {
  refId: string;
  refType: number;
  refNo: string;
  refDate: Date;
  postedDate: Date;
  currencyId?: string;
  exchangeRate?: number;
  branchId?: string;
  journalMemo?: string;
}

/**
 * Post voucher detail lines to GeneralLedger.
 * Uses insertRow to auto-handle all NOT NULL defaults.
 */
export async function postToGeneralLedger(
  transaction: sql.Transaction,
  header: GLHeader,
  entries: GLEntry[],
  instance?: string,
  database?: string,
  auth?: string,
  username?: string,
  password?: string
): Promise<number> {
  // Clear existing GL entries
  const delReq = new sql.Request(transaction);
  delReq.input('refId', sql.UniqueIdentifier, header.refId);
  await delReq.query('DELETE FROM GeneralLedger WHERE RefID = @refId');

  let posted = 0;

  for (const entry of entries) {
    const baseData = {
      RefID: header.refId,
      RefDetailID: entry.refDetailId,
      RefType: header.refType,
      RefNo: header.refNo,
      RefDate: header.refDate,
      PostedDate: header.postedDate,
      CurrencyID: header.currencyId || 'VND',
      ExchangeRate: header.exchangeRate ?? 1,
      Description: entry.description || header.journalMemo || '',
      BranchID: header.branchId,
      JournalMemo: header.journalMemo || '',
      ExchangeRateOperator: '*',
      IsPostToManagementBook: true,
      EntryType: 0,
    };

    // Debit side
    if (entry.debitAccount && entry.amount !== 0) {
      await insertRow(transaction, 'GeneralLedger', {
        ...baseData,
        AccountNumber: entry.debitAccount,
        CorrespondingAccountNumber: entry.creditAccount,
        DebitAmountOC: entry.amountOC,
        DebitAmount: entry.amount,
        CreditAmountOC: 0,
        CreditAmount: 0,
        EntryType: 1,
      }, instance, database, auth, username, password);
      posted++;
    }

    // Credit side
    if (entry.creditAccount && entry.amount !== 0) {
      await insertRow(transaction, 'GeneralLedger', {
        ...baseData,
        AccountNumber: entry.creditAccount,
        CorrespondingAccountNumber: entry.debitAccount,
        DebitAmountOC: 0,
        DebitAmount: 0,
        CreditAmountOC: entry.amountOC,
        CreditAmount: entry.amount,
        EntryType: 2,
      }, instance, database, auth, username, password);
      posted++;
    }
  }

  return posted;
}

export async function unpostFromGeneralLedger(
  transaction: sql.Transaction,
  refId: string
): Promise<number> {
  const req = new sql.Request(transaction);
  req.input('refId', sql.UniqueIdentifier, refId);
  const result = await req.query('DELETE FROM GeneralLedger WHERE RefID = @refId');
  return result.rowsAffected[0];
}
