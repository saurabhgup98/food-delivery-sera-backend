import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IAuthRequest, IAppError } from '../types/index.js';

// Simple Auth Service JWT Secret (should match the one in simple-auth service)
const SIMPLE_AUTH_JWT_SECRET = process.env['SIMPLE_AUTH_JWT_SECRET'] || process.env['JWT_SECRET'] || 'fallback-secret';

const getDecodedValue = (decoded: any, ...keys: string[]): string | undefined => {
  for (const key of keys) {
    if (decoded?.[key] && typeof decoded[key] === 'string') {
      return decoded[key];
    }
  }
  return undefined;
};

export const protect = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Fallback mode for centralized auth flows that do not issue JWT yet.
  const headerEmail = req.headers['x-user-email'];
  const headerUserId = req.headers['x-auth-user-id'];
  if (typeof headerEmail === 'string' && typeof headerUserId === 'string') {
    req.user = {
      _id: headerUserId,
      id: headerUserId,
      email: headerEmail,
    };
    next();
    return;
  }

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
    const userId = getDecodedValue(decoded, 'userId', 'id', 'sub');
    const email = getDecodedValue(decoded, 'email') || getDecodedValue(decoded?.user, 'email');
    const role = getDecodedValue(decoded, 'role') || getDecodedValue(decoded?.user, 'role');

    if (!userId || !email) {
      const payloadError: IAppError = new Error('Token payload missing required identity fields') as IAppError;
      payloadError.statusCode = 401;
      return next(payloadError);
    }

    // Set user info from token payload.
    req.user = {
      _id: userId,
      id: userId,
      email,
      ...(role ? { role } : {}),
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

    if (!req.user.role || !roles.includes(req.user.role)) {
      const error: IAppError = new Error(
        `User role ${req.user.role} is not authorized to access this route`
      ) as IAppError;
      error.statusCode = 403;
      return next(error);
    }

    next();
  };
};
