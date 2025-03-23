// import { Room } from "@/types/game";

// // Generate a random date within the last 24 hours
// const getRandomRecentDate = (): string => {
// 	const now = new Date();
// 	const hoursAgo = Math.floor(Math.random() * 24);
// 	const minutesAgo = Math.floor(Math.random() * 60);
// 	now.setHours(now.getHours() - hoursAgo);
// 	now.setMinutes(now.getMinutes() - minutesAgo);
// 	return now.toISOString();
// };

// // Generate a random room name
// const getRandomRoomName = (): string => {
// 	const adjectives = [
// 		"Epic",
// 		"Awesome",
// 		"Cool",
// 		"Super",
// 		"Mega",
// 		"Ultimate",
// 		"Extreme",
// 		"Fantastic",
// 		"Amazing",
// 		"Incredible",
// 	];

// 	const nouns = [
// 		"Game",
// 		"Match",
// 		"Battle",
// 		"Challenge",
// 		"Tournament",
// 		"Competition",
// 		"Showdown",
// 		"Duel",
// 		"Contest",
// 		"Clash",
// 	];

// 	const randomAdjective =
// 		adjectives[Math.floor(Math.random() * adjectives.length)];
// 	const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

// 	return `${randomAdjective} ${randomNoun}`;
// };

// // Generate a random player name
// const getRandomPlayerName = (): string => {
// 	const prefixes = [
// 		"Cool",
// 		"Pro",
// 		"Master",
// 		"Epic",
// 		"Super",
// 		"Mega",
// 		"Ultra",
// 		"Hyper",
// 		"Extreme",
// 		"Legend",
// 	];

// 	const suffixes = [
// 		"Player",
// 		"Gamer",
// 		"Winner",
// 		"Champion",
// 		"Hero",
// 		"Warrior",
// 		"Knight",
// 		"Wizard",
// 		"Ninja",
// 		"Samurai",
// 	];

// 	const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
// 	const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
// 	const randomNumber = Math.floor(Math.random() * 1000);

// 	return `${randomPrefix}${randomSuffix}${randomNumber}`;
// };

// // Generate a list of mock rooms
// export const generateMockRooms = (count: number = 10): Room[] => {
// 	const rooms: Room[] = [];

// 	for (let i = 0; i < count; i++) {
// 		const id = `ROOM${Math.random()
// 			.toString(36)
// 			.substring(2, 8)
// 			.toUpperCase()}`;
// 		const roomId = `ROOM${Math.random()
// 			.toString(36)
// 			.substring(2, 8)
// 			.toUpperCase()}`;
// 		const isCreator = Math.random() > 0.5;
// 		const address = getRandomPlayerName();
// 		const clientId = getRandomPlayerName();
// 		const createdAt = getRandomRecentDate();

// 		// Generate 1-4 players
// 		const playerCount = Math.floor(Math.random() * 4) + 1;
		

// 		// Add additional players if needed
// 		for (let j = 1; j < playerCount; j++) {
// 			players.push(getRandomPlayerName());
// 		}

// 		rooms.push({
// 			id,
// 			roomId,
// 			isCreator,
// 			address,
// 			clientId,
// 			createdAt,
// 		});
// 	}

// 	return rooms;
// };

// // Export a set of mock rooms
// export const mockRooms: Room[] = generateMockRooms(12);
