import request from "supertest";
import { Movie, MovieDoc } from "../../models/Movie";
import { ScreeningRoom, ScreeningRoomDoc } from "../../models/ScreengingRoom";
import mongoose from "mongoose";
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
        .put(`/api/spectacles/id`)
        .send({
            movieID: "movie.id",
            screeningRoomID: "screeningRoom.id",
            startTime: (new Date()).toISOString(),
        })
        .expect(401);
});

// it("returns Unauthorized when user has no admin", async () => {

//     await request(TestApp)
//         .put(`/api/spectacles/id`)
//         .set("Authorization", `Bearer ${Auth(false)}`)
//         .send({
//             movieID: "movie.id",
//             screeningRoomID: "screeningRoom.id",
//             startTime: (new Date()).toISOString(),
//         })
//         .expect(403);
// });


// it("returns Bad Request when startTime is not a valid date string", async () => {

//     await request(TestApp)
//         .put(`/api/spectacles/id`)
//         .set("Authorization", `Bearer ${Auth(true)}`)
//         .send({
//             movieID: "movie.id",
//             screeningRoomID: "screeningRoom.id",
//             startTime: "123"
//         })
//         .expect(400);
// });

// it("returns Bad Request if movieID or screeningRoomID is set to blank", async () => {

//     await request(TestApp)
//         .put(`/api/spectacles/id`)
//         .set("Authorization", `Bearer ${Auth(true)}`)
//         .send({
//             movieID: "",
//         })
//         .expect(400);

//     await request(TestApp)
//         .put(`/api/spectacles/id`)
//         .set("Authorization", `Bearer ${Auth(true)}`)
//         .send({
//             screeningRoomID: "",
//         })
//         .expect(400);
// })

// it("returns Bad Request when there is no body", async () => {

//     await request(TestApp)
//         .put(`/api/spectacles/id`)
//         .set("Authorization", `Bearer ${Auth(true)}`)
//         .send({})
//         .expect(400);
// });

// it("returns Bad Request when there is no movie with specified id in database", async () => {

//     const id = new mongoose.Types.ObjectId().toHexString();

//     await request(TestApp)
//         .put(`/api/spectacles/${id}`)
//         .set("Authorization", `Bearer ${Auth(true)}`)
//         .send({
//             movieID: "asd",
//         })
//         .expect(404);

// });

// it("returns Bad Request when there is no movie with specified id in database", async () => {
//     const movie = await createMovie();
//     const screeningRoom = await createScreeningRoom();

//     const spectacl = Spectacl.build({
//         movie, screeningRoom, 
//         startsAt: new Date(),
//         endsAt: new Date(),
//     })
//     await spectacl.save()

//     const id = new mongoose.Types.ObjectId().toHexString();

//     await request(TestApp)
//         .put(`/api/spectacles/${spectacl.id}`)
//         .set("Authorization", `Bearer ${Auth(true)}`)
//         .send({
//             movieID: id,
//         })
//         .expect(400);

// });

// it("returns Bad Request when there is no screeningRoom with specified id in database", async () => {
//     const movie = await createMovie();
//     const screeningRoom = await createScreeningRoom();

//     const spectacl = Spectacl.build({
//         movie, screeningRoom, 
//         startsAt: new Date(),
//         endsAt: new Date(),
//     });
    
//     await spectacl.save();

//     const id = new mongoose.Types.ObjectId().toHexString();

//     await request(TestApp)
//         .put(`/api/spectacles/${spectacl.id}`)
//         .set("Authorization", `Bearer ${Auth(true)}`)
//         .send({
//             screeningRoomID: id,
//         })
//         .expect(400);

// });

// it("returns Conflict if there is a spectacl ending during our time frame", async () => {
//     const movie = await createMovie();
//     const screeningRoom = await createScreeningRoom();

//     const spectacl = Spectacl.build({
//         movie: movie,
//         screeningRoom: screeningRoom,
//         startsAt: new Date('2023-09-11T19:30:00.000Z'),
//         endsAt: new Date('2023-09-11T21:00:00.000Z')
//     })
//     await spectacl.save();

