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
import { Home, Coins, MapPin, Dice5 } from "lucide-react";
import { IoClose } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import Dice from "react-dice-roll";
import { useRollDice } from "@/hooks/game/useRollDice";
import { useBuyHouse } from "@/hooks/game/useBuyHouse";
import getPlayerColor from "@/utils/utils";
import PLAYER_COLORS from "@/constants/colors";

interface GamepadProps {
	playerState: PlayerState | null;
	isTurn: boolean;
}

// 骰子邏輯以及按鈕顯示
const Gamepad: React.FC<GamepadProps> = ({ playerState, isTurn }) => {
	const [diceValue, setDiceValue] = useState<number | null>(null);
	const [isOpen, setIsOpen] = useState(true); // 添加 isOpen 状态
	const diceRef = useRef<any>(null);
	const { rollDice, isLoading } = useRollDice();
	const { executeBuy } = useBuyHouse();

	const handleRollClick = async () => {
		if (isLoading || !diceRef.current) return;

		try {
			const diceValue = await rollDice();

			if (diceValue !== null) {
				const validValue = Math.min(Math.max(1, diceValue), 6) as
					| 1
					| 2
					| 3
					| 4
					| 5
					| 6;

				setDiceValue(validValue);
			}
			setTimeout(() => {
				diceRef.current.rollDice();
			}, 100);
		} catch (error) {
			console.error("Error rolling dice:", error);
		}
	};

	const handleBuyHouse = () => {
		executeBuy(true);
	};

	const playerColor = playerState
		? getPlayerColor(playerState.playerIndex)
		: PLAYER_COLORS[1];

	if (!playerState) return null;

	// 添加折叠状态的渲染
	if (!isOpen) {
		return (
			<div className="absolute top-4 right-4 z-50">
				<Button
					variant="default"
					size="icon"
					onClick={() => setIsOpen(true)}
					className="w-10 h-10 rounded-full shadow-md"
				>
					<FaUser size={16} />
				</Button>
			</div>
		);
	}

	return (
		<Card className="absolute top-4 right-4 w-72 overflow-hidden transition-all hover:shadow-lg border-primary bg-background/95 backdrop-blur shadow-xl rounded-xl">
			<div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />

			<CardHeader className="pb-3 space-y-1 relative">
				<div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl" />
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg font-bold">
						Game Control
					</CardTitle>
					<div className="flex items-center gap-2">
						<Badge
							variant="secondary"
							className="uppercase text-xs"
							style={{
								backgroundColor: playerColor.hex,
								color: playerColor.textColor,
							}}
						>
							Player {playerState.playerIndex}
						</Badge>
						{/* 添加关闭按钮 */}
						<Button
							variant="outline"
							size="icon"
							onClick={() => setIsOpen(false)}
							className="w-6 h-6 rounded-full bg-background/80"
						>
							<IoClose size={14} />
						</Button>
					</div>
				</div>
				<div className="h-px w-full bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30" />
			</CardHeader>

			<CardContent className="space-y-3 pb-3">
				<div className="flex items-center justify-between bg-muted/30 p-2 rounded-lg hover:bg-muted/50 transition-colors">
					<div className="flex items-center gap-2">
						<div className="bg-primary/10 p-1.5 rounded-md">
							<Coins className="h-4 w-4 text-primary" />
						</div>
						<span className="text-sm font-medium">Assets</span>
					</div>
					<Badge
						variant="outline"
						className="bg-background/80 font-mono"
					>
						{playerState.assets}
					</Badge>
				</div>

				<div className="flex items-center justify-between bg-muted/30 p-2 rounded-lg hover:bg-muted/50 transition-colors">
					<div className="flex items-center gap-2">
						<div className="bg-primary/10 p-1.5 rounded-md">
							<MapPin className="h-4 w-4 text-primary" />
						</div>
						<span className="text-sm font-medium">Position</span>
					</div>
					<Badge
						variant="outline"
						className="bg-background/80 font-mono"
					>
						{playerState.positionIndex}
					</Badge>
				</div>

				<div className="flex justify-center py-3 bg-gradient-to-r from-background via-muted/20 to-background rounded-xl my-2">
					<Dice
						ref={diceRef}
						size={60}
						rollingTime={3500}
						cheatValue={
							diceValue as 1 | 2 | 3 | 4 | 5 | 6 | undefined
						}
						faces={[
							"https://game-icons.net/icons/ffffff/000000/1x1/delapouite/dice-six-faces-one.svg",
							"https://game-icons.net/icons/ffffff/000000/1x1/delapouite/dice-six-faces-two.svg",
							"https://game-icons.net/icons/ffffff/000000/1x1/delapouite/dice-six-faces-three.svg",
							"https://game-icons.net/icons/ffffff/000000/1x1/delapouite/dice-six-faces-four.svg",
							"https://game-icons.net/icons/ffffff/000000/1x1/delapouite/dice-six-faces-five.svg",
							"https://game-icons.net/icons/ffffff/000000/1x1/delapouite/dice-six-faces-six.svg",
						]}
					/>
				</div>
			</CardContent>

			<CardFooter className="pt-0 flex flex-col gap-2">
				<Button
					onClick={handleRollClick}
					variant="default"
					size="lg"
					className="w-full relative overflow-hidden group"
					disabled={isLoading}
				>
					<span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 group-hover:translate-x-full transition-transform duration-700 ease-in-out -z-10" />
					<Dice5 className="mr-2 h-5 w-5" />
					{isLoading ? "Connecting..." : "Roll Dice"}
				</Button>
				<Button
					onClick={handleBuyHouse}
					variant="default"
					size="lg"
					className="w-full"
				>
					buy house
				</Button>
			</CardFooter>
		</Card>
	);
};

export default Gamepad;
