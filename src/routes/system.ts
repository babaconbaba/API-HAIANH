import { getPoolFromReq } from '../config/database';
import { Router, Request, Response } from 'express';
import { getPool, sql } from '../config/database';

const router = Router();

router.get('/health', async (req: Request, res: Response) => {
  try {
    const pool = await getPoolFromReq(req);
    const result = await pool.request().query('SELECT GETDATE() AS serverTime, DB_NAME() AS database_name');
    res.json({
      success: true,
      data: {
        status: 'ok',
        serverTime: result.recordset[0].serverTime,
        database: result.recordset[0].database_name,
        instance: req.sqlInstance,
      },
    });
  } catch (err: any) {
    res.status(503).json({ success: false, error: { code: 'DB_CONNECTION_ERROR', message: err.message } });
  }
});

router.get('/ref-types', async (req: Request, res: Response) => {
  try {
    const pool = await getPoolFromReq(req);
    const result = await pool.request().query(
      `SELECT RefType, RefTypeName, MasterTableName, DetailTableName, Postable
       FROM SYSRefType ORDER BY RefType`
    );
    res.json({ success: true, data: result.recordset });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'QUERY_ERROR', message: err.message } });
  }
});

router.get('/branches', async (req: Request, res: Response) => {
  try {
    const pool = await getPoolFromReq(req);
    const result = await pool.request().query(
      `SELECT OrganizationUnitID, OrganizationUnitCode, OrganizationUnitName,
              BranchID, ParentID, Grade, IsParent, OrganizationUnitTypeID, Inactive
       FROM OrganizationUnit ORDER BY SortMISACodeID`
    );
    res.json({ success: true, data: result.recordset });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'QUERY_ERROR', message: err.message } });
  }
});

router.get('/databases', async (req: Request, res: Response) => {
  try {
    const pool = await getPool(req.sqlInstance, 'master');
    const result = await pool.request().query(
      `SELECT name FROM sys.databases WHERE name NOT IN ('master','tempdb','model','msdb') ORDER BY name`
    );
    res.json({ success: true, data: result.recordset.map((r: any) => r.name) });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'QUERY_ERROR', message: err.message } });
  }
});

router.get('/tables', async (req: Request, res: Response) => {
  try {
    const pool = await getPoolFromReq(req);
    const result = await pool.request().query(
      `SELECT t.TABLE_NAME,
              (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS c WHERE c.TABLE_NAME = t.TABLE_NAME) AS ColumnCount
       FROM INFORMATION_SCHEMA.TABLES t
       WHERE t.TABLE_TYPE = 'BASE TABLE'
       ORDER BY t.TABLE_NAME`
    );
    res.json({ success: true, data: result.recordset, count: result.recordset.length });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'QUERY_ERROR', message: err.message } });
  }
});

// ─── Table info — xem columns + row count ───

router.get('/table-info/:table', async (req: Request, res: Response) => {
  try {
    const table = req.params.table as string;
    const pool = await getPoolFromReq(req);
    const request = pool.request();
    request.input('table', sql.NVarChar, table);

    // Columns
    const cols = await request.query(`
      SELECT c.name, t.name AS type, c.max_length, c.is_nullable, c.is_identity, c.is_computed
      FROM sys.columns c
      JOIN sys.objects o ON c.object_id = o.object_id
      JOIN sys.types t ON c.user_type_id = t.user_type_id
      WHERE o.name = @table
      ORDER BY c.column_id
    `);

    // Row count
    const countR = pool.request();
    countR.input('table', sql.NVarChar, table);
    let rowCount = 0;
    try {
      const cnt = await pool.request().query(`SELECT COUNT(*) AS c FROM [${table}]`);
      rowCount = cnt.recordset[0].c;
    } catch (e: any) { console.warn('[WARN]', e.message?.substring(0, 100)); }

    res.json({
      success: true,
      data: {
        table,
        rowCount,
        columns: cols.recordset.map((c: any) => ({
          name: c.name,
          type: c.type,
          maxLength: c.max_length,
          nullable: !!c.is_nullable,
          identity: !!c.is_identity,
          computed: !!c.is_computed,
        })),
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'QUERY_ERROR', message: err.message } });
  }
});

