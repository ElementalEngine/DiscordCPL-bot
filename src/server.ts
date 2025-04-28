import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';              
import morgan from 'morgan';              

import { config } from './config';
import Routes from './routes';

const app = express();

// ─── MIDDLEWARE ────────────────────────────────────────────────────────────

app.use(helmet());

app.use(cors(config.cors));

app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ─── ROUTES ────────────────────────────────────────────────────────────────

// Mount all your routers
app.use('/', Routes());

// ─── FALLBACKS ─────────────────────────────────────────────────────────────

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error handler
app.use(
  (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res
      .status(err.status || 500)
      .json({ error: err.message || 'Internal Server Error' });
  }
);

export default app;