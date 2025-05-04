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
import { getGame, MonopolyGame } from "@sui-dolphin/monopoly-sdk";
import {
	Game,
	TurnCap,
} from "@sui-dolphin/monopoly-sdk/_generated/monopoly/monopoly/structs";
import { fromBase64 } from "@mysten/sui/utils";
import { useCustomWallet } from "./WalletContext";
import { useGame } from "./GameContext";

interface GameActionContextType {
	game: MonopolyGame | null;
	turnCap: TurnCap | null;
	rounds: number | null;	
	isLoading: boolean;
	error: string | null;
	fetchGameById: (gameId: string) => Promise<MonopolyGame | null>;
	fetchTurnCap: () => Promise<TurnCap | null>;
	fetchRounds: () => Promise<number | undefined>;
	setError: (error: string | null) => void;
	setIsLoading: (loading: boolean) => void;
}

const GameActionContext = createContext<GameActionContextType>({
	game: null,
	turnCap: null,
	rounds: null,
	isLoading: false,
	error: null,
	fetchGameById: async () => null,
	fetchTurnCap: async () => null,
	fetchRounds: async () => undefined,
	setError: () => {},
	setIsLoading: () => {},
});

export const useGameActionContext = () => useContext(GameActionContext);

export const GameActionProvider = ({ children }: { children: ReactNode }) => {
	const [game, setGame] = useState<MonopolyGame | null>(null);
	const [turnCap, setTurnCap] = useState<TurnCap | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { address } = useCustomWallet();
	const { roomData, isTurn } = useGame();
	const [rounds, setRounds] = useState<number | null>(null);
	const suiClient = useSuiClient();

	const fetchTurnCap = useCallback(
		async () => {
			if (!game) {
				setError("No game provided");
				return null;
			}

			if (!address) {
				setError("No address provided");
				return null;
			}

			console.log("address", address);

			setIsLoading(true);
			setError(null);

			try {
				const turnCapObj = await game.getOwnedTurnCap(suiClient, address);
				console.log("turnCapObj", turnCapObj);

				if (!turnCapObj[0]) {
					setTurnCap(null);
					return null;
				}

				setTurnCap(turnCapObj[0]);
				return turnCapObj[0];
			} catch (err: any) {
				console.error("Error fetching TurnCap by ID:", err);
				setError(err.message || "Error fetching TurnCap");
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[suiClient, game, address]
	);

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

				const newGame = new MonopolyGame(gameData);

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

	const fetchRounds = useCallback(async () => {
		if (!game?.game.id || !address) return;
		const gameObj = await getGame(suiClient, game.game.id);
		const rounds = Number(gameObj.plays);
		setRounds(rounds);
		return rounds;
	}, [game, suiClient]);

	useEffect(() => {
		if (!roomData?.roomInfo?.gameId || !address) return;
		const gameId = roomData.roomInfo.gameId;
		fetchGameById(gameId);
	}, [roomData, address, fetchGameById]);

	useEffect(() => {
		if (!game || !address) return;
		fetchTurnCap();
	}, [game, address, fetchTurnCap, isTurn]);

	useEffect(() => {
		if (!game || !address) return;
		fetchRounds();
	}, [game, address, fetchRounds]);

	return (
		<GameActionContext.Provider
			value={{
				game,
				turnCap,
				rounds,
				isLoading,
				error,
				fetchGameById,
				fetchTurnCap,
				fetchRounds,
				setError,
				setIsLoading,
			}}
		>
			{children}
		</GameActionContext.Provider>
	);
};
