"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
	initializeSocket,
	isSocketConnected,
	getSocket,
	disconnectSocket,
	checkRoom,
	joinRoom,
	leaveRoom,
	startGame,
	onPlayerJoined,
	onPlayerLeft,
	onGameStarted,
	offAllGameEvents,
} from "@/socket/gameSocket";

interface Player {
	id: string;
	address: string;
	isCreator: boolean;
}

interface Room {
	id: string;
	creator: {
		id: string;
		address: string;
	};
	players: Player[];
	status: "waiting" | "playing";
	createdAt: string;
}

export default function GamePage() {
	const params = useParams();
	const router = useRouter();
	const roomId = params.roomId as string;

	const [connectionStatus, setConnectionStatus] = useState<
		"connecting" | "connected" | "error"
	>("connecting");
	const [connectionError, setConnectionError] = useState<string>("");
	const [socketId, setSocketId] = useState<string>("");
	const [roomExists, setRoomExists] = useState<boolean>(false);
	const [roomInfo, setRoomInfo] = useState<Room | null>(null);
	const [playerAddress, setPlayerAddress] = useState<string>(
		"player_" + Math.random().toString(36).substring(2, 8)
	);
	const [isJoining, setIsJoining] = useState<boolean>(false);
	const [joinError, setJoinError] = useState<string>("");

	// 初始化 Socket 連接
	useEffect(() => {
		const connectToServer = async () => {
			try {
				setConnectionStatus("connecting");
				setConnectionError("");

				const result = await initializeSocket();

				if (result.success) {
					setConnectionStatus("connected");
					setSocketId(result.socket?.id || "");

					// 檢查房間是否存在
					checkRoom();
				} else {
					setConnectionStatus("error");
					setConnectionError(result.message);
				}
			} catch (error) {
				setConnectionStatus("error");
				setConnectionError(
					error instanceof Error ? error.message : "連接失敗"
				);
			}
		};

		connectToServer();

		// 清理函數
		return () => {
			disconnectSocket();
		};
	}, []);

	// 設置事件監聽器
	useEffect(() => {
		if (connectionStatus === "connected") {
			// 監聽玩家加入事件
			onPlayerJoined((data) => {
				if (data.roomId === roomId) {
					console.log("新玩家加入:", data);
					setRoomInfo((prev) => {
						if (!prev) return null;
						return {
							...prev,
							players: data.players,
						};
					});
				}
			});

			// 監聽玩家離開事件
			onPlayerLeft((data) => {
				if (data.roomId === roomId) {
					console.log("玩家離開:", data);
					setRoomInfo((prev) => {
						if (!prev) return null;
						return {
							...prev,
							players: data.players,
						};
					});
				}
			});

			// 監聽遊戲開始事件
			onGameStarted((data) => {
				if (data.roomId === roomId) {
					console.log("遊戲開始:", data);
					setRoomInfo((prev) => {
						if (!prev) return null;
						return {
							...prev,
							status: "playing",
						};
					});
				}
			});
		}

		return () => {
			offAllGameEvents();
		};
	}, [connectionStatus, roomId]);

	// 檢查房間是否存在
	const checkRoom = () => {
		const socket = getSocket();
		if (!socket) {
			setConnectionError("未連接到伺服器");
			return;
		}

		// 發送檢查房間事件
		socket.emit("checkRoom", { roomId }, (response: any) => {
			console.log("檢查房間回應:", response);

			if (response && response.exists) {
				setRoomExists(true);
				setRoomInfo(response.room);
			} else {
				setRoomExists(false);
				setConnectionError(`房間 ${roomId} 不存在`);
			}
		});
	};

	// 加入房間
	const handleJoinRoom = () => {
		if (!playerAddress.trim()) {
			setJoinError("請輸入您的地址");
			return;
		}

		const socket = getSocket();
		if (!socket) {
			setConnectionError("未連接到伺服器");
			return;
		}

		// 發送加入房間事件
		socket.emit(
			"joinRoom",
			{ roomId, address: playerAddress },
			(response: any) => {
				console.log("加入房間回應:", response);

				if (response && response.success) {
					setRoomInfo(response.room);
				} else {
					setJoinError(response?.message || "加入房間失敗");
				}
			}
		);
	};

	// 離開房間
	const handleLeaveRoom = async () => {
		const socket = getSocket();
		if (!socket) {
			setConnectionError("未連接到伺服器");
			return;
		}

		// 發送離開房間事件
		socket.emit("leaveRoom", { roomId }, (response: any) => {
			console.log("離開房間回應:", response);

			if (response && response.success) {
				router.push("/");
			} else {
				setConnectionError(response?.message || "離開房間失敗");
			}
		});
	};

	// 開始遊戲
	const handleStartGame = () => {
		const socket = getSocket();
		if (!socket) {
			setConnectionError("未連接到伺服器");
			return;
		}

		// 發送開始遊戲事件
		socket.emit("startGame", { roomId }, (response: any) => {
			console.log("開始遊戲回應:", response);

			if (response && response.success) {
				console.log("遊戲已開始:", response.gameState);
			} else {
				setConnectionError(response?.message || "開始遊戲失敗");
			}
		});
	};

	// 渲染連接狀態
	const renderConnectionStatus = () => {
		if (connectionStatus === "connecting") {
			return (
				<div className="p-4 bg-yellow-100 text-yellow-800 rounded-md mb-4">
					正在連接到遊戲伺服器...
				</div>
			);
		}

		if (connectionStatus === "error" || !roomExists) {
			return (
				<div className="p-4 bg-red-100 text-red-800 rounded-md mb-4">
					<p className="font-bold">錯誤</p>
					<p>{connectionError}</p>
				</div>
			);
		}

		return (
			<div className="p-4 bg-green-100 text-green-800 rounded-md mb-4">
				<p className="font-bold">已連接到遊戲伺服器</p>
				<p>Socket ID: {socketId}</p>
				<p>房間 ID: {roomId}</p>
			</div>
		);
	};

	// 渲染房間信息
	const renderRoomInfo = () => {
		if (!roomInfo) return null;

		return (
			<div className="mb-6">
				<h2 className="text-xl font-semibold mb-2">房間信息</h2>
				<div className="bg-gray-100 p-4 rounded-md">
					<p>
						<span className="font-medium">房間 ID:</span>{" "}
						{roomInfo.id}
					</p>
					<p>
						<span className="font-medium">狀態:</span>{" "}
						{roomInfo.status === "waiting" ? "等待中" : "遊戲中"}
					</p>
					{roomInfo.creator && (
						<p>
							<span className="font-medium">房主:</span>{" "}
							{roomInfo.creator.address}
						</p>
					)}

					{roomInfo.players && (
						<div className="mt-4">
							<h3 className="font-medium mb-2">
								玩家列表 ({roomInfo.players.length})
							</h3>
							<ul className="space-y-2">
								{roomInfo.players.map((player: any) => (
									<li
										key={player.id}
										className="flex items-center"
									>
										<span className="w-2 h-2 rounded-full mr-2 bg-gray-500"></span>
										<span>{player.address}</span>
										{player.isCreator && (
											<span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
												房主
											</span>
										)}
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</div>
		);
	};

	// 渲染加入房間表單
	const renderJoinForm = () => {
		if (!roomExists || (roomInfo && roomInfo.status !== "waiting"))
			return null;

		return (
			<div className="mb-6">
				<h2 className="text-xl font-semibold mb-2">加入房間</h2>
				<div className="bg-gray-100 p-4 rounded-md">
					<div className="mb-4">
						<label
							htmlFor="playerAddress"
							className="block text-sm font-medium mb-1"
						>
							您的地址
						</label>
						<input
							id="playerAddress"
							type="text"
							value={playerAddress}
							onChange={(e) => setPlayerAddress(e.target.value)}
							className="w-full px-3 py-2 border rounded-md"
							placeholder="輸入您的地址"
						/>
					</div>

					{joinError && (
						<div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
							{joinError}
						</div>
					)}

					<button
						onClick={handleJoinRoom}
						disabled={!playerAddress.trim()}
						className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
					>
						加入房間
					</button>
				</div>
			</div>
		);
	};

	// 渲染房間控制按鈕
	const renderRoomControls = () => {
		if (!roomInfo || roomInfo.status !== "waiting") return null;

		return (
			<div className="mb-6">
				<div className="flex gap-2">
					<button
						onClick={handleStartGame}
						className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
					>
						開始遊戲
					</button>

					<button
						onClick={handleLeaveRoom}
						className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
					>
						離開房間
					</button>
				</div>
			</div>
		);
	};

	return (
		<div className="container mx-auto p-6 max-w-2xl">
			<h1 className="text-2xl font-bold mb-6">遊戲房間: {roomId}</h1>

			{renderConnectionStatus()}

			{connectionStatus === "connected" && roomExists && (
				<>
					{renderRoomInfo()}
					{renderJoinForm()}
					{renderRoomControls()}
				</>
			)}
		</div>
	);
}
