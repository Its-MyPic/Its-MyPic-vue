import { defineStore } from "pinia";
import { computed } from "vue";
import { useDataStore } from "./dataStore";
import { useFilterStore } from "./filterStore";
import { useSearchStore } from "./searchStore";
import { useUIStore } from "./uiStore";
import { LRUCache } from "@/utils/lruCache";
import { normalizeText } from "@/utils/textNormalization";
import type { Card } from "@/types/card";
import { Season } from "@/constants/filters";

// 擴展 Card 類型以增加正規化文本屬性
declare module '@/types/card' {
  interface Card {
    normalizedText?: string;
  }
}

export const useResultsStore = defineStore("results", () => {
  const dataStore = useDataStore();
  const filterStore = useFilterStore();
  const searchStore = useSearchStore();
  const uiStore = useUIStore();

  // Cache for filtered results
  const filterCache = new LRUCache<string, Card[]>(50);
  // 搜索結果快取
  const searchCache = new LRUCache<string, Card[]>(50);

  // 優化快取鍵生成
  const getFilterCacheKey = (filters: any) => {
    const mygo = Array.from(filters.mygo).sort().join(',');
    const avemujica = Array.from(filters.avemujica).sort().join(',');
    return `mygo:${mygo}|avemujica:${avemujica}`;
  };

  // 預先正規化文本
  const ensureNormalizedText = (cards: Card[]) => {
    for (const card of cards) {
      if (card.text && !card.normalizedText) {
        card.normalizedText = normalizeText(card.text);
      }
    }
    return cards;
  };

  const filteredCards = computed(() => {
    const originalCards = dataStore.cards;
    if (!originalCards.length) return [];

    // 確保所有卡片都有正規化文本並建立新陣列
    const cards = ensureNormalizedText([...originalCards]);

    // 1. 應用過濾器
    const filters = filterStore.activeFilters;
    const cacheKey = getFilterCacheKey(filters);

    let filtered: Card[];
    if (filterCache.has(cacheKey)) {
      filtered = filterCache.get(cacheKey)!;
    } else {
      filtered = cards.filter(card => {
        if (filters.mygo.size && card.season === Season.MYGO) {
          return filters.mygo.has(card.episode);
        }
        if (filters.avemujica.size && card.season === Season.AVE_MUJICA) {
          return filters.avemujica.has(card.episode);
        }
        return filters.mygo.size === 0 && filters.avemujica.size === 0;
        
        // FUTURE-FEATURE: 當實現角色篩選功能時，需要在此加入角色篩選邏輯
        // 例如: && (filters.character === 0 || card.character === filters.character)
      });
      filterCache.set(cacheKey, filtered);
    }

    // 2. 應用文本搜索 - 使用多級快取
    if (searchStore.normalizedQuery) {
      const searchCacheKey = `${cacheKey}:search:${searchStore.normalizedQuery}`;
      
      if (searchCache.has(searchCacheKey)) {
        filtered = searchCache.get(searchCacheKey)!;
      } else {
        // 使用預先正規化的文本
        const searchResults = filtered.filter(card =>
          card.normalizedText?.includes(searchStore.normalizedQuery)
        );
        searchCache.set(searchCacheKey, searchResults);
        filtered = searchResults;
      }
    }

    // 3. 應用 reverse
    return uiStore.isReversed ? [...filtered].reverse() : filtered;
  });

  return {
    filteredCards
  };
});
