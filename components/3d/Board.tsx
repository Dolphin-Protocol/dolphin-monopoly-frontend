import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Environment, Sky } from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Outline, Bloom } from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";

const CELL_COLORS = {
	start: "#FF5252",
	property: "#4CAF50",
	chance: "#FF9800",
	tax: "#9C27B0",
	jail: "#607D8B",
	parking: "#795548",
	goToJail: "#F44336",
	utility: "#00BCD4",
	railroad: "#8BC34A",
};

interface Cell {
	id: number;
	name: string;
	type:
		| "start"
		| "property"
		| "chance"
		| "tax"
		| "jail"
		| "parking"
		| "goToJail"
		| "utility"
		| "railroad";
	position: THREE.Vector3;
	rotation: THREE.Euler;
}

// Player data type definition
interface Player {
	id: number;
	name: string;
	position: number; // Cell index position
	color: string;
	// Animation related fields
	targetPosition?: number; // Target position
	isMoving?: boolean; // Whether moving or not
}

// City road cell component
const CityCell: React.FC<{ cell: Cell }> = ({ cell }) => {
	const roadColor = "#555555"; // Road color
	const roadWidth = 6.0; // Exactly match cellWidth for no gaps
	const cellHeight = 0.1; // Cell height

	return (
		<group position={cell.position} rotation={cell.rotation}>
			{/* Cell base - using exact width square */}
			<mesh position={[0, 0, 0]}>
				<boxGeometry args={[roadWidth, cellHeight, roadWidth]} />
				<meshStandardMaterial color="#333333" roughness={0.8} />
			</mesh>

			{/* Cell inner color area - make it nearly the same size */}
			<mesh position={[0, cellHeight + 0.01, 0]}>
				<boxGeometry
					args={[
						roadWidth * 0.98,
						cellHeight * 0.5,
						roadWidth * 0.98,
					]}
				/>
				<meshStandardMaterial
					color={CELL_COLORS[cell.type]}
					transparent
					opacity={0.8}
				/>
			</mesh>

			{/* Cell name */}
			<Text
				position={[0, cellHeight + 0.1, 0]}
				rotation={[-Math.PI / 2, 0, 0]}
				fontSize={0.5}
				color="white"
				anchorX="center"
				anchorY="middle"
				userData={{ outline: true }}
			>
				{cell.name}
			</Text>
		</group>
	);
};

