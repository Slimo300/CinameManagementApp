import request from "supertest";
import { Movie, MovieDoc } from "../../models/Movie";
import { ScreeningRoom, ScreeningRoomDoc } from "../../models/ScreengingRoom";
import { Spectacl } from "../../models/Spectacl";

const createMovie = async (): Promise<MovieDoc> => {
    const movie = Movie.build({
        title: "Inception",
        releaseYear: 2010,
        runtime: 5400,
    })
    await movie.save();

    return movie;
}

const createScreeningRoom = async (): Promise<ScreeningRoomDoc> => {
    const screeningRoom = new ScreeningRoom({
        roomNumber: 1,
        rows: 10,
        seats_in_row: 10,
    })
    await screeningRoom.save();

    return screeningRoom;
};

it("returns Unauthorized when user has no token", async () => {

    await request(TestApp)
        .post(`/api/spectacles`)
        .send({
            movieID: "movie.id",
            screeningRoomID: "screeningRoom.id",
            startTime: (new Date()).toISOString(),
        })
        .expect(401);
});

it("returns Unauthorized when user has no admin", async () => {
    const movie = await createMovie();
    const screeningRoom = await createScreeningRoom();

    await request(TestApp)
        .post(`/api/spectacles`)
        .set("Authorization", `Bearer ${Auth(false)}`)
        .send({
            movieID: movie.id,
            screeningRoomID: screeningRoom.id,
            startTime: (new Date()).toISOString(),
        })
        .expect(403);
});

it("returns Bad Request when there is no movieID provieded", async () => {

    await request(TestApp)
        .post(`/api/spectacles`)
        .set("Authorization", `Bearer ${Auth(true)}`)
        .send({
            screeningRoomID: "screeningRoom.id",
            startTime: (new Date()).toISOString(),
        })
        .expect(400);
});

it("returns Bad Request when there is no screeningRoomID provided", async () => {

    await request(TestApp)
        .post(`/api/spectacles`)
        .set("Authorization", `Bearer ${Auth(true)}`)
        .send({
            movieID: "movie.id",
            startTime: (new Date()).toISOString(),
        })
        .expect(400);
});

it("returns Bad Request when there is no startTime provided", async () => {

    await request(TestApp)
        .post(`/api/spectacles`)
        .set("Authorization", `Bearer ${Auth(true)}`)
        .send({
            movieID: "movie.id",
            screeningRoomID: "screeningRoom.id",
        })
        .expect(400);
});

it("returns Bad Request when startTime is not a valid date string", async () => {

    await request(TestApp)
        .post(`/api/spectacles`)
        .set("Authorization", `Bearer ${Auth(true)}`)
        .send({
            movieID: "movie.id",
            screeningRoomID: "screeningRoom.id",
            startTime: "123"
        })
        .expect(400);
});

it("returns Bad Request of there is a spectacl ending during our time frame", async () => {
    const movie = await createMovie();
    const screeningRoom = await createScreeningRoom();

    const spectacl = Spectacl.build({
        movie: movie,
        screeningRoom: screeningRoom,
        startsAt: new Date('2023-09-11T19:30:00.000Z'),
        endsAt: new Date('2023-09-11T21:00:00.000Z')
    })
    await spectacl.save();

    await request(TestApp)
        .post(`/api/spectacles`)
        .set("Authorization", `Bearer ${Auth(true)}`)
        .send({
            movieID: movie.id,
            screeningRoomID: screeningRoom.id,
            startTime: (new Date('2023-09-11T20:00:00.000Z')).toISOString(),
        })
        .expect(409);
});

it("returns Bad Request of there is a spectacl starting during our time frame", async () => {
    const movie = await createMovie();
    const screeningRoom = await createScreeningRoom();

    const spectacl = Spectacl.build({
        movie: movie,
        screeningRoom: screeningRoom,
        startsAt: new Date('2023-09-11T20:30:00.000Z'),
        endsAt: new Date('2023-09-11T22:00:00.000Z')
    })
    await spectacl.save();

    await request(TestApp)
        .post(`/api/spectacles`)
        .set("Authorization", `Bearer ${Auth(true)}`)
        .send({
            movieID: movie.id,
            screeningRoomID: screeningRoom.id,
            startTime: (new Date('2023-09-11T20:00:00.000Z')).toISOString(),
        })
        .expect(409);
});

it("returns Bad Request if there is a spectacl encompassing our time frame", async () => {
    const movie = await createMovie();
    const screeningRoom = await createScreeningRoom();

    const spectacl = Spectacl.build({
        movie: movie,
        screeningRoom: screeningRoom,
        startsAt: new Date('2023-09-11T19:30:00.000Z'),
        endsAt: new Date('2023-09-11T23:22:00.000Z')
    })
    await spectacl.save();

    await request(TestApp)
        .post(`/api/spectacles`)
        .set("Authorization", `Bearer ${Auth(true)}`)
        .send({
            movieID: movie.id,
            screeningRoomID: screeningRoom.id,
            startTime: (new Date('2023-09-11T20:00:00.000Z')).toISOString(),
        })
        .expect(409);
});

it("returns Created when new spectacl is created", async () => {
    const movie = await createMovie();
    const screeningRoom = await createScreeningRoom();

    await request(TestApp)
        .post(`/api/spectacles`)
        .set("Authorization", `Bearer ${Auth(true)}`)
        .send({
            movieID: movie.id,
            screeningRoomID: screeningRoom.id,
            startTime: (new Date()).toISOString(),
        })
        .expect(201);
});

