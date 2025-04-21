"use client";

import { useState, useCallback } from "react";
import { useCustomWallet } from "@/contexts/WalletContext";
import { useSuiClient } from "@mysten/dapp-kit";
import {
	getOwnedAdminCaps,
	getHouseRegistry,
	HouseCellClass,
	MonopolyGame,
	newIdleCell,
	setupGameCreation,
	SharedObjectInput,
} from "@sui-dolphin/monopoly-sdk";
import {
	ChanceCellClass,
	getChanceRegistry,
} from "@sui-dolphin/monopoly-sdk/cells/chance_cell";
import { Transaction, TransactionResult } from "@mysten/sui/transactions";
import { Cell } from "@sui-dolphin/monopoly-sdk/_generated/monopoly/cell/structs";
import { HouseCell } from "@sui-dolphin/monopoly-sdk/_generated/monopoly/house-cell/structs";
import { ChanceCell } from "@sui-dolphin/monopoly-sdk/_generated/monopoly/chance-cell/structs";

const HOUSE_REGISTRY_CONFIG: SharedObjectInput = {
	objectId:
		"0xcc0f76b05ed305bb65bf015ceaac4adf15463d6740d0dddca232649798071352",
	initialSharedVersion: 390467302,
};

const CHANCE_REGISTRY_CONFIG: SharedObjectInput = {
	objectId:
		"0x0503cf72f4d0d7919f63c5e12ece7c197ea18e76c74838785397a6cca9c14d27",
	initialSharedVersion: 390467302,
};

interface UseInitGameReturn {
	isLoading: boolean;
	error: string | null;
	initGame: (playerAddresses: string[]) => Promise<any>;
	houseClass: HouseCellClass | null;
	chanceClass: ChanceCellClass | null;
	adminCap: any | null;
}

export const useInitGame = (): UseInitGameReturn => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [houseClass, setHouseClass] = useState<HouseCellClass | null>(null);
	const [chanceClass, setChanceClass] = useState<ChanceCellClass | null>(
		null
	);
	const [adminCap, setAdminCap] = useState<any | null>(null);

	const { address, sponsorAndExecuteTransactionBlock } = useCustomWallet();
	const suiClient = useSuiClient();

	// 初始化資源
	const initResources = useCallback(async () => {
		if (!address) {
			setError("No wallet connected");
			return null;
		}

		try {
			// 1. 獲取管理員權限
			const adminCaps = await getOwnedAdminCaps(suiClient, address);
			if (adminCaps.length === 0) {
				throw new Error("No admin cap found");
			}
			setAdminCap(adminCaps[0]);

			// 2. 獲取房屋註冊表
			const houseRegistry = await getHouseRegistry(
				suiClient,
				HOUSE_REGISTRY_CONFIG.objectId
			);
			const newHouseClass = new HouseCellClass({
				registry: houseRegistry,
				config: HOUSE_REGISTRY_CONFIG,
			});
			setHouseClass(newHouseClass);

			// 3. 獲取機會註冊表
			const chanceRegistry = await getChanceRegistry(
				suiClient,
				CHANCE_REGISTRY_CONFIG.objectId
			);
			const newChanceClass = new ChanceCellClass({
				registry: chanceRegistry,
				config: CHANCE_REGISTRY_CONFIG,
			});
			setChanceClass(newChanceClass);

			return {
				adminCap: adminCaps[0],
				houseClass: newHouseClass,
				chanceClass: newChanceClass,
			};
		} catch (err: any) {
			console.error("Error initializing resources:", err);
			setError(err.message || "Failed to initialize resources");
			return null;
		}
	}, [address, suiClient]);

	// 創建遊戲
	const initGame = useCallback(
		async (playerAddresses: string[]) => {
			if (!address) {
				setError("No wallet connected");
				return null;
			}

			setIsLoading(true);
			setError(null);

			try {
				// 1. 首先初始化所需資源
				const resources = await initResources();
				if (!resources) {
					throw new Error("Failed to initialize resources");
				}

				const { adminCap, houseClass, chanceClass } = resources;

				// 2. 創建遊戲格子
				let ptb = new Transaction();
				const cells: { cell: TransactionResult; typeName: string }[] =
					[];

				// 創建 12 個格子的棋盤 (4x3)
				for (let i = 0; i < 12; i++) {
					if (i === 0 || i === 3 || i === 6 || i === 9) {
						// 空閒格子 (角落格子)
						const { cell, ptb: newPtb } = newIdleCell(
							i.toString(),
							ptb
						);
						cells.push({ typeName: Cell.$typeName, cell });
						ptb = newPtb;
					} else if (i === 2 || i === 8) {
						// 機會格子
						const { cell, ptb: newPtb } = chanceClass.newChanceCell(
							"chance",
							ptb
						);
						cells.push({ typeName: ChanceCell.$typeName, cell });
						ptb = newPtb;
					} else {
						// 房屋格子
						const { cell, ptb: newPtb } = houseClass.newCell(
							i.toString(),
							ptb
						);
						cells.push({ typeName: HouseCell.$typeName, cell });
						ptb = newPtb;
					}
				}

				// 3. 設置遊戲參數
				const maxRound = BigInt(20);
				const maxSteps = 6;
				const salary = BigInt(200);
				const initialFunds = BigInt(1500);

				// 4. 創建遊戲
				ptb = setupGameCreation(
					adminCap,
					playerAddresses,
					maxRound,
					maxSteps,
					salary,
					cells,
					initialFunds,
					address,
					ptb
				);

				// 5. 執行交易
				const result = await sponsorAndExecuteTransactionBlock({
					tx: ptb,
					network: "testnet",
					options: { showEvents: true },
					includesTransferTx: true,
				});

				return result;
			} catch (err: any) {
				console.error("Init game failed:", err);
				setError(err.message || "Init game failed");
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[address, suiClient, sponsorAndExecuteTransactionBlock, initResources]
	);

	return {
		isLoading,
		error,
		initGame,
		houseClass,
		chanceClass,
		adminCap,
	};
};
