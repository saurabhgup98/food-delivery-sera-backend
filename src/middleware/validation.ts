import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { IAppError, IApiResponse } from '../types/index.js';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    const error: IAppError = new Error(errorMessages.join(', ')) as IAppError;
    error.statusCode = 400;
    return next(error);
  }
  
  next();
};
