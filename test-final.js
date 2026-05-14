#!/usr/bin/env node
/**
 * FINAL COMPREHENSIVE TEST — Every API, every field, create/read/update/delete
 * Run against REAL database dsadasdsa2026
 */
const BASE = 'http://localhost:3003';
const DB = process.argv[2] || 'dsadasdsa2026';
const H = { 'Authorization': 'ApiKey misa-api-key-2026', 'Content-Type': 'application/json; charset=utf-8', 'X-SQL-Database': DB };

let pass = 0, fail = 0;
const fails = [];

async function api(m, p, b) {
  const r = await fetch(`${BASE}${p}`, { method: m, headers: H, body: b ? JSON.stringify(b) : undefined });
  return { s: r.status, d: await r.json() };
}
function eq(a, b, msg) { if (a !== b) throw new Error(`${msg}: got ${JSON.stringify(a)} want ${JSON.stringify(b)}`); }
function ok(v, msg) { if (!v) throw new Error(msg); }
async function t(name, fn) {
  try { await fn(); pass++; process.stdout.write(`  \x1b[32m✓\x1b[0m ${name}\n`); }
  catch (e) { fail++; fails.push(`${name}: ${e.message}`); process.stdout.write(`  \x1b[31m✗\x1b[0m ${name} — ${e.message}\n`); }
}