// Player token component - adjusted height to fit new cell size
const PlayerToken: React.FC<{
	player: Player;
	cellPositions: Cell[];
	updatePlayerPosition: (id: number, newPosition: number) => void;
}> = ({ player, cellPositions, updatePlayerPosition }) => {
	const meshRef = useRef<THREE.Mesh>(null);
	const [currentVisualPosition, setCurrentVisualPosition] =
		useState<THREE.Vector3 | null>(null);
	const animationRef = useRef({
		isAnimating: false,
		startTime: 0,
		startPosition: new THREE.Vector3(),
		targetPosition: new THREE.Vector3(),
		duration: 500, // Animation duration (milliseconds)
	});

	// Get 3D coordinates for current position
	const getPositionCoordinates = (positionIndex: number): THREE.Vector3 => {
		if (!cellPositions || cellPositions.length === 0)
			return new THREE.Vector3(0, 0.4, 0);

		const validIndex = Math.min(positionIndex, cellPositions.length - 1);
		if (cellPositions[validIndex] && cellPositions[validIndex].position) {
			const pos = cellPositions[validIndex].position.clone();
			pos.y += 0.8; // Increased token height to fit new cell size (from 0.4 to 0.8)
			return pos;
		}
		return new THREE.Vector3(0, 0.8, 0);
	};

	// Initialize position
	useEffect(() => {
		if (cellPositions && cellPositions.length > 0) {
			setCurrentVisualPosition(getPositionCoordinates(player.position));
		}
	}, [cellPositions, player.position]);

	// Handle target position changes
	useEffect(() => {
		if (
			player.isMoving &&
			player.targetPosition !== undefined &&
			player.targetPosition !== player.position &&
			cellPositions.length > 0
		) {
			// Set animation parameters
			animationRef.current.isAnimating = true;
			animationRef.current.startTime = Date.now();
			animationRef.current.startPosition = getPositionCoordinates(
				player.position
			);
			animationRef.current.targetPosition = getPositionCoordinates(
				player.targetPosition
			);
		}
	}, [player.isMoving, player.targetPosition, cellPositions]);

	// Animation frame
	useFrame(() => {
		if (animationRef.current.isAnimating && currentVisualPosition) {
			const elapsed = Date.now() - animationRef.current.startTime;
			const { duration, startPosition, targetPosition } =
				animationRef.current;

			// Calculate animation progress (0-1)
			const progress = Math.min(elapsed / duration, 1);

			// Use easeInOutQuad easing function
			const easeProgress =
				progress < 0.5
					? 2 * progress * progress
					: 1 - Math.pow(-2 * progress + 2, 2) / 2;

			// Calculate current position
			const newPosition = new THREE.Vector3().lerpVectors(
				startPosition,
				targetPosition,
				easeProgress
			);

			// Update visual position
			setCurrentVisualPosition(newPosition);

			// Jump effect - reaches highest point midway through animation
			if (meshRef.current) {
				// Parabolic path, highest at animation midpoint
				const jumpHeight = 1.6; // Increased jump height (from 0.8 to 1.6)
				const jumpProgress = 4 * easeProgress * (1 - easeProgress); // 0->1->0
				meshRef.current.position.y =
					newPosition.y + jumpHeight * jumpProgress;
			}

			// Animation end
			if (progress >= 1) {
				animationRef.current.isAnimating = false;
				// Confirm player has reached target position
				updatePlayerPosition(player.id, player.targetPosition!);
			}
		}
	});

	if (!currentVisualPosition) return null;

	return (
		<mesh ref={meshRef} position={currentVisualPosition}>
			<sphereGeometry args={[0.7, 16, 16]} />
			{/* Increased token size (from 0.35 to 0.7) */}
			<meshStandardMaterial
				color={player.color}
				emissive={player.color}
				emissiveIntensity={0.3}
			/>
		</mesh>
	);
};

