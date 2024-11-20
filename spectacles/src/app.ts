import express from "express";
import { json } from "body-parser";
import "express-async-errors";

import { NotFoundError, errorHandler } from "@spellcinema/lib";
import { NewMovieRouter } from "./routes/NewMovie";
import { GetMovieRouter } from "./routes/GetMovie";
import { GetScreeningRoomsRouter } from "./routes/GetScreeningRooms";
import { NewSpectaclRouter } from "./routes/NewSpectacl";
import { GetSpectaclesRouter } from "./routes/GetSpectacles";
import { DeleteSpectaclRouter } from "./routes/DeleteSpectacl";
import { UpdateSpectaclRouter } from "./routes/UpdateSpectacl";
import { GetSpectaclByIdRouter } from "./routes/GetSpectaclById";

export const NewApp = (publicKey: string): express.Application => {

    const app = express();

    app.set("trust proxy", true);
    app.use(json());
    
    app.use(DeleteSpectaclRouter(publicKey));
    app.use(GetScreeningRoomsRouter(publicKey));
    app.use(GetMovieRouter())
    app.use(GetSpectaclByIdRouter());

    app.use(GetSpectaclesRouter());
    app.use(NewMovieRouter(publicKey));
    app.use(NewSpectaclRouter(publicKey));
    app.use(UpdateSpectaclRouter(publicKey));
    
    app.all("*", () => {
        throw new NotFoundError();
    })
    
    app.use(errorHandler);
    
    
    return app;
}
