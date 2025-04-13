import { Button } from "../ui/button";

type DiceRollProps = {
	disabled?: boolean;
};

const DiceRoll = ({ disabled = false }: DiceRollProps) => {
	const handleRoll = () => {
		const rolled = Math.floor(Math.random() * 6) + 1;
		window.dispatchEvent(
			new CustomEvent("dice-rolled", { detail: rolled })
		);
	};

	return (
		<Button
			onClick={handleRoll}
			disabled={disabled}
			className="absolute right-6 top-6"
		>
			Roll Dice
		</Button>
	);
};

export default DiceRoll;
