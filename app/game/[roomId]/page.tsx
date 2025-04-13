"use client";

import GameCanvas from "@/components/game/GameCanvas";
import MiniMap from "@/components/game/MiniMap";
import DiceRoll from "@/components/game/DiceRoll";

export default function GamePage() {
	return (
		<div className="w-full h-full relative">
			<GameCanvas />
			<MiniMap
				onCellClick={() => {}}
				onZoomIn={() => {}}
				onZoomOut={() => {}}
			/>
			{/* <DiceRoll /> */}
		</div>
	);
}
