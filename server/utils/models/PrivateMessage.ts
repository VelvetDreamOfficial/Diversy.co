import { randomUUID } from "crypto";
import { Sequelize, STRING } from "sequelize";

export default function PrivateMessageModel(db: Sequelize) {
    const PrivateMessage = db.define("private_message", {
        id: {
            type: STRING,
            defaultValue: () => randomUUID(),
            primaryKey: true,
        },
        senderId: {
            type: STRING,
            allowNull: false,
        },
        recipientId: {
            type: STRING,
            allowNull: false,
        },
        content: {
            type: STRING,
            allowNull: false,
        },
        createdAt: {
            type: STRING,
            allowNull: false,
            defaultValue: () => Date.now().toString(),
        },
    });

    return PrivateMessage;
}
