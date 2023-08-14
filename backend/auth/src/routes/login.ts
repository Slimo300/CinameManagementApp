import express, {Request, Response} from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import { User } from "../models/User";
import { Password } from "../helpers/password";
import { Token } from "../models/Token";

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
        expiresIn: 1000 * 60 * 20,
    });

    const token = Token.build({
        userID: user.id,
    });
    await token.save();

    const refreshToken = jwt.sign({
        id: token.id,
        userId: token.userID,
    }, process.env.JWT_KEY!, {
        expiresIn: "1d",
    })

    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        domain: process.env.DOMAIN
    });

    res.send({ accessToken });

});

export {router as loginRouter};