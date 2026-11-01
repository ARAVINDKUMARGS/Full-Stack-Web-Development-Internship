import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import contactRoutes from './routes/contactRoutes.js';
import { notFound, errorHandler, HttpError } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDist = path.resolve(__dirname, '../../frontend/dist');

export function createApp(allowedOrigins = []) {
  const app = express();

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(
    cors({
      origin(origin, cb) {
        // Allow non-browser clients, wildcard, whitelisted origins, and Vercel/Render domains
        const isAllowedDomain = origin && (origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com'));
        if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin) || isAllowedDomain) {
          return cb(null, true);
        }
        cb(new HttpError(403, 'Origin not allowed by CORS'));
      },
    })
  );
  app.use(express.json({ limit: '10kb' }));
  if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

  // Health check endpoints
  app.get('/health', (_req, res) => res.json({ success: true, status: 'ok' }));
  app.get('/api/health', (_req, res) => res.json({ success: true, status: 'ok' }));
  app.get('/api', (_req, res) =>
    res.json({ success: true, message: 'Contact Manager API is running', health: '/api/health' })
  );
  app.use('/api/contacts', contactRoutes);

  // Serve compiled frontend SPA if dist folder exists
  if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist, { index: false }));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      if (req.path === '/' && req.headers.accept?.includes('application/json')) {
        return res.json({ success: true, message: 'Contact Manager API is running', health: '/api/health' });
      }
      res.sendFile(path.join(clientDist, 'index.html'));
    });
  } else {
    app.get('/', (_req, res) =>
      res.json({ success: true, message: 'Contact Manager API is running', health: '/api/health' })
    );
  }

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
