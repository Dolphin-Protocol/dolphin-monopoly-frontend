import Button from "./Button";

type DiceRollProps = {
	onRoll: (value: number) => void;
	disabled?: boolean;
};

const DiceRoll = ({ onRoll, disabled = false }: DiceRollProps) => {
	const rollDice = () => {
		const value = Math.floor(Math.random() * 6) + 1;
		onRoll(value);
	};

	return (
		<Button onClick={rollDice} disabled={disabled}>
			Roll Dice
		</Button>
	);
};

export default DiceRoll;
