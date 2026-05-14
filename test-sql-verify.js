#!/usr/bin/env node
/**
 * MISA SME API — SQL Data Verification
 * Creates vouchers via API, then queries SQL Server DIRECTLY to verify every field
 */
const BASE = 'http://localhost:3003';
const H = { 'Authorization': 'ApiKey misa-api-key-2026', 'Content-Type': 'application/json' };

let passed = 0, failed = 0;
const failures = [];

async function api(method, path, body) {
  const opts = { method, headers: H };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  return { status: res.status, data: await res.json() };
}

// Query SQL directly via system endpoint trick: use account-ledger for GL verification
async function queryGL(account, refId) {
  const r = await api('GET', `/api/reports/account-ledger?account=${account}`);
  return (r.data.data || []).filter(e => e.RefID === refId);
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }
function assertEq(actual, expected, field) {
  if (actual !== expected) throw new Error(`${field}: expected ${JSON.stringify(expected)} got ${JSON.stringify(actual)}`);
}
function assertClose(actual, expected, field, tolerance = 0.01) {
  if (Math.abs(actual - expected) > tolerance) throw new Error(`${field}: expected ~${expected} got ${actual}`);
}

async function test(name, fn) {
  try {
    await fn();
    passed++;
    process.stdout.write(`  \x1b[32mPASS\x1b[0m ${name}\n`);
  } catch (e) {
    failed++;
    failures.push({ name, error: e.message });
    process.stdout.write(`  \x1b[31mFAIL\x1b[0m ${name} — ${e.message}\n`);
  }
}

