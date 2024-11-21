import express, { Request, Response } from "express";

import { requireAuth, requireAdmin } from "@spellcinema/lib";

import { SpectaclService } from "../services/Spectacles";

export const DeleteSpectaclRouter = (publicKey: string): express.Router => {
    const router = express.Router();

    router.delete("/api/spectacles/:id",
        requireAuth(publicKey), requireAdmin),
        async (req: Request, res: Response) => {
            const { id } = req.params;
            try {
                const spectacl = await SpectaclService.DeleteSpectacl(id);
                res.send(spectacl);
            } catch ( err ) {
                throw err;
            }
        };

    return router;
}