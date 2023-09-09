import express, { Request, Response } from "express";
import { Spectacl } from "../models/Spectacl";
import { BadRequestError, ForbiddenError, NotFoundError } from "@spellcinema/lib";
import { ScreeningRoom } from "../models/ScreengingRoom";
import { Movie } from "../models/Movie";

export const NewSpectaclRouter = (): express.Router => {
    const router = express.Router();

    router.post("/api/spectacles", async (req: Request, res: Response) => {

        const { movieID, screeningRoomID, startTime, endTime } = req.body;

        const spectaclBefore = await Spectacl.findOne({
            screeningRoom: screeningRoomID,
            endsAt: {
                $gte: startTime, $lte: endTime
            }
        })

        if (spectaclBefore) {
            throw new ForbiddenError(`There is already a spectacl in ${spectaclBefore.screeningRoom.roomNumber} starting at ${spectaclBefore.startsAt} ending ${spectaclBefore.endsAt}`);
        }

        const spectaclAfter = await Spectacl.findOne({
            screeningRoom: screeningRoomID,
            startsAt: {
                $gte: startTime, $lte: endTime
            }
        })

        if (spectaclAfter) {
            throw new ForbiddenError(`There is already a spectacl in ${spectaclAfter.screeningRoom.roomNumber} starting at ${spectaclAfter.startsAt} ending ${spectaclAfter.endsAt}`);
        }

        const screeningRoom = await ScreeningRoom.findById(screeningRoomID);
        if (!screeningRoom) throw new BadRequestError(`Screening room with id ${screeningRoomID} not found`);
        const movie = await Movie.findById(movieID);
        if (!movie) throw new BadRequestError(`Movie with id ${movieID} not found`);

        const spectacl = Spectacl.build({
            movie: movie,
            screeningRoom: screeningRoom,
            startsAt: new Date(startTime),
            endsAt: new Date(endTime),
        })
        await spectacl.save()

        res.status(201).send({msg: "ok"});
    });

    return router;
}