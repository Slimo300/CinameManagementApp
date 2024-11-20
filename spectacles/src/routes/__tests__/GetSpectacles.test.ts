import request from "supertest";
import { Spectacl } from "../../models/Spectacl";
import { Movie } from "../../models/Movie";
import { ScreeningRoom } from "../../models/ScreengingRoom";

it("throws Bad Request when there is no date in query", async () => {
    await request(TestApp)
        .get("/api/spectacles")
        .expect(400)
});

it("returns an empty array when there are no spectacles for given date", async () => {
    const response = await request(TestApp)
        .get(`/api/spectacles?date=${(new Date().toISOString())}`)
        .expect(200);

    expect(response.body.length).toEqual(0);
})

it("returns spectacles for given date", async () => {

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

    const spectaclOne = Spectacl.build({
        movie: movie,
        screeningRoom: screeningRoom,
        startsAt: new Date(),
        endsAt: new Date()
    })
    await spectaclOne.save();
    
    const spectaclTwo = Spectacl.build({
        movie: movie,
        screeningRoom: screeningRoom,
        startsAt: new Date(),
        endsAt: new Date()
    })
    await spectaclTwo.save();

    const response = await request(TestApp)
        .get(`/api/spectacles?date=${(new Date().toISOString())}`)
        .expect(200);

    expect(response.body.length).toEqual(2);
})