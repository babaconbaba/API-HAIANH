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
  accountObjectAddress?: string;
  accountObjectCode?: string;
  accountObjectTaxCode?: string;
  budgetItemId?: string;
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
  refOrder?: number;
  bankAccountId?: string;
  bankAccountNumber?: string;
  bankName?: string;
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

  // Lookup RefTypeName
  let refTypeName: string | null = null;
  try {
    const rtReq = new sql.Request(transaction);
    rtReq.input('rt', sql.Int, header.refType);
    const rtResult = await rtReq.query("SELECT RefTypeName FROM SYSRefType WHERE RefType = @rt");
    refTypeName = rtResult.recordset[0]?.RefTypeName || null;
  } catch (e: any) { console.warn('[WARN]', e.message?.substring(0, 100)); }

  // Cache account names
  const accountNames: Record<string, string> = {};
  async function getAccountName(accNo: string): Promise<string | null> {
    if (!accNo) return null;
    if (accountNames[accNo]) return accountNames[accNo];
    try {
      const req = new sql.Request(transaction);
      req.input('acc', sql.NVarChar, accNo);
      const r = await req.query("SELECT AccountName FROM Account WHERE AccountNumber = @acc");
      accountNames[accNo] = r.recordset[0]?.AccountName || null;
    } catch (e: any) { console.warn('[WARN]', e.message?.substring(0, 100)); }
    return accountNames[accNo] || null;
  }

  let posted = 0;

  for (const entry of entries) {
    const baseData = {
      RefID: header.refId,
      RefDetailID: entry.refDetailId,
      RefType: header.refType,
      RefNo: header.refNo,
      RefNo1: header.refNo,
      RefNo2: header.refNo,
      RefDate: header.refDate,
      RefDate1: header.refDate,
      PostedDate: header.postedDate,
      CurrencyID: header.currencyId || 'VND',
      ExchangeRate: header.exchangeRate ?? 1,
      Description: entry.description || header.journalMemo || '',
      BranchID: header.branchId,
      JournalMemo: header.journalMemo || '',
      ExchangeRateOperator: '*',
      IsPostToManagementBook: false,
      MainConvertRate: 1,
      EntryType: 0,
      RefOrder: header.refOrder,
      RefTypeName: refTypeName,
      // Pass through from entry
      AccountObjectID: entry.accountObjectId || undefined,
      AccountObjectName: entry.accountObjectName || undefined,
      AccountObjectAddress: entry.accountObjectAddress || undefined,
      AccountObjectCode: entry.accountObjectCode || undefined,
      AccountObjectTaxCode: entry.accountObjectTaxCode || undefined,
      AccountObjectNameDI: entry.accountObjectName || undefined,
      BudgetItemID: entry.budgetItemId || undefined,
      BankAccountID: header.bankAccountId || undefined,
      BankAccountNumber: header.bankAccountNumber || undefined,
      BankName: header.bankName || undefined,
      SortOrder: 0,
    };

    // Debit side
    if (entry.debitAccount && entry.amount !== 0) {
      await insertRow(transaction, 'GeneralLedger', {
        ...baseData,
        AccountNumber: entry.debitAccount,
        AccountName: await getAccountName(entry.debitAccount),
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
        AccountName: await getAccountName(entry.creditAccount),
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
