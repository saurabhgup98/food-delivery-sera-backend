import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IAuthRequest, IUser, IJWTPayload, IAppError } from '../types/index.js';
import User from '../models/User.js';

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
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env['JWT_SECRET'] || 'fallback-secret'
    ) as IJWTPayload;

    // Get user from token
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      const error: IAppError = new Error('User not found') as IAppError;
      error.statusCode = 401;
      return next(error);
    }

    // Check if user is verified
    if (!user.isVerified) {
      const error: IAppError = new Error('Please verify your email first') as IAppError;
      error.statusCode = 401;
      return next(error);
    }

    req.user = user;
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
