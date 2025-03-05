"use client";
import {
	TransformWrapper,
	TransformComponent,
	ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import Cell from "./cells";
import MiniMap from "./MiniMap";
import { useRef } from "react";
import { createBoardData } from "@/utils/board";

const GameBoard = () => {
	const transformComponentRef = useRef<ReactZoomPanPinchRef>(null);
	const boardData = createBoardData();

	const renderCell = (index: number) => {
		return <Cell key={index} data={boardData[index]} />;
	};

	const handleZoom = (zoomIn: boolean) => {
		if (!transformComponentRef.current) return;

		if (zoomIn) {
			transformComponentRef.current.zoomIn();
		} else {
			transformComponentRef.current.zoomOut();
		}
	};

	return (
		<div className="w-screen h-screen bg-blue-100">
			<TransformWrapper
				ref={transformComponentRef}
				initialScale={1}
				minScale={0.5}
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

			<MiniMap
				onCellClick={(index) => {}}
				onZoomIn={() => handleZoom(true)}
				onZoomOut={() => handleZoom(false)}
			/>
		</div>
	);
};

export default GameBoard;
