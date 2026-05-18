import express from "express";
import cors from "cors";
import { config } from "dotenv";

config();

const server = express();

server.listen(8080, () => {
  console.log("server is running");
});
