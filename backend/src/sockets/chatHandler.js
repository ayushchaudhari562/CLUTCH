module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      io.to(roomId).emit("receive-message", "A new user joined");
      socket.to(roomId).emit("user-joined", socket.id);
    });

    socket.on("send-message", (data) => {
      io.to(data.roomId).emit("receive-message", data);
    });
    //..
    //.....
    //if someone is click on match than this will take us call this 
    socket.on("request-match", (data) => {
      //yha fas skta hu:: baad me ,it is calling
      //  the person have made the post 
      // also we can say 
      io.to(data.targetSocketId).emit("incoming-match-request", data);
    });
    //now for person who had posted will decide to 
    // accept or reject it
    socket.on("accept-match", (data) => {
      //yha pr error aa skti hai isliye dhyan se dekhna
      //creating new room for both user:
      const roomId = `room${Date.now()}`;
      // now i have to join my self and the 
      // target user who is accepting the match
      //join both user in new created room:

      io.to(data.requesterSocketId).emit("match-accepted", roomId);
      io.to(data.targetSocketId).emit("match-accepted", roomId);
      //also emit the match found event so that server show the 
      // call interface on the frontend
      //...
      //...
      //..
    })

    //for handling the webrtc offering and answering calls
    //call feautre
    socket.on("webrtc-offer",({roomId,offer,targetSocketId})=>{
      if (targetSocketId) {
        socket.to(targetSocketId).emit("webrtc-offer", { offer });
      } else {
        socket.to(roomId).emit("webrtc-offer",{offer});
      }
    });

    socket.on("webrtc-answer",({roomId,answer})=>{
      socket.to(roomId).emit("webrtc-answer",{answer})
    });
    
    socket.on("webrtc-ice-candidate",({roomId,candidate})=>{
      socket.to(roomId).emit("webrtc-ice-candidate",{candidate});
    });

    socket.on("reject-call", ({ targetSocketId }) => {
      io.to(targetSocketId).emit("call-rejected");
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};
