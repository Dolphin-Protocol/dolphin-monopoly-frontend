"use client";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaMap } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const MiniMap = () => {
	const [isOpen, setIsOpen] = useState(true);

	if (!isOpen) {
		return (
			<div className="absolute top-6 left-6 z-50">
				<Button
					variant="outline"
					size="icon"
					onClick={() => setIsOpen(true)}
					className="w-8 h-8"
				>
					<FaMap size={16} />
				</Button>
			</div>
		);
	}

	return (
		<div className="absolute top-6 left-6 z-50">
			<Card className="relative">
				<div className="absolute -right-2 -top-2 flex gap-1">
					<Button
						variant="outline"
						size="icon"
						onClick={() => setIsOpen(false)}
						className="w-6 h-6 bg-white"
					>
						<IoClose size={14} />
					</Button>
				</div>
				<CardContent className="pt-6 px-4 pb-4">
					<div className="w-[240px] h-[240px] grid grid-cols-8 grid-rows-8 gap-[2px] bg-gray-200 p-2 rounded-lg">
						{Array.from({ length: 64 }).map((_, index) => (
							<div
								key={index}
								className="bg-white hover:bg-blue-200 cursor-pointer transition-colors rounded-sm"
							/>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default MiniMap;
