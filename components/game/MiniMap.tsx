"use client";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaMap } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiHouseCell } from "@/types/socket";


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

							return (
								<div
									key={index}
									className={`
										hover:bg-primary/20 cursor-pointer transition-colors rounded-sm
										${isCorner ? "bg-primary/40" : isEdge ? "bg-primary/20" : "bg-background/60"}
									`}
								/>
							);
						})}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default MiniMap;
