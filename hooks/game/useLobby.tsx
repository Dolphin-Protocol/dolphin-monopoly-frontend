import { useState, useEffect, useCallback } from "react";
import {
	initializeSocket,
	isSocketConnected,
	getSocket,
	disconnectSocket,
	createRoom as createRoomApi,
	startRoomsListener,
	addRoomsListener,
	clearRoomsListeners,
} from "@/socket/gameSocket";
import { Room } from "@/types/game";

interface UseLobbyReturn {
	isConnecting: boolean;
	isConnected: boolean;
	connectionError: string;
	socketId: string;
	rooms: Room[];
	createRoom: (address: string) => Promise<{ roomId: string }>;
	disconnect: () => void;
}

/**
 * Lobby Hook for game room management
 * @returns Lobby functionality
 */
export const useLobby = (): UseLobbyReturn => {
	const [isConnecting, setIsConnecting] = useState<boolean>(true);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [connectionError, setConnectionError] = useState<string>("");
	const [socketId, setSocketId] = useState<string>("");
	const [rooms, setRooms] = useState<Room[]>([]);

	// Initialize Socket connection
	useEffect(() => {
		const connectToServer = async () => {
			try {
				setIsConnecting(true);
				setConnectionError("");

				const result = await initializeSocket();

				if (result.success) {
					setIsConnected(true);
					setSocketId(result.socket?.id || "");
				} else {
					setIsConnected(false);
					setConnectionError(result.message);
				}
			} catch (error) {
				setIsConnected(false);
				setConnectionError(
					error instanceof Error ? error.message : "Connection failed"
				);
			} finally {
				setIsConnecting(false);
			}
		};

		connectToServer();

		// Cleanup socket on unmount
		return () => {
			disconnectSocket();
		};
	}, []);

	// Set up room listeners once connected
	useEffect(() => {
		// Only set up listeners if connected
		if (isConnected && !isConnecting) {
			console.log("Setting up room listeners");

			// Start listening for rooms
			startRoomsListener();

			// Add room data change listener
			const removeListener = addRoomsListener((roomList) => {
				console.log("Room list updated:", roomList);
				setRooms(roomList);
			});

			// Cleanup room listeners
			return () => {
				console.log("Cleaning up room listeners");
				removeListener();
				clearRoomsListeners();
			};
		}
	}, [isConnected, isConnecting]);

	// Create room
	const createRoom = useCallback(
		async (address: string): Promise<{ roomId: string }> => {
			try {
				const response = await createRoomApi(address);
				return { roomId: response.roomId };
			} catch (error) {
				throw new Error(
					error instanceof Error
						? error.message
						: "Failed to create room"
				);
			}
		},
		[]
	);

	// Disconnect
	const disconnect = useCallback((): void => {
		disconnectSocket();
		setIsConnected(false);
		setSocketId("");
	}, []);

	return {
		isConnecting,
		isConnected,
		connectionError,
		socketId,
		rooms,
		createRoom,
		disconnect,
	};
};
