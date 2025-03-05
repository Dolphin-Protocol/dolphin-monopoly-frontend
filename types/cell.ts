export enum CellType {
	NONE = "NONE", // 無功能
	START = "START", // 起點
	PROPERTY = "PROPERTY", // 一般土地
	JAIL = "JAIL", // 監獄
	CHANCE = "CHANCE", // 機會與命運
}

export interface CellData {
	type: CellType;
	position: number; // 在環形路徑中的位置
	name?: string; // 格子名稱
}
