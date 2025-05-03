"use client";

import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
	ReactNode,
} from "react";
import { useCustomWallet } from "./WalletContext";
import { HouseCell, useSocket } from "./SocketContext";
import { ApiRoomData } from "../types/socket";
import { useParams } from "next/navigation";
import { PlayerState } from "@/types/game";
import { initializeDefaultPlayers } from "@/utils/gameAdapter";

interface GameContextType {
	turnAddress: string | null;
	isTurn: boolean;
	roomData: ApiRoomData | null;
	messages: string[];
	playerState: PlayerState | null;
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
	const [roomData, setRoomData] = useState<ApiRoomData | null>(null);
	const [messages, setMessages] = useState<string[]>([]);
	const [playerState, setPlayerState] = useState<PlayerState | null>(null);

	const { roomId } = useParams<{ roomId: string }>();

	// 定義每個事件處理器為 useCallback 函數
	const handleGameState = useCallback(
		(data: any) => {
			console.log("gameState", data);
			if (!data) return;
			setRoomData(data.gameState);
			const players = initializeDefaultPlayers(data.gameState);
			const selectedPlayer = players.find(
				(player) => player.address === address
			);
			if (!selectedPlayer) return;
			setPlayerState(selectedPlayer);
		},
		[address]
	);

	const handleChangeTurn = useCallback(
		(data: any) => {
			if (!data.player) return;
			console.log("ChangeTurn", data);
			setTurnAddress(data.player);
			setIsTurn(data.player === address);
		},
		[address]
	);

	const handleMove = useCallback(
		(data: any) => {
			console.log("Move", data);
			if (!data.player) return;

			if (data.player === address) {
				setPlayerState((prev) => {
					if (!prev) return null;
					return {
						...prev,
						positionIndex: data.position,
					};
				});
			}

			setMessages((prevMessages) => [
				...prevMessages,
				`${data.player.slice(0, 5)}... move to ${data.position}`,
			]);
		},
		[address]
	);

	const handleActionRequest = useCallback((data: any) => {
		console.log("ActionRequest", data);
		if (!data.player) return;

		setMessages((prevMessages) => [
			...prevMessages,
			`${data.player.slice(0, 5)}... action request`,
		]);
	}, []);

	const handleBuy = useCallback(
		(data: {
			player: string;
			purchased: boolean;
			houseCell: HouseCell;
		}) => {
			if (!data.player) return;
			console.log("Buy", data);
			const level = data.houseCell.level;
			const price = data.houseCell.buyPrice[level - 1].price;

			if (data.purchased && data.player === address) {
				setPlayerState((prev) => {
					if (!prev) return null;
					return {
						...prev,
						assets: prev.assets - Number(price),
					};
				});
			}

			setMessages((prevMessages) => [
				...prevMessages,
				`${data.player.slice(
					0,
					5
				)}... buy/upgrade house for ${price} to level ${level}`,
			]);
		},
		[address]
	);

	const handlePayHouseToll = useCallback(
		(data: {
			player: string;
			houseCell: HouseCell;
			paidAmount: number;
			payee: string;
			level: number;
		}) => {
			if (!data.player) return;
			const price = data.houseCell.rentPrice[data.level - 1].price;

			if (data.player === address) {
			setPlayerState((prev) => {
				if (!prev) return null;
				return {
					...prev,
					assets: prev.assets - Number(price),
				};
				});
			}

			if (data.payee === address) {
				setPlayerState((prev) => {
					if (!prev) return null;
					return {
						...prev,
						assets: prev.assets + Number(price),
					};
				});
			}
			setMessages((prevMessages) => [
				...prevMessages,
				`${data.player.slice(0, 5)}... pay rent for ${price}`,
			]);
		},
		[]
	);

	const handleError = useCallback((data: any) => {
		console.error("Socket error:", data.message);
	}, []);

	// 主要 useEffect 只負責設置和清除事件監聽器
	useEffect(() => {
		if (!socket) return;
		if (!roomId) return;

		const checkSocketAndSendRequests = () => {
			if (socket.connected) {
				setTimeout(() => {
					socket.emit("gameState", { roomId });
				}, 2000);
			} else {
				setTimeout(checkSocketAndSendRequests, 1000);
			}
		};

		checkSocketAndSendRequests();

		// 設置所有事件監聽器
		socket.on("gameState", handleGameState);
		socket.on("ChangeTurn", handleChangeTurn);
		socket.on("Move", handleMove);
		socket.on("ActionRequest", handleActionRequest);
		socket.on("Buy", handleBuy);
		socket.on("PayHouseToll", handlePayHouseToll);
		socket.on("error", handleError);

		return () => {
			// 清理所有事件監聽器
			socket.off("gameState", handleGameState);
			socket.off("ChangeTurn", handleChangeTurn);
			socket.off("Move", handleMove);
			socket.off("ActionRequest", handleActionRequest);
			socket.off("Buy", handleBuy);
			socket.off("PayHouseToll", handlePayHouseToll);
			socket.off("error", handleError);
		};
	}, [
		socket,
		roomId,
		handleGameState,
		handleChangeTurn,
		handleMove,
		handleActionRequest,
		handleBuy,
		handlePayHouseToll,
		handleError,
	]);

	const value = {
		turnAddress,
		isTurn,
		roomData,
		messages,
		playerState,
	};

	return (
		<GameContext.Provider value={value}>{children}</GameContext.Provider>
	);
};

export default GameContext;
