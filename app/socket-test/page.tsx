"use client";

import { useState, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { testSocketConnection, disconnectSocket } from "@/socket/socketTest";

interface Message {
	type: "sent" | "received";
	content: string;
	timestamp: string;
}

export default function SocketTestPage() {
	const [serverUrl, setServerUrl] = useState<string>("http://localhost:3001");
	const [connectionStatus, setConnectionStatus] = useState<string>("未連接");
	const [statusMessage, setStatusMessage] = useState<string>("");
	const [isConnecting, setIsConnecting] = useState<boolean>(false);
	const [socket, setSocket] = useState<Socket | null>(null);
	const [socketId, setSocketId] = useState<string>("");
	const [message, setMessage] = useState<string>("");
	const [messages, setMessages] = useState<Message[]>([]);
	const [pingTime, setPingTime] = useState<number | null>(null);
	const pingStartTimeRef = useRef<number>(0);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// 當組件卸載時斷開連接
	useEffect(() => {
		return () => {
			if (socket) {
				disconnectSocket(socket);
			}
		};
	}, [socket]);

	// 設置 socket 事件監聽器
	useEffect(() => {
		if (!socket) return;

		// 歡迎消息
		socket.on("welcome", (data) => {
			addMessage("received", `歡迎消息: ${data.message}`);
		});

		// 消息回覆
		socket.on("message_reply", (data) => {
			addMessage("received", `伺服器回覆: ${data.reply}`);
		});

		// Pong 回覆
		socket.on("pong", () => {
			const endTime = Date.now();
			const latency = endTime - pingStartTimeRef.current;
			setPingTime(latency);
			addMessage("received", `Pong 回覆! 延遲: ${latency}ms`);
		});

		// 清理事件監聽器
		return () => {
			socket.off("welcome");
			socket.off("message_reply");
			socket.off("pong");
		};
	}, [socket]);

	// 自動滾動到最新消息
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	// 添加消息到列表
	const addMessage = (type: "sent" | "received", content: string) => {
		setMessages((prev) => [
			...prev,
			{
				type,
				content,
				timestamp: new Date().toLocaleTimeString(),
			},
		]);
	};

	// 測試連接
	const handleTestConnection = async () => {
		if (isConnecting) return;

		// 如果已經有連接，先斷開
		if (socket) {
			disconnectSocket(socket);
			setSocket(null);
			setSocketId("");
		}

		setIsConnecting(true);
		setConnectionStatus("連接中...");
		setStatusMessage("");
		setMessages([]);
		setPingTime(null);

		try {
			const result = await testSocketConnection(serverUrl);

			if (result.success) {
				setConnectionStatus("已連接");
				setStatusMessage(result.message);
				setSocket(result.socket || null);
				setSocketId(result.socket?.id || "");
			} else {
				setConnectionStatus("連接失敗");
				setStatusMessage(result.message);
			}
		} catch (error) {
			setConnectionStatus("連接錯誤");
			setStatusMessage(
				`發生錯誤: ${
					error instanceof Error ? error.message : String(error)
				}`
			);
		} finally {
			setIsConnecting(false);
		}
	};

	// 斷開連接
	const handleDisconnect = () => {
		if (socket) {
			disconnectSocket(socket);
			setSocket(null);
			setSocketId("");
			setConnectionStatus("已斷開");
			setStatusMessage("手動斷開連接");
		}
	};

	// 發送消息
	const handleSendMessage = () => {
		if (!socket || !message.trim()) return;

		socket.emit("message", message);
		addMessage("sent", `發送: ${message}`);
		setMessage("");
	};

	// 發送 Ping
	const handlePing = () => {
		if (!socket) return;

		pingStartTimeRef.current = Date.now();
		socket.emit("ping");
		addMessage("sent", "Ping 發送!");
		setPingTime(null);
	};

	return (
		<div className="container mx-auto p-6 max-w-2xl">
			<h1 className="text-2xl font-bold mb-6">Socket 連接測試</h1>

			<div className="mb-6">
				<label
					htmlFor="serverUrl"
					className="block text-sm font-medium mb-2"
				>
					Socket 伺服器 URL
				</label>
				<div className="flex gap-2">
					<input
						id="serverUrl"
						type="text"
						value={serverUrl}
						onChange={(e) => setServerUrl(e.target.value)}
						className="flex-1 px-4 py-2 border rounded-md"
						placeholder="例如: http://localhost:3001"
					/>
					<button
						onClick={handleTestConnection}
						disabled={isConnecting}
						className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
					>
						{isConnecting ? "連接中..." : "測試連接"}
					</button>
					{socket && (
						<button
							onClick={handleDisconnect}
							className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
						>
							斷開連接
						</button>
					)}
				</div>
			</div>

			<div className="border rounded-md p-4 mb-6">
				<h2 className="text-lg font-semibold mb-2">連接狀態</h2>
				<div className="mb-2">
					<span className="font-medium">狀態: </span>
					<span
						className={`font-bold ${
							connectionStatus === "已連接"
								? "text-green-600"
								: connectionStatus === "連接中..."
								? "text-yellow-600"
								: connectionStatus === "未連接"
								? "text-gray-600"
								: "text-red-600"
						}`}
					>
						{connectionStatus}
					</span>
				</div>
				{socketId && (
					<div className="mb-2">
						<span className="font-medium">Socket ID: </span>
						<span className="font-mono">{socketId}</span>
					</div>
				)}
				{pingTime !== null && (
					<div className="mb-2">
						<span className="font-medium">
							最近一次 Ping 延遲:{" "}
						</span>
						<span className="font-mono">{pingTime}ms</span>
					</div>
				)}
				{statusMessage && (
					<div className="mt-2 p-3 bg-gray-100 rounded-md">
						<p className="whitespace-pre-wrap break-words">
							{statusMessage}
						</p>
					</div>
				)}
			</div>

			{socket && (
				<div className="border rounded-md p-4 mb-6">
					<h2 className="text-lg font-semibold mb-2">通信測試</h2>

					<div className="mb-4">
						<button
							onClick={handlePing}
							className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mr-2"
						>
							發送 Ping
						</button>
						<span className="text-sm text-gray-600">
							測試連接延遲
						</span>
					</div>

					<div className="mb-4">
						<label
							htmlFor="message"
							className="block text-sm font-medium mb-2"
						>
							發送消息
						</label>
						<div className="flex gap-2">
							<input
								id="message"
								type="text"
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								onKeyDown={(e) =>
									e.key === "Enter" && handleSendMessage()
								}
								className="flex-1 px-4 py-2 border rounded-md"
								placeholder="輸入要發送的消息"
							/>
							<button
								onClick={handleSendMessage}
								disabled={!message.trim()}
								className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
							>
								發送
							</button>
						</div>
					</div>

					<div className="mt-4">
						<h3 className="text-md font-medium mb-2">消息記錄</h3>
						<div className="border rounded-md h-60 overflow-y-auto p-3 bg-gray-50">
							{messages.length === 0 ? (
								<p className="text-gray-500 text-center py-4">
									尚無消息
								</p>
							) : (
								messages.map((msg, index) => (
									<div
										key={index}
										className={`mb-2 p-2 rounded-md ${
											msg.type === "sent"
												? "bg-blue-100 ml-8"
												: "bg-gray-200 mr-8"
										}`}
									>
										<div className="text-sm">
											{msg.content}
										</div>
										<div className="text-xs text-gray-500 text-right">
											{msg.timestamp}
										</div>
									</div>
								))
							)}
							<div ref={messagesEndRef} />
						</div>
					</div>
				</div>
			)}

			<div className="border rounded-md p-4">
				<h2 className="text-lg font-semibold mb-2">使用說明</h2>
				<ol className="list-decimal list-inside space-y-2">
					<li>輸入您要測試的 Socket.io 伺服器 URL</li>
					<li>點擊「測試連接」按鈕</li>
					<li>連接成功後，可以使用 Ping 測試延遲或發送消息</li>
					<li>完成後，點擊「斷開連接」按鈕斷開連接</li>
				</ol>
				<p className="mt-4 text-sm text-gray-600">
					提示：您可以使用提供的測試伺服器，運行命令{" "}
					<code className="bg-gray-100 px-1 py-0.5 rounded">
						node socket/server.js
					</code>{" "}
					啟動本地測試伺服器。
				</p>
			</div>
		</div>
	);
}
