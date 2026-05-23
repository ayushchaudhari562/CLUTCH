module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      io.to(roomId).emit("receive-message", "A new user joined");
    });

    socket.on("send-message", (data) => {
      io.to(data.roomId).emit("receive-message", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};
