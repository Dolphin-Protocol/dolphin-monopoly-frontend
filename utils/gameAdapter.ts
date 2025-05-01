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

	// 玩家路徑映射表
	const playerPaths = [
		PLAYER_ONE_PATH,
		PLAYER_TWO_PATH,
		PLAYER_THREE_PATH,
		PLAYER_FOUR_PATH,
	];

	// 獲取所有可購買的房產單元
	const propertyCells = houseCell.filter(
		(cell): cell is ApiPropertyCell => "owner" in cell && "buyPrice" in cell
	);

	// 創建房屋位置查找映射
	const positionToHouse = new Map<number, ApiPropertyCell>();
	propertyCells.forEach((cell) => {
		positionToHouse.set(cell.position, cell);
	});

	// 將後端玩家數據轉換為遊戲所需的玩家狀態
	const players = playersState.map((state, index) => {
		// 選擇對應的路徑數組
		const path = playerPaths[index] || playerPaths[0];

			// 確保位置索引在有效範圍內
			const positionIndex = Math.min(state.position, path.length - 1);

			// 獲取玩家當前的位置信息
			const position = path[positionIndex];

			// 獲取玩家擁有的房產
			const ownedHouses: House[] = propertyCells
				.filter((cell) => cell.owner === state.address)
				.map((cell) => {
					const housePosition = HOUSE_POSITIONS[cell.position];
					if (!housePosition) {
						console.warn(`房屋位置無效：${cell.position}`);
						return null;
					}
					return {
						x: housePosition.x,
						y: housePosition.y,
						level: cell.level,
					};
				})
				.filter((house): house is House => house !== null);

			// 創建玩家狀態
			return {
				playerIndex: index + 1,
				positionIndex,
				address: state.address,
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


export function initializeDefaultPlayers(
	roomData: ApiRoomData | null
): PlayerState[] {
	if (roomData) {
		return createPlayerStatesFromRoomData(roomData);
	}

	return [
		PLAYER_ONE_DEFAULT_STATE,
		PLAYER_TWO_DEFAULT_STATE,
		PLAYER_THREE_DEFAULT_STATE,
		PLAYER_FOUR_DEFAULT_STATE,
	];
}
