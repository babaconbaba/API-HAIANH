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
app.use(require('compression')({ threshold: 1024 }));
app.use('/api', require('express-rate-limit').rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX || '1000', 10),
  standardHeaders: true, legacyHeaders: false,
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests, try again later.' } },
}));
app.use(morgan(env.nodeEnv === 'production' ? 'tiny' : 'short'));

// Swagger UI — custom branding
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'MISA SME 2026 — API Documentation',
  customfavIcon: '',
  customCss: `
    .swagger-ui .topbar { background: #1a237e; padding: 8px 0; }
    .swagger-ui .topbar .download-url-wrapper { display: none; }
    .swagger-ui .topbar::before { content: "MISA SME 2026 API"; color: white; font-size: 20px; font-weight: bold; padding: 0 20px; }
    .swagger-ui .info { margin: 20px 0; }
    .swagger-ui .info .title { font-size: 28px; color: #1a237e; }
    .swagger-ui .info .description p { font-size: 14px; line-height: 1.6; }
    .swagger-ui .opblock.opblock-get .opblock-summary { border-color: #1976d2; }
    .swagger-ui .opblock.opblock-post .opblock-summary { border-color: #388e3c; }
    .swagger-ui .opblock.opblock-put .opblock-summary { border-color: #f57c00; }
    .swagger-ui .opblock.opblock-delete .opblock-summary { border-color: #d32f2f; }
    .swagger-ui .btn.authorize { background: #1a237e; border-color: #1a237e; }
    .swagger-ui .btn.authorize svg { fill: white; }
    .swagger-ui section.models { border: 1px solid #e0e0e0; border-radius: 8px; }
    .swagger-ui .model-box { background: #fafafa; }
  `,
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    docExpansion: 'none',
    defaultModelsExpandDepth: 2,
    defaultModelExpandDepth: 3,
    tagsSorter: 'alpha',
    operationsSorter: 'alpha',
  },
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
  console.log(`[MISA API] Worker ${process.pid} on http://localhost:${env.port}`);
  console.log(`[MISA API] DB: ${env.sql.instance} / ${env.sql.database} | Pool: ${env.sql.poolMax}`);
  console.log(`[MISA API] Docs: http://localhost:${env.port}/docs`);
});

// Tune for high concurrency
server.keepAliveTimeout = 65000;     // > ALB/nginx default 60s
server.headersTimeout = 66000;       // > keepAliveTimeout

// Graceful shutdown — close all SQL pools
for (const sig of ['SIGTERM', 'SIGINT'] as const) {
  process.on(sig, async () => {
    console.log(`[MISA API] ${sig} received, closing connections...`);
    server.close();
    await closeAll();
    process.exit(0);
  });
}
