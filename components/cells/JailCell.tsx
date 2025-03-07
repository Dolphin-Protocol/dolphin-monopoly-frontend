import Image from "next/image";
import { CellData } from "@/types/cell";

const JailCell = ({ data }: { data: CellData }) => {
	return (
		<div className="w-full h-full relative">
			<Image
				src="/cells/jail-high.png"
				alt="Jail"
				fill
				className="object-cover"
			/>
		</div>
	);
};

export default JailCell;
