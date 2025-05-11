import { randomUUID } from "crypto";
import { Sequelize, STRING } from "sequelize";

export default function WikiModel(db: Sequelize) {
    const Wiki = db.define("wiki", {
        title: {
            type: STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        description: {
            type: STRING,
            validate: {
                notEmpty: true,
            },
        },
        banner: {
            type: STRING,
        },
        ownerId: {
            type: STRING,
        },
        id: {
            type: STRING,
            allowNull: false,
            defaultValue: () => randomUUID(),
            primaryKey: true,
        },
        createdAt: {
            type: STRING,
            validate: {
                notEmpty: true,
            },
            defaultValue: () => Date.now().toString(),
        },
        updatedAt: {
            type: STRING,
            validate: {
                notEmpty: true,
            },
            defaultValue: () => Date.now().toString(),
        },
        isPublic: {
            type: STRING,
            validate: {
                notEmpty: true,
            },
            defaultValue: () => false,
        },
    });

    return Wiki;
}
