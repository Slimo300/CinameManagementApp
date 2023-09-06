import express, { Request, Response } from "express";
import { body } from "express-validator";

import { User } from "../models/User";
import { BadRequestError, ValidateRequest } from "@spellcinema/lib";

const registerRouter = (): express.Router => {
    
    const router = express.Router();

    router.post("/api/users/register", [
        body("email").isEmail().withMessage("Provide valid email"),
        body("password").trim().isLength({min: 8}).withMessage("Password length must be at least 8"),
        body("passwordConfirmation").custom((value, {req}) => {
            return value === req.body.password;
        }).withMessage("Passwords don't match"),
        ValidateRequest,
    ], async (req: Request, res: Response) => {
    
        const { email, password } = req.body;
    
        const existingUser = await User.findOne({ email });
    
        if (existingUser) {
            throw new BadRequestError("email already in database");
        }
    
        const user = User.build({
            email: email,
            password: password,
            isAdmin: false,
        });
        await user.save();
    
        res.status(201).send(user);
    
    });
    
    return router;
}


export{ registerRouter };