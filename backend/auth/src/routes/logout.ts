import express, { Request, Response } from "express";

const router = express.Router();

router.post("/api/users/logout", (req: Request, res: Response) => {
    req.session = null;
    res.send({"msg": "ok"});
})

export { router as logoutRouter };