import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import cookieParser from "cookie-parser";
// import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { loginRouter } from "./routes/login";
import { logoutRouter } from "./routes/logout";
import { registerRouter } from "./routes/register";
import { refreshRouter } from "./routes/refresh";

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(cookieParser());
// app.use(cookieSession({
//     signed: false,
//     secure: process.env.NODE_ENV !== "test",
//     domain: process.env.DOMAIN,
//     httpOnly: true,
// }));

app.use(currentUserRouter);
app.use(loginRouter);
app.use(logoutRouter);
app.use(registerRouter);
app.use(refreshRouter);

export { app };