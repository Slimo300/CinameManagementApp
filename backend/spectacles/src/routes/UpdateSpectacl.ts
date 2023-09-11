import { BadRequestError, NotFoundError, RequireAdmin, RequireAuth, ValidateRequest } from "@spellcinema/lib";
import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import { Spectacl } from "../models/Spectacl";
import { Movie } from "../models/Movie";
import { ScreeningRoom } from "../models/ScreengingRoom";
import { SpectaclService } from "../services/Spectacles";

export const UpdateSpectaclRouter = (publicKey: string, SpectaclService: SpectaclService): express.Router => {
    const router = express.Router();

    router.put("/api/spectacles/:id", 
        RequireAdmin(publicKey),

        body("movieID").optional().not().isEmpty().withMessage("movieID must be set"),
        body("screeningRoomID").optional().not().isEmpty().withMessage("screeningRoomID must be set"),
        body("startTime").optional().isISO8601().toDate().withMessage("startTime must be a valid Date"),

        param("id").trim().not().isEmpty().withMessage("\"id\" param cannot be blank"),

        ValidateRequest,
        async (req: Request, res: Response) => {
            const { movieID, screeningRoomID, startTime } = req.body;

            const { id } = req.params;
            
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