// ─── Tables with data — chỉ tables có rows ───

router.get('/tables-with-data', async (req: Request, res: Response) => {
  try {
    const pool = await getPoolFromReq(req);
    const result = await pool.request().query(`
      SELECT t.name, SUM(p.[rows]) AS [cnt]
      FROM sys.tables t
      INNER JOIN sys.partitions p ON t.object_id = p.object_id AND p.index_id IN (0,1)
      GROUP BY t.name
      HAVING SUM(p.[rows]) > 0
      ORDER BY SUM(p.[rows]) DESC
    `);
    res.json({ success: true, data: result.recordset.map((r: any) => ({ table: r.name, rows: r.cnt })), count: result.recordset.length });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'QUERY_ERROR', message: err.message } });
  }
});

// ─── Generic table query — cho web app tích hợp ───

const ALLOWED_TABLES = new Set([
  // Detail/sub-detail tables
  'CAReceiptDetail','CAPaymentDetail','CAPaymentDetailTax','CAPaymentDetailSalary',
  'BADepositDetail','BAWithDrawDetail','BAWithdrawDetailTax','BAWithDrawDetailSalary',
  'BAInternalTransferDetail','BADepositWithdrawList',
  'GLVoucherDetail','GLVoucherDetailTax','GLVoucherDetailExpenses','GLVoucherDetailExpensesAllocation',
  'GLVoucherDetailRevenue','GLVoucherDetailDebtPayment','GLVoucherDetailAdvancedPayment',
  'GLVoucherDetailForeignExchange','GLVoucherCrossEntryDetail',
  'SAVoucherDetail','SAOrderDetail','SAReturnDetail','SAInvoiceDetail','SAQuoteDetail','SADiscountDetail',
  'SAReturnInwardReferenceDetail','SaleOutwardReference','SaleOutwardReferenceDetail',
  'PUVoucherDetail','PUVoucherDetailCost','PUOrderDetail','PUReturnDetail','PUServiceDetail',
  'PUInvoiceDetail','PUDiscountDetail','PUContractDetailInventoryItem',
  'INInwardDetail','INOutwardDetail','INTransferDetail','INAssemblyDisassemblyDetail',
  'INInventoryBook','INInventoryBookDetail','INSerialNumber',
  'FixedAssetDetail','FixedAssetDetailAccessory','FixedAssetDetailAllocation',
  'FixedAssetDetailBoardDelivery','FixedAssetDetailSource',
  'FADepreciationDetail','FADepreciationDetailAllocation','FADepreciationDetailPost',
  'FADecrementDetail','FADecrementDetailPost','FAAdjustmentDetail','FAAdjustmentDetailPost',
  'FATransferDetail',
  'SUIncrementDetail','SUIncrementDetailAllocation','SUIncrementDetailDepartment','SUIncrementDetailSource',
  'SUAllocationDetail','SUAllocationDetailExpense','SUAllocationDetailPost','SUAllocationDetailTable',
  'SUDecrementDetail','SUTransferDetail','SUAdjustmentDetail',
  'PASalarySheetDetail','PASalaryExpenseDetail','PASalaryExpenseAllocationDetail',
  'PATimeSheetDetail','PATimeSheetSummaryDetail',
  'ContractDetail','ContractDetailInventoryItem','ContractDetailPayment','ContractDetailExpense',
  'ContractDetailRevenue','ContractDetailContact',
  'BudgetDetail',
  'CAAuditDetail','INAuditDetail','FAAuditDetail','SUAuditDetail',
  'JCPeriodDetail','JCAllocationExpenseDetail','JCAllocationExpenseDetailTable',
  'JCExpenseTranferDetail','JCAcceptedDetail','JCUncompleteDetail','JCOPNDetail',
  'LOANAgreementCalendar','LOANAgreementPayment','LOANAgreementInterestRate','LOANAgreementAsset',
  'DebtListDetail','PrepaidExpensesDetail','PrepaidExpensesDetailSource',
  'PreReceiptRevenueDetail','PreReceiptRevenueDetailSource',
  'OpeningAccountEntryDetail','OpeningAccountEntryDetailInvoice','OpeningInventoryEntry',
  'INProductionOrderDetail','INProductionOrderProduct',
  // Ledger/log tables
  'GeneralLedger','InventoryLedger','FixedAssetLedger','SaleLedger','PurchaseLedger',
  'SupplyLedger','TaxLedger','AccountObjectLedger',
  // Dictionary sub-tables
  'AccountObjectBankAccount','AccountObjectGroup','AccountObjectBelongToGroup',
  'InventoryItemDetailDiscount','InventoryItemDetailNorm','InventoryItemUnitConvert',
  'ProjectWorkNorm','ProjectWorkEstimate','ListItem',
  'Bank','BankAccount','CCY','CCYDetailExchangeRate','PaymentTerm','National',
  'DebtAgreement','DebtPeriod','DebtList',
  // Master tables (read-only via this endpoint)
  'CAReceipt','CAPayment','BADeposit','BAWithDraw','BAInternalTransfer',
  'GLVoucher','SAVoucher','SAOrder','SAReturn','SAInvoice','SAQuote','SADiscount',
  'PUVoucher','PUOrder','PUReturn','PUService','PUInvoice','PUDiscount','PUContract',
  'INInward','INOutward','INTransfer','INAssemblyDisassembly','INProductionOrder',
  'FixedAsset','FixedAssetCategory','FADepreciation','FADecrement','FAAdjustment','FATransfer',
  'SUIncrement','SUAllocation','SUDecrement','SUTransfer','SUAdjustment','SupplyCategory',
  'PASalarySheet','PASalaryExpense','PATimeSheet','PATimeSheetSummary','PayRoll',
  'Contract','Budget','LOANAgreement','LoanProfile',
  'PrepaidExpenses','PreReceiptRevenue','Job','ProjectWork','ExpenseItem','BudgetItem',
  'CAAudit','INAudit','FAAudit','SUAudit',
  'JCPeriod','JCOPN','JCCostVoucher','JCAllocationExpense','JCAllocationQuantum',
  'JCExpenseTranfer','JCAccepted','JCUncomplete',
  'Account','AccountObject','InventoryItem','InventoryItemCategory',
  'OrganizationUnit','Stock','Unit','Location',
  'SYSRefType','SYSAutoID',
]);

