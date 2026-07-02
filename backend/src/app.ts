import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import udyamRouter from './app/udyam/udyam.routes';
import { errorMiddleware } from './middlewares/error.middleware';
import { NotFoundError } from './utils/errors';

const app = express();

// Standard middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Public health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/udyam', udyamRouter);

// Catch-all route for unmatched paths
app.use('*', (req, res, next) => {
  next(new NotFoundError(`Path ${req.originalUrl} not found`));
});

// Global error handler middleware
app.use(errorMiddleware);

export default app;
