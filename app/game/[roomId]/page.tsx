"use client";

import PhaserGame from "@/components/game/PhaserGame";
import GameControlHelp from "@/components/game/GameControlHelp";
import Gamepad from "@/components/game/Gamepad";
import StatusDialog from "@/components/game/StatusDialog";
import { useSocket } from "@/contexts/SocketContext";
import { useParams } from "next/navigation";
import { useGameActionContext } from "@/contexts/GameActionContext";

export default function GamePage() {
	
	const { rounds } = useGameActionContext();
	const { socket } = useSocket();
	const { roomId } = useParams<{ roomId: string }>();

	return (
		<div className="w-full h-full relative">
			<PhaserGame socket={socket} roomId={roomId} rounds={rounds} />
			<GameControlHelp />
			<Gamepad />
			<StatusDialog />
		</div>
	);
}
