import express from "express";
import fs from "fs";
import { json } from "body-parser";
import "express-async-errors";

import { NotFoundError, ErrorHandler, RequireAuth } from "@spellcinema/lib";
import { NewMovieRouter } from "./routes/NewMovie";
import { GetMovieRouter } from "./routes/GetMovie";
import { GetScreeningRoomRouter } from "./routes/GetScreeningRooms";
import { NewSpectaclRouter } from "./routes/NewSpectacl";
import { GetSpectaclesRouter } from "./routes/GetSpectacles";
import { SpectaclService } from "./services/Spectacles";

const publicKey = fs.readFileSync("/rsa/public.key", "utf-8");

const app = express();

const spectaclService = new SpectaclService();

app.set("trust proxy", true);
app.use(json());

app.use(GetScreeningRoomRouter(publicKey));
app.use(GetMovieRouter())
app.use(NewMovieRouter(publicKey));
app.use(NewSpectaclRouter(publicKey, spectaclService));
app.use(GetSpectaclesRouter(spectaclService));

app.all("*", () => {
    throw new NotFoundError("Route not found");
})

app.use(ErrorHandler);

export { app };