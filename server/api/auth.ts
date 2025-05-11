import { Router } from "express";

const router = Router();

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    res.json({ ok: true });
});

router.post("/register", async (req, res) => {});

export { router as auth };
