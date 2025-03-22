import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { FilterOptions } from "@/types/card";
import { Season, EPISODES } from "@/constants/filters";

export const useFilterStore = defineStore("filter", () => {
  // Parse initial episodes from URL
  const parseInitialEpisodes = () => {
    const epParam = new URLSearchParams(window.location.search).get("ep");
    if (!epParam) return { mygo: [], avemujica: [] };

    const ep = parseInt(epParam);
    
    // Extract MyGO episodes (bits 0-12)
    const mygoEps = EPISODES[Season.MYGO].filter(i => 
      (ep & (1 << (i - 1))) !== 0
    );
    
    // Extract Ave Mujica episodes (bits 13-20)
    const avemujicaEps = EPISODES[Season.AVE_MUJICA].filter(i => 
      (ep & (1 << (i + 12))) !== 0
    );

    return { mygo: mygoEps, avemujica: avemujicaEps };
  };

  const initialEpisodes = parseInitialEpisodes();
  
  // Buffer狀態 - 直接接收用戶操作
  const mygoEpisodesBuffer = ref<number[]>([...initialEpisodes.mygo]);
  const avemujicaEpisodesBuffer = ref<number[]>([...initialEpisodes.avemujica]);
  const characterIdBuffer = ref<number>(0); // FUTURE-FEATURE: 角色篩選相關代碼
  
  // 計算狀態 - 經過flush後更新，用於實際查詢
  const mygoEpisodes = ref<number[]>([...initialEpisodes.mygo]);
  const avemujicaEpisodes = ref<number[]>([...initialEpisodes.avemujica]);
  const characterId = ref<number>(0); // FUTURE-FEATURE: 角色篩選相關代碼

  // Convert array-based episode lists to Sets for O(1) lookup
  const activeFilters = computed<FilterOptions>(() => ({
    mygo: new Set(mygoEpisodes.value),
    avemujica: new Set(avemujicaEpisodes.value),
    character: characterId.value // FUTURE-FEATURE: 角色篩選相關代碼
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

  // 手動觸發更新函數
  const flush = () => {
    mygoEpisodes.value = [...mygoEpisodesBuffer.value];
    avemujicaEpisodes.value = [...avemujicaEpisodesBuffer.value];
    characterId.value = characterIdBuffer.value;
    updateFilterParams();
  };

  return {
    // Buffer狀態 - 用於UI交互
    mygoEpisodesBuffer,
    avemujicaEpisodesBuffer,
    characterIdBuffer,
    
    // 計算狀態 - 用於查詢和過濾
    mygoEpisodes,
    avemujicaEpisodes,
    characterId,
    activeFilters,
    
    // 手動觸發更新
    flush
  };
});
