import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid"; 

import { privateKey, redisClient } from "../app";
import { User } from "../models/User";

export enum TokenState {
    Blacklisted = "0",
    Active = "1"
}

export interface UserData {
    id: string,
    email: string,
    isAdmin: boolean,
}

// Error returned when checked token has already been exchanged
export class TokenBlacklistedError extends Error {
    constructor() {
        super("Token has already been exchanged");

        Object.setPrototypeOf(this, TokenBlacklistedError.prototype);
    }
}

// Error returned when there is no corresponding user for token owner
export class TokenOrphannedError extends Error {
    constructor() {
        super("Token has no owner");

        Object.setPrototypeOf(this, TokenOrphannedError.prototype);
    }
}

export class Token {
    static async InvalidateToken(token: string) {

        if (token === "") {
            return;
        }
        const payload = jwt.decode(token);

        const tokenID = (payload as jwt.JwtPayload).id;
        const userID = (payload as jwt.JwtPayload).userId;

        const keys = await redisClient.keys(userID+":*"+tokenID);
        if (keys.length === 1) {
            await redisClient.set(keys[0], TokenState.Blacklisted, {KEEPTTL: true});
        }
    }

    private static async InvalidateTokensChildren(userID: string, tokenID: string) {

        let t = tokenID;

        while(true) {
            const keys = await redisClient.keys(userID+":"+t+":*");

            if (keys.length === 0) break;

            await redisClient.set(keys[0], TokenState.Blacklisted, {KEEPTTL: true});

            t = keys[0].split(":")[2];
        }
    }

    static async NewTokenPairForUser(user: UserData) {

        const accessToken = jwt.sign({
            id: user.id,
            email: user.email,
            isAdmin: user.isAdmin,
        }, privateKey, {
            algorithm: "RS256",
            expiresIn: parseInt(process.env.ACCESS_DURATION!),
        });
        
        const tokenID = uuidv4();
    
        const refreshToken = jwt.sign({
            id: tokenID,
            userId: user.id,
        }, process.env.REFRESH_SECRET!, {
            algorithm: "HS256",
            expiresIn: parseInt(process.env.REFRESH_DURATION!),
        })
    
        await redisClient.set(user.id + ":" + tokenID, TokenState.Active);
        await redisClient.expire(user.id + ":" + tokenID, parseInt(process.env.REFRESH_DURATION!));

        return {
            accessToken, refreshToken
        };
    }

    static async RefreshTokens(token: string) {

        const payload = jwt.verify(token, process.env.REFRESH_SECRET!, {
            algorithms: ["HS256"]
        });

        const tokenID = (payload as jwt.JwtPayload).id;
        const userID = (payload as jwt.JwtPayload).userId;

        const key = (await redisClient.keys(userID+":*"+tokenID))[0];

        const tokenState = await redisClient.get(key);

        if (tokenState === TokenState.Blacklisted) {
            Token.InvalidateTokensChildren(userID, tokenID);

            throw new TokenBlacklistedError();
        }

        const newTokenID = uuidv4();

        await redisClient.set(userID+":"+tokenID+":"+newTokenID, TokenState.Active);
        redisClient.expire(userID+":"+tokenID+":"+newTokenID, parseInt(process.env.REFRESH_DURATION!));

        const user = await User.findById(userID);
        if (!user) {
            throw new TokenOrphannedError();
        }

        const accessToken = jwt.sign({
            id: user.id,
            email: user.email,
            isAdmin: user.isAdmin,
        }, privateKey, {
            algorithm: "RS256",
            expiresIn: parseInt(process.env.ACCESS_DURATION!),
        });

        const refreshToken = jwt.sign({
            id: newTokenID,
            userId: user.id,
        }, process.env.REFRESH_SECRET!, {
            algorithm: "HS256",
            expiresIn: parseInt(process.env.REFRESH_DURATION!),
        });

        return { 
            accessToken, refreshToken 
        };
    }
}