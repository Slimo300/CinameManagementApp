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
  if (!req.cookies.accessToken) {
    throw new NotAuthorizedError("no token found");
  }
  try {
      const payload = jwt.verify(req.cookies.accessToken, publicKey, {
          algorithms: ["RS256"]
      }) as UserPayload;
      req.currentUser = {
          id: payload.id,
          email: payload.email,
          isAdmin: payload.isAdmin,
      };
  }
  catch (err: any) {
      throw new NotAuthorizedError(err.message?err.message:"user not authorized");
  }
  next();
};
