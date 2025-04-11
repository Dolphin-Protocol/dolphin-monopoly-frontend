"use client";

import React, { useEffect, useRef } from "react";
import Phaser from "phaser";

export default function PhaserGame() {
	const gameRef = useRef<Phaser.Game | null>(null);

	useEffect(() => {
		if (gameRef.current) return;

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
		this.load.image("Wooden_Bridge", "/maps/Wooden_Bridge.png");
		this.load.image("Wooden_Bridge_v2", "/maps/Wooden_Bridge_v2.png");
		this.load.image("Water", "/maps/Water.png");
		this.load.image("Water_Objects", "/maps/Water_Objects.png");
		this.load.image("Trees", "/maps/Trees.png");
		this.load.image(
			"Stone_Ground_Hills_Tiles",
			"/maps/Stone_Ground_Hills_Tiles.png"
		);
		this.load.image(
			"Soil_Ground_HiIls_Tiles",
			"/maps/Soil_Ground_HiIls_Tiles.png"
		);
		this.load.image("Paths", "/maps/Paths.png");
		this.load.image(
			"Grass_Hill_Tiles_Slopes_v2",
			"/maps/Grass_Hill_Tiles_Slopes_v2.png"
		);
		this.load.image("Grass_Hill_Tiles_v2", "/maps/Grass_Hill_Tiles_v2.png");
		this.load.image("Grass_Tile_layers2", "/maps/Grass_Tile_layers2.png");
		this.load.image(
			"Darker_Soil_Ground_Tiles",
			"/maps/Darker_Soil_Ground_Tiles.png"
		);
		this.load.image("Grass_Tile_layers", "/maps/Grass_Tile_layers.png");
		this.load.image(
			"Darker_Grass_Hills_Tiles_v2",
			"/maps/Darker_Grass_Hills_Tiles_v2.png"
		);
		this.load.image("Chicken_Houses", "/maps/Chicken_Houses.png");
		this.load.image("Basic_Furniture", "/maps/Basic_Furniture.png");
	}

	function create(this: Phaser.Scene) {
		const map = this.make.tilemap({ key: "map" });
		const waterTileset = map.addTilesetImage("Water", "Water");
		const landTileset1 = map.addTilesetImage(
			"NormalGrassHill",
			"Grass_Hill_Tiles_v2"
		)!;
		const landTileset2 = map.addTilesetImage(
			"DarkerGrassHills",
			"Darker_Grass_Hills_Tiles_v2"
		)!;
		const landTileset3 = map.addTilesetImage(
			"SoilGroundHiIls",
			"Soil_Ground_HiIls_Tiles"
		)!;
		const landTileset4 = map.addTilesetImage(
			"StoneGroundHills",
			"Stone_Ground_Hills_Tiles"
		)!;
		const landTileset5 = map.addTilesetImage(
			"DarkerSoilGround",
			"Darker_Soil_Ground_Tiles"
		)!;
		const waterLayer = map.createLayer("water", waterTileset!);

		if (
			landTileset1 &&
			landTileset2 &&
			landTileset3 &&
			landTileset4 &&
			landTileset5
		) {
			const landLayer = map.createLayer("land", [
				landTileset1,
				landTileset2,
				landTileset3,
				landTileset4,
				landTileset5,
			]);
		}
	}

	function update(this: Phaser.Scene) {}

	return <div id="phaser-container" className="w-full h-full" />;
}
