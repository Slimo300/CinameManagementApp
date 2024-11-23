import express, {Request, Response} from "express";

import { TokenService } from "../services/Token";
import { NotAuthorizedError } from "@spellcinema/lib";

const refreshRouter = (TokenService: TokenService): express.Router => {
    const router = express.Router();
    
    router.post("/api/users/refresh", async (req: Request, res: Response) => {
        if (!req.cookies?.refreshToken) {
            throw new NotAuthorizedError("refresh token not provided");
        }
        try {
            const { accessToken, refreshToken } = await TokenService.RefreshTokens(req.cookies.refreshToken);
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                domain: process.env.DOMAIN,
            });
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
                domain: process.env.DOMAIN,
            })
            res.send({ message: "success" });
        } catch (err: any) {
            res.clearCookie("refreshToken", {
                httpOnly: true,
                domain: process.env.DOMAIN
            })
            res.clearCookie("accessToken", {
                httpOnly: true,
                domain: process.env.DOMAIN
            })
            throw new NotAuthorizedError(err.message?err.message:"refresh validation failed");
        }
    });
    return router;
}

export { refreshRouter };