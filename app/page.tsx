"use client";

import dynamic from "next/dynamic";

const GameLobby = dynamic(() => import("@/components/lobby/GameLobby"), {
	ssr: false,
});

export default function LobbyPage() {
	return <GameLobby />;
}
