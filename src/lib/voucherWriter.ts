import sql from 'mssql/msnodesqlv8';
import { Request } from 'express';
import { getPoolFromReq } from '../config/database';
import { generateGUID } from './guid';
import { generateRefNo } from './autoNumber';
import { postToGeneralLedger, GLEntry, GLHeader } from './glPosting';
import { insertRow } from './schemaInsert';
import { ApiError } from '../middleware/errorHandler';

interface VoucherWriteConfig {
  masterTable: string;
  detailTable: string;
  refType: number;           // for voucher RefType field
  refTypeCategory: number;   // for SYSAutoID auto-numbering
  postToGL: boolean;
}

/**
 * Generic voucher creator — handles all NOT NULL defaults automatically.
 * Works for SAVoucher, PUVoucher, CAReceipt, CAPayment, BADeposit, BAWithDraw, GLVoucher.
 */
export async function createVoucher(
  req: Request,
  config: VoucherWriteConfig
): Promise<{ RefID: string; RefNo: string }> {
  const pool = await getPoolFromReq(req);
  const transaction = new sql.Transaction(pool);
  await transaction.begin();

  try {
    const b = req.body;
    const details = b.details || [];

    // Validate: if details provided, sum of amounts should match TotalAmount
    if (details.length > 0 && b.TotalAmount != null) {
      const detailSum = details.reduce((s: number, d: any) => s + (d.Amount ?? 0), 0);
      if (Math.abs(detailSum - b.TotalAmount) > 0.01) {
        throw new ApiError(422, 'VALIDATION_ERROR',
          `Sum of detail amounts (${detailSum}) does not match TotalAmount (${b.TotalAmount}).`);
      }
    }

    const refId = generateGUID();
    const refNo = await generateRefNo(transaction, config.refTypeCategory);
    // MISA expects dates at midnight (00:00:00) — strip time component
    const rawDate = new Date(b.RefDate || Date.now());
    const refDate = new Date(rawDate.getFullYear(), rawDate.getMonth(), rawDate.getDate());
    const rawPosted = new Date(b.PostedDate || refDate);
    const postedDate = new Date(rawPosted.getFullYear(), rawPosted.getMonth(), rawPosted.getDate());

    // Get default BranchID if not provided
    let branchId = b.BranchID;
    if (!branchId) {
      const br = new sql.Request(transaction);
      const r = await br.query("SELECT TOP 1 OrganizationUnitID FROM OrganizationUnit WHERE OrganizationUnitTypeID = 1");
      branchId = r.recordset[0]?.OrganizationUnitID;
    }

    // Auto-fill AccountObject info if ID provided
    if (b.AccountObjectID) {
      try {
        const aoReq = new sql.Request(transaction);
        aoReq.input('aoId', sql.UniqueIdentifier, b.AccountObjectID);
        const aoResult = await aoReq.query(
          `SELECT AccountObjectCode, AccountObjectName, Address, CompanyTaxCode, ContactName, Tel
           FROM AccountObject WHERE AccountObjectID = @aoId`
        );
        if (aoResult.recordset[0]) {
          const ao = aoResult.recordset[0];
          if (!b.AccountObjectCode) b.AccountObjectCode = ao.AccountObjectCode;
          if (!b.AccountObjectName) b.AccountObjectName = ao.AccountObjectName;
          if (!b.AccountObjectAddress) b.AccountObjectAddress = ao.Address;
          if (!b.AccountObjectTaxCode && !b.CompanyTaxCode) b.AccountObjectTaxCode = ao.CompanyTaxCode;
          if (!b.AccountObjectContactName) b.AccountObjectContactName = ao.ContactName;
        }
      } catch (e: any) { console.warn('[WARN]', e.message?.substring(0, 100)); }
    }

    // Auto-fill BankAccount info if ID provided
    if (b.BankAccountID && !b.BankAccountNumber) {
      try {
        const baReq = new sql.Request(transaction);
        baReq.input('baId', sql.UniqueIdentifier, b.BankAccountID);
        const baResult = await baReq.query(
          `SELECT BankAccountNumber, BankName FROM BankAccount WHERE BankAccountID = @baId`
        );
        if (baResult.recordset[0]) {
          if (!b.BankAccountNumber) b.BankAccountNumber = baResult.recordset[0].BankAccountNumber;
          if (!b.BankName) b.BankName = baResult.recordset[0].BankName;
        }
      } catch (e: any) { console.warn('[WARN]', e.message?.substring(0, 100)); }
    }

    // Build master record — merge user data with required defaults
    const masterData: Record<string, any> = {
      ...b,
      RefID: refId,
      RefType: b.RefType || config.refType,
      RefDate: refDate,
      PostedDate: postedDate,
      InvDate: b.InvDate ? new Date(b.InvDate) : refDate,
      RefNo: refNo,
      RefNoFinance: refNo,
      RefNoManagement: (b.DisplayOnBook === 1 || b.DisplayOnBook === 2) ? refNo : undefined,
      InvNo: b.InvNo || refNo,
      BranchID: branchId,
      IsPostedFinance: config.postToGL ? true : false,
      IsPostedManagement: false,
      DisplayOnBook: b.DisplayOnBook ?? 0,
      RefOrder: b.RefOrder || Date.now() % 1000000,
      ReasonTypeID: b.ReasonTypeID ?? undefined,
      CurrencyID: b.CurrencyID || 'VND',
      ExchangeRate: b.ExchangeRate ?? 1,
      TotalAmount: b.TotalAmount ?? 0,
      TotalAmountOC: b.TotalAmountOC ?? b.TotalAmount ?? 0,
      CreatedDate: new Date(),
      CreatedBy: req.user?.username || 'api',
      ModifiedDate: new Date(),
      ModifiedBy: req.user?.username || 'api',
      // Common SA fields with defaults
      TotalSaleAmount: b.TotalSaleAmount ?? b.TotalAmount ?? 0,
      TotalSaleAmountOC: b.TotalSaleAmountOC ?? b.TotalSaleAmount ?? b.TotalAmount ?? 0,
      TotalVATAmount: b.TotalVATAmount ?? 0,
      TotalVATAmountOC: b.TotalVATAmountOC ?? b.TotalVATAmount ?? 0,
      TotalDiscountAmount: b.TotalDiscountAmount ?? 0,
      TotalDiscountAmountOC: b.TotalDiscountAmountOC ?? b.TotalDiscountAmount ?? 0,
      INRefOrder: b.INRefOrder || new Date(),
    };

    // Remove 'details' from master (it's for detail lines)
    delete masterData.details;

    // Pass SQL credentials for schema lookup on remote connections
    const sqlCreds = { auth: req.sqlAuth, username: req.sqlUsername, password: req.sqlPassword };

    await insertRow(transaction, config.masterTable, masterData, req.sqlInstance, req.sqlDatabase, sqlCreds.auth, sqlCreds.username, sqlCreds.password);

    // Insert detail lines
    const glEntries: GLEntry[] = [];

    for (let i = 0; i < details.length; i++) {
      const d = details[i];
      const detailId = generateGUID();

      const detailData: Record<string, any> = {
        ...d,
        RefDetailID: detailId,
        RefID: refId,
        SortOrder: d.SortOrder ?? i,
        // Inherit AccountObjectID from master if detail doesn't specify
        AccountObjectID: d.AccountObjectID || b.AccountObjectID || undefined,
        Amount: d.Amount ?? 0,
        AmountOC: d.AmountOC ?? d.Amount ?? 0,
        Quantity: d.Quantity ?? 0,
        UnitPrice: d.UnitPrice ?? 0,
        InventoryItemID: d.InventoryItemID || undefined, // let schemaInsert skip if not provided (FK constraint)
        // For IN tables
        AmountFinance: d.AmountFinance ?? d.Amount ?? 0,
        AmountManagement: d.AmountManagement ?? d.Amount ?? 0,
        UnitPriceFinance: d.UnitPriceFinance ?? d.UnitPrice ?? 0,
        UnitPriceManagement: d.UnitPriceManagement ?? d.UnitPrice ?? 0,
      };

      await insertRow(transaction, config.detailTable, detailData, req.sqlInstance, req.sqlDatabase, sqlCreds.auth, sqlCreds.username, sqlCreds.password);

      // Insert CustomFieldLedger — MISA requires this row per detail line
      try {
        await insertRow(transaction, 'CustomFieldLedger', {
          RefDetailID: detailId,
          RefID: refId,
          IsPostToManagementBook: false,
          BranchID: branchId,
          PostedDate: postedDate,
          IsUpdateRedundant: true,
        }, req.sqlInstance, req.sqlDatabase, sqlCreds.auth, sqlCreds.username, sqlCreds.password);
      } catch (e: any) { console.warn('[WARN] CustomFieldLedger:', e.message?.substring(0, 80)); }

      if (config.postToGL && (d.DebitAccount || d.CreditAccount)) {
        glEntries.push({
          refDetailId: detailId,
          debitAccount: d.DebitAccount || '',
          creditAccount: d.CreditAccount || '',
          amount: d.Amount ?? 0,
          amountOC: d.AmountOC ?? d.Amount ?? 0,
          description: d.Description || '',
          accountObjectId: d.AccountObjectID || b.AccountObjectID,
          accountObjectName: b.AccountObjectName,
          accountObjectAddress: b.AccountObjectAddress,
          accountObjectCode: b.AccountObjectCode,
          accountObjectTaxCode: b.AccountObjectTaxCode,
          budgetItemId: d.BudgetItemID,
        });
      }
    }

    // Post to General Ledger
    if (config.postToGL && glEntries.length > 0) {
      const glHeader: GLHeader = {
        refId,
        refType: b.RefType || config.refType,
        refNo,
        refDate,
        postedDate,
        currencyId: b.CurrencyID || 'VND',
        exchangeRate: b.ExchangeRate ?? 1,
        branchId,
        journalMemo: b.JournalMemo || '',
        refOrder: masterData.RefOrder,
        bankAccountId: b.BankAccountID,
        bankAccountNumber: b.BankAccountNumber,
        bankName: b.BankName,
      };
      await postToGeneralLedger(transaction, glHeader, glEntries, req.sqlInstance, req.sqlDatabase, sqlCreds.auth, sqlCreds.username, sqlCreds.password);
    }

    // Insert into list/ledger tables — MISA reads these for list views
    const listData = {
      RefID: refId, RefDate: refDate, PostedDate: postedDate,
      RefType: b.RefType || config.refType, RefNoFinance: refNo,
      IsPostedFinance: config.postToGL ? true : false, IsPostedManagement: false,
      ReasonTypeID: b.ReasonTypeID ?? undefined,
      AccountObjectID: b.AccountObjectID || undefined,
      AccountObjectName: b.AccountObjectName || undefined,
      AccountObjectAddress: b.AccountObjectAddress || undefined,
      BranchID: branchId,
      TotalAmount: b.TotalAmount ?? 0, TotalAmountOC: b.TotalAmountOC ?? b.TotalAmount ?? 0,
      CurrencyID: b.CurrencyID || 'VND', ExchangeRate: b.ExchangeRate ?? 1,
      JournalMemo: b.JournalMemo || '',
      BankAccountID: b.BankAccountID || undefined,
    };

    const listTableMap: Record<string, string[]> = {
      CAReceipt: ['CAReceiptPaymentList'],
      CAPayment: ['CAReceiptPaymentList'],
      BADeposit: ['BADepositWithdrawList'],
      BAWithDraw: ['BADepositWithdrawList'],
      BAInternalTransfer: ['BADepositWithdrawList'],
      INInward: ['INInwardOutwardList'],
      INOutward: ['INInwardOutwardList'],
      INTransfer: ['INInwardOutwardList'],
      SAVoucher: ['SaleLedger'],
      PUVoucher: ['PurchaseLedger'],
      PUService: ['PurchaseLedger'],
    };

    const listTables = listTableMap[config.masterTable] || [];
    for (const lt of listTables) {
      try {
        await insertRow(transaction, lt, listData, req.sqlInstance, req.sqlDatabase, sqlCreds.auth, sqlCreds.username, sqlCreds.password);
      } catch (e: any) { console.warn(`[WARN] ${lt}:`, e.message?.substring(0, 100)); }
    }

    await transaction.commit();
    return { RefID: refId, RefNo: refNo };
  } catch (err) {
    try { await transaction.rollback(); } catch (e: any) { console.warn('[WARN]', e.message?.substring(0, 100)); }
    throw err;
  }
}
