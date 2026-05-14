import { getPoolFromReq } from '../config/database';
import { Router } from 'express';
import { asyncHandler, sql, getPool } from '../lib/voucherHelper';

const router = Router();

// ─── Trial Balance (Bảng cân đối phát sinh) ───

router.get('/trial-balance', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const dateFrom = req.query.dateFrom as string;
  const dateTo = req.query.dateTo as string;
  const grade = parseInt(req.query.grade as string) || 1;

  const request = pool.request();
  let dateWhere = '';
  if (dateFrom) { dateWhere += ' AND gl.PostedDate >= @dateFrom'; request.input('dateFrom', sql.DateTime, new Date(dateFrom)); }
  if (dateTo) { dateWhere += ' AND gl.PostedDate <= @dateTo'; request.input('dateTo', sql.DateTime, new Date(dateTo)); }
  request.input('grade', sql.Int, grade);

  // Join GL entries to parent accounts by prefix matching:
  // e.g. GL on "1111" aggregates up to account "111" (Grade 1)
  const result = await request.query(
    `SELECT a.AccountNumber, a.AccountName, a.Grade, a.AccountCategoryKind,
            ISNULL(SUM(gl.DebitAmount), 0) AS DebitAmount,
            ISNULL(SUM(gl.CreditAmount), 0) AS CreditAmount,
            ISNULL(SUM(gl.DebitAmountOC), 0) AS DebitAmountOC,
            ISNULL(SUM(gl.CreditAmountOC), 0) AS CreditAmountOC
     FROM Account a
     LEFT JOIN GeneralLedger gl
       ON gl.AccountNumber LIKE a.AccountNumber + '%' ${dateWhere}
     WHERE a.Grade = @grade AND a.Inactive = 0
     GROUP BY a.AccountNumber, a.AccountName, a.Grade, a.AccountCategoryKind
     HAVING ISNULL(SUM(gl.DebitAmount), 0) <> 0 OR ISNULL(SUM(gl.CreditAmount), 0) <> 0
     ORDER BY a.AccountNumber`
  );

  res.json({ success: true, data: result.recordset });
}));

// ─── Income Statement (Báo cáo kết quả kinh doanh) ───

router.get('/income-statement', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const dateFrom = req.query.dateFrom as string;
  const dateTo = req.query.dateTo as string;

  const request = pool.request();
  let dateWhere = '';
  if (dateFrom) { dateWhere += ' AND PostedDate >= @dateFrom'; request.input('dateFrom', sql.DateTime, new Date(dateFrom)); }
  if (dateTo) { dateWhere += ' AND PostedDate <= @dateTo'; request.input('dateTo', sql.DateTime, new Date(dateTo)); }

  const result = await request.query(
    `SELECT
       -- Revenue (511)
       ISNULL(SUM(CASE WHEN AccountNumber LIKE '511%' THEN CreditAmount ELSE 0 END), 0)
         - ISNULL(SUM(CASE WHEN AccountNumber LIKE '511%' THEN DebitAmount ELSE 0 END), 0) AS Revenue,
       -- Revenue deductions (521)
       ISNULL(SUM(CASE WHEN AccountNumber LIKE '521%' THEN DebitAmount ELSE 0 END), 0) AS RevenueDeductions,
       -- COGS (632)
       ISNULL(SUM(CASE WHEN AccountNumber LIKE '632%' THEN DebitAmount ELSE 0 END), 0) AS COGS,
       -- Selling expenses (641)
       ISNULL(SUM(CASE WHEN AccountNumber LIKE '641%' THEN DebitAmount ELSE 0 END), 0) AS SellingExpenses,
       -- Admin expenses (642)
       ISNULL(SUM(CASE WHEN AccountNumber LIKE '642%' THEN DebitAmount ELSE 0 END), 0) AS AdminExpenses,
       -- Financial income (515)
       ISNULL(SUM(CASE WHEN AccountNumber LIKE '515%' THEN CreditAmount ELSE 0 END), 0)
         - ISNULL(SUM(CASE WHEN AccountNumber LIKE '515%' THEN DebitAmount ELSE 0 END), 0) AS FinancialIncome,
       -- Financial expenses (635)
       ISNULL(SUM(CASE WHEN AccountNumber LIKE '635%' THEN DebitAmount ELSE 0 END), 0) AS FinancialExpenses,
       -- Other income (711)
       ISNULL(SUM(CASE WHEN AccountNumber LIKE '711%' THEN CreditAmount ELSE 0 END), 0) AS OtherIncome,
       -- Other expenses (811)
       ISNULL(SUM(CASE WHEN AccountNumber LIKE '811%' THEN DebitAmount ELSE 0 END), 0) AS OtherExpenses,
       -- CIT expense (821)
       ISNULL(SUM(CASE WHEN AccountNumber LIKE '821%' THEN DebitAmount ELSE 0 END), 0) AS CITExpense
     FROM GeneralLedger
     WHERE 1=1 ${dateWhere}`
  );

  const r = result.recordset[0];
  const netRevenue = r.Revenue - r.RevenueDeductions;
  const grossProfit = netRevenue - r.COGS;
  const operatingProfit = grossProfit + r.FinancialIncome - r.FinancialExpenses - r.SellingExpenses - r.AdminExpenses;
  const otherProfit = r.OtherIncome - r.OtherExpenses;
  const profitBeforeTax = operatingProfit + otherProfit;
  const profitAfterTax = profitBeforeTax - r.CITExpense;

  res.json({
    success: true,
    data: {
      Revenue: r.Revenue,
      RevenueDeductions: r.RevenueDeductions,
      NetRevenue: netRevenue,
      COGS: r.COGS,
      GrossProfit: grossProfit,
      FinancialIncome: r.FinancialIncome,
      FinancialExpenses: r.FinancialExpenses,
      SellingExpenses: r.SellingExpenses,
      AdminExpenses: r.AdminExpenses,
      OperatingProfit: operatingProfit,
      OtherIncome: r.OtherIncome,
      OtherExpenses: r.OtherExpenses,
      OtherProfit: otherProfit,
      ProfitBeforeTax: profitBeforeTax,
      CITExpense: r.CITExpense,
      ProfitAfterTax: profitAfterTax,
    },
  });
}));

