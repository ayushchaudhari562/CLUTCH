const http = require("http");
const {Server}= require("socket.io");
const app = require("./app");

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            
            const allowedOrigins = [
                "http://localhost:5173",
                "https://clutch-client.vercel.app",
                "https://clutch-ayushchaudhari.vercel.app"
            ];
            
            const clientUrl = process.env.CLIENT_URL;
            if (clientUrl && !allowedOrigins.includes(clientUrl)) {
                allowedOrigins.push(clientUrl);
            }
            
            if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
                callback(null, true);
            } else {
                callback(new Error("Blocked by CORS"));
            }
        },
        credentials: true
    }
});

require("./sockets/chatHandler")(io);
require("./sockets/whiteboardHandler")(io);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});