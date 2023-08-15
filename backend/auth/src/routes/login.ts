import express, {Request, Response} from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import {v4 as uuidv4} from "uuid";

import { redisClient } from "../app";
import { User } from "../models/User";
import { Password } from "../helpers/password";
import { TokenState } from "../models/Token";

const router = express.Router();

router.post("/api/users/login", [
    body("email").isEmail().withMessage("Provide valid email"),
    body("password").notEmpty().withMessage("Password cannot be blank"),
], async (req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send(errors.array());
        return;
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        res.status(400).send({"err": "Email or password invalid"});
        return;
    }

    const passwordsMatch = await Password.compare(user.password, password);
    if (!passwordsMatch) {
        res.status(400).send({"err": "Email or password invalid"});
        return;
    }

    const accessToken = jwt.sign({
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
    }, process.env.JWT_KEY!, {
        expiresIn: parseInt(process.env.ACCESS_DURATION!),
    });

    const tokenID = uuidv4();

    await redisClient.set(user.id + ":" + tokenID, TokenState.Active);
    await redisClient.expire(user.id + ":" + tokenID, parseInt(process.env.REFRESH_DURATION!));

    const refreshToken = jwt.sign({
        id: tokenID,
        userId: user.id,
    }, process.env.JWT_KEY!, {
        expiresIn: parseInt(process.env.REFRESH_DURATION!),
    })

    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        domain: process.env.DOMAIN
    });

    res.send({ accessToken });

});

export {router as loginRouter};