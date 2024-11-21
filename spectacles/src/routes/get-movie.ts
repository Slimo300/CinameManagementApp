import { NotFoundError, validateRequest } from "@spellcinema/lib";
import express, { Request, Response } from "express";
import { Movie } from "../models/Movie";
import { query } from "express-validator";

export const GetMovieRouter = (): express.Router => {
    const router = express.Router();

    router.get("/api/spectacles/movies", 
        query("title").not().isEmpty().withMessage("\"title\" query parameter must be set"),
        validateRequest,
        async (req: Request, res: Response) => {
            const movie = await Movie.findOne({ title: req.query.title });
            if (!movie) {
                throw new NotFoundError();
            }
            res.send(movie);
    });

    return router;
}