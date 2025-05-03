"use client";

import React, { useState } from "react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IoClose } from "react-icons/io5";
import { FaComment } from "react-icons/fa";

interface GameStatusProps {
	messages: string[];
}

const StatusDialog: React.FC<GameStatusProps> = ({ messages }) => {
	const [isOpen, setIsOpen] = useState(true); // 添加 isOpen 状态

	// 如果折叠，只显示图标按钮
	if (!isOpen) {
		return (
			<div className="absolute bottom-4 left-4 z-50">
				<Button
					variant="default"
					size="icon"
					onClick={() => setIsOpen(true)}
					className="w-10 h-10 rounded-full shadow-md"
					title="Game Status"
				>
					<FaComment size={16} />
					{messages.length > 0 && (
						<span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-[10px] flex items-center justify-center text-white">
							{messages.length}
						</span>
					)}
				</Button>
			</div>
		);
	}

	return (
		<Card className="absolute bottom-4 left-4 w-80 max-h-96 overflow-hidden transition-all hover:shadow-lg border-primary bg-background/95 backdrop-blur shadow-xl rounded-xl">
			<div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent pointer-events-none" />

			<CardHeader className="pb-3 space-y-1 relative">
				<div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<MessageSquare className="h-5 w-5 text-primary" />
						<CardTitle className="text-lg font-bold">
							Game Status
						</CardTitle>
					</div>
					<div className="flex items-center gap-2">
						<Badge variant="outline" className="bg-background/80">
							{messages.length}
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

			<CardContent className="space-y-3 pb-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
				{messages.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
						<Info className="h-8 w-8 mb-2 opacity-40" />
						<p className="text-sm">No status messages</p>
					</div>
				) : (
					messages.map((message, index) => (
						<div
							key={index}
							className="relative flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-transparent hover:border-primary/20 transition-colors"
						>
							<div className="mt-0.5">
								<Info className="h-4 w-4 text-primary" />
							</div>
							<div className="flex-1">
								<p className="text-sm">{message}</p>
							</div>
						</div>
					))
				)}
			</CardContent>

			<CardFooter className="pt-0 flex justify-center items-center">
				<p className="text-xs text-muted-foreground">
					{messages.length} message{messages.length !== 1 ? "s" : ""}
				</p>
			</CardFooter>
		</Card>
	);
};

export default StatusDialog;
