<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue";
import { useDataStore, useSearchStore, useFilterStore } from "@/stores";

const dataStore = useDataStore();
const searchStore = useSearchStore();
const filterStore = useFilterStore();

// 處理瀏覽器歷史導航
const handlePopState = () => {
  // 從URL更新搜索查詢
  const q = new URLSearchParams(window.location.search).get("q") || "";
  searchStore.queryBuffer = q;
  searchStore.query = q;
  
  // 從URL更新過濾器
  const initialEpisodes = filterStore.parseInitialEpisodes();
  filterStore.mygoEpisodes = [...initialEpisodes.mygo];
  filterStore.avemujicaEpisodes = [...initialEpisodes.avemujica];
  filterStore.mygoEpisodesBuffer = [...initialEpisodes.mygo];
  filterStore.avemujicaEpisodesBuffer = [...initialEpisodes.avemujica];
};

onMounted(async () => {
  // Fetch initial data
  await dataStore.fetchCards();
  
  // 添加瀏覽器歷史導航監聽
  window.addEventListener('popstate', handlePopState);
});

onUnmounted(() => {
  // 移除事件監聽器
  window.removeEventListener('popstate', handlePopState);
});
</script>
