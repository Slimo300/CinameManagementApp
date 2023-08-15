import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import cookieParser from "cookie-parser";
import {createClient} from "redis";

import { currentUserRouter } from "./routes/current-user";
import { loginRouter } from "./routes/login";
import { logoutRouter } from "./routes/logout";
import { registerRouter } from "./routes/register";
import { refreshRouter } from "./routes/refresh";

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(cookieParser());

app.use(currentUserRouter);
app.use(loginRouter);
app.use(logoutRouter);
app.use(registerRouter);
app.use(refreshRouter);

const redisClient = createClient({
    url: process.env.REDIS_URI,
})

redisClient.on("error", err => console.log("Redis Client Error", err));
redisClient.on("connect", () => console.log("Redis Client connected"));

export { app };
export { redisClient };