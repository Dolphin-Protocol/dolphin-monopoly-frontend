import { io, Socket } from "socket.io-client";

// Default Socket server URL
const DEFAULT_BACKEND_URL = "http://5.183.11.9:3003";

// Socket connection instance
let socket: Socket | null = null;

// Connection status
let isConnected = false;

// Room data and listeners
let currentRooms: any[] = [];
const roomListeners: ((rooms: any[]) => void)[] = [];

/**
 * Initialize Socket connection
 * @param url Socket server URL
 * @param options Connection options
 * @returns Connection result Promise
 */
export const initializeSocket = (
	url: string = DEFAULT_BACKEND_URL,
	options: any = {}
): Promise<{ success: boolean; message: string; socket?: Socket }> => {
	return new Promise((resolve) => {
		// If already connected, disconnect first
		if (socket && socket.connected) {
			socket.disconnect();
		}

		console.log(`Attempting to connect to game server: ${url}`);

		// Set connection timeout
		const timeout = setTimeout(() => {
			if (socket && socket.connected) {
				socket.disconnect();
			}
			isConnected = false;
			socket = null;
			resolve({
				success: false,
				message:
					"Connection timeout, please check server address or network connection",
			});
		}, 5000); // 5 seconds timeout

		// Create socket connection
		socket = io(url, {
			transports: ["websocket"],
			reconnection: true,
			reconnectionAttempts: 5,
			reconnectionDelay: 1000,
			timeout: 5000,
			...options,
		});

		// Connection success
		socket.on("connect", () => {
			clearTimeout(timeout);
			console.log("Game server connection successful!");
			console.log(`Socket ID: ${socket?.id}`);

			isConnected = true;

			resolve({
				success: true,
				message: `Successfully connected to game server, Socket ID: ${socket?.id}`,
				socket: socket as Socket,
			});
		});

		// Connection error
		socket.on("connect_error", (error) => {
			clearTimeout(timeout);
			console.error("Game server connection error:", error);

			isConnected = false;

			resolve({
				success: false,
				message: `Connection error: ${error.message}`,
			});
		});

		// Connection timeout
		socket.on("connect_timeout", () => {
			clearTimeout(timeout);
			console.error("Game server connection timeout");

			isConnected = false;

			resolve({
				success: false,
				message: "Connection timeout",
			});
		});

		// Disconnect
		socket.on("disconnect", (reason) => {
			console.log(`Disconnected from game server: ${reason}`);
			isConnected = false;
		});

		// Reconnect
		socket.on("reconnect", (attemptNumber) => {
			console.log(
				`Reconnection successful, attempt number: ${attemptNumber}`
			);
			isConnected = true;
		});
	});
};

/**
 * Get current Socket instance
 * @returns Socket instance or null
 */
export const getSocket = (): Socket | null => {
	return socket;
};

/**
 * Check if connected
 * @returns Whether connected
 */
export const isSocketConnected = (): boolean => {
	return isConnected && socket !== null && socket.connected;
};

/**
 * Disconnect Socket
 */
export const disconnectSocket = (): void => {
	if (socket && socket.connected) {
		console.log("Disconnecting from game server");
		socket.disconnect();
		isConnected = false;
	}
};

/**
 * Create game room
 * @param address User address
 * @returns Creation result Promise
 */
export const createRoom = (address: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		if (!isSocketConnected()) {
			reject(new Error("Not connected to game server"));
			return;
		}

		socket?.emit("createRoom", { address }, (response: any) => {
			if (response.success) {
				resolve(response);
			} else {
				reject(new Error(response.message || "Failed to create room"));
			}
		});
	});
};

/**
 * Join game room
 * @param roomId Room ID
 * @param address User address
 * @returns Join result Promise
 */
export const joinRoom = (roomId: string, address: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		if (!isSocketConnected()) {
			reject(new Error("Not connected to game server"));
			return;
		}

		socket?.emit("joinRoom", { roomId, address }, (response: any) => {
			if (response.success) {
				resolve(response);
			} else {
				reject(new Error(response.message || "Failed to join room"));
			}
		});
	});
};

/**
 * Start game
 * @param roomId Room ID
 * @returns Start game result Promise
 */
