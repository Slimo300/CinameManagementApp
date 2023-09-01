import express from "express";
import fs from "fs";
import { json } from "body-parser";
import "express-async-errors";
import cookieParser from "cookie-parser";
import { RedisClientType, createClient } from "redis";

import { currentUserRouter } from "./routes/current-user";
import { loginRouter } from "./routes/login";
import { logoutRouter } from "./routes/logout";
import { registerRouter } from "./routes/register";
import { refreshRouter } from "./routes/refresh";
import { ErrorHandler, NotFoundError } from "@spellcinema/lib";
import { TokenService } from "./services/token";


const redisClient = createClient({
    url: process.env.REDIS_URI,
})

redisClient.on("error", err => console.log("Redis Client Error", err));

const privateKey = fs.readFileSync("/private/private.key", "utf-8");
const publicKey = fs.readFileSync("/public/public.key", "utf-8");

const tokenService = new TokenService(redisClient as RedisClientType, privateKey);

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(cookieParser());

app.use(currentUserRouter(publicKey));
app.use(loginRouter(tokenService));
app.use(logoutRouter(tokenService));
app.use(registerRouter());
app.use(refreshRouter(tokenService));

app.all("*", () => {
    throw new NotFoundError();
})

app.use(ErrorHandler);

export { redisClient }
export { app };