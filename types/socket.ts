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

export type PlayerState = {
	playerId: string;
	playerAddress: string;
	playerPosition: number;
	playerAsset: number;
	playerAction: Action;
	playerHouse: HouseCell[];
};

export type GameState = {
    roomInfo: RoomInfo;
    playerState: PlayerState;
    houseCell: HouseCell[];
}