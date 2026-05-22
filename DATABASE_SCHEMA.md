# MISA SME 2026 — Database Schema Đầy Đủ

> Database: HAG2026 | Tổng 720 tables
> Generated: 2026-05-22

**Ký hiệu:** PK = Primary Key | FK = Foreign Key | NN = NOT NULL | ID = Identity (auto) | COMP = Computed

---

## Mục lục

- 01 — CA Tiền mặt (15 tables)
- 02 — BA Ngân hàng (15 tables)
- 03 — IN Kho (21 tables)
- 04 — SA Bán hàng (25 tables)
- 05 — PU Mua hàng (17 tables)
- 06 — GL Sổ cái / Tổng hợp (22 tables)
- 07 — FA Tài sản cố định (26 tables)
- 08 — SU Công cụ dụng cụ (20 tables)
- 09 — PA Tiền lương (19 tables)
- 10 — JC Giá thành (25 tables)
- 11 — Ledger Sổ (read tables) (15 tables)
- 12 — Danh mục: Đối tượng (KH/NCC/NV) (6 tables)
- 13 — Danh mục: Hàng hóa vật tư (24 tables)
- 14 — Danh mục: Hệ thống tài khoản (3 tables)
- 15 — Danh mục: Ngân hàng / Tiền tệ (9 tables)
- 16 — Danh mục: Kho / ĐVT / Nhân sự (7 tables)
- 17 — Danh mục: Công trình / Khoản mục / Khác (23 tables)
- 18 — Ngân sách / Vay / Công nợ (23 tables)
- 19 — TA Thuế (76 tables)
- 20 — SYS Hệ thống / cấu hình (75 tables)
- 21 — MSC Misc / Import / Report (45 tables)
- 22 — Hóa đơn điện tử (51 tables)
- 23 — Ngân hàng điện tử (12 tables)
- 24 — Báo cáo tài chính (35 tables)
- 25 — Mobile sync (10 tables)
- 26 — Số dư đầu kỳ (5 tables)
- 27 — Đồng bộ / Hệ thống phụ trợ (49 tables)
- 99 — Khác (chưa phân loại) (47 tables)

---

# 01 — CA Tiền mặt

## CAAudit

Rows: 0 | Columns: 22

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 3 | RefNo | nvarchar(20) |  |  |
| 4 | RefType | int | NN |  |
| 5 | RefDate | datetime |  |  |
| 6 | RefTime | datetime |  |  |
| 7 | JournalMemo | nvarchar(500) |  |  |
| 8 | AuditDate | datetime | NN |  |
| 9 | CurrencyID | nvarchar(3) |  | CCY.CurrencyID |
| 10 | TotalAuditAmount | decimal(18,4) | NN |  |
| 11 | TotalBalanceAmount | decimal(18,4) | NN |  |
| 12 | Reason | nvarchar(255) |  |  |
| 13 | Conclusion | nvarchar(255) |  |  |
| 14 | IsExecuted | bit | NN |  |
| 15 | DisplayOnBook | int | NN |  |
| 16 | EditVersion | timestamp |  |  |
| 17 | CreatedDate | datetime |  |  |
| 18 | CreatedBy | nvarchar(50) |  |  |
| 19 | ModifiedDate | datetime |  |  |
| 20 | ModifiedBy | nvarchar(50) |  |  |
| 21 | CAReceiptRefID | uniqueidentifier |  | CAReceipt.RefID |
| 22 | CAPaymentRefID | uniqueidentifier |  | CAPayment.RefID |

## CAAuditDetail

Rows: 0 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | CAAudit.RefID |
| 3 | Description | nvarchar(255) |  |  |
| 4 | ValueOfMoney | int | NN |  |
| 5 | Quantity | int | NN |  |
| 6 | Amount | decimal(18,4) | NN |  |
| 7 | SortOrder | int | NN |  |

## CAAuditMemberDetail

Rows: 0 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | CAAudit.RefID |
| 3 | AccountObjectName | nvarchar(400) |  |  |
| 4 | Position | nvarchar(128) |  |  |
| 5 | Representative | nvarchar(255) |  |  |
| 6 | SortOrder | int | NN |  |

## CABAReasonType

Rows: 18 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReasonTypeID | int | PK NN |  |
| 2 | RefType | int | NN |  |
| 3 | ReasonTypeName | nvarchar(255) |  |  |
| 4 | Description | nvarchar(255) |  |  |

## CACashbook

Rows: 2 | Columns: 26

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | CashBookID | uniqueidentifier | PK NN |  |
| 2 | CashBookPostedDate | datetime |  |  |
| 3 | IsPostedManagement | bit | NN |  |
| 4 | RefID | uniqueidentifier |  |  |
| 5 | RefType | int |  |  |
| 6 | RefTypeName | nvarchar(100) |  |  |
| 7 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 8 | RefDate | datetime |  |  |
| 9 | PostedDate | datetime |  |  |
| 10 | RefNo | nvarchar(20) |  |  |
| 11 | CurrencyID | nvarchar(3) |  |  |
| 12 | ExchangeRate | decimal(18,4) |  |  |
| 13 | JournalMemo | nvarchar(500) |  |  |
| 14 | ReceiptAmountOC | decimal(18,4) |  |  |
| 15 | ReceiptAmount | decimal(18,4) |  |  |
| 16 | PaymentAmountOC | decimal(18,4) |  |  |
| 17 | PaymentAmount | decimal(18,4) |  |  |
| 18 | ContactName | nvarchar(400) |  |  |
| 19 | Note | nvarchar(255) |  |  |
| 20 | CreatedDate | datetime |  |  |
| 21 | CreatedBy | nvarchar(50) |  |  |
| 22 | ModifiedDate | datetime |  |  |
| 23 | ModifiedBy | nvarchar(50) |  |  |
| 24 | CAType | int |  |  |
| 25 | SortOrder | int |  |  |
| 26 | EmployeeID | uniqueidentifier |  |  |

## CAPayment

Rows: 652 | Columns: 54

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefType | int | NN |  |
| 3 | RefDate | datetime | NN |  |
| 4 | PostedDate | datetime | NN |  |
| 5 | RefNoFinance | nvarchar(20) |  |  |
| 6 | RefNoManagement | nvarchar(20) |  |  |
| 7 | IsPostedFinance | bit | NN |  |
| 8 | IsPostedManagement | bit | NN |  |
| 9 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 10 | AccountObjectName | nvarchar(400) |  |  |
| 11 | AccountObjectAddress | nvarchar(400) |  |  |
| 12 | AccountObjectContactName | nvarchar(400) |  |  |
| 13 | ReasonTypeID | int |  |  |
| 14 | JournalMemo | nvarchar(500) |  |  |
| 15 | DocumentIncluded | nvarchar(255) |  |  |
| 16 | CurrencyID | nvarchar(3) |  | CCY.CurrencyID |
| 17 | ExchangeRate | decimal(18,4) |  |  |
| 18 | TotalAmountOC | decimal(18,4) | NN |  |
| 19 | TotalAmount | decimal(18,4) | NN |  |
| 20 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 21 | EmployeeID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 22 | EditVersion | timestamp |  |  |
| 23 | DisplayOnBook | int | NN |  |
| 24 | IsPostedCashBookFinance | bit |  |  |
| 25 | IsPostedCashBookManagement | bit |  |  |
| 26 | CashBookPostedDate | datetime |  |  |
| 27 | RefOrder | int | NN |  |
| 28 | CreatedDate | datetime |  |  |
| 29 | CreatedBy | nvarchar(50) |  |  |
| 30 | ModifiedDate | datetime |  |  |
| 31 | ModifiedBy | nvarchar(50) |  |  |
| 32 | CustomField1 | nvarchar(255) |  |  |
| 33 | CustomField2 | nvarchar(255) |  |  |
| 34 | CustomField3 | nvarchar(255) |  |  |
| 35 | CustomField4 | nvarchar(255) |  |  |
| 36 | CustomField5 | nvarchar(255) |  |  |
| 37 | CustomField6 | nvarchar(255) |  |  |
| 38 | CustomField7 | nvarchar(255) |  |  |
| 39 | CustomField8 | nvarchar(255) |  |  |
| 40 | CustomField9 | nvarchar(255) |  |  |
| 41 | CustomField10 | nvarchar(255) |  |  |
| 42 | IsImportVAT | bit | NN |  |
| 43 | IsSpecialVAT | bit | NN |  |
| 44 | IsEnvironmentVAT | bit | NN |  |
| 45 | IsVAT | bit | NN |  |
| 47 | GLVoucherRefID | uniqueidentifier |  | GLVoucher.RefID |
| 48 | RefNoMshop | nvarchar(MAX) |  |  |
| 49 | RefIDMshop | nvarchar(MAX) |  |  |
| 50 | TaxYear | int |  |  |
| 51 | TransactionID | nvarchar(100) |  |  |
| 52 | EInvoiceType | int |  |  |
| 53 | IsImportEInvoice | bit | NN |  |
| 54 | IsCreateFromEBHistory | bit |  |  |
| 55 | IsAntiDumpingVAT | bit | NN |  |

## CAPaymentDetail

Rows: 1,583 | Columns: 42

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | CAPayment.RefID |
| 3 | Description | nvarchar(255) |  |  |
| 4 | DebitAccount | nvarchar(20) |  | Account.AccountNumber |
| 5 | CreditAccount | nvarchar(20) |  | Account.AccountNumber |
| 6 | BankAccountID | uniqueidentifier |  | BankAccount.BankAccountID |
| 7 | AmountOC | decimal(18,4) | NN |  |
| 8 | Amount | decimal(18,4) | NN |  |
| 9 | BudgetItemID | uniqueidentifier |  | BudgetItem.BudgetItemID |
| 10 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 11 | ProjectWorkID | uniqueidentifier |  | ProjectWork.ProjectWorkID |
| 12 | JobID | uniqueidentifier |  | Job.JobID |
| 13 | OrderID | uniqueidentifier |  | SAOrder.RefID |
| 14 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 15 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 16 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 17 | ListItemID | uniqueidentifier |  | ListItem.ListItemID |
| 18 | DebtAgreementID | uniqueidentifier |  | DebtAgreement.DebtAgreementID |
| 19 | UnResonableCost | bit | NN |  |
| 20 | SortOrder | int |  |  |
| 21 | CustomField1 | nvarchar(255) |  |  |
| 22 | CustomField2 | nvarchar(255) |  |  |
| 23 | CustomField3 | nvarchar(255) |  |  |
| 24 | CustomField4 | nvarchar(255) |  |  |
| 25 | CustomField5 | nvarchar(255) |  |  |
| 26 | CustomField6 | nvarchar(255) |  |  |
| 27 | CustomField7 | nvarchar(255) |  |  |
| 28 | CustomField8 | nvarchar(255) |  |  |
| 29 | CustomField9 | nvarchar(255) |  |  |
| 30 | CustomField10 | nvarchar(255) |  |  |
| 31 | PUContractID | uniqueidentifier |  | PUContract.PUContractID |
| 33 | CashOutAmountFinance | decimal(18,4) | NN |  |
| 34 | CashOutDiffAmountFinance | decimal(18,4) | NN |  |
| 35 | CashOutDiffAccountNumberFinance | nvarchar(20) |  | Account.AccountNumber |
| 37 | CashOutAmountManagement | decimal(18,4) | NN |  |
| 38 | CashOutDiffAmountManagement | decimal(18,4) | NN |  |
| 39 | CashOutDiffAccountNumberManagement | nvarchar(20) |  | Account.AccountNumber |
| 40 | CashOutExchangeRateFinance | decimal(20,6) | NN |  |
| 41 | CashOutExchangeRateManagement | decimal(20,6) | NN |  |
| 42 | BusinessType | int |  |  |
| 43 | PUOrderRefID | uniqueidentifier |  | PUOrder.RefID |
| 44 | LOANAgreementID | uniqueidentifier |  | LOANAgreement.LOANAgreementID |

## CAPaymentDetailImportMultiTax

Rows: 0 | Columns: 54

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | CAPayment.RefID |
| 3 | VoucherRefID | uniqueidentifier |  |  |
| 4 | VoucherRefDate | datetime |  |  |
| 5 | VoucherPostedDate | datetime |  |  |
| 6 | VoucherRefNoFinance | nvarchar(20) |  |  |
| 7 | VoucherRefNoManagement | nvarchar(20) |  |  |
| 8 | VoucherRefType | int |  |  |
| 9 | SortOrder | int |  |  |
| 10 | VoucherRefDetailID | uniqueidentifier |  |  |
| 11 | InvNo | nvarchar(25) |  |  |
| 12 | Description | nvarchar(500) |  |  |
| 13 | TurnOverAmount | decimal(18,4) |  |  |
| 14 | InvTemplateNo | nvarchar(25) |  |  |
| 15 | InvDate | datetime |  |  |
| 16 | InvSeries | nvarchar(20) |  |  |
| 17 | AccountObjectID | uniqueidentifier |  |  |
| 18 | AccountObjectName | nvarchar(400) |  |  |
| 19 | AccountObjectAddress | nvarchar(400) |  |  |
| 20 | AccountObjectTaxCode | nvarchar(50) |  |  |
| 21 | PurchasePurposeID | uniqueidentifier |  |  |
| 22 | ImportRate | decimal(18,4) |  |  |
| 23 | ImportAmount | decimal(18,4) |  |  |
| 24 | ImportPayableAmount | decimal(18,4) | NN |  |
| 25 | ImportPaidAmount | decimal(18,4) | NN |  |
| 26 | ImportRemainningAmount | decimal(18,4) | NN |  |
| 27 | ImportAccount | nvarchar(20) |  | Account.AccountNumber |
| 28 | SpecialRate | decimal(18,4) |  |  |
| 29 | SpecialAmount | decimal(18,4) |  |  |
| 30 | SpecialPayableAmount | decimal(18,4) | NN |  |
| 31 | SpecialPaidAmount | decimal(18,4) | NN |  |
| 32 | SpecialRemainningAmount | decimal(18,4) | NN |  |
| 33 | SpecialAccount | nvarchar(20) |  | Account.AccountNumber |
| 34 | EnvironmentRate | decimal(18,4) |  |  |
| 35 | EnvironmentAmount | decimal(18,4) |  |  |
| 36 | EnvironmentPayableAmount | decimal(18,4) | NN |  |
| 37 | EnvironmentPaidAmount | decimal(18,4) | NN |  |
| 38 | EnvironmentRemainningAmount | decimal(18,4) | NN |  |
| 39 | EnvironmentAccount | nvarchar(20) |  | Account.AccountNumber |
| 40 | VATRate | decimal(18,4) |  |  |
| 41 | VATAmount | decimal(18,4) |  |  |
| 42 | VATPayableAmount | decimal(18,4) | NN |  |
| 43 | VATPaidAmount | decimal(18,4) | NN |  |
| 44 | VATRemainningAmount | decimal(18,4) | NN |  |
| 45 | VATAccount | nvarchar(20) |  | Account.AccountNumber |
| 46 | VATCorrespondingAccount | nvarchar(20) |  | Account.AccountNumber |
| 47 | VATDeductionAccount | nvarchar(20) |  | Account.AccountNumber |
| 48 | InvestmentProjectID | uniqueidentifier |  | InvestmentProject.InvestmentProjectID |
| 49 | AntiDumpingTaxRate | decimal(18,4) | NN |  |
| 50 | AntiDumpingTaxAmount | decimal(18,4) | NN |  |
| 51 | AntiDumpingTaxPayableAmount | decimal(18,4) | NN |  |
| 52 | AntiDumpingTaxPaidAmount | decimal(18,4) | NN |  |
| 53 | AntiDumpingTaxRemainningAmount | decimal(18,4) | NN |  |
| 54 | AntiDumpingTaxAccount | nvarchar(20) |  | Account.AccountNumber |

## CAPaymentDetailImportVAT

Rows: 0 | Columns: 31

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | CAPayment.RefID |
| 3 | VoucherRefID | uniqueidentifier |  |  |
| 4 | VoucherRefDate | datetime |  |  |
| 5 | VoucherPostedDate | datetime |  |  |
| 6 | VoucherRefNoFinance | nvarchar(20) |  |  |
| 7 | VoucherRefNoManagement | nvarchar(20) |  |  |
| 8 | VoucherRefType | int |  |  |
| 9 | DebitAccount | nvarchar(20) |  | Account.AccountNumber |
| 10 | CreditAccount | nvarchar(20) |  | Account.AccountNumber |
| 11 | DeductionDebitAccount | nvarchar(20) |  | Account.AccountNumber |
| 12 | PayableAmount | decimal(18,4) | NN |  |
| 13 | Amount | decimal(18,4) | NN |  |
| 14 | RemainningAmount | decimal(18,4) | NN |  |
| 15 | SortOrder | int |  |  |
| 16 | VoucherRefDetailID | uniqueidentifier |  |  |
| 17 | InvNo | nvarchar(25) |  |  |
| 18 | Description | nvarchar(500) |  |  |
| 19 | VATRate | decimal(18,4) |  |  |
| 20 | VATAmount | decimal(18,4) |  |  |
| 21 | VATAmountOC | decimal(18,4) |  |  |
| 22 | TurnOverAmount | decimal(18,4) |  |  |
| 23 | InvTemplateNo | nvarchar(25) |  |  |
| 24 | InvDate | datetime |  |  |
| 25 | InvSeries | nvarchar(20) |  |  |
| 26 | AccountObjectID | uniqueidentifier |  |  |
| 27 | AccountObjectName | nvarchar(400) |  |  |
| 28 | AccountObjectAddress | nvarchar(400) |  |  |
| 29 | AccountObjectTaxCode | nvarchar(50) |  |  |
| 30 | PurchasePurposeID | uniqueidentifier |  |  |
| 31 | InvestmentProjectID | uniqueidentifier |  | InvestmentProject.InvestmentProjectID |

## CAPaymentDetailPersonalIncomeTax

Rows: 0 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | CAPayment.RefID |
| 3 | EmployeeID | uniqueidentifier | NN |  |
| 4 | OrganizationUnitID | uniqueidentifier | NN | OrganizationUnit.OrganizationUnitID |
| 5 | PayableAmount | decimal(18,4) | NN |  |
| 6 | Amount | decimal(18,4) | NN |  |
| 7 | SortOrder | int |  |  |

## CAPaymentDetailSalary

Rows: 0 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | CAPayment.RefID |
| 3 | EmployeeID | uniqueidentifier | NN | AccountObject.AccountObjectID |
| 4 | OrganizationUnitID | uniqueidentifier | NN | OrganizationUnit.OrganizationUnitID |
| 5 | PayableAmount | decimal(18,4) | NN |  |
| 6 | Amount | decimal(18,4) | NN |  |
| 7 | SortOrder | int | NN |  |

## CAPaymentDetailTax

Rows: 1,044 | Columns: 20

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | CAPayment.RefID |
| 3 | Description | nvarchar(255) |  |  |
| 4 | VATAccount | nvarchar(20) |  | Account.AccountNumber |
| 5 | VATAmount | decimal(18,4) | NN |  |
| 6 | VATRate | decimal(8,4) |  |  |
| 7 | TurnoverAmount | decimal(18,4) | NN |  |
| 8 | InvDate | datetime |  |  |
| 9 | InvSeries | nvarchar(20) |  |  |
| 10 | InvNo | nvarchar(25) |  |  |
| 11 | InvTemplateNo | nvarchar(25) |  |  |
| 12 | PurchasePurposeID | uniqueidentifier |  | PurchasePurpose.PurchasePurposeID |
| 13 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 14 | AccountObjectName | nvarchar(400) |  |  |
| 15 | AccountObjectAddress | nvarchar(400) |  |  |
| 16 | AccountObjectTaxCode | nvarchar(50) |  |  |
| 17 | SortOrder | int |  |  |
| 18 | Sign | smallint |  |  |
| 19 | InvestmentProjectID | uniqueidentifier |  | InvestmentProject.InvestmentProjectID |
| 22 | VATRateOther | decimal(18,4) |  |  |

## CAReceipt

Rows: 252 | Columns: 45

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefType | int | NN |  |
| 3 | RefDate | datetime | NN |  |
| 4 | PostedDate | datetime | NN |  |
| 5 | RefNoFinance | nvarchar(20) |  |  |
| 6 | RefNoManagement | nvarchar(20) |  |  |
| 7 | IsPostedFinance | bit | NN |  |
| 8 | IsPostedManagement | bit | NN |  |
| 9 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 10 | AccountObjectName | nvarchar(400) |  |  |
| 11 | AccountObjectAddress | nvarchar(400) |  |  |
| 12 | AccountObjectContactName | nvarchar(400) |  |  |
| 13 | ReasonTypeID | int |  |  |
| 14 | JournalMemo | nvarchar(500) |  |  |
| 15 | DocumentIncluded | nvarchar(255) |  |  |
| 16 | CurrencyID | nvarchar(3) |  | CCY.CurrencyID |
| 17 | ExchangeRate | decimal(18,4) |  |  |
| 18 | TotalAmountOC | decimal(18,4) | NN |  |
| 19 | TotalAmount | decimal(18,4) | NN |  |
| 20 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 21 | EmployeeID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 22 | DisplayOnBook | int | NN |  |
| 23 | IsPostedCashBookFinance | bit |  |  |
| 24 | IsPostedCashBookManagement | bit |  |  |
| 25 | CashBookPostedDate | datetime |  |  |
| 26 | EditVersion | timestamp |  |  |
| 27 | RefOrder | int | NN |  |
| 28 | CreatedDate | datetime |  |  |
| 29 | CreatedBy | nvarchar(50) |  |  |
| 30 | ModifiedDate | datetime |  |  |
| 31 | ModifiedBy | nvarchar(50) |  |  |
| 32 | CustomField1 | nvarchar(255) |  |  |
| 33 | CustomField2 | nvarchar(255) |  |  |
| 34 | CustomField3 | nvarchar(255) |  |  |
| 35 | CustomField4 | nvarchar(255) |  |  |
| 36 | CustomField5 | nvarchar(255) |  |  |
| 37 | CustomField6 | nvarchar(255) |  |  |
| 38 | CustomField7 | nvarchar(255) |  |  |
| 39 | CustomField8 | nvarchar(255) |  |  |
| 40 | CustomField9 | nvarchar(255) |  |  |
| 41 | CustomField10 | nvarchar(255) |  |  |
| 42 | GLVoucherRefID | uniqueidentifier |  | GLVoucher.RefID |
| 43 | RefNoMshop | nvarchar(MAX) |  |  |
| 44 | RefIDMshop | nvarchar(MAX) |  |  |
| 45 | IsCreateFromEBHistory | bit |  |  |

## CAReceiptDetail

Rows: 8,573 | Columns: 42

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | CAReceipt.RefID |
| 3 | Description | nvarchar(255) |  |  |
| 4 | DebitAccount | nvarchar(20) |  | Account.AccountNumber |
| 5 | CreditAccount | nvarchar(20) |  | Account.AccountNumber |
| 6 | BankAccountID | uniqueidentifier |  | BankAccount.BankAccountID |
| 7 | AmountOC | decimal(18,4) | NN |  |
| 8 | Amount | decimal(18,4) | NN |  |
| 9 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 10 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 11 | ListItemID | uniqueidentifier |  | ListItem.ListItemID |
| 12 | BudgetItemID | uniqueidentifier |  | BudgetItem.BudgetItemID |
| 13 | OrderID | uniqueidentifier |  | SAOrder.RefID |
| 14 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 15 | ProjectWorkID | uniqueidentifier |  | ProjectWork.ProjectWorkID |
| 16 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 17 | DebtAgreementID | uniqueidentifier |  | DebtAgreement.DebtAgreementID |
| 18 | SortOrder | int |  |  |
| 19 | CustomField1 | nvarchar(255) |  |  |
| 20 | CustomField2 | nvarchar(255) |  |  |
| 21 | CustomField3 | nvarchar(255) |  |  |
| 22 | CustomField4 | nvarchar(255) |  |  |
| 23 | CustomField5 | nvarchar(255) |  |  |
| 24 | CustomField6 | nvarchar(255) |  |  |
| 25 | CustomField7 | nvarchar(255) |  |  |
| 26 | CustomField8 | nvarchar(255) |  |  |
| 27 | CustomField9 | nvarchar(255) |  |  |
| 28 | CustomField10 | nvarchar(255) |  |  |
| 29 | PUContractID | uniqueidentifier |  | PUContract.PUContractID |
| 30 | JobID | uniqueidentifier |  | Job.JobID |
| 31 | UnResonableCost | bit | NN |  |
| 33 | CashOutAmountFinance | decimal(18,4) | NN |  |
| 34 | CashOutDiffAmountFinance | decimal(18,4) | NN |  |
| 35 | CashOutDiffAccountNumberFinance | nvarchar(20) |  | Account.AccountNumber |
| 37 | CashOutAmountManagement | decimal(18,4) | NN |  |
| 38 | CashOutDiffAmountManagement | decimal(18,4) | NN |  |
| 39 | CashOutDiffAccountNumberManagement | nvarchar(20) |  | Account.AccountNumber |
| 40 | CashOutExchangeRateFinance | decimal(20,6) | NN |  |
| 41 | CashOutExchangeRateManagement | decimal(20,6) | NN |  |
| 42 | BusinessType | int |  |  |
| 43 | PUOrderRefID | uniqueidentifier |  | PUOrder.RefID |
| 44 | LOANAgreementID | uniqueidentifier |  | LOANAgreement.LOANAgreementID |

## CAReceiptPaymentList

Rows: 904 | Columns: 111

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | CABARefDate | datetime |  |  |
| 3 | CARefDate | datetime |  |  |
| 4 | RefDate | datetime |  |  |
| 5 | CABAPostedDate | datetime |  |  |
| 6 | CAPostedDate | datetime |  |  |
| 7 | PostedDate | datetime |  |  |
| 8 | Reftype | int |  |  |
| 9 | RefNoFinance | nvarchar(20) |  |  |
| 10 | RefNoManagement | nvarchar(20) |  |  |
| 11 | CABARefNoManagement | nvarchar(20) |  |  |
| 12 | CARefNoFinance | nvarchar(20) |  |  |
| 13 | IsValueDecrementFromStock | bit |  |  |
| 14 | CABARefNoFinance | nvarchar(20) |  |  |
| 15 | CARefNoManagement | nvarchar(20) |  |  |
| 16 | IsFreightService | bit |  |  |
| 17 | IsPostedFinance | bit |  |  |
| 18 | IsPostedManagement | bit |  |  |
| 19 | ReasonTypeID | int |  |  |
| 20 | IncludeInvoice | int |  |  |
| 21 | SAInvoiceRefID | uniqueidentifier |  |  |
| 22 | PUInvoiceRefID | uniqueidentifier |  |  |
| 23 | AccountObjectID | uniqueidentifier |  |  |
| 24 | AccountObjectName | nvarchar(400) |  |  |
| 25 | AccountObjectAddress | nvarchar(400) |  |  |
| 26 | ReceiverAddress | nvarchar(255) |  |  |
| 27 | AccountObjectBankAccount | nvarchar(50) |  |  |
| 28 | AccountObjectBankName | nvarchar(255) |  |  |
| 29 | BranchID | uniqueidentifier |  |  |
| 30 | OutDocumentIncluded | nvarchar(255) |  |  |
| 31 | AccountObjectContactName | nvarchar(400) |  |  |
| 32 | Payer | nvarchar(400) |  |  |
| 33 | SupplierID | uniqueidentifier |  |  |
| 34 | IdentificationNumber | nvarchar(20) |  |  |
| 35 | PayerAddress | nvarchar(255) |  |  |
| 36 | SupplierName | nvarchar(400) |  |  |
| 37 | IsOutwardExported | bit |  |  |
| 38 | IssueDate | datetime |  |  |
| 39 | PayReason | nvarchar(500) |  |  |
| 40 | CADocumentIncluded | nvarchar(255) |  |  |
| 41 | IssueBy | nvarchar(120) |  |  |
| 42 | DueDay | int |  |  |
| 43 | IsInvoiceExported | bit |  |  |
| 44 | Receiver | nvarchar(400) |  |  |
| 45 | DueDate | datetime |  |  |
| 46 | JournalMemo | nvarchar(500) |  |  |
| 47 | DocumentIncluded | nvarchar(255) |  |  |
| 48 | EmployeeID | uniqueidentifier |  |  |
| 49 | CABAJournalMemo | nvarchar(500) |  |  |
| 50 | TotalSaleAmountOC | decimal(18,4) |  |  |
| 51 | CABADocumentIncluded | nvarchar(255) |  |  |
| 52 | TotalSaleAmount | decimal(18,4) |  |  |
| 53 | BankAccountID | uniqueidentifier |  |  |
| 54 | BankName | nvarchar(255) |  |  |
| 55 | PaymentTermID | uniqueidentifier |  |  |
| 56 | DueTime | int |  |  |
| 57 | PaymentDate | datetime |  |  |
| 58 | CurrencyID | nvarchar(3) |  |  |
| 59 | ExchangeRate | decimal(18,4) |  |  |
| 60 | TotalExportTaxAmountOC | decimal(18,4) |  |  |
| 61 | TotalAmountOC | decimal(18,4) |  |  |
| 62 | TotalExportTaxAmount | decimal(18,4) |  |  |
| 63 | TotalAmount | decimal(18,4) |  |  |
| 64 | TotalImportTaxAmountOC | decimal(18,4) |  |  |
| 65 | TotalImportTaxAmount | decimal(18,4) |  |  |
| 66 | DebtStatus | int |  |  |
| 67 | TotalVATAmountOC | decimal(18,4) |  |  |
| 68 | TotalVATAmount | decimal(18,4) |  |  |
| 69 | TotalDiscountAmountOC | decimal(18,4) |  |  |
| 70 | TotalDiscountAmount | decimal(18,4) |  |  |
| 71 | TotalFreightAmount | decimal(18,4) |  |  |
| 72 | TotalInwardAmount | decimal(18,4) |  |  |
| 73 | TotalSpecialConsumeTaxAmountOC | decimal(18,4) |  |  |
| 74 | TotalSpecialConsumeTaxAmount | decimal(18,4) |  |  |
| 75 | TotalCustomBeforeAmount | decimal(18,4) |  |  |
| 76 | DisplayOnBook | int |  |  |
| 77 | IsPaid | bit |  |  |
| 78 | IsPostedCashBookFinance | bit |  |  |
| 79 | IsPostedCashBookManagement | bit |  |  |
| 80 | CashBookPostedDate | datetime |  |  |
| 81 | IsPostedInventoryBookFinance | bit |  |  |
| 82 | IsPostedInventoryBookManagement | bit |  |  |
| 83 | InventoryPostedDate | datetime |  |  |
| 84 | RefOrder | int |  |  |
| 85 | CreatedDate | datetime |  |  |
| 86 | CreatedBy | nvarchar(50) |  |  |
| 87 | ModifiedDate | datetime |  |  |
| 88 | ModifiedBy | nvarchar(50) |  |  |
| 89 | CustomField1 | nvarchar(255) |  |  |
| 90 | CustomField2 | nvarchar(255) |  |  |
| 91 | CustomField3 | nvarchar(255) |  |  |
| 92 | CustomField4 | nvarchar(255) |  |  |
| 93 | CustomField5 | nvarchar(255) |  |  |
| 94 | CustomField6 | nvarchar(255) |  |  |
| 95 | CustomField7 | nvarchar(255) |  |  |
| 96 | CustomField8 | nvarchar(255) |  |  |
| 97 | CustomField9 | nvarchar(255) |  |  |
| 98 | CustomField10 | nvarchar(255) |  |  |
| 99 | CAType | int |  |  |
| 100 | ListTableName | nvarchar(100) |  |  |
| 101 | RefTypeName | nvarchar(100) |  |  |
| 102 | CAJournalMemo | nvarchar(500) |  |  |
| 103 | CABAAmountOC | decimal(18,4) |  |  |
| 104 | CABAAmount | decimal(18,4) |  |  |
| 105 | InvNo | nvarchar(500) |  |  |
| 106 | InvDate | datetime |  |  |
| 107 | InvSeries | nvarchar(20) |  |  |
| 108 | INRefOrder | datetime |  |  |
| 109 | RefNoMshop | nvarchar(MAX) |  |  |
| 110 | RefIDMshop | nvarchar(MAX) |  |  |
| 111 | IsCreateFromEBHistory | bit |  |  |

# 02 — BA Ngân hàng

## BADeposit

Rows: 18,180 | Columns: 42

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefType | int | NN |  |
| 3 | RefDate | datetime | NN |  |
| 4 | PostedDate | datetime | NN |  |
| 5 | RefNoFinance | nvarchar(20) |  |  |
| 6 | RefNoManagement | nvarchar(20) |  |  |
| 7 | IsPostedFinance | bit | NN |  |
| 8 | IsPostedManagement | bit | NN |  |
| 9 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 10 | AccountObjectName | nvarchar(400) |  |  |
| 11 | AccountObjectAddress | nvarchar(400) |  |  |
| 12 | BankAccountID | uniqueidentifier |  | BankAccount.BankAccountID |
| 13 | BankName | nvarchar(255) |  |  |
| 14 | ReasonTypeID | int |  |  |
| 15 | JournalMemo | nvarchar(500) |  |  |
| 16 | CurrencyID | nvarchar(3) |  | CCY.CurrencyID |
| 17 | ExchangeRate | decimal(18,4) |  |  |
| 18 | TotalAmountOC | decimal(18,4) | NN |  |
| 19 | TotalAmount | decimal(18,4) | NN |  |
| 20 | EmployeeID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 21 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 22 | DisplayOnBook | int |  |  |
| 23 | EditVersion | timestamp |  |  |
| 24 | RefOrder | int | NN |  |
| 25 | CreatedDate | datetime |  |  |
| 26 | CreatedBy | nvarchar(50) |  |  |
| 27 | ModifiedDate | datetime |  |  |
| 28 | ModifiedBy | nvarchar(50) |  |  |
| 29 | CustomField1 | nvarchar(255) |  |  |
| 30 | CustomField2 | nvarchar(255) |  |  |
| 31 | CustomField3 | nvarchar(255) |  |  |
| 32 | CustomField4 | nvarchar(255) |  |  |
| 33 | CustomField5 | nvarchar(255) |  |  |
| 34 | CustomField6 | nvarchar(255) |  |  |
| 35 | CustomField7 | nvarchar(255) |  |  |
| 36 | CustomField8 | nvarchar(255) |  |  |
| 37 | CustomField9 | nvarchar(255) |  |  |
| 38 | CustomField10 | nvarchar(255) |  |  |
| 39 | IsCreateFromEBHistory | bit |  |  |
| 40 | RefNoMshop | nvarchar(MAX) |  |  |
| 41 | RefIDMshop | nvarchar(MAX) |  |  |
| 42 | GLVoucherRefID | uniqueidentifier |  |  |

## BADepositDetail

Rows: 18,663 | Columns: 33

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | BADeposit.RefID |
| 3 | Description | nvarchar(255) |  |  |
| 4 | DebitAccount | nvarchar(20) |  | Account.AccountNumber |
| 5 | CreditAccount | nvarchar(20) |  | Account.AccountNumber |
| 6 | AmountOC | decimal(18,4) | NN |  |
| 7 | Amount | decimal(18,4) | NN |  |
| 8 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 9 | ListItemID | uniqueidentifier |  | ListItem.ListItemID |
| 10 | BudgetItemID | uniqueidentifier |  | BudgetItem.BudgetItemID |
| 11 | OrderID | uniqueidentifier |  |  |
| 12 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 13 | ProjectWorkID | uniqueidentifier |  | ProjectWork.ProjectWorkID |
| 14 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 15 | DebtAgreementID | uniqueidentifier |  | DebtAgreement.DebtAgreementID |
| 16 | SortOrder | int |  |  |
| 17 | CustomField1 | nvarchar(255) |  |  |
| 18 | CustomField2 | nvarchar(255) |  |  |
| 19 | CustomField3 | nvarchar(255) |  |  |
| 20 | CustomField4 | nvarchar(255) |  |  |
| 21 | CustomField5 | nvarchar(255) |  |  |
| 22 | CustomField6 | nvarchar(255) |  |  |
| 23 | CustomField7 | nvarchar(255) |  |  |
| 24 | CustomField8 | nvarchar(255) |  |  |
| 25 | CustomField9 | nvarchar(255) |  |  |
| 26 | CustomField10 | nvarchar(255) |  |  |
| 27 | PUContractID | uniqueidentifier |  | PUContract.PUContractID |
| 28 | JobID | uniqueidentifier |  | Job.JobID |
| 29 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 30 | UnResonableCost | bit | NN |  |
| 31 | BusinessType | int |  |  |
| 32 | PUOrderRefID | uniqueidentifier |  | PUOrder.RefID |
| 33 | LOANAgreementID | uniqueidentifier |  | LOANAgreement.LOANAgreementID |

## BADepositWithdrawList

Rows: 19,555 | Columns: 104

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | PostedDate | datetime |  |  |
| 3 | RefDate | datetime |  |  |
| 4 | CABARefDate | datetime |  |  |
| 5 | CABAPostedDate | datetime |  |  |
| 6 | RefType | int |  |  |
| 7 | RefNoFinance | nvarchar(20) |  |  |
| 8 | RefNoManagement | nvarchar(20) |  |  |
| 9 | CABARefNoManagement | nvarchar(20) |  |  |
| 10 | CABARefNoFinance | nvarchar(20) |  |  |
| 11 | FromBankAccountID | uniqueidentifier |  |  |
| 12 | FromBankAccountName | nvarchar(255) |  |  |
| 13 | IsFreightService | bit |  |  |
| 14 | IsPostedFinance | bit |  |  |
| 15 | IsPostedManagement | bit |  |  |
| 16 | ToBankAccountID | uniqueidentifier |  |  |
| 17 | IncludeInvoice | int |  |  |
| 18 | ReasonTypeID | int |  |  |
| 19 | ToBankAccountName | nvarchar(255) |  |  |
| 20 | PUInvoiceRefID | uniqueidentifier |  |  |
| 21 | AccountObjectID | uniqueidentifier |  |  |
| 22 | AccountObjectName | nvarchar(400) |  |  |
| 23 | AccountObjectAddress | nvarchar(400) |  |  |
| 24 | AccountObjectBankAccount | nvarchar(50) |  |  |
| 25 | AccountObjectContactIDNumber | nvarchar(20) |  |  |
| 26 | AccountObjectBankName | nvarchar(255) |  |  |
| 27 | AccountObjectContactIssueDate | datetime |  |  |
| 28 | AccountObjectContactIssueBy | nvarchar(120) |  |  |
| 29 | AccountObjectContactName | nvarchar(400) |  |  |
| 30 | IdentificationNumber | nvarchar(20) |  |  |
| 31 | IssueDate | datetime |  |  |
| 32 | IssueBy | nvarchar(120) |  |  |
| 33 | Receiver | nvarchar(400) |  |  |
| 34 | BranchID | uniqueidentifier |  |  |
| 35 | JournalMemo | nvarchar(500) |  |  |
| 36 | EmployeeID | uniqueidentifier |  |  |
| 37 | DocumentIncluded | nvarchar(255) |  |  |
| 38 | CABAJournalMemo | nvarchar(500) |  |  |
| 39 | CABADocumentIncluded | nvarchar(255) |  |  |
| 40 | BankAccountID | uniqueidentifier |  |  |
| 41 | BankName | nvarchar(255) |  |  |
| 42 | PaymentTermID | uniqueidentifier |  |  |
| 43 | DueTime | int |  |  |
| 44 | PaymentDate | datetime |  |  |
| 45 | CurrencyID | nvarchar(3) |  |  |
| 46 | ExchangeRate | decimal(18,4) |  |  |
| 47 | TotalAmountOC | decimal(18,4) |  |  |
| 48 | TotalAmount | decimal(18,4) |  |  |
| 49 | TotalImportTaxAmountOC | decimal(18,4) |  |  |
| 50 | TotalImportTaxAmount | decimal(18,4) |  |  |
| 51 | TotalVATAmountOC | decimal(18,4) |  |  |
| 52 | TotalVATAmount | decimal(18,4) |  |  |
| 53 | TotalDiscountAmountOC | decimal(18,4) |  |  |
| 54 | TotalDiscountAmount | decimal(18,4) |  |  |
| 55 | TotalFreightAmount | decimal(18,4) |  |  |
| 56 | TotalInwardAmount | decimal(18,4) |  |  |
| 57 | TotalSpecialConsumeTaxAmountOC | decimal(18,4) |  |  |
| 58 | TotalSpecialConsumeTaxAmount | decimal(18,4) |  |  |
| 59 | TotalCustomBeforeAmount | decimal(18,4) |  |  |
| 60 | DisplayOnBook | int |  |  |
| 61 | IsPaid | bit |  |  |
| 62 | IsPostedCashBookFinance | bit |  |  |
| 63 | IsPostedCashBookManagement | bit |  |  |
| 64 | CashBookPostedDate | datetime |  |  |
| 65 | IsPostedInventoryBookFinance | bit |  |  |
| 66 | IsPostedInventoryBookManagement | bit |  |  |
| 67 | InventoryPostedDate | datetime |  |  |
| 68 | RefOrder | int |  |  |
| 69 | CreatedDate | datetime |  |  |
| 70 | CreatedBy | nvarchar(50) |  |  |
| 71 | ModifiedDate | datetime |  |  |
| 72 | ModifiedBy | nvarchar(50) |  |  |
| 73 | CustomField1 | nvarchar(255) |  |  |
| 74 | CustomField2 | nvarchar(255) |  |  |
| 75 | CustomField3 | nvarchar(255) |  |  |
| 76 | CustomField4 | nvarchar(255) |  |  |
| 77 | CustomField5 | nvarchar(255) |  |  |
| 78 | CustomField6 | nvarchar(255) |  |  |
| 79 | CustomField7 | nvarchar(255) |  |  |
| 80 | CustomField8 | nvarchar(255) |  |  |
| 81 | CustomField9 | nvarchar(255) |  |  |
| 82 | CustomField10 | nvarchar(255) |  |  |
| 83 | BAType | int |  |  |
| 84 | ListTableName | nvarchar(100) |  |  |
| 85 | RefTypeName | nvarchar(100) |  |  |
| 86 | CABAAmountOC | decimal(18,4) |  |  |
| 87 | CABAAmount | decimal(18,4) |  |  |
| 88 | InvNo | nvarchar(500) |  |  |
| 89 | IsInvoiceExported | bit |  |  |
| 90 | Payer | nvarchar(400) |  |  |
| 91 | SupplierID | uniqueidentifier |  |  |
| 92 | SupplierName | nvarchar(400) |  |  |
| 93 | IsOutwardExported | int |  |  |
| 94 | DueDay | int |  |  |
| 95 | DueDate | datetime |  |  |
| 96 | TotalSaleAmountOC | decimal(18,4) |  |  |
| 97 | TotalSaleAmount | decimal(18,4) |  |  |
| 98 | TotalExportTaxAmountOC | decimal(18,4) |  |  |
| 99 | TotalExportTaxAmount | decimal(18,4) |  |  |
| 100 | DebtStatus | int |  |  |
| 101 | INRefOrder | datetime |  |  |
| 102 | IsCreateFromEBHistory | bit |  |  |
| 103 | RefNoMshop | nvarchar(MAX) |  |  |
| 104 | RefIDMshop | nvarchar(MAX) |  |  |

## BAInternalTransfer

Rows: 69 | Columns: 36

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefType | int | NN |  |
| 3 | PostedDate | datetime | NN |  |
| 4 | RefDate | datetime | NN |  |
| 5 | RefNoFinance | nvarchar(20) |  |  |
| 6 | RefNoManagement | nvarchar(20) |  |  |
| 7 | IsPostedFinance | bit | NN |  |
| 8 | IsPostedManagement | bit | NN |  |
| 9 | JournalMemo | nvarchar(500) |  |  |
| 10 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 11 | FromBankAccountID | uniqueidentifier |  | BankAccount.BankAccountID |
| 12 | FromBankAccountName | nvarchar(128) |  |  |
| 13 | ToBankAccountID | uniqueidentifier |  | BankAccount.BankAccountID |
| 14 | ToBankAccountName | nvarchar(128) |  |  |
| 15 | CurrencyID | nvarchar(3) |  | CCY.CurrencyID |
| 16 | ExchangeRate | decimal(18,4) | NN |  |
| 17 | TotalAmountOC | decimal(18,4) | NN |  |
| 18 | TotalAmount | decimal(18,4) | NN |  |
| 19 | DisplayOnBook | int | NN |  |
| 20 | EditVersion | timestamp |  |  |
| 21 | RefOrder | int | NN |  |
| 22 | CreatedDate | datetime |  |  |
| 23 | CreatedBy | nvarchar(50) |  |  |
| 24 | ModifiedDate | datetime |  |  |
| 25 | ModifiedBy | nvarchar(50) |  |  |
| 26 | CustomField1 | nvarchar(255) |  |  |
| 27 | CustomField2 | nvarchar(255) |  |  |
| 28 | CustomField3 | nvarchar(255) |  |  |
| 29 | CustomField4 | nvarchar(255) |  |  |
| 30 | CustomField5 | nvarchar(255) |  |  |
| 31 | CustomField6 | nvarchar(255) |  |  |
| 32 | CustomField7 | nvarchar(255) |  |  |
| 33 | CustomField8 | nvarchar(255) |  |  |
| 34 | CustomField9 | nvarchar(255) |  |  |
| 35 | CustomField10 | nvarchar(255) |  |  |
| 36 | IsCreateFromEBHistory | bit |  |  |

## BAInternalTransferDetail

Rows: 94 | Columns: 38

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | BAInternalTransfer.RefID |
| 3 | Description | nvarchar(255) |  |  |
| 4 | DebitAccount | nvarchar(20) |  | Account.AccountNumber |
| 5 | CreditAccount | nvarchar(20) |  | Account.AccountNumber |
| 6 | AmountOC | decimal(18,4) | NN |  |
| 7 | Amount | decimal(18,4) | NN |  |
| 8 | ListItemID | uniqueidentifier |  | ListItem.ListItemID |
| 9 | SortOrder | int |  |  |
| 10 | CustomField1 | nvarchar(255) |  |  |
| 11 | CustomField2 | nvarchar(255) |  |  |
| 12 | CustomField3 | nvarchar(255) |  |  |
| 13 | CustomField4 | nvarchar(255) |  |  |
| 14 | CustomField5 | nvarchar(255) |  |  |
| 15 | CustomField6 | nvarchar(255) |  |  |
| 16 | CustomField7 | nvarchar(255) |  |  |
| 17 | CustomField8 | nvarchar(255) |  |  |
| 18 | CustomField9 | nvarchar(255) |  |  |
| 19 | CustomField10 | nvarchar(255) |  |  |
| 20 | OrganizationUnitID | uniqueidentifier |  |  |
| 21 | OrderID | uniqueidentifier |  |  |
| 22 | PUContractID | uniqueidentifier |  | PUContract.PUContractID |
| 23 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 24 | JobID | uniqueidentifier |  |  |
| 25 | ProjectWorkID | uniqueidentifier |  |  |
| 26 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 27 | UnResonableCost | bit | NN |  |
| 29 | CashOutAmountFinance | decimal(18,4) | NN |  |
| 30 | CashOutDiffAmountFinance | decimal(18,4) | NN |  |
| 31 | CashOutDiffAccountNumberFinance | nvarchar(20) |  | Account.AccountNumber |
| 33 | CashOutAmountManagement | decimal(18,4) | NN |  |
| 34 | CashOutDiffAmountManagement | decimal(18,4) | NN |  |
| 35 | CashOutDiffAccountNumberManagement | nvarchar(20) |  | Account.AccountNumber |
| 36 | CashOutExchangeRateFinance | decimal(20,6) | NN |  |
| 37 | CashOutExchangeRateManagement | decimal(20,6) | NN |  |
| 38 | PUOrderRefID | uniqueidentifier |  | PUOrder.RefID |
| 39 | BudgetItemID | uniqueidentifier |  |  |
| 40 | LOANAgreementID | uniqueidentifier |  | LOANAgreement.LOANAgreementID |

## BAReconcile

Rows: 0 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | BankAccountID | uniqueidentifier | NN | BankAccount.BankAccountID |
| 3 | CurrencyID | nvarchar(3) |  | CCY.CurrencyID |
| 4 | ClosingAmounInBank | decimal(18,4) | NN |  |
| 5 | FromDate | datetime | NN |  |
| 6 | ToDate | datetime | NN |  |
| 7 | SortOrder | int | NN ID |  |
| 8 | IsTemporary | bit | NN |  |
| 9 | BranchID | uniqueidentifier |  |  |
| 10 | DisplayOnBook | int |  |  |

## BAReconcileTemporaryPaymentVoucher

Rows: 0 | Columns: 2

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | NN |  |
| 2 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |

## BAReconcileTemporaryReceiptVoucher

Rows: 0 | Columns: 2

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | NN |  |
| 2 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |

## BAWithDraw

Rows: 1,306 | Columns: 56

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefType | int | NN |  |
| 3 | RefDate | datetime | NN |  |
| 4 | PostedDate | datetime | NN |  |
| 5 | RefNoFinance | nvarchar(20) |  |  |
| 6 | RefNoManagement | nvarchar(20) |  |  |
| 7 | IsPostedFinance | bit | NN |  |
| 8 | IsPostedManagement | bit | NN |  |
| 9 | BankAccountID | uniqueidentifier |  | BankAccount.BankAccountID |
| 10 | BankName | nvarchar(255) |  |  |
| 11 | ReasonTypeID | int |  |  |
| 12 | JournalMemo | nvarchar(500) |  |  |
| 13 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 14 | AccountObjectName | nvarchar(400) |  |  |
| 15 | AccountObjectAddress | nvarchar(400) |  |  |
| 16 | AccountObjectBankAccount | nvarchar(50) |  |  |
| 17 | AccountObjectBankName | nvarchar(128) |  |  |
| 18 | AccountObjectContactName | nvarchar(400) |  |  |
| 19 | AccountObjectContactIDNumber | nvarchar(20) |  |  |
| 20 | AccountObjectContactIssueDate | datetime |  |  |
| 21 | AccountObjectContactIssueBy | nvarchar(120) |  |  |
| 22 | CurrencyID | nvarchar(3) |  | CCY.CurrencyID |
| 23 | ExchangeRate | decimal(18,4) |  |  |
| 24 | TotalAmountOC | decimal(18,4) | NN |  |
| 25 | TotalAmount | decimal(18,4) | NN |  |
| 26 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 27 | DisplayOnBook | int |  |  |
| 28 | EditVersion | timestamp |  |  |
| 29 | RefOrder | int | NN |  |
| 30 | CreatedDate | datetime |  |  |
| 31 | CreatedBy | nvarchar(50) |  |  |
| 32 | ModifiedDate | datetime |  |  |
| 33 | ModifiedBy | nvarchar(50) |  |  |
| 34 | CustomField1 | nvarchar(255) |  |  |
| 35 | CustomField2 | nvarchar(255) |  |  |
| 36 | CustomField3 | nvarchar(255) |  |  |
| 37 | CustomField4 | nvarchar(255) |  |  |
| 38 | CustomField5 | nvarchar(255) |  |  |
| 39 | CustomField6 | nvarchar(255) |  |  |
| 40 | CustomField7 | nvarchar(255) |  |  |
| 41 | CustomField8 | nvarchar(255) |  |  |
| 42 | CustomField9 | nvarchar(255) |  |  |
| 43 | CustomField10 | nvarchar(255) |  |  |
| 44 | EmployeeID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 45 | IsImportVAT | bit | NN |  |
| 46 | IsSpecialVAT | bit | NN |  |
| 47 | IsEnvironmentVAT | bit | NN |  |
| 48 | IsVAT | bit | NN |  |
| 50 | IsCreateFromEBHistory | bit |  |  |
| 51 | RefNoMshop | nvarchar(MAX) |  |  |
| 52 | RefIDMshop | nvarchar(MAX) |  |  |
| 53 | TaxYear | int |  |  |
| 54 | TransactionID | nvarchar(100) |  |  |
| 55 | EInvoiceType | int |  |  |
| 56 | IsAntiDumpingVAT | bit | NN |  |
| 57 | GLVoucherRefID | uniqueidentifier |  |  |

## BAWithDrawDetail

Rows: 1,809 | Columns: 41

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | BAWithDraw.RefID |
| 3 | Description | nvarchar(255) |  |  |
| 4 | DebitAccount | nvarchar(20) |  | Account.AccountNumber |
| 5 | CreditAccount | nvarchar(20) |  | Account.AccountNumber |
| 6 | AmountOC | decimal(18,4) | NN |  |
| 7 | Amount | decimal(18,4) | NN |  |
| 8 | BudgetItemID | uniqueidentifier |  | BudgetItem.BudgetItemID |
| 9 | ProjectWorkID | uniqueidentifier |  | ProjectWork.ProjectWorkID |
| 10 | JobID | uniqueidentifier |  | Job.JobID |
| 11 | OrderID | uniqueidentifier |  |  |
| 12 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 13 | ListItemID | uniqueidentifier |  | ListItem.ListItemID |
| 14 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 15 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 16 | DebtAgreementID | uniqueidentifier |  | DebtAgreement.DebtAgreementID |
| 17 | UnResonableCost | bit | NN |  |
| 18 | SortOrder | int |  |  |
| 19 | CustomField1 | nvarchar(255) |  |  |
| 20 | CustomField2 | nvarchar(255) |  |  |
| 21 | CustomField3 | nvarchar(255) |  |  |
| 22 | CustomField4 | nvarchar(255) |  |  |
| 23 | CustomField5 | nvarchar(255) |  |  |
| 24 | CustomField6 | nvarchar(255) |  |  |
| 25 | CustomField7 | nvarchar(255) |  |  |
| 26 | CustomField8 | nvarchar(255) |  |  |
| 27 | CustomField9 | nvarchar(255) |  |  |
| 28 | CustomField10 | nvarchar(255) |  |  |
| 29 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 30 | PUContractID | uniqueidentifier |  | PUContract.PUContractID |
| 32 | CashOutAmountFinance | decimal(18,4) | NN |  |
| 33 | CashOutDiffAmountFinance | decimal(18,4) | NN |  |
| 34 | CashOutDiffAccountNumberFinance | nvarchar(20) |  | Account.AccountNumber |
| 36 | CashOutAmountManagement | decimal(18,4) | NN |  |
| 37 | CashOutDiffAmountManagement | decimal(18,4) | NN |  |
| 38 | CashOutDiffAccountNumberManagement | nvarchar(20) |  | Account.AccountNumber |
| 39 | CashOutExchangeRateFinance | decimal(20,6) | NN |  |
| 40 | CashOutExchangeRateManagement | decimal(20,6) | NN |  |
| 41 | BusinessType | int |  |  |
| 42 | PUOrderRefID | uniqueidentifier |  | PUOrder.RefID |
| 43 | LOANAgreementID | uniqueidentifier |  | LOANAgreement.LOANAgreementID |

## BAWithDrawDetailSalary

Rows: 0 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | BAWithDraw.RefID |
| 3 | EmployeeID | uniqueidentifier | NN | AccountObject.AccountObjectID |
| 4 | BankAccountNumber | nvarchar(355) |  |  |
| 5 | OrganizationUnitID | uniqueidentifier | NN | OrganizationUnit.OrganizationUnitID |
| 6 | PayableAmount | decimal(18,4) | NN |  |
| 7 | Amount | decimal(18,4) | NN |  |
| 8 | SortOrder | int | NN |  |
| 9 | BankName | nvarchar(128) |  |  |

## BAWithdrawDetailImportMultiTax

Rows: 0 | Columns: 54

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | BAWithDraw.RefID |
| 3 | VoucherRefID | uniqueidentifier |  |  |
| 4 | VoucherRefDate | datetime |  |  |
| 5 | VoucherPostedDate | datetime |  |  |
| 6 | VoucherRefNoFinance | nvarchar(20) |  |  |
| 7 | VoucherRefNoManagement | nvarchar(20) |  |  |
| 8 | VoucherRefType | int |  |  |
| 9 | SortOrder | int |  |  |
| 10 | VoucherRefDetailID | uniqueidentifier |  |  |
| 11 | InvNo | nvarchar(25) |  |  |
| 12 | Description | nvarchar(500) |  |  |
| 13 | TurnOverAmount | decimal(18,4) |  |  |
| 14 | InvTemplateNo | nvarchar(25) |  |  |
| 15 | InvDate | datetime |  |  |
| 16 | InvSeries | nvarchar(20) |  |  |
| 17 | AccountObjectID | uniqueidentifier |  |  |
| 18 | AccountObjectName | nvarchar(400) |  |  |
| 19 | AccountObjectAddress | nvarchar(400) |  |  |
| 20 | AccountObjectTaxCode | nvarchar(50) |  |  |
| 21 | PurchasePurposeID | uniqueidentifier |  |  |
| 22 | ImportRate | decimal(18,4) |  |  |
| 23 | ImportAmount | decimal(18,4) |  |  |
| 24 | ImportPayableAmount | decimal(18,4) | NN |  |
| 25 | ImportPaidAmount | decimal(18,4) | NN |  |
| 26 | ImportRemainningAmount | decimal(18,4) | NN |  |
| 27 | ImportAccount | nvarchar(20) |  | Account.AccountNumber |
| 28 | SpecialRate | decimal(18,4) |  |  |
| 29 | SpecialAmount | decimal(18,4) |  |  |
| 30 | SpecialPayableAmount | decimal(18,4) | NN |  |
| 31 | SpecialPaidAmount | decimal(18,4) | NN |  |
| 32 | SpecialRemainningAmount | decimal(18,4) | NN |  |
| 33 | SpecialAccount | nvarchar(20) |  | Account.AccountNumber |
| 34 | EnvironmentRate | decimal(18,4) |  |  |
| 35 | EnvironmentAmount | decimal(18,4) |  |  |
| 36 | EnvironmentPayableAmount | decimal(18,4) | NN |  |
| 37 | EnvironmentPaidAmount | decimal(18,4) | NN |  |
| 38 | EnvironmentRemainningAmount | decimal(18,4) | NN |  |
| 39 | EnvironmentAccount | nvarchar(20) |  | Account.AccountNumber |
| 40 | VATRate | decimal(18,4) |  |  |
| 41 | VATAmount | decimal(18,4) |  |  |
| 42 | VATPayableAmount | decimal(18,4) | NN |  |
| 43 | VATPaidAmount | decimal(18,4) | NN |  |
| 44 | VATRemainningAmount | decimal(18,4) | NN |  |
| 45 | VATAccount | nvarchar(20) |  | Account.AccountNumber |
| 46 | VATCorrespondingAccount | nvarchar(20) |  | Account.AccountNumber |
| 47 | VATDeductionAccount | nvarchar(20) |  | Account.AccountNumber |
| 48 | InvestmentProjectID | uniqueidentifier |  | InvestmentProject.InvestmentProjectID |
| 49 | AntiDumpingTaxRate | decimal(18,4) | NN |  |
| 50 | AntiDumpingTaxAmount | decimal(18,4) | NN |  |
| 51 | AntiDumpingTaxPayableAmount | decimal(18,4) | NN |  |
| 52 | AntiDumpingTaxPaidAmount | decimal(18,4) | NN |  |
| 53 | AntiDumpingTaxRemainningAmount | decimal(18,4) | NN |  |
| 54 | AntiDumpingTaxAccount | nvarchar(20) |  | Account.AccountNumber |

## BAWithdrawDetailImportVAT

Rows: 0 | Columns: 31

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | BAWithDraw.RefID |
| 3 | VoucherRefID | uniqueidentifier |  |  |
| 4 | VoucherRefDate | datetime |  |  |
| 5 | VoucherPostedDate | datetime |  |  |
| 6 | VoucherRefNoFinance | nvarchar(20) |  |  |
| 7 | VoucherRefNoManagement | nvarchar(20) |  |  |
| 8 | VoucherRefType | int |  |  |
| 9 | DebitAccount | nvarchar(20) |  | Account.AccountNumber |
| 10 | CreditAccount | nvarchar(20) |  | Account.AccountNumber |
| 11 | DeductionDebitAccount | nvarchar(20) |  | Account.AccountNumber |
| 12 | PayableAmount | decimal(18,4) | NN |  |
| 13 | Amount | decimal(18,4) | NN |  |
| 14 | RemainningAmount | decimal(18,4) | NN |  |
| 15 | SortOrder | int |  |  |
| 16 | VoucherRefDetailID | uniqueidentifier |  |  |
| 17 | InvNo | nvarchar(25) |  |  |
| 18 | Description | nvarchar(500) |  |  |
| 19 | VATRate | decimal(18,4) |  |  |
| 20 | VATAmount | decimal(18,4) |  |  |
| 21 | VATAmountOC | decimal(18,4) |  |  |
| 22 | TurnOverAmount | decimal(18,4) |  |  |
| 23 | InvTemplateNo | nvarchar(25) |  |  |
| 24 | InvDate | datetime |  |  |
| 25 | InvSeries | nvarchar(20) |  |  |
| 26 | AccountObjectID | uniqueidentifier |  |  |
| 27 | AccountObjectName | nvarchar(400) |  |  |
| 28 | AccountObjectAddress | nvarchar(400) |  |  |
| 29 | AccountObjectTaxCode | nvarchar(50) |  |  |
| 30 | PurchasePurposeID | uniqueidentifier |  |  |
| 31 | InvestmentProjectID | uniqueidentifier |  | InvestmentProject.InvestmentProjectID |

## BAWithdrawDetailPersonalIncomeTax

Rows: 0 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | BAWithDraw.RefID |
| 3 | EmployeeID | uniqueidentifier | NN |  |
| 4 | OrganizationUnitID | uniqueidentifier | NN |  |
| 5 | PayableAmount | decimal(18,4) | NN |  |
| 6 | Amount | decimal(18,4) | NN |  |
| 7 | SortOrder | int | NN |  |

## BAWithdrawDetailTax

Rows: 0 | Columns: 20

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | BAWithDraw.RefID |
| 3 | Description | nvarchar(255) |  |  |
| 4 | VATAccount | nvarchar(20) |  | Account.AccountNumber |
| 5 | VATAmount | decimal(18,4) | NN |  |
| 6 | VATRate | decimal(8,4) |  |  |
| 7 | TurnoverAmount | decimal(18,4) | NN |  |
| 8 | InvDate | datetime |  |  |
| 9 | InvSeries | nvarchar(20) |  |  |
| 10 | InvNo | nvarchar(25) |  |  |
| 11 | InvTemplateNo | nvarchar(25) |  |  |
| 12 | PurchasePurposeID | uniqueidentifier |  | PurchasePurpose.PurchasePurposeID |
| 13 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 14 | AccountObjectTaxCode | nvarchar(50) |  |  |
| 15 | AccountObjectName | nvarchar(400) |  |  |
| 16 | AccountObjectAddress | nvarchar(400) |  |  |
| 17 | SortOrder | int | NN |  |
| 18 | Sign | smallint |  |  |
| 19 | InvestmentProjectID | uniqueidentifier |  | InvestmentProject.InvestmentProjectID |
| 22 | VATRateOther | decimal(18,4) |  |  |

# 03 — IN Kho

## INAssemblyDisassembly

Rows: 11 | Columns: 21

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | BranchID | uniqueidentifier | NN | OrganizationUnit.OrganizationUnitID |
| 3 | RefType | int | NN |  |
| 4 | RefDate | datetime | NN |  |
| 5 | RefNo | nvarchar(20) | NN |  |
| 6 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 7 | UnitID | uniqueidentifier |  | Unit.UnitID |
| 8 | Quantity | decimal(22,8) | NN |  |
| 9 | JournalMemo | nvarchar(500) |  |  |
| 12 | EditVersion | timestamp | NN |  |
| 13 | RefOrder | int | NN |  |
| 14 | CreatedDate | datetime |  |  |
| 15 | CreatedBy | nvarchar(50) |  |  |
| 16 | ModifiedDate | datetime |  |  |
| 17 | ModifiedBy | nvarchar(50) |  |  |
| 18 | IsOutWardedLastYear | decimal(22,8) | NN |  |
| 19 | QuantityInwardLastYear | decimal(18,4) | NN |  |
| 20 | TotalAmountFinanceLastYear | decimal(18,4) | NN |  |
| 21 | TotalAmountManagementLastYear | decimal(18,4) | NN |  |
| 22 | TotalAmountFinanceInwardLastYear | decimal(18,4) | NN |  |
| 23 | TotalAmountManagementInwardLastYear | decimal(18,4) | NN |  |

## INAssemblyDisassemblyDetail

Rows: 23 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | INAssemblyDisassembly.RefID |
| 3 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 4 | Description | nvarchar(500) |  |  |
| 5 | UnitID | uniqueidentifier |  | Unit.UnitID |
| 7 | Quantity | decimal(22,8) | NN |  |
| 19 | SortOrder | int |  |  |
| 21 | StockID | uniqueidentifier |  |  |

## INAudit

Rows: 0 | Columns: 23

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | BranchID | uniqueidentifier | NN | OrganizationUnit.OrganizationUnitID |
| 3 | DisplayOnBook | int | NN |  |
| 4 | RefNo | nvarchar(20) |  |  |
| 5 | RefType | int | NN |  |
| 6 | RefDate | datetime |  |  |
| 7 | RefTime | datetime |  |  |
| 8 | StockID | uniqueidentifier |  |  |
| 9 | JournalMemo | nvarchar(500) |  |  |
| 10 | AuditDate | datetime |  |  |
| 11 | IsValueAudit | bit | NN |  |
| 12 | IsQualityAudit | bit | NN |  |
| 13 | Summary | nvarchar(255) |  |  |
| 14 | IsExecuted | bit | NN |  |
| 15 | RefOrder | int |  |  |
| 16 | EditVersion | timestamp |  |  |
| 17 | CreatedDate | datetime |  |  |
| 18 | CreatedBy | nvarchar(50) |  |  |
| 19 | ModifiedDate | datetime |  |  |
| 20 | ModifiedBy | nvarchar(50) |  |  |
| 21 | INInwardRefID | uniqueidentifier |  | INInward.RefID |
| 22 | INOutwardRefID | uniqueidentifier |  | INOutward.RefID |
| 23 | AuditType | int | NN |  |

## INAuditDetail

Rows: 0 | Columns: 32

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | INAudit.RefID |
| 3 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 4 | UnitID | uniqueidentifier |  | Unit.UnitID |
| 5 | UnitPrice | decimal(20,6) | NN |  |
| 6 | QuantityOnBook | decimal(22,8) | NN |  |
| 7 | AmountOnBook | decimal(18,4) | NN |  |
| 8 | QuantityAudit | decimal(22,8) | NN |  |
| 9 | AmountAudit | decimal(18,4) | NN |  |
| 10 | DiffQuantity | decimal(22,8) | NN |  |
| 11 | DiffAmount | decimal(18,4) | NN |  |
| 12 | GoodQuantity | decimal(22,8) | NN |  |
| 13 | LowQuantity | decimal(22,8) | NN |  |
| 14 | LostQuantity | decimal(22,8) | NN |  |
| 15 | ExecuteAction | int |  |  |
| 16 | SortOrder | int | NN |  |
| 17 | StockID | uniqueidentifier |  | Stock.StockID |
| 22 | LotNo | nvarchar(50) |  |  |
| 23 | ExpiryDate | datetime |  |  |
| 24 | SerialNumber1 | nvarchar(50) |  |  |
| 25 | SerialNumber2 | nvarchar(50) |  |  |
| 26 | SerialNumber3 | nvarchar(50) |  |  |
| 27 | SerialNumber4 | nvarchar(50) |  |  |
| 28 | SerialNumber5 | nvarchar(50) |  |  |
| 29 | IncludeSerialNotInStock | bit | NN |  |
| 30 | PanelLengthQuantity | decimal(22,8) | NN |  |
| 31 | PanelWidthQuantity | decimal(22,8) | NN |  |
| 32 | PanelHeightQuantity | decimal(22,8) | NN |  |
| 33 | PanelRadiusQuantity | decimal(22,8) | NN |  |
| 34 | PanelQuantityOnBook | decimal(22,8) | NN |  |
| 35 | PanelQuantity | decimal(22,8) | NN |  |
| 36 | DiffPanelQuantity | decimal(22,8) | NN |  |

## INAuditMemberDetail

Rows: 0 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | INAudit.RefID |
| 4 | AccountObjectName | nvarchar(400) |  |  |
| 5 | Position | nvarchar(128) |  |  |
| 6 | Representative | nvarchar(128) |  |  |
| 7 | SortOrder | int |  |  |

## INInventoryBook

Rows: 3,575 | Columns: 23

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | InventoryBookID | uniqueidentifier | PK NN |  |
| 2 | InventoryPostedDate | datetime |  |  |
| 3 | DisplayOnBook | int | NN |  |
| 4 | Note | nvarchar(255) |  |  |
| 5 | IsPostedManagement | bit | NN |  |
| 6 | RefID | uniqueidentifier |  |  |
| 7 | RefType | int | NN |  |
| 8 | RefDate | datetime | NN |  |
| 9 | PostedDate | datetime | NN |  |
| 10 | RefNo | nvarchar(20) |  |  |
| 11 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 12 | AccountObjectName | nvarchar(400) |  |  |
| 13 | ReceiptName | nvarchar(128) |  |  |
| 14 | Address | nvarchar(255) |  |  |
| 15 | JournalMemo | nvarchar(500) |  |  |
| 16 | DocumentIncluded | nvarchar(255) |  |  |
| 17 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 18 | RefOrder | int |  |  |
| 19 | CreatedDate | datetime |  |  |
| 20 | CreatedBy | nvarchar(50) |  |  |
| 21 | ModifiedDate | datetime |  |  |
| 22 | ModifiedBy | nvarchar(50) |  |  |
| 23 | VoucherRefType | int |  |  |

## INInventoryBookDetail

Rows: 3,575 | Columns: 23

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | InventoryBookDetailID | uniqueidentifier | PK NN |  |
| 2 | InventoryBookID | uniqueidentifier |  | INInventoryBook.InventoryBookID |
| 3 | RefDetailID | uniqueidentifier |  |  |
| 4 | StockID | uniqueidentifier |  | Stock.StockID |
| 5 | FromStockID | uniqueidentifier |  | Stock.StockID |
| 6 | ToStockID | uniqueidentifier |  | Stock.StockID |
| 7 | InventoryItemID | uniqueidentifier |  | InventoryItem.InventoryItemID |
| 8 | Description | nvarchar(500) |  |  |
| 9 | UnitID | uniqueidentifier |  | Unit.UnitID |
| 10 | InwardQuantity | decimal(22,8) |  |  |
| 11 | ActualInwardQuantity | decimal(22,8) |  |  |
| 12 | OutwardQuantity | decimal(22,8) |  |  |
| 13 | ActualOutwardQuantity | decimal(22,8) |  |  |
| 14 | LotNo | nvarchar(50) |  |  |
| 15 | ExpiryDate | datetime |  |  |
| 16 | Note | nvarchar(255) |  |  |
| 17 | MainUnitID | uniqueidentifier |  | Unit.UnitID |
| 18 | MainUnitPrice | decimal(20,6) | NN |  |
| 19 | MainActualInwardQuantity | decimal(22,8) | NN |  |
| 20 | MainActualOutwardQuantity | decimal(22,8) | NN |  |
| 21 | MainConvertRate | decimal(18,4) | NN |  |
| 22 | ExchangeRateOperator | nvarchar(3) |  |  |
| 23 | SortOrder | int |  |  |

## INInventoryBookDetailUnpost

Rows: 0 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | InventoryBookDetailUnPostID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | RefDetailID | uniqueidentifier | NN |  |
| 4 | IsPostedManagement | bit | NN |  |
| 5 | ActualInwardQuantity | decimal(22,8) | NN |  |
| 6 | ActualOutwardQuantity | decimal(22,8) | NN |  |
| 7 | MainActualInwardQuantity | decimal(22,8) | NN |  |
| 8 | MainActualOutwardQuantity | decimal(22,8) | NN |  |

## INInward

Rows: 1,182 | Columns: 48

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | DisplayOnBook | int | NN |  |
| 3 | RefType | int | NN |  |
| 4 | RefDate | datetime | NN |  |
| 5 | PostedDate | datetime | NN |  |
| 6 | RefNoFinance | nvarchar(20) |  |  |
| 7 | RefNoManagement | nvarchar(20) |  |  |
| 8 | IsPostedFinance | bit | NN |  |
| 9 | IsPostedManagement | bit | NN |  |
| 10 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 11 | AccountObjectName | nvarchar(400) |  |  |
| 12 | ContactName | nvarchar(400) |  |  |
| 13 | JournalMemo | nvarchar(500) |  |  |
| 14 | DocumentIncluded | nvarchar(255) |  |  |
| 15 | EmployeeID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 16 | TotalAmountFinance | decimal(18,4) | NN |  |
| 17 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 18 | SAReturnRefID | uniqueidentifier |  | SAReturn.RefID |
| 19 | UnitPriceMethod | int |  |  |
| 20 | IsPostedInventoryBookFinance | bit |  |  |
| 21 | IsPostedInventoryBookManagement | bit |  |  |
| 22 | InventoryPostedDate | datetime |  |  |
| 23 | EditVersion | timestamp | NN |  |
| 24 | RefOrder | int | NN |  |
| 25 | CreatedDate | datetime |  |  |
| 26 | CreatedBy | nvarchar(50) |  |  |
| 27 | ModifiedDate | datetime |  |  |
| 28 | ModifiedBy | nvarchar(50) |  |  |
| 29 | CustomField1 | nvarchar(255) |  |  |
| 30 | CustomField2 | nvarchar(255) |  |  |
| 31 | CustomField3 | nvarchar(255) |  |  |
| 32 | CustomField4 | nvarchar(255) |  |  |
| 33 | CustomField5 | nvarchar(255) |  |  |
| 34 | CustomField6 | nvarchar(255) |  |  |
| 35 | CustomField7 | nvarchar(255) |  |  |
| 36 | CustomField8 | nvarchar(255) |  |  |
| 37 | CustomField9 | nvarchar(255) |  |  |
| 38 | CustomField10 | nvarchar(255) |  |  |
| 39 | TotalAmountManagement | decimal(18,4) | NN |  |
| 40 | OutwardDependentRefID | uniqueidentifier |  |  |
| 41 | AssemblyRefID | uniqueidentifier |  | INAssemblyDisassembly.RefID |
| 42 | INRefOrder | datetime | NN |  |
| 43 | IsReturnWithInward | bit | NN |  |
| 44 | CurrencyID | nvarchar(3) |  |  |
| 45 | ExchangeRate | decimal(18,4) |  |  |
| 46 | IsCreatedSAReturnLastYear | bit | NN |  |
| 47 | RefIDMshop | nvarchar(MAX) |  |  |
| 48 | RefNoMshop | nvarchar(MAX) |  |  |

## INInwardDetail

Rows: 14,003 | Columns: 60

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | INInward.RefID |
| 3 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 4 | Description | nvarchar(500) |  |  |
| 5 | StockID | uniqueidentifier |  | Stock.StockID |
| 6 | DebitAccount | nvarchar(20) |  | Account.AccountNumber |
| 7 | CreditAccount | nvarchar(20) |  | Account.AccountNumber |
| 8 | UnitID | uniqueidentifier |  | Unit.UnitID |
| 9 | Quantity | decimal(22,8) | NN |  |
| 10 | UnitPriceFinance | decimal(20,6) | NN |  |
| 11 | AmountFinance | decimal(18,4) | NN |  |
| 12 | UnitPriceManagement | decimal(20,6) | NN |  |
| 13 | AmountManagement | decimal(18,4) | NN |  |
| 14 | LotNo | nvarchar(50) |  |  |
| 15 | ExpiryDate | datetime |  |  |
| 17 | ProductionOrderRefID | uniqueidentifier |  | INProductionOrder.RefID |
| 18 | OutwardRefID | uniqueidentifier |  |  |
| 19 | OutwardRefDetailID | uniqueidentifier |  |  |
| 20 | JobID | uniqueidentifier |  | Job.JobID |
| 21 | ProjectWorkID | uniqueidentifier |  | ProjectWork.ProjectWorkID |
| 22 | OrderID | uniqueidentifier |  | SAOrder.RefID |
| 23 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 24 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 25 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 26 | UnResonableCost | bit | NN |  |
| 27 | ListItemID | uniqueidentifier |  | ListItem.ListItemID |
| 28 | MainUnitID | uniqueidentifier |  | Unit.UnitID |
| 29 | MainUnitPriceFinance | decimal(20,6) | NN |  |
| 30 | MainUnitPriceManagement | decimal(20,6) | NN |  |
| 31 | MainConvertRate | decimal(18,4) | NN |  |
| 32 | MainQuantity | decimal(22,8) | NN |  |
| 33 | ExchangeRateOperator | nvarchar(3) | NN |  |
| 38 | SortOrder | int |  |  |
| 39 | CustomField1 | nvarchar(255) |  |  |
| 40 | CustomField2 | nvarchar(255) |  |  |
| 41 | CustomField3 | nvarchar(255) |  |  |
| 42 | CustomField4 | nvarchar(255) |  |  |
| 43 | CustomField5 | nvarchar(255) |  |  |
| 44 | CustomField6 | nvarchar(255) |  |  |
| 45 | CustomField7 | nvarchar(255) |  |  |
| 46 | CustomField8 | nvarchar(255) |  |  |
| 47 | CustomField9 | nvarchar(255) |  |  |
| 48 | CustomField10 | nvarchar(255) |  |  |
| 49 | IsPromotion | bit | NN |  |
| 50 | ProductionID | uniqueidentifier |  | INProductionOrderProduct.ProductionID |
| 51 | ConfrontingRefID | uniqueidentifier |  |  |
| 52 | ConfrontingRefDetailID | uniqueidentifier |  |  |
| 53 | InventoryResaleTypeID | int |  |  |
| 54 | PUContractID | uniqueidentifier |  | PUContract.PUContractID |
| 55 | INAssemblyRefID | uniqueidentifier |  |  |
| 56 | INAssemblyRefDetailID | uniqueidentifier |  |  |
| 57 | AmountFinanceOC | decimal(18,4) |  |  |
| 58 | AmountManagementOC | decimal(18,4) |  |  |
| 59 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 60 | AccountObjectName | nvarchar(400) |  |  |
| 61 | SAOrderRefDetailID | uniqueidentifier |  | SAOrderDetail.RefDetailID |
| 62 | BudgetItemID | uniqueidentifier |  |  |
| 64 | IsUpdatePriceFromOutward | bit |  |  |
| 65 | LOANAgreementID | uniqueidentifier |  | LOANAgreement.LOANAgreementID |
| 66 | ContractDetailID | uniqueidentifier |  | ContractDetailInventoryItem.ContractDetailID |

## INInwardOutwardList

Rows: 20,759 | Columns: 123

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefDate | datetime |  |  |
| 3 | CABARefDate | datetime |  |  |
| 4 | CARefDate | datetime |  |  |
| 5 | PostedDate | datetime |  |  |
| 6 | CABAPostedDate | datetime |  |  |
| 7 | CAPostedDate | datetime |  |  |
| 8 | RefType | int |  |  |
| 9 | InvTemplateNo | nvarchar(50) |  |  |
| 10 | RefNoFinance | nvarchar(20) |  |  |
| 11 | InvSeries | nvarchar(20) |  |  |
| 12 | RefNoManagement | nvarchar(20) |  |  |
| 13 | CABARefNoManagement | nvarchar(20) |  |  |
| 14 | CARefNoFinance | nvarchar(20) |  |  |
| 15 | InvNo | nvarchar(50) |  |  |
| 16 | CABARefNoFinance | nvarchar(20) |  |  |
| 17 | CARefNoManagement | nvarchar(20) |  |  |
| 18 | IsPostedFinance | bit |  |  |
| 19 | IsPostedManagement | bit |  |  |
| 20 | IncludeInvoice | int |  |  |
| 21 | SAInvoiceRefID | uniqueidentifier |  |  |
| 22 | PUInvoiceRefID | uniqueidentifier |  |  |
| 23 | AccountObjectID | uniqueidentifier |  |  |
| 24 | OrderNo | nvarchar(255) |  |  |
| 25 | AccountObjectName | nvarchar(400) |  |  |
| 26 | OrderDate | datetime |  |  |
| 27 | AccountObjectAddress | nvarchar(400) |  |  |
| 28 | ContactName | nvarchar(400) |  |  |
| 29 | ReceiverAddress | nvarchar(255) |  |  |
| 30 | SAReturnRefID | uniqueidentifier |  |  |
| 31 | AccountObjectBankAccount | nvarchar(50) |  |  |
| 32 | UnitPriceMethod | int |  |  |
| 33 | AccountObjectBankName | nvarchar(255) |  |  |
| 34 | OutDocumentIncluded | nvarchar(255) |  |  |
| 35 | AccountObjectContactName | nvarchar(400) |  |  |
| 36 | Payer | nvarchar(400) |  |  |
| 37 | IdentificationNumber | nvarchar(20) |  |  |
| 38 | PayerAddress | nvarchar(255) |  |  |
| 39 | TransporterID | uniqueidentifier |  |  |
| 40 | IssueDate | datetime |  |  |
| 41 | PayReason | nvarchar(255) |  |  |
| 42 | TransporterName | nvarchar(400) |  |  |
| 43 | CADocumentIncluded | nvarchar(255) |  |  |
| 44 | ContractCode | nvarchar(50) |  |  |
| 45 | IssueBy | nvarchar(120) |  |  |
| 46 | IsInvoiceExported | bit |  |  |
| 47 | Receiver | nvarchar(400) |  |  |
| 48 | Transport | nvarchar(50) |  |  |
| 49 | FromStockID | uniqueidentifier |  |  |
| 50 | JournalMemo | nvarchar(500) |  |  |
| 51 | ToStockID | uniqueidentifier |  |  |
| 52 | DocumentIncluded | nvarchar(255) |  |  |
| 53 | EmployeeID | uniqueidentifier |  |  |
| 54 | BranchID | uniqueidentifier |  |  |
| 55 | CABAJournalMemo | nvarchar(500) |  |  |
| 56 | CABADocumentIncluded | nvarchar(255) |  |  |
| 57 | BankAccountID | uniqueidentifier |  |  |
| 58 | BankName | nvarchar(255) |  |  |
| 59 | PaymentTermID | uniqueidentifier |  |  |
| 60 | DueTime | int |  |  |
| 61 | PaymentDate | datetime |  |  |
| 62 | RevenueStatus | int |  |  |
| 63 | CurrencyID | nvarchar(3) |  |  |
| 64 | ExchangeRate | decimal(18,4) |  |  |
| 65 | TotalAmountOC | decimal(18,4) |  |  |
| 66 | TotalAmount | decimal(18,4) |  |  |
| 67 | TotalImportTaxAmountOC | decimal(18,4) |  |  |
| 68 | TotalImportTaxAmount | decimal(18,4) |  |  |
| 69 | TotalVATAmountOC | decimal(18,4) |  |  |
| 70 | TotalVATAmount | decimal(18,4) |  |  |
| 71 | TotalDiscountAmountOC | decimal(18,4) |  |  |
| 72 | TotalDiscountAmount | decimal(18,4) |  |  |
| 73 | TotalFreightAmount | decimal(18,4) |  |  |
| 74 | TotalInwardAmount | decimal(18,4) |  |  |
| 75 | TotalSpecialConsumeTaxAmountOC | decimal(18,4) |  |  |
| 76 | TotalSpecialConsumeTaxAmount | decimal(18,4) |  |  |
| 77 | TotalCustomBeforeAmount | decimal(18,4) |  |  |
| 78 | DisplayOnBook | int |  |  |
| 79 | IsPaid | bit |  |  |
| 80 | IsPostedCashBookFinance | bit |  |  |
| 81 | IsPostedCashBookManagement | bit |  |  |
| 82 | CashBookPostedDate | datetime |  |  |
| 83 | IsPostedInventoryBookFinance | bit |  |  |
| 84 | IsPostedInventoryBookManagement | bit |  |  |
| 85 | InventoryPostedDate | datetime |  |  |
| 86 | RefOrder | int |  |  |
| 87 | CreatedDate | datetime |  |  |
| 88 | CreatedBy | nvarchar(50) |  |  |
| 89 | ModifiedDate | datetime |  |  |
| 90 | ModifiedBy | nvarchar(50) |  |  |
| 91 | CustomField1 | nvarchar(255) |  |  |
| 92 | CustomField2 | nvarchar(255) |  |  |
| 93 | CustomField3 | nvarchar(255) |  |  |
| 94 | CustomField4 | nvarchar(255) |  |  |
| 95 | CustomField5 | nvarchar(255) |  |  |
| 96 | CustomField6 | nvarchar(255) |  |  |
| 97 | CustomField7 | nvarchar(255) |  |  |
| 98 | CustomField8 | nvarchar(255) |  |  |
| 99 | CustomField9 | nvarchar(255) |  |  |
| 100 | CustomField10 | nvarchar(255) |  |  |
| 101 | INType | int |  |  |
| 102 | ListTableName | nvarchar(100) |  |  |
| 103 | RefTypeName | nvarchar(100) |  |  |
| 104 | RevenueStatusName | nvarchar(100) |  |  |
| 105 | CAJournalMemo | nvarchar(500) |  |  |
| 106 | TotalAmountFinance | decimal(18,4) |  |  |
| 107 | TotalAmountManagement | decimal(18,4) |  |  |
| 108 | CABAAmountOC | decimal(18,4) |  |  |
| 109 | CABAAmount | decimal(18,4) |  |  |
| 110 | OutwardDependentRefID | uniqueidentifier |  |  |
| 111 | AssemblyRefID | uniqueidentifier |  |  |
| 112 | INRefOrder | datetime |  |  |
| 113 | IsSaleWithOutward | bit |  |  |
| 114 | IsCreatedSAReturnLastYear | bit | NN |  |
| 115 | RefIDMshop | nvarchar(MAX) |  |  |
| 116 | RefNoMshop | nvarchar(MAX) |  |  |
| 117 | InvoiceSystem | int | NN |  |
| 118 | InvoiceCode | nvarchar(100) |  |  |
| 119 | IsProcessInvoiceError | bit | NN |  |
| 120 | BranchImportName | nvarchar(400) |  |  |
| 121 | BranchImportMST | nvarchar(50) |  |  |
| 122 | FromStockAddress | nvarchar(255) |  |  |
| 123 | ToStockAddress | nvarchar(255) |  |  |

## INOutward

Rows: 18,630 | Columns: 68

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | DisplayOnBook | int | NN |  |
| 3 | RefType | int | NN |  |
| 4 | RefDate | datetime | NN |  |
| 5 | PostedDate | datetime | NN |  |
| 6 | RefNoFinance | nvarchar(20) |  |  |
| 7 | RefNoManagement | nvarchar(20) |  |  |
| 8 | InvTemplateNo | nvarchar(50) |  |  |
| 9 | InvSeries | nvarchar(20) |  |  |
| 10 | InvNo | nvarchar(50) |  |  |
| 11 | IsPostedFinance | bit | NN |  |
| 12 | IsPostedManagement | bit | NN |  |
| 13 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 14 | AccountObjectName | nvarchar(400) |  |  |
| 15 | AccountObjectAddress | nvarchar(400) |  |  |
| 16 | OrderNo | nvarchar(255) |  |  |
| 17 | OrderDate | datetime |  |  |
| 18 | ContactName | nvarchar(400) |  |  |
| 19 | JournalMemo | nvarchar(500) |  |  |
| 20 | EmployeeID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 21 | DocumentIncluded | nvarchar(255) |  |  |
| 22 | TransporterID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 23 | TransporterName | nvarchar(400) |  |  |
| 24 | ContractCode | nvarchar(50) |  |  |
| 25 | Transport | nvarchar(50) |  |  |
| 26 | FromStockID | uniqueidentifier |  | Stock.StockID |
| 27 | ToStockID | uniqueidentifier |  | Stock.StockID |
| 28 | TotalAmountFinance | decimal(18,4) | NN |  |
| 29 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 30 | IsPostedInventoryBookFinance | bit |  |  |
| 31 | IsPostedInventoryBookManagement | bit |  |  |
| 32 | InventoryPostedDate | datetime |  |  |
| 33 | EditVersion | timestamp |  |  |
| 34 | RefOrder | int | NN |  |
| 35 | RevenueStatus | int |  |  |
| 36 | CreatedDate | datetime |  |  |
| 37 | CreatedBy | nvarchar(50) |  |  |
| 38 | ModifiedDate | datetime |  |  |
| 39 | ModifiedBy | nvarchar(50) |  |  |
| 40 | CustomField1 | nvarchar(255) |  |  |
| 41 | CustomField2 | nvarchar(255) |  |  |
| 42 | CustomField3 | nvarchar(255) |  |  |
| 43 | CustomField4 | nvarchar(255) |  |  |
| 44 | CustomField5 | nvarchar(255) |  |  |
| 45 | CustomField6 | nvarchar(255) |  |  |
| 46 | CustomField7 | nvarchar(255) |  |  |
| 47 | CustomField8 | nvarchar(255) |  |  |
| 48 | CustomField9 | nvarchar(255) |  |  |
| 49 | CustomField10 | nvarchar(255) |  |  |
| 50 | TotalAmountManagement | decimal(18,4) | NN |  |
| 51 | AssemblyRefID | uniqueidentifier |  | INAssemblyDisassembly.RefID |
| 52 | INRefOrder | datetime | NN |  |
| 53 | isBranchIssued | bit |  |  |
| 54 | IsSaleWithOutward | bit | NN |  |
| 60 | ShippingAddress | nvarchar(255) |  |  |
| 61 | IsInvoiceReplace | bit | NN |  |
| 62 | RefIDMshop | nvarchar(MAX) |  |  |
| 63 | RefNoMshop | nvarchar(MAX) |  |  |
| 64 | IsGetForInvoice | bit | COMP |  |
| 65 | OrganizationUnitID | uniqueidentifier |  |  |
| 66 | InvoiceSystem | int | NN |  |
| 67 | InvoiceCode | nvarchar(100) |  |  |
| 68 | IsProcessInvoiceError | bit | NN |  |
| 69 | BranchImportName | nvarchar(400) |  |  |
| 70 | BranchImportMST | nvarchar(50) |  |  |
| 71 | FromStockAddress | nvarchar(255) |  |  |
| 72 | ToStockAddress | nvarchar(255) |  |  |
| 73 | InvReplaceType | int | NN |  |

## INOutwardDetail

Rows: 81,833 | Columns: 62

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | INOutward.RefID |
| 3 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 4 | Description | nvarchar(500) |  |  |
| 5 | StockID | uniqueidentifier |  | Stock.StockID |
| 6 | DebitAccount | nvarchar(20) |  | Account.AccountNumber |
| 7 | CreditAccount | nvarchar(20) |  | Account.AccountNumber |
| 8 | UnitID | uniqueidentifier |  | Unit.UnitID |
| 9 | Quantity | decimal(22,8) | NN |  |
| 10 | UnitPriceFinance | decimal(20,6) | NN |  |
| 11 | UnitPriceManagement | decimal(20,6) | NN |  |
| 12 | AmountFinance | decimal(18,4) | NN |  |
| 13 | AmountManagement | decimal(18,4) | NN |  |
| 14 | LotNo | nvarchar(50) |  |  |
| 15 | ExpiryDate | datetime |  |  |
| 16 | IsUnUpdateOutwardPrice | bit | NN |  |
| 17 | ProductionID | uniqueidentifier |  | INProductionOrderProduct.ProductionID |
| 19 | ProductionOrderRefID | uniqueidentifier |  | INProductionOrder.RefID |
| 20 | ConfrontingRefID | uniqueidentifier |  |  |
| 21 | ConfrontingRefDetailID | uniqueidentifier |  |  |
| 22 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 23 | JobID | uniqueidentifier |  | Job.JobID |
| 24 | ProjectWorkID | uniqueidentifier |  | ProjectWork.ProjectWorkID |
| 25 | OrderID | uniqueidentifier |  | SAOrder.RefID |
| 26 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 27 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 28 | UnResonableCost | bit | NN |  |
| 29 | ListItemID | uniqueidentifier |  | ListItem.ListItemID |
| 30 | MainUnitID | uniqueidentifier |  | Unit.UnitID |
| 31 | MainUnitPriceFinance | decimal(20,6) | NN |  |
| 32 | MainUnitPriceManagement | decimal(20,6) | NN |  |
| 33 | MainConvertRate | decimal(18,4) | NN |  |
| 34 | MainQuantity | decimal(22,8) | NN |  |
| 35 | ExchangeRateOperator | nvarchar(3) | NN |  |
| 36 | SortOrder | int |  |  |
| 41 | CustomField1 | nvarchar(255) |  |  |
| 42 | CustomField2 | nvarchar(255) |  |  |
| 43 | CustomField3 | nvarchar(255) |  |  |
| 44 | CustomField4 | nvarchar(255) |  |  |
| 45 | CustomField5 | nvarchar(255) |  |  |
| 46 | CustomField6 | nvarchar(255) |  |  |
| 47 | CustomField7 | nvarchar(255) |  |  |
| 48 | CustomField8 | nvarchar(255) |  |  |
| 49 | CustomField9 | nvarchar(255) |  |  |
| 50 | CustomField10 | nvarchar(255) |  |  |
| 51 | IsPromotion | bit | NN |  |
| 53 | SAOrderRefDetailID | uniqueidentifier |  | SAOrderDetail.RefDetailID |
| 54 | SalePrice | decimal(20,6) |  |  |
| 55 | SaleAmount | decimal(18,4) |  |  |
| 56 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 57 | ContractDetailID | uniqueidentifier |  | ContractDetailInventoryItem.ContractDetailID |
| 58 | InventoryResaleTypeID | int |  |  |
| 59 | PUContractID | uniqueidentifier |  | PUContract.PUContractID |
| 60 | INAssemblyRefID | uniqueidentifier |  |  |
| 61 | INAssemblyRefDetailID | uniqueidentifier |  |  |
| 62 | PUVoucherRefID | uniqueidentifier |  | PUVoucher.RefID |
| 63 | AccountObjectName | nvarchar(400) |  |  |
| 64 | INTransferRefID | uniqueidentifier |  |  |
| 65 | INTransferRefDetailID | uniqueidentifier |  |  |
| 66 | BudgetItemID | uniqueidentifier |  |  |
| 67 | PUVoucherRefDetailID | uniqueidentifier |  |  |
| 68 | LOANAgreementID | uniqueidentifier |  | LOANAgreement.LOANAgreementID |

## INProductionOrder

Rows: 126 | Columns: 15

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | BranchID | uniqueidentifier | NN |  |
| 3 | RefType | int | NN |  |
| 4 | RefNo | nvarchar(20) | NN |  |
| 5 | RefDate | datetime | NN |  |
| 7 | Status | int | NN |  |
| 8 | EditVersion | timestamp | NN |  |
| 9 | RefOrder | int | NN |  |
| 10 | CreatedDate | datetime |  |  |
| 11 | CreatedBy | nvarchar(50) |  |  |
| 12 | ModifiedDate | datetime |  |  |
| 13 | ModifiedBy | nvarchar(50) |  |  |
| 14 | IsInwardDone | bit | NN |  |
| 15 | IsOutwardDone | bit | NN |  |
| 16 | Description | nvarchar(255) |  |  |

## INProductionOrderDetail

Rows: 1,160 | Columns: 22

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | ProductionID | uniqueidentifier | NN | INProductionOrderProduct.ProductionID |
| 3 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 4 | Description | nvarchar(500) |  |  |
| 5 | UnitID | uniqueidentifier |  | Unit.UnitID |
| 6 | Quantity | decimal(22,8) | NN |  |
| 7 | JobID | uniqueidentifier |  | Job.JobID |
| 8 | SortOrder | int | NN |  |
| 9 | QuantityOnUnit | decimal(22,8) | NN |  |
| 10 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 11 | OutwardQuantityLastYear | decimal(22,8) | NN |  |
| 12 | ListItemID | uniqueidentifier |  | ListItem.ListItemID |
| 13 | CustomField1 | nvarchar(255) |  |  |
| 14 | CustomField2 | nvarchar(255) |  |  |
| 15 | CustomField3 | nvarchar(255) |  |  |
| 16 | CustomField4 | nvarchar(255) |  |  |
| 17 | CustomField5 | nvarchar(255) |  |  |
| 18 | CustomField6 | nvarchar(255) |  |  |
| 19 | CustomField7 | nvarchar(255) |  |  |
| 20 | CustomField8 | nvarchar(255) |  |  |
| 21 | CustomField9 | nvarchar(255) |  |  |
| 22 | CustomField10 | nvarchar(255) |  |  |

## INProductionOrderProduct

Rows: 546 | Columns: 22

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ProductionID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | INProductionOrder.RefID |
| 3 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 4 | Description | nvarchar(500) |  |  |
| 5 | Quantity | decimal(22,8) | NN |  |
| 6 | UnitID | uniqueidentifier |  | Unit.UnitID |
| 7 | OrderID | uniqueidentifier |  | SAOrder.RefID |
| 8 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 9 | JobID | uniqueidentifier |  | Job.JobID |
| 10 | SortOrder | int |  |  |
| 11 | InwardQuantityLastYear | decimal(22,8) | NN |  |
| 12 | ListItemID | uniqueidentifier |  | ListItem.ListItemID |
| 13 | CustomField1 | nvarchar(255) |  |  |
| 14 | CustomField2 | nvarchar(255) |  |  |
| 15 | CustomField3 | nvarchar(255) |  |  |
| 16 | CustomField4 | nvarchar(255) |  |  |
| 17 | CustomField5 | nvarchar(255) |  |  |
| 18 | CustomField6 | nvarchar(255) |  |  |
| 19 | CustomField7 | nvarchar(255) |  |  |
| 20 | CustomField8 | nvarchar(255) |  |  |
| 21 | CustomField9 | nvarchar(255) |  |  |
| 22 | CustomField10 | nvarchar(255) |  |  |

## INSerialNumber

Rows: 0 | Columns: 26

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | BookSerialNumberID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | RefDetailID | uniqueidentifier | NN |  |
| 4 | RefType | int | NN |  |
| 5 | InventoryItemID | uniqueidentifier | NN |  |
| 6 | SerialNumber1 | nvarchar(50) |  |  |
| 7 | SerialNumber2 | nvarchar(50) |  |  |
| 8 | SerialNumber3 | nvarchar(50) |  |  |
| 9 | SerialNumber4 | nvarchar(50) |  |  |
| 10 | SerialNumber5 | nvarchar(50) |  |  |
| 11 | InwardStockID | uniqueidentifier |  |  |
| 12 | OutwardStockID | uniqueidentifier |  |  |
| 13 | InwardQuantity | decimal(22,8) |  |  |
| 14 | OutwardQuantity | decimal(22,8) |  |  |
| 15 | ConfrontingRefID | uniqueidentifier |  |  |
| 16 | ConfrontingRefDetailID | uniqueidentifier |  |  |
| 17 | ConfrontingRefType | int |  |  |
| 18 | ConfrontingBookSerialNumberID | uniqueidentifier |  |  |
| 20 | SortOrder | int | NN |  |
| 21 | BranchID | uniqueidentifier |  |  |
| 22 | PostedDate | datetime |  |  |
| 23 | RefNoFinance | nvarchar(20) |  |  |
| 24 | RefNoManagement | nvarchar(20) |  |  |
| 25 | RefOrder | int |  |  |
| 26 | SerialType | int | NN |  |
| 27 | DisplayOnBook | int |  |  |

## INTransfer

Rows: 559 | Columns: 59

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | BranchID | uniqueidentifier | NN | OrganizationUnit.OrganizationUnitID |
| 3 | DisplayOnBook | int | NN |  |
| 4 | RefType | int | NN |  |
| 5 | RefDate | datetime | NN |  |
| 6 | PostedDate | datetime | NN |  |
| 7 | RefNoFinance | nvarchar(20) |  |  |
| 8 | RefNoManagement | nvarchar(20) |  |  |
| 9 | InvTemplateNo | nvarchar(50) |  |  |
| 10 | InvSeries | nvarchar(20) |  |  |
| 11 | InvNo | nvarchar(50) |  |  |
| 12 | IsPostedFinance | bit | NN |  |
| 13 | IsPostedManagement | bit | NN |  |
| 14 | ContractCode | nvarchar(255) |  |  |
| 15 | ContractDate | datetime |  |  |
| 16 | ContractOwner | nvarchar(50) |  |  |
| 17 | JournalMemo | nvarchar(500) |  |  |
| 18 | CompanyTaxCode | nvarchar(50) |  |  |
| 19 | TransporterID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 20 | TransporterName | nvarchar(400) |  |  |
| 21 | TransportContractCode | nvarchar(50) |  |  |
| 22 | Transport | nvarchar(50) |  |  |
| 23 | TotalAmountFinance | decimal(18,4) | NN |  |
| 24 | IsPostedInventoryBookFinance | bit |  |  |
| 25 | IsPostedInventoryBookManagement | bit |  |  |
| 26 | InventoryPostedDate | datetime |  |  |
| 27 | EditVersion | timestamp |  |  |
| 28 | RefOrder | int | NN |  |
| 29 | CreatedDate | datetime |  |  |
| 30 | CreatedBy | nvarchar(50) |  |  |
| 31 | ModifiedDate | datetime |  |  |
| 32 | ModifiedBy | nvarchar(50) |  |  |
| 33 | CustomField1 | nvarchar(255) |  |  |
| 34 | CustomField2 | nvarchar(255) |  |  |
| 35 | CustomField3 | nvarchar(255) |  |  |
| 36 | CustomField4 | nvarchar(255) |  |  |
| 37 | CustomField5 | nvarchar(255) |  |  |
| 38 | CustomField6 | nvarchar(255) |  |  |
| 39 | CustomField7 | nvarchar(255) |  |  |
| 40 | CustomField8 | nvarchar(255) |  |  |
| 41 | CustomField9 | nvarchar(255) |  |  |
| 42 | CustomField10 | nvarchar(255) |  |  |
| 43 | TotalAmountManagement | decimal(18,4) | NN |  |
| 44 | INRefOrder | datetime | NN |  |
| 45 | AccountObjectID | uniqueidentifier |  |  |
| 46 | isBranchIssued | bit |  |  |
| 47 | AccountObjectName | nvarchar(400) |  |  |
| 48 | IsAttachList | bit | NN |  |
| 49 | ListNo | nvarchar(20) |  |  |
| 50 | ListDate | datetime |  |  |
| 51 | CommonInventoryName | nvarchar(255) |  |  |
| 57 | IsInvoiceReplace | bit | NN |  |
| 58 | RefIDMshop | nvarchar(MAX) |  |  |
| 59 | RefNoMshop | nvarchar(MAX) |  |  |
| 60 | IsGetForInvoice | bit | COMP |  |
| 61 | InvoiceSystem | int | NN |  |
| 62 | InvoiceCode | nvarchar(100) |  |  |
| 63 | IsProcessInvoiceError | bit | NN |  |
| 64 | InvReplaceType | int | NN |  |

## INTransferDetail

Rows: 3,767 | Columns: 54

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | INTransfer.RefID |
| 3 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 4 | Description | nvarchar(500) |  |  |
| 5 | FromStockID | uniqueidentifier |  | Stock.StockID |
| 6 | ToStockID | uniqueidentifier |  | Stock.StockID |
| 7 | DebitAccount | nvarchar(20) |  | Account.AccountNumber |
| 8 | CreditAccount | nvarchar(20) |  | Account.AccountNumber |
| 9 | UnitID | uniqueidentifier |  | Unit.UnitID |
| 10 | Quantity | decimal(22,8) | NN |  |
| 11 | SalePrice | decimal(20,6) | NN |  |
| 12 | SaleAmount | decimal(18,4) | NN |  |
| 13 | UnitPriceFinance | decimal(20,6) | NN |  |
| 14 | AmountFinance | decimal(18,4) | NN |  |
| 15 | UnitPriceManagement | decimal(20,6) | NN |  |
| 16 | AmountManagement | decimal(18,4) | NN |  |
| 17 | LotNo | nvarchar(50) |  |  |
| 18 | ExpiryDate | datetime |  |  |
| 19 | ListItemID | uniqueidentifier |  | ListItem.ListItemID |
| 20 | ConfrontingRefID | uniqueidentifier |  |  |
| 21 | ConfrontingRefDetailID | uniqueidentifier |  |  |
| 22 | MainUnitID | uniqueidentifier |  | Unit.UnitID |
| 23 | MainUnitPriceFinance | decimal(20,6) | NN |  |
| 24 | MainUnitPriceManagement | decimal(20,6) | NN |  |
| 25 | MainConvertRate | decimal(18,4) | NN |  |
| 26 | MainQuantity | decimal(22,8) | NN |  |
| 27 | ExchangeRateOperator | nvarchar(3) | NN |  |
| 28 | SortOrder | int |  |  |
| 33 | CustomField10 | nvarchar(255) |  |  |
| 34 | CustomField1 | nvarchar(255) |  |  |
| 35 | CustomField2 | nvarchar(255) |  |  |
| 36 | CustomField3 | nvarchar(255) |  |  |
| 37 | CustomField4 | nvarchar(255) |  |  |
| 38 | CustomField5 | nvarchar(255) |  |  |
| 39 | CustomField6 | nvarchar(255) |  |  |
| 40 | CustomField7 | nvarchar(255) |  |  |
| 41 | CustomField8 | nvarchar(255) |  |  |
| 42 | CustomField9 | nvarchar(255) |  |  |
| 44 | InventoryResaleTypeID | int |  |  |
| 45 | JobID | uniqueidentifier |  | Job.JobID |
| 46 | ProjectWorkID | uniqueidentifier |  | ProjectWork.ProjectWorkID |
| 47 | OrderID | uniqueidentifier |  | SAOrder.RefID |
| 48 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 49 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 50 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 51 | UnResonableCost | bit | NN |  |
| 52 | PUContractID | uniqueidentifier |  | PUContract.PUContractID |
| 53 | PUVoucherOrInwardRefID | uniqueidentifier |  |  |
| 54 | BudgetItemID | uniqueidentifier |  |  |
| 55 | PUVoucherOrInwardRefDetailID | uniqueidentifier |  |  |
| 56 | FromStockAddress | nvarchar(255) |  |  |
| 57 | ToStockAddress | nvarchar(255) |  |  |
| 58 | SAVoucherRefID | uniqueidentifier |  |  |
| 59 | SAVoucherRefDetailID | uniqueidentifier |  |  |

## INUnitQuantityConvert

Rows: 0 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ConvertID | uniqueidentifier | PK NN |  |
| 2 | RefType | int |  |  |
| 3 | RefID | uniqueidentifier |  |  |
| 4 | RefDetailID | uniqueidentifier |  |  |
| 5 | InventoryItemID | uniqueidentifier |  |  |
| 6 | Option | int | NN |  |
| 7 | UnitID | uniqueidentifier |  |  |
| 8 | Quantity | decimal(22,8) |  |  |
| 9 | Description | nvarchar(MAX) |  |  |
| 10 | ModifiedDate | datetime |  |  |

## INUnitQuantityConvertDetail

Rows: 0 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ConvertDetailID | uniqueidentifier | PK NN |  |
| 2 | ConvertID | uniqueidentifier | NN | INUnitQuantityConvert.ConvertID |
| 3 | UnitID | uniqueidentifier |  |  |
| 4 | UnitName | nvarchar(20) |  |  |
| 5 | MainUnitID | uniqueidentifier |  |  |
| 6 | Quantity | decimal(22,8) |  |  |
| 7 | MainQuantity | decimal(22,8) |  |  |
| 8 | ConvertRate | decimal(22,8) |  |  |
| 9 | ExchangeRateOperator | nvarchar(3) |  |  |
| 10 | SortOrder | int |  |  |

# 04 — SA Bán hàng

## SADiscount

Rows: 0 | Columns: 52

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | BranchID | uniqueidentifier | NN | OrganizationUnit.OrganizationUnitID |
| 3 | DisplayOnBook | int |  |  |
| 4 | RefType | int | NN |  |
| 5 | RefDate | datetime | NN |  |
| 6 | PostedDate | datetime | NN |  |
| 7 | RefNoFinance | nvarchar(20) |  |  |
| 8 | RefNoManagement | nvarchar(20) |  |  |
| 9 | IsPostedFinance | bit | NN |  |
| 10 | IsPostedManagement | bit | NN |  |
| 11 | SAInvoiceRefID | uniqueidentifier |  |  |
| 12 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 13 | AccountObjectName | nvarchar(400) |  |  |
| 14 | AccountObjectAddress | nvarchar(400) |  |  |
| 15 | Receiver | nvarchar(400) |  |  |
| 16 | JournalMemo | nvarchar(500) |  |  |
| 17 | CurrencyID | nvarchar(3) |  | CCY.CurrencyID |
| 18 | ExchangeRate | decimal(18,4) |  |  |
| 19 | EmployeeID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 20 | DocumentIncluded | nvarchar(255) |  |  |
| 21 | SupplierID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 22 | SupplierName | nvarchar(400) |  |  |
| 23 | TotalSaleAmountOC | decimal(18,4) | NN |  |
| 24 | TotalSaleAmount | decimal(18,4) | NN |  |
| 25 | TotalVATAmountOC | decimal(18,4) | NN |  |
| 26 | TotalVATAmount | decimal(18,4) | NN |  |
| 27 | TotalDiscountAmountOC | decimal(18,4) | NN |  |
| 28 | TotalDiscountAmount | decimal(18,4) | NN |  |
| 29 | TotalAmountOC | decimal(18,4) | NN |  |
| 30 | TotalAmount | decimal(18,4) | NN |  |
| 31 | IsPostedCashBookFinance | bit |  |  |
| 32 | IsPostedCashBookManagement | bit |  |  |
| 33 | CashBookPostedDate | datetime |  |  |
| 34 | EditVersion | timestamp |  |  |
| 35 | RefOrder | int | NN |  |
| 36 | CreatedDate | datetime |  |  |
| 37 | CreatedBy | nvarchar(50) |  |  |
| 38 | ModifiedDate | datetime |  |  |
| 39 | ModifiedBy | nvarchar(50) |  |  |
| 40 | CustomField1 | nvarchar(255) |  |  |
| 41 | CustomField2 | nvarchar(255) |  |  |
| 42 | CustomField3 | nvarchar(255) |  |  |
| 43 | CustomField4 | nvarchar(255) |  |  |
| 44 | CustomField5 | nvarchar(255) |  |  |
| 45 | CustomField6 | nvarchar(255) |  |  |
| 46 | CustomField7 | nvarchar(255) |  |  |
| 47 | CustomField8 | nvarchar(255) |  |  |
| 48 | CustomField9 | nvarchar(255) |  |  |
| 49 | CustomField10 | nvarchar(255) |  |  |
| 50 | CABAAmountOC | decimal(18,4) | NN |  |
| 51 | CABAAmount | decimal(18,4) | NN |  |
| 52 | AdjustInvoiceRefID | uniqueidentifier |  |  |

## SADiscountDetail

Rows: 0 | Columns: 73

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | SADiscount.RefID |
| 3 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 4 | Description | nvarchar(500) |  |  |
| 5 | DebitAccount | nvarchar(20) |  |  |
| 6 | CreditAccount | nvarchar(20) |  |  |
| 7 | UnitID | uniqueidentifier |  | Unit.UnitID |
| 8 | Quantity | decimal(22,8) | NN |  |
| 9 | UnitPrice | decimal(20,6) | NN |  |
| 10 | UnitPriceAfterTax | decimal(20,6) | NN |  |
| 11 | AmountOC | decimal(18,4) | NN |  |
| 12 | Amount | decimal(18,4) | NN |  |
| 13 | DiscountRate | decimal(18,4) |  |  |
| 14 | DiscountAmountOC | decimal(18,4) | NN |  |
| 15 | DiscountAmount | decimal(18,4) | NN |  |
| 16 | DiscountAccount | nvarchar(20) |  |  |
| 17 | VATRate | decimal(18,4) |  |  |
| 18 | VATAmountOC | decimal(18,4) | NN |  |
| 19 | VATAmount | decimal(18,4) | NN |  |
| 20 | VATAccount | nvarchar(20) |  |  |
| 21 | ListItemID | uniqueidentifier |  | ListItem.ListItemID |
| 22 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 23 | OrderID | uniqueidentifier |  | SAOrder.RefID |
| 24 | ProjectWorkID | uniqueidentifier |  | ProjectWork.ProjectWorkID |
| 25 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 26 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 27 | SAVoucherRefID | uniqueidentifier |  | SAVoucher.RefID |
| 28 | SAVoucherRefDetailID | uniqueidentifier |  | SAVoucherDetail.RefDetailID |
| 29 | MainUnitID | uniqueidentifier |  | Unit.UnitID |
| 30 | MainUnitPrice | decimal(20,6) | NN |  |
| 31 | MainConvertRate | decimal(18,4) | NN |  |
| 32 | MainQuantity | decimal(22,8) | NN |  |
| 33 | SortOrder | int | NN |  |
| 34 | CustomField1 | nvarchar(255) |  |  |
| 35 | CustomField2 | nvarchar(255) |  |  |
| 36 | CustomField3 | nvarchar(255) |  |  |
| 37 | CustomField4 | nvarchar(255) |  |  |
| 38 | CustomField5 | nvarchar(255) |  |  |
| 39 | CustomField6 | nvarchar(255) |  |  |
| 40 | CustomField7 | nvarchar(255) |  |  |
| 41 | CustomField8 | nvarchar(255) |  |  |
| 42 | CustomField9 | nvarchar(255) |  |  |
| 43 | CustomField10 | nvarchar(255) |  |  |
| 44 | TACareerGroupID | int |  | TACareerGroup.TACareerGroupID |
| 45 | SAInvoiceRefID | uniqueidentifier |  | SAInvoice.RefID |
| 46 | BudgetItemID | uniqueidentifier |  | BudgetItem.BudgetItemID |
| 47 | JobID | uniqueidentifier |  | Job.JobID |
| 48 | BankAccountID | uniqueidentifier |  | BankAccount.BankAccountID |
| 49 | VATDescription | nvarchar(255) |  |  |
| 50 | UnResonableCost | bit | NN |  |
| 51 | NotInVATDeclaration | bit | NN |  |
| 53 | CashOutAmountFinance | decimal(18,4) | NN |  |
| 54 | CashOutDiffAmountFinance | decimal(18,4) | NN |  |
| 55 | CashOutVATAmountFinance | decimal(18,4) | NN |  |
| 56 | CashOutDiffVATAmountFinance | decimal(18,4) | NN |  |
| 57 | CashOutDiffAccountNumberFinance | nvarchar(20) |  | Account.AccountNumber |
| 59 | CashOutAmountManagement | decimal(18,4) | NN |  |
| 60 | CashOutDiffAmountManagement | decimal(18,4) | NN |  |
| 61 | CashOutVATAmountManagement | decimal(18,4) | NN |  |
| 62 | CashOutDiffVATAmountManagement | decimal(18,4) | NN |  |
| 63 | CashOutDiffAccountNumberManagement | nvarchar(20) |  | Account.AccountNumber |
| 64 | CashOutExchangeRateFinance | decimal(20,6) | NN |  |
| 65 | CashOutExchangeRateManagement | decimal(20,6) | NN |  |
| 66 | SAOrderRefDetailID | uniqueidentifier |  | SAOrderDetail.RefDetailID |
| 67 | LOANAgreementID | uniqueidentifier |  | LOANAgreement.LOANAgreementID |
| 68 | VATRateOther | decimal(18,4) |  |  |
| 69 | ContractDetailID | uniqueidentifier |  | ContractDetailInventoryItem.ContractDetailID |
| 70 | SpecificType | int |  |  |
| 71 | VINNumber | nvarchar(200) |  |  |
| 72 | SenderName | nvarchar(200) |  |  |
| 73 | SenderAddress | nvarchar(200) |  |  |
| 74 | SenderTaxCode | nvarchar(200) |  |  |
| 75 | SenderIDNumber | nvarchar(200) |  |  |

## SAInvoice

Rows: 30 | Columns: 98

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | BranchID | uniqueidentifier | NN | OrganizationUnit.OrganizationUnitID |
| 3 | DisplayOnBook | int |  |  |
| 4 | RefType | int | NN |  |
| 5 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 6 | AccountObjectName | nvarchar(400) |  |  |
| 7 | AccountObjectAddress | nvarchar(400) |  |  |
| 8 | AccountObjectTaxCode | nvarchar(50) |  |  |
| 9 | AccountObjectBankAccount | nvarchar(50) |  |  |
| 10 | PaymentMethod | nvarchar(50) |  |  |
| 11 | Buyer | nvarchar(400) |  |  |
| 12 | EmployeeID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 13 | IsPaid | bit | NN |  |
| 14 | IsPosted | bit | NN |  |
| 15 | InvTemplateNo | nvarchar(25) |  |  |
| 16 | InvSeries | nvarchar(20) |  |  |
| 17 | InvNo | nvarchar(25) |  |  |
| 18 | InvDate | datetime |  |  |
| 19 | IncludeInvoice | bit | NN |  |
| 20 | IsAttachList | bit | NN |  |
| 21 | ListNo | nvarchar(20) |  |  |
| 22 | ListDate | datetime |  |  |
| 23 | CommonInventoryName | nvarchar(255) |  |  |
| 24 | ContractCode | nvarchar(50) |  |  |
| 25 | ContractDate | datetime |  |  |
| 26 | PlaceOfDelivery | nvarchar(255) |  |  |
| 27 | PlaceOfReceipt | nvarchar(255) |  |  |
| 28 | BillOfLadingNo | nvarchar(50) |  |  |
| 29 | ContainerNo | nvarchar(50) |  |  |
| 30 | TransportName | nvarchar(128) |  |  |
| 31 | CurrencyID | nvarchar(3) |  | CCY.CurrencyID |
| 32 | ExchangeRate | decimal(18,4) |  |  |
| 33 | TotalSaleAmountOC | decimal(18,4) | NN |  |
| 34 | TotalSaleAmount | decimal(18,4) | NN |  |
| 35 | TotalDiscountAmountOC | decimal(18,4) | NN |  |
| 36 | TotalDiscountAmount | decimal(18,4) | NN |  |
| 37 | TotalVATAmountOC | decimal(18,4) | NN |  |
| 38 | TotalVATAmount | decimal(18,4) | NN |  |
| 39 | TotalAmountOC | decimal(18,4) | NN |  |
| 40 | TotalAmount | decimal(18,4) | NN |  |
| 41 | EditVersion | timestamp |  |  |
| 42 | CreatedDate | datetime |  |  |
| 43 | CreatedBy | nvarchar(50) |  |  |
| 44 | ModifiedDate | datetime |  |  |
| 45 | ModifiedBy | nvarchar(50) |  |  |
| 46 | InvTypeID | int |  |  |
| 47 | isBranchIssued | bit |  |  |
| 48 | CustomField1 | nvarchar(255) |  |  |
| 49 | CustomField2 | nvarchar(255) |  |  |
| 50 | CustomField3 | nvarchar(255) |  |  |
| 51 | CustomField4 | nvarchar(255) |  |  |
| 52 | CustomField5 | nvarchar(255) |  |  |
| 53 | CustomField6 | nvarchar(255) |  |  |
| 54 | CustomField7 | nvarchar(255) |  |  |
| 55 | CustomField8 | nvarchar(255) |  |  |
| 56 | CustomField9 | nvarchar(255) |  |  |
| 57 | CustomField10 | nvarchar(255) |  |  |
| 58 | IsPostedLastYear | bit | NN |  |
| 64 | IsInvoiceReplace | bit | NN |  |
| 65 | AdjustRefID | uniqueidentifier |  |  |
| 66 | AdjustRefType | int |  |  |
| 68 | AdjustJournalMemo | nvarchar(500) |  |  |
| 69 | AdjustPurchasePurposeID | uniqueidentifier |  |  |
| 70 | AdjustVATRate | decimal(18,4) |  |  |
| 71 | AdjustTACareerGroupID | int |  |  |
| 72 | AdjustInvTemplateNo | nvarchar(25) |  |  |
| 73 | AdjustInvSeries | nvarchar(20) |  |  |
| 74 | AdjustInvNo | nvarchar(25) |  |  |
| 75 | AdjustInvDate | datetime |  |  |
| 76 | ExportNontariffZones | bit | NN |  |
| 77 | RefIDMshop | nvarchar(MAX) |  |  |
| 78 | RefNoMshop | nvarchar(MAX) |  |  |
| 79 | IsGetForInvoice | bit | COMP |  |
| 80 | AdjustInvestmentProjectID | uniqueidentifier |  |  |
| 81 | IsReductionInvoice | bit | NN |  |
| 82 | InvoiceCode | nvarchar(100) |  |  |
| 83 | InvoiceSystem | int | NN |  |
| 84 | IsAdjustAutoCalculate | bit |  |  |
| 99 | IsProcessInvoiceError | bit | NN |  |
| 100 | TaxReductionType | int | NN |  |
| 101 | IsSAInvoiceValueAdjustEmptyVat | bit | NN |  |
| 102 | IsDiscountInvoice | bit | NN |  |
| 103 | JournalMemo | nvarchar(500) |  |  |
| 104 | RoomNo | nvarchar(500) |  |  |
| 105 | CheckInDate | datetime |  |  |
| 106 | CheckOutDate | datetime |  |  |
| 107 | BudgetCode | nvarchar(7) |  |  |
| 108 | PassportNumber | nvarchar(20) |  |  |
| 109 | IdentificationNumber | nvarchar(20) |  |  |
| 110 | InvReplaceType | int | NN |  |
| 111 | OldVersion | int | NN |  |
| 112 | EInvoiceType | int |  |  |
| 113 | IsImportEInvoice | bit | NN |  |
| 114 | AccountObjectPhoneNumber | nvarchar(50) |  |  |
| 115 | ShopCode | nvarchar(50) |  |  |
| 116 | ShopName | nvarchar(400) |  |  |
| 117 | ListNoEInvoice | nvarchar(50) |  |  |
| 118 | ListDateEInvoice | datetime |  |  |

## SAInvoiceDetail

Rows: 0 | Columns: 55

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | SAInvoice.RefID |
| 3 | InventoryItemID | uniqueidentifier |  | InventoryItem.InventoryItemID |
| 4 | Description | nvarchar(500) |  |  |
| 5 | UnitID | uniqueidentifier |  | Unit.UnitID |
| 6 | Quantity | decimal(22,8) | NN |  |
| 7 | UnitPrice | decimal(20,6) | NN |  |
| 8 | UnitPriceAfterTax | decimal(18,4) | NN |  |
| 9 | AmountOC | decimal(18,4) | NN |  |
| 10 | Amount | decimal(18,4) | NN |  |
| 11 | DiscountRate | decimal(18,4) |  |  |
| 12 | DiscountAmountOC | decimal(18,4) | NN |  |
| 13 | DiscountAmount | decimal(18,4) | NN |  |
| 14 | VATRate | decimal(18,4) |  |  |
| 15 | VATAmountOC | decimal(18,4) | NN |  |
| 16 | VATAmount | decimal(18,4) | NN |  |
| 17 | IsPromotion | bit | NN |  |
| 18 | SortOrder | int | NN |  |
| 19 | TACareerGroupID | int |  | TACareerGroup.TACareerGroupID |
| 20 | MainUnitID | uniqueidentifier |  |  |
| 21 | MainUnitPrice | decimal(20,6) | NN |  |
| 22 | MainConvertRate | decimal(18,4) | NN |  |
| 23 | MainQuantity | decimal(22,8) | NN |  |
| 24 | ExchangeRateOperator | nvarchar(3) | NN |  |
| 25 | CustomField1 | nvarchar(255) |  |  |
| 26 | CustomField2 | nvarchar(255) |  |  |
| 27 | CustomField3 | nvarchar(255) |  |  |
| 28 | CustomField4 | nvarchar(255) |  |  |
| 29 | CustomField5 | nvarchar(255) |  |  |
| 30 | CustomField6 | nvarchar(255) |  |  |
| 31 | CustomField7 | nvarchar(255) |  |  |
| 32 | CustomField8 | nvarchar(255) |  |  |
| 33 | CustomField9 | nvarchar(255) |  |  |
| 34 | CustomField10 | nvarchar(255) |  |  |
| 35 | PurchasePurposeID | uniqueidentifier |  |  |
| 36 | VATAccount | nvarchar(25) |  |  |
| 37 | TaxType | int |  |  |
| 38 | LotNo | nvarchar(50) |  |  |
| 39 | ExpiryDate | datetime |  |  |
| 40 | NotInVATDeclaration | bit | NN |  |
| 41 | AmountAfterTax | decimal(18,4) |  |  |
| 42 | SAVoucherRefID | uniqueidentifier |  |  |
| 43 | SAVoucherRefDetailID | uniqueidentifier |  |  |
| 44 | InvestmentProjectID | uniqueidentifier |  |  |
| 45 | DeductionsTaxAmount | decimal(18,4) | NN |  |
| 46 | DeductionsTaxAmountOC | decimal(18,4) | NN |  |
| 47 | VATRate406 | decimal(18,4) |  |  |
| 48 | VATRateOther | decimal(18,4) |  |  |
| 49 | IsTradeDiscount | bit | NN |  |
| 50 | SpecificType | int |  |  |
| 51 | VINNumber | nvarchar(200) |  |  |
| 52 | SenderName | nvarchar(200) |  |  |
| 53 | SenderAddress | nvarchar(200) |  |  |
| 54 | SenderTaxCode | nvarchar(200) |  |  |
| 55 | SenderIDNumber | nvarchar(200) |  |  |

## SAInvoicePetroleum

Rows: 0 | Columns: 55

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 3 | DisplayOnBook | int | NN |  |
| 4 | RefType | int | NN |  |
| 5 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 6 | AccountObjectName | nvarchar(400) |  |  |
| 7 | AccountObjectAddress | nvarchar(400) |  |  |
| 8 | AccountObjectTaxCode | nvarchar(50) |  |  |
| 9 | AccountObjectBankAccount | nvarchar(50) |  |  |
| 10 | PaymentMethod | nvarchar(50) |  |  |
| 11 | Buyer | nvarchar(400) |  |  |
| 12 | EmployeeID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 13 | IsPaid | bit | NN |  |
| 14 | IsPosted | bit | NN |  |
| 15 | IsPostedLastYear | bit | NN |  |
| 16 | InvDate | datetime |  |  |
| 17 | InvNo | nvarchar(20) |  |  |
| 18 | IncludeInvoice | bit | NN |  |
| 19 | CurrencyID | nvarchar(3) |  | CCY.CurrencyID |
| 20 | ExchangeRate | decimal(18,4) | NN |  |
| 21 | TotalSaleAmountOC | decimal(18,4) | NN |  |
| 22 | TotalSaleAmount | decimal(18,4) | NN |  |
| 23 | TotalDiscountAmountOC | decimal(18,4) | NN |  |
| 24 | TotalDiscountAmount | decimal(18,4) | NN |  |
| 25 | TotalVATAmountOC | decimal(18,4) | NN |  |
| 26 | TotalVATAmount | decimal(18,4) | NN |  |
| 27 | TotalAmountOC | decimal(18,4) | NN |  |
| 28 | TotalAmount | decimal(18,4) | NN |  |
| 29 | AdjustRefID | uniqueidentifier |  |  |
| 30 | AdjustRefType | int |  |  |
| 31 | AdjustJournalMemo | nvarchar(500) |  |  |
| 32 | AdjustPurchasePurposeID | uniqueidentifier |  |  |
| 33 | AdjustVATRate | decimal(18,4) |  |  |
| 34 | AdjustTACareerGroupID | int |  |  |
| 35 | AdjustInvNo | nvarchar(20) |  |  |
| 36 | AdjustInvDate | datetime |  |  |
| 37 | IsAdjustAutoCalculate | bit |  |  |
| 38 | EditVersion | timestamp |  |  |
| 39 | CreatedDate | datetime |  |  |
| 40 | CreatedBy | nvarchar(50) |  |  |
| 41 | ModifiedDate | datetime |  |  |
| 42 | ModifiedBy | nvarchar(50) |  |  |
| 43 | CustomField1 | nvarchar(255) |  |  |
| 44 | CustomField2 | nvarchar(255) |  |  |
| 45 | CustomField3 | nvarchar(255) |  |  |
| 46 | CustomField4 | nvarchar(255) |  |  |
| 47 | CustomField5 | nvarchar(255) |  |  |
| 48 | CustomField6 | nvarchar(255) |  |  |
| 49 | CustomField7 | nvarchar(255) |  |  |
| 50 | CustomField8 | nvarchar(255) |  |  |
| 51 | CustomField9 | nvarchar(255) |  |  |
| 52 | CustomField10 | nvarchar(255) |  |  |
| 53 | BudgetCode | nvarchar(7) |  |  |
| 54 | PassportNumber | nvarchar(20) |  |  |
| 55 | IdentificationNumber | nvarchar(20) |  |  |

## SAInvoicePetroleumDetail

Rows: 0 | Columns: 41

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier |  | SAInvoicePetroleum.RefID |
| 3 | SortOrder | int | NN |  |
| 4 | InventoryItemID | uniqueidentifier |  | InventoryItem.InventoryItemID |
| 5 | Description | nvarchar(500) |  |  |
| 6 | UnitID | uniqueidentifier |  | Unit.UnitID |
| 7 | Quantity | decimal(22,8) | NN |  |
| 8 | UnitPrice | decimal(20,6) | NN |  |
| 9 | UnitPriceAfterTax | decimal(18,4) | NN |  |
| 10 | AmountOC | decimal(18,4) | NN |  |
| 11 | Amount | decimal(18,4) | NN |  |
| 12 | AmountAfterTax | decimal(18,4) | NN |  |
| 13 | DiscountRate | decimal(18,4) | NN |  |
| 14 | DiscountAmountOC | decimal(18,4) | NN |  |
| 15 | DiscountAmount | decimal(18,4) | NN |  |
| 16 | VATRate | decimal(18,4) |  |  |
| 17 | VATRateOther | decimal(18,4) |  |  |
| 18 | VATAmountOC | decimal(18,4) | NN |  |
| 19 | VATAmount | decimal(18,4) | NN |  |
| 20 | TACareerGroupID | int |  | TACareerGroup.TACareerGroupID |
| 21 | MainUnitID | uniqueidentifier |  |  |
| 22 | MainUnitPrice | decimal(20,6) | NN |  |
| 23 | MainConvertRate | decimal(18,4) | NN |  |
| 24 | MainQuantity | decimal(22,8) | NN |  |
| 25 | ExchangeRateOperator | nvarchar(3) | NN |  |
| 26 | PurchasePurposeID | uniqueidentifier |  |  |
| 27 | LotNo | nvarchar(50) |  |  |
| 28 | ExpiryDate | datetime |  |  |
| 29 | NotInVATDeclaration | bit | NN |  |
| 30 | SAVoucherRefID | uniqueidentifier |  |  |
| 31 | SAVoucherRefDetailID | uniqueidentifier |  |  |
| 32 | CustomField1 | nvarchar(255) |  |  |
| 33 | CustomField2 | nvarchar(255) |  |  |
| 34 | CustomField3 | nvarchar(255) |  |  |
| 35 | CustomField4 | nvarchar(255) |  |  |
| 36 | CustomField5 | nvarchar(255) |  |  |
| 37 | CustomField6 | nvarchar(255) |  |  |
| 38 | CustomField7 | nvarchar(255) |  |  |
| 39 | CustomField8 | nvarchar(255) |  |  |
| 40 | CustomField9 | nvarchar(255) |  |  |
| 41 | CustomField10 | nvarchar(255) |  |  |

## SAInvoicePetroleumReference

Rows: 0 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReferencefID | uniqueidentifier | PK NN |  |
| 2 | SAInvoiceRefID | uniqueidentifier | NN | SAInvoicePetroleum.RefID |
| 3 | VoucherRefID | uniqueidentifier | NN |  |
| 4 | VoucherRefType | int |  |  |
| 5 | ReferenceType | int |  |  |
| 6 | ReferenceCreatedType | int | NN |  |

## SAInvoiceReference

Rows: 30 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReferencefID | uniqueidentifier | PK NN |  |
| 2 | SAInvoiceRefID | uniqueidentifier | NN | SAInvoice.RefID |
| 3 | VoucherRefID | uniqueidentifier | NN |  |
| 4 | VoucherRefType | int |  |  |
| 5 | ReferenceType | int |  |  |
| 6 | ReferenceCreatedType | int | NN |  |

## SAOrder

Rows: 56,253 | Columns: 45

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefDate | datetime | NN |  |
| 3 | RefNo | nvarchar(25) | NN |  |
| 4 | Status | int | NN |  |
| 5 | RefType | int | NN |  |
| 6 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 7 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 8 | AccountObjectName | nvarchar(400) |  |  |
| 9 | AccountObjectAddress | nvarchar(400) |  |  |
| 10 | AccountObjectTaxCode | nvarchar(50) |  |  |
| 11 | Receiver | nvarchar(400) |  |  |
| 12 | EmployeeID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 13 | DeliveryDate | datetime |  |  |
| 14 | IsCalculatedCost | bit | NN |  |
| 15 | PaymentTermID | uniqueidentifier |  | PaymentTerm.PaymentTermID |
| 16 | DueDay | int |  |  |
| 17 | JournalMemo | nvarchar(500) |  |  |
| 18 | ShippingAddress | nvarchar(255) |  |  |
| 23 | OtherTerm | nvarchar(255) |  |  |
| 24 | QuoteRefID | uniqueidentifier |  | SAQuote.RefID |
| 25 | CurrencyID | nvarchar(3) |  | CCY.CurrencyID |
| 26 | ExchangeRate | decimal(18,4) | NN |  |
| 27 | TotalAmountOC | decimal(18,4) | NN |  |
| 28 | TotalAmount | decimal(18,4) | NN |  |
| 29 | TotalDiscountAmountOC | decimal(18,4) | NN |  |
| 30 | TotalDiscountAmount | decimal(18,4) | NN |  |
| 31 | TotalVATAmountOC | decimal(18,4) | NN |  |
| 32 | TotalVATAmount | decimal(18,4) | NN |  |
| 33 | EditVersion | timestamp |  |  |
| 34 | ModifiedBy | nvarchar(50) |  |  |
| 35 | CreatedDate | datetime |  |  |
| 36 | CreatedBy | nvarchar(50) |  |  |
| 37 | ModifiedDate | datetime |  |  |
| 38 | CustomField1 | nvarchar(255) |  |  |
| 39 | CustomField2 | nvarchar(255) |  |  |
| 40 | CustomField3 | nvarchar(255) |  |  |
| 41 | CustomField4 | nvarchar(255) |  |  |
| 42 | CustomField5 | nvarchar(255) |  |  |
| 43 | CustomField6 | nvarchar(255) |  |  |
| 44 | CustomField7 | nvarchar(255) |  |  |
| 45 | CustomField8 | nvarchar(255) |  |  |
| 46 | CustomField9 | nvarchar(255) |  |  |
| 47 | CustomField10 | nvarchar(255) |  |  |
| 48 | LastYearInvoiceAmountOC | decimal(22,8) | NN |  |
| 49 | LastYearInvoiceAmount | decimal(22,8) | NN |  |

## SAOrderDetail

Rows: 57,638 | Columns: 83

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | SAOrder.RefID |
| 3 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 4 | Description | nvarchar(500) |  |  |
| 5 | UnitID | uniqueidentifier |  | Unit.UnitID |
| 6 | Quantity | decimal(22,8) | NN |  |
| 7 | QuantityDeliveredSA | decimal(22,8) | NN |  |
| 8 | QuantityDeliveredIN | decimal(22,8) | NN |  |
| 9 | UnitPrice | decimal(20,6) | NN |  |
| 10 | UnitPriceAfterTax | decimal(20,6) | NN |  |
| 11 | AmountOC | decimal(18,4) | NN |  |
| 12 | Amount | decimal(18,4) | NN |  |
| 13 | DiscountRate | decimal(18,4) |  |  |
| 14 | DiscountAmountOC | decimal(18,4) | NN |  |
| 15 | DiscountAmount | decimal(18,4) | NN |  |
| 16 | VATRate | decimal(18,4) |  |  |
| 17 | VATAmountOC | decimal(18,4) | NN |  |
| 18 | VATAmount | decimal(18,4) | NN |  |
| 19 | MainQuantity | decimal(22,8) | NN |  |
| 20 | MainUnitID | uniqueidentifier |  | Unit.UnitID |
| 21 | MainUnitPrice | decimal(20,6) | NN |  |
| 22 | MainConvertRate | decimal(18,4) | NN |  |
| 23 | ExchangeRateOperator | nvarchar(3) | NN |  |
| 24 | SortOrder | int | NN |  |
| 25 | CustomField1 | nvarchar(255) |  |  |
| 26 | CustomField2 | nvarchar(255) |  |  |
| 27 | CustomField3 | nvarchar(255) |  |  |
| 28 | CustomField4 | nvarchar(255) |  |  |
| 29 | CustomField5 | nvarchar(255) |  |  |
| 30 | CustomField6 | nvarchar(255) |  |  |
| 31 | CustomField7 | nvarchar(255) |  |  |
| 32 | CustomField8 | nvarchar(255) |  |  |
| 33 | CustomField9 | nvarchar(255) |  |  |
| 34 | CustomField10 | nvarchar(255) |  |  |
| 35 | SAQuoteRefDetailID | uniqueidentifier |  | SAQuoteDetail.RefDetailID |
| 36 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 37 | ProjectWorkID | uniqueidentifier |  |  |
| 38 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 39 | OrganizationUnitID | uniqueidentifier |  |  |
| 40 | JobID | uniqueidentifier |  |  |
| 41 | ListItemID | uniqueidentifier |  |  |
| 42 | StockID | uniqueidentifier |  |  |
| 43 | LotNo | nvarchar(50) |  |  |
| 44 | ExpiryDate | datetime |  |  |
| 45 | Specificity | nvarchar(MAX) |  |  |
| 46 | IsPromotion | bit |  |  |
| 47 | QuantityDeliveredINLastYear | decimal(22,8) | NN |  |
| 48 | QuantityDeliveredSALastYear | decimal(22,8) | NN |  |
| 49 | MainQuantityDeliveredSA | decimal(22,8) | NN |  |
| 50 | MainQuantityDeliveredSALastYear | decimal(22,8) | NN |  |
| 51 | MainQuantityDeliveredIN | decimal(22,8) | NN |  |
| 52 | MainQuantityDeliveredINLastYear | decimal(22,8) | NN |  |
| 53 | GuarantyPeriod | nvarchar(100) |  |  |
| 54 | LastYearDeliveredAmountOC | decimal(18,4) | NN |  |
| 55 | LastYearDeliveredAmount | decimal(18,4) | NN |  |
| 56 | LastYearDeliveredBeforeTaxAmountOC | decimal(18,4) | NN |  |
| 57 | LastYearDeliveredBeforeTaxAmount | decimal(18,4) | NN |  |
| 58 | PanelLengthQuantity | decimal(22,8) | NN |  |
| 59 | PanelWidthQuantity | decimal(22,8) | NN |  |
| 60 | PanelHeightQuantity | decimal(22,8) | NN |  |
| 61 | PanelRadiusQuantity | decimal(22,8) | NN |  |
| 62 | PanelQuantity | decimal(22,8) | NN |  |
| 63 | ContractDetailID | uniqueidentifier |  |  |
| 64 | VATRateOther | decimal(18,4) |  |  |
| 65 | InventoryItemSource | nvarchar(255) |  |  |
| 66 | CustomFieldQuantity1 | decimal(18,4) | NN |  |
| 67 | CustomFieldQuantity2 | decimal(18,4) | NN |  |
| 68 | CustomFieldQuantity3 | decimal(18,4) | NN |  |
| 69 | CustomFieldUnitPrice1 | decimal(18,4) | NN |  |
| 70 | CustomFieldUnitPrice2 | decimal(18,4) | NN |  |
| 71 | CustomFieldUnitPrice3 | decimal(18,4) | NN |  |
| 72 | CustomFieldUnitPriceOC1 | decimal(18,4) | NN |  |
| 73 | CustomFieldUnitPriceOC2 | decimal(18,4) | NN |  |
| 74 | CustomFieldUnitPriceOC3 | decimal(18,4) | NN |  |
| 75 | CustomFieldAmount1 | decimal(18,4) | NN |  |
| 76 | CustomFieldAmount2 | decimal(18,4) | NN |  |
| 77 | CustomFieldAmount3 | decimal(18,4) | NN |  |
| 78 | CustomFieldAmountOC1 | decimal(18,4) | NN |  |
| 79 | CustomFieldAmountOC2 | decimal(18,4) | NN |  |
| 80 | CustomFieldAmountOC3 | decimal(18,4) | NN |  |
| 81 | CustomFieldDateTime1 | datetime |  |  |
| 82 | CustomFieldDateTime2 | datetime |  |  |
| 83 | CustomFieldDateTime3 | datetime |  |  |

## SAPolicy

Rows: 0 | Columns: 16

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SAPolicyID | uniqueidentifier | PK NN |  |
| 2 | PolicyName | nvarchar(255) | NN |  |
| 3 | Inactive | bit | NN |  |
| 4 | CreatedDate | datetime |  |  |
| 5 | CreatedBy | nvarchar(50) |  |  |
| 6 | ModifiedDate | datetime |  |  |
| 7 | ModifiedBy | nvarchar(50) |  |  |
| 8 | Description | nvarchar(255) |  |  |
| 9 | CurrencyID | nvarchar(3) |  | CCY.CurrencyID |
| 10 | IndexUnitConvert | int |  |  |
| 11 | IsSetDiscount | bit | NN |  |
| 12 | ProductType | int |  |  |
| 13 | SaleGroupType | int |  |  |
| 14 | FromDate | datetime |  |  |
| 15 | ToDate | datetime |  |  |
| 16 | PolicyType | int |  |  |

## SAPolicyPrice

Rows: 0 | Columns: 12

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SAPolicyPriceID | uniqueidentifier | PK NN |  |
| 2 | SAPolicySaleGroupID | uniqueidentifier | NN | SAPolicySaleGroup.SAPolicySaleGroupID |
| 3 | InventoryItemID | uniqueidentifier |  | InventoryItem.InventoryItemID |
| 4 | Price | decimal(20,6) | NN |  |
| 9 | SAPolicyID | uniqueidentifier |  |  |
| 10 | UnitID | uniqueidentifier |  | Unit.UnitID |
| 11 | DiscountType | int | NN |  |
| 12 | DiscountValue | decimal(18,4) | NN |  |
| 13 | InventoryCategoryID | uniqueidentifier |  |  |
| 14 | BaseOn | int |  |  |
| 15 | MethodID | int |  |  |
| 16 | ValueAdjust | decimal(18,4) | NN |  |

## SAPolicySaleCustomer

Rows: 0 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SAPolicySaleCustomerID | uniqueidentifier | PK NN |  |
| 2 | SAPolicySaleGroupID | uniqueidentifier | NN | SAPolicySaleGroup.SAPolicySaleGroupID |
| 3 | AccountObjectID | uniqueidentifier | NN | AccountObject.AccountObjectID |
| 8 | SAPolicyID | uniqueidentifier |  |  |

## SAPolicySaleGroup

Rows: 0 | Columns: 13

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SAPolicySaleGroupID | uniqueidentifier | PK NN |  |
| 2 | SAPolicyID | uniqueidentifier | NN | SAPolicy.SAPolicyID |
| 3 | SASaleGroupID | uniqueidentifier |  |  |
| 4 | BaseOn | int |  |  |
| 5 | MethodID | int |  |  |
| 6 | ValueAdjust | decimal(18,4) | NN |  |
| 11 | DiscountType | int | NN |  |
| 12 | DiscountValue | decimal(18,4) | NN |  |
| 13 | SortOrder | int |  |  |
| 14 | SaleGroupName | nvarchar(400) | NN |  |
| 15 | Description | nvarchar(255) |  |  |
| 16 | AccountObjectID | uniqueidentifier |  |  |
| 17 | AccountObjectGroupID | uniqueidentifier |  |  |

## SAQuote

Rows: 0 | Columns: 36

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefNo | nvarchar(25) | NN |  |
| 3 | RefDate | datetime | NN |  |
| 4 | EffectiveDate | datetime |  |  |
| 5 | RefType | int | NN |  |
| 6 | BranchID | uniqueidentifier |  |  |
| 7 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 8 | AccountObjectName | nvarchar(400) |  |  |
| 9 | AccountObjectAddress | nvarchar(400) |  |  |
| 10 | AccountObjectTaxCode | nvarchar(50) |  |  |
| 11 | AccountObjectContactName | nvarchar(400) |  |  |
| 12 | JournalMemo | nvarchar(500) |  |  |
| 13 | CurrencyID | nvarchar(3) |  | CCY.CurrencyID |
| 14 | ExchangeRate | decimal(18,4) | NN |  |
| 15 | TotalAmountOC | decimal(18,4) | NN |  |
| 16 | TotalAmount | decimal(18,4) | NN |  |
| 17 | TotalDiscountAmountOC | decimal(18,4) | NN |  |
| 18 | TotalDiscountAmount | decimal(18,4) | NN |  |
| 19 | TotalVATAmountOC | decimal(18,4) | NN |  |
| 20 | TotalVATAmount | decimal(18,4) | NN |  |
| 21 | EditVersion | timestamp |  |  |
| 22 | ModifiedDate | datetime |  |  |
| 23 | CreatedBy | nvarchar(50) |  |  |
| 24 | CreatedDate | datetime |  |  |
| 25 | ModifiedBy | nvarchar(50) |  |  |
| 26 | CustomField1 | nvarchar(255) |  |  |
| 27 | CustomField2 | nvarchar(255) |  |  |
| 28 | CustomField3 | nvarchar(255) |  |  |
| 29 | CustomField4 | nvarchar(255) |  |  |
| 30 | CustomField5 | nvarchar(255) |  |  |
| 31 | CustomField6 | nvarchar(255) |  |  |
| 32 | CustomField7 | nvarchar(255) |  |  |
| 33 | CustomField8 | nvarchar(255) |  |  |
| 34 | CustomField9 | nvarchar(255) |  |  |
| 35 | CustomField10 | nvarchar(255) |  |  |
| 36 | EmployeeID | uniqueidentifier |  |  |

## SAQuoteDetail

Rows: 0 | Columns: 52

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 3 | RefID | uniqueidentifier | NN | SAQuote.RefID |
| 4 | Description | nvarchar(500) |  |  |
| 6 | Quantity | decimal(22,8) | NN |  |
| 7 | UnitPrice | decimal(20,6) | NN |  |
| 8 | AmountOC | decimal(18,4) | NN |  |
| 9 | Amount | decimal(18,4) | NN |  |
| 10 | DiscountRate | decimal(18,4) | NN |  |
| 11 | DiscountAmountOC | decimal(18,4) | NN |  |
| 12 | DiscountAmount | decimal(18,4) | NN |  |
| 13 | VATRate | decimal(18,4) |  |  |
| 14 | VATAmountOC | decimal(18,4) | NN |  |
| 15 | VATAmount | decimal(18,4) | NN |  |
| 16 | SortOrder | int | NN |  |
| 17 | UnitID | uniqueidentifier |  | Unit.UnitID |
| 18 | UnitPriceAfterTax | decimal(20,6) | NN |  |
| 19 | CustomField1 | nvarchar(255) |  |  |
| 20 | CustomField2 | nvarchar(255) |  |  |
| 21 | CustomField3 | nvarchar(255) |  |  |
| 22 | CustomField4 | nvarchar(255) |  |  |
| 23 | CustomField5 | nvarchar(255) |  |  |
| 24 | CustomField6 | nvarchar(255) |  |  |
| 25 | CustomField7 | nvarchar(255) |  |  |
| 26 | CustomField8 | nvarchar(255) |  |  |
| 27 | CustomField9 | nvarchar(255) |  |  |
| 28 | CustomField10 | nvarchar(255) |  |  |
| 29 | OrderID | uniqueidentifier |  |  |
| 30 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 31 | ProjectWorkID | uniqueidentifier |  |  |
| 32 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 33 | OrganizationUnitID | uniqueidentifier |  |  |
| 34 | JobID | uniqueidentifier |  |  |
| 35 | ListItemID | uniqueidentifier |  |  |
| 36 | Specificity | nvarchar(MAX) |  |  |
| 37 | ExchangeRateOperator | nvarchar(3) | NN |  |
| 38 | MainQuantity | decimal(22,8) | NN |  |
| 39 | MainUnitID | uniqueidentifier |  | Unit.UnitID |
| 40 | MainUnitPrice | decimal(20,6) | NN |  |
| 41 | MainConvertRate | decimal(18,4) | NN |  |
| 42 | IsPromotion | bit |  |  |
| 43 | GuarantyPeriod | nvarchar(100) |  |  |
| 44 | PanelLengthQuantity | decimal(22,8) | NN |  |
| 45 | PanelWidthQuantity | decimal(22,8) | NN |  |
| 46 | PanelHeightQuantity | decimal(22,8) | NN |  |
| 47 | PanelRadiusQuantity | decimal(22,8) | NN |  |
| 48 | PanelQuantity | decimal(22,8) | NN |  |
| 49 | VATRateOther | decimal(18,4) |  |  |
| 50 | InventoryItemSource | nvarchar(255) |  |  |
| 51 | UnitPriceAfterDiscount | decimal(20,6) | NN |  |
| 52 | AmountAfterDiscountOC | decimal(18,4) | NN |  |
| 53 | AmountAfterDiscount | decimal(18,4) | NN |  |

## SAReturn

Rows: 5 | Columns: 61

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | BranchID | uniqueidentifier | NN | OrganizationUnit.OrganizationUnitID |
| 3 | DisplayOnBook | int |  |  |
| 4 | RefType | int | NN |  |
| 5 | RefDate | datetime | NN |  |
| 6 | PostedDate | datetime | NN |  |
| 7 | RefNoFinance | nvarchar(20) |  |  |
| 8 | RefNoManagement | nvarchar(20) |  |  |
| 9 | IsPostedFinance | bit | NN |  |
| 10 | IsPostedManagement | bit | NN |  |
| 11 | PUInvoiceRefID | uniqueidentifier |  | PUInvoice.RefID |
| 12 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 13 | AccountObjectName | nvarchar(400) |  |  |
| 14 | AccountObjectAddress | nvarchar(400) |  |  |
| 15 | Receiver | nvarchar(400) |  |  |
| 16 | JournalMemo | nvarchar(500) |  |  |
| 17 | SupplierID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 18 | SupplierName | nvarchar(400) |  |  |
| 19 | CurrencyID | nvarchar(3) |  | CCY.CurrencyID |
| 20 | ExchangeRate | decimal(18,4) |  |  |
| 21 | EmployeeID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 22 | DocumentIncluded | nvarchar(255) |  |  |
| 23 | TotalSaleAmountOC | decimal(18,4) | NN |  |
| 24 | TotalSaleAmount | decimal(18,4) | NN |  |
| 25 | TotalVATAmountOC | decimal(18,4) |  |  |
| 26 | TotalVATAmount | decimal(18,4) | NN |  |
| 27 | TotalDiscountAmountOC | decimal(18,4) | NN |  |
| 28 | TotalDiscountAmount | decimal(18,4) | NN |  |
| 29 | TotalAmountOC | decimal(18,4) | NN |  |
| 30 | TotalAmount | decimal(18,4) | NN |  |
| 31 | IsPostedCashBookFinance | bit |  |  |
| 32 | IsPostedCashBookManagement | bit |  |  |
| 33 | CashBookPostedDate | datetime |  |  |
| 34 | EditVersion | timestamp |  |  |
| 35 | RefOrder | int | NN |  |
| 36 | CreatedDate | datetime |  |  |
| 37 | CreatedBy | nvarchar(50) |  |  |
| 38 | ModifiedDate | datetime |  |  |
| 39 | ModifiedBy | nvarchar(50) |  |  |
| 40 | CustomField1 | nvarchar(255) |  |  |
| 41 | CustomField2 | nvarchar(255) |  |  |
| 42 | CustomField3 | nvarchar(255) |  |  |
| 43 | CustomField4 | nvarchar(255) |  |  |
| 44 | CustomField5 | nvarchar(255) |  |  |
| 45 | CustomField6 | nvarchar(255) |  |  |
| 46 | CustomField7 | nvarchar(255) |  |  |
| 47 | CustomField8 | nvarchar(255) |  |  |
| 48 | CustomField9 | nvarchar(255) |  |  |
| 49 | CustomField10 | nvarchar(255) |  |  |
| 50 | CABAAmountOC | decimal(18,4) | NN |  |
| 51 | CABAAmount | decimal(18,4) | NN |  |
| 52 | InvNo | nvarchar(500) |  |  |
| 53 | InvDate | datetime |  |  |
| 54 | InvSeries | nvarchar(20) |  |  |
| 55 | IsReturnWithInward | bit | NN |  |
| 56 | INInwardRefID | uniqueidentifier |  |  |
| 57 | IsCreatedINInwardLastYear | bit | NN |  |
| 58 | RefIDMshop | nvarchar(MAX) |  |  |
| 59 | RefNoMshop | nvarchar(MAX) |  |  |
| 60 | IsSellerIssueAdjustInvoices | bit | NN |  |
| 61 | SAInvoiceAdjustRefID | uniqueidentifier |  |  |

## SAReturnDetail

Rows: 5 | Columns: 81

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | SAReturn.RefID |
| 3 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 4 | Description | nvarchar(500) |  |  |
| 5 | DebitAccount | nvarchar(20) |  | Account.AccountNumber |
| 6 | CreditAccount | nvarchar(20) |  | Account.AccountNumber |
| 7 | UnitID | uniqueidentifier |  | Unit.UnitID |
| 8 | Quantity | decimal(22,8) | NN |  |
| 9 | UnitPrice | decimal(20,6) | NN |  |
| 10 | AmountOC | decimal(18,4) | NN |  |
| 11 | Amount | decimal(18,4) | NN |  |
| 12 | DiscountRate | decimal(18,4) |  |  |
| 13 | DiscountAmountOC | decimal(18,4) | NN |  |
| 14 | DiscountAmount | decimal(18,4) | NN |  |
| 15 | DiscountAccount | nvarchar(20) |  | Account.AccountNumber |
| 16 | VATRate | decimal(18,4) |  |  |
| 17 | VATAmountOC | decimal(18,4) | NN |  |
| 18 | VATAmount | decimal(18,4) | NN |  |
| 19 | VATAccount | nvarchar(20) |  | Account.AccountNumber |
| 20 | IsPromotion | bit | NN |  |
| 21 | LotNo | nvarchar(50) |  |  |
| 22 | ExpiryDate | datetime |  |  |
| 23 | ListItemID | uniqueidentifier |  | ListItem.ListItemID |
| 24 | PurchasePurposeID | uniqueidentifier |  | PurchasePurpose.PurchasePurposeID |
| 25 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 26 | OrderID | uniqueidentifier |  | SAOrder.RefID |
| 27 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 28 | ProjectWorkID | uniqueidentifier |  | ProjectWork.ProjectWorkID |
| 29 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 30 | SAVoucherRefID | uniqueidentifier |  | SAVoucher.RefID |
| 31 | SAVoucherRefDetailID | uniqueidentifier |  |  |
| 32 | MainUnitID | uniqueidentifier |  | Unit.UnitID |
| 33 | MainUnitPrice | decimal(20,6) | NN |  |
| 34 | MainConvertRate | decimal(18,4) | NN |  |
| 35 | MainQuantity | decimal(22,8) | NN |  |
| 36 | SortOrder | int | NN |  |
| 37 | CustomField1 | nvarchar(255) |  |  |
| 38 | CustomField2 | nvarchar(255) |  |  |
| 39 | CustomField3 | nvarchar(255) |  |  |
| 40 | CustomField4 | nvarchar(255) |  |  |
| 41 | CustomField5 | nvarchar(255) |  |  |
| 42 | CustomField6 | nvarchar(255) |  |  |
| 43 | CustomField7 | nvarchar(255) |  |  |
| 44 | CustomField8 | nvarchar(255) |  |  |
| 45 | CustomField9 | nvarchar(255) |  |  |
| 46 | CustomField10 | nvarchar(255) |  |  |
| 47 | TACareerGroupID | int |  | TACareerGroup.TACareerGroupID |
| 48 | ExchangeRateOperator | nvarchar(3) | NN |  |
| 49 | PUInvoiceRefID | uniqueidentifier |  | PUInvoice.RefID |
| 50 | BudgetItemID | uniqueidentifier |  | BudgetItem.BudgetItemID |
| 51 | JobID | uniqueidentifier |  | Job.JobID |
| 52 | BankAccountID | uniqueidentifier |  | BankAccount.BankAccountID |
| 53 | VATDescription | nvarchar(255) |  |  |
| 54 | UnResonableCost | bit | NN |  |
| 55 | StockID | uniqueidentifier |  |  |
| 56 | NotInVATDeclaration | bit | NN |  |
| 58 | CashOutAmountFinance | decimal(18,4) | NN |  |
| 59 | CashOutDiffAmountFinance | decimal(18,4) | NN |  |
| 60 | CashOutVATAmountFinance | decimal(18,4) | NN |  |
| 61 | CashOutDiffVATAmountFinance | decimal(18,4) | NN |  |
| 62 | CashOutDiffAccountNumberFinance | nvarchar(20) |  | Account.AccountNumber |
| 64 | CashOutAmountManagement | decimal(18,4) | NN |  |
| 65 | CashOutDiffAmountManagement | decimal(18,4) | NN |  |
| 66 | CashOutVATAmountManagement | decimal(18,4) | NN |  |
| 67 | CashOutDiffVATAmountManagement | decimal(18,4) | NN |  |
| 68 | CashOutDiffAccountNumberManagement | nvarchar(20) |  | Account.AccountNumber |
| 69 | CashOutExchangeRateFinance | decimal(20,6) | NN |  |
| 70 | CashOutExchangeRateManagement | decimal(20,6) | NN |  |
| 71 | SAOrderRefDetailID | uniqueidentifier |  | SAOrderDetail.RefDetailID |
| 72 | UnitPriceAfterTax | decimal(20,6) | NN |  |
| 73 | EInvoiceItemName | nvarchar(500) |  |  |
| 74 | LOANAgreementID | uniqueidentifier |  | LOANAgreement.LOANAgreementID |
| 75 | InvestmentProjectID | uniqueidentifier |  | InvestmentProject.InvestmentProjectID |
| 76 | VATRateOther | decimal(18,4) |  |  |
| 77 | ContractDetailID | uniqueidentifier |  | ContractDetailInventoryItem.ContractDetailID |
| 78 | SpecificType | int |  |  |
| 79 | VINNumber | nvarchar(200) |  |  |
| 80 | SenderName | nvarchar(200) |  |  |
| 81 | SenderAddress | nvarchar(200) |  |  |
| 82 | SenderTaxCode | nvarchar(200) |  |  |
| 83 | SenderIDNumber | nvarchar(200) |  |  |

## SAReturnInwardReferenceDetail

Rows: 5 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReferenceID | uniqueidentifier | PK NN |  |
| 2 | SAReturnRefDetailID | uniqueidentifier | NN | SAReturnDetail.RefDetailID |
| 3 | InwardRefDetailID | uniqueidentifier | NN | INInwardDetail.RefDetailID |

## SASaleGroup

Rows: 0 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SASaleGroupID | uniqueidentifier | PK NN |  |
| 2 | SaleGroupCode | nvarchar(50) | NN |  |
| 3 | SaleGroupName | nvarchar(400) | NN |  |
| 4 | Description | nvarchar(255) |  |  |
| 5 | Inactive | bit | NN |  |
| 6 | CreatedDate | datetime |  |  |
| 7 | CreatedBy | nvarchar(50) |  |  |
| 8 | ModifiedDate | datetime |  |  |
| 9 | ModifiedBy | nvarchar(50) |  |  |

## SASaleGroupDetail

Rows: 0 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SASaleGroupDetailID | uniqueidentifier | PK NN |  |
| 2 | SASaleGroupID | uniqueidentifier | NN | SASaleGroup.SASaleGroupID |
| 3 | AccountObjectID | uniqueidentifier | NN | AccountObject.AccountObjectID |
| 4 | SortOrder | int |  |  |

## SAVoucher

Rows: 15,394 | Columns: 79

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | BranchID | uniqueidentifier | NN | OrganizationUnit.OrganizationUnitID |
| 3 | DisplayOnBook | int |  |  |
| 4 | RefType | int | NN |  |
| 5 | RefDate | datetime | NN |  |
| 6 | PostedDate | datetime | NN |  |
| 7 | RefNoFinance | nvarchar(20) |  |  |
| 8 | RefNoManagement | nvarchar(20) |  |  |
| 9 | IsPostedFinance | bit | NN |  |
| 10 | IsPostedManagement | bit | NN |  |
| 11 | IncludeInvoice | bit | NN |  |
| 12 | IsInvoiceExported | bit | NN |  |
| 13 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 14 | AccountObjectName | nvarchar(400) |  |  |
| 15 | AccountObjectAddress | nvarchar(400) |  |  |
| 16 | Payer | nvarchar(400) |  |  |
| 17 | JournalMemo | nvarchar(500) |  |  |
| 18 | SupplierID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 19 | SupplierName | nvarchar(400) |  |  |
| 20 | EmployeeID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 21 | DocumentIncluded | nvarchar(255) |  |  |
| 22 | IsPaid | bit | NN |  |
| 23 | IsOutwardExported | int |  |  |
| 24 | PaymentTermID | uniqueidentifier |  | PaymentTerm.PaymentTermID |
| 25 | DueDay | int |  |  |
| 26 | DueDate | datetime |  |  |
| 27 | CurrencyID | nvarchar(3) |  | CCY.CurrencyID |
| 28 | ExchangeRate | decimal(18,4) |  |  |
| 29 | TotalSaleAmountOC | decimal(18,4) | NN |  |
| 30 | TotalSaleAmount | decimal(18,4) | NN |  |
| 31 | TotalAmountOC | decimal(18,4) | NN |  |
| 32 | TotalAmount | decimal(18,4) | NN |  |
| 33 | TotalDiscountAmountOC | decimal(18,4) | NN |  |
| 34 | TotalDiscountAmount | decimal(18,4) | NN |  |
| 35 | TotalVATAmountOC | decimal(18,4) | NN |  |
| 36 | TotalVATAmount | decimal(18,4) | NN |  |
| 37 | TotalExportTaxAmountOC | decimal(18,4) | NN |  |
| 38 | TotalExportTaxAmount | decimal(18,4) | NN |  |
| 39 | IsPostedCashBookFinance | bit |  |  |
| 40 | IsPostedCashBookManagement | bit |  |  |
| 41 | CashBookPostedDate | datetime |  |  |
| 42 | DebtStatus | int |  |  |
| 43 | RefOrder | int | NN |  |
| 44 | EditVersion | timestamp |  |  |
| 45 | CreatedDate | datetime |  |  |
| 46 | CreatedBy | nvarchar(50) |  |  |
| 47 | ModifiedDate | datetime |  |  |
| 48 | ModifiedBy | nvarchar(50) |  |  |
| 49 | CustomField1 | nvarchar(255) |  |  |
| 50 | CustomField2 | nvarchar(255) |  |  |
| 51 | CustomField3 | nvarchar(255) |  |  |
| 52 | CustomField4 | nvarchar(255) |  |  |
| 53 | CustomField5 | nvarchar(255) |  |  |
| 54 | CustomField6 | nvarchar(255) |  |  |
| 55 | CustomField7 | nvarchar(255) |  |  |
| 56 | CustomField8 | nvarchar(255) |  |  |
| 57 | CustomField9 | nvarchar(255) |  |  |
| 58 | CustomField10 | nvarchar(255) |  |  |
| 59 | BankAccountID | uniqueidentifier |  | BankAccount.BankAccountID |
| 60 | BankName | nvarchar(255) |  |  |
| 61 | CABAAmountOC | decimal(18,4) | NN |  |
| 62 | CABAAmount | decimal(18,4) | NN |  |
| 63 | InvNo | nvarchar(500) |  |  |
| 64 | InvDate | datetime |  |  |
| 65 | InvSeries | nvarchar(20) |  |  |
| 66 | IsSaleWithOutward | bit | NN |  |
| 67 | AccountObjectTaxCode | nvarchar(50) |  |  |
| 68 | IsInvoiceExportedLastYear | bit | NN |  |
| 69 | PUVoucherRefID | uniqueidentifier |  |  |
| 70 | ShippingAddress | nvarchar(255) |  |  |
| 71 | OtherTerm | nvarchar(255) |  |  |
| 72 | ExportNontariffZones | bit | NN |  |
| 73 | RefIDMshop | nvarchar(MAX) |  |  |
| 74 | RefNoMshop | nvarchar(MAX) |  |  |
| 75 | IsReductionInvoice | bit | NN |  |
| 76 | TaxReductionType | int | NN |  |
| 78 | IsInvoiceCal | bit | NN |  |
| 79 | ShopCode | nvarchar(50) |  |  |
| 80 | ShopName | nvarchar(50) |  |  |

## SAVoucherDetail

Rows: 15,972 | Columns: 88

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | SAVoucher.RefID |
| 3 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 4 | Description | nvarchar(500) |  |  |
| 5 | DebitAccount | nvarchar(20) |  | Account.AccountNumber |
| 6 | CreditAccount | nvarchar(20) |  | Account.AccountNumber |
| 7 | UnitID | uniqueidentifier |  | Unit.UnitID |
| 8 | Quantity | decimal(22,8) | NN |  |
| 9 | UnitPrice | decimal(20,6) | NN |  |
| 10 | UnitPriceAfterTax | decimal(20,6) | NN |  |
| 11 | AmountOC | decimal(18,4) | NN |  |
| 12 | Amount | decimal(18,4) |  |  |
| 13 | DiscountRate | decimal(18,4) | NN |  |
| 14 | DiscountAmountOC | decimal(18,4) | NN |  |
| 15 | DiscountAmount | decimal(18,4) | NN |  |
| 16 | DiscountAccount | nvarchar(20) |  | Account.AccountNumber |
| 17 | VATRate | decimal(18,4) |  |  |
| 18 | VATAmountOC | decimal(18,4) | NN |  |
| 19 | VATAmount | decimal(18,4) | NN |  |
| 20 | VATAccount | nvarchar(20) |  | Account.AccountNumber |
| 22 | FOBAmount | decimal(18,4) | NN |  |
| 23 | ExportTaxRate | decimal(18,4) | NN |  |
| 25 | ExportTaxAmount | decimal(18,4) | NN |  |
| 26 | ExportTaxAccount | nvarchar(20) |  | Account.AccountNumber |
| 27 | OrderID | uniqueidentifier |  | SAOrder.RefID |
| 28 | SAOrderRefDetailID | uniqueidentifier |  | SAOrderDetail.RefDetailID |
| 29 | LotNo | nvarchar(50) |  |  |
| 30 | ExpiryDate | datetime |  |  |
| 31 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 32 | ProjectWorkID | uniqueidentifier |  | ProjectWork.ProjectWorkID |
| 33 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 34 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 35 | ListItemID | uniqueidentifier |  | ListItem.ListItemID |
| 36 | IsPromotion | bit | NN |  |
| 37 | MainUnitID | uniqueidentifier |  | Unit.UnitID |
| 38 | MainUnitPrice | decimal(20,6) | NN |  |
| 39 | MainConvertRate | decimal(18,4) | NN |  |
| 40 | MainQuantity | decimal(22,8) | NN |  |
| 41 | ExchangeRateOperator | nvarchar(3) | NN |  |
| 42 | SortOrder | int | NN |  |
| 43 | CustomField1 | nvarchar(255) |  |  |
| 44 | CustomField2 | nvarchar(255) |  |  |
| 45 | CustomField3 | nvarchar(255) |  |  |
| 46 | CustomField4 | nvarchar(255) |  |  |
| 47 | CustomField5 | nvarchar(255) |  |  |
| 48 | CustomField6 | nvarchar(255) |  |  |
| 49 | CustomField7 | nvarchar(255) |  |  |
| 50 | CustomField8 | nvarchar(255) |  |  |
| 51 | CustomField9 | nvarchar(255) |  |  |
| 52 | CustomField10 | nvarchar(255) |  |  |
| 53 | TACareerGroupID | int |  | TACareerGroup.TACareerGroupID |
| 54 | BudgetItemID | uniqueidentifier |  | BudgetItem.BudgetItemID |
| 55 | SAInvoiceRefID | uniqueidentifier |  | SAInvoice.RefID |
| 56 | ContractDetailID | uniqueidentifier |  | ContractDetailInventoryItem.ContractDetailID |
| 57 | SAQuoteRefDetailID | uniqueidentifier |  | SAQuoteDetail.RefDetailID |
| 60 | JobID | uniqueidentifier |  | Job.JobID |
| 61 | StockID | uniqueidentifier |  | Stock.StockID |
| 62 | VATDescription | nvarchar(255) |  |  |
| 63 | UnResonableCost | bit | NN |  |
| 64 | NotInVATDeclaration | bit | NN |  |
| 65 | PUVoucherRefID | uniqueidentifier |  |  |
| 66 | GuarantyPeriod | nvarchar(100) |  |  |
| 67 | OutwardRefID | uniqueidentifier |  |  |
| 68 | AccountObjectID | uniqueidentifier |  |  |
| 69 | AccountObjectName | nvarchar(400) |  |  |
| 70 | AccountObjectAddress | nvarchar(400) |  |  |
| 71 | INTransferRefID | uniqueidentifier |  |  |
| 72 | INTransferRefDetailID | uniqueidentifier |  |  |
| 73 | PanelLengthQuantity | decimal(22,8) | NN |  |
| 74 | PanelWidthQuantity | decimal(22,8) | NN |  |
| 75 | PanelHeightQuantity | decimal(22,8) | NN |  |
| 76 | PanelRadiusQuantity | decimal(22,8) | NN |  |
| 77 | PanelQuantity | decimal(22,8) | NN |  |
| 78 | PUVoucherRefDetailID | uniqueidentifier |  |  |
| 79 | AmountAfterTax | decimal(18,4) |  |  |
| 80 | QuantityBilled | decimal(22,8) |  |  |
| 81 | MainQuantityBilled | decimal(22,8) |  |  |
| 82 | LOANAgreementID | uniqueidentifier |  | LOANAgreement.LOANAgreementID |
| 83 | DeductionsTaxAmount | decimal(18,4) | NN |  |
| 84 | DeductionsTaxAmountOC | decimal(18,4) | NN |  |
| 85 | VATRate406 | decimal(18,4) |  |  |
| 86 | VATRateOther | decimal(18,4) |  |  |
| 87 | SpecificType | int |  |  |
| 88 | VINNumber | nvarchar(200) |  |  |
| 89 | SenderName | nvarchar(200) |  |  |
| 90 | SenderAddress | nvarchar(200) |  |  |
| 91 | SenderTaxCode | nvarchar(200) |  |  |
| 92 | SenderIDNumber | nvarchar(200) |  |  |

## SaleOutwardReference

Rows: 15,359 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReferencefID | uniqueidentifier | PK NN |  |
| 2 | SAVoucherRefID | uniqueidentifier | NN | SAVoucher.RefID |
| 3 | INOutwardRefID | uniqueidentifier | NN | INOutward.RefID |
| 4 | ReferenceType | int | NN |  |

## SaleOutwardReferenceDetail

Rows: 15,668 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReferencefID | uniqueidentifier | PK NN |  |
| 2 | SAVoucherRefDetailID | uniqueidentifier | NN | SAVoucherDetail.RefDetailID |
| 3 | INOutwardRefDetailID | uniqueidentifier | NN | INOutwardDetail.RefDetailID |

# 05 — PU Mua hàng

## PUContract

Rows: 0 | Columns: 46

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | PUContractID | uniqueidentifier | PK NN |  |
| 2 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 3 | ContractCode | nvarchar(50) |  |  |
| 4 | SignDate | datetime | NN |  |
| 5 | Subject | nvarchar(255) |  |  |
| 6 | CurrencyID | nvarchar(3) |  | CCY.CurrencyID |
| 7 | ExchangeRate | decimal(18,4) |  |  |
| 8 | AmountOC | decimal(18,4) | NN |  |
| 9 | Amount | decimal(18,4) | NN |  |
| 10 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 11 | AccountObjectName | nvarchar(400) |  |  |
| 12 | AccountObjectAddress | nvarchar(400) |  |  |
| 13 | AccountObjectTaxCode | nvarchar(50) |  |  |
| 14 | AccountObjectContactName | nvarchar(128) |  |  |
| 15 | Status | int | NN |  |
| 16 | CloseAmountOC | decimal(18,4) | NN |  |
| 17 | CloseAmount | decimal(18,4) | NN |  |
| 18 | PaidAmountOC | decimal(18,4) | NN |  |
| 19 | PaidAmount | decimal(18,4) | NN |  |
| 20 | PayableAmountOC | decimal(18,4) | NN |  |
| 21 | PayableAmount | decimal(18,4) | NN |  |
| 22 | CloseDate | datetime |  |  |
| 23 | CloseReason | nvarchar(255) |  |  |
| 24 | DeliverDueDate | datetime |  |  |
| 25 | DeliverAddress | nvarchar(255) |  |  |
| 26 | DueDate | datetime |  |  |
| 27 | EmployeeID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 28 | PaymentTerm | nvarchar(255) |  |  |
| 29 | RefType | int | NN |  |
| 30 | IsArisedBeforeUseSoftware | bit |  |  |
| 31 | ExecutedAmountFinance | decimal(18,4) |  |  |
| 32 | ExecutedAmountManagement | decimal(18,4) |  |  |
| 33 | PaidAmountFinance | decimal(18,4) |  |  |
| 34 | PaidAmountManagement | decimal(18,4) |  |  |
| 35 | PUOrderID | uniqueidentifier |  |  |
| 36 | CustomField1 | nvarchar(255) |  |  |
| 37 | CustomField2 | nvarchar(255) |  |  |
| 38 | CustomField3 | nvarchar(255) |  |  |
| 39 | CustomField4 | nvarchar(255) |  |  |
| 40 | CustomField5 | nvarchar(255) |  |  |
| 41 | CustomField6 | nvarchar(255) |  |  |
| 42 | CustomField7 | nvarchar(255) |  |  |
| 43 | CustomField8 | nvarchar(255) |  |  |
| 44 | CustomField9 | nvarchar(255) |  |  |
| 45 | CustomField10 | nvarchar(255) |  |  |
| 46 | IsOverQuantity | bit | NN |  |

## PUContractDetailInventoryItem

Rows: 0 | Columns: 36

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | PUContractID | uniqueidentifier | NN | PUContract.PUContractID |
| 3 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 4 | Description | nvarchar(500) |  |  |
| 5 | UnitID | uniqueidentifier |  | Unit.UnitID |
| 6 | Quantity | decimal(22,8) | NN |  |
| 7 | UnitPrice | decimal(20,6) | NN |  |
| 8 | AmountOC | decimal(18,4) | NN |  |
| 9 | Amount | decimal(18,4) | NN |  |
| 10 | VATRate | decimal(18,4) |  |  |
| 11 | VATAmountOC | decimal(18,4) | NN |  |
| 12 | VATAmount | decimal(18,4) | NN |  |
| 13 | DiscountRate | decimal(18,4) | NN |  |
| 14 | DiscountAmountOC | decimal(18,4) | NN |  |
| 15 | DiscountAmount | decimal(18,4) | NN |  |
| 16 | TotalAmountOC | decimal(18,4) | NN |  |
| 17 | TotalAmount | decimal(18,4) | NN |  |
| 18 | MainUnitID | uniqueidentifier |  | Unit.UnitID |
| 19 | MainUnitPrice | decimal(20,6) | NN |  |
| 20 | MainConvertRate | decimal(18,4) | NN |  |
| 21 | MainQuantity | decimal(22,8) | NN |  |
| 22 | ExchangeRateOperator | nvarchar(3) | NN |  |
| 23 | SortOrder | int | NN |  |
| 24 | CustomField1 | nvarchar(255) |  |  |
| 25 | CustomField2 | nvarchar(255) |  |  |
| 26 | CustomField3 | nvarchar(255) |  |  |
| 27 | CustomField4 | nvarchar(255) |  |  |
| 28 | CustomField5 | nvarchar(255) |  |  |
| 29 | CustomField6 | nvarchar(255) |  |  |
| 30 | CustomField7 | nvarchar(255) |  |  |
| 31 | CustomField8 | nvarchar(255) |  |  |
| 32 | CustomField9 | nvarchar(255) |  |  |
| 33 | CustomField10 | nvarchar(255) |  |  |
| 34 | VATRateOther | decimal(18,4) |  |  |
| 35 | QuantityDelivered | decimal(22,8) | NN |  |
| 36 | QuantityDeliveredLastYear | decimal(22,8) | NN |  |

## PUDebtPeriod

Rows: 0 | Columns: 12

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | DebtPeriodID | uniqueidentifier | PK NN |  |
| 2 | DebtPeriodName | nvarchar(255) |  |  |
| 3 | DebtPeriodType | int |  |  |
| 4 | FromDay | int |  |  |
| 5 | ToDay | int |  |  |
| 6 | SortOrder | int |  |  |
| 7 | IsReadOnly | bit |  |  |
| 8 | CreatedBy | nvarchar(50) |  |  |
| 9 | CreatedDate | datetime |  |  |
| 10 | ModifiedBy | nvarchar(50) |  |  |
| 11 | ModifiedDate | datetime |  |  |
| 12 | ReportID | nvarchar(100) |  |  |

## PUDiscount

Rows: 0 | Columns: 48

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | BranchID | uniqueidentifier | NN | OrganizationUnit.OrganizationUnitID |
| 3 | RefDate | datetime | NN |  |
| 4 | PostedDate | datetime | NN |  |
| 5 | RefType | int | NN |  |
| 6 | RefNoFinance | nvarchar(20) |  |  |
| 7 | RefNoManagement | nvarchar(20) |  |  |
| 8 | IsPostedFinance | bit | NN |  |
| 9 | IsPostedManagement | bit | NN |  |
| 10 | IsValueDecrementFromStock | bit | NN |  |
| 11 | PUInvoiceRefID | uniqueidentifier |  | PUInvoice.RefID |
| 12 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 13 | AccountObjectName | nvarchar(400) |  |  |
| 14 | Payer | nvarchar(400) |  |  |
| 15 | PayerAddress | nvarchar(255) |  |  |
| 16 | JournalMemo | nvarchar(500) |  |  |
| 17 | DocumentIncluded | nvarchar(255) |  |  |
| 18 | CurrencyID | nvarchar(3) |  | CCY.CurrencyID |
| 19 | ExchangeRate | decimal(18,4) |  |  |
| 20 | EmployeeID | uniqueidentifier |  |  |
| 21 | TotalAmountOC | decimal(18,4) | NN |  |
| 22 | TotalAmount | decimal(18,4) | NN |  |
| 23 | TotalVATAmountOC | decimal(18,4) | NN |  |
| 24 | TotalVATAmount | decimal(18,4) | NN |  |
| 25 | DisplayOnBook | int |  |  |
| 26 | IsPostedCashBookFinance | bit |  |  |
| 27 | IsPostedCashBookManagement | bit |  |  |
| 28 | CashBookPostedDate | datetime |  |  |
| 29 | EditVersion | timestamp |  |  |
| 30 | RefOrder | int | NN |  |
| 31 | CreatedDate | datetime |  |  |
| 32 | CreatedBy | nvarchar(50) |  |  |
| 33 | ModifiedDate | datetime |  |  |
| 34 | ModifiedBy | nvarchar(50) |  |  |
| 35 | CustomField1 | nvarchar(255) |  |  |
| 36 | CustomField2 | nvarchar(255) |  |  |
| 37 | CustomField3 | nvarchar(255) |  |  |
| 38 | CustomField4 | nvarchar(255) |  |  |
| 39 | CustomField5 | nvarchar(255) |  |  |
| 40 | CustomField6 | nvarchar(255) |  |  |
| 41 | CustomField7 | nvarchar(255) |  |  |
| 42 | CustomField8 | nvarchar(255) |  |  |
| 43 | CustomField9 | nvarchar(255) |  |  |
| 44 | CustomField10 | nvarchar(255) |  |  |
| 45 | CABAAmountOC | decimal(18,4) | NN |  |
| 46 | CABAAmount | decimal(18,4) | NN |  |
| 47 | INRefOrder | datetime | NN |  |
| 48 | EInvoiceItemName | nvarchar(500) |  |  |

## PUDiscountDetail

Rows: 0 | Columns: 55

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | PUDiscount.RefID |
| 3 | StockID | uniqueidentifier |  | Stock.StockID |
| 4 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 5 | Description | nvarchar(500) |  |  |
| 6 | DebitAccount | nvarchar(20) |  | Account.AccountNumber |
| 7 | CreditAccount | nvarchar(20) |  | Account.AccountNumber |
| 8 | UnitID | uniqueidentifier |  | Unit.UnitID |
| 9 | Quantity | decimal(22,8) | NN |  |
| 10 | UnitPrice | decimal(20,6) | NN |  |
| 11 | AmountOC | decimal(18,4) | NN |  |
| 12 | Amount | decimal(18,4) | NN |  |
| 13 | VATRate | decimal(18,4) |  |  |
| 14 | VATAmountOC | decimal(18,4) | NN |  |
| 15 | VATAmount | decimal(18,4) | NN |  |
| 16 | VATAccount | nvarchar(20) |  | Account.AccountNumber |
| 17 | ListItemID | uniqueidentifier |  | ListItem.ListItemID |
| 18 | PurchasePurposeID | uniqueidentifier |  | PurchasePurpose.PurchasePurposeID |
| 19 | LotNo | nvarchar(50) |  |  |
| 20 | ExpiryDate | datetime |  |  |
| 21 | PUVoucherRefDetailID | uniqueidentifier |  |  |
| 22 | PUVoucherRefID | uniqueidentifier |  | PUVoucher.RefID |
| 23 | OrderID | uniqueidentifier |  | SAOrder.RefID |
| 24 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 25 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 26 | JobID | uniqueidentifier |  | Job.JobID |
| 27 | ProjectWorkID | uniqueidentifier |  | ProjectWork.ProjectWorkID |
| 28 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 29 | PUContractID | uniqueidentifier |  | PUContract.PUContractID |
| 30 | UnResonableCost | bit | NN |  |
| 31 | PUInvoiceRefID | uniqueidentifier |  | PUInvoice.RefID |
| 32 | SortOrder | int |  |  |
| 33 | CustomField1 | nvarchar(255) |  |  |
| 34 | CustomField2 | nvarchar(255) |  |  |
| 35 | CustomField3 | nvarchar(255) |  |  |
| 36 | CustomField4 | nvarchar(255) |  |  |
| 37 | CustomField5 | nvarchar(255) |  |  |
| 38 | CustomField6 | nvarchar(255) |  |  |
| 39 | CustomField7 | nvarchar(255) |  |  |
| 40 | CustomField8 | nvarchar(255) |  |  |
| 41 | CustomField9 | nvarchar(255) |  |  |
| 42 | CustomField10 | nvarchar(255) |  |  |
| 43 | BudgetItemID | uniqueidentifier |  |  |
| 44 | ConfrontingRefID | uniqueidentifier |  |  |
| 45 | ConfrontingRefDetailID | uniqueidentifier |  |  |
| 47 | BankAccountID | uniqueidentifier |  | BankAccount.BankAccountID |
| 48 | VATDescription | nvarchar(255) |  |  |
| 49 | PUVoucherInvNo | nvarchar(25) |  |  |
| 50 | PUVoucherInvDate | datetime |  |  |
| 51 | PUOrderRefID | uniqueidentifier |  | PUOrder.RefID |
| 52 | PUOrderRefDetailID | uniqueidentifier |  | PUOrderDetail.RefDetailID |
| 53 | LOANAgreementID | uniqueidentifier |  | LOANAgreement.LOANAgreementID |
| 54 | InvestmentProjectID | uniqueidentifier |  | InvestmentProject.InvestmentProjectID |
| 55 | VATRateOther | decimal(18,4) |  |  |
| 56 | EInvoiceItemName | nvarchar(500) |  |  |

## PUInvoice

Rows: 212 | Columns: 51

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 3 | RefType | int | NN |  |
| 4 | RefDate | datetime | NN |  |
| 5 | PostedDate | datetime | NN |  |
| 6 | RefNoFinance | nvarchar(20) |  |  |
| 7 | RefNoManagement | nvarchar(20) |  |  |
| 8 | IsPostedFinance | bit | NN |  |
| 9 | IsPostedManagement | bit | NN |  |
| 10 | IsImportPurchase | bit | NN |  |
| 11 | IncludeInvoice | bit | NN |  |
| 12 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 13 | AccountObjectName | nvarchar(400) |  |  |
| 14 | AccountObjectAddress | nvarchar(400) |  |  |
| 15 | AccountObjectTaxCode | nvarchar(50) |  |  |
| 16 | JournalMemo | nvarchar(500) |  |  |
| 17 | EmployeeID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 18 | InvTemplateNo | nvarchar(25) |  |  |
| 19 | InvDate | datetime |  |  |
| 20 | InvSeries | nvarchar(20) |  |  |
| 21 | InvNo | nvarchar(25) |  |  |
| 22 | CurrencyID | nvarchar(3) |  | CCY.CurrencyID |
| 23 | ExchangeRate | decimal(18,4) |  |  |
| 24 | TotalTurnoverAmountOC | decimal(18,4) | NN |  |
| 25 | TotalTurnoverAmount | decimal(18,4) | NN |  |
| 26 | TotalVATAmountOC | decimal(18,4) | NN |  |
| 27 | TotalVATAmount | decimal(18,4) | NN |  |
| 28 | IsPaid | bit | NN |  |
| 29 | IsSummaryBySameInventoryItem | bit | NN |  |
| 30 | DisplayOnBook | int |  |  |
| 31 | EditVersion | timestamp |  |  |
| 32 | RefOrder | int | NN |  |
| 33 | CreatedDate | datetime |  |  |
| 34 | CreatedBy | nvarchar(50) |  |  |
| 35 | ModifiedDate | datetime |  |  |
| 36 | ModifiedBy | nvarchar(50) |  |  |
| 37 | CustomField1 | nvarchar(255) |  |  |
| 38 | CustomField2 | nvarchar(255) |  |  |
| 39 | CustomField3 | nvarchar(255) |  |  |
| 40 | CustomField4 | nvarchar(255) |  |  |
| 41 | CustomField5 | nvarchar(255) |  |  |
| 42 | CustomField6 | nvarchar(255) |  |  |
| 43 | CustomField7 | nvarchar(255) |  |  |
| 44 | CustomField8 | nvarchar(255) |  |  |
| 45 | CustomField9 | nvarchar(255) |  |  |
| 46 | CustomField10 | nvarchar(255) |  |  |
| 47 | DueDate | datetime |  |  |
| 48 | TransactionID | nvarchar(100) |  |  |
| 49 | SellerTaxCode | nvarchar(100) |  |  |
| 50 | EInvoiceType | int |  |  |
| 51 | IsImportEInvoice | bit | NN |  |

## PUInvoiceDetail

Rows: 0 | Columns: 41

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | PUInvoice.RefID |
| 3 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 4 | Description | nvarchar(500) |  |  |
| 5 | DebitAccount | nvarchar(20) |  | Account.AccountNumber |
| 6 | CreditAccount | nvarchar(20) |  | Account.AccountNumber |
| 7 | TurnoverAmountOC | decimal(18,4) | NN |  |
| 8 | TurnoverAmount | decimal(18,4) | NN |  |
| 9 | VATRate | decimal(18,4) |  |  |
| 10 | VATAmountOC | decimal(18,4) | NN |  |
| 11 | VATAmount | decimal(18,4) | NN |  |
| 12 | PurchasePurposeID | uniqueidentifier |  | PurchasePurpose.PurchasePurposeID |
| 13 | PUVoucherRefID | uniqueidentifier |  |  |
| 14 | PUVoucherRefDetailID | uniqueidentifier |  |  |
| 15 | PUContractID | uniqueidentifier |  | PUContract.PUContractID |
| 16 | ListItemID | uniqueidentifier |  | ListItem.ListItemID |
| 17 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 18 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 19 | JobID | uniqueidentifier |  | Job.JobID |
| 20 | ProjectWorkID | uniqueidentifier |  | ProjectWork.ProjectWorkID |
| 21 | OrderID | uniqueidentifier |  | SAOrder.RefID |
| 22 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 23 | UnResonableCost | bit | NN |  |
| 24 | SortOrder | int |  |  |
| 25 | PUVoucherRefNoFinance | nvarchar(20) |  |  |
| 26 | PUVoucherRefNoManagement | nvarchar(20) |  |  |
| 27 | CustomField1 | nvarchar(255) |  |  |
| 28 | CustomField2 | nvarchar(255) |  |  |
| 29 | CustomField3 | nvarchar(255) |  |  |
| 30 | CustomField4 | nvarchar(255) |  |  |
| 31 | CustomField5 | nvarchar(255) |  |  |
| 32 | CustomField6 | nvarchar(255) |  |  |
| 33 | CustomField7 | nvarchar(255) |  |  |
| 34 | CustomField8 | nvarchar(255) |  |  |
| 35 | CustomField9 | nvarchar(255) |  |  |
| 36 | CustomField10 | nvarchar(255) |  |  |
| 37 | VATDescription | nvarchar(255) |  |  |
| 38 | PUOrderRefID | uniqueidentifier |  | PUOrder.RefID |
| 39 | PUOrderRefDetailID | uniqueidentifier |  | PUOrderDetail.RefDetailID |
| 40 | InvestmentProjectID | uniqueidentifier |  | InvestmentProject.InvestmentProjectID |
| 41 | VATRateOther | decimal(18,4) |  |  |

## PULastedUnitPrice

Rows: 2,149 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | PULastedUnitPriceID | uniqueidentifier | PK NN |  |
| 2 | AccountObjectID | uniqueidentifier | NN | AccountObject.AccountObjectID |
| 3 | CurrencyID | nvarchar(3) | NN |  |
| 4 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 5 | UnitID | uniqueidentifier |  | Unit.UnitID |
| 6 | UnitPrice | decimal(18,4) | NN |  |

## PUOrder

Rows: 1,999 | Columns: 43

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 3 | RefDate | datetime | NN |  |
| 4 | RefType | int | NN |  |
| 5 | RefNo | nvarchar(20) |  |  |
| 6 | Status | int | NN |  |
| 7 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 8 | AccountObjectName | nvarchar(400) |  |  |
| 9 | AccountObjectAddress | nvarchar(400) |  |  |
| 10 | AccountObjectTaxCode | nvarchar(50) |  |  |
| 11 | JournalMemo | nvarchar(500) |  |  |
| 12 | CurrencyID | nvarchar(3) |  | CCY.CurrencyID |
| 13 | ExchangeRate | decimal(18,4) |  |  |
| 14 | ReceiveDate | datetime |  |  |
| 15 | ReceiveAddress | nvarchar(255) |  |  |
| 16 | PaymentTermID | uniqueidentifier |  |  |
| 17 | DueDay | int |  |  |
| 18 | OtherTerm | nvarchar(255) |  |  |
| 19 | EmployeeID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 20 | TotalAmountOC | decimal(18,4) | NN |  |
| 21 | TotalAmount | decimal(18,4) | NN |  |
| 22 | TotalVATAmountOC | decimal(18,4) | NN |  |
| 23 | TotalVATAmount | decimal(18,4) | NN |  |
| 24 | TotalDiscountAmountOC | decimal(18,4) | NN |  |
| 25 | TotalDiscountAmount | decimal(18,4) | NN |  |
| 26 | EditVersion | timestamp |  |  |
| 27 | RefOrder | int | NN |  |
| 28 | CreatedDate | datetime |  |  |
| 29 | CreatedBy | nvarchar(50) |  |  |
| 30 | ModifiedDate | datetime |  |  |
| 31 | ModifiedBy | nvarchar(50) |  |  |
| 32 | CustomField1 | nvarchar(255) |  |  |
| 33 | CustomField2 | nvarchar(255) |  |  |
| 34 | CustomField3 | nvarchar(255) |  |  |
| 35 | CustomField4 | nvarchar(255) |  |  |
| 36 | CustomField5 | nvarchar(255) |  |  |
| 37 | CustomField6 | nvarchar(255) |  |  |
| 38 | CustomField7 | nvarchar(255) |  |  |
| 39 | CustomField8 | nvarchar(255) |  |  |
| 40 | CustomField9 | nvarchar(255) |  |  |
| 41 | CustomField10 | nvarchar(255) |  |  |
| 42 | RefIDMshop | nvarchar(MAX) |  |  |
| 43 | RefNoMshop | nvarchar(MAX) |  |  |

## PUOrderDetail

Rows: 3,494 | Columns: 47

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | PUOrder.RefID |
| 3 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 4 | Description | nvarchar(500) |  |  |
| 5 | UnitID | uniqueidentifier |  | Unit.UnitID |
| 9 | Quantity | decimal(22,8) | NN |  |
| 11 | QuantityReceipt | decimal(22,8) | NN |  |
| 13 | UnitPrice | decimal(20,6) | NN |  |
| 15 | Amount | decimal(18,4) | NN |  |
| 16 | DiscountRate | decimal(18,4) |  |  |
| 17 | DiscountAmount | decimal(18,4) | NN |  |
| 18 | VATRate | decimal(18,4) |  |  |
| 19 | VATAmount | decimal(18,4) | NN |  |
| 20 | SortOrder | int |  |  |
| 25 | AmountOC | decimal(18,4) | NN |  |
| 26 | DiscountAmountOC | decimal(18,4) | NN |  |
| 27 | VATAmountOC | decimal(18,4) | NN |  |
| 28 | CustomField1 | nvarchar(255) |  |  |
| 29 | CustomField2 | nvarchar(255) |  |  |
| 30 | CustomField3 | nvarchar(255) |  |  |
| 31 | CustomField4 | nvarchar(255) |  |  |
| 32 | CustomField5 | nvarchar(255) |  |  |
| 33 | CustomField6 | nvarchar(255) |  |  |
| 34 | CustomField7 | nvarchar(255) |  |  |
| 35 | CustomField8 | nvarchar(255) |  |  |
| 36 | CustomField9 | nvarchar(255) |  |  |
| 37 | CustomField10 | nvarchar(255) |  |  |
| 38 | MainUnitID | uniqueidentifier |  | Unit.UnitID |
| 39 | MainUnitPrice | decimal(20,6) | NN |  |
| 40 | MainConvertRate | decimal(18,4) | NN |  |
| 41 | ExchangeRateOperator | nvarchar(3) | NN |  |
| 42 | MainQuantity | decimal(22,8) | NN |  |
| 43 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 44 | OrganizationUnitID | uniqueidentifier |  |  |
| 45 | JobID | uniqueidentifier |  |  |
| 46 | ProjectWorkID | uniqueidentifier |  |  |
| 47 | OrderID | uniqueidentifier |  | SAOrder.RefID |
| 48 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 49 | PUContractID | uniqueidentifier |  | PUContract.PUContractID |
| 50 | ListItemID | uniqueidentifier |  |  |
| 51 | QuantityReceiptLastYear | decimal(22,8) | NN |  |
| 52 | SAOrderRefDetailID | uniqueidentifier |  |  |
| 53 | StockID | uniqueidentifier |  | Stock.StockID |
| 54 | INProductionOrderRefID | uniqueidentifier |  | INProductionOrder.RefID |
| 55 | ProductionID | uniqueidentifier |  | INProductionOrderProduct.ProductionID |
| 56 | UnitPriceAfterTax | decimal(18,4) | NN |  |
| 57 | VATRateOther | decimal(18,4) |  |  |

## PUReturn

Rows: 29 | Columns: 62

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 3 | RefDate | datetime |  |  |
| 4 | PostedDate | datetime |  |  |
| 5 | CARefDate | datetime |  |  |
| 6 | CAPostedDate | datetime |  |  |
| 7 | RefType | int | NN |  |
| 8 | RefNoFinance | nvarchar(20) |  |  |
| 9 | RefNoManagement | nvarchar(20) |  |  |
| 10 | CARefNoFinance | nvarchar(20) |  |  |
| 11 | CARefNoManagement | nvarchar(20) |  |  |
| 12 | IsPostedFinance | bit | NN |  |
| 13 | IsPostedManagement | bit | NN |  |
| 14 | SAInvoiceRefID | uniqueidentifier |  | SAInvoice.RefID |
| 15 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 16 | AccountObjectName | nvarchar(400) |  |  |
| 17 | Receiver | nvarchar(400) |  |  |
| 18 | ReceiverAddress | nvarchar(255) |  |  |
| 19 | JournalMemo | nvarchar(500) |  |  |
| 20 | OutDocumentIncluded | nvarchar(255) |  |  |
| 21 | Payer | nvarchar(400) |  |  |
| 22 | PayerAddress | nvarchar(255) |  |  |
| 23 | CAJournalMemo | nvarchar(500) |  |  |
| 24 | CADocumentIncluded | nvarchar(255) |  |  |
| 25 | IsInvoiceExported | bit | NN |  |
| 26 | CurrencyID | nvarchar(3) |  | CCY.CurrencyID |
| 27 | ExchangeRate | decimal(18,4) |  |  |
| 28 | EmployeeID | uniqueidentifier |  |  |
| 29 | TotalAmountOC | decimal(18,4) | NN |  |
| 30 | TotalAmount | decimal(18,4) | NN |  |
| 31 | TotalVATAmountOC | decimal(18,4) | NN |  |
| 32 | TotalVATAmount | decimal(18,4) | NN |  |
| 33 | DisplayOnBook | int |  |  |
| 34 | IsPostedCashBookFinance | bit |  |  |
| 35 | IsPostedCashBookManagement | bit |  |  |
| 36 | CashBookPostedDate | datetime |  |  |
| 37 | IsPostedInventoryBookFinance | bit |  |  |
| 38 | IsPostedInventoryBookManagement | bit |  |  |
| 39 | InventoryPostedDate | datetime |  |  |
| 40 | EditVersion | timestamp |  |  |
| 41 | RefOrder | int | NN |  |
| 42 | CreatedDate | datetime |  |  |
| 43 | CreatedBy | nvarchar(50) |  |  |
| 44 | ModifiedDate | datetime |  |  |
| 45 | ModifiedBy | nvarchar(50) |  |  |
| 46 | CustomField1 | nvarchar(255) |  |  |
| 47 | CustomField2 | nvarchar(255) |  |  |
| 48 | CustomField3 | nvarchar(255) |  |  |
| 49 | CustomField4 | nvarchar(255) |  |  |
| 50 | CustomField5 | nvarchar(255) |  |  |
| 51 | CustomField6 | nvarchar(255) |  |  |
| 52 | CustomField7 | nvarchar(255) |  |  |
| 53 | CustomField8 | nvarchar(255) |  |  |
| 54 | CustomField9 | nvarchar(255) |  |  |
| 55 | CustomField10 | nvarchar(255) |  |  |
| 56 | CABAAmountOC | decimal(18,4) | NN |  |
| 57 | CABAAmount | decimal(18,4) | NN |  |
| 58 | INRefOrder | datetime | NN |  |
| 59 | RefIDMshop | nvarchar(MAX) |  |  |
| 60 | RefNoMshop | nvarchar(MAX) |  |  |
| 61 | SellerIssuesInvoice | bit | NN |  |
| 62 | IsCreateInbot | bit | NN |  |

## PUReturnDetail

Rows: 77 | Columns: 72

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | PUReturn.RefID |
| 3 | StockID | uniqueidentifier |  | Stock.StockID |
| 4 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 5 | Description | nvarchar(500) |  |  |
| 6 | DebitAccount | nvarchar(20) |  | Account.AccountNumber |
| 7 | CreditAccount | nvarchar(20) |  | Account.AccountNumber |
| 8 | UnitID | uniqueidentifier |  | Unit.UnitID |
| 9 | Quantity | decimal(22,8) | NN |  |
| 10 | UnitPrice | decimal(20,6) | NN |  |
| 11 | AmountOC | decimal(18,4) | NN |  |
| 12 | Amount | decimal(18,4) | NN |  |
| 13 | VATRate | decimal(18,4) |  |  |
| 14 | VATAmountOC | decimal(18,4) | NN |  |
| 15 | VATAmount | decimal(18,4) | NN |  |
| 16 | VATAccount | nvarchar(20) |  | Account.AccountNumber |
| 17 | ListItemID | uniqueidentifier |  | ListItem.ListItemID |
| 18 | PurchasePurposeID | uniqueidentifier |  | PurchasePurpose.PurchasePurposeID |
| 19 | LotNo | nvarchar(50) |  |  |
| 20 | ExpiryDate | datetime |  |  |
| 21 | PUVoucherRefDetailID | uniqueidentifier |  |  |
| 22 | PUVoucherRefID | uniqueidentifier |  | PUVoucher.RefID |
| 23 | MainUnitID | uniqueidentifier |  | Unit.UnitID |
| 24 | MainUnitPrice | decimal(20,6) | NN |  |
| 25 | MainConvertRate | decimal(18,4) | NN |  |
| 26 | MainQuantity | decimal(22,8) | NN |  |
| 27 | ExchangeRateOperator | nvarchar(3) | NN |  |
| 28 | OrderID | uniqueidentifier |  | SAOrder.RefID |
| 29 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 30 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 31 | JobID | uniqueidentifier |  | Job.JobID |
| 32 | ProjectWorkID | uniqueidentifier |  | ProjectWork.ProjectWorkID |
| 33 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 34 | PUContractID | uniqueidentifier |  | PUContract.PUContractID |
| 35 | UnResonableCost | bit | NN |  |
| 36 | SortOrder | int |  |  |
| 37 | CustomField1 | nvarchar(255) |  |  |
| 38 | CustomField2 | nvarchar(255) |  |  |
| 39 | CustomField3 | nvarchar(255) |  |  |
| 40 | CustomField4 | nvarchar(255) |  |  |
| 41 | CustomField5 | nvarchar(255) |  |  |
| 42 | CustomField6 | nvarchar(255) |  |  |
| 43 | CustomField7 | nvarchar(255) |  |  |
| 44 | CustomField8 | nvarchar(255) |  |  |
| 45 | CustomField9 | nvarchar(255) |  |  |
| 46 | CustomField10 | nvarchar(255) |  |  |
| 47 | ConfrontingRefDetailID | uniqueidentifier |  |  |
| 48 | ConfrontingRefID | uniqueidentifier |  |  |
| 49 | BudgetItemID | uniqueidentifier |  |  |
| 50 | SAInvoiceRefID | uniqueidentifier |  | SAInvoice.RefID |
| 52 | InventoryResaleTypeID | int |  |  |
| 53 | BankAccountID | uniqueidentifier |  | BankAccount.BankAccountID |
| 54 | VATDescription | nvarchar(255) |  |  |
| 55 | PUVoucherInvNo | nvarchar(25) |  |  |
| 56 | PUVoucherInvDate | datetime |  |  |
| 57 | INProductionOrderRefID | uniqueidentifier |  | INProductionOrder.RefID |
| 58 | ProductionID | uniqueidentifier |  | INProductionOrderProduct.ProductionID |
| 59 | PUOrderRefID | uniqueidentifier |  | PUOrder.RefID |
| 60 | PUOrderRefDetailID | uniqueidentifier |  | PUOrderDetail.RefDetailID |
| 61 | UnitPriceBeforeDiscount | decimal(20,6) | NN |  |
| 62 | DiscountRate | decimal(18,4) | NN |  |
| 63 | DiscountAmountOC | decimal(18,4) | NN |  |
| 64 | DiscountAmount | decimal(18,4) | NN |  |
| 65 | LOANAgreementID | uniqueidentifier |  | LOANAgreement.LOANAgreementID |
| 66 | InvestmentProjectID | uniqueidentifier |  | InvestmentProject.InvestmentProjectID |
| 67 | VATRateOther | decimal(18,4) |  |  |
| 68 | SpecificType | int |  |  |
| 69 | VINNumber | nvarchar(200) |  |  |
| 70 | SenderName | nvarchar(200) |  |  |
| 71 | SenderAddress | nvarchar(200) |  |  |
| 72 | SenderTaxCode | nvarchar(200) |  |  |
| 73 | SenderIDNumber | nvarchar(200) |  |  |

## PUService

Rows: 1,073 | Columns: 66

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 3 | RefDate | datetime | NN |  |
| 4 | PostedDate | datetime | NN |  |
| 5 | RefType | int | NN |  |
| 6 | RefNoFinance | nvarchar(20) |  |  |
| 7 | RefNoManagement | nvarchar(20) |  |  |
| 8 | IsPostedFinance | bit | NN |  |
| 9 | IsPostedManagement | bit | NN |  |
| 12 | IsFreightService | bit | NN |  |
| 13 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 14 | AccountObjectName | nvarchar(400) |  |  |
| 15 | AccountObjectAddress | nvarchar(400) |  |  |
| 16 | AccountObjectBankAccount | nvarchar(50) |  |  |
| 17 | AccountObjectBankName | nvarchar(128) |  |  |
| 18 | AccountObjectContactname | nvarchar(400) |  |  |
| 19 | IdentificationNumber | nvarchar(20) |  |  |
| 20 | IssueDate | datetime |  |  |
| 21 | IssueBy | nvarchar(120) |  |  |
| 22 | JournalMemo | nvarchar(500) |  |  |
| 23 | EmployeeID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 24 | DocumentIncluded | nvarchar(255) |  |  |
| 25 | BankAccountID | uniqueidentifier |  | BankAccount.BankAccountID |
| 26 | BankName | nvarchar(255) |  |  |
| 27 | PaymentTermID | uniqueidentifier |  | PaymentTerm.PaymentTermID |
| 28 | DueTime | int |  |  |
| 29 | DueDate | datetime |  |  |
| 30 | CurrencyID | nvarchar(3) |  | CCY.CurrencyID |
| 31 | ExchangeRate | decimal(18,4) |  |  |
| 32 | TotalAmountOC | decimal(18,4) | NN |  |
| 33 | TotalAmount | decimal(18,4) | NN |  |
| 34 | TotalVATAmountOC | decimal(18,4) | NN |  |
| 35 | TotalVATAmount | decimal(18,4) | NN |  |
| 36 | TotalDiscountAmountOC | decimal(18,4) | NN |  |
| 37 | TotalDiscountAmount | decimal(18,4) | NN |  |
| 38 | DisplayOnBook | int |  |  |
| 39 | IsPaid | bit |  |  |
| 40 | IsPostedCashBookFinance | bit |  |  |
| 41 | IsPostedCashBookManagement | bit |  |  |
| 42 | CashBookPostedDate | datetime |  |  |
| 43 | EditVersion | timestamp |  |  |
| 44 | RefOrder | int | NN |  |
| 45 | CreatedDate | datetime |  |  |
| 46 | CreatedBy | nvarchar(50) |  |  |
| 47 | ModifiedDate | datetime |  |  |
| 48 | ModifiedBy | nvarchar(50) |  |  |
| 49 | CustomField1 | nvarchar(255) |  |  |
| 50 | CustomField2 | nvarchar(255) |  |  |
| 51 | CustomField3 | nvarchar(255) |  |  |
| 52 | CustomField4 | nvarchar(255) |  |  |
| 53 | CustomField5 | nvarchar(255) |  |  |
| 54 | CustomField6 | nvarchar(255) |  |  |
| 55 | CustomField7 | nvarchar(255) |  |  |
| 56 | CustomField8 | nvarchar(255) |  |  |
| 57 | CustomField9 | nvarchar(255) |  |  |
| 58 | CustomField10 | nvarchar(255) |  |  |
| 59 | CABAAmountOC | decimal(18,4) | NN |  |
| 60 | CABAAmount | decimal(18,4) | NN |  |
| 61 | PUInvoiceRefID | uniqueidentifier |  |  |
| 62 | IncludeInvoice | int | NN |  |
| 63 | AccountObjectAddressOther | nvarchar(400) |  |  |
| 64 | AccountObjectIdentificationNumberOther | nvarchar(20) |  |  |
| 65 | TransactionID | nvarchar(100) |  |  |
| 66 | SellerTaxCode | nvarchar(100) |  |  |
| 67 | EInvoiceType | int |  |  |
| 68 | IsImportEInvoice | bit | NN |  |

## PUServiceDetail

Rows: 6,299 | Columns: 72

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | PUService.RefID |
| 3 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 4 | Description | nvarchar(500) |  |  |
| 5 | DebitAccount | nvarchar(20) |  | Account.AccountNumber |
| 6 | CreditAccount | nvarchar(20) |  | Account.AccountNumber |
| 7 | UnitID | uniqueidentifier |  | Unit.UnitID |
| 8 | Quantity | decimal(22,8) | NN |  |
| 9 | UnitPrice | decimal(20,6) | NN |  |
| 10 | AmountOC | decimal(18,4) | NN |  |
| 11 | Amount | decimal(18,4) | NN |  |
| 12 | DiscountRate | decimal(18,4) |  |  |
| 13 | DiscountAmountOC | decimal(18,4) | NN |  |
| 14 | DiscountAmount | decimal(18,4) | NN |  |
| 15 | InwardAmount | decimal(18,4) | NN |  |
| 16 | PUContractID | uniqueidentifier |  | PUContract.PUContractID |
| 17 | VATRate | decimal(18,4) |  |  |
| 18 | VATAmountOC | decimal(18,4) | NN |  |
| 19 | VATAmount | decimal(18,4) | NN |  |
| 20 | VATAccount | nvarchar(20) |  | Account.AccountNumber |
| 21 | InvTemplateNo | nvarchar(25) |  |  |
| 22 | InvSeries | nvarchar(20) |  |  |
| 23 | InvDate | datetime |  |  |
| 24 | InvNo | nvarchar(25) |  |  |
| 25 | PurchasePurposeID | uniqueidentifier |  | PurchasePurpose.PurchasePurposeID |
| 26 | TaxAccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 27 | TaxAccountObjectName | nvarchar(400) |  |  |
| 28 | TaxAccountObjectTaxCode | nvarchar(50) |  |  |
| 29 | TaxAccountObjectAddress | nvarchar(400) |  |  |
| 30 | BudgetItemID | uniqueidentifier |  |  |
| 31 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 32 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 33 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 34 | JobID | uniqueidentifier |  | Job.JobID |
| 35 | ProjectWorkID | uniqueidentifier |  | ProjectWork.ProjectWorkID |
| 36 | OrderID | uniqueidentifier |  | SAOrder.RefID |
| 37 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 38 | ListItemID | uniqueidentifier |  | ListItem.ListItemID |
| 39 | UnResonableCost | bit | NN |  |
| 40 | PUOrderRefDetailID | uniqueidentifier |  | PUOrderDetail.RefDetailID |
| 41 | PUOrderRefID | uniqueidentifier |  | PUOrder.RefID |
| 42 | SortOrder | int |  |  |
| 43 | CustomField1 | nvarchar(255) |  |  |
| 44 | CustomField2 | nvarchar(255) |  |  |
| 45 | CustomField3 | nvarchar(255) |  |  |
| 46 | CustomField4 | nvarchar(255) |  |  |
| 47 | CustomField5 | nvarchar(255) |  |  |
| 48 | CustomField6 | nvarchar(255) |  |  |
| 49 | CustomField7 | nvarchar(255) |  |  |
| 50 | CustomField8 | nvarchar(255) |  |  |
| 51 | CustomField9 | nvarchar(255) |  |  |
| 52 | CustomField10 | nvarchar(255) |  |  |
| 53 | VATDescription | nvarchar(255) |  |  |
| 55 | CashOutAmountFinance | decimal(18,4) | NN |  |
| 56 | CashOutDiffAmountFinance | decimal(18,4) | NN |  |
| 57 | CashOutVATAmountFinance | decimal(18,4) | NN |  |
| 58 | CashOutDiffVATAmountFinance | decimal(18,4) | NN |  |
| 59 | CashOutDiffAccountNumberFinance | nvarchar(20) |  | Account.AccountNumber |
| 61 | CashOutAmountManagement | decimal(18,4) | NN |  |
| 62 | CashOutDiffAmountManagement | decimal(18,4) | NN |  |
| 63 | CashOutVATAmountManagement | decimal(18,4) | NN |  |
| 64 | CashOutDiffVATAmountManagement | decimal(18,4) | NN |  |
| 65 | CashOutDiffAccountNumberManagement | nvarchar(20) |  | Account.AccountNumber |
| 66 | CashOutExchangeRateFinance | decimal(20,6) | NN |  |
| 67 | CashOutExchangeRateManagement | decimal(20,6) | NN |  |
| 68 | EInvoiceItemName | nvarchar(500) |  |  |
| 69 | LOANAgreementID | uniqueidentifier |  | LOANAgreement.LOANAgreementID |
| 70 | InvestmentProjectID | uniqueidentifier |  | InvestmentProject.InvestmentProjectID |
| 71 | DeductionsTaxAmountOC | decimal(18,4) | NN |  |
| 72 | DeductionsTaxAmount | decimal(18,4) | NN |  |
| 73 | VATRate406 | decimal(18,4) |  |  |
| 74 | VATRateOther | decimal(18,4) |  |  |

## PUVoucher

Rows: 1,234 | Columns: 83

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 3 | RefDate | datetime |  |  |
| 4 | PostedDate | datetime |  |  |
| 5 | CABARefDate | datetime |  |  |
| 6 | CABAPostedDate | datetime |  |  |
| 7 | RefType | int | NN |  |
| 8 | RefNoFinance | nvarchar(20) |  |  |
| 9 | RefNoManagement | nvarchar(20) |  |  |
| 10 | CABARefNoManagement | nvarchar(20) |  |  |
| 11 | CABARefNoFinance | nvarchar(20) |  |  |
| 12 | IsPostedFinance | bit | NN |  |
| 13 | IsPostedManagement | bit | NN |  |
| 14 | IncludeInvoice | int | NN |  |
| 15 | PUInvoiceRefID | uniqueidentifier |  | PUInvoice.RefID |
| 16 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 17 | AccountObjectName | nvarchar(400) |  |  |
| 18 | AccountObjectAddress | nvarchar(400) |  |  |
| 19 | AccountObjectBankAccount | nvarchar(50) |  |  |
| 20 | AccountObjectBankName | nvarchar(128) |  |  |
| 21 | AccountObjectContactName | nvarchar(400) |  |  |
| 22 | IdentificationNumber | nvarchar(20) |  |  |
| 23 | IssueDate | datetime |  |  |
| 24 | IssueBy | nvarchar(120) |  |  |
| 25 | Receiver | nvarchar(400) |  |  |
| 26 | JournalMemo | nvarchar(500) |  |  |
| 27 | EmployeeID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 28 | DocumentIncluded | nvarchar(255) |  |  |
| 29 | CABAJournalMemo | nvarchar(500) |  |  |
| 30 | CABADocumentIncluded | nvarchar(255) |  |  |
| 31 | BankAccountID | uniqueidentifier |  | BankAccount.BankAccountID |
| 32 | BankName | nvarchar(255) |  |  |
| 33 | PaymentTermID | uniqueidentifier |  | PaymentTerm.PaymentTermID |
| 34 | DueTime | int |  |  |
| 35 | DueDate | datetime |  |  |
| 36 | CurrencyID | nvarchar(3) |  | CCY.CurrencyID |
| 37 | ExchangeRate | decimal(18,4) |  |  |
| 38 | TotalAmountOC | decimal(18,4) | NN |  |
| 39 | TotalAmount | decimal(18,4) | NN |  |
| 40 | TotalImportTaxAmountOC | decimal(18,4) | NN |  |
| 41 | TotalImportTaxAmount | decimal(18,4) | NN |  |
| 42 | TotalVATAmountOC | decimal(18,4) | NN |  |
| 43 | TotalVATAmount | decimal(18,4) | NN |  |
| 44 | TotalDiscountAmountOC | decimal(18,4) | NN |  |
| 45 | TotalDiscountAmount | decimal(18,4) | NN |  |
| 46 | TotalFreightAmount | decimal(18,4) | NN |  |
| 47 | TotalInwardAmount | decimal(18,4) | NN |  |
| 48 | TotalSpecialConsumeTaxAmountOC | decimal(18,4) | NN |  |
| 49 | TotalSpecialConsumeTaxAmount | decimal(18,4) | NN |  |
| 50 | TotalCustomBeforeAmount | decimal(18,4) | NN |  |
| 51 | DisplayOnBook | int |  |  |
| 52 | IsPaid | bit |  |  |
| 53 | IsPostedCashBookFinance | bit |  |  |
| 54 | IsPostedCashBookManagement | bit |  |  |
| 55 | CashBookPostedDate | datetime |  |  |
| 56 | IsPostedInventoryBookFinance | bit |  |  |
| 57 | IsPostedInventoryBookManagement | bit |  |  |
| 58 | InventoryPostedDate | datetime |  |  |
| 59 | EditVersion | timestamp |  |  |
| 60 | RefOrder | int | NN |  |
| 61 | CreatedDate | datetime |  |  |
| 62 | CreatedBy | nvarchar(50) |  |  |
| 63 | ModifiedDate | datetime |  |  |
| 64 | ModifiedBy | nvarchar(50) |  |  |
| 65 | CustomField1 | nvarchar(255) |  |  |
| 66 | CustomField2 | nvarchar(255) |  |  |
| 67 | CustomField3 | nvarchar(255) |  |  |
| 68 | CustomField4 | nvarchar(255) |  |  |
| 69 | CustomField5 | nvarchar(255) |  |  |
| 70 | CustomField6 | nvarchar(255) |  |  |
| 71 | CustomField7 | nvarchar(255) |  |  |
| 72 | CustomField8 | nvarchar(255) |  |  |
| 73 | CustomField9 | nvarchar(255) |  |  |
| 74 | CustomField10 | nvarchar(255) |  |  |
| 75 | CABAAmountOC | decimal(18,4) | NN |  |
| 76 | CABAAmount | decimal(18,4) | NN |  |
| 77 | INRefOrder | datetime | NN |  |
| 78 | IsPULotVoucher | bit | NN |  |
| 79 | AccountObjectAddressOther | nvarchar(400) |  |  |
| 80 | AccountObjectIdentificationNumberOther | nvarchar(20) |  |  |
| 81 | IsConvertVAT | bit |  |  |
| 82 | RefIDMshop | nvarchar(MAX) |  |  |
| 83 | RefNoMshop | nvarchar(MAX) |  |  |

## PUVoucherDetail

Rows: 3,362 | Columns: 122

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | PUVoucher.RefID |
| 3 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 4 | Description | nvarchar(500) |  |  |
| 5 | StockID | uniqueidentifier |  | Stock.StockID |
| 6 | DebitAccount | nvarchar(20) |  | Account.AccountNumber |
| 7 | CreditAccount | nvarchar(20) |  | Account.AccountNumber |
| 8 | UnitID | uniqueidentifier |  | Unit.UnitID |
| 9 | Quantity | decimal(22,8) | NN |  |
| 10 | UnitPrice | decimal(20,6) | NN |  |
| 11 | AmountOC | decimal(18,4) | NN |  |
| 12 | Amount | decimal(18,4) | NN |  |
| 13 | DiscountRate | decimal(18,4) | NN |  |
| 14 | DiscountAmountOC | decimal(18,4) | NN |  |
| 15 | DiscountAmount | decimal(18,4) | NN |  |
| 16 | FreightAmount | decimal(18,4) | NN |  |
| 17 | InwardAmount | decimal(18,4) | NN |  |
| 18 | PUContractID | uniqueidentifier |  | PUContract.PUContractID |
| 19 | LotNo | nvarchar(50) |  |  |
| 20 | ExpiryDate | datetime |  |  |
| 21 | MainUnitID | uniqueidentifier |  | Unit.UnitID |
| 22 | MainConvertRate | decimal(18,4) | NN |  |
| 23 | ExchangeRateOperator | nvarchar(3) |  |  |
| 24 | MainQuantity | decimal(22,8) | NN |  |
| 25 | MainUnitPrice | decimal(20,6) | NN |  |
| 26 | VATRate | decimal(18,4) |  |  |
| 27 | VATAmountOC | decimal(18,4) | NN |  |
| 28 | VATAmount | decimal(18,4) | NN |  |
| 29 | VATAccount | nvarchar(20) |  | Account.AccountNumber |
| 30 | DeductionDebitAccount | nvarchar(20) |  | Account.AccountNumber |
| 31 | PurchasePurposeID | uniqueidentifier |  | PurchasePurpose.PurchasePurposeID |
| 32 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 33 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 34 | JobID | uniqueidentifier |  | Job.JobID |
| 35 | ProjectWorkID | uniqueidentifier |  | ProjectWork.ProjectWorkID |
| 36 | OrderID | uniqueidentifier |  | SAOrder.RefID |
| 37 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 38 | ListItemID | uniqueidentifier |  | ListItem.ListItemID |
| 39 | PUOrderRefID | uniqueidentifier |  | PUOrder.RefID |
| 40 | PUOrderRefDetailID | uniqueidentifier |  | PUOrderDetail.RefDetailID |
| 41 | INProductionOrderRefID | uniqueidentifier |  | INProductionOrder.RefID |
| 42 | UnResonableCost | bit | NN |  |
| 43 | FOBAmountOC | decimal(18,4) | NN |  |
| 44 | FOBAmount | decimal(18,4) | NN |  |
| 45 | ImportChargeAmount | decimal(18,4) | NN |  |
| 46 | ImportTaxRatePrice | decimal(20,6) | NN |  |
| 47 | ImportTaxRate | decimal(18,4) | NN |  |
| 48 | ImportTaxAmountOC | decimal(18,4) | NN |  |
| 49 | ImportTaxAmount | decimal(18,4) | NN |  |
| 50 | ImportTaxAccount | nvarchar(20) |  | Account.AccountNumber |
| 51 | SpecialConsumeTaxRate | decimal(18,4) | NN |  |
| 52 | SpecialConsumeTaxAmountOC | decimal(18,4) | NN |  |
| 53 | SpecialConsumeTaxAmount | decimal(18,4) | NN |  |
| 54 | SpecialConsumeTaxAccount | nvarchar(20) |  | Account.AccountNumber |
| 55 | SortOrder | int |  |  |
| 56 | CustomField1 | nvarchar(255) |  |  |
| 57 | CustomField2 | nvarchar(255) |  |  |
| 58 | CustomField3 | nvarchar(255) |  |  |
| 59 | CustomField4 | nvarchar(255) |  |  |
| 60 | CustomField5 | nvarchar(255) |  |  |
| 61 | CustomField6 | nvarchar(255) |  |  |
| 62 | CustomField7 | nvarchar(255) |  |  |
| 63 | CustomField8 | nvarchar(255) |  |  |
| 64 | CustomField9 | nvarchar(255) |  |  |
| 65 | CustomField10 | nvarchar(255) |  |  |
| 66 | PUInvoiceRefID | uniqueidentifier |  | PUInvoice.RefID |
| 67 | BudgetItemID | uniqueidentifier |  |  |
| 68 | ProductionID | uniqueidentifier |  | INProductionOrderProduct.ProductionID |
| 69 | EnvironmentalTaxAmount | decimal(18,4) | NN |  |
| 70 | EnvironmentalTaxAccount | nvarchar(20) |  |  |
| 71 | InventoryResaleTypeID | int |  |  |
| 72 | EnvironmentalTaxAmountOC | decimal(18,4) | NN |  |
| 73 | VATDescription | nvarchar(255) |  |  |
| 74 | AccountObjectID | uniqueidentifier |  |  |
| 75 | TaxAccountObjectID | uniqueidentifier |  |  |
| 76 | TaxAccountObjectName | nvarchar(400) |  |  |
| 77 | TaxAccountObjectAddress | nvarchar(400) |  |  |
| 78 | TaxAccountObjectTaxCode | nvarchar(50) |  |  |
| 79 | InvDate | datetime |  |  |
| 80 | InvNo | nvarchar(25) |  |  |
| 81 | InvSeries | nvarchar(20) |  |  |
| 82 | InvTemplateNo | nvarchar(25) |  |  |
| 84 | CashOutAmountFinance | decimal(18,4) | NN |  |
| 85 | CashOutDiffAmountFinance | decimal(18,4) | NN |  |
| 86 | CashOutVATAmountFinance | decimal(18,4) | NN |  |
| 87 | CashOutDiffVATAmountFinance | decimal(18,4) | NN |  |
| 88 | CashOutDiffAccountNumberFinance | nvarchar(20) |  | Account.AccountNumber |
| 90 | CashOutAmountManagement | decimal(18,4) | NN |  |
| 91 | CashOutDiffAmountManagement | decimal(18,4) | NN |  |
| 92 | CashOutVATAmountManagement | decimal(18,4) | NN |  |
| 93 | CashOutDiffVATAmountManagement | decimal(18,4) | NN |  |
| 94 | CashOutDiffAccountNumberManagement | nvarchar(20) |  | Account.AccountNumber |
| 95 | CashOutExchangeRateFinance | decimal(20,6) | NN |  |
| 96 | CashOutExchangeRateManagement | decimal(20,6) | NN |  |
| 97 | AllocationRate | decimal(24,10) |  |  |
| 98 | AllocationRateImport | decimal(24,10) |  |  |
| 100 | DateEnoughTaxPayment | datetime |  |  |
| 130 | UnitPriceAfterTax | decimal(18,4) | NN |  |
| 133 | ImportChargeExchangeRate | decimal(18,4) | NN |  |
| 134 | ImportTaxRatePriceOC | decimal(18,4) | NN |  |
| 135 | ImportChargeBeforeCustomAmountOC | decimal(18,4) | NN |  |
| 136 | ImportChargeBeforeCustomAmountMainCurrency | decimal(18,4) | NN |  |
| 137 | AllocationRateImportOriginCurrency | decimal(24,10) | NN |  |
| 138 | ImportChargeBeforeCustomAmountAllocated | decimal(24,10) | NN |  |
| 139 | EInvoiceItemName | nvarchar(500) |  |  |
| 140 | PanelLengthQuantity | decimal(22,8) | NN |  |
| 141 | PanelWidthQuantity | decimal(22,8) | NN |  |
| 142 | PanelHeightQuantity | decimal(22,8) | NN |  |
| 143 | PanelRadiusQuantity | decimal(22,8) | NN |  |
| 144 | PanelQuantity | decimal(22,8) | NN |  |
| 145 | LOANAgreementID | uniqueidentifier |  | LOANAgreement.LOANAgreementID |
| 146 | InvestmentProjectID | uniqueidentifier |  | InvestmentProject.InvestmentProjectID |
| 147 | DeductionsTaxAmountOC | decimal(18,4) | NN |  |
| 148 | DeductionsTaxAmount | decimal(18,4) | NN |  |
| 149 | VATRate406 | decimal(18,4) |  |  |
| 150 | VATRateOther | decimal(18,4) |  |  |
| 151 | AntiDumpingTaxRate | decimal(18,4) | NN |  |
| 152 | AntiDumpingTaxAmountOC | decimal(18,4) | NN |  |
| 153 | AntiDumpingTaxAmount | decimal(18,4) | NN |  |
| 154 | AntiDumpingTaxAccount | nvarchar(20) |  | Account.AccountNumber |
| 155 | PUContractDetailID | uniqueidentifier |  | PUContractDetailInventoryItem.RefDetailID |
| 156 | ImportSpecialConsumeTaxAccount | nvarchar(20) |  |  |

## PUVoucherDetailCost

Rows: 96 | Columns: 17

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | PUVoucher.RefID |
| 3 | CostType | bit | NN |  |
| 4 | CostRefID | uniqueidentifier | NN |  |
| 5 | PostedDate | datetime | NN |  |
| 6 | RefDate | datetime | NN |  |
| 7 | RefNoFinance | nvarchar(20) |  |  |
| 8 | RefNoManagement | nvarchar(20) |  |  |
| 9 | AccountObjectID | uniqueidentifier |  |  |
| 10 | AccountObjectName | nvarchar(400) |  |  |
| 11 | TotalFreightAmount | decimal(18,4) | NN |  |
| 12 | Amount | decimal(18,4) | NN |  |
| 13 | AccumulatedAllocateAmount | decimal(18,4) | NN |  |
| 14 | SortOrder | int |  |  |
| 15 | TotalFreightAmountOC | decimal(18,4) | NN |  |
| 16 | AmountOC | decimal(18,4) | NN |  |
| 17 | AccumulatedAllocateAmountOC | decimal(18,4) | NN |  |

# 06 — GL Sổ cái / Tổng hợp

## GLParalellVoucher

Rows: 0 | Columns: 5

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | GLParalellVoucherID | uniqueidentifier | PK NN |  |
| 2 | VoucherRefID | uniqueidentifier |  |  |
| 3 | BranchID | uniqueidentifier |  |  |
| 4 | DisplayOnBook | int |  |  |
| 5 | ParalellRefNo | nvarchar(20) |  |  |

## GLVoucher

Rows: 20,640 | Columns: 56

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | DisplayOnBook | int | NN |  |
| 3 | RefType | int | NN |  |
| 4 | RefDate | datetime | NN |  |
| 5 | PostedDate | datetime | NN |  |
| 6 | RefNoFinance | nvarchar(20) |  |  |
| 7 | RefNoManagement | nvarchar(20) |  |  |
| 8 | IsPostedFinance | bit | NN |  |
| 9 | IsPostedManagement | bit | NN |  |
| 10 | JournalMemo | nvarchar(500) |  |  |
| 11 | TotalAmountOC | decimal(18,4) | NN |  |
| 12 | TotalAmount | decimal(18,4) | NN |  |
| 13 | DeptStatus | int |  |  |
| 14 | EditVersion | timestamp |  |  |
| 15 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 16 | CurrencyID | nvarchar(3) |  | CCY.CurrencyID |
| 17 | ExchangeRate | decimal(18,4) |  |  |
| 18 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 19 | AccountObjectName | nvarchar(400) |  |  |
| 20 | OutputAmount | decimal(18,4) |  |  |
| 21 | DeductionAmount | decimal(18,4) |  |  |
| 22 | CreditAccount | nvarchar(20) |  | Account.AccountNumber |
| 23 | DebitAccount | nvarchar(20) |  | Account.AccountNumber |
| 24 | Month | int |  |  |
| 25 | Year | int |  |  |
| 26 | CreatedDate | datetime |  |  |
| 27 | CreatedBy | nvarchar(50) |  |  |
| 28 | ModifiedDate | datetime |  |  |
| 29 | ModifiedBy | nvarchar(50) |  |  |
| 30 | CustomField1 | nvarchar(255) |  |  |
| 31 | CustomField2 | nvarchar(255) |  |  |
| 32 | CustomField3 | nvarchar(255) |  |  |
| 33 | CustomField4 | nvarchar(255) |  |  |
| 34 | CustomField5 | nvarchar(255) |  |  |
| 35 | CustomField6 | nvarchar(255) |  |  |
| 36 | CustomField7 | nvarchar(255) |  |  |
| 37 | CustomField8 | nvarchar(255) |  |  |
| 38 | CustomField9 | nvarchar(255) |  |  |
| 39 | CustomField10 | nvarchar(255) |  |  |
| 40 | RefOrder | int |  |  |
| 41 | ParalellRefID | uniqueidentifier |  |  |
| 42 | ReceiptType | bit |  |  |
| 43 | EmployeeID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 44 | CrossEntryDate | datetime |  |  |
| 45 | DueDate | datetime |  |  |
| 46 | DeductionAmountLastPeriod | decimal(18,4) |  |  |
| 47 | DeductionAmountThisPeriod | decimal(18,4) |  |  |
| 48 | IsOnceSettlementAdvance | bit | NN |  |
| 49 | AdvancedAmount | decimal(18,4) | NN |  |
| 50 | AdvancedAmountOC | decimal(18,4) | NN |  |
| 51 | PeriodTypeVATDeduction | int |  |  |
| 52 | IsExecuted | bit | NN |  |
| 53 | DiffAmount | decimal(18,4) | NN |  |
| 54 | DiffAmountOC | decimal(18,4) | NN |  |
| 55 | TransactionID | nvarchar(100) |  |  |
| 56 | EInvoiceType | int |  |  |

## GLVoucherCrossEntryDetail

Rows: 0 | Columns: 55

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | MappingCrossID | uniqueidentifier |  |  |
| 3 | GLVoucherRefID | uniqueidentifier |  | GLVoucher.RefID |
| 4 | CrossType | int | NN |  |
| 5 | ReceiptType | bit |  |  |
| 6 | AccountNumber | nvarchar(20) | NN | Account.AccountNumber |
| 7 | CurrencyID | nvarchar(3) |  | CCY.CurrencyID |
| 8 | AccountObjectID | uniqueidentifier | NN | AccountObject.AccountObjectID |
| 9 | PayRefID | uniqueidentifier | NN |  |
| 10 | IsPayVoucherPosted | bit |  |  |
| 11 | PayRefType | int | NN |  |
| 12 | PayRefDate | datetime | NN |  |
| 13 | PayPostedDate | datetime | NN |  |
| 14 | PayRefNo | nvarchar(25) |  |  |
| 15 | PayDescription | nvarchar(500) |  |  |
| 16 | TotalPayableAmountOC | decimal(18,4) | NN |  |
| 17 | TotalPayableAmount | decimal(18,4) | NN |  |
| 18 | PayableAmountOC | decimal(18,4) | NN |  |
| 19 | PayableAmount | decimal(18,4) | NN |  |
| 20 | PayAmountOC | decimal(18,4) | NN |  |
| 21 | PayAmount | decimal(18,4) | NN |  |
| 22 | DebtRefID | uniqueidentifier | NN |  |
| 23 | IsDebtVoucherPosted | bit |  |  |
| 24 | DebtRefType | int | NN |  |
| 25 | DebtRefDate | datetime | NN |  |
| 26 | DebtPostedDate | datetime | NN |  |
| 27 | DebtRefNo | nvarchar(25) |  |  |
| 28 | DebtInvNo | nvarchar(MAX) |  |  |
| 29 | DebtDueDate | datetime |  |  |
| 30 | DebtDescription | nvarchar(500) |  |  |
| 31 | TotalDebtableAmountOC | decimal(18,4) | NN |  |
| 32 | TotalDebtableAmount | decimal(18,4) | NN |  |
| 33 | DebtableAmountOC | decimal(18,4) | NN |  |
| 34 | DebtableAmount | decimal(18,4) | NN |  |
| 35 | DebtAmountOC | decimal(18,4) | NN |  |
| 36 | DebtAmount | decimal(18,4) | NN |  |
| 37 | DiscountRate | decimal(8,4) | NN |  |
| 38 | DiscountAmountOC | decimal(18,4) | NN |  |
| 39 | DiscountAmount | decimal(18,4) | NN |  |
| 40 | DiscountAccount | nvarchar(20) |  |  |
| 41 | PaymentTermID | uniqueidentifier |  | PaymentTerm.PaymentTermID |
| 42 | ExchangeDiffAmount | decimal(18,4) | NN |  |
| 43 | SortOrder | int | NN ID |  |
| 44 | BranchID | uniqueidentifier | NN | OrganizationUnit.OrganizationUnitID |
| 45 | DisplayOnBook | int | NN |  |
| 46 | DebtExchangeRate | decimal(18,4) |  |  |
| 47 | LastExchangeRate | decimal(18,4) |  |  |
| 48 | DebtInvDate | datetime |  |  |
| 49 | DebtEmployeeID | uniqueidentifier |  |  |
| 50 | ExchangeDiffVoucherPostedDate | datetime |  |  |
| 51 | CrossDiscountAmountOC | decimal(18,4) | NN |  |
| 52 | CrossDiscountAmount | decimal(18,4) | NN |  |
| 53 | CrossDiscountExchangeDiffAmount | decimal(18,4) | NN |  |
| 82 | PayKeyID | nvarchar(150) | COMP |  |
| 83 | DebtKeyID | nvarchar(150) | COMP |  |

## GLVoucherDetail

Rows: 54,003 | Columns: 69

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | GLVoucher.RefID |
| 3 | Description | nvarchar(255) |  |  |
| 4 | DebitAccount | nvarchar(20) |  | Account.AccountNumber |
| 5 | CreditAccount | nvarchar(20) |  | Account.AccountNumber |
| 6 | AmountOC | decimal(18,4) | NN |  |
| 7 | Amount | decimal(18,4) | NN |  |
| 8 | VATRate | decimal(18,4) |  |  |
| 9 | VATAmount | decimal(18,4) | NN |  |
| 10 | VATAccount | nvarchar(20) |  | Account.AccountNumber |
| 11 | BankAccountID | uniqueidentifier |  | BankAccount.BankAccountID |
| 12 | JobID | uniqueidentifier |  | Job.JobID |
| 13 | PUContractID | uniqueidentifier |  | PUContract.PUContractID |
| 14 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 15 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 16 | CreditAccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 17 | ListItemID | uniqueidentifier |  | ListItem.ListItemID |
| 18 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 19 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 20 | ProjectWorkID | uniqueidentifier |  | ProjectWork.ProjectWorkID |
| 21 | OrderID | uniqueidentifier |  | SAOrder.RefID |
| 22 | UnResonableCost | bit | NN |  |
| 23 | SortOrder | int |  |  |
| 24 | CashOutCurrencyID | nvarchar(3) |  | CCY.CurrencyID |
| 25 | CashOutAmountOC | decimal(18,4) |  |  |
| 26 | CashOutAmountOrg | decimal(18,4) |  |  |
| 27 | CashOutExchangeRate | decimal(18,4) |  |  |
| 28 | CashOutAmount | decimal(18,4) |  |  |
| 29 | CustomField1 | nvarchar(255) |  |  |
| 30 | CustomField2 | nvarchar(255) |  |  |
| 31 | CustomField3 | nvarchar(255) |  |  |
| 32 | CustomField4 | nvarchar(255) |  |  |
| 33 | CustomField5 | nvarchar(255) |  |  |
| 34 | CustomField6 | nvarchar(255) |  |  |
| 35 | CustomField7 | nvarchar(255) |  |  |
| 36 | CustomField8 | nvarchar(255) |  |  |
| 37 | CustomField9 | nvarchar(255) |  |  |
| 38 | CustomField10 | nvarchar(255) |  |  |
| 39 | BudgetItemID | uniqueidentifier |  | BudgetItem.BudgetItemID |
| 40 | VATAmountOC | decimal(18,4) | NN |  |
| 41 | IsListOnTaxDeclaration | bit | NN |  |
| 42 | InvTemplateNo | nvarchar(25) |  |  |
| 43 | InvSeries | nvarchar(20) |  |  |
| 44 | InvDate | datetime |  |  |
| 45 | InvNo | nvarchar(25) |  |  |
| 46 | PurchasePurposeID | uniqueidentifier |  |  |
| 47 | TaxAccountObjectID | uniqueidentifier |  |  |
| 48 | TaxAccountObjectName | nvarchar(400) |  |  |
| 49 | TaxAccountObjectTaxCode | nvarchar(50) |  |  |
| 50 | TaxAccountObjectAddress | nvarchar(400) |  |  |
| 51 | VATDescription | nvarchar(255) |  |  |
| 52 | EmployeeID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 54 | CashOutAmountFinance | decimal(18,4) | NN |  |
| 55 | CashOutDiffAmountFinance | decimal(18,4) | NN |  |
| 56 | CashOutDiffAccountNumberFinance | nvarchar(20) |  | Account.AccountNumber |
| 58 | CashOutAmountManagement | decimal(18,4) | NN |  |
| 59 | CashOutDiffAmountManagement | decimal(18,4) | NN |  |
| 60 | CashOutDiffAccountNumberManagement | nvarchar(20) |  | Account.AccountNumber |
| 61 | CashOutExchangeRateFinance | decimal(20,6) | NN |  |
| 62 | CashOutExchangeRateManagement | decimal(20,6) | NN |  |
| 63 | DebitBankAccount | nvarchar(50) |  |  |
| 64 | DebitBankName | nvarchar(128) |  |  |
| 65 | LastExchangeRate | decimal(18,4) | NN |  |
| 66 | NotIncludeInvoice | bit | NN |  |
| 67 | BusinessType | int |  |  |
| 68 | PUOrderRefID | uniqueidentifier |  | PUOrder.RefID |
| 69 | LOANAgreementID | uniqueidentifier |  | LOANAgreement.LOANAgreementID |
| 70 | InvestmentProjectID | uniqueidentifier |  | InvestmentProject.InvestmentProjectID |
| 74 | VATRateOther | decimal(18,4) |  |  |

## GLVoucherDetailAdvancedPayment

Rows: 0 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | GLVoucher.RefID |
| 3 | VoucherRefID | uniqueidentifier | NN |  |
| 4 | VoucherRefType | int | NN |  |
| 5 | VoucherRefDetailID | uniqueidentifier | NN |  |
| 6 | SortOrder | int |  |  |
| 7 | SettlementThistimeAmountOC | decimal(18,4) | NN |  |
| 8 | SettlementThistimeAmount | decimal(18,4) | NN |  |

## GLVoucherDetailDebtPayment

Rows: 0 | Columns: 21

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | GLVoucher.RefID |
| 3 | VoucherRefID | uniqueidentifier | NN |  |
| 4 | VoucherRefType | int | NN |  |
| 5 | VoucherRefDate | datetime | NN |  |
| 6 | VoucherPostedDate | datetime | NN |  |
| 7 | VoucherRefNoFinance | nvarchar(25) |  |  |
| 8 | VoucherRefNoManagement | nvarchar(25) |  |  |
| 9 | VoucherJounalMemo | nvarchar(500) |  |  |
| 10 | VoucherAccountNumber | nvarchar(20) | NN |  |
| 11 | VoucherAccountObjectID | uniqueidentifier |  |  |
| 12 | VoucherExchangeRate | decimal(18,4) | NN |  |
| 13 | LastExchangeRate | decimal(18,4) | NN |  |
| 14 | ReamainingAmountOC | decimal(18,4) | NN |  |
| 15 | ReamainingAmount | decimal(18,4) | NN |  |
| 16 | ReValueAmount | decimal(18,4) | NN |  |
| 17 | DiffAmount | decimal(18,4) | NN |  |
| 18 | VoucherInvNo | nvarchar(MAX) |  |  |
| 19 | IsDebtVoucher | bit |  |  |
| 20 | VoucherInvDate | datetime |  |  |
| 21 | RevalueExchangeRate | decimal(18,4) |  |  |

## GLVoucherDetailExpenses

Rows: 330 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | GLVoucher.RefID |
| 3 | PrepaidExpensesID | uniqueidentifier | NN | PrepaidExpenses.PrepaidExpensesID |
| 4 | Amount | decimal(18,4) | NN |  |
| 5 | RemainingAmount | decimal(18,4) | NN |  |
| 6 | AllocationAmount | decimal(18,4) | NN |  |

## GLVoucherDetailExpensesAllocation

Rows: 347 | Columns: 11

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | GLVoucher.RefID |
| 3 | PrepaidExpensesID | uniqueidentifier | NN | PrepaidExpenses.PrepaidExpensesID |
| 4 | TotalAllocationAmount | decimal(18,4) | NN |  |
| 5 | AllocationObjectID | uniqueidentifier |  |  |
| 6 | AllocationObjectType | int |  |  |
| 7 | AllocationRate | decimal(18,4) | NN |  |
| 8 | AllocationAmount | decimal(18,4) | NN |  |
| 9 | CostAccount | nvarchar(20) |  |  |
| 10 | SortOrder | int | NN |  |
| 11 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |

## GLVoucherDetailForeignExchange

Rows: 5 | Columns: 15

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | GLVoucher.RefID |
| 3 | AccountNumber | nvarchar(20) | NN | Account.AccountNumber |
| 4 | BankAccountID | uniqueidentifier |  | BankAccount.BankAccountID |
| 5 | DebitAmountOC | decimal(18,4) | NN |  |
| 6 | DebitAmount | decimal(18,4) | NN |  |
| 7 | DebitRevaluate | decimal(18,4) | NN |  |
| 8 | DebitDifference | decimal(18,4) | NN |  |
| 9 | CreditAmountOC | decimal(18,4) | NN |  |
| 10 | CreditAmount | decimal(18,4) | NN |  |
| 11 | CreditRevaluate | decimal(18,4) | NN |  |
| 12 | CreditDifference | decimal(18,4) | NN |  |
| 13 | SortOrder | int |  |  |
| 14 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 15 | ExchangeRate | decimal(18,4) |  |  |

## GLVoucherDetailRevenue

Rows: 0 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | GLVoucher.RefID |
| 3 | PreReceiptRevenueID | uniqueidentifier | NN | PreReceiptRevenue.PreReceiptRevenueID |
| 4 | Amount | decimal(18,4) | NN |  |
| 5 | RemainingAmount | decimal(18,4) | NN |  |
| 6 | AllocationAmount | decimal(18,4) | NN |  |

## GLVoucherDetailRevenueAllocation

Rows: 0 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | GLVoucher.RefID |
| 3 | PreReceiptRevenueID | uniqueidentifier | NN | PreReceiptRevenue.PreReceiptRevenueID |
| 4 | TotalAllocationAmount | decimal(18,4) | NN |  |
| 5 | AllocationObjectID | uniqueidentifier |  |  |
| 6 | AllocationObjectType | int |  |  |
| 7 | AllocationRate | decimal(18,4) | NN |  |
| 8 | AllocationAmount | decimal(18,4) | NN |  |
| 9 | AllocationAccount | nvarchar(20) |  | Account.AccountNumber |
| 10 | SortOrder | int | NN |  |

## GLVoucherDetailTax

Rows: 18,999 | Columns: 21

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | GLVoucher.RefID |
| 3 | Description | nvarchar(255) |  |  |
| 4 | VATAccount | nvarchar(20) |  | Account.AccountNumber |
| 6 | VATAmount | decimal(18,4) | NN |  |
| 7 | VATRate | decimal(18,4) |  |  |
| 8 | TurnoverAmount | decimal(18,4) | NN |  |
| 9 | InvTemplateNo | nvarchar(25) |  |  |
| 10 | InvSeries | nvarchar(20) |  |  |
| 11 | InvNo | nvarchar(25) |  |  |
| 12 | InvDate | datetime |  |  |
| 13 | PurchasePurposeID | uniqueidentifier |  |  |
| 14 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 15 | AccountObjectName | nvarchar(400) |  |  |
| 16 | AccountObjectTaxCode | nvarchar(50) |  |  |
| 17 | AccountObjectAddress | nvarchar(400) |  |  |
| 18 | SortOrder | int |  |  |
| 19 | TACareerGroupID | int |  | TACareerGroup.TACareerGroupID |
| 20 | Sign | smallint |  |  |
| 21 | InvestmentProjectID | uniqueidentifier |  | InvestmentProject.InvestmentProjectID |
| 24 | VATRateOther | decimal(18,4) |  |  |

## GLVoucherList

Rows: 0 | Columns: 13

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefType | int | NN |  |
| 3 | RefDate | datetime | NN |  |
| 4 | RefNo | nvarchar(20) |  |  |
| 6 | JournalMemo | nvarchar(500) |  |  |
| 7 | TotalAmount | decimal(18,4) | NN |  |
| 8 | EditVersion | timestamp | NN |  |
| 9 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 10 | CreatedDate | datetime |  |  |
| 11 | CreatedBy | nvarchar(50) |  |  |
| 12 | ModifiedDate | datetime |  |  |
| 13 | ModifiedBy | nvarchar(50) |  |  |
| 14 | DisplayOnBook | int | NN |  |

## GLVoucherListDetail

Rows: 0 | Columns: 18

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | GLVoucherList.RefID |
| 3 | VoucherRefID | uniqueidentifier |  |  |
| 4 | VoucherRefDetailID | uniqueidentifier |  |  |
| 5 | VoucherRefType | int |  |  |
| 6 | VoucherRefDate | datetime |  |  |
| 7 | VoucherPostedDate | datetime |  |  |
| 8 | VoucherRefNo | nvarchar(20) |  |  |
| 9 | JournalMemo | nvarchar(500) |  |  |
| 10 | Description | nvarchar(500) |  |  |
| 11 | DebitAccount | nvarchar(20) |  |  |
| 12 | CreditAccount | nvarchar(20) |  |  |
| 13 | CurrencyID | nvarchar(3) |  |  |
| 14 | Amount | decimal(18,4) |  |  |
| 15 | SortOrder | int |  |  |
| 20 | VoucherTypeCode | nvarchar(20) |  |  |
| 21 | Note | nvarchar(255) |  |  |
| 22 | VoucherAccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |

## HistoryVoucher

Rows: 0 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | OutwardRefDetailID | uniqueidentifier |  |  |
| 2 | IsPostToManagementBook | bit |  |  |
| 3 | MainOutwardQuantity | decimal(18,4) |  |  |
| 4 | OutwardAmount | decimal(18,4) |  |  |
| 5 | InventoryItemID | uniqueidentifier |  |  |
| 6 | StockID | uniqueidentifier |  |  |

## MonetaryFlowForeCast

Rows: 0 | Columns: 13

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefType | int |  |  |
| 3 | DateRange | nvarchar(200) |  |  |
| 4 | FromDate | date |  |  |
| 5 | ToDate | date |  |  |
| 6 | BranchID | uniqueidentifier |  |  |
| 7 | IncludeDependent | bit |  |  |
| 8 | DisplayOnBook | int |  |  |
| 9 | CreatedBy | nvarchar(50) |  |  |
| 10 | CreatedDate | datetime |  |  |
| 11 | ModifiedBy | nvarchar(50) |  |  |
| 12 | ModifiedDate | datetime |  |  |
| 13 | ForeCastDate | date |  |  |

## MonetaryFlowForeCastDetail

Rows: 0 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier |  | MonetaryFlowForeCast.RefID |
| 3 | GroupKey | nvarchar(10) |  |  |
| 4 | IsParent | bit |  |  |
| 5 | BudgetItemID | uniqueidentifier |  |  |
| 6 | ParentID | uniqueidentifier |  |  |
| 7 | ItemCode | nvarchar(10) |  |  |
| 8 | ItemName | nvarchar(255) |  |  |
| 9 | Amount | decimal(18,4) |  |  |
| 10 | SortOrder | nvarchar(100) |  |  |

## SysNewPostedVoucher

Rows: 0 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | PostID | uniqueidentifier |  |  |
| 2 | PostType | int |  |  |
| 3 | IsPostToManagementBook | bit |  |  |
| 4 | RefID | uniqueidentifier |  |  |
| 5 | RefType | int |  |  |
| 6 | PostedDate | datetime |  |  |
| 7 | RefNoFinance | nvarchar(20) |  |  |
| 8 | RefNoManagement | nvarchar(20) |  |  |
| 9 | CreatedDate | datetime |  |  |

## VoucherReference

Rows: 15,521 | Columns: 11

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID1 | uniqueidentifier |  |  |
| 2 | RefID2 | uniqueidentifier |  |  |
| 3 | RefType1 | int |  |  |
| 4 | RefType2 | int |  |  |
| 5 | RefNoFinance1 | nvarchar(100) |  |  |
| 6 | RefNoFinance2 | nvarchar(100) |  |  |
| 7 | RefNoManagement1 | nvarchar(100) |  |  |
| 8 | RefNoManagement2 | nvarchar(100) |  |  |
| 9 | ReferenceType | int |  |  |
| 10 | SortOrder | int | NN ID |  |
| 11 | ReferenceID | uniqueidentifier | PK NN |  |

## VoucherType

Rows: 36 | Columns: 17

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | VoucherTypeID | uniqueidentifier | PK NN |  |
| 2 | MovementBy | tinyint | NN |  |
| 3 | VoucherTypeCode | nvarchar(20) | NN |  |
| 4 | VoucherTypeName | nvarchar(128) | NN |  |
| 5 | DebitAccount | nvarchar(20) |  |  |
| 6 | CreditAccount | nvarchar(20) |  |  |
| 7 | IsSystem | bit | NN |  |
| 8 | Description | nvarchar(255) |  |  |
| 9 | VoucherTypeCategory | nvarchar(MAX) |  |  |
| 10 | CreatedDate | datetime |  |  |
| 11 | CreatedBy | nvarchar(50) |  |  |
| 12 | ModifiedDate | datetime |  |  |
| 13 | ModifiedBy | nvarchar(50) |  |  |
| 14 | Inactive | bit | NN |  |
| 15 | PrintedCreditAccount | nvarchar(MAX) |  |  |
| 16 | PrintedDebitAccount | nvarchar(MAX) |  |  |
| 17 | CorrespondingSummary | int |  |  |

## VoucherTypeCategory

Rows: 23 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | VoucherTypeCategory | int | PK NN |  |
| 2 | VoucherTypeCategoryName | nvarchar(50) |  |  |
| 3 | Description | nvarchar(255) |  |  |
| 4 | Inactive | bit | NN |  |

## VoucherTypeCategoryRefType

Rows: 135 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ID | uniqueidentifier | PK NN |  |
| 2 | VoucherTypeCategory | int |  | VoucherTypeCategory.VoucherTypeCategory |
| 3 | RefType | int |  | SYSRefType.RefType |

# 07 — FA Tài sản cố định

## FAAdjustment

Rows: 0 | Columns: 19

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefType | int | NN |  |
| 3 | RefDate | datetime | NN |  |
| 4 | PostedDate | datetime | NN |  |
| 5 | RefNo | nvarchar(20) | NN |  |
| 6 | DecisionDate | datetime |  |  |
| 7 | DecisionNo | nvarchar(20) |  |  |
| 8 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 9 | Reason | nvarchar(255) |  |  |
| 10 | JournalMemo | nvarchar(500) |  |  |
| 11 | IsPostedFinance | bit | NN |  |
| 12 | EditVersion | timestamp |  |  |
| 13 | DisplayOnBook | int | NN |  |
| 14 | RefOrder | int | NN |  |
| 15 | CreatedDate | datetime |  |  |
| 16 | CreatedBy | nvarchar(50) |  |  |
| 17 | ModifiedDate | datetime |  |  |
| 18 | ModifiedBy | nvarchar(50) |  |  |
| 19 | IsPostedManagement | bit | NN |  |

## FAAdjustmentDetail

Rows: 0 | Columns: 22

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | FAAdjustment.RefID |
| 3 | FixedAssetID | uniqueidentifier | NN | FixedAsset.FixedAssetID |
| 4 | OrganizationUnitID | uniqueidentifier | NN | OrganizationUnit.OrganizationUnitID |
| 5 | CurrentRemainingAmount | decimal(18,4) | NN |  |
| 6 | NewRemainingAmount | decimal(18,4) | NN |  |
| 7 | DiffRemainingAmount | decimal(18,4) | NN |  |
| 8 | CurrentLifeTime | decimal(18,4) | NN |  |
| 9 | NewLifeTime | decimal(18,4) | NN |  |
| 10 | CurrentAccumDepreciationAmount | decimal(18,4) | NN |  |
| 11 | NewAccumDepreciationAmount | decimal(18,4) | NN |  |
| 12 | DiffAccumDepreciationAmount | decimal(18,4) | NN |  |
| 13 | CostAccount | nvarchar(20) |  | Account.AccountNumber |
| 14 | CurrentDepreciationAmount | decimal(18,4) | NN |  |
| 15 | NewDepreciationAmount | decimal(18,4) | NN |  |
| 16 | DiffDepreciationAmount | decimal(18,4) | NN |  |
| 17 | AdjustmentAccount | nvarchar(20) |  | Account.AccountNumber |
| 18 | NewMonthlyDepreciationAmount | decimal(18,4) | NN |  |
| 19 | NewMonthlyDepreciationAmountByIncomeTax | decimal(18,4) | NN |  |
| 20 | SortOrder | int | NN |  |
| 21 | DiffLifeTime | decimal(18,4) | NN |  |
| 23 | DiffMonthlyDepreciationAmount | decimal(18,4) | NN |  |

## FAAdjustmentDetailPost

Rows: 0 | Columns: 16

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | FAAdjustment.RefID |
| 3 | Description | nvarchar(255) |  |  |
| 4 | DebitAccount | nvarchar(20) |  | Account.AccountNumber |
| 5 | CreditAccount | nvarchar(20) |  | Account.AccountNumber |
| 6 | Amount | decimal(18,4) | NN |  |
| 7 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 8 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 9 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 10 | JobID | uniqueidentifier |  | Job.JobID |
| 11 | ProjectWorkID | uniqueidentifier |  | ProjectWork.ProjectWorkID |
| 12 | OrderID | uniqueidentifier |  | SAOrder.RefID |
| 13 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 14 | UnResonableCost | bit | NN |  |
| 15 | ListItemID | uniqueidentifier |  | ListItem.ListItemID |
| 16 | SortOrder | int | NN |  |

## FAAdjustmentMemberDetail

Rows: 0 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | FAAdjustment.RefID |
| 4 | AccountObjectName | nvarchar(400) |  |  |
| 5 | Position | nvarchar(255) |  |  |
| 6 | Representative | nvarchar(255) |  |  |
| 7 | SortOrder | int | NN ID |  |

## FAAudit

Rows: 0 | Columns: 15

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 3 | RefType | int | NN |  |
| 4 | RefNo | nvarchar(20) |  |  |
| 5 | RefDate | datetime |  |  |
| 6 | RefTime | datetime |  |  |
| 7 | JournalMemo | nvarchar(500) |  |  |
| 8 | InventoryDate | datetime |  |  |
| 9 | Summary | nvarchar(255) |  |  |
| 10 | IsExecuted | bit | NN |  |
| 11 | DisplayOnBook | int | NN |  |
| 12 | CreatedDate | datetime |  |  |
| 13 | CreatedBy | nvarchar(50) |  |  |
| 14 | ModifiedDate | datetime |  |  |
| 15 | ModifiedBy | nvarchar(50) |  |  |

## FAAuditDetail

Rows: 0 | Columns: 13

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | FAAudit.RefID |
| 3 | FixedAssetID | uniqueidentifier | NN | FixedAsset.FixedAssetID |
| 4 | OrganizationUnitID | uniqueidentifier | NN | OrganizationUnit.OrganizationUnitID |
| 5 | OrgPrice | decimal(18,4) | NN |  |
| 6 | DepreciationAmount | decimal(18,4) | NN |  |
| 7 | AccumDepreciationAmount | decimal(18,4) | NN |  |
| 8 | RemainingAmount | decimal(18,4) | NN |  |
| 9 | ExistInStock | int |  |  |
| 10 | Quality | int |  |  |
| 11 | Recommendation | int |  |  |
| 12 | Note | nvarchar(255) |  |  |
| 13 | SortOrder | int | NN |  |

## FAAuditMemberDetail

Rows: 0 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | FAAudit.RefID |
| 4 | AccountObjectName | nvarchar(400) |  |  |
| 5 | Position | nvarchar(128) |  |  |
| 6 | Representative | nvarchar(128) |  |  |
| 7 | SortOrder | int | NN |  |

## FAChangeFinancialLeasingToOwner

Rows: 0 | Columns: 51

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | BranchID | uniqueidentifier | NN | OrganizationUnit.OrganizationUnitID |
| 3 | DisplayOnBook | int | NN |  |
| 4 | RefType | int | NN |  |
| 5 | PostedDate | datetime | NN |  |
| 6 | RefDate | datetime | NN |  |
| 7 | RefNo | nvarchar(20) | NN |  |
| 8 | IsPostedFinance | bit | NN |  |
| 9 | IsPostedManagement | bit | NN |  |
| 10 | JournalMemo | nvarchar(500) |  |  |
| 11 | FixedAssetID | uniqueidentifier | NN | FixedAsset.FixedAssetID |
| 12 | FixedAssetCode | nvarchar(25) | NN |  |
| 13 | OldOrgPriceAccount | nvarchar(20) |  | Account.AccountNumber |
| 14 | NewOrgPriceAccount | nvarchar(20) |  | Account.AccountNumber |
| 15 | OldDepreciationAccount | nvarchar(20) |  | Account.AccountNumber |
| 16 | NewDepreciationAccount | nvarchar(20) |  | Account.AccountNumber |
| 17 | OldOrgPrice | decimal(18,4) | NN |  |
| 18 | NewOrgPrice | decimal(18,4) | NN |  |
| 19 | OldDepreciationAmount | decimal(18,4) | NN |  |
| 20 | NewDepreciationAmount | decimal(18,4) | NN |  |
| 21 | OldAccumDepreciationAmount | decimal(18,4) | NN |  |
| 22 | NewAccumDepreciationAmount | decimal(18,4) | NN |  |
| 23 | OldRemainingAmount | decimal(18,4) | NN |  |
| 24 | NewRemainingAmount | decimal(18,4) | NN |  |
| 25 | OldLifeTime | decimal(18,4) | NN |  |
| 26 | NewLifeTime | decimal(18,4) | NN |  |
| 27 | OldLifeTimeRemaining | decimal(18,4) | NN |  |
| 28 | NewLifeTimeRemaining | decimal(18,4) | NN |  |
| 29 | OldDepreciationRateMonth | decimal(18,4) | NN |  |
| 30 | NewDepreciationRateMonth | decimal(18,4) | NN |  |
| 31 | OldMonthlyDepreciationAmount | decimal(18,4) | NN |  |
| 32 | NewMonthlyDepreciationAmount | decimal(18,4) | NN |  |
| 33 | OldDepreciationRateYear | decimal(18,4) | NN |  |
| 34 | NewDepreciationRateYear | decimal(18,4) | NN |  |
| 35 | OldYearlyDepreciationAmount | decimal(18,4) | NN |  |
| 36 | NewYearlyDepreciationAmount | decimal(18,4) | NN |  |
| 37 | OldIsLimitDepreciationAmount | bit | NN |  |
| 38 | NewIsLimitDepreciationAmount | bit | NN |  |
| 39 | OldDepreciationAmountByIncomeTax | decimal(18,4) | NN |  |
| 40 | NewDepreciationAmountByIncomeTax | decimal(18,4) | NN |  |
| 41 | OldRemainingAmountByIncomeTax | decimal(18,4) | NN |  |
| 42 | NewRemainingAmountByIncomeTax | decimal(18,4) | NN |  |
| 43 | OldMonthlyDepreciationAmountByIncomeTax | decimal(18,4) | NN |  |
| 44 | NewMonthlyDepreciationAmountByIncomeTax | decimal(18,4) | NN |  |
| 45 | EditVersion | timestamp |  |  |
| 46 | RefOrder | int | NN |  |
| 47 | CreatedDate | datetime |  |  |
| 48 | CreatedBy | nvarchar(50) |  |  |
| 49 | ModifiedDate | datetime |  |  |
| 50 | ModifiedBy | nvarchar(50) |  |  |
| 51 | TotalAmount | money |  |  |

## FAChangeFinancialLeasingToOwnerDetail

Rows: 0 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | FAChangeFinancialLeasingToOwner.RefID |
| 3 | Description | nvarchar(255) |  |  |
| 4 | DebitAccount | nvarchar(20) |  | Account.AccountNumber |
| 5 | CreditAccount | nvarchar(20) |  | Account.AccountNumber |
| 6 | Amount | decimal(18,4) | NN |  |
| 7 | ListItemID | uniqueidentifier |  |  |
| 8 | SortOrder | int | NN |  |

## FADecrement

Rows: 0 | Columns: 17

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefType | int | NN |  |
| 3 | RefDate | datetime |  |  |
| 4 | PostedDate | datetime |  |  |
| 5 | RefNo | nvarchar(20) | NN |  |
| 6 | JournalMemo | nvarchar(500) |  |  |
| 7 | TotalAmount | decimal(18,4) | NN |  |
| 8 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 9 | IsPostedFinance | bit | NN |  |
| 10 | DisplayOnBook | int | NN |  |
| 11 | EditVersion | timestamp |  |  |
| 12 | RefOrder | int | NN |  |
| 13 | CreatedDate | datetime |  |  |
| 14 | CreatedBy | nvarchar(50) |  |  |
| 15 | ModifiedDate | datetime |  |  |
| 16 | ModifiedBy | nvarchar(50) |  |  |
| 17 | IsPostedManagement | bit | NN |  |

## FADecrementDetail

Rows: 0 | Columns: 14

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | FADecrement.RefID |
| 3 | FixedAssetID | uniqueidentifier | NN | FixedAsset.FixedAssetID |
| 4 | OrganizationUnitID | uniqueidentifier | NN | OrganizationUnit.OrganizationUnitID |
| 5 | OrgPrice | decimal(18,4) | NN |  |
| 6 | DepreciationAmount | decimal(18,4) | NN |  |
| 7 | AccumDepreciationAmount | decimal(18,4) | NN |  |
| 8 | RemainingAmount | decimal(18,4) | NN |  |
| 9 | OrgPriceAccount | nvarchar(20) |  | Account.AccountNumber |
| 10 | DepreciationAccount | nvarchar(20) |  | Account.AccountNumber |
| 11 | RemainingAccount | nvarchar(20) |  | Account.AccountNumber |
| 12 | SortOrder | int |  |  |
| 13 | FAAuditRefID | uniqueidentifier |  | FAAudit.RefID |
| 14 | DepreciationAmountInMonth | decimal(18,4) |  |  |

## FADecrementDetailPost

Rows: 0 | Columns: 16

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | FADecrement.RefID |
| 3 | Description | nvarchar(255) |  |  |
| 4 | DebitAccount | nvarchar(20) |  | Account.AccountNumber |
| 5 | CreditAccount | nvarchar(20) |  | Account.AccountNumber |
| 6 | Amount | decimal(18,4) | NN |  |
| 7 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 8 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 9 | JobID | uniqueidentifier |  | Job.JobID |
| 10 | ProjectWorkID | uniqueidentifier |  | ProjectWork.ProjectWorkID |
| 11 | OrderID | uniqueidentifier |  | SAOrder.RefID |
| 12 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 13 | UnResonableCost | bit | NN |  |
| 14 | ListItemID | uniqueidentifier |  | ListItem.ListItemID |
| 15 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 16 | SortOrder | int | NN |  |

## FADepreciation

Rows: 3 | Columns: 19

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefType | int | NN |  |
| 3 | RefDate | datetime | NN |  |
| 4 | PostedDate | datetime | NN |  |
| 5 | RefNo | nvarchar(20) | NN |  |
| 6 | JournalMemo | nvarchar(500) |  |  |
| 7 | Month | int | NN |  |
| 8 | Year | int | NN |  |
| 9 | TotalAmount | decimal(18,4) | NN |  |
| 10 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 11 | IsPostedFinance | bit | NN |  |
| 12 | DisplayOnBook | int | NN |  |
| 13 | EditVersion | timestamp |  |  |
| 14 | RefOrder | int | NN |  |
| 15 | CreatedDate | datetime |  |  |
| 16 | CreatedBy | nvarchar(50) |  |  |
| 17 | ModifiedDate | datetime |  |  |
| 18 | ModifiedBy | nvarchar(50) |  |  |
| 19 | IsPostedManagement | bit | NN |  |

## FADepreciationDetail

Rows: 197 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | FADepreciation.RefID |
| 3 | FixedAssetID | uniqueidentifier | NN | FixedAsset.FixedAssetID |
| 4 | OrganizationUnitID | uniqueidentifier | NN | OrganizationUnit.OrganizationUnitID |
| 5 | MonthlyDepreciationAmount | decimal(18,4) | NN |  |
| 6 | AmountResonableCost | decimal(18,4) | NN |  |
| 7 | AmountUnResonableCost | decimal(18,4) | NN |  |
| 8 | SortOrder | int | NN |  |

## FADepreciationDetailAllocation

Rows: 197 | Columns: 12

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | FADepreciation.RefID |
| 3 | FixedAssetID | uniqueidentifier | NN | FixedAsset.FixedAssetID |
| 4 | OrganizationUnitID | uniqueidentifier | NN | OrganizationUnit.OrganizationUnitID |
| 5 | MonthlyDepreciationAmount | decimal(18,4) | NN |  |
| 6 | AllocationObjectID | uniqueidentifier |  |  |
| 7 | CostAccount | nvarchar(20) |  | Account.AccountNumber |
| 8 | AllocationRate | decimal(18,4) | NN |  |
| 9 | AllocationAmount | decimal(18,4) | NN |  |
| 10 | SortOrder | int | NN |  |
| 11 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 12 | ListItemID | uniqueidentifier |  | ListItem.ListItemID |

## FADepreciationDetailPost

Rows: 58 | Columns: 17

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | FADepreciation.RefID |
| 3 | Description | nvarchar(255) |  |  |
| 4 | DebitAccount | nvarchar(20) |  | Account.AccountNumber |
| 5 | CreditAccount | nvarchar(20) |  | Account.AccountNumber |
| 6 | Amount | decimal(18,4) | NN |  |
| 7 | DebitAccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 8 | CreditAccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 9 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 10 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 11 | JobID | uniqueidentifier |  | Job.JobID |
| 12 | ProjectWorkID | uniqueidentifier |  | ProjectWork.ProjectWorkID |
| 13 | OrderID | uniqueidentifier |  | SAOrder.RefID |
| 14 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 15 | UnResonableCost | bit | NN |  |
| 16 | ListItemID | uniqueidentifier |  | ListItem.ListItemID |
| 17 | SortOrder | int | NN |  |

## FATransfer

Rows: 0 | Columns: 17

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefType | int | NN |  |
| 3 | RefDate | datetime |  |  |
| 4 | RefNo | nvarchar(20) | NN |  |
| 5 | HandOverName | nvarchar(128) |  |  |
| 6 | RecipientName | nvarchar(128) |  |  |
| 7 | JournalMemo | nvarchar(500) |  |  |
| 8 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 9 | IsPostedFinance | bit | NN |  |
| 10 | DisplayOnBook | int | NN |  |
| 11 | EditVersion | timestamp |  |  |
| 12 | RefOrder | int | NN |  |
| 13 | CreatedDate | datetime |  |  |
| 14 | CreatedBy | nvarchar(50) |  |  |
| 15 | ModifiedDate | datetime |  |  |
| 16 | ModifiedBy | nvarchar(50) |  |  |
| 17 | IsPostedManagement | bit | NN |  |

## FATransferDetail

Rows: 0 | Columns: 13

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | FATransfer.RefID |
| 3 | FixedAssetID | uniqueidentifier | NN | FixedAsset.FixedAssetID |
| 5 | FromOrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 6 | ToOrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 8 | SortOrder | int |  |  |
| 13 | CostAccount | nvarchar(20) |  | Account.AccountNumber |
| 14 | ListItemID | uniqueidentifier |  |  |
| 15 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 16 | OrderID | uniqueidentifier |  |  |
| 17 | ProjectWorkID | uniqueidentifier |  |  |
| 18 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 19 | JobID | uniqueidentifier |  |  |

## FixedAsset

Rows: 135 | Columns: 70

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | FixedAssetID | uniqueidentifier | PK NN |  |
| 2 | RefNo | nvarchar(20) | NN |  |
| 3 | RefDate | datetime | NN |  |
| 4 | RefType | int | NN |  |
| 5 | FixedAssetCategoryID | uniqueidentifier | NN | FixedAssetCategory.FixedAssetCategoryID |
| 6 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 7 | BranchID | uniqueidentifier | NN | OrganizationUnit.OrganizationUnitID |
| 8 | FixedAssetCode | nvarchar(25) | NN |  |
| 9 | FixedAssetName | nvarchar(128) | NN |  |
| 10 | Quantity | decimal(22,8) |  |  |
| 11 | JournalMemo | nvarchar(500) |  |  |
| 12 | Manufacturer | nvarchar(128) |  |  |
| 13 | ProductionYear | int |  |  |
| 14 | MadeIn | nvarchar(128) |  |  |
| 15 | SerialNumber | nvarchar(64) |  |  |
| 16 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 17 | VendorName | nvarchar(400) |  |  |
| 18 | VendorAddress | nvarchar(255) |  |  |
| 19 | GuaranteeDuration | nvarchar(50) |  |  |
| 20 | GuaranteeCondition | nvarchar(255) |  |  |
| 21 | DeliveryRecordNo | nvarchar(20) |  |  |
| 22 | DeliveryRecordDate | datetime |  |  |
| 23 | State | int |  |  |
| 24 | Quality | int |  |  |
| 25 | IsNotDepreciation | bit | NN |  |
| 26 | OrgPrice | decimal(18,4) |  |  |
| 27 | DepreciationAmount | decimal(18,4) |  |  |
| 28 | LifeTime | decimal(8,4) |  |  |
| 29 | LifeTimeRemaining | decimal(8,4) |  |  |
| 30 | LifeTimeUnit | int | NN |  |
| 31 | LifeTimeRemainingUnit | int | NN |  |
| 32 | DepreciationDate | datetime | NN |  |
| 33 | DepreciationRateMonth | decimal(18,4) |  |  |
| 34 | DepreciationRateYear | decimal(18,4) |  |  |
| 35 | MonthlyDepreciationAmount | decimal(18,4) |  |  |
| 36 | YearlyDepreciationAmount | decimal(18,4) |  |  |
| 37 | AccumDepreciationAmount | decimal(18,4) |  |  |
| 38 | RemainingAmount | decimal(18,4) |  |  |
| 39 | IsLimitDepreciationAmount | bit | NN |  |
| 40 | DepreciationAmountByIncomeTax | decimal(18,4) |  |  |
| 41 | RemainingAmountByIncomeTax | decimal(18,4) |  |  |
| 42 | MonthlyDepreciationAmountByIncomeTax | decimal(18,4) |  |  |
| 43 | OrgPriceAccount | nvarchar(20) |  | Account.AccountNumber |
| 44 | DepreciationAccount | nvarchar(20) |  | Account.AccountNumber |
| 45 | Source | nvarchar(100) |  |  |
| 46 | IsEnoughVoucher | bit | NN |  |
| 47 | RefOrder | int | NN |  |
| 48 | Inactive | int | NN |  |
| 49 | EditVersion | timestamp |  |  |
| 50 | DisplayOnBook | int | NN |  |
| 51 | CreatedDate | datetime |  |  |
| 52 | CreatedBy | nvarchar(50) |  |  |
| 53 | ModifiedDate | datetime |  |  |
| 54 | ModifiedBy | nvarchar(50) |  |  |
| 55 | IsPostedManagement | bit | NN |  |
| 56 | IsPostedFinance | bit | NN |  |
| 57 | LifeTimeInMonth | decimal(8,4) |  |  |
| 58 | LifeTimeRemainingInMonth | decimal(8,4) |  |  |
| 59 | RefID | uniqueidentifier |  |  |
| 60 | FixedAssetOtherBookID | uniqueidentifier |  |  |
| 61 | IsFixedAssetOfStateBudget | bit | NN |  |
| 62 | CapacityMachine | nvarchar(255) |  |  |
| 63 | DecisionNo | nvarchar(20) |  |  |
| 64 | DecisionDate | datetime |  |  |
| 65 | MyReportDelivery | nvarchar(255) |  |  |
| 66 | AddressDelivery | nvarchar(255) |  |  |
| 67 | PricePurchase | decimal(18,0) |  |  |
| 68 | TransportationCost | decimal(18,0) |  |  |
| 69 | TestRunCost | decimal(18,0) |  |  |
| 70 | TechnicalDocument | nvarchar(255) |  |  |

## FixedAssetAttachment

Rows: 0 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | FixedAssetDetailID | uniqueidentifier | PK NN |  |
| 2 | FixedAssetID | uniqueidentifier | NN | FixedAsset.FixedAssetID |
| 3 | FileName | nvarchar(255) | NN |  |
| 4 | FileSize | int | NN |  |
| 5 | FileContent | varbinary | NN |  |
| 6 | SortOrder | int |  |  |
| 7 | Description | nvarchar(255) |  |  |
| 8 | FileExtention | nvarchar(50) |  |  |

## FixedAssetCategory

Rows: 16 | Columns: 15

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | FixedAssetCategoryID | uniqueidentifier | PK NN |  |
| 2 | ParentID | uniqueidentifier |  |  |
| 3 | MISACodeID | nvarchar(100) |  |  |
| 4 | IsParent | bit | NN |  |
| 5 | Grade | int |  |  |
| 6 | FixedAssetCategoryCode | nvarchar(20) |  |  |
| 7 | FixedAssetCategoryName | nvarchar(128) |  |  |
| 11 | OrgPriceAccount | nvarchar(20) |  |  |
| 12 | DepreciationAccount | nvarchar(20) |  |  |
| 14 | Inactive | bit | NN |  |
| 15 | CreatedDate | datetime |  |  |
| 16 | CreatedBy | nvarchar(50) |  |  |
| 17 | ModifiedDate | datetime |  |  |
| 18 | ModifiedBy | nvarchar(50) |  |  |
| 19 | SortMISACodeID | nvarchar(100) |  |  |

## FixedAssetDetail

Rows: 0 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | FixedAssetDetailID | uniqueidentifier | PK NN |  |
| 2 | FixedAssetID | uniqueidentifier | NN | FixedAsset.FixedAssetID |
| 3 | Description | nvarchar(255) |  |  |
| 4 | Quantity | decimal(22,8) | NN |  |
| 5 | WarrantyTime | nvarchar(50) |  |  |
| 6 | SortOrder | int |  |  |
| 7 | Unit | nvarchar(20) |  |  |

## FixedAssetDetailAccessory

Rows: 0 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | FixedAssetDetailID | uniqueidentifier | PK NN |  |
| 2 | FixedAssetID | uniqueidentifier | NN | FixedAsset.FixedAssetID |
| 3 | Description | nvarchar(255) |  |  |
| 4 | Unit | nvarchar(20) |  |  |
| 5 | Quantity | decimal(22,8) | NN |  |
| 6 | Amount | decimal(18,4) | NN |  |
| 7 | SortOrder | int |  |  |

## FixedAssetDetailAllocation

Rows: 135 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | FixedAssetDetailID | uniqueidentifier | PK NN |  |
| 2 | FixedAssetID | uniqueidentifier | NN | FixedAsset.FixedAssetID |
| 3 | SortOrder | int | NN |  |
| 4 | ObjectID | uniqueidentifier | NN |  |
| 5 | ObjectType | int |  |  |
| 6 | AllocationRate | decimal(9,4) | NN |  |
| 7 | CostAccount | nvarchar(20) |  | Account.AccountNumber |
| 12 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 13 | ListItemID | uniqueidentifier |  | ListItem.ListItemID |

## FixedAssetDetailBoardDelivery

Rows: 0 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | FixedAssetDetailID | uniqueidentifier | PK NN |  |
| 2 | FixedAssetID | uniqueidentifier | NN | FixedAsset.FixedAssetID |
| 3 | AccountObjectName | nvarchar(400) |  |  |
| 4 | Position | nvarchar(128) |  |  |
| 5 | Representative | nvarchar(128) |  |  |
| 6 | SortOrder | int | NN |  |

## FixedAssetDetailSource

Rows: 1 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | FixedAssetDetailID | uniqueidentifier | PK NN |  |
| 2 | FixedAssetID | uniqueidentifier | NN | FixedAsset.FixedAssetID |
| 3 | SortOrder | int | NN |  |
| 4 | RefType | int | NN |  |
| 5 | RefID | uniqueidentifier | NN |  |
| 6 | JournalMemo | nvarchar(500) |  |  |
| 7 | RefDetailID | uniqueidentifier |  |  |
| 8 | CreditAccount | nvarchar(20) |  |  |
| 9 | DebitAccount | nvarchar(20) |  |  |

# 08 — SU Công cụ dụng cụ

## SUAdjustment

Rows: 0 | Columns: 15

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefType | int | NN |  |
| 3 | RefDate | datetime | NN |  |
| 5 | RefNo | nvarchar(20) | NN |  |
| 6 | JournalMemo | nvarchar(500) |  |  |
| 7 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 8 | IsPostedManagement | bit | NN |  |
| 9 | DisplayOnBook | int | NN |  |
| 10 | EditVersion | timestamp |  |  |
| 11 | RefOrder | int | NN |  |
| 12 | CreatedDate | datetime |  |  |
| 13 | CreatedBy | nvarchar(50) |  |  |
| 14 | ModifiedDate | datetime |  |  |
| 15 | ModifiedBy | nvarchar(50) |  |  |
| 16 | IsPostedFinance | bit | NN |  |

## SUAdjustmentDetail

Rows: 0 | Columns: 14

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | SUAdjustment.RefID |
| 3 | SupplyID | uniqueidentifier | NN | SUIncrement.SupplyID |
| 4 | Quantity | decimal(22,8) | NN |  |
| 5 | AllocationAccount | nvarchar(20) |  | Account.AccountNumber |
| 6 | CurrentRemainingAmount | decimal(18,4) | NN |  |
| 7 | NewRemainingAmount | decimal(18,4) | NN |  |
| 8 | CurrentRemainingAllocationTime | int | NN |  |
| 9 | NewRemainingAllocationTime | int | NN |  |
| 10 | TermlyAllocationAmount | decimal(18,4) | NN |  |
| 11 | Note | nvarchar(255) |  |  |
| 12 | SortOrder | int |  |  |
| 13 | DiffRemainingAmount | decimal(18,4) | NN |  |
| 15 | DiffAllocationTime | decimal(18,4) | NN |  |

## SUAdjustmentDetailVoucher

Rows: 0 | Columns: 5

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | SUAdjustment.RefID |
| 3 | VoucherRefType | int | NN |  |
| 4 | VoucherRefID | uniqueidentifier | NN |  |
| 6 | SortOrder | int | NN |  |

## SUAllocation

Rows: 3 | Columns: 20

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefType | int | NN |  |
| 3 | RefDate | datetime |  |  |
| 4 | PostedDate | datetime |  |  |
| 5 | RefNo | nvarchar(20) | NN |  |
| 6 | JournalMemo | nvarchar(500) |  |  |
| 7 | Month | int | NN |  |
| 8 | Year | int | NN |  |
| 9 | TotalAmount | decimal(18,4) | NN |  |
| 10 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 11 | IsPostedManagement | bit | NN |  |
| 12 | DisplayOnBook | int | NN |  |
| 13 | EditVersion | timestamp |  |  |
| 14 | RefOrder | int | NN |  |
| 15 | CreatedDate | datetime |  |  |
| 16 | CreatedBy | nvarchar(50) |  |  |
| 17 | ModifiedDate | datetime |  |  |
| 18 | ModifiedBy | nvarchar(50) |  |  |
| 19 | IsPostedFinance | bit | NN |  |
| 20 | IsGetSupplyAllocated | bit | NN |  |

## SUAllocationDetailExpense

Rows: 576 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | SUAllocation.RefID |
| 3 | SupplyID | uniqueidentifier | NN | SUIncrement.SupplyID |
| 4 | TotalAllocationAmount | decimal(18,4) | NN |  |
| 5 | AllocationAmount | decimal(18,4) | NN |  |
| 6 | RemainingAmount | decimal(18,4) | NN |  |
| 7 | SortOrder | int |  |  |
| 8 | SupplyCategoryID | uniqueidentifier |  |  |

## SUAllocationDetailPost

Rows: 102 | Columns: 17

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | SUAllocation.RefID |
| 3 | Description | nvarchar(255) |  |  |
| 4 | DebitAccount | nvarchar(20) |  | Account.AccountNumber |
| 5 | CreditAccount | nvarchar(20) |  | Account.AccountNumber |
| 6 | Amount | decimal(18,4) | NN |  |
| 7 | DebitAccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 8 | CreditAccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 9 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 10 | JobID | uniqueidentifier |  | Job.JobID |
| 11 | ProjectWorkID | uniqueidentifier |  | ProjectWork.ProjectWorkID |
| 12 | OrderID | uniqueidentifier |  | SAOrder.RefID |
| 13 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 14 | UnResonableCost | bit | NN |  |
| 15 | ListItemID | uniqueidentifier |  | ListItem.ListItemID |
| 16 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 17 | SortOrder | int |  |  |

## SUAllocationDetailTable

Rows: 576 | Columns: 11

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | SUAllocation.RefID |
| 3 | SupplyID | uniqueidentifier | NN | SUIncrement.SupplyID |
| 4 | TotalAllocationAmount | decimal(18,4) | NN |  |
| 5 | AllocationObjectID | uniqueidentifier |  |  |
| 6 | AllocationRate | decimal(18,4) | NN |  |
| 7 | AllocationAmount | decimal(18,4) | NN |  |
| 8 | CostAccount | nvarchar(20) |  | Account.AccountNumber |
| 9 | SortOrder | int | NN |  |
| 10 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 11 | IsDetailBreak | bit | NN |  |

## SUAudit

Rows: 0 | Columns: 15

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | BranchID | uniqueidentifier | NN | OrganizationUnit.OrganizationUnitID |
| 3 | RefType | int | NN |  |
| 4 | RefDate | datetime | NN |  |
| 5 | RefTime | datetime | NN |  |
| 6 | RefNo | nvarchar(20) | NN |  |
| 7 | JournalMemo | nvarchar(500) |  |  |
| 8 | BalanceDate | datetime |  |  |
| 9 | Summary | nvarchar(255) |  |  |
| 10 | IsExecuted | bit | NN |  |
| 11 | DisplayOnBook | int | NN |  |
| 12 | CreatedDate | datetime |  |  |
| 13 | CreatedBy | nvarchar(50) |  |  |
| 14 | ModifiedDate | datetime |  |  |
| 15 | ModifiedBy | nvarchar(50) |  |  |

## SUAuditDetail

Rows: 0 | Columns: 13

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | SUAudit.RefID |
| 3 | SupplyID | uniqueidentifier | NN | SUIncrement.SupplyID |
| 5 | OrganizationUnitID | uniqueidentifier | NN | OrganizationUnit.OrganizationUnitID |
| 7 | QuantityOnBook | decimal(22,8) | NN |  |
| 10 | QuantityInventory | decimal(22,8) | NN |  |
| 11 | DiffQuantity | decimal(22,8) | NN |  |
| 12 | GoodQuantity | decimal(22,8) | NN |  |
| 13 | damageQuantity | decimal(22,8) | NN |  |
| 15 | Note | nvarchar(255) |  |  |
| 16 | SortOrder | int | NN |  |
| 17 | ExecuteQuantity | decimal(22,8) | NN |  |
| 18 | Action | int | NN |  |

## SUAuditMemberDetail

Rows: 0 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | SUAudit.RefID |
| 4 | AccountObjectName | nvarchar(400) |  |  |
| 5 | Position | nvarchar(128) |  |  |
| 6 | Representative | nvarchar(128) |  |  |
| 7 | SortOrder | int | NN |  |

## SUDecrement

Rows: 0 | Columns: 16

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | BranchID | uniqueidentifier | NN | OrganizationUnit.OrganizationUnitID |
| 3 | RefType | int | NN |  |
| 4 | RefDate | datetime | NN |  |
| 5 | RefNo | nvarchar(20) | NN |  |
| 6 | JournalMemo | nvarchar(500) |  |  |
| 7 | TotalAmount | decimal(18,4) | NN |  |
| 8 | IsPostedManagement | bit | NN |  |
| 9 | DisplayOnBook | int | NN |  |
| 10 | EditVersion | timestamp |  |  |
| 11 | RefOrder | int | NN |  |
| 12 | CreatedDate | datetime |  |  |
| 13 | CreatedBy | nvarchar(50) |  |  |
| 14 | ModifiedDate | datetime |  |  |
| 15 | ModifiedBy | nvarchar(50) |  |  |
| 16 | IsPostedFinance | bit | NN |  |

## SUDecrementDetail

Rows: 0 | Columns: 12

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | SUDecrement.RefID |
| 3 | SupplyID | uniqueidentifier |  | SUIncrement.SupplyID |
| 4 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 5 | UseQuantity | decimal(22,8) | NN |  |
| 6 | DecrementQuantity | decimal(22,8) | NN |  |
| 7 | DecrementAmount | decimal(18,4) | NN |  |
| 8 | RemainingDecrementAmount | decimal(18,4) | NN |  |
| 9 | Reason | nvarchar(255) |  |  |
| 10 | SortOrder | int |  |  |
| 11 | SUAllocationID | uniqueidentifier |  |  |
| 12 | SUAuditRefID | uniqueidentifier |  |  |

## SUIncrement

Rows: 507 | Columns: 34

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SupplyID | uniqueidentifier | PK NN |  |
| 2 | SupplyCode | nvarchar(25) | NN |  |
| 3 | SupplyName | nvarchar(255) |  |  |
| 4 | BranchID | uniqueidentifier | NN | OrganizationUnit.OrganizationUnitID |
| 5 | RefType | int | NN |  |
| 6 | RefDate | datetime |  |  |
| 7 | RefNo | nvarchar(20) | NN |  |
| 8 | IsPostedManagement | bit | NN |  |
| 9 | Unit | nvarchar(20) |  |  |
| 10 | Quantity | decimal(22,8) | NN |  |
| 11 | UnitPrice | decimal(20,6) | NN |  |
| 12 | Amount | decimal(18,4) | NN |  |
| 13 | AllocationTime | int | NN |  |
| 14 | RemainingAllocationTime | int | NN |  |
| 15 | AllocatedAmount | decimal(18,4) | NN |  |
| 16 | RemaingAmount | decimal(18,4) | NN |  |
| 17 | TermlyAllocationAmount | decimal(18,4) | NN |  |
| 18 | SupplyCategoryID | uniqueidentifier |  | SupplyCategory.SupplyCategoryID |
| 19 | AllocationAccount | nvarchar(20) |  | Account.AccountNumber |
| 20 | DisplayOnBook | int | NN |  |
| 21 | EditVersion | timestamp |  |  |
| 22 | RefOrder | int | NN |  |
| 23 | CreatedDate | datetime |  |  |
| 24 | CreatedBy | nvarchar(50) |  |  |
| 25 | ModifiedDate | datetime |  |  |
| 26 | ModifiedBy | nvarchar(50) |  |  |
| 27 | IsPostedFinance | bit | NN |  |
| 28 | SUAuditRefID | uniqueidentifier |  |  |
| 29 | SupplyOtherBookID | uniqueidentifier |  |  |
| 30 | FADecrementRefID | uniqueidentifier |  |  |
| 31 | INPURefDetailID | nvarchar(MAX) |  |  |
| 32 | ReasonIncrement | nvarchar(255) |  |  |
| 33 | SuspendAllocate | bit | NN |  |
| 34 | SupplyGroup | nvarchar(255) |  |  |

## SUIncrementDetail

Rows: 0 | Columns: 5

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SupplyDetailID | uniqueidentifier | PK NN |  |
| 2 | SupplyID | uniqueidentifier | NN | SUIncrement.SupplyID |
| 3 | Description | nvarchar(255) |  |  |
| 4 | NumberNo | nvarchar(100) |  |  |
| 5 | SortOrder | int | NN |  |

## SUIncrementDetailAllocation

Rows: 507 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SupplyDetailID | uniqueidentifier | PK NN |  |
| 2 | SupplyID | uniqueidentifier | NN | SUIncrement.SupplyID |
| 3 | SortOrder | int | NN |  |
| 4 | ObjectID | uniqueidentifier | NN |  |
| 5 | ObjectType | int |  |  |
| 6 | AllocationRate | decimal(9,4) | NN |  |
| 7 | CostAccount | nvarchar(20) |  | Account.AccountNumber |
| 12 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |

## SUIncrementDetailDepartment

Rows: 507 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SupplyDetailID | uniqueidentifier | PK NN |  |
| 2 | SupplyID | uniqueidentifier | NN | SUIncrement.SupplyID |
| 3 | OrganizationUnitID | uniqueidentifier | NN | OrganizationUnit.OrganizationUnitID |
| 4 | SortOrder | int | NN |  |
| 5 | Quantity | decimal(22,8) | NN |  |
| 6 | UnitPrice | decimal(20,6) | NN |  |
| 7 | Amount | decimal(18,4) | NN |  |
| 8 | AllocationTime | int | NN |  |
| 9 | RemainingAllocationTime | int | NN |  |
| 10 | AllocatedAmount | decimal(18,4) | NN |  |

## SUIncrementDetailSource

Rows: 0 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SupplyDetailID | uniqueidentifier | PK NN |  |
| 2 | SupplyID | uniqueidentifier | NN | SUIncrement.SupplyID |
| 3 | RefID | uniqueidentifier | NN |  |
| 4 | RefType | int | NN |  |
| 5 | SortOrder | int | NN |  |
| 6 | RefDetailID | uniqueidentifier |  |  |
| 7 | JournalMemo | nvarchar(500) |  |  |
| 8 | CreditAccount | nvarchar(20) |  |  |
| 9 | DebitAccount | nvarchar(20) |  |  |
| 11 | FixedAssetID | uniqueidentifier |  |  |

## SUTransfer

Rows: 0 | Columns: 18

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefType | int | NN |  |
| 3 | RefDate | datetime | NN |  |
| 4 | RefNo | nvarchar(20) | NN |  |
| 5 | DeliveryName | nvarchar(128) |  |  |
| 6 | ReceiptName | nvarchar(128) |  |  |
| 7 | JournalMemo | nvarchar(500) |  |  |
| 8 | TotalQuantity | decimal(22,8) | NN |  |
| 9 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 10 | IsPostedManagement | bit | NN |  |
| 11 | DisplayOnBook | int | NN |  |
| 12 | EditVersion | timestamp |  |  |
| 13 | RefOrder | int | NN |  |
| 14 | CreatedDate | datetime |  |  |
| 15 | CreatedBy | nvarchar(50) |  |  |
| 16 | ModifiedDate | datetime |  |  |
| 17 | ModifiedBy | nvarchar(50) |  |  |
| 18 | IsPostedFinance | bit | NN |  |

## SUTransferDetail

Rows: 0 | Columns: 15

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | SUTransfer.RefID |
| 3 | SupplyID | uniqueidentifier |  | SUIncrement.SupplyID |
| 5 | FromOrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 6 | ToOrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 7 | UseQuantity | decimal(22,8) | NN |  |
| 8 | TransferQuantity | decimal(22,8) | NN |  |
| 10 | SortOrder | int |  |  |
| 16 | ListItemID | uniqueidentifier |  |  |
| 17 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 18 | OrderID | uniqueidentifier |  |  |
| 19 | ProjectWorkID | uniqueidentifier |  |  |
| 20 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 21 | JobID | uniqueidentifier |  |  |
| 22 | CostAccount | nvarchar(20) |  | Account.AccountNumber |

## SupplyCategory

Rows: 3 | Columns: 15

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SupplyCategoryID | uniqueidentifier | PK NN |  |
| 2 | ParentID | uniqueidentifier |  |  |
| 3 | IsParent | bit | NN |  |
| 4 | Grade | int |  |  |
| 5 | SupplyCategoryCode | nvarchar(20) | NN |  |
| 6 | SupplyCategoryName | nvarchar(128) | NN |  |
| 7 | Description | nvarchar(255) |  |  |
| 8 | IsSystem | bit | NN |  |
| 9 | Inactive | bit | NN |  |
| 10 | CreatedDate | datetime |  |  |
| 11 | CreatedBy | nvarchar(50) |  |  |
| 12 | ModifiedDate | datetime |  |  |
| 13 | ModifiedBy | nvarchar(50) |  |  |
| 14 | MISACodeID | nvarchar(100) |  |  |
| 15 | SortMISACodeID | nvarchar(100) |  |  |

# 09 — PA Tiền lương

## PASalaryExpense

Rows: 0 | Columns: 30

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | DisplayOnBook | int | NN |  |
| 3 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 4 | RefType | int | NN |  |
| 5 | RefDate | datetime | NN |  |
| 6 | PostedDate | datetime | NN |  |
| 7 | RefNoFinance | nvarchar(20) |  |  |
| 8 | RefNoManagement | nvarchar(20) |  |  |
| 9 | IsPostedFinance | bit | NN |  |
| 10 | IsPostedManagement | bit | NN |  |
| 11 | PASalarySheetRefID | uniqueidentifier |  | PASalarySheet.RefID |
| 12 | PASalarySheetName | nvarchar(255) |  |  |
| 13 | JournalMemo | nvarchar(500) |  |  |
| 14 | TotalAmount | decimal(18,4) | NN |  |
| 15 | EditVersion | timestamp | NN |  |
| 16 | RefOrder | int | NN |  |
| 17 | CreatedDate | datetime |  |  |
| 18 | CreatedBy | nvarchar(50) |  |  |
| 19 | ModifiedDate | datetime |  |  |
| 20 | ModifiedBy | nvarchar(50) |  |  |
| 21 | CustomField1 | nvarchar(255) |  |  |
| 22 | CustomField2 | nvarchar(255) |  |  |
| 23 | CustomField3 | nvarchar(255) |  |  |
| 24 | CustomField4 | nvarchar(255) |  |  |
| 25 | CustomField5 | nvarchar(255) |  |  |
| 26 | CustomField6 | nvarchar(255) |  |  |
| 27 | CustomField7 | nvarchar(255) |  |  |
| 28 | CustomField8 | nvarchar(255) |  |  |
| 29 | CustomField9 | nvarchar(255) |  |  |
| 30 | CustomField10 | nvarchar(255) |  |  |

## PASalaryExpenseAllocation

Rows: 0 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | AllocationType | int | NN |  |
| 3 | PASalarySheetRefID | uniqueidentifier | NN | PASalarySheet.RefID |
| 4 | IsDisplayDetailSalaryInsurance | bit | NN |  |

## PASalaryExpenseAllocationDetail

Rows: 0 | Columns: 65

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | PASalaryExpenseAllocation.RefID |
| 3 | EmployeeID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 4 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 5 | AllocationObjectID | uniqueidentifier | NN |  |
| 6 | AllocationRate | decimal(8,4) | NN |  |
| 7 | AllocationAmount | decimal(18,4) | NN |  |
| 8 | TotalExpenseAmount | decimal(18,4) | NN |  |
| 9 | PaidWorkingdayAmount | decimal(18,4) |  |  |
| 10 | NonWorkingdayAmount | decimal(18,4) |  |  |
| 11 | OverTimeAmount | decimal(18,4) |  |  |
| 12 | PayrollFundAllowance | decimal(18,4) |  |  |
| 13 | OtherAllowance | decimal(18,4) |  |  |
| 14 | CompanySocialInsuranceAmount | decimal(18,4) |  |  |
| 15 | CompanyHealthInsurranceAmount | decimal(18,4) |  |  |
| 16 | CompanyUnemploymentInsurranceAmount | decimal(18,4) |  |  |
| 17 | CompanyLaborUnionContributionAmount | decimal(18,4) |  |  |
| 18 | SortOrder | int | NN |  |
| 19 | CostAccount | nvarchar(20) |  |  |
| 20 | BasicWage | decimal(18,4) |  |  |
| 21 | SalaryCoefficient | decimal(18,4) |  |  |
| 22 | WorkingDayUnitPrice | decimal(18,4) |  |  |
| 23 | WorkingHourUnitPrice | decimal(18,4) |  |  |
| 24 | NumberOfPaidWorkingdayTimeSheet | decimal(18,4) |  |  |
| 25 | NumberOfNonWorkingdayTimeSheet | decimal(18,4) |  |  |
| 26 | TotalOverTime | decimal(18,4) |  |  |
| 27 | TotalAmount | decimal(18,4) | NN |  |
| 28 | AdvancePaymentAmount | decimal(18,4) |  |  |
| 29 | AdvancePaymentAmount141 | decimal(18,4) |  |  |
| 30 | InsuranceSalaryAmount | decimal(18,4) |  |  |
| 31 | SocialInsuranceAmount | decimal(18,4) |  |  |
| 32 | HealthInsurranceAmount | decimal(18,4) |  |  |
| 33 | UnemploymentInsurranceAmount | decimal(18,4) |  |  |
| 34 | LaborUnionContributionAmount | decimal(18,4) |  |  |
| 35 | IncomeTaxAmount | decimal(18,4) |  |  |
| 36 | SumOfDeductionAmount | decimal(18,4) |  |  |
| 37 | FamilyCoditionDeductionAmount | decimal(18,4) |  |  |
| 38 | IncomeForTaxCalculation | decimal(18,4) |  |  |
| 39 | NetAmount | decimal(18,4) |  |  |
| 40 | ColumnNumber1 | decimal(18,4) |  |  |
| 41 | ColumnNumber2 | decimal(18,4) |  |  |
| 42 | ColumnNumber3 | decimal(18,4) |  |  |
| 43 | ColumnNumber4 | decimal(18,4) |  |  |
| 44 | ColumnNumber5 | decimal(18,4) |  |  |
| 45 | ColumnNumber6 | decimal(18,4) |  |  |
| 46 | ColumnNumber7 | decimal(18,4) |  |  |
| 47 | ColumnNumber8 | decimal(18,4) |  |  |
| 48 | ColumnNumber9 | decimal(18,4) |  |  |
| 49 | ColumnNumber10 | decimal(18,4) |  |  |
| 50 | ColumnMoney1 | decimal(18,4) |  |  |
| 51 | ColumnMoney2 | decimal(18,4) |  |  |
| 52 | ColumnMoney3 | decimal(18,4) |  |  |
| 53 | ColumnMoney4 | decimal(18,4) |  |  |
| 54 | ColumnMoney5 | decimal(18,4) |  |  |
| 55 | ColumnMoney6 | decimal(18,4) |  |  |
| 56 | ColumnMoney7 | decimal(18,4) |  |  |
| 57 | ColumnMoney8 | decimal(18,4) |  |  |
| 58 | ColumnMoney9 | decimal(18,4) |  |  |
| 59 | ColumnMoney10 | decimal(18,4) |  |  |
| 60 | ColumnString1 | nvarchar(255) |  |  |
| 61 | ColumnString2 | nvarchar(255) |  |  |
| 62 | ColumnString3 | nvarchar(255) |  |  |
| 63 | ColumnString4 | nvarchar(255) |  |  |
| 64 | ColumnString5 | nvarchar(255) |  |  |
| 65 | TotalPersonalTaxIncomeAmount | decimal(18,4) |  |  |

## PASalaryExpenseDetail

Rows: 0 | Columns: 27

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | PASalaryExpense.RefID |
| 3 | Description | nvarchar(255) |  |  |
| 4 | DebitAccount | nvarchar(20) |  | Account.AccountNumber |
| 5 | CreditAccount | nvarchar(20) |  | Account.AccountNumber |
| 6 | Amount | decimal(18,4) | NN |  |
| 7 | DebitAccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 8 | CreditAccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 9 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 10 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 11 | JobID | uniqueidentifier |  | Job.JobID |
| 12 | ProjectWorkID | uniqueidentifier |  | ProjectWork.ProjectWorkID |
| 13 | OrderID | uniqueidentifier |  | SAOrder.RefID |
| 14 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 15 | UnResonableCost | bit | NN |  |
| 16 | ListItemID | uniqueidentifier |  | ListItem.ListItemID |
| 17 | SortOrder | int | NN |  |
| 18 | CustomField1 | nvarchar(255) |  |  |
| 19 | CustomField2 | nvarchar(255) |  |  |
| 20 | CustomField3 | nvarchar(255) |  |  |
| 21 | CustomField4 | nvarchar(255) |  |  |
| 22 | CustomField5 | nvarchar(255) |  |  |
| 23 | CustomField6 | nvarchar(255) |  |  |
| 24 | CustomField7 | nvarchar(255) |  |  |
| 25 | CustomField8 | nvarchar(255) |  |  |
| 26 | CustomField9 | nvarchar(255) |  |  |
| 27 | CustomField10 | nvarchar(255) |  |  |

## PASalarySheet

Rows: 0 | Columns: 12

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefType | int | NN |  |
| 3 | PASalarySheetMonth | int | NN |  |
| 4 | PASalarySheetYear | int | NN |  |
| 5 | PASalarySheetName | nvarchar(255) |  |  |
| 6 | TotalNetIncomeAmount | decimal(18,4) | NN |  |
| 7 | EditVersion | timestamp | NN |  |
| 8 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 9 | PATimeSheetRefID | uniqueidentifier |  |  |
| 10 | DisplayOnBook | int | NN |  |
| 11 | PASalarySheetPeriod | date | COMP |  |
| 12 | PASalarySheetParameter | nvarchar(MAX) |  |  |

## PASalarySheetColumn

Rows: 493 | Columns: 29

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | PASalarySheetColumnID | uniqueidentifier | PK NN |  |
| 2 | LayoutID | uniqueidentifier |  | PASalarySheetTemplate.LayoutID |
| 3 | RefType | int |  |  |
| 4 | ColumnName | nvarchar(255) | NN |  |
| 5 | ColumnCode | nvarchar(255) | NN |  |
| 6 | ColumnCaption | nvarchar(100) |  |  |
| 7 | ColumnWidth | int | NN |  |
| 8 | ColumnLevel | int |  |  |
| 9 | ParentColumnName | nvarchar(50) |  |  |
| 10 | Visible | bit |  |  |
| 11 | VisiblePosition | int |  |  |
| 12 | IsReadOnly | bit |  |  |
| 13 | DataType | int |  |  |
| 14 | Description | nvarchar(255) |  |  |
| 15 | Formula | nvarchar(500) |  |  |
| 16 | IsExpenseAllocation | bit | NN |  |
| 17 | PayrollExpensePost | int | NN |  |
| 18 | DebitAccount | nvarchar(20) |  | Account.AccountNumber |
| 19 | CreditAccount | nvarchar(20) |  | Account.AccountNumber |
| 20 | SystemColumnType | int |  |  |
| 21 | BranchID | uniqueidentifier |  |  |
| 22 | UseFormula | bit |  |  |
| 23 | ParentID | uniqueidentifier |  |  |
| 24 | MISACodeID | nvarchar(255) |  |  |
| 25 | Grade | int |  |  |
| 26 | IsGroup | bit |  |  |
| 27 | IsParent | bit |  |  |
| 28 | DescriptionDisplay | nvarchar(255) |  |  |
| 29 | ColumnNameDisplay | nvarchar(255) |  |  |

## PASalarySheetDetail

Rows: 0 | Columns: 76

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | PASalarySheetDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | PASalarySheet.RefID |
| 3 | SortOrder | int | NN |  |
| 4 | EmployeeID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 6 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 8 | SalaryCoefficient | decimal(18,4) |  |  |
| 10 | BasicWage | decimal(18,4) |  |  |
| 11 | WorkingDayUnitPrice | decimal(18,4) |  |  |
| 12 | WorkingHourUnitPrice | decimal(18,4) |  |  |
| 14 | NumberOfPaidWorkingdayTimeSheet | decimal(18,4) |  |  |
| 15 | PaidWorkingdayAmount | decimal(18,4) |  |  |
| 17 | NumberOfNonWorkingdayTimeSheet | decimal(18,4) |  |  |
| 18 | NonWorkingdayAmount | decimal(18,4) |  |  |
| 24 | TotalOverTime | decimal(18,4) |  |  |
| 26 | OverTimeAmount | decimal(18,4) |  |  |
| 39 | PayrollFundAllowance | decimal(18,4) |  |  |
| 41 | OtherAllowance | decimal(18,4) |  |  |
| 43 | TotalAmount | decimal(18,4) | NN |  |
| 51 | SocialInsuranceAmount | decimal(18,4) |  |  |
| 53 | HealthInsurranceAmount | decimal(18,4) |  |  |
| 56 | UnemploymentInsurranceAmount | decimal(18,4) |  |  |
| 57 | IncomeTaxAmount | decimal(18,4) |  |  |
| 59 | SumOfDeductionAmount | decimal(18,4) |  |  |
| 61 | FamilyCoditionDeductionAmount | decimal(18,4) |  |  |
| 63 | IncomeForTaxCalculation | decimal(18,4) |  |  |
| 65 | SignName | nvarchar(128) |  |  |
| 66 | ColumnNumber1 | decimal(22,8) |  |  |
| 67 | ColumnNumber2 | decimal(22,8) |  |  |
| 68 | ColumnNumber3 | decimal(22,8) |  |  |
| 69 | ColumnNumber4 | decimal(22,8) |  |  |
| 70 | ColumnNumber5 | decimal(22,8) |  |  |
| 71 | ColumnNumber6 | decimal(22,8) |  |  |
| 72 | ColumnNumber7 | decimal(22,8) |  |  |
| 73 | ColumnNumber8 | decimal(22,8) |  |  |
| 74 | ColumnNumber9 | decimal(22,8) |  |  |
| 75 | ColumnNumber10 | decimal(22,8) |  |  |
| 96 | ColumnMoney1 | decimal(18,4) |  |  |
| 97 | ColumnMoney2 | decimal(18,4) |  |  |
| 98 | ColumnMoney3 | decimal(18,4) |  |  |
| 99 | ColumnMoney4 | decimal(18,4) |  |  |
| 100 | ColumnMoney5 | decimal(18,4) |  |  |
| 101 | ColumnMoney6 | decimal(18,4) |  |  |
| 102 | ColumnMoney7 | decimal(18,4) |  |  |
| 103 | ColumnMoney8 | decimal(18,4) |  |  |
| 104 | ColumnMoney9 | decimal(18,4) |  |  |
| 105 | ColumnMoney10 | decimal(18,4) |  |  |
| 126 | ColumnString1 | nvarchar(255) |  |  |
| 127 | ColumnString2 | nvarchar(255) |  |  |
| 128 | ColumnString3 | nvarchar(255) |  |  |
| 129 | ColumnString4 | nvarchar(255) |  |  |
| 130 | ColumnString5 | nvarchar(255) |  |  |
| 132 | AdvancePaymentAmount | decimal(18,4) |  |  |
| 133 | AdvancePaymentAmount141 | decimal(18,4) |  |  |
| 134 | InsuranceSalaryAmount | decimal(18,4) |  |  |
| 135 | LaborUnionContributionAmount | decimal(18,4) |  |  |
| 136 | NetAmount | decimal(18,4) |  |  |
| 137 | CompanySocialInsuranceAmount | decimal(18,4) |  |  |
| 138 | CompanyHealthInsurranceAmount | decimal(18,4) |  |  |
| 139 | CompanyUnemploymentInsurranceAmount | decimal(18,4) |  |  |
| 140 | CompanyLaborUnionContributionAmount | decimal(18,4) |  |  |
| 142 | TotalDayOrHourByRate | decimal(18,4) |  |  |
| 143 | TotalDayOrHourByRateOvertime | decimal(18,4) |  |  |
| 144 | ContactTitle | nvarchar(128) |  |  |
| 145 | TotalPersonalTaxIncomeAmount | decimal(18,4) |  |  |
| 146 | NumberOfOvertimeWorkingHoursWorkingDay | decimal(18,4) |  |  |
| 147 | OverTimeWorkWorkingDayAmount | decimal(18,4) |  |  |
| 148 | NumberOfOvertimeWorkingHoursWeekendDay | decimal(18,4) |  |  |
| 149 | OverTimeWorkWeekendDayAmount | decimal(18,4) |  |  |
| 150 | NumberOfOvertimeWorkingHoursHoliDay | decimal(18,4) |  |  |
| 151 | OverTimeWorkHoliDayAmount | decimal(18,4) |  |  |
| 152 | NumberOfOvertimeWorkingHoursWorkingDayNight | decimal(18,4) |  |  |
| 153 | OverTimeWorkWorkingDayNightAmount | decimal(18,4) |  |  |
| 154 | NumberOfOvertimeWorkingHoursWeekendDayNight | decimal(18,4) |  |  |
| 155 | OverTimeWorkWeekendDayNightAmount | decimal(18,4) |  |  |
| 156 | NumberOfOvertimeWorkingHoursHoliDayNight | decimal(18,4) |  |  |
| 157 | OverTimeWorkHoliDayNightAmount | decimal(18,4) |  |  |

## PASalarySheetTemplate

Rows: 8 | Columns: 12

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | LayoutID | uniqueidentifier | PK NN |  |
| 2 | LayoutName | nvarchar(255) | NN |  |
| 3 | RefType | int | NN |  |
| 4 | RefTypeName | nvarchar(255) |  |  |
| 5 | UserID | uniqueidentifier |  |  |
| 6 | IsPublic | bit |  |  |
| 7 | CreatedDate | datetime |  |  |
| 8 | CreatedBy | nvarchar(255) |  |  |
| 9 | ModifiedDate | datetime |  |  |
| 10 | ModifiedBy | nvarchar(255) |  |  |
| 11 | IsSystem | bit |  |  |
| 12 | LayoutFile | nvarchar(MAX) |  |  |

## PASalarySheetTemplateUser

Rows: 0 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | LayoutID | uniqueidentifier | NN | PASalarySheetTemplate.LayoutID |
| 2 | UserID | uniqueidentifier | NN |  |
| 3 | State | int | NN |  |
| 4 | PASalarySheetID | uniqueidentifier |  |  |

## PASalaryTaxInsuranceRegulation

Rows: 25 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RegulationID | nvarchar(50) | PK NN |  |
| 2 | RegulationName | nvarchar(100) |  |  |
| 3 | DataType | int |  |  |
| 4 | Value | decimal(18,4) |  |  |

## PATimeSheet

Rows: 0 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | PATimeSheetMonth | int |  |  |
| 3 | PATimeSheetYear | int |  |  |
| 4 | FromDate | datetime |  |  |
| 5 | ToDate | datetime |  |  |
| 6 | RefType | int | NN |  |
| 7 | PATimeSheetName | nvarchar(255) |  |  |
| 8 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 9 | EditVersion | timestamp | NN |  |
| 10 | DisplayOnBook | int |  |  |

## PATimeSheetDetail

Rows: 0 | Columns: 45

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | PATimeSheet.RefID |
| 3 | EmployeeID | uniqueidentifier | NN | AccountObject.AccountObjectID |
| 4 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 5 | Day1 | nvarchar(1000) |  |  |
| 6 | Day2 | nvarchar(1000) |  |  |
| 7 | Day3 | nvarchar(1000) |  |  |
| 8 | Day4 | nvarchar(1000) |  |  |
| 9 | Day5 | nvarchar(1000) |  |  |
| 10 | Day6 | nvarchar(1000) |  |  |
| 11 | Day7 | nvarchar(1000) |  |  |
| 12 | Day8 | nvarchar(1000) |  |  |
| 13 | Day9 | nvarchar(1000) |  |  |
| 14 | Day10 | nvarchar(1000) |  |  |
| 15 | Day11 | nvarchar(1000) |  |  |
| 16 | Day12 | nvarchar(1000) |  |  |
| 17 | Day13 | nvarchar(1000) |  |  |
| 18 | Day14 | nvarchar(1000) |  |  |
| 19 | Day15 | nvarchar(1000) |  |  |
| 20 | Day16 | nvarchar(1000) |  |  |
| 21 | Day17 | nvarchar(1000) |  |  |
| 22 | Day18 | nvarchar(1000) |  |  |
| 23 | Day19 | nvarchar(1000) |  |  |
| 24 | Day20 | nvarchar(1000) |  |  |
| 25 | Day21 | nvarchar(1000) |  |  |
| 26 | Day22 | nvarchar(1000) |  |  |
| 27 | Day23 | nvarchar(1000) |  |  |
| 28 | Day24 | nvarchar(1000) |  |  |
| 29 | Day25 | nvarchar(1000) |  |  |
| 30 | Day26 | nvarchar(1000) |  |  |
| 31 | Day27 | nvarchar(1000) |  |  |
| 32 | Day28 | nvarchar(1000) |  |  |
| 33 | Day29 | nvarchar(1000) |  |  |
| 34 | Day30 | nvarchar(1000) |  |  |
| 35 | Day31 | nvarchar(1000) |  |  |
| 36 | PaidWorkingday | decimal(18,4) |  |  |
| 37 | NonPaidWorkingday | decimal(18,4) |  |  |
| 38 | SortOrder | int | NN |  |
| 46 | WorkingDay | decimal(18,4) | NN |  |
| 47 | WeekendDay | decimal(18,4) | NN |  |
| 48 | Holiday | decimal(18,4) | NN |  |
| 49 | WorkingDayNight | decimal(18,4) | NN |  |
| 50 | WeekendDayNight | decimal(18,4) | NN |  |
| 51 | HolidayNight | decimal(18,4) | NN |  |
| 52 | TotalOverTime | decimal(18,4) | NN |  |

## PATimeSheetSummary

Rows: 0 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | PATimeSheetMonth | int |  |  |
| 3 | PATimeSheetYear | int |  |  |
| 4 | FromDate | datetime |  |  |
| 5 | ToDate | datetime |  |  |
| 6 | RefType | int | NN |  |
| 7 | PATimeSheetName | nvarchar(255) |  |  |
| 8 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 9 | EditVersion | timestamp | NN |  |
| 10 | DisplayOnBook | int |  |  |

## PATimeSheetSummaryDetail

Rows: 0 | Columns: 14

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | PATimeSheetSummary.RefID |
| 3 | EmployeeID | uniqueidentifier | NN | AccountObject.AccountObjectID |
| 4 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 5 | PaidWorkingday | decimal(18,4) |  |  |
| 6 | NonPaidWorkingday | decimal(18,4) |  |  |
| 7 | WorkingDay | decimal(18,4) |  |  |
| 8 | WeekendDay | decimal(18,4) |  |  |
| 9 | Holiday | decimal(18,4) |  |  |
| 10 | TotalOverTime | decimal(18,4) |  |  |
| 11 | SortOrder | int | NN |  |
| 12 | WorkingDayNight | decimal(18,4) |  |  |
| 13 | WeekendDayNight | decimal(18,4) |  |  |
| 14 | HolidayNight | decimal(18,4) |  |  |

## PATimeSheetSummaryDetailMatrix

Rows: 0 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | DetailMatrixID | uniqueidentifier | PK NN |  |
| 2 | RefDetailID | uniqueidentifier | NN | PATimeSheetSummaryDetail.RefDetailID |
| 3 | RefID | uniqueidentifier | NN |  |
| 4 | TimeSheetSignID | uniqueidentifier | NN | TimeSheetSign.TimeSheetSignID |
| 5 | Value | decimal(18,4) | NN |  |
| 6 | IsVisible | bit | NN |  |

## PAVoucherDeduction

Rows: 0 | Columns: 54

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | BranchID | uniqueidentifier | NN | OrganizationUnit.OrganizationUnitID |
| 3 | CompanyTaxCode | nvarchar(50) |  |  |
| 4 | RefType | int | NN |  |
| 5 | RefDate | datetime | NN |  |
| 6 | TemplateNo | nvarchar(50) |  |  |
| 7 | Series | nvarchar(50) |  |  |
| 8 | RefNo | nvarchar(50) |  |  |
| 9 | UserID | uniqueidentifier | NN |  |
| 10 | EmployeeName | nvarchar(255) | NN |  |
| 11 | EmployeeType | int | NN |  |
| 12 | EmployeeID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 13 | EmployeeTaxNo | nvarchar(255) |  |  |
| 14 | NationalName | nvarchar(255) |  |  |
| 15 | IsResident | bit |  |  |
| 16 | EmployeeMobile | nvarchar(50) |  |  |
| 17 | EmployeeAddress | nvarchar(400) |  |  |
| 18 | IdentifyTypeName | nvarchar(255) |  |  |
| 19 | IdentifyNumber | nvarchar(50) |  |  |
| 20 | IdentifyDate | date |  |  |
| 21 | IdentifyIssuedPlaceCode | nvarchar(50) |  |  |
| 22 | IdentifyIssuedPlaceName | nvarchar(255) |  |  |
| 23 | StartMonth | int | NN |  |
| 24 | EndMonth | int | NN |  |
| 25 | IncomeYear | int | NN |  |
| 26 | IncomeDateName | nvarchar(255) |  |  |
| 27 | IncomeTypeName | nvarchar(255) | NN |  |
| 28 | TotalTaxIncome | decimal(20,6) | NN |  |
| 29 | IncomeForCalculateTax | decimal(20,6) | NN |  |
| 30 | PersonalIncomeTax | decimal(20,6) | NN |  |
| 31 | InsuranceCompulsoryPayment | decimal(20,6) | NN |  |
| 32 | VoucherStatus | int | NN |  |
| 33 | VoucherStatusName | nvarchar(255) | NN |  |
| 34 | SentEmployeeStatus | int | NN |  |
| 35 | SentEmployeeStatusName | nvarchar(255) |  |  |
| 36 | CancelDate | datetime |  |  |
| 37 | CancelReason | nvarchar(400) |  |  |
| 38 | ModifiedDate | datetime |  |  |
| 39 | CreatedDate | datetime |  |  |
| 40 | CreatedBy | nvarchar(50) |  |  |
| 41 | ModifiedBy | nvarchar(50) |  |  |
| 42 | EditVersion | timestamp |  |  |
| 43 | TaxHoldingConfigID | int |  |  |
| 44 | TransactionID | uniqueidentifier |  |  |
| 45 | OrganizationID | uniqueidentifier |  |  |
| 46 | TaxHoldingConfigType | int |  |  |
| 47 | ReceiverName | nvarchar(MAX) |  |  |
| 48 | ReceiverEmail | nvarchar(MAX) |  |  |
| 49 | CCEmail | nvarchar(MAX) |  |  |
| 50 | BCCEmail | nvarchar(MAX) |  |  |
| 51 | CreatorEmail | nvarchar(255) |  |  |
| 52 | CreatorName | nvarchar(100) |  |  |
| 53 | CreatorJobName | nvarchar(255) |  |  |
| 54 | CreatorPhone | nvarchar(50) |  |  |

## PAVoucherTemplate

Rows: 0 | Columns: 32

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | TemplateID | uniqueidentifier | PK NN |  |
| 2 | TaxHoldingConfigID | int |  |  |
| 3 | OrganizationID | uniqueidentifier |  |  |
| 4 | TenantID | uniqueidentifier |  |  |
| 5 | OrganizationJSON | nvarchar(MAX) |  |  |
| 6 | Year | int |  |  |
| 7 | FormNo | nvarchar(20) |  |  |
| 8 | OrganizationSymbol | nvarchar(5) |  |  |
| 9 | DocumentSymbol | nvarchar(10) |  |  |
| 10 | SerialNo | nvarchar(20) |  |  |
| 11 | No | nvarchar(10) |  |  |
| 12 | TaxHoldingStatus | int |  |  |
| 13 | CreatedBy | nvarchar(100) |  |  |
| 14 | CreatedDate | datetime |  |  |
| 15 | ModifiedBy | nvarchar(100) |  |  |
| 16 | ModifiedDate | datetime |  |  |
| 17 | TaxHoldingLogoConfig | int |  |  |
| 18 | TaxHoldingLogoPositionConfig | int |  |  |
| 19 | TaxHoldingConfigType | int |  |  |
| 20 | TaxHoldingMoreInfor | nvarchar(MAX) |  |  |
| 21 | ReplaceOrgName | nvarchar(MAX) |  |  |
| 22 | TemplateName | nvarchar(255) |  |  |
| 23 | TemplateFileName | nvarchar(255) |  |  |
| 24 | IsCustomTemplate | bit |  |  |
| 25 | FileNameDefault | nvarchar(255) |  |  |
| 26 | TypePaper | int |  |  |
| 27 | OrganizationLogo | nvarchar(MAX) |  |  |
| 28 | BackgroundColor | nvarchar(255) |  |  |
| 29 | BackgroundCode | nvarchar(255) |  |  |
| 30 | ImageCode | nvarchar(255) |  |  |
| 31 | ImageColor | nvarchar(255) |  |  |
| 32 | ImageType | int |  |  |

## PAVoucherUsage

Rows: 0 | Columns: 19

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | BranchID | uniqueidentifier | NN |  |
| 3 | RefType | int | NN |  |
| 4 | DeclarationName | nvarchar(255) |  |  |
| 5 | DeclarationTerm | nvarchar(255) |  |  |
| 6 | FromDate | datetime | NN |  |
| 7 | ToDate | datetime | NN |  |
| 8 | Editversion | timestamp | NN |  |
| 9 | OrganizationPay | nvarchar(255) |  |  |
| 10 | TaxCode | nvarchar(50) |  |  |
| 11 | Address | nvarchar(255) |  |  |
| 12 | PhoneNumber | nvarchar(50) |  |  |
| 13 | LegalRepresentative | nvarchar(255) | NN |  |
| 14 | SignDate | datetime | NN |  |
| 15 | TotalAmount | decimal(21,6) | NN |  |
| 16 | CreatedDate | datetime |  |  |
| 17 | CreatedBy | nvarchar(50) |  |  |
| 18 | ModifiedDate | datetime |  |  |
| 19 | ModifiedBy | nvarchar(50) |  |  |

## PAVoucherUsageDetail

Rows: 0 | Columns: 12

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | PAVoucherUsage.RefID |
| 3 | SortOrder | int | NN |  |
| 4 | Series | nvarchar(50) |  |  |
| 5 | OriginalRefID | uniqueidentifier |  |  |
| 6 | RefTypeReference | int |  |  |
| 7 | RefNo | nvarchar(50) |  |  |
| 8 | RefDate | datetime |  |  |
| 9 | EmployeeName | nvarchar(255) |  |  |
| 10 | EmployeeTaxNo | nvarchar(255) |  |  |
| 11 | Amount | decimal(21,6) | NN |  |
| 12 | Note | nvarchar(255) |  |  |

# 10 — JC Giá thành

## JCAccepted

Rows: 0 | Columns: 20

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | DisplayOnBook | int | NN |  |
| 3 | RefType | int | NN |  |
| 4 | RefDate | datetime | NN |  |
| 5 | PostedDate | datetime | NN |  |
| 6 | RefNo | nvarchar(20) | NN |  |
| 7 | IsPostedManagement | bit | NN |  |
| 8 | JCPeriodID | uniqueidentifier |  | JCPeriod.JCPeriodID |
| 9 | JournalMemo | nvarchar(500) |  |  |
| 10 | TotalAmountOC | decimal(18,4) | NN |  |
| 11 | TotalAmount | decimal(18,4) | NN |  |
| 12 | EditVersion | timestamp | NN |  |
| 13 | BranchID | uniqueidentifier |  |  |
| 14 | CreatedDate | datetime |  |  |
| 15 | CreatedBy | nvarchar(50) |  |  |
| 16 | ModifiedDate | datetime |  |  |
| 17 | ModifiedBy | nvarchar(50) |  |  |
| 18 | IsPostedFinance | bit | NN |  |
| 19 | RefOrder | int |  |  |
| 20 | IsDetailExpenseItem | bit | NN |  |

## JCAcceptedDetail

Rows: 0 | Columns: 18

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | JCAccepted.RefID |
| 3 | Description | nvarchar(255) |  |  |
| 4 | DebitAccount | nvarchar(20) |  | Account.AccountNumber |
| 5 | CreditAccount | nvarchar(20) |  | Account.AccountNumber |
| 6 | TotalCostAmount | decimal(18,4) | NN |  |
| 7 | AcceptedRate | decimal(18,4) | NN |  |
| 8 | Amount | decimal(18,4) | NN |  |
| 9 | ProjectWorkID | uniqueidentifier |  | ProjectWork.ProjectWorkID |
| 10 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 11 | OrderID | uniqueidentifier |  | SAOrder.RefID |
| 12 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 13 | ListItemID | uniqueidentifier |  | ListItem.ListItemID |
| 14 | SortOrder | int |  |  |
| 15 | UnResonableCost | bit | NN |  |
| 16 | OrganizationUnitID | uniqueidentifier |  |  |
| 17 | JobID | uniqueidentifier |  |  |
| 18 | RevenueAmount | decimal(18,4) | NN |  |

## JCAllocationExpense

Rows: 0 | Columns: 16

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | BranchID | uniqueidentifier | NN | OrganizationUnit.OrganizationUnitID |
| 3 | RefType | int |  |  |
| 4 | RefDate | datetime | NN |  |
| 5 | RefNo | nvarchar(20) | NN |  |
| 6 | FromDate | datetime |  |  |
| 7 | ToDate | datetime |  |  |
| 8 | PeriodDescription | nvarchar(255) |  |  |
| 9 | JournalMemo | nvarchar(500) |  |  |
| 10 | AllocationMethod | int | NN |  |
| 11 | DisplayOnBook | int | NN |  |
| 12 | CreatedDate | datetime |  |  |
| 13 | CreatedBy | nvarchar(50) |  |  |
| 14 | ModifiedDate | datetime |  |  |
| 15 | ModifiedBy | nvarchar(50) |  |  |
| 16 | AllocationType | int | NN |  |

## JCAllocationExpenseDetail

Rows: 0 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | JCAllocationExpense.RefID |
| 3 | AccountNumber | nvarchar(20) | NN | Account.AccountNumber |
| 4 | AccountName | nvarchar(128) |  |  |
| 5 | TotalCostAmount | decimal(18,4) | NN |  |
| 6 | AllocationAmount | decimal(18,4) | NN |  |
| 7 | AllocationRate | decimal(18,4) | NN |  |
| 8 | SortOrder | int |  |  |
| 9 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 10 | ExpenseItemName | nvarchar(128) |  |  |

## JCAllocationExpenseDetailTable

Rows: 0 | Columns: 12

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | JCAllocationExpense.RefID |
| 3 | AccountNumber | nvarchar(20) |  | Account.AccountNumber |
| 4 | AccountName | nvarchar(128) |  |  |
| 5 | AllocationObjectID | uniqueidentifier |  |  |
| 8 | AllocationRate | decimal(24,10) | NN |  |
| 9 | AllocationAmount | decimal(18,4) | NN |  |
| 10 | SortOrder | int | NN |  |
| 12 | AllocationObjectType | int |  |  |
| 13 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 14 | ExpenseItemName | nvarchar(128) |  |  |
| 15 | OrganizationUnitTypeID | int |  |  |

## JCAllocationQuantum

Rows: 0 | Columns: 13

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | JobID | uniqueidentifier | PK NN | Job.JobID |
| 2 | DirectMatetialAmount | decimal(18,4) | NN |  |
| 3 | IndirectMatetialAmount | decimal(18,4) | NN |  |
| 4 | DirectLaborAmount | decimal(18,4) | NN |  |
| 5 | IndirectLaborAmount | decimal(18,4) | NN |  |
| 6 | DepreciationAmount | decimal(18,4) | NN |  |
| 7 | PurchaseAmount | decimal(18,4) | NN |  |
| 8 | OtherAmount | decimal(18,4) | NN |  |
| 9 | TotalAmount | decimal(18,4) | NN |  |
| 10 | CreatedDate | datetime |  |  |
| 11 | CreatedBy | nvarchar(50) |  |  |
| 12 | ModifiedDate | datetime |  |  |
| 13 | ModifiedBy | nvarchar(50) |  |  |

## JCAllocationQuantumConfig

Rows: 3,906 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | JobID | uniqueidentifier | PK NN |  |
| 2 | JCPeriodID | uniqueidentifier | PK NN |  |
| 3 | AccountNumber | nvarchar(20) | PK NN |  |
| 4 | Amount | decimal(18,4) | NN |  |
| 5 | CreatedDate | datetime |  |  |
| 6 | CreatedBy | nvarchar(50) |  |  |
| 7 | ModifiedDate | datetime |  |  |
| 8 | ModifiedBy | nvarchar(50) |  |  |

## JCCostAllocationConfig

Rows: 0 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | JCPeriodID | uniqueidentifier | NN | JCPeriod.JCPeriodID |
| 3 | AllocationMethod | int | NN |  |
| 4 | DisplayOnBook | int | NN |  |

## JCCostAllocationDetail

Rows: 0 | Columns: 15

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | JCPeriodDetailID | uniqueidentifier | NN | JCPeriodDetail.JCPeriodDetailID |
| 3 | JCPeriodID | uniqueidentifier | NN |  |
| 4 | JobID | uniqueidentifier |  | Job.JobID |
| 5 | ProjectWorkID | uniqueidentifier |  | ProjectWork.ProjectWorkID |
| 6 | OrderID | uniqueidentifier |  | SAOrder.RefID |
| 7 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 8 | AccountNumber | nvarchar(20) |  | Account.AccountNumber |
| 9 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 10 | AllocationRate | decimal(24,10) | NN |  |
| 11 | AllocationAmount | decimal(18,4) | NN |  |
| 12 | DisplayOnBook | int | NN |  |
| 13 | AllocationMethod | int | NN |  |
| 14 | IsAllocation | bit | NN |  |
| 15 | UnResonableCost | bit | NN |  |

## JCCostVoucher

Rows: 0 | Columns: 18

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | JCCostVoucherID | uniqueidentifier | PK NN |  |
| 2 | JCPeriodID | uniqueidentifier |  | JCPeriod.JCPeriodID |
| 3 | RefID | uniqueidentifier | NN |  |
| 4 | RefDate | datetime | NN |  |
| 5 | PostedDate | datetime |  |  |
| 6 | RefNo | nvarchar(20) |  |  |
| 8 | RefType | int | NN |  |
| 9 | JournalMemo | nvarchar(500) |  |  |
| 10 | AccountNumber | nvarchar(20) |  | Account.AccountNumber |
| 11 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 12 | TotalAmount | decimal(18,4) | NN |  |
| 13 | RemainingAmount | decimal(18,4) | NN |  |
| 14 | AllocationRate | decimal(18,4) | NN |  |
| 15 | AllocationAmount | decimal(18,4) | NN |  |
| 16 | DisplayOnBook | int | NN |  |
| 17 | AccountNumberTotalAmount | decimal(18,4) | NN |  |
| 18 | AccountNumberRemainingAmount | decimal(18,4) |  |  |
| 19 | UnResonableCost | bit | NN |  |

## JCExpenseTranfer

Rows: 0 | Columns: 19

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | DisplayOnBook | int | NN |  |
| 3 | RefType | int | NN |  |
| 4 | RefDate | datetime | NN |  |
| 5 | PostedDate | datetime | NN |  |
| 6 | RefNo | nvarchar(20) | NN |  |
| 7 | IsPostedFinance | bit | NN |  |
| 8 | JCPeriodID | uniqueidentifier |  | JCPeriod.JCPeriodID |
| 9 | JournalMemo | nvarchar(500) |  |  |
| 10 | TotalAmountOC | decimal(18,4) | NN |  |
| 11 | TotalAmount | decimal(18,4) | NN |  |
| 12 | EditVersion | timestamp | NN |  |
| 13 | BranchID | uniqueidentifier |  |  |
| 14 | ModifiedBy | nvarchar(50) |  |  |
| 15 | CreatedDate | datetime |  |  |
| 16 | CreatedBy | nvarchar(50) |  |  |
| 17 | ModifiedDate | datetime |  |  |
| 18 | IsPostedManagement | bit | NN |  |
| 19 | RefOrder | int |  |  |

## JCExpenseTranferDetail

Rows: 0 | Columns: 15

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | JCExpenseTranfer.RefID |
| 3 | Description | nvarchar(255) |  |  |
| 4 | DebitAccount | nvarchar(20) |  | Account.AccountNumber |
| 5 | CreditAccount | nvarchar(20) |  | Account.AccountNumber |
| 6 | Amount | decimal(18,4) | NN |  |
| 7 | JobID | uniqueidentifier |  | Job.JobID |
| 8 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 9 | ProjectWorkID | uniqueidentifier |  | ProjectWork.ProjectWorkID |
| 10 | OrderID | uniqueidentifier |  | SAOrder.RefID |
| 11 | ListItemID | uniqueidentifier |  | ListItem.ListItemID |
| 12 | SortOrder | int |  |  |
| 13 | OrganizationUnitID | uniqueidentifier |  |  |
| 14 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 15 | UnResonableCost | bit | NN |  |

## JCOPN

Rows: 591 | Columns: 29

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | BranchID | uniqueidentifier | NN | OrganizationUnit.OrganizationUnitID |
| 3 | ProjectWorkID | uniqueidentifier |  | ProjectWork.ProjectWorkID |
| 4 | JobID | uniqueidentifier |  | Job.JobID |
| 5 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 6 | OrderID | uniqueidentifier |  | SAOrder.RefID |
| 7 | DirectMatetialAmount | decimal(18,4) | NN |  |
| 8 | IndirectMatetialAmount | decimal(18,4) | NN |  |
| 9 | DirectLaborAmount | decimal(18,4) | NN |  |
| 10 | IndirectLaborAmount | decimal(18,4) | NN |  |
| 11 | DepreciationAmount | decimal(18,4) | NN |  |
| 12 | PurchaseAmount | decimal(18,4) | NN |  |
| 13 | OtherAmount | decimal(18,4) | NN |  |
| 14 | MachineIndirectMatetialAmount | decimal(18,4) | NN |  |
| 15 | MachineIndirectLaborAmount | decimal(18,4) | NN |  |
| 16 | MachineDepreciationAmount | decimal(18,4) | NN |  |
| 17 | MachinePurchaseAmount | decimal(18,4) | NN |  |
| 18 | MachineOtherAmount | decimal(18,4) | NN |  |
| 19 | AcceptedAmount | decimal(18,4) | NN |  |
| 20 | NotAcceptedAmount | decimal(18,4) | NN |  |
| 21 | TotalAmount | decimal(18,4) | NN |  |
| 22 | SortOrder | int | NN |  |
| 23 | DisplayOnBook | int | NN |  |
| 24 | CreatedDate | datetime |  |  |
| 25 | CreatedBy | nvarchar(50) |  |  |
| 26 | ModifiedDate | datetime |  |  |
| 27 | ModifiedBy | nvarchar(50) |  |  |
| 28 | UncompletedAccount | nvarchar(20) |  | Account.AccountNumber |
| 29 | UnResonableCost | bit | NN |  |

## JCOPNAllocation

Rows: 0 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | ExpenseItemID | uniqueidentifier | NN | ExpenseItem.ExpenseItemID |
| 3 | Amount | decimal(18,4) | NN |  |
| 4 | BranchID | uniqueidentifier | NN |  |
| 5 | DisplayOnBook | int | NN |  |
| 6 | SortOrder | int | NN |  |
| 7 | CreatedDate | datetime |  |  |
| 8 | CreatedBy | nvarchar(50) |  |  |
| 9 | ModifiedDate | datetime |  |  |
| 10 | ModifiedBy | nvarchar(50) |  |  |

## JCOPNConfig

Rows: 1 | Columns: 5

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | JCOPNConfigID | uniqueidentifier | PK NN |  |
| 2 | IsDetailJobByExpense | bit | NN |  |
| 3 | IsDetailProjectWorkByExpense | bit | NN |  |
| 4 | IsDetailOrderByExpense | bit | NN |  |
| 5 | IsDetailContractByExpense | bit | NN |  |

## JCOPNDetail

Rows: 0 | Columns: 15

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | JCOPN.RefID |
| 3 | DirectMatetialAmount | decimal(18,4) | NN |  |
| 4 | IndirectMatetialAmount | decimal(18,4) | NN |  |
| 5 | DirectLaborAmount | decimal(18,4) | NN |  |
| 6 | IndirectLaborAmount | decimal(18,4) | NN |  |
| 7 | DepreciationAmount | decimal(18,4) | NN |  |
| 8 | PurchaseAmount | decimal(18,4) | NN |  |
| 9 | OtherAmount | decimal(18,4) | NN |  |
| 10 | MachineIndirectMatetialAmount | decimal(18,4) | NN |  |
| 11 | MachineIndirectLaborAmount | decimal(18,4) | NN |  |
| 12 | MachineDepreciationAmount | decimal(18,4) | NN |  |
| 13 | MachinePurchaseAmount | decimal(18,4) | NN |  |
| 14 | MachineOtherAmount | decimal(18,4) | NN |  |
| 15 | TotalAmount | decimal(18,4) | NN |  |

## JCPeriod

Rows: 0 | Columns: 12

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | JCPeriodID | uniqueidentifier | PK NN |  |
| 2 | JCPeriodType | int | NN |  |
| 3 | FromDate | datetime | NN |  |
| 4 | ToDate | datetime | NN |  |
| 5 | JCPeriodName | nvarchar(255) | NN |  |
| 7 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 8 | CreatedDate | datetime |  |  |
| 9 | CreatedBy | nvarchar(50) |  |  |
| 10 | ModifiedDate | datetime |  |  |
| 11 | ModifiedBy | nvarchar(50) |  |  |
| 12 | DisplayOnBook | int | NN |  |
| 13 | IsDetailExpenseItem | bit | NN |  |

## JCPeriodDetail

Rows: 0 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | JCPeriodDetailID | uniqueidentifier | PK NN |  |
| 2 | JCPeriodID | uniqueidentifier | NN | JCPeriod.JCPeriodID |
| 3 | JobID | uniqueidentifier |  | Job.JobID |
| 4 | ProjectWorkID | uniqueidentifier |  | ProjectWork.ProjectWorkID |
| 5 | OrderID | uniqueidentifier |  | SAOrder.RefID |
| 6 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 7 | SortOrder | int |  |  |

## JCProductCostAllocationConfig

Rows: 0 | Columns: 16

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | JCPeriodDetailID | uniqueidentifier | NN | JCPeriodDetail.JCPeriodDetailID |
| 3 | JobID | uniqueidentifier | NN | Job.JobID |
| 4 | JCPeriodID | uniqueidentifier | NN |  |
| 5 | AllocationMethod | int | NN |  |
| 6 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 7 | IsInventoryItemStandard | bit | NN |  |
| 8 | Quantity | decimal(22,8) | NN |  |
| 9 | CostPrice | decimal(20,6) | NN |  |
| 10 | Coefficient | decimal(24,10) |  |  |
| 11 | QuantityStandard | decimal(22,8) | NN |  |
| 12 | AllocationStandard | decimal(18,4) | NN |  |
| 13 | AllocationRate | decimal(24,10) | NN |  |
| 14 | SortOrder | int | NN |  |
| 15 | DisplayOnBook | int | NN |  |
| 16 | PhaseID | uniqueidentifier |  |  |

## JCProductCostDetail

Rows: 0 | Columns: 19

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | JCPeriodDetailID | uniqueidentifier |  | JCPeriodDetail.JCPeriodDetailID |
| 3 | JobID | uniqueidentifier | NN | Job.JobID |
| 4 | JCPeriodID | uniqueidentifier | NN |  |
| 5 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 6 | Coefficient | decimal(24,10) | NN |  |
| 7 | SortOrder | int | NN |  |
| 8 | DirectMatetialAmount | decimal(18,4) | NN |  |
| 9 | IndirectMatetialAmount | decimal(18,4) | NN |  |
| 10 | DirectLaborAmount | decimal(18,4) | NN |  |
| 11 | IndirectLaborAmount | decimal(18,4) | NN |  |
| 12 | DepreciationAmount | decimal(18,4) | NN |  |
| 13 | PurchaseAmount | decimal(18,4) | NN |  |
| 14 | OtherAmount | decimal(18,4) | NN |  |
| 15 | TotalAmount | decimal(18,4) | NN |  |
| 16 | TotalQuantity | decimal(22,8) | NN |  |
| 17 | CostPrice | decimal(20,6) | NN |  |
| 18 | DisplayOnBook | int | NN |  |
| 19 | PhaseID | uniqueidentifier |  |  |

## JCProductQuantum

Rows: 0 | Columns: 13

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | InventoryItemID | uniqueidentifier | PK NN | InventoryItem.InventoryItemID |
| 2 | DirectMatetialAmount | decimal(18,4) | NN |  |
| 3 | IndirectMatetialAmount | decimal(18,4) | NN |  |
| 4 | DirectLaborAmount | decimal(18,4) | NN |  |
| 5 | IndirectLaborAmount | decimal(18,4) | NN |  |
| 6 | DepreciationAmount | decimal(18,4) | NN |  |
| 7 | PurchaseAmount | decimal(18,4) | NN |  |
| 8 | OtherAmount | decimal(18,4) | NN |  |
| 9 | TotalAmount | decimal(18,4) | NN |  |
| 10 | CreatedDate | datetime |  |  |
| 11 | CreatedBy | nvarchar(50) |  |  |
| 12 | ModifiedDate | datetime |  |  |
| 13 | ModifiedBy | nvarchar(50) |  |  |

## JCProjectAllocationQuantumConfig

Rows: 0 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ProjectWorkID | uniqueidentifier | PK NN | ProjectWork.ProjectWorkID |
| 2 | JCPeriodID | uniqueidentifier | PK NN |  |
| 3 | AccountNumber | nvarchar(20) | PK NN |  |
| 4 | Amount | decimal(18,4) |  |  |
| 5 | CreatedDate | datetime |  |  |
| 6 | CreatedBy | nvarchar(50) |  |  |
| 7 | ModifiedDate | datetime |  |  |
| 8 | ModifiedBy | nvarchar(50) |  |  |

## JCUncomplete

Rows: 0 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | JCPeriodID | uniqueidentifier |  |  |
| 3 | JCPeriodDetailID | uniqueidentifier | NN | JCPeriodDetail.JCPeriodDetailID |
| 4 | JobID | uniqueidentifier |  | Job.JobID |
| 5 | UncompleteType | int | NN |  |
| 6 | DisplayOnBook | int | NN |  |

## JCUncompleteDetail

Rows: 0 | Columns: 14

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | JCUncomplete.RefID |
| 3 | JobID | uniqueidentifier | NN | Job.JobID |
| 4 | JCPeriodID | uniqueidentifier | NN |  |
| 5 | DirectMatetialAmount | decimal(18,4) | NN |  |
| 6 | IndirectMatetialAmount | decimal(18,4) | NN |  |
| 7 | DirectLaborAmount | decimal(18,4) | NN |  |
| 8 | IndirectLaborAmount | decimal(18,4) | NN |  |
| 9 | DepreciationAmount | decimal(18,4) | NN |  |
| 10 | PurchaseAmount | decimal(18,4) | NN |  |
| 11 | OtherAmount | decimal(18,4) | NN |  |
| 12 | DisplayOnBook | int | NN |  |
| 13 | PhaseID | uniqueidentifier |  |  |
| 14 | SortOrder | int | NN |  |

## JCUncompleteDetailInventoryItem

Rows: 0 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | JCUncompleteDetailInventoryItemID | uniqueidentifier | PK NN |  |
| 2 | RefDetailID | uniqueidentifier | NN | JCUncompleteDetail.RefDetailID |
| 3 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 5 | Quantity | decimal(22,8) | NN |  |
| 6 | PercenComplete | decimal(18,4) | NN |  |
| 7 | CostPrice | decimal(20,6) | NN |  |
| 8 | SortOrder | int | NN |  |

# 11 — Ledger Sổ (read tables)

## AccountObjectLedger

Rows: 110,705 | Columns: 76

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | AccountObjectLedgerID | int | PK NN ID |  |
| 2 | BranchID | uniqueidentifier |  |  |
| 3 | RefID | uniqueidentifier |  |  |
| 4 | RefDetailID | uniqueidentifier |  |  |
| 5 | EntryType | int | NN |  |
| 6 | RefType | int | NN |  |
| 7 | RefNo | nvarchar(20) |  |  |
| 8 | RefDate | datetime | NN |  |
| 9 | PostedDate | datetime | NN |  |
| 10 | InvRefID | uniqueidentifier |  |  |
| 11 | InvNo | nvarchar(500) |  |  |
| 12 | InvDate | datetime |  |  |
| 13 | InvSeries | nvarchar(20) |  |  |
| 14 | AccountNumber | nvarchar(20) |  |  |
| 15 | AccountName | nvarchar(128) |  |  |
| 16 | CorrespondingAccountNumber | nvarchar(20) |  |  |
| 17 | ExchangeRate | decimal(18,4) | NN |  |
| 18 | CurrencyID | nvarchar(3) |  |  |
| 19 | UnitID | uniqueidentifier |  |  |
| 20 | UnitPriceOC | decimal(20,6) | NN |  |
| 21 | UnitPrice | decimal(20,6) | NN |  |
| 22 | Quantity | decimal(22,8) | NN |  |
| 23 | DebitAmountOC | decimal(18,4) | NN |  |
| 24 | DebitAmount | decimal(18,4) | NN |  |
| 25 | CreditAmountOC | decimal(18,4) | NN |  |
| 26 | CreditAmount | decimal(18,4) | NN |  |
| 27 | JournalMemo | nvarchar(500) |  |  |
| 28 | Description | nvarchar(500) |  |  |
| 29 | DueDate | datetime |  |  |
| 30 | OrganizationUnitID | uniqueidentifier |  |  |
| 31 | AccountObjectID | uniqueidentifier |  |  |
| 32 | AccountObjectCode | nvarchar(50) |  |  |
| 33 | AccountObjectName | nvarchar(400) |  |  |
| 34 | AccountObjectNameDI | nvarchar(400) |  |  |
| 35 | AccountObjectTaxCode | nvarchar(50) |  |  |
| 36 | AccountObjectAddress | nvarchar(400) |  |  |
| 37 | AccountObjectAddressDI | nvarchar(400) |  |  |
| 38 | EmployeeID | uniqueidentifier |  |  |
| 39 | EmployeeCode | nvarchar(50) |  |  |
| 40 | EmployeeName | nvarchar(400) |  |  |
| 41 | OrderID | uniqueidentifier |  |  |
| 42 | JobID | uniqueidentifier |  |  |
| 43 | ContractID | uniqueidentifier |  |  |
| 44 | ContractSignDate | datetime |  |  |
| 45 | ContractCode | nvarchar(50) |  |  |
| 46 | ContractName | nvarchar(255) |  |  |
| 47 | ListItemID | uniqueidentifier |  |  |
| 48 | BudgetItemID | uniqueidentifier |  |  |
| 49 | ProjectWorkID | uniqueidentifier |  |  |
| 50 | PaymentTermID | uniqueidentifier |  |  |
| 51 | InventoryItemID | uniqueidentifier |  |  |
| 52 | InventoryItemCode | nvarchar(50) |  |  |
| 53 | InventoryItemName | nvarchar(500) |  |  |
| 54 | PUContractID | uniqueidentifier |  |  |
| 55 | PUSignDate | datetime |  |  |
| 56 | PUContractCode | nvarchar(50) |  |  |
| 57 | PUContractName | nvarchar(255) |  |  |
| 58 | RefTypeName | nvarchar(100) |  |  |
| 59 | IsPostToManagementBook | bit | NN |  |
| 60 | RefOrder | int |  |  |
| 61 | SortOrder | int |  |  |
| 62 | IsUpdateRedundant | bit | NN |  |
| 63 | PUOrderRefID | uniqueidentifier |  |  |
| 64 | MainUnitID | uniqueidentifier |  |  |
| 65 | MainUnitPrice | decimal(20,6) | NN |  |
| 66 | MainQuantity | decimal(22,8) | NN |  |
| 67 | MainConvertRate | decimal(18,4) | NN |  |
| 68 | ExchangeRateOperator | nvarchar(3) | NN |  |
| 69 | DocumentIncluded | nvarchar(255) |  |  |
| 70 | DetailPostOrder | int |  |  |
| 71 | MainUnitPriceOC | decimal(20,6) |  |  |
| 72 | CashOutExchangeRateLedger | decimal(18,4) |  |  |
| 73 | BusinessType | int |  |  |
| 88 | LOANAgreementID | uniqueidentifier |  |  |
| 103 | PayKeyID | nvarchar(150) | COMP |  |
| 104 | DebtKeyID | nvarchar(150) | COMP |  |

## CheckLedgerResult

Rows: 0 | Columns: 12

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SARefID | uniqueidentifier |  |  |
| 2 | INRefID | uniqueidentifier |  |  |
| 3 | SARefNo | nvarchar(20) |  |  |
| 4 | INRefNo | nvarchar(20) |  |  |
| 5 | RefDate | datetime |  |  |
| 6 | PostedDate | datetime |  |  |
| 7 | RefType | int |  |  |
| 8 | IsPostedFinance | bit |  |  |
| 9 | IsPostedManagement | bit |  |  |
| 10 | SARefNoManagement | nvarchar(20) |  |  |
| 11 | INRefNoManagement | nvarchar(20) |  |  |
| 12 | INRefType | int |  |  |

## CustomFieldLedger

Rows: 208,031 | Columns: 27

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | CustomFieldLegerID | uniqueidentifier | NN |  |
| 2 | RefDetailID | uniqueidentifier | NN |  |
| 3 | RefID | uniqueidentifier | NN |  |
| 4 | IsPostToManagementBook | bit | NN |  |
| 5 | BranchID | uniqueidentifier |  |  |
| 6 | PostedDate | datetime |  |  |
| 7 | MasterCustomField1 | nvarchar(255) |  |  |
| 8 | MasterCustomField2 | nvarchar(255) |  |  |
| 9 | MasterCustomField3 | nvarchar(255) |  |  |
| 10 | MasterCustomField4 | nvarchar(255) |  |  |
| 11 | MasterCustomField5 | nvarchar(255) |  |  |
| 12 | MasterCustomField6 | nvarchar(255) |  |  |
| 13 | MasterCustomField7 | nvarchar(255) |  |  |
| 14 | MasterCustomField8 | nvarchar(255) |  |  |
| 15 | MasterCustomField9 | nvarchar(255) |  |  |
| 16 | MasterCustomField10 | nvarchar(255) |  |  |
| 17 | CustomField1 | nvarchar(255) |  |  |
| 18 | CustomField2 | nvarchar(255) |  |  |
| 19 | CustomField3 | nvarchar(255) |  |  |
| 20 | CustomField4 | nvarchar(255) |  |  |
| 21 | CustomField5 | nvarchar(255) |  |  |
| 22 | CustomField6 | nvarchar(255) |  |  |
| 23 | CustomField7 | nvarchar(255) |  |  |
| 24 | CustomField8 | nvarchar(255) |  |  |
| 25 | CustomField9 | nvarchar(255) |  |  |
| 26 | CustomField10 | nvarchar(255) |  |  |
| 27 | IsUpdateRedundant | bit | NN |  |

## FixedAssetLedger

Rows: 332 | Columns: 40

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | FixedAssetLedgerID | int | PK NN ID |  |
| 2 | RefID | uniqueidentifier |  |  |
| 3 | RefDetailID | uniqueidentifier |  |  |
| 4 | RefType | int |  |  |
| 5 | RefNo | nvarchar(20) |  |  |
| 6 | RefDate | datetime | NN |  |
| 7 | PostedDate | datetime | NN |  |
| 8 | FixedAssetID | uniqueidentifier |  |  |
| 9 | OrganizationUnitID | uniqueidentifier |  |  |
| 10 | LifeTimeInMonth | decimal(18,4) | NN |  |
| 11 | LifeTimeRemainingInMonth | decimal(18,4) | NN |  |
| 12 | DepreciationRateMonth | decimal(18,4) | NN |  |
| 13 | MonthlyDepreciationAmount | decimal(18,4) | NN |  |
| 16 | DepreciationAmount | decimal(18,4) | NN |  |
| 17 | AccumDepreciationAmount | decimal(18,4) | NN |  |
| 18 | TotalDepreciationAmount | decimal(18,4) | NN |  |
| 19 | RemainingAmount | decimal(18,4) | NN |  |
| 22 | DepreciationAccount | nvarchar(20) |  |  |
| 25 | JournalMemo | nvarchar(500) |  |  |
| 27 | BranchID | uniqueidentifier |  |  |
| 29 | RefOrder | int |  |  |
| 30 | FixedAssetCode | nvarchar(25) |  |  |
| 31 | FixedAssetName | nvarchar(128) |  |  |
| 38 | FixedAssetCategoryID | uniqueidentifier |  |  |
| 47 | IsPostToManagementBook | bit | NN |  |
| 49 | IsUpdateRedundant | bit | NN |  |
| 50 | OrgPrice | decimal(18,4) | NN |  |
| 51 | OrgPriceAccount | nvarchar(20) |  |  |
| 52 | SumDiffAccumDepreciationAmount | decimal(18,4) | NN |  |
| 53 | SumDiffLifeTime | decimal(18,4) | NN |  |
| 54 | SumDiffDepreciationAmount | decimal(18,4) | NN |  |
| 55 | SumDiffRemainingAmount | decimal(18,4) | NN |  |
| 56 | SumMonthly | int | NN |  |
| 57 | OriginDepreciationAmount | decimal(18,4) | NN |  |
| 58 | DiffDepreciationAmount | decimal(18,4) | NN |  |
| 59 | DiffAccumDepreciationAmount | decimal(18,4) | NN |  |
| 60 | DiffOrgPriceAmount | decimal(18,4) | NN |  |
| 61 | RefOrderInSubSystem | int | NN |  |
| 62 | MonthlyDepreciationAmountByIncomeTax | decimal(18,4) | NN |  |
| 63 | MonthlyDepreciationAmountOnDepreciation | decimal(18,4) | NN |  |

## GeneralLedger

Rows: 466,603 | Columns: 92

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | GeneralLedgerID | int | PK NN ID |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | RefDetailID | uniqueidentifier |  |  |
| 4 | RefType | int | NN |  |
| 5 | RefNo | nvarchar(20) |  |  |
| 6 | RefDate | datetime | NN |  |
| 7 | PostedDate | datetime | NN |  |
| 8 | InvNo | nvarchar(500) |  |  |
| 9 | InvDate | datetime |  |  |
| 10 | InvSeries | nvarchar(20) |  |  |
| 11 | AccountNumber | nvarchar(20) |  |  |
| 12 | CorrespondingAccountNumber | nvarchar(20) |  |  |
| 13 | BankAccountID | uniqueidentifier |  |  |
| 14 | CurrencyID | nvarchar(3) |  |  |
| 15 | ExchangeRate | decimal(18,4) | NN |  |
| 16 | DebitAmountOC | decimal(18,4) | NN |  |
| 17 | DebitAmount | decimal(18,4) | NN |  |
| 18 | CreditAmountOC | decimal(18,4) | NN |  |
| 19 | CreditAmount | decimal(18,4) | NN |  |
| 20 | JournalMemo | nvarchar(500) |  |  |
| 21 | Description | nvarchar(500) |  |  |
| 22 | ContactName | nvarchar(400) |  |  |
| 23 | AccountObjectID | uniqueidentifier |  |  |
| 24 | AccountObjectName | nvarchar(400) |  |  |
| 25 | AccountObjectTaxCode | nvarchar(50) |  |  |
| 26 | AccountObjectAddress | nvarchar(400) |  |  |
| 27 | AccountObjectBankAccount | nvarchar(50) |  |  |
| 28 | AccountObjectBankName | nvarchar(128) |  |  |
| 29 | EmployeeID | uniqueidentifier |  |  |
| 30 | ExpenseItemID | uniqueidentifier |  |  |
| 31 | OrganizationUnitID | uniqueidentifier |  |  |
| 32 | OrderID | uniqueidentifier |  |  |
| 33 | JobID | uniqueidentifier |  |  |
| 34 | ProjectWorkID | uniqueidentifier |  |  |
| 35 | PUContractID | uniqueidentifier |  |  |
| 36 | ContractID | uniqueidentifier |  |  |
| 37 | ListItemID | uniqueidentifier |  |  |
| 38 | PaymentTermID | uniqueidentifier |  |  |
| 39 | BranchID | uniqueidentifier |  |  |
| 40 | UnResonableCost | bit |  |  |
| 41 | IsPostToManagementBook | bit | NN |  |
| 42 | DueDate | datetime |  |  |
| 43 | PaymentDate | datetime |  |  |
| 44 | RefNo1 | nvarchar(20) |  |  |
| 45 | RefNo2 | nvarchar(20) |  |  |
| 46 | RefDate1 | datetime |  |  |
| 47 | SortOrder | int |  |  |
| 48 | RefOrder | int |  |  |
| 49 | AccountName | nvarchar(128) |  |  |
| 50 | BankAccountNumber | nvarchar(50) |  |  |
| 51 | BankName | nvarchar(255) |  |  |
| 52 | AccountObjectCode | nvarchar(50) |  |  |
| 53 | EmployeeCode | nvarchar(50) |  |  |
| 54 | EmployeeName | nvarchar(400) |  |  |
| 55 | PUContractCode | nvarchar(50) |  |  |
| 56 | PUContractName | nvarchar(255) |  |  |
| 57 | ContractCode | nvarchar(255) |  |  |
| 58 | ContractName | nvarchar(255) |  |  |
| 59 | PaymentTermCode | nvarchar(20) |  |  |
| 60 | PaymentTermName | nvarchar(128) |  |  |
| 61 | InventoryItemID | uniqueidentifier |  |  |
| 62 | InventoryItemCode | nvarchar(50) |  |  |
| 63 | InventoryItemName | nvarchar(500) |  |  |
| 64 | IsUpdateRedundant | bit | NN |  |
| 65 | AccountObjectNameDI | nvarchar(400) |  |  |
| 66 | BudgetItemID | uniqueidentifier |  |  |
| 67 | RefTypeName | nvarchar(100) |  |  |
| 68 | UnitID | uniqueidentifier |  |  |
| 69 | Quantity | decimal(22,8) | NN |  |
| 70 | UnitPriceOC | decimal(20,6) | NN |  |
| 71 | UnitPrice | decimal(20,6) | NN |  |
| 72 | EntryType | int | NN |  |
| 73 | InvRefID | uniqueidentifier |  |  |
| 74 | PUSignDate | datetime |  |  |
| 75 | ContractSignDate | datetime |  |  |
| 76 | PUOrderRefID | uniqueidentifier |  |  |
| 77 | MainUnitID | uniqueidentifier |  |  |
| 78 | MainUnitPrice | decimal(20,6) | NN |  |
| 79 | MainQuantity | decimal(22,8) | NN |  |
| 80 | MainConvertRate | decimal(18,4) | NN |  |
| 81 | ExchangeRateOperator | nvarchar(3) | NN |  |
| 82 | StockID | uniqueidentifier |  |  |
| 83 | StockCode | nvarchar(20) |  |  |
| 84 | StockName | nvarchar(128) |  |  |
| 85 | DocumentIncluded | nvarchar(255) |  |  |
| 86 | DetailPostOrder | int | NN |  |
| 87 | MainUnitPriceOC | decimal(20,6) |  |  |
| 88 | IsPostedForCashOutDiff | bit | NN |  |
| 89 | CashOutExchangeRateLedger | decimal(18,4) |  |  |
| 90 | BusinessType | int |  |  |
| 91 | TaxYear | int |  |  |
| 92 | LOANAgreementID | uniqueidentifier |  |  |

## InventoryLedger

Rows: 108,622 | Columns: 87

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | InventoryLedgerID | int | PK NN ID |  |
| 2 | RefID | uniqueidentifier |  |  |
| 3 | RefDetailID | uniqueidentifier |  |  |
| 4 | RefType | int | NN |  |
| 5 | RefNo | nvarchar(20) |  |  |
| 7 | RefDate | datetime | NN |  |
| 8 | PostedDate | datetime | NN |  |
| 9 | AccountNumber | nvarchar(20) |  |  |
| 10 | CorrespondingAccountNumber | nvarchar(20) |  |  |
| 11 | StockID | uniqueidentifier |  |  |
| 12 | InventoryItemID | uniqueidentifier |  |  |
| 13 | UnitID | uniqueidentifier |  |  |
| 14 | UnitPrice | decimal(20,6) | NN |  |
| 17 | InwardQuantity | decimal(22,8) |  |  |
| 18 | OutwardQuantity | decimal(22,8) |  |  |
| 19 | InwardAmount | decimal(18,4) | NN |  |
| 20 | OutwardAmount | decimal(18,4) | NN |  |
| 23 | InwardQuantityBalance | decimal(22,8) | NN |  |
| 24 | InwardAmountBalance | decimal(18,4) | NN |  |
| 26 | JournalMemo | nvarchar(500) |  |  |
| 27 | Description | nvarchar(500) |  |  |
| 28 | ExpiryDate | datetime |  |  |
| 29 | LotNo | nvarchar(50) |  |  |
| 30 | BranchID | uniqueidentifier |  |  |
| 31 | MainUnitID | uniqueidentifier |  |  |
| 32 | MainUnitPrice | decimal(20,6) | NN |  |
| 34 | MainInwardQuantity | decimal(22,8) | NN |  |
| 35 | MainOutwardQuantity | decimal(22,8) | NN |  |
| 36 | MainConvertRate | decimal(18,4) | NN |  |
| 37 | ExchangeRateOperator | nvarchar(3) | NN |  |
| 38 | IsPromotion | bit | NN |  |
| 40 | IsPostToManagementBook | bit | NN |  |
| 41 | SortOrder | int |  |  |
| 42 | RefOrder | int |  |  |
| 43 | ConfrontingRefID | uniqueidentifier |  |  |
| 44 | ConfrontingRefDetailID | uniqueidentifier |  |  |
| 45 | IsUnUpdateOutwardPrice | bit | NN |  |
| 46 | StockCode | nvarchar(20) |  |  |
| 47 | StockName | nvarchar(128) |  |  |
| 48 | InventoryItemCode | nvarchar(50) |  |  |
| 49 | InventoryItemName | nvarchar(500) |  |  |
| 52 | AccountName | nvarchar(128) |  |  |
| 53 | OrderID | uniqueidentifier |  |  |
| 54 | ListItemID | uniqueidentifier |  |  |
| 55 | OrganizationUnitID | uniqueidentifier |  |  |
| 56 | ContractID | uniqueidentifier |  |  |
| 57 | ContractCode | nvarchar(255) |  |  |
| 58 | ContractName | nvarchar(255) |  |  |
| 59 | ProjectWorkID | uniqueidentifier |  |  |
| 60 | JobID | uniqueidentifier |  |  |
| 61 | ExpenseItemID | uniqueidentifier |  |  |
| 62 | EmployeeID | uniqueidentifier |  |  |
| 63 | EmployeeCode | nvarchar(50) |  |  |
| 64 | EmployeeName | nvarchar(400) |  |  |
| 65 | ContactName | nvarchar(400) |  |  |
| 66 | AccountObjectID | uniqueidentifier |  |  |
| 67 | AccountObjectCode | nvarchar(50) |  |  |
| 68 | AccountObjectName | nvarchar(400) |  |  |
| 69 | AccountObjectAddress | nvarchar(400) |  |  |
| 70 | ProductionOrderRefID | uniqueidentifier |  |  |
| 71 | IsUpdateRedundant | bit | NN |  |
| 72 | AccountObjectNameDI | nvarchar(400) |  |  |
| 73 | RefTypeName | nvarchar(100) |  |  |
| 74 | UnUpdateOutwardPriceType | int | NN |  |
| 75 | InOutWardType | int | NN |  |
| 77 | UnitPriceMethod | int |  |  |
| 78 | OutwardRefID | uniqueidentifier |  |  |
| 79 | OutwardRefDetailID | uniqueidentifier |  |  |
| 80 | AssemblyRefID | uniqueidentifier |  |  |
| 81 | ProductionID | uniqueidentifier |  |  |
| 82 | INRefOrder | datetime | NN |  |
| 83 | CurrencyID | nvarchar(3) |  |  |
| 84 | ExchangeRate | decimal(18,4) | NN |  |
| 85 | IsInward | bit | NN |  |
| 86 | InventoryResaleTypeID | int |  |  |
| 87 | RefNoFinance | nvarchar(20) |  |  |
| 88 | RefNoManagement | nvarchar(20) |  |  |
| 89 | PUContractID | uniqueidentifier |  |  |
| 90 | PUContractCode | nvarchar(50) |  |  |
| 91 | PUContractName | nvarchar(255) |  |  |
| 92 | FIFOAccumInwardQuantityMainUnitAfterRow | decimal(22,8) |  |  |
| 93 | FIFOAccumOutwardQuantityMainUnitAfterRow | decimal(22,8) |  |  |
| 94 | FIFOInventoryLedgerIDfirstInwardForAllocate | int |  |  |
| 95 | FIFOAccumInwardAmountMainUnitAfterRow | decimal(18,4) |  |  |
| 96 | FIFOAccumOutwardAmountMainUnitAfterRow | decimal(18,4) |  |  |
| 97 | FIFOAccumLastUpdate | datetime |  |  |
| 98 | LOANAgreementID | uniqueidentifier |  |  |

## LogOldInventoryLedger

Rows: 0 | Columns: 13

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | EventID | uniqueidentifier |  |  |
| 2 | BranchID | uniqueidentifier |  |  |
| 3 | IsPostToManagementBook | bit |  |  |
| 4 | InventoryItemID | uniqueidentifier |  |  |
| 5 | InventoryItemCode | nvarchar(50) |  |  |
| 6 | InventoryItemName | nvarchar(500) |  |  |
| 7 | StockID | uniqueidentifier |  |  |
| 8 | StockCode | nvarchar(50) |  |  |
| 9 | StockName | nvarchar(128) |  |  |
| 10 | BalanceQuantity | decimal(22,8) |  |  |
| 11 | BalanceAmount | decimal(22,8) |  |  |
| 12 | ModifiedDate | datetime |  |  |
| 13 | IsUpdateRedundant | bit |  |  |

## MobileAccountObjectLedgerDataChanged

Rows: 122 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ChangedID | int | PK NN ID |  |
| 2 | AccountObjectID | uniqueidentifier | NN |  |
| 3 | SyncStatus | int | NN |  |

## MobileGeneralLedgerDataChanged

Rows: 5 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ChangedID | int | PK NN ID |  |
| 2 | PostedDate | date | NN |  |
| 3 | SyncStatus | int | NN |  |
| 4 | ReportYear | int |  |  |
| 5 | ReportMonth | int |  |  |
| 6 | FromDate | datetime | COMP |  |
| 7 | ToDate | datetime | COMP |  |

## MobileInventoryLedgerDataChanged

Rows: 666 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ChangedID | int | PK NN ID |  |
| 2 | InventoryItemID | uniqueidentifier | NN |  |
| 3 | SyncStatus | int | NN |  |

## PurchaseLedger

Rows: 9,735 | Columns: 88

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | PurchaseLedgerID | int | PK NN ID |  |
| 2 | RefDetailID | uniqueidentifier | NN |  |
| 3 | RefID | uniqueidentifier | NN |  |
| 4 | BranchID | uniqueidentifier |  |  |
| 5 | PostedDate | datetime | NN |  |
| 6 | RefDate | datetime | NN |  |
| 7 | RefType | int | NN |  |
| 8 | RefNo | nvarchar(20) |  |  |
| 10 | JournalMemo | nvarchar(500) |  |  |
| 11 | InventoryItemID | uniqueidentifier |  |  |
| 12 | Description | nvarchar(500) |  |  |
| 13 | StockID | uniqueidentifier |  |  |
| 14 | DebitAccount | nvarchar(20) |  |  |
| 15 | CreditAccount | nvarchar(20) |  |  |
| 16 | UnitID | uniqueidentifier |  |  |
| 17 | UnitPrice | decimal(20,6) | NN |  |
| 18 | PurchaseQuantity | decimal(22,8) | NN |  |
| 19 | PurchaseAmountOC | decimal(18,4) | NN |  |
| 20 | PurchaseAmount | decimal(18,4) | NN |  |
| 21 | DiscountRate | decimal(18,4) |  |  |
| 22 | DiscountAmountOC | decimal(18,4) | NN |  |
| 23 | DiscountAmount | decimal(18,4) | NN |  |
| 24 | VATRate | decimal(18,4) |  |  |
| 25 | VATAmount | decimal(18,4) | NN |  |
| 26 | VATAmountOC | decimal(18,4) | NN |  |
| 27 | VATAccount | nvarchar(20) |  |  |
| 28 | ReturnQuantity | decimal(22,8) | NN |  |
| 29 | ReturnAmountOC | decimal(18,4) | NN |  |
| 30 | ReturnAmount | decimal(18,4) | NN |  |
| 31 | ReduceAmountOC | decimal(18,4) | NN |  |
| 32 | ReduceAmount | decimal(18,4) | NN |  |
| 34 | InvDate | datetime |  |  |
| 35 | InvSeries | nvarchar(20) |  |  |
| 36 | InvNo | nvarchar(500) |  |  |
| 37 | CurrencyID | nvarchar(5) |  |  |
| 38 | ExchangeRate | decimal(18,4) |  |  |
| 39 | MainUnitID | uniqueidentifier |  |  |
| 40 | MainUnitPrice | decimal(20,6) | NN |  |
| 41 | MainConvertRate | decimal(18,4) | NN |  |
| 42 | MainQuantity | decimal(22,8) | NN |  |
| 43 | ExchangeRateOperator | nvarchar(3) |  |  |
| 45 | IsPostToManagementBook | bit | NN |  |
| 46 | AccountObjectID | uniqueidentifier |  |  |
| 47 | EmployeeID | uniqueidentifier |  |  |
| 48 | AccountObjectName | nvarchar(400) |  |  |
| 49 | AccountObjectAddress | nvarchar(400) |  |  |
| 50 | AccountObjectTaxCode | nvarchar(50) |  |  |
| 51 | PUOrderRefID | uniqueidentifier |  |  |
| 52 | OrderID | uniqueidentifier |  |  |
| 53 | JobID | uniqueidentifier |  |  |
| 54 | ContractID | uniqueidentifier |  |  |
| 55 | ListItemID | uniqueidentifier |  |  |
| 56 | ExpenseItemID | uniqueidentifier |  |  |
| 57 | OrganizationUnitID | uniqueidentifier |  |  |
| 58 | ExpiryDate | datetime |  |  |
| 59 | LotNo | nvarchar(50) |  |  |
| 60 | PaymentDate | datetime |  |  |
| 61 | DueDate | datetime |  |  |
| 62 | SortOrder | int |  |  |
| 63 | RefOrder | int |  |  |
| 64 | PaymentTermID | uniqueidentifier |  |  |
| 65 | PUVoucherRefID | uniqueidentifier |  |  |
| 66 | PUVoucherRefDetailID | uniqueidentifier |  |  |
| 69 | InventoryItemCode | nvarchar(50) |  |  |
| 70 | InventoryItemName | nvarchar(500) |  |  |
| 71 | StockCode | nvarchar(20) |  |  |
| 72 | StockName | nvarchar(128) |  |  |
| 73 | AccountObjectCode | nvarchar(50) |  |  |
| 74 | EmployeeCode | nvarchar(50) |  |  |
| 75 | EmployeeName | nvarchar(400) |  |  |
| 76 | ProjectWorkID | uniqueidentifier |  |  |
| 77 | ContractCode | nvarchar(50) |  |  |
| 78 | ContractName | nvarchar(255) |  |  |
| 79 | PaymentTermCode | nvarchar(20) |  |  |
| 80 | PaymentTermName | nvarchar(128) |  |  |
| 81 | IsUpdateRedundant | bit | NN |  |
| 82 | AccountObjectNameDI | nvarchar(400) |  |  |
| 83 | RefTypeName | nvarchar(100) |  |  |
| 84 | ReturnMainQuantity | decimal(22,8) | NN |  |
| 85 | InvRefID | uniqueidentifier |  |  |
| 86 | UnitPriceOC | decimal(20,6) | NN |  |
| 87 | MainUnitPriceOC | decimal(20,6) | NN |  |
| 88 | IncludeInvoice | int |  |  |
| 89 | ImportChargeAmount | decimal(18,4) |  |  |
| 90 | FreightAmount | decimal(18,4) |  |  |
| 91 | AccountObjectAddressOther | nvarchar(400) |  |  |
| 92 | AccountObjectIdentificationNumberOther | nvarchar(20) |  |  |
| 93 | VATRateOther | decimal(18,4) |  |  |

## SYSQuickEditLedgerConfig

Rows: 122 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ConfigID | uniqueidentifier | PK NN |  |
| 2 | LedgerTableName | nvarchar(255) | NN |  |
| 3 | MasterTableName | nvarchar(255) | NN |  |
| 4 | DetailTableName | nvarchar(255) |  |  |
| 5 | RelationColumnMaster | nvarchar(255) |  |  |
| 6 | RelationColumnDetail | nvarchar(255) |  |  |
| 7 | ColumnDetail | nvarchar(255) |  |  |
| 8 | ColumnDetailInLedger | nvarchar(255) |  |  |
| 9 | ColumnMaster | nvarchar(255) | NN |  |
| 10 | ColumnMasterInLedger | nvarchar(255) | NN |  |

## SaleLedger

Rows: 15,867 | Columns: 91

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SaleLedgerID | int | PK NN ID |  |
| 2 | BranchID | uniqueidentifier |  |  |
| 3 | RefID | uniqueidentifier | NN |  |
| 4 | RefDetailID | uniqueidentifier |  |  |
| 5 | RefType | int | NN |  |
| 6 | RefNo | nvarchar(20) |  |  |
| 8 | RefDate | datetime | NN |  |
| 9 | PostedDate | datetime | NN |  |
| 10 | CurrencyID | nvarchar(3) |  |  |
| 11 | ExchangeRate | decimal(18,4) |  |  |
| 13 | InvDate | datetime |  |  |
| 14 | InvSeries | nvarchar(20) |  |  |
| 15 | InvNo | nvarchar(500) |  |  |
| 16 | JournalMemo | nvarchar(500) |  |  |
| 17 | InventoryItemID | uniqueidentifier | NN |  |
| 18 | Description | nvarchar(500) |  |  |
| 19 | StockID | uniqueidentifier |  |  |
| 20 | DebitAccount | nvarchar(20) |  |  |
| 21 | CreditAccount | nvarchar(20) |  |  |
| 22 | UnitID | uniqueidentifier |  |  |
| 23 | UnitPrice | decimal(20,6) | NN |  |
| 24 | SaleQuantity | decimal(22,8) | NN |  |
| 25 | SaleAmountOC | decimal(18,4) | NN |  |
| 26 | SaleAmount | decimal(18,4) | NN |  |
| 27 | DiscountRate | decimal(18,4) |  |  |
| 28 | DiscountAmountOC | decimal(18,4) | NN |  |
| 29 | DiscountAmount | decimal(18,4) | NN |  |
| 30 | DiscountAccount | nvarchar(20) |  |  |
| 31 | VATRate | decimal(18,4) |  |  |
| 32 | VATAmountOC | decimal(18,4) | NN |  |
| 33 | VATAmount | decimal(18,4) | NN |  |
| 34 | VATAccount | nvarchar(20) |  |  |
| 35 | ExportTaxRate | decimal(18,4) |  |  |
| 36 | ExportTaxAmountOC | decimal(18,4) | NN |  |
| 37 | ExportTaxAmount | decimal(18,4) | NN |  |
| 38 | ExportTaxAccount | nvarchar(20) |  |  |
| 39 | ReturnQuantity | decimal(22,8) | NN |  |
| 40 | ReturnAmountOC | decimal(18,4) | NN |  |
| 41 | ReturnAmount | decimal(18,4) | NN |  |
| 42 | ReduceAmountOC | decimal(18,4) | NN |  |
| 43 | ReduceAmount | decimal(18,4) | NN |  |
| 44 | SAVoucherRefID | uniqueidentifier |  |  |
| 45 | SAVoucherRefDetailID | uniqueidentifier |  |  |
| 46 | ExpiryDate | datetime |  |  |
| 47 | LotNo | nvarchar(50) |  |  |
| 48 | Warranty | nvarchar(255) |  |  |
| 49 | DueDate | datetime |  |  |
| 50 | PaymentDate | datetime |  |  |
| 51 | IsPromotion | bit | NN |  |
| 52 | MainUnitID | uniqueidentifier |  |  |
| 53 | MainUnitPrice | decimal(20,6) | NN |  |
| 54 | MainConvertRate | decimal(18,4) | NN |  |
| 55 | MainQuantity | decimal(22,8) | NN |  |
| 56 | ExchangeRateOperator | nvarchar(3) |  |  |
| 58 | IsPostToManagementBook | bit | NN |  |
| 59 | AccountObjectID | uniqueidentifier |  |  |
| 60 | AccountObjectName | nvarchar(400) |  |  |
| 61 | AccountObjectAddress | nvarchar(400) |  |  |
| 62 | CompanyTaxCode | nvarchar(50) |  |  |
| 63 | EmployeeID | uniqueidentifier |  |  |
| 64 | OrderID | uniqueidentifier |  |  |
| 65 | JobID | uniqueidentifier |  |  |
| 66 | ContractID | uniqueidentifier |  |  |
| 67 | ListItemID | uniqueidentifier |  |  |
| 68 | OrganizationUnitID | uniqueidentifier |  |  |
| 69 | SortOrder | int |  |  |
| 70 | RefOrder | int |  |  |
| 73 | InventoryItemCode | nvarchar(50) |  |  |
| 74 | InventoryItemName | nvarchar(500) |  |  |
| 75 | StockCode | nvarchar(20) |  |  |
| 76 | StockName | nvarchar(128) |  |  |
| 77 | AccountObjectCode | nvarchar(50) |  |  |
| 78 | EmployeeCode | nvarchar(50) |  |  |
| 79 | EmployeeName | nvarchar(400) |  |  |
| 80 | ProjectWorkID | uniqueidentifier |  |  |
| 81 | ContractCode | nvarchar(50) |  |  |
| 82 | ContractName | nvarchar(255) |  |  |
| 83 | PaymentTermID | uniqueidentifier |  |  |
| 84 | PaymentTermCode | nvarchar(20) |  |  |
| 85 | PaymentTermName | nvarchar(128) |  |  |
| 86 | IsUpdateRedundant | bit | NN |  |
| 87 | AccountObjectNameDI | nvarchar(400) |  |  |
| 88 | RefTypeName | nvarchar(100) |  |  |
| 89 | ReturnMainQuantity | decimal(22,8) | NN |  |
| 90 | InvRefID | uniqueidentifier |  |  |
| 91 | ReceiptAmountOC | decimal(18,4) | NN |  |
| 92 | ReceiptAmount | decimal(18,4) | NN |  |
| 93 | UnitPriceOC | decimal(20,6) | NN |  |
| 94 | MainUnitPriceOC | decimal(20,6) | NN |  |
| 95 | InvTemplateNo | nvarchar(25) |  |  |
| 96 | VATRateOther | decimal(18,4) |  |  |

## SupplyLedger

Rows: 1,083 | Columns: 28

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SupplyLedgerID | int | PK NN ID |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | RefDetailID | uniqueidentifier |  |  |
| 4 | RefType | int | NN |  |
| 5 | RefNo | nvarchar(20) | NN |  |
| 6 | RefDate | datetime | NN |  |
| 7 | PostedDate | datetime | NN |  |
| 8 | JournalMemo | nvarchar(500) |  |  |
| 9 | Description | nvarchar(255) |  |  |
| 10 | IncrementAllocationTime | int | NN |  |
| 11 | DecrementAllocationTime | int | NN |  |
| 12 | IncrementQuantity | decimal(22,8) | NN |  |
| 13 | DecrementQuantity | decimal(22,8) | NN |  |
| 14 | IncrementAmount | decimal(18,4) | NN |  |
| 15 | DecrementAmount | decimal(18,4) | NN |  |
| 16 | AllocationAmount | decimal(18,4) | NN |  |
| 17 | TermlyAllocationAmount | decimal(18,4) | NN |  |
| 18 | BranchID | uniqueidentifier |  |  |
| 19 | SortOrder | int |  |  |
| 20 | RefOrder | int |  |  |
| 21 | SupplyID | uniqueidentifier |  |  |
| 22 | SupplyCode | nvarchar(25) |  |  |
| 23 | SupplyName | nvarchar(255) |  |  |
| 24 | SupplyCategoryID | uniqueidentifier |  |  |
| 25 | IsPostToManagementBook | bit | NN |  |
| 26 | IsUpdateRedundant | bit | NN |  |
| 27 | OrganizationUnitID | uniqueidentifier |  |  |
| 28 | RefOrderInSubSystem | int | NN |  |

## TaxLedger

Rows: 25,220 | Columns: 57

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | TaxLedgerID | int | PK NN ID |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | RefDetailID | uniqueidentifier |  |  |
| 4 | VATAccount | nvarchar(20) |  |  |
| 5 | CorespondingAccountNumber | nvarchar(20) |  |  |
| 6 | TaxType | int | NN |  |
| 7 | Description | nvarchar(500) |  |  |
| 8 | VATAmountOC | decimal(18,4) | NN |  |
| 9 | VATAmount | decimal(18,4) | NN |  |
| 10 | VATRate | decimal(18,4) |  |  |
| 11 | TurnOverAmountOC | decimal(18,4) | NN |  |
| 12 | TurnOverAmount | decimal(18,4) | NN |  |
| 13 | InvTemplateNo | nvarchar(25) |  |  |
| 14 | InvDate | datetime |  |  |
| 15 | InvSeries | nvarchar(20) |  |  |
| 16 | InvNo | nvarchar(500) |  |  |
| 17 | AccountObjectID | uniqueidentifier |  |  |
| 18 | AccountObjectName | nvarchar(400) |  |  |
| 19 | AccountObjectNameDI | nvarchar(400) |  |  |
| 20 | AccountObjectAddress | nvarchar(400) |  |  |
| 21 | CompanyTaxCode | nvarchar(50) |  |  |
| 22 | BranchID | uniqueidentifier |  |  |
| 23 | PurchasePurposeID | uniqueidentifier |  |  |
| 24 | SortOrder | int |  |  |
| 25 | RefOrder | int |  |  |
| 26 | RefType | int |  |  |
| 27 | RefDate | datetime |  |  |
| 28 | PostedDate | datetime |  |  |
| 29 | RefNo | nvarchar(20) |  |  |
| 30 | AccountObjectCode | nvarchar(50) |  |  |
| 31 | PurchasePurposeCode | nvarchar(20) |  |  |
| 32 | PurchasePurposeName | nvarchar(255) |  |  |
| 33 | TableListType | int | NN |  |
| 34 | PaymentDate | datetime |  |  |
| 35 | SaleTableListType | int | NN |  |
| 36 | IsUpdateRedundant | bit | NN |  |
| 37 | IsPostToManagementBook | bit | NN |  |
| 38 | InvRefID | uniqueidentifier |  |  |
| 39 | TACareerGroupID | int |  |  |
| 40 | VoucherRefType | int |  |  |
| 41 | VoucherRefID | uniqueidentifier |  |  |
| 42 | VoucherRefDetailID | uniqueidentifier |  |  |
| 43 | VoucherRefNo | nvarchar(25) |  |  |
| 44 | VoucherRefDate | datetime |  |  |
| 45 | VoucherPostedDate | datetime |  |  |
| 46 | NotInVATDeclaration | bit | NN |  |
| 47 | OriginInvoicePostedDate | datetime |  |  |
| 48 | OriginInvoiceRefType | int |  |  |
| 49 | OriginInvoiceRefID | uniqueidentifier |  |  |
| 50 | OriginInvoiceRefNo | nvarchar(25) |  |  |
| 51 | OriginInvoiceRefDate | datetime |  |  |
| 52 | OriginInvoiceJournalMemo | nvarchar(500) |  |  |
| 53 | JournalMemo | nvarchar(500) |  |  |
| 54 | OriginRefType | int |  |  |
| 55 | OriginRefID | uniqueidentifier |  |  |
| 56 | InvestmentProjectID | uniqueidentifier |  |  |
| 57 | VATRateOther | decimal(18,4) |  |  |

# 12 — Danh mục: Đối tượng (KH/NCC/NV)

## AccountObject

Rows: 1,643 | Columns: 67

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | AccountObjectID | uniqueidentifier | PK NN |  |
| 2 | AccountObjectCode | nvarchar(50) | NN |  |
| 3 | AccountObjectName | nvarchar(400) |  |  |
| 4 | Gender | int |  |  |
| 5 | BirthDate | datetime |  |  |
| 6 | BirthPlace | nvarchar(255) |  |  |
| 7 | AgreementSalary | decimal(18,4) |  |  |
| 8 | SalaryCoefficient | decimal(18,4) |  |  |
| 9 | NumberOfDependent | int |  |  |
| 10 | InsuranceSalary | decimal(18,4) |  |  |
| 11 | BankAccount | nvarchar(50) |  |  |
| 12 | BankName | nvarchar(128) |  |  |
| 13 | Address | nvarchar(400) |  |  |
| 14 | AccountObjectGroupList | nvarchar(MAX) |  |  |
| 15 | AccountObjectGroupListCode | nvarchar(MAX) |  |  |
| 16 | CompanyTaxCode | nvarchar(50) |  |  |
| 17 | Tel | nvarchar(50) |  |  |
| 18 | Mobile | nvarchar(50) |  |  |
| 19 | Fax | nvarchar(50) |  |  |
| 20 | EmailAddress | nvarchar(100) |  |  |
| 21 | Website | nvarchar(100) |  |  |
| 22 | PaymentTermID | uniqueidentifier |  | PaymentTerm.PaymentTermID |
| 23 | MaximizeDebtAmount | decimal(18,4) |  |  |
| 24 | DueTime | int |  |  |
| 25 | IdentificationNumber | nvarchar(20) |  |  |
| 26 | IssueDate | datetime |  |  |
| 27 | IssueBy | nvarchar(120) |  |  |
| 28 | Country | nvarchar(100) |  |  |
| 29 | ProvinceOrCity | nvarchar(100) |  |  |
| 30 | District | nvarchar(100) |  |  |
| 31 | WardOrCommune | nvarchar(100) |  |  |
| 32 | Prefix | nvarchar(60) |  |  |
| 33 | ContactName | nvarchar(128) |  |  |
| 34 | ContactTitle | nvarchar(128) |  |  |
| 35 | ContactMobile | nvarchar(50) |  |  |
| 36 | OtherContactMobile | nvarchar(50) |  |  |
| 37 | ContactFixedTel | nvarchar(50) |  |  |
| 38 | ContactEmail | nvarchar(100) |  |  |
| 39 | ContactAddress | nvarchar(255) |  |  |
| 40 | IsVendor | bit |  |  |
| 41 | IsCustomer | bit |  |  |
| 42 | IsEmployee | bit |  |  |
| 43 | AccountObjectType | int |  |  |
| 44 | Inactive | bit |  |  |
| 45 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 46 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 47 | CreatedDate | datetime |  |  |
| 48 | CreatedBy | nvarchar(50) |  |  |
| 49 | ModifiedDate | datetime |  |  |
| 50 | ModifiedBy | nvarchar(50) |  |  |
| 51 | ReceiptableDebtAmount | decimal(18,4) |  |  |
| 52 | ShippingAddress | nvarchar(255) |  |  |
| 53 | AccountObjectGroupListName | nvarchar(MAX) |  |  |
| 54 | EmployeeID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 55 | Description | nvarchar(255) |  |  |
| 56 | BankBranchName | nvarchar(128) |  |  |
| 57 | BankProvinceOrCity | nvarchar(100) |  |  |
| 58 | LegalRepresentative | nvarchar(128) |  |  |
| 59 | EInvoiceContactName | nvarchar(255) |  |  |
| 60 | EInvoiceContactEmail | nvarchar(255) |  |  |
| 61 | EInvoiceContactAddress | nvarchar(255) |  |  |
| 62 | EInvoiceContactMobile | nvarchar(50) |  |  |
| 63 | ExternalAccountObjectType | int |  |  |
| 66 | EmployeeType | int |  |  |
| 67 | BudgetCode | nvarchar(7) |  |  |
| 68 | PassportNumber | nvarchar(20) |  |  |
| 69 | IsAccountObjectInternal | bit |  |  |

## AccountObjectAddressFromOrg

Rows: 0 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | CompanyTaxCode | nvarchar(50) | NN |  |
| 2 | Address | nvarchar(400) |  |  |
| 3 | ProvinceOrCity | nvarchar(100) |  |  |
| 4 | District | nvarchar(100) |  |  |
| 5 | WardOrCommune | nvarchar(100) |  |  |
| 6 | ModifiedDate | datetime |  |  |

## AccountObjectBankAccount

Rows: 99 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | AccountObjectBankAccountID | uniqueidentifier | PK NN |  |
| 2 | AccountObjectID | uniqueidentifier | NN | AccountObject.AccountObjectID |
| 3 | BankAccount | nvarchar(50) |  |  |
| 4 | BankName | nvarchar(128) |  |  |
| 5 | SortOrder | int |  |  |
| 10 | BankBranchName | nvarchar(128) |  |  |
| 11 | ProvinceOrCity | nvarchar(100) |  |  |

## AccountObjectBelongToGroup

Rows: 609 | Columns: 2

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | AccountObjectID | uniqueidentifier | NN | AccountObject.AccountObjectID |
| 2 | AccountObjectGroupID | uniqueidentifier | NN | AccountObjectGroup.AccountObjectGroupID |

## AccountObjectGroup

Rows: 12 | Columns: 16

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | AccountObjectGroupID | uniqueidentifier | PK NN |  |
| 2 | AccountObjectGroupCode | nvarchar(20) | NN |  |
| 3 | AccountObjectGroupName | nvarchar(128) | NN |  |
| 4 | ParentID | uniqueidentifier |  |  |
| 5 | MISACodeID | nvarchar(100) |  |  |
| 6 | Grade | int |  |  |
| 7 | IsParent | bit | NN |  |
| 8 | Description | nvarchar(255) |  |  |
| 9 | Inactive | bit | NN |  |
| 10 | IsSystem | bit | NN |  |
| 11 | SortOrder | int |  |  |
| 12 | CreatedDate | datetime |  |  |
| 13 | CreatedBy | nvarchar(50) |  |  |
| 14 | ModifiedDate | datetime |  |  |
| 15 | ModifiedBy | nvarchar(50) |  |  |
| 17 | SortMISACodeID | nvarchar(100) |  |  |

## AccountObjectShippingAddress

Rows: 0 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ShippingAddressID | uniqueidentifier | PK NN |  |
| 2 | AccountObjectID | uniqueidentifier | NN | AccountObject.AccountObjectID |
| 3 | ShippingAddress | nvarchar(255) |  |  |
| 4 | SortOrder | int | NN |  |

# 13 — Danh mục: Hàng hóa vật tư

## InventoryItem

Rows: 12,586 | Columns: 54

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | InventoryItemID | uniqueidentifier | PK NN |  |
| 2 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 3 | BarCode | nvarchar(20) |  |  |
| 4 | InventoryItemCode | nvarchar(50) | NN |  |
| 5 | InventoryItemName | nvarchar(500) |  |  |
| 6 | InventoryItemType | int |  |  |
| 7 | InventoryItemCategoryList | nvarchar(MAX) |  |  |
| 8 | InventoryItemCategoryCode | nvarchar(MAX) |  |  |
| 9 | Description | nvarchar(500) |  |  |
| 10 | UnitID | uniqueidentifier |  | Unit.UnitID |
| 11 | GuarantyPeriod | nvarchar(100) |  |  |
| 12 | MinimumStock | decimal(22,8) | NN |  |
| 13 | InventoryItemSource | nvarchar(255) |  |  |
| 14 | DefaultStockID | uniqueidentifier |  | Stock.StockID |
| 15 | InventoryAccount | nvarchar(20) |  | Account.AccountNumber |
| 16 | COGSAccount | nvarchar(20) |  | Account.AccountNumber |
| 17 | SaleAccount | nvarchar(20) |  | Account.AccountNumber |
| 18 | PurchaseDiscountRate | decimal(18,4) | NN |  |
| 19 | UnitPrice | decimal(20,6) | NN |  |
| 20 | SalePrice1 | decimal(20,6) | NN |  |
| 21 | SalePrice2 | decimal(20,6) | NN |  |
| 22 | SalePrice3 | decimal(20,6) | NN |  |
| 23 | FixedSalePrice | decimal(20,6) | NN |  |
| 24 | IsUnitPriceAfterTax | bit | NN |  |
| 28 | TaxRate | decimal(18,4) |  |  |
| 29 | ImportTaxRate | decimal(18,4) |  |  |
| 30 | ExportTaxRate | decimal(18,4) |  |  |
| 31 | InventoryCategorySpecialTaxID | uniqueidentifier |  | InventoryItemCategorySpecialTax.InventoryCategorySpecialTaxID |
| 32 | IsSystem | bit | NN |  |
| 33 | Inactive | bit | NN |  |
| 35 | IsSaleDiscount | bit |  |  |
| 36 | DiscountType | int |  |  |
| 37 | IsFollowSerialNumber | bit |  |  |
| 38 | CostMethod | int |  |  |
| 39 | CreatedDate | datetime |  |  |
| 40 | CreatedBy | nvarchar(50) |  |  |
| 41 | ModifiedDate | datetime |  |  |
| 42 | ModifiedBy | nvarchar(50) |  |  |
| 43 | InventoryItemCategoryName | nvarchar(MAX) |  |  |
| 44 | Specificity | nvarchar(MAX) |  |  |
| 45 | PurchaseDescription | nvarchar(500) |  |  |
| 46 | SaleDescription | nvarchar(500) |  |  |
| 47 | TACareerGroupID | int |  |  |
| 48 | Image | varbinary |  |  |
| 50 | FixedUnitPrice | decimal(20,6) | NN |  |
| 51 | FrontEndFormula | nvarchar(MAX) |  |  |
| 52 | BackEndFormula | nvarchar(MAX) |  |  |
| 53 | BaseOnFormula | int |  | InventoryQuantityFormulaTemplate.FormulaID |
| 54 | DiscountAccount | nvarchar(20) |  | Account.AccountNumber |
| 55 | SaleOffAccount | nvarchar(20) |  | Account.AccountNumber |
| 56 | ReturnAccount | nvarchar(20) |  | Account.AccountNumber |
| 57 | VAT43Type | nvarchar(50) | NN |  |
| 58 | IsPromotion | bit | NN |  |
| 59 | SpecificType | int |  |  |

## InventoryItemBelongToCategory

Rows: 7,278 | Columns: 2

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 2 | InventoryCategoryID | uniqueidentifier | NN | InventoryItemCategory.InventoryCategoryID |

## InventoryItemCalculatePriceErrors

Rows: 0 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ErrorID | uniqueidentifier | PK NN |  |
| 2 | InventoryItemID | nvarchar(50) | NN |  |
| 3 | StockID | nvarchar(50) |  |  |
| 4 | ActionRowOnMaterial | int | NN |  |
| 5 | ErrorMessage | nvarchar(MAX) |  |  |
| 6 | Datetime_act | datetime |  |  |
| 7 | CalculatePriceMethod | nvarchar(50) |  |  |
| 8 | IsPostToManagementBook | bit |  |  |

## InventoryItemCategory

Rows: 669 | Columns: 15

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | InventoryCategoryID | uniqueidentifier | PK NN |  |
| 3 | ParentID | uniqueidentifier |  |  |
| 4 | MISACodeID | nvarchar(100) |  |  |
| 5 | IsParent | bit | NN |  |
| 6 | Grade | int |  |  |
| 7 | InventoryCategoryCode | nvarchar(20) | NN |  |
| 8 | InventoryCategoryName | nvarchar(128) | NN |  |
| 9 | Description | nvarchar(255) |  |  |
| 10 | IsSystem | bit | NN |  |
| 11 | Inactive | bit | NN |  |
| 12 | CreatedDate | datetime |  |  |
| 13 | CreatedBy | nvarchar(50) |  |  |
| 14 | ModifiedDate | datetime |  |  |
| 15 | ModifiedBy | nvarchar(50) |  |  |
| 16 | SortMISACodeID | nvarchar(100) |  |  |

## InventoryItemCategorySpecialTax

Rows: 208 | Columns: 19

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | InventoryCategorySpecialTaxID | uniqueidentifier | PK NN |  |
| 2 | InventoryCategorySpecialTaxCode | nvarchar(20) | NN |  |
| 3 | InventoryCategorySpecialTaxName | nvarchar(255) | NN |  |
| 4 | Unit | nvarchar(100) |  |  |
| 5 | TaxRate | decimal(18,4) | NN |  |
| 6 | Description | nvarchar(255) |  |  |
| 7 | ParentID | uniqueidentifier |  |  |
| 8 | MISACodeID | nvarchar(100) |  |  |
| 9 | IsParent | bit | NN |  |
| 10 | Grade | int | NN |  |
| 11 | IsSystem | bit | NN |  |
| 12 | Inactive | bit | NN |  |
| 13 | CreatedDate | datetime |  |  |
| 14 | CreatedBy | nvarchar(50) |  |  |
| 15 | ModifiedDate | datetime |  |  |
| 16 | ModifiedBy | nvarchar(50) |  |  |
| 17 | SortMISACodeID | nvarchar(100) |  |  |
| 18 | SubsectionCode | nvarchar(20) |  |  |
| 19 | SubsectionName | nvarchar(255) |  |  |

## InventoryItemCategorySpecialTaxDetail

Rows: 208 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | InventoryCategorySpecialTaxCode | nvarchar(20) | NN |  |
| 2 | InventoryCategorySpecialTaxName | nvarchar(255) | NN |  |
| 3 | Unit | nvarchar(100) |  |  |
| 4 | TaxRate | decimal(18,4) | NN |  |
| 5 | Fromdate | datetime |  |  |
| 6 | Todate | datetime |  |  |
| 7 | InventoryCategorySpecialTaxID | uniqueidentifier |  |  |

## InventoryItemDetailDiscount

Rows: 0 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | InventoryItemDetailID | uniqueidentifier | PK NN |  |
| 2 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 3 | FromQuantity | decimal(22,8) | NN |  |
| 4 | ToQuantity | decimal(22,8) | NN |  |
| 5 | DiscountRate | decimal(18,4) | NN |  |
| 6 | DiscountAmount | decimal(18,4) | NN |  |
| 7 | SortOrder | int | NN |  |

## InventoryItemDetailNorm

Rows: 0 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | InventoryItemDetailID | uniqueidentifier | PK NN |  |
| 2 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 3 | MaterialID | uniqueidentifier | NN |  |
| 4 | MaterialName | nvarchar(500) |  |  |
| 6 | UnitPrice | decimal(20,6) | NN |  |
| 7 | Amount | decimal(18,4) | NN |  |
| 8 | SortOrder | int | NN |  |
| 9 | Quantity | decimal(22,8) | NN |  |
| 11 | UnitID | uniqueidentifier |  | Unit.UnitID |

## InventoryItemDetailSerialType

Rows: 0 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | InventoryItemDetailID | uniqueidentifier | PK NN |  |
| 2 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 3 | SerialTypeName | nvarchar(128) |  |  |
| 5 | AllowDuplicate | bit | NN |  |
| 6 | Selected | bit | NN |  |
| 7 | DisplayName | nvarchar(128) |  |  |
| 8 | SortOrder | int |  |  |

## InventoryItemHistory

Rows: 0 | Columns: 28

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | InventoryItemHistoryID | uniqueidentifier | PK NN |  |
| 2 | InventoryItemID | uniqueidentifier | NN |  |
| 3 | StockID | uniqueidentifier | NN |  |
| 4 | BranchID | uniqueidentifier | NN |  |
| 5 | IsPostToManagementBook | bit | NN |  |
| 6 | MainQuantity | decimal(22,8) | NN |  |
| 7 | Amount | decimal(18,4) | NN |  |
| 8 | OutwardRefID | uniqueidentifier | NN |  |
| 9 | OutwardRefType | int | NN |  |
| 10 | OutwardRefDetailID | uniqueidentifier | NN |  |
| 11 | OutwardPostedDate | datetime | NN |  |
| 12 | OutwardRefOrder | datetime | NN |  |
| 13 | OutwardMainUnitPrice | decimal(18,4) | NN |  |
| 14 | MainOutwardQuantity | decimal(22,8) | NN |  |
| 15 | OutwardAmount | decimal(18,4) | NN |  |
| 16 | InwardRefID | uniqueidentifier | NN |  |
| 17 | InwardPostedDate | datetime | NN |  |
| 18 | InwardRefType | int | NN |  |
| 19 | InwardRefDetailID | uniqueidentifier | NN |  |
| 20 | InwardRefOrder | datetime | NN |  |
| 21 | InwardMainUnitPrice | decimal(18,4) | NN |  |
| 22 | InwardMainQuantityBalance | decimal(22,8) | NN |  |
| 23 | InwardAmountBalance | decimal(18,4) | NN |  |
| 25 | AdjustOutwardRefDetailID | uniqueidentifier |  |  |
| 26 | INReportType | int |  |  |
| 27 | IsUnUpdateOutwardPrice | bit |  |  |
| 28 | IsPosted | bit |  |  |
| 30 | IsAdjust | bit | NN |  |

## InventoryItemLogOverQuantity

Rows: 0 | Columns: 20

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | OvercomeQuantityID | uniqueidentifier | PK NN |  |
| 2 | CalculateID | uniqueidentifier | NN |  |
| 3 | BranchID | uniqueidentifier | NN |  |
| 4 | IsPostToManagementBook | bit | NN |  |
| 5 | RefID | uniqueidentifier | NN |  |
| 6 | RefDetailID | uniqueidentifier | NN |  |
| 7 | RefType | int |  |  |
| 8 | RefTypeName | nvarchar(100) |  |  |
| 9 | RefDate | datetime | NN |  |
| 10 | PostedDate | datetime | NN |  |
| 11 | RefNo | nvarchar(50) |  |  |
| 12 | InventoryItemID | uniqueidentifier | NN |  |
| 13 | InventoryItemCode | nvarchar(50) |  |  |
| 14 | InventoryItemName | nvarchar(500) |  |  |
| 15 | StockID | uniqueidentifier |  |  |
| 16 | StockCode | nvarchar(50) |  |  |
| 17 | StockName | nvarchar(128) |  |  |
| 18 | AccumQuantity | decimal(22,8) |  |  |
| 19 | CreateDate | datetime |  |  |
| 20 | AccumQuantityBefore | decimal(22,8) |  |  |

## InventoryItemLogUnPost

Rows: 0 | Columns: 20

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | LogID | uniqueidentifier | PK NN |  |
| 2 | ComputerName | nvarchar(150) | NN |  |
| 3 | ComputerIP | nvarchar(150) | NN |  |
| 4 | LoginName | nvarchar(100) | NN |  |
| 5 | PostedDate | datetime | NN |  |
| 6 | DatetimeAction | datetime | NN |  |
| 7 | ActionTypeID | int | NN |  |
| 8 | ApplicationPartAlias | nvarchar(500) |  |  |
| 9 | Reference | nvarchar(MAX) |  |  |
| 10 | RefID | uniqueidentifier |  |  |
| 11 | RefType | int |  |  |
| 12 | RefDate | datetime |  |  |
| 13 | INRefOrder | datetime |  |  |
| 14 | UserID | uniqueidentifier | NN |  |
| 15 | BranchID | uniqueidentifier | NN |  |
| 16 | ReferenceManagement | nvarchar(MAX) |  |  |
| 17 | IsWorkingWithManagementBook | bit | NN |  |
| 18 | RefDetailID | uniqueidentifier |  |  |
| 19 | InventoryItemID | uniqueidentifier |  |  |
| 20 | RefNo | nvarchar(50) |  |  |

## InventoryItemPriceFIFO

Rows: 0 | Columns: 46

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | InventoryItemFIFOpriceID | uniqueidentifier | PK NN |  |
| 2 | InventoryItemID | uniqueidentifier | NN |  |
| 3 | StockID | uniqueidentifier | NN |  |
| 4 | BranchID | uniqueidentifier | NN |  |
| 5 | IsPostToManagementBook | bit | NN |  |
| 6 | MainQuantity | decimal(22,8) | NN |  |
| 7 | Amount | decimal(18,4) | NN |  |
| 8 | OutwardRefID | uniqueidentifier |  |  |
| 9 | OutwardRefType | int |  |  |
| 10 | OutwardRefDetailID | uniqueidentifier |  |  |
| 11 | OutwardPostedDate | datetime |  |  |
| 12 | OutwardRefOrder | datetime |  |  |
| 13 | OutwardMainUnitPrice | decimal(18,4) |  |  |
| 14 | MainOutwardQuantity | decimal(22,8) |  |  |
| 15 | OutwardAmount | decimal(18,4) |  |  |
| 16 | OutwardSortOrder | int |  |  |
| 17 | InwardRefID | uniqueidentifier |  |  |
| 18 | InwardPostedDate | datetime |  |  |
| 19 | InwardRefType | int |  |  |
| 20 | InwardRefDetailID | uniqueidentifier |  |  |
| 21 | InwardRefOrder | datetime |  |  |
| 22 | InwardMainUnitPrice | decimal(18,4) |  |  |
| 23 | InwardMainQuantityBalance | decimal(22,8) |  |  |
| 24 | InwardAmountBalance | decimal(18,4) |  |  |
| 25 | InwardSortOrder | int |  |  |
| 26 | AdjustOutwardRefDetailID | uniqueidentifier |  |  |
| 27 | INReportType | int |  |  |
| 28 | IsUnUpdateOutwardPrice | bit |  |  |
| 29 | IsPosted | bit |  |  |
| 30 | IsAdjust | bit |  |  |
| 31 | OutwardDatetimeDeduct | datetime |  |  |
| 32 | CodeAllocalte | nvarchar(MAX) |  |  |
| 33 | InventoryLedgerIDInward | int |  |  |
| 34 | IsAllocated | bit |  |  |
| 35 | InventoryLedgerIDOutward | int |  |  |
| 36 | DescriptionRow | nvarchar(1000) |  |  |
| 37 | InwardMainUnitPriceOrigin | decimal(18,4) |  |  |
| 38 | InwardMainUnitPriceForUpdateLedger | decimal(18,4) |  |  |
| 39 | CalculateID | uniqueidentifier | NN |  |
| 40 | InventoryLedgerIDDeduct | int |  |  |
| 41 | IsRemainOutwardBeforeStartDate | bit |  |  |
| 42 | AmountNotRound | decimal(28,14) | NN |  |
| 43 | IsAllocateWithAdjust | bit |  |  |
| 44 | AmountOutwardCalculate | decimal(18,4) |  |  |
| 45 | IsRowForGetOutwardPriceSAreturn | bit |  |  |
| 46 | MainQuantityNotRound | decimal(28,14) | NN |  |

## InventoryItemPriceFIFOAdjust

Rows: 0 | Columns: 12

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | InventoryItemFIFOAdjust | uniqueidentifier | PK NN |  |
| 2 | CalculateID | uniqueidentifier | NN |  |
| 3 | InventoryLedgerIDInward | int | NN |  |
| 4 | InventoryLedgerIDAdjust | int | NN |  |
| 5 | INRefOrder | datetime |  |  |
| 6 | BranchID | uniqueidentifier | NN |  |
| 7 | IsPostToManagementBook | bit | NN |  |
| 8 | InventoryItemID | uniqueidentifier | NN |  |
| 9 | StockID | uniqueidentifier | NN |  |
| 10 | DatetimeInsert | datetime |  |  |
| 11 | OutwardRefDetailID | uniqueidentifier |  |  |
| 12 | InwardRefDetailID | uniqueidentifier |  |  |

## InventoryItemPriceFIFOAdjustReport

Rows: 0 | Columns: 12

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | InventoryItemFIFOAdjust | uniqueidentifier | PK NN |  |
| 2 | CalculateID | uniqueidentifier | NN |  |
| 3 | InventoryLedgerIDInward | int | NN |  |
| 4 | InventoryLedgerIDAdjust | int | NN |  |
| 5 | INRefOrder | datetime |  |  |
| 6 | BranchID | uniqueidentifier | NN |  |
| 7 | IsPostToManagementBook | bit | NN |  |
| 8 | InventoryItemID | uniqueidentifier | NN |  |
| 9 | StockID | uniqueidentifier | NN |  |
| 10 | DatetimeInsert | datetime |  |  |
| 11 | OutwardRefDetailID | uniqueidentifier |  |  |
| 12 | InwardRefDetailID | uniqueidentifier |  |  |

## InventoryItemPriceFIFOAssembly

Rows: 0 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | InventoryItemFIFOAssemblyID | uniqueidentifier | PK NN |  |
| 2 | CalculateID | uniqueidentifier | NN |  |
| 3 | InventoryLedgerIDProduct | int | NN |  |
| 4 | MainUnitPrice | decimal(22,8) | NN |  |
| 5 | UnitPrice | decimal(22,8) | NN |  |
| 6 | AmountProduct | decimal(18,4) | NN |  |
| 7 | AssemblyRefID | uniqueidentifier | NN |  |
| 8 | DatetimeInsert | datetime | NN |  |

## InventoryItemPriceFIFOTransfer

Rows: 0 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | InventoryItemFIFOTransferID | uniqueidentifier | PK NN |  |
| 2 | CalculateID | uniqueidentifier | NN |  |
| 3 | InventoryLedgerID | int | NN |  |
| 4 | MainUnitPrice | decimal(20,6) | NN |  |
| 5 | RefDetailID | uniqueidentifier | NN |  |
| 6 | IsInward | bit | NN |  |
| 7 | DatetimeInsert | datetime |  |  |
| 8 | Amount | decimal(18,4) | NN |  |

## InventoryItemPriceOutwardImmeNoStock

Rows: 0 | Columns: 38

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ID_Action | uniqueidentifier | PK NN |  |
| 2 | ActionRowOnMaterial | int | NN |  |
| 3 | InventoryItemID | uniqueidentifier | NN |  |
| 4 | UnitID | uniqueidentifier |  |  |
| 5 | MainUnitID | uniqueidentifier |  |  |
| 6 | ExchangeRateOperator | nvarchar(3) | NN |  |
| 7 | ConvertRate | decimal(18,4) | NN |  |
| 8 | TypeActionInOut | int | NN |  |
| 9 | ActionDetail | int | NN |  |
| 10 | DateTimeAction | datetime | NN |  |
| 11 | Quantity | decimal(22,8) | NN |  |
| 12 | PriceRow | decimal(20,6) | NN |  |
| 13 | AmountRow | decimal(18,4) | NN |  |
| 14 | QuantityMainUnit | decimal(22,8) | NN |  |
| 15 | PriceMainUnit | decimal(20,6) | NN |  |
| 16 | AmountRowMainUnit | decimal(18,4) | NN |  |
| 17 | AmountStockAfterActionMainUnit | decimal(18,4) | NN |  |
| 18 | PriceOutwardStockMainUnit | decimal(20,6) | NN |  |
| 19 | RemainQuantityMainUnit | decimal(22,8) | NN |  |
| 20 | RefID | uniqueidentifier | NN |  |
| 21 | RefDetailID | uniqueidentifier | NN |  |
| 22 | RefDate | datetime |  |  |
| 23 | BranchID | uniqueidentifier |  |  |
| 24 | Description | nvarchar(MAX) |  |  |
| 25 | SortOrder | int |  |  |
| 26 | RefType | int | NN |  |
| 27 | IsPostToManagementBook | bit | NN |  |
| 28 | IsUnUpdateOutwardPrice | bit | NN |  |
| 29 | AssemblyRefID | uniqueidentifier |  |  |
| 30 | IsNeedUpdatePrice | bit |  |  |
| 31 | LastTimeUpdatePrice | datetime |  |  |
| 32 | UnitPriceMethod | int |  |  |
| 33 | OutwardRefID | uniqueidentifier |  |  |
| 34 | OutwardRefDetailID | uniqueidentifier |  |  |
| 35 | PostedDate | datetime |  |  |
| 36 | AccumQuantityMainUnit | decimal(22,8) |  |  |
| 37 | AccumAmountStock | decimal(18,4) |  |  |
| 38 | IsCaculateByStock | bit | NN |  |

## InventoryItemPriceOutwardImmediate

Rows: 0 | Columns: 39

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ID_Action | uniqueidentifier | PK NN |  |
| 2 | ActionRowOnMaterial | int | NN |  |
| 3 | InventoryItemID | uniqueidentifier | NN |  |
| 4 | UnitID | uniqueidentifier |  |  |
| 5 | MainUnitID | uniqueidentifier |  |  |
| 6 | ExchangeRateOperator | nvarchar(3) | NN |  |
| 7 | ConvertRate | decimal(18,4) | NN |  |
| 8 | StockID | uniqueidentifier | NN |  |
| 9 | TypeActionInOut | int | NN |  |
| 10 | ActionDetail | int | NN |  |
| 11 | DateTimeAction | datetime | NN |  |
| 12 | Quantity | decimal(22,8) | NN |  |
| 13 | PriceRow | decimal(20,6) | NN |  |
| 14 | AmountRow | decimal(18,4) | NN |  |
| 15 | QuantityMainUnit | decimal(22,8) | NN |  |
| 16 | PriceMainUnit | decimal(20,6) | NN |  |
| 17 | AmountRowMainUnit | decimal(18,4) | NN |  |
| 18 | AmountStockAfterActionMainUnit | decimal(18,4) | NN |  |
| 19 | PriceOutwardStockMainUnit | decimal(20,6) | NN |  |
| 20 | RemainQuantityMainUnit | decimal(22,8) | NN |  |
| 21 | RefID | uniqueidentifier | NN |  |
| 22 | RefDetailID | uniqueidentifier | NN |  |
| 23 | RefDate | datetime |  |  |
| 24 | BranchID | uniqueidentifier |  |  |
| 25 | Description | nvarchar(MAX) |  |  |
| 26 | SortOrder | int |  |  |
| 27 | RefType | int | NN |  |
| 28 | IsPostToManagementBook | bit | NN |  |
| 29 | IsUnUpdateOutwardPrice | bit | NN |  |
| 30 | AssemblyRefID | uniqueidentifier |  |  |
| 31 | IsNeedUpdatePrice | bit |  |  |
| 32 | LastTimeUpdatePrice | datetime |  |  |
| 33 | UnitPriceMethod | int |  |  |
| 34 | OutwardRefID | uniqueidentifier |  |  |
| 35 | OutwardRefDetailID | uniqueidentifier |  |  |
| 36 | PostedDate | datetime |  |  |
| 37 | AccumQuantityMainUnit | decimal(22,8) |  |  |
| 38 | AccumAmountStock | decimal(18,4) |  |  |
| 39 | IsCaculateByStock | bit | NN |  |

## InventoryItemPurchaseFixedUnitPrice

Rows: 84 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | InventoryItemDetailID | uniqueidentifier | PK NN |  |
| 2 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 3 | CurrencyID | nvarchar(3) |  | CCY.CurrencyID |
| 4 | UnitID | uniqueidentifier |  | Unit.UnitID |
| 5 | UnitPrice | decimal(20,6) |  |  |
| 6 | SortOrder | int |  |  |

## InventoryItemPurchaseUnitPrice

Rows: 1,906 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | InventoryItemDetailID | uniqueidentifier | PK NN |  |
| 2 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 3 | CurrencyID | nvarchar(3) |  | CCY.CurrencyID |
| 4 | UnitID | uniqueidentifier |  | Unit.UnitID |
| 5 | UnitPrice | decimal(20,6) |  |  |
| 6 | SortOrder | int |  |  |

## InventoryItemType

Rows: 4 | Columns: 2

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | InventoryItemTypeValue | int | PK NN |  |
| 2 | InventoryItemTypeName | nvarchar(100) |  |  |

## InventoryItemUnitConvert

Rows: 1 | Columns: 11

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | InventoryItemUnitConvertID | uniqueidentifier | PK NN |  |
| 2 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 3 | SortOrder | int | NN |  |
| 4 | UnitID | uniqueidentifier | NN | Unit.UnitID |
| 5 | ConvertRate | decimal(18,4) | NN |  |
| 6 | ExchangeRateOperator | nvarchar(3) | NN |  |
| 7 | Description | nvarchar(255) |  |  |
| 8 | SalePrice1 | decimal(20,6) | NN |  |
| 9 | SalePrice2 | decimal(20,6) | NN |  |
| 10 | SalePrice3 | decimal(20,6) | NN |  |
| 11 | FixedSalePrice | decimal(20,6) | NN |  |

## SpecificInventoryType

Rows: 3 | Columns: 11

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SpecialtyTypeID | uniqueidentifier | PK NN |  |
| 2 | SpecialtyTypeCode | int | NN |  |
| 3 | SpecialtyTypeName | nvarchar(255) | NN |  |
| 4 | Description | nvarchar(500) |  |  |
| 5 | Inactive | bit | NN |  |
| 6 | IsSystem | bit | NN |  |
| 7 | CreatedBy | nvarchar(50) |  |  |
| 8 | CreatedDate | datetime |  |  |
| 9 | ModifiedBy | nvarchar(50) |  |  |
| 10 | ModifiedDate | datetime |  |  |
| 11 | SortOrder | int | NN ID |  |

# 14 — Danh mục: Hệ thống tài khoản

## Account

Rows: 569 | Columns: 40

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | AccountID | uniqueidentifier | PK NN |  |
| 2 | AccountNumber | nvarchar(20) | NN |  |
| 3 | AccountName | nvarchar(128) | NN |  |
| 4 | AccountNameEnglish | nvarchar(128) |  |  |
| 5 | Description | nvarchar(255) |  |  |
| 6 | ParentID | uniqueidentifier |  |  |
| 7 | MISACodeID | nvarchar(100) |  |  |
| 8 | Grade | int |  |  |
| 9 | IsParent | bit | NN |  |
| 10 | AccountCategoryKind | int | NN |  |
| 11 | IsPostableInForeignCurrency | bit | NN |  |
| 12 | DetailByAccountObject | bit | NN |  |
| 13 | AccountObjectType | int |  |  |
| 14 | DetailByBankAccount | bit | NN |  |
| 15 | DetailByJob | bit | NN |  |
| 16 | DetailByJobKind | int |  |  |
| 17 | DetailByProjectWork | bit | NN |  |
| 18 | DetailByProjectWorkKind | int |  |  |
| 19 | DetailByOrder | bit | NN |  |
| 20 | DetailByOrderKind | int |  |  |
| 21 | DetailByContract | bit | NN |  |
| 22 | DetailByContractKind | int |  |  |
| 23 | DetailByExpenseItem | bit | NN |  |
| 24 | DetailByExpenseItemKind | int |  |  |
| 25 | DetailByDepartment | bit | NN |  |
| 26 | DetailByDepartmentKind | int |  |  |
| 27 | DetailByListItem | bit | NN |  |
| 28 | DetailByListItemKind | int |  |  |
| 29 | Inactive | bit | NN |  |
| 30 | CreatedDate | datetime |  |  |
| 31 | CreatedBy | nvarchar(50) |  |  |
| 32 | ModifiedDate | datetime |  |  |
| 33 | ModifiedBy | nvarchar(50) |  |  |
| 34 | SortMISACodeID | nvarchar(100) |  |  |
| 35 | DetailByPUContract | bit | NN |  |
| 36 | DetailByPUContractKind | int |  |  |
| 37 | AccountNameChinese | nvarchar(128) |  |  |
| 38 | AccountNameKorean | nvarchar(128) |  |  |
| 39 | DetailByLoanAgreement | bit | NN |  |
| 40 | DetailByLoanAgreementKind | int |  |  |

## AccountDefault

Rows: 469 | Columns: 13

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | AccountDefaultID | uniqueidentifier | PK NN |  |
| 2 | RefType | int | NN |  |
| 3 | RefTypeName | nvarchar(255) |  |  |
| 4 | VoucherType | int | NN |  |
| 5 | ColumnName | nvarchar(50) | NN |  |
| 6 | ColumnCaption | nvarchar(100) | NN |  |
| 7 | FilterCondition | nvarchar(MAX) |  |  |
| 8 | DefaultValue | nvarchar(20) |  | Account.AccountNumber |
| 9 | SortOrder | int |  |  |
| 10 | CreatedDate | datetime |  |  |
| 11 | CreatedBy | nvarchar(50) |  |  |
| 12 | ModifiedDate | datetime |  |  |
| 13 | ModifiedBy | nvarchar(50) |  |  |

## AccountTransfer

Rows: 20 | Columns: 13

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | AccountTransferID | uniqueidentifier | PK NN |  |
| 2 | AccountTransferCode | nvarchar(50) | NN |  |
| 3 | TransferOrder | int |  |  |
| 4 | FromAccount | nvarchar(20) |  |  |
| 5 | ToAccount | nvarchar(20) |  | Account.AccountNumber |
| 6 | TransferSide | int |  |  |
| 7 | Description | nvarchar(255) |  |  |
| 8 | Inactive | bit | NN |  |
| 9 | CreatedDate | datetime |  |  |
| 10 | CreatedBy | nvarchar(50) |  |  |
| 11 | ModifiedDate | datetime |  |  |
| 12 | ModifiedBy | nvarchar(50) |  |  |
| 13 | SetupType | int | NN |  |

# 15 — Danh mục: Ngân hàng / Tiền tệ

## Bank

Rows: 40 | Columns: 13

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | BankID | uniqueidentifier | PK NN |  |
| 2 | BankCode | nvarchar(20) | NN |  |
| 3 | BankName | nvarchar(128) |  |  |
| 4 | BankNameEnglish | nvarchar(128) |  |  |
| 5 | Address | nvarchar(255) |  |  |
| 6 | Description | nvarchar(255) |  |  |
| 7 | Icon | varbinary |  |  |
| 8 | Inactive | bit | NN |  |
| 9 | CreatedBy | nvarchar(50) |  |  |
| 10 | CreatedDate | datetime |  |  |
| 11 | ModifiedBy | nvarchar(50) |  |  |
| 12 | ModifiedDate | datetime |  |  |
| 13 | EBankCode | nvarchar(10) |  |  |

## BankAccount

Rows: 21 | Columns: 15

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | BankAccountID | uniqueidentifier | PK NN |  |
| 2 | BankAccountNumber | nvarchar(50) | NN |  |
| 3 | BankID | uniqueidentifier |  | Bank.BankID |
| 4 | BankName | nvarchar(255) |  |  |
| 5 | Address | nvarchar(255) |  |  |
| 6 | Description | nvarchar(255) |  |  |
| 7 | Inactive | bit | NN |  |
| 8 | CreatedDate | datetime |  |  |
| 9 | CreatedBy | nvarchar(50) |  |  |
| 10 | ModifiedDate | datetime |  |  |
| 11 | ModifiedBy | nvarchar(50) |  |  |
| 12 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 13 | AccountHolder | nvarchar(128) |  |  |
| 14 | ProvinceOrCity | nvarchar(100) |  |  |
| 15 | DefaultVoucherType | int |  |  |

## BankListAndSalesSummaryReport

Rows: 1 | Columns: 11

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | BankList | nvarchar(MAX) |  |  |
| 2 | SaleAmount | decimal(18,4) |  |  |
| 3 | QuantityInvoice | decimal(18,4) |  |  |
| 4 | BankCodeHasVoucher | nvarchar(1000) |  |  |
| 5 | SubSystemList | nvarchar(1000) |  |  |
| 6 | QuantityVoucher | int |  |  |
| 7 | UsingEInvoice | int |  |  |
| 8 | VendorNameEinvoice | nvarchar(MAX) |  |  |
| 9 | QuantityEInvoiceIssued | int |  |  |
| 10 | InfoContact | nvarchar(MAX) |  |  |
| 11 | QuantityVoucherInYear | int |  |  |

## BankSupported

Rows: 11 | Columns: 29

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | BankCode | nvarchar(20) | PK NN |  |
| 2 | BankNo | nvarchar(50) |  |  |
| 3 | BankName | nvarchar(128) |  |  |
| 4 | ShortName | nvarchar(128) |  |  |
| 5 | Logo | varbinary |  |  |
| 6 | SmallLogo | varbinary |  |  |
| 7 | LogoURL | nvarchar(MAX) |  |  |
| 8 | SmallLogoURL | nvarchar(MAX) |  |  |
| 9 | AccountTypes | nvarchar(MAX) |  |  |
| 10 | AccountObjectMaxLength | int |  |  |
| 11 | DescriptionMaxLength | int |  |  |
| 12 | Hotline | nvarchar(MAX) |  |  |
| 13 | LinkPromotion | nvarchar(MAX) |  |  |
| 14 | LinkPageListBranch | nvarchar(MAX) |  |  |
| 15 | PhoneNumbers | nvarchar(MAX) |  |  |
| 16 | HasMarketing | bit |  |  |
| 17 | Timeout | int |  |  |
| 18 | Status | bit |  |  |
| 19 | SortOrder | int |  |  |
| 20 | CreatedBy | nvarchar(50) |  |  |
| 21 | CreatedDate | datetime |  |  |
| 22 | ModifiedBy | nvarchar(50) |  |  |
| 23 | ModifiedDate | datetime |  |  |
| 24 | SupportVersion | bigint |  |  |
| 25 | SupportProduct | nvarchar(20) |  |  |
| 26 | SupportTransactionSalary | bit | NN |  |
| 27 | SupportOptionFee | bit | NN |  |
| 28 | SupportApproveTransaction | bit | NN |  |
| 29 | IsSyncAccount | bit | NN |  |

## CCY

Rows: 169 | Columns: 40

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | CurrencyID | nvarchar(3) | PK NN |  |
| 2 | CurrencyName | nvarchar(128) | NN |  |
| 3 | ExchangeRate | decimal(18,4) | NN |  |
| 4 | ExchangeRateOperator | bit | NN |  |
| 5 | Inactive | bit |  |  |
| 6 | CAAccount | nvarchar(20) |  |  |
| 7 | BAAccount | nvarchar(20) |  |  |
| 8 | Prefix | nvarchar(20) |  |  |
| 9 | CCYName | nvarchar(20) |  |  |
| 10 | DecimalSeperate | nvarchar(20) |  |  |
| 11 | AfterDecimal | nvarchar(20) |  |  |
| 12 | Subfix | nvarchar(20) |  |  |
| 13 | ConvertRate | decimal(18,4) |  |  |
| 14 | PrefixENG | nvarchar(20) |  |  |
| 15 | CCYNameENG | nvarchar(20) |  |  |
| 16 | DecimalSeperateENG | nvarchar(20) |  |  |
| 17 | AfterDecimalENG | nvarchar(20) |  |  |
| 18 | SubfixENG | nvarchar(20) |  |  |
| 19 | ConvertRateENG | decimal(18,4) |  |  |
| 20 | PrefixDefault | nvarchar(20) |  |  |
| 21 | CCYNameDefault | nvarchar(20) |  |  |
| 22 | DecimalSeperateDefault | nvarchar(20) |  |  |
| 23 | AfterDecimalDefault | nvarchar(20) |  |  |
| 24 | SubfixDefault | nvarchar(20) |  |  |
| 25 | ConvertRateDefault | decimal(18,4) |  |  |
| 26 | PrefixDefaultENG | nvarchar(20) |  |  |
| 27 | CCYNameDefaultENG | nvarchar(20) |  |  |
| 28 | DecimalSeperateDefaultENG | nvarchar(20) |  |  |
| 29 | AfterDecimalDefaultENG | nvarchar(20) |  |  |
| 30 | SubfixDefaultENG | nvarchar(20) |  |  |
| 31 | ConvertRateDefaultENG | decimal(18,4) |  |  |
| 32 | ExampleAmount | decimal(18,4) |  |  |
| 33 | SortOrder | int |  |  |
| 34 | ValueOfMoney | nvarchar(MAX) |  |  |
| 35 | CreatedDate | datetime |  |  |
| 36 | CreatedBy | nvarchar(50) |  |  |
| 37 | ModifiedDate | datetime |  |  |
| 38 | ModifiedBy | nvarchar(50) |  |  |
| 39 | IsChangeUpdateMethod | bit | NN |  |
| 40 | UpdateMethod | int | NN |  |

## CCYDetailExchangeRate

Rows: 4,834 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | CCYExchangeRateID | uniqueidentifier | PK NN |  |
| 2 | CurrencyID | nvarchar(3) | NN | CCY.CurrencyID |
| 3 | UpdateMethod | int | NN |  |
| 4 | BuyingExchangeRateTransfer | decimal(18,4) |  |  |
| 5 | SellingExchangeRate | decimal(18,4) |  |  |
| 6 | ApplyDate | date |  |  |
| 7 | UpdateDate | datetime |  |  |
| 8 | Description | nvarchar(255) |  |  |
| 9 | AverageExchangeRate | decimal(18,4) |  |  |

## National

Rows: 274 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | NationalID | nvarchar(50) | PK NN |  |
| 2 | NationalName | nvarchar(255) | NN |  |
| 3 | SortOrder | int |  |  |

## PaymentMethodType

Rows: 3 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | PaymentMethodID | uniqueidentifier | PK NN |  |
| 2 | PaymentMethodName | nvarchar(100) | NN |  |
| 3 | Description | nvarchar(255) |  |  |
| 4 | Inactive | bit | NN |  |
| 5 | IsSystem | bit | NN |  |
| 6 | CreatedBy | nvarchar(50) |  |  |
| 7 | CreatedDate | datetime |  |  |
| 8 | ModifiedBy | nvarchar(50) |  |  |
| 9 | ModifiedDate | datetime |  |  |
| 10 | SortOrder | int | NN ID |  |

## PaymentTerm

Rows: 0 | Columns: 11

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | PaymentTermID | uniqueidentifier | PK NN |  |
| 2 | PaymentTermCode | nvarchar(20) | NN |  |
| 3 | PaymentTermName | nvarchar(128) | NN |  |
| 4 | DueTime | int | NN |  |
| 5 | DiscountTime | int | NN |  |
| 6 | DiscountPercent | decimal(18,4) | NN |  |
| 7 | Inactive | bit | NN |  |
| 8 | CreatedDate | datetime |  |  |
| 9 | CreatedBy | nvarchar(50) |  |  |
| 10 | ModifiedDate | datetime |  |  |
| 11 | ModifiedBy | nvarchar(50) |  |  |

# 16 — Danh mục: Kho / ĐVT / Nhân sự

## EmployeeRelationship

Rows: 0 | Columns: 22

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | EmployeeRelationshipID | uniqueidentifier | NN |  |
| 2 | AccountObjectID | uniqueidentifier | NN | AccountObject.AccountObjectID |
| 3 | RelationshipID | uniqueidentifier | NN | Relationship.RelationshipID |
| 4 | FullName | nvarchar(100) | NN |  |
| 5 | IsOnlyWriteYearOfDate | bit | NN |  |
| 6 | Birthdate | date |  |  |
| 7 | CompanyTaxCode | nvarchar(50) |  |  |
| 8 | Nationality | nvarchar(255) |  |  |
| 9 | IdentificationNumber | nvarchar(255) |  |  |
| 10 | DeductionStartDate | date |  |  |
| 11 | DeductionEndDate | date |  |  |
| 12 | DependentNumber | nvarchar(255) |  |  |
| 13 | DependentBook | nvarchar(255) |  |  |
| 14 | Country | nvarchar(255) |  |  |
| 15 | Province | nvarchar(255) |  |  |
| 16 | District | nvarchar(50) |  |  |
| 17 | WardOrCommune | nvarchar(255) |  |  |
| 18 | CreatedBy | nvarchar(100) |  |  |
| 19 | CreatedDate | datetime |  |  |
| 20 | ModifiedBy | nvarchar(100) |  |  |
| 21 | ModifiedDate | datetime |  |  |
| 22 | IdentificationType | int |  |  |

## Location

Rows: 3,606 | Columns: 13

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | LocationID | nvarchar(50) | PK NN |  |
| 2 | Kind | int | NN |  |
| 3 | AreaCode | nvarchar(50) |  |  |
| 4 | LocationName | nvarchar(120) | NN |  |
| 5 | PostalCode | nvarchar(50) | NN |  |
| 6 | LocationCode | nvarchar(20) |  |  |
| 7 | CreatedDate | datetime |  |  |
| 8 | CreatedBy | nvarchar(50) |  |  |
| 9 | ModifiedDate | datetime |  |  |
| 10 | ModifiedBy | nvarchar(50) |  |  |
| 11 | ZIPCode | nvarchar(50) |  |  |
| 12 | SortOrder | int |  |  |
| 13 | UsedCount | int |  |  |

## OrganizationUnit

Rows: 93 | Columns: 46

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | OrganizationUnitID | uniqueidentifier | PK NN |  |
| 2 | BranchID | uniqueidentifier |  |  |
| 3 | OrganizationUnitCode | nvarchar(20) | NN |  |
| 4 | OrganizationUnitName | nvarchar(128) | NN |  |
| 5 | IsSystem | bit | NN |  |
| 6 | MISACodeID | nvarchar(100) |  |  |
| 7 | Grade | int |  |  |
| 8 | ParentID | uniqueidentifier |  |  |
| 9 | IsParent | bit | NN |  |
| 10 | Address | nvarchar(255) |  |  |
| 11 | OrganizationUnitTypeID | int | NN |  |
| 12 | BusinessRegistrationNumber | nvarchar(50) |  |  |
| 13 | BusinessRegistrationNumberIssuedDate | datetime |  |  |
| 14 | BusinessRegistrationNumberIssuedPlace | nvarchar(255) |  |  |
| 15 | IsDependent | bit |  |  |
| 16 | IsPrivateVATDeclaration | bit | NN |  |
| 17 | CostAccount | nvarchar(20) |  |  |
| 18 | Inactive | bit | NN |  |
| 19 | CompanyTaxCode | nvarchar(50) |  |  |
| 20 | CompanyTel | nvarchar(50) |  |  |
| 21 | CompanyFax | nvarchar(50) |  |  |
| 22 | CompanyEmail | nvarchar(100) |  |  |
| 23 | CompanyWebsite | nvarchar(100) |  |  |
| 24 | CompanyBankAccountID | uniqueidentifier |  | BankAccount.BankAccountID |
| 25 | CompanyOwnerName | nvarchar(128) |  |  |
| 26 | CompanyOwnerTaxCode | nvarchar(50) |  |  |
| 27 | DirectorTitle | nvarchar(50) |  |  |
| 28 | DirectorName | nvarchar(50) |  |  |
| 29 | ChiefOfAccountingTitle | nvarchar(50) |  |  |
| 30 | ChiefOfAccountingName | nvarchar(50) |  |  |
| 31 | StoreKeeperTitle | nvarchar(50) |  |  |
| 32 | StoreKeeperName | nvarchar(50) |  |  |
| 33 | CashierTitle | nvarchar(50) |  |  |
| 34 | CashierName | nvarchar(50) |  |  |
| 35 | ReporterTitle | nvarchar(50) |  |  |
| 36 | ReporterName | nvarchar(50) |  |  |
| 37 | IsPrintSigner | bit | NN |  |
| 38 | IsGetReporterNameByUserLogIn | bit | NN |  |
| 39 | CreatedBy | nvarchar(50) |  |  |
| 40 | CreatedDate | datetime |  |  |
| 41 | ModifiedBy | nvarchar(50) |  |  |
| 42 | ModifiedDate | datetime |  |  |
| 43 | SortMISACodeID | nvarchar(100) |  |  |
| 44 | CompanyDistrict | nvarchar(100) |  |  |
| 45 | CompanyCity | nvarchar(100) |  |  |
| 46 | ShopInfo | bit | NN |  |

## OrganizationUnitInfo

Rows: 98 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | OrganizationUnitInfoID | uniqueidentifier | PK NN |  |
| 2 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 3 | ItemCode | nvarchar(20) |  |  |
| 4 | ItemName | nvarchar(1000) |  |  |
| 5 | Description | nvarchar(MAX) |  |  |
| 6 | IsBold | bit |  |  |
| 7 | IsItalic | bit |  |  |
| 8 | SortOrder | int |  |  |

## OrganizationUnitType

Rows: 6 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | OrganizationUnitTypeID | int | PK NN |  |
| 2 | OrganizationUnitTypeName | nvarchar(50) | NN |  |
| 3 | Description | nvarchar(128) |  |  |

## Stock

Rows: 10 | Columns: 11

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | StockID | uniqueidentifier | PK NN |  |
| 2 | StockCode | nvarchar(20) | NN |  |
| 3 | StockName | nvarchar(128) | NN |  |
| 4 | Description | nvarchar(255) |  |  |
| 5 | Inactive | bit | NN |  |
| 6 | CreatedDate | datetime |  |  |
| 7 | CreatedBy | nvarchar(50) |  |  |
| 8 | ModifiedDate | datetime |  |  |
| 9 | ModifiedBy | nvarchar(50) |  |  |
| 11 | InventoryAccount | nvarchar(20) |  | Account.AccountNumber |
| 12 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |

## Unit

Rows: 53 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | UnitID | uniqueidentifier | PK NN |  |
| 2 | UnitName | nvarchar(20) | NN |  |
| 3 | Description | nvarchar(255) |  |  |
| 4 | Inactive | bit | NN |  |

# 17 — Danh mục: Công trình / Khoản mục / Khác

## BudgetItem

Rows: 74 | Columns: 17

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | BudgetItemID | uniqueidentifier | PK NN |  |
| 2 | IsParent | bit | NN |  |
| 3 | ParentID | uniqueidentifier |  |  |
| 4 | MISACodeID | nvarchar(100) |  |  |
| 5 | Grade | int |  |  |
| 6 | BudgetItemCode | nvarchar(20) | NN |  |
| 7 | BudgetItemName | nvarchar(128) | NN |  |
| 8 | BudgetItemType | int |  |  |
| 9 | Description | nvarchar(255) |  |  |
| 10 | Inactive | bit | NN |  |
| 11 | CreatedDate | datetime |  |  |
| 12 | CreatedBy | nvarchar(50) |  |  |
| 13 | ModifiedDate | datetime |  |  |
| 14 | ModifiedBy | nvarchar(50) |  |  |
| 15 | SortMISACodeID | nvarchar(100) |  |  |
| 16 | IsSystem | bit | NN |  |
| 17 | IsRecurrent | bit | NN |  |

## Contract

Rows: 0 | Columns: 77

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ContractID | uniqueidentifier | PK NN |  |
| 2 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 3 | IsProject | bit | NN |  |
| 4 | ProjectID | uniqueidentifier |  |  |
| 5 | ContractCode | nvarchar(50) | NN |  |
| 6 | SignDate | datetime |  |  |
| 7 | ContractSubject | nvarchar(255) |  |  |
| 8 | CurrencyID | nvarchar(3) |  |  |
| 9 | ExchangeRate | decimal(18,4) |  |  |
| 10 | ContractAmountOC | decimal(18,4) | NN |  |
| 11 | ContractAmount | decimal(18,4) | NN |  |
| 12 | CloseAmountOC | decimal(18,4) | NN |  |
| 13 | CloseAmount | decimal(18,4) | NN |  |
| 14 | PaymentDate | datetime |  |  |
| 15 | DeliveryDate | datetime |  |  |
| 16 | IsArisedBeforeUseSoftware | bit | NN |  |
| 17 | ExpenseAmountFinance | decimal(18,4) | NN |  |
| 18 | ReceiptAmountOCFinance | decimal(18,4) | NN |  |
| 19 | ReceiptAmountFinance | decimal(18,4) | NN |  |
| 20 | InvoiceAmountOCFinance | decimal(18,4) | NN |  |
| 21 | InvoiceAmountFinance | decimal(18,4) | NN |  |
| 22 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 23 | AccountObjectAddress | nvarchar(400) |  |  |
| 24 | AccountObjectContactName | nvarchar(128) |  |  |
| 25 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 26 | EmployeeID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 27 | ContractStatusID | int |  |  |
| 28 | CloseDate | datetime |  |  |
| 29 | CloseReason | nvarchar(255) |  |  |
| 30 | RevenueStatus | int |  |  |
| 31 | OtherTerms | nvarchar(255) |  |  |
| 32 | IsCalculatedCost | bit | NN |  |
| 33 | IsInvoiced | bit | NN |  |
| 34 | RevenueDate | datetime |  |  |
| 35 | TotalExpenseExpectAmount | decimal(18,4) | NN |  |
| 36 | TotalExpensedAmount | decimal(18,4) | NN |  |
| 37 | BalanceExpenseAmountFinance | decimal(18,4) | NN |  |
| 38 | TotalReceiptedAmount | decimal(18,4) | NN |  |
| 39 | BalanceReceiptAmountFinance | decimal(18,4) | NN |  |
| 40 | ProfitAndLossExpectAmountFinance | decimal(18,4) | NN |  |
| 41 | CreatedBy | nvarchar(50) |  |  |
| 42 | CreatedDate | datetime |  |  |
| 43 | ModifiedBy | nvarchar(50) |  |  |
| 44 | ModifiedDate | datetime |  |  |
| 45 | RefType | int | NN |  |
| 46 | SAOrderID | uniqueidentifier |  | SAOrder.RefID |
| 47 | IsParent | bit |  |  |
| 49 | TotalInvoiceAmountFinance | decimal(18,4) | NN |  |
| 50 | TotalInvoiceAmountManagement | decimal(18,4) | NN |  |
| 51 | AccumSaleAmountFinance | decimal(18,4) |  |  |
| 52 | AccumCostAmountFinance | decimal(18,4) |  |  |
| 53 | AccumOtherAmountFinance | decimal(18,4) |  |  |
| 54 | ExpenseAmountManagement | decimal(18,4) | NN |  |
| 55 | ReceiptAmountOCManagement | decimal(18,4) | NN |  |
| 56 | ReceiptAmountManagement | decimal(18,4) | NN |  |
| 57 | InvoiceAmountOCManagement | decimal(18,4) | NN |  |
| 58 | InvoiceAmountManagement | decimal(18,4) | NN |  |
| 59 | AccumSaleAmountManagement | decimal(18,4) | NN |  |
| 60 | AccumCostAmountManagement | decimal(18,4) | NN |  |
| 61 | AccumOtherAmountManagement | decimal(18,4) | NN |  |
| 62 | TotalInvoiceAmountOCFinance | decimal(18,4) | NN |  |
| 63 | TotalInvoiceAmountOCManagement | decimal(18,4) | NN |  |
| 64 | BalanceReceiptAmountManagement | decimal(18,4) | NN |  |
| 65 | BalanceExpenseAmountManagement | decimal(18,4) | NN |  |
| 66 | ProfitAndLossExpectAmountManagement | decimal(18,4) | NN |  |
| 67 | CustomField1 | nvarchar(255) |  |  |
| 68 | CustomField2 | nvarchar(255) |  |  |
| 69 | CustomField3 | nvarchar(255) |  |  |
| 70 | CustomField4 | nvarchar(255) |  |  |
| 71 | CustomField5 | nvarchar(255) |  |  |
| 72 | CustomField6 | nvarchar(255) |  |  |
| 73 | CustomField7 | nvarchar(255) |  |  |
| 74 | CustomField8 | nvarchar(255) |  |  |
| 75 | CustomField9 | nvarchar(255) |  |  |
| 76 | CustomField10 | nvarchar(255) |  |  |
| 77 | AccountObjectName | nvarchar(400) |  |  |
| 78 | CompleteDeliveryDate | datetime |  |  |

## ContractAttachment

Rows: 0 | Columns: 12

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | AttachmentID | uniqueidentifier | PK NN |  |
| 2 | ContractID | uniqueidentifier | NN | Contract.ContractID |
| 3 | FileName | nvarchar(255) |  |  |
| 4 | FileSize | int |  |  |
| 5 | FileExtension | nvarchar(25) |  |  |
| 6 | FileMIMEType | nvarchar(100) |  |  |
| 7 | Description | nvarchar(255) |  |  |
| 8 | FileLink | nvarchar(MAX) |  |  |
| 9 | CreatedDate | datetime |  |  |
| 10 | CreatedBy | nvarchar(50) |  |  |
| 11 | ModifiedDate | datetime |  |  |
| 12 | ModifiedBy | nvarchar(50) |  |  |

## ContractAttachmentFile

Rows: 0 | Columns: 2

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | AttachmentID | uniqueidentifier | PK NN | ContractAttachment.AttachmentID |
| 2 | AttachmentContent | varbinary |  |  |

## ContractDetailContact

Rows: 0 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ContractDetailID | uniqueidentifier | PK NN |  |
| 2 | ContractID | uniqueidentifier | NN | Contract.ContractID |
| 3 | ContactName | nvarchar(400) |  |  |
| 4 | ContactTitle | nvarchar(128) |  |  |
| 5 | ContactRole | nvarchar(128) |  |  |
| 6 | ContactMobile | nvarchar(50) |  |  |
| 7 | OtherContactMobile | nvarchar(50) |  |  |
| 8 | ContactOfficeTel | nvarchar(50) |  |  |
| 9 | ContactEmail | nvarchar(100) |  |  |
| 10 | SortOrder | int |  |  |

## ContractDetailExpense

Rows: 0 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ContractDetailID | uniqueidentifier | PK NN |  |
| 2 | ContractID | uniqueidentifier | NN | Contract.ContractID |
| 3 | Description | nvarchar(255) |  |  |
| 4 | Rate | decimal(18,4) |  |  |
| 5 | Amount | decimal(18,4) |  |  |
| 6 | ExpenseDate | datetime |  |  |
| 7 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 8 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 9 | SortOrder | int |  |  |

## ContractDetailInventoryItem

Rows: 0 | Columns: 41

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ContractDetailID | uniqueidentifier | PK NN |  |
| 2 | ContractID | uniqueidentifier | NN | Contract.ContractID |
| 3 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 4 | Description | nvarchar(500) |  |  |
| 5 | UnitID | uniqueidentifier |  | Unit.UnitID |
| 6 | Quantity | decimal(22,8) | NN |  |
| 7 | QuantityDeliveredSA | decimal(22,8) | NN |  |
| 8 | UnitPrice | decimal(20,6) | NN |  |
| 9 | UnitPriceAfterTax | decimal(20,6) | NN |  |
| 10 | AmountOC | decimal(18,4) | NN |  |
| 11 | Amount | decimal(18,4) | NN |  |
| 12 | VATRate | decimal(18,4) |  |  |
| 13 | VATAmountOC | decimal(18,4) | NN |  |
| 14 | VATAmount | decimal(18,4) | NN |  |
| 15 | DiscountRate | decimal(18,4) | NN |  |
| 16 | DiscountAmountOC | decimal(18,4) | NN |  |
| 17 | DiscountAmount | decimal(18,4) | NN |  |
| 18 | TotalAmountOC | decimal(18,4) | NN |  |
| 19 | TotalAmount | decimal(18,4) | NN |  |
| 20 | MainUnitID | uniqueidentifier |  | Unit.UnitID |
| 21 | MainUnitPrice | decimal(20,6) | NN |  |
| 22 | MainConvertRate | decimal(18,4) | NN |  |
| 23 | MainQuantity | decimal(22,8) | NN |  |
| 24 | ExchangeRateOperator | nvarchar(3) | NN |  |
| 25 | SortOrder | int | NN |  |
| 26 | QuantityDeliveredIN | decimal(22,8) | NN |  |
| 27 | QuantityDeliveredSALastYear | decimal(22,8) | NN |  |
| 28 | QuantityDeliveredINLastYear | decimal(22,8) | NN |  |
| 29 | CustomField1 | nvarchar(255) |  |  |
| 30 | CustomField2 | nvarchar(255) |  |  |
| 31 | CustomField3 | nvarchar(255) |  |  |
| 32 | CustomField4 | nvarchar(255) |  |  |
| 33 | CustomField5 | nvarchar(255) |  |  |
| 34 | CustomField6 | nvarchar(255) |  |  |
| 35 | CustomField7 | nvarchar(255) |  |  |
| 36 | CustomField8 | nvarchar(255) |  |  |
| 37 | CustomField9 | nvarchar(255) |  |  |
| 38 | CustomField10 | nvarchar(255) |  |  |
| 39 | SAOrderID | uniqueidentifier |  |  |
| 40 | SAOrderRefDetailID | uniqueidentifier |  |  |
| 41 | VATRateOther | decimal(18,4) |  |  |

## ContractDetailPayment

Rows: 0 | Columns: 15

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ContractDetailID | uniqueidentifier | PK NN |  |
| 2 | ContractID | uniqueidentifier | NN | Contract.ContractID |
| 3 | PaymentInstallment | nvarchar(255) |  |  |
| 4 | PaymentRate | decimal(18,4) |  |  |
| 5 | PaymentAmount | decimal(18,4) |  |  |
| 6 | PaymentAmountOC | decimal(18,4) |  |  |
| 7 | PaymentTerm | datetime |  |  |
| 8 | PaymentDate | datetime |  |  |
| 9 | ReceiveAmount | decimal(18,4) |  |  |
| 10 | ReceiveAmountOC | decimal(18,4) |  |  |
| 11 | ReceiveLastYearAmount | decimal(18,4) |  |  |
| 12 | ReceiveLastYearAmountOC | decimal(18,4) |  |  |
| 13 | StillOweAmount | decimal(18,4) |  |  |
| 14 | StillOweAmountOC | decimal(18,4) |  |  |
| 15 | SortOrder | int |  |  |

## ContractDetailPaymentReference

Rows: 0 | Columns: 5

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReferenceID | uniqueidentifier | PK NN |  |
| 2 | ContractDetailID | uniqueidentifier | NN | ContractDetailPayment.ContractDetailID |
| 3 | RefDetailID | uniqueidentifier | NN |  |
| 4 | RefID | uniqueidentifier | NN |  |
| 5 | RefType | int | NN |  |

## ContractDetailRevenue

Rows: 0 | Columns: 12

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ContractDetailID | uniqueidentifier | PK NN |  |
| 2 | ContractID | uniqueidentifier | NN | Contract.ContractID |
| 3 | CancelRevenueDate | datetime |  |  |
| 4 | RevenueType | int | NN |  |
| 5 | EmployeeID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 6 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 7 | InventoryItemID | uniqueidentifier |  | InventoryItem.InventoryItemID |
| 8 | Rate | decimal(18,4) | NN |  |
| 9 | RevenueAmount | decimal(18,4) | NN |  |
| 10 | CancelRevenueAmount | decimal(18,4) | NN |  |
| 11 | Description | nvarchar(255) |  |  |
| 12 | SortOrder | int | NN |  |

## ContractStatus

Rows: 4 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ContractStatusID | int | PK NN |  |
| 2 | ContractStatusName | nvarchar(255) | NN |  |
| 3 | Description | nvarchar(255) |  |  |
| 4 | Inactive | bit | NN |  |
| 5 | IsSystem | bit | NN |  |
| 6 | SortOrder | int | NN |  |

## ExpenseItem

Rows: 199 | Columns: 15

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ExpenseItemID | uniqueidentifier | PK NN |  |
| 2 | ExpenseItemCode | nvarchar(20) | NN |  |
| 3 | ExpenseItemName | nvarchar(128) | NN |  |
| 4 | Description | nvarchar(255) |  |  |
| 5 | ParentID | uniqueidentifier |  |  |
| 6 | MISACodeID | nvarchar(100) |  |  |
| 7 | Grade | int |  |  |
| 8 | IsParent | bit | NN |  |
| 9 | Inactive | bit | NN |  |
| 10 | IsSystem | bit | NN |  |
| 11 | CreatedDate | datetime |  |  |
| 12 | CreatedBy | nvarchar(50) |  |  |
| 13 | ModifiedDate | datetime |  |  |
| 14 | ModifiedBy | nvarchar(50) |  |  |
| 15 | SortMISACodeID | nvarchar(100) |  |  |

## InvestmentProject

Rows: 0 | Columns: 24

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | InvestmentProjectID | uniqueidentifier | PK NN |  |
| 2 | InvestmentProjectCode | nvarchar(12) | NN |  |
| 3 | InvestmentProjectName | nvarchar(200) | NN |  |
| 4 | MakingAddress | nvarchar(200) | NN |  |
| 5 | OwnerTaxCode | nvarchar(50) | NN |  |
| 6 | OwnerName | nvarchar(200) |  |  |
| 7 | StartDate | datetime |  |  |
| 8 | EndDate | datetime |  |  |
| 9 | InvestmentAmount | decimal(18,4) |  |  |
| 10 | CurrencyID | nvarchar(3) |  | CCY.CurrencyID |
| 11 | DocurmentCode | nvarchar(200) | NN |  |
| 12 | DateIssued | datetime | NN |  |
| 13 | AgencyIssued | nvarchar(200) | NN |  |
| 14 | Note | nvarchar(500) |  |  |
| 15 | Inactive | bit |  |  |
| 16 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 17 | CreatedDate | datetime |  |  |
| 18 | CreatedBy | nvarchar(50) |  |  |
| 19 | ModifiedDate | datetime |  |  |
| 20 | ModifiedBy | nvarchar(50) |  |  |
| 21 | Country | nvarchar(100) |  |  |
| 22 | ProvinceOrCity | nvarchar(100) |  |  |
| 23 | District | nvarchar(100) |  |  |
| 24 | WardOrCommune | nvarchar(100) |  |  |

## Job

Rows: 2,593 | Columns: 23

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | JobID | uniqueidentifier | PK NN |  |
| 2 | JobCode | nvarchar(25) | NN |  |
| 3 | JobName | nvarchar(128) | NN |  |
| 4 | ParentID | uniqueidentifier |  |  |
| 5 | MISACodeID | nvarchar(100) |  |  |
| 6 | Grade | int |  |  |
| 7 | IsParent | bit | NN |  |
| 8 | JobType | int |  |  |
| 9 | Description | nvarchar(255) |  |  |
| 10 | Inactive | bit | NN |  |
| 11 | CreatedDate | datetime |  |  |
| 12 | CreatedBy | nvarchar(50) |  |  |
| 13 | ModifiedDate | datetime |  |  |
| 14 | ModifiedBy | nvarchar(50) |  |  |
| 15 | IsSystem | bit | NN |  |
| 16 | InventoryItemID | uniqueidentifier |  | InventoryItem.InventoryItemID |
| 17 | ProductionProcessType | int | NN |  |
| 18 | Stage | int | NN |  |
| 19 | StageID | uniqueidentifier |  |  |
| 20 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 21 | CollectCostInStageType | int |  |  |
| 22 | IsSemiProduct | bit |  |  |
| 23 | SortMISACodeID | nvarchar(100) |  |  |

## JobProduct

Rows: 0 | Columns: 5

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | JobProductID | uniqueidentifier | PK NN |  |
| 2 | JobID | uniqueidentifier | NN | Job.JobID |
| 3 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 4 | Note | nvarchar(255) |  |  |
| 5 | SortOrder | int | NN |  |

## ListItem

Rows: 0 | Columns: 14

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ListItemID | uniqueidentifier | PK NN |  |
| 2 | ListItemCode | nvarchar(20) | NN |  |
| 3 | ListItemName | nvarchar(128) | NN |  |
| 4 | ParentID | uniqueidentifier |  |  |
| 5 | MISACodeID | nvarchar(100) |  |  |
| 6 | Grade | int |  |  |
| 7 | IsParent | bit | NN |  |
| 8 | Description | nvarchar(255) |  |  |
| 9 | Inactive | bit | NN |  |
| 10 | CreatedDate | datetime |  |  |
| 11 | CreatedBy | nvarchar(50) |  |  |
| 12 | ModifiedDate | datetime |  |  |
| 13 | ModifiedBy | nvarchar(50) |  |  |
| 14 | SortMISACodeID | nvarchar(100) |  |  |

## ProjectWork

Rows: 0 | Columns: 25

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ProjectWorkID | uniqueidentifier | PK NN |  |
| 2 | ProjectWorkType | int | NN |  |
| 3 | ProjectWorkCategoryID | uniqueidentifier |  | ProjectWorkCategory.ProjectWorkCategoryID |
| 4 | ProjectWorkCode | nvarchar(20) | NN |  |
| 5 | ProjectWorkName | nvarchar(128) | NN |  |
| 6 | StartDate | datetime |  |  |
| 7 | FinishDate | datetime |  |  |
| 8 | EstimateAmount | decimal(18,4) |  |  |
| 9 | Stakeholder | nvarchar(128) |  |  |
| 10 | StakeholderAddress | nvarchar(255) |  |  |
| 11 | Description | nvarchar(255) |  |  |
| 12 | ParentID | uniqueidentifier |  |  |
| 13 | MISACodeID | nvarchar(100) |  |  |
| 14 | Grade | int |  |  |
| 15 | IsParent | bit | NN |  |
| 16 | Inactive | bit | NN |  |
| 17 | CreatedDate | datetime |  |  |
| 18 | CreatedBy | nvarchar(50) |  |  |
| 19 | ModifiedDate | datetime |  |  |
| 20 | ModifiedBy | nvarchar(50) |  |  |
| 21 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 22 | SortMISACodeID | nvarchar(100) |  |  |
| 23 | ProjectWorkStatus | int | NN |  |
| 24 | DueDate | datetime |  |  |
| 25 | Note | nvarchar(255) |  |  |

## ProjectWorkCategory

Rows: 0 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ProjectWorkCategoryID | uniqueidentifier | PK NN |  |
| 2 | ProjectWorkCategoryCode | nvarchar(20) |  |  |
| 3 | ProjectWorkCategoryName | nvarchar(128) |  |  |
| 4 | Inactive | bit | NN |  |
| 5 | CreatedDate | datetime |  |  |
| 6 | CreatedBy | nvarchar(50) |  |  |
| 7 | ModifiedDate | datetime |  |  |
| 8 | ModifiedBy | nvarchar(50) |  |  |
| 9 | Description | nvarchar(255) |  |  |

## ProjectWorkEstimate

Rows: 0 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | BranchID | uniqueidentifier | NN | OrganizationUnit.OrganizationUnitID |
| 3 | ProjectWorkID | uniqueidentifier | NN | ProjectWork.ProjectWorkID |
| 4 | TotalAmount | decimal(18,4) | NN |  |
| 5 | CreatedDate | datetime |  |  |
| 6 | CreatedBy | nvarchar(50) |  |  |
| 7 | ModifiedDate | datetime |  |  |
| 8 | ModifiedBy | nvarchar(50) |  |  |

## ProjectWorkEstimateDetail

Rows: 0 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | ProjectWorkEstimate.RefID |
| 3 | Amount | decimal(18,4) | NN |  |
| 4 | ExpenseItemID | uniqueidentifier | NN | ExpenseItem.ExpenseItemID |
| 5 | CreatedDate | datetime |  |  |
| 6 | CreatedBy | nvarchar(50) |  |  |
| 7 | ModifiedDate | datetime |  |  |
| 8 | ModifiedBy | nvarchar(50) |  |  |

## ProjectWorkNorm

Rows: 0 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ProjectWorkNormID | uniqueidentifier | PK NN |  |
| 2 | ProjectWorkID | uniqueidentifier | NN | ProjectWork.ProjectWorkID |
| 3 | JournalMemo | nvarchar(500) |  |  |
| 4 | FromDate | datetime |  |  |
| 5 | ToDate | datetime |  |  |
| 6 | Inactive | bit | NN |  |
| 7 | CreatedDate | datetime |  |  |
| 8 | CreatedBy | nvarchar(50) |  |  |
| 9 | ModifiedDate | datetime |  |  |
| 10 | ModifiedBy | nvarchar(50) |  |  |

## ProjectWorkNormDetail

Rows: 0 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ProjectWorkNormDetailID | uniqueidentifier | PK NN |  |
| 2 | ProjectWorkNormID | uniqueidentifier | NN | ProjectWorkNorm.ProjectWorkNormID |
| 3 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 4 | Description | nvarchar(500) |  |  |
| 5 | UnitID | uniqueidentifier |  | Unit.UnitID |
| 6 | Quantity | decimal(22,8) | NN |  |
| 7 | UnitPrice | decimal(20,6) | NN |  |
| 8 | Amount | decimal(18,4) | NN |  |
| 9 | SortOrder | int | NN |  |

## PurchasePurpose

Rows: 5 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | PurchasePurposeID | uniqueidentifier | PK NN |  |
| 2 | PurchasePurposeCode | nvarchar(20) |  |  |
| 3 | PurchasePurposeName | nvarchar(255) | NN |  |
| 4 | Description | nvarchar(255) |  |  |
| 5 | Inactive | bit | NN |  |
| 6 | IsSystem | bit | NN |  |
| 7 | CreatedDate | datetime |  |  |
| 8 | CreatedBy | nvarchar(50) |  |  |
| 9 | ModifiedDate | datetime |  |  |
| 10 | ModifiedBy | nvarchar(50) |  |  |

# 18 — Ngân sách / Vay / Công nợ

## DebtAgreement

Rows: 0 | Columns: 16

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | DebtAgreementID | uniqueidentifier | PK NN |  |
| 2 | DebtAgreementCode | nvarchar(20) | NN |  |
| 3 | AgreementDate | datetime | NN |  |
| 4 | DebtDate | datetime |  |  |
| 5 | CurrencyID | uniqueidentifier |  |  |
| 6 | Amount | money |  |  |
| 7 | Interest | decimal(22,8) |  |  |
| 8 | OverdueInterest | decimal(22,8) |  |  |
| 9 | BankID | uniqueidentifier |  | Bank.BankID |
| 10 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 11 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 12 | PaymentCycle | decimal(18,4) |  |  |
| 13 | PaymentTimes | int |  |  |
| 14 | DebtPeriod | decimal(18,4) |  |  |
| 15 | DueDate | datetime |  |  |
| 16 | Inactive | bit |  |  |

## DebtList

Rows: 0 | Columns: 13

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | DebtListID | uniqueidentifier | PK NN |  |
| 2 | BranchID | uniqueidentifier | NN | OrganizationUnit.OrganizationUnitID |
| 3 | DebtListName | nvarchar(255) | NN |  |
| 4 | FromDate | datetime | NN |  |
| 5 | ToDate | datetime | NN |  |
| 6 | TotalReceiptableAmount | decimal(18,4) | NN |  |
| 7 | TargetPercent | decimal(8,4) | NN |  |
| 8 | TargetAmount | decimal(18,4) | NN |  |
| 9 | Description | nvarchar(255) |  |  |
| 10 | CreatedDate | datetime |  |  |
| 11 | CreatedBy | nvarchar(50) |  |  |
| 12 | ModifiedDate | datetime |  |  |
| 13 | ModifiedBy | nvarchar(50) |  |  |

## DebtListDetail

Rows: 0 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | DebtListDetailID | uniqueidentifier | PK NN |  |
| 2 | DebtListID | uniqueidentifier | NN | DebtList.DebtListID |
| 3 | AccountObjectID | uniqueidentifier | NN | AccountObject.AccountObjectID |
| 4 | ResultDebt | nvarchar(255) |  |  |
| 5 | PaymentDate | datetime |  |  |
| 6 | Description | nvarchar(255) |  |  |

## DebtListDetailVoucher

Rows: 0 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | DebtListDetailVoucherID | uniqueidentifier | PK NN |  |
| 2 | AccountObjectID | uniqueidentifier | NN |  |
| 3 | RefID | uniqueidentifier | NN |  |
| 4 | RefType | int |  |  |
| 5 | DebtStatus | int |  |  |
| 6 | DisplayOnBook | int |  |  |

## DebtPeriod

Rows: 25 | Columns: 13

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | DebtPeriodID | uniqueidentifier | PK NN |  |
| 2 | DebtPeriodName | nvarchar(255) |  |  |
| 3 | DebtPeriodType | int |  |  |
| 4 | FromDay | int |  |  |
| 5 | ToDay | int |  |  |
| 6 | SortOrder | int |  |  |
| 7 | IsReadOnly | bit |  |  |
| 8 | CreatedBy | nvarchar(50) |  |  |
| 9 | CreatedDate | datetime |  |  |
| 10 | ModifiedBy | nvarchar(50) |  |  |
| 11 | ModifiedDate | datetime |  |  |
| 12 | DebtKind | int |  |  |
| 13 | ReportCaption | nvarchar(100) |  |  |

## LOANAgreement

Rows: 65 | Columns: 71

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | LOANAgreementID | uniqueidentifier | PK NN |  |
| 2 | RefType | int | NN |  |
| 3 | BranchID | uniqueidentifier |  |  |
| 4 | IsContract | bit | NN |  |
| 5 | LOANContractID | uniqueidentifier |  |  |
| 6 | LOANAgreementCode | nvarchar(50) | NN |  |
| 7 | IsContractOther | bit | NN |  |
| 8 | SignDate | datetime |  |  |
| 9 | CurrencyID | nvarchar(3) |  | CCY.CurrencyID |
| 10 | ExchangeRate | decimal(18,4) |  |  |
| 11 | LOANContractAmount | decimal(18,4) | NN |  |
| 12 | LOANContractAmountOC | decimal(18,4) | NN |  |
| 13 | LOANExpried | int | NN |  |
| 14 | ExpriedType | int | NN |  |
| 15 | ExpriedFromDate | datetime | NN |  |
| 16 | ExpriedToDate | datetime | NN |  |
| 17 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 18 | AccountObjectName | nvarchar(400) |  |  |
| 19 | LOANMethod | nvarchar(255) |  |  |
| 20 | Description | nvarchar(500) |  |  |
| 21 | DebitAccount | nvarchar(20) |  | Account.AccountNumber |
| 22 | RepayAccount | nvarchar(20) |  | Account.AccountNumber |
| 23 | DisbursementMethod | int | NN |  |
| 24 | BankAccountID | uniqueidentifier |  | BankAccount.BankAccountID |
| 25 | BankBranch | nvarchar(255) |  |  |
| 26 | BankName | nvarchar(255) |  |  |
| 27 | VendorID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 28 | VendorName | nvarchar(400) |  |  |
| 29 | BankAccountVendor | nvarchar(50) |  |  |
| 30 | BankNameVendor | nvarchar(128) |  |  |
| 31 | VoucherType | int |  |  |
| 32 | InvContractNo | nvarchar(255) |  |  |
| 33 | CalculateInterestType | int | NN |  |
| 34 | InterestYearType | int | NN |  |
| 35 | InterestType | int | NN |  |
| 36 | InterestRate | decimal(18,4) | NN |  |
| 37 | PayOriginalType | int | NN |  |
| 38 | PayOriginalDate | datetime |  |  |
| 39 | PayOriginalAmount | decimal(18,4) | NN |  |
| 40 | PayInterestType | int | NN |  |
| 41 | PayInterestDate | datetime |  |  |
| 42 | PayMethod | int |  |  |
| 43 | PayBankAccountID | uniqueidentifier |  | BankAccount.BankAccountID |
| 44 | PayBankAccountName | nvarchar(255) |  |  |
| 45 | ProjectWorkID | uniqueidentifier |  | ProjectWork.ProjectWorkID |
| 46 | PUOrderRefID | uniqueidentifier |  | PUOrder.RefID |
| 47 | PUContractID | uniqueidentifier |  | PUContract.PUContractID |
| 48 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 49 | SAOrderID | uniqueidentifier |  | SAOrder.RefID |
| 50 | BudgetItemID | uniqueidentifier |  | BudgetItem.BudgetItemID |
| 51 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 52 | ListItemID | uniqueidentifier |  | ListItem.ListItemID |
| 53 | CustomField1 | nvarchar(255) |  |  |
| 54 | CustomField2 | nvarchar(255) |  |  |
| 55 | CustomField3 | nvarchar(255) |  |  |
| 56 | CustomField4 | nvarchar(255) |  |  |
| 57 | CustomField5 | nvarchar(255) |  |  |
| 58 | CustomField6 | nvarchar(255) |  |  |
| 59 | CustomField7 | nvarchar(255) |  |  |
| 60 | CustomField8 | nvarchar(255) |  |  |
| 61 | CustomField9 | nvarchar(255) |  |  |
| 62 | CustomField10 | nvarchar(255) |  |  |
| 63 | OpeningPaidAmount | decimal(18,4) | NN |  |
| 64 | OpeningPaidAmountOC | decimal(18,4) | NN |  |
| 65 | OpeningInterestPaidAmount | decimal(18,4) | NN |  |
| 66 | OpeningInterestPaidAmountOC | decimal(18,4) | NN |  |
| 67 | Status | int | NN |  |
| 68 | OpeningPaidAmountManagement | decimal(18,4) | NN |  |
| 69 | OpeningPaidAmountOCManagement | decimal(18,4) | NN |  |
| 70 | OpeningInterestPaidAmountManagement | decimal(18,4) | NN |  |
| 71 | OpeningInterestPaidAmountOCManagement | decimal(18,4) | NN |  |

## LOANAgreementAsset

Rows: 0 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | LOANAgreementDetailID | uniqueidentifier | PK NN |  |
| 2 | LOANAgreementID | uniqueidentifier | NN | LOANAgreement.LOANAgreementID |
| 3 | AssetName | nvarchar(255) |  |  |
| 4 | Amount | decimal(18,4) | NN |  |
| 5 | MortgageMethod | nvarchar(255) |  |  |
| 6 | ContractCode | nvarchar(255) |  |  |
| 7 | TransferPaper | nvarchar(255) |  |  |
| 8 | Note | nvarchar(500) |  |  |
| 9 | SortOrder | int |  |  |

## LOANAgreementCalendar

Rows: 0 | Columns: 19

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | LOANAgreementDetailID | uniqueidentifier | PK NN |  |
| 2 | LOANAgreementID | uniqueidentifier | NN | LOANAgreement.LOANAgreementID |
| 3 | SortOrder | int | NN |  |
| 4 | PaymentDate | datetime | NN |  |
| 5 | OriginalDebtOpeningAmount | decimal(18,4) | NN |  |
| 6 | InterestCalculationDate | datetime | NN |  |
| 7 | InterestDay | int | NN |  |
| 8 | InterestRate | decimal(18,4) | NN |  |
| 9 | InterestPayableAmount | decimal(18,4) | NN |  |
| 10 | OriginalPayableAmount | decimal(18,4) | NN |  |
| 11 | InterestPaidAmount | decimal(18,4) |  |  |
| 12 | OriginalPaidAmount | decimal(18,4) |  |  |
| 13 | PayMethod | int |  |  |
| 14 | InterestPaidAmountManagement | decimal(18,4) |  |  |
| 15 | OriginalPaidAmountManagement | decimal(18,4) |  |  |
| 16 | OriginalLastYearPaidAmount | decimal(18,4) | NN |  |
| 17 | InterestLastYearPaidAmount | decimal(18,4) | NN |  |
| 18 | OriginalLastYearPaidAmountManagement | decimal(18,4) | NN |  |
| 19 | InterestLastYearPaidAmountManagement | decimal(18,4) | NN |  |

## LOANAgreementInterestRate

Rows: 26 | Columns: 5

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | LOANAgreementDetailID | uniqueidentifier | PK NN |  |
| 2 | LOANAgreementID | uniqueidentifier | NN | LOANAgreement.LOANAgreementID |
| 3 | InterestRate | decimal(18,4) | NN |  |
| 4 | EffectiveDate | datetime | NN |  |
| 5 | Note | nvarchar(500) |  |  |

## LOANAgreementPayment

Rows: 0 | Columns: 21

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | LOANAgreementDetailID | uniqueidentifier | PK NN |  |
| 2 | LOANAgreementID | uniqueidentifier | NN | LOANAgreement.LOANAgreementID |
| 3 | LOANCalendarID | uniqueidentifier |  |  |
| 4 | RefDetailID | uniqueidentifier | NN |  |
| 5 | RefID | uniqueidentifier | NN |  |
| 6 | RefDate | datetime | NN |  |
| 7 | PostedDate | datetime | NN |  |
| 8 | RefNoFinance | nvarchar(20) |  |  |
| 9 | RefNoManagement | nvarchar(20) |  |  |
| 10 | RefType | int | NN |  |
| 11 | DisplayOnBook | int | NN |  |
| 12 | JournalMemo | nvarchar(500) |  |  |
| 13 | DebitAccount | nvarchar(20) |  |  |
| 14 | CreditAccount | nvarchar(20) |  |  |
| 15 | ReceiptAmountOC | decimal(18,4) | NN |  |
| 16 | ReceiptAmount | decimal(18,4) | NN |  |
| 17 | PaymentAmountOC | decimal(18,4) | NN |  |
| 18 | PaymentAmount | decimal(18,4) | NN |  |
| 19 | PaymentType | int | NN |  |
| 20 | TimeType | int | NN |  |
| 21 | CurrencyID | nvarchar(3) |  |  |

## LoanProfile

Rows: 0 | Columns: 27

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | LoanProfileID | uniqueidentifier | PK NN |  |
| 2 | CreatedDate | datetime | NN |  |
| 3 | SendDate | datetime |  |  |
| 4 | CompanyName | nvarchar(500) | NN |  |
| 5 | Address | nvarchar(1000) |  |  |
| 6 | CompanyTaxCode | nvarchar(50) |  |  |
| 7 | Tel | nvarchar(50) |  |  |
| 8 | Status | nvarchar(50) |  |  |
| 9 | Description | nvarchar(MAX) |  |  |
| 10 | Province | nvarchar(50) |  |  |
| 11 | InstantFileID | nvarchar(50) |  |  |
| 12 | OnlineAmount | int |  |  |
| 13 | AppointmentDate | datetime |  |  |
| 14 | MeetingDate | datetime |  |  |
| 15 | District | nvarchar(255) |  |  |
| 16 | Email | nvarchar(50) |  |  |
| 17 | ContactName | nvarchar(255) |  |  |
| 18 | ContactTitle | nvarchar(500) |  |  |
| 19 | ContactMobile | nvarchar(50) |  |  |
| 20 | LoanAmount | decimal(18,4) |  |  |
| 21 | DescriptionHTML | nvarchar(MAX) |  |  |
| 22 | MBHFileID | nvarchar(128) |  |  |
| 23 | ApprovedBy | nvarchar(50) |  |  |
| 24 | ApprovedDate | datetime |  |  |
| 25 | LoanProfilePurpose | int |  |  |
| 26 | OtherPurposeDescription | nvarchar(MAX) |  |  |
| 27 | BranchID | uniqueidentifier |  |  |

## LoanProfileDBInfo

Rows: 0 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | CompanyTaxCode | nvarchar(50) |  |  |
| 2 | LicenseNo | nvarchar(50) |  |  |
| 3 | TotalRevenueLastYear | decimal(18,4) |  |  |
| 4 | TotalRevenueOtherYear | decimal(18,4) |  |  |
| 5 | Career | nvarchar(100) |  |  |
| 6 | AccountingSystem | int |  |  |
| 7 | ProvideDate | date |  |  |

## LoanProfileDetail

Rows: 0 | Columns: 12

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | LoanProfileDetailID | uniqueidentifier | PK NN |  |
| 2 | LoanProfileID | uniqueidentifier | NN | LoanProfile.LoanProfileID |
| 3 | FileName | nvarchar(255) |  |  |
| 4 | ReportFileName | nvarchar(255) |  |  |
| 5 | FileContent | varbinary |  |  |
| 6 | SortOrder | int |  |  |
| 7 | FilePath | nvarchar(500) |  |  |
| 8 | PropotionRate | decimal(18,4) |  |  |
| 9 | Amount | money |  |  |
| 10 | TypeReport | int |  |  |
| 11 | ItemID | uniqueidentifier |  |  |
| 12 | ItemName | nvarchar(255) |  |  |

## LoanProfileDetailTemplate

Rows: 16 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ItemID | uniqueidentifier | PK NN |  |
| 2 | ItemName | nvarchar(255) |  |  |
| 3 | FileName | nvarchar(255) |  |  |
| 4 | ReportFileName | nvarchar(255) |  |  |
| 5 | TypeReport | int |  |  |
| 6 | IsBold | bit | NN |  |
| 7 | IsItalic | bit | NN |  |
| 8 | AllowAttach | bit | NN |  |
| 9 | SortOrder | int |  |  |

## LoanProfileListItem

Rows: 0 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | KeyID | uniqueidentifier | PK NN |  |
| 2 | ItemID | uniqueidentifier | NN |  |
| 3 | ItemName | nvarchar(1000) |  |  |
| 4 | SortOrder | int |  |  |
| 5 | Description | nvarchar(1000) |  |  |
| 6 | DataInputType | nvarchar(100) |  |  |
| 7 | LoanProfileID | uniqueidentifier | NN | LoanProfile.LoanProfileID |
| 8 | RowNumber | nvarchar(100) |  |  |
| 9 | ItemType | int | NN |  |

## LoanProfileSummaryReport

Rows: 0 | Columns: 14

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | BranchID | uniqueidentifier |  |  |
| 2 | ClosingDebitAmount | decimal(18,4) |  |  |
| 3 | PaymentAmount | decimal(18,4) |  |  |
| 4 | PayrollAmount | decimal(18,4) |  |  |
| 5 | RevenueLastYear | decimal(18,4) |  |  |
| 6 | ShortRatio | decimal(18,4) |  |  |
| 7 | QuickRatio | decimal(18,4) |  |  |
| 8 | ImmediateRatio | decimal(18,4) |  |  |
| 9 | PaymentTurnover | decimal(18,4) |  |  |
| 10 | RevenueTurnover | decimal(18,4) |  |  |
| 11 | CashFlowOperating | decimal(18,4) |  |  |
| 12 | CashFlowInvesting | decimal(18,4) |  |  |
| 13 | CashFlowFinancing | decimal(18,4) |  |  |
| 14 | IsWorkingWithManagementBook | bit |  |  |

## LoanProfileTemplate

Rows: 25 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ItemID | uniqueidentifier | PK NN |  |
| 2 | ItemName | nvarchar(1000) |  |  |
| 3 | SortOrder | int |  |  |
| 4 | Description | nvarchar(1000) |  |  |
| 5 | RowNumber | nvarchar(100) |  |  |
| 6 | ItemType | int | NN |  |
| 7 | DefaultValue | nvarchar(100) |  |  |
| 8 | AllowInputNull | bit | NN |  |
| 9 | IsBold | bit | NN |  |
| 10 | IsItalic | bit | NN |  |

## PreReceiptRevenue

Rows: 0 | Columns: 21

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | PreReceiptRevenueID | uniqueidentifier | PK NN |  |
| 2 | PreReceiptRevenueCode | nvarchar(20) | NN |  |
| 3 | PreReceiptRevenueName | nvarchar(128) |  |  |
| 4 | RefDate | datetime | NN |  |
| 5 | Amount | decimal(18,4) | NN |  |
| 6 | AllocationTime | int | NN |  |
| 7 | AllocationAmount | decimal(18,4) | NN |  |
| 8 | UnrealizedRevenueAccount | nvarchar(20) |  | Account.AccountNumber |
| 9 | AllocationAccount | nvarchar(20) |  | Account.AccountNumber |
| 10 | DisplayOnBook | int | NN |  |
| 11 | BranchID | uniqueidentifier |  |  |
| 12 | RefType | int |  |  |
| 13 | CopyFromID | uniqueidentifier |  |  |
| 14 | AllocatedAmount | decimal(18,4) | NN |  |
| 15 | AllocatedPeriod | int | NN |  |
| 16 | IsAllocationByObject | bit | NN |  |
| 17 | Inactive | bit | NN |  |
| 18 | ReasonInactive | nvarchar(255) |  |  |
| 19 | RecordDate | datetime |  |  |
| 20 | AccountObjectID | uniqueidentifier |  |  |
| 21 | AccountObjectName | nvarchar(400) |  |  |

## PreReceiptRevenueDetail

Rows: 0 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | PreReceiptRevenueDetailID | uniqueidentifier | PK NN |  |
| 2 | PreReceiptRevenueID | uniqueidentifier | NN | PreReceiptRevenue.PreReceiptRevenueID |
| 3 | AllocationObjectID | uniqueidentifier |  |  |
| 4 | AllocationObjectName | nvarchar(255) |  |  |
| 5 | AllocationObjectType | int |  |  |
| 6 | AllocationRate | decimal(9,4) | NN |  |
| 7 | AllocationAccount | nvarchar(20) |  | Account.AccountNumber |
| 8 | SortOrder | int | NN |  |

## PreReceiptRevenueDetailSource

Rows: 0 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | PreReceiptRevenueDetailID | uniqueidentifier | PK NN |  |
| 2 | PreReceiptRevenueID | uniqueidentifier | NN | PreReceiptRevenue.PreReceiptRevenueID |
| 3 | RefID | uniqueidentifier | NN |  |
| 4 | RefType | int | NN |  |
| 5 | RefDetailID | uniqueidentifier |  |  |
| 6 | JournalMemo | nvarchar(500) |  |  |
| 7 | CreditAccount | nvarchar(20) |  |  |
| 8 | DebitAccount | nvarchar(20) |  |  |
| 9 | SortOrder | int |  |  |

## PrepaidExpenses

Rows: 157 | Columns: 16

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | PrepaidExpensesID | uniqueidentifier | PK NN |  |
| 2 | PrepaidExpensesCode | nvarchar(20) | NN |  |
| 3 | PrepaidExpensesName | nvarchar(128) |  |  |
| 4 | RefDate | datetime | NN |  |
| 5 | Amount | decimal(18,4) | NN |  |
| 6 | AllocationTime | int | NN |  |
| 7 | AllocationAmount | decimal(18,4) | NN |  |
| 8 | AllocationAccount | nvarchar(20) |  | Account.AccountNumber |
| 9 | DisplayOnBook | int | NN |  |
| 10 | BranchID | uniqueidentifier |  |  |
| 11 | RefType | int |  |  |
| 12 | CopyFromID | uniqueidentifier |  |  |
| 13 | AllocatedAmount | decimal(18,4) | NN |  |
| 14 | AllocatedPeriod | int | NN |  |
| 15 | Inactive | bit | NN |  |
| 16 | ReasonInactive | nvarchar(255) |  |  |

## PrepaidExpensesDetail

Rows: 190 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | PrepaidExpensesDetailID | uniqueidentifier | PK NN |  |
| 2 | PrepaidExpensesID | uniqueidentifier | NN | PrepaidExpenses.PrepaidExpensesID |
| 3 | SortOrder | int | NN |  |
| 4 | AllocationObjectID | uniqueidentifier |  |  |
| 5 | AllocationObjectName | nvarchar(255) |  |  |
| 6 | AllocationObjectType | int |  |  |
| 7 | AllocationRate | decimal(9,4) | NN |  |
| 8 | CostAccount | nvarchar(20) |  | Account.AccountNumber |
| 9 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |

## PrepaidExpensesDetailSource

Rows: 3 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | PrepaidExpensesDetailID | uniqueidentifier | PK NN |  |
| 2 | PrepaidExpensesID | uniqueidentifier | NN | PrepaidExpenses.PrepaidExpensesID |
| 3 | RefID | uniqueidentifier | NN |  |
| 4 | RefType | int | NN |  |
| 5 | SortOrder | int |  |  |
| 6 | RefDetailID | uniqueidentifier |  |  |
| 7 | JournalMemo | nvarchar(500) |  |  |
| 8 | CreditAccount | nvarchar(20) |  |  |
| 9 | DebitAccount | nvarchar(20) |  |  |

# 19 — TA Thuế

## AMISTaxAllOrg

Rows: 0 | Columns: 2

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ID | nvarchar(255) | PK NN |  |
| 2 | ListOrg | nvarchar(MAX) |  |  |

## AMISTaxConfig

Rows: 0 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ID | uniqueidentifier | NN |  |
| 2 | DatabaseID | uniqueidentifier | NN |  |
| 3 | BranchID | uniqueidentifier | NN |  |
| 4 | UserID | uniqueidentifier | NN |  |
| 5 | ConnectInfo | nvarchar(MAX) |  |  |
| 6 | BranchConnect | varchar(MAX) |  |  |
| 7 | BranchType | int |  |  |
| 8 | BranchOption | int |  |  |
| 9 | IsActive | bit | NN |  |

## AMISTaxOrg

Rows: 0 | Columns: 12

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ID | uniqueidentifier | NN |  |
| 2 | SMEOrganizationUnitID | uniqueidentifier |  |  |
| 3 | SMEOrganizationUnitCode | nvarchar(20) |  |  |
| 4 | SMEOrganizationUnitName | nvarchar(128) |  |  |
| 5 | SMEOrganizationUnitTaxCode | nvarchar(20) |  |  |
| 6 | AMISOrganizationUnitID | nvarchar(50) |  |  |
| 7 | AMISOrganizationUnitCode | nvarchar(50) |  |  |
| 8 | AMISOrganizationUnitName | nvarchar(255) |  |  |
| 9 | AMISOrganizationUnitTaxCode | nvarchar(20) |  |  |
| 10 | Address | nvarchar(255) |  |  |
| 11 | FullName | nvarchar(255) |  |  |
| 12 | Phone | nvarchar(25) |  |  |

## PersonalIncomeTaxRate

Rows: 12 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | PersonalIncomeTaxRateID | uniqueidentifier | PK NN |  |
| 2 | TaxGrade | int | NN |  |
| 3 | TaxRate | decimal(9,4) | NN |  |
| 4 | FromIncomeByMonth | decimal(18,4) | NN |  |
| 5 | ToIncomeByMonth | decimal(18,4) |  |  |
| 6 | FromIncomeByYear | decimal(18,4) | NN |  |
| 7 | ToIncomeByYear | decimal(18,4) |  |  |
| 8 | Inactive | bit | NN |  |
| 9 | PersonalIncomeTaxRateType | bigint | NN |  |

## ResourcesTaxTable

Rows: 1,083 | Columns: 22

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ResourcesTaxTableID | uniqueidentifier | PK NN |  |
| 2 | ResourcesTaxTableCode | nvarchar(20) | NN |  |
| 3 | ResourcesTaxTableName | nvarchar(255) | NN |  |
| 4 | Unit | nvarchar(20) |  |  |
| 5 | TaxRate | decimal(18,4) |  |  |
| 6 | Inactive | bit | NN |  |
| 7 | IsSystem | bit | NN |  |
| 8 | IsParent | bit | NN |  |
| 9 | ParentID | uniqueidentifier |  |  |
| 10 | MISACodeID | nvarchar(100) |  |  |
| 11 | Grade | int |  |  |
| 12 | ModifiedBy | nvarchar(50) |  |  |
| 13 | CreatedDate | datetime |  |  |
| 14 | CreatedBy | nvarchar(50) |  |  |
| 15 | ModifiedDate | datetime |  |  |
| 16 | SortMISACodeID | nvarchar(100) |  |  |
| 17 | VATPrice | decimal(28,4) |  |  |
| 18 | ResourcesTaxTableCodeSort | nvarchar(20) |  |  |
| 19 | SectionCode | nvarchar(20) |  |  |
| 20 | SubsectionCode | nvarchar(20) |  |  |
| 21 | BaseOn | nvarchar(255) |  |  |
| 22 | VBQPDate | datetime |  |  |

## ResourcesTaxTableDetail

Rows: 1,478 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ResourcesTaxTableCode | nvarchar(20) | NN |  |
| 2 | ResourcesTaxTableName | nvarchar(255) | NN |  |
| 3 | Unit | nvarchar(100) |  |  |
| 4 | TaxRate | decimal(28,4) |  |  |
| 5 | Fromdate | datetime |  |  |
| 6 | Todate | datetime |  |  |
| 7 | MinVATPrice | decimal(28,4) |  |  |
| 8 | MaxVATPrice | decimal(28,4) |  |  |

## TAAdditionalDeclarationItem

Rows: 0 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefType | int |  |  |
| 2 | ItemCodeKey | nvarchar(50) |  |  |
| 3 | ItemCodeValue | nvarchar(255) |  |  |
| 4 | ItemNameValue | nvarchar(255) |  |  |

## TAAdjustmentDetail

Rows: 0 | Columns: 20

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | TADeclaration.RefID |
| 3 | AppendixID | uniqueidentifier | NN |  |
| 4 | DescriptionName | nvarchar(550) |  |  |
| 5 | Code | nvarchar(255) |  |  |
| 6 | OrgAmount | decimal(18,4) | NN |  |
| 7 | AdjustAmount | decimal(18,4) | NN |  |
| 8 | DiffAmount | decimal(18,4) |  |  |
| 9 | GroupName | nvarchar(50) |  |  |
| 10 | SortOrder | int | NN |  |
| 11 | SubsectionName | nvarchar(550) |  |  |
| 12 | DITaxAmount | decimal(18,4) |  |  |
| 13 | AdjustTaxLiability | decimal(18,4) |  |  |
| 14 | Reason | nvarchar(255) |  |  |
| 15 | SortOrderText | nvarchar(20) |  |  |
| 16 | SubsectionCode | nvarchar(20) |  |  |
| 17 | OrgValue | nvarchar(255) |  |  |
| 18 | AdjustValue | nvarchar(255) |  |  |
| 19 | SortOrderCode | int |  |  |
| 20 | CustomField1 | nvarchar(255) |  |  |

## TAAdjustmentDetail01

Rows: 0 | Columns: 18

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | TADeclaration.RefID |
| 3 | AppendixID | uniqueidentifier | NN |  |
| 4 | SortOrder | int | NN |  |
| 5 | PlaceName | nvarchar(255) |  |  |
| 6 | PlaceTaxCode | nvarchar(20) |  |  |
| 7 | ProvinceOrCityID | nvarchar(20) |  |  |
| 8 | ProvinceOrCity | nvarchar(255) |  |  |
| 9 | DistrictID | nvarchar(20) |  |  |
| 10 | District | nvarchar(255) |  |  |
| 11 | TaxCompanyID | nvarchar(25) |  |  |
| 12 | TaxCompanyName | nvarchar(255) |  |  |
| 13 | TaxCompanyDecisionID | nvarchar(25) |  |  |
| 14 | TaxCompanyDecisionName | nvarchar(255) |  |  |
| 15 | TaxAmount | decimal(18,4) |  |  |
| 16 | GroupName | nvarchar(50) |  |  |
| 17 | WardOrCommuneID | nvarchar(100) |  |  |
| 18 | WardOrCommune | nvarchar(255) |  |  |

## TAAppendixReduction

Rows: 12 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | AppendixTypeID | uniqueidentifier |  |  |
| 2 | Name | nvarchar(255) |  |  |
| 3 | AppendixName | nvarchar(255) |  |  |
| 4 | GroupName | nvarchar(50) |  |  |
| 5 | FromDate | datetime |  |  |
| 6 | ToDate | datetime |  |  |
| 7 | TaxMethod | bit |  |  |
| 8 | SortOrder | int |  |  |
| 9 | ExcelKey | nvarchar(50) |  |  |

## TAAppendixType

Rows: 121 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | AppendixTypeID | uniqueidentifier | PK NN |  |
| 2 | AppendixTypeCode | nvarchar(50) | NN |  |
| 3 | AppendixTypeName | nvarchar(255) |  |  |
| 4 | TemplateSheetName | nvarchar(255) |  |  |
| 5 | TableName | nvarchar(50) |  |  |
| 6 | RefType | int |  |  |
| 7 | ProcedureName | nvarchar(255) |  |  |
| 8 | SortOrder | int | NN |  |
| 9 | IsAppendix | bit | NN |  |
| 11 | ProcedureNameInvalidInvoice | nvarchar(255) |  |  |

## TACareerGroup

Rows: 5 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | TACareerGroupID | int | PK NN |  |
| 2 | TACareerGroupName | nvarchar(128) | NN |  |
| 3 | TACareerGroupCode | nvarchar(25) |  |  |

## TACareerList

Rows: 19 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | TACareerListID | uniqueidentifier | PK NN |  |
| 2 | Name | nvarchar(255) |  |  |
| 3 | CareerType | int |  |  |
| 4 | CareerCode | nvarchar(10) |  |  |
| 5 | RefTypeList | nvarchar(100) |  |  |
| 6 | FromDate | datetime |  |  |
| 7 | ToDate | datetime |  |  |
| 8 | SortOrder | int |  |  |

## TAChangedateLunarAndSolar

Rows: 200 | Columns: 5

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | DateLunar | nvarchar(50) |  |  |
| 2 | DateSolar | datetime |  |  |
| 3 | SortOrder | int | PK NN |  |
| 4 | Type | int | NN |  |
| 5 | Year | int |  |  |

## TADeclaration

Rows: 0 | Columns: 38

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | BranchID | uniqueidentifier |  |  |
| 3 | RefType | int | NN |  |
| 4 | TemplateNo | nvarchar(100) |  |  |
| 5 | DeclarationName | nvarchar(128) |  |  |
| 6 | DeclarationTerm | nvarchar(50) |  |  |
| 7 | FromDate | datetime |  |  |
| 8 | ToDate | datetime |  |  |
| 9 | IsFirstDeclaration | bit | NN |  |
| 10 | AdditionTime | int |  |  |
| 11 | Editversion | timestamp | NN |  |
| 12 | CreatedDate | datetime |  |  |
| 13 | CreatedBy | nvarchar(50) |  |  |
| 14 | ModifiedDate | datetime |  |  |
| 15 | ModifiedBy | nvarchar(50) |  |  |
| 16 | TemplateID | uniqueidentifier |  | TATemplate.TemplateID |
| 17 | GLVoucherRefID | uniqueidentifier |  |  |
| 18 | IsShowRefNo | bit |  |  |
| 20 | IsTT195 | bit | NN |  |
| 21 | CareerCode | nvarchar(10) |  |  |
| 22 | CareerName | nvarchar(255) |  |  |
| 23 | ProjectCode | nvarchar(12) |  |  |
| 24 | ProjectName | nvarchar(200) |  |  |
| 25 | IsCollection | bit | NN |  |
| 26 | IsIncludeIndirectTax | bit | NN |  |
| 28 | ProvinceCode | nvarchar(100) |  |  |
| 29 | ProvinceName | nvarchar(255) |  |  |
| 30 | DepartmentTaxCode | nvarchar(100) |  |  |
| 31 | DepartmentTaxName | nvarchar(255) |  |  |
| 32 | PaymentTaxCode | nvarchar(100) |  |  |
| 33 | PaymentTaxName | nvarchar(255) |  |  |
| 34 | PayrollDescription | nvarchar(255) |  |  |
| 35 | PayrollFromDate | datetime |  |  |
| 36 | PayrollToDate | datetime |  |  |
| 37 | IsSelectPayroll | bit |  |  |
| 38 | IsCreateNew | bit |  |  |
| 39 | WardOrCommuneCode | nvarchar(100) |  |  |
| 40 | WardOrCommuneName | nvarchar(255) |  |  |

## TADeclarationAppendix

Rows: 0 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | AppendixID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | TADeclaration.RefID |
| 3 | AppendixTypeID | uniqueidentifier |  | TAAppendixType.AppendixTypeID |

## TADeclarationConfig

Rows: 25 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefType | int | PK NN |  |
| 2 | RefTypeName | nvarchar(100) | NN |  |
| 3 | TemplateFileName | nchar(100) | NN |  |
| 4 | TemplateNo | nvarchar(100) |  |  |
| 5 | DeclarationName | nvarchar(255) |  |  |
| 6 | SetupFormName | nvarchar(100) |  |  |
| 7 | IsShowSetupFormWhenEdit | int |  |  |
| 8 | MenuName | nvarchar(100) |  |  |

## TADeclarationDetail

Rows: 0 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | TADeclaration.RefID |
| 3 | ItemCode | nvarchar(50) | NN |  |
| 4 | ItemName | nvarchar(255) |  |  |
| 5 | DataType | int |  |  |
| 6 | Value | nvarchar(500) |  |  |
| 7 | GroupName | nvarchar(100) |  |  |

## TADeclarationGeneral

Rows: 0 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | TADeclaration.RefID |
| 3 | ItemCode | nvarchar(50) | NN |  |
| 4 | ItemName | nvarchar(255) |  |  |
| 5 | DataType | int |  |  |
| 6 | Value | nvarchar(500) |  |  |

## TADeclaration_AfterR30

Rows: 0 | Columns: 1

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |

## TADeclaration_BeforeR28

Rows: 0 | Columns: 1

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |

## TAEstimatedEnterpriseIncomeDefault

Rows: 19 | Columns: 18

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ItemID | uniqueidentifier | PK NN |  |
| 2 | ItemCode | nvarchar(50) | NN |  |
| 3 | ItemName | nvarchar(255) | NN |  |
| 4 | ItemIndex | nvarchar(20) | NN |  |
| 5 | ParentID | uniqueidentifier |  |  |
| 6 | Hidden | bit | NN |  |
| 7 | IsBold | bit | NN |  |
| 8 | IsItalic | bit | NN |  |
| 9 | AllowEdit | bit | NN |  |
| 10 | AllowDBNull | bit | NN |  |
| 11 | CreatedDate | datetime |  |  |
| 12 | CreatedBy | nvarchar(50) |  |  |
| 13 | ModifiedDate | datetime |  |  |
| 14 | ModifiedBy | nvarchar(50) |  |  |
| 15 | ItemNameEnglish | nvarchar(255) |  |  |
| 16 | ItemNameChinese | nvarchar(255) |  |  |
| 17 | ItemNameKorean | nvarchar(255) |  |  |
| 18 | SortOrder | int | NN |  |

## TAEstimatedEnterpriseIncomeDetail

Rows: 0 | Columns: 11

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier |  | TADeclaration.RefID |
| 3 | ItemID | uniqueidentifier |  |  |
| 4 | ItemCode | nvarchar(50) |  |  |
| 5 | ItemName | nvarchar(255) |  |  |
| 6 | ItemIndex | nvarchar(20) |  |  |
| 7 | Amount | decimal(18,4) |  |  |
| 8 | ItemNameEnglish | nvarchar(255) |  |  |
| 9 | ItemNameChinese | nvarchar(255) |  |  |
| 10 | ItemNameKorean | nvarchar(255) |  |  |
| 11 | SortOrder | int |  |  |

## TANoTaxableGoods

Rows: 0 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | TADeclaration.RefID |
| 3 | VoucherRefID | uniqueidentifier | NN |  |

## TANotification

Rows: 0 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | Id | nvarchar(128) | PK NN |  |
| 2 | SubmissionId | nvarchar(128) |  |  |
| 3 | SubmissionCode | nvarchar(128) |  |  |
| 4 | TaxCode | nvarchar(50) |  |  |
| 5 | Reason | nvarchar(MAX) |  |  |
| 6 | CreatedDate | datetime |  |  |
| 7 | Status | int |  |  |
| 8 | FilePath | nvarchar(255) |  |  |
| 9 | FileContent | nvarchar(MAX) |  |  |

## TAPaymentSlip

Rows: 0 | Columns: 11

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SubmissionId | nvarchar(50) | PK NN |  |
| 2 | TaxCode | nvarchar(50) |  |  |
| 3 | BankPaymentCode | nvarchar(50) |  |  |
| 4 | ContentPayStateBudger | nvarchar(MAX) |  |  |
| 5 | AuthorizingTaxCode | nvarchar(25) |  |  |
| 6 | TypeMoney | nvarchar(10) |  |  |
| 7 | TotalMoney | decimal(18,4) |  |  |
| 8 | PayerBankName | nvarchar(255) |  |  |
| 9 | OrgCollectTaxAgentName | nvarchar(255) |  |  |
| 10 | Status | nvarchar(128) |  |  |
| 11 | CreatedDate | datetime |  |  |

## TASubmission

Rows: 0 | Columns: 12

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SubmissionId | nvarchar(128) | PK NN |  |
| 2 | SubmissionCode | nvarchar(128) |  |  |
| 3 | TaxCode | nvarchar(50) |  |  |
| 4 | TaxReturnCode | nvarchar(50) |  |  |
| 5 | TaxPeriod | nvarchar(50) |  |  |
| 6 | DeclareSubmissionType | nvarchar(50) |  |  |
| 7 | SubmissionTimes | int |  |  |
| 8 | Status | nvarchar(50) |  |  |
| 9 | CreatedDate | datetime |  |  |
| 10 | PeriodTypeId | nvarchar(128) |  |  |
| 11 | TaxReturnName | nvarchar(255) |  |  |
| 12 | ParentCode | nvarchar(50) |  |  |

## TATaxAgentInfo

Rows: 0 | Columns: 27

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | TaxAgentID | uniqueidentifier | PK NN |  |
| 2 | TaxAgentName | nvarchar(128) |  |  |
| 3 | TaxCode | nvarchar(50) |  |  |
| 4 | Address | nvarchar(255) |  |  |
| 5 | District | nvarchar(100) |  |  |
| 6 | ProvinceOrCity | nvarchar(100) |  |  |
| 7 | Tel | nvarchar(50) |  |  |
| 8 | Fax | nvarchar(50) |  |  |
| 9 | Email | nvarchar(100) |  |  |
| 10 | ContractCode | nvarchar(50) |  |  |
| 11 | ContractDate | datetime |  |  |
| 12 | EmployeeName | nvarchar(128) |  |  |
| 13 | CertificateNo | nvarchar(50) |  |  |
| 14 | IsDisplayOnDeclaration | bit | NN |  |
| 15 | CreatedDate | datetime |  |  |
| 16 | CreatedBy | nvarchar(50) |  |  |
| 17 | ModifiedDate | datetime |  |  |
| 18 | ModifiedBy | nvarchar(50) |  |  |
| 19 | TaxationBureauCode | nvarchar(25) |  |  |
| 20 | TaxOrganManagementCode | nvarchar(25) |  |  |
| 21 | BranchID | uniqueidentifier | NN |  |
| 22 | ProvideUnit | nvarchar(128) |  |  |
| 23 | CertificateNoUnit | nvarchar(50) |  |  |
| 24 | TaxProvice | nvarchar(100) |  |  |
| 25 | TaxWard | nvarchar(255) |  |  |
| 26 | TaxProviceCode | nvarchar(50) |  |  |
| 27 | TaxWardCode | nvarchar(50) |  |  |

## TATemplate

Rows: 0 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | TemplateID | uniqueidentifier | PK NN |  |
| 2 | DecisionID | nvarchar(50) | NN |  |
| 3 | Description | nvarchar(128) |  |  |
| 4 | RefType | int | NN |  |
| 5 | Template | varbinary | NN |  |
| 6 | ModifiedDate | datetime |  |  |
| 7 | CreatedDate | datetime |  |  |

## TA_011GTGT_Detail

Rows: 0 | Columns: 28

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | AppendixID | uniqueidentifier | NN | TADeclarationAppendix.AppendixID |
| 4 | VoucherRefID | uniqueidentifier |  |  |
| 5 | VoucherRefDetailID | uniqueidentifier |  |  |
| 6 | InvoiceTemplate | nvarchar(25) |  |  |
| 7 | InvSeries | nvarchar(20) |  |  |
| 8 | InvNo | nvarchar(25) |  |  |
| 9 | InvDate | datetime |  |  |
| 10 | AccountObjectName | nvarchar(400) |  |  |
| 11 | CompanyTaxCode | nvarchar(50) |  |  |
| 12 | InventoryItemName | nvarchar(500) |  |  |
| 13 | TurnOverAmount | decimal(18,4) | NN |  |
| 14 | TaxRate | decimal(18,4) | NN |  |
| 15 | TaxAmount | decimal(18,4) | NN |  |
| 16 | Note | nvarchar(255) |  |  |
| 17 | GroupName | nvarchar(50) | NN |  |
| 18 | SortOrder | int | NN |  |
| 19 | VoucherRefType | int |  |  |
| 20 | VoucherRefNo | nvarchar(20) |  |  |
| 21 | VoucherBranchID | uniqueidentifier |  |  |
| 22 | AccountObjectAddress | nvarchar(400) |  |  |
| 23 | AccountNumber | nvarchar(20) |  |  |
| 24 | VoucherRefIDString | nvarchar(MAX) |  |  |
| 25 | AmountDecimalDigits | decimal(18,4) |  |  |
| 26 | IsReductionInvoice | bit |  |  |
| 27 | DeductionsTaxAmount | decimal(18,4) |  |  |
| 28 | ToolClickType | int | NN |  |

## TA_011TNDN_Detail

Rows: 0 | Columns: 12

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | AppendixID | uniqueidentifier | NN | TADeclarationAppendix.AppendixID |
| 4 | SortOrder | int | NN |  |
| 5 | CompanyName | nvarchar(255) |  |  |
| 6 | CompanyTaxCode | nvarchar(50) |  |  |
| 7 | TaxCompanyID | nvarchar(25) |  |  |
| 8 | TaxCompanyName | nvarchar(128) |  |  |
| 9 | TaxCompanyManagementID | nvarchar(25) |  |  |
| 10 | TaxCompanyManagementName | nvarchar(128) |  |  |
| 11 | AllocationRate | decimal(9,4) |  |  |
| 12 | AllocationAmount | decimal(18,4) |  |  |

## TA_011TTDB_Detail

Rows: 0 | Columns: 19

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | AppendixID | uniqueidentifier | NN | TADeclarationAppendix.AppendixID |
| 4 | VoucherRefID | uniqueidentifier |  |  |
| 5 | VoucherRefDetailID | uniqueidentifier |  |  |
| 6 | VoucherRefType | int |  |  |
| 7 | VoucherBranchID | uniqueidentifier |  |  |
| 8 | InvSeries | nvarchar(20) |  |  |
| 9 | InvNo | nvarchar(25) |  |  |
| 10 | InvDate | datetime |  |  |
| 11 | AccountObjectName | nvarchar(400) |  |  |
| 12 | InventoryItemName | nvarchar(500) |  |  |
| 13 | InventoryItemCategoryName | nvarchar(255) |  |  |
| 14 | Quantity | decimal(22,8) |  |  |
| 15 | UnitPrice | decimal(20,6) |  |  |
| 16 | Amount | decimal(18,4) |  |  |
| 17 | SortOrder | int | NN |  |
| 18 | InventoryItemCategoryCode | nvarchar(50) |  |  |
| 19 | Unit | nvarchar(20) |  |  |

## TA_011TTDB_Detail_TT195

Rows: 0 | Columns: 17

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | AppendixID | uniqueidentifier | NN | TADeclarationAppendix.AppendixID |
| 4 | InvSeries | nvarchar(20) |  |  |
| 5 | InvNo | nvarchar(25) |  |  |
| 6 | InvDate | datetime |  |  |
| 7 | InventoryItemName | nvarchar(500) |  |  |
| 8 | Quantity | decimal(22,8) |  |  |
| 9 | SpecialTaxAmount | decimal(22,8) |  |  |
| 10 | SpecialTaxAmountOnUnit | decimal(22,8) |  |  |
| 11 | DeductTaxAmount | decimal(22,8) |  |  |
| 12 | RemainingTaxAmount | decimal(22,8) |  |  |
| 13 | ProductName | nvarchar(255) |  |  |
| 14 | QuantityOnUnit | decimal(22,8) |  |  |
| 15 | GroupName | nvarchar(50) | NN |  |
| 16 | SortOrder | int |  |  |
| 17 | TotalDeductSpecialTaxAmount | decimal(22,8) |  |  |

## TA_012GTGT_Detail

Rows: 0 | Columns: 31

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | AppendixID | uniqueidentifier | NN | TADeclarationAppendix.AppendixID |
| 4 | VoucherRefID | uniqueidentifier |  |  |
| 5 | VoucherRefDetailID | uniqueidentifier |  |  |
| 6 | InvoiceTemplate | nvarchar(25) |  |  |
| 7 | InvSeries | nvarchar(20) |  |  |
| 8 | InvNo | nvarchar(25) |  |  |
| 9 | InvDate | datetime |  |  |
| 10 | AccountObjectName | nvarchar(400) |  |  |
| 11 | CompanyTaxCode | nvarchar(50) |  |  |
| 12 | InventoryItemName | nvarchar(500) |  |  |
| 13 | TurnOverAmount | decimal(18,4) | NN |  |
| 14 | TaxRate | decimal(18,4) |  |  |
| 15 | TaxAmount | decimal(18,4) | NN |  |
| 16 | Note | nvarchar(255) |  |  |
| 17 | SortOrder | int | NN |  |
| 18 | VoucherRefType | int |  |  |
| 19 | VoucherRefNo | nvarchar(20) |  |  |
| 20 | VoucherBranchID | uniqueidentifier |  |  |
| 21 | AccountObjectAddress | nvarchar(400) |  |  |
| 22 | AccountNumber | nvarchar(20) |  |  |
| 23 | GroupName | nvarchar(50) | NN |  |
| 24 | PurchasePurposeCode | nvarchar(20) |  |  |
| 25 | VoucherRefIDString | nvarchar(MAX) |  |  |
| 26 | AccountObjectID | uniqueidentifier |  |  |
| 27 | OriginRefType | int |  |  |
| 28 | OriginRefID | uniqueidentifier |  |  |
| 29 | InvestmentProjectID | uniqueidentifier |  |  |
| 30 | InvestmentProjectCode | nvarchar(12) |  |  |
| 31 | IsVoucherImport | bit |  |  |

## TA_012GTGT_DetailVoucher

Rows: 0 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | TA012GTGTDetailVoucherID | uniqueidentifier | PK NN |  |
| 2 | RefDetailID | uniqueidentifier | NN | TA_012GTGT_Detail.RefDetailID |
| 3 | VoucherRefDetailID | uniqueidentifier |  |  |
| 4 | RefID | uniqueidentifier |  |  |

## TA_012GTGT_Detail_Valid

Rows: 0 | Columns: 28

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | AppendixID | uniqueidentifier | NN |  |
| 4 | VoucherRefID | uniqueidentifier |  |  |
| 5 | VoucherRefDetailID | uniqueidentifier |  |  |
| 6 | InvoiceTemplate | nvarchar(25) |  |  |
| 7 | InvSeries | nvarchar(20) |  |  |
| 8 | InvNo | nvarchar(25) |  |  |
| 9 | InvDate | datetime |  |  |
| 10 | AccountObjectName | nvarchar(400) |  |  |
| 11 | CompanyTaxCode | nvarchar(50) |  |  |
| 12 | InventoryItemName | nvarchar(500) |  |  |
| 13 | TurnOverAmount | decimal(18,4) | NN |  |
| 14 | TaxRate | decimal(18,4) |  |  |
| 15 | TaxAmount | decimal(18,4) | NN |  |
| 16 | Note | nvarchar(255) |  |  |
| 17 | SortOrder | int | NN |  |
| 18 | VoucherRefType | int |  |  |
| 19 | VoucherRefNo | nvarchar(20) |  |  |
| 20 | VoucherBranchID | uniqueidentifier |  |  |
| 21 | AccountObjectAddress | nvarchar(400) |  |  |
| 22 | AccountNumber | nvarchar(20) |  |  |
| 23 | GroupName | nvarchar(50) | NN |  |
| 24 | PurchasePurposeCode | nvarchar(20) |  |  |
| 25 | VoucherRefIDString | nvarchar(MAX) |  |  |
| 26 | AccountObjectID | uniqueidentifier |  |  |
| 27 | InvestmentProjectID | uniqueidentifier |  |  |
| 28 | InvestmentProjectCode | nvarchar(12) |  |  |

## TA_012TTDB_Detail

Rows: 0 | Columns: 17

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | AppendixID | uniqueidentifier | NN | TADeclarationAppendix.AppendixID |
| 4 | InvSeries | nvarchar(20) |  |  |
| 5 | InvNo | nvarchar(25) |  |  |
| 6 | InvDate | datetime |  |  |
| 7 | InventoryItemName | nvarchar(500) |  |  |
| 8 | Quantity | decimal(22,8) |  |  |
| 9 | SpecialTaxAmount | decimal(18,4) |  |  |
| 10 | SpecialTaxAmountOnUnit | decimal(18,4) |  |  |
| 11 | DeductTaxAmount | decimal(18,4) |  |  |
| 12 | RemainingTaxAmount | decimal(18,4) |  |  |
| 13 | ProductName | nvarchar(255) |  |  |
| 14 | QuantityOnUnit | decimal(22,8) |  |  |
| 15 | GroupName | nvarchar(50) | NN |  |
| 16 | SortOrder | int |  |  |
| 17 | TotalDeductSpecialTaxAmount | decimal(18,4) |  |  |

## TA_012TTDB_Detail_TT80

Rows: 0 | Columns: 20

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | AppendixID | uniqueidentifier | NN | TADeclarationAppendix.AppendixID |
| 4 | InvSeries | nvarchar(20) |  |  |
| 5 | InvNo | nvarchar(25) |  |  |
| 6 | InvDate | datetime |  |  |
| 7 | InventoryItemName | nvarchar(500) |  |  |
| 8 | Unit | nvarchar(20) |  |  |
| 9 | Quantity | decimal(22,8) |  |  |
| 10 | QuantityConsumedPeriod | decimal(22,8) |  |  |
| 11 | SpecialTaxAmount | decimal(22,8) |  |  |
| 12 | SpecialTaxAmountOnUnit | decimal(22,8) |  |  |
| 13 | DeductTaxAmount | decimal(22,8) |  |  |
| 14 | RemainingTaxAmount | decimal(22,8) |  |  |
| 15 | ProductName | nvarchar(255) |  |  |
| 16 | QuantityOnUnit | decimal(22,8) |  |  |
| 17 | TotalDeductSpecialTaxAmount | decimal(22,8) |  |  |
| 18 | DeductSpecialTaxNextPeriodAmount | decimal(22,8) |  |  |
| 19 | GroupName | nvarchar(50) | NN |  |
| 20 | SortOrder | int |  |  |

## TA_015GTGT_Detail

Rows: 0 | Columns: 13

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | AppendixID | uniqueidentifier | NN | TADeclarationAppendix.AppendixID |
| 4 | ItemTaxNo | nvarchar(50) |  |  |
| 5 | ItemTaxDate | datetime |  |  |
| 6 | TaxAddress | nvarchar(255) |  |  |
| 7 | TaxOffice | nvarchar(255) |  |  |
| 8 | TaxAmount | decimal(18,4) |  |  |
| 9 | SortOrder | int |  |  |
| 10 | TaxCompanyID | nvarchar(25) |  |  |
| 11 | TaxCompanyName | nvarchar(255) |  |  |
| 12 | TaxCompanyDecisionID | nvarchar(25) |  |  |
| 13 | TaxCompanyDecisionName | nvarchar(255) |  |  |

## TA_016GTGT_Detail

Rows: 0 | Columns: 22

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | AppendixID | uniqueidentifier | NN | TADeclarationAppendix.AppendixID |
| 4 | SortOrder | int | NN |  |
| 5 | FactoryName | nvarchar(255) |  |  |
| 6 | TaxCode | nvarchar(50) |  |  |
| 7 | TaxOffice | nvarchar(255) |  |  |
| 8 | BranchTaxOffice | nvarchar(255) |  |  |
| 9 | TurnoverAmount5 | decimal(18,4) | NN |  |
| 10 | TurnoverAmount10 | decimal(18,4) | NN |  |
| 11 | TotalTurnoverAmount | decimal(18,4) | NN |  |
| 12 | TaxableAmount | decimal(18,4) | NN |  |
| 13 | TaxableAmount6LessThan16 | decimal(18,4) | NN |  |
| 14 | TaxOfficeID | nvarchar(25) |  |  |
| 15 | BranchTaxOfficeID | nvarchar(25) |  |  |
| 16 | GroupName | nvarchar(50) |  |  |
| 17 | DistrictID | nvarchar(255) |  |  |
| 18 | District | nvarchar(255) |  |  |
| 19 | ProvinceOrCityID | nvarchar(255) |  |  |
| 20 | ProvinceOrCity | nvarchar(255) |  |  |
| 21 | WardOrCommuneID | nvarchar(100) |  |  |
| 22 | WardOrCommune | nvarchar(255) |  |  |

## TA_017GTGT_Detail

Rows: 0 | Columns: 12

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | AppendixID | uniqueidentifier | NN | TADeclarationAppendix.AppendixID |
| 4 | ProjectWorkName | nvarchar(255) |  |  |
| 5 | SaleAmount | decimal(18,4) |  |  |
| 6 | AllocationRate | decimal(18,4) |  |  |
| 7 | TaxAmount | decimal(18,4) |  |  |
| 8 | SortOrder | int |  |  |
| 9 | TaxCompanyID | nvarchar(25) |  |  |
| 10 | TaxCompanyName | nvarchar(255) |  |  |
| 11 | TaxCompanyDecisionID | nvarchar(25) |  |  |
| 12 | TaxCompanyDecisionName | nvarchar(255) |  |  |

## TA_01TTDB_Detail

Rows: 0 | Columns: 16

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | AppendixID | uniqueidentifier | NN | TADeclarationAppendix.AppendixID |
| 4 | SortOrder | int |  |  |
| 5 | ItemCode | nvarchar(20) |  |  |
| 6 | ItemName | nvarchar(255) |  |  |
| 7 | Unit | nvarchar(20) |  |  |
| 8 | Quantity | decimal(22,8) |  |  |
| 9 | TurnOverAmount | decimal(18,4) |  |  |
| 10 | SpecialTaxTurnOverAmount | decimal(18,4) |  |  |
| 11 | TaxRate | decimal(18,4) |  |  |
| 12 | SpecialTaxDeductionAmount | decimal(18,4) |  |  |
| 13 | SpecialTaxAmount | decimal(18,4) |  |  |
| 14 | GroupName | nvarchar(50) |  |  |
| 15 | OffsetTaxAmount | decimal(18,4) |  |  |
| 16 | RemainingSpecialTaxAmount | decimal(18,4) |  |  |

## TA_01_GTGTDeclaration

Rows: 0 | Columns: 44

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefType | int |  |  |
| 3 | DeclarationTerm | int | NN |  |
| 4 | TAMonth | int | NN |  |
| 5 | TAYear | int | NN |  |
| 6 | BranchID | uniqueidentifier |  |  |
| 7 | TemplateNo | nvarchar(100) |  |  |
| 8 | IsAddition | bit | NN |  |
| 9 | AdditionTime | int | NN |  |
| 10 | FromDate | datetime |  |  |
| 11 | ToDate | datetime |  |  |
| 12 | IsExtension | bit |  |  |
| 13 | ExtendReasonType | nvarchar(5) |  |  |
| 14 | IndustryType | int |  |  |
| 15 | TaxAgentEmployee | nvarchar(128) |  |  |
| 16 | TaxAgentNo | nvarchar(50) |  |  |
| 17 | Signer | nvarchar(128) |  |  |
| 18 | SignDate | datetime |  |  |
| 19 | AdjustDate | datetime |  |  |
| 20 | LateDays | int |  |  |
| 21 | LateAmount | decimal(18,4) |  |  |
| 22 | DescriptionLateAmount | decimal(18,4) |  |  |
| 23 | DescriptionNo | nvarchar(25) |  |  |
| 24 | DescriptionDate | datetime |  |  |
| 25 | TaxCompanyID | nvarchar(25) |  |  |
| 26 | TaxCompanyName | nvarchar(128) |  |  |
| 27 | TaxCompanyDecisionID | nvarchar(25) |  |  |
| 28 | TaxCompanyDecisionName | nvarchar(128) |  |  |
| 29 | DescriptionDayReceive | int |  |  |
| 30 | TaxAmountRedemption | decimal(18,4) |  |  |
| 31 | AdjustDescription | nvarchar(255) |  |  |
| 32 | TA_013GTGT_JournalMemo | nvarchar(500) |  |  |
| 33 | IsExistPL011GTGT | bit |  |  |
| 34 | IsExistPL012GTGT | bit |  |  |
| 35 | IsExistPL013GTGT | bit |  |  |
| 36 | IsExistPL014aGTGT | bit |  |  |
| 37 | IsExistPL014bGTGT | bit |  |  |
| 38 | IsExistPL015GTGT | bit |  |  |
| 39 | IsExistPL016GTGT | bit |  |  |
| 40 | IsExistPL017GTGT | bit |  |  |
| 41 | CreatedDate | datetime |  |  |
| 42 | CreatedBy | nvarchar(50) |  |  |
| 43 | ModifiedDate | datetime |  |  |
| 44 | ModifiedBy | nvarchar(50) |  |  |

## TA_01_TBVMTDetail

Rows: 0 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | TADeclaration.RefID |
| 3 | AppendixID | uniqueidentifier | NN |  |
| 4 | SortOrder | int | NN |  |
| 5 | InventoryItemName | nvarchar(500) |  |  |
| 6 | Unit | nvarchar(20) |  |  |
| 7 | Quantity | decimal(22,8) | NN |  |
| 8 | TaxAmountLevel | decimal(18,4) | NN |  |
| 9 | TaxAmount | decimal(18,4) | NN |  |
| 10 | GroupName | nvarchar(50) | NN |  |

## TA_02GTGT_AppendixDetail

Rows: 0 | Columns: 29

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | AppendixID | uniqueidentifier | NN | TADeclarationAppendix.AppendixID |
| 4 | VoucherRefID | uniqueidentifier |  |  |
| 5 | VoucherRefDetailID | uniqueidentifier |  |  |
| 8 | InvNo | nvarchar(25) |  |  |
| 9 | InvDate | datetime |  |  |
| 10 | AccountObjectName | nvarchar(400) |  |  |
| 11 | CompanyTaxCode | nvarchar(50) |  |  |
| 13 | TurnOverAmount | decimal(18,4) | NN |  |
| 15 | TaxAmount | decimal(18,4) | NN |  |
| 16 | Note | nvarchar(255) |  |  |
| 17 | GroupName | nvarchar(50) |  |  |
| 18 | SortOrder | int | NN |  |
| 19 | PurchasePurposeID | uniqueidentifier |  |  |
| 20 | VoucherRefType | int |  |  |
| 21 | VoucherRefNo | nvarchar(20) |  |  |
| 22 | VoucherBranchID | uniqueidentifier |  |  |
| 23 | AccountObjectAddress | nvarchar(400) |  |  |
| 24 | AccountNumber | nvarchar(20) |  |  |
| 25 | TaxRate | decimal(18,4) |  |  |
| 26 | InvTemplateNo | nvarchar(50) |  |  |
| 27 | InvSeries | nvarchar(50) |  |  |
| 28 | VoucherRefIDString | nvarchar(MAX) |  |  |
| 29 | AccountObjectID | uniqueidentifier |  |  |
| 30 | OriginRefType | int |  |  |
| 31 | OriginRefID | uniqueidentifier |  |  |
| 32 | InvestmentProjectID | uniqueidentifier |  |  |
| 33 | IsVoucherImport | bit |  |  |

## TA_02GTGT_AppendixDetailVoucher

Rows: 0 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | TA012GTGTDetailVoucherID | uniqueidentifier | PK NN |  |
| 2 | RefDetailID | uniqueidentifier | NN |  |
| 3 | VoucherRefDetailID | uniqueidentifier |  |  |
| 4 | RefID | uniqueidentifier |  |  |

## TA_02GTGT_AppendixDetail_Valid

Rows: 0 | Columns: 26

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | AppendixID | uniqueidentifier | NN |  |
| 4 | VoucherRefID | uniqueidentifier |  |  |
| 5 | VoucherRefDetailID | uniqueidentifier |  |  |
| 6 | InvNo | nvarchar(25) |  |  |
| 7 | InvDate | datetime |  |  |
| 8 | AccountObjectName | nvarchar(400) |  |  |
| 9 | CompanyTaxCode | nvarchar(50) |  |  |
| 10 | TurnOverAmount | decimal(18,4) | NN |  |
| 11 | TaxAmount | decimal(18,4) | NN |  |
| 12 | Note | nvarchar(255) |  |  |
| 13 | GroupName | nvarchar(50) |  |  |
| 14 | SortOrder | int | NN |  |
| 15 | PurchasePurposeID | uniqueidentifier |  |  |
| 16 | VoucherRefType | int |  |  |
| 17 | VoucherRefNo | nvarchar(20) |  |  |
| 18 | VoucherBranchID | uniqueidentifier |  |  |
| 19 | AccountObjectAddress | nvarchar(400) |  |  |
| 20 | AccountNumber | nvarchar(20) |  |  |
| 21 | TaxRate | decimal(18,4) |  |  |
| 22 | InvTemplateNo | nvarchar(50) |  |  |
| 23 | InvSeries | nvarchar(50) |  |  |
| 24 | VoucherRefIDString | nvarchar(MAX) |  |  |
| 25 | AccountObjectID | uniqueidentifier |  |  |
| 26 | InvestmentProjectID | uniqueidentifier |  |  |

## TA_02_GTGT_AdjustmentDetail

Rows: 0 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | DescriptionName | nvarchar(255) |  |  |
| 4 | Code | nvarchar(20) |  |  |
| 5 | OrgAmount | decimal(18,4) | NN |  |
| 6 | AdjustAmount | decimal(18,4) | NN |  |
| 7 | DiffAmount | decimal(18,4) |  |  |
| 8 | Part | nvarchar(255) |  |  |
| 9 | SortOrder | int | NN |  |

## TA_03GTGT_Detail

Rows: 0 | Columns: 21

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | TADeclaration.RefID |
| 3 | VoucherRefID | uniqueidentifier |  |  |
| 4 | VoucherRefType | int |  |  |
| 5 | VoucherRefDate | datetime |  |  |
| 7 | VoucherRefNo | nvarchar(MAX) |  |  |
| 8 | VoucherBranchID | uniqueidentifier |  |  |
| 9 | InvoiceTemplate | nvarchar(25) |  |  |
| 10 | InvSeries | nvarchar(20) |  |  |
| 11 | InvNo | nvarchar(25) |  |  |
| 12 | InvDate | datetime |  |  |
| 13 | JournalMemo | nvarchar(500) |  |  |
| 14 | AccountObjectID | uniqueidentifier |  |  |
| 15 | AccountObjectName | nvarchar(400) |  |  |
| 16 | AccountObjectCode | nvarchar(50) |  |  |
| 17 | AccountObjectAddress | nvarchar(400) |  |  |
| 18 | Amount | decimal(18,4) | NN |  |
| 19 | IsRevenue | bit |  |  |
| 20 | SortOrder | int | NN |  |
| 21 | VoucherPostedDate | datetime |  |  |
| 22 | InvoiceRefID | uniqueidentifier |  |  |

## TA_03TNDN_114Detail

Rows: 0 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | AppendixID | uniqueidentifier | NN | TADeclarationAppendix.AppendixID |
| 4 | ItemCode | nvarchar(50) | NN |  |
| 5 | ItemName | nvarchar(255) |  |  |
| 6 | DataType | int |  |  |
| 7 | Value | nvarchar(50) |  |  |

## TA_03TNDN_1ADetail

Rows: 0 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | AppendixID | uniqueidentifier | NN | TADeclarationAppendix.AppendixID |
| 4 | ItemCode | nvarchar(50) | NN |  |
| 5 | ItemName | nvarchar(255) |  |  |
| 6 | DataType | int |  |  |
| 7 | Value | nvarchar(50) |  |  |

## TA_03TNDN_2ADetail

Rows: 0 | Columns: 11

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | AppendixID | uniqueidentifier | NN | TADeclarationAppendix.AppendixID |
| 4 | TAYear | int |  |  |
| 5 | LostAmount | decimal(18,4) |  |  |
| 6 | LostAmountTranfer | decimal(18,4) |  |  |
| 7 | LostAmountCurrentTranfer | decimal(18,4) |  |  |
| 8 | LostAmountRemain | decimal(18,4) |  |  |
| 9 | GroupName | nvarchar(50) |  |  |
| 10 | SortOrder | int |  |  |
| 11 | LostAmountNextTransfer | decimal(18,4) |  |  |

## TA_03TNDN_5Detail

Rows: 0 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | AppendixID | uniqueidentifier | NN | TADeclarationAppendix.AppendixID |
| 4 | ItemCode | nvarchar(50) | NN |  |
| 5 | ItemName | nvarchar(255) |  |  |
| 6 | DataType | int |  |  |
| 7 | Value | nvarchar(50) |  |  |

## TA_03TNDN_8Detail

Rows: 0 | Columns: 25

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier |  |  |
| 3 | AppendixID | uniqueidentifier |  | TADeclarationAppendix.AppendixID |
| 4 | SortOrder | int |  |  |
| 5 | ItemTypeCode | nvarchar(20) |  |  |
| 6 | ItemTypeName | nvarchar(150) |  |  |
| 7 | ItemName | nvarchar(100) |  |  |
| 8 | TaxCode | nvarchar(50) |  |  |
| 9 | DistrictID | nvarchar(50) |  |  |
| 10 | DistrictName | nvarchar(255) |  |  |
| 11 | ProvinceID | nvarchar(50) |  |  |
| 12 | ProvinceName | nvarchar(255) |  |  |
| 13 | TaxOfficeBranchID | nvarchar(50) |  |  |
| 14 | TaxOfficeBranchName | nvarchar(255) |  |  |
| 15 | ExpenseAmount | decimal(18,4) | NN |  |
| 16 | AllocationRate | decimal(18,4) | NN |  |
| 17 | TaxAmount | decimal(18,4) | NN |  |
| 18 | PriorTaxAmount | decimal(18,4) | NN |  |
| 19 | PaidTaxAmount | decimal(18,4) | NN |  |
| 20 | DiffTaxAmount | decimal(18,4) | NN |  |
| 21 | RemainingTaxAmount | decimal(18,4) | NN |  |
| 22 | WardOrCommuneID | nvarchar(100) |  |  |
| 23 | WardOrCommune | nvarchar(255) |  |  |
| 24 | TaxCompanyID | nvarchar(100) |  |  |
| 25 | TaxCompanyName | nvarchar(255) |  |  |

## TA_03TNDN_92Detail

Rows: 0 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier |  |  |
| 3 | AppendixID | uniqueidentifier |  | TADeclarationAppendix.AppendixID |
| 4 | ItemCode | nvarchar(50) |  |  |
| 5 | ItemName | nvarchar(255) |  |  |
| 6 | DataType | int |  |  |
| 7 | Value | nvarchar(50) |  |  |

## TA_03_TNDN_Document

Rows: 0 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | TADeclaration.RefID |
| 3 | AppendixID | uniqueidentifier | NN |  |
| 4 | ItemName | nvarchar(255) |  |  |
| 5 | SortOrder | int |  |  |
| 6 | ItemCode | nvarchar(50) |  |  |
| 7 | Amount | decimal(18,4) |  |  |

## TA_041GTGT_Detail

Rows: 0 | Columns: 25

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | AppendixID | uniqueidentifier | NN | TADeclarationAppendix.AppendixID |
| 4 | VoucherRefID | uniqueidentifier |  |  |
| 5 | VoucherRefDetailID | uniqueidentifier |  |  |
| 6 | InvoiceTemplate | nvarchar(25) |  |  |
| 7 | InvSeries | nvarchar(20) |  |  |
| 8 | InvNo | nvarchar(25) |  |  |
| 9 | InvDate | datetime |  |  |
| 10 | AccountObjectName | nvarchar(400) |  |  |
| 11 | CompanyTaxCode | nvarchar(50) |  |  |
| 12 | InventoryItemName | nvarchar(500) |  |  |
| 13 | TurnOverAmount | decimal(18,4) | NN |  |
| 14 | Note | nvarchar(255) |  |  |
| 15 | GroupName | nvarchar(50) | NN |  |
| 16 | SortOrder | int | NN |  |
| 17 | VoucherRefType | int |  |  |
| 18 | VoucherRefNo | nvarchar(20) |  |  |
| 19 | VoucherBranchID | uniqueidentifier |  |  |
| 20 | AccountObjectAddress | nvarchar(400) |  |  |
| 21 | AccountNumber | nvarchar(20) |  |  |
| 22 | VoucherRefIDString | nvarchar(MAX) |  |  |
| 23 | IsReductionInvoice | bit |  |  |
| 24 | DeductionsTaxAmount | decimal(18,4) |  |  |
| 25 | ToolClickType | int | NN |  |

## TA_042GTGT_Detail

Rows: 0 | Columns: 14

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier |  | TADeclaration.RefID |
| 3 | AppendixID | uniqueidentifier |  |  |
| 4 | ItemName | nvarchar(255) |  |  |
| 5 | AmountWithoutVAT | decimal(18,4) | NN |  |
| 6 | VATRate | decimal(18,4) |  |  |
| 7 | Amount | decimal(18,4) | NN |  |
| 8 | SortOrder | varchar(5) |  |  |
| 9 | IsDeleted | bit | NN |  |
| 10 | CreatedBy | nvarchar(100) |  |  |
| 11 | CreatedDate | datetime |  |  |
| 12 | ModifiedBy | nvarchar(100) |  |  |
| 13 | ModifiedDate | datetime |  |  |
| 14 | GroupName | nvarchar(50) |  |  |

## TA_05QTTNCN01_Detail

Rows: 0 | Columns: 26

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | AppendixID | uniqueidentifier | NN | TADeclarationAppendix.AppendixID |
| 4 | Col06 | int | NN |  |
| 5 | Col07 | nvarchar(255) |  |  |
| 6 | Col08 | nvarchar(255) |  |  |
| 7 | Col09 | nvarchar(255) |  |  |
| 8 | Col10 | bit | NN |  |
| 9 | Col11 | decimal(18,4) | NN |  |
| 10 | Col12 | decimal(18,4) | NN |  |
| 11 | Col13 | decimal(18,4) | NN |  |
| 12 | Col14 | decimal(18,4) | NN |  |
| 13 | Col15 | decimal(18,4) | NN |  |
| 14 | Col16 | decimal(18,4) | NN |  |
| 15 | Col17 | decimal(18,4) | NN |  |
| 16 | Col18 | decimal(18,4) | NN |  |
| 17 | Col19 | decimal(18,4) | NN |  |
| 18 | Col20 | decimal(18,4) | NN |  |
| 19 | Col21 | decimal(18,4) | NN |  |
| 20 | IsForeigner | bit | NN |  |
| 21 | Col22 | decimal(18,4) | NN |  |
| 22 | Col23 | decimal(18,4) | NN |  |
| 23 | Col24 | decimal(18,4) | NN |  |
| 24 | SortOrder | int | NN |  |
| 25 | FamilyCoditionDeductionAmount | decimal(18,4) | NN |  |
| 26 | ReduceSelfTaxAmount | decimal(18,4) | NN |  |

## TA_05QTTNCN01_Detail_TT80

Rows: 0 | Columns: 31

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | AppendixID | uniqueidentifier | NN | TADeclarationAppendix.AppendixID |
| 4 | Col06 | int | NN |  |
| 5 | Col07 | nvarchar(255) |  |  |
| 6 | Col08 | nvarchar(255) |  |  |
| 7 | Col09 | nvarchar(255) |  |  |
| 8 | Col10 | bit | NN |  |
| 9 | Col12 | decimal(18,4) | NN |  |
| 10 | Col13 | decimal(18,4) | NN |  |
| 11 | Col14 | decimal(18,4) | NN |  |
| 12 | Col15 | decimal(18,4) | NN |  |
| 13 | Col16 | decimal(18,4) | NN |  |
| 14 | Col17 | decimal(18,4) | NN |  |
| 15 | Col18 | decimal(18,4) | NN |  |
| 16 | Col19 | decimal(18,4) | NN |  |
| 17 | Col20 | decimal(18,4) | NN |  |
| 18 | Col21 | decimal(18,4) | NN |  |
| 19 | IsForeigner | bit | NN |  |
| 20 | Col22 | decimal(18,4) | NN |  |
| 21 | Col23 | decimal(18,4) | NN |  |
| 22 | Col24 | decimal(18,4) | NN |  |
| 23 | Col25 | decimal(18,4) | NN |  |
| 24 | Col26 | decimal(18,4) | NN |  |
| 25 | Col27 | bit | NN |  |
| 26 | SortOrder | int | NN |  |
| 27 | FamilyCoditionDeductionAmount | decimal(18,4) | NN |  |
| 28 | ReduceSelfTaxAmount | decimal(18,4) | NN |  |
| 29 | Col09a | nvarchar(255) |  |  |
| 30 | NoIdentifier | bit | NN |  |
| 31 | Col151 | decimal(18,4) | NN |  |

## TA_05QTTNCN02_Detail

Rows: 0 | Columns: 16

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | AppendixID | uniqueidentifier | NN | TADeclarationAppendix.AppendixID |
| 4 | Col06 | int | NN |  |
| 5 | Col07 | nvarchar(255) |  |  |
| 6 | Col08 | nvarchar(255) |  |  |
| 7 | Col09 | nvarchar(255) |  |  |
| 8 | Col10 | bit | NN |  |
| 9 | Col11 | decimal(18,4) | NN |  |
| 10 | Col12 | decimal(18,4) | NN |  |
| 11 | Col13 | decimal(18,4) | NN |  |
| 12 | Col14 | decimal(18,4) | NN |  |
| 13 | Col15 | decimal(18,4) | NN |  |
| 14 | Col16 | decimal(18,4) | NN |  |
| 15 | Col17 | decimal(18,4) | NN |  |
| 16 | SortOrder | int | NN |  |

## TA_05QTTNCN02_Detail_TT80

Rows: 0 | Columns: 18

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | AppendixID | uniqueidentifier | NN | TADeclarationAppendix.AppendixID |
| 4 | Col06 | int | NN |  |
| 5 | Col07 | nvarchar(255) |  |  |
| 6 | Col08 | nvarchar(255) |  |  |
| 7 | Col09 | nvarchar(255) |  |  |
| 8 | Col10 | bit | NN |  |
| 9 | Col11 | decimal(18,4) | NN |  |
| 10 | Col12 | decimal(18,4) | NN |  |
| 11 | Col13 | decimal(18,4) | NN |  |
| 12 | Col14 | decimal(18,4) | NN |  |
| 13 | Col15 | decimal(18,4) | NN |  |
| 14 | Col16 | decimal(18,4) | NN |  |
| 15 | SortOrder | int | NN |  |
| 16 | Col09a | nvarchar(255) |  |  |
| 17 | NoIdentifier | bit | NN |  |
| 18 | Col141 | decimal(18,4) | NN |  |

## TA_05QTTNCN03_Detail

Rows: 0 | Columns: 24

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | AppendixID | uniqueidentifier | NN | TADeclarationAppendix.AppendixID |
| 4 | Col06 | int | NN |  |
| 5 | Col07 | nvarchar(255) |  |  |
| 6 | Col08 | nvarchar(255) |  |  |
| 7 | Col09 | nvarchar(255) |  |  |
| 8 | Col10 | datetime |  |  |
| 9 | Col11 | nvarchar(255) |  |  |
| 10 | Col12 | nvarchar(255) |  |  |
| 11 | Col13 | nvarchar(255) |  |  |
| 12 | Col14 | nvarchar(255) |  |  |
| 13 | Col15 | nvarchar(255) |  |  |
| 14 | Col16 | nvarchar(255) |  |  |
| 15 | Col17 | nvarchar(255) |  |  |
| 16 | Col18 | nvarchar(255) |  |  |
| 17 | Col19 | nvarchar(255) |  |  |
| 18 | Col20 | nvarchar(255) |  |  |
| 19 | Col21 | date |  |  |
| 20 | Col22 | date |  |  |
| 21 | SortOrder | int | NN |  |
| 22 | FromDate | date |  |  |
| 23 | ToDate | date |  |  |
| 24 | ReduceDependTaxAmount | decimal(18,4) | NN |  |

## TA_05QTTNCN03_Detail_TT80

Rows: 0 | Columns: 19

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | AppendixID | uniqueidentifier | NN | TADeclarationAppendix.AppendixID |
| 4 | Col06 | int | NN |  |
| 5 | Col07 | nvarchar(255) |  |  |
| 6 | Col08 | nvarchar(255) |  |  |
| 7 | Col09 | nvarchar(255) |  |  |
| 8 | Col10 | datetime |  |  |
| 9 | Col11 | nvarchar(255) |  |  |
| 10 | Col12 | nvarchar(255) |  |  |
| 11 | Col13 | nvarchar(255) |  |  |
| 12 | Col14 | nvarchar(255) |  |  |
| 13 | Col15 | date |  |  |
| 14 | Col16 | date |  |  |
| 15 | SortOrder | int | NN |  |
| 16 | FromDate | date |  |  |
| 17 | ToDate | date |  |  |
| 18 | ReduceDependTaxAmount | decimal(18,4) | NN |  |
| 19 | NoIdentifier | bit | NN |  |

## TA_BC26AC_InvoiceStatement

Rows: 0 | Columns: 16

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefType | int |  |  |
| 3 | TemplateNo | nvarchar(100) |  |  |
| 4 | TAVATQuarter | int | NN |  |
| 5 | TAVATYear | int | NN |  |
| 6 | FromDate | datetime |  |  |
| 7 | ToDate | datetime |  |  |
| 8 | BranchID | uniqueidentifier |  |  |
| 9 | CreatedDate | datetime |  |  |
| 10 | CreatedBy | nvarchar(50) |  |  |
| 11 | ModifiedDate | datetime |  |  |
| 12 | ModifiedBy | nvarchar(50) |  |  |
| 13 | Circular | nvarchar(50) |  |  |
| 14 | Reporter | nvarchar(255) |  |  |
| 15 | Signer | nvarchar(255) |  |  |
| 16 | SignDate | datetime |  |  |

## TA_BC26AC_InvoiceStatement_Detail

Rows: 0 | Columns: 26

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | TA_BC26AC_InvoiceStatement.RefID |
| 3 | InvTypeID | int |  |  |
| 4 | InvTypeName | nvarchar(255) |  |  |
| 5 | InvoiceTemplate | nvarchar(20) |  |  |
| 6 | InvSeries | nvarchar(20) |  |  |
| 7 | TotalOpenQuantity | decimal(18,0) |  |  |
| 8 | OpeningFromInvNo | nvarchar(25) |  |  |
| 9 | OpeningToInvNo | nvarchar(25) |  |  |
| 10 | IssueFromInvNo | nvarchar(25) |  |  |
| 11 | IssueToInvNo | nvarchar(25) |  |  |
| 12 | TotalUsedFromInvNo | nvarchar(25) |  |  |
| 13 | TotalUsedToInvNo | nvarchar(25) |  |  |
| 14 | TotalUsedQuantity | decimal(18,0) |  |  |
| 15 | UsedQuantity | decimal(18,0) |  |  |
| 16 | DeletedQuantity | decimal(18,0) |  |  |
| 17 | DeletedInvNo | nvarchar(4000) |  |  |
| 18 | LostQuantity | decimal(18,0) |  |  |
| 19 | LostInvNo | nvarchar(4000) |  |  |
| 20 | CancelQuantity | decimal(18,0) |  |  |
| 21 | CancelInvNo | nvarchar(4000) |  |  |
| 22 | ClosingFromInvNo | nvarchar(20) |  |  |
| 23 | ClosingToInvNo | nvarchar(20) |  |  |
| 24 | TotalClosingQuantity | decimal(18,0) |  |  |
| 25 | SortOrder | int | NN ID |  |
| 26 | InvTypeCode | nvarchar(25) |  |  |

## TA_PL142_MV

Rows: 0 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | NN |  |
| 2 | RefDetailID | uniqueidentifier | PK NN |  |
| 3 | AppendixID | uniqueidentifier |  | TADeclarationAppendix.AppendixID |
| 4 | Description | nvarchar(500) |  |  |
| 5 | TurnOverAmount | decimal(22,8) |  |  |
| 6 | TaxAmount | decimal(22,8) |  |  |
| 7 | GroupName | nvarchar(50) |  |  |
| 8 | SortOrder | int |  |  |

## TA_PLII922021NDCP_Detail

Rows: 0 | Columns: 12

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | AppendixID | uniqueidentifier | NN | TADeclarationAppendix.AppendixID |
| 4 | TurnOverAmount | decimal(18,4) | NN |  |
| 5 | InventoryItemName | nvarchar(500) |  |  |
| 6 | ExportTaxRate | decimal(18,4) |  |  |
| 7 | TaxRate | decimal(18,4) |  |  |
| 8 | DeductionsTaxAmount | decimal(18,4) |  |  |
| 9 | GroupName | nvarchar(50) | NN |  |
| 10 | SortOrder | int | NN |  |
| 11 | HTKKName | nvarchar(500) |  |  |
| 12 | HTKKCode | nvarchar(50) |  |  |

## TA_TAINDetail

Rows: 0 | Columns: 18

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | TADeclaration.RefID |
| 3 | AppendixID | uniqueidentifier | NN |  |
| 4 | SortOrder | int | NN |  |
| 5 | ResourcesCategoryName | nvarchar(255) |  |  |
| 6 | Unit | nvarchar(20) |  |  |
| 7 | Output | decimal(18,4) | NN |  |
| 8 | UnitPrice | decimal(20,6) | NN |  |
| 9 | TaxRate | decimal(18,4) | NN |  |
| 10 | UnitTaxAmountLevel | decimal(18,4) | NN |  |
| 11 | TaxAmountMovement | decimal(18,4) | NN |  |
| 12 | TaxAmountDeductionExpectation | decimal(18,4) | NN |  |
| 13 | TaxAmount | decimal(18,4) | NN |  |
| 14 | PaidTaxAmount | decimal(18,4) |  |  |
| 15 | DiffAmount | decimal(18,4) |  |  |
| 16 | GroupName | nvarchar(50) | NN |  |
| 17 | ResourcesTaxTableCode | nvarchar(20) |  |  |
| 18 | SortOrderText | nvarchar(20) |  |  |

## TA_TNCN_051BKDetail

Rows: 0 | Columns: 23

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | AppendixID | uniqueidentifier | NN | TADeclarationAppendix.AppendixID |
| 4 | SortOrder | int |  |  |
| 5 | EmployeeName | nvarchar(128) |  |  |
| 6 | EmployeeTaxCode | nvarchar(20) |  |  |
| 7 | IdentificationNumber | nvarchar(20) |  |  |
| 8 | IsAuthorized | bit | NN |  |
| 9 | TotalTaxableIncome | decimal(18,4) | NN |  |
| 10 | TaxReduceByWorkInEconmicZone | decimal(18,4) | NN |  |
| 11 | TaxReduceByAgreement | decimal(18,4) | NN |  |
| 12 | FamilyConditionDeduction | decimal(18,4) | NN |  |
| 13 | HumanityDeduction | decimal(18,4) | NN |  |
| 14 | ForceInsuranceDeduction | decimal(18,4) | NN |  |
| 15 | RetireSpontaneousDeduction | decimal(18,4) | NN |  |
| 16 | TaxCalculationIncome | decimal(18,4) | NN |  |
| 17 | TaxIncomeDeducted | decimal(18,4) | NN |  |
| 18 | TaxIncomeDeductedByWorkInEZ | decimal(18,4) | NN |  |
| 19 | TaxIncomeMustDeduct | decimal(18,4) | NN |  |
| 20 | TotalTaxAmount | decimal(18,4) | NN |  |
| 21 | ExtraTaxAmount | decimal(18,4) | NN |  |
| 22 | TaxAmountMustDeduct | decimal(18,4) | NN |  |
| 23 | GroupName | nvarchar(50) | NN |  |

## TA_TNCN_052BKDetail

Rows: 0 | Columns: 14

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | AppendixID | uniqueidentifier | NN | TADeclarationAppendix.AppendixID |
| 4 | SortOrder | int |  |  |
| 5 | EmployeeName | nvarchar(128) |  |  |
| 6 | EmployeeTaxCode | nvarchar(20) |  |  |
| 7 | IdentificationNumber | nvarchar(20) |  |  |
| 8 | IsNotResidencePerson | bit | NN |  |
| 9 | TotalTaxableIncome | decimal(18,4) | NN |  |
| 10 | TaxReduceByWorkInEconmicZone | decimal(18,4) | NN |  |
| 11 | TaxReduceByAgreement | decimal(18,4) | NN |  |
| 12 | TaxIncomeDeducted | decimal(18,4) | NN |  |
| 13 | TaxIncomeDeductedByWorkInEZ | decimal(18,4) | NN |  |
| 14 | GroupName | nvarchar(50) | NN |  |

## TaxLocation

Rows: 3,357 | Columns: 12

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ID | int | PK NN ID |  |
| 2 | LocationID | nvarchar(20) |  |  |
| 3 | LocationName | nvarchar(255) |  |  |
| 4 | IsParent | bit |  |  |
| 5 | ParentID | nvarchar(20) |  |  |
| 6 | Grade | int |  |  |
| 7 | MisaCodeID | nvarchar(MAX) |  |  |
| 8 | SortOrder | int |  |  |
| 9 | CreatedBy | nvarchar(255) |  |  |
| 10 | CreatedDate | datetime |  |  |
| 11 | ModifiedBy | nvarchar(255) |  |  |
| 12 | ModifiedDate | datetime |  |  |

## TaxProcedureCode

Rows: 12 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReportTaxID | nvarchar(50) |  |  |
| 2 | Code | nvarchar(50) |  |  |
| 3 | Name | nvarchar(255) |  |  |
| 4 | FullName | nvarchar(500) |  |  |
| 5 | IsDefault | bit |  |  |
| 6 | IsAddition | bit |  |  |

## TaxRate

Rows: 0 | Columns: 2

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | TaxRateValue | decimal(18,4) | PK NN |  |
| 2 | TaxRateName | nvarchar(50) |  |  |

## TaxReductionInfo

Rows: 2 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | TaxReductionType | int | PK NN |  |
| 2 | TaxReductionDescription | nvarchar(255) |  |  |
| 3 | TaxReductionEnable | bit |  |  |
| 4 | FromDate | datetime |  |  |
| 5 | ToDate | datetime |  |  |
| 6 | SortOrder | int |  |  |

## TaxReturnVersion

Rows: 0 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | TaxReturnID | nvarchar(15) | PK NN |  |
| 2 | TaxReturnName | nvarchar(255) |  |  |
| 3 | TaxReturnVersionOfficial | nvarchar(15) |  |  |
| 4 | TaxReturnVersionAdditional | nvarchar(15) |  |  |
| 5 | SMEVersionOfficial | nvarchar(128) |  |  |
| 6 | SMEVersionAdditional | nvarchar(128) |  |  |
| 7 | ModifiedDate | datetime |  |  |

# 20 — SYS Hệ thống / cấu hình

## LicenseConfig

Rows: 1 | Columns: 24

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | LicenseID | uniqueidentifier | PK NN |  |
| 2 | LicenseNo | nvarchar(50) | NN |  |
| 3 | CompanyName | nvarchar(255) |  |  |
| 4 | BranchCode | nvarchar(20) |  |  |
| 5 | IsDefault | bit | NN |  |
| 6 | LicenseContent | nvarchar(MAX) |  |  |
| 7 | LastCheckingTime | datetime |  |  |
| 8 | ExpiredDate | datetime |  |  |
| 9 | IsSystem | bit |  |  |
| 10 | Inactive | bit |  |  |
| 11 | BranchID | uniqueidentifier |  |  |
| 12 | BranchName | nvarchar(255) |  |  |
| 13 | IsCandicateEncryption | nvarchar(255) |  |  |
| 14 | TokenKey | uniqueidentifier |  |  |
| 15 | PublicKey | nvarchar(MAX) |  |  |
| 16 | IsLicenseOnline | bit |  |  |
| 18 | TaxCode | nvarchar(50) |  |  |
| 19 | LicenseOnlineKey | nvarchar(255) |  |  |
| 20 | MessageUpdateLicense | nvarchar(MAX) |  |  |
| 21 | InactiveOnline | bit |  |  |
| 22 | ProductPackCode | int | NN |  |
| 23 | LicenseType | int | NN |  |
| 24 | NumberOfUse | int | NN |  |
| 25 | ProductLine | nvarchar(10) |  |  |

## LockObject

Rows: 1 | Columns: 2

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ObjectName | nvarchar(50) |  |  |
| 2 | LockValue | bigint |  |  |

## SYSAccountObjectLog

Rows: 64 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ID | uniqueidentifier | PK NN |  |
| 2 | OldObjectID | uniqueidentifier |  |  |
| 3 | NewObjectID | uniqueidentifier |  |  |
| 4 | LogTime | datetime |  |  |

## SYSAddNewDefaultValue

Rows: 101 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | DefaultID | uniqueidentifier | PK NN |  |
| 2 | DefaultCode | nvarchar(50) | NN |  |
| 3 | RefTypeList | nvarchar(255) |  |  |
| 4 | KeyList | nvarchar(MAX) | NN |  |
| 5 | DefaultValue | nvarchar(MAX) |  |  |
| 6 | UserID | uniqueidentifier |  |  |
| 7 | DisplayOnBook | int |  |  |

## SYSAutoID

Rows: 243 | Columns: 13

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | AutoID | uniqueidentifier | PK NN |  |
| 2 | RefTypeCategory | int | NN |  |
| 3 | RefTypeCategoryName | nvarchar(255) |  |  |
| 4 | Prefix | nvarchar(50) |  |  |
| 5 | Value | decimal(28,0) | NN |  |
| 6 | LengthOfValue | int | NN |  |
| 7 | Suffix | nvarchar(50) |  |  |
| 8 | BranchID | uniqueidentifier |  |  |
| 9 | CreatedDate | datetime |  |  |
| 10 | CreatedBy | nvarchar(50) |  |  |
| 11 | ModifiedDate | datetime |  |  |
| 12 | ModifiedBy | nvarchar(50) |  |  |
| 13 | DisplayOnBook | int |  |  |

## SYSBook

Rows: 3 | Columns: 2

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | DisplayOnBook | int | PK NN |  |
| 2 | DisplayOnBookName | nvarchar(50) |  |  |

## SYSBusinessScaleHiden

Rows: 24 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SYSBusinessScaleVisibleID | int | PK NN ID |  |
| 2 | OptionVisibleBusiness | nvarchar(100) | NN |  |
| 3 | BussinessScaleID | int | NN |  |

## SYSBusinessVisible

Rows: 162 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | UserOptionID | uniqueidentifier | PK NN |  |
| 3 | SubSystemCode | nvarchar(100) |  |  |
| 4 | SubSystemName | nvarchar(255) |  |  |
| 5 | ParentSubSystemCode | nvarchar(100) |  |  |
| 6 | Visible | bit | NN |  |
| 7 | SortOrder | int |  |  |
| 8 | ToolbarKeyReference | nvarchar(1000) |  |  |
| 9 | SidebarKeyReference | nvarchar(1000) |  |  |

## SYSClientVersion

Rows: 0 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ComputerName | nvarchar(100) | NN |  |
| 2 | FromVersion | nvarchar(20) |  |  |
| 3 | LastestVersion | nvarchar(20) | NN |  |

## SYSConfigForUpdateOutwardPrice

Rows: 58 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SYSConfigForUpdateOutwardPriceID | uniqueidentifier | PK NN |  |
| 2 | MasterTableName | nvarchar(100) | NN |  |
| 3 | DetailTableName | nvarchar(100) |  |  |
| 4 | ColumnNameInLedger | nvarchar(100) |  |  |
| 5 | ColumnNameInMaster | nvarchar(100) |  |  |
| 6 | ColumnNameInDetail | nvarchar(100) |  |  |
| 7 | InOutWardType | int | NN |  |
| 8 | PostToBookType | int | NN |  |

## SYSConvertMappingColumn

Rows: 7,317 | Columns: 13

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SYSConvertMappingColumnID | uniqueidentifier | PK NN |  |
| 2 | TargetTableName | nvarchar(100) | NN |  |
| 3 | TargetColumnName | nvarchar(100) | NN |  |
| 4 | ColumnConfigType | int | NN |  |
| 5 | Value | nvarchar(255) |  |  |
| 6 | ConvertOrder | int | NN |  |
| 7 | DefaultValue | nvarchar(255) |  |  |
| 8 | SourceCondition | nvarchar(255) |  |  |
| 9 | SourceTableName | nvarchar(100) | NN |  |
| 10 | Description | nvarchar(255) |  |  |
| 11 | TargetColumnDescription | nvarchar(MAX) |  |  |
| 12 | GetValueFromSourceOtherTable | int | NN |  |
| 13 | ConfigType | int | NN |  |

## SYSConvertMappingRefType

Rows: 165 | Columns: 17

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SYSConvertMappingRefTypeID | uniqueidentifier | PK NN |  |
| 2 | TargetRefType | int | NN |  |
| 3 | SourceRefType | nvarchar(100) |  |  |
| 4 | Description | nvarchar(255) |  |  |
| 5 | TargetTableName | nvarchar(100) |  |  |
| 6 | SourceTableName | nvarchar(100) |  |  |
| 7 | SourceCondition | nvarchar(MAX) |  |  |
| 8 | TableConfigType | int | NN |  |
| 9 | ReasonTypeID | int |  |  |
| 10 | SourceOtherTableName | nvarchar(100) |  |  |
| 11 | JoinCondition | nvarchar(MAX) |  |  |
| 12 | TargetCodeColumnName | nvarchar(100) |  |  |
| 13 | SourceCodeColumnDescription | nvarchar(100) |  |  |
| 14 | JoinConditionTemp | nvarchar(MAX) |  |  |
| 15 | JoinType | int | NN |  |
| 16 | DeleteTargetCondition | nvarchar(MAX) |  |  |
| 17 | ConfigType | int | NN |  |

## SYSConvertMappingTable

Rows: 221 | Columns: 15

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SYSConvertMappingTableID | uniqueidentifier | PK NN |  |
| 2 | TargetTableName | nvarchar(100) | NN |  |
| 4 | ConvertOrder | int | NN |  |
| 5 | TableConfigType | int | NN |  |
| 6 | Value | nvarchar(255) |  |  |
| 7 | SourceCondition | nvarchar(MAX) |  |  |
| 8 | Description | nvarchar(255) |  |  |
| 9 | SourceOtherTableName | nvarchar(100) |  |  |
| 10 | JoinCondition | nvarchar(MAX) |  |  |
| 11 | TargetCodeColumnName | nvarchar(100) |  |  |
| 12 | SourceCodeColumnDescription | nvarchar(100) |  |  |
| 13 | JoinConditionTemp | nvarchar(MAX) |  |  |
| 14 | JoinType | int | NN |  |
| 15 | DeleteTargetCondition | nvarchar(MAX) |  |  |
| 16 | ConfigType | int | NN |  |

## SYSConvertMappingValidate

Rows: 12 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SYSConvertMappingValidateID | uniqueidentifier | PK NN |  |
| 2 | ValidateType | int | NN |  |
| 3 | TargetTableName | nvarchar(100) |  |  |
| 4 | ExceptionMessage | nvarchar(MAX) |  |  |
| 5 | Description | nvarchar(MAX) | NN |  |
| 6 | SortOrder | int | NN |  |
| 7 | Example | nvarchar(MAX) |  |  |

## SYSConvertTempTable

Rows: 87 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SYSConvertTempTableID | uniqueidentifier | PK NN |  |
| 2 | TempTableName | nvarchar(100) | NN |  |
| 3 | Description | nvarchar(MAX) |  |  |
| 6 | TablePlusConfigType | int | NN |  |
| 8 | TempColumnListName | nvarchar(MAX) |  |  |
| 10 | ScriptGetDataFromSource | nvarchar(MAX) |  |  |
| 11 | SortOrder | int | NN |  |
| 12 | ScriptUpdateDataFromSource | nvarchar(MAX) |  |  |

## SYSConvertTempTableDetail

Rows: 533 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SYSConvertTempTableDetailID | uniqueidentifier | PK NN |  |
| 2 | TempTableName | nvarchar(100) |  |  |
| 3 | ColumnName | nvarchar(100) |  |  |
| 4 | DataType | nvarchar(100) |  |  |
| 5 | DefaultValue | nvarchar(100) |  |  |
| 6 | Desciption | nvarchar(255) |  |  |
| 7 | ColumnType | int | NN |  |
| 8 | SortOrder | int | NN |  |

## SYSConvertUpdateValue

Rows: 0 | Columns: 11

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SYSConvertUpdateValue | uniqueidentifier | PK NN |  |
| 2 | OldRefID | uniqueidentifier |  |  |
| 3 | OldRefDetailID | uniqueidentifier |  |  |
| 4 | OldRefType | int | NN |  |
| 5 | NewRefID | uniqueidentifier |  |  |
| 6 | NewRefDetailID | uniqueidentifier |  |  |
| 7 | NewRefType | int | NN |  |
| 8 | AccountingObjectID | uniqueidentifier |  |  |
| 9 | StartDate | datetime |  |  |
| 10 | FinishDate | datetime |  |  |
| 11 | InvNo | nvarchar(50) |  |  |

## SYSConvertUpdateValueRefdetailID

Rows: 0 | Columns: 5

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SYSConvertUpdateValueRefdetailID | uniqueidentifier | PK NN |  |
| 2 | OldRefDetailID | uniqueidentifier |  |  |
| 3 | OldRefType | int | NN |  |
| 4 | NewRefDetailID | uniqueidentifier |  |  |
| 5 | NewRefType | int | NN |  |

## SYSCustomizeReport

Rows: 0 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | CustomizeReportID | uniqueidentifier | PK NN |  |
| 2 | ReportID | varchar(100) | NN | SYSReportList.ReportID |
| 3 | ReportName | nvarchar(255) | NN |  |
| 4 | TemplateFile | varbinary |  |  |
| 5 | TemplateFileName | nvarchar(255) | NN |  |
| 6 | ScriptFile | varbinary |  |  |
| 7 | ScriptFileName | nvarchar(255) | NN |  |
| 8 | DependOnReportID | varchar(100) |  |  |

## SYSDBInfo

Rows: 1 | Columns: 14

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | Application | nvarchar(20) | PK NN |  |
| 2 | Version | nvarchar(20) |  |  |
| 3 | MVC | nvarchar(20) |  |  |
| 4 | CreatedBy | nvarchar(50) |  |  |
| 5 | CreatedDate | datetime |  |  |
| 6 | ClosedDate | datetime |  |  |
| 7 | Description | nvarchar(255) |  |  |
| 8 | DemoData | bit | NN |  |
| 9 | DemoDate | datetime |  |  |
| 10 | Particularity | int |  |  |
| 11 | MobileDatabaseID | uniqueidentifier |  |  |
| 12 | IsFirstTimeSyncLedger | bit |  |  |
| 13 | LastCheckLedgerDate | datetime |  |  |
| 14 | LastTrackingEventDate | datetime |  |  |

## SYSDBOption

Rows: 764 | Columns: 16

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | UserOptionID | uniqueidentifier | PK NN |  |
| 2 | UserID | uniqueidentifier |  |  |
| 3 | OptionID | nvarchar(50) | NN |  |
| 4 | BranchID | uniqueidentifier |  |  |
| 5 | OptionValue | nvarchar(MAX) |  |  |
| 6 | ValueType | int | NN |  |
| 7 | IsDefault | bit | NN |  |
| 8 | Description | nvarchar(255) |  |  |
| 9 | Lock | bit | NN |  |
| 10 | IsGlobalOption | bit | NN |  |
| 11 | IsUserOption | bit | NN |  |
| 12 | CreatedDate | datetime |  |  |
| 13 | CreatedBy | nvarchar(50) |  |  |
| 14 | ModifiedDate | datetime |  |  |
| 15 | ModifiedBy | nvarchar(50) |  |  |
| 18 | IsBranchOption | bit | NN |  |

## SYSDBOptionMachine

Rows: 15 | Columns: 15

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | UserOptionID | uniqueidentifier | PK NN |  |
| 2 | UserID | uniqueidentifier |  |  |
| 3 | OptionID | nvarchar(50) | NN |  |
| 4 | BranchID | uniqueidentifier |  |  |
| 5 | MachineName | nvarchar(255) |  |  |
| 6 | OptionValue | nvarchar(MAX) |  |  |
| 7 | ValueType | int | NN |  |
| 8 | Description | nvarchar(255) |  |  |
| 9 | IsUserOption | bit | NN |  |
| 10 | IsBranchOption | bit | NN |  |
| 11 | IsMachineOption | bit | NN |  |
| 12 | CreatedDate | datetime |  |  |
| 13 | CreatedBy | nvarchar(50) |  |  |
| 14 | ModifiedDate | datetime |  |  |
| 15 | ModifiedBy | nvarchar(50) |  |  |

## SYSDefaultPaymentMethodValue

Rows: 11 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | DefaultID | uniqueidentifier | PK NN |  |
| 2 | DefaultCode | nvarchar(50) | NN |  |
| 3 | RefTypeList | nvarchar(255) |  |  |
| 4 | KeyList | nvarchar(MAX) | NN |  |
| 5 | DefaultValue | nvarchar(MAX) |  |  |
| 6 | UserID | uniqueidentifier |  |  |
| 7 | DisplayOnBook | int |  |  |

## SYSEmailTemplateType

Rows: 12 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | TemplateTypeID | int | PK NN |  |
| 2 | TemplateTypeName | nvarchar(100) | NN |  |
| 3 | CategoryID | int |  |  |
| 4 | ListObjectID | varchar(700) |  |  |
| 5 | TableName | varchar(100) |  |  |
| 6 | ProcedureName | varchar(100) |  |  |
| 7 | FunctionName | varchar(100) |  |  |
| 8 | Description | nvarchar(255) |  |  |
| 9 | MergeTempalte | nvarchar(100) |  |  |

## SYSGroupMultiLog

Rows: 0 | Columns: 5

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ID | uniqueidentifier | PK NN |  |
| 2 | OldObjectID | uniqueidentifier |  |  |
| 3 | NewObjectID | uniqueidentifier |  |  |
| 4 | LogTime | datetime |  |  |
| 5 | LogType | int |  |  |

## SYSInfoInvoiceNo

Rows: 0 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ID | bigint | PK NN ID |  |
| 2 | InvNo | nvarchar(25) |  |  |
| 3 | InvTemplateNo | nvarchar(25) |  |  |
| 4 | InvSeries | nvarchar(20) |  |  |
| 5 | BranchID | uniqueidentifier |  |  |
| 6 | TimeOut | datetime |  |  |
| 7 | RefID | uniqueidentifier |  |  |

## SYSLayoutLanguage

Rows: 8,337 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SYSLayoutLanguageID | uniqueidentifier | PK NN |  |
| 2 | FKeyID | uniqueidentifier |  |  |
| 3 | LanguageID | nvarchar(20) | NN |  |
| 4 | TemplateConfigLanguage | nvarchar(MAX) |  |  |

## SYSLayoutMemorized

Rows: 0 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SYSLayoutMemorizedID | uniqueidentifier | PK NN |  |
| 2 | LayoutID | uniqueidentifier |  | SYSListLayoutTemplate.LayoutID |
| 3 | UserID | uniqueidentifier |  |  |

## SYSListLayoutTemplate

Rows: 137 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | LayoutID | uniqueidentifier | PK NN |  |
| 2 | UserID | uniqueidentifier |  |  |
| 3 | SubSystemCode | nvarchar(50) |  |  |
| 4 | TemplateConfig | nvarchar(MAX) | NN |  |
| 5 | LayoutName | nvarchar(255) |  |  |
| 6 | Description | nvarchar(255) |  |  |
| 7 | IsPublic | bit |  |  |

## SYSNewRefNo

Rows: 0 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SYSNewRefNoID | uniqueidentifier | PK NN |  |
| 2 | RefTypeCategory | int |  |  |
| 3 | BranchID | uniqueidentifier |  |  |
| 4 | DisplayOnBook | int |  |  |
| 5 | VoucherRefID | uniqueidentifier |  |  |
| 6 | RefNo | nvarchar(128) |  |  |
| 7 | CreatedDate | datetime |  |  |

## SYSOperand

Rows: 304 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | OperandID | int | PK NN |  |
| 2 | OperandString | nvarchar(200) | NN |  |
| 3 | VDescription | nvarchar(200) |  |  |
| 4 | EDescription | nvarchar(200) |  |  |
| 5 | Type | smallint |  |  |
| 6 | Note | nvarchar(200) |  |  |
| 15 | IsAdjust | bit |  |  |

## SYSPostMappingColumn

Rows: 599 | Columns: 13

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SYSPostMappingColumnID | uniqueidentifier | PK NN |  |
| 2 | LedgerTableName | nvarchar(50) |  |  |
| 3 | MasterTableName | nvarchar(50) |  |  |
| 4 | DetailTableName | nvarchar(50) |  |  |
| 5 | ColumnNameInLedger | nvarchar(50) | NN |  |
| 6 | ConfigType | int | NN |  |
| 7 | Value | nvarchar(255) |  |  |
| 8 | DefaultValue | nvarchar(255) |  |  |
| 9 | Description | nvarchar(255) |  |  |
| 10 | MasterCondition | nvarchar(255) |  |  |
| 11 | DetailCondition | nvarchar(255) |  |  |
| 12 | AccountCondition | nvarchar(255) |  |  |
| 13 | PostToBookType | int | NN |  |

## SYSPostMappingRedundant

Rows: 42 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SYSPostMappingRedundantID | uniqueidentifier | PK NN |  |
| 2 | LedgerTableName | nvarchar(50) |  |  |
| 3 | RedundantTableName | nvarchar(50) | NN |  |
| 4 | ColumnNameInLedger | nvarchar(50) | NN |  |
| 5 | ColumnNameInRedundant | nvarchar(50) | NN |  |
| 6 | RelationColumnNameInLedger | nvarchar(50) | NN |  |
| 7 | RelationColumnNameInRedundant | nvarchar(50) | NN |  |
| 8 | Desciption | nvarchar(255) |  |  |

## SYSPostMappingRow

Rows: 140 | Columns: 37

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SYSPostMappingRowID | uniqueidentifier | PK NN |  |
| 2 | LedgerTableName | nvarchar(50) | NN |  |
| 3 | MasterTableName | nvarchar(50) | NN |  |
| 4 | DetailTableName | nvarchar(50) |  |  |
| 5 | MasterCondition | nvarchar(255) |  |  |
| 6 | DetailCondition | nvarchar(255) |  |  |
| 7 | AccountCondition | nvarchar(255) |  |  |
| 8 | RelationColumnNameInMaster | nvarchar(50) |  |  |
| 9 | RelationColumnNameInDetail | nvarchar(50) |  |  |
| 10 | Description | nvarchar(500) |  |  |
| 11 | TotalRowCount | int | NN |  |
| 12 | AccountNumber | nvarchar(50) |  |  |
| 13 | CorrespondingAccountNumber | nvarchar(50) |  |  |
| 14 | AmountManagement | nvarchar(255) |  |  |
| 15 | AmountFinance | nvarchar(255) |  |  |
| 16 | AmountOCManagement | nvarchar(255) |  |  |
| 17 | AmountOCFinance | nvarchar(255) |  |  |
| 18 | Quantity | nvarchar(255) |  |  |
| 19 | MainQuantity | nvarchar(255) |  |  |
| 20 | IsInward | nvarchar(255) |  |  |
| 21 | AccountObjectID | nvarchar(255) |  |  |
| 22 | BankAccountID | nvarchar(255) |  |  |
| 23 | StockID | nvarchar(255) |  |  |
| 24 | RefNoFinance | nvarchar(255) |  |  |
| 25 | RefNoManagement | nvarchar(255) |  |  |
| 26 | JournalMemo | nvarchar(500) |  |  |
| 27 | ContactName | nvarchar(255) |  |  |
| 28 | OrganizationUnitID | nvarchar(255) |  |  |
| 29 | DecrementQuantity | nvarchar(255) |  |  |
| 30 | IncrementQuantity | nvarchar(255) |  |  |
| 31 | AllowPostOnlyMaster | bit | NN |  |
| 32 | RefDate | nvarchar(255) |  |  |
| 33 | AccountingSystem | nvarchar(50) |  |  |
| 34 | DocumentIncluded | nvarchar(255) |  |  |
| 35 | DetailPostOrder | int | NN |  |
| 36 | DetailDescription | nvarchar(255) |  |  |
| 37 | BusinessType | nvarchar(255) |  |  |

## SYSPostMappingRowDetail

Rows: 86 | Columns: 11

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SYSPostMappingRowDetailID | uniqueidentifier | PK NN |  |
| 2 | IndexRow | int | NN |  |
| 3 | LedgerTableName | nvarchar(50) | NN |  |
| 4 | ColumnNameInLedger | nvarchar(50) | NN |  |
| 5 | ValueInSYSPostMappingRow | nvarchar(50) |  |  |
| 6 | ConfigType | int | NN |  |
| 7 | PostToBookType | int | NN |  |
| 8 | IsCheckCondition | bit |  |  |
| 9 | MasterAllCondition | nvarchar(255) |  |  |
| 10 | MasterCondition | nvarchar(255) |  |  |
| 11 | DetailCondition | nvarchar(255) |  |  |

## SYSPostMappingValidate

Rows: 11 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SYSPostMappingValidateID | uniqueidentifier | PK NN |  |
| 2 | ValidateType | int | NN |  |
| 3 | ColumnNameInLedger | nvarchar(MAX) | NN |  |
| 4 | LedgerTableName | nvarchar(50) | NN |  |
| 5 | DetailByColumnName | nvarchar(100) | NN |  |
| 6 | DetailByTypeColumnName | nvarchar(100) |  |  |
| 7 | Description | nvarchar(255) | NN |  |

## SYSPostRefIDRebuid

Rows: 103 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SYSPostRefIDRebuildID | uniqueidentifier | PK NN |  |
| 2 | IsPostedFinance | bit | NN |  |
| 3 | IsPostedManagement | bit | NN |  |

## SYSQuickEditPostConfig

Rows: 1,121 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ConfigID | uniqueidentifier | PK NN |  |
| 2 | LedgerTableName | nvarchar(50) |  |  |
| 3 | MasterTableName | nvarchar(50) |  |  |
| 4 | DetailTableName | nvarchar(50) |  |  |
| 5 | FilterCondition | nvarchar(1000) |  |  |
| 9 | ColumnNameInLedger | nvarchar(50) | NN |  |
| 10 | Value | nvarchar(255) |  |  |
| 11 | IsMaster | bit | NN |  |
| 12 | ConfigType | int |  |  |

## SYSQuickEditTableConfig

Rows: 555 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ConfigID | uniqueidentifier | PK NN |  |
| 2 | RefTypeList | nvarchar(MAX) |  |  |
| 3 | TableName | nvarchar(255) |  |  |
| 4 | IsMaster | bit | NN |  |
| 5 | ColumnID | nvarchar(100) |  |  |
| 6 | ColumnCode | nvarchar(100) |  |  |
| 7 | FilterCondition | nvarchar(MAX) |  |  |
| 8 | Description | nvarchar(255) |  |  |

## SYSQuickSearchLayoutTemplate

Rows: 170 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | TemplateID | uniqueidentifier | PK NN |  |
| 2 | TableName | nvarchar(50) |  |  |
| 3 | DictionaryType | nvarchar(50) |  |  |
| 4 | FormTitle | nvarchar(128) |  |  |
| 5 | TemplateConfig | nvarchar(MAX) |  |  |
| 6 | UserID | uniqueidentifier |  |  |
| 7 | FormSizeHeight | decimal(18,4) | NN |  |
| 8 | FormSizeWidth | decimal(18,4) | NN |  |

## SYSQuickSearchLayoutTemplateLanguage

Rows: 375 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ID | uniqueidentifier | PK NN |  |
| 2 | TemplateID | uniqueidentifier | NN |  |
| 3 | LanguageID | nvarchar(20) |  |  |
| 4 | TemplateConfigLanguage | nvarchar(MAX) |  |  |

## SYSRefType

Rows: 286 | Columns: 20

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefType | int | PK NN |  |
| 2 | RefTypeName | nvarchar(100) |  |  |
| 3 | RefTypeCategory | int |  | SYSRefTypeCategory.RefTypeCategory |
| 4 | MasterTableName | nvarchar(50) |  |  |
| 5 | DetailTableName | nvarchar(50) |  |  |
| 6 | Postable | bit | NN |  |
| 7 | Searchable | bit | NN |  |
| 8 | SortOrder | int | NN |  |
| 9 | SubSystem | varchar(20) |  |  |
| 10 | PostType | int |  |  |
| 11 | CreatedDate | datetime |  |  |
| 12 | CreatedBy | nvarchar(50) |  |  |
| 13 | ModifiedDate | datetime |  |  |
| 14 | ModifiedBy | nvarchar(50) |  |  |
| 15 | IsShowOnAccountDefault | bit | NN |  |
| 16 | Description | nvarchar(255) |  |  |
| 21 | IsReference | bit | NN |  |
| 22 | RefTypeNameEnglish | nvarchar(255) |  |  |
| 23 | RefTypeNameChinese | nvarchar(255) |  |  |
| 24 | RefTypeNameKorean | nvarchar(255) |  |  |

## SYSRefTypeCategory

Rows: 94 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefTypeCategory | int | PK NN |  |
| 2 | RefTypeCategoryName | nvarchar(50) |  |  |
| 3 | DefaultDebitAccountID | nvarchar(20) |  |  |
| 4 | DefaultCreditAccountID | nvarchar(20) |  |  |
| 9 | UseRebuildRefNo | bit | NN |  |
| 10 | SortOrder | int | NN |  |
| 11 | Description | nvarchar(255) |  |  |

## SYSRefTypeDetail

Rows: 345 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefTypeDetailID | int | PK NN ID |  |
| 2 | RefType | int | NN | SYSRefType.RefType |
| 3 | RefTypeName | nvarchar(255) |  |  |
| 4 | RefTypeCategory | int | NN | SYSRefTypeCategory.RefTypeCategory |
| 5 | RefNoFinanceColumnName | nvarchar(50) |  |  |
| 6 | RefNoManagementColumnName | nvarchar(50) |  |  |
| 7 | RefDateColumnName | nvarchar(50) |  |  |
| 8 | PostedDateColumnName | nvarchar(50) |  |  |
| 9 | DetailTableName | nvarchar(50) |  |  |
| 10 | MasterTableName | nvarchar(50) |  |  |

## SYSRemindOption

Rows: 183 | Columns: 13

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | UserOptionID | uniqueidentifier | PK NN |  |
| 2 | UserID | uniqueidentifier |  |  |
| 3 | OptionID | nvarchar(50) | NN |  |
| 4 | OptionValue | nvarchar(100) |  |  |
| 5 | ValueType | nchar(10) | NN |  |
| 6 | IsUserOption | bit | NN |  |
| 7 | IsDefault | bit | NN |  |
| 8 | Description | nvarchar(255) |  |  |
| 9 | CreatedDate | datetime |  |  |
| 10 | CreatedBy | nvarchar(50) |  |  |
| 11 | ModifiedDate | datetime |  |  |
| 12 | ModifiedBy | nvarchar(50) |  |  |
| 13 | TabName | int |  |  |

## SYSReportCopyConfig

Rows: 65 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ConfigID | int | PK NN ID |  |
| 2 | ReportID | nvarchar(100) |  |  |
| 3 | NumOfCopy | int |  |  |
| 4 | AllowEdit | bit |  |  |
| 5 | AllowEditNameOfCopy | bit |  |  |
| 6 | AllowEditPurpose | bit |  |  |
| 7 | AllowEditColor | bit |  |  |
| 8 | AllowEditBackground | bit |  |  |
| 9 | AllowEditLogo | bit |  |  |
| 10 | IsSystem | bit |  |  |

## SYSReportCopyConfigDetail

Rows: 443 | Columns: 14

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ConfigDetailID | int | PK NN ID |  |
| 2 | ReportID | nvarchar(100) |  |  |
| 3 | NoOfCopy | int |  |  |
| 4 | NameOfCopy | nvarchar(500) |  |  |
| 5 | TypeOfCopies | int | NN |  |
| 6 | CCPurpose | nvarchar(64) |  |  |
| 7 | CCColor | nvarchar(64) |  |  |
| 8 | CCBackground | varbinary |  |  |
| 9 | CCLogo | varbinary |  |  |
| 10 | LocalPathBackground | nvarchar(50) |  |  |
| 11 | LocalPathLogo | nvarchar(50) |  |  |
| 12 | EnglishNameOfCopy | nvarchar(500) |  |  |
| 13 | CCPurposeEnglish | nvarchar(255) |  |  |
| 14 | IsConvertTemplate | bit | NN |  |

## SYSReportCopyConfigDetailTemplate

Rows: 38 | Columns: 14

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ConfigDetailID | int | PK NN ID |  |
| 2 | ReportID | nvarchar(100) |  |  |
| 3 | NoOfCopy | int |  |  |
| 4 | NameOfCopy | nvarchar(500) |  |  |
| 5 | EnglishNameOfCopy | nvarchar(500) |  |  |
| 6 | TypeOfCopies | int | NN |  |
| 7 | CCPurpose | nvarchar(64) |  |  |
| 8 | CCColor | nvarchar(64) |  |  |
| 9 | CCBackground | varbinary |  |  |
| 10 | CCLogo | varbinary |  |  |
| 11 | LocalPathBackground | nvarchar(50) |  |  |
| 12 | LocalPathLogo | nvarchar(50) |  |  |
| 13 | CCPurposeEnglish | nvarchar(255) |  |  |
| 14 | IsConvertTemplate | bit | NN |  |

## SYSReportCustom

Rows: 1 | Columns: 15

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReportCustomID | uniqueidentifier | PK NN |  |
| 2 | ReportID | varchar(100) | NN | SYSReportList.ReportID |
| 3 | ReportTypeID | int |  | SYSReportMergeType.ReportTypeID |
| 4 | ReportName | nvarchar(255) |  |  |
| 5 | ReportNameEnglish | nvarchar(255) |  |  |
| 6 | Description | nvarchar(255) |  |  |
| 7 | FileName | nvarchar(255) |  |  |
| 8 | FileData | varbinary |  |  |
| 9 | FileExtension | nvarchar(20) |  |  |
| 10 | CreatedDate | datetime |  |  |
| 11 | CreatedBy | nvarchar(50) |  |  |
| 12 | ModifiedDate | datetime |  |  |
| 13 | ModifiedBy | nvarchar(50) |  |  |
| 14 | CustomReportType | int |  |  |
| 15 | PrintType | int |  |  |

## SYSReportCustomDesignTemplate

Rows: 0 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | DesignTemplateID | uniqueidentifier | PK NN |  |
| 2 | ReportID | varchar(100) | NN | SYSReportList.ReportID |
| 3 | ReportFileData | varbinary |  |  |
| 4 | BankID | uniqueidentifier |  |  |

## SYSReportFormula

Rows: 164 | Columns: 11

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ItemDetailID | uniqueidentifier | PK NN |  |
| 2 | ReportID | varchar(100) | NN | SYSReportList.ReportID |
| 3 | AccountSystem | nvarchar(20) |  |  |
| 4 | ReportItemID | uniqueidentifier |  | SYSReportTemplate.ReportItemID |
| 5 | ColumnName | nvarchar(50) | NN |  |
| 6 | FormulaSign | int | NN |  |
| 7 | FunctionCode | nvarchar(50) | NN |  |
| 8 | AccountNumber | nvarchar(20) | NN |  |
| 9 | CorrespondingAccountNumber | nvarchar(20) |  |  |
| 10 | SortOrder | int |  |  |
| 11 | Period | int |  |  |

## SYSReportGroup

Rows: 24 | Columns: 14

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | GroupID | int | PK NN |  |
| 2 | GroupName | nvarchar(255) |  |  |
| 3 | Description | nvarchar(255) |  |  |
| 4 | IsVoucher | bit | NN |  |
| 5 | Inactive | bit | NN |  |
| 6 | CreatedDate | datetime |  |  |
| 7 | CreatedBy | nvarchar(50) |  |  |
| 8 | ModifiedDate | datetime |  |  |
| 9 | ModifiedBy | nvarchar(50) |  |  |
| 10 | SortOrder | int |  |  |
| 11 | IsShowOnReportCenter | bit |  |  |
| 12 | GroupNameEnglish | nvarchar(255) |  |  |
| 13 | GroupNameKorean | nvarchar(255) |  |  |
| 14 | GroupNameChinese | nvarchar(255) |  |  |

## SYSReportInvoice

Rows: 0 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReportInvoiceID | uniqueidentifier | PK NN |  |
| 2 | ReportID | varchar(100) | NN |  |
| 3 | RefID | uniqueidentifier | NN |  |

## SYSReportLayoutConfig

Rows: 688 | Columns: 20

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | LayoutID | uniqueidentifier | PK NN |  |
| 2 | ReportID | varchar(100) | NN | SYSReportList.ReportID |
| 3 | UserID | uniqueidentifier |  |  |
| 4 | LayoutName | nvarchar(255) | NN |  |
| 5 | Description | nvarchar(255) |  |  |
| 6 | SortOrder | int | NN ID |  |
| 7 | TemplateConfig | nvarchar(MAX) |  |  |
| 8 | Language | nvarchar(10) |  |  |
| 9 | ModifiedDate | datetime |  |  |
| 10 | CreatedBy | nvarchar(50) |  |  |
| 11 | CreatedDate | datetime |  |  |
| 12 | ModifiedBy | nvarchar(50) |  |  |
| 13 | IsForeignCurrency | bit | NN |  |
| 14 | IsSystem | bit | NN |  |
| 15 | IsPublic | bit | NN |  |
| 16 | LastViewDate | datetime |  |  |
| 17 | IsDefaultApply | bit | NN |  |
| 18 | DescriptionEnglish | nvarchar(255) |  |  |
| 19 | DescriptionChinese | nvarchar(255) |  |  |
| 20 | DescriptionKorean | nvarchar(255) |  |  |

## SYSReportLayoutUserApply

Rows: 11 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReportID | varchar(100) |  | SYSReportList.ReportID |
| 2 | LayoutID | uniqueidentifier |  | SYSReportLayoutConfig.LayoutID |
| 3 | UserID | uniqueidentifier |  |  |
| 4 | IsForeignCurrency | bit |  |  |

## SYSReportList

Rows: 1,165 | Columns: 59

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReportID | varchar(100) | PK NN |  |
| 2 | ReportName | nvarchar(255) |  |  |
| 3 | ReportName48 | nvarchar(255) |  |  |
| 4 | GroupID | int |  | SYSReportGroup.GroupID |
| 5 | ReportFile | nvarchar(100) |  |  |
| 6 | FunctionReportName | varchar(100) |  |  |
| 7 | ProcedureName | varchar(100) |  |  |
| 8 | ParameterFormName | varchar(100) |  |  |
| 9 | ParameterUserControl | varchar(100) |  |  |
| 10 | ReportViewer | varchar(100) |  |  |
| 12 | RefTypeList | nvarchar(700) | NN |  |
| 13 | SortOrder | int |  |  |
| 14 | AccountingSystem | int | NN |  |
| 15 | BranchID | uniqueidentifier |  |  |
| 16 | Description | nvarchar(255) |  |  |
| 17 | FormNo | nvarchar(128) |  |  |
| 18 | FormNo48 | nvarchar(128) |  |  |
| 19 | LastViewDate | datetime |  |  |
| 20 | TableName | nvarchar(MAX) |  |  |
| 21 | IsBeta | bit |  |  |
| 22 | IsInvoice | bit | NN |  |
| 23 | IsSystem | bit | NN |  |
| 24 | IsShow | bit | NN |  |
| 25 | IsNotPrintSummary | bit |  |  |
| 26 | InvTypeID | int |  |  |
| 27 | IsPrintLineNumber | bit |  |  |
| 28 | ReportType | int | NN |  |
| 29 | ReportStyle | int |  |  |
| 30 | ParentID | nvarchar(100) |  |  |
| 31 | ReportDetailName | nvarchar(255) |  |  |
| 32 | LinkToReportDetail | nvarchar(MAX) |  |  |
| 33 | InvMethod | int |  |  |
| 34 | IsParent | bit | NN |  |
| 35 | RefTypeCategory | int |  |  |
| 37 | CreateDate | datetime |  |  |
| 38 | ReportTitle | nvarchar(255) |  |  |
| 39 | ListParameter | nvarchar(MAX) |  |  |
| 40 | ReportNameEnglish | nvarchar(255) |  |  |
| 41 | ReportNameEnglish48 | nvarchar(255) |  |  |
| 42 | ShowTotalPageNumber | int |  |  |
| 43 | TableNameExport | nvarchar(20) |  |  |
| 44 | ReportName133 | nvarchar(255) |  |  |
| 45 | ReportNameEnglish133 | nvarchar(255) |  |  |
| 46 | FormNo133 | nvarchar(128) |  |  |
| 47 | IsCheckDataDeviation | bit |  |  |
| 48 | ContentMessageConfig | nvarchar(MAX) |  |  |
| 49 | GroupType | int |  |  |
| 50 | ReportDetailNameEnglish | nvarchar(255) |  |  |
| 51 | ReportNameChinese | nvarchar(255) |  |  |
| 52 | ReportNameChinese48 | nvarchar(255) |  |  |
| 53 | ReportNameChinese133 | nvarchar(255) |  |  |
| 54 | ReportNameKorean | nvarchar(255) |  |  |
| 55 | ReportNameKorean48 | nvarchar(255) |  |  |
| 56 | ReportNameKorean133 | nvarchar(255) |  |  |
| 57 | ReportDetailNameChinese | nvarchar(255) |  |  |
| 58 | ReportDetailNameKorean | nvarchar(255) |  |  |
| 59 | LanguageID | nvarchar(10) |  |  |
| 60 | UserControlChart | nvarchar(255) |  |  |
| 61 | FileTemplateChart | nvarchar(255) |  |  |

## SYSReportListCustom

Rows: 0 | Columns: 36

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReportID | varchar(100) | PK NN |  |
| 2 | ReportName | nvarchar(255) |  |  |
| 3 | ReportName48 | nvarchar(255) |  |  |
| 4 | GroupID | int |  |  |
| 5 | ReportFile | varchar(100) |  |  |
| 6 | FunctionReportName | varchar(100) |  |  |
| 7 | ProcedureName | varchar(100) |  |  |
| 8 | ServiceQueryName | nvarchar(255) |  |  |
| 9 | SortBy | nvarchar(255) |  |  |
| 10 | ParameterFormName | varchar(100) |  |  |
| 11 | TableName | varchar(255) |  |  |
| 12 | RefType | int | NN |  |
| 13 | ReportDataSourceType | int |  |  |
| 14 | SortOrder | varchar(255) |  |  |
| 15 | AccountingSystem | int | NN |  |
| 16 | IndexShowOnSidebar | int |  |  |
| 17 | IsRequirePrintLicense | bit | NN |  |
| 18 | ShowLogo | bit | NN |  |
| 19 | ShowCompanyInfo | bit | NN |  |
| 20 | ShowTelAndFax | bit | NN |  |
| 21 | ShowProductInfo | bit | NN |  |
| 22 | IsShow | bit | NN |  |
| 23 | IsSystem | bit | NN |  |
| 24 | IsDynamicReport | bit | NN |  |
| 25 | IsTA153Template | bit |  |  |
| 26 | TA153ReportID | uniqueidentifier |  |  |
| 27 | BranchID | uniqueidentifier |  |  |
| 28 | TA153InvTypeID | int |  |  |
| 29 | Description | nvarchar(MAX) |  |  |
| 30 | ImagePath | nvarchar(MAX) |  |  |
| 31 | IsBeta | bit |  |  |
| 32 | ReleaseTime | nvarchar(100) |  |  |
| 33 | CanUserSortColumns | bit |  |  |
| 34 | IsInvoice | bit |  |  |
| 35 | FormNo | nvarchar(255) |  |  |
| 36 | FormNo48 | nvarchar(255) |  |  |

## SYSReportListExportOption

Rows: 21 | Columns: 17

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ExportOptionID | uniqueidentifier | PK NN |  |
| 2 | ReportID | varchar(100) | NN | SYSReportList.ReportID |
| 3 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 9 | ReporterTitle | nvarchar(128) |  |  |
| 14 | ReporterName | nvarchar(128) |  |  |
| 15 | IsShowDirectorSign | bit | NN |  |
| 16 | IsShowChiefAccountantSign | bit | NN |  |
| 17 | IsShowStockeeperSign | bit | NN |  |
| 18 | IsShowCashierSign | bit | NN |  |
| 19 | IsShowReporterSign | bit |  |  |
| 20 | IsRepeatedColumnHeader | bit | NN |  |
| 30 | IsShowProductInfo | bit |  |  |
| 38 | IsPrintNewPageForGroup | bit |  |  |
| 39 | PrintNewPageToGroupName | nvarchar(128) |  |  |
| 40 | PageSize | int |  |  |
| 41 | IsPrintLineNumber | bit |  |  |
| 42 | IsSumToNextPage | bit |  |  |

## SYSReportMemorized

Rows: 11 | Columns: 16

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | MemorizedID | uniqueidentifier | PK NN |  |
| 2 | ReportID | varchar(100) | NN | SYSReportList.ReportID |
| 3 | MemorizedName | nvarchar(255) | NN |  |
| 4 | LayoutTemplateConfig | nvarchar(MAX) | NN |  |
| 5 | GroupID | int | NN |  |
| 6 | UserID | uniqueidentifier | NN |  |
| 7 | BranchID | uniqueidentifier | NN |  |
| 8 | SortOrder | int | NN ID |  |
| 9 | Parameter | nvarchar(MAX) |  |  |
| 10 | SubTitle | nvarchar(1000) |  |  |
| 11 | LastViewDate | datetime |  |  |
| 12 | ModifiedBy | nvarchar(50) |  |  |
| 13 | CreatedDate | datetime |  |  |
| 14 | CreatedBy | nvarchar(50) |  |  |
| 15 | ModifiedDate | datetime |  |  |
| 16 | ShowInReport | bit |  |  |

## SYSReportMergeType

Rows: 49 | Columns: 14

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReportTypeID | int | PK NN |  |
| 2 | ReportTypeName | nvarchar(255) |  |  |
| 3 | ProcedureName | nvarchar(255) |  |  |
| 4 | RefTypeList | nvarchar(700) |  |  |
| 5 | TableName | nvarchar(50) |  |  |
| 6 | PrimaryKeyMaster | nvarchar(50) |  |  |
| 7 | FunctionReportName | varchar(100) |  |  |
| 8 | MergeTemplate | nvarchar(100) |  |  |
| 9 | RefTypeCategory | int |  |  |
| 10 | ReportTypeNameEnglish | nvarchar(255) |  |  |
| 11 | ReportTypeNameChinese | nvarchar(255) |  |  |
| 12 | ReportTypeNameKorean | nvarchar(255) |  |  |
| 13 | RefTypeListSample | nvarchar(700) |  |  |
| 14 | MergeTemplateSample | nvarchar(100) |  |  |

## SYSReportOrder

Rows: 23 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | OrderID | nvarchar(125) | PK NN |  |
| 2 | ReportID | varchar(100) | NN | SYSReportList.ReportID |
| 3 | RefType | int | NN |  |
| 4 | SortOrder | int | NN |  |

## SYSReportTemplate

Rows: 18 | Columns: 15

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReportItemID | uniqueidentifier | PK NN |  |
| 2 | ReportID | varchar(100) | NN | SYSReportList.ReportID |
| 3 | ReportItemIndex | nvarchar(20) |  |  |
| 4 | ReportItemAlias | nvarchar(20) |  |  |
| 5 | ReportItemCode | nvarchar(20) |  |  |
| 6 | ReportItemName | nvarchar(255) |  |  |
| 7 | ParentID | uniqueidentifier |  |  |
| 8 | IsParent | bit |  |  |
| 9 | Grade | int |  |  |
| 10 | Part | int |  |  |
| 11 | IsBold | bit |  |  |
| 12 | IsItalic | bit |  |  |
| 13 | Formula | nvarchar(255) |  |  |
| 14 | SortOrder | nvarchar(20) |  |  |
| 15 | CustomInfo | nvarchar(MAX) |  |  |

## SYSReportVoucherTypeCategory

Rows: 74 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReportVoucherTypeCategory | int | PK NN |  |
| 2 | ReportVoucherTypeCategoryName | nvarchar(50) |  |  |
| 3 | Description | nvarchar(255) |  |  |
| 4 | SortOrder | int | NN |  |

## SYSReportVoucherTypeCategory_RefType

Rows: 363 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReportVoucherTypeCategory_RefTypeID | int | PK NN ID |  |
| 2 | RefType | int | NN |  |
| 3 | ReportVoucherTypeCategory | int | NN |  |
| 4 | RefNoFinanceColumnName | nvarchar(50) |  |  |
| 5 | RefNoManagementColumnName | nvarchar(50) |  |  |
| 6 | RefDateColumnName | nvarchar(50) |  |  |
| 7 | PostedDateColumnName | nvarchar(50) |  |  |
| 8 | MasterTableName | nvarchar(50) |  |  |

## SYSSetNullColumnConfig

Rows: 72 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ConfigID | uniqueidentifier | PK NN |  |
| 2 | TableName | nvarchar(50) |  |  |
| 3 | TaxMethod | bit |  |  |
| 4 | MasterCondition | nvarchar(255) |  |  |
| 5 | DetailCondition | nvarchar(255) |  |  |
| 6 | ColumnToSetNull | nvarchar(500) |  |  |
| 7 | Description | nvarchar(255) |  |  |

## SYSSubSystem

Rows: 11 | Columns: 5

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SubSystemID | int | PK NN |  |
| 2 | SubSystemCode | nvarchar(50) | NN |  |
| 3 | SubSystemName | nvarchar(100) | NN |  |
| 4 | SorOrder | int | NN |  |
| 5 | Description | nvarchar(255) |  |  |

## SYSSubSystemRefType

Rows: 228 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SYSSubSystemRefTypeID | uniqueidentifier | PK NN |  |
| 2 | SubSystemID | int | NN | SYSSubSystem.SubSystemID |
| 3 | RefType | int | NN |  |
| 4 | RefOrderInSubSystem | int | NN |  |
| 5 | RefOrderWithRealName | int | NN |  |
| 6 | Description | nvarchar(255) |  |  |
| 7 | MasterTableName | nvarchar(50) | NN |  |
| 8 | IsPostBatch | bit | NN |  |
| 9 | InOutWardType | int | NN |  |

## SYSUpdateField

Rows: 0 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | UpdateFieldID | uniqueidentifier | PK NN |  |
| 2 | TableColumnName | nvarchar(100) | NN |  |
| 3 | UpdateCondition | nvarchar(4000) |  |  |
| 4 | TableUpdate | nvarchar(200) |  |  |
| 5 | MasterTableName | nvarchar(100) |  |  |
| 6 | DictionaryCategory | nvarchar(100) |  |  |
| 7 | TableType | int |  |  |

## SYSUserInfo

Rows: 20 | Columns: 12

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | UserInfoID | uniqueidentifier | PK NN |  |
| 2 | ConnectionStringName | nvarchar(255) | NN |  |
| 3 | UserName | nvarchar(255) |  |  |
| 4 | IPAddress | nvarchar(50) |  |  |
| 5 | ComputerName | nvarchar(255) |  |  |
| 6 | DateTimeLogin | datetime |  |  |
| 7 | OnlineWithOneUserName | int |  |  |
| 8 | BranchName | nvarchar(255) |  |  |
| 9 | CreatedDate | datetime |  |  |
| 10 | CreatedBy | nvarchar(50) |  |  |
| 11 | ModifiedDate | datetime |  |  |
| 12 | ModifiedBy | nvarchar(50) |  |  |

## SYSVoucherTemplate

Rows: 752 | Columns: 12

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | LayoutID | uniqueidentifier | PK NN |  |
| 2 | LayoutName | nvarchar(255) | NN |  |
| 3 | RefType | int | NN |  |
| 4 | VoucherType | tinyint |  |  |
| 5 | UserID | uniqueidentifier |  |  |
| 6 | CreatedDate | datetime |  |  |
| 7 | CreatedBy | nvarchar(50) |  |  |
| 8 | ModifiedDate | datetime |  |  |
| 9 | ModifiedBy | nvarchar(50) |  |  |
| 10 | RefTypeName | nvarchar(255) |  |  |
| 11 | IsPublic | bit |  |  |
| 12 | IsSystem | bit |  |  |

## SYSVoucherTemplateDetail

Rows: 2,494 | Columns: 14

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | LayoutDetailID | uniqueidentifier | PK NN |  |
| 2 | LayoutID | uniqueidentifier | NN | SYSVoucherTemplate.LayoutID |
| 3 | GridType | tinyint | NN |  |
| 4 | TabIndex | tinyint | NN |  |
| 5 | TabCaption | nvarchar(50) |  |  |
| 6 | TabVisible | bit |  |  |
| 7 | IsTabCustomField | bit |  |  |
| 8 | TemplateConfig | nvarchar(MAX) |  |  |
| 9 | GridName | nvarchar(50) |  |  |
| 10 | IsHiddenTabByVATMethod | bit |  |  |
| 11 | IsShowOnMaster | bit |  |  |
| 12 | TabCaptionEnglish | nvarchar(100) |  |  |
| 13 | TabCaptionChinese | nvarchar(100) |  |  |
| 14 | TabCaptionKorean | nvarchar(100) |  |  |

## SysReportStyle

Rows: 13 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | StyleID | int | PK NN |  |
| 2 | StyleName | nvarchar(255) | NN |  |
| 4 | StyleData | varbinary |  |  |
| 5 | DefaultStyleFileName | nvarchar(255) |  |  |
| 6 | DisplayLogoRate | decimal(18,4) |  |  |
| 7 | TopMargin | decimal(18,4) |  |  |
| 8 | LeftMargin | decimal(18,4) |  |  |
| 9 | BottomMargin | decimal(18,4) |  |  |
| 10 | LicenseInfoWidth | decimal(18,4) |  |  |
| 11 | HieroglyphsStyleFileName | nvarchar(255) |  |  |

## UpdateStatus123Log

Rows: 0 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | TransactionID | varchar(50) |  |  |
| 2 | FromContext | nvarchar(MAX) |  |  |
| 3 | PropertyName | nvarchar(50) |  |  |
| 4 | OldValue | nvarchar(100) |  |  |
| 5 | NewValue | nvarchar(100) |  |  |
| 6 | ModifiedBy | nvarchar(100) |  |  |
| 7 | ModifiedDate | datetime |  |  |

## sysVoucherTemplateUserDetail

Rows: 7 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | LayoutID | uniqueidentifier |  | SYSVoucherTemplate.LayoutID |
| 2 | UserID | uniqueidentifier |  |  |
| 3 | State | int |  |  |

## sysdiagrams

Rows: 0 | Columns: 5

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | name | sysname | NN |  |
| 2 | principal_id | int | NN |  |
| 3 | diagram_id | int | PK NN ID |  |
| 4 | version | int |  |  |
| 5 | definition | varbinary |  |  |

# 21 — MSC Misc / Import / Report

## ImportCollection

Rows: 0 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | KeyID | uniqueidentifier | PK NN |  |
| 2 | KeyCode | nvarchar(50) |  |  |
| 3 | Description | nvarchar(255) |  |  |
| 4 | MasterTableName | nvarchar(50) |  |  |
| 5 | DetailTableName | nvarchar(50) |  |  |
| 6 | TemplateFileName | nvarchar(255) |  |  |

## ImportCollectionConfig

Rows: 0 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ConfigID | uniqueidentifier | PK NN |  |
| 2 | KeyID | uniqueidentifier |  | ImportCollection.KeyID |
| 3 | ColumnName | nvarchar(50) |  |  |
| 4 | ColumnOnSheet | nvarchar(255) |  |  |
| 5 | AllowNull | bit |  |  |
| 6 | DataType | int |  |  |
| 7 | DictinaryData | nvarchar(50) |  |  |
| 8 | SortOrder | int |  |  |
| 9 | Choosed | bit |  |  |

## ImportColumn

Rows: 6,973 | Columns: 29

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ImportColumnID | uniqueidentifier | PK NN |  |
| 2 | ImportTableID | uniqueidentifier | NN | ImportTable.ImportTableID |
| 3 | TableID | nvarchar(100) |  |  |
| 4 | ColumnID | nvarchar(100) |  |  |
| 5 | Description | nvarchar(255) |  |  |
| 6 | ColumnName | nvarchar(255) |  |  |
| 7 | ColumnNameTooltip | nvarchar(255) |  |  |
| 8 | ColumnNameExcel | nvarchar(255) |  |  |
| 9 | DataType | nvarchar(100) |  |  |
| 10 | DefaultValue | nvarchar(2000) |  |  |
| 11 | DefaultDescription | nvarchar(255) |  |  |
| 12 | Validate | nvarchar(MAX) |  |  |
| 13 | MinValue | numeric(18,4) |  |  |
| 14 | MaxValue | numeric(18,4) |  |  |
| 15 | TableReference | nvarchar(100) |  |  |
| 16 | ColumnReference | nvarchar(500) |  |  |
| 17 | Shown | bit |  |  |
| 18 | HidenSystem | bit | NN |  |
| 19 | NotNULL | bit | NN |  |
| 20 | NotNULLSystem | bit | NN |  |
| 21 | IsColumnKey | bit | NN |  |
| 22 | IsCheckDupplicate | bit | NN |  |
| 23 | IsDefaultConfig | bit | NN |  |
| 24 | SortOrder | int | NN |  |
| 25 | IsCustom | bit | NN |  |
| 26 | ColumnNameExcelMapping | nvarchar(255) |  |  |
| 27 | ModifiedDate | datetime |  |  |
| 28 | NotRemoveCustomColumn | bit | NN |  |
| 29 | Note | nvarchar(MAX) |  |  |

## ImportDictionary

Rows: 1,889 | Columns: 5

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ImportDictionaryID | uniqueidentifier | PK NN |  |
| 2 | ColumnID | nvarchar(255) |  |  |
| 3 | ColumnName | nvarchar(255) | NN |  |
| 4 | ColumnNameExcel | nvarchar(255) | NN |  |
| 5 | CreatedDate | datetime |  |  |

## ImportExternalColumn

Rows: 2,136 | Columns: 26

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ImportExternalColumnID | uniqueidentifier | PK NN |  |
| 2 | ImportExternalTableID | uniqueidentifier | NN | ImportExternalTable.ImportExternalTableID |
| 3 | TableID | nvarchar(100) | NN |  |
| 4 | ColumnID | nvarchar(100) | NN |  |
| 5 | ColumnName | nvarchar(255) | NN |  |
| 6 | ColumnNameTooltip | nvarchar(255) | NN |  |
| 7 | Description | nvarchar(255) |  |  |
| 8 | ColumnNameExternal | nvarchar(255) |  |  |
| 9 | DataType | nvarchar(100) | NN |  |
| 10 | DefaultValue | nvarchar(2000) |  |  |
| 11 | Validate | nvarchar(2000) |  |  |
| 12 | MinValue | decimal(18,4) |  |  |
| 13 | MaxValue | decimal(18,4) |  |  |
| 14 | TableReference | nvarchar(100) |  |  |
| 15 | ColumnReference | nvarchar(500) |  |  |
| 16 | Shown | bit | NN |  |
| 17 | HidenSystem | bit | NN |  |
| 18 | NotNULL | bit | NN |  |
| 19 | NotNULLSystem | bit | NN |  |
| 20 | IsColumnKey | bit | NN |  |
| 21 | IsCheckDupplicate | bit | NN |  |
| 22 | IsCustom | bit | NN |  |
| 23 | NotRemoveCustomColumn | bit | NN |  |
| 24 | SortOrder | int | NN |  |
| 25 | ModifiedDate | datetime |  |  |
| 26 | ExternalConfig | int |  |  |

## ImportExternalItem

Rows: 17 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ImportExternalItemID | uniqueidentifier | PK NN |  |
| 2 | RefType | int | NN |  |
| 3 | VoucherType | int | NN |  |
| 4 | TableMaster | nvarchar(100) | NN |  |
| 5 | Description | nvarchar(255) |  |  |
| 6 | ModifiedDate | datetime |  |  |

## ImportExternalTable

Rows: 43 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ImportExternalTableID | uniqueidentifier | PK NN |  |
| 2 | ImportExternalItemID | uniqueidentifier | NN | ImportExternalItem.ImportExternalItemID |
| 3 | TableID | nvarchar(100) | NN |  |
| 4 | TableName | nvarchar(255) |  |  |
| 5 | Validate | nvarchar(50) |  |  |
| 6 | IsTableMaster | bit | NN |  |
| 7 | SortOrder | int | NN |  |
| 8 | ModifiedDate | datetime |  |  |

## ImportFixedAsset

Rows: 0 | Columns: 73

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | FixedAssetID | uniqueidentifier |  |  |
| 2 | RefNo | nvarchar(20) |  |  |
| 3 | RefDate | datetime |  |  |
| 4 | RefType | int |  |  |
| 5 | FixedAssetCategoryID | uniqueidentifier |  |  |
| 6 | OrganizationUnitID | uniqueidentifier |  |  |
| 7 | OrganizationUnitCode | nvarchar(500) |  |  |
| 8 | BranchID | uniqueidentifier |  |  |
| 9 | FixedAssetCode | nvarchar(25) |  |  |
| 10 | FixedAssetName | nvarchar(128) |  |  |
| 11 | Quantity | decimal(22,8) |  |  |
| 12 | JournalMemo | nvarchar(500) |  |  |
| 13 | Manufacturer | nvarchar(128) |  |  |
| 14 | ProductionYear | int |  |  |
| 15 | MadeIn | nvarchar(128) |  |  |
| 16 | SerialNumber | nvarchar(64) |  |  |
| 17 | AccountObjectID | uniqueidentifier |  |  |
| 18 | VendorName | nvarchar(400) |  |  |
| 19 | VendorAddress | nvarchar(255) |  |  |
| 20 | GuaranteeDuration | nvarchar(50) |  |  |
| 21 | GuaranteeCondition | nvarchar(255) |  |  |
| 22 | DeliveryRecordNo | nvarchar(20) |  |  |
| 23 | DeliveryRecordDate | datetime |  |  |
| 24 | State | int |  |  |
| 25 | Quality | int |  |  |
| 26 | IsNotDepreciation | bit |  |  |
| 27 | OrgPrice | decimal(18,4) |  |  |
| 28 | DepreciationAmount | decimal(18,4) |  |  |
| 29 | LifeTime | decimal(8,4) |  |  |
| 30 | LifeTimeByMonth | decimal(8,4) |  |  |
| 31 | LifeTimeRemaining | decimal(8,4) |  |  |
| 32 | LifeTimeUnit | int |  |  |
| 33 | LifeTimeRemainingUnit | int |  |  |
| 34 | DepreciationDate | datetime |  |  |
| 35 | DepreciationRateMonth | decimal(18,4) |  |  |
| 36 | DepreciationRateYear | decimal(18,4) |  |  |
| 37 | MonthlyDepreciationAmount | decimal(18,4) |  |  |
| 38 | YearlyDepreciationAmount | decimal(18,4) |  |  |
| 39 | AccumDepreciationAmount | decimal(18,4) |  |  |
| 40 | RemainingAmount | decimal(18,4) |  |  |
| 41 | IsLimitDepreciationAmount | bit |  |  |
| 42 | DepreciationAmountByIncomeTax | decimal(18,4) |  |  |
| 43 | RemainingAmountByIncomeTax | decimal(18,4) |  |  |
| 44 | MonthlyDepreciationAmountByIncomeTax | decimal(18,4) |  |  |
| 45 | OrgPriceAccount | nvarchar(20) |  |  |
| 46 | DepreciationAccount | nvarchar(20) |  |  |
| 47 | Source | nvarchar(100) |  |  |
| 48 | IsEnoughVoucher | bit |  |  |
| 49 | RefOrder | int |  |  |
| 50 | Inactive | int |  |  |
| 51 | EditVersion | timestamp |  |  |
| 52 | DisplayOnBook | int |  |  |
| 53 | CreatedDate | datetime |  |  |
| 54 | CreatedBy | nvarchar(50) |  |  |
| 55 | ModifiedDate | datetime |  |  |
| 56 | ModifiedBy | nvarchar(50) |  |  |
| 57 | IsPostedManagement | bit |  |  |
| 58 | IsPostedFinance | bit |  |  |
| 59 | LifeTimeInMonth | decimal(8,4) |  |  |
| 60 | LifeTimeRemainingInMonth | decimal(8,4) |  |  |
| 61 | RefID | uniqueidentifier |  |  |
| 62 | FixedAssetOtherBookID | uniqueidentifier |  |  |
| 63 | IsFixedAssetOfStateBudget | bit |  |  |
| 64 | CapacityMachine | nvarchar(255) |  |  |
| 65 | DecisionNo | nvarchar(20) |  |  |
| 66 | DecisionDate | datetime |  |  |
| 67 | MyReportDelivery | nvarchar(255) |  |  |
| 68 | AddressDelivery | nvarchar(255) |  |  |
| 69 | PricePurchase | decimal(18,0) |  |  |
| 70 | TransportationCost | decimal(18,0) |  |  |
| 71 | TestRunCost | decimal(18,0) |  |  |
| 72 | TechnicalDocument | nvarchar(255) |  |  |
| 73 | BranchCode | nvarchar(255) |  |  |

## ImportItem

Rows: 105 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ImportItemID | uniqueidentifier | PK NN |  |
| 2 | RefType | int | NN |  |
| 3 | VoucherType | int | NN |  |
| 4 | TableMaster | nvarchar(255) |  |  |
| 5 | Description | nvarchar(255) |  |  |
| 6 | TemplateFileName | nvarchar(255) |  |  |
| 7 | ModifiedDate | datetime |  |  |

## ImportJCOPN

Rows: 0 | Columns: 34

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier |  |  |
| 2 | BranchID | uniqueidentifier |  |  |
| 3 | ProjectWorkID | uniqueidentifier |  |  |
| 4 | JobID | uniqueidentifier |  |  |
| 5 | ContractID | uniqueidentifier |  |  |
| 6 | OrderID | uniqueidentifier |  |  |
| 7 | DirectMatetialAmount | decimal(18,4) |  |  |
| 8 | IndirectMatetialAmount | decimal(18,4) |  |  |
| 9 | DirectLaborAmount | decimal(18,4) |  |  |
| 10 | IndirectLaborAmount | decimal(18,4) |  |  |
| 11 | DepreciationAmount | decimal(18,4) |  |  |
| 12 | PurchaseAmount | decimal(18,4) |  |  |
| 13 | OtherAmount | decimal(18,4) |  |  |
| 14 | MachineIndirectMatetialAmount | decimal(18,4) |  |  |
| 15 | MachineIndirectLaborAmount | decimal(18,4) |  |  |
| 16 | MachineDepreciationAmount | decimal(18,4) |  |  |
| 17 | MachinePurchaseAmount | decimal(18,4) |  |  |
| 18 | MachineOtherAmount | decimal(18,4) |  |  |
| 19 | AcceptedAmount | decimal(18,4) |  |  |
| 20 | NotAcceptedAmount | decimal(18,4) |  |  |
| 21 | TotalAmount | decimal(18,4) |  |  |
| 22 | SortOrder | int |  |  |
| 23 | DisplayOnBook | int |  |  |
| 24 | CreatedDate | datetime |  |  |
| 25 | CreatedBy | nvarchar(50) |  |  |
| 26 | ModifiedDate | datetime |  |  |
| 27 | ModifiedBy | nvarchar(50) |  |  |
| 28 | UncompletedAccount | nvarchar(20) |  |  |
| 29 | UnResonableCost | bit |  |  |
| 30 | Type | int |  |  |
| 31 | BranchCode | nvarchar(255) |  |  |
| 32 | ExpenseItemID | uniqueidentifier |  |  |
| 33 | Code | nvarchar(50) |  |  |
| 34 | Name | nvarchar(255) |  |  |

## ImportOPNInventoryResultLog

Rows: 0 | Columns: 17

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | EventID | uniqueidentifier | NN |  |
| 2 | RefID | uniqueidentifier |  |  |
| 3 | RefType | int |  |  |
| 4 | DisplayOnBook | int |  |  |
| 5 | PostedDate | datetime |  |  |
| 6 | RefNo | nvarchar(50) |  |  |
| 7 | InventoryItemCode | nvarchar(50) |  |  |
| 8 | StockCode | nvarchar(20) |  |  |
| 9 | UnitName | nvarchar(20) |  |  |
| 10 | ExpiryDate | datetime |  |  |
| 11 | LotNo | nvarchar(50) |  |  |
| 12 | InventoryResaleTypeID | int |  |  |
| 13 | SortOrder | int |  |  |
| 14 | Description | nvarchar(MAX) |  |  |
| 15 | TecnInfo | nvarchar(MAX) |  |  |
| 16 | JournalMemo | nvarchar(400) |  |  |
| 17 | ViewReferenceDetail | nvarchar(100) |  |  |

## ImportOPNLogConfig

Rows: 0 | Columns: 5

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | EventID | uniqueidentifier | NN |  |
| 2 | DisplayOnBookConfig | nvarchar(255) |  |  |
| 3 | CheckedConfig | nvarchar(MAX) |  |  |
| 4 | GridCountConfigFinance | nvarchar(MAX) |  |  |
| 5 | GridCountConfigManagement | nvarchar(MAX) |  |  |

## ImportOPNResultLog

Rows: 0 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | EventID | uniqueidentifier | NN |  |
| 2 | RefID | uniqueidentifier |  |  |
| 3 | RefType | int |  |  |
| 4 | DisplayOnBook | int |  |  |
| 5 | AccountNumber | nvarchar(20) |  |  |
| 6 | CurrencyID | nvarchar(3) |  |  |
| 7 | BankAccountNumber | nvarchar(50) |  |  |
| 8 | AccountObjectCode | nvarchar(50) |  |  |
| 9 | Description | nvarchar(MAX) |  |  |
| 10 | TecnInfo | nvarchar(MAX) |  |  |

## ImportOpeningAccountEntry

Rows: 0 | Columns: 22

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefType | int | NN |  |
| 3 | PostedDate | datetime |  |  |
| 4 | AccountNumber | nvarchar(20) |  |  |
| 5 | AccountObjectID | uniqueidentifier |  |  |
| 6 | AccountObjectCode | nvarchar(128) |  |  |
| 7 | CurrencyID | nvarchar(3) |  |  |
| 8 | ExchangeRate | decimal(18,4) |  |  |
| 9 | DebitAmountOC | decimal(18,4) |  |  |
| 10 | DebitAmount | decimal(18,4) |  |  |
| 11 | CreditAmountOC | decimal(18,4) |  |  |
| 12 | CreditAmount | decimal(18,4) |  |  |
| 13 | BankAccountID | uniqueidentifier |  |  |
| 14 | BankAccountNumber | nvarchar(50) |  |  |
| 15 | BranchID | uniqueidentifier |  |  |
| 16 | BranchCode | nvarchar(20) |  |  |
| 17 | DisplayOnBook | int |  |  |
| 18 | IsPostedCashBook | bit |  |  |
| 19 | CashBookPostedDate | datetime |  |  |
| 20 | IsPostedManagement | bit | NN |  |
| 21 | IsPostedFinance | bit | NN |  |
| 22 | IsAutoGenerate | bit | NN |  |

## ImportOpeningAccountEntryDetail

Rows: 0 | Columns: 27

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier |  | ImportOpeningAccountEntry.RefID |
| 3 | EmployeeID | uniqueidentifier |  |  |
| 4 | EmployeeCode | nvarchar(128) |  |  |
| 5 | OrganizationUnitID | uniqueidentifier |  |  |
| 6 | OrganizationUnitCode | nvarchar(20) |  |  |
| 7 | ExpenseItemID | uniqueidentifier |  |  |
| 8 | ExpenseItemCode | nvarchar(20) |  |  |
| 9 | JobID | uniqueidentifier |  |  |
| 10 | JobCode | nvarchar(25) |  |  |
| 11 | ProjectWorkID | uniqueidentifier |  |  |
| 12 | ProjectWorkCode | nvarchar(20) |  |  |
| 13 | OrderID | uniqueidentifier |  |  |
| 14 | SAOrderRefNo | nvarchar(50) |  |  |
| 15 | PUOrderRefID | uniqueidentifier |  |  |
| 16 | PUOrderRefNo | nvarchar(50) |  |  |
| 17 | ContractID | uniqueidentifier |  |  |
| 18 | OPNContractCode | nvarchar(50) |  |  |
| 19 | PUContractID | uniqueidentifier |  |  |
| 20 | OPNPUContractCode | nvarchar(50) |  |  |
| 21 | ListItemID | uniqueidentifier |  |  |
| 22 | ListItemCode | nvarchar(50) |  |  |
| 23 | DebitAmountOC | decimal(18,4) |  |  |
| 24 | DebitAmount | decimal(18,4) |  |  |
| 25 | CreditAmountOC | decimal(18,4) |  |  |
| 26 | CreditAmount | decimal(18,4) |  |  |
| 27 | SortOrder | int | NN |  |

## ImportOpeningAccountEntryDetailInvoice

Rows: 0 | Columns: 16

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier |  | ImportOpeningAccountEntry.RefID |
| 3 | InvDate | datetime |  |  |
| 4 | InvNo | nvarchar(50) |  |  |
| 5 | DueDate | datetime |  |  |
| 6 | EmployeeID | uniqueidentifier |  |  |
| 7 | EmployeeCode | nvarchar(50) |  |  |
| 8 | ExchangeRate | decimal(18,4) |  |  |
| 9 | InvoiceAmountOC | decimal(18,4) | NN |  |
| 10 | InvoiceAmount | decimal(18,4) | NN |  |
| 11 | AmountOC | decimal(18,4) | NN |  |
| 12 | Amount | decimal(18,4) | NN |  |
| 13 | SortOrder | int | NN |  |
| 14 | IsAutoGenerate | bit | NN |  |
| 15 | PayAmountOC | decimal(18,4) | NN |  |
| 16 | PayAmount | decimal(18,4) | NN |  |

## ImportOpeningInventoryEntry

Rows: 0 | Columns: 36

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefType | int | NN |  |
| 3 | PostedDate | datetime | NN |  |
| 4 | RefNo | nvarchar(20) |  |  |
| 5 | InventoryItemID | uniqueidentifier |  |  |
| 6 | InventoryItemCode | nvarchar(50) |  |  |
| 7 | StockID | uniqueidentifier |  |  |
| 8 | StockCode | nvarchar(20) |  |  |
| 9 | UnitID | uniqueidentifier |  |  |
| 10 | UnitName | nvarchar(20) |  |  |
| 11 | Quantity | decimal(22,8) |  |  |
| 12 | UnitPrice | decimal(18,4) |  |  |
| 13 | Amount | decimal(18,4) |  |  |
| 14 | ExpiryDate | datetime |  |  |
| 15 | LotNo | nvarchar(50) |  |  |
| 16 | MainUnitID | uniqueidentifier |  |  |
| 17 | MainUnitName | nvarchar(20) |  |  |
| 18 | MainQuantity | decimal(22,8) |  |  |
| 19 | MainUnitPrice | decimal(18,4) |  |  |
| 20 | MainConvertRate | decimal(18,4) |  |  |
| 21 | ExchangeRateOperator | nvarchar(3) |  |  |
| 22 | BranchID | uniqueidentifier |  |  |
| 23 | BranchCode | nvarchar(20) |  |  |
| 24 | DisplayOnBook | int |  |  |
| 25 | RefOrder | int |  |  |
| 26 | SortOrder | int |  |  |
| 27 | IsPostedInventoryBook | bit | NN |  |
| 28 | InventoryPostedDate | datetime |  |  |
| 29 | InventoryResaleTypeID | int |  |  |
| 30 | INRefOrder | datetime |  |  |
| 31 | InventoryItemName | nvarchar(500) |  |  |
| 32 | PanelLengthQuantity | decimal(22,8) | NN |  |
| 33 | PanelWidthQuantity | decimal(22,8) | NN |  |
| 34 | PanelHeightQuantity | decimal(22,8) | NN |  |
| 35 | PanelRadiusQuantity | decimal(22,8) | NN |  |
| 36 | PanelQuantity | decimal(22,8) | NN |  |

## ImportPreReceiptRevenue

Rows: 0 | Columns: 14

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | PreReceiptRevenueID | uniqueidentifier | PK NN |  |
| 2 | PreReceiptRevenueCode | nvarchar(20) |  |  |
| 3 | PreReceiptRevenueName | nvarchar(128) |  |  |
| 4 | RefDate | datetime | NN |  |
| 5 | RecordDate | datetime | NN |  |
| 6 | RefType | int | NN |  |
| 7 | Amount | decimal(18,4) |  |  |
| 8 | AllocatedAmount | decimal(18,4) |  |  |
| 9 | AllocationTime | int |  |  |
| 10 | AllocatedTime | int |  |  |
| 11 | AllocationAmount | decimal(18,4) |  |  |
| 12 | BranchID | uniqueidentifier |  |  |
| 13 | BranchCode | nvarchar(20) |  |  |
| 14 | DisplayOnBook | int |  |  |

## ImportPrepaidExpenses

Rows: 0 | Columns: 13

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | PrepaidExpensesID | uniqueidentifier | PK NN |  |
| 2 | PrepaidExpensesCode | nvarchar(20) |  |  |
| 3 | PrepaidExpensesName | nvarchar(128) |  |  |
| 4 | RefDate | datetime | NN |  |
| 5 | RefType | int | NN |  |
| 6 | Amount | decimal(18,4) |  |  |
| 7 | AllocatedAmount | decimal(18,4) |  |  |
| 8 | AllocationTime | int |  |  |
| 9 | AllocatedTime | int |  |  |
| 10 | AllocationAmount | decimal(18,4) |  |  |
| 11 | BranchID | uniqueidentifier |  |  |
| 12 | BranchCode | nvarchar(20) |  |  |
| 13 | DisplayOnBook | int |  |  |

## ImportReferenceColumn

Rows: 129 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReferenceID | uniqueidentifier | PK NN |  |
| 2 | TableName | nvarchar(255) |  |  |
| 3 | ColumnName | nvarchar(255) |  |  |
| 4 | Description | nvarchar(255) |  |  |

## ImportSUIncrement

Rows: 0 | Columns: 35

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SupplyID | uniqueidentifier | PK NN |  |
| 2 | SupplyCode | nvarchar(25) | NN |  |
| 3 | SupplyName | nvarchar(255) |  |  |
| 4 | BranchID | uniqueidentifier | NN |  |
| 5 | RefType | int | NN |  |
| 6 | RefDate | datetime |  |  |
| 7 | RefNo | nvarchar(20) | NN |  |
| 8 | IsPostedManagement | bit | NN |  |
| 9 | Unit | nvarchar(20) |  |  |
| 10 | Quantity | decimal(22,8) | NN |  |
| 11 | UnitPrice | decimal(20,6) | NN |  |
| 12 | Amount | decimal(18,4) | NN |  |
| 13 | AllocationTime | int | NN |  |
| 14 | RemainingAllocationTime | int | NN |  |
| 15 | AllocatedAmount | decimal(18,4) | NN |  |
| 16 | RemaingAmount | decimal(18,4) | NN |  |
| 17 | TermlyAllocationAmount | decimal(18,4) | NN |  |
| 18 | SupplyCategoryID | uniqueidentifier |  |  |
| 19 | AllocationAccount | nvarchar(20) |  |  |
| 20 | DisplayOnBook | int | NN |  |
| 21 | EditVersion | timestamp |  |  |
| 22 | RefOrder | int | NN |  |
| 23 | CreatedDate | datetime |  |  |
| 24 | CreatedBy | nvarchar(50) |  |  |
| 25 | ModifiedDate | datetime |  |  |
| 26 | ModifiedBy | nvarchar(50) |  |  |
| 27 | IsPostedFinance | bit | NN |  |
| 28 | SUAuditRefID | uniqueidentifier |  |  |
| 29 | SupplyOtherBookID | uniqueidentifier |  |  |
| 30 | FADecrementRefID | uniqueidentifier |  |  |
| 31 | INPURefDetailID | nvarchar(MAX) |  |  |
| 32 | ReasonIncrement | nvarchar(255) |  |  |
| 33 | SuspendAllocate | bit | NN |  |
| 34 | SupplyGroup | nvarchar(255) |  |  |
| 35 | BranchCode | nvarchar(20) |  |  |

## ImportTable

Rows: 206 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ImportTableID | uniqueidentifier | PK NN |  |
| 2 | ImportItemID | uniqueidentifier | NN | ImportItem.ImportItemID |
| 3 | TableID | nvarchar(100) | NN |  |
| 4 | TableName | nvarchar(255) |  |  |
| 5 | Description | nvarchar(255) |  |  |
| 6 | Validate | nvarchar(500) |  |  |
| 7 | ValidateCaption | nvarchar(500) |  |  |
| 8 | SortOrder | int |  |  |
| 9 | IsTableMaster | bit | NN |  |
| 10 | ModifiedDate | datetime |  |  |

## MISAOrderNotificationKey

Rows: 0 | Columns: 2

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SessionKey | uniqueidentifier |  |  |
| 2 | MISAOrderID | uniqueidentifier |  |  |

## MSC_AudittingLog

Rows: 93,972 | Columns: 18

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | EventID | uniqueidentifier | PK NN |  |
| 2 | LoginName | nvarchar(100) |  |  |
| 3 | ComputerName | nvarchar(100) |  |  |
| 4 | ComputerIP | nvarchar(100) |  |  |
| 6 | ApplicationPartAlias | nvarchar(255) |  |  |
| 7 | PermissionTypeAlias | nvarchar(255) |  |  |
| 8 | Time | datetime |  |  |
| 9 | Description | nvarchar(MAX) |  |  |
| 10 | Reference | nvarchar(MAX) |  |  |
| 13 | RefID | uniqueidentifier |  |  |
| 14 | RefType | int |  |  |
| 15 | UserID | uniqueidentifier |  |  |
| 16 | BranchID | uniqueidentifier |  |  |
| 17 | ReferenceManagement | nvarchar(MAX) |  |  |
| 18 | IsWorkingWithManagementBook | nvarchar(255) |  |  |
| 19 | ApplicationPartCode | nvarchar(100) |  |  |
| 20 | Parameter | nvarchar(100) |  |  |
| 21 | SessionID | uniqueidentifier |  |  |

## MSC_AudittingLogDetail

Rows: 0 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | EventDetailID | uniqueidentifier | PK NN |  |
| 2 | EventID | uniqueidentifier | NN | MSC_AudittingLog.EventID |
| 3 | RefID | uniqueidentifier |  |  |

## MSC_ConfirmPassword

Rows: 17 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ConfirmPasswordID | uniqueidentifier | PK NN |  |
| 2 | UserID | uniqueidentifier | NN | MSC_User.UserID |
| 3 | ConfirmPasswordCode | nvarchar(50) | NN |  |
| 4 | CreatedDate | datetime | NN |  |

## MSC_Permission

Rows: 56 | Columns: 5

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | PermissionID | nvarchar(50) | PK NN |  |
| 2 | PermissionAlias | nvarchar(50) |  |  |
| 3 | PermissionName | nvarchar(50) |  |  |
| 4 | Description | nvarchar(255) |  |  |
| 5 | SortOrder | int |  |  |

## MSC_RegisPermisionForSubSystem

Rows: 2,604 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ID | uniqueidentifier | PK NN |  |
| 2 | SubSystemCode | nvarchar(255) |  | MSC_SubSystem.SubSystemCode |
| 3 | PermissionID | nvarchar(50) |  | MSC_Permission.PermissionID |

## MSC_RegisPermisionMobileForSubSystem

Rows: 15 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ID | uniqueidentifier | PK NN |  |
| 2 | SubSystemCode | nvarchar(255) |  | MSC_SubSystem_Mobile.SubSystemCode |
| 3 | PermissionID | nvarchar(50) |  | MSC_Permission.PermissionID |

## MSC_Role

Rows: 18 | Columns: 5

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RoleID | uniqueidentifier | PK NN |  |
| 2 | RoleCode | nvarchar(20) |  |  |
| 3 | RoleName | nvarchar(128) |  |  |
| 4 | Description | nvarchar(255) |  |  |
| 5 | IsSystem | bit | NN |  |

## MSC_RolePermissionMaping

Rows: 6,292 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ID | uniqueidentifier | PK NN |  |
| 2 | SubSystemCode | nvarchar(255) | NN | MSC_SubSystem.SubSystemCode |
| 3 | RoleID | uniqueidentifier | NN | MSC_Role.RoleID |
| 4 | PermissionID | nvarchar(50) | NN | MSC_Permission.PermissionID |

## MSC_RolePermissionMaping_Mobile

Rows: 34 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ID | uniqueidentifier | PK NN |  |
| 2 | SubSystemCode | nvarchar(255) | NN | MSC_SubSystem_Mobile.SubSystemCode |
| 3 | RoleID | uniqueidentifier | NN | MSC_Role_Mobile.RoleID |
| 4 | PermissionID | nvarchar(50) | NN | MSC_Permission.PermissionID |

## MSC_Role_Mobile

Rows: 3 | Columns: 5

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RoleID | uniqueidentifier | PK NN |  |
| 2 | RoleCode | nvarchar(20) |  |  |
| 3 | RoleName | nvarchar(128) |  |  |
| 4 | Description | nvarchar(255) |  |  |
| 5 | IsSystem | bit | NN |  |

## MSC_SubSystem

Rows: 562 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SubSystemCode | nvarchar(255) | PK NN |  |
| 2 | SubSystemName | nvarchar(255) |  |  |
| 3 | Description | nvarchar(255) |  |  |
| 4 | ParentSubSystemCode | nvarchar(255) |  |  |
| 5 | SortOrder | int |  |  |
| 6 | SystemType | int |  |  |
| 7 | SubSystemSerial | nvarchar(500) |  |  |

## MSC_SubSystem_Mobile

Rows: 15 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SubSystemCode | nvarchar(255) | PK NN |  |
| 2 | SubSystemName | nvarchar(255) |  |  |
| 3 | Description | nvarchar(255) |  |  |
| 4 | ParentSubSystemCode | nvarchar(255) |  |  |
| 5 | SortOrder | int |  |  |
| 6 | SystemType | int |  |  |
| 7 | SubSystemSerial | nvarchar(500) |  |  |

## MSC_User

Rows: 17 | Columns: 27

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | UserID | uniqueidentifier | PK NN |  |
| 2 | UserName | nvarchar(50) | NN |  |
| 3 | Password | nvarchar(50) |  |  |
| 4 | PasswordEncryption | nchar(10) |  |  |
| 5 | JobTitle | nvarchar(128) |  |  |
| 6 | FullName | nvarchar(128) |  |  |
| 7 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 8 | Description | nvarchar(255) |  |  |
| 9 | Email | nvarchar(100) |  |  |
| 10 | WorkPhone | nchar(50) |  |  |
| 11 | MobilePhone | nvarchar(50) |  |  |
| 12 | Fax | nchar(50) |  |  |
| 13 | WorkAddress | nvarchar(255) |  |  |
| 14 | HomeAddress | nvarchar(255) |  |  |
| 15 | Photo | varbinary |  |  |
| 16 | IsWorkingWithFinanceBook | bit | NN |  |
| 17 | IsWorkingWithManagementBook | bit | NN |  |
| 18 | Inactive | bit | NN |  |
| 19 | IsSystem | bit | NN |  |
| 20 | NotifyEmailDate | datetime |  |  |
| 21 | MISAID | nvarchar(50) |  |  |
| 22 | IsInvite | bit | NN |  |
| 23 | LastName | nvarchar(128) |  |  |
| 24 | FirstName | nvarchar(128) |  |  |
| 25 | UserStatus | int | NN |  |
| 26 | ActiveType | int | NN |  |
| 27 | IsActived | bit | NN |  |

## MSC_UserJoinRole

Rows: 340 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | UserJoinRoleID | uniqueidentifier | PK NN |  |
| 2 | UserID | uniqueidentifier |  | MSC_User.UserID |
| 3 | RoleID | uniqueidentifier |  | MSC_Role.RoleID |
| 4 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 5 | BranchCode | nvarchar(MAX) |  |  |
| 6 | IsViewIncludeDependBranch | bit | NN |  |

## MSC_UserJoinRole_Mobile

Rows: 0 | Columns: 5

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | UserJoinRoleID | uniqueidentifier | PK NN |  |
| 2 | UserID | uniqueidentifier |  | MSC_User_Mobile.UserID |
| 3 | RoleID | uniqueidentifier |  | MSC_Role_Mobile.RoleID |
| 4 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 5 | BranchCode | nvarchar(MAX) |  |  |

## MSC_User_Mobile

Rows: 0 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | UserID | uniqueidentifier | PK NN |  |
| 2 | EmployeeID | uniqueidentifier |  |  |
| 3 | JobTitle | nvarchar(128) |  |  |
| 4 | FullName | nvarchar(128) |  |  |
| 5 | MobilePhone | nvarchar(50) |  |  |
| 6 | Email | nvarchar(100) |  |  |
| 7 | LastName | nvarchar(128) |  |  |
| 8 | FirstName | nvarchar(128) |  |  |
| 9 | UserName | nvarchar(50) |  |  |
| 10 | IsViewSalary | bit |  |  |

## ReportColumnCaption

Rows: 347 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ID | uniqueidentifier | PK NN |  |
| 2 | ReportID | nvarchar(100) |  |  |
| 3 | ColumnName | nvarchar(100) |  |  |
| 4 | ColumnCaption | nvarchar(255) |  |  |
| 5 | ColumnWidth | int |  |  |
| 6 | IsHidden | bit |  |  |
| 7 | ReportTitle | nvarchar(255) |  |  |

## ReportConfigToPrint

Rows: 0 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ID | uniqueidentifier | PK NN |  |
| 2 | ReportFile | varchar(100) |  |  |
| 3 | InvNo | nvarchar(22) |  |  |
| 4 | InvSeries | nvarchar(20) |  |  |
| 5 | PrintNumber | int | NN |  |
| 6 | UserName | nvarchar(255) |  |  |
| 7 | LastPrint | datetime |  |  |

## ReportFilter

Rows: 0 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | FilterID | uniqueidentifier | PK NN |  |
| 2 | ReportID | nvarchar(100) | NN |  |
| 3 | DefaultFilter | nvarchar(500) |  |  |
| 4 | UserID | uniqueidentifier |  |  |
| 5 | FilterMode | int |  |  |
| 6 | ModifiedDate | datetime |  |  |

## ReportFilterColumn

Rows: 48 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReportID | nvarchar(100) | NN |  |
| 2 | FieldName | nvarchar(255) | NN |  |
| 3 | FieldCaption | nvarchar(255) | NN |  |
| 4 | FieldType | int | NN |  |
| 5 | SortOrder | int |  |  |
| 6 | Inactive | bit |  |  |

## ReportFilterDetail

Rows: 0 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | FilterDetailID | uniqueidentifier | PK NN |  |
| 2 | FilterID | uniqueidentifier | NN | ReportFilter.FilterID |
| 3 | FieldName | nvarchar(255) |  |  |
| 4 | FieldType | int |  |  |
| 5 | Condition | int |  |  |
| 6 | Value1 | nvarchar(255) |  |  |
| 7 | Value2 | nvarchar(255) |  |  |
| 8 | SortOrder | int | NN ID |  |

## ReportSigner

Rows: 0 | Columns: 12

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | TitleID | varchar(100) | NN |  |
| 2 | ReportID | varchar(100) | NN |  |
| 3 | BranchID | uniqueidentifier | NN |  |
| 4 | Title | nvarchar(50) |  |  |
| 5 | SignerTitleVi | nvarchar(50) |  |  |
| 6 | SignerTitleEn | nvarchar(50) |  |  |
| 7 | SignerTitleZh | nvarchar(50) |  |  |
| 8 | SignerTitleKo | nvarchar(50) |  |  |
| 9 | SignerName | nvarchar(50) |  |  |
| 10 | SortOrder | int | NN |  |
| 11 | IsShowSigner | bit | NN |  |
| 12 | IsSystem | bit | NN |  |

# 22 — Hóa đơn điện tử

## DeadlockInvoice

Rows: 0 | Columns: 12

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier |  |  |
| 2 | TransactionID | varchar(42) |  |  |
| 3 | PublishStatus | int |  |  |
| 4 | SendEmailStatus | int |  |  |
| 5 | Receiver | nvarchar(128) |  |  |
| 6 | ReceiverEmail | nvarchar(128) |  |  |
| 7 | CompanyTaxCode | nvarchar(50) |  |  |
| 8 | InvSeries | nvarchar(25) |  |  |
| 9 | InvNo | nvarchar(25) |  |  |
| 10 | InvDate | datetime |  |  |
| 11 | InvoiceSytem | int |  |  |
| 12 | ModifiedDate | datetime |  |  |

## EIPlaceHolderInvoice

Rows: 0 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | IPTemplateID | uniqueidentifier | NN |  |
| 3 | InvTypeID | int | NN |  |
| 4 | InvTemplateNo | nvarchar(20) | NN |  |
| 5 | InvSeries | nvarchar(20) | NN |  |
| 6 | Quantity | int | NN |  |
| 7 | FromNo | nvarchar(20) | NN |  |
| 8 | ToNo | nvarchar(20) | NN |  |
| 9 | InvDate | datetime | NN |  |
| 10 | BranchID | uniqueidentifier | NN |  |

## EIPlaceHolderInvoiceDetail

Rows: 0 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | EIPlaceHolderInvoice.RefID |
| 3 | InvTypeID | int | NN |  |
| 4 | InvTemplateNo | nvarchar(20) | NN |  |
| 5 | InvSeries | nvarchar(20) | NN |  |
| 6 | InvNo | nvarchar(25) | NN |  |
| 7 | InvDate | datetime | NN |  |
| 8 | InvoiceRefID | uniqueidentifier |  |  |
| 9 | isBranchIssued | bit |  |  |
| 10 | BranchID | uniqueidentifier | NN |  |

## EInvoiceHubMapping

Rows: 0 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefType | int |  |  |
| 3 | Status | int |  |  |
| 4 | ErrorCode | nvarchar(50) |  |  |
| 5 | ErrorDescription | nvarchar(255) |  |  |
| 6 | PartnerCode | nvarchar(20) |  |  |
| 7 | CreatedDate | datetime |  |  |
| 8 | ModifiedDate | datetime |  |  |
| 9 | VoucherRefID | uniqueidentifier |  |  |
| 10 | InvoiceHubID | uniqueidentifier |  |  |

## EInvoiceReplacement

Rows: 0 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | EInvoiceReplacementID | uniqueidentifier | PK NN |  |
| 2 | ReplaceInvRefID | uniqueidentifier | NN |  |
| 3 | ReplaceInvRefType | int | NN |  |
| 4 | OrgInvRefID | uniqueidentifier |  |  |
| 5 | OrgInvRefType | int |  |  |
| 6 | OrgInvNo | nvarchar(50) | NN |  |
| 7 | OrgInvDate | datetime | NN |  |
| 8 | OrgInvTemplateNo | nvarchar(25) | NN |  |
| 9 | OrgInvSeries | nvarchar(20) | NN |  |

## EInvoiceStatus

Rows: 0 | Columns: 28

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | TransactionID | varchar(42) | PK NN |  |
| 2 | PublishStatus | int | NN |  |
| 3 | EmailSentTimes | int |  |  |
| 4 | ConvertToPaperTimes | int |  |  |
| 5 | ViewEInvoiceTimes | int |  |  |
| 6 | IsInvoiceDeleted | bit |  |  |
| 7 | DeletedReason | nvarchar(255) |  |  |
| 8 | InvoiceRefID | uniqueidentifier |  |  |
| 9 | IsInvoiceReceipted | bit |  |  |
| 10 | CreatedDate | datetime |  |  |
| 11 | CreatedBy | nvarchar(100) |  |  |
| 12 | ModifiedDate | datetime |  |  |
| 13 | ModifiedBy | nvarchar(100) |  |  |
| 14 | SendEmailStatus | int | NN |  |
| 15 | ReceiverName | nvarchar(255) |  |  |
| 16 | ReceiverEmail | nvarchar(255) |  |  |
| 17 | ReceiverNameFull | nvarchar(255) |  |  |
| 18 | ReceiverEmailFull | nvarchar(255) |  |  |
| 19 | CompanyTaxCode | nvarchar(50) |  |  |
| 20 | PaymentMethodPublish | nvarchar(50) |  |  |
| 21 | PaymentMethodInvoiceType | int |  |  |
| 22 | DateSendEmail | datetime |  |  |
| 23 | EISendTaxAuthorityStatus | int |  |  |
| 25 | CCEmail | nvarchar(MAX) |  |  |
| 26 | BCCEmail | nvarchar(MAX) |  |  |
| 27 | CCEmailFull | nvarchar(MAX) |  |  |
| 28 | BCCEmailFull | nvarchar(MAX) |  |  |
| 29 | NewTypeStatus | int | NN |  |

## EInvoiceSummary

Rows: 0 | Columns: 26

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefDate | datetime | NN |  |
| 3 | PeriodType | nvarchar(255) |  |  |
| 4 | Period | nvarchar(255) |  |  |
| 5 | FromDate | datetime | NN |  |
| 6 | ToDate | datetime | NN |  |
| 7 | AdditionTime | int |  |  |
| 8 | EditionTime | int |  |  |
| 9 | AdditionType | int |  |  |
| 10 | Times | int |  |  |
| 11 | CompanyName | nvarchar(400) |  |  |
| 12 | CompanyTaxCode | nvarchar(20) |  |  |
| 13 | InventoryItemTypeName | nvarchar(255) |  |  |
| 14 | InventoryItemType | int | NN |  |
| 15 | InvMethod | int | NN |  |
| 16 | IsFirstTime | bit | NN |  |
| 17 | IsSign | bit | NN |  |
| 18 | Status | int | NN |  |
| 19 | StatusName | nvarchar(100) |  |  |
| 20 | DisplayOnBook | int |  |  |
| 21 | BranchID | uniqueidentifier | NN |  |
| 22 | RefType | int | NN |  |
| 23 | SignBy | nvarchar(400) |  |  |
| 24 | SignDate | datetime |  |  |
| 25 | SendDate | datetime |  |  |
| 26 | CurrencyID | nvarchar(3) |  |  |

## EInvoiceSummaryDetail

Rows: 0 | Columns: 43

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | EInvoiceSummary.RefID |
| 3 | TransactionID | varchar(42) | NN |  |
| 4 | Amount | decimal(18,4) | NN |  |
| 5 | AmountOC | decimal(18,4) | NN |  |
| 6 | AmountWithoutVAT | decimal(18,4) | NN |  |
| 7 | AmountWithoutVATOC | decimal(18,4) | NN |  |
| 8 | BuyerAddress | nvarchar(400) |  |  |
| 9 | BuyerCode | nvarchar(50) |  |  |
| 10 | BuyerLegalName | nvarchar(400) |  |  |
| 11 | BuyerTaxCode | nvarchar(50) |  |  |
| 12 | VoucherRefID | uniqueidentifier |  |  |
| 13 | VoucherRefType | int |  |  |
| 14 | InvDate | datetime |  |  |
| 15 | InvNo | nvarchar(25) |  |  |
| 16 | InvoiceNote | nvarchar(255) |  |  |
| 17 | InvSeries | nvarchar(20) |  |  |
| 18 | InvStatus | int | NN |  |
| 19 | InvTemplateNo | nvarchar(25) |  |  |
| 20 | ItemCode | nvarchar(50) |  |  |
| 21 | ItemName | nvarchar(500) |  |  |
| 22 | OrgInvNo | nvarchar(25) |  |  |
| 23 | OrgInvoiceType | int |  |  |
| 24 | OrgInvSeries | nvarchar(20) |  |  |
| 25 | OrgInvTemplateNo | nvarchar(25) |  |  |
| 26 | OrgPeriod | nvarchar(255) |  |  |
| 27 | OrgPeriodType | nvarchar(255) |  |  |
| 28 | Quantity | decimal(18,4) |  |  |
| 29 | SortOrder | int |  |  |
| 30 | TaxRefDate | datetime |  |  |
| 31 | TaxRefNo | nvarchar(30) |  |  |
| 32 | UnitName | nvarchar(20) |  |  |
| 33 | VATAmount | decimal(18,4) |  |  |
| 34 | VATAmountOC | decimal(18,4) | NN |  |
| 35 | VATRateName | nvarchar(255) |  |  |
| 36 | OrgPeriodDate | datetime |  |  |
| 37 | UnitID | uniqueidentifier |  |  |
| 38 | VATRate | decimal(18,4) |  |  |
| 39 | InventoryItemID | uniqueidentifier |  |  |
| 40 | RowCustomStatus | int |  |  |
| 41 | FeeAmount | decimal(18,4) |  |  |
| 42 | FeeAmountOC | decimal(18,4) |  |  |
| 43 | ExchangeRate | decimal(18,4) |  |  |

## EInvoiceSummaryDetailReference

Rows: 0 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReferenceID | uniqueidentifier | PK NN |  |
| 2 | EInvoiceSummaryID | uniqueidentifier | NN | EInvoiceSummary.RefID |
| 3 | EInvoiceSummaryDetailID | uniqueidentifier | NN |  |
| 4 | SAInvoicePetroleumID | uniqueidentifier |  | SAInvoicePetroleum.RefID |
| 5 | SAInvoicePetroleumDetailID | uniqueidentifier |  |  |
| 6 | SAInvoiceID | uniqueidentifier |  | SAInvoice.RefID |
| 7 | SAInvoiceDetailID | uniqueidentifier |  |  |

## EinvoiceInfoND123Status

Rows: 8 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | StatusID | int | PK NN |  |
| 2 | StatusName | nvarchar(255) | NN |  |
| 3 | Description | nvarchar(500) |  |  |
| 4 | IsValidateCreateVoucher | bit | NN |  |

## EinvoiceSummaryReference

Rows: 0 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReferenceID | uniqueidentifier | PK NN |  |
| 2 | EInvoiceSummaryID | uniqueidentifier | NN |  |
| 3 | SAInvoicePetroleumID | uniqueidentifier |  | SAInvoicePetroleum.RefID |
| 4 | SAInvoiceID | uniqueidentifier |  | SAInvoice.RefID |

## IPAdjustAnnouncement

Rows: 0 | Columns: 19

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefDate | datetime | NN |  |
| 3 | RefNo | nvarchar(20) | NN |  |
| 4 | TaxOffice | nvarchar(255) |  |  |
| 5 | Status | int | NN |  |
| 6 | StatementDate | datetime |  |  |
| 7 | StatementNo | nvarchar(20) |  |  |
| 8 | StatementTaxOffice | nvarchar(255) |  |  |
| 9 | StatementFileName | nvarchar(255) |  |  |
| 10 | StatementFileContent | varbinary |  |  |
| 11 | IsAttachListOfInvoiceTransfer | bit | NN |  |
| 12 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 13 | ModifiedDate | datetime |  |  |
| 14 | CreatedDate | datetime |  |  |
| 15 | CreatedBy | nvarchar(50) |  |  |
| 16 | ModifiedBy | nvarchar(50) |  |  |
| 17 | EditVersion | timestamp |  |  |
| 18 | RefType | int |  |  |
| 19 | ChangeInfoContent | nvarchar(MAX) |  |  |

## IPAdjustAnnouncementDetail

Rows: 0 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | IPAdjustAnnouncement.RefID |
| 3 | InfoName | nvarchar(50) |  |  |
| 4 | OldInfo | nvarchar(255) |  |  |
| 5 | NewInfo | nvarchar(255) |  |  |
| 6 | SortOrder | int |  |  |

## IPCancelAnnouncement

Rows: 0 | Columns: 23

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefType | int |  |  |
| 3 | RefDate | datetime | NN |  |
| 4 | RefNo | nvarchar(20) | NN |  |
| 5 | TaxOffice | nvarchar(255) |  |  |
| 6 | CancelReason | nvarchar(255) |  |  |
| 7 | CancelMethod | nvarchar(255) |  |  |
| 8 | Status | tinyint |  |  |
| 9 | CancelDecisionDate | datetime |  |  |
| 10 | CancelDecisionNo | nvarchar(20) |  |  |
| 11 | CancelDecisionFileName | nvarchar(255) |  |  |
| 12 | CancelDecisionFileContent | varbinary |  |  |
| 13 | CancelMinutesDate | datetime |  |  |
| 14 | CancelMinutesNo | nvarchar(20) |  |  |
| 15 | CancelMinutesFileName | nvarchar(255) |  |  |
| 16 | CancelMinutesFileContent | varbinary |  |  |
| 17 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 18 | ModifiedDate | datetime |  |  |
| 19 | CreatedDate | datetime |  |  |
| 20 | CreatedBy | nvarchar(50) |  |  |
| 21 | ModifiedBy | nvarchar(50) |  |  |
| 22 | EditVersion | timestamp |  |  |
| 23 | MeInvoiceSyncDateTime | datetime |  |  |

## IPCancelAnnouncementDetail

Rows: 0 | Columns: 11

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | IPCancelAnnouncement.RefID |
| 3 | IPTemplateID | uniqueidentifier | NN | IPTemplate.IPTemplateID |
| 4 | InvTypeID | int | NN | InvType.InvTypeID |
| 5 | InvTemplateNo | nvarchar(20) | NN |  |
| 6 | InvSeries | nvarchar(20) | NN |  |
| 7 | FromNo | nvarchar(20) | NN |  |
| 8 | ToNo | nvarchar(20) | NN |  |
| 9 | Quantity | int | NN |  |
| 10 | SortOrder | int |  |  |
| 11 | IPTemplateIDCloud | uniqueidentifier |  |  |

## IPDeletedAnnouncement

Rows: 0 | Columns: 34

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefDate | datetime | NN |  |
| 3 | RefNo | nvarchar(20) | NN |  |
| 4 | RefType | int | NN |  |
| 5 | MinutesDate | datetime |  |  |
| 6 | MinutesNo | nvarchar(20) |  |  |
| 7 | MinutesReason | nvarchar(255) |  |  |
| 8 | MinutesFileName | nvarchar(255) |  |  |
| 9 | MinutesFileContent | varbinary |  |  |
| 10 | SAInvoiceRefID | uniqueidentifier |  |  |
| 11 | SAInvoiceRefType | int |  |  |
| 12 | InvNo | nvarchar(25) |  |  |
| 13 | InvDate | datetime |  |  |
| 14 | InvTemplateNo | nvarchar(20) |  |  |
| 15 | InvSeries | nvarchar(20) |  |  |
| 16 | AccountObjectCode | nvarchar(50) |  |  |
| 17 | AccountObjectName | nvarchar(400) |  |  |
| 18 | AccountObjectAddress | nvarchar(400) |  |  |
| 19 | Amount | decimal(18,4) |  |  |
| 20 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 21 | ModifiedDate | datetime |  |  |
| 22 | CreatedDate | datetime |  |  |
| 23 | CreatedBy | nvarchar(50) |  |  |
| 24 | ModifiedBy | nvarchar(50) |  |  |
| 25 | EditVersion | timestamp |  |  |
| 26 | InvTypeID | int | NN |  |
| 27 | IPVoucherRefID | uniqueidentifier |  |  |
| 28 | IncludeInvoice | bit |  |  |
| 29 | IsSendEmail | bit |  |  |
| 30 | IsSendDeletedInvoiceEmail | bit |  |  |
| 31 | DeletedReason | nvarchar(255) |  |  |
| 32 | IsSubmittedToTaxAuthories | bit |  |  |
| 33 | MeInvoiceSyncDateTime | datetime |  |  |
| 34 | IsOutBot | bit | NN |  |

## IPLBDAnnouncement

Rows: 0 | Columns: 17

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefDate | datetime | NN |  |
| 3 | RefType | int | NN |  |
| 4 | RefNo | nvarchar(20) | NN |  |
| 5 | TaxOffice | nvarchar(255) |  |  |
| 6 | Status | tinyint |  |  |
| 7 | MinutesDate | datetime |  |  |
| 8 | MinutesNo | nvarchar(20) |  |  |
| 9 | MinutesReason | nvarchar(255) |  |  |
| 10 | MinutesFileName | nvarchar(255) |  |  |
| 11 | MinutesFileContent | varbinary |  |  |
| 12 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 13 | ModifiedDate | datetime |  |  |
| 14 | CreatedDate | datetime |  |  |
| 15 | CreatedBy | nvarchar(50) |  |  |
| 16 | ModifiedBy | nvarchar(50) |  |  |
| 17 | EditVersion | timestamp |  |  |

## IPLBDAnnouncementDetail

Rows: 0 | Columns: 12

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | IPLBDAnnouncement.RefID |
| 3 | IPTemplateID | uniqueidentifier |  | IPTemplate.IPTemplateID |
| 4 | InvTypeID | int | NN | InvType.InvTypeID |
| 5 | InvTemplateNo | nvarchar(20) | NN |  |
| 6 | InvSeries | nvarchar(20) | NN |  |
| 7 | FromNo | nvarchar(20) | NN |  |
| 8 | ToNo | nvarchar(20) | NN |  |
| 9 | Quantity | int | NN |  |
| 10 | CopyPart | nvarchar(25) |  |  |
| 11 | Description | nvarchar(255) |  |  |
| 12 | SortOrder | int |  |  |

## IPListInvoiceAttachment

Rows: 0 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | IPAdjustAnnouncement.RefID |
| 3 | InvTypeID | int | NN |  |
| 4 | InvTemplateNo | nvarchar(20) | NN |  |
| 5 | InvSeries | nvarchar(20) | NN |  |
| 6 | FromNo | nvarchar(20) | NN |  |
| 7 | ToNo | nvarchar(20) | NN |  |
| 8 | Quantity | int | NN |  |
| 9 | SortOrder | int |  |  |

## IPPublishAnnouncement

Rows: 0 | Columns: 14

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefDate | datetime | NN |  |
| 3 | RefNo | nvarchar(20) | NN |  |
| 4 | RefType | int |  |  |
| 5 | TaxOffice | nvarchar(128) |  |  |
| 6 | Status | tinyint |  |  |
| 7 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 8 | ModifiedDate | datetime |  |  |
| 9 | CreatedDate | datetime |  |  |
| 10 | CreatedBy | nvarchar(50) |  |  |
| 11 | ModifiedBy | nvarchar(50) |  |  |
| 12 | EditVersion | timestamp |  |  |
| 13 | RefIDCloud | uniqueidentifier |  |  |
| 14 | IPPublishType | int |  |  |

## IPPublishAnnouncementDetail

Rows: 0 | Columns: 15

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | IPPublishAnnouncement.RefID |
| 3 | IPTemplateID | uniqueidentifier |  | IPTemplate.IPTemplateID |
| 4 | InvTypeID | int | NN |  |
| 5 | InvTemplateNo | nvarchar(20) |  |  |
| 6 | InvSeries | nvarchar(20) | NN |  |
| 7 | Quantity | int | NN |  |
| 8 | FromNo | nvarchar(20) | NN |  |
| 9 | ToNo | nvarchar(20) | NN |  |
| 10 | UsingStartedDate | datetime |  |  |
| 11 | VendorName | nvarchar(400) |  |  |
| 12 | VendorTaxCode | nvarchar(50) |  |  |
| 13 | ContractCode | nvarchar(20) |  |  |
| 14 | ContractDate | datetime |  |  |
| 15 | SortOrder | int |  |  |

## IPPublishAnnouncementDetailAllocation

Rows: 0 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | AllocationID | uniqueidentifier | PK NN |  |
| 2 | RefDetailID | uniqueidentifier | NN | IPPublishAnnouncementDetail.RefDetailID |
| 3 | RefID | uniqueidentifier | NN |  |
| 4 | BranchID | uniqueidentifier | NN | OrganizationUnit.OrganizationUnitID |
| 5 | Quantity | int | NN |  |
| 6 | FromNo | nvarchar(20) | NN |  |
| 7 | ToNo | nvarchar(20) | NN |  |
| 8 | SortOrder | int |  |  |

## IPRegister

Rows: 0 | Columns: 15

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefDate | datetime | NN |  |
| 3 | RefNo | nvarchar(20) | NN |  |
| 4 | Description | nvarchar(255) |  |  |
| 5 | Signer | nvarchar(50) |  |  |
| 6 | Status | tinyint |  |  |
| 7 | AttachFileName | nvarchar(255) |  |  |
| 8 | AttachFileContent | varbinary |  |  |
| 9 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 10 | ModifiedDate | datetime |  |  |
| 11 | CreatedDate | datetime |  |  |
| 12 | CreatedBy | nvarchar(50) |  |  |
| 13 | ModifiedBy | nvarchar(50) |  |  |
| 14 | EditVersion | timestamp |  |  |
| 15 | RefType | int |  |  |

## IPRegisterDetail

Rows: 0 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | IPRegister.RefID |
| 3 | IPTemplateID | uniqueidentifier | NN | IPTemplate.IPTemplateID |
| 4 | UsingPurpose | nvarchar(255) |  |  |

## IPRegisterEInvoice

Rows: 0 | Columns: 22

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefDate | datetime | NN |  |
| 3 | RefNo | nvarchar(20) | NN |  |
| 4 | TaxPayerName | nvarchar(255) |  |  |
| 5 | TaxCode | nvarchar(50) |  |  |
| 6 | ContactName | nvarchar(128) |  |  |
| 7 | ContactAddress | nvarchar(255) |  |  |
| 8 | ContactEmail | nvarchar(100) |  |  |
| 9 | ContactTel | nvarchar(50) |  |  |
| 10 | InvoiceType | int |  |  |
| 11 | RegistrationMethod | int |  |  |
| 12 | IsInvoiceValueAdded | bit |  |  |
| 13 | IsSaleInvoice | bit |  |  |
| 14 | IsInvoiceFromECR | bit |  |  |
| 15 | IsOtherInvoice | bit |  |  |
| 16 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 17 | ModifiedDate | datetime |  |  |
| 18 | CreatedDate | datetime |  |  |
| 19 | CreatedBy | nvarchar(50) |  |  |
| 20 | ModifiedBy | nvarchar(50) |  |  |
| 21 | EditVersion | timestamp |  |  |
| 22 | RefType | int |  |  |

## IPRegisterEInvoiceDetail

Rows: 0 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | IPRegisterEInvoice.RefID |
| 3 | OrganizationRecognizedSignal | nvarchar(255) |  |  |
| 4 | SerialNumberOfDeed | nvarchar(255) |  |  |
| 5 | FromDateOfDeed | date |  |  |
| 6 | ToDateOfDeed | date |  |  |
| 7 | RegistrationForm | nvarchar(50) |  |  |
| 8 | SortOrder | decimal(22,8) |  |  |

## IPTemplate

Rows: 0 | Columns: 90

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | IPTemplateID | uniqueidentifier | PK NN |  |
| 2 | ReportName | nvarchar(128) | NN |  |
| 3 | InvTypeID | int |  |  |
| 4 | InvMethod | int |  |  |
| 5 | MISAReportID | varchar(100) |  | SYSReportList.ReportID |
| 6 | ReportFileName | nvarchar(255) |  |  |
| 7 | ScriptFileName | nvarchar(255) |  |  |
| 8 | ReportFileContent | varbinary |  |  |
| 9 | CopyNumber | int | NN |  |
| 10 | TemplateSortOrder | int | NN |  |
| 11 | InvTemplateNo | nvarchar(20) | NN |  |
| 12 | IsUseOtherGetDataScript | bit |  |  |
| 13 | IsUseOtherReportTemplate | bit |  |  |
| 14 | InvSeries | nvarchar(8) |  |  |
| 15 | CC1Purpose | nvarchar(255) |  |  |
| 16 | CC2Purpose | nvarchar(255) |  |  |
| 17 | CC3Purpose | nvarchar(255) |  |  |
| 18 | CC4Purpose | nvarchar(255) |  |  |
| 19 | CC5Purpose | nvarchar(255) |  |  |
| 20 | CC6Purpose | nvarchar(255) |  |  |
| 21 | CC7Purpose | nvarchar(255) |  |  |
| 22 | CC8Purpose | nvarchar(255) |  |  |
| 23 | CC9Purpose | nvarchar(255) |  |  |
| 24 | CC1Color | nvarchar(255) |  |  |
| 25 | CC2Color | nvarchar(255) |  |  |
| 26 | CC3Color | nvarchar(255) |  |  |
| 27 | CC4Color | nvarchar(255) |  |  |
| 28 | CC5Color | nvarchar(255) |  |  |
| 29 | CC6Color | nvarchar(255) |  |  |
| 30 | CC7Color | nvarchar(255) |  |  |
| 31 | CC8Color | nvarchar(255) |  |  |
| 32 | CC9Color | nvarchar(255) |  |  |
| 33 | CC1Background | varbinary |  |  |
| 34 | CC2Background | varbinary |  |  |
| 35 | CC3Background | varbinary |  |  |
| 36 | CC4Background | varbinary |  |  |
| 37 | CC5Background | varbinary |  |  |
| 38 | CC6Background | varbinary |  |  |
| 39 | CC7Background | varbinary |  |  |
| 40 | CC8Background | varbinary |  |  |
| 41 | CC9Background | varbinary |  |  |
| 42 | FileStyle | varbinary |  |  |
| 43 | AlighTop | decimal(3,2) |  |  |
| 44 | AlighLeft | decimal(3,2) |  |  |
| 45 | AlighBottom | decimal(3,2) |  |  |
| 46 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 47 | ModifiedDate | datetime |  |  |
| 48 | CreatedDate | datetime |  |  |
| 49 | CreatedBy | nvarchar(50) |  |  |
| 50 | ModifiedBy | nvarchar(50) |  |  |
| 51 | EditVersion | timestamp |  |  |
| 52 | CC1BackgroundFileName | nvarchar(255) |  |  |
| 53 | CC2BackgroundFileName | nvarchar(255) |  |  |
| 54 | CC3BackgroundFileName | nvarchar(255) |  |  |
| 55 | CC4BackgroundFileName | nvarchar(255) |  |  |
| 56 | CC5BackgroundFileName | nvarchar(255) |  |  |
| 57 | CC6BackgroundFileName | nvarchar(255) |  |  |
| 58 | CC7BackgroundFileName | nvarchar(255) |  |  |
| 59 | CC8BackgroundFileName | nvarchar(255) |  |  |
| 60 | CC9BackgroundFileName | nvarchar(255) |  |  |
| 61 | CustomReportID | nvarchar(500) | NN |  |
| 62 | IsPublishedByRevenue | bit |  |  |
| 63 | IsPerpetuumReport | bit | NN |  |
| 64 | CC1PurposeEng | nvarchar(255) |  |  |
| 65 | CC2PurposeEng | nvarchar(255) |  |  |
| 66 | CC3PurposeEng | nvarchar(255) |  |  |
| 67 | CC4PurposeEng | nvarchar(255) |  |  |
| 68 | CC5PurposeEng | nvarchar(255) |  |  |
| 69 | CC6PurposeEng | nvarchar(255) |  |  |
| 70 | CC7PurposeEng | nvarchar(255) |  |  |
| 71 | CC8PurposeEng | nvarchar(255) |  |  |
| 72 | CC9PurposeEng | nvarchar(255) |  |  |
| 73 | IsConvertTemplate | bit | NN |  |
| 74 | EInvoiceTemplateID | uniqueidentifier |  |  |
| 75 | IsCreatedBeforeUsingEInvoice | bit | NN |  |
| 76 | EInvoiceInvTypeCode | nvarchar(20) |  |  |
| 77 | UsedEInvoiceTemplateID | uniqueidentifier |  |  |
| 78 | SignedDate | datetime |  |  |
| 79 | SellerLegalName | nvarchar(255) |  |  |
| 80 | TemplateType | int |  |  |
| 81 | ConnectCompanyTaxCode | nvarchar(50) |  |  |
| 82 | IPTemplateIDCloud | uniqueidentifier |  |  |
| 83 | IsINSerialNumber | bit | NN |  |
| 84 | BusinessAreas | int |  |  |
| 85 | IsCirculars123 | bit | NN |  |
| 86 | Inactive | bit | NN |  |
| 87 | IsInheritFromOldTemplate | bit | NN |  |
| 88 | IsSendSummary | bit | NN |  |
| 89 | IsPetrol | bit |  |  |
| 90 | IsTemplatePetrol | bit |  |  |

## IPTemplatePermissionBranch

Rows: 0 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | PermissionID | uniqueidentifier | PK NN |  |
| 2 | TemplateID | uniqueidentifier | NN | IPTemplate.IPTemplateID |
| 3 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |

## IPUsingState

Rows: 0 | Columns: 13

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | IsMonthReport | bit | NN |  |
| 3 | Month | int |  |  |
| 4 | Quater | int |  |  |
| 5 | Year | int |  |  |
| 6 | FromDate | datetime |  |  |
| 7 | ToDate | datetime |  |  |
| 8 | BranchID | uniqueidentifier |  |  |
| 9 | Period | nvarchar(255) |  |  |
| 10 | Reporter | nvarchar(128) |  |  |
| 11 | LegalRepresentation | nvarchar(50) |  |  |
| 12 | CreatedDate | datetime |  |  |
| 13 | IsCreateFromOldDB | bit |  |  |

## IPUsingStateDetail

Rows: 0 | Columns: 25

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | IPUsingState.RefID |
| 4 | SortOrder | int | NN |  |
| 5 | InvTypeID | int | NN |  |
| 6 | InvTypeName | nvarchar(128) |  |  |
| 7 | InvTemplateNo | nvarchar(50) |  |  |
| 8 | InvSeries | nvarchar(50) |  |  |
| 9 | OpeningQuantity | decimal(22,8) |  |  |
| 10 | OpeningFromNo | nvarchar(25) |  |  |
| 11 | OpeningToNo | nvarchar(25) |  |  |
| 12 | MovementFromNo | nvarchar(25) |  |  |
| 13 | MovementToNo | nvarchar(25) |  |  |
| 14 | TotalUsedQuantity | decimal(22,8) |  |  |
| 15 | TotalUsedFromNo | nvarchar(25) |  |  |
| 16 | TotalUsedToNo | nvarchar(25) |  |  |
| 17 | UsedQuantity | decimal(22,8) |  |  |
| 18 | DeletedQuantity | decimal(22,8) |  |  |
| 19 | DeletedNo | nvarchar(MAX) |  |  |
| 20 | LostQuantity | decimal(22,8) |  |  |
| 21 | LostNo | nvarchar(MAX) |  |  |
| 22 | DamagedQuantity | decimal(22,8) |  |  |
| 23 | DamagedNo | nvarchar(MAX) |  |  |
| 24 | ClosingQuantity | decimal(22,8) |  |  |
| 25 | ClosingFromNo | nvarchar(25) |  |  |
| 26 | ClosingToNo | nvarchar(25) |  |  |

## InvTemplate

Rows: 7 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | InvTemplateID | uniqueidentifier | PK NN |  |
| 2 | InvTemplateNo | nvarchar(25) | NN |  |
| 3 | InvTemplateName | nvarchar(128) | NN |  |
| 4 | IsSystem | bit | NN |  |
| 5 | SortOrder | int |  |  |
| 6 | CreatedDate | datetime |  |  |
| 7 | CreatedBy | nvarchar(50) |  |  |
| 8 | ModifiedDate | datetime |  |  |
| 9 | ModifiedBy | nvarchar(50) |  |  |
| 10 | Inactive | bit | NN |  |

## InvType

Rows: 7 | Columns: 11

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | InvTypeID | int | PK NN |  |
| 2 | InvTypeCode | nvarchar(25) | NN |  |
| 3 | InvTypeName | nvarchar(255) | NN |  |
| 4 | InvoiceTemplatePrefix | nvarchar(20) |  |  |
| 5 | InvoiceType | int | NN |  |
| 6 | Inactive | bit | NN |  |
| 7 | IsSystem | bit | NN |  |
| 8 | ModifiedDate | datetime |  |  |
| 9 | CreatedDate | datetime |  |  |
| 10 | CreatedBy | nvarchar(50) |  |  |
| 11 | ModifiedBy | nvarchar(50) |  |  |

## InvoiceBot

Rows: 0 | Columns: 40

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | CompanyTaxCode | nvarchar(50) | NN |  |
| 2 | Id | nvarchar(50) | PK NN |  |
| 3 | CreatedDate | datetime |  |  |
| 4 | InvoiceId | nvarchar(50) | NN |  |
| 5 | OrgId | nvarchar(50) |  |  |
| 6 | InvSvcProvider | nvarchar(50) |  |  |
| 7 | SellerTaxCode | nvarchar(50) |  |  |
| 8 | SellerName | nvarchar(400) |  |  |
| 9 | SellerAddress | nvarchar(400) |  |  |
| 10 | SellerActiveStatus | nvarchar(50) |  |  |
| 11 | BuyerTaxCode | nvarchar(50) |  |  |
| 12 | BuyerName | nvarchar(400) |  |  |
| 13 | BuyerAddress | nvarchar(400) |  |  |
| 14 | TemplateNo | nvarchar(25) |  |  |
| 15 | Series | nvarchar(20) |  |  |
| 16 | InvoiceNo | nvarchar(20) |  |  |
| 17 | InvoiceDate | datetime |  |  |
| 18 | SignedDate | datetime |  |  |
| 19 | PaymentMethod | nvarchar(128) |  |  |
| 20 | CcyCode | nvarchar(10) |  |  |
| 21 | ExchangeRate | decimal(18,4) | NN |  |
| 22 | TotalAmountWithoutVat | decimal(18,4) | NN |  |
| 23 | VatRate | decimal(18,4) |  |  |
| 24 | TotalVATAmount | decimal(18,4) | NN |  |
| 25 | TotalDiscountAmount | decimal(18,4) | NN |  |
| 26 | TotalAmount | decimal(18,4) | NN |  |
| 27 | Status | nvarchar(20) |  |  |
| 28 | SortOrder | int | NN ID |  |
| 29 | CheckingResult | nvarchar(MAX) |  |  |
| 30 | ModifiedDate | datetime |  |  |
| 31 | Posted | int | NN |  |
| 32 | IsDeleted | bit | NN |  |
| 33 | IsTaxReduction | bit |  |  |
| 34 | TotalTaxReductionAmount | decimal(18,4) |  |  |
| 35 | IsInvoice123 | bit | NN |  |
| 36 | IsTaxReduction43 | bit |  |  |
| 37 | InvData | nvarchar(MAX) |  |  |
| 38 | BuyerFullName | nvarchar(255) |  |  |
| 39 | InfoND123Status | int |  |  |
| 40 | IsDiscountInvoice | bit | NN |  |

## InvoiceBotCheckingStatus

Rows: 0 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | InvoiceBotCheckingStatusID | uniqueidentifier | PK NN |  |
| 2 | Id | nvarchar(50) |  | InvoiceBot.Id |
| 3 | Indicator | nvarchar(128) |  |  |
| 4 | Status | nvarchar(20) |  |  |
| 5 | StatusCode | nvarchar(128) |  |  |
| 6 | StatusInformation | nvarchar(400) |  |  |

## InvoiceBotDetail

Rows: 0 | Columns: 27

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | InvoiceDetailId | uniqueidentifier | PK NN |  |
| 2 | Id | nvarchar(50) |  | InvoiceBot.Id |
| 3 | LineNumber | int | NN |  |
| 4 | ItemCode | nvarchar(50) |  |  |
| 5 | ItemName | nvarchar(400) |  |  |
| 6 | UnitName | nvarchar(20) |  |  |
| 7 | Quantity | decimal(18,4) | NN |  |
| 8 | UnitPrice | decimal(18,4) | NN |  |
| 9 | AmountWithoutVat | decimal(18,4) | NN |  |
| 10 | VatRate | decimal(18,4) |  |  |
| 11 | VatAmount | decimal(18,4) | NN |  |
| 12 | DiscountRate | decimal(18,4) | NN |  |
| 13 | DiscountAmount | decimal(18,4) | NN |  |
| 14 | Amount | decimal(18,4) | NN |  |
| 15 | IsPromotion | bit | NN |  |
| 16 | AmountOC | decimal(18,4) | NN |  |
| 17 | DiscountAmountOC | decimal(18,4) | NN |  |
| 18 | VatAmountOC | decimal(18,4) | NN |  |
| 19 | AmountWithoutVatOC | decimal(18,4) | NN |  |
| 20 | TaxReductionAmount | decimal(18,4) |  |  |
| 21 | TaxReductionAmountOC | decimal(18,4) |  |  |
| 22 | VATRateOther | decimal(18,4) |  |  |
| 23 | LotNo | nvarchar(50) |  |  |
| 24 | ExpiryDate | datetime |  |  |
| 25 | IsTradeDiscount | bit | NN |  |
| 26 | Kind | int |  |  |
| 27 | SpecificType | int |  |  |

## InvoiceBotOrganization

Rows: 0 | Columns: 20

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | Id | nvarchar(50) | PK NN |  |
| 2 | TaxCode | nvarchar(50) |  |  |
| 3 | Name | nvarchar(500) |  |  |
| 4 | Address | nvarchar(500) |  |  |
| 5 | Tel | nvarchar(50) |  |  |
| 6 | Website | nvarchar(50) |  |  |
| 7 | OwnerId | nvarchar(50) |  |  |
| 8 | InvRevEmail | nvarchar(500) |  |  |
| 9 | InvoiceCount | int |  |  |
| 10 | Status | int |  |  |
| 11 | SubscriberId | nvarchar(50) |  |  |
| 12 | ParentId | nvarchar(50) |  |  |
| 13 | Type | int |  |  |
| 14 | HasChildDep | bit |  |  |
| 15 | IsAccessWorking | bit |  |  |
| 16 | IsWorking | bit |  |  |
| 17 | CreatedDate | datetime |  |  |
| 18 | ModifiedDate | datetime |  |  |
| 19 | SortMISACodeID | nvarchar(500) |  |  |
| 20 | OrgName | nvarchar(MAX) |  |  |

## InvoiceBotReference

Rows: 0 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | InvoiceBotReferenceID | uniqueidentifier | PK NN |  |
| 2 | Id | nvarchar(50) |  | InvoiceBot.Id |
| 3 | RefID | uniqueidentifier |  |  |
| 4 | ReferenceType | int |  |  |

## InvoiceErrorAnnouncement

Rows: 0 | Columns: 22

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefNo | nvarchar(50) |  |  |
| 3 | RefType | int |  |  |
| 4 | RefDate | datetime |  |  |
| 5 | Status | int |  |  |
| 6 | CompanyID | int |  |  |
| 7 | CompanyName | nvarchar(255) |  |  |
| 8 | CompanyTaxCode | nvarchar(50) |  |  |
| 9 | MessageCode | nvarchar(400) |  |  |
| 10 | ReceiveRefDate | datetime |  |  |
| 11 | ReceiveRefNo | nvarchar(100) |  |  |
| 12 | TaxRefID | uniqueidentifier |  |  |
| 13 | TaxRefNo | nvarchar(255) |  |  |
| 14 | TaxRefDate | datetime |  |  |
| 15 | TaxOrganManagementCode | nvarchar(125) |  |  |
| 16 | TaxOrganManagement | nvarchar(255) |  |  |
| 17 | XmlContent | nvarchar(MAX) |  |  |
| 18 | CreatedPlace | nvarchar(255) |  |  |
| 19 | CreatedDate | datetime |  |  |
| 20 | CreatedBy | nvarchar(150) |  |  |
| 21 | ModifiedDate | datetime |  |  |
| 22 | ModifiedBy | nvarchar(150) |  |  |

## InvoiceErrorAnnouncementDetail

Rows: 0 | Columns: 13

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | InvoiceErrorAnnouncement.RefID |
| 3 | InvNo | nvarchar(50) |  |  |
| 4 | InvDate | datetime |  |  |
| 5 | InvoiceCode | nvarchar(125) |  |  |
| 6 | InvoiceType | int |  |  |
| 7 | InvSeries | nvarchar(50) |  |  |
| 8 | InvTemplateNo | nvarchar(50) |  |  |
| 9 | NoticeType | int |  |  |
| 10 | Status | int |  |  |
| 11 | Reason | nvarchar(400) |  |  |
| 12 | TransactionID | nvarchar(125) |  |  |
| 13 | SortOrder | int |  |  |

## InvoiceLasted

Rows: 0 | Columns: 5

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | InvSeries | nvarchar(8) | NN |  |
| 2 | InvTemplateNo | nvarchar(20) | NN |  |
| 3 | InvDate | datetime |  |  |
| 4 | InvNo | nvarchar(500) |  |  |
| 5 | BranchID | uniqueidentifier | NN |  |

## InvoiceNotification

Rows: 0 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ID | uniqueidentifier | NN |  |
| 2 | RefDate | datetime | NN |  |
| 3 | TransactionID | nvarchar(42) | PK NN |  |
| 4 | MessageCode | nvarchar(50) | PK NN |  |
| 5 | NotificationType | int | NN |  |
| 6 | ContentValue | nvarchar(50) | NN |  |
| 7 | UserHasVisited | nvarchar(MAX) |  |  |
| 8 | TaxCode | nvarchar(50) |  |  |

## InvoiceNotificationKey

Rows: 0 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SessionKey | uniqueidentifier | NN |  |
| 2 | ID | uniqueidentifier | NN |  |
| 3 | RefDate | datetime | NN |  |
| 4 | TransactionID | nvarchar(42) | NN |  |
| 5 | MessageCode | nvarchar(50) | NN |  |
| 6 | NotificationType | int | NN |  |
| 7 | ContentValue | nvarchar(50) | NN |  |
| 8 | UserHasVisited | varchar(1000) |  |  |
| 9 | TaxCode | nvarchar(50) |  |  |

## InvoiceStatement

Rows: 0 | Columns: 13

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | SAInvoice.RefID |
| 3 | SAInvoiceRefID | uniqueidentifier | NN |  |
| 4 | InvTemplateNo | nvarchar(25) |  |  |
| 5 | InvSeries | nvarchar(20) |  |  |
| 6 | InvNo | nvarchar(25) |  |  |
| 7 | InvDate | datetime |  |  |
| 8 | TotalAmount | decimal(18,4) |  |  |
| 9 | TotalAmountOC | decimal(18,4) |  |  |
| 10 | InvType | nvarchar(400) |  |  |
| 11 | SAInvoiceRefType | int |  |  |
| 12 | AccountObjectID | uniqueidentifier |  |  |
| 13 | AccountObjectName | nvarchar(400) |  |  |

## InvoiceTemplate

Rows: 9 | Columns: 11

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | InvoiceTemplateID | uniqueidentifier | PK NN |  |
| 2 | InvoiceTemplateName | nvarchar(128) | NN |  |
| 3 | InvoiceTemplateFileName | varchar(128) | NN |  |
| 4 | InvTypeCode | nvarchar(20) | NN |  |
| 5 | IsDefault | bit | NN |  |
| 6 | CompanyID | int |  |  |
| 7 | IsPublic | bit | NN |  |
| 8 | SortOrder | int | NN |  |
| 9 | TemplateContent | varbinary |  |  |
| 10 | IsSynced | bit | NN |  |
| 11 | FilePDFSigned | varbinary |  |  |

## InvoiceToOpening

Rows: 0 | Columns: 15

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | VoucherRefID | uniqueidentifier |  |  |
| 2 | BranchID | uniqueidentifier |  |  |
| 3 | VoucherRefType | int |  |  |
| 4 | AccountNumber | nvarchar(20) | NN |  |
| 5 | CurrencyID | nvarchar(3) |  |  |
| 6 | AccountObjectID | uniqueidentifier | NN |  |
| 7 | InvNo | nvarchar(500) |  |  |
| 8 | InvDate | datetime |  |  |
| 9 | AmountOC | decimal(18,4) |  |  |
| 10 | Amount | decimal(18,4) |  |  |
| 11 | OPNRefID | uniqueidentifier |  |  |
| 12 | OPNInvoiceID | uniqueidentifier |  |  |
| 13 | DisplayOnBook | int |  |  |
| 14 | IsDebtVoucher | bit |  |  |
| 15 | DetailByInvoice | bit |  |  |

## InvoiceTypeAutoID

Rows: 4 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | InvoiceTypeAutoID | uniqueidentifier | PK NN |  |
| 2 | InvTemplateNo | nvarchar(25) |  |  |
| 3 | CurrentInvSerial | nvarchar(20) |  |  |
| 4 | CurrentInvNo | nvarchar(25) |  |  |
| 5 | LastInvSerial | nvarchar(20) |  |  |
| 6 | LastInvNo | nvarchar(25) |  |  |
| 7 | BranchID | uniqueidentifier |  |  |
| 8 | InvDate | datetime |  |  |
| 9 | InvoiceCategory | int |  |  |
| 10 | Lastest | datetime |  |  |

## InvoiceTypeFor03DL

Rows: 12 | Columns: 5

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | InvoiceTypeFor03DLID | int | PK NN ID |  |
| 2 | IsGroupRow | bit | NN |  |
| 3 | GroupCode | nvarchar(15) |  |  |
| 4 | InvoiceTypeName | nvarchar(255) |  |  |
| 5 | InvTemplateNo | nvarchar(255) |  |  |

## MeInvoiceSyncData

Rows: 0 | Columns: 5

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ChangeID | int | PK NN ID |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | InvTemplateNo | nvarchar(20) |  |  |
| 4 | InvSeries | nvarchar(20) |  |  |
| 5 | IsDeleted | bit | NN |  |

## MinutesInvoice

Rows: 0 | Columns: 33

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefType | int |  |  |
| 3 | RefDate | datetime |  |  |
| 4 | RefNo | nvarchar(20) |  |  |
| 5 | BranchID | uniqueidentifier |  |  |
| 6 | MinutesInvoiceID | int |  |  |
| 7 | TransactionID | nvarchar(50) |  |  |
| 8 | JsonData | nvarchar(MAX) |  |  |
| 9 | MinutesInvoiceType | int |  |  |
| 10 | Reason | nvarchar(255) |  |  |
| 11 | MinutesInvoiceStatus | int |  |  |
| 12 | SendStatus | int |  |  |
| 13 | MetaDataA | nvarchar(MAX) |  |  |
| 14 | MetaDataB | nvarchar(MAX) |  |  |
| 15 | AdjustTransactionID | nvarchar(50) |  |  |
| 16 | InvTemplateNo | nvarchar(20) |  |  |
| 17 | InvSeries | nvarchar(20) |  |  |
| 18 | InvDate | datetime |  |  |
| 19 | InvNo | nvarchar(25) |  |  |
| 20 | SAInvoiceRefID | uniqueidentifier |  |  |
| 21 | SAInvoiceRefType | int |  |  |
| 22 | InvTypeID | int |  |  |
| 23 | AccountObjectCode | nvarchar(50) |  |  |
| 24 | AccountObjectName | nvarchar(400) |  |  |
| 25 | AccountObjectAddress | nvarchar(400) |  |  |
| 26 | Amount | decimal(18,4) |  |  |
| 27 | CompanyTaxCode | nvarchar(50) |  |  |
| 28 | CreatedDate | datetime |  |  |
| 29 | CreatedBy | nvarchar(125) |  |  |
| 30 | ModifiedDate | datetime |  |  |
| 31 | ModifiedBy | nvarchar(125) |  |  |
| 32 | EditVersion | timestamp | NN |  |
| 33 | MinutesInvoiceID123 | uniqueidentifier |  |  |

## PublishingInvoiceConfig

Rows: 0 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SyncDate | datetime | PK NN |  |
| 2 | CompanyTaxCode | nvarchar(50) | PK NN |  |
| 3 | IsAllowKeepInvoiceNo | bit | NN |  |
| 4 | ServerDate | datetime |  |  |
| 5 | KeepInvoiceNoDay | int | NN |  |
| 6 | KeepInvoiceNoExpiredDate | datetime |  |  |
| 7 | ListMissingInvoice | nvarchar(MAX) |  |  |
| 8 | BackwardPublishDays | int |  |  |

## ResourceInfoTempEInvoice

Rows: 0 | Columns: 22

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ResourceInfoTempEInvoiceID | uniqueidentifier | PK NN |  |
| 2 | CompanyTaxCode | nvarchar(50) |  |  |
| 8 | LastestInvoiceQuantity | int |  |  |
| 15 | TotalInvoiceQuantity | int |  |  |
| 16 | TotalRemainInvoiceQuantity | int |  |  |
| 17 | TotalUsedInvoiceQuantity | int |  |  |
| 19 | PercentRemainInvQuantity | decimal(18,4) |  |  |
| 20 | NumberOfCashRegister | int |  |  |
| 21 | LastestCashRegisterQuantity | int |  |  |
| 22 | TotalUsedCashRegister | int |  |  |
| 23 | RemainCashRegisterQuantity | int |  |  |
| 24 | PercentRemainCashQuantity | decimal(18,4) |  |  |
| 25 | NumberOfTicket | int |  |  |
| 26 | LastestTicketQuantity | int |  |  |
| 27 | TotalUsedTicket | int |  |  |
| 28 | RemainTicketQuantity | int |  |  |
| 29 | PercentRemainTicketQuantity | decimal(18,4) |  |  |
| 30 | NumberOfPetrol | int |  |  |
| 31 | LastestPetrolQuantity | int |  |  |
| 32 | TotalUsedPetrol | int |  |  |
| 33 | RemainPetrolQuantity | int |  |  |
| 34 | PercentRemainPetrolQuantity | decimal(18,4) |  |  |

# 23 — Ngân hàng điện tử

## EBBankBranch

Rows: 0 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | BankCode | nvarchar(20) | NN |  |
| 2 | BankNo | nvarchar(20) | NN |  |
| 3 | BranchNo | nvarchar(20) |  |  |
| 4 | ShortName | nvarchar(255) |  |  |
| 5 | FullName | nvarchar(255) |  |  |
| 6 | ModifiedDate | datetime |  |  |

## EBBankReference

Rows: 0 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | BankCode | nvarchar(20) | NN |  |
| 2 | BankNo | nvarchar(20) |  |  |
| 3 | ShortName | nvarchar(255) |  |  |
| 4 | FullName | nvarchar(255) |  |  |
| 5 | ModifiedDate | datetime |  |  |
| 6 | BankType | nvarchar(10) |  |  |

## EBBeneficiaryAccount

Rows: 0 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | AccountID | uniqueidentifier | PK NN |  |
| 2 | EBankCode | nvarchar(20) |  |  |
| 3 | AccountNo | nvarchar(50) |  |  |
| 4 | AccountName | nvarchar(255) |  |  |
| 5 | BankNo | nvarchar(10) |  |  |
| 6 | BranchNo | nvarchar(255) |  |  |

## EBHistoryTransaction

Rows: 0 | Columns: 21

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | TransactionID | uniqueidentifier | PK NN |  |
| 2 | BankAccountID | uniqueidentifier | NN |  |
| 3 | TranTime | datetime |  |  |
| 4 | TranSerial | nvarchar(300) |  |  |
| 5 | Remark | nvarchar(255) |  |  |
| 6 | CurrencyCode | nvarchar(50) |  |  |
| 7 | ExchangeRate | money |  |  |
| 8 | DebitAmount | money |  |  |
| 9 | CreditAmount | money |  |  |
| 10 | PreBalanceAmount | money |  |  |
| 11 | BeneficiaryAcctNo | nvarchar(255) |  |  |
| 12 | BeneficiaryAcctName | nvarchar(255) |  |  |
| 13 | BeneficiaryAcctBank | nvarchar(255) |  |  |
| 14 | TransferType | nvarchar(255) |  |  |
| 15 | TransferTypeName | nvarchar(255) |  |  |
| 16 | FeeAccountNo | nvarchar(255) |  |  |
| 17 | DCSign | nvarchar(255) |  |  |
| 18 | SortOrder | int |  |  |
| 19 | TransRefNo | nvarchar(255) |  |  |
| 20 | TranKey | nvarchar(500) |  |  |
| 21 | EBRoleID | uniqueidentifier |  |  |

## EBHistoryTransactionSession

Rows: 0 | Columns: 15

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SessionKey | uniqueidentifier | PK NN |  |
| 2 | TransactionID | uniqueidentifier | PK NN |  |
| 3 | BankAccountID | uniqueidentifier |  |  |
| 4 | TranTime | datetime |  |  |
| 5 | Remark | nvarchar(255) |  |  |
| 6 | CurrencyCode | nvarchar(50) |  |  |
| 7 | ExchangeRate | money |  |  |
| 8 | DebitAmount | money |  |  |
| 9 | CreditAmount | money |  |  |
| 10 | BeneficiaryAcctNo | nvarchar(255) |  |  |
| 11 | BeneficiaryAcctName | nvarchar(255) |  |  |
| 12 | BeneficiaryAcctBank | nvarchar(255) |  |  |
| 13 | DCSign | nvarchar(255) |  |  |
| 14 | TranSerial | nvarchar(300) |  |  |
| 15 | EBRoleID | uniqueidentifier |  |  |

## EBReconciliation

Rows: 0 | Columns: 5

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReconciliationID | uniqueidentifier | PK NN |  |
| 2 | BankAccountID | uniqueidentifier | NN |  |
| 3 | DisplayOnBook | bit | NN |  |
| 4 | Todate | datetime | NN |  |
| 5 | BranchID | uniqueidentifier |  |  |

## EBRole

Rows: 0 | Columns: 40

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | EBRoleID | uniqueidentifier | NN |  |
| 2 | EBRoleName | nvarchar(400) |  |  |
| 3 | RefType | int |  |  |
| 4 | BranchID | uniqueidentifier |  |  |
| 6 | SortOrder | int |  |  |
| 7 | BAType | nvarchar(50) |  |  |
| 8 | BankAccountID | uniqueidentifier |  |  |
| 11 | AutoCreateVoucher | bit |  |  |
| 12 | InActive | bit |  |  |
| 13 | AndOrValue | nvarchar(25) |  |  |
| 14 | ConditionConfig | nvarchar(MAX) |  |  |
| 15 | VoucherType | nvarchar(50) |  |  |
| 16 | ReasonTypeID | int |  |  |
| 17 | AccountObjectID | uniqueidentifier |  |  |
| 18 | AccountObjectName | nvarchar(400) |  |  |
| 20 | JournalMemo | nvarchar(255) |  |  |
| 21 | FromBankAccountID | uniqueidentifier |  |  |
| 22 | ToBankAccountID | uniqueidentifier |  |  |
| 23 | DebitAccount | nvarchar(20) |  |  |
| 24 | CreditAccount | nvarchar(20) |  |  |
| 25 | Description | nvarchar(255) |  |  |
| 26 | ExpenseItemID | uniqueidentifier |  |  |
| 27 | JobID | uniqueidentifier |  |  |
| 28 | ProjectWorkID | uniqueidentifier |  |  |
| 29 | LOANAgreementID | uniqueidentifier |  |  |
| 30 | OrganizationUnitID | uniqueidentifier |  |  |
| 31 | BudgetItemID | uniqueidentifier |  |  |
| 32 | PUContractID | uniqueidentifier |  |  |
| 33 | ContractID | uniqueidentifier |  |  |
| 34 | PUOrderID | uniqueidentifier |  |  |
| 35 | SAOrderID | uniqueidentifier |  |  |
| 36 | ListItemID | uniqueidentifier |  |  |
| 37 | DisplayOnBook | int |  |  |
| 38 | IsCreatedVoucher | bit |  |  |
| 39 | CreatedDate | datetime |  |  |
| 40 | ModifiedDate | datetime |  |  |
| 41 | CreatedBy | nvarchar(50) |  |  |
| 42 | ModifiedBy | nvarchar(50) |  |  |
| 43 | CreatedAtBranchID | uniqueidentifier |  |  |
| 44 | ApplyDate | datetime |  |  |

## EBTransactionReference

Rows: 0 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReferenceID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | TransactionID | uniqueidentifier | NN | EBHistoryTransaction.TransactionID |
| 4 | DisplayOnBook | int |  |  |
| 5 | IsMappingFromReconcile | bit | NN |  |
| 6 | RefDetailID | uniqueidentifier |  |  |

## EBTransferInfo

Rows: 0 | Columns: 32

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | TranSerial | nvarchar(300) |  |  |
| 3 | RefDate | datetime |  |  |
| 4 | FromBankAccountID | uniqueidentifier |  | BankAccount.BankAccountID |
| 5 | FromBankAccountNumber | nvarchar(50) |  |  |
| 6 | FromBankAccountName | nvarchar(255) |  |  |
| 7 | FromBankCode | nvarchar(20) |  |  |
| 8 | FromBankName | nvarchar(255) |  |  |
| 9 | FromBranchName | nvarchar(255) |  |  |
| 10 | ToBankAccountNumber | nvarchar(50) |  |  |
| 11 | ToBankAccountName | varchar(255) |  |  |
| 12 | ToBankNo | nvarchar(10) |  |  |
| 13 | ToBankName | nvarchar(255) |  |  |
| 14 | ToBankBranchNo | nvarchar(255) |  |  |
| 15 | ToBankBranchName | nvarchar(255) |  |  |
| 16 | Amount | decimal(18,4) |  |  |
| 17 | Description | varchar(500) |  |  |
| 18 | FeeAmount | decimal(18,4) |  |  |
| 19 | FeeType | int |  |  |
| 20 | TransferState | int |  |  |
| 21 | ReasonReject | nvarchar(255) |  |  |
| 22 | OriginalRefID | uniqueidentifier |  |  |
| 23 | CreatedDate | datetime |  |  |
| 24 | CreatedBy | nvarchar(50) |  |  |
| 25 | ModifiedDate | datetime |  |  |
| 26 | ModifiedBy | nvarchar(50) |  |  |
| 27 | TransactionType | int | NN |  |
| 28 | CifNo | nvarchar(100) |  |  |
| 29 | TransferType | int |  |  |
| 30 | FeeStatus | int |  |  |
| 33 | CheckTranferType | int |  |  |
| 34 | TransactionID | nvarchar(255) |  |  |

## EBTransferInfoAttachment

Rows: 0 | Columns: 12

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | AttachmentID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | EBTransferInfo.RefID |
| 3 | AttachmentType | int | NN |  |
| 4 | Path | nvarchar(255) |  |  |
| 5 | FileName | nvarchar(255) |  |  |
| 6 | AttachmentContent | varbinary |  |  |
| 7 | FileExtension | nvarchar(25) |  |  |
| 8 | Description | nvarchar(MAX) |  |  |
| 9 | CreatedDate | datetime |  |  |
| 10 | ModifiedDate | datetime |  |  |
| 11 | CreatedBy | nvarchar(100) |  |  |
| 12 | ModifiedBy | nvarchar(100) |  |  |

## EBTransferInfoLog

Rows: 0 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | EBTransferInfo.RefID |
| 3 | LoginName | nvarchar(100) |  |  |
| 4 | ComputerName | nvarchar(100) |  |  |
| 5 | ComputerIP | nvarchar(100) |  |  |
| 6 | ApplicationPartAlias | nvarchar(255) |  |  |
| 7 | PermissionTypeAlias | nvarchar(255) |  |  |
| 8 | Description | nvarchar(MAX) |  |  |
| 9 | Time | datetime |  |  |

## EBUserRegister

Rows: 0 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | BankCode | nvarchar(MAX) | NN |  |
| 2 | TaxCode | nvarchar(20) | NN |  |
| 3 | CompanyName | nvarchar(255) |  |  |
| 4 | ProvinceName | nvarchar(255) |  |  |
| 5 | Address | nvarchar(255) |  |  |
| 6 | Name | nvarchar(255) |  |  |
| 7 | Position | nvarchar(255) |  |  |
| 8 | PhoneNumber | nvarchar(50) |  |  |
| 9 | Email | nvarchar(255) |  |  |

# 24 — Báo cáo tài chính

## ComparisonReport

Rows: 56 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReportID | varchar(100) | PK NN |  |
| 2 | SortOrder | int |  |  |
| 3 | GroupID | int |  |  |
| 4 | GroupName | nvarchar(255) |  |  |

## CustomizeReport

Rows: 0 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReportName | nvarchar(128) | PK NN |  |
| 2 | RefTypeList | nvarchar(128) | PK NN |  |
| 3 | CustomizeReportList | nvarchar(MAX) |  |  |

## FRB03GTBussiness

Rows: 0 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | BussinessID | int |  |  |
| 3 | IsPostToManagementBook | bit | PK NN |  |

## FRB03OPNDetailByActivity

Rows: 0 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | AccountNumber | nvarchar(20) | PK NN |  |
| 2 | IsDebitBalance | bit | PK NN |  |
| 3 | BussinessAmount | money | NN |  |
| 4 | InvestmentAmount | money | NN |  |
| 5 | FinancialAmount | money | NN |  |
| 6 | IsPostToManagementBook | bit | PK NN |  |
| 7 | BranchID | uniqueidentifier | PK NN |  |

## FRB03ReportDetailActivity

Rows: 0 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | ActivityID | int |  |  |
| 4 | IsPostToManagementBook | bit | PK NN |  |

## FRB09DNNReportDetail

Rows: 0 | Columns: 29

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReportDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | FRReportList.RefID |
| 3 | ItemIndex | int |  |  |
| 4 | ItemID | uniqueidentifier | NN |  |
| 5 | ItemCode | nvarchar(50) |  |  |
| 6 | ItemName | nvarchar(1000) |  |  |
| 7 | ItemNameEnglish | nvarchar(1000) |  |  |
| 8 | Part | nvarchar(20) |  |  |
| 9 | PartInTab | int |  |  |
| 10 | FormulaType | int |  |  |
| 11 | Description | nvarchar(MAX) |  |  |
| 12 | Hidden | bit |  |  |
| 13 | IsBold | bit |  |  |
| 14 | IsItalic | bit |  |  |
| 15 | Formula | xml |  |  |
| 16 | ClosingQuantity | decimal(23,8) |  |  |
| 17 | OpeningQuantity | decimal(23,8) |  |  |
| 18 | ManagementTool_Software_ClosingAmount | decimal(25,4) |  |  |
| 19 | Building_Easement_OpeningAmount | decimal(25,4) |  |  |
| 20 | Machine_IssueRight_IncrementAmount | decimal(25,4) |  |  |
| 21 | Transport_Licence_DecrementAmount | decimal(25,4) |  |  |
| 22 | OtherAssetAmount | decimal(25,4) |  |  |
| 23 | TotalAmount | decimal(25,4) |  |  |
| 24 | OtherFormulaAmount | decimal(22,4) |  |  |
| 25 | Description1 | nvarchar(MAX) |  |  |
| 26 | Description2 | nvarchar(MAX) |  |  |
| 27 | SortOrder | int |  |  |
| 28 | ItemNameChinese | nvarchar(1000) |  |  |
| 29 | ItemNameKorean | nvarchar(1000) |  |  |

## FRB09DNNTemplate

Rows: 149 | Columns: 26

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ItemID | uniqueidentifier | PK NN |  |
| 2 | ItemIndex | int |  |  |
| 3 | ItemCode | nvarchar(20) |  |  |
| 4 | ItemName | nvarchar(1000) |  |  |
| 5 | ItemNameEnglish | nvarchar(1000) |  |  |
| 6 | Part | nvarchar(10) |  |  |
| 7 | PartInTab | int |  |  |
| 8 | IsBold | bit |  |  |
| 9 | IsItalic | bit |  |  |
| 10 | Hidden | bit |  |  |
| 11 | Description | nvarchar(MAX) |  |  |
| 12 | FormulaType | int |  |  |
| 13 | Formula | xml |  |  |
| 14 | ManagementTool_Software_Closing | nvarchar(MAX) |  |  |
| 15 | Building_Easement_Opening | nvarchar(MAX) |  |  |
| 16 | Machine_IssueRight_Increment | nvarchar(MAX) |  |  |
| 17 | Transport_Licence_Decrement | nvarchar(MAX) |  |  |
| 18 | OtherAsset | nvarchar(MAX) |  |  |
| 19 | Total | nvarchar(MAX) |  |  |
| 20 | CreatedDate | datetime |  |  |
| 21 | CreatedBy | nvarchar(50) |  |  |
| 22 | ModifiedDate | datetime |  |  |
| 23 | ModifiedBy | nvarchar(50) |  |  |
| 24 | OtherFormula | nvarchar(MAX) |  |  |
| 25 | ItemNameChinese | nvarchar(1000) |  |  |
| 26 | ItemNameKorean | nvarchar(1000) |  |  |

## FRB09DNNTemplateDefault

Rows: 149 | Columns: 26

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ItemID | uniqueidentifier | PK NN |  |
| 2 | ItemIndex | int |  |  |
| 3 | ItemCode | nvarchar(20) |  |  |
| 4 | ItemName | nvarchar(1000) |  |  |
| 5 | ItemNameEnglish | nvarchar(1000) |  |  |
| 6 | Part | nvarchar(10) |  |  |
| 7 | PartInTab | int |  |  |
| 8 | IsBold | bit |  |  |
| 9 | IsItalic | bit |  |  |
| 10 | Hidden | bit |  |  |
| 11 | Description | nvarchar(MAX) |  |  |
| 12 | FormulaType | int |  |  |
| 13 | Formula | xml |  |  |
| 14 | ManagementTool_Software_Closing | nvarchar(MAX) |  |  |
| 15 | Building_Easement_Opening | nvarchar(MAX) |  |  |
| 16 | Machine_IssueRight_Increment | nvarchar(MAX) |  |  |
| 17 | Transport_Licence_Decrement | nvarchar(MAX) |  |  |
| 18 | OtherAsset | nvarchar(MAX) |  |  |
| 19 | Total | nvarchar(MAX) |  |  |
| 20 | CreatedDate | datetime |  |  |
| 21 | CreatedBy | nvarchar(50) |  |  |
| 22 | ModifiedDate | datetime |  |  |
| 23 | ModifiedBy | nvarchar(50) |  |  |
| 24 | OtherFormula | nvarchar(MAX) |  |  |
| 25 | ItemNameChinese | nvarchar(1000) |  |  |
| 26 | ItemNameKorean | nvarchar(1000) |  |  |

## FRB09DNReportDetail

Rows: 0 | Columns: 60

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReportDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | FRReportList.RefID |
| 3 | ItemID | uniqueidentifier | NN |  |
| 4 | ItemIndex | int |  |  |
| 5 | ItemCode | nvarchar(50) |  |  |
| 6 | ItemName | nvarchar(1000) |  |  |
| 7 | ItemNameEnglish | nvarchar(1000) |  |  |
| 8 | Part | nvarchar(20) |  |  |
| 9 | PartInTab | int |  |  |
| 10 | FormulaType | int |  |  |
| 11 | Description | nvarchar(MAX) |  |  |
| 12 | Hidden | bit |  |  |
| 13 | IsBold | bit |  |  |
| 14 | IsItalic | bit |  |  |
| 15 | Formula | xml |  |  |
| 16 | ClosingQuantity | decimal(23,8) |  |  |
| 17 | OpeningQuantity | decimal(23,8) |  |  |
| 18 | ClosingBalanceAmount | decimal(25,4) |  |  |
| 19 | OpeningBalanceAmount | decimal(25,4) |  |  |
| 20 | BuildingAndRealtyAmount | decimal(25,4) |  |  |
| 21 | Equipment_IssueRight_TotalPayAndCapitalAmount | decimal(25,4) |  |  |
| 22 | Transport_CopyRight_PayInterestAndDecreaseAmount | decimal(25,4) |  |  |
| 23 | Equipment_Trademark_PayDebitThisYearAndOtherCapitalAmount | decimal(25,4) |  |  |
| 24 | OtherFA_Software_TotalPayLastYearAndTreasuryShareAmount | decimal(25,4) |  |  |
| 25 | IntFA_OrtherIntFA_PayDebitLastYearAndDiffExchangeRateAmount | decimal(25,4) |  |  |
| 26 | TotalAmount | decimal(25,4) |  |  |
| 27 | License_PayInterestLastYearAndRevalueFAAmount | decimal(25,4) |  |  |
| 28 | Description1 | nvarchar(255) |  |  |
| 29 | Description2 | nvarchar(255) |  |  |
| 30 | SortOrder | int |  |  |
| 31 | ItemNameChinese | nvarchar(1000) |  |  |
| 32 | ItemNameKorean | nvarchar(1000) |  |  |
| 33 | AdjustClosingBalanceAmount | decimal(25,4) |  |  |
| 34 | AdjustOpeningBalanceAmount | decimal(25,4) |  |  |
| 35 | AdjustBuildingAndRealtyAmount | decimal(25,4) |  |  |
| 36 | AdjustEquipment_IssueRight_TotalPayAndCapitalAmount | decimal(25,4) |  |  |
| 37 | AdjustTransport_CopyRight_PayInterestAndDecreaseAmount | decimal(25,4) |  |  |
| 38 | AdjustEquipment_Trademark_PayDebitThisYearAndOtherCapitalAmount | decimal(25,4) |  |  |
| 39 | AdjustOtherFA_Software_TotalPayLastYearAndTreasuryShareAmount | decimal(25,4) |  |  |
| 40 | AdjustIntFA_OrtherIntFA_PayDebitLastYearAndDiffExchangeRateAmount | decimal(25,4) |  |  |
| 41 | AdjustTotalAmount | decimal(25,4) |  |  |
| 42 | AdjustLicense_PayInterestLastYearAndRevalueFAAmount | decimal(25,4) |  |  |
| 43 | AfterAdjustClosingBalanceAmount | decimal(25,4) |  |  |
| 44 | AfterAdjustOpeningBalanceAmount | decimal(25,4) |  |  |
| 45 | AfterAdjustBuildingAndRealtyAmount | decimal(25,4) |  |  |
| 46 | AfterAdjustEquipment_IssueRight_TotalPayAndCapitalAmount | decimal(25,4) |  |  |
| 47 | AfterAdjustTransport_CopyRight_PayInterestAndDecreaseAmount | decimal(25,4) |  |  |
| 48 | AfterAdjustEquipment_Trademark_PayDebitThisYearAndOtherCapitalAmount | decimal(25,4) |  |  |
| 49 | AfterAdjustOtherFA_Software_TotalPayLastYearAndTreasuryShareAmount | decimal(25,4) |  |  |
| 50 | AfterAdjustIntFA_OrtherIntFA_PayDebitLastYearAndDiffExchangeRateAmount | decimal(25,4) |  |  |
| 51 | AfterAdjustTotalAmount | decimal(25,4) |  |  |
| 52 | AfterAdjustLicense_PayInterestLastYearAndRevalueFAAmount | decimal(25,4) |  |  |
| 53 | Description3 | nvarchar(400) |  |  |
| 54 | Description4 | nvarchar(400) |  |  |
| 55 | Description5 | nvarchar(400) |  |  |
| 56 | Description6 | nvarchar(400) |  |  |
| 57 | AdjustClosingQuantity | decimal(23,8) |  |  |
| 58 | AdjustOpeningQuantity | decimal(23,8) |  |  |
| 59 | AfterAdjustClosingQuantity | decimal(23,8) |  |  |
| 60 | AfterAdjustOpeningQuantity | decimal(23,8) |  |  |

## FRB09DNSNReportDetail

Rows: 0 | Columns: 22

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReportDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | FRReportList.RefID |
| 3 | ItemIndex | int |  |  |
| 4 | ItemID | uniqueidentifier | NN |  |
| 5 | ItemCode | nvarchar(50) |  |  |
| 6 | ItemName | nvarchar(1000) |  |  |
| 7 | ItemNameEnglish | nvarchar(1000) |  |  |
| 8 | ItemNameChinese | nvarchar(1000) |  |  |
| 9 | ItemNameKorean | nvarchar(1000) |  |  |
| 10 | Part | nvarchar(20) |  |  |
| 11 | PartInTab | int |  |  |
| 12 | FormulaType | int |  |  |
| 13 | Description | nvarchar(MAX) |  |  |
| 14 | Hidden | bit |  |  |
| 15 | IsBold | bit |  |  |
| 16 | IsItalic | bit |  |  |
| 17 | Formula | xml |  |  |
| 18 | ManagementTool_Software_ClosingAmount | decimal(25,4) |  |  |
| 19 | Building_Easement_OpeningAmount | decimal(25,4) |  |  |
| 20 | Machine_IssueRight_IncrementAmount | decimal(25,4) |  |  |
| 21 | Transport_Licence_DecrementAmount | decimal(25,4) |  |  |
| 22 | SortOrder | int |  |  |

## FRB09DNSNTemplate

Rows: 70 | Columns: 23

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ItemID | uniqueidentifier | PK NN |  |
| 2 | ItemIndex | int |  |  |
| 3 | ItemCode | nvarchar(20) |  |  |
| 4 | ItemName | nvarchar(1000) |  |  |
| 5 | ItemNameEnglish | nvarchar(1000) |  |  |
| 6 | ItemNameChinese | nvarchar(1000) |  |  |
| 7 | ItemNameKorean | nvarchar(1000) |  |  |
| 8 | Part | nvarchar(20) |  |  |
| 9 | PartInTab | int |  |  |
| 10 | IsBold | bit |  |  |
| 11 | IsItalic | bit |  |  |
| 12 | Hidden | bit |  |  |
| 13 | FormulaType | int |  |  |
| 14 | Formula | xml |  |  |
| 15 | Description | nvarchar(MAX) |  |  |
| 16 | Building_Easement_Opening | nvarchar(MAX) |  |  |
| 17 | ManagementTool_Software_Closing | nvarchar(MAX) |  |  |
| 18 | Machine_IssueRight_Increment | nvarchar(MAX) |  |  |
| 19 | Transport_Licence_Decrement | nvarchar(MAX) |  |  |
| 20 | CreatedDate | datetime |  |  |
| 21 | CreatedBy | nvarchar(50) |  |  |
| 22 | ModifiedDate | datetime |  |  |
| 23 | ModifiedBy | nvarchar(50) |  |  |

## FRB09DNSNTemplateDefault

Rows: 70 | Columns: 23

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ItemID | uniqueidentifier | PK NN |  |
| 2 | ItemIndex | int |  |  |
| 3 | ItemCode | nvarchar(20) |  |  |
| 4 | ItemName | nvarchar(1000) |  |  |
| 5 | ItemNameEnglish | nvarchar(1000) |  |  |
| 6 | ItemNameChinese | nvarchar(1000) |  |  |
| 7 | ItemNameKorean | nvarchar(1000) |  |  |
| 8 | Part | nvarchar(20) |  |  |
| 9 | PartInTab | int |  |  |
| 10 | IsBold | bit |  |  |
| 11 | IsItalic | bit |  |  |
| 12 | Hidden | bit |  |  |
| 13 | FormulaType | int |  |  |
| 14 | Formula | xml |  |  |
| 15 | Description | nvarchar(MAX) |  |  |
| 16 | Building_Easement_Opening | nvarchar(MAX) |  |  |
| 17 | ManagementTool_Software_Closing | nvarchar(MAX) |  |  |
| 18 | Machine_IssueRight_Increment | nvarchar(MAX) |  |  |
| 19 | Transport_Licence_Decrement | nvarchar(MAX) |  |  |
| 20 | CreatedDate | datetime |  |  |
| 21 | CreatedBy | nvarchar(50) |  |  |
| 22 | ModifiedDate | datetime |  |  |
| 23 | ModifiedBy | nvarchar(50) |  |  |

## FRB09DNTemplate

Rows: 747 | Columns: 39

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ItemID | uniqueidentifier | PK NN |  |
| 2 | ItemIndex | int |  |  |
| 3 | ItemCode | nvarchar(20) |  |  |
| 4 | ItemName | nvarchar(1000) |  |  |
| 5 | ItemNameEnglish | nvarchar(1000) |  |  |
| 6 | Part | nvarchar(20) |  |  |
| 7 | PartInTab | int |  |  |
| 8 | IsBold | bit |  |  |
| 9 | IsItalic | bit |  |  |
| 10 | Hidden | bit |  |  |
| 11 | FormulaType | int |  |  |
| 12 | Formula | xml |  |  |
| 13 | Description | nvarchar(MAX) |  |  |
| 14 | OpeningBalance | nvarchar(MAX) |  |  |
| 15 | BuildingAndRealty | nvarchar(MAX) |  |  |
| 16 | Equipment_IssueRight_TotalPayAndCapital | nvarchar(MAX) |  |  |
| 17 | Transport_CopyRight_PayInterestAndDecrease | nvarchar(MAX) |  |  |
| 18 | Equipment_Trademark_PayDebitThisYearAndOtherCapital | nvarchar(MAX) |  |  |
| 19 | OtherFA_Software_TotalPayLastYearAndTreasuryShare | nvarchar(MAX) |  |  |
| 20 | IntFA_OrtherIntFA_PayDebitLastYearAndDiffExchangeRate | nvarchar(MAX) |  |  |
| 21 | License_PayInterestLastYearAndRevalueFA | nvarchar(MAX) |  |  |
| 22 | CreatedDate | datetime |  |  |
| 23 | CreatedBy | nvarchar(50) |  |  |
| 24 | ModifiedDate | datetime |  |  |
| 25 | ModifiedBy | nvarchar(50) |  |  |
| 26 | ClosingBalance | nvarchar(MAX) |  |  |
| 27 | Total | nvarchar(MAX) |  |  |
| 28 | ItemNameChinese | nvarchar(1000) |  |  |
| 29 | ItemNameKorean | nvarchar(1000) |  |  |
| 30 | AdjustOpeningBalance | nvarchar(MAX) |  |  |
| 31 | AdjustBuildingAndRealty | nvarchar(MAX) |  |  |
| 32 | AdjustEquipment_IssueRight_TotalPayAndCapital | nvarchar(MAX) |  |  |
| 33 | AdjustTransport_CopyRight_PayInterestAndDecrease | nvarchar(MAX) |  |  |
| 34 | AdjustEquipment_Trademark_PayDebitThisYearAndOtherCapital | nvarchar(MAX) |  |  |
| 35 | AdjustOtherFA_Software_TotalPayLastYearAndTreasuryShare | nvarchar(MAX) |  |  |
| 36 | AdjustIntFA_OrtherIntFA_PayDebitLastYearAndDiffExchangeRate | nvarchar(MAX) |  |  |
| 37 | AdjustLicense_PayInterestLastYearAndRevalueFA | nvarchar(MAX) |  |  |
| 38 | AdjustClosingBalance | nvarchar(MAX) |  |  |
| 39 | AdjustTotal | nvarchar(MAX) |  |  |

## FRB09DNTemplateDefault

Rows: 747 | Columns: 39

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ItemID | uniqueidentifier | PK NN |  |
| 2 | ItemIndex | int |  |  |
| 3 | ItemCode | nvarchar(20) |  |  |
| 4 | ItemName | nvarchar(1000) |  |  |
| 5 | ItemNameEnglish | nvarchar(1000) |  |  |
| 6 | Part | nvarchar(20) |  |  |
| 7 | PartInTab | int |  |  |
| 8 | IsBold | bit |  |  |
| 9 | IsItalic | bit |  |  |
| 10 | Hidden | bit |  |  |
| 11 | FormulaType | int |  |  |
| 12 | Formula | xml |  |  |
| 13 | Description | nvarchar(MAX) |  |  |
| 14 | OpeningBalance | nvarchar(MAX) |  |  |
| 15 | BuildingAndRealty | nvarchar(MAX) |  |  |
| 16 | Equipment_IssueRight_TotalPayAndCapital | nvarchar(MAX) |  |  |
| 17 | Transport_CopyRight_PayInterestAndDecrease | nvarchar(MAX) |  |  |
| 18 | Equipment_Trademark_PayDebitThisYearAndOtherCapital | nvarchar(MAX) |  |  |
| 19 | OtherFA_Software_TotalPayLastYearAndTreasuryShare | nvarchar(MAX) |  |  |
| 20 | IntFA_OrtherIntFA_PayDebitLastYearAndDiffExchangeRate | nvarchar(MAX) |  |  |
| 21 | License_PayInterestLastYearAndRevalueFA | nvarchar(MAX) |  |  |
| 22 | CreatedDate | datetime |  |  |
| 23 | CreatedBy | nvarchar(50) |  |  |
| 24 | ModifiedDate | datetime |  |  |
| 25 | ModifiedBy | nvarchar(50) |  |  |
| 26 | ClosingBalance | nvarchar(MAX) |  |  |
| 27 | Total | nvarchar(MAX) |  |  |
| 28 | ItemNameChinese | nvarchar(1000) |  |  |
| 29 | ItemNameKorean | nvarchar(1000) |  |  |
| 30 | AdjustOpeningBalance | nvarchar(MAX) |  |  |
| 31 | AdjustBuildingAndRealty | nvarchar(MAX) |  |  |
| 32 | AdjustEquipment_IssueRight_TotalPayAndCapital | nvarchar(MAX) |  |  |
| 33 | AdjustTransport_CopyRight_PayInterestAndDecrease | nvarchar(MAX) |  |  |
| 34 | AdjustEquipment_Trademark_PayDebitThisYearAndOtherCapital | nvarchar(MAX) |  |  |
| 35 | AdjustOtherFA_Software_TotalPayLastYearAndTreasuryShare | nvarchar(MAX) |  |  |
| 36 | AdjustIntFA_OrtherIntFA_PayDebitLastYearAndDiffExchangeRate | nvarchar(MAX) |  |  |
| 37 | AdjustLicense_PayInterestLastYearAndRevalueFA | nvarchar(MAX) |  |  |
| 38 | AdjustClosingBalance | nvarchar(MAX) |  |  |
| 39 | AdjustTotal | nvarchar(MAX) |  |  |

## FRB09DNTemplateTemp

Rows: 1,494 | Columns: 40

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ItemID | uniqueidentifier | NN |  |
| 2 | ItemIndex | int |  |  |
| 3 | ItemCode | nvarchar(20) |  |  |
| 4 | ItemName | nvarchar(1000) |  |  |
| 5 | ItemNameEnglish | nvarchar(1000) |  |  |
| 6 | Part | nvarchar(20) |  |  |
| 7 | PartInTab | int |  |  |
| 8 | IsBold | bit |  |  |
| 9 | IsItalic | bit |  |  |
| 10 | Hidden | bit |  |  |
| 11 | FormulaType | int |  |  |
| 12 | Formula | xml |  |  |
| 13 | Description | nvarchar(MAX) |  |  |
| 14 | OpeningBalance | nvarchar(MAX) |  |  |
| 15 | BuildingAndRealty | nvarchar(MAX) |  |  |
| 16 | Equipment_IssueRight_TotalPayAndCapital | nvarchar(MAX) |  |  |
| 17 | Transport_CopyRight_PayInterestAndDecrease | nvarchar(MAX) |  |  |
| 18 | Equipment_Trademark_PayDebitThisYearAndOtherCapital | nvarchar(MAX) |  |  |
| 19 | OtherFA_Software_TotalPayLastYearAndTreasuryShare | nvarchar(MAX) |  |  |
| 20 | IntFA_OrtherIntFA_PayDebitLastYearAndDiffExchangeRate | nvarchar(MAX) |  |  |
| 21 | License_PayInterestLastYearAndRevalueFA | nvarchar(MAX) |  |  |
| 22 | CreatedDate | datetime |  |  |
| 23 | CreatedBy | nvarchar(50) |  |  |
| 24 | ModifiedDate | datetime |  |  |
| 25 | ModifiedBy | nvarchar(50) |  |  |
| 26 | ClosingBalance | nvarchar(MAX) |  |  |
| 27 | Total | nvarchar(MAX) |  |  |
| 28 | ItemNameChinese | nvarchar(1000) |  |  |
| 29 | ItemNameKorean | nvarchar(1000) |  |  |
| 30 | IsDetail | bit |  |  |
| 31 | AdjustOpeningBalance | nvarchar(MAX) |  |  |
| 32 | AdjustBuildingAndRealty | nvarchar(MAX) |  |  |
| 33 | AdjustEquipment_IssueRight_TotalPayAndCapital | nvarchar(MAX) |  |  |
| 34 | AdjustTransport_CopyRight_PayInterestAndDecrease | nvarchar(MAX) |  |  |
| 35 | AdjustEquipment_Trademark_PayDebitThisYearAndOtherCapital | nvarchar(MAX) |  |  |
| 36 | AdjustOtherFA_Software_TotalPayLastYearAndTreasuryShare | nvarchar(MAX) |  |  |
| 37 | AdjustIntFA_OrtherIntFA_PayDebitLastYearAndDiffExchangeRate | nvarchar(MAX) |  |  |
| 38 | AdjustLicense_PayInterestLastYearAndRevalueFA | nvarchar(MAX) |  |  |
| 39 | AdjustClosingBalance | nvarchar(MAX) |  |  |
| 40 | AdjustTotal | nvarchar(MAX) |  |  |

## FRCostRevenueAndInterest

Rows: 17 | Columns: 5

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ItemIndex | int | PK NN ID |  |
| 2 | ItemName | nvarchar(1000) |  |  |
| 3 | Rate | decimal(18,4) |  |  |
| 4 | SortOrderDisplay | nvarchar(20) |  |  |
| 5 | IsBold | bit | NN |  |

## FRF01ReportDetail

Rows: 0 | Columns: 20

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReportDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | FRReportList.RefID |
| 3 | AccountNumber | nvarchar(50) |  |  |
| 4 | AccountCategoryKind | int |  |  |
| 5 | AccountName | nvarchar(255) |  |  |
| 6 | IsParent | bit | NN |  |
| 7 | ParentID | uniqueidentifier |  |  |
| 8 | Grade | int |  |  |
| 9 | SortOrder | int |  |  |
| 10 | OpeningDebitAmount | decimal(25,4) |  |  |
| 11 | OpeningCreditAmount | decimal(25,4) |  |  |
| 12 | DebitAmount | decimal(25,4) |  |  |
| 13 | CreditAmount | decimal(25,4) |  |  |
| 14 | ClosingDebitAmount | decimal(25,4) |  |  |
| 15 | ClosingCreditAmount | decimal(25,4) |  |  |
| 16 | AccountKind | int |  |  |
| 17 | AccountID | uniqueidentifier |  |  |
| 18 | AccountNameEnglish | nvarchar(255) |  |  |
| 19 | AccountNameChinese | nvarchar(255) |  |  |
| 20 | AccountNameKorean | nvarchar(255) |  |  |

## FRF04SituationOfCooperativeMember

Rows: 31 | Columns: 27

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ItemID | uniqueidentifier | PK NN |  |
| 2 | ItemIndex | int |  |  |
| 3 | ItemCode | nvarchar(20) |  |  |
| 4 | ItemName | nvarchar(255) |  |  |
| 5 | ItemNameEnglish | nvarchar(1000) |  |  |
| 6 | IsBold | bit |  |  |
| 7 | IsItalic | bit |  |  |
| 8 | Hidden | bit |  |  |
| 9 | Description | nvarchar(MAX) |  |  |
| 10 | FormulaType | int |  |  |
| 11 | Formula | xml |  |  |
| 12 | Total | nvarchar(MAX) |  |  |
| 13 | Cropt | nvarchar(MAX) |  |  |
| 14 | Breed | nvarchar(MAX) |  |  |
| 15 | Processing | nvarchar(MAX) |  |  |
| 16 | Handmade | nvarchar(MAX) |  |  |
| 17 | Other | nvarchar(MAX) |  |  |
| 18 | BreedPoulty | nvarchar(MAX) |  |  |
| 19 | Bussiness | nvarchar(MAX) |  |  |
| 20 | CreatedDate | datetime |  |  |
| 21 | CreatedBy | nvarchar(50) |  |  |
| 22 | ModifiedDate | datetime |  |  |
| 23 | ModifiedBy | nvarchar(50) |  |  |
| 24 | AccountingSystem | int |  |  |
| 25 | ReportID | varchar(100) | NN |  |
| 26 | ItemNameChinese | nvarchar(255) |  |  |
| 27 | ItemNameKorean | nvarchar(255) |  |  |

## FRF04SituationOfCooperativeMemberDefault

Rows: 31 | Columns: 27

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ItemID | uniqueidentifier | PK NN |  |
| 2 | ItemIndex | int |  |  |
| 3 | ItemCode | nvarchar(20) |  |  |
| 4 | ItemName | nvarchar(255) |  |  |
| 5 | ItemNameEnglish | nvarchar(1000) |  |  |
| 6 | IsBold | bit |  |  |
| 7 | IsItalic | bit |  |  |
| 8 | Hidden | bit |  |  |
| 9 | Description | nvarchar(MAX) |  |  |
| 10 | FormulaType | int |  |  |
| 11 | Formula | xml |  |  |
| 12 | Total | nvarchar(MAX) |  |  |
| 13 | Cropt | nvarchar(MAX) |  |  |
| 14 | Breed | nvarchar(MAX) |  |  |
| 15 | Processing | nvarchar(MAX) |  |  |
| 16 | Handmade | nvarchar(MAX) |  |  |
| 17 | Other | nvarchar(MAX) |  |  |
| 18 | BreedPoulty | nvarchar(MAX) |  |  |
| 19 | Bussiness | nvarchar(MAX) |  |  |
| 20 | CreatedDate | datetime |  |  |
| 21 | CreatedBy | nvarchar(50) |  |  |
| 22 | ModifiedDate | datetime |  |  |
| 23 | ModifiedBy | nvarchar(50) |  |  |
| 24 | AccountingSystem | int |  |  |
| 25 | ReportID | varchar(100) | NN |  |
| 26 | ItemNameChinese | nvarchar(255) |  |  |
| 27 | ItemNameKorean | nvarchar(255) |  |  |

## FRF04SituationOfCooperativeMemberDetail

Rows: 0 | Columns: 27

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReportDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier |  | FRReportList.RefID |
| 3 | ReportType | nvarchar(100) |  |  |
| 4 | ItemID | uniqueidentifier |  |  |
| 5 | ItemCode | nvarchar(20) |  |  |
| 6 | ItemName | nvarchar(255) |  |  |
| 7 | ItemNameEnglish | nvarchar(255) |  |  |
| 8 | ItemIndex | int |  |  |
| 9 | Description | nvarchar(255) |  |  |
| 10 | FormulaType | int |  |  |
| 11 | FormulaFrontEnd | nvarchar(MAX) |  |  |
| 12 | TotalAmount | decimal(25,4) |  |  |
| 13 | CroptAmount | decimal(25,4) |  |  |
| 14 | BreedAmount | decimal(25,4) |  |  |
| 15 | ProcessingAmount | decimal(25,4) |  |  |
| 16 | HandmadeAmount | decimal(25,4) |  |  |
| 17 | OtherAmount | decimal(25,4) |  |  |
| 18 | BreedPoultyAmount | decimal(25,4) |  |  |
| 19 | BussinessAmount | decimal(25,4) |  |  |
| 20 | Hidden | bit |  |  |
| 21 | IsBold | bit |  |  |
| 22 | IsItalic | bit |  |  |
| 23 | SortOrder | int |  |  |
| 24 | Category | int |  |  |
| 25 | Formula | xml |  |  |
| 26 | ItemNameChinese | nvarchar(255) |  |  |
| 27 | ItemNameKorean | nvarchar(255) |  |  |

## FROMEInvoice

Rows: 0 | Columns: 92

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | TransactionID | nvarchar(50) | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | InvTemplateNo | nvarchar(25) |  |  |
| 4 | InvSeries | nvarchar(25) |  |  |
| 5 | InvDate | datetime |  |  |
| 6 | InvNo | nvarchar(25) |  |  |
| 7 | CompanyTaxCode | nvarchar(50) |  |  |
| 8 | AccountObjectName | nvarchar(400) |  |  |
| 9 | AccountObjectAddress | nvarchar(400) |  |  |
| 10 | AccountObjectTaxCode | nvarchar(50) |  |  |
| 11 | AccountObjectTel | nvarchar(150) |  |  |
| 12 | Payer | nvarchar(255) |  |  |
| 13 | BankAccount | nvarchar(100) |  |  |
| 14 | BankName | nvarchar(255) |  |  |
| 15 | JournalMemo | nvarchar(500) |  |  |
| 16 | DueDay | int |  |  |
| 17 | DueDate | datetime |  |  |
| 18 | OtherTerm | nvarchar(255) |  |  |
| 19 | ShippingAddress | nvarchar(255) |  |  |
| 20 | PaymentMethod | nvarchar(50) |  |  |
| 21 | Buyer | nvarchar(255) |  |  |
| 22 | Receiver | nvarchar(255) |  |  |
| 23 | ReceiverAddress | nvarchar(255) |  |  |
| 24 | CurrencyID | nvarchar(5) |  |  |
| 25 | ExchangeRate | decimal(18,4) |  |  |
| 26 | DebtStatus | int |  |  |
| 27 | SupplierName | nvarchar(400) |  |  |
| 28 | TotalSaleAmountOC | decimal(18,4) | NN |  |
| 29 | TotalSaleAmount | decimal(18,4) | NN |  |
| 30 | TotalAmountOC | decimal(18,4) | NN |  |
| 31 | TotalAmount | decimal(18,4) | NN |  |
| 32 | TotalDiscountAmountOC | decimal(18,4) | NN |  |
| 33 | TotalDiscountAmount | decimal(18,4) | NN |  |
| 34 | TotalVATAmountOC | decimal(18,4) | NN |  |
| 35 | TotalVATAmount | decimal(18,4) | NN |  |
| 36 | CreatedDate | datetime |  |  |
| 37 | CreatedBy | nvarchar(50) |  |  |
| 38 | ModifiedDate | datetime |  |  |
| 39 | ModifiedBy | nvarchar(50) |  |  |
| 40 | InvoiceStatus | int |  |  |
| 41 | PostedStatus | bit | NN |  |
| 42 | EID | int | NN |  |
| 43 | InvTypeCode | nvarchar(25) |  |  |
| 44 | OrgInvTemplateNo | nvarchar(25) |  |  |
| 45 | OrgInvSeries | nvarchar(20) |  |  |
| 46 | OrgInvDate | datetime |  |  |
| 47 | OrgInvNo | nvarchar(25) |  |  |
| 48 | DeletedDate | datetime |  |  |
| 49 | DeletedReason | nvarchar(255) |  |  |
| 50 | DeletedRefNo | nvarchar(25) |  |  |
| 51 | AccountObjectCode | nvarchar(50) |  |  |
| 52 | RefIDSAInvoiceDelete | uniqueidentifier |  |  |
| 53 | RefTypeSAInvoiceDelete | int |  |  |
| 54 | IsReductionInvoice | bit |  |  |
| 55 | GetServerType | int | NN |  |
| 56 | InvoiceCode | nvarchar(100) |  |  |
| 57 | InvTemplateNo123 | nvarchar(25) |  |  |
| 58 | TaxReductionType | int | NN |  |
| 59 | InvData | nvarchar(MAX) |  |  |
| 60 | IsDiscountInvoice | bit | NN |  |
| 61 | BuyerFullName | nvarchar(255) |  |  |
| 62 | InternalCommand | nvarchar(255) |  |  |
| 63 | ContractDate | datetime |  |  |
| 64 | InternalCommandOwner | nvarchar(255) |  |  |
| 65 | StockOutAddress | nvarchar(255) |  |  |
| 66 | StockOutFullName | nvarchar(255) |  |  |
| 67 | TransporterName | nvarchar(255) |  |  |
| 68 | TransportContractCode | nvarchar(255) |  |  |
| 69 | Transport | nvarchar(255) |  |  |
| 70 | StockInLegalName | nvarchar(255) |  |  |
| 71 | StockInTaxCode | nvarchar(50) |  |  |
| 72 | StockInFullName | nvarchar(255) |  |  |
| 73 | StockInAddress | nvarchar(255) |  |  |
| 74 | SellerAddress | nvarchar(255) |  |  |
| 75 | InternalJournalMemo | nvarchar(255) |  |  |
| 76 | IsOutBot | bit | NN |  |
| 77 | OrgID | nvarchar(50) |  |  |
| 78 | OutbotStatus | int |  |  |
| 79 | NewTypeStatus | int | NN |  |
| 80 | PublishStatus | int | NN |  |
| 81 | EISendTaxAuthorityStatus | int |  |  |
| 82 | RoomNo | nvarchar(500) |  |  |
| 83 | CheckInDate | datetime |  |  |
| 84 | CheckOutDate | datetime |  |  |
| 85 | IdentificationNumber | nvarchar(12) |  |  |
| 86 | PassportNumber | nvarchar(20) |  |  |
| 87 | BudgetCode | nvarchar(7) |  |  |
| 88 | AccountObjectPhoneNumber | nvarchar(50) |  |  |
| 89 | ListNoEInvoice | nvarchar(50) |  |  |
| 90 | ListDateEInvoice | datetime |  |  |
| 91 | ShopCode | nvarchar(50) |  |  |
| 92 | ShopName | nvarchar(400) |  |  |

## FROMEInvoiceDetail

Rows: 0 | Columns: 36

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier |  |  |
| 3 | Description | nvarchar(500) |  |  |
| 4 | UnitName | nvarchar(255) |  |  |
| 5 | Quantity | decimal(22,8) |  |  |
| 6 | UnitPrice | decimal(20,6) |  |  |
| 7 | UnitPriceAfterTax | decimal(18,4) | NN |  |
| 8 | AmountOC | decimal(18,4) | NN |  |
| 9 | Amount | decimal(18,4) | NN |  |
| 10 | DiscountRate | decimal(18,4) | NN |  |
| 11 | DiscountAmountOC | decimal(18,4) | NN |  |
| 12 | DiscountAmount | decimal(18,4) | NN |  |
| 13 | VATRate | decimal(18,4) |  |  |
| 14 | VATAmountOC | decimal(18,4) | NN |  |
| 15 | VATAmount | decimal(18,4) | NN |  |
| 16 | SortOrder | int | NN |  |
| 17 | InventoryItemCode | nvarchar(50) |  |  |
| 18 | IsPromotion | bit | NN |  |
| 19 | AmountAfterTax | decimal(18,4) | NN |  |
| 20 | LotNo | nvarchar(50) |  |  |
| 21 | ExpiryDate | datetime |  |  |
| 22 | TransactionID | nvarchar(50) |  | FROMEInvoice.TransactionID |
| 23 | DeductionsTaxAmount | decimal(18,4) |  |  |
| 24 | DeductionsTaxAmountOC | decimal(18,4) |  |  |
| 25 | VATRate406 | decimal(18,4) |  |  |
| 26 | VATRateOther | decimal(18,4) |  |  |
| 27 | IsTradeDiscount | bit | NN |  |
| 28 | EngineNumber | nvarchar(50) |  |  |
| 29 | ChassisNumber | nvarchar(50) |  |  |
| 30 | SpecificType | int |  |  |
| 31 | SpecificData | nvarchar(MAX) |  |  |
| 32 | VINNumber | nvarchar(200) |  |  |
| 33 | SenderName | nvarchar(200) |  |  |
| 34 | SenderAddress | nvarchar(200) |  |  |
| 35 | SenderIDNumber | nvarchar(200) |  |  |
| 36 | SenderTaxCode | nvarchar(200) |  |  |

## FRObligationToGovTemplate

Rows: 48 | Columns: 21

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ItemID | uniqueidentifier | PK NN |  |
| 2 | ItemIndex | int |  |  |
| 3 | ItemCode | nvarchar(20) |  |  |
| 4 | ItemName | nvarchar(255) |  |  |
| 5 | ItemNameEnglish | nvarchar(1000) |  |  |
| 6 | IsBold | bit |  |  |
| 7 | IsItalic | bit |  |  |
| 8 | Hidden | bit |  |  |
| 9 | Description | nvarchar(MAX) |  |  |
| 10 | FormulaType | int |  |  |
| 11 | Formula | xml |  |  |
| 12 | UnPaidOfPrevPeriodAmount | nvarchar(MAX) |  |  |
| 13 | PayableAmount | nvarchar(MAX) |  |  |
| 14 | PaidAmount | nvarchar(MAX) |  |  |
| 15 | CreatedDate | datetime |  |  |
| 16 | CreatedBy | nvarchar(50) |  |  |
| 17 | ModifiedDate | datetime |  |  |
| 18 | ModifiedBy | nvarchar(50) |  |  |
| 19 | AccountingSystem | int |  |  |
| 20 | ItemNameChinese | nvarchar(255) |  |  |
| 21 | ItemNameKorean | nvarchar(255) |  |  |

## FRObligationToGovTemplateDefault

Rows: 48 | Columns: 21

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ItemID | uniqueidentifier | PK NN |  |
| 2 | ItemIndex | int |  |  |
| 3 | ItemCode | nvarchar(20) |  |  |
| 4 | ItemName | nvarchar(255) |  |  |
| 5 | ItemNameEnglish | nvarchar(1000) |  |  |
| 6 | IsBold | bit |  |  |
| 7 | IsItalic | bit |  |  |
| 8 | Hidden | bit |  |  |
| 9 | Description | nvarchar(MAX) |  |  |
| 10 | FormulaType | int |  |  |
| 11 | Formula | xml |  |  |
| 12 | UnPaidOfPrevPeriodAmount | nvarchar(MAX) |  |  |
| 13 | PayableAmount | nvarchar(MAX) |  |  |
| 14 | PaidAmount | nvarchar(MAX) |  |  |
| 15 | CreatedDate | datetime |  |  |
| 16 | CreatedBy | nvarchar(50) |  |  |
| 17 | ModifiedDate | datetime |  |  |
| 18 | ModifiedBy | nvarchar(50) |  |  |
| 19 | AccountingSystem | int |  |  |
| 20 | ItemNameChinese | nvarchar(255) |  |  |
| 21 | ItemNameKorean | nvarchar(255) |  |  |

## FRReportDetail

Rows: 0 | Columns: 31

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReportDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier |  | FRReportList.RefID |
| 3 | ReportType | nvarchar(100) |  |  |
| 4 | ItemID | uniqueidentifier |  |  |
| 5 | ItemCode | nvarchar(20) |  |  |
| 6 | ItemName | nvarchar(255) |  |  |
| 7 | ItemNameEnglish | nvarchar(255) |  |  |
| 8 | ItemIndex | int |  |  |
| 9 | Description | nvarchar(255) |  |  |
| 10 | FormulaType | int |  |  |
| 11 | FormulaFrontEnd | nvarchar(MAX) |  |  |
| 12 | Amount | decimal(25,4) |  |  |
| 13 | PrevAmount | decimal(25,4) |  |  |
| 14 | Hidden | bit |  |  |
| 15 | IsBold | bit |  |  |
| 16 | IsItalic | bit |  |  |
| 17 | SortOrder | int |  |  |
| 18 | Category | int |  |  |
| 19 | Formula | xml |  |  |
| 20 | OtherPrevAmount | decimal(18,4) |  |  |
| 21 | OtherAmount | decimal(18,4) |  |  |
| 22 | ItemNameChinese | nvarchar(255) |  |  |
| 23 | ItemNameKorean | nvarchar(255) |  |  |
| 24 | FormulaFrontEndAdjust | nvarchar(MAX) |  |  |
| 25 | FormulaAdjust | xml |  |  |
| 26 | AmountAdjust | decimal(25,4) |  |  |
| 27 | PrevAmountAdjust | decimal(25,4) |  |  |
| 28 | OtherPrevAmountAdjust | decimal(18,4) |  |  |
| 29 | OtherAmountAdjust | decimal(18,4) |  |  |
| 30 | TotalAmount | decimal(25,4) |  |  |
| 31 | PrevTotalAmount | decimal(25,4) |  |  |

## FRReportInternalAdjustmentEntries

Rows: 0 | Columns: 18

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReportDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier |  | FRReportList.RefID |
| 3 | Description | nvarchar(500) |  |  |
| 4 | DebitAccount | nvarchar(25) |  |  |
| 5 | CreditAccount | nvarchar(25) |  |  |
| 6 | AdjustmentAmount | decimal(25,4) |  |  |
| 7 | PeriodType | int |  |  |
| 8 | FromOrganizationUnitID | uniqueidentifier |  |  |
| 9 | FromOrganizationUnitCode | nvarchar(25) |  |  |
| 10 | FromOrganizationUnitName | nvarchar(255) |  |  |
| 11 | ToOrganizationUnitID | uniqueidentifier |  |  |
| 12 | ToOrganizationUnitCode | nvarchar(25) |  |  |
| 13 | ToOrganizationUnitName | nvarchar(255) |  |  |
| 14 | BussinessID | int |  |  |
| 15 | ActivityID | int |  |  |
| 16 | OriginEntries | int |  |  |
| 17 | SortOrder | int |  |  |
| 18 | AutoGenerateSource | int | NN |  |

## FRReportInternalDebtBalanceDetail

Rows: 0 | Columns: 18

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReportDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier |  | FRReportList.RefID |
| 3 | AccountObjectID | uniqueidentifier |  |  |
| 4 | AccountObjectCode | nvarchar(50) |  |  |
| 5 | AccountObjectName | nvarchar(400) |  |  |
| 6 | AccountNumber | nvarchar(25) |  |  |
| 7 | OpeningDebitAmount | decimal(25,4) |  |  |
| 8 | OpeningCreditAmount | decimal(25,4) |  |  |
| 9 | ClosingDebitAmount | decimal(25,4) |  |  |
| 10 | ClosingCreditAmount | decimal(25,4) |  |  |
| 11 | OrganizationUnitID | uniqueidentifier |  |  |
| 12 | OrganizationUnitCode | nvarchar(25) |  |  |
| 13 | OrganizationUnitName | nvarchar(255) |  |  |
| 14 | BranchID | uniqueidentifier |  |  |
| 15 | BranchCode | nvarchar(25) |  |  |
| 16 | BranchName | nvarchar(255) |  |  |
| 17 | BranchGroup | nvarchar(255) |  |  |
| 18 | SortOrder | int |  |  |

## FRReportInternalMappingObject

Rows: 0 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReportDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier |  | FRReportList.RefID |
| 3 | AccountObjectID | uniqueidentifier |  |  |
| 4 | AccountObjectCode | nvarchar(50) |  |  |
| 5 | AccountObjectName | nvarchar(400) |  |  |
| 6 | OrganizationUnitID | uniqueidentifier |  |  |
| 7 | OrganizationUnitCode | nvarchar(25) |  |  |
| 8 | OrganizationUnitName | nvarchar(255) |  |  |
| 9 | SortOrder | int |  |  |
| 10 | ModifiedDate | datetime |  |  |

## FRReportInternalTransactionDetail

Rows: 0 | Columns: 25

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReportDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier |  | FRReportList.RefID |
| 3 | VoucherRefDetailID | uniqueidentifier |  |  |
| 4 | VoucherRefID | uniqueidentifier |  |  |
| 5 | VoucherPostedDate | date |  |  |
| 6 | VoucherRefNo | nvarchar(50) |  |  |
| 7 | Description | nvarchar(500) |  |  |
| 8 | AccountObjectID | uniqueidentifier |  |  |
| 9 | AccountObjectCode | nvarchar(50) |  |  |
| 10 | AccountObjectName | nvarchar(400) |  |  |
| 11 | AccountNumber | nvarchar(25) |  |  |
| 12 | CorrespondingAccountNumber | nvarchar(25) |  |  |
| 13 | DebitAmount | decimal(25,4) |  |  |
| 14 | CreditAmount | decimal(25,4) |  |  |
| 15 | BussinessID | int |  |  |
| 16 | ActivityID | int |  |  |
| 17 | OrganizationUnitID | uniqueidentifier |  |  |
| 18 | OrganizationUnitCode | nvarchar(25) |  |  |
| 19 | OrganizationUnitName | nvarchar(255) |  |  |
| 20 | BranchID | uniqueidentifier |  |  |
| 21 | BranchCode | nvarchar(25) |  |  |
| 22 | BranchName | nvarchar(255) |  |  |
| 23 | BranchGroup | nvarchar(500) |  |  |
| 24 | SortOrder | int |  |  |
| 25 | VoucherReftype | int |  |  |

## FRReportList

Rows: 0 | Columns: 41

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | DisplayOnBook | int | NN |  |
| 3 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 4 | Period | int |  |  |
| 5 | Year | int |  |  |
| 6 | PeriodName | nvarchar(100) |  |  |
| 7 | ReportName | nvarchar(255) |  |  |
| 8 | RefType | int |  |  |
| 9 | ReportCreatedBy | nvarchar(128) |  |  |
| 10 | ReportCreatedDate | datetime |  |  |
| 11 | AccountingSystem | int |  |  |
| 12 | IsIncludedB02 | bit | NN |  |
| 13 | IsIncludedB03 | bit |  |  |
| 14 | IsIncludedF01 | bit |  |  |
| 15 | IsShowBalanceOnTwoSide | bit | NN |  |
| 16 | IsSummaryReport | bit |  |  |
| 17 | EditVersion | timestamp | NN |  |
| 18 | CreatedDate | datetime |  |  |
| 19 | CreatedBy | nvarchar(50) |  |  |
| 20 | ModifiedDate | datetime |  |  |
| 21 | ModifiedBy | nvarchar(50) |  |  |
| 22 | FromDate | datetime |  |  |
| 23 | ToDate | datetime |  |  |
| 24 | DirectorName | nvarchar(255) |  |  |
| 25 | IsSimilarBranch | bit |  |  |
| 26 | IsIncludedB03_Indirect | bit |  |  |
| 27 | BussinessRespondActivityContinue | bit | NN |  |
| 28 | CurrencyID | nvarchar(3) |  |  |
| 29 | CurrencyName | nvarchar(128) |  |  |
| 30 | ForeignName | nvarchar(128) |  |  |
| 31 | ExchangeRate | decimal(18,4) |  |  |
| 32 | IsB01bDNN | bit |  |  |
| 33 | IsGetInfoFromLastFRReport | bit | NN |  |
| 34 | IsReportFinanceAudit | bit | NN |  |
| 35 | AuditorCommentCode | nvarchar(20) |  |  |
| 36 | AuditorCommentName | nvarchar(255) |  |  |
| 37 | IsIncludedF02 | bit |  |  |
| 38 | IsIncludedF03 | bit |  |  |
| 39 | IsIncludedF04 | bit |  |  |
| 40 | SubAccountSystem | int |  |  |
| 41 | ShowAfterAdjustAmount | bit | NN |  |

## FRTemplate

Rows: 919 | Columns: 23

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ItemID | uniqueidentifier | PK NN |  |
| 2 | ReportID | varchar(100) | NN |  |
| 3 | ItemCode | nvarchar(20) |  |  |
| 4 | ItemName | nvarchar(255) |  |  |
| 5 | ItemNameEnglish | nvarchar(255) |  |  |
| 6 | ItemIndex | int |  |  |
| 7 | Description | nvarchar(50) |  |  |
| 8 | FormulaType | int |  |  |
| 9 | FormulaFrontEnd | nvarchar(MAX) |  |  |
| 10 | Formula | xml |  |  |
| 13 | Hidden | bit |  |  |
| 14 | IsBold | bit |  |  |
| 15 | IsItalic | bit |  |  |
| 16 | AccountingSystem | int |  |  |
| 17 | CreatedDate | datetime |  |  |
| 18 | CreatedBy | nvarchar(50) |  |  |
| 19 | ModifiedDate | datetime |  |  |
| 20 | ModifiedBy | nvarchar(50) |  |  |
| 21 | Category | int |  |  |
| 22 | ItemNameChinese | nvarchar(255) |  |  |
| 23 | ItemNameKorean | nvarchar(255) |  |  |
| 24 | FormulaFrontEndAdjust | nvarchar(MAX) |  |  |
| 25 | FormulaAdjust | xml |  |  |

## FRTemplateDefault

Rows: 919 | Columns: 23

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ItemID | uniqueidentifier | PK NN |  |
| 2 | ReportID | varchar(100) | NN |  |
| 3 | ItemCode | nvarchar(20) |  |  |
| 4 | ItemName | nvarchar(255) |  |  |
| 5 | ItemNameEnglish | nvarchar(255) |  |  |
| 6 | ItemIndex | int |  |  |
| 7 | Description | nvarchar(50) |  |  |
| 8 | FormulaType | int |  |  |
| 9 | FormulaFrontEnd | nvarchar(MAX) |  |  |
| 10 | Formula | xml |  |  |
| 12 | Hidden | bit |  |  |
| 13 | IsBold | bit |  |  |
| 14 | IsItalic | bit |  |  |
| 15 | AccountingSystem | int |  |  |
| 16 | CreatedDate | datetime |  |  |
| 17 | CreatedBy | nvarchar(50) |  |  |
| 18 | ModifiedDate | datetime |  |  |
| 19 | ModifiedBy | nvarchar(50) |  |  |
| 20 | Category | int |  |  |
| 21 | ItemNameChinese | nvarchar(255) |  |  |
| 22 | ItemNameKorean | nvarchar(255) |  |  |
| 23 | FormulaFrontEndAdjust | nvarchar(MAX) |  |  |
| 24 | FormulaAdjust | xml |  |  |

## FRTemplateDefaultTemp

Rows: 400 | Columns: 24

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ItemID | uniqueidentifier | PK NN |  |
| 2 | ReportID | varchar(100) | NN |  |
| 3 | ItemCode | nvarchar(20) |  |  |
| 4 | ItemName | nvarchar(255) |  |  |
| 5 | ItemNameEnglish | nvarchar(255) |  |  |
| 6 | ItemIndex | int |  |  |
| 7 | Description | nvarchar(50) |  |  |
| 8 | FormulaType | int |  |  |
| 9 | FormulaFrontEnd | nvarchar(MAX) |  |  |
| 10 | Formula | xml |  |  |
| 11 | Hidden | bit |  |  |
| 12 | IsBold | bit |  |  |
| 13 | IsItalic | bit |  |  |
| 14 | AccountingSystem | int |  |  |
| 15 | CreatedDate | datetime |  |  |
| 16 | CreatedBy | nvarchar(50) |  |  |
| 17 | ModifiedDate | datetime |  |  |
| 18 | ModifiedBy | nvarchar(50) |  |  |
| 19 | Category | int |  |  |
| 20 | ItemNameChinese | nvarchar(255) |  |  |
| 21 | ItemNameKorean | nvarchar(255) |  |  |
| 22 | IsDetail | bit |  |  |
| 23 | FormulaFrontEndAdjust | nvarchar(MAX) |  |  |
| 24 | FormulaAdjust | xml |  |  |

## FRTemplateDrilldownDetail

Rows: 50 | Columns: 18

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ItemID | uniqueidentifier | PK NN |  |
| 2 | ReportID | varchar(100) | NN |  |
| 3 | ItemCode | nvarchar(20) |  |  |
| 4 | ItemName | nvarchar(255) |  |  |
| 5 | ItemNameEnglish | nvarchar(255) |  |  |
| 6 | Description | nvarchar(50) |  |  |
| 7 | FormulaType | int |  |  |
| 8 | FormulaFrontEnd | nvarchar(MAX) |  |  |
| 9 | Formula | xml |  |  |
| 10 | AccountingSystem | int |  |  |
| 11 | Category | int |  |  |
| 12 | IsEdited | bit |  |  |
| 13 | ItemIndex | int |  |  |
| 14 | AccountNumberSort | nvarchar(25) |  |  |
| 15 | CorrespondingAccountNumberfilter | nvarchar(25) |  |  |
| 16 | ColumnsAmountfilter | nvarchar(50) |  |  |
| 17 | ItemNameChinese | nvarchar(255) |  |  |
| 18 | ItemNameKorean | nvarchar(255) |  |  |

## FavoriteReportList

Rows: 11 | Columns: 11

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReportID | varchar(100) | NN |  |
| 2 | ReportName | nvarchar(255) |  |  |
| 3 | Type | bit |  |  |
| 4 | UserID | uniqueidentifier | NN |  |
| 5 | UserName | nvarchar(50) | NN |  |
| 6 | Description | nvarchar(255) |  |  |
| 7 | GroupID | int |  |  |
| 8 | ReportNameEnglish | nvarchar(255) |  |  |
| 9 | GroupType | int |  |  |
| 10 | ReportNameChinese | nvarchar(255) |  |  |
| 11 | ReportNameKorean | nvarchar(255) |  |  |

# 25 — Mobile sync

## MobileAccountBalanceDataChanged

Rows: 110 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ChangedID | int | PK NN ID |  |
| 2 | AccountNumber | nvarchar(20) | NN |  |
| 3 | SyncStatus | int | NN |  |

## MobileDataChanged

Rows: 0 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ChangedID | int | PK NN ID |  |
| 2 | TableName | nvarchar(50) | NN |  |
| 3 | SyncStatus | int | NN |  |
| 4 | PostedDate | datetime |  |  |

## MobileDataFirstSync

Rows: 22 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | MobileDataFirstSyncID | int | PK NN ID |  |
| 2 | ReportID | nvarchar(150) |  |  |
| 3 | IsFirstSync | bit | NN |  |
| 4 | ToDay | date |  |  |
| 5 | SyncNumber | int |  |  |
| 6 | SortOrder | int |  |  |

## MobileDebtDataChanged

Rows: 1 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ChangedID | int | PK NN ID |  |
| 2 | PostedDate | date | NN |  |
| 3 | SyncStatus | int | NN |  |
| 4 | DueDate | date |  |  |

## MobileFinancialDataChanged

Rows: 0 | Columns: 5

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ChangedID | int | PK NN ID |  |
| 2 | RefID | uniqueidentifier |  |  |
| 3 | ReportID | nvarchar(100) |  |  |
| 4 | IsDeleted | bit |  |  |
| 5 | BranchID | uniqueidentifier |  |  |

## MobileJCAllocationExpenseDataChanged

Rows: 0 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ChangedID | int | PK NN ID |  |
| 2 | SyncStatus | int | NN |  |
| 3 | ReportYear | int | NN |  |
| 4 | ReportMonth | int | NN |  |

## MobileSalarySheetDataChanged

Rows: 0 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ChangedID | int | PK NN ID |  |
| 2 | ReportYear | int | NN |  |
| 3 | ReportMonth | int | NN |  |
| 4 | SyncStatus | int | NN |  |

## MobileStockBalanceByExpiryDateDataChanged

Rows: 4,152 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ChangedID | int | PK NN ID |  |
| 2 | BranchID | uniqueidentifier | NN |  |
| 3 | InventoryItemID | uniqueidentifier | NN |  |
| 4 | SyncStatus | int | NN |  |

## MobileSyncData

Rows: 83 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | TableName | nvarchar(150) | NN |  |
| 2 | ObjectID | nvarchar(50) | NN |  |
| 3 | IsDeleted | bit | NN |  |

## MobileSyncTimeHistory

Rows: 5 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SyncID | int | PK NN ID |  |
| 2 | DataType | nvarchar(30) | NN |  |
| 3 | SyncTime | datetime | NN |  |
| 4 | SyncStatus | int | NN |  |
| 5 | ComputerName | nvarchar(50) |  |  |
| 6 | UserName | nvarchar(50) |  |  |
| 7 | Description | nvarchar(MAX) |  |  |

# 26 — Số dư đầu kỳ

## OpeningAccountEntry

Rows: 419 | Columns: 24

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefType | int | NN |  |
| 3 | PostedDate | datetime |  |  |
| 4 | AccountNumber | nvarchar(20) |  | Account.AccountNumber |
| 5 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 6 | CurrencyID | nvarchar(3) |  | CCY.CurrencyID |
| 7 | ExchangeRate | decimal(18,4) |  |  |
| 8 | DebitAmountOC | decimal(18,4) | NN |  |
| 9 | DebitAmount | decimal(18,4) | NN |  |
| 10 | CreditAmountOC | decimal(18,4) | NN |  |
| 11 | CreditAmount | decimal(18,4) | NN |  |
| 12 | BankAccountID | uniqueidentifier |  | BankAccount.BankAccountID |
| 13 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 14 | DisplayOnBook | int | NN |  |
| 15 | IsPostedCashBook | bit |  |  |
| 16 | CashBookPostedDate | datetime |  |  |
| 17 | EditVersion | timestamp | NN |  |
| 18 | CreatedDate | datetime |  |  |
| 19 | CreatedBy | nvarchar(50) |  |  |
| 20 | ModifiedDate | datetime |  |  |
| 21 | ModifiedBy | nvarchar(50) |  |  |
| 22 | IsPostedManagement | bit | NN |  |
| 23 | IsPostedFinance | bit | NN |  |
| 24 | IsAutoGenerate | bit |  |  |

## OpeningAccountEntryDetail

Rows: 3,891 | Columns: 18

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | OpeningAccountEntry.RefID |
| 3 | EmployeeID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 4 | ProjectWorkID | uniqueidentifier |  | ProjectWork.ProjectWorkID |
| 5 | ContractID | uniqueidentifier |  | Contract.ContractID |
| 6 | DebitAmountOC | decimal(18,4) | NN |  |
| 7 | DebitAmount | decimal(18,4) | NN |  |
| 8 | CreditAmountOC | decimal(18,4) | NN |  |
| 9 | CreditAmount | decimal(18,4) | NN |  |
| 10 | SortOrder | int | NN |  |
| 11 | PUContractID | uniqueidentifier |  | PUContract.PUContractID |
| 12 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 13 | ExpenseItemID | uniqueidentifier |  | ExpenseItem.ExpenseItemID |
| 14 | JobID | uniqueidentifier |  | Job.JobID |
| 15 | OrderID | uniqueidentifier |  | SAOrder.RefID |
| 17 | ListItemID | uniqueidentifier |  | ListItem.ListItemID |
| 18 | PUOrderRefID | uniqueidentifier |  | PUOrder.RefID |
| 19 | LOANAgreementID | uniqueidentifier |  |  |

## OpeningAccountEntryDetailInvoice

Rows: 260 | Columns: 15

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | OpeningAccountEntry.RefID |
| 3 | InvDate | datetime |  |  |
| 4 | InvNo | nvarchar(25) |  |  |
| 5 | DueDate | datetime |  |  |
| 6 | EmployeeID | uniqueidentifier |  | AccountObject.AccountObjectID |
| 7 | ExchangeRate | decimal(18,4) |  |  |
| 8 | InvoiceAmountOC | decimal(18,4) | NN |  |
| 9 | InvoiceAmount | decimal(18,4) | NN |  |
| 10 | AmountOC | decimal(18,4) | NN |  |
| 11 | Amount | decimal(18,4) | NN |  |
| 12 | SortOrder | int |  |  |
| 13 | IsAutoGenerate | bit |  |  |
| 14 | PayAmountOC | decimal(18,4) | NN |  |
| 15 | PayAmount | decimal(18,4) | NN |  |

## OpeningInventoryEntry

Rows: 3,575 | Columns: 33

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefType | int | NN |  |
| 3 | PostedDate | datetime | NN |  |
| 4 | RefNo | nvarchar(20) |  |  |
| 5 | InventoryItemID | uniqueidentifier | NN | InventoryItem.InventoryItemID |
| 6 | StockID | uniqueidentifier | NN | Stock.StockID |
| 7 | UnitID | uniqueidentifier |  | Unit.UnitID |
| 8 | Quantity | decimal(22,8) | NN |  |
| 9 | UnitPrice | decimal(20,6) | NN |  |
| 10 | Amount | decimal(18,4) | NN |  |
| 11 | ExpiryDate | datetime |  |  |
| 12 | LotNo | nvarchar(50) |  |  |
| 13 | MainUnitID | uniqueidentifier |  | Unit.UnitID |
| 14 | MainUnitPrice | decimal(20,6) | NN |  |
| 15 | MainConvertRate | decimal(18,4) | NN |  |
| 16 | MainQuantity | decimal(22,8) | NN |  |
| 17 | ExchangeRateOperator | nvarchar(3) | NN |  |
| 18 | BranchID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 19 | DisplayOnBook | int | NN |  |
| 20 | RefOrder | int | NN ID |  |
| 21 | SortOrder | int |  |  |
| 22 | EditVersion | timestamp |  |  |
| 23 | IsPostedInventoryBook | bit |  |  |
| 24 | InventoryPostedDate | datetime |  |  |
| 25 | CreatedDate | datetime |  |  |
| 26 | CreatedBy | nvarchar(50) |  |  |
| 27 | ModifiedDate | datetime |  |  |
| 28 | ModifiedBy | nvarchar(50) |  |  |
| 29 | IsPostedFinance | bit | NN |  |
| 30 | IsPostedManagement | bit | NN |  |
| 31 | InventoryResaleTypeID | int |  |  |
| 32 | INRefOrder | datetime |  |  |
| 33 | AccountObjectID | uniqueidentifier |  | AccountObject.AccountObjectID |

## VoucherToOpening

Rows: 0 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | OpeningRefID | uniqueidentifier |  |  |
| 2 | OpeningPostedDate | datetime |  |  |
| 3 | VoucherRefID | uniqueidentifier |  |  |
| 4 | VoucherRefType | int |  |  |
| 5 | VoucherRefDetailID | uniqueidentifier |  |  |
| 6 | OpeningQuantity | decimal(22,8) |  |  |
| 7 | DisplayOnBook | bit |  |  |

# 27 — Đồng bộ / Hệ thống phụ trợ

## BUExpenditure

Rows: 0 | Columns: 14

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | Year | int | NN |  |
| 3 | OrganizationUnitID | uniqueidentifier |  | OrganizationUnit.OrganizationUnitID |
| 4 | IsDetailByOrganizationUnit | bit | NN |  |
| 5 | TotalAmount | decimal(18,4) | NN |  |
| 6 | BranchID | uniqueidentifier | NN | OrganizationUnit.OrganizationUnitID |
| 7 | IsCreateByYear | bit | NN |  |
| 8 | IsRevenue | bit | NN |  |
| 9 | IsExpense | bit | NN |  |
| 10 | RevenueType | int | NN |  |
| 11 | AmountByRevenue | decimal(18,4) | NN |  |
| 12 | AmountByExpense | decimal(18,4) | NN |  |
| 13 | AmountByProfit | decimal(18,4) | NN |  |
| 14 | TaxAmount | decimal(18,4) | NN |  |

## BUExpenditureDetail

Rows: 0 | Columns: 25

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN | BUExpenditure.RefID |
| 3 | ExpenseItemID | uniqueidentifier |  |  |
| 4 | AmountMonth | decimal(18,4) | NN |  |
| 5 | AmountMonth1 | decimal(18,4) | NN |  |
| 6 | AmountMonth2 | decimal(18,4) | NN |  |
| 7 | AmountMonth3 | decimal(18,4) | NN |  |
| 8 | AmountMonth4 | decimal(18,4) | NN |  |
| 9 | AmountMonth5 | decimal(18,4) | NN |  |
| 10 | AmountMonth6 | decimal(18,4) | NN |  |
| 11 | AmountMonth7 | decimal(18,4) | NN |  |
| 12 | AmountMonth8 | decimal(18,4) | NN |  |
| 13 | AmountMonth9 | decimal(18,4) | NN |  |
| 14 | AmountMonth10 | decimal(18,4) | NN |  |
| 15 | AmountMonth11 | decimal(18,4) | NN |  |
| 16 | AmountMonth12 | decimal(18,4) | NN |  |
| 17 | AccountID | uniqueidentifier |  |  |
| 18 | InventoryCategoryID | uniqueidentifier |  |  |
| 19 | ItemID | uniqueidentifier |  |  |
| 20 | ItemCode | nvarchar(20) |  |  |
| 21 | ItemName | nvarchar(128) |  |  |
| 22 | ItemIndex | int |  |  |
| 23 | ParentID | uniqueidentifier |  |  |
| 24 | Grade | int |  |  |
| 25 | IsParent | bit |  |  |

## BusinessType

Rows: 78 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | BusinessTypeNameSME | nvarchar(MAX) |  |  |
| 2 | Type | int |  |  |
| 3 | SortOrder | int |  |  |

## BusinessTypeHiddenOption

Rows: 2,416 | Columns: 12

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | OptionVisibleBusinessID | uniqueidentifier | PK NN |  |
| 2 | OptionVisibleBusiness | nvarchar(50) |  |  |
| 3 | ColumnHidden | nvarchar(50) |  |  |
| 4 | TypeHidden | int |  |  |
| 5 | LayoutHidden | nvarchar(50) |  |  |
| 6 | RefType | int |  |  |
| 7 | VoucherType | int |  |  |
| 8 | SubSystemCode | nvarchar(50) |  |  |
| 9 | TableName | nvarchar(50) |  |  |
| 10 | DictionaryType | nvarchar(50) |  |  |
| 11 | ReportID | nvarchar(100) |  |  |
| 12 | ParentID | nvarchar(100) |  |  |

## BusinessTypeVisible

Rows: 450 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | BusinessTypeVisibleID | uniqueidentifier | NN |  |
| 2 | BusinessTypeName | nvarchar(MAX) |  |  |
| 3 | OptionVisibleBusiness | nvarchar(MAX) |  |  |

## ConfigChangePostAccount

Rows: 166 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | TableName | nvarchar(150) | NN |  |
| 2 | ColumnName | nvarchar(150) | NN |  |
| 3 | ConvertDataType | int | NN |  |
| 4 | SourceColumnName | nvarchar(150) |  |  |
| 5 | MaterTableName | nvarchar(150) |  |  |
| 6 | MasterColumnName | nvarchar(150) |  |  |
| 7 | DateColumnName | nvarchar(150) |  |  |
| 8 | TableDescription | nvarchar(255) |  |  |
| 9 | ColumnDescription | nvarchar(255) |  |  |

## ConfigListCABAAmount

Rows: 36 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ConfigListCABAAmountID | uniqueidentifier | PK NN |  |
| 2 | Reftype | int |  |  |
| 3 | MasterTableName | nvarchar(50) | NN |  |
| 4 | DetailTableName | nvarchar(50) |  |  |
| 5 | MasterCondition | nvarchar(255) |  |  |
| 6 | DetailCondition | nvarchar(255) |  |  |
| 7 | DebitAccount | nvarchar(50) |  |  |
| 8 | CreditAccount | nvarchar(50) |  |  |
| 9 | AmountOC | nvarchar(255) |  |  |
| 10 | Amount | nvarchar(255) |  |  |

## ConfigListTable

Rows: 117 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ConfigListTableID | uniqueidentifier | PK NN |  |
| 2 | Reftype | int | NN |  |
| 3 | GeneralTableName | nvarchar(100) | NN |  |
| 4 | ListCode | nvarchar(255) | NN |  |
| 5 | ListTableName | nvarchar(100) | NN |  |
| 6 | Description | nvarchar(255) |  |  |

## ConfigListTableUpdateRule

Rows: 34 | Columns: 6

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ConfigListTableUpdateRuleID | uniqueidentifier | PK NN |  |
| 2 | GeneralTableName | nvarchar(100) | NN |  |
| 3 | GeneralColumnName | nvarchar(100) | NN |  |
| 4 | ListColumnName | nvarchar(100) | NN |  |
| 5 | Description | nvarchar(255) |  |  |
| 6 | Condition | nvarchar(500) |  |  |

## ConfigTabVisibleByUser

Rows: 0 | Columns: 5

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ConfigTabID | uniqueidentifier | PK NN |  |
| 2 | UserID | uniqueidentifier | NN |  |
| 3 | SubSystemCode | nvarchar(100) | NN |  |
| 4 | ParentSubSystemCode | nvarchar(100) |  |  |
| 5 | Visible | bit | NN |  |

## DBOptionExtend

Rows: 0 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | OptionExtendID | uniqueidentifier | PK NN |  |
| 2 | OptionID | nvarchar(50) | NN |  |
| 3 | OptionValue | nvarchar(MAX) |  |  |
| 4 | ValueType | int | NN |  |
| 5 | Description | nvarchar(255) |  |  |
| 6 | CreatedDate | datetime |  |  |
| 7 | CreatedBy | nvarchar(50) |  |  |
| 8 | ModifiedDate | datetime |  |  |
| 9 | ModifiedBy | nvarchar(50) |  |  |

## DBPhysical_Error

Rows: 0 | Columns: 25

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | Error | bigint |  |  |
| 2 | Level | bigint |  |  |
| 3 | State | bigint |  |  |
| 4 | MessageText | nvarchar(MAX) |  |  |
| 5 | RepairLevel | nvarchar(255) |  |  |
| 6 | Status | bigint |  |  |
| 7 | DbId | bigint |  |  |
| 8 | DbFragId | bigint |  |  |
| 9 | ObjectID | bigint |  |  |
| 10 | IndexId | bigint |  |  |
| 11 | PartitionId | bigint |  |  |
| 12 | AllocUnitId | bigint |  |  |
| 13 | RidDbId | bigint |  |  |
| 14 | RidPruId | bigint |  |  |
| 15 | File | bigint |  |  |
| 16 | Page | bigint |  |  |
| 17 | Slot | bigint |  |  |
| 18 | RefDbID | bigint |  |  |
| 19 | RefPruId | bigint |  |  |
| 20 | RefFile | bigint |  |  |
| 21 | RefPage | bigint |  |  |
| 22 | RefSlot | bigint |  |  |
| 23 | Allocation | bigint |  |  |
| 24 | CreatedDate | datetime |  |  |
| 25 | ActionName | nvarchar(MAX) |  |  |

## DataColumnDictionary

Rows: 106 | Columns: 2

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | TableName | nvarchar(150) | NN |  |
| 2 | ColumnID | nvarchar(150) | NN |  |

## DataCreationBusiness

Rows: 23 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ID | uniqueidentifier | PK NN |  |
| 2 | SubSystemID | uniqueidentifier | NN | SubSystemSelfStudy.ID |
| 3 | BusinessName | nvarchar(MAX) |  |  |
| 4 | ToolbarKey | nvarchar(MAX) |  |  |
| 5 | SortOrder | int |  |  |
| 6 | SubSystemCode | nvarchar(50) |  |  |
| 7 | MasterTableName | nvarchar(255) |  |  |

## DataTableDictionary

Rows: 330 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | TableName | nvarchar(255) | PK NN |  |
| 2 | MaterTableName | nvarchar(255) |  |  |
| 3 | ColumnName | nvarchar(255) |  |  |
| 4 | MasterColumnName | nvarchar(255) |  |  |
| 5 | CodeOrNoColumnName | nvarchar(255) |  |  |
| 6 | DateColumnName | nvarchar(255) |  |  |
| 7 | RefTypeColumn | nvarchar(255) |  |  |
| 8 | TableType | int |  |  |
| 9 | Description | nvarchar(255) |  |  |
| 10 | DisplayOnBookColumn | nvarchar(255) |  |  |

## Declaration03DLEInvoice

Rows: 0 | Columns: 23

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | RefType | int |  |  |
| 3 | BranchID | uniqueidentifier |  |  |
| 4 | DeclarationCreatedDate | date |  |  |
| 5 | DeclarationName | nvarchar(255) |  |  |
| 6 | PeriodType | int |  |  |
| 7 | PeriodName | nvarchar(255) |  |  |
| 8 | FromDate | date |  |  |
| 9 | ToDate | date |  |  |
| 10 | DeclarationNum | nvarchar(10) |  |  |
| 11 | TaxPayer | nvarchar(255) |  |  |
| 12 | PayerTaxCode | nvarchar(50) |  |  |
| 13 | TaxAgencyName | nvarchar(255) |  |  |
| 14 | AgencyTaxCode | nvarchar(50) |  |  |
| 15 | TotalRevenueAmount | decimal(18,4) |  |  |
| 16 | TotalVATAmount | decimal(18,4) |  |  |
| 17 | SignPlace | nvarchar(255) |  |  |
| 18 | Signer | nvarchar(128) |  |  |
| 19 | EditVersion | timestamp | NN |  |
| 20 | CreatedDate | datetime |  |  |
| 21 | CreatedBy | nvarchar(50) |  |  |
| 22 | ModifiedDate | datetime |  |  |
| 23 | ModifiedBy | nvarchar(50) |  |  |

## Declaration03DLEInvoiceDetail

Rows: 0 | Columns: 23

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefDetailID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier |  | Declaration03DLEInvoice.RefID |
| 3 | SortOrder | int |  |  |
| 4 | LineOrderNo | nvarchar(5) |  |  |
| 5 | IsGroupRow | bit | NN |  |
| 6 | GroupCode | nvarchar(15) |  |  |
| 7 | InvoiceTypeName | nvarchar(255) |  |  |
| 8 | InvTemplateNo | nvarchar(25) |  |  |
| 9 | VATRate | decimal(18,4) |  |  |
| 10 | InvSeries | nvarchar(20) |  |  |
| 11 | InvNo | nvarchar(500) |  |  |
| 12 | InvDate | date |  |  |
| 13 | Buyer | nvarchar(400) |  |  |
| 14 | BuyerTaxCode | nvarchar(50) |  |  |
| 15 | RevenueAmount | decimal(18,4) |  |  |
| 16 | VATAmount | decimal(18,4) |  |  |
| 17 | Note | nvarchar(255) |  |  |
| 18 | CreatedBy | nvarchar(100) |  |  |
| 19 | CreatedDate | datetime |  |  |
| 20 | ModifiedBy | nvarchar(100) |  |  |
| 21 | ModifiedDate | datetime |  |  |
| 22 | VoucherRefType | int |  |  |
| 23 | VoucherRefID | uniqueidentifier |  |  |

## EmailBook

Rows: 0 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | BookID | uniqueidentifier | PK NN |  |
| 2 | BookName | nvarchar(255) |  |  |
| 3 | Email | nvarchar(255) | NN |  |
| 4 | Tel | nvarchar(50) |  |  |
| 5 | CompanyName | nvarchar(255) |  |  |
| 6 | DepartmentName | nvarchar(255) |  |  |
| 7 | Note | nvarchar(255) |  |  |

## EmailGroup

Rows: 0 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | EmailGroupID | uniqueidentifier | PK NN |  |
| 2 | EmailGroupName | nvarchar(255) | NN |  |
| 3 | Note | nvarchar(255) |  |  |

## EmailReference

Rows: 0 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ReferenceID | uniqueidentifier | PK NN |  |
| 2 | EmailGroupID | uniqueidentifier | NN | EmailGroup.EmailGroupID |
| 3 | BookID | uniqueidentifier | NN | EmailBook.BookID |
| 4 | SortOrder | int | NN |  |

## EmailTemplateApply

Rows: 0 | Columns: 5

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ApplyID | uniqueidentifier | PK NN |  |
| 2 | EmailTemplateID | uniqueidentifier | NN | EmailTemplateList.TemplateID |
| 3 | BranchID | uniqueidentifier |  |  |
| 4 | UserID | uniqueidentifier |  |  |
| 5 | TemplateType | int |  |  |

## EmailTemplateCustom

Rows: 0 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | EmailTemplateType | int | PK NN |  |
| 2 | EmailSubject | nvarchar(1000) | NN |  |
| 3 | EmailContent | nvarchar(MAX) |  |  |

## EmailTemplateList

Rows: 11 | Columns: 14

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | TemplateID | uniqueidentifier | PK NN |  |
| 2 | TemplateName | nvarchar(255) | NN |  |
| 3 | TemplateType | int | NN | SYSEmailTemplateType.TemplateTypeID |
| 4 | TemplateSubject | nvarchar(255) | NN |  |
| 5 | TemplateContent | nvarchar(MAX) | NN |  |
| 6 | AttachmentDefault | varchar(100) |  |  |
| 7 | IsSystem | bit | NN |  |
| 8 | IsGlobal | bit | NN |  |
| 9 | BranchID | uniqueidentifier |  |  |
| 10 | UserID | uniqueidentifier |  |  |
| 11 | CreatedBy | nvarchar(100) |  |  |
| 12 | CreatedDate | datetime |  |  |
| 13 | ModifiedBy | nvarchar(100) |  |  |
| 14 | ModifiedDate | datetime |  |  |

## MappingAccountTT99

Rows: 0 | Columns: 15

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RootAccountNumber | nvarchar(20) |  |  |
| 2 | SMEAccountNumber | nvarchar(20) |  |  |
| 3 | SMEAccountName | nvarchar(128) |  |  |
| 4 | AccountNumber | nvarchar(20) |  |  |
| 5 | KeepAccountNumber | nvarchar(20) |  |  |
| 6 | AccountName | nvarchar(128) |  |  |
| 7 | ActionType | int |  |  |
| 8 | HasForeignCurrencty | bit |  |  |
| 9 | DetailByObject | int |  |  |
| 10 | EnglishName | nvarchar(128) |  |  |
| 11 | ChineseName | nvarchar(128) |  |  |
| 12 | KoreanName | nvarchar(128) |  |  |
| 13 | CategoryKind | int |  |  |
| 14 | AllowKeepDetail | bit |  |  |
| 15 | IsShow | bit |  |  |

## MappingDictionaryExternal

Rows: 0 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | MappingDictonaryExternalID | uniqueidentifier | NN |  |
| 2 | DictionaryExternalCode | nvarchar(50) |  |  |
| 3 | DictionaryExternalID | uniqueidentifier |  |  |
| 4 | DictionarySMECode | nvarchar(50) |  |  |
| 5 | DictionaryType | int |  |  |
| 6 | DomainExternal | nvarchar(MAX) |  |  |
| 7 | TypeConnectExternal | int |  |  |
| 8 | IsDeleted | bit |  |  |

## MappingEBObject

Rows: 0 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | MappingID | uniqueidentifier | PK NN |  |
| 2 | ObjectMapping | uniqueidentifier | NN |  |
| 3 | ValueMapping | nvarchar(500) | NN |  |

## MappingEinvoiceObject

Rows: 0 | Columns: 5

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | MappingID | uniqueidentifier | PK NN |  |
| 2 | VendorCompanyTaxCode | nvarchar(100) |  |  |
| 3 | TypeMapping | int |  |  |
| 4 | ObjectMapping | uniqueidentifier |  |  |
| 5 | ValueMapping | nvarchar(500) |  |  |

## MappingInbotObject

Rows: 0 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | MappingID | int | PK NN ID |  |
| 2 | TableName | nvarchar(150) | NN |  |
| 3 | ColumnName | nvarchar(150) | NN |  |
| 4 | ValueMapping | nvarchar(255) | NN |  |
| 5 | ObjectMapping | uniqueidentifier | NN |  |
| 6 | SortOrder | int | NN |  |
| 7 | IsAutoMapping | bit |  |  |
| 8 | UserMapping | nvarchar(50) |  |  |
| 9 | MachineMapping | nvarchar(128) |  |  |
| 10 | TimeMapping | datetime |  |  |

## MappingOrganizationExtend

Rows: 0 | Columns: 17

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | MappingOrganizationExtendID | uniqueidentifier | PK NN |  |
| 2 | BranchIDExtend | uniqueidentifier |  |  |
| 3 | BranchCodeExtend | nvarchar(100) |  |  |
| 4 | BranchNameExtend | nvarchar(255) |  |  |
| 5 | OrganizationUnitID | uniqueidentifier |  |  |
| 6 | ExtendTitle | int |  |  |
| 7 | CreatedBy | nvarchar(50) |  |  |
| 8 | CreatedDate | datetime |  |  |
| 9 | ModifiedBy | nvarchar(50) |  |  |
| 10 | ModifiedDate | datetime |  |  |
| 11 | CompanyDomainURLExtend | nvarchar(MAX) |  |  |
| 12 | BranchID | uniqueidentifier |  |  |
| 13 | SessionID | uniqueidentifier |  |  |
| 14 | IsInventorySeperate | bit |  |  |
| 15 | ExternalCategorySeperate | nvarchar(MAX) |  |  |
| 16 | IsNotExistBankAccountNumber | bit |  |  |
| 17 | BranchIDConfig | nvarchar(MAX) |  |  |

## MappingSAEinvoiceObject

Rows: 0 | Columns: 5

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | MappingID | uniqueidentifier | PK NN |  |
| 2 | CompanyTaxCode | nvarchar(100) |  |  |
| 3 | ValueMapping | nvarchar(255) |  |  |
| 4 | ObjectMapping | uniqueidentifier |  |  |
| 5 | TypeMapping | int |  |  |

## MappingSAObject

Rows: 0 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | MappingID | int | PK NN ID |  |
| 2 | TableName | nvarchar(150) | NN |  |
| 3 | ColumnName | nvarchar(150) | NN |  |
| 4 | ValueMapping | nvarchar(500) |  |  |
| 5 | ObjectMapping | uniqueidentifier | NN |  |
| 6 | SortOrder | int | NN |  |
| 7 | IsAutoMapping | bit |  |  |
| 8 | UserMapping | nvarchar(50) |  |  |
| 9 | MachineMapping | nvarchar(128) |  |  |
| 10 | TimeMapping | datetime |  |  |

## MappingTaxFreeTypeName

Rows: 8 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | Code | nvarchar(50) |  |  |
| 2 | CutName | nvarchar(500) |  |  |
| 3 | FullName | nvarchar(MAX) |  |  |
| 4 | Type | int |  |  |

## Notification

Rows: 0 | Columns: 23

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | NotificationID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier |  |  |
| 3 | RefNo | nvarchar(50) |  |  |
| 4 | RefType | int |  |  |
| 5 | UserName | nvarchar(50) |  |  |
| 6 | RefDate | datetime |  |  |
| 7 | Description | nvarchar(MAX) |  |  |
| 8 | NotificationType | int |  |  |
| 9 | BranchID | uniqueidentifier |  |  |
| 10 | DisplayOnBook | int |  |  |
| 11 | UserHasVisited | nvarchar(MAX) |  |  |
| 12 | NotificationIsmacID | nvarchar(50) |  |  |
| 13 | Title | nvarchar(255) |  |  |
| 14 | SubContent | nvarchar(MAX) |  |  |
| 15 | ThumbnailsImage | nvarchar(MAX) |  |  |
| 16 | SubNotificationType | int |  |  |
| 23 | Height | int |  |  |
| 24 | Group | int |  |  |
| 25 | SubGroup | nvarchar(50) |  |  |
| 26 | Link | nvarchar(255) |  |  |
| 27 | LinkText | nvarchar(255) |  |  |
| 28 | Reference | nvarchar(50) |  |  |
| 29 | MaxRefDate | datetime |  |  |

## NotificationInbot

Rows: 0 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | NotificationInbotID | uniqueidentifier | PK NN |  |
| 2 | NotificationDate | datetime | NN |  |
| 3 | Description | nvarchar(MAX) |  |  |
| 4 | NotificationType | int | NN |  |
| 5 | UserHasVisited | nvarchar(MAX) |  |  |
| 6 | Title | nvarchar(255) |  |  |
| 7 | SubContent | nvarchar(255) |  |  |

## NotificationKey

Rows: 0 | Columns: 24

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SessionKey | uniqueidentifier | NN |  |
| 2 | NotificationID | uniqueidentifier | NN |  |
| 3 | RefID | uniqueidentifier |  |  |
| 4 | RefNo | nvarchar(50) |  |  |
| 5 | RefType | int |  |  |
| 6 | UserName | nvarchar(50) |  |  |
| 7 | RefDate | datetime |  |  |
| 8 | Description | nvarchar(MAX) |  |  |
| 9 | NotificationType | int |  |  |
| 10 | BranchID | uniqueidentifier |  |  |
| 11 | DisplayOnBook | int |  |  |
| 12 | UserHasVisited | nvarchar(MAX) |  |  |
| 13 | NotificationIsmacID | nvarchar(50) |  |  |
| 14 | Title | nvarchar(255) |  |  |
| 15 | SubContent | nvarchar(MAX) |  |  |
| 16 | ThumbnailsImage | nvarchar(MAX) |  |  |
| 17 | SubNotificationType | int |  |  |
| 24 | Height | int |  |  |
| 25 | Group | int |  |  |
| 26 | SubGroup | nvarchar(50) |  |  |
| 27 | Link | nvarchar(255) |  |  |
| 28 | LinkText | nvarchar(255) |  |  |
| 29 | Reference | nvarchar(50) |  |  |
| 30 | MaxRefDate | datetime |  |  |

## NotificationRemind

Rows: 8 | Columns: 14

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | NotificationID | uniqueidentifier | PK NN |  |
| 2 | UserID | uniqueidentifier |  |  |
| 3 | ListRefType | nvarchar(MAX) |  |  |
| 4 | IsVoucher | int |  |  |
| 5 | RemindType | int |  |  |
| 6 | SubContent | nvarchar(MAX) |  |  |
| 7 | ListParam | nvarchar(MAX) |  |  |
| 8 | IsExecute | bit |  |  |
| 9 | RemindDate | datetime |  |  |
| 10 | SortOrder | bigint | NN ID |  |
| 11 | BranchID | uniqueidentifier |  |  |
| 12 | SubContentENG | nvarchar(MAX) |  |  |
| 13 | SubContentZHC | nvarchar(MAX) |  |  |
| 14 | SubContentKOR | nvarchar(MAX) |  |  |

## SSBussiness

Rows: 1,020 | Columns: 16

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SSBussinessID | uniqueidentifier | PK NN |  |
| 2 | DisplaySearch | nvarchar(500) |  |  |
| 3 | Type | int | NN |  |
| 4 | Path | nvarchar(MAX) |  |  |
| 5 | RefType | int |  |  |
| 6 | DictionaryType | int |  |  |
| 7 | Action | int |  |  |
| 8 | ToolbarKey | nvarchar(255) |  |  |
| 9 | ActiveTabKey | nvarchar(255) |  |  |
| 10 | IsDBOpen | bit |  |  |
| 11 | ActiveControlConfig | nvarchar(255) |  |  |
| 12 | UnsignDisplaySearch | nvarchar(500) |  |  |
| 13 | ReportID | nvarchar(100) |  |  |
| 14 | IsAccountSystem48 | bit |  |  |
| 15 | ModifiedDate | datetime |  |  |
| 16 | OnlyShowHelp | bit |  |  |

## SSBussinessDetail

Rows: 11,297 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SSBussinessDetailID | uniqueidentifier | PK NN |  |
| 2 | SSBussinessID | uniqueidentifier | NN | SSBussiness.SSBussinessID |
| 3 | SSKeywordID | uniqueidentifier | NN | SSKeyword.SSKeywordID |

## SSBussinessUserActived

Rows: 36,720 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SSBussinessUserActivedID | uniqueidentifier | PK NN |  |
| 2 | SSBussinessID | uniqueidentifier | NN |  |
| 3 | UserID | uniqueidentifier | NN |  |
| 4 | CreatedDate | datetime |  |  |

## SSKeyword

Rows: 5,844 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SSKeywordID | uniqueidentifier | PK NN |  |
| 2 | Value | nvarchar(500) |  |  |
| 3 | UnsignValue | nvarchar(500) |  |  |
| 4 | ModifiedDate | datetime |  |  |

## SSLastedAction

Rows: 1 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SSLastedActionID | uniqueidentifier | PK NN |  |
| 2 | SSBussinessID | uniqueidentifier |  |  |
| 3 | Time | datetime |  |  |
| 4 | UserID | uniqueidentifier |  |  |

## TrackingEvent

Rows: 0 | Columns: 5

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | EventID | int | PK NN |  |
| 2 | Reference | nvarchar(MAX) |  |  |
| 3 | UserID | uniqueidentifier | PK NN |  |
| 4 | EventCount | int |  |  |
| 5 | ModifiedDate | datetime |  |  |

## TrackingPrintBADeposit

Rows: 0 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | ReportID | varchar(100) | PK NN |  |
| 3 | BranchID | uniqueidentifier |  |  |
| 4 | PrintedTime | int |  |  |
| 5 | FirstPrintedDate | datetime |  |  |
| 6 | FirstPrintedUser | nvarchar(128) |  |  |
| 7 | LastPrintedDate | datetime |  |  |
| 8 | LastPrintedUser | nvarchar(128) |  |  |

## TrackingPrintBAPaymentOrder

Rows: 0 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | ReportID | varchar(100) | PK NN |  |
| 3 | BranchID | uniqueidentifier |  |  |
| 4 | PrintedTime | int |  |  |
| 5 | FirstPrintedDate | datetime |  |  |
| 6 | FirstPrintedUser | nvarchar(128) |  |  |
| 7 | LastPrintedDate | datetime |  |  |
| 8 | LastPrintedUser | nvarchar(128) |  |  |

## TrackingPrintCAPayment

Rows: 0 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | ReportID | varchar(100) | PK NN |  |
| 3 | BranchID | uniqueidentifier |  |  |
| 4 | PrintedTime | int |  |  |
| 5 | FirstPrintedDate | datetime |  |  |
| 6 | FirstPrintedUser | nvarchar(128) |  |  |
| 7 | LastPrintedDate | datetime |  |  |
| 8 | LastPrintedUser | nvarchar(128) |  |  |

## TrackingPrintCAReceipt

Rows: 0 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | ReportID | varchar(100) | PK NN |  |
| 3 | BranchID | uniqueidentifier |  |  |
| 4 | PrintedTime | int |  |  |
| 5 | FirstPrintedDate | datetime |  |  |
| 6 | FirstPrintedUser | nvarchar(128) |  |  |
| 7 | LastPrintedDate | datetime |  |  |
| 8 | LastPrintedUser | nvarchar(128) |  |  |

## TrackingPrintINOutward

Rows: 0 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | ReportID | varchar(100) | PK NN |  |
| 3 | BranchID | uniqueidentifier |  |  |
| 4 | PrintedTime | int |  |  |
| 5 | FirstPrintedDate | datetime |  |  |
| 6 | FirstPrintedUser | nvarchar(128) |  |  |
| 7 | LastPrintedDate | datetime |  |  |
| 8 | LastPrintedUser | nvarchar(128) |  |  |

## TrackingPrintInvoice

Rows: 0 | Columns: 12

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | InvTypeID | int | PK NN |  |
| 3 | InvNo | nvarchar(25) |  |  |
| 4 | InvTemplateNo | nvarchar(25) |  |  |
| 5 | InvSeries | nvarchar(20) |  |  |
| 6 | BranchID | uniqueidentifier |  |  |
| 7 | PrintedTime | int |  |  |
| 8 | FirstPrintedDate | datetime |  |  |
| 9 | FirstPrintedUser | nvarchar(128) |  |  |
| 10 | LastPrintedDate | datetime |  |  |
| 11 | LastPrintedUser | nvarchar(128) |  |  |
| 12 | InvDate | datetime |  |  |

## TrackingPrintVoucherAccounting

Rows: 0 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | ReportID | varchar(100) | PK NN |  |
| 3 | RefNoFinance | nvarchar(50) |  |  |
| 4 | RefNoManagement | nvarchar(50) |  |  |
| 5 | BranchID | uniqueidentifier |  |  |
| 6 | PrintedTime | int |  |  |
| 7 | FirstPrintedDate | datetime |  |  |
| 8 | FirstPrintedUser | nvarchar(128) |  |  |
| 9 | LastPrintedDate | datetime |  |  |
| 10 | LastPrintedUser | nvarchar(128) |  |  |

# 99 — Khác (chưa phân loại)

## AgreementInfo

Rows: 0 | Columns: 11

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | AgreementInfoID | uniqueidentifier | PK NN |  |
| 2 | ConfirmedVersion | int |  |  |
| 5 | CompanyTaxCode | nvarchar(50) |  |  |
| 6 | ConfirmedName | nvarchar(128) |  |  |
| 7 | ConfirmedDate | datetime |  |  |
| 13 | IsShowConfirmAgreement | bit |  |  |
| 14 | DateShow | datetime |  |  |
| 15 | VersionShow | int |  |  |
| 16 | LicenseType | int |  |  |
| 17 | ProductCode | nvarchar(20) |  |  |
| 18 | ApplicationCode | nvarchar(20) |  |  |

## AgreementLastestInfo

Rows: 0 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ApplicationCode | nvarchar(50) | NN |  |
| 2 | Version | int |  |  |
| 3 | CheckUpdateDate | datetime |  |  |
| 4 | PublishDate | datetime |  |  |
| 5 | AttachmentContent | nvarchar(MAX) |  |  |
| 6 | ModifiedContent | nvarchar(MAX) |  |  |
| 7 | AgreementID | uniqueidentifier | PK NN |  |
| 8 | AgreementLanguage | nvarchar(5) | NN |  |
| 9 | LicenseType | int |  |  |

## AutoBusiness

Rows: 79 | Columns: 13

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | AutoBusinessID | uniqueidentifier | PK NN |  |
| 2 | AutoBusinessName | nvarchar(255) | NN |  |
| 3 | VoucherType | int | NN |  |
| 4 | DebitAccount | nvarchar(20) |  | Account.AccountNumber |
| 5 | CreditAccount | nvarchar(20) |  | Account.AccountNumber |
| 6 | Description | nvarchar(255) |  |  |
| 7 | Inactive | bit | NN |  |
| 8 | CreatedDate | datetime |  |  |
| 9 | CreatedBy | nvarchar(50) |  |  |
| 10 | ModifiedDate | datetime |  |  |
| 11 | ModifiedBy | nvarchar(50) |  |  |
| 12 | AutoBusinessNameEnglish | nvarchar(255) |  |  |
| 13 | AutoBusinessNameChinese | nvarchar(255) |  |  |

## CacheMatch_InventoryItem

Rows: 1 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | CacheID | uniqueidentifier | PK NN |  |
| 2 | InventoryItemID | uniqueidentifier | NN |  |
| 3 | Suggest | nvarchar(500) |  |  |

## CareerHightest

Rows: 89 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | CareerHightestID | uniqueidentifier | PK NN |  |
| 2 | CareerHightestCode | nvarchar(10) | NN |  |
| 3 | CareerHightestName | nvarchar(255) | NN |  |
| 4 | ParentID | uniqueidentifier |  |  |
| 5 | MISACodeID | nvarchar(100) |  |  |
| 6 | IsParent | bit | NN |  |
| 7 | Grade | int | NN |  |

## CertificateInfo

Rows: 0 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | CertificateInfoID | uniqueidentifier | PK NN |  |
| 2 | CompanyTaxCode | nvarchar(50) | NN |  |
| 3 | CertSerialNumber | nvarchar(255) | NN |  |
| 4 | CheckTime | datetime | NN |  |
| 5 | StatusCode | int | NN |  |
| 6 | StatusDescription | nvarchar(255) | NN |  |
| 7 | Provider | nvarchar(255) | NN |  |
| 8 | RevocationTime | datetime |  |  |
| 9 | RevocationReason | nvarchar(255) |  |  |

## ChangeMobile

Rows: 0 | Columns: 18

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | KeyID | int | PK NN ID |  |
| 2 | ObjectID | uniqueidentifier | NN |  |
| 3 | ObjectType | nvarchar(255) |  |  |
| 4 | OldTel | nvarchar(255) |  |  |
| 5 | NewTel | nvarchar(255) |  |  |
| 6 | OldMobile | nvarchar(255) |  |  |
| 7 | NewMobile | nvarchar(255) |  |  |
| 8 | OldContactMobile | nvarchar(255) |  |  |
| 9 | NewContactMobile | nvarchar(255) |  |  |
| 10 | OldOtherContactMobile | nvarchar(255) |  |  |
| 11 | NewOtherContactMobile | nvarchar(255) |  |  |
| 12 | OldContactFixedTel | nvarchar(255) |  |  |
| 13 | NewContactFixedTel | nvarchar(255) |  |  |
| 14 | OldEInvoiceContactMobile | nvarchar(255) |  |  |
| 15 | NewEInvoiceContactMobile | nvarchar(255) |  |  |
| 16 | OldContactOfficeTel | nvarchar(255) |  |  |
| 17 | NewContactOfficeTel | nvarchar(255) |  |  |
| 18 | NotificationID | nvarchar(255) |  |  |

## CheckShowLicenseLastest

Rows: 0 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | CheckShowLicenseLastestID | uniqueidentifier | NN |  |
| 2 | DatabaseID | nvarchar(50) |  |  |
| 3 | LicenseNo | nvarchar(50) |  |  |
| 4 | Showtime | int |  |  |

## CompanySearch

Rows: 0 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | CompanyTaxCode | nvarchar(50) | PK NN |  |
| 2 | CompanyStatus | nvarchar(255) |  |  |
| 3 | CompanyStatusTime | datetime |  |  |
| 4 | IsShow | bit |  |  |
| 5 | RefID | uniqueidentifier |  |  |
| 6 | RefType | int |  |  |
| 7 | UserID | uniqueidentifier |  |  |

## CustomerProfileData

Rows: 1 | Columns: 2

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | CertExpirationDate | datetime |  |  |
| 2 | SignSupplier | nvarchar(255) |  |  |

## CustomerProfileSyncTime

Rows: 1 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | LastDaySyncTime | datetime |  |  |
| 2 | LastMonthSyncTime | datetime |  |  |
| 3 | LastQuaterSyncTime | datetime |  |  |
| 4 | LastYearSyncTime | datetime |  |  |

## DictionaryMobile

Rows: 7 | Columns: 2

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | TableName | nvarchar(150) |  |  |
| 2 | ColumnName | nvarchar(MAX) |  |  |

## DocumentManager

Rows: 67 | Columns: 19

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | DocumentID | uniqueidentifier | PK NN |  |
| 2 | DocumentName | nvarchar(255) | NN |  |
| 3 | FolderID | uniqueidentifier |  |  |
| 4 | Author | nvarchar(100) |  |  |
| 5 | InternalUseOnly | bit |  |  |
| 6 | Description | nvarchar(MAX) |  |  |
| 7 | Keywords | nvarchar(100) |  |  |
| 8 | Path | nvarchar(255) |  |  |
| 9 | FileSize | float |  |  |
| 10 | AttachmentFile | varbinary |  |  |
| 11 | FileExtension | nvarchar(25) |  |  |
| 12 | IsFolder | bit |  |  |
| 13 | CreatedDate | datetime |  |  |
| 14 | ModifiedDate | datetime |  |  |
| 15 | CreatedBy | nvarchar(100) |  |  |
| 16 | ModifiedBy | nvarchar(100) |  |  |
| 17 | IsRoot | bit | NN |  |
| 18 | FileIconType | nchar(10) |  |  |
| 19 | FileName | nvarchar(255) |  |  |

## ESignStatus

Rows: 0 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefID | uniqueidentifier | PK NN |  |
| 2 | Status | int |  |  |
| 3 | ModifiedBy | nvarchar(50) |  |  |
| 4 | ModifiedDate | datetime |  |  |

## ExplorebarVisible

Rows: 405 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | KeyGroup | nvarchar(50) | PK NN |  |
| 2 | Visible | bit | NN |  |
| 3 | OrderNumber | int | NN |  |
| 4 | UserID | uniqueidentifier | PK NN |  |

## ExternalDataChanged

Rows: 0 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | TableName | nvarchar(150) | PK NN |  |
| 2 | ObjectID | nvarchar(50) | PK NN |  |
| 3 | SyncStatus | int | NN |  |

## FileAttachment

Rows: 0 | Columns: 17

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | AttachmentID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier |  |  |
| 3 | FileName | nvarchar(255) | NN |  |
| 4 | FileSize | int |  |  |
| 5 | FileExtension | nvarchar(25) |  |  |
| 6 | FileMIMEType | nvarchar(100) |  |  |
| 7 | FileContent | varbinary |  |  |
| 8 | DocumentName | nvarchar(255) |  |  |
| 9 | Description | nvarchar(255) |  |  |
| 10 | SortOrder | int |  |  |
| 11 | EditVersion | timestamp |  |  |
| 12 | ModifiedBy | nvarchar(50) |  |  |
| 13 | CreatedDate | datetime |  |  |
| 14 | CreatedBy | nvarchar(50) |  |  |
| 15 | ModifiedDate | datetime |  |  |
| 16 | LinkType | int | NN |  |
| 17 | LinkAddress | nvarchar(MAX) |  |  |

## FormListParameter

Rows: 116 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | FormListParameterID | uniqueidentifier | PK NN |  |
| 2 | UserID | uniqueidentifier |  |  |
| 3 | FormName | nvarchar(50) |  |  |
| 4 | ParameterValue | nvarchar(MAX) |  |  |

## HelpBalancingGuideLastedDate

Rows: 0 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | HelpBalancingGuideLastedDateID | uniqueidentifier | PK NN |  |
| 2 | UserID | uniqueidentifier |  |  |
| 3 | BranchID | uniqueidentifier |  |  |
| 4 | FromDate | datetime |  |  |
| 5 | ToDate | datetime |  |  |
| 6 | FunctionName | nvarchar(150) |  |  |
| 7 | LastedDate | datetime |  |  |

## HelthCompany

Rows: 25 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ItemID | nvarchar(255) |  |  |
| 2 | ItemName | nvarchar(255) |  |  |
| 3 | Meaningful | nvarchar(MAX) |  |  |
| 4 | EvaluationGuide | nvarchar(MAX) |  |  |

## HistoryRecentPrice

Rows: 0 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | HistoryRecentPriceID | uniqueidentifier | PK NN |  |
| 2 | InventoryItemID | uniqueidentifier | NN |  |
| 3 | AccountingObjectID | uniqueidentifier | NN |  |
| 4 | UnitID | uniqueidentifier |  |  |
| 5 | UnitPrice | decimal(18,4) | NN |  |
| 7 | BranchID | uniqueidentifier |  |  |
| 8 | IsUnitPriceAfterTax | bit | NN |  |

## InbotTrialInfo

Rows: 0 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SessionId | nvarchar(125) |  |  |
| 2 | UsedQuantity | int |  |  |
| 3 | UsingLimit | int |  |  |

## InbotTrialProcess

Rows: 0 | Columns: 7

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ProcessId | nvarchar(50) | PK NN |  |
| 2 | InvoiceId | nvarchar(50) |  |  |
| 3 | UserID | uniqueidentifier |  |  |
| 4 | CompanyTaxCode | nvarchar(25) |  |  |
| 5 | SessionId | nvarchar(125) |  |  |
| 6 | State | int |  |  |
| 7 | Time | datetime |  |  |

## InternalMappingObject

Rows: 0 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | DetailID | uniqueidentifier | PK NN |  |
| 2 | AccountObjectID | uniqueidentifier |  |  |
| 3 | AccountObjectCode | nvarchar(50) |  |  |
| 4 | AccountObjectName | nvarchar(400) |  |  |
| 5 | OrganizationUnitID | uniqueidentifier |  |  |
| 6 | OrganizationUnitCode | nvarchar(25) |  |  |
| 7 | OrganizationUnitName | nvarchar(255) |  |  |
| 8 | ModifiedDate | datetime |  |  |

## InventoryLogAction

Rows: 0 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ID_LOG | uniqueidentifier | PK NN |  |
| 2 | LogContent | nvarchar(500) |  |  |
| 3 | DateLog | datetime |  |  |

## InventoryQuantityFormulaTemplate

Rows: 6 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | FormulaID | int | PK NN |  |
| 2 | FormulaName | nvarchar(128) |  |  |
| 3 | Formula | nvarchar(MAX) |  |  |
| 4 | SortOrder | int |  |  |

## LogOldOpeningInventoryEntry

Rows: 0 | Columns: 10

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | EventID | uniqueidentifier |  |  |
| 2 | BranchID | uniqueidentifier |  |  |
| 3 | IsPostedFinance | bit |  |  |
| 4 | IsPostedManagement | bit |  |  |
| 5 | InventoryItemID | uniqueidentifier |  |  |
| 6 | StockID | uniqueidentifier |  |  |
| 7 | UnitID | uniqueidentifier |  |  |
| 8 | Quantity | decimal(22,8) |  |  |
| 9 | UnitPrice | decimal(20,6) |  |  |
| 10 | ModifiedDate | datetime |  |  |

## ManageSize

Rows: 149,962 | Columns: 15

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ManageSizeID | uniqueidentifier | PK NN |  |
| 2 | RefID | uniqueidentifier | NN |  |
| 3 | RefDetailID | uniqueidentifier | NN |  |
| 4 | RefType | int | NN |  |
| 5 | BranchID | uniqueidentifier |  |  |
| 6 | InventoryItemID | uniqueidentifier | NN |  |
| 7 | PanelLengthQuantity | decimal(22,8) | NN |  |
| 8 | PanelWidthQuantity | decimal(22,8) | NN |  |
| 9 | PanelHeightQuantity | decimal(22,8) | NN |  |
| 10 | PanelRadiusQuantity | decimal(22,8) | NN |  |
| 11 | PanelQuantity | decimal(22,8) | NN |  |
| 12 | Quantity | decimal(22,8) |  |  |
| 13 | StockID | uniqueidentifier |  |  |
| 14 | InwardPanelQuantity | decimal(22,8) | NN |  |
| 15 | OutwardPanelQuantity | decimal(22,8) | NN |  |

## MonitorCount

Rows: 1 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | AppEventCode | nvarchar(50) |  |  |
| 2 | HitCount | int |  |  |
| 3 | UserID | uniqueidentifier |  |  |

## PreviousVersion

Rows: 0 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | Version | nvarchar(50) |  |  |
| 2 | MVC | nvarchar(50) |  |  |
| 3 | SubVersion | nvarchar(50) |  |  |

## Relationship

Rows: 13 | Columns: 11

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RelationshipID | uniqueidentifier | PK NN |  |
| 2 | RelationshipName | nvarchar(255) | NN |  |
| 3 | IsSystem | bit | NN |  |
| 4 | Description | nvarchar(255) |  |  |
| 5 | CreatedBy | nvarchar(100) |  |  |
| 6 | CreatedDate | datetime |  |  |
| 7 | ModifiedBy | nvarchar(100) |  |  |
| 8 | ModifiedDate | datetime |  |  |
| 9 | DictionaryKey | int |  |  |
| 10 | SortOrder | int | NN |  |
| 11 | GroupID | int |  |  |

## ScheduleAppointment

Rows: 0 | Columns: 16

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | AppointmentID | uniqueidentifier | PK NN |  |
| 2 | Subject | nvarchar(255) | NN |  |
| 3 | Description | nvarchar(MAX) |  |  |
| 4 | StartDate | datetime |  |  |
| 5 | EndDate | datetime |  |  |
| 6 | AllDayEvent | bit |  |  |
| 7 | IsReminder | bit |  |  |
| 8 | ReminderBeforeStart | int |  |  |
| 9 | ReminderSoundFile | varbinary |  |  |
| 10 | OwnerID | uniqueidentifier |  |  |
| 11 | CreatedDate | datetime |  |  |
| 12 | ModifiedDate | datetime |  |  |
| 13 | AllOtherProperties | varbinary |  |  |
| 14 | Location | nvarchar(255) |  |  |
| 15 | OwnerLoginName | nvarchar(250) |  |  |
| 16 | IsRemindAllUser | bit | NN |  |

## ScheduleTask

Rows: 0 | Columns: 22

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | TaskID | uniqueidentifier | PK NN |  |
| 2 | Subject | nvarchar(255) | NN |  |
| 3 | Description | nvarchar(MAX) |  |  |
| 4 | StartDate | datetime |  |  |
| 5 | DueDate | datetime |  |  |
| 6 | TaskPriorityID | int |  |  |
| 7 | TaskStatusID | int |  |  |
| 8 | TaskTypeID | int |  |  |
| 9 | IsReminder | bit |  |  |
| 10 | ReminderSoundFile | varbinary |  |  |
| 11 | CompletedPercent | int |  |  |
| 12 | CompletedDate | datetime |  |  |
| 13 | OwnerID | uniqueidentifier |  |  |
| 14 | OwnerLoginName | nvarchar(250) |  |  |
| 15 | CreatedDate | datetime |  |  |
| 16 | ModifiedDate | datetime |  |  |
| 17 | AllOtherProperties | varbinary |  |  |
| 18 | ReminderDate | datetime |  |  |
| 19 | IsRemindAllUser | bit | NN |  |
| 20 | RepeatType | int | NN |  |
| 21 | ParentTaskID | uniqueidentifier |  |  |
| 22 | ExpiredRepeatDate | datetime |  |  |

## SearchConfig

Rows: 0 | Columns: 68

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | SearchResultConfigID | uniqueidentifier | PK NN |  |
| 2 | MasterTableName | nvarchar(100) |  |  |
| 3 | DetailTableName | nvarchar(100) |  |  |
| 4 | DetailTableName1 | nvarchar(100) |  |  |
| 5 | FilterCondition | nvarchar(500) |  |  |
| 6 | RefID | nvarchar(500) |  |  |
| 7 | RefType | nvarchar(500) |  |  |
| 8 | RefNoFinance | nvarchar(500) |  |  |
| 9 | RefNoManagement | nvarchar(500) |  |  |
| 10 | CABARefNoFinance | nvarchar(500) |  |  |
| 11 | CABARefNoManagement | nvarchar(500) |  |  |
| 12 | RefDate | nvarchar(500) |  |  |
| 13 | PostedDate | nvarchar(500) |  |  |
| 14 | InvNo | nvarchar(500) |  |  |
| 15 | InvDate | nvarchar(500) |  |  |
| 16 | CurrencyID | nvarchar(500) |  |  |
| 17 | TotalAmountOCFinance | nvarchar(500) |  |  |
| 18 | TotalAmountOCManagement | nvarchar(500) |  |  |
| 19 | TotalAmountFinance | nvarchar(500) |  |  |
| 20 | TotalAmountManagement | nvarchar(500) |  |  |
| 21 | DebitAccount | nvarchar(500) |  |  |
| 22 | CreditAccount | nvarchar(500) |  |  |
| 23 | InventoryItemID | nvarchar(500) |  |  |
| 24 | INStockID | nvarchar(500) |  |  |
| 25 | OutStockID | nvarchar(500) |  |  |
| 26 | Quantity | nvarchar(500) |  |  |
| 27 | UnitPriceFinance | nvarchar(500) |  |  |
| 28 | UnitPriceManagement | nvarchar(500) |  |  |
| 29 | AmountOCFinance | nvarchar(500) |  |  |
| 30 | AmountOCManagement | nvarchar(500) |  |  |
| 31 | AmountFinance | nvarchar(500) |  |  |
| 32 | AmountManagement | nvarchar(500) |  |  |
| 33 | DiscountRate | nvarchar(500) |  |  |
| 34 | DiscountAmount | nvarchar(500) |  |  |
| 35 | DiscountAmountOC | nvarchar(500) |  |  |
| 36 | FixedAssetID | nvarchar(500) |  |  |
| 37 | SupplyID | nvarchar(500) |  |  |
| 38 | DebitAccountObjectID | nvarchar(500) |  |  |
| 39 | CreditAccountObjectID | nvarchar(500) |  |  |
| 40 | OrganizationUnitID | nvarchar(500) |  |  |
| 41 | EmployeeID | nvarchar(500) |  |  |
| 42 | ExpenseItemID | nvarchar(500) |  |  |
| 43 | ProjectWorkID | nvarchar(500) |  |  |
| 44 | JobID | nvarchar(500) |  |  |
| 45 | PurchasePurposeID | nvarchar(500) |  |  |
| 46 | UnitID | nvarchar(500) |  |  |
| 47 | OrderID | nvarchar(500) |  |  |
| 48 | PUOrderRefID | nvarchar(500) |  |  |
| 49 | ContractID | nvarchar(500) |  |  |
| 50 | PUContractID | nvarchar(500) |  |  |
| 51 | ListItemID | nvarchar(500) |  |  |
| 52 | Description | nvarchar(500) |  |  |
| 53 | IsPostedFinance | nvarchar(500) |  |  |
| 54 | IsPostedManagement | nvarchar(500) |  |  |
| 55 | DisplayOnBook | nvarchar(500) |  |  |
| 56 | BranchID | nvarchar(500) |  |  |
| 57 | SortOrder | int | NN |  |
| 58 | SearchType | int |  |  |
| 59 | DetailInventoryItemID | nvarchar(500) |  |  |
| 60 | DetailUnitID | nvarchar(500) |  |  |
| 61 | DetailJobID | nvarchar(500) |  |  |
| 62 | DetailOrganizationUnitID | nvarchar(500) |  |  |
| 63 | DetailExpenseItemID | nvarchar(500) |  |  |
| 64 | DetailContractID | nvarchar(500) |  |  |
| 65 | BankAccountID | nvarchar(500) |  |  |
| 66 | MasterAccountObjectID | nvarchar(500) |  |  |
| 67 | DetailDescription | nvarchar(500) |  |  |
| 68 | InvestmentProjectID | uniqueidentifier |  |  |

## SearchField

Rows: 38 | Columns: 12

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | FieldName | nvarchar(128) | PK NN |  |
| 2 | Description | nvarchar(128) |  |  |
| 3 | FieldType | int |  |  |
| 4 | Command | nvarchar(4000) |  |  |
| 5 | CommandType | int |  |  |
| 6 | SortOrder | int |  |  |
| 7 | DefaultOperator | nvarchar(8) |  |  |
| 8 | Comment | nvarchar(128) |  |  |
| 9 | TableName | nvarchar(128) |  |  |
| 10 | DictionaryType | nvarchar(128) |  |  |
| 11 | ColumnLayout | nvarchar(128) |  |  |
| 12 | ShowLayout | bit | NN |  |

## SearchRefType

Rows: 60 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | RefType | nvarchar(255) | PK NN |  |
| 2 | RefTypeName | nvarchar(100) |  |  |
| 3 | SortOrder | int |  |  |

## SendEmailHistory

Rows: 0 | Columns: 17

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | HistoryID | uniqueidentifier | PK NN |  |
| 2 | SendStatus | int | NN |  |
| 3 | SendTime | datetime | NN |  |
| 4 | ReceiverName | nvarchar(255) |  |  |
| 5 | ReceiverEmail | nvarchar(255) |  |  |
| 6 | SenderName | nvarchar(255) |  |  |
| 7 | SenderEmail | nvarchar(255) |  |  |
| 8 | EmailSubject | nvarchar(1000) |  |  |
| 9 | Type | int |  |  |
| 10 | EmailTemplate | nvarchar(255) |  |  |
| 11 | TempContent | nvarchar(MAX) |  |  |
| 12 | UserID | uniqueidentifier |  |  |
| 13 | BranchID | uniqueidentifier |  |  |
| 14 | SendType | int |  |  |
| 15 | EmailName | nvarchar(255) |  |  |
| 16 | VoucherNo | nvarchar(100) |  |  |
| 17 | SubSystemCode | nvarchar(255) |  |  |

## SignInfo

Rows: 1 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | BranchID | uniqueidentifier | PK NN |  |
| 2 | IsDependent | bit |  |  |
| 3 | SignSetting | int |  |  |
| 4 | SignServer | nvarchar(255) |  |  |

## SubSystemSelfStudy

Rows: 5 | Columns: 5

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ID | uniqueidentifier | PK NN |  |
| 2 | SubSystemCode | nvarchar(50) |  |  |
| 3 | SubSystemName | nvarchar(MAX) |  |  |
| 4 | SortOrder | int |  |  |
| 5 | Description | nvarchar(MAX) |  |  |

## SyncDownLoadTime

Rows: 0 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | CompanyTaxCode | nvarchar(100) | PK NN |  |
| 2 | TableName | nvarchar(100) | PK NN |  |
| 3 | GetServerType | int | PK NN |  |
| 4 | LastSyncTime | datetime |  |  |

## TaskCreateDataSucces

Rows: 48 | Columns: 3

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ID | uniqueidentifier | PK NN |  |
| 2 | UserID | uniqueidentifier | NN | MSC_User.UserID |
| 3 | TaskID | uniqueidentifier | NN | DataCreationBusiness.ID |

## Temp

Rows: 0 | Columns: 4

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ID | int |  |  |
| 2 | Name | nvarchar(50) |  |  |
| 3 | Year | int |  |  |
| 4 | Amount1 | money |  |  |

## ThirdPartyServiceConfig

Rows: 0 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ServiceCode | nvarchar(20) | PK NN |  |
| 2 | BranchID | uniqueidentifier | PK NN |  |
| 3 | BranchType | int |  |  |
| 4 | Config | nvarchar(MAX) |  |  |
| 5 | OptionValue | nvarchar(MAX) |  |  |
| 6 | CreatedDate | datetime |  |  |
| 7 | ModifiedDate | datetime |  |  |
| 8 | PartnerCode | nvarchar(50) | PK NN |  |
| 9 | IsActive | bit | NN |  |

## TimeSheetSign

Rows: 29 | Columns: 8

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | TimeSheetSignID | uniqueidentifier | PK NN |  |
| 2 | TimeSheetSignCode | nvarchar(20) | NN |  |
| 3 | TimeSheetSignName | nvarchar(255) | NN |  |
| 4 | SalaryRate | decimal(9,4) | NN |  |
| 5 | Inactive | bit | NN |  |
| 6 | IsDefault | bit | NN |  |
| 7 | IsSystem | bit | NN |  |
| 8 | IsHalfDay | bit | NN |  |

## TrainedUserOnProvided

Rows: 0 | Columns: 1

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | UserID | uniqueidentifier | PK NN |  |

## VideoByUser

Rows: 0 | Columns: 2

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | UserID | uniqueidentifier | NN | MSC_User.UserID |
| 2 | IDVideo | uniqueidentifier | NN | VideoSelfStudy.ID |

## VideoSelfStudy

Rows: 0 | Columns: 9

| # | Column | Type | Flags | FK → |
|---|--------|------|-------|------|
| 1 | ID | uniqueidentifier | PK NN |  |
| 2 | Title | nvarchar(MAX) |  |  |
| 3 | Link | nvarchar(MAX) |  |  |
| 4 | SubSystemCode | nvarchar(50) |  |  |
| 5 | SortOrder | int |  |  |
| 6 | ModuleKey | nvarchar(500) |  |  |
| 7 | IsOverView | bit | NN |  |
| 8 | ParentID | uniqueidentifier |  |  |
| 9 | OverViewTitle | nvarchar(128) |  |  |

