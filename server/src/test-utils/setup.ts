// Vitest global setup. Set safe env defaults for testing.
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-do-not-use-in-prod';
process.env.DATABASE_PATH = ':memory:';
process.env.ADMIN_EMAIL = 'admin-test@example.com';
process.env.ADMIN_PASSWORD = 'AdminTestPassword123!';
process.env.CORS_ORIGIN = 'http://localhost:8081';
process.env.PORT = '0'; // never bind a real port in tests
process.env.LOG_LEVEL = 'silent';
