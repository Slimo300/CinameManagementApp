import { BadRequestError, NotFoundError } from "@spellcinema/lib";
import express, { Request, Response } from "express";
import { Movie } from "../models/Movie";

export const GetMovieRouter = (): express.Router => {
    const router = express.Router();

    router.get("/api/spectacles/movies", async (req: Request, res: Response) => {
        if (!req.query.title) {
            throw new BadRequestError("\"title\" query parameter must be set");
        }

        const movie = await Movie.findOne({ title: req.query.title });

        if (!movie) {
            throw new NotFoundError();
        }

        res.send(movie);

    });

    return router;
}