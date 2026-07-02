import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/errors';
import dotenv from 'dotenv';

dotenv.config();

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const apiKeyHeader = req.headers['x-api-key'];
  const expectedApiKey = process.env.API_KEY || 'udyam_secret_key_123';

  if (!apiKeyHeader || apiKeyHeader !== expectedApiKey) {
    throw new UnauthorizedError('Invalid or missing API key in x-api-key header');
  }

  next();
};
