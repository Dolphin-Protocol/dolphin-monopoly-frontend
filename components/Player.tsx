type PlayerProps = {
	position: number;
};

const Player = ({ position }: PlayerProps) => {
	return (
		<div className="absolute w-8 h-8 bg-red-500 rounded-full transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2" />
	);
};

export default Player;
