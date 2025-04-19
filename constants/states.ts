import { PlayerState } from "@/types/game";
import { PLAYER_ONE_PATH, PLAYER_TWO_PATH, PLAYER_THREE_PATH, PLAYER_FOUR_PATH } from "./paths";

export const PLAYER_ONE_DEFAULT_STATE: PlayerState = {
	playerIndex: 1,
	positionIndex: 0,
	direction: "left",
	ownedHouses: [],
	assets: 1000,
	position: PLAYER_ONE_PATH[0],
};

export const PLAYER_TWO_DEFAULT_STATE: PlayerState = {
	playerIndex: 2,
	positionIndex: 0,
	direction: "left",
	ownedHouses: [],
	assets: 1000,
	position: PLAYER_TWO_PATH[0],
};

export const PLAYER_THREE_DEFAULT_STATE: PlayerState = {
	playerIndex: 3,
	positionIndex: 0,
	direction: "left",
	ownedHouses: [],
	assets: 1000,
	position: PLAYER_THREE_PATH[0],
};

export const PLAYER_FOUR_DEFAULT_STATE: PlayerState = {
	playerIndex: 4,
	positionIndex: 0,
	direction: "left",
	ownedHouses: [],
	assets: 1000,
	position: PLAYER_FOUR_PATH[0],
};
