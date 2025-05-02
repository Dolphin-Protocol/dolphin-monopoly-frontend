// hooks/game/useRollDice.tsx
"use client";

import { useCallback, useState } from "react";
import { useCustomWallet } from "@/contexts/WalletContext";
import { useGameActionContext } from "@/contexts/GameActionContext";

interface UseRollDiceReturn {
	isLoading: boolean;
	error: string | null;
	rollDice: () => Promise<any>;
}

export const useRollDice = (): UseRollDiceReturn => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { game, fetchTurnCap } = useGameActionContext();
	const { address, executeTransactionWithoutSponsorship } = useCustomWallet();

	const rollDice = useCallback(async () => {
		if (!game) {
			setError("No active game");
			return null;
		}

		if (!address) {
			setError("No wallet connected");
			return null;
		}

		const turnCap = await fetchTurnCap();
		if (!turnCap) {
			setError("No turnCap");
			return null;
		}

		setIsLoading(true);

		try {
			// 創建骰子擲出交易
			const ptb = game.playerMove(address, turnCap);

			// 執行交易
			const result = await executeTransactionWithoutSponsorship({
				tx: ptb,
				options: { showEvents: true },
			});

			// 解析骰子事件
			// 這邊應該會由 socket 來處理
			if (!result) {
				throw new Error("Failed to roll dice");
			}
			const rollDiceEvents = game.parseRollDiceEvent(result);
			return rollDiceEvents;
		} catch (err: any) {
			console.error("Error rolling dice:", err);
			setError(err.message || "Failed to roll dice");
			return null;
		} finally {
			setIsLoading(false);
		}
	}, [game, address, executeTransactionWithoutSponsorship, fetchTurnCap]);

	return {
		isLoading,
		error,
		rollDice,
	};
};
