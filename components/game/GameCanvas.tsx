"use client";

import React, { useEffect, useRef } from "react";
import Phaser from "phaser";

type Direction = "left" | "right" | "up" | "down";

interface PlayerState {
	positionIndex: number;
	direction: Direction;
}

type Player = {
	sprite: Phaser.GameObjects.Sprite;
	state: PlayerState;
};

let players: Player[] = [];

const path: { x: number; y: number; direction: Direction }[] = [
	{ x: 40, y: 40, direction: "left" },
	{ x: 34, y: 40, direction: "left" },
	{ x: 28, y: 40, direction: "left" },
	{ x: 22, y: 40, direction: "left" },
	{ x: 16, y: 40, direction: "left" },
	{ x: 10, y: 40, direction: "up" },
	{ x: 10, y: 34, direction: "up" },
	{ x: 10, y: 28, direction: "up" },
	{ x: 10, y: 22, direction: "up" },
	{ x: 10, y: 16, direction: "up" },
	{ x: 10, y: 10, direction: "up" },
	{ x: 10, y: 10, direction: "right" },
	{ x: 16, y: 10, direction: "right" },
	{ x: 22, y: 10, direction: "right" },
	{ x: 28, y: 10, direction: "right" },
	{ x: 34, y: 10, direction: "right" },
	{ x: 40, y: 10, direction: "down" },
	{ x: 40, y: 16, direction: "down" },
	{ x: 40, y: 22, direction: "down" },
	{ x: 40, y: 28, direction: "down" },
	{ x: 40, y: 34, direction: "down" },
	{ x: 40, y: 40, direction: "left" },
];

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
		this.load.spritesheet("Player_one", "/characters/Player_one.png", {
			frameWidth: 48,
			frameHeight: 48,
		});
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
			const backgroundItemsLayer = map.createLayer("background_items", [
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
			]);
			const grassLayer = map.createLayer("grass", [
				GrassTileLayersTileset,
				GrassTileLayers2Tileset,
				GrassHillTileset,
				DarkerGrassHillsTileset,
			]);
			const housesLayer = map.createLayer("houses", ChickenHousesTileset);

			this.anims.create({
				key: "walk-down",
				frames: this.anims.generateFrameNumbers("Player_one", {
					start: 0,
					end: 3,
				}),
				frameRate: 8,
				repeat: -1,
			});

			this.anims.create({
				key: "walk-up",
				frames: this.anims.generateFrameNumbers("Player_one", {
					start: 4,
					end: 7,
				}),
				frameRate: 8,
				repeat: -1,
			});

			this.anims.create({
				key: "walk-left",
				frames: this.anims.generateFrameNumbers("Player_one", {
					start: 8,
					end: 11,
				}),
				frameRate: 8,
				repeat: -1,
			});

			this.anims.create({
				key: "walk-right",
				frames: this.anims.generateFrameNumbers("Player_one", {
					start: 12,
					end: 15,
				}),
				frameRate: 8,
				repeat: -1,
			});

			const tileSize = 16;

			const playerOneStart = { x: 40, y: 40 };
			const playerTwoStart = { x: 39, y: 39 };
			

			const camera = this.cameras.main;
			camera.setZoom(4);
			camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

			
			const playerOne = {
				sprite: this.add.sprite(
					playerOneStart.x * tileSize + tileSize / 2,
					playerOneStart.y * tileSize + tileSize / 2,
					"Player_one",
					1
				),
				state: { positionIndex: 0, direction: "left" } as PlayerState,
			};
			
			const playerTwo = {
				sprite: this.add.sprite(
					playerTwoStart.x * tileSize + tileSize / 2,
					playerTwoStart.y * tileSize + tileSize / 2,
					"Player_one",
					0
				),
				state: { positionIndex: 0, direction: "left" } as PlayerState,
			};
			
			players.push(playerOne, playerTwo);
			this.cameras.main.startFollow(playerOne.sprite);

			// this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
			// 	const worldPoint = pointer.positionToCamera(
			// 		this.cameras.main
			// 	) as Phaser.Math.Vector2;
			// 	const tileX = Math.floor(worldPoint.x / tileSize);
			// 	const tileY = Math.floor(worldPoint.y / tileSize);
			// 	const steps = Phaser.Math.Between(1, 6);
			// 	console.log(steps);

			// 	movePlayer(this, playerOneSprite, playerState, steps, tileSize);
			// });
		}
	}

	function update(this: Phaser.Scene) {}

	function movePlayer(
		scene: Phaser.Scene,
		player: Phaser.GameObjects.Sprite,
		playerState: PlayerState,
		steps: number,
		tileSize: number
	) {
		let nextIndex = (playerState.positionIndex + steps) % path.length;
		const { x, y, direction } = path[nextIndex];

		playerState.positionIndex = nextIndex;
		playerState.direction = direction;

		player.anims.play("walk-" + direction, true);

		scene.tweens.add({
			targets: player,
			x: x * tileSize + tileSize / 2,
			y: y * tileSize + tileSize / 2,
			duration: 300 * steps,
			ease: "Linear",
			onComplete: () => {
				player.anims.stop();
			},
		});
	}

	return <div id="phaser-container" className="w-full h-full relative" />;
}