// Game board component - 6x6 square Monopoly layout
const CityRoads: React.FC<{
	players: Player[];
	updatePlayerPosition: (id: number, newPosition: number) => void;
}> = ({ players, updatePlayerPosition }) => {
	// Create Monopoly rectangular cells
	const [cells, setCells] = useState<Cell[]>([]);

	useEffect(() => {
		const boardSize = 6; // 6x6 board, 6 cells per side (including corners)
		const cellWidth = 6; // Cell width
		const cellWithSpacing = cellWidth; // No spacing between cells
		const boardWidth = boardSize * cellWidth; // Total board width - directly use cellWidth
		const halfWidth = boardWidth / 2;

		// Small adjustment to ensure cells are perfectly aligned
		const cornerAdjustment = 0.0;

		const newCells: Cell[] = [];
		let cellId = 0;

		// Create square layout
		// Bottom edge - left to right (including bottom-left and bottom-right corners)
		for (let i = 0; i < boardSize; i++) {
			const x = -halfWidth + cellWidth / 2 + i * cellWidth;
			const z = halfWidth - cellWidth / 2;

			// Determine cell type
			let type: Cell["type"] = "property";
			if (i === 0) type = "start"; // Bottom-left corner is start
			else if (i === boardSize - 1)
				type = "jail"; // Bottom-right corner is jail
			else if (i === Math.floor(boardSize / 2)) type = "railroad";
			else if (i % 2 === 0) type = "chance";
			else type = "utility";

			newCells.push({
				id: cellId++,
				name:
					type === "start"
						? "Start"
						: type === "jail"
						? "Jail"
						: `Location ${cellId}`,
				type,
				position: new THREE.Vector3(x, 0, z),
				rotation: new THREE.Euler(0, Math.PI, 0),
			});
		}

		// Right edge - bottom to top (excluding bottom-right, including top-right)
		for (let i = 1; i < boardSize; i++) {
			const x = halfWidth - cellWidth / 2;
			const z = halfWidth - cellWidth / 2 - i * cellWidth;

			// Determine cell type
			let type: Cell["type"] = "property";
			if (i === boardSize - 1)
				type = "parking"; // Top-right corner is parking
			else if (i === Math.floor(boardSize / 2)) type = "railroad";
			else if (i % 2 === 0) type = "tax";
			else type = "chance";

			newCells.push({
				id: cellId++,
				name: type === "parking" ? "Parking" : `Location ${cellId}`,
				type,
				position: new THREE.Vector3(x, 0, z),
				rotation: new THREE.Euler(0, Math.PI * 1.5, 0),
			});
		}

		// Top edge - right to left (excluding top-right, including top-left)
		for (let i = 1; i < boardSize; i++) {
			const x = halfWidth - cellWidth / 2 - i * cellWidth;
			const z = -halfWidth + cellWidth / 2;

			// Determine cell type
			let type: Cell["type"] = "property";
			if (i === boardSize - 1)
				type = "goToJail"; // Top-left corner is Go To Jail
			else if (i === Math.floor(boardSize / 2)) type = "railroad";
			else if (i % 2 === 0) type = "utility";
			else type = "chance";

			newCells.push({
				id: cellId++,
				name: type === "goToJail" ? "Go To Jail" : `Location ${cellId}`,
				type,
				position: new THREE.Vector3(x, 0, z),
				rotation: new THREE.Euler(0, 0, 0),
			});
		}

		// Left edge - top to bottom (excluding top-left, excluding bottom-left)
		for (let i = 1; i < boardSize - 1; i++) {
			const x = -halfWidth + cellWidth / 2;
			const z = -halfWidth + cellWidth / 2 + i * cellWidth;

			// Determine cell type
			let type: Cell["type"] = "property";
			if (i === Math.floor(boardSize / 2)) type = "railroad";
			else if (i % 2 === 0) type = "tax";
			else type = "chance";

			newCells.push({
				id: cellId++,
				name: `Location ${cellId}`,
				type,
				position: new THREE.Vector3(x, 0, z),
				rotation: new THREE.Euler(0, Math.PI * 0.5, 0),
			});
		}

		setCells(newCells);
	}, []);

	return (
		<group>
			{/* Render all cells */}
			{cells.map((cell) => (
				<CityCell key={cell.id} cell={cell} />
			))}

			{/* Render all player tokens */}
			{cells.length > 0 &&
				players.map((player) => (
					<PlayerToken
						key={player.id}
						player={player}
						cellPositions={cells}
						updatePlayerPosition={updatePlayerPosition}
					/>
				))}
		</group>
	);
};

// 3D dice component
const Dice: React.FC<{ value: number; rolling: boolean }> = ({
	value,
	rolling,
}) => {
	const meshRef = useRef<THREE.Mesh>(null);

	// Use useFrame for animation
	useFrame(() => {
		if (rolling && meshRef.current) {
			// Dice rotation animation
			meshRef.current.rotation.x += 0.2;
			meshRef.current.rotation.y += 0.3;
			meshRef.current.rotation.z += 0.1;
		}
	});

	// Dice face dot position configuration
	const dotPositions = {
		1: [[0, 0]],
		2: [
			[-0.3, -0.3],
			[0.3, 0.3],
		],
		3: [
			[-0.3, -0.3],
			[0, 0],
			[0.3, 0.3],
		],
		4: [
			[-0.3, -0.3],
			[-0.3, 0.3],
			[0.3, -0.3],
			[0.3, 0.3],
		],
		5: [
			[-0.3, -0.3],
			[-0.3, 0.3],
			[0, 0],
			[0.3, -0.3],
			[0.3, 0.3],
		],
		6: [
			[-0.3, -0.3],
			[-0.3, 0],
			[-0.3, 0.3],
			[0.3, -0.3],
			[0.3, 0],
			[0.3, 0.3],
		],
	};

	return (
		<group position={[0, 1, 0]}>
			<mesh ref={meshRef} rotation={[0, 0, 0]}>
				<boxGeometry args={[0.5, 0.5, 0.5]} />
				<meshStandardMaterial color="white" />
			</mesh>

			{/* Show dots on appropriate faces */}
			{/* This part is complex, so simplified implementation */}
		</group>
	);
};

