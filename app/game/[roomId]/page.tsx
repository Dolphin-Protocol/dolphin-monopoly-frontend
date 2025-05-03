"use client";

import PhaserGame from "@/components/game/PhaserGame";
import MiniMap from "@/components/game/MiniMap";
import Gamepad from "@/components/game/Gamepad";
import StatusDialog from "@/components/game/StatusDialog";
import { useGame } from "@/contexts/GameContext";

import { useState, useEffect } from "react";
import { initializeDefaultPlayers } from "@/utils/gameAdapter";
import { PlayerState } from "@/types/game";
import { useSocket } from "@/contexts/SocketContext";
import { useParams } from "next/navigation";
import { useCustomWallet } from "@/contexts/WalletContext";
import { useGameActionContext } from "@/contexts/GameActionContext";

export default function GamePage() {
	const { isTurn, playerState, messages } = useGame();
	const { rounds } = useGameActionContext();
	const { socket } = useSocket();
	const { roomId } = useParams<{ roomId: string }>();
	
	const [error, setError] = useState<string | null>(null);
	const { address } = useCustomWallet();


	// if (error) {
	// 	return (
	// 		<div className="w-full h-full flex items-center justify-center text-red-500">
	// 			{error}
	// 		</div>
	// 	);
	// }

	// if (!roomData) {
	// 	return (
	// 		<div className="w-full h-full flex items-center justify-center">
	// 			Loading game data...
	// 		</div>
	// 	);
	// }

	return (
		<div className="w-full h-full relative">
			<PhaserGame socket={socket} roomId={roomId} rounds={rounds} />
			{/* <MiniMap houses={roomData.houseCell} /> */}
			<Gamepad playerState={playerState} isTurn={isTurn} />
			<StatusDialog messages={messages} />
		</div>
	);
}
