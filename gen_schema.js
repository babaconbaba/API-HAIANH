const sql = require('mssql/msnodesqlv8');
const fs = require('fs');

async function gen() {
  const pool = await sql.connect({
    server: '192.168.99.200\\MISASME2026',
    database: 'HAG2026',
    user: 'sa', password: '123456789A@',
    options: { encrypt: false, trustServerCertificate: true }
  });

  // Get ALL user tables with row counts
  const tables = await pool.request().query(`
    SELECT t.name AS TableName,
           p.rows AS [RowCount]
    FROM sys.tables t
    JOIN sys.partitions p ON t.object_id = p.object_id AND p.index_id IN (0,1)
    WHERE t.is_ms_shipped = 0
    ORDER BY t.name
  `);

  // Get ALL columns for ALL tables
  const columns = await pool.request().query(`
    SELECT t.name AS TableName,
           c.column_id AS ColID,
           c.name AS ColName,
           ty.name AS DataType,
           c.max_length AS MaxLength,
           c.precision AS Precision,
           c.scale AS Scale,
           c.is_nullable AS IsNullable,
           c.is_identity AS IsIdentity,
           c.is_computed AS IsComputed
    FROM sys.tables t
    JOIN sys.columns c ON t.object_id = c.object_id
    JOIN sys.types ty ON c.user_type_id = ty.user_type_id
    WHERE t.is_ms_shipped = 0
    ORDER BY t.name, c.column_id
  `);

  // Get primary keys
  const pks = await pool.request().query(`
    SELECT t.name AS TableName, c.name AS ColName
    FROM sys.tables t
    JOIN sys.indexes i ON t.object_id = i.object_id AND i.is_primary_key = 1
    JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
    JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
    WHERE t.is_ms_shipped = 0
  `);

  // Get foreign keys
  const fks = await pool.request().query(`
    SELECT
      tp.name AS TableName,
      cp.name AS ColName,
      tr.name AS RefTable,
      cr.name AS RefCol
    FROM sys.foreign_keys fk
    JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
    JOIN sys.tables tp ON fkc.parent_object_id = tp.object_id
    JOIN sys.columns cp ON fkc.parent_object_id = cp.object_id AND fkc.parent_column_id = cp.column_id
    JOIN sys.tables tr ON fkc.referenced_object_id = tr.object_id
    JOIN sys.columns cr ON fkc.referenced_object_id = cr.object_id AND fkc.referenced_column_id = cr.column_id
  `);

  // Build lookup maps
  const pkMap = {};
  for (const r of pks.recordset) {
    (pkMap[r.TableName] = pkMap[r.TableName] || new Set()).add(r.ColName);
  }
  const fkMap = {};
  for (const r of fks.recordset) {
    const key = r.TableName + '.' + r.ColName;
    fkMap[key] = r.RefTable + '.' + r.RefCol;
  }
  const colsByTable = {};
  for (const c of columns.recordset) {
    (colsByTable[c.TableName] = colsByTable[c.TableName] || []).push(c);
  }
  const rowCountMap = {};
  for (const t of tables.recordset) rowCountMap[t.TableName] = t.RowCount;

  // Group tables by module prefix
  function moduleOf(name) {
    const n = name;
    // Voucher modules (master + detail + sub-detail)
    if (/^CA/.test(n)) return '01 — CA Tiền mặt';
    if (/^BA/.test(n)) return '02 — BA Ngân hàng';
    if (/^IN/.test(n)) return '03 — IN Kho';
    if (/^SA/.test(n)) return '04 — SA Bán hàng';
    if (/^PU/.test(n)) return '05 — PU Mua hàng';
    if (/^GL/.test(n)) return '06 — GL Sổ cái / Tổng hợp';
    if (/^FA/.test(n)) return '07 — FA Tài sản cố định';
    if (/^SU/.test(n)) return '08 — SU Công cụ dụng cụ';
    if (/^PA/.test(n)) return '09 — PA Tiền lương';
    if (/^JC/.test(n)) return '10 — JC Giá thành';
    // Ledger tables (read tables MISA desktop displays)
    if (/Ledger$/.test(n) || /Ledger/.test(n)) return '11 — Ledger Sổ (read tables)';
    // Dictionary / master data
    if (/^AccountObject/.test(n)) return '12 — Danh mục: Đối tượng (KH/NCC/NV)';
    if (/^InventoryItem/.test(n)) return '13 — Danh mục: Hàng hóa vật tư';
    if (/^(Account$|Account[A-Z]|AccountGroup|AccountSystem|AccountDefault)/.test(n)) return '14 — Danh mục: Hệ thống tài khoản';
    if (/^(Bank|BankAccount|CCY|Currency|National|PaymentTerm)/.test(n)) return '15 — Danh mục: Ngân hàng / Tiền tệ';
    if (/^(Stock|Unit|Location|OrganizationUnit|Employee|Department)/.test(n)) return '16 — Danh mục: Kho / ĐVT / Nhân sự';
    if (/^(Job|ProjectWork|ExpenseItem|BudgetItem|Contract|ListItem|CustomField)/.test(n)) return '17 — Danh mục: Công trình / Khoản mục / Khác';
    if (/^(Budget|LOAN|Loan|Debt|PrepaidExpenses|PreReceiptRevenue)/.test(n)) return '18 — Ngân sách / Vay / Công nợ';
    // Tax
    if (/^(TA|Tax)/.test(n)) return '19 — TA Thuế';
    // System / config
    if (/^SYS/.test(n)) return '20 — SYS Hệ thống / cấu hình';
    if (/^(MSC|MISA|Import|Template|Report|RP)/.test(n)) return '21 — MSC Misc / Import / Report';
    // E-Invoice / Hóa đơn điện tử
    if (/^(EInvoice|Einvoice|EI[A-Z]|IP[A-Z]|Invoice|EmailInvoice)/.test(n)) return '22 — Hóa đơn điện tử';
    // Electronic Banking / Ngân hàng điện tử
    if (/^EB/.test(n)) return '23 — Ngân hàng điện tử';
    // Financial Reports / Báo cáo tài chính
    if (/^FR/.test(n)) return '24 — Báo cáo tài chính';
    // Mobile sync
    if (/^Mobile/.test(n)) return '25 — Mobile sync';
    // Fixed Asset master data (FixedAsset* — not FA* vouchers)
    if (/^FixedAsset/.test(n)) return '07 — FA Tài sản cố định';
    // Opening balance / Số dư đầu kỳ
    if (/^(Opening|ImportOpening|InvoiceToOpening|VoucherToOpening)/.test(n)) return '26 — Số dư đầu kỳ';
    // Sync / Mapping / Tracking / Email / Notification — system support
    if (/^(Mapping|Tracking|Email|Notification|SS[A-Z]|DB[A-Z]|Data[A-Z]|Config|Business|Declaration|BU[A-Z])/.test(n)) return '27 — Đồng bộ / Hệ thống phụ trợ';
    // Explicit re-categorization of remaining tables
    const exact = {
      // Voucher metadata
      'VoucherType':'06 — GL Sổ cái / Tổng hợp','VoucherTypeCategory':'06 — GL Sổ cái / Tổng hợp',
      'VoucherTypeCategoryRefType':'06 — GL Sổ cái / Tổng hợp','VoucherReference':'06 — GL Sổ cái / Tổng hợp',
      'HistoryVoucher':'06 — GL Sổ cái / Tổng hợp','SysNewPostedVoucher':'06 — GL Sổ cái / Tổng hợp',
      'SaleOutwardReference':'04 — SA Bán hàng','SaleOutwardReferenceDetail':'04 — SA Bán hàng',
      // Invoice
      'MeInvoiceSyncData':'22 — Hóa đơn điện tử','MinutesInvoice':'22 — Hóa đơn điện tử',
      'PublishingInvoiceConfig':'22 — Hóa đơn điện tử','DeadlockInvoice':'22 — Hóa đơn điện tử',
      'ResourceInfoTempEInvoice':'22 — Hóa đơn điện tử','InvTemplate':'22 — Hóa đơn điện tử','InvType':'22 — Hóa đơn điện tử',
      // Tax
      'ResourcesTaxTable':'19 — TA Thuế','ResourcesTaxTableDetail':'19 — TA Thuế',
      'PersonalIncomeTaxRate':'19 — TA Thuế','AMISTaxAllOrg':'19 — TA Thuế',
      'AMISTaxConfig':'19 — TA Thuế','AMISTaxOrg':'19 — TA Thuế',
      // System
      'sysdiagrams':'20 — SYS Hệ thống / cấu hình','sysVoucherTemplateUserDetail':'20 — SYS Hệ thống / cấu hình',
      'SysReportStyle':'20 — SYS Hệ thống / cấu hình','LicenseConfig':'20 — SYS Hệ thống / cấu hình',
      'LockObject':'20 — SYS Hệ thống / cấu hình','UpdateStatus123Log':'20 — SYS Hệ thống / cấu hình',
      // Dictionary
      'PurchasePurpose':'17 — Danh mục: Công trình / Khoản mục / Khác','InvestmentProject':'17 — Danh mục: Công trình / Khoản mục / Khác',
      'SupplyCategory':'08 — SU Công cụ dụng cụ','SpecificInventoryType':'13 — Danh mục: Hàng hóa vật tư',
      'PaymentMethodType':'15 — Danh mục: Ngân hàng / Tiền tệ',
      // Reports
      'ComparisonReport':'24 — Báo cáo tài chính','CustomizeReport':'24 — Báo cáo tài chính',
      'FavoriteReportList':'24 — Báo cáo tài chính',
      // Cash flow forecast
      'MonetaryFlowForeCast':'06 — GL Sổ cái / Tổng hợp','MonetaryFlowForeCastDetail':'06 — GL Sổ cái / Tổng hợp',
    };
    if (exact[n]) return exact[n];
    return '99 — Khác (chưa phân loại)';
  }

  const tablesByModule = {};
  for (const t of tables.recordset) {
    const m = moduleOf(t.TableName);
    (tablesByModule[m] = tablesByModule[m] || []).push(t.TableName);
  }

  // Type formatter
  function fmtType(c) {
    let t = c.DataType;
    if (['nvarchar','varchar','char','nchar'].includes(t)) {
      let len = c.MaxLength;
      if (['nvarchar','nchar'].includes(t) && len > 0) len = len / 2;
      t += '(' + (len === -1 ? 'MAX' : len) + ')';
    } else if (['decimal','numeric'].includes(t)) {
      t += '(' + c.Precision + ',' + c.Scale + ')';
    }
    return t;
  }

  // Generate MD
  let md = '# MISA SME 2026 — Database Schema Đầy Đủ\n\n';
  md += `> Database: HAG2026 | Tổng ${tables.recordset.length} tables\n`;
  md += `> Generated: ${new Date().toISOString().substring(0,10)}\n\n`;
  md += '**Ký hiệu:** PK = Primary Key | FK = Foreign Key | NN = NOT NULL | ID = Identity (auto) | COMP = Computed\n\n';
  md += '---\n\n';

  // Table of contents
  md += '## Mục lục\n\n';
  for (const m of Object.keys(tablesByModule).sort()) {
    md += `- ${m} (${tablesByModule[m].length} tables)\n`;
  }
  md += '\n---\n\n';

  // Each module
  for (const m of Object.keys(tablesByModule).sort()) {
    md += `# ${m}\n\n`;
    for (const tname of tablesByModule[m].sort()) {
      const cols = colsByTable[tname] || [];
      const pkSet = pkMap[tname] || new Set();
      md += `## ${tname}\n\n`;
      md += `Rows: ${(rowCountMap[tname]||0).toLocaleString()} | Columns: ${cols.length}\n\n`;
      md += '| # | Column | Type | Flags | FK → |\n';
      md += '|---|--------|------|-------|------|\n';
      for (const c of cols) {
        const flags = [];
        if (pkSet.has(c.ColName)) flags.push('PK');
        if (!c.IsNullable) flags.push('NN');
        if (c.IsIdentity) flags.push('ID');
        if (c.IsComputed) flags.push('COMP');
        const fk = fkMap[tname + '.' + c.ColName] || '';
        md += `| ${c.ColID} | ${c.ColName} | ${fmtType(c)} | ${flags.join(' ')} | ${fk} |\n`;
      }
      md += '\n';
    }
  }

  fs.writeFileSync('E:\\MISA\\misa-sme-api\\DATABASE_SCHEMA.md', md, 'utf8');
  console.log('Written DATABASE_SCHEMA.md');
  console.log('Tables: ' + tables.recordset.length);
  console.log('Total columns: ' + columns.recordset.length);
  console.log('File size: ' + (md.length/1024).toFixed(0) + ' KB');

  // Module breakdown
  for (const m of Object.keys(tablesByModule).sort()) {
    console.log('  ' + m + ': ' + tablesByModule[m].length + ' tables');
  }

  await pool.close();
}
gen().catch(e => console.error('FATAL:', e.message));
