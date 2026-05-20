import sql from 'mssql';
import { env } from './env';

const pools = new Map<string, sql.ConnectionPool>();
const pendingPools = new Map<string, Promise<sql.ConnectionPool>>();

function normalizeInstance(inst: string): string {
  return inst.replace(/\\\\/g, '\\');
}

function buildConfig(instance: string, database: string, auth?: string, username?: string, password?: string): sql.config {
  const normalized = normalizeInstance(instance);
  const serverParts = normalized.split('\\');
  return {
    server: serverParts[0] || 'localhost',
    database,
    user: username || env.sql.username,
    password: password || env.sql.password,
    pool: {
      max: env.sql.poolMax,
      min: 0,
      idleTimeoutMillis: env.sql.idleTimeout,
    },
    options: {
      encrypt: false,
      trustServerCertificate: true,
      instanceName: serverParts[1],
      requestTimeout: env.sql.requestTimeout,
    },
  };
}

export async function getPool(instance?: string, database?: string, auth?: string, username?: string, password?: string): Promise<sql.ConnectionPool> {
  const inst = normalizeInstance(instance || env.sql.instance);
  const db = database || env.sql.database;
  const usr = username || env.sql.username;
  const pwd = password || env.sql.password;
  const effectiveAuth = auth || env.sql.auth;

  const key = `${inst}/${db}/sql/${usr}`;

  // Return cached pool
  const existing = pools.get(key);
  if (existing?.connected) return existing;

  // Prevent duplicate pool creation — reuse pending promise
  const pending = pendingPools.get(key);
  if (pending) return pending;

  // Create new pool with lock
  const promise = (async () => {
    try {
      const config = buildConfig(inst, db, effectiveAuth, usr, pwd);
      const newPool = new sql.ConnectionPool(config);
      await newPool.connect();
      pools.set(key, newPool);
      return newPool;
    } finally {
      pendingPools.delete(key);
    }
  })();

  pendingPools.set(key, promise);
  return promise;
}

/** getPool from Express request — auto-reads tenant headers including SQL credentials */
export async function getPoolFromReq(req: { sqlInstance?: string; sqlDatabase?: string; sqlAuth?: string; sqlUsername?: string; sqlPassword?: string }): Promise<sql.ConnectionPool> {
  return getPool(req.sqlInstance, req.sqlDatabase, req.sqlAuth, req.sqlUsername, req.sqlPassword);
}

export async function closeAll(): Promise<void> {
  for (const [key, pool] of pools) {
    await pool.close();
    pools.delete(key);
  }
}

export { sql };
