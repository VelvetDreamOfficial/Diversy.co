import { Router } from "express";
import bcrypt from "bcrypt";
import { User } from "../utils/db";
const router = Router();

router.get("/me", async (req, res) => {
    const cookies = req.cookies;
    if (cookies && cookies.token) {
        try {
            const user = await User.findOne({
                where: { token: cookies.token },
            });
            if (user) {
                res.json({
                    username: user.get("username"),
                    id: user.get("id"),
                    createdAt: user.get("createdAt"),
                    updatedAt: user.get("updatedAt"),
                    isOnline: user.get("isOnline"),
                    avatar: user.get("avatar"),
                });
            } else {
                res.status(400).json({ error: "Invalid token" });
            }
        } catch (e) {
            res.status(400).json({ error: "Invalid token" });
        }
    } else {
        res.status(400).json({ error: "Invalid token" });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = ((await User.findOne({ where: { username } })) ||
            (await User.findOne({ where: { email: username } })))!;

        if (await bcrypt.compare(password, user.get().password)) {
            const u = user.get();
            res.cookie("token", u.token);
            res.json({ token: u.token });
        } else {
            res.status(400).json({ error: "Invalid credentials" });
        }
    } catch (e) {
        res.status(400).json({ error: "Invalid credentials" });
    }
});

router.post("/register", async (req, res) => {
    const { email, password, username } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    try {
        let user =
            (await User.findOne({ where: { username } })) ||
            (await User.findOne({ where: { email } }));

        user = await User.create({ username, email, password: hash });
        user.save();
        const u = user.get();

        res.cookie("token", u.token);
        res.json({ token: u.token });
    } catch (e) {
        console.log(e);
        res.status(400).json({ error: "Invalid credentials" });
    }
});

export { router as auth };
