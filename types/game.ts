export interface Room {
	id: string; // UUID，房間記錄的唯一標識
	roomId: string; // UUID，房間的唯一 ID
	isCreator: boolean; // 是否為房間創建者
	address: string; // 創建用戶地址
	clientId: string; // WebSocket 客戶端 ID
	createdAt: string; // ISO 格式的時間戳
	members: string[]; // 參與房間的 clientId 列表
}
