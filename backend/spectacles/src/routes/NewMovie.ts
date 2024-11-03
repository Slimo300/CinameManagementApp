import { BadRequestError, requireAdmin, requireAuth, validateRequest } from "@spellcinema/lib";
import express, { Request, Response } from "express";

import { body } from "express-validator";
import { Movie } from "../models/Movie";

export const NewMovieRouter = (publicKey: string): express.Router => {
    let router = express.Router();

    router.post("/api/spectacles/movies",
        requireAuth(publicKey), requireAdmin,

        body("title").not().isEmpty().withMessage("title field cannot be empty"),
        body("releaseYear").isInt({ min: 1900, max: 2030 }).withMessage("releaseYear field is not a valid year"),
        body("runtime").isInt({ min: 0 }).withMessage("runtime field cmust be an integer value larger than 0"),

        validateRequest,
        async (req: Request, res: Response) => {
            const { title, releaseYear, runtime, pictureUri, genres } = req.body;

            const existingMovie = await Movie.findOne({ title, releaseYear, runtime})

            if (existingMovie) {
                throw new BadRequestError("Movie with the same title, releaseYear and runtime already in database");
            }

            const movie = Movie.build({
                title, releaseYear, runtime, pictureUri, genres 
            })

            await movie.save();

            res.status(201).send(movie);
        })

    return router;
};
