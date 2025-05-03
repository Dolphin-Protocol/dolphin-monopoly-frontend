"use client";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaMap } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiHouseCell, ApiPropertyCell } from "@/types/socket";
import PLAYER_COLORS from "@/constants/colors";

// 明确定义player index类型
type PlayerIndex = 1 | 2 | 3 | 4;

// 定義房子等級的顏色深度
const LEVEL_OPACITY = {
	0: "30", // 未擁有
	1: "50", // 等級 1
	2: "75", // 等級 2
	3: "95", // 等級 3
} as const;

type LevelOpacity = keyof typeof LEVEL_OPACITY;

const isPropertyCell = (cell: ApiHouseCell): cell is ApiPropertyCell => {
	return "owner" in cell && "level" in cell;
};

const MiniMap = ({ houses }: { houses: ApiHouseCell[] }) => {
	const [isOpen, setIsOpen] = useState(true);

	if (!isOpen) {
		return (
			<div className="absolute top-4 left-4 z-50">
				<Button
					variant="default"
					size="icon"
					onClick={() => setIsOpen(true)}
					className="w-10 h-10 rounded-full shadow-md"
				>
					<FaMap size={16} />
				</Button>
			</div>
		);
	}

	// 根據位置獲取房子信息
	const getHouseInfo = (
		position: number
	): {
		level: number;
		owner: string | null;
		position: number;
		id?: string;
	} | null => {
		const house = houses.find((h) => h.position === position);
		if (!house) return null;

		if (isPropertyCell(house)) {
			return {
				id: house.id,
				level: house.level || 0,
				owner: house.owner,
				position: house.position,
			};
		}

		return {
			id: house.id,
			position: house.position,
			level: 0,
			owner: null,
		};
	};

	// 從地址獲取玩家索引的函數
	const getPlayerIndexByAddress = (address: string): PlayerIndex => {
		const hashCode = Array.from(address).reduce(
			(acc, char) => acc + char.charCodeAt(0),
			0
		);
		// 確保返回值是 1, 2, 3, 或 4
		return ((hashCode % 4) + 1) as PlayerIndex;
	};

	// 根據房子信息獲取顏色
	const getHouseColor = (
		house: { level: number; owner: string | null } | null
	) => {
		if (!house || !house.owner) {
			return "bg-gray-400/30"; // 沒有人的房子是灰色
		}

		// 獲取玩家索引
		const playerIndex = getPlayerIndexByAddress(house.owner);

		// 獲取玩家顏色
		const playerColor = PLAYER_COLORS[playerIndex];
		const colorHex = playerColor.hex.replace("#", "");

		// 根據等級設置不同深度
		const opacity = LEVEL_OPACITY[house.level as LevelOpacity] || "50";

		return `bg-[#${colorHex}]/${opacity}`;
	};

	return (
		<div className="absolute top-4 left-4 z-50">
			<Card className="relative overflow-hidden transition-all hover:shadow-lg border-primary bg-background/95 backdrop-blur shadow-xl rounded-xl">
				<div className="absolute inset-0 bg-gradient-to-bl from-primary/10 to-transparent pointer-events-none" />
				<div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />

				<CardHeader className="pb-3 space-y-1 relative pt-4 px-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<FaMap className="h-4 w-4 text-primary" />
							<CardTitle className="text-lg font-bold">
								Map
							</CardTitle>
						</div>
						<Button
							variant="outline"
							size="icon"
							onClick={() => setIsOpen(false)}
							className="w-6 h-6 rounded-full bg-background/80"
						>
							<IoClose size={14} />
						</Button>
					</div>
					<div className="h-px w-full bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30" />
				</CardHeader>

				<CardContent className="pt-2 px-4 pb-4">
					<div className="w-[240px] h-[240px] grid grid-cols-6 grid-rows-6 gap-[2px] bg-muted/30 p-2 rounded-lg border border-primary/10 overflow-hidden">
						{Array.from({ length: 36 }).map((_, index) => {
							const isEdge =
								index < 6 ||
								index >= 30 ||
								index % 6 === 0 ||
								index % 6 === 5;

							const isCorner =
								index === 0 ||
								index === 5 ||
								index === 30 ||
								index === 35;

							// 找到對應的位置
							const position = mapIndexToPosition(index, isEdge);
							const houseInfo =
								position !== -1 ? getHouseInfo(position) : null;
							const houseColorClass = houseInfo
								? getHouseColor(houseInfo)
								: "";

							return (
								<div
									key={index}
									className={`
                    hover:bg-primary/20 cursor-pointer transition-colors rounded-sm
                    ${
						position !== -1 && houseInfo
							? houseColorClass
							: isCorner
							? "bg-primary/40"
							: isEdge
							? "bg-primary/20"
							: "bg-background/60"
					}
                  `}
									title={
										houseInfo
											? `Position ${
													houseInfo.position
											  } - Level ${houseInfo.level} - ${
													houseInfo.owner?.slice(
														0,
														8
													) || "No owner"
											  }`
											: ""
									}
								/>
							);
						})}
					</div>

					{/* 顏色圖例 */}
					<div className="mt-2 flex flex-wrap gap-2">
						<div className="flex items-center text-xs">
							<div className="w-3 h-3 rounded-full mr-1 bg-gray-400/30"></div>
							<span>No owner</span>
						</div>
						{[1, 2, 3, 4].map((playerIndex) => (
							<div
								key={playerIndex}
								className="flex items-center text-xs"
							>
								<div
									className="w-3 h-3 rounded-full mr-1"
									style={{
										backgroundColor:
											PLAYER_COLORS[
												playerIndex as PlayerIndex
											].hex,
									}}
								></div>
								<span>P{playerIndex}</span>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

// 從棋盤索引映射到遊戲位置
/**
 * 將6x6網格的索引映射到遊戲位置（從右下角開始順時針）
 * 地圖位置图示:
 *
 *    11 12 13 14 15
 *    10             16
 *    9              17
 *    8              18
 *    7              19
 *    6  5  4  3  2  1  0
 *
 * @param index 網格索引 (0-35)
 * @param isEdge 是否為邊緣位置
 * @returns 遊戲位置 (0-19)，如果不是邊緣則返回 -1
 */
function mapIndexToPosition(index: number, isEdge: boolean): number {
	if (!isEdge) return -1;

	// 6x6 的网格，边缘位置总共有 20 个

	// 右下角 (35) → 位置 0
	if (index === 35) {
		return 0;
	}
	// 下排 (34,33,32,31,30) → 位置 1-5 (从右向左)
	else if (index >= 30 && index < 35) {
		return 1 + (34 - index);
	}
	// 左列 (24,18,12,6,0) → 位置 6-10 (从下向上)
	else if (index % 6 === 0) {
		return 6 + (4 - Math.floor(index / 6));
	}
	// 上排 (1,2,3,4,5) → 位置 11-15 (从左向右)
	else if (index > 0 && index < 6) {
		return 11 + (index - 1);
	}
	// 右列 (11,17,23,29) → 位置 16-19 (从上向下)
	else if (index % 6 === 5 && index < 30) {
		return 16 + Math.floor((index - 5) / 6);
	}

	return -1;
}

export default MiniMap;
