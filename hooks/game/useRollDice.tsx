// hooks/game/useRollDice.tsx
"use client";

import { useCallback, useState } from "react";
import { useCustomWallet } from "@/contexts/WalletContext";
import { useGameActionContext } from "@/contexts/GameActionContext";
import { TurnCap } from "@sui-dolphin/monopoly-sdk/_generated/monopoly/monopoly/structs";

interface UseRollDiceReturn {
	isLoading: boolean;
	error: string | null;
	rollDice: (turnCap: TurnCap) => Promise<any>;
}

export const useRollDice = (): UseRollDiceReturn => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { game, setGameLoading, setGameError } = useGameActionContext();
	const { address, sponsorAndExecuteTransactionBlock } = useCustomWallet();

	const rollDice = useCallback(
		async (turnCap: TurnCap) => {
			if (!game) {
				setError("No active game");
				return null;
			}

			if (!address) {
				setError("No wallet connected");
				return null;
			}

			setIsLoading(true);

			try {
				// 創建骰子擲出交易
				const ptb = game.playerMove(address, turnCap);

				// 執行交易
				const result = await sponsorAndExecuteTransactionBlock({
					tx: ptb,
					network: "testnet",
					options: { showEvents: true },
					includesTransferTx: true,
				});

				// 解析骰子事件
				// 這邊應該會由 socket 來處理
				const rollDiceEvents = game.parseRollDiceEvent(result);
				return rollDiceEvents;
			} catch (err: any) {
				console.error("Error rolling dice:", err);
				setError(err.message || "Failed to roll dice");
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[
			game,
			address,
			sponsorAndExecuteTransactionBlock,
			setGameLoading,
			setGameError,
		]
	);

	return {
		isLoading,
		error,
		rollDice,
	};
};
