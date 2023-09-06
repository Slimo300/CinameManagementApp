import express, {Request, Response } from "express";

import { RequireAuth } from "@spellcinema/lib";


const currentUserRouter = (publicKey: string): express.Router => {
    const router = express.Router();
    router.get("/api/users/current-user", RequireAuth(publicKey), (req: Request, res: Response) => {
        res.send( req.currentUser );
    });

    return router
}


export {currentUserRouter};