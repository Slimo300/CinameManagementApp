import express, { Request, Response } from "express";

import { TokenService } from "../services/Token";

const logoutRouter = (TokenService: TokenService): express.Router => {

    const router = express.Router();

    router.post("/api/users/logout", async (req: Request, res: Response) => {

        try {
            await TokenService.InvalidateToken(req.cookies.jwt);
        } catch(err) {
            console.log(err);
        }

        res.clearCookie("jwt", {
            domain: process.env.DOMAIN,
            httpOnly: true
        });
        res.send({"msg": "ok"});
    });

    return router;
}


export { logoutRouter };