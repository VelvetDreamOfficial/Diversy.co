import express from "express";
import http from "http";
import router from "./api";
import next from "next";
import cookieParser from "cookie-parser";

const app = express();
const server = http.createServer(app);
const dev = process.env.BUN_ENV !== "production";

const nextApp = next({
    dev: false,
    turbopack: true,
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
});
const handle = nextApp.getRequestHandler();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", router);

nextApp.prepare().then(() => {
    app.use("/", (req, res) => handle(req, res));
});

server.listen(process.env.PORT || 3000, () =>
    console.log("Listening on port 3000")
);
