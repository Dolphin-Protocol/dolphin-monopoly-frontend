"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLobby } from "@/hooks/game/useLobby";
import { LobbyHeader } from "./LobbyHeader";
import { SearchBar } from "./SearchBar";
import { RoomList } from "./RoomList";

export default function GameLobby() {
	const router = useRouter();

	const {
		isConnecting,
		isConnected,
		connectionError,
		rooms: serverRooms,
		createRoom,
	} = useLobby();

	const [searchQuery, setSearchQuery] = useState("");
	const [isCreatingRoom, setIsCreatingRoom] = useState(false);

	console.log("isConnected", isConnected);
	console.log("serverRooms", serverRooms);
	console.log("isConnecting", isConnecting);

	// Filter and search rooms
	const filteredRooms = serverRooms.filter((room) => {
		const matchesSearch =
			room.roomId.toLowerCase().includes(searchQuery.toLowerCase()) ||
			room.members[0].address.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesSearch;
	});

	// Handle room creation
	const handleCreateRoom = async () => {
		try {
			setIsCreatingRoom(true);
			// Generate a random address
			const address = "0x1234567890123456789012345678901234567890";

			const result = await createRoom(address);
			console.log("result", result);
		} catch (error) {
			console.error("Failed to create room:", error);
		} finally {
			setIsCreatingRoom(false);
		}
	};

	// Handle room refresh - simplified as rooms update automatically
	const handleRefreshRooms = () => {
		window.location.reload();
	};

	// Handle joining a room
	const handleJoinRoom = (roomId: string) => {
		router.push(`/game/${roomId}`);
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
						onRefreshRooms={handleRefreshRooms}
						isCreatingRoom={isCreatingRoom}
					/>

					<RoomList
						rooms={filteredRooms}
						isConnecting={isConnecting}
						isConnected={isConnected}
						connectionError={connectionError}
						onJoinRoom={handleJoinRoom}
					/>
				</div>
			</main>
		</div>
	);
}
