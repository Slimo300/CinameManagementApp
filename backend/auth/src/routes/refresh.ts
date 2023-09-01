import express, {Request, Response} from "express";

import { TokenService } from "../services/token";
import { NotAuthorizedError } from "@spellcinema/lib";

const refreshRouter = (tokenService: TokenService): express.Router => {

    const router = express.Router();
    
    router.post("/api/users/refresh", async (req: Request, res: Response) => {
        if (!req.cookies?.jwt) {
            throw new NotAuthorizedError();
        }
    
        try {
            const { accessToken, refreshToken } = await tokenService.RefreshTokens(req.cookies.jwt);
    
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
            
            throw new NotAuthorizedError();
        }
    });

    return router;
}

export { refreshRouter };