async function run() {
  console.log(`\n\x1b[1m  FINAL TEST — DB: ${DB}\x1b[0m\n`);

  // ════════════════════════════════════════
  // 1. DICTIONARY — AccountObject CRUD
  // ════════════════════════════════════════
  console.log('\x1b[36m── AccountObject CRUD ──\x1b[0m');
  let aoId;
  await t('Create AccountObject', async () => {
    const r = await api('POST', '/api/dictionary/account-objects', {
      AccountObjectCode: `TEST${Date.now()}`, AccountObjectName: 'Công ty Test CRUD', AccountObjectType: 0, Address: '123 Trần Phú, Hà Nội', CompanyTaxCode: '0199999999',
    });
    eq(r.s, 201, 'status'); ok(r.d.data?.AccountObjectID, 'no ID'); aoId = r.d.data.AccountObjectID;
  });
  await t('Read AccountObject — all fields', async () => {
    const r = await api('GET', `/api/dictionary/account-objects/${aoId}`);
    eq(r.s, 200, 'status');
    eq(r.d.data.AccountObjectName, 'Công ty Test CRUD', 'Name');
    eq(r.d.data.Address, '123 Trần Phú, Hà Nội', 'Address');
    eq(r.d.data.CompanyTaxCode, '0199999999', 'TaxCode');
    eq(r.d.data.AccountObjectType, 0, 'Type');
  });
  await t('Update AccountObject', async () => {
    const r = await api('PUT', `/api/dictionary/account-objects/${aoId}`, { AccountObjectName: 'Công ty Đã Sửa Tên', Address: '456 Lê Duẩn, Đà Nẵng' });
    eq(r.s, 200, 'status');
  });
  await t('Verify Update', async () => {
    const r = await api('GET', `/api/dictionary/account-objects/${aoId}`);
    eq(r.d.data.AccountObjectName, 'Công ty Đã Sửa Tên', 'Name after update');
    eq(r.d.data.Address, '456 Lê Duẩn, Đà Nẵng', 'Address after update');
    eq(r.d.data.CompanyTaxCode, '0199999999', 'TaxCode unchanged');
  });
  await t('Delete AccountObject', async () => { eq((await api('DELETE', `/api/dictionary/account-objects/${aoId}`)).s, 200, 'status'); });
  await t('Verify Delete — 404', async () => { eq((await api('GET', `/api/dictionary/account-objects/${aoId}`)).s, 404, 'status'); });

  // ════════════════════════════════════════
  // 2. DICTIONARY — InventoryItem CRUD
  // ════════════════════════════════════════
  console.log('\n\x1b[36m── InventoryItem CRUD ──\x1b[0m');
  let iiId;
  await t('Create InventoryItem', async () => {
    const r = await api('POST', '/api/dictionary/inventory-items', { InventoryItemCode: `TST${Date.now()}`, InventoryItemName: 'Vật tư test CRUD', InventoryItemType: 0, UnitName: 'Cái' });
    eq(r.s, 201, 'status'); iiId = r.d.data?.InventoryItemID; ok(iiId, 'no ID');
  });
  await t('Read InventoryItem', async () => {
    const r = await api('GET', `/api/dictionary/inventory-items/${iiId}`);
    eq(r.d.data.InventoryItemName, 'Vật tư test CRUD', 'Name');
    ok(r.d.data.InventoryItemCode, 'Code exists');
  });
  await t('Update InventoryItem', async () => {
    eq((await api('PUT', `/api/dictionary/inventory-items/${iiId}`, { InventoryItemName: 'Vật tư đã sửa tên' })).s, 200, 'status');
  });
  await t('Verify Update', async () => {
    eq((await api('GET', `/api/dictionary/inventory-items/${iiId}`)).d.data.InventoryItemName, 'Vật tư đã sửa tên', 'Name');
  });
  await t('Delete InventoryItem', async () => { eq((await api('DELETE', `/api/dictionary/inventory-items/${iiId}`)).s, 200, 'status'); });
  await t('Verify Delete — 404', async () => { eq((await api('GET', `/api/dictionary/inventory-items/${iiId}`)).s, 404, 'status'); });

  // ════════════════════════════════════════
  // 3. Setup test data for voucher tests
  // ════════════════════════════════════════
  console.log('\n\x1b[36m── Setup test data ──\x1b[0m');
  const kh = (await api('POST', '/api/dictionary/account-objects', { AccountObjectCode: `KHT${Date.now()}`, AccountObjectName: 'Khách hàng test', AccountObjectType: 0 })).d.data?.AccountObjectID;
  const ncc = (await api('POST', '/api/dictionary/account-objects', { AccountObjectCode: `NCCT${Date.now()}`, AccountObjectName: 'Nhà cung cấp test', AccountObjectType: 1 })).d.data?.AccountObjectID;
  const item = (await api('POST', '/api/dictionary/inventory-items', { InventoryItemCode: `HHT${Date.now()}`, InventoryItemName: 'Hàng hóa test', InventoryItemType: 0 })).d.data?.InventoryItemID;
  console.log(`  KH: ${kh ? '✓' : '✗'} | NCC: ${ncc ? '✓' : '✗'} | Item: ${item ? '✓' : '✗'}`);
  if (!kh || !ncc || !item) { console.error('FATAL: Cannot create test data'); process.exit(1); }

  // ════════════════════════════════════════
  // 4. ALL VOUCHER TYPES — Create/Read/Delete
  // ════════════════════════════════════════
  const voucherTests = [
    {
      name: 'Phiếu thu (CAReceipt)', ep: 'journal/cash/receipts', postGL: true,
      body: { JournalMemo: 'Test phiếu thu tiền mặt', AccountObjectID: kh, AccountObjectName: 'Khách hàng test', TotalAmount: 10000000,
        details: [{ DebitAccount: '1111', CreditAccount: '131', Amount: 10000000, AmountOC: 10000000, Description: 'Thu tiền hàng test', AccountObjectID: kh }] },
      checkMaster: m => { eq(m.RefType, 1010, 'RefType'); eq(m.TotalAmount, 10000000, 'Total'); eq(m.IsPostedFinance, true, 'Posted'); ok(m.RefNoFinance, 'RefNoFinance'); eq(m.CurrencyID, 'VND', 'Currency'); ok(m.BranchID, 'BranchID'); eq(m.AccountObjectName, 'Khách hàng test', 'AO Name UTF-8'); },
      checkDetail: d => { eq(d[0].DebitAccount, '1111', 'Debit'); eq(d[0].CreditAccount, '131', 'Credit'); eq(d[0].Amount, 10000000, 'Amount'); eq(d[0].Description, 'Thu tiền hàng test', 'Description UTF-8'); },
      checkGL: async (id) => { const e = await queryGL('1111', id); eq(e.length, 1, 'GL 1111 count'); eq(e[0].DebitAmount, 10000000, 'GL debit'); },
    },
    {
      name: 'Phiếu chi (CAPayment)', ep: 'journal/cash/payments', postGL: true,
      body: { JournalMemo: 'Test phiếu chi văn phòng phẩm', TotalAmount: 2000000,
        details: [{ DebitAccount: '6422', CreditAccount: '1111', Amount: 2000000, AmountOC: 2000000, Description: 'Chi văn phòng phẩm test' }] },
      checkMaster: m => { eq(m.RefType, 1020, 'RefType'); eq(m.TotalAmount, 2000000, 'Total'); },
      checkDetail: d => { eq(d[0].DebitAccount, '6422', 'Debit'); eq(d[0].CreditAccount, '1111', 'Credit'); },
      checkGL: async (id) => { const e = await queryGL('6422', id); eq(e.length, 1, 'GL count'); eq(e[0].DebitAmount, 2000000, 'GL debit'); },
    },
    {
      name: 'Thu tiền gửi (BADeposit)', ep: 'journal/bank/deposits', postGL: true,
      body: { JournalMemo: 'Test nộp tiền ngân hàng', TotalAmount: 20000000,
        details: [{ DebitAccount: '1121', CreditAccount: '1111', Amount: 20000000, AmountOC: 20000000, Description: 'Nộp tiền mặt vào Vietcombank' }] },
      checkMaster: m => { eq(m.RefType, 1500, 'RefType'); eq(m.TotalAmount, 20000000, 'Total'); },
      checkGL: async (id) => { const e = await queryGL('1121', id); eq(e[0].DebitAmount, 20000000, 'GL debit'); },
    },
    {
      name: 'Ủy nhiệm chi (BAWithDraw)', ep: 'journal/bank/withdrawals', postGL: true,
      body: { JournalMemo: 'Test ủy nhiệm chi trả NCC', AccountObjectID: ncc, AccountObjectName: 'Nhà cung cấp test', TotalAmount: 15000000,
        details: [{ DebitAccount: '331', CreditAccount: '1121', Amount: 15000000, AmountOC: 15000000, Description: 'UNC trả tiền NCC test', AccountObjectID: ncc }] },
      checkMaster: m => { eq(m.RefType, 1510, 'RefType'); eq(m.AccountObjectName, 'Nhà cung cấp test', 'AO UTF-8'); },
      checkGL: async (id) => { const e = await queryGL('331', id); eq(e[0].DebitAmount, 15000000, 'GL debit'); },
    },
    {
      name: 'Báo giá (SAQuote)', ep: 'sales/quotes', postGL: false,
      body: { JournalMemo: 'Test báo giá thép tấm', AccountObjectID: kh, AccountObjectName: 'Khách hàng test', TotalAmount: 50000000,
        details: [{ Amount: 50000000, Quantity: 10, UnitPrice: 5000000, InventoryItemID: item, Description: 'Thép tấm test - 10 tấn' }] },
      checkMaster: m => { eq(m.RefType, 3510, 'RefType'); ok(m.RefNo || m.RefNoFinance, 'RefNo exists'); eq(m.TotalAmount, 50000000, 'Total'); },
      checkDetail: d => { eq(d[0].Quantity, 10, 'Qty'); eq(d[0].UnitPrice, 5000000, 'Price'); },
    },
    {
      name: 'Đơn đặt hàng (SAOrder)', ep: 'sales/orders', postGL: false,
      body: { JournalMemo: 'Test đơn đặt hàng', AccountObjectID: kh, AccountObjectName: 'Khách hàng test', TotalAmount: 30000000,
        details: [{ Amount: 30000000, Quantity: 5, UnitPrice: 6000000, InventoryItemID: item, Description: 'Hàng hóa test - 5 cái' }] },
      checkMaster: m => { eq(m.RefType, 3520, 'RefType'); ok(m.RefNo || m.RefNoFinance, 'RefNo'); eq(m.AccountObjectName, 'Khách hàng test', 'AO'); },
      checkDetail: d => { eq(d[0].Quantity, 5, 'Qty'); eq(d[0].Amount, 30000000, 'Amount'); },
    },
    {
      name: 'Bán hàng (SAVoucher)', ep: 'sales/vouchers', postGL: true,
      body: { JournalMemo: 'Test bán hàng có VAT', AccountObjectID: kh, AccountObjectName: 'Khách hàng test',
        TotalAmount: 33000000, TotalSaleAmount: 30000000, TotalVATAmount: 3000000,
        details: [
          { DebitAccount: '131', CreditAccount: '5111', Amount: 30000000, AmountOC: 30000000, Quantity: 5, UnitPrice: 6000000, InventoryItemID: item, AccountObjectID: kh, Description: 'Hàng hóa test - 5 cái' },
          { DebitAccount: '131', CreditAccount: '33311', Amount: 3000000, AmountOC: 3000000, InventoryItemID: item, AccountObjectID: kh, Description: 'Thuế GTGT 10%' },
        ] },
      checkMaster: m => { eq(m.RefType, 3530, 'RefType'); eq(m.TotalSaleAmount, 30000000, 'SaleAmount'); eq(m.TotalVATAmount, 3000000, 'VATAmount'); ok(m.RefNoFinance, 'RefNo'); },
      checkDetail: d => { eq(d.length, 2, 'detail count'); eq(d[0].Quantity, 5, 'Qty'); },
      checkGL: async (id) => {
        const dr = await queryGL('131', id); eq(dr.reduce((s,e) => s+e.DebitAmount, 0), 33000000, 'GL 131 debit total');
        const cr5 = await queryGL('5111', id); eq(cr5[0].CreditAmount, 30000000, 'GL 5111 credit');
        const crV = await queryGL('33311', id); eq(crV[0].CreditAmount, 3000000, 'GL 33311 credit');
      },
    },
    {
      name: 'Hóa đơn (SAInvoice)', ep: 'sales/invoices', postGL: false,
      body: { JournalMemo: 'Test hóa đơn bán hàng', AccountObjectID: kh, AccountObjectName: 'Khách hàng test', TotalAmount: 33000000,
        details: [{ Amount: 30000000, InventoryItemID: item, Description: 'Hàng hóa test' }, { Amount: 3000000, InventoryItemID: item, Description: 'VAT 10%' }] },
      checkMaster: m => { eq(m.RefType, 3560, 'RefType'); ok(m.RefNo || m.RefNoFinance || m.InvNo, 'Has number'); },
    },
    {
      name: 'Giảm giá BH (SADiscount)', ep: 'sales/discounts', postGL: true,
      body: { JournalMemo: 'Test giảm giá bán hàng', AccountObjectID: kh, AccountObjectName: 'Khách hàng test', TotalAmount: 2000000, TotalDiscountAmount: 2000000,
        details: [{ DebitAccount: '5111', CreditAccount: '131', Amount: 2000000, AmountOC: 2000000, InventoryItemID: item, AccountObjectID: kh, Description: 'Giảm giá 5% test' }] },
      checkMaster: m => { eq(m.RefType, 3550, 'RefType'); },
      checkGL: async (id) => { const e = await queryGL('5111', id); eq(e[0].DebitAmount, 2000000, 'GL 5111 debit'); },
    },
    {
      name: 'Trả lại hàng bán (SAReturn)', ep: 'sales/returns', postGL: true,
      body: { JournalMemo: 'Test trả lại hàng bán', AccountObjectID: kh, AccountObjectName: 'Khách hàng test', TotalAmount: 6000000, TotalSaleAmount: 6000000,
        details: [{ DebitAccount: '5111', CreditAccount: '131', Amount: 6000000, AmountOC: 6000000, Quantity: 1, UnitPrice: 6000000, InventoryItemID: item, AccountObjectID: kh, Description: 'Trả 1 cái hàng lỗi' }] },
      checkMaster: m => { eq(m.RefType, 3540, 'RefType'); },
    },
    {
      name: 'Đơn mua hàng (PUOrder)', ep: 'purchase/orders', postGL: false,
      body: { JournalMemo: 'Test đơn mua hàng', AccountObjectID: ncc, AccountObjectName: 'Nhà cung cấp test', TotalAmount: 40000000,
        details: [{ Amount: 40000000, Quantity: 8, UnitPrice: 5000000, InventoryItemID: item, Description: 'Hàng hóa test - 8 cái' }] },
      checkMaster: m => { eq(m.RefType, 301, 'RefType'); ok(m.RefNo || m.RefNoFinance, 'RefNo'); },
    },
    {
      name: 'Mua hàng (PUVoucher)', ep: 'purchase/vouchers', postGL: true,
      body: { JournalMemo: 'Test mua hàng nhập kho', AccountObjectID: ncc, AccountObjectName: 'Nhà cung cấp test', TotalAmount: 40000000,
        details: [{ DebitAccount: '152', CreditAccount: '331', Amount: 40000000, AmountOC: 40000000, Quantity: 8, UnitPrice: 5000000, InventoryItemID: item, AccountObjectID: ncc, Description: 'Hàng hóa test nhập kho - 8 cái' }] },
      checkMaster: m => { eq(m.RefType, 302, 'RefType'); eq(m.TotalAmount, 40000000, 'Total'); ok(m.RefNoFinance, 'RefNo'); },
      checkGL: async (id) => { eq((await queryGL('152', id))[0].DebitAmount, 40000000, 'GL 152'); eq((await queryGL('331', id))[0].CreditAmount, 40000000, 'GL 331'); },
    },
    {
      name: 'Trả lại hàng mua (PUReturn)', ep: 'purchase/returns', postGL: true,
      body: { JournalMemo: 'Test trả lại hàng mua lỗi', AccountObjectID: ncc, AccountObjectName: 'Nhà cung cấp test', TotalAmount: 5000000,
        details: [{ DebitAccount: '331', CreditAccount: '152', Amount: 5000000, AmountOC: 5000000, Quantity: 1, UnitPrice: 5000000, InventoryItemID: item, AccountObjectID: ncc, Description: 'Trả 1 cái hàng lỗi' }] },
      checkMaster: m => { eq(m.RefType, 3030, 'RefType'); },
    },
    {
      name: 'Mua dịch vụ (PUService)', ep: 'purchase/services', postGL: true,
      body: { JournalMemo: 'Test mua dịch vụ vận chuyển', AccountObjectID: ncc, AccountObjectName: 'Nhà cung cấp test', TotalAmount: 3000000,
        details: [{ DebitAccount: '6421', CreditAccount: '331', Amount: 3000000, AmountOC: 3000000, InventoryItemID: item, AccountObjectID: ncc, Description: 'Dịch vụ vận chuyển test' }] },
      checkMaster: m => { eq(m.RefType, 330, 'RefType'); },
    },
    {
      name: 'CT nghiệp vụ khác (GLVoucher)', ep: 'journal/gl-vouchers', postGL: true,
      body: { JournalMemo: 'Test phân bổ chi phí trả trước', TotalAmount: 4000000,
        details: [{ DebitAccount: '6422', CreditAccount: '242', Amount: 4000000, AmountOC: 4000000, Description: 'Phân bổ tiền thuê VP tháng test' }] },
      checkMaster: m => { eq(m.RefType, 4011, 'RefType'); ok(m.RefNoFinance, 'RefNo'); },
      checkGL: async (id) => { eq((await queryGL('6422', id))[0].DebitAmount, 4000000, 'GL 6422'); eq((await queryGL('242', id))[0].CreditAmount, 4000000, 'GL 242'); },
    },
  ];

  async function queryGL(account, refId) {
    const r = await api('GET', `/api/reports/account-ledger?account=${account}`);
    return (r.d.data || []).filter(e => e.RefID === refId);
  }

  for (const vt of voucherTests) {
    console.log(`\n\x1b[36m── ${vt.name} ──\x1b[0m`);
    let refId;

    // CREATE
    await t(`Create ${vt.name}`, async () => {
      const r = await api('POST', `/api/${vt.ep}`, vt.body);
      eq(r.s, 201, `status ${r.s}: ${r.d.error?.message?.substring(0,100)}`);
      refId = r.d.data?.RefID; ok(refId, 'no RefID');
    });
    if (!refId) continue;

    // READ + VERIFY FIELDS
    await t(`Read + verify fields`, async () => {
      const r = await api('GET', `/api/${vt.ep}/${refId}`);
      eq(r.s, 200, 'status');
      const m = r.d.data;
      ok(m.RefID, 'RefID'); ok(m.RefDate || m.InvDate, 'RefDate/InvDate'); ok(m.CreatedDate, 'CreatedDate');
      eq(m.CurrencyID, 'VND', 'Currency'); ok(m.BranchID, 'BranchID');
      if (vt.checkMaster) vt.checkMaster(m);
      if (vt.checkDetail && m.details) vt.checkDetail(m.details);
    });

    // VERIFY GL
    if (vt.postGL && vt.checkGL) {
      await t(`Verify GL entries`, async () => { await vt.checkGL(refId); });
    }

    // DELETE
    await t(`Delete`, async () => {
      eq((await api('DELETE', `/api/${vt.ep}/${refId}`)).s, 200, 'delete status');
    });

    // VERIFY DELETE
    await t(`Verify deleted — 404`, async () => {
      eq((await api('GET', `/api/${vt.ep}/${refId}`)).s, 404, 'should be 404');
    });

    // VERIFY GL CLEANED
    if (vt.postGL && vt.checkGL) {
      await t(`Verify GL cleaned after delete`, async () => {
        // Check no GL entries remain for this refId in any account
        for (const acc of ['1111','1121','131','152','156','242','331','33311','5111','6421','6422','632','141']) {
          const entries = (await api('GET', `/api/reports/account-ledger?account=${acc}`)).d.data || [];
          const remaining = entries.filter(e => e.RefID === refId);
          eq(remaining.length, 0, `GL ${acc} should be empty`);
        }
      });
    }
  }

  // ════════════════════════════════════════
  // 5. VALIDATION TESTS
  // ════════════════════════════════════════
  console.log('\n\x1b[36m── Validation tests ──\x1b[0m');

  await t('Reject mismatched TotalAmount', async () => {
    const r = await api('POST', '/api/sales/vouchers', {
      JournalMemo: 'x', TotalAmount: 999, AccountObjectID: kh, AccountObjectName: 'x',
      details: [{ DebitAccount:'131', CreditAccount:'5111', Amount:500, InventoryItemID:item }],
    });
    eq(r.s, 422, 'should reject');
    ok(r.d.error?.message?.includes('does not match'), 'message');
  });

  await t('Reject no auth', async () => {
    const r = await fetch(`${BASE}/api/dictionary/accounts`, { headers: {} });
    eq(r.status, 401, 'status');
  });

  await t('Reject wrong auth', async () => {
    const r = await fetch(`${BASE}/api/dictionary/accounts`, { headers: { Authorization: 'ApiKey wrong' } });
    eq(r.status, 401, 'status');
  });

  await t('Reject invalid GUID', async () => {
    eq((await api('GET', '/api/sales/vouchers/not-a-guid')).s, 400, 'status');
  });

  await t('404 for non-existent', async () => {
    eq((await api('GET', '/api/sales/vouchers/00000000-0000-0000-0000-000000000000')).s, 404, 'status');
  });

  await t('Reject SQL auth without username', async () => {
    const r = await fetch(`${BASE}/api/dictionary/accounts`, { headers: { ...H, 'X-SQL-Auth': 'sql' } });
    eq(r.status, 400, 'status');
  });

  // ════════════════════════════════════════
  // 6. REPORTS
  // ════════════════════════════════════════
  console.log('\n\x1b[36m── Reports ──\x1b[0m');

  await t('Trial balance — balanced', async () => {
    const r = await api('GET', '/api/reports/trial-balance?grade=1');
    let dr = 0, cr = 0;
    (r.d.data || []).forEach(x => { dr += x.DebitAmount; cr += x.CreditAmount; });
    ok(Math.abs(dr - cr) < 1, `Dr ${dr} != Cr ${cr}`);
  });

  await t('Income statement', async () => {
    const r = await api('GET', '/api/reports/income-statement');
    eq(r.s, 200, 'status'); ok(r.d.data, 'has data');
  });

  await t('Balance sheet', async () => {
    const r = await api('GET', '/api/reports/balance-sheet');
    eq(r.s, 200, 'status'); ok(r.d.data, 'has data');
  });

  await t('Dashboard', async () => {
    const r = await api('GET', '/api/reports/dashboard');
    eq(r.s, 200, 'status'); ok(r.d.data, 'has data');
  });

  // ════════════════════════════════════════
  // CLEANUP
  // ════════════════════════════════════════
  console.log('\n\x1b[36m── Cleanup ──\x1b[0m');
  await api('DELETE', `/api/dictionary/account-objects/${kh}`);
  await api('DELETE', `/api/dictionary/account-objects/${ncc}`);
  await api('DELETE', `/api/dictionary/inventory-items/${item}`);
  console.log('  Cleaned up test data');

  // ════════════════════════════════════════
  // SUMMARY
  // ════════════════════════════════════════
  console.log(`\n\x1b[1m══════════════════════════════\x1b[0m`);
  console.log(`\x1b[1m  ${pass} passed, ${fail} failed\x1b[0m`);
  console.log(`\x1b[1m══════════════════════════════\x1b[0m`);
  if (fails.length) { console.log('\n\x1b[31mFAILURES:\x1b[0m'); fails.forEach((f,i) => console.log(`  ${i+1}. ${f}`)); }
  process.exit(fail > 0 ? 1 : 0);
}

run().catch(e => { console.error(e); process.exit(1); });
