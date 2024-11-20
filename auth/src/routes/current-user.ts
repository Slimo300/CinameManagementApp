import { NotAuthorizedError } from "@spellcinema/lib";
import express, {NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// import { requireAuth } from "@spellcinema/lib";

interface UserPayload {
    id: string,
    email: string,
    isAdmin: boolean,
}

const requireAuth = (publicKey: string) => (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.accessToken) {
        throw new NotAuthorizedError();
    }

    try {
        const { id, email, isAdmin } = jwt.verify(req.cookies.accessToken, publicKey) as UserPayload;
        req.currentUser = { id, email, isAdmin };
    } catch (err) {
        console.error(err);
        throw new NotAuthorizedError();
    }

    next();
}

const currentUserRouter = (publicKey: string): express.Router => {
    const router = express.Router();
    router.get("/api/users/current-user", requireAuth(publicKey), (req: Request, res: Response) => {
        res.send({ currentUser: req.currentUser });
    });

    return router;
}

export {currentUserRouter};