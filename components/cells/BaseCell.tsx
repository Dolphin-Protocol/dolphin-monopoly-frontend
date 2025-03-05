import { CellData } from "@/types/cell";

interface BaseCellProps {
	data: CellData;
	isEdgeCell: boolean;
}

const BaseCell = ({ data, isEdgeCell }: BaseCellProps) => {
	if (!isEdgeCell) return <div className="bg-gray-100" />;

	return (
		<div className="bg-white border border-gray-300 flex items-center justify-center">
			<span className="text-sm">{data.position}</span>
		</div>
	);
};

export default BaseCell;