// Modified useDiceRoll function for a 24-cell board
const useDiceRoll = (
	players: Player[],
	setPlayers: React.Dispatch<React.SetStateAction<Player[]>>
) => {
	const [diceValue, setDiceValue] = useState(1);
	const [isRolling, setIsRolling] = useState(false);

	const rollDice = () => {
		// Check if any player is moving
		const anyPlayerMoving = players.some((p) => p.isMoving);
		if (anyPlayerMoving || isRolling) return;

		// Start dice animation
		setIsRolling(true);

		// Simulate dice rolling time
		setTimeout(() => {
			const newDiceValue = Math.floor(Math.random() * 6) + 1;
			setDiceValue(newDiceValue);
			console.log(`Dice result: ${newDiceValue}`);

			setPlayers((currentPlayers) => {
				// Only move the first player as an example
				const updatedPlayers = [...currentPlayers];
				const player = updatedPlayers[0];
				const oldPosition = player.position;

				// Set target position, start movement animation
				// Modified for a total of 24 cells
				const targetPosition = (player.position + newDiceValue) % 24;
				player.targetPosition = targetPosition;
				player.isMoving = true;

				console.log(
					`Player moves from position ${oldPosition} to position ${targetPosition}`
				);

				return updatedPlayers;
			});

			// End dice animation
			setTimeout(() => {
				setIsRolling(false);
			}, 1000);
		}, 1000); // Dice rolls for 1 second
	};

	return { rollDice, diceValue, isRolling };
};

// New omnidirectional sky background component
const SkyBackground = () => {
	// Use drei's Sky component to create dynamic sky
	return (
		<>
			{/* Create a dynamic sky, simulating dusk/night effect */}
			<Sky
				distance={450000}
				sunPosition={[0, 0.05, -1]} // Sun position set near horizon for dusk effect
				inclination={0.1}
				azimuth={0.25}
				mieCoefficient={0.005} // Controls atmospheric scattering effect
				mieDirectionalG={0.8}
				rayleigh={2}
				turbidity={10} // Turbidity - higher values make sky darker
			/>

			{/* Add environment lighting effects */}
			<Environment
				preset="night" // Use preset night environment
				background={false} // Don't override Sky background
			/>

			{/* Add an additional lower night sky gradient effect */}
			<mesh position={[0, -100, 0]} rotation={[-Math.PI / 2, 0, 0]}>
				<planeGeometry args={[1000, 1000]} />
				<meshBasicMaterial
					color="#051630"
					opacity={0.5}
					transparent
					depthWrite={false}
				/>
			</mesh>
		</>
	);
};

// Fixed infinite horizon ground - avoid flickering issues
const InfiniteGround = () => {
	return (
		<>
			{/* Single infinite extending ground - use a huge plane, no extra layers */}
			<mesh
				rotation={[-Math.PI / 2, 0, 0]}
				position={[0, -0.2, 0]} // Adjust ground position to accommodate larger cells
				receiveShadow
			>
				<planeGeometry args={[50000, 50000]} />
				<meshStandardMaterial
					color="#1e6e25"
					roughness={0.8}
					metalness={0.1}
					depthWrite={true}
					polygonOffset={true}
					polygonOffsetFactor={1}
					polygonOffsetUnits={1}
				/>
			</mesh>
			{/* Add fog to enhance horizon effect */}
			<fog attach="fog" args={["#1a3a20", 300, 1200]} /> // Adjusted fog
			distance for better visibility
		</>
	);
};

