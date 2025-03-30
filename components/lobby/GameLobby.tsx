"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLobby } from "@/hooks/game/useLobby";
import { LobbyHeader } from "./LobbyHeader";
import { SearchBar } from "./SearchBar";
import { RoomList } from "./RoomList";
import { useCustomWallet } from "@/contexts/WalletContext";
import { toast } from "sonner";

export default function GameLobby() {
	const router = useRouter();

	const { address } = useCustomWallet();

	const {
		isConnecting,
		isConnected,
		connectionError,
		rooms: serverRooms,
		createRoom,
		joinRoom,
		leaveRoom,
	} = useLobby();

	const [searchQuery, setSearchQuery] = useState("");
	const [isCreatingRoom, setIsCreatingRoom] = useState(false);

	// Filter and search rooms
	const filteredRooms = serverRooms.filter((room) => {
		const matchesSearch =
			room.roomId.toLowerCase().includes(searchQuery.toLowerCase()) ||
			room.members[0].address
				.toLowerCase()
				.includes(searchQuery.toLowerCase());
		return matchesSearch;
	});

	// Handle room creation
	const handleCreateRoom = async () => {
		if (!address) {
			toast.error("Please connect your wallet to create a room");
			return;
		}
		try {
			setIsCreatingRoom(true);

			const result = await createRoom(address);
			toast.success("Room created successfully");
		} catch (error) {
			console.error("Failed to create room:", error);
			toast.error("Failed to create room");
		} finally {
			setIsCreatingRoom(false);
		}
	};

	// Handle joining a room
	const handleJoinRoom = async (roomId: string) => {
		console.log("handleJoinRoom", roomId);
		if (!address) {
			toast.error("Please connect your wallet to join a room");
			return;
		}
		try {
			await joinRoom(address, roomId);
			toast.success("Joined room successfully");
		} catch (error) {
			console.error("Failed to join room:", error);
			toast.error("Failed to join room");
		}
	};

	const handleLeaveRoom = async (roomId: string) => {
		console.log("handleLeaveRoom", roomId);
		if (!address) {
			toast.error("Please connect your wallet to leave a room");
			return;
		}
		try {
			await leaveRoom();
			toast.success("Left room successfully");
		} catch (error) {
			console.error("Failed to leave room:", error);
			toast.error("Failed to leave room");
		}
	};

	return (
		<div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/80 w-full">
			<LobbyHeader
				isConnecting={isConnecting}
				isConnected={isConnected}
			/>

			<main className="flex-1 py-6 w-full px-4">
				<div className="flex flex-col gap-6">
					<SearchBar
						searchQuery={searchQuery}
						onSearchChange={setSearchQuery}
						onCreateRoom={handleCreateRoom}
						isCreatingRoom={isCreatingRoom}
					/>

					<RoomList
						rooms={filteredRooms}
						isConnecting={isConnecting}
						isConnected={isConnected}
						connectionError={connectionError}
						onJoinRoom={handleJoinRoom}
						onLeaveRoom={handleLeaveRoom}
					/>
				</div>
			</main>
		</div>
	);
}
