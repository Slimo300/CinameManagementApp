import express, { Request, Response } from "express";

import { SpectaclService } from "../services/Spectacles";

export const GetSpectaclByIdRouter = (): express.Router => {
    const router = express.Router();

    router.get("/api/spectacles/:id",
        async (req: Request, res: Response) => {

            const { id } = req.params

            try {
                const spectacl = await SpectaclService.GetSpectaclByID(id);
                res.send(spectacl)
            } catch ( err ) {
                throw err;
            }

    });

    return router;
}