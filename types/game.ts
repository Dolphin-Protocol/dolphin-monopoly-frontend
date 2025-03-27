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
