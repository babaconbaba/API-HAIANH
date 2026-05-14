#!/usr/bin/env node
/**
 * MISA SME API — Full seed data (ALL voucher types)
 * Usage: node seed-full.js [database_name]
 */
const BASE = 'http://localhost:3003';
const DB = process.argv[2] || 'dsadasdsa2026';
const headers = {
  'Authorization': 'ApiKey misa-api-key-2026',
  'Content-Type': 'application/json; charset=utf-8',
  'X-SQL-Database': DB,
};

async function api(method, path, body) {
  const res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json();
  if (res.status >= 400 && !['NOT_FOUND','DUPLICATE'].includes(data.error?.code)) {
    console.error(`  ✗ ${method} ${path}: ${data.error?.message?.substring(0,120)}`);
  }
  return { status: res.status, data };
}

async function run() {
  console.log(`\n========================================`);
  console.log(`  SEED FULL DATA → ${DB}`);
  console.log(`========================================\n`);

  // ═══ CLEANUP ═══
  console.log('Xóa dữ liệu cũ...');
  for (const ep of [
    'journal/cash/receipts', 'journal/cash/payments',
    'journal/bank/deposits', 'journal/bank/withdrawals', 'journal/bank/internal-transfers',
    'journal/gl-vouchers',
    'sales/vouchers', 'sales/orders', 'sales/returns', 'sales/invoices', 'sales/quotes', 'sales/discounts',
    'purchase/vouchers', 'purchase/orders', 'purchase/returns', 'purchase/services',
    'inventory/inwards', 'inventory/outwards', 'inventory/transfers',
  ]) {
    const list = await api('GET', `/api/${ep}?pageSize=100`);
    for (const v of (list.data.data || [])) await api('DELETE', `/api/${ep}/${v.RefID}`);
    if (list.data.data?.length) console.log(`  ${ep}: xóa ${list.data.data.length}`);
  }
  // Cleanup dictionary
  const objs = await api('GET', '/api/dictionary/account-objects?pageSize=200');
  for (const o of (objs.data.data || [])) await api('DELETE', `/api/dictionary/account-objects/${o.AccountObjectID}`);
  const items = await api('GET', '/api/dictionary/inventory-items?pageSize=200');
  for (const i of (items.data.data || [])) {
    if (!['LPXD','KHACHSAN_PHI_PHUCVU','CPMH'].includes(i.InventoryItemCode))
      await api('DELETE', `/api/dictionary/inventory-items/${i.InventoryItemID}`);
  }

  // ═══ DANH MỤC ═══
  console.log('\n── Tạo danh mục ──');

  const ncc = [];
  for (const d of [
    { code: 'NCC001', name: 'Công ty TNHH Thép Việt Nhật', addr: '123 Lê Lợi, Quận 1, TP.HCM', tax: '0301234567' },
    { code: 'NCC002', name: 'Công ty TNHH Hóa chất Đức Giang', addr: '78 Hoàng Quốc Việt, Hà Nội', tax: '0100123456' },
    { code: 'NCC003', name: 'Công ty CP Vật liệu Xây dựng Bình Dương', addr: '56 Đại lộ Bình Dương, Thủ Dầu Một', tax: '3702345678' },
  ]) {
    const r = await api('POST', '/api/dictionary/account-objects', {
      AccountObjectCode: d.code, AccountObjectName: d.name, AccountObjectType: 1, Address: d.addr, CompanyTaxCode: d.tax,
    });
    ncc.push({ id: r.data.data?.AccountObjectID, ...d });
    console.log(`  NCC: ${d.code} ${d.name} ${r.data.data ? '✓' : '✗'}`);
  }

  const kh = [];
  for (const d of [
    { code: 'KH001', name: 'Công ty CP Xây dựng Hòa Phát', addr: '456 Nguyễn Huệ, Quận 1, TP.HCM', tax: '0309876543' },
    { code: 'KH002', name: 'Công ty CP Đầu tư Thành Công', addr: '99 Lý Thường Kiệt, Quận 10, TP.HCM', tax: '0312345678' },
    { code: 'KH003', name: 'Công ty TNHH Xây dựng Phúc Long', addr: '200 Trần Hưng Đạo, Quận 5, TP.HCM', tax: '0315678901' },
  ]) {
    const r = await api('POST', '/api/dictionary/account-objects', {
      AccountObjectCode: d.code, AccountObjectName: d.name, AccountObjectType: 0, Address: d.addr, CompanyTaxCode: d.tax,
    });
    kh.push({ id: r.data.data?.AccountObjectID, ...d });
    console.log(`  KH:  ${d.code} ${d.name} ${r.data.data ? '✓' : '✗'}`);
  }

  const inv = [];
  for (const d of [
    { code: 'THEPTAM10', name: 'Thép tấm 10mm', unit: 'Tấn' },
    { code: 'THEPCUON240', name: 'Thép cuộn CB240', unit: 'Tấn' },
    { code: 'XIMANG40', name: 'Xi măng PCB40', unit: 'Tấn' },
    { code: 'CATDAY2', name: 'Cát đá xây dựng loại 2', unit: 'M3' },
    { code: 'SONNUOC', name: 'Sơn nước ngoại thất Dulux', unit: 'Thùng' },
    { code: 'DICHVU_VC', name: 'Dịch vụ vận chuyển', unit: 'Chuyến' },
  ]) {
    const r = await api('POST', '/api/dictionary/inventory-items', {
      InventoryItemCode: d.code, InventoryItemName: d.name, InventoryItemType: 0, UnitName: d.unit,
    });
    inv.push({ id: r.data.data?.InventoryItemID, ...d });
    console.log(`  HH:  ${d.code} ${d.name} ${r.data.data ? '✓' : '✗'}`);
  }

  const NCC1 = ncc[0].id, NCC2 = ncc[1].id, NCC3 = ncc[2].id;
  const KH1 = kh[0].id, KH2 = kh[1].id, KH3 = kh[2].id;
  const THEP = inv[0].id, CUON = inv[1].id, XM = inv[2].id, CAT = inv[3].id, SON = inv[4].id, DV = inv[5].id;

  if (!NCC1 || !KH1 || !THEP) { console.error('FATAL: Không tạo được danh mục.'); process.exit(1); }

  // ═══ CHỨNG TỪ ═══
  console.log('\n── Tạo chứng từ ──');

  // Helper
  const ok = (r, label) => console.log(`  ${r.data.data?.RefNo ? '✓' : '✗'} ${label}: ${r.data.data?.RefNo || r.data.error?.message?.substring(0,80)}`);

  // --- PHIẾU THU ---
  ok(await api('POST', '/api/journal/cash/receipts', {
    JournalMemo: 'Thu tiền bán hàng - Công ty Hòa Phát', AccountObjectID: KH1, AccountObjectName: kh[0].name,
    TotalAmount: 50000000, details: [{ DebitAccount:'1111', CreditAccount:'131', Amount:50000000, AmountOC:50000000, Description:'Thu tiền hàng theo HĐ 001/2026', AccountObjectID:KH1 }],
  }), 'Phiếu thu 50 triệu');

  ok(await api('POST', '/api/journal/cash/receipts', {
    JournalMemo: 'Thu tiền bán hàng - Công ty Thành Công', AccountObjectID: KH2, AccountObjectName: kh[1].name,
    TotalAmount: 30000000, details: [{ DebitAccount:'1111', CreditAccount:'131', Amount:30000000, AmountOC:30000000, Description:'Thu tiền xi măng đợt 2', AccountObjectID:KH2 }],
  }), 'Phiếu thu 30 triệu');

  ok(await api('POST', '/api/journal/cash/receipts', {
    JournalMemo: 'Thu tiền bán hàng - Công ty Phúc Long', AccountObjectID: KH3, AccountObjectName: kh[2].name,
    TotalAmount: 15000000, details: [{ DebitAccount:'1111', CreditAccount:'131', Amount:15000000, AmountOC:15000000, Description:'Thu tiền sơn nước', AccountObjectID:KH3 }],
  }), 'Phiếu thu 15 triệu');

  // --- PHIẾU CHI ---
  ok(await api('POST', '/api/journal/cash/payments', {
    JournalMemo: 'Chi mua văn phòng phẩm tháng 5/2026', TotalAmount: 3500000,
    details: [{ DebitAccount:'6422', CreditAccount:'1111', Amount:3500000, AmountOC:3500000, Description:'Mua văn phòng phẩm tháng 5' }],
  }), 'Phiếu chi VPP');

  ok(await api('POST', '/api/journal/cash/payments', {
    JournalMemo: 'Chi tiền điện văn phòng tháng 5/2026', TotalAmount: 12000000,
    details: [{ DebitAccount:'6422', CreditAccount:'1111', Amount:12000000, AmountOC:12000000, Description:'Tiền điện văn phòng tháng 5/2026' }],
  }), 'Phiếu chi tiền điện');

  ok(await api('POST', '/api/journal/cash/payments', {
    JournalMemo: 'Chi tạm ứng công tác phí', TotalAmount: 5000000,
    details: [{ DebitAccount:'141', CreditAccount:'1111', Amount:5000000, AmountOC:5000000, Description:'Tạm ứng công tác phí đi Hà Nội' }],
  }), 'Phiếu chi tạm ứng');

  // --- THU TIỀN GỬI ---
  ok(await api('POST', '/api/journal/bank/deposits', {
    JournalMemo: 'Nộp tiền mặt vào ngân hàng Vietcombank', TotalAmount: 40000000,
    details: [{ DebitAccount:'1121', CreditAccount:'1111', Amount:40000000, AmountOC:40000000, Description:'Nộp tiền mặt vào TK Vietcombank' }],
  }), 'Nộp tiền NH 40 triệu');

  ok(await api('POST', '/api/journal/bank/deposits', {
    JournalMemo: 'Khách hàng chuyển khoản thanh toán', AccountObjectID: KH1, AccountObjectName: kh[0].name, TotalAmount: 60000000,
    details: [{ DebitAccount:'1121', CreditAccount:'131', Amount:60000000, AmountOC:60000000, Description:'KH Hòa Phát CK thanh toán HĐ', AccountObjectID:KH1 }],
  }), 'Thu tiền gửi từ KH');

  // --- ỦY NHIỆM CHI ---
  ok(await api('POST', '/api/journal/bank/withdrawals', {
    JournalMemo: 'Ủy nhiệm chi trả tiền Thép Việt Nhật', AccountObjectID: NCC1, AccountObjectName: ncc[0].name, TotalAmount: 80000000,
    details: [{ DebitAccount:'331', CreditAccount:'1121', Amount:80000000, AmountOC:80000000, Description:'Thanh toán HĐ mua thép cuộn', AccountObjectID:NCC1 }],
  }), 'UNC trả NCC1');

  ok(await api('POST', '/api/journal/bank/withdrawals', {
    JournalMemo: 'Ủy nhiệm chi trả tiền Đức Giang', AccountObjectID: NCC2, AccountObjectName: ncc[1].name, TotalAmount: 45000000,
    details: [{ DebitAccount:'331', CreditAccount:'1121', Amount:45000000, AmountOC:45000000, Description:'Thanh toán HĐ mua hóa chất', AccountObjectID:NCC2 }],
  }), 'UNC trả NCC2');

  // --- BÁO GIÁ (SAQuote) ---
  ok(await api('POST', '/api/sales/quotes', {
    JournalMemo: 'Báo giá thép tấm cho Hòa Phát', AccountObjectID: KH1, AccountObjectName: kh[0].name,
    TotalAmount: 150000000, details: [{ Amount:150000000, Quantity:30, UnitPrice:5000000, InventoryItemID:THEP, Description:'Thép tấm 10mm - 30 tấn' }],
  }), 'Báo giá BG');

  // --- ĐƠN ĐẶT HÀNG BÁN (SAOrder) ---
  ok(await api('POST', '/api/sales/orders', {
    JournalMemo: 'Đơn đặt hàng thép tấm - Hòa Phát', AccountObjectID: KH1, AccountObjectName: kh[0].name,
    TotalAmount: 110000000, details: [{ Amount:100000000, Quantity:20, UnitPrice:5000000, InventoryItemID:THEP, Description:'Thép tấm 10mm - 20 tấn' }, { Amount:10000000, InventoryItemID:THEP, Description:'Thuế GTGT 10%' }],
  }), 'Đơn đặt hàng ĐH');

  // --- BÁN HÀNG (SAVoucher) ---
  ok(await api('POST', '/api/sales/vouchers', {
    JournalMemo: 'Bán thép tấm 10mm cho Công ty Hòa Phát', AccountObjectID: KH1, AccountObjectName: kh[0].name,
    TotalAmount: 110000000, TotalSaleAmount: 100000000, TotalVATAmount: 10000000,
    details: [
      { DebitAccount:'131', CreditAccount:'5111', Amount:100000000, AmountOC:100000000, Quantity:20, UnitPrice:5000000, InventoryItemID:THEP, AccountObjectID:KH1, Description:'Thép tấm 10mm - 20 tấn' },
      { DebitAccount:'131', CreditAccount:'33311', Amount:10000000, AmountOC:10000000, InventoryItemID:THEP, AccountObjectID:KH1, Description:'Thuế GTGT 10%' },
    ],
  }), 'Bán hàng BH thép');

  ok(await api('POST', '/api/sales/vouchers', {
    JournalMemo: 'Bán xi măng PCB40 cho Công ty Thành Công', AccountObjectID: KH2, AccountObjectName: kh[1].name,
    TotalAmount: 55000000, TotalSaleAmount: 50000000, TotalVATAmount: 5000000,
    details: [
      { DebitAccount:'131', CreditAccount:'5111', Amount:50000000, AmountOC:50000000, Quantity:100, UnitPrice:500000, InventoryItemID:XM, AccountObjectID:KH2, Description:'Xi măng PCB40 - 100 tấn' },
      { DebitAccount:'131', CreditAccount:'33311', Amount:5000000, AmountOC:5000000, InventoryItemID:XM, AccountObjectID:KH2, Description:'Thuế GTGT 10%' },
    ],
  }), 'Bán hàng BH xi măng');

  ok(await api('POST', '/api/sales/vouchers', {
    JournalMemo: 'Bán sơn nước Dulux cho Phúc Long', AccountObjectID: KH3, AccountObjectName: kh[2].name,
    TotalAmount: 22000000, TotalSaleAmount: 20000000, TotalVATAmount: 2000000,
    details: [
      { DebitAccount:'131', CreditAccount:'5111', Amount:20000000, AmountOC:20000000, Quantity:10, UnitPrice:2000000, InventoryItemID:SON, AccountObjectID:KH3, Description:'Sơn nước Dulux ngoại thất - 10 thùng' },
      { DebitAccount:'131', CreditAccount:'33311', Amount:2000000, AmountOC:2000000, InventoryItemID:SON, AccountObjectID:KH3, Description:'Thuế GTGT 10%' },
    ],
  }), 'Bán hàng BH sơn');

  // --- HÓA ĐƠN BÁN (SAInvoice) ---
  ok(await api('POST', '/api/sales/invoices', {
    JournalMemo: 'Hóa đơn GTGT bán thép tấm', AccountObjectID: KH1, AccountObjectName: kh[0].name,
    TotalAmount: 110000000,
    details: [{ Amount:100000000, Quantity:20, UnitPrice:5000000, InventoryItemID:THEP, Description:'Thép tấm 10mm - 20 tấn' }, { Amount:10000000, InventoryItemID:THEP, Description:'Thuế GTGT 10%' }],
  }), 'Hóa đơn HD');

  // --- GIẢM GIÁ BÁN HÀNG (SADiscount) ---
  ok(await api('POST', '/api/sales/discounts', {
    JournalMemo: 'Giảm giá bán hàng cho Hòa Phát', AccountObjectID: KH1, AccountObjectName: kh[0].name,
    TotalAmount: 5000000, TotalDiscountAmount: 5000000,
    details: [{ DebitAccount:'5111', CreditAccount:'131', Amount:5000000, AmountOC:5000000, InventoryItemID:THEP, AccountObjectID:KH1, Description:'Giảm giá 5% đơn hàng lớn' }],
  }), 'Giảm giá BH');

  // --- TRẢ LẠI HÀNG BÁN (SAReturn) ---
  ok(await api('POST', '/api/sales/returns', {
    JournalMemo: 'Hàng bán trả lại - Phúc Long trả sơn', AccountObjectID: KH3, AccountObjectName: kh[2].name,
    TotalAmount: 4400000, TotalSaleAmount: 4000000, TotalVATAmount: 400000,
    details: [
      { DebitAccount:'5111', CreditAccount:'131', Amount:4000000, AmountOC:4000000, Quantity:2, UnitPrice:2000000, InventoryItemID:SON, AccountObjectID:KH3, Description:'Sơn Dulux bị lỗi - trả 2 thùng' },
      { DebitAccount:'33311', CreditAccount:'131', Amount:400000, AmountOC:400000, InventoryItemID:SON, AccountObjectID:KH3, Description:'Giảm VAT' },
    ],
  }), 'Trả lại hàng bán');

  // --- ĐƠN MUA HÀNG (PUOrder) ---
  ok(await api('POST', '/api/purchase/orders', {
    JournalMemo: 'Đơn mua thép cuộn CB240 từ Việt Nhật', AccountObjectID: NCC1, AccountObjectName: ncc[0].name,
    TotalAmount: 80000000, details: [{ Amount:80000000, Quantity:10, UnitPrice:8000000, InventoryItemID:CUON, Description:'Thép cuộn CB240 - 10 tấn' }],
  }), 'Đơn mua hàng ĐMH');

  // --- MUA HÀNG (PUVoucher) ---
  ok(await api('POST', '/api/purchase/vouchers', {
    JournalMemo: 'Mua thép cuộn CB240 từ Thép Việt Nhật', AccountObjectID: NCC1, AccountObjectName: ncc[0].name,
    TotalAmount: 80000000,
    details: [{ DebitAccount:'152', CreditAccount:'331', Amount:80000000, AmountOC:80000000, Quantity:10, UnitPrice:8000000, InventoryItemID:CUON, AccountObjectID:NCC1, Description:'Thép cuộn CB240 - 10 tấn' }],
  }), 'Mua hàng MH thép');

  ok(await api('POST', '/api/purchase/vouchers', {
    JournalMemo: 'Mua hóa chất công nghiệp từ Đức Giang', AccountObjectID: NCC2, AccountObjectName: ncc[1].name,
    TotalAmount: 45000000,
    details: [{ DebitAccount:'152', CreditAccount:'331', Amount:45000000, AmountOC:45000000, Quantity:5, UnitPrice:9000000, InventoryItemID:XM, AccountObjectID:NCC2, Description:'Hóa chất công nghiệp - 5 tấn' }],
  }), 'Mua hàng MH hóa chất');

  ok(await api('POST', '/api/purchase/vouchers', {
    JournalMemo: 'Mua cát đá xây dựng từ VLXD Bình Dương', AccountObjectID: NCC3, AccountObjectName: ncc[2].name,
    TotalAmount: 25000000,
    details: [{ DebitAccount:'152', CreditAccount:'331', Amount:25000000, AmountOC:25000000, Quantity:50, UnitPrice:500000, InventoryItemID:CAT, AccountObjectID:NCC3, Description:'Cát đá xây dựng loại 2 - 50 m3' }],
  }), 'Mua hàng MH cát đá');

  // --- TRẢ LẠI HÀNG MUA (PUReturn) ---
  ok(await api('POST', '/api/purchase/returns', {
    JournalMemo: 'Trả lại hàng mua - Thép Việt Nhật (hàng lỗi)', AccountObjectID: NCC1, AccountObjectName: ncc[0].name,
    TotalAmount: 8000000,
    details: [{ DebitAccount:'331', CreditAccount:'152', Amount:8000000, AmountOC:8000000, Quantity:1, UnitPrice:8000000, InventoryItemID:CUON, AccountObjectID:NCC1, Description:'Trả lại 1 tấn thép cuộn bị lỗi' }],
  }), 'Trả lại hàng mua');

  // --- MUA DỊCH VỤ (PUService) ---
  ok(await api('POST', '/api/purchase/services', {
    JournalMemo: 'Mua dịch vụ vận chuyển hàng', AccountObjectID: NCC3, AccountObjectName: ncc[2].name,
    TotalAmount: 8000000,
    details: [{ DebitAccount:'6421', CreditAccount:'331', Amount:8000000, AmountOC:8000000, Quantity:4, UnitPrice:2000000, InventoryItemID:DV, AccountObjectID:NCC3, Description:'Vận chuyển thép tấm - 4 chuyến' }],
  }), 'Mua dịch vụ vận chuyển');

  // --- CT NGHIỆP VỤ KHÁC (GLVoucher) ---
  ok(await api('POST', '/api/journal/gl-vouchers', {
    JournalMemo: 'Phân bổ chi phí thuê văn phòng tháng 5/2026', TotalAmount: 5000000,
    details: [{ DebitAccount:'6422', CreditAccount:'242', Amount:5000000, AmountOC:5000000, Description:'Phân bổ chi phí thuê văn phòng tháng 5' }],
  }), 'CT NV khác - phân bổ');

  ok(await api('POST', '/api/journal/gl-vouchers', {
    JournalMemo: 'Kết chuyển giá vốn hàng bán', TotalAmount: 120000000,
    details: [{ DebitAccount:'632', CreditAccount:'156', Amount:120000000, AmountOC:120000000, Description:'Kết chuyển giá vốn hàng bán tháng 5' }],
  }), 'CT NV khác - giá vốn');

  // ═══ VERIFY ═══
  console.log('\n── Kết quả ──');

  let totalVouchers = 0;
  for (const [label, ep] of [
    ['Phiếu thu', 'journal/cash/receipts'],
    ['Phiếu chi', 'journal/cash/payments'],
    ['Thu tiền gửi NH', 'journal/bank/deposits'],
    ['Ủy nhiệm chi', 'journal/bank/withdrawals'],
    ['CT NV khác', 'journal/gl-vouchers'],
    ['Báo giá', 'sales/quotes'],
    ['Đơn đặt hàng bán', 'sales/orders'],
    ['Bán hàng', 'sales/vouchers'],
    ['Hóa đơn', 'sales/invoices'],
    ['Giảm giá BH', 'sales/discounts'],
    ['Trả lại hàng bán', 'sales/returns'],
    ['Đơn mua hàng', 'purchase/orders'],
    ['Mua hàng', 'purchase/vouchers'],
    ['Trả lại hàng mua', 'purchase/returns'],
    ['Mua dịch vụ', 'purchase/services'],
  ]) {
    const r = await api('GET', `/api/${ep}?pageSize=1`);
    const ct = r.data.pagination?.totalCount || r.data.data?.length || 0;
    totalVouchers += ct;
    console.log(`  ${label.padEnd(22)} ${ct}`);
  }
  console.log(`  ${'─'.repeat(30)}`);
  console.log(`  ${'TỔNG'.padEnd(22)} ${totalVouchers} chứng từ`);

  console.log('\n── Bảng cân đối phát sinh ──');
  const tb = await api('GET', '/api/reports/trial-balance?grade=1');
  let dr = 0, cr = 0;
  for (const r of (tb.data.data || [])) {
    dr += r.DebitAmount; cr += r.CreditAmount;
    console.log(`  TK ${r.AccountNumber.padEnd(4)} ${r.AccountName?.substring(0,28).padEnd(30)} Nợ: ${String(r.DebitAmount.toLocaleString()).padStart(15)} | Có: ${String(r.CreditAmount.toLocaleString()).padStart(15)}`);
  }
  console.log(`  ${'─'.repeat(75)}`);
  console.log(`  ${'TỔNG'.padEnd(36)} Nợ: ${String(dr.toLocaleString()).padStart(15)} | Có: ${String(cr.toLocaleString()).padStart(15)}`);
  console.log(`  CÂN ĐỐI: ${Math.abs(dr - cr) < 1 ? '✓ CÂN BẰNG' : '✗ LỆCH ' + (dr - cr).toLocaleString()}`);

  console.log(`\n  Mở MISA desktop → DB: ${DB} → F5 để xem dữ liệu.\n`);
}

run().catch(e => { console.error(e); process.exit(1); });
