"use client";

import React, { useEffect, useRef } from "react";
import Phaser from "phaser";

export default function PhaserGame() {
	const gameRef = useRef<Phaser.Game | null>(null);

	useEffect(() => {
		if (gameRef.current) return;

		const config: Phaser.Types.Core.GameConfig = {
			type: Phaser.AUTO,
			width: 800,
			height: 600,
			parent: "phaser-container",
			physics: {
				default: "arcade",
				arcade: {
					gravity: { y: 0, x: 0 },
				},
			},
			scene: {
				preload,
				create,
				update,
			},
		};

		gameRef.current = new Phaser.Game(config);

		return () => {
			gameRef.current?.destroy(true);
			gameRef.current = null;
		};
	}, []);

	function preload(this: Phaser.Scene) {
		this.load.tilemapTiledJSON("map", "/maps/map.json");
        this.load.on(
			"filecomplete",
			function (key: string, type: string, data: any) {
				console.log("File loaded:", key, type);
			}
		);
		// this.load.image("wooden_bridge", "/maps/Wooden_Bridge.png");
		// this.load.image("wooden_bridge_v2", "/maps/Wooden_Bridge_v2.png");
		this.load.image("Water", "/maps/Water.png");
		// this.load.image("water_objects", "/maps/Water_Objects.png");
		// this.load.image("trees", "/maps/Trees.png");
		// this.load.image(
		// 	"stone_ground_hills_tiles",
		// 	"/maps/Stone_Ground_Hills_Tiles.png"
		// );
		// this.load.image(
		// 	"soil_ground_hills_tiles",
		// 	"/maps/Soil_Ground_HiIls_Tiles.png"
		// );
		// this.load.image("paths", "/maps/Paths.png");
		// this.load.image(
		// 	"grass_hill_tiles_slopes_v2",
		// 	"/maps/Grass_Hill_Tiles_Slopes_v2.png"
		// );
		// this.load.image("grass_hill_tiles_v2", "/maps/Grass_Hill_Tiles_v2.png");
		// this.load.image("grass_tile_layers2", "/maps/Grass_Tile_layers2.png");
		// this.load.image(
		// 	"darker_soil_ground_tiles",
		// 	"/maps/Darker_Soil_Ground_Tiles.png"
		// );
		// this.load.image("grass_tile_layers", "/maps/Grass_Tile_layers.png");
		// this.load.image(
		// 	"darker_grass_hills_tiles_v2",
		// 	"/maps/Darker_Grass_Hills_Tiles_v2.png"
		// );
		// this.load.image("chicken_houses", "/maps/Chicken_Houses.png");
		// this.load.image("basic_furniture", "/maps/Basic_Furniture.png");
	}

	function create(this: Phaser.Scene) {
		const map = this.make.tilemap({ key: "map" });
        console.log("Map:", map);
		const waterTileset = map.addTilesetImage("Water", "Water");
		const waterLayer = map.createLayer("water", waterTileset!);
        console.log("Water layer:", waterLayer);
	}

	function update(this: Phaser.Scene) {}

	return <div id="phaser-container" className="w-full h-full" />;
}
