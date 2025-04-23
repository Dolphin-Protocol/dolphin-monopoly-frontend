"use client";

import React, {
	createContext,
	useState,
	useEffect,
	useCallback,
	useContext,
	ReactNode,
} from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import { MonopolyGame } from "@sui-dolphin/monopoly-sdk";
import {
	Game,
	TurnCap,
} from "@sui-dolphin/monopoly-sdk/_generated/monopoly/monopoly/structs";
import { fromBase64 } from "@mysten/sui/utils";

interface GameActionContextType {
	game: MonopolyGame | null;
	turnCap: TurnCap | null;
	isLoading: boolean;
	error: string | null;
	fetchGameById: (gameId: string) => Promise<MonopolyGame | null>;
	fetchTurnCapById: (turnCapId: string) => Promise<TurnCap | null>;
	setError: (error: string | null) => void;
	setIsLoading: (loading: boolean) => void;
}

const GameActionContext = createContext<GameActionContextType>({
	game: null,
	turnCap: null,
	isLoading: false,
	error: null,
	fetchGameById: async () => null,
	fetchTurnCapById: async () => null,
	setError: () => {},
	setIsLoading: () => {},
});

export const useGameActionContext = () => useContext(GameActionContext);

export const GameActionProvider = ({ children }: { children: ReactNode }) => {
	const [game, setGame] = useState<MonopolyGame | null>(null);
	const [turnCap, setTurnCap] = useState<TurnCap | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const suiClient = useSuiClient();

	// 通過ID獲取 TurnCap
	const fetchTurnCapById = useCallback(
		async (turnCapId: string) => {
			if (!turnCapId) {
				setError("No TurnCap ID provided");
				return null;
			}

			setIsLoading(true);
			setError(null);

			try {
				// 直接獲取 TurnCap 對象
				const turnCapObj = await suiClient.getObject({
					id: turnCapId,
					options: { showBcs: true },
				});

				console.log("turnCapObj", turnCapObj);

				if (!turnCapObj.data) {
					throw new Error("TurnCap not found");
				}

				// 類型斷言來解決 TypeScript 錯誤
				const bcsData = turnCapObj.data.bcs as any;
				if (!bcsData || !bcsData.bcsBytes) {
					throw new Error("TurnCap BCS data not available");
				}

				const turnCapData = TurnCap.fromBcs(
					fromBase64(bcsData.bcsBytes)
				);

				console.log("turnCapData", turnCapData);

				setTurnCap(turnCapData);
				return turnCapData;
			} catch (err: any) {
				console.error("Error fetching TurnCap by ID:", err);
				setError(err.message || "Error fetching TurnCap");
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[suiClient]
	);

	// 通過ID獲取遊戲
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

				const gameData = Game.fromBcs(fromBase64(bcsData.bcsBytes));

				console.log("gameData", gameData);

				const newGame = new MonopolyGame(gameData);

				console.log("newGame", newGame);

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

	useEffect(() => {
		// 固定的遊戲ID
		const gameId =
			"0x3cf4a59c212e2e22b4fab7f2d144835660b6700768a5295a8618ea0b2d99a4a2";
		fetchGameById(gameId);

		// 固定的 TurnCap ID
		const turnCapId =
			"0xad49c2ba35a6547fcc7501bbb1ed1bb83dd16cf93461b0297fc6244a1414742b";
		fetchTurnCapById(turnCapId);
	}, [fetchGameById, fetchTurnCapById]);

	return (
		<GameActionContext.Provider
			value={{
				game,
				turnCap,
				isLoading,
				error,
				fetchGameById,
				fetchTurnCapById,
				setError,
				setIsLoading,
			}}
		>
			{children}
		</GameActionContext.Provider>
	);
};
