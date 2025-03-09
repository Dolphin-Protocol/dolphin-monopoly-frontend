import { Trophy, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConnectionStatus } from "./ConnectionStatus";

interface LobbyHeaderProps {
	isConnecting: boolean;
	isConnected: boolean;
	showMockData: boolean;
	onToggleMockData: () => void;
}

export function LobbyHeader({
	isConnecting,
	isConnected,
	showMockData,
	onToggleMockData,
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
						showMockData={showMockData}
					/>
				</div>

				<div className="flex items-center gap-4">
					<Button
						variant="outline"
						size="sm"
						onClick={onToggleMockData}
					>
						{showMockData ? "Use Server Data" : "Use Mock Data"}
					</Button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="sm" className="gap-2">
								<Avatar className="h-8 w-8">
									<AvatarImage src="" alt="User Avatar" />
									<AvatarFallback>User</AvatarFallback>
								</Avatar>
								<span className="hidden md:inline">
									Username
								</span>
								<ChevronDown className="h-4 w-4 opacity-50" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuItem>
								<User className="mr-2 h-4 w-4" />
								<span>Profile</span>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings className="mr-2 h-4 w-4" />
								<span>Settings</span>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<LogOut className="mr-2 h-4 w-4" />
								<span>Logout</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
