import { Router } from "express";
import { PrivateMessage, User } from "../utils/db";

const router = Router();

router.post("/", async (req, res) => {
    let token = req.cookies.token;
    const user = await User.findOne({ where: { token } });

    if (!user) {
        res.status(403).send({ error: "Unauthorized" });
        return;
    }

    const { content, recipientId } = req.body;

    await PrivateMessage.create({
        recipientId,
        content,
        senderId: user.get("id"),
        createdAt: Date.now(),
    });

    res.json({ ok: true });
});

router.get("/:recipientId", async (req, res) => {
    let token = req.cookies.token;
    const user = await User.findOne({ where: { token } });

    if (!user) {
        res.status(403).send({ error: "Unauthorized" });
        return;
    }

    const recipientId = req.params.recipientId;

    const messages = await PrivateMessage.findAll({
        where: {
            senderId: user.get("id"),
            recipientId,
        },
    });

    res.json(messages.reverse());
});

router.delete("/:messageId", async (req, res) => {
    let token = req.cookies.token;
    const user = await User.findOne({ where: { token } });

    if (!user) {
        res.status(403).send({ error: "Unauthorized" });
        return;
    }

    const { messageId } = req.params;

    const message = await PrivateMessage.findOne({ where: { id: messageId } });

    if (!message) {
        res.status(404).send({ error: "Message not found" });
        return;
    }

    if (message.get("senderId") !== user.get("id")) {
        res.status(403).send({ error: "Unauthorized" });
        return;
    }

    await PrivateMessage.destroy({ where: { id: messageId } });

    res.json({ ok: true });
});

export { router as privateMessage };
