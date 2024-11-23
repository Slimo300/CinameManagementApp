import { startOfDay, endOfDay } from "date-fns";

import { BadRequestError, NotFoundError, ConflictError } from "@spellcinema/lib";

import { Movie } from "../models/Movie";
import { ScreeningRoom } from "../models/ScreengingRoom";
import { Spectacl, SpectaclDoc } from "../models/Spectacl";

interface SpectaclAttrs {
    movieID: string;
    screeningRoomID: string;
    startTime: Date;
}

export class SpectaclService {
    
    public static async NewSpectacl(attrs: SpectaclAttrs): Promise<SpectaclDoc> {
        const movie = await Movie.findById(attrs.movieID);
        if (!movie) {
            throw new BadRequestError(`No movie with ID ${attrs.movieID}`);
        }
        console.log("Movie found...")

        const screeningRoom = await ScreeningRoom.findById(attrs.screeningRoomID);
        if (!screeningRoom) {
            throw new BadRequestError(`No screening room witg ID ${attrs.screeningRoomID}`);
        }
        console.log("ScreeningRoom found...")
        const endTime = new Date(attrs.startTime.getTime());
        endTime.setSeconds(endTime.getSeconds() + movie.runtime.valueOf());

        await SpectaclService.CheckScreeningRoomAvailabilty(attrs.screeningRoomID, attrs.startTime, endTime);
        console.log("ScreeningRoom availability checked...")

        const seatsStatus: Record<string, Record<string, boolean>> = {};

        for (const [row, data] of Object.entries(screeningRoom.rows)) {
            seatsStatus[row] = {};
            data.seats.forEach((seat: string) => {
                seatsStatus[row][seat] = false;
            });
        }

        console.log("status of seats established...")
    
        // Creating a spectacl
        const spectacl = Spectacl.build({
            movie: movie,
            screeningRoom: screeningRoom,
            startsAt: attrs.startTime,
            endsAt: endTime,
            seatsStatus: seatsStatus
        })
        console.log("spectacl built: ", spectacl);
        await spectacl.save();

        return spectacl;
    } 

    public static async DeleteSpectacl(ID: string): Promise<SpectaclDoc> {
        const spectacl = await Spectacl.findByIdAndDelete(ID);
        if (!spectacl) throw new NotFoundError();

        return spectacl;
    }

    public static async GetSpectaclByID(ID: string): Promise<SpectaclDoc> {
        const spectacl = await Spectacl.findById(ID);
        if (!spectacl) throw new NotFoundError();

        return spectacl;
    }

    public static async GetSpectacles(date: Date): Promise<SpectaclDoc[]> {
        
        const spectacles = await Spectacl.find({
            startsAt: { $gte: startOfDay(date), $lte: endOfDay(date) }
        }).populate(["movie", "screeningRoom"]);

        return spectacles;
    }

    public static async UpdateSpectacl(ID: string, attrs: SpectaclAttrs): Promise<SpectaclDoc> {
        const spectacl = await Spectacl.findById(ID).populate("movie");
        if (!spectacl) {
            throw new NotFoundError();
        } 

        if (attrs.movieID) {

            const movie = await Movie.findById(attrs.movieID);
            if (movie) {
                spectacl.movie = movie;
            }
            else {
                throw new BadRequestError(`No movie with id ${attrs.movieID}`);
            }
        }

        if (attrs.screeningRoomID) {
            const screeningRoom = await ScreeningRoom.findById(attrs.screeningRoomID);
            if (screeningRoom) {
                spectacl.screeningRoom = screeningRoom;
            } else {
                throw new BadRequestError(`No screening room with id ${attrs.screeningRoomID}`);
            }
        }

        if (attrs.startTime) {
            const endTime = new Date(attrs.startTime.getTime());
            endTime.setSeconds(endTime.getSeconds() + spectacl.movie.runtime.valueOf());

            try {
                await SpectaclService.CheckScreeningRoomAvailabilty(attrs.screeningRoomID, attrs.startTime, endTime, ID);
            } catch (err) {
                throw err;
            }

            spectacl.startsAt = attrs.startTime;
            spectacl.endsAt = endTime;
        }

        await spectacl.save();

        return spectacl;
    }

    private static async CheckScreeningRoomAvailabilty(screeningRoomID: string, startTime: Date, endTime: Date, spectaclID?: string): Promise<boolean> {
        const conflictingSpectacl = await Spectacl.findOne({
            _id: {
                $ne: spectaclID
            },
            screeningRoom: screeningRoomID,
            $or: [
                {
                    endsAt: {
                        $gte: startTime,
                        $lte: endTime
                    }
                },
                {
                    startsAt: {
                        $gte: startTime,
                        $lte: endTime
                    }
                },
                {
                    startsAt: {
                        $lte: startTime
                    },
                    endsAt: {
                        $gte: endTime
                    }
                }
            ]
        });
        if (conflictingSpectacl) {
            throw new ConflictError(`There is already a spectacl in Screening Room number ${screeningRoomID} starting at ${conflictingSpectacl.startsAt} ending ${conflictingSpectacl.endsAt}`)
        }
        return true;
    }
};