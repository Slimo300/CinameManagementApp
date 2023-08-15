import express, {Request, Response} from "express"
import jwt from "jsonwebtoken";
import {v4 as uuidv4} from "uuid";

import { redisClient } from "../app";
import { TokenState } from "../models/Token";
import { User } from "../models/User";

const router = express.Router();

router.post("/api/users/refresh", async (req: Request, res: Response) => {
    if (!req.cookies?.jwt) {
        res.status(401).send({"err": "user not authorized, no token"});
        return;
    }

    try {
        const payload = jwt.verify(req.cookies.jwt, process.env.JWT_KEY!);

        const tokenID = (payload as jwt.JwtPayload).id;
        const userID = (payload as jwt.JwtPayload).userId;

        const key = (await redisClient.keys(userID+":*"+tokenID))[0];

        const tokenState = await redisClient.get(key);
        console.log(tokenState);
        
        if (tokenState === TokenState.Blacklisted.toString()) {
            let t = tokenID;
            while(true) {
                const keys = await redisClient.keys(userID+":"+t+":*");
                console.log(keys);

                if (keys.length === 0) break;

                await redisClient.set(keys[0], TokenState.Blacklisted, {KEEPTTL: true});

                t = keys[0].split(":")[2]
                console.log(t);
            }
            
            res.clearCookie("jwt", {
                httpOnly: true,
                domain: process.env.DOMAIN
            })
            res.status(401).send({"err": "user not authorized"});
            return;
        }

        await redisClient.set(key, TokenState.Blacklisted, {KEEPTTL: true});

        // Generating new token pair
        const newTokenID = uuidv4();

        await redisClient.set(userID+":"+tokenID+":"+newTokenID, TokenState.Active);
        await redisClient.expire(userID+":"+tokenID+":"+newTokenID, parseInt(process.env.REFRESH_DURATION!));

        const user = await User.findById(userID);
        if (!user) {
            res.status(401).send({"err": "user not authorized"});
            return;
        }

        const accessToken = jwt.sign({
            id: user.id,
            email: user.email,
            isAdmin: user.isAdmin,
        }, process.env.JWT_KEY!, {
            expiresIn: parseInt(process.env.ACCESS_DURATION!),
        });

        const refreshToken = jwt.sign({
            id: newTokenID,
            userId: user.id,
        }, process.env.JWT_KEY!, {
            expiresIn: parseInt(process.env.REFRESH_DURATION!),
        })

        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            domain: process.env.DOMAIN
        });

        res.send({ accessToken });
    } catch(err) {
        res.status(401).send({"err": "user not authorized"});
    }

});

export { router as refreshRouter };