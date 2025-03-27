import { useState, useEffect, useCallback } from "react";
import { socket } from "@/socket/gameSocket";
import { Room } from "@/types/game";

interface UseLobbyReturn {
	isConnecting: boolean;
	isConnected: boolean;
	connectionError: string;
	socketId: string;
	rooms: Room[];
	createRoom: (address: string) => Promise<{ roomId: string }>;
	joinRoom: (address: string, roomId: string) => Promise<void>;
	disconnect: () => void;
}

export const useLobby = (): UseLobbyReturn => {
	const [isConnecting, setIsConnecting] = useState<boolean>(false);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [connectionError, setConnectionError] = useState<string>("");
	const [socketId, setSocketId] = useState<string>("");
	const [rooms, setRooms] = useState<Room[]>([]);

	useEffect(() => {
		setIsConnecting(true);
		socket.connect();

		socket.on("connect", () => {
			setIsConnecting(false);
			setIsConnected(true);
			setSocketId(socket.id || "");
			setConnectionError("");
			console.log("Connected to WebSocket Server:", socket.id);
		});

		socket.on("disconnect", () => {
			setIsConnected(false);
			setSocketId("");
			console.log("Disconnected from WebSocket Server");
		});

		socket.on("rooms", (data) => {
			console.log("Received rooms:", data.rooms);
			setRooms(data.rooms);
		});

		socket.on("connect_error", (error) => {
			setIsConnecting(false);
			setConnectionError(error.message);
			console.error("WebSocket Connection Error:", error);
		});

		return () => {
			socket.off("rooms");
		};
	}, []);

	const createRoom = useCallback(
		(address: string): Promise<{ roomId: string }> => {
			return new Promise((resolve, reject) => {
				if (!isConnected) {
					reject(new Error("WebSocket is not connected"));
					return;
				}

				socket.emit("createRoom", { address });

				socket.once("roomCreated", (data) => {
					console.log("Room created:", data);
					resolve(data);
				});
			});
		},
		[isConnected]
	);

	const joinRoom = useCallback(
		(address: string, roomId: string): Promise<void> => {
			return new Promise((resolve, reject) => {
				if (!isConnected) {
					reject(new Error("WebSocket is not connected"));
					return;
				}

				socket.emit("joinRoom", { address, roomId });

				socket.once("userJoined", (data) => {
					console.log("User joined:", data);
					resolve();
				});
			});
		},
		[isConnected]
	);

	const disconnect = useCallback(() => {
		socket.disconnect();
	}, []);

	return {
		isConnecting,
		isConnected,
		connectionError,
		socketId,
		rooms,
		createRoom,
		joinRoom,
		disconnect,
	};
};
