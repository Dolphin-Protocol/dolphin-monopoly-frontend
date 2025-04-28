// 游戏房间信息类型
export interface ApiRoomInfo {
  roomId: string;
  gameId: string;
  gameState: "started" | "waiting" | "ended"; // 可根据实际情况扩展
}

// 玩家状态类型
export interface ApiPlayerState {
  address: string;
  balance: number;
  position: number;
}

// 价格类型
export interface ApiPriceLevel {
  level: number;
  price: string;
}

// 房产单元类型
export interface ApiPropertyCell {
  id: string;
  owner: string | null;
  level: number;
  position: number;
  buyPrice: ApiPriceLevel[];
  sellPrice: ApiPriceLevel[];
  rentPrice: ApiPriceLevel[];
}

// 非房产单元类型（如起点、事件格等）
export interface ApiNonPropertyCell {
  id: string;
  position: number;
}

// 联合类型表示任意单元格
export type ApiHouseCell = ApiPropertyCell | ApiNonPropertyCell;

// 完整的房间数据类型
export interface ApiRoomData {
  roomInfo: ApiRoomInfo;
  playersState: ApiPlayerState[];
  houseCell: ApiHouseCell[];
}