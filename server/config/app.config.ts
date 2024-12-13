// server/config/app.config.ts
export const appConfig = {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/hydropro'
};
