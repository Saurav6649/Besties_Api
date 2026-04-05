import { raw } from "express";
import * as cookie from "cookie";
import { Server, Socket } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";

const OnlineUser = new Map();

const StatusSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    try {
      const rawCookie = socket.handshake.headers.cookie || "";
      const cookies = cookie.parse(rawCookie);

      const accessTokens = cookies.accessToken;

      if (!accessTokens) throw new Error("Access token not found ");

      const user = jwt.verify(
        accessTokens,
        process.env.JWT_SECRET!,
      ) as JwtPayload;

      OnlineUser.set(socket.id, user);

      socket.join(user.id);

      io.emit("online", Array.from(OnlineUser.values()));

      socket.on("get-online", () => {
        io.emit("online", Array.from(OnlineUser.values()));
      });

      socket.on("disconnect", () => {
        OnlineUser.delete(socket.id);
        io.emit("online", Array.from(OnlineUser.values()));
      });
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
        socket.disconnect();
      }
    }
  });
};

export default StatusSocket;
