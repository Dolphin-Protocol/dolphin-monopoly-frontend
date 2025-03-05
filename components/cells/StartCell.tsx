import { CellData } from "@/types/cell";

const StartCell = ({ data }: { data: CellData }) => {
	return (
		<div className="w-full h-full bg-green-200 border border-gray-300 flex items-center justify-center">
			<span className="text-sm">起點</span>
		</div>
	);
};

export default StartCell;
