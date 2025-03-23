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
	const [showMockData, setShowMockData] = useState(false);
	const [useFallbackData, setUseFallbackData] = useState(false);

	// Automatically use mock data if connection fails
	useEffect(() => {
		if (!isConnecting && !isConnected) {
			setUseFallbackData(true);
		}
	}, [isConnecting, isConnected]);

	// Filter and search rooms
	const filteredRooms = serverRooms.filter((room) => {
		const matchesSearch =
			room.roomId.toLowerCase().includes(searchQuery.toLowerCase()) ||
			room.address.toLowerCase().includes(searchQuery.toLowerCase());
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

	// Toggle between mock data and server data
	const toggleMockData = () => {
		setShowMockData((prev) => !prev);
		// If we're switching to server data and we were using fallback data, reset it
		if (showMockData && useFallbackData) {
			setUseFallbackData(false);
		}
	};

	return (
		<div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/80 w-full">
			<LobbyHeader
				isConnecting={isConnecting}
				isConnected={isConnected && !useFallbackData}
				showMockData={showMockData || useFallbackData}
				onToggleMockData={toggleMockData}
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

					{useFallbackData && !showMockData && (
						<div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-md mb-2">
							<p className="font-medium">
								Connection to server failed
							</p>
							<p className="text-sm">
								Using mock data instead. You can still browse
								and interact with the rooms.
							</p>
						</div>
					)}

					<RoomList
						rooms={filteredRooms}
						isConnecting={isConnecting}
						isConnected={isConnected && !useFallbackData}
						showMockData={showMockData || useFallbackData}
						connectionError={connectionError}
						onJoinRoom={handleJoinRoom}
					/>
				</div>
			</main>
		</div>
	);
}
