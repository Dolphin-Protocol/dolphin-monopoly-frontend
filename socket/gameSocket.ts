import { Room } from "@/types/game";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "https://5.183.11.9:3003"; 

interface ServerToClientEvents {
	rooms: (data: { rooms: Room[] }) => void;
	roomCreated: (data: { roomId: string }) => void;
	userJoined: (data: { address: string }) => void;
}

interface ClientToServerEvents {
	createRoom: (data: { address: string }) => void;
	joinRoom: (data: { roomId: string; address: string }) => void;
	leaveRoom: () => void;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
	SOCKET_URL,
	{
		transports: ["websocket"],
	}
);

export const connectSocket = (setRooms: (rooms: Room[]) => void) => {
	socket.on("connect", () => {
		console.log("Connected to WebSocket Server");
	});

	socket.on("rooms", (data) => {
		console.log("Received rooms:", data.rooms);
		setRooms(data.rooms);
	});

	socket.on("roomCreated", (data) => {
		console.log("Room created:", data.roomId);
	});

	socket.on("userJoined", (data) => {
		console.log("User joined:", data);
	});

	socket.on("disconnect", () => {
		console.log("Disconnected from WebSocket Server");
	});
};
