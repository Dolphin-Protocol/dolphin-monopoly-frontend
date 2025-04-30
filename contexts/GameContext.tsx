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
	socket.emit("ChangeTurn", { roomId });

	socket.on("gameState", (data) => {
	  console.log("gameState", data);
	  if (!data) return;
	  setRoomData(data.gameState);
	});

    socket.on("ChangeTurn", (data) => {
      console.log("ChangeTurn", data);
      setTurnAddress(data.player);
      setIsTurn(data.player === address);
    });
    socket.on("Move", (data) => {
      console.log("Move", data);
    });
    socket.on("ActionRequest", (data) => {
      console.log("ActionRequest", data);
    });
    socket.on("Buy", (data) => {
      console.log("Buy", data);
    });

    socket.on("error", (data) => {
      console.error("Socket error:", data.message);
    });

    return () => {
      socket.off("ChangeTurn");
      socket.off("error");
      socket.off("gameState");
      socket.off("Move");
      socket.off("ActionRequest");
      socket.off("Buy");
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
