"use client";

import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";
import { useCustomWallet } from "./WalletContext";
import { useSocket } from "./SocketContext";
import { ApiRoomData } from "../types/socket";
import { useParams } from "next/navigation";

interface GameContextType {
	turnAddress: string | null;
	isTurn: boolean;
	roomData: ApiRoomData | null;
	messages: string[];
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

	const { roomId } = useParams<{ roomId: string }>();

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
				}, 2500);
			} else {
				setTimeout(checkSocketAndSendRequests, 1000);
			}
		};

		checkSocketAndSendRequests();

		socket.on("gameState", (data) => {
			if (!data) return;
			setRoomData(data.gameState);
		});

		socket.on("ChangeTurn", (data) => {
			console.log("ChangeTurn", data);
      if(!data.player) return;
			setTurnAddress(data.player);
			setIsTurn(data.player === address);
			setMessages([...messages, `is ${data.player.slice(0, 5)}... turn`]);
		});
		socket.on("Move", (data) => {
			console.log("Move", data);
      if(!data.player) return;
			setMessages([...messages, `${data.player.slice(0, 5)}... move to ${data.position}`]);
		});
		socket.on("ActionRequest", (data) => {
			console.log("ActionRequest", data);
      if(!data.player) return;
			setMessages([...messages, `${data.player.slice(0, 5)}... action request`]);
		});
		socket.on("Buy", (data) => {
			if(!data.player) return;
			setMessages([...messages, `${data.player.slice(0, 5)}... buy house`]);
		});
		socket.on("PayHouseToll", (data) => {
			if(!data.player) return;
			setMessages([...messages, `${data.player.slice(0, 5)}... pay rent`]);
		});

		socket.on("error", (data) => {
			console.error("Socket error:", data.message);
		});

		return () => {
			socket.off("ChangeTurn");
			socket.off("error");
			socket.off("gameState");
			socket.off("Move");
			socket.off("ActionRequest");
			socket.off("Buy");
			socket.off("PayHouseToll");
		};
	}, [address, socket, roomId]);

	const value = {
		turnAddress,
		isTurn,
		roomData,
		messages,
	};

	return (
		<GameContext.Provider value={value}>{children}</GameContext.Provider>
	);
};

export default GameContext;
