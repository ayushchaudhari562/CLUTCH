const http = require("http");
const {Server}= require("socket.io");
const app = require("./app");

const server = http.createServer(app);
const io = new Server(server,{
    pingInterval: 10000,
    pingTimeout: 5000,
    cors: {
        //...
        //..
        // Dynamic origin checker function to determine if the client origin is allowed to connect
        //..
        //...
        origin: (origin, callback) => {
            //...
            //..
            // Allow requests without an origin
            //..
            //...
            if (!origin) return callback(null, true);
            
            //...
            //..
            // List of trusted client origins allowed to connect
            //..
            //...
            const allowedOrigins = [
                "http://localhost:5173",
                "https://clutch-client.vercel.app",
                "https://clutch-ayushchaudhari.vercel.app"
            ];
            
            //...
            //..
            // Include client URL from environment variables dynamically if it is set
            //..
            //...
            const clientUrl = process.env.CLIENT_URL;
            if (clientUrl && !allowedOrigins.includes(clientUrl)) {
                allowedOrigins.push(clientUrl);
            }
            
            //...
            //..
            // Accept the request if the origin is in allowedOrigins or is a 
            // Vercel subdomain 
            //..
            //...
            if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
                callback(null, true);
            } else {
                //...
                //..
                // Deny access for any other unauthorized origin
                //..
                //...
                callback(new Error("Blocked by CORS"));
            }
        },
        //...
        //..
        // Enable sending cookies or authorization headers along with cross-origin requests
        //..
        //...
        credentials: true
    }
});

require("./sockets/chatHandler")(io);
require("./sockets/whiteboardHandler")(io);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

/* 1. What does CORS actually do? (CORS kya karta hai?)
Normally, browsers follow a security rule called Same-Origin Policy. 
This rule prevents one website (e.g., attacker-site.com) from 
sending requests to another website (e.g., your-bank.com) and reading 
the response. Without this rule, any random website could steal your 
session/data from other sites you are logged into.

However, in modern apps, we host our frontend (e.g., Vercel) and backend (e.g., Render/AWS) on different domains.

CORS (Cross-Origin Resource Sharing) is like a gatekeeper on your backend server.
It tells the user's browser: "Yes, I trust https://clutch-client.vercel.app. 
Please allow it to talk to my server and read the response."
If you don't configure CORS, the browser will block the frontend from 
connecting to the backend
*/



/* Why is credentials: true important?
By default, when your frontend talks to a backend on a different domain, 
the browser hides all cookies, session info, or Authorization headers for security reasons.

When we set credentials: true on the backend (and also enable it on the frontend):

Allows Auth Cookies / Sessions: It allows the frontend to send cookies
 (like session tokens or login cookies) along with the request.
Without it: If your backend needs to check who is logged in using 
a cookie or an authorization header, it will receive an unauthenticated
 request because the browser will block those credentials from being sent.
Requirement: Note that if you set credentials: true, you cannot use origin:
 "*" (allow all) on your CORS setup. You must specify exact trusted domains
  (which is exactly what your allowedOrigins list does).*/