import { Request, Response, NextFunction } from 'express';
import { HttpError, ApiErrorResponse } from '../utils/errors';
import { logger } from '../utils/logger';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';
  
  // Format errors if validation-related or custom fields are present
  const errorDetails = err.errors || undefined;

  logger.error(`${req.method} ${req.url} - Error ${statusCode}: ${message}`, err);

  res.status(statusCode).json(
    new ApiErrorResponse(message, errorDetails)
  );
};
