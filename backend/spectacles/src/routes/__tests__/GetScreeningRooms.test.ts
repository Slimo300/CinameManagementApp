import request from "supertest";
import { ScreeningRoom, ScreeningRoomDoc } from "../../models/ScreengingRoom";

const createScreeningRoom = async (): Promise<ScreeningRoomDoc> => {
    const screeningRoom = new ScreeningRoom({
        roomNumber: 1,
        seats_in_row: 10,
        rows: 10,
    })
    await screeningRoom.save();

    return screeningRoom;
}

it("throws an unauthorized error if user has no jwt", async () => {
    await request(TestApp)
        .get("/api/spectacles/screening-rooms")
        .expect(401);
});

it("returns screening rooms with 200 status", async () => {

    await createScreeningRoom();
    await createScreeningRoom();

    const response = await request(TestApp)
        .get("/api/spectacles/screening-rooms")
        .set("Authorization", `Bearer ${global.Auth(true)}`)
        .expect(200);

    expect(response.body.length).toEqual(2);
})