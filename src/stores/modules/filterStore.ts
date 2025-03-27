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
    const mygoEps = EPISODES.filter((i) => (ep & (1 << (i - 1))) !== 0);

    // Extract Ave Mujica episodes (bits 13-20)
    const avemujicaEps = EPISODES.filter((i) => (ep & (1 << (i + 12))) !== 0);

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
    character: characterId.value, // FUTURE-FEATURE: 角色篩選相關代碼
  }));

  // 輔助函數：比較兩個數組是否相等
  function arraysEqual(a: number[], b: number[]): boolean {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort((x, y) => x - y);
    const sortedB = [...b].sort((x, y) => x - y);
    return sortedA.every((val, idx) => val === sortedB[idx]);
  }

  // URL sync with state comparison
  const updateFilterParams = () => {
    const url = new URL(window.location.href);

    // Calculate episode bitmap
    let ep = 0;
    mygoEpisodes.value.forEach((episode) => {
      ep |= 1 << (episode - 1);
    });
    avemujicaEpisodes.value.forEach((episode) => {
      ep |= 1 << (episode + 12);
    });

    // 檢查是否有實際變化
    const currentEp = url.searchParams.get("ep");
    const newEpString = ep === 0 ? null : ep.toString();

    if (currentEp === newEpString) {
      console.debug("Filter params unchanged, skip updating URL");
      return false; // 無變化，不更新URL
    }

    // 更新URL參數
    if (ep === 0) {
      url.searchParams.delete("ep");
    } else {
      url.searchParams.set("ep", ep.toString());
    }

    window.history.pushState({}, "", url.toString());
    return true; // 有變化，已更新URL
  };

  // 手動觸發更新函數
  const flush = () => {
    // 檢查buffer與當前計算狀態是否相同
    const isMygoEqual = arraysEqual(
      mygoEpisodesBuffer.value,
      mygoEpisodes.value,
    );
    const isAvemujicaEqual = arraysEqual(
      avemujicaEpisodesBuffer.value,
      avemujicaEpisodes.value,
    );
    const isCharacterEqual = characterIdBuffer.value === characterId.value;

    // 如果所有值都相同，則無需更新
    if (isMygoEqual && isAvemujicaEqual && isCharacterEqual) {
      console.debug("Filter state unchanged, skip updating");
      return false; // 返回false表示沒有變化
    }

    // 更新計算狀態
    mygoEpisodes.value = [...mygoEpisodesBuffer.value];
    avemujicaEpisodes.value = [...avemujicaEpisodesBuffer.value];
    characterId.value = characterIdBuffer.value;

    // 更新URL
    updateFilterParams();
    return true; // 返回true表示有變化
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
    flush,

    // 從URL解析episodes
    parseInitialEpisodes,
  };
});
