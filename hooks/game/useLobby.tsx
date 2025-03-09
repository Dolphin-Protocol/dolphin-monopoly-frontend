import { useState, useEffect, useCallback } from "react";
import {
	initializeSocket,
	isSocketConnected,
	getSocket,
	disconnectSocket,
	createRoom as createRoomApi,
	getRooms as getRoomsApi,
	onRoomsUpdated,
	offEvent,
} from "@/socket/gameSocket";
import { Room } from "@/types/game";

interface UseLobbyReturn {
	isConnecting: boolean;
	isConnected: boolean;
	connectionError: string;
	socketId: string;
	rooms: Room[];
	createRoom: (address: string) => Promise<{ roomId: string }>;
	getRooms: () => Promise<void>;
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

					// Get room list
					await getRoomsInternal();
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

		// Listen for room list updates
		const socket = getSocket();
		if (socket) {
			socket.on("roomsUpdated", (roomList) => {
				setRooms(roomList);
			});
		}

		// Cleanup function
		return () => {
			offEvent("roomsUpdated");
			disconnectSocket();
		};
	}, []);

	// Create room
	const createRoom = useCallback(
		async (address: string): Promise<{ roomId: string }> => {
			try {
				const response = await createRoomApi(address);

				// Update room list after creating a room
				await getRoomsInternal();

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

	// Get room list (internal use)
	const getRoomsInternal = useCallback(async (): Promise<void> => {
		try {
			// Use API approach to get rooms
			const socket = getSocket();
			if (!socket) {
				throw new Error("Not connected to game server");
			}

			// Use a Promise-based approach with the socket
			const response = await new Promise<any>((resolve, reject) => {
				socket.emit("getRooms", {}, (res: any) => {
					if (res && res.success) {
						resolve(res);
					} else {
						reject(
							new Error(res?.message || "Failed to get room list")
						);
					}
				});
			});

			setRooms(response.rooms || []);
		} catch (error) {
			console.error("Error getting room list:", error);
		}
	}, []);

	// Get room list (external use)
	const getRooms = useCallback(async (): Promise<void> => {
		return getRoomsInternal();
	}, [getRoomsInternal]);

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
		getRooms,
		disconnect,
	};
};
