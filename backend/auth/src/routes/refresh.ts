import express, {Request, Response} from "express"
import jwt from "jsonwebtoken";
// import { Token } from "../models/Token";

const router = express.Router();

router.post("/api/users/refresh", (req: Request, res: Response) => {
    if (!req.cookies?.jwt) {
        res.status(401).send({"err": "user not authorized, no token"});
        return;
    }

    try {
        const payload = jwt.verify(req.cookies.jwt, process.env.JWT_KEY!);
        console.log(payload);

        res.send({"msg": "ok"});
    } catch(err) {
        res.status(401).send({"err": "user not authorized"});
    }

});

export { router as refreshRouter };