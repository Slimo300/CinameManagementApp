import express, {Request, Response} from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/api/users/current-user", (req: Request, res: Response) => {
    if (!req.session?.jwt) {
        res.status(401).send({"err": "user not authorized, no token"});
        return;
    }

    try {
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
        res.send(payload);
    } catch(err) {
        res.status(401).send({"err": "user not authorized"});
    }

});

export {router as currentUserRouter};