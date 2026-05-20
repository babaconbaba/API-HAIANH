import sql from 'mssql';
import { getPool } from '../config/database';

export interface QueryOptions {
  instance?: string;
  database?: string;
}

export async function query<T = any>(
  sqlText: string,
  params?: Record<string, { type: any; value: any }>,
  opts?: QueryOptions
): Promise<sql.IResult<T>> {
  const pool = await getPool(opts?.instance, opts?.database);
  const request = pool.request();
  if (params) {
    for (const [name, { type, value }] of Object.entries(params)) {
      request.input(name, type, value);
    }
  }
  return request.query(sqlText);
}

export async function execute(
  spName: string,
  params?: Record<string, { type: any; value: any }>,
  opts?: QueryOptions
): Promise<sql.IProcedureResult<any>> {
  const pool = await getPool(opts?.instance, opts?.database);
  const request = pool.request();
  if (params) {
    for (const [name, { type, value }] of Object.entries(params)) {
      request.input(name, type, value);
    }
  }
  return request.execute(spName);
}

export { sql };