// ─── Balance Sheet (Bảng cân đối kế toán) ───

router.get('/balance-sheet', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const asOfDate = req.query.asOfDate as string || new Date().toISOString().split('T')[0];

  const request = pool.request();
  request.input('asOfDate', sql.DateTime, new Date(asOfDate));

  const result = await request.query(
    `SELECT AccountNumber,
            SUM(ISNULL(DebitAmount, 0)) AS TotalDebit,
            SUM(ISNULL(CreditAmount, 0)) AS TotalCredit,
            SUM(ISNULL(DebitAmount, 0)) - SUM(ISNULL(CreditAmount, 0)) AS Balance
     FROM GeneralLedger
     WHERE PostedDate <= @asOfDate
     GROUP BY AccountNumber
     ORDER BY AccountNumber`
  );

  // Group into asset/liability/equity categories
  const assets: any[] = [];
  const liabilities: any[] = [];
  const equity: any[] = [];

  for (const row of result.recordset) {
    const acc = row.AccountNumber;
    if (acc.startsWith('1') || acc.startsWith('2')) {
      // Asset accounts: normal balance = Debit, Balance = Dr - Cr
      assets.push(row);
    } else if (acc.startsWith('3')) {
      // Liability accounts: normal balance = Credit, flip sign so positive = normal
      liabilities.push({ ...row, Balance: -row.Balance });
    } else if (acc.startsWith('4')) {
      // Equity accounts: normal balance = Credit, flip sign
      equity.push({ ...row, Balance: -row.Balance });
    }
  }

  const totalAssets = assets.reduce((s, r) => s + r.Balance, 0);
  const totalLiabilities = liabilities.reduce((s, r) => s + r.Balance, 0);
  const totalEquity = equity.reduce((s, r) => s + r.Balance, 0);

  res.json({
    success: true,
    data: {
      asOfDate,
      TotalAssets: totalAssets,
      TotalLiabilities: totalLiabilities,
      TotalEquity: totalEquity,
      Assets: assets,
      Liabilities: liabilities,
      Equity: equity,
    },
  });
}));

// ─── Cash Flow Summary (Lưu chuyển tiền tệ) ───

