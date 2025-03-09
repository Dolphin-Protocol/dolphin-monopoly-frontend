import { io, Socket } from "socket.io-client";

/**
 * 簡單的 Socket.io 連接測試函數
 * @param url 要連接的 Socket 伺服器 URL
 * @param options 連接選項
 * @returns 連接結果的 Promise
 */
export const testSocketConnection = (
	url: string,
	options: any = {}
): Promise<{ success: boolean; message: string; socket?: Socket }> => {
	return new Promise((resolve) => {
		console.log(`嘗試連接到 Socket 伺服器: ${url}`);

		// 設置連接超時時間
		const timeout = setTimeout(() => {
			if (socket.connected) {
				socket.disconnect();
			}
			resolve({
				success: false,
				message: "連接超時，請檢查伺服器地址或網絡連接",
			});
		}, 5000); // 5 秒超時

		// 創建 socket 連接
		const socket = io(url, {
			transports: ["websocket"],
			reconnection: false,
			timeout: 5000,
			...options,
		});

		// 連接成功
		socket.on("connect", () => {
			clearTimeout(timeout);
			console.log("Socket 連接成功!");
			console.log(`Socket ID: ${socket.id}`);

			resolve({
				success: true,
				message: `成功連接到 ${url}，Socket ID: ${socket.id}`,
				socket,
			});
		});

		// 連接錯誤
		socket.on("connect_error", (error) => {
			clearTimeout(timeout);
			console.error("Socket 連接錯誤:", error);

			resolve({
				success: false,
				message: `連接錯誤: ${error.message}`,
			});

			socket.disconnect();
		});

		// 連接超時
		socket.on("connect_timeout", () => {
			clearTimeout(timeout);
			console.error("Socket 連接超時");

			resolve({
				success: false,
				message: "連接超時",
			});

			socket.disconnect();
		});
	});
};

/**
 * 斷開 Socket 連接
 * @param socket Socket 實例
 */
export const disconnectSocket = (socket: Socket): void => {
	if (socket && socket.connected) {
		console.log("斷開 Socket 連接");
		socket.disconnect();
	}
};
