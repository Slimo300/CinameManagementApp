import express from "express";
import { json } from "body-parser";
import cookieParser from "cookie-parser";
import "express-async-errors";

import { NotFoundError, errorHandler } from "@spellcinema/lib";
import { NewMovieRouter } from "./routes/new-movie";
import { GetMovieRouter } from "./routes/get-movie";
import { GetScreeningRoomsRouter } from "./routes/get-screening-rooms";
import { NewSpectaclRouter } from "./routes/new-spectacl";
import { GetSpectaclesRouter } from "./routes/get-spectacles";
import { DeleteSpectaclRouter } from "./routes/delete-spectacl";
import { UpdateSpectaclRouter } from "./routes/update-spectacl";
import { GetSpectaclByIdRouter } from "./routes/get-spectacl-by-id";
import { SearchMovieRouter } from "./routes/search-movie";

export const NewApp = (publicKey: string): express.Application => {

    const app = express();

    app.set("trust proxy", true);
    app.use(json());
    app.use(cookieParser());

    app.use(DeleteSpectaclRouter(publicKey));
    app.use(GetScreeningRoomsRouter(publicKey));
    app.use(GetMovieRouter())
    app.use(GetSpectaclByIdRouter());

    app.use(GetSpectaclesRouter());
    app.use(NewMovieRouter(publicKey));
    app.use(NewSpectaclRouter(publicKey));
    app.use(UpdateSpectaclRouter(publicKey));
    app.use(SearchMovieRouter(publicKey));
    
    app.all("*", () => {
        throw new NotFoundError();
    })
    
    app.use(errorHandler);
    
    
    return app;
}
