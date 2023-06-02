import express from "express";
import path from "path";
import http from "http";
import bodyParser from "body-parser";
import "dotenv/config.js";

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import mongoose from "mongoose";
import routes from "./src/server/routes.js"

// 獲取__filename
function getCurrnetFile() {
  return fileURLToPath(import.meta.url);
}

// 獲取__dirname
function getCurrnetDir() {
  const __filename = getCurrnetFile();
  const __dirname = dirname(__filename);
  return __dirname;
}

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8080;
const __dirname = getCurrnetDir();

// Connect to database
const mongoUri = process.env.DATABASE_URI;
mongoose.connect(mongoUri);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("open", () => {
  console.log("Database Connected");
});

// Launch server
app.use(express.static(path.join(__dirname, "dist")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', routes)

app.get("/*", (_, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

server.listen(port, () => {
  console.log("Listening on port " + port);
});

