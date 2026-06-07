module.exports = (io) => {
    io.on("connection", (socket) => //simple for making connection in room;
        {

            //...
            //.......
            //..
            //showing drawing data to member who are in room basically for both
            //user a and b;
            //..
            //...
            //just receive and send no store thing
        socket.on("excalidraw-update", (data) => {
            socket.broadcast.to(data.roomId).emit("excalidraw-update", data.elements)
        });


    })
}