import express, { Request, Response } from "express";
import { query } from "express-validator";
import axios from "axios";

import { NotFoundError, requireAdmin, requireAuth, validateRequest } from "@spellcinema/lib";

interface SearchMovieResponse {
    id: string
    titleText: { text: string }
    primaryImage: { url: string }
    runtime: { seconds: number }
    genres: { genres: { text: string; }[]; }
    releaseYear: { year: number; }
}

export const SearchMovieRouter = (publicKey: string): express.Router => {
    const router = express.Router();

    router.get("/api/spectacles/movie/search", 
        query("title").not().isEmpty().withMessage("\"title\" query parameter must be set"),
        requireAuth(publicKey), 
        requireAdmin, 
        validateRequest,
        async (req: Request, res: Response) => {
            try {
                console.log("sending request to API...")
                const response = await axios.request({
                    method: 'GET',
                    url: 'https://moviesdatabase.p.rapidapi.com/titles/search/title/'+req.query.title,
                    params: {
                        titleType: 'movie',
                        info: "base_info",
                        exact: true,
                        limit: 10,
                    },
                    headers: {
                        'X-RapidAPI-Key': "c481261021msh52b49b0cd0a8722p167dddjsn34add59cb717",
                        'X-RapidAPI-Host': "moviesdatabase.p.rapidapi.com",
                    }
                });

                console.log("Mapping results to response...")
                const results = response.data.results.map((item: SearchMovieResponse) => { return {
                    id: item.id,
                    title: item.titleText.text,
                    pictureUrl: item.primaryImage.url,
                    runtime: item.runtime.seconds,
                    genres: item.genres.genres.map((g: { text: string; }) => { return g.text }),
                    releaseYear: item.releaseYear.year
                }}) 
                res.send({ results });
            } catch (error) {
                console.error(error);
                throw new NotFoundError()
            }
    });

    return router;
}