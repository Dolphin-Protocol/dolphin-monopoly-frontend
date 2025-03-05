"use client";
import { useState, useEffect, useRef } from "react";
import DiceRoll from "./DiceRoll";
import Cell from "./Cell";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const GameBoard = () => {
	const [playerPosition, setPlayerPosition] = useState(0);
	const [isRolling, setIsRolling] = useState(false);
	const [lastRoll, setLastRoll] = useState<number | null>(null);
	const [initialScale, setInitialScale] = useState(1);
	const transformComponentRef = useRef(null);

	useEffect(() => {
		const calculateInitialScale = () => {
			const screenWidth = window.innerWidth;
			const screenHeight = window.innerHeight;
			const mapSize = 1200; // our map size

			// Calculate scale needed for both dimensions
			const scaleX = (screenWidth / mapSize) * 1.2; // Add 20% extra zoom
			const scaleY = (screenHeight / mapSize) * 1.2;

			// Use the larger scale to ensure map fills screen
			setInitialScale(Math.max(scaleX, scaleY));
		};

		calculateInitialScale();

		// Force initial zoom after a short delay to ensure component is mounted
		setTimeout(() => {
			if (transformComponentRef.current) {
				// @ts-ignore: Object is possibly 'null'
				transformComponentRef.current.setTransform(0, 0, initialScale);
			}
		}, 100);

		window.addEventListener("resize", calculateInitialScale);

		return () => {
			window.removeEventListener("resize", calculateInitialScale);
		};
	}, [initialScale]);

	const handleDiceRoll = (value: number) => {
		setIsRolling(true);
		setLastRoll(value);

		setPlayerPosition((prev) => (prev + value) % 28); // Updated for 8x8 board (28 edge cells)

		setTimeout(() => {
			setIsRolling(false);
		}, 1000);
	};

	const renderCell = (index: number) => {
		return <Cell key={index} index={index} />;
	};

	return (
		<div className="w-screen h-screen bg-blue-100">
			<TransformWrapper
				ref={transformComponentRef}
				initialScale={initialScale}
				minScale={initialScale}
				maxScale={3}
				centerOnInit={true}
				limitToBounds={true}
			>
				<TransformComponent
					wrapperStyle={{
						width: "100%",
						height: "100%",
					}}
				>
					<div className="relative w-[1200px] h-[1200px]">
						<div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-1">
							{Array.from({ length: 64 }).map((_, index) =>
								renderCell(index)
							)}
						</div>
					</div>
				</TransformComponent>
			</TransformWrapper>
		</div>
	);
};

export default GameBoard;
