import { defineStore } from "pinia";
import { computed, watch } from "vue";
import { useDataStore } from "./dataStore";
import { useFilterStore } from "./filterStore";
import { useSearchStore } from "./searchStore";
import { useUIStore } from "./uiStore";
import { LRUCache } from "@/utils/lruCache";
import type { Card, FilterOptions } from "@/types/card";
import { Season } from "@/constants/filters";

export const useResultsStore = defineStore("results", () => {
  const dataStore = useDataStore();
  const filterStore = useFilterStore();
  const searchStore = useSearchStore();
  const uiStore = useUIStore();

  // Cache for filtered results
  const filterCache = new LRUCache<string, Card[]>(50);
  // 搜索結果快取
  const searchCache = new LRUCache<string, Card[]>(50);

  let charIndex: Map<string, Set<Card>> | null = null;

  const buildCharIndex = (cards: readonly Card[]) => {
    const index = new Map<string, Set<Card>>();
    for (const card of cards) {
      const text = card.normalizedText;
      if (!text) continue;
      for (const ch of text) {
        let set = index.get(ch);
        if (!set) {
          set = new Set();
          index.set(ch, set);
        }
        set.add(card);
      }
    }
    return index;
  };

  const searchByCharIndex = (cards: Card[], query: string): Card[] => {
    if (!charIndex) charIndex = buildCharIndex(dataStore.cards);

    const chars = [...new Set(query)];
    let candidates: Set<Card> | null = null;
    for (const ch of chars) {
      const set = charIndex.get(ch);
      if (!set) return [];
      if (candidates === null) {
        candidates = set;
      } else {
        const next = new Set<Card>();
        for (const card of candidates) {
          if (set.has(card)) next.add(card);
        }
        candidates = next;
        if (candidates.size === 0) return [];
      }
    }
    if (candidates === null) return [];

    const result: Card[] = [];
    for (const card of cards) {
      if (candidates.has(card) && card.normalizedText?.includes(query)) {
        result.push(card);
      }
    }
    return result;
  };

  // 資料載入或重新載入時清空快取，避免回傳舊結果
  watch(() => dataStore.cards, () => {
    filterCache.clear();
    searchCache.clear();
    charIndex = null;
  });

  // 優化快取鍵生成
  const getFilterCacheKey = (filters: FilterOptions) => {
    const mygo = Array.from(filters.mygo).sort().join(',');
    const avemujica = Array.from(filters.avemujica).sort().join(',');
    return `mygo:${mygo}|avemujica:${avemujica}`;
  };

  const filteredCards = computed(() => {
    const originalCards = dataStore.cards;
    if (!originalCards.length) return [];

    // 1. 應用過濾器
    const filters = filterStore.activeFilters;
    const cacheKey = getFilterCacheKey(filters);

    let filtered: Card[];
    if (filterCache.has(cacheKey)) {
      filtered = filterCache.get(cacheKey)!;
    } else {
      filtered = originalCards.filter(card => {
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
        const searchResults = searchByCharIndex(filtered, searchStore.normalizedQuery);
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
