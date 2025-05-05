"use client";

import * as Phaser from "phaser";
import { PlayerState, Position } from "@/types/game";
import {
	PLAYER_ONE_DEFAULT_STATE,
	PLAYER_TWO_DEFAULT_STATE,
	PLAYER_THREE_DEFAULT_STATE,
	PLAYER_FOUR_DEFAULT_STATE,
} from "@/constants/states";
import {
	PLAYER_ONE_PATH,
	PLAYER_TWO_PATH,
	PLAYER_THREE_PATH,
	PLAYER_FOUR_PATH,
} from "@/constants/paths";
import { Socket } from "socket.io-client";
import { initializeDefaultPlayers } from "@/utils/gameAdapter";
import { GameSocket } from "@/contexts/SocketContext";
import { HOUSE_POSITIONS } from "@/constants/houses";
export type Player = {
	sprite: Phaser.GameObjects.Sprite;
	state: PlayerState;
};

const tileSize = 16;

// 定義一個完整的遊戲場景類

// 這邊需要改型別，並且不用 index 去判斷玩家，而是使用地址
class MonopolyScene extends Phaser.Scene {
	socket: GameSocket;
	playerStates: PlayerState[];
	players: Player[];
	houseSprites: Phaser.GameObjects.Sprite[] = [];
	roomId: string;
	currentPlayerAddress: string;
	isMoving: boolean = false;
	isBuying: boolean = false;
	hasInitializedPlayers: boolean = false;
	hasInitializedHouses: boolean = false;
	rounds: number = 0;

	constructor(socket: Socket, roomId: string, rounds: number) {
		super("MonopolyScene");
		this.socket = socket;
		this.playerStates = [];
		this.players = [];
		this.houseSprites = [];
		this.roomId = roomId;
		this.currentPlayerAddress = "";
		this.isMoving = false;
		this.isBuying = false;
		this.hasInitializedPlayers = false;
		this.hasInitializedHouses = false;
		this.rounds = rounds;
	}

	preload() {
		console.log("preload 開始執行");
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
		this.load.image("Grass_Tile_layers", "/maps/Grass_Tile_Layers.png");
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
		this.load.spritesheet("Player_two", "/characters/Player_two.png", {
			frameWidth: 48,
			frameHeight: 48,
		});
		this.load.spritesheet("Player_three", "/characters/Player_three.png", {
			frameWidth: 48,
			frameHeight: 48,
		});
		this.load.spritesheet("Player_four", "/characters/Player_four.png", {
			frameWidth: 48,
			frameHeight: 48,
		});
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
		console.log("preload 執行完成");
	}

	create() {
		try {
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
				map.createLayer("water", waterTileset);
				map.createLayer("land", [
					GrassHillTileset,
					DarkerGrassHillsTileset,
					SoilGroundHiIlsTileset,
					StoneGroundHillsTileset,
					DarkerSoilGroundTileset,
				]);
				map.createLayer(
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
				 map.createLayer("grass", [
					GrassTileLayersTileset,
					GrassTileLayers2Tileset,
					GrassHillTileset,
					DarkerGrassHillsTileset,
				]);
				map.createLayer(
					"houses",
					ChickenHousesTileset
				);

				const camera = this.cameras.main;
				camera.setZoom(4);
				camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

				this.socket.emit("gameState", { roomId: this.roomId });

				this.socket.on("gameState", (data) => {
					console.log("收到遊戲狀態", data);
					if (!data || !data.gameState) {
						console.log("收到的遊戲狀態資料無效", data);
						return;
					}
					const defaultPlayers = initializeDefaultPlayers(
						data.gameState
					);
					console.log("defaultPlayers", defaultPlayers);
					this.playerStates = defaultPlayers;
					console.log("this.playerStates", this.playerStates);
					if (this.rounds === null || this.rounds === undefined)
						return;
					console.log("this.rounds", this.rounds);
					if (!this.hasInitializedPlayers) {
						this.initializePlayers();
					}
					this.initializeHouses();
				});

				this.createAnimations();
				this.setupSocketListeners();
				this.setupControl();
			}
		} catch (error) {
			console.error("Create 錯誤:", error);
		}
		console.log("create 執行完成");
	}