// Function component that adapts to React Three Fiber pattern
const Board = () => {
	// Simulated player data
	const [players, setPlayers] = useState<Player[]>([
		{
			id: 1,
			name: "Player 1",
			position: 0,
			color: "#FF5252",
			isMoving: false,
		},
		{
			id: 2,
			name: "Player 2",
			position: 0,
			color: "#2196F3",
			isMoving: false,
		},
	]);

	// Function to update player position (called after animation completes)
	const updatePlayerPosition = (playerId: number, newPosition: number) => {
		setPlayers((currentPlayers) =>
			currentPlayers.map((player) =>
				player.id === playerId
					? {
							...player,
							position: newPosition,
							isMoving: false,
							targetPosition: undefined,
					  }
					: player
			)
		);
	};

	const { rollDice, diceValue, isRolling } = useDiceRoll(players, setPlayers);

	// Reference for outline effects
	const [outlineObjects, setOutlineObjects] = useState<THREE.Mesh[]>([]);

	return (
		<div className="relative w-full h-screen">
			<Canvas
				camera={{ position: [0, 45, 45], fov: 45 }} // Adjusted camera height for better view of compact board
				shadows
				gl={{ antialias: true }}
				style={{ width: "100%", height: "100%" }}
			>
				{/* Background */}
				<SkyBackground />

				{/* Infinite extending horizon ground - this is the only ground layer */}
				<InfiniteGround />

				{/* Cartoon style lighting */}
				<ambientLight intensity={0.8} />
				<directionalLight
					position={[5, 15, 5]}
					intensity={1}
					color="#ffffff"
					castShadow
					shadow-mapSize={[2048, 2048]}
				/>
				<directionalLight
					position={[-5, 12, -5]}
					intensity={0.5}
					color="#ffffff"
				/>
				<spotLight
					position={[0, 30, 0]}
					angle={0.3}
					penumbra={0.2}
					intensity={1.5}
					color="#ffffff"
					castShadow
					shadow-mapSize={[2048, 2048]}
				/>

				{/* Monopoly rectangular game board */}
				<CityRoads
					players={players}
					updatePlayerPosition={updatePlayerPosition}
				/>

				{/* Dice */}
				{isRolling && <Dice value={diceValue} rolling={isRolling} />}

				{/* Camera controls */}
				<OrbitControls
					enablePan={true}
					enableZoom={true}
					enableRotate={true}
					minDistance={20} // Increase minimum distance to fit larger board
					maxDistance={150}
					maxPolarAngle={Math.PI / 2 - 0.1}
				/>

				{/* Cartoon style post-processing */}
				<EffectComposer>
					<Outline
						selection={outlineObjects}
						blendFunction={BlendFunction.SCREEN}
						pulseSpeed={0}
						edgeStrength={2.5}
						visibleEdgeColor={0x000000}
						hiddenEdgeColor={0x000000}
					/>
					<Bloom
						intensity={0.5}
						kernelSize={KernelSize.LARGE}
						luminanceThreshold={0.5}
						luminanceSmoothing={0.9}
					/>
				</EffectComposer>
			</Canvas>

			{/* Roll Dice Button - positioned outside Canvas but over it */}
			<div className="absolute bottom-4 left-0 right-0 flex justify-center">
				<button
					onClick={rollDice}
					disabled={isRolling || players.some((p) => p.isMoving)}
					className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg text-xl transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
					style={{ zIndex: 1000 }}
				>
					{isRolling ? "Rolling..." : "Roll Dice"}
				</button>
			</div>

			{/* Game Info Display */}
			<div
				className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-3 rounded-lg"
				style={{ zIndex: 1000 }}
			>
				<h2 className="text-xl font-bold mb-2">Game Info</h2>
				<p>Last Roll: {diceValue}</p>
				<div className="mt-2">
					{players.map((player) => (
						<div key={player.id} className="flex items-center mb-1">
							<div
								className="w-4 h-4 rounded-full mr-2"
								style={{ backgroundColor: player.color }}
							></div>
							<span>
								{player.name}: Position {player.position}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Board;