//     const updatedSpectacl = Spectacl.build({
//         movie: movie,
//         screeningRoom: screeningRoom,
//         startsAt: new Date('2023-09-11T16:00:00.000Z'),
//         endsAt: new Date('2023-09-11T17:30:00.000Z')
//     })
//     await updatedSpectacl.save();

//     await request(TestApp)
//         .put(`/api/spectacles/${updatedSpectacl.id}`)
//         .set("Authorization", `Bearer ${Auth(true)}`)
//         .send({
//             movieID: movie.id,
//             screeningRoomID: screeningRoom.id,
//             startTime: (new Date('2023-09-11T20:00:00.000Z')).toISOString(),
//         })
//         .expect(409);
// });

// it("returns Conflict if there is a spectacl starting during our time frame", async () => {
//     const movie = await createMovie();
//     const screeningRoom = await createScreeningRoom();

//     const spectacl = Spectacl.build({
//         movie: movie,
//         screeningRoom: screeningRoom,
//         startsAt: new Date('2023-09-11T20:30:00.000Z'),
//         endsAt: new Date('2023-09-11T22:00:00.000Z')
//     })
//     await spectacl.save();

//     const updatedSpectacl = Spectacl.build({
//         movie: movie,
//         screeningRoom: screeningRoom,
//         startsAt: new Date('2023-09-11T16:00:00.000Z'),
//         endsAt: new Date('2023-09-11T17:30:00.000Z')
//     })
//     await updatedSpectacl.save();

//     await request(TestApp)
//         .put(`/api/spectacles/${updatedSpectacl.id}`)
//         .set("Authorization", `Bearer ${Auth(true)}`)
//         .send({
//             movieID: movie.id,
//             screeningRoomID: screeningRoom.id,
//             startTime: (new Date('2023-09-11T20:00:00.000Z')).toISOString(),
//         })
//         .expect(409);
// });


// it("returns Conflict if there is a spectacl encompassing our time frame", async () => {
//     const movie = await createMovie();
//     const screeningRoom = await createScreeningRoom();

//     const spectacl = Spectacl.build({
//         movie: movie,
//         screeningRoom: screeningRoom,
//         startsAt: new Date('2023-09-11T19:30:00.000Z'),
//         endsAt: new Date('2023-09-11T22:00:00.000Z')
//     })
//     await spectacl.save();

//     const updatedSpectacl = Spectacl.build({
//         movie: movie,
//         screeningRoom: screeningRoom,
//         startsAt: new Date('2023-09-11T16:00:00.000Z'),
//         endsAt: new Date('2023-09-11T17:30:00.000Z')
//     })
//     await updatedSpectacl.save();

//     await request(TestApp)
//         .put(`/api/spectacles/${updatedSpectacl.id}`)
//         .set("Authorization", `Bearer ${Auth(true)}`)
//         .send({
//             movieID: movie.id,
//             screeningRoomID: screeningRoom.id,
//             startTime: (new Date('2023-09-11T20:00:00.000Z')).toISOString(),
//         })
//         .expect(409);
// });


// it("returns OK if spectacl is updated successfully", async () => {
//     const movie = await createMovie();
//     const screeningRoom = await createScreeningRoom();

//     const updatedSpectacl = Spectacl.build({
//         movie: movie,
//         screeningRoom: screeningRoom,
//         startsAt: new Date('2023-09-11T16:00:00.000Z'),
//         endsAt: new Date('2023-09-11T17:30:00.000Z')
//     })
//     await updatedSpectacl.save();

//     await request(TestApp)
//         .put(`/api/spectacles/${updatedSpectacl.id}`)
//         .set("Authorization", `Bearer ${Auth(true)}`)
//         .send({
//             movieID: movie.id,
//             screeningRoomID: screeningRoom.id,
//             startTime: (new Date('2023-09-11T20:00:00.000Z')).toISOString(),
//         })
//         .expect(200);
// });