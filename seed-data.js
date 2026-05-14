#!/usr/bin/env node
/**
 * Seed real data into MISA DB — uses Node.js fetch (proper UTF-8)
 */
const BASE = 'http://localhost:3003';
const DB = process.argv[2] || 'ádasd2026';
const headers = {
  'Authorization': 'ApiKey misa-api-key-2026',
  'Content-Type': 'application/json; charset=utf-8',
  'X-SQL-Database': DB,
};

async function api(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (res.status >= 400 && data.error?.code !== 'NOT_FOUND' && data.error?.code !== 'DUPLICATE') {
    console.error(`  ERROR ${method} ${path}: ${res.status} ${data.error?.message}`);
  }
  return { status: res.status, data };
}

async function run() {
  console.log(`\nSeeding data into DB: ${DB}\n`);

  // ═══ CLEANUP old test data ═══
  console.log('--- Cleanup old data ---');
  // Delete vouchers first (they have FK to details + GL)
  for (const ep of ['journal/cash/receipts', 'journal/cash/payments', 'journal/bank/deposits',
    'journal/bank/withdrawals', 'journal/gl-vouchers', 'sales/vouchers', 'purchase/vouchers']) {
    const list = await api('GET', `/api/${ep}?pageSize=50`);
    for (const v of (list.data.data || [])) {
      await api('DELETE', `/api/${ep}/${v.RefID}`);
    }
    console.log(`  ${ep}: deleted ${list.data.data?.length || 0}`);
  }
  // Delete dictionary items
  const objs = await api('GET', '/api/dictionary/account-objects?pageSize=100');
  for (const o of (objs.data.data || [])) {
    await api('DELETE', `/api/dictionary/account-objects/${o.AccountObjectID}`);
  }
  console.log(`  account-objects: deleted ${objs.data.data?.length || 0}`);

  const items = await api('GET', '/api/dictionary/inventory-items?pageSize=100');
  for (const i of (items.data.data || [])) {
    // Don't delete built-in items
    if (!['LPXD','KHACHSAN_PHI_PHUCVU','CPMH'].includes(i.InventoryItemCode)) {
      await api('DELETE', `/api/dictionary/inventory-items/${i.InventoryItemID}`);
    }
  }

  // ═══ CREATE DICTIONARY ═══
  console.log('\n--- Tạo danh mục ---');

  // Nhà cung cấp
  const ncc1 = await api('POST', '/api/dictionary/account-objects', {
    AccountObjectCode: 'NCC001',
    AccountObjectName: 'Công ty TNHH Thép Việt Nhật',
    AccountObjectType: 1,
    Address: '123 Lê Lợi, Quận 1, TP. Hồ Chí Minh',
    Tel: '028-38123456',
    CompanyTaxCode: '0301234567',
  });
  const NCC1 = ncc1.data.data?.AccountObjectID;
  console.log(`  NCC001 Công ty TNHH Thép Việt Nhật: ${NCC1 ? 'OK' : 'FAIL'}`);

  const ncc2 = await api('POST', '/api/dictionary/account-objects', {
    AccountObjectCode: 'NCC002',
    AccountObjectName: 'Công ty TNHH Hóa chất Đức Giang',
    AccountObjectType: 1,
    Address: '78 Hoàng Quốc Việt, Cầu Giấy, Hà Nội',
    CompanyTaxCode: '0100123456',
  });
  const NCC2 = ncc2.data.data?.AccountObjectID;
  console.log(`  NCC002 Công ty TNHH Hóa chất Đức Giang: ${NCC2 ? 'OK' : 'FAIL'}`);

  // Khách hàng
  const kh1 = await api('POST', '/api/dictionary/account-objects', {
    AccountObjectCode: 'KH001',
    AccountObjectName: 'Công ty CP Xây dựng Hòa Phát',
    AccountObjectType: 0,
    Address: '456 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    Tel: '028-38654321',
    CompanyTaxCode: '0309876543',
  });
  const KH1 = kh1.data.data?.AccountObjectID;
  console.log(`  KH001 Công ty CP Xây dựng Hòa Phát: ${KH1 ? 'OK' : 'FAIL'}`);

  const kh2 = await api('POST', '/api/dictionary/account-objects', {
    AccountObjectCode: 'KH002',
    AccountObjectName: 'Công ty CP Đầu tư Thành Công',
    AccountObjectType: 0,
    Address: '99 Lý Thường Kiệt, Quận 10, TP. Hồ Chí Minh',
    CompanyTaxCode: '0312345678',
  });
  const KH2 = kh2.data.data?.AccountObjectID;
  console.log(`  KH002 Công ty CP Đầu tư Thành Công: ${KH2 ? 'OK' : 'FAIL'}`);

  // Hàng hóa
  const thep = await api('POST', '/api/dictionary/inventory-items', {
    InventoryItemCode: 'THEPTAM10',
    InventoryItemName: 'Thép tấm 10mm',
    InventoryItemType: 0,
    UnitName: 'Tấn',
  });
  const THEP = thep.data.data?.InventoryItemID;
  console.log(`  THEPTAM10 Thép tấm 10mm: ${THEP ? 'OK' : 'FAIL'}`);

  const cuon = await api('POST', '/api/dictionary/inventory-items', {
    InventoryItemCode: 'THEPCUON',
    InventoryItemName: 'Thép cuộn CB240',
    InventoryItemType: 0,
    UnitName: 'Tấn',
  });
  const CUON = cuon.data.data?.InventoryItemID;
  console.log(`  THEPCUON Thép cuộn CB240: ${CUON ? 'OK' : 'FAIL'}`);

  const ximang = await api('POST', '/api/dictionary/inventory-items', {
    InventoryItemCode: 'XIMANG40',
    InventoryItemName: 'Xi măng PCB40',
    InventoryItemType: 0,
    UnitName: 'Tấn',
  });
  const XM = ximang.data.data?.InventoryItemID;
  console.log(`  XIMANG40 Xi măng PCB40: ${XM ? 'OK' : 'FAIL'}`);

  if (!NCC1 || !KH1 || !THEP) {
    console.error('\nFATAL: Cannot create base data. Aborting.');
    process.exit(1);
  }

  // ═══ CREATE VOUCHERS ═══
  console.log('\n--- Tạo chứng từ ---');

  // 1. Phiếu thu — Thu tiền KH Hòa Phát
  const pt1 = await api('POST', '/api/journal/cash/receipts', {
    JournalMemo: 'Thu tiền hàng - Công ty Hòa Phát',
    AccountObjectID: KH1,
    AccountObjectName: 'Công ty CP Xây dựng Hòa Phát',
    AccountObjectAddress: '456 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    TotalAmount: 50000000,
    CurrencyID: 'VND',
    ExchangeRate: 1,
    details: [{
      DebitAccount: '1111', CreditAccount: '131',
      Amount: 50000000, AmountOC: 50000000,
      Description: 'Thu tiền hàng đợt 1 theo HĐ số 001/2026',
      AccountObjectID: KH1,
    }],
  });
  console.log(`  Phiếu thu: ${pt1.data.data?.RefNo || 'FAIL'} — 50,000,000 VND`);

  // 2. Phiếu thu 2 — KH2
  const pt2 = await api('POST', '/api/journal/cash/receipts', {
    JournalMemo: 'Thu tiền hàng - Công ty Thành Công',
    AccountObjectID: KH2,
    AccountObjectName: 'Công ty CP Đầu tư Thành Công',
    TotalAmount: 25000000,
    details: [{
      DebitAccount: '1111', CreditAccount: '131',
      Amount: 25000000, AmountOC: 25000000,
      Description: 'Thu tiền hàng xi măng đợt 2',
      AccountObjectID: KH2,
    }],
  });
  console.log(`  Phiếu thu: ${pt2.data.data?.RefNo || 'FAIL'} — 25,000,000 VND`);

  // 3. Phiếu chi — Mua VPP
  const pc1 = await api('POST', '/api/journal/cash/payments', {
    JournalMemo: 'Chi mua văn phòng phẩm tháng 5/2026',
    TotalAmount: 3500000,
    details: [{
      DebitAccount: '6422', CreditAccount: '1111',
      Amount: 3500000, AmountOC: 3500000,
      Description: 'Mua văn phòng phẩm tháng 5/2026',
    }],
  });
  console.log(`  Phiếu chi: ${pc1.data.data?.RefNo || 'FAIL'} — 3,500,000 VND`);

  // 4. Phiếu chi 2 — Tiền điện
  const pc2 = await api('POST', '/api/journal/cash/payments', {
    JournalMemo: 'Chi tiền điện văn phòng tháng 5/2026',
    TotalAmount: 12000000,
    details: [{
      DebitAccount: '6422', CreditAccount: '1111',
      Amount: 12000000, AmountOC: 12000000,
      Description: 'Tiền điện văn phòng tháng 5/2026',
    }],
  });
  console.log(`  Phiếu chi: ${pc2.data.data?.RefNo || 'FAIL'} — 12,000,000 VND`);

  // 5. Bán hàng — Thép tấm + VAT
  const bh1 = await api('POST', '/api/sales/vouchers', {
    JournalMemo: 'Bán thép tấm 10mm cho Công ty Hòa Phát',
    AccountObjectID: KH1,
    AccountObjectName: 'Công ty CP Xây dựng Hòa Phát',
    TotalAmount: 110000000,
    TotalAmountOC: 110000000,
    TotalSaleAmount: 100000000,
    TotalVATAmount: 10000000,
    details: [
      {
        DebitAccount: '131', CreditAccount: '5111',
        Amount: 100000000, AmountOC: 100000000,
        Description: 'Thép tấm 10mm - 20 tấn',
        Quantity: 20, UnitPrice: 5000000,
        InventoryItemID: THEP, AccountObjectID: KH1,
      },
      {
        DebitAccount: '131', CreditAccount: '33311',
        Amount: 10000000, AmountOC: 10000000,
        Description: 'Thuế GTGT 10%',
        InventoryItemID: THEP, AccountObjectID: KH1,
      },
    ],
  });
  console.log(`  Bán hàng: ${bh1.data.data?.RefNo || 'FAIL'} — 110,000,000 VND`);

  // 6. Bán hàng 2 — Xi măng + VAT
  const bh2 = await api('POST', '/api/sales/vouchers', {
    JournalMemo: 'Bán xi măng PCB40 cho Công ty Thành Công',
    AccountObjectID: KH2,
    AccountObjectName: 'Công ty CP Đầu tư Thành Công',
    TotalAmount: 55000000,
    TotalAmountOC: 55000000,
    TotalSaleAmount: 50000000,
    TotalVATAmount: 5000000,
    details: [
      {
        DebitAccount: '131', CreditAccount: '5111',
        Amount: 50000000, AmountOC: 50000000,
        Description: 'Xi măng PCB40 - 100 tấn',
        Quantity: 100, UnitPrice: 500000,
        InventoryItemID: XM, AccountObjectID: KH2,
      },
      {
        DebitAccount: '131', CreditAccount: '33311',
        Amount: 5000000, AmountOC: 5000000,
        Description: 'Thuế GTGT 10%',
        InventoryItemID: XM, AccountObjectID: KH2,
      },
    ],
  });
  console.log(`  Bán hàng: ${bh2.data.data?.RefNo || 'FAIL'} — 55,000,000 VND`);

  // 7. Mua hàng — Thép cuộn
  const mh1 = await api('POST', '/api/purchase/vouchers', {
    JournalMemo: 'Mua thép cuộn CB240 từ Thép Việt Nhật',
    AccountObjectID: NCC1,
    AccountObjectName: 'Công ty TNHH Thép Việt Nhật',
    TotalAmount: 80000000,
    TotalAmountOC: 80000000,
    details: [{
      DebitAccount: '152', CreditAccount: '331',
      Amount: 80000000, AmountOC: 80000000,
      Description: 'Thép cuộn CB240 - 10 tấn',
      Quantity: 10, UnitPrice: 8000000,
      InventoryItemID: CUON, AccountObjectID: NCC1,
    }],
  });
  console.log(`  Mua hàng: ${mh1.data.data?.RefNo || 'FAIL'} — 80,000,000 VND`);

  // 8. Mua hàng 2 — Hóa chất
  const mh2 = await api('POST', '/api/purchase/vouchers', {
    JournalMemo: 'Mua hóa chất công nghiệp từ Đức Giang',
    AccountObjectID: NCC2,
    AccountObjectName: 'Công ty TNHH Hóa chất Đức Giang',
    TotalAmount: 45000000,
    TotalAmountOC: 45000000,
    details: [{
      DebitAccount: '152', CreditAccount: '331',
      Amount: 45000000, AmountOC: 45000000,
      Description: 'Hóa chất công nghiệp - 5 tấn',
      Quantity: 5, UnitPrice: 9000000,
      InventoryItemID: XM, AccountObjectID: NCC2,
    }],
  });
  console.log(`  Mua hàng: ${mh2.data.data?.RefNo || 'FAIL'} — 45,000,000 VND`);

  // 9. Nộp tiền NH
  const nh = await api('POST', '/api/journal/bank/deposits', {
    JournalMemo: 'Nộp tiền mặt vào ngân hàng Vietcombank',
    TotalAmount: 30000000,
    details: [{
      DebitAccount: '1121', CreditAccount: '1111',
      Amount: 30000000, AmountOC: 30000000,
      Description: 'Nộp tiền mặt vào tài khoản Vietcombank',
    }],
  });
  console.log(`  Thu tiền gửi: ${nh.data.data?.RefNo || 'FAIL'} — 30,000,000 VND`);

  // 10. UNC trả NCC
  const unc = await api('POST', '/api/journal/bank/withdrawals', {
    JournalMemo: 'Ủy nhiệm chi trả tiền Thép Việt Nhật',
    AccountObjectID: NCC1,
    AccountObjectName: 'Công ty TNHH Thép Việt Nhật',
    TotalAmount: 80000000,
    details: [{
      DebitAccount: '331', CreditAccount: '1121',
      Amount: 80000000, AmountOC: 80000000,
      Description: 'Thanh toán HĐ mua thép cuộn CB240',
      AccountObjectID: NCC1,
    }],
  });
  console.log(`  Ủy nhiệm chi: ${unc.data.data?.RefNo || 'FAIL'} — 80,000,000 VND`);

  // 11. CT NV khác
  const glv = await api('POST', '/api/journal/gl-vouchers', {
    JournalMemo: 'Phân bổ chi phí thuê văn phòng tháng 5/2026',
    TotalAmount: 5000000,
    details: [{
      DebitAccount: '6422', CreditAccount: '242',
      Amount: 5000000, AmountOC: 5000000,
      Description: 'Phân bổ chi phí thuê văn phòng tháng 5/2026',
    }],
  });
  console.log(`  CT NV khác: ${glv.data.data?.RefNo || 'FAIL'} — 5,000,000 VND`);

  // ═══ VERIFY ═══
  console.log('\n--- Kiểm tra cân đối ---');
  const tb = await api('GET', '/api/reports/trial-balance?grade=1');
  let dr = 0, cr = 0;
  for (const r of (tb.data.data || [])) {
    dr += r.DebitAmount;
    cr += r.CreditAmount;
  }
  console.log(`  Tổng Nợ:  ${dr.toLocaleString()}`);
  console.log(`  Tổng Có:  ${cr.toLocaleString()}`);
  console.log(`  Cân đối:  ${Math.abs(dr - cr) < 1 ? 'CÂN BẰNG ✓' : 'LỆCH ✗'}`);

  // Verify Vietnamese text is stored correctly
  console.log('\n--- Kiểm tra tiếng Việt ---');
  const receipts = await api('GET', '/api/journal/cash/receipts?pageSize=1');
  const r0 = receipts.data.data?.[0];
  if (r0) {
    console.log(`  JournalMemo: "${r0.JournalMemo}"`);
    console.log(`  AccountObjectName: "${r0.AccountObjectName}"`);
    const ok = r0.JournalMemo?.includes('ề') || r0.JournalMemo?.includes('ô') || r0.JournalMemo?.includes('ạ') || r0.JournalMemo?.includes('ắ');
    console.log(`  UTF-8: ${r0.JournalMemo?.includes('ề') || r0.JournalMemo?.includes('ò') || r0.JournalMemo?.includes('à') ? '✓ OK' : '? Check in MISA'}`);
  }

  console.log('\nDone! Mở MISA desktop và kiểm tra.\n');
}

run().catch(e => { console.error(e); process.exit(1); });
