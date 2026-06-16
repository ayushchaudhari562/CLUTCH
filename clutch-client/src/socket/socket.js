import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL);

socket.on("connect", () => {
   console.log("Connected:", socket.id);
});

export default socket;