import { CellData } from "@/types/cell";

const ChanceCell = ({ data }: { data: CellData }) => {
	return (
		<div className="w-full h-full bg-yellow-200 border border-gray-300 flex items-center justify-center">
			<span className="text-sm">機會</span>
		</div>
	);
};

export default ChanceCell;
