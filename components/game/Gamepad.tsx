"use client";

import React, { useRef, useState } from "react";
import { PlayerState } from "@/types/game";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Coins, MapPin } from "lucide-react";
import Dice from "react-dice-roll";

interface GamepadProps {
	playerState: PlayerState;
	onRollDice: (value: number) => void;
}

const Gamepad: React.FC<GamepadProps> = ({ playerState, onRollDice }) => {
	const [isRolling, setIsRolling] = useState(false);
	const diceRef = useRef<any>(null);

	const handleRollClick = () => {
		setIsRolling(true);
		if (diceRef.current) {
			diceRef.current.rollDice();
		}
	};

	const handleDiceRollComplete = (value: number) => {
		setIsRolling(false);
		onRollDice(value);
	};

	return (
		<Card className="absolute top-4 right-4 w-64 overflow-hidden transition-all hover:shadow-md border-primary bg-background/95">
			<CardHeader className="pb-2">
				<CardTitle className="text-lg">Player Info</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2 pb-2">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Coins className="h-4 w-4 text-primary" />
						<span className="text-sm font-medium">Assets</span>
					</div>
					<Badge variant="outline">{playerState.assets}</Badge>
				</div>

				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<MapPin className="h-4 w-4 text-primary" />
						<span className="text-sm font-medium">Position</span>
					</div>
					<Badge variant="outline">
						{playerState.position.x}, {playerState.position.y}
					</Badge>
				</div>

				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Home className="h-4 w-4 text-primary" />
						<span className="text-sm font-medium">Houses</span>
					</div>
					<Badge variant="outline">
						{playerState.ownedHouses.length}
					</Badge>
				</div>

				<div className="flex justify-center py-2">
					<Dice
						ref={diceRef}
						size={50}
						onRoll={handleDiceRollComplete}
						rollingTime={1000}
					/>
				</div>
			</CardContent>
			<CardFooter className="pt-2 flex justify-center">
				<Button
					onClick={handleRollClick}
					variant="default"
					size="sm"
					className="w-full"
					disabled={isRolling}
				>
					{isRolling ? "Rolling..." : "Roll Dice"}
				</Button>
			</CardFooter>
		</Card>
	);
};

export default Gamepad;
