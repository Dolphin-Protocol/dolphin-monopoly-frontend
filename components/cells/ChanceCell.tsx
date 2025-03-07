import Image from "next/image";
import { CellData } from "@/types/cell";

const ChanceCell = ({ data }: { data: CellData }) => {
	return (
		<div className="w-full h-full relative">
			<Image
				src="/cells/chance-high.png"
				alt="Chance"
				fill
				className="object-cover"
			/>
		</div>
	);
};

export default ChanceCell;
