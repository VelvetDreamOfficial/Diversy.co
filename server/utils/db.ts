import { Sequelize, STRING } from "sequelize";
import WikiPageModel from "./models/WikiPage";
import WikiModel from "./models/Wiki";
import UserModel from "./models/User";
import path from "path";

export const db = new Sequelize({
    dialect: "sqlite",
    storage: path.join(__dirname, "database.sqlite"),
});

export const User = UserModel(db);
export const Wiki = WikiModel(db);
export const WikiPage = WikiPageModel(db);

(async () => {
    db.sync();
})();
