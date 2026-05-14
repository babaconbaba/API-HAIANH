import { Request } from 'express';

export interface PaginationParams {
  page: number;
  pageSize: number;
  offset: number;
  sortBy: string;
  sortDir: 'ASC' | 'DESC';
}

const MAX_PAGE_SIZE = 200;

// Allowlist of safe column names for ORDER BY
const SAFE_SORT_COLUMNS = new Set([
  'RefDate', 'PostedDate', 'RefNoFinance', 'RefNoManagement', 'RefType',
  'TotalAmount', 'TotalAmountOC', 'TotalAmountFinance', 'TotalAmountManagement',
  'CreatedDate', 'ModifiedDate',
  'AccountObjectCode', 'AccountObjectName', 'CompanyTaxCode',
  'InventoryItemCode', 'InventoryItemName', 'UnitPrice',
  'AccountNumber', 'AccountName',
  'EmployeeCode', 'EmployeeName',
  'OrganizationUnitCode', 'OrganizationUnitName', 'SortMISACodeID',
  'FixedAssetCode', 'FixedAssetName', 'OrgPrice',
  'SupplyCode', 'SupplyName',
  'RefID', 'BranchID', 'Inactive',
  // Contracts & Budget
  'ContractCode', 'ContractName', 'SignDate', 'StartDate', 'EndDate', 'ContractStatus',
  'BudgetCode', 'BudgetName', 'BudgetYear',
  // Payroll
  'EmployeeID',
]);

export function parsePagination(req: Request, defaultSort = 'RefDate'): PaginationParams {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(req.query.pageSize as string) || 20));
  const offset = (page - 1) * pageSize;

  // Validate sortBy against allowlist to prevent SQL injection
  const rawSort = (req.query.sortBy as string) || defaultSort;
  const sortBy = SAFE_SORT_COLUMNS.has(rawSort) ? rawSort : defaultSort;

  const sortDir = ((req.query.sortDir as string) || 'DESC').toUpperCase() === 'ASC' ? 'ASC' as const : 'DESC' as const;

  return { page, pageSize, offset, sortBy, sortDir };
}

export function paginatedResponse(data: any[], totalCount: number, params: PaginationParams) {
  return {
    success: true,
    data,
    pagination: {
      page: params.page,
      pageSize: params.pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / params.pageSize),
    },
  };
}
