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

export const useResultsStore = defineStore("results", () => {
  const dataStore = useDataStore();
  const filterStore = useFilterStore();
  const searchStore = useSearchStore();
  const uiStore = useUIStore();

  // Cache for filtered results
  const filterCache = new LRUCache<string, Card[]>(50);

  const filteredCards = computed(() => {
    const cards = dataStore.cards;
    if (!cards.length) return [];

    // 1. Apply episode filters
    const filters = filterStore.activeFilters;
    const cacheKey = JSON.stringify({
      mygo: Array.from(filters.mygo),
      avemujica: Array.from(filters.avemujica),
    });

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
      });
      filterCache.set(cacheKey, filtered);
    }

    // 2. Apply text search
    if (searchStore.normalizedQuery) {
      filtered = filtered.filter(card =>
        normalizeText(card.text).includes(searchStore.normalizedQuery)
      );
    }

    // 3. Apply reverse if needed
    return uiStore.isReversed ? [...filtered].reverse() : filtered;
  });

  return {
    filteredCards
  };
});
