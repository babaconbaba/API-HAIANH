import sql from 'mssql/msnodesqlv8';
import { env } from './env';

const pools = new Map<string, sql.ConnectionPool>();

// Check if a string contains only ANSI-safe chars (within Windows-1252 / Latin-1 range)
function isAnsiSafe(s: string): boolean {
  for (let i = 0; i < s.length; i++) {
    if (s.charCodeAt(i) > 255) return false;
  }
  return true;
}

function buildConfig(instance: string, database: string, auth?: string, username?: string, password?: string): any {
  const authMode = auth || env.sql.auth;

  if (authMode === 'windows') {
    const server = instance.replace(/\\\\/g, '\\');
    // ODBC connection strings are ANSI — Unicode DB names (e.g. "đasad2026")
    // can't be embedded directly. Connect without DB, then USE [db] after.
    const dbPart = isAnsiSafe(database) ? `Database={${database}};` : '';
    return {
      connectionString: `Driver={ODBC Driver 17 for SQL Server};Server=${server};${dbPart}Trusted_Connection=yes;TrustServerCertificate=yes;`,
      pool: {
        max: env.sql.poolMax,
        min: 0,
        idleTimeoutMillis: env.sql.idleTimeout,
      },
      options: {
        requestTimeout: env.sql.requestTimeout,
      },
      _needsUseDb: !isAnsiSafe(database), // flag for post-connect USE [db]
    };
  }

  // SQL Authentication
  const serverParts = instance.replace(/\\\\/g, '\\').split('\\');
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
  const inst = instance || env.sql.instance;
  const db = database || env.sql.database;
  const usr = username || env.sql.username;
  const pwd = password || env.sql.password;
  const effectiveAuth = auth || env.sql.auth;

  // Cache key must include auth mode + credentials so different users
  // don't share pools. For windows auth, credentials are implicit (server identity).
  const key = effectiveAuth === 'windows'
    ? `${inst}/${db}/windows`
    : `${inst}/${db}/sql/${usr}`;

  const existing = pools.get(key);
  if (existing?.connected) return existing;

  const config = buildConfig(inst, db, effectiveAuth, usr, pwd);
  delete config._needsUseDb;

  const newPool = new sql.ConnectionPool(config);
  await newPool.connect();
  pools.set(key, newPool);
  return newPool;
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
