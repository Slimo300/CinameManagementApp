import express, { Request, Response } from "express";

const router = express.Router();

router.post("/api/users/logout", (req: Request, res: Response) => {
    res.clearCookie("jwt", {
        domain: process.env.DOMAIN,
        httpOnly: true
    });
    res.send({"msg": "ok"});
})

export { router as logoutRouter };