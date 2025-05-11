import { Router } from "express";

const router = Router();

router.get("/health", async (req, res) => {
    res.json({ status: "OK" });
});

router.use("/auth", require("./auth").auth);
router.use("/users", require("./users").users);

export default router;
