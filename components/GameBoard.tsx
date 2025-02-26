"use client";
import { useState } from "react";
import Player from "./Player";
import DiceRoll from "./DiceRoll";

const GameBoard = () => {
	const [playerPosition, setPlayerPosition] = useState(0);
	const [isRolling, setIsRolling] = useState(false);
	const [lastRoll, setLastRoll] = useState<number | null>(null);

	const handleDiceRoll = (value: number) => {
		setIsRolling(true);
		setLastRoll(value);

		setPlayerPosition((prev) => (prev + value) % 16);

		setTimeout(() => {
			setIsRolling(false);
		}, 1000);
	};

	const renderCell = (index: number) => {
		const row = Math.floor(index / 5);
		const col = index % 5;
		const isEdgeCell = row === 0 || row === 4 || col === 0 || col === 4;

		// Convert grid position to clockwise number (0-15 for edge cells)
		const getClockwiseNumber = (row: number, col: number) => {
			if (row === 0) return col;
			if (col === 4) return row + 4;
			if (row === 4) return 12 - col;
			if (col === 0) return 16 - row;
			return -1; // Non-edge cells
		};

		const clockwiseNumber = getClockwiseNumber(row, col);

		return (
			<div
				key={index}
				className={`relative ${
					isEdgeCell
						? "bg-white border border-gray-300 flex items-center justify-center text-xl"
						: ""
				}`}
			>
				{isEdgeCell ? clockwiseNumber : ""}
				{isEdgeCell && playerPosition === clockwiseNumber && (
					<div
						style={{
							position: "absolute",
							left: "50%",
							top: "50%",
						}}
					>
						<Player position={playerPosition} />
					</div>
				)}
			</div>
		);
	};

	return (
		<div className="flex gap-8 justify-between items-center w-full p-8">
			<div className="flex flex-col gap-6">
				<DiceRoll onRoll={handleDiceRoll} disabled={isRolling} />
				{lastRoll && (
					<div className="bg-white px-4 py-3 rounded-lg shadow-md">
						<div className="text-gray-500 text-md mb-1 font-semibold">
							Last Roll
						</div>
						<div className="text-2xl font-bold text-blue-600">
							{lastRoll}
						</div>
					</div>
				)}
			</div>

			<div className="relative w-[800px] h-[800px] bg-blue-100">
				<div className="absolute inset-0 grid grid-cols-5 grid-rows-5 gap-1">
					{Array.from({ length: 25 }).map((_, index) =>
						renderCell(index)
					)}
				</div>
			</div>
		</div>
	);
};

export default GameBoard;
