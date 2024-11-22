import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../errors/forbidden-error';

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser?.isAdmin) {
    throw new ForbiddenError("user not allowed to perform this action");
  }
  next();
};
