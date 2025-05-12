import { Router } from "express";
import { User } from "../utils/db";

const router = Router();

router.put("/me", async (req, res) => {
    const { username, avatar, customCSS } = req.body;
    const token = req.cookies.token;

    if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    const user = await User.findOne({ where: { token } });
    if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    if (username)
        await User.update({ username }, { where: { id: user.get("id") } });

    if (avatar)
        await User.update({ avatar }, { where: { id: user.get("id") } });

    if (customCSS)
        await User.update({ customCSS }, { where: { id: user.get("id") } });

    res.json({ ok: true });
});

export { router as users };
