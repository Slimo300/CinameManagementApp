import express, {Request, Response} from "express";
import { body, validationResult } from "express-validator";
// import { validateRequest } from "../helpers/middleware/validateRequest";

import { User } from "../models/User";

const router = express.Router();

router.post("/api/users/register", [
    body("email").isEmail().withMessage("Provide valid email"),
    body("password").trim().isLength({min: 8}).withMessage("Password length must be at least 8"),
    body("passwordConfirmation").custom((value, {req}) => {
        return value === req.body.password;
    }).withMessage("Passwords don't match")
], async (req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send(errors.array());
        return;
    }
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        res.status(400).send({"err": "Email already used"});
        return;
    }

    const user = User.build({
        email: email,
        password: password,
        isAdmin: false,
    });
    await user.save();

    res.status(201).send(user);

})

export{ router as registerRouter};