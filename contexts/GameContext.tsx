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
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const API_BASE_URL = "http://5.183.11.9:3003";

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { roomId } = useParams<{ roomId: string }>();

  console.log(roomId);

  const fetchGameState = async () => {
		if (!roomId) {
			setError("Room ID is not found");
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			const response = await fetch(
				`${API_BASE_URL}/monopoly/game-state?roomId=${roomId}`
			);

			if (!response.ok) {
				throw new Error(`API request failed: ${response.status}`);
			}

			const data: ApiRoomData = await response.json();
			console.log(data);
			setRoomData(data);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to get game state");
			console.error("Failed to get game state:", err);
		} finally {
			setLoading(false);
		}
  };

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

  useEffect(() => {
    fetchGameState();
  }, [roomId]);

  const value = {
    turnAddress,
    isTurn,
    roomData,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export default GameContext;
