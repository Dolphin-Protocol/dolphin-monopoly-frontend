export default function GameLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main className="w-screen h-screen overflow-hidden">
			{children}
		</main>
	);
}
