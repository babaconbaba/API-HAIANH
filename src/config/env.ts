import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  authMode: (process.env.AUTH_MODE || 'apikey') as 'apikey' | 'jwt',
  apiKeys: (process.env.API_KEYS || '').split(',').filter(Boolean),
  jwtSecret: process.env.JWT_SECRET || 'change-me',

  sql: {
    instance: process.env.SQL_INSTANCE || '.\\MISASME2026',
    database: process.env.SQL_DATABASE || '',
    auth: (process.env.SQL_AUTH || 'windows') as 'windows' | 'sql',
    username: process.env.SQL_USERNAME || '',
    password: process.env.SQL_PASSWORD || '',
    poolMax: parseInt(process.env.SQL_POOL_MAX || '50', 10),
    poolMin: parseInt(process.env.SQL_POOL_MIN || '0', 10),
    idleTimeout: parseInt(process.env.SQL_POOL_IDLE_TIMEOUT || '30000', 10),
    requestTimeout: parseInt(process.env.SQL_REQUEST_TIMEOUT || '30000', 10),
  },
};
