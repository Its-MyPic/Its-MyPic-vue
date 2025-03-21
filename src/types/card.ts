import { data } from "@/plugins/data";
import type { Nullable } from "./common";
import { Season } from "@/constants/filters";

/**
 * 幀資訊介面
 */
export interface Frame {
  start: number;
  prefer: number;
  end: number;
}

/**
 * 卡片基礎介面，擴展自 protobuf 生成的 Info
 */
export interface Card extends Omit<data.Info, 'season' | 'frameStart' | 'framePrefer' | 'frameEnd'> {
  season: Season;
  frame: Frame;
  toJSON(): Record<string, unknown>;
}

/**
 * 過濾選項介面
 */
export interface FilterOptions {
  mygo: Set<number>;
  avemujica: Set<number>;
  character?: Nullable<number>;
}

/**
 * 型別保護函數
 */
export function isCard(value: unknown): value is Card {
  if (!value || typeof value !== 'object') return false;
  
  const card = value as Partial<Card>;
  return (
    typeof card.text === 'string' &&
    typeof card.season === 'number' &&
    typeof card.episode === 'number' &&
    typeof card.frame?.start === 'number' &&
    typeof card.frame?.prefer === 'number' &&
    typeof card.frame?.end === 'number' &&
    typeof card.toJSON === 'function'
  );
}

/**
 * 轉換函數：從 IInfo 到 Card
 */
export function infoToCard(info: data.IInfo): Card {
  const card = {
    text: info.text || '',
    season: (info.season || 0) as Season,
    episode: info.episode || 0,
    segmentId: info.segmentId || 0,
    frame: {
      start: info.frameStart || 0,
      prefer: info.framePrefer || 0,
      end: info.frameEnd || 0
    }
  };

  return {
    ...card,
    toJSON() {
      return {
        ...card,
        frame: { ...card.frame }
      };
    }
  };
}
