import { Action } from "./game";

export type RoomInfo = {
    roomId: string;
    turnId: string;
    gameId: string;
    gameState: string;
}

export type HouseCell = {
    id: string;
    level: number;
    buyPrice: number;
    sellPrice: number;
    rent: number;
    position: number;
}

// 每個動作之後需要回傳的資料
export type PlayerState = {
	playerId: string;
	playerAddress: string;
	playerPosition: number;
	playerAsset: number;
	playerAction: Action;
	playerHouse: HouseCell[];
};

// 每個動作之後需要回傳的資料
export type GameState = {
    roomInfo: RoomInfo;
    playerState: PlayerState;
    houseCell: HouseCell[];
}

// 需要有一個 mock socket 來測試連線以及更新地圖狀態