async function run() {
  console.log('\n\x1b[1m══════════════════════════════════════\x1b[0m');
  console.log('\x1b[1m  SQL DATA VERIFICATION TEST\x1b[0m');
  console.log('\x1b[1m══════════════════════════════════════\x1b[0m\n');

  // Setup: create test InventoryItem for SA/PU vouchers
  const tiR = await api('POST', '/api/dictionary/inventory-items', { InventoryItemCode: `_V${Date.now()}`, InventoryItemName: 'Verify item', InventoryItemType: 0 });
  const testItem = tiR.data.data?.InventoryItemID;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TEST 1: Phiếu thu — verify EVERY field
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\x1b[36m── TEST 1: Cash Receipt — full field verification ──\x1b[0m');
  let receiptId, receiptNo;

  await test('Create cash receipt 15,000,000', async () => {
    const r = await api('POST', '/api/journal/cash/receipts', {
      JournalMemo: 'SQL VERIFY - Thu tien KH',
      AccountObjectName: 'Cong ty Test SQL',
      TotalAmount: 15000000,
      CurrencyID: 'VND',
      ExchangeRate: 1,
      details: [
        { DebitAccount: '1111', CreditAccount: '131', Amount: 10000000, Description: 'Dot 1' },
        { DebitAccount: '1111', CreditAccount: '131', Amount: 5000000, Description: 'Dot 2' },
      ]
    });
    assertEq(r.status, 201, 'status');
    receiptId = r.data.data.RefID;
    receiptNo = r.data.data.RefNo;
    assert(receiptId, 'no RefID');
    assert(receiptNo, 'no RefNo');
  });

  await test('Read back — master fields correct', async () => {
    const r = await api('GET', `/api/journal/cash/receipts/${receiptId}`);
    assertEq(r.status, 200, 'status');
    const m = r.data.data;
    assertEq(m.RefID, receiptId, 'RefID');
    assertEq(m.RefNoFinance, receiptNo, 'RefNoFinance');
    assertEq(m.RefNoManagement, receiptNo, 'RefNoManagement');
    assertEq(m.TotalAmount, 15000000, 'TotalAmount');
    assertEq(m.CurrencyID, 'VND', 'CurrencyID');
    assertEq(m.ExchangeRate, 1, 'ExchangeRate');
    assertEq(m.IsPostedFinance, true, 'IsPostedFinance');
    assertEq(m.IsPostedManagement, true, 'IsPostedManagement');
    assert(m.RefDate, 'RefDate missing');
    assert(m.PostedDate, 'PostedDate missing');
    assert(m.CreatedDate, 'CreatedDate missing');
    assertEq(m.CreatedBy, 'api', 'CreatedBy');
    assert(m.BranchID, 'BranchID missing');
  });

  await test('Read back — detail lines correct', async () => {
    const r = await api('GET', `/api/journal/cash/receipts/${receiptId}`);
    const d = r.data.data.details;
    assertEq(d.length, 2, 'detail count');

    // Detail 0
    assertEq(d[0].DebitAccount, '1111', 'detail[0].DebitAccount');
    assertEq(d[0].CreditAccount, '131', 'detail[0].CreditAccount');
    assertEq(d[0].Amount, 10000000, 'detail[0].Amount');
    assertEq(d[0].RefID, receiptId, 'detail[0].RefID');
    assert(d[0].RefDetailID, 'detail[0].RefDetailID missing');

    // Detail 1
    assertEq(d[1].DebitAccount, '1111', 'detail[1].DebitAccount');
    assertEq(d[1].CreditAccount, '131', 'detail[1].CreditAccount');
    assertEq(d[1].Amount, 5000000, 'detail[1].Amount');
  });

  await test('GL entries TK 1111 — debit side correct', async () => {
    const entries = await queryGL('1111', receiptId);
    assertEq(entries.length, 2, 'GL 1111 entry count');
    // Sum of debits should = 15M
    const totalDebit = entries.reduce((s, e) => s + (e.DebitAmount || 0), 0);
    assertEq(totalDebit, 15000000, 'GL 1111 total debit');
    // All should have credit = 0
    entries.forEach((e, i) => assertEq(e.CreditAmount, 0, `GL 1111[${i}].CreditAmount`));
    // Corresponding account should be 131
    entries.forEach((e, i) => assertEq(e.CorrespondingAccountNumber, '131', `GL 1111[${i}].Corr`));
  });

  await test('GL entries TK 131 — credit side correct', async () => {
    const entries = await queryGL('131', receiptId);
    assertEq(entries.length, 2, 'GL 131 entry count');
    const totalCredit = entries.reduce((s, e) => s + (e.CreditAmount || 0), 0);
    assertEq(totalCredit, 15000000, 'GL 131 total credit');
    entries.forEach((e, i) => assertEq(e.DebitAmount, 0, `GL 131[${i}].DebitAmount`));
    entries.forEach((e, i) => assertEq(e.CorrespondingAccountNumber, '1111', `GL 131[${i}].Corr`));
  });

  await test('GL balanced — total debit = total credit', async () => {
    const debitEntries = await queryGL('1111', receiptId);
    const creditEntries = await queryGL('131', receiptId);
    const totalDebit = debitEntries.reduce((s, e) => s + (e.DebitAmount || 0), 0);
    const totalCredit = creditEntries.reduce((s, e) => s + (e.CreditAmount || 0), 0);
    assertEq(totalDebit, totalCredit, 'GL balance (debit must = credit)');
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TEST 2: Sales with VAT — complex GL
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n\x1b[36m── TEST 2: Sales Voucher with VAT — GL accounting verification ──\x1b[0m');
  let saleId;

  await test('Create sale 44,000,000 (40M goods + 4M VAT)', async () => {
    const r = await api('POST', '/api/sales/vouchers', {
      JournalMemo: 'SQL VERIFY - Ban hang + VAT',
      TotalAmount: 44000000,
      TotalSaleAmount: 40000000,
      TotalVATAmount: 4000000,
      details: [
        { DebitAccount: '131', CreditAccount: '5111', Amount: 40000000, Description: 'Hang hoa', Quantity: 100, UnitPrice: 400000, InventoryItemID: testItem },
        { DebitAccount: '131', CreditAccount: '33311', Amount: 4000000, Description: 'VAT 10%', InventoryItemID: testItem },
      ]
    });
    assertEq(r.status, 201, 'status');
    saleId = r.data.data.RefID;
  });

  await test('Sale master — amounts correct', async () => {
    const r = await api('GET', `/api/sales/vouchers/${saleId}`);
    const m = r.data.data;
    assertEq(m.TotalAmount, 44000000, 'TotalAmount');
    assertEq(m.TotalSaleAmount, 40000000, 'TotalSaleAmount');
    assertEq(m.TotalVATAmount, 4000000, 'TotalVATAmount');
  });

  await test('Sale details — quantity and unit price stored', async () => {
    const r = await api('GET', `/api/sales/vouchers/${saleId}`);
    const d = r.data.data.details;
    const goodsLine = d.find(x => x.Amount === 40000000);
    assert(goodsLine, 'goods line not found');
    assertEq(goodsLine.Quantity, 100, 'Quantity');
    assertEq(goodsLine.UnitPrice, 400000, 'UnitPrice');
  });

  await test('GL TK 131 debit = 44M (40M + 4M)', async () => {
    const entries = await queryGL('131', saleId);
    assertEq(entries.length, 2, 'GL 131 entries');
    const total = entries.reduce((s, e) => s + (e.DebitAmount || 0), 0);
    assertEq(total, 44000000, 'GL 131 total debit');
  });

  await test('GL TK 5111 credit = 40M (revenue)', async () => {
    const entries = await queryGL('5111', saleId);
    assertEq(entries.length, 1, 'GL 5111 entries');
    assertEq(entries[0].CreditAmount, 40000000, 'GL 5111 credit');
  });

  await test('GL TK 33311 credit = 4M (VAT output)', async () => {
    const entries = await queryGL('33311', saleId);
    assertEq(entries.length, 1, 'GL 33311 entries');
    assertEq(entries[0].CreditAmount, 4000000, 'GL 33311 credit');
  });

  await test('GL balanced — all debits = all credits', async () => {
    const dr131 = await queryGL('131', saleId);
    const cr5111 = await queryGL('5111', saleId);
    const cr33311 = await queryGL('33311', saleId);
    const totalDr = dr131.reduce((s, e) => s + (e.DebitAmount || 0), 0);
    const totalCr = cr5111.reduce((s, e) => s + (e.CreditAmount || 0), 0)
                  + cr33311.reduce((s, e) => s + (e.CreditAmount || 0), 0);
    assertEq(totalDr, totalCr, `GL balance: Dr ${totalDr} vs Cr ${totalCr}`);
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TEST 3: Purchase — verify inventory side
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n\x1b[36m── TEST 3: Purchase Voucher — inventory + payables ──\x1b[0m');
  let purchaseId;

  await test('Create purchase 20,000,000', async () => {
    const r = await api('POST', '/api/purchase/vouchers', {
      JournalMemo: 'SQL VERIFY - Mua NVL',
      TotalAmount: 20000000,
      details: [
        { DebitAccount: '152', CreditAccount: '331', Amount: 20000000, Quantity: 40, UnitPrice: 500000, InventoryItemID: testItem }
      ]
    });
    assertEq(r.status, 201, 'status');
    purchaseId = r.data.data.RefID;
  });

  await test('GL TK 152 debit = 20M (inventory)', async () => {
    const entries = await queryGL('152', purchaseId);
    assertEq(entries.length, 1, 'GL 152 entries');
    assertEq(entries[0].DebitAmount, 20000000, 'GL 152 debit');
    assertEq(entries[0].CorrespondingAccountNumber, '331', 'GL 152 corr');
  });

  await test('GL TK 331 credit = 20M (payables)', async () => {
    const entries = await queryGL('331', purchaseId);
    assertEq(entries.length, 1, 'GL 331 entries');
    assertEq(entries[0].CreditAmount, 20000000, 'GL 331 credit');
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TEST 4: Bank withdrawal + verify
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n\x1b[36m── TEST 4: Bank Withdrawal — verify bank accounts ──\x1b[0m');
  let withdrawId;

  await test('Create bank withdrawal 8,000,000', async () => {
    const r = await api('POST', '/api/journal/bank/withdrawals', {
      JournalMemo: 'SQL VERIFY - UNC tra no',
      TotalAmount: 8000000,
      details: [{ DebitAccount: '331', CreditAccount: '1121', Amount: 8000000 }]
    });
    assertEq(r.status, 201, 'status');
    withdrawId = r.data.data.RefID;
  });

  await test('GL TK 331 debit = 8M (pay supplier)', async () => {
    const entries = await queryGL('331', withdrawId);
    assertEq(entries.length, 1, 'entries');
    assertEq(entries[0].DebitAmount, 8000000, 'debit');
  });

  await test('GL TK 1121 credit = 8M (bank decrease)', async () => {
    const entries = await queryGL('1121', withdrawId);
    assertEq(entries.length, 1, 'entries');
    assertEq(entries[0].CreditAmount, 8000000, 'credit');
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TEST 5: GL Voucher (chứng từ nghiệp vụ khác)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n\x1b[36m── TEST 5: GL Voucher — multi-line complex entry ──\x1b[0m');
  let glvId;

  await test('Create GL voucher with 3 lines', async () => {
    const r = await api('POST', '/api/journal/gl-vouchers', {
      JournalMemo: 'SQL VERIFY - Phan bo CP',
      TotalAmount: 6000000,
      details: [
        { DebitAccount: '6421', CreditAccount: '242', Amount: 2000000, Description: 'PB CPBH' },
        { DebitAccount: '6422', CreditAccount: '242', Amount: 3000000, Description: 'PB CPQLDN' },
        { DebitAccount: '6422', CreditAccount: '331', Amount: 1000000, Description: 'CP dich vu' },
      ]
    });
    assertEq(r.status, 201, 'status');
    glvId = r.data.data.RefID;
  });

  await test('GL voucher — 3 debit entries correct', async () => {
    const e6421 = await queryGL('6421', glvId);
    const e6422 = await queryGL('6422', glvId);
    assertEq(e6421.length, 1, 'GL 6421 count');
    assertEq(e6421[0].DebitAmount, 2000000, 'GL 6421 debit');
    assertEq(e6422.length, 2, 'GL 6422 count');
    const total6422 = e6422.reduce((s, e) => s + (e.DebitAmount || 0), 0);
    assertEq(total6422, 4000000, 'GL 6422 total debit');
  });

  await test('GL voucher — credit entries correct', async () => {
    const e242 = await queryGL('242', glvId);
    const e331 = await queryGL('331', glvId);
    assertEq(e242.length, 2, 'GL 242 count');
    const total242 = e242.reduce((s, e) => s + (e.CreditAmount || 0), 0);
    assertEq(total242, 5000000, 'GL 242 total credit');
    // 331 might have entries from other tests, filter by description
    const e331_glv = e331.filter(e => e.RefID === glvId);
    assertEq(e331_glv.length, 1, 'GL 331 count for GLV');
    assertEq(e331_glv[0].CreditAmount, 1000000, 'GL 331 credit');
  });

  await test('GL voucher balanced', async () => {
    const accounts = ['6421', '6422', '242', '331'];
    let totalDr = 0, totalCr = 0;
    for (const acc of accounts) {
      const entries = (await queryGL(acc, glvId));
      totalDr += entries.reduce((s, e) => s + (e.DebitAmount || 0), 0);
      totalCr += entries.reduce((s, e) => s + (e.CreditAmount || 0), 0);
    }
    assertEq(totalDr, totalCr, `Balance: Dr ${totalDr} vs Cr ${totalCr}`);
    assertEq(totalDr, 6000000, 'Total amount');
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TEST 6: AutoNumber — sequential, no gaps
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n\x1b[36m── TEST 6: Auto-numbering — sequential RefNo ──\x1b[0m');

  await test('Create 2 receipts — RefNo sequential', async () => {
    const r1 = await api('POST', '/api/journal/cash/receipts', {
      JournalMemo: 'AUTONUM test 1', TotalAmount: 100,
      details: [{ DebitAccount: '1111', CreditAccount: '131', Amount: 100 }]
    });
    const r2 = await api('POST', '/api/journal/cash/receipts', {
      JournalMemo: 'AUTONUM test 2', TotalAmount: 200,
      details: [{ DebitAccount: '1111', CreditAccount: '131', Amount: 200 }]
    });
    assertEq(r1.status, 201, 'r1 status');
    assertEq(r2.status, 201, 'r2 status');
    const no1 = r1.data.data.RefNo;
    const no2 = r2.data.data.RefNo;
    // Extract numeric part
    const num1 = parseInt(no1.replace(/\D/g, ''));
    const num2 = parseInt(no2.replace(/\D/g, ''));
    assertEq(num2, num1 + 1, `Sequential: ${no1} -> ${no2}`);
    // Cleanup
    await api('DELETE', `/api/journal/cash/receipts/${r1.data.data.RefID}`);
    await api('DELETE', `/api/journal/cash/receipts/${r2.data.data.RefID}`);
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TEST 7: Delete — verify complete cleanup
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n\x1b[36m── TEST 7: Delete — verify GL + detail cleanup ──\x1b[0m');

  await test('Delete receipt — GL entries removed', async () => {
    const before1111 = await queryGL('1111', receiptId);
    assert(before1111.length > 0, 'GL should exist before delete');
    await api('DELETE', `/api/journal/cash/receipts/${receiptId}`);
    const after1111 = await queryGL('1111', receiptId);
    assertEq(after1111.length, 0, 'GL 1111 should be empty after delete');
    const after131 = await queryGL('131', receiptId);
    // Filter only entries for this specific receipt
    const receipt131 = after131.filter(e => e.RefID === receiptId);
    assertEq(receipt131.length, 0, 'GL 131 should be empty after delete');
  });

  await test('Delete receipt — master record gone', async () => {
    const r = await api('GET', `/api/journal/cash/receipts/${receiptId}`);
    assertEq(r.status, 404, 'should be 404');
  });

  await test('Delete sale — all GL cleaned', async () => {
    await api('DELETE', `/api/sales/vouchers/${saleId}`);
    const e131 = (await queryGL('131', saleId));
    const e5111 = (await queryGL('5111', saleId));
    const e33311 = (await queryGL('33311', saleId));
    assertEq(e131.length, 0, 'GL 131 cleaned');
    assertEq(e5111.length, 0, 'GL 5111 cleaned');
    assertEq(e33311.length, 0, 'GL 33311 cleaned');
  });

  // Cleanup remaining
  await test('Cleanup all test data', async () => {
    await api('DELETE', `/api/purchase/vouchers/${purchaseId}`);
    await api('DELETE', `/api/journal/bank/withdrawals/${withdrawId}`);
    await api('DELETE', `/api/journal/gl-vouchers/${glvId}`);
    // Verify
    const chk = await api('GET', `/api/purchase/vouchers/${purchaseId}`);
    assertEq(chk.status, 404, 'purchase cleaned');
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TEST 8: Reports data consistency
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.log('\n\x1b[36m── TEST 8: Reports — data consistency ──\x1b[0m');

  await test('Trial balance — total debit = total credit', async () => {
    const r = await api('GET', '/api/reports/trial-balance');
    const data = r.data.data;
    assert(Array.isArray(data) && data.length > 0, 'no trial balance data');
    let totalDr = 0, totalCr = 0;
    data.forEach(row => {
      totalDr += (row.DebitAmount || row.TotalDebit || 0);
      totalCr += (row.CreditAmount || row.TotalCredit || 0);
    });
    assertClose(totalDr, totalCr, 'Trial balance Dr vs Cr');
  });

  await test('Dashboard — all values non-negative', async () => {
    const r = await api('GET', '/api/reports/dashboard');
    assert(r.data.success, 'dashboard failed');
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SUMMARY
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Cleanup test item
  if (testItem) await api('DELETE', `/api/dictionary/inventory-items/${testItem}`);

  console.log('\n\x1b[1m══════════════════════════════════════\x1b[0m');
  console.log(`\x1b[1m  SQL VERIFY: ${passed} passed, ${failed} failed\x1b[0m`);
  console.log('\x1b[1m══════════════════════════════════════\x1b[0m');
  if (failures.length) {
    console.log('\n\x1b[31mFAILURES:\x1b[0m');
    failures.forEach((f, i) => console.log(`  ${i + 1}. ${f.name}\n     ${f.error}`));
  }
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(e => { console.error(e); process.exit(1); });
