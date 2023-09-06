import express, {Request, Response} from "express";
import { body } from "express-validator";

import { ValidateRequest } from "@spellcinema/lib";

import { User } from "../models/User";
import { Password } from "../services/password";
import { TokenService } from "../services/token";

const loginRouter = (TokenService: TokenService): express.Router => {
    const router = express.Router();

    router.post("/api/users/login", [
        body("email").isEmail().withMessage("Provide valid email"),
        body("password").notEmpty().withMessage("Password cannot be blank"),
        ValidateRequest
    ], async (req: Request, res: Response) => {
    
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
    
        const { accessToken, refreshToken } = await TokenService.NewTokenPairForUser({
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
    

    return router;
} 


export { loginRouter };