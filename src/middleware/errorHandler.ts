import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
  }
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      error: { code: err.code, message: err.message, details: err.details },
    });
    return;
  }

  console.error('[ERROR]', err);

  // msnodesqlv8 may throw errors where message is "[object Object]" — extract real message
  const errAny = err as any;
  const rawMsg = err.message || '';
  const origMsg = errAny.originalError?.message || errAny.originalError?.sqlMessage || '';
  const msg = (rawMsg !== '[object Object]' && rawMsg) ? rawMsg : origMsg || String(err);

  const errCode = errAny.code as string | undefined;
  const errName = err.name || err.constructor?.name || '';

  // SQL connection / login failed (msnodesqlv8 ConnectionError or tedious ELOGIN)
  if (errName === 'ConnectionError' || errCode === 'ELOGIN'
    || msg.includes('Login failed') || msg.includes('ELOGIN')) {
    const detail = env.nodeEnv === 'development' ? msg : undefined;
    res.status(401).json({
      success: false,
      error: { code: 'SQL_AUTH_FAILED', message: 'SQL Server connection failed. Check instance, credentials and network.', details: detail },
    });
    return;
  }

  // SQL connection refused / unreachable
  if (errCode === 'ESOCKET' || errCode === 'ETIMEOUT' || errCode === 'ECONNREFUSED'
    || msg.includes('ESOCKET') || msg.includes('ETIMEOUT') || msg.includes('ECONNREFUSED')) {
    res.status(503).json({
      success: false,
      error: { code: 'SQL_CONNECTION_FAILED', message: 'Cannot connect to SQL Server. Check instance name and network.' },
    });
    return;
  }

  // Invalid GUID format
  if (msg.includes('converting from a character string to uniqueidentifier')) {
    res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Invalid ID format. Expected a valid GUID.' },
    });
    return;
  }

  // Invalid date format
  if (msg.includes('out-of-range value') || msg.includes('conversion of a') && msg.includes('datetime')) {
    res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Invalid date format. Use YYYY-MM-DD.' },
    });
    return;
  }

  // Invalid column name (schema mismatch)
  if (msg.includes('Invalid column name') || msg.includes('Invalid object name')) {
    res.status(400).json({
      success: false,
      error: { code: 'SCHEMA_ERROR', message: 'The requested resource is not available in this database.' },
    });
    return;
  }

  // NOT NULL violation (missing required field)
  if (msg.includes('Cannot insert the value NULL') || msg.includes('column does not allow nulls')) {
    const colMatch = msg.match(/column '(\w+)'/);
    const colName = colMatch ? colMatch[1] : 'unknown';
    res.status(422).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: `Required field '${colName}' is missing or null.` },
    });
    return;
  }

  // Duplicate key
  if (msg.includes('Violation of UNIQUE KEY') || msg.includes('Violation of PRIMARY KEY') || msg.includes('duplicate key')) {
    res.status(409).json({
      success: false,
      error: { code: 'DUPLICATE', message: 'A record with this key already exists.' },
    });
    return;
  }

  // Foreign key constraint
  if (msg.includes('FOREIGN KEY constraint') || msg.includes('REFERENCE constraint')) {
    const fkMatch = msg.match(/constraint "([^"]+)"/);
    const tableMatch = msg.match(/table "([^"]+)"/g);
    const detail = env.nodeEnv === 'development'
      ? { constraint: fkMatch?.[1], tables: tableMatch?.map((t: string) => t.replace(/table "/g, '').replace(/"/g, '')), raw: msg }
      : undefined;
    res.status(409).json({
      success: false,
      error: { code: 'CONSTRAINT_ERROR', message: 'Cannot perform this operation due to related records.', details: detail },
    });
    return;
  }

  // JSON parse error
  if (msg.includes('in JSON at position') || msg.includes('Unexpected token')) {
    res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Invalid JSON in request body.' },
    });
    return;
  }

  // Generic error — never expose internal details in production
  const safeMessage = env.nodeEnv === 'development'
    ? msg
    : 'An internal error occurred. Please try again later.';

  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: safeMessage },
  });
}
