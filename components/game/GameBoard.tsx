// "use client";
// import {
// 	TransformWrapper,
// 	TransformComponent,
// 	ReactZoomPanPinchRef,
// } from "react-zoom-pan-pinch";

// import { useRef } from "react";
// import { createBoardData } from "@/utils/board";
// import Cell from "../cells";
// import MiniMap from "./MiniMap";

// const GameBoard = () => {
// 	const transformComponentRef = useRef<ReactZoomPanPinchRef>(null);
// 	const boardData = createBoardData();

// 	const renderCell = (index: number) => {
// 		return <Cell key={index} data={boardData[index]} />;
// 	};

// 	const handleCellClick = (index: number) => {
// 		if (!transformComponentRef.current) return;

// 		const row = Math.floor(index / 8);
// 		const col = index % 8;

// 		const cellWidth = 1200 / 8;
// 		const x = -(col * cellWidth + cellWidth / 2 - window.innerWidth / 2);
// 		const y = -(row * cellWidth + cellWidth / 2 - window.innerHeight / 2);

// 		// @ts-ignore: Object is possibly 'null'
// 		transformComponentRef.current.setTransform(x, y, 1);
// 	};
	
// 	const handleZoom = (zoomIn: boolean) => {
// 		if (!transformComponentRef.current) return;

// 		if (zoomIn) {
// 			transformComponentRef.current.zoomIn();
// 		} else {
// 			transformComponentRef.current.zoomOut();
// 		}
// 	};

// 	return (
// 		<div className="w-screen h-screen bg-[#84c669]">
// 			<TransformWrapper
// 				ref={transformComponentRef}
// 				initialScale={1}
// 				minScale={0.5}
// 				maxScale={2}
// 				centerOnInit={false}
// 				limitToBounds={true}
// 			>
// 				<TransformComponent
// 					wrapperStyle={{
// 						width: "100%",
// 						height: "100%",
// 					}}
// 				>
// 					<div className="relative w-[1200px] h-[1200px]">
// 						<div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-2">
// 							{Array.from({ length: 64 }).map((_, index) =>
// 								renderCell(index)
// 							)}
// 						</div>
// 					</div>
// 				</TransformComponent>
// 			</TransformWrapper>

// 			<MiniMap
// 				onCellClick={handleCellClick}
// 				onZoomIn={() => handleZoom(true)}
// 				onZoomOut={() => handleZoom(false)}
// 			/>
// 		</div>
// 	);
// };

// export default GameBoard;