export const startGame = (roomId: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		if (!isSocketConnected()) {
			reject(new Error("Not connected to game server"));
			return;
		}

		socket?.emit("startGame", { roomId }, (response: any) => {
			if (response.success) {
				resolve(response);
			} else {
				reject(new Error(response.message || "Failed to start game"));
			}
		});
	});
};

/**
 * Check if room exists
 * @param roomId Room ID
 * @returns Check result Promise
 */
export const checkRoom = (roomId: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		if (!isSocketConnected()) {
			reject(new Error("Not connected to game server"));
			return;
		}

		socket?.emit("checkRoom", { roomId }, (response: any) => {
			resolve(response);
		});
	});
};

/**
 * Leave room
 * @param roomId Room ID
 * @returns Leave result Promise
 */
export const leaveRoom = (roomId: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		if (!isSocketConnected()) {
			reject(new Error("Not connected to game server"));
			return;
		}

		socket?.emit("leaveRoom", { roomId }, (response: any) => {
			if (response.success) {
				resolve(response);
			} else {
				reject(new Error(response.message || "Failed to leave room"));
			}
		});
	});
};

/**
 * Start listening for room updates
 */
export const startRoomsListener = (): void => {
	if (!socket || !isSocketConnected()) return;

	// Clear previous listeners
	socket.off("rooms");

	// Set new listener
	socket.on("rooms", (data) => {
		console.log("Received rooms event:", data);
		currentRooms = data.rooms || [];

		// Notify all listeners
		notifyRoomsListeners();
	});
};

/**
 * Add room data change listener
 * @param listener Listener function
 * @returns Function to remove the listener
 */
export const addRoomsListener = (
	listener: (rooms: any[]) => void
): (() => void) => {
	roomListeners.push(listener);

	// Notify with current data if available
	if (currentRooms.length > 0) {
		listener(currentRooms);
	}

	return () => removeRoomsListener(listener);
};

/**
 * Remove room data change listener
 * @param listener Listener to remove
 */
export const removeRoomsListener = (listener: (rooms: any[]) => void): void => {
	const index = roomListeners.indexOf(listener);
	if (index !== -1) {
		roomListeners.splice(index, 1);
	}
};

/**
 * Notify all room listeners
 */
const notifyRoomsListeners = (): void => {
	roomListeners.forEach((listener) => listener([...currentRooms]));
};

/**
 * Clear all room listeners
 */
export const clearRoomsListeners = (): void => {
	roomListeners.length = 0;
	if (socket) {
		socket.off("rooms");
	}
};

/**
 * Get room list
 * @returns Room list Promise
 */
export const getRooms = (): Promise<any> => {
	return new Promise((resolve, reject) => {
		if (!isSocketConnected()) {
			reject(new Error("Not connected to game server"));
			return;
		}

		const timeout = setTimeout(() => {
			socket?.off("rooms", handleRooms);
			reject(new Error("Get rooms timeout"));
		}, 5000);

		const handleRooms = (response: any) => {
			clearTimeout(timeout);
			socket?.off("rooms", handleRooms);

			if (response && response.success) {
				console.log("Rooms:", response);
				resolve(response);
			} else {
				reject(
					new Error(response?.message || "Failed to get room list")
				);
			}
		};

		socket?.on("rooms", handleRooms);
		socket?.emit("getRooms", {});
	});
};

/**
 * Listen for player joined event
 * @param callback Callback function
 */
export const onPlayerJoined = (callback: (data: any) => void): void => {
	socket?.on("playerJoined", callback);
};

/**
 * Listen for player left event
 * @param callback Callback function
 */
export const onPlayerLeft = (callback: (data: any) => void): void => {
	socket?.on("playerLeft", callback);
};

/**
 * Listen for game started event
 * @param callback Callback function
 */
export const onGameStarted = (callback: (data: any) => void): void => {
	socket?.on("gameStarted", callback);
};

/**
 * Listen for rooms updated event
 * @param callback Callback function
 */
export const onRoomsUpdated = (callback: (data: any) => void): void => {
	socket?.on("roomsUpdated", callback);
};

/**
 * Remove event listener
 * @param event Event name
 */
export const offEvent = (event: string): void => {
	socket?.off(event);
};

/**
 * Remove all game related event listeners
 */
export const offAllGameEvents = (): void => {
	if (socket) {
		socket.off("playerJoined");
		socket.off("playerLeft");
		socket.off("gameStarted");
		socket.off("roomsUpdated");
	}
};
