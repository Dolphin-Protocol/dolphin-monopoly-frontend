// contexts/GameContext.tsx
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

interface GameActionContextType {
	game: MonopolyGame | null;
	isLoading: boolean;
	error: string | null;
	fetchGame: () => Promise<MonopolyGame | null>;
	setGameError: (error: string | null) => void;
	setGameLoading: (loading: boolean) => void;
}

const GameActionContext = createContext<GameActionContextType>({
	game: null,
	isLoading: false,
	error: null,
	fetchGame: async () => null,
	setGameError: () => {},
	setGameLoading: () => {},
});

export const useGameActionContext = () => useContext(GameActionContext);

export const GameActionProvider = ({ children }: { children: ReactNode }) => {
	const [game, setGame] = useState<MonopolyGame | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { address } = useCustomWallet();
	const suiClient = useSuiClient();

	const fetchGame = useCallback(async () => {
		if (!address) return null;

		setIsLoading(true);
		setError(null);

		try {
			const ownedGames = await getOwnedGames(suiClient, address);
			if (ownedGames.length === 0) {
				setError("No owned games found");
				return null;
			}

			const newGame = new MonopolyGame(ownedGames[0]);
			setGame(newGame);
			return newGame;
		} catch (err: any) {
			console.error("Error fetching game:", err);
			setError(err.message || "Error fetching game");
			return null;
		} finally {
			setIsLoading(false);
		}
	}, [address, suiClient]);

	useEffect(() => {
		if (address && !game) {
			fetchGame();
		}
	}, [address, game, fetchGame]);

	return (
		<GameActionContext.Provider
			value={{
				game,
				isLoading,
				error,
				fetchGame,
				setGameError: setError,
				setGameLoading: setIsLoading,
			}}
		>
			{children}
		</GameActionContext.Provider>
	);
};
