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
	const { isTurn, roomData } = useGame();
	const { socket } = useSocket();

	const [players, setPlayers] = useState<PlayerState[]>([]);

	useEffect(() => {
		if (!roomData) return;
		const players = initializeDefaultPlayers(roomData);
		setPlayers(players);
	}, [roomData]);

	console.log(players);

	return (
		<div className="w-full h-full relative">
			<PhaserGame
				players={players}
				currentPlayerIndex={0}
				socket={socket}
			/>
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
