import { CellData } from "@/types/cell";

const JailCell = ({ data }: { data: CellData }) => {
	return (
		<div className="w-full h-full bg-red-200 border border-gray-300 flex items-center justify-center">
			<span className="text-sm">監獄</span>
		</div>
	);
};

export default JailCell;
