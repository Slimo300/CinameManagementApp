import express, { Request, Response } from "express";

import { TokenService } from "../services/token";

const logoutRouter = (tokenService: TokenService): express.Router => {

    const router = express.Router();

    router.post("/api/users/logout", async (req: Request, res: Response) => {

        try {
            await tokenService.InvalidateToken(req.cookies.jwt);
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