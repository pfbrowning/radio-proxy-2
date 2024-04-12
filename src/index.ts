import express from "express";
import icy from "icy";
import { Server } from "socket.io";
import { createServer } from "node:http";
import { convertRawHeadersToDictionary } from "./functions";

const expressApp = express();
const server = createServer(expressApp);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const port = process.env.PORT ?? 3000;

io.on("connection", (socket) => {
  console.log("a user connected");
});

expressApp.get("/listen", (expressRequest, expressResponse) => {
  const icyClient = icy.get(expressRequest.query.url, (icyResponse) => {
    icyResponse.on("metadata", (metadata) => {
      const parsed = icy.parse(metadata);
      const { url } = expressRequest.query;
      const { StreamTitle: title } = parsed;

      console.log("metadata received", expressRequest.query.url, parsed);

      io.emit("metadata", { url, title });
    });

    const headers = convertRawHeadersToDictionary(icyResponse);
    expressResponse.setHeader("Content-Type", headers["content-type"]);

    icyResponse.pipe(expressResponse);
  });

  icyClient.on("error", (error) => {
    const statusCode = error.code === "ECONNREFUSED" ? 503 : 500;
    return expressResponse.status(statusCode).json();
  });
});

server.listen(port, () => {
  console.log(`server running on port ${port}`);
});
