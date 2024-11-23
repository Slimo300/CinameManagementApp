import mongoose from "mongoose";
import { MovieDoc } from "./Movie";
import { ScreeningRoomDoc } from "./ScreengingRoom";

interface SpectaclAttrs {
    movie: MovieDoc;
    screeningRoom: ScreeningRoomDoc;
    startsAt: Date;
    endsAt: Date;
    seatsStatus: {
        [row: string]: {
            [seat: string]: boolean;
        }
    }
}

export interface SpectaclDoc extends mongoose.Document {
    movie: MovieDoc;
    screeningRoom: ScreeningRoomDoc;
    startsAt: Date;
    endsAt: Date;
    seatsStatus: {
        [row: string]: {
            [seat: string]: boolean;
        };
    };
}

interface SpectaclModel extends mongoose.Model<SpectaclDoc> {
    build(attrs: SpectaclAttrs): SpectaclDoc;
}

const spectaclSchema = new mongoose.Schema({
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required: true,
    }, 
    screeningRoom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ScreeningRoom",
        required: true,
    },
    startsAt: {
        type: Date,
        required: true,
    },
    endsAt: {
        type: Date,
        required: true,
    },
    seatsStatus: {
        type: Map,
        of: new mongoose.Schema(
            {
                type: Map,
                of: Boolean,
            },
            { _id: false } // Disable _id for inner schemas
        ),
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

spectaclSchema.statics.build = (attrs: SpectaclAttrs) => {
    return new Spectacl(attrs);
}

const Spectacl = mongoose.model<SpectaclDoc, SpectaclModel>("Spectacl", spectaclSchema);

export { Spectacl };
