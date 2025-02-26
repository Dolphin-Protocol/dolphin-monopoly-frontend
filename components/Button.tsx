type ButtonProps = {
	onClick: () => void;
	disabled?: boolean;
	children: React.ReactNode;
};

const Button = ({ onClick, disabled = false, children }: ButtonProps) => {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={`px-6 py-3 text-lg font-bold rounded-lg shadow-lg
        ${
			disabled
				? "bg-gray-400 cursor-not-allowed"
				: "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
		}
        text-white transition-colors`}
		>
			{children}
		</button>
	);
};

export default Button;
