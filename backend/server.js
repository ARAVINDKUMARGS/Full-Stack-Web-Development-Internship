import { env } from './src/config/env.js';
import { connectDB } from './src/config/db.js';
import { createApp } from './src/app.js';

async function start() {
  try {
    await connectDB(env.mongoUri);
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
  const app = createApp(env.clientUrls);
  const server = app.listen(env.port, () =>
    console.log(`API running on port ${env.port} (${env.nodeEnv})`)
  );
  const shutdown = () => server.close(() => process.exit(0));
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

start();
