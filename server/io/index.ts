import { Server } from "socket.io";
import { User } from "../utils/db";

export default function ioServer(io: Server) {
    let users = new Map<string, string>();

    io.on("connection", (socket) => {
        socket.on("auth", async (token: string) => {
            const user = await User.findOne({ where: { token } });
            if (!user) return;

            users.set(socket.id, token);
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
                users.forEach((token, id) => {
                    if (token === user.get("token")) {
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
        });
    });
}
