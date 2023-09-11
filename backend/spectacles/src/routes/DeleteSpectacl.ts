import express, { Request, Response } from "express";
import { param } from "express-validator";

import { RequireAdmin, ValidateRequest } from "@spellcinema/lib";

import { SpectaclService } from "../services/Spectacles";

export const DeleteSpectaclRouter = (publicKey: string, SpectaclService: SpectaclService): express.Router => {
    const router = express.Router();

    router.delete("/api/spectacles/:id",
        RequireAdmin(publicKey),

        param("id").trim().not().isEmpty().withMessage("\"id\" param cannot be blank"),
        ValidateRequest, 
        async (req: Request, res: Response) => {
            const { id } = req.params;

            try {
                const spectacl = await SpectaclService.DeleteSpectacl(id);

                res.send(spectacl);
            } catch ( err ) {
                throw err;
            }
        });

    return router;
}