"use client";

import { Users, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Room } from "@/types/game";
import { shortenAddress } from "@/utils/address";
import { useCustomWallet } from "@/contexts/WalletContext";

interface RoomCardProps {
	room: Room;
	isCurrentRoom: boolean;
	hasJoinedRoom: boolean;
	onJoin: (roomId: string) => void;
	onLeave: (roomId: string) => void;
}

export function RoomCard({
	room,
	isCurrentRoom,
	hasJoinedRoom,
	onJoin,
	onLeave,
}: RoomCardProps) {
	const { address } = useCustomWallet();

	return (
		<Card
			className={`overflow-hidden transition-all hover:shadow-md ${
				isCurrentRoom ? "border-primary" : ""
			}`}
		>
			<CardHeader className="pb-2">
				<div className="flex justify-between items-start">
					<div className="flex items-center gap-2">
						<CardTitle className="text-lg">
							{shortenAddress(room.roomId)}
						</CardTitle>
						<Button
							variant="ghost"
							size="icon"
							className="h-6 w-6"
							onClick={() => {
								navigator.clipboard.writeText(room.roomId);
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="opacity-50 hover:opacity-100"
							>
								<rect
									x="9"
									y="9"
									width="13"
									height="13"
									rx="2"
									ry="2"
								/>
								<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
							</svg>
						</Button>
					</div>
					{isCurrentRoom && (
						<Badge
							variant={
								room.members[0].address === address
									? "secondary"
									: "default"
							}
					>
							{room.members[0].address === address ? "Host" : "Player"}
						</Badge>
					)}
				</div>
				<CardDescription>
					Host: {shortenAddress(room.members[0].address)}
				</CardDescription>
			</CardHeader>
			<CardContent className="pb-2">
				<div className="flex justify-between text-sm text-muted-foreground">
					<div className="flex items-center">
						<Users className="mr-1 h-4 w-4" />
						{room.members.length} Players
					</div>
					<div className="flex items-center">
						<Clock className="mr-1 h-4 w-4" />
						{new Date(room.createdAt).toLocaleTimeString()}
					</div>
				</div>
			</CardContent>
			<CardFooter className="pt-2 flex justify-between">
				<Badge variant="outline">{room.members.length} Players</Badge>
				{isCurrentRoom ? (
					<Button
						variant="destructive"
						size="sm"
						onClick={() => onLeave(room.roomId)}
					>
						Leave
					</Button>
				) : (
					<Button
						variant="default"
						size="sm"
						onClick={() => onJoin(room.roomId)}
						disabled={hasJoinedRoom}
					>
						Join
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}
