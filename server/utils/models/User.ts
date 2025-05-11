import { randomUUID } from "crypto";
import { Sequelize, STRING } from "sequelize";

export function generateToken() {
    let token = "";
    let len = 20;
    let charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-";
    for (let i = 0; i < len; i++) {
        token += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return token;
}

export default function UserModel(db: Sequelize) {
    const User = db.define("user", {
        username: {
            type: STRING,
            unique: true,
            allowNull: false,
            validate: {
                min: 3,
                max: 20,
                isAlphanumeric: true,
                notEmpty: true,
            },
        },
        password: {
            type: STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        id: {
            type: STRING,
            unique: true,
            defaultValue: () => randomUUID(),
            primaryKey: true,
        },
        createdAt: {
            type: STRING,
            defaultValue: () => Date.now().toString(),
        },
        updatedAt: {
            type: STRING,
            defaultValue: () => Date.now().toString(),
        },
        isOnline: {
            type: STRING,
            defaultValue: () => false,
        },
        email: {
            type: STRING,
            validate: {
                notEmpty: true,
                isEmail: true,
            },
        },
        bio: {
            type: STRING,
            allowNull: true,
            defaultValue: () => "",
        },
        avatar: {
            type: STRING,
            allowNull: true,
            defaultValue: () =>
                "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        },
        cover: {
            type: STRING,
            allowNull: true,
            defaultValue: () => "/by-zephra.png",
        },
        customCSS: {
            type: STRING,
            allowNull: true,
            defaultValue: () => "",
        },
        token: {
            type: STRING,
            defaultValue: () => generateToken(),
        },
    });

    return User;
}
