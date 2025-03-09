export interface Room {
	id: string;
	name: string;
	creator: string;
	players: string[];
	status: "waiting" | "playing";
	createdAt: string;
}
