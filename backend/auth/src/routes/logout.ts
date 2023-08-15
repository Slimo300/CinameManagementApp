import express, { Request, Response } from "express";

import { Token } from "../services/token";

const router = express.Router();

router.post("/api/users/logout", async (req: Request, res: Response) => {

    try {
        await Token.InvalidateToken(req.cookies.jwt);
    } catch(err) {
        console.log(err);
    }

    res.clearCookie("jwt", {
        domain: process.env.DOMAIN,
        httpOnly: true
    });
    res.send({"msg": "ok"});
})

export { router as logoutRouter };