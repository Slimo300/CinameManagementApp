import mongoose from "mongoose";

interface MovieAttrs {
    title: String;
    releaseYear: Number;
    runtime: Number;
    pictureUri?: String;
    genres?: String[];
}

export interface MovieDoc extends mongoose.Document {
    title: String;
    releaseYear: Number;
    runtime: Number;
    pictureUri?: String;
    genres?: String[];
}

interface MovieModel extends mongoose.Model<MovieDoc> {
    build(attrs: MovieAttrs): MovieDoc;
}

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    releaseYear: {
        type: Number,
        required: true,
    },
    runtime: {
        type: Number,
        required: true,
    },
    pictureUri: {
        type: String,
        required: false,
    },
    genres: [{
        type: String,
    }]
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v
        }
    }
});

movieSchema.statics.build = (attrs: MovieAttrs) => {
    return new Movie(attrs);
}

const Movie = mongoose.model<MovieDoc, MovieModel>("Movie", movieSchema);

export { Movie };
