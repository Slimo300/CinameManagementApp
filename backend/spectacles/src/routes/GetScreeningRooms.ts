import express, { Request, Response } from "express";
import { ScreeningRoom } from "../models/ScreengingRoom";
import { requireAdmin, requireAuth } from "@spellcinema/lib";

export const GetScreeningRoomsRouter = (publicKey: string): express.Router => {
    const router = express.Router();

    router.get("/api/spectacles/screening-rooms", requireAuth(publicKey), requireAdmin, async (req: Request, res: Response) => {
        const screeningRooms = await ScreeningRoom.find();

        res.send(screeningRooms);
    });

    return router;
}