router.get('/cash-flow', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const dateFrom = req.query.dateFrom as string;
  const dateTo = req.query.dateTo as string;

  const request = pool.request();
  let dateWhere = '';
  if (dateFrom) { dateWhere += ' AND PostedDate >= @dateFrom'; request.input('dateFrom', sql.DateTime, new Date(dateFrom)); }
  if (dateTo) { dateWhere += ' AND PostedDate <= @dateTo'; request.input('dateTo', sql.DateTime, new Date(dateTo)); }

  const result = await request.query(
    `SELECT
       -- Cash receipts (111, 112)
       ISNULL(SUM(CASE WHEN AccountNumber LIKE '111%' OR AccountNumber LIKE '112%' THEN DebitAmount ELSE 0 END), 0) AS CashIn,
       ISNULL(SUM(CASE WHEN AccountNumber LIKE '111%' OR AccountNumber LIKE '112%' THEN CreditAmount ELSE 0 END), 0) AS CashOut,
       -- By account
       ISNULL(SUM(CASE WHEN AccountNumber LIKE '111%' THEN DebitAmount ELSE 0 END), 0) AS CashOnHandIn,
       ISNULL(SUM(CASE WHEN AccountNumber LIKE '111%' THEN CreditAmount ELSE 0 END), 0) AS CashOnHandOut,
       ISNULL(SUM(CASE WHEN AccountNumber LIKE '112%' THEN DebitAmount ELSE 0 END), 0) AS BankIn,
       ISNULL(SUM(CASE WHEN AccountNumber LIKE '112%' THEN CreditAmount ELSE 0 END), 0) AS BankOut
     FROM GeneralLedger
     WHERE (AccountNumber LIKE '111%' OR AccountNumber LIKE '112%') ${dateWhere}`
  );

  const r = result.recordset[0];
  res.json({
    success: true,
    data: {
      CashIn: r.CashIn,
      CashOut: r.CashOut,
      NetCashFlow: r.CashIn - r.CashOut,
      CashOnHand: { In: r.CashOnHandIn, Out: r.CashOnHandOut, Net: r.CashOnHandIn - r.CashOnHandOut },
      Bank: { In: r.BankIn, Out: r.BankOut, Net: r.BankIn - r.BankOut },
    },
  });
}));

// ─── Receivables Aging (Công nợ phải thu - TK 131) ───

router.get('/receivables', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const asOfDate = req.query.asOfDate as string || new Date().toISOString().split('T')[0];

  const result = await pool.request()
    .input('asOfDate', sql.DateTime, new Date(asOfDate))
    .query(
      `SELECT AccountObjectName,
              SUM(ISNULL(DebitAmount,0)) AS TotalDebit,
              SUM(ISNULL(CreditAmount,0)) AS TotalCredit,
              SUM(ISNULL(DebitAmount,0)) - SUM(ISNULL(CreditAmount,0)) AS Balance
       FROM GeneralLedger
       WHERE AccountNumber LIKE '131%' AND PostedDate <= @asOfDate
       GROUP BY AccountObjectName
       HAVING SUM(ISNULL(DebitAmount,0)) - SUM(ISNULL(CreditAmount,0)) <> 0
       ORDER BY Balance DESC`
    );

  res.json({ success: true, data: result.recordset });
}));

// ─── Payables Aging (Công nợ phải trả - TK 331) ───

router.get('/payables', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const asOfDate = req.query.asOfDate as string || new Date().toISOString().split('T')[0];

  const result = await pool.request()
    .input('asOfDate', sql.DateTime, new Date(asOfDate))
    .query(
      `SELECT AccountObjectName,
              SUM(ISNULL(DebitAmount,0)) AS TotalDebit,
              SUM(ISNULL(CreditAmount,0)) AS TotalCredit,
              SUM(ISNULL(CreditAmount,0)) - SUM(ISNULL(DebitAmount,0)) AS Balance
       FROM GeneralLedger
       WHERE AccountNumber LIKE '331%' AND PostedDate <= @asOfDate
       GROUP BY AccountObjectName
       HAVING SUM(ISNULL(CreditAmount,0)) - SUM(ISNULL(DebitAmount,0)) <> 0
       ORDER BY Balance DESC`
    );

  res.json({ success: true, data: result.recordset });
}));

// ─── Inventory Balance (Tồn kho - TK 152, 153, 155, 156) ───

router.get('/inventory-balance', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const asOfDate = req.query.asOfDate as string || new Date().toISOString().split('T')[0];

  const result = await pool.request()
    .input('asOfDate', sql.DateTime, new Date(asOfDate))
    .query(
      `SELECT AccountNumber,
              SUM(ISNULL(DebitAmount,0)) AS TotalIn,
              SUM(ISNULL(CreditAmount,0)) AS TotalOut,
              SUM(ISNULL(DebitAmount,0)) - SUM(ISNULL(CreditAmount,0)) AS Balance
       FROM GeneralLedger
       WHERE (AccountNumber LIKE '152%' OR AccountNumber LIKE '153%'
              OR AccountNumber LIKE '155%' OR AccountNumber LIKE '156%')
         AND PostedDate <= @asOfDate
       GROUP BY AccountNumber
       ORDER BY AccountNumber`
    );

  res.json({ success: true, data: result.recordset });
}));

// ─── Revenue by Period (Doanh thu theo kỳ) ───

