import express, {Request, Response} from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import {v4 as uuidv4} from "uuid";

import { redisClient } from "../app";
import { User } from "../models/User";
import { Password } from "../services/password";
import { TokenState } from "../models/Token";
import { Token } from "../services/token";

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

    const { accessToken, refreshToken } = await Token.NewTokenPairForUser({
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
    });

    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        domain: process.env.DOMAIN
    });

    res.send({ accessToken });

});

export {router as loginRouter};