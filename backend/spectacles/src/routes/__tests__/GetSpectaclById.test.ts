import mongoose from "mongoose";
import request from "supertest";
import { Movie } from "../../models/Movie";
import { ScreeningRoom } from "../../models/ScreengingRoom";
import { Spectacl } from "../../models/Spectacl";

it("throws not found error if there is no spectacl with given id", async () => {

    const id = new mongoose.Types.ObjectId();

    await request(TestApp)
        .get(`/api/spectacles/${id}`)
        .expect(404);
})

it("returns a spectacl", async () => {

    const movie = Movie.build({
        title: "Inception",
        releaseYear: 2010,
        runtime: 5400
    });
    await movie.save();

    const screeningRoom = new ScreeningRoom({
        roomNumber: 1,
        rows: 10,
        seats_in_row: 10
    });
    await screeningRoom.save();

    const spectacl = Spectacl.build({
        movie: movie,
        screeningRoom: screeningRoom,
        startsAt: new Date(),
        endsAt: new Date(),
    });
    await spectacl.save();

    await request(TestApp)
        .get(`/api/spectacles/${spectacl.id}`)
        .expect(200);
})