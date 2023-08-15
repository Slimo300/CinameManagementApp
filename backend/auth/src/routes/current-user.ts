import express, {Request, Response} from "express";
import jwt from "jsonwebtoken";
import { publicKey } from "../app";

const router = express.Router();

router.get("/api/users/current-user", (req: Request, res: Response) => {
    if (!req.headers.authorization) {
        res.status(401).send({"err": "user not authorized, no token"});
        return;
    }

    const bearerToken = req.headers.authorization.split(" ")[1];

    try {
        const payload = jwt.verify(bearerToken, publicKey, {
            algorithms: ["RS256"]
        });
        res.send(payload);
    } catch(err) {
        res.status(401).send({"err": "user not authorized"});
    }

});

export {router as currentUserRouter};