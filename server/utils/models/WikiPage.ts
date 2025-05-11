import { randomUUID } from "crypto";
import { Sequelize, STRING } from "sequelize";

export default function WikiPageModel(db: Sequelize) {
    const WikiPage = db.define("wiki_page", {
        title: {
            type: STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        content: {
            type: STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        wikiId: {
            type: STRING,
            allowNull: false,
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
    });

    return WikiPage;
}
