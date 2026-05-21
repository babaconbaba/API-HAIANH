import sql from 'mssql';
import { Request } from 'express';
import { getPoolFromReq } from '../config/database';
import { generateGUID } from './guid';
import { generateRefNo } from './autoNumber';
import { postToGeneralLedger, GLEntry, GLHeader } from './glPosting';
import { insertRow } from './schemaInsert';
import { ApiError } from '../middleware/errorHandler';
import { REFTYPE_TO_CATEGORY } from '../config/refTypes';

interface VoucherWriteConfig {
  masterTable: string;
  detailTable: string;
  refType: number;           // for voucher RefType field
  refTypeCategory: number;   // for SYSAutoID auto-numbering
  postToGL: boolean;
}

/**
 * Generic voucher creator — handles all NOT NULL defaults automatically.
 * Works for SAVoucher, PUVoucher, CAReceipt, CAPayment, BADeposit, BAWithDraw, GLVoucher, IN*, etc.
 * Inserts into list/ledger tables so vouchers show in MISA desktop.
 */
export async function createVoucher(
  req: Request,
  config: VoucherWriteConfig
): Promise<{ RefID: string; RefNo: string }> {
  const MAX_RETRIES = 3;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await _createVoucherInner(req, config);
    } catch (err: any) {
      const isDeadlock = err.number === 1205 || err.message?.includes('deadlock');
      if (isDeadlock && attempt < MAX_RETRIES) {
        console.warn(`[WARN] Deadlock on attempt ${attempt}, retrying...`);
        await new Promise(r => setTimeout(r, 50 * attempt));
        continue;
      }
      throw err;
    }
  }
  throw new Error('Unreachable');
}

