import { BadRequestError, ValidateRequest } from "@spellcinema/lib";
import express, { Request, Response } from "express";
import { query } from "express-validator";
import { SpectaclService } from "../services/Spectacles";

export const GetSpectaclesRouter = (): express.Router => {
    const router = express.Router();

    router.get("/api/spectacles",
        query("date").trim().isISO8601().toDate().withMessage("\"date\" must be a valid date"),

        ValidateRequest,
        async (req: Request, res: Response) => {
            
            const { date } = req.query;

            if (!(date instanceof Date)) {
                throw new BadRequestError("\"date\" must be a valid date");
            }

            try {
                const spectacles = await SpectaclService.GetSpectacles(date);
                res.send(spectacles);
            } catch (err) {
                throw err;
            }

        });

    return router;
}