import express from "express";
import fs from "fs";
import { json } from "body-parser";
import "express-async-errors";

import { NotFoundError, ErrorHandler, RequireAdmin, RequireAuth } from "@spellcinema/lib";
import { NewMovieRouter } from "./routes/NewMovie";

const publicKey = fs.readFileSync("/rsa/public.key", "utf-8");

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(RequireAuth(publicKey));

app.use(NewMovieRouter());

app.all("*", () => {
    throw new NotFoundError();
})

app.use(ErrorHandler);

export { app };