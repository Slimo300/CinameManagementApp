import mongoose from "mongoose";

export interface ScreeningRoomDoc extends mongoose.Document {
    roomNumber: number;
    name: string;
    rows: {
        [key: string]: {
            seats: string[];
        };
    };
    passages: number[];
}

interface ScreeningRoomModel extends mongoose.Model<ScreeningRoomDoc> {}

const screeningRoomSchema = new mongoose.Schema(
    {
        roomNumber: {
            type: Number,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        rows: {
            type: Map,
            of: new mongoose.Schema(
                {
                    seats: {
                        type: [String],
                        required: true,
                    },
                },
                { _id: false } // Disables the creation of a nested _id field in the subdocument
            ),
            required: true,
        },
        passages: {
            type: [Number],
            required: true,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);

const ScreeningRoom = mongoose.model<ScreeningRoomDoc, ScreeningRoomModel>("ScreeningRoom", screeningRoomSchema);

export { ScreeningRoom };
