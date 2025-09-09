import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IAuthRequest, IAppError } from '../types/index.js';

// Simple Auth Service JWT Secret (should match the one in simple-auth service)
const SIMPLE_AUTH_JWT_SECRET = process.env['SIMPLE_AUTH_JWT_SECRET'] || process.env['JWT_SECRET'] || 'fallback-secret';

export const protect = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    const error: IAppError = new Error('Not authorized to access this route') as IAppError;
    error.statusCode = 401;
    return next(error);
  }

  try {
    // Verify token using simple-auth JWT secret
    const decoded = jwt.verify(token, SIMPLE_AUTH_JWT_SECRET) as any;

    // Set user info from token (simple-auth provides userId)
    req.user = {
      _id: decoded.userId,
      id: decoded.userId,
    } as any;

    next();
  } catch (error) {
    const jwtError: IAppError = new Error('Not authorized to access this route') as IAppError;
    jwtError.statusCode = 401;
    return next(jwtError);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: IAuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      const error: IAppError = new Error('Not authorized to access this route') as IAppError;
      error.statusCode = 401;
      return next(error);
    }

    if (!roles.includes(req.user.role)) {
      const error: IAppError = new Error(
        `User role ${req.user.role} is not authorized to access this route`
      ) as IAppError;
      error.statusCode = 403;
      return next(error);
    }

    next();
  };
};
