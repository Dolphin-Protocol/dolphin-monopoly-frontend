import { ApiRoomData } from "@/types/socket";
export const mockRoomData: ApiRoomData = {
	roomInfo: {
		roomId: "3e8a1ef2-52e7-4770-b480-d5db19818031",
		gameId: "0x386d711a2928f37c2831db8936a244f60727ebedab5427065db1a70d559768b2",
		gameState: "started",
	},
	playersState: {
		"0x56562324e35bd4b84f0ef3d6bd0b9b7ec6b1584d37731990c36e2848bcacd659": {
			balance: 2000,
			position: 0,
		},
		"0x7c0bf358836ef1232b662095a306f231034a6ec028dbaa1d7bc960bab59378db": {
			balance: 2000,
			position: 0,
		},
		"0xfd198685e74aea79cf161b85b8bc96d940b7e24d7429e8dd8eaba8ab76309327": {
			balance: 2000,
			position: 0,
		},
		"0x8920ed1257a788ab0978f684e71df503f43b6b8bd484167cc486fda033333aee": {
			balance: 2000,
			position: 0,
		},
	},
	houseCell: [
		{
			id: "0x3aa7390fb97913888f529ad4a5dc8a1fdb678581657ebf0fd0c8897714ac538a",
			position: 0,
		},
		{
			id: "0xc8f8d84ff36329addec84b32a95b47c36c581ea9c5e77e68b2c2f71c7116287b",
			owner: "0x56562324e35bd4b84f0ef3d6bd0b9b7ec6b1584d37731990c36e2848bcacd659",
			level: 1,
			position: 1,
			buyPrice: [
				{ level: 1, price: "20" },
				{ level: 2, price: "60" },
				{ level: 3, price: "180" },
			],
			sellPrice: [
				{ level: 1, price: "10" },
				{ level: 2, price: "30" },
				{ level: 3, price: "90" },
			],
			rentPrice: [
				{ level: 1, price: "30" },
				{ level: 2, price: "90" },
				{ level: 3, price: "270" },
			],
		},
		{
			id: "0x1a17266e6e4df36d1e892959953259501091ac9ad69c8e76c610bfe12927d56e",
			owner: "0x7c0bf358836ef1232b662095a306f231034a6ec028dbaa1d7bc960bab59378db",
			level: 1,
			position: 2,
			buyPrice: [
				{ level: 1, price: "30" },
				{ level: 2, price: "90" },
				{ level: 3, price: "270" },
			],
			sellPrice: [
				{ level: 1, price: "15" },
				{ level: 2, price: "45" },
				{ level: 3, price: "135" },
			],
			rentPrice: [
				{ level: 1, price: "45" },
				{ level: 2, price: "135" },
				{ level: 3, price: "405" },
			],
		},
		{
			id: "0xc43f773373bd588e3322e0d97aff1eacc541d6b68efeb4bb460049482cb0457e",
			owner: null,
			level: 0,
			position: 3,
			buyPrice: [
				{ level: 1, price: "30" },
				{ level: 2, price: "90" },
				{ level: 3, price: "270" },
			],
			sellPrice: [
				{ level: 1, price: "15" },
				{ level: 2, price: "45" },
				{ level: 3, price: "135" },
			],
			rentPrice: [
				{ level: 1, price: "45" },
				{ level: 2, price: "135" },
				{ level: 3, price: "405" },
			],
		},
		{
			id: "0xe48374b5c57abf0f9725a5238e40c1354e3cd9cef47385bfc54d6be818941f04",
			position: 4,
		},
		{
			id: "0x544822e704fa5f7eb86515b0af74e598d972c0c2052afffdec37f15c82d43bcb",
			owner: null,
			level: 0,
			position: 5,
			buyPrice: [
				{ level: 1, price: "50" },
				{ level: 2, price: "150" },
				{ level: 3, price: "450" },
			],
			sellPrice: [
				{ level: 1, price: "25" },
				{ level: 2, price: "75" },
				{ level: 3, price: "225" },
			],
			rentPrice: [
				{ level: 1, price: "75" },
				{ level: 2, price: "225" },
				{ level: 3, price: "675" },
			],
		},
		{
			id: "0x8108f8a514cb773e9f323b9c7137ce05d70961884278cec12798ecce33330752",
			owner: null,
			level: 0,
			position: 6,
			buyPrice: [
				{ level: 1, price: "50" },
				{ level: 2, price: "150" },
				{ level: 3, price: "450" },
			],
			sellPrice: [
				{ level: 1, price: "25" },
				{ level: 2, price: "75" },
				{ level: 3, price: "225" },
			],
			rentPrice: [
				{ level: 1, price: "75" },
				{ level: 2, price: "225" },
				{ level: 3, price: "675" },
			],
		},
		{
			id: "0x98322d1f7bab6cbe235a1840ff0392f0d98b62f22e7fd08be419c0c0c521caf1",
			owner: null,
			level: 0,
			position: 7,
			buyPrice: [
				{ level: 1, price: "60" },
				{ level: 2, price: "180" },
				{ level: 3, price: "500" },
			],
			sellPrice: [
				{ level: 1, price: "30" },
				{ level: 2, price: "90" },
				{ level: 3, price: "250" },
			],
			rentPrice: [
				{ level: 1, price: "90" },
				{ level: 2, price: "270" },
				{ level: 3, price: "750" },
			],
		},
		{
			id: "0xa5b094412828a9fe0e50ad98c0220add3c0553db4ddb63e607f0b955c8777a03",
			position: 8,
		},
		{
			id: "0x7762141e1d0c1fff012eba6ef5d9acd681822a0541f212dab989f270b80c6167",
			owner: null,
			level: 0,
			position: 9,
			buyPrice: [
				{ level: 1, price: "70" },
				{ level: 2, price: "200" },
				{ level: 3, price: "550" },
			],
			sellPrice: [
				{ level: 1, price: "35" },
				{ level: 2, price: "100" },
				{ level: 3, price: "275" },
			],
			rentPrice: [
				{ level: 1, price: "105" },
				{ level: 2, price: "300" },
				{ level: 3, price: "825" },
			],
		},
		{
			id: "0x815e1783edbf4878c16d74059d59fd49297b2f2c73c463f1d3029c0d2d1e4fb4",
			owner: null,
			level: 0,
			position: 10,
			buyPrice: [
				{ level: 1, price: "80" },
				{ level: 2, price: "220" },
				{ level: 3, price: "600" },
			],
			sellPrice: [
				{ level: 1, price: "40" },
				{ level: 2, price: "110" },
				{ level: 3, price: "300" },
			],
			rentPrice: [
				{ level: 1, price: "120" },
				{ level: 2, price: "330" },
				{ level: 3, price: "900" },
			],
		},
		{
			id: "0x2b20cc79c76310f111764a3fd5d8c987fb03da43f0bbf22cc5c3a1d4da991ee7",
			owner: null,
			level: 0,
			position: 11,
			buyPrice: [
				{ level: 1, price: "90" },
				{ level: 2, price: "250" },
				{ level: 3, price: "700" },
			],
			sellPrice: [
				{ level: 1, price: "45" },
				{ level: 2, price: "125" },
				{ level: 3, price: "350" },
			],
			rentPrice: [
				{ level: 1, price: "135" },
				{ level: 2, price: "375" },
				{ level: 3, price: "1050" },
			],
		},
	],
};
