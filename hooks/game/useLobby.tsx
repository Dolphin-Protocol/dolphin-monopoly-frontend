"use client";

import { useState, useEffect, useCallback } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { Room } from "@/types/game";
import { useCustomWallet } from "@/contexts/WalletContext";
import { useRouter } from "next/navigation";

interface UseLobbyReturn {
  isConnecting: boolean;
  isConnected: boolean;
  isGameStarting: boolean;
  socketId: string;
  connectionError: string;
  rooms: Room[];
  currentRoom: Room | null;
  createRoom: (address: string) => Promise<Room>;
  joinRoom: (address: string, roomId: string) => Promise<Room>;
  leaveRoom: () => Promise<Room>;
  disconnect: () => void;
  startGame: () => Promise<void>;
}

export const useLobby = (): UseLobbyReturn => {
  const router = useRouter();
  const {
    socket,
    isConnecting: socketIsConnecting,
    isConnected: socketIsConnected,
    socketId: socketSocketId,
    connectionError: socketConnectionError,
  } = useSocket();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isGameStarting, setIsGameStarting] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const { address } = useCustomWallet();

  // Function to fetch room list
  const fetchRooms = useCallback(() => {
    if (socketIsConnected && socket) {
      console.log("Requesting room list");
      socket.emit("rooms");
    }
  }, [socketIsConnected, socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on("rooms", (data) => {
      console.log("Received rooms:", data.rooms);
      setRooms(data.rooms);
    });

    socket.on("error", (data) => {
      console.error("Socket error:", data.message);
    });

    return () => {
      socket.off("rooms");
      socket.off("error");
    };
  }, [socket]);

  // Fetch rooms when connection status changes
  useEffect(() => {
    if (socketIsConnected) {
      fetchRooms();
    }
  }, [socketIsConnected, fetchRooms]);

  useEffect(() => {
    if (rooms.length > 0 && address) {
      const room = rooms.find((room) =>
        room.members.some((member) => member.address === address)
      );
      setCurrentRoom(room || null);
    }
  }, [socketIsConnected, socket, rooms, address, setCurrentRoom]);

  useEffect(() => {
    if (currentRoom) {
      socket.once("WsGameStartingEvent", () => {
        setIsGameStarting(true);
        router.push(`/game/${currentRoom?.roomId}`);
      });
    }
  }, [currentRoom, router, socket]);

  const createRoom = useCallback(
    (address: string): Promise<Room> => {
      return new Promise((resolve, reject) => {
        if (!socketIsConnected || !socket) {
          reject(new Error("WebSocket is not connected"));
          return;
        }

        // Listen for error events
        const handleError = (data: { message: string }) => {
          console.error("Create room error:", data.message);
          reject(new Error(data.message));
          socket.off("error", handleError);
        };

        socket.on("error", handleError);

        socket.emit("createRoom", { address });

        socket.once("roomCreated", (data) => {
          console.log("Room created:", data);
          socket.off("error", handleError);
          resolve(data);
          // Refresh room list after creating a room
          fetchRooms();
        });
      });
    },
    [socketIsConnected, socket, fetchRooms]
  );

  const joinRoom = useCallback(
    (address: string, roomId: string): Promise<Room> => {
      return new Promise((resolve, reject) => {
        if (!socketIsConnected || !socket) {
          reject(new Error("WebSocket is not connected"));
          return;
        }

        // Listen for error events
        const handleError = (data: { message: string }) => {
          console.error("Join room error:", data.message);
          reject(new Error(data.message));
          socket.off("error", handleError);
        };

        socket.on("error", handleError);

        socket.emit("joinRoom", { address, roomId });

        socket.once("userJoined", (data) => {
          console.log("User joined:", data);
          socket.off("error", handleError);
          resolve(data);
          // Refresh room list after joining a room
          fetchRooms();
        });
      });
    },
    [socketIsConnected, socket, fetchRooms]
  );

  const leaveRoom = useCallback((): Promise<Room> => {
    return new Promise((resolve, reject) => {
      if (!socketIsConnected || !socket) {
        reject(new Error("WebSocket is not connected"));
        return;
      }

      // Listen for error events
      const handleError = (data: { message: string }) => {
        console.error("Leave room error:", data.message);
        reject(new Error(data.message));
        socket.off("error", handleError);
      };

      socket.on("error", handleError);

      socket.emit("leaveRoom");

      socket.once("userLeft", (data) => {
        console.log("User left:", data);
        socket.off("error", handleError);
        resolve(data);
        // Refresh room list after leaving a room
        fetchRooms();
      });
    });
  }, [socketIsConnected, socket, fetchRooms]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
    }
  }, [socket]);

  const startGame = useCallback(
		async (): Promise<void> => {
			try {
				if (!socketIsConnected || !socket) {
					throw new Error("WebSocket is not connected");
				}

				// 通知其他玩家遊戲已開始
				socket.emit("startGame");
			} catch (error) {
				console.error("Failed to start game:", error);
				throw error; // 重新拋出錯誤，讓調用者可以處理
			}
		},
		[socketIsConnected, socket]
  );

  return {
    isConnecting: socketIsConnecting,
    isConnected: socketIsConnected,
    isGameStarting,
    socketId: socketSocketId || "",
    connectionError: socketConnectionError,
    rooms,
    currentRoom,
    createRoom,
    joinRoom,
    leaveRoom,
    startGame,
    disconnect,
  };
};
