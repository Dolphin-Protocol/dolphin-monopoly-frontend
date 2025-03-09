"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLobby } from "@/hooks/game/useLobby";
import { mockRooms } from "@/mock/rooms";
import { LobbyHeader } from "./LobbyHeader";
import { SearchBar } from "./SearchBar";
import { RoomList } from "./RoomList";

export default function GameLobby() {
	const router = useRouter();
	const {
		isConnecting,
		isConnected,
		connectionError,
		socketId,
		rooms: serverRooms,
		createRoom,
		getRooms,
		disconnect,
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

	// Use mock data if server connection fails, if showMockData is true, or if useFallbackData is true
	const rooms =
		showMockData || !isConnected || useFallbackData
			? mockRooms
			: serverRooms;

	// Filter and search rooms
	const filteredRooms = rooms.filter((room) => {
		const matchesSearch =
			room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			room.creator.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesSearch;
	});

	// Handle room creation
	const handleCreateRoom = async () => {
		try {
			setIsCreatingRoom(true);
			// Generate a random address
			const address = `player_${Math.random()
				.toString(36)
				.substring(2, 8)}`;

			if (showMockData || !isConnected || useFallbackData) {
				// Simulate room creation with mock data
				setTimeout(() => {
					const roomId = `ROOM${Math.random()
						.toString(36)
						.substring(2, 8)
						.toUpperCase()}`;
					router.push(`/game/${roomId}`);
				}, 1000);
			} else {
				// Create room using the API
				const result = await createRoom(address);
				if (result.roomId) {
					router.push(`/game/${result.roomId}`);
				}
			}
		} catch (error) {
			console.error("Failed to create room:", error);
			// If room creation fails, use mock data as fallback
			setUseFallbackData(true);
			setTimeout(() => {
				const roomId = `ROOM${Math.random()
					.toString(36)
					.substring(2, 8)
					.toUpperCase()}`;
				router.push(`/game/${roomId}`);
			}, 1000);
		} finally {
			setIsCreatingRoom(false);
		}
	};

	// Handle room refresh
	const handleRefreshRooms = async () => {
		if (isConnected && !showMockData && !useFallbackData) {
			try {
				await getRooms();
			} catch (error) {
				console.error("Failed to refresh rooms:", error);
				setUseFallbackData(true);
			}
		} else {
			// Just toggle mock data to simulate refresh
			const currentMockData = [...mockRooms];
			setShowMockData((prev) => !prev);
			setTimeout(() => setShowMockData((prev) => !prev), 100);
		}
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
