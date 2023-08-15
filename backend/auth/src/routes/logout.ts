import express, { Request, Response } from "express";

import jwt from "jsonwebtoken";
import { redisClient } from "../app";
import { TokenState } from "../models/Token";

const router = express.Router();

router.post("/api/users/logout", async (req: Request, res: Response) => {

    try {
        const payload = jwt.decode(req.cookies.jwt);

        const tokenID = (payload as jwt.JwtPayload).id;
        const userID = (payload as jwt.JwtPayload).userId;

        const keys = await redisClient.keys(userID+":*"+tokenID);
        if (keys.length === 1) {
            await redisClient.set(keys[0], TokenState.Blacklisted, {KEEPTTL: true});
        }

    } catch(err) {
    }

    res.clearCookie("jwt", {
        domain: process.env.DOMAIN,
        httpOnly: true
    });
    res.send({"msg": "ok"});
})

export { router as logoutRouter };