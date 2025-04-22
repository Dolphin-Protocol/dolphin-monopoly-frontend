"use client";

import React, {
	createContext,
	useState,
	useEffect,
	useCallback,
	useContext,
	ReactNode,
} from "react";
import { useCustomWallet } from "@/contexts/WalletContext";
import { useSuiClient } from "@mysten/dapp-kit";
import { MonopolyGame, getOwnedGames } from "@sui-dolphin/monopoly-sdk";
import { Game } from "@sui-dolphin/monopoly-sdk/_generated/monopoly/monopoly/structs";
import { fromBase64 } from "@mysten/sui/utils";

interface GameActionContextType {
	game: MonopolyGame | null;
	isLoading: boolean;
	error: string | null;
	fetchGameById: (gameId: string) => Promise<MonopolyGame | null>;
	setGameError: (error: string | null) => void;
	setGameLoading: (loading: boolean) => void;
}

const GameActionContext = createContext<GameActionContextType>({
	game: null,
	isLoading: false,
	error: null,
	fetchGameById: async () => null,
	setGameError: () => {},
	setGameLoading: () => {},
});

export const useGameActionContext = () => useContext(GameActionContext);

const getStoredGameId = () => {
	if (typeof window !== "undefined") {
		return localStorage.getItem("currentGameId");
	}
	return null;
};

const storeGameId = (gameId: string) => {
	if (typeof window !== "undefined") {
		localStorage.setItem("currentGameId", gameId);
	}
};

export const GameActionProvider = ({ children }: { children: ReactNode }) => {
	const [game, setGame] = useState<MonopolyGame | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const suiClient = useSuiClient();

	const fetchGameById = useCallback(
		async (gameId: string) => {
			if (!gameId) {
				setError("No game ID provided");
				return null;
			}

			setIsLoading(true);
			setError(null);

			try {
				const gameObj = await suiClient.getObject({
					id: gameId,
					options: { showBcs: true },
				});

				console.log("gameObj", gameObj);

				if (!gameObj.data) {
					throw new Error("Game not found");
				}

				// 類型斷言來解決 TypeScript 錯誤
				const bcsData = gameObj.data.bcs as any;
				if (!bcsData || !bcsData.bcsBytes) {
					throw new Error("Game BCS data not available");
				}

				const gameData = Game.fromBcs(
					fromBase64(bcsData.bcsBytes)
				);

				console.log("gameData", gameData);

				const newGame = new MonopolyGame(gameData);

				console.log("newGame", newGame);

				storeGameId(gameId);
				setGame(newGame);

				return newGame;
			} catch (err: any) {
				console.error("Error fetching game by ID:", err);
				setError(err.message || "Error fetching game");
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[suiClient]
	);


	// 初始化：優先使用存儲的遊戲ID，否則嘗試獲取用戶擁有的遊戲
	useEffect(() => {
		fetchGameById("0xafc0767a06a540eb43865e05b432523af2adba54e21fa4ea3bacebcc445f98a8");

		console.log("game", game);
	}, [fetchGameById]);

	return (
		<GameActionContext.Provider
			value={{
				game,
				isLoading,
				error,
				fetchGameById,
				setGameError: setError,
				setGameLoading: setIsLoading,
			}}
		>
			{children}
		</GameActionContext.Provider>
	);
};