async function _createVoucherInner(
  req: Request,
  config: VoucherWriteConfig
): Promise<{ RefID: string; RefNo: string }> {
  const pool = await getPoolFromReq(req);
  const transaction = new sql.Transaction(pool);
  await transaction.begin();

  try {
    const b = req.body;
    const details = b.details || [];

    // Validate required fields
    if (!details.length) {
      throw new ApiError(422, 'VALIDATION_ERROR', 'details array is required and must have at least 1 item.');
    }
    if (b.TotalAmount == null || b.TotalAmount === 0) {
      throw new ApiError(422, 'VALIDATION_ERROR', 'TotalAmount is required and must not be 0.');
    }
    if (b.TotalAmount < 0) {
      throw new ApiError(422, 'VALIDATION_ERROR', 'TotalAmount must be positive.');
    }
    for (let i = 0; i < details.length; i++) {
      const d = details[i];
      if (!d.DebitAccount && !d.CreditAccount) {
        throw new ApiError(422, 'VALIDATION_ERROR', `details[${i}]: DebitAccount or CreditAccount is required.`);
      }
      if (d.Amount == null) {
        throw new ApiError(422, 'VALIDATION_ERROR', `details[${i}]: Amount is required.`);
      }
    }

    // Validate: sum of detail amounts must match TotalAmount
    const detailSum = details.reduce((s: number, d: any) => s + (d.Amount ?? 0), 0);
    if (Math.abs(detailSum - b.TotalAmount) > 0.01) {
      throw new ApiError(422, 'VALIDATION_ERROR',
        `Sum of detail amounts (${detailSum}) does not match TotalAmount (${b.TotalAmount}).`);
    }

    const refId = generateGUID();

    // Get default BranchID first (needed for auto-numbering)
    let branchId = b.BranchID;
    if (!branchId) {
      const br = new sql.Request(transaction);
      const r = await br.query("SELECT TOP 1 OrganizationUnitID FROM OrganizationUnit WHERE OrganizationUnitTypeID = 1");
      branchId = r.recordset[0]?.OrganizationUnitID;
    }

    // PostToGL: default from route config, override with body.PostToGL
    const postToGL = b.PostToGL !== undefined ? !!b.PostToGL : config.postToGL;

    // Use user's RefType to determine correct auto-numbering category
    const actualRefType = b.RefType || config.refType;
    const autoNumCategory = REFTYPE_TO_CATEGORY[actualRefType] || config.refTypeCategory;
    const refNo = await generateRefNo(pool, autoNumCategory, branchId, b.DisplayOnBook ?? 0);
    // MISA expects dates at midnight (00:00:00) — strip time component
    const rawDate = new Date(b.RefDate || Date.now());
    const refDate = new Date(rawDate.getFullYear(), rawDate.getMonth(), rawDate.getDate());
    const rawPosted = new Date(b.PostedDate || refDate);
    const postedDate = new Date(rawPosted.getFullYear(), rawPosted.getMonth(), rawPosted.getDate());

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

    // Determine if SA/PU/IN type
    const isSA = config.masterTable === 'SAVoucher' || config.masterTable === 'SAReturn';
    const isPU = config.masterTable === 'PUVoucher' || config.masterTable === 'PUService';
    const isIN = config.masterTable.startsWith('IN');
    const isBA = config.masterTable.startsWith('BA');

    // Build master record — merge user data with required defaults
    const masterData: Record<string, any> = {
      ...b,
      RefID: refId,
      RefType: b.RefType || config.refType,
      RefDate: refDate,
      PostedDate: postedDate,
      // SA/IN: don't set InvNo/InvDate unless user provides (desktop leaves NULL)
      InvDate: b.InvDate ? new Date(b.InvDate) : ((isSA || isIN) ? undefined : refDate),
      RefNo: refNo,
      RefNoFinance: refNo,
      RefNoManagement: (b.DisplayOnBook === 1 || b.DisplayOnBook === 2) ? refNo : undefined,
      InvNo: b.InvNo || ((isSA || isIN) ? undefined : refNo),
      BranchID: branchId,
      IsPostedFinance: postToGL,
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
      // SA-specific
      TotalSaleAmount: isSA ? (b.TotalSaleAmount ?? b.TotalAmount ?? 0) : undefined,
      TotalSaleAmountOC: isSA ? (b.TotalSaleAmountOC ?? b.TotalSaleAmount ?? b.TotalAmount ?? 0) : undefined,
      IsSaleWithOutward: isSA ? (b.IsSaleWithOutward ?? true) : undefined,
      IsOutwardExported: isSA ? (b.IsOutwardExported ?? 1) : undefined,
      // PU-specific
      CABARefDate: isPU ? refDate : (b.CABARefDate ? new Date(b.CABARefDate) : undefined),
      CABAPostedDate: isPU ? postedDate : (b.CABAPostedDate ? new Date(b.CABAPostedDate) : undefined),
      TotalInwardAmount: isPU ? (b.TotalInwardAmount ?? b.TotalAmount ?? 0) : (isIN ? (b.TotalInwardAmount ?? b.TotalAmount ?? 0) : undefined),
      // IN-specific
      TotalAmountFinance: isIN ? (b.TotalAmountFinance ?? b.TotalAmount ?? 0) : undefined,
      TotalAmountManagement: isIN ? (b.TotalAmountManagement ?? b.TotalAmount ?? 0) : undefined,
      INRefOrder: (isIN || isSA) ? (b.INRefOrder || new Date()) : undefined,
      // RevenueStatus: 1 khi IsSaleWithOutward=true (xuất kho bán hàng), 0 khi khác
      RevenueStatus: (config.masterTable === 'INOutward') ? (b.RevenueStatus ?? (b.IsSaleWithOutward ? 1 : 0)) : undefined,
      // Common tax/discount
      TotalVATAmount: b.TotalVATAmount ?? 0,
      TotalVATAmountOC: b.TotalVATAmountOC ?? b.TotalVATAmount ?? 0,
      TotalDiscountAmount: b.TotalDiscountAmount ?? 0,
      TotalDiscountAmountOC: b.TotalDiscountAmountOC ?? b.TotalDiscountAmount ?? 0,
    };

    // Remove 'details' from master (it's for detail lines)
    delete masterData.details;

    // Pass SQL credentials for schema lookup on remote connections
    const sqlCreds = { auth: req.sqlAuth, username: req.sqlUsername, password: req.sqlPassword };

    await insertRow(transaction, config.masterTable, masterData, req.sqlInstance, req.sqlDatabase, sqlCreds.auth, sqlCreds.username, sqlCreds.password);

    // Insert detail lines — track detailIds for SaleLedger/PurchaseLedger
    const glEntries: GLEntry[] = [];
    const detailIds: string[] = [];

    for (let i = 0; i < details.length; i++) {
      const d = details[i];
      const detailId = generateGUID();
      detailIds.push(detailId);

      const amt = d.Amount ?? 0;
      const amtOC = d.AmountOC ?? amt;
      const qty = d.Quantity ?? 0;
      const up = d.UnitPrice ?? 0;

      const detailData: Record<string, any> = {
        ...d,
        RefDetailID: detailId,
        RefID: refId,
        SortOrder: d.SortOrder ?? i,
        AccountObjectID: d.AccountObjectID || b.AccountObjectID || undefined,
        Amount: amt,
        AmountOC: amtOC,
        Quantity: qty,
        UnitPrice: up,
        InventoryItemID: d.InventoryItemID || undefined,
        // Unit conversion — default 1:1
        MainConvertRate: d.MainConvertRate ?? 1,
        MainQuantity: d.MainQuantity ?? qty,
        MainUnitPrice: d.MainUnitPrice ?? up,
        MainUnitPriceOC: d.MainUnitPriceOC ?? d.MainUnitPrice ?? up,
        // For IN tables
        AmountFinance: isIN ? (d.AmountFinance ?? amt) : undefined,
        AmountManagement: isIN ? (d.AmountManagement ?? amt) : undefined,
        UnitPriceFinance: isIN ? (d.UnitPriceFinance ?? up) : undefined,
        UnitPriceManagement: isIN ? (d.UnitPriceManagement ?? up) : undefined,
        // SA detail fields
        VATDescription: d.VATDescription || undefined,
        AmountAfterTax: d.AmountAfterTax ?? (isSA ? 0 : undefined),
        QuantityBilled: d.QuantityBilled ?? (isSA ? 0 : undefined),
        MainQuantityBilled: d.MainQuantityBilled ?? (isSA ? 0 : undefined),
        // PU detail fields
        InwardAmount: isPU ? (d.InwardAmount ?? amt) : undefined,
        FOBAmountOC: isPU ? (d.FOBAmountOC ?? amtOC) : undefined,
        FOBAmount: isPU ? (d.FOBAmount ?? amt) : undefined,
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

      if (postToGL && (d.DebitAccount || d.CreditAccount)) {
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
          contactName: b.AccountObjectContactName,
          // Inventory/Stock info for SA/PU GL entries
          inventoryItemId: d.InventoryItemID,
          inventoryItemCode: d.InventoryItemCode,
          inventoryItemName: d.InventoryItemName || d.Description,
          stockId: d.StockID,
          stockCode: d.StockCode,
          stockName: d.StockName,
          unitId: d.UnitID,
          mainUnitId: d.MainUnitID || d.UnitID,
          quantity: d.Quantity ?? d.SaleQuantity ?? d.PurchaseQuantity ?? 0,
          mainQuantity: d.MainQuantity ?? d.Quantity ?? 0,
          sortOrder: d.SortOrder ?? i,
        });
      }
    }

    // Post to General Ledger
    if (postToGL && glEntries.length > 0) {
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

    // Lookup RefTypeName
    let refTypeName: string | undefined;
    try {
      const rtReq = new sql.Request(transaction);
      rtReq.input('rt', sql.Int, b.RefType || config.refType);
      const rtR = await rtReq.query("SELECT RefTypeName FROM SYSRefType WHERE RefType = @rt");
      refTypeName = rtR.recordset[0]?.RefTypeName;
    } catch (e: any) { console.warn('[WARN] RefTypeName:', e.message?.substring(0, 80)); }

    // ========================
    // INSERT INTO LIST/LEDGER TABLES — MISA reads these for list views
    // ========================
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
    const refType = b.RefType || config.refType;

    for (const lt of listTables) {
      try {
        if (lt === 'SaleLedger') {
          // ====== SaleLedger: INSERT PER DETAIL LINE ======
          // 32 NOT NULL columns — needs InventoryItem/Stock lookups
          await insertSaleLedgerRows(transaction, {
            refId, refType, refNo, refDate, postedDate, branchId, refTypeName,
            currencyId: b.CurrencyID || 'VND',
            exchangeRate: b.ExchangeRate ?? 1,
            journalMemo: b.JournalMemo || '',
            accountObjectId: b.AccountObjectID,
            accountObjectName: b.AccountObjectName,
            accountObjectAddress: b.AccountObjectAddress,
            accountObjectCode: b.AccountObjectCode,
            refOrder: masterData.RefOrder,
            details, detailIds,
          }, req.sqlInstance, req.sqlDatabase, sqlCreds.auth, sqlCreds.username, sqlCreds.password);

        } else if (lt === 'PurchaseLedger') {
          // ====== PurchaseLedger: INSERT PER DETAIL LINE ======
          // 27 NOT NULL columns — needs InventoryItem lookups
          await insertPurchaseLedgerRows(transaction, {
            refId, refType, refNo, refDate, postedDate, branchId, refTypeName,
            currencyId: b.CurrencyID || 'VND',
            exchangeRate: b.ExchangeRate ?? 1,
            journalMemo: b.JournalMemo || '',
            accountObjectId: b.AccountObjectID,
            accountObjectName: b.AccountObjectName,
            accountObjectAddress: b.AccountObjectAddress,
            accountObjectCode: b.AccountObjectCode,
            refOrder: masterData.RefOrder,
            includeInvoice: b.IncludeInvoice ?? 0,
            details, detailIds,
          }, req.sqlInstance, req.sqlDatabase, sqlCreds.auth, sqlCreds.username, sqlCreds.password);

        } else {
          // ====== Header-level list tables (CA, BA, IN) ======
          const listData = buildHeaderListData(lt, config, {
            refId, refDate, postedDate, refType, refNo, branchId, refTypeName,
            body: b, masterData, username: req.user?.username || 'api', postToGL,
          });
          await insertRow(transaction, lt, listData, req.sqlInstance, req.sqlDatabase, sqlCreds.auth, sqlCreds.username, sqlCreds.password);
        }
      } catch (e: any) { console.warn(`[WARN] ${lt}:`, e.message?.substring(0, 150)); }
    }

    await transaction.commit();
    return { RefID: refId, RefNo: refNo };
  } catch (err) {
    try { await transaction.rollback(); } catch (e: any) { console.warn('[WARN]', e.message?.substring(0, 100)); }
    throw err;
  }
}

