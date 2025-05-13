import { Router } from "express";

import { auth } from "./auth";
import { users } from "./users";
import { privateMessage } from "./privateMessages";

const router = Router();

router.get("/health", async (req, res) => {
    res.json({ status: "OK" });
});

router.use("/auth", auth);
router.use("/users", users);
router.use("/messages", privateMessage);

export default router;
