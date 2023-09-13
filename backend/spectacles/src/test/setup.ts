import { generateKeyPair } from "crypto";
import express from "express";
import jwt from "jsonwebtoken";

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { NewApp } from "../app";

let mongo: any;

interface RSAKeys {
    publicKey: string;
    privateKey: string;
}

declare global {
    var TestApp: express.Application;
    var keys: RSAKeys;

    var Auth: (isAdmin: boolean) => string;
};

const createRSAKeyPair = async (): Promise<RSAKeys> => {

    return new Promise( (resolve, reject ) => {
        generateKeyPair('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
              type: 'spki',
              format: 'pem'
            },
            privateKeyEncoding: {
              type: 'pkcs8',
              format: 'pem',
            }
          }, (err, publicKey, privateKey) => {
            if (err) reject(err);

            return resolve({
                privateKey, publicKey
            });
          });
    })

};

beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    global.keys = await createRSAKeyPair();

    global.TestApp = NewApp(global.keys.publicKey);

    global.Auth = (isAdmin: boolean): string => {
    
        const payload = {
            id: new mongoose.Types.ObjectId().toHexString(),
            email: "admin@test.com",
            isAdmin: isAdmin,
        }
    
        const accessToken = jwt.sign(payload, global.keys.privateKey, {
            algorithm: "RS256",
        });
    
        return accessToken;
    };

    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
});