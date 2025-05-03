import PLAYER_COLORS from "@/constants/colors";

type PlayerColorKey = 1 | 2 | 3 | 4;
type PlayerColor = (typeof PLAYER_COLORS)[PlayerColorKey];

const getPlayerColor = (playerIndex: number): PlayerColor => {
	// 確保 playerIndex 在有效範圍內
	const safeIndex = Math.max(1, Math.min(4, playerIndex)) as PlayerColorKey;
	return PLAYER_COLORS[safeIndex];
};

export default getPlayerColor;