// ========================
// Header-level list table builder (CAReceiptPaymentList, BADepositWithdrawList, INInwardOutwardList)
// ========================
function buildHeaderListData(
  listTable: string,
  config: VoucherWriteConfig,
  ctx: {
    refId: string; refDate: Date; postedDate: Date; refType: number;
    refNo: string; branchId: string; refTypeName?: string;
    body: any; masterData: any; username: string; postToGL: boolean;
  }
): Record<string, any> {
  const b = ctx.body;
  const now = new Date();

  // Common fields for all header-level list tables
  const base: Record<string, any> = {
    RefID: ctx.refId,
    RefDate: ctx.refDate,
    PostedDate: ctx.postedDate,
    RefType: ctx.refType,
    RefNoFinance: ctx.refNo,
    IsPostedFinance: ctx.postToGL,
    IsPostedManagement: false,
    ReasonTypeID: b.ReasonTypeID ?? undefined,
    AccountObjectID: b.AccountObjectID || undefined,
    AccountObjectName: b.AccountObjectName || undefined,
    AccountObjectAddress: b.AccountObjectAddress || undefined,
    AccountObjectContactName: b.AccountObjectContactName || undefined,
    BranchID: ctx.branchId,
    JournalMemo: b.JournalMemo || '',
    CurrencyID: b.CurrencyID || 'VND',
    ExchangeRate: b.ExchangeRate ?? 1,
    TotalAmountOC: b.TotalAmountOC ?? b.TotalAmount ?? 0,
    TotalAmount: b.TotalAmount ?? 0,
    DisplayOnBook: b.DisplayOnBook ?? 0,
    RefOrder: ctx.masterData.RefOrder,
    CreatedDate: now,
    CreatedBy: ctx.username,
    ModifiedDate: now,
    ModifiedBy: ctx.username,
    ListTableName: config.masterTable,
    RefTypeName: ctx.refTypeName,
  };

  if (listTable === 'CAReceiptPaymentList') {
    // CAReceiptPaymentList — CA vouchers
    return {
      ...base,
      CAType: config.masterTable === 'CAPayment' ? 1 : 0,
      IsPostedCashBookFinance: false,
      IsPostedCashBookManagement: false,
      PayReason: b.JournalMemo || b.PayReason || '',
      BankAccountID: b.BankAccountID || undefined,
    };
  }

  if (listTable === 'BADepositWithdrawList') {
    // BADepositWithdrawList — BA vouchers
    // BAType: 0=deposit, 1=withdraw/internal transfer
    let baType = 0;
    if (config.masterTable === 'BAWithDraw') baType = 1;
    if (config.masterTable === 'BAInternalTransfer') baType = 0; // desktop shows BAType=0 for internal transfer

    return {
      ...base,
      BAType: baType,
      BankAccountID: b.BankAccountID || undefined,
      BankName: b.BankName || undefined,
      // BADeposit has IsCreateFromEBHistory=false; BAWithDraw/InternalTransfer leave NULL
      IsCreateFromEBHistory: config.masterTable === 'BADeposit' ? (b.IsCreateFromEBHistory ?? false) : undefined,
    };
  }

  if (listTable === 'INInwardOutwardList') {
    // INInwardOutwardList — IN vouchers
    // Only 4 NOT NULL cols: RefID, IsCreatedSAReturnLastYear, InvoiceSystem, IsProcessInvoiceError
    // DO NOT default other fields to 0/false — desktop leaves them NULL
    const isOutward = config.masterTable === 'INOutward' || config.masterTable === 'INTransfer';
    const inType = isOutward ? 1 : 0;

    return {
      ...base,
      INType: inType,
      // INOutward: desktop leaves CurrencyID/ExchangeRate NULL
      CurrencyID: isOutward ? (b.CurrencyID || undefined) : (b.CurrencyID || 'VND'),
      ExchangeRate: isOutward ? (b.ExchangeRate ?? undefined) : (b.ExchangeRate ?? 1),
      // Only set CABA dates if user provides them (desktop sets for PU-linked inwards)
      CABARefDate: b.CABARefDate ? new Date(b.CABARefDate) : undefined,
      CABAPostedDate: b.CABAPostedDate ? new Date(b.CABAPostedDate) : undefined,
      IncludeInvoice: b.IncludeInvoice ?? undefined,
      UnitPriceMethod: b.UnitPriceMethod ?? 0,
      // Amount fields — only set if user provides, else NULL (desktop varies by RefType)
      TotalImportTaxAmountOC: b.TotalImportTaxAmountOC ?? undefined,
      TotalImportTaxAmount: b.TotalImportTaxAmount ?? undefined,
      TotalVATAmountOC: b.TotalVATAmountOC ?? undefined,
      TotalVATAmount: b.TotalVATAmount ?? undefined,
      TotalDiscountAmountOC: b.TotalDiscountAmountOC ?? undefined,
      TotalDiscountAmount: b.TotalDiscountAmount ?? undefined,
      TotalFreightAmount: b.TotalFreightAmount ?? undefined,
      TotalInwardAmount: b.TotalInwardAmount ?? undefined,
      TotalSpecialConsumeTaxAmountOC: b.TotalSpecialConsumeTaxAmountOC ?? undefined,
      TotalSpecialConsumeTaxAmount: b.TotalSpecialConsumeTaxAmount ?? undefined,
      TotalCustomBeforeAmount: b.TotalCustomBeforeAmount ?? undefined,
      TotalAmountFinance: b.TotalAmountFinance ?? b.TotalAmount ?? 0,
      TotalAmountManagement: b.TotalAmountManagement ?? b.TotalAmount ?? 0,
      // Boolean flags — leave NULL (desktop varies by RefType)
      IsPaid: b.IsPaid ?? undefined,
      IsPostedCashBookFinance: b.IsPostedCashBookFinance ?? undefined,
      IsPostedCashBookManagement: b.IsPostedCashBookManagement ?? undefined,
      IsPostedInventoryBookFinance: false,
      IsPostedInventoryBookManagement: false,
      // IN-specific
      RevenueStatus: isOutward ? (b.RevenueStatus ?? (b.IsSaleWithOutward ? 1 : 0)) : undefined,
      RevenueStatusName: isOutward ? (b.RevenueStatusName ?? '') : undefined,
      CABAAmountOC: b.CABAAmountOC ?? undefined,
      CABAAmount: b.CABAAmount ?? undefined,
      INRefOrder: b.INRefOrder || new Date(),
      IsSaleWithOutward: b.IsSaleWithOutward ?? false,
      // NOT NULL required (schema enforced)
      IsCreatedSAReturnLastYear: false,
      InvoiceSystem: b.InvoiceSystem ?? 0,
      IsProcessInvoiceError: false,
    };
  }

  // Fallback — generic list data
  return base;
}

// ========================
// SaleLedger: insert per detail line (32 NOT NULL cols)
// ========================
interface LedgerContext {
  refId: string; refType: number; refNo: string; refDate: Date; postedDate: Date;
  branchId: string; refTypeName?: string; currencyId: string; exchangeRate: number;
  journalMemo: string; accountObjectId?: string; accountObjectName?: string;
  accountObjectAddress?: string; accountObjectCode?: string;
  refOrder: number; details: any[]; detailIds: string[];
  includeInvoice?: number;
}

async function insertSaleLedgerRows(
  transaction: sql.Transaction,
  ctx: LedgerContext,
  instance?: string, database?: string, auth?: string, username?: string, password?: string
) {
  // Cache for InventoryItem and Stock lookups
  const invCache: Record<string, any> = {};
  const stockCache: Record<string, any> = {};

  async function getInventoryItem(id: string) {
    if (!id || invCache[id]) return invCache[id] || null;
    try {
      const req = new sql.Request(transaction);
      req.input('id', sql.UniqueIdentifier, id);
      const r = await req.query("SELECT InventoryItemCode, InventoryItemName FROM InventoryItem WHERE InventoryItemID = @id");
      invCache[id] = r.recordset[0] || null;
    } catch { invCache[id] = null; }
    return invCache[id];
  }

  async function getStock(id: string) {
    if (!id || stockCache[id]) return stockCache[id] || null;
    try {
      const req = new sql.Request(transaction);
      req.input('id', sql.UniqueIdentifier, id);
      const r = await req.query("SELECT StockCode, StockName FROM Stock WHERE StockID = @id");
      stockCache[id] = r.recordset[0] || null;
    } catch { stockCache[id] = null; }
    return stockCache[id];
  }

  for (let i = 0; i < ctx.details.length; i++) {
    const d = ctx.details[i];
    const detailId = ctx.detailIds[i];

    const inv = d.InventoryItemID ? await getInventoryItem(d.InventoryItemID) : null;
    const stk = d.StockID ? await getStock(d.StockID) : null;

    const saleQty = d.SaleQuantity ?? d.Quantity ?? 0;
    const saleAmtOC = d.SaleAmountOC ?? d.AmountOC ?? d.Amount ?? 0;
    const saleAmt = d.SaleAmount ?? d.Amount ?? 0;
    const unitPrice = d.UnitPrice ?? 0;

    await insertRow(transaction, 'SaleLedger', {
      // SaleLedgerID is identity — auto-generated
      RefID: ctx.refId,
      RefDetailID: detailId,
      BranchID: ctx.branchId,
      RefType: ctx.refType,
      RefNo: ctx.refNo,
      RefDate: ctx.refDate,
      PostedDate: ctx.postedDate,
      CurrencyID: ctx.currencyId,
      ExchangeRate: ctx.exchangeRate,
      JournalMemo: ctx.journalMemo,
      // Item info
      InventoryItemID: d.InventoryItemID || undefined,
      InventoryItemCode: d.InventoryItemCode || inv?.InventoryItemCode || undefined,
      InventoryItemName: d.InventoryItemName || inv?.InventoryItemName || d.Description || undefined,
      Description: d.Description || '',
      StockID: d.StockID || undefined,
      StockCode: d.StockCode || stk?.StockCode || undefined,
      StockName: d.StockName || stk?.StockName || undefined,
      // Accounts
      DebitAccount: d.DebitAccount || '',
      CreditAccount: d.CreditAccount || '',
      DiscountAccount: d.DiscountAccount || undefined,
      VATAccount: d.VATAccount || undefined,
      // Unit
      UnitID: d.UnitID || undefined,
      MainUnitID: d.MainUnitID || d.UnitID || undefined,
      // Amounts — all NOT NULL with defaults
      UnitPrice: unitPrice,
      UnitPriceOC: d.UnitPriceOC ?? unitPrice,
      SaleQuantity: saleQty,
      SaleAmountOC: saleAmtOC,
      SaleAmount: saleAmt,
      DiscountRate: d.DiscountRate ?? 0,
      DiscountAmountOC: d.DiscountAmountOC ?? d.DiscountAmount ?? 0,
      DiscountAmount: d.DiscountAmount ?? 0,
      VATRate: d.VATRate ?? undefined,
      VATAmountOC: d.VATAmountOC ?? d.VATAmount ?? 0,
      VATAmount: d.VATAmount ?? 0,
      ExportTaxRate: d.ExportTaxRate ?? 0,
      ExportTaxAmountOC: d.ExportTaxAmountOC ?? 0,
      ExportTaxAmount: d.ExportTaxAmount ?? 0,
      ReturnQuantity: d.ReturnQuantity ?? 0,
      ReturnAmountOC: d.ReturnAmountOC ?? 0,
      ReturnAmount: d.ReturnAmount ?? 0,
      ReturnMainQuantity: d.ReturnMainQuantity ?? 0,
      ReduceAmountOC: d.ReduceAmountOC ?? 0,
      ReduceAmount: d.ReduceAmount ?? 0,
      ReceiptAmountOC: d.ReceiptAmountOC ?? saleAmtOC,
      ReceiptAmount: d.ReceiptAmount ?? saleAmt,
      IsPromotion: d.IsPromotion ?? false,
      // Main unit
      MainUnitPrice: d.MainUnitPrice ?? unitPrice,
      MainUnitPriceOC: d.MainUnitPriceOC ?? d.MainUnitPrice ?? unitPrice,
      MainConvertRate: d.MainConvertRate ?? 1,
      MainQuantity: d.MainQuantity ?? saleQty,
      ExchangeRateOperator: d.ExchangeRateOperator || '*',
      // Flags
      IsPostToManagementBook: false,
      IsUpdateRedundant: d.IsUpdateRedundant ?? false,
      // Object info
      AccountObjectID: d.AccountObjectID || ctx.accountObjectId || undefined,
      AccountObjectName: ctx.accountObjectName || undefined,
      AccountObjectAddress: ctx.accountObjectAddress || undefined,
      AccountObjectCode: ctx.accountObjectCode || undefined,
      AccountObjectNameDI: ctx.accountObjectName || undefined,
      // Order/sort
      SortOrder: d.SortOrder ?? i,
      RefOrder: ctx.refOrder,
      RefTypeName: ctx.refTypeName,
      // Optional
      OrderID: d.OrderID || undefined,
      EmployeeID: d.EmployeeID || undefined,
      JobID: d.JobID || undefined,
      ContractID: d.ContractID || undefined,
      ListItemID: d.ListItemID || undefined,
      OrganizationUnitID: d.OrganizationUnitID || undefined,
      ProjectWorkID: d.ProjectWorkID || undefined,
    }, instance, database, auth, username, password);
  }
}

// ========================
// PurchaseLedger: insert per detail line (27 NOT NULL cols)
// ========================
async function insertPurchaseLedgerRows(
  transaction: sql.Transaction,
  ctx: LedgerContext,
  instance?: string, database?: string, auth?: string, username?: string, password?: string
) {
  const invCache: Record<string, any> = {};

  async function getInventoryItem(id: string) {
    if (!id || invCache[id]) return invCache[id] || null;
    try {
      const req = new sql.Request(transaction);
      req.input('id', sql.UniqueIdentifier, id);
      const r = await req.query("SELECT InventoryItemCode, InventoryItemName FROM InventoryItem WHERE InventoryItemID = @id");
      invCache[id] = r.recordset[0] || null;
    } catch { invCache[id] = null; }
    return invCache[id];
  }

  for (let i = 0; i < ctx.details.length; i++) {
    const d = ctx.details[i];
    const detailId = ctx.detailIds[i];

    const inv = d.InventoryItemID ? await getInventoryItem(d.InventoryItemID) : null;

    const purchaseQty = d.PurchaseQuantity ?? d.Quantity ?? 0;
    const purchaseAmtOC = d.PurchaseAmountOC ?? d.AmountOC ?? d.Amount ?? 0;
    const purchaseAmt = d.PurchaseAmount ?? d.Amount ?? 0;
    const unitPrice = d.UnitPrice ?? 0;

    await insertRow(transaction, 'PurchaseLedger', {
      // PurchaseLedgerID is identity — auto-generated
      RefDetailID: detailId,
      RefID: ctx.refId,
      BranchID: ctx.branchId,
      PostedDate: ctx.postedDate,
      RefDate: ctx.refDate,
      RefType: ctx.refType,
      RefNo: ctx.refNo,
      JournalMemo: ctx.journalMemo,
      CurrencyID: ctx.currencyId,
      ExchangeRate: ctx.exchangeRate,
      // Item info
      InventoryItemID: d.InventoryItemID || undefined,
      InventoryItemCode: d.InventoryItemCode || inv?.InventoryItemCode || undefined,
      InventoryItemName: d.InventoryItemName || inv?.InventoryItemName || d.Description || undefined,
      Description: d.Description || '',
      // Accounts
      DebitAccount: d.DebitAccount || '',
      CreditAccount: d.CreditAccount || '',
      // Unit
      UnitID: d.UnitID || undefined,
      UnitPrice: unitPrice,
      UnitPriceOC: d.UnitPriceOC ?? unitPrice,
      // Amounts — all NOT NULL
      PurchaseQuantity: purchaseQty,
      PurchaseAmountOC: purchaseAmtOC,
      PurchaseAmount: purchaseAmt,
      DiscountRate: d.DiscountRate ?? 0,
      DiscountAmountOC: d.DiscountAmountOC ?? d.DiscountAmount ?? 0,
      DiscountAmount: d.DiscountAmount ?? 0,
      VATAmount: d.VATAmount ?? 0,
      VATAmountOC: d.VATAmountOC ?? d.VATAmount ?? 0,
      VATRate: d.VATRate ?? 0,
      VATAccount: d.VATAccount || undefined,
      ReturnQuantity: d.ReturnQuantity ?? 0,
      ReturnAmountOC: d.ReturnAmountOC ?? 0,
      ReturnAmount: d.ReturnAmount ?? 0,
      ReturnMainQuantity: d.ReturnMainQuantity ?? 0,
      ReduceAmountOC: d.ReduceAmountOC ?? 0,
      ReduceAmount: d.ReduceAmount ?? 0,
      // Main unit
      MainUnitPrice: d.MainUnitPrice ?? 0,
      MainUnitPriceOC: d.MainUnitPriceOC ?? d.MainUnitPrice ?? 0,
      MainConvertRate: d.MainConvertRate ?? 1,
      MainQuantity: d.MainQuantity ?? purchaseQty,
      ExchangeRateOperator: d.ExchangeRateOperator || '*',
      // Flags
      IsPostToManagementBook: false,
      IsUpdateRedundant: d.IsUpdateRedundant ?? false,
      // Object info
      AccountObjectID: d.AccountObjectID || ctx.accountObjectId || undefined,
      AccountObjectName: ctx.accountObjectName || undefined,
      AccountObjectAddress: ctx.accountObjectAddress || undefined,
      AccountObjectCode: ctx.accountObjectCode || undefined,
      AccountObjectNameDI: ctx.accountObjectName || undefined,
      // Order/sort
      SortOrder: d.SortOrder ?? i,
      RefOrder: ctx.refOrder,
      RefTypeName: ctx.refTypeName,
      IncludeInvoice: ctx.includeInvoice ?? 0,
      // Optional
      InvDate: d.InvDate ? new Date(d.InvDate) : undefined,
      InvNo: d.InvNo || undefined,
      InvSeries: d.InvSeries || undefined,
      StockID: d.StockID || undefined,
      OrderID: d.OrderID || undefined,
      JobID: d.JobID || undefined,
      ExpenseItemID: d.ExpenseItemID || undefined,
      OrganizationUnitID: d.OrganizationUnitID || undefined,
      EmployeeID: d.EmployeeID || undefined,
      ContractID: d.ContractID || undefined,
      ListItemID: d.ListItemID || undefined,
      ProjectWorkID: d.ProjectWorkID || undefined,
      ImportChargeAmount: d.ImportChargeAmount ?? 0,
      FreightAmount: d.FreightAmount ?? 0,
    }, instance, database, auth, username, password);
  }
}
