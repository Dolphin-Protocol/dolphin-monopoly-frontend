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
	isTurn: boolean | null;
	roomData: ApiRoomData | null;
	messages: string[];
	playerState: PlayerState | null;
	hasAction: boolean;
	isGameClosed: boolean;
	gameClosedData: { game: string; winners: string[] } | null;
	handleAction: (action: boolean) => void;
	handleFinishGame: () => void;
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
	const [isTurn, setIsTurn] = useState<boolean | null>(null);
	const [roomData, setRoomData] = useState<ApiRoomData | null>(null);
	const [messages, setMessages] = useState<string[]>([]);
	const [playerState, setPlayerState] = useState<PlayerState | null>(null);
	const [hasAction, setHasAction] = useState<boolean>(false);
	const [isGameClosed, setIsGameClosed] = useState<boolean>(false);
	const [gameClosedData, setGameClosedData] = useState<{
		game: string;
		winners: string[];
	} | null>(null);
	const { roomId } = useParams<{ roomId: string }>();

	const handleAction = useCallback((action: boolean) => {
		setHasAction(action);
	}, []);

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
		if (data.player === address) {
			setHasAction(true);
		}
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
			if (!data.player || !data.purchased) return;
			console.log("Buy", data);
			const level = data.houseCell.level;
			const price = data.houseCell.buyPrice[level - 1].price;

			setMessages((prevMessages) => [
				...prevMessages,
				`${data.player.slice(
					0,
					5
				)}... buy/upgrade house for ${price} to level ${level}`,
			]);
		},
		[]
	);

	const handlePayHouseToll = useCallback(
		(data: {
			player: string;
			houseCell: HouseCell;
			paidAmount: number;
			payee: string;
			level: number;
		}) => {
			console.log("PayHouseToll", data);
			if (!data.player) return;
			const amountToChange = data.paidAmount ?? 0;

			setMessages((prevMessages) => [
				...prevMessages,
				`${data.player.slice(
					0,
					5
				)}... pay rent for ${amountToChange} to ${data.payee.slice(
					0,
					5
				)}...`,
			]);
		},
		[]
	);

	const handleBalanceUpdated = useCallback(
		(data: { owner: string; value: string }) => {
			console.log("BalanceUpdated", data);
			if (data.owner === address) {
				setPlayerState((prev) => {
					if (!prev) return null;
					return {
						...prev,
						assets: Number(data.value),
					};
				});
			}
		},
		[address]
	);

	const handleGameClosed = useCallback(
		(data: { game: string; winners: string[] }) => {
			console.log("GameClosed", data);
			if (data.game === roomData?.roomInfo.gameId) {
				console.log("run");
				setIsGameClosed(true);
				setGameClosedData(data);
			}
		},
		[roomData?.roomInfo.gameId]
	);

	const handleError = useCallback((data: any) => {
		console.error("Socket error:", data.message);
	}, []);

	const handleFinishGame = useCallback(() => {
		setIsGameClosed(false);
		setGameClosedData(null);
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

				setTimeout(() => {
					socket.emit("ChangeTurn", { roomId });
				}, 3000);
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
		socket.on("BalanceUpdated", handleBalanceUpdated);
		socket.on("GameClosed", handleGameClosed);
		socket.on("error", handleError);

		return () => {
			// 清理所有事件監聽器
			socket.off("gameState", handleGameState);
			socket.off("ChangeTurn", handleChangeTurn);
			socket.off("Move", handleMove);
			socket.off("ActionRequest", handleActionRequest);
			socket.off("Buy", handleBuy);
			socket.off("PayHouseToll", handlePayHouseToll);
			socket.off("GameClosed", handleGameClosed);
			socket.off("BalanceUpdated", handleBalanceUpdated);
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
		handleBalanceUpdated,
		handleGameClosed,
		handleError,
	]);

	const value = {
		turnAddress,
		isTurn,
		roomData,
		messages,
		playerState,
		hasAction,
		isGameClosed,
		gameClosedData,
		handleAction,
		handleFinishGame,
	};

	return (
		<GameContext.Provider value={value}>{children}</GameContext.Provider>
	);
};

export default GameContext;
