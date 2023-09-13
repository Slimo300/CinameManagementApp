import express, { Request, Response } from "express";
import { body } from "express-validator";

import { BadRequestError, RequireAdmin, ValidateRequest } from "@spellcinema/lib";

import { SpectaclService } from "../services/Spectacles";

export const UpdateSpectaclRouter = (publicKey: string): express.Router => {
    const router = express.Router();

    router.put("/api/spectacles/:id", 
        RequireAdmin(publicKey),

        body("movieID").optional().not().isEmpty().withMessage("movieID must be set"),
        body("screeningRoomID").optional().not().isEmpty().withMessage("screeningRoomID must be set"),
        body("startTime").optional().isISO8601().toDate().withMessage("startTime must be a valid Date"),

        ValidateRequest,
        async (req: Request, res: Response) => {
            const { movieID, screeningRoomID, startTime } = req.body;
            
            const { id } = req.params;
            
            if (!movieID && !screeningRoomID && !startTime) {
                throw new BadRequestError("No attribute specified for change");
            }

            try {
                const spectacl = await SpectaclService.UpdateSpectacl(id, {
                    movieID, screeningRoomID, startTime
                });

                res.send(spectacl);
            } catch( err ) {
                throw err;
            }

        }
    );

    return router;
}