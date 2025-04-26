"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useCustomWallet } from "./WalletContext";
import { useSocket } from "./SocketContext";
import { ApiRoomData } from "../types/socket";
import { useParams } from "next/navigation";

interface GameContextType {
  turnAddress: string | null;
  isTurn: boolean;
  roomData: ApiRoomData | null;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

export const useGameContext = useGame;

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const { socket } = useSocket();
  const { address } = useCustomWallet();

  const [turnAddress, setTurnAddress] = useState<string | null>(null);
  const [isTurn, setIsTurn] = useState<boolean>(false);
  const [roomData, setRoomData] = useState<ApiRoomData | null>(null);

  const { roomId } = useParams<{ roomId: string }>();

  useEffect(() => {
    if (!socket) return;
    if (!roomId) return;

    socket.emit("gameState", { roomId });

    socket.on("WsTurnEvent", (data) => {
      setTurnAddress(data.player);
      setIsTurn(data.player === address);
    });
    socket.on("gameState", (data) => {
      if (!data) return;
      setRoomData(data.gameState);
    });

    socket.on("error", (data) => {
      console.error("Socket error:", data.message);
    });

    return () => {
      socket.off("WsTurnEvent");
      socket.off("error");
    };
  }, [address, socket, roomId]);

  const value = {
    turnAddress,
    isTurn,
    roomData,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export default GameContext;
