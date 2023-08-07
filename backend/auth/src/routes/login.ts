import express, {Request, Response} from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import { User } from "../models/User";
import { Password } from "../helpers/password";

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

    const userJwt = jwt.sign({
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
    }, process.env.JWT_KEY!)

    req.session = {
        jwt: userJwt,
    }

    res.send({msg: "ok"});

});

export {router as loginRouter};