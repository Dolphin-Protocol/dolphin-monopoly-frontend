"use client";

import { useState, useCallback } from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import {
	getOwnedAdminCaps,
	getHouseRegistry,
	HouseCellClass,
	newIdleCell,
	setupGameCreation,
	SharedObjectInput,
	executeTransaction,
} from "@sui-dolphin/monopoly-sdk";
import {
	ChanceCellClass,
	getChanceRegistry,
} from "@sui-dolphin/monopoly-sdk/cells/chance_cell";
import { Transaction, TransactionResult } from "@mysten/sui/transactions";
import { Cell } from "@sui-dolphin/monopoly-sdk/_generated/monopoly/cell/structs";
import { HouseCell } from "@sui-dolphin/monopoly-sdk/_generated/monopoly/house-cell/structs";
import { ChanceCell } from "@sui-dolphin/monopoly-sdk/_generated/monopoly/chance-cell/structs";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import clientConfig from "@/configs/clientConfig";

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

const adminAddress = clientConfig.ADMIN_ADDRESS;
const adminSecretKey = clientConfig.ADMIN_SECRET_KEY;

function createAdminKeypair() {
	try {
		const { secretKey } = decodeSuiPrivateKey(adminSecretKey);
		return Ed25519Keypair.fromSecretKey(secretKey);
	} catch (error) {
		console.error("Error creating admin keypair:", error);
		return null;
	}
}

export const useInitGame = (): UseInitGameReturn => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [houseClass, setHouseClass] = useState<HouseCellClass | null>(null);
	const [chanceClass, setChanceClass] = useState<ChanceCellClass | null>(
		null
	);
	const [adminCap, setAdminCap] = useState<any | null>(null);

	const suiClient = useSuiClient();

	// 初始化資源
	const initResources = useCallback(async () => {
		if (!adminAddress || !adminSecretKey) {
			setError("No admin address or secret key");
			return null;
		}

		try {
			// 1. 獲取管理員權限
			const adminCaps = await getOwnedAdminCaps(suiClient, adminAddress);
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
	}, [suiClient]);

	// 創建遊戲
	const initGame = useCallback(
		async (playerAddresses: string[]) => {
			if (!adminAddress || !adminSecretKey) {
				setError("No admin address or secret key");
				return null;
			}

			setIsLoading(true);
			setError(null);

			try {
				// 創建Admin Keypair
				const adminKeypair = createAdminKeypair();
				if (!adminKeypair) {
					throw new Error("Failed to create admin keypair");
				}

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

				const vec = [...Array(12).keys()];
				vec.forEach((idx) => {
					if (idx == 0 || idx == 3) {
						// idle cell
						const { cell, ptb: ptb_ } = newIdleCell(
							idx.toString(),
							ptb
						);
						cells.push({ typeName: Cell.$typeName, cell });
						ptb = ptb_;
					} else if (idx == 6 || idx == 9) {
						// chance cell
						const { cell, ptb: ptb_ } = chanceClass.newChanceCell(
							"chance",
							ptb
						);
						cells.push({
							typeName: ChanceCell.$typeName,
							cell,
						});
						ptb = ptb_;
					} else {
						// hose cell
						const { cell, ptb: ptb_ } = houseClass.newCell(
							idx.toString(),
							ptb
						);
						cells.push({ typeName: HouseCell.$typeName, cell });
						ptb = ptb_;
					}
				});

				// 3. 設置遊戲參數
				const maxRound = BigInt(20);
				const maxSteps = 6;
				const salary = BigInt(200);
				const initialFunds = BigInt(1500);

				// 4. 創建遊戲
				let finalPlayerAddresses = [...playerAddresses];
				console.log("finalPlayerAddresses", finalPlayerAddresses);

				ptb = setupGameCreation(
					adminCap,
					finalPlayerAddresses,
					maxRound,
					maxSteps,
					salary,
					cells,
					initialFunds,
					adminAddress,
					ptb
				);

				// 5. 執行交易
				const result = await executeTransaction(
					suiClient,
					adminKeypair,
					ptb,
					{
						showEvents: true,
					}
				);

				console.log("Game creation successful:", result);
				return result;
			} catch (err: any) {
				console.error("Init game failed:", err);
				setError(err.message || "Init game failed");
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[adminAddress, adminSecretKey, suiClient, initResources]
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
