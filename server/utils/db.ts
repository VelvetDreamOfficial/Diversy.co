import { Sequelize, STRING } from "sequelize";
import WikiPageModel from "./models/WikiPage";
import WikiModel from "./models/Wiki";
import UserModel from "./models/User";
import path from "path";
import PrivateMessageModel from "./models/PrivateMessage";

export const db = new Sequelize({
    dialect: "sqlite",
    storage: path.join(__dirname, "database.sqlite"),
    retry: { max: 10 },
    logging: false,
});

export const User = UserModel(db);
export const Wiki = WikiModel(db);
export const WikiPage = WikiPageModel(db);
export const PrivateMessage = PrivateMessageModel(db);

(async () => {
    db.sync();
})();
