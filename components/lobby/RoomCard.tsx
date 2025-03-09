import { Users, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Room } from "@/types/game";

interface RoomCardProps {
	room: Room;
	onJoin: (roomId: string) => void;
}

export function RoomCard({ room, onJoin }: RoomCardProps) {
	return (
		<Card className="overflow-hidden transition-all hover:shadow-md">
			<CardHeader className="pb-2">
				<div className="flex justify-between items-start">
					<CardTitle className="text-lg">{room.name}</CardTitle>
					<Badge
						variant={
							room.status === "playing" ? "secondary" : "default"
						}
					>
						{room.status}
					</Badge>
				</div>
				<CardDescription>Host: {room.creator}</CardDescription>
			</CardHeader>
			<CardContent className="pb-2">
				<div className="flex justify-between text-sm text-muted-foreground">
					<div className="flex items-center">
						<Users className="mr-1 h-4 w-4" />
						{room.players.length} Players
					</div>
					<div className="flex items-center">
						<Clock className="mr-1 h-4 w-4" />
						{new Date(room.createdAt).toLocaleTimeString()}
					</div>
				</div>
			</CardContent>
			<CardFooter className="pt-2 flex justify-between">
				<Badge variant="outline">
					{room.status === "waiting" ? "Open" : "In Progress"}
				</Badge>
				<Button
					variant="secondary"
					size="sm"
					disabled={room.status === "playing"}
					onClick={() => onJoin(room.id)}
				>
					Join
				</Button>
			</CardFooter>
		</Card>
	);
}
