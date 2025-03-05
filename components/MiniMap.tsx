import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaMap } from "react-icons/fa";
import { FiMinus, FiPlus } from "react-icons/fi";

type MiniMapProps = {
	onCellClick: (index: number) => void;
	onZoomIn: () => void;
	onZoomOut: () => void;
};

const MiniMap = ({ onCellClick, onZoomIn, onZoomOut }: MiniMapProps) => {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<div className="absolute top-6 left-6 z-50">
			{isOpen ? (
				<div className="bg-white rounded-xl shadow-xl p-4 border-2 border-gray-200 relative">
					<button
						onClick={() => setIsOpen(false)}
						className="absolute -right-2 -top-2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-200"
					>
						<IoClose size={14} />
					</button>
					<div className="w-[240px] h-[240px] grid grid-cols-8 grid-rows-8 gap-[2px] bg-gray-200 p-2 rounded-lg">
						{Array.from({ length: 64 }).map((_, index) => (
							<div
								key={index}
								onClick={() => onCellClick(index)}
								className="bg-white hover:bg-blue-200 cursor-pointer transition-colors rounded-sm"
							/>
						))}
					</div>
					<div className="flex justify-end gap-1 mt-2">
						<button
							onClick={onZoomOut}
							className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
						>
							<FiMinus size={16} />
						</button>
						<button
							onClick={onZoomIn}
							className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
						>
							<FiPlus size={16} />
						</button>
					</div>
				</div>
			) : (
				<button
					onClick={() => setIsOpen(true)}
					className="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-200"
				>
					<FaMap size={16} />
				</button>
			)}
		</div>
	);
};

export default MiniMap;
