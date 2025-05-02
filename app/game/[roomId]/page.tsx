"use client";

import PhaserGame from "@/components/game/PhaserGame";
import MiniMap from "@/components/game/MiniMap";
import Gamepad from "@/components/game/Gamepad";
import { PLAYER_ONE_DEFAULT_STATE } from "@/constants/states";
import StatusDialog from "@/components/game/StatusDialog";
import { useGame } from "@/contexts/GameContext";

import { useState, useEffect } from "react";
import { initializeDefaultPlayers } from "@/utils/gameAdapter";
import { PlayerState } from "@/types/game";
import { useSocket } from "@/contexts/SocketContext";
import { useParams } from "next/navigation";

const messages = [
	"Player moved to Go, collect 200 coins",
	"Chance card drawn: Advance to nearest railroad",
	"Player built a house on Park Place",
	"Income Tax: Pay 200 coins",
	"Player landed on Free Parking",
	"Player was sent to Jail",
	"Rent paid to property owner",
	"Player passed Go, collected 200 coins",
	"Property auction started",
	"Player traded properties with another player",
];

export default function GamePage() {
	const { isTurn, roomData, turnAddress } = useGame();
	const { socket } = useSocket();
	const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number | null>(
		null
	);
	const [players, setPlayers] = useState<PlayerState[]>([]);
	const [error, setError] = useState<string | null>(null);
	const { roomId } = useParams<{ roomId: string }>();

	// console.log("turnAddress", turnAddress);
	// console.log("players", players);
	// console.log("currentPlayerIndex", currentPlayerIndex);

	useEffect(() => {
		try {
			if (!roomData) return;
			const players = initializeDefaultPlayers(roomData);
			setPlayers(players);
			const currentPlayerIndex = players.find(
				(player) => player.address === turnAddress
			)?.playerIndex;
			if (currentPlayerIndex) {
				setCurrentPlayerIndex(currentPlayerIndex);
			} else {
				setCurrentPlayerIndex(null);
			}
		} catch (err) {
			console.error("Error initializing players:", err);
			setError(
				err instanceof Error
					? err.message
					: "Failed to initialize players"
			);
		}
	}, [roomData, turnAddress, initializeDefaultPlayers]);

	if (error) {
		return (
			<div className="w-full h-full flex items-center justify-center text-red-500">
				{error}
			</div>
		);
	}

	if (!roomData || !players.length || currentPlayerIndex === null) {
		return (
			<div className="w-full h-full flex items-center justify-center">
				Loading game data...
			</div>
		);
	}

	return (
		<div className="w-full h-full relative">
			<PhaserGame socket={socket} roomId={roomId} />
			<MiniMap />
			<Gamepad
				playerState={PLAYER_ONE_DEFAULT_STATE}
				onRollDice={() => {}}
				isTurn={isTurn}
			/>
			<StatusDialog messages={messages} />
		</div>
	);
}
