export const config = {
  PORT: parseInt(process.env.PORT || '3001', 10),
  DATABASE_PATH: process.env.DATABASE_PATH || './data/acreed.db',
  JWT_SECRET: process.env.JWT_SECRET || 'CHANGE-ME-IN-PRODUCTION',
  JWT_ACCESS_TTL: '15m',
  JWT_REFRESH_TTL: '7d',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || '',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '',
  ADMIN_NAME: process.env.ADMIN_NAME || 'Admin',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:8081',
};
