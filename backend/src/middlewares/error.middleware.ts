import { Request, Response, NextFunction } from 'express';
import { HttpError, ApiErrorResponse } from '../utils/errors';
import { logger } from '../utils/logger';
import { ZodError } from 'zod';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err instanceof HttpError ? err.statusCode : 500;
  let message = err.message || 'Internal Server Error';
  let errorDetails = err.errors || undefined;

  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    errorDetails = err.errors.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message
    }));
  }

  logger.error(`${req.method} ${req.url} - Error ${statusCode}: ${message}`, err);

  res.status(statusCode).json(
    new ApiErrorResponse(message, errorDetails)
  );
};
