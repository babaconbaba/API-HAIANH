import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface AuthUser {
  userId?: string;
  username?: string;
  instance?: string;
  database?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      sqlInstance?: string;
      sqlDatabase?: string;
      sqlAuth?: string;
      sqlUsername?: string;
      sqlPassword?: string;
    }
  }
}

// Allow Unicode letters (Vietnamese DB names like "ádasd2026"), digits, dot, underscore, backslash, hyphen, space
// Block SQL injection chars: ; ' " = ( ) [ ] { } @ # $ % & * + / < > | ~ ` ! ^ ,
const UNSAFE_SQL_CHARS = /[;'"=()[\]{}@#$%&*+/<>|~`!^,]/;

function isSafeSqlName(name: string): boolean {
  return name.length > 0 && name.length <= 128 && !UNSAFE_SQL_CHARS.test(name);
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization || '';

  // API Key mode
  if (authHeader.startsWith('ApiKey ')) {
    const key = authHeader.slice(7);
    if (key.length <= 256 && env.apiKeys.includes(key)) {
      req.user = { username: 'api' };
      return next();
    }
    res.status(401).json({ success: false, error: { code: 'AUTH_INVALID', message: 'Invalid API key' } });
    return;
  }

  // JWT mode
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    if (token.length > 4096) {
      res.status(401).json({ success: false, error: { code: 'AUTH_INVALID', message: 'Token too large' } });
      return;
    }
    try {
      const payload = jwt.verify(token, env.jwtSecret) as AuthUser;
      req.user = {
        userId: payload.userId,
        username: typeof payload.username === 'string' ? payload.username.slice(0, 50) : 'jwt-user',
      };
      if (payload.instance && isSafeSqlName(payload.instance)) req.sqlInstance = payload.instance;
      if (payload.database && isSafeSqlName(payload.database)) req.sqlDatabase = payload.database;
      return next();
    } catch {
      res.status(401).json({ success: false, error: { code: 'AUTH_INVALID', message: 'Invalid token' } });
      return;
    }
  }

  res.status(401).json({ success: false, error: { code: 'AUTH_REQUIRED', message: 'Authorization required' } });
}

export function tenantResolver(req: Request, res: Response, next: NextFunction): void {
  const headerInstance = req.headers['x-sql-instance'] as string;
  const headerDatabase = req.headers['x-sql-database'] as string;
  const headerAuth = req.headers['x-sql-auth'] as string;
  const headerUsername = req.headers['x-sql-username'] as string;
  const headerPassword = req.headers['x-sql-password'] as string;

  // Instance
  if (headerInstance && isSafeSqlName(headerInstance)) {
    req.sqlInstance = headerInstance;
  } else {
    req.sqlInstance = req.sqlInstance || env.sql.instance;
  }

  // Database — require a non-empty value
  if (headerDatabase && isSafeSqlName(headerDatabase)) {
    req.sqlDatabase = headerDatabase;
  } else {
    req.sqlDatabase = req.sqlDatabase || env.sql.database;
  }
  if (!req.sqlDatabase) {
    res.status(400).json({ success: false, error: { code: 'MISSING_DATABASE', message: 'X-SQL-Database header is required (no default database configured).' } });
    return;
  }

  // SQL Auth credentials (for remote connections)
  if (headerAuth === 'sql' || headerAuth === 'windows') {
    req.sqlAuth = headerAuth;
  }
  if (headerUsername && headerUsername.length <= 128) {
    req.sqlUsername = headerUsername;
  }
  if (headerPassword && headerPassword.length <= 256) {
    req.sqlPassword = headerPassword;
  }

  // Validate: SQL auth requires username + password
  if (req.sqlAuth === 'sql' && !req.sqlUsername && !env.sql.username) {
    res.status(400).json({ success: false, error: { code: 'MISSING_CREDENTIALS', message: 'X-SQL-Username is required when X-SQL-Auth is "sql".' } });
    return;
  }

  next();
}
