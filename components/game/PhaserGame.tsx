"use client";

import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import { Socket } from "socket.io-client";
import MonopolyScene from "./gameClass";

export default function PhaserGame({
	socket,
	roomId,
	rounds,
}: {
	socket: Socket;
	roomId: string;
	rounds: number | null;
}) {
	const gameRef = useRef<Phaser.Game | null>(null);

	useEffect(() => {
		console.log("rounds", rounds);
		if (rounds === null) return;
		if (gameRef.current) {
			console.log("銷毀 Phaser 遊戲");
			gameRef.current.destroy(true);
			gameRef.current = null;
		}

		const config: Phaser.Types.Core.GameConfig = {
			type: Phaser.AUTO,
			width: window.innerWidth,
			height: window.innerHeight,
			parent: "phaser-container",
			physics: {
				default: "arcade",
				arcade: {
					gravity: { y: 0, x: 0 },
				},
			},
			audio: {
				noAudio: true,
			},
			scene: [new MonopolyScene(socket, roomId, rounds)],
		};

		gameRef.current = new Phaser.Game(config);

		return () => {
			console.log("銷毀 Phaser 遊戲");
			gameRef.current?.destroy(true);
			gameRef.current = null;
		};
	}, [socket, roomId, rounds]);

	return (
		<div
			id="phaser-container"
			className="w-full h-full relative"
		/>
	);
}
