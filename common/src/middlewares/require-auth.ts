import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import jwt  from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
  isAdmin: boolean;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const requireAuth = (publicKey: string) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    throw new NotAuthorizedError();
  }
  try {
      const bearerToken = req.headers.authorization.split(" ")[1];
      const payload = jwt.verify(bearerToken, publicKey, {
          algorithms: ["RS256"]
      }) as UserPayload;
      req.currentUser = {
          id: payload.id,
          email: payload.email,
          isAdmin: payload.isAdmin,
      };
  }
  catch (err) {
      throw new NotAuthorizedError();
  }
  next();
};
