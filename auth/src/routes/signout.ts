import express, { Request, Response } from "express";

import { TokenService } from "../services/Token";

const logoutRouter = (TokenService: TokenService): express.Router => {
    const router = express.Router();

    router.post("/api/users/signout", async (req: Request, res: Response) => {
        try {
            await TokenService.InvalidateToken(req.cookies.refreshToken);
        } catch(err) {
            console.log(err);
        }
        res.clearCookie("refreshToken", {
            domain: process.env.DOMAIN,
            httpOnly: true
        });
        res.clearCookie("accessToken", {
            domain: process.env.DOMAIN,
            httpOnly: true
        });
        res.send({"msg": "success"});
    });

    return router;
}


export { logoutRouter };