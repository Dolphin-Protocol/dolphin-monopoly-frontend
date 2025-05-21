"use client";

import React from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IoClose } from "react-icons/io5";
import { useGame } from "@/contexts/GameContext";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

const GameClosedDialog: React.FC = () => {
	const { isGameClosed, gameClosedData, handleFinishGame } = useGame();
	const { roomId } = useParams<{ roomId: string }>();
	const router = useRouter();
	const handleClose = () => {
		handleFinishGame();
		router.push("/");
	};

	if (!isGameClosed || !gameClosedData || roomId !== gameClosedData.game)
		return null;

	return (
		<div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
			<Card className="w-full max-w-md mx-auto shadow-xl border-primary bg-background/95 backdrop-blur rounded-xl relative">
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-lg font-bold">
						Game Over
					</CardTitle>
					<Button
						variant="outline"
						size="icon"
						onClick={handleClose}
						className="w-8 h-8 rounded-full bg-background/80"
						title="Close"
					>
						<IoClose size={18} />
					</Button>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex flex-col items-center gap-2">
						<span className="text-sm text-muted-foreground">
							Game ID
						</span>
						<Badge
							variant="outline"
							className="font-mono text-xs px-2 py-1"
						>
							{gameClosedData.game}
						</Badge>
					</div>
					<div className="flex flex-col items-center gap-2">
						<span className="text-sm text-muted-foreground">
							Winner{gameClosedData.winners.length > 1 ? "s" : ""}
						</span>
						<div className="flex flex-wrap gap-2 justify-center">
							{gameClosedData.winners.map((winner) => (
								<Badge
									key={winner}
									variant="secondary"
									className="font-mono text-xs px-2 py-1"
								>
									{winner.slice(0, 6)}...{winner.slice(-4)}
								</Badge>
							))}
						</div>
					</div>
				</CardContent>
				<CardFooter className="flex justify-center pt-2">
					<Button
						onClick={handleClose}
						variant="default"
						className="w-full"
					>
						Close
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
};

export default GameClosedDialog;
