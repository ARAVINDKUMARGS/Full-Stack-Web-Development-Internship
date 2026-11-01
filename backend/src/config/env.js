import dotenv from 'dotenv';

dotenv.config();

if (!process.env.MONGODB_URI && process.env.NODE_ENV !== 'test') {
  console.error('Missing MONGODB_URI. Copy .env.example to .env and set it.');
  process.exit(1);
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/contact_manager',
  clientUrls: (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((u) => u.trim().replace(/\/$/, ''))
    .filter(Boolean),
};
