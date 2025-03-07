import Image from "next/image";
import { CellData } from "@/types/cell";

const PropertyCell = ({ data }: { data: CellData }) => {
	return (
		<div className="w-full h-full relative">
			<Image
				src="/cells/level-zero-ground-high.png"
				alt="Property"
				fill
				className="object-cover"
			/>
		</div>
	);
};

export default PropertyCell;
