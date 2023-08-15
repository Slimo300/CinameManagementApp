import mongoose from "mongoose";

import { app, redisClient } from "./app";


const start = async () => {

    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY not defined");
    }
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI not defined");
    }
    if (!process.env.REDIS_URI) {
        throw new Error("REDIS_URI not defined");
    }
    if (!process.env.DOMAIN) {
        throw new Error("DOMAIN not defined");
    }
    if (!process.env.REFRESH_DURATION) {
        throw new Error("REFRESH_DURATION not defined");
    }
    if (!process.env.ACCESS_DURATION) {
        throw new Error("ACCESS_DURATION not defined");
    }

    try {
        parseInt(process.env.REFRESH_DURATION);
        parseInt(process.env.ACCESS_DURATION);
    } catch(err) {
        console.log(err);
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            autoIndex: true,
            autoCreate: true
        });

        await redisClient.connect();
    } catch(err) {
        console.log(err);
        process.exit(1);
    }

    app.listen(3000, () => {
        console.log("Listening on port 3000!!!!!");
    })
}

start();

