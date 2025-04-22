"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { Room } from "@/types/game";
import { useCustomWallet } from "./WalletContext";

const SOCKET_URL = "http://5.183.11.9:3003";

interface ServerToClientEvents {
  rooms: (data: { rooms: Room[] }) => void;
  roomCreated: (data: Room) => void;
  userJoined: (data: Room) => void;
  userLeft: (data: Room) => void;
  gameStarted: () => void;
  WsTurnEvent: (data: { player: string }) => void;
  WsGameStartingEvent: (data: Room) => void;
  error: (data: { message: string }) => void;
}

interface ClientToServerEvents {
  rooms: () => void;
  createRoom: (data: { address: string }) => void;
  joinRoom: (data: { roomId: string; address: string }) => void;
  leaveRoom: () => void;
  startGame: () => void;
  WsTurnEvent: () => void;
}

interface SocketContextType {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  socketId: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  connectionError: string;
  reconnect: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const useSocketContext = useSocket;

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string>("");
  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  const { isConnected: isWalletConnected, address } = useCustomWallet();

  const initSocket = () => {
    if (socket) {
      socket.disconnect();
    }

    console.log("正在初始化 Socket 连接...");
    setIsConnecting(true);
    setConnectionError("");

    const socketInstance = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      auth: address ? { address } : undefined,
    });
    console.log("socketInstance", socketInstance);

    setSocket(socketInstance);
    return socketInstance;
  };

  const reconnect = () => {
    console.log("手动重连 Socket...");
    initSocket();
  };

  useEffect(() => {
    let socketInstance: Socket<
      ServerToClientEvents,
      ClientToServerEvents
    > | null = null;

    if (isWalletConnected && address) {
      const timer = setTimeout(() => {
        socketInstance = initSocket();
      }, 100);

      return () => {
        clearTimeout(timer);
        if (socketInstance) {
          socketInstance.disconnect();
        }
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
        setSocketId(null);
      }
    }
  }, [isWalletConnected, address]);

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      setIsConnecting(false);
      setIsConnected(true);
      setSocketId(socket.id || null);
      setConnectionError("");
      console.log("连接到 WebSocket 服务器成功", socket.id);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setSocketId(null);
      console.log("与 WebSocket 服务器断开连接");
    };

    const handleConnectError = (error: Error) => {
      setIsConnecting(false);
      setIsConnected(false);
      setSocketId(null);
      setConnectionError(error.message || "连接错误");
      console.log("Socket 连接错误:", error.message);
    };

    const handleError = (data: { message: string }) => {
      console.log("服务器错误:", data.message);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("error", handleError);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("error", handleError);
    };
  }, [socket]);

  const value = {
    socket: socket as Socket<ServerToClientEvents, ClientToServerEvents>,
    socketId,
    isConnecting,
    isConnected,
    connectionError,
    reconnect,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export default SocketContext;