	createAnimations() {
		// 創建所有玩家的動畫
		for (let i = 1; i <= 4; i++) {
			this.anims.create({
				key: `walk-down-${i}`,
				frames: this.anims.generateFrameNumbers(
					`Player_${
						i === 1
							? "one"
							: i === 2
							? "two"
							: i === 3
							? "three"
							: "four"
					}`,
					{
						start: 0,
						end: 3,
					}
				),
				frameRate: 8,
				repeat: -1,
			});

			this.anims.create({
				key: `walk-up-${i}`,
				frames: this.anims.generateFrameNumbers(
					`Player_${
						i === 1
							? "one"
							: i === 2
							? "two"
							: i === 3
							? "three"
							: "four"
					}`,
					{
						start: 4,
						end: 7,
					}
				),
				frameRate: 8,
				repeat: -1,
			});

			this.anims.create({
				key: `walk-left-${i}`,
				frames: this.anims.generateFrameNumbers(
					`Player_${
						i === 1
							? "one"
							: i === 2
							? "two"
							: i === 3
							? "three"
							: "four"
					}`,
					{
						start: 8,
						end: 11,
					}
				),
				frameRate: 8,
				repeat: -1,
			});

			this.anims.create({
				key: `walk-right-${i}`,
				frames: this.anims.generateFrameNumbers(
					`Player_${
						i === 1
							? "one"
							: i === 2
							? "two"
							: i === 3
							? "three"
							: "four"
					}`,
					{
						start: 12,
						end: 15,
					}
				),
				frameRate: 8,
				repeat: -1,
			});
		}
	}

	initializePlayers() {
		console.log("initializePlayers 開始執行");
		const getFrameByDirection = (direction: string): number => {
			switch (direction) {
				case "down":
					return 0;
				case "up":
					return 4;
				case "left":
					return 8;
				case "right":
					return 12;
				default:
					return 8; // 默认为左
			}
		};

		// 使用传入的状态，如果没有则使用默认状态
		const playerOneState =
			this.playerStates[0] && this.playerStates.length > 0
				? this.playerStates[0]
				: PLAYER_ONE_DEFAULT_STATE;

		const playerTwoState =
			this.playerStates[1] && this.playerStates.length > 1
				? this.playerStates[1]
				: PLAYER_TWO_DEFAULT_STATE;

		const playerThreeState =
			this.playerStates[2] && this.playerStates.length > 2
				? this.playerStates[2]
				: PLAYER_THREE_DEFAULT_STATE;

		const playerFourState =
			this.playerStates[3] && this.playerStates.length > 3
				? this.playerStates[3]
				: PLAYER_FOUR_DEFAULT_STATE;

		const playerOne = this.playerStates[0]
			? {
					sprite: this.add.sprite(
						playerOneState.position.x * tileSize + tileSize / 2,
						playerOneState.position.y * tileSize + tileSize / 2,
						"Player_one",
						getFrameByDirection(playerOneState.direction)
					),
					state: playerOneState,
			  }
			: null;

		const playerTwo = this.playerStates[1]
			? {
					sprite: this.add.sprite(
						playerTwoState.position.x * tileSize + tileSize / 2,
						playerTwoState.position.y * tileSize + tileSize / 2,
						"Player_two",
						getFrameByDirection(playerTwoState.direction)
					),
					state: playerTwoState,
			  }
			: null;

		const playerThree = this.playerStates[2]
			? {
					sprite: this.add.sprite(
						playerThreeState.position.x * tileSize + tileSize / 2,
						playerThreeState.position.y * tileSize + tileSize / 2,
						"Player_three",
						getFrameByDirection(playerThreeState.direction)
					),
					state: playerThreeState,
			  }
			: null;

		const playerFour = this.playerStates[3]
			? {
					sprite: this.add.sprite(
						playerFourState.position.x * tileSize + tileSize / 2,
						playerFourState.position.y * tileSize + tileSize / 2,
						"Player_four",
						getFrameByDirection(playerFourState.direction)
					),
					state: playerFourState,
			  }
			: null;

		this.players = [playerOne, playerTwo, playerThree, playerFour].filter(
			(player) => player !== null
		);
		console.log("this.players", this.players);
		const currentPlayerIndex = this.rounds % this.players.length;
		const nextPlayer = this.players[currentPlayerIndex];
		if (!nextPlayer) return;
		this.cameras.main.pan(
			nextPlayer.sprite.x,
			nextPlayer.sprite.y,
			500,
			"Sine.easeInOut",
			true,
			(camera: Phaser.Cameras.Scene2D.Camera, progress: number) => {
				if (progress === 1) {
					this.cameras.main.startFollow(nextPlayer.sprite);
				}
			}
		);
		this.hasInitializedPlayers = true;
	}

	initializeHouses() {
		// 清除现有的房屋精灵
		this.houseSprites.forEach((sprite) => sprite.destroy());
		this.houseSprites = [];

		// 遍历所有玩家
		this.players.forEach((player, playerIndex) => {
			if (
				player.state.ownedHouses &&
				player.state.ownedHouses.length > 0
			) {
				player.state.ownedHouses.forEach((house) => {
					const houseSprite = this.add.sprite(
						house.x * tileSize,
						house.y * tileSize,
						`House_Level_${house.level || 1}`,
						playerIndex
					);
					houseSprite.setOrigin(0.5, 0.5);

					this.houseSprites.push(houseSprite);
				});
			}
		});
		this.hasInitializedHouses = true;
	}

