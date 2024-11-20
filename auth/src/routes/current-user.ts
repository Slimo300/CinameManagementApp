import express, { Request, Response } from "express";

import { requireAuth } from "@spellcinema/lib";

const currentUserRouter = (publicKey: string): express.Router => {
    const router = express.Router();
    router.get("/api/users/current-user", requireAuth(publicKey), (req: Request, res: Response) => {
        res.send({ currentUser: req.currentUser });
    });

    return router;
}

export {currentUserRouter};