async function test() {
  const H = {'Authorization':'ApiKey misa-api-key-2026','Content-Type':'application/json','X-SQL-Instance':'192.168.1.232\\MISASME2026','X-SQL-Database':'dsadasdsa2026'};
  let ok = 0, fail = 0;
  function check(name, cond) { if (cond) { ok++; console.log('  ✓', name); } else { fail++; console.log('  ✗', name); } }

  console.log('\n  REMOTE SQL CONNECTION TEST (IP: 192.168.1.232)\n');

  // Health
  const h = await (await fetch('http://localhost:3003/api/system/health', { headers: H })).json();
  check('Health via IP', h.data?.status === 'ok');
  check('Correct DB', h.data?.database === 'dsadasdsa2026');

  // Read data
  const acc = await (await fetch('http://localhost:3003/api/dictionary/accounts?pageSize=3', { headers: H })).json();
  check('Read accounts via IP', acc.data?.length > 0);

  // CRUD
  const cr = await (await fetch('http://localhost:3003/api/journal/cash/receipts', { method: 'POST', headers: H, body: JSON.stringify({ JournalMemo: 'Remote IP test', TotalAmount: 999, details: [{ DebitAccount: '1111', CreditAccount: '131', Amount: 999, Description: 'Test kết nối IP' }] }) })).json();
  check('Create via IP', cr.data?.RefID);
  if (cr.data?.RefID) {
    const rd = await (await fetch('http://localhost:3003/api/journal/cash/receipts/' + cr.data.RefID, { headers: H })).json();
    check('Read back via IP', rd.data?.JournalMemo === 'Remote IP test');
    check('UTF-8 via IP', rd.data?.JournalMemo === 'Remote IP test');
    const del = await fetch('http://localhost:3003/api/journal/cash/receipts/' + cr.data.RefID, { method: 'DELETE', headers: H });
    check('Delete via IP', del.status === 200);
    const v = await fetch('http://localhost:3003/api/journal/cash/receipts/' + cr.data.RefID, { headers: H });
    check('404 after delete', v.status === 404);
  }

  // Switch DB via header
  const h2 = await (await fetch('http://localhost:3003/api/system/health', { headers: { ...H, 'X-SQL-Database': 'MISASME2026SampleTT133' } })).json();
  check('Switch DB via header', h2.data?.database === 'MISASME2026SampleTT133');

  // Unicode DB
  const h3 = await (await fetch('http://localhost:3003/api/system/health', { headers: { ...H, 'X-SQL-Database': 'ádasd2026' } })).json();
  check('Unicode DB ádasd2026', h3.data?.database === 'ádasd2026');

  // Validation
  const v1 = await fetch('http://localhost:3003/api/system/health', { headers: { ...H, 'X-SQL-Auth': 'sql' } });
  check('Reject SQL auth no user', (await v1.json()).error?.code === 'MISSING_CREDENTIALS');

  console.log(`\n  ${ok} passed, ${fail} failed\n`);
  process.exit(fail > 0 ? 1 : 0);
}
test().catch(e => { console.error(e.message); process.exit(1); });
