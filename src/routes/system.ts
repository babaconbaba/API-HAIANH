import { getPoolFromReq } from '../config/database';
import { Router, Request, Response } from 'express';
import { getPool, sql } from '../config/database';

const router = Router();

router.get('/health', async (req: Request, res: Response) => {
  try {
    const pool = await getPoolFromReq(req);
    const result = await pool.request().query('SELECT GETDATE() AS serverTime, DB_NAME() AS database_name');
    res.json({
      success: true,
      data: {
        status: 'ok',
        serverTime: result.recordset[0].serverTime,
        database: result.recordset[0].database_name,
        instance: req.sqlInstance,
      },
    });
  } catch (err: any) {
    res.status(503).json({ success: false, error: { code: 'DB_CONNECTION_ERROR', message: err.message } });
  }
});

router.get('/ref-types', async (req: Request, res: Response) => {
  try {
    const pool = await getPoolFromReq(req);
    const result = await pool.request().query(
      `SELECT RefType, RefTypeName, MasterTableName, DetailTableName, Postable
       FROM SYSRefType ORDER BY RefType`
    );
    res.json({ success: true, data: result.recordset });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'QUERY_ERROR', message: err.message } });
  }
});

router.get('/branches', async (req: Request, res: Response) => {
  try {
    const pool = await getPoolFromReq(req);
    const result = await pool.request().query(
      `SELECT OrganizationUnitID, OrganizationUnitCode, OrganizationUnitName,
              BranchID, ParentID, Grade, IsParent, OrganizationUnitTypeID, Inactive
       FROM OrganizationUnit ORDER BY SortMISACodeID`
    );
    res.json({ success: true, data: result.recordset });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'QUERY_ERROR', message: err.message } });
  }
});

router.get('/databases', async (req: Request, res: Response) => {
  try {
    const pool = await getPool(req.sqlInstance, 'master');
    const result = await pool.request().query(
      `SELECT name FROM sys.databases WHERE name NOT IN ('master','tempdb','model','msdb') ORDER BY name`
    );
    res.json({ success: true, data: result.recordset.map((r: any) => r.name) });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'QUERY_ERROR', message: err.message } });
  }
});

router.get('/tables', async (req: Request, res: Response) => {
  try {
    const pool = await getPoolFromReq(req);
    const result = await pool.request().query(
      `SELECT t.TABLE_NAME,
              (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS c WHERE c.TABLE_NAME = t.TABLE_NAME) AS ColumnCount
       FROM INFORMATION_SCHEMA.TABLES t
       WHERE t.TABLE_TYPE = 'BASE TABLE'
       ORDER BY t.TABLE_NAME`
    );
    res.json({ success: true, data: result.recordset, count: result.recordset.length });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'QUERY_ERROR', message: err.message } });
  }
});

export default router;
