const http = require("http");
const {Server}= require("socket.io");
const app = require("./app");

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        credentials: true
    }
});

require("./sockets/chatHandler")(io);
require("./sockets/whiteboardHandler")(io);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});