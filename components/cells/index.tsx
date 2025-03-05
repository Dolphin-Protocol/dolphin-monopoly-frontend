"use client";
import { CellType, CellData } from "@/types/cell";
import StartCell from "./StartCell";
import PropertyCell from "./PropertyCell";
import JailCell from "./JailCell";
import ChanceCell from "./ChanceCell";

interface CellProps {
	data: CellData;
}

const Cell = ({ data }: CellProps) => {
	switch (data.type) {
		case CellType.START:
			return <StartCell data={data} />;
		case CellType.PROPERTY:
			return <PropertyCell data={data} />;
		case CellType.JAIL:
			return <JailCell data={data} />;
		case CellType.CHANCE:
			return <ChanceCell data={data} />;
		default:
			return <div className="bg-gray-100" />;
	}
};

export default Cell;
