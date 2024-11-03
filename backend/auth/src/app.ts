import express from "express";
import fs from "fs";
import { json } from "body-parser";
import "express-async-errors";
// import cookieParser from "cookie-parser";
import { RedisClientType, createClient } from "redis";

import { currentUserRouter } from "./routes/CurrentUser";
import { loginRouter } from "./routes/Login";
import { logoutRouter } from "./routes/Logout";
import { registerRouter } from "./routes/Register";
import { refreshRouter } from "./routes/Refresh";
import { errorHandler, NotFoundError } from "@spellcinema/lib";
import { TokenService } from "./services/Token";


const redisClient = createClient({
    url: process.env.REDIS_URI,
})

redisClient.on("error", err => console.log("Redis Client Error", err));

const privateKey = fs.readFileSync("/app/private-key/private_key.pem", "utf-8");
const publicKey = fs.readFileSync("/app/public-key/public_key.pem", "utf-8");

const tokenService = new TokenService(redisClient as RedisClientType, privateKey);

const app = express();

app.set("trust proxy", true);
app.use(json());
// app.use(cookieParser());

app.use(currentUserRouter(publicKey));
app.use(loginRouter(tokenService));
app.use(logoutRouter(tokenService));
app.use(registerRouter());
app.use(refreshRouter(tokenService));

app.all("*", () => {
    throw new NotFoundError();
})

app.use(errorHandler);

export { redisClient }
export { app };