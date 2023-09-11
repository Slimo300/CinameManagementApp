import { NotFoundError, ValidateRequest } from "@spellcinema/lib";
import express, { Request, Response } from "express";
import { Movie } from "../models/Movie";
import { query } from "express-validator";

export const GetMovieRouter = (): express.Router => {
    const router = express.Router();

    router.get("/api/spectacles/movies", 
        query("title").not().isEmpty().withMessage("\"title\" query parameter must be set"),
        ValidateRequest,
        async (req: Request, res: Response) => {

            const movie = await Movie.findOne({ title: req.query.title });

            if (!movie) {
                throw new NotFoundError(`No movie with title ${req.query.title}`);
            }

            res.send(movie);

    });

    return router;
}