import request from "supertest";
import mongoose from "mongoose";
import { ScreeningRoom } from "../../models/ScreengingRoom";
import { Movie } from "../../models/Movie";
import { Spectacl } from "../../models/Spectacl";

it("returns Unauthorized when user has no token", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(TestApp)
        .delete(`/api/spectacles/${id}`)
        .expect(401);
});

it("returns Unauthorized when user has no admin", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(TestApp)
        .delete(`/api/spectacles/${id}`)
        .set("Authorization", `Bearer ${Auth(false)}`)
        .expect(403);
});

it("returns Not Found when there is no Spctacl with given ID", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(TestApp)
        .delete(`/api/spectacles/${id}`)
        .set("Authorization", `Bearer ${Auth(true)}`)
        .expect(404);
});

it("deletes spectacl with given id", async () => {

    const movie = Movie.build({
        title: "Inception",
        releaseYear: 2010,
        runtime: 100
    })

    const screeningRoom = new ScreeningRoom({
        roomNumber: 1,
        rows: 10,
        seats_in_row: 10,
    })

    const spectacl = Spectacl.build({
        movie: movie,
        screeningRoom: screeningRoom,
        startsAt: new Date(),
        endsAt: new Date()
    })
    await spectacl.save();

    await request(TestApp)
        .delete(`/api/spectacles/${spectacl.id}`)
        .set("Authorization", `Bearer ${Auth(true)}`)
        .expect(200);
});