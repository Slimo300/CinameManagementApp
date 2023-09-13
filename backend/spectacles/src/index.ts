import fs from "fs";
import mongoose from "mongoose";

import { NewApp } from "./app";


const start = async () => {

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI not defined");
    }

    try {
        const publicKey = fs.readFileSync("/rsa/public.key", "utf-8");

        await mongoose.connect(process.env.MONGO_URI, {
            autoIndex: true,
            autoCreate: true
        });

        const app = NewApp(publicKey);
        
        app.listen(3000, () => {
            console.log("Listening on port 3000!!!!!");
        })

    } catch(err) {
        console.log(err);
        process.exit(1);
    }
}

start();

