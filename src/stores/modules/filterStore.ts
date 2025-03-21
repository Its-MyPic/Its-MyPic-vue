import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { debounce } from "@/utils/debounce";
import type { FilterOptions } from "@/types/card";
import { Season, EPISODES } from "@/constants/filters";

export const useFilterStore = defineStore("filter", () => {
  const mygoEpisodes = ref<number[]>([]);
  const avemujicaEpisodes = ref<number[]>([]);
  const characterId = ref<number>(0);

  // Convert array-based episode lists to Sets for O(1) lookup
  const activeFilters = computed<FilterOptions>(() => ({
    mygo: new Set(mygoEpisodes.value),
    avemujica: new Set(avemujicaEpisodes.value),
    character: characterId.value
  }));

  // URL sync
  const updateFilterParams = () => {
    const url = new URL(window.location.href);
    
    // Calculate episode bitmap
    let ep = 0;
    mygoEpisodes.value.forEach(episode => {
      ep |= 1 << (episode - 1);
    });
    avemujicaEpisodes.value.forEach(episode => {
      ep |= 1 << (episode + 12);
    });

    if (ep === 0) {
      url.searchParams.delete("ep");
    } else {
      url.searchParams.set("ep", ep.toString());
    }

    window.history.pushState({}, "", url.toString());
  };

  // Initialize from URL
  const initFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const epParam = params.get("ep");

    if (epParam) {
      const ep = parseInt(epParam);
      
      // Extract MyGO episodes (bits 0-12)
      const mygoEps = EPISODES[Season.MYGO].filter(i => 
        (ep & (1 << (i - 1))) !== 0
      );
      
      // Extract Ave Mujica episodes (bits 13-20)
      const avemujicaEps = EPISODES[Season.AVE_MUJICA].filter(i => 
        (ep & (1 << (i + 12))) !== 0
      );

      mygoEpisodes.value = mygoEps;
      avemujicaEpisodes.value = avemujicaEps;
    }
  };

  // Watch for changes and update URL
  watch(
    [mygoEpisodes, avemujicaEpisodes],
    debounce(() => updateFilterParams(), 300)
  );

  return {
    mygoEpisodes,
    avemujicaEpisodes,
    characterId,
    activeFilters,
    initFromUrl
  };
});
