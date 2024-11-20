import mongoose from "mongoose";

export interface ScreeningRoomDoc extends mongoose.Document {
    roomNumber: number;
    rows: number;
    seats_in_row: number;
}

interface ScreeningRoomModel extends mongoose.Model<ScreeningRoomDoc> {}

const screeningRoomSchema = new mongoose.Schema({
    roomNumber: {
        type: Number,
        required: true,
    },
    rows: {
        type: Number,
        required: true,
    },
    seats_in_row: {
        type: Number,
        required: true,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v
        }
    }
});

const ScreeningRoom = mongoose.model<ScreeningRoomDoc, ScreeningRoomModel>("ScreeningRoom", screeningRoomSchema);

export { ScreeningRoom };
