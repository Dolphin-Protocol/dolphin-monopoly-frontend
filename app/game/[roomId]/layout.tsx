"use client";
import { GameActionProvider } from "@/contexts/GameActionContext";

export default function GameLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<GameActionProvider>
			<main className="w-screen h-screen overflow-hidden">
				{children}
			</main>
		</GameActionProvider>
	);
}
