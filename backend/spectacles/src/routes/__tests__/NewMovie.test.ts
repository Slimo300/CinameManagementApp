import request from "supertest";
import { Movie } from "../../models/Movie";

it("returns Unauthorized when user has no token", async () => {

    await request(TestApp)
        .post(`/api/spectacles/movies`)
        .send({
            title: "Inception",
            releaseYear: 2010,
            runtime: 100,
        })
        .expect(401);
});

it("returns Unauthorized when user has no admin", async () => {
    await request(TestApp)
        .post(`/api/spectacles/movies`)
        .set("Authorization", `Bearer ${Auth(false)}`)
        .send({
            title: "Inception",
            releaseYear: 2010,
            runtime: 100,
        })
        .expect(403);
});


it("returns Bad Request when title is not set", async () => {
    await request(TestApp)
        .post(`/api/spectacles/movies`)
        .set("Authorization", `Bearer ${Auth(true)}`)
        .send({
            releaseYear: 2010,
            runtime: 100,
        })
        .expect(400);
});


it("returns Bad Request when releaseYear is not set", async () => {
    await request(TestApp)
        .post(`/api/spectacles/movies`)
        .set("Authorization", `Bearer ${Auth(true)}`)
        .send({
            title: "Inception",
            runtime: 100,
        })
        .expect(400);
});


it("returns Bad Request when runtime is not set", async () => {
    await request(TestApp)
        .post(`/api/spectacles/movies`)
        .set("Authorization", `Bearer ${Auth(true)}`)
        .send({
            title: "Inception",
            releaseYear: 2010,
        })
        .expect(400);
});

it("returns Bad Request when runtime is smaller than 0", async () => {
    await request(TestApp)
        .post(`/api/spectacles/movies`)
        .set("Authorization", `Bearer ${Auth(true)}`)
        .send({
            title: "Inception",
            runtime: -1,
        })
        .expect(400);
});

it("returns Bad Request when releaseYear is smaller than 1900", async () => {
    await request(TestApp)
        .post(`/api/spectacles/movies`)
        .set("Authorization", `Bearer ${Auth(true)}`)
        .send({
            title: "Inception",
            releaseYear: 1900,
        })
        .expect(400);
});

it("returns Bad Request when movie with the same data is already in database", async () => {
    const movie = Movie.build({
        title: "Inception",
        releaseYear: 2010,
        runtime: 100,
    });
    await movie.save();

    await request(TestApp)
        .post(`/api/spectacles/movies`)
        .set("Authorization", `Bearer ${Auth(true)}`)
        .send({
            title: "Inception",
            releaseYear: 2010,
            runtime: 100,
        })
        .expect(400);
});

it("returns Created when movie is saved", async () => {

    await request(TestApp)
        .post(`/api/spectacles/movies`)
        .set("Authorization", `Bearer ${Auth(true)}`)
        .send({
            title: "Inception",
            releaseYear: 2010,
            runtime: 101,
        })
        .expect(201);

});
