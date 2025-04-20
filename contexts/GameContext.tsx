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

interface GameContextType {
  turnAddress: string | null;
  isTurn: boolean;
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

  useEffect(() => {
    if (!socket) return;
    socket.on("WsTurnEvent", (data) => {
      setTurnAddress(data.player);
      setIsTurn(data.player === address);
    });

    socket.on("error", (data) => {
      console.error("Socket error:", data.message);
    });

    return () => {
      socket.off("WsTurnEvent");
      socket.off("error");
    };
  }, [address, socket]);

  const value = {
    turnAddress,
    isTurn,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export default GameContext;
