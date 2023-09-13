import express, { Request, Response } from "express";
import { body } from "express-validator";

import { BadRequestError, RequireAdmin, ValidateRequest } from "@spellcinema/lib";

import { SpectaclService } from "../services/Spectacles";

export const NewSpectaclRouter = (publicKey: string): express.Router => {
    const router = express.Router();

    router.post("/api/spectacles",
        RequireAdmin(publicKey),
    
        body("movieID").not().isEmpty().withMessage("movieID must be set"),
        body("screeningRoomID").not().isEmpty().withMessage("screeningRoomID must be set"),
        body("startTime").isISO8601().toDate().withMessage("startTime must be a valid Date"),
        ValidateRequest,
            
        async (req: Request, res: Response) => {

            const { movieID, screeningRoomID, startTime } = req.body;

            if (!(startTime instanceof Date)) {
                throw new BadRequestError("startTime must be valid dates");
            }

            let spectacl;
            try {
                spectacl = await SpectaclService.NewSpectacl({
                    movieID, screeningRoomID, startTime
                })
            } catch (err) {
                throw err;
            }

            res.status(201).send(spectacl);
        });

    return router;
}