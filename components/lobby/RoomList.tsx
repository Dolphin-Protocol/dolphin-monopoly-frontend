"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { RoomCard } from "./RoomCard";
import { Room } from "@/types/game";
import { useCustomWallet } from "@/contexts/WalletContext";

interface RoomListProps {
	rooms: Room[];
	isConnecting: boolean;
	isConnected: boolean;
	connectionError: string;
	onJoinRoom: (roomId: string) => void;
	onLeaveRoom: (roomId: string) => void;
}

export function RoomList({
	rooms,
	isConnecting,
	isConnected,
	connectionError,
	onJoinRoom,
	onLeaveRoom,
}: RoomListProps) {
	const { isConnected: isWalletConnected } = useCustomWallet();

	if (!isWalletConnected) {
		return (
			<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
				<div className="flex items-center">
					<AlertCircle className="h-5 w-5 mr-2" />
					<div>
						<p className="font-medium">Wallet Not Connected</p>
						<p className="text-sm">
							Please connect your wallet to join a room
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (!isConnecting && !isConnected) {
		return (
			<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
				<div className="flex items-center">
					<AlertCircle className="h-5 w-5 mr-2" />
					<div>
						<p className="font-medium">Connection Error</p>
						<p className="text-sm">
							{connectionError ||
								"Failed to connect to the game server. Using mock data instead."}
						</p>
					</div>
				</div>
			</div>
		);
	}

	// Show loading state
	if (isConnecting) {
		return (
			<div className="flex justify-center items-center py-12">
				<div className="flex flex-col items-center">
					<Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
					<p className="text-muted-foreground">
						Connecting to game server...
					</p>
				</div>
			</div>
		);
	}

	// Show room list
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{rooms.length > 0 ? (
				rooms.map((room) => (
					<RoomCard
						key={room.roomId}
						room={room}
						onJoin={onJoinRoom}
						onLeave={onLeaveRoom}
					/>
				))
			) : (
				<div className="col-span-full flex justify-center items-center h-40 text-muted-foreground">
					No rooms found matching your criteria
				</div>
			)}
		</div>
	);
}
