"use client";

import React from "react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Info } from "lucide-react";

interface GameStatusProps {
	messages: string[];
}

const StatusDialog: React.FC<GameStatusProps> = ({ messages }) => {
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
					<Badge variant="outline" className="bg-background/80">
						{messages.length}
					</Badge>
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
								<p className="text-xs text-muted-foreground mt-1">
									{new Date().toLocaleTimeString()}
								</p>
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