	setupControl() {
		const qKey = this.input.keyboard!.addKey("Q");
		const eKey = this.input.keyboard!.addKey("E");

		const minZoom = 2;
		const maxZoom = 6;

		qKey.on("down", () => {
			const newZoom = this.cameras.main.zoom + 0.1;
			this.cameras.main.setZoom(
				Phaser.Math.Clamp(newZoom, minZoom, maxZoom)
			);
		});

		eKey.on("down", () => {
			const newZoom = this.cameras.main.zoom - 0.1;
			this.cameras.main.setZoom(
				Phaser.Math.Clamp(newZoom, minZoom, maxZoom)
			);
		});

		const upKey = this.input.keyboard!.addKey("W"); // 上
		const downKey = this.input.keyboard!.addKey("S"); // 下
		const leftKey = this.input.keyboard!.addKey("A"); // 左
		const rightKey = this.input.keyboard!.addKey("D"); // 右

		// 定义每次按键移动的像素数
		const moveDistance = 16; // 一个瓦片的大小

		// 上移动
		upKey.on("down", () => {
			this.cameras.main.stopFollow();
			this.cameras.main.scrollY -= moveDistance; 
		});

		// 下移动
		downKey.on("down", () => {
			this.cameras.main.stopFollow();
			this.cameras.main.scrollY += moveDistance;
		});

		// 左移动
		leftKey.on("down", () => {
			this.cameras.main.stopFollow();
			this.cameras.main.scrollX -= moveDistance;
		});

		// 右移动
		rightKey.on("down", () => {
			this.cameras.main.stopFollow();
			this.cameras.main.scrollX += moveDistance;
		});
	}

	setupSocketListeners() {
		this.socket.on("Move", ({ player, position }) => {
			console.log("收到骰子事件:", player, position);
			this.isMoving = true;

			const playerIndex = this.players.findIndex(
				(p) => p.state.address === player
			);
			if (playerIndex === -1) return;

			const playerObj = this.players[playerIndex];
			const path = this.getPathByPlayer(playerIndex);

			this.movePlayerAlongPath(playerObj, position, path, () => {
				console.log("移動完畢");
				this.isMoving = false;
				this.socket.emit("ChangeTurn", { roomId: this.roomId });
			});
		});

		this.socket.on("ActionRequest", ({ player, houseCell }) => {
			console.log("收到行動要求:", player, houseCell);
			this.isBuying = true;
		});

		this.socket.on("ChangeTurn", ({ player }) => {
			console.log("收到換人事件:", player);
			if (this.isBuying || this.isMoving) return;
			this.currentPlayerAddress = player;
			const playerIndex = this.players.findIndex(
				(p) => p.state.address === player
			);
			if (playerIndex === -1) return;
			const nextPlayer = this.players[playerIndex];

			// 平滑過渡到新的玩家
			this.cameras.main.pan(
				nextPlayer.sprite.x,
				nextPlayer.sprite.y,
				500,
				"Sine.easeInOut",
				true,
				(camera: Phaser.Cameras.Scene2D.Camera, progress: number) => {
					if (progress === 1) {
						this.cameras.main.startFollow(nextPlayer.sprite);
					}
				}
			);
		});

		this.socket.on("Buy", ({ player, purchased, houseCell }) => {
			if (!purchased) {
				this.isBuying = false;
				this.socket.emit("ChangeTurn", { roomId: this.roomId });
				return;
			}
			const pos = HOUSE_POSITIONS[houseCell.position];
			const playerIndex = this.players.findIndex(
				(p) => p.state.address === player
			);
			if (playerIndex === -1) return;
			if (!pos) return;
			const housePosition = this.add.sprite(
				pos.x * tileSize,
				pos.y * tileSize,
				`House_Level_${houseCell.level}`,
				playerIndex
			);
			housePosition.setOrigin(0.5, 0.5);

			this.tweens.add({
				targets: housePosition,
				scale: { from: 0, to: 1 },
				duration: 800,
				ease: "Back.Out",
				onComplete: () => {
					this.time.delayedCall(400, () => {
						this.isBuying = false;
						this.socket.emit("ChangeTurn", {
							roomId: this.roomId,
						});
					});
				},
			});
		});
	}

	getPathByPlayer(index: number): Position[] {
		return [
			PLAYER_ONE_PATH,
			PLAYER_TWO_PATH,
			PLAYER_THREE_PATH,
			PLAYER_FOUR_PATH,
		][index];
	}

	movePlayerAlongPath(
		playerObj: Player,
		targetPosition: number,
		path: Position[],
		onComplete: () => void
	) {
		this.cameras.main.startFollow(playerObj.sprite);
		const currentIndex = playerObj.state.positionIndex;
		const targetIndex = targetPosition;
		const steps = targetIndex - currentIndex;

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

			playerObj.sprite.anims.play(
				`walk-${nextPosition.direction}-${playerObj.state.playerIndex}`,
				true
			);

			this.tweens.add({
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
}

export default MonopolyScene;
