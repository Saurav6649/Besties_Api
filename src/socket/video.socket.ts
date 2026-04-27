import { Server } from "socket.io";

const VideoSocket = (io: Server) => {
  io.on("connection", (socket) => {
    socket.on("offer", ({ offer, to, from, type }) => {
      from.socketId = socket.id;
      io.to(to).emit("offer", { offer, from, type });
    });

    socket.on("candidate", ({ candidate, to }) => {
      io.to(to).emit("candidate", { candidate, from: socket.id });
    });

    socket.on("answer", ({ answer, to }) => {
      io.to(to).emit("answer", { answer, from: socket.id });
    });

    socket.on("end", ({ to }) => {
      io.to(to).emit("end", { from: socket.id });
    });

    socket.on("busy", ({ to }) => {
      io.to(to).emit("busy", { from: socket.id });
    });

    socket.on("disconnect", () => {
      console.log("user dicoonected");
    });
  });
};

export default VideoSocket;
