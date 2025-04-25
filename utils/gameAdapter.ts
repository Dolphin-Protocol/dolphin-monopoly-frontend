import { PlayerState, House } from "@/types/game";
import { ApiRoomData, ApiPropertyCell } from "@/types/socket";
import {
	PLAYER_ONE_PATH,
	PLAYER_TWO_PATH,
	PLAYER_THREE_PATH,
	PLAYER_FOUR_PATH,
} from "@/constants/paths";
import { HOUSE_POSITIONS } from "@/constants/houses";
import {
	PLAYER_ONE_DEFAULT_STATE,
	PLAYER_TWO_DEFAULT_STATE,
	PLAYER_THREE_DEFAULT_STATE,
	PLAYER_FOUR_DEFAULT_STATE,
} from "@/constants/states";

/**
 * 根据后端返回的房间数据创建玩家状态
 */
export function createPlayerStatesFromRoomData(
	roomData: ApiRoomData
): PlayerState[] {
	const { playersState, houseCell } = roomData;

	// 玩家路径映射表
	const playerPaths = [
		PLAYER_ONE_PATH,
		PLAYER_TWO_PATH,
		PLAYER_THREE_PATH,
		PLAYER_FOUR_PATH,
	];

	// 获取所有可购买的房产单元
	const propertyCells = houseCell.filter(
		(cell): cell is ApiPropertyCell => "owner" in cell && "buyPrice" in cell
	);

	// 创建房屋位置查找映射
	const positionToHouse = new Map<number, ApiPropertyCell>();
	propertyCells.forEach((cell) => {
		positionToHouse.set(cell.position, cell);
	});

	// 将后端玩家数据转换为游戏所需的玩家状态
	const players = Object.entries(playersState).map(
		([playerId, state], index) => {
			// 选择对应的路径数组
			const path = playerPaths[index] || playerPaths[0];

			// 确保位置索引在有效范围内
			const positionIndex = Math.min(state.position, path.length - 1);

			// 获取玩家当前的位置信息
			const position = path[positionIndex];

			// 获取玩家拥有的房产
			const ownedHouses: House[] = propertyCells
				.filter((cell) => cell.owner === playerId)
				.map((cell) => {
					// 使用 HOUSE_POSITIONS 获取房屋在棋盘上的位置
					const housePosition = HOUSE_POSITIONS[cell.position];

					// 如果位置无效（如 null），则跳过该房屋
					if (!housePosition) {
						console.warn(`房屋位置无效：${cell.position}`);
						return null;
					}

					return {
						x: housePosition.x,
						y: housePosition.y,
						level: cell.level,
					};
				})
				.filter((house): house is House => house !== null); // 过滤掉 null 值

			// 创建玩家状态
			return {
				playerIndex: index + 1, // 玩家索引从1开始
				positionIndex,
				address: playerId,
				direction: position.direction,
				assets: state.balance,
				position,
				ownedHouses,
			};
		}
	);

	return players;
}

/**
 * 更新已有的玩家状态
 */
export function updatePlayerStates(
	currentPlayers: PlayerState[],
	roomData: ApiRoomData
): PlayerState[] {
	const newPlayers = createPlayerStatesFromRoomData(roomData);

	// 如果当前没有玩家状态，直接返回新创建的
	if (!currentPlayers || currentPlayers.length === 0) {
		return newPlayers;
	}

	// 更新现有玩家状态以保持引用不变
	return currentPlayers.map((player, index) => {
		if (index < newPlayers.length) {
			return {
				...player,
				...newPlayers[index],
			};
		}
		return player;
	});
}

/**
 * 初始化默认玩家状态
 */
export function initializeDefaultPlayers(
	roomData: ApiRoomData | null
): PlayerState[] {
	// 如果有房间数据，使用它创建玩家状态
	if (roomData) {
		return createPlayerStatesFromRoomData(roomData);
	}

	// 否则返回默认状态
	return [
		PLAYER_ONE_DEFAULT_STATE,
		PLAYER_TWO_DEFAULT_STATE,
		PLAYER_THREE_DEFAULT_STATE,
		PLAYER_FOUR_DEFAULT_STATE,
	];
}
