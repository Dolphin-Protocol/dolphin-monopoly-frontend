"use client";

import { Trophy, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectionStatus } from "./ConnectionStatus";
import ProfilePopover from "./ProfilePopover";
interface LobbyHeaderProps {
	isConnecting: boolean;
	isConnected: boolean;
}

export function LobbyHeader({
	isConnecting,
	isConnected,
}: LobbyHeaderProps) {
	return (
		<header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full">
			<div className="flex h-16 items-center justify-between py-4 w-full px-4">
				<div className="flex items-center gap-2">
					<Trophy className="h-6 w-6 text-primary" />
					<h1 className="text-xl font-bold">Monopoly Game Lobby</h1>
					<ConnectionStatus
						isConnecting={isConnecting}
						isConnected={isConnected}
					/>
				</div>

				<div className="flex items-center gap-4">
					<ProfilePopover />
				</div>
			</div>
		</header>
	);
}
