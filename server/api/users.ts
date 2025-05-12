import { Router } from "express";
import { User } from "../utils/db";
import { writeFileSync } from "fs";
import path from "path";

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

    if (avatar) {
        function dataURLtoFile(dataurl: any, filename: string) {
            var arr = dataurl.split(","),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[arr.length - 1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, { type: mime });
        }

        writeFileSync(
            path.join(__dirname, "../hosted", user.get("id") + ".png"),
            Buffer.from(
                await dataURLtoFile(
                    avatar,
                    user.get("id") + ".png"
                ).arrayBuffer()
            ).toString("binary"),
            "binary"
        );

        await User.update(
            { avatar: `/avatars/${user.get("id")}.png` },
            { where: { id: user.get("id") } }
        );
    }

    if (customCSS)
        await User.update({ customCSS }, { where: { id: user.get("id") } });

    res.json({ ok: true });
});

router.get("/", async (req, res) => {
    const users = await User.findAll({
        attributes: [
            "id",
            "username",
            "avatar",
            "customCSS",
            "createdAt",
            "updatedAt",
            "isOnline",
        ],
    });

    res.json(users);
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({
        where: { id },
        attributes: [
            "id",
            "username",
            "avatar",
            "customCSS",
            "createdAt",
            "updatedAt",
            "isOnline",
        ],
    });
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    res.json(user);
});

export { router as users };
