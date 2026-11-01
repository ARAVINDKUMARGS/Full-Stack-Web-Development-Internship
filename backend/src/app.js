import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import contactRoutes from './routes/contactRoutes.js';
import { notFound, errorHandler, HttpError } from './middleware/errorHandler.js';

export function createApp(allowedOrigins = []) {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin(origin, cb) {
        // Allow non-browser clients (curl, Postman) and whitelisted origins (or wildcard)
        if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) return cb(null, true);
        cb(new HttpError(403, 'Origin not allowed by CORS'));
      },
    })
  );
  app.use(express.json({ limit: '10kb' }));
  if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

  app.get('/', (_req, res) =>
    res.json({ success: true, message: 'Contact Manager API is running', health: '/api/health' })
  );
  app.get('/health', (_req, res) => res.json({ success: true, status: 'ok' }));
  app.get('/api/health', (_req, res) => res.json({ success: true, status: 'ok' }));
  app.use('/api/contacts', contactRoutes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
