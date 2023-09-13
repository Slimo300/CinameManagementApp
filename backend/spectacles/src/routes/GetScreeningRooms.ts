import express, { Request, Response } from "express";
import { ScreeningRoom } from "../models/ScreengingRoom";
import { RequireAdmin } from "@spellcinema/lib";

export const GetScreeningRoomsRouter = (publicKey: string): express.Router => {
    const router = express.Router();

    router.get("/api/spectacles/screening-rooms", RequireAdmin(publicKey), async (req: Request, res: Response) => {
        const screeningRooms = await ScreeningRoom.find();

        res.send(screeningRooms);
    });

    return router;
}