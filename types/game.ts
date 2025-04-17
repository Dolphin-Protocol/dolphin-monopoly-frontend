export type RoomMember = {
	clientId: string;
	address: string;
	isCreator: boolean;
};

export type Room = {
	roomId: string;
	members: RoomMember[];
	createdAt: Date;
};

export type Direction = "left" | "right" | "up" | "down";

export type Action = "BUY" | "UPGRADE" | "PAY_RENT" | "CHANCE" | "JAIL" | "START";

export type Position = {
	x: number;
	y: number;
	direction: Direction;
	action: Action[];
};

export type House = {
	x: number;
	y: number;
	level: number;
};

export type PlayerState = {
	positionIndex: number;
	direction: Direction;
	assets: number;
	position: Position;
	ownedHouses: House[];
};
