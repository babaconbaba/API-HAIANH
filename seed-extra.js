#!/usr/bin/env node
/**
 * Seed EXTRA data — modules chưa có: Hợp đồng, Kho, TSCĐ, CCDC, etc.
 * Chạy SAU seed-full.js
 */
const BASE = 'http://localhost:3003';
const DB = process.argv[2] || 'dsadasdsa2026';
const H = { 'Authorization': 'ApiKey misa-api-key-2026', 'Content-Type': 'application/json; charset=utf-8', 'X-SQL-Database': DB };

async function api(m, p, b) {
  const r = await fetch(`${BASE}${p}`, { method: m, headers: H, body: b ? JSON.stringify(b) : undefined });
  return { s: r.status, d: await r.json() };
}
const ok = (r, label) => {
  const no = r.d.data?.RefNo || r.d.data?.RefID?.substring(0,8) || r.d.data?.ContractID?.substring(0,8) || r.d.data?.FixedAssetID?.substring(0,8) || r.d.data?.SupplyID?.substring(0,8);
  console.log(`  ${r.s < 400 ? '✓' : '✗'} ${label}: ${no || r.d.error?.message?.substring(0,80)}`);
  return r;
};

async function run() {
  console.log(`\n  SEED EXTRA → ${DB}\n`);

  // Get existing data
  const aoList = (await api('GET', '/api/dictionary/account-objects?pageSize=100')).d.data || [];
  const iiList = (await api('GET', '/api/dictionary/inventory-items?pageSize=100')).d.data || [];
  const ncc1 = aoList.find(o => o.AccountObjectCode === 'NCC001');
  const ncc2 = aoList.find(o => o.AccountObjectCode === 'NCC002');
  const kh1 = aoList.find(o => o.AccountObjectCode === 'KH001');
  const kh2 = aoList.find(o => o.AccountObjectCode === 'KH002');
  const thep = iiList.find(i => i.InventoryItemCode === 'THEPTAM10');
  const cuon = iiList.find(i => i.InventoryItemCode === 'THEPCUON240');
  const ximang = iiList.find(i => i.InventoryItemCode === 'XIMANG40');
  const cat = iiList.find(i => i.InventoryItemCode === 'CATDAY2');
  const son = iiList.find(i => i.InventoryItemCode === 'SONNUOC');

  if (!ncc1 || !kh1 || !thep) { console.error('FATAL: Chạy seed-full.js trước!'); process.exit(1); }
  console.log(`  Đã có: ${aoList.length} KH/NCC, ${iiList.length} hàng hóa\n`);

  // ═══ HỢP ĐỒNG MUA (PUContract) ═══
  console.log('── Hợp đồng mua ──');
  // PUContract is a general endpoint, needs direct creation
  // Check if contracts API supports create
  const ct1 = await api('GET', '/api/general/purchase-contracts?pageSize=1');
  console.log(`  Hiện có: ${ct1.d.data?.length || 0} hợp đồng mua`);

  // Contracts are in /api/contracts for sales, purchase contracts via /api/general/purchase-contracts (read-only)
  // Need to check if we have create API for contracts
  const contractCreate = await api('POST', '/api/contracts', {
    ContractCode: 'HĐMH001',
    ContractName: 'Hợp đồng mua thép cuộn CB240 năm 2026',
    ContractType: 0,
    ContractStatus: 0,
    SignDate: '2026-01-15',
    StartDate: '2026-01-15',
    EndDate: '2026-12-31',
    ContractAmount: 500000000,
    AccountObjectID: ncc1.AccountObjectID,
    AccountObjectName: ncc1.AccountObjectName,
  });
  ok(contractCreate, 'Hợp đồng bán HĐMH001');

  const contract2 = await api('POST', '/api/contracts', {
    ContractCode: 'HĐBH001',
    ContractName: 'Hợp đồng bán thép tấm cho Hòa Phát',
    ContractType: 1,
    ContractStatus: 0,
    SignDate: '2026-02-01',
    StartDate: '2026-02-01',
    EndDate: '2026-12-31',
    ContractAmount: 800000000,
    AccountObjectID: kh1.AccountObjectID,
    AccountObjectName: kh1.AccountObjectName,
  });
  ok(contract2, 'Hợp đồng bán HĐBH001');

  // ═══ NHẬP KHO (INInward) ═══
  console.log('\n── Nhập kho / Xuất kho ──');

  ok(await api('POST', '/api/inventory/inwards', {
    JournalMemo: 'Nhập kho thép cuộn CB240 từ nhà cung cấp',
    AccountObjectID: ncc1.AccountObjectID, AccountObjectName: ncc1.AccountObjectName,
    TotalAmount: 80000000,
    details: [{
      DebitAccount: '152', CreditAccount: '331', Amount: 80000000, AmountOC: 80000000,
      Quantity: 10, UnitPrice: 8000000, InventoryItemID: cuon.InventoryItemID,
      AccountObjectID: ncc1.AccountObjectID, Description: 'Nhập kho thép cuộn CB240 - 10 tấn',
    }],
  }), 'Nhập kho thép cuộn');

  ok(await api('POST', '/api/inventory/inwards', {
    JournalMemo: 'Nhập kho xi măng PCB40',
    AccountObjectID: ncc2.AccountObjectID, AccountObjectName: ncc2.AccountObjectName,
    TotalAmount: 25000000,
    details: [{
      DebitAccount: '152', CreditAccount: '331', Amount: 25000000, AmountOC: 25000000,
      Quantity: 50, UnitPrice: 500000, InventoryItemID: ximang.InventoryItemID,
      AccountObjectID: ncc2.AccountObjectID, Description: 'Nhập kho xi măng PCB40 - 50 tấn',
    }],
  }), 'Nhập kho xi măng');

  // Xuất kho
  ok(await api('POST', '/api/inventory/outwards', {
    JournalMemo: 'Xuất kho thép tấm giao khách hàng Hòa Phát',
    AccountObjectID: kh1.AccountObjectID, AccountObjectName: kh1.AccountObjectName,
    TotalAmount: 60000000,
    details: [{
      DebitAccount: '632', CreditAccount: '152', Amount: 60000000, AmountOC: 60000000,
      Quantity: 12, UnitPrice: 5000000, InventoryItemID: thep.InventoryItemID,
      AccountObjectID: kh1.AccountObjectID, Description: 'Xuất kho thép tấm 10mm - 12 tấn',
    }],
  }), 'Xuất kho thép tấm');

  ok(await api('POST', '/api/inventory/outwards', {
    JournalMemo: 'Xuất kho xi măng giao Thành Công',
    AccountObjectID: kh2.AccountObjectID, AccountObjectName: kh2.AccountObjectName,
    TotalAmount: 15000000,
    details: [{
      DebitAccount: '632', CreditAccount: '152', Amount: 15000000, AmountOC: 15000000,
      Quantity: 30, UnitPrice: 500000, InventoryItemID: ximang.InventoryItemID,
      AccountObjectID: kh2.AccountObjectID, Description: 'Xuất kho xi măng PCB40 - 30 tấn',
    }],
  }), 'Xuất kho xi măng');

  // Chuyển kho
  ok(await api('POST', '/api/inventory/transfers', {
    JournalMemo: 'Chuyển kho nội bộ - thép tấm sang kho 2',
    TotalAmount: 20000000,
    details: [{
      DebitAccount: '152', CreditAccount: '152', Amount: 20000000, AmountOC: 20000000,
      Quantity: 4, UnitPrice: 5000000, InventoryItemID: thep.InventoryItemID,
      Description: 'Chuyển 4 tấn thép tấm sang kho phân xưởng',
    }],
  }), 'Chuyển kho thép');

  // ═══ TSCĐ (FixedAsset) ═══
  console.log('\n── Tài sản cố định ──');

  const branches = (await api('GET', '/api/system/branches')).d.data || [];
  const branch = branches.find(b => b.OrganizationUnitTypeID === 1);
  const cats = (await api('GET', '/api/fixed-assets/categories')).d.data || [];
  const faCat = cats[0]?.FixedAssetCategoryID;

  if (faCat && branch) {
    ok(await api('POST', '/api/fixed-assets/assets', {
      FixedAssetCode: 'XE001', FixedAssetName: 'Xe tải Hyundai HD120 5 tấn',
      OrgPrice: 850000000, DepreciationAmount: 0, LifeTime: 10,
      FixedAssetCategoryID: faCat, BranchID: branch.OrganizationUnitID, Inactive: false,
    }), 'TSCĐ xe tải');

    ok(await api('POST', '/api/fixed-assets/assets', {
      FixedAssetCode: 'MMS001', FixedAssetName: 'Máy cắt thép CNC Amada',
      OrgPrice: 1200000000, DepreciationAmount: 0, LifeTime: 8,
      FixedAssetCategoryID: faCat, BranchID: branch.OrganizationUnitID, Inactive: false,
    }), 'TSCĐ máy cắt CNC');

    ok(await api('POST', '/api/fixed-assets/assets', {
      FixedAssetCode: 'VP001', FixedAssetName: 'Văn phòng làm việc tầng 3',
      OrgPrice: 2500000000, DepreciationAmount: 0, LifeTime: 20,
      FixedAssetCategoryID: faCat, BranchID: branch.OrganizationUnitID, Inactive: false,
    }), 'TSCĐ văn phòng');
  } else {
    console.log('  ⚠ Không tìm được FixedAssetCategory hoặc Branch');
  }

  // ═══ CCDC (SUIncrement) ═══
  console.log('\n── Công cụ dụng cụ ──');
  if (branch) {
    ok(await api('POST', '/api/fixed-assets/tools', {
      SupplyCode: 'CCDC001', SupplyName: 'Bộ dụng cụ sửa chữa điện',
      OrgPrice: 15000000, BranchID: branch.OrganizationUnitID,
    }), 'CCDC bộ dụng cụ điện');

    ok(await api('POST', '/api/fixed-assets/tools', {
      SupplyCode: 'CCDC002', SupplyName: 'Máy khoan cầm tay Bosch',
      OrgPrice: 8000000, BranchID: branch.OrganizationUnitID,
    }), 'CCDC máy khoan');
  }

  // ═══ Budget ═══
  console.log('\n── Ngân sách ──');
  ok(await api('POST', '/api/budget', {
    BudgetCode: 'NS2026', BudgetName: 'Ngân sách hoạt động năm 2026', BudgetYear: 2026,
  }), 'Ngân sách 2026');

  // ═══ THÊM CHỨNG TỪ ĐA DẠNG ═══
  console.log('\n── Chứng từ bổ sung ──');

  // Chuyển tiền nội bộ
  ok(await api('POST', '/api/journal/bank/internal-transfers', {
    JournalMemo: 'Chuyển tiền từ Vietcombank sang BIDV',
    TotalAmount: 50000000,
    details: [{ DebitAccount: '1121', CreditAccount: '1121', Amount: 50000000, AmountOC: 50000000, Description: 'CK nội bộ VCB → BIDV' }],
  }), 'Chuyển tiền nội bộ');

  // CT NV khác — Kết chuyển cuối kỳ
  ok(await api('POST', '/api/journal/gl-vouchers', {
    JournalMemo: 'Kết chuyển doanh thu cuối tháng 5',
    TotalAmount: 170000000,
    details: [{ DebitAccount: '5111', CreditAccount: '911', Amount: 170000000, AmountOC: 170000000, Description: 'KC doanh thu → XĐKQ' }],
  }), 'KC doanh thu');

  ok(await api('POST', '/api/journal/gl-vouchers', {
    JournalMemo: 'Kết chuyển chi phí cuối tháng 5',
    TotalAmount: 148500000,
    details: [
      { DebitAccount: '911', CreditAccount: '632', Amount: 120000000, AmountOC: 120000000, Description: 'KC giá vốn → XĐKQ' },
      { DebitAccount: '911', CreditAccount: '6422', Amount: 28500000, AmountOC: 28500000, Description: 'KC chi phí QLDN → XĐKQ' },
    ],
  }), 'KC chi phí');

  // ═══ VERIFY ═══
  console.log('\n── Kết quả tổng ──');
  let total = 0;
  for (const [label, ep] of [
    ['Phiếu thu', 'journal/cash/receipts'], ['Phiếu chi', 'journal/cash/payments'],
    ['Thu tiền gửi', 'journal/bank/deposits'], ['Ủy nhiệm chi', 'journal/bank/withdrawals'],
    ['Chuyển tiền NB', 'journal/bank/internal-transfers'], ['CT NV khác', 'journal/gl-vouchers'],
    ['Báo giá', 'sales/quotes'], ['Đơn đặt hàng', 'sales/orders'],
    ['Bán hàng', 'sales/vouchers'], ['Hóa đơn', 'sales/invoices'],
    ['Giảm giá BH', 'sales/discounts'], ['Trả lại BH', 'sales/returns'],
    ['Đơn mua hàng', 'purchase/orders'], ['Mua hàng', 'purchase/vouchers'],
    ['Trả lại MH', 'purchase/returns'], ['Mua dịch vụ', 'purchase/services'],
    ['Nhập kho', 'inventory/inwards'], ['Xuất kho', 'inventory/outwards'],
    ['Chuyển kho', 'inventory/transfers'],
    ['TSCĐ', 'fixed-assets/assets'], ['CCDC', 'fixed-assets/tools'],
    ['Hợp đồng', 'contracts'], ['Ngân sách', 'budget'],
  ]) {
    const ct = (await api('GET', `/api/${ep}?pageSize=1`)).d.pagination?.totalCount || (await api('GET', `/api/${ep}?pageSize=1`)).d.data?.length || 0;
    total += ct;
    if (ct > 0) console.log(`  ${label.padEnd(22)} ${ct}`);
  }
  console.log(`  ${'─'.repeat(30)}`);
  console.log(`  TỔNG CỘNG             ${total}`);

  console.log('\n  Mở MISA → kiểm tra tất cả modules!\n');
}

run().catch(e => { console.error(e); process.exit(1); });
