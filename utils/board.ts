import { CellType, CellData } from "@/types/cell";

export const createBoardData = (): CellData[] => {
	const data: CellData[] = new Array(64).fill(null).map((_, index) => ({
		type: CellType.NONE,
		position: index,
	}));

	let pathPosition = 0;
	for (let i = 0; i < 64; i++) {
		const row = Math.floor(i / 8);
		const col = i % 8;

		// Skip if not on the edge (rows and columns 1-6)
		if (row < 1 || row > 6 || col < 1 || col > 6) continue;

		// Skip if not on the path (only want the outer edge of 6x6)
		if (row > 1 && row < 6 && col > 1 && col < 6) continue;

		// Set cell types based on position
		if (row === 6 && col === 6) {
			data[i] = { type: CellType.START, position: pathPosition };
		} else if (row === 1 && col === 6) {
			data[i] = { type: CellType.CHANCE, position: pathPosition };
		} else if (row === 6 && col === 1) {
			data[i] = { type: CellType.CHANCE, position: pathPosition };
		} else if (row === 1 && col === 1) {
			data[i] = { type: CellType.JAIL, position: pathPosition };
		} else {
			data[i] = { type: CellType.PROPERTY, position: pathPosition };
		}
		pathPosition++;
	}

	return data;
};
