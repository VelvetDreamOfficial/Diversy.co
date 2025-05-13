import { Server } from "socket.io";
import { PrivateMessage, User } from "../utils/db";

export default function ioServer(io: Server) {
    let users = new Map<string, { token: string; id: string }>();

    io.on("connection", (socket) => {
        socket.on("auth", async (token: string) => {
            const user = await User.findOne({ where: { token } });
            if (!user) return;

            users.set(socket.id, { token, id: user.get("id") as string });
            io.sockets.emit("connected", user.get("id"));

            try {
                await User.update(
                    { isOnline: true },
                    {
                        where: { token },
                    }
                );
            } catch {}

            socket.on("disconnect", async () => {
                users.forEach((u, id) => {
                    if (u.token === user.get("token")) {
                        users.delete(id);
                    }
                });
                try {
                    await User.update(
                        { isOnline: false },
                        {
                            where: { token },
                        }
                    );
                } catch {}

                io.sockets.emit("disconnected", user.get("id"));
            });

            socket.on("private-message", async ({ message, recipientId }) => {
                let u = Array.from(users.entries()).find(
                    ([, user]) => user.id === recipientId
                );

                if (!u) return;

                const [receiverSocketId] = u;

                let receiverSocket = (await io.sockets.fetchSockets()).find(
                    (s) => s.id === receiverSocketId
                );

                if (!receiverSocket) return;

                receiverSocket.emit("private-message", {
                    content: message.content,
                    senderId: user.get("id"),
                    recipientId,
                    id: message.id,
                });
            });

            socket.on("delete-message", async ({ senderId, recipientId }) => {
                let u = Array.from(users.entries()).find(
                    ([, user]) => user.id === recipientId
                );

                if (!u) return;

                const [receiverSocketId] = u;

                let receiverSocket = (await io.sockets.fetchSockets()).find(
                    (s) => s.id === receiverSocketId
                );

                if (!receiverSocket) return;

                receiverSocket.emit("delete-message", senderId);
            });
        });
    });
}
