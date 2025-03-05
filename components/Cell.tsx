type CellProps = {
	index: number;
};

const Cell = ({ index }: CellProps) => {
	return (
		<div className="bg-white border border-gray-300 flex items-center justify-center text-xl">
			{index}
		</div>
	);
};

export default Cell;
