import { getToken } from "next-auth/jwt";
import { Server } from "socket.io";

let io;

export const initWebSocket = (server) => {
  io = new Server(server, {
    addTrailingSlash: false,
    path: "/api/socket",
  });

  io.use(async (socket, next) => {
    try {
      const token = await getToken({
        req: socket.request,
        secret: process.env.NEXTAUTH_SECRET,
      });
      socket.userId = token?.sub;
      next();
    } catch {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("subscribe", (pollId) => {
      socket.join(`poll:${pollId}`);
    });

    socket.on("unsubscribe", (pollId) => {
      socket.leave(`poll:${pollId}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

export const broadcastToPoll = (pollId, event, data) => {
  if (io) {
    io.to(`poll:${pollId}`).emit(event, data);
  }
};
