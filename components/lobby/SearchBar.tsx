import { Search, Plus, Loader2, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
	onCreateRoom: () => void;
	onRefreshRooms: () => void;
	isCreatingRoom: boolean;
}

export function SearchBar({
	searchQuery,
	onSearchChange,
	onCreateRoom,
	onRefreshRooms,
	isCreatingRoom,
}: SearchBarProps) {
	return (
		<div className="flex flex-col sm:flex-row gap-4 justify-between">
			<div className="relative w-full sm:w-72">
				<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
				<Input
					type="search"
					placeholder="Search rooms or hosts..."
					className="pl-8"
					value={searchQuery}
					onChange={(e) => onSearchChange(e.target.value)}
				/>
			</div>

			<div className="flex gap-2">
				<Button
					className="w-full sm:w-auto"
					onClick={onCreateRoom}
					disabled={isCreatingRoom}
				>
					{isCreatingRoom ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Creating...
						</>
					) : (
						<>
							<Plus className="mr-2 h-4 w-4" />
							Create Room
						</>
					)}
				</Button>

				<Button
					variant="outline"
					onClick={onRefreshRooms}
					className="px-2"
				>
					<RefreshCw className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
