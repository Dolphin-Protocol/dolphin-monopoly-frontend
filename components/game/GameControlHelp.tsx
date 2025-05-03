"use client";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaToolbox, FaKeyboard } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PLAYER_COLORS from "@/constants/colors";

// 重命名组件为GameControlHelp
const GameControlHelp = () => {
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
					<FaToolbox size={16} />
				</Button>
			</div>
		);
	}

	return (
		<div className="absolute top-4 left-4 z-50">
			<Card className="relative overflow-hidden transition-all hover:shadow-lg border-primary bg-background/95 backdrop-blur shadow-xl rounded-xl">
				<div className="absolute inset-0 bg-gradient-to-bl from-primary/10 to-transparent pointer-events-none" />
				<div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />

				<CardHeader className="pb-3 space-y-1 relative pt-4 px-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<FaKeyboard className="h-4 w-4 text-primary" />
							<CardTitle className="text-lg font-bold">
								Controls
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
					{/* 玩家顏色说明 */}
					<div className="mb-4">
						<h3 className="text-sm font-medium mb-2">
							Player Colors
						</h3>
						<div className="flex flex-wrap gap-2">
							{[1, 2, 3, 4].map((playerIndex) => (
								<div
									key={playerIndex}
									className="flex items-center text-xs"
								>
									<div
										className="w-4 h-4 rounded-full mr-1"
										style={{
											backgroundColor:
												PLAYER_COLORS[
													playerIndex as 1 | 2 | 3 | 4
												].hex,
										}}
									></div>
									<span>Player {playerIndex}</span>
								</div>
							))}
						</div>
					</div>

					{/* 按键简介 */}
					<div>
						<h3 className="text-sm font-medium mb-2">
							Keyboard Controls
						</h3>
						<div className="grid grid-cols-2 gap-2 text-xs">
							<div className="flex items-center">
								<span className="w-6 h-6 inline-flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded mr-2 font-semibold">
									W
								</span>
								<span>Move camera up</span>
							</div>
							<div className="flex items-center">
								<span className="w-6 h-6 inline-flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded mr-2 font-semibold">
									S
								</span>
								<span>Move camera down</span>
							</div>
							<div className="flex items-center">
								<span className="w-6 h-6 inline-flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded mr-2 font-semibold">
									A
								</span>
								<span>Move camera left</span>
							</div>
							<div className="flex items-center">
								<span className="w-6 h-6 inline-flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded mr-2 font-semibold">
									D
								</span>
								<span>Move camera right</span>
							</div>
							<div className="flex items-center">
								<span className="w-6 h-6 inline-flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded mr-2 font-semibold">
									Q
								</span>
								<span>Zoom in</span>
							</div>
							<div className="flex items-center">
								<span className="w-6 h-6 inline-flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded mr-2 font-semibold">
									E
								</span>
								<span>Zoom out</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default GameControlHelp;
