import express from "express";
import fs from "fs";
import { json } from "body-parser";
import "express-async-errors";

import { NotFoundError, ErrorHandler, RequireAuth } from "@spellcinema/lib";
import { NewMovieRouter } from "./routes/NewMovie";
import { GetMovieRouter } from "./routes/GetMovie";
import { GetScreeningRoomRouter } from "./routes/GetScreeningRooms";
import { NewSpectaclRouter } from "./routes/NewSpectacl";

const publicKey = fs.readFileSync("/rsa/public.key", "utf-8");

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(RequireAuth(publicKey));

app.use(GetScreeningRoomRouter());
app.use(GetMovieRouter())
app.use(NewMovieRouter());
app.use(NewSpectaclRouter());

app.all("*", () => {
    throw new NotFoundError();
})

app.use(ErrorHandler);

export { app };