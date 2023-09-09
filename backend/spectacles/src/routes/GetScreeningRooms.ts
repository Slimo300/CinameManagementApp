import express, { Request, Response } from "express";
import { ScreeningRoom } from "../models/ScreengingRoom";
import { RequireAdmin } from "@spellcinema/lib";

export const GetScreeningRoomRouter = (): express.Router => {
    const router = express.Router();

    router.get("/api/spectacles/screening-rooms", RequireAdmin, async (req: Request, res: Response) => {
        const screeningRooms = await ScreeningRoom.find();

        res.send(screeningRooms);
    });

    return router;
}