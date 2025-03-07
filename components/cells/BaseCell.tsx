import Image from "next/image";
import { CellData } from "@/types/cell";

interface BaseCellProps {
	data: CellData;
}

const BaseCell = ({ data }: BaseCellProps) => {

	return (
		<div className="w-full h-full relative">
			<Image
				src="/cells/normal-high.png"
				alt="Normal"
				fill
				className="object-cover"
			/>
		</div>
	);
};

export default BaseCell;
