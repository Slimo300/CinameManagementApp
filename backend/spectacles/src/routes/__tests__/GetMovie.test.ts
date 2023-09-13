import request from "supertest";
import { Movie } from "../../models/Movie";

it("returns Bad Request if query \"title\" is not provided", async () => {
    await request(TestApp)
        .get("/api/spectacles/movies?")
        .expect(400);
})

it("returns Not Found if movie is not in database", async () => {
    await request(TestApp)
        .get("/api/spectacles/movies?title=Inception")
        .expect(404);
});

it("returns a movie if it is found", async () => {

    const movie = Movie.build({
        title: "Inception",
        runtime: 100,
        releaseYear: 2010,
    })
    await movie.save();

    await request(TestApp)
        .get("/api/spectacles/movies?title=Inception")
        .expect(200);
});