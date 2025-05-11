import express from "express";
import http from "http";
import router from "./api";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const static_files = express.static("out");

app.use("/", static_files);
app.use("/api", router);

server.listen(3000, () => console.log("Listening on port 3000"));
