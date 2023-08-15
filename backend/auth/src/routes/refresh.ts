import express, {Request, Response} from "express";

import { Token } from "../services/token";

const router = express.Router();

router.post("/api/users/refresh", async (req: Request, res: Response) => {
    if (!req.cookies?.jwt) {
        res.status(401).send({"err": "user not authorized, no token provided"});
        return;
    }

    try {
        const { accessToken, refreshToken } = await Token.RefreshTokens(req.cookies.jwt);

        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            domain: process.env.DOMAIN
        });

        res.send({ accessToken });

    } catch (err) {
        res.clearCookie("jwt", {
            httpOnly: true,
            domain: process.env.DOMAIN
        })
        
        res.status(401).send({"err": "user not authorized"});
        return;
    }
});

export { router as refreshRouter };