router.get('/query/:table', async (req: Request, res: Response) => {
  try {
    const table = req.params.table as string;
    if (!ALLOWED_TABLES.has(table)) {
      res.status(400).json({ success: false, error: { code: 'INVALID_TABLE', message: `Table '${table}' is not allowed. Use /api/system/tables to see available tables.` } });
      return;
    }

    const pool = await getPoolFromReq(req);
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = Math.min(500, Math.max(1, parseInt(req.query.pageSize as string) || 50));
    const offset = (page - 1) * pageSize;
    const refId = req.query.refId as string;
    const where = refId ? 'WHERE RefID = @refId' : '';

    const request = pool.request();
    request.input('offset', sql.Int, offset);
    request.input('pageSize', sql.Int, pageSize);
    if (refId) request.input('refId', sql.UniqueIdentifier, refId);

    const countResult = await request.query(`SELECT COUNT(*) AS total FROM [${table}] ${where}`);
    const total = countResult.recordset[0].total;

    const request2 = pool.request();
    request2.input('offset', sql.Int, offset);
    request2.input('pageSize', sql.Int, pageSize);
    if (refId) request2.input('refId', sql.UniqueIdentifier, refId);

    const result = await request2.query(
      `SELECT * FROM [${table}] ${where} ORDER BY 1 OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`
    );

    res.json({
      success: true,
      data: result.recordset,
      pagination: { page, pageSize, totalCount: total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'QUERY_ERROR', message: err.message } });
  }
});

export default router;
