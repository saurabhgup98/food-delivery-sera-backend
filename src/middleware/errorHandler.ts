import { Request, Response, NextFunction } from 'express';
import { IAppError, IApiResponse } from '../types/index.js';

export const errorHandler = (
  err: IAppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('❌ Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { ...error, message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    const message = `${field} already exists`;
    error = { ...error, message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors || {})
      .map((val: any) => val.message)
      .join(', ');
    error = { ...error, message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { ...error, message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { ...error, message, statusCode: 401 };
  }

  // Multer errors
  if (err.name === 'MulterError') {
    let message = 'File upload error';
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File too large';
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      message = 'Too many files';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Unexpected file field';
    }
    error = { ...error, message, statusCode: 400 };
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  const response: IApiResponse = {
    success: false,
    message,
    error: process.env['NODE_ENV'] === 'development' ? err.stack : undefined,
  };

  res.status(statusCode).json(response);
};
