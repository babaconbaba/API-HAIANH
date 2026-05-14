import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { authMiddleware, tenantResolver } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import { swaggerSpec } from './swagger';
import { closeAll } from './config/database';
import systemRoutes from './routes/system';
import dictionaryRoutes from './routes/dictionary';
import journalRoutes from './routes/journal';
import salesRoutes from './routes/sales';
import purchaseRoutes from './routes/purchase';
import inventoryRoutes from './routes/inventory';
import fixedAssetsRoutes from './routes/fixedAssets';
import payrollRoutes from './routes/payroll';
import taxRoutes from './routes/tax';
import reportsRoutes from './routes/reports';
import contractsRoutes from './routes/contracts';
import budgetRoutes from './routes/budget';
import loanRoutes from './routes/loan';
import generalRoutes from './routes/general';
import costingRoutes from './routes/costing';
import auditRoutes from './routes/audit';

const app = express();

// Global middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('short'));

// Swagger UI — no auth required
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'MISA SME API Docs',
}));
app.get('/swagger.json', (_req, res) => res.json(swaggerSpec));

// Auth + tenant resolution
app.use('/api', authMiddleware, tenantResolver);

// Routes
app.use('/api/system', systemRoutes);
app.use('/api/dictionary', dictionaryRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/fixed-assets', fixedAssetsRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/tax', taxRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/contracts', contractsRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/loan', loanRoutes);
app.use('/api/general', generalRoutes);
app.use('/api/costing', costingRoutes);
app.use('/api/audit', auditRoutes);

// 404 handler for unmatched API routes
app.use('/api', (_req, res) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Endpoint not found' } });
});

// Error handler
app.use(errorHandler);

const server = app.listen(env.port, () => {
  console.log(`[MISA API] Running on http://localhost:${env.port}`);
  console.log(`[MISA API] Default DB: ${env.sql.instance} / ${env.sql.database}`);
  console.log(`[MISA API] Auth mode: ${env.authMode}`);
  console.log(`[MISA API] API Docs: http://localhost:${env.port}/docs`);
});

// Graceful shutdown — close all SQL pools
for (const sig of ['SIGTERM', 'SIGINT'] as const) {
  process.on(sig, async () => {
    console.log(`[MISA API] ${sig} received, closing connections...`);
    server.close();
    await closeAll();
    process.exit(0);
  });
}
