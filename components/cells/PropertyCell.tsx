import { CellData } from "@/types/cell";

const PropertyCell = ({ data }: { data: CellData }) => {
	return (
		<div className="w-full h-full bg-blue-200 border border-gray-300 flex items-center justify-center">
			<span className="text-sm">{data.position}</span>
		</div>
	);
};

export default PropertyCell;
