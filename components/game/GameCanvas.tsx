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
		const waterTileset = map.addTilesetImage("Water", "Water")!;
		const GrassHillTileset = map.addTilesetImage(
			"NormalGrassHill",
			"Grass_Hill_Tiles_v2"
		)!;
		const DarkerGrassHillsTileset = map.addTilesetImage(
			"DarkerGrassHills",
			"Darker_Grass_Hills_Tiles_v2"
		)!;
		const SoilGroundHiIlsTileset = map.addTilesetImage(
			"SoilGroundHiIls",
			"Soil_Ground_HiIls_Tiles"
		)!;
		const StoneGroundHillsTileset = map.addTilesetImage(
			"StoneGroundHills",
			"Stone_Ground_Hills_Tiles"
		)!;
		const DarkerSoilGroundTileset = map.addTilesetImage(
			"DarkerSoilGround",
			"Darker_Soil_Ground_Tiles"
		)!;

		const WoodenBridgeTileset = map.addTilesetImage(
			"WoodenBridgeSimple",
			"Wooden_Bridge"
		);
		const WoodenBridgeV2Tileset = map.addTilesetImage(
			"WoodenBridge",
			"Wooden_Bridge_v2"
		);
		const WaterObjectsTileset = map.addTilesetImage(
			"Water_Objects",
			"Water_Objects"
		);
		const TreesTileset = map.addTilesetImage("Trees", "Trees");
		const GrassTileLayersTileset = map.addTilesetImage(
			"Grass",
			"Grass_Tile_layers"
		);
		const GrassTileLayers2Tileset = map.addTilesetImage(
			"Grass2",
			"Grass_Tile_layers2"
		);
		const ChickenHousesTileset = map.addTilesetImage(
			"ChickenHouses",
			"Chicken_Houses"
		);
		const BasicFurnitureTileset = map.addTilesetImage(
			"Basic_Furniture",
			"Basic_Furniture"
		);


		if (
			waterTileset &&
			GrassHillTileset &&
			DarkerGrassHillsTileset &&
			SoilGroundHiIlsTileset &&
			StoneGroundHillsTileset &&
			DarkerSoilGroundTileset &&
			WoodenBridgeTileset &&
			WoodenBridgeV2Tileset &&
			WaterObjectsTileset &&
			TreesTileset &&
			GrassTileLayersTileset &&
			GrassTileLayers2Tileset &&
			ChickenHousesTileset &&
			BasicFurnitureTileset
		) {
			const waterLayer = map.createLayer("water", waterTileset);
			const landLayer = map.createLayer("land", [
				GrassHillTileset,
				DarkerGrassHillsTileset,
				SoilGroundHiIlsTileset,
				StoneGroundHillsTileset,
				DarkerSoilGroundTileset,
			]);
			const backgroundItemsLayer = map.createLayer(
				"background_items",
				[
					WaterObjectsTileset,
					WoodenBridgeTileset,
					WoodenBridgeV2Tileset,
					GrassTileLayersTileset,
					GrassTileLayers2Tileset,
					ChickenHousesTileset,
					BasicFurnitureTileset,
					DarkerGrassHillsTileset,
					DarkerSoilGroundTileset,
					StoneGroundHillsTileset,
					SoilGroundHiIlsTileset,
					GrassHillTileset,
				]
			);
			const grassLayer = map.createLayer("grass", [
				GrassTileLayersTileset,
				GrassTileLayers2Tileset,
				GrassHillTileset,
				DarkerGrassHillsTileset,
			]);
			const housesLayer = map.createLayer("houses", ChickenHousesTileset);
			const camera = this.cameras.main;

			camera.setZoom(4);

			camera.centerOn(624, 624);

			camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		}
	}

	function update(this: Phaser.Scene) {}

	return <div id="phaser-container" className="w-full h-full" />;
}
