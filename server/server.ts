import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

io.on("connection", (socket) => {
  // console.log("User Connection established:" + socket.id);
  socket.on("message", (data: any) => {
    socket.broadcast.emit("response", { ...data, userId: socket.id });
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
