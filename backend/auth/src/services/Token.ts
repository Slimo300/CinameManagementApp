import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import { RedisClientType } from "redis";

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

export class TokenService {
    redisClient: RedisClientType;
    privateKey: string;

    constructor(redisClient: RedisClientType, privateKey: string) {
        this.redisClient = redisClient;
        this.privateKey = privateKey;
    }

    async InvalidateToken(token: string) {

        if (token === "") {
            return;
        }
        const payload = jwt.decode(token);

        const tokenID = (payload as jwt.JwtPayload).id;
        const userID = (payload as jwt.JwtPayload).userId;

        const keys = await this.redisClient.keys(userID+":*"+tokenID);
        if (keys.length === 1) {
            await this.redisClient.set(keys[0], TokenState.Blacklisted, {KEEPTTL: true});
        }
    }

    private async InvalidateTokensChildren(userID: string, tokenID: string) {

        let t = tokenID;

        while(true) {
            const keys = await this.redisClient.keys(userID+":"+t+":*");

            if (keys.length === 0) break;

            await this.redisClient.set(keys[0], TokenState.Blacklisted, {KEEPTTL: true});

            t = keys[0].split(":")[2];
        }
    }

    async NewTokenPairForUser(user: UserData) {

        const accessToken = jwt.sign({
            id: user.id,
            email: user.email,
            isAdmin: user.isAdmin,
        }, this.privateKey, {
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
    
        await this.redisClient.set(user.id + ":" + tokenID, TokenState.Active);
        await this.redisClient.expire(user.id + ":" + tokenID, parseInt(process.env.REFRESH_DURATION!));

        return {
            accessToken, refreshToken
        };
    }

    async RefreshTokens(token: string) {

        const payload = jwt.verify(token, process.env.REFRESH_SECRET!, {
            algorithms: ["HS256"]
        });

        const tokenID = (payload as jwt.JwtPayload).id;
        const userID = (payload as jwt.JwtPayload).userId;

        const key = (await this.redisClient.keys(userID+":*"+tokenID))[0];

        const tokenState = await this.redisClient.get(key);

        if (tokenState === TokenState.Blacklisted) {
            this.InvalidateTokensChildren(userID, tokenID);

            throw new TokenBlacklistedError();
        }

        const newTokenID = uuidv4();

        await this.redisClient.set(userID+":"+tokenID+":"+newTokenID, TokenState.Active);
        this.redisClient.expire(userID+":"+tokenID+":"+newTokenID, parseInt(process.env.REFRESH_DURATION!));

        const user = await User.findById(userID);
        if (!user) {
            throw new TokenOrphannedError();
        }

        const accessToken = jwt.sign({
            id: user.id,
            email: user.email,
            isAdmin: user.isAdmin,
        }, this.privateKey, {
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