"use client";

import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import { Socket } from "socket.io-client";
import MonopolyScene from "./gameClass";
import { PlayerState } from "@/types/game";

export default function PhaserGame({
	players,
	currentPlayerIndex,
	socket,
}: {
	players: PlayerState[];
	currentPlayerIndex: number;
	socket: Socket;
}) {
	const gameRef = useRef<Phaser.Game | null>(null);

	useEffect(() => {
		// 如果已經有遊戲實例，先銷毀它
		if (gameRef.current) {
			gameRef.current.destroy(true);
			gameRef.current = null;
		}

		console.log("初始化 Phaser 遊戲");

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
			scene: [new MonopolyScene(socket, players, currentPlayerIndex)],
		};

		gameRef.current = new Phaser.Game(config);

		return () => {
			console.log("銷毀 Phaser 遊戲");
			gameRef.current?.destroy(true);
			gameRef.current = null;
		};
	}, [socket, players, currentPlayerIndex]); // 添加所有依賴

	return (
		<div
			id="phaser-container"
			className="w-full h-full relative"
			style={{ minHeight: "500px" }}
		/>
	);
}