router.get('/revenue-by-period', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const year = parseInt(req.query.year as string) || new Date().getFullYear();
  const groupBy = (req.query.groupBy as string) || 'month'; // month or quarter

  const request = pool.request();
  request.input('year', sql.Int, year);

  let periodExpr: string;
  let periodAlias: string;
  if (groupBy === 'quarter') {
    periodExpr = 'DATEPART(QUARTER, PostedDate)';
    periodAlias = 'Quarter';
  } else {
    periodExpr = 'MONTH(PostedDate)';
    periodAlias = 'Month';
  }

  const result = await request.query(
    `SELECT ${periodExpr} AS [${periodAlias}],
            SUM(CASE WHEN AccountNumber LIKE '511%' THEN CreditAmount - DebitAmount ELSE 0 END) AS Revenue,
            SUM(CASE WHEN AccountNumber LIKE '632%' THEN DebitAmount ELSE 0 END) AS COGS,
            SUM(CASE WHEN AccountNumber LIKE '511%' THEN CreditAmount - DebitAmount ELSE 0 END)
              - SUM(CASE WHEN AccountNumber LIKE '632%' THEN DebitAmount ELSE 0 END) AS GrossProfit
     FROM GeneralLedger
     WHERE YEAR(PostedDate) = @year
       AND (AccountNumber LIKE '511%' OR AccountNumber LIKE '632%')
     GROUP BY ${periodExpr}
     ORDER BY ${periodExpr}`
  );

  res.json({ success: true, data: result.recordset, year });
}));

// ─── Account Ledger Detail (Sổ chi tiết tài khoản) ───

router.get('/account-ledger', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const account = req.query.account as string;
  const dateFrom = req.query.dateFrom as string;
  const dateTo = req.query.dateTo as string;

  if (!account) {
    res.status(422).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'account parameter is required' } });
    return;
  }

  const request = pool.request();
  request.input('account', sql.NVarChar, account);
  let dateWhere = '';
  if (dateFrom) { dateWhere += ' AND PostedDate >= @dateFrom'; request.input('dateFrom', sql.DateTime, new Date(dateFrom)); }
  if (dateTo) { dateWhere += ' AND PostedDate <= @dateTo'; request.input('dateTo', sql.DateTime, new Date(dateTo)); }

  const result = await request.query(
    `SELECT RefID, RefNo, RefDate, PostedDate, AccountNumber,
            CorrespondingAccountNumber, DebitAmount, CreditAmount,
            DebitAmountOC, CreditAmountOC,
            Description, AccountObjectName, BranchID
     FROM GeneralLedger
     WHERE AccountNumber = @account ${dateWhere}
     ORDER BY PostedDate, RefNo`
  );

  // Calculate running balance
  let runningBalance = 0;
  const data = result.recordset.map((row: any) => {
    runningBalance += (row.DebitAmount || 0) - (row.CreditAmount || 0);
    return { ...row, RunningBalance: runningBalance };
  });

  res.json({ success: true, data, count: data.length });
}));

// ─── Dashboard Summary ───

router.get('/dashboard', asyncHandler(async (req, res) => {
  const pool = await getPoolFromReq(req);
  const year = parseInt(req.query.year as string) || new Date().getFullYear();

  const request = pool.request();
  request.input('year', sql.Int, year);

  const result = await request.query(
    `SELECT
       -- Revenue YTD
       ISNULL(SUM(CASE WHEN AccountNumber LIKE '511%' AND YEAR(PostedDate) = @year
         THEN CreditAmount - DebitAmount ELSE 0 END), 0) AS RevenueYTD,
       -- COGS YTD
       ISNULL(SUM(CASE WHEN AccountNumber LIKE '632%' AND YEAR(PostedDate) = @year
         THEN DebitAmount ELSE 0 END), 0) AS COGSYTD,
       -- Cash balance
       ISNULL(SUM(CASE WHEN AccountNumber LIKE '111%' THEN DebitAmount - CreditAmount ELSE 0 END), 0) AS CashOnHand,
       -- Bank balance
       ISNULL(SUM(CASE WHEN AccountNumber LIKE '112%' THEN DebitAmount - CreditAmount ELSE 0 END), 0) AS BankBalance,
       -- Total receivables
       ISNULL(SUM(CASE WHEN AccountNumber LIKE '131%' THEN DebitAmount - CreditAmount ELSE 0 END), 0) AS TotalReceivables,
       -- Total payables
       ISNULL(SUM(CASE WHEN AccountNumber LIKE '331%' THEN CreditAmount - DebitAmount ELSE 0 END), 0) AS TotalPayables
     FROM GeneralLedger`
  );

  const r = result.recordset[0];
  res.json({
    success: true,
    data: {
      year,
      RevenueYTD: r.RevenueYTD,
      COGSYTD: r.COGSYTD,
      GrossProfitYTD: r.RevenueYTD - r.COGSYTD,
      CashOnHand: r.CashOnHand,
      BankBalance: r.BankBalance,
      TotalCash: r.CashOnHand + r.BankBalance,
      TotalReceivables: r.TotalReceivables,
      TotalPayables: r.TotalPayables,
    },
  });
}));

export default router;
