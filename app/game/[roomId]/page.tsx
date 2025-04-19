"use client";

import GameCanvas from "@/components/game/GameCanvas";
import MiniMap from "@/components/game/MiniMap";
import Gamepad from "@/components/game/Gamepad";
import { PLAYER_ONE_DEFAULT_STATE } from "@/constants/states";
import StatusDialog from "@/components/game/StatusDialog";

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
	return (
		<div className="w-full h-full relative">
			<GameCanvas />
			<MiniMap />
			<Gamepad 
				playerState={PLAYER_ONE_DEFAULT_STATE}
				onRollDice={() => {}}
			/>
			<StatusDialog messages={messages} />
		</div>
	);
}
