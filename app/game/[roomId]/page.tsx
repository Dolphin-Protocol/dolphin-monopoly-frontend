"use client";

import GameCanvas from "@/components/game/GameCanvas";
import MiniMap from "@/components/game/MiniMap";
import Gamepad from "@/components/game/Gamepad";
import { PLAYER_ONE_DEFAULT_STATE } from "@/constants/states";

export default function GamePage() {
	return (
		<div className="w-full h-full relative">
			<GameCanvas />
			<MiniMap />
			<Gamepad 
				playerState={PLAYER_ONE_DEFAULT_STATE}
				onRollDice={() => {}}
			/>
		</div>
	);
}
