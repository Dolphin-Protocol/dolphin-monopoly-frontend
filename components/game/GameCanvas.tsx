"use client";

import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import { PlayerState, Position } from "@/types/game";
import { PLAYER_ONE_DEFAULT_STATE, PLAYER_TWO_DEFAULT_STATE, PLAYER_THREE_DEFAULT_STATE, PLAYER_FOUR_DEFAULT_STATE } from "@/constants/states";
import { PLAYER_ONE_PATH , PLAYER_TWO_PATH, PLAYER_THREE_PATH} from "@/constants/paths";
import { PLAYER_FOUR_PATH } from "@/constants/paths";
import { HOUSE_POSITIONS } from "@/constants/houses";
type Player = {
	sprite: Phaser.GameObjects.Sprite;
	state: PlayerState;
};

let players: Player[] = [];
let currentPlayerIndex = 0;
const tileSize = 16;

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
		// this.load.spritesheet("House", "/houses/Chicken_Houses.png", {
		// 	frameWidth: 48,
		// 	frameHeight: 48,
		// });
		this.load.spritesheet("House_Level_1", "/houses/House_Level_1.png", {
			frameWidth: 32,
			frameHeight: 42,
		});
		this.load.spritesheet("House_Level_2", "/houses/House_Level_2.png", {
			frameWidth: 48,
			frameHeight: 48,
		});
		this.load.spritesheet("House_Level_3", "/houses/House_Level_3.png", {
			frameWidth: 64,
			frameHeight: 76,
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
			
			const camera = this.cameras.main;
			camera.setZoom(4);
			camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

			
			const playerOne = {
				sprite: this.add.sprite(
					PLAYER_ONE_DEFAULT_STATE.position.x * tileSize + tileSize / 2,
					PLAYER_ONE_DEFAULT_STATE.position.y * tileSize + tileSize / 2,
					"Player_one",
					8
				),
				state: PLAYER_ONE_DEFAULT_STATE,
			};
			
			const playerTwo = {
				sprite: this.add.sprite(
					PLAYER_TWO_DEFAULT_STATE.position.x * tileSize + tileSize / 2,
					PLAYER_TWO_DEFAULT_STATE.position.y * tileSize + tileSize / 2,
					"Player_one",
					8
				),
				state: PLAYER_TWO_DEFAULT_STATE,
			};

			const playerThree = {
				sprite: this.add.sprite(
					PLAYER_THREE_DEFAULT_STATE.position.x * tileSize + tileSize / 2,
					PLAYER_THREE_DEFAULT_STATE.position.y * tileSize + tileSize / 2,
					"Player_one",
					8
				),
				state: PLAYER_THREE_DEFAULT_STATE,
			};

			const playerFour = {
				sprite: this.add.sprite(
					PLAYER_FOUR_DEFAULT_STATE.position.x * tileSize + tileSize / 2,
					PLAYER_FOUR_DEFAULT_STATE.position.y * tileSize + tileSize / 2,
					"Player_one",
					8
				),
				state: PLAYER_FOUR_DEFAULT_STATE,
			};
			
			players.push(playerOne, playerTwo, playerThree, playerFour);
			this.cameras.main.startFollow(playerOne.sprite);

			this.input.on("pointerdown", () => {
				const playerObj = players[currentPlayerIndex];
				const path = getPathByPlayer(currentPlayerIndex);
				const steps = Phaser.Math.Between(1, 6);

				movePlayerAlongPath(this, playerObj, steps, path, () => {
					console.log("移動完畢");
				});
			});

			this.input.keyboard!.on("keydown-ENTER", () => {
				const player = players[currentPlayerIndex];
				const pos = HOUSE_POSITIONS[player.state.positionIndex];
				if (!pos) return;

				const housePosition = this.add.sprite(
					pos.x * tileSize,
					pos.y * tileSize,
					"House_Level_1",
					currentPlayerIndex
				);
				housePosition.setOrigin(0.5, 0.5);

				this.tweens.add({
					targets: housePosition,
					scale: { from: 0, to: 1 },
					duration: 800,
					ease: "Back.Out",
					onComplete: () => {
						this.time.delayedCall(400, () => {
							currentPlayerIndex =
								(currentPlayerIndex + 1) % players.length;
							const nextPlayer = players[currentPlayerIndex];

							this.cameras.main.pan(
								nextPlayer.sprite.x,
								nextPlayer.sprite.y,
								500,
								"Sine.easeInOut",
								true,
								(
									camera: Phaser.Cameras.Scene2D.Camera,
									progress: number
								) => {
									if (progress === 1) {
										this.cameras.main.startFollow(
											nextPlayer.sprite
										);
									}
								}
							);
						});
					},
				});
			});
		}
	}

	function update(this: Phaser.Scene) {}

	function getPathByPlayer(index: number): Position[] {
		return [
			PLAYER_ONE_PATH,
			PLAYER_TWO_PATH,
			PLAYER_THREE_PATH,
			PLAYER_FOUR_PATH,
		][index];
	}

	function getPlayerDefaultState(index: number): PlayerState {
		return [
			PLAYER_ONE_DEFAULT_STATE,
			PLAYER_TWO_DEFAULT_STATE,
			PLAYER_THREE_DEFAULT_STATE,
			PLAYER_FOUR_DEFAULT_STATE,
		][index];
	}

	function movePlayerAlongPath(
		scene: Phaser.Scene,
		playerObj: Player,
		steps: number,
		path: Position[],
		onComplete: () => void
	) {
		const moveStep = (step: number) => {
			const nextIndex = playerObj.state.positionIndex + 1;
			if (nextIndex >= path.length) {
				onComplete();
				return;
			}

			const nextPosition = path[nextIndex];
			playerObj.state.positionIndex = nextIndex;
			playerObj.state.direction = nextPosition.direction;
			playerObj.state.position = nextPosition;

			playerObj.sprite.anims.play(`walk-${nextPosition.direction}`, true);

			scene.tweens.add({
				targets: playerObj.sprite,
				x: nextPosition.x * tileSize + 8,
				y: nextPosition.y * tileSize + 8,
				duration: 300,
				onComplete: () => {
					if (step > 1) {
						moveStep(step - 1);
					} else {
						playerObj.sprite.anims.stop();
						onComplete();
					}
				},
			});
		};

		moveStep(steps);
	}

	return <div id="phaser-container" className="w-full h-full relative" />;
}
