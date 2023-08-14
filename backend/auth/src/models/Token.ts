import mongoose from "mongoose";

interface TokenAttrs {
    userID: mongoose.Schema.Types.ObjectId;
}

interface TokenDoc extends mongoose.Document {
    userID: mongoose.Schema.Types.ObjectId;
}

interface TokenModel extends mongoose.Model<TokenDoc> {
    build(attrs: TokenAttrs): TokenDoc;
}

const tokenSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

tokenSchema.statics.build = (attrs: TokenAttrs) => {
    return new Token(attrs);
}

const Token = mongoose.model<TokenDoc, TokenModel>("Token", tokenSchema);

export